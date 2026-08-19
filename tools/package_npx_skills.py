#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""Flatten Method skills into a skills/<canonical-id>/ tree for npx skills add.

Walk src/core-skills and src/bmm-skills, discard agents/plan/ship nesting,
skip v6-shims and bmad-help, and fan each module's validated, versioned manifest
and declared scripts into all of that module's packaged skills. The bmad skill
also receives the shared Python runtime used by npx setup.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Any

import yaml
from yaml.constructor import ConstructorError


SOURCE_MODULES = (("src/core-skills", "core"), ("src/bmm-skills", "bmm"))
SOURCE_ROOTS = tuple(root for root, _module in SOURCE_MODULES)
MANIFEST_NAME = "module-manifest.md"
V6_SHIMS = "v6-shims"
EXCLUDED_SKILLS = frozenset({"bmad-help"})
SHARED_SCRIPTS = (
    "resolve_config.py",
    "resolve_customization.py",
    "config_utils.py",
    "memlog.py",
    "render_skill.py",
)
AUTHORED_MANIFEST_KEYS = frozenset(
    {"module", "update_source", "config_questions", "scripts"}
)
QUESTION_KEYS = frozenset({"key", "prompt", "default"})
UPDATE_SOURCE_PREFIXES = ("github:", "https://", "file:")
SKIP_NAMES = (".DS_Store", "Thumbs.db", "desktop.ini", "__pycache__")
SKIP_SUFFIXES = ("~", ".swp", ".swo", ".bak", ".pyc", ".pyo")
FRONTMATTER = re.compile(
    r"\A---(?P<newline>\r?\n)(?P<yaml>.*?)^---(?:\r?\n|\Z)", re.DOTALL | re.MULTILINE
)


class UniqueKeyLoader(yaml.SafeLoader):
    """Safe YAML loader that rejects silently overwritten mapping keys."""


def construct_unique_mapping(
    loader: UniqueKeyLoader, node: yaml.MappingNode, deep: bool = False
) -> dict[Any, Any]:
    seen: set[Any] = set()
    for key_node, _value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        try:
            duplicate = key in seen
        except TypeError as error:
            raise ConstructorError(
                "while constructing a mapping",
                node.start_mark,
                "found an unhashable key",
                key_node.start_mark,
            ) from error
        if duplicate:
            raise ConstructorError(
                "while constructing a mapping",
                node.start_mark,
                f"found duplicate key {key!r}",
                key_node.start_mark,
            )
        seen.add(key)
    return yaml.SafeLoader.construct_mapping(loader, node, deep=deep)


UniqueKeyLoader.add_constructor(
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, construct_unique_mapping
)


@dataclass(frozen=True)
class ModulePackage:
    source_root: Path
    module: str
    manifest: bytes
    scripts: tuple[tuple[PurePosixPath, bytes], ...]
    skills: tuple[Path, ...]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Flatten Method skills into a skills/<canonical-id>/ tree."
    )
    parser.add_argument("--repo-root", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args(argv)
    package(args.repo_root.resolve(), args.out.resolve())
    return 0


def package(repo_root: Path, out: Path) -> None:
    validate_source_roots(repo_root)
    version = package_version(repo_root)
    stamp = stamped_version(repo_root, version)
    modules = module_packages(repo_root, stamp)

    with tempfile.TemporaryDirectory() as tmp:
        staging = Path(tmp) / "skills"
        staging.mkdir()
        for module in modules:
            for src in module.skills:
                dest = staging / src.name
                shutil.copytree(src, dest, ignore=ignore_junk)
                (dest / "assets" / "bmad-help.csv").unlink(missing_ok=True)
                (dest / MANIFEST_NAME).write_bytes(module.manifest)
                for relative, script_bytes in module.scripts:
                    script_dest = dest.joinpath(*relative.parts)
                    script_dest.parent.mkdir(parents=True, exist_ok=True)
                    script_dest.write_bytes(script_bytes)

        ensure_packaged_manifests(staging, modules)
        dest_bmad = staging / "bmad"
        if dest_bmad.is_dir():
            copy_scripts_and_assets(repo_root, dest_bmad)
        replace_dest_skills(staging, out)


def validate_source_roots(repo_root: Path) -> None:
    missing = [root for root in source_roots(repo_root) if not root.is_dir()]
    if missing:
        named = ", ".join(str(path) for path in missing)
        raise FileNotFoundError(f"missing source root: {named}")


def source_roots(repo_root: Path) -> tuple[Path, ...]:
    return tuple(repo_root / Path(rel) for rel in SOURCE_ROOTS)


def skills(repo_root: Path) -> list[Path]:
    return [skill for root in source_roots(repo_root) for skill in skills_in(root)]


def skills_in(root: Path) -> list[Path]:
    found: list[Path] = []
    for skill_md in sorted(root.rglob("SKILL.md")):
        if V6_SHIMS in skill_md.parts:
            continue
        if skill_md.parent.name in EXCLUDED_SKILLS:
            continue
        if skill_md.is_file():
            found.append(skill_md.parent)
    return found


def module_packages(repo_root: Path, stamp: str) -> tuple[ModulePackage, ...]:
    packages: list[ModulePackage] = []
    for root_rel, expected_module in SOURCE_MODULES:
        root = repo_root / root_rel
        owned_skills = tuple(skills_in(root))
        manifest_path = root / MANIFEST_NAME
        module, rendered, scripts = load_module_manifest(
            manifest_path, root, owned_skills, stamp
        )
        if module != expected_module:
            raise ValueError(
                f"authored manifest {manifest_path} field 'module' must be "
                f"{expected_module!r}, not {module!r}"
            )
        packages.append(
            ModulePackage(root, module, rendered, scripts, owned_skills)
        )
    return tuple(packages)


def load_module_manifest(
    path: Path, source_root: Path, owned_skills: tuple[Path, ...], stamp: str
) -> tuple[str, bytes, tuple[tuple[PurePosixPath, bytes], ...]]:
    try:
        source = path.read_bytes().decode("utf-8")
    except (OSError, UnicodeError) as error:
        raise ValueError(f"cannot read authored manifest {path}: {error}") from error

    match = FRONTMATTER.match(source)
    if match is None:
        raise ValueError(f"invalid frontmatter in authored manifest {path}")
    try:
        data = yaml.load(match.group("yaml"), Loader=UniqueKeyLoader)
    except yaml.YAMLError as error:
        raise ValueError(f"invalid YAML frontmatter in authored manifest {path}: {error}") from error
    if not isinstance(data, dict):
        raise ValueError(f"frontmatter in authored manifest {path} must be a mapping")
    for key in data:
        if not isinstance(key, str):
            raise ValueError(f"authored manifest {path} has non-string field {key!r}")
    if "version" in data:
        raise ValueError(f"authored manifest {path} must not contain field 'version'")
    unknown = sorted(set(data) - AUTHORED_MANIFEST_KEYS)
    if unknown:
        raise ValueError(f"authored manifest {path} has unknown field {unknown[0]!r}")

    module = required_string(data, "module", path)
    update_source = required_string(data, "update_source", path)
    source_prefix = next(
        (prefix for prefix in UPDATE_SOURCE_PREFIXES if update_source.startswith(prefix)),
        None,
    )
    if source_prefix is None or not update_source.removeprefix(source_prefix):
        raise ValueError(
            f"authored manifest {path} field 'update_source' must start with "
            "'github:', 'https://', or 'file:' and name a source"
        )
    if source_prefix == "github:":
        github_parts = update_source.removeprefix(source_prefix).split("/")
        if len(github_parts) < 3 or any(not part for part in github_parts):
            raise ValueError(
                f"authored manifest {path} field 'update_source' github source "
                "must name owner/repo/path"
            )
    if source_prefix == "https://" and any(
        character.isspace() for character in update_source
    ):
        raise ValueError(
            f"authored manifest {path} field 'update_source' must be a valid HTTPS URL"
        )
    validate_questions(data.get("config_questions"), module, path)
    scripts = validate_scripts(data.get("scripts"), source_root, path)

    body = source[match.end() :]
    for skill in owned_skills:
        skill_id = skill.name
        if re.search(
            rf"(?<![a-z0-9-]){re.escape(skill_id)}(?![a-z0-9-])", body
        ) is None:
            raise ValueError(
                f"authored manifest {path} body omits packaged skill {skill_id!r}"
            )

    newline = match.group("newline")
    insertion = f"version: {stamp}{newline}"
    rendered = source[: match.start("yaml")] + insertion + source[match.start("yaml") :]
    return module, rendered.encode("utf-8"), scripts


def required_string(data: dict[str, Any], field: str, path: Path) -> str:
    value = data.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(
            f"authored manifest {path} field {field!r} must be a non-empty string"
        )
    return value


def validate_questions(value: Any, module: str, path: Path) -> None:
    if value is None:
        return
    if not isinstance(value, list):
        raise ValueError(
            f"authored manifest {path} field 'config_questions' must be a list"
        )
    seen: list[str] = []
    for index, question in enumerate(value):
        field = f"config_questions[{index}]"
        if not isinstance(question, dict):
            raise ValueError(f"authored manifest {path} field {field} must be a mapping")
        keys = set(question)
        if keys != QUESTION_KEYS:
            missing = sorted(QUESTION_KEYS - keys)
            unknown = sorted(keys - QUESTION_KEYS, key=str)
            detail = f"missing key {missing[0]!r}" if missing else f"unknown key {unknown[0]!r}"
            raise ValueError(f"authored manifest {path} field {field} has {detail}")
        for key in QUESTION_KEYS:
            if not isinstance(question[key], str):
                raise ValueError(
                    f"authored manifest {path} field {field}.{key} must be a string"
                )
        if not question["prompt"].strip():
            raise ValueError(
                f"authored manifest {path} field {field}.prompt must be non-empty"
            )
        key = question["key"]
        if not key or any(
            not part or part != part.strip() for part in key.split(".")
        ):
            raise ValueError(
                f"authored manifest {path} field {field}.key must be a non-empty dotted key"
            )
        if key == module or key.startswith(f"{module}."):
            raise ValueError(
                f"authored manifest {path} field {field}.key {key!r} "
                f"must not start with module {module!r}"
            )
        conflict = conflicting_question_key(seen, key)
        if conflict is not None:
            raise ValueError(
                f"authored manifest {path} field {field}.key {key!r} "
                f"conflicts with {conflict!r}"
            )
        seen.append(key)


def conflicting_question_key(keys: list[str], candidate: str) -> str | None:
    for key in keys:
        if (
            key == candidate
            or key.startswith(f"{candidate}.")
            or candidate.startswith(f"{key}.")
        ):
            return key
    return None


def validate_scripts(
    value: Any, source_root: Path, path: Path
) -> tuple[tuple[PurePosixPath, bytes], ...]:
    if value is None:
        return ()
    if not isinstance(value, list):
        raise ValueError(f"authored manifest {path} field 'scripts' must be a list")
    validated: list[tuple[PurePosixPath, bytes]] = []
    root = source_root.resolve()
    for entry in value:
        if not isinstance(entry, str) or not entry:
            raise ValueError(
                f"authored manifest {path} field 'scripts' has invalid value {entry!r}"
            )
        relative = PurePosixPath(entry)
        unsafe = (
            relative.is_absolute()
            or "\\" in entry
            or len(relative.parts) < 2
            or relative.parts[0] != "scripts"
            or ".." in relative.parts
            or "." in relative.parts
        )
        if unsafe:
            raise ValueError(
                f"authored manifest {path} field 'scripts' has unsafe value {entry!r}"
            )
        candidate = root.joinpath(*relative.parts)
        try:
            resolved = candidate.resolve(strict=True)
            resolved.relative_to(root)
        except (FileNotFoundError, RuntimeError, ValueError) as error:
            raise ValueError(
                f"authored manifest {path} field 'scripts' has invalid value {entry!r}"
            ) from error
        if not resolved.is_file():
            raise ValueError(
                f"authored manifest {path} field 'scripts' value {entry!r} is not a file"
            )
        try:
            script_bytes = resolved.read_bytes()
        except OSError as error:
            raise ValueError(
                f"authored manifest {path} field 'scripts' cannot read value {entry!r}"
            ) from error
        validated.append((relative, script_bytes))
    return tuple(validated)


def package_version(repo_root: Path) -> str:
    path = repo_root / "package.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise ValueError(f"cannot read package version from {path}: {error}") from error
    version = data.get("version") if isinstance(data, dict) else None
    if not isinstance(version, str) or not is_semver(version):
        raise ValueError(f"package version in {path} must be valid semver without build metadata")
    return version


def is_semver(value: str) -> bool:
    if "+" in value:
        return False
    core, separator, prerelease = value.partition("-")
    numbers = core.split(".")
    if len(numbers) != 3 or any(
        not part.isascii()
        or not part.isdigit()
        or (len(part) > 1 and part.startswith("0"))
        for part in numbers
    ):
        return False
    if not separator:
        return True
    identifiers = prerelease.split(".")
    return bool(prerelease) and all(
        identifier
        and all(
            character.isascii() and (character.isalnum() or character == "-")
            for character in identifier
        )
        and not (identifier.isdigit() and len(identifier) > 1 and identifier.startswith("0"))
        for identifier in identifiers
    )


def stamped_version(repo_root: Path, version: str) -> str:
    commit = git_output(repo_root, "rev-parse", "--short", "HEAD")
    clean = git_output(repo_root, "status", "--porcelain")
    tags = git_output(repo_root, "tag", "--points-at", "HEAD")
    if commit is not None and clean == "" and tags is not None:
        if f"v{version}" in tags.splitlines():
            return version
    return f"{version}-dev.g{commit}" if commit else f"{version}-dev"


def git_output(repo_root: Path, *args: str) -> str | None:
    try:
        result = subprocess.run(
            ["git", *args],
            cwd=repo_root,
            check=False,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
        )
    except OSError:
        return None
    if result.returncode != 0:
        return None
    return result.stdout.strip()


def ignore_junk(directory: str, names: list[str]) -> list[str]:
    return [
        name
        for name in names
        if name in SKIP_NAMES
        or (name.startswith(".") and name != ".gitkeep")
        or name.endswith(SKIP_SUFFIXES)
    ]


def copy_scripts_and_assets(repo_root: Path, dest_bmad: Path) -> None:
    scripts_src = repo_root / "src" / "scripts"
    dest_scripts = dest_bmad / "scripts"
    dest_scripts.mkdir(parents=True, exist_ok=True)
    for name in SHARED_SCRIPTS:
        shutil.copy2(scripts_src / name, dest_scripts / name)


def ensure_packaged_manifests(
    staging: Path, modules: tuple[ModulePackage, ...]
) -> None:
    for module in modules:
        for skill in module.skills:
            manifest = staging / skill.name / MANIFEST_NAME
            if not manifest.is_file():
                raise ValueError(
                    f"packaged skill {skill.name!r} is missing {MANIFEST_NAME}"
                )


def replace_dest_skills(staging: Path, out: Path) -> None:
    out.mkdir(parents=True, exist_ok=True)
    dest_skills = out / "skills"
    with tempfile.TemporaryDirectory(dir=out) as tmp:
        incoming = Path(tmp) / "skills"
        shutil.copytree(staging, incoming)
        backup = Path(tmp) / "previous-skills"
        if dest_skills.exists():
            dest_skills.replace(backup)
        try:
            incoming.replace(dest_skills)
        except BaseException:
            if backup.exists() and not dest_skills.exists():
                backup.replace(dest_skills)
            raise


if __name__ == "__main__":
    raise SystemExit(main())
