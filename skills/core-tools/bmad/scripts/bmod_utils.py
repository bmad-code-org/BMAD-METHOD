#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Shared bmod.toml parsing, skill discovery, semver, and document helpers."""

from __future__ import annotations

import re
import stat
import sys
import tomllib
from pathlib import Path, PurePosixPath
from typing import NamedTuple

sys.dont_write_bytecode = True

MANIFEST_NAME = "bmod.toml"
ROSTER_NAME = "roster.toml"
READ_LIMIT = 1024 * 1024
QUESTION_KEYS = frozenset({"key", "prompt", "default"})
OPTIONAL_QUESTION_KEYS = frozenset({"scope"})
QUESTION_SCOPES = ("team", "user")
UPDATE_SOURCE_PREFIXES = ("github:", "https://", "file:", "plugin:")
MODULE_NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*\Z")
SKILL_NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*\Z")
RESERVED_MODULE_DIRS = frozenset({"_config", "custom", "modules", "scripts"})

SEMVER = re.compile(
    r"(?P<major>0|[1-9][0-9]*)\."
    r"(?P<minor>0|[1-9][0-9]*)\."
    r"(?P<patch>0|[1-9][0-9]*)"
    r"(?:-(?P<prerelease>"
    r"(?:0|[1-9][0-9]*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)"
    r"(?:\.(?:0|[1-9][0-9]*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*"
    r"))?"
    r"(?:\+(?P<build>[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?\Z"
)


class Requirement(NamedTuple):
    skill: str
    version: str | None
    source: str | None


class KnowledgeEntry(NamedTuple):
    path: PurePosixPath
    skills: tuple[str, ...] | None


class ConfigQuestion(NamedTuple):
    module: str
    key: str
    prompt: str
    default: str
    scope: str = "team"


class ParsedBmod(NamedTuple):
    code: str
    version: str
    update_source: str
    skills: tuple[str, ...] | None
    knowledge: tuple[KnowledgeEntry, ...]
    questions: tuple[ConfigQuestion, ...]
    required_skills: tuple[Requirement, ...]
    recommended_skills: tuple[Requirement, ...]
    pre_install_message: str = ""
    post_install_message: str = ""


class ParsedSkill(NamedTuple):
    bmod: str | None
    source: str | None
    scripts: tuple[PurePosixPath, ...]
    required_skills: tuple[Requirement, ...]
    recommended_skills: tuple[Requirement, ...]


class ParsedFile(NamedTuple):
    bmod: ParsedBmod | None
    skill: ParsedSkill | None


class Module(NamedTuple):
    code: str
    folder: Path
    table: dict[str, object]
    skills: list[str]


class Scan(NamedTuple):
    folders: dict[str, Path]
    modules: list[Module]
    skills: list[dict[str, object]]
    problems: list[dict[str, object]]


def parse_toml(text: str, source: Path | str) -> dict:
    try:
        return tomllib.loads(text)
    except tomllib.TOMLDecodeError as error:
        raise Exception(f"cannot parse TOML {source}: {error}") from error


def read_bmod_file(path: Path) -> ParsedFile | None:
    if not path.is_file():
        return None
    try:
        raw = path.read_bytes()
    except OSError as error:
        raise Exception(f"cannot read bmod file {path}: {error}") from error
    return parse_bmod_file(path, raw)


def parse_bmod_file(path: Path, raw: bytes) -> ParsedFile:
    """Read the fields BMad uses and ignore every other key and table.

    An author may add keys of their own, and a newer file may carry keys this
    version predates. Neither may stop a skill from installing.
    """
    try:
        source = raw.decode("utf-8")
    except UnicodeError as error:
        raise Exception(f"invalid bmod file {path}: {error}") from error
    data = parse_toml(source, path)
    bmod_table = data.get("bmod")
    skill_table = data.get("skill")
    if bmod_table is None and skill_table is None:
        raise Exception(f"bmod file {path} must hold a [bmod] table, a [skill] table, or both")
    for name, table in (("bmod", bmod_table), ("skill", skill_table)):
        if table is not None and not isinstance(table, dict):
            raise Exception(f"bmod file {path} field {name!r} must be a table")
    bmod = parse_bmod_table(bmod_table, path) if bmod_table is not None else None
    skill = parse_skill_table(skill_table, path, standalone=bmod is None) if skill_table is not None else None
    return ParsedFile(bmod, skill)


def parse_bmod_table(table: dict, path: Path) -> ParsedBmod:
    code = required_string(table, "bmod", "code", path)
    if MODULE_NAME.fullmatch(code) is None or code.casefold() in RESERVED_MODULE_DIRS:
        raise Exception(f"bmod file {path} field 'bmod.code' has unsafe value {code!r}")
    version = required_string(table, "bmod", "version", path)
    update_source = required_string(table, "bmod", "update_source", path)
    validate_source(update_source, "bmod.update_source", path)
    skills = table.get("skills")
    return ParsedBmod(
        code,
        version,
        update_source,
        parse_skill_names(skills, "bmod.skills", path) if skills is not None else None,
        parse_knowledge(table.get("knowledge"), path),
        parse_questions(table.get("config_questions"), code, path),
        parse_requirements(table.get("required_skills"), "bmod.required_skills", path),
        parse_requirements(table.get("recommended_skills"), "bmod.recommended_skills", path),
        optional_string(table, "bmod", "pre_install_message", path),
        optional_string(table, "bmod", "post_install_message", path),
    )


def parse_skill_table(table: dict, path: Path, *, standalone: bool) -> ParsedSkill:
    bmod: str | None = None
    source: str | None = None
    if standalone:
        bmod = required_string(table, "skill", "bmod", path)
        if SKILL_NAME.fullmatch(bmod) is None:
            raise Exception(f"bmod file {path} field 'skill.bmod' has unsafe value {bmod!r}")
        source = required_string(table, "skill", "source", path)
        validate_source(source, "skill.source", path)
    return ParsedSkill(
        bmod,
        source,
        parse_scripts(table.get("scripts"), path),
        parse_requirements(table.get("required_skills"), "skill.required_skills", path),
        parse_requirements(table.get("recommended_skills"), "skill.recommended_skills", path),
    )


def validate_source(value: str, field: str, path: Path) -> None:
    prefix = next(
        (candidate for candidate in UPDATE_SOURCE_PREFIXES if value.startswith(candidate)),
        None,
    )
    if prefix is None or not value.removeprefix(prefix):
        raise Exception(f"bmod file {path} field {field!r} must name a source")
    if prefix == "github:":
        github_parts = value.removeprefix(prefix).split("/")
        if len(github_parts) < 2 or any(not part for part in github_parts):
            raise Exception(f"bmod file {path} field {field!r} github source must name owner/repo")
    if prefix == "https://" and any(character.isspace() for character in value):
        raise Exception(f"bmod file {path} field {field!r} must be a valid HTTPS URL")


def parse_skill_names(value: object, field: str, path: Path) -> tuple[str, ...]:
    if not isinstance(value, list):
        raise Exception(f"bmod file {path} field {field!r} must be a list of skill names")
    names: list[str] = []
    for entry in value:
        if not isinstance(entry, str) or SKILL_NAME.fullmatch(entry) is None:
            raise Exception(f"bmod file {path} field {field!r} has unsafe skill name {entry!r}")
        if entry in names:
            raise Exception(f"bmod file {path} field {field!r} repeats {entry!r}")
        names.append(entry)
    return tuple(names)


def parse_path(entry: object, field: str, path: Path, seen: list[PurePosixPath]) -> PurePosixPath:
    if not isinstance(entry, str) or not entry:
        raise Exception(f"bmod file {path} field {field!r} has invalid value {entry!r}")
    relative = safe_skill_relative(entry)
    if relative is None:
        raise Exception(f"bmod file {path} field {field!r} has unsafe value {entry!r}")
    if relative in seen:
        raise Exception(f"bmod file {path} field {field!r} repeats {entry!r}")
    return relative


def parse_knowledge(value: object, path: Path) -> tuple[KnowledgeEntry, ...]:
    """The module's help documents, as paths inside the bmod folder, each with the skills it covers."""
    if value is None:
        return ()
    if not isinstance(value, list):
        raise Exception(f"bmod file {path} field 'bmod.knowledge' must be a list of tables")
    knowledge: list[KnowledgeEntry] = []
    for index, entry in enumerate(value):
        field = f"bmod.knowledge[{index}]"
        if not isinstance(entry, dict):
            raise Exception(f"bmod file {path} field {field} must be a table")
        relative = parse_path(entry.get("path"), f"{field}.path", path, [item.path for item in knowledge])
        skills = entry.get("skills", "*")
        if skills == "*":
            knowledge.append(KnowledgeEntry(relative, None))
            continue
        if isinstance(skills, str):
            raise Exception(f"bmod file {path} field '{field}.skills' must be \"*\" or a list of skill names")
        knowledge.append(KnowledgeEntry(relative, parse_skill_names(skills, f"{field}.skills", path)))
    return tuple(knowledge)


def safe_skill_relative(entry: str) -> PurePosixPath | None:
    """A bmod.toml path that cannot escape the skill folder, or None if it can.

    Shared with validate_manifests.py and knowledge.py so one rule decides
    this everywhere. A URL parses as an ordinary relative path and a Windows
    drive prefix makes a later join discard the skill folder, so both are
    refused by name. pathlib drops "." components itself, so only ".." and an
    empty final component need checking.
    """
    if not entry or "://" in entry or "\\" in entry or ":" in entry:
        return None
    relative = PurePosixPath(entry)
    if relative.is_absolute() or ".." in relative.parts or not relative.name:
        return None
    return relative


def parse_requirements(value: object, field: str, path: Path) -> tuple[Requirement, ...]:
    """A flat list of skills. A plain name comes from the declaring file's own source."""
    if value is None:
        return ()
    if not isinstance(value, list):
        raise Exception(f"bmod file {path} field {field!r} must be a list of skills")
    requirements: list[Requirement] = []
    for index, entry in enumerate(value):
        item = f"{field}[{index}]"
        if isinstance(entry, str):
            requirement = Requirement(entry, None, None)
        elif isinstance(entry, dict):
            skill = entry.get("skill")
            if not isinstance(skill, str):
                raise Exception(f"bmod file {path} field '{item}.skill' must be a string and is required")
            source = entry.get("source")
            if not isinstance(source, str):
                raise Exception(f"bmod file {path} field '{item}.source' must be a string and is required")
            validate_source(source, f"{item}.source", path)
            minimum = entry.get("version")
            if minimum is not None:
                if not isinstance(minimum, str):
                    raise Exception(f"bmod file {path} field '{item}.version' must be a string")
                if parse_orderable_semver(minimum) is None:
                    raise Exception(
                        f"bmod file {path} field '{item}.version' must be an orderable version; found {minimum!r}"
                    )
            requirement = Requirement(skill, minimum, source)
        else:
            raise Exception(f"bmod file {path} field {item!r} must be a skill name or a table")
        if SKILL_NAME.fullmatch(requirement.skill) is None:
            raise Exception(f"bmod file {path} field {item!r} has unsafe skill name {requirement.skill!r}")
        if any(requirement.skill == other.skill for other in requirements):
            raise Exception(f"bmod file {path} field {field!r} repeats {requirement.skill!r}")
        requirements.append(requirement)
    return tuple(requirements)


def required_string(table: dict, name: str, field: str, path: Path) -> str:
    value = table.get(field)
    if not isinstance(value, str) or not value.strip():
        raise Exception(f"bmod file {path} field '{name}.{field}' must be a non-empty string")
    return value


def optional_string(table: dict, name: str, field: str, path: Path | str) -> str:
    value = table.get(field, "")
    if not isinstance(value, str):
        raise Exception(f"bmod file {path} field '{name}.{field}' must be a string")
    return value


def parse_questions(value: object, module: str, path: Path) -> tuple[ConfigQuestion, ...]:
    if value is None:
        return ()
    if not isinstance(value, list):
        raise Exception(f"bmod file {path} field 'bmod.config_questions' must be a list")
    questions: list[ConfigQuestion] = []
    seen: list[str] = []
    for index, question in enumerate(value):
        field = f"bmod.config_questions[{index}]"
        if not isinstance(question, dict):
            raise Exception(f"bmod file {path} field {field} must be a mapping")
        keys = set(question)
        if not QUESTION_KEYS <= keys or not keys <= QUESTION_KEYS | OPTIONAL_QUESTION_KEYS:
            missing = sorted(QUESTION_KEYS - keys)
            unknown = sorted(keys - QUESTION_KEYS - OPTIONAL_QUESTION_KEYS, key=str)
            detail = f"missing key {missing[0]!r}" if missing else f"unknown key {unknown[0]!r}"
            raise Exception(f"bmod file {path} field {field} has {detail}")
        for key in QUESTION_KEYS:
            if not isinstance(question[key], str):
                raise Exception(f"bmod file {path} field {field}.{key} must be a string")
        scope = question.get("scope", "team")
        if scope not in QUESTION_SCOPES:
            raise Exception(f'bmod file {path} field {field}.scope must be "team" or "user"; found {scope!r}')
        prompt = question["prompt"]
        key = question["key"]
        if not prompt.strip():
            raise Exception(f"bmod file {path} field {field}.prompt must be non-empty")
        if not key or any(not part or part != part.strip() for part in key.split(".")):
            raise Exception(f"bmod file {path} field {field}.key must be a non-empty dotted key")
        if key == module or key.startswith(f"{module}."):
            raise Exception(f"bmod file {path} field {field}.key {key!r} must not start with module {module!r}")
        conflict = conflicting_question_key(seen, key)
        if conflict is not None:
            raise Exception(f"bmod file {path} config question key {key!r} conflicts with {conflict!r}")
        seen.append(key)
        questions.append(ConfigQuestion(module, key, prompt, question["default"], scope))
    return tuple(questions)


def conflicting_question_key(keys: list[str], candidate: str) -> str | None:
    for key in keys:
        if key == candidate or key.startswith(f"{candidate}.") or candidate.startswith(f"{key}."):
            return key
    return None


def parse_scripts(value: object, path: Path) -> tuple[PurePosixPath, ...]:
    if value is None:
        return ()
    if not isinstance(value, list):
        raise Exception(f"bmod file {path} field 'skill.scripts' must be a list")
    scripts: list[PurePosixPath] = []
    for entry in value:
        if not isinstance(entry, str) or not entry:
            raise Exception(f"bmod file {path} field 'skill.scripts' has invalid value {entry!r}")
        relative = PurePosixPath(entry)
        if (
            relative.is_absolute()
            or "\\" in entry
            or len(relative.parts) < 2
            or relative.parts[0] != "scripts"
            or ".." in relative.parts
            or "." in relative.parts
        ):
            raise Exception(f"bmod file {path} field 'skill.scripts' has unsafe value {entry!r}")
        scripts.append(relative)
    return tuple(scripts)


def unique_folders(folders: tuple[Path, ...]) -> tuple[Path, ...]:
    """The folders in order, each once, however it is reached."""
    unique: list[Path] = []
    seen: set[Path] = set()
    for folder in folders:
        resolved = folder.resolve()
        if resolved not in seen:
            seen.add(resolved)
            unique.append(folder)
    return tuple(unique)


def locate_skills(roots: tuple[Path, ...], own_folder: Path) -> tuple[dict[str, Path], tuple[dict[str, object], ...]]:
    """Each skill's folder in the first root that holds it, and the BMad skills installed in more than one.

    The bmad skill's own folder must be readable; an unreadable extra root is skipped.
    """
    copies: dict[str, list[Path]] = {}
    for root in roots:
        try:
            entries = sorted(root.iterdir(), key=lambda path: path.name)
        except OSError as error:
            if root.resolve() == own_folder.resolve():
                raise Exception(f"cannot inspect installed skills {root}: {error}") from error
            continue
        for entry in entries:
            if entry.is_dir():
                copies.setdefault(entry.name, []).append(entry)
    folders = {name: paths[0] for name, paths in copies.items()}
    duplicates: list[dict[str, object]] = []
    for name, paths in sorted(copies.items()):
        distinct = unique_folders(tuple(paths))
        if len(distinct) > 1 and any((path / MANIFEST_NAME).is_file() for path in distinct):
            duplicates.append({"skill": name, "folders": distinct})
    return folders, tuple(duplicates)


def skill_path(skills: Path | dict[str, Path], name: str) -> Path | None:
    """An installed skill's folder: from one skills folder, or from the folders found across the roots."""
    if isinstance(skills, dict):
        return skills.get(name)
    path = skills / name
    return path if path.is_dir() else None


def requirement_check(skills: Path | dict[str, Path], requirement: Requirement) -> tuple[str | None, str | None]:
    """Why a requirement is unmet, with the version found. The state is None when it is met."""
    if skill_path(skills, requirement.skill) is None:
        return "missing", None
    if requirement.version is None:
        return None, None
    installed = skill_module_version(skills, requirement.skill)
    if installed is None:
        if names_a_module_record(skills, requirement.skill):
            # Its record is absent, which is reported as a missing module record.
            return None, None
        # A copy from before module records has no version to read, and that
        # copy is what a minimum version exists to catch.
        return "unknown-version", None
    return requirement_state(installed, requirement.version), installed


def names_a_module_record(skills: Path | dict[str, Path], skill: str) -> bool:
    folder = skill_path(skills, skill)
    try:
        parsed = read_bmod_file(folder / MANIFEST_NAME) if folder is not None else None
    except Exception:
        return False
    return parsed is not None and parsed.skill is not None and parsed.skill.bmod is not None


def skill_module_version(skills: Path | dict[str, Path], skill: str) -> str | None:
    """The version of the module an installed skill belongs to.

    Skills carry no version. None means the skill has no bmod.toml or its
    module record is absent, so there is nothing to compare.
    """
    try:
        folder = skill_path(skills, skill)
        parsed = read_bmod_file(folder / MANIFEST_NAME) if folder is not None else None
        if parsed is None:
            return None
        if parsed.bmod is not None:
            return parsed.bmod.version
        if parsed.skill is None or parsed.skill.bmod is None:
            return None
        record_folder = skill_path(skills, parsed.skill.bmod)
        if record_folder is None:
            return None
        record = read_bmod_file(record_folder / MANIFEST_NAME)
    except Exception:
        return None
    if record is None or record.bmod is None:
        return None
    return record.bmod.version


def requirement_state(installed: str | None, minimum: str) -> str | None:
    """Why an installed version fails a minimum, or None when it meets it.

    The development branch carries `X-next` until `X` is released, and that
    build already holds everything `X` will. SemVer orders it below `X`, which
    would report every skill on a development install as outdated.
    """
    if installed is None:
        return "missing"
    comparison = compare_semver(installed, minimum)
    if comparison is None:
        return "unorderable"
    if comparison >= 0:
        return None
    have = parse_orderable_semver(installed)
    want = parse_orderable_semver(minimum)
    if have is not None and want is not None and have[0] == want[0] and want[1] is None and have[1] == ("next",):
        return None
    return "outdated"


def install_command(source: object, *skills: str, global_install: bool = False, ref: str | None = None) -> str | None:
    """The `npx skills` command that installs these skills, or None when the source has no such command."""
    if not skills or not isinstance(source, str) or not source.startswith("github:"):
        return None
    parts = source.removeprefix("github:").split("/")
    if len(parts) < 2 or not all(parts[:2]):
        return None
    owner, repository = parts[0], parts[1]
    pin = f"#{ref}" if ref else ""
    return f"npx skills add {owner}/{repository}{pin} --skill {' '.join(skills)}" + (" -g" if global_install else "")


def compare_semver(left: str, right: str) -> int | None:
    left_parsed = parse_orderable_semver(left)
    right_parsed = parse_orderable_semver(right)
    if left_parsed is None or right_parsed is None:
        return None
    left_core, left_pre = left_parsed
    right_core, right_pre = right_parsed
    if left_core != right_core:
        return -1 if left_core < right_core else 1
    return compare_prerelease(left_pre, right_pre)


def parse_orderable_semver(
    value: str,
) -> tuple[tuple[int, int, int], tuple[str, ...] | None] | None:
    match = SEMVER.fullmatch(value)
    if match is None or "-dev" in value.casefold():
        return None
    prerelease = match.group("prerelease")
    return (
        (
            int(match.group("major")),
            int(match.group("minor")),
            int(match.group("patch")),
        ),
        tuple(prerelease.split(".")) if prerelease is not None else None,
    )


def compare_prerelease(left: tuple[str, ...] | None, right: tuple[str, ...] | None) -> int:
    if left is None or right is None:
        if left is right:
            return 0
        return 1 if left is None else -1
    for left_item, right_item in zip(left, right, strict=False):
        if left_item == right_item:
            continue
        left_numeric = left_item.isdigit()
        right_numeric = right_item.isdigit()
        if left_numeric and right_numeric:
            return -1 if int(left_item) < int(right_item) else 1
        if left_numeric != right_numeric:
            return -1 if left_numeric else 1
        return -1 if left_item < right_item else 1
    if len(left) == len(right):
        return 0
    return -1 if len(left) < len(right) else 1


def is_skill(folder: Path) -> bool:
    return (folder / "SKILL.md").exists() or (folder / MANIFEST_NAME).exists()


def grouped(folder: Path) -> list[Path]:
    """The folder itself, or the skills inside it when it only groups them."""
    if is_skill(folder):
        return [folder]
    return sorted(inner for inner in folder.iterdir() if inner.is_dir() and is_skill(inner))


def scan(roots: list[Path]) -> Scan:
    """Find every module record and every module skill in the roots."""
    folders: dict[str, Path] = {}
    modules: list[Module] = []
    problems: list[dict[str, object]] = []
    record_codes: dict[str, str] = {}
    pending: list[tuple[Path, Path, dict[str, object], bool]] = []

    for root in roots:
        try:
            found = sorted(path for path in root.iterdir() if path.is_dir())
            # A source checkout groups a module's skills in a folder of their own, such as `skills/founder/`.
            found = [inner for path in found for inner in grouped(path)]
        except OSError as error:
            problems.append({"kind": "root", "root": str(root), "problem": f"cannot read root {root}: {error}"})
            continue
        for folder in found:
            # The first root wins a folder name outright: a project copy shadows a
            # user copy even when the project copy carries no bmod.toml.
            if folder.name in folders:
                continue
            folders[folder.name] = folder
            manifest = folder / MANIFEST_NAME
            try:
                if not manifest.is_file():
                    continue
                data = tomllib.loads(manifest.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
                problems.append(manifest_problem(folder, f"cannot use {manifest}: {error}"))
                continue
            if "bmod" not in data and "skill" not in data:
                problems.append(manifest_problem(folder, f"{manifest} has neither a [bmod] nor a [skill] table"))
                continue

            skill = data.get("skill")
            if "skill" in data and not isinstance(skill, dict):
                problems.append(manifest_problem(folder, f"{manifest}: 'skill' is not a table"))
                skill = None
            if "bmod" in data:
                module = read_record(folder, data["bmod"], skill is not None, problems)
                if module is not None:
                    record_codes[folder.name] = module.code
                    first = next((other for other in modules if other.code.casefold() == module.code.casefold()), None)
                    if first is None:
                        modules.append(module)
                    else:
                        problems.append(
                            {
                                "kind": "module",
                                "skill": folder.name,
                                "problem": f"{folder.name}: module {module.code!r} is already recorded by "
                                f"{first.folder.name}; {first.folder.name} is used",
                            }
                        )
            if skill is not None:
                pending.append((root, folder, skill, "bmod" in data))

    skills = [
        resolve_skill(root, folder, table, own_record, record_codes) for root, folder, table, own_record in pending
    ]
    problems.extend(absent_records(skills, folders))
    for entry in skills:
        entry.pop("source")
    return Scan(folders, modules, skills, problems)


def manifest_problem(folder: Path, problem: str) -> dict[str, object]:
    return {"kind": "manifest", "skill": folder.name, "manifest": str(folder / MANIFEST_NAME), "problem": problem}


def read_record(folder: Path, table: object, has_skill: bool, problems: list[dict[str, object]]) -> Module | None:
    manifest = folder / MANIFEST_NAME
    if not isinstance(table, dict):
        problems.append(manifest_problem(folder, f"{manifest}: 'bmod' is not a table"))
        return None
    code = table.get("code")
    if not isinstance(code, str) or not code:
        problems.append(manifest_problem(folder, f"{manifest}: [bmod] has no usable 'code'"))
        return None
    listed = table.get("skills")
    if listed is None:
        # A record that is also a skill, with no list, is its own one member.
        members = [folder.name] if has_skill else []
    elif isinstance(listed, list) and all(isinstance(name, str) and name for name in listed):
        members = list(dict.fromkeys(listed))
    else:
        problems.append(manifest_problem(folder, f"{manifest}: [bmod] 'skills' is not a list of skill names"))
        members = []
    return Module(code, folder, table, members)


def resolve_skill(
    root: Path, folder: Path, table: dict[str, object], own_record: bool, record_codes: dict[str, str]
) -> dict[str, object]:
    bmod = folder.name if own_record else table.get("bmod")
    if not isinstance(bmod, str) or not bmod:
        bmod = None
    return {
        "skill": folder.name,
        "module": record_codes.get(bmod) if bmod else None,
        "bmod": bmod,
        "root": str(root),
        "source": table.get("source"),
    }


def absent_records(skills: list[dict[str, object]], folders: dict[str, Path]) -> list[dict[str, object]]:
    """One problem per module record that skills name and no root holds."""
    problems: list[dict[str, object]] = []
    by_bmod: dict[str, list[dict[str, object]]] = {}
    for entry in skills:
        if entry["module"] is not None:
            continue
        if entry["bmod"] is None:
            problems.append(
                {
                    "kind": "manifest",
                    "skill": entry["skill"],
                    "problem": f"{entry['skill']}: [skill] does not name its module record under 'bmod'",
                }
            )
            continue
        by_bmod.setdefault(str(entry["bmod"]), []).append(entry)
    for bmod, entries in sorted(by_bmod.items()):
        names = sorted(str(entry["skill"]) for entry in entries)
        state = "has no usable module record" if bmod in folders else "is not installed"
        problem: dict[str, object] = {
            "kind": "module",
            "bmod": bmod,
            "skills": names,
            "problem": f"module record {bmod} {state}; it is named by {', '.join(names)}",
        }
        command = None if bmod in folders else install_command(entries[0]["source"], bmod)
        if command:
            problem["install"] = command
            problem["problem"] = f"{problem['problem']}; install it with `{command}`"
        problems.append(problem)
    return problems


def read_document(path: Path, folder: Path) -> bytes:
    """Read a knowledge document, refusing anything that is not a plain file inside the folder."""
    resolved = path.resolve()
    if not resolved.is_relative_to(folder.resolve()):
        raise ValueError("resolves outside the skill folder")
    status = resolved.stat()
    if not stat.S_ISREG(status.st_mode):
        raise ValueError("is not a regular file")
    with resolved.open("rb") as handle:
        raw = handle.read(READ_LIMIT + 1)
    if len(raw) > READ_LIMIT:
        raise ValueError(f"is larger than {READ_LIMIT} bytes")
    return raw
