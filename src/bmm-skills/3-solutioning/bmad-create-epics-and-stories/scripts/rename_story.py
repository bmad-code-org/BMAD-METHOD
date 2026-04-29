#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Rename or renumber a story safely; updates the file and rewrites depends_on refs.

The new basename is derived as `<NN>-<slug(--to-title)>` where:
  - NN comes from --to-nn if provided, else the existing NN.
  - slug(...) replaces non-alphanumerics with hyphens, max 40 chars.
  - If --to-title is omitted, the kebab portion is preserved (NN-only renumber).

Updates depends_on references in every story file across the whole tree:
  - Within the source epic, bare `<old-basename>` becomes `<new-basename>`.
  - Across epics, `<src-epic>/<old-basename>` becomes `<src-epic>/<new-basename>`.

Output (stdout, JSON): {"old": "<basename>", "new": "<basename>", "refs_updated": N, "path": "<abs>"}
Exit codes: 0 ok, 1 user error, 2 internal error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def slugify(title: str, max_len: int = 40) -> str:
    s = title.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:max_len].rstrip("-")


def yaml_quote(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def update_deps(path: Path, src_epic: str, src_basename: str, new_basename: str, *, file_in_src_epic: bool) -> bool:
    text = path.read_text(encoding="utf-8")
    new_lines: list[str] = []
    changed = False
    for line in text.split("\n"):
        if line.startswith("depends_on:"):
            old_cross = f"{src_epic}/{src_basename}"
            new_cross = f"{src_epic}/{new_basename}"
            if old_cross in line:
                line = line.replace(old_cross, new_cross)
                changed = True
            if file_in_src_epic:
                pattern = rf'(["\s,\[]){re.escape(src_basename)}(?=["\s,\]])'
                new_line = re.sub(pattern, lambda m: m.group(1) + new_basename, line)
                if new_line != line:
                    line = new_line
                    changed = True
        new_lines.append(line)
    if changed:
        path.write_text("\n".join(new_lines), encoding="utf-8")
    return changed


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    ap.add_argument("--epic", required=True, help="Enclosing epic folder name (e.g. 01-billing-stripe)")
    ap.add_argument("--from", dest="src", required=True, help="Old story basename (without .md)")
    ap.add_argument("--to-title", help="New title — derives a new kebab-slug; if omitted, preserves the kebab")
    ap.add_argument("--to-nn", type=int, help="New numeric prefix; if omitted, preserves the existing NN")
    args = ap.parse_args()

    epic_dir = args.initiative_store / "epics" / args.epic
    src_path = epic_dir / f"{args.src}.md"
    if not src_path.is_file():
        print(f"source story not found: {src_path}", file=sys.stderr)
        return 1

    m = re.match(r"^(\d+)-(.+)$", args.src)
    if not m:
        print(f"source basename does not start with NN-: {args.src}", file=sys.stderr)
        return 1
    src_nn, src_kebab = m.group(1), m.group(2)

    new_nn = f"{args.to_nn:02d}" if args.to_nn is not None else src_nn.zfill(2)
    new_kebab = slugify(args.to_title) if args.to_title else src_kebab
    new_basename = f"{new_nn}-{new_kebab}"
    if new_basename == args.src:
        print("nothing to change", file=sys.stderr)
        print(json.dumps({"old": args.src, "new": new_basename, "refs_updated": 0, "path": str(src_path)}))
        return 0

    dst_path = epic_dir / f"{new_basename}.md"
    if dst_path.exists():
        print(f"target already exists: {dst_path}", file=sys.stderr)
        return 1

    src_path.rename(dst_path)

    if args.to_title:
        text = dst_path.read_text(encoding="utf-8")
        text = re.sub(r"^title:.*$", f"title: {yaml_quote(args.to_title)}", text, count=1, flags=re.MULTILINE)
        dst_path.write_text(text, encoding="utf-8")

    refs_updated = 0
    epics_dir = args.initiative_store / "epics"
    for ef in epics_dir.iterdir():
        if not ef.is_dir():
            continue
        for sf in ef.glob("*.md"):
            if sf == dst_path:
                continue
            if update_deps(sf, args.epic, args.src, new_basename, file_in_src_epic=(ef.name == args.epic)):
                refs_updated += 1

    print(f"renamed {args.src} -> {new_basename}", file=sys.stderr)
    print(json.dumps({"old": args.src, "new": new_basename, "refs_updated": refs_updated, "path": str(dst_path)}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
