#!/usr/bin/env python3
"""
Resolve customization for a BMad skill using a layered TOML merge.

Reads from (lowest → highest priority):
  1. {skill-root}/customize.toml                          (skill author defaults)
  2. [skills.X] sections inside four customize layers (lowest→highest):
       a. {global-dir}/customize.toml                     (global team / machine)
       b. {global-dir}/customize.user.toml                (global personal)
       c. {project-root}/_bmad/custom/customize.toml      (project team, committed)
       d. {project-root}/_bmad/custom/customize.user.toml (project personal, gitignored)
  3. {project-root}/_bmad/custom/{name}.toml              (per-skill team override)
  4. {project-root}/_bmad/custom/{name}.user.toml         (per-skill personal override)

config.toml is NOT consulted by this resolver — identity/agents live there,
skill behavior overrides live in customize.toml. Clean split.

There is no installer-tier customize.toml — the installer manages identity
(config.toml), not skill behavior. customize.{,user.}toml is purely human
or `bmad-customize`-skill-authored.

Skill name is derived from the basename of the skill directory. If the
skill lives under `{module}-skills/...`, a qualified name `{module}/{skill}`
is also computed and used for pattern matching.

Inside a customize layer, [skills.X] sections cascade by specificity (most
specific wins within the layer):
  [skills."*"]              # catchall
  [skills."bmad-*"]         # bare-name glob
  [skills."bmm/*"]          # module-scoped glob
  [skills.bmad-prd]         # bare exact
  [skills."bmm/bmad-prd"]   # qualified exact (most specific)

Patterns are matched against both the bare skill name and (if available)
the qualified `module/skill` name. Specificity scoring: exact > wildcard,
longer-pattern > shorter, `*` is the lowest.

{global-dir} = $BMAD_HOME if set, otherwise ~/.bmad (cross-platform).

Outputs merged JSON to stdout. Errors go to stderr.

Requires Python 3.11+ (uses stdlib `tomllib`). No `uv`, no `pip install`,
no virtualenv — plain `python3` is sufficient.

  python3 resolve_customization.py --skill /abs/path/to/skill-dir
  python3 resolve_customization.py --skill ... --key agent
  python3 resolve_customization.py --skill ... --key agent.menu

Merge rules (purely structural — no field-name special-casing):
  - Scalars (string, int, bool, float): override wins
  - Tables: deep merge (recursively apply these rules)
  - Arrays of tables where every item shares the *same* identifier
    field (every item has `code`, or every item has `id`):
    merge by that key (matching keys replace, new keys append)
  - All other arrays — including arrays where only some items have
    `code` or `id`, or where items mix the two keys:
    append (base items followed by override items)

No removal mechanism — overrides cannot delete base items. To suppress
a default, fork the skill or override the item by code with a no-op
description/prompt.
"""

import argparse
import fnmatch
import json
import os
import re
import sys
from pathlib import Path

try:
    import tomllib
except ImportError:
    sys.stderr.write(
        "error: Python 3.11+ is required (stdlib `tomllib` not found).\n"
        "Install a newer Python or run the resolution manually per the\n"
        "fallback instructions in the skill's SKILL.md.\n"
    )
    sys.exit(3)


_MISSING = object()
_KEYED_MERGE_FIELDS = ("code", "id")


def find_project_root(start: Path):
    current = start.resolve()
    while True:
        if (current / "_bmad").exists() or (current / ".git").exists():
            return current
        parent = current.parent
        if parent == current:
            return None
        current = parent


def load_toml(file_path: Path, required: bool = False) -> dict:
    if not file_path.exists():
        if required:
            sys.stderr.write(f"error: required customization file not found: {file_path}\n")
            sys.exit(1)
        return {}
    try:
        with file_path.open("rb") as f:
            parsed = tomllib.load(f)
        if not isinstance(parsed, dict):
            if required:
                sys.stderr.write(f"error: {file_path} did not parse to a table\n")
                sys.exit(1)
            return {}
        return parsed
    except tomllib.TOMLDecodeError as error:
        level = "error" if required else "warning"
        sys.stderr.write(f"{level}: failed to parse {file_path}: {error}\n")
        if required:
            sys.exit(1)
        return {}
    except OSError as error:
        level = "error" if required else "warning"
        sys.stderr.write(f"{level}: failed to read {file_path}: {error}\n")
        if required:
            sys.exit(1)
        return {}


def _detect_keyed_merge_field(items):
    """Return 'code' or 'id' if every table item carries that *same* field.

    All items must share the same identifier (all `code`, or all `id`).
    Mixed arrays — where some items use `code` and others use `id` —
    return None and fall through to append semantics. This is intentional:
    mixing identifier keys within one array is a schema smell, and
    append-fallback is safer than guessing which key should merge.
    """
    if not items or not all(isinstance(item, dict) for item in items):
        return None
    for candidate in _KEYED_MERGE_FIELDS:
        if all(item.get(candidate) is not None for item in items):
            return candidate
    return None


def _merge_by_key(base, override, key_name):
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


def _merge_arrays(base, override):
    """Shape-aware array merge. Base + override combined tables may opt into
    keyed merge if every item has `code` or `id`. Otherwise: append."""
    base_arr = base if isinstance(base, list) else []
    override_arr = override if isinstance(override, list) else []
    keyed_field = _detect_keyed_merge_field(base_arr + override_arr)
    if keyed_field:
        return _merge_by_key(base_arr, override_arr, keyed_field)
    return base_arr + override_arr


def deep_merge(base, override):
    """Recursively merge override into base using structural rules.
    - Table + table: deep merge
    - Array + array: shape-aware (keyed merge if all items have code/id, else append)
    - Anything else: override wins
    """
    if isinstance(base, dict) and isinstance(override, dict):
        result = dict(base)
        for key, over_val in override.items():
            if key in result:
                result[key] = deep_merge(result[key], over_val)
            else:
                result[key] = over_val
        return result
    if isinstance(base, list) and isinstance(override, list):
        return _merge_arrays(base, override)
    return override


_MODULE_SKILLS_RE = re.compile(r"^(?P<module>[A-Za-z0-9_]+)-skills$")


def detect_skill_module(skill_dir: Path) -> str | None:
    """Walk up from the skill dir looking for an ancestor named `{module}-skills`.

    Returns the module slug (e.g. 'bmm', 'core') or None if the skill isn't
    inside a recognizable module tree (standalone skill, test fixture, etc.).
    """
    for ancestor in skill_dir.parents:
        match = _MODULE_SKILLS_RE.match(ancestor.name)
        if match:
            return match.group("module")
    return None


def resolve_global_dir() -> Path:
    """Locate the cross-platform global BMad config directory ($BMAD_HOME or ~/.bmad)."""
    override = os.environ.get("BMAD_HOME")
    if override:
        return Path(override).expanduser().resolve()
    return Path.home() / ".bmad"


def collect_customize_layers(project_root: Path | None, global_dir: Path) -> list[Path]:
    """Return customize.toml file paths in lowest→highest priority order.

    Four layers (all optional):
      1. {global-dir}/customize.toml          — global team / machine
      2. {global-dir}/customize.user.toml     — global personal
      3. _bmad/custom/customize.toml          — project team, committed
      4. _bmad/custom/customize.user.toml     — project personal, gitignored

    Installer-managed _bmad/config*.toml is NOT scanned: customize is a
    separate concern from identity, and the installer does not author it.
    """
    layers: list[Path] = [
        global_dir / "customize.toml",
        global_dir / "customize.user.toml",
    ]
    if project_root is not None:
        custom_dir = project_root / "_bmad" / "custom"
        layers.extend([
            custom_dir / "customize.toml",
            custom_dir / "customize.user.toml",
        ])
    return layers


def _pattern_specificity(pattern: str) -> tuple[int, int]:
    """Score a [skills.X] pattern for specificity ordering (ascending = less specific).

    Tier 2 (exact, no wildcards): most specific. Tie-break by pattern length.
    Tier 1 (wildcard, not pure '*'): mid. Longer patterns are more specific.
    Tier 0 (bare '*'): catchall.
    """
    if pattern == "*":
        return (0, 0)
    if "*" in pattern or "?" in pattern or "[" in pattern:
        return (1, len(pattern))
    return (2, len(pattern))


def extract_skill_overrides(layer_data: dict, qualified: str | None, bare: str) -> dict:
    """Build a single-skill override dict from a layer's [skills.X] table.

    Matches every pattern that fnmatches against the bare or qualified name,
    then deep-merges them in ascending specificity so the most specific wins.
    """
    skills_table = layer_data.get("skills")
    if not isinstance(skills_table, dict):
        return {}
    matched: list[tuple[tuple[int, int], dict]] = []
    for pattern, override in skills_table.items():
        if not isinstance(override, dict):
            continue
        if fnmatch.fnmatchcase(bare, pattern) or (
            qualified is not None and fnmatch.fnmatchcase(qualified, pattern)
        ):
            matched.append((_pattern_specificity(pattern), override))
    matched.sort(key=lambda item: item[0])
    result: dict = {}
    for _, override in matched:
        result = deep_merge(result, override)
    return result


def extract_key(data, dotted_key: str):
    parts = dotted_key.split(".")
    current = data
    for part in parts:
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return _MISSING
    return current


def write_json_stdout(output):
    """Write JSON as UTF-8 so Windows cp1252 stdout can carry emoji icons."""
    reconfigure = getattr(sys.stdout, "reconfigure", None)
    if reconfigure is not None:
        reconfigure(encoding="utf-8")
    sys.stdout.write(json.dumps(output, indent=2, ensure_ascii=False) + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="Resolve customization for a BMad skill using a layered TOML merge with [skills.X] cascade.",
        add_help=True,
    )
    parser.add_argument(
        "--skill", "-s", required=True,
        help="Absolute path to the skill directory (must contain customize.toml)",
    )
    parser.add_argument(
        "--key", "-k", action="append", default=[],
        help="Dotted field path to resolve (repeatable). Omit for full dump.",
    )
    args = parser.parse_args()

    skill_dir = Path(args.skill).resolve()
    skill_name = skill_dir.name
    module = detect_skill_module(skill_dir)
    qualified = f"{module}/{skill_name}" if module else None
    defaults_path = skill_dir / "customize.toml"

    defaults = load_toml(defaults_path, required=True)

    # Prefer the project that contains this skill. Only fall back to cwd if
    # the skill isn't inside a recognizable project tree (unusual but possible
    # for standalone skills invoked directly). Using cwd first is unsafe when
    # an ancestor of cwd happens to have a stray _bmad/ from another project.
    project_root = find_project_root(skill_dir) or find_project_root(Path.cwd())
    global_dir = resolve_global_dir()

    merged = defaults

    # Walk the customize layers low→high, applying any [skills.X] sections
    # that match this skill. This is the cross-cutting override surface:
    # users can cascade values across all skills, all skills in a module, or
    # one specific skill without editing per-skill files.
    for layer_path in collect_customize_layers(project_root, global_dir):
        layer_data = load_toml(layer_path)
        skill_override = extract_skill_overrides(layer_data, qualified, skill_name)
        if skill_override:
            merged = deep_merge(merged, skill_override)

    # Per-skill override files (highest priority — most explicit). These keep
    # working for back-compat and remain the right tool when an override is
    # large or wholly skill-specific.
    if project_root:
        custom_dir = project_root / "_bmad" / "custom"
        merged = deep_merge(merged, load_toml(custom_dir / f"{skill_name}.toml"))
        merged = deep_merge(merged, load_toml(custom_dir / f"{skill_name}.user.toml"))

    if args.key:
        output = {}
        for key in args.key:
            value = extract_key(merged, key)
            if value is not _MISSING:
                output[key] = value
    else:
        output = merged

    write_json_stdout(output)


if __name__ == "__main__":
    main()
