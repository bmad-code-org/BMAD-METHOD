#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Measure git commit and file-change evidence over a revision range.

Prints ONLY JSON to stdout. Errors are emitted as JSON to stdout with a
non-zero exit code. This script only MEASURES — it never judges acceleration
or violations. The model interprets the numbers.
"""

import argparse
import json
import re
import subprocess
import sys

UNIT_SEP = "\x1f"


def _emit(obj, code=0):
    sys.stdout.write(json.dumps(obj))
    sys.exit(code)


def _parse_numstat_line(line):
    # numstat lines: "<added>\t<deleted>\t<path>"; binary files use "-".
    parts = line.split("\t")
    if len(parts) < 3:
        return None
    added_raw, deleted_raw, path = parts[0], parts[1], "\t".join(parts[2:])
    added = None if added_raw == "-" else int(added_raw)
    deleted = None if deleted_raw == "-" else int(deleted_raw)
    return added, deleted, path


def main(argv=None):
    parser = argparse.ArgumentParser(
        description=(
            "Measure commit and per-file change evidence over a git revision "
            "range. Measures only; does not judge."
        )
    )
    parser.add_argument("--repo", default=".", help="Path to the git repo (default: .)")
    parser.add_argument("--range", dest="range", help="Revision range REV..REV")
    parser.add_argument(
        "--stories",
        help="Comma-separated story ids to match against commit subjects.",
    )
    args = parser.parse_args(argv)

    stories = []
    if args.stories:
        stories = [s.strip() for s in args.stories.split(",") if s.strip()]

    if not args.range:
        _emit(
            {
                "range": None,
                "note": "no range supplied",
                "commits": [],
                "files": [],
            }
        )

    cmd = [
        "git",
        "-C",
        args.repo,
        "log",
        "--numstat",
        f"--format=%H{UNIT_SEP}%s",
        args.range,
    ]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True)
    except Exception as exc:  # noqa: BLE001
        _emit({"ok": False, "error": str(exc)}, 1)

    if proc.returncode != 0:
        _emit({"ok": False, "error": proc.stderr.strip()}, 1)

    commits = []
    files = {}  # path -> {added, deleted, net, commit_count}
    current = None

    for raw in proc.stdout.splitlines():
        if UNIT_SEP in raw:
            sha, subject = raw.split(UNIT_SEP, 1)
            story = None
            for sid in stories:
                # Word-boundary match so a story id like "1-2" does not
                # also match "11-2" or "1-23".
                if re.search(rf"\b{re.escape(sid)}\b", subject):
                    story = sid
                    break
            current = {"sha": sha, "subject": subject, "story": story}
            commits.append(current)
            continue

        if not raw.strip():
            continue

        parsed = _parse_numstat_line(raw)
        if parsed is None:
            continue
        added, deleted, path = parsed

        entry = files.get(path)
        if entry is None:
            # _added/_deleted are running sums; _binary marks any binary change.
            entry = {"path": path, "_added": 0, "_deleted": 0, "_binary": False, "commit_count": 0}
            files[path] = entry

        entry["commit_count"] += 1
        if added is None or deleted is None:
            entry["_binary"] = True
        else:
            entry["_added"] += added
            entry["_deleted"] += deleted

    file_list = []
    for entry in files.values():
        if entry["_binary"]:
            added = deleted = net = None
        else:
            added = entry["_added"]
            deleted = entry["_deleted"]
            net = added - deleted
        file_list.append(
            {
                "path": entry["path"],
                "added": added,
                "deleted": deleted,
                "net": net,
                "commit_count": entry["commit_count"],
            }
        )

    _emit(
        {
            "range": args.range,
            "commit_count": len(commits),
            "commits": commits,
            "files": file_list,
            "stories_supplied": stories,
        }
    )


if __name__ == "__main__":
    main()
