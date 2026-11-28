#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7", "tiktoken"]
# ///
"""cut_check: what a rewrite dropped that must survive character for character.

Compares each prompt file (the .md files outside scripts/, and the root customize.toml) in a copy of the
skill taken before the rewrite with the same file after it. Judging whether a rule survived is the
Checker's work; this catches only what a string comparison can.

Usage:
  cut_check.py <before-folder> <after-folder> [--protect <path>[#<heading>] ...] [--protect-text <file> ...]

--protect-text names a file of passages, separated by blank lines, that must survive verbatim. Each passage is
looked up in the before copy and must still appear in the same file after the rewrite.

Output, one JSON object on stdout:
  {"files": [{"path", "missing", "lost": [str]}], "missing": [path], "lost": [path],
   "tokens": {"files": [{"path", "before", "after", "percent"}], "total": {"before", "after", "percent"},
              "method": "tiktoken" | "fallback"}}
A file's lost lists each Jinja construct ({{ }} or {% %}) and {skill-root} or {project-root} path that is
gone, "frontmatter" when the frontmatter changed, "protected" or "protected: <heading>" for a --protect file
or section no longer kept word for word (a heading inside a code fence does not end a section), and
"protected text: <passage start>" for a --protect-text passage that is gone. Top-level missing and lost list
the files with any.
tokens covers the prompt files of both folders, counted as count_tokens.py counts them: after is 0 for a
missing file, before is 0 for a new one, and percent is the change from before, negative when the file
shrank (null when before is 0).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.
sys.path.insert(0, str(Path(__file__).resolve().parent))

from count_tokens import count_tokens, read_text  # noqa: E402
from init_skill import NO_BMAD, frontmatter  # noqa: E402

HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*#*\s*$", re.MULTILINE)
JINJA_RE = re.compile(r"\{\{.*?\}\}|\{%.*?%\}", re.DOTALL)
ROOT_PATH_RE = re.compile(r"\{(?:skill-root|project-root)\}[^\s`'\"()<>\[\],;]*")
SKIP_DIRS = {".git", "__pycache__", ".pytest_cache", "node_modules", ".venv", "venv"}
FENCE_RE = re.compile(r"^[ \t]*(`{3,}|~{3,})")
PASSAGE_LABEL_CHARS = 60


def prompt_files(root: Path) -> list[str]:
    out = []
    for path in sorted(root.rglob("*")):
        rel = path.relative_to(root)
        if not path.is_file() or SKIP_DIRS & set(rel.parts):
            continue
        if (path.suffix == ".md" and rel.parts[0] != "scripts") or rel == Path("customize.toml"):
            out.append(rel.as_posix())
    # Path order folds case on Windows; strings sort the same on every OS.
    return sorted(out)


def blank_fences(text: str) -> str:
    """Fenced lines replaced by spaces of the same length, so offsets match the original text."""
    out = []
    fence = ""
    for line in text.splitlines(keepends=True):
        marker = FENCE_RE.match(line)
        if fence or marker:
            body = line.rstrip("\r\n")
            out.append(" " * len(body) + line[len(body) :])
            if (
                fence
                and marker
                and marker[1][0] == fence[0]
                and len(marker[1]) >= len(fence)
                and not body.strip()[len(marker[1]) :]
            ):
                fence = ""
            elif not fence:
                fence = marker[1]
            continue
        out.append(line)
    return "".join(out)


def section(text: str, heading: str) -> str | None:
    """The heading line and everything under it up to the next heading of the same or a higher level."""
    plain = blank_fences(text)
    for match in HEADING_RE.finditer(plain):
        if match.group(2) == heading:
            level = len(match.group(1))
            for nxt in HEADING_RE.finditer(plain, match.end()):
                if len(nxt.group(1)) <= level:
                    return text[match.start() : nxt.start()]
            return text[match.start() :]
    return None


def passages(path: Path) -> list[str]:
    text = read_text(path).replace("\r\n", "\n")
    return [p.strip("\n") for p in re.split(r"\n[ \t]*\n", text) if p.strip()]


def percent(before: int, after: int) -> float | None:
    return round((after - before) * 100 / before, 1) if before else None


def token_table(before: Path, after: Path, files: list[str]) -> dict:
    rows = []
    method = "tiktoken"
    for rel in files:
        counts = []
        for root in (before, after):
            path = root / rel
            tokens, used = count_tokens(read_text(path)) if path.is_file() else (0, "tiktoken")
            method = "fallback" if used == "fallback" else method
            counts.append(tokens)
        rows.append({"path": rel, "before": counts[0], "after": counts[1], "percent": percent(*counts)})
    total_before = sum(r["before"] for r in rows)
    total_after = sum(r["after"] for r in rows)
    return {
        "files": rows,
        "total": {"before": total_before, "after": total_after, "percent": percent(total_before, total_after)},
        "method": method,
    }


def raw_frontmatter(text: str) -> str | None:
    """The frontmatter's YAML text as written, or None when the file has none."""
    try:
        return frontmatter.split(text)[0]
    except ValueError:
        return None


def lost_in(before: str, after: str, protects: list[str | None]) -> list[str]:
    jinja = Counter(" ".join(m.split()) for m in JINJA_RE.findall(before))
    jinja -= Counter(" ".join(m.split()) for m in JINJA_RE.findall(after))
    lost = list(jinja.elements())
    after_paths = {p.rstrip(".:") for p in ROOT_PATH_RE.findall(after)}
    lost += sorted({p.rstrip(".:") for p in ROOT_PATH_RE.findall(before)} - after_paths)
    fm_before = raw_frontmatter(before)
    if fm_before is not None and fm_before != raw_frontmatter(after):
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


def check(before: Path, after: Path, protect: list[str], protect_text: list[Path] = ()) -> dict:
    files = prompt_files(before)
    protects: dict[str, list[str | None]] = {}
    for entry in protect:
        path, _, heading = entry.partition("#")
        if path not in files:
            raise ValueError(f"--protect matches no prompt file: {entry}")
        protects.setdefault(path, []).append(heading.strip() or None)
    texts: dict[str, list[str]] = {}
    old_text = {rel: read_text(before / rel) for rel in files}
    for source in protect_text:
        for passage in passages(source):
            homes = [rel for rel in files if passage in old_text[rel]]
            if not homes:
                raise ValueError(
                    f"--protect-text passage not found in any prompt file: {passage[:PASSAGE_LABEL_CHARS]}"
                )
            for rel in homes:
                texts.setdefault(rel, []).append(passage)

    out = []
    for rel in files:
        target = after / rel
        missing = not target.is_file()
        lost = []
        if not missing:
            new = read_text(target)
            lost = lost_in(old_text[rel], new, protects.get(rel, []))
            lost += [f"protected text: {p[:PASSAGE_LABEL_CHARS]}" for p in texts.get(rel, []) if p not in new]
        out.append({"path": rel, "missing": missing, "lost": lost})
    return {
        "files": out,
        "missing": [f["path"] for f in out if f["missing"]],
        "lost": [f["path"] for f in out if f["lost"]],
        "tokens": token_table(before, after, sorted(set(files) | set(prompt_files(after)))),
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("before", type=Path, help="copy of the skill folder taken before the rewrite")
    p.add_argument("after", type=Path, help="the skill folder now")
    p.add_argument("--protect", action="append", default=[], help="file, or file#heading, relative to the skill")
    p.add_argument(
        "--protect-text",
        action="append",
        default=[],
        type=Path,
        metavar="FILE",
        help="file of passages, separated by blank lines, each kept verbatim",
    )
    args = p.parse_args(argv)
    if frontmatter is None:
        print(NO_BMAD, file=sys.stderr)
        return 2

    for folder in (args.before, args.after):
        if not folder.is_dir():
            p.error(f"not a directory: {folder}")
    for source in args.protect_text:
        if not source.is_file():
            p.error(f"not a file: {source}")
    try:
        result = check(args.before, args.after, args.protect, args.protect_text)
    except ValueError as exc:
        p.error(str(exc))
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
