#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""context.py — mechanics for bmad-project-context.

One core runtime script (memlog.py lineage): everything mechanical about a project's
context bundle so no LLM ever guesses at mechanical facts. The bundle lives at the
project's `project_knowledge` folder (default `docs/`); the script manages only files
bearing conformant frontmatter and never touches foreign files.

Commands (all accept --json):
  validate [root]            frontmatter + link + index check; exit 1 on findings
  index [root]               regenerate index.md (refuses to overwrite a foreign one)
  sweep [root] [--today D]   staleness report (stale_after passed; sources drifted)
  resolve <name> [--refresh] cross-project resolution: self > workspace > cache > remote
  compass <path> [root]      nearest compass file covering a repo-relative path
  sync                       materialize kernel/compass blocks into AGENTS.md files
                             (only under the agent-files/both placement)
  bootstrap                  copy this script to {project-root}/_bmad/scripts/context.py
"""
import argparse
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

INDEX_MARKER = "<!-- bmad:context index — generated; do not edit -->"
BLOCK_START = "<!-- bmad:context -->"
BLOCK_END = "<!-- /bmad:context -->"
REGISTRY_FILE = "registry.yaml"
REGISTRY_KEY = "bmad_obeya_registry"
DEFAULT_KNOWLEDGE = "docs"


def fail(msg, code=1):
    print(msg, file=sys.stderr)
    sys.exit(code)


def emit(data, as_json, human=""):
    if as_json:
        print(json.dumps(data))
    elif human:
        print(human)


# ── config ───────────────────────────────────────────────────────────────────
# One resolution, shared by every command. Delegates to the installed BMad
# resolver (resolve_config.py, four-layer TOML merge) whenever it is present so
# script and platform can never disagree; falls back to a native TOML merge,
# then legacy YAML files, then defaults.

CONFIG_KEYS = ("project_name", "project_knowledge", "output_folder",
               "context_placement", "obeya_remote", "user_name",
               "communication_language", "document_output_language")
CONFIG_DEFAULTS = {"project_knowledge": DEFAULT_KNOWLEDGE, "output_folder": "_bmad-output"}
TOML_LAYERS = ("_bmad/config.toml", "_bmad/config.user.toml",
               "_bmad/custom/config.toml", "_bmad/custom/config.user.toml")
YAML_LAYERS = ("_bmad/config.yaml", "_bmad/bmm/config.yaml",
               "_bmad/bmm/config.user.yaml", "_bmad/context.yaml")

try:
    import tomllib
except ImportError:  # Python 3.10: TOML layers skipped, YAML fallback still works
    tomllib = None


def _installed_resolver_config(project_root: Path):
    resolver = project_root / "_bmad" / "scripts" / "resolve_config.py"
    if not (resolver.exists() and (project_root / "_bmad" / "config.toml").exists()):
        return None
    proc = subprocess.run(
        [sys.executable, str(resolver), "--project-root", str(project_root)],
        capture_output=True, text=True)
    if proc.returncode != 0:
        return None
    try:
        data = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return None
    return {k: v for k, v in data.items() if isinstance(v, (str, int, bool))}


def _toml_chain(project_root: Path):
    if tomllib is None or not (project_root / TOML_LAYERS[0]).exists():
        return None
    merged = {}
    for rel in TOML_LAYERS:
        f = project_root / rel
        if not f.exists():
            continue
        try:
            with f.open("rb") as fh:
                layer = tomllib.load(fh)
        except (tomllib.TOMLDecodeError, OSError):
            continue
        merged.update({k: v for k, v in layer.items() if isinstance(v, (str, int, bool))})
    return merged


def _yaml_chain(project_root: Path):
    merged = {}
    for rel in YAML_LAYERS:  # later layers win per key
        f = project_root / rel
        if not f.exists():
            continue
        for line in f.read_text(encoding="utf-8").splitlines():
            m = re.match(r"^([A-Za-z_][\w-]*):\s*(.+?)\s*$", line)
            if m:
                merged[m.group(1)] = m.group(2).strip("'\"")
    return merged


def resolve_full_config(project_root: Path) -> dict:
    cfg = (_installed_resolver_config(project_root)
           or _toml_chain(project_root)
           or {})
    for k, v in _yaml_chain(project_root).items():
        cfg.setdefault(k, v)  # YAML fills gaps (e.g. standalone context_placement), never overrides TOML
    for k, v in CONFIG_DEFAULTS.items():
        cfg.setdefault(k, v)
    return cfg


def bundle_root(project_root: Path, override: str | None, cfg: dict) -> Path:
    raw = override or str(cfg.get("project_knowledge", DEFAULT_KNOWLEDGE))
    raw = raw.replace("{project-root}/", "").replace("{project-root}", "")
    return (project_root / raw) if not Path(raw).is_absolute() else Path(raw)


def cmd_config(args, project_root, cfg, as_json):
    out = {k: cfg.get(k) for k in CONFIG_KEYS}
    out["bundle_root"] = str(bundle_root(project_root, None, cfg))
    emit(out, as_json, "\n".join(f"{k}: {v}" for k, v in out.items() if v is not None))


# ── frontmatter ──────────────────────────────────────────────────────────────

def parse_frontmatter(text: str):
    """Returns (fields|None, error|None, body). Naive flat YAML subset."""
    if not text.startswith("---\n"):
        return None, None, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return None, "unparseable frontmatter (no closing fence)", ""
    fields = {}
    for line in text[4:end].splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        m = re.match(r"^([A-Za-z_][\w-]*):\s*(.*?)\s*$", line)
        if not m:
            return None, "unparseable frontmatter", ""
        key, val = m.group(1), m.group(2)
        if val.startswith("[") and val.endswith("]"):
            fields[key] = [v.strip().strip("'\"") for v in val[1:-1].split(",") if v.strip()]
        else:
            fields[key] = re.split(r"\s+#", val)[0].strip().strip("'\"")
    return fields, None, text[end + 5:]


def load_entries(root: Path):
    """Conformant entries at the bundle root: (path, fields|None, error|None, body)."""
    out = []
    if not root.is_dir():
        return out
    for f in sorted(root.glob("*.md")):
        if f.name in ("kernel.md", "index.md"):
            continue
        fields, err, body = parse_frontmatter(f.read_text(encoding="utf-8"))
        if fields is None and err is None:
            continue  # foreign file: no frontmatter
        if fields is not None and "type" not in fields and "title" not in fields:
            continue  # foreign file: frontmatter but not ours
        out.append((f, fields, err, body))
    return out


def load_compasses(root: Path):
    out = []
    cdir = root / "compass"
    if not cdir.is_dir():
        return out
    for f in sorted(cdir.glob("*.md")):
        fields, err, body = parse_frontmatter(f.read_text(encoding="utf-8"))
        out.append((f, fields or {}, err, body))
    return out


def trust_of(fields: dict) -> str:
    return "verified" if "verified" in fields else "generated"


def index_rows(entries):
    rows = []
    for f, fields, err, _ in entries:
        if err or not fields or "type" not in fields or "title" not in fields:
            continue
        rows.append(f"- [{fields['title']}]({f.name}) — {fields.get('description', '')} "
                    f"({fields['type']}, {trust_of(fields)})")
    return rows


def render_index(entries) -> str:
    return INDEX_MARKER + "\n\n" + "\n".join(index_rows(entries)) + "\n"


# ── validate ─────────────────────────────────────────────────────────────────

def cmd_validate(args, project_root, cfg, as_json):
    root = bundle_root(project_root, args.root, cfg)
    findings = []
    entries = load_entries(root)
    for f, fields, err, body in entries:
        rel = f.name
        if err:
            findings.append({"file": rel, "issue": err})
            continue
        for req in ("type", "title", "description"):
            if req not in fields:
                findings.append({"file": rel, "issue": f"missing required field: {req}"})
        has_v, has_g = "verified" in fields, "generated" in fields
        if has_v == has_g:
            findings.append({"file": rel, "issue":
                             "exactly one of verified/generated is required"})
        for m in re.finditer(r"\[[^\]]*\]\(([^)]+)\)", body):
            target = m.group(1)
            if target.startswith(("http://", "https://", "#")) or not target.endswith(".md"):
                continue
            if not (f.parent / target).exists():
                findings.append({"file": rel, "issue": f"dangling link: {target}"})
    for f, fields, err, _ in load_compasses(root):
        rel = f"compass/{f.name}"
        if err:
            findings.append({"file": rel, "issue": err})
        elif "area" not in fields:
            findings.append({"file": rel, "issue": "missing required field: area"})
    idx = root / "index.md"
    listable = {f.name for f, fields, err, _ in entries
                if not err and fields and "type" in fields and "title" in fields}
    if not idx.exists():
        if listable:
            findings.append({"file": "index.md", "issue": "index.md missing — run: index"})
    else:
        text = idx.read_text(encoding="utf-8")
        linked = set(re.findall(r"\]\(([^)]+\.md)\)", text))
        for name in sorted(listable - linked):
            findings.append({"file": name, "issue": f"entry {name} missing from index.md"})
        for name in sorted(linked - listable):
            findings.append({"file": "index.md", "issue": f"index row points to missing entry: {name}"})
    stats = {"kernel": {"lines": 0, "bullets": 0, "tokens": 0}, "entries": {}, "bundle_tokens": 0}
    kernel = root / "kernel.md"
    if kernel.exists():
        ktext = kernel.read_text(encoding="utf-8")
        kfields, kerr, kbody = parse_frontmatter(ktext)
        if kerr:
            findings.append({"file": "kernel.md", "issue": kerr})
        elif kfields:
            for key in kfields:
                if key != "status":
                    findings.append({"file": "kernel.md",
                                     "issue": f"kernel frontmatter key not allowed: {key}"})
        body = kbody or ktext
        lines = [ln for ln in body.splitlines() if ln.strip()]
        bullets = [ln for ln in lines if ln.lstrip().startswith("- ")]
        stats["kernel"] = {"lines": len(lines), "bullets": len(bullets),
                           "tokens": int(len(body) / 4)}
        if len(bullets) > 200 or len(lines) > 250:
            findings.append({"file": "kernel.md",
                             "issue": f"kernel over instruction budget: {len(bullets)} bullets / "
                                      f"{len(lines)} lines (ceiling ~200 instructions)"})
    total = stats["kernel"]["tokens"]
    for f, fields, err, body in entries:
        toks = int(len(body) / 4)
        stats["entries"][f.name] = toks
        total += toks
        if toks > 400:
            findings.append({"file": f.name,
                             "issue": f"entry ~{toks} tokens, approaching a page — "
                                      f"split into two entries or cut"})
    stats["bundle_tokens"] = total
    emit({"ok": not findings, "findings": findings, "stats": stats}, as_json,
         "\n".join(f"{x['file']}: {x['issue']}" for x in findings) or "clean")
    sys.exit(1 if findings else 0)


# ── index ────────────────────────────────────────────────────────────────────

def cmd_index(args, project_root, cfg, as_json):
    root = bundle_root(project_root, args.root, cfg)
    idx = root / "index.md"
    first_line = (idx.read_text(encoding="utf-8").splitlines() or [""])[0] if idx.exists() else ""
    if first_line and INDEX_MARKER not in first_line:
        fail(f"refusing to overwrite foreign index.md at {idx} — move it, or point "
             f"project_knowledge at a clean folder")
    entries = load_entries(root)
    content = render_index(entries)
    if not idx.exists() or idx.read_text(encoding="utf-8") != content:
        idx.write_text(content, encoding="utf-8")
    emit({"ok": True, "entries": len(index_rows(entries)), "written": str(idx)}, as_json)


# ── sweep ────────────────────────────────────────────────────────────────────

def source_date(project_root: Path, source: str):
    proc = subprocess.run(["git", "log", "-1", "--format=%cI", "--", source],
                          cwd=str(project_root), capture_output=True, text=True)
    if proc.returncode == 0 and proc.stdout.strip():
        return proc.stdout.strip()[:10]
    p = project_root / source
    if p.exists():
        return dt.date.fromtimestamp(p.stat().st_mtime).isoformat()
    return None


PATH_TOKEN = re.compile(r"`([^`\s]+/[^`\s]+)`")


def missing_body_paths(project_root: Path, text: str):
    """Backticked repo-relative paths whose top directory exists but the file does not."""
    out = []
    for tok in PATH_TOKEN.findall(text):
        tok = tok.strip().rstrip("/")
        if "://" in tok or tok.startswith(("{", "<", "-", "~", "/")) or "*" in tok:
            continue
        first = tok.split("/")[0]
        if (project_root / first).is_dir() and not (project_root / tok).exists():
            out.append(tok)
    return out


def cmd_sweep(args, project_root, cfg, as_json):
    root = bundle_root(project_root, args.root, cfg)
    today = args.today or dt.date.today().isoformat()
    stale, missing = [], []
    kernel = root / "kernel.md"
    if kernel.exists():
        for tok in missing_body_paths(project_root, kernel.read_text(encoding="utf-8")):
            missing.append({"file": "kernel.md", "reason": f"path `{tok}` does not exist"})
    for f, fields, err, body in load_entries(root):
        if err or not fields:
            continue
        rel = f.name
        if fields.get("stale_after") and str(fields["stale_after"]) < today:
            stale.append({"file": rel, "reason": f"stale_after {fields['stale_after']} passed"})
        sources = fields.get("sources") or []
        for s in (sources if isinstance(sources, list) else [sources]):
            if "://" in s:
                continue
            if not (project_root / s).exists():
                missing.append({"file": rel, "reason": f"source {s} does not exist"})
            elif fields.get("verified"):
                changed = source_date(project_root, s)
                if changed and changed > str(fields["verified"]):
                    stale.append({"file": rel,
                                  "reason": f"source {s} changed {changed}, after verified {fields['verified']}"})
        for tok in missing_body_paths(project_root, body):
            missing.append({"file": rel, "reason": f"path `{tok}` does not exist"})
    emit({"stale": stale, "missing": missing}, as_json,
         "\n".join(f"{x['file']}: {x['reason']}" for x in stale + missing) or "clean")


# ── compass ──────────────────────────────────────────────────────────────────

def nearest_compass(root: Path, target: str):
    best, best_len = None, -1
    for f, fields, err, body in load_compasses(root):
        area = str(fields.get("area", "")).rstrip("/")
        if err or not area:
            continue
        if target == area or target.startswith(area + "/"):
            if len(area) > best_len:
                best, best_len = (f, fields, body), len(area)
    return best


def cmd_compass(args, project_root, cfg, as_json):
    root = bundle_root(project_root, args.root, cfg)
    hit = nearest_compass(root, args.path.rstrip("/"))
    if not hit:
        emit({"path": None, "content": None}, as_json)
        return
    f, fields, body = hit
    emit({"path": str(f), "area": fields.get("area"), "content": body}, as_json)
    if not as_json:
        sys.stdout.write(f.read_text(encoding="utf-8"))


# ── resolve ──────────────────────────────────────────────────────────────────

def parse_registry(path: Path) -> dict:
    """Minimal indent parser for the obeya registry: projects.<name>.<key>: value."""
    projects, current = {}, None
    in_projects = False
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.strip().startswith("#"):
            continue
        indent = len(line) - len(line.lstrip())
        key, _, val = line.strip().partition(":")
        val = val.strip().strip("'\"")
        if indent == 0:
            in_projects = key == "projects"
        elif in_projects and indent == 2:
            current = key
            projects[current] = {}
        elif in_projects and indent >= 4 and current:
            projects[current][key] = val
    return projects


def find_workspace(project_root: Path):
    """Walk up for sibling checkouts and an obeya checkout. Returns (siblings, registry)."""
    siblings, registry = {}, None
    node = project_root.parent
    for _ in range(6):
        if not node or node == node.parent:
            break
        try:
            children = [c for c in node.iterdir() if c.is_dir()]
        except OSError:
            break
        for c in children:
            reg = c / REGISTRY_FILE
            if registry is None and reg.exists() and REGISTRY_KEY in reg.read_text(encoding="utf-8"):
                registry = parse_registry(reg)
            if c != project_root:
                siblings.setdefault(c.name, c)
        node = node.parent
    return siblings, registry


def cache_dir() -> Path:
    return Path(os.environ.get("BMAD_CONTEXT_CACHE", str(Path.home() / ".bmad" / "context-cache")))


def cache_lookup(project: str):
    pointer = cache_dir() / f"{project}.latest.json"
    if pointer.exists():
        try:
            meta = json.loads(pointer.read_text(encoding="utf-8"))
            sha = meta["sha"]
        except (json.JSONDecodeError, OSError, KeyError, TypeError):
            return None
        path = cache_dir() / f"{project}@{sha}"
        if path.is_dir():
            return {"path": str(path), "sha": sha,
                    "fetched_at": meta.get("fetched_at"), "source": "cache"}
    return None


def sparse_fetch(project: str, record: dict):
    remote, branch = record["remote"], record.get("branch", "main")
    context_root = record.get("context_root", DEFAULT_KNOWLEDGE)
    with tempfile.TemporaryDirectory() as tmp:
        clone = Path(tmp) / "clone"
        proc = subprocess.run(
            ["git", "clone", "-q", "--depth", "1", "--filter=blob:none", "--sparse",
             "--branch", branch, remote, str(clone)],
            capture_output=True, text=True)
        if proc.returncode != 0:
            return None, proc.stderr.strip()
        subprocess.run(["git", "-C", str(clone), "sparse-checkout", "set", context_root],
                       capture_output=True, check=False)
        sha = subprocess.run(["git", "-C", str(clone), "rev-parse", "HEAD"],
                             capture_output=True, text=True).stdout.strip()
        src = clone / context_root
        if not src.is_dir():
            return None, f"context root {context_root!r} not present in {remote}"
        dest = cache_dir() / f"{project}@{sha}"
        if dest.exists():
            shutil.rmtree(dest)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(src, dest)
        fetched_at = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
        pointer = cache_dir() / f"{project}.latest.json"
        tmp_pointer = pointer.with_suffix(".json.tmp")
        tmp_pointer.write_text(json.dumps({"sha": sha, "fetched_at": fetched_at}), encoding="utf-8")
        os.replace(tmp_pointer, pointer)
        return {"path": str(dest), "sha": sha, "fetched_at": fetched_at,
                "source": "remote"}, None


def git_head(path: Path):
    proc = subprocess.run(["git", "rev-parse", "HEAD"], cwd=str(path),
                          capture_output=True, text=True)
    return proc.stdout.strip() if proc.returncode == 0 else None


def sibling_bundle(checkout: Path):
    sib_cfg = resolve_full_config(checkout)
    root = bundle_root(checkout, None, sib_cfg)
    return root if (root / "kernel.md").exists() or (root / "index.md").exists() else None


def cmd_resolve(args, project_root, cfg, as_json):
    project, _, entry = args.name.partition(":")
    result = None
    self_name = cfg.get("project_name") or project_root.name
    if project == self_name:
        result = {"path": str(bundle_root(project_root, None, cfg)),
                  "sha": git_head(project_root), "fetched_at": None, "source": "local"}
    siblings, registry = (None, None)
    if result is None:
        siblings, registry = find_workspace(project_root)
        checkout = siblings.get(project)
        root = sibling_bundle(checkout) if checkout else None
        if root:
            result = {"path": str(root), "sha": git_head(checkout),
                      "fetched_at": None, "source": "local"}
    if result is None and not args.refresh:
        result = cache_lookup(project)
    if result is None:
        if registry is None and cfg.get("obeya_remote"):
            fetched, _ = sparse_fetch("obeya", {"remote": cfg["obeya_remote"],
                                                "context_root": "."})
            if fetched:
                reg = Path(fetched["path"]) / REGISTRY_FILE
                if reg.exists():
                    registry = parse_registry(reg)
        record = (registry or {}).get(project)
        if record:
            result, err = sparse_fetch(project, record)
            if result is None:
                cached = cache_lookup(project)
                if cached:
                    cached["warning"] = f"remote unreachable ({err}); serving cache"
                    result = cached
    if result is None:
        fail(f"cannot resolve {project!r}: not this project, no workspace checkout, "
             f"no cache, and no registry record")
    if entry:
        hit = next((p for p in Path(result["path"]).glob("*.md")
                    if p.stem == entry), None)
        if not hit:
            fail(f"entry {entry!r} not found in {project!r} bundle at {result['path']}")
        result["path"] = str(hit)
    emit(result, as_json, result["path"])


# ── sync ─────────────────────────────────────────────────────────────────────

def strip_frontmatter(text: str) -> str:
    fields, err, body = parse_frontmatter(text)
    return text if fields is None and err is None and not body else (body or text)


def rewrite_links(content: str, source_dir: Path, target_dir: Path) -> str:
    """Re-anchor relative .md links so they resolve from the file the block lands in."""
    def repl(m):
        text, target = m.group(1), m.group(2)
        if target.startswith(("http://", "https://", "#", "/")) or not target.endswith(".md"):
            return m.group(0)
        resolved = (source_dir / target).resolve()
        return f"[{text}]({Path(os.path.relpath(resolved, target_dir)).as_posix()})"
    return re.sub(r"\[([^\]]*)\]\(([^)]+)\)", repl, content)


def apply_block(target: Path, content: str, dry: bool = False) -> bool:
    block = f"{BLOCK_START}\n{content.rstrip()}\n{BLOCK_END}\n"
    if target.exists():
        text = target.read_text(encoding="utf-8")
        if BLOCK_START in text and BLOCK_END in text:
            pre = text[:text.index(BLOCK_START)]
            post = text[text.index(BLOCK_END) + len(BLOCK_END):].lstrip("\n")
            new = pre + block + post
        else:
            new = text.rstrip("\n") + "\n\n" + block
    else:
        new = block
    if target.exists() and target.read_text(encoding="utf-8") == new:
        return False
    if not dry:
        target.write_text(new, encoding="utf-8")
    return True


def cmd_sync(args, project_root, cfg, as_json):
    placement = cfg.get("context_placement")
    if placement not in ("agent-files", "both"):
        fail(f"sync runs only under the agent-files or both placement "
             f"(context_placement is {placement!r})")
    root = bundle_root(project_root, None, cfg)
    dry = getattr(args, "dry_run", False)
    written = []
    kernel = root / "kernel.md"
    if kernel.exists():
        content = rewrite_links(strip_frontmatter(kernel.read_text(encoding="utf-8")),
                                root, project_root)
        if apply_block(project_root / "AGENTS.md", content, dry):
            written.append(str(project_root / "AGENTS.md"))
    for f, fields, err, body in load_compasses(root):
        area = str(fields.get("area", "")).rstrip("/")
        if err or not area:
            continue
        area_dir = project_root / area
        if area_dir.is_dir():
            if apply_block(area_dir / "AGENTS.md",
                           rewrite_links(body, root / "compass", area_dir), dry):
                written.append(str(area_dir / "AGENTS.md"))
    emit({"written": written, "dry_run": dry}, as_json, "\n".join(written) or "up to date")


# ── bootstrap ────────────────────────────────────────────────────────────────

def cmd_bootstrap(args, project_root, cfg, as_json):
    target = project_root / "_bmad" / "scripts" / "context.py"
    target.parent.mkdir(parents=True, exist_ok=True)
    self_bytes = Path(__file__).resolve().read_bytes()
    if not target.exists() or target.read_bytes() != self_bytes:
        target.write_bytes(self_bytes)
    emit({"path": str(target)}, as_json, str(target))


# ── main ─────────────────────────────────────────────────────────────────────

def main(argv=None):
    p = argparse.ArgumentParser(prog="context.py", description=__doc__)
    p.add_argument("--json", action="store_true", dest="as_json")
    p.add_argument("--project-root", default=".")
    jp = argparse.ArgumentParser(add_help=False)  # lets --json follow the subcommand too
    jp.add_argument("--json", action="store_true", dest="as_json", default=argparse.SUPPRESS)
    sub = p.add_subparsers(dest="command", required=True)

    s = sub.add_parser("validate", parents=[jp])
    s.add_argument("root", nargs="?")
    s = sub.add_parser("index", parents=[jp])
    s.add_argument("root", nargs="?")
    s = sub.add_parser("sweep", parents=[jp])
    s.add_argument("root", nargs="?")
    s.add_argument("--today")
    s = sub.add_parser("resolve", parents=[jp])
    s.add_argument("name")
    s.add_argument("--refresh", action="store_true")
    s = sub.add_parser("compass", parents=[jp])
    s.add_argument("path")
    s.add_argument("root", nargs="?")
    s = sub.add_parser("sync", parents=[jp])
    s.add_argument("--dry-run", action="store_true", dest="dry_run")
    sub.add_parser("bootstrap", parents=[jp])
    sub.add_parser("config", parents=[jp])

    args = p.parse_args(argv)
    project_root = Path(args.project_root).resolve()
    cfg = resolve_full_config(project_root)
    {"validate": cmd_validate, "index": cmd_index, "sweep": cmd_sweep,
     "resolve": cmd_resolve, "compass": cmd_compass, "sync": cmd_sync,
     "bootstrap": cmd_bootstrap, "config": cmd_config}[args.command](
        args, project_root, cfg, args.as_json)


if __name__ == "__main__":
    main()
