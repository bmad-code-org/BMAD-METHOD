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
        text = text[: match.start()] + replacement + text[match.end() :]
    # Removed blocks leave runs of blank lines behind; keep at most one.
    return re.sub(r"\n{3,}", "\n\n", text), kept, removed


def process_variables(text: str, variables: dict[str, str]) -> tuple[str, list[str]]:
    """Replace {name} for every name in variables; return (text, names substituted)."""
    substituted: list[str] = []
    for name, value in variables.items():
        placeholder = "{" + name + "}"
        if placeholder in text:
            text = text.replace(placeholder, value)
            substituted.append(name)
    return text, substituted


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
    content, substituted = process_variables(content, dict(args.var))

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
