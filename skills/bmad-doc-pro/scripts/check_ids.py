#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""check-ids — find broken id cross-references in a document and its companions.

An id is a token like FR-3, UJ-12 or CAP-4. It is defined where it opens a heading, a table
row's first cell, or a table cell, list item or line in bold. An unbolded list item or line
defines it only when punctuation follows (`- FR-3: ...`, `FR-3 (withdrawn)`). An id that opens
a list of ids (`FR-1, FR-2`, `FR-1 to FR-8`) is not a definition. Every other occurrence is a
reference, and a range such as `FR-1 to FR-8` references each id in it. Fenced code blocks
and HTML comments are skipped. Definitions in any listed file count for references in all of
them, so an addendum can cite the document.

Prints JSON:
  undefined       referenced but never defined, where other ids with that prefix are defined
  unknown_prefix  referenced, and no id with that prefix is defined anywhere; often an outside
                  name such as UTC-5, sometimes a whole family that was removed
  duplicate       defined more than once
  withdrawn       defined as withdrawn, removed, dropped or superseded, yet still referenced
  counts          per prefix: distinct ids defined and referenced
Locations are `file:line`. Exits 0, or 2 when a file is missing.
"""

from __future__ import annotations

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ID = r"(?<![A-Za-z0-9-])[A-Z][A-Z0-9]{0,5}-\d+(?![A-Za-z0-9])"
TOKEN = re.compile(ID)
FENCE_OPEN = re.compile(r"^ {0,3}(`{3,}|~{3,})")
COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)
QUOTE = re.compile(r"^(?: {0,3}> ?)+")
HEADING = re.compile(r"^ {0,3}#{1,6}[ \t]+")
LIST_ITEM = re.compile(r"^[ \t]*(?:[-*+]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?")
CONNECTOR = re.compile(rf"^(?:\*\*)?\s*(?:,|/|&|and\b|or\b|to\b|through\b|[–—-])\s*(?:\*\*)?{ID}")
SEPARATOR = re.compile(r"^\s*(?:[:.()/–—]|-\s)")
RANGE = re.compile(rf"({ID})(?:\*\*)?\s*(?:to|through|[–—-])\s*(?:\*\*)?({ID})")
WITHDRAWN = re.compile(r"^[\s*:.)(—–-]*(?:withdrawn|removed|dropped|superseded)\b", re.IGNORECASE)
MAX_RANGE = 200


def code_mask(lines: list[str]) -> list[bool]:
    """True for each line inside (or fencing) a fenced code block."""
    mask, fence = [], None
    for line in lines:
        m = FENCE_OPEN.match(line)
        if fence is None:
            if m:
                fence = m.group(1)
            mask.append(fence is not None)
        else:
            mask.append(True)
            if m and m.group(1)[0] == fence[0] and len(m.group(1)) >= len(fence) and not line.strip(" `~"):
                fence = None
    return mask


def prose_lines(text: str) -> list[str]:
    """The document's lines with fenced code and HTML comments blanked, numbering kept."""
    lines = text.replace("\r\n", "\n").split("\n")
    lines = ["" if in_code else line for line, in_code in zip(lines, code_mask(lines), strict=True)]
    joined = COMMENT.sub(lambda m: "\n" * m.group(0).count("\n"), "\n".join(lines))
    return joined.split("\n")


def opening_id(text: str, *, bold_only: bool = False, needs_separator: bool = False) -> re.Match | None:
    """The id that opens `text` as a definition, or None."""
    bold = text.startswith("**")
    if bold_only and not bold:
        return None
    m = TOKEN.match(text, 2 if bold else 0)
    if not m:
        return None
    rest = text[m.end() :]
    if CONNECTOR.match(rest):
        return None
    if needs_separator and not bold and not SEPARATOR.match(rest):
        return None
    return m


def definition(line: str) -> tuple[int, str, str] | None:
    """(column, id, text after it) for the id a line defines, or None."""
    quote = QUOTE.match(line)
    start = quote.end() if quote else 0
    body = line[start:]
    if body.lstrip().startswith("|"):
        offset = start + body.index("|") + 1
        for i, cell in enumerate(body.lstrip()[1:].split("|")):
            lead = len(cell) - len(cell.lstrip())
            m = opening_id(cell.strip(), bold_only=i > 0)
            if m:
                return offset + lead + m.start(), m.group(0), cell.strip()[m.end() :]
            offset += len(cell) + 1
        return None
    for pattern in (HEADING, LIST_ITEM):
        lead = pattern.match(body)
        if lead:
            m = opening_id(body[lead.end() :], needs_separator=pattern is LIST_ITEM)
            return (start + lead.end() + m.start(), m.group(0), body[lead.end() + m.end() :]) if m else None
    lead = len(body) - len(body.lstrip())
    m = opening_id(body.lstrip(), needs_separator=True)
    return (start + lead + m.start(), m.group(0), body.lstrip()[m.end() :]) if m else None


def split_id(token: str) -> tuple[str, int]:
    prefix, number = token.rsplit("-", 1)
    return prefix, int(number)


def scan(files: list[tuple[str, str]]) -> dict:
    defined: dict[str, list[str]] = defaultdict(list)
    referenced: dict[str, list[str]] = defaultdict(list)
    withdrawn: set[str] = set()
    for name, text in files:
        for number, line in enumerate(prose_lines(text), 1):
            where = f"{name}:{number}"
            found = definition(line)
            if found:
                column, token, rest = found
                defined[token].append(where)
                if WITHDRAWN.match(rest):
                    withdrawn.add(token)
            for m in TOKEN.finditer(line):
                if not (found and m.start() == found[0]):
                    referenced[m.group(0)].append(where)
            for m in RANGE.finditer(line):
                (prefix, low), (other, high) = split_id(m.group(1)), split_id(m.group(2))
                if prefix == other and 0 < high - low <= MAX_RANGE:
                    for n in range(low + 1, high):
                        referenced[f"{prefix}-{n}"].append(where)

    prefixes = {split_id(token)[0] for token in defined}
    undefined, unknown = {}, {}
    for token in sorted(referenced, key=split_id):
        if token not in defined:
            (undefined if split_id(token)[0] in prefixes else unknown)[token] = list(dict.fromkeys(referenced[token]))
    counts: dict[str, dict[str, int]] = defaultdict(lambda: {"defined": 0, "referenced": 0})
    for token in defined:
        counts[split_id(token)[0]]["defined"] += 1
    for token in referenced:
        counts[split_id(token)[0]]["referenced"] += 1
    return {
        "undefined": undefined,
        "unknown_prefix": unknown,
        "duplicate": {t: defined[t] for t in sorted(defined, key=split_id) if len(defined[t]) > 1},
        "withdrawn": {
            t: list(dict.fromkeys(referenced[t])) for t in sorted(withdrawn, key=split_id) if referenced.get(t)
        },
        "counts": dict(sorted(counts.items())),
    }


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: check_ids.py <document.md> [<companion.md> ...]", file=sys.stderr)
        return 2
    files = []
    for name in argv:
        path = Path(name)
        if not path.is_file():
            print(f"not found: {name}", file=sys.stderr)
            return 2
        files.append((name, path.read_text(encoding="utf-8")))
    print(json.dumps(scan(files), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
