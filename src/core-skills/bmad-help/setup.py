#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""First-run pump: project this help skill's payload into
{project-root}/_bmad."""

from __future__ import annotations

import argparse
import json
import os
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
    for directory in (scripts_src, assets_src):
        if not directory.is_dir():
            raise Exception(f"missing directory: {directory}")
    for file in (config_src, user_src, catalog_src):
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
        # Seed staging from the live tree so ensure_* leaves present
        # paths alone. An empty staging would rewrite every file.
        if bmad.exists():
            shutil.copytree(
                bmad, staging, dirs_exist_ok=True, symlinks=True
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
        ensure_file(staging / "config.user.toml", user_text)
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
    path.write_text(
        content if content.endswith("\n") else content + "\n",
        encoding="utf-8",
    )


def ensure_copy(dest: Path, src: Path) -> None:
    if dest.exists() or dest.is_symlink():
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
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
