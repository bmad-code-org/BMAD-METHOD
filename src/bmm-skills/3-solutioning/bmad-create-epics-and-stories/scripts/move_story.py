#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Move a story between epic folders; rewrites the file's epic field and depends_on refs.

When the story moves from `src-epic` to `dst-epic`:
  - The file's `epic:` front-matter field is rewritten to dst-epic.
  - In every story across the tree, depends_on entries `src-epic/<basename>` become
    `dst-epic/<new-basename>`.
  - Within the OLD source epic, sibling stories whose depends_on used the bare
    `<basename>` (within-epic form) are rewritten to the cross-epic form
    `dst-epic/<new-basename>` so they keep resolving.

Output (stdout, JSON): {"old": "<src-epic>/<basename>", "new": "<dst-epic>/<basename>", "refs_updated": N, "path": "<abs>"}
Exit codes: 0 ok, 1 user error, 2 internal error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def yaml_quote(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    ap.add_argument("--from", dest="src", required=True, help="Source as <epic-folder>/<basename> (no .md)")
    ap.add_argument("--to-epic", required=True, help="Destination epic folder name")
    ap.add_argument("--new-nn", type=int, help="Renumber on move; if omitted, preserve the existing NN")
    args = ap.parse_args()

    if "/" not in args.src:
        print("--from must be <epic-folder>/<basename>", file=sys.stderr)
        return 1
    src_epic, src_basename = args.src.split("/", 1)

    if src_epic == args.to_epic:
        print("--to-epic equals source epic; use rename_story.py to renumber within an epic", file=sys.stderr)
        return 1

    src_path = args.initiative_store / "epics" / src_epic / f"{src_basename}.md"
    if not src_path.is_file():
        print(f"source story not found: {src_path}", file=sys.stderr)
        return 1
    dst_epic_dir = args.initiative_store / "epics" / args.to_epic
    if not dst_epic_dir.is_dir():
        print(f"destination epic folder does not exist: {dst_epic_dir}", file=sys.stderr)
        return 1

    m = re.match(r"^(\d+)-(.+)$", src_basename)
    if not m:
        print(f"source basename does not start with NN-: {src_basename}", file=sys.stderr)
        return 1
    new_nn = f"{args.new_nn:02d}" if args.new_nn is not None else m.group(1).zfill(2)
    new_basename = f"{new_nn}-{m.group(2)}"

    dst_path = dst_epic_dir / f"{new_basename}.md"
    if dst_path.exists():
        print(f"destination already exists: {dst_path}", file=sys.stderr)
        return 1

    text = src_path.read_text(encoding="utf-8")
    text = re.sub(r"^epic:.*$", f"epic: {yaml_quote(args.to_epic)}", text, count=1, flags=re.MULTILINE)
    # The moved story's own depends_on may carry bare basenames that referenced
    # within-epic siblings in src_epic; those refs now need cross-epic form.
    new_text_lines: list[str] = []
    self_refs_rewritten = False
    for line in text.split("\n"):
        if line.startswith("depends_on:"):
            def _to_cross(match: re.Match[str]) -> str:
                ref = match.group(2)
                if "/" in ref:
                    return match.group(0)
                return match.group(1) + f"{src_epic}/{ref}" + match.group(3)
            new_line = re.sub(r'(["\s,\[])([^"\s,\[\]]+)(["\s,\]])', _to_cross, line)
            if new_line != line:
                self_refs_rewritten = True
                line = new_line
        new_text_lines.append(line)
    text = "\n".join(new_text_lines)
    dst_path.write_text(text, encoding="utf-8")
    src_path.unlink()

    old_cross = f"{src_epic}/{src_basename}"
    new_cross = f"{args.to_epic}/{new_basename}"
    refs_updated = 0
    epics_dir = args.initiative_store / "epics"

    for ef in epics_dir.iterdir():
        if not ef.is_dir():
            continue
        for sf in ef.glob("*.md"):
            if sf == dst_path:
                continue
            t = sf.read_text(encoding="utf-8")
            new_lines: list[str] = []
            changed = False
            for line in t.split("\n"):
                if line.startswith("depends_on:"):
                    if old_cross in line:
                        line = line.replace(old_cross, new_cross)
                        changed = True
                    if ef.name == src_epic:
                        # Within-epic siblings used the bare basename; rewrite to cross-epic form.
                        pattern = rf'(["\s,\[]){re.escape(src_basename)}(?=["\s,\]])'
                        new_line = re.sub(pattern, lambda mm: mm.group(1) + new_cross, line)
                        if new_line != line:
                            line = new_line
                            changed = True
                new_lines.append(line)
            if changed:
                sf.write_text("\n".join(new_lines), encoding="utf-8")
                refs_updated += 1

    print(f"moved {old_cross} -> {new_cross}", file=sys.stderr)
    print(json.dumps({"old": old_cross, "new": new_cross, "refs_updated": refs_updated, "path": str(dst_path)}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
