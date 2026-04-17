#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Resolve customization for a BMad skill using three-layer TOML merge.

Reads customization from three layers (highest priority first):
  1. {project-root}/_bmad/customizations/{name}.user.toml  (personal, gitignored)
  2. {project-root}/_bmad/customizations/{name}.toml        (team/org, committed)
  3. ./customize.toml                                       (skill defaults)

Outputs merged JSON to stdout. Errors go to stderr.

Usage:
  python ./scripts/resolve-customization.py {skill-name}
  python ./scripts/resolve-customization.py {skill-name} --key persona
  python ./scripts/resolve-customization.py {skill-name} --key persona.displayName --key inject
"""

from __future__ import annotations

import argparse
import json
import sys
import tomllib
from pathlib import Path
from typing import Any


def find_project_root(start: Path) -> Path | None:
    """Walk up from *start* looking for a directory containing ``_bmad/`` or ``.git``."""
    current = start.resolve()
    while True:
        if (current / "_bmad").is_dir() or (current / ".git").exists():
            return current
        parent = current.parent
        if parent == current:
            return None
        current = parent


def load_toml(path: Path) -> dict[str, Any]:
    """Return parsed TOML or empty dict if the file doesn't exist."""
    if not path.is_file():
        return {}
    try:
        with open(path, "rb") as f:
            return tomllib.load(f)
    except (tomllib.TOMLDecodeError, OSError) as exc:
        print(f"warning: failed to parse {path}: {exc}", file=sys.stderr)
        return {}


# ---------------------------------------------------------------------------
# Merge helpers
# ---------------------------------------------------------------------------

def _is_menu_array(value: Any) -> bool:
    """True when *value* is a non-empty list where ALL items are dicts with a ``code`` key."""
    return (
        isinstance(value, list)
        and len(value) > 0
        and all(isinstance(item, dict) and "code" in item for item in value)
    )


def merge_menu(base: list[dict], override: list[dict]) -> list[dict]:
    """Merge-by-code: matching codes replace; new codes append."""
    result_by_code: dict[str, dict] = {item["code"]: dict(item) for item in base if "code" in item}
    for item in override:
        if "code" not in item:
            print(f"warning: menu item missing 'code' key, skipping: {item}", file=sys.stderr)
            continue
        result_by_code[item["code"]] = dict(item)
    return list(result_by_code.values())


def deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    """Recursively merge *override* into *base*.

    Rules:
      - Tables (dicts): sparse override -- recurse, unmentioned keys kept.
      - ``[[menu]]`` arrays (items with ``code`` key): merge-by-code.
      - All other arrays: atomic replace.
      - Scalars: override wins.
    """
    merged = dict(base)
    for key, over_val in override.items():
        base_val = merged.get(key)

        if isinstance(over_val, dict) and isinstance(base_val, dict):
            merged[key] = deep_merge(base_val, over_val)
        elif _is_menu_array(over_val) and _is_menu_array(base_val):
            merged[key] = merge_menu(base_val, over_val)  # type: ignore[arg-type]
        else:
            merged[key] = over_val

    return merged


# ---------------------------------------------------------------------------
# Key extraction
# ---------------------------------------------------------------------------

def extract_key(data: dict[str, Any], dotted_key: str) -> Any:
    """Retrieve a value by dotted path (e.g. ``persona.displayName``)."""
    parts = dotted_key.split(".")
    current: Any = data
    for part in parts:
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return None
    return current


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Resolve BMad skill customization (three-layer TOML merge).",
        epilog=(
            "Resolution priority: user.toml > team.toml > skill defaults.\n"
            "Output is JSON. Use --key to request specific fields (JIT resolution)."
        ),
    )
    parser.add_argument(
        "skill_name",
        help="Skill identifier (e.g. bmad-agent-pm, bmad-product-brief)",
    )
    parser.add_argument(
        "--key",
        action="append",
        dest="keys",
        metavar="FIELD",
        help="Dotted field path to resolve (repeatable). Omit for full dump.",
    )
    args = parser.parse_args()

    # Locate the skill's own customize.toml (one level up from scripts/)
    script_dir = Path(__file__).resolve().parent
    skill_dir = script_dir.parent
    defaults_path = skill_dir / "customize.toml"

    # Locate project root for override files
    project_root = find_project_root(Path.cwd())
    if project_root is None:
        # Try from the skill directory as fallback
        project_root = find_project_root(skill_dir)

    # Load three layers (lowest priority first, then merge upward)
    defaults = load_toml(defaults_path)

    team: dict[str, Any] = {}
    user: dict[str, Any] = {}
    if project_root is not None:
        customizations_dir = project_root / "_bmad" / "customizations"
        team = load_toml(customizations_dir / f"{args.skill_name}.toml")
        user = load_toml(customizations_dir / f"{args.skill_name}.user.toml")

    # Merge: defaults <- team <- user
    merged = deep_merge(defaults, team)
    merged = deep_merge(merged, user)

    # Output
    if args.keys:
        result = {}
        for key in args.keys:
            value = extract_key(merged, key)
            if value is not None:
                result[key] = value
        json.dump(result, sys.stdout, indent=2, ensure_ascii=False)
    else:
        json.dump(merged, sys.stdout, indent=2, ensure_ascii=False)

    # Ensure trailing newline for clean terminal output
    print()


if __name__ == "__main__":
    main()
