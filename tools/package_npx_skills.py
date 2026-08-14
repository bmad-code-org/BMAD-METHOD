#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Flatten Method skills into a skills/<canonical-id>/ tree for npx skills add.

Walks src/core-skills and src/bmm-skills, discards agents/plan/ship nesting,
skips v6-shims, and fatten dest bmad-help only with the shared Python,
module.yaml defaults, and a baked core+bmm help catalog.
"""

from __future__ import annotations

import argparse
import shutil
import tempfile
from pathlib import Path


HELP_ID = "bmad-help"
SOURCE_ROOTS = ("src/core-skills", "src/bmm-skills")
V6_SHIMS = "v6-shims"
SHARED_SCRIPTS = (
    "resolve_config.py",
    "resolve_customization.py",
    "config_utils.py",
    "memlog.py",
    "render_skill.py",
)
HELP_CSV_HEADER = (
    "module,skill,display-name,menu-code,description,action,args,"
    "phase,preceded-by,followed-by,required,output-location,outputs"
)
SKIP_NAMES = frozenset({".DS_Store", "Thumbs.db", "desktop.ini", "__pycache__"})
SKIP_SUFFIXES = ("~", ".swp", ".swo", ".bak", ".pyc", ".pyo")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Flatten Method skills into a skills/<canonical-id>/ tree."
    )
    parser.add_argument("--repo-root", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args(argv)
    package(args.repo_root.resolve(), args.out.resolve())
    return 0


def package(repo_root: Path, out: Path) -> None:
    missing = missing_source_roots(repo_root)
    if missing:
        named = ", ".join(str(path) for path in missing)
        raise FileNotFoundError(f"missing source root: {named}")

    skills = discover_skills(repo_root)
    with tempfile.TemporaryDirectory() as tmp:
        staging = Path(tmp) / "skills"
        staging.mkdir()
        for src in skills:
            shutil.copytree(src, staging / src.name, ignore=ignore_junk)

        dest_help = staging / HELP_ID
        if dest_help.is_dir():
            fatten_help(repo_root, dest_help)

        out.mkdir(parents=True, exist_ok=True)
        dest_skills = out / "skills"
        if dest_skills.exists():
            shutil.rmtree(dest_skills)
        shutil.copytree(staging, dest_skills)


def missing_source_roots(repo_root: Path) -> list[Path]:
    return [root for root in source_roots(repo_root) if not root.is_dir()]


def discover_skills(repo_root: Path) -> list[Path]:
    found: list[Path] = []
    for root in source_roots(repo_root):
        for skill_md in sorted(root.rglob("SKILL.md")):
            if V6_SHIMS in skill_md.parts:
                continue
            if skill_md.is_file():
                found.append(skill_md.parent)
    return found


def source_roots(repo_root: Path) -> tuple[Path, ...]:
    return tuple(repo_root / Path(rel) for rel in SOURCE_ROOTS)


def fatten_help(repo_root: Path, dest_help: Path) -> None:
    scripts_src = repo_root / "src" / "scripts"
    dest_scripts = dest_help / "scripts"
    dest_scripts.mkdir(parents=True, exist_ok=True)
    for name in SHARED_SCRIPTS:
        shutil.copy2(scripts_src / name, dest_scripts / name)

    core_yaml = repo_root / "src" / "core-skills" / "module.yaml"
    bmm_yaml = repo_root / "src" / "bmm-skills" / "module.yaml"
    core_csv = repo_root / "src" / "core-skills" / "module-help.csv"
    bmm_csv = repo_root / "src" / "bmm-skills" / "module-help.csv"

    dest_assets = dest_help / "assets"
    (dest_assets / "core").mkdir(parents=True, exist_ok=True)
    (dest_assets / "bmm").mkdir(parents=True, exist_ok=True)
    shutil.copy2(core_yaml, dest_assets / "core" / "module.yaml")
    shutil.copy2(bmm_yaml, dest_assets / "bmm" / "module.yaml")
    (dest_assets / "bmad-help.csv").write_text(
        assemble_help_csv(core_csv, bmm_csv), encoding="utf-8"
    )


def assemble_help_csv(core_csv: Path, bmm_csv: Path) -> str:
    rows = csv_data_lines(core_csv) + csv_data_lines(bmm_csv)
    body = "\n".join(rows)
    return HELP_CSV_HEADER + "\n" + (body + "\n" if body else "")


def csv_data_lines(path: Path) -> list[str]:
    lines: list[str] = []
    seen_header = False
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not seen_header and line.startswith("module,"):
            seen_header = True
            continue
        lines.append(line)
    return lines


def ignore_junk(directory: str, names: list[str]) -> list[str]:
    return [name for name in names if is_junk_name(name)]


def is_junk_name(name: str) -> bool:
    if name in SKIP_NAMES:
        return True
    if name.startswith(".") and name != ".gitkeep":
        return True
    return name.endswith(SKIP_SUFFIXES)


if __name__ == "__main__":
    raise SystemExit(main())
