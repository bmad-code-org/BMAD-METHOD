#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""check-ids — find broken ID cross-references, duplicate definitions, and withdrawn citations.

Method opt-in lint hook run at Finalize/Validate for ID-heavy templates (`prd-program`, `prd`,
`prd-epic`, `charter`, `brd`, `srs`). Pairs with core-tools `check_doc.py` (which owns
placeholders, TOC, and `--forbid-prefix`).

An id is a token like REQ-3, ITEM-12 or CAP-4, or one carrying a scope prefix, like S02-REQ-07.
It is defined where it opens a heading, a table row's first cell, or a table cell, list item or
line in bold; an id may be bare, bold, or wrapped in backticks (`REQ-3`, **`REQ-3`**). An unbolded
list item or line defines it only when punctuation follows (`- REQ-3: ...`, ``- `REQ-3`: ...``,
`REQ-3 (withdrawn)`). An id that opens a list of ids (`REQ-1, REQ-2`, `REQ-1 to REQ-8`) is not a
definition. Every other occurrence is a reference, and a range such as `REQ-1 to REQ-8` references
each id in it. A table most of whose defining ids were already defined above it, such as a
traceability table, only references its ids. Fenced code blocks and HTML comments are skipped.
Definitions in any listed file count for references in all of them.

Unrecognized external hyphenated tokens (e.g. `UTF-8`, `UTC-5`) and out-of-order updates are
intentionally not flagged.

Prints JSON:
  undefined   referenced but never defined, for id prefixes defined somewhere in the files
  duplicate   defined more than once
  withdrawn   defined as withdrawn, removed, dropped or superseded, yet still referenced
  counts      per defined prefix: distinct ids defined and referenced
Locations are `file:line`. Exits 0, or 2 on bad usage or a missing file.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.

ID = r"(?<![A-Za-z0-9-])(?:[A-Z]\d+-)?[A-Z][A-Z0-9]{0,5}-\d+(?![A-Za-z0-9])"
TOKEN = re.compile(ID)
FRONTMATTER = re.compile(r"\A---[ \t]*\n(.*?)\n---[ \t]*(?:\n|\Z)", re.DOTALL)
FENCE_OPEN = re.compile(r"^ {0,3}(`{3,}|~{3,})")
COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)
QUOTE = re.compile(r"^(?: {0,3}> ?)+")
HEADING = re.compile(r"^ {0,3}#{1,6}[ \t]+")
LIST_ITEM = re.compile(r"^[ \t]*(?:[-*+]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?")
CONNECTOR = re.compile(rf"^(?:\*\*|`)*\s*(?:,|/|&|and\b|or\b|to\b|through\b|[–—-])\s*(?:\*\*|`)*{ID}")
SEPARATOR = re.compile(r"^\s*(?:[:.()/–—]|-\s)")
RANGE = re.compile(rf"({ID})(?:\*\*|`)*\s*(?:to|through|[–—-])\s*(?:\*\*|`)*({ID})")
WITHDRAWN = re.compile(r"^[\s*`:.)(—–-]*(?:withdrawn|removed|dropped|superseded)\b", re.IGNORECASE)
MAX_RANGE = 200


def split_frontmatter(text: str) -> tuple[str, int]:
    """Return (body_text, body_line_offset) with CRLF normalized."""
    norm = text.replace("\r\n", "\n")
    m = FRONTMATTER.match(norm)
    if not m:
        return norm, 0
    return norm[m.end() :], norm[: m.end()].count("\n")


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
    pos = 2 if bold else 0
    tick = text.startswith("`", pos)
    if tick:
        pos += 1
    m = TOKEN.match(text, pos)
    if not m:
        return None
    end = m.end()
    if tick:
        if not text.startswith("`", end):
            return None
        end += 1
    rest = text[end:]
    if CONNECTOR.match(rest):
        return None
    if needs_separator and not bold and not SEPARATOR.match(rest):
        return None
    return m


def is_table_row(line: str) -> bool:
    quote = QUOTE.match(line)
    return line[quote.end() if quote else 0 :].lstrip().startswith("|")


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
    """Scan markdown files for undefined, duplicate, and withdrawn IDs across defined families."""
    defined: dict[str, list[str]] = defaultdict(list)
    referenced: dict[str, list[str]] = defaultdict(list)
    withdrawn: set[str] = set()
    table: list[tuple[str, str, str]] = []

    def record_definition(where: str, token: str, rest: str) -> None:
        defined[token].append(where)
        if WITHDRAWN.match(rest):
            withdrawn.add(token)

    def close_table() -> None:
        # A table most of whose ids were defined above it is a reference table, such as traceability.
        cites = 2 * sum(token in defined for _, token, _ in table) > len(table)
        for where, token, rest in table:
            if cites:
                referenced[token].append(where)
            else:
                record_definition(where, token, rest)
        table.clear()

    for name, text in files:
        body_text, offset = split_frontmatter(text)
        prose = prose_lines(body_text)
        for number, line in enumerate(prose, 1 + offset):
            where = f"{name}:{number}"
            if table and not is_table_row(line):
                close_table()
            found = definition(line)
            if found:
                _, token, rest = found
                if is_table_row(line):
                    table.append((where, token, rest))
                else:
                    record_definition(where, token, rest)
            for m in TOKEN.finditer(line):
                tok = m.group(0)
                if not (found and m.start() == found[0]):
                    referenced[tok].append(where)
            for m in RANGE.finditer(line):
                (prefix, low), (other, high) = split_id(m.group(1)), split_id(m.group(2))
                if prefix == other and 0 < high - low <= MAX_RANGE:
                    width = len(m.group(1).rsplit("-", 1)[1])  # REQ-01 to REQ-03 names REQ-02, not REQ-2
                    for n in range(low + 1, high):
                        referenced[f"{prefix}-{n:0{width}d}"].append(where)
        close_table()

    prefixes = {split_id(token)[0] for token in defined}
    undefined = {
        token: list(dict.fromkeys(referenced[token]))
        for token in sorted(referenced, key=split_id)
        if token not in defined and split_id(token)[0] in prefixes
    }
    counts: dict[str, dict[str, int]] = defaultdict(lambda: {"defined": 0, "referenced": 0})
    for token in defined:
        counts[split_id(token)[0]]["defined"] += 1
    for token in referenced:
        prefix = split_id(token)[0]
        if prefix in prefixes:
            counts[prefix]["referenced"] += 1
    return {
        "undefined": undefined,
        "duplicate": {t: defined[t] for t in sorted(defined, key=split_id) if len(defined[t]) > 1},
        "withdrawn": {
            t: list(dict.fromkeys(referenced[t])) for t in sorted(withdrawn, key=split_id) if referenced.get(t)
        },
        "counts": dict(sorted(counts.items())),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Find broken id cross-references, duplicate definitions, and withdrawn citations."
    )
    parser.add_argument("files", nargs="+", metavar="FILE", help="document and optional companion markdown files")
    args = parser.parse_args(argv)
    files = []
    for name in args.files:
        path = Path(name)
        if not path.is_file():
            print(f"not found: {name}", file=sys.stderr)
            return 2
        files.append((name, path.read_text(encoding="utf-8")))
    print(json.dumps(scan(files), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
