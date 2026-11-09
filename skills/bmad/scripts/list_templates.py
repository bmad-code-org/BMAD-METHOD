#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""list-templates — list the templates in a set of libraries, for any skill that fills templates.

Takes sources in search order; the first template with an id wins. A source is a local folder
or file, a GitHub URL (a repo, a /tree/ folder or a /blob/ file, with an optional @ref, read
through `gh`), a URL to one .md file, or a sentence naming a tool, which only the agent can
follow; a source with a space and no path separator is a sentence. Each --root is a skills
folder; the --folder folder (default `doc-templates`) of every module record in it is searched
after the sources. A file is a template when its frontmatter has `template:`, the template's id.
A file with `extends:` adds to the template of that id wherever it sits, and an earlier
extension's values win over a later one's and the template's. `--libraries-of <skill folder>` reads that skill's `workflow.template_libraries`, through its
customization layers, as the first sources. `--project-root` fills `{project-root}` in each source. A missing local path adds nothing
and is listed. `--agent <skill>` keeps only that agent's templates: those whose `agents:` list names
it, those with no list in that skill's own folder, and those with no list that replace one of these.

`facilitation_order` lists a template's `##` sections by id, each heading lowercased with its
punctuation dropped and spaces as hyphens, `?` marking one that is not required. An extension's
list replaces the template's. A section an extension adds without a list of its own is appended
to the order, with `?` when its comment starts `optional` or `include when`. Each listed id must
name a heading, no id may repeat, and every heading of the template, and of the extensions that
set a list, must be listed; what breaks this comes back in `order_problems`. An extension's list
may leave out a heading of the template: that section is removed and named in `removed`. `guidance`,
`rubric`, `methods`, `style` and `view` are relative to their file and come back resolved; a bare
name with no extension, such as `slides`, comes back as it is.

`--brief` keeps only each template's id, description, not_for, category and output, for choosing one.
`--template <id>` keeps only that template; `--merge <path>` then writes it as one file to read
whole: the merged frontmatter, each extension's body in search order, then the template's body
without its removed sections, with every path made absolute.

Prints JSON:
  templates     id, version, description, not_for, category, agents, facilitation_order, guidance, rubric,
                methods, output, style, view, html_view, file, source, extensions, order_problems,
                removed, in search order
  shadowed      id, file, source, kept, agents: templates hidden by an earlier one with the same id
  orphaned      extends, file, source: extensions whose template was not found
  unreachable   source, reason: sources that could not be read
  missing       local paths that do not exist
  tool_sources  sentences for the agent to follow
  merged        the path written, with --merge
Exits 0, 1 when --template names no template, or 2 with no sources and no roots.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tomllib
from pathlib import Path
from urllib.parse import quote, urljoin, urlsplit
from urllib.parse import unquote as url_unquote
from urllib.request import Request, urlopen

FRONTMATTER = re.compile(r"\A---[ \t]*\n(.*?)\n---[ \t]*(?:\n|\Z)", re.DOTALL)
KEY = re.compile(r"^([A-Za-z_]+):[ \t]*(.*?)[ \t]*$", re.MULTILINE)
GITHUB = re.compile(
    r"^https://github\.com/(?P<owner>[^/]+)/(?P<repo>[^/@]+?)(?:\.git)?"
    r"(?:/(?:tree|blob)/(?P<tree_ref>[^/@]+)(?:/(?P<path>[^@]*?))?)?/?(?:@(?P<ref>[^/]+))?/?$"
)
MODULE_FOLDER = "doc-templates"
FIELDS = (
    "version", "description", "not_for", "category", "agents", "facilitation_order", "guidance", "rubric", "methods", "output", "style",
    "view", "html_view",
)  # fmt: skip
SECTION = re.compile(r"^##[ \t]+(.+?)[ \t#]*$")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
NOT_REQUIRED = re.compile(r"^\s*<!--\s*(optional|include when)\b", re.IGNORECASE)
TIMEOUT = 30


def unquote(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] == '"':
        return value[1:-1].replace('\\"', '"')
    if len(value) >= 2 and value[0] == value[-1] == "'":
        return value[1:-1].replace("''", "'")
    return value


def frontmatter(text: str) -> dict[str, str]:
    m = FRONTMATTER.match(text.replace("\r\n", "\n"))
    return {key: unquote(value) for key, value in KEY.findall(m.group(1))} if m else {}


def run_gh(args: list[str]) -> str:
    return subprocess.run(["gh", "api", *args], capture_output=True, text=True, check=True, timeout=TIMEOUT).stdout


def fetch_url(url: str) -> str:
    with urlopen(Request(url, headers={"User-Agent": "bmad-list-templates"}), timeout=TIMEOUT) as response:
        return response.read().decode("utf-8-sig")


def github_files(m: re.Match) -> list[tuple[str, str]]:
    ref = m.group("ref") or m.group("tree_ref")
    query = f"?ref={quote(ref, safe='')}" if ref else ""
    repo = f"repos/{m.group('owner')}/{m.group('repo')}/contents"
    listing = json.loads(run_gh([f"{repo}/{quote(url_unquote(m.group('path') or ''))}{query}"]))
    entries = listing if isinstance(listing, list) else [listing]
    return [
        (e["html_url"], run_gh(["-H", "Accept: application/vnd.github.raw", f"{repo}/{quote(e['path'])}{query}"]))
        for e in entries
        if e["type"] == "file" and e["name"].endswith(".md")
    ]


def read_source(source: str) -> list[tuple[str, str]]:
    """(file, text) for each markdown file a source holds."""
    if "://" not in source:
        path = Path(source).expanduser()
        files = sorted(path.glob("*.md")) if path.is_dir() else [path]
        return [(str(f), f.read_text(encoding="utf-8-sig")) for f in files]
    m = GITHUB.match(source)
    if m:
        return github_files(m)
    if urlsplit(source).path.endswith(".md"):
        return [(source, fetch_url(source))]
    raise ValueError("a plain URL cannot be listed; point at one .md file or name a tool")


def beside(file: str, value: str) -> str:
    """`value`, a path relative to `file`, made usable from anywhere. A bare name stays a name."""
    if not value or "://" in value or value.startswith("{") or Path(value).is_absolute() or not Path(value).suffix:
        return value
    return urljoin(file, value) if "://" in file else str(Path(file).parent / value)


def module_libraries(roots: list[str], folder_name: str = MODULE_FOLDER) -> list[str]:
    """The `folder_name` folder of each module record, once each, roots in order."""
    libraries: dict[Path, str] = {}
    for root in roots:
        for folder in sorted(Path(root).expanduser().glob(f"*/{folder_name}")):
            try:
                record = tomllib.loads((folder.parent / "bmod.toml").read_text(encoding="utf-8"))
            except (OSError, ValueError):
                continue
            if "bmod" in record:
                libraries.setdefault(folder.resolve(), str(folder))
    return list(libraries.values())


def listed(value: str) -> list[str]:
    """A one-line YAML list, `[a, 'b']`, as its items."""
    return [unquote(name.strip()) for name in value.strip("[]").split(",") if name.strip()]


def unreadable_order(meta: dict[str, str]) -> bool:
    """Whether the file has a `facilitation_order` key that is not a one-line list."""
    return "facilitation_order" in meta and not listed(meta["facilitation_order"])


def section_id(heading: str) -> str:
    """A heading's id: lowercase, punctuation dropped, spaces as hyphens, as its anchor is built."""
    return re.sub(r"[^\w\- ]", "", heading.strip().lower()).replace(" ", "-")


def sections(text: str) -> list[tuple[str, bool]]:
    """Each `##` heading outside code fences, the table of contents left out, as its id and
    whether its first comment marks it not required."""
    found, fence, open_comment = [], None, False
    for line in text.replace("\r\n", "\n").split("\n"):
        m = FENCE.match(line)
        if m:
            marker = m.group(1)
            if fence is None:
                fence = (marker[0], len(marker))
            elif marker[0] == fence[0] and len(marker) >= fence[1] and line.strip() == marker:
                fence = None
            continue
        if fence is not None:
            continue
        heading = SECTION.match(line)
        if heading:
            open_comment = section_id(heading.group(1)) != "table-of-contents"
            if open_comment:
                found.append((section_id(heading.group(1)), False))
        elif open_comment and "<!--" in line:
            found[-1] = (found[-1][0], bool(NOT_REQUIRED.match(line)))
            open_comment = False
    return found


def section_ids(text: str) -> list[str]:
    """The ids of a file's `##` headings outside code fences, the table of contents left out."""
    return [i for i, _ in sections(text)]


def order_problems(order: list[str], required_headings: list[str], known: list[str]) -> list[str]:
    """What is wrong with a facilitation order against the headings it must cover."""
    ids = [entry.rstrip("?") for entry in order]
    problems = [f"`{i}` is listed twice" for i in sorted({i for i in ids if ids.count(i) > 1})]
    problems += [f"`{i}` names no heading" for i in dict.fromkeys(ids) if i not in known]
    problems += [f"heading `{h}` is not listed" for h in dict.fromkeys(required_headings) if h not in ids]
    return problems


def fields(file: str, meta: dict[str, str]) -> dict[str, object]:
    """What a template or extension sets, with its paths resolved."""
    return {
        "version": meta.get("version", ""),
        "description": meta.get("description", ""),
        "not_for": meta.get("not_for", ""),
        "category": meta.get("category", ""),
        "agents": listed(meta.get("agents", "")),
        "facilitation_order": listed(meta.get("facilitation_order", "")),
        "guidance": beside(file, meta.get("guidance", "")),
        "rubric": beside(file, meta.get("rubric", "")),
        "methods": beside(file, meta.get("methods", "")),
        "output": meta.get("output", ""),
        "style": beside(file, meta.get("style", "")),
        "view": beside(file, meta.get("view", "")),
        "html_view": meta.get("html_view", ""),
    }


def scan(sources: list[str]) -> dict:
    found: dict[str, dict] = {}
    extensions: dict[str, list[dict]] = {}
    shadowed, unreachable, tool_sources, orphaned, missing = [], [], [], [], []
    for source in sources:
        if "://" not in source and not Path(source).expanduser().exists():
            if any(c.isspace() for c in source.strip()) and "/" not in source and "\\" not in source:
                tool_sources.append(source)
            else:
                missing.append(source)
            continue
        try:
            files = read_source(source)
        except subprocess.CalledProcessError as e:
            unreachable.append({"source": source, "reason": e.stderr.strip() or str(e)})
            continue
        except (OSError, ValueError, KeyError, subprocess.SubprocessError) as e:
            unreachable.append({"source": source, "reason": str(e)})
            continue
        for file, text in files:
            meta = frontmatter(text)
            if meta.get("extends"):
                extensions.setdefault(meta["extends"], []).append(
                    {
                        "file": file,
                        "source": source,
                        "_sections": sections(text),
                        "_text": text,
                        "_bad_order": unreadable_order(meta),
                        **fields(file, meta),
                    }
                )
                continue
            template_id = meta.get("template")
            if not template_id:
                continue
            if template_id in found:
                kept = found[template_id]["file"]
                agents = listed(meta.get("agents", ""))
                shadowed.append({"id": template_id, "file": file, "source": source, "kept": kept, "agents": agents})
                continue
            found[template_id] = {
                "id": template_id,
                **fields(file, meta),
                "file": file,
                "source": source,
                "extensions": [],
                "_extension_texts": [],
                "order_problems": [],
                "_headings": section_ids(text),
                "_text": text,
                "_own": fields(file, meta),
                "_bad_order": unreadable_order(meta),
            }
    for base, adding in extensions.items():
        template = found.get(base)
        if template is None:
            orphaned.extend({"extends": base, "file": e["file"], "source": e["source"]} for e in adding)
            continue
        template["extensions"] = [e["file"] for e in adding]
        template["_extension_texts"] = [(e["file"], e["_text"]) for e in adding]
        for key in FIELDS:
            template[key] = next((e[key] for e in adding if e[key]), template[key])
        own, order = template["_headings"], list(template["facilitation_order"])
        template["facilitation_order"] = order
        if order:
            listed_ids = {entry.rstrip("?") for entry in order}
            for e in adding:
                if e["facilitation_order"]:
                    continue
                for section, not_required in e["_sections"]:
                    if section not in listed_ids and section not in own:
                        order.append(section + "?" * not_required)
                        listed_ids.add(section)
        template["_extension_headings"] = [s for e in adding for s, _ in e["_sections"]]
        template["_must_list"] = [s for e in adding if e["facilitation_order"] for s, _ in e["_sections"]]
        template["_order_from_extension"] = any(e["facilitation_order"] for e in adding)
        template["_bad_extension_orders"] = [e["file"] for e in adding if e["_bad_order"]]
    for template in found.values():
        own, added = template.pop("_headings"), template.pop("_extension_headings", [])
        must, template["removed"] = own + template.pop("_must_list", []), []
        if template.pop("_order_from_extension", False):
            listed_ids = {entry.rstrip("?") for entry in template["facilitation_order"]}
            template["removed"] = [h for h in dict.fromkeys(own) if h not in listed_ids]
            must = [h for h in must if h not in template["removed"]]
        if template["facilitation_order"]:
            template["order_problems"] = order_problems(template["facilitation_order"], must, own + added)
        if template.pop("_bad_order") and not template["facilitation_order"]:
            template["order_problems"] = ["`facilitation_order` must be a one-line list, such as `[problem, scope?]`"]
        template["order_problems"] += [
            f"`facilitation_order` in {file} is ignored: it must be a one-line list, such as `[problem, scope?]`"
            for file in template.pop("_bad_extension_orders", [])
        ]
    return {
        "templates": list(found.values()),
        "shadowed": shadowed,
        "orphaned": orphaned,
        "unreachable": unreachable,
        "missing": missing,
        "tool_sources": tool_sources,
    }


PATH_KEYS = ("guidance", "rubric", "methods", "style", "view")
BRIEF = ("id", "description", "not_for", "category", "output")


def body(text: str) -> str:
    """A file's text after its frontmatter."""
    text = text.replace("\r\n", "\n")
    m = FRONTMATTER.match(text)
    return text[m.end() :].strip("\n") if m else text.strip("\n")


def drop_sections(text: str, ids: list[str]) -> str:
    """`text` without the `##` sections whose ids are listed, each to the next `##` heading."""
    kept, fence, dropping = [], None, False
    for line in text.split("\n"):
        m = FENCE.match(line)
        if m:
            marker = m.group(1)
            if fence is None:
                fence = (marker[0], len(marker))
            elif marker[0] == fence[0] and len(marker) >= fence[1] and line.strip() == marker:
                fence = None
        elif fence is None and (heading := SECTION.match(line)):
            dropping = section_id(heading.group(1)) in ids
        elif fence is None and line.startswith("# "):
            dropping = False
        if not dropping:
            kept.append(line)
    return "\n".join(kept)


def absolute(value: str) -> str:
    """A local relative path made absolute, so it still resolves from the run folder, with forward
    slashes so no backslash needs escaping in YAML."""
    if not value or "://" in value or value.startswith("{") or not Path(value).suffix:
        return value
    return Path(value).expanduser().resolve().as_posix()


def yaml_value(value: object) -> str:
    if isinstance(value, list):
        return "[" + ", ".join(value) + "]"
    return json.dumps(value, ensure_ascii=False)


def merged_frontmatter(template: dict) -> str:
    """The template's frontmatter with every value its extensions changed, paths made absolute."""
    m = FRONTMATTER.match(template["_text"].replace("\r\n", "\n"))
    entries: list[list[str]] = []
    for line in m.group(1).split("\n") if m else []:
        if KEY.match(line) or not entries:
            entries.append([line])
        else:
            entries[-1].append(line)
    own = template["_own"]
    values = {key: template[key] for key in FIELDS if template[key] != own[key]}
    raw = frontmatter(template["_text"])
    values.update({key: absolute(template[key]) for key in PATH_KEYS if absolute(template[key]) != raw.get(key, "")})
    lines, written = [], set()
    for entry in entries:
        key = KEY.match(entry[0]).group(1) if KEY.match(entry[0]) else None
        if key in values:
            lines.append(f"{key}: {yaml_value(values[key])}")
            written.add(key)
        else:
            lines.extend(entry)
    lines += [f"{key}: {yaml_value(values[key])}" for key in FIELDS if key in values and key not in written]
    return "---\n" + "\n".join(lines) + "\n---"


def merged(template: dict) -> str:
    """The template and its extensions as one file, the extensions first."""
    parts = [merged_frontmatter(template)]
    for file, text in template["_extension_texts"]:
        parts.append(
            f"<!-- Customization from {file}. It changes the template below and wins where they conflict:"
            " each of its sections goes where its comment says, and a comment saying it replaces or removes"
            " part of the template is followed. -->"
        )
        if body(text):
            parts.append(body(text))
    parts.append(f"<!-- The template, from {template['file']}. -->")
    parts.append(drop_sections(body(template["_text"]), template["removed"]))
    return "\n\n".join(parts) + "\n"


def libraries_of(skill: str, project_root: str | None) -> list[str]:
    """A skill's `workflow.template_libraries` after its customization layers, `{skill-root}` filled."""
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from config_utils import load_customization

    skill_dir = Path(skill).expanduser().resolve()
    root = Path(project_root).resolve() if project_root else None
    libraries = load_customization(root, skill_dir).get("workflow", {}).get("template_libraries", [])
    return [str(lib).replace("{skill-root}", str(skill_dir)) for lib in libraries]


def offers(agents: list[str], file: str, agent: str) -> bool:
    """Whether `agent` offers a file: it names the agent, or it names none and sits in the agent's skill."""
    if agents:
        return agent in agents
    return "://" not in file and Path(file).resolve().parent.parent.name == agent


def owned_by(template: dict, agent: str, shadowed: list[dict] = ()) -> bool:
    """Whether `agent` offers the template, itself or through a template of the same id it replaces."""
    if offers(template["agents"], template["file"], agent):
        return True
    return not template["agents"] and any(
        offers(s["agents"], s["file"], agent) for s in shadowed if s["kept"] == template["file"]
    )


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="List the templates in a set of libraries.")
    parser.add_argument("sources", nargs="*")
    parser.add_argument("--root", action="append", default=[], help="a skills folder to search for module templates")
    parser.add_argument("--folder", default=MODULE_FOLDER, help="the templates folder in each module record")
    parser.add_argument("--agent", help="keep only the templates this agent skill offers")
    parser.add_argument("--project-root", help="the folder that fills `{project-root}` in each source")
    parser.add_argument(
        "--libraries-of", action="append", default=[], help="a skill whose template_libraries come first (repeatable)"
    )
    parser.add_argument("--brief", action="store_true", help="keep only what choosing a template needs")
    parser.add_argument("--template", help="keep only the template with this id")
    parser.add_argument("--merge", help="with --template, write the template and its extensions as one file here")
    args = parser.parse_args(argv)
    if not args.sources and not args.root and not args.libraries_of:
        parser.print_usage(sys.stderr)
        return 2
    try:
        sources = [lib for skill in args.libraries_of for lib in libraries_of(skill, args.project_root)] + args.sources
    except Exception as e:  # a broken customization file names itself; the listing cannot go on without it
        print(json.dumps({"error": f"could not read the template libraries: {e}"}, indent=2))
        return 1
    sources = [s.replace("{project-root}", args.project_root) if args.project_root else s for s in sources]
    result = scan(sources + module_libraries(args.root, args.folder))
    if args.agent:
        result["templates"] = [t for t in result["templates"] if owned_by(t, args.agent, result["shadowed"])]
    if args.template:
        result["templates"] = [t for t in result["templates"] if t["id"] == args.template]
        if not result["templates"]:
            print(
                json.dumps(
                    {
                        "error": f"no template `{args.template}`",
                        **{k: v for k, v in result.items() if k != "templates"},
                    },
                    indent=2,
                )
            )
            return 1
        if args.merge:
            out = Path(args.merge).expanduser()
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(merged(result["templates"][0]), encoding="utf-8")
            result["merged"] = str(out)
    for template in result["templates"]:
        for key in [k for k in template if k.startswith("_")]:
            del template[key]
    if args.brief:
        result["templates"] = [{key: t[key] for key in BRIEF} for t in result["templates"]]
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
