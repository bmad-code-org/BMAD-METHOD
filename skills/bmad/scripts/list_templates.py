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
extension's values win over a later one's and the template's. A missing local path adds nothing
and is listed. `--agent <skill>` keeps only that agent's templates: those whose `agents:` list names
it, and those with no list in that skill's own folder.

`facilitation_order` lists a template's `##` sections by id, each heading lowercased with its
spaces as hyphens, `?` marking one that is not required. An extension's list replaces the
template's. Each listed id must name a heading, no id may repeat, and every heading of the
template, and of its extensions when one of them set the list, must be listed; what breaks this
comes back in `order_problems`. `guidance`, `rubric`, `methods` and `style` are relative to their file and come back resolved; a bare name
with no extension comes back as it is.

Prints JSON:
  templates     id, version, description, not_for, category, agents, facilitation_order, guidance, rubric,
                methods, output, style, file, source, extensions, order_problems, in search order
  shadowed      id, file, source, kept: templates hidden by an earlier one with the same id
  orphaned      extends, file, source: extensions whose template was not found
  unreachable   source, reason: sources that could not be read
  missing       local paths that do not exist
  tool_sources  sentences for the agent to follow
Exits 0, or 2 with no sources and no roots.
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
)  # fmt: skip
SECTION = re.compile(r"^##[ \t]+(.+?)[ \t#]*$")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
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


def section_id(heading: str) -> str:
    """A heading's id: lowercase, punctuation dropped, spaces as hyphens, as its anchor is built."""
    return re.sub(r"[^\w\- ]", "", heading.strip().lower()).replace(" ", "-")


def section_ids(text: str) -> list[str]:
    """The ids of a file's `##` headings outside code fences, the table of contents left out."""
    ids, fence = [], None
    for line in text.replace("\r\n", "\n").split("\n"):
        m = FENCE.match(line)
        if m:
            fence = None if fence and m.group(1)[0] == fence else (fence or m.group(1)[0])
            continue
        heading = SECTION.match(line) if fence is None else None
        if heading and section_id(heading.group(1)) != "table-of-contents":
            ids.append(section_id(heading.group(1)))
    return ids


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
                    {"file": file, "source": source, "_headings": section_ids(text), **fields(file, meta)}
                )
                continue
            template_id = meta.get("template")
            if not template_id:
                continue
            if template_id in found:
                kept = found[template_id]["file"]
                shadowed.append({"id": template_id, "file": file, "source": source, "kept": kept})
                continue
            found[template_id] = {
                "id": template_id,
                **fields(file, meta),
                "file": file,
                "source": source,
                "extensions": [],
                "order_problems": [],
                "_headings": section_ids(text),
            }
    for base, adding in extensions.items():
        template = found.get(base)
        if template is None:
            orphaned.extend({"extends": base, "file": e["file"], "source": e["source"]} for e in adding)
            continue
        template["extensions"] = [e["file"] for e in adding]
        for key in FIELDS:
            template[key] = next((e[key] for e in adding if e[key]), template[key])
        template["_extension_headings"] = [h for e in adding for h in e["_headings"]]
        template["_order_from_extension"] = any(e["facilitation_order"] for e in adding)
    for template in found.values():
        own, added = template.pop("_headings"), template.pop("_extension_headings", [])
        if template["facilitation_order"]:
            must = own + added if template.pop("_order_from_extension", False) else own
            template["order_problems"] = order_problems(template["facilitation_order"], must, own + added)
        template.pop("_order_from_extension", None)
    return {
        "templates": list(found.values()),
        "shadowed": shadowed,
        "orphaned": orphaned,
        "unreachable": unreachable,
        "missing": missing,
        "tool_sources": tool_sources,
    }


def owned_by(template: dict, agent: str) -> bool:
    """Whether `agent` offers the template: it names the agent, or it names none and sits in the agent's skill."""
    if template["agents"]:
        return agent in template["agents"]
    return "://" not in template["file"] and Path(template["file"]).resolve().parent.parent.name == agent


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="List the templates in a set of libraries.")
    parser.add_argument("sources", nargs="*")
    parser.add_argument("--root", action="append", default=[], help="a skills folder to search for module templates")
    parser.add_argument("--folder", default=MODULE_FOLDER, help="the templates folder in each module record")
    parser.add_argument("--agent", help="keep only the templates this agent skill offers")
    args = parser.parse_args(argv)
    if not args.sources and not args.root:
        parser.print_usage(sys.stderr)
        return 2
    result = scan(args.sources + module_libraries(args.root, args.folder))
    if args.agent:
        result["templates"] = [t for t in result["templates"] if owned_by(t, args.agent)]
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
