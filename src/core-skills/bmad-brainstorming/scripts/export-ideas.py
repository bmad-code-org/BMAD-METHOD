#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""export-ideas — turn a browser-exported idea selection into a clean markdown artifact.

A brainstorm.html keepsake lets the user tick ideas, insights, and synthesis directions
as they read, then click Export. A static local HTML page can't write files directly or
invoke a script, so Export does the only thing it can: download a small `selection.json`
— a flat list of `{text, section}` objects for whatever was ticked. This script is the
other half of that handoff: it reads that download and writes a proper `selected-ideas.md`
into the session workspace, sitting right next to the artifact it came from.

The output is deliberately a plain, portable markdown file — the best next input for
bmad-forge-idea (pressure-test one pick), bmad-product-brief (turn the shortlist into a
brief), or another round of bmad-brainstorming scoped to just these picks.

Usage:
  python3 export-ideas.py --input <path to selection.json> --workspace <session dir>
"""
import argparse
import json
import sys
from datetime import datetime
from pathlib import Path


def load_selection(path: Path) -> list[dict]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except OSError as e:
        raise SystemExit(f"error: could not read {path}: {e}")
    except json.JSONDecodeError as e:
        raise SystemExit(f"error: {path} is not valid JSON: {e}")
    if not isinstance(data, list):
        raise SystemExit(f"error: {path} must contain a JSON array of {{text, section}} objects")
    return data


def group_by_section(items: list[dict]) -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = {}
    for item in items:
        if not isinstance(item, dict):
            continue
        text = " ".join(str(item.get("text", "")).split())  # collapse whitespace, no prose bloat
        if not text:
            continue
        section = str(item.get("section") or "Selected").strip() or "Selected"
        grouped.setdefault(section, []).append(text)
    return grouped


def render(grouped: dict[str, list[str]]) -> str:
    total = sum(len(texts) for texts in grouped.values())
    lines = [
        "# Selected Ideas",
        "",
        f"_{total} item{'s' if total != 1 else ''} selected — {datetime.now().strftime('%Y-%m-%d %H:%M')}_",
        "",
    ]
    for section, texts in grouped.items():
        lines.append(f"## {section}")
        lines.append("")
        lines.extend(f"- {t}" for t in texts)
        lines.append("")
    return "\n".join(lines).rstrip("\n") + "\n"


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--input", required=True, help="path to the selection.json downloaded from the artifact's Export button")
    p.add_argument("--workspace", required=True, help="session workspace dir (same folder as the brainstorm.html); output is written here")
    p.add_argument("--out-name", default="selected-ideas.md", help="output filename within --workspace (default: selected-ideas.md)")
    args = p.parse_args(argv)

    src = Path(args.input)
    if not src.is_file():
        print(f"error: input file not found: {src}", file=sys.stderr)
        return 2

    items = load_selection(src)
    grouped = group_by_section(items)
    total = sum(len(texts) for texts in grouped.values())
    if total == 0:
        print("error: no selected items found in the input file", file=sys.stderr)
        return 2

    workspace = Path(args.workspace)
    workspace.mkdir(parents=True, exist_ok=True)
    out_path = workspace / args.out_name
    out_path.write_text(render(grouped), encoding="utf-8")

    print(f"Wrote {total} selected idea{'s' if total != 1 else ''} to {out_path}")
    print(
        "This is the best next artifact to carry forward — feed it into bmad-forge-idea to "
        "pressure-test a single pick, bmad-product-brief to turn the shortlist into a brief, or "
        "back into bmad-brainstorming for another round scoped to just these ideas."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
