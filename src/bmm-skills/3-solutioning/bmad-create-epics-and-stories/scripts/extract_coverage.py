#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Extract every story's `## Coverage` section as a structured AC -> codes map.

Walks every story file under {initiative_store}/epics/<epic-folder>/*.md
(skipping each `epic.md`), locates the `## Coverage` section, and parses each
AC line into the requirement codes it claims. Output is intended to feed
agents/coverage-auditor.md so it spends tokens on fuzzy semantic matching, not
on locating sections in story bodies.

Coverage line shape this script accepts (loosely):
  - AC1 -> FR1, NFR3.2
  - **AC1**: FR1, NFR3.2
  - AC1: FR1; UX-DR2 (password policy)

Codes are matched by REQUIREMENT_CODE_RE: `FR\\d+(.\\d+)?`, `NFR\\d+(.\\d+)?`,
`UX-DR\\d+(.\\d+)?`, plus `D\\d+` (debt) and `R\\d+` (research) when present.

Output (stdout, JSON):
{
  "stories": [
    {
      "epic": "01-auth", "basename": "02-register-with-email",
      "path": "<abs>", "has_coverage_section": true,
      "ac_to_codes": {"AC1": ["FR1"], "AC2": ["NFR3.2"]},
      "all_codes": ["FR1", "NFR3.2"]
    }
  ],
  "stories_without_coverage_section": ["<epic>/<basename>"],
  "all_codes": ["FR1", "NFR3.2", "UX-DR2"]
}
Exit codes: 0 ok, 1 user error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

REQUIREMENT_CODE_RE = re.compile(r"\b(?:UX-DR|NFR|FR|D|R)\d+(?:\.\d+)?\b")
COVERAGE_HEADING_RE = re.compile(r"^##\s+Coverage\s*$", re.MULTILINE)
NEXT_HEADING_RE = re.compile(r"^##\s+", re.MULTILINE)
AC_LINE_RE = re.compile(r"\bAC\d+\b", re.IGNORECASE)


def extract_coverage_section(text: str) -> str | None:
    """Return the concatenated body of every ``## Coverage`` block in ``text``.

    Both authoring flows are tolerated: replacing the template's placeholder
    Coverage block in-place (the intended flow), or appending a new
    ``## Coverage`` block at the end of the file (a common LLM/human mistake
    that we don't want to silently flip into "uncovered").
    Returns ``None`` only when no ``## Coverage`` heading exists at all.
    """
    matches = list(COVERAGE_HEADING_RE.finditer(text))
    if not matches:
        return None
    parts: list[str] = []
    for m in matches:
        start = m.end()
        nxt = NEXT_HEADING_RE.search(text, start)
        end = nxt.start() if nxt else len(text)
        parts.append(text[start:end])
    return "\n".join(parts)


def parse_coverage_section(section: str) -> dict[str, list[str]]:
    """Return {AC1: [codes...], AC2: [...]} for every AC referenced.

    Loose: any line that mentions one or more AC labels (AC1, AC2, ...) and
    one or more requirement codes contributes a mapping.
    """
    out: dict[str, list[str]] = {}
    for line in section.splitlines():
        ac_labels = [m.group(0).upper() for m in AC_LINE_RE.finditer(line)]
        if not ac_labels:
            continue
        codes = REQUIREMENT_CODE_RE.findall(line)
        if not codes:
            continue
        for ac in ac_labels:
            out.setdefault(ac, [])
            for c in codes:
                if c not in out[ac]:
                    out[ac].append(c)
    return out


def walk(initiative_store: Path) -> dict:
    epics_dir = initiative_store / "epics"
    if not epics_dir.is_dir():
        print(f"missing {epics_dir}", file=sys.stderr)
        sys.exit(1)

    stories: list[dict] = []
    no_section: list[str] = []
    all_codes: set[str] = set()

    for ed in sorted(epics_dir.iterdir()):
        if not ed.is_dir() or not re.match(r"^\d+-", ed.name):
            continue
        for sf in sorted(ed.glob("*.md")):
            if sf.name == "epic.md":
                continue
            text = sf.read_text(encoding="utf-8")
            section = extract_coverage_section(text)
            if section is None:
                no_section.append(f"{ed.name}/{sf.stem}")
                stories.append({
                    "epic": ed.name,
                    "basename": sf.stem,
                    "path": str(sf),
                    "has_coverage_section": False,
                    "ac_to_codes": {},
                    "all_codes": [],
                })
                continue
            ac_map = parse_coverage_section(section)
            codes = sorted({c for codes in ac_map.values() for c in codes})
            all_codes.update(codes)
            stories.append({
                "epic": ed.name,
                "basename": sf.stem,
                "path": str(sf),
                "has_coverage_section": True,
                "ac_to_codes": ac_map,
                "all_codes": codes,
            })

    return {
        "stories": stories,
        "stories_without_coverage_section": no_section,
        "all_codes": sorted(all_codes),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    args = ap.parse_args()
    print(json.dumps(walk(args.initiative_store)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
