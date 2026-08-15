#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""First-run pump: project this help skill's payload into {project-root}/_bmad."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

sys.dont_write_bytecode = True


class SetupError(Exception):
    """Raised when setup cannot create a complete first-run `_bmad`."""


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Materialize {project-root}/_bmad from this help skill's payload."
    )
    parser.add_argument("--project-root", type=Path, required=True)
    parser.add_argument("--skill", type=Path, required=True)
    args = parser.parse_args(argv)
    try:
        setup(args.project_root.resolve(), args.skill.resolve())
    except SetupError as error:
        sys.stderr.write(f"error: {error}\n")
        return 1
    return 0


def setup(project_root: Path, skill_root: Path) -> None:
    scripts_src = skill_root / "scripts"
    assets_src = skill_root / "assets"
    core_yaml = assets_src / "core" / "module.yaml"
    bmm_yaml = assets_src / "bmm" / "module.yaml"
    catalog_src = assets_src / "bmad-help.csv"
    for required in (scripts_src, assets_src, core_yaml, bmm_yaml, catalog_src):
        if required == scripts_src or required == assets_src:
            if not required.is_dir():
                raise SetupError(f"missing path: {required}")
        elif not required.is_file():
            raise SetupError(f"missing path: {required}")

    core_text = core_yaml.read_text(encoding="utf-8")
    bmm_text = bmm_yaml.read_text(encoding="utf-8")
    directory_name = project_root.name
    output_folder_default = _core_output_folder_default(core_text)
    core_code, core_answers, core_agents = project_module(
        core_text, directory_name=directory_name, output_folder_default=output_folder_default
    )
    bmm_code, bmm_answers, bmm_agents = project_module(
        bmm_text, directory_name=directory_name, output_folder_default=output_folder_default
    )

    bmad = project_root / "_bmad"
    created_new = not bmad.exists()
    staging: Path | None = None
    try:
        if created_new:
            project_root.mkdir(parents=True, exist_ok=True)
            staging = Path(tempfile.mkdtemp(prefix="_bmad.setup-", dir=project_root))
            target = staging
        else:
            target = bmad
        write_first_run(
            target,
            scripts_src=scripts_src,
            catalog_src=catalog_src,
            core_code=core_code,
            core_answers=core_answers,
            core_agents=core_agents,
            bmm_code=bmm_code,
            bmm_answers=bmm_answers,
            bmm_agents=bmm_agents,
        )
        if staging is not None:
            staging.rename(bmad)
            staging = None
    except Exception:
        if staging is not None:
            shutil.rmtree(staging, ignore_errors=True)
        elif created_new and bmad.exists():
            shutil.rmtree(bmad, ignore_errors=True)
        raise

    output_dir = project_root / output_folder_default
    if not output_dir.exists():
        output_dir.mkdir(parents=True)


def write_first_run(
    bmad: Path,
    *,
    scripts_src: Path,
    catalog_src: Path,
    core_code: str,
    core_answers: dict[str, str],
    core_agents: list[dict[str, str]],
    bmm_code: str,
    bmm_answers: dict[str, str],
    bmm_agents: list[dict[str, str]],
) -> None:
    ensure_scripts(bmad / "scripts", scripts_src)
    ensure_file(bmad / "config.toml", render_config_toml(
        core_answers=core_answers,
        bmm_code=bmm_code,
        bmm_answers=bmm_answers,
        agents=_agents_with_module(core_agents, core_code)
        + _agents_with_module(bmm_agents, bmm_code),
    ))
    ensure_file(bmad / "core" / "config.yaml", render_module_yaml(core_answers))
    ensure_file(
        bmad / "bmm" / "config.yaml",
        render_module_yaml({**bmm_answers, **core_answers}),
    )
    custom = bmad / "custom"
    if not custom.exists():
        custom.mkdir(parents=True)
    ensure_copy(bmad / "_config" / "bmad-help.csv", catalog_src)


def ensure_scripts(dest: Path, src: Path) -> None:
    if dest.exists() or dest.is_symlink():
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        os.symlink(src, dest, target_is_directory=True)
    except OSError:
        dest.mkdir()
        for item in src.iterdir():
            if item.is_file():
                shutil.copy2(item, dest / item.name)


def ensure_file(path: Path, content: str) -> None:
    if path.exists() or path.is_symlink():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content if content.endswith("\n") else content + "\n", encoding="utf-8")


def ensure_copy(dest: Path, src: Path) -> None:
    if dest.exists() or dest.is_symlink():
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)


def _core_output_folder_default(core_text: str) -> str:
    prompts = extract_prompt_keys(core_text)
    default = prompts.get("output_folder", {}).get("default", "_bmad-output")
    return default or "_bmad-output"


def project_module(
    text: str, *, directory_name: str, output_folder_default: str
) -> tuple[str, dict[str, str], list[dict[str, str]]]:
    code = extract_code(text)
    answers: dict[str, str] = {}
    for key, spec in extract_prompt_keys(text).items():
        default = spec.get("default", "")
        value = (
            default.replace("{directory_name}", directory_name).replace(
                "{output_folder}", output_folder_default
            )
        )
        result = spec.get("result", "{value}")
        answers[key] = result.replace("{value}", value)
    return code, answers, extract_agents(text)


def _agents_with_module(agents: list[dict[str, str]], module: str) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    for agent in agents:
        if "code" not in agent:
            continue
        item = dict(agent)
        item.setdefault("module", module)
        item.setdefault("team", module)
        out.append(item)
    return out


def render_config_toml(
    *,
    core_answers: dict[str, str],
    bmm_code: str,
    bmm_answers: dict[str, str],
    agents: list[dict[str, str]],
) -> str:
    lines: list[str] = []
    if core_answers:
        lines.append("[core]")
        for key, value in core_answers.items():
            lines.append(f"{key} = {toml_string(value)}")
        lines.append("")
    if bmm_answers:
        lines.append(f"[modules.{bmm_code or 'bmm'}]")
        for key, value in bmm_answers.items():
            lines.append(f"{key} = {toml_string(value)}")
        lines.append("")
    for agent in agents:
        lines.append(f"[agents.{agent['code']}]")
        for key in ("module", "team", "name", "title", "icon", "description"):
            if key in agent and agent[key] != "":
                lines.append(f"{key} = {toml_string(agent[key])}")
        lines.append("")
    return "\n".join(lines)


def render_module_yaml(answers: dict[str, str]) -> str:
    lines = [f"{key}: {yaml_scalar(value)}" for key, value in answers.items()]
    return "\n".join(lines) + "\n"


def toml_string(value: str) -> str:
    escaped = (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t")
    )
    return f'"{escaped}"'


def yaml_scalar(value: str) -> str:
    if (
        value == ""
        or value.strip() != value
        or value.lower() in {"true", "false", "null", "yes", "no", "on", "off"}
        or any(char in value for char in ":#{}[],&*!|>%@`'\"\n")
        or value[0] in "-?:"
    ):
        return json.dumps(value, ensure_ascii=False)
    return value


def extract_code(text: str) -> str:
    for raw in text.splitlines():
        line = strip_comment(raw)
        if not line or line[:1].isspace():
            continue
        if line.startswith("code:"):
            return parse_scalar(line.split(":", 1)[1])
    return ""


def extract_prompt_keys(text: str) -> dict[str, dict[str, str]]:
    """Top-level maps that declare default/result. Not a general YAML engine."""
    prompts: dict[str, dict[str, str]] = {}
    lines = text.splitlines()
    index = 0
    while index < len(lines):
        line = strip_comment(lines[index])
        if not line or line[:1].isspace() or ":" not in line:
            index += 1
            continue
        key, _, rest = line.partition(":")
        key = key.strip()
        if rest.strip() or not key:
            index += 1
            continue
        block: list[str] = []
        index += 1
        while index < len(lines):
            nxt = lines[index]
            stripped = strip_comment(nxt)
            if stripped and not nxt[:1].isspace():
                break
            block.append(stripped)
            index += 1
        spec: dict[str, str] = {}
        for item in block:
            item = item.strip()
            if item.startswith("default:"):
                spec["default"] = parse_scalar(item.split(":", 1)[1])
            elif item.startswith("result:"):
                spec["result"] = parse_scalar(item.split(":", 1)[1])
        if spec:
            prompts[key] = spec
    return prompts


def extract_agents(text: str) -> list[dict[str, str]]:
    """The `agents:` list of maps only. Not a general YAML engine."""
    lines = text.splitlines()
    start = None
    for index, raw in enumerate(lines):
        line = strip_comment(raw)
        if line == "agents:" or line.startswith("agents:"):
            if not raw[:1].isspace():
                start = index + 1
                break
    if start is None:
        return []

    agents: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for raw in lines[start:]:
        if raw and not raw[:1].isspace():
            break
        line = strip_comment(raw).strip()
        if not line:
            continue
        if line.startswith("- "):
            if current:
                agents.append(current)
            current = {}
            rest = line[2:]
            if ":" in rest:
                key, _, value = rest.partition(":")
                current[key.strip()] = parse_scalar(value)
            continue
        if current is not None and ":" in line:
            key, _, value = line.partition(":")
            current[key.strip()] = parse_scalar(value)
    if current:
        agents.append(current)
    return agents


def strip_comment(line: str) -> str:
    in_single = False
    in_double = False
    escape = False
    for index, char in enumerate(line):
        if escape:
            escape = False
            continue
        if char == "\\" and in_double:
            escape = True
            continue
        if char == "'" and not in_double:
            in_single = not in_single
        elif char == '"' and not in_single:
            in_double = not in_double
        elif char == "#" and not in_single and not in_double:
            return line[:index].rstrip()
    return line.rstrip()


def parse_scalar(raw: str) -> str:
    value = raw.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        inner = value[1:-1]
        if value[0] == '"':
            return (
                inner.replace("\\n", "\n")
                .replace("\\t", "\t")
                .replace("\\r", "\r")
                .replace('\\"', '"')
                .replace("\\\\", "\\")
            )
        return inner
    return value


if __name__ == "__main__":
    raise SystemExit(main())
