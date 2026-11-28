#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
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

A `migration-<n>.toml` file in the record's folder is a migration the
module ships: the rules for moving a project from one major version of the
module to the next. `<n>` is a whole number that sets the order in which a
module's migrations are listed, checked and run. One is listed only when its
`[migration]` table names the record's `module` and has `from`, `to`,
`title`, `summary`, `detect`, `guide`, and a `checklist`; the listing carries
`from`, `to`, `title` and the file path, never the text. A `[migration]`
table in a file with any other name, and two files of one module with the
same number, are problems. `bmad migrate` reads the file.

A module's document templates are the markdown files with a `template:` or
`extends:` frontmatter key in the record's `doc-templates/` folder and in the
`assets/` folder of each of its skills. Each is listed by id, version and
short description, never its text, with `agents` when it has any: the skills
that run it, from its `agents:` frontmatter list and the skill whose assets
hold it. No agents means anyone reaches it through `bmad-facilitate`. Templates
a project or user added outside a module are not listed; `list_templates.py`
reads those.

A file this script cannot use becomes an entry in `problems`, never an
exception.

Usage:
  uv run knowledge.py --root .claude/skills [--root ...] [--content]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

# ruff: noqa: E402

sys.dont_write_bytecode = True

_SCRIPTS_DIR = str(Path(__file__).resolve().parent)
if _SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, _SCRIPTS_DIR)

from bmod_utils import (  # noqa: E402
    MANIFEST_NAME as MANIFEST_NAME,
)
from bmod_utils import (
    READ_LIMIT as READ_LIMIT,
)
from bmod_utils import (
    ROSTER_NAME as ROSTER_NAME,
)
from bmod_utils import (
    Module as Module,
)
from bmod_utils import (
    Scan as Scan,
)
from bmod_utils import (
    absent_records as absent_records,
)
from bmod_utils import (
    grouped as grouped,
)
from bmod_utils import (
    install_command as install_command,
)
from bmod_utils import (
    is_skill as is_skill,
)
from bmod_utils import (
    manifest_problem as manifest_problem,
)
from bmod_utils import (
    read_document as read_document,
)
from bmod_utils import (
    read_record as read_record,
)
from bmod_utils import (
    resolve_skill as resolve_skill,
)
from bmod_utils import (
    safe_skill_relative as safe_skill_relative,
)
from bmod_utils import (
    scan as scan,
)
from list_templates import MODULE_FOLDER as TEMPLATES_DIR  # noqa: E402
from list_templates import listed, read_fields, scalar  # noqa: E402

TOPICS_DIR = "help"
HELP_NAME = f"{TOPICS_DIR}/help.md"
ASSETS_DIR = "assets"
RETIRED_NAME = "retired.toml"
MIGRATION_TABLE = "migration"
MIGRATION_FIELDS = ("module", "from", "to", "title", "summary", "detect", "guide")
MIGRATION_NAME = re.compile(r"migration-([0-9]+)\.toml")


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
    templates = [template for module in found.modules for template in module_templates(module, found.folders, problems)]

    return {
        "roots": [str(root) for root in roots],
        "skills": sorted(found.skills, key=lambda item: str(item["skill"])),
        "documents": sorted(documents.values(), key=lambda item: (str(item["module"]), str(item["path"]))),
        "topics": sorted(topics, key=lambda item: (str(item["module"]), str(item["path"]))),
        "templates": templates,
        "migrations": sorted(migrations, key=lambda item: (str(item["module"]), migration_number(str(item["path"])))),
        "problems": problems,
    }


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


def module_templates(
    module: Module, folders: dict[str, Path], problems: list[dict[str, object]]
) -> list[dict[str, object]]:
    """The document templates a module ships, from its record and its skills' assets."""
    places = [(module.folder / TEMPLATES_DIR, module.folder, None)]
    places += [(folders[name] / ASSETS_DIR, folders[name], name) for name in module.skills if name in folders]
    templates: list[dict[str, object]] = []
    for place, owner, skill in places:
        try:
            found = sorted(place.glob("*.md"))
        except OSError:
            continue
        for path in found:
            try:
                meta = read_fields(read_document(path, owner).decode("utf-8"))
            except (OSError, ValueError) as error:
                problems.append(
                    {"kind": "document", "skill": owner.name, "document": str(path), "problem": f"{path}: {error}"}
                )
                continue
            extends, template = scalar(meta, "extends"), scalar(meta, "template")
            if not extends and not template:
                continue
            agents = list(dict.fromkeys([*([skill] if skill else []), *listed(meta.get("agents"))]))
            templates.append(
                {
                    "module": module.code,
                    **({"extends": extends} if extends else {"id": template}),
                    **({"version": scalar(meta, "version")} if scalar(meta, "version") else {}),
                    "description": scalar(meta, "description"),
                    **({"agents": agents} if agents else {}),
                }
            )
    return sorted(templates, key=lambda item: str(item.get("id") or item.get("extends")))


def module_migrations(module: Module, problems: list[dict[str, object]]) -> list[dict[str, object]]:
    """The migrations a record ships: its `migration-<n>.toml` files, in number order."""
    folder = module.folder
    try:
        found = sorted(
            path for path in folder.glob("*.toml") if path.name not in (MANIFEST_NAME, ROSTER_NAME, RETIRED_NAME)
        )
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
        if migration_number(path.name) is None:
            problems.append(migration_problem(folder, path, "a migration file must be named migration-<n>.toml"))
            continue
        listed = {name: fields[name] for name in ("from", "to", "title")}
        migrations.append({"module": module.code, "path": path.name, "file": str(path), **listed})
    numbers = [migration_number(str(item["path"])) for item in migrations]
    duplicated = {number for number in numbers if numbers.count(number) > 1}
    for item in migrations:
        if migration_number(str(item["path"])) in duplicated:
            problems.append(
                migration_problem(
                    folder, Path(str(item["file"])), "another migration of this module has the same number"
                )
            )
    kept = [item for item in migrations if migration_number(str(item["path"])) not in duplicated]
    return sorted(kept, key=lambda item: migration_number(str(item["path"])))


def migration_number(name: str) -> int | None:
    match = MIGRATION_NAME.fullmatch(name)
    return int(match.group(1)) if match else None


def migration_problem(folder: Path, path: Path, problem: str) -> dict[str, object]:
    return {"kind": "migration", "skill": folder.name, "document": str(path), "problem": f"{path}: {problem}"}


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8", errors=getattr(sys.stdout, "errors", None) or "strict")
        sys.stderr.reconfigure(encoding="utf-8", errors=getattr(sys.stderr, "errors", None) or "strict")
    sys.exit(main())
