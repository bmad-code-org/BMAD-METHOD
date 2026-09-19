#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Fan the knowledge documents out from bmad-meta/ into the skills that carry them.

A skill must be self-contained once installed, so every skill that names a
document ships its own copy. Editing 22 copies by hand is how they drift, so
bmad-meta/ at the repo root is the only copy anyone edits and this script
writes the rest.

Nothing here decides which skill gets which document: each manifest's
`knowledge` list already says so, and a path in that list is where the copy
lands inside the skill. A shared document a skill no longer names is deleted,
so moving a skill between groups is one manifest edit and a sync.

Only documents that exist in bmad-meta/ are managed. A skill may carry a
document of its own that no other skill has, and anything else the skill puts
in bmad-meta/ is its own business — this script leaves both alone. That a
declared document actually exists is tools/validate_manifests.py's job.

Usage:
  uv run tools/sync_knowledge.py            # report drift, change nothing
  uv run tools/sync_knowledge.py --write    # make the copies match
"""

from __future__ import annotations

import argparse
import shutil
import sys
import tomllib
from pathlib import Path, PurePosixPath

sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "bmad-meta"
SKILLS = ROOT / "skills"
CARRIED_DIR = "bmad-meta"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Sync knowledge documents from bmad-meta/ into the skills.")
    parser.add_argument("--write", action="store_true", help="write the copies instead of reporting drift")
    args = parser.parse_args(argv)

    if not SOURCE.is_dir():
        print(f"missing source directory {SOURCE.relative_to(ROOT)}", file=sys.stderr)
        return 1

    stale: list[str] = []
    orphans: list[str] = []
    written = 0
    shared = {path.relative_to(SOURCE) for path in SOURCE.rglob("*") if path.is_file()}

    for folder in sorted(path for path in SKILLS.iterdir() if path.is_dir()):
        manifest = folder / "module-manifest.toml"
        if not manifest.is_file():
            continue
        declared = tomllib.loads(manifest.read_text(encoding="utf-8")).get("knowledge")
        if not isinstance(declared, list):
            continue

        wanted: set[Path] = set()
        for entry in declared:
            if not isinstance(entry, str):
                continue
            relative = PurePosixPath(entry)
            inside = Path(*relative.parts[1:]) if relative.parts[0] == CARRIED_DIR else Path(relative.name)
            # A document with no copy in bmad-meta/ belongs to this skill alone.
            if inside not in shared:
                continue
            source = SOURCE / inside
            target = folder.joinpath(*relative.parts)
            wanted.add(target)
            if target.is_file() and target.read_bytes() == source.read_bytes():
                continue
            stale.append(target.relative_to(ROOT).as_posix())
            if args.write:
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, target)
                written += 1

        # A shared document the skill stopped naming has no business staying
        # behind. Anything not in bmad-meta/ is the skill's own and is left.
        carried = folder / CARRIED_DIR
        if carried.is_dir():
            for present in sorted(carried.rglob("*")):
                if present.is_file() and present.relative_to(carried) in shared and present not in wanted:
                    orphans.append(present.relative_to(ROOT).as_posix())
                    if args.write:
                        present.unlink()

    if args.write:
        print(f"Synced {written} copies, removed {len(orphans)} orphans.")
        return 0

    if stale or orphans:
        print(f"Knowledge copies are out of date ({len(stale)} stale, {len(orphans)} orphaned).", file=sys.stderr)
        for item in stale:
            print(f"  stale    {item}", file=sys.stderr)
        for item in orphans:
            print(f"  orphaned {item}", file=sys.stderr)
        print("\nEdit bmad-meta/, then run: uv run tools/sync_knowledge.py --write", file=sys.stderr)
        return 1

    print("Knowledge copies match bmad-meta/.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
