#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Waking: load the agent's self in one pass, or route to First Breath.

Run on activation. Determines the mode from the filesystem (and the --pulse
flag) and, when the sanctum is complete, prints the identity files in a single
read (PERSONA, CREED, BOND, HOW-I-REMEMBER, CAPABILITIES) followed by a map of the
memory: each folder under memory/ and raw/ with its file count, the newest
dated files, how many raw files are still undistilled, when the memory was last
tended (memory/.tended) with the session notes written since, and
memory/pending.md when it has content. The memory files themselves are not printed; the agent
reads the ones a conversation reaches. In --pulse mode it also appends
PULSE.md. When the sanctum is missing or incomplete, it prints a directive to
run First Breath, whose script finishes an incomplete sanctum.

This loads runtime memory only. It never reads or writes config or customize.toml.

Usage:
    uv run {skill-root}/scripts/wake.py <project-root> [--pulse]

    project-root: the folder holding _bmad/
"""

import re
import sys
from pathlib import Path

# The skill folder's name is the skill name; this script lives in its scripts/.
SKILL_NAME = Path(__file__).resolve().parent.parent.name

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
        return 0

    print("MODE: PULSE" if pulse else "MODE: WAKING")
    print(f"Sanctum: {sanctum}")
    for name in IDENTITY_FILES:
        emit(sanctum / name)
    if pulse and (sanctum / "PULSE.md").is_file():
        emit(sanctum / "PULSE.md")
    emit_map(sanctum)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
