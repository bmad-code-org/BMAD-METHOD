#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Release version stamper for BMAD-METHOD.

Writes a human-supplied SemVer version into every module record: the
`version` line inside the `[bmod]` table of each skills/*/bmod.toml that has
one. Member skills carry no version and are not written. Used by
tools/release.md to stamp releases and the next placeholder on `dev`.
The Claude and Codex plugins are built from the stamped tree by
bmad-code-org/bmad-plugins.

Before writing anything it runs the repository checks in
tools/validate_manifests.py, the same ones pre-commit and CI run.

A file may carry keys and tables this script does not know. The runtime
ignores them, so a release must not refuse them; they are left exactly as
written. The version line is rewritten textually, so nothing else in a file
moves, and each new file is parsed and compared before anything is written.

After writing, the script re-reads every file and fails naming the offending
path if anything is off.

Usage:
  uv run --python 3.11 tools/stamp_release.py 1.2.0
"""

from __future__ import annotations

import argparse
import importlib.util
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class StampError(Exception):
    pass


def load_validator():
    """The repository checks, so a release and a commit can never be held to different rules."""
    path = Path(__file__).resolve().parent / "validate_manifests.py"
    spec = importlib.util.spec_from_file_location("bmad_validate_for_stamp", path)
    if spec is None or spec.loader is None:
        raise StampError(f"cannot load the repository checks at {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


validator = load_validator()
setup = validator.setup


def validate_version(version: str) -> None:
    match = setup.SEMVER.fullmatch(version)
    if match is None:
        raise StampError(
            f"invalid version {version!r}: must be SemVer (MAJOR.MINOR.PATCH, optional prerelease), e.g. 6.12.0"
        )
    # setup.py refuses to order any version containing "-dev".
    if "-dev" in version.casefold():
        raise StampError(
            f'invalid version {version!r}: setup.py cannot order "-dev" '
            "versions, so an installed module would never compare as current — "
            "pick a different prerelease label"
        )
    # setup.py drops build metadata when ordering, so "1.2.0+x" compares equal to "1.2.0".
    if match.group("build") is not None:
        base = version.split("+", 1)[0]
        raise StampError(
            f"invalid version {version!r}: setup.py ignores build metadata when "
            f"ordering, so this compares equal to {base!r} and an installed module "
            "would never see the release — change the major, minor, patch, or "
            "prerelease part"
        )


def collect_records(project_root: Path) -> list[Path]:
    report = validator.check_repo(project_root)
    if report.problems:
        raise StampError("\n  ".join(report.problems))
    return list(report.records)


def read_toml(path: Path, rel: str) -> tuple[str, dict[str, object]]:
    try:
        text = path.read_bytes().decode("utf-8")
        return text, tomllib.loads(text)
    except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
        raise StampError(f"{rel}: cannot read bmod file: {error}") from error


def verify_stamp(root: Path, records: list[Path], expected: dict[str, dict[str, object]]) -> None:
    for record in records:
        rel = record.relative_to(root).as_posix()
        _, data = read_toml(record, rel)
        if data != expected[rel]:
            raise StampError(f"{rel}: stamping changed something other than the version")
    collect_records(root)


def run(project_root: Path, version: str) -> int:
    try:
        validate_version(version)
        records = collect_records(project_root)

        # Nothing is written if any file fails.
        planned: list[tuple[Path, str]] = []
        expected: dict[str, dict[str, object]] = {}
        for record in records:
            rel = record.relative_to(project_root).as_posix()
            original, data = read_toml(record, rel)
            try:
                planned.append((record, validator.stamp_text(original, version)))
            except ValueError as error:
                raise StampError(f"{rel}: {error}") from error
            expected[rel] = validator.with_version(data, version)

        for path, content in planned:
            try:
                path.write_bytes(content.encode("utf-8"))
            except OSError as error:
                raise StampError(f"{path.relative_to(project_root).as_posix()}: cannot write: {error}") from error
        verify_stamp(project_root, records, expected)
    except StampError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Stamped version {version} into {len(planned)} files:")
    for path, _ in planned:
        print(f"  {path.relative_to(project_root).as_posix()}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Stamp a version into every module record.")
    parser.add_argument("version", help='SemVer release version, e.g. "6.12.0"')
    parser.add_argument(
        "--project-root", type=Path, default=PROJECT_ROOT, help="repository to stamp (default: this one)"
    )
    args = parser.parse_args(argv)
    return run(args.project_root.resolve(), args.version)


if __name__ == "__main__":
    sys.exit(main())
