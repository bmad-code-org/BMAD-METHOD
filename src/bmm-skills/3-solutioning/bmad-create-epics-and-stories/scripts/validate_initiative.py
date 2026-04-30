#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Validate the v7 epic-and-story tree under an initiative store.

Checks (strict mode):
  1. Each file's front matter has only the allowed top-level keys, all required keys present.
  2. Enum values valid (type, status).
  3. Story `epic:` field equals the enclosing folder name; epic `epic:` field equals the folder NN.
  4. depends_on entries resolve (within-epic basenames or <epic-folder>/<basename> cross-epic).
  5. Cross-epic depends_on graph is acyclic.
  6. Within-epic story numbering is sequential starting at 01.
  7. Sizing sanity (warnings only): a story body >3x the epic mean is flagged.
  8. Coverage (only when --inventory FILE is provided): every requirement code listed
     in the inventory must appear textually in at least one story body.

Output (stdout, JSON): {"findings": [...], "summary": {...}}
  --summary-only emits a structured tree block instead, used by edit-mode and finalize.
  --tree emits a plain-text tree to stdout, used by Stage 6.
Exit codes: 0 if no errors (warnings ok), 1 if any error finding, 2 on internal error.

Flags:
  --lax              skip sizing warnings; never relaxes schema or dep checks
  --epic NN-kebab    limit walks to a single epic folder (still resolves cross-epic refs)
  --inventory FILE   path to inventory.json (or .bmad-cache/inventory.json); when present,
                     missing requirement codes are reported. Default level is warning;
                     pair with --coverage-strict to escalate to error.
  --coverage-strict  upgrade coverage-missing findings from warning to error
  --summary-only     emit tree-shaped summary JSON only (no schema findings); intended for
                     prompts that need to see what's there without re-reading every file
  --tree             emit a plain-text tree (epic folders, story files, statuses) and exit 0
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

STORY_TYPES = {"feature", "bug", "task", "spike"}
STATUSES = {"draft", "ready", "in-progress", "review", "done", "blocked"}
STORY_KEYS = {"title", "type", "status", "epic", "depends_on", "metadata"}
STORY_REQUIRED = {"title", "type", "status", "epic", "depends_on"}
EPIC_KEYS = {"title", "epic", "status", "depends_on", "metadata"}
EPIC_REQUIRED = {"title", "epic", "status", "depends_on"}

REQUIREMENT_CODE_RE = re.compile(r"\b(?:UX-DR|NFR|FR|D|R)\d+(?:\.\d+)?\b")


def parse_frontmatter(text: str) -> tuple[dict | None, str | None]:
    if not text.startswith("---\n"):
        return None, "missing front matter (expected leading '---')"
    end = text.find("\n---", 4)
    if end == -1:
        return None, "front matter not closed (expected closing '---')"
    return _parse_block(text[4:end])


def _parse_block(block: str) -> tuple[dict | None, str | None]:
    out: dict = {}
    lines = block.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip() or line.lstrip().startswith("#"):
            i += 1
            continue
        if line.startswith(" "):
            return None, f"unexpected indented line: {line!r}"
        if ":" not in line:
            return None, f"line missing colon: {line!r}"
        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()
        if val == "":
            children = []
            j = i + 1
            while j < len(lines) and (lines[j].startswith("  ") or not lines[j].strip()):
                children.append(lines[j])
                j += 1
            out[key] = _parse_indented(children)
            i = j
            continue
        out[key] = _parse_scalar_or_list(val)
        i += 1
    return out, None


def _parse_scalar_or_list(val: str):
    if val.startswith("[") and val.endswith("]"):
        inner = val[1:-1].strip()
        if not inner:
            return []
        return [_unquote(p.strip()) for p in _split_top_level(inner, ",")]
    return _unquote(val)


def _split_top_level(s: str, sep: str) -> list[str]:
    out, cur, depth, in_q = [], [], 0, None
    i = 0
    while i < len(s):
        c = s[i]
        if in_q:
            cur.append(c)
            if c == "\\" and i + 1 < len(s):
                cur.append(s[i + 1])
                i += 2
                continue
            if c == in_q:
                in_q = None
        elif c in '"\'':
            in_q = c
            cur.append(c)
        elif c in "[{":
            depth += 1
            cur.append(c)
        elif c in "]}":
            depth -= 1
            cur.append(c)
        elif c == sep and depth == 0:
            out.append("".join(cur))
            cur = []
        else:
            cur.append(c)
        i += 1
    if cur:
        out.append("".join(cur))
    return out


def _unquote(val: str) -> str:
    val = val.strip()
    if len(val) >= 2 and val[0] == val[-1] and val[0] in "\"'":
        inner = val[1:-1]
        if val[0] == '"':
            return inner.replace('\\"', '"').replace("\\\\", "\\")
        return inner
    return val


def _parse_indented(lines: list[str]) -> dict:
    out: dict = {}
    for line in lines:
        s = line.strip()
        if not s or s.startswith("#") or ":" not in s:
            continue
        key, _, val = s.partition(":")
        out[key.strip()] = _unquote(val.strip())
    return out


def _find_cycles(graph: dict[str, list[str]]) -> list[list[str]]:
    cycles: list[list[str]] = []
    state: dict[str, int] = {}
    stack: list[str] = []

    def dfs(node: str) -> None:
        state[node] = 1
        stack.append(node)
        for nxt in graph.get(node, []):
            if state.get(nxt) == 1:
                cycles.append(stack[stack.index(nxt):] + [nxt])
            elif state.get(nxt, 0) == 0:
                dfs(nxt)
        stack.pop()
        state[node] = 2

    for n in graph:
        if state.get(n, 0) == 0:
            dfs(n)
    return cycles


def _inventory_codes(inventory: dict) -> list[tuple[str, str]]:
    """Return a flat (code, text) list across every category in an inventory dict.

    Accepts either a `requirements` map keyed by category, or a flat list of
    {code, text} entries under `codes`. Tolerates missing fields.
    """
    out: list[tuple[str, str]] = []
    reqs = inventory.get("requirements") or {}
    if isinstance(reqs, dict):
        for entries in reqs.values():
            if not isinstance(entries, list):
                continue
            for e in entries:
                if isinstance(e, dict) and "code" in e:
                    out.append((str(e["code"]), str(e.get("text", ""))))
    for legacy_key in ("codes", "additional_codes"):
        for e in inventory.get(legacy_key, []) or []:
            if isinstance(e, dict) and "code" in e:
                out.append((str(e["code"]), str(e.get("text", ""))))
    return out


def validate(
    initiative_store: Path,
    lax: bool,
    only_epic: str | None,
    inventory_codes: list[tuple[str, str]] | None = None,
    coverage_strict: bool = False,
) -> tuple[list[dict], dict]:
    findings: list[dict] = []
    epics_dir = initiative_store / "epics"
    if not epics_dir.is_dir():
        findings.append({"level": "error", "code": "no-epics-dir", "message": f"missing {epics_dir}", "path": str(epics_dir)})
        return findings, {}

    all_epic_folders = sorted(p for p in epics_dir.iterdir() if p.is_dir() and re.match(r"^\d+-", p.name))
    walk_folders = [p for p in all_epic_folders if (only_epic is None or p.name == only_epic)]

    epic_meta: dict[str, dict] = {}
    story_index: dict[str, dict] = {}
    mentioned_codes: set[str] = set()

    # walk every epic in the tree (so cross-epic refs always resolve), but only
    # report non-resolution findings when the offending file is in walk_folders.
    epic_folders_for_meta = all_epic_folders
    walk_set = {p.name for p in walk_folders}

    for ed in epic_folders_for_meta:
        in_walk = ed.name in walk_set
        nn = ed.name.split("-", 1)[0].zfill(2)
        epic_md = ed / "epic.md"
        if not epic_md.is_file():
            if in_walk:
                findings.append({"level": "error", "code": "missing-epic-md", "message": f"no epic.md in {ed.name}", "path": str(ed)})
            continue
        text = epic_md.read_text(encoding="utf-8")
        fm, err = parse_frontmatter(text)
        if err:
            if in_walk:
                findings.append({"level": "error", "code": "epic-frontmatter-parse", "message": err, "path": str(epic_md)})
            continue

        if in_walk:
            present = set(fm.keys())
            forbidden = present - EPIC_KEYS
            if forbidden:
                findings.append({"level": "error", "code": "epic-extra-keys", "message": f"forbidden top-level keys: {sorted(forbidden)}", "path": str(epic_md)})
            missing = EPIC_REQUIRED - present
            if missing:
                findings.append({"level": "error", "code": "epic-missing-keys", "message": f"missing required keys: {sorted(missing)}", "path": str(epic_md)})
            if fm.get("status") not in STATUSES:
                findings.append({"level": "error", "code": "epic-bad-status", "message": f"status={fm.get('status')!r} not in {sorted(STATUSES)}", "path": str(epic_md)})
            ef = str(fm.get("epic", "")).strip()
            if ef and ef != nn:
                findings.append({"level": "error", "code": "epic-nn-mismatch", "message": f"epic field {ef!r} does not match folder NN {nn!r}", "path": str(epic_md)})

        deps = fm.get("depends_on", [])
        if not isinstance(deps, list):
            if in_walk:
                findings.append({"level": "error", "code": "epic-deps-not-list", "message": "depends_on must be a list", "path": str(epic_md)})
            deps = []

        epic_meta[ed.name] = {
            "nn": nn,
            "title": str(fm.get("title", "")),
            "status": fm.get("status"),
            "depends_on": [str(d) for d in deps],
            "path": ed,
            "in_walk": in_walk,
        }

        story_files = sorted(p for p in ed.iterdir() if p.is_file() and p.suffix == ".md" and p.name != "epic.md" and re.match(r"^\d+-", p.name))
        seen_nns: list[int] = []
        for sf in story_files:
            nn_m = re.match(r"^(\d+)-", sf.name)
            if not nn_m:
                if in_walk:
                    findings.append({"level": "error", "code": "story-bad-prefix", "message": "expected NN-kebab.md", "path": str(sf)})
                continue
            snn = int(nn_m.group(1))
            seen_nns.append(snn)
            stext = sf.read_text(encoding="utf-8")
            sfm, serr = parse_frontmatter(stext)
            if serr:
                if in_walk:
                    findings.append({"level": "error", "code": "story-frontmatter-parse", "message": serr, "path": str(sf)})
                continue
            if in_walk:
                present = set(sfm.keys())
                forbidden = present - STORY_KEYS
                if forbidden:
                    findings.append({"level": "error", "code": "story-extra-keys", "message": f"forbidden top-level keys: {sorted(forbidden)}", "path": str(sf)})
                missing = STORY_REQUIRED - present
                if missing:
                    findings.append({"level": "error", "code": "story-missing-keys", "message": f"missing required keys: {sorted(missing)}", "path": str(sf)})
                if sfm.get("type") not in STORY_TYPES:
                    findings.append({"level": "error", "code": "story-bad-type", "message": f"type={sfm.get('type')!r} not in {sorted(STORY_TYPES)}", "path": str(sf)})
                if sfm.get("status") not in STATUSES:
                    findings.append({"level": "error", "code": "story-bad-status", "message": f"status={sfm.get('status')!r} not in {sorted(STATUSES)}", "path": str(sf)})
                if sfm.get("epic") != ed.name:
                    findings.append({"level": "error", "code": "story-epic-mismatch", "message": f"epic field {sfm.get('epic')!r} does not match folder {ed.name!r}", "path": str(sf)})
            sdeps = sfm.get("depends_on", [])
            if not isinstance(sdeps, list):
                if in_walk:
                    findings.append({"level": "error", "code": "story-deps-not-list", "message": "depends_on must be a list", "path": str(sf)})
                sdeps = []
            mentioned_codes.update(REQUIREMENT_CODE_RE.findall(stext))
            story_index[f"{ed.name}/{sf.stem}"] = {
                "depends_on": [str(d) for d in sdeps],
                "path": sf,
                "basename": sf.stem,
                "epic": ed.name,
                "nn": snn,
                "title": str(sfm.get("title", "")),
                "type": sfm.get("type"),
                "status": sfm.get("status"),
                "body_len": len(stext),
                "in_walk": in_walk,
            }

        if in_walk and seen_nns:
            expected = list(range(1, len(seen_nns) + 1))
            if sorted(seen_nns) != expected:
                findings.append({"level": "error", "code": "story-numbering-gaps", "message": f"story NNs {sorted(seen_nns)} expected {expected}", "path": str(ed)})

    # depends_on resolution
    epic_nns = {meta["nn"]: name for name, meta in epic_meta.items()}
    for name, meta in epic_meta.items():
        if not meta["in_walk"]:
            continue
        for d in meta["depends_on"]:
            d2 = d.zfill(2)
            if d2 not in epic_nns:
                findings.append({"level": "error", "code": "epic-dep-unresolved", "message": f"epic {name} depends on NN {d!r} which has no folder", "path": str(meta["path"])})

    for skey, smeta in story_index.items():
        if not smeta["in_walk"]:
            continue
        for d in smeta["depends_on"]:
            if "/" in d:
                if f"{d.split('/', 1)[0]}/{d.split('/', 1)[1]}" not in story_index:
                    findings.append({"level": "error", "code": "story-dep-unresolved", "message": f"cross-epic dep {d!r} references missing story", "path": str(smeta["path"])})
            else:
                if f"{smeta['epic']}/{d}" not in story_index:
                    findings.append({"level": "error", "code": "story-dep-unresolved", "message": f"within-epic dep {d!r} not found in {smeta['epic']}", "path": str(smeta["path"])})

    # epic dep cycles (compute on whole tree; report once)
    if walk_set:
        cycle_graph = {meta["nn"]: [d.zfill(2) for d in meta["depends_on"]] for meta in epic_meta.values()}
        for cyc in _find_cycles(cycle_graph):
            findings.append({"level": "error", "code": "epic-dep-cycle", "message": "cycle in epic depends_on: " + " -> ".join(cyc), "path": str(epics_dir)})

    # sizing warnings
    if not lax:
        by_epic: dict[str, list] = defaultdict(list)
        for skey, smeta in story_index.items():
            if smeta["in_walk"]:
                by_epic[smeta["epic"]].append(smeta)
        for epic_name, items in by_epic.items():
            if len(items) < 3:
                continue
            mean = sum(s["body_len"] for s in items) / len(items)
            for smeta in items:
                if mean > 0 and smeta["body_len"] > mean * 3:
                    findings.append({
                        "level": "warning",
                        "code": "story-oversized",
                        "message": f"body {smeta['body_len']} chars is >3x epic mean ({mean:.0f}); consider splitting",
                        "path": str(smeta["path"]),
                    })

    coverage_missing: list[str] = []
    if inventory_codes is not None:
        level = "error" if coverage_strict else "warning"
        for code, text in inventory_codes:
            if code in mentioned_codes:
                continue
            coverage_missing.append(code)
            findings.append({
                "level": level,
                "code": "coverage-missing",
                "message": f"requirement {code!r} ({text[:60]}...) not referenced by any story body" if text else f"requirement {code!r} not referenced by any story body",
                "path": str(initiative_store / "epics"),
            })

    epics_summary: list[dict] = []
    for name, meta in epic_meta.items():
        if not meta["in_walk"]:
            continue
        own_stories = [s for s in story_index.values() if s["epic"] == name and s["in_walk"]]
        epics_summary.append({
            "folder": name,
            "nn": meta["nn"],
            "title": meta["title"],
            "status": meta["status"],
            "depends_on": meta["depends_on"],
            "story_count": len(own_stories),
            "story_status_counts": dict(Counter(s["status"] for s in own_stories)),
            "stories": [
                {
                    "basename": s["basename"],
                    "nn": f"{s['nn']:02d}",
                    "title": s["title"],
                    "type": s["type"],
                    "status": s["status"],
                    "depends_on": s["depends_on"],
                    "body_len": s["body_len"],
                }
                for s in sorted(own_stories, key=lambda s: s["nn"])
            ],
        })

    summary = {
        "epics": epics_summary,
        "story_count": sum(1 for s in story_index.values() if s["in_walk"]),
        "story_status_counts": dict(Counter(s["status"] for s in story_index.values() if s["in_walk"])),
        "story_type_counts": dict(Counter(s["type"] for s in story_index.values() if s["in_walk"])),
        "errors": sum(1 for f in findings if f["level"] == "error"),
        "warnings": sum(1 for f in findings if f["level"] == "warning"),
        "mentioned_requirements": sorted(mentioned_codes),
        "coverage_missing": sorted(coverage_missing),
    }
    return findings, summary


def render_tree(initiative_store: Path, summary: dict) -> str:
    """Plain-text tree for direct printing in Stage 6 / edit-mode summary."""
    lines = [f"{initiative_store}/epics/"]
    epics = summary.get("epics", [])
    for ei, epic in enumerate(epics):
        is_last_epic = ei == len(epics) - 1
        epic_branch = "└── " if is_last_epic else "├── "
        lines.append(f"{epic_branch}{epic['folder']}/  (epic, {epic.get('status', '?')})")
        epic_indent = "    " if is_last_epic else "│   "
        stories = epic.get("stories", [])
        for si, story in enumerate(stories):
            is_last_story = si == len(stories) - 1
            story_branch = "└── " if is_last_story else "├── "
            lines.append(
                f"{epic_indent}{story_branch}{story['basename']}.md  "
                f"({story.get('type', '?')}, {story.get('status', '?')})"
            )
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    ap.add_argument("--lax", action="store_true", help="Skip sizing warnings; never relaxes schema/dep checks")
    ap.add_argument("--epic", help="Limit reporting to a single epic folder name")
    ap.add_argument("--inventory", type=Path, help="inventory.json with requirement codes; enables coverage check")
    ap.add_argument("--coverage-strict", action="store_true", help="Escalate coverage-missing findings from warning to error")
    ap.add_argument("--summary-only", action="store_true", help="Emit summary block with full epic/story tree (no findings)")
    ap.add_argument("--tree", action="store_true", help="Emit a plain-text tree to stdout and exit")
    args = ap.parse_args()

    inventory_codes: list[tuple[str, str]] | None = None
    if args.inventory is not None:
        if not args.inventory.is_file():
            print(f"inventory file not found: {args.inventory}", file=sys.stderr)
            return 1
        try:
            inventory = json.loads(args.inventory.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            print(f"could not parse {args.inventory}: {exc}", file=sys.stderr)
            return 1
        inventory_codes = _inventory_codes(inventory)

    findings, summary = validate(
        args.initiative_store,
        args.lax,
        args.epic,
        inventory_codes=inventory_codes,
        coverage_strict=args.coverage_strict,
    )

    if args.tree:
        print(render_tree(args.initiative_store, summary))
        return 0
    if args.summary_only:
        print(json.dumps({"summary": summary}))
        return 0
    print(json.dumps({"findings": findings, "summary": summary}))
    return 1 if any(f["level"] == "error" for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main())
