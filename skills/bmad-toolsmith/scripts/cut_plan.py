#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["tiktoken"]
# ///
"""cut_plan: the baseline for a cut pass, where the old files are read from, and the measure against it.

Prompt files are the .md files outside scripts/ and the root customize.toml. Counts come from count_tokens
in this folder, so they match what count_tokens.py prints. Paths in the JSON are relative to the skill
folder, so a baseline stays valid when the folder moves.

Usage:
  cut_plan.py plan <skill-folder> [--protect <path>[#<heading>] ...] [--floor <tokens>] [--out <json>]
  cut_plan.py measure <skill-folder> --baseline <json>

plan prints {"files": [...], "total", "floor", "method", "before_source"}, each file
{"path", "tokens", "cut", "protected", "old_command", "names", "jinja", "root_paths", "sections"}.
  cut         false for a protected file and for one under the floor; true otherwise
  protected   true for a --protect file or folder, a SKILL.md that calls render_skill.py (copied from the
              rendered-skill shape) and a customize.toml with an [agent] table (persona and menu)
  --protect path#heading protects that section only: its text is left out of the cut and measure checks it
  names       headings, frontmatter keys, and bold list labels ("- **Label**") another file of the skill names
  jinja       every {{ }} and {% %} construct, whitespace-normalized, once per occurrence
  root_paths  every distinct {skill-root}... and {project-root}... path
  before_source  git when every prompt file is committed and unchanged; else copy, with the folder copied
              beside --out as <its stem without -plan>-before/; none without --out
  old_command prints the file as it was before the cut, or null when before_source is none

measure prints {"files": [{"path", "before", "after", "percent", "missing", "lost"}], "before",
"after", "percent", "missing", "lost"} for the files the baseline lists. percent is the whole-number cut.
A file gone from disk is missing, counts as after 0, and is listed in the top-level "missing". lost holds
the names, jinja, root_paths and protected sections the baseline has and the file no longer does; the
top-level "lost" lists the files with any.
"""

from __future__ import annotations

import argparse
import json
import re
import shlex
import shutil
import subprocess
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from count_tokens import SKIP_DIRS, count_tokens, iter_text_files, read_text  # noqa: E402

DEFAULT_FLOOR = 150
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---\n", re.DOTALL)
FENCE_RE = re.compile(r"^```.*?^```[^\n]*$", re.DOTALL | re.MULTILINE)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*#*\s*$", re.MULTILINE)
KEY_RE = re.compile(r"^([A-Za-z_][\w-]*):", re.MULTILINE)
LABEL_RE = re.compile(r"^\s*(?:[-*]|\d+\.)\s+\*\*(.+?)\*\*", re.MULTILINE)
JINJA_RE = re.compile(r"\{\{.*?\}\}|\{%.*?%\}", re.DOTALL)
ROOT_PATH_RE = re.compile(r"\{(?:skill-root|project-root)\}[^\s`'\"()<>\[\],;]*")
RENDER_CALL = "render_skill.py"


class CutPlanError(Exception):
    pass


def prompt_files(root: Path) -> list[Path]:
    return [
        path
        for path in iter_text_files(root)
        if (path.suffix.lower() == ".md" and path.relative_to(root).parts[0] != "scripts")
        or path == root / "customize.toml"
    ]


def tokens_of(text: str) -> tuple[int, str]:
    return count_tokens(text) if text else (0, "tiktoken")


def strip_fences(text: str) -> str:
    return FENCE_RE.sub("", text)


def section(text: str, heading: str) -> str | None:
    """The heading line and everything under it up to the next heading of the same or a higher level."""
    body = strip_fences(text)
    for match in HEADING_RE.finditer(body):
        if match.group(2) == heading:
            start = text.find(match.group(0))
            level = len(match.group(1))
            for nxt in HEADING_RE.finditer(text, start + len(match.group(0))):
                if len(nxt.group(1)) <= level:
                    return text[start : nxt.start()]
            return text[start:]
    return None


def own_names(text: str) -> tuple[list[str], list[str]]:
    """(headings and frontmatter keys, bold list labels) of a Markdown file, outside fenced blocks."""
    fm = FRONTMATTER_RE.match(text)
    keys = KEY_RE.findall(fm.group(1)) if fm else []
    body = strip_fences(text[fm.end() :] if fm else text)
    headings = [m.group(2) for m in HEADING_RE.finditer(body)]
    labels = [label.strip().rstrip(".:") for label in LABEL_RE.findall(body)]
    return list(dict.fromkeys(headings + keys)), list(dict.fromkeys(labels))


def named_elsewhere(label: str, rel: Path, texts: dict[Path, str]) -> bool:
    pattern = re.compile(r"(?<!\w)" + re.escape(label) + r"(?!\w)")
    return any(other != rel and pattern.search(text) for other, text in texts.items())


def invariants(text: str) -> dict:
    return {
        "jinja": [" ".join(m.split()) for m in JINJA_RE.findall(text)],
        "root_paths": sorted({p.rstrip(".:") for p in ROOT_PATH_RE.findall(text)}),
    }


def git(args: list[str], cwd: Path) -> str | None:
    try:
        res = subprocess.run(["git", "-C", str(cwd), *args], capture_output=True, text=True)
    except FileNotFoundError:
        return None
    return res.stdout if res.returncode == 0 else None


def committed_repo(root: Path, rels: list[Path]) -> Path | None:
    """The repository root when every prompt file is tracked and the skill folder has no changes."""
    top = git(["rev-parse", "--show-toplevel"], root)
    if not top:
        return None
    repo = Path(top.strip()).resolve()
    status = git(["status", "--porcelain", "--untracked-files=all", "--", str(root)], repo)
    tracked = git(["ls-files", "--", str(root)], repo)
    if status is None or status.strip() or tracked is None:
        return None
    tracked_set = set(tracked.split("\n"))
    prefix = root.relative_to(repo)
    if not all((prefix / rel).as_posix() in tracked_set for rel in rels):
        return None
    return repo


def parse_protect(root: Path, entries: list[str]) -> list[tuple[str, Path, str | None]]:
    out = []
    for entry in entries:
        path_part, _, heading = entry.partition("#")
        target = (root / Path(path_part).expanduser()).resolve()
        try:
            rel = target.relative_to(root)
        except ValueError:
            raise CutPlanError(f"--protect path is outside the skill folder: {entry}") from None
        out.append((entry, rel, heading.strip() or None))
    return out


def is_under(rel: Path, protect: Path) -> bool:
    return rel == protect or protect in rel.parents


def percent_cut(before: int, after: int) -> int:
    return round((before - after) * 100 / before) if before else 0


def auto_protected(root: Path, rel: Path, text: str) -> bool:
    if rel == Path("SKILL.md"):
        return RENDER_CALL in text
    if rel == Path("customize.toml"):
        return re.search(r"^\[agent\]", text, re.MULTILINE) is not None
    return False


def plan(root: Path, protect: list[str], floor: int, out: Path | None = None) -> dict:
    protects = parse_protect(root, protect)
    paths = prompt_files(root)
    rels = [p.relative_to(root) for p in paths]
    texts = {p.relative_to(root): read_text(p) for p in iter_text_files(root)}

    matched = set()
    files = []
    method = "tiktoken"
    for rel in rels:
        text = texts[rel]
        tokens, used = tokens_of(text)
        if used == "fallback":
            method = "fallback"
        is_protected = auto_protected(root, rel, text)
        sections = {}
        for entry, prel, heading in protects:
            if heading is None and is_under(rel, prel):
                is_protected = True
                matched.add(entry)
            elif heading is not None and rel == prel:
                found = section(text, heading)
                if found is None:
                    raise CutPlanError(f"--protect section not found: {entry}")
                sections[heading] = found
                matched.add(entry)

        names: list[str] = []
        if rel.suffix == ".md":
            headings, labels = own_names(text)
            names = headings + [label for label in labels if named_elsewhere(label, rel, texts)]
        files.append(
            {
                "path": rel.as_posix(),
                "tokens": tokens,
                "cut": not is_protected and tokens >= floor,
                "protected": is_protected,
                "old_command": None,
                "names": names,
                **invariants(text),
                "sections": sections,
            }
        )

    unmatched = [entry for entry, _, _ in protects if entry not in matched]
    if unmatched:
        raise CutPlanError(f"--protect matches no prompt file: {', '.join(unmatched)}")

    before_source = "none"
    repo = committed_repo(root, rels)
    if repo:
        before_source = "git"
        prefix = root.relative_to(repo)
        for f in files:
            f["old_command"] = (
                f"git -C {shlex.quote(str(repo))} show HEAD:{shlex.quote((prefix / f['path']).as_posix())}"
            )
    elif out is not None:
        before_source = "copy"
        copy = out.parent / (out.stem.removesuffix("-plan") + "-before")
        if copy.exists():
            raise CutPlanError(f"before-copy already exists: {copy}")
        shutil.copytree(root, copy, ignore=shutil.ignore_patterns(*SKIP_DIRS))
        for f in files:
            f["old_command"] = f"cat {shlex.quote(str(copy / f['path']))}"

    return {
        "files": files,
        "total": sum(f["tokens"] for f in files),
        "floor": floor,
        "method": method,
        "before_source": before_source,
    }


def load_baseline(path: Path) -> dict:
    if not path.is_file():
        raise CutPlanError(f"baseline not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        for f in data["files"]:
            str(f["path"]), int(f["tokens"])
    except (json.JSONDecodeError, UnicodeDecodeError, KeyError, TypeError, ValueError):
        raise CutPlanError(f"not a cut_plan baseline: {path}") from None
    return data


def lost_items(entry: dict, text: str, rel: str) -> dict:
    now = invariants(text)
    names_now = {n for group in own_names(text) for n in group} if rel.endswith(".md") else set()
    return {
        "names": [n for n in entry.get("names", []) if n not in names_now],
        "jinja": list((Counter(entry.get("jinja", [])) - Counter(now["jinja"])).elements()),
        "root_paths": [p for p in entry.get("root_paths", []) if p not in now["root_paths"]],
        "sections": [h for h, s in entry.get("sections", {}).items() if s not in text],
    }


def measure(root: Path, baseline: dict) -> dict:
    files = []
    method = baseline.get("method")
    for entry in baseline["files"]:
        rel, before = entry["path"], int(entry["tokens"])
        path = root / rel
        missing = not path.is_file()
        after = 0
        lost = {"names": [], "jinja": [], "root_paths": [], "sections": []}
        if not missing:
            text = read_text(path)
            after, used = tokens_of(text)
            if method and used != method and text:
                raise CutPlanError(
                    f"baseline was counted with {method}, this run counts with {used}; run both with uv run"
                )
            lost = lost_items(entry, text, rel)
        files.append(
            {
                "path": rel,
                "before": before,
                "after": after,
                "percent": percent_cut(before, after),
                "missing": missing,
                "lost": lost,
            }
        )
    before = sum(f["before"] for f in files)
    after = sum(f["after"] for f in files)
    return {
        "files": files,
        "before": before,
        "after": after,
        "percent": percent_cut(before, after),
        "missing": [f["path"] for f in files if f["missing"]],
        "lost": [f["path"] for f in files if any(f["lost"].values())],
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="command", required=True)

    pp = sub.add_parser("plan", help="count prompt files and record the baseline measure checks against")
    pp.add_argument("skill", type=Path, help="skill folder")
    pp.add_argument(
        "--protect", action="append", default=[], help="file or folder, or file#heading for one section; repeatable"
    )
    pp.add_argument(
        "--floor", type=int, default=DEFAULT_FLOOR, help=f"skip files under this many tokens (default {DEFAULT_FLOOR})"
    )
    pp.add_argument("--out", type=Path, help="also write the plan here, as the baseline for measure")

    mp = sub.add_parser("measure", help="re-count the files a baseline lists and report what they lost")
    mp.add_argument("skill", type=Path, help="skill folder")
    mp.add_argument("--baseline", type=Path, required=True, help="JSON written by plan --out")

    args = p.parse_args(argv)
    root = args.skill.expanduser().resolve()
    if not root.is_dir():
        p.error(f"not a directory: {args.skill}")

    try:
        if args.command == "plan":
            if args.floor < 0:
                p.error("--floor must be 0 or more")
            out = args.out.expanduser().resolve() if args.out else None
            result = plan(root, args.protect, args.floor, out)
        else:
            result = measure(root, load_baseline(args.baseline.expanduser()))
    except CutPlanError as exc:
        p.error(str(exc))

    text = json.dumps(result, indent=2)
    if args.command == "plan" and args.out:
        out = args.out.expanduser()
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(text + "\n", encoding="utf-8")
    print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
