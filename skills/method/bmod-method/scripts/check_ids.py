#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
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
each id in it. A table most of whose defining ids were already defined above it (or in supplied
parent/source files), such as a traceability table, only references its ids. Fenced code blocks
and HTML comments are skipped. Definitions in any listed file or resolved frontmatter `sources:`
parent document count for references; `sources:` / `--context` files act as read-only definition
context and never count toward `duplicate` or target `counts`.

Unrecognized external hyphenated tokens (e.g. `UTF-8`, `UTC-5`) and out-of-order updates are
intentionally not flagged.

Prints JSON:
  undefined   referenced but never defined, for id prefixes defined in the files or parent context
  duplicate   defined more than once across the target files
  withdrawn   defined as withdrawn, removed, dropped or superseded, yet still referenced
  counts      per prefix defined in the target files: distinct ids defined and referenced
Locations are `file:line`. Exits 0, or 2 on bad usage or a missing file.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from collections import defaultdict
from collections.abc import Iterable
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.

ID = r"(?<![A-Za-z0-9-])(?:[A-Z]\d+-)?[A-Z][A-Z0-9]{0,5}-\d+(?![A-Za-z0-9])"
TOKEN = re.compile(ID)
FENCE_OPEN = re.compile(r"^ {0,3}(`{3,}|~{3,})")
QUOTE = re.compile(r"^(?: {0,3}> ?)+")
HEADING = re.compile(r"^ {0,3}#{1,6}[ \t]+")
LIST_ITEM = re.compile(r"^[ \t]*(?:[-*+]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?")
CONNECTOR = re.compile(rf"^(?:\*\*|`)*\s*(?:,|/|&|and\b|or\b|to\b|through\b|[–—-])\s*(?:\*\*|`)*{ID}")
SEPARATOR = re.compile(r"^\s*(?:[:.()/–—]|-\s)")
RANGE = re.compile(rf"({ID})(?:\*\*|`)*\s*(?:to|through|[–—-])\s*(?:\*\*|`)*({ID})")
WITHDRAWN = re.compile(r"^[\s*`:.)(—–-]*(?:withdrawn|removed|dropped|superseded)\b", re.IGNORECASE)
MAX_RANGE = 200


def _load_frontmatter(start_paths: Iterable[Path] = ()):
    """Load shared `frontmatter.py` from `_bmad/scripts/`, an adjacent `bmad` skill, or repo checkout."""
    candidates: list[Path] = []
    for start in [*start_paths, Path.cwd()]:
        cur = start if start.is_dir() else start.parent
        for root in (cur, *cur.parents):
            candidates.append(root / "_bmad" / "scripts" / "frontmatter.py")
    skills = Path(__file__).resolve().parents[2]
    candidates.extend(
        [
            skills / "bmad" / "scripts" / "frontmatter.py",
            skills.parent / "core-tools" / "bmad" / "scripts" / "frontmatter.py",
        ]
    )
    for path in candidates:
        if path.is_file():
            spec = importlib.util.spec_from_file_location("bmad_frontmatter", path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
    raise FileNotFoundError("frontmatter.py not found in _bmad/scripts/ or installed bmad skill")


frontmatter = _load_frontmatter()


def split_frontmatter(text: str) -> tuple[str, str, int]:
    """Return (frontmatter_text, body_text, body_line_offset) with CRLF normalized."""
    norm = text.replace("\r\n", "\n")
    try:
        fm_text, body_text = frontmatter.split(norm)
    except ValueError:
        return "", norm, 0
    return fm_text, body_text, norm[: len(norm) - len(body_text)].count("\n")


def prose_lines(text: str) -> list[str]:
    """The document's lines with fenced code and HTML comments blanked, numbering kept."""
    lines = text.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    fence: tuple[str, int] | None = None
    in_comment = False
    for line in lines:
        if fence is not None:
            out.append("")
            m = FENCE_OPEN.match(line)
            if m and m.group(1)[0] == fence[0] and len(m.group(1)) >= fence[1] and not line[m.end() :].strip(" \t"):
                fence = None
            continue
        if not in_comment:
            m = FENCE_OPEN.match(line)
            if m and (m.group(1)[0] == "~" or "`" not in line[m.end() :]):
                fence = (m.group(1)[0], len(m.group(1)))
                out.append("")
                continue
        pos = 0
        buf: list[str] = []
        while pos < len(line):
            if in_comment:
                end = line.find("-->", pos)
                if end == -1:
                    break
                in_comment = False
                pos = end + 3
            else:
                start = line.find("<!--", pos)
                if start == -1:
                    buf.append(line[pos:])
                    break
                buf.append(line[pos:start])
                in_comment = True
                pos = start + 4
        out.append("".join(buf))
    return out


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


def _resolve_source_path(raw: str, doc_path: Path) -> Path | None:
    target = raw.split("#", 1)[0].strip()
    if not target or "://" in target or Path(target).suffix.lower() != ".md":
        return None
    rel = Path(target).expanduser()
    if rel.is_absolute():
        return rel.resolve() if rel.is_file() else None
    roots = [doc_path.parent]
    for parent in (doc_path.parent, *doc_path.parent.parents):
        if (parent / "_bmad").is_dir():
            roots.append(parent)
            break
    roots.append(Path.cwd())
    for root in roots:
        candidate = root / rel
        if candidate.is_file():
            return candidate.resolve()
    return None


def resolve_frontmatter_sources(file_paths: Iterable[Path]) -> list[tuple[str, str]]:
    """Read existing local markdown `sources:` referenced by `file_paths` as parent context."""
    paths = [p for p in file_paths if p.is_file()]
    primary = {p.resolve() for p in paths}
    seen = set(primary)
    contexts: list[tuple[str, str]] = []
    for doc_path in paths:
        fm_text, _, _ = split_frontmatter(doc_path.read_text(encoding="utf-8"))
        if not fm_text:
            continue
        try:
            meta = frontmatter.load(fm_text)
        except ValueError:
            continue
        sources = meta.get("sources")
        if not isinstance(sources, list):
            continue
        for entry in sources:
            if not isinstance(entry, str):
                continue
            resolved = _resolve_source_path(entry, doc_path.resolve())
            if resolved is None or resolved in seen:
                continue
            seen.add(resolved)
            contexts.append((str(resolved), resolved.read_text(encoding="utf-8")))
    return contexts


def _index_files(
    files: list[tuple[str, str]], seed_defined: Iterable[str] = ()
) -> tuple[dict[str, list[str]], dict[str, list[str]], set[str]]:
    defined: dict[str, list[str]] = defaultdict(list)
    referenced: dict[str, list[str]] = defaultdict(list)
    withdrawn: set[str] = set()
    seeded = set(seed_defined)
    table: list[tuple[str, str, str]] = []

    def record_definition(where: str, token: str, rest: str) -> None:
        defined[token].append(where)
        if WITHDRAWN.match(rest):
            withdrawn.add(token)

    def close_table() -> None:
        # A table most of whose ids were defined above it (or in parent context) is a reference table.
        cites = 2 * sum((token in defined or token in seeded) for _, token, _ in table) > len(table)
        for where, token, rest in table:
            if cites:
                referenced[token].append(where)
            else:
                record_definition(where, token, rest)
        table.clear()

    for name, text in files:
        _, body_text, offset = split_frontmatter(text)
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

    return defined, referenced, withdrawn


def scan(files: list[tuple[str, str]], context_files: list[tuple[str, str]] = ()) -> dict:
    """Scan markdown files for undefined, duplicate, and withdrawn IDs across defined and parent families."""
    ctx_defined_set: set[str] = set()
    ctx_withdrawn: set[str] = set()
    if context_files:
        ctx_defined, _, ctx_withdrawn = _index_files(context_files)
        ctx_defined_set = set(ctx_defined)

    defined, referenced, withdrawn = _index_files(files, seed_defined=ctx_defined_set)
    all_defined = set(defined) | ctx_defined_set
    all_prefixes = {split_id(token)[0] for token in all_defined}
    target_prefixes = {split_id(token)[0] for token in defined}

    undefined = {
        token: list(dict.fromkeys(referenced[token]))
        for token in sorted(referenced, key=split_id)
        if token not in all_defined and split_id(token)[0] in all_prefixes
    }
    counts: dict[str, dict[str, int]] = defaultdict(lambda: {"defined": 0, "referenced": 0})
    for token in defined:
        counts[split_id(token)[0]]["defined"] += 1
    for token in referenced:
        prefix = split_id(token)[0]
        if prefix in target_prefixes:
            counts[prefix]["referenced"] += 1
    all_withdrawn = withdrawn | ctx_withdrawn
    return {
        "undefined": undefined,
        "duplicate": {t: defined[t] for t in sorted(defined, key=split_id) if len(defined[t]) > 1},
        "withdrawn": {
            t: list(dict.fromkeys(referenced[t])) for t in sorted(all_withdrawn, key=split_id) if referenced.get(t)
        },
        "counts": dict(sorted(counts.items())),
    }


def main(argv: list[str] | None = None) -> int:
    global frontmatter

    parser = argparse.ArgumentParser(
        description="Find broken id cross-references, duplicate definitions, and withdrawn citations."
    )
    parser.add_argument("files", nargs="+", metavar="FILE", help="document and optional companion markdown files")
    parser.add_argument(
        "--context",
        action="append",
        default=[],
        metavar="FILE",
        help="read-only parent or source markdown file providing inherited id definitions (repeatable)",
    )
    args = parser.parse_args(argv)
    target_paths = [Path(name) for name in args.files]
    context_paths = [Path(name) for name in args.context]
    try:
        frontmatter = _load_frontmatter([p.resolve() for p in [*target_paths, *context_paths]])
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    files: list[tuple[str, str]] = []
    for name, path in zip(args.files, target_paths, strict=True):
        if not path.is_file():
            print(f"not found: {name}", file=sys.stderr)
            return 2
        files.append((name, path.read_text(encoding="utf-8")))

    contexts: list[tuple[str, str]] = []
    seen = {p.resolve() for p in target_paths}
    for name, path in zip(args.context, context_paths, strict=True):
        if not path.is_file():
            print(f"not found: {name}", file=sys.stderr)
            return 2
        resolved = path.resolve()
        if resolved not in seen:
            seen.add(resolved)
            contexts.append((name, resolved.read_text(encoding="utf-8")))

    for name, text in resolve_frontmatter_sources(target_paths):
        resolved = Path(name).resolve()
        if resolved not in seen:
            seen.add(resolved)
            contexts.append((name, text))

    print(json.dumps(scan(files, context_files=contexts), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
