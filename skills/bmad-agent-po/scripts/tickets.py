#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""tickets — read a ticket tree and answer what is next.

The tree's layout, the plan file, who writes each `status`, and how it becomes a board `state` are in
the repo's `tools/ticket-tree-rules.md`; the keys of an entry, an epic, and an initiative table, and the forms `after`
takes, are in the skill's `assets/tickets-template.toml`. Each command's `--help` says what it reads
and returns.

An initiative or epic folder keeps its own file at the top and its tickets in its `tickets/` folder:
the `tickets.toml`, an initiative's epic folders, and the leaf files and plans. A backlog folder has no
file of its own and holds its leaf files and plans directly. A tree with a `tickets.toml`, an epic
folder, or a leaf file beside the container's own file is in the earlier layout and is refused; `bmad
migrate` moves it. A parent initiative's `tickets.toml` lists `[[initiative]]` tables, its children,
which are initiative folders beside it; `status` and `next` report them, and the other commands want
one of the children.

What this script decides itself: a leaf file joins its entry through the `id` in its frontmatter (`6`
and `"6"` are one id); a plan joins through `ticket`, an entry id or a backlog file's stem, and is
never a row. A leaf file's `after` and `hitl` replace the entry's, absent reading as empty; a
difference is `drift` on the row. A prerequisite is met when it is done or in review, a dropped one
still blocks, and an epic file's own `after` waits for that epic to be done. A plan whose `ticket`
names nothing is skipped and one whose `status` is unknown blocks its ticket; both are listed under
`problems`. A moved entry takes the destination's next id and goes last there; the folder it left keeps
that id from coming back, and every `after` naming it is rewritten.

The project root is `--project-root`, else the first folder at or above the working directory that
holds `_bmad/`; `output_folder` and `active_initiative` come from the merged BMad config. A relative
`<dir>` that is not under the working directory is looked up under `{output_folder}`, then the
active initiative and its `tickets/` folder, then the project root. A `tickets/` folder given as
`<dir>` is read as the folder that holds it.

Output is one JSON object on stdout. Exit 0 on success, 1 on a malformed tree, 2 when the store
forbids the operation.
"""

import argparse
import codecs
import importlib.util
import json
import os
import re
import sys
import tomllib
import unicodedata
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
ID_RE = re.compile(r"^[0-9A-Za-z]+$")
CROSS_RE = re.compile(r"^([0-9A-Za-z]+)\.([0-9A-Za-z]+)$")
EPIC_RE = re.compile(r"^epic-[^/]+$")
BREAKDOWN = "tickets.toml"
TICKETS = "tickets"
TABLES = ("initiative", "epic", "entry")
QUOTED_COMMENT_RE = re.compile(r"""^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*')\s+#.*$""")
FRONTMATTER_RE = re.compile(r"\A---\n(.*?)\n---(?:\n|\Z)", re.S)
PLAN_FIELDS = ("status", "assignee", "blocked_at", "blocked_reason")
COMMENT_RE = re.compile(r"<!--.*?-->", re.S)  # a template's example sits in one
UNKNOWN_RE = re.compile(r"^[ \t]*(?:[-*][ \t]+)?Unknown:[ \t]*(\S.*)$", re.M)


class TicketError(Exception):
    """`data` is added to the error object the command prints."""

    def __init__(self, message: str, **data):
        super().__init__(message)
        self.data = data


class NoMatch(TicketError):
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


def read_text(path: Path) -> str:
    # utf-8-sig: Windows editors can save a byte-order mark, which would hide the frontmatter.
    return path.read_text(encoding="utf-8-sig")


def tickets_dir(folder: Path) -> Path:
    """Where a folder's `tickets.toml`, epic folders, leaf files, and plans are: `<folder>/tickets/` for an
    initiative or an epic, the folder itself for a backlog, which has no file of its own."""
    if not (folder / f"{folder.name}.md").is_file() and not (folder / TICKETS).is_dir():
        return folder
    if (folder / BREAKDOWN).is_file() or any(
        NAME_RE.match(p.name) or (EPIC_RE.match(p.name) and p.is_dir()) for p in folder.iterdir()
    ):
        raise TicketError(
            f"{folder.name} uses the earlier layout, its tickets beside {folder.name}.md instead of in "
            f"{folder.name}/{TICKETS}/; `bmad migrate` moves it"
        )
    return folder / TICKETS


def shown(folder: Path) -> str:
    """A folder's tickets as messages name them: `epic-cart/tickets`, or `backlog`."""
    return f"{folder.name}/{TICKETS}" if tickets_dir(folder) != folder else folder.name


def container_of(folder: Path) -> Path:
    """A `tickets/` folder given as `<dir>` stands for the folder that holds it."""
    return folder.parent if folder.name == TICKETS else folder


def load_breakdown(folder: Path) -> dict:
    path = tickets_dir(folder) / BREAKDOWN
    if not path.is_file():
        return {}
    where = f"{shown(folder)}/{BREAKDOWN}"
    try:
        data = tomllib.loads(read_text(path))
    except tomllib.TOMLDecodeError as e:
        raise TicketError(f"{where}: {e}") from e
    floor = data.get("next_id", 0)
    if isinstance(floor, bool) or not isinstance(floor, int):
        raise TicketError(f"{where}: `next_id` must be a whole number")
    kinds = [f"[[{t}]]" for t in TABLES if t in data]
    if len(kinds) > 1:
        raise TicketError(f"{where}: a breakdown holds one kind of table, not {' and '.join(kinds)}")
    for table in TABLES:
        rows = data.get(table, [])
        if not isinstance(rows, list) or not all(isinstance(r, dict) for r in rows):
            raise TicketError(f"{where}: write `[[{table}]]` tables, one per {table}")
        for r in rows:
            for key in ("covers", "after", "references", "notes"):
                if not isinstance(r.get(key, []), list):
                    raise TicketError(f"{where}: `{key}` must be a list")
            r["id"] = _id(r.get("id"))
            if r["id"] is None:
                raise TicketError(f"{where}: every {table} needs an `id`: a number, or letters and digits")
            if table != "entry":
                if not isinstance(r.get("slug"), str) or not r["slug"]:
                    raise TicketError(f"{where}: {table} {r['id']} needs a `slug`")
                for a in r.get("after", []):
                    if not isinstance(a, dict) or (_id(a.get(table)) is None and not isinstance(a.get(table), str)):
                        raise TicketError(
                            f'{where}: an {table}\'s `after` takes tables: [{{ {table} = <id or slug>, needs = "..." }}]'
                        )
    return data


def _id(value):
    """An id as the tree compares it, else None: a number, or letters and digits; digits alone are the number."""
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    # A frontmatter value of true or false is read as a boolean, so neither can be an id.
    if isinstance(value, str) and ID_RE.match(value) and value not in ("true", "false"):
        return int(value) if value.isdigit() else value
    return None


def load_container(folder: Path) -> dict:
    path = folder / f"{folder.name}.md"
    if not path.is_file():
        raise TicketError(f"{folder.name}: no {path.name}")
    fm = parse_frontmatter(read_text(path))
    if fm.get("type") not in CONTAINER_TYPES:
        raise TicketError(
            f"{folder.name}/{path.name}: type {fm.get('type')!r} is not one of {', '.join(CONTAINER_TYPES)}"
        )
    status = _one_of(fm.get("status", ""), CONTAINER_STATUSES, f"{folder.name}/{path.name}", "status")
    return {
        "slug": folder.name,
        "tracker_id": str(fm.get("tracker_id", "") or ""),
        "status": status,
        "refined": str(fm.get("refined", "")).lower() != "false",
        "raw_after": _list(fm.get("after"), f"{folder.name}.md"),
    }


def file_unknown(text: str) -> str:
    """The `Unknown:` lines of a leaf file's body, as `pull` writes an entry's `unknown` into Notes."""
    body = COMMENT_RE.sub("", FRONTMATTER_RE.sub("", text, count=1))
    return "; ".join(m.group(1).strip() for m in UNKNOWN_RE.finditer(body))


def load_folder(folder: Path, problems: list[str]) -> list[dict]:
    """One row per ticket in a folder, in build order: every breakdown entry, joined to its
    leaf file when one exists, then leaf files the breakdown does not list. Plans then set
    the status fields of the rows they join."""
    where, at = folder.name, shown(folder)
    rows = {}
    for e in load_breakdown(folder).get("entry", []):
        n, kind = e["id"], e.get("type")
        if kind not in LEAF_TYPES:
            raise TicketError(f"{at}/{BREAKDOWN}: entry {n} type {kind!r} is not one of {', '.join(LEAF_TYPES)}")
        if n in rows:
            raise TicketError(f"{at}/{BREAKDOWN}: two entries with id {n}")
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
            "refine": kind == "bug" or _flag(e.get("refine", False)),
            "description": str(e.get("description", "")),
            "verify": str(e.get("verify", "")),
            "unknown": str(e.get("unknown", "")),
            "references": [str(v) for v in e.get("references", [])],
            "notes": [str(v) for v in e.get("notes", [])],
            "risk": str(e.get("risk", "")),
            "hitl": _flag(e.get("hitl", False)),
            "plan_checkpoint": _flag(e.get("plan_checkpoint", False)),
            "done_checkpoint": _flag(e.get("done_checkpoint", False)),
            "covers": [str(c) for c in e.get("covers", [])],
            "estimate": e.get("estimate", ""),
            "blocked_at": "",
            "blocked_reason": "",
            "raw_after": _list(e.get("after"), f"{at}/{BREAKDOWN} entry {n}"),
            "entry_after": None,
        }
    unlisted, stray, plans = {}, [], []
    seen = {}
    for path in sorted(tickets_dir(folder).glob("*.md")):
        text = read_text(path)
        fm = parse_frontmatter(text, lenient=True)
        if not fm and text.startswith("---") and NAME_RE.match(path.name):
            raise TicketError(f"{at}/{path.name}: frontmatter does not close")
        if fm.get("type") not in LEAF_TYPES:
            if "ticket" in fm:
                plans.append((path.name, fm))
            continue
        try:
            fm = parse_frontmatter(text)
        except TicketError as e:
            raise TicketError(f"{at}/{path.name}: {e}") from e
        status = _one_of(fm.get("status", ""), STATUSES, f"{at}/{path.name}", "status")
        tracker_status = _one_of(fm.get("tracker_status", ""), STATES, f"{at}/{path.name}", "tracker_status")
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
        else:
            row["entry_after"] = row["raw_after"]
            row["entry_hitl"] = row["hitl"]
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
                "refine": row["refine"] or fm.get("type") == "bug",
                "hitl": _flag(fm.get("hitl", False)),
                "covers": [str(c) for c in fm["covers"]] if isinstance(fm.get("covers"), list) else row["covers"],
                "estimate": fm.get("estimate", row.get("estimate", "")),
                "risk": fm["risk"] if isinstance(fm.get("risk"), str) else row.get("risk", ""),
                "blocked_at": fm.get("blocked_at", ""),
                "blocked_reason": str(fm.get("blocked_reason", "") or ""),
                "unknown": file_unknown(text),
            }
        )
        row["raw_after"] = _list(fm.get("after", []), f"{at}/{path.name}")
    out = list(rows.values()) + [unlisted[n] for n in sorted(unlisted, key=lambda n: (isinstance(n, str), n))] + stray
    join_plans(out, plans, at, problems)
    return out


def join_plans(rows: list[dict], plans: list[tuple[str, dict]], where: str, problems: list[str]) -> None:
    """Set each plan's status fields on the one row its `ticket` names; a bad plan is a problem, not an error."""
    for name, fm in plans:
        ticket = fm["ticket"]
        row = None
        if _id(ticket) is not None:
            ticket = _id(ticket)
            row = next((r for r in rows if r["id"] == ticket), None)
        if row is None and isinstance(ticket, str) and ticket:
            row = next((r for r in rows if r["file"] == f"{ticket}.md"), None)
        if row is None:
            problems.append(f"{where}/{name}: ticket {ticket!r} names no entry or leaf file in {where}; skipped")
            continue
        if "plan" in row:
            raise TicketError(f"{where}/{row['plan']} and {name} are both plans for ticket {ticket!r}")
        fields = {k: str(fm.get(k, "") or "") for k in PLAN_FIELDS}
        if "assignee" not in fm:
            # A tracker's assignee is mirrored into the leaf file; the builds' plans carry no assignee.
            fields["assignee"] = row.get("assignee", "")
        try:
            _one_of(fields["status"], STATUSES, f"{where}/{name}", "status")
        except TicketError as e:
            problems.append(f"{e}; the ticket reads as blocked until the plan is fixed")
            fields.update(status="blocked", blocked_reason=f"{name} has an unknown status {fields['status']!r}")
        row.update({"plan": name, "state": row["tracker_status"] or STATE_OF[fields["status"]], **fields})


def epic_folders(initiative: Path) -> list[Path]:
    return sorted(
        d
        for d in tickets_dir(initiative).glob("epic-*")
        if d.is_dir() and ((d / f"{d.name}.md").is_file() or (tickets_dir(d) / BREAKDOWN).is_file())
    )


def load_tree(folder: Path) -> dict:
    """The folder asked about plus every epic its tickets can name."""
    children = load_breakdown(folder).get("initiative")
    if children is not None:
        names = ", ".join(c["slug"] for c in children)
        raise TicketError(f"{folder.name}: a parent initiative holds initiatives; name one of them: {names}")
    epics = epic_folders(folder)
    holder = folder.parent.parent if folder.parent.name == TICKETS else None
    if epics or "epic" in load_breakdown(folder):
        scope, initiative, folders = None, folder, None
    elif holder is not None and folder in epic_folders(holder):
        scope, initiative, folders = folder.name, holder, epic_folders(holder)
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
            raise TicketError(f"{shown(initiative)}/{BREAKDOWN}: two epics with id {e['id']}")
        if e["slug"] in epic_ids:
            raise TicketError(f"{shown(initiative)}/{BREAKDOWN}: two epics with slug {e['slug']}")
        epic_ids[e["slug"]] = e["id"]
    problems = []
    tickets = [t for f in folders for t in load_folder(f, problems)]
    for t in tickets:
        t["key"] = f"{t['epic']}/{t['id']}" if t["id"] is not None else f"{t['epic']}/{t['file']}"
    tree = {
        "scope": scope,
        "initiative": initiative,
        "folders": {f.name: f for f in folders},
        "epic_ids": epic_ids,
        "containers": {f.name: load_container(f) for f in epics},
        "tickets": tickets,
        "problems": problems,
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
    owners: dict[str, list[str]] = {}
    carriers = [(s, c["tracker_id"]) for s, c in containers.items()] + [(t["key"], t["tracker_id"]) for t in tickets]
    for key, tid in carriers:
        if tid:
            owners.setdefault(tid.lower(), []).append(key)
    for tid, keys in owners.items():
        if len(keys) > 1:
            raise TicketError(f"tracker_id {tid!r} is on more than one ticket: {', '.join(keys)}")

    def sibling(t, ref, where):
        """A bare number is always a sibling's id and a quoted one never is; an id with a letter is one when a
        sibling has it."""
        mates = [o for o in tickets if o["epic"] == t["epic"]]
        if isinstance(ref, int) and not isinstance(ref, bool):
            hit = next((o for o in mates if o["id"] == ref), None)
            if hit is None:
                raise TicketError(f"{where}: after {ref!r} names no entry in {t['epic']}")
            return hit["key"]
        for o in mates:
            if isinstance(o["id"], str) and o["id"] == ref:
                return o["key"]
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
            slug = slugs.get(_id(m.group(1))) if m else None
            if key is None and slug:
                key = f"{slug}/{_id(m.group(2))}"
                if key not in by_key:
                    raise TicketError(f"{where}: after {ref!r} names no entry in {slug}")
            if key is None and EPIC_RE.match(text):
                if text in tree["epic_ids"] and text not in containers:
                    raise TicketError(
                        f"{where}: after {ref!r} names an epic {BREAKDOWN} lists that has no folder yet; "
                        f"create {TICKETS}/{text}/{text}.md first"
                    )
                if text not in containers:
                    raise TicketError(f"{where}: after {ref!r} names no epic in this initiative")
                key = text
            if key is None:
                key = ids.get(text)
            if key is None and m:
                raise TicketError(f"{where}: after {ref!r} names no epic id in this initiative's {BREAKDOWN}")
            if key is None and NAME_RE.match(text if text.endswith(".md") else f"{text}.md"):
                raise TicketError(
                    f"{where}: after {ref!r} matches no ticket in {t['epic']}; a file name names a pulled ticket in the "
                    "same folder only: use the entry's id, or move a backlog ticket into the epic as an entry"
                )
            if key is None:
                raise TicketError(f"{where}: after {ref!r} matches no ticket")
            if key not in keys:
                keys.append(key)
        return keys

    at = {name: shown(f) for name, f in tree["folders"].items()}
    for t in tickets:
        where = f"{at[t['epic']]}/{t['file']}" if t["file"] else f"{at[t['epic']]}/{BREAKDOWN} entry {t['id']}"
        t["after"] = resolve(t, t.pop("raw_after"), where)
        planned = t.pop("entry_after")
        t["gated_by"] = []
        entry_hitl = t.pop("entry_hitl", None)
        t["drift"] = {}
        if planned is not None:
            entry_after = resolve(t, planned, where)
            if sorted(entry_after) != sorted(t["after"]):
                t["drift"]["after"] = {"file": t["after"], "entry": entry_after}
            if entry_hitl != t["hitl"]:
                t["drift"]["hitl"] = {"file": t["hitl"], "entry": entry_hitl}
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
        unmet = [b for b in t["after"] if b not in met] + [b for b in t["gated_by"] if b not in done]
        if t["status"] == "blocked" or t["blocked_at"]:
            t["waiting_on"] = unmet
            groups["blocked"].append(t)
        elif s in ("in-progress", "review"):
            groups["in_progress"].append(t)
        elif unmet:
            t["waiting_on"] = unmet
            groups["blocked"].append(t)
        elif t["refine"] and not t["refined"]:
            groups["ready_to_refine"].append(t)  # refining is where its unknown gets settled
        elif t.get("unknown"):
            groups["blocked"].append(t)
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
    if _id(n) is None:
        return key
    if slug == epic:
        return _id(n)
    if slug in tree["epic_ids"]:
        return f"{tree['epic_ids'][slug]}.{n}"
    return key


def declared_after(tree: dict) -> dict:
    """Each epic the initiative's `tickets.toml` lists, in build order, with its `after` as `[{epic, needs}]`."""
    if not tree["initiative"]:
        return {}
    listed = load_breakdown(tree["initiative"]).get("epic", [])
    slugs = [e["slug"] for e in listed]
    by_id = {i: slug for slug, i in tree["epic_ids"].items()}
    out = {}
    for e in listed:
        out[e["slug"]] = []
        for a in e.get("after", []):
            needed = by_id.get(_id(a.get("epic")), a.get("epic"))
            if needed not in slugs:
                raise TicketError(
                    f"{shown(tree['initiative'])}/{BREAKDOWN}: {e['slug']} is after {a.get('epic')!r}, which is no epic listed"
                )
            out[e["slug"]].append({"epic": needed, "needs": a.get("needs", "")})
    return out


def unpinned_after(tree: dict, declared: dict) -> list[dict]:
    """Declared `after` lines whose waiting epic has tickets but none waiting on the named epic."""
    out = []
    for slug, edges in declared.items():
        mine = [t for t in tree["tickets"] if t["epic"] == slug]
        for a in edges:
            needed = a["epic"]
            pinned = any(b == needed or b.startswith(f"{needed}/") for t in mine for b in t["after"] + t["gated_by"])
            if mine and not pinned and tree["scope"] in (None, slug):
                out.append({"epic": slug, "after": needed, "needs": a["needs"]})
    return out


def cross_epic_after(tree: dict, declared: dict) -> dict:
    """`undeclared_after`: an entry's `after` into an epic its epic does not declare. `order_conflict`: an epic
    that waits, declared or through its tickets, on an epic later in the initiative's build order."""
    order = list(declared)
    undeclared, conflicts = [], []

    def conflict(epic, needed):
        pair = {"epic": epic, "after": needed}
        if order.index(needed) > order.index(epic) and pair not in conflicts and tree["scope"] in (None, epic):
            conflicts.append(pair)

    for slug, edges in declared.items():
        for a in edges:
            conflict(slug, a["epic"])
    for slug, c in tree["containers"].items():
        for b in c["after"]:
            if slug in declared and b.partition("/")[0] in declared:
                conflict(slug, b.partition("/")[0])
    for t in tree["tickets"]:
        if t["epic"] not in declared:
            continue
        allowed = {a["epic"] for a in declared[t["epic"]]}
        for b in t["after"]:
            needed = b.partition("/")[0]
            if needed == t["epic"] or needed not in declared:
                continue
            conflict(t["epic"], needed)
            if needed not in allowed and tree["scope"] in (None, t["epic"]):
                undeclared.append(
                    {"epic": t["epic"], "after": needed, "ref": row_ref(t, tree), "names": ref(b, t["epic"], tree)}
                )
    return {"undeclared_after": undeclared, "order_conflict": conflicts}


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
            "risk",
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
        row["drift"] = dict(t["drift"])
        if "after" in row["drift"]:
            row["drift"]["after"] = {k: [ref(b, t["epic"], tree) for b in v] for k, v in t["drift"]["after"].items()}
    if t.get("waiting_on"):
        row["waiting_on"] = [ref(b, t["epic"], tree) for b in t["waiting_on"]]
    for key in ("unknown", "plan_checkpoint", "done_checkpoint"):
        if t.get(key):
            row[key] = t[key]
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
    tickets = tomllib.loads(read_text(cfg)).get("tickets", {})
    return tickets if isinstance(tickets, dict) else {}


def store_name(project_root: Path | None) -> str:
    store = store_config(project_root).get("store", "repo")
    return store if isinstance(store, str) and store else "repo"


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


def tickets_root(project_root: Path, config: dict | None = None) -> Path:
    """`{output_folder}` for the project: the ticket tree lives beside the documents."""
    config = central_config(project_root) if config is None else config
    core = config.get("core", {})
    output = str(core.get("output_folder", "") if isinstance(core, dict) else "")
    output = output.replace("{project-root}", str(project_root))
    return project_root / output


def active_initiative(project_root: Path) -> Path:
    """`{output_folder}/{active_initiative}` for the project."""
    config = central_config(project_root)
    core = config.get("core", {})
    name = core.get("active_initiative") if isinstance(core, dict) else None
    if not isinstance(name, str) or not name.strip():
        raise TicketError(
            "no active initiative: set core.active_initiative in _bmad/custom/config.user.toml, or pass a folder"
        )
    folder = (tickets_root(project_root, config) / name.strip()).resolve()
    if not folder.is_dir():
        raise TicketError(f"active initiative folder not found: {folder}")
    return folder


# ---------------------------------------------------------------- commands


def _folder(args) -> Path:
    if args.dir is None:
        root = project_root_for(args, Path.cwd())
        if root is None:
            raise TicketError("no project root found: no _bmad/ at or above the working directory; pass --project-root")
        # The store is then read from this project even when output_folder lies outside it.
        args.project_root = str(root)
        folder = active_initiative(root)
        backlog = (tickets_root(root) / "backlog").resolve()
        args.backlog = backlog if backlog.is_dir() and backlog != folder else None
        return folder
    return locate_dir(args, args.dir)


def locate_dir(args, name: str) -> Path:
    """A `<dir>` argument as a folder: as given, else under the store, the active initiative and its `tickets/`
    folder, or the project root."""
    folder = Path(name).resolve()
    root = None if folder.is_dir() or Path(name).is_absolute() else project_root_for(args, Path.cwd())
    bases = []
    if root is not None:
        try:
            bases = [tickets_root(root), root]
        except TicketError:  # no BMad config to name the store: the project root alone
            bases = [root]
        else:
            try:
                active = active_initiative(root)
            except TicketError:  # none set: the store and the project root
                pass
            else:
                bases[1:1] = [active, *([active / TICKETS] if (active / TICKETS).is_dir() else [])]
        for base in bases:
            if (base / name).is_dir():
                return container_of((base / name).resolve())
    if not folder.is_dir():
        looked = [] if Path(name).is_absolute() else [Path.cwd(), *bases]
        where = f" (looked under {', '.join(str(p) for p in looked)})" if looked else ""
        raise TicketError(f"not a folder: {name}{where}")
    return container_of(folder)


def with_backlog(args, out: dict, view) -> dict:
    """Add the backlog's view to a command that ran on the active initiative."""
    backlog = getattr(args, "backlog", None)
    if backlog is not None:
        try:
            out["backlog"] = view(backlog)
        except (TicketError, OSError, ValueError) as e:
            out["backlog"] = {"folder": backlog.name, "error": str(e)}
        for group in ("ready_to_refine", "ready_to_start", "in_progress", "blocked", "tickets"):
            for row in out["backlog"].get(group, []):
                # An id here could also name a ticket in the initiative; the file name cannot.
                row["ref"] = row["file"] or row["ref"]
    return out


def locate(args, folder: Path, text: str) -> tuple[dict, dict]:
    """The ticket a reference names and the tree holding it: the folder's, else, with no `<dir>`, the backlog's."""
    tree = load_tree(folder)
    try:
        return resolve_ticket(tree, text), tree
    except NoMatch as miss:
        backlog = getattr(args, "backlog", None)
        if backlog is None:
            raise
        try:
            other = load_tree(backlog)
            other["fallback"] = True
            return resolve_ticket(other, text), other
        except (NoMatch, OSError, ValueError):  # not there, or a backlog that cannot be read
            raise miss from None


def next_view(folder: Path) -> dict:
    tree = load_tree(folder)
    declared = declared_after(tree)
    return {
        "folder": folder.name,
        **{k: [public(t, tree) for t in v] for k, v in classify(tree).items()},
        "unpinned_after": unpinned_after(tree, declared),
        **cross_epic_after(tree, declared),
        **({"problems": tree["problems"]} if tree["problems"] else {}),
    }


def is_parent(folder: Path) -> bool:
    return "initiative" in load_breakdown(folder)


def parent_view(folder: Path) -> dict:
    """A parent initiative's children in build order: each with its declared `after` and, once its folder exists,
    its file's status and its ticket counts; `waiting_on` names the prerequisites not yet done."""
    listed = load_breakdown(folder)["initiative"]
    where = f"{shown(folder)}/{BREAKDOWN}"
    ids = {}
    for c in listed:
        if c["id"] in ids.values():
            raise TicketError(f"{where}: two initiatives with id {c['id']}")
        if c["slug"] in ids:
            raise TicketError(f"{where}: two initiatives with slug {c['slug']}")
        ids[c["slug"]] = c["id"]
    by_id = {i: slug for slug, i in ids.items()}
    rows = []
    for c in listed:
        after = []
        for a in c.get("after", []):
            needed = by_id.get(_id(a.get("initiative")), a.get("initiative"))
            if needed not in ids:
                raise TicketError(
                    f"{where}: {c['slug']} is after {a.get('initiative')!r}, which is no initiative listed"
                )
            after.append({"initiative": needed, "needs": str(a.get("needs", ""))})
        row = {"id": c["id"], "slug": c["slug"], "title": str(c.get("title", "")), "after": after, "folder": None}
        child = folder.parent / c["slug"]
        if child.is_dir():
            row.update(
                folder=child.name, status=load_container(child)["status"], counts=counts(load_tree(child)["tickets"])
            )
        rows.append(row)
    graph = {r["slug"]: [a["initiative"] for a in r["after"]] for r in rows}
    state = {}

    def visit(node, path):
        if state.get(node) == "active":
            raise TicketError("cycle through " + " -> ".join(path + [node]))
        if state.get(node) is None:
            state[node] = "active"
            for b in graph[node]:
                visit(b, path + [node])
            state[node] = "done"

    for node in graph:
        visit(node, [])
    order = list(graph)
    done = {r["slug"] for r in rows if r.get("status") == "done"}
    conflicts = []
    for r in rows:
        r["waiting_on"] = [b for b in graph[r["slug"]] if b not in done]
        conflicts += [
            {"initiative": r["slug"], "after": b} for b in graph[r["slug"]] if order.index(b) > order.index(r["slug"])
        ]
    return {"folder": folder.name, "initiatives": rows, "order_conflict": conflicts}


def cmd_next(args) -> dict:
    folder = _folder(args)
    store = store_name(project_root_for(args, folder))
    if store != "repo" and not args.synced:
        raise StoreRefusal(f"store is {store}: sync ticket status from the tracker first, then rerun with --synced")
    if is_parent(folder):
        out = parent_view(folder)
        out["ready"] = [
            r["slug"] for r in out["initiatives"] if not r["waiting_on"] and r.get("status") not in ("done", "dropped")
        ]
        return with_backlog(args, {"store": store, **out}, next_view)
    return with_backlog(args, {"store": store, **next_view(folder)}, next_view)


def next_id(tree: dict, folder: str) -> int:
    """The id a new ticket in the folder takes: one past the highest number its entries and leaf files use, or
    `next_id` at the top of its `tickets.toml` when that is higher."""
    # `6a` uses up 6: a lettered id is a split of that number.
    used = [re.match(r"\d+", str(t["id"])) for t in tree["tickets"] if t["epic"] == folder]
    # An entry moved to another folder took its id along; the counter it left keeps that id from coming back.
    floor = load_breakdown(tree["folders"][folder]).get("next_id", 0)
    return max(max((int(m.group()) for m in used if m), default=0) + 1, floor)


def counts(tickets: list[dict]) -> dict:
    out = {"total": len(tickets)}
    for t in tickets:
        out[t["state"]] = out.get(t["state"], 0) + 1
    return out


def status_view(folder: Path) -> dict:
    tree = load_tree(folder)
    declared = declared_after(tree)
    tickets = in_scope(tree)
    blocks = {}
    for t in tree["tickets"]:
        for b in t["after"]:
            blocks.setdefault(b, []).append(t["key"])
    out = {
        "folder": folder.name,
        "tickets": [public(t, tree, blocks) for t in tickets],
        "counts": counts(tickets),
        "longest_remaining_chain": longest_remaining_chain(tree),
        "unpinned_after": unpinned_after(tree, declared),
        **cross_epic_after(tree, declared),
        **({"problems": tree["problems"]} if tree["problems"] else {}),
    }
    if tree["scope"] is None:
        # The declared epics in build order, folder or not, then any folder the breakdown does not list.
        out["epics"] = []
        for slug in [*declared, *sorted(s for s in tree["containers"] if s not in declared)]:
            row = {"slug": slug, "id": tree["epic_ids"].get(slug), "after": declared.get(slug, [])}
            c = tree["containers"].get(slug)
            if c is None:
                row["folder"] = None
            else:
                row.update(
                    folder=slug,
                    status=c["status"],
                    refined=c["refined"],
                    gated_by=c["after"],
                    blocks=[ref(b, None, tree) for b in blocks.get(slug, [])],
                    next_id=next_id(tree, slug),
                )
            out["epics"].append(row)
    else:
        out["next_id"] = next_id(tree, tree["scope"])
    return out


def cmd_status(args) -> dict:
    folder = _folder(args)
    store = store_name(project_root_for(args, folder))
    view = parent_view if is_parent(folder) else status_view
    return with_backlog(args, {"store": store, **view(folder)}, status_view)


PULLED = """---
{frontmatter}
---

# {heading}

## Description

{description}

## Requirements

Verify: {verify}

## References

- parent — {parent}
{references}{notes}"""


def title_slug(title: str) -> str:
    title = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode("ascii")
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
        slug = {i: s for s, i in tree["epic_ids"].items()}.get(_id(m.group(1)))
        hits = [t for t in tickets if slug and t["epic"] == slug and t["id"] == _id(m.group(2))]
    elif _id(ref) is not None and tree["scope"]:
        hits = [t for t in tickets if t["epic"] == tree["scope"] and t["id"] == _id(ref)]
    if not hits and isinstance(_id(ref), str):
        # An id with a letter names its ticket in any epic before the words of a title can match it.
        hits = [t for t in tickets if t["id"] == _id(ref)]
    for pool in (in_scope(tree), tickets):
        if not hits:
            hits = [t for t in pool if t["file"] and low in (t["file"].lower(), t["file"][:-3].lower())]
    if not hits:
        hits = [t for t in tickets if t["tracker_id"] and low == t["tracker_id"].lower()]
    if not hits and not ref.isdigit():
        hits = [t for t in in_scope(tree) if low in t["title"].lower()]
    if not hits:
        raise NoMatch(f"no ticket matches {ref!r}")
    if len(hits) > 1:
        names = ", ".join(ref_name(t, tree) for t in hits)
        raise TicketError(f"{ref!r} matches more than one ticket: {names}")
    return hits[0]


def leaf_stem(t: dict, tree: dict) -> str:
    """The leaf file's stem, or the one `pull` gives it: `<type>-<slug of the title>`, with `-<id>` added when a
    file or an earlier entry in the folder already has that name."""
    if t["file"]:
        return t["file"][:-3]
    stem = f"{t['type']}-{title_slug(t['title'])}"
    taken = set()
    for o in tree["tickets"]:
        if o is t:
            break
        if o["epic"] == t["epic"] and not o["file"]:
            taken.add(f"{o['type']}-{title_slug(o['title'])}")
    taken |= {o["file"][:-3] for o in tree["tickets"] if o["epic"] == t["epic"] and o["file"]}
    return f"{stem}-{t['id']}" if stem in taken else stem


def plan_path(t: dict, tree: dict) -> Path:
    """The joined plan, else `<leaf stem>-plan.md`."""
    folder = tickets_dir(tree["folders"][t["epic"]])
    if t.get("plan"):
        return folder / t["plan"]
    return folder / f"{leaf_stem(t, tree)}-plan.md"


def cmd_find(args) -> dict:
    folder = _folder(args)
    t, tree = locate(args, folder, args.ref)
    home = tree["folders"][t["epic"]]
    row = public(t, tree)
    if tree.get("fallback") and t["file"]:
        row["ref"] = t["file"]  # as the backlog view names it: an id could name a ticket in the initiative
    # Once a leaf file exists it holds the text and the entry's copy is no longer kept up. Unlisted and stray
    # leaves have no entry.
    entry = {} if t["file"] else t
    container = home / f"{home.name}.md"  # an epic's file, or the initiative's for a leaf directly under one
    return {
        **row,
        "folder": home.name,
        "description": entry.get("description", ""),
        "verify": entry.get("verify", ""),
        "references": entry.get("references", []),
        "notes": entry.get("notes", []),
        "unknown": t.get("unknown", ""),
        "epic_file": str(container) if container.is_file() else None,
        "story_file": str(tickets_dir(home) / t["file"]) if t["file"] else None,
        "plan": str(plan_path(t, tree)),
    }


def ref_name(t: dict, tree: dict) -> str:
    return f"{t['file'] or t['id']} in {t['epic']}"


def cmd_pull(args) -> dict:
    folder = _folder(args)
    tree = load_tree(folder)
    n = _id(args.id)
    t = next((t for t in in_scope(tree) if t["epic"] == folder.name and t["id"] == n), None)
    if n is None or t is None:
        raise TicketError(f"{shown(folder)}/{BREAKDOWN} has no entry {args.id}")
    if t["file"]:
        raise TicketError(f"entry {args.id} is already pulled: {t['file']}")
    path = write_leaf(t, tree, project_root_for(args, folder))
    return {"file": path.name, "refine": t["refine"]}


def parent_reference(folder: Path, root: Path | None) -> str:
    """The epic file as a leaf's `- parent —` reference names it."""
    epic_file = folder / f"{folder.name}.md"
    try:
        return Path(os.path.relpath(epic_file, root)).as_posix() if root else epic_file.as_posix()
    except ValueError:  # another drive on Windows
        return epic_file.as_posix()


def write_leaf(t: dict, tree: dict, root: Path | None) -> Path:
    """Write an entry's leaf file from the entry and name it on the row."""
    folder = tree["folders"][t["epic"]]
    path = tickets_dir(folder) / f"{leaf_stem(t, tree)}.md"
    if path.exists():
        raise TicketError(f"{path.name} exists already; change entry {t['id']}'s title")
    after = [str(ref(b, t["epic"], tree)) for b in t["after"]]
    parent = parent_reference(folder, root)
    notes = ([f"Unknown: {t['unknown']}"] if t["unknown"] else []) + t["notes"]
    # Other empty fields are left out; `after` and `hitl` stay because `status` compares them with the entry.
    # No status: the build writes it when it starts.
    fields = [
        ("id", str(t["id"])),
        ("type", t["type"]),
        ("title", json.dumps(t["title"], ensure_ascii=False)),
        ("parent", t["epic"]),
        ("covers", f"[{', '.join(t['covers'])}]" if t["covers"] else ""),
        ("after", f"[{', '.join(after)}]"),
        ("refined", "false" if t["refine"] else ""),
        ("hitl", "true" if t["hitl"] else "false"),
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
    t["file"] = path.name
    return path


def quoted(value: str) -> str:
    """A double-quoted scalar that `parse_frontmatter` reads back exactly."""
    # parse_frontmatter cuts a value at "   #" and splits lines on these characters, so they go in as escapes.
    text = json.dumps(value, ensure_ascii=False).replace("   #", "   \\u0023")
    return text.translate({c: f"\\u{c:04x}" for c in (0x85, 0x2028, 0x2029)})


def edit_frontmatter(path: Path, values: dict[str, str]) -> str:
    """Set frontmatter values in a file, keeping its line endings and byte-order mark; an empty value removes
    the line. Returns the new text."""
    raw = path.read_bytes()
    text = raw.decode("utf-8-sig").replace("\r\n", "\n")
    for key, value in values.items():
        text = set_frontmatter_value(text, key, value)
    data = text.encode("utf-8")  # before the file is opened, so a failure leaves the file as it was
    if b"\r\n" in raw:
        data = data.replace(b"\n", b"\r\n")
    if raw.startswith(codecs.BOM_UTF8):
        data = codecs.BOM_UTF8 + data
    path.write_bytes(data)
    return text


def cmd_mark(args) -> dict:
    """Write status, assignee, and the blocked fields to the ticket's plan; never to its leaf file."""
    folder = _folder(args)
    store = store_name(project_root_for(args, folder))
    if store != "repo":
        raise StoreRefusal(f"store is {store}: change status through the store's write verb, not this script")
    t, tree = locate(args, folder, args.ref)
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
        data = text.encode("utf-8")  # before the file is opened, so a failure leaves no empty plan
        try:
            with path.open("xb") as f:
                f.write(data)
        except FileExistsError:
            raise TicketError(f"{path.name} exists already and is not the plan for {ref_name(t, tree)}") from None
    else:
        values = {"status": args.status, **blocked}
        if args.assignee is not None:
            values["assignee"] = quoted(args.assignee)
        text = edit_frontmatter(path, values)
    fm = parse_frontmatter(text, lenient=True)
    return {
        "plan": str(path),
        "created": created,
        **{k: fm.get(k, "") for k in PLAN_FIELDS},
    }


MIRROR_KEYS = ("ref", "tracker_id", "remote", "tracker_status", "assignee", "after")


def _mirror_values(item: dict, where: str) -> dict[str, str]:
    """The frontmatter lines one mirrored ticket sets, each validated."""
    values = {}
    for key in ("tracker_id", "remote", "assignee"):
        if key in item:
            value = item[key]
            if key == "tracker_id" and isinstance(value, int) and not isinstance(value, bool):
                value = str(value)  # a tracker that numbers its items returns a number
            if not isinstance(value, str):
                raise TicketError(f"{where}: {key} must be a string")
            values[key] = quoted(value) if value else ""
    if "tracker_status" in item:
        values["tracker_status"] = _one_of(item["tracker_status"], STATES, where, "tracker_status")
    if "after" in item:
        if not isinstance(item["after"], list):
            raise TicketError(f"{where}: after must be a list")
        parts = []
        for b in item["after"]:
            if isinstance(b, bool) or not isinstance(b, (int, str)) or (isinstance(b, str) and ("," in b or not b)):
                raise TicketError(f"{where}: after takes ids and names without commas, not {b!r}")
            # A number stays bare, a sibling's id; a string is quoted, so a tracker id of digits stays one.
            parts.append(str(b) if isinstance(b, int) else quoted(b))
        values["after"] = f"[{', '.join(parts)}]"
    return values


def by_tracker_id(tree: dict, tracker_id: str) -> dict:
    """The one ticket that already carries a tracker id; nothing else about it is matched."""
    hits = [t for t in tree["tickets"] if t["tracker_id"] and t["tracker_id"].lower() == tracker_id.lower()]
    if not hits:
        raise NoMatch(f"no ticket carries tracker_id {tracker_id!r}")
    if len(hits) > 1:
        raise TicketError(f"tracker_id {tracker_id!r} is on more than one ticket")
    return hits[0]


def container_named(tree: dict, name: str, by_ref: bool) -> dict | None:
    """The container whose tracker id, or with a `ref` whose folder, is `name`: its folder and its file's status."""
    low = name.lower()
    for folder in [*tree["folders"].values(), *([tree["initiative"]] if tree["initiative"] else [])]:
        path = folder / f"{folder.name}.md"
        if not path.is_file():
            continue
        fm = parse_frontmatter(read_text(path), lenient=True)
        tracker_id = str(fm.get("tracker_id", "") or "")
        if fm.get("type") in CONTAINER_TYPES and (
            (tracker_id and tracker_id.lower() == low) or (by_ref and folder.name.lower() == low)
        ):
            return {"folder": folder.name, "status": str(fm.get("status", "") or "")}
    return None


def cmd_mirror(args) -> dict:
    """Write what the tracker returned into each ticket's leaf file; never `status`, which is the build's."""
    folder = _folder(args)
    root = project_root_for(args, folder)
    store = store_name(root)
    if store == "repo":
        raise StoreRefusal("store is repo: there is no tracker to mirror")
    items = json.load(sys.stdin)
    if not isinstance(items, list) or not all(isinstance(i, dict) for i in items):
        raise TicketError("mirror reads a JSON array of objects on stdin")
    folders, trees = [folder], [load_tree(folder)]
    if getattr(args, "backlog", None):
        try:
            trees.append(load_tree(args.backlog))
            folders.append(args.backlog)
        except (TicketError, OSError, ValueError):  # a backlog that cannot be read holds no match
            pass
    work, unmatched, containers, seen = [], [], [], set()
    for n, item in enumerate(items, 1):
        name = item.get("ref", item.get("tracker_id"))
        where = f"item {n} ({name!r})"
        unknown = [k for k in item if k not in MIRROR_KEYS]
        if unknown:
            hint = "; status is the build's and is never mirrored" if "status" in unknown else ""
            raise TicketError(f"{where}: unknown key {unknown[0]!r}{hint}")
        if isinstance(name, bool) or not isinstance(name, (int, str)) or name == "":
            raise TicketError(f"item {n}: give a ref, or the tracker_id of a ticket that already carries it")
        values = _mirror_values(item, where)
        hit = miss = container = None
        for tree in trees:
            try:
                # A tracker id alone never falls back to an entry id or a title that happens to match it.
                t = resolve_ticket(tree, str(name)) if "ref" in item else by_tracker_id(tree, str(name))
            except NoMatch as e:
                miss = miss or e
                container = container or container_named(tree, str(name), "ref" in item)
                continue
            hit = (t, tree)
            break
        if hit is None:
            if container:
                # A container's file is Sofia's to edit; the row shows what the tracker says against it.
                containers.append({"ref": name, **container, "tracker_status": item.get("tracker_status", "")})
            else:
                unmatched.append({"ref": name, "error": str(miss)})
            continue
        if id(hit[0]) in seen:
            raise TicketError(f"{where}: {ref_name(*hit)} is named twice")
        seen.add(id(hit[0]))
        work.append((*hit, values))
    undo, mirrored = [], []
    try:
        for t, tree, values in work:
            pulled = not t["file"]
            if pulled:
                path = write_leaf(t, tree, root)
                undo.append((path, None))
            else:
                path = tickets_dir(tree["folders"][t["epic"]]) / t["file"]
                undo.append((path, path.read_bytes()))
            edit_frontmatter(path, values)
            ref_out = row_ref(t, tree) if tree is trees[0] else path.name
            mirrored.append({"ref": ref_out, "file": path.name, "pulled": pulled, "set": sorted(values)})
        for f in folders:
            load_tree(f)
    except (TicketError, OSError, ValueError) as e:
        for path, raw in undo:
            try:
                if raw is None:
                    path.unlink(missing_ok=True)
                else:
                    path.write_bytes(raw)
            except OSError:  # keep restoring the rest; the first failure is the one reported
                pass
        # The discovery procedure needs `unmatched` even when a known ticket's `after` named one of them.
        raise TicketError(f"nothing was mirrored: {e}", **({"unmatched": unmatched} if unmatched else {})) from e
    return {
        "folder": folder.name,
        "store": store,
        "mirrored": mirrored,
        "containers": containers,
        "unmatched": unmatched,
    }


TABLE_RE = re.compile(r"^[ \t]*\[\[(entry|epic)\]\][ \t]*(?:#.*)?$", re.M)
ID_LINE_RE = re.compile(r"^([ \t]*id[ \t]*=[ \t]*)(\S+)(.*)$", re.M)
AFTER_LINE_RE = re.compile(r"^([ \t]*after[ \t]*=[ \t]*)\[(.*?)\](.*)$", re.M)
NEXT_ID_LINE_RE = re.compile(r"^[ \t]*next_id[ \t]*=.*$", re.M)


def split_tables(text: str) -> tuple[str, list[str]]:
    """A breakdown's text as the lines before its first table and one string per `[[entry]]` or `[[epic]]`."""
    starts = [m.start() for m in TABLE_RE.finditer(text)]
    if not starts:
        return text, []
    return text[: starts[0]], [text[a:b] for a, b in zip(starts, [*starts[1:], len(text)], strict=True)]


def parse_table(block: str) -> tuple[str, dict]:
    data = tomllib.loads(block)
    kind = "entry" if "entry" in data else "epic"
    row = data[kind][0]
    row["id"] = _id(row.get("id"))
    return kind, row


def list_text(values: list, toml: bool) -> str:
    """A list as `tickets.toml` or a leaf's frontmatter reads it back: numbers bare, strings quoted."""
    return (
        "["
        + ", ".join(
            str(v) if isinstance(v, int) else (json.dumps(v, ensure_ascii=False) if toml else quoted(v)) for v in values
        )
        + "]"
    )


def set_after_line(block: str, current: list, new: list, where: str) -> str:
    m = AFTER_LINE_RE.search(block)
    try:
        if not m or tomllib.loads(f"after = [{m.group(2)}]")["after"] != current:
            raise ValueError
    except ValueError:
        raise TicketError(f"{where}: `after` must sit on one line to be rewritten") from None
    return block[: m.start()] + m.group(1) + list_text(new, toml=True) + m.group(3) + block[m.end() :]


def cmd_move(args) -> dict:
    """Move an entry, with its leaf file and plan, to another folder, rewriting ids and every `after` that names it."""
    src, dest = locate_dir(args, args.src), locate_dir(args, args.to)
    root = project_root_for(args, src)
    tree = load_tree(src)
    t = resolve_ticket(tree, args.ref)
    old = tree["folders"][t["epic"]]
    if old.resolve() == dest.resolve():
        raise TicketError(f"{ref_name(t, tree)} is already in {dest.name}")
    toml_old = tickets_dir(old) / BREAKDOWN
    head, tables = split_tables(read_text(toml_old)) if toml_old.is_file() else ("", [])
    parsed = [parse_table(b) for b in tables]
    moved = next((i for i, (kind, row) in enumerate(parsed) if kind == "entry" and row["id"] == t["id"]), None)
    if moved is None:
        raise TicketError(f"{ref_name(t, tree)} has no entry in {shown(old)}/{BREAKDOWN}; move moves entries")
    dest_tree = load_tree(dest)
    if dest_tree["scope"] is None:
        raise TicketError(f"{dest.name} holds epics, not entries")
    new_id = next_id(dest_tree, dest.name)
    floor = next_id(tree, old.name)
    same = tree["initiative"] is not None and dest.resolve().parent == tickets_dir(tree["initiative"]).resolve()
    old_epic_id = tree["epic_ids"].get(old.name) if same else None
    dest_epic_id = tree["epic_ids"].get(dest.name) if same else None
    slugs = {i: s for s, i in tree["epic_ids"].items()}
    mates = [o for o in tree["tickets"] if o["epic"] == old.name]

    def is_sibling(e, o) -> bool:
        if isinstance(e, int) and not isinstance(e, bool):
            return o["id"] == e
        return isinstance(e, str) and (
            (isinstance(o["id"], str) and o["id"] == e) or bool(o["file"] and e in (o["file"], o["file"][:-3]))
        )

    def names_moved(e, folder: Path) -> bool:
        if folder.resolve() == old.resolve() and is_sibling(e, t):
            return True
        if all(f.resolve() != folder.resolve() for f in tree["folders"].values()):
            return False  # another initiative numbers its epics its own way
        m = CROSS_RE.match(e) if isinstance(e, str) else None
        return bool(m and slugs.get(_id(m.group(1))) == old.name and _id(m.group(2)) == t["id"])

    def new_ref(folder: Path, where: str):
        if folder.resolve() == dest.resolve():
            return new_id
        if dest_epic_id is None:
            raise TicketError(
                f"{where}: names the moved entry, but {dest.name} has no id in the initiative's {BREAKDOWN} to name it by"
            )
        return f"{dest_epic_id}.{new_id}"

    def own_ref(e, where: str):
        mate = next((o for o in mates if o is not t and is_sibling(e, o)), None)
        if mate is not None:
            if old_epic_id is None or mate["id"] is None:
                raise TicketError(f"{where}: after {e!r} names a ticket in {old.name} that {dest.name} cannot name")
            return f"{old_epic_id}.{mate['id']}"
        m = CROSS_RE.match(e) if isinstance(e, str) else None
        if m and same and slugs.get(_id(m.group(1))) == dest.name:
            return _id(m.group(2))
        return e

    # Every change is computed first; files are written only when all of them are known.
    toml_writes: dict[Path, str] = {}
    fm_writes: list[tuple[Path, dict]] = []
    rewritten = []
    folders = list(tree["folders"].values())
    if all(f.resolve() != dest.resolve() for f in folders):
        folders.append(dest)
    for folder in folders:
        is_old = folder.resolve() == old.resolve()
        home, at = tickets_dir(folder), shown(folder)
        path = home / BREAKDOWN
        if path.is_file():
            f_head, f_tables = (head, list(tables)) if is_old else split_tables(read_text(path))
            changed = False
            for i, block in enumerate(f_tables):
                kind, row = parse_table(block)
                if kind != "entry" or (is_old and i == moved):
                    continue
                where = f"{at}/{BREAKDOWN} entry {row['id']}"
                after = _list(row.get("after"), where)
                new = [new_ref(folder, where) if names_moved(e, folder) else e for e in after]
                if new != after:
                    f_tables[i] = set_after_line(block, after, new, where)
                    rewritten.append({"where": where, "after": new})
                    changed = True
            if is_old:
                f_tables.pop(moved)
                if NEXT_ID_LINE_RE.search(f_head):
                    f_head = NEXT_ID_LINE_RE.sub(f"next_id = {floor}", f_head, count=1)
                else:
                    f_head = f_head.rstrip("\n") + ("\n\n" if f_head.strip() else "") + f"next_id = {floor}\n\n"
                changed = True
            if changed:
                toml_writes[path] = f_head + "".join(f_tables)
        own = folder / f"{folder.name}.md"  # an epic file's own `after` can name the entry too
        for path in sorted({*home.glob("*.md"), *([own] if own.is_file() else [])}):
            if is_old and path.parent == home and path.name == t["file"]:
                continue
            fm = parse_frontmatter(read_text(path), lenient=True)
            if fm.get("type") not in LEAF_TYPES and not (fm.get("type") in CONTAINER_TYPES and path == own):
                continue
            where = f"{at}/{path.name}" if path != own else f"{folder.name}/{own.name}"
            after = _list(fm.get("after"), where)
            new = [new_ref(folder, where) if names_moved(e, folder) else e for e in after]
            if new != after:
                fm_writes.append((path, {"after": list_text(new, toml=False)}))
                rewritten.append({"where": where, "after": new})
    block = tables[moved]
    old_home, dest_home = tickets_dir(old), tickets_dir(dest)
    where = f"{shown(dest)}/{BREAKDOWN} entry {new_id}"
    block = ID_LINE_RE.sub(lambda m: f"{m.group(1)}{new_id}{m.group(3)}", block, count=1)
    after = _list(parsed[moved][1].get("after"), where)
    new = [own_ref(e, where) for e in after]
    if new != after:
        block = set_after_line(block, after, new, where)
        rewritten.append({"where": where, "after": new})
    toml_dest = dest_home / BREAKDOWN
    if toml_dest in toml_writes:
        existing = toml_writes[toml_dest]
    else:
        existing = read_text(toml_dest) if toml_dest.is_file() else ""
    toml_writes[toml_dest] = (existing.rstrip("\n") + "\n\n" if existing.strip() else "") + block.strip("\n") + "\n"
    moves = []
    for name, values in (
        (t["file"], {"id": str(new_id), "parent": dest.name}),
        (t.get("plan"), {"ticket": str(new_id)}),
    ):
        if not name:
            continue
        if (dest_home / name).exists():
            raise TicketError(f"{shown(dest)}/{name} exists already")
        if name == t["file"]:
            fm = parse_frontmatter(read_text(old_home / name))
            after = _list(fm.get("after"), f"{shown(old)}/{name}")
            new = [own_ref(e, f"{shown(old)}/{name}") for e in after]
            if new != after:
                values["after"] = list_text(new, toml=False)
                rewritten.append({"where": f"{shown(dest)}/{name}", "after": new})
        moves.append((old_home / name, dest_home / name, values))

    backup: dict[Path, bytes | None] = {}
    made = None if dest_home.is_dir() else dest_home

    def keep(path: Path) -> None:
        if path not in backup:
            backup[path] = path.read_bytes() if path.exists() else None

    try:
        if made is not None:
            made.mkdir()
        for path, text in toml_writes.items():
            keep(path)
            path.write_text(text, encoding="utf-8")
        for path, values in fm_writes:
            keep(path)
            edit_frontmatter(path, values)
        for source, target, values in moves:
            keep(source)
            keep(target)
            raw = source.read_bytes()
            if source.name == t["file"]:
                raw = re.sub(
                    rb"(?m)^- parent \xe2\x80\x94 [^\r\n]*",
                    lambda _: f"- parent — {parent_reference(dest, root)}".encode(),
                    raw,
                    count=1,
                )
            target.write_bytes(raw)
            edit_frontmatter(target, values)
            source.unlink()
        for folder in (dest, old):
            load_tree(folder)
    except (TicketError, OSError, ValueError) as e:
        for path, raw in backup.items():
            try:
                if raw is None:
                    path.unlink(missing_ok=True)
                else:
                    path.write_bytes(raw)
            except OSError:  # keep restoring the rest; the first failure is the one reported
                pass
        if made is not None and made.is_dir() and not any(made.iterdir()):
            made.rmdir()
        raise TicketError(f"nothing was moved: {e}") from e
    return {
        "from": old.name,
        "to": dest.name,
        "old_id": t["id"],
        "id": new_id,
        "ref": f"{dest_epic_id}.{new_id}" if dest_epic_id is not None else str(new_id),
        "file": t["file"],
        "plan": t.get("plan"),
        "next_id": {old.name: floor},
        "rewritten": rewritten,
    }


REF_HELP = """<ref> is `<epic id>.<entry id>`, an entry id inside an epic folder (one with a letter, from any
folder), a tracker id, a file name, or an unbroken phrase from the title that matches one ticket."""

DIR_HELP = """<dir> is an epic folder, a backlog folder, or an initiative folder (all its epics): a path, or a
folder's name under the store, the active initiative, or its `tickets/` folder. A `tickets/` folder is
read as the folder that holds it. Left out, it is the active initiative."""

BACKLOG_HELP = "With no <dir>, a ticket the initiative does not hold is looked for in the backlog folder."

PARENT_HELP = """A parent initiative, whose `tickets.toml` lists `[[initiative]]` tables, works only with status
and next; the other commands want one of its initiatives."""

HELP = {
    "next": f"""Tickets grouped by what can happen next, in build order.

{DIR_HELP} With no <dir>, `backlog` holds the same view of the backlog folder, each row's `ref`
its file name.

Output: `ready_to_refine` (needs full criteria first), `ready_to_start`, `in_progress`, and `blocked`; a
`blocked` row has `waiting_on`, its unmet prerequisites, `blocked_reason`, or `unknown`, a question to
settle before it starts. A prerequisite is met when it is done or in review; an epic's own gate
(`gated_by`) waits for that epic to be done. `unpinned_after`, `undeclared_after`, `order_conflict`, and
`problems` report a tree that needs fixing. Every row carries `ref`, which find resolves, `state`, and
`risk`; a row has `drift` when the leaf file's `after` or `hitl` differs from the entry's, and `plan_checkpoint` or
`done_checkpoint` when the entry sets it.

On a parent initiative: `initiatives`, as status gives them, `order_conflict`, and `ready`, the
initiatives waiting on none and not done or dropped.""",
    "status": f"""Every ticket in build order.

{DIR_HELP} With no <dir>, `backlog` holds the same view of the backlog folder, each row's `ref`
its file name.

Output: `tickets` (each with `status`, `tracker_status`, `state`, `blocks`, and `drift` when the leaf file's
`after` or `hitl` differs from the entry's, with both values), `counts` by state, `next_id` (the id a new
ticket in the folder takes: one past the highest number used, or `next_id` at the top of the folder's
`tickets.toml` when that is higher; on an initiative, in each `epics` row), `longest_remaining_chain`, and
on an initiative `epics`: one row per epic its `tickets.toml` lists, in build order, then any epic folder
it does not list, each with its declared `after`, and `refined`, false only when the epic file says
`refined: false`. A listed epic with no folder yet has `folder` null and no `status`, `refined`,
`gated_by`, `blocks`, or `next_id`.

On a parent initiative: `initiatives`, one row per initiative its `tickets.toml` lists, in build order,
each with `id`, `slug`, `title`, `after` (as `[{{initiative, needs}}]`), `folder` (null until the folder
exists beside the parent), and `waiting_on`, the initiatives it is after whose file is not `status:
done`; a row with a folder also has that file's `status` and `counts`, its tickets by state.
`order_conflict` lists an initiative after one later in the build order.""",
    "find": f"""The one ticket a reference names.

{DIR_HELP}
{PARENT_HELP}
{BACKLOG_HELP}
{REF_HELP}

Output: the ticket's row; its entry's `description`, `verify`, `references`, and `notes`, all empty once
the entry is pulled, when `story_file` holds them; `unknown`; its `folder`; and the absolute paths
`epic_file` (the file of the container it is under, null in a backlog folder), `story_file` (null until
the entry is pulled), and `plan` (where its plan is or goes; it may not exist yet).""",
    "pull": f"""Write an entry's leaf file from its entry.

<dir> is the epic folder and <id> the entry's id. The file is `<type>-<slug of the title>.md` in the
epic's `tickets/` folder: `after` and `hitl` always, other fields only when the entry sets them, no status.
{PARENT_HELP}""",
    "mark": f"""Set a ticket's status in its plan; never in its leaf file. Repo store only.

{DIR_HELP}
{PARENT_HELP}
{BACKLOG_HELP}
{REF_HELP}

A ticket with no plan gets one holding only frontmatter. `--blocked` sets `blocked_at` (today) and
`blocked_reason`; without it both are cleared.""",
    "mirror": f"""Write what a tracker returned into leaf files. Tracker stores only.

{DIR_HELP}
{PARENT_HELP}
{BACKLOG_HELP}

Stdin is a JSON array, one object per ticket: `ref` (or `tracker_id` alone, which matches only a ticket
that already carries that id) and any of `tracker_id`, `remote`, `tracker_status` ({", ".join(STATES)}),
`assignee`, and `after` (a list: a number is a sibling's id, a string any other prerequisite form, a
tracker id included). Only the keys given are written, an empty string removes the line, and `status` is
never written. An entry with no leaf file is pulled first. A published container, named by its folder or
its tracker id, is listed under `containers` with its file's `status` and the `tracker_status` given, and
nothing is written to it. A ticket the tree does not hold is listed under `unmatched` and the rest are
written; values that would leave the tree unreadable write nothing, and the error then still lists
`unmatched`.""",
    "move": f"""Move an entry to another folder, with its leaf file and plan.

<from> and <to> are folders as <dir> is for the other commands; <ref> names an entry in <from>.
{PARENT_HELP}
{REF_HELP}

The entry takes <to>'s `next_id` as its id and goes last in <to>'s `tickets.toml`; reorder it by hand when
build order needs it. <from> keeps `next_id` atop its `tickets.toml` so the old id never returns. The leaf
file and plan move with it, the file's `id` and `parent` and the plan's `ticket` set. Every `after` naming
the entry is rewritten (a former sibling now says `<epic id>.<id>`) and its own `after` follows; `covers`
is untouched. When any of it fails, nothing is written.

Output: `from`, `to`, `old_id`, `id`, `ref` (as find on the initiative resolves it), `file`, `plan`,
`next_id` (what <from> now keeps), and `rewritten`, one `where` and `after` per line rewritten.""",
}


def main() -> int:
    raw = argparse.RawDescriptionHelpFormatter
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=raw)
    parser.add_argument(
        "--project-root",
        help="project holding _bmad/; default: walk up from the ticket folder, or the working directory with no folder",
    )
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser(
        "next",
        help="tickets whose prerequisites are done or in review, by state",
        description=HELP["next"],
        formatter_class=raw,
    )
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.add_argument("--synced", action="store_true", help="tracker status was mirrored just now")
    p.set_defaults(func=cmd_next)
    p = sub.add_parser("status", help="every ticket resolved", description=HELP["status"], formatter_class=raw)
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.set_defaults(func=cmd_status)
    p = sub.add_parser("find", help="the one ticket a reference names", description=HELP["find"], formatter_class=raw)
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.add_argument("ref")
    p.set_defaults(func=cmd_find)
    p = sub.add_parser("pull", help="write an entry's leaf file", description=HELP["pull"], formatter_class=raw)
    p.add_argument("dir")
    p.add_argument("id")
    p.set_defaults(func=cmd_pull)
    p = sub.add_parser(
        "mark",
        help="set a ticket's status in its plan (repo store only)",
        description=HELP["mark"],
        formatter_class=raw,
    )
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.add_argument("ref")
    p.add_argument("status", choices=STATUSES)
    p.add_argument("--assignee")
    p.add_argument(
        "--blocked", metavar="REASON", help="set blocked_at to today and blocked_reason; else both are cleared"
    )
    p.set_defaults(func=cmd_mark)
    p = sub.add_parser(
        "mirror",
        help="write what a tracker returned into leaf files (tracker stores only)",
        description=HELP["mirror"],
        formatter_class=raw,
    )
    p.add_argument("dir", nargs="?", help="default: the active initiative")
    p.set_defaults(func=cmd_mirror)
    p = sub.add_parser(
        "move",
        help="move an entry, its leaf file, and its plan to another folder",
        description=HELP["move"],
        formatter_class=raw,
    )
    p.add_argument("src", metavar="from", help="the folder holding the entry")
    p.add_argument("ref")
    p.add_argument("to", help="the folder it goes to")
    p.set_defaults(func=cmd_move)
    args = parser.parse_args()
    try:
        print(json.dumps(args.func(args), ensure_ascii=False, default=str))
        return 0
    except StoreRefusal as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        return 2
    except (TicketError, OSError, ValueError) as e:
        print(json.dumps({"error": str(e), **getattr(e, "data", {})}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    raise SystemExit(main())
