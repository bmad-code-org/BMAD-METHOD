#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""check-ids — find broken id cross-references and a stale table of contents.

An id is a token like FR-3, UJ-12 or CAP-4. It is defined where it opens a heading, a table
row's first cell, or a table cell, list item or line in bold. An unbolded list item or line
defines it only when punctuation follows (`- FR-3: ...`, `FR-3 (withdrawn)`). An id that opens
a list of ids (`FR-1, FR-2`, `FR-1 to FR-8`) is not a definition. Every other occurrence is a
reference, and a range such as `FR-1 to FR-8` references each id in it. A table most of whose
defining ids were already defined above it, such as a traceability table, only references its ids. Fenced code blocks
and HTML comments are skipped. Definitions in any listed file count for references in all of
them, so one file can cite another's.

A file with a `## Table of Contents` has its links compared to its own headings, using
GitHub's anchors. Every `##` section needs an entry; entries may also link deeper headings.

Prints JSON:
  undefined       referenced but never defined, where other ids with that prefix are defined
  unknown_prefix  referenced, and no id with that prefix is defined anywhere; often an outside
                  name such as UTC-5, sometimes a whole family that was removed
  duplicate       defined more than once
  withdrawn       defined as withdrawn, removed, dropped or superseded, yet still referenced
  toc             missing: `##` sections with no entry; stale: entries whose heading is gone;
                  out_of_order: tables whose entries do not follow the sections' order
  counts          per prefix: distinct ids defined and referenced
Locations are `file:line`. Exits 0, or 2 when a file is missing.
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
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
TITLED_HEADING = re.compile(r"^ {0,3}(#{1,6})[ \t]+(.+?)[ \t#]*$")
TOC_LINK = re.compile(r"\[[^\]]*\]\(#([^)\s]+)\)")
TOC_ANCHOR = "table-of-contents"
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


def anchor(heading: str) -> str:
    """GitHub's anchor for a heading: lowercase, punctuation dropped, spaces as hyphens."""
    return re.sub(r"[^\w\- ]", "", heading.lower()).replace(" ", "-")


def check_toc(name: str, text: str, toc: dict) -> None:
    """Add this file's table-of-contents problems to `toc`."""
    lines = prose_lines(text)
    headings: list[tuple[int, int, str, str]] = []
    seen: Counter[str] = Counter()
    for number, line in enumerate(lines, 1):
        m = TITLED_HEADING.match(line)
        if m:
            base = anchor(m.group(2))
            headings.append((number, len(m.group(1)), f"{base}-{seen[base]}" if seen[base] else base, m.group(2)))
            seen[base] += 1
    table = next((i for i, h in enumerate(headings) if h[1] == 2 and h[2] == TOC_ANCHOR), None)
    if table is None:
        return

    start = headings[table][0]
    end = headings[table + 1][0] - 1 if table + 1 < len(headings) else len(lines)
    links = [
        (number, m.group(1)) for number, line in enumerate(lines[start:end], start + 1) for m in TOC_LINK.finditer(line)
    ]
    anchors = {h[2] for i, h in enumerate(headings) if i != table}
    sections = [h for i, h in enumerate(headings) if i != table and h[1] == 2]
    targets = [target for _, target in links]
    for number, _, slug, title in sections:
        if slug not in targets:
            toc["missing"].setdefault(title, []).append(f"{name}:{number}")
    for number, target in links:
        if target not in anchors:
            toc["stale"].setdefault(target, []).append(f"{name}:{number}")
    order = [slug for _, _, slug, _ in sections]
    if [t for t in targets if t in order] != [slug for slug in order if slug in targets]:
        toc["out_of_order"].append(f"{name}:{start}")


def scan(files: list[tuple[str, str]]) -> dict:
    defined: dict[str, list[str]] = defaultdict(list)
    referenced: dict[str, list[str]] = defaultdict(list)
    withdrawn: set[str] = set()
    toc: dict = {"missing": {}, "stale": {}, "out_of_order": []}
    table: list[tuple[str, str, str]] = []

    def close_table() -> None:
        # A table most of whose ids were defined above it is a reference table, such as traceability.
        cites = 2 * sum(token in defined for _, token, _ in table) > len(table)
        for where, token, rest in table:
            if cites:
                referenced[token].append(where)
                continue
            defined[token].append(where)
            if WITHDRAWN.match(rest):
                withdrawn.add(token)
        table.clear()

    for name, text in files:
        check_toc(name, text, toc)
        for number, line in enumerate(prose_lines(text), 1):
            where = f"{name}:{number}"
            if table and not is_table_row(line):
                close_table()
            found = definition(line)
            if found:
                column, token, rest = found
                if is_table_row(line):
                    table.append((where, token, rest))
                else:
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
        close_table()

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
        "toc": toc,
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
