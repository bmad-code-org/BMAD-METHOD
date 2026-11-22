#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""ideas — the append-only log of a brainstorming session, `ideas.md` in the session's folder.

The log is the session: every idea, question, decision and bit of direction, one line each, in the
order it happened. Every output is built from it and a resume reloads it. Entries are only ever
added at the end; nothing is edited, reordered or removed.

    ---
    topic: Onboarding flow for a budgeting app
    goal: lift week-1 retention
    mode: facilitator
    created: 2026-06-07T14:22
    ---

    - (technique) started SCAMPER
    - (idea by user) skip the signup wall: let people try with sample data first
    - (question) is open-banking consent too heavy for step one?

Commands, each printing one line of JSON:
  start --folder DIR --topic T [--goal G] [--mode M]    create DIR/ideas.md (exit 2 if the session exists)
  add   --folder DIR --text STR [--text STR ...] [--type T] [--by W]   add entries at the end, one per --text
  set   --folder DIR --key K --value V                  set a frontmatter field: `status`, `mode`
  open  --root DIR [--root DIR ...] [--glob PATTERN]    list the sessions not yet `status: complete`, each
                                                        with its fields, entry count and when it last changed

`--type` says what kind of entry it is (idea, insight, question, decision, direction, technique) and
`--by` who it came from (user, coach); both render as one tag, `(idea by user)`.

A session written before the log had this name keeps it in `.memlog.md`. `start`, `add` and `set` rename
that file to `ideas.md` the first time they touch its folder, and stop with an error when they cannot;
`open` lists it where it is.

Exit codes: 0 done, 2 usage error or a missing or unreadable log.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

import yaml

NAME = "ideas.md"
OLD_NAME = ".memlog.md"
KEY_RE = re.compile(r"^[A-Za-z_][\w-]*$")
STAMP = "%Y-%m-%dT%H:%M"


class LogError(Exception):
    pass


def log_path(folder: Path) -> Path:
    """DIR/ideas.md, taking over a `.memlog.md` left by an earlier version."""
    path, old = folder / NAME, folder / OLD_NAME
    if path.exists() or not old.is_file():
        return path
    try:
        os.replace(old, path)
    except OSError as error:
        if not path.exists():  # another writer may have renamed it first
            raise LogError(f"cannot rename {old} to {NAME}: {error.strerror or error}") from error
    return path


def read(path: Path) -> tuple[dict[str, str], str]:
    """Frontmatter fields in file order, and the body. The closing fence is the first line that is exactly `---`."""
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        raise LogError(f"no {NAME} in {path.parent}; run start first") from None
    except (OSError, UnicodeDecodeError) as error:
        raise LogError(f"cannot read {path}: {error}") from error
    end = next((i for i in range(1, len(lines)) if lines[i] == "---"), None) if lines[:1] == ["---"] else None
    if end is None:
        raise LogError(f"{path} has no frontmatter")
    try:
        fields = yaml.load("\n".join(lines[1:end]), Loader=yaml.BaseLoader) or {}
    except yaml.YAMLError:
        fields = None
    if not isinstance(fields, dict):
        raise LogError(f"{path} has frontmatter that is not YAML fields")
    return fields, "\n".join(lines[end + 1 :]).strip("\n")


def write(path: Path, fields: dict[str, str], body: str) -> None:
    """Whole-file write through a temp file, so a crash never leaves half a log."""
    one_line = {key: " ".join(value.split()) for key, value in fields.items()}
    front = yaml.safe_dump(one_line, sort_keys=False, allow_unicode=True, width=float("inf"))
    tmp = path.with_suffix(".md.tmp")
    tmp.write_text(f"---\n{front}---\n\n{body}\n" if body else f"---\n{front}---\n", encoding="utf-8", newline="\n")
    os.replace(tmp, path)


def count(body: str) -> int:
    return sum(1 for line in body.splitlines() if line.startswith("- "))


def done(path: Path, body: str, **extra) -> int:
    print(json.dumps({"ok": True, "ideas": path.as_posix(), "entries": count(body), **extra}, ensure_ascii=False))
    return 0


def cmd_start(args) -> int:
    folder = Path(args.folder)
    folder.mkdir(parents=True, exist_ok=True)
    path = log_path(folder)
    if path.exists():
        raise LogError(f"{path} already exists; use add and set, or resume the session")
    fields = {"topic": args.topic, "goal": args.goal, "mode": args.mode, "created": datetime.now().strftime(STAMP)}
    write(path, {k: v for k, v in fields.items() if v}, "")
    return done(path, "")


def cmd_add(args) -> int:
    path = log_path(Path(args.folder))
    _, body = read(path)
    tag = " ".join(part for part in (args.type or "", f"by {args.by}" if args.by else "") if part)
    entries = [(f"- ({tag}) " if tag else "- ") + " ".join(text.split()) for text in args.text]
    raw = path.read_bytes()
    # The first entry sits one blank line under the frontmatter; a log cut off mid-line gets its newline back.
    gap = "" if raw.endswith(b"\n\n") or (body and raw.endswith(b"\n")) else "\n"
    with open(path, "ab") as handle:  # one writer per session, so a plain append is enough
        handle.write((gap + "".join(f"{entry}\n" for entry in entries)).encode())
    return done(path, "\n".join([body, *entries]))


def cmd_set(args) -> int:
    if not KEY_RE.match(args.key):
        raise LogError(f"--key must be a plain word, got {args.key!r}")
    path = log_path(Path(args.folder))
    fields, body = read(path)
    fields.pop("updated", None)  # earlier versions stamped it on some writes only; `open` reports the file's own time
    fields[args.key] = args.value
    write(path, fields, body)
    return done(path, body, **{args.key: args.value})


def cmd_open(args) -> int:
    sessions: list[dict] = []
    seen: set[Path] = set()
    for root in args.root:
        try:
            folders = sorted(p for p in Path(root).glob(args.glob) if p.is_dir())
        except (ValueError, NotImplementedError, IndexError, OSError) as error:
            raise LogError(f"--glob {args.glob!r} is not a folder pattern: {error}") from error
        for folder in folders:
            if folder.resolve() in seen:
                continue
            seen.add(folder.resolve())
            item: dict = {"folder": folder.as_posix()}
            path, older = folder / NAME, False
            if not path.is_file():
                path, older = folder / OLD_NAME, True
                if not path.is_file():
                    continue
            try:
                fields, body = read(path)
            except LogError as error:
                if not older:
                    sessions.append({**item, "error": str(error)})
                continue
            # Listing never renames, and a `.memlog.md` without `mode` is some other skill's log.
            if fields.get("status") == "complete" or (older and "mode" not in fields):
                continue
            changed = datetime.fromtimestamp(path.stat().st_mtime).strftime(STAMP)
            sessions.append({**fields, **item, "ideas": path.as_posix(), "updated": changed, "entries": count(body)})
    print(json.dumps({"ok": True, "sessions": sessions}, ensure_ascii=False))
    return 0


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    ps = sub.add_parser("start", help="create the session's ideas.md")
    ps.add_argument("--folder", required=True, help="the session's folder")
    ps.add_argument("--topic", required=True)
    ps.add_argument("--goal", default="")
    ps.add_argument("--mode", default="", help="facilitator, partner or autonomous")
    ps.set_defaults(func=cmd_start)

    pa = sub.add_parser("add", help="add one entry at the end")
    pa.add_argument("--folder", required=True)
    pa.add_argument("--text", required=True, action="append", help="one entry (repeatable)")
    pa.add_argument("--type", help="entry kind, rendered as a tag")
    pa.add_argument("--by", help="who it came from, rendered into the tag")
    pa.set_defaults(func=cmd_add)

    pt = sub.add_parser("set", help="set a frontmatter field")
    pt.add_argument("--folder", required=True)
    pt.add_argument("--key", required=True)
    pt.add_argument("--value", required=True)
    pt.set_defaults(func=cmd_set)

    po = sub.add_parser("open", help="list the sessions that are not complete")
    po.add_argument("--root", action="append", required=True, help="folder holding session folders (repeatable)")
    po.add_argument("--glob", default="brainstorm-*", help="session folder pattern (default brainstorm-*)")
    po.set_defaults(func=cmd_open)

    args = p.parse_args(argv)
    try:
        return args.func(args)
    except (LogError, OSError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    sys.exit(main())
