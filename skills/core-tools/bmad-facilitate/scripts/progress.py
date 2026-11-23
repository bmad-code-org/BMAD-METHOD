#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""progress — where a facilitated run is, counted from its document.

  uv run progress.py --project-root <project> <document> [<merged template>]

Counts the sections in the merged template's `facilitation_order`, else the document's own `##`
headings with the table of contents left out. A section is settled once its `<!-- open -->`
marker is gone, so one settled out counts too; a section the order lists and the document lacks
is open, and a heading the document repeats is open while any copy is. Prints JSON: `total`,
`settled`, `open` (the open sections' headings in facilitation order, an id where the document has
no heading), `place` (the position in the order of the first open section, null when none is),
`missing` (ids the order lists that the document has no heading for) and `extra` (the document's
headings the order does not list). When `missing` or `extra` is not empty the count does not fit the
document, as when a reader's headings replaced the template's. `--project-root` names the project
with BMad set up. Exits 2 when a file is missing.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.

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
    try:
        listed = frontmatter.load(frontmatter.split(template)[0]).get("facilitation_order")
    except ValueError:
        return []
    if not isinstance(listed, list):
        return []
    return [i.strip().rstrip("?") for i in listed if isinstance(i, str) and i.strip()]


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
    global frontmatter

    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--project-root", type=Path, required=True, help="project folder with _bmad/scripts")
    p.add_argument("document")
    p.add_argument("template", nargs="?", help="the merged template")
    args = p.parse_args(argv)
    path = args.project_root / "_bmad" / "scripts" / "frontmatter.py"
    if not path.is_file():
        print(f"error: {path} is missing. Run bmad setup for this project.", file=sys.stderr)
        return 2
    spec = importlib.util.spec_from_file_location("bmad_frontmatter", path)
    frontmatter = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(frontmatter)

    paths = [Path(a) for a in (args.document, args.template) if a]
    missing = [str(p) for p in paths if not p.is_file()]
    if missing:
        print(json.dumps({"error": f"missing: {', '.join(missing)}"}))
        return 2
    texts = [p.read_text(encoding="utf-8-sig") for p in paths]
    print(json.dumps(progress(*texts), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
