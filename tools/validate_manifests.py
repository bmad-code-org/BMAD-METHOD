#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Check every skills/*/bmod.toml against the runtime that has to read it.

This file owns the repository checks: pre-commit and CI run it, and tools/stamp_release.py imports
`check_repo` and `stamp_text` from it. Keys and tables the runtime does not know are left alone.

Usage:
  uv run tools/validate_manifests.py [--project-root <path>]
"""

from __future__ import annotations

import argparse
import copy
import importlib.util
import re
import sys
import tomllib
from pathlib import Path, PurePosixPath
from typing import NamedTuple

sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parent.parent
RECORD_PREFIX = "bmod-"
STAMP_PROBE = "0.0.0-stamp-check"

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


setup = load("bmad_setup_validate", ROOT / "skills" / "bmad" / "scripts" / "setup.py")
knowledge = load("bmad_knowledge_validate", ROOT / "skills" / "bmad" / "scripts" / "knowledge.py")


class RepoReport(NamedTuple):
    records: tuple[Path, ...]
    skills: int
    documents: int
    problems: tuple[str, ...]


def check_repo(project_root: Path) -> RepoReport:
    skills_dir = project_root / "skills"
    folders = sorted(path for path in skills_dir.glob("*") if path.is_dir())
    if not folders:
        problem = f"no skills/*/{setup.MANIFEST_NAME} found under {project_root}: run from a BMAD-METHOD checkout"
        return RepoReport((), 0, 0, (problem,))

    problems: list[str] = []
    files: dict[str, setup.ParsedFile] = {}
    for folder in folders:
        manifest = folder / setup.MANIFEST_NAME
        if not manifest.is_file():
            problems.append(f"skills/{folder.name}: missing {setup.MANIFEST_NAME}")
            continue
        try:
            files[folder.name] = setup.parse_bmod_file(manifest, manifest.read_bytes())
        except Exception as error:
            problems.append(f"{rel(folder.name)}: the runtime parser rejects this file: {error}")

    shipped = {folder.name for folder in folders}
    records = {name: parsed.bmod for name, parsed in files.items() if parsed.bmod is not None}
    members = {name: member_names(name, files[name]) for name in records}

    problems += record_problems(files, records)
    problems += membership_problems(files, records, members, shipped)
    for name, parsed in files.items():
        for table, source in (("bmod", parsed.bmod), ("skill", parsed.skill)):
            if source is not None:
                problems += requirement_problems(name, table, source, shipped)
    documents = 0
    for name, record in records.items():
        folder = skills_dir / name
        documents += len(record.knowledge) + (folder / knowledge.HELP_NAME).is_file()
        problems += knowledge_problems(name, record, folder, members[name])
        problems += topic_problems(name, folder)
        problems += roster_file_problems(name, record, folder, skills_dir)
        problems += stamp_problems(name, folder / setup.MANIFEST_NAME)

    if not problems:
        problems += runtime_problems(skills_dir)

    record_files = tuple(skills_dir / name / setup.MANIFEST_NAME for name in sorted(records))
    skill_count = sum(1 for parsed in files.values() if parsed.skill is not None)
    return RepoReport(record_files, skill_count, documents, tuple(problems))


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


def stamp_problems(name: str, manifest: Path) -> list[str]:
    """A record the stamper could not stamp fails here, at commit time."""
    try:
        stamp_text(manifest.read_bytes().decode("utf-8"), STAMP_PROBE)
    except (OSError, ValueError) as error:
        return [f"{rel(name)}: tools/stamp_release.py cannot stamp this file: {error}"]
    return []


def rel(folder: str) -> str:
    return f"skills/{folder}/{setup.MANIFEST_NAME}"


def member_names(folder: str, parsed: setup.ParsedFile) -> tuple[str, ...]:
    if parsed.bmod.skills is not None:
        return parsed.bmod.skills
    return (folder,) if parsed.skill is not None else ()


def record_problems(files: dict[str, setup.ParsedFile], records: dict[str, setup.ParsedBmod]) -> list[str]:
    problems: list[str] = []
    first_by_code: dict[str, str] = {}
    for name, record in records.items():
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
            problems.append(f"skills/{name}/{knowledge.HELP_NAME}, which every bmod-* folder holds, {problem}")
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
    where = f"skills/{name}/{knowledge.TOPICS_DIR}"
    problems = [f"{where}/{topic} is never named in {knowledge.HELP_NAME}" for topic in sorted(shipped - named)]
    problems += [
        f"skills/{name}/{knowledge.HELP_NAME} names {where}/{topic}, which does not exist"
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


def roster_file_problems(name: str, record: setup.ParsedBmod, folder: Path, skills_dir: Path) -> list[str]:
    path = folder / knowledge.ROSTER_NAME
    if not path.exists() and not path.is_symlink():
        return []
    where = f"skills/{name}/{knowledge.ROSTER_NAME}"
    problem = plain_file_problem(folder, PurePosixPath(knowledge.ROSTER_NAME))
    if problem is not None:
        return [f"{where} {problem}"]
    try:
        party = tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
        return [f"{where}: cannot read roster: {error}"]
    return [f"{where}: {problem}" for problem in roster_problems(party, skills_dir)]


def roster_problems(party: dict, skills_dir: Path) -> list[str]:
    """A group naming a member nobody defines, or a member naming a skill this repo lacks, is a typo."""
    problems: list[str] = []
    members = [member for member in as_list(party.get("members")) if isinstance(member, dict)]
    codes = [member.get("code") for member in members]
    repeated = sorted({code for code in codes if isinstance(code, str) and codes.count(code) > 1})
    problems += [f"member code {code!r} is defined twice" for code in repeated]
    for member in members:
        skill = member.get("skill")
        if skill is not None and not (isinstance(skill, str) and (skills_dir / skill / "SKILL.md").is_file()):
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


def runtime_problems(skills_dir: Path) -> list[str]:
    """The tree as `bmad` itself would discover it. Runs only on a tree the checks above accept."""
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
    parser = argparse.ArgumentParser(description="Check every skills/*/bmod.toml in a repository.")
    parser.add_argument("--project-root", type=Path, default=ROOT, help="repository to check (default: this one)")
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
    sys.exit(main())
