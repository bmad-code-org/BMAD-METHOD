#!/usr/bin/env python3
"""
Resolve BMad's central config using a layered TOML merge.

Reads from up to seven tiers (highest priority last):
  0. {project-root}/_bmad/{module}/module.toml     (shipped module defaults — floor)
  1. {global-dir}/config.toml                      (global team / machine defaults)
  2. {global-dir}/config.user.toml                 (global personal defaults)
  3. {project-root}/_bmad/config.toml              (installer-owned team)
  4. {project-root}/_bmad/config.user.toml         (installer-owned user)
  5. {project-root}/_bmad/custom/config.toml       (human-authored team, committed)
  6. {project-root}/_bmad/custom/config.user.toml  (human-authored user, gitignored)

Tier 0 ("module floor") carries each installed module's shipped defaults:
its [modules.X] paths and [agents.X] roster. Authors write module.yaml at
source; the installer converts to module.toml at install-time, giving the
resolver a TOML-only read path (no PyYAML dependency). Discovery is by
glob: any subdirectory of _bmad/ containing a module.toml counts.

All layers are optional. If a file is missing it is silently skipped.
If no file is found anywhere, an empty object is emitted.

{global-dir} resolves to $BMAD_HOME if set, otherwise ~/.bmad. Path.home()
gives the right answer on macOS, Linux, WSL, and Windows.

--project-root is optional. With no project root, only the global layers
are consulted (useful for standalone skill invocations).

Outputs merged JSON to stdout. Errors go to stderr.

Requires Python 3.11+ (uses stdlib `tomllib`). No `uv`, no `pip install`,
no virtualenv — plain `python3` is sufficient.

  python3 resolve_config.py --project-root /abs/path/to/project
  python3 resolve_config.py --project-root ... --key core
  python3 resolve_config.py --project-root ... --key agents
  python3 resolve_config.py                              # global only

Merge rules (same as resolve_customization.py):
  - Scalars: override wins
  - Tables: deep merge
  - Arrays of tables where every item shares `code` or `id`: merge by that key
  - All other arrays: append
"""

import argparse
import json
import os
import sys
from pathlib import Path

try:
    import tomllib
except ImportError:
    sys.stderr.write(
        "error: Python 3.11+ is required (stdlib `tomllib` not found).\n"
    )
    sys.exit(3)


_MISSING = object()
_KEYED_MERGE_FIELDS = ("code", "id")


def load_toml(file_path: Path, required: bool = False) -> dict:
    if not file_path.exists():
        if required:
            sys.stderr.write(f"error: required config file not found: {file_path}\n")
            sys.exit(1)
        return {}
    try:
        with file_path.open("rb") as f:
            parsed = tomllib.load(f)
        if not isinstance(parsed, dict):
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
    base_arr = base if isinstance(base, list) else []
    override_arr = override if isinstance(override, list) else []
    keyed_field = _detect_keyed_merge_field(base_arr + override_arr)
    if keyed_field:
        return _merge_by_key(base_arr, override_arr, keyed_field)
    return base_arr + override_arr


def deep_merge(base, override):
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


def resolve_global_dir() -> Path:
    """Locate the cross-platform global BMad config directory.

    Honors $BMAD_HOME (useful for CI, multi-account setups, or relocating
    config off a slow network home). Otherwise ~/.bmad — Path.home() does
    the right thing on macOS, Linux, WSL, and Windows.
    """
    override = os.environ.get("BMAD_HOME")
    if override:
        return Path(override).expanduser().resolve()
    return Path.home() / ".bmad"


def collect_module_layers(project_root: Path | None) -> list[Path]:
    """Return per-module module.toml paths discovered in this project.

    Floor of the resolver chain — these are the shipped module defaults
    that the installer realizes from source module.yaml on install. Authors
    don't edit module.toml directly; it's a build artifact.

    Discovery is purely file-system based: any direct subdirectory of
    _bmad/ that contains a module.toml is treated as an installed module.
    Returned in sorted order for deterministic merge order (irrelevant
    in practice because modules don't share keys — each writes its own
    [modules.{code}] and own [agents.{agent-code}] entries — but
    determinism is cheap).
    """
    if project_root is None:
        return []
    bmad_dir = project_root / "_bmad"
    if not bmad_dir.is_dir():
        return []
    return sorted(bmad_dir.glob("*/module.toml"))


def collect_config_layers(project_root: Path | None, global_dir: Path) -> list[tuple[str, Path]]:
    """Return (label, path) pairs in lowest→highest priority order.

    All layers are optional; load_toml returns {} for any missing file.
    """
    layers: list[tuple[str, Path]] = [
        ("global team", global_dir / "config.toml"),
        ("global user", global_dir / "config.user.toml"),
    ]
    if project_root is not None:
        bmad_dir = project_root / "_bmad"
        layers.extend([
            ("project team", bmad_dir / "config.toml"),
            ("project user", bmad_dir / "config.user.toml"),
            ("project custom team", bmad_dir / "custom" / "config.toml"),
            ("project custom user", bmad_dir / "custom" / "config.user.toml"),
        ])
    return layers


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
        description="Resolve BMad central config using a layered TOML merge.",
    )
    parser.add_argument(
        "--project-root", "-p", required=False, default=None,
        help="Absolute path to the project root (contains _bmad/). Optional — "
             "if omitted, only global layers ($BMAD_HOME or ~/.bmad) are read.",
    )
    parser.add_argument(
        "--key", "-k", action="append", default=[],
        help="Dotted field path to resolve (repeatable). Omit for full dump.",
    )
    args = parser.parse_args()

    project_root = Path(args.project_root).resolve() if args.project_root else None
    global_dir = resolve_global_dir()

    # If the caller explicitly named a project root, that's a promise it exists
    # and has been installed. Fail loudly on a missing _bmad/ rather than
    # silently returning {} — that masked broken installs in the old required=
    # True behavior. Global-only mode (no --project-root) stays permissive.
    if project_root is not None and not (project_root / "_bmad").is_dir():
        sys.stderr.write(
            f"error: --project-root {project_root} has no _bmad/ directory "
            f"(install not present, or wrong path)\n"
        )
        sys.exit(1)

    merged: dict = {}
    # Floor: per-module shipped defaults (lowest priority).
    for module_toml in collect_module_layers(project_root):
        merged = deep_merge(merged, load_toml(module_toml))
    # Then global → project → custom config layers on top.
    for _label, path in collect_config_layers(project_root, global_dir):
        merged = deep_merge(merged, load_toml(path))

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
