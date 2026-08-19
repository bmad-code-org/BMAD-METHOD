#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""First-run pump: project this help skill's payload into
{project-root}/_bmad."""

from __future__ import annotations

import argparse
import copy
import datetime
import json
import re
import shutil
import sys
import tempfile
import tomllib
from pathlib import Path
from pathlib import PurePosixPath
from typing import Any, NamedTuple

import yaml
from yaml.constructor import ConstructorError

sys.dont_write_bytecode = True

MANIFEST_NAME = "module-manifest.md"
QUESTION_KEYS = frozenset({"key", "prompt", "default"})
UPDATE_SOURCE_PREFIXES = ("github:", "https://", "file:")
FRONTMATTER = re.compile(
    r"\A---(?P<newline>\r?\n)(?P<yaml>.*?)^---(?:\r?\n|\Z)",
    re.DOTALL | re.MULTILINE,
)
MODULE_NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*\Z")
RESERVED_MODULE_DIRS = frozenset({"_config", "custom", "modules", "scripts"})


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
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
    construct_unique_mapping,
)


class ConfigQuestion(NamedTuple):
    module: str
    key: str
    prompt: str
    default: str


class InstalledModule(NamedTuple):
    module: str
    source: Path
    questions: tuple[ConfigQuestion, ...]
    scripts: tuple[tuple[PurePosixPath, bytes], ...]


class ParsedManifest(NamedTuple):
    module: str
    questions: tuple[ConfigQuestion, ...]
    scripts: tuple[PurePosixPath, ...]


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
    parser.add_argument("--module-answers", type=Path)
    parser.add_argument(
        "--list-config-questions",
        action="store_true",
        help="print unanswered installed-module questions as JSON",
    )
    args = parser.parse_args(argv)
    project_root = args.project_root.resolve()
    skill_root = args.skill.resolve()
    if args.list_config_questions:
        if args.user_answers is not None or args.module_answers is not None:
            parser.error(
                "--list-config-questions cannot be combined with answer files"
            )
        questions = pending_config_questions(project_root, skill_root)
        print(
            json.dumps(
                [
                    {
                        "module": question.module,
                        "key": question.key,
                        "prompt": question.prompt,
                        "default": question.default,
                    }
                    for question in questions
                ],
                ensure_ascii=False,
            )
        )
        return 0
    setup(
        project_root,
        skill_root,
        user_answers=(
            load_user_answers(args.user_answers)
            if args.user_answers is not None
            else None
        ),
        module_answers=(
            load_module_answers(args.module_answers)
            if args.module_answers is not None
            else None
        ),
        module_answers_source=args.module_answers,
    )
    return 0


def setup(
    project_root: Path,
    skill_root: Path,
    *,
    user_answers: tuple[str, str, str] | None = None,
    module_answers: dict[tuple[str, str], str] | None = None,
    module_answers_source: Path | None = None,
) -> None:
    scripts_src, catalog_src, config_src, user_src = payload(skill_root)
    template_text = fill_team_config(
        config_src.read_text(encoding="utf-8"), project_root
    )
    template = parse_toml(template_text, config_src)
    existing_text, existing = existing_team_config(project_root)
    merged = fill_keep(template, existing)
    if not isinstance(merged, dict):
        raise Exception(
            f"invalid team config: {project_root / '_bmad' / 'config.toml'}"
        )
    modules = discover_installed_modules(skill_root)
    pending = find_pending_questions(modules, merged, project_root)
    answers = validate_module_answers(
        module_answers, pending, source=module_answers_source
    )
    base_text = (
        existing_text
        if existing_text is not None and merged == existing
        else render_toml(merged)
    )
    for question in pending:
        set_missing_value(
            merged,
            ("modules", question.module, *question.key.split(".")),
            answers[(question.module, question.key)],
            project_root / "_bmad" / "config.toml",
        )
    config_text = render_toml(merged) if pending else base_text
    legacy_config = without_manifest_answers(merged, modules)
    user_text = None
    if user_answers is not None:
        user_text = fill_user_config(
            user_src.read_text(encoding="utf-8"), user_answers
        )
    materialize_bmad(
        project_root,
        scripts_src,
        catalog_src,
        config_text,
        user_text,
        legacy_config,
        modules,
    )
    ensure_dir(project_root / output_folder(config_text))


def payload(skill_root: Path) -> tuple[Path, Path | None, Path, Path]:
    scripts_src = skill_root / "scripts"
    assets_src = skill_root / "assets"
    config_src = assets_src / "config.template.toml"
    user_src = assets_src / "config.user.template.toml"
    catalog_src = assets_src / "bmad-help.csv"
    resolve_config = scripts_src / "resolve_config.py"
    for directory in (scripts_src, assets_src):
        if not directory.is_dir():
            raise Exception(f"missing directory: {directory}")
    for file in (resolve_config, config_src, user_src):
        if not file.is_file():
            raise Exception(f"missing file: {file}")
    return (
        scripts_src,
        catalog_src if catalog_src.is_file() else None,
        config_src,
        user_src,
    )


def pending_config_questions(
    project_root: Path, skill_root: Path
) -> tuple[ConfigQuestion, ...]:
    _scripts, _catalog, config_src, _user = payload(skill_root)
    template_text = fill_team_config(
        config_src.read_text(encoding="utf-8"), project_root
    )
    template = parse_toml(template_text, config_src)
    _existing_text, existing = existing_team_config(project_root)
    merged = fill_keep(template, existing)
    if not isinstance(merged, dict):
        raise Exception(
            f"invalid team config: {project_root / '_bmad' / 'config.toml'}"
        )
    modules = discover_installed_modules(skill_root)
    return find_pending_questions(modules, merged, project_root)


def existing_team_config(project_root: Path) -> tuple[str | None, dict]:
    path = project_root / "_bmad" / "config.toml"
    if not path.exists() and not path.is_symlink():
        return None, {}
    if not path.is_file():
        raise Exception(f"team config is not a file: {path}")
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise Exception(f"cannot read team config {path}: {error}") from error
    return text, parse_toml(text, path)


def parse_toml(text: str, source: Path) -> dict:
    try:
        return tomllib.loads(text)
    except tomllib.TOMLDecodeError as error:
        raise Exception(f"cannot parse TOML {source}: {error}") from error


def discover_installed_modules(skill_root: Path) -> tuple[InstalledModule, ...]:
    manifests: list[tuple[Path, bytes, ParsedManifest]] = []
    try:
        siblings = sorted(skill_root.parent.iterdir(), key=lambda path: path.name)
    except OSError as error:
        raise Exception(
            f"cannot inspect installed skills {skill_root.parent}: {error}"
        ) from error
    for sibling in siblings:
        if not sibling.is_dir():
            continue
        path = sibling / MANIFEST_NAME
        if not path.is_file():
            continue
        try:
            raw = path.read_bytes()
        except OSError as error:
            raise Exception(f"cannot read installed manifest {path}: {error}") from error
        manifests.append((path, raw, parse_packaged_manifest(path, raw)))

    casefolded: dict[str, tuple[str, Path]] = {}
    grouped: dict[str, list[tuple[Path, bytes, ParsedManifest]]] = {}
    for item in manifests:
        path, _raw, parsed = item
        folded = parsed.module.casefold()
        previous = casefolded.get(folded)
        if previous is not None and previous[0] != parsed.module:
            previous_module, previous_path = previous
            raise Exception(
                "installed module ids differ only by case: "
                f"{previous_module!r} from {previous_path} and "
                f"{parsed.module!r} from {path}"
            )
        casefolded[folded] = (parsed.module, path)
        grouped.setdefault(item[2].module, []).append(item)

    installed: list[InstalledModule] = []
    for module in sorted(grouped):
        copies = grouped[module]
        first_path, first_raw, parsed = copies[0]
        for path, raw, _other in copies[1:]:
            if raw != first_raw:
                raise Exception(
                    f"conflicting installed manifests for module {module!r}: "
                    f"{first_path} and {path}"
                )
        scripts = tuple(
            (relative, read_declared_script(first_path.parent, relative, first_path))
            for relative in parsed.scripts
        )
        installed.append(
            InstalledModule(module, first_path.parent, parsed.questions, scripts)
        )
    return tuple(installed)


def parse_packaged_manifest(path: Path, raw: bytes) -> ParsedManifest:
    try:
        source = raw.decode("utf-8")
    except UnicodeError as error:
        raise Exception(f"invalid packaged manifest {path}: {error}") from error
    match = FRONTMATTER.match(source)
    if match is None:
        raise Exception(f"invalid frontmatter in packaged manifest {path}")
    try:
        data = yaml.load(match.group("yaml"), Loader=UniqueKeyLoader)
    except yaml.YAMLError as error:
        raise Exception(f"invalid YAML in packaged manifest {path}: {error}") from error
    if not isinstance(data, dict):
        raise Exception(f"frontmatter in packaged manifest {path} must be a mapping")
    if any(not isinstance(key, str) for key in data):
        raise Exception(f"packaged manifest {path} has a non-string field")
    module = manifest_string(data, "module", path)
    if (
        MODULE_NAME.fullmatch(module) is None
        or module.casefold() in RESERVED_MODULE_DIRS
    ):
        raise Exception(
            f"packaged manifest {path} field 'module' has unsafe value {module!r}"
        )
    manifest_string(data, "version", path)
    update_source = manifest_string(data, "update_source", path)
    prefix = next(
        (
            candidate
            for candidate in UPDATE_SOURCE_PREFIXES
            if update_source.startswith(candidate)
        ),
        None,
    )
    if prefix is None or not update_source.removeprefix(prefix):
        raise Exception(
            f"packaged manifest {path} field 'update_source' must name a source"
        )
    if prefix == "github:":
        github_parts = update_source.removeprefix(prefix).split("/")
        if len(github_parts) < 3 or any(not part for part in github_parts):
            raise Exception(
                f"packaged manifest {path} field 'update_source' github "
                "source must name owner/repo/path"
            )
    if prefix == "https://" and any(
        character.isspace() for character in update_source
    ):
        raise Exception(
            f"packaged manifest {path} field 'update_source' must be a valid "
            "HTTPS URL"
        )
    questions = parse_manifest_questions(data.get("config_questions"), module, path)
    scripts = parse_manifest_scripts(data.get("scripts"), path)
    return ParsedManifest(module, questions, scripts)


def manifest_string(data: dict, field: str, path: Path) -> str:
    value = data.get(field)
    if not isinstance(value, str) or not value.strip():
        raise Exception(
            f"packaged manifest {path} field {field!r} must be a non-empty string"
        )
    return value


def parse_manifest_questions(
    value: object, module: str, path: Path
) -> tuple[ConfigQuestion, ...]:
    if value is None:
        return ()
    if not isinstance(value, list):
        raise Exception(
            f"packaged manifest {path} field 'config_questions' must be a list"
        )
    questions: list[ConfigQuestion] = []
    seen: list[str] = []
    for index, question in enumerate(value):
        field = f"config_questions[{index}]"
        if not isinstance(question, dict):
            raise Exception(
                f"packaged manifest {path} field {field} must be a mapping"
            )
        keys = set(question)
        if keys != QUESTION_KEYS:
            missing = sorted(QUESTION_KEYS - keys)
            unknown = sorted(keys - QUESTION_KEYS, key=str)
            detail = (
                f"missing key {missing[0]!r}"
                if missing
                else f"unknown key {unknown[0]!r}"
            )
            raise Exception(f"packaged manifest {path} field {field} has {detail}")
        for key in QUESTION_KEYS:
            if not isinstance(question[key], str):
                raise Exception(
                    f"packaged manifest {path} field {field}.{key} must be a string"
                )
        prompt = question["prompt"]
        key = question["key"]
        if not prompt.strip():
            raise Exception(
                f"packaged manifest {path} field {field}.prompt must be non-empty"
            )
        if not key or any(
            not part or part != part.strip() for part in key.split(".")
        ):
            raise Exception(
                f"packaged manifest {path} field {field}.key must be a "
                "non-empty dotted key"
            )
        if key == module or key.startswith(f"{module}."):
            raise Exception(
                f"packaged manifest {path} field {field}.key {key!r} "
                f"must not start with module {module!r}"
            )
        conflict = conflicting_question_key(seen, key)
        if conflict is not None:
            raise Exception(
                f"packaged manifest {path} config question key {key!r} "
                f"conflicts with {conflict!r}"
            )
        seen.append(key)
        questions.append(
            ConfigQuestion(module, key, prompt, question["default"])
        )
    return tuple(questions)


def conflicting_question_key(keys: list[str], candidate: str) -> str | None:
    for key in keys:
        if (
            key == candidate
            or key.startswith(f"{candidate}.")
            or candidate.startswith(f"{key}.")
        ):
            return key
    return None


def parse_manifest_scripts(
    value: object, path: Path
) -> tuple[PurePosixPath, ...]:
    if value is None:
        return ()
    if not isinstance(value, list):
        raise Exception(f"packaged manifest {path} field 'scripts' must be a list")
    scripts: list[PurePosixPath] = []
    for entry in value:
        if not isinstance(entry, str) or not entry:
            raise Exception(
                f"packaged manifest {path} field 'scripts' has invalid value {entry!r}"
            )
        relative = PurePosixPath(entry)
        if (
            relative.is_absolute()
            or "\\" in entry
            or len(relative.parts) < 2
            or relative.parts[0] != "scripts"
            or ".." in relative.parts
            or "." in relative.parts
        ):
            raise Exception(
                f"packaged manifest {path} field 'scripts' has unsafe value {entry!r}"
            )
        scripts.append(relative)
    return tuple(scripts)


def read_declared_script(
    skill_root: Path, relative: PurePosixPath, manifest: Path
) -> bytes:
    root = skill_root.resolve()
    candidate = root.joinpath(*relative.parts)
    try:
        resolved = candidate.resolve(strict=True)
        resolved.relative_to(root)
    except (OSError, RuntimeError, ValueError) as error:
        raise Exception(
            f"packaged manifest {manifest} declares unsafe or missing script "
            f"{relative.as_posix()!r}"
        ) from error
    if not resolved.is_file():
        raise Exception(
            f"packaged manifest {manifest} declared script "
            f"{relative.as_posix()!r} is not a file"
        )
    try:
        return resolved.read_bytes()
    except OSError as error:
        raise Exception(
            f"cannot read script {resolved} declared by {manifest}: {error}"
        ) from error


def find_pending_questions(
    modules: tuple[InstalledModule, ...],
    config: dict,
    project_root: Path,
) -> tuple[ConfigQuestion, ...]:
    pending: list[ConfigQuestion] = []
    for installed in modules:
        for question in installed.questions:
            path = ("modules", question.module, *question.key.split("."))
            if not has_path(
                config, path, project_root / "_bmad" / "config.toml"
            ):
                pending.append(
                    ConfigQuestion(
                        question.module,
                        question.key,
                        question.prompt,
                        question.default.replace(
                            "{directory_name}", project_root.name
                        ),
                    )
                )
    return tuple(pending)


def has_path(data: object, path: tuple[str, ...], source: Path) -> bool:
    current = data
    for part in path:
        if not isinstance(current, dict):
            raise Exception(
                f"cannot inspect {'.'.join(path)}: parent value in {source} "
                "is not a table"
            )
        if part not in current:
            return False
        current = current[part]
    return True


def load_module_answers(path: Path) -> dict[tuple[str, str], str]:
    if not path.is_file():
        raise Exception(f"missing file: {path}")
    try:
        data = tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
        raise Exception(f"cannot parse module answers {path}: {error}") from error
    if not data:
        return {}
    if set(data) != {"modules"} or not isinstance(data["modules"], dict):
        raise Exception(
            f"--module-answers {path} must contain only module answer tables"
        )
    answers: dict[tuple[str, str], str] = {}
    for module, values in data["modules"].items():
        if not isinstance(module, str) or not isinstance(values, dict):
            raise Exception(f"--module-answers {path} has an invalid module table")
        flatten_module_answers(path, module, values, (), answers)
    return answers


def flatten_module_answers(
    source: Path,
    module: str,
    values: dict,
    prefix: tuple[str, ...],
    answers: dict[tuple[str, str], str],
) -> None:
    for key, value in values.items():
        parts = (*prefix, str(key))
        if isinstance(value, dict):
            flatten_module_answers(source, module, value, parts, answers)
            continue
        dotted = ".".join(parts)
        if not isinstance(value, str):
            raise Exception(
                f"--module-answers {source} value modules.{module}.{dotted} "
                "must be a string"
            )
        identifier = (module, dotted)
        if identifier in answers:
            raise Exception(
                f"--module-answers {source} defines "
                f"modules.{module}.{dotted} more than once"
            )
        answers[identifier] = value


def validate_module_answers(
    supplied: dict[tuple[str, str], str] | None,
    pending: tuple[ConfigQuestion, ...],
    *,
    source: Path | None = None,
) -> dict[tuple[str, str], str]:
    answers = supplied or {}
    if source is not None:
        source_label = f"--module-answers {source}"
    elif supplied is None:
        source_label = "no --module-answers file"
    else:
        source_label = "in-process module answers"
    for identifier, value in answers.items():
        if (
            not isinstance(identifier, tuple)
            or len(identifier) != 2
            or not all(isinstance(part, str) for part in identifier)
            or not isinstance(value, str)
        ):
            raise Exception(
                f"{source_label} must map (module, key) pairs to strings"
            )
    expected = {(question.module, question.key) for question in pending}
    extra = sorted(set(answers) - expected)
    if extra:
        module, key = extra[0]
        raise Exception(
            f"{source_label} contains modules.{module}.{key}, which is not a "
            "pending question"
        )
    missing = [
        question
        for question in pending
        if (question.module, question.key) not in answers
    ]
    if missing:
        question = missing[0]
        raise Exception(
            f"{source_label} is missing an answer for pending question "
            f"modules.{question.module}.{question.key}; run "
            "--list-config-questions first"
        )
    return answers


def set_missing_value(
    data: dict,
    path: tuple[str, ...],
    value: str,
    source: Path,
) -> None:
    current = data
    for part in path[:-1]:
        child = current.get(part)
        if child is None:
            child = {}
            current[part] = child
        elif not isinstance(child, dict):
            dotted = ".".join(path)
            raise Exception(
                f"cannot add {dotted}: parent value in {source} is not a table"
            )
        current = child
    leaf = path[-1]
    if leaf in current:
        raise Exception(f"refusing to overwrite existing {'.'.join(path)} in {source}")
    current[leaf] = value


def without_manifest_answers(
    config: dict, modules: tuple[InstalledModule, ...]
) -> dict:
    projection = copy.deepcopy(config)
    for installed in modules:
        for question in installed.questions:
            delete_path(
                projection,
                ("modules", installed.module, *question.key.split(".")),
            )
    return projection


def delete_path(data: dict, path: tuple[str, ...]) -> None:
    current: object = data
    parents: list[tuple[dict, str]] = []
    for part in path[:-1]:
        if not isinstance(current, dict) or part not in current:
            return
        parents.append((current, part))
        current = current[part]
    if not isinstance(current, dict):
        return
    current.pop(path[-1], None)
    for parent, part in reversed(parents):
        child = parent.get(part)
        if isinstance(child, dict) and not child:
            del parent[part]
        else:
            break


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
    catalog_src: Path | None,
    config_text: str,
    user_text: str | None,
    legacy_config: dict,
    modules: tuple[InstalledModule, ...],
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
            legacy_config=legacy_config,
            modules=modules,
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
    catalog_src: Path | None,
    config_text: str,
    user_text: str | None,
    legacy_config: dict,
    modules: tuple[InstalledModule, ...],
) -> None:
    core = stringify(legacy_config.get("core", {}))
    bmm = stringify(legacy_config.get("modules", {}).get("bmm", {}))
    ensure_scripts(staging / "scripts", scripts_src)
    ensure_file(staging / "config.toml", config_text)
    if user_text is not None:
        ensure_new(staging / "config.user.toml", user_text)
    ensure_file(staging / "core" / "config.yaml", render_module_yaml(core))
    ensure_file(
        staging / "bmm" / "config.yaml",
        render_module_yaml({**bmm, **core}),
    )
    for installed in modules:
        for relative, content in installed.scripts:
            script_relative = Path(*relative.parts[1:])
            ensure_bytes(
                staging / installed.module / "scripts" / script_relative,
                content,
                staging,
            )
    ensure_dir(staging / "custom")
    catalog_dest = staging / "_config" / "bmad-help.csv"
    if catalog_src is not None:
        ensure_copy(catalog_dest, catalog_src)
    else:
        catalog_dest.unlink(missing_ok=True)


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


def ensure_bytes(path: Path, content: bytes, staging: Path) -> None:
    ensure_plain_parents(path.parent, staging)
    if path.is_symlink() or path.is_file():
        path.unlink()
    elif path.exists():
        shutil.rmtree(path)
    path.write_bytes(content)


def ensure_plain_parents(path: Path, staging: Path) -> None:
    relative = path.relative_to(staging)
    current = staging
    for part in relative.parts:
        current = current / part
        if current.is_symlink() or current.is_file():
            current.unlink()
            current.mkdir()
        elif current.exists():
            if not current.is_dir():
                shutil.rmtree(current)
                current.mkdir()
        else:
            current.mkdir()


def ensure_new(path: Path, content: str) -> None:
    if path.exists() or path.is_symlink():
        return
    write_text(path, content)


def ensure_file(path: Path, content: str) -> None:
    if path.is_symlink():
        path.unlink()
    elif path.is_file():
        existing = path.read_text(encoding="utf-8")
        filled = (
            fill_yaml(existing, content)
            if path.suffix == ".yaml"
            else fill_toml(existing, content)
        )
        if filled == existing:
            return
        content = filled
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
    replacements = {
        "\\": "\\\\",
        '"': '\\"',
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
    }
    escaped = "".join(
        replacements.get(character, toml_control(character))
        for character in value
    )
    return f'"{escaped}"'


def toml_control(value: str) -> str:
    codepoint = ord(value)
    if codepoint < 0x20 or codepoint == 0x7F:
        return f"\\u{codepoint:04X}"
    return value


def toml_key(key: str) -> str:
    if (
        key
        and key.isascii()
        and key[0].isalpha()
        and all(c.isalnum() or c in "-_" for c in key)
    ):
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
    if isinstance(value, (datetime.datetime, datetime.date, datetime.time)):
        return value.isoformat()
    if value is None:
        return '""'
    if isinstance(value, list):
        return "[ " + ", ".join(toml_value(item) for item in value) + " ]"
    if isinstance(value, dict):
        rendered = ", ".join(
            f"{toml_key(str(key))} = {toml_value(item)}"
            for key, item in value.items()
        )
        return "{ " + rendered + " }"
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

    def emit_tables(table: dict, prefix: tuple[str, ...]) -> None:
        for key, value in table.items():
            if not isinstance(value, dict):
                continue
            header = (*prefix, str(key))
            scalars = any(not isinstance(item, dict) for item in value.values())
            nested = any(isinstance(item, dict) for item in value.values())
            if scalars or not nested:
                if lines:
                    lines.append("")
                lines.append(f"[{'.'.join(toml_key(part) for part in header)}]")
                emit_scalars(value)
            emit_tables(value, header)

    emit_scalars(data)
    emit_tables(data, ())
    return "\n".join(lines) + "\n"


def fill_toml(existing_text: str, template_text: str) -> str:
    try:
        existing = tomllib.loads(existing_text)
        template = tomllib.loads(template_text)
    except tomllib.TOMLDecodeError as error:
        raise Exception(f"cannot merge malformed TOML: {error}") from error
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
