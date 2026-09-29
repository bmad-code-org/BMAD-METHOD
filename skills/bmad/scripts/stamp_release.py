#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Release version stamper for module repositories.

Writes a human-supplied SemVer version into every module record: the
`version` line inside the `[bmod]` table of each skills/*/bmod.toml that has
one. Member skills carry no version and are not written. Each module
repository's release runbook uses it to stamp releases and the next
placeholder on `dev`.

Before writing anything it runs the repository checks in
validate_manifests.py beside it, the same ones pre-commit and CI run.
`--check` runs only those checks and writes nothing.

A file may carry keys and tables this script does not know. The runtime
ignores them, so a release must not refuse them; they are left exactly as
written. The version line is rewritten textually, so nothing else in a file
moves, and each new file is parsed and compared before anything is written.

After writing, the script re-reads every file and fails naming the offending
path if anything is off.

Usage:
  uv run --python 3.11 skills/bmad/scripts/stamp_release.py 1.2.0 [--project-root <path>]
  uv run --python 3.11 skills/bmad/scripts/stamp_release.py --check [--project-root <path>]
"""

from __future__ import annotations

import argparse
import importlib.util
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True


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
    problem = validator.version_problem(version)
    if problem is not None:
        raise StampError(problem)


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
    parser.add_argument("version", nargs="?", help='SemVer release version, e.g. "6.12.0"')
    parser.add_argument("--check", action="store_true", help="run the repository checks and write nothing")
    parser.add_argument(
        "--project-root", type=Path, default=Path.cwd(), help="repository to stamp (default: the current directory)"
    )
    args = parser.parse_args(argv)
    if args.check == (args.version is not None):
        parser.error("give a version to stamp, or --check, but not both")
    if args.check:
        return validator.main(["--project-root", str(args.project_root)])
    return run(args.project_root.resolve(), args.version)


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
