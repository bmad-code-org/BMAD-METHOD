#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Serve the brainstorming technique library without loading it all into context.

The library is a CSV (category, technique_name, description, detail). `description`
is a short gist — enough to propose and run most techniques. `detail` is optional:
a path (relative to the CSV's directory) to a fuller instruction file for a technique
complex enough to warrant one. Only `show` resolves detail files, and only for the
technique asked for — so the heavy material never enters context until it is run.

Commands:
  categories                 list category names + counts (the cheap entry point)
  list [--category C ...]     the index: category / name / gist, optionally filtered
  show NAME [NAME ...]        full gist for each, inlining its detail file if it has one
  random [--category C] [-n N]  pick N at random (optionally within categories)

Default output is lean text for an LLM to read; pass --json for structured output.
"""
import argparse
import csv
import json
import random
import sys
from pathlib import Path

DEFAULT_FILE = Path(__file__).resolve().parent.parent / "assets" / "brain-methods.csv"
FIELDS = ("category", "technique_name", "description", "detail")


def load(file: Path) -> list[dict]:
    with open(file, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        r.setdefault("detail", "")
        r["detail"] = (r.get("detail") or "").strip()
    return rows


def categories(rows: list[dict]) -> list[tuple[str, int]]:
    counts: dict[str, int] = {}
    for r in rows:
        counts[r["category"]] = counts.get(r["category"], 0) + 1
    return sorted(counts.items())


def filter_cats(rows: list[dict], cats: list[str] | None) -> list[dict]:
    if not cats:
        return rows
    wanted = {c.lower() for c in cats}
    return [r for r in rows if r["category"].lower() in wanted]


def find(rows: list[dict], names: list[str]) -> tuple[list[dict], list[str]]:
    by_name = {r["technique_name"].lower(): r for r in rows}
    found, missing = [], []
    for n in names:
        r = by_name.get(n.strip().lower())
        (found if r else missing).append(r if r else n)
    return found, missing


def resolve_detail(row: dict, csv_dir: Path) -> str | None:
    """Return the contents of a row's detail file, or None if there is no detail
    (or the file is missing — a missing file is reported to stderr, not fatal)."""
    if not row.get("detail"):
        return None
    path = (csv_dir / row["detail"]).resolve()
    if not path.is_file():
        print(f"# detail file not found for {row['technique_name']}: {row['detail']}", file=sys.stderr)
        return None
    return path.read_text(encoding="utf-8").strip()


def fmt_categories(cats: list[tuple[str, int]], as_json: bool) -> str:
    if as_json:
        return json.dumps([{"category": c, "count": n} for c, n in cats])
    return "\n".join(f"{c}\t{n}" for c, n in cats)


def fmt_list(rows: list[dict], as_json: bool) -> str:
    if as_json:
        return json.dumps([{k: r[k] for k in ("category", "technique_name", "description")} for r in rows])
    return "\n".join(f"{r['category']}\t{r['technique_name']}\t{r['description']}" for r in rows)


def fmt_show(rows: list[dict], csv_dir: Path, as_json: bool) -> str:
    if as_json:
        out = []
        for r in rows:
            d = resolve_detail(r, csv_dir)
            entry = {k: r[k] for k in ("category", "technique_name", "description")}
            if d:
                entry["detail"] = d
            out.append(entry)
        return json.dumps(out)
    blocks = []
    for r in rows:
        block = f"## {r['technique_name']}  [{r['category']}]\n{r['description']}"
        d = resolve_detail(r, csv_dir)
        if d:
            block += f"\n\n{d}"
        blocks.append(block)
    return "\n\n".join(blocks)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--file", type=Path, default=DEFAULT_FILE, help="technique CSV (default: sibling assets/brain-methods.csv)")
    p.add_argument("--json", action="store_true", help="emit structured JSON instead of lean text")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("categories", help="list category names + counts")
    pl = sub.add_parser("list", help="the index: category/name/gist")
    pl.add_argument("--category", action="append", help="filter to a category (repeatable)")
    ps = sub.add_parser("show", help="full gist + detail file for named techniques")
    ps.add_argument("names", nargs="+")
    pr = sub.add_parser("random", help="pick techniques at random")
    pr.add_argument("--category", action="append", help="restrict to a category (repeatable)")
    pr.add_argument("-n", type=int, default=1, help="how many (default 1)")
    args = p.parse_args(argv)

    if not args.file.is_file():
        print(f"error: technique file not found: {args.file}", file=sys.stderr)
        return 2
    rows = load(args.file)
    csv_dir = args.file.resolve().parent

    if args.cmd == "categories":
        print(fmt_categories(categories(rows), args.json))
    elif args.cmd == "list":
        print(fmt_list(filter_cats(rows, args.category), args.json))
    elif args.cmd == "show":
        found, missing = find(rows, args.names)
        for m in missing:
            print(f"# not found: {m}", file=sys.stderr)
        if not found:
            return 1
        print(fmt_show(found, csv_dir, args.json))
    elif args.cmd == "random":
        pool = filter_cats(rows, args.category)
        if not pool:
            print("# no techniques match", file=sys.stderr)
            return 1
        print(fmt_list(random.sample(pool, min(args.n, len(pool))), args.json))
    return 0


if __name__ == "__main__":
    sys.exit(main())
