#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Release version stamper for the bmad-skills mirror.

Writes a human-supplied SemVer version into every skills/*/module-manifest.toml
(rewriting the `version = "..."` line textually so the manifests stay
byte-identical), then verifies the result. Used by tools/release.md to cut
a stamped release commit; never run on the unstamped `dev` branch itself.

The manifests are the only place the version lives. Plugin metadata
(Claude/Codex plugin.json, marketplace catalogs) is not stamped: whatever
builds those artifacts reads the version from skills/bmad/module-manifest.toml.

Nothing is written unless every manifest passes validation first. After
writing, the script re-reads every manifest and fails if they are not
byte-identical or any carries a different version.

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
VERSION_LINE = re.compile(r'^version\s*=\s*".*"\s*$')

# Mirrors the SEMVER regex in skills/bmad/scripts/setup.py. That script also
# refuses to order any version containing "-dev", so such a version can never
# compare as current or outdated for installed copies — reject it here.
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
    if SEMVER.fullmatch(version) is None:
        raise StampError(
            f"invalid version {version!r}: must be SemVer "
            "(MAJOR.MINOR.PATCH, optional prerelease/build), e.g. 6.12.0"
        )
    if "-dev" in version.casefold():
        raise StampError(
            f"invalid version {version!r}: setup.py cannot order \"-dev\" "
            "versions, so installed copies would never compare as current — "
            "pick a different prerelease label"
        )


def stamped_manifest_content(path: Path, rel: str, version: str) -> str:
    try:
        original = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise StampError(f"{rel}: cannot read manifest: {error}") from error
    lines = original.splitlines(keepends=True)
    matches = [index for index, line in enumerate(lines) if VERSION_LINE.match(line.rstrip("\n"))]
    if len(matches) != 1:
        raise StampError(
            f"{rel}: expected exactly one 'version = \"...\"' line, found {len(matches)}"
        )
    lines[matches[0]] = f'version = "{version}"\n'
    return "".join(lines)


def verify_stamp(root: Path, manifests: list[Path], version: str) -> None:
    def read_bytes(manifest: Path, rel: str) -> bytes:
        try:
            return manifest.read_bytes()
        except OSError as error:
            raise StampError(f"{rel}: cannot read manifest after stamping: {error}") from error

    reference_rel = manifests[0].relative_to(root).as_posix()
    reference_bytes = read_bytes(manifests[0], reference_rel)
    for manifest in manifests:
        rel = manifest.relative_to(root).as_posix()
        if read_bytes(manifest, rel) != reference_bytes:
            raise StampError(
                f"{rel}: manifest is not byte-identical to {reference_rel} after stamping"
            )
        try:
            data = tomllib.loads(manifest.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, tomllib.TOMLDecodeError) as error:
            raise StampError(f"{rel}: not valid TOML after stamping: {error}") from error
        if data.get("version") != version:
            raise StampError(f"{rel}: carries {data.get('version')!r}, expected {version!r}")


def run(project_root: Path, version: str) -> int:
    try:
        validate_version(version)

        manifests = sorted((project_root / "skills").glob(f"*/{MANIFEST_NAME}"))
        if not manifests:
            raise StampError(
                f"no skills/*/{MANIFEST_NAME} found under {project_root} — "
                "run from a bmad-skills checkout"
            )

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
                raise StampError(
                    f"{path.relative_to(project_root).as_posix()}: cannot write: {error}"
                ) from error
        verify_stamp(project_root, manifests, version)
    except StampError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print(f"Stamped version {version} into {len(planned)} files:")
    for path, _ in planned:
        print(f"  {path.relative_to(project_root).as_posix()}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Stamp a release version into every skill manifest and all plugin metadata."
    )
    parser.add_argument("version", help='SemVer release version, e.g. "6.12.0"')
    args = parser.parse_args(argv)
    return run(PROJECT_ROOT, args.version)


if __name__ == "__main__":
    sys.exit(main())
