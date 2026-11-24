#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""lint_arch — domain-only structural checks for architecture documents.

Pairs with core-tools `check_doc.py` (which owns placeholders, TOC, and `--forbid-prefix`).
This linter checks only architecture-specific invariants:

  - ad_id        duplicate or non-monotonic AD-n headings
  - ad_fields    AD-n block missing structured Binds / Prevents / Rule fields
  - ad_crossref  lazy "similar to AD-n" cross-references
  - version_pin  ## Stack table rows missing a pinned version

Fenced code blocks and HTML comments are blanked (keeping line count) before scanning so
mermaid blocks, examples, and comments do not trigger false positives and line numbers stay
absolute past frontmatter. Non-markdown companion files (e.g. `contract.yaml`) are skipped.
Exits 0 on scan completion, or 2 on missing file, bad usage, or missing `frontmatter.py`.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from collections.abc import Iterable
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.

AD_HEADING = re.compile(r"^#{2,4}[ \t]*(?:`|\*\*)?AD-(\d+)\b.*$", re.MULTILINE)
HEADING = re.compile(r"^#{1,6}[ \t]+", re.MULTILINE)
FENCE_OPEN = re.compile(r"^ {0,3}(`{3,}|~{3,})")
SIMILAR_TO = re.compile(r"similar to AD-\d+", re.IGNORECASE)
TEMPLATE_TOKEN = re.compile(r"\{[a-z_][a-z0-9_ /.-]*\}")
UNPINNED_VERSION = re.compile(r"^(?:TBD|TODO|FIXME|XXX|latest|unpinned)$", re.IGNORECASE)
FIELD_PATTERNS = {
    "binds": re.compile(r"^[ \t]*(?:[-*+][ \t]+)?\*{0,2}binds\*{0,2}\s*:\*{0,2}", re.IGNORECASE | re.MULTILINE),
    "prevents": re.compile(r"^[ \t]*(?:[-*+][ \t]+)?\*{0,2}prevents\*{0,2}\s*:\*{0,2}", re.IGNORECASE | re.MULTILINE),
    "rule": re.compile(r"^[ \t]*(?:[-*+][ \t]+)?\*{0,2}rule\*{0,2}\s*:\*{0,2}", re.IGNORECASE | re.MULTILINE),
}


def _load_frontmatter(start_paths: Iterable[Path] = (), project_root: Path | None = None):
    """Load shared `frontmatter.py` from `_bmad/scripts/`, an adjacent `bmad` skill, or repo checkout."""
    candidates: list[Path] = []
    if project_root is not None:
        candidates.append(project_root / "_bmad" / "scripts" / "frontmatter.py")
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


def blank_non_prose(text: str) -> str:
    """Replace fenced code blocks and HTML comments with empty text, keeping line numbers intact."""
    lines = text.split("\n")
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
    return "\n".join(out)


def line_of(text: str, idx: int) -> int:
    return text.count("\n", 0, idx) + 1


def find_ad_crossrefs(scan: str, offset: int, name: str) -> list[dict]:
    """Flag lazy 'similar to AD-n' cross-references."""
    findings: list[dict] = []
    for m in SIMILAR_TO.finditer(scan):
        findings.append(
            {
                "category": "ad_crossref",
                "severity": "high",
                "detail": f"unresolved cross-reference: {m.group(0)!r}",
                "location": f"{name} (line {offset + line_of(scan, m.start())})",
            }
        )
    return findings


def find_ad_issues(scan: str, offset: int, name: str, seen: dict[int, str] | None = None) -> list[dict]:
    """Check AD-n heading uniqueness, monotonic ordering, and required Binds/Prevents/Rule fields."""
    findings: list[dict] = []
    seen_ids = seen if seen is not None else {}
    prev: int | None = None
    for m in AD_HEADING.finditer(scan):
        num = int(m.group(1))
        file_line = offset + line_of(scan, m.start())
        loc = f"{name} AD-{num} (line {file_line})"
        if num in seen_ids:
            findings.append(
                {
                    "category": "ad_id",
                    "severity": "high",
                    "detail": f"AD-{num} id reused (also at {seen_ids[num]})",
                    "location": loc,
                }
            )
        else:
            seen_ids[num] = f"{name} line {file_line}"
        if prev is not None and num <= prev:
            findings.append(
                {
                    "category": "ad_id",
                    "severity": "high",
                    "detail": f"AD-{num} is non-monotonic (follows AD-{prev}); ids must ascend and never renumber",
                    "location": loc,
                }
            )
        prev = num if prev is None else max(prev, num)

        start = m.end()
        nxt = HEADING.search(scan, start)
        block = scan[start : nxt.start()] if nxt else scan[start:]
        missing = [field for field, pattern in FIELD_PATTERNS.items() if not pattern.search(block)]
        if missing:
            findings.append(
                {
                    "category": "ad_fields",
                    "severity": "high",
                    "detail": f"AD-{num} missing required field(s): {', '.join(missing)}",
                    "location": loc,
                }
            )
    return findings


def _table_cells(row: str) -> list[str]:
    """Split a markdown table row into trimmed cells, dropping leading/trailing pipes."""
    s = row.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|"):
        s = s[:-1]
    return [c.strip() for c in s.split("|")]


def find_unpinned_stack(scan: str, offset: int, name: str) -> list[dict]:
    """Flag `## Stack` table rows with blank, placeholder, or unpinned versions."""
    findings: list[dict] = []
    in_stack = False
    header_seen = False
    name_idx, ver_idx = 0, 1
    for i, raw in enumerate(scan.splitlines()):
        if HEADING.match(raw):
            in_stack = re.match(r"^##\s+Stack\b", raw) is not None
            header_seen = False
            name_idx, ver_idx = 0, 1
            continue
        if not in_stack or not raw.lstrip().startswith("|"):
            continue
        if set(raw.strip()) <= set("|-: "):
            continue
        cells = _table_cells(raw)
        if not header_seen:
            header_seen = True
            for j, c in enumerate(cells):
                if c.lower() == "name":
                    name_idx = j
                elif c.lower() == "version":
                    ver_idx = j
            continue
        dep = cells[name_idx] if len(cells) > name_idx else ""
        version = cells[ver_idx] if len(cells) > ver_idx else ""
        if not dep or TEMPLATE_TOKEN.search(dep):
            continue
        clean_ver = version.strip("` ")
        if not clean_ver or TEMPLATE_TOKEN.search(clean_ver) or UNPINNED_VERSION.match(clean_ver):
            findings.append(
                {
                    "category": "version_pin",
                    "severity": "medium",
                    "detail": f"Stack entry {dep!r} has no pinned version",
                    "location": f"{name} (line {offset + i + 1})",
                }
            )
    return findings


def lint_files(files: list[tuple[str, str]]) -> dict:
    """Lint one or more markdown architecture documents."""
    findings: list[dict] = []
    seen_ids: dict[int, str] = {}
    for name, text in files:
        _, body, offset = split_frontmatter(text)
        scan = blank_non_prose(body)
        findings += find_ad_crossrefs(scan, offset, name)
        findings += find_ad_issues(scan, offset, name, seen=seen_ids)
        findings += find_unpinned_stack(scan, offset, name)
    counts: dict[str, int] = {}
    for f in findings:
        counts[f["severity"]] = counts.get(f["severity"], 0) + 1
    return {
        "ok": len(findings) == 0,
        "files": [name for name, _ in files],
        "total_findings": len(findings),
        "by_severity": counts,
        "findings": findings,
    }


def lint(text: str, name: str = "arch") -> dict:
    """Lint a single markdown string (convenience wrapper)."""
    return lint_files([(name, text)])


def main(argv: list[str] | None = None) -> int:
    global frontmatter

    ap = argparse.ArgumentParser(
        description="Lint architecture documents for AD-n integrity and pinned Stack versions."
    )
    ap.add_argument("files", nargs="+", metavar="FILE", help="architecture markdown document and optional companions")
    ap.add_argument("--project-root", type=Path, help="optional project folder holding _bmad/scripts/frontmatter.py")
    ap.add_argument("-o", "--output", help="write JSON here instead of stdout")
    args = ap.parse_args(argv)

    paths = [Path(name) for name in args.files]
    for name, path in zip(args.files, paths, strict=True):
        if not path.is_file():
            print(f"not found: {name}", file=sys.stderr)
            return 2

    try:
        frontmatter = _load_frontmatter([p.resolve() for p in paths], project_root=args.project_root)
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    md_files: list[tuple[str, str]] = []
    for name, path in zip(args.files, paths, strict=True):
        if path.suffix.lower() != ".md":
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as e:
            result = {"ok": False, "error": f"could not read {name}: {e}", "findings": [], "total_findings": 0}
            out = json.dumps(result, indent=2)
            if args.output:
                Path(args.output).write_text(out + "\n", encoding="utf-8")
            else:
                print(out)
            return 0
        md_files.append((name, text))

    out = json.dumps(lint_files(md_files), indent=2)
    if args.output:
        Path(args.output).write_text(out + "\n", encoding="utf-8")
    else:
        print(out)
    return 0


if __name__ == "__main__":
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
