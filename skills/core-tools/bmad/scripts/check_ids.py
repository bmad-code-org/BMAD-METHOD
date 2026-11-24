#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""check-ids — find broken ID cross-references, duplicate definitions, withdrawn citations, and missing sources.

Opt-in template lint hook (`lint: "{project-root}/_bmad/scripts/check_ids.py"`), installed into
`_bmad/scripts/` by `bmad setup`. Pairs with `bmad-facilitate`'s `check_doc.py` (which owns
placeholders, TOC, and `--forbid-prefix`).

An id is a token like REQ-3, ITEM-12 or CAP-4, or one carrying a scope prefix, like S02-REQ-07.
It is defined where it opens a heading, a table row's first cell, or a table cell, list item or
line in bold; an id may be bare, bold, or wrapped in backticks (`REQ-3`, **`REQ-3`**). An unbolded
list item or line defines it only when punctuation follows (`- REQ-3: ...`, ``- `REQ-3`: ...``,
`REQ-3 (withdrawn)`). An id that opens a list of ids (`REQ-1, REQ-2`, `REQ-1 to REQ-8`) is not a
definition. Every other occurrence is a reference, and a range such as `REQ-1 to REQ-8` references
each id in it. A table most of whose defining ids were already defined earlier in the target
document(s), or all of whose ids come from target or parent context (such as a traceability table),
only references its ids. Fenced code blocks and closed HTML comments are skipped.

Definitions in transitive frontmatter `sources:` (scalar, list, or mapping `{path: ...}`) and
`--context` files count as read-only parent context: valid citations resolve, redefinitions collide
in `duplicate`, and unresolvable local markdown `sources:` entries appear in `unresolved_sources`.
Unrecognized external hyphenated tokens (e.g. `UTF-8`, `UTC-5`) and out-of-order updates are not flagged.

Prints JSON:
  undefined           referenced but never defined, for prefixes defined in target or source files
  duplicate           defined more than once across target files or colliding with a parent context id
  withdrawn           defined as withdrawn, removed, dropped or superseded, yet still referenced
  unresolved_sources  local markdown `sources:` paths that could not be found on disk
  counts              per prefix defined in target files: distinct ids defined and referenced
Locations are `file:line`. Exits 0, or 2 on bad usage or a missing file.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict, deque
from collections.abc import Iterable
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.

import frontmatter  # noqa: E402

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


def split_frontmatter(text: str) -> tuple[str, str, int]:
    """Return (frontmatter_text, body_text, body_line_offset) with CRLF normalized."""
    norm = text.replace("\r\n", "\n")
    try:
        fm_text, body_text = frontmatter.split(norm)
    except ValueError:
        return "", norm, 0
    return fm_text, body_text, norm[: len(norm) - len(body_text)].count("\n")


def _find_closing_backticks(line: str, open_idx: int, tick_len: int) -> int:
    """Index just after matching `tick_len` backticks on `line`, or -1 when unclosed."""
    pos = open_idx + tick_len
    n = len(line)
    while pos < n:
        if line[pos] != "`":
            pos += 1
            continue
        end = pos
        while end < n and line[end] == "`":
            end += 1
        if end - pos == tick_len:
            return end
        pos = end
    return -1


def _is_escaped(line: str, pos: int) -> bool:
    """Whether `line[pos]` is preceded by an odd number of backslashes."""
    slashes = 0
    idx = pos - 1
    while idx >= 0 and line[idx] == "\\":
        slashes += 1
        idx -= 1
    return slashes % 2 == 1


def _has_closing_comment(lines: list[str], line_idx: int, col: int) -> bool:
    """Whether a bare `<!--` at (line_idx, col) has a matching `-->` later in `lines`."""
    if "-->" in lines[line_idx][col:]:
        return True
    return any("-->" in line for line in lines[line_idx + 1 :])


def prose_lines(text: str) -> list[str]:
    """The document's lines with fenced code and closed HTML comments blanked, numbering kept."""
    lines = text.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    fence: tuple[str, int] | None = None
    in_comment = False
    for idx, line in enumerate(lines):
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
        n = len(line)
        buf: list[str] = []
        while pos < n:
            if in_comment:
                end = line.find("-->", pos)
                if end == -1:
                    break
                in_comment = False
                pos = end + 3
            elif line[pos] == "`" and not _is_escaped(line, pos):
                tick_end = pos
                while tick_end < n and line[tick_end] == "`":
                    tick_end += 1
                close_end = _find_closing_backticks(line, pos, tick_end - pos)
                if close_end != -1:
                    buf.append(line[pos:close_end])
                    pos = close_end
                else:
                    buf.append(line[pos:tick_end])
                    pos = tick_end
            elif line.startswith("<!--", pos) and _has_closing_comment(lines, idx, pos + 4):
                in_comment = True
                pos += 4
            else:
                next_tick = line.find("`", pos + 1)
                next_comment = line.find("<!--", pos + 1)
                stops = [s for s in (next_tick, next_comment) if s != -1]
                stop = min(stops) if stops else n
                buf.append(line[pos:stop])
                pos = stop
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


def _project_root_for(start: Path) -> Path | None:
    cur = start if start.is_dir() else start.parent
    for root in (cur, *cur.parents):
        if (root / "_bmad").is_dir():
            return root
    return None


def _source_candidates(sources: object) -> list[str]:
    if isinstance(sources, str):
        return [sources]
    if isinstance(sources, dict):
        items = [sources]
    elif isinstance(sources, list):
        items = sources
    else:
        return []
    raw: list[str] = []
    for entry in items:
        if isinstance(entry, str):
            raw.append(entry)
        elif isinstance(entry, dict):
            path = entry.get("path") or entry.get("file")
            if isinstance(path, str):
                raw.append(path)
    return raw


def _resolve_source_path(raw: str, doc_path: Path) -> tuple[bool, Path | None]:
    """Return `(is_local_markdown, resolved_path_or_None)` for a frontmatter `sources:` item."""
    target = raw.split("#", 1)[0].strip()
    if not target or "://" in target or Path(target).suffix.lower() != ".md":
        return False, None
    project_root = _project_root_for(doc_path) or _project_root_for(Path.cwd())
    if target.startswith("{project-root}"):
        rel_part = target[len("{project-root}") :].lstrip("/\\")
        base = project_root or Path.cwd()
        candidate = base / rel_part
        return True, candidate.resolve() if candidate.is_file() else None
    rel = Path(target).expanduser()
    if rel.is_absolute():
        return True, rel.resolve() if rel.is_file() else None
    roots = [doc_path.parent]
    if project_root is not None and project_root not in roots:
        roots.append(project_root)
    if Path.cwd() not in roots:
        roots.append(Path.cwd())
    for root in roots:
        candidate = root / rel
        if candidate.is_file():
            return True, candidate.resolve()
    return True, None


def resolve_frontmatter_sources(file_paths: Iterable[Path]) -> tuple[list[tuple[str, str]], list[dict[str, str]]]:
    """Read transitive local markdown `sources:` referenced by `file_paths`, ancestors first."""
    paths = [p for p in file_paths if p.is_file()]
    seen = {p.resolve() for p in paths}
    queue: deque[tuple[Path, str, str]] = deque((p.resolve(), str(p), p.read_text(encoding="utf-8")) for p in paths)
    contexts: list[tuple[str, str]] = []
    unresolved: list[dict[str, str]] = []
    while queue:
        doc_path, display_path, text = queue.popleft()
        fm_text, _, _ = split_frontmatter(text)
        if not fm_text:
            continue
        try:
            meta = frontmatter.load(fm_text)
        except ValueError:
            continue
        for entry in _source_candidates(meta.get("sources")):
            is_local_md, resolved = _resolve_source_path(entry, doc_path)
            if not is_local_md:
                continue
            if resolved is None:
                unresolved.append({"source": entry, "document": display_path})
                continue
            if resolved in seen:
                continue
            seen.add(resolved)
            src_text = resolved.read_text(encoding="utf-8")
            contexts.append((str(resolved), src_text))
            queue.append((resolved, str(resolved), src_text))
    return list(reversed(contexts)), unresolved


def _index_files(
    files: list[tuple[str, str]],
    ctx_defined: set[str] | frozenset[str] = frozenset(),
) -> tuple[dict[str, list[str]], dict[str, list[str]], set[str]]:
    defined: dict[str, list[str]] = defaultdict(list)
    referenced: dict[str, list[str]] = defaultdict(list)
    withdrawn: set[str] = set()
    table: list[tuple[str, str, str]] = []

    def record_definition(where: str, token: str, rest: str) -> None:
        defined[token].append(where)
        if WITHDRAWN.match(rest):
            withdrawn.add(token)

    def close_table() -> None:
        if not table:
            return
        # Classify as citing if most rows are locally defined or all rows already exist in local/parent context.
        local_hits = sum(token in defined for _, token, _ in table)
        cites = 2 * local_hits > len(table) or all(token in defined or token in ctx_defined for _, token, _ in table)
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


def scan(
    files: list[tuple[str, str]],
    context_files: list[tuple[str, str]] = (),
    unresolved_sources: list[dict[str, str]] = (),
) -> dict:
    """Scan markdown files for undefined, duplicate, withdrawn, and unresolved-source IDs."""
    ctx_defined: dict[str, list[str]] = {}
    ctx_withdrawn: set[str] = set()
    if context_files:
        raw_ctx_def, _, ctx_withdrawn = _index_files(context_files)
        ctx_defined = dict(raw_ctx_def)

    defined, referenced, withdrawn = _index_files(files, ctx_defined=set(ctx_defined))
    all_defined = set(defined) | set(ctx_defined)
    active_prefixes = {split_id(token)[0] for token in all_defined}
    target_prefixes = {split_id(token)[0] for token in defined}

    undefined = {
        token: list(dict.fromkeys(referenced[token]))
        for token in sorted(referenced, key=split_id)
        if token not in all_defined and split_id(token)[0] in active_prefixes
    }
    duplicate: dict[str, list[str]] = {}
    for token in sorted(defined, key=split_id):
        if token in ctx_defined:
            duplicate[token] = [*ctx_defined[token], *defined[token]]
        elif len(defined[token]) > 1:
            duplicate[token] = defined[token]

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
        "duplicate": duplicate,
        "withdrawn": {
            t: list(dict.fromkeys(referenced[t])) for t in sorted(all_withdrawn, key=split_id) if referenced.get(t)
        },
        "unresolved_sources": list(unresolved_sources),
        "counts": dict(sorted(counts.items())),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Find broken id cross-references, duplicate definitions, withdrawn citations, and missing sources."
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

    files: list[tuple[str, str]] = []
    for name, path in zip(args.files, target_paths, strict=True):
        if not path.is_file():
            print(f"not found: {name}", file=sys.stderr)
            return 2
        files.append((name, path.read_text(encoding="utf-8")))

    seen = {p.resolve() for p in target_paths}
    explicit_contexts: list[tuple[str, str]] = []
    for name, path in zip(args.context, context_paths, strict=True):
        if not path.is_file():
            print(f"not found: {name}", file=sys.stderr)
            return 2
        resolved = path.resolve()
        if resolved not in seen:
            seen.add(resolved)
            explicit_contexts.append((name, resolved.read_text(encoding="utf-8")))

    source_contexts, unresolved = resolve_frontmatter_sources([*target_paths, *context_paths])
    contexts: list[tuple[str, str]] = []
    for name, text in source_contexts:
        resolved = Path(name).resolve()
        if resolved not in seen:
            seen.add(resolved)
            contexts.append((name, text))
    contexts.extend(explicit_contexts)

    print(json.dumps(scan(files, context_files=contexts, unresolved_sources=unresolved), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
