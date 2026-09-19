#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Report the people and groups the installed skills offer.

A skill names roster files under `roster` in its manifest. Each file lists
members and the groups they form. Nothing is recorded under `_bmad`: the roster
is whatever the installed skills carry right now, so adding or removing a skill
changes it with no setup step.

A member with `skill` is an agent, present only while that skill is installed;
its name, title and icon follow the skill's customization. A member without
`skill` is a guest, available to groups and never part of the default room.
`[agents.<code>]` tables in the central config still apply on top, so a user's
own agents and overrides keep working.

A module replicates one roster file across its skills, so the same file is
usually present many times. Copies that disagree are reported, never resolved
by picking one.

Usage:
  uv run roster.py --skill <any installed skill> [--project-root P] [--root R ...]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

from config_utils import ConfigError, load_central_config, load_customization  # noqa: E402
from knowledge import read_document, safe_skill_relative  # noqa: E402

MANIFEST_NAME = "module-manifest.toml"
MEMBER_FIELDS = ("name", "icon", "title", "persona", "capabilities", "model")
AGENT_FIELDS = ("name", "icon", "title")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Report the members and groups the installed skills offer.")
    parser.add_argument("--skill", type=Path, help="an installed skill; the skills beside it are scanned")
    parser.add_argument("--root", type=Path, action="append", default=[], help="a further skills root to scan")
    parser.add_argument("--project-root", type=Path, help="project root holding _bmad/, for customization")
    args = parser.parse_args(argv)
    roots = ([args.skill.resolve().parent] if args.skill else []) + args.root
    if not roots:
        parser.error("give --skill or --root")
    report = collect(roots, args.project_root.resolve() if args.project_root else None)
    reconfigure = getattr(sys.stdout, "reconfigure", None)
    if reconfigure is not None:
        reconfigure(encoding="utf-8")
    sys.stdout.write(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    return 0


def collect(roots: list[Path], project_root: Path | None = None) -> dict[str, object]:
    problems: list[dict[str, str]] = []
    skills: dict[str, Path] = {}
    files: dict[tuple[str, str], dict[str, object]] = {}

    for root in roots:
        try:
            folders = sorted(path for path in root.iterdir() if path.is_dir())
        except OSError as error:
            problems.append({"kind": "root", "problem": f"cannot read root {root}: {error}"})
            continue
        for folder in folders:
            # The first root wins a skill name, as it does for knowledge.
            if folder.name in skills:
                continue
            skills[folder.name] = folder
            manifest = folder / MANIFEST_NAME
            if not manifest.is_file():
                continue
            try:
                data = tomllib.loads(manifest.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
                problems.append(
                    {"kind": "manifest", "skill": folder.name, "problem": f"cannot use {manifest}: {error}"}
                )
                continue
            module = data.get("module")
            entries = data.get("roster")
            if not isinstance(module, str) or not isinstance(entries, list):
                continue
            for entry in entries:
                record_file(files, problems, folder, module, data.get("update_source"), entry)

    members: dict[str, dict[str, object]] = {}
    groups: dict[str, dict[str, object]] = {}
    for (module, path), found in sorted(files.items()):
        for member in found["data"].get("members", []):
            add_member(members, problems, member, module, path, found["source"], skills, project_root)
        for group in found["data"].get("groups", []):
            add_group(groups, problems, group, module, path)

    agents = {code: member for code, member in members.items() if member.get("installed")}
    apply_central_agents(agents, problems, project_root)

    return {
        "agents": agents,
        "members": members,
        "groups": list(groups.values()),
        "rosters": [
            {"module": module, "path": path, "skills": sorted(found["skills"]), "drift": sorted(found["drift"])}
            for (module, path), found in sorted(files.items())
        ],
        "problems": problems,
    }


def record_file(
    files: dict[tuple[str, str], dict[str, object]],
    problems: list[dict[str, str]],
    folder: Path,
    module: str,
    source: object,
    entry: object,
) -> None:
    relative = safe_skill_relative(entry) if isinstance(entry, str) else None
    if relative is None:
        problems.append({"kind": "roster", "skill": folder.name, "problem": f"roster names unusable path {entry!r}"})
        return
    path = folder.joinpath(*relative.parts)
    try:
        raw = read_document(path, folder)
        data = tomllib.loads(raw.decode("utf-8"))
    except (OSError, ValueError, UnicodeError, tomllib.TOMLDecodeError) as error:
        problems.append({"kind": "roster", "skill": folder.name, "problem": f"{path}: {error}"})
        return

    digest = hashlib.sha256(raw).hexdigest()
    key = (module, relative.as_posix())
    found = files.get(key)
    if found is None:
        found = files[key] = {"sha256": digest, "data": data, "source": source, "skills": set(), "drift": set()}
    if digest != found["sha256"]:
        found["drift"].add(folder.name)
        return
    found["skills"].add(folder.name)


def add_member(
    members: dict[str, dict[str, object]],
    problems: list[dict[str, str]],
    member: object,
    module: str,
    path: str,
    source: object,
    skills: dict[str, Path],
    project_root: Path | None,
) -> None:
    code = member.get("code") if isinstance(member, dict) else None
    if not isinstance(code, str) or not code:
        problems.append({"kind": "member", "problem": f"{module} {path}: a member has no code"})
        return
    if code in members:
        problems.append(
            {
                "kind": "member",
                "problem": f"{module} {path}: member {code!r} is already defined by {members[code]['module']}",
            }
        )
        return
    entry: dict[str, object] = {"code": code, "module": module, "source": "roster"}
    for field in MEMBER_FIELDS:
        if isinstance(member.get(field), str):
            entry[field] = member[field]
    skill = member.get("skill")
    if isinstance(skill, str) and skill:
        entry["skill"] = skill
        entry["installed"] = skill in skills
        if entry["installed"]:
            entry.update(agent_identity(skills[skill], project_root))
        else:
            command = install_command(source, skill)
            if command:
                entry["install"] = command
    entry.setdefault("name", code)
    members[code] = entry


def agent_identity(skill_dir: Path, project_root: Path | None) -> dict[str, str]:
    """The name, title and icon the agent actually answers to, after any customization."""
    try:
        agent = load_customization(project_root, skill_dir).get("agent", {})
    except (ConfigError, OSError):
        return {}
    if not isinstance(agent, dict):
        return {}
    return {field: agent[field] for field in AGENT_FIELDS if isinstance(agent.get(field), str) and agent[field]}


def install_command(source: object, skill: str) -> str | None:
    if not isinstance(source, str) or not source.startswith("github:"):
        return None
    parts = source.removeprefix("github:").split("/")
    if len(parts) < 2 or not all(parts[:2]):
        return None
    return f"npx skills add {parts[0]}/{parts[1]} --skill {skill}"


def add_group(
    groups: dict[str, dict[str, object]], problems: list[dict[str, str]], group: object, module: str, path: str
) -> None:
    group_id = group.get("id") if isinstance(group, dict) else None
    if not isinstance(group_id, str) or not group_id:
        problems.append({"kind": "group", "problem": f"{module} {path}: a group has no id"})
        return
    if group_id in groups:
        problems.append(
            {
                "kind": "group",
                "problem": f"{module} {path}: group {group_id!r} is already defined by {groups[group_id]['module']}",
            }
        )
        return
    groups[group_id] = {**group, "module": module}


def apply_central_agents(
    agents: dict[str, dict[str, object]], problems: list[dict[str, str]], project_root: Path | None
) -> None:
    """Lay the central config's [agents.<code>] tables over the scan.

    This is how a user adds an agent of their own or overrides one, and how an
    install made before rosters existed keeps the agents it recorded.
    """
    if project_root is None or not (project_root / "_bmad").is_dir():
        return
    try:
        configured = load_central_config(project_root).get("agents", {})
    except ConfigError as error:
        problems.append({"kind": "config", "problem": str(error)})
        return
    if not isinstance(configured, dict):
        return
    for code, info in configured.items():
        if not isinstance(info, dict):
            continue
        entry = agents.setdefault(code, {"code": code, "source": "config"})
        for field, value in info.items():
            # Older installs recorded the persona paragraph as `description`.
            target = "persona" if field == "description" and "persona" not in info else field
            entry[target] = value
        entry.setdefault("name", code)


if __name__ == "__main__":
    sys.exit(main())
