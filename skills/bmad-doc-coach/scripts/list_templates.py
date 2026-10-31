#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""list-templates — list the document templates in a set of libraries.

Takes sources in search order; the first template with an id wins. A source is a local folder
or file, a GitHub URL (a repo, a /tree/ folder or a /blob/ file, with an optional @ref, read
through `gh`), a URL to one .md file, or a sentence naming a tool, which only the agent can
follow. Each --root is a skills folder; the `doc-templates/` folder of every module record in it
is searched after the sources. A file is a template when its frontmatter has `template:`, the
template's id. A missing local path adds nothing. `rubric` and `methods` are relative to the
template and come back resolved.

Prints JSON:
  templates     id, description, file, rubric, methods, source, in search order
  shadowed      id, file, source, kept: templates hidden by an earlier one with the same id
  unreachable   source, reason: sources that could not be read
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
from urllib.request import Request, urlopen

FRONTMATTER = re.compile(r"\A---[ \t]*\n(.*?)\n---[ \t]*(?:\n|\Z)", re.DOTALL)
KEY = re.compile(r"^([A-Za-z_]+):[ \t]*(.*?)[ \t]*$", re.MULTILINE)
GITHUB = re.compile(
    r"^https://github\.com/(?P<owner>[^/]+)/(?P<repo>[^/@]+?)(?:\.git)?"
    r"(?:/(?:tree|blob)/(?P<tree_ref>[^/@]+)(?:/(?P<path>[^@]*?))?)?/?(?:@(?P<ref>[^/]+))?/?$"
)
MODULE_FOLDER = "doc-templates"
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
    with urlopen(Request(url, headers={"User-Agent": "bmad-doc-coach"}), timeout=TIMEOUT) as response:
        return response.read().decode("utf-8-sig")


def github_files(m: re.Match) -> list[tuple[str, str]]:
    ref = m.group("ref") or m.group("tree_ref")
    query = f"?ref={quote(ref, safe='')}" if ref else ""
    repo = f"repos/{m.group('owner')}/{m.group('repo')}/contents"
    listing = json.loads(run_gh([f"{repo}/{quote(m.group('path') or '')}{query}"]))
    entries = listing if isinstance(listing, list) else [listing]
    return [
        (e["html_url"], run_gh(["-H", "Accept: application/vnd.github.raw", f"{repo}/{quote(e['path'])}{query}"]))
        for e in entries
        if e["type"] == "file" and e["name"].endswith(".md")
    ]


def read_source(source: str) -> list[tuple[str, str]]:
    """(file, text) for each markdown file a source holds."""
    if "://" not in source:
        path = Path(source)
        files = sorted(path.glob("*.md")) if path.is_dir() else [path]
        return [(str(f), f.read_text(encoding="utf-8-sig")) for f in files]
    m = GITHUB.match(source)
    if m:
        return github_files(m)
    if urlsplit(source).path.endswith(".md"):
        return [(source, fetch_url(source))]
    raise ValueError("a plain URL cannot be listed; point at one .md file or name a tool")


def beside(file: str, value: str) -> str:
    """`value`, a path relative to the template `file`, made usable from anywhere."""
    if not value or "://" in value or Path(value).is_absolute():
        return value
    return urljoin(file, value) if "://" in file else str(Path(file).parent / value)


def module_libraries(roots: list[str]) -> list[str]:
    """The `doc-templates/` folder of each module record, once each, roots in order."""
    libraries: dict[Path, str] = {}
    for root in roots:
        for folder in sorted(Path(root).glob(f"*/{MODULE_FOLDER}")):
            try:
                record = tomllib.loads((folder.parent / "bmod.toml").read_text(encoding="utf-8"))
            except (OSError, ValueError):
                continue
            if "bmod" in record:
                libraries.setdefault(folder.resolve(), str(folder))
    return list(libraries.values())


def scan(sources: list[str]) -> dict:
    found: dict[str, dict] = {}
    shadowed, unreachable, tool_sources = [], [], []
    for source in sources:
        if "://" not in source and not Path(source).exists():
            if any(c.isspace() for c in source.strip()):
                tool_sources.append(source)
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
            template_id = meta.get("template")
            if not template_id:
                continue
            if template_id in found:
                kept = found[template_id]["file"]
                shadowed.append({"id": template_id, "file": file, "source": source, "kept": kept})
                continue
            found[template_id] = {
                "id": template_id,
                "description": meta.get("description", ""),
                "file": file,
                "rubric": beside(file, meta.get("rubric", "")),
                "methods": beside(file, meta.get("methods", "")),
                "source": source,
            }
    return {
        "templates": list(found.values()),
        "shadowed": shadowed,
        "unreachable": unreachable,
        "tool_sources": tool_sources,
    }


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="List the document templates in a set of libraries.")
    parser.add_argument("sources", nargs="*")
    parser.add_argument("--root", action="append", default=[], help="a skills folder to search for module templates")
    args = parser.parse_args(argv)
    if not args.sources and not args.root:
        parser.print_usage(sys.stderr)
        return 2
    print(json.dumps(scan(args.sources + module_libraries(args.root)), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
