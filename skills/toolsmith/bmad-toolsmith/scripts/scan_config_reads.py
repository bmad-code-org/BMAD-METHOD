#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""scan_config_reads: compare a module's config reads with the config questions its record asks.

A record is a bmod.toml whose [bmod] table has a code: `bmod-<code>/bmod.toml` in a multi-skill module, or
the skill's own bmod.toml in a single-skill module. Its questions are the `key` of each
[[bmod.config_questions]] entry; `bmad setup` stores each answer as modules.<code>.<key>. A member reads one
as `resolve_config.py ... --key modules.<code>.<key>` (or `-k`), in any .md, .toml, .yaml, .yml or .py file
of its folder, tests excluded; `--key modules.<code>` reads the whole table, so every question of that code.
The flag and its value may sit on separate lines, as in a Python argv list (`"--key",` then
`"modules.<code>.<key>",`). Reads of core.* keys, and of modules whose record is not in the folder, are
not compared.

Usage:
  scan_config_reads.py <module-folder>

  The folder is the module's folder (the record folder and its members side by side) or a single-skill
  module's own folder.

Output, one JSON object on stdout; paths are relative to the module folder:
  {"records": [{"code", "path", "questions": [key, ...]}],
   "unasked": [{"skill", "file", "line", "key"}],
   "unread": [{"key"}]}

  unasked: a member reads modules.<code>.<key> and the record for <code> asks no question with that key;
  line is the line of the --key flag.
  unread: the record asks a question no member reads. key is the full modules.<code>.<key>.

Exit 0 on success, findings included; 1 when the folder holds no record or a bmod.toml does not parse;
2 on a usage error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

SKIP_DIRS = {".git", "__pycache__", "node_modules", ".venv", "venv", ".pytest_cache", "tests"}
SCANNED_SUFFIXES = {".md", ".toml", ".yaml", ".yml", ".py"}
# The separator spans newlines, quotes and commas so a key split across an argv list still matches.
READ_RE = re.compile(
    r"(?<![\w-])(?:--key|-k)[\s=,\"']+modules\.([a-z0-9][a-z0-9-]*)(?:\.([A-Za-z0-9_]+))?(?![\w-]|\.\w)"
)


def files_under(folder: Path):
    for path in sorted(folder.rglob("*"), key=lambda p: p.as_posix()):
        if path.is_file() and not any(part in SKIP_DIRS for part in path.relative_to(folder).parts):
            yield path


def skill_folders(root: Path) -> list[Path]:
    """The folder itself when it is a skill, else its child folders that are."""
    if (root / "SKILL.md").is_file():
        return [root]
    return sorted((p for p in root.iterdir() if p.is_dir() and (p / "SKILL.md").is_file()), key=lambda p: p.as_posix())


def load_manifest(path: Path) -> dict:
    try:
        return tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, tomllib.TOMLDecodeError) as error:
        raise SystemExit(f"scan_config_reads: {path} does not parse: {error}") from None


def scan(root: Path) -> dict | None:
    records: dict[str, dict] = {}
    members: list[Path] = []
    for folder in skill_folders(root):
        manifest = folder / "bmod.toml"
        data = load_manifest(manifest) if manifest.is_file() else {}
        bmod = data.get("bmod")
        if isinstance(bmod, dict) and bmod.get("code"):
            questions = bmod.get("config_questions") if isinstance(bmod.get("config_questions"), list) else []
            records[str(bmod["code"])] = {
                "code": str(bmod["code"]),
                "path": manifest.relative_to(root).as_posix(),
                "questions": [str(q["key"]) for q in questions if isinstance(q, dict) and q.get("key")],
            }
            if "skill" not in data:
                continue  # a multi-skill record folder holds no member reads
        members.append(folder)
    if not records:
        return None

    unasked = []
    read_keys: set[str] = set()
    for folder in members:
        for path in files_under(folder):
            if path.suffix not in SCANNED_SUFFIXES:
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            for match in READ_RE.finditer(text):
                code, key = match.groups()
                if code not in records:
                    continue
                if key is None:
                    read_keys.update(f"modules.{code}.{q}" for q in records[code]["questions"])
                    continue
                full = f"modules.{code}.{key}"
                read_keys.add(full)
                if key not in records[code]["questions"]:
                    unasked.append(
                        {
                            "skill": folder.name,
                            "file": path.relative_to(root).as_posix(),
                            "line": text.count("\n", 0, match.start()) + 1,
                            "key": full,
                        }
                    )

    unread = [
        {"key": f"modules.{code}.{key}"}
        for code, record in sorted(records.items())
        for key in record["questions"]
        if f"modules.{code}.{key}" not in read_keys
    ]
    return {"records": list(records.values()), "unasked": unasked, "unread": unread}


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("module", type=Path, help="the module folder, or a single-skill module's folder")
    args = p.parse_args(argv)
    if not args.module.is_dir():
        p.error(f"not a directory: {args.module}")
    result = scan(args.module)
    if result is None:
        print(f"scan_config_reads: no bmod.toml with a [bmod] code under {args.module}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
