#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""scan_legacy_module: parse an old-format BMad module so the migrate mode can convert it.

The old format described a module with a `module.yaml` (code, module_version, module_greeting, an optional
`agents` roster, and one block per config key with `prompt`, `default`, `result`, `user_setting`,
`single-select` or `multi-select`), a `module-help.csv` registry, and a `<code>-setup` skill (or an
`assets/module-setup.md` in a single-skill module) that merged both into `_bmad/config.yaml`,
`config.user.yaml` and `module-help.csv` with merge scripts. Some skills also carried a `bmad-manifest.json`
of capabilities. bmod.toml and help documents replace all of it. Skills read the v6 config as `{key}`
placeholders; v7 dropped some of those keys.

Usage:
  scan_legacy_module.py <module-folder>

Output, one JSON object on stdout; paths are relative to the module folder:
  {"module": {"code", "name", "version", "greeting", "agents": [...]},
   "config_keys": [{"key", "prompt", "default", "user_setting", "kind", "unconvertible": [...]}],
   "help_rows": [{"skill", ...the other CSV columns}],
   "skills": [folder names that hold a SKILL.md],
   "legacy_reads": [{"skill", "path", "line", "text"}],
   "legacy_placeholders": [{"skill", "file", "line", "placeholder"}],
   "setup_skill": name or null,
   "files_to_delete": [...]}

kind is text, single-select, multi-select or confirm. unconvertible lists what a bmod [[bmod.config_questions]]
entry (key, prompt, default, scope) cannot carry: select options, a result template, regex, required, example,
a boolean default.

legacy_reads lists every line that names _bmad/config.yaml, _bmad/<code>/config.yaml, config.user.yaml,
module.yaml, module-help.csv, module-setup.md, a bmad-*-setup skill or the module's own setup skill.
legacy_placeholders lists every `{key}` naming a v6 config value v7 does not provide (V6_ONLY_CONFIG_KEYS),
one entry per use. Both cover the .md, .toml, .yaml, .yml, .json and .py files outside files_to_delete.
Exit 0 on success, 1 when no module.yaml is found, 2 on a usage error.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path

import yaml

SKIP_DIRS = {".git", "__pycache__", "node_modules", ".venv", "venv", ".pytest_cache"}
MODULE_META_KEYS = {
    "code",
    "name",
    "header",
    "subheader",
    "description",
    "module_version",
    "default_selected",
    "module_greeting",
    "agents",
    "directories",
    "post-install-notes",
}
LEGACY_FILE_NAMES = {
    "module.yaml",
    "module-help.csv",
    "merge-config.py",
    "merge-help-csv.py",
    "cleanup-legacy.py",
    "bmad-manifest.json",
}
LEGACY_READ_RE = re.compile(
    r"_bmad/(?:[a-z0-9_-]+/)?config\.yaml|config\.user\.yaml|\bmodule\.yaml|module-help\.csv|module-setup\.md"
    r"|\bbmad-[a-z0-9-]+-setup\b"
)
SCANNED_SUFFIXES = {".md", ".toml", ".yaml", ".yml", ".json", ".py"}
# v6 config keys that v7 does not provide, with the v6 module that declared each. The list is
# V6_KEYS in skills/core-tools/bmad/scripts/migrate_v6.py, the answers `bmad setup` removes. v7
# provides core.project_name and core.output_folder (skills/core-tools/bmad/assets/config.template.toml),
# core.active_initiative (the bmad skill's initiative step), and each module's own
# [[bmod.config_questions]] as modules.<code>.<key>; placeholders for those are not legacy.
V6_ONLY_CONFIG_KEYS = {
    "user_name": "core",
    "communication_language": "core",
    "document_output_language": "core",
    "user_skill_level": "bmm",
    "planning_artifacts": "bmm",
    "implementation_artifacts": "bmm",
    "project_knowledge": "bmm",
}
PLACEHOLDER_RE = re.compile(r"\{(" + "|".join(V6_ONLY_CONFIG_KEYS) + r")\}")


def walk(root: Path):
    # Path order is case-insensitive on Windows; sort the POSIX string so output matches everywhere.
    for path in sorted(root.rglob("*"), key=lambda p: p.as_posix()):
        if path.is_file() and not any(part in SKIP_DIRS for part in path.relative_to(root).parts):
            yield path


def find_one(root: Path, name: str) -> Path | None:
    """The shallowest file with this name, or None."""
    matches = sorted((p for p in walk(root) if p.name == name), key=lambda p: (len(p.parts), p.as_posix()))
    return matches[0] if matches else None


def rel(root: Path, path: Path) -> str:
    return path.relative_to(root).as_posix()


def load_module_yaml(path: Path) -> dict:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    return data if isinstance(data, dict) else {}


def config_key(key: str, spec: dict) -> dict:
    reasons = []
    kind = "text"
    if "single-select" in spec:
        kind = "single-select"
        reasons.append("single-select options; ask as free text and name the choices in the prompt")
    elif "multi-select" in spec:
        kind = "multi-select"
        reasons.append("multi-select options; a bmod answer is one scalar")
    elif isinstance(spec.get("default"), bool):
        kind = "confirm"
        reasons.append("boolean default; store the answer as a string or drop the question")
    result = spec.get("result")
    if isinstance(result, str) and result not in ("{value}", ""):
        reasons.append(f"result template {result!r}; fold it into the default and the skill that reads it")
    for extra in ("regex", "required", "example"):
        if extra in spec:
            reasons.append(f"{extra} has no bmod equivalent")
    return {
        "key": key,
        "prompt": spec.get("prompt", ""),
        "default": spec.get("default"),
        "user_setting": spec.get("user_setting") is True,
        "kind": kind,
        "unconvertible": reasons,
    }


def read_help_rows(path: Path | None) -> list[dict]:
    if path is None:
        return []
    with path.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    return [
        {"skill": row.get("skill", ""), **{k: v for k, v in row.items() if k != "skill" and k is not None}}
        for row in rows
    ]


def skill_dirs(root: Path) -> list[Path]:
    return sorted({p.parent for p in walk(root) if p.name == "SKILL.md"}, key=lambda p: p.as_posix())


def skill_of(root: Path, path: Path, skills: list[Path]) -> str:
    for skill in sorted(skills, key=lambda p: -len(p.parts)):
        if skill == path.parent or skill in path.parents:
            return skill.name
    return root.name


def scan(root: Path) -> dict | None:
    module_yaml = find_one(root, "module.yaml")
    if module_yaml is None:
        return None
    meta = load_module_yaml(module_yaml)
    help_csv = find_one(root, "module-help.csv")
    skills = skill_dirs(root)

    setup_skill = next((s.name for s in skills if s.name.endswith("-setup")), None)
    module_setup = find_one(root, "module-setup.md")

    to_delete: set[str] = set()
    for path in walk(root):
        if path.name in LEGACY_FILE_NAMES:
            to_delete.add(rel(root, path))
    if setup_skill:
        setup_dir = next(s for s in skills if s.name == setup_skill)
        to_delete = {p for p in to_delete if not p.startswith(rel(root, setup_dir) + "/")}
        to_delete.add(rel(root, setup_dir) + "/")
    if module_setup is not None:
        to_delete.add(rel(root, module_setup))

    own_keys = {k for k, v in meta.items() if k not in MODULE_META_KEYS and isinstance(v, dict) and "prompt" in v}
    code = str(meta.get("code", ""))
    # A key the module declares itself becomes its own config question, unless it is the v6 module that lost it.
    legacy_keys = {k for k, owner in V6_ONLY_CONFIG_KEYS.items() if k not in own_keys or owner == code}
    read_re = LEGACY_READ_RE
    if setup_skill:
        read_re = re.compile(f"{LEGACY_READ_RE.pattern}|\\b{re.escape(setup_skill)}\\b")

    reads = []
    placeholders = []
    for path in walk(root):
        if path.suffix not in SCANNED_SUFFIXES:
            continue
        relative = rel(root, path)
        if relative in to_delete or any(relative.startswith(d) for d in to_delete if d.endswith("/")):
            continue
        skill = skill_of(root, path, skills)
        for number, line in enumerate(path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            if read_re.search(line):
                reads.append({"skill": skill, "path": relative, "line": number, "text": line.strip()[:200]})
            for match in PLACEHOLDER_RE.finditer(line):
                if match.group(1) in legacy_keys:
                    placeholders.append(
                        {"skill": skill, "file": relative, "line": number, "placeholder": match.group(0)}
                    )

    greeting = meta.get("module_greeting", "")
    return {
        "module": {
            "code": meta.get("code", ""),
            "name": meta.get("name", ""),
            "version": str(meta.get("module_version", "")),
            "greeting": greeting.strip() if isinstance(greeting, str) else "",
            "agents": meta.get("agents") if isinstance(meta.get("agents"), list) else [],
        },
        "config_keys": [config_key(k, v) for k, v in meta.items() if k in own_keys],
        "help_rows": read_help_rows(help_csv),
        "skills": [s.name for s in skills if s.name != setup_skill],
        "legacy_reads": reads,
        "legacy_placeholders": placeholders,
        "setup_skill": setup_skill,
        "files_to_delete": sorted(to_delete),
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("module", type=Path, help="old-format module folder")
    args = p.parse_args(argv)
    if not args.module.is_dir():
        p.error(f"not a directory: {args.module}")
    result = scan(args.module)
    if result is None:
        print(f"scan_legacy_module: no module.yaml under {args.module}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
