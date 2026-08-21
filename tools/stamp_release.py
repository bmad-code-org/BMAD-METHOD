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
- .claude-plugin/marketplace.json (the version of every entry in plugins[])
- every plugins/*/.claude-plugin/plugin.json (version)
- .codex-plugin/plugin.json (version)

The marketplace must list exactly as many plugins as there are
plugins/*/.claude-plugin/plugin.json files.

The JSON files are validated by parsing, but the version values are replaced
textually so the files keep their prettier formatting (2-space indent,
one-line arrays, trailing newline) byte for byte. After each rewrite the
result is re-parsed and compared against the original tree with only the
intended version nodes changed, so a stray "version" elsewhere in the file
can never be stamped by mistake.

Nothing is written unless every file passes validation first. After writing,
the script re-reads every file and fails if the manifests are not
byte-identical or any stamped file carries a different version.

Usage:
  uv run --python 3.11 tools/stamp_release.py 1.2.0
"""

from __future__ import annotations

import argparse
import copy
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

MARKETPLACE_REL = ".claude-plugin/marketplace.json"
CODEX_PLUGIN_REL = ".codex-plugin/plugin.json"
CLAUDE_PLUGIN_GLOB = "plugins/*/.claude-plugin/plugin.json"


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


def load_json(path: Path, rel: str) -> tuple[str, object]:
    try:
        text = path.read_text(encoding="utf-8")
        return text, json.loads(text)
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise StampError(f"{rel}: cannot read JSON: {error}") from error


def check_version_node(data: object, keys: tuple, rel: str) -> None:
    node = data
    for depth in range(len(keys) - 1):
        try:
            node = node[keys[depth]]
        except (KeyError, IndexError, TypeError) as error:
            raise StampError(
                f"{rel}: missing expected key {format_key_path(keys[: depth + 1])}"
            ) from error
    if not isinstance(node, dict) or not isinstance(node.get(keys[-1]), str):
        raise StampError(f"{rel}: missing expected key {format_key_path(keys)}")


def rewrite_versions(rel: str, text: str, data: object, key_paths: list[tuple], version: str) -> str:
    """Textually rewrite every "version" value in `text`, then prove against
    the parsed tree that exactly the nodes in `key_paths` changed."""
    for keys in key_paths:
        check_version_node(data, keys, rel)
    occurrences = len(JSON_VERSION_KEY.findall(text))
    if occurrences != len(key_paths):
        raise StampError(
            f'{rel}: found {occurrences} "version" keys, expected exactly '
            f"{len(key_paths)} ({', '.join(format_key_path(keys) for keys in key_paths)})"
        )
    stamped = JSON_VERSION_KEY.sub(rf"\g<1>{version}\g<3>", text)
    expected = copy.deepcopy(data)
    for keys in key_paths:
        node = expected
        for key in keys[:-1]:
            node = node[key]
        node[keys[-1]] = version
    if json.loads(stamped) != expected:
        raise StampError(
            f"{rel}: rewrite would change JSON outside the intended version keys "
            f"({', '.join(format_key_path(keys) for keys in key_paths)})"
        )
    return stamped


def stamped_plugin_json_content(path: Path, rel: str, version: str) -> str:
    text, data = load_json(path, rel)
    return rewrite_versions(rel, text, data, [("version",)], version)


def stamped_marketplace_content(path: Path, rel: str, version: str) -> tuple[str, int]:
    text, data = load_json(path, rel)
    plugins = data.get("plugins") if isinstance(data, dict) else None
    if not isinstance(plugins, list) or not plugins:
        raise StampError(f"{rel}: expected a non-empty plugins array")
    key_paths = [("plugins", index, "version") for index in range(len(plugins))]
    return rewrite_versions(rel, text, data, key_paths, version), len(plugins)


def read_json_after_stamp(path: Path, rel: str) -> object:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise StampError(f"{rel}: cannot read JSON after stamping: {error}") from error


def verify_stamp(root: Path, manifests: list[Path], claude_plugins: list[Path], version: str) -> None:
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
    marketplace = read_json_after_stamp(root / MARKETPLACE_REL, MARKETPLACE_REL)
    entries = marketplace.get("plugins") if isinstance(marketplace, dict) else None
    if not isinstance(entries, list) or not entries:
        raise StampError(f"{MARKETPLACE_REL}: expected a non-empty plugins array after stamping")
    for index, entry in enumerate(entries):
        found = entry.get("version") if isinstance(entry, dict) else None
        if found != version:
            raise StampError(
                f"{MARKETPLACE_REL}: plugins[{index}].version carries {found!r}, "
                f"expected {version!r}"
            )
    plugin_rels = (CODEX_PLUGIN_REL, *(p.relative_to(root).as_posix() for p in claude_plugins))
    for rel in plugin_rels:
        data = read_json_after_stamp(root / rel, rel)
        found = data.get("version") if isinstance(data, dict) else None
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
        marketplace_path = project_root / MARKETPLACE_REL
        marketplace_content, entry_count = stamped_marketplace_content(
            marketplace_path, MARKETPLACE_REL, version
        )
        claude_plugins = sorted(project_root.glob(CLAUDE_PLUGIN_GLOB))
        if entry_count != len(claude_plugins):
            raise StampError(
                f"{MARKETPLACE_REL} lists {entry_count} plugins but found "
                f"{len(claude_plugins)} {CLAUDE_PLUGIN_GLOB}"
            )
        planned.append((marketplace_path, marketplace_content))
        for path in claude_plugins:
            rel = path.relative_to(project_root).as_posix()
            planned.append((path, stamped_plugin_json_content(path, rel, version)))
        codex_path = project_root / CODEX_PLUGIN_REL
        planned.append(
            (codex_path, stamped_plugin_json_content(codex_path, CODEX_PLUGIN_REL, version))
        )

        # Phase 2: write, then verify from disk.
        for path, content in planned:
            try:
                path.write_text(content, encoding="utf-8")
            except OSError as error:
                raise StampError(
                    f"{path.relative_to(project_root).as_posix()}: cannot write: {error}"
                ) from error
        verify_stamp(project_root, manifests, claude_plugins, version)
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
