#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["jinja2>=3.1"]
# ///
"""Render a skill's Markdown sources into an immutable project snapshot."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
import tomllib
from datetime import date, time
from pathlib import Path
from typing import Any

import jinja2

# Installed scripts are consumer files, not a location for interpreter caches.
sys.dont_write_bytecode = True

from config_utils import (  # noqa: E402
    ConfigError,
    load_central_config,
    load_customization,
    load_toml,
    structural_merge,
)


class RenderError(ValueError):
    """Raised when rendering cannot safely publish a snapshot."""


class _ArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> None:
        raise RenderError(message)


_PARAMETER = r"[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*"


def _hash_bytes(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def _canonical_json(value: Any) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), default=_json_scalar).encode(
        "utf-8"
    )


def _json_scalar(value: Any) -> str:
    if isinstance(value, (date, time)):
        return value.isoformat()
    raise TypeError(f"unsupported JSON value: {type(value).__name__}")


def _toml_literal(text: str, label: str) -> Any:
    try:
        parsed = tomllib.loads(f"value = {text}")
    except tomllib.TOMLDecodeError as error:
        raise RenderError(f"invalid TOML value for {label}: {error}") from error
    if set(parsed) != {"value"}:
        raise RenderError(f"{label} must contain a single TOML value")
    return parsed["value"]


def _invocation_customization(
    defaults: dict[str, Any], overrides: Path | None, assignments: list[str]
) -> tuple[dict[str, Any], dict[str, Any]]:
    file_layer = load_toml(overrides, required=True) if overrides is not None else {}
    command_layer: dict[str, Any] = {}
    assigned: list[str] = []
    for assignment in assignments:
        path, separator, raw = assignment.partition("=")
        if not separator or re.fullmatch(_PARAMETER, path) is None:
            raise RenderError(f"invalid --set assignment {assignment!r}; expected bare dotted key=value")
        # A repeated or overlapping path is a caller mistake, not a precedence rule.
        for earlier in assigned:
            if path == earlier or path.startswith(f"{earlier}.") or earlier.startswith(f"{path}."):
                raise RenderError(f"--set `{path}` conflicts with earlier --set `{earlier}`")
        assigned.append(path)
        default = _lookup(defaults, path, "customization parameter")
        value = (
            raw if isinstance(default, str) and not raw.lstrip().startswith(('"', "'")) else _toml_literal(raw, path)
        )
        target = command_layer
        parts = path.split(".")
        for part in parts[:-1]:
            target = target.setdefault(part, {})
        target[parts[-1]] = value
    return file_layer, command_layer


def _leaf_paths(table: dict[str, Any], prefix: str = "") -> set[str]:
    leaves: set[str] = set()
    for key, value in table.items():
        path = f"{prefix}{key}"
        if isinstance(value, dict):
            leaves |= _leaf_paths(value, f"{path}.")
        else:
            leaves.add(path)
    return leaves


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
            "instruction": _require_string(item.get("instruction"), f"{item_label}.instruction", allow_empty=True),
        }
        if "when" in item:
            layer["when"] = _require_string(item["when"], f"{item_label}.when")
        result.append(layer)
    return result


def _load_sources(skill_dir: Path) -> dict[str, str]:
    sources: dict[str, str] = {}
    for candidate in sorted(skill_dir.rglob("*.md")):
        if candidate.name == "SKILL.md":
            continue
        name = candidate.relative_to(skill_dir).as_posix()
        path = candidate.resolve(strict=True)
        if not path.is_relative_to(skill_dir):
            raise RenderError(f"render source escapes skill directory: {name}")
        if not path.is_file():
            raise RenderError(f"render source is missing or not a file: {path}")
        try:
            sources[name] = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError) as error:
            raise RenderError(f"failed to read render source {path}: {error}") from error
    if "workflow.md" not in sources:
        raise RenderError(f"render entry is missing: {skill_dir / 'workflow.md'}")
    return sources


def _resolve_config_value(value: Any, label: str, project_root: Path) -> str:
    text = _require_string(value, label)
    if "{project-root}" not in text:
        return text
    resolved = text.replace("{project-root}", str(project_root))
    if not Path(resolved).is_absolute():
        raise RenderError(f"{label} must resolve to an absolute path: {resolved}")
    return resolved


def _find_config_values(data: Any, key: str, prefix: str = "") -> list[tuple[str, Any]]:
    matches: list[tuple[str, Any]] = []
    if not isinstance(data, dict):
        return matches
    for name, value in data.items():
        path = f"{prefix}.{name}" if prefix else name
        if name == key and not isinstance(value, (dict, list)):
            matches.append((path, value))
        matches.extend(_find_config_values(value, key, path))
    return matches


def _resolve_short_config(central: dict[str, Any], key: str, project_root: Path) -> tuple[str, str]:
    matches = _find_config_values(central, key)
    if not matches:
        raise RenderError(f"missing config value `{key}`")
    if len(matches) > 1:
        paths = ", ".join(path for path, _ in matches)
        raise RenderError(f"ambiguous config value `{key}` found at: {paths}")
    path, value = matches[0]
    return path, _resolve_config_value(value, f"config.{path}", project_root)


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


def _resolve_customization_value(value: Any, default: Any, label: str) -> Any:
    """Validate an effective customization leaf against the shape of its shipped default."""
    if isinstance(default, str):
        allow_empty = not default.strip() or label == "customization.workflow.open_spec"
        return _require_string(value, label, allow_empty=allow_empty)
    if isinstance(default, list):
        if default and all(isinstance(item, dict) for item in default):
            return _require_review_layers(value, label)
        return _require_string_list(value, label)
    if isinstance(default, (bool, int, float, date, time)):
        if type(value) is not type(default):
            raise RenderError(f"{label} must be {type(default).__name__}, got {type(value).__name__}")
        return value
    raise RenderError(f"{label} has unsupported default type {type(default).__name__}")


class _Text(str):
    """A customization string. Looping over one is a template mistake, not a walk over its characters."""

    def __new__(cls, value: str, label: str) -> _Text:
        text = super().__new__(cls, value)
        text.label = label
        return text

    def __iter__(self):
        raise RenderError(f"`{self.label}` is a string, not a list")


class _MarkdownList(list):
    """A string-list customization; inserted directly it renders as the Markdown list it always did."""

    def __str__(self) -> str:
        return _format_markdown_list(list(self))


class _LayerList(list):
    """A review-layer customization; inserted directly it renders as lens sections."""

    def __str__(self) -> str:
        return _format_review_layers(list(self))


def _bind_customization(value: Any, label: str, destination: Path) -> Any:
    """Bind `{skill-root}` in customization prose to the generation and wrap lists for insertion."""
    root = str(destination)
    if isinstance(value, str):
        return _Text(value.replace("{skill-root}", root), label)
    if isinstance(value, list):
        if value and all(isinstance(item, dict) for item in value):
            return _LayerList(
                [{key: text.replace("{skill-root}", root) for key, text in layer.items()} for layer in value]
            )
        return _MarkdownList([item.replace("{skill-root}", root) for item in value])
    return value


class _Table:
    """A dotted namespace over a TOML table. Names never hit Python attributes, so `workflow.items` is a lookup."""

    def __init__(self, path: str) -> None:
        self._path = path

    def _child(self, name: str) -> str:
        return f"{self._path}.{name}"

    def _resolve(self, name: str) -> Any:
        raise NotImplementedError

    def __getattr__(self, name: str) -> Any:
        if name.startswith("_"):
            raise AttributeError(name)
        return self._resolve(name)

    def __getitem__(self, name: Any) -> Any:
        if not isinstance(name, str):
            raise RenderError(f"`{self._path}` is indexed by name, not {name!r}")
        return self._resolve(name)

    def __str__(self) -> str:
        raise RenderError(f"`{self._path}` is a table, not a value")


class _ConfigTable(_Table):
    """`config.key` is the short lookup of one scalar anywhere in the central config; `config.a.b.c` is a path."""

    def __init__(self, central: dict[str, Any], table: dict[str, Any], path: str, ctx: _RenderContext) -> None:
        super().__init__(path)
        self._central = central
        self._table = table
        self._ctx = ctx

    def _resolve(self, name: str) -> Any:
        if self._path == "config" and name not in self._table:
            path, resolved = _resolve_short_config(self._central, name, self._ctx.project_root)
            self._ctx.inputs[f"config.{path}"] = resolved
            return _Text(resolved, f"config.{path}")
        label = self._child(name)
        if name not in self._table:
            raise RenderError(f"missing config value `{label.removeprefix('config.')}`")
        value = self._table[name]
        if isinstance(value, dict):
            return _ConfigTable(self._central, value, label, self._ctx)
        resolved = _resolve_config_value(value, label, self._ctx.project_root)
        self._ctx.inputs[label] = resolved
        return _Text(resolved, label)


class _CustomizationTable(_Table):
    """The effective customization, each leaf validated against its `customize.toml` default."""

    def __init__(self, defaults: dict[str, Any] | None, values: dict[str, Any], path: str, ctx: _RenderContext) -> None:
        super().__init__(path)
        self._defaults = defaults
        self._values = values
        self._ctx = ctx

    def _resolve(self, name: str) -> Any:
        path = self._child(name)
        if self._defaults is None:
            raise RenderError(f"`{path}` requires customize.toml")
        if name not in self._defaults:
            raise RenderError(f"missing customization parameter `{path}`")
        if name not in self._values:
            raise RenderError(f"missing customization value `{path}`")
        default, value = self._defaults[name], self._values[name]
        label = f"customization.{path}"
        if isinstance(default, dict):
            if not isinstance(value, dict):
                raise RenderError(f"{label} must be a table, got {type(value).__name__}")
            return _CustomizationTable(default, value, path, self._ctx)
        resolved = _resolve_customization_value(value, default, label)
        self._ctx.inputs[label] = resolved
        return _bind_customization(resolved, label, self._ctx.destination)


class _RenderContext:
    """One rendering pass: the values it serves and the rendered() links each source makes."""

    def __init__(
        self,
        *,
        central: dict[str, Any],
        defaults: dict[str, Any] | None,
        customization: dict[str, Any],
        source_names: set[str],
        project_root: Path,
        destination: Path,
    ) -> None:
        self.project_root = project_root
        self.destination = destination
        self.inputs: dict[str, Any] = {}
        self.links: dict[str, set[str]] = {}
        self._source_names = source_names
        self.variables = {
            "config": _ConfigTable(central, central, "config", self),
            "workflow": _CustomizationTable(
                None if defaults is None else defaults.get("workflow", {}),
                customization.get("workflow", {}),
                "workflow",
                self,
            ),
            "rendered": self._rendered,
        }

    @jinja2.pass_context
    def _rendered(self, context: jinja2.runtime.Context, target: Any) -> str:
        if not isinstance(target, str) or target not in self._source_names:
            raise RenderError(f"rendered() targets undeclared source: {target}")
        self.links.setdefault(context.name or "", set()).add(target)
        return str(self.destination / target)


class _SourceLoader(jinja2.BaseLoader):
    """Serve sources by name, and name them so template frames carry `source:line`."""

    def __init__(self, sources: dict[str, str]) -> None:
        self._sources = sources

    def get_source(self, environment: jinja2.Environment, template: str) -> tuple[str, str, Any]:
        if template not in self._sources:
            raise jinja2.TemplateNotFound(template)
        return self._sources[template], template, lambda: True


def _template_location(error: BaseException, source_names: set[str]) -> str | None:
    if isinstance(error, jinja2.TemplateSyntaxError):
        return f"{error.name}:{error.lineno}" if error.name else None
    location = None
    traceback = error.__traceback__
    while traceback is not None:
        filename = traceback.tb_frame.f_code.co_filename
        if filename in source_names:
            location = f"{filename}:{traceback.tb_lineno}"
        traceback = traceback.tb_next
    return location


def _render_sources(sources: dict[str, str], skill_dir: Path, context: _RenderContext) -> dict[str, str]:
    """Render every source as a Jinja2 template against the context; return the non-empty outputs."""
    # Skill sources name their bundled non-Markdown files (scripts, assets)
    # through {skill-root}; those stay in the installed skill directory.
    bound = {name: content.replace("{skill-root}", str(skill_dir)) for name, content in sources.items()}
    environment = jinja2.Environment(
        loader=_SourceLoader(bound),
        undefined=jinja2.StrictUndefined,
        autoescape=False,
        keep_trailing_newline=True,
        trim_blocks=True,
        lstrip_blocks=True,
    )
    rendered: dict[str, str] = {}
    for name in sources:
        try:
            rendered[name] = environment.get_template(name).render(context.variables)
        except Exception as error:
            location = _template_location(error, set(sources))
            message = str(error) if isinstance(error, (RenderError, ConfigError, jinja2.TemplateError)) else repr(error)
            raise RenderError(f"{location or name}: {message}") from error
    # A source whose body renders to nothing is left out; links into it from survivors are broken.
    omitted = {name for name, text in rendered.items() if not text.strip()}
    if "workflow.md" in omitted:
        raise RenderError("workflow.md: rendered empty")
    for name in sorted(set(rendered) - omitted):
        for target in sorted(context.links.get(name, set()) & omitted):
            raise RenderError(f"{name}: rendered() targets omitted source: {target}")
    return {name: text for name, text in rendered.items() if name not in omitted}


def _verify_existing(destination: Path, manifest: dict[str, Any]) -> None:
    manifest_path = destination / "manifest.json"
    try:
        existing = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise RenderError(f"corrupt existing generation {destination}: {error}") from error
    if existing != manifest:
        raise RenderError(f"generation collision or corruption at {destination}")
    expected_files = set(manifest["outputs"]) | {"manifest.json"}
    actual_files = {path.relative_to(destination).as_posix() for path in destination.rglob("*") if path.is_file()}
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
            json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True, default=_json_scalar).encode("utf-8")
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


def render(
    project_root: Path, skill_dir: Path, *, overrides: Path | None = None, assignments: list[str] | None = None
) -> Path:
    project_root = project_root.resolve(strict=True)
    skill_dir = skill_dir.resolve(strict=True)
    if not (project_root / "_bmad").is_dir():
        raise RenderError(f"project root does not contain _bmad/: {project_root}")

    sources = _load_sources(skill_dir)
    central = load_central_config(project_root)
    has_customization = bool(overrides is not None or assignments) or (skill_dir / "customize.toml").is_file()
    defaults = load_toml(skill_dir / "customize.toml", required=True) if has_customization else None
    customization = load_customization(project_root, skill_dir) if has_customization else {}
    supplied: set[str] = set()
    if defaults is not None:
        file_layer, command_layer = _invocation_customization(defaults, overrides, assignments or [])
        customization = structural_merge(structural_merge(customization, file_layer), command_layer)
        supplied = _leaf_paths(file_layer) | _leaf_paths(command_layer)

    source_hashes = {name: _hash_bytes(content.encode("utf-8")) for name, content in sources.items()}
    root_hash = _hash_bytes(str(project_root).encode("utf-8"))[:12]
    slug = re.sub(r"[^a-z0-9]+", "-", project_root.name.lower()).strip("-") or "project"
    slug = slug[:80].rstrip("-") or "project"
    namespace = project_root / "_bmad" / "render" / skill_dir.name / f"{slug}-{root_hash}"

    def render_pass(destination: Path) -> tuple[_RenderContext, dict[str, str]]:
        context = _RenderContext(
            central=central,
            defaults=defaults,
            customization=customization,
            source_names=set(sources),
            project_root=project_root,
            destination=destination,
        )
        return context, _render_sources(sources, skill_dir, context)

    # The generation path is keyed by the values the templates reach, and the
    # templates insert that path, so a first pass against a placeholder
    # destination collects the inputs and the real pass renders the output.
    probe, _ = render_pass(namespace / "pending")
    # An override may only name a key some template actually read; values are validated where consumed.
    unused = sorted(path for path in supplied if f"customization.{path}" not in probe.inputs)
    if unused:
        raise RenderError(f"invocation override not used by this render: {', '.join(unused)}")
    # Store TOML date/time inputs in the same JSON representation used on disk.
    input_values = json.loads(_canonical_json(probe.inputs))
    renderer_hash = _hash_bytes(Path(__file__).read_bytes())
    identity = {
        "project_root": str(project_root),
        "skill_root": str(skill_dir),
        "renderer_sha256": renderer_hash,
        "jinja2_version": jinja2.__version__,
        "resolved_values": input_values,
        "source_sha256": source_hashes,
    }
    generation_hash = _hash_bytes(_canonical_json(identity))[:20]
    destination = namespace / generation_hash
    _, rendered = render_pass(destination)
    outputs = {name: content.encode("utf-8") for name, content in rendered.items()}
    output_hashes = {name: _hash_bytes(content) for name, content in outputs.items()}
    manifest = {
        "schema_version": 1,
        "skill": skill_dir.name,
        "project_root": str(project_root),
        "project_slug": slug,
        "root_hash": root_hash,
        "generation_hash": generation_hash,
        "inputs": identity,
        "outputs": output_hashes,
    }
    _publish(destination, outputs, manifest)
    return destination / "workflow.md"


def main() -> int:
    parser = _ArgumentParser(description=__doc__)
    parser.add_argument("--project-root", required=True)
    parser.add_argument("--skill", required=True)
    parser.add_argument("--overrides", type=Path, help="invocation-only customization TOML file")
    parser.add_argument("--set", dest="assignments", action="append", default=[], metavar="KEY=VALUE")
    reconfigure = getattr(sys.stdout, "reconfigure", None)
    if reconfigure is not None:
        reconfigure(encoding="utf-8")
    try:
        args = parser.parse_args()
        entry = render(
            Path(args.project_root), Path(args.skill), overrides=args.overrides, assignments=args.assignments
        )
    except (ConfigError, RenderError, OSError, UnicodeError, ValueError) as error:
        sys.stdout.write(f"HALT: {' '.join(str(error).splitlines())}\n")
        return 1
    sys.stdout.write(f"read and follow {entry}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
