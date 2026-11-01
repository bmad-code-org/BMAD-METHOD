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
and is listed. `rubric`, `methods` and `style` are relative to their file and come back resolved.

Prints JSON:
  templates     id, description, category, rubric, methods, output, style, file, source,
                extensions, in search order
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
FIELDS = ("description", "category", "rubric", "methods", "output", "style")
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
    """`value`, a path relative to `file`, made usable from anywhere."""
    if not value or "://" in value or value.startswith("{") or Path(value).is_absolute():
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


def fields(file: str, meta: dict[str, str]) -> dict[str, str]:
    """What a template or extension sets, with its paths resolved."""
    return {
        "description": meta.get("description", ""),
        "category": meta.get("category", ""),
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
                    {"file": file, "source": source, **fields(file, meta)}
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
            }
    for base, adding in extensions.items():
        template = found.get(base)
        if template is None:
            orphaned.extend({"extends": base, "file": e["file"], "source": e["source"]} for e in adding)
            continue
        template["extensions"] = [e["file"] for e in adding]
        for key in FIELDS:
            template[key] = next((e[key] for e in adding if e[key]), template[key])
    return {
        "templates": list(found.values()),
        "shadowed": shadowed,
        "orphaned": orphaned,
        "unreachable": unreachable,
        "missing": missing,
        "tool_sources": tool_sources,
    }


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="List the templates in a set of libraries.")
    parser.add_argument("sources", nargs="*")
    parser.add_argument("--root", action="append", default=[], help="a skills folder to search for module templates")
    parser.add_argument("--folder", default=MODULE_FOLDER, help="the templates folder in each module record")
    args = parser.parse_args(argv)
    if not args.sources and not args.root:
        parser.print_usage(sys.stderr)
        return 2
    print(json.dumps(scan(args.sources + module_libraries(args.root, args.folder)), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
