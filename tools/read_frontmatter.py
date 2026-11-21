#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""Print the frontmatter of Markdown files as JSON, for tooling outside Python.

Reads one file path per line on stdin and prints an object keyed by each path:
`{"fields": {...}}` with every scalar as text, `{}` fields for a file with no
frontmatter, or `{"error": "..."}` when the frontmatter does not close or is not
a YAML mapping,
with the line and problem for YAML that does not parse.

Usage: uv run tools/read_frontmatter.py < paths.txt
"""

import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "skills" / "core-tools" / "bmad" / "scripts"))
import frontmatter  # noqa: E402


def read(path: str) -> dict:
    text = Path(path).read_text(encoding="utf-8")
    try:
        block = frontmatter.split(text)[0]
    except ValueError as error:
        return {"fields": {}} if "no frontmatter" in str(error) else {"error": str(error)}
    try:
        return {"fields": frontmatter.load(block)}
    except ValueError as error:
        mark = getattr(error.__cause__, "problem_mark", None)
        if mark is None:
            return {"error": str(error)}
        return {"error": f"line {mark.line + 2}: {error.__cause__.problem}"}  # the block starts after `---`


def main() -> int:
    paths = [line for line in sys.stdin.read().splitlines() if line]
    json.dump({path: read(path) for path in paths}, sys.stdout, ensure_ascii=False)
    return 0


if __name__ == "__main__":
    sys.exit(main())
