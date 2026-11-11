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
under memory/ and raw/ with its file count, the newest dated files, how many raw
files are still undistilled, when the memory was last tended (memory/.tended)
with the session notes written since, and memory/pending.md when it has
content. The dominion map is each area in `agent.dominion`, read through
_bmad/scripts/resolve_customization.py: where it is, its access, its folders
and newest dated files (only a count for a private area), and whether it is
missing or lacks a README; an entry with `retired = true` is left out, and a
malformed one is named. Memory and area files themselves are not printed; the
agent reads the ones a conversation reaches. In --pulse mode it also appends PULSE.md. It says when the name in
PERSONA.md has gone from the SKILL.md description. When the sanctum is missing
or incomplete, it prints a directive to run First Breath, whose script finishes
an incomplete sanctum, with the capabilities and dominion First Breath presents.

It writes nothing.

Usage:
    uv run {skill-root}/scripts/wake.py <project-root> [--pulse]

    project-root: the folder holding _bmad/
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

import yaml

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
STATUS_RAW_RE = re.compile(r"^status:\s*raw\s*$", re.MULTILINE)
PERSONA_NAME_RE = re.compile(r"^- \*\*Name:\*\* ([^{*\s][^{*\n]*)$", re.MULTILINE)
FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---", re.DOTALL)

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


def undistilled(raw: Path) -> list[str]:
    if not raw.is_dir():
        return []
    out = []
    for p in sorted(raw.iterdir()):
        if not p.is_file():
            continue
        try:
            head = p.read_text(encoding="utf-8", errors="replace")[:2000]
        except OSError:
            continue
        if STATUS_RAW_RE.search(head):
            out.append(p.name)
    return out


def tending_line(sanctum: Path) -> str:
    """When memory was last tended and how many session notes came after it."""
    stamp = sanctum / "memory" / ".tended"
    tended = stamp.read_text(encoding="utf-8").strip()[:10] if stamp.is_file() else ""
    sessions = sanctum / "memory" / "sessions"
    notes = [p.name for p in sessions.iterdir() if p.is_file() and DATED_RE.match(p.name)] if sessions.is_dir() else []
    since = [n for n in notes if DATED_RE.match(n).group(1) > tended] if tended else notes
    if tended:
        return f"Tended: {tended}; session notes since: {len(since)}"
    return f"Never tended; session notes: {len(since)}"


def emit_map(sanctum: Path) -> None:
    print("\n===== memory map =====")
    lines = folder_lines(sanctum / "memory", "memory") + folder_lines(sanctum / "raw", "raw")
    print("\n".join(lines) if lines else "(empty: nothing remembered yet)")
    recent = recent_dated(sanctum / "memory")
    if recent:
        print("\nNewest:")
        print("\n".join(f"  {r}" for r in recent))
    print(f"\n{tending_line(sanctum)}")
    raw = undistilled(sanctum / "raw")
    if raw:
        print(f"\nUndistilled raw ({len(raw)}):")
        print("\n".join(f"  raw/{r}" for r in raw))
    pending = sanctum / "memory" / "pending.md"
    if pending.is_file() and pending.read_text(encoding="utf-8").strip():
        emit(pending)


def frontmatter(path: Path) -> dict:
    match = FRONTMATTER_RE.match(path.read_text(encoding="utf-8", errors="replace"))
    try:
        meta = yaml.safe_load(match.group(1)) if match else None
    except yaml.YAMLError:
        return {}
    return {k: v for k, v in meta.items()} if isinstance(meta, dict) else {}


def capability_rows(folder: Path, label: str, skip: set[str]) -> dict[str, tuple[dict, str]]:
    """Capability files in folder with `name` and `code` frontmatter, by code."""
    found = {}
    for path in sorted(folder.glob("*.md")) if folder.is_dir() else []:
        if path.name in skip:
            continue
        meta = frontmatter(path)
        if meta.get("code"):
            found[str(meta["code"])] = (meta, f"{label}/{path.name}")
    return found


def emit_capabilities(sanctum: Path) -> None:
    built_in = capability_rows(SKILL_ROOT / "references", "references", SKILL_ONLY_FILES)
    learned = capability_rows(sanctum / "capabilities", "capabilities", set())
    rows = []
    for code, (meta, source) in {**built_in, **learned}.items():
        if meta.get("retired") is True or not meta.get("name"):
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


def walk_area(root: Path) -> tuple[dict[str, int], list[Path]]:
    """File counts by top-level folder of an area ("." for its own files), and its newest dated files."""
    counts: dict[str, int] = {}
    dated: list[Path] = []
    for current, dirs, files in os.walk(root):
        dirs[:] = sorted(d for d in dirs if not d.startswith((".", "_bmad")) and d not in SKIP_DIRS)
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
    areas, problems, seen = [], [], set()
    for entry in entries if isinstance(entries, list) else []:
        if not isinstance(entry, dict) or entry.get("retired") is True:
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
    path = Path(raw).expanduser()
    return (path if path.is_absolute() else project_root / path).resolve()


def emit_dominion(project_root: Path) -> None:
    areas, problems = read_dominion(project_root)
    if not areas and not problems:
        return
    print("\n===== dominion =====")
    if problems:
        print("\n".join(problems))
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
        counts, recent = walk_area(path)
        if private:
            print(f"  {sum(counts.values())} files; names not shown")
            continue
        lines = [f"{folder}/ ({count} files)" for folder, count in sorted(counts.items()) if folder != "." or count]
        print("\n".join(f"  {line}" for line in lines) if lines else "  (empty)")
        if recent:
            print("  Newest:")
            print("\n".join(f"    {p.relative_to(path).as_posix()}" for p in recent))


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
    args = sys.argv[1:]
    pulse = "--pulse" in args
    positional = [a for a in args if not a.startswith("--")]
    if not positional:
        print("Usage: wake.py <project-root> [--pulse]", file=sys.stderr)
        return 2

    project_root = Path(positional[0]).resolve()
    sanctum = project_root / "_bmad" / "memory" / SKILL_NAME

    missing = [name for name in IDENTITY_FILES if not (sanctum / name).is_file()]
    if missing:
        print("MODE: FIRST_BREATH")
        if sanctum.is_dir():
            print(f"INCOMPLETE SANCTUM at {sanctum}: missing {', '.join(missing)}")
        else:
            print(f"NO SANCTUM at {sanctum}")
        print("This is your one birth. Load references/first-breath.md and follow it.")
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
    raise SystemExit(main())
