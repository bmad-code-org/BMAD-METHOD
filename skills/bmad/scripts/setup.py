#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Set up or report on the project BMad runtime from the installed bmod.toml files."""

from __future__ import annotations

import argparse
import copy
import datetime
import json
import os
import re
import shutil
import sys
import tomllib
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path, PurePosixPath
from typing import NamedTuple

sys.dont_write_bytecode = True

MANIFEST_NAME = "bmod.toml"
QUESTION_KEYS = frozenset({"key", "prompt", "default"})
OPTIONAL_QUESTION_KEYS = frozenset({"scope"})
QUESTION_SCOPES = ("team", "user")
UPDATE_SOURCE_PREFIXES = ("github:", "https://", "file:", "plugin:")
MODULE_NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*\Z")
SKILL_NAME = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*\Z")
RESERVED_MODULE_DIRS = frozenset({"_config", "custom", "modules", "scripts"})
TEAM_CONFIG = "_bmad/config.toml"
USER_CONFIG = "_bmad/custom/config.user.toml"
CUSTOM_GITIGNORE = "*.user.toml\n"
GITIGNORE_COVERS_USER_CONFIG = frozenset({"*.user.toml", "config.user.toml", "*.toml", "*"})

# Traces the classic installer leaves under _bmad. Setup and status report
# them and never touch them; they belong to the old-installer world.
LEGACY_LEFTOVERS = (
    "_config/manifest.yaml",
    "_config/files-manifest.csv",
    "_config/skill-manifest.csv",
    "_config/bmad-help.csv",
    "config.user.toml",
    "core/config.yaml",
    "bmm/config.yaml",
    "core/v6-shims",
)
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
SOURCE_READ_LIMIT = 1024 * 1024
_MISSING = object()


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


class ParsedSkill(NamedTuple):
    bmod: str | None
    source: str | None
    scripts: tuple[PurePosixPath, ...]
    required_skills: tuple[Requirement, ...]
    recommended_skills: tuple[Requirement, ...]


class ParsedFile(NamedTuple):
    bmod: ParsedBmod | None
    skill: ParsedSkill | None


class InstalledFile(NamedTuple):
    folder: str
    source: Path
    file: Path
    parsed: ParsedFile


class InstalledModule(NamedTuple):
    module: str
    folder: str
    source: Path
    file: Path
    parsed: ParsedBmod
    skills: tuple[str, ...]
    absent_skills: tuple[str, ...]
    members: tuple[InstalledFile, ...]
    questions: tuple[ConfigQuestion, ...]


class Installation(NamedTuple):
    files: tuple[InstalledFile, ...]
    modules: tuple[InstalledModule, ...]
    missing_records: tuple[dict[str, object], ...]
    problems: tuple[dict[str, object], ...]


class PlainTree(NamedTuple):
    directories: tuple[PurePosixPath, ...]
    files: tuple[tuple[PurePosixPath, bytes], ...]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Set up and repair {project-root}/_bmad, or report on the installed BMad modules."
    )
    parser.add_argument("--project-root", type=Path, required=True)
    parser.add_argument("--skill", type=Path, required=True)
    parser.add_argument("--module", help="limit the run to one module, by code or by bmod-<code>")
    parser.add_argument("--module-answers", type=Path)
    parser.add_argument(
        "--list-config-questions",
        action="store_true",
        help="print unanswered installed-module questions as JSON",
    )
    parser.add_argument(
        "--status",
        action="store_true",
        help="report on the installation without changing files",
    )
    args = parser.parse_args(argv)
    project_root = args.project_root.resolve()
    skill_root = args.skill.resolve()
    if args.status:
        if args.list_config_questions or args.module_answers is not None:
            parser.error("--status cannot be combined with questions or answers")
        print_json(status_report(project_root, skill_root, module=args.module))
        return 0
    if args.list_config_questions:
        if args.module_answers is not None:
            parser.error("--list-config-questions cannot be combined with answer files")
        listing = list_config_questions(project_root, skill_root, module=args.module)
        print_json(listing)
        return 0
    report = setup(
        project_root,
        skill_root,
        module=args.module,
        module_answers=(load_module_answers(args.module_answers) if args.module_answers is not None else None),
        module_answers_source=args.module_answers,
    )
    print_json(report)
    return 0


def print_json(value: object) -> None:
    print(json.dumps(value, ensure_ascii=False, default=str))


def setup(
    project_root: Path,
    skill_root: Path,
    *,
    module: str | None = None,
    module_answers: dict[tuple[str, str], str] | None = None,
    module_answers_source: Path | None = None,
) -> dict[str, object]:
    """Create what is missing, repair what is stale, add new answers, and report what was done."""
    bmad = project_root / "_bmad"
    reject_unusable_bmad(project_root)
    scripts_src, config_src = payload(skill_root)
    installation = discover_installation(skill_root)
    selected, unknown = select_module(installation, module, mode="setup")
    if unknown is not None:
        return unknown
    scoped = installation.modules if selected is None else (selected,)

    existing_text, merged, base_text = team_config_plan(project_root, config_src)
    user_existing_text, user_existing = existing_user_config(project_root)
    user_merged = copy.deepcopy(user_existing)

    pending = find_pending_questions(scoped, merged, user_existing, project_root)
    answers = validate_module_answers(module_answers, pending, source=module_answers_source)
    team_added: list[tuple[tuple[str, ...], str]] = []
    user_added: list[tuple[tuple[str, ...], str]] = []
    for question in pending:
        path = ("modules", question.module, *question.key.split("."))
        value = answers[(question.module, question.key)]
        if question.scope == "user":
            set_missing_value(user_merged, path, value, user_config_path(project_root))
            user_added.append((path, value))
        else:
            set_missing_value(merged, path, value, project_root / "_bmad" / "config.toml")
            team_added.append((path, value))
    # base_text is the file's own text only when the template adds nothing to it.
    team_text = base_text if base_text == existing_text else None
    config_text = text_with_answers(team_text, team_added, merged) if team_added else base_text
    user_text = text_with_answers(user_existing_text, user_added, user_merged) if user_added else None
    if user_added:
        reject_unwritable_user_config(project_root)

    module_trees: dict[str, PlainTree] = {}
    for installed in scoped:
        reject_unusable_module_root(bmad / installed.module)
        module_trees[installed.module] = declared_scripts_tree(read_module_scripts(installed))

    created = not bmad.exists()
    done = {"missing": "created", "stale": "repaired", "current": "current"}
    shared_state = done[tree_state(bmad / "scripts", read_plain_tree(scripts_src))]
    module_states = {code: done[tree_state(bmad / code / "scripts", tree)] for code, tree in module_trees.items()}
    config_state = team_config_state(project_root, existing_text, config_text)
    gitignore_state = custom_gitignore_state(project_root)
    custom = bmad / "custom"
    changed = (
        created
        or shared_state != "current"
        or config_state != "current"
        or bool(user_added)
        or gitignore_state == "missing"
        or not (custom.exists() or custom.is_symlink())
        or any(state != "current" for state in module_states.values())
    )
    if changed:
        materialize_bmad(
            project_root,
            scripts_src,
            config_text,
            module_trees,
            user_config_text=user_text,
        )
    output = project_root / output_folder(config_text)
    if not output.exists() and not output.is_symlink():
        changed = True
    ensure_dir(output)

    unmet = unmet_requirements(installation, skill_root, module=None if selected is None else selected.module)
    recommended = unmet_recommendations(installation, skill_root, module=None if selected is None else selected.module)
    remaining = find_pending_questions(installation.modules, merged, user_merged, project_root)
    next_command = next_step(installation.missing_records, unmet, setup_owed=bool(remaining))
    problems = [*installation.problems, *custom_gitignore_problems(gitignore_state)]
    return {
        "mode": "setup",
        "status": "created" if created else "repaired" if changed else "current",
        "changed": changed,
        "module": None if selected is None else selected.module,
        "bmad": bmad_report(installation, skill_root),
        "shared_scripts": shared_state,
        "config": config_state,
        "custom_gitignore": "created" if gitignore_state == "missing" else gitignore_state,
        "modules": [{**module_summary(installed), "scripts": module_states[installed.module]} for installed in scoped],
        "answers_added": [
            {
                "module": question.module,
                "key": question.key,
                "scope": question.scope,
                "file": scope_file(question.scope),
            }
            for question in pending
        ],
        "answers": current_answers(scoped, merged, user_merged),
        "pending_questions": [question_json(question) for question in remaining],
        "unmet_requirements": unmet,
        "unmet_recommendations": recommended,
        "missing_module_records": list(installation.missing_records),
        "problems": problems,
        "legacy_leftovers": legacy_leftovers(project_root),
        "current": next_command is None and not unmet and not problems and not installation.missing_records,
        "next": next_command,
    }


def payload(skill_root: Path) -> tuple[Path, Path]:
    scripts_src = skill_root / "scripts"
    assets_src = skill_root / "assets"
    config_src = assets_src / "config.template.toml"
    resolve_config = scripts_src / "resolve_config.py"
    for directory in (scripts_src, assets_src):
        if not directory.is_dir():
            raise Exception(f"missing directory: {directory}")
    for file in (resolve_config, config_src):
        if not file.is_file():
            raise Exception(f"missing file: {file}")
    return (scripts_src, config_src)


def team_config_plan(project_root: Path, config_src: Path) -> tuple[str | None, dict, str]:
    """The team file's text, its values with the template's new keys filled in, and the text setup would write."""
    template_text = fill_team_config(config_src.read_text(encoding="utf-8"), project_root)
    template = parse_toml(template_text, config_src)
    existing_text, existing = existing_team_config(project_root)
    merged = fill_keep(template, existing)
    if not isinstance(merged, dict):
        raise Exception(f"invalid team config: {project_root / '_bmad' / 'config.toml'}")
    base_text = existing_text if existing_text is not None and merged == existing else render_toml(merged)
    return existing_text, merged, base_text


def team_config_state(project_root: Path, existing_text: str | None, config_text: str) -> str:
    if existing_text is None:
        return "created"
    path = project_root / "_bmad" / "config.toml"
    if path.is_symlink() or fill_toml(existing_text, config_text) != existing_text:
        return "updated"
    return "current"


def reject_unusable_module_root(module_root: Path) -> None:
    if module_root.is_symlink() or (module_root.exists() and not module_root.is_dir()):
        raise Exception(f"module runtime is not a plain directory: {module_root}")


def pending_config_questions(
    project_root: Path,
    skill_root: Path,
    modules: tuple[InstalledModule, ...],
) -> tuple[ConfigQuestion, ...]:
    _scripts, config_src = payload(skill_root)
    _existing_text, merged, _base_text = team_config_plan(project_root, config_src)
    _user_text, user_config = existing_user_config(project_root)
    return find_pending_questions(modules, merged, user_config, project_root)


def list_config_questions(project_root: Path, skill_root: Path, *, module: str | None = None) -> object:
    """The pending questions as a JSON list, or the unknown-module report."""
    reject_unusable_bmad(project_root)
    installation = discover_installation(skill_root)
    selected, unknown = select_module(installation, module, mode="list-config-questions")
    if unknown is not None:
        return unknown
    scoped = installation.modules if selected is None else (selected,)
    return [question_json(question) for question in pending_config_questions(project_root, skill_root, scoped)]


def question_json(question: ConfigQuestion) -> dict[str, str]:
    return {
        "module": question.module,
        "key": question.key,
        "prompt": question.prompt,
        "default": question.default,
        "scope": question.scope,
    }


def scope_file(scope: str) -> str:
    return USER_CONFIG if scope == "user" else TEAM_CONFIG


def current_answers(
    modules: tuple[InstalledModule, ...],
    team: dict,
    user: dict,
) -> dict[str, list[dict[str, object]]]:
    answers: dict[str, list[dict[str, object]]] = {}
    for installed in modules:
        entries: list[dict[str, object]] = []
        for question in installed.questions:
            config = user if question.scope == "user" else team
            value = lookup(config, ("modules", question.module, *question.key.split(".")))
            if value is _MISSING:
                continue
            entries.append(
                {
                    "key": question.key,
                    "scope": question.scope,
                    "file": scope_file(question.scope),
                    "value": value,
                }
            )
        if entries:
            answers[installed.module] = entries
    return answers


def lookup(data: object, keys: tuple[str, ...]) -> object:
    current = data
    for key in keys:
        if not isinstance(current, dict) or key not in current:
            return _MISSING
        current = current[key]
    return current


def reject_unusable_bmad(project_root: Path) -> None:
    bmad = project_root / "_bmad"
    if bmad.is_symlink():
        target = bmad.resolve()
        raise Exception(
            f"{bmad} is a symlink to {target}; setup replaces "
            f"_bmad in place, so run it with --project-root "
            f"{target.parent} to fix the real installation"
        )
    if bmad.exists() and not bmad.is_dir():
        raise Exception(f"existing BMad runtime is not a directory: {bmad}")


def user_config_path(project_root: Path) -> Path:
    return project_root / "_bmad" / "custom" / "config.user.toml"


def existing_user_config(project_root: Path) -> tuple[str | None, dict]:
    path = user_config_path(project_root)
    if not path.exists() and not path.is_symlink():
        return None, {}
    if not path.is_file():
        raise Exception(f"user config is not a file: {path}")
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise Exception(f"cannot read user config {path}: {error}") from error
    return text, parse_toml(text, path)


def reject_unwritable_user_config(project_root: Path) -> None:
    """Setup writes a user answer only into a plain file in a plain folder."""
    path = user_config_path(project_root)
    for candidate in (path.parent, path):
        if candidate.is_symlink():
            raise Exception(f"cannot add a user answer: {candidate} is a symlink")
    if path.parent.exists() and not path.parent.is_dir():
        raise Exception(f"cannot add a user answer: {path.parent} is not a directory")


def custom_gitignore_state(project_root: Path) -> str:
    custom = project_root / "_bmad" / "custom"
    if custom.is_symlink() or (custom.exists() and not custom.is_dir()):
        return "skipped"
    gitignore = custom / ".gitignore"
    if not gitignore.exists() and not gitignore.is_symlink():
        return "missing"
    try:
        lines = {line.strip() for line in gitignore.read_text(encoding="utf-8").splitlines()}
    except (OSError, UnicodeError):
        return "unprotected"
    return "current" if lines & GITIGNORE_COVERS_USER_CONFIG else "unprotected"


def custom_gitignore_problems(state: str) -> list[dict[str, object]]:
    if state != "unprotected":
        return []
    return [
        {
            "kind": "custom-gitignore",
            "message": (
                f"_bmad/custom/.gitignore has no line that ignores {USER_CONFIG}, so user answers may be "
                "committed; add the line *.user.toml"
            ),
        }
    ]


def legacy_leftovers(project_root: Path) -> list[str]:
    return [
        relative
        for relative in LEGACY_LEFTOVERS
        if (project_root / "_bmad").joinpath(*PurePosixPath(relative).parts).exists()
    ]


def select_module(
    installation: Installation,
    name: str | None,
    *,
    mode: str,
) -> tuple[InstalledModule | None, dict[str, object] | None]:
    """The module a name means, or the report that lists what is installed."""
    if name is None:
        return None, None
    for names in (
        lambda installed: installed.module,
        lambda installed: f"bmod-{installed.module}",
        lambda installed: installed.folder,
    ):
        for installed in installation.modules:
            if name == names(installed):
                return installed, None
    wanted = {name, f"bmod-{name}"}
    return None, {
        "mode": mode,
        "status": "unknown-module",
        "changed": False,
        "module": name,
        "installed_modules": [installed.module for installed in installation.modules],
        "missing_module_records": [record for record in installation.missing_records if record["bmod"] in wanted],
    }


def module_summary(installed: InstalledModule) -> dict[str, object]:
    return {
        "module": installed.module,
        "folder": installed.folder,
        "version": installed.parsed.version,
        "update_source": installed.parsed.update_source,
        "skills": list(installed.skills),
        "absent_skills": list(installed.absent_skills),
    }


def bmad_report(installation: Installation, skill_root: Path) -> dict[str, object]:
    """The bmad skill in use. Its version is its module's, and unknown when that record is absent."""
    report: dict[str, object] = {"skill": skill_root.name, "version": None, "module": None}
    resolved = skill_root.resolve()
    by_folder = {installed.folder: installed for installed in installation.files}
    for installed in installation.files:
        if installed.source.resolve() != resolved:
            continue
        record = installed.parsed.bmod
        if record is None and installed.parsed.skill is not None and installed.parsed.skill.bmod is not None:
            other = by_folder.get(installed.parsed.skill.bmod)
            record = other.parsed.bmod if other is not None else None
        if record is not None:
            report.update({"version": record.version, "module": record.code})
        break
    return report


def unmet_requirements(
    installation: Installation,
    skill_root: Path,
    *,
    module: str | None = None,
) -> list[dict[str, object]]:
    """Required skills the current install does not satisfy."""
    return unmet_entries(installation, skill_root, "required_skills", module)


def unmet_recommendations(
    installation: Installation,
    skill_root: Path,
    *,
    module: str | None = None,
) -> list[dict[str, object]]:
    """Recommended skills that are absent or too old. Worth offering, never a fault."""
    return unmet_entries(installation, skill_root, "recommended_skills", module)


def unmet_entries(
    installation: Installation,
    skill_root: Path,
    field: str,
    module: str | None,
) -> list[dict[str, object]]:
    """A module's list is checked once for the module, a skill's own list once for the skill."""
    skills_dir = skill_root.parent
    by_folder = {installed.folder: installed for installed in installation.files}
    declared: list[tuple[str, str | None, str, Requirement]] = []
    for installed in installation.modules:
        for requirement in getattr(installed.parsed, field):
            declared.append((installed.folder, installed.module, installed.parsed.update_source, requirement))
    for installed in installation.files:
        skill = installed.parsed.skill
        if skill is None:
            continue
        record = installed.parsed.bmod
        if record is None and skill.bmod is not None and skill.bmod in by_folder:
            record = by_folder[skill.bmod].parsed.bmod
        default_source = skill.source if skill.source is not None else record.update_source if record else None
        for requirement in getattr(skill, field):
            declared.append((installed.folder, record.code if record else None, default_source or "", requirement))

    unmet: list[dict[str, object]] = []
    for folder, code, default_source, requirement in declared:
        if requirement.skill == folder or (module is not None and code != module):
            continue
        state, present = requirement_check(skills_dir, requirement)
        if state is None:
            continue
        source = requirement.source if requirement.source is not None else default_source
        unmet.append(
            {
                "skill": folder,
                "module": code,
                "requires": requirement.skill,
                "minimum": requirement.version,
                "installed": present,
                "state": state,
                "source": source,
                "channel": requirement_channel(source),
                "install": fix_command(state, source, requirement.skill),
            }
        )
    return unmet


def requirement_check(skills_dir: Path, requirement: Requirement) -> tuple[str | None, str | None]:
    """Why a requirement is unmet, with the version found. The state is None when it is met."""
    if not (skills_dir / requirement.skill).is_dir():
        return "missing", None
    if requirement.version is None:
        return None, None
    installed = skill_module_version(skills_dir, requirement.skill)
    if installed is None:
        if names_a_module_record(skills_dir, requirement.skill):
            # Its record is absent, which is reported as a missing module record.
            return None, None
        # A copy from before module records has no version to read, and that
        # copy is what a minimum version exists to catch.
        return "unknown-version", None
    return requirement_state(installed, requirement.version), installed


def names_a_module_record(skills_dir: Path, skill: str) -> bool:
    try:
        parsed = read_bmod_file(skills_dir / skill / MANIFEST_NAME)
    except Exception:
        return False
    return parsed is not None and parsed.skill is not None and parsed.skill.bmod is not None


def skill_module_version(skills_dir: Path, skill: str) -> str | None:
    """The version of the module an installed skill belongs to.

    Skills carry no version. None means the skill has no bmod.toml or its
    module record is absent, so there is nothing to compare.
    """
    try:
        parsed = read_bmod_file(skills_dir / skill / MANIFEST_NAME)
        if parsed is None:
            return None
        if parsed.bmod is not None:
            return parsed.bmod.version
        if parsed.skill is None or parsed.skill.bmod is None:
            return None
        record = read_bmod_file(skills_dir / parsed.skill.bmod / MANIFEST_NAME)
    except Exception:
        return None
    if record is None or record.bmod is None:
        return None
    return record.bmod.version


def read_bmod_file(path: Path) -> ParsedFile | None:
    if not path.is_file():
        return None
    try:
        raw = path.read_bytes()
    except OSError as error:
        raise Exception(f"cannot read bmod file {path}: {error}") from error
    return parse_bmod_file(path, raw)


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


def requirement_channel(source: str) -> str:
    """How a missing or stale requirement is installed, so help offers the right command."""
    if source.startswith("plugin:"):
        return "plugin"
    if source.startswith("file:"):
        return "local"
    return "skills-cli"


def install_command(source: str, skill: str) -> str | None:
    """The `npx skills` command that installs one skill, or None when the source has no such command."""
    if not source.startswith("github:"):
        return None
    owner, repository, *_tree = source.removeprefix("github:").split("/")
    return f"npx skills add {owner}/{repository} --skill {skill}"


UPDATE_FIXES = ("outdated", "unknown-version")


def fix_command(state: str, source: str, skill: str) -> str | None:
    """Adding a skill does not raise its module's version, so an outdated one is updated instead."""
    if state == "missing":
        return install_command(source, skill)
    if state in UPDATE_FIXES and requirement_channel(source) == "skills-cli":
        return "npx skills update"
    return None


def next_step(
    missing_records: tuple[dict[str, object], ...],
    unmet: list[dict[str, object]],
    *,
    update_available: bool = False,
    setup_owed: bool = False,
    module: str | None = None,
) -> str | None:
    """The one command to run next: install what is absent, then update, then setup."""
    for record in missing_records:
        if record["install"] is not None:
            return str(record["install"])
    for entry in unmet:
        if entry["state"] == "missing" and entry["install"] is not None:
            return str(entry["install"])
    outdated = any(entry["state"] in UPDATE_FIXES and entry["channel"] == "skills-cli" for entry in unmet)
    if outdated or update_available:
        return "npx skills update"
    if setup_owed:
        return "bmad setup" if module is None else f"bmad setup {module}"
    return None


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


def parse_toml(text: str, source: Path | str) -> dict:
    try:
        return tomllib.loads(text)
    except tomllib.TOMLDecodeError as error:
        raise Exception(f"cannot parse TOML {source}: {error}") from error


def discover_installation(skill_root: Path) -> Installation:
    """Every bmod.toml beside the bmad skill, sorted into module records, their skills, and problems."""
    problems: list[dict[str, object]] = []
    files = discover_installed_files(skill_root, problems)
    by_folder = {installed.folder: installed for installed in files}
    winners = select_module_records(files, problems)

    modules: list[InstalledModule] = []
    for code in sorted(winners):
        record_file = winners[code]
        record = record_file.parsed.bmod
        assert record is not None
        listed = member_names(record_file)
        present = tuple(name for name in listed if (skill_root.parent / name).is_dir())
        members: list[InstalledFile] = []
        for name in present:
            member = by_folder.get(name)
            if member is None or member.parsed.skill is None:
                continue
            if member is record_file or (member.parsed.bmod is None and member.parsed.skill.bmod == record_file.folder):
                members.append(member)
                continue
            detail = (
                f"names {member.parsed.skill.bmod!r} as its bmod"
                if member.parsed.bmod is None
                else "is a module record of its own"
            )
            problems.append(
                {
                    "kind": "membership",
                    "skill": name,
                    "bmod": record_file.folder,
                    "message": f"{record_file.file} lists the skill {name!r}, but {member.file} {detail}",
                }
            )
        modules.append(
            InstalledModule(
                code,
                record_file.folder,
                record_file.source,
                record_file.file,
                record,
                present,
                tuple(name for name in listed if name not in present),
                tuple(members),
                record.questions,
            )
        )

    missing_records: list[dict[str, object]] = []
    for installed in files:
        skill = installed.parsed.skill
        if skill is not None and installed.parsed.bmod is not None and installed.folder not in member_names(installed):
            problems.append(
                {
                    "kind": "membership",
                    "skill": installed.folder,
                    "bmod": installed.folder,
                    "message": f"{installed.file} holds [bmod] and [skill], but its skills list leaves out {installed.folder!r}",
                }
            )
        if skill is None or installed.parsed.bmod is not None or skill.bmod is None:
            continue
        record_file = by_folder.get(skill.bmod)
        if record_file is None or record_file.parsed.bmod is None:
            source = skill.source or ""
            missing_records.append(
                {
                    "skill": installed.folder,
                    "bmod": skill.bmod,
                    "source": source,
                    "channel": requirement_channel(source),
                    "install": install_command(source, skill.bmod),
                }
            )
        elif installed.folder not in member_names(record_file):
            problems.append(
                {
                    "kind": "membership",
                    "skill": installed.folder,
                    "bmod": skill.bmod,
                    "message": (
                        f"{installed.file} names {skill.bmod!r} as its bmod, but "
                        f"{record_file.file} does not list the skill {installed.folder!r}"
                    ),
                }
            )
    return Installation(files, tuple(modules), tuple(missing_records), tuple(problems))


def discover_installed_files(skill_root: Path, problems: list[dict[str, object]]) -> tuple[InstalledFile, ...]:
    """One unusable file must not stop the install: it becomes a problem and its folder is skipped."""
    files: list[InstalledFile] = []
    try:
        siblings = sorted(skill_root.parent.iterdir(), key=lambda path: path.name)
    except OSError as error:
        raise Exception(f"cannot inspect installed skills {skill_root.parent}: {error}") from error
    for sibling in siblings:
        if not sibling.is_dir():
            continue
        path = sibling / MANIFEST_NAME
        try:
            parsed = read_bmod_file(path)
        except Exception as error:
            problems.append({"kind": "bmod-file", "folder": sibling.name, "message": str(error)})
            continue
        if parsed is not None:
            files.append(InstalledFile(sibling.name, sibling, path, parsed))
    return tuple(files)


def select_module_records(
    files: tuple[InstalledFile, ...],
    problems: list[dict[str, object]],
) -> dict[str, InstalledFile]:
    """One record per module code. Files arrive sorted by folder name, so the first one wins."""
    casefolded: dict[str, InstalledFile] = {}
    winners: dict[str, InstalledFile] = {}
    for installed in files:
        record = installed.parsed.bmod
        if record is None:
            continue
        previous = casefolded.get(record.code.casefold())
        if previous is None:
            casefolded[record.code.casefold()] = installed
            winners[record.code] = installed
            continue
        assert previous.parsed.bmod is not None
        if previous.parsed.bmod.code != record.code:
            raise Exception(
                "installed module codes differ only by case: "
                f"{previous.parsed.bmod.code!r} from {previous.file} and "
                f"{record.code!r} from {installed.file}"
            )
        problems.append(
            {
                "kind": "duplicate-module",
                "module": record.code,
                "folder": installed.folder,
                "kept": previous.folder,
                "message": (
                    f"module code {record.code!r} is declared by {previous.file} and by "
                    f"{installed.file}; the first is used"
                ),
            }
        )
    return winners


def member_names(record_file: InstalledFile) -> tuple[str, ...]:
    record = record_file.parsed.bmod
    assert record is not None
    if record.skills is not None:
        return record.skills
    return (record_file.folder,) if record_file.parsed.skill is not None else ()


def read_module_scripts(installed: InstalledModule) -> tuple[tuple[PurePosixPath, bytes], ...]:
    """The scripts a module's installed skills place in `_bmad/<code>/scripts/`."""
    placed: dict[PurePosixPath, tuple[bytes, Path]] = {}
    scripts: list[tuple[PurePosixPath, bytes]] = []
    for member in installed.members:
        assert member.parsed.skill is not None
        for relative in member.parsed.skill.scripts:
            content = read_declared_script(member.source, relative, member.file)
            destination = PurePosixPath(*relative.parts[1:])
            previous = placed.get(destination)
            if previous is None:
                placed[destination] = (content, member.file)
                scripts.append((relative, content))
            elif previous[0] != content:
                raise Exception(
                    f"module {installed.module!r} has two different scripts for "
                    f"{destination.as_posix()!r}: {previous[1]} and {member.file}"
                )
    return tuple(scripts)


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

    Shared with tools/validate_manifests.py and knowledge.py so one rule decides
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


def read_declared_script(skill_root: Path, relative: PurePosixPath, file: Path) -> bytes:
    root = skill_root.resolve()
    candidate = root.joinpath(*relative.parts)
    try:
        resolved = candidate.resolve(strict=True)
        resolved.relative_to(root)
    except (OSError, RuntimeError, ValueError) as error:
        raise Exception(f"bmod file {file} declares unsafe or missing script {relative.as_posix()!r}") from error
    if not resolved.is_file():
        raise Exception(f"bmod file {file} declared script {relative.as_posix()!r} is not a file")
    try:
        return resolved.read_bytes()
    except OSError as error:
        raise Exception(f"cannot read script {resolved} declared by {file}: {error}") from error


def status_report(project_root: Path, skill_root: Path, *, module: str | None = None) -> dict[str, object]:
    """Everything `bmad status` says. Reads only; nothing under the project is written."""
    reject_unusable_bmad(project_root)
    bmad = project_root / "_bmad"
    installation = discover_installation(skill_root)
    selected, unknown = select_module(installation, module, mode="status")
    if unknown is not None:
        return unknown
    scoped = installation.modules if selected is None else (selected,)
    code = None if selected is None else selected.module
    problems = list(installation.problems)

    modules: list[dict[str, object]] = []
    update_states: list[str] = []
    for installed in scoped:
        update = module_update_report(project_root, installed)
        update_states.append(str(update["state"]))
        try:
            reject_unusable_module_root(bmad / installed.module)
            scripts = tree_state(
                bmad / installed.module / "scripts", declared_scripts_tree(read_module_scripts(installed))
            )
        except Exception as error:
            scripts = "could-not-check"
            problems.append({"kind": "scripts", "module": installed.module, "message": str(error)})
        modules.append(
            {
                **module_summary(installed),
                "scripts": scripts,
                "update": update,
            }
        )

    scripts_src, config_src = payload(skill_root)
    shared_state = tree_state(bmad / "scripts", read_plain_tree(scripts_src))
    existing_text, _merged, base_text = team_config_plan(project_root, config_src)
    output = project_root / output_folder(base_text)
    custom = bmad / "custom"
    pending = pending_config_questions(project_root, skill_root, scoped)
    unmet = unmet_requirements(installation, skill_root, module=code)
    gitignore_state = custom_gitignore_state(project_root)
    problems.extend(custom_gitignore_problems(gitignore_state))
    setup_owed = (
        not bmad.is_dir()
        or shared_state != "current"
        or team_config_state(project_root, existing_text, base_text) != "current"
        or not (custom.exists() or custom.is_symlink())
        or not (output.exists() or output.is_symlink())
        or bool(pending)
        or gitignore_state == "missing"
        or any(item["scripts"] in ("missing", "stale") for item in modules)
    )
    next_command = next_step(
        installation.missing_records,
        unmet,
        update_available="newer-available" in update_states,
        setup_owed=setup_owed,
        module=code,
    )
    settled = ("current", "ahead", "plugin-managed", "could-not-check")
    return {
        "mode": "status",
        "module": code,
        "bmad_exists": bmad.is_dir(),
        "bmad": bmad_report(installation, skill_root),
        "shared_scripts": shared_state,
        "custom_gitignore": gitignore_state,
        "modules": modules,
        "missing_module_records": list(installation.missing_records),
        "pending_questions": [question_json(question) for question in pending],
        "unmet_requirements": unmet,
        "unmet_recommendations": unmet_recommendations(installation, skill_root, module=code),
        "problems": problems,
        "legacy_leftovers": legacy_leftovers(project_root),
        "current": (
            next_command is None
            and not unmet
            and not problems
            and not installation.missing_records
            and all(state in settled for state in update_states)
        ),
        "next": next_command,
    }


def module_update_report(project_root: Path, installed: InstalledModule) -> dict[str, object]:
    """How the installed module compares with the `[bmod] version` at its source."""
    update_source = installed.parsed.update_source
    if update_source.startswith("plugin:"):
        plugin = update_source.removeprefix("plugin:")
        return {
            "state": "plugin-managed",
            "plugin": plugin,
            "instruction": (
                f"this module ships inside the {plugin} plugin — update the "
                "plugin through its marketplace, not these files"
            ),
        }
    source = update_source
    try:
        source = source_file_location(project_root, installed)
        source_version = parse_source_version(source, read_source_file(source, installed))
    except Exception as error:
        return {"state": "could-not-check", "source": source, "reason": str(error)}
    return {
        "state": version_state(installed.parsed.version, source_version),
        "source": source,
        "source_version": source_version,
    }


def source_file_location(project_root: Path, installed: InstalledModule) -> str:
    update_source = installed.parsed.update_source
    quoted_folder = urllib.parse.quote(installed.folder, safe="")
    quoted_name = urllib.parse.quote(MANIFEST_NAME, safe="")
    if update_source.startswith("file:"):
        root_text = update_source.removeprefix("file:")
        root = Path(root_text)
        if not root.is_absolute():
            root = project_root / root
        return str((root / installed.folder / MANIFEST_NAME).resolve())
    if update_source.startswith("https://"):
        try:
            parsed = urllib.parse.urlsplit(update_source)
        except ValueError as error:
            raise Exception(f"invalid update_source {update_source!r} in {installed.file}: {error}") from error
        return urllib.parse.urlunsplit(
            parsed._replace(path=(parsed.path.rstrip("/") + f"/{quoted_folder}/{quoted_name}"))
        )
    github = update_source.removeprefix("github:")
    owner, repository, *tree = github.split("/")
    # With no path the repo root is the skill, so its bmod.toml sits at the root.
    parts = (*tree, installed.folder, MANIFEST_NAME) if tree else (MANIFEST_NAME,)
    path = "/".join(urllib.parse.quote(part, safe="") for part in parts)
    return (
        "https://raw.githubusercontent.com/"
        f"{urllib.parse.quote(owner, safe='')}/"
        f"{urllib.parse.quote(repository, safe='')}/main/{path}"
    )


def read_source_file(source: str, installed: InstalledModule) -> bytes:
    if installed.parsed.update_source.startswith("file:"):
        path = Path(source)
        try:
            raw = path.read_bytes()
        except OSError as error:
            raise Exception(f"cannot read source bmod file {path}: {error}") from error
    else:
        request = urllib.request.Request(
            source,
            headers={"Accept": "text/plain", "User-Agent": "bmad-status"},
        )
        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                raw = response.read(SOURCE_READ_LIMIT + 1)
        except (OSError, urllib.error.URLError) as error:
            raise Exception(f"cannot read source bmod file {source}: {error}") from error
    if len(raw) > SOURCE_READ_LIMIT:
        raise Exception(f"source bmod file {source} exceeds {SOURCE_READ_LIMIT} bytes")
    return raw


def parse_source_version(source: str, raw: bytes) -> str:
    try:
        text = raw.decode("utf-8")
    except UnicodeError as error:
        raise Exception(f"invalid source bmod file {source}: {error}") from error
    table = parse_toml(text, source).get("bmod")
    version = table.get("version") if isinstance(table, dict) else None
    if not isinstance(version, str) or not version.strip():
        raise Exception(f"source bmod file {source} field 'bmod.version' must be a non-empty string")
    return version


def version_state(installed: str, source: str) -> str:
    comparison = compare_semver(installed, source)
    if comparison is None:
        return "differing-unordered"
    if comparison == 0:
        return "current"
    if comparison < 0:
        return "newer-available"
    return "ahead"


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


def declared_scripts_tree(scripts: tuple[tuple[PurePosixPath, bytes], ...]) -> PlainTree:
    by_path = {PurePosixPath(*relative.parts[1:]): content for relative, content in scripts}
    files = tuple(sorted(by_path.items(), key=lambda item: item[0].as_posix()))
    directories = {
        PurePosixPath(*relative.parts[:index])
        for relative, _content in files
        for index in range(1, len(relative.parts))
    }
    return PlainTree(tuple(sorted(directories, key=str)), files)


def read_plain_tree(root: Path) -> PlainTree:
    if not root.is_dir() or root.is_symlink():
        raise Exception(f"payload scripts are not a plain directory: {root}")
    directories: list[PurePosixPath] = []
    files: list[tuple[PurePosixPath, bytes]] = []
    try:
        entries = sorted(root.rglob("*"), key=lambda path: path.as_posix())
    except OSError as error:
        raise Exception(f"cannot inspect payload scripts {root}: {error}") from error
    for entry in entries:
        relative = PurePosixPath(entry.relative_to(root).as_posix())
        if entry.is_symlink():
            raise Exception(f"payload scripts contain a symlink: {entry}")
        if entry.is_dir():
            directories.append(relative)
            continue
        if not entry.is_file():
            raise Exception(f"payload scripts contain a non-file entry: {entry}")
        try:
            content = entry.read_bytes()
        except OSError as error:
            raise Exception(f"cannot read payload script {entry}: {error}") from error
        files.append((relative, content))
    return PlainTree(tuple(directories), tuple(files))


def tree_matches(root: Path, expected: PlainTree) -> bool:
    if not root.is_dir() or root.is_symlink():
        return False
    try:
        actual = read_plain_tree(root)
    except Exception:
        return False
    return actual == expected


def tree_state(root: Path, expected: PlainTree) -> str:
    if not root.exists() and not root.is_symlink():
        return "missing"
    return "current" if tree_matches(root, expected) else "stale"


def find_pending_questions(
    modules: tuple[InstalledModule, ...],
    config: dict,
    user_config: dict,
    project_root: Path,
) -> tuple[ConfigQuestion, ...]:
    """A team question is pending once per project, a user question once per person."""
    pending: list[ConfigQuestion] = []
    for installed in modules:
        for question in installed.questions:
            path = ("modules", question.module, *question.key.split("."))
            if question.scope == "user":
                answered = has_path(user_config, path, user_config_path(project_root))
            else:
                answered = has_path(config, path, project_root / "_bmad" / "config.toml")
            if not answered:
                pending.append(
                    question._replace(default=question.default.replace("{directory_name}", project_root.name))
                )
    return tuple(pending)


def has_path(data: object, path: tuple[str, ...], source: Path) -> bool:
    current = data
    for part in path:
        if not isinstance(current, dict):
            raise Exception(f"cannot inspect {'.'.join(path)}: parent value in {source} is not a table")
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
        raise Exception(f"--module-answers {path} must contain only module answer tables")
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
            raise Exception(f"--module-answers {source} value modules.{module}.{dotted} must be a string")
        identifier = (module, dotted)
        if identifier in answers:
            raise Exception(f"--module-answers {source} defines modules.{module}.{dotted} more than once")
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
            raise Exception(f"{source_label} must map (module, key) pairs to strings")
    expected = {(question.module, question.key) for question in pending}
    extra = sorted(set(answers) - expected)
    if extra:
        module, key = extra[0]
        raise Exception(f"{source_label} contains modules.{module}.{key}, which is not a pending question")
    missing = [question for question in pending if (question.module, question.key) not in answers]
    if missing and supplied is None:
        question = missing[0]
        raise Exception(
            f"pending question modules.{question.module}.{question.key} has no answer; "
            "pass --module-answers (run --list-config-questions first)"
        )
    if missing:
        question = missing[0]
        raise Exception(
            f"{source_label} is missing an answer for pending question "
            f"modules.{question.module}.{question.key}; run "
            "--list-config-questions first"
        )
    return answers


TABLE_HEADER = re.compile(r"\s*\[(?P<array>\[)?(?P<name>[^\[\]]+)\]\]?\s*(?:#.*)?\Z")


def text_with_answers(text: str | None, added: list[tuple[tuple[str, ...], str]], expected: dict) -> str:
    """The file's own text with the new answers added, so comments and layout survive.

    The result must parse to exactly the expected values. When it does not, or
    a table cannot be placed by text, the whole file is rendered instead.
    """
    if text is not None:
        try:
            for path, value in added:
                text = insert_answer(text, path, value)
            if tomllib.loads(text) == expected:
                return text
        except (ValueError, tomllib.TOMLDecodeError):
            pass
    return render_toml(expected)


def insert_answer(text: str, path: tuple[str, ...], value: str) -> str:
    table, leaf = path[:-1], path[-1]
    entry = f"{toml_key(leaf)} = {toml_string(value)}"
    lines = text.split("\n")
    headers = [(index, header_path(line)) for index, line in enumerate(lines) if TABLE_HEADER.match(line)]
    for position, (index, name) in enumerate(headers):
        if name != table:
            continue
        end = headers[position + 1][0] if position + 1 < len(headers) else len(lines)
        last = max(
            (row for row in range(index, end) if lines[row].strip() and not lines[row].lstrip().startswith("#")),
            default=index,
        )
        return "\n".join([*lines[: last + 1], entry, *lines[last + 1 :]])
    if lookup(tomllib.loads(text), table) is not _MISSING:
        raise ValueError(f"{'.'.join(table)} is not written as a table header")
    header = ".".join(toml_key(part) for part in table)
    separator = "" if not text or text.endswith("\n\n") else "\n" if text.endswith("\n") else "\n\n"
    return f"{text}{separator}[{header}]\n{entry}\n"


def header_path(line: str) -> tuple[str, ...] | None:
    match = TABLE_HEADER.match(line)
    if match is None or match.group("array"):
        return None
    try:
        data = tomllib.loads(f"{match.group('name')} = 1")
    except tomllib.TOMLDecodeError:
        return None
    parts: list[str] = []
    while isinstance(data, dict):
        ((key, data),) = data.items()
        parts.append(key)
    return tuple(parts)


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
            raise Exception(f"cannot add {dotted}: parent value in {source} is not a table")
        current = child
    leaf = path[-1]
    if leaf in current:
        raise Exception(f"refusing to overwrite existing {'.'.join(path)} in {source}")
    current[leaf] = value


def fill_team_config(text: str, project_root: Path) -> str:
    return text.replace("{directory_name}", project_root.name)


def output_folder(config_text: str) -> str:
    folder = tomllib.loads(config_text).get("core", {}).get("output_folder", "_bmad-output")
    prefix = "{project-root}/"
    if folder.startswith(prefix):
        folder = folder[len(prefix) :]
    return folder or "_bmad-output"


def materialize_bmad(
    project_root: Path,
    scripts_src: Path,
    config_text: str,
    module_trees: dict[str, PlainTree],
    *,
    user_config_text: str | None = None,
) -> None:
    bmad = project_root / "_bmad"
    project_root.mkdir(parents=True, exist_ok=True)
    # One attempt, not mkdtemp: on Windows, older Pythons' mkdtemp takes "access denied"
    # for a name collision and tries the next name, some two billion times. Setup
    # would hang in a folder it cannot write to instead of reporting the failure.
    staging = project_root / f"_bmad.setup-{os.urandom(8).hex()}"
    staging.mkdir(mode=0o700)
    try:
        # Seed staging so custom/, extra *.user.toml, and leftovers
        # survive replace_dir.
        if bmad.exists():
            scripts = bmad / "scripts"

            def ignore_scripts_link(directory: str, _names: list[str]) -> set[str]:
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
            config_text=config_text,
            module_trees=module_trees,
            user_config_text=user_config_text,
        )
        replace_dir(staging, bmad)
    except Exception:
        shutil.rmtree(staging, ignore_errors=True)
        raise


def replace_dir(src: Path, dest: Path) -> None:
    if not dest.exists():
        src.rename(dest)
        return
    # Not mkdtemp: Windows refuses a rename onto an existing directory.
    backup = dest.with_name(f"_bmad.old-{datetime.datetime.now():%Y%m%d-%H%M%S}")
    dest.rename(backup)
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
    config_text: str,
    module_trees: dict[str, PlainTree],
    user_config_text: str | None,
) -> None:
    ensure_scripts(staging / "scripts", scripts_src)
    ensure_file(staging / "config.toml", config_text)
    # A module's scripts directory exists even when it declares no scripts,
    # so a second run reports current, not repaired.
    for code, tree in module_trees.items():
        ensure_plain_tree(staging / code / "scripts", tree)
    custom = staging / "custom"
    ensure_dir(custom)
    if custom.is_symlink() or not custom.is_dir():
        return
    gitignore = custom / ".gitignore"
    if not gitignore.exists() and not gitignore.is_symlink():
        write_text(gitignore, CUSTOM_GITIGNORE)
    if user_config_text is not None:
        write_text(custom / "config.user.toml", user_config_text)


def ensure_scripts(dest: Path, src: Path) -> None:
    source = read_plain_tree(src)
    if tree_matches(dest, source):
        return
    if dest.is_symlink() or dest.is_file():
        dest.unlink()
    elif dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    for relative in source.directories:
        dest.joinpath(*relative.parts).mkdir(parents=True, exist_ok=True)
    for relative, _content in source.files:
        target = dest.joinpath(*relative.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src.joinpath(*relative.parts), target)


def ensure_plain_tree(dest: Path, source: PlainTree) -> None:
    if tree_matches(dest, source):
        return
    if dest.is_symlink() or dest.is_file():
        dest.unlink()
    elif dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    for relative in source.directories:
        dest.joinpath(*relative.parts).mkdir(parents=True, exist_ok=True)
    for relative, content in source.files:
        target = dest.joinpath(*relative.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        content if content.endswith("\n") else content + "\n",
        encoding="utf-8",
    )


def ensure_file(path: Path, content: str) -> None:
    if path.is_symlink():
        path.unlink()
    elif path.is_file():
        existing = path.read_text(encoding="utf-8")
        filled = fill_toml(existing, content)
        if filled == existing:
            return
        content = filled
    elif path.exists():
        shutil.rmtree(path)
    write_text(path, content)


def ensure_dir(path: Path) -> None:
    if not path.is_symlink() and not path.exists():
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
    escaped = "".join(replacements.get(character, toml_control(character)) for character in value)
    return f'"{escaped}"'


def toml_control(value: str) -> str:
    codepoint = ord(value)
    if codepoint < 0x20 or codepoint == 0x7F:
        return f"\\u{codepoint:04X}"
    return value


def toml_key(key: str) -> str:
    if key and key.isascii() and key[0].isalpha() and all(c.isalnum() or c in "-_" for c in key):
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
        rendered = ", ".join(f"{toml_key(str(key))} = {toml_value(item)}" for key, item in value.items())
        return "{ " + rendered + " }"
    return toml_string(str(value))


def fill_keep(template: object, existing: object) -> object:
    if isinstance(template, dict) and isinstance(existing, dict):
        result = dict(template)
        for key, value in existing.items():
            result[key] = fill_keep(result[key], value) if key in result else value
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
    if merged == template:
        return template_text
    return render_toml(merged)


def cli() -> int:
    try:
        return main()
    except Exception as error:
        sys.stderr.write(f"error: {error}\n")
        return 1


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    raise SystemExit(cli())
