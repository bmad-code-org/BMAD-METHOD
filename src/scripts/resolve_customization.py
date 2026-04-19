#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6.0"]
# ///
"""
Resolve customization for a BMad skill using three-layer YAML merge.

Reads customization from three layers (highest priority first):
  1. {project-root}/_bmad/custom/{name}.user.yaml  (personal, gitignored)
  2. {project-root}/_bmad/custom/{name}.yaml        (team/org, committed)
  3. {skill-root}/customize.yaml                    (skill defaults)

Skill name is derived from the basename of the skill directory.

Outputs merged JSON to stdout. Errors go to stderr.

Dependencies declared inline via PEP 723. Invoke with `uv run` to
auto-install PyYAML into an isolated, cached environment:

  uv run resolve_customization.py --skill /abs/path/to/skill-dir
  uv run resolve_customization.py --skill ... --key agent
  uv run resolve_customization.py --skill ... --key agent --key agent.menu

Merge rules (matches BMad v6.1 semantics where applicable):
  - metadata: shallow merge  (scalar fields override)
  - persona:  full replace   (if override contains persona, it replaces wholesale)
  - critical_actions: append (override items appended after defaults)
  - memories:         append
  - menu:             merge by code when present, otherwise append
  - other tables:     deep merge
  - other arrays:     atomic replace
  - scalars:          override wins
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.stderr.write(
        "error: PyYAML is required to run this script.\n"
        "Invoke via `uv run resolve_customization.py ...` so dependencies\n"
        "declared in the PEP 723 header are auto-installed, or run\n"
        "`pip install PyYAML` if invoking with plain `python3`.\n"
    )
    sys.exit(3)


_MISSING = object()


def find_project_root(start: Path):
    current = start.resolve()
    while True:
        if (current / "_bmad").exists() or (current / ".git").exists():
            return current
        parent = current.parent
        if parent == current:
            return None
        current = parent


def load_yaml(file_path: Path, required: bool = False) -> dict:
    if not file_path.exists():
        if required:
            sys.stderr.write(f"error: required customization file not found: {file_path}\n")
            sys.exit(1)
        return {}
    try:
        with file_path.open("r", encoding="utf-8") as f:
            parsed = yaml.safe_load(f)
        if not isinstance(parsed, dict):
            if required:
                sys.stderr.write(f"error: {file_path} did not parse to a mapping\n")
                sys.exit(1)
            return {}
        return parsed
    except Exception as error:
        level = "error" if required else "warning"
        sys.stderr.write(f"{level}: failed to parse {file_path}: {error}\n")
        if required:
            sys.exit(1)
        return {}


def merge_by_key(base, override, key_name):
    result = []
    index_by_key = {}

    for item in base:
        if not isinstance(item, dict):
            continue
        if item.get(key_name) is not None:
            index_by_key[item[key_name]] = len(result)
        result.append(dict(item))

    for item in override:
        if not isinstance(item, dict):
            result.append(item)
            continue
        key = item.get(key_name)
        if key is not None and key in index_by_key:
            result[index_by_key[key]] = dict(item)
        else:
            if key is not None:
                index_by_key[key] = len(result)
            result.append(dict(item))

    return result


def append_arrays(base, override):
    base_arr = base if isinstance(base, list) else []
    override_arr = override if isinstance(override, list) else []
    return base_arr + override_arr


def deep_merge(base, override):
    if not isinstance(base, dict):
        return override
    if not isinstance(override, dict):
        return override

    result = dict(base)
    for key, over_val in override.items():
        base_val = result.get(key)
        if isinstance(over_val, dict) and isinstance(base_val, dict):
            result[key] = deep_merge(base_val, over_val)
        elif isinstance(over_val, list) and isinstance(base_val, list):
            result[key] = over_val
        else:
            result[key] = over_val
    return result


def merge_agent_block(base: dict, override: dict) -> dict:
    """Apply v6.1-compatible per-field merge semantics to the `agent` block,
    then deep-merge everything else normally."""
    base_obj = base if isinstance(base, dict) else {}
    override_obj = override if isinstance(override, dict) else {}
    base_agent = base_obj.get("agent") or {}
    over_agent = override_obj.get("agent") or {}

    merged_agent = dict(base_agent)

    for key, over_val in over_agent.items():
        base_val = base_agent.get(key)

        if key == "metadata":
            merged_agent["metadata"] = {
                **(base_val if isinstance(base_val, dict) else {}),
                **(over_val if isinstance(over_val, dict) else {}),
            }
        elif key == "persona":
            merged_agent["persona"] = over_val
        elif key in ("critical_actions", "memories"):
            merged_agent[key] = append_arrays(base_val, over_val)
        elif key == "menu":
            base_arr = base_val if isinstance(base_val, list) else []
            over_arr = over_val if isinstance(over_val, list) else []
            any_has_code = any(
                isinstance(item, dict) and item.get("code") is not None
                for item in base_arr + over_arr
            )
            if any_has_code:
                merged_agent[key] = merge_by_key(base_arr, over_arr, "code")
            else:
                merged_agent[key] = append_arrays(base_arr, over_arr)
        else:
            if isinstance(over_val, dict) and isinstance(base_val, dict):
                merged_agent[key] = deep_merge(base_val, over_val)
            else:
                merged_agent[key] = over_val

    # Deep-merge all non-agent top-level keys so tables like `workflow:` or
    # `config:` follow the documented `other tables: deep merge` rule. Then
    # overlay the specially-merged agent block.
    merged = deep_merge(base_obj, override_obj)
    merged["agent"] = merged_agent
    return merged


def extract_key(data, dotted_key: str):
    parts = dotted_key.split(".")
    current = data
    for part in parts:
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return _MISSING
    return current


def main():
    parser = argparse.ArgumentParser(
        description="Resolve customization for a BMad skill using three-layer YAML merge.",
        add_help=True,
    )
    parser.add_argument(
        "--skill", "-s", required=True,
        help="Absolute path to the skill directory (must contain customize.yaml)",
    )
    parser.add_argument(
        "--key", "-k", action="append", default=[],
        help="Dotted field path to resolve (repeatable). Omit for full dump.",
    )
    args = parser.parse_args()

    skill_dir = Path(args.skill).resolve()
    skill_name = skill_dir.name
    defaults_path = skill_dir / "customize.yaml"

    defaults = load_yaml(defaults_path, required=True)

    # Prefer the project that contains this skill. Only fall back to cwd if
    # the skill isn't inside a recognizable project tree (unusual but possible
    # for standalone skills invoked directly). Using cwd first is unsafe when
    # an ancestor of cwd happens to have a stray _bmad/ from another project.
    project_root = find_project_root(skill_dir) or find_project_root(Path.cwd())

    team = {}
    user = {}
    if project_root:
        custom_dir = project_root / "_bmad" / "custom"
        team = load_yaml(custom_dir / f"{skill_name}.yaml")
        user = load_yaml(custom_dir / f"{skill_name}.user.yaml")

    merged = merge_agent_block(defaults, team)
    merged = merge_agent_block(merged, user)

    if args.key:
        output = {}
        for key in args.key:
            value = extract_key(merged, key)
            if value is not _MISSING:
                output[key] = value
    else:
        output = merged

    sys.stdout.write(json.dumps(output, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
