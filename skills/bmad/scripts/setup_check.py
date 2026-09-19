#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Tell a starting skill what setup still owes it.

A skill can be installed after the last `bmad setup`, or need a newer hub than
the one present. Nothing is recorded to detect that: everything here is read
from the skill's own manifest, the skills installed beside it, and `_bmad/`,
the same way doctor works.

Only what stops a skill from working well is reported, because this runs every
time a skill starts. Skills a manifest merely recommends belong to setup,
doctor, and help.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.dont_write_bytecode = True

MANIFEST_NAME = "module-manifest.toml"
_MISSING = object()


def install_command(source: str, skill: str) -> str:
    if source.startswith("github:"):
        owner, repo, *_rest = source.removeprefix("github:").split("/")
        return f"`npx skills add {owner}/{repo} --skill {skill}`"
    return f"`{skill}` from {source}"


def owed(skill_dir: Path, project_root: Path | None) -> list[str]:
    """Plain sentences for the agent to relay; empty when nothing is owed."""
    import setup as hub
    from config_utils import ConfigError, load_central_config

    manifest = skill_dir / MANIFEST_NAME
    if not manifest.is_file():
        return []
    parsed = hub.parse_packaged_manifest(manifest, manifest.read_bytes())
    notes: list[str] = []

    for requirement in parsed.requires:
        source = requirement.source or parsed.update_source
        other = skill_dir.parent / requirement.skill / MANIFEST_NAME
        if not other.is_file():
            notes.append(
                f"needs the `{requirement.skill}` skill, which is not installed beside it. "
                f"If you have no `{requirement.skill}` skill, offer to install it with "
                f"{install_command(source, requirement.skill)}."
            )
            continue
        installed = hub.parse_packaged_manifest(other, other.read_bytes()).version
        comparison = hub.compare_semver(installed, requirement.version)
        if comparison is not None and comparison < 0:
            notes.append(
                f"needs `{requirement.skill}` {requirement.version} or later, and {installed} is installed. "
                "Offer to run `npx skills update`."
            )

    if project_root is None or not (project_root / "_bmad").is_dir():
        return notes

    if parsed.questions:
        try:
            config = load_central_config(project_root)
        except ConfigError:
            config = None
        if config is not None:
            unanswered = [
                question.key
                for question in parsed.questions
                if lookup(config, ("modules", question.module, *question.key.split("."))) is _MISSING
            ]
            if unanswered:
                notes.append(
                    f"belongs to module `{parsed.module}`, whose setup questions were never answered "
                    f"({', '.join(unanswered)}). Offer to run `bmad doctor`."
                )

    installed_scripts = project_root / "_bmad" / parsed.module / "scripts"
    for relative in parsed.scripts:
        packaged = skill_dir.joinpath(*relative.parts)
        placed = installed_scripts.joinpath(*relative.parts[1:])
        if not placed.is_file() or (packaged.is_file() and placed.read_bytes() != packaged.read_bytes()):
            notes.append(
                f"belongs to module `{parsed.module}`, whose scripts in `_bmad/{parsed.module}/scripts/` are "
                "missing or out of date. Offer to run `bmad doctor`."
            )
            break

    return notes


def lookup(data: object, keys: tuple[str, ...]) -> object:
    current = data
    for key in keys:
        if not isinstance(current, dict) or key not in current:
            return _MISSING
        current = current[key]
    return current


def report(skill_dir: Path, project_root: Path | None) -> None:
    """Write what is owed to stderr, worded as an instruction so no skill has to explain it.

    A failure here must never stop the skill from resolving.
    """
    try:
        notes = owed(skill_dir, project_root)
    except Exception:
        return
    for note in notes:
        sys.stderr.write(f"setup: before continuing, tell the user that `{skill_dir.name}` {note}\n")
