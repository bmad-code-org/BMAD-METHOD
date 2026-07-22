"""Config-driven IDE/tool skill installation.

Ports the essential path of the Node ``ConfigDrivenIdeSetup``: read the target
directory for a tool from ``platform-codes.yaml`` and copy each installed skill
directory verbatim into it (e.g. Claude Code -> ``.claude/skills/<canonicalId>/``).

Command-pointer generation and the per-IDE cleanup/marker logic are out of scope
for this PoC - the skill copy is what makes skills usable in the tool.
"""

from __future__ import annotations

import csv
import functools
import shutil
from pathlib import Path

import yaml

from .payload import platform_codes_path

BMAD_FOLDER_NAME = "_bmad"

# Editor/OS artifacts and Python bytecode caches are never copied into skills.
# __pycache__/*.pyc matters here because the packaged payload sits in
# site-packages, where pip byte-compiles the shipped skill scripts.
_SKILL_COPY_SKIP_NAMES = {".DS_Store", "Thumbs.db", "desktop.ini", "__pycache__"}
_SKILL_COPY_SKIP_SUFFIXES = ("~", ".swp", ".swo", ".bak", ".pyc")


class UnknownToolError(ValueError):
    """Raised when a requested tool is not present in platform-codes.yaml."""


@functools.lru_cache(maxsize=1)
def _platforms() -> dict:
    data = yaml.safe_load(platform_codes_path().read_text(encoding="utf-8")) or {}
    return data.get("platforms", {}) or {}


def known_tools() -> list[str]:
    return sorted(
        code
        for code, cfg in _platforms().items()
        if isinstance(cfg, dict) and (cfg.get("installer") or {}).get("target_dir")
    )


def target_dir_for(tool: str) -> str:
    platforms = _platforms()
    if tool not in platforms:
        raise UnknownToolError(
            f"Unknown tool '{tool}'. Known tools: {', '.join(known_tools())}"
        )
    installer = platforms[tool].get("installer") or {}
    target = installer.get("target_dir")
    if not target:
        raise UnknownToolError(f"Tool '{tool}' has no target_dir in platform-codes.yaml")
    return target


def _skill_copy_keep(name: str) -> bool:
    """Whether an entry (file or dir) should be copied into a skill.

    Mirrors the Node installer's verbatim-copy filter (_config-driven.js).
    `.gitkeep` is the one dotfile intentionally kept - it's how a skill ships
    an otherwise-empty placeholder directory. Every other dotfile (VCS/editor/OS
    metadata) plus bytecode caches and editor swap/backup files are dropped.
    """
    if ( (name in _SKILL_COPY_SKIP_NAMES) or
         any(name.endswith(suffix) for suffix in _SKILL_COPY_SKIP_SUFFIXES) or
         (name.startswith(".") and name != ".gitkeep") ):
        return False
    return True


def _skill_copy_ignore(_dir: str, names: list[str]) -> set[str]:
    """copytree `ignore` callback: applies `_skill_copy_keep` at every depth so
    nested entries are filtered identically to top-level ones (matching Node's
    recursive filter)."""
    return {name for name in names if not _skill_copy_keep(name)}


def _copy_skill_dir(source_dir: Path, skill_dir: Path) -> None:
    if skill_dir.exists():
        shutil.rmtree(skill_dir)
    shutil.copytree(source_dir, skill_dir, ignore=_skill_copy_ignore)


def setup_tool(tool: str, project_root: Path, bmad_dir: Path) -> dict:
    """Install all skills from the manifest into a tool's skills directory."""
    target = target_dir_for(tool)
    target_path = project_root / target
    target_path.mkdir(parents=True, exist_ok=True)

    csv_path = bmad_dir / "_config" / "skill-manifest.csv"
    if not csv_path.exists():
        return {"tool": tool, "target_dir": target, "skills": 0}

    prefix = BMAD_FOLDER_NAME + "/"
    count = 0
    with csv_path.open(encoding="utf-8", newline="") as fh:
        for record in csv.DictReader(fh):
            canonical_id = record.get("canonicalId")
            if not canonical_id:
                continue
            rel = record.get("path") or ""
            if rel.startswith(prefix):
                rel = rel[len(prefix) :]
            source_dir = (bmad_dir / rel).parent
            if not source_dir.exists():
                continue
            _copy_skill_dir(source_dir, target_path / canonical_id)
            count += 1

    return {"tool": tool, "target_dir": target, "skills": count}
