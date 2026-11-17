#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""read_session_log: digest Claude Code transcripts into turns for the from-logs approach.

Source:
  claude-code   a session transcript, one JSON object per line, as Claude Code keeps them under
                ~/.claude/projects/<encoded-cwd>/*.jsonl (the cwd with every character outside A-Z, a-z,
                0-9 and "-" turned into "-"; $CLAUDE_CONFIG_DIR replaces ~/.claude when set). Each user prompt starts a turn; a /command
                becomes the request "/<name> <args>". The turn holds the tools called until the next prompt.
                Meta and sidechain (subagent) records are skipped. Tool results and assistant prose are never
                copied out.

The script does not judge which follow-ups are corrections; read `followed_by` and decide.

Usage:
  read_session_log.py [<path> ...] [--project <cwd>] [--format auto|claude-code]
                      [--max-turns N] [--max-items N]

  A path may be a file or a folder (every *.jsonl inside). --project resolves the transcript folder
  for that working directory. --format auto reads *.jsonl files; claude-code reads any file as one.

Output, one JSON object on stdout; every text is cut to 300 characters:
  {"sources": [{"path", "format", "entries", "bad_lines"}],
   "skipped": [{"path", "reason"}],
   "turns": [{"source", "request", "tools", "followed_by", "interrupted"}],
   "files_touched": [path, ...], "skills_invoked": [{"name", "count"}],
   "totals": {"turns", "turns_shown", "interrupted", "files_touched", "skills_invoked"}}

  source is the index of the turn's file in sources. tools lists tool names in
  call order, a run of the same tool written once. followed_by is the next user message in the same source,
  or null. interrupted is true when the user interrupted the turn. bad_lines counts transcript lines that are
  not JSON. turns keeps the last --max-turns (default 400); files_touched and skills_invoked are cut to
  --max-items (default 20); totals counts before any cut.

Exit 0 when at least one source was read; 1 when none was, with the reason on stderr; 2 on a usage error.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path

TEXT_LIMIT = 300
INTERRUPTED_RE = re.compile(r"^\[Request interrupted by user")
COMMAND_RE = re.compile(r"<command-name>\s*/?([^<\s]+)\s*</command-name>")
COMMAND_ARGS_RE = re.compile(r"<command-args>(.*?)</command-args>", re.DOTALL)
FILE_INPUT_KEYS = ("file_path", "notebook_path", "path")


def truncate(text: str) -> str:
    text = " ".join(text.split())
    return text if len(text) <= TEXT_LIMIT else text[: TEXT_LIMIT - 3] + "..."


def encode_cwd(cwd: str) -> str:
    return re.sub(r"[^A-Za-z0-9-]", "-", cwd)


def projects_dir() -> Path:
    base = os.environ.get("CLAUDE_CONFIG_DIR")
    return (Path(base) if base else Path.home() / ".claude") / "projects"


def collapse(tools: list[str]) -> list[str]:
    out: list[str] = []
    for tool in tools:
        if not out or out[-1] != tool:
            out.append(tool)
    return out


class Digest:
    def __init__(self) -> None:
        self.sources: list[dict] = []
        self.skipped: list[dict] = []
        self.turns: list[dict] = []
        self.files: set[str] = set()
        self.skills: Counter[str] = Counter()

    def add_turns(self, source: int, turns: list[dict]) -> None:
        for index, turn in enumerate(turns):
            turn["followed_by"] = turns[index + 1]["request"] if index + 1 < len(turns) else None
            turn["tools"] = collapse(turn["tools"])
            self.turns.append({"source": source, **turn})

    def render(self, max_turns: int, max_items: int) -> dict:
        shown = self.turns[-max_turns:] if max_turns > 0 else []
        ordered = [{k: t[k] for k in ("source", "request", "tools", "followed_by", "interrupted")} for t in shown]
        return {
            "sources": self.sources,
            "skipped": self.skipped,
            "turns": ordered,
            "files_touched": sorted(self.files)[:max_items],
            "skills_invoked": [{"name": name, "count": count} for name, count in self.skills.most_common(max_items)],
            "totals": {
                "turns": len(self.turns),
                "turns_shown": len(ordered),
                "interrupted": sum(1 for t in self.turns if t["interrupted"]),
                "files_touched": len(self.files),
                "skills_invoked": len(self.skills),
            },
        }


def user_text(content) -> str | None:
    """Return the prompt text of a user record, or None when it is only tool results."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        texts = [b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text"]
        return "\n".join(t for t in texts if t) if texts else None
    return None


def new_turn(request: str) -> dict:
    return {"request": truncate(request), "tools": [], "interrupted": False}


def read_claude_code(text: str, digest: Digest) -> tuple[int, int, list[dict]]:
    entries = 0
    bad_lines = 0
    turns: list[dict] = []
    for line in text.splitlines():
        if not line.strip():
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            bad_lines += 1
            continue
        if not isinstance(record, dict) or record.get("isMeta") or record.get("isSidechain"):
            continue
        message = record.get("message") if isinstance(record.get("message"), dict) else None
        if message is None:
            continue
        content = message.get("content")
        kind = record.get("type")
        if kind == "user":
            prompt = user_text(content)
            if prompt is None:
                continue
            entries += 1
            stripped = prompt.strip()
            commands = COMMAND_RE.findall(stripped)
            for command in commands:
                digest.skills[command] += 1
            if INTERRUPTED_RE.match(stripped):
                if turns:
                    turns[-1]["interrupted"] = True
            elif commands:
                args = COMMAND_ARGS_RE.search(stripped)
                turns.append(new_turn(f"/{commands[0]} {args.group(1).strip() if args else ''}".strip()))
            elif stripped and not stripped.startswith("<"):
                turns.append(new_turn(stripped))
        elif kind == "assistant" and isinstance(content, list):
            for block in content:
                if not isinstance(block, dict) or block.get("type") != "tool_use":
                    continue
                entries += 1
                name = str(block.get("name", ""))
                if turns:
                    turns[-1]["tools"].append(name)
                inputs = block.get("input") if isinstance(block.get("input"), dict) else {}
                if name == "Skill" and inputs.get("skill"):
                    digest.skills[str(inputs["skill"])] += 1
                for key in FILE_INPUT_KEYS:
                    if isinstance(inputs.get(key), str) and inputs[key]:
                        digest.files.add(inputs[key])
    return entries, bad_lines, turns


def detect_format(path: Path, requested: str) -> str | None:
    if requested != "auto":
        return requested
    return "claude-code" if path.suffix == ".jsonl" else None


def expand(paths: list[Path], digest: Digest) -> list[Path]:
    files: list[Path] = []
    for path in paths:
        if path.is_dir():
            found = sorted(path.glob("*.jsonl"), key=lambda p: p.stat().st_mtime)
            if not found:
                digest.skipped.append({"path": str(path), "reason": "folder holds no *.jsonl"})
            files.extend(found)
        else:
            files.append(path)
    return files


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("paths", nargs="*", type=Path, help="transcript files, or folders of them")
    p.add_argument("--project", help="working directory whose Claude Code transcripts to read")
    p.add_argument("--format", choices=("auto", "claude-code"), default="auto")
    p.add_argument("--max-turns", type=int, default=400, help="keep the last N turns (default 400)")
    p.add_argument("--max-items", type=int, default=20, help="cap for files_touched and skills_invoked (default 20)")
    args = p.parse_args(argv)

    paths = list(args.paths)
    if args.project:
        folder = projects_dir() / encode_cwd(str(Path(args.project).expanduser().resolve()))
        if not folder.is_dir():
            p.error(f"no transcripts for {args.project} at {folder}")
        paths.append(folder)
    if not paths:
        p.error("give at least one path or --project")
    missing = [str(path) for path in paths if not path.exists()]
    if missing:
        p.error(f"not found: {', '.join(missing)}")

    digest = Digest()
    for path in expand(paths, digest):
        fmt = detect_format(path, args.format)
        if fmt is None:
            digest.skipped.append(
                {"path": str(path), "reason": "unknown format; name it *.jsonl or pass --format claude-code"}
            )
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError as error:
            digest.skipped.append({"path": str(path), "reason": f"unreadable: {error.strerror or error}"})
            continue
        entries, bad_lines, turns = read_claude_code(text, digest)
        digest.add_turns(len(digest.sources), turns)
        digest.sources.append({"path": str(path), "format": fmt, "entries": entries, "bad_lines": bad_lines})

    print(json.dumps(digest.render(args.max_turns, args.max_items), indent=2))
    if not digest.sources:
        reasons = "; ".join(f"{s['path']}: {s['reason']}" for s in digest.skipped)
        print(f"read_session_log: no source was read ({reasons})", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
