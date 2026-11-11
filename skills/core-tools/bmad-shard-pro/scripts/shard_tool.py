#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""shard_tool — the deterministic half of bmad-shard-pro.

Every subcommand prints one JSON object to stdout; diagnostics go to stderr.
Exit codes: 0 = done or clean, 1 = check failures, 2 = usage or input error.

Subcommands:
  outline SOURCE [--depth N] [--from L --to L] [--ids]
      Size, headings, bare-identifier headings, tables and fenced blocks, frontmatter,
      an existing contents list, identifier prefixes, and a proposed cut along headings
      sized by characters that never splits a table or fenced block.
  build PLAN [--force]
      Build the sharded folder from a plan: cut faithful shards word for word, write the main
      file (note + map, sub-maps when the map would pass line 200), move the source into
      `.source/`, save the plan as `.shards.json`, and write the identifier lookup. Building
      again over shards edited since build is refused unless --force.
  map FOLDER
      Rewrite the main file's map (and sub-maps) from each shard's frontmatter, keeping the
      map's order: shards missing from it are added to their group, lines whose file is gone
      are dropped. The main file's frontmatter and title are kept.
  lookup FOLDER
      Regenerate `identifier-lookup.md` from the shards, using the plan's lookup pattern.
  toc FILE [--plan PLAN]
      Insert a contents list after the title, or with no plan refresh the line ranges of the
      one already there.
  check TARGET [--rebuild | --all]
      Check a sharded folder or a file with a contents list. --rebuild also checks that the
      faithful shards join back into the source exactly (only true before any update). --all
      checks every one under the TARGET folder, for a pre-commit hook or CI.

A shard is any .md file in the folder whose frontmatter `part_of` points at the main file. Its
frontmatter holds its map entry (`title`, `summary`, `group`, optional `related`), so an agent
can edit, add or retitle shards by hand; `.shards.json` only records how build cut the source.

Input is markdown or plain text; anything else is converted before this tool sees it.

Plan JSON: see `build --help`.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
from collections import Counter
from pathlib import Path

import yaml

PLAN_HELP = """Plan JSON:
  {
    "source": "the markdown or text file being split",
    "folder": "the document folder; the main file is <folder>/<folder name>.md",
    "title": "title for the main file",
    "lookup": "regex matching identifiers to index (optional)",
    "groups": [
      {"heading": "Map group", "summary": "optional, used when the map is split",
       "shards": [
         {"file": "name.md", "title": "Title", "summary": "One line", "start": 1, "end": 40,
          "related": ["other-shard.md"]}
       ]}
    ]
  }
  Shards are cut word for word from start to end (1-based, inclusive); together they cover
  every line once, in order. `related` is optional: shards a change to this one usually
  touches. In a toc plan only start and title are read.
"""

NOTE_PATH = Path(__file__).resolve().parent.parent / "assets" / "sharded-note.md"
NOTE_MARK = "This document is sharded."
MANIFEST = ".shards.json"
LOOKUP_FILE = "identifier-lookup.md"
WINDOW = 200
MIN_CHARS = 3000
MAX_CHARS = 14000
TOC_START = "<!-- shard-pro:contents -->"
TOC_END = "<!-- /shard-pro:contents -->"

HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
FENCE = re.compile(r"^\s{0,3}(`{3,}|~{3,})(.*)$")
NUMBERED = re.compile(r"^\s{0,3}\d+[.)]\s")
BARE_ID = re.compile(r"^[A-Z]?\d+(?:[-.]\d+)*[a-z]?$|^[A-Z](?:-\d+[a-z]?)*$")
IDENT = re.compile(r"\b[A-Z][A-Z0-9]{0,5}(?:-[A-Z0-9]{1,6})*-\d{1,4}[a-z]?\b")
LINK = re.compile(r"\]\(\./([^)#\s]+)")
MAP_LINE = re.compile(r"^- \[(.*)\]\(\./([^)#\s]+)\)(?: — (.*))?$")
TOC_ENTRY = re.compile(r"^- L(\d+)(-\d+)? (.*)$")
ANY_LINK = re.compile(r"\]\(([^)\s]+)\)")


def emit(obj: dict, code: int = 0) -> int:
    print(json.dumps(obj, indent=1, ensure_ascii=False))
    return code


def fail(msg: str) -> int:
    print(msg, file=sys.stderr)
    return emit({"ok": False, "error": msg}, 2)


def read_lines(path: Path) -> list[str]:
    return path.read_text(encoding="utf-8").splitlines()


def frontmatter_end(lines: list[str]) -> int:
    """Number of lines taken by YAML frontmatter at the top (0 when none)."""
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                return i + 1
    return 0


def block_spans(lines: list[str]) -> list[tuple[int, int, str]]:
    """1-based inclusive spans of fenced blocks (kind = fence language or 'code'), tables and numbered steps."""
    spans, i, n = [], 0, len(lines)
    while i < n:
        m = FENCE.match(lines[i])
        if m:
            lang = m.group(2).strip() or "code"
            close = re.compile(rf"^\s{{0,3}}{re.escape(m.group(1)[0])}{{{len(m.group(1))},}}\s*$")
            j = i + 1
            while j < n and not close.match(lines[j]):
                j += 1
            spans.append((i + 1, min(j, n - 1) + 1, lang))
            i = j + 1
            continue
        if NUMBERED.match(lines[i]):
            j = i
            while j + 1 < n:
                nxt = lines[j + 1]
                if NUMBERED.match(nxt) or (nxt.startswith((" ", "\t")) and nxt.strip()):
                    j += 1
                elif (
                    not nxt.strip()
                    and j + 2 < n
                    and (NUMBERED.match(lines[j + 2]) or lines[j + 2].startswith((" ", "\t")))
                ):
                    j += 2  # a loose list: one blank line between items
                else:
                    break
            if j > i:
                spans.append((i + 1, j + 1, "steps"))
            i = j + 1
            continue
        if lines[i].lstrip().startswith("|"):
            j = i
            while j + 1 < n and lines[j + 1].lstrip().startswith("|"):
                j += 1
            if j > i:
                spans.append((i + 1, j + 1, "table"))
            i = j + 1
            continue
        i += 1
    return spans


def headings(lines: list[str], spans: list[tuple[int, int, str]]) -> list[dict]:
    inside = set()
    for a, b, kind in spans:
        if kind not in ("table", "steps"):
            inside.update(range(a, b + 1))
    out = []
    for i, line in enumerate(lines, 1):
        m = HEADING.match(line)
        if m and i not in inside:
            text = m.group(2)
            h = {"line": i, "level": len(m.group(1)), "text": text, "bare": bool(BARE_ID.match(text))}
            if h["bare"]:
                # A bare identifier says nothing; the first line of text under it names the subject.
                first = next((x.strip() for x in lines[i:] if x.strip() and not HEADING.match(x)), "")
                h["first_line"] = first[:100]
            out.append(h)
    return out


def chars(lines: list[str], a: int, b: int) -> int:
    return sum(len(x) + 1 for x in lines[a - 1 : b])


def propose_cut(lines: list[str], heads: list[dict], spans: list[tuple[int, int, str]], start_line: int) -> list[dict]:
    """Cut at headings: split oversized sections at deeper headings, merge small neighbours."""
    n = len(lines)
    blocked = set()
    for a, b, _ in spans:
        blocked.update(range(a + 1, b + 1))
    cuttable = [h for h in heads if h["line"] not in blocked and h["line"] > start_line]

    def split(a: int, b: int, level: int) -> list[tuple[int, int]]:
        if chars(lines, a, b) <= MAX_CHARS or level > 6:
            return [(a, b)]
        points = [h["line"] for h in cuttable if a < h["line"] <= b and h["level"] == level]
        if not points:
            return split(a, b, level + 1)
        bounds = [a] + points + [b + 1]
        out = []
        for x, y in zip(bounds, bounds[1:], strict=False):
            if y - 1 >= x:
                out.extend(split(x, y - 1, level + 1))
        return out

    def by_size(a: int, b: int) -> list[tuple[int, int]]:
        """Cut a span with no headings at line boundaries, outside tables and fenced blocks."""
        out, start, size = [], a, 0
        for i in range(a, b + 1):
            size += len(lines[i - 1]) + 1
            if size >= MAX_CHARS * 0.7 and i < b and i + 1 not in blocked:
                out.append((start, i))
                start, size = i + 1, 0
        return out + [(start, b)]

    top = min((h["level"] for h in cuttable), default=1)
    segs = split(start_line, n, top) if n >= start_line else []
    segs = [piece for a, b in segs for piece in (by_size(a, b) if chars(lines, a, b) > MAX_CHARS else [(a, b)])]
    merged: list[list[int]] = []
    for a, b in segs:
        if (
            merged
            and (chars(lines, *merged[-1]) < MIN_CHARS or chars(lines, a, b) < MIN_CHARS)
            and chars(lines, merged[-1][0], b) <= MAX_CHARS
        ):
            merged[-1][1] = b
        else:
            merged.append([a, b])
    by_line = {h["line"]: h for h in heads}
    out = []
    for a, b in merged:
        first = next((by_line[i] for i in range(a, b + 1) if i in by_line), None)
        out.append(
            {
                "start": a,
                "end": b,
                "chars": chars(lines, a, b),
                "heading": first["text"] if first else lines[a - 1][:80],
            }
        )
    return out


def find_toc(lines: list[str]) -> dict | None:
    for i, line in enumerate(lines[:WINDOW], 1):
        if line.strip() == TOC_START:
            return {"line": i, "made_by": "shard-pro"}
        m = HEADING.match(line)
        if m and re.fullmatch(r"(table of )?contents", m.group(2).strip(), re.I):
            return {"line": i, "made_by": "source"}
    return None


def cmd_outline(args) -> int:
    path = Path(args.source).resolve()
    if not path.is_file():
        return fail(f"not a file: {path}")
    lines = read_lines(path)
    spans = block_spans(lines)
    own = toc_lines(lines)
    if own:
        spans.append((own[0] + 1, own[1], "contents"))
    heads = headings(lines, spans)
    fm = frontmatter_end(lines)
    prefixes: dict[str, int] = {}
    defined: dict[str, int] = {}
    for h in heads:
        for ident in IDENT.findall(h["text"]):
            prefixes[ident.rsplit("-", 1)[0]] = prefixes.get(ident.rsplit("-", 1)[0], 0) + 1
            defined.setdefault(ident, []).append(h["line"])
    sections = [h for h in heads if h["level"] > 1]
    shown = [h for h in heads if h["level"] <= args.depth]
    if args.from_line or args.to_line:
        lo, hi = args.from_line or 1, args.to_line or len(lines)
        shown = [h for h in heads if lo <= h["line"] <= hi]
    out = {
        "source": str(path),
        "lines": len(lines),
        "chars": sum(len(x) + 1 for x in lines),
        "words": sum(len(x.split()) for x in lines),
        "frontmatter_lines": fm,
        "heading_count": len(heads),
        "bare_heading_share": round(sum(h["bare"] for h in sections) / len(sections), 2) if sections else 0,
        "existing_contents": find_toc(lines),
        "blocks": [{"start": a, "end": b, "kind": k} for a, b, k in spans if k != "table" or b - a >= 3],
        "identifier_prefixes": dict(sorted(prefixes.items(), key=lambda kv: -kv[1])[:20]),
        "headings": [
            {k: h[k] for k in ("line", "level", "text")} | ({"first_line": h["first_line"]} if h["bare"] else {})
            for h in shown
        ],
        "proposed_cut": propose_cut(lines, heads, spans, fm + 1),
    }
    twice = {i: ls for i, ls in defined.items() if len(ls) > 1}
    if twice:
        out["identifiers_defined_twice"] = twice
    if args.ids:
        out["defined_identifiers"] = defined
    return emit(out)


def all_shards(plan: dict) -> list[dict]:
    return [s for g in plan["groups"] for s in g["shards"]]


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "group"


def map_entry(s: dict) -> str:
    return f"- [{s['title']}](./{s['file']}) — {s['summary']}"


def plain_name(name: str) -> str:
    return name[2:] if name.startswith("./") else name


def shard_header(s: dict, group: str, main_name: str) -> list[str]:
    """A shard's frontmatter: the link to its main file and its own map entry."""
    data = {"part_of": f"./{main_name}", "title": s["title"], "summary": s["summary"], "group": group}
    if s.get("related"):
        data["related"] = [f"./{plain_name(x)}" for x in s["related"]]
    text = yaml.safe_dump(data, sort_keys=False, allow_unicode=True, width=1_000_000)
    return ["---", *text.splitlines(), "---", ""]


def body_start(lines: list[str]) -> int:
    """Index where a shard's own text begins: after its frontmatter and the blank line under it."""
    n = frontmatter_end(lines)
    return n + 1 if n and n < len(lines) and not lines[n].strip() else n


def shards_in(folder: Path, main: Path) -> tuple[list[dict], list[dict]]:
    """Every shard in the folder (a .md file whose frontmatter `part_of` names the main file), and
    failures for files whose frontmatter does not parse."""
    found, broken = [], []
    for p in sorted(folder.glob("*.md")):
        if p.name == main.name:
            continue
        lines = read_lines(p)
        n = frontmatter_end(lines)
        if not n:
            continue
        try:
            data = yaml.safe_load("\n".join(lines[1 : n - 1])) or {}
        except yaml.YAMLError as e:
            first = str(e).splitlines()[0]
            broken.append({"check": "frontmatter", "file": p.name, "text": f"frontmatter does not parse: {first}"})
            continue
        part_of = data.get("part_of") if isinstance(data, dict) else None
        if not isinstance(part_of, str) or plain_name(part_of) != main.name:
            continue
        related = data.get("related") or []
        found.append(
            {
                "file": p.name,
                "title": str(data.get("title") or ""),
                "summary": str(data.get("summary") or ""),
                "group": str(data["group"]) if data.get("group") else None,
                "related": [plain_name(str(x)) for x in related] if isinstance(related, list) else [],
                "keys": list(data),
            }
        )
    return found, broken


def read_map(folder: Path, main: Path) -> tuple[list[dict], list[str]]:
    """The map's entries in order (file, title, summary, group), following map pages, and the map page names."""
    entries, pages = [], []

    def walk(path: Path, group: str | None, top: bool) -> None:
        in_map = not top
        for line in read_lines(path):
            if top and line.strip() == "## Map":
                in_map = True
                continue
            if not in_map:
                continue
            if top and line.startswith("### "):
                group = line[4:].strip()
                continue
            m = MAP_LINE.match(line)
            if not m or m.group(2) == LOOKUP_FILE:
                continue
            title, target, summary = m.groups()
            page = folder / target
            plain = "/" not in target and "\\" not in target
            if top and plain and target.startswith("map-") and page.exists() and not frontmatter_end(read_lines(page)):
                pages.append(target)
                walk(page, title, False)
                continue
            entries.append({"file": target, "title": title, "summary": summary or "", "group": group})

    if main.exists():
        walk(main, None, True)
    return entries, pages


def main_text(plan: dict, front: list[str], folder: Path, has_lookup: bool) -> tuple[str, dict[str, str]]:
    """The main file, plus sub-map files when the full map would pass the 200-line window."""
    note = NOTE_PATH.read_text(encoding="utf-8").strip()
    head = front + [f"# {plan['title']}", "", note, "", "## Map", ""]
    lookup = [f"- [Identifier lookup](./{LOOKUP_FILE}) — which shard holds each identifier"] if has_lookup else []
    body = lookup + ([""] if lookup else [])
    for g in plan["groups"]:
        body += [f"### {g['heading']}", ""] + [map_entry(s) for s in g["shards"]] + [""]
    if len(head) + len(body) <= WINDOW:
        return "\n".join(head + body).rstrip() + "\n", {}
    subs, short = {}, list(lookup)
    for g in plan["groups"]:
        name, k = f"map-{slug(g['heading'])}.md", 2
        while name in subs:
            name, k = f"map-{slug(g['heading'])}-{k}.md", k + 1
        about = g.get("summary") or "; ".join(s["title"] for s in g["shards"][:3])
        short.append(f"- [{g['heading']}](./{name}) — {len(g['shards'])} shards: {about}")
        lines = [f"# {plan['title']}: {g['heading']}", "", f"Part of [{plan['title']}](./{folder.name}.md).", ""]
        subs[name] = "\n".join(lines + [map_entry(s) for s in g["shards"]]) + "\n"
    return "\n".join(head + short).rstrip() + "\n", subs


def validate_plan(plan: dict, lines: list[str]) -> str | None:
    n_lines = len(lines)
    for key in ("source", "folder", "title", "groups"):
        if key not in plan:
            return f"plan is missing '{key}'"
    if plan.get("lookup"):
        try:
            re.compile(plan["lookup"])
        except re.error as e:
            return f"lookup pattern does not compile: {e}"
    inside = {}
    for a, b, kind in block_spans(lines):
        for i in range(a + 1, b + 1):
            inside[i] = (a, b, kind)
    for g in plan["groups"]:
        if "heading" not in g or not isinstance(g.get("shards"), list):
            return f"each group needs a heading and a shards list: {str(g)[:80]}"
        if len(g["shards"]) > WINDOW - 4:
            return f"group '{g['heading']}' has {len(g['shards'])} shards; a map page holds {WINDOW - 4}, so split the group"
    if len(plan["groups"]) > WINDOW - 10:
        return f"{len(plan['groups'])} groups will not fit one map page; merge some"
    if not all_shards(plan):
        return "the plan has no shards"
    fm = frontmatter_end(lines)
    seen, expect = set(), None
    for s in all_shards(plan):
        for key in ("file", "title", "summary", "start", "end"):
            if key not in s:
                return f"shard {s.get('file', '?')} is missing '{key}'"
        if s["file"] in seen:
            return f"duplicate shard file {s['file']}"
        if Path(s["file"]).name != s["file"] or not s["file"].endswith(".md"):
            return f"shard file {s['file']} must be a plain .md file name, with no folder"
        seen.add(s["file"])
        if not isinstance(s["start"], int) or not isinstance(s["end"], int):
            return f"{s['file']} needs whole-number start and end lines"
        if expect is None:
            if s["start"] not in (1, fm + 1):
                return f"{s['file']} starts at line {s['start']}; the first shard starts at line {fm + 1}"
            expect = s["start"]
        if s["start"] != expect:
            return f"{s['file']} starts at line {s['start']}; expected {expect} (gap or overlap)"
        if s["end"] < s["start"]:
            return f"{s['file']} ends before it starts"
        if s["start"] in inside:
            a, b, kind = inside[s["start"]]
            return f"{s['file']} starts at line {s['start']}, inside the {kind} block at lines {a}-{b}"
        if not isinstance(s.get("related", []), list):
            return f"{s['file']}: related must be a list of shard file names"
        expect = s["end"] + 1
    files = {s["file"] for s in all_shards(plan)}
    for s in all_shards(plan):
        for r in s.get("related", []):
            if plain_name(str(r)) not in files:
                return f"{s['file']}: related shard {r} is not in the plan"
    if expect is not None and expect != n_lines + 1:
        return f"faithful ranges end at line {expect - 1}; the source has {n_lines}"
    return None


def clashes(plan: dict, folder: Path, src: Path) -> str | None:
    """Why build would overwrite a file it did not write, or write two outputs to one path."""
    main = f"{folder.name}.md"
    _, subs = main_text(plan, [], folder, bool(plan.get("lookup")))
    reserved = {main, MANIFEST} | set(subs) | ({LOOKUP_FILE} if plan.get("lookup") else set())
    for s in all_shards(plan):
        if s["file"] in reserved:
            return f"shard file {s['file']} would collide with a file shard-pro writes; rename it"
    old = load_manifest(folder) or {"groups": []}
    ours = {x["file"] for x in all_shards(old)} | set(old.get("sub_maps", [])) | {LOOKUP_FILE, MANIFEST}
    for name in sorted({s["file"] for s in all_shards(plan)} | reserved):
        p = folder / name
        if not p.exists() or name in ours:
            continue
        if name == main and (p.resolve() == src.resolve() or any(NOTE_MARK in x for x in read_lines(p)[:WINDOW])):
            continue
        return (
            f"{name} already exists in {folder.name}/ and shard-pro did not write it; rename the shard or move the file"
        )
    return None


def cmd_build(args) -> int:
    plan_path = Path(args.plan).resolve()
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    src = Path(plan.get("source", ""))
    folder = Path(plan.get("folder", "")).resolve()
    if (folder / ".source" / src.name).is_file():
        # A rebuild: the frozen copy is the source, even where the main file now sits at the old path.
        src = folder / ".source" / src.name
    if not src.is_file():
        return fail(f"source not found: {src}")
    lines = read_lines(src)
    if toc_lines(lines):
        return fail(
            f"{src.name} carries a shard-pro contents list; remove it with `toc {src} --remove`, then outline and plan again"
        )
    err = validate_plan(plan, lines) or clashes(plan, folder, src)
    if err:
        return fail(err)
    old = load_manifest(folder)
    if old and not args.force and (edited := edits_since_build(folder, old)):
        return fail(f"{edited}; building again would discard those edits, and --force discards them")
    folder.mkdir(parents=True, exist_ok=True)
    if old:
        keep = {x["file"] for x in all_shards(plan)}
        for name in [x["file"] for x in all_shards(old)] + old.get("sub_maps", []) + [LOOKUP_FILE]:
            if name not in keep:
                (folder / name).unlink(missing_ok=True)
    store = folder / ".source"
    store.mkdir(exist_ok=True)
    fm = frontmatter_end(lines)
    front = lines[:fm]
    if src.resolve() != (store / src.name).resolve():
        shutil.copy2(src, store / src.name)
    written = []
    for g in plan["groups"]:
        for s in g["shards"]:
            a = max(s["start"], fm + 1)
            header = shard_header(s, g["heading"], f"{folder.name}.md")
            body = lines[a - 1 : s["end"]]
            (folder / s["file"]).write_text("\n".join(header + body) + "\n", encoding="utf-8")
            written.append({"file": s["file"], "chars": sum(len(x) + 1 for x in body)})
    has_lookup = bool(plan.get("lookup"))
    text, subs = main_text(plan, front, folder, has_lookup)
    main = folder / f"{folder.name}.md"
    main.write_text(text, encoding="utf-8")
    for name, body in subs.items():
        (folder / name).write_text(body, encoding="utf-8")
    plan["source"] = f".source/{src.name}"
    plan["frontmatter_lines"] = fm
    plan["sub_maps"] = sorted(subs)
    (folder / MANIFEST).write_text(json.dumps(plan, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    if src.exists() and src.resolve() != main.resolve() and src.resolve().parent != store.resolve():
        src.unlink()
    lookup = write_lookup(folder, plan) if has_lookup else None
    return emit(
        {
            "ok": True,
            "main": str(main),
            "shards_cut": written,
            "sub_maps": sorted(subs),
            "lookup": lookup,
        }
    )


def body_lines(path: Path) -> list[str]:
    """A shard's lines without its frontmatter, so identifiers in its title are not read as defined there."""
    lines = read_lines(path)
    return lines[body_start(lines) :]


def defines(line: str) -> bool:
    """A line that introduces an identifier: a heading or a bold label."""
    return bool(HEADING.match(line)) or line.lstrip().startswith("**")


def identifiers(pattern: re.Pattern, line: str) -> list[str]:
    return [m.group(0) for m in pattern.finditer(line)]


def lookup_homes(folder: Path, shards: list[dict], pattern: re.Pattern) -> dict[str, list[str]]:
    """Each identifier a shard defines, and the shards that define it."""
    homes: dict[str, list[str]] = {}
    for s in shards:
        for line in body_lines(folder / s["file"]):
            if defines(line):
                for ident in identifiers(pattern, line):
                    if s["file"] not in homes.setdefault(ident, []):
                        homes[ident].append(s["file"])
    return homes


def listed_homes(path: Path) -> dict[str, set[str]]:
    """The identifier lookup as it reads now: identifier to the shards its row links."""
    rows = (re.match(r"^\| (.+?) \| (.*) \|$", x) for x in read_lines(path)[6:])
    return {m.group(1): set(re.findall(r"\]\(\./([^)]+)\)", m.group(2))) for m in rows if m}


def write_lookup(folder: Path, plan: dict) -> dict:
    shards, _ = shards_in(folder, folder / f"{folder.name}.md")
    homes = lookup_homes(folder, shards, re.compile(plan["lookup"]))
    rows = [
        f"| {i} | {', '.join(f'[{Path(f).stem}](./{f})' for f in fs)} |"
        for i, fs in sorted(homes.items(), key=lambda kv: natural(kv[0]))
    ]
    text = [
        "# Identifier lookup",
        "",
        f"Part of [{plan['title']}](./{folder.name}.md). Which shard holds each identifier.",
        "",
        "| Identifier | Shard |",
        "|---|---|",
    ] + rows
    (folder / LOOKUP_FILE).write_text("\n".join(text) + "\n", encoding="utf-8")
    return {"identifiers": len(homes), "in_several_shards": sorted(i for i, fs in homes.items() if len(fs) > 1)}


def natural(s: str) -> list:
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s)]


def cmd_lookup(args) -> int:
    folder = Path(args.folder).resolve()
    plan = load_manifest(folder)
    if plan is None:
        return fail(f"no {MANIFEST} in {folder}")
    if not plan.get("lookup"):
        return fail("the plan has no lookup pattern")
    return emit({"ok": True} | write_lookup(folder, plan))


def cmd_map(args) -> int:
    folder = Path(args.folder).resolve()
    main = folder / f"{folder.name}.md"
    if not main.exists():
        return fail(f"no main file {main.name} in {folder}")
    shards, broken = shards_in(folder, main)
    plan = load_manifest(folder) or {}
    current = read_lines(main)
    fm = frontmatter_end(current)
    title = next((x[2:].strip() for x in current[fm:] if x.startswith("# ")), plan.get("title") or folder.name)
    entries, pages = read_map(folder, main)
    by_file = {s["file"]: s for s in shards}
    # A shard whose frontmatter does not parse keeps the map line it already has until it is fixed.
    unread = {b["file"] for b in broken}
    by_file |= {e["file"]: e | {"group": None} for e in entries if e["file"] in unread}
    groups: dict[str, list[dict]] = {}
    placed: set[str] = set()
    last = None
    for e in entries:
        s = by_file.get(e["file"])
        if s and e["file"] not in placed:
            last = s["group"] or e["group"] or last or "Shards"
            groups.setdefault(last, []).append(s)
            placed.add(e["file"])
    added = [s for s in shards if s["file"] not in placed]
    for s in added:
        groups.setdefault(s["group"] or last or "Shards", []).append(s)
    if not groups:
        return fail(f"no shards in {folder.name}/: no file's frontmatter has part_of: ./{main.name}")
    about = {g["heading"]: g.get("summary") for g in plan.get("groups", [])}
    layout = {
        "title": title,
        "groups": [{"heading": h, "summary": about.get(h), "shards": ss} for h, ss in groups.items()],
    }
    text, subs = main_text(layout, current[:fm], folder, bool(plan.get("lookup")))
    main.write_text(text, encoding="utf-8")
    for old in (set(pages) | set(plan.get("sub_maps", []))) - set(subs):
        (folder / old).unlink(missing_ok=True)
    for name, body in subs.items():
        (folder / name).write_text(body, encoding="utf-8")
    if plan:
        plan["sub_maps"] = sorted(subs)
        (folder / MANIFEST).write_text(json.dumps(plan, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    out = {
        "ok": not broken,
        "main": str(main),
        "sub_maps": sorted(subs),
        "added": [s["file"] for s in added],
        "dropped": [e["file"] for e in entries if e["file"] not in by_file],
    }
    if broken:
        out["unparsed"] = [{"file": b["file"], "text": b["text"]} for b in broken]
    return emit(out, 1 if broken else 0)


def join_difference(folder: Path, plan: dict, source: list[str]) -> int | None:
    """First source line the built shards no longer reproduce, or None when they join back exactly."""
    joined = source[: plan.get("frontmatter_lines", 0)]
    for s in all_shards(plan):
        if (folder / s["file"]).exists():
            joined += body_lines(folder / s["file"])
    if joined == source:
        return None
    return next(
        (i for i, (x, y) in enumerate(zip(joined, source, strict=False), 1) if x != y),
        min(len(joined), len(source)) + 1,
    )


def edits_since_build(folder: Path, plan: dict) -> str | None:
    """Why the shards are no longer what build cut, or None when they are."""
    source = folder / plan["source"]
    if not source.exists():
        return None
    first = join_difference(folder, plan, read_lines(source))
    if first is not None:
        return f"the shards were edited after build (they differ from the source at line {first})"
    cut = {
        s["file"]: (s["title"], s["summary"], g["heading"], [plain_name(str(r)) for r in s.get("related", [])])
        for g in plan["groups"]
        for s in g["shards"]
    }
    shards, _ = shards_in(folder, folder / f"{folder.name}.md")
    found = {s["file"] for s in shards}
    unreadable = sorted(f for f in cut if f not in found and (folder / f).exists())
    if unreadable:
        return f"the frontmatter of {', '.join(unreadable)} was edited after build and no longer reads as a shard"
    extra = sorted(s["file"] for s in shards if s["file"] not in cut)
    if extra:
        return f"shards were added after build: {', '.join(extra)}"
    changed = sorted(
        s["file"] for s in shards if cut[s["file"]] != (s["title"], s["summary"], s["group"], s["related"])
    )
    return f"shard frontmatter was edited after build: {', '.join(changed)}" if changed else None


def load_manifest(folder: Path) -> dict | None:
    p = folder / MANIFEST
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else None


def toc_block(entries: list[dict], offset: int) -> list[str]:
    out = [
        TOC_START,
        "## Contents",
        "",
        "Line numbers are lines of this file; read a section by its range. Edits shift the ranges, so when a range does not start at its section, find the section by its title nearby. When you add a section, add its line here, as `- L<first line> <title>`.",
    ]
    group = None
    for e in entries:
        if e.get("group") and e["group"] != group:
            group = e["group"]
            out += ["", f"**{group}**"]
        out.append(f"- L{e['start'] + offset}-{e['end'] + offset} {e['title']}")
    return out + [TOC_END]


def title_end(body: list[str]) -> int:
    """Index after the frontmatter and the title line: where the contents list goes."""
    at = frontmatter_end(body)
    return at + 1 if at < len(body) and body[at].startswith("# ") else at


def strip_toc(lines: list[str]) -> list[str]:
    """The file without a shard-pro contents list and the blank line inserted before it."""
    marks = [x.strip() for x in lines]
    if TOC_START not in marks or TOC_END not in marks:
        return lines
    a, b = marks.index(TOC_START), marks.index(TOC_END)
    if a > 0 and lines[a - 1] == "":
        a -= 1
    return lines[:a] + lines[b + 1 :]


def toc_lines(raw: list[str]) -> tuple[int, int] | None:
    """0-based start and end (exclusive) of a shard-pro contents list and the blank line before it."""
    marks = [x.strip() for x in raw]
    if TOC_START not in marks or TOC_END not in marks:
        return None
    a, b = marks.index(TOC_START), marks.index(TOC_END) + 1
    return (a - 1 if a > 0 and raw[a - 1] == "" else a), b


def to_body(raw: list[str], line: int) -> int:
    """A line number of the file as it reads now, counted in the file without its contents list."""
    span = toc_lines(raw)
    return line - (span[1] - span[0]) if span and line > span[1] else line


def ambiguous_anchors(stored: list[dict], body: list[str]) -> list[dict]:
    """Sections whose first line now appears more often than the list has sections starting with it."""
    want = Counter(x["anchor"] for x in stored)
    have = Counter(body)
    return [
        {"first_line": a, "at_lines": [i for i, x in enumerate(body, 1) if x == a]} for a in want if have[a] > want[a]
    ]


def listed_entries(raw: list[str]) -> list[tuple[int, str, str | None, bool]]:
    """Each line of the contents list as it reads now: start line, title, the group above it, and whether it
    carries a range (the lines toc writes do; a line added by hand names only its first line)."""
    span = toc_lines(raw)
    out, group = [], None
    for line in raw[span[0] : span[1]] if span else []:
        if line.startswith("**") and line.rstrip().endswith("**"):
            group = line.strip().strip("*")
        elif m := TOC_ENTRY.match(line):
            out.append((int(m.group(1)), m.group(3).strip(), group, bool(m.group(2))))
    return out


def sidecar(path: Path) -> Path:
    return path.with_name(f".{path.stem}.contents.json")


def cmd_toc(args) -> int:
    path = Path(args.file).resolve()
    raw = read_lines(path)
    body = strip_toc(raw)
    if args.plan:
        plan = json.loads(Path(args.plan).read_text(encoding="utf-8"))
        items = [
            {"start": s.get("start"), "title": s.get("title"), "group": g.get("heading")}
            for g in plan.get("groups", [])
            for s in g.get("shards", [])
        ]
        prev = 0
        for e in items:
            if not e["title"] or not isinstance(e["start"], int):
                return fail(f"every entry needs a title and a start line: {e}")
            e["start"] = to_body(raw, e["start"])
            if not prev < e["start"] <= len(body):
                return fail(
                    f"'{e['title']}' starts at line {e['start']}; starts must rise and stay within the {len(body)}-line file"
                )
            prev = e["start"]
    elif args.remove:
        path.write_text("\n".join(body) + "\n", encoding="utf-8")
        sidecar(path).unlink(missing_ok=True)
        return emit({"ok": True, "file": str(path), "removed": len(raw) - len(body)})
    else:
        if not sidecar(path).exists():
            return fail("no shard-pro contents list for this file; pass --plan to create one")
        # Each section is re-found by the text of its first line, which survives edits elsewhere.
        stored = json.loads(sidecar(path).read_text(encoding="utf-8"))
        twice = ambiguous_anchors(stored, body)
        if twice:
            return emit({"ok": False, "file": str(path), "ambiguous": twice}, 1)
        items, pos, lost, added = [], 0, [], []
        for item in stored:
            idx = next((i for i in range(pos, len(body)) if body[i] == item["anchor"]), None)
            if idx is None:
                lost.append(item)
                continue
            items.append({"start": idx + 1, "title": item["title"], "group": item.get("group")})
            pos = idx + 1
        # Lines someone added to the list by hand join it at the line they name.
        known = Counter(x["title"] for x in stored)
        rows = listed_entries(raw)
        # When titles repeat, the lines toc wrote (with a range) are the recorded ones.
        for row in sorted(rows, key=lambda r: not r[3]):
            if known[row[1]]:
                known[row[1]] -= 1
                rows.remove(row)
        for line, title, group, _ in rows:
            at = to_body(raw, line)
            if 1 <= at <= len(body) and all(e["start"] != at for e in items):
                items.append({"start": at, "title": title, "group": group})
                added.append(title)
        items.sort(key=lambda e: e["start"])
        if args.add:
            line = to_body(raw, args.add)
            if not args.title or not 1 <= line <= len(body):
                return fail("--add needs --title and a line number inside the file")
            new_item = {"start": line, "title": args.title, "group": args.group}
            if any(e["start"] == line for e in items):
                return fail(f"a section already starts at line {args.add}")
            items = sorted(items + [new_item], key=lambda e: e["start"])
            if new_item["group"] is None:
                k = items.index(new_item)
                new_item["group"] = items[k - 1]["group"] if k else None
    at = title_end(body)
    for i, e in enumerate(items):
        e["start"] = max(e["start"], at + 1)
        limit = items[i + 1]["start"] - 1 if i + 1 < len(items) else len(body)
        # A blank line is a poor anchor: start each section at its first line with text.
        while e["start"] < limit and not body[e["start"] - 1].strip():
            e["start"] += 1
    for i, e in enumerate(items):
        e["end"] = items[i + 1]["start"] - 1 if i + 1 < len(items) else len(body)
    anchors = [body[e["start"] - 1] for e in items]
    block = toc_block(items, 0)
    block = toc_block(items, len(block) + 1)
    new = body[:at] + [""] + block + body[at:]
    path.write_text("\n".join(new) + "\n", encoding="utf-8")
    side = [{"anchor": a, "title": e["title"], "group": e.get("group")} for a, e in zip(anchors, items, strict=True)]
    sidecar(path).write_text(json.dumps(side, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    end = at + 1 + len(block)
    out = {"ok": True, "file": str(path), "entries": len(items), "list_ends_at_line": end, "fits_window": end <= WINDOW}
    if not args.plan and added:
        out["added_from_list"] = added
    if not args.plan and lost:
        # A renamed or removed section start: the rest are refreshed; the lost ones are re-added with --add.
        out |= {"ok": False, "lost": [{"title": x["title"], "first_line_was": x["anchor"]} for x in lost]}
        return emit(out, 1)
    return emit(out)


def check_toc(path: Path) -> tuple[list, list]:
    fails, warns = [], []
    lines = read_lines(path)
    side = sidecar(path)
    if TOC_START not in [x.strip() for x in lines] or not side.exists():
        return [{"check": "contents", "file": path.name, "text": "no shard-pro contents list"}], []
    stored = json.loads(side.read_text(encoding="utf-8"))
    end = next((i for i, x in enumerate(lines, 1) if x.strip() == TOC_END), None)
    if end is None:
        return [
            {
                "check": "contents",
                "file": path.name,
                "text": "the contents list has no end marker; run toc to rebuild it",
            }
        ], []
    if end > WINDOW:
        fails.append({"check": "window", "file": path.name, "text": f"contents list ends at line {end}, past {WINDOW}"})
    ranges = [re.match(r"^- L(\d+)-(\d+) ", x) for x in lines[:end]]
    ranges = [(int(m.group(1)), int(m.group(2))) for m in ranges if m]
    for (a, b), nxt in zip(ranges, ranges[1:] + [(len(lines) + 1, 0)], strict=True):
        if b != nxt[0] - 1:
            want = "the end of the file" if nxt[1] == 0 else f"line {nxt[0] - 1}"
            fails.append(
                {
                    "check": "contents",
                    "file": path.name,
                    "line": a,
                    "text": f"L{a}-{b} should end at {want}; run toc to refresh",
                }
            )
    prev = 0
    for a, b in ranges:
        if not prev < a <= b:
            fails.append(
                {
                    "check": "contents",
                    "file": path.name,
                    "line": a,
                    "text": f"L{a}-{b} is out of order or ends before it starts",
                }
            )
        prev = b
    for item in ambiguous_anchors(stored, strip_toc(lines)):
        fails.append(
            {
                "check": "contents",
                "file": path.name,
                "text": f"'{item['first_line']}' starts several sections; re-plan the list with toc --plan",
            }
        )
    listed = [a for a, _ in ranges]
    for a, item in zip(listed, stored, strict=False):
        if a > len(lines) or lines[a - 1] != item["anchor"]:
            fails.append(
                {
                    "check": "contents",
                    "file": path.name,
                    "line": a,
                    "text": f"L{a} is not the start of '{item['title']}'; run toc to refresh",
                }
            )
    if len(listed) != len(stored):
        fails.append(
            {
                "check": "contents",
                "file": path.name,
                "text": "contents list and its record disagree; run toc to refresh",
            }
        )
    return fails, warns


def anchor_slug(text: str) -> str:
    return re.sub(r"[^\w\- ]", "", text.strip().lower()).replace(" ", "-")


def broken_links(shard: Path) -> list[dict]:
    """Relative links and #anchors in a shard that no longer reach their target after the split."""
    lines = read_lines(shard)
    own = {anchor_slug(m.group(2)) for m in map(HEADING.match, lines) if m}
    at: dict[str, list[int]] = {}
    for i, line in enumerate(lines, 1):
        for target in ANY_LINK.findall(line):
            if "://" in target or target.startswith(("mailto:", "/", "<")):
                continue
            path, _, anchor = target.partition("#")
            gone = not (shard.parent / path).exists() if path else anchor_slug(anchor) not in own
            if gone:
                at.setdefault(target, []).append(i)
    return [
        {
            "check": "link",
            "file": shard.name,
            "line": ls[0],
            "text": f"link to {t} no longer resolves" + (f" ({len(ls)} times)" if len(ls) > 1 else ""),
        }
        for t, ls in at.items()
    ]


def check_folder(folder: Path, rebuild: bool) -> tuple[list, list]:
    fails, warns = [], []
    main = folder / f"{folder.name}.md"
    if not main.exists():
        return [{"check": "main", "file": main.name, "text": "main file missing"}], []
    plan = load_manifest(folder)
    if not any(NOTE_MARK in x for x in read_lines(main)[:WINDOW]):
        fails.append({"check": "note", "file": main.name, "text": "the sharded-document note is missing"})
    shards, broken = shards_in(folder, main)
    fails += broken
    if not shards and not broken:
        fails.append(
            {"check": "shards", "file": main.name, "text": f"no file's frontmatter has part_of: ./{main.name}"}
        )
    entries, pages = read_map(folder, main)
    maps = [main.name] + pages
    linked: set[str] = set()
    for m in maps:
        for i, line in enumerate(read_lines(folder / m), 1):
            for target in LINK.findall(line):
                linked.add(target)
                if i > WINDOW:
                    fails.append(
                        {"check": "window", "file": m, "line": i, "text": f"map link to {target} is past line {WINDOW}"}
                    )
    names = {s["file"] for s in shards} | ({LOOKUP_FILE} if plan and plan.get("lookup") else set())
    for f in sorted(names - linked):
        fails.append(
            {"check": "orphan", "file": f, "text": "shard is not linked from the map; add its line or run map"}
        )
    for p in sorted(folder.glob("*.md")):
        for i, line in enumerate(read_lines(p), 1):
            for target in LINK.findall(line):
                if not (folder / target).exists():
                    fails.append({"check": "link", "file": p.name, "line": i, "text": f"link to missing {target}"})
    listed = {e["file"]: e for e in entries}
    prefix = folder.name.split("-")[0] + "-" if "-" in folder.name else None
    for s in shards:
        p = folder / s["file"]
        warns += broken_links(p)
        if prefix and s["file"].startswith(prefix):
            fails.append(
                {
                    "check": "name",
                    "file": s["file"],
                    "text": f"name starts with '{prefix}', so a '{prefix}*' glob would load it as another document",
                }
            )
        if {"type", "ticket"} & set(s["keys"]):
            fails.append(
                {
                    "check": "frontmatter",
                    "file": s["file"],
                    "text": "shards carry no type or ticket keys; those stay in the main file",
                }
            )
        if not s["title"] or not s["summary"]:
            fails.append({"check": "frontmatter", "file": s["file"], "text": "frontmatter needs a title and a summary"})
        for r in s["related"]:
            if not (folder / r).exists():
                warns.append({"check": "related", "file": s["file"], "text": f"related shard {r} is missing"})
        e = listed.get(s["file"])
        if e and (e["title"], e["summary"]) != (s["title"], s["summary"]):
            fails.append(
                {
                    "check": "map",
                    "file": s["file"],
                    "text": "its map line differs from its frontmatter title or summary; update the line or run map",
                }
            )
        if (size := len(p.read_text(encoding="utf-8"))) > MAX_CHARS:
            warns.append(
                {
                    "check": "size",
                    "file": s["file"],
                    "text": f"{size} characters, over {MAX_CHARS}; consider splitting it",
                }
            )
    if plan is None:
        if rebuild:
            fails.append(
                {"check": "manifest", "file": MANIFEST, "text": f"--rebuild needs {MANIFEST}, the build record"}
            )
        return fails, warns
    source_path = folder / plan["source"]
    source = read_lines(source_path) if source_path.exists() else None
    if source is None:
        fails.append({"check": "source", "file": plan["source"], "text": "the frozen original is missing"})
    if rebuild and source is not None:
        first = join_difference(folder, plan, source)
        if first is not None:
            fails.append(
                {
                    "check": "rebuild",
                    "file": plan["source"],
                    "line": first,
                    "text": "the shards do not join back into the source",
                }
            )
    if plan.get("lookup"):
        homes = lookup_homes(folder, shards, re.compile(plan["lookup"]))
        listed = listed_homes(folder / LOOKUP_FILE) if (folder / LOOKUP_FILE).exists() else {}
        if listed != {i: set(fs) for i, fs in homes.items()}:
            fails.append(
                {
                    "check": "lookup",
                    "file": LOOKUP_FILE,
                    "text": "the identifier lookup does not match the shards; fix its rows or run lookup",
                }
            )
        for ident, fs in sorted(homes.items()):
            if len(fs) > 1:
                warns.append(
                    {
                        "check": "identifier",
                        "file": ", ".join(sorted(fs)),
                        "text": f"{ident} is defined in more than one shard",
                    }
                )
    return fails, warns


def prepared_under(root: Path) -> list[Path]:
    """Every sharded folder and every file with a shard-pro contents list under root, skipping hidden folders.
    A document is found by any one of its marks, so a damaged one is checked rather than skipped."""
    found: set[Path] = set()
    for here, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d != "node_modules"]
        d = Path(here)
        if MANIFEST in files:
            found.add(d)
        for name in files:
            if not name.endswith(".md"):
                continue
            p = d / name
            head = [x.strip() for x in read_lines(p)[:WINDOW]]
            if p.stem == d.name and any(NOTE_MARK in x for x in head):
                found.add(d)
            elif sidecar(p).exists() or TOC_START in head:
                found.add(p)
    return sorted(found)


def cmd_check(args) -> int:
    target = Path(args.target).resolve()
    if args.all:
        if not target.is_dir():
            return fail(f"--all needs a folder: {target}")
        fails, warns, checked = [], [], []
        for t in prepared_under(target):
            f, w = check_folder(t, False) if t.is_dir() else check_toc(t)
            where = t.relative_to(target).as_posix()
            fails += [x | {"target": where} for x in f]
            warns += [x | {"target": where} for x in w]
            checked.append(where)
        return emit({"ok": not fails, "checked": checked, "failures": fails, "warnings": warns}, 0 if not fails else 1)
    if target.is_dir():
        fails, warns = check_folder(target, args.rebuild)
    elif target.is_file():
        fails, warns = check_toc(target)
    else:
        return fail(f"not found: {target}")
    return emit({"ok": not fails, "failures": fails, "warnings": warns}, 0 if not fails else 1)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("outline", help="measure a text file and propose a cut")
    p.add_argument("source")
    p.add_argument("--depth", type=int, default=3, help="list headings to this level (default 3)")
    p.add_argument("--from", dest="from_line", type=int, help="list every heading from this line")
    p.add_argument("--to", dest="to_line", type=int, help="list every heading up to this line")
    p.add_argument("--ids", action="store_true", help="include each identifier defined in a heading and its line")
    p = sub.add_parser(
        "build",
        help="build the sharded folder from a plan",
        description=PLAN_HELP,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("plan")
    p.add_argument("--force", action="store_true", help="build again even though the shards were edited since build")
    p = sub.add_parser("map", help="rewrite the main file's map from the shards' frontmatter")
    p.add_argument("folder")
    p = sub.add_parser("lookup", help="regenerate the identifier lookup")
    p.add_argument("folder")
    p = sub.add_parser(
        "toc",
        help="insert or refresh a contents list",
        description=PLAN_HELP,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("file")
    p.add_argument("--plan", help="create the list from a plan (only groups, start and title are read)")
    p.add_argument("--add", type=int, help="add a section starting at this line of the file as it reads now")
    p.add_argument("--title", help="title of the section added with --add")
    p.add_argument("--group", help="group of the section added with --add (default: the group before it)")
    p.add_argument("--remove", action="store_true", help="remove the contents list and its record")
    p = sub.add_parser("check", help="check a sharded folder or a file with a contents list")
    p.add_argument("target")
    p.add_argument("--rebuild", action="store_true", help="also check the faithful shards join back into the source")
    p.add_argument(
        "--all", action="store_true", help="check every sharded folder and contents list under the target folder"
    )
    args = ap.parse_args(argv)
    try:
        return {
            "outline": cmd_outline,
            "build": cmd_build,
            "map": cmd_map,
            "lookup": cmd_lookup,
            "toc": cmd_toc,
            "check": cmd_check,
        }[args.cmd](args)
    except Exception as e:  # any crash is an input problem to report, not a check failure
        return fail(f"{type(e).__name__}: {e}")


if __name__ == "__main__":
    sys.exit(main())
