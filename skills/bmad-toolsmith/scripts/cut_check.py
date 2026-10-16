#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""cut_check: what a rewrite dropped that must survive character for character.

Compares each prompt file (the .md files outside scripts/, and the root customize.toml) in a copy of the
skill taken before the rewrite with the same file after it. Judging whether a rule survived is the
Checker's work; this catches only what a string comparison can.

Usage:
  cut_check.py <before-folder> <after-folder> [--protect <path>[#<heading>] ...]

Output, one JSON object on stdout:
  {"files": [{"path", "missing", "lost": [str]}], "missing": [path], "lost": [path]}
A file's lost lists each Jinja construct ({{ }} or {% %}) and {skill-root} or {project-root} path that is
gone, "frontmatter" when the frontmatter changed, and "protected" or "protected: <heading>" for a
--protect file or section no longer kept word for word. Top-level missing and lost list the files with any.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

FRONTMATTER_RE = re.compile(r"\A---\n.*?\n---\n", re.DOTALL)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*#*\s*$", re.MULTILINE)
JINJA_RE = re.compile(r"\{\{.*?\}\}|\{%.*?%\}", re.DOTALL)
ROOT_PATH_RE = re.compile(r"\{(?:skill-root|project-root)\}[^\s`'\"()<>\[\],;]*")
SKIP_DIRS = {".git", "__pycache__", ".pytest_cache", "node_modules", ".venv", "venv"}


def prompt_files(root: Path) -> list[str]:
    out = []
    for path in sorted(root.rglob("*")):
        rel = path.relative_to(root)
        if not path.is_file() or SKIP_DIRS & set(rel.parts):
            continue
        if (path.suffix == ".md" and rel.parts[0] != "scripts") or rel == Path("customize.toml"):
            out.append(rel.as_posix())
    return out


def section(text: str, heading: str) -> str | None:
    """The heading line and everything under it up to the next heading of the same or a higher level."""
    for match in HEADING_RE.finditer(text):
        if match.group(2) == heading:
            level = len(match.group(1))
            for nxt in HEADING_RE.finditer(text, match.end()):
                if len(nxt.group(1)) <= level:
                    return text[match.start() : nxt.start()]
            return text[match.start() :]
    return None


def lost_in(before: str, after: str, protects: list[str | None]) -> list[str]:
    jinja = Counter(" ".join(m.split()) for m in JINJA_RE.findall(before))
    jinja -= Counter(" ".join(m.split()) for m in JINJA_RE.findall(after))
    lost = list(jinja.elements())
    after_paths = {p.rstrip(".:") for p in ROOT_PATH_RE.findall(after)}
    lost += sorted({p.rstrip(".:") for p in ROOT_PATH_RE.findall(before)} - after_paths)
    fm_before, fm_after = FRONTMATTER_RE.match(before), FRONTMATTER_RE.match(after)
    if fm_before and (not fm_after or fm_before.group(0) != fm_after.group(0)):
        lost.append("frontmatter")
    for heading in protects:
        if heading is None:
            if before != after:
                lost.append("protected")
        else:
            kept = section(before, heading)
            if kept is None:
                raise ValueError(f"--protect section not found: #{heading}")
            if kept not in after:
                lost.append(f"protected: {heading}")
    return lost


def check(before: Path, after: Path, protect: list[str]) -> dict:
    files = prompt_files(before)
    protects: dict[str, list[str | None]] = {}
    for entry in protect:
        path, _, heading = entry.partition("#")
        if path not in files:
            raise ValueError(f"--protect matches no prompt file: {entry}")
        protects.setdefault(path, []).append(heading.strip() or None)

    out = []
    for rel in files:
        target = after / rel
        missing = not target.is_file()
        lost = []
        if not missing:
            old = (before / rel).read_text(encoding="utf-8")
            lost = lost_in(old, target.read_text(encoding="utf-8"), protects.get(rel, []))
        out.append({"path": rel, "missing": missing, "lost": lost})
    return {
        "files": out,
        "missing": [f["path"] for f in out if f["missing"]],
        "lost": [f["path"] for f in out if f["lost"]],
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("before", type=Path, help="copy of the skill folder taken before the rewrite")
    p.add_argument("after", type=Path, help="the skill folder now")
    p.add_argument("--protect", action="append", default=[], help="file, or file#heading, relative to the skill")
    args = p.parse_args(argv)
    for folder in (args.before, args.after):
        if not folder.is_dir():
            p.error(f"not a directory: {folder}")
    try:
        result = check(args.before, args.after, args.protect)
    except ValueError as exc:
        p.error(str(exc))
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
