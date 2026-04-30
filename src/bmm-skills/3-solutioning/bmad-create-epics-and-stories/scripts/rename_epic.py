#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Rename or renumber an epic folder safely; rewrites every reference across the tree.

Inputs:
  --epic <NN-kebab>     existing epic folder to rename
  --to-title <text>     new title -> derives a new kebab slug (max 40 chars)
  --to-nn <int>         new numeric prefix; if omitted, preserves the existing NN

When the epic moves from `src-folder` (NN-kebab) to `dst-folder`:
  - The folder is renamed.
  - epic.md `title:` is updated when --to-title was supplied.
  - epic.md `epic:` field (the NN scalar) is updated when --to-nn was supplied.
  - Every story file under the renamed folder gets `epic: <dst-folder>` rewritten.
  - Every cross-epic depends_on across the whole tree referencing `<src-folder>/...`
    is rewritten to `<dst-folder>/...`.
  - Every other epic.md whose depends_on listed the old NN gets its NN updated when --to-nn.

This script does not handle NN collisions: if --to-nn is the NN of another epic,
the rename fails. Use it after renumbering the colliding epic out of the way.

Output (stdout, JSON): {"old": "<folder>", "new": "<folder>", "refs_updated": N, "path": "<abs>"}
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


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    ap.add_argument("--epic", dest="src", required=True, help="Existing folder name (e.g. 02-billing-stripe)")
    ap.add_argument("--to-title", help="New title; derives a new kebab slug")
    ap.add_argument("--to-nn", type=int, help="New numeric prefix; preserves existing NN if omitted")
    args = ap.parse_args()

    epics_dir = args.initiative_store / "epics"
    src_dir = epics_dir / args.src
    if not src_dir.is_dir():
        print(f"epic folder not found: {src_dir}", file=sys.stderr)
        return 1

    m = re.match(r"^(\d+)-(.+)$", args.src)
    if not m:
        print(f"epic folder does not start with NN-: {args.src}", file=sys.stderr)
        return 1
    src_nn, src_kebab = m.group(1), m.group(2)
    new_nn = f"{args.to_nn:02d}" if args.to_nn is not None else src_nn.zfill(2)
    new_kebab = slugify(args.to_title) if args.to_title else src_kebab
    new_folder = f"{new_nn}-{new_kebab}"
    if new_folder == args.src:
        print("nothing to change", file=sys.stderr)
        print(json.dumps({"old": args.src, "new": new_folder, "refs_updated": 0, "path": str(src_dir)}))
        return 0

    dst_dir = epics_dir / new_folder
    if dst_dir.exists():
        print(f"target already exists: {dst_dir}", file=sys.stderr)
        return 1

    if args.to_nn is not None:
        for ed in epics_dir.iterdir():
            if not ed.is_dir() or ed.name == args.src:
                continue
            other_m = re.match(r"^(\d+)-", ed.name)
            if other_m and other_m.group(1).zfill(2) == new_nn:
                print(f"NN {new_nn} is already used by {ed.name}; renumber it first", file=sys.stderr)
                return 1

    src_dir.rename(dst_dir)

    epic_md = dst_dir / "epic.md"
    if epic_md.is_file():
        text = epic_md.read_text(encoding="utf-8")
        if args.to_title:
            text = re.sub(r"^title:.*$", f"title: {yaml_quote(args.to_title)}", text, count=1, flags=re.MULTILINE)
        if args.to_nn is not None:
            text = re.sub(r"^epic:.*$", f"epic: {yaml_quote(new_nn)}", text, count=1, flags=re.MULTILINE)
        epic_md.write_text(text, encoding="utf-8")

    refs_updated = 0

    for sf in dst_dir.glob("*.md"):
        if sf.name == "epic.md":
            continue
        t = sf.read_text(encoding="utf-8")
        new = re.sub(r"^epic:.*$", f"epic: {yaml_quote(new_folder)}", t, count=1, flags=re.MULTILINE)
        if new != t:
            sf.write_text(new, encoding="utf-8")
            refs_updated += 1

    for ed in epics_dir.iterdir():
        if not ed.is_dir():
            continue
        for sf in ed.glob("*.md"):
            if sf.name == "epic.md":
                t = sf.read_text(encoding="utf-8")
                new_lines: list[str] = []
                changed = False
                for line in t.split("\n"):
                    if line.startswith("depends_on:") and args.to_nn is not None:
                        pattern = rf'(["\s,\[]){re.escape(src_nn.zfill(2))}(["\s,\]])'
                        new_line = re.sub(pattern, lambda mm: mm.group(1) + new_nn + mm.group(2), line)
                        if new_line != line:
                            line = new_line
                            changed = True
                    new_lines.append(line)
                if changed:
                    sf.write_text("\n".join(new_lines), encoding="utf-8")
                    refs_updated += 1
                continue
            t = sf.read_text(encoding="utf-8")
            new_lines = []
            changed = False
            for line in t.split("\n"):
                if line.startswith("depends_on:") and f"{args.src}/" in line:
                    line = line.replace(f"{args.src}/", f"{new_folder}/")
                    changed = True
                new_lines.append(line)
            if changed:
                sf.write_text("\n".join(new_lines), encoding="utf-8")
                refs_updated += 1

    print(f"renamed {args.src} -> {new_folder}", file=sys.stderr)
    print(json.dumps({"old": args.src, "new": new_folder, "refs_updated": refs_updated, "path": str(dst_dir)}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
