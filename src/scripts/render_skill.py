#!/usr/bin/env python3
"""Render a declarative skill contract into an immutable project snapshot."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path, PurePosixPath
from typing import Any

from config_utils import ConfigError, load_central_config, load_customization, load_toml


class RenderError(ValueError):
    """Raised when rendering cannot safely publish a snapshot."""


_COMPILE_TOKEN = re.compile(r"\{\{\.[A-Za-z0-9_]+\}\}")
_CUSTOM_TOKEN = re.compile(r"\{workflow\.[A-Za-z0-9_.-]+\}")
_SNAPSHOT_TOKEN = re.compile(r"\[\[bmad-snapshot:([A-Za-z0-9_./-]+\.md)\]\]")


def _hash_bytes(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def _canonical_json(value: Any) -> bytes:
    return json.dumps(
        value, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")


def _lookup(data: dict[str, Any], dotted_path: str, label: str) -> Any:
    current: Any = data
    for part in dotted_path.split("."):
        if not isinstance(current, dict) or part not in current:
            raise RenderError(f"missing {label} `{dotted_path}`")
        current = current[part]
    return current


def _require_string(value: Any, label: str, *, allow_empty: bool = False) -> str:
    if not isinstance(value, str):
        raise RenderError(f"{label} must be a string, got {type(value).__name__}")
    if not allow_empty and not value.strip():
        raise RenderError(f"{label} must not be empty")
    return value


def _require_string_list(value: Any, label: str) -> list[str]:
    if not isinstance(value, list):
        raise RenderError(f"{label} must be a list, got {type(value).__name__}")
    result = []
    for index, item in enumerate(value):
        result.append(_require_string(item, f"{label}[{index}]"))
    return result


def _require_review_layers(value: Any, label: str) -> list[dict[str, str]]:
    if not isinstance(value, list):
        raise RenderError(f"{label} must be a list of tables")
    result: list[dict[str, str]] = []
    seen: set[str] = set()
    for index, item in enumerate(value):
        item_label = f"{label}[{index}]"
        if not isinstance(item, dict):
            raise RenderError(f"{item_label} must be a table")
        identifier = _require_string(item.get("id"), f"{item_label}.id")
        if identifier in seen:
            raise RenderError(f"duplicate review layer id `{identifier}`")
        seen.add(identifier)
        layer = {
            "id": identifier,
            "name": _require_string(item.get("name", identifier), f"{item_label}.name"),
            "instruction": _require_string(
                item.get("instruction"), f"{item_label}.instruction", allow_empty=True
            ),
        }
        if "when" in item:
            layer["when"] = _require_string(item["when"], f"{item_label}.when")
        result.append(layer)
    return result


def _validate_contract(contract: dict[str, Any]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    render = contract.get("render")
    values = contract.get("values")
    if not isinstance(render, dict):
        raise RenderError("render.toml must contain a [render] table")
    if render.get("version") != 1:
        raise RenderError("render.version must be integer 1")
    _require_string(render.get("skill"), "render.skill")
    _require_string(render.get("entry"), "render.entry")
    sources = _require_string_list(render.get("sources"), "render.sources")
    normalized_sources = []
    for name in sources:
        normalized = PurePosixPath(name)
        if (
            normalized.is_absolute()
            or normalized.as_posix() != name
            or ".." in normalized.parts
            or name == "manifest.json"
        ):
            raise RenderError(f"unsafe render source path: {name}")
        normalized_sources.append(normalized.as_posix())
    if len(normalized_sources) != len(set(normalized_sources)):
        raise RenderError("render.sources contains duplicates")
    if "SKILL.md" in sources:
        raise RenderError("render.sources must exclude SKILL.md")
    if render["entry"] not in sources:
        raise RenderError("render.entry must be included in render.sources")
    if not isinstance(values, list) or not values:
        raise RenderError("render.toml must contain one or more [[values]] tables")
    for index, item in enumerate(values):
        if not isinstance(item, dict):
            raise RenderError(f"values[{index}] must be a table")
        for field in ("token", "source", "type", "format"):
            _require_string(item.get(field), f"values[{index}].{field}")
        if not (
            _COMPILE_TOKEN.fullmatch(item["token"])
            or _CUSTOM_TOKEN.fullmatch(item["token"])
        ):
            raise RenderError(
                f"values[{index}].token must be a compile-time token: {item['token']}"
            )
        if "allow_empty" in item and not isinstance(item["allow_empty"], bool):
            raise RenderError(f"values[{index}].allow_empty must be a boolean")
        if item["type"] not in {"string", "path", "list", "review-layers"}:
            raise RenderError(f"values[{index}].type is unsupported: {item['type']}")
        if item["format"] not in {"raw", "markdown-list", "review-layers"}:
            raise RenderError(f"values[{index}].format is unsupported: {item['format']}")
        expected_format = {
            "string": "raw",
            "path": "raw",
            "list": "markdown-list",
            "review-layers": "review-layers",
        }[item["type"]]
        if item["format"] != expected_format:
            raise RenderError(
                f"values[{index}] type `{item['type']}` requires format `{expected_format}`"
            )
        if not item["source"].startswith(("config.", "customization.")):
            raise RenderError(f"values[{index}].source must use config. or customization.")
    return render, values


def _load_sources(skill_dir: Path, names: list[str]) -> dict[str, str]:
    sources: dict[str, str] = {}
    for name in names:
        relative = Path(name)
        if relative.is_absolute() or ".." in relative.parts:
            raise RenderError(f"unsafe render source path: {name}")
        path = (skill_dir / relative).resolve(strict=True)
        if not path.is_relative_to(skill_dir):
            raise RenderError(f"render source escapes skill directory: {name}")
        if not path.is_file():
            raise RenderError(f"render source is missing or not a file: {path}")
        try:
            sources[name] = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as error:
            raise RenderError(f"failed to read render source {path}: {error}") from error
    return sources


def _resolve_value(
    definition: dict[str, Any],
    central: dict[str, Any],
    customization: dict[str, Any],
    project_root: Path,
) -> Any:
    source = definition["source"]
    if source.startswith("config."):
        value = _lookup(central, source.removeprefix("config."), "config value")
    else:
        value = _lookup(
            customization,
            source.removeprefix("customization."),
            "customization value",
        )
    label = f"{source} ({definition['type']})"
    value_type = definition["type"]
    if value_type == "string":
        return _require_string(
            value, label, allow_empty=definition.get("allow_empty", False)
        )
    if value_type == "path":
        text = _require_string(value, label).replace("{project-root}", str(project_root))
        path = Path(text)
        if not path.is_absolute():
            raise RenderError(f"{label} must resolve to an absolute path: {text}")
        return str(path)
    if value_type == "list":
        return _require_string_list(value, label)
    return _require_review_layers(value, label)


def _format_markdown_list(items: list[str]) -> str:
    if not items:
        return "_None._"
    rendered = []
    for item in items:
        lines = item.splitlines() or [""]
        rendered.append("- " + lines[0])
        rendered.extend("  " + line for line in lines[1:])
    return "\n".join(rendered)


def _format_review_layers(layers: list[dict[str, str]]) -> str:
    active = [layer for layer in layers if layer["instruction"].strip()]
    if not active:
        return "No active review layers. HALT with blocking condition `no active review layers`."
    sections = []
    for layer in active:
        section = [f"#### {layer['name']} (`{layer['id']}`)"]
        if layer.get("when"):
            section.extend(["", f"Run only when: {layer['when']}"])
        section.extend(["", layer["instruction"].strip()])
        sections.append("\n".join(section))
    return "\n\n".join(sections)


def _format_value(value: Any, format_name: str) -> str:
    if format_name == "raw":
        return value
    if format_name == "markdown-list":
        return _format_markdown_list(value)
    return _format_review_layers(value)


def _render_sources(
    sources: dict[str, str], definitions: list[dict[str, Any]], values: dict[str, Any]
) -> dict[str, str]:
    replacements = {
        definition["token"]: _format_value(values[definition["token"]], definition["format"])
        for definition in definitions
    }
    declared = set(replacements)
    for definition in definitions:
        token = definition["token"]
        occurrences = sum(content.count(token) for content in sources.values())
        if occurrences == 0:
            raise RenderError(f"declared render token is not referenced: {token}")
    token_pattern = re.compile("|".join(re.escape(token) for token in sorted(declared, key=len, reverse=True)))
    rendered: dict[str, str] = {}
    for name, content in sources.items():
        for pattern in (_COMPILE_TOKEN, _CUSTOM_TOKEN):
            for match in pattern.finditer(content):
                if match.group(0) not in declared:
                    raise RenderError(
                        f"unresolved compile-time token in {name}: {match.group(0)}"
                    )
        # One pass keeps replacement text opaque even when it resembles another token.
        rendered[name] = token_pattern.sub(lambda match: replacements[match.group(0)], content)
    return rendered


def _replace_snapshot_refs(sources: dict[str, str], destination: Path) -> dict[str, str]:
    """Resolve only tokens authored in installed sources, before custom text is inserted."""
    source_names = set(sources)

    def replace(match: re.Match[str]) -> str:
        target = match.group(1)
        if target not in source_names:
            raise RenderError(f"snapshot reference targets undeclared source: {target}")
        return str(destination / target)

    resolved: dict[str, str] = {}
    for name, content in sources.items():
        final = _SNAPSHOT_TOKEN.sub(replace, content)
        resolved[name] = final
    return resolved


def _verify_existing(destination: Path, manifest: dict[str, Any]) -> None:
    manifest_path = destination / "manifest.json"
    try:
        existing = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise RenderError(f"corrupt existing generation {destination}: {error}") from error
    if existing != manifest:
        raise RenderError(f"generation collision or corruption at {destination}")
    expected_files = set(manifest["outputs"]) | {"manifest.json"}
    actual_files = {
        path.relative_to(destination).as_posix()
        for path in destination.rglob("*")
        if path.is_file()
    }
    if actual_files != expected_files:
        raise RenderError(f"generation contains unexpected or missing files: {destination}")
    for name, expected_hash in manifest["outputs"].items():
        try:
            actual_hash = _hash_bytes((destination / name).read_bytes())
        except OSError as error:
            raise RenderError(f"failed to verify {destination / name}: {error}") from error
        if actual_hash != expected_hash:
            raise RenderError(f"generation output hash mismatch: {destination / name}")


def _publish(destination: Path, outputs: dict[str, bytes], manifest: dict[str, Any]) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        _verify_existing(destination, manifest)
        return
    staging = Path(tempfile.mkdtemp(prefix=".staging-", dir=destination.parent))
    try:
        for name, content in outputs.items():
            path = staging / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
        (staging / "manifest.json").write_bytes(
            json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True).encode("utf-8")
            + b"\n"
        )
        try:
            os.rename(staging, destination)
        except OSError:
            if destination.exists():
                _verify_existing(destination, manifest)
            else:
                raise
    finally:
        if staging.exists():
            shutil.rmtree(staging, ignore_errors=True)


def render(project_root: Path, skill_dir: Path) -> Path:
    project_root = project_root.resolve(strict=True)
    skill_dir = skill_dir.resolve(strict=True)
    if not (project_root / "_bmad").is_dir():
        raise RenderError(f"project root does not contain _bmad/: {project_root}")

    contract_path = skill_dir / "render.toml"
    contract = load_toml(contract_path, required=True)
    render_config, definitions = _validate_contract(contract)
    if render_config["skill"] != skill_dir.name:
        raise RenderError(
            f"render.skill `{render_config['skill']}` does not match {skill_dir.name}"
        )
    sources = _load_sources(skill_dir, render_config["sources"])
    central = load_central_config(project_root)
    customization = load_customization(project_root, skill_dir)

    resolved: dict[str, Any] = {}
    input_values: dict[str, Any] = {}
    for definition in definitions:
        token = definition["token"]
        if token in resolved:
            raise RenderError(f"duplicate render token: {token}")
        value = _resolve_value(definition, central, customization, project_root)
        resolved[token] = value
        input_values[definition["source"]] = value
    source_hashes = {
        name: _hash_bytes(content.encode("utf-8")) for name, content in sources.items()
    }
    root_hash = _hash_bytes(str(project_root).encode("utf-8"))[:12]
    slug = re.sub(r"[^a-z0-9]+", "-", project_root.name.lower()).strip("-") or "project"
    slug = slug[:80].rstrip("-") or "project"
    renderer_hash = _hash_bytes(Path(__file__).read_bytes())
    identity = {
        "contract_sha256": _hash_bytes(contract_path.read_bytes()),
        "project_root": str(project_root),
        "renderer_sha256": renderer_hash,
        "resolved_values": input_values,
        "source_sha256": source_hashes,
    }
    generation_hash = _hash_bytes(_canonical_json(identity))[:20]
    destination = (
        project_root
        / "_bmad"
        / "render"
        / render_config["skill"]
        / f"{slug}-{root_hash}"
        / generation_hash
    )
    referenced_sources = _replace_snapshot_refs(sources, destination)
    rendered = _render_sources(referenced_sources, definitions, resolved)
    outputs = {name: content.encode("utf-8") for name, content in rendered.items()}
    output_hashes = {name: _hash_bytes(content) for name, content in outputs.items()}
    manifest = {
        "schema_version": 1,
        "skill": render_config["skill"],
        "project_root": str(project_root),
        "project_slug": slug,
        "root_hash": root_hash,
        "generation_hash": generation_hash,
        "inputs": identity,
        "outputs": output_hashes,
    }
    _publish(destination, outputs, manifest)
    return destination / render_config["entry"]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project-root", required=True)
    parser.add_argument("--skill", required=True)
    args = parser.parse_args()
    reconfigure = getattr(sys.stdout, "reconfigure", None)
    if reconfigure is not None:
        reconfigure(encoding="utf-8")
    try:
        entry = render(Path(args.project_root), Path(args.skill))
    except (ConfigError, RenderError, OSError, UnicodeError, ValueError) as error:
        sys.stdout.write(f"HALT: {error}\n")
        return 1
    sys.stdout.write(f"read and follow {entry}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
