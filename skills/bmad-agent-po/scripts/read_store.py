#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Read the ticket store's config without loading the rest into context.

The config is two layers. The base is the skill's starter for the store, `config/<store>-ticketing.toml`.
Over it goes the project's `_bmad/custom/ticketing-store-config.toml`: its `[tickets] store` names the
store, and any other key it sets replaces the starter's, tables merging key by key. With no project file
the store is `repo`. A store with no starter is read from the project file alone.

  read_store.py --project-root <root> [-k <dotted key> ...]
  read_store.py --starters

One key prints its value, a string bare and anything else as JSON; several print one JSON object; none
prints the whole merged config. `--starters` prints each shipped store with its description.
Exit 1 when a file cannot be read, 2 when a key is missing.
"""

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

_MISSING = object()
STARTERS = Path(__file__).resolve().parents[1] / "config"
PROJECT_FILE = Path("_bmad") / "custom" / "ticketing-store-config.toml"
STORE_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


def load(path: Path) -> dict:
    # utf-8-sig: Windows editors can save a byte-order mark.
    return tomllib.loads(path.read_text(encoding="utf-8-sig"))


def merge(base: dict, over: dict) -> dict:
    out = dict(base)
    for key, value in over.items():
        out[key] = merge(out[key], value) if isinstance(value, dict) and isinstance(out.get(key), dict) else value
    return out


def store_config(project_root: Path, starters: Path) -> dict:
    path = project_root / PROJECT_FILE
    project = load(path) if path.is_file() else {}
    tickets = project.get("tickets")
    store = tickets.get("store") if isinstance(tickets, dict) else None
    if not isinstance(store, str) or not store:
        store = "repo"  # as tickets.py reads it
    starter = starters / f"{store}-ticketing.toml"
    config = merge(load(starter), project) if STORE_RE.match(store) and starter.is_file() else project
    if isinstance(config.get("tickets"), dict):
        config["tickets"]["store"] = store
    return config


def extract(data, dotted: str):
    current = data
    for part in dotted.split("."):
        if isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return _MISSING
    return current


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--project-root", help="project holding _bmad/")
    parser.add_argument("--key", "-k", action="append", default=[], help="dotted key (repeatable)")
    parser.add_argument("--starters", action="store_true", help="list the shipped stores and their descriptions")
    parser.add_argument(
        "--starters-dir", default=str(STARTERS), help="folder of starters; default: the skill's config/"
    )
    args = parser.parse_args()
    starters = Path(args.starters_dir).expanduser()

    try:
        if args.starters:
            found = {}
            for path in sorted(starters.glob("*-ticketing.toml")):
                data = load(path)
                found[data.get("tickets", {}).get("store", path.name)] = data.get("description", "")
            print(json.dumps(found, indent=2, ensure_ascii=False))
            return 0
        if not args.project_root:
            parser.error("--project-root is required")
        data = store_config(Path(args.project_root).expanduser(), starters)
    except (OSError, ValueError) as error:  # ValueError covers a TOML or encoding failure
        sys.stderr.write(f"error: cannot read the store config: {error}\n")
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
