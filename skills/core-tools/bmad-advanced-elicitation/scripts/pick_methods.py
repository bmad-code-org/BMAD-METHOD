#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Serve the elicitation method catalog without loading it all into context.

The catalog is a CSV (num, direction, method_name, description, form, tier, aliases).
`direction` is what the push does to the draft, one of six keys (see DIRECTIONS);
`description` is a one-line gist; `form` says what the method's output looks like
and is quoted verbatim into a push's brief; `tier` is `core` (recommended) or
`more` (kept so a method asked for by name resolves); `aliases` lists earlier names
of the method, separated by semicolons, so an old name still finds it.

Commands:
  directions                      the six directions with core/more counts, the cheap map
  list [--direction D ...] [--tier T] [--all]
                                  num, direction, name and gist; --all for the whole catalog
  show NAME_OR_NUM [...]          full rows, form included, for a brief
  random [-n N] [--direction D ...] [--tier T] [--exclude NAME ...] [--spread]
                                  a random draw; --spread takes at most one per direction

`list` refuses to run with neither --direction, --tier nor --all so dumping the
whole catalog into context is always deliberate.

`--customization SPEC` takes the merged customization as resolve_customization.py
prints it (`-` for stdin, or a path): `methods_file` becomes the catalog, with
`{skill-root}` and `{project-root}` (from --project-root) bound by this script,
and `additional_methods` is merged in; each of those needs a `code`.
`--extra SPEC` merges a bare JSON array of methods (a literal starting with `[`,
or a path). Each method carries method_name, description and form, plus direction
and tier when known. A missing direction files under `custom`; an unknown
direction or tier is an error. Older rows are accepted: `output_pattern` stands
in for a missing form, and unknown keys, `category` among them, are ignored. An extra whose method_name matches a
catalog row or one of its aliases (case-insensitive) REPLACES it and keeps that
row's num; others append and get the next free nums.

Default output is lean tab-separated text for an LLM to read; --json for structured.
"""

import argparse
import csv
import json
import random
import sys
from pathlib import Path

DEFAULT_FILE = Path(__file__).resolve().parent.parent / "assets" / "methods.csv"
FIELDS = ("num", "direction", "method_name", "description", "form", "tier", "aliases")
REQUIRED_FIELDS = ("method_name", "description", "form")
# Ordered: the order the directions are presented in. `custom` holds rows whose
# direction is not one of the six.
DIRECTIONS = {
    "wrong": "Find what is wrong",
    "missing": "Find what is missing",
    "premise": "Challenge the premise",
    "simplify": "Simplify or re-pitch",
    "future": "Stress against the future",
    "other-side": "Argue the other side",
    "custom": "Custom",
}
TIERS = ("core", "more")


def normalize(row: dict) -> dict:
    """Coerce any row, shipped or extra, old columns or new, into FIELDS. An
    unknown direction or tier is an error; a missing tier is core."""
    get = lambda k: str(row.get(k) or "").strip()  # noqa: E731
    out = {k: get(k) for k in FIELDS}
    name = out["method_name"] or get("code") or "unnamed"
    given = out["direction"]
    out["direction"] = given.lower()
    if given and out["direction"] not in DIRECTIONS:
        raise ValueError(f"{name}: direction {given!r} is not one of {'/'.join(DIRECTIONS)}")
    if not given:
        # An older row carries `category`, which is not a direction: it files under custom.
        out["direction"] = "custom"
    out["form"] = out["form"] or get("output_pattern")
    tier = out["tier"].lower()
    if tier and tier not in TIERS:
        raise ValueError(f"{name}: tier {tier!r} is not one of {'/'.join(TIERS)}")
    out["tier"] = tier or "core"
    out["code"] = get("code")  # kept for traceability
    return out


def load(file: Path) -> list[dict]:
    # utf-8-sig: tolerate BOM-prefixed catalogs (Excel "CSV UTF-8", Notepad)
    with open(file, newline="", encoding="utf-8-sig") as f:
        rows = [normalize(r) for r in csv.DictReader(f)]
    for n, row in enumerate(rows, 2):
        for field in REQUIRED_FIELDS:
            if not row[field]:
                raise ValueError(f"{file} line {n} ({row['method_name'] or 'unnamed'}) is missing {field}")
    return rows


def read_spec(spec: str):
    """A JSON literal, `-` for stdin, or a path to a JSON file."""
    if spec == "-":
        text = sys.stdin.read()
        if not text.strip():
            raise ValueError("nothing arrived on stdin; did the resolver fail?")
        return json.loads(text)
    if spec.lstrip().startswith(("[", "{")):
        return json.loads(spec)
    return json.loads(Path(spec).read_text(encoding="utf-8-sig"))


def load_customization(spec: str, skill_root: Path, project_root: Path | None = None) -> tuple[Path | None, list[dict]]:
    """Read resolve_customization.py output: (methods_file, additional_methods).
    The `workflow` wrapper is optional; `{skill-root}` and `{project-root}` in
    methods_file are bound here. Every additional method needs a `code`, the key
    the override layers merge on; without one the whole array degrades to append."""
    data = read_spec(spec)
    if not isinstance(data, dict):
        raise ValueError("--customization must be a JSON object")
    table = data.get("workflow", data)
    if not isinstance(table, dict):
        raise ValueError("--customization: `workflow` must be a JSON object")
    methods_file = str(table.get("methods_file") or "").strip()
    if methods_file and "{project-root}" in methods_file:
        if project_root is None:
            raise ValueError("methods_file uses {project-root}; pass --project-root")
        methods_file = methods_file.replace("{project-root}", str(project_root))
    path = Path(methods_file.replace("{skill-root}", str(skill_root))) if methods_file else None
    extras = table.get("additional_methods") or []
    rows = load_extra(json.dumps(extras))
    for r in rows:
        if not r["code"]:
            raise ValueError(f"additional method {r['method_name']} has no code; every entry needs one")
    return path, rows


def load_extra(spec: str) -> list[dict]:
    """Parse the --extra overlay: a JSON array literal, `-` for stdin, or a path."""
    data = read_spec(spec)
    if not isinstance(data, list):
        raise ValueError("--extra must be a JSON array of objects")
    rows = []
    for n, item in enumerate(data, 1):
        if not isinstance(item, dict):
            raise ValueError(f"each --extra entry must be a JSON object, got: {item!r}")
        row = normalize(item)
        for field in REQUIRED_FIELDS:
            if not row[field]:
                name = row["method_name"] or row["code"] or "unnamed"
                raise ValueError(f"--extra entry {n} ({name}) is missing {field}")
        rows.append(row)
    return rows


def merge_extra(rows: list[dict], extras: list[dict]) -> list[dict]:
    """Extras replace a catalog row with the same method_name or alias (case-insensitive),
    otherwise append. A replacement inherits the shipped row's num and keeps its
    names as aliases, so a request by the current or an old name still finds it;
    appended extras get the next free nums, so every method stays addressable by number."""
    merged = list(rows)
    index = {r["method_name"].lower(): i for i, r in enumerate(merged)}
    for i, r in enumerate(rows):
        for a in names_of(r)[1:]:
            index.setdefault(a, i)
    for e in extras:
        key = e["method_name"].lower()
        if key in index:
            old = merged[index[key]]
            e = dict(e)
            e["num"] = e["num"] or old["num"]
            kept = dict.fromkeys(n for n in names_of(old) + names_of(e)[1:] if n != key)
            e["aliases"] = "; ".join(kept)
            for n in kept:
                index[n] = index[key]
            merged[index[key]] = e
        else:
            index[key] = len(merged)
            merged.append(dict(e))
    next_num = max((int(r["num"]) for r in merged if r["num"].isdigit()), default=0) + 1
    seen = {}
    for r in merged:
        if not r["num"]:
            r["num"] = str(next_num)
            next_num += 1
        if r["num"] in seen:
            raise ValueError(f"num {r['num']} is used by both {seen[r['num']]} and {r['method_name']}")
        seen[r["num"]] = r["method_name"]
    return merged


def directions(rows: list[dict]) -> list[tuple[str, str, int, int]]:
    """(key, label, core count, more count) in presentation order; empty ones left out."""
    counts: dict[str, list[int]] = {}
    for r in rows:
        c = counts.setdefault(r["direction"], [0, 0])
        c[0 if r["tier"] == "core" else 1] += 1
    return [(k, label, *counts[k]) for k, label in DIRECTIONS.items() if k in counts]


def filter_rows(rows: list[dict], dirs: list[str] | None = None, tier: str | None = None) -> list[dict]:
    out = rows
    if dirs:
        wanted = {d.lower() for d in dirs}
        out = [r for r in out if r["direction"] in wanted]
    if tier:
        out = [r for r in out if r["tier"] == tier.lower()]
    return out


def names_of(row: dict) -> list[str]:
    """The method_name, then each alias, lowercased."""
    return [row["method_name"].lower()] + [a.strip().lower() for a in row.get("aliases", "").split(";") if a.strip()]


def find(rows: list[dict], names: list[str]) -> tuple[list[dict], list[str]]:
    """Match each query by method_name, alias or num, case-insensitively; a current name wins over an alias."""
    by_key: dict[str, dict] = {}
    for r in rows:
        by_key[r["method_name"].lower()] = r
    for r in rows:
        for a in names_of(r)[1:]:
            by_key.setdefault(a, r)
        if r["num"]:
            by_key.setdefault(r["num"], r)
    found, missing = [], []
    for n in names:
        r = by_key.get(n.strip().lower())
        (found if r else missing).append(r if r else n)
    return found, missing


def exclude(rows: list[dict], names: list[str] | None) -> list[dict]:
    if not names:
        return rows
    skip = {n.strip().lower() for n in names}
    return [r for r in rows if r["method_name"].lower() not in skip]


def spread_sample(rows: list[dict], n: int, rng: random.Random | None = None) -> list[dict]:
    """Draw n methods with maximum direction diversity: shuffle the directions,
    take one random method per direction round-robin, wrapping only when there
    are fewer directions than picks."""
    rng = rng or random
    by_dir: dict[str, list[dict]] = {}
    for r in rows:
        by_dir.setdefault(r["direction"], []).append(r)
    buckets = list(by_dir.values())
    rng.shuffle(buckets)
    for b in buckets:
        rng.shuffle(b)
    out: list[dict] = []
    while buckets and len(out) < n:
        exhausted = []
        for b in buckets:
            if len(out) >= n:
                break
            out.append(b.pop())
            if not b:
                exhausted.append(b)
        buckets = [b for b in buckets if b not in exhausted]
    return out


def fmt_directions(dirs: list[tuple[str, str, int, int]], as_json: bool) -> str:
    if as_json:
        return json.dumps([{"direction": k, "label": label, "core": c, "more": m} for k, label, c, m in dirs])
    return "\n".join(f"{k}\t{label}\t{c} core\t{m} more" for k, label, c, m in dirs)


def fmt_rows(rows: list[dict], as_json: bool, full: bool = False) -> str:
    if as_json:
        return json.dumps([{k: r[k] for k in FIELDS} for r in rows])
    if full:
        return "\n".join(
            f"{r['num']}\t{r['direction']}\t{r['method_name']}\t{r['description']}\tform: {r['form']}\t{r['tier']}"
            for r in rows
        )
    return "\n".join(f"{r['num']}\t{r['direction']}\t{r['method_name']}\t{r['description']}\t{r['tier']}" for r in rows)


def main(argv: list[str] | None = None) -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")  # don't die on locale code pages
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument(
        "--file", type=Path, help="method CSV (default: the customization's methods_file, else assets/methods.csv)"
    )
    p.add_argument("--customization", help="resolve_customization.py output: `-` for stdin, or a path")
    p.add_argument("--project-root", type=Path, help="binds {project-root} in the customization's methods_file")
    p.add_argument("--extra", help="additional methods: a JSON array literal, `-` for stdin, or a path")
    p.add_argument("--json", action="store_true", help="emit structured JSON instead of lean text")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("directions", help="the directions with core/more counts")
    pl = sub.add_parser("list", help="the index for chosen directions (needs --direction, --tier or --all)")
    pl.add_argument(
        "--direction",
        action="append",
        type=str.lower,
        choices=list(DIRECTIONS),
        help="filter to a direction (repeatable)",
    )
    pl.add_argument("--tier", choices=TIERS, help="filter to core or more")
    pl.add_argument("--all", action="store_true", help="dump the entire catalog (deliberate; large)")
    ps = sub.add_parser("show", help="full row, form included, for each named method")
    ps.add_argument("names", nargs="+", help="method names or nums")
    pr = sub.add_parser("random", help="draw methods at random")
    pr.add_argument("-n", type=int, default=1, help="how many (default 1)")
    pr.add_argument(
        "--direction",
        action="append",
        type=str.lower,
        choices=list(DIRECTIONS),
        help="restrict to a direction (repeatable)",
    )
    pr.add_argument("--tier", choices=TIERS, help="restrict to core or more")
    pr.add_argument("--exclude", action="append", help="method name to skip (repeatable), e.g. already offered")
    pr.add_argument("--spread", action="store_true", help="at most one per direction")
    args = p.parse_args(argv)

    extras: list[dict] = []
    file = args.file
    try:
        if args.customization:
            custom_file, extras = load_customization(
                args.customization, Path(__file__).resolve().parent.parent, args.project_root
            )
            file = file or custom_file
        if args.extra:
            extras += load_extra(args.extra)
    except (OSError, ValueError) as e:
        print(f"error: could not read customization: {e}", file=sys.stderr)
        return 2
    file = file or DEFAULT_FILE
    if not file.is_file():
        print(f"error: method file not found: {file}", file=sys.stderr)
        return 2
    try:
        rows = merge_extra(load(file), extras)
    except ValueError as e:
        print(f"error: bad catalog: {e}", file=sys.stderr)
        return 2

    if args.cmd == "directions":
        print(fmt_directions(directions(rows), args.json))
    elif args.cmd == "list":
        if not args.direction and not args.tier and not args.all:
            print(
                "error: `list` needs --direction or --tier, or --all to dump the whole catalog on purpose. "
                "Use `directions` for the cheap map, or `random` to draw blind.",
                file=sys.stderr,
            )
            return 2
        print(fmt_rows(filter_rows(rows, args.direction, args.tier), args.json))
    elif args.cmd == "show":
        found, missing = find(rows, args.names)
        for m in missing:
            print(f"# not found: {m}", file=sys.stderr)
        if not found:
            return 1
        print(fmt_rows(found, args.json, full=True))
    elif args.cmd == "random":
        pool = exclude(filter_rows(rows, args.direction, args.tier), args.exclude)
        if not pool:
            print("# no methods match", file=sys.stderr)
            return 1
        n = max(0, min(args.n, len(pool)))  # clamp: never crash on a negative or oversized -n
        picks = spread_sample(pool, n) if args.spread else random.sample(pool, n)
        print(fmt_rows(picks, args.json, full=True))
    return 0


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
