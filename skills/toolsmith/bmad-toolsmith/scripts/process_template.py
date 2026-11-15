#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""process_template: fill a template's variables and conditional blocks.

Template syntax:
  {name}                 a variable; replaced when --var name=value is given, left alone otherwise
                         (unmatched tokens may be runtime tokens such as {project-root} or {agent.name})
  {if-X} ... {/if-X}     a conditional block; kept when X is in --true, removed whole otherwise.
                         Blocks nest; the innermost is resolved first.

Conditionals are resolved before variables, so a variable inside a removed block is never
substituted. A marker left after processing means a malformed or mismatched block that the
emitted file would carry verbatim: the script exits 3 and names the markers.

Usage:
  process_template.py <template> [-o <out>] [--var key=value ...] [--true COND ...] [--json]

Output: the processed text on stdout, or in the file named by -o. With -o, one JSON object
describing the run is printed on stdout; with --json and no -o it goes to stderr:
  {"output_file", "vars_substituted": [...], "conditions_true": [...], "conditions_false": [...],
   "tokens_remaining": [...]}
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

BLOCK_RE = re.compile(r"\{if-([a-zA-Z0-9_-]+)\}(.*?)\{/if-\1\}", re.DOTALL)
MARKER_RE = re.compile(r"\{/?if-[a-zA-Z0-9_-]+\}")
TOKEN_RE = re.compile(r"\{[a-zA-Z][a-zA-Z0-9_.-]*\}")
VAR_RE = re.compile(r"\{([^{}\s]+)\}")


def process_conditionals(text: str, true_conditions: set[str]) -> tuple[str, list[str], list[str]]:
    """Resolve {if-X}...{/if-X} blocks innermost first; return (text, kept, removed)."""
    kept: list[str] = []
    removed: list[str] = []
    while match := BLOCK_RE.search(text):
        condition = match.group(1)
        if condition in true_conditions:
            replacement = match.group(2)
            if condition not in kept:
                kept.append(condition)
        else:
            replacement = ""
            if condition not in removed:
                removed.append(condition)
        text = text[: match.start()] + SEAM + replacement + SEAM + text[match.end() :]
    return SEAM_RE.sub(close_seam, text), kept, removed


SEAM = "\x00"
SEAM_RE = re.compile(r"(\n*)((?:\x00\n*)+)")


def close_seam(match: re.Match[str]) -> str:
    """Where a block marker stood, keep the widest line break that touched it, so a removed block leaves the
    spacing around it (one blank line in prose, two between Python definitions) instead of adding its own."""
    runs = [len(match.group(1)), *(len(run) for run in match.group(2).split(SEAM)[1:])]
    return "\n" * max(runs)


def process_variables(text: str, variables: dict[str, str], toml: bool = False) -> tuple[str, list[str]]:
    """Replace {name} for every name in variables; return (text, names substituted).

    A token that is the whole of a quoted string gets its value escaped for that string: inside "..." a
    backslash and a double quote are backslashed (TOML, YAML and JSON agree); inside '...' outside TOML, a
    single quote is doubled (YAML). A TOML '...' literal cannot hold a single quote, so it is left as given."""
    substituted: list[str] = []

    def fill(match: re.Match[str]) -> str:
        name = match.group(1)
        if name not in variables:
            return match.group(0)
        if name not in substituted:
            substituted.append(name)
        value = variables[name]
        before, after = text[match.start() - 1 : match.start()], text[match.end() : match.end() + 1]
        if before == after == '"':
            return value.replace("\\", "\\\\").replace('"', '\\"')
        if before == after == "'" and not toml:
            return value.replace("'", "''")
        return value

    # One pass over the template: a token inside an inserted value stays as the author wrote it.
    return VAR_RE.sub(fill, text), substituted


def parse_var(raw: str) -> tuple[str, str]:
    key, sep, value = raw.partition("=")
    if not sep or not key:
        raise argparse.ArgumentTypeError(f"expected key=value, got {raw!r}")
    return key, value


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("template", type=Path, help="template file to process")
    p.add_argument("-o", "--output", type=Path, help="write the result here instead of stdout")
    p.add_argument(
        "--var", action="append", default=[], type=parse_var, metavar="key=value", help="variable (repeatable)"
    )
    p.add_argument(
        "--true", action="append", default=[], dest="true_conditions", metavar="COND", help="condition to keep"
    )
    p.add_argument("--json", action="store_true", help="print run metadata on stderr when writing to stdout")
    args = p.parse_args(argv)

    try:
        content = args.template.read_text(encoding="utf-8")
    except OSError as err:
        print(f"process_template: cannot read {args.template}: {err}", file=sys.stderr)
        return 2

    content, kept, removed = process_conditionals(content, set(args.true_conditions))
    content, substituted = process_variables(content, dict(args.var), toml=args.template.suffix == ".toml")

    leftover = sorted(set(MARKER_RE.findall(content)))
    if leftover:
        print(f"process_template: leftover conditional markers: {', '.join(leftover)}", file=sys.stderr)
        return 3

    metadata = {
        "output_file": str(args.output) if args.output else "<stdout>",
        "vars_substituted": substituted,
        "conditions_true": kept,
        "conditions_false": removed,
        "tokens_remaining": sorted(set(TOKEN_RE.findall(content))),
    }

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(content, encoding="utf-8")
        print(json.dumps(metadata))
    else:
        sys.stdout.write(content)
        if args.json:
            print(json.dumps(metadata), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
