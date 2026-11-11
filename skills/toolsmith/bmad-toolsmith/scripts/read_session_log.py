#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""read_session_log: digest Claude Code transcripts and memlogs into a compact JSON for the from-logs approach.

Sources:
  claude-code   a session transcript, one JSON object per line, as Claude Code keeps them under
                ~/.claude/projects/<encoded-cwd>/*.jsonl (the cwd with every "/" and "." turned into "-";
                $CLAUDE_CONFIG_DIR replaces ~/.claude when set). Read: user prompts, tool calls per turn,
                `Skill` tool calls and /command invocations, files named in tool inputs. Meta and sidechain
                (subagent) records are skipped. Tool results and assistant prose are never copied out.
  memlog        a .memlog.md: entries typed direction or decision, or marked `by user`, count as requests;
                entries typed gap or correction, or reading like a correction, count as corrections.

A correction is a user message that opens with a word of refusal or redirection (no, don't, stop, wrong,
wait, actually, instead, undo, revert, ...) or a request interrupted by the user. It is a heuristic; read the
digest as leads, not verdicts.

Usage:
  read_session_log.py [<path> ...] [--project <cwd>] [--format auto|claude-code|memlog] [--max-items N]

  A path may be a file or a folder (every *.jsonl and *.memlog.md inside). --project resolves the
  transcript folder for that working directory. --format auto picks by file name.

Output, one JSON object on stdout; every text is cut to 300 characters and every list to --max-items:
  {"sources": [{"path", "format", "entries"}], "user_requests": [{"text", "count"}],
   "tool_sequences": [{"tools": [...], "count"}], "corrections": [text, ...],
   "files_touched": [path, ...], "skills_invoked": [{"name", "count"}]}
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
CORRECTION_RE = re.compile(
    r"^(?:no|nope|not|don'?t|do not|stop|wrong|wait|actually|instead|undo|revert|never|hold on|"
    r"that'?s (?:not|wrong)|that is (?:not|wrong)|why did you|i said|i asked|not what)\b",
    re.IGNORECASE,
)
INTERRUPTED_RE = re.compile(r"^\[Request interrupted by user")
COMMAND_RE = re.compile(r"<command-name>\s*/?([^<\s]+)\s*</command-name>")
MEMLOG_ENTRY_RE = re.compile(r"^- (?:\((?P<tag>[^)]*)\) )?(?P<text>.*)$")
FILE_INPUT_KEYS = ("file_path", "notebook_path", "path")


def truncate(text: str) -> str:
    text = " ".join(text.split())
    return text if len(text) <= TEXT_LIMIT else text[: TEXT_LIMIT - 3] + "..."


def encode_cwd(cwd: str) -> str:
    return re.sub(r"[/.]", "-", cwd)


def projects_dir() -> Path:
    base = os.environ.get("CLAUDE_CONFIG_DIR")
    return (Path(base) if base else Path.home() / ".claude") / "projects"


class Digest:
    def __init__(self) -> None:
        self.sources: list[dict] = []
        self.requests: Counter[str] = Counter()
        self.request_text: dict[str, str] = {}
        self.sequences: Counter[tuple[str, ...]] = Counter()
        self.corrections: list[str] = []
        self.files: set[str] = set()
        self.skills: Counter[str] = Counter()

    def add_request(self, text: str) -> None:
        key = " ".join(text.lower().split())
        if not key:
            return
        self.requests[key] += 1
        self.request_text.setdefault(key, truncate(text))
        if CORRECTION_RE.match(text.strip()) or INTERRUPTED_RE.match(text.strip()):
            self.add_correction(text)

    def add_correction(self, text: str) -> None:
        short = truncate(text)
        if short not in self.corrections:
            self.corrections.append(short)

    def add_sequence(self, tools: list[str]) -> None:
        collapsed: list[str] = []
        for tool in tools:
            if not collapsed or collapsed[-1] != tool:
                collapsed.append(tool)
        if collapsed:
            self.sequences[tuple(collapsed)] += 1

    def render(self, max_items: int) -> dict:
        return {
            "sources": self.sources,
            "user_requests": [
                {"text": self.request_text[key], "count": count} for key, count in self.requests.most_common(max_items)
            ],
            "tool_sequences": [
                {"tools": list(seq), "count": count} for seq, count in self.sequences.most_common(max_items)
            ],
            "corrections": self.corrections[:max_items],
            "files_touched": sorted(self.files)[:max_items],
            "skills_invoked": [{"name": name, "count": count} for name, count in self.skills.most_common(max_items)],
        }


def user_text(content) -> str | None:
    """Return the prompt text of a user record, or None when it is only tool results."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        texts = [b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text"]
        return "\n".join(t for t in texts if t) if texts else None
    return None


def read_claude_code(path: Path, digest: Digest) -> int:
    entries = 0
    turn_tools: list[str] = []
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not isinstance(record, dict) or record.get("isMeta") or record.get("isSidechain"):
            continue
        message = record.get("message") if isinstance(record.get("message"), dict) else None
        if message is None:
            continue
        content = message.get("content")
        kind = record.get("type")
        if kind == "user":
            text = user_text(content)
            if text is None:
                continue
            entries += 1
            digest.add_sequence(turn_tools)
            turn_tools = []
            for command in COMMAND_RE.findall(text):
                digest.skills[command] += 1
            stripped = text.strip()
            if INTERRUPTED_RE.match(stripped):
                digest.add_correction(stripped)
            elif stripped and not stripped.startswith("<"):
                digest.add_request(stripped)
        elif kind == "assistant" and isinstance(content, list):
            for block in content:
                if not isinstance(block, dict) or block.get("type") != "tool_use":
                    continue
                entries += 1
                name = str(block.get("name", ""))
                turn_tools.append(name)
                inputs = block.get("input") if isinstance(block.get("input"), dict) else {}
                if name == "Skill" and inputs.get("skill"):
                    digest.skills[str(inputs["skill"])] += 1
                for key in FILE_INPUT_KEYS:
                    if isinstance(inputs.get(key), str) and inputs[key]:
                        digest.files.add(inputs[key])
    digest.add_sequence(turn_tools)
    return entries


def read_memlog(path: Path, digest: Digest) -> int:
    entries = 0
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        match = MEMLOG_ENTRY_RE.match(line)
        if not match:
            continue
        entries += 1
        tag = (match.group("tag") or "").strip().lower()
        kind = tag.split(" by ")[0].strip()
        by_user = " by user" in f" {tag}" or tag.startswith("by user")
        text = match.group("text").strip()
        if kind in ("gap", "correction"):
            digest.add_correction(text)
        elif kind in ("direction", "decision") or by_user:
            digest.add_request(text)
        elif CORRECTION_RE.match(text):
            digest.add_correction(text)
    return entries


def detect_format(path: Path, requested: str) -> str | None:
    if requested != "auto":
        return requested
    if path.suffix == ".jsonl":
        return "claude-code"
    if path.name.endswith(".memlog.md") or path.name == ".memlog.md":
        return "memlog"
    return None


def expand(paths: list[Path]) -> list[Path]:
    files: list[Path] = []
    for path in paths:
        if path.is_dir():
            files.extend(sorted(path.glob("*.jsonl"), key=lambda p: p.stat().st_mtime))
            files.extend(sorted(path.glob("*.memlog.md")))
        else:
            files.append(path)
    return files


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("paths", nargs="*", type=Path, help="transcript files, memlogs, or folders of them")
    p.add_argument("--project", help="working directory whose Claude Code transcripts to read")
    p.add_argument("--format", choices=("auto", "claude-code", "memlog"), default="auto")
    p.add_argument("--max-items", type=int, default=20, help="cap for every list (default 20)")
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
    for path in expand(paths):
        fmt = detect_format(path, args.format)
        if fmt is None:
            print(f"read_session_log: skipping {path}, unknown format", file=sys.stderr)
            continue
        reader = read_claude_code if fmt == "claude-code" else read_memlog
        entries = reader(path, digest)
        digest.sources.append({"path": str(path), "format": fmt, "entries": entries})

    print(json.dumps(digest.render(args.max_items), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
