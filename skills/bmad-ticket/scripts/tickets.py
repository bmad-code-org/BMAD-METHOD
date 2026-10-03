#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""tickets — read a ticket tree and answer what is next.

A container folder holds its ticket file, `tickets.toml`, flat leaf files named `<type>-<slug>.md`,
and the builds' plan files. An epic's `tickets.toml` lists its planned leaves as `[[entry]]` tables
(`id`, `type`, `title`, `after`, and whatever else the plan records); an initiative's lists its
epics as `[[epic]]` tables (`id`, `slug`, `after = [{epic, needs}]`). Tables are in build order.
`id` names an entry for good and is never reused: a number, or letters and digits such as `6a`, and
`6` and `"6"` are one id. A leaf file carries it in frontmatter, which is how the file joins its
entry. An entry needs no leaf file to start. A ticket needs refining before it starts when it is a
bug, its entry says `refine = true`, or it has no entry. A leaf file's frontmatter adds
`tracker_status` and `refined`; its `after` and `hitl` replace the entry's, absent reading as empty,
and a difference from the entry is `drift` on the row, which gives the file's and the entry's
value of each field that differs. An entry's `unknown` is a question to settle before the ticket starts;
once the entry is pulled it is the `Unknown:` lines of the file's Notes. A row carries it, and next holds
the ticket under `blocked` until it is gone. A row also carries `plan_checkpoint` and `done_checkpoint`
when the entry sets them: the orchestrator of an unattended run reads them, and no build does. `risk`
(low, medium, high) is the ticket's proposed risk, the leaf file's once it is pulled; the build settles it
in its plan.

A plan is any other `.md` whose frontmatter has `ticket` and whose `type` is not a leaf type. A
`ticket` that is an id joins the entry with that id in the plan's folder; any other string joins the
leaf file with that stem (a backlog leaf). A plan is never a row of its own. It holds the ticket's
`status`, `assignee`, `blocked_at`, and `blocked_reason`; a leaf file's own fields are read only when
the ticket has no plan, and a plan with no `assignee` key leaves the leaf file's. A plan whose `ticket`
names nothing is skipped, and one whose `status` is unknown blocks its ticket; next and status list both
under `problems`.

`status` is draft, ready-for-dev, in-progress, in-review, or built from the builds (built is their
last: the build finished and nobody has called it done), blocked from build-auto, done from the
user or an orchestrator through mark, or dropped; absent means no build has started.
On a tracker store `tracker_status` mirrors the tracker's word (backlog, in-progress, review, done,
dropped). A ticket's `state` is `planned` with no file and no plan, else `tracker_status`, else
derived from `status`: absent, draft, ready-for-dev -> backlog; in-progress, blocked -> in-progress;
in-review, built -> review; done; dropped.

`after` lists real prerequisites: a sibling's id (a number bare, since a quoted number is a tracker
id; an id with a letter quoted), or a quoted string that is `<epic id>.<entry id>` for an entry in
another epic of the same initiative, `epic-<slug>` for that whole epic, a sibling's file name, or a
tracker id. An epic file's own `after` names epics and holds every ticket under it; rows show it as `gated_by`. A dropped prerequisite still blocks.

On an initiative, or an epic it lists, next and status report `unpinned_after` (a declared epic
`after` no entry of the waiting epic pins), `undeclared_after` (an entry's `after` into an epic its
own epic does not declare), and `order_conflict` (an epic that waits on one later in build order).
status's `epics` rows carry the declared `after` with its `needs`, and the epic file's own gate as
`gated_by`.

  next   [<dir>]                 tickets whose prerequisites are done or in review, grouped by state, in
                                 build order; an epic's own `after` waits for that epic to be done. A
                                 `blocked` row's `waiting_on` lists its unmet prerequisites
  status [<dir>]                 every ticket in build order, what it blocks, counts by state, longest chain,
                                 `next_id` (the id a new ticket in the folder takes: one past the highest
                                 number used, or `next_id` at the top of its `tickets.toml` when that is
                                 higher)
  find   [<dir>] <ref>           the one ticket a reference names, with its entry's text fields (empty once
                                 the entry is pulled: the file holds them) and the absolute paths
                                 `epic_file` (its container's file), `story_file` (null until pulled), and
                                 `plan` (where its plan is or goes)
  pull   <dir> <id>              write entry id's leaf file: `after` and `hitl` always, other fields only
                                 when the entry sets them; no status
  mark   [<dir>] <ref> <status> [--assignee <who>] [--blocked <reason>]
                                 set a ticket's status in its plan, creating a frontmatter-only plan when
                                 there is none; --blocked sets blocked_at and blocked_reason, else both are
                                 cleared (repo store only)
  mirror [<dir>]                 write what a tracker returned into leaf files, pulling a file when the
                                 entry has none. Stdin is a JSON array, one object per ticket: `ref` (or
                                 `tracker_id` alone, for a ticket that already carries it) and any of
                                 `tracker_id`, `remote`, `tracker_status`, `assignee`, `after`. Only the
                                 keys given are written, and never `status` (tracker stores only)

`<dir>` is an epic folder, a backlog folder, or an initiative folder (all its epics). `<ref>` is
`<epic id>.<entry id>`, an entry id inside an epic folder (one with a letter, from any folder), a
tracker id, a file name, or an unbroken phrase from the title that matches one ticket. Each row of
next, status, and find carries `ref`, a reference find resolves in the folder the command ran on.
`--project-root` names the project holding `_bmad/` when the tickets live outside it. A relative
`<dir>` that is not a folder under the working directory is looked up under `{output_folder}`, then
the active initiative, then the project root, so an epic's folder name alone finds it.

With no `<dir>`, next, status, find, mark, and mirror run on the active initiative,
`{output_folder}/{active_initiative}`. next and status then also report `backlog`, the same view of
`{output_folder}/backlog` when that folder exists, each row's `ref` its file name; find, mark, and mirror
look there for a ticket the initiative does not hold.
The project root is `--project-root`, else the first folder at or above the working directory that
holds `_bmad/`. `active_initiative` and `output_folder` (`[core]`) come from the
BMad config, merged by the project's `_bmad/scripts/config_utils.py`. `{project-root}` is
substituted, and a relative path is taken from the project root.

Output is one JSON object on stdout. Exit 0 on success, 1 on a malformed tree, 2 when
the store forbids the operation.
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


def load_breakdown(folder: Path) -> dict:
    path = folder / BREAKDOWN
    if not path.is_file():
        return {}
    where = f"{folder.name}/{BREAKDOWN}"
    try:
        data = tomllib.loads(read_text(path))
    except tomllib.TOMLDecodeError as e:
        raise TicketError(f"{where}: {e}") from e
    floor = data.get("next_id", 0)
    if isinstance(floor, bool) or not isinstance(floor, int):
        raise TicketError(f"{where}: `next_id` must be a whole number")
    for table in ("entry", "epic"):
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
    where = folder.name
    rows = {}
    for e in load_breakdown(folder).get("entry", []):
        n, kind = e["id"], e.get("type")
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
            "raw_after": _list(e.get("after"), f"{where}/{BREAKDOWN} entry {n}"),
            "entry_after": None,
        }
    unlisted, stray, plans = {}, [], []
    seen = {}
    for path in sorted(folder.glob("*.md")):
        text = read_text(path)
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
        row["raw_after"] = _list(fm.get("after", []), f"{where}/{path.name}")
    out = list(rows.values()) + [unlisted[n] for n in sorted(unlisted, key=lambda n: (isinstance(n, str), n))] + stray
    join_plans(out, plans, where, problems)
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

    for t in tickets:
        where = f"{t['epic']}/{t['file']}" if t["file"] else f"{t['epic']}/{BREAKDOWN} entry {t['id']}"
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
                    f"{tree['initiative'].name}/{BREAKDOWN}: {e['slug']} is after {a.get('epic')!r}, which is no epic listed"
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
    folder = Path(args.dir).resolve()
    root = None if folder.is_dir() or Path(args.dir).is_absolute() else project_root_for(args, Path.cwd())
    if root is not None:
        try:
            bases = [tickets_root(root), root]
        except TicketError:  # no BMad config to name the store: the project root alone
            bases = [root]
        else:
            try:
                bases.insert(1, active_initiative(root))
            except TicketError:  # none set: the store and the project root
                pass
        for base in bases:
            if (base / args.dir).is_dir():
                return (base / args.dir).resolve()
    if not folder.is_dir():
        raise TicketError(f"not a folder: {folder}")
    return folder


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


def cmd_next(args) -> dict:
    folder = _folder(args)
    store = store_name(project_root_for(args, folder))
    if store != "repo" and not args.synced:
        raise StoreRefusal(f"store is {store}: sync ticket status from the tracker first, then rerun with --synced")
    return with_backlog(args, {"store": store, **next_view(folder)}, next_view)


def next_id(tree: dict, folder: str) -> int:
    """The id a new ticket in the folder takes: one past the highest number its entries and leaf files use, or
    `next_id` at the top of its `tickets.toml` when that is higher."""
    # `6a` uses up 6: a lettered id is a split of that number.
    used = [re.match(r"\d+", str(t["id"])) for t in tree["tickets"] if t["epic"] == folder]
    # An entry moved to another folder took its id along; the counter it left keeps that id from coming back.
    floor = load_breakdown(tree["folders"][folder]).get("next_id", 0)
    return max(max((int(m.group()) for m in used if m), default=0) + 1, floor)


def status_view(folder: Path) -> dict:
    tree = load_tree(folder)
    declared = declared_after(tree)
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
        "tickets": [public(t, tree, blocks) for t in tickets],
        "counts": {"total": len(tickets), **counts},
        "longest_remaining_chain": longest_remaining_chain(tree),
        "unpinned_after": unpinned_after(tree, declared),
        **cross_epic_after(tree, declared),
        **({"problems": tree["problems"]} if tree["problems"] else {}),
    }
    if tree["scope"] is None:
        out["epics"] = [
            {
                "slug": slug,
                "id": tree["epic_ids"].get(slug),
                "status": c["status"],
                "after": declared.get(slug, []),
                "gated_by": c["after"],
                "blocks": [ref(b, None, tree) for b in blocks.get(slug, [])],
                "next_id": next_id(tree, slug),
            }
            for slug, c in tree["containers"].items()
        ]
    else:
        out["next_id"] = next_id(tree, tree["scope"])
    return out


def cmd_status(args) -> dict:
    folder = _folder(args)
    store = store_name(project_root_for(args, folder))
    return with_backlog(args, {"store": store, **status_view(folder)}, status_view)


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
    folder = tree["folders"][t["epic"]]
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
        "story_file": str(home / t["file"]) if t["file"] else None,
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
        raise TicketError(f"{folder.name}/{BREAKDOWN} has no entry {args.id}")
    if t["file"]:
        raise TicketError(f"entry {args.id} is already pulled: {t['file']}")
    path = write_leaf(t, tree, project_root_for(args, folder))
    return {"file": path.name, "refine": t["refine"]}


def write_leaf(t: dict, tree: dict, root: Path | None) -> Path:
    """Write an entry's leaf file from the entry and name it on the row."""
    folder = tree["folders"][t["epic"]]
    path = folder / f"{leaf_stem(t, tree)}.md"
    if path.exists():
        raise TicketError(f"{path.name} exists already; change entry {t['id']}'s title")
    after = [str(ref(b, t["epic"], tree)) for b in t["after"]]
    epic_file = folder / f"{folder.name}.md"
    try:
        parent = Path(os.path.relpath(epic_file, root)).as_posix() if root else epic_file.as_posix()
    except ValueError:  # another drive on Windows
        parent = epic_file.as_posix()
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
    work, unmatched, seen = [], [], set()
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
        hit = miss = None
        for tree in trees:
            try:
                # A tracker id alone never falls back to an entry id or a title that happens to match it.
                t = resolve_ticket(tree, str(name)) if "ref" in item else by_tracker_id(tree, str(name))
            except NoMatch as e:
                miss = miss or e
                continue
            hit = (t, tree)
            break
        if hit is None:
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
                path = tree["folders"][t["epic"]] / t["file"]
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
    return {"folder": folder.name, "store": store, "mirrored": mirrored, "unmatched": unmatched}


REF_HELP = """<ref> is `<epic id>.<entry id>`, an entry id inside an epic folder (one with a letter, from any
folder), a tracker id, a file name, or an unbroken phrase from the title that matches one ticket."""

DIR_HELP = """<dir> is an epic folder, a backlog folder, or an initiative folder (all its epics): a path, or a
folder's name under the store or the active initiative. Left out, it is the active initiative."""

BACKLOG_HELP = "With no <dir>, a ticket the initiative does not hold is looked for in the backlog folder."

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
`done_checkpoint` when the entry sets it.""",
    "status": f"""Every ticket in build order.

{DIR_HELP} With no <dir>, `backlog` holds the same view of the backlog folder, each row's `ref`
its file name.

Output: `tickets` (each with `status`, `tracker_status`, `state`, `blocks`, and `drift` when the leaf file's
`after` or `hitl` differs from the entry's, with both values), `counts` by state, `next_id` (the id a new
ticket in the folder takes: one past the highest number used, or `next_id` at the top of the folder's
`tickets.toml` when that is higher; on an initiative, in each `epics` row), `longest_remaining_chain`, and
on an initiative `epics` with each epic's declared `after`.""",
    "find": f"""The one ticket a reference names.

{DIR_HELP}
{BACKLOG_HELP}
{REF_HELP}

Output: the ticket's row; its entry's `description`, `verify`, `references`, and `notes`, all empty once
the entry is pulled, when `story_file` holds them; `unknown`; its `folder`; and the absolute paths
`epic_file` (the file of the container it is under, null in a backlog folder), `story_file` (null until
the entry is pulled), and `plan` (where its plan is or goes; it may not exist yet).""",
    "pull": """Write an entry's leaf file from its entry.

<dir> is the epic folder and <id> the entry's id. The file is `<type>-<slug of the title>.md`: `after` and
`hitl` always, other fields only when the entry sets them, no status.""",
    "mark": f"""Set a ticket's status in its plan; never in its leaf file. Repo store only.

{DIR_HELP}
{BACKLOG_HELP}
{REF_HELP}

A ticket with no plan gets one holding only frontmatter. `--blocked` sets `blocked_at` (today) and
`blocked_reason`; without it both are cleared.""",
    "mirror": f"""Write what a tracker returned into leaf files. Tracker stores only.

{DIR_HELP}
{BACKLOG_HELP}

Stdin is a JSON array, one object per ticket: `ref` (or `tracker_id` alone, which matches only a ticket
that already carries that id) and any of `tracker_id`, `remote`, `tracker_status` ({", ".join(STATES)}),
`assignee`, and `after` (a list: a number is a sibling's id, a string any other prerequisite form, a
tracker id included). Only the keys given are written, an empty string removes the line, and `status` is
never written. An entry with no leaf file is pulled first. A ticket the tree does not hold is listed under
`unmatched` and the rest are written; values that would leave the tree unreadable write nothing, and the
error then still lists `unmatched`.""",
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
