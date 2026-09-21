#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""tickets — read a ticket tree and answer what is next.

A container folder holds its ticket file, `tickets.toml`, and flat leaf files named
`<type>-<nn>-<slug>.md`. An epic's `tickets.toml` lists its planned leaves as `[[entry]]`
tables (`n`, `type`, `title`, `blocked_by`, and whatever else the plan records); an
initiative's lists its epics as `[[epic]]` tables (`slug`, `after = [{epic, needs}]`).
An entry with no leaf file is `planned`. A ticket needs refining before it starts only when its
entry says `refine = true` or it has no entry. Once the file exists its frontmatter is the
record: `status`, `assignee`, `refined`, `blocked_at`, and `blocked_by` when present.

`blocked_by` takes a sibling's number or file name, a ticket or epic id, `epic-<slug>/<nn>` for
an entry in another epic of the same initiative, or `epic-<slug>` for that whole epic. An epic
file's own `blocked_by` names epics and holds every ticket under it; rows show it as `gated_by`.
A dropped blocker still blocks.

  next   <dir>                   tickets whose blockers are done, grouped by state
  status <dir>                   every ticket in build order, what it blocks, counts, longest chain
  pull   <dir> <n>               write entry n's leaf file: status draft, refined false
  mark   <ticket-file> <status>  set a leaf's status and clear its blocked_at (repo store only)

`<dir>` is an epic folder, a backlog folder, or an initiative folder (all its epics).
`--project-root` names the project holding `_bmad/` when the tickets live outside it.

Output is one JSON object on stdout. Exit 0 on success, 1 on a malformed tree, 2 when
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
CROSS_RE = re.compile(r"^(epic-[^/]+)(?:/(\d+))?$")
BREAKDOWN = "tickets.toml"


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
        if line.lstrip().startswith("- "):
            raise TicketError("frontmatter lists must be inline: `key: [a, b]`")
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


def _list(value, where: str) -> list:
    if value in (None, ""):
        return []
    if not isinstance(value, list):
        raise TicketError(f"{where}: blocked_by must be a list")
    return value


def _flag(value) -> bool:
    return str(value).lower() == "true"


# ---------------------------------------------------------------- loading


def load_breakdown(folder: Path) -> dict:
    path = folder / BREAKDOWN
    if not path.is_file():
        return {}
    where = f"{folder.name}/{BREAKDOWN}"
    try:
        data = tomllib.loads(path.read_text(encoding="utf-8"))
    except tomllib.TOMLDecodeError as e:
        raise TicketError(f"{where}: {e}") from e
    for table in ("entry", "epic"):
        rows = data.get(table, [])
        if not isinstance(rows, list) or not all(isinstance(r, dict) for r in rows):
            raise TicketError(f"{where}: write `[[{table}]]` tables, one per {table}")
        for r in rows:
            for key in ("covers", "after", "blocked_by", "references", "notes"):
                if not isinstance(r.get(key, []), list):
                    raise TicketError(f"{where}: `{key}` must be a list")
            if not all(isinstance(a, dict) for a in r.get("after", [])):
                raise TicketError(f'{where}: `after` takes tables: [{{ epic = "epic-<slug>", needs = "..." }}]')
    return data


def load_container(folder: Path) -> dict:
    path = folder / f"{folder.name}.md"
    if not path.is_file():
        raise TicketError(f"{folder.name}: no {path.name}")
    fm = parse_frontmatter(path.read_text(encoding="utf-8"))
    if fm.get("type") not in CONTAINER_TYPES:
        raise TicketError(
            f"{folder.name}/{path.name}: type {fm.get('type')!r} is not one of {', '.join(CONTAINER_TYPES)}"
        )
    if fm.get("status", "") not in ("", *STATUSES):
        raise TicketError(f"{folder.name}/{path.name}: status {fm['status']!r} is not one of {', '.join(STATUSES)}")
    return {
        "slug": folder.name,
        "id": str(fm.get("id", "") or ""),
        "status": fm.get("status", ""),
        "raw_blocked_by": _list(fm.get("blocked_by"), f"{folder.name}.md"),
    }


def load_folder(folder: Path) -> list[dict]:
    """One row per ticket in a folder: every breakdown entry, joined to its leaf file when
    one exists, plus leaf files the breakdown does not list."""
    where = folder.name
    rows = {}
    for e in load_breakdown(folder).get("entry", []):
        n, kind = e.get("n"), e.get("type")
        if not isinstance(n, int) or isinstance(n, bool):
            raise TicketError(f"{where}/{BREAKDOWN}: every entry needs an integer `n`")
        if kind not in LEAF_TYPES:
            raise TicketError(f"{where}/{BREAKDOWN}: entry {n:02d} type {kind!r} is not one of {', '.join(LEAF_TYPES)}")
        if n in rows:
            raise TicketError(f"{where}/{BREAKDOWN}: two entries numbered {n:02d}")
        rows[n] = {
            "epic": where,
            "n": n,
            "file": None,
            "type": kind,
            "id": "",
            "title": str(e.get("title", "")),
            "status": "planned",
            "assignee": "",
            "refined": False,
            "refine": _flag(e.get("refine", False)),
            "description": str(e.get("description", "")),
            "verify": str(e.get("verify", "")),
            "unknown": str(e.get("unknown", "")),
            "references": [str(v) for v in e.get("references", [])],
            "notes": [str(v) for v in e.get("notes", [])],
            "risk": str(e.get("risk", "")),
            "hitl": _flag(e.get("hitl", False)),
            "covers": [str(c) for c in e.get("covers", [])],
            "estimate": e.get("estimate", ""),
            "blocked_at": "",
            "raw_blocked_by": _list(e.get("blocked_by"), f"{where}/{BREAKDOWN} entry {n:02d}"),
            "entry_blocked_by": None,
        }
    stray = []
    seen = {}
    for path in sorted(folder.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        try:
            fm = parse_frontmatter(text)
        except TicketError as e:
            raise TicketError(f"{where}/{path.name}: {e}") from e
        if not fm and text.startswith("---") and NAME_RE.match(path.name):
            raise TicketError(f"{where}/{path.name}: frontmatter does not close")
        if fm.get("type") not in LEAF_TYPES:
            continue
        status = fm.get("status", "")
        if status not in STATUSES:
            raise TicketError(f"{where}/{path.name}: status {status!r} is not one of {', '.join(STATUSES)}")
        m = NAME_RE.match(path.name)
        n = int(m.group(2)) if m else None
        if n is not None:
            if n in seen:
                raise TicketError(f"{seen[n]} and {path.name} share the number {n:02d}")
            seen[n] = path.name
        row = rows.get(n) if n is not None else None
        if row is None:
            row = {"epic": where, "n": n, "raw_blocked_by": [], "entry_blocked_by": None, "covers": [], "title": ""}
            row["refine"] = True
            if n is None:
                stray.append(row)
            else:
                rows[n] = row
        elif "blocked_by" in fm:
            row["entry_blocked_by"] = row["raw_blocked_by"]
        row.update(
            {
                "file": path.name,
                "type": fm.get("type"),
                "id": str(fm.get("id", "") or ""),
                "title": str(fm.get("title", "") or row["title"]),
                "status": status,
                "assignee": str(fm.get("assignee", "") or ""),
                "refined": _flag(fm.get("refined", False)),
                "hitl": _flag(fm.get("hitl", row.get("hitl", False))),
                "covers": [str(c) for c in fm["covers"]] if isinstance(fm.get("covers"), list) else row["covers"],
                "estimate": fm.get("estimate", row.get("estimate", "")),
                "blocked_at": fm.get("blocked_at", ""),
            }
        )
        if "blocked_by" in fm:
            row["raw_blocked_by"] = _list(fm["blocked_by"], f"{where}/{path.name}")
    return [rows[n] for n in sorted(rows)] + stray


def epic_folders(initiative: Path) -> list[Path]:
    return sorted(
        d
        for d in initiative.glob("epic-*")
        if d.is_dir() and ((d / f"{d.name}.md").is_file() or (d / BREAKDOWN).is_file())
    )


def load_tree(folder: Path) -> dict:
    """The folder asked about plus every epic its tickets can name."""
    epics = epic_folders(folder)
    if epics or "epic" in load_breakdown(folder):
        order = [e.get("slug") for e in load_breakdown(folder).get("epic", [])]
        epics.sort(key=lambda d: (order.index(d.name) if d.name in order else len(order), d.name))
        scope, initiative, folders = None, folder, [*epics, folder]
    elif folder in epic_folders(folder.parent):
        scope, initiative, folders = folder.name, folder.parent, epic_folders(folder.parent)
        epics = folders
    else:
        scope, initiative, folders = folder.name, None, [folder]
    tickets = [t for f in folders for t in load_folder(f)]
    for t in tickets:
        t["key"] = f"{t['epic']}/{t['n']:02d}" if t["n"] is not None else f"{t['epic']}/{t['file']}"
    tree = {
        "scope": scope,
        "initiative": initiative,
        "containers": {f.name: load_container(f) for f in epics},
        "tickets": tickets,
    }
    _resolve(tree)
    _check_cycles(tickets, tree["containers"])
    return tree


def _resolve(tree: dict) -> None:
    tickets, containers = tree["tickets"], tree["containers"]
    by_key = {t["key"]: t for t in tickets}
    ids = {c["id"]: slug for slug, c in containers.items() if c["id"]}
    ids.update({t["id"]: t["key"] for t in tickets if t["id"]})

    def sibling(t, ref):
        mates = [o for o in tickets if o["epic"] == t["epic"]]
        text = str(ref)
        if re.fullmatch(r"\d+", text):
            hit = next((o for o in mates if o["n"] == int(text)), None)
            if hit:
                return hit["key"]
        for o in mates:
            if o["file"] and text in (o["file"], o["file"][:-3]) or o["id"] and text == o["id"]:
                return o["key"]
        return None

    def resolve(t, refs, where):
        keys = []
        for ref in refs:
            key = sibling(t, ref) if "n" in t else None
            m = CROSS_RE.match(str(ref))
            if key is None and m:
                slug, nn = m.group(1), m.group(2)
                if slug not in containers:
                    raise TicketError(f"{where}: blocked_by {ref!r} names no epic in this initiative")
                key = slug if nn is None else f"{slug}/{int(nn):02d}"
                if nn is not None and key not in by_key:
                    raise TicketError(f"{where}: blocked_by {ref!r} names no entry in {slug}")
            if key is None:
                key = ids.get(str(ref))
            if key is None:
                raise TicketError(f"{where}: blocked_by {ref!r} matches no ticket")
            if key not in keys:
                keys.append(key)
        return keys

    for t in tickets:
        where = f"{t['epic']}/{t['file']}" if t["file"] else f"{t['epic']}/{BREAKDOWN} entry {t['n']:02d}"
        t["blocked_by"] = resolve(t, t.pop("raw_blocked_by"), where)
        planned = t.pop("entry_blocked_by")
        t["gated_by"] = []
        t["drift"] = planned is not None and sorted(resolve(t, planned, where)) != sorted(t["blocked_by"])
    for slug, c in containers.items():
        gates = resolve({"epic": slug}, c.pop("raw_blocked_by"), f"{slug}.md")
        c["blocked_by"] = gates
        for t in tickets:
            if t["epic"] == slug:
                t["gated_by"] = gates


def _check_cycles(tickets: list[dict], containers: dict) -> None:
    sys.setrecursionlimit(max(1000, 3 * len(tickets) + 100))
    graph = {t["key"]: t["blocked_by"] + t["gated_by"] for t in tickets}
    members = {}
    for t in tickets:
        members.setdefault(t["epic"], []).append(t["key"])
    for slug, c in containers.items():
        members.setdefault(slug, []).extend(c["blocked_by"])
    state = {}

    def visit(node, path):
        if state.get(node) == "done":
            return
        if state.get(node) == "active":
            raise TicketError("cycle through " + " -> ".join(path + [node]))
        state[node] = "active"
        for b in graph.get(node, members.get(node, [])):
            visit(b, path + [node])
        state[node] = "done"

    for node in graph:
        visit(node, [])


# ---------------------------------------------------------------- views


def done_keys(tree: dict) -> set:
    done = {t["key"] for t in tree["tickets"] if t["status"] == "done"}
    return done | {slug for slug, c in tree["containers"].items() if c["status"] == "done"}


def in_scope(tree: dict) -> list[dict]:
    return [t for t in tree["tickets"] if tree["scope"] in (None, t["epic"])]


def classify(tree: dict) -> dict:
    done = done_keys(tree)
    groups = {"ready_to_refine": [], "ready_to_start": [], "in_progress": [], "blocked": [], "to_pull": []}
    for t in in_scope(tree):
        s = t["status"]
        if s in ("done", "dropped"):
            continue
        unblocked = all(b in done for b in t["blocked_by"] + t["gated_by"]) and not t["blocked_at"]
        if s in ("in-progress", "review"):
            groups["in_progress"].append(t)
        elif not unblocked:
            groups["blocked"].append(t)
        elif s == "planned":
            groups["to_pull"].append(t)
        elif t["refine"] and not t["refined"]:
            groups["ready_to_refine"].append(t)
        else:
            groups["ready_to_start"].append(t)
    return groups


def longest_remaining_chain(tree: dict) -> list[str]:
    remaining = {t["key"]: t for t in tree["tickets"] if t["status"] not in ("done", "dropped")}
    memo = {}

    def chain(k):
        if k in memo:
            return memo[k]
        best = []
        for b in remaining[k]["blocked_by"] + remaining[k]["gated_by"]:
            if b in remaining:
                c = chain(b)
                if len(c) > len(best):
                    best = c
        memo[k] = best + [k]
        return memo[k]

    longest = []
    for t in in_scope(tree):
        if t["key"] in remaining:
            c = chain(t["key"])
            if len(c) > len(longest):
                longest = c
    return longest


def unpinned_after(tree: dict) -> list[dict]:
    """`after` lines of the initiative whose waiting epic has tickets but none blocked by the named epic."""
    if not tree["initiative"]:
        return []
    out = []
    listed = load_breakdown(tree["initiative"]).get("epic", [])
    slugs = [e.get("slug") for e in listed]
    for e in listed:
        mine = [t for t in tree["tickets"] if t["epic"] == e.get("slug")]
        for a in e.get("after", []):
            needed = a.get("epic")
            if needed not in slugs:
                raise TicketError(
                    f"{tree['initiative'].name}/{BREAKDOWN}: {e.get('slug')} is after {needed!r}, which is no epic listed"
                )
            pinned = any(
                b == needed or b.startswith(f"{needed}/") for t in mine for b in t["blocked_by"] + t["gated_by"]
            )
            if mine and not pinned and tree["scope"] in (None, e.get("slug")):
                out.append({"epic": e.get("slug"), "after": needed, "needs": a.get("needs", "")})
    return out


def public(t: dict, tree: dict, blocks: dict | None = None) -> dict:
    row = {
        k: t[k]
        for k in (
            "epic",
            "n",
            "file",
            "type",
            "id",
            "title",
            "status",
            "assignee",
            "hitl",
            "covers",
            "estimate",
            "refine",
            "refined",
            "blocked_at",
        )
    }
    prefix = f"{t['epic']}/"
    row["blocked_by"] = [b[len(prefix) :] if b.startswith(prefix) else b for b in t["blocked_by"]]
    if t["gated_by"]:
        row["gated_by"] = t["gated_by"]
    if blocks is not None:
        row["blocks"] = blocks.get(t["key"], [])
        if t["drift"]:
            row["drift"] = True
    return row


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
    tickets = tomllib.loads(cfg.read_text(encoding="utf-8")).get("tickets", {})
    return tickets.get("store", "repo") if isinstance(tickets, dict) else "repo"


# ---------------------------------------------------------------- commands


def _folder(args) -> Path:
    folder = Path(args.dir).resolve()
    if not folder.is_dir():
        raise TicketError(f"not a folder: {folder}")
    return folder


def cmd_next(args) -> dict:
    folder = _folder(args)
    store = store_name(project_root_for(args, folder))
    if store != "repo" and not args.synced:
        raise StoreRefusal(f"store is {store}: sync ticket status from the tracker first, then rerun with --synced")
    tree = load_tree(folder)
    return {
        "folder": folder.name,
        "store": store,
        **{k: [public(t, tree) for t in v] for k, v in classify(tree).items()},
        "unpinned_after": unpinned_after(tree),
    }


def cmd_status(args) -> dict:
    folder = _folder(args)
    tree = load_tree(folder)
    tickets = in_scope(tree)
    counts = {}
    for t in tickets:
        counts[t["status"]] = counts.get(t["status"], 0) + 1
    blocks = {}
    for t in tree["tickets"]:
        for b in t["blocked_by"]:
            blocks.setdefault(b, []).append(t["key"])
    out = {
        "folder": folder.name,
        "store": store_name(project_root_for(args, folder)),
        "tickets": [public(t, tree, blocks) for t in tickets],
        "counts": {"total": len(tickets), **counts},
        "longest_remaining_chain": longest_remaining_chain(tree),
        "unpinned_after": unpinned_after(tree),
    }
    if tree["scope"] is None:
        out["epics"] = [
            {"slug": slug, "status": c["status"], "blocked_by": c["blocked_by"], "blocks": blocks.get(slug, [])}
            for slug, c in tree["containers"].items()
        ]
    return out


PULLED = """---
id: ""
remote: ""
type: {type}
title: {title}
parent: {epic}
covers: [{covers}]
blocked_by: [{blocked_by}]
blocked_at: ""
blocked_reason: ""
assignee: ""
status: draft
refined: false
hitl: {hitl}
risk: {risk}
estimate: {estimate}
---

# {heading}

## Description

{description}

## Acceptance Criteria

Verify: {verify}

## References

- parent — {epic}/{epic}.md
{references}{notes}"""


def cmd_pull(args) -> dict:
    folder = _folder(args)
    tree = load_tree(folder)
    t = next((t for t in in_scope(tree) if t["epic"] == folder.name and t["n"] == args.n), None)
    if t is None:
        raise TicketError(f"{folder.name}/{BREAKDOWN} has no entry {args.n:02d}")
    if t["file"]:
        raise TicketError(f"entry {args.n:02d} is already pulled: {t['file']}")
    slug = re.sub(r"[^a-z0-9]+", "-", t["title"].lower()).strip("-")[:60].rstrip("-") or "untitled"
    path = folder / f"{t['type']}-{t['n']:02d}-{slug}.md"
    prefix = f"{t['epic']}/"
    blockers = [b[len(prefix) :] if b.startswith(prefix) else b for b in t["blocked_by"]]
    notes = ([f"Open question: {t['unknown']}"] if t["unknown"] else []) + t["notes"]
    path.write_text(
        PULLED.format(
            type=t["type"],
            title=json.dumps(t["title"], ensure_ascii=False),
            heading=t["title"],
            epic=t["epic"],
            covers=", ".join(t["covers"]),
            blocked_by=", ".join(blockers),
            hitl=str(t["hitl"]).lower(),
            risk=t["risk"],
            estimate=json.dumps(str(t["estimate"])),
            description=t["description"],
            verify=t["verify"],
            references="".join(f"- {r}\n" for r in t["references"]),
            notes="\n## Notes\n\n" + "".join(f"- {n}\n" for n in notes) if notes else "",
        ),
        encoding="utf-8",
    )
    return {"file": path.name, "refine": t["refine"]}


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
    parser = argparse.ArgumentParser(description="Read a ticket tree and answer what is next.")
    parser.add_argument("--project-root", help="project holding _bmad/; default: walk up from the ticket folder")
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("next", help="tickets whose blockers are done, by state")
    p.add_argument("dir")
    p.add_argument("--synced", action="store_true", help="tracker status was mirrored just now")
    p.set_defaults(func=cmd_next)
    p = sub.add_parser("status", help="every ticket resolved")
    p.add_argument("dir")
    p.set_defaults(func=cmd_status)
    p = sub.add_parser("pull", help="write an entry's leaf file")
    p.add_argument("dir")
    p.add_argument("n", type=int)
    p.set_defaults(func=cmd_pull)
    p = sub.add_parser("mark", help="set a ticket's status (repo store only)")
    p.add_argument("ticket_file")
    p.add_argument("status", choices=STATUSES)
    p.add_argument("--assignee")
    p.set_defaults(func=cmd_mark)
    args = parser.parse_args()
    try:
        print(json.dumps(args.func(args), ensure_ascii=False, default=str))
        return 0
    except StoreRefusal as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        return 2
    except (TicketError, OSError, ValueError) as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    raise SystemExit(main())
