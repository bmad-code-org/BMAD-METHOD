"""Shared strict TOML loading and structural merge support."""

from __future__ import annotations

import sys
import tomllib
from collections.abc import Iterable
from pathlib import Path
from typing import Any


class ConfigError(ValueError):
    """Raised when a present configuration layer cannot be used safely."""


_KEYED_MERGE_FIELDS = ("code", "id")


def load_toml(path: Path, *, required: bool = False) -> dict[str, Any]:
    """Load a TOML table, allowing absence only for optional layers."""
    if not path.exists():
        if required:
            raise ConfigError(f"required TOML file not found: {path}")
        return {}
    if not path.is_file():
        raise ConfigError(f"TOML layer is not a file: {path}")
    try:
        with path.open("rb") as stream:
            parsed = tomllib.load(stream)
    except tomllib.TOMLDecodeError as error:
        raise ConfigError(f"failed to parse {path}: {error}") from error
    except OSError as error:
        raise ConfigError(f"failed to read {path}: {error}") from error
    if not isinstance(parsed, dict):
        raise ConfigError(f"TOML layer did not parse to a table: {path}")
    return parsed


def _detect_keyed_merge_field(items: list[Any]) -> str | None:
    if not items or not all(isinstance(item, dict) for item in items):
        return None
    for candidate in _KEYED_MERGE_FIELDS:
        if all(candidate in item for item in items):
            for item in items:
                value = item[candidate]
                if not isinstance(value, str):
                    raise ConfigError(
                        f"keyed array identifier `{candidate}` must be a string, got {type(value).__name__}"
                    )
                if not value:
                    raise ConfigError(f"keyed array identifier `{candidate}` must not be empty")
            return candidate
    return None


def _merge_arrays(base: list[Any], override: list[Any]) -> list[Any]:
    keyed_field = _detect_keyed_merge_field(base + override)
    if keyed_field is None:
        return list(base) + list(override)

    result: list[Any] = []
    index_by_key: dict[str, int] = {}
    for item in base:
        copied = dict(item)
        index_by_key[copied[keyed_field]] = len(result)
        result.append(copied)
    for item in override:
        copied = dict(item)
        key = copied[keyed_field]
        if key in index_by_key:
            result[index_by_key[key]] = copied
        else:
            index_by_key[key] = len(result)
            result.append(copied)
    return result


def structural_merge(base: Any, override: Any) -> Any:
    """Merge tables recursively, keyed table arrays by identity, and append other arrays."""
    if isinstance(base, dict) and isinstance(override, dict):
        result = dict(base)
        for key, value in override.items():
            result[key] = structural_merge(result[key], value) if key in result else value
        return result
    if isinstance(base, list) and isinstance(override, list):
        return _merge_arrays(base, override)
    return override


def merge_layers(layers: Iterable[dict[str, Any]]) -> dict[str, Any]:
    merged: dict[str, Any] = {}
    for layer in layers:
        merged = structural_merge(merged, layer)
    return merged


def load_central_config(project_root: Path) -> dict[str, Any]:
    bmad_dir = project_root / "_bmad"
    return merge_layers(
        (
            load_toml(bmad_dir / "config.toml", required=True),
            load_toml(bmad_dir / "custom" / "config.toml"),
            load_toml(bmad_dir / "custom" / "config.user.toml"),
        )
    )


def override_layers(project_root: Path | None, skill_name: str) -> tuple[Path, ...]:
    """A skill's team then personal override files, whether or not they exist."""
    if project_root is None:
        return ()
    custom_dir = project_root / "_bmad" / "custom"
    return (custom_dir / f"{skill_name}.toml", custom_dir / f"{skill_name}.user.toml")


def load_customization(project_root: Path | None, skill_dir: Path) -> dict[str, Any]:
    return merge_layers(
        (
            load_toml(skill_dir / "customize.toml", required=True),
            *(load_toml(layer) for layer in override_layers(project_root, skill_dir.name)),
        )
    )


def report_overrides(project_root: Path | None, skill_name: str) -> None:
    """Tell the agent, on stderr, to name the override files a starting skill runs with.

    People forget an override they wrote long ago, and a personal one is in no
    diff, so every run says which ones apply.
    """
    present = [
        f"`_bmad/custom/{layer.name}` ({'personal' if layer.name.endswith('.user.toml') else 'team'})"
        for layer in override_layers(project_root, skill_name)
        if layer.is_file()
    ]
    if present:
        sys.stderr.write(
            f"customization: before continuing, tell the user in one line that `{skill_name}` runs with overrides from "
            f"{' and '.join(present)}.\n"
        )
