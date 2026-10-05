#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""scan_paths: lint a skill's Markdown files for path conventions.

Rules, each a `rule` value in the findings:
  bare-script-call   `uv run scripts/x.py` or `uv run ./scripts/x.py`; a skill's own scripts run as
                     `uv run {skill-root}/scripts/x.py` because the agent's working directory is the project
  installed-path     `{installed_path}` or an `installed_path` definition, a pre-skill leftover
  absolute-path      /Users/, /home/, C:\\ or ~/ paths, which do not travel between machines
  cross-skill-ref    a path into another skill's folder (skills/<other>/..., .claude/skills/<other>/..., or
                     a ../ path that leaves this skill); to use another skill, invoke it by name
  missing-file       a backticked skill-relative path (`references/x.md`) that does not exist from the file's
                     folder or the skill root, when its first folder does exist (otherwise it is prose);
                     files under assets/ and files named sample-* are not checked, they describe emitted output
  old-module-format  a `module.yaml` or `module-help.csv` mention; modules are described by bmod.toml now
  python-call        `python x.py`, `python3 -m x` or `pip install`; every script runs as `uv run <path>`,
                     which reads the script's PEP 723 header for its dependencies

Fenced code blocks are checked for bare-script-call, installed-path, absolute-path, old-module-format and python-call
(a wrong example teaches the wrong call) and skipped for the two reference-resolution rules.

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
import json
import re
import sys
from pathlib import Path

SKIP_DIRS = {".git", "__pycache__", "node_modules", ".venv", "venv"}
EXAMPLE_DIR = "assets"
EXAMPLE_PREFIX = "sample-"

BARE_SCRIPT_RE = re.compile(r"\buv\s+run\b[^`\n]*?\s(?:\./)?scripts/\S+")
INSTALLED_PATH_RE = re.compile(r"\{installed_path\}|\binstalled_path\s*[:=]")
ABS_PATH_RE = re.compile(r"(?:/Users/|/home/|\b[A-Za-z]:[\\/]|(?<![\w.])~/)\S*")
OLD_FORMAT_RE = re.compile(r"\bmodule\.yaml\b|\bmodule-help\.csv\b")
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
}
BMAD_RUNTIME_DIRS = {"scripts", "config", "custom", "memory", "render", "_config", "knowledge"}


def finding(path: str, line: int, rule: str, text: str, fix: str) -> dict:
    return {"path": path, "line": line, "rule": rule, "text": text.strip()[:200], "fix": fix}


def blank_fences(content: str) -> str:
    """Blank fenced code blocks but keep their newlines so line numbers stay aligned."""
    return re.sub(r"```.*?```", lambda m: re.sub(r"[^\n]", "", m.group(0)), content, flags=re.DOTALL)


def line_of(content: str, offset: int) -> int:
    return content.count("\n", 0, offset) + 1


def iter_md_files(skill_root: Path):
    for path in sorted(skill_root.rglob("*.md")):
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
            findings.append(finding(rel, line_of(content, match.start()), rule, match.group(0), fix))
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
        roots = [file_dir, skill_root]
        if any((root / raw).exists() for root in roots):
            continue
        first_dir = raw.split("/")[0]
        if any((root / first_dir).is_dir() for root in roots):
            findings.append(
                finding(rel.as_posix(), line, "missing-file", raw, "fix the path or remove the dead reference")
            )
    return findings


def scan_skill(skill_root: Path, allow: tuple[str, ...] = ()) -> dict:
    findings: list[dict] = []
    count = 0
    for path in iter_md_files(skill_root):
        count += 1
        rel = path.relative_to(skill_root)
        content = path.read_text(encoding="utf-8", errors="replace")
        findings.extend(scan_regex_rules(content, rel.as_posix()))
        findings.extend(scan_references(content, rel, skill_root))
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
