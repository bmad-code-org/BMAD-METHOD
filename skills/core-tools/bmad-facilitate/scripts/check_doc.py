#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""check-doc — find placeholders, forbidden id prefixes, and stale TOCs in markdown documents.

Runs universal structural sanity checks across one or more markdown files regardless of which ID
scheme a document uses. Fenced code blocks and HTML comments are skipped.

A file with a `## Table of Contents` has its links compared to its own headings, using GitHub's
anchors. Every `##` section needs an entry; entries may also link deeper headings.

Prints JSON:
  placeholders      literal `TBD`/`TODO`/`FIXME`/`XXX` markers and unfilled `{token}` placeholders
                    in frontmatter or prose (inline code spans stay exempt for `{token}`)
  forbidden_prefix  occurrences matching any `--forbid-prefix` argument (exact or `<scope>-<prefix>`),
                    including endpoints and expanded `ID-1 to ID-N` ranges
  toc               missing: `##` sections with no entry; stale: entries whose heading is gone;
                    out_of_order: entries whose order diverges from the document's headings
Locations are `file:line`. Exits 0, or 2 on bad usage or a missing file.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from collections import Counter, defaultdict
from collections.abc import Iterable
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.

ID = r"(?<![A-Za-z0-9-])(?:[A-Z]\d+-)?[A-Z][A-Z0-9]{0,5}-\d+(?![A-Za-z0-9])"
TOKEN = re.compile(ID)
FENCE_OPEN = re.compile(r"^ {0,3}(`{3,}|~{3,})")
INLINE_CODE = re.compile(r"`[^`\n]+`")
PLACEHOLDER_WORD = re.compile(r"\b(TBD|TODO|FIXME|XXX)\b")
TEMPLATE_TOKEN = re.compile(r"\{[a-z_][a-z0-9_ /.-]*\}")
RANGE = re.compile(rf"({ID})(?:\*\*|`)*\s*(?:to|through|[–—-])\s*(?:\*\*|`)*({ID})")
TITLED_HEADING = re.compile(r"^ {0,3}(#{1,6})[ \t]+(.+?)[ \t#]*$")
TOC_LINK = re.compile(r"\[[^\]]*\]\(#([^)\s]+)\)")
TOC_ANCHOR = "table-of-contents"
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


def split_id(token: str) -> tuple[str, int]:
    prefix, number = token.rsplit("-", 1)
    return prefix, int(number)


def is_forbidden(token: str, forbidden: set[str]) -> bool:
    """Whether `token`'s prefix matches any forbidden prefix (exact or `<scope>-<prefix>`)."""
    if not forbidden:
        return False
    prefix, _ = split_id(token)
    return prefix in forbidden or any(prefix.endswith(f"-{f}") for f in forbidden)


def find_placeholders(name: str, fm_text: str, prose: list[str], body_offset: int) -> list[dict[str, str]]:
    """Find literal placeholder markers and unfilled `{token}` placeholders in frontmatter and prose."""
    hits: list[dict[str, str]] = []
    if fm_text:
        for idx, line in enumerate(fm_text.split("\n"), 2):
            for kind, rx in (("marker", PLACEHOLDER_WORD), ("token", TEMPLATE_TOKEN)):
                for m in rx.finditer(line):
                    hits.append({"kind": kind, "text": m.group(0), "location": f"{name}:{idx}"})
    for idx, line in enumerate(prose, 1 + body_offset):
        for m in PLACEHOLDER_WORD.finditer(line):
            hits.append({"kind": "marker", "text": m.group(0), "location": f"{name}:{idx}"})
        no_code = INLINE_CODE.sub("", line)
        for m in TEMPLATE_TOKEN.finditer(no_code):
            hits.append({"kind": "token", "text": m.group(0), "location": f"{name}:{idx}"})
    return hits


def anchor(heading: str) -> str:
    """GitHub's anchor for a heading: lowercase, punctuation dropped, spaces as hyphens."""
    return re.sub(r"[^\w\- ]", "", heading.lower()).replace(" ", "-")


def check_toc(name: str, text: str, toc: dict, offset: int = 0) -> None:
    """Add this file's table-of-contents problems to `toc`."""
    lines = prose_lines(text)
    headings: list[tuple[int, int, int, str, str]] = []
    seen: Counter[str] = Counter()
    for idx, line in enumerate(lines, 1):
        m = TITLED_HEADING.match(line)
        if m:
            base = anchor(m.group(2))
            headings.append(
                (idx, idx + offset, len(m.group(1)), f"{base}-{seen[base]}" if seen[base] else base, m.group(2))
            )
            seen[base] += 1
    table = next((i for i, h in enumerate(headings) if h[2] == 2 and h[3] == TOC_ANCHOR), None)
    if table is None:
        return

    start_idx, start_line = headings[table][0], headings[table][1]
    end_idx = headings[table + 1][0] - 1 if table + 1 < len(headings) else len(lines)
    links = [
        (number + offset, m.group(1))
        for number, line in enumerate(lines[start_idx:end_idx], start_idx + 1)
        for m in TOC_LINK.finditer(line)
    ]
    anchors = {h[3] for i, h in enumerate(headings) if i != table}
    sections = [h for i, h in enumerate(headings) if i != table and h[2] == 2]
    targets = [target for _, target in links]
    for _, number, _, slug, title in sections:
        if slug not in targets:
            toc["missing"].setdefault(title, []).append(f"{name}:{number}")
    for number, target in links:
        if target not in anchors:
            toc["stale"].setdefault(target, []).append(f"{name}:{number}")
    order = [slug for _, _, _, slug, _ in sections]
    if [t for t in targets if t in order] != [slug for slug in order if slug in targets]:
        toc["out_of_order"].append(f"{name}:{start_line}")


def scan(files: list[tuple[str, str]], forbid_prefixes: Iterable[str] = ()) -> dict:
    """Scan markdown files for placeholders, forbidden prefixes, and TOC drift."""
    toc: dict = {"missing": {}, "stale": {}, "out_of_order": []}
    placeholders: list[dict[str, str]] = []
    forbidden = {p.strip().rstrip("-") for p in forbid_prefixes if p and p.strip().rstrip("-")}
    forbidden_hits: dict[str, list[str]] = defaultdict(list)

    for name, text in files:
        fm_text, body_text, offset = split_frontmatter(text)
        check_toc(name, body_text, toc, offset=offset)
        prose = prose_lines(body_text)
        placeholders.extend(find_placeholders(name, fm_text, prose, offset))
        if not forbidden:
            continue
        for number, line in enumerate(prose, 1 + offset):
            where = f"{name}:{number}"
            for m in TOKEN.finditer(line):
                tok = m.group(0)
                if is_forbidden(tok, forbidden):
                    forbidden_hits[tok].append(where)
            for m in RANGE.finditer(line):
                (prefix, low), (other, high) = split_id(m.group(1)), split_id(m.group(2))
                if prefix == other and 0 < high - low <= MAX_RANGE:
                    width = len(m.group(1).rsplit("-", 1)[1])
                    for n in range(low + 1, high):
                        tok = f"{prefix}-{n:0{width}d}"
                        if is_forbidden(tok, forbidden):
                            forbidden_hits[tok].append(where)

    return {
        "placeholders": placeholders,
        "forbidden_prefix": {t: list(dict.fromkeys(forbidden_hits[t])) for t in sorted(forbidden_hits, key=split_id)},
        "toc": toc,
    }


def main(argv: list[str] | None = None) -> int:
    global frontmatter

    parser = argparse.ArgumentParser(
        description="Find placeholders, forbidden id prefixes, and stale TOCs in markdown documents."
    )
    parser.add_argument("files", nargs="+", metavar="FILE", help="document and optional companion markdown files")
    parser.add_argument(
        "--forbid-prefix",
        action="append",
        default=[],
        dest="forbid_prefixes",
        metavar="PREFIX",
        help="forbid ids carrying this prefix (repeatable)",
    )
    args = parser.parse_args(argv)
    files = []
    paths = [Path(name) for name in args.files]
    try:
        frontmatter = _load_frontmatter([p.resolve() for p in paths])
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    for name, path in zip(args.files, paths, strict=True):
        if not path.is_file():
            print(f"not found: {name}", file=sys.stderr)
            return 2
        files.append((name, path.read_text(encoding="utf-8")))
    print(json.dumps(scan(files, forbid_prefixes=args.forbid_prefixes), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
