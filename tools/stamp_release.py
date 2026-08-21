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
  textually, so manifests of the same module stay byte-identical)
- .claude-plugin/marketplace.json (the version of every entry in plugins[])
- .codex-plugin/plugin.json (version)

Before writing anything it validates the whole distribution shape:
- every skills/* directory has a manifest with exactly the keys module,
  version, and update_source; module is a known module and update_source
  is the one known source
- the Claude marketplace has exactly one plugin entry per module, and each
  entry's skills list names exactly the skills whose manifest carries that
  entry's module — no orphans, no double-shipping, no dangling paths

The JSON files are validated by parsing, but the version values are replaced
textually so the files keep their prettier formatting. After each rewrite the
result is re-parsed and compared against the original tree with only the
intended version nodes changed, so a stray "version" elsewhere in the file
can never be stamped by mistake.

Nothing is written unless every file passes validation first. After writing,
the script re-reads every file and fails naming the offending path if
anything is off.

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
MARKETPLACE_REL = ".claude-plugin/marketplace.json"
CODEX_PLUGIN_REL = ".codex-plugin/plugin.json"

# Claude marketplace entry name -> module key in module-manifest.toml.
PLUGIN_MODULES = {"bmad-bmm": "bmm", "bmad-tools": "tools"}
UPDATE_SOURCE = "github:bmad-code-org/bmad-skills/skills"
MANIFEST_KEYS = frozenset({"module", "version", "update_source"})
SKILL_PATH_PREFIX = "./skills/"

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
    if module not in PLUGIN_MODULES.values():
        raise StampError(
            f"{rel}: unknown module {module!r} "
            f"(expected one of {', '.join(sorted(PLUGIN_MODULES.values()))})"
        )
    if not isinstance(data["version"], str):
        raise StampError(f"{rel}: version must be a string")
    if data["update_source"] != UPDATE_SOURCE:
        raise StampError(
            f"{rel}: update_source must be exactly {UPDATE_SOURCE!r}; "
            f"found {data['update_source']!r}"
        )
    return module


def collect_skills(project_root: Path) -> tuple[list[Path], dict[str, str]]:
    """Return every skill's manifest path plus a skill-name -> module map."""
    skill_dirs = sorted(
        path for path in (project_root / "skills").glob("*") if path.is_dir()
    )
    if not skill_dirs:
        raise StampError(
            f"no skills/*/{MANIFEST_NAME} found under {project_root} — "
            "run from a bmad-skills checkout"
        )
    manifests: list[Path] = []
    modules: dict[str, str] = {}
    for skill_dir in skill_dirs:
        manifest = skill_dir / MANIFEST_NAME
        rel = manifest.relative_to(project_root).as_posix()
        if not manifest.is_file():
            raise StampError(
                f"{skill_dir.relative_to(project_root).as_posix()}: missing {MANIFEST_NAME}"
            )
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


def marketplace_entries(data: object, rel: str) -> list[dict]:
    plugins = data.get("plugins") if isinstance(data, dict) else None
    if not isinstance(plugins, list) or not plugins:
        raise StampError(f"{rel}: expected a non-empty plugins array")
    return plugins


def check_marketplace_partition(entries: list[dict], modules: dict[str, str], rel: str) -> None:
    """Each entry's skills list must name exactly the skills whose manifest
    carries that entry's module."""
    names = [entry.get("name") if isinstance(entry, dict) else None for entry in entries]
    if sorted(name for name in names if isinstance(name, str)) != sorted(PLUGIN_MODULES) or len(
        names
    ) != len(PLUGIN_MODULES):
        raise StampError(
            f"{rel}: plugin entries must be exactly {', '.join(sorted(PLUGIN_MODULES))}; "
            f"found {', '.join(str(name) for name in names)}"
        )
    for entry in entries:
        name = entry["name"]
        module = PLUGIN_MODULES[name]
        skills = entry.get("skills")
        if not isinstance(skills, list) or not all(isinstance(item, str) for item in skills):
            raise StampError(f"{rel}: {name}: skills must be an array of strings")
        listed: set[str] = set()
        for item in skills:
            if not item.startswith(SKILL_PATH_PREFIX) or "/" in item[len(SKILL_PATH_PREFIX):]:
                raise StampError(
                    f"{rel}: {name}: skill path {item!r} must be {SKILL_PATH_PREFIX}<skill>"
                )
            skill = item[len(SKILL_PATH_PREFIX):]
            if skill in listed:
                raise StampError(f"{rel}: {name}: lists {item!r} twice")
            listed.add(skill)
        # Claude Code treats an empty skills list as "not specified" and falls
        # back to scanning the source's skills/ tree — with source "./" that
        # would silently ship every skill.
        if not listed and entry.get("source") == "./":
            raise StampError(
                f"{rel}: {name} has no skills but source \"./\" — Claude Code would "
                "fall back to scanning skills/; point source at an empty directory"
            )
        expected = {skill for skill, skill_module in modules.items() if skill_module == module}
        for skill in sorted(expected - listed):
            raise StampError(
                f"{rel}: {name} must list {SKILL_PATH_PREFIX}{skill} — its manifest "
                f"says module \"{module}\""
            )
        for skill in sorted(listed - expected):
            if skill not in modules:
                raise StampError(
                    f"{rel}: {name} lists {SKILL_PATH_PREFIX}{skill}, which does not exist"
                )
            raise StampError(
                f"{rel}: {name} lists {SKILL_PATH_PREFIX}{skill}, whose manifest "
                f"says module \"{modules[skill]}\""
            )


def stamped_marketplace_content(
    path: Path, rel: str, modules: dict[str, str], version: str
) -> str:
    text, data = load_json(path, rel)
    entries = marketplace_entries(data, rel)
    check_marketplace_partition(entries, modules, rel)
    key_paths = [("plugins", index, "version") for index in range(len(entries))]
    return rewrite_versions(rel, text, data, key_paths, version)


def read_json_after_stamp(path: Path, rel: str) -> object:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        raise StampError(f"{rel}: cannot read JSON after stamping: {error}") from error


def verify_stamp(
    root: Path, manifests: list[Path], modules: dict[str, str], version: str
) -> None:
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
        expected = {"module": module, "version": version, "update_source": UPDATE_SOURCE}
        if data != expected:
            raise StampError(
                f"{rel}: after stamping, manifest must be exactly "
                f"module={module!r}, version={version!r}, update_source={UPDATE_SOURCE!r}"
            )
        if module not in reference_bytes:
            reference_bytes[module] = raw
            reference_rel[module] = rel
        elif raw != reference_bytes[module]:
            raise StampError(
                f"{rel}: manifest is not byte-identical to {reference_rel[module]} "
                "after stamping"
            )
    marketplace = read_json_after_stamp(root / MARKETPLACE_REL, MARKETPLACE_REL)
    for index, entry in enumerate(marketplace_entries(marketplace, MARKETPLACE_REL)):
        found = entry.get("version") if isinstance(entry, dict) else None
        if found != version:
            raise StampError(
                f"{MARKETPLACE_REL}: plugins[{index}].version carries {found!r}, "
                f"expected {version!r}"
            )
    codex = read_json_after_stamp(root / CODEX_PLUGIN_REL, CODEX_PLUGIN_REL)
    found = codex.get("version") if isinstance(codex, dict) else None
    if found != version:
        raise StampError(f"{CODEX_PLUGIN_REL}: carries {found!r}, expected {version!r}")


def run(project_root: Path, version: str) -> int:
    try:
        validate_version(version)
        manifests, modules = collect_skills(project_root)

        # Phase 1: compute every new file content; nothing is written if any file fails.
        planned: list[tuple[Path, str]] = []
        for manifest in manifests:
            rel = manifest.relative_to(project_root).as_posix()
            planned.append((manifest, stamped_manifest_content(manifest, rel, version)))
        marketplace_path = project_root / MARKETPLACE_REL
        planned.append(
            (
                marketplace_path,
                stamped_marketplace_content(marketplace_path, MARKETPLACE_REL, modules, version),
            )
        )
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
        verify_stamp(project_root, manifests, modules, version)
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
