#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Deterministic Skill Validator

Validates 10 deterministic rules across skill directories.
Acts as a fast first-pass complement to the inference-based skill validator.

What it checks:
- SKILL-01: SKILL.md exists
- SKILL-02: SKILL.md frontmatter has name
- SKILL-03: SKILL.md frontmatter has description
- SKILL-04: name format (lowercase, hyphens, no forbidden substrings)
- SKILL-05: name matches directory basename
- SKILL-06: description quality (length, "Use when"/"Use if")
- SKILL-07: SKILL.md has body content after frontmatter
- PATH-02: no installed_path variable
- SEQ-02: no time estimates
- TPL-01: template files must not contain compile-time {{.var}} substitutions

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

sys.dont_write_bytecode = True

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(PROJECT_ROOT, "src")

# JS RegExp#toString() forms — Python's re.Pattern repr is not load-bearing for messages.
NAME_REGEX_DISPLAY = r"/^(?:bmad|bmad-[a-z0-9]+(?:-[a-z0-9]+)*)$/"

NAME_REGEX = re.compile(r"^(?:bmad|bmad-[a-z0-9]+(?:-[a-z0-9]+)*)$")
TIME_ESTIMATE_PATTERNS = [
    re.compile(r"takes?\s+\d+\s*min", re.I),
    re.compile(r"~\s*\d+\s*min", re.I),
    re.compile(r"estimated\s+time", re.I),
    re.compile(r"\bETA\b"),
]
TEMPLATE_FILENAME_REGEX = re.compile(r"template", re.I)
COMPILE_TIME_SUB_REGEX = re.compile(r"\{\{\.\w+\}\}")
INSTALLED_PATH_RE = re.compile(r"installed_path", re.I)
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
    rel = os.path.relpath(to_path, start)
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


def _frontmatter_block(content: str) -> str | None:
    trimmed = content.lstrip()
    if not trimmed.startswith("---"):
        return None

    end_index = trimmed.find("\n---\n", 3)
    if end_index == -1:
        if trimmed.endswith("\n---"):
            end_index = len(trimmed) - 4
        else:
            return None

    return trimmed[3:end_index].strip()


def _strip_quotes(value: str) -> str:
    if (value.startswith("'") and value.endswith("'")) or (
        value.startswith('"') and value.endswith('"')
    ):
        return value[1:-1]
    return value


def parse_frontmatter(content: str) -> dict[str, str] | None:
    fm_block = _frontmatter_block(content)
    if fm_block is None:
        return None
    if fm_block == "":
        return {}

    result: dict[str, str] = {}
    for line in fm_block.split("\n"):
        colon_index = line.find(":")
        if colon_index == -1:
            continue
        # Skip indented lines (nested YAML values)
        if line[:1] in (" ", "\t"):
            continue
        key = line[:colon_index].strip()
        value = line[colon_index + 1 :].strip()
        result[key] = _strip_quotes(value)
    return result


def parse_frontmatter_multiline(content: str) -> dict[str, str] | None:
    fm_block = _frontmatter_block(content)
    if fm_block is None:
        return None
    if fm_block == "":
        return {}

    result: dict[str, str] = {}
    current_key: str | None = None
    current_value = ""

    for line in fm_block.split("\n"):
        colon_index = line.find(":")
        # New key: column 0 (no leading whitespace) and colon not at index 0
        if colon_index > 0 and line[:1] not in (" ", "\t"):
            if current_key is not None:
                result[current_key] = _strip_quotes(current_value.strip())
            current_key = line[:colon_index].strip()
            current_value = line[colon_index + 1 :]
        elif current_key is not None:
            if line.lstrip().startswith("#"):
                continue
            current_value += "\n" + line

    if current_key is not None:
        result[current_key] = _strip_quotes(current_value.strip())
    return result


# --- Safe File Reading ---


def safe_read_file(file_path: str, findings: list[dict], rel_file: str | None) -> str | None:
    try:
        with open(file_path, encoding="utf-8", errors="replace", newline="") as f:
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
    return re.sub(r"[^\n]", "", match.group(0))


def strip_code_blocks(content: str) -> str:
    return re.sub(r"```.*?```", _blank, content, flags=re.DOTALL)


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
                skill_dirs.append(full_path)
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
    skill_fm = parse_frontmatter_multiline(skill_content)

    if not skill_fm or "name" not in skill_fm:
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
    elif skill_fm["name"] == "":
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

    if not skill_fm or "description" not in skill_fm:
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
    elif skill_fm["description"] == "":
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

    name = skill_fm.get("name") if skill_fm else None
    description = skill_fm.get("description") if skill_fm else None

    is_deprecated = isinstance(description, str) and bool(DEPRECATED_RE.search(description))

    if name and not NAME_REGEX.search(name):
        findings.append(
            _finding(
                "SKILL-04",
                "name Format",
                "HIGH",
                "SKILL.md",
                f'name "{name}" does not match pattern: {NAME_REGEX_DISPLAY}',
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

        if not is_deprecated and not USE_WHEN_RE.search(description) and not USE_IF_RE.search(description):
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

    trimmed = skill_content.lstrip()
    body_start = -1
    if trimmed.startswith("---"):
        end_idx = trimmed.find("\n---\n", 3)
        if end_idx != -1:
            body_start = end_idx + 4
        elif trimmed.endswith("\n---"):
            body_start = len(trimmed)
    else:
        body_start = 0
    body = trimmed[body_start:].strip() if body_start >= 0 else ""
    if body == "":
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

        fm = parse_frontmatter(content)
        if fm and "installed_path" in fm:
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
        for i, line in enumerate(stripped.split("\n")):
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

    for file_path in all_files:
        ext = os.path.splitext(file_path)[1]
        if ext not in SCAN_EXTENSIONS:
            continue

        rel_file = _relpath(file_path, skill_dir)
        content = safe_read_file(file_path, findings, rel_file)
        if content is None:
            continue
        stripped = strip_code_blocks(content)

        for i, line in enumerate(stripped.split("\n")):
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

        for i, line in enumerate(content.split("\n")):
            match = COMPILE_TIME_SUB_REGEX.search(line)
            if match:
                findings.append(
                    _finding(
                        "TPL-01",
                        "Template files must not contain compile-time substitutions",
                        "HIGH",
                        rel_file,
                        f"Template file contains compile-time substitution `{match.group(0)}` — this would be baked at render time and leak a machine-local value into every spec produced from the template.",
                        "Remove the `{{.var}}` reference. Use single-curly `{var}` if the value should be resolved at LLM runtime by the consumer of the generated spec.",
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
    src_dir = os.path.join(project_root, "src")
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
    sys.exit(main())
