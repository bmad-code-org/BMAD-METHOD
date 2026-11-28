#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""Waking: load the agent's self in one pass, or route to First Breath.

Run on activation. Determines the mode from the filesystem (and the --pulse
flag) and, when the sanctum is complete, prints the identity files in a single
read (PERSONA, CREED, BOND, HOW-I-REMEMBER, CAPABILITIES), the capabilities
table, a map of the memory and a map of the dominion. The capabilities table is
built from frontmatter each waking: built-ins from the skill's references/,
learned ones from the sanctum's capabilities/, a learned file with a built-in's
code replacing it and `retired: true` dropping it. The memory map is each folder
under memory/ and raw/ with its file count, the newest dated files, the raw files
no file under memory/ names as its source, when the memory was last tended
(memory/.tended) with the session notes written since, and memory/pending.md when it has
content. The dominion map is each area in `agent.dominion`, read through
_bmad/scripts/resolve_customization.py: where it is, its access, its folders
and newest dated files (only a count for a private area), and whether it is
missing or lacks a README; an entry with `retired = true` is left out, and a
malformed one is named. Memory and area files themselves are not printed; the
agent reads the ones a conversation reaches. In --pulse mode it also appends PULSE.md. It says when the name in
PERSONA.md has gone from the SKILL.md description. When the sanctum is missing
or incomplete, or First Breath has not written memory/.born, it prints a
directive to run First Breath, whose script finishes an incomplete sanctum, with
the capabilities and dominion First Breath presents; for an unfinished birth it
also prints the identity files and the placeholders still in them. A --pulse
before the birth is finished prints MODE: UNBORN and nothing else.

It writes nothing.

Usage:
    uv run {skill-root}/scripts/wake.py <project-root> [--pulse]

    project-root: the folder holding _bmad/, with _bmad/scripts/frontmatter.py from bmad setup
"""

import argparse
import importlib.util
import json
import os
import re
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.

# The skill folder is the parent of this script's scripts/; its name is the skill name.
SKILL_ROOT = Path(__file__).resolve().parent.parent
SKILL_NAME = SKILL_ROOT.name

# References that are not capabilities.
SKILL_ONLY_FILES = {"first-breath.md"}

# Load order: the "become yourself" set. All must exist for the sanctum to count as born.
IDENTITY_FILES = [
    "PERSONA.md",
    "CREED.md",
    "BOND.md",
    "HOW-I-REMEMBER.md",
    "CAPABILITIES.md",
]

RECENT_COUNT = 8
DATED_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})")
# A distillation opens with `source: raw/<file>`, on one line or as a YAML list under it.
SOURCE_RE = re.compile(r"^source:[^\n]*(?:\n[ \t]*-[^\n]*)*", re.MULTILINE)
PERSONA_NAME_RE = re.compile(r"^- \*\*Name:\*\* ([^{*\s][^{*\n]*)$", re.MULTILINE)
# A template placeholder is prose in braces, such as {learned at First Breath}; a bare token has no spaces.
PLACEHOLDER_RE = re.compile(r"\{[^{}\n]*\s[^{}\n]*\}")

# Never walked when mapping an area: hidden, tool and dependency folders, and anything starting with _bmad.
SKIP_DIRS = {"node_modules", "__pycache__", "venv"}


def emit(path: Path) -> None:
    print(f"\n===== {path.name} =====")
    print(path.read_text(encoding="utf-8").rstrip())


def folder_lines(root: Path, label: str) -> list[str]:
    """One line per folder under root (root itself when it has files), with its file count."""
    if not root.is_dir():
        return []
    lines = []
    direct = [p for p in root.iterdir() if p.is_file() and not p.name.startswith(".")]
    if direct:
        lines.append(f"{label}/ ({len(direct)} files)")
    for folder in sorted(p for p in root.rglob("*") if p.is_dir()):
        count = sum(1 for p in folder.iterdir() if p.is_file() and not p.name.startswith("."))
        rel = folder.relative_to(root.parent).as_posix()
        lines.append(f"{rel}/ ({count} files)")
    return lines


def recent_dated(root: Path) -> list[str]:
    """The newest dated files under root, by the date in their names."""
    if not root.is_dir():
        return []
    dated = [p for p in root.rglob("*") if p.is_file() and DATED_RE.match(p.name)]
    dated.sort(key=lambda p: (DATED_RE.match(p.name).group(1), p.name), reverse=True)
    return [p.relative_to(root.parent).as_posix() for p in dated[:RECENT_COUNT]]


def undistilled(sanctum: Path) -> list[str]:
    """Raw files that no file under memory/ names as its source."""
    raw, memory = sanctum / "raw", sanctum / "memory"
    if not raw.is_dir():
        return []
    sources = []
    for p in memory.rglob("*.md") if memory.is_dir() else []:
        try:
            sources.extend(SOURCE_RE.findall(p.read_text(encoding="utf-8", errors="replace")[:4096]))
        except OSError:
            continue
    cited = "\n".join(sources)
    names = sorted(p.name for p in raw.iterdir() if p.is_file() and not p.name.startswith("."))
    return [name for name in names if not re.search(rf"raw/{re.escape(name)}(?![\w.-])", cited)]


def tending_line(sanctum: Path) -> str:
    """When memory was last tended and how many session notes came after it."""
    stamp = sanctum / "memory" / ".tended"
    tended = stamp.read_text(encoding="utf-8").strip()[:10] if stamp.is_file() else ""
    sessions = sanctum / "memory" / "sessions"
    notes = [p for p in sessions.iterdir() if p.is_file() and DATED_RE.match(p.name)] if sessions.is_dir() else []
    if not tended:
        return f"Never tended; session notes: {len(notes)}"
    # The stamp is a date, so a note dated that same day is told apart by which file was written last.
    stamped = stamp.stat().st_mtime
    since = [
        p
        for p in notes
        if (day := DATED_RE.match(p.name).group(1)) > tended or (day == tended and p.stat().st_mtime > stamped)
    ]
    return f"Tended: {tended}; session notes since: {len(since)}"


def emit_map(sanctum: Path) -> None:
    print("\n===== memory map =====")
    lines = folder_lines(sanctum / "memory", "memory") + folder_lines(sanctum / "raw", "raw")
    print("\n".join(lines) if lines else "(empty: nothing remembered yet)")
    recent = recent_dated(sanctum / "memory")
    if recent:
        print("\nNewest:")
        print("\n".join(f"  {r}" for r in recent))
    print(f"\n{tending_line(sanctum)}")
    raw = undistilled(sanctum)
    if raw:
        print(f"\nUndistilled raw ({len(raw)}):")
        print("\n".join(f"  raw/{r}" for r in raw))
    pending = sanctum / "memory" / "pending.md"
    if pending.is_file() and pending.read_text(encoding="utf-8").strip():
        emit(pending)


def read_frontmatter(path: Path) -> dict | None:
    """The file's frontmatter mapping, empty when it has none; None when the block does not parse or never closes."""
    text = path.read_text(encoding="utf-8", errors="replace")
    try:
        return frontmatter.load(frontmatter.split(text)[0])
    except ValueError:
        return None if text.startswith("---") else {}


def is_true(value: object) -> bool:
    """A YAML 1.1 true, such as `retired: true`; the frontmatter reader keeps every value as text."""
    return value in ("true", "True", "TRUE", "yes", "Yes", "YES", "on", "On", "ON")


def capability_rows(folder: Path, label: str, skip: set[str]) -> tuple[dict[str, tuple[dict, str]], list[str]]:
    """Capability files in folder by `code`, and the files whose frontmatter keeps them out of the table."""
    found, problems = {}, []
    for path in sorted(folder.glob("*.md")) if folder.is_dir() else []:
        if path.name in skip:
            continue
        meta, source = read_frontmatter(path), f"{label}/{path.name}"
        if meta is None:
            problems.append(f"{source}: its frontmatter does not parse")
        elif meta.get("code") and (meta.get("name") or is_true(meta.get("retired"))):
            found[str(meta["code"])] = (meta, source)
        elif meta.get("code") or meta.get("name"):
            problems.append(f"{source}: its frontmatter needs both `name` and `code`")
    return found, problems


def emit_capabilities(sanctum: Path) -> None:
    built_in, built_in_problems = capability_rows(SKILL_ROOT / "references", "references", SKILL_ONLY_FILES)
    learned, learned_problems = capability_rows(sanctum / "capabilities", "capabilities", set())
    rows = []
    for code, (meta, source) in {**built_in, **learned}.items():
        if is_true(meta.get("retired")):
            continue
        kind = "learned" if code in learned else "built-in"
        if code in learned and code in built_in:
            kind = "learned, replaces built-in"
        title, desc = (" ".join(str(meta.get(k, "")).split()) for k in ("name", "description"))
        rows.append(f"| [{code}] | {title} | {desc} | {kind} | `{source}` |")
    print("\n===== capabilities =====")
    print(f"references/ is in {SKILL_ROOT}; capabilities/ is in your sanctum.")
    print("| Code | Name | Description | Kind | Prompt |")
    print("|------|------|-------------|------|--------|")
    print("\n".join(rows) if rows else "| | (none) | | | |")
    problems = built_in_problems + learned_problems
    if problems:
        print("Not listed, and replacing or retiring nothing:")
        print("\n".join(f"  {problem}" for problem in problems))


def walk_area(root: Path, private: set[Path]) -> tuple[dict[str, int], list[Path]]:
    """File counts by top-level folder of an area ("." for its own files), and its newest dated files.

    A private area inside this one is left out: its own entry gives its count, and its names appear nowhere.
    """
    counts: dict[str, int] = {}
    dated: list[Path] = []
    for current, dirs, files in os.walk(root):
        dirs[:] = sorted(d for d in dirs if not d.startswith((".", "_bmad")) and d not in SKIP_DIRS)
        if private:
            dirs[:] = [d for d in dirs if (Path(current) / d).resolve() not in private]
        rel = Path(current).relative_to(root)
        top = rel.parts[0] if rel.parts else "."
        visible = [f for f in files if not f.startswith(".")]
        counts[top] = counts.get(top, 0) + len(visible)
        dated.extend(Path(current) / f for f in visible if DATED_RE.match(f))
    dated.sort(key=lambda p: (DATED_RE.match(p.name).group(1), p.name), reverse=True)
    return counts, dated[:RECENT_COUNT]


def read_dominion(project_root: Path) -> tuple[list[dict], list[str]]:
    """The live `agent.dominion` areas from the merged customization, and what is wrong with the list."""
    resolver = project_root / "_bmad" / "scripts" / "resolve_customization.py"
    if not resolver.is_file():
        return [], [f"Dominion not read: {resolver} is missing"]
    cmd = [sys.executable, str(resolver), "--skill", str(SKILL_ROOT), "--project-root", str(project_root)]
    res = subprocess.run([*cmd, "--key", "agent.dominion"], capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        return [], [f"Dominion not read: {res.stderr.strip() or 'the resolver failed'}"]
    try:
        entries = json.loads(res.stdout).get("agent.dominion", [])
    except json.JSONDecodeError:
        return [], ["Dominion not read: the resolver printed no JSON"]
    if not isinstance(entries, list):
        return [], ["Dominion not read: agent.dominion is not a list; write each area as its own [[agent.dominion]]"]
    areas, problems, seen = [], [], set()
    for entry in entries:
        if not isinstance(entry, dict):
            problems.append(f"{entry!r}: not an [[agent.dominion]] entry, skipped")
            continue
        if entry.get("retired") is True:
            continue
        label = entry.get("id") or entry.get("path") or "an entry"
        if not entry.get("id"):
            problems.append(f"{label}: no id, so overrides cannot replace it and ids across the list are not merged")
        elif entry["id"] in seen:
            problems.append(f"{label}: listed twice")
        seen.add(entry.get("id"))
        if not entry.get("path"):
            problems.append(f"{label}: no path, skipped; an override replaces the whole entry, so restate every key")
            continue
        if entry.get("access", "read") not in ("write", "read"):
            problems.append(f"{label}: access {entry['access']!r} is neither write nor read; treated as read")
        areas.append(entry)
    return areas, problems


def area_path(project_root: Path, raw: str) -> Path:
    if raw.startswith("{project-root}"):
        raw = str(project_root) + raw.removeprefix("{project-root}")
    path = Path(raw).expanduser()
    return (path if path.is_absolute() else project_root / path).resolve()


def emit_dominion(project_root: Path) -> None:
    areas, problems = read_dominion(project_root)
    if not areas and not problems:
        return
    print("\n===== dominion =====")
    if problems:
        print("\n".join(problems))
    private_paths = {area_path(project_root, str(a["path"])) for a in areas if a.get("private") is True}
    for area in areas:
        path = area_path(project_root, str(area["path"]))
        access = "write" if area.get("access") == "write" else "read"
        private = area.get("private") is True
        tags = [access] + (["private: other agents keep out"] if private else [])
        about = f": {area['about']}" if area.get("about") else ""
        print(f"\n{area.get('id', area['path'])} → {path} ({', '.join(tags)}){about}")
        if not path.is_dir():
            print("  MISSING: the folder does not exist")
            continue
        # A whole-workspace area keeps its layout in the project's AGENTS.md; its README is the project's.
        if access == "write" and path != project_root.resolve() and not (path / "README.md").is_file():
            print("  No README.md: the area's layout is written nowhere")
        counts, recent = walk_area(path, private_paths - {path})
        if private:
            print(f"  {sum(counts.values())} files; names not shown")
            continue
        lines = [f"{folder}/ ({count} files)" for folder, count in sorted(counts.items()) if folder != "." or count]
        print("\n".join(f"  {line}" for line in lines) if lines else "  (empty)")
        if recent:
            print("  Newest:")
            print("\n".join(f"    {p.relative_to(path).as_posix()}" for p in recent))


def emit_open_questions(sanctum: Path) -> None:
    """Template placeholders still in the identity files: what First Breath has not yet asked or written."""
    lines = []
    for name in IDENTITY_FILES:
        for line in (sanctum / name).read_text(encoding="utf-8").splitlines():
            if PLACEHOLDER_RE.search(line):
                lines.append(f"  {name}: {line.strip()}")
    print("\n===== still open =====")
    print(
        "\n".join(lines) if lines else "  (no placeholders left; check every question in first-breath.md is answered)"
    )


def emit_lost_name(sanctum: Path, project_root: Path) -> None:
    """Skills updates replace SKILL.md, which drops the name First Breath wrote into its description."""
    skill_md = SKILL_ROOT / "SKILL.md"
    # A global install serves every project, so one project's name does not belong in it.
    if not skill_md.is_file() or not skill_md.is_relative_to(project_root):
        return
    named = PERSONA_NAME_RE.search((sanctum / "PERSONA.md").read_text(encoding="utf-8"))
    if not named:
        return
    called = named[1].strip()
    lines = skill_md.read_text(encoding="utf-8").splitlines()
    if not any(line.startswith("description:") and called in line for line in lines):
        print("\n===== description =====")
        print(
            f"Your name, {called}, is missing from the description in {skill_md}. Put it back so `Use when` opens "
            "with your owner asking to talk to you by that name, and change nothing else in that file."
        )


def main() -> int:
    global frontmatter

    parser = argparse.ArgumentParser(description="Wake the agent: print its self and maps, or route to First Breath.")
    parser.add_argument("project_root", type=Path, help="the folder holding _bmad/")
    parser.add_argument("--pulse", action="store_true", help="woken on a schedule with no one at the keyboard")
    args = parser.parse_args()
    pulse = args.pulse
    project_root = args.project_root.resolve()
    path = project_root / "_bmad" / "scripts" / "frontmatter.py"
    if not path.is_file():
        print(f"error: {path} is missing. Run bmad setup for this project.", file=sys.stderr)
        return 2
    spec = importlib.util.spec_from_file_location("bmad_frontmatter", path)
    frontmatter = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(frontmatter)
    sanctum = project_root / "_bmad" / "memory" / SKILL_NAME

    missing = [name for name in IDENTITY_FILES if not (sanctum / name).is_file()]
    born = not missing and (sanctum / "memory" / ".born").is_file()
    if not born and pulse:
        print("MODE: UNBORN")
        print("First Breath is not finished, and it needs your owner. A Pulse does nothing until then: exit.")
        return 0
    if not born:
        print("MODE: FIRST_BREATH")
        if missing and sanctum.is_dir():
            print(f"INCOMPLETE SANCTUM at {sanctum}: missing {', '.join(missing)}")
        elif missing:
            print(f"NO SANCTUM at {sanctum}")
        else:
            print(f"UNFINISHED BIRTH at {sanctum}: your sanctum exists but memory/.born does not.")
        print(f"This is your one birth. Load {SKILL_ROOT / 'references' / 'first-breath.md'} and follow it to the end.")
        if not missing:
            for name in IDENTITY_FILES:
                emit(sanctum / name)
            if (sanctum / "PULSE.md").is_file():
                emit(sanctum / "PULSE.md")
            emit_open_questions(sanctum)
        emit_capabilities(sanctum)
        emit_dominion(project_root)
        return 0

    print("MODE: PULSE" if pulse else "MODE: WAKING")
    print(f"Sanctum: {sanctum}")
    for name in IDENTITY_FILES:
        emit(sanctum / name)
    emit_capabilities(sanctum)
    if pulse and (sanctum / "PULSE.md").is_file():
        emit(sanctum / "PULSE.md")
    emit_map(sanctum)
    emit_dominion(project_root)
    emit_lost_name(sanctum, project_root)
    return 0


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    raise SystemExit(main())
