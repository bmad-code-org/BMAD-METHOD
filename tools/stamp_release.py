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

Before writing anything it validates every manifest's exact schema: exactly
the keys module, version, update_source, and knowledge; module is a known
module, and update_source and knowledge each carry their one known value.
The `version = "..."` line is rewritten
textually, so manifests of the same module stay byte-identical (setup.py's
module discovery compares raw manifest bytes).

Nothing is written unless every file passes validation first. After writing,
the script re-reads every file and fails naming the offending path if
anything is off.

Usage:
  uv run --python 3.11 tools/stamp_release.py 1.2.0
"""

from __future__ import annotations

import argparse
import re
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

PROJECT_ROOT = Path(__file__).resolve().parent.parent

MANIFEST_NAME = "module-manifest.toml"

MODULES = frozenset({"method", "toolbox"})
UPDATE_SOURCE = "github:bmad-code-org/BMAD-METHOD/skills"
KNOWLEDGE = "`references/help.md` in the `bmad` skill"
MANIFEST_KEYS = frozenset({"module", "version", "update_source", "knowledge"})

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


def read_manifest_module(path: Path, rel: str) -> str:
    """Validate a skill manifest's exact schema and return its module."""
    try:
        data = tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
        raise StampError(f"{rel}: cannot read manifest: {error}") from error
    if set(data) != MANIFEST_KEYS:
        raise StampError(
            f"{rel}: manifest keys must be exactly "
            f"{', '.join(sorted(MANIFEST_KEYS))}; found {', '.join(sorted(data)) or 'none'}"
        )
    module = data["module"]
    if module not in MODULES:
        raise StampError(f"{rel}: unknown module {module!r} (expected one of {', '.join(sorted(MODULES))})")
    if not isinstance(data["version"], str):
        raise StampError(f"{rel}: version must be a string")
    if data["update_source"] != UPDATE_SOURCE:
        raise StampError(f"{rel}: update_source must be exactly {UPDATE_SOURCE!r}; found {data['update_source']!r}")
    if data["knowledge"] != KNOWLEDGE:
        raise StampError(f"{rel}: knowledge must be exactly {KNOWLEDGE!r}; found {data['knowledge']!r}")
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
    return manifests, modules


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
    # Manifests: exact expected content, and byte-identical within each module
    # (setup.py's module discovery compares raw manifest bytes).
    reference_bytes: dict[str, bytes] = {}
    reference_rel: dict[str, str] = {}
    for manifest in manifests:
        rel = manifest.relative_to(root).as_posix()
        module = modules[manifest.parent.name]
        try:
            raw = manifest.read_bytes()
            data = tomllib.loads(raw.decode("utf-8"))
        except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
            raise StampError(f"{rel}: cannot read manifest after stamping: {error}") from error
        expected = {
            "module": module,
            "version": version,
            "update_source": UPDATE_SOURCE,
            "knowledge": KNOWLEDGE,
        }
        if data != expected:
            raise StampError(
                f"{rel}: after stamping, manifest must be exactly "
                f"module={module!r}, version={version!r}, "
                f"update_source={UPDATE_SOURCE!r}, knowledge={KNOWLEDGE!r}"
            )
        if module not in reference_bytes:
            reference_bytes[module] = raw
            reference_rel[module] = rel
        elif raw != reference_bytes[module]:
            raise StampError(f"{rel}: manifest is not byte-identical to {reference_rel[module]} after stamping")


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
