#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""The session-start hook `bmad setup` offers: report it, write it, remove it.

The `session_start_hook` answer in the core-tools module's config decides it. `on` puts a
`SessionStart` entry in the hook file of every coding tool that has a skills folder in
the project, so the tool runs `_bmad/scripts/session_start.py` once per new session and
learns which BMad skills are installed and when to use them. `off`, or no answer, means
no entry; `off` also removes one that is there.

Each entry is merged into the tool's own file and recognised by its command, so the
rest of the file is never rewritten by hand and removal takes out exactly that entry.
A file that is not valid JSON is reported and left alone.

The functions here are pure apart from `apply`, which writes. setup.py calls them.
"""

from __future__ import annotations

import json
import os
import re
import tempfile
from pathlib import Path
from typing import NamedTuple

MODULE = "core-tools"
QUESTION_KEY = "session_start_hook"
ON = "on"
OFF = "off"
EVENT = "SessionStart"
MATCHER = "startup|clear"
SCRIPT = "_bmad/scripts/session_start.py"
TIMEOUT = 20
PROJECT = "${CLAUDE_PROJECT_DIR:-.}"
OURS = re.compile(r"session_start\.py")


class Host(NamedTuple):
    code: str
    skills: str
    file: str
    status_message: str | None = None
    note: str | None = None


# A coding tool is present when its skills folder is one of the active roots inside the project.
HOSTS: tuple[Host, ...] = (
    Host("claude-code", ".claude/skills", ".claude/settings.json", status_message="BMad session start"),
    Host(
        "codex",
        ".agents/skills",
        ".codex/hooks.json",
        note="Codex runs project hooks only after the user trusts them in its /hooks menu.",
    ),
)


def answer(team_config: object) -> str | None:
    """The `session_start_hook` answer, lower-cased, or None when the question is unanswered."""
    value = team_config
    for key in ("modules", MODULE, QUESTION_KEY):
        if not isinstance(value, dict) or key not in value:
            return None
        value = value[key]
    return str(value).strip().lower() if isinstance(value, (str, int, float, bool)) else None


def hosts_present(project_root: Path, roots: tuple[Path, ...]) -> list[Host]:
    resolved = {root.resolve() for root in roots}
    return [host for host in HOSTS if (project_root / host.skills).resolve() in resolved]


def command(hosts: list[Host]) -> str:
    roots = "".join(f' --root "{PROJECT}/{host.skills}"' for host in hosts)
    return f'uv run "{PROJECT}/{SCRIPT}"{roots}'


def entry(host: Host, hosts: list[Host]) -> dict[str, object]:
    hook: dict[str, object] = {"type": "command", "command": command(hosts), "timeout": TIMEOUT}
    if host.status_message:
        hook["statusMessage"] = host.status_message
    return {"matcher": MATCHER, "hooks": [hook]}


def is_ours(item: object) -> bool:
    if not isinstance(item, dict):
        return False
    hooks = item.get("hooks")
    return isinstance(hooks, list) and any(
        isinstance(hook, dict) and isinstance(hook.get("command"), str) and OURS.search(hook["command"])
        for hook in hooks
    )


def read_file(path: Path, project_root: Path) -> dict[str, object] | None:
    """The file's JSON object, {} when it does not exist, None when it cannot be used.

    A hook file reached through a symlink, in the file or any folder below the project root, is never
    used: writing through it would land outside the project, as setup.py refuses for `_bmad` itself.
    """
    if linked(path, project_root):
        return None
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError):
        return None
    return data if isinstance(data, dict) else None


def linked(path: Path, project_root: Path) -> bool:
    """True when the path, or any folder between the project root and it, is a symlink."""
    current = path
    while current != project_root and current != current.parent:
        if current.is_symlink():
            return True
        current = current.parent
    return False


def ours_in(data: dict[str, object]) -> list[dict[str, object]]:
    hooks = data.get("hooks")
    if not isinstance(hooks, dict):
        return []
    items = hooks.get(EVENT)
    return [item for item in items if is_ours(item)] if isinstance(items, list) else []


def state_of(data: dict[str, object] | None, wanted: dict[str, object]) -> str:
    if data is None:
        return "unreadable"
    ours = ours_in(data)
    if not ours:
        return "absent"
    return "present" if ours == [wanted] else "stale"


def report(project_root: Path, roots: tuple[Path, ...], answer: str | None) -> dict[str, object]:
    """What `bmad status` says: each present tool's hook file and whether it matches the answer."""
    hosts = hosts_present(project_root, roots)
    entries = []
    owed = False
    for host in hosts:
        state = state_of(read_file(project_root / host.file, project_root), entry(host, hosts))
        if answer == ON:
            owed = owed or state in ("absent", "stale")
        elif answer == OFF:
            owed = owed or state in ("present", "stale")
        item: dict[str, object] = {"host": host.code, "file": host.file, "state": state}
        if host.note and state != "absent":
            item["note"] = host.note
        entries.append(item)
    return {"answer": answer or "unanswered", "hosts": entries, "owed": owed}


def apply(project_root: Path, roots: tuple[Path, ...], answer: str | None) -> dict[str, object]:
    """Make each present tool's hook file match the answer. Unanswered changes nothing."""
    hosts = hosts_present(project_root, roots)
    entries = []
    changed = False
    for host in hosts:
        path = project_root / host.file
        data = read_file(path, project_root)
        wanted = entry(host, hosts)
        if data is None:
            state = "unreadable"
        elif answer == ON:
            state = state_of(data, wanted)
            if state != "present":
                write_entry(path, data, wanted)
                state, changed = "written", True
        elif answer == OFF and ours_in(data):
            remove_entries(path, data)
            state, changed = "removed", True
        else:
            state = state_of(data, wanted)
        item: dict[str, object] = {"host": host.code, "file": host.file, "state": state}
        if host.note and state in ("written", "present", "stale"):
            item["note"] = host.note
        entries.append(item)
    return {"answer": answer or "unanswered", "hosts": entries, "changed": changed}


def write_entry(path: Path, data: dict[str, object], wanted: dict[str, object]) -> None:
    hooks = data.get("hooks")
    if not isinstance(hooks, dict):
        hooks = data["hooks"] = {}
    items = hooks.get(EVENT)
    if not isinstance(items, list):
        items = hooks[EVENT] = []
    kept = [item for item in items if not is_ours(item)]
    hooks[EVENT] = [*kept, wanted]
    write_file(path, data)


def remove_entries(path: Path, data: dict[str, object]) -> None:
    hooks = data["hooks"]
    assert isinstance(hooks, dict)
    kept = [item for item in hooks[EVENT] if not is_ours(item)]  # type: ignore[union-attr]
    if kept:
        hooks[EVENT] = kept
    else:
        del hooks[EVENT]
    if not hooks:
        del data["hooks"]
    if data:
        write_file(path, data)
    else:
        path.unlink()


def write_file(path: Path, data: dict[str, object]) -> None:
    """Write the whole file through a fresh sibling temp file and an atomic replace, never through a link.

    `mkstemp` creates the temp file exclusively under a name nobody could have planted, so a symlink
    left at a guessable path cannot redirect the write.
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    handle, name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".bmad-tmp", dir=path.parent)
    temp = Path(name)
    try:
        with os.fdopen(handle, "w", encoding="utf-8") as file:
            file.write(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
        os.replace(temp, path)
    except BaseException:
        temp.unlink(missing_ok=True)
        raise
