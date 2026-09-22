#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""tickets — read a ticket tree and answer what is next.

A container folder holds its ticket file, `tickets.toml`, and flat leaf files named
`<type>-<slug>.md`. An epic's `tickets.toml` lists its planned leaves as `[[entry]]` tables
(`id`, `type`, `title`, `after`, and whatever else the plan records); an initiative's lists its
epics as `[[epic]]` tables (`id`, `slug`, `after = [{epic, needs}]`). Tables are in build order.
`id` names an entry for good and is never reused; a leaf file carries it in frontmatter, which is
how the file joins its entry. An entry with no leaf file is `planned`. A ticket needs refining
before it starts only when its entry says `refine = true` or it has no entry. Once the file exists
its frontmatter is the record: `status`, `tracker_status`, `assignee`, `refined`, `blocked_at`, and
`after` when present.

A leaf's `status` is the build's (draft, ready-for-dev, in-progress, in-review, done, blocked) or
dropped; absent means no build has started. On a tracker store `tracker_status` mirrors the
tracker's word (backlog, in-progress, review, done, dropped). A ticket's `state` is `planned` with
no file, else `tracker_status`, else derived from `status`: absent, draft, ready-for-dev -> backlog;
in-progress, blocked -> in-progress; in-review -> review; done; dropped.

`after` lists real prerequisites: a sibling's id as a bare integer, or a quoted string that is
`<epic id>.<entry id>` for an entry in another epic of the same initiative, `epic-<slug>` for that
whole epic, a file name, or a tracker id. An epic file's own `after` names epics and holds every
ticket under it; rows show it as `gated_by`. A dropped prerequisite still blocks.

  next   <dir>                   tickets whose prerequisites are done, grouped by state, in build order
  status <dir>                   every ticket in build order, what it blocks, counts by state, longest chain
  find   <dir> <ref>             the one ticket a reference names, with its path (null until pulled)
  pull   <dir> <id>              write entry id's leaf file with only the fields the entry sets; no status
  mark   <ticket-file> <status>  set a leaf's status and clear its blocked_at (repo store only)

`<dir>` is an epic folder, a backlog folder, or an initiative folder (all its epics). `<ref>` is
`<epic id>.<entry id>`, an entry id inside an epic folder, a tracker id, a file name, or words
from the title that match one ticket.
`--project-root` names the project holding `_bmad/` when the tickets live outside it.

Output is one JSON object on stdout. Exit 0 on success, 1 on a malformed tree, 2 when
the store forbids the operation.
"""

import argparse
import json
import os
import re
import sys
import tomllib
from pathlib import Path

sys.dont_write_bytecode = True

STATUSES = ("draft", "ready-for-dev", "in-progress", "in-review", "done", "blocked", "dropped")
STATES = ("backlog", "in-progress", "review", "done", "dropped")
CONTAINER_STATUSES = ("in-progress", "done", "dropped")
STATE_OF = {
    "": "backlog",
    "draft": "backlog",
    "ready-for-dev": "backlog",
    "in-progress": "in-progress",
    "blocked": "in-progress",
    "in-review": "review",
    "done": "done",
    "dropped": "dropped",
}
LEAF_TYPES = ("story", "spike", "bug")
CONTAINER_TYPES = ("initiative", "epic")
NAME_RE = re.compile(r"^(story|spike|bug)-(.+)\.md$")
CROSS_RE = re.compile(r"^(\d+)\.(\d+)$")
EPIC_RE = re.compile(r"^epic-[^/]+$")
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
        if value[0] == '"':
            try:
                return str(json.loads(value))
            except ValueError:
                pass
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
    pattern = re.compile(rf"^{re.escape(key)}:.*$\n?", re.M)
    if value == "":
        block = pattern.sub("", block).rstrip("\n")
    elif pattern.search(block):
        block = pattern.sub(lambda _: f"{key}: {value}\n", block, count=1).rstrip("\n")
    else:
        block = f"{block}\n{key}: {value}"
    return text[: m.start(1)] + block + text[m.end(1) :]


def _list(value, where: str) -> list:
    if value in (None, ""):
        return []
    if not isinstance(value, list):
        raise TicketError(f"{where}: after must be a list")
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
            for key in ("covers", "after", "references", "notes"):
                if not isinstance(r.get(key, []), list):
                    raise TicketError(f"{where}: `{key}` must be a list")
            if _id(r.get("id")) is None:
                raise TicketError(f"{where}: every {table} needs an integer `id`")
            if table == "epic":
                if not isinstance(r.get("slug"), str) or not r["slug"]:
                    raise TicketError(f"{where}: epic {r['id']} needs a `slug`")
                for a in r.get("after", []):
                    if not isinstance(a, dict) or (_id(a.get("epic")) is None and not isinstance(a.get("epic"), str)):
                        raise TicketError(
                            f'{where}: an epic\'s `after` takes tables: [{{ epic = <id or slug>, needs = "..." }}]'
                        )
    return data


def _id(value):
    return value if isinstance(value, int) and not isinstance(value, bool) else None


def load_container(folder: Path) -> dict:
    path = folder / f"{folder.name}.md"
    if not path.is_file():
        raise TicketError(f"{folder.name}: no {path.name}")
    fm = parse_frontmatter(path.read_text(encoding="utf-8"))
    if fm.get("type") not in CONTAINER_TYPES:
        raise TicketError(
            f"{folder.name}/{path.name}: type {fm.get('type')!r} is not one of {', '.join(CONTAINER_TYPES)}"
        )
    if fm.get("status", "") not in ("", *CONTAINER_STATUSES):
        raise TicketError(
            f"{folder.name}/{path.name}: status {fm['status']!r} is not one of {', '.join(CONTAINER_STATUSES)}"
        )
    return {
        "slug": folder.name,
        "tracker_id": str(fm.get("tracker_id", "") or ""),
        "status": fm.get("status", ""),
        "raw_after": _list(fm.get("after"), f"{folder.name}.md"),
    }


def load_folder(folder: Path) -> list[dict]:
    """One row per ticket in a folder, in build order: every breakdown entry, joined to its
    leaf file when one exists, then leaf files the breakdown does not list."""
    where = folder.name
    rows = {}
    for e in load_breakdown(folder).get("entry", []):
        n, kind = _id(e.get("id")), e.get("type")
        if n is None:
            raise TicketError(f"{where}/{BREAKDOWN}: every entry needs an integer `id`")
        if kind not in LEAF_TYPES:
            raise TicketError(f"{where}/{BREAKDOWN}: entry {n} type {kind!r} is not one of {', '.join(LEAF_TYPES)}")
        if n in rows:
            raise TicketError(f"{where}/{BREAKDOWN}: two entries with id {n}")
        rows[n] = {
            "epic": where,
            "id": n,
            "file": None,
            "type": kind,
            "tracker_id": "",
            "title": str(e.get("title", "")),
            "status": "",
            "tracker_status": "",
            "state": "planned",
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
            "raw_after": _list(e.get("after"), f"{where}/{BREAKDOWN} entry {n}"),
            "entry_after": None,
        }
    unlisted, stray = {}, []
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
        if status not in ("", *STATUSES):
            raise TicketError(f"{where}/{path.name}: status {status!r} is not one of {', '.join(STATUSES)}")
        tracker_status = fm.get("tracker_status", "")
        if tracker_status not in ("", *STATES):
            raise TicketError(
                f"{where}/{path.name}: tracker_status {tracker_status!r} is not one of {', '.join(STATES)}"
            )
        n = _id(fm.get("id"))
        if n is not None:
            if n in seen:
                raise TicketError(f"{seen[n]} and {path.name} share the id {n}")
            seen[n] = path.name
        row = rows.get(n) if n is not None else None
        if row is None:
            row = {"epic": where, "id": n, "raw_after": [], "entry_after": None, "covers": [], "title": ""}
            row["refine"] = True
            if n is None:
                stray.append(row)
            else:
                unlisted[n] = row
        elif "after" in fm:
            row["entry_after"] = row["raw_after"]
        row.update(
            {
                "file": path.name,
                "type": fm.get("type"),
                "tracker_id": str(fm.get("tracker_id", "") or ""),
                "title": str(fm.get("title", "") or row["title"]),
                "status": status,
                "tracker_status": tracker_status,
                "state": tracker_status or STATE_OF[status],
                "assignee": str(fm.get("assignee", "") or ""),
                "refined": _flag(fm.get("refined", False)),
                "hitl": _flag(fm.get("hitl", row.get("hitl", False))),
                "covers": [str(c) for c in fm["covers"]] if isinstance(fm.get("covers"), list) else row["covers"],
                "estimate": fm.get("estimate", row.get("estimate", "")),
                "blocked_at": fm.get("blocked_at", ""),
            }
        )
        if "after" in fm:
            row["raw_after"] = _list(fm["after"], f"{where}/{path.name}")
    return list(rows.values()) + [unlisted[n] for n in sorted(unlisted)] + stray


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
        scope, initiative, folders = None, folder, None
    elif folder in epic_folders(folder.parent):
        scope, initiative, folders = folder.name, folder.parent, epic_folders(folder.parent)
        epics = folders
    else:
        scope, initiative, folders = folder.name, None, [folder]
    listed = load_breakdown(initiative).get("epic", []) if initiative else []
    order = [e.get("slug") for e in listed]
    epics.sort(key=lambda d: (order.index(d.name) if d.name in order else len(order), d.name))
    if folders is None:
        folders = [*epics, folder]
    epic_ids = {}
    for e in listed:
        if e["id"] in epic_ids.values():
            raise TicketError(f"{initiative.name}/{BREAKDOWN}: two epics with id {e['id']}")
        if e["slug"] in epic_ids:
            raise TicketError(f"{initiative.name}/{BREAKDOWN}: two epics with slug {e['slug']}")
        epic_ids[e["slug"]] = e["id"]
    tickets = [t for f in folders for t in load_folder(f)]
    for t in tickets:
        t["key"] = f"{t['epic']}/{t['id']}" if t["id"] is not None else f"{t['epic']}/{t['file']}"
    tree = {
        "scope": scope,
        "initiative": initiative,
        "folders": {f.name: f for f in folders},
        "epic_ids": epic_ids,
        "containers": {f.name: load_container(f) for f in epics},
        "tickets": tickets,
    }
    _resolve(tree)
    _check_cycles(tickets, tree["containers"])
    return tree


def _resolve(tree: dict) -> None:
    tickets, containers = tree["tickets"], tree["containers"]
    by_key = {t["key"]: t for t in tickets}
    slugs = {i: slug for slug, i in tree["epic_ids"].items()}
    ids = {c["tracker_id"]: slug for slug, c in containers.items() if c["tracker_id"]}
    ids.update({t["tracker_id"]: t["key"] for t in tickets if t["tracker_id"]})

    def sibling(t, ref, where):
        """An integer is always a sibling's id; a string is never one."""
        mates = [o for o in tickets if o["epic"] == t["epic"]]
        if _id(ref) is not None:
            hit = next((o for o in mates if o["id"] == ref), None)
            if hit is None:
                raise TicketError(f"{where}: after {ref!r} names no entry in {t['epic']}")
            return hit["key"]
        for o in mates:
            if o["file"] and ref in (o["file"], o["file"][:-3]):
                return o["key"]
        return None

    def resolve(t, refs, where):
        keys = []
        for ref in refs:
            text = str(ref)
            key = sibling(t, ref, where) if "id" in t else None
            m = CROSS_RE.match(text)
            if key is None and m:
                slug = slugs.get(int(m.group(1)))
                if slug is None:
                    raise TicketError(f"{where}: after {ref!r} names no epic id in this initiative's {BREAKDOWN}")
                key = f"{slug}/{int(m.group(2))}"
                if key not in by_key:
                    raise TicketError(f"{where}: after {ref!r} names no entry in {slug}")
            if key is None and EPIC_RE.match(text):
                if text not in containers:
                    raise TicketError(f"{where}: after {ref!r} names no epic in this initiative")
                key = text
            if key is None:
                key = ids.get(text)
            if key is None:
                raise TicketError(f"{where}: after {ref!r} matches no ticket")
            if key not in keys:
                keys.append(key)
        return keys

    for t in tickets:
        where = f"{t['epic']}/{t['file']}" if t["file"] else f"{t['epic']}/{BREAKDOWN} entry {t['id']}"
        t["after"] = resolve(t, t.pop("raw_after"), where)
        planned = t.pop("entry_after")
        t["gated_by"] = []
        t["drift"] = planned is not None and sorted(resolve(t, planned, where)) != sorted(t["after"])
    for slug, c in containers.items():
        gates = resolve({"epic": slug}, c.pop("raw_after"), f"{slug}.md")
        c["after"] = gates
        for t in tickets:
            if t["epic"] == slug:
                t["gated_by"] = gates


def _check_cycles(tickets: list[dict], containers: dict) -> None:
    sys.setrecursionlimit(max(1000, 3 * len(tickets) + 100))
    graph = {t["key"]: t["after"] + t["gated_by"] for t in tickets}
    members = {}
    for t in tickets:
        members.setdefault(t["epic"], []).append(t["key"])
    for slug, c in containers.items():
        members.setdefault(slug, []).extend(c["after"])
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
    done = {t["key"] for t in tree["tickets"] if t["state"] == "done"}
    return done | {slug for slug, c in tree["containers"].items() if c["status"] == "done"}


def in_scope(tree: dict) -> list[dict]:
    return [t for t in tree["tickets"] if tree["scope"] in (None, t["epic"])]


def classify(tree: dict) -> dict:
    done = done_keys(tree)
    groups = {"ready_to_refine": [], "ready_to_start": [], "in_progress": [], "blocked": [], "to_pull": []}
    for t in in_scope(tree):
        s = t["state"]
        if s in ("done", "dropped"):
            continue
        unblocked = all(b in done for b in t["after"] + t["gated_by"]) and not t["blocked_at"]
        if t["status"] == "blocked":
            groups["blocked"].append(t)
        elif s in ("in-progress", "review"):
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
    remaining = {t["key"]: t for t in tree["tickets"] if t["state"] not in ("done", "dropped")}
    memo = {}

    def chain(k):
        if k in memo:
            return memo[k]
        best = []
        for b in remaining[k]["after"] + remaining[k]["gated_by"]:
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
    return [ref(k, None, tree) for k in longest]


def ref(key: str, epic: str | None, tree: dict) -> str | int:
    """A key as the plan writes it: a sibling's id, `<epic id>.<id>` elsewhere, an epic's slug."""
    slug, _, n = key.partition("/")
    if not n:
        return slug
    if slug == epic and n.isdigit():
        return int(n)
    if n.isdigit() and slug in tree["epic_ids"]:
        return f"{tree['epic_ids'][slug]}.{n}"
    return key


def unpinned_after(tree: dict) -> list[dict]:
    """`after` lines of the initiative whose waiting epic has tickets but none waiting on the named epic."""
    if not tree["initiative"]:
        return []
    out = []
    listed = load_breakdown(tree["initiative"]).get("epic", [])
    slugs = [e.get("slug") for e in listed]
    by_id = {i: slug for slug, i in tree["epic_ids"].items()}
    for e in listed:
        mine = [t for t in tree["tickets"] if t["epic"] == e.get("slug")]
        for a in e.get("after", []):
            needed = by_id.get(a.get("epic"), a.get("epic"))
            if needed not in slugs:
                raise TicketError(
                    f"{tree['initiative'].name}/{BREAKDOWN}: {e.get('slug')} is after {a.get('epic')!r}, which is no epic listed"
                )
            pinned = any(b == needed or b.startswith(f"{needed}/") for t in mine for b in t["after"] + t["gated_by"])
            if mine and not pinned and tree["scope"] in (None, e.get("slug")):
                out.append({"epic": e.get("slug"), "after": needed, "needs": a.get("needs", "")})
    return out


def public(t: dict, tree: dict, blocks: dict | None = None) -> dict:
    row = {
        k: t[k]
        for k in (
            "epic",
            "id",
            "file",
            "type",
            "tracker_id",
            "title",
            "status",
            "tracker_status",
            "state",
            "assignee",
            "hitl",
            "covers",
            "estimate",
            "refine",
            "refined",
            "blocked_at",
        )
    }
    row["after"] = [ref(b, t["epic"], tree) for b in t["after"]]
    if t["gated_by"]:
        row["gated_by"] = t["gated_by"]
    if blocks is not None:
        row["blocks"] = [ref(b, t["epic"], tree) for b in blocks.get(t["key"], [])]
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
        counts[t["state"]] = counts.get(t["state"], 0) + 1
    blocks = {}
    for t in tree["tickets"]:
        for b in t["after"]:
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
            {
                "slug": slug,
                "id": tree["epic_ids"].get(slug),
                "status": c["status"],
                "after": c["after"],
                "blocks": [ref(b, None, tree) for b in blocks.get(slug, [])],
            }
            for slug, c in tree["containers"].items()
        ]
    return out


PULLED = """---
{frontmatter}
---

# {heading}

## Description

{description}

## Acceptance Criteria

Verify: {verify}

## References

- parent — {parent}
{references}{notes}
## Plan

<!-- Filled in by the coding agent; never sent to a tracker. -->
"""


def cmd_find(args) -> dict:
    folder = _folder(args)
    tree = load_tree(folder)
    tickets = tree["tickets"]
    ref = args.ref.strip()
    low = ref.lower()
    hits = []
    m = CROSS_RE.match(ref)
    if m:
        slug = {i: s for s, i in tree["epic_ids"].items()}.get(int(m.group(1)))
        hits = [t for t in tickets if slug and t["epic"] == slug and t["id"] == int(m.group(2))]
    elif ref.isdigit() and tree["scope"]:
        hits = [t for t in tickets if t["epic"] == tree["scope"] and t["id"] == int(ref)]
    for pool in (in_scope(tree), tickets):
        if not hits:
            hits = [t for t in pool if t["file"] and low in (t["file"].lower(), t["file"][:-3].lower())]
    if not hits:
        hits = [t for t in tickets if t["tracker_id"] and low == t["tracker_id"].lower()]
    if not hits:
        hits = [t for t in in_scope(tree) if low in t["title"].lower()]
    if not hits:
        raise TicketError(f"no ticket matches {ref!r}")
    if len(hits) > 1:
        names = ", ".join(ref_name(t, tree) for t in hits)
        raise TicketError(f"{ref!r} matches more than one ticket: {names}")
    t = hits[0]
    path = tree["folders"][t["epic"]] / t["file"] if t["file"] else None
    return {**public(t, tree), "folder": tree["folders"][t["epic"]].name, "path": str(path) if path else None}


def ref_name(t: dict, tree: dict) -> str:
    return f"{t['file'] or t['id']} in {t['epic']}"


def cmd_pull(args) -> dict:
    folder = _folder(args)
    tree = load_tree(folder)
    t = next((t for t in in_scope(tree) if t["epic"] == folder.name and t["id"] == args.id), None)
    if t is None:
        raise TicketError(f"{folder.name}/{BREAKDOWN} has no entry {args.id}")
    if t["file"]:
        raise TicketError(f"entry {args.id} is already pulled: {t['file']}")
    slug = re.sub(r"[^a-z0-9]+", "-", t["title"].lower()).strip("-")[:60].rstrip("-") or "untitled"
    path = folder / f"{t['type']}-{slug}.md"
    if path.exists():
        raise TicketError(f"{path.name} exists already; change entry {args.id}'s title")
    after = [str(ref(b, t["epic"], tree)) for b in t["after"]]
    root = project_root_for(args, folder)
    epic_file = folder / f"{folder.name}.md"
    try:
        parent = Path(os.path.relpath(epic_file, root)).as_posix() if root else epic_file.as_posix()
    except ValueError:  # another drive on Windows
        parent = epic_file.as_posix()
    notes = ([f"Open question: {t['unknown']}"] if t["unknown"] else []) + t["notes"]
    # Empty and false fields are left out; absent reads the same and the file stays short.
    # No status: the build writes it when it starts.
    fields = [
        ("id", str(t["id"])),
        ("type", t["type"]),
        ("title", json.dumps(t["title"], ensure_ascii=False)),
        ("parent", t["epic"]),
        ("covers", f"[{', '.join(t['covers'])}]" if t["covers"] else ""),
        ("after", f"[{', '.join(after)}]" if after else ""),
        ("refined", "false" if t["refine"] else ""),
        ("hitl", "true" if t["hitl"] else ""),
        ("risk", t["risk"]),
        ("estimate", json.dumps(str(t["estimate"])) if t["estimate"] != "" else ""),
    ]
    path.write_text(
        PULLED.format(
            frontmatter="\n".join(f"{k}: {v}" for k, v in fields if v != ""),
            heading=t["title"],
            parent=parent,
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
        text = set_frontmatter_value(text, key, "")
    if args.assignee is not None:
        text = set_frontmatter_value(text, "assignee", f'"{args.assignee}"')
    path.write_text(text, encoding="utf-8")
    fm = parse_frontmatter(text)
    return {"file": path.name, "status": fm.get("status"), "assignee": fm.get("assignee", "")}


def main() -> int:
    parser = argparse.ArgumentParser(description="Read a ticket tree and answer what is next.")
    parser.add_argument("--project-root", help="project holding _bmad/; default: walk up from the ticket folder")
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("next", help="tickets whose prerequisites are done, by state")
    p.add_argument("dir")
    p.add_argument("--synced", action="store_true", help="tracker status was mirrored just now")
    p.set_defaults(func=cmd_next)
    p = sub.add_parser("status", help="every ticket resolved")
    p.add_argument("dir")
    p.set_defaults(func=cmd_status)
    p = sub.add_parser("find", help="the one ticket a reference names")
    p.add_argument("dir")
    p.add_argument("ref")
    p.set_defaults(func=cmd_find)
    p = sub.add_parser("pull", help="write an entry's leaf file")
    p.add_argument("dir")
    p.add_argument("id", type=int)
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
