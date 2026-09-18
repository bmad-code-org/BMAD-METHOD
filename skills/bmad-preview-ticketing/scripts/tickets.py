#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""tickets — read a folder of ticket files and answer what is next.

A container folder holds its own ticket file, its spec, and flat leaf files named
`<type>-<nn>-<slug>.md`. Each leaf's frontmatter is the record: `status` (mirrored from the
tracker when one is configured), `blocked_by` (numbers, file names, or ids of sibling
tickets; a dropped blocker still blocks until the dependency is removed or repointed), `refined`, `hitl`, `covers`, `estimate`. The container's `## Breakdown` section lists
the agreed entries, `- nn type — title; blocked_by: nn, nn; covers: ids`; an entry with no leaf file
yet is reported under `to_create` once its blockers are done. Nothing else indexes them; this
script derives the view at read time.

  next   <dir>                   tickets whose blockers are done, grouped by state
  status <dir>                   every ticket in number order, counts, longest remaining chain
  mark   <ticket-file> <status>  set a leaf's frontmatter status (repo store only)

`--project-root` names the project holding `_bmad/` when the tickets live outside it.

Output is one JSON object on stdout. Exit 0 on success, 1 on a malformed ticket, 2 when
the store forbids the operation.
"""

import argparse
import json
import re
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

STATUSES = ("draft", "backlog", "in-progress", "review", "done", "dropped")
LEAF_TYPES = ("story", "spike", "bug")
CONTAINER_TYPES = ("initiative", "epic")
NAME_RE = re.compile(r"^(story|spike|bug)-(\d+)-(.+)\.md$")
BREAKDOWN_RE = re.compile(r"^-\s*(\d+)\s+(story|spike|bug)\s+[—–-]\s+(.+?)\s*$")
BREAKDOWN_ENTRY_RE = re.compile(r"^-\s*\d+\s")


class TicketError(Exception):
    pass


class StoreRefusal(Exception):
    pass


# ---------------------------------------------------------------- frontmatter


def parse_frontmatter(text: str) -> dict:
    """Minimal YAML subset: `key: value`, lists as `[a, b]`, quoted or bare scalars."""
    m = re.match(r"\A---\n(.*?)\n---(?:\n|\Z)", text, re.S)
    if not m:
        return {}
    data = {}
    for line in m.group(1).splitlines():
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        value = value.split("   #")[0].strip()
        data[key.strip()] = _scalar(value)
    return data


def _scalar(value: str):
    if value.startswith("[") and value.endswith("]"):
        inner = value[1:-1].strip()
        return [] if not inner else [_scalar(v.strip()) for v in inner.split(",")]
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        return value[1:-1]
    if value in ("true", "false"):
        return value == "true"
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    return value


def set_frontmatter_value(text: str, key: str, value: str) -> str:
    m = re.match(r"\A---\n(.*?)\n---(?:\n|\Z)", text, re.S)
    if not m:
        raise TicketError("ticket has no frontmatter")
    block = m.group(1)
    pattern = re.compile(rf"^{re.escape(key)}:.*$", re.M)
    if not pattern.search(block):
        raise TicketError(f"frontmatter has no `{key}`")
    return text[: m.start(1)] + pattern.sub(lambda _: f"{key}: {value}", block, count=1) + text[m.end(1) :]


# ---------------------------------------------------------------- tickets


def load_tickets(folder: Path) -> list[dict]:
    tickets = []
    for path in sorted(folder.glob("*.md")):
        name_match = NAME_RE.match(path.name)
        fm = parse_frontmatter(path.read_text(encoding="utf-8"))
        if fm.get("type") not in LEAF_TYPES:
            continue
        status = fm.get("status", "")
        if status not in STATUSES:
            raise TicketError(f"{path.name}: status {status!r} is not one of {', '.join(STATUSES)}")
        raw_blockers = fm.get("blocked_by", [])
        if not isinstance(raw_blockers, list):
            raise TicketError(f"{path.name}: blocked_by must be a list")
        tickets.append(
            {
                "file": path.name,
                "n": int(name_match.group(2)) if name_match else None,
                "type": fm.get("type"),
                "id": str(fm.get("id", "") or ""),
                "title": str(fm.get("title", "") or ""),
                "status": status,
                "assignee": str(fm.get("assignee", "") or ""),
                "refined": str(fm.get("refined", False)).lower() == "true",
                "hitl": str(fm.get("hitl", False)).lower() == "true",
                "covers": [str(c) for c in fm.get("covers", [])] if isinstance(fm.get("covers"), list) else [],
                "estimate": fm.get("estimate", ""),
                "blocked_at": fm.get("blocked_at", ""),
                "raw_blocked_by": raw_blockers,
            }
        )
    seen = {}
    for t in tickets:
        if t["n"] is not None and t["n"] in seen:
            raise TicketError(f"{seen[t['n']]} and {t['file']} share the number {t['n']:02d}")
        seen[t["n"]] = t["file"]
    _resolve_blockers(tickets)
    _check_cycles(tickets)
    return sorted(tickets, key=lambda t: (t["n"] is None, t["n"] or 0, t["file"]))


def _resolve_blockers(tickets: list[dict]) -> None:
    by_n = {t["n"]: t["file"] for t in tickets if t["n"] is not None}
    by_file = {t["file"]: t["file"] for t in tickets}
    by_stem = {t["file"][:-3]: t["file"] for t in tickets}
    by_id = {t["id"]: t["file"] for t in tickets if t["id"]}
    for t in tickets:
        resolved = []
        for ref in t["raw_blocked_by"]:
            key = ref if isinstance(ref, int) else str(ref)
            if isinstance(key, int):
                target = by_n.get(key) or by_id.get(str(key))
            else:
                target = by_file.get(key) or by_stem.get(key) or by_id.get(key)
            if target is None and isinstance(key, str) and re.fullmatch(r"\d+", key):
                target = by_n.get(int(key))
            if target is None:
                raise TicketError(f"{t['file']}: blocked_by {ref!r} matches no sibling ticket")
            resolved.append(target)
        t["blocked_by"] = resolved
        del t["raw_blocked_by"]


def load_breakdown(folder: Path) -> list[dict]:
    """Entries of the container file's `## Breakdown` section, in number order."""
    for path in sorted(folder.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        if parse_frontmatter(text).get("type") not in CONTAINER_TYPES:
            continue
        section = re.search(r"^## Breakdown\s*\n(.*?)(?=^## |\Z)", text, re.M | re.S)
        if not section:
            return []
        entries = []
        for line in section.group(1).splitlines():
            line = line.strip()
            m = BREAKDOWN_RE.match(line)
            if not m:
                if BREAKDOWN_ENTRY_RE.match(line):
                    raise TicketError(
                        f"{path.name}: Breakdown line does not match `- nn type — title; blocked_by: nn; covers: ids`: {line}"
                    )
                continue
            title, *fields = [part.strip() for part in m.group(3).split(";")]
            entry = {"n": int(m.group(1)), "type": m.group(2), "title": title, "blocked_by": [], "covers": []}
            for field in fields:
                key, _, value = field.partition(":")
                key = key.strip()
                if key == "blocked_by":
                    entry["blocked_by"] = [int(b) for b in re.findall(r"\d+", value)]
                elif key == "covers":
                    entry["covers"] = [c.strip() for c in value.split(",") if c.strip()]
                else:
                    raise TicketError(f"{path.name}: Breakdown line has unknown field `{key}`: {line}")
            entries.append(entry)
        numbers = [e["n"] for e in entries]
        for e in entries:
            if numbers.count(e["n"]) > 1:
                raise TicketError(f"{path.name}: Breakdown has two entries numbered {e['n']:02d}")
            for b in e["blocked_by"]:
                if b not in numbers:
                    raise TicketError(
                        f"{path.name}: Breakdown entry {e['n']:02d} is blocked_by {b:02d}, which is no entry"
                    )
        return sorted(entries, key=lambda e: e["n"])
    return []


def _check_cycles(tickets: list[dict]) -> None:
    graph = {t["file"]: t["blocked_by"] for t in tickets}
    state = {}

    def visit(node, path):
        if state.get(node) == "done":
            return
        if state.get(node) == "active":
            raise TicketError("cycle through " + " -> ".join(path + [node]))
        state[node] = "active"
        for b in graph[node]:
            visit(b, path + [node])
        state[node] = "done"

    for node in graph:
        visit(node, [])


# ---------------------------------------------------------------- views


def classify(tickets: list[dict]) -> dict:
    done = {t["file"] for t in tickets if t["status"] == "done"}
    groups = {"ready_to_refine": [], "ready_to_start": [], "in_progress": [], "blocked": []}
    for t in tickets:
        s = t["status"]
        if s in ("done", "dropped"):
            continue
        unblocked = all(b in done for b in t["blocked_by"]) and not t["blocked_at"]
        if s in ("in-progress", "review"):
            groups["in_progress"].append(t)
        elif not unblocked:
            groups["blocked"].append(t)
        elif not t["refined"]:
            groups["ready_to_refine"].append(t)
        else:
            groups["ready_to_start"].append(t)
    return groups


def to_create(tickets: list[dict], breakdown: list[dict]) -> list[dict]:
    """Breakdown entries with no leaf file whose blockers are all done."""
    by_n = {t["n"]: t for t in tickets if t["n"] is not None}
    return [
        e
        for e in breakdown
        if e["n"] not in by_n and all(b in by_n and by_n[b]["status"] == "done" for b in e["blocked_by"])
    ]


def longest_remaining_chain(tickets: list[dict]) -> list[str]:
    remaining = {t["file"]: t for t in tickets if t["status"] not in ("done", "dropped")}
    memo = {}

    def chain(f):
        if f in memo:
            return memo[f]
        best = []
        for b in remaining[f]["blocked_by"]:
            if b in remaining:
                c = chain(b)
                if len(c) > len(best):
                    best = c
        memo[f] = best + [f]
        return memo[f]

    longest = []
    for f in remaining:
        c = chain(f)
        if len(c) > len(longest):
            longest = c
    return longest


def public(t: dict) -> dict:
    return {
        k: t[k]
        for k in ("n", "file", "type", "id", "title", "status", "assignee", "hitl", "covers", "estimate", "blocked_by")
    }


# ---------------------------------------------------------------- store


def find_project_root(start: Path) -> Path | None:
    for p in [start, *start.parents]:
        if (p / "_bmad").is_dir():
            return p
    return None


def project_root_for(args, start: Path) -> Path | None:
    return Path(args.project_root).resolve() if args.project_root else find_project_root(start)


def store_name(project_root: Path | None) -> str:
    if not project_root:
        return "repo"
    cfg = project_root / "_bmad" / "custom" / "ticketing-store-config.toml"
    if not cfg.is_file():
        return "repo"
    return tomllib.loads(cfg.read_text(encoding="utf-8")).get("tickets", {}).get("store", "repo")


# ---------------------------------------------------------------- commands


def cmd_next(args) -> dict:
    folder = Path(args.dir).resolve()
    if not folder.is_dir():
        raise TicketError(f"not a folder: {folder}")
    store = store_name(project_root_for(args, folder))
    if store != "repo" and not args.synced:
        raise StoreRefusal(f"store is {store}: sync ticket status from the tracker first, then rerun with --synced")
    tickets = load_tickets(folder)
    groups = classify(tickets)
    return {
        "folder": folder.name,
        "store": store,
        **{k: [public(t) for t in v] for k, v in groups.items()},
        "to_create": to_create(tickets, load_breakdown(folder)),
    }


def cmd_status(args) -> dict:
    folder = Path(args.dir).resolve()
    if not folder.is_dir():
        raise TicketError(f"not a folder: {folder}")
    tickets = load_tickets(folder)
    breakdown = load_breakdown(folder)
    counts = {}
    for t in tickets:
        counts[t["status"]] = counts.get(t["status"], 0) + 1
    written = {t["n"] for t in tickets if t["n"] is not None}
    return {
        "folder": folder.name,
        "store": store_name(project_root_for(args, folder)),
        "tickets": [public(t) for t in tickets],
        "counts": {"total": len(tickets), **counts},
        "breakdown": {"entries": len(breakdown), "without_file": sum(1 for e in breakdown if e["n"] not in written)},
        "longest_remaining_chain": longest_remaining_chain(tickets),
    }


def cmd_mark(args) -> dict:
    path = Path(args.ticket_file).resolve()
    store = store_name(project_root_for(args, path.parent))
    if store != "repo":
        raise StoreRefusal(f"store is {store}: change status through the store's write verb, not this script")
    text = path.read_text(encoding="utf-8")
    if parse_frontmatter(text).get("type") not in LEAF_TYPES:
        raise TicketError(
            f"{path.name} is not a story, spike, or bug; containers close through the closure check, not mark"
        )
    text = set_frontmatter_value(text, "status", args.status)
    for key in ("blocked_at", "blocked_reason"):
        if parse_frontmatter(text).get(key):
            text = set_frontmatter_value(text, key, '""')
    if args.assignee is not None:
        text = set_frontmatter_value(text, "assignee", f'"{args.assignee}"')
    path.write_text(text, encoding="utf-8")
    fm = parse_frontmatter(text)
    return {"file": path.name, "status": fm.get("status"), "assignee": fm.get("assignee", "")}


def main() -> int:
    parser = argparse.ArgumentParser(description="Read a folder of tickets and answer what is next.")
    parser.add_argument("--project-root", help="project holding _bmad/; default: walk up from the ticket folder")
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("next", help="tickets whose blockers are done, by state")
    p.add_argument("dir")
    p.add_argument("--synced", action="store_true", help="tracker status was mirrored just now")
    p.set_defaults(func=cmd_next)
    p = sub.add_parser("status", help="every ticket resolved")
    p.add_argument("dir")
    p.set_defaults(func=cmd_status)
    p = sub.add_parser("mark", help="set a ticket's status (repo store only)")
    p.add_argument("ticket_file")
    p.add_argument("status", choices=STATUSES)
    p.add_argument("--assignee")
    p.set_defaults(func=cmd_mark)
    args = parser.parse_args()
    try:
        print(json.dumps(args.func(args), ensure_ascii=False))
        return 0
    except StoreRefusal as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        return 2
    except (TicketError, OSError, ValueError) as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
