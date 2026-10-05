#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Set up BMad in a fresh checkout or worktree of this repo.

Default setting can be overridden by CLI flags or an optional dogfood.toml
Can be run by hand, or a post-checkout Git hook, to automatically apply to the new worktrees

To run it automatically, save this as an executable `post-checkout` file in the shared hooks folder
(`git rev-parse --git-common-dir`, usually `.git/hooks`; it is local, so every worktree uses it
and nothing is committed):

    #!/bin/sh
    # Git passes <previous HEAD> <new HEAD> <branch-checkout flag>. Two shapes mean "fresh":
    #  - an all-zero previous HEAD (git worktree add, git clone);
    #  - previous HEAD == new HEAD in a tree with no skills-lock.json yet (tools that add a
    #    detached worktree and then check out the branch). Ordinary branch switches are skipped.
    [ "$3" = "1" ] || exit 0
    case "$1" in
    *[!0]*)
        [ "$1" = "$2" ] && [ ! -e skills-lock.json ] || exit 0
        ;;
    esac
    [ -f tools/dogfood.py ] || exit 0
    exec uv run tools/dogfood.py

Testing the all-zero check alone is not enough: some tools (Orca's UI) create the worktree with no
checkout and then check out the branch, so the hook only ever sees previous HEAD == new HEAD.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tomllib
from pathlib import Path

DEFAULT_SKILLS = (
    "bmad",
    "bmod-method",
    "bmad-ticket",
    "bmad-build",
    "bmad-code-review",
    "bmad-spec",
    "bmad-retrospective",
    "bmad-walkthrough",
)
DEFAULT_AGENTS = ("claude-code", "codex")
REQUIRED_SKILLS = ("bmad", "bmod-method")
SETTINGS = "dogfood.toml"
USER_CONFIG = Path("_bmad/custom/config.user.toml")


def fail(message: str) -> None:
    print(f"error: {message}", file=sys.stderr)
    sys.exit(1)


def run(cmd: list[str], cwd: Path) -> str:
    try:
        done = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    except FileNotFoundError:
        fail(f"{cmd[0]} is required and was not found on PATH")
    if done.returncode != 0:
        fail(f"{' '.join(cmd)} failed:\n{(done.stderr or done.stdout).strip()}")
    return done.stdout


def local_settings(project_root: Path, main: Path | None) -> dict:
    for root in (project_root, main):
        path = root / SETTINGS if root else None
        if path and path.is_file():
            try:
                return tomllib.loads(path.read_text(encoding="utf-8"))
            except (OSError, tomllib.TOMLDecodeError) as exc:
                fail(f"cannot read {path}: {exc}")
    return {}


def main_checkout(project_root: Path) -> Path | None:
    """The first entry of `git worktree list` is the main checkout; None when that is project_root itself."""
    listing = run(["git", "worktree", "list", "--porcelain"], project_root)
    first = next((line[len("worktree ") :] for line in listing.splitlines() if line.startswith("worktree ")), None)
    if first is None or Path(first).resolve() == project_root.resolve():
        return None
    return Path(first)


def configured_output_folder(project_root: Path) -> str | None:
    path = project_root / USER_CONFIG
    if not path.is_file():
        return None
    try:
        value = tomllib.loads(path.read_text(encoding="utf-8")).get("core", {}).get("output_folder")
    except (OSError, tomllib.TOMLDecodeError):
        return None
    return value if isinstance(value, str) and value else None


def reset(project_root: Path, main: Path | None) -> None:
    """Remove the skills the lock file records, `_bmad` and the lock; keep `_bmad-output` and dogfood.toml."""
    if main is None:
        fail("--reset only runs in a secondary worktree: the main checkout's _bmad/custom holds the ticket path")
    lock = project_root / "skills-lock.json"
    try:
        installed = list(json.loads(lock.read_text(encoding="utf-8"))["skills"])
    except (OSError, ValueError, KeyError):
        installed = []
    # `npx skills remove` also deletes from this repo's own tracked skills/ folder, so remove the
    # installed copies (agent folders are dot-prefixed, so skills/ is never matched) ourselves.
    copies = [path for name in installed for path in project_root.glob(f".*/skills/{name}")]
    for path in (*copies, project_root / "_bmad", lock):
        if path.is_symlink() or path.is_file():
            path.unlink()
        elif path.exists():
            shutil.rmtree(path)
    print(f"reset: removed {len(installed)} skills, _bmad and skills-lock.json")


def install_skills(project_root: Path, source: str, skills: list[str], agents: list[str]) -> None:
    run(["npx", "--yes", "skills", "add", source, "-s", *skills, "-a", *agents, "-y"], project_root)
    print(f"installed {len(skills)} skills from {source}")


def setup_bmad(project_root: Path) -> None:
    found = sorted(project_root.glob(".*/skills/bmad/scripts/setup.py"))
    if not found:
        fail("the install left no .*/skills/bmad/scripts/setup.py")
    # Agents that share a skills folder symlink to one copy; keep one script per real file.
    copies: dict[Path, Path] = {}
    for script in found:
        copies.setdefault(script.resolve(), script)
    scripts = list(copies.values())
    skill = scripts[0].parents[1]
    result = run(
        [
            "uv", "run", "--no-cache", str(scripts[0]),
            "--project-root", str(project_root),
            "--skill", str(skill),
            *[arg for script in scripts for arg in ("--root", str(script.parents[2]))],
        ],
        project_root,
    )  # fmt: skip
    report = json.loads(result)
    print(f"_bmad: {report.get('status', 'done')}")
    issues = [*report.get("problems", []), *report.get("unmet_requirements", [])]
    if issues:
        fail("setup reported:\n" + "\n".join(json.dumps(issue) for issue in issues))


def copy_custom(project_root: Path, source: Path) -> None:
    """Copy source's files into _bmad/custom, leaving any file that already exists."""
    dest = project_root / "_bmad" / "custom"
    copied = 0
    for path in sorted(source.rglob("*")):
        target = dest / path.relative_to(source)
        if path.is_dir():
            target.mkdir(parents=True, exist_ok=True)
        elif not target.exists():
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, target)
            copied += 1
    print(f"custom: copied {copied} files from {source}")


def point_tickets(project_root: Path, main: Path | None) -> None:
    target = project_root / USER_CONFIG
    if configured_output_folder(project_root):
        print(f"tickets: {USER_CONFIG} already sets output_folder")
        return
    folder = configured_output_folder(main) if main else None
    if not folder:
        print("tickets: no local configuration; using the default _bmad-output")
        return
    if target.exists():
        print(f"tickets: {USER_CONFIG} exists without output_folder; left alone")
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(f"[core]\noutput_folder = {json.dumps(folder)}\n", encoding="utf-8")
    print(f"tickets: output_folder = {folder}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--project-root", type=Path, default=Path.cwd(), help="the checkout to prepare; default cwd")
    parser.add_argument("--source", help="where `npx skills add` installs from; default the project root")
    parser.add_argument("--skills", nargs="+", help="skills to install")
    parser.add_argument("--agents", nargs="+", help="agents to install for")
    parser.add_argument("--custom-from", type=Path, help="a folder whose files are copied into _bmad/custom")
    parser.add_argument("--reset", action="store_true", help="first remove the installed skills and _bmad")
    args = parser.parse_args()

    project_root = args.project_root.resolve()
    main = main_checkout(project_root)
    settings = local_settings(project_root, main)
    source = args.source or settings.get("source") or str(project_root)
    skills = list(args.skills or settings.get("skills") or DEFAULT_SKILLS)
    agents = list(args.agents or settings.get("agents") or DEFAULT_AGENTS)
    custom_from = args.custom_from or settings.get("custom_from")
    if custom_from:
        custom_from = Path(custom_from).expanduser().resolve()
        if not custom_from.is_dir():
            fail(f"custom_from {custom_from} is not a directory")
    missing = [skill for skill in REQUIRED_SKILLS if skill not in skills]
    if missing:
        fail(f"the skill list is missing {', '.join(missing)}, which setup needs to build _bmad")

    if args.reset:
        reset(project_root, main)
    install_skills(project_root, source, skills, agents)
    setup_bmad(project_root)
    if custom_from:
        copy_custom(project_root, custom_from)
    point_tickets(project_root, main)
    return 0


if __name__ == "__main__":
    sys.exit(main())
