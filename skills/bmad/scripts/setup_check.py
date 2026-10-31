#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Tell a starting skill what setup still owes it.

A skill can be installed after the last `bmad setup`, without its module
record, or need a newer hub than the one present. Nothing is recorded to detect
that: everything here is read from the skill's own `bmod.toml`, its module's
`bmod.toml` beside it, the skills installed beside it, and `_bmad/`.

Only what stops a skill from working well is reported, because this runs every
time a skill starts. Recommended skills belong to setup, status, and help.

Which skills and module records are installed depends on the host's ordered
skills roots, and only the caller knows them. Without roots, nothing about
other skills or the module record is claimed; with them, the check reads the
same ordered view setup and knowledge read, and the first root holding a skill
wins it.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.dont_write_bytecode = True

MANIFEST_NAME = "bmod.toml"
_MISSING = object()


def install_command(source: str, skill: str) -> str:
    import setup as hub

    command = hub.install_command(source, skill)
    return f"`{command}`" if command is not None else f"`{skill}` from {source}"


def owed(skill_dir: Path, project_root: Path | None, roots: tuple[Path, ...] = ()) -> list[str]:
    """Plain sentences for the agent to relay; empty when nothing is owed."""
    import setup as hub
    from config_utils import ConfigError, load_central_config

    parsed = hub.read_bmod_file(skill_dir / MANIFEST_NAME)
    if parsed is None or parsed.skill is None:
        return []
    skill = parsed.skill
    notes: list[str] = []

    record = parsed.bmod
    if record is None:
        other = hub.read_bmod_file(skill_dir.parent / skill.bmod / MANIFEST_NAME)
        record = other.bmod if other is not None else None
    if roots:
        folders, _ = hub.locate_skills(hub.unique_folders((*roots, skill_dir.parent)), skill_dir.parent)
        notes.extend(dependency_notes(skill_dir, parsed, folders))
        if record is None:
            record = record_in_view(hub, skill.bmod, folders)

    if record is None or project_root is None or not (project_root / "_bmad").is_dir():
        return notes

    if record.questions:
        try:
            config = load_central_config(project_root)
        except ConfigError:
            config = None
        if config is not None:
            unanswered = [
                question.key
                for question in record.questions
                if lookup(config, ("modules", question.module, *question.key.split("."))) is _MISSING
            ]
            if unanswered:
                notes.append(
                    f"belongs to module `{record.code}`, whose setup questions were never answered "
                    f"({', '.join(unanswered)}). Offer to run `bmad setup`."
                )

    installed_scripts = project_root / "_bmad" / record.code / "scripts"
    for relative in skill.scripts:
        packaged = skill_dir.joinpath(*relative.parts)
        placed = installed_scripts.joinpath(*relative.parts[1:])
        if not placed.is_file() or (packaged.is_file() and placed.read_bytes() != packaged.read_bytes()):
            notes.append(
                f"belongs to module `{record.code}`, whose scripts in `_bmad/{record.code}/scripts/` are "
                "missing or out of date. Offer to run `bmad setup`."
            )
            break

    return notes


def record_in_view(hub, name: str, folders: dict[str, Path]):
    folder = hub.skill_path(folders, name)
    other = hub.read_bmod_file(folder / MANIFEST_NAME) if folder is not None else None
    return other.bmod if other is not None else None


def dependency_notes(skill_dir: Path, parsed, folders: dict[str, Path]) -> list[str]:
    """What the skill's module record and required skills lack in the ordered view of the skills roots."""
    import setup as hub

    skill = parsed.skill
    notes: list[str] = []
    record = parsed.bmod or record_in_view(hub, skill.bmod, folders)
    if record is None:
        notes.append(
            f"belongs to a module whose record `{skill.bmod}` is not installed in the active skills roots. "
            f"Offer to install it with {install_command(skill.source, skill.bmod)}."
        )

    own_source = skill.source if skill.source is not None else record.update_source if record else ""
    declared = [(requirement, record.update_source) for requirement in (record.required_skills if record else ())]
    declared += [(requirement, own_source) for requirement in skill.required_skills]
    # A skill named by both lists is checked once, against the higher minimum.
    wanted: dict[str, tuple] = {}
    for requirement, default_source in declared:
        if requirement.skill == skill_dir.name:
            continue
        kept = wanted.get(requirement.skill)
        if kept is None or (
            requirement.version is not None
            and (kept[0].version is None or (hub.compare_semver(requirement.version, kept[0].version) or 0) > 0)
        ):
            wanted[requirement.skill] = (requirement, default_source)
    for requirement, default_source in wanted.values():
        state, installed = hub.requirement_check(folders, requirement)
        if state == "missing":
            source = requirement.source or default_source
            notes.append(
                f"needs the `{requirement.skill}` skill, which is not installed. "
                f"If you have no `{requirement.skill}` skill, offer to install it with "
                f"{install_command(source, requirement.skill)}."
            )
        elif state == "outdated":
            notes.append(
                f"needs `{requirement.skill}` {requirement.version} or later, and {installed} is installed. "
                "Offer to run `npx skills update`."
            )
        elif state == "unknown-version":
            notes.append(
                f"needs `{requirement.skill}` {requirement.version} or later, and the installed copy's version "
                "cannot be read. Offer to run `npx skills update`."
            )
    return notes


def lookup(data: object, keys: tuple[str, ...]) -> object:
    current = data
    for key in keys:
        if not isinstance(current, dict) or key not in current:
            return _MISSING
        current = current[key]
    return current


def report(skill_dir: Path, project_root: Path | None, roots: tuple[Path, ...] = ()) -> None:
    """Write what is owed to stderr, worded as an instruction so no skill has to explain it.

    A failure here must never stop the skill from resolving.
    """
    try:
        notes = owed(skill_dir, project_root, roots)
    except Exception:
        return
    for note in notes:
        sys.stderr.write(f"setup: before continuing, tell the user that `{skill_dir.name}` {note}\n")
