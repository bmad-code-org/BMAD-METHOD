#!/usr/bin/env python3
"""Resolve BMad's four central TOML layers to JSON."""

import argparse
import json
import sys
from pathlib import Path

from config_utils import ConfigError, load_central_config


_MISSING = object()


def extract_key(data, dotted_key: str):
    current = data
    for part in dotted_key.split("."):
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return _MISSING
    return current


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Resolve BMad central config using four-layer TOML merge."
    )
    parser.add_argument(
        "--project-root",
        "-p",
        required=True,
        help="Absolute project root containing _bmad/",
    )
    parser.add_argument(
        "--key",
        "-k",
        action="append",
        default=[],
        help="Dotted field path to resolve (repeatable). Omit for full dump.",
    )
    args = parser.parse_args()

    try:
        merged = load_central_config(Path(args.project_root).resolve())
    except ConfigError as error:
        sys.stderr.write(f"error: {error}\n")
        return 1

    output = merged
    if args.key:
        output = {}
        for key in args.key:
            value = extract_key(merged, key)
            if value is not _MISSING:
                output[key] = value
    sys.stdout.write(json.dumps(output, indent=2, ensure_ascii=False) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
