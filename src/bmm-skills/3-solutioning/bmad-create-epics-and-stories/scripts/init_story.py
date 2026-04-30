#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Bootstrap a story file with locked v7 front matter inside an existing epic folder.

Output (stdout, JSON): {"story": "<basename>", "story_nn": "NN", "epic": "<folder>", "path": "<abs>"}
Errors and progress on stderr. Exit codes: 0 ok, 1 user error, 2 internal error.

The body skeleton's <!-- USER_STORY_START --> ... <!-- USER_STORY_END --> block is stripped
when --type=task. For type=feature, the stanza is required and remains in the skeleton.
For bug/spike it remains and is optional to fill.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_PATH = SKILL_ROOT / "resources" / "story-md-template.md"
TYPES = ("feature", "bug", "task", "spike")


def slugify(title: str, max_len: int = 40) -> str:
    s = title.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:max_len].rstrip("-")


def yaml_quote(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def render_body(template: str, title: str, story_type: str) -> str:
    body = template.replace("{{title}}", title)
    if story_type == "task":
        body = re.sub(
            r"\n*<!-- USER_STORY_START -->.*?<!-- USER_STORY_END -->\n*",
            "\n\n",
            body,
            flags=re.DOTALL,
        )
    # The resource file ends with a "Stripping rules" block that documents the
    # init script's behavior — that's reference material for the LLM, not story
    # content. Strip it so the rendered file is clean.
    body = re.sub(r"\n+---\n+\*\*Stripping rules\*\*.*$", "\n", body, flags=re.DOTALL)
    return body


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    ap.add_argument("--epic", required=True, help="Enclosing epic folder name (e.g. 01-billing-stripe)")
    ap.add_argument("--story-nn", required=True, type=int, help="Ordinal within the epic (1-based)")
    ap.add_argument("--title", required=True)
    ap.add_argument("--type", required=True, choices=TYPES)
    ap.add_argument(
        "--depends-on",
        default="",
        help="Comma-separated refs (within-epic basenames or <epic-folder>/<basename> cross-epic)",
    )
    args = ap.parse_args()

    epic_dir = args.initiative_store / "epics" / args.epic
    if not epic_dir.is_dir():
        print(f"epic folder does not exist: {epic_dir}", file=sys.stderr)
        return 1

    nn = f"{args.story_nn:02d}"
    basename = f"{nn}-{slugify(args.title)}"
    story_path = epic_dir / f"{basename}.md"
    if story_path.exists():
        print(f"story file already exists: {story_path}", file=sys.stderr)
        return 1

    if not TEMPLATE_PATH.is_file():
        print(f"template missing: {TEMPLATE_PATH}", file=sys.stderr)
        return 2

    deps = [d.strip() for d in args.depends_on.split(",") if d.strip()]
    deps_yaml = "[" + ", ".join(yaml_quote(d) for d in deps) + "]"

    body = render_body(TEMPLATE_PATH.read_text(encoding="utf-8"), args.title, args.type)
    front = (
        "---\n"
        f"title: {yaml_quote(args.title)}\n"
        f"type: {args.type}\n"
        "status: draft\n"
        f"epic: {args.epic}\n"
        f"depends_on: {deps_yaml}\n"
        "---\n\n"
    )
    story_path.write_text(front + body, encoding="utf-8")

    print(f"created {story_path.relative_to(args.initiative_store)}", file=sys.stderr)
    print(json.dumps({"story": basename, "story_nn": nn, "epic": args.epic, "path": str(story_path)}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
