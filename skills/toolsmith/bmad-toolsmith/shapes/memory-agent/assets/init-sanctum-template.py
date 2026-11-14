#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""First Breath: deterministic sanctum scaffolding.

Runs before the conversational awakening. Creates the sanctum folder and its
memory layout and writes every sanctum template in the skill's assets/.

Safe to rerun. A file that already exists is never rewritten, so a run that was
cut off partway is finished by the next one, and a finished sanctum is left
alone. The owner's name and language are not read from anywhere: the agent
learns them in the First Breath conversation and writes them to BOND.md.

The sanctum holds only what the agent learns. What the skill ships (its
capability references and scripts) stays in the skill, so an update reaches an
agent that already exists; wake.py lists the built-in capabilities from the
skill at every waking.

Usage:
    uv run {skill-root}/scripts/init-sanctum.py <project-root> <skill-path>

    project-root: the folder holding _bmad/
    skill-path:   the skill folder (SKILL.md, references/, assets/, scripts/)

Exit 0 and a report on stdout; exit 1 when the sanctum cannot be written; exit 2 on a usage error.
"""

import argparse
import sys
from datetime import date
from pathlib import Path

# The skill folder's name is the skill name; this script lives in its scripts/.
SKILL_NAME = Path(__file__).resolve().parent.parent.name

# The memory layout HOW-I-REMEMBER.md describes. The agent adds folders under memory/ as kinds of subject appear.
MEMORY_DIRS = ("memory/sessions", "raw", "capabilities")


def substitute_vars(content: str, variables: dict) -> str:
    """Replace {var_name} placeholders with values from the variables dict."""
    for key, value in variables.items():
        content = content.replace(f"{{{key}}}", value)
    return content


def main() -> int:
    parser = argparse.ArgumentParser(description="Scaffold the sanctum before the First Breath conversation.")
    parser.add_argument("project_root", type=Path, help="the folder holding _bmad/")
    parser.add_argument("skill_path", type=Path, help="the skill folder (SKILL.md, references/, assets/, scripts/)")
    args = parser.parse_args()

    project_root = args.project_root.resolve()
    skill_path = args.skill_path.resolve()
    sanctum_path = project_root / "_bmad" / "memory" / SKILL_NAME
    assets_dir = skill_path / "assets"

    existed = sanctum_path.is_dir()
    variables = {
        "birth_date": date.today().isoformat(),
        "project_root": str(project_root),
        "sanctum_path": str(sanctum_path),
    }

    created = []
    try:
        for rel in MEMORY_DIRS:
            (sanctum_path / rel).mkdir(parents=True, exist_ok=True)
        for template_path in sorted(assets_dir.glob("*-template.md")):
            output_name = template_path.name.removesuffix("-template.md").upper() + ".md"
            target = sanctum_path / output_name
            if target.exists():
                continue
            content = substitute_vars(template_path.read_text(encoding="utf-8"), variables)
            target.write_text(content, encoding="utf-8")
            created.append(output_name)
    except OSError as error:
        print(f"Cannot write the sanctum at {sanctum_path}: {error.strerror or error}", file=sys.stderr)
        return 1

    if existed and not created:
        print(f"Sanctum complete at {sanctum_path}; nothing to scaffold.")
        return 0

    print(f"{'Finished' if existed else 'Created'} sanctum at {sanctum_path}")
    for name in created:
        print(f"  Created {name}")
    print()
    print("Scaffolding complete. The First Breath conversation can begin.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
