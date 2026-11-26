#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Print the note a coding tool's session-start hook injects.

SPIKE. The note tells the agent that BMad skills are installed, which agents
and workflow skills the installed modules offer, and that the `bmad` skill is
the place to ask for help. It is generated from the installed modules on every
run, so adding, renaming or retiring a skill changes it with no setup step and
no prose to keep current. It never carries the modules' help: the `bmad` skill
loads that on demand. The note names BMad skills as the first choice, never
the only one; the agent keeps every other skill it has.

Usage:
  uv run session_start.py --root <skills folder> [--root ...] [--format auto|claude|cursor|copilot|text]
                       [--event SessionStart|UserPromptSubmit] [--max-lines N]

`--format auto` picks the JSON shape from the environment the way plugins do:
CLAUDE_PLUGIN_ROOT or CLAUDE_PROJECT_DIR → Claude Code, Codex, Gemini and Devin
(`hookSpecificOutput.additionalContext`); CURSOR_PLUGIN_ROOT → Cursor
(`additional_context`); COPILOT_CLI → Copilot (`additionalContext`); otherwise
plain text, which Claude Code, Codex and Kiro also inject. Exit status is
always 0: a hook that fails must never block the session.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

from knowledge import ROSTER_NAME, Module, scan  # noqa: E402
from list_templates import frontmatter  # noqa: E402

HELP_SKILL = "bmad"
CORE_MODULE = "core-tools"
DEFAULT_MAX_LINES = 20
DESCRIPTION_LIMIT = 110
FORMATS = ("auto", "claude", "cursor", "copilot", "text")
EVENTS = ("SessionStart", "UserPromptSubmit")
LEAD = (
    "BMad Method skills are installed here (modules: {modules}). Prefer them for planning, specs, "
    "stories, builds, reviews and retros; keep using your other skills for everything else."
)
TAIL = "Ask the `bmad` skill for help, status, or what to do next."
MORE = "{count} more skills are installed; ask `bmad` for the full list."
SENTENCE_END = re.compile(r"(?<=[.!?])\s")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Print the BMad note for a session-start hook.")
    parser.add_argument("--root", type=Path, action="append", default=[], help="an active skills folder, repeated")
    parser.add_argument("--format", choices=FORMATS, default="auto")
    parser.add_argument("--event", choices=EVENTS, default="SessionStart")
    parser.add_argument("--max-lines", type=int, default=DEFAULT_MAX_LINES)
    args = parser.parse_args(argv)
    try:
        note = compose(args.root, max_lines=args.max_lines)
    except Exception as error:  # noqa: BLE001 - a hook never blocks the session
        sys.stderr.write(f"session_start: {error}\n")
        return 0
    if not note:
        return 0
    sys.stdout.write(render(note, args.format, args.event) + "\n")
    return 0


def compose(roots: list[Path], *, max_lines: int = DEFAULT_MAX_LINES) -> str:
    """The note's text, or an empty string when no module record is installed."""
    found = scan(roots)
    if not found.modules:
        return ""
    installed = {entry["skill"] for entry in found.skills if isinstance(entry.get("skill"), str)}
    agents = roster_agents(found.modules, installed)
    agent_skills = {code for code, _ in agents}
    # Method modules carry the workflow the note exists for; the core tools that serve every module come last,
    # so a tight line budget drops a helper before it drops a build or planning skill.
    ordered = sorted(found.modules, key=lambda module: module.code == CORE_MODULE)
    workflows = [
        (name, describe(found.folders[name]))
        for module in ordered
        for name in module.skills
        if name in installed and name in found.folders and name not in agent_skills and name != HELP_SKILL
    ]

    lines = [LEAD.format(modules=", ".join(module.code for module in found.modules))]
    lines += [f"- {name} ({code}): {title}" if title else f"- {name} ({code})" for code, (name, title) in agents]
    lines += [f"- {name}: {text}" if text else f"- {name}" for name, text in workflows]
    budget = max(max_lines - 1, 2)  # the lead and the tail always fit
    if len(lines) > budget:
        kept, dropped = lines[: budget - 1], len(lines) - (budget - 1)
        lines = [*kept, MORE.format(count=dropped)]
    lines.append(TAIL)
    return "\n".join(lines)


def roster_agents(modules: list[Module], installed: set[str]) -> list[tuple[str, tuple[str, str]]]:
    """(skill, (name, title)) for every roster member whose skill is installed, in module order."""
    agents: list[tuple[str, tuple[str, str]]] = []
    seen: set[str] = set()
    for module in modules:
        path = module.folder / ROSTER_NAME
        if not path.is_file():
            continue
        try:
            members = tomllib.loads(path.read_text(encoding="utf-8")).get("members", [])
        except (OSError, UnicodeError, tomllib.TOMLDecodeError):
            continue
        if not isinstance(members, list):
            continue
        for member in members:
            skill = member.get("skill") if isinstance(member, dict) else None
            if not isinstance(skill, str) or skill not in installed or skill in seen:
                continue
            seen.add(skill)
            name = member.get("name") if isinstance(member.get("name"), str) else skill
            title = member.get("title") if isinstance(member.get("title"), str) else ""
            agents.append((skill, (name, title)))
    return agents


def describe(folder: Path) -> str:
    """The first sentence of the skill's description, trimmed to the line budget."""
    try:
        text = (folder / "SKILL.md").read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        return ""
    description = frontmatter(text).get("description", "").strip()
    first = SENTENCE_END.split(description, maxsplit=1)[0].strip() if description else ""
    if len(first) > DESCRIPTION_LIMIT:
        first = first[: DESCRIPTION_LIMIT - 1].rstrip() + "…"
    return first


def render(note: str, fmt: str, event: str) -> str:
    if fmt == "auto":
        fmt = detect_format(os.environ)
    if fmt == "text":
        return note
    if fmt == "cursor":
        return json.dumps({"additional_context": note}, ensure_ascii=False)
    if fmt == "copilot":
        return json.dumps({"additionalContext": note}, ensure_ascii=False)
    return json.dumps({"hookSpecificOutput": {"hookEventName": event, "additionalContext": note}}, ensure_ascii=False)


def detect_format(env: os._Environ[str] | dict[str, str]) -> str:
    if env.get("CURSOR_PLUGIN_ROOT"):
        return "cursor"
    if env.get("COPILOT_CLI"):
        return "copilot"
    if env.get("CLAUDE_PLUGIN_ROOT") or env.get("CLAUDE_PROJECT_DIR") or env.get("CODEX_HOME"):
        return "claude"
    return "text"


if __name__ == "__main__":
    sys.exit(main())
