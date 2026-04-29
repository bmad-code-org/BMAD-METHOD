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

Coverage of FR/NFR/UX-DR codes is NOT enforced here — the inventory lives in the LLM's
working memory, not on disk. The summary's `mentioned_requirements` field exposes every
code mentioned in any story body so the calling prompt can cross-check against its
inventory (see `prompts/validate.md`).

Output (stdout, JSON): {"findings": [...], "summary": {...}}
Exit codes: 0 if no errors (warnings ok), 1 if any error finding, 2 on internal error.

Flags:
  --lax       skip sizing warnings; never relaxes schema or dep checks
  --epic NN-kebab   limit walks to a single epic folder (still resolves cross-epic refs against the whole tree)
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

REQUIREMENT_CODE_RE = re.compile(r"\b(?:UX-DR|NFR|FR)\d+(?:\.\d+)?\b")


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


def validate(initiative_store: Path, lax: bool, only_epic: str | None) -> tuple[list[dict], dict]:
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

        epic_meta[ed.name] = {"nn": nn, "depends_on": [str(d) for d in deps], "path": ed, "in_walk": in_walk}

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
                "epic": ed.name,
                "nn": snn,
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

    summary = {
        "epics": [
            {"folder": name, "nn": meta["nn"], "depends_on": meta["depends_on"]}
            for name, meta in epic_meta.items() if meta["in_walk"]
        ],
        "story_count": sum(1 for s in story_index.values() if s["in_walk"]),
        "story_status_counts": dict(Counter(s["status"] for s in story_index.values() if s["in_walk"])),
        "errors": sum(1 for f in findings if f["level"] == "error"),
        "warnings": sum(1 for f in findings if f["level"] == "warning"),
        "mentioned_requirements": sorted(mentioned_codes),
    }
    return findings, summary


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    ap.add_argument("--lax", action="store_true", help="Skip sizing warnings; never relaxes schema/dep checks")
    ap.add_argument("--epic", help="Limit reporting to a single epic folder name")
    args = ap.parse_args()

    findings, summary = validate(args.initiative_store, args.lax, args.epic)
    print(json.dumps({"findings": findings, "summary": summary}))
    return 1 if any(f["level"] == "error" for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main())
