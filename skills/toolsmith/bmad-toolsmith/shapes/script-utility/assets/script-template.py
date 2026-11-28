#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""{script} — {purpose}.

{What the script reads, what it writes, and the shape of its output. This docstring is the
`--help` text, so it is the whole reference: say what each result means.}

Exit codes: 0 with the result as JSON on stdout; 1 with a one-line reason on stderr.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


class ScriptError(Exception):
    """A failure the user can act on. Its message is the one line printed on exit."""


def run(path: Path, *, strict: bool = False) -> dict:
    """{The work. Return the result as a dict so main() can print it as JSON.}"""
    if not path.exists():
        raise ScriptError(f"not found: {path}")
    return {"path": str(path), "strict": strict}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("path", type=Path, help="{what the positional input is}")
    parser.add_argument("--strict", action="store_true", help="{what strict changes}")
    args = parser.parse_args(argv)
    try:
        result = run(args.path, strict=args.strict)
    except ScriptError as error:
        print(f"{parser.prog}: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
