#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["tiktoken"]
# ///
"""prepass: the deterministic pre-pass the review lenses read before opening any file.

One skill folder in, one JSON object out. Token counts come from count_tokens, path findings from
scan_paths and script findings from scan_scripts, all imported from this folder, so the numbers match
what each script prints on its own.

shape_hint is inferred, first match wins:
  memory-agent         `_bmad/memory` in SKILL.md, or scripts/wake.py or scripts/init-sanctum.py present
  agent                customize.toml has an [agent] table
  rendered-skill       SKILL.md calls render_skill.py
  single-skill-module  bmod.toml has both [bmod] and [skill]
  multi-skill-module   bmod.toml has [bmod] only (a module record)
  script-utility       scripts/ exists and SKILL.md is under 60 lines
  plain-skill          everything else; "unknown" when there is no SKILL.md

Usage:
  prepass.py <skill-folder>

Output, one JSON object on stdout:
  {"skill", "shape_hint", "files": [{"path", "tokens", "kind"}], "skill_md_tokens", "total_tokens",
   "has_customize", "has_scripts", "scripts": [{"path", "has_pep723", "has_test"}],
   "description_chars", "has_use_when", "frontmatter_ok", "bmod_kind", "path_findings": [...], "script_findings": [...]}
  kind is one of entry, prompt, script, test, asset, config, other.
  bmod_kind is none (no bmod.toml), skill (a module member), record (a record folder), record+skill (a
  single-skill module) or invalid (a file with neither table, or one that does not parse).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from count_tokens import count_tokens, iter_text_files, read_text  # noqa: E402
from init_skill import USE_WHEN_RE, parse_frontmatter  # noqa: E402
from scan_paths import scan_skill  # noqa: E402
from scan_scripts import scan_scripts  # noqa: E402

MEMORY_RE = re.compile(r"_bmad/memory")
SCRIPT_UTILITY_MAX_LINES = 60


def kind_of(rel: Path) -> str:
    parts = rel.parts
    if "assets" in parts[:-1]:
        return "asset"
    if parts[0] == "scripts":
        return "test" if "tests" in parts[1:-1] else "script"
    if rel.suffix == ".md":
        return "entry" if rel.name == "SKILL.md" and len(parts) == 1 else "prompt"
    if rel.suffix == ".toml":
        return "config"
    return "other"


def load_toml(path: Path) -> dict:
    try:
        return tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, tomllib.TOMLDecodeError, UnicodeDecodeError):
        return {}


def shape_hint(root: Path, skill_text: str | None) -> str:
    if skill_text is None:
        return "unknown"
    scripts = root / "scripts"
    if MEMORY_RE.search(skill_text) or (scripts / "wake.py").is_file() or (scripts / "init-sanctum.py").is_file():
        return "memory-agent"
    if "agent" in load_toml(root / "customize.toml"):
        return "agent"
    if "render_skill.py" in skill_text:
        return "rendered-skill"
    bmod = load_toml(root / "bmod.toml")
    if "bmod" in bmod:
        return "single-skill-module" if "skill" in bmod else "multi-skill-module"
    if scripts.is_dir() and len(skill_text.splitlines()) < SCRIPT_UTILITY_MAX_LINES:
        return "script-utility"
    return "plain-skill"


def bmod_kind(root: Path) -> str:
    manifest = root / "bmod.toml"
    if not manifest.is_file():
        return "none"
    data = load_toml(manifest)
    has_record = isinstance(data.get("bmod"), dict)
    has_skill = isinstance(data.get("skill"), dict)
    if has_record and has_skill:
        return "record+skill"
    if has_record:
        return "record"
    if has_skill:
        return "skill"
    return "invalid"


def build(root: Path) -> dict:
    skill_path = root / "SKILL.md"
    skill_text = read_text(skill_path) if skill_path.is_file() else None

    files = []
    skill_md_tokens = 0
    for path in iter_text_files(root):
        rel = path.relative_to(root)
        tokens, _ = count_tokens(read_text(path))
        files.append({"path": rel.as_posix(), "tokens": tokens, "kind": kind_of(rel)})
        if path == skill_path:
            skill_md_tokens = tokens

    meta = parse_frontmatter(skill_text)[0] if skill_text is not None else None
    description = (meta or {}).get("description", "")
    frontmatter_ok = bool(
        meta and meta.get("name") == root.name and description and set(meta) <= {"name", "description"}
    )

    scripts_result = scan_scripts(root)
    return {
        "skill": root.name,
        "shape_hint": shape_hint(root, skill_text),
        "files": files,
        "skill_md_tokens": skill_md_tokens,
        "total_tokens": sum(f["tokens"] for f in files),
        "has_customize": (root / "customize.toml").is_file(),
        "has_scripts": (root / "scripts").is_dir(),
        "scripts": [
            {"path": s["path"], "has_pep723": s["has_pep723"], "has_test": s["has_test"]}
            for s in scripts_result["scripts"]
        ],
        "description_chars": len(description),
        "has_use_when": bool(USE_WHEN_RE.search(description)),
        "frontmatter_ok": frontmatter_ok,
        "bmod_kind": bmod_kind(root),
        "path_findings": scan_skill(root)["findings"],
        "script_findings": scripts_result["findings"],
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("skill", type=Path, help="skill folder to analyze")
    args = p.parse_args(argv)
    root = args.skill.expanduser().resolve()
    if not root.is_dir():
        p.error(f"not a directory: {args.skill}")
    print(json.dumps(build(root), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
