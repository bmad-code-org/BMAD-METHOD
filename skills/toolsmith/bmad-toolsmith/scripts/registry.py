#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""registry: what BMad knows about in a project, so a new skill's registration can be guessed.

Scans the skills roots for bmod.toml files and reports the installed module records, their
members, and the skills that are wired to BMad (a customize.toml or an _bmad/scripts call) but
registered with no module. Also says whether _bmad/ is set up and whether the project is a skills
repository with a record of its own.

Usage:
  registry.py --project-root <folder> [--root <skills folder> ...]

Without --root the roots are <project>/.agents/skills, <project>/.claude/skills, <project>/skills,
~/.agents/skills and ~/.claude/skills; folders reached twice through symlinks are read once.

Output, one JSON object on stdout:
  {"project_root": str,
   "bmad": {"present": bool, "version": str|null},
   "skills_repo": bool,
   "records": [{"code", "folder", "path", "scope", "version", "update_source", "prefix",
                "skills": [...], "has_help", "has_roster", "single_skill"}, ...],
   "unregistered": [{"skill", "path"}, ...]}
Exit 0; 2 on a usage error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

RUNTIME_RE = re.compile(r"_bmad/scripts/")


def default_roots(project_root: Path) -> list[Path]:
    home = Path.home()
    return [
        project_root / ".agents" / "skills",
        project_root / ".claude" / "skills",
        project_root / "skills",
        home / ".agents" / "skills",
        home / ".claude" / "skills",
    ]


def load_toml(path: Path) -> dict | None:
    try:
        return tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, tomllib.TOMLDecodeError):
        return None


def common_prefix(names: list[str]) -> str:
    """The shared leading `word-` run of the member names, or an empty string."""
    if not names:
        return ""
    parts = [n.split("-") for n in names]
    shared = []
    for group in zip(*parts, strict=False):
        if len(set(group)) != 1:
            break
        shared.append(group[0])
    if len(parts) == 1:
        # One member: its name minus the last word, or the whole name when it is one word (`bmad-`).
        shared = parts[0][:-1] or parts[0]
    return "-".join(shared) + "-" if shared else ""


def scan(project_root: Path, roots: list[Path]) -> dict:
    seen: set[Path] = set()
    records: dict[str, dict] = {}
    members: dict[str, list[str]] = {}
    unregistered: list[dict] = []
    home = Path.home().resolve()

    for root in roots:
        if not root.is_dir():
            continue
        for folder in sorted(root.iterdir()):
            if not folder.is_dir() or not (folder / "SKILL.md").is_file():
                continue
            real = folder.resolve()
            if real in seen:
                continue
            seen.add(real)
            scope = (
                "user" if real.is_relative_to(home) and not real.is_relative_to(project_root.resolve()) else "project"
            )
            manifest = folder / "bmod.toml"
            if not manifest.is_file():
                skill_text = (folder / "SKILL.md").read_text(encoding="utf-8", errors="replace")
                if (folder / "customize.toml").is_file() or RUNTIME_RE.search(skill_text):
                    unregistered.append({"skill": folder.name, "path": str(folder)})
                continue
            data = load_toml(manifest) or {}
            bmod = data.get("bmod")
            if isinstance(bmod, dict) and bmod.get("code"):
                skills = bmod.get("skills") if isinstance(bmod.get("skills"), list) else []
                records[folder.name] = {
                    "code": str(bmod["code"]),
                    "folder": folder.name,
                    "path": str(folder),
                    "scope": scope,
                    "version": bmod.get("version"),
                    "update_source": bmod.get("update_source"),
                    "skills": [str(s) for s in skills],
                    "has_help": (folder / "help" / "help.md").is_file(),
                    "has_roster": (folder / "roster.toml").is_file(),
                    "single_skill": "skill" in data,
                }
            skill = data.get("skill")
            if isinstance(skill, dict) and skill.get("bmod"):
                members.setdefault(str(skill["bmod"]), []).append(folder.name)

    out = []
    for folder, rec in sorted(records.items()):
        names = sorted(set(rec["skills"]) | set(members.get(folder, [])))
        rec["skills"] = names
        rec["prefix"] = common_prefix(names) if names else f"{rec['code']}-"
        out.append(rec)

    bmad_dir = project_root / "_bmad"
    core = next((r for r in out if r["code"] == "core-tools"), None)
    skills_dir = project_root / "skills"
    skills_repo = skills_dir.is_dir() and any(
        (p / "SKILL.md").is_file() and (p / "bmod.toml").is_file() for p in skills_dir.iterdir() if p.is_dir()
    )
    return {
        "project_root": str(project_root),
        "bmad": {"present": bmad_dir.is_dir(), "version": core["version"] if core else None},
        "skills_repo": skills_repo,
        "records": out,
        "unregistered": unregistered,
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--project-root", type=Path, required=True, help="the folder holding _bmad/ (or that would)")
    p.add_argument("--root", type=Path, action="append", help="a skills folder to scan; repeatable")
    args = p.parse_args(argv)
    project_root = args.project_root.resolve()
    if not project_root.is_dir():
        p.error(f"not a directory: {project_root}")
    roots = args.root or default_roots(project_root)
    print(json.dumps(scan(project_root, roots), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
