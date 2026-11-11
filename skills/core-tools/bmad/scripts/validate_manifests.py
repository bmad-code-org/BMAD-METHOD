#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Check every bmod.toml under skills/ against the runtime that has to read it.

A skill folder sits in skills/ or one level down, in a folder that groups a module's skills
(skills/founder/bmad-founder-agent-advisor). Either way it installs flat, under its own name.

This file owns the repository checks: pre-commit and CI run it, and stamp_release.py beside it imports
`check_repo` and `stamp_text` from it. Keys and tables the runtime does not know are left alone.
It ships with the `bmad` skill, so any module repository can run it against its own tree.

Usage:
  uv run skills/core-tools/bmad/scripts/validate_manifests.py [--project-root <path>]
"""

from __future__ import annotations

import argparse
import copy
import importlib.util
import re
import shutil
import sys
import tempfile
import tomllib
from pathlib import Path, PurePosixPath
from typing import NamedTuple

sys.dont_write_bytecode = True

SCRIPTS = Path(__file__).resolve().parent
RECORD_PREFIX = "bmod-"
STAMP_PROBE = "0.0.0-stamp-check"
MESSAGE_KEYS = ("pre_install_message", "post_install_message")

TABLE_HEADER = re.compile(r"[ \t]*\[\[?[^\[\]\n]+\]\]?[ \t]*(?:#[^\n]*)?\r?\n?")
BMOD_HEADER = re.compile(r"[ \t]*\[[ \t]*bmod[ \t]*\][ \t]*(?:#[^\n]*)?\r?\n?")
VERSION_LINE = re.compile(r'(?P<head>[ \t]*version[ \t]*=[ \t]*)"[^"\n]*"(?P<tail>[ \t]*(?:#[^\n]*)?\r?\n?)')


def load(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise SystemExit(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


setup = load("bmad_setup_validate", SCRIPTS / "setup.py")
knowledge = load("bmad_knowledge_validate", SCRIPTS / "knowledge.py")


class RepoReport(NamedTuple):
    records: tuple[Path, ...]
    skills: int
    documents: int
    problems: tuple[str, ...]


# Each shipped skill's folder relative to skills/, for messages. check_repo fills it.
PLACES: dict[str, str] = {}


def place(name: str) -> str:
    return f"skills/{PLACES.get(name, name)}"


def skill_folders(skills_dir: Path) -> tuple[dict[str, Path], list[str]]:
    """Each skill folder by name. A folder with neither SKILL.md nor bmod.toml groups the skill folders inside it."""
    folders: dict[str, Path] = {}
    problems: list[str] = []
    for top in sorted(path for path in skills_dir.glob("*") if path.is_dir()):
        marked = (top / "SKILL.md").exists() or (top / "bmod.toml").exists()
        # A child with either marker is a skill, so one missing SKILL.md is reported, not skipped.
        grouped = (
            []
            if marked
            else [p for p in sorted(top.iterdir()) if (p / "SKILL.md").exists() or (p / "bmod.toml").exists()]
        )
        for folder in grouped or [top]:
            if folder.name in folders:
                first = folders[folder.name].relative_to(skills_dir).as_posix()
                problems.append(
                    f"skills/{folder.relative_to(skills_dir).as_posix()}: skills/{first} ships a skill of the same "
                    "name, and both would install to one folder"
                )
                continue
            folders[folder.name] = folder
    return folders, problems


def check_repo(project_root: Path) -> RepoReport:
    skills_dir = project_root / "skills"
    folders, problems = skill_folders(skills_dir)
    if not folders:
        problem = f"no skills/*/{setup.MANIFEST_NAME} found under {project_root}: pass the repository root with --project-root"
        return RepoReport((), 0, 0, (problem,))
    PLACES.clear()
    PLACES.update({name: folder.relative_to(skills_dir).as_posix() for name, folder in folders.items()})

    files: dict[str, setup.ParsedFile] = {}
    for name, folder in folders.items():
        manifest = folder / setup.MANIFEST_NAME
        if not manifest.is_file():
            problems.append(f"{place(name)}: missing {setup.MANIFEST_NAME}")
            continue
        try:
            files[name] = setup.parse_bmod_file(manifest, manifest.read_bytes())
        except Exception as error:
            problems.append(f"{rel(name)}: the runtime parser rejects this file: {error}")

    shipped = set(folders)
    records = {name: parsed.bmod for name, parsed in files.items() if parsed.bmod is not None}
    members = {name: member_names(name, files[name]) for name in records}

    problems += record_problems(files, records, folders)
    problems += membership_problems(files, records, members, shipped)
    retired: dict[str, setup.ParsedRetired] = {}
    for name in records:
        try:
            retired[name] = setup.read_retired_file(folders[name])
        except Exception as error:
            problems.append(f"{retired_rel(name)}: the runtime parser rejects this file: {error}")
    problems += retired_problems(retired, shipped)
    for name, parsed in files.items():
        for table, source in (("bmod", parsed.bmod), ("skill", parsed.skill)):
            if source is not None:
                problems += requirement_problems(name, table, source, shipped)
    documents = 0
    for name, record in records.items():
        folder = folders[name]
        documents += len(record.knowledge) + (folder / knowledge.HELP_NAME).is_file()
        problems += knowledge_problems(name, record, folder, members[name])
        problems += topic_problems(name, folder)
        problems += roster_file_problems(name, record, folder, folders)
        problems += stamp_problems(name, folder / setup.MANIFEST_NAME)
        problems += message_problems(name, folder / setup.MANIFEST_NAME)

    if not problems:
        problems += runtime_problems(skills_dir, folders)

    record_files = tuple(folders[name] / setup.MANIFEST_NAME for name in sorted(records))
    skill_count = sum(1 for parsed in files.values() if parsed.skill is not None)
    return RepoReport(record_files, skill_count, documents, tuple(problems))


def version_problem(version: str) -> str | None:
    """Why an installed module could not use this record version, or None. The stamper applies the same rule."""
    match = setup.SEMVER.fullmatch(version)
    if match is None:
        return f"invalid version {version!r}: must be SemVer (MAJOR.MINOR.PATCH, optional prerelease), e.g. 6.12.0"
    # setup.py refuses to order any version containing "-dev".
    if "-dev" in version.casefold():
        return (
            f'invalid version {version!r}: setup.py cannot order "-dev" '
            "versions, so an installed module would never compare as current — "
            "pick a different prerelease label"
        )
    # setup.py drops build metadata when ordering, so "1.2.0+x" compares equal to "1.2.0".
    if match.group("build") is not None:
        base = version.split("+", 1)[0]
        return (
            f"invalid version {version!r}: setup.py ignores build metadata when "
            f"ordering, so this compares equal to {base!r} and an installed module "
            "would never see the release — change the major, minor, patch, or "
            "prerelease part"
        )
    return None


def stamp_text(original: str, version: str) -> str:
    """The file with only the `version` line inside [bmod] rewritten. Raises ValueError when that cannot be done."""
    lines = original.splitlines(keepends=True)
    headers = [index for index, line in enumerate(lines) if BMOD_HEADER.fullmatch(line)]
    if len(headers) != 1:
        raise ValueError(f"expected exactly one '[bmod]' table header line, found {len(headers)}")
    start = headers[0] + 1
    # Only the [bmod] table itself: a table further down may have a `version` of its own.
    end = next((index for index in range(start, len(lines)) if TABLE_HEADER.fullmatch(lines[index])), len(lines))
    matches = [index for index in range(start, end) if VERSION_LINE.fullmatch(lines[index])]
    if len(matches) != 1:
        raise ValueError(f"expected exactly one 'version = \"...\"' line inside [bmod], found {len(matches)}")
    match = VERSION_LINE.fullmatch(lines[matches[0]])
    assert match is not None
    lines[matches[0]] = f'{match.group("head")}"{version}"{match.group("tail")}'
    stamped = "".join(lines)
    if tomllib.loads(stamped) != with_version(tomllib.loads(original), version):
        raise ValueError("rewriting the version line would change something other than [bmod] version")
    return stamped


def with_version(data: dict, version: str) -> dict:
    expected = copy.deepcopy(data)
    expected["bmod"]["version"] = version
    return expected


def message_problems(name: str, manifest: Path) -> list[str]:
    """Records in this repo carry both install messages, empty or not, so authors see the fields exist."""
    table = tomllib.loads(manifest.read_text(encoding="utf-8"))["bmod"]
    return [
        f"{rel(name)}: [bmod] is missing {key!r}; add it, empty if the module has no message"
        for key in MESSAGE_KEYS
        if key not in table
    ]


def stamp_problems(name: str, manifest: Path) -> list[str]:
    """A record the stamper could not stamp fails here, at commit time."""
    try:
        stamp_text(manifest.read_bytes().decode("utf-8"), STAMP_PROBE)
    except (OSError, ValueError) as error:
        return [f"{rel(name)}: stamp_release.py cannot stamp this file: {error}"]
    return []


def rel(folder: str) -> str:
    return f"{place(folder)}/{setup.MANIFEST_NAME}"


def member_names(folder: str, parsed: setup.ParsedFile) -> tuple[str, ...]:
    if parsed.bmod.skills is not None:
        return parsed.bmod.skills
    return (folder,) if parsed.skill is not None else ()


def record_problems(
    files: dict[str, setup.ParsedFile], records: dict[str, setup.ParsedBmod], folders: dict[str, Path]
) -> list[str]:
    problems: list[str] = []
    for name, parsed in files.items():
        if name.startswith(RECORD_PREFIX) and parsed.bmod is None:
            problems.append(
                f"{rel(name)}: a {RECORD_PREFIX}* folder holds a module record, but this file has no [bmod]"
            )
    first_by_code: dict[str, str] = {}
    for name, record in records.items():
        problem = version_problem(record.version)
        if problem is not None:
            problems.append(f"{rel(name)}: [bmod] {problem}")
        skill_md = folders[name] / "SKILL.md"
        if skill_md.is_symlink() or not skill_md.is_file():
            problems.append(f"{place(name)}: a module record folder must ship SKILL.md as a plain file")
        if files[name].skill is None and name != RECORD_PREFIX + record.code:
            problems.append(
                f"{rel(name)}: a module record folder is named {RECORD_PREFIX + record.code!r} "
                f"after its code; this one is {name!r}"
            )
        first = first_by_code.setdefault(record.code.casefold(), name)
        if first != name:
            problems.append(
                f"{rel(name)}: module code {record.code!r} is already declared by {rel(first)}; one record per code"
            )
    versions = {name: record.version for name, record in records.items()}
    if len(set(versions.values())) > 1:
        listed = ", ".join(f"{name} has {version!r}" for name, version in versions.items())
        problems.append(f"skills/: every module record carries one version, stamped together; {listed}")
    return problems


def membership_problems(
    files: dict[str, setup.ParsedFile],
    records: dict[str, setup.ParsedBmod],
    members: dict[str, tuple[str, ...]],
    shipped: set[str],
) -> list[str]:
    problems: list[str] = []
    for name, parsed in files.items():
        if parsed.skill is None:
            continue
        if parsed.bmod is not None:
            if name not in members[name]:
                problems.append(f"{rel(name)}: holds [skill], but its own [bmod] skills list leaves {name!r} out")
            continue
        bmod = parsed.skill.bmod
        if bmod in records and parsed.skill.source != records[bmod].update_source:
            problems.append(
                f"{rel(name)}: [skill] source {parsed.skill.source!r} differs from {rel(bmod)} "
                f"update_source {records[bmod].update_source!r}"
            )
        if bmod not in records:
            problems.append(
                f"{rel(name)}: [skill] bmod names {bmod!r}, which is not a module record in this repository"
            )
        elif name not in members[bmod]:
            problems.append(f"{rel(name)}: [skill] bmod names {bmod!r}, but {rel(bmod)} does not list {name!r}")
    for name in records:
        for member in members[name]:
            parsed = files.get(member)
            if member not in shipped:
                problems.append(f"{rel(name)}: lists the skill {member!r}, which this repository does not ship")
            elif parsed is None:
                continue
            elif parsed.skill is None or (parsed.bmod is not None and member != name):
                problems.append(
                    f"{rel(name)}: lists {member!r}, which is a module record and not a skill of this module"
                )
            elif member != name and parsed.skill.bmod != name:
                problems.append(
                    f"{rel(name)}: lists the skill {member!r}, but {rel(member)} names {parsed.skill.bmod!r} as its bmod"
                )
    return problems


def retired_problems(records: dict[str, setup.ParsedRetired], shipped: set[str]) -> list[str]:
    """A retired name is never shipped again, and a rename points at a skill this repository ships."""
    problems: list[str] = []
    retired_by: dict[str, str] = {}
    for name, record in records.items():
        retired = [*(rename.old for rename in record.renamed), *record.removed]
        for old in retired:
            if old in shipped:
                problems.append(
                    f"{retired_rel(name)}: retires {old!r}, but {place(old)} still ships; a retired name is never reused"
                )
            first = retired_by.setdefault(old, name)
            if first != name:
                problems.append(f"{retired_rel(name)}: retires {old!r}, which {retired_rel(first)} already retires")
        targets = [rename.new for rename in record.renamed]
        for new in dict.fromkeys(target for target in targets if targets.count(target) > 1):
            problems.append(
                f"{retired_rel(name)}: renames more than one skill to {new!r}; "
                "their customizations would collide, so list the extras under removed"
            )
        for rename in record.renamed:
            if rename.new not in shipped:
                problems.append(
                    f"{retired_rel(name)}: renames {rename.old!r} to {rename.new!r}, which this repository does not ship"
                )
    return problems


def retired_rel(folder: str) -> str:
    return f"{place(folder)}/{setup.RETIRED_NAME}"


def requirement_problems(
    folder: str, table: str, source: setup.ParsedBmod | setup.ParsedSkill, shipped: set[str]
) -> list[str]:
    """Shape is the runtime parser's job. These are the rules only the repository can decide."""
    problems: list[str] = []
    for field in ("required_skills", "recommended_skills"):
        for requirement in getattr(source, field):
            where = f"{rel(folder)}: {table}.{field} entry {requirement.skill!r}"
            # setup.py drops build metadata when ordering, so such a minimum could never be told apart.
            if requirement.version is not None and "+" in requirement.version:
                problems.append(
                    f"{where} version {requirement.version!r} carries build metadata, which setup.py ignores "
                    f"when ordering; it would compare equal to {requirement.version.split('+', 1)[0]!r}"
                )
            if requirement.source is None and requirement.skill not in shipped:
                problems.append(f"{where} names no skill in this repository and gives no source to fetch it from")
    return problems


def knowledge_problems(name: str, record: setup.ParsedBmod, folder: Path, members: tuple[str, ...]) -> list[str]:
    problems: list[str] = []
    help_path = folder / knowledge.HELP_NAME
    if name.startswith("bmod-") or help_path.exists() or help_path.is_symlink():
        problem = plain_file_problem(folder, PurePosixPath(knowledge.HELP_NAME))
        if problem is not None:
            problems.append(f"{place(name)}/{knowledge.HELP_NAME}, which every bmod-* folder holds, {problem}")
    for entry in record.knowledge:
        if entry.path.as_posix() == knowledge.HELP_NAME:
            problems.append(f"{rel(name)}: knowledge names {knowledge.HELP_NAME!r}, which is always read")
            continue
        problem = plain_file_problem(folder, entry.path)
        if problem is not None:
            problems.append(f"{rel(name)}: knowledge names {entry.path.as_posix()!r}, which {problem}")
        for skill in entry.skills or ():
            if skill not in members:
                problems.append(
                    f"{rel(name)}: knowledge {entry.path.as_posix()!r} names {skill!r}, which is not a skill of "
                    f"module {record.code!r}"
                )
    return problems


TOPIC_REFERENCE = re.compile(r"`help/([^`/<>]+\.md)`")


def topic_problems(name: str, folder: Path) -> list[str]:
    """A topic `help.md` never points to is never read, and a pointer to no file misleads the reader."""
    try:
        text = (folder / knowledge.HELP_NAME).read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        text = ""
    help_file = PurePosixPath(knowledge.HELP_NAME).name
    named = set(TOPIC_REFERENCE.findall(text)) - {help_file}
    shipped = {path.name for path in (folder / knowledge.TOPICS_DIR).glob("*.md")} - {help_file}
    where = f"{place(name)}/{knowledge.TOPICS_DIR}"
    problems = [f"{where}/{topic} is never named in {knowledge.HELP_NAME}" for topic in sorted(shipped - named)]
    problems += [
        f"{place(name)}/{knowledge.HELP_NAME} names {where}/{topic}, which does not exist"
        for topic in sorted(named - shipped)
    ]
    for topic in sorted(shipped):
        try:
            body = (folder / knowledge.TOPICS_DIR / topic).read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            continue
        problems += [
            f"{where}/{topic} names {where}/{other}, which does not exist"
            for other in sorted(set(TOPIC_REFERENCE.findall(body)) - shipped - {help_file})
        ]
    for topic in sorted(shipped & named):
        problem = plain_file_problem(folder, PurePosixPath(knowledge.TOPICS_DIR, topic))
        if problem is not None:
            problems.append(f"{where}/{topic} {problem}")
    return problems


def plain_file_problem(folder: Path, relative: PurePosixPath) -> str | None:
    path = folder.joinpath(*relative.parts)
    if path.is_symlink():
        return "is a symlink, not a plain file"
    try:
        knowledge.read_document(path, folder)
    except FileNotFoundError:
        return "the module record does not ship"
    except (OSError, ValueError) as error:
        return str(error)
    return None


def roster_file_problems(name: str, record: setup.ParsedBmod, folder: Path, folders: dict[str, Path]) -> list[str]:
    path = folder / knowledge.ROSTER_NAME
    if not path.exists() and not path.is_symlink():
        return []
    where = f"{place(name)}/{knowledge.ROSTER_NAME}"
    problem = plain_file_problem(folder, PurePosixPath(knowledge.ROSTER_NAME))
    if problem is not None:
        return [f"{where} {problem}"]
    try:
        party = tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
        return [f"{where}: cannot read roster: {error}"]
    return [f"{where}: {problem}" for problem in roster_problems(party, folders)]


def roster_problems(party: dict, folders: dict[str, Path]) -> list[str]:
    """A group naming a member nobody defines, or a member naming a skill this repo lacks, is a typo."""
    problems: list[str] = []
    members = [member for member in as_list(party.get("members")) if isinstance(member, dict)]
    codes = [member.get("code") for member in members]
    repeated = sorted({code for code in codes if isinstance(code, str) and codes.count(code) > 1})
    problems += [f"member code {code!r} is defined twice" for code in repeated]
    for member in members:
        skill = member.get("skill")
        if skill is not None and not (
            isinstance(skill, str) and skill in folders and (folders[skill] / "SKILL.md").is_file()
        ):
            problems.append(f"member {member.get('code')!r} names skill {skill!r}, which this repository does not ship")
    for group in as_list(party.get("groups")):
        if not isinstance(group, dict):
            continue
        for code in as_list(group.get("members")):
            if code not in codes:
                problems.append(f"group {group.get('id')!r} lists {code!r}, which no member defines")
    return problems


def as_list(value: object) -> list:
    return value if isinstance(value, list) else []


def runtime_problems(skills_dir: Path, folders: dict[str, Path]) -> list[str]:
    """The tree as `bmad` itself would discover it. Runs only on a tree the checks above accept."""
    if any(folder.parent != skills_dir for folder in folders.values()):
        # Installed skills sit side by side, so check a flat copy; copies, not links, because Windows CI may not link.
        with tempfile.TemporaryDirectory() as flat:
            for name, folder in folders.items():
                shutil.copytree(folder, Path(flat) / name, symlinks=True)
            return runtime_problems(Path(flat), {name: Path(flat) / name for name in folders})
    problems: list[str] = []
    try:
        installation = setup.discover_installation(skills_dir / "bmad")
    except Exception as error:
        return [f"skills/: setup.py cannot discover the modules: {error}"]
    problems += [f"skills/: setup.py reports: {problem['message']}" for problem in installation.problems]
    problems += [
        f"skills/: setup.py finds no module record {missing['bmod']!r} for {missing['skill']!r}"
        for missing in installation.missing_records
    ]
    report = knowledge.collect([skills_dir])
    problems += [f"skills/: knowledge.py reports: {problem['problem']}" for problem in report["problems"]]
    return problems


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Check every bmod.toml under skills/ in a repository.")
    parser.add_argument(
        "--project-root", type=Path, default=Path.cwd(), help="repository to check (default: the current directory)"
    )
    args = parser.parse_args(argv)

    report = check_repo(args.project_root.resolve())
    if report.problems:
        print(f"bmod file validation failed ({len(report.problems)}):", file=sys.stderr)
        for problem in report.problems:
            print(f"  {problem}", file=sys.stderr)
        return 1

    print(
        f"bmod files valid: {report.skills} skills, {len(report.records)} module records, "
        f"{report.documents} knowledge documents."
    )
    return 0


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
