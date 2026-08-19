#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""First-run pump: project this help skill's payload into
{project-root}/_bmad."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import tempfile
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Materialize {project-root}/_bmad from this help "
            "skill's payload."
        )
    )
    parser.add_argument("--project-root", type=Path, required=True)
    parser.add_argument("--skill", type=Path, required=True)
    parser.add_argument("--user-answers", type=Path)
    args = parser.parse_args(argv)
    setup(
        args.project_root.resolve(),
        args.skill.resolve(),
        user_answers=(
            load_user_answers(args.user_answers)
            if args.user_answers is not None
            else None
        ),
    )
    return 0


def setup(
    project_root: Path,
    skill_root: Path,
    *,
    user_answers: tuple[str, str, str] | None = None,
) -> None:
    scripts_src, catalog_src, config_src, user_src = payload(skill_root)
    config_text = fill_team_config(
        config_src.read_text(encoding="utf-8"), project_root
    )
    user_text = None
    if user_answers is not None:
        user_text = fill_user_config(
            user_src.read_text(encoding="utf-8"), user_answers
        )
    materialize_bmad(
        project_root, scripts_src, catalog_src, config_text, user_text
    )
    ensure_dir(project_root / output_folder(config_text))


def payload(skill_root: Path) -> tuple[Path, Path, Path, Path]:
    scripts_src = skill_root / "scripts"
    assets_src = skill_root / "assets"
    config_src = assets_src / "config.template.toml"
    user_src = assets_src / "config.user.template.toml"
    catalog_src = assets_src / "bmad-help.csv"
    resolve_config = scripts_src / "resolve_config.py"
    for directory in (scripts_src, assets_src):
        if not directory.is_dir():
            raise Exception(f"missing directory: {directory}")
    for file in (resolve_config, config_src, user_src, catalog_src):
        if not file.is_file():
            raise Exception(f"missing file: {file}")
    return scripts_src, catalog_src, config_src, user_src


def load_user_answers(path: Path) -> tuple[str, str, str]:
    if not path.is_file():
        raise Exception(f"missing file: {path}")
    data = tomllib.loads(path.read_text(encoding="utf-8"))
    name = data.get("user_name")
    language = data.get("communication_language")
    level = data.get("user_skill_level")
    if (
        not isinstance(name, str)
        or not isinstance(language, str)
        or not isinstance(level, str)
    ):
        raise Exception(
            "--user-answers must set string keys user_name, "
            "communication_language, and user_skill_level"
        )
    return name, language, level


def fill_team_config(text: str, project_root: Path) -> str:
    return text.replace("{directory_name}", project_root.name)


def fill_user_config(text: str, answers: tuple[str, str, str]) -> str:
    name, language, level = answers
    return (
        text.replace("{user_name}", toml_string(name))
        .replace("{communication_language}", toml_string(language))
        .replace("{user_skill_level}", toml_string(level))
    )


def output_folder(config_text: str) -> str:
    folder = (
        tomllib.loads(config_text)
        .get("core", {})
        .get("output_folder", "_bmad-output")
    )
    prefix = "{project-root}/"
    if folder.startswith(prefix):
        folder = folder[len(prefix):]
    return folder or "_bmad-output"


def materialize_bmad(
    project_root: Path,
    scripts_src: Path,
    catalog_src: Path,
    config_text: str,
    user_text: str | None,
) -> None:
    bmad = project_root / "_bmad"
    project_root.mkdir(parents=True, exist_ok=True)
    staging = Path(
        tempfile.mkdtemp(prefix="_bmad.setup-", dir=project_root)
    )
    try:
        # Seed staging so custom/, extra *.user.toml, and leftovers
        # survive replace_dir.
        if bmad.exists():
            scripts = bmad / "scripts"

            def ignore_scripts_link(
                directory: str, _names: list[str]
            ) -> set[str]:
                if scripts.is_symlink() and Path(directory) == bmad:
                    return {"scripts"}
                return set()

            shutil.copytree(
                bmad,
                staging,
                dirs_exist_ok=True,
                symlinks=True,
                ignore=ignore_scripts_link,
            )
        stage_bmad(
            staging,
            scripts_src=scripts_src,
            catalog_src=catalog_src,
            config_text=config_text,
            user_text=user_text,
        )
        replace_dir(staging, bmad)
    except Exception:
        shutil.rmtree(staging, ignore_errors=True)
        raise


def replace_dir(src: Path, dest: Path) -> None:
    if not dest.exists():
        src.rename(dest)
        return
    backup = Path(
        tempfile.mkdtemp(prefix="_bmad.old-", dir=dest.parent)
    )
    try:
        dest.rename(backup)
    except Exception:
        shutil.rmtree(backup, ignore_errors=True)
        raise
    try:
        src.rename(dest)
    except Exception:
        backup.rename(dest)
        raise
    shutil.rmtree(backup)


def stage_bmad(
    staging: Path,
    *,
    scripts_src: Path,
    catalog_src: Path,
    config_text: str,
    user_text: str | None,
) -> None:
    parsed = tomllib.loads(config_text)
    core = stringify(parsed.get("core", {}))
    bmm = stringify(parsed.get("modules", {}).get("bmm", {}))
    ensure_scripts(staging / "scripts", scripts_src)
    ensure_file(staging / "config.toml", config_text)
    if user_text is not None:
        ensure_new(staging / "config.user.toml", user_text)
    ensure_file(staging / "core" / "config.yaml", render_module_yaml(core))
    ensure_file(
        staging / "bmm" / "config.yaml",
        render_module_yaml({**bmm, **core}),
    )
    ensure_dir(staging / "custom")
    ensure_copy(staging / "_config" / "bmad-help.csv", catalog_src)


def stringify(table: object) -> dict[str, str]:
    if not isinstance(table, dict):
        return {}
    out: dict[str, str] = {}
    for key, value in table.items():
        out[str(key)] = "" if value is None else str(value)
    return out


def ensure_scripts(dest: Path, src: Path) -> None:
    if dest.is_symlink() or dest.is_file():
        dest.unlink()
    elif dest.is_dir():
        dest_items = list(dest.iterdir())
        dest_files = {
            p.name: p.read_bytes()
            for p in dest_items
            if p.is_file() and not p.is_symlink()
        }
        src_files = {
            p.name: p.read_bytes() for p in src.iterdir() if p.is_file()
        }
        if len(dest_items) == len(dest_files) and dest_files == src_files:
            return
        shutil.rmtree(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.mkdir()
    for item in src.iterdir():
        if item.is_file():
            shutil.copy2(item, dest / item.name)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        content if content.endswith("\n") else content + "\n",
        encoding="utf-8",
    )


def ensure_new(path: Path, content: str) -> None:
    if path.exists() or path.is_symlink():
        return
    write_text(path, content)


def ensure_file(path: Path, content: str) -> None:
    if path.is_file():
        existing = path.read_text(encoding="utf-8")
        filled = (
            fill_yaml(existing, content)
            if path.suffix == ".yaml"
            else fill_toml(existing, content)
        )
        if filled == existing:
            return
        content = filled
    elif path.is_symlink():
        path.unlink()
    elif path.exists():
        shutil.rmtree(path)
    write_text(path, content)


def ensure_copy(dest: Path, src: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.is_symlink() or dest.is_file():
        dest.unlink()
    elif dest.exists():
        shutil.rmtree(dest)
    shutil.copy2(src, dest)


def ensure_dir(path: Path) -> None:
    if not path.exists():
        path.mkdir(parents=True)


def toml_string(value: str) -> str:
    escaped = (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t")
    )
    return f'"{escaped}"'


def toml_key(key: str) -> str:
    if key and key[0].isalpha() and all(c.isalnum() or c in "-_" for c in key):
        return key
    return toml_string(key)


def toml_value(value: object) -> str:
    if isinstance(value, str):
        return toml_string(value)
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        return str(value)
    if value is None:
        return '""'
    if isinstance(value, list):
        return "[ " + ", ".join(toml_value(item) for item in value) + " ]"
    return toml_string(str(value))


def fill_keep(template: object, existing: object) -> object:
    if isinstance(template, dict) and isinstance(existing, dict):
        result = dict(template)
        for key, value in existing.items():
            result[key] = (
                fill_keep(result[key], value) if key in result else value
            )
        return result
    return existing


def render_toml(data: dict) -> str:
    lines: list[str] = []

    def emit_scalars(table: dict) -> None:
        for key, value in table.items():
            if not isinstance(value, dict):
                lines.append(f"{toml_key(str(key))} = {toml_value(value)}")

    def emit_tables(table: dict, prefix: str) -> None:
        for key, value in table.items():
            if not isinstance(value, dict):
                continue
            header = f"{prefix}.{key}" if prefix else str(key)
            scalars = any(not isinstance(item, dict) for item in value.values())
            nested = any(isinstance(item, dict) for item in value.values())
            if scalars or not nested:
                if lines:
                    lines.append("")
                lines.append(f"[{header}]")
                emit_scalars(value)
            emit_tables(value, header)

    emit_scalars(data)
    emit_tables(data, "")
    return "\n".join(lines) + "\n"


def fill_toml(existing_text: str, template_text: str) -> str:
    try:
        existing = tomllib.loads(existing_text)
        template = tomllib.loads(template_text)
    except tomllib.TOMLDecodeError:
        return template_text
    if not isinstance(existing, dict) or not isinstance(template, dict):
        return template_text
    merged = fill_keep(template, existing)
    if merged == existing:
        return existing_text
    return render_toml(merged)


def parse_module_yaml(text: str) -> dict[str, str] | None:
    answers: dict[str, str] = {}
    for line in text.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if line[0] in " \t":
            return None
        key, sep, rest = line.partition(":")
        if not sep or not key or key.strip() != key:
            return None
        value = rest[1:] if rest.startswith(" ") else rest
        if value[:1] in "\"[{":
            try:
                decoded = json.loads(value)
            except json.JSONDecodeError:
                pass
            else:
                if decoded is None:
                    value = ""
                elif isinstance(decoded, str):
                    value = decoded
                else:
                    value = str(decoded)
        answers[key] = value
    return answers


def fill_yaml(existing_text: str, projection_text: str) -> str:
    existing = parse_module_yaml(existing_text)
    template = parse_module_yaml(projection_text)
    if existing is None or template is None:
        return projection_text
    merged = {**template, **existing}
    if merged == existing:
        return existing_text
    return render_module_yaml(merged)


def render_module_yaml(answers: dict[str, str]) -> str:
    lines = [f"{key}: {yaml_scalar(value)}" for key, value in answers.items()]
    return "\n".join(lines) + "\n"


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


if __name__ == "__main__":
    raise SystemExit(main())
