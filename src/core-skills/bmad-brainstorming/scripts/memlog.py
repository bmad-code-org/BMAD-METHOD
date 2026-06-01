#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""memlog — an append-only memory log: LLM-optimal working memory for a skill.

A memlog is the dense, chronological record of everything that mattered in a piece of
work — every item the user generated or accepted — kept minimal like human memory: only
what's important, never bloated. It persists ACROSS sessions, so a fresh session can
load it and continue. It is NOT a deliverable; downstream artifacts (a brief, a PRD, a
deck, a report) are *derived* from it on demand. The host skill supplies the vocabulary
by how it calls `append` — the tool stays neutral.

It is a FLAT log: there are no sections or grouping. Every entry is one line, recorded
at the END in the order it happened. The chronology itself is the structure — an event
like "started technique X" is just another entry, same as an idea or an insight.

Two invariants make it trustworthy:

  1. Append-only, chronological. Entries land at the end, in the order they happen.
     Nothing is ever inserted backward, reordered, or grouped.
  2. Write-only / blind. Every command is an atomic, context-free write and echoes the
     new state as JSON, so the caller never re-reads the file mid-session. The one time
     the file is read is on resume — and the caller reads it itself, not via this script.

The file shape (.memlog.md):

    ---
    topic: Onboarding flow for a budgeting app
    goal: lift week-1 retention
    status: active
    updated: 2026-05-30T14:22
    ---

    - (note) user picked techniques: SCAMPER, then Six Thinking Hats
    - (technique) started SCAMPER
    - (idea) skip the signup wall: let people try with sample data first
    - (idea) auto-import one bank account so the first screen shows real numbers
    - (question) is open-banking consent too heavy for step one?
    - (technique) started Six Thinking Hats
    - (idea) black-hat: imported transactions look scary before they're categorized
    - (insight) the "scary numbers" risk and the "real numbers" idea are one lever: show real data, pre-categorized
    - (direction) user wants to optimize for the anxious first-timer, not the power user
    - (decision) lead with one pre-categorized account; defer multi-account import

Each entry may carry an optional `--type` — what KIND it is (idea, insight, question,
decision, technique, …) — and an optional `--by` naming who it came from (e.g. `user`,
`coach`), for sessions where authorship matters. Both render into one short inline tag:
`(idea)`, `(idea by user)`, `(by coach)`. Omit them for a plain note. The host skill
names the vocabulary; the script does not.

Commands:
  init   --workspace DIR [--field k=v ...]              create the memlog (errors if it exists)
  append --workspace DIR --text STR [--type T] [--by W]  append one entry at the end
  set    --workspace DIR --key K --value V              set/replace a frontmatter field

The workspace is the run folder; the memlog is always {workspace}/.memlog.md.
"""
import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

MEMLOG = ".memlog.md"


def now() -> str:
    return datetime.now().strftime("%Y-%m-%dT%H:%M")


def memlog_path(workspace: str) -> Path:
    return Path(workspace) / MEMLOG


def split(text: str) -> tuple[dict, str]:
    """Return (frontmatter dict in source order, body str). Frontmatter is plain key: value.

    The closing fence is the first line that is *exactly* `---`, so a `---` inside a
    field value (topic/goal are free user text) never truncates the frontmatter.
    """
    lines = text.splitlines()
    if not lines or lines[0] != "---":
        raise ValueError(".memlog.md has no frontmatter")
    end = next((i for i in range(1, len(lines)) if lines[i] == "---"), None)
    if end is None:
        raise ValueError(".memlog.md frontmatter is not terminated")
    meta: dict[str, str] = {}
    for line in lines[1:end]:
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta, "\n".join(lines[end + 1:]).lstrip("\n")


def render(meta: dict, body: str) -> str:
    # Neutralize newlines in values so a multi-line field can't break the fence on re-read.
    fm = "\n".join(f"{k}: {' '.join(str(v).splitlines())}" for k, v in meta.items())
    return "---\n" + fm + "\n---\n\n" + body.rstrip("\n") + "\n"


def touch(meta: dict) -> None:
    """Stamp `updated` and keep it last so the field order stays predictable."""
    meta.pop("updated", None)
    meta["updated"] = now()


def write_atomic(path: Path, text: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)


def entry_count(body: str) -> int:
    return sum(1 for ln in body.splitlines() if ln.startswith("- "))


def ack(path: Path, meta: dict, body: str) -> None:
    """Echo new state so the caller never re-reads the file to know where it stands."""
    print(json.dumps({
        "ok": True,
        "memlog": str(path),
        "status": meta.get("status", ""),
        "entries": entry_count(body),
    }))


def cmd_init(args) -> int:
    path = memlog_path(args.workspace)
    if path.exists():
        print(f"error: {path} already exists; use append/set to update it", file=sys.stderr)
        return 2
    path.parent.mkdir(parents=True, exist_ok=True)
    meta: dict[str, str] = {}
    for pair in args.field or []:
        if "=" not in pair:
            print(f"error: --field expects key=value, got {pair!r}", file=sys.stderr)
            return 2
        k, v = pair.split("=", 1)
        meta[k.strip()] = v.strip()
    meta.setdefault("status", "active")
    touch(meta)
    write_atomic(path, render(meta, ""))
    ack(path, meta, "")
    return 0


def cmd_append(args) -> int:
    path = memlog_path(args.workspace)
    meta, body = split(path.read_text(encoding="utf-8"))
    text = " ".join(args.text.split())  # collapse newlines/runs → one-line entry, no prose bloat
    label = args.type or ""
    if args.by:
        label = f"{label} by {args.by}".strip()  # attribution: "(idea by user)" / "(by coach)"
    tag = f"({label}) " if label else ""
    entry = f"- {tag}{text}"
    body = (body.rstrip("\n") + "\n" + entry) if body.strip() else entry  # always at the end
    touch(meta)
    write_atomic(path, render(meta, body))
    ack(path, meta, body)
    return 0


def cmd_set(args) -> int:
    path = memlog_path(args.workspace)
    meta, body = split(path.read_text(encoding="utf-8"))
    meta[args.key] = args.value
    touch(meta)
    write_atomic(path, render(meta, body))
    ack(path, meta, body)
    return 0


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    pi = sub.add_parser("init", help="create the memlog")
    pi.add_argument("--workspace", required=True)
    pi.add_argument("--field", action="append", metavar="KEY=VALUE", help="frontmatter field (repeatable)")
    pi.set_defaults(func=cmd_init)

    pa = sub.add_parser("append", help="append one entry at the end")
    pa.add_argument("--workspace", required=True)
    pa.add_argument("--text", required=True)
    pa.add_argument("--type", help="entry kind, rendered as an inline tag")
    pa.add_argument("--by", help="who the entry came from (e.g. user, coach); rendered into the tag")
    pa.set_defaults(func=cmd_append)

    pset = sub.add_parser("set", help="set a frontmatter field")
    pset.add_argument("--workspace", required=True)
    pset.add_argument("--key", required=True)
    pset.add_argument("--value", required=True)
    pset.set_defaults(func=cmd_set)

    args = p.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
