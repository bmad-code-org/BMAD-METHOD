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
  graph     dependency graph + lanes   uv run ticket_tree.py graph --root R [--mermaid]
  coverage  covers: vs an inventory    uv run ticket_tree.py coverage --root R [--require "CAP-1,FR-2"] [--proposed "CAP-3"]
  render    single epics-and-stories   uv run ticket_tree.py render --root R --out FILE
            markdown view (generated; the tree stays the source of truth)
  archive   move a done epic's leaves  uv run ticket_tree.py archive --root R --epic KEY-n [--purge] [--date YYYY-MM-DD]
            to .archive/<date>-<slug>/ as the dated record (--purge deletes
            instead, for stories whose record lives elsewhere, e.g. Jira)

Output is one JSON object per call. Stdlib only. Dual-homed: canonical at
src/scripts/ (installed to {project-root}/_bmad/scripts/ for any skill or
agent to call); bmad-ticket bundles an identical copy and uses it locally.
Keep both in sync.
"""

import argparse
import datetime
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
                while j < len(lines) and re.match(r"^\s*-\s+", lines[j]):
                    items.append(parse_scalar(re.sub(r"^\s*-\s+", "", lines[j])))
                    j += 1
                if j > i + 1:
                    fm[key] = items
                    i = j
                    continue
                fm[key] = ""
            elif rest.startswith("["):
                if not rest.endswith("]"):
                    return None  # unclosed inline list — malformed frontmatter
                inner = rest[1:-1].strip()
                fm[key] = [parse_scalar(p) for p in inner.split(",")] if inner else []
            else:
                fm[key] = parse_scalar(rest)
        i += 1
    return None


def scan(root, include_dot=False):
    """Return (tickets, by_id, problems). Each ticket: frontmatter + _path + _rel.
    problems: files that claim to be tickets but can't be trusted — unreadable,
    unparseable frontmatter, missing id/type, or a duplicate id (first file wins).
    Dot folders (.archive/, .git/) are off the board unless include_dot."""
    tickets = []
    by_id = {}
    problems = []
    for p in sorted(root.rglob("*.md")):
        if p.name == "index.md":
            continue
        rel_parts = p.relative_to(root).parts
        if not include_dot and any(part.startswith(".") for part in rel_parts):
            continue
        rel = p.relative_to(root).as_posix()
        try:
            text = p.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as e:
            problems.append({"file": rel, "error": f"unreadable: {e.__class__.__name__}"})
            continue
        fm = parse_frontmatter(text)
        if fm is None:
            if text.lstrip().startswith("---"):
                problems.append({"file": rel, "error":
                                 "frontmatter failed to parse (unterminated block or malformed inline list)"})
            continue
        if "id" not in fm or "type" not in fm:
            problems.append({"file": rel, "error": "frontmatter lacks id or type"})
            continue
        tid = str(fm["id"])
        if tid in by_id:
            problems.append({"file": rel, "error":
                             f"duplicate id {tid} — also in {by_id[tid]['_rel']}"})
            continue
        fm["_path"] = p
        fm["_rel"] = rel
        tickets.append(fm)
        by_id[tid] = fm
    return tickets, by_id, problems


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
    """done and dropped are stored, intentional facts (retrospective or user) —
    never computed. Computed state is only: not-started (no children, or none
    past backlog) or in-progress (any child underway or resolved done)."""
    stored = epic.get("status")
    if stored in (DONE, DROPPED):
        return stored
    _seen = _seen or set()
    if str(epic["id"]) in _seen:
        return "in-progress"  # cycle guard; graph lint owns real diagnosis
    _seen.add(str(epic["id"]))
    kids = children_of(epic, tickets)
    states = [epic_state(k, tickets, _seen) if k["type"] == "epic" else k.get("status")
              for k in kids]
    started = any(s in (DONE, "in-progress", "review") for s in states)
    return "in-progress" if started else "not-started"


def dep_done(dep_id, by_id, tickets):
    t = by_id.get(str(dep_id))
    if t is None:
        return False, "not found"
    if t["type"] == "epic":
        state = epic_state(t, tickets)
        return state == DONE, state
    return t.get("status") == DONE, t.get("status")


def as_list(ticket, field):
    """List fields defensively: a scalar (schema violation validate will name)
    reads as a one-entry list, never iterated character by character."""
    v = ticket.get(field)
    if isinstance(v, list):
        return v
    return [v] if v not in (None, "") else []


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
            f.flush()
            os.fsync(f.fileno())
        # mkstemp creates 0600; keep the target's mode (0644 for new files)
        # so a rewrite never tightens permissions on collaborators.
        os.chmod(tmp, path.stat().st_mode if path.exists() else 0o644)
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
    # include_dot: archived tickets still own their ids — never reissue them.
    tickets, _, problems = scan(root, include_dot=True)
    nums = [id_num(t["id"]) for t in tickets
            if re.fullmatch(re.escape(key) + r"-\d+", str(t["id"]), re.IGNORECASE)]
    nxt = (max(nums) + 1) if nums else 1
    out = {"ok": True, "key": key, "next": nxt, "id": f"{key}-{nxt}"}
    if problems:
        out["warnings"] = problems  # a broken file could be hiding an issued id
    print(json.dumps(out))


def write_index(root, key):
    tickets, _, problems = scan(root)

    def entry_lines(t, depth):
        pad = "  " * depth
        desc = t.get("description")
        tail = f" - {desc}" if desc else ""
        href = t["_rel"].replace(" ", "%20").replace("(", "%28").replace(")", "%29")
        lines = [f"{pad}* [{t.get('title', t['id'])}]({href}){tail}"]
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
    return len(tickets), problems


def cmd_index(root, args):
    key = resolve_key(root, args.key)
    entries, problems = write_index(root, key)
    out = {"ok": True, "file": str(root / "index.md"), "entries": entries}
    if problems:
        out["warnings"] = problems
    print(json.dumps(out))


def cmd_frontier(root, args):
    tickets, by_id, _ = scan(root)
    out = []
    for t in tickets:
        if t["type"] not in LEAF_TYPES or t.get("status") != "backlog":
            continue
        unmet = []
        for dep in as_list(t, "depends_on"):
            ok, state = dep_done(dep, by_id, tickets)
            if not ok:
                unmet.append({"id": str(dep), "state": state})
        if not unmet:
            out.append({"id": str(t["id"]), "type": t["type"], "title": t.get("title"),
                        "risk": t.get("risk"), "hitl": t.get("hitl"), "path": t["_rel"]})
    print(json.dumps({"ok": True, "frontier": sorted(out, key=lambda x: id_num(x["id"]))}))


def cmd_board(root, args):
    tickets, by_id, _ = scan(root)
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
                unmet = [str(d) for d in as_list(t, "depends_on")
                         if not dep_done(d, by_id, tickets)[0]]
                if unmet:
                    blocked.append({"id": str(t["id"]), "waiting_on": unmet})
    bin_leaves = [{"id": str(t["id"]), "title": t.get("title"), "status": t.get("status")}
                  for t in tickets if t["type"] in LEAF_TYPES and t["_path"].parent == root]
    print(json.dumps({"ok": True,
                      "epics": sorted(epics, key=lambda x: id_num(x["id"])),
                      "bin": sorted(bin_leaves, key=lambda x: id_num(x["id"])),
                      "leaf_totals": totals, "blocked": blocked}))


def cmd_graph(root, args):
    tickets, by_id, _ = scan(root)
    deps_of = {str(t["id"]): [str(d) for d in as_list(t, "depends_on") if str(d) in by_id]
               for t in tickets}
    edges = [[d, n] for n, ds in sorted(deps_of.items()) for d in ds]

    # Longest-path depth, iterative (no recursion limit on deep chains).
    # Cycle participants contribute depth 0; validate owns cycle diagnosis.
    memo = {}
    for start in deps_of:
        if start in memo:
            continue
        stack, onstack = [start], {start}
        while stack:
            n = stack[-1]
            if n in memo:
                stack.pop()
                onstack.discard(n)
                continue
            pending = [d for d in deps_of[n] if d not in memo and d not in onstack]
            if pending:
                stack.extend(pending)
                onstack.update(pending)
                continue
            done_deps = [memo[d] for d in deps_of[n] if d in memo]
            memo[n] = (1 + max(done_deps)) if done_deps else 0
            stack.pop()
            onstack.discard(n)
    max_depth = max(memo.values(), default=0)
    lanes = [[n for n in sorted(deps_of, key=id_num) if memo[n] == i]
             for i in range(max_depth + 1)]

    path = []
    if deps_of:
        node = max(deps_of, key=lambda n: memo[n])
        while node is not None:
            path.append(node)
            node = next((d for d in deps_of[node] if memo.get(d) == memo[path[-1]] - 1), None)
        path.reverse()

    out = {"ok": True, "nodes": len(deps_of), "edges": edges,
           "lanes": lanes, "critical_path": path}
    if getattr(args, "mermaid", False):
        def mid(tid):
            return re.sub(r"[^A-Za-z0-9_]", "_", str(tid))

        def label(s):
            return re.sub(r'[\[\]"\n]', "'", str(s))
        lines = ["flowchart TD"]
        for t in tickets:
            tid = str(t["id"])
            title = label(t.get("title") or "")
            suffix = "" if t["type"] == "epic" else f" ({t.get('status')})"
            lines.append(f'    {mid(tid)}["{label(tid)} {title}{suffix}"]')
        for d, n in edges:
            lines.append(f"    {mid(d)} --> {mid(n)}")
        out["mermaid"] = "\n".join(lines)
    print(json.dumps(out))


def cmd_coverage(root, args):
    tickets, _, _ = scan(root)
    covered = {}
    for t in tickets:
        for cid in as_list(t, "covers"):
            covered.setdefault(str(cid), []).append(str(t["id"]))
    proposed = []
    if getattr(args, "proposed", None):
        proposed = [p.strip() for p in args.proposed.split(",") if p.strip()]
    result = {"ok": True, "covered": covered}
    if proposed:
        result["proposed"] = proposed
    if args.require:
        required = [r.strip() for r in args.require.split(",") if r.strip()]
        result["uncovered"] = [r for r in required
                               if r not in covered and r not in proposed]
    print(json.dumps(result))


def cmd_list(root, args):
    tickets, _, _ = scan(root)
    rows = [{"id": str(t["id"]), "type": t["type"], "title": t.get("title"),
             "status": t.get("status"), "path": t["_rel"]}
            for t in sorted(tickets, key=lambda x: id_num(x["id"]))]
    print(json.dumps({"ok": True, "tickets": rows}))


def cmd_render(root, args):
    """One generated epics-and-stories markdown view over the whole tree —
    the v6-shaped artifact. The tree stays the source of truth; edits to the
    rendered file are overwritten on the next render."""
    tickets, by_id, problems = scan(root)

    def body_of(t):
        lines = t["_path"].read_text(encoding="utf-8").splitlines()
        if lines and lines[0].strip() == "---":
            for i in range(1, len(lines)):
                if lines[i].strip() == "---":
                    lines = lines[i + 1:]
                    break
        while lines and not lines[0].strip():
            lines = lines[1:]
        if lines and lines[0].lstrip().startswith("# "):
            lines = lines[1:]  # drop the file's own H1; the view supplies headings
        return "\n".join(lines).strip()

    def demote(text, levels):
        return re.sub(r"^(#+)", "#" * levels + r"\1", text, flags=re.MULTILINE)

    def leaf_block(t, depth):
        h = "#" * (depth + 1)
        head = (f"{h} {t['id']} — {t.get('title')} "
                f"[{t.get('status')}] ({t['type']}, risk {t.get('risk')})")
        body = demote(body_of(t), depth - 1)
        return f"{head}\n\n{body}\n" if body else f"{head}\n"

    def epic_block(e, depth):
        h = "#" * (depth + 1)
        parts = [f"{h} {e['id']} — {e.get('title')} [{epic_state(e, tickets)}]"]
        body = demote(body_of(e), depth - 1)
        if body:
            parts.append(body)
        for k in sorted(children_of(e, tickets), key=lambda x: id_num(x["id"])):
            parts.append(epic_block(k, depth + 1) if k["type"] == "epic"
                         else leaf_block(k, depth + 1))
        return "\n\n".join(parts)

    top_epics = [t for t in tickets if t["type"] == "epic"
                 and not any(o["type"] == "epic" and o is not t
                             and t["_path"].parent.parent == o["_path"].parent
                             for o in tickets)]
    bin_leaves = [t for t in tickets if t["type"] in LEAF_TYPES and t["_path"].parent == root]

    out_parts = [
        "# Epics and Stories",
        "> Generated from the ticket tree — do not edit; the tree is the source "
        "of truth and the next render overwrites this file.\n"
        f"> Regenerate: `uv run ticket_tree.py render --root {root} --out <this file>`",
    ]
    for e in sorted(top_epics, key=lambda x: id_num(x["id"])):
        out_parts.append(epic_block(e, 1))
    if bin_leaves:
        out_parts.append("## Bin")
        for lf in sorted(bin_leaves, key=lambda x: id_num(x["id"])):
            out_parts.append(leaf_block(lf, 2))
    out_path = Path(args.out)
    atomic_write(out_path, "\n\n".join(out_parts) + "\n")
    result = {"ok": True, "file": str(out_path), "entries": len(tickets)}
    if problems:
        result["warnings"] = problems
    print(json.dumps(result))


def _rewrite_depends_on(path, new_deps):
    """Replace a ticket's depends_on entry (inline or block form) with an
    inline list. Only used by archive to drop satisfied edges."""
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    close = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), len(lines))
    new_line = "depends_on: [" + ", ".join(str(d) for d in new_deps) + "]\n"
    for i in range(1, close):  # frontmatter only — a body line never matches
        if re.match(r"^depends_on:", lines[i]):
            j = i + 1
            if lines[i].split(":", 1)[1].strip() == "":
                while j < close and re.match(r"^\s*-\s+", lines[j]):
                    j += 1
            lines[i:j] = [new_line]
            break
    atomic_write(path, "".join(lines))


def cmd_archive(root, args):
    """Move a finished epic's leaves to .archive/<date>-<slug>/ — the dated,
    off-board record of a moment. --purge deletes instead, for stories whose
    record of truth lives elsewhere (e.g. synced to Jira). The envelope stays:
    it is the durable thin layer carrying the epic-level covers."""
    tickets, by_id, problems = scan(root)
    epic = by_id.get(args.epic)
    if epic is None or epic.get("type") != "epic":
        fail(f"no epic with id '{args.epic}' in the tree")
    if epic.get("status") not in (DONE, DROPPED):
        fail(f"epic {args.epic} is not marked done or dropped — archive is for "
             "finished records; store the intentional status first (update_ticket.py)")
    kids = children_of(epic, tickets)
    if any(k["type"] == "epic" for k in kids):
        fail(f"epic {args.epic} contains sub-epics — archive those first")
    leaves = [k for k in kids if k["type"] in LEAF_TYPES]
    if not leaves:
        fail(f"epic {args.epic} has no leaves to archive")
    still_open = sorted(str(k["id"]) for k in leaves
                        if k.get("status") not in (DONE, DROPPED))
    if still_open:
        fail("archive is for finished records — still open under "
             f"{args.epic}: {', '.join(still_open)}")
    leaf_ids = {str(k["id"]): k for k in leaves}
    done_ids = {i for i, k in leaf_ids.items() if k.get("status") == DONE}

    blockers, edge_drops = [], {}
    for t in tickets:
        tid = str(t["id"])
        if tid in leaf_ids or t is epic:
            continue
        refs = [str(d) for d in as_list(t, "depends_on") if str(d) in leaf_ids]
        if not refs:
            continue
        undone = [r for r in refs if r not in done_ids]
        if undone:
            blockers.append(f"{tid} depends on dropped {', '.join(undone)}")
        else:
            edge_drops[tid] = refs
    if blockers:
        fail("live tickets depend on non-done leaves in the archive set — resolve "
             "these edges first: " + "; ".join(blockers))

    date = args.date or datetime.date.today().isoformat()
    if not DATE_RE.match(date):
        fail(f"--date must be YYYY-MM-DD, got '{date}'")

    dest = None
    if args.purge:
        for k in leaves:
            k["_path"].unlink()
    else:
        dest = root / ".archive" / f"{date}-{epic['_path'].parent.name}"
        dest.mkdir(parents=True, exist_ok=True)
        for k in leaves:
            os.replace(k["_path"], dest / k["_path"].name)

    for tid, refs in edge_drops.items():
        t = by_id[tid]
        kept = [str(d) for d in as_list(t, "depends_on") if str(d) not in refs]
        _rewrite_depends_on(t["_path"], kept)

    key = read_index_key(root)
    if key:
        write_index(root, key)
    out = {"ok": True, "epic": args.epic,
           ("purged" if args.purge else "archived"): sorted(leaf_ids),
           "dest": str(dest) if dest else None,
           "edges_dropped": edge_drops}
    if problems:
        out["warnings"] = problems
    print(json.dumps(out))


def _placeholderish(v):
    return isinstance(v, str) and ("[" in v or "]" in v or "YYYY" in v)


def cmd_validate(root, args):
    tickets, by_id, problems = scan(root)
    errors = []

    def err(t, msg):
        errors.append({"file": t["_rel"], "error": msg})

    only = Path(args.path).resolve() if getattr(args, "path", None) else None
    if only:
        errors.extend(p for p in problems
                      if (root / p["file"]).resolve() == only)
        if not any(t["_path"].resolve() == only for t in tickets) and not errors:
            errors.append({"file": str(only), "error":
                           "not a parseable ticket — frontmatter with id and type required"})
    else:
        errors.extend(problems)

    epic_dirs = {t["_path"].parent for t in tickets if t["type"] == "epic"}

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
        else:
            if tid and not t["_path"].name.startswith(tid + "-"):
                err(t, f"leaf filename must start with '{tid}-'")
            if t["_path"].parent != root and t["_path"].parent not in epic_dirs:
                err(t, "leaf sits in a folder with no epic ticket.md — invisible to "
                       "index and board; move it to the bin or an epic folder")
        if t["type"] != "epic" and t["type"] not in LEAF_TYPES:
            err(t, f"type must be epic or one of {sorted(LEAF_TYPES)}: {t['type']!r}")
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
            if t.get("status") not in (None, DONE, DROPPED):
                err(t, "epics compute progress — only intentional 'done' or 'dropped' "
                       f"is storable, got {t.get('status')!r}")
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

    # Tree-wide cycle check over valid ids (skipped for single-file runs —
    # a per-file gate shouldn't fail on a cycle between two other files).
    graph = {} if only else {str(t["id"]): [str(d) for d in as_list(t, "depends_on")]
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
    for verb in ("next-id", "index", "validate", "list", "frontier", "board",
                 "coverage", "graph", "render", "archive"):
        p = sub.add_parser(verb)
        p.add_argument("--root", required=True, help="ticket tree root")
        if verb in ("next-id", "index"):
            p.add_argument("--key", help="project key (else read from index.md)")
        if verb == "coverage":
            p.add_argument("--require", help="inventory ids, comma-separated")
            p.add_argument("--proposed", help="ids a not-yet-written proposal covers, comma-separated")
        if verb == "validate":
            p.add_argument("--path", help="validate one file instead of the whole tree")
        if verb == "graph":
            p.add_argument("--mermaid", action="store_true",
                           help="include a mermaid flowchart rendering")
        if verb == "render":
            p.add_argument("--out", required=True,
                           help="path for the generated epics-and-stories markdown")
        if verb == "archive":
            p.add_argument("--epic", required=True, help="id of the done/dropped epic")
            p.add_argument("--purge", action="store_true",
                           help="delete instead of moving (record lives elsewhere, e.g. Jira)")
            p.add_argument("--date", help="archive folder date, defaults to today")
    args = ap.parse_args()
    root = Path(args.root)
    if not root.is_dir():
        fail(f"no such directory: {args.root}")
    try:
        {"next-id": cmd_next_id, "index": cmd_index, "validate": cmd_validate,
         "list": cmd_list, "frontier": cmd_frontier, "board": cmd_board,
         "coverage": cmd_coverage, "graph": cmd_graph,
         "render": cmd_render, "archive": cmd_archive}[args.verb](root, args)
    except SystemExit:
        raise
    except Exception as e:  # keep the JSON output contract on fs/encoding errors
        fail(f"{e.__class__.__name__}: {e}")


if __name__ == "__main__":
    main()
