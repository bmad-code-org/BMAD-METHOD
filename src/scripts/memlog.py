#!/usr/bin/env python3
# /// script
# requires-python = ">=3.8"
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

Three invariants make it trustworthy:

  1. Append-only, chronological. Entries land at the end, in the order they happen.
     Nothing is ever inserted backward, reordered, edited, or removed. There is no
     edit or delete subcommand by design; history is never rewritten.
  2. Write-only / blind. Every command is an atomic, context-free write and echoes the
     new state as one line of JSON, so the caller never re-reads the file mid-session.
     The one time the file is read is on resume — and the caller reads it itself, not
     via this script.
  3. No lifecycle status. A memory log has no "complete" flag. Whether the work is done,
     blocked, or paused is itself a fact that happened, so it is recorded as an entry
     (e.g. `append --type event --text "session complete"`), never as frontmatter the
     log would have to mutate. The chronology stays the single source of truth, and a
     resume learns the state by reading the last entries — the same way it learns
     everything else.

Atomicity: every write goes to a temp file, is flushed and fsync'd, then atomically
renamed over the target, so a crash never leaves a half-written entry.

Concurrency: a sidecar `.lock` serializes the full read/modify/replace cycle. Locks
carry a random ownership token; a writer only removes the lock it acquired. Because a
process can die without running cleanup, a lock older than five minutes is treated as
orphaned and reclaimed after the normal wait timeout. A healthy memlog write is a tiny
local-file operation and must not hold the lock for that long; callers seeing a timeout
on a younger lock should inspect the recorded PID before removing it manually. Waiting
before inspecting the lock avoids Windows readers blocking the active writer's cleanup.

The file shape (.memlog.md):

    ---
    topic: Onboarding flow for a budgeting app
    goal: lift week-1 retention
    updated: 2026-06-07T14:22
    ---

    - (note) user picked techniques: SCAMPER, then Six Thinking Hats
    - (technique) started SCAMPER
    - (idea) skip the signup wall: let people try with sample data first
    - (idea) auto-import one bank account so the first screen shows real numbers
    - (question) is open-banking consent too heavy for step one?
    - (insight) the "scary numbers" risk and the "real numbers" idea are one lever: show real data, pre-categorized
    - (direction) optimize for the anxious first-timer, not the power user
    - (decision) lead with one pre-categorized account; defer multi-account import
    - (event) session complete

Each entry may carry an optional `--type` — what KIND it is (idea, insight, question,
decision, direction, assumption, gap, note, event, …) — and an optional `--by` naming
who it came from (e.g. `user`, `coach`), for sessions where authorship matters. Both
render into one short inline tag: `(idea)`, `(idea by user)`, `(by coach)`. Omit them
for a plain note. The host skill names the vocabulary; the script does not enforce one.

Commands:
  init   (--workspace DIR | --path FILE) [--field k=v ...]    create the memlog (errors if it exists)
  append (--workspace DIR | --path FILE) --text STR [--type T] [--by W]  append one entry at the end
  set    (--workspace DIR | --path FILE) --key K --value V    set/replace a descriptive frontmatter field

Addressing: `--workspace` is the run folder, and the memlog is always {workspace}/.memlog.md.
`--path` points straight at the memlog file instead, for callers that already hold the path.
"""
from __future__ import annotations  # keep type-hint syntax lazy so the script runs on 3.8+

import argparse
import json
import os
import secrets
import sys
import time
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

MEMLOG = ".memlog.md"
LOCK_TIMEOUT_SECONDS = 10.0
LOCK_POLL_SECONDS = 0.05
ORPHAN_LOCK_SECONDS = 5 * 60.0


def now() -> str:
    return datetime.now().strftime("%Y-%m-%dT%H:%M")


def resolve(args) -> Path:
    """The memlog file, from either addressing mode: {workspace}/.memlog.md or an explicit --path."""
    return Path(args.path) if args.path else Path(args.workspace) / MEMLOG


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
    """Temp + flush + fsync + atomic rename, so a crash never half-writes an entry."""
    tmp = path.with_suffix(path.suffix + ".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


@contextmanager
def exclusive_lock(path: Path):
    """Lock the complete read/modify/replace cycle across processes.

    The age threshold is an explicit lease for crash recovery, not a process-liveness
    guess (which is not portable to Windows). Ownership tokens keep an expired writer
    from deleting a successor's lock during late cleanup.
    """
    lock = path.with_suffix(path.suffix + ".lock")
    deadline = time.monotonic() + LOCK_TIMEOUT_SECONDS
    descriptor = None
    token = secrets.token_hex(16)
    last_contention = None
    while True:
        try:
            descriptor = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
            break
        except FileExistsError as contention:
            last_contention = contention
        except PermissionError as contention:
            # Windows may report an existing/locked file as EACCES instead of
            # EEXIST. Only treat that as contention when the lock is visible;
            # an absent lock means the directory itself is not writable.
            if not lock.exists():
                raise
            last_contention = contention

        if time.monotonic() < deadline:
            time.sleep(LOCK_POLL_SECONDS)
            continue
        if _reclaim_orphaned_lock(lock):
            deadline = time.monotonic() + LOCK_TIMEOUT_SECONDS
            continue
        try:
            holder = lock.read_text(encoding="ascii").strip()
        except FileNotFoundError:
            continue
        except OSError:
            holder = "unreadable"
        raise TimeoutError(
            f"timed out waiting for memlog lock: {lock} "
            f"(holder {holder or 'unknown'}; inspect the process before removing a young lock manually)"
        ) from last_contention

    record = f"{token} {os.getpid()} {time.time()}\n".encode("ascii")
    try:
        os.write(descriptor, record)
        os.fsync(descriptor)
    except BaseException:
        try:
            os.close(descriptor)
        finally:
            lock.unlink(missing_ok=True)
        raise
    try:
        yield
    finally:
        try:
            os.close(descriptor)
        finally:
            _unlink_owned_lock(lock, token)


def _reclaim_orphaned_lock(lock: Path) -> bool:
    """Remove an unchanged lock whose lease expired; tolerate another waiter winning."""
    try:
        before = lock.stat()
        holder = lock.read_text(encoding="ascii").strip()
    except FileNotFoundError:
        return True
    except OSError:
        return False

    parts = holder.split()
    try:
        if len(parts) >= 3:
            created = float(parts[2])
        elif len(parts) >= 2:  # compatibility with pre-token lock records: "pid timestamp"
            created = float(parts[1])
        else:
            created = before.st_mtime
    except (TypeError, ValueError):
        created = before.st_mtime
    if max(0.0, time.time() - created) < ORPHAN_LOCK_SECONDS:
        return False

    try:
        after = lock.stat()
    except FileNotFoundError:
        return True
    identity_before = (before.st_dev, before.st_ino, before.st_mtime_ns, before.st_size)
    identity_after = (after.st_dev, after.st_ino, after.st_mtime_ns, after.st_size)
    if identity_before != identity_after:
        return False

    try:
        lock.unlink()
        return True
    except FileNotFoundError:
        return True
    except OSError:
        return False


def _unlink_owned_lock(lock: Path, token: str) -> None:
    """Best-effort cleanup that never removes a successor writer's lock."""
    try:
        holder = lock.read_text(encoding="ascii").split(maxsplit=1)
    except (FileNotFoundError, OSError):
        return
    if holder and secrets.compare_digest(holder[0], token):
        # Windows scanners/indexers can retain a transient read handle. Retry
        # briefly, then leave the record for orphan recovery rather than fail
        # an application write that already completed successfully.
        deadline = time.monotonic() + 1.0
        while True:
            try:
                lock.unlink()
                return
            except FileNotFoundError:
                return
            except PermissionError:
                if time.monotonic() >= deadline:
                    return
                time.sleep(0.01)


def entry_count(body: str) -> int:
    return sum(1 for ln in body.splitlines() if ln.startswith("- "))


def ack(path: Path, body: str) -> None:
    """Echo new state so the caller never re-reads the file to know where it stands."""
    print(json.dumps({
        "ok": True,
        "memlog": str(path),
        "entries": entry_count(body),
    }))


def cmd_init(args) -> int:
    path = resolve(args)
    path.parent.mkdir(parents=True, exist_ok=True)
    with exclusive_lock(path):
        if path.exists():
            print(f"error: {path} already exists; use append/set to update it", file=sys.stderr)
            return 2
        meta: dict[str, str] = {}
        for pair in args.field or []:
            if "=" not in pair:
                print(f"error: --field expects key=value, got {pair!r}", file=sys.stderr)
                return 2
            k, v = pair.split("=", 1)
            meta[k.strip()] = v.strip()
        touch(meta)
        write_atomic(path, render(meta, ""))
    ack(path, "")
    return 0


def cmd_append(args) -> int:
    path = resolve(args)
    with exclusive_lock(path):
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
    ack(path, body)
    return 0


def cmd_set(args) -> int:
    path = resolve(args)
    with exclusive_lock(path):
        meta, body = split(path.read_text(encoding="utf-8"))
        meta[args.key] = args.value
        touch(meta)
        write_atomic(path, render(meta, body))
    ack(path, body)
    return 0


def add_target(sp) -> None:
    """Every command addresses the memlog the same way: a run folder or an explicit path."""
    g = sp.add_mutually_exclusive_group(required=True)
    g.add_argument("--workspace", help="run folder; the memlog is {workspace}/.memlog.md")
    g.add_argument("--path", help="explicit memlog file path (alternative to --workspace)")


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    pi = sub.add_parser("init", help="create the memlog")
    add_target(pi)
    pi.add_argument("--field", action="append", metavar="KEY=VALUE", help="frontmatter field (repeatable)")
    pi.set_defaults(func=cmd_init)

    pa = sub.add_parser("append", help="append one entry at the end")
    add_target(pa)
    pa.add_argument("--text", required=True)
    pa.add_argument("--type", help="entry kind, rendered as an inline tag")
    pa.add_argument("--by", help="who the entry came from (e.g. user, coach); rendered into the tag")
    pa.set_defaults(func=cmd_append)

    pset = sub.add_parser("set", help="set a descriptive frontmatter field")
    add_target(pset)
    pset.add_argument("--key", required=True)
    pset.add_argument("--value", required=True)
    pset.set_defaults(func=cmd_set)

    args = p.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
