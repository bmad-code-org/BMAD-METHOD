#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""File Reference Validator

Validates cross-file references in BMAD source files (agents, workflows, tasks, steps).
Catches broken file paths, missing referenced files, and absolute path leaks.

What it checks:
- {project-root}/_bmad/ references in YAML and markdown resolve to real skills/ files
- Relative path references (./file.md, ../data/file.csv) point to existing files
- exec="..." and <invoke-task> targets exist
- Step metadata (thisStepFile, nextStepFile) references are valid
- Load directives (Load: `./file.md`) target existing files
- No absolute paths (/Users/, /home/, C:\\) leak into source files

What it does NOT check (deferred):
- {installed_path} variable interpolation (self-referential, low risk)
- {{mustache}} template variables (runtime substitution)
- {config_source}:key dynamic YAML dereferences

Usage:
  uv run --python 3.11 tools/validate_file_refs.py            # Warn on broken references (exit 0)
  uv run --python 3.11 tools/validate_file_refs.py --strict   # Fail on broken references (exit 1)
  uv run --python 3.11 tools/validate_file_refs.py --verbose  # Show all checked references

Default mode is warning-only (exit 0) so adoption is non-disruptive.
Use --strict when you want CI or pre-commit to enforce valid references.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from typing import NamedTuple

import yaml

sys.dont_write_bytecode = True

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- Constants ---

# File extensions to scan
SCAN_EXTENSIONS = {".yaml", ".yml", ".md", ".xml"}

# Skip directories
SKIP_DIRS = {"node_modules", ".git"}

# Pattern: {project-root}/_bmad/ references
PROJECT_ROOT_REF = re.compile(r"\{project-root\}/_bmad/([^\s'\"<>})\]`]+)")

# Pattern: {_bmad}/ shorthand references
BMAD_SHORTHAND_REF = re.compile(r"\{_bmad\}/([^\s'\"<>})\]`]+)")

# Pattern: exec="..." attributes
EXEC_ATTR = re.compile(r'exec="([^"]+)"')

# Pattern: <invoke-task> content
INVOKE_TASK = re.compile(r"<invoke-task>([^<]+)</invoke-task>")

# Pattern: relative paths in quotes
RELATIVE_PATH_QUOTED = re.compile(r"['\"](\.\./?[^'\"]+\.(?:md|yaml|yml|xml|json|csv|txt))['\"]")
RELATIVE_PATH_DOT = re.compile(r"['\"](\./[^'\"]+\.(?:md|yaml|yml|xml|json|csv|txt))['\"]")

# Pattern: step metadata
STEP_META = re.compile(
    r"(?:thisStepFile|nextStepFile|continueStepFile|skipToStepFile|altStepFile|workflowFile):\s*['\"](\.[^'\"]+)['\"]"
)

# Pattern: Load directives
LOAD_DIRECTIVE = re.compile(r"Load[:\s]+`(\.[^`]+)`")

# Pattern: absolute path leaks (C:\\ is escaped-backslash form, as leaked paths appear in source)
ABS_PATH_LEAK = re.compile(r"/Users/|/home/|[A-Z]:\\\\")

# In-value forms of the reference patterns, for YAML scalar matching
PROJECT_ROOT_IN_VALUE = re.compile(r"\{project-root\}/_bmad/[^\s'\"<>})\]`]+")
BMAD_SHORTHAND_IN_VALUE = re.compile(r"\{_bmad\}/[^\s'\"<>})\]`]+")
RELATIVE_IN_VALUE = re.compile(r"^\.\.?/[^\s'\"<>})\]`]+\.(?:md|yaml|yml|xml|json|csv|txt)$")
BARE_BMAD_IN_VALUE = re.compile(r"_bmad/([^\s'\"<>})\]`]+)")

# Path prefixes/patterns that only exist in installed structure, not in source
INSTALL_ONLY_PATHS = ["_config/", "custom/", "render/bmad-build/", "render/bmad-build-auto/"]

# Files that are generated at install time and don't exist in the source tree
INSTALL_GENERATED_FILES = ["config.yaml", "config.user.yaml"]

# Variables that indicate a path is not statically resolvable
UNRESOLVABLE_VARS = [
    "{output_folder}",
    "{value}",
    "{timestamp}",
    "{config_source}:",
    "{installed_path}",
    "{shared_path}",
    "{planning_artifacts}",
    "{research_topic}",
    "{user_name}",
    "{communication_language}",
    "{epic_number}",
    "{next_epic_num}",
    "{epic_num}",
    "{part_id}",
    "{count}",
    "{date}",
    "{outputFile}",
    "{nextStepFile}",
]


class Ref(NamedTuple):
    file: str
    raw: str
    type: str
    line: int | None = None
    key: str | None = None


# --- Output Escaping ---


def escape_annotation(s: str) -> str:
    return s.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")


def escape_table_cell(s: str) -> str:
    return str(s).replace("|", "\\|")


# --- File Discovery ---


def get_source_files(directory: str) -> list[str]:
    files: list[str] = []

    def walk(current_dir: str) -> None:
        with os.scandir(current_dir) as it:
            entries = sorted(it, key=lambda e: e.name)
        for entry in entries:
            if entry.name in SKIP_DIRS:
                continue
            if entry.is_dir(follow_symlinks=False):
                walk(entry.path)
            elif entry.is_file() and os.path.splitext(entry.name)[1] in SCAN_EXTENSIONS:
                files.append(entry.path)

    walk(directory)
    return files


# --- Code Block Stripping ---


def _blank(match: re.Match[str]) -> str:
    # Blank matched text but keep its newlines so line numbers stay aligned
    return re.sub(r"[^\n]", "", match.group(0))


def strip_code_blocks(content: str) -> str:
    return re.sub(r"```.*?```", _blank, content, flags=re.DOTALL)


def strip_json_example_blocks(content: str) -> str:
    # Strip bare JSON example blocks: { and } each on their own line.
    # These are example/template data (not real file references).
    return re.sub(r"^\{\s*\n(?:.*\n)*?^\}[ \t]*$", _blank, content, flags=re.MULTILINE)


# --- Path Mapping ---


def map_installed_to_source(ref_path: str, skills_dir: str) -> str | None:
    # Strip {project-root}/_bmad/ or {_bmad}/ prefix
    cleaned = re.sub(r"^\{project-root\}/_bmad/", "", ref_path)
    cleaned = re.sub(r"^\{_bmad\}/", "", cleaned)

    # Also handle bare _bmad/ prefix (seen in some invoke-task)
    cleaned = re.sub(r"^_bmad/", "", cleaned)

    # Skip install-only paths (generated at install time, not in source)
    if is_install_only(cleaned):
        return None

    # _bmad/scripts/ is installed from the bmad hub skill's scripts/
    if cleaned.startswith("scripts/"):
        return os.path.join(skills_dir, "bmad", cleaned)

    # Fallback: map directly under skills/
    return os.path.join(skills_dir, cleaned)


# --- Reference Extraction ---


def is_resolvable(ref_str: str) -> bool:
    # Skip refs containing unresolvable runtime variables
    if "{{" in ref_str:
        return False
    return all(v not in ref_str for v in UNRESOLVABLE_VARS)


def is_install_only(cleaned_path: str) -> bool:
    # Skip paths that only exist in the installed _bmad/ structure, not in skills/
    if any(cleaned_path.startswith(prefix) for prefix in INSTALL_ONLY_PATHS):
        return True
    # Skip files that are generated during installation
    return os.path.basename(cleaned_path) in INSTALL_GENERATED_FILES


def extract_yaml_refs(file_path: str, content: str) -> list[Ref]:
    refs: list[Ref] = []

    try:
        documents = list(yaml.compose_all(content, Loader=yaml.SafeLoader))
    except yaml.YAMLError:
        return refs  # Skip unparseable YAML (schema validator handles this)

    def check_value(value: str, line: int, key_path: str) -> None:
        if not is_resolvable(value):
            return

        # Check for {project-root}/_bmad/ refs
        pr_match = PROJECT_ROOT_IN_VALUE.search(value)
        if pr_match:
            refs.append(Ref(file_path, pr_match.group(0), "project-root", line, key_path))

        # Check for {_bmad}/ refs
        bm_match = BMAD_SHORTHAND_IN_VALUE.search(value)
        if bm_match:
            refs.append(Ref(file_path, bm_match.group(0), "project-root", line, key_path))

        # Check for relative paths
        rel_match = RELATIVE_IN_VALUE.search(value)
        if rel_match:
            refs.append(Ref(file_path, rel_match.group(0), "relative", line, key_path))

    seen: set[int] = set()

    def walk_node(node: yaml.Node | None, key_path: str) -> None:
        if node is None or id(node) in seen:
            return
        seen.add(id(node))

        if isinstance(node, yaml.MappingNode):
            for key_node, value_node in node.value:
                key = key_node.value if isinstance(key_node, yaml.ScalarNode) else "?"
                child_path = f"{key_path}.{key}" if key_path else str(key)
                walk_node(value_node, child_path)
        elif isinstance(node, yaml.SequenceNode):
            for i, item in enumerate(node.value):
                walk_node(item, f"{key_path}[{i}]")
        elif isinstance(node, yaml.ScalarNode):
            check_value(node.value, node.start_mark.line + 1, key_path)

    for document in documents:
        walk_node(document, "")
    return refs


def offset_to_line(content: str, offset: int) -> int:
    return content.count("\n", 0, offset) + 1


def extract_markdown_refs(file_path: str, content: str) -> list[Ref]:
    refs: list[Ref] = []
    stripped = strip_json_example_blocks(strip_code_blocks(content))

    def run_pattern(regex: re.Pattern[str], ref_type: str) -> None:
        for match in regex.finditer(stripped):
            raw = match.group(1)
            if not is_resolvable(raw):
                continue
            refs.append(Ref(file_path, raw, ref_type, offset_to_line(stripped, match.start())))

    # {project-root}/_bmad/ refs
    run_pattern(PROJECT_ROOT_REF, "project-root")

    # {_bmad}/ shorthand
    run_pattern(BMAD_SHORTHAND_REF, "project-root")

    # exec="..." attributes
    run_pattern(EXEC_ATTR, "exec-attr")

    # <invoke-task> tags
    run_pattern(INVOKE_TASK, "invoke-task")

    # Step metadata
    run_pattern(STEP_META, "relative")

    # Load directives
    run_pattern(LOAD_DIRECTIVE, "relative")

    # Relative paths in quotes
    run_pattern(RELATIVE_PATH_QUOTED, "relative")
    run_pattern(RELATIVE_PATH_DOT, "relative")

    return refs


# --- Reference Resolution ---


def resolve_ref(ref: Ref, skills_dir: str) -> str | None:
    if ref.type == "project-root":
        return map_installed_to_source(ref.raw, skills_dir)

    if ref.type == "relative":
        return os.path.normpath(os.path.join(os.path.dirname(ref.file), ref.raw))

    if ref.type == "exec-attr":
        exec_path = ref.raw
        if "{project-root}" in exec_path or "{_bmad}" in exec_path or exec_path.startswith("_bmad/"):
            return map_installed_to_source(exec_path, skills_dir)
        # Relative exec path
        return os.path.normpath(os.path.join(os.path.dirname(ref.file), exec_path))

    if ref.type == "invoke-task":
        # Extract file path from invoke-task content
        pr_match = PROJECT_ROOT_IN_VALUE.search(ref.raw)
        if pr_match:
            return map_installed_to_source(pr_match.group(0), skills_dir)

        bm_match = BMAD_SHORTHAND_IN_VALUE.search(ref.raw)
        if bm_match:
            return map_installed_to_source(bm_match.group(0), skills_dir)

        bare_match = BARE_BMAD_IN_VALUE.search(ref.raw)
        if bare_match:
            return map_installed_to_source(bare_match.group(0), skills_dir)

        return None  # Can't resolve — skip

    return None


# --- Absolute Path Leak Detection ---


class Leak(NamedTuple):
    file: str
    line: int
    content: str


def check_absolute_path_leaks(file_path: str, content: str) -> list[Leak]:
    stripped = strip_code_blocks(content)
    return [
        Leak(file_path, i + 1, line.strip())
        for i, line in enumerate(stripped.split("\n"))
        if ABS_PATH_LEAK.search(line)
    ]


# --- Main ---


def run(project_root: str, strict: bool = False, verbose: bool = False) -> int:
    skills_dir = os.path.join(project_root, "skills")
    github_actions = bool(os.environ.get("GITHUB_ACTIONS"))

    print(f"\nValidating file references in: {skills_dir}")
    mode = "STRICT (exit 1 on issues)" if strict else "WARNING (exit 0)"
    print(f"Mode: {mode}{' + VERBOSE' if verbose else ''}\n")

    files = get_source_files(skills_dir)
    print(f"Found {len(files)} source files\n")

    total_refs = 0
    broken_refs = 0
    total_leaks = 0
    files_with_issues = 0
    all_issues: list[dict] = []  # Collect for $GITHUB_STEP_SUMMARY

    for file_path in files:
        relative_path = os.path.relpath(file_path, project_root)
        with open(file_path, encoding="utf-8", errors="replace") as f:
            content = f.read()
        ext = os.path.splitext(file_path)[1]

        # Extract references
        if ext in (".yaml", ".yml"):
            refs = extract_yaml_refs(file_path, content)
        else:
            refs = extract_markdown_refs(file_path, content)

        # Resolve and classify all refs before printing anything.
        broken: list[tuple[Ref, str, str]] = []
        ok: list[Ref] = []

        for ref in refs:
            total_refs += 1
            resolved = resolve_ref(ref, skills_dir)

            if resolved and not os.path.exists(resolved):
                rel_resolved = os.path.relpath(resolved, project_root)
                # Extensionless paths may be directory references or partial templates.
                # Nothing exists at all — likely a real broken reference. UNRESOLVED is
                # distinct from BROKEN, which means "file with extension not found".
                has_ext = os.path.splitext(resolved)[1] != ""
                kind = "broken" if has_ext else "unresolved"
                broken.append((ref, rel_resolved, kind))
                broken_refs += 1
                continue

            if resolved:
                ok.append(ref)

        # Check absolute path leaks
        leaks = check_absolute_path_leaks(file_path, content)
        total_leaks += len(leaks)

        # Print results — file header appears once, in one place
        has_file_issues = bool(broken) or bool(leaks)

        if has_file_issues:
            files_with_issues += 1
            print(f"\n{relative_path}")

            if verbose:
                for ref in ok:
                    print(f"  [OK] {ref.raw}")

            for ref, resolved, kind in broken:
                location = f"line {ref.line}" if ref.line else (f"key: {ref.key}" if ref.key else "")
                tag = "UNRESOLVED" if kind == "unresolved" else "BROKEN"
                detail = "Not found as file or directory" if kind == "unresolved" else "Target not found"
                issue_type = "unresolved path" if kind == "unresolved" else "broken ref"
                print(f"  [{tag}] {ref.raw}{f' ({location})' if location else ''}")
                print(f"     {detail}: {resolved}")
                all_issues.append({"file": relative_path, "line": ref.line or 1, "ref": ref.raw, "issue": issue_type})
                if github_actions:
                    label = "Unresolved path" if kind == "unresolved" else "Broken reference"
                    print(
                        f"::warning file={relative_path},line={ref.line or 1}::"
                        f"{escape_annotation(f'{label}: {ref.raw} → {resolved}')}"
                    )

            for leak in leaks:
                print(f"  [ABS-PATH] Line {leak.line}: {leak.content}")
                all_issues.append({"file": relative_path, "line": leak.line, "ref": leak.content, "issue": "abs-path"})
                if github_actions:
                    print(
                        f"::warning file={relative_path},line={leak.line}::"
                        f"{escape_annotation(f'Absolute path leak: {leak.content}')}"
                    )
        elif verbose and refs:
            print(f"\n{relative_path}")
            for ref in ok:
                print(f"  [OK] {ref.raw}")

    # Summary
    print(f"\n{'─' * 60}")
    print("\nSummary:")
    print(f"   Files scanned: {len(files)}")
    print(f"   References checked: {total_refs}")
    print(f"   Broken references: {broken_refs}")
    print(f"   Absolute path leaks: {total_leaks}")

    has_issues = broken_refs > 0 or total_leaks > 0

    if has_issues:
        print(f"\n   {files_with_issues} file(s) with issues")
        if strict:
            print("\n   [STRICT MODE] Exiting with failure.")
        else:
            print("\n   Run with --strict to treat warnings as errors.")
    else:
        print("\n   All file references valid!")

    print("")

    # Write GitHub Actions step summary
    step_summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if step_summary:
        summary = "## File Reference Validation\n\n"
        if all_issues:
            summary += "| File | Line | Reference | Issue |\n"
            summary += "|------|------|-----------|-------|\n"
            for issue in all_issues:
                summary += (
                    f"| {escape_table_cell(issue['file'])} | {issue['line']} "
                    f"| {escape_table_cell(issue['ref'])} | {issue['issue']} |\n"
                )
            summary += "\n"
        summary += (
            f"**{len(files)} files scanned, {total_refs} references checked, "
            f"{broken_refs + total_leaks} issues found**\n"
        )
        with open(step_summary, "a", encoding="utf-8") as f:
            f.write(summary)

    return 1 if has_issues and strict else 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate cross-file references in BMAD source files.")
    parser.add_argument("--strict", action="store_true", help="exit 1 on broken references")
    parser.add_argument("--verbose", action="store_true", help="show all checked references")
    args = parser.parse_args(argv)
    return run(PROJECT_ROOT, strict=args.strict, verbose=args.verbose)


if __name__ == "__main__":
    sys.exit(main())
