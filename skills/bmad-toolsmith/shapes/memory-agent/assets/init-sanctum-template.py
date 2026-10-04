#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""First Breath: deterministic sanctum scaffolding.

Runs before the conversational awakening. Creates the sanctum folder and its
memory layout, writes every sanctum template in the skill's assets/, copies the
capability references and their scripts into the sanctum, and fills
CAPABILITIES.md from the capability files' frontmatter.

Safe to rerun. A file that already exists is never rewritten, so a run that was
cut off partway is finished by the next one, and a finished sanctum is left
alone. The owner's name and language are not read from anywhere: the agent
learns them in the First Breath conversation and writes them to BOND.md.

After this runs the sanctum is self-contained: the agent depends on the skill
bundle only for First Breath, wake.py and this script.

Usage:
    uv run {skill-root}/scripts/init-sanctum.py <project-root> <skill-path>

    project-root: the folder holding _bmad/
    skill-path:   the skill folder (SKILL.md, references/, assets/, scripts/)

Exit 0 and a report on stdout; exit 2 on a usage error.
"""

import re
import shutil
import sys
from datetime import date
from pathlib import Path

# The skill folder's name is the skill name; this script lives in its scripts/.
SKILL_NAME = Path(__file__).resolve().parent.parent.name

# References that stay in the skill bundle: used once, at First Breath.
SKILL_ONLY_FILES = {"first-breath.md"}

# Bootloader-side scripts; capability scripts are everything else in scripts/.
BOOT_SCRIPTS = {"init-sanctum.py", "wake.py"}

# The memory layout HOW-I-REMEMBER.md describes. The agent adds folders under memory/ as kinds of subject appear.
MEMORY_DIRS = ("memory/sessions", "raw", "capabilities")


def parse_frontmatter(file_path: Path) -> dict:
    """Extract YAML frontmatter from a markdown file."""
    meta = {}
    content = file_path.read_text(encoding="utf-8")
    match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return meta
    for line in match.group(1).strip().split("\n"):
        if ":" in line:
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip().strip("'\"")
    return meta


def copy_files(source_dir: Path, dest_dir: Path, skip: set[str]) -> list[str]:
    """Copy every file in source_dir that the destination lacks, except the skipped names."""
    if not source_dir.is_dir():
        return []
    files = [f for f in sorted(source_dir.iterdir()) if f.is_file() and f.name not in skip]
    copied = []
    if files:
        dest_dir.mkdir(parents=True, exist_ok=True)
    for source_file in files:
        target = dest_dir / source_file.name
        if target.exists():
            continue
        shutil.copy2(source_file, target)
        copied.append(source_file.name)
    return copied


def capabilities_table(references_dir: Path) -> str:
    """Rows for CAPABILITIES.md from references with `name` and `code` frontmatter."""
    rows = []
    for md_file in sorted(references_dir.glob("*.md")) if references_dir.is_dir() else []:
        if md_file.name in SKILL_ONLY_FILES:
            continue
        meta = parse_frontmatter(md_file)
        if meta.get("name") and meta.get("code"):
            rows.append(
                f"| [{meta['code']}] | {meta['name']} | {meta.get('description', '')} | `references/{md_file.name}` |"
            )
    return "\n".join(rows)


def substitute_vars(content: str, variables: dict) -> str:
    """Replace {var_name} placeholders with values from the variables dict."""
    for key, value in variables.items():
        content = content.replace(f"{{{key}}}", value)
    return content


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: init-sanctum.py <project-root> <skill-path>", file=sys.stderr)
        return 2

    project_root = Path(sys.argv[1]).resolve()
    skill_path = Path(sys.argv[2]).resolve()
    sanctum_path = project_root / "_bmad" / "memory" / SKILL_NAME
    assets_dir = skill_path / "assets"
    references_dir = skill_path / "references"

    existed = sanctum_path.is_dir()
    variables = {
        "birth_date": date.today().isoformat(),
        "project_root": str(project_root),
        "sanctum_path": str(sanctum_path),
        "capabilities-table": capabilities_table(references_dir),
    }

    sanctum_path.mkdir(parents=True, exist_ok=True)
    for rel in MEMORY_DIRS:
        (sanctum_path / rel).mkdir(parents=True, exist_ok=True)

    copied_refs = copy_files(references_dir, sanctum_path / "references", SKILL_ONLY_FILES)
    copied_scripts = copy_files(skill_path / "scripts", sanctum_path / "scripts", BOOT_SCRIPTS)

    created = []
    for template_path in sorted(assets_dir.glob("*-template.md")):
        output_name = template_path.name.removesuffix("-template.md").upper() + ".md"
        target = sanctum_path / output_name
        if target.exists():
            continue
        content = substitute_vars(template_path.read_text(encoding="utf-8"), variables)
        target.write_text(content, encoding="utf-8")
        created.append(output_name)

    if existed and not created and not copied_refs and not copied_scripts:
        print(f"Sanctum already exists at {sanctum_path}")
        print("This agent has already been born. Nothing to scaffold.")
        return 0

    print(f"{'Finished' if existed else 'Created'} sanctum at {sanctum_path}")
    for name in created:
        print(f"  Created {name}")
    if copied_refs:
        print(f"  Copied {len(copied_refs)} reference files to references/")
    if copied_scripts:
        print(f"  Copied {len(copied_scripts)} scripts to scripts/")
    print()
    print("First Breath scaffolding complete. The conversational awakening can now begin.")
    print(f"Sanctum: {sanctum_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
