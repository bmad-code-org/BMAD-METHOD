#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Report the people and groups the installed modules offer.

A module's roster is `roster.toml` beside its `bmod.toml`, in the module
record's folder. It lists members and the groups they form. Nothing is
recorded under `_bmad`: the roster is whatever the installed modules offer
right now, so adding or removing a skill changes it with no setup step.

A member with `skill` is an agent, present only while that skill is installed;
its name, title and icon follow the skill's customization. A member without
`skill` is a guest, available to groups and never part of the default room.
`[agents.<code>]` tables in the central config still apply on top, so a user's
own agents and overrides keep working.

Usage:
  uv run roster.py --skill <any installed skill> [--project-root P] [--root R ...]
"""

from __future__ import annotations

import argparse
import json
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

from config_utils import ConfigError, load_central_config, load_customization  # noqa: E402
from knowledge import ROSTER_NAME, Module, install_command, read_document, scan  # noqa: E402

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
    found = scan(roots)
    problems = found.problems
    skills = found.folders
    files: dict[tuple[str, str], dict[str, object]] = {}

    for module in found.modules:
        if (module.folder / ROSTER_NAME).exists():
            record_file(files, problems, module)

    members: dict[str, dict[str, object]] = {}
    groups: dict[str, dict[str, object]] = {}
    for (code, path), file in sorted(files.items()):
        source = file["module"].table.get("update_source")
        for member in listed(file["data"], "members", problems, code, path):
            add_member(members, problems, member, code, path, source, skills, project_root)
        for group in listed(file["data"], "groups", problems, code, path):
            add_group(groups, problems, group, code, path)

    agents = {code: member for code, member in members.items() if member.get("installed")}
    apply_central_agents(agents, members, problems, project_root)

    return {
        "agents": agents,
        "members": members,
        "groups": list(groups.values()),
        "rosters": [
            {"module": code, "path": path, "skills": [name for name in file["module"].skills if name in skills]}
            for (code, path), file in sorted(files.items())
        ],
        "problems": problems,
    }


def listed(data: dict[str, object], key: str, problems: list[dict[str, object]], module: str, path: str) -> list:
    found = data.get(key, [])
    if isinstance(found, list):
        return found
    problems.append({"kind": "roster", "problem": f"{module} {path}: '{key}' is not a list"})
    return []


def record_file(
    files: dict[tuple[str, str], dict[str, object]], problems: list[dict[str, object]], module: Module
) -> None:
    folder = module.folder
    path = folder / ROSTER_NAME
    try:
        data = tomllib.loads(read_document(path, folder).decode("utf-8"))
    except (OSError, ValueError, UnicodeError, tomllib.TOMLDecodeError) as error:
        problems.append({"kind": "roster", "skill": folder.name, "problem": f"{path}: {error}"})
        return
    files.setdefault((module.code, ROSTER_NAME), {"module": module, "data": data})


def add_member(
    members: dict[str, dict[str, object]],
    problems: list[dict[str, object]],
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


def add_group(
    groups: dict[str, dict[str, object]], problems: list[dict[str, object]], group: object, module: str, path: str
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
    agents: dict[str, dict[str, object]],
    members: dict[str, dict[str, object]],
    problems: list[dict[str, object]],
    project_root: Path | None,
) -> None:
    """Lay the central config's [agents.<code>] tables over the scan.

    This is how a user adds an agent of their own or describes one further, and
    how an install made before rosters existed keeps the agents it recorded.
    An entry for a roster agent whose skill is gone is skipped: the old
    installer recorded it and nothing removed it when the skill went. For a
    roster agent the roster and the skill's customization decide name, title,
    icon and module, so a recorded default never undoes a customized name.
    """
    if project_root is None or not (project_root / "_bmad").is_dir():
        return
    try:
        configured = load_central_config(project_root).get("agents", {})
    except (ConfigError, OSError) as error:
        problems.append({"kind": "config", "problem": str(error)})
        return
    if not isinstance(configured, dict):
        return
    for code, info in configured.items():
        if not isinstance(info, dict) or members.get(code, {}).get("installed") is False:
            continue
        entry = agents.setdefault(code, {"code": code, "source": "config"})
        settled = (
            {"module", *(field for field in AGENT_FIELDS if field in entry)} if entry["source"] == "roster" else set()
        )
        for field, value in info.items():
            if field in settled:
                continue
            # Older installs recorded the persona paragraph as `description`.
            target = "persona" if field == "description" and "persona" not in info else field
            entry[target] = value
        entry.setdefault("name", code)


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
