#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""party_memory — a party's memory across sessions: `<memory dir>/<party>/memory.md`, one line per memory.

Memories are only ever added at the end; nothing is edited or removed. To correct one, add an entry
that supersedes it. To forget a party, delete its folder.

    - (dynamic) Winston and Amelia clashed over the rewrite and have not made up
    - (callback by analyst) Mary calls the user's cat the real product owner
    - (outcome) the room agreed to ship the export before the dashboard

Commands, each printing one line of JSON:
  recall   --dir DIR --party ID                               where the memory is, whether it exists, how many entries
  remember --dir DIR --party ID --text STR [--type T] [--by W]   add one memory, creating the file on first use

`--type` is the kind of memory (dynamic, moment, callback, outcome) and `--by` the persona it belongs to;
both render as one tag, `(callback by analyst)`.

A party whose memory was written before the file had this name keeps it in `.memlog.md`. Both commands
rename that file to `memory.md` the first time they touch the party's folder, and stop with an error
when they cannot.

Exit codes: 0 done, 2 usage error or a file that cannot be read or written.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

NAME = "memory.md"
OLD_NAME = ".memlog.md"


class PartyMemoryError(Exception):
    pass


def memory_path(directory: str, party: str) -> Path:
    """<dir>/<party>/memory.md, taking over a `.memlog.md` left by an earlier version."""
    if not party or Path(party).name != party or party in (".", ".."):
        raise PartyMemoryError(f"--party must be a plain name, got {party!r}")
    folder = Path(directory) / party
    path, old = folder / NAME, folder / OLD_NAME
    if path.exists() or not old.is_file():
        return path
    try:
        os.replace(old, path)
    except OSError as error:
        if not path.exists():  # another writer may have renamed it first
            raise PartyMemoryError(f"cannot rename {old} to {NAME}: {error.strerror or error}") from error
    return path


def count(path: Path) -> int:
    try:
        return sum(1 for line in path.read_text(encoding="utf-8").splitlines() if line.startswith("- "))
    except (OSError, UnicodeDecodeError) as error:
        raise PartyMemoryError(f"cannot read {path}: {error}") from error


def report(path: Path) -> int:
    exists = path.is_file()
    print(json.dumps({"ok": True, "path": path.as_posix(), "exists": exists, "entries": count(path) if exists else 0}))
    return 0


def cmd_recall(args) -> int:
    return report(memory_path(args.dir, args.party))


def cmd_remember(args) -> int:
    path = memory_path(args.dir, args.party)
    tag = " ".join(part for part in (args.type or "", f"by {args.by}" if args.by else "") if part)
    entry = (f"- ({tag}) " if tag else "- ") + " ".join(args.text.split())
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        cut_off = path.is_file() and path.stat().st_size > 0 and not path.read_bytes().endswith(b"\n")
        with open(path, "ab") as handle:
            handle.write(f"{chr(10) if cut_off else ''}{entry}\n".encode())
    except OSError as error:
        raise PartyMemoryError(f"cannot write {path}: {error.strerror or error}") from error
    return report(path)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    for name, func, text in (
        ("recall", cmd_recall, "where a party's memory is and whether it exists"),
        ("remember", cmd_remember, "add one memory"),
    ):
        sp = sub.add_parser(name, help=text)
        sp.add_argument("--dir", required=True, help="the folder holding every party's memory folder")
        sp.add_argument("--party", required=True, help="the party's id, which names its folder")
        sp.set_defaults(func=func)
        if name == "remember":
            sp.add_argument("--text", required=True)
            sp.add_argument("--type", help="kind of memory, rendered as a tag")
            sp.add_argument("--by", help="the persona it belongs to, rendered into the tag")
    args = p.parse_args(argv)
    try:
        return args.func(args)
    except PartyMemoryError as error:
        print(f"error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    sys.exit(main())
