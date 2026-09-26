#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""tickets — read a ticket tree and answer what is next.

A container folder holds its ticket file, `tickets.toml`, flat leaf files named `<type>-<slug>.md`,
and the builds' plan files. An epic's `tickets.toml` lists its planned leaves as `[[entry]]` tables
(`id`, `type`, `title`, `after`, and whatever else the plan records); an initiative's lists its
epics as `[[epic]]` tables (`id`, `slug`, `after = [{epic, needs}]`). Tables are in build order.
`id` names an entry for good and is never reused; a leaf file carries it in frontmatter, which is
how the file joins its entry. An entry needs no leaf file to start. A ticket needs refining before
it starts only when its entry says `refine = true` or it has no entry. A leaf file's frontmatter
adds `tracker_status`, `refined`, and `after` when present.

A plan is any other `.md` whose frontmatter has `ticket` and whose `type` is not a leaf type. An
integer `ticket` joins the entry with that id in the plan's folder; a string joins the leaf file
with that stem (a backlog leaf). A plan is never a row of its own. It holds the ticket's `status`,
`assignee`, `blocked_at`, and `blocked_reason`; a leaf file's own fields are read only when the
ticket has no plan.

`status` is draft, ready-for-dev, in-progress, in-review, or built from the builds (built is their
last: the build finished and nobody has called it done), blocked from build-auto, done from the
user or an orchestrator through mark, or dropped; absent means no build has started.
On a tracker store `tracker_status` mirrors the tracker's word (backlog, in-progress, review, done,
dropped). A ticket's `state` is `planned` with no file and no plan, else `tracker_status`, else
derived from `status`: absent, draft, ready-for-dev -> backlog; in-progress, blocked -> in-progress;
in-review, built -> review; done; dropped.

`after` lists real prerequisites: a sibling's id as a bare integer, or a quoted string that is
`<epic id>.<entry id>` for an entry in another epic of the same initiative, `epic-<slug>` for that
whole epic, a file name, or a tracker id. An epic file's own `after` names epics and holds every
ticket under it; rows show it as `gated_by`. A dropped prerequisite still blocks.

  next   [<dir>]                 tickets whose prerequisites are done or in review, grouped by state, in
                                 build order; an epic's own `after` waits for that epic to be done
  status [<dir>]                 every ticket in build order, what it blocks, counts by state, longest chain
  find   [<dir>] <ref>           the one ticket a reference names, with its entry's text fields and the
                                 absolute paths `epic_file`, `story_file` (null until pulled), and `plan`
                                 (where its plan is or goes)
  pull   <dir> <id>              write entry id's leaf file with only the fields the entry sets; no status
  mark   [<dir>] <ref> <status> [--assignee <who>] [--blocked <reason>]
                                 set a ticket's status in its plan, creating a frontmatter-only plan when
                                 there is none; --blocked sets blocked_at and blocked_reason, else both are
                                 cleared (repo store only)

`<dir>` is an epic folder, a backlog folder, or an initiative folder (all its epics). `<ref>` is
`<epic id>.<entry id>`, an entry id inside an epic folder, a tracker id, a file name, or words
from the title that match one ticket. Each row of next, status, and find carries `ref`, a reference
find resolves in the folder the command ran on.
`--project-root` names the project holding `_bmad/` when the tickets live outside it.

With no `<dir>`, next, status, find, and mark run on the active initiative, `{tickets.root}/{active_initiative}`.
The project root is `--project-root`, else the first folder at or above the working directory that
holds `_bmad/`. `active_initiative` (`[modules.bmm]`) and `output_folder` (`[core]`) come from the
BMad config, merged by the project's `_bmad/scripts/config_utils.py`; `root` comes from `[tickets]`
in `_bmad/custom/ticketing-store-config.toml` and defaults to `{output_folder}`. `{project-root}`
and `{output_folder}` are substituted, and a relative path is taken from the project root.

Output is one JSON object on stdout. Exit 0 on success, 1 on a malformed tree, 2 when
the store forbids the operation.
"""

import argparse
import importlib.util
import json
import os
import re
import sys
import tomllib
from datetime import date
from pathlib import Path

sys.dont_write_bytecode = True

STATUSES = ("draft", "ready-for-dev", "in-progress", "in-review", "built", "done", "blocked", "dropped")
STATES = ("backlog", "in-progress", "review", "done", "dropped")
CONTAINER_STATUSES = ("in-progress", "done", "dropped")
STATE_OF = {
    "": "backlog",
    "draft": "backlog",
    "ready-for-dev": "backlog",
    "in-progress": "in-progress",
    "blocked": "in-progress",
    "in-review": "review",
    "built": "review",
    "done": "done",
    "dropped": "dropped",
}
LEAF_TYPES = ("story", "spike", "bug")
CONTAINER_TYPES = ("initiative", "epic")
NAME_RE = re.compile(r"^(story|spike|bug)-(.+)\.md$")
CROSS_RE = re.compile(r"^(\d+)\.(\d+)$")
EPIC_RE = re.compile(r"^epic-[^/]+$")
BREAKDOWN = "tickets.toml"
QUOTED_COMMENT_RE = re.compile(r"""^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*')\s+#.*$""")
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---(?:\n|\Z)", re.S)
PLAN_FIELDS = ("status", "assignee", "blocked_at", "blocked_reason")


class TicketError(Exception):
    pass


class StoreRefusal(Exception):
    pass


# ---------------------------------------------------------------- frontmatter


def parse_frontmatter(text: str, lenient: bool = False) -> dict:
    """Minimal YAML subset: `key: value`, lists as `[a, b]`, quoted or bare scalars. Lenient
    skips block lists instead of refusing them, for plans written from the build's template."""
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}
    data = {}
    for line in m.group(1).splitlines():
        if lenient and (line[:1].isspace() or line.startswith("- ")):
            continue
        if line.lstrip().startswith("- "):
            raise TicketError("frontmatter lists must be inline: `key: [a, b]`")
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        value = value.split("   #")[0].strip()
        quoted = QUOTED_COMMENT_RE.match(value)
        data[key.strip()] = _scalar(quoted.group(1) if quoted else value)
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
        return value[1:-1] if value[0] == '"' else value[1:-1].replace("''", "'")
    if value in ("true", "false"):
        return value == "true"
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    return value


def set_frontmatter_value(text: str, key: str, value: str) -> str:
    m = FRONTMATTER_RE.match(text)
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


def _one_of(value, allowed: tuple, where: str, field: str):
    """`value` when it is absent (`""`) or one of `allowed`; else the error naming them."""
    if value not in ("", *allowed):
        raise TicketError(f"{where}: {field} {value!r} is not one of {', '.join(allowed)}")
    return value


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
    status = _one_of(fm.get("status", ""), CONTAINER_STATUSES, f"{folder.name}/{path.name}", "status")
    return {
        "slug": folder.name,
        "tracker_id": str(fm.get("tracker_id", "") or ""),
        "status": status,
        "raw_after": _list(fm.get("after"), f"{folder.name}.md"),
    }


def load_folder(folder: Path) -> list[dict]:
    """One row per ticket in a folder, in build order: every breakdown entry, joined to its
    leaf file when one exists, then leaf files the breakdown does not list. Plans then set
    the status fields of the rows they join."""
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
            "blocked_reason": "",
            "raw_after": _list(e.get("after"), f"{where}/{BREAKDOWN} entry {n}"),
            "entry_after": None,
        }
    unlisted, stray, plans = {}, [], []
    seen = {}
    for path in sorted(folder.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        fm = parse_frontmatter(text, lenient=True)
        if not fm and text.startswith("---") and NAME_RE.match(path.name):
            raise TicketError(f"{where}/{path.name}: frontmatter does not close")
        if fm.get("type") not in LEAF_TYPES:
            if "ticket" in fm:
                plans.append((path.name, fm))
            continue
        try:
            fm = parse_frontmatter(text)
        except TicketError as e:
            raise TicketError(f"{where}/{path.name}: {e}") from e
        status = _one_of(fm.get("status", ""), STATUSES, f"{where}/{path.name}", "status")
        tracker_status = _one_of(fm.get("tracker_status", ""), STATES, f"{where}/{path.name}", "tracker_status")
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
                "blocked_reason": str(fm.get("blocked_reason", "") or ""),
            }
        )
        if "after" in fm:
            row["raw_after"] = _list(fm["after"], f"{where}/{path.name}")
    out = list(rows.values()) + [unlisted[n] for n in sorted(unlisted)] + stray
    join_plans(out, plans, where)
    return out


def join_plans(rows: list[dict], plans: list[tuple[str, dict]], where: str) -> None:
    """Set each plan's status fields on the one row its `ticket` names."""
    for name, fm in plans:
        status = _one_of(fm.get("status", ""), STATUSES, f"{where}/{name}", "status")
        ticket = fm["ticket"]
        if isinstance(ticket, str) and ticket.isascii() and ticket.isdigit():
            ticket = int(ticket)
        if _id(ticket) is not None:
            row = next((r for r in rows if r["id"] == ticket), None)
        elif isinstance(ticket, str) and ticket:
            row = next((r for r in rows if r["file"] == f"{ticket}.md"), None)
        else:
            row = None
        if row is None:
            raise TicketError(f"{where}/{name}: ticket {ticket!r} names no entry or leaf file in {where}")
        if "plan" in row:
            raise TicketError(f"{where}/{row['plan']} and {name} are both plans for ticket {ticket!r}")
        row.update(
            {
                "plan": name,
                "state": row["tracker_status"] or STATE_OF[status],
                **{k: str(fm.get(k, "") or "") for k in PLAN_FIELDS},
            }
        )


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
    # A ticket in review meets an `after`; an epic gate still waits for the epic to be done.
    met = done | {t["key"] for t in tree["tickets"] if t["state"] == "review"}
    groups = {"ready_to_refine": [], "ready_to_start": [], "in_progress": [], "blocked": []}
    for t in in_scope(tree):
        s = t["state"]
        if s in ("done", "dropped"):
            continue
        if t["status"] == "blocked" or t["blocked_at"]:
            groups["blocked"].append(t)
        elif s in ("in-progress", "review"):
            groups["in_progress"].append(t)
        elif not (all(b in met for b in t["after"]) and all(b in done for b in t["gated_by"])):
            groups["blocked"].append(t)
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


def row_ref(t: dict, tree: dict) -> str | None:
    """What `find` resolves to this ticket in the folder the command ran on; never the title,
    which can repeat across epics."""
    if t["id"] is not None and t["epic"] in tree["epic_ids"]:
        return f"{tree['epic_ids'][t['epic']]}.{t['id']}"
    if t["id"] is not None and t["epic"] == tree["scope"]:
        return str(t["id"])
    return t["file"]


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
            "blocked_reason",
        )
    }
    row["ref"] = row_ref(t, tree)
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


def store_config(project_root: Path | None) -> dict:
    """The `[tickets]` table of the project's store config, empty when there is none."""
    if not project_root:
        return {}
    cfg = project_root / "_bmad" / "custom" / "ticketing-store-config.toml"
    if not cfg.is_file():
        return {}
    tickets = tomllib.loads(cfg.read_text(encoding="utf-8")).get("tickets", {})
    return tickets if isinstance(tickets, dict) else {}


def store_name(project_root: Path | None) -> str:
    return store_config(project_root).get("store", "repo")


def central_config(project_root: Path) -> dict:
    """The BMad config with its layers merged by the project's own `config_utils.py`."""
    path = project_root / "_bmad" / "scripts" / "config_utils.py"
    if not path.is_file():
        raise TicketError(f"cannot read the BMad config: {path} is missing")
    spec = importlib.util.spec_from_file_location("bmad_config_utils", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    try:
        return module.load_central_config(project_root)
    except module.ConfigError as e:
        raise TicketError(str(e)) from e


def active_initiative(project_root: Path) -> Path:
    """`{tickets.root}/{active_initiative}` for the project."""
    config = central_config(project_root)
    bmm = config.get("modules", {}).get("bmm", {})
    name = bmm.get("active_initiative") if isinstance(bmm, dict) else None
    if not isinstance(name, str) or not name.strip():
        raise TicketError(
            "no active initiative: set modules.bmm.active_initiative in _bmad/custom/config.user.toml, or pass a folder"
        )
    core = config.get("core", {})
    output = str(core.get("output_folder", "") if isinstance(core, dict) else "")
    output = output.replace("{project-root}", str(project_root))
    root = str(store_config(project_root).get("root", "") or "{output_folder}")
    root = root.replace("{project-root}", str(project_root)).replace("{output_folder}", output)
    folder = (project_root / root / name.strip()).resolve()
    if not folder.is_dir():
        raise TicketError(f"active initiative folder not found: {folder}")
    return folder


# ---------------------------------------------------------------- commands


def _folder(args) -> Path:
    if args.dir is None:
        root = project_root_for(args, Path.cwd())
        if root is None:
            raise TicketError("no project root found: no _bmad/ at or above the working directory; pass --project-root")
        # The store is then read from this project even when tickets.root lies outside it.
        args.project_root = str(root)
        return active_initiative(root)
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
{references}{notes}"""


def title_slug(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:60].rstrip("-") or "untitled"


def resolve_ticket(tree: dict, text: str) -> dict:
    """The one row a reference names; see `<ref>` above."""
    tickets = tree["tickets"]
    ref = text.strip()
    if not ref:
        raise TicketError("the ticket reference is empty")
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
    if not hits and not ref.isdigit():
        hits = [t for t in in_scope(tree) if low in t["title"].lower()]
    if not hits:
        raise TicketError(f"no ticket matches {ref!r}")
    if len(hits) > 1:
        names = ", ".join(ref_name(t, tree) for t in hits)
        raise TicketError(f"{ref!r} matches more than one ticket: {names}")
    return hits[0]


def plan_path(t: dict, tree: dict) -> Path:
    """The joined plan, else `<leaf file stem>-plan.md`, else `<type>-<slug of the title>-plan.md`."""
    folder = tree["folders"][t["epic"]]
    if t.get("plan"):
        return folder / t["plan"]
    if t["file"]:
        return folder / f"{t['file'][:-3]}-plan.md"
    return folder / f"{t['type']}-{title_slug(t['title'])}-plan.md"


def cmd_find(args) -> dict:
    folder = _folder(args)
    tree = load_tree(folder)
    t = resolve_ticket(tree, args.ref)
    home = tree["folders"][t["epic"]]
    return {
        **public(t, tree),
        "folder": home.name,
        # Unlisted and stray leaves have no entry, so no entry text.
        "description": t.get("description", ""),
        "verify": t.get("verify", ""),
        "references": t.get("references", []),
        "notes": t.get("notes", []),
        "unknown": t.get("unknown", ""),
        "epic_file": str(home / f"{t['epic']}.md") if t["epic"] in tree["containers"] else None,
        "story_file": str(home / t["file"]) if t["file"] else None,
        "plan": str(plan_path(t, tree)),
    }


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
    path = folder / f"{t['type']}-{title_slug(t['title'])}.md"
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


def quoted(value: str) -> str:
    """A double-quoted scalar that `parse_frontmatter` reads back exactly."""
    # parse_frontmatter cuts a value at "   #" and splits lines on these characters, so they go in as escapes.
    text = json.dumps(value, ensure_ascii=False).replace("   #", "   \\u0023")
    return text.translate({c: f"\\u{c:04x}" for c in (0x85, 0x2028, 0x2029)})


def cmd_mark(args) -> dict:
    """Write status, assignee, and the blocked fields to the ticket's plan; never to its leaf file."""
    folder = _folder(args)
    store = store_name(project_root_for(args, folder))
    if store != "repo":
        raise StoreRefusal(f"store is {store}: change status through the store's write verb, not this script")
    tree = load_tree(folder)
    t = resolve_ticket(tree, args.ref)
    path = plan_path(t, tree)
    blocked = {"blocked_at": "", "blocked_reason": ""}
    if args.blocked is not None:
        blocked = {"blocked_at": quoted(date.today().isoformat()), "blocked_reason": quoted(args.blocked)}
    created = not t.get("plan")
    if created:
        assignee = args.assignee if args.assignee is not None else t["assignee"]
        fields = [
            ("title", quoted(t["title"])),
            ("ticket", str(t["id"]) if t["id"] is not None else quoted(t["file"][:-3])),
            ("status", args.status),
            ("assignee", quoted(assignee) if assignee else ""),
            *blocked.items(),
        ]
        text = "---\n" + "".join(f"{k}: {v}\n" for k, v in fields if v != "") + "---\n"
    else:
        text = set_frontmatter_value(path.read_text(encoding="utf-8"), "status", args.status)
        for key, value in blocked.items():
            text = set_frontmatter_value(text, key, value)
        if args.assignee is not None:
            text = set_frontmatter_value(text, "assignee", quoted(args.assignee))
    data = text.encode("utf-8")  # before the file is opened, so a failure leaves the plan as it was
    try:
        with path.open("xb" if created else "wb") as f:
            f.write(data)
    except FileExistsError:
        raise TicketError(f"{path.name} exists already and is not the plan for {ref_name(t, tree)}") from None
    fm = parse_frontmatter(text, lenient=True)
    return {
        "plan": str(path),
        "created": created,
        **{k: fm.get(k, "") for k in PLAN_FIELDS},
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Read a ticket tree and answer what is next.")
    parser.add_argument(
        "--project-root",
        help="project holding _bmad/; default: walk up from the ticket folder, or the working directory with no folder",
    )
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("next", help="tickets whose prerequisites are done or in review, by state")
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.add_argument("--synced", action="store_true", help="tracker status was mirrored just now")
    p.set_defaults(func=cmd_next)
    p = sub.add_parser("status", help="every ticket resolved")
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.set_defaults(func=cmd_status)
    p = sub.add_parser("find", help="the one ticket a reference names")
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.add_argument("ref")
    p.set_defaults(func=cmd_find)
    p = sub.add_parser("pull", help="write an entry's leaf file")
    p.add_argument("dir")
    p.add_argument("id", type=int)
    p.set_defaults(func=cmd_pull)
    p = sub.add_parser("mark", help="set a ticket's status in its plan (repo store only)")
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.add_argument("ref")
    p.add_argument("status", choices=STATUSES)
    p.add_argument("--assignee")
    p.add_argument(
        "--blocked", metavar="REASON", help="set blocked_at to today and blocked_reason; else both are cleared"
    )
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
