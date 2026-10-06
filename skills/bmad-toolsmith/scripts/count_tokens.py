#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["tiktoken"]
# ///
"""count_tokens: the one length metric for skill authoring.

Counts tokens with tiktoken's cl100k_base encoding. When tiktoken is not
installed it falls back to len(text) // 4 and says so, so the script runs
under a bare interpreter too.

Usage:
  count_tokens.py <path> [<path> ...]   files, or directories recursed for text files
  count_tokens.py --stdin               count the text read from stdin

Output, one JSON object on stdout:
  {"files": [{"path": str, "tokens": int}, ...], "total": int, "method": "tiktoken" | "fallback"}
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ENCODING = "cl100k_base"
TEXT_SUFFIXES = {".md", ".py", ".toml", ".yaml", ".yml", ".json", ".txt", ".csv", ".html", ".sh", ".cfg", ".ini"}
SKIP_DIRS = {".git", "__pycache__", ".pytest_cache", "node_modules", ".venv", "venv"}


def count_tokens(text: str) -> tuple[int, str]:
    """Return (token_count, method); method is "fallback" when tiktoken is unavailable."""
    try:
        import tiktoken
    except Exception:
        return len(text) // 4, "fallback"
    try:
        enc = tiktoken.get_encoding(ENCODING)
    except Exception:
        return len(text) // 4, "fallback"
    return len(enc.encode(text)), "tiktoken"


def iter_text_files(root: Path):
    """Yield text files under root, skipping noise directories and hidden files."""
    # Sorted by the posix string so the order is the same on every OS; Path sorts case-insensitively on Windows.
    for path in sorted(root.rglob("*"), key=lambda p: p.relative_to(root).as_posix()):
        if not path.is_file():
            continue
        parts = path.relative_to(root).parts
        if any(part in SKIP_DIRS or part.startswith(".") for part in parts):
            continue
        if path.suffix.lower() in TEXT_SUFFIXES:
            yield path


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="replace")


def count_paths(paths: list[Path]) -> dict:
    files = []
    method = "tiktoken"
    for given in paths:
        targets = list(iter_text_files(given)) if given.is_dir() else [given]
        for target in targets:
            tokens, used = count_tokens(read_text(target))
            if used == "fallback":
                method = "fallback"
            files.append({"path": str(target), "tokens": tokens})
    return {"files": files, "total": sum(f["tokens"] for f in files), "method": method}


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("paths", nargs="*", type=Path, help="files or directories to count")
    p.add_argument("--stdin", action="store_true", help="read text from stdin instead of paths")
    args = p.parse_args(argv)

    if args.stdin and args.paths:
        p.error("provide paths or --stdin, not both")
    if not args.stdin and not args.paths:
        p.error("provide at least one path or --stdin")

    if args.stdin:
        tokens, method = count_tokens(sys.stdin.read())
        result = {"files": [{"path": "<stdin>", "tokens": tokens}], "total": tokens, "method": method}
    else:
        missing = [str(path) for path in args.paths if not path.exists()]
        if missing:
            p.error(f"not found: {', '.join(missing)}")
        result = count_paths(args.paths)

    print(json.dumps(result))
    return 0


if __name__ == "__main__":
    sys.exit(main())
