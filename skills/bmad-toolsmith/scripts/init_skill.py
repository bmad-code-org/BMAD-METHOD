#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""init_skill: scaffold a new skill folder, or check an existing one.

Create:
  init_skill.py --name <kebab> --dest <folder> --shape <shape> [--dirs references,scripts,assets]
                [--bmod <record-folder-name>] [--source <update_source>] [--description "..."]

  Shapes: plain-skill, script-utility, rendered-skill, agent, memory-agent, single-skill-module,
  multi-skill-module. Writes <dest>/<name>/SKILL.md (frontmatter `name` and `description`, the given
  description or a [TODO: ...] placeholder, and an empty body heading), the requested dirs, and bmod.toml
  when --bmod is given or the shape is a module:
    - with --bmod: a [skill] table carrying `bmod` and `source`
    - single-skill-module: [bmod] with code (the name without its bmad- prefix), version = "0.1.0" and
      update_source, plus an empty [skill]
    - multi-skill-module: the module record, a bmod- folder with [bmod] only (code, version, update_source,
      skills = []) and the fixed record description
  Never writes module.yaml or a setup skill. Refuses a target folder that already exists.

Check:
  init_skill.py --check <skill-folder> [--any-name]

  Verifies SKILL.md exists, the frontmatter has only `name` and `description`, the name matches the folder
  and the bmad regex (bmod- for a module record; any kebab name with --any-name), the description is at
  most 1024 characters and contains "Use when" or "Use if" (a record carries the fixed text instead), the
  body is not empty, no `[TODO:` is left in any text file, and bmod.toml, when present, parses and carries
  [skill] or [bmod]. "bmod" in the output is absent, ok or invalid.

Output: one JSON object on stdout. Create: {"ok", "skill", "dir", "shape", "created": [...]}.
Check: {"ok", "skill", "bmod", "findings": [{"path", "line", "rule", "text", "fix"}, ...]}.
Exit 0 on success or a clean check, 1 on a failed check or a refused create, 2 on a usage error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

SHAPES = (
    "plain-skill",
    "script-utility",
    "rendered-skill",
    "agent",
    "memory-agent",
    "single-skill-module",
    "multi-skill-module",
)
KNOWN_DIRS = ("references", "scripts", "assets", "help", "evals")
KEBAB_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
BMAD_NAME_RE = re.compile(r"^(?:bmad|bmad-[a-z0-9]+(?:-[a-z0-9]+)*)$")
RECORD_NAME_RE = re.compile(r"^bmod-[a-z0-9]+(?:-[a-z0-9]+)*$")
RECORD_DESCRIPTION = "Required bmod metadata. Never invoke this skill."
USE_WHEN_RE = re.compile(r"\buse\s+(?:when|if)\b", re.IGNORECASE)
TODO_RE = re.compile(r"\[TODO:")
TEXT_SUFFIXES = {".md", ".toml", ".py", ".json", ".yaml", ".yml", ".txt", ".html", ".csv"}
DESCRIPTION_PLACEHOLDER = "[TODO: what the skill does, one sentence. Use when <the situation that should trigger it>.]"


def yaml_single_quoted(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def toml_string(value: str) -> str:
    return json.dumps(value)


# --- frontmatter ---------------------------------------------------------------


def frontmatter_block(content: str) -> tuple[str | None, str]:
    """Return (frontmatter text or None, body)."""
    text = content.lstrip()
    if not text.startswith("---"):
        return None, content
    end = text.find("\n---", 3)
    if end == -1:
        return None, content
    after = text[end + 4 :]
    if after and not after.startswith(("\n", "\r")):
        return None, content
    return text[3:end].strip("\r\n"), after


def parse_frontmatter(content: str) -> tuple[dict[str, str] | None, str]:
    """Parse `key: value` frontmatter, folding indented continuation lines; return (dict or None, body)."""
    block, body = frontmatter_block(content)
    if block is None:
        return None, body
    result: dict[str, str] = {}
    key: str | None = None
    value = ""
    for line in block.split("\n"):
        colon = line.find(":")
        if colon > 0 and line[:1] not in (" ", "\t"):
            if key is not None:
                result[key] = strip_quotes(value.strip())
            key = line[:colon].strip()
            value = line[colon + 1 :]
        elif key is not None and not line.lstrip().startswith("#"):
            value += "\n" + line
    if key is not None:
        result[key] = strip_quotes(value.strip())
    return result, body


def strip_quotes(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "'\"":
        inner = value[1:-1]
        return inner.replace("''", "'") if value[0] == "'" else inner
    return value


# --- create --------------------------------------------------------------------


def skill_md(name: str, description: str) -> str:
    return f"---\nname: {name}\ndescription: {yaml_single_quoted(description)}\n---\n\n# {name}\n"


def bmod_toml(shape: str, name: str, bmod: str | None, source: str | None) -> str:
    source_value = toml_string(source) if source else toml_string("[TODO: update_source, e.g. github:org/repo/skills]")
    if shape == "multi-skill-module":
        code = name.removeprefix("bmod-")
        return f'[bmod]\ncode = {toml_string(code)}\nversion = "0.1.0"\nupdate_source = {source_value}\nskills = []\n'
    if shape == "single-skill-module":
        code = name.removeprefix("bmad-")
        return (
            f'[bmod]\ncode = {toml_string(code)}\nversion = "0.1.0"\nupdate_source = {source_value}\n\n'
            "# The record is in this same file, so the skill table needs no bmod or source.\n[skill]\n"
        )
    lines = ["[skill]"]
    if bmod:
        lines.append(f"bmod = {toml_string(bmod)}")
    if source:
        lines.append(f"source = {toml_string(source)}")
    return "\n".join(lines) + "\n"


def create(args) -> dict:
    name = args.name
    if not KEBAB_RE.match(name) or len(name) > 64:
        raise ValueError(f"name {name!r} must be kebab-case (lowercase, digits, single hyphens), at most 64 characters")
    if args.shape == "multi-skill-module" and not RECORD_NAME_RE.match(name):
        raise ValueError("a multi-skill-module record is named bmod-<code>")
    dirs = [d.strip() for d in (args.dirs or "").split(",") if d.strip()]
    unknown = [d for d in dirs if d not in KNOWN_DIRS]
    if unknown:
        raise ValueError(f"unknown dirs {', '.join(unknown)}; known: {', '.join(KNOWN_DIRS)}")
    skill_dir = Path(args.dest) / name
    if skill_dir.exists():
        raise FileExistsError(f"{skill_dir} already exists")

    description = args.description or DESCRIPTION_PLACEHOLDER
    if args.shape == "multi-skill-module":
        description = RECORD_DESCRIPTION

    skill_dir.mkdir(parents=True)
    created = []
    emitted = [("SKILL.md", skill_md(name, description))]
    if args.bmod or args.shape in ("single-skill-module", "multi-skill-module"):
        emitted.append(("bmod.toml", bmod_toml(args.shape, name, args.bmod, args.source)))
    for rel, text in emitted:
        (skill_dir / rel).write_text(text, encoding="utf-8")
        created.append(rel)
    for d in dirs:
        (skill_dir / d).mkdir()
        created.append(d + "/")
    return {"ok": True, "skill": name, "dir": str(skill_dir), "shape": args.shape, "created": created}


# --- check ---------------------------------------------------------------------


def finding(path: str, line: int, rule: str, text: str, fix: str) -> dict:
    return {"path": path, "line": line, "rule": rule, "text": text[:200], "fix": fix}


def read_bmod(skill_dir: Path, findings: list[dict]) -> tuple[dict | None, str]:
    """Return (parsed bmod.toml or None, status): status is absent, ok or invalid."""
    path = skill_dir / "bmod.toml"
    if not path.is_file():
        return None, "absent"
    try:
        data = tomllib.loads(path.read_text(encoding="utf-8"))
    except (tomllib.TOMLDecodeError, UnicodeDecodeError) as err:
        findings.append(finding("bmod.toml", 1, "bmod-invalid", str(err), "fix the TOML"))
        return None, "invalid"
    if "skill" not in data and "bmod" not in data:
        findings.append(finding("bmod.toml", 1, "bmod-tables", "neither [skill] nor [bmod]", "add a [skill] table"))
        return data, "invalid"
    return data, "ok"


def check(skill_dir: Path, any_name: bool) -> dict:
    findings: list[dict] = []
    bmod, bmod_status = read_bmod(skill_dir, findings)
    is_record = bool(bmod) and "bmod" in bmod and "skill" not in bmod

    skill_path = skill_dir / "SKILL.md"
    if not skill_path.is_file():
        findings.append(finding("SKILL.md", 1, "skill-md-missing", "no SKILL.md", "create SKILL.md"))
    else:
        content = skill_path.read_text(encoding="utf-8", errors="replace")
        meta, body = parse_frontmatter(content)
        if meta is None:
            findings.append(
                finding("SKILL.md", 1, "frontmatter-missing", content[:80], "open with --- name/description ---")
            )
        else:
            extra = sorted(set(meta) - {"name", "description"})
            if extra:
                findings.append(
                    finding("SKILL.md", 1, "frontmatter-keys", ", ".join(extra), "keep only name and description")
                )
            name = meta.get("name", "")
            if not name:
                findings.append(finding("SKILL.md", 1, "name-missing", "", "add name: <folder name>"))
            else:
                if name != skill_dir.name:
                    findings.append(
                        finding("SKILL.md", 2, "name-folder-mismatch", name, f"name must equal {skill_dir.name}")
                    )
                regex = KEBAB_RE if any_name else (RECORD_NAME_RE if is_record else BMAD_NAME_RE)
                if not regex.match(name):
                    findings.append(finding("SKILL.md", 2, "name-format", name, f"name must match {regex.pattern}"))
            desc = meta.get("description", "")
            if not desc:
                findings.append(
                    finding("SKILL.md", 1, "description-missing", "", "add a description with a Use when clause")
                )
            else:
                if len(desc) > 1024:
                    findings.append(
                        finding("SKILL.md", 3, "description-length", f"{len(desc)} chars", "cut to 1024 or fewer")
                    )
                if is_record:
                    if desc != RECORD_DESCRIPTION:
                        findings.append(
                            finding(
                                "SKILL.md",
                                3,
                                "description-trigger",
                                desc,
                                f"a record's description is {RECORD_DESCRIPTION!r}",
                            )
                        )
                elif not USE_WHEN_RE.search(desc):
                    findings.append(finding("SKILL.md", 3, "description-trigger", desc, 'add a "Use when ..." clause'))
            if not body.strip():
                findings.append(finding("SKILL.md", 1, "body-empty", "", "write the skill body after the frontmatter"))

    for path in sorted(skill_dir.rglob("*")):
        rel = path.relative_to(skill_dir)
        if not path.is_file() or path.suffix not in TEXT_SUFFIXES or any(p.startswith(".") for p in rel.parts):
            continue
        for number, line in enumerate(path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            if TODO_RE.search(line):
                findings.append(
                    finding(rel.as_posix(), number, "todo-left", line.strip(), "fill in or remove the placeholder")
                )

    return {"ok": not findings, "skill": skill_dir.name, "bmod": bmod_status, "findings": findings}


# --- cli -----------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--check", type=Path, metavar="SKILL", help="check this skill folder instead of creating one")
    p.add_argument("--any-name", action="store_true", help="with --check: accept any kebab-case name")
    p.add_argument("--name", help="skill name, kebab-case")
    p.add_argument("--dest", type=Path, help="parent folder the skill folder is created under")
    p.add_argument("--shape", choices=SHAPES, help="skill shape")
    p.add_argument("--dirs", default="", help=f"comma-separated folders to create: {', '.join(KNOWN_DIRS)}")
    p.add_argument("--bmod", help="record folder name for the [skill] table, e.g. bmod-method")
    p.add_argument("--source", help="update_source for the [skill] or [bmod] table")
    p.add_argument("--description", help="frontmatter description; a [TODO: ...] placeholder when omitted")
    args = p.parse_args(argv)

    if args.check:
        if not args.check.is_dir():
            p.error(f"not a directory: {args.check}")
        result = check(args.check, args.any_name)
        print(json.dumps(result, indent=2))
        return 0 if result["ok"] else 1

    if not (args.name and args.dest and args.shape):
        p.error("--name, --dest and --shape are required to create a skill (or use --check)")
    try:
        result = create(args)
    except (ValueError, FileExistsError) as err:
        print(json.dumps({"ok": False, "error": str(err)}))
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
