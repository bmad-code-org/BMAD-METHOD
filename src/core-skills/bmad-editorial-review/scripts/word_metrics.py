#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Exact word counts for a document, as JSON.

Emits the document's total word count and a per-heading-section breakdown so
an editorial review can ground word-impact estimates and reduction
percentages in real numbers instead of guessing. Sections are delimited by
markdown headings (# through ######); heading markers inside fenced code
blocks are ignored. A word is any whitespace-separated token. For non-markdown
input the result is a single section holding the full text.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HEADING = re.compile(r"^(#{1,6})\s+(\S.*)$")
FENCE = re.compile(r"^\s*(```|~~~)")


def word_count(text: str) -> int:
    return len(text.split())


def section_metrics(text: str) -> list[dict]:
    sections = []
    current = {"heading": "(preamble)", "level": 0, "body": []}
    in_fence = False
    for line in text.splitlines():
        if FENCE.match(line):
            in_fence = not in_fence
            current["body"].append(line)
            continue
        match = None if in_fence else HEADING.match(line)
        if match:
            sections.append(current)
            current = {
                "heading": match.group(2).strip(),
                "level": len(match.group(1)),
                "body": [],
            }
        else:
            current["body"].append(line)
    sections.append(current)

    out = []
    for section in sections:
        words = word_count("\n".join(section["body"]))
        if section["heading"] == "(preamble)" and words == 0:
            continue
        out.append(
            {"heading": section["heading"], "level": section["level"], "words": words}
        )
    return out


def metrics(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    return {
        "file": str(path),
        "total_words": word_count(text),
        "sections": section_metrics(text),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("path", help="document to measure")
    parser.add_argument("-o", "--output", help="write JSON here (default: stdout)")
    args = parser.parse_args()

    path = Path(args.path)
    if not path.is_file():
        print(f"error: not a readable file: {path}", file=sys.stderr)
        return 2

    result = json.dumps(metrics(path), indent=2, ensure_ascii=False)
    if args.output:
        Path(args.output).write_text(result + "\n", encoding="utf-8")
    else:
        print(result)
    return 0


if __name__ == "__main__":
    sys.exit(main())
