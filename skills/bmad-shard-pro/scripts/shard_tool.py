#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""shard_tool — the deterministic half of bmad-shard-pro.

Every subcommand prints one JSON object to stdout; diagnostics go to stderr.
Exit codes: 0 = done or clean, 1 = check failures, 2 = usage or input error.

Subcommands:
  outline SOURCE [--depth N] [--from L --to L] [--ids]
      Size, headings, bare-identifier headings, tables and fenced blocks, frontmatter,
      an existing contents list, identifier prefixes, and a proposed cut along headings
      sized by characters that never splits a table or fenced block.
  build PLAN
      Build the sharded folder from a plan: cut faithful shards word for word, write the main
      file (note + map, sub-maps when the map would pass line 200), move the source into
      `.source/`, save the plan as `.shards.json`, and write the identifier lookup.
  map FOLDER
      Rewrite the main file's map (and sub-maps) from `.shards.json` after shards were added,
      renamed or re-summarised; the main file's frontmatter is kept.
  lookup FOLDER
      Regenerate `identifier-lookup.md` from the shards, using the plan's lookup pattern.
  toc FILE [--plan PLAN]
      Insert a contents list after the title, or with no plan refresh the line ranges of the
      one already there.
  check TARGET [--rebuild]
      Check a sharded folder or a file with a contents list. --rebuild also checks that the
      faithful shards join back into the source exactly (only true before any update).

Input is markdown or plain text; anything else is converted before this tool sees it.

Plan JSON: see `build --help`.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

PLAN_HELP = """Plan JSON:
  {
    "source": "the markdown or text file being split",
    "folder": "the document folder; the main file is <folder>/<folder name>.md",
    "title": "title for the main file",
    "lookup": "regex matching identifiers to index (optional)",
    "groups": [
      {"heading": "Map group", "summary": "optional, used when the map is split",
       "shards": [
         {"file": "name.md", "title": "Title", "summary": "One line", "start": 1, "end": 40}
       ]}
    ]
  }
  Shards are cut word for word from start to end (1-based, inclusive); together they cover
  every line once, in order. In a toc plan only start and title are read.
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
FENCE = re.compile(r"^\s*(```|~~~)")
NUMBERED = re.compile(r"^\s{0,3}\d+[.)]\s")
BARE_ID = re.compile(r"^[A-Z]?\d+(?:[-.]\d+)*[a-z]?$|^[A-Z](?:-\d+[a-z]?)*$")
IDENT = re.compile(r"\b[A-Z][A-Z0-9]{0,5}(?:-[A-Z0-9]{1,6})*-\d{1,4}[a-z]?\b")
LINK = re.compile(r"\]\(\./([^)#\s]+)")


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
            lang = lines[i].strip()[3:].strip() or "code"
            j = i + 1
            while j < n and not lines[j].strip().startswith(m.group(1)):
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
        name = f"map-{slug(g['heading'])}.md"
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
    seen, expect = set(), None
    for s in all_shards(plan):
        for key in ("file", "title", "summary", "start", "end"):
            if key not in s:
                return f"shard {s.get('file', '?')} is missing '{key}'"
        if s["file"] in seen:
            return f"duplicate shard file {s['file']}"
        seen.add(s["file"])
        if not isinstance(s["start"], int) or not isinstance(s["end"], int):
            return f"{s['file']} needs whole-number start and end lines"
        expect = expect or s["start"]
        if s["start"] != expect:
            return f"{s['file']} starts at line {s['start']}; expected {expect} (gap or overlap)"
        if s["end"] < s["start"]:
            return f"{s['file']} ends before it starts"
        if s["start"] in inside:
            a, b, kind = inside[s["start"]]
            return f"{s['file']} starts at line {s['start']}, inside the {kind} block at lines {a}-{b}"
        expect = s["end"] + 1
    if expect is not None and expect != n_lines + 1:
        return f"faithful ranges end at line {expect - 1}; the source has {n_lines}"
    return None


def cmd_build(args) -> int:
    plan_path = Path(args.plan).resolve()
    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    src = Path(plan.get("source", ""))
    folder = Path(plan.get("folder", "")).resolve()
    if not src.is_file() and (folder / ".source" / src.name).is_file():
        src = folder / ".source" / src.name  # a rebuild: the source was already moved in
    if not src.is_file():
        return fail(f"source not found: {src}")
    lines = read_lines(src)
    if toc_lines(lines):
        return fail(
            f"{src.name} carries a shard-pro contents list; remove it with `toc {src} --remove`, then outline and plan again"
        )
    err = validate_plan(plan, lines)
    if err:
        return fail(err)
    folder.mkdir(parents=True, exist_ok=True)
    old = load_manifest(folder)
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
    for s in all_shards(plan):
        a = max(s["start"], fm + 1)
        header = [f"# {s['title']}", "", f"Part of [{plan['title']}](./{folder.name}.md).", ""]
        body = lines[a - 1 : s["end"]]
        (folder / s["file"]).write_text("\n".join(header + body) + "\n", encoding="utf-8")
        s["header_lines"] = len(header)
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
    """A shard's lines without its own title, so identifiers in a title are not read as defined there."""
    lines = read_lines(path)
    return lines[1:] if lines and lines[0].startswith("# ") else lines


def defines(line: str) -> bool:
    """A line that introduces an identifier: a heading or a bold label."""
    return bool(HEADING.match(line)) or line.lstrip().startswith("**")


def identifiers(pattern: re.Pattern, line: str) -> list[str]:
    return [m.group(0) for m in pattern.finditer(line)]


def write_lookup(folder: Path, plan: dict) -> dict:
    pattern = re.compile(plan["lookup"])
    homes: dict[str, list[str]] = {}
    for s in all_shards(plan):
        p = folder / s["file"]
        if not p.exists():
            continue
        for line in body_lines(p):
            if defines(line):
                for ident in identifiers(pattern, line):
                    if s["file"] not in homes.setdefault(ident, []):
                        homes[ident].append(s["file"])
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
    plan = load_manifest(folder)
    if plan is None:
        return fail(f"no {MANIFEST} in {folder}")
    main = folder / f"{folder.name}.md"
    current = read_lines(main) if main.exists() else []
    front = current[: frontmatter_end(current)]
    text, subs = main_text(plan, front, folder, bool(plan.get("lookup")))
    main.write_text(text, encoding="utf-8")
    for old in set(plan.get("sub_maps", [])) - set(subs):
        (folder / old).unlink(missing_ok=True)
    for name, body in subs.items():
        (folder / name).write_text(body, encoding="utf-8")
    plan["sub_maps"] = sorted(subs)
    (folder / MANIFEST).write_text(json.dumps(plan, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    return emit({"ok": True, "main": str(main), "sub_maps": sorted(subs)})


def load_manifest(folder: Path) -> dict | None:
    p = folder / MANIFEST
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else None


def toc_block(entries: list[dict], offset: int) -> list[str]:
    out = [
        TOC_START,
        "## Contents",
        "",
        "Line numbers are lines of this file; read a section by its range. To change the document, use the `bmad-shard-pro` skill, which keeps this list true.",
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
        items, pos, lost = [], 0, []
        for item in json.loads(sidecar(path).read_text(encoding="utf-8")):
            idx = next((i for i in range(pos, len(body)) if body[i] == item["anchor"]), None)
            if idx is None:
                lost.append(item)
                continue
            items.append({"start": idx + 1, "title": item["title"], "group": item.get("group")})
            pos = idx + 1
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


def check_folder(folder: Path, rebuild: bool) -> tuple[list, list]:
    fails, warns = [], []
    main = folder / f"{folder.name}.md"
    if not main.exists():
        return [{"check": "main", "file": main.name, "text": "main file missing"}], []
    plan = load_manifest(folder)
    if plan is None:
        return [
            {
                "check": "manifest",
                "file": MANIFEST,
                "text": f"{MANIFEST} missing; this folder was not built by shard-pro",
            }
        ], []
    main_lines = read_lines(main)
    if not any(NOTE_MARK in x for x in main_lines[:WINDOW]):
        fails.append({"check": "note", "file": main.name, "text": "the sharded-document note is missing"})
    shards = all_shards(plan)
    names = {s["file"] for s in shards}
    maps = [main.name] + plan.get("sub_maps", [])
    linked_from_maps: set[str] = set()
    for m in maps:
        p = folder / m
        if not p.exists():
            fails.append({"check": "map", "file": m, "text": "map file missing"})
            continue
        ml = read_lines(p)
        for i, line in enumerate(ml, 1):
            for target in LINK.findall(line):
                linked_from_maps.add(target)
                if i > WINDOW:
                    fails.append(
                        {"check": "window", "file": m, "line": i, "text": f"map link to {target} is past line {WINDOW}"}
                    )
    if plan.get("lookup"):
        names.add(LOOKUP_FILE)
    for f in sorted(names - linked_from_maps - set(maps)):
        fails.append({"check": "orphan", "file": f, "text": "shard is not linked from the map"})
    prefix = folder.name.split("-")[0] + "-" if "-" in folder.name else None
    for p in sorted(folder.glob("*.md")):
        for i, line in enumerate(read_lines(p), 1):
            for target in LINK.findall(line):
                if not (folder / target).exists():
                    fails.append({"check": "link", "file": p.name, "line": i, "text": f"link to missing {target}"})
    for s in shards:
        p = folder / s["file"]
        if not p.exists():
            fails.append({"check": "missing", "file": s["file"], "text": "shard in the plan has no file"})
            continue
        if prefix and s["file"].startswith(prefix):
            fails.append(
                {
                    "check": "name",
                    "file": s["file"],
                    "text": f"name starts with '{prefix}', so a '{prefix}*' glob would load it as another document",
                }
            )
        sl = read_lines(p)
        fm = frontmatter_end(sl)
        if any(re.match(r"^(type|ticket)\s*:", x) for x in sl[:fm]):
            fails.append(
                {
                    "check": "frontmatter",
                    "file": s["file"],
                    "text": "shards carry no type or ticket keys; those stay in the main file",
                }
            )
    source_path = folder / plan["source"]
    source = read_lines(source_path) if source_path.exists() else None
    if source is None:
        fails.append({"check": "source", "file": plan["source"], "text": "the frozen original is missing"})
    if rebuild and source is not None:
        fm = plan.get("frontmatter_lines", 0)
        joined = source[:fm]
        for s in shards:
            if (folder / s["file"]).exists():
                joined += read_lines(folder / s["file"])[s.get("header_lines", 2) :]
        if joined != source:
            first = next(
                (i for i, (x, y) in enumerate(zip(joined, source, strict=False), 1) if x != y),
                min(len(joined), len(source)) + 1,
            )
            fails.append(
                {
                    "check": "rebuild",
                    "file": plan["source"],
                    "line": first,
                    "text": "the shards do not join back into the source",
                }
            )
    for s in shards:
        p = folder / s["file"]
        if p.exists() and (size := len(p.read_text(encoding="utf-8"))) > MAX_CHARS:
            warns.append(
                {
                    "check": "size",
                    "file": s["file"],
                    "text": f"{size} characters, over {MAX_CHARS}; consider splitting it",
                }
            )
    if plan.get("lookup"):
        pattern = re.compile(plan["lookup"])
        homes: dict[str, set] = {}
        for s in shards:
            p = folder / s["file"]
            if p.exists():
                for line in body_lines(p):
                    if defines(line):
                        for ident in identifiers(pattern, line):
                            homes.setdefault(ident, set()).add(s["file"])
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


def cmd_check(args) -> int:
    target = Path(args.target).resolve()
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
    p = sub.add_parser("map", help="rewrite the main file's map from .shards.json")
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
