#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Release version stamper for BMAD-METHOD.

Writes a human-supplied SemVer version into every skills/*/module-manifest.toml,
then verifies the result. Used by
tools/release.md to stamp releases and the next placeholder on `dev`.
The Claude and Codex plugins are built from the stamped manifests by
bmad-code-org/bmad-plugins.

Before writing anything it validates every manifest: the runtime parser in
skills/bmad/scripts/setup.py must accept it, the keys are module, version,
update_source and knowledge plus optional requires and recommends tables, module is a known
module, update_source carries its one known value, and every knowledge entry
names a plain file the skill ships. knowledge, requires and recommends belong
to the skill; every other field belongs to the module and must agree across it, which
is the same rule setup.py's module_identity applies at install time. A
document named by several skills must be byte-identical in each of them.

The `version = "..."` line is rewritten textually, so nothing else in a
manifest moves.

Nothing is written unless every file passes validation first. After writing,
the script re-reads every file and fails naming the offending path if
anything is off.

Usage:
  uv run --python 3.11 tools/stamp_release.py 1.2.0
"""

from __future__ import annotations

import argparse
import importlib.util
import re
import sys
import tomllib
from pathlib import Path, PurePosixPath

sys.dont_write_bytecode = True

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def load_setup():
    """The runtime parser, so the stamper can never accept a manifest it rejects."""
    path = PROJECT_ROOT / "skills" / "bmad" / "scripts" / "setup.py"
    spec = importlib.util.spec_from_file_location("bmad_setup_for_stamp", path)
    if spec is None or spec.loader is None:
        raise StampError(f"cannot load the runtime manifest parser at {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


MANIFEST_NAME = "module-manifest.toml"

MODULES = frozenset({"method", "core-tools"})
UPDATE_SOURCE = "github:bmad-code-org/BMAD-METHOD/skills"
MANIFEST_KEYS = frozenset({"module", "version", "update_source", "knowledge"})
OPTIONAL_MANIFEST_KEYS = frozenset({"requires", "recommends"})
REQUIREMENT_KEYS = frozenset({"version"})
OPTIONAL_REQUIREMENT_KEYS = frozenset({"source"})
# Mirrors UPDATE_SOURCE_PREFIXES in skills/bmad/scripts/setup.py.
SOURCE_PREFIXES = ("github:", "https://", "file:", "plugin:")

VERSION_LINE = re.compile(r'^version\s*=\s*".*"\s*$')

# Mirrors the SEMVER regex in skills/bmad/scripts/setup.py. That script also
# refuses to order any version containing "-dev", so such a version can never
# compare as current or outdated for installed copies — reject it here. It
# likewise drops build metadata when ordering, so "1.2.0+x" compares equal to
# "1.2.0"; a release stamped that way is invisible, so reject that here too.
SEMVER = re.compile(
    r"(?P<major>0|[1-9][0-9]*)\."
    r"(?P<minor>0|[1-9][0-9]*)\."
    r"(?P<patch>0|[1-9][0-9]*)"
    r"(?:-(?P<prerelease>"
    r"(?:0|[1-9][0-9]*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)"
    r"(?:\.(?:0|[1-9][0-9]*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*"
    r"))?"
    r"(?:\+(?P<build>[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?\Z"
)


class StampError(Exception):
    pass


setup = load_setup()


def validate_version(version: str) -> None:
    match = SEMVER.fullmatch(version)
    if match is None:
        raise StampError(
            f"invalid version {version!r}: must be SemVer (MAJOR.MINOR.PATCH, optional prerelease), e.g. 6.12.0"
        )
    if "-dev" in version.casefold():
        raise StampError(
            f'invalid version {version!r}: setup.py cannot order "-dev" '
            "versions, so installed copies would never compare as current — "
            "pick a different prerelease label"
        )
    if match.group("build") is not None:
        base = version.split("+", 1)[0]
        raise StampError(
            f"invalid version {version!r}: setup.py ignores build metadata when "
            f"ordering, so this compares equal to {base!r} and installed copies "
            "would never see the release — change the major, minor, patch, or "
            "prerelease part"
        )


def validate_manifest_requires(value: object, rel: str, modules: dict[str, str], table: str = "requires") -> None:
    """Shape is the runtime parser's job; this adds only the release-time rules."""
    if value is None:
        return
    for skill, entry in value.items():
        minimum = entry["version"]
        # setup.py drops build metadata when ordering, so "1.2.0+x" compares
        # equal to "1.2.0" and such a requirement could never be met.
        if "+" in minimum:
            raise StampError(
                f"{rel}: {table}.{skill}.version {minimum!r} carries build metadata, which setup.py ignores "
                f"when ordering; it would compare equal to {minimum.split('+', 1)[0]!r}"
            )
        # An explicit source means the skill lives elsewhere; without one the
        # requirement resolves against this repository, so a typo is catchable.
        if entry.get("source") is None and skill not in modules:
            raise StampError(
                f"{rel}: {table}.{skill} names no skill in this repository and gives no source to fetch it from"
            )


def validate_manifest_knowledge(value: object, skill_dir: Path, rel: str) -> list[PurePosixPath]:
    """Knowledge is a list of documents inside the skill that carries it."""
    if not isinstance(value, list) or not value:
        raise StampError(f"{rel}: knowledge must be a non-empty list of paths inside the skill")
    seen: list[PurePosixPath] = []
    for entry in value:
        if not isinstance(entry, str) or not entry:
            raise StampError(f"{rel}: knowledge has invalid value {entry!r}")
        relative = setup.safe_skill_relative(entry)
        if relative is None:
            raise StampError(f"{rel}: knowledge has unsafe value {entry!r}")
        if relative in seen:
            raise StampError(f"{rel}: knowledge repeats {entry!r}")
        seen.append(relative)
        document = skill_dir / Path(*relative.parts)
        if not document.is_file() or document.is_symlink():
            raise StampError(f"{rel}: knowledge names {entry!r}, which the skill does not ship as a plain file")
    return seen


def read_manifest_module(path: Path, rel: str) -> str:
    """Validate a skill manifest's exact schema and return its module."""
    try:
        raw = path.read_bytes()
        data = tomllib.loads(raw.decode("utf-8"))
    except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
        raise StampError(f"{rel}: cannot read manifest: {error}") from error
    # Anything the runtime refuses to parse must never reach a release.
    try:
        setup.parse_packaged_manifest(path, raw)
    except Exception as error:
        raise StampError(f"{rel}: the runtime parser rejects this manifest: {error}") from error
    keys = set(data)
    if not MANIFEST_KEYS <= keys or not keys <= MANIFEST_KEYS | OPTIONAL_MANIFEST_KEYS:
        raise StampError(
            f"{rel}: manifest keys must be {', '.join(sorted(MANIFEST_KEYS))} "
            f"plus optionally {', '.join(sorted(OPTIONAL_MANIFEST_KEYS))}; "
            f"found {', '.join(sorted(data)) or 'none'}"
        )
    module = data["module"]
    if module not in MODULES:
        raise StampError(f"{rel}: unknown module {module!r} (expected one of {', '.join(sorted(MODULES))})")
    if not isinstance(data["version"], str):
        raise StampError(f"{rel}: version must be a string")
    if data["update_source"] != UPDATE_SOURCE:
        raise StampError(f"{rel}: update_source must be exactly {UPDATE_SOURCE!r}; found {data['update_source']!r}")
    validate_manifest_knowledge(data["knowledge"], path.parent, rel)
    return module


def collect_skills(project_root: Path) -> tuple[list[Path], dict[str, str]]:
    """Return every skill's manifest path plus a skill-name -> module map."""
    skill_dirs = sorted(path for path in (project_root / "skills").glob("*") if path.is_dir())
    if not skill_dirs:
        raise StampError(f"no skills/*/{MANIFEST_NAME} found under {project_root} — run from a BMAD-METHOD checkout")
    manifests: list[Path] = []
    modules: dict[str, str] = {}
    for skill_dir in skill_dirs:
        manifest = skill_dir / MANIFEST_NAME
        rel = manifest.relative_to(project_root).as_posix()
        if not manifest.is_file():
            raise StampError(f"{skill_dir.relative_to(project_root).as_posix()}: missing {MANIFEST_NAME}")
        modules[skill_dir.name] = read_manifest_module(manifest, rel)
        manifests.append(manifest)
    # Needs the full skill list, so it runs once every manifest has been read.
    for manifest in manifests:
        rel = manifest.relative_to(project_root).as_posix()
        data = tomllib.loads(manifest.read_text(encoding="utf-8"))
        validate_manifest_requires(data.get("requires"), rel, modules)
        validate_manifest_requires(data.get("recommends"), rel, modules, "recommends")
    check_module_fields_agree(project_root, manifests, modules)
    check_knowledge_copies_agree(project_root, manifests)
    return manifests, modules


def check_module_fields_agree(project_root: Path, manifests: list[Path], modules: dict[str, str]) -> None:
    """Every module-level field must match across a module; knowledge, requires and recommends are per skill.

    Mirrors module_identity in skills/bmad/scripts/setup.py, which decides the
    same question at install time.
    """
    seen: dict[str, tuple[tuple[object, ...], str]] = {}
    for manifest in manifests:
        rel = manifest.relative_to(project_root).as_posix()
        try:
            fields = setup.module_identity(setup.parse_packaged_manifest(manifest, manifest.read_bytes()))
        except (OSError, Exception) as error:
            raise StampError(f"{rel}: cannot read manifest: {error}") from error
        module = modules[manifest.parent.name]
        first = seen.get(module)
        if first is None:
            seen[module] = (fields, rel)
        elif first[0] != fields:
            raise StampError(
                f"{rel}: module fields must match every manifest in module {module!r}; differs from {first[1]}"
            )


def check_knowledge_copies_agree(project_root: Path, manifests: list[Path]) -> None:
    """A document named by several skills is one document, so every copy must be identical."""
    seen: dict[tuple[str, str], tuple[bytes, str]] = {}
    for manifest in manifests:
        skill_dir = manifest.parent
        try:
            data = tomllib.loads(manifest.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
            raise StampError(
                f"{manifest.relative_to(project_root).as_posix()}: cannot read manifest: {error}"
            ) from error
        for relative in validate_manifest_knowledge(data["knowledge"], skill_dir, manifest.parent.name):
            path = skill_dir / Path(*relative.parts)
            rel = path.relative_to(project_root).as_posix()
            try:
                content = path.read_bytes()
            except OSError as error:
                raise StampError(f"{rel}: cannot read knowledge document: {error}") from error
            # Keyed on the module too: two modules may ship the same filename
            # with different content, and those are separate documents.
            key = (data["module"], relative.as_posix())
            first = seen.get(key)
            if first is None:
                seen[key] = (content, rel)
            elif first[0] != content:
                raise StampError(f"{rel}: knowledge document differs from {first[1]}; every copy must be identical")


def stamped_manifest_content(path: Path, rel: str, version: str) -> str:
    try:
        original = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise StampError(f"{rel}: cannot read manifest: {error}") from error
    lines = original.splitlines(keepends=True)
    matches = [index for index, line in enumerate(lines) if VERSION_LINE.match(line.rstrip("\n"))]
    if len(matches) != 1:
        raise StampError(f"{rel}: expected exactly one 'version = \"...\"' line, found {len(matches)}")
    lines[matches[0]] = f'version = "{version}"\n'
    return "".join(lines)


def verify_stamp(root: Path, manifests: list[Path], modules: dict[str, str], version: str) -> None:
    # Manifests: exact expected content, and identical within each module on
    # every field but knowledge (setup.py compares the same projection, since
    # skills of one module may carry different knowledge documents).
    reference_fields: dict[str, tuple[object, ...]] = {}
    reference_rel: dict[str, str] = {}
    for manifest in manifests:
        rel = manifest.relative_to(root).as_posix()
        module = modules[manifest.parent.name]
        try:
            data = tomllib.loads(manifest.read_bytes().decode("utf-8"))
        except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
            raise StampError(f"{rel}: cannot read manifest after stamping: {error}") from error
        expected = {
            "module": module,
            "version": version,
            "update_source": UPDATE_SOURCE,
            "knowledge": data.get("knowledge"),
        }
        for table in OPTIONAL_MANIFEST_KEYS:
            if data.get(table) is not None:
                expected[table] = data[table]
        if data != expected:
            raise StampError(
                f"{rel}: after stamping, manifest must be exactly "
                f"module={module!r}, version={version!r}, "
                f"update_source={UPDATE_SOURCE!r}, a 'knowledge' list, "
                "plus optional 'requires' and 'recommends' tables"
            )
        fields = setup.module_identity(setup.parse_packaged_manifest(manifest, manifest.read_bytes()))
        if module not in reference_fields:
            reference_fields[module] = fields
            reference_rel[module] = rel
        elif fields != reference_fields[module]:
            raise StampError(f"{rel}: module fields disagree with {reference_rel[module]} after stamping")
    check_knowledge_copies_agree(root, manifests)


def run(project_root: Path, version: str) -> int:
    try:
        validate_version(version)
        manifests, modules = collect_skills(project_root)

        # Phase 1: compute every new file content; nothing is written if any file fails.
        planned: list[tuple[Path, str]] = []
        for manifest in manifests:
            rel = manifest.relative_to(project_root).as_posix()
            planned.append((manifest, stamped_manifest_content(manifest, rel, version)))

        # Phase 2: write, then verify from disk.
        for path, content in planned:
            try:
                path.write_text(content, encoding="utf-8")
            except OSError as error:
                raise StampError(f"{path.relative_to(project_root).as_posix()}: cannot write: {error}") from error
        verify_stamp(project_root, manifests, modules, version)
    except StampError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Stamped version {version} into {len(planned)} files:")
    for path, _ in planned:
        print(f"  {path.relative_to(project_root).as_posix()}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Stamp a version into every skill manifest.")
    parser.add_argument("version", help='SemVer release version, e.g. "6.12.0"')
    args = parser.parse_args(argv)
    return run(PROJECT_ROOT, args.version)


if __name__ == "__main__":
    sys.exit(main())
