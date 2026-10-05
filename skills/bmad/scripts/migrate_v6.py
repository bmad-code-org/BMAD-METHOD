#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Report or remove the v6 traces in `_bmad/` that v7 does not read.

With no flag it lists them: the classic installer's files, central config keys no
v7 skill reads, and customizations of skills that are not installed. With
`--clean` it copies `_bmad/` to `.v6-v7-migration-backup-<datetime>/`, which the
method migration reuses, then removes them.

Usage:
  uv run migrate_v6.py --project-root P --skill <the bmad skill> [--root R ...] [--clean]
"""

from __future__ import annotations

import argparse
import datetime
import importlib.util
import re
import shutil
import sys
import tomllib
from pathlib import Path, PurePosixPath

sys.dont_write_bytecode = True


def _load_setup():
    spec = importlib.util.spec_from_file_location("bmad_setup", Path(__file__).with_name("setup.py"))
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


_setup = _load_setup()
Installation = _setup.Installation
Retirement = _setup.Retirement
TABLE_HEADER = _setup.TABLE_HEADER
TEAM_CONFIG = _setup.TEAM_CONFIG
USER_CONFIG = _setup.USER_CONFIG
_MISSING = _setup._MISSING
discover_installation = _setup.discover_installation
header_path = _setup.header_path
lookup = _setup.lookup
present = _setup.present
reject_unusable_bmad = _setup.reject_unusable_bmad
render_toml = _setup.render_toml
retired_skills = _setup.retired_skills
retirement_report = _setup.retirement_report
write_text = _setup.write_text

# Traces the classic installer leaves under _bmad.
LEGACY_LEFTOVERS = (
    "_config/manifest.yaml",
    "_config/files-manifest.csv",
    "_config/skill-manifest.csv",
    "_config/bmad-help.csv",
    "config.user.toml",
    "core/config.yaml",
    "core/module-help.csv",
    "core/v6-shims",
    "bmm/config.yaml",
    "bmm/module-help.csv",
    "bmm/v6-shims",
)
# The [core] keys a v7 skill reads; any other [core] key is a v6 setting nothing uses.
CORE_KEYS = frozenset({"project_name", "output_folder", "active_initiative"})
CENTRAL_CONFIGS = (TEAM_CONFIG, "_bmad/custom/config.toml", USER_CONFIG)
BACKUP_PREFIX = ".v6-v7-migration-backup-"


def legacy_leftovers(project_root: Path) -> list[str]:
    bmad = project_root / "_bmad"
    return [
        relative
        for relative in LEGACY_LEFTOVERS
        if (path := bmad.joinpath(*PurePosixPath(relative).parts)).exists() and inside_bmad(path, project_root)
    ]


def inside_bmad(path: Path, project_root: Path) -> bool:
    """A link along the way could point a cleanup outside the project; such a path is not cleaned."""
    return path.resolve().is_relative_to((project_root / "_bmad").resolve())


def stale_config_keys(project_root: Path, installation: Installation) -> list[tuple[str, tuple[str, ...]]]:
    """Central config keys no v7 skill reads: [core] keys outside CORE_KEYS, and [modules] keys no installed
    module declares as a question. Other tables, such as [agents], are left to their readers."""
    declared = {(question.module, question.key) for module in installation.modules for question in module.questions}
    stale: list[tuple[str, tuple[str, ...]]] = []
    for relative in CENTRAL_CONFIGS:
        path = project_root / relative
        if path.is_symlink() or not path.is_file() or not inside_bmad(path, project_root):
            continue
        try:
            data = tomllib.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, tomllib.TOMLDecodeError):
            continue
        core = data.get("core")
        if isinstance(core, dict):
            stale += [(relative, ("core", key)) for key in core if key not in CORE_KEYS]
        modules = data.get("modules")
        if not isinstance(modules, dict):
            continue
        for code, table in modules.items():
            if not isinstance(table, dict):
                stale.append((relative, ("modules", code)))
                continue
            stale += [
                (relative, ("modules", code, *leaf))
                for leaf in leaf_paths(table)
                if (code, ".".join(leaf)) not in declared
            ]
    return stale


def leaf_paths(table: dict, prefix: tuple[str, ...] = ()) -> list[tuple[str, ...]]:
    paths: list[tuple[str, ...]] = []
    for key, value in table.items():
        if isinstance(value, dict) and value:
            paths += leaf_paths(value, (*prefix, key))
        else:
            paths.append((*prefix, key))
    return paths


def unused_customizations(project_root: Path, installation: Installation, retirement: Retirement) -> list[str]:
    """`_bmad/custom/` files of skills that are not installed. Files setup is about to rename are not unused."""
    custom = project_root / "_bmad" / "custom"
    if custom.is_symlink() or not custom.is_dir():
        return []
    moving = {old for old, _new in (*retirement.renames, *retirement.unmoved)}
    unused: list[str] = []
    for path in sorted(custom.iterdir(), key=lambda entry: entry.name):
        name = path.name
        stem = name.removesuffix(".toml").removesuffix(".user")
        if not name.startswith("bmad-") or not name.endswith(".toml") or name in moving:
            continue
        if stem not in installation.folders:
            unused.append(name)
    return unused


def traces_json(project_root: Path, installation: Installation, retirement: Retirement) -> dict[str, object]:
    return {
        "legacy_leftovers": legacy_leftovers(project_root),
        "stale_config_keys": [
            {"file": relative, "key": ".".join(path)}
            for relative, path in stale_config_keys(project_root, installation)
        ],
        "unused_customizations": [
            f"_bmad/custom/{name}" for name in unused_customizations(project_root, installation, retirement)
        ],
    }


def clean(project_root: Path, skill_root: Path, *, roots: tuple[Path, ...] = ()) -> dict[str, object]:
    """Back up `_bmad/`, then remove the v6 traces v7 does not read: the classic installer's files, stale
    config keys, and customizations of skills that are not installed."""
    reject_unusable_bmad(project_root)
    bmad = project_root / "_bmad"
    installation = discover_installation(skill_root, roots)
    if installation.missing_records:
        # Without every module record, a missing module's config keys would look stale.
        raise Exception("a module record is missing; run setup to repair the installation before cleaning up")
    retirement = retirement_report(
        project_root, skill_root, installation, retired_skills(installation.modules, installation.modules)
    )
    leftovers = legacy_leftovers(project_root)
    stale = stale_config_keys(project_root, installation)
    unused = unused_customizations(project_root, installation, retirement)
    edits = {
        relative: text_without_keys(
            (project_root / relative).read_text(encoding="utf-8"), [key for file, key in stale if file == relative]
        )
        for relative in dict.fromkeys(file for file, _path in stale)
    }
    report: dict[str, object] = {
        "mode": "clean",
        "backup": None,
        "removed_files": [],
        "removed_keys": [],
        "removed_customizations": [],
    }
    if not (leftovers or stale or unused):
        return report
    backup = backup_bmad(project_root)
    report["backup"] = backup.relative_to(project_root).as_posix()
    for relative in leftovers:
        path = bmad.joinpath(*PurePosixPath(relative).parts)
        if path.is_dir() and not path.is_symlink():
            shutil.rmtree(path)
        else:
            path.unlink()
        prune_empty_parents(path.parent, bmad)
    for relative, text in edits.items():
        write_text(project_root / relative, text)
    for name in unused:
        (bmad / "custom" / name).unlink()
    report["removed_files"] = [f"_bmad/{relative}" for relative in leftovers]
    report["removed_keys"] = [{"file": relative, "key": ".".join(path)} for relative, path in stale]
    report["removed_customizations"] = [f"_bmad/custom/{name}" for name in unused]
    return report


def backup_bmad(project_root: Path) -> Path:
    """Copy `_bmad/` into a new `.v6-v7-migration-backup-<datetime>/`, which the method migration reuses.
    Its `.gitignore` keeps the copy, personal settings included, out of every commit."""
    now = datetime.datetime.now()
    backup = project_root / f"{BACKUP_PREFIX}{now:%Y%m%d-%H%M}"
    if present(backup):
        backup = project_root / f"{BACKUP_PREFIX}{now:%Y%m%d-%H%M%S}"
    shutil.copytree(project_root / "_bmad", backup / "_bmad", symlinks=True)
    write_text(backup / ".gitignore", "*")
    return backup


def prune_empty_parents(folder: Path, stop: Path) -> None:
    while folder != stop and folder.is_dir() and not folder.is_symlink() and not any(folder.iterdir()):
        folder.rmdir()
        folder = folder.parent


def text_without_keys(text: str, paths: list[tuple[str, ...]]) -> str:
    """The file's text with these keys removed, so comments and layout survive.

    A key written on one line in its table's section is cut by text, and a table left
    empty loses its header. When the result does not parse to the expected values,
    the whole file is rendered instead.
    """
    expected = tomllib.loads(text)
    for path in paths:
        drop_path(expected, path)
    lines = text.split("\n")
    for path in paths:
        lines = lines_without_key(lines, path[:-1], path[-1])
    headers = [index for index, line in enumerate(lines) if TABLE_HEADER.match(line)]
    emptied = {
        index
        for position, index in enumerate(headers)
        if (name := header_path(lines[index])) is not None
        and lookup(expected, name) is _MISSING
        and not any(
            line.strip() and not line.lstrip().startswith("#")
            for line in lines[index + 1 : headers[position + 1] if position + 1 < len(headers) else len(lines)]
        )
    }
    candidate = "\n".join(line for index, line in enumerate(lines) if index not in emptied)
    try:
        if tomllib.loads(candidate) == expected:
            return candidate
    except tomllib.TOMLDecodeError:
        pass
    return render_toml(expected)


def drop_path(data: dict, path: tuple[str, ...]) -> None:
    """Delete the key at path, then any table the deletion left empty."""
    parents = [data]
    for part in path[:-1]:
        child = parents[-1].get(part)
        if not isinstance(child, dict):
            return
        parents.append(child)
    parents[-1].pop(path[-1], None)
    for depth in range(len(path) - 1, 0, -1):
        if parents[depth]:
            break
        parents[depth - 1].pop(path[depth - 1], None)


def lines_without_key(lines: list[str], table: tuple[str, ...], leaf: str) -> list[str]:
    start, end = 0, len(lines)
    if table:
        headers = [(index, header_path(line)) for index, line in enumerate(lines) if TABLE_HEADER.match(line)]
        for position, (index, name) in enumerate(headers):
            if name == table:
                start = index + 1
                end = headers[position + 1][0] if position + 1 < len(headers) else len(lines)
                break
        else:
            return lines
    else:
        end = next((index for index, line in enumerate(lines) if TABLE_HEADER.match(line)), len(lines))
    key = re.compile(rf"\s*(?:{re.escape(leaf)}|\"{re.escape(leaf)}\"|'{re.escape(leaf)}')\s*=")
    for index in range(start, end):
        if not key.match(lines[index]):
            continue
        # A multi-line value ends at the first line after which the file parses again.
        for stop in range(index + 1, end + 1):
            remaining = [*lines[:index], *lines[stop:]]
            try:
                tomllib.loads("\n".join(remaining))
            except tomllib.TOMLDecodeError:
                continue
            return remaining
        return lines
    return lines


def report(project_root: Path, skill_root: Path, *, roots: tuple[Path, ...] = ()) -> dict[str, object]:
    """The traces `--clean` would remove. Reads only."""
    reject_unusable_bmad(project_root)
    installation = discover_installation(skill_root, roots)
    retirement = retirement_report(
        project_root, skill_root, installation, retired_skills(installation.modules, installation.modules)
    )
    return {"mode": "report", **traces_json(project_root, installation, retirement)}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Report or remove the v6 traces in _bmad that v7 does not read.")
    parser.add_argument("--project-root", type=Path, required=True)
    parser.add_argument("--skill", type=Path, required=True)
    parser.add_argument("--root", type=Path, action="append", default=[], help="an active skills folder, repeated")
    parser.add_argument("--clean", action="store_true", help="back up _bmad, then remove the traces")
    args = parser.parse_args(argv)
    project_root = args.project_root.resolve()
    skill_root = args.skill.resolve()
    roots = tuple(root.resolve() for root in args.root)
    run = clean if args.clean else report
    _setup.print_json(run(project_root, skill_root, roots=roots))
    return 0


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    try:
        raise SystemExit(main())
    except Exception as error:
        sys.stderr.write(f"error: {error}\n")
        raise SystemExit(1) from None
