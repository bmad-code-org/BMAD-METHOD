#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Serve the brainstorming technique library without loading it all into context.

The library is a CSV (category, technique_name, description, detail). `description`
is a short gist — enough to propose and run most techniques. `detail` is optional:
a path (relative to the CSV's directory) to a fuller instruction file for a technique
complex enough to warrant one. Only `show` resolves detail files, and only for the
technique asked for — so the heavy material never enters context until it is run.

Commands:
  categories                  list category names + counts (the cheap entry point)
  list --category C [...]      the index (name + gist) for those categories
  list --all                  the whole index at once — deliberate; large, avoid interactively
  show NAME [NAME ...]         full gist for each, inlining its detail file if it has one
  random [--category C] [-n N]  pick N at random (optionally within categories)
  html --out PATH             write the offline 'browse all' selection page to a file

`list` refuses to run with neither --category nor --all, and `html` writes to a file
rather than stdout: dumping the full catalog into context is a footgun, so reaching the
whole library at once must always be an explicit, deliberate choice.

Default output is lean text for an LLM to read; pass --json for structured output.
"""
import argparse
import csv
import hashlib
import html
import json
import random
import sys
from pathlib import Path

DEFAULT_FILE = Path(__file__).resolve().parent.parent / "assets" / "brain-methods.csv"
FIELDS = ("category", "technique_name", "description", "detail")


def load(file: Path) -> list[dict]:
    with open(file, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        r.setdefault("detail", "")
        r["detail"] = (r.get("detail") or "").strip()
    return rows


def categories(rows: list[dict]) -> list[tuple[str, int]]:
    counts: dict[str, int] = {}
    for r in rows:
        counts[r["category"]] = counts.get(r["category"], 0) + 1
    return sorted(counts.items())


def filter_cats(rows: list[dict], cats: list[str] | None) -> list[dict]:
    if not cats:
        return rows
    wanted = {c.lower() for c in cats}
    return [r for r in rows if r["category"].lower() in wanted]


def find(rows: list[dict], names: list[str]) -> tuple[list[dict], list[str]]:
    by_name = {r["technique_name"].lower(): r for r in rows}
    found, missing = [], []
    for n in names:
        r = by_name.get(n.strip().lower())
        (found if r else missing).append(r if r else n)
    return found, missing


def resolve_detail(row: dict, csv_dir: Path) -> str | None:
    """Return the contents of a row's detail file, or None if there is no detail
    (or the file is missing — a missing file is reported to stderr, not fatal)."""
    if not row.get("detail"):
        return None
    path = (csv_dir / row["detail"]).resolve()
    if not path.is_file():
        print(f"# detail file not found for {row['technique_name']}: {row['detail']}", file=sys.stderr)
        return None
    return path.read_text(encoding="utf-8").strip()


def fmt_categories(cats: list[tuple[str, int]], as_json: bool) -> str:
    if as_json:
        return json.dumps([{"category": c, "count": n} for c, n in cats])
    return "\n".join(f"{c}\t{n}" for c, n in cats)


def fmt_list(rows: list[dict], as_json: bool) -> str:
    if as_json:
        return json.dumps([{k: r[k] for k in ("category", "technique_name", "description")} for r in rows])
    return "\n".join(f"{r['category']}\t{r['technique_name']}\t{r['description']}" for r in rows)


def fmt_show(rows: list[dict], csv_dir: Path, as_json: bool) -> str:
    if as_json:
        out = []
        for r in rows:
            d = resolve_detail(r, csv_dir)
            entry = {k: r[k] for k in ("category", "technique_name", "description")}
            if d:
                entry["detail"] = d
            out.append(entry)
        return json.dumps(out)
    blocks = []
    for r in rows:
        block = f"## {r['technique_name']}  [{r['category']}]\n{r['description']}"
        d = resolve_detail(r, csv_dir)
        if d:
            block += f"\n\n{d}"
        blocks.append(block)
    return "\n\n".join(blocks)


def pretty(cat: str) -> str:
    """Turn a category slug (e.g. 'speculative_future') into a display name."""
    return cat.replace("_", " ").replace("-", " ").title()


# --- card visuals: a crafted duotone icon + hue per category ---------------
# Each card shows its category's icon (drawn in `currentColor`, which the CSS sets
# to the category hue) plus a per-technique accent seeded by the technique name, so
# every card is unique while staying on-theme. Hues span the wheel so categories
# stay distinguishable; an unknown (user-added) category gets a hash-derived hue and
# a generic glyph, so custom catalogs still render.

_HUES = {
    "creative": "#6d5cf0",
    "deep": "#4658c9",
    "structured": "#3b6ea5",
    "quantum": "#2b86d9",
    "speculative_future": "#0fb5c9",
    "collaborative": "#15a3a3",
    "biomimetic": "#1f9d6b",
    "constraint": "#d9882b",
    "wild": "#e2562f",
    "cultural": "#c75b39",
    "theatrical": "#cf4d6f",
    "absurdist": "#e0529c",
    "introspective_delight": "#b15ad6",
}

CHIP = '<rect x="1.5" y="1.5" width="41" height="41" rx="12" fill="currentColor" fill-opacity="0.12"/>'

_GLYPHS = {
    # idea starburst
    "creative": (
        '<g stroke="currentColor" stroke-width="2.4" stroke-linecap="round">'
        '<line x1="22" y1="6.5" x2="22" y2="12.5"/><line x1="22" y1="31.5" x2="22" y2="37.5"/>'
        '<line x1="6.5" y1="22" x2="12.5" y2="22"/><line x1="31.5" y1="22" x2="37.5" y2="22"/>'
        '<line x1="11.3" y1="11.3" x2="15.5" y2="15.5"/><line x1="28.5" y1="28.5" x2="32.7" y2="32.7"/>'
        '<line x1="32.7" y1="11.3" x2="28.5" y2="15.5"/><line x1="15.5" y1="28.5" x2="11.3" y2="32.7"/></g>'
        '<circle cx="22" cy="22" r="6.6" fill="currentColor" fill-opacity="0.25"/>'
        '<circle cx="22" cy="22" r="3.6" fill="currentColor"/>'
    ),
    # nested depth rings
    "deep": (
        '<g fill="none" stroke="currentColor">'
        '<circle cx="22" cy="22" r="13" stroke-width="1.5" stroke-opacity="0.4"/>'
        '<circle cx="22" cy="22" r="9" stroke-width="1.7" stroke-opacity="0.7"/>'
        '<circle cx="22" cy="22" r="5" stroke-width="1.9"/></g>'
        '<circle cx="22" cy="22" r="2.4" fill="currentColor"/>'
    ),
    # 2x2 blocks, diagonal filled
    "structured": (
        '<g fill="currentColor">'
        '<rect x="11" y="11" width="9.5" height="9.5" rx="2"/>'
        '<rect x="23.5" y="11" width="9.5" height="9.5" rx="2" fill-opacity="0.25"/>'
        '<rect x="11" y="23.5" width="9.5" height="9.5" rx="2" fill-opacity="0.25"/>'
        '<rect x="23.5" y="23.5" width="9.5" height="9.5" rx="2"/></g>'
    ),
    # atom
    "quantum": (
        '<g stroke="currentColor" stroke-width="1.8" fill="none">'
        '<ellipse cx="22" cy="22" rx="14.5" ry="6" transform="rotate(28 22 22)"/>'
        '<ellipse cx="22" cy="22" rx="14.5" ry="6" transform="rotate(-28 22 22)"/></g>'
        '<circle cx="22" cy="22" r="6.6" fill="currentColor" fill-opacity="0.18"/>'
        '<circle cx="22" cy="22" r="3.4" fill="currentColor"/>'
        '<circle cx="33.2" cy="17.4" r="2" fill="currentColor"/>'
    ),
    # upward arrow to a twinkling star
    "speculative_future": (
        '<g stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">'
        '<path d="M11 31 L 26.5 15.5"/><path d="M20 14.5 H 28 V 22.5"/></g>'
        '<circle cx="31" cy="12" r="2.8" fill="currentColor"/>'
        '<g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">'
        '<line x1="31" y1="6.5" x2="31" y2="8.4"/><line x1="31" y1="15.6" x2="31" y2="17.5"/>'
        '<line x1="25.5" y1="12" x2="27.4" y2="12"/><line x1="34.6" y1="12" x2="36.5" y2="12"/></g>'
    ),
    # three linked nodes
    "collaborative": (
        '<g stroke="currentColor" stroke-width="1.8">'
        '<line x1="14" y1="16" x2="30" y2="16"/><line x1="14" y1="16" x2="22" y2="30"/>'
        '<line x1="30" y1="16" x2="22" y2="30"/></g>'
        '<g fill="currentColor" fill-opacity="0.22">'
        '<circle cx="14" cy="16" r="4.6"/><circle cx="30" cy="16" r="4.6"/><circle cx="22" cy="30" r="4.6"/></g>'
        '<g fill="currentColor">'
        '<circle cx="14" cy="16" r="2.4"/><circle cx="30" cy="16" r="2.4"/><circle cx="22" cy="30" r="2.4"/></g>'
    ),
    # leaf
    "biomimetic": (
        '<path d="M22 7.5 C 31.5 12.5, 31.5 29, 22 36.5 C 12.5 29, 12.5 12.5, 22 7.5 Z" fill="currentColor" fill-opacity="0.22"/>'
        '<path d="M22 9 V 35.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
        '<g stroke="currentColor" stroke-width="1.5" stroke-linecap="round">'
        '<path d="M22 16 l5.6 -2.6"/><path d="M22 16 l-5.6 -2.6"/>'
        '<path d="M22 22 l6.6 -2.6"/><path d="M22 22 l-6.6 -2.6"/>'
        '<path d="M22 28 l5.6 -2.6"/><path d="M22 28 l-5.6 -2.6"/></g>'
    ),
    # corner brackets framing a point
    "constraint": (
        '<g stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">'
        '<path d="M17 11 H 11 V 17"/><path d="M27 11 H 33 V 17"/>'
        '<path d="M17 33 H 11 V 27"/><path d="M27 33 H 33 V 27"/></g>'
        '<circle cx="22" cy="22" r="5" fill="currentColor" fill-opacity="0.25"/>'
        '<circle cx="22" cy="22" r="2.6" fill="currentColor"/>'
    ),
    # lightning bolt
    "wild": (
        '<path d="M24.5 6.5 L 12.5 24 H 19.5 L 17.5 37.5 L 31.5 18.5 H 24 L 24.5 6.5 Z" fill="currentColor"/>'
    ),
    # globe
    "cultural": (
        '<circle cx="22" cy="22" r="13.5" fill="currentColor" fill-opacity="0.14"/>'
        '<g stroke="currentColor" stroke-width="1.6" fill="none">'
        '<circle cx="22" cy="22" r="13.5"/><ellipse cx="22" cy="22" rx="6" ry="13.5"/>'
        '<line x1="8.5" y1="22" x2="35.5" y2="22"/>'
        '<path d="M11 15 H 33" stroke-opacity="0.55"/><path d="M11 29 H 33" stroke-opacity="0.55"/></g>'
    ),
    # theatre mask
    "theatrical": (
        '<path d="M13 12 H 31 V 22 C 31 30, 27 35, 22 35 C 17 35, 13 30, 13 22 Z" fill="currentColor" fill-opacity="0.18"/>'
        '<path d="M13 12 H 31 V 22 C 31 30, 27 35, 22 35 C 17 35, 13 30, 13 22 Z" stroke="currentColor" stroke-width="1.8" fill="none"/>'
        '<g fill="currentColor"><circle cx="18.5" cy="21" r="1.7"/><circle cx="25.5" cy="21" r="1.7"/></g>'
        '<path d="M18 27 C 20 29.5, 24 29.5, 26 27" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
    ),
    # off-kilter winking grin
    "absurdist": (
        '<g transform="rotate(-12 22 22)">'
        '<circle cx="22" cy="22" r="13" fill="currentColor" fill-opacity="0.14"/>'
        '<circle cx="22" cy="22" r="13" stroke="currentColor" stroke-width="1.6" fill="none"/>'
        '<path d="M16 19 q 2 -2.4 4 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>'
        '<circle cx="26.5" cy="18.8" r="1.8" fill="currentColor"/>'
        '<path d="M16.5 26 C 19 30, 25 30, 28 24.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></g>'
    ),
    # meditating figure
    "introspective_delight": (
        '<circle cx="22" cy="13.5" r="4" fill="currentColor"/>'
        '<path d="M10.5 31 C 12.5 23, 31.5 23, 33.5 31 Z" fill="currentColor" fill-opacity="0.22"/>'
        '<path d="M10.5 31 C 12.5 23, 31.5 23, 33.5 31" stroke="currentColor" stroke-width="1.7" fill="none"/>'
        '<path d="M13.5 30 C 16 26.5, 20 25.5, 22 25.5 C 24 25.5, 28 26.5, 30.5 30" stroke="currentColor" stroke-width="1.5" fill="none" stroke-opacity="0.6"/>'
    ),
}

_FALLBACK_GLYPH = (
    '<circle cx="22" cy="22" r="11" fill="currentColor" fill-opacity="0.16"/>'
    '<circle cx="22" cy="22" r="11" stroke="currentColor" stroke-width="1.6" fill="none"/>'
    '<circle cx="22" cy="22" r="3.4" fill="currentColor"/>'
)


def _hsl_hex(deg: int, s: float, lt: float) -> str:
    import colorsys

    r, g, b = colorsys.hls_to_rgb((deg % 360) / 360, lt, s)
    return "#%02x%02x%02x" % (round(r * 255), round(g * 255), round(b * 255))


def category_style(cat: str) -> tuple[str, str]:
    """(hue, glyph markup) for a category — crafted for the shipped set, derived for extras."""
    if cat in _HUES:
        return _HUES[cat], _GLYPHS[cat]
    deg = int(hashlib.md5(cat.encode("utf-8")).hexdigest(), 16) % 360
    return _hsl_hex(deg, 0.58, 0.52), _FALLBACK_GLYPH


# A deliberately chosen line-icon depicting each specific technique. Drawn in
# `currentColor` (the category hue), consistent 2px stroke. Shown beside the shared
# category icon on every card. Unknown (custom) techniques fall back to a neutral mark.
_S = '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
_FALLBACK_TECH = (
    '<rect x="15" y="15" width="14" height="14" rx="2.5" transform="rotate(45 22 22)" '
    'fill="none" stroke="currentColor" stroke-width="2"/><circle cx="22" cy="22" r="2.4" fill="currentColor"/>'
)

_TECH_ICONS = {
    # --- collaborative ---
    "Yes And Building": '<g fill="currentColor"><rect x="8" y="27" width="12" height="8" rx="1.5" fill-opacity=".8"/><rect x="14" y="19" width="12" height="8" rx="1.5" fill-opacity=".5"/><rect x="20" y="11" width="12" height="8" rx="1.5"/></g>',
    "Brain Writing Round Robin": _S + '<path d="M31 16 A10 10 0 1 0 32.5 22"/><path d="M31 10 L31.5 16.3 L25 16.5"/></g>',
    "Random Stimulation": '<rect x="11" y="11" width="22" height="22" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><g fill="currentColor"><circle cx="17" cy="17" r="1.8"/><circle cx="27" cy="17" r="1.8"/><circle cx="22" cy="22" r="1.8"/><circle cx="17" cy="27" r="1.8"/><circle cx="27" cy="27" r="1.8"/></g>',
    "Role Playing": '<rect x="11" y="9" width="22" height="26" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="22" cy="19" r="4" fill="currentColor"/><path d="M15.5 30 c2 -4.5 11 -4.5 13 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "Ideation Relay Race": _S + '<line x1="12" y1="31" x2="27" y2="16"/><line x1="8" y1="22" x2="14" y2="22" stroke-opacity=".5"/><line x1="8" y1="27" x2="13" y2="27" stroke-opacity=".35"/></g><circle cx="29" cy="14" r="3.4" fill="currentColor"/>',
    "Idea Hot Potato": '<path d="M11 31 Q22 8 33 31" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2 3.5" stroke-linecap="round"/><circle cx="22" cy="12.5" r="4.2" fill="currentColor"/>',
    "Steal And Upgrade": _S + '<path d="M20 33 V14"/><path d="M13 21 L20 14 L27 21"/></g><path d="M30 27 l1 2.6 2.6 1 -2.6 1 -1 2.6 -1 -2.6 -2.6 -1 2.6 -1 z" fill="currentColor"/>',
    "Fold The Paper": '<path d="M13 16 L21 12 V28 L13 32 Z" fill="currentColor" fill-opacity=".22"/><path d="M21 12 L29 16 V32 L21 28 Z" fill="currentColor" fill-opacity=".45"/><path d="M13 16 L21 12 L29 16 M21 12 V28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    # --- creative ---
    "What If Scenarios": _S + '<path d="M18 17 a4 4 0 1 1 4 4 v3"/></g><circle cx="22" cy="30" r="1.6" fill="currentColor"/>',
    "Analogical Thinking": '<circle cx="15" cy="22" r="6" fill="none" stroke="currentColor" stroke-width="2"/><rect x="25" y="16" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19 20 q2 2 0 4 M23 20 q-2 2 0 4" stroke="currentColor" stroke-width="1.6" fill="none"/>',
    "First Principles Thinking": '<g fill="currentColor"><rect x="10" y="28" width="8" height="6" rx="1"/><rect x="18.5" y="28" width="8" height="6" rx="1"/><rect x="27" y="28" width="7" height="6" rx="1"/></g><path d="M22 25 L22 11 M16 17 L22 11 L28 17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "Forced Relationships": '<circle cx="12" cy="22" r="3.4" fill="currentColor"/><circle cx="32" cy="22" r="3.4" fill="currentColor"/><path d="M15 22 q7 -9 14 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="1.5 3"/>',
    "Time Shifting": '<circle cx="22" cy="22" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 15 V22 L27 25" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "Metaphor Mapping": '<rect x="10" y="14" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="28" cy="25" r="7" fill="currentColor" fill-opacity=".22"/><circle cx="28" cy="25" r="7" fill="none" stroke="currentColor" stroke-width="2"/>',
    "Cross-Pollination": _S + '<path d="M13 14 H27 a4 4 0 0 1 0 8 H17 a4 4 0 0 0 0 8 H31"/><path d="M28 11 L31.5 14 L28 17 M16 27 L12.5 30 L16 33"/></g>',
    "Concept Blending": '<circle cx="18" cy="22" r="8" fill="currentColor" fill-opacity=".25"/><circle cx="26" cy="22" r="8" fill="currentColor" fill-opacity=".25"/><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="22" r="8"/><circle cx="26" cy="22" r="8"/></g>',
    "Reverse Brainstorming": _S + '<path d="M13 18 H28 a4 4 0 0 1 0 8 H16"/><path d="M19 15 L13 18 L19 21 M22 23 L16 26 L22 29"/></g>',
    "Sensory Exploration": '<path d="M10 22 q12 -10 24 0 q-12 10 -24 0 z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="22" cy="22" r="4" fill="currentColor"/>',
    # --- deep ---
    "Five Whys": _S + '<circle cx="14" cy="13" r="2.4"/><circle cx="22" cy="22" r="2.4"/><circle cx="30" cy="31" r="2.4"/><path d="M15.6 14.8 L20.4 20.2 M23.6 23.8 L28.4 29.2"/></g>',
    "Provocation Technique": _S + '<path d="M24 9 L13 24 H21 L19 35 L31 19 H23 Z"/></g>',
    "Assumption Reversal": _S + '<path d="M16 14 V30"/><path d="M11.5 25 L16 30 L20.5 25"/><path d="M28 30 V14"/><path d="M23.5 19 L28 14 L32.5 19"/></g>',
    "Question Storming": _S + '<path d="M14 16 a3.2 3.2 0 1 1 3.2 3.2 v2"/><path d="M26 13 a3.6 3.6 0 1 1 3.6 3.6 v2.4"/></g><circle cx="17.2" cy="27" r="1.5" fill="currentColor"/><circle cx="29.6" cy="25.6" r="1.6" fill="currentColor"/>',
    "Constraint Mapping": '<path d="M11 14 L18 12 L26 14 L33 12 V30 L26 32 L18 30 L11 32 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M18 12 V30 M26 14 V32" stroke="currentColor" stroke-width="1.6"/>',
    "Failure Analysis": '<circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="26" y1="26" x2="33" y2="33" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M20 16 V21 M20 24 V24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "Emergent Thinking": '<g fill="currentColor"><circle cx="11" cy="31" r="1.6"/><circle cx="17" cy="29" r="1.6"/><circle cx="16" cy="23" r="1.6"/><circle cx="22" cy="24" r="1.8"/><circle cx="23" cy="17" r="1.9"/><circle cx="29" cy="18" r="1.7"/><circle cx="28" cy="12" r="2.1"/></g>',
    "Causal Loop Mapping": _S + '<path d="M16 16 a9 9 0 1 1 -2 12"/><path d="M16 10.5 L16.5 16.5 L10.5 17"/><path d="M30 28.5 L29.5 22.5 L35 22"/></g>',
    "Morphological Analysis": '<g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="11" y="11" width="22" height="22" rx="2"/><path d="M11 18.3 H33 M11 25.6 H33 M18.3 11 V33 M25.6 11 V33"/></g><rect x="18.5" y="18.5" width="7" height="7" fill="currentColor" fill-opacity=".4"/>',
    "Laddering": _S + '<path d="M16 9 V35 M28 9 V35 M16 15 H28 M16 22 H28 M16 29 H28"/></g>',
    # --- introspective_delight ---
    "Inner Child Conference": '<circle cx="22" cy="16" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 22 V31" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 34 q3 -3 6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><g fill="currentColor"><circle cx="20" cy="15" r="1"/><circle cx="24" cy="15" r="1"/></g>',
    "Shadow Work Mining": '<circle cx="22" cy="22" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 10 a12 12 0 0 1 0 24 z" fill="currentColor" fill-opacity=".85"/>',
    "Values Archaeology": '<g fill="none" stroke="currentColor" stroke-width="2"><path d="M10 16 h24" stroke-opacity=".4"/><path d="M10 22 h24" stroke-opacity=".6"/></g><path d="M22 24 L16 30 L22 36 L28 30 Z" fill="currentColor"/>',
    "Future Self Interview": _S + '<path d="M14 10 H30 L24 22 L30 34 H14 L20 22 Z"/></g><path d="M18 14 H26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "Body Wisdom Dialogue": '<path d="M22 33 C12 26 9 19 13.5 15 C17 12 21 14 22 17 C23 14 27 12 30.5 15 C35 19 32 26 22 33 Z" fill="currentColor" fill-opacity=".22"/><path d="M22 33 C12 26 9 19 13.5 15 C17 12 21 14 22 17 C23 14 27 12 30.5 15 C35 19 32 26 22 33 Z" fill="none" stroke="currentColor" stroke-width="2"/>',
    "Permission Giving": '<rect x="10" y="14" width="24" height="16" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 23 L19 27 L28 17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    "Secret Wish Confession": '<rect x="13" y="20" width="18" height="14" rx="2.5" fill="currentColor" fill-opacity=".22"/><rect x="13" y="20" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 20 v-3 a5.5 5.5 0 0 1 11 0 v3" fill="none" stroke="currentColor" stroke-width="2"/>',
    "Mood Weather Report": '<circle cx="17" cy="17" r="4.5" fill="currentColor" fill-opacity=".5"/><path d="M22 30 a5 5 0 0 1 0.5 -10 a6 6 0 0 1 11 2.5 a4 4 0 0 1 -1.5 7.5 z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    # --- structured ---
    "SCAMPER Method": '<circle cx="22" cy="22" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M22 9 V13.5 M22 30.5 V35 M9 22 H13.5 M30.5 22 H35 M12.8 12.8 L16 16 M28 28 L31.2 31.2 M31.2 12.8 L28 16 M16 28 L12.8 31.2"/></g>',
    "Six Thinking Hats": '<path d="M14 26 q8 -5 16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 26 q-6 1 -8 3 q13 4 26 0 q-2 -2 -8 -3" fill="currentColor" fill-opacity=".22"/><path d="M17 26 c-1 -8 11 -8 10 0" fill="currentColor" fill-opacity=".5"/>',
    "Decision Tree Mapping": _S + '<circle cx="22" cy="12" r="2.6"/><circle cx="14" cy="32" r="2.6"/><circle cx="30" cy="32" r="2.6"/><path d="M22 14.5 L22 20 M22 20 L14 29.4 M22 20 L30 29.4"/></g>',
    "Solution Matrix": '<g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="11" y="11" width="22" height="22" rx="2"/><path d="M11 22 H33 M22 11 V33"/></g><path d="M24.5 14.5 L26.5 16.5 L30.5 12.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    "Trait Transfer": '<path d="M12 16 l1.6 3.4 3.6 .4 -2.7 2.5 .7 3.6 -3.2 -1.8 -3.2 1.8 .7 -3.6 -2.7 -2.5 3.6 -.4 z" fill="currentColor"/><rect x="25" y="23" width="9" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M17 22 L25 27" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="1.5 2.5"/>',
    "Lotus Blossom": '<g fill="currentColor"><circle cx="22" cy="22" r="3.4"/></g><g fill="currentColor" fill-opacity=".4"><circle cx="22" cy="13" r="2.8"/><circle cx="22" cy="31" r="2.8"/><circle cx="13" cy="22" r="2.8"/><circle cx="31" cy="22" r="2.8"/><circle cx="15.5" cy="15.5" r="2.5"/><circle cx="28.5" cy="15.5" r="2.5"/><circle cx="15.5" cy="28.5" r="2.5"/><circle cx="28.5" cy="28.5" r="2.5"/></g>',
    "Worst Possible Idea": _S + '<path d="M17 11 v10 h-5 l10 12 10 -12 h-5 v-10 z"/></g>',
    "Disney Method": '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="14" cy="22" r="4.5"/><circle cx="22" cy="22" r="4.5"/><circle cx="30" cy="22" r="4.5"/></g>',
    "Starbursting": _S + '<path d="M22 8 V15 M22 29 V36 M8 22 H15 M29 22 H36 M12 12 L17 17 M27 27 L32 32 M32 12 L27 17 M12 32 L17 27"/></g><path d="M19.5 19 a3.2 3.2 0 1 1 3 4 v1.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    "Mind Mapping": _S + '<circle cx="22" cy="22" r="4"/><circle cx="11" cy="13" r="2.2"/><circle cx="33" cy="13" r="2.2"/><circle cx="10" cy="28" r="2.2"/><circle cx="32" cy="31" r="2.2"/><path d="M19 19.5 L12.5 14.5 M25 19.5 L31.5 14.5 M19 24.5 L11.5 27 M25.5 24 L30.5 29.5"/></g>',
    "Crazy 8s": '<g fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="12" width="8" height="9" rx="1.5"/><rect x="18" y="12" width="8" height="9" rx="1.5"/><rect x="27" y="12" width="8" height="9" rx="1.5"/><rect x="9" y="23" width="8" height="9" rx="1.5"/><rect x="18" y="23" width="8" height="9" rx="1.5"/><rect x="27" y="23" width="8" height="9" rx="1.5"/></g>',
    # --- theatrical ---
    "Time Travel Talk Show": '<rect x="18" y="9" width="8" height="15" rx="4" fill="currentColor" fill-opacity=".25"/><rect x="18" y="9" width="8" height="15" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 21 a8 8 0 0 0 16 0 M22 29 V34 M17 34 H27" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "Alien Anthropologist": '<ellipse cx="22" cy="30" rx="13" ry="4.5" fill="currentColor" fill-opacity=".25"/><path d="M22 11 c7 0 10 6 10 11 c0 5 -5 7 -10 7 c-5 0 -10 -2 -10 -7 c0 -5 3 -11 10 -11 z" fill="none" stroke="currentColor" stroke-width="2"/><g fill="currentColor"><ellipse cx="18" cy="22" rx="1.6" ry="2.4"/><ellipse cx="26" cy="22" rx="1.6" ry="2.4"/></g>',
    "Dream Fusion Laboratory": _S + '<path d="M18 9 H26 M19.5 9 V18 L13 30 a2 2 0 0 0 2 3 H29 a2 2 0 0 0 2 -3 L24.5 18 V9"/></g><path d="M16.5 26 H27.5" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="29" r="1.4" fill="currentColor"/><circle cx="25" cy="28" r="1.1" fill="currentColor"/>',
    "Emotion Orchestra": _S + '<path d="M17 30 V15 L31 12 V27"/><circle cx="14" cy="30" r="3"/><circle cx="28" cy="27" r="3"/></g>',
    "Parallel Universe Cafe": '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="22" r="9"/><circle cx="26" cy="22" r="9" stroke-dasharray="2.5 2.5"/></g>',
    "Persona Journey": '<path d="M14 33 q-2 -8 6 -9 q8 -1 6 -8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 4"/><circle cx="14" cy="33" r="2.4" fill="currentColor"/><path d="M26 16 l3 -5 3 5 z" fill="currentColor"/>',
    "Devil's Advocate Courtroom": _S + '<path d="M22 10 V32 M14 32 H30"/><path d="M11 16 H33 M11 16 L8 23 H14 Z M33 16 L30 23 H36 Z"/></g>',
    # --- wild ---
    "Chaos Engineering": _S + '<path d="M22 9 L25 18 L34 18 L27 24 L30 33 L22 27 L14 33 L17 24 L10 18 L19 18 Z"/></g>',
    "Guerrilla Gardening Ideas": _S + '<path d="M22 33 V21"/><path d="M22 22 c-7 0 -9 -6 -9 -9 c6 0 9 3 9 9 z"/><path d="M22 24 c6 0 8 -4 8 -7 c-5 0 -8 2 -8 7 z"/></g>',
    "Pirate Code Brainstorm": '<path d="M22 10 c-7 0 -11 5 -11 11 c0 4 2 6 4 7 v4 h3 v-2 h2 v2 h4 v-2 h2 v2 h3 v-4 c2 -1 4 -3 4 -7 c0 -6 -4 -11 -11 -11 z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><g fill="currentColor"><circle cx="17.5" cy="21" r="2.2"/><circle cx="26.5" cy="21" r="2.2"/></g>',
    "Zombie Apocalypse Planning": '<circle cx="22" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><g fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10 a12 12 0 0 1 6 3.5 M32 16 a12 12 0 0 1 0 12 M28 33.5 a12 12 0 0 1 -12 0 M12 28 a12 12 0 0 1 0 -12 M16 10.5 a12 12 0 0 1 6 -0.5" stroke-dasharray="0.1 5.5"/></g><g fill="currentColor"><circle cx="22" cy="11" r="2"/><circle cx="11" cy="22" r="2"/><circle cx="33" cy="22" r="2"/></g>',
    "Drunk History Retelling": _S + '<path d="M13 12 H31 L25 23 V31 H19 V23 Z"/><path d="M19 31 H25" /></g><circle cx="29" cy="14" r="1.4" fill="currentColor"/>',
    "Anti-Solution": _S + '<path d="M14 18 a8 8 0 1 1 -1 8"/><path d="M14 12 L14 18.5 L20 18"/></g>',
    "Elemental Forces": _S + '<path d="M22 8 L30 22 H14 Z"/><path d="M14 30 L22 36 L30 30"/><path d="M14 26 H30"/></g>',
    # --- biomimetic ---
    "Nature's Solutions": _S + '<path d="M16 32 C12 24 12 20 16 12 M28 32 C32 24 32 20 28 12"/><path d="M16 16 L28 14 M16 22 L28 20 M16 28 L28 26"/></g>',
    "Ecosystem Thinking": _S + '<circle cx="22" cy="13" r="2.4"/><circle cx="12" cy="27" r="2.4"/><circle cx="32" cy="27" r="2.4"/><circle cx="22" cy="24" r="2.4"/><path d="M22 15.4 V21.6 M14 26 L20 24.5 M30 26 L24 24.5 M13.6 25.2 L30.4 25.2"/></g>',
    "Evolutionary Pressure": _S + '<path d="M11 31 H17 M19 31 a6 6 0 0 1 6 -6 M25 25 a5 5 0 0 1 5 -5 M30 20 H33"/><circle cx="11" cy="31" r="2" fill="currentColor"/><circle cx="33" cy="20" r="2.6" fill="currentColor"/></g>',
    "Predator & Prey": '<path d="M22 9 L33 14 V23 C33 30 28 34 22 36 C16 34 11 30 11 23 V14 Z" fill="currentColor" fill-opacity=".18"/><path d="M22 9 L33 14 V23 C33 30 28 34 22 36 C16 34 11 30 11 23 V14 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    "Metamorphosis Stages": _S + '<path d="M22 12 V32"/><path d="M22 16 C14 12 10 18 14 22 C10 26 14 32 22 28 C30 32 34 26 30 22 C34 18 30 12 22 16"/></g>',
    "Swarm Logic": _S + '<path d="M22 10 L29 14 V22 L22 26 L15 22 V14 Z"/><path d="M15 24 L18 33 M29 24 L26 33 M22 28 V35" stroke-opacity=".6"/></g>',
    # --- quantum ---
    "Observer Effect": '<path d="M9 22 q13 -10 26 0 q-13 10 -26 0 z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="22" cy="22" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="22" cy="22" r="1.8" fill="currentColor"/>',
    "Entanglement Thinking": '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="15" cy="22" r="6"/><circle cx="29" cy="22" r="6"/></g><path d="M15 22 h14" stroke="currentColor" stroke-width="2" stroke-dasharray="1.5 2.5"/><g fill="currentColor"><circle cx="15" cy="22" r="1.8"/><circle cx="29" cy="22" r="1.8"/></g>',
    "Superposition Collapse": _S + '<path d="M11 12 C20 16 24 16 33 12 M11 18 C20 22 24 22 33 18 M11 24 C20 28 24 28 33 24"/><path d="M22 26 V34"/></g><circle cx="22" cy="34" r="2" fill="currentColor"/>',
    "Relativity Frame Shift": '<rect x="11" y="11" width="22" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="2" stroke-opacity=".4"/><rect x="15" y="15" width="18" height="18" rx="2" transform="rotate(-14 22 22)" fill="none" stroke="currentColor" stroke-width="2"/>',
    "Field Lines": _S + '<path d="M12 13 V31 M16 13 C24 18 24 26 16 31 M22 13 C32 18 32 26 22 31"/></g><circle cx="11" cy="22" r="2" fill="currentColor"/>',
    "Quantum Tunneling": '<rect x="20" y="9" width="5" height="26" rx="1.5" fill="currentColor" fill-opacity=".3"/><path d="M10 22 H34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M28 17 L34 22 L28 27" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    # --- cultural ---
    "Indigenous Wisdom": _S + '<path d="M26 11 C18 16 14 24 13 33 M26 11 C28 18 26 25 20 29"/><path d="M26 11 C24 13 22 14 19 15 M24 16 C22 18 20 19 17 20 M22 21 C20 23 18 24 15 25"/></g>',
    "Fusion Cuisine": _S + '<path d="M10 19 a12 7 0 0 0 24 0 Z"/><path d="M22 19 V32 M16 32 H28"/></g>',
    "Ritual Innovation": _S + '<path d="M12 33 V17 a10 10 0 0 1 20 0 V33"/><path d="M12 33 H32 M22 33 V21"/></g>',
    "Mythic Frameworks": _S + '<path d="M14 12 h13 a3 3 0 0 1 3 3 v17 l-3 -2 -3 2 -3 -2 -3 2 V15 a3 3 0 0 0 -3 -3 z"/><path d="M14 12 a3 3 0 0 0 -3 3 h6"/><path d="M20 18 H26 M20 23 H26"/></g>',
    "Proverb Mining": _S + '<path d="M22 14 C17 10 11 11 11 11 V30 s6 -1 11 3 c5 -4 11 -3 11 -3 V11 s-6 -1 -11 3 z"/><path d="M22 14 V31"/></g>',
    "Ancestor Council": '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="22" cy="14" r="3.5"/><circle cx="13" cy="19" r="3"/><circle cx="31" cy="19" r="3"/></g><g fill="currentColor" fill-opacity=".25"><path d="M16 31 c0 -5 12 -5 12 0 z"/><path d="M8 31 c0 -4 9 -4.5 9 0 z"/><path d="M27 31 c0 -4.5 9 -4 9 0 z"/></g>',
    "Trickster's Gambit": '<rect x="11" y="12" width="13" height="18" rx="2" transform="rotate(-10 17.5 21)" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="2"/><rect x="20" y="14" width="13" height="18" rx="2" transform="rotate(10 26.5 23)" fill="none" stroke="currentColor" stroke-width="2"/><path d="M26.5 19 l1.4 3 1.4 -3 -1.4 -1 z" fill="currentColor"/>',
    # --- absurdist ---
    "Villain's Monologue": _S + '<path d="M12 20 C16 18 19 18 22 21 C25 18 28 18 32 20 C30 24 26 24 22 21 C18 24 14 24 12 20 Z"/></g><circle cx="22" cy="14" r="2.4" fill="currentColor"/>',
    "Explain It to a Golden Retriever": _S + '<path d="M14 18 C12 12 17 13 18 17 M30 18 C32 12 27 13 26 17"/><path d="M15 19 C13 28 18 33 22 33 C26 33 31 28 29 19 C26 16 18 16 15 19 Z"/></g><g fill="currentColor"><circle cx="19" cy="24" r="1.4"/><circle cx="25" cy="24" r="1.4"/><circle cx="22" cy="28" r="1.6"/></g>',
    "Infomercial at 3AM": '<rect x="9" y="14" width="26" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 9 L22 14 L26 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 19 l1 2.6 2.8 .2 -2.1 1.9 .7 2.7 -2.4 -1.5 -2.4 1.5 .7 -2.7 -2.1 -1.9 2.8 -.2 z" fill="currentColor"/>',
    "Drunk Uncle at Thanksgiving": _S + '<path d="M11 16 L20 16 L27 11 V29 L20 24 L11 24 Z"/><path d="M30 16 q3 4 0 8 M33 13 q5 7 0 14"/></g>',
    "Cursed Genie": _S + '<path d="M10 30 h18 a2 2 0 0 0 2 -2 c0 -5 -6 -5 -8 -8 c5 -1 8 -3 8 -3 c-4 -2 -12 -2 -16 1 c-4 3 -5 9 -4 12 z"/><path d="M30 17 L33 14 M31 21 L35 20" stroke-opacity=".6"/></g>',
    "Three Rounds of Stupid": _S + '<path d="M13 30 V20 M9 24 L13 20 L17 24 M22 30 V15 M18 19 L22 15 L26 19 M31 30 V11 M27 15 L31 11 L35 15"/></g>',
    # --- constraint ---
    "Kill the Crown Jewel": _S + '<path d="M11 28 L13 15 L19 22 L22 12 L25 22 L31 15 L33 28 Z"/><path d="M11 28 H33"/></g><path d="M14 12 L30 32" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    "1000x Budget": '<g fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="22" cy="14" rx="9" ry="3.5"/><path d="M13 14 V22 a9 3.5 0 0 0 18 0 V14"/><path d="M13 22 V30 a9 3.5 0 0 0 18 0 V22"/></g>',
    "Ship in 60 Minutes": '<circle cx="22" cy="24" r="11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 24 V17 M22 24 L27 27" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 8 H26 M22 8 V13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    "The $0 Mandate": '<circle cx="22" cy="22" r="11" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 14 V30 M18 18 a4 3 0 0 1 8 0 a4 3 0 0 1 -8 4 a4 3 0 0 0 8 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 30 L30 14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    "One Feature Only": _S + '<circle cx="22" cy="22" r="4.5"/><path d="M22 9 V13 M22 31 V35 M9 22 H13 M31 22 H35" stroke-opacity=".35"/></g><circle cx="22" cy="22" r="2" fill="currentColor"/>',
    "Crank the Dial to 11": '<path d="M11 28 A12 12 0 0 1 33 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M22 28 L31 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="22" cy="28" r="2.6" fill="currentColor"/>',
    "Constraint Roulette": '<circle cx="22" cy="22" r="12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="22" cy="22" r="12" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3.7" stroke-opacity=".5"/><circle cx="22" cy="22" r="3" fill="currentColor"/><path d="M22 7 L25 12 H19 Z" fill="currentColor"/>',
    # --- speculative_future ---
    "Time Horizon Ladder": _S + '<path d="M9 30 H35"/><path d="M14 30 V24 M22 30 V18 M30 30 V12"/></g><g fill="currentColor"><circle cx="14" cy="24" r="2"/><circle cx="22" cy="18" r="2"/><circle cx="30" cy="12" r="2"/></g>',
    "Post-Scarcity Test": _S + '<path d="M15 22 a4.5 4.5 0 1 1 4.5 4.5 C16 26.5 14 18 11 18 a3.5 3.5 0 0 0 0 7 c4 0 5 -8 11 -8 a4.5 4.5 0 0 1 0 9 c-3 0 -4 -4.5 -7 -4.5"/></g>',
    "Utopia vs Dystopia Split-Screen": '<rect x="11" y="11" width="22" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 11 V33" stroke="currentColor" stroke-width="2"/><path d="M22 11 H33 a0 0 0 0 1 0 0 V33 H22 Z" fill="currentColor" fill-opacity=".8"/>',
    "Sci-Fi Artifact From the Future": '<path d="M22 9 L33 15 V28 L22 35 L11 28 V15 Z" fill="currentColor" fill-opacity=".15"/><path d="M22 9 L33 15 V28 L22 35 L11 28 V15 Z M11 15 L22 21 L33 15 M22 21 V35" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    "Emerging Tech Collision": '<rect x="15" y="15" width="14" height="14" rx="2" fill="currentColor" fill-opacity=".22"/><rect x="15" y="15" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 15 V10 M25 15 V10 M19 29 V34 M25 29 V34 M15 19 H10 M15 25 H10 M29 19 H34 M29 25 H34"/></g>',
    "What-If-The-World-Changed Card Flip": '<rect x="13" y="10" width="18" height="24" rx="2.5" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="2"/><path d="M22 10 V34" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 2.5"/><path d="M27 16 a4 4 0 1 1 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    "Future Anthropologist Dig": _S + '<path d="M22 27 a6 6 0 1 1 0.1 0 z"/><path d="M22 23 a2.5 2.5 0 1 0 0.1 0 M19 30 a5 5 0 0 0 6 0"/></g><path d="M12 16 L17 13 M32 16 L27 13" stroke="currentColor" stroke-width="1.6" stroke-opacity=".5"/>',
}


def tech_icon(name: str) -> str:
    """The hand-picked line-icon for a specific technique (neutral mark if unknown)."""
    return _TECH_ICONS.get(name, _FALLBACK_TECH)


SELECTOR_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BMad Method Brainstorming Selection</title>
<style>
  :root { --bg:#f6f7fb; --card:#fff; --ink:#1c1e2b; --muted:#6b7080; --accent:#5b4bdc; --warn:#c0561f; }
  * { box-sizing:border-box; }
  body { margin:0; font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; background:var(--bg); color:var(--ink); }
  header { position:sticky; top:0; z-index:5; background:#fff; padding:20px 24px 12px; border-bottom:1px solid #e6e8f0; box-shadow:0 2px 12px rgba(20,20,50,.05); }
  h1 { margin:0 0 4px; font-size:24px; letter-spacing:-.02em; }
  .sub { margin:0 0 12px; color:var(--muted); font-size:14px; max-width:74ch; }
  button { font:inherit; border:0; border-radius:8px; cursor:pointer; }
  .composer { display:flex; flex-direction:column; gap:9px; margin:6px 0 12px; }
  .grp { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
  .glabel { font-size:11px; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); min-width:74px; }
  .modes { display:inline-flex; background:#eef0f7; border-radius:9px; padding:3px; gap:2px; }
  .mode { padding:7px 13px; font-size:14px; font-weight:600; color:var(--muted); background:transparent; }
  .mode.on { background:#fff; color:var(--accent); box-shadow:0 1px 3px rgba(20,20,50,.13); }
  .pill { font-size:13px; color:var(--muted); background:#eef0f7; padding:6px 12px; border-radius:20px; }
  .pill b { color:var(--accent); }
  .step { display:inline-flex; align-items:center; gap:7px; font-size:13px; color:#444; background:#f1f2f8; padding:4px 6px 4px 12px; border-radius:20px; }
  .step b { min-width:12px; text-align:center; font-size:14px; color:var(--ink); }
  .step button { width:24px; height:24px; border-radius:50%; background:#fff; color:#555; font-size:17px; line-height:22px; text-align:center; box-shadow:0 1px 2px rgba(0,0,0,.13); }
  .step button:hover { color:var(--accent); }
  .total { font-size:12px; color:var(--muted); }
  .total.warn { color:var(--warn); font-weight:600; }
  .bar { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  #q { flex:1; min-width:220px; padding:9px 12px; border:1px solid #d6d9e6; border-radius:8px; font-size:14px; }
  #copy { padding:10px 20px; background:var(--accent); color:#fff; font-size:14px; font-weight:700; }
  #copy:hover { filter:brightness(1.07); }
  .chips { display:flex; gap:6px; flex-wrap:wrap; }
  .chip { font-size:12px; padding:4px 10px; border-radius:16px; border:1.5px solid var(--cc); color:var(--cc); background:transparent; font-weight:600; }
  .chip.on { background:var(--cc); color:#fff; }
  .chip:not(.on) { opacity:.9; }
  .banner { max-height:0; overflow:hidden; transition:max-height .25s ease, padding .22s ease, margin .22s ease; background:linear-gradient(90deg,var(--accent),#8275f2); color:#fff; border-radius:10px; font-weight:700; text-align:center; padding:0 14px; }
  .banner.show { max-height:64px; padding:13px 14px; margin-top:10px; }
  main { padding:18px 24px 60px; max-width:1120px; margin:0 auto; }
  section { margin:0 0 26px; }
  section > h2 { font-size:13px; text-transform:uppercase; letter-spacing:.08em; color:var(--c); margin:0 0 10px; border-bottom:1px solid color-mix(in srgb, var(--c) 24%, #e6e8f0); padding-bottom:6px; }
  section > h2 .cnt { color:color-mix(in srgb, var(--c) 45%, #b9bdce); margin-left:6px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(360px,1fr)); gap:10px; }
  label.tech { display:flex; gap:12px; align-items:flex-start; background:color-mix(in srgb, var(--c) 5%, #fff); border:1px solid color-mix(in srgb, var(--c) 18%, #e6e8f0); border-radius:10px; padding:11px 13px; cursor:pointer; transition:border-color .12s, box-shadow .12s, background .12s; }
  label.tech:hover { border-color:color-mix(in srgb, var(--c) 45%, #fff); }
  label.tech input { margin-top:2px; width:17px; height:17px; accent-color:var(--c); flex:none; }
  label.tech:has(input:checked) { border-color:var(--c); background:color-mix(in srgb, var(--c) 12%, #fff); box-shadow:0 0 0 2px color-mix(in srgb, var(--c) 30%, transparent); }
  .tech .ic2 { display:flex; gap:5px; flex:none; }
  .tech .ico { width:40px; height:40px; flex:none; color:var(--c); }
  .tech .n { font-weight:600; display:block; }
  .tech .d { color:var(--muted); font-size:13.5px; display:block; margin-top:2px; }
  footer { text-align:center; color:#aeb2c4; font-size:12px; padding:24px; }
</style>
</head>
<body>
<header>
  <h1>BMad Method Brainstorming Selection</h1>
  <p class="sub">Compose your session, hit <strong>Copy prompt</strong>, and paste it back into the chat to begin. {{TOTAL}}</p>

  <div class="composer">
    <div class="grp">
      <span class="glabel">Facilitation</span>
      <div class="modes" id="modes">
        <button type="button" class="mode on" data-mode="Facilitator">Facilitator</button>
        <button type="button" class="mode" data-mode="Creative Partner">Creative Partner</button>
        <button type="button" class="mode" data-mode="Ideate for me">Ideate for me</button>
      </div>
    </div>
    <div class="grp">
      <span class="glabel">Techniques</span>
      <span class="pill">Picked <b id="pickN">0</b></span>
      <span class="step">Random <button type="button" data-step="rand" data-d="-1">&minus;</button><b id="randN">0</b><button type="button" data-step="rand" data-d="1">+</button></span>
      <span class="step">Invent <button type="button" data-step="inv" data-d="-1">&minus;</button><b id="invN">0</b><button type="button" data-step="inv" data-d="1">+</button></span>
      <span class="step">AI picks <button type="button" data-step="ai" data-d="-1">&minus;</button><b id="aiN">0</b><button type="button" data-step="ai" data-d="1">+</button></span>
      <span class="total" id="total">Total 0 &middot; 3&ndash;4 is the sweet spot</span>
    </div>
  </div>

  <div class="bar">
    <input id="q" type="search" placeholder="Filter by name, description, or category&hellip;" autocomplete="off">
    <button id="copy" type="button">Copy prompt</button>
  </div>

  <div class="chips" id="chips">{{CHIPS}}</div>
  <div class="banner" id="banner">&#10003; Copied! Now paste it into the chat to start your session.</div>
</header>
<main>
{{BODY}}
</main>
<footer>BMad Method &middot; Brainstorming</footer>
<script>
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var all = Array.prototype.slice;
  var boxes = all.call(document.querySelectorAll('input[type=checkbox]'));
  var q = $('q');
  var state = { mode: 'Facilitator', rand: 0, inv: 0, ai: 0 };
  var offCats = {};

  all.call(document.querySelectorAll('.mode')).forEach(function(b){
    b.addEventListener('click', function(){
      all.call(document.querySelectorAll('.mode')).forEach(function(m){ m.classList.remove('on'); });
      b.classList.add('on');
      state.mode = b.dataset.mode;
    });
  });

  all.call(document.querySelectorAll('[data-step]')).forEach(function(btn){
    btn.addEventListener('click', function(){
      var k = btn.dataset.step, d = parseInt(btn.dataset.d, 10);
      state[k] = Math.max(0, state[k] + d);
      update();
    });
  });

  all.call(document.querySelectorAll('.chip')).forEach(function(chip){
    chip.addEventListener('click', function(){
      var on = !chip.classList.contains('on');
      chip.classList.toggle('on', on);
      if (on){ delete offCats[chip.dataset.cat]; } else { offCats[chip.dataset.cat] = true; }
      applyFilter();
    });
  });

  boxes.forEach(function(b){ b.addEventListener('change', update); });
  q.addEventListener('input', applyFilter);

  function checked(){ return boxes.filter(function(b){ return b.checked; }); }

  function update(){
    $('pickN').textContent = checked().length;
    $('randN').textContent = state.rand;
    $('invN').textContent = state.inv;
    $('aiN').textContent = state.ai;
    var total = checked().length + state.rand + state.inv + state.ai;
    var t = $('total');
    t.textContent = 'Total ' + total + ' · 3–4 is the sweet spot';
    t.classList.toggle('warn', total > 5);
  }

  function applyFilter(){
    var s = q.value.trim().toLowerCase();
    all.call(document.querySelectorAll('label.tech')).forEach(function(l){
      var cat = l.querySelector('input').dataset.cat;
      var hay = (l.textContent + ' ' + cat).toLowerCase();
      l.style.display = (!offCats[cat] && (!s || hay.indexOf(s) > -1)) ? '' : 'none';
    });
    all.call(document.querySelectorAll('section')).forEach(function(sec){
      var any = all.call(sec.querySelectorAll('label.tech')).some(function(l){ return l.style.display !== 'none'; });
      sec.style.display = (!offCats[sec.dataset.cat] && any) ? '' : 'none';
    });
  }

  function visibleUnchecked(){
    return boxes.filter(function(b){
      return !b.checked && b.closest('label.tech').style.display !== 'none';
    });
  }

  function sample(arr, n){
    var a = arr.slice(), out = [];
    while (out.length < n && a.length){ out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]); }
    return out;
  }

  function compose(){
    var picks = checked().map(function(b){ return { n: b.dataset.name, c: b.dataset.cat, d: b.dataset.desc, r: false }; });
    var rnd = sample(visibleUnchecked(), state.rand).map(function(b){ return { n: b.dataset.name, c: b.dataset.cat, d: b.dataset.desc, r: true }; });
    var techs = picks.concat(rnd);
    var L = ["Let's run my brainstorming session.", "", 'Facilitation mode: ' + state.mode + '.'];
    if (techs.length){
      L.push("", 'Techniques to use:');
      techs.forEach(function(t, i){
        L.push((i + 1) + '.' + (t.r ? ' (random pick)' : '') + ' ' + t.n + '  ·  ' + t.c);
        L.push('   ' + t.d);
      });
    }
    var extra = [];
    if (state.inv > 0){ extra.push('invent ' + state.inv + ' brand-new technique' + (state.inv > 1 ? 's' : '') + ' on the fly'); }
    if (state.ai > 0){ extra.push('you choose ' + state.ai + ' more technique' + (state.ai > 1 ? 's' : '') + ' that fit my goal'); }
    if (extra.length){ L.push("", 'Then: ' + extra.join('; and ') + '.'); }
    if (!techs.length && !extra.length){
      L.push("", state.mode === 'Ideate for me'
        ? 'Run the whole session yourself — pick the techniques, generate the ideas, then show me the result.'
        : 'Help me choose 3–4 techniques to start.');
    }
    return L.join('\n');
  }

  function fallbackCopy(t){
    var ta = document.createElement('textarea');
    ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); } catch(e){}
    document.body.removeChild(ta);
  }

  $('copy').addEventListener('click', function(){
    var text = compose();
    var show = function(){ var b = $('banner'); b.classList.add('show'); setTimeout(function(){ b.classList.remove('show'); }, 4500); };
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(show, function(){ fallbackCopy(text); show(); });
    } else { fallbackCopy(text); show(); }
  });

  update();
})();
</script>
</body>
</html>
"""


def html_doc(rows: list[dict]) -> str:
    """Render the self-contained 'browse all techniques' selection page from the catalog.

    Deterministic: categories sorted, techniques in file order — so the shipped asset can
    be snapshot-tested against the CSV and never silently drifts out of sync.
    """
    groups: dict[str, list[dict]] = {}
    for r in rows:
        groups.setdefault(r["category"], []).append(r)
    sections, chips = [], []
    for cat in sorted(groups):
        hue, glyph = category_style(cat)
        disp = html.escape(pretty(cat))
        cards = []
        for r in groups[cat]:
            name = html.escape(r["technique_name"])
            desc = html.escape(r["description"])
            cat_icon = (
                '<svg class="ico" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">'
                f'{CHIP}{glyph}</svg>'
            )
            t_icon = (
                '<svg class="ico" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">'
                f'{CHIP}{tech_icon(r["technique_name"])}</svg>'
            )
            cards.append(
                '<label class="tech"><input type="checkbox" '
                f'data-name="{name}" data-cat="{disp}" data-desc="{desc}">'
                f'<span class="ic2">{cat_icon}{t_icon}</span>'
                f'<span><span class="n">{name}</span><span class="d">{desc}</span></span></label>'
            )
        chips.append(f'<button type="button" class="chip on" data-cat="{disp}" style="--cc:{hue}">{disp}</button>')
        sections.append(
            f'<section data-cat="{disp}" style="--c:{hue}"><h2>{disp}<span class="cnt">{len(groups[cat])}</span></h2>'
            f'<div class="grid">{"".join(cards)}</div></section>'
        )
    total = html.escape(f"{len(rows)} techniques across {len(groups)} categories.")
    return (
        SELECTOR_TEMPLATE.replace("{{BODY}}", "\n".join(sections))
        .replace("{{CHIPS}}", "".join(chips))
        .replace("{{TOTAL}}", total)
    )


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--file", type=Path, default=DEFAULT_FILE, help="technique CSV (default: sibling assets/brain-methods.csv)")
    p.add_argument("--json", action="store_true", help="emit structured JSON instead of lean text")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("categories", help="list category names + counts")
    pl = sub.add_parser("list", help="the index: category/name/gist (needs --category or --all)")
    pl.add_argument("--category", action="append", help="filter to a category (repeatable)")
    pl.add_argument("--all", action="store_true", help="dump the entire catalog (deliberate; large)")
    ps = sub.add_parser("show", help="full gist + detail file for named techniques")
    ps.add_argument("names", nargs="+")
    pr = sub.add_parser("random", help="pick techniques at random")
    pr.add_argument("--category", action="append", help="restrict to a category (repeatable)")
    pr.add_argument("-n", type=int, default=1, help="how many (default 1)")
    ph = sub.add_parser("html", help="write the offline 'browse all' selection page")
    ph.add_argument("--out", help="file to write the page to (required; never prints the catalog)")
    args = p.parse_args(argv)

    if not args.file.is_file():
        print(f"error: technique file not found: {args.file}", file=sys.stderr)
        return 2
    rows = load(args.file)
    csv_dir = args.file.resolve().parent

    if args.cmd == "categories":
        print(fmt_categories(categories(rows), args.json))
    elif args.cmd == "list":
        if not args.category and not args.all:
            print(
                "error: `list` needs --category (one or more) — or --all to dump the whole "
                "catalog on purpose. Use `categories` for the cheap map, or `random` to draw blind.",
                file=sys.stderr,
            )
            return 2
        print(fmt_list(filter_cats(rows, args.category), args.json))
    elif args.cmd == "show":
        found, missing = find(rows, args.names)
        for m in missing:
            print(f"# not found: {m}", file=sys.stderr)
        if not found:
            return 1
        print(fmt_show(found, csv_dir, args.json))
    elif args.cmd == "random":
        pool = filter_cats(rows, args.category)
        if not pool:
            print("# no techniques match", file=sys.stderr)
            return 1
        print(fmt_list(random.sample(pool, min(args.n, len(pool))), args.json))
    elif args.cmd == "html":
        if not args.out:
            print(
                "error: `html` needs --out PATH — it writes the selection page to a file and "
                "never prints the catalog to stdout (which would defeat the point).",
                file=sys.stderr,
            )
            return 2
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html_doc(rows), encoding="utf-8")
        print(f"wrote {out} ({len(rows)} techniques, {len(categories(rows))} categories)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
