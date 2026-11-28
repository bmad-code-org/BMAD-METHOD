#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""Deterministic Skill Validator

Validates 13 deterministic rules across skill directories.
Acts as a fast first-pass complement to the inference-based skill validator.

What it checks:
- SKILL-01: SKILL.md exists
- SKILL-02: SKILL.md frontmatter has name
- SKILL-03: SKILL.md frontmatter has description
- SKILL-04: name format (lowercase, hyphens, no forbidden substrings; `bmod-` for a module record)
- SKILL-05: name matches directory basename
- SKILL-06: description quality (length, "Use when"/"Use if"; the fixed text for a module record)
- SKILL-07: SKILL.md has body content after frontmatter
- SKILL-08: SKILL.md frontmatter parses as a YAML mapping with string name and description
- PATH-02: no installed_path variable
- PATH-06: script calls use {skill-root}, not a bare scripts/ path
- PATH-07: {project-root} and {skill-root} arguments in uv run calls are double-quoted
- SEQ-02: no time estimates
- TPL-01: template files must not contain render-time {{ config.* }} / {{ workflow.* }} / {{ agent.* }} expressions

Usage:
  uv run --python 3.11 tools/validate_skills.py                    # All skills, human-readable
  uv run --python 3.11 tools/validate_skills.py path/to/skill-dir  # Single skill
  uv run --python 3.11 tools/validate_skills.py --strict           # Exit 1 on HIGH+ findings
  uv run --python 3.11 tools/validate_skills.py --json             # JSON output
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tomllib

sys.dont_write_bytecode = True

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(PROJECT_ROOT, "skills")
sys.path.insert(0, os.path.join(SRC_DIR, "core-tools", "bmad", "scripts"))
import frontmatter  # noqa: E402

# JS RegExp#toString() forms — Python's re.Pattern repr is not load-bearing for messages.
NAME_REGEX_DISPLAY = r"/^(?:bmad|bmad-[a-z0-9]+(?:-[a-z0-9]+)*)$/"

NAME_REGEX = re.compile(r"^(?:bmad|bmad-[a-z0-9]+(?:-[a-z0-9]+)*)$")
# A module record: a folder whose bmod.toml has [bmod] and no [skill]. Nobody runs it.
RECORD_NAME_REGEX_DISPLAY = r"/^bmod-[a-z0-9]+(?:-[a-z0-9]+)*$/"
RECORD_NAME_REGEX = re.compile(r"^bmod-[a-z0-9]+(?:-[a-z0-9]+)*$")
RECORD_DESCRIPTION = "Required bmod metadata. Never invoke this skill."
TIME_ESTIMATE_PATTERNS = [
    re.compile(r"takes?\s+\d+\s*min", re.I),
    re.compile(r"~\s*\d+\s*min", re.I),
    re.compile(r"estimated\s+time", re.I),
    re.compile(r"\bETA\b"),
]
TEMPLATE_FILENAME_REGEX = re.compile(r"template", re.I)
COMPILE_TIME_SUB_REGEX = re.compile(r"\{\{-?\s*(?:(?:config|workflow|agent)\.|initiative_folder\b)[^}]*\}\}")
INSTALLED_PATH_RE = re.compile(r"installed_path", re.I)
BARE_SCRIPT_RE = re.compile(r"\buv\s+run\b[^`]*?\s(?:\./)?scripts/")
UV_RUN_RE = re.compile(r"\buv\s+run\b")
ROOT_ANCHOR_RE = re.compile(r"\{(?:project-root|skill-root)\}")
CODE_FENCE_RE = re.compile(
    r"^[ \t]*(?P<fence>(?P<fence_char>`|~)(?P=fence_char){2,})(?P<info>[^\r\n]*)\r?\n(?P<body>.*?)^[ \t]*(?P=fence)(?P=fence_char)*[ \t]*(?:\r?\n|\Z)",
    re.MULTILINE | re.DOTALL,
)
INLINE_CODE_RE = re.compile(r"`([^`\r\n]+)`")
SHELL_FENCE_LANGS = {"", "bash", "sh", "zsh", "shell", "console", "pwsh", "powershell", "cmd"}
USE_WHEN_RE = re.compile(r"use\s+when\b", re.I)
USE_IF_RE = re.compile(r"use\s+if\b", re.I)
DEPRECATED_RE = re.compile(r"^\s*deprecated\b", re.I)

SKIP_DIRS = {"node_modules", ".git"}
SCAN_EXTENSIONS = {".md", ".yaml", ".yml"}

SEVERITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}


# --- Output Escaping ---


def escape_annotation(s: str) -> str:
    return s.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")


def escape_table_cell(s: str) -> str:
    return str(s).replace("|", "\\|")


def _relpath(to_path: str, start: str) -> str:
    # A reported path is a repo path: "/" on every platform.
    rel = os.path.relpath(to_path, start).replace(os.sep, "/")
    return "" if rel == "." else rel


def _finding(
    rule: str,
    title: str,
    severity: str,
    file: str,
    detail: str,
    fix: str,
    line: int | None = None,
) -> dict:
    item = {
        "rule": rule,
        "title": title,
        "severity": severity,
        "file": file,
        "detail": detail,
        "fix": fix,
    }
    if line is not None:
        item["line"] = line
    return item


# --- Frontmatter Parsing ---


def frontmatter_fields(content: str) -> dict:
    """The frontmatter's fields as text, or {} when there are none or they are not YAML."""
    try:
        return frontmatter.load(frontmatter.split(content)[0])
    except ValueError:
        return {}


def skill_frontmatter(content: str) -> tuple[dict | None, tuple[str, int | None] | None]:
    """Read SKILL.md frontmatter as the skills CLI and agents do. Return (fields, (detail, line) or None).

    Fields are typed, an absent value as ""; they are {} with no frontmatter block, which is left to SKILL-02
    and SKILL-03, and None when the block is not a YAML mapping."""
    try:
        block = frontmatter.split(content)[0]
    except ValueError:
        return {}, None
    try:
        fields = frontmatter.load(block, typed=True)
    except ValueError as error:
        cause = error.__cause__
        if cause is None:
            return None, ("Frontmatter must be a YAML mapping.", None)
        mark = getattr(cause, "problem_mark", None)
        line = mark.line + 2 if mark is not None else None  # the block starts on the line after `---`
        problem = getattr(cause, "problem", None) or str(cause).splitlines()[0]
        return None, (f"Frontmatter is not valid YAML: {problem}.", line)
    fields = {key: "" if value is None else value for key, value in fields.items()}
    for key in ("name", "description"):  # a block scalar's final newline is not part of it
        if isinstance(fields.get(key), str):
            fields[key] = fields[key].rstrip("\n")
    for key in ("name", "description"):
        value = fields.get(key, "")
        if not isinstance(value, str):
            return fields, (f"Frontmatter `{key}` must be a string, got {type(value).__name__}.", None)
    return fields, None


# --- Safe File Reading ---


def safe_read_file(file_path: str, findings: list[dict], rel_file: str | None) -> str | None:
    try:
        with open(file_path, encoding="utf-8-sig", errors="replace", newline="") as f:
            return f.read()
    except OSError as error:
        findings.append(
            _finding(
                "READ-ERR",
                "File Read Error",
                "MEDIUM",
                rel_file or os.path.basename(file_path),
                f"Cannot read file: {error}",
                "Check file permissions and ensure the file exists.",
            )
        )
        return None


# --- Code Block Stripping ---


def _blank(match: re.Match[str]) -> str:
    return re.sub(r"[^\r\n]", " ", match.group(0))


def strip_code_blocks(content: str) -> str:
    return re.sub(r"```.*?```", _blank, content, flags=re.DOTALL)


def _is_double_quoted(text: str) -> bool:
    if len(text) < 2 or not (text.startswith('"') and text.endswith('"')):
        return False
    i = 1
    end = len(text) - 1
    while i < end:
        if text[i] == "\\" and i + 1 < end:
            i += 2
            continue
        if text[i] == '"':
            return False
        i += 1
    return True


def _is_quoted_root_arg(token: str) -> bool:
    if _is_double_quoted(token):
        return True
    if "=" in token:
        key, val = token.split("=", 1)
        if not ROOT_ANCHOR_RE.search(key) and _is_double_quoted(val):
            return True
    return False


def _unquoted_root_tokens(cmd: str) -> list[tuple[int, str]]:
    """Return (offset, token) for each {project-root}/{skill-root} token in a uv run command not double-quoted."""
    bad: list[tuple[int, str]] = []
    n = len(cmd)
    i = 0
    while i < n:
        ch = cmd[i]
        if ch in " \t\r\n|;&()[]<>":
            i += 1
            continue
        if ch == "\\" and i + 1 < n and cmd[i + 1] in "\r\n":
            i += 2
            if i < n and cmd[i - 1] == "\r" and cmd[i] == "\n":
                i += 1
            continue
        if ch == "#":
            while i < n and cmd[i] != "\n":
                i += 1
            continue
        start = i
        in_double = False
        in_single = False
        while i < n:
            c = cmd[i]
            if in_double:
                if c == "\\" and i + 1 < n:
                    i += 2
                elif c == '"':
                    in_double = False
                    i += 1
                else:
                    i += 1
            elif in_single:
                if c == "'":
                    in_single = False
                i += 1
            else:
                if c == '"':
                    in_double = True
                    i += 1
                elif c == "'":
                    in_single = True
                    i += 1
                elif c == "\\" and i + 1 < n:
                    if cmd[i + 1] in "\r\n":
                        break
                    i += 2
                elif c in " \t\r\n|;&()[]<>":
                    break
                else:
                    i += 1
        tok = cmd[start:i]
        if ROOT_ANCHOR_RE.search(tok) and not _is_quoted_root_arg(tok):
            bad.append((start, tok))
    return bad


def find_unquoted_root_in_uv_run(content: str) -> list[tuple[int, str]]:
    """Return (1-based line, token) for unquoted {project-root}/{skill-root} arguments in uv run commands."""
    hits: list[tuple[int, str]] = []

    def check_span(span: str, base_offset: int) -> None:
        if not UV_RUN_RE.search(span) or not ROOT_ANCHOR_RE.search(span):
            return
        for local_offset, tok in _unquoted_root_tokens(span):
            line = content.count("\n", 0, base_offset + local_offset) + 1
            hits.append((line, tok))

    def scan_non_fenced(segment: str, base_offset: int) -> None:
        for im in INLINE_CODE_RE.finditer(segment):
            check_span(im.group(1), base_offset + im.start(1))
        blanked = INLINE_CODE_RE.sub(_blank, segment)
        pos = 0
        for line in blanked.splitlines(keepends=True):
            if UV_RUN_RE.search(line):
                check_span(line, base_offset + pos)
            pos += len(line)

    pos = 0
    for fm in CODE_FENCE_RE.finditer(content):
        scan_non_fenced(content[pos : fm.start()], pos)
        info_tokens = fm.group("info").strip().split()
        lang = info_tokens[0].lower() if info_tokens else ""
        if lang in SHELL_FENCE_LANGS:
            body = fm.group("body")
            body_offset = fm.start("body")
            lines = body.splitlines(keepends=True)
            idx = 0
            line_pos = 0
            while idx < len(lines):
                group_start = line_pos
                parts = [lines[idx]]
                line_pos += len(lines[idx])
                while parts[-1].rstrip("\r\n").endswith("\\") and idx + 1 < len(lines):
                    idx += 1
                    parts.append(lines[idx])
                    line_pos += len(lines[idx])
                check_span("".join(parts), body_offset + group_start)
                idx += 1
        pos = fm.end()
    scan_non_fenced(content[pos:], pos)
    return hits


# --- Skill Discovery ---


def discover_skill_dirs(root_dirs: list[str]) -> list[str]:
    skill_dirs: list[str] = []

    def walk(dir_path: str) -> None:
        if not os.path.exists(dir_path):
            return
        with os.scandir(dir_path) as it:
            entries = list(it)
        for entry in entries:
            if not entry.is_dir(follow_symlinks=False):
                continue
            if entry.name in SKIP_DIRS:
                continue
            full_path = entry.path
            if os.path.exists(os.path.join(full_path, "SKILL.md")):
                # A SKILL.md further down is a template the skill emits, not a skill.
                skill_dirs.append(full_path)
                continue
            walk(full_path)

    for root_dir in root_dirs:
        walk(root_dir)
    skill_dirs.sort()
    return skill_dirs


# --- File Collection ---


def collect_skill_files(skill_dir: str, findings: list[dict]) -> list[str]:
    files: list[str] = []

    def walk(current_dir: str) -> None:
        try:
            with os.scandir(current_dir) as it:
                entries = sorted(it, key=lambda e: e.name)
        except OSError as error:
            rel_file = _relpath(current_dir, skill_dir)
            findings.append(
                _finding(
                    "READ-ERR",
                    "File Read Error",
                    "MEDIUM",
                    rel_file or os.path.basename(current_dir),
                    f"Cannot read file: {error}",
                    "Check file permissions and ensure the file exists.",
                )
            )
            return
        for entry in entries:
            if entry.name in SKIP_DIRS:
                continue
            if entry.is_dir(follow_symlinks=False):
                walk(entry.path)
            elif entry.is_file(follow_symlinks=False):
                files.append(entry.path)

    walk(skill_dir)
    return files


# --- Rule Checks ---


def is_module_record(skill_dir: str) -> bool:
    try:
        with open(os.path.join(skill_dir, "bmod.toml"), "rb") as handle:
            data = tomllib.load(handle)
    except (OSError, UnicodeError, tomllib.TOMLDecodeError):
        return False
    return "bmod" in data and "skill" not in data


def validate_skill(skill_dir: str) -> list[dict]:
    findings: list[dict] = []
    dir_name = os.path.basename(skill_dir)
    skill_md_path = os.path.join(skill_dir, "SKILL.md")

    all_files = collect_skill_files(skill_dir, findings)

    if not os.path.exists(skill_md_path):
        findings.append(
            _finding(
                "SKILL-01",
                "SKILL.md Must Exist",
                "CRITICAL",
                "SKILL.md",
                "SKILL.md not found in skill directory.",
                "Create SKILL.md as the skill entrypoint.",
            )
        )
        return findings

    skill_content = safe_read_file(skill_md_path, findings, "SKILL.md")
    if skill_content is None:
        return findings
    skill_fm, yaml_error = skill_frontmatter(skill_content)
    if yaml_error is not None:
        detail, line = yaml_error
        findings.append(
            _finding(
                "SKILL-08",
                "SKILL.md Frontmatter Must Be Valid YAML",
                "CRITICAL",
                "SKILL.md",
                detail,
                "Fix the frontmatter so a YAML parser reads it: in a single-quoted value, write an apostrophe as `''`.",
                line,
            )
        )

    if skill_fm is not None and "name" not in skill_fm:
        findings.append(
            _finding(
                "SKILL-02",
                "SKILL.md Must Have name in Frontmatter",
                "CRITICAL",
                "SKILL.md",
                "Frontmatter is missing the `name` field.",
                "Add `name: <skill-name>` to the frontmatter.",
            )
        )
    elif skill_fm and skill_fm["name"] == "":
        findings.append(
            _finding(
                "SKILL-02",
                "SKILL.md Must Have name in Frontmatter",
                "CRITICAL",
                "SKILL.md",
                "Frontmatter `name` field is empty.",
                "Set `name` to the skill directory name (kebab-case).",
            )
        )

    if skill_fm is not None and "description" not in skill_fm:
        findings.append(
            _finding(
                "SKILL-03",
                "SKILL.md Must Have description in Frontmatter",
                "CRITICAL",
                "SKILL.md",
                "Frontmatter is missing the `description` field.",
                "Add `description: <what it does and when to use it>` to the frontmatter.",
            )
        )
    elif skill_fm and skill_fm["description"] == "":
        findings.append(
            _finding(
                "SKILL-03",
                "SKILL.md Must Have description in Frontmatter",
                "CRITICAL",
                "SKILL.md",
                "Frontmatter `description` field is empty.",
                "Add a description stating what the skill does and when to use it.",
            )
        )

    name = (skill_fm or {}).get("name")
    name = name if isinstance(name, str) else None
    description = (skill_fm or {}).get("description")
    description = description if isinstance(description, str) else None

    is_deprecated = bool(description and DEPRECATED_RE.search(description))
    is_record = is_module_record(skill_dir)
    name_regex = RECORD_NAME_REGEX if is_record else NAME_REGEX
    name_display = RECORD_NAME_REGEX_DISPLAY if is_record else NAME_REGEX_DISPLAY

    if name and not name_regex.search(name):
        findings.append(
            _finding(
                "SKILL-04",
                "name Format",
                "HIGH",
                "SKILL.md",
                f'name "{name}" does not match pattern: {name_display}',
                "Rename to comply with lowercase letters, numbers, and hyphens only (max 64 chars).",
            )
        )

    if name and name != dir_name:
        findings.append(
            _finding(
                "SKILL-05",
                "name Must Match Directory Name",
                "HIGH",
                "SKILL.md",
                f'name "{name}" does not match directory name "{dir_name}".',
                f'Change name to "{dir_name}" or rename the directory.',
            )
        )

    if description:
        if len(description) > 1024:
            findings.append(
                _finding(
                    "SKILL-06",
                    "description Quality",
                    "MEDIUM",
                    "SKILL.md",
                    f"description is {len(description)} characters (max 1024).",
                    "Shorten the description to 1024 characters or less.",
                )
            )

        if is_record:
            if description != RECORD_DESCRIPTION:
                findings.append(
                    _finding(
                        "SKILL-06",
                        "description Quality",
                        "MEDIUM",
                        "SKILL.md",
                        f'a module record\'s description must be exactly "{RECORD_DESCRIPTION}"',
                        "Replace the description with the fixed text.",
                    )
                )
        elif not is_deprecated and not USE_WHEN_RE.search(description) and not USE_IF_RE.search(description):
            findings.append(
                _finding(
                    "SKILL-06",
                    "description Quality",
                    "MEDIUM",
                    "SKILL.md",
                    'description does not contain "Use when" or "Use if" trigger phrase.',
                    'Append a "Use when..." clause to explain when to invoke this skill.',
                )
            )

    try:
        body = frontmatter.split(skill_content)[1]
    except ValueError as error:
        body = "" if "not terminated" in str(error) else skill_content
    if body.strip() == "":
        findings.append(
            _finding(
                "SKILL-07",
                "SKILL.md Must Have Body Content",
                "HIGH",
                "SKILL.md",
                "SKILL.md has no content after frontmatter. L2 instructions are required.",
                "Add markdown body with skill instructions after the closing ---.",
            )
        )

    for file_path in all_files:
        ext = os.path.splitext(file_path)[1]
        if ext not in SCAN_EXTENSIONS:
            continue

        rel_file = _relpath(file_path, skill_dir)
        content = safe_read_file(file_path, findings, rel_file)
        if content is None:
            continue

        if "installed_path" in frontmatter_fields(content):
            findings.append(
                _finding(
                    "PATH-02",
                    "No installed_path Variable",
                    "HIGH",
                    rel_file,
                    "Frontmatter contains `installed_path:` key.",
                    "Remove `installed_path` from frontmatter. Use relative paths instead.",
                )
            )

        stripped = strip_code_blocks(content)
        for i, line in enumerate(stripped.split(os.linesep)):
            if INSTALLED_PATH_RE.search(line):
                findings.append(
                    _finding(
                        "PATH-02",
                        "No installed_path Variable",
                        "HIGH",
                        rel_file,
                        "`installed_path` reference found in content.",
                        "Remove all installed_path usage. Use relative paths (`./path` or `../path`) instead.",
                        line=i + 1,
                    )
                )

        # Unstripped: script calls usually sit in code blocks.
        for i, line in enumerate(content.split(os.linesep)):
            if BARE_SCRIPT_RE.search(line):
                findings.append(
                    _finding(
                        "PATH-06",
                        "Script Calls Must Use {skill-root}",
                        "HIGH",
                        rel_file,
                        "`uv run scripts/...` resolves from the working directory, not the skill.",
                        'Call the script as `uv run "{skill-root}/scripts/..."`.',
                        line=i + 1,
                    )
                )

        for line_num, tok in find_unquoted_root_in_uv_run(content):
            findings.append(
                _finding(
                    "PATH-07",
                    "Quote Path Arguments in Shell Commands",
                    "HIGH",
                    rel_file,
                    f"`{tok}` in a `uv run` call is not wrapped in double quotes; paths with spaces will split.",
                    'Wrap the complete `{project-root}` or `{skill-root}` argument in double quotes, e.g. `"{skill-root}/scripts/..."` or `"{project-root}"`.',
                    line=line_num,
                )
            )

    for file_path in all_files:
        ext = os.path.splitext(file_path)[1]
        if ext not in SCAN_EXTENSIONS:
            continue

        rel_file = _relpath(file_path, skill_dir)
        content = safe_read_file(file_path, findings, rel_file)
        if content is None:
            continue
        stripped = strip_code_blocks(content)

        for i, line in enumerate(stripped.split(os.linesep)):
            for pattern in TIME_ESTIMATE_PATTERNS:
                if pattern.search(line):
                    findings.append(
                        _finding(
                            "SEQ-02",
                            "No Time Estimates",
                            "LOW",
                            rel_file,
                            f'Time estimate pattern found: "{line.strip()}"',
                            "Remove time estimates — AI execution speed varies too much.",
                            line=i + 1,
                        )
                    )
                    break

    for file_path in all_files:
        if os.path.splitext(file_path)[1] != ".md":
            continue
        base = os.path.basename(file_path)
        if not TEMPLATE_FILENAME_REGEX.search(base):
            continue

        rel_file = _relpath(file_path, skill_dir)
        content = safe_read_file(file_path, findings, rel_file)
        if content is None:
            continue

        for i, line in enumerate(content.split(os.linesep)):
            match = COMPILE_TIME_SUB_REGEX.search(line)
            if match:
                findings.append(
                    _finding(
                        "TPL-01",
                        "Template files must not contain render-time expressions",
                        "HIGH",
                        rel_file,
                        f"Template file contains render-time expression `{match.group(0)}` — this would be baked at render time and leak a machine-local value into every spec produced from the template.",
                        "Remove the `{{ config.key }}`, `{{ workflow.key }}`, `{{ agent.key }}` or `{{ initiative_folder }}` expression. Use single-curly `{var}` if the value should be resolved at LLM runtime by the consumer of the generated spec.",
                        line=i + 1,
                    )
                )

    return findings


# --- Output Formatting ---


def format_human_readable(
    results: list[dict],
    project_root: str,
    src_dir: str,
    strict: bool,
    json_output: bool,
    github_actions: bool,
) -> tuple[str, bool]:
    output: list[str] = []
    total_findings = 0
    severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}

    mode = "STRICT (exit 1 on HIGH+)" if strict else "WARNING (exit 0)"
    if json_output:
        mode += " + JSON"
    output.extend(
        [
            f"\nValidating skills in: {src_dir}",
            f"Mode: {mode}\n",
        ]
    )

    total_skills = 0
    skills_with_findings = 0

    for result in results:
        skill_dir = result["skillDir"]
        findings = result["findings"]
        total_skills += 1
        rel_dir = _relpath(skill_dir, project_root)

        if findings:
            skills_with_findings += 1
            output.append(f"\n{rel_dir}")

            for f in findings:
                total_findings += 1
                severity_counts[f["severity"]] += 1
                location = f" (line {f['line']})" if f.get("line") else ""
                output.extend(
                    [
                        f"  [{f['severity']}] {f['rule']} — {f['title']}",
                        f"    File: {f['file']}{location}",
                        f"    {f['detail']}",
                    ]
                )

                if github_actions:
                    abs_file = os.path.join(skill_dir, f["file"])
                    gh_file = _relpath(abs_file, project_root)
                    line = f.get("line") or 1
                    level = "notice" if f["severity"] == "LOW" else "warning"
                    message = escape_annotation(f"{f['rule']}: {f['detail']}")
                    print(f"::{level} file={gh_file},line={line}::{message}")

    output.extend(
        [
            f"\n{'─' * 60}",
            "\nSummary:",
            f"   Skills scanned: {total_skills}",
            f"   Skills with findings: {skills_with_findings}",
            f"   Total findings: {total_findings}",
        ]
    )

    if total_findings > 0:
        output.extend(["", "   | Severity | Count |", "   |----------|-------|"])
        for sev in ("CRITICAL", "HIGH", "MEDIUM", "LOW"):
            if severity_counts[sev] > 0:
                output.append(f"   | {sev:<8} | {severity_counts[sev]:>5} |")

    has_high_plus = severity_counts["CRITICAL"] > 0 or severity_counts["HIGH"] > 0

    if total_findings == 0:
        output.append("\n   All skills passed validation!")
    elif strict and has_high_plus:
        output.append("\n   [STRICT MODE] HIGH+ findings found — exiting with failure.")
    elif strict:
        output.append("\n   [STRICT MODE] Only MEDIUM/LOW findings — pass.")
    else:
        output.append("\n   Run with --strict to treat HIGH+ findings as errors.")

    output.append("")

    step_summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if step_summary:
        summary = "## Skill Validation\n\n"
        if total_findings > 0:
            summary += "| Skill | Rule | Severity | File | Detail |\n"
            summary += "|-------|------|----------|------|--------|\n"
            for result in results:
                rel_dir = _relpath(result["skillDir"], project_root)
                for f in result["findings"]:
                    summary += (
                        f"| {escape_table_cell(rel_dir)} | {f['rule']} | {f['severity']} | "
                        f"{escape_table_cell(f['file'])} | {escape_table_cell(f['detail'])} |\n"
                    )
            summary += "\n"
        summary += f"**{total_skills} skills scanned, {total_findings} findings**\n"
        with open(step_summary, "a", encoding="utf-8") as fh:
            fh.write(summary)

    return "\n".join(output), has_high_plus


def format_json(results: list[dict], project_root: str) -> tuple[str, bool]:
    all_findings: list[dict] = []
    for result in results:
        rel_dir = _relpath(result["skillDir"], project_root)
        for f in result["findings"]:
            all_findings.append(
                {
                    "skill": rel_dir,
                    "rule": f["rule"],
                    "title": f["title"],
                    "severity": f["severity"],
                    "file": f["file"],
                    "line": f.get("line") or None,
                    "detail": f["detail"],
                    "fix": f["fix"],
                }
            )

    all_findings.sort(key=lambda item: SEVERITY_ORDER[item["severity"]])
    has_high_plus = any(f["severity"] in ("CRITICAL", "HIGH") for f in all_findings)
    return json.dumps(all_findings, indent=2, ensure_ascii=False), has_high_plus


# --- Main ---


def run(
    project_root: str,
    skill_dir: str | None = None,
    strict: bool = False,
    json_output: bool = False,
) -> int:
    src_dir = os.path.join(project_root, "skills")
    github_actions = bool(os.environ.get("GITHUB_ACTIONS"))

    if skill_dir is not None:
        target = os.path.abspath(skill_dir)
        if not os.path.isdir(target):
            print(f'Error: "{skill_dir}" is not a valid directory.', file=sys.stderr)
            return 2
        skill_dirs = [target]
    else:
        skill_dirs = discover_skill_dirs([src_dir])

    if not skill_dirs:
        print("No skill directories found.", file=sys.stderr)
        return 2

    results = [{"skillDir": d, "findings": validate_skill(d)} for d in skill_dirs]

    if json_output:
        output, has_high_plus = format_json(results, project_root)
    else:
        output, has_high_plus = format_human_readable(
            results, project_root, src_dir, strict, json_output, github_actions
        )
    print(output)

    return 1 if strict and has_high_plus else 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate skill directories against deterministic rules.")
    parser.add_argument("--strict", action="store_true", help="exit 1 on HIGH+ findings")
    parser.add_argument("--json", action="store_true", dest="json_output", help="JSON output")
    parser.add_argument("skill_dir", nargs="?", default=None, help="single skill directory")
    args = parser.parse_args(argv)
    return run(PROJECT_ROOT, skill_dir=args.skill_dir, strict=args.strict, json_output=args.json_output)


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
