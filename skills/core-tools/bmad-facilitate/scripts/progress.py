#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""progress — where a facilitated run is, counted from its document.

  uv run progress.py <document> [<merged template>]

Counts the sections in the merged template's `facilitation_order`, else the document's own `##`
headings with the table of contents left out. A section is settled once its `<!-- open -->`
marker is gone, so one settled out counts too; a section the order lists and the document lacks
is open, and a heading the document repeats is open while any copy is. Prints JSON: `total`,
`settled`, `open` (the open sections' headings in facilitation order, an id where the document has
no heading), `place` (the position in the order of the first open section, null when none is),
`missing` (ids the order lists that the document has no heading for) and `extra` (the document's
headings the order does not list). When `missing` or `extra` is not empty the count does not fit the
document, as when a reader's headings replaced the template's. Exits 2 when a file is missing.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

FRONTMATTER = re.compile(r"\A---[ \t]*\n(.*?)\n---[ \t]*(?:\n|\Z)", re.DOTALL)
ORDER = re.compile(r"^facilitation_order:[ \t]*\[(.*)\][ \t]*$", re.MULTILINE)
SECTION = re.compile(r"^##[ \t]+(.+?)[ \t#]*$")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
OPEN = re.compile(r"^\s*<!--\s*open\s*-->\s*$")


def section_id(heading: str) -> str:
    return re.sub(r"[^\w\- ]", "", heading.strip().lower()).replace(" ", "-")


def sections(text: str) -> list[tuple[str, str, bool]]:
    """Each `##` section outside code fences as (id, heading, still open), the table of contents left out."""
    found, fence = [], None
    for line in text.replace("\r\n", "\n").split("\n"):
        m = FENCE.match(line)
        if m:
            marker = m.group(1)
            if fence is None:
                fence = (marker[0], len(marker))
            elif marker[0] == fence[0] and len(marker) >= fence[1] and line.strip() == marker:
                fence = None
            continue
        if fence is not None:
            continue
        heading = SECTION.match(line)
        if heading:
            found.append([section_id(heading.group(1)), heading.group(1).strip(), False])
        elif found and OPEN.match(line):
            found[-1][2] = True
    return [tuple(s) for s in found if s[0] != "table-of-contents"]


def order_of(template: str) -> list[str]:
    m = FRONTMATTER.match(template.replace("\r\n", "\n"))
    listed = ORDER.search(m.group(1)) if m else None
    if not listed:
        return []
    return [i.strip().strip("'\"").rstrip("?") for i in listed.group(1).split(",") if i.strip()]


def progress(document: str, template: str = "") -> dict:
    found: dict[str, tuple[str, bool]] = {}
    for i, heading, is_open in sections(document):
        first = found.get(i, (heading, False))
        found[i] = (first[0], first[1] or is_open)
    order = order_of(template) or list(found)
    still_open = [i for i in order if found.get(i, (i, True))[1]]
    return {
        "total": len(order),
        "settled": len(order) - len(still_open),
        "open": [found.get(i, (i, True))[0] for i in still_open],
        "place": order.index(still_open[0]) + 1 if still_open else None,
        "missing": [i for i in order if i not in found],
        "extra": [heading for i, (heading, _) in found.items() if i not in order],
    }


def main(argv: list[str]) -> int:
    if not argv or len(argv) > 2:
        print(__doc__.strip().split("\n\n")[1], file=sys.stderr)
        return 2
    paths = [Path(a) for a in argv]
    missing = [str(p) for p in paths if not p.is_file()]
    if missing:
        print(json.dumps({"error": f"missing: {', '.join(missing)}"}))
        return 2
    texts = [p.read_text(encoding="utf-8") for p in paths]
    print(json.dumps(progress(*texts), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
