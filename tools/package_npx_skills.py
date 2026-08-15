#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Flatten Method skills into a skills/<canonical-id>/ tree for npx skills add.

Walks src/core-skills and src/bmm-skills, discards agents/plan/ship nesting,
skips v6-shims, and copies shared Python, a starter config.toml, and a
baked core+bmm help catalog into dest bmad-help only.
"""

from __future__ import annotations

import argparse
import csv
import io
import shutil
import tempfile
from pathlib import Path


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
HELP_FIELDS = tuple(HELP_CSV_HEADER.split(","))
SKIP_NAMES = (".DS_Store", "Thumbs.db", "desktop.ini", "__pycache__")
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
    validate_source_roots(repo_root)

    with tempfile.TemporaryDirectory() as tmp:
        staging = Path(tmp) / "skills"
        staging.mkdir()
        for src in skills(repo_root):
            shutil.copytree(src, staging / src.name, ignore=ignore_junk)

        dest_help = staging / "bmad-help"
        if dest_help.is_dir():
            copy_scripts_and_assets(repo_root, dest_help)
        replace_dest_skills(staging, out)


def validate_source_roots(repo_root: Path) -> None:
    missing = [root for root in source_roots(repo_root) if not root.is_dir()]
    if missing:
        named = ", ".join(str(path) for path in missing)
        raise FileNotFoundError(f"missing source root: {named}")


def source_roots(repo_root: Path) -> tuple[Path, ...]:
    return tuple(repo_root / Path(rel) for rel in SOURCE_ROOTS)


def skills(repo_root: Path) -> list[Path]:
    found: list[Path] = []
    for root in source_roots(repo_root):
        for skill_md in sorted(root.rglob("SKILL.md")):
            if V6_SHIMS in skill_md.parts:
                continue
            if skill_md.is_file():
                found.append(skill_md.parent)
    return found


def ignore_junk(directory: str, names: list[str]) -> list[str]:
    return [
        name
        for name in names
        if name in SKIP_NAMES
        or (name.startswith(".") and name != ".gitkeep")
        or name.endswith(SKIP_SUFFIXES)
    ]


def copy_scripts_and_assets(repo_root: Path, dest_help: Path) -> None:
    scripts_src = repo_root / "src" / "scripts"
    dest_scripts = dest_help / "scripts"
    dest_scripts.mkdir(parents=True, exist_ok=True)
    for name in SHARED_SCRIPTS:
        shutil.copy2(scripts_src / name, dest_scripts / name)

    assets = repo_root / "src" / "core-skills" / "bmad-help" / "assets"
    starter = assets / "config.toml"
    user_starter = assets / "config.user.toml"
    for required in (starter, user_starter):
        if not required.is_file():
            raise FileNotFoundError(f"missing path: {required}")
    core_csv = repo_root / "src" / "core-skills" / "module-help.csv"
    bmm_csv = repo_root / "src" / "bmm-skills" / "module-help.csv"

    dest_assets = dest_help / "assets"
    dest_assets.mkdir(parents=True, exist_ok=True)
    shutil.copy2(starter, dest_assets / "config.toml")
    shutil.copy2(user_starter, dest_assets / "config.user.toml")
    (dest_assets / "bmad-help.csv").write_text(
        assemble_help_csv(core_csv, bmm_csv), encoding="utf-8"
    )


def replace_dest_skills(staging: Path, out: Path) -> None:
    out.mkdir(parents=True, exist_ok=True)
    dest_skills = out / "skills"
    if dest_skills.exists():
        shutil.rmtree(dest_skills)
    shutil.copytree(staging, dest_skills)


def assemble_help_csv(core_csv: Path, bmm_csv: Path) -> str:
    rows = help_catalog_rows(core_csv) + help_catalog_rows(bmm_csv)
    out = io.StringIO()
    writer = csv.writer(out, lineterminator="\n")
    writer.writerow(HELP_FIELDS)
    writer.writerows(rows)
    return out.getvalue()


def help_catalog_rows(path: Path) -> list[list[str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.reader(handle)
        header = next(reader, None)
        if header != list(HELP_FIELDS):
            raise ValueError(f"unexpected help catalog header in {path}: {header!r}")
        rows = list(reader)
    if not rows:
        raise ValueError(f"cannot package empty help catalog: {path}")
    for row in rows:
        if len(row) != len(HELP_FIELDS):
            raise ValueError(f"malformed help catalog row in {path}: {row!r}")
    return rows


if __name__ == "__main__":
    raise SystemExit(main())
