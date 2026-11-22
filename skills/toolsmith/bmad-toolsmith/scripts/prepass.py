#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7", "tiktoken"]
# ///
"""prepass: the deterministic pre-pass the review lenses read before opening any file.

One skill folder in, one JSON object out. Token counts come from count_tokens, path findings from
scan_paths and script findings from scan_scripts, all imported from this folder, so the numbers match
what each script prints on its own.

shape_hint is inferred, first match wins:
  memory-agent         `_bmad/memory` in SKILL.md, or scripts/wake.py or scripts/init-sanctum.py present
  rendered-agent       SKILL.md calls render_skill.py and customize.toml has an [agent] table
  rendered-skill       SKILL.md calls render_skill.py
  agent                customize.toml has an [agent] table
  single-skill-module  bmod.toml has both [bmod] and [skill]
  multi-skill-module   bmod.toml has [bmod] only (a module record)
  script-utility       scripts/ exists and SKILL.md is under 60 lines
  plain-skill          everything else; "unknown" when there is no SKILL.md or customize.toml does not parse

Usage:
  prepass.py <skill-folder>

Output, one JSON object on stdout:
  {"skill", "shape_hint", "files": [{"path", "tokens", "kind"}], "skill_md_tokens", "total_tokens", "token_method",
   "has_customize", "has_scripts", "scripts": [{"path", "has_pep723", "has_test", "has_argparse"}],
   "description_chars", "has_use_when", "frontmatter_ok", "bmod_kind", "path_findings": [...], "script_findings": [...],
   "long_paragraphs": [{"path", "line", "words", "sentences", "longest_sentence"}], "toml_errors": [{"path", "error"}],
   "customize_findings": [{"rule", "location", "detail"}], "repeated_passages": [{"text", "locations": [{"path", "line"}]}]}
  kind is one of entry, prompt, script, test, asset, config, other.
  token_method is tiktoken, or fallback (characters / 4) when any file could not be counted with tiktoken.
  Token counts are reported, never judged: no field flags a file for its size.
  bmod_kind is none (no bmod.toml), skill (a module member), record (a record folder), record+skill (a
  single-skill module) or invalid (a file with neither table, or one that does not parse).
  long_paragraphs lists the dense lines of entry, prompt and .md asset files, a Markdown paragraph or bullet being
  one line: past 120 words, holding a sentence past 60 words, or at least 80 words in at least 6 sentences
  (sentences counts clauses joined by a semicolon too). Headings, tables, code fences and frontmatter are skipped.
  customize_findings checks the root customize.toml only (a skill's assets/ may hold templates that do not parse):
    unknown-token        a `{workflow.<key>}` or `{agent.<key>}` token in an entry or prompt file or in
                         customize.toml naming no key of that table (every one, with no customize.toml); in a
                         rendered skill also any `workflow.<key>` or `agent.<key>` inside a Jinja `{{ }}` or
                         `{% %}` construct, outside its string literals, unless the same file binds that name
                         (`{% for workflow in ... %}`, `{% set agent = ... %}`)
    unread-key           a [workflow] key no file outside customize.toml names: not as `{workflow.<key>}`, not
                         in a Jinja `{{ }}` or `{% %}` construct, not in a script or by its bare name
    entry-without-id     an array-of-tables entry with neither `code` nor `id`
    boolean-toggle       a true or false value, outside array-of-tables entries (where it is data)
    agent-missing-field  [agent] without `name`, `title` or `icon`
    menu-item-target     an [[agent.menu]] item with both or neither of `skill` and `prompt`
  location is "<path>:<line>"; a key's line is found inside its own table. Nothing is reported when customize.toml does not parse; toml_errors has it.
  repeated_passages groups near-identical sentences (at least 8 words, outside code fences) found in two or
  more entry or prompt files; text is the first one, locations every place it appears.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from difflib import SequenceMatcher  # noqa: E402

from count_tokens import count_tokens, iter_text_files, read_text  # noqa: E402
from init_skill import USE_WHEN_RE, parse_frontmatter  # noqa: E402
from scan_paths import scan_skill  # noqa: E402
from scan_scripts import scan_scripts  # noqa: E402

MEMORY_RE = re.compile(r"_bmad/memory")
SCRIPT_UTILITY_MAX_LINES = 60
LONG_PARAGRAPH_WORDS = 120
LONG_SENTENCE_WORDS = 60
DENSE_WORDS = 80
DENSE_SENTENCES = 6
SENTENCE_END_RE = re.compile(r"(?<=[.?!])\s+")
CLAUSE_END_RE = re.compile(r"(?<=[.?!;])\s+")
FENCE_RE = re.compile(r"^(`{3,}|~{3,})")
LIST_MARKER_RE = re.compile(r"^(?:[-*+]|\d+[.)])\s+")
TOKEN_RE = re.compile(r"(?<!\{)\{(workflow|agent)\.([A-Za-z_][\w-]*)")
JINJA_CONSTRUCT_RE = re.compile(r"\{\{.*?\}\}|\{%.*?%\}", re.DOTALL)
JINJA_REF_RE = re.compile(r"(?<![\w.])(workflow|agent)\.(\w[\w-]*)")
JINJA_STRING_RE = re.compile(r"\"[^\"]*\"|'[^']*'")
JINJA_BIND_RE = re.compile(r"\{%-?\s*(?:for\s+([\w\s,()]+?)\s+in\b|set\s+(\w+)\s*(?:=|-?%\}))")
# `[ \t]*`, not `\s*`: under MULTILINE, `^\s*` starts the match on a blank line above.
TOML_HEADER_RE = re.compile(r"^[ \t]*\[\[?([^\[\]#\n]+)\]\]?[ \t]*(?:#.*)?$", re.MULTILINE)
REPEAT_MIN_WORDS = 8
REPEAT_SIMILARITY = 0.85
WORD_RE = re.compile(r"[a-z0-9_]+(?:['-][a-z0-9_]+)*")


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


def toml_errors(root: Path) -> list[dict]:
    """Manifests that exist but do not parse; a lens reading an empty table would misjudge the shape."""
    errors = []
    for name in ("customize.toml", "bmod.toml"):
        path = root / name
        if not path.is_file():
            continue
        try:
            tomllib.loads(path.read_text(encoding="utf-8"))
        except (tomllib.TOMLDecodeError, UnicodeDecodeError) as error:
            errors.append({"path": name, "error": str(error)})
    return errors


def shape_hint(root: Path, skill_text: str | None) -> str:
    if skill_text is None:
        return "unknown"
    scripts = root / "scripts"
    if MEMORY_RE.search(skill_text) or (scripts / "wake.py").is_file() or (scripts / "init-sanctum.py").is_file():
        return "memory-agent"
    if any(e["path"] == "customize.toml" for e in toml_errors(root)):
        return "unknown"
    is_agent = "agent" in load_toml(root / "customize.toml")
    if "render_skill.py" in skill_text:
        return "rendered-agent" if is_agent else "rendered-skill"
    if is_agent:
        return "agent"
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


def prose_lines(text: str):
    """(line number, stripped line) for each prose line: frontmatter, fences, headings and tables skipped."""
    lines = text.splitlines()
    start = 0
    if lines and lines[0].strip() == "---":
        start = next((i for i, line in enumerate(lines[1:], 2) if line.strip() == "---"), 0)
    fence = ""
    for number, line in enumerate(lines[start:], start + 1):
        stripped = line.strip()
        marker = FENCE_RE.match(stripped)
        if fence:
            if marker and stripped == marker[1] and stripped[0] == fence[0] and len(stripped) >= len(fence):
                fence = ""
            continue
        if marker:
            fence = marker[1]
            continue
        if stripped and not stripped.startswith(("#", "|")):
            yield number, stripped


def long_paragraphs(text: str) -> list[dict]:
    found = []
    for number, stripped in prose_lines(text):
        words = len(stripped.split())
        longest = max(len(s.split()) for s in SENTENCE_END_RE.split(stripped))
        sentences = len([c for c in CLAUSE_END_RE.split(stripped) if c.strip()])
        dense = words >= DENSE_WORDS and sentences >= DENSE_SENTENCES
        if words > LONG_PARAGRAPH_WORDS or longest > LONG_SENTENCE_WORDS or dense:
            found.append({"line": number, "words": words, "sentences": sentences, "longest_sentence": longest})
    return found


def repeated_passages(texts: dict[str, str]) -> list[dict]:
    """Near-identical sentences in two or more files, by word-sequence similarity."""
    items = []  # (path, line, original sentence, words)
    for path, text in texts.items():
        for number, stripped in prose_lines(text):
            for sentence in SENTENCE_END_RE.split(LIST_MARKER_RE.sub("", stripped)):
                words = WORD_RE.findall(re.sub(r"`[^`]*`", " code ", sentence.lower()))
                if len(words) >= REPEAT_MIN_WORDS:
                    items.append((path, number, sentence.strip(), words))
    index: dict[tuple[str, ...], list[int]] = {}
    for i, (_, _, _, words) in enumerate(items):
        for gram in {tuple(words[k : k + 3]) for k in range(len(words) - 2)}:
            index.setdefault(gram, []).append(i)
    parent = list(range(len(items)))

    def root(i: int) -> int:
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    checked = set()
    for members in index.values():
        if len(members) > 50:  # a stock phrase; real repeats share rarer three-word runs too
            continue
        for a_pos, a in enumerate(members):
            for b in members[a_pos + 1 :]:
                if (a, b) in checked or items[a][0] == items[b][0]:
                    continue
                checked.add((a, b))
                wa, wb = items[a][3], items[b][3]
                if min(len(wa), len(wb)) / max(len(wa), len(wb)) < REPEAT_SIMILARITY:
                    continue
                if SequenceMatcher(None, wa, wb, autojunk=False).ratio() >= REPEAT_SIMILARITY:
                    parent[root(a)] = root(b)
    groups: dict[int, list[int]] = {}
    for i in range(len(items)):
        groups.setdefault(root(i), []).append(i)
    # Sentences repeated at the same places are one passage: a copied paragraph is reported once.
    passages: dict[tuple, list[str]] = {}
    for members in sorted(groups.values(), key=min):
        if len({items[i][0] for i in members}) < 2:
            continue
        members.sort(key=lambda i: (items[i][0], items[i][1]))
        places = tuple(dict.fromkeys((items[i][0], items[i][1]) for i in members))
        passages.setdefault(places, []).append(items[members[0]][2])
    out = [
        {"text": " ".join(texts)[:200], "locations": [{"path": path, "line": line} for path, line in places]}
        for places, texts in passages.items()
    ]
    out.sort(key=lambda g: (g["locations"][0]["path"], g["locations"][0]["line"]))
    return out


def line_of(text: str, pattern: str, nth: int = 0) -> int:
    """Line of the nth match of pattern in text, 1 when absent."""
    for i, match in enumerate(re.finditer(pattern, text, re.MULTILINE)):
        if i == nth:
            return text.count("\n", 0, match.start()) + 1
    return 1


def key_line(raw: str, table: str, key: str, value: str = "") -> int:
    """Line of `key =` inside [table] (top level when table is ""), from its header to the next one.

    Falls back to the first such line anywhere, for a key set by a dotted key or an inline table.
    """
    pattern = re.compile(rf"^[ \t]*{re.escape(key)}[ \t]*={value}", re.MULTILINE)
    headers = list(TOML_HEADER_RE.finditer(raw))
    starts = [0] if not table else [h.end() for h in headers if re.sub(r"\s+", "", h.group(1)) == table]
    for start in starts:
        end = next((h.start() for h in headers if h.start() >= start), len(raw))
        match = pattern.search(raw, start, end)
        if match:
            return raw.count("\n", 0, match.start()) + 1
    return line_of(raw, pattern.pattern)


def jinja_tokens(text: str):
    """(offset, table, key) for each workflow.<key> or agent.<key> inside a Jinja construct, bound names skipped."""
    bound = {name for m in JINJA_BIND_RE.finditer(text) for name in re.findall(r"\w+", m.group(1) or m.group(2))}
    for construct in JINJA_CONSTRUCT_RE.finditer(text):
        # String literals name files, not keys: `rendered("workflow.md")`.
        code = JINJA_STRING_RE.sub(lambda m: " " * len(m.group(0)), construct.group(0))
        for ref in JINJA_REF_RE.finditer(code):
            if ref.group(1) not in bound:
                yield construct.start() + ref.start(), ref.group(1), ref.group(2)


def customize_findings(
    root: Path, prompt_texts: dict[str, str], all_texts: dict[str, str], rendered: bool
) -> list[dict]:
    path = root / "customize.toml"
    raw = read_text(path) if path.is_file() else ""
    if raw:
        try:
            data = tomllib.loads(raw)
        except (tomllib.TOMLDecodeError, UnicodeDecodeError):
            return []
    else:
        data = {}
    found = []

    def add(rule: str, line: int, detail: str, where: str = "customize.toml") -> None:
        found.append({"rule": rule, "location": f"{where}:{line}", "detail": detail})

    uncommented = "\n".join("" if line.lstrip().startswith("#") else line for line in raw.split("\n"))
    # Jinja reaches the model verbatim in a skill that is not rendered, so there it names nothing.
    for where, text in {**prompt_texts, "customize.toml": uncommented}.items():
        hits = [(m.start(), m.group(1), m.group(2)) for m in TOKEN_RE.finditer(text)]
        if rendered:
            hits.extend(jinja_tokens(text))
        for offset, table, key in hits:
            declared = data.get(table)
            if not isinstance(declared, dict) or key not in declared:
                add("unknown-token", text.count("\n", 0, offset) + 1, f"{table}.{key} is not declared", where)

    workflow = data.get("workflow")
    if isinstance(workflow, dict):
        others = "\n".join(text for rel, text in all_texts.items() if rel != "customize.toml")
        for key in workflow:
            if not re.search(rf"(?<![\w-]){re.escape(key)}(?![\w-])", others):
                add("unread-key", key_line(raw, "workflow", key), f"workflow.{key} is read nowhere")

    def walk(node: dict, dotted: str) -> None:
        for key, value in node.items():
            name = f"{dotted}.{key}" if dotted else key
            if isinstance(value, bool):
                line = key_line(raw, dotted, key, r"\s*(?:true|false)\b")
                add("boolean-toggle", line, f"{name} = {str(value).lower()}")
            elif isinstance(value, dict):
                walk(value, name)
            elif isinstance(value, list) and value and all(isinstance(v, dict) for v in value):
                for n, entry in enumerate(value):
                    if "code" not in entry and "id" not in entry:
                        line = line_of(raw, rf"^[ \t]*\[\[\s*{re.escape(name)}\s*\]\]", n)
                        add("entry-without-id", line, f"{name} entry {n + 1} has neither code nor id")

    walk(data, "")

    agent = data.get("agent")
    if isinstance(agent, dict):
        missing = [k for k in ("name", "title", "icon") if k not in agent]
        if missing:
            add("agent-missing-field", line_of(raw, r"^[ \t]*\[agent\]"), "[agent] has no " + ", ".join(missing))
        menu = agent.get("menu")
        for n, item in enumerate(menu if isinstance(menu, list) else []):
            if isinstance(item, dict) and ("skill" in item) == ("prompt" in item):
                which = "both skill and prompt" if "skill" in item else "neither skill nor prompt"
                line = line_of(raw, r"^[ \t]*\[\[\s*agent\.menu\s*\]\]", n)
                add("menu-item-target", line, f"menu item {item.get('code', n + 1)} has {which}")
    found.sort(key=lambda f: (f["location"].rsplit(":", 1)[0], int(f["location"].rsplit(":", 1)[1]), f["rule"]))
    return found


def build(root: Path) -> dict:
    skill_path = root / "SKILL.md"
    skill_text = read_text(skill_path) if skill_path.is_file() else None

    files = []
    long_lines = []
    skill_md_tokens = 0
    method = "tiktoken"
    prompt_texts: dict[str, str] = {}
    all_texts: dict[str, str] = {}
    for path in iter_text_files(root):
        rel = path.relative_to(root)
        text = read_text(path)
        tokens, used = count_tokens(text)
        if used == "fallback":
            method = "fallback"
        kind = kind_of(rel)
        files.append({"path": rel.as_posix(), "tokens": tokens, "kind": kind})
        if kind != "test":
            all_texts[rel.as_posix()] = text
        if kind in ("entry", "prompt"):
            prompt_texts[rel.as_posix()] = text
        if kind in ("entry", "prompt") or (kind == "asset" and rel.suffix == ".md"):
            long_lines.extend({"path": rel.as_posix(), **found} for found in long_paragraphs(text))
        if path == skill_path:
            skill_md_tokens = tokens

    meta = parse_frontmatter(skill_text)[0] if skill_text is not None else None
    description = (meta or {}).get("description", "")
    frontmatter_ok = bool(
        meta
        and meta.get("name") == root.name
        and description
        and set(meta) <= {"name", "description", "disable-model-invocation"}
        and ("disable-model-invocation" not in meta or meta["disable-model-invocation"] in (True, "true"))
    )

    scripts_result = scan_scripts(root)
    return {
        "skill": root.name,
        "shape_hint": shape_hint(root, skill_text),
        "files": files,
        "skill_md_tokens": skill_md_tokens,
        "total_tokens": sum(f["tokens"] for f in files),
        "token_method": method,
        "has_customize": (root / "customize.toml").is_file(),
        "has_scripts": (root / "scripts").is_dir(),
        "scripts": [
            {
                "path": s["path"],
                "has_pep723": s["has_pep723"],
                "has_test": s["has_test"],
                "has_argparse": s["has_argparse"],
            }
            for s in scripts_result["scripts"]
        ],
        "description_chars": len(description),
        "has_use_when": bool(USE_WHEN_RE.search(description)),
        "frontmatter_ok": frontmatter_ok,
        "bmod_kind": bmod_kind(root),
        "toml_errors": toml_errors(root),
        "path_findings": scan_skill(root)["findings"],
        "script_findings": scripts_result["findings"],
        "long_paragraphs": long_lines,
        "customize_findings": customize_findings(
            root, prompt_texts, all_texts, skill_text is not None and "render_skill.py" in skill_text
        ),
        "repeated_passages": repeated_passages(prompt_texts),
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
