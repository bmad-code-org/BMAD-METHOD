#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Parse a canonical v6 monolithic epics.md into a structured spec.

The v6 canonical shape produced by the v6 `bmad-create-epics-and-stories` skill:
  - Front matter at top.
  - `## Requirements Inventory` section listing FRs / NFRs / UX-DRs.
  - `## Epic List` overview.
  - `## Epic N: <title>` sections, each containing `### Story N.M: <title>`
    blocks with user-story stanzas, `**Acceptance Criteria:**` and an
    optional `## FR Coverage Map` reverse-lookup table.

This script parses what it can deterministically. It does not invent data: any
ambiguous field is left empty for the LLM to confirm.

Output (stdout, JSON):
{
  "title": "<initiative title or null>",
  "requirements": {
    "functional":    [{"code": "FR1",  "text": "..."}],
    "non_functional":[{"code": "NFR1", "text": "..."}],
    "ux_design":     [{"code": "UX-DR1","text": "..."}]
  },
  "epics": [
    {
      "nn": 1, "title": "...", "intent": "...",
      "stories": [
        {"nn": 1, "title": "...", "type": "feature|task|bug|spike",
         "user_story": "..." | null,
         "acceptance_criteria": ["..."],
         "coverage_codes": ["FR1"]}
      ]
    }
  ],
  "warnings": ["per-section parse note that the LLM should confirm"],
  "is_sharded": false
}

Exit codes: 0 ok, 1 user error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

EPIC_HEADING_RE = re.compile(r"^#{2,3}\s+Epic\s+(\d+)\s*:\s*(.+?)\s*$", re.MULTILINE)
STORY_HEADING_RE = re.compile(r"^#{3,4}\s+Story\s+(\d+)\.(\d+)\s*:\s*(.+?)\s*$", re.MULTILINE)
NEXT_SECTION_RE = re.compile(r"^#{1,4}\s+", re.MULTILINE)
TITLE_FRONT_RE = re.compile(r"^title:\s*(.+)$", re.MULTILINE)
H1_RE = re.compile(r"^#\s+(.+)$", re.MULTILINE)
USER_STORY_RE = re.compile(
    r"\*{0,2}As a\*{0,2}[^\n]*\n+\*{0,2}I want\*{0,2}[^\n]*\n+\*{0,2}So that\*{0,2}[^\n]*",
    re.IGNORECASE,
)
AC_RE = re.compile(r"\*\*Acceptance Criteria\*\*:?\s*\n+", re.IGNORECASE)
GIVEN_WHEN_THEN_RE = re.compile(r"^[-*]\s+(?:Given|When|Then|And|But)\b.*$", re.MULTILINE | re.IGNORECASE)
REQUIREMENT_CODE_RE = re.compile(r"\b(?:UX-DR|NFR|FR|D|R)\d+(?:\.\d+)?\b")
REQUIREMENT_LINE_RE = re.compile(r"^[-*]\s+(?:\*\*)?(FR\d+(?:\.\d+)?|NFR\d+(?:\.\d+)?|UX-DR\d+(?:\.\d+)?)(?:\*\*)?:?\s*(.*)$", re.MULTILINE)


def _strip_frontmatter(text: str) -> str:
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            return text[end + 4:]
    return text


def _front_title(text: str) -> str | None:
    m = TITLE_FRONT_RE.search(text[: text.find("---", 4) if text.startswith("---\n") else 0] or "")
    if m:
        return m.group(1).strip().strip('"').strip("'")
    body = _strip_frontmatter(text)
    h1 = H1_RE.search(body)
    if h1:
        return h1.group(1).strip()
    return None


def _section_text(text: str, start: int) -> tuple[str, int]:
    nxt = NEXT_SECTION_RE.search(text, start)
    end = nxt.start() if nxt else len(text)
    return text[start:end], end


def _classify_story_type(title: str, has_user_story: bool) -> str:
    t = title.lower()
    if any(w in t for w in ("bug", "fix")):
        return "bug"
    if any(w in t for w in ("spike", "investigate", "research")):
        return "spike"
    if has_user_story:
        return "feature"
    return "task"


def _extract_acs(story_body: str) -> list[str]:
    m = AC_RE.search(story_body)
    if not m:
        return []
    after = story_body[m.end():]
    nxt = NEXT_SECTION_RE.search(after)
    block = after[: nxt.start() if nxt else len(after)]
    acs: list[str] = []
    cur: list[str] = []
    for line in block.splitlines():
        if GIVEN_WHEN_THEN_RE.match(line):
            cur.append(line.lstrip("-* ").strip())
        elif cur and not line.strip():
            acs.append(" ".join(cur).strip())
            cur = []
        elif line.strip().startswith("AC") and cur:
            acs.append(" ".join(cur).strip())
            cur = []
    if cur:
        acs.append(" ".join(cur).strip())
    return [a for a in acs if a]


def parse(text: str) -> dict:
    warnings: list[str] = []
    title = _front_title(text)
    body = _strip_frontmatter(text)

    reqs: dict[str, list[dict]] = {"functional": [], "non_functional": [], "ux_design": []}
    inv_match = re.search(r"^##\s+Requirements\s+Inventory\s*$", body, re.MULTILINE | re.IGNORECASE)
    if inv_match:
        section, _ = _section_text(body, inv_match.end())
        for m in REQUIREMENT_LINE_RE.finditer(section):
            code, txt = m.group(1).strip(), m.group(2).strip()
            if code.startswith("UX-DR"):
                reqs["ux_design"].append({"code": code, "text": txt})
            elif code.startswith("NFR"):
                reqs["non_functional"].append({"code": code, "text": txt})
            else:
                reqs["functional"].append({"code": code, "text": txt})
    else:
        warnings.append("no `## Requirements Inventory` section found")

    epics: list[dict] = []
    epic_matches = list(EPIC_HEADING_RE.finditer(body))
    for i, em in enumerate(epic_matches):
        epic_nn = int(em.group(1))
        epic_title = em.group(2).strip()
        epic_start = em.end()
        epic_end = epic_matches[i + 1].start() if i + 1 < len(epic_matches) else len(body)
        epic_body = body[epic_start:epic_end]

        first_story = STORY_HEADING_RE.search(epic_body)
        intent = epic_body[: first_story.start() if first_story else len(epic_body)].strip()
        intent = re.sub(r"^#+.*$", "", intent, flags=re.MULTILINE).strip()

        stories: list[dict] = []
        story_matches = list(STORY_HEADING_RE.finditer(epic_body))
        for j, sm in enumerate(story_matches):
            story_nn = int(sm.group(2))
            story_title = sm.group(3).strip()
            s_start = sm.end()
            s_end = story_matches[j + 1].start() if j + 1 < len(story_matches) else len(epic_body)
            s_body = epic_body[s_start:s_end]
            us_match = USER_STORY_RE.search(s_body)
            user_story = us_match.group(0).strip() if us_match else None
            story_type = _classify_story_type(story_title, has_user_story=user_story is not None)
            acs = _extract_acs(s_body)
            codes = sorted(set(REQUIREMENT_CODE_RE.findall(s_body)))
            if not acs:
                warnings.append(f"epic {epic_nn} story {story_nn}: no acceptance criteria parsed")
            stories.append({
                "nn": story_nn,
                "title": story_title,
                "type": story_type,
                "user_story": user_story,
                "acceptance_criteria": acs,
                "coverage_codes": codes,
            })

        if not stories:
            warnings.append(f"epic {epic_nn} ({epic_title}): no stories parsed")

        epics.append({
            "nn": epic_nn,
            "title": epic_title,
            "intent": intent,
            "stories": stories,
        })

    if not epics:
        warnings.append("no `## Epic N:` headings found; file may not be canonical v6")

    return {
        "title": title,
        "requirements": reqs,
        "epics": epics,
        "warnings": warnings,
        "is_sharded": False,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--input", required=True, type=Path, help="Path to v6 epics.md (or directory for sharded)")
    args = ap.parse_args()

    if args.input.is_dir():
        out = {
            "title": None,
            "requirements": {"functional": [], "non_functional": [], "ux_design": []},
            "epics": [],
            "warnings": [f"input {args.input} is a directory; sharded v6 input — flatten first or use --convert"],
            "is_sharded": True,
        }
        print(json.dumps(out))
        return 0

    if not args.input.is_file():
        print(f"input not found: {args.input}", file=sys.stderr)
        return 1

    text = args.input.read_text(encoding="utf-8")
    print(json.dumps(parse(text)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
