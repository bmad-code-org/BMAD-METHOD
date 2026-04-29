#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Bootstrap an epic folder and its epic.md with locked v7 front matter.

Output (stdout, JSON): {"epic": "<folder>", "epic_nn": "NN", "path": "<abs path>"}
Errors and progress on stderr. Exit codes: 0 ok, 1 user error, 2 internal error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_PATH = SKILL_ROOT / "resources" / "epic-md-template.md"


def slugify(title: str, max_len: int = 40) -> str:
    s = title.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:max_len].rstrip("-")


def yaml_quote(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    ap.add_argument("--epic-nn", required=True, type=int, help="Ordinal in the epic list (1-based)")
    ap.add_argument("--title", required=True)
    ap.add_argument(
        "--depends-on",
        default="",
        help="Comma-separated epic NNs the new epic depends on (e.g. '01,03')",
    )
    args = ap.parse_args()

    nn = f"{args.epic_nn:02d}"
    folder = f"{nn}-{slugify(args.title)}"
    epic_dir = args.initiative_store / "epics" / folder
    if epic_dir.exists():
        print(f"epic folder already exists: {epic_dir}", file=sys.stderr)
        return 1

    if not TEMPLATE_PATH.is_file():
        print(f"template missing: {TEMPLATE_PATH}", file=sys.stderr)
        return 2

    epic_dir.mkdir(parents=True)

    deps = [d.strip().zfill(2) for d in args.depends_on.split(",") if d.strip()]
    deps_yaml = "[" + ", ".join(yaml_quote(d) for d in deps) + "]"

    body = TEMPLATE_PATH.read_text(encoding="utf-8").replace("{{title}}", args.title)
    front = (
        "---\n"
        f"title: {yaml_quote(args.title)}\n"
        f"epic: {yaml_quote(nn)}\n"
        "status: draft\n"
        f"depends_on: {deps_yaml}\n"
        "---\n\n"
    )
    epic_md = epic_dir / "epic.md"
    epic_md.write_text(front + body, encoding="utf-8")

    print(f"created {epic_md.relative_to(args.initiative_store)}", file=sys.stderr)
    print(json.dumps({"epic": folder, "epic_nn": nn, "path": str(epic_md)}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
