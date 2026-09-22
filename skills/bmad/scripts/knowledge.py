#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Report the knowledge documents the installed modules offer.

A folder whose `bmod.toml` has a `[bmod]` table is a module record, whatever
the folder is called. The record names the module's skills and holds each
knowledge document once. `help/help.md` in the record's folder covers every
skill of the module and needs no entry. A `[[bmod.knowledge]]` entry adds a further document
and says which of the module's skills it covers: `"*"` or no `skills` key means
all of them, a list means the named ones.

Every other `help/*.md` is a topic: detail that `help/help.md` points to and a
reader opens only when a question needs it. Topics are listed with their
file path and never with their text.

A `*.toml` file in the record's folder with a `[migration]` table is a
migration the module ships: the rules for moving a project from one major
version of the module to the next. One is listed only when its table names
the record's `module` and has `from`, `to`, `title`, `summary`, `detect`,
`guide`, and a `checklist`; the listing carries `from`, `to`, `title` and the
file path, never the text. `bmad migrate` reads the file.

A file this script cannot use becomes an entry in `problems`, never an
exception.

Usage:
  uv run knowledge.py --root .claude/skills [--root ...] [--content]
"""

from __future__ import annotations

import argparse
import json
import stat
import sys
import tomllib
from pathlib import Path, PurePosixPath
from typing import NamedTuple

sys.dont_write_bytecode = True

MANIFEST_NAME = "bmod.toml"
TOPICS_DIR = "help"
HELP_NAME = f"{TOPICS_DIR}/help.md"
ROSTER_NAME = "roster.toml"
MIGRATION_TABLE = "migration"
MIGRATION_FIELDS = ("module", "from", "to", "title", "summary", "detect", "guide")
READ_LIMIT = 1024 * 1024


class Module(NamedTuple):
    code: str
    folder: Path
    table: dict[str, object]
    skills: list[str]


class Scan(NamedTuple):
    folders: dict[str, Path]
    modules: list[Module]
    skills: list[dict[str, object]]
    problems: list[dict[str, object]]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Report the knowledge documents the installed modules offer.")
    parser.add_argument("--root", type=Path, action="append", required=True, help="a skills root to scan")
    parser.add_argument("--content", action="store_true", help="include each document's text")
    args = parser.parse_args(argv)
    print(json.dumps(collect(args.root, include_content=args.content), ensure_ascii=False))
    return 0


def collect(roots: list[Path], *, include_content: bool = False) -> dict[str, object]:
    found = scan(roots)
    problems = found.problems
    documents: dict[tuple[str, str], dict[str, object]] = {}

    for module in found.modules:
        entries = module.table.get("knowledge", [])
        if not isinstance(entries, list):
            problems.append(
                {"kind": "knowledge", "skill": module.folder.name, "problem": "[bmod] 'knowledge' is not a list"}
            )
            continue
        if (module.folder / HELP_NAME).exists():
            entries = [{"path": HELP_NAME}, *entries]
        for entry in entries:
            record_document(documents, problems, found.folders, module, entry, include_content=include_content)

    topics = [
        topic
        for module in found.modules
        for topic in module_topics(module, problems)
        if (topic["module"], topic["path"]) not in documents
    ]

    migrations = [migration for module in found.modules for migration in module_migrations(module, problems)]

    return {
        "roots": [str(root) for root in roots],
        "skills": sorted(found.skills, key=lambda item: str(item["skill"])),
        "documents": sorted(documents.values(), key=lambda item: (str(item["module"]), str(item["path"]))),
        "topics": sorted(topics, key=lambda item: (str(item["module"]), str(item["path"]))),
        "migrations": sorted(migrations, key=lambda item: (str(item["module"]), str(item["path"]))),
        "problems": problems,
    }


def scan(roots: list[Path]) -> Scan:
    """Find every module record and every module skill in the roots."""
    folders: dict[str, Path] = {}
    modules: list[Module] = []
    problems: list[dict[str, object]] = []
    record_codes: dict[str, str] = {}
    pending: list[tuple[Path, Path, dict[str, object], bool]] = []

    for root in roots:
        try:
            found = sorted(path for path in root.iterdir() if path.is_dir())
        except OSError as error:
            problems.append({"kind": "root", "root": str(root), "problem": f"cannot read root {root}: {error}"})
            continue
        for folder in found:
            # The first root wins a folder name outright: a project copy shadows a
            # user copy even when the project copy carries no bmod.toml.
            if folder.name in folders:
                continue
            folders[folder.name] = folder
            manifest = folder / MANIFEST_NAME
            try:
                if not manifest.is_file():
                    continue
                data = tomllib.loads(manifest.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
                problems.append(manifest_problem(folder, f"cannot use {manifest}: {error}"))
                continue
            if "bmod" not in data and "skill" not in data:
                problems.append(manifest_problem(folder, f"{manifest} has neither a [bmod] nor a [skill] table"))
                continue

            skill = data.get("skill")
            if "skill" in data and not isinstance(skill, dict):
                problems.append(manifest_problem(folder, f"{manifest}: 'skill' is not a table"))
                skill = None
            if "bmod" in data:
                module = read_record(folder, data["bmod"], skill is not None, problems)
                if module is not None:
                    record_codes[folder.name] = module.code
                    first = next((other for other in modules if other.code.casefold() == module.code.casefold()), None)
                    if first is None:
                        modules.append(module)
                    else:
                        problems.append(
                            {
                                "kind": "module",
                                "skill": folder.name,
                                "problem": f"{folder.name}: module {module.code!r} is already recorded by "
                                f"{first.folder.name}; {first.folder.name} is used",
                            }
                        )
            if skill is not None:
                pending.append((root, folder, skill, "bmod" in data))

    skills = [
        resolve_skill(root, folder, table, own_record, record_codes) for root, folder, table, own_record in pending
    ]
    problems.extend(absent_records(skills, folders))
    for entry in skills:
        entry.pop("source")
    return Scan(folders, modules, skills, problems)


def manifest_problem(folder: Path, problem: str) -> dict[str, object]:
    return {"kind": "manifest", "skill": folder.name, "manifest": str(folder / MANIFEST_NAME), "problem": problem}


def read_record(folder: Path, table: object, has_skill: bool, problems: list[dict[str, object]]) -> Module | None:
    manifest = folder / MANIFEST_NAME
    if not isinstance(table, dict):
        problems.append(manifest_problem(folder, f"{manifest}: 'bmod' is not a table"))
        return None
    code = table.get("code")
    if not isinstance(code, str) or not code:
        problems.append(manifest_problem(folder, f"{manifest}: [bmod] has no usable 'code'"))
        return None
    listed = table.get("skills")
    if listed is None:
        # A record that is also a skill, with no list, is its own one member.
        members = [folder.name] if has_skill else []
    elif isinstance(listed, list) and all(isinstance(name, str) and name for name in listed):
        members = list(dict.fromkeys(listed))
    else:
        problems.append(manifest_problem(folder, f"{manifest}: [bmod] 'skills' is not a list of skill names"))
        members = []
    return Module(code, folder, table, members)


def resolve_skill(
    root: Path, folder: Path, table: dict[str, object], own_record: bool, record_codes: dict[str, str]
) -> dict[str, object]:
    bmod = folder.name if own_record else table.get("bmod")
    if not isinstance(bmod, str) or not bmod:
        bmod = None
    return {
        "skill": folder.name,
        "module": record_codes.get(bmod) if bmod else None,
        "bmod": bmod,
        "root": str(root),
        "source": table.get("source"),
    }


def absent_records(skills: list[dict[str, object]], folders: dict[str, Path]) -> list[dict[str, object]]:
    """One problem per module record that skills name and no root holds."""
    problems: list[dict[str, object]] = []
    by_bmod: dict[str, list[dict[str, object]]] = {}
    for entry in skills:
        if entry["module"] is not None:
            continue
        if entry["bmod"] is None:
            problems.append(
                {
                    "kind": "manifest",
                    "skill": entry["skill"],
                    "problem": f"{entry['skill']}: [skill] does not name its module record under 'bmod'",
                }
            )
            continue
        by_bmod.setdefault(str(entry["bmod"]), []).append(entry)
    for bmod, entries in sorted(by_bmod.items()):
        names = sorted(str(entry["skill"]) for entry in entries)
        state = "has no usable module record" if bmod in folders else "is not installed"
        problem: dict[str, object] = {
            "kind": "module",
            "bmod": bmod,
            "skills": names,
            "problem": f"module record {bmod} {state}; it is named by {', '.join(names)}",
        }
        command = None if bmod in folders else install_command(entries[0]["source"], bmod)
        if command:
            problem["install"] = command
            problem["problem"] = f"{problem['problem']}; install it with `{command}`"
        problems.append(problem)
    return problems


def install_command(source: object, skill: str) -> str | None:
    if not isinstance(source, str) or not source.startswith("github:"):
        return None
    parts = source.removeprefix("github:").split("/")
    if len(parts) < 2 or not all(parts[:2]):
        return None
    return f"npx skills add {parts[0]}/{parts[1]} --skill {skill}"


def record_document(
    documents: dict[tuple[str, str], dict[str, object]],
    problems: list[dict[str, object]],
    folders: dict[str, Path],
    module: Module,
    entry: object,
    *,
    include_content: bool,
) -> None:
    folder = module.folder
    name = entry.get("path") if isinstance(entry, dict) else None
    if not isinstance(name, str):
        problems.append(
            {"kind": "knowledge", "skill": folder.name, "problem": f"knowledge entry {entry!r} has no path"}
        )
        return
    relative = safe_skill_relative(name)
    if relative is None:
        problems.append({"kind": "knowledge", "skill": folder.name, "problem": f"knowledge names unsafe path {name!r}"})
        return
    covered = entry.get("skills", "*")
    if covered == "*":
        skills = list(module.skills)
    elif isinstance(covered, list) and all(isinstance(skill, str) and skill for skill in covered):
        skills = list(dict.fromkeys(covered))
    else:
        problems.append(
            {
                "kind": "knowledge",
                "skill": folder.name,
                "problem": f"knowledge entry {name!r}: 'skills' is neither \"*\" nor a list of skill names",
            }
        )
        return
    key = (module.code, relative.as_posix())
    if key in documents:
        problems.append({"kind": "knowledge", "skill": folder.name, "problem": f"knowledge names {name!r} twice"})
        return

    path = folder.joinpath(*relative.parts)
    try:
        raw = read_document(path, folder)
    except (OSError, ValueError) as error:
        problems.append(
            {"kind": "document", "skill": folder.name, "document": str(path), "problem": f"{path}: {error}"}
        )
        return
    try:
        text = raw.decode("utf-8")
    except UnicodeError as error:
        problems.append(
            {
                "kind": "document",
                "skill": folder.name,
                "document": str(path),
                "problem": f"{path}: not valid UTF-8, so it is not a knowledge document: {error}",
            }
        )
        return

    document: dict[str, object] = {
        "module": module.code,
        "path": relative.as_posix(),
        "skills": skills,
        "installed_skills": [skill for skill in skills if skill in folders],
        "reported_from": folder.name,
    }
    if include_content:
        document["content"] = text
    documents[key] = document


def module_topics(module: Module, problems: list[dict[str, object]]) -> list[dict[str, object]]:
    folder = module.folder
    try:
        found = sorted(path for path in (folder / TOPICS_DIR).glob("*.md") if path != folder / HELP_NAME)
    except OSError:
        return []
    topics: list[dict[str, object]] = []
    for path in found:
        try:
            read_document(path, folder).decode("utf-8")
        except (OSError, ValueError) as error:
            problems.append(
                {"kind": "document", "skill": folder.name, "document": str(path), "problem": f"{path}: {error}"}
            )
            continue
        topics.append(
            {"module": module.code, "topic": path.stem, "path": f"{TOPICS_DIR}/{path.name}", "file": str(path)}
        )
    return topics


def module_migrations(module: Module, problems: list[dict[str, object]]) -> list[dict[str, object]]:
    """The migrations a record ships: every `*.toml` beside `bmod.toml` with a `[migration]` table."""
    folder = module.folder
    try:
        found = sorted(path for path in folder.glob("*.toml") if path.name not in (MANIFEST_NAME, ROSTER_NAME))
    except OSError:
        return []
    migrations: list[dict[str, object]] = []
    for path in found:
        try:
            data = tomllib.loads(read_document(path, folder).decode("utf-8"))
        except (OSError, ValueError) as error:
            problems.append(migration_problem(folder, path, str(error)))
            continue
        if MIGRATION_TABLE not in data:
            continue
        table = data[MIGRATION_TABLE]
        if not isinstance(table, dict):
            problems.append(migration_problem(folder, path, "'migration' is not a table"))
            continue
        fields = {name: table.get(name) for name in MIGRATION_FIELDS}
        missing = [name for name, value in fields.items() if not isinstance(value, str) or not value.strip()]
        checklist = table.get("checklist")
        if (
            not isinstance(checklist, list)
            or not checklist
            or not all(isinstance(item, str) and item.strip() for item in checklist)
        ):
            missing.append("checklist")
        if missing:
            problems.append(migration_problem(folder, path, f"[migration] needs non-empty {', '.join(missing)}"))
            continue
        if fields["module"] != module.code:
            problems.append(
                migration_problem(
                    folder, path, f"[migration] module {fields['module']!r} is not this record's {module.code!r}"
                )
            )
            continue
        listed = {name: fields[name] for name in ("from", "to", "title")}
        migrations.append({"module": module.code, "path": path.name, "file": str(path), **listed})
    return migrations


def migration_problem(folder: Path, path: Path, problem: str) -> dict[str, object]:
    return {"kind": "migration", "skill": folder.name, "document": str(path), "problem": f"{path}: {problem}"}


def read_document(path: Path, folder: Path) -> bytes:
    """Read a knowledge document, refusing anything that is not a plain file inside the folder."""
    resolved = path.resolve()
    if not resolved.is_relative_to(folder.resolve()):
        raise ValueError("resolves outside the skill folder")
    status = resolved.stat()
    if not stat.S_ISREG(status.st_mode):
        raise ValueError("is not a regular file")
    with resolved.open("rb") as handle:
        raw = handle.read(READ_LIMIT + 1)
    if len(raw) > READ_LIMIT:
        raise ValueError(f"is larger than {READ_LIMIT} bytes")
    return raw


def safe_skill_relative(entry: str) -> PurePosixPath | None:
    """A bmod.toml path that cannot escape the skill folder, or None if it can.

    Mirrors safe_skill_relative in setup.py. A URL parses as an ordinary
    relative path and a Windows drive prefix makes a later join discard the
    skill folder, so both are refused by name. pathlib drops "." components
    itself, so only ".." and an empty final component need checking.
    """
    if not entry or "://" in entry or "\\" in entry or ":" in entry:
        return None
    relative = PurePosixPath(entry)
    if relative.is_absolute() or ".." in relative.parts or not relative.name:
        return None
    return relative


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
