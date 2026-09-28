#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Read named keys from a TOML file without loading the rest into context."""

import argparse
import json
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

_MISSING = object()


def load(source: str) -> dict:
    return tomllib.loads(Path(source).expanduser().read_text(encoding="utf-8"))


def extract(data, dotted: str):
    current = data
    for part in dotted.split("."):
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return _MISSING
    return current


def main() -> int:
    parser = argparse.ArgumentParser(description="Print selected keys from a TOML file.")
    parser.add_argument("--file", "-f", required=True, help="Path of the TOML file")
    parser.add_argument(
        "--key", "-k", action="append", default=[], help="Dotted key (repeatable). Omit for the whole file as JSON."
    )
    args = parser.parse_args()

    try:
        data = load(args.file)
    except Exception as error:  # noqa: BLE001 — any read or parse failure is reported the same way
        sys.stderr.write(f"error: cannot read {args.file}: {error}\n")
        return 1

    if not args.key:
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return 0

    found = {}
    missing = []
    for key in args.key:
        value = extract(data, key)
        (missing.append(key) if value is _MISSING else found.__setitem__(key, value))
    for key in missing:
        sys.stderr.write(f"missing: {key}\n")

    if len(args.key) == 1:
        if missing:
            return 2
        value = found[args.key[0]]
        print(value.rstrip("\n") if isinstance(value, str) else json.dumps(value, indent=2, ensure_ascii=False))
    else:
        print(json.dumps(found, indent=2, ensure_ascii=False))
    return 2 if missing else 0


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    raise SystemExit(main())
