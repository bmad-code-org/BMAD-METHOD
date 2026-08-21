#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Release version stamper for the bmad-skills mirror.

Writes a human-supplied SemVer version into every skill manifest and all
plugin metadata, then verifies the result. Used by tools/release.md to cut
a stamped release commit; never run on the unstamped `dev` branch itself.

Stamps:
- every skills/*/module-manifest.toml (rewrites the `version = "..."` line
  textually so the manifests stay byte-identical)
- .claude-plugin/marketplace.json (plugins[0].version)
- plugins/bmad-method/.claude-plugin/plugin.json (version)
- .codex-plugin/plugin.json (version)

The JSON files are validated by parsing, but the version value is replaced
textually so the files keep their prettier formatting (2-space indent,
one-line arrays, trailing newline) byte for byte.

Nothing is written unless every file passes validation first. After writing,
the script re-reads every file and fails if the manifests are not
byte-identical or any stamped file carries a different version.

Usage:
  uv run --python 3.11 tools/stamp_release.py 1.2.0
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

PROJECT_ROOT = Path(__file__).resolve().parent.parent

MANIFEST_NAME = "module-manifest.toml"
VERSION_LINE = re.compile(r'^version\s*=\s*".*"\s*$')
JSON_VERSION_KEY = re.compile(r'("version"\s*:\s*")([^"]*)(")')

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

# (relative path, key path into the parsed JSON)
JSON_TARGETS = (
    (".claude-plugin/marketplace.json", ("plugins", 0, "version")),
    ("plugins/bmad-method/.claude-plugin/plugin.json", ("version",)),
    (".codex-plugin/plugin.json", ("version",)),
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


def format_key_path(keys: tuple) -> str:
    text = ""
    for key in keys:
        text += f"[{key}]" if isinstance(key, int) else ("." if text else "") + str(key)
    return text


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


def stamped_json_content(path: Path, rel: str, keys: tuple, version: str) -> str:
    try:
        text = path.read_text(encoding="utf-8")
        data = json.loads(text)
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise StampError(f"{rel}: cannot read JSON: {error}") from error
    node = data
    for depth in range(len(keys) - 1):
        try:
            node = node[keys[depth]]
        except (KeyError, IndexError, TypeError) as error:
            raise StampError(
                f"{rel}: missing expected key {format_key_path(keys[: depth + 1])}"
            ) from error
    last = keys[-1]
    if not isinstance(node, dict) or not isinstance(node.get(last), str):
        raise StampError(f"{rel}: missing expected key {format_key_path(keys)}")
    # Replace the version value textually so the file keeps its formatting.
    if len(JSON_VERSION_KEY.findall(text)) != 1:
        raise StampError(
            f'{rel}: expected exactly one "version" key to rewrite for '
            f"{format_key_path(keys)}"
        )
    return JSON_VERSION_KEY.sub(rf"\g<1>{version}\g<3>", text, count=1)


def read_json_version(path: Path, rel: str, keys: tuple) -> str:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise StampError(f"{rel}: cannot read JSON after stamping: {error}") from error
    node = data
    for key in keys:
        try:
            node = node[key]
        except (KeyError, IndexError, TypeError) as error:
            raise StampError(
                f"{rel}: missing expected key {format_key_path(keys)} after stamping"
            ) from error
    if not isinstance(node, str):
        raise StampError(f"{rel}: missing expected key {format_key_path(keys)} after stamping")
    return node


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
    for rel, keys in JSON_TARGETS:
        found = read_json_version(root / rel, rel, keys)
        if found != version:
            raise StampError(f"{rel}: carries {found!r}, expected {version!r}")


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
        for rel, keys in JSON_TARGETS:
            path = project_root / rel
            planned.append((path, stamped_json_content(path, rel, keys, version)))

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
