#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = []
# ///
"""Deterministic read/derive operations over a bmad-ticket tree (schema 1).

Everything here is derived by scan — nothing is stored. Verbs:

  next-id   next free ticket id        uv run ticket_tree.py next-id --root R [--key KEY]
  index     regenerate index.md        uv run ticket_tree.py index --root R [--key KEY]
  validate  schema gate over the tree  uv run ticket_tree.py validate --root R [--path FILE]
  list      id/type/title/status/path  uv run ticket_tree.py list --root R
  frontier  workable leaves            uv run ticket_tree.py frontier --root R
  board     status rollup (epics too)  uv run ticket_tree.py board --root R
  coverage  covers: vs an inventory    uv run ticket_tree.py coverage --root R [--require "CAP-1,FR-2"] [--proposed "CAP-3"]

Output is one JSON object per call. Stdlib only. Dual-homed: canonical at
src/scripts/ (installed to {project-root}/_bmad/scripts/ for any skill or
agent to call); bmad-ticket bundles an identical copy and uses it locally.
Keep both in sync.
"""

import argparse
import json
import os
import re
import sys
import tempfile
from pathlib import Path

LEAF_TYPES = ("story", "bug", "task", "spike")
DONE = "done"
DROPPED = "dropped"
KNOWN_STATES = {"backlog", "in-progress", "review", "done", "dropped"}
ID_RE = re.compile(r"^[A-Za-z][A-Za-z0-9]*-\d+$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def fail(msg):
    print(json.dumps({"ok": False, "error": msg}))
    sys.exit(1)


def parse_scalar(raw):
    raw = raw.strip()
    if raw.startswith('"') and raw.endswith('"') and len(raw) >= 2:
        return raw[1:-1].replace('\\"', '"')
    if raw.startswith("'") and raw.endswith("'") and len(raw) >= 2:
        return raw[1:-1]
    if raw == "true":
        return True
    if raw == "false":
        return False
    if re.fullmatch(r"-?\d+", raw):
        return int(raw)
    return raw


def parse_frontmatter(text):
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    fm = {}
    i = 1
    while i < len(lines):
        if lines[i].strip() == "---":
            return fm
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):(.*)$", lines[i])
        if m:
            key, rest = m.group(1), m.group(2).strip()
            if rest == "":
                items = []
                j = i + 1
                while j < len(lines) and re.match(r"^\s+-\s+", lines[j]):
                    items.append(parse_scalar(re.sub(r"^\s+-\s+", "", lines[j])))
                    j += 1
                if j > i + 1:
                    fm[key] = items
                    i = j
                    continue
                fm[key] = ""
            elif rest.startswith("["):
                inner = rest[1:-1].strip() if rest.endswith("]") else rest[1:].strip()
                fm[key] = [parse_scalar(p) for p in inner.split(",")] if inner else []
            else:
                fm[key] = parse_scalar(rest)
        i += 1
    return None


def scan(root):
    """Return (tickets, by_id). Each ticket: frontmatter + _path (Path) + _rel (str)."""
    tickets = []
    by_id = {}
    for p in sorted(root.rglob("*.md")):
        if p.name == "index.md":
            continue
        try:
            fm = parse_frontmatter(p.read_text(encoding="utf-8"))
        except (OSError, UnicodeDecodeError):
            continue
        if not fm or "id" not in fm or "type" not in fm:
            continue
        fm["_path"] = p
        fm["_rel"] = p.relative_to(root).as_posix()
        tickets.append(fm)
        by_id[str(fm["id"])] = fm
    return tickets, by_id


def children_of(epic, tickets):
    """Direct children: leaves in the epic's folder + sub-epics one folder down."""
    edir = epic["_path"].parent
    kids = []
    for t in tickets:
        if t is epic:
            continue
        if t["type"] in LEAF_TYPES and t["_path"].parent == edir:
            kids.append(t)
        elif t["type"] == "epic" and t["_path"].parent.parent == edir:
            kids.append(t)
    return kids


def epic_state(epic, tickets, _seen=None):
    if epic.get("status") == DROPPED:
        return DROPPED
    _seen = _seen or set()
    if str(epic["id"]) in _seen:
        return "in-progress"  # cycle guard; graph lint owns real diagnosis
    _seen.add(str(epic["id"]))
    kids = children_of(epic, tickets)
    if not kids:
        return "unsliced"
    states = [epic_state(k, tickets, _seen) if k["type"] == "epic" else k.get("status")
              for k in kids]
    active = [s for s in states if s not in (DONE, DROPPED)]
    if not active:
        return DONE
    started = any(s in (DONE, "in-progress", "review") for s in states)
    if not started and all(s in ("backlog", "unsliced") for s in active):
        return "backlog"
    return "in-progress"


def dep_done(dep_id, by_id, tickets):
    t = by_id.get(str(dep_id))
    if t is None:
        return False, "not found"
    if t["type"] == "epic":
        state = epic_state(t, tickets)
        return state == DONE, state
    return t.get("status") == DONE, t.get("status")


def read_index_key(root):
    idx = root / "index.md"
    if not idx.is_file():
        return None
    fm = parse_frontmatter(idx.read_text(encoding="utf-8"))
    return None if not fm else fm.get("key")


def resolve_key(root, args_key):
    key = args_key or read_index_key(root)
    if not key:
        fail("no project key: pass --key or create index.md with `key:` in frontmatter")
    return str(key)


def atomic_write(path, content):
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=".idx-", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="") as f:
            f.write(content)
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def id_num(ticket_id):
    m = re.search(r"-(\d+)$", str(ticket_id))
    return int(m.group(1)) if m else 0


def cmd_next_id(root, args):
    key = resolve_key(root, args.key)
    tickets, _ = scan(root)
    nums = [id_num(t["id"]) for t in tickets
            if re.fullmatch(re.escape(key) + r"-\d+", str(t["id"]))]
    nxt = (max(nums) + 1) if nums else 1
    print(json.dumps({"ok": True, "key": key, "next": nxt, "id": f"{key}-{nxt}"}))


def cmd_index(root, args):
    key = resolve_key(root, args.key)
    tickets, _ = scan(root)

    def entry_lines(t, depth):
        pad = "  " * depth
        desc = t.get("description")
        tail = f" - {desc}" if desc else ""
        lines = [f"{pad}* [{t.get('title', t['id'])}]({t['_rel']}){tail}"]
        if t["type"] == "epic":
            for k in sorted(children_of(t, tickets), key=lambda x: id_num(x["id"])):
                lines.extend(entry_lines(k, depth + 1))
        return lines

    top_epics = [t for t in tickets if t["type"] == "epic"
                 and not any(o["type"] == "epic" and o is not t
                             and t["_path"].parent.parent == o["_path"].parent
                             for o in tickets)]
    bin_leaves = [t for t in tickets if t["type"] in LEAF_TYPES and t["_path"].parent == root]

    body = ["---", f"key: {key}", "generated: true", "---", "", "# Ticket Index", ""]
    for e in sorted(top_epics, key=lambda x: id_num(x["id"])):
        body.extend(entry_lines(e, 0))
    for lf in sorted(bin_leaves, key=lambda x: id_num(x["id"])):
        body.extend(entry_lines(lf, 0))
    body.append("")
    atomic_write(root / "index.md", "\n".join(body))
    print(json.dumps({"ok": True, "file": str(root / "index.md"),
                      "entries": len(tickets)}))


def cmd_frontier(root, args):
    tickets, by_id = scan(root)
    out = []
    for t in tickets:
        if t["type"] not in LEAF_TYPES or t.get("status") != "backlog":
            continue
        unmet = []
        for dep in t.get("depends_on") or []:
            ok, state = dep_done(dep, by_id, tickets)
            if not ok:
                unmet.append({"id": str(dep), "state": state})
        if not unmet:
            out.append({"id": str(t["id"]), "type": t["type"], "title": t.get("title"),
                        "risk": t.get("risk"), "hitl": t.get("hitl"), "path": t["_rel"]})
    print(json.dumps({"ok": True, "frontier": sorted(out, key=lambda x: id_num(x["id"]))}))


def cmd_board(root, args):
    tickets, by_id = scan(root)
    epics, blocked = [], []
    totals = {}
    for t in tickets:
        if t["type"] == "epic":
            kids = [k for k in children_of(t, tickets) if k["type"] in LEAF_TYPES]
            counts = {}
            for k in kids:
                counts[k.get("status", "?")] = counts.get(k.get("status", "?"), 0) + 1
            epics.append({"id": str(t["id"]), "title": t.get("title"),
                          "state": epic_state(t, tickets), "counts": counts})
        else:
            totals[t.get("status", "?")] = totals.get(t.get("status", "?"), 0) + 1
            if t.get("status") == "backlog":
                unmet = [str(d) for d in (t.get("depends_on") or [])
                         if not dep_done(d, by_id, tickets)[0]]
                if unmet:
                    blocked.append({"id": str(t["id"]), "waiting_on": unmet})
    bin_leaves = [{"id": str(t["id"]), "title": t.get("title"), "status": t.get("status")}
                  for t in tickets if t["type"] in LEAF_TYPES and t["_path"].parent == root]
    print(json.dumps({"ok": True,
                      "epics": sorted(epics, key=lambda x: id_num(x["id"])),
                      "bin": sorted(bin_leaves, key=lambda x: id_num(x["id"])),
                      "leaf_totals": totals, "blocked": blocked}))


def cmd_coverage(root, args):
    tickets, _ = scan(root)
    covered = {}
    for t in tickets:
        for cid in t.get("covers") or []:
            covered.setdefault(str(cid), []).append(str(t["id"]))
    if getattr(args, "proposed", None):
        for cid in (p.strip() for p in args.proposed.split(",") if p.strip()):
            covered.setdefault(cid, []).append("(proposed)")
    result = {"ok": True, "covered": covered}
    if args.require:
        required = [r.strip() for r in args.require.split(",") if r.strip()]
        result["uncovered"] = [r for r in required if r not in covered]
    print(json.dumps(result))


def cmd_list(root, args):
    tickets, _ = scan(root)
    rows = [{"id": str(t["id"]), "type": t["type"], "title": t.get("title"),
             "status": t.get("status"), "path": t["_rel"]}
            for t in sorted(tickets, key=lambda x: id_num(x["id"]))]
    print(json.dumps({"ok": True, "tickets": rows}))


def _placeholderish(v):
    return isinstance(v, str) and ("[" in v or "]" in v or "YYYY" in v)


def cmd_validate(root, args):
    tickets, by_id = scan(root)
    errors = []

    def err(t, msg):
        errors.append({"file": t["_rel"], "error": msg})

    only = Path(args.path).resolve() if getattr(args, "path", None) else None
    if only and not any(t["_path"].resolve() == only for t in tickets):
        errors.append({"file": str(only), "error":
                       "not a parseable ticket — frontmatter with id and type required"})

    for t in tickets:
        if only and t["_path"].resolve() != only:
            continue
        tid = t.get("id")
        if not isinstance(tid, str) or not ID_RE.match(tid):
            err(t, f"id is missing, malformed, or an unresolved placeholder: {tid!r}")
            tid = None
        if t["type"] == "epic":
            if t["_path"].name != "ticket.md":
                err(t, "epic envelope must be named ticket.md")
        elif tid and not t["_path"].name.startswith(tid + "-"):
            err(t, f"leaf filename must start with '{tid}-'")
        if not isinstance(t.get("schema"), int):
            err(t, "schema must be an integer")
        title = t.get("title")
        if not isinstance(title, str) or not title.strip() or _placeholderish(title):
            err(t, f"title is missing or an unresolved placeholder: {title!r}")
        created = t.get("created")
        if not (isinstance(created, str) and DATE_RE.match(created)):
            err(t, f"created must be YYYY-MM-DD: {created!r}")
        for fname in ("depends_on", "covers"):
            val = t.get(fname)
            if not isinstance(val, list):
                err(t, f"{fname} must be a list")
                continue
            for entry in val:
                if _placeholderish(str(entry)):
                    err(t, f"{fname} entry is an unresolved placeholder: {entry!r}")
                elif fname == "depends_on":
                    if not ID_RE.match(str(entry)):
                        err(t, f"depends_on entry '{entry}' is not a KEY-n id")
                    elif str(entry) == tid:
                        err(t, "ticket depends on itself")
                    elif str(entry) not in by_id:
                        err(t, f"depends_on ref '{entry}' not found in the tree")
        risk = t.get("risk")
        if not (isinstance(risk, int) and not isinstance(risk, bool) and 1 <= risk <= 5):
            err(t, f"risk must be an integer 1-5: {risk!r}")
        if _placeholderish(str(t.get("discovered_from", ""))):
            err(t, f"discovered_from is an unresolved placeholder: {t.get('discovered_from')!r}")
        if t["type"] == "epic":
            desc = t.get("description")
            if not isinstance(desc, str) or not desc.strip() or _placeholderish(desc):
                err(t, f"epic description is missing or a placeholder: {desc!r}")
            if t.get("status") not in (None, DROPPED):
                err(t, f"epics store no lifecycle — only 'dropped' is storable, got {t.get('status')!r}")
            for banned in ("hitl", "severity"):
                if banned in t:
                    err(t, f"{banned} is not an epic field")
        else:
            if t.get("status") not in KNOWN_STATES:
                err(t, f"status must be one of {sorted(KNOWN_STATES)}: {t.get('status')!r}")
            if not isinstance(t.get("hitl"), bool):
                err(t, f"hitl must be true or false: {t.get('hitl')!r}")
            if t["type"] == "bug":
                sev = t.get("severity")
                if not (isinstance(sev, int) and not isinstance(sev, bool) and 1 <= sev <= 5):
                    err(t, f"bug severity must be an integer 1-5: {sev!r}")
            elif "severity" in t:
                err(t, "severity is a bug-only field")

    # Tree-wide cycle check over valid ids.
    graph = {str(t["id"]): [str(d) for d in (t.get("depends_on") or [])]
             for t in tickets if isinstance(t.get("id"), str)}
    seen_in_cycle = set()
    for start in graph:
        if start in seen_in_cycle:
            continue
        path, onpath = [start], {start}
        stack = [(start, iter(graph.get(start, [])))]
        while stack:
            node, it = stack[-1]
            step = next(it, None)
            if step is None:
                stack.pop()
                path.pop()
                onpath.discard(node)
                continue
            if step == start:
                cyc = path + [start]
                errors.append({"file": "(tree)", "error":
                               "dependency cycle: " + " -> ".join(cyc)})
                seen_in_cycle.update(cyc)
                stack = []
                break
            if step in onpath or step not in graph:
                continue
            stack.append((step, iter(graph.get(step, []))))
            path.append(step)
            onpath.add(step)

    out = {"ok": not errors, "checked": len(tickets), "errors": errors}
    print(json.dumps(out))
    if errors:
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    sub = ap.add_subparsers(dest="verb", required=True)
    for verb in ("next-id", "index", "validate", "list", "frontier", "board", "coverage"):
        p = sub.add_parser(verb)
        p.add_argument("--root", required=True, help="ticket tree root")
        if verb in ("next-id", "index"):
            p.add_argument("--key", help="project key (else read from index.md)")
        if verb == "coverage":
            p.add_argument("--require", help="inventory ids, comma-separated")
            p.add_argument("--proposed", help="ids a not-yet-written proposal covers, comma-separated")
        if verb == "validate":
            p.add_argument("--path", help="validate one file instead of the whole tree")
    args = ap.parse_args()
    root = Path(args.root)
    if not root.is_dir():
        fail(f"no such directory: {args.root}")
    {"next-id": cmd_next_id, "index": cmd_index, "validate": cmd_validate,
     "list": cmd_list, "frontier": cmd_frontier, "board": cmd_board,
     "coverage": cmd_coverage}[args.verb](root, args)


if __name__ == "__main__":
    main()
