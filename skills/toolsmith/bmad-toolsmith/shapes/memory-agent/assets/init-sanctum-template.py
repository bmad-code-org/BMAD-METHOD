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

Exit 0 and a report on stdout; exit 2 on a usage error.
"""

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
    if len(sys.argv) < 3:
        print("Usage: init-sanctum.py <project-root> <skill-path>", file=sys.stderr)
        return 2

    project_root = Path(sys.argv[1]).resolve()
    skill_path = Path(sys.argv[2]).resolve()
    sanctum_path = project_root / "_bmad" / "memory" / SKILL_NAME
    assets_dir = skill_path / "assets"

    existed = sanctum_path.is_dir()
    variables = {
        "birth_date": date.today().isoformat(),
        "project_root": str(project_root),
        "sanctum_path": str(sanctum_path),
    }

    sanctum_path.mkdir(parents=True, exist_ok=True)
    for rel in MEMORY_DIRS:
        (sanctum_path / rel).mkdir(parents=True, exist_ok=True)

    created = []
    for template_path in sorted(assets_dir.glob("*-template.md")):
        output_name = template_path.name.removesuffix("-template.md").upper() + ".md"
        target = sanctum_path / output_name
        if target.exists():
            continue
        content = substitute_vars(template_path.read_text(encoding="utf-8"), variables)
        target.write_text(content, encoding="utf-8")
        created.append(output_name)

    if existed and not created:
        print(f"Sanctum already exists at {sanctum_path}")
        print("This agent has already been born. Nothing to scaffold.")
        return 0

    print(f"{'Finished' if existed else 'Created'} sanctum at {sanctum_path}")
    for name in created:
        print(f"  Created {name}")
    print()
    print("First Breath scaffolding complete. The conversational awakening can now begin.")
    print(f"Sanctum: {sanctum_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
