#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""scan_paths: lint a skill's Markdown files and customize.toml, and its eval JSON for absolute paths, for path conventions.

Rules, each a `rule` value in the findings:
  bare-script-call   `uv run scripts/x.py` or `uv run ./scripts/x.py`; a skill's own scripts run as
                     `uv run {skill-root}/scripts/x.py` because the agent's working directory is the project
  installed-path     `{installed_path}` or an `installed_path` definition, a pre-skill leftover
  absolute-path      /Users/, /home/ or C:\\ paths, which do not travel between machines; a `~/` path names the
                     user's own home and is allowed (eval cases refuse it, see below)
  cross-skill-ref    a path into another skill's folder (skills/<other>/..., .claude/skills/<other>/..., or
                     a ../ path that leaves this skill); to use another skill, invoke it by name
  missing-file       a backticked bare path (`references/x.md`) that does not exist from the skill root, when its
                     first folder exists from the skill root or the file's folder (otherwise it is prose); one
                     that exists only from the file's folder is reported with its skill-root form; or a
                     `{skill-root}/...` path, backticked or not and inside `uv run` command lines and fences too,
                     that does not exist under the skill root. Paths holding a placeholder (`<`, `*`, `{`, `[`)
                     are not resolved. Files under assets/ and files named sample-* are not checked, they
                     describe emitted output
  old-module-format  a `module.yaml` or `module-help.csv` mention, unless the same line calls the format old or
                     forbids the file: old, legacy or v6 right before "format", "module" or the filename
                     ("old format", "old-format module", "legacy module.yaml"), the filename right before one
                     ("`module.yaml` (the v6 format)"), or never right before the filename, a verb allowed
                     between ("never write `module.yaml`"); modules are described by bmod.toml now
  python-call        `python x.py`, `python3 -m x` or `pip install`; every script runs as `uv run <path>`,
                     which reads the script's PEP 723 header for its dependencies
  retired-skill      a skill name an installed module retired, read from the `retired.toml` files beside the target and
                     beside this script (and one level up from a skills/<module>/ folder) (`renamed` gives the successor
                     as the fix); a line that says retired, renamed, removed, deprecated, shim or
                     formerly is describing it and is skipped

Fenced code blocks are checked for bare-script-call, installed-path, absolute-path, old-module-format, python-call
and `{skill-root}/...` paths (a wrong example teaches the wrong call), and skipped for backticked bare paths.
The root customize.toml gets the same rules as a Markdown file, with its comment lines left out.

Usage:
  scan_paths.py <skill-folder> [--allow RULE ...]

--allow suppresses a rule by name, for a skill that documents the old format on purpose
(`--allow old-module-format`).

Output, one JSON object on stdout:
  {"skill": str, "files_scanned": int, "findings": [{"path", "line", "rule", "text", "fix"}, ...]}
Exit 0 when clean, 1 when there are findings, 2 on a usage error.
"""

from __future__ import annotations

import argparse
import itertools
import json
import os
import re
import sys
import tomllib
from pathlib import Path, PurePosixPath, PureWindowsPath

SKIP_DIRS = {".git", "__pycache__", "node_modules", ".venv", "venv"}
EXAMPLE_DIR = "assets"
EXAMPLE_PREFIX = "sample-"

BARE_SCRIPT_RE = re.compile(r"\buv\s+run\b[^`\n]*?\s(?:\./)?scripts/\S+")
INSTALLED_PATH_RE = re.compile(r"\{installed_path\}|\binstalled_path\s*[:=]")
ABS_PATH_RE = re.compile(r"(?:/Users/|/home/|\b[A-Za-z]:[\\/])\S*")
OLD_FORMAT_RE = re.compile(r"\bmodule\.yaml\b|\bmodule-help\.csv\b")
# A line that calls the format old, or forbids the file, describes it rather than using it. The context word
# must touch the format or the filename: "legacy config values > `module.yaml`" is still a real use.
_OLD_FILE = r"`?[\w./{}-]*?\b(?:module\.yaml|module-help\.csv)\b`?"
OLD_FORMAT_CONTEXT_RE = re.compile(
    r"\b(?:old|legacy|v6)[\s-]+(?:module[\s-]+)?(?:format|module)\b"
    rf"|\b(?:old|legacy|v6)\s+{_OLD_FILE}"
    rf"|\bnever\s+(?:[a-z]+\s+)?{_OLD_FILE}"
    rf"|{_OLD_FILE}\s*\(?(?:is\s+|are\s+)?(?:the\s+)?(?:old|legacy|v6)\b",
    re.IGNORECASE,
)
SKILL_ROOT_PATH_RE = re.compile(r"\{skill-root\}/([^\s`'\"(),;|#]*)")
PLACEHOLDER_CHARS = "<*{["
PYTHON_CALL_RE = re.compile(r"(?<![\w/.-])(?:python3?|pip3?)\s+(?:-m\s+\S+|\S+\.py\b|install\b)")
BACKTICK_REF_RE = re.compile(r"`([^`\s]+/[^`\s]+\.(?:md|yaml|yml|toml|json|csv|txt|xml|py|html))`")
SKILL_DIR_RE = re.compile(r"(?:^|/)(?:skills|\.claude/skills|\.agents/skills|_bmad)/([a-z0-9][a-z0-9-]*)/")
# Runtime folders under _bmad that are not skills.
RULES = {
    "bare-script-call",
    "installed-path",
    "absolute-path",
    "cross-skill-ref",
    "missing-file",
    "old-module-format",
    "python-call",
    "retired-skill",
}
BMAD_RUNTIME_DIRS = {"scripts", "config", "custom", "memory", "render", "_config", "knowledge"}


def finding(path: str, line: int, rule: str, text: str, fix: str) -> dict:
    return {"path": path, "line": line, "rule": rule, "text": text.strip()[:200], "fix": fix}


def blank_fences(content: str) -> str:
    """Blank fenced code blocks but keep their newlines so line numbers stay aligned."""
    return re.sub(r"```.*?```", lambda m: re.sub(r"[^\n]", "", m.group(0)), content, flags=re.DOTALL)


def line_of(content: str, offset: int) -> int:
    return content.count("\n", 0, offset) + 1


def strip_comments(content: str) -> str:
    """Blank TOML comment lines, keeping line numbers."""
    return "\n".join("" if line.lstrip().startswith("#") else line for line in content.split("\n"))


def iter_md_files(skill_root: Path):
    for path in sorted(skill_root.rglob("*.md"), key=lambda p: p.as_posix()):
        parts = path.relative_to(skill_root).parts
        if any(part in SKIP_DIRS or part.startswith(".") for part in parts):
            continue
        yield path


def is_example(rel: Path) -> bool:
    return EXAMPLE_DIR in rel.parts[:-1] or rel.name.startswith(EXAMPLE_PREFIX)


def scan_regex_rules(content: str, rel: str) -> list[dict]:
    findings = []
    for regex, rule, fix in (
        (BARE_SCRIPT_RE, "bare-script-call", "write `uv run {skill-root}/scripts/<name>.py`"),
        (INSTALLED_PATH_RE, "installed-path", "remove installed_path; use a path relative to this file"),
        (ABS_PATH_RE, "absolute-path", "use {project-root}, {skill-root} or a config value"),
        (OLD_FORMAT_RE, "old-module-format", "describe the module in bmod.toml; see the migrate mode"),
        (
            PYTHON_CALL_RE,
            "python-call",
            "run it as `uv run <path>`; dependencies come from the script's PEP 723 header",
        ),
    ):
        for match in regex.finditer(content):
            if rule == "old-module-format" and OLD_FORMAT_CONTEXT_RE.search(clause_text(content, match.start())):
                continue
            findings.append(finding(rel, line_of(content, match.start()), rule, match.group(0), fix))
    return findings


def clause_text(content: str, offset: int) -> str:
    """The clause of the line around offset, cut at `;` and at sentence ends, so context words in one clause
    do not excuse a filename in the next."""
    line = line_text(content, offset)
    at = offset - (content.rfind("\n", 0, offset) + 1)
    bounds = [0, *(m.end() for m in re.finditer(r";\s*|[.!?]\s+(?=[A-Z`])", line)), len(line)]
    for start, end in itertools.pairwise(bounds):
        if start <= at < end:
            return line[start:end]
    return line


def line_text(content: str, offset: int) -> str:
    start = content.rfind("\n", 0, offset) + 1
    end = content.find("\n", offset)
    return content[start : end if end != -1 else len(content)]


def scan_skill_root_paths(content: str, rel: Path, skill_root: Path) -> list[dict]:
    """`{skill-root}/...` paths anywhere, fences and command lines included, resolved against the skill root."""
    findings = []
    if is_example(rel):
        return findings
    root = skill_root.resolve()
    for match in SKILL_ROOT_PATH_RE.finditer(content):
        raw = match.group(1).rstrip(".:")
        if not raw or any(ch in raw for ch in PLACEHOLDER_CHARS):
            continue
        line = line_of(content, match.start())
        target = (root / raw).resolve()
        if root not in target.parents and target != root:
            findings.append(
                finding(rel.as_posix(), line, "cross-skill-ref", match.group(0), "a skill's files stay inside it")
            )
        elif not target.exists():
            findings.append(
                finding(
                    rel.as_posix(), line, "missing-file", match.group(0), "fix the path or remove the dead reference"
                )
            )
    return findings


def scan_references(content: str, rel: Path, skill_root: Path) -> list[dict]:
    findings = []
    stripped = blank_fences(content)
    skill_name = skill_root.name
    file_dir = (skill_root / rel).parent
    for match in BACKTICK_REF_RE.finditer(stripped):
        raw = match.group(1)
        line = line_of(stripped, match.start())
        other = SKILL_DIR_RE.search(raw)
        if other and other.group(1) != skill_name and other.group(1) not in BMAD_RUNTIME_DIRS:
            findings.append(
                finding(
                    rel.as_posix(),
                    line,
                    "cross-skill-ref",
                    raw,
                    f'do not reach into `{other.group(1)}`; write "invoke the `{other.group(1)}` skill"',
                )
            )
            continue
        if any(ch in raw for ch in "*<{"):
            continue
        if raw.startswith("../"):
            target = (file_dir / raw).resolve()
            if skill_root.resolve() not in target.parents and target != skill_root.resolve():
                findings.append(finding(rel.as_posix(), line, "cross-skill-ref", raw, "a skill's files stay inside it"))
            continue
        if raw.startswith(("/", "./", "_bmad/", "@")) or is_example(rel):
            continue
        if (skill_root / raw).exists():
            continue
        if (file_dir / raw).exists():
            # Lexical, not resolved: a symlinked folder may point outside the skill.
            from_root = Path(os.path.relpath(os.path.normpath(file_dir / raw), os.path.normpath(skill_root))).as_posix()
            findings.append(
                finding(
                    rel.as_posix(), line, "missing-file", raw, f"bare paths resolve from the skill root: `{from_root}`"
                )
            )
            continue
        roots = [file_dir, skill_root]
        first_dir = raw.split("/")[0]
        if any((root / first_dir).is_dir() for root in roots):
            findings.append(
                finding(rel.as_posix(), line, "missing-file", raw, "fix the path or remove the dead reference")
            )
    return findings


RETIRED_CONTEXT_RE = re.compile(
    r"\b(?:retired|renamed|removed|deprecated|shim|formerly|was called|replaced by)\b", re.IGNORECASE
)


def own_module_skills(skill_root: Path) -> set[str]:
    """The skills the target's own module ships, from its record's [bmod] skills list: the target's own
    bmod.toml for a record, else the record its [skill] names, beside it or one folder up."""

    def load(path: Path) -> dict:
        try:
            return tomllib.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, tomllib.TOMLDecodeError):
            return {}

    data = load(skill_root / "bmod.toml")
    bmod, skill = data.get("bmod"), data.get("skill")
    if not (isinstance(bmod, dict) and bmod.get("skills")) and isinstance(skill, dict) and skill.get("bmod"):
        for folder in (skill_root.parent, skill_root.parent.parent):
            record = load(folder / str(skill["bmod"]) / "bmod.toml").get("bmod")
            if isinstance(record, dict):
                bmod = record
                break
    listed = bmod.get("skills") if isinstance(bmod, dict) else None
    return {str(n) for n in listed} if isinstance(listed, list) else set()


def retired_names(skill_root: Path) -> dict[str, str]:
    """Retired skill name -> fix, from the retired.toml of every module record in the skills folders that hold
    the target skill and this script's own skill (the folders where installed modules sit side by side)."""
    # A skill's parent holds its sibling skills; the folder above counts only when it is a `skills/` folder
    # grouping modules (skills/<module>/<skill>), never a shared temp or home folder.
    roots = set()
    for base in (skill_root.resolve(), Path(__file__).resolve().parents[1]):
        roots.add(base.parent)
        if base.parent.parent.name == "skills":
            roots.add(base.parent.parent)
    names: dict[str, str] = {}
    for root in sorted(roots, key=lambda p: p.as_posix()):
        records = sorted([*root.glob("*/retired.toml"), *root.glob("*/*/retired.toml")], key=lambda p: p.as_posix())
        for record in records:
            try:
                data = tomllib.loads(record.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, tomllib.TOMLDecodeError):
                continue
            for entry in data.get("renamed") or []:
                if isinstance(entry, dict) and entry.get("from") and entry.get("to"):
                    names.setdefault(str(entry["from"]), f"renamed: use `{entry['to']}`")
            for name in data.get("removed") or []:
                names.setdefault(str(name), "retired with no successor: remove the reference")
    # A module never flags a skill it still ships, even when a newer module retired that name.
    for name in {skill_root.name, *own_module_skills(skill_root)}:
        names.pop(name, None)
    return names


def scan_retired(content: str, rel: str, retired: dict[str, str]) -> list[dict]:
    if not retired:
        return []
    alternatives = "|".join(map(re.escape, sorted(retired, key=len, reverse=True)))
    pattern = re.compile(rf"(?<![\w-])({alternatives})(?![\w-])")
    findings = []
    for match in pattern.finditer(content):
        if RETIRED_CONTEXT_RE.search(line_text(content, match.start())):
            continue
        name = match.group(1)
        findings.append(finding(rel, line_of(content, match.start()), "retired-skill", name, retired[name]))
    return findings


def eval_files(skill_root: Path) -> list[tuple[Path, str]]:
    """The skill's eval JSON in `evals/<name>/` at the root holding it, and in its own `evals/`."""
    found = [(p, p.relative_to(skill_root).as_posix()) for p in (skill_root / "evals").glob("*.json")]
    for folder in skill_root.resolve().parents:
        if (folder / ".git").exists() or (folder / "_bmad").is_dir():
            found += [
                (p, p.relative_to(folder).as_posix()) for p in (folder / "evals" / skill_root.name).glob("*.json")
            ]
            break
    return sorted(found, key=lambda item: item[1])


def scan_skill(skill_root: Path, allow: tuple[str, ...] = ()) -> dict:
    findings: list[dict] = []
    count = 0
    retired = retired_names(skill_root)
    for path in iter_md_files(skill_root):
        count += 1
        rel = path.relative_to(skill_root)
        content = path.read_text(encoding="utf-8", errors="replace")
        findings.extend(scan_regex_rules(content, rel.as_posix()))
        findings.extend(scan_references(content, rel, skill_root))
        findings.extend(scan_skill_root_paths(content, rel, skill_root))
        findings.extend(scan_retired(content, rel.as_posix(), retired))
    customize = skill_root / "customize.toml"
    if customize.is_file():
        count += 1
        rel = Path("customize.toml")
        content = strip_comments(customize.read_text(encoding="utf-8", errors="replace"))
        findings.extend(scan_regex_rules(content, rel.as_posix()))
        findings.extend(scan_references(content, rel, skill_root))
        findings.extend(scan_skill_root_paths(content, rel, skill_root))
        findings.extend(scan_retired(content, rel.as_posix(), retired))
    # Eval cases name fixtures; an absolute path there breaks the run for everyone else.
    for path, rel in eval_files(skill_root):
        count += 1
        content = path.read_text(encoding="utf-8", errors="replace")
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            continue
        cases = data.get("cases", []) if isinstance(data, dict) else data
        entries = [str(f) for c in cases if isinstance(c, dict) for f in c.get("files") or []]
        for entry in entries:
            # The same test the eval runner applies: any absolute or home path is refused there.
            if "://" in entry or not (
                entry.startswith("~") or PurePosixPath(entry).is_absolute() or PureWindowsPath(entry).is_absolute()
            ):
                continue
            findings.append(
                finding(
                    rel,
                    line_of(content, max(content.find(json.dumps(entry)), 0)),
                    "absolute-path",
                    entry,
                    "use a path relative to the cases file or the project root, or a GitHub file URL pinned to a commit",
                )
            )
    findings = [f for f in findings if f["rule"] not in allow]
    findings.sort(key=lambda f: (f["path"], f["line"], f["rule"]))
    return {"skill": skill_root.name, "files_scanned": count, "findings": findings}


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("skill", type=Path, help="skill folder to scan")
    p.add_argument("--allow", action="append", default=[], metavar="RULE", help="suppress a rule by name (repeatable)")
    args = p.parse_args(argv)
    if not args.skill.is_dir():
        p.error(f"not a directory: {args.skill}")
    unknown = sorted(set(args.allow) - RULES)
    if unknown:
        p.error(f"unknown rule(s): {', '.join(unknown)}; rules: {', '.join(sorted(RULES))}")
    result = scan_skill(args.skill, tuple(args.allow))
    print(json.dumps(result, indent=2))
    return 1 if result["findings"] else 0


if __name__ == "__main__":
    sys.exit(main())
