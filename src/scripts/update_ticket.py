#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Deterministic frontmatter updates for a bmad-ticket tree (schema 1).

Every write is gated: schema fields only, type-aware, valid values, and
status changes only along allowed lifecycle transitions. The body below
the frontmatter is never touched. Output is one JSON object; errors name
the fix and exit non-zero.

Leaves run backlog → in-progress → review → done; nodes (initiative, epic) run
backlog → ready → in-progress → done; either drops from any active state.
Both graphs are stored facts — a node's state is never calculated from its
children, so `done` can never flip because somebody added a child.

Usage:
  uv run update_ticket.py --root <tickets-root> --id KEY-n --set status=in-progress
  uv run update_ticket.py --path <ticket.md> --set risk=4 --set hitl=true
  ... [--transitions "backlog>in-progress,in-progress>review,..."]
  ... [--node-transitions "backlog>ready,ready>in-progress,..."]

Stdlib only. Dual-homed: canonical at src/scripts/ (installed to
{project-root}/_bmad/scripts/ for any skill or agent to call); bmad-ticket
bundles an identical copy and uses it locally. Keep both in sync.
"""

import argparse
import json
import os
import re
import sys
import tempfile
import tomllib
from pathlib import Path

DEFAULT_HITL_THRESHOLD = 3

DEFAULT_TRANSITIONS = [
    "backlog>in-progress",
    "in-progress>review",
    "review>in-progress",
    "review>done",
    "backlog>dropped",
    "in-progress>dropped",
    "review>dropped",
]

# Nodes (initiative, epic) run their own lifecycle. `ready` means inception is
# finished and work can start — it gates nothing; it records that someone
# decided. `done` is likewise a deliberate call, never a counter hitting zero.
DEFAULT_NODE_TRANSITIONS = [
    "backlog>ready",
    "backlog>in-progress",
    "backlog>done",
    "backlog>dropped",
    "ready>backlog",
    "ready>in-progress",
    "ready>done",
    "ready>dropped",
    "in-progress>done",
    "in-progress>dropped",
]

IMMUTABLE = {"schema", "id", "type", "created"}
LIST_FIELDS = {"depends_on", "covers"}
INT_FIELDS = {"risk": (1, 5), "severity": (1, 5)}
BOOL_FIELDS = {"hitl"}
QUOTED_FIELDS = {"title", "description"}
PLAIN_STR_FIELDS = {"discovered_from"}

LEAF_FIELDS = {"title", "status", "depends_on", "covers", "discovered_from", "risk", "hitl"}
EPIC_FIELDS = {"title", "description", "depends_on", "covers", "risk", "status"}
# The initiative node scores nothing (risk and hitl are execution-altitude) and
# carries the tracker-shaped set instead.
PROJECT_FIELDS = {"title", "description", "status", "owner", "target", "tags",
                  "external", "spec"}
NODE_TYPES = ("initiative", "epic")

ID_RE = re.compile(r"^[A-Za-z][A-Za-z0-9]*-\d+$")


def fail(msg):
    print(json.dumps({"ok": False, "error": msg}))
    sys.exit(1)


def sibling_workflow_config():
    """Read [workflow] from the customize.toml beside this script's skill root.
    The bundled copy finds it at <skill>/customize.toml; the globally installed
    copy has no sibling and falls back to built-in defaults."""
    path = Path(__file__).resolve().parent.parent / "customize.toml"
    try:
        with open(path, "rb") as f:
            return tomllib.load(f).get("workflow", {})
    except (OSError, tomllib.TOMLDecodeError):
        return {}


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


def parse_inline_list(raw):
    raw = raw.strip()
    if not raw.endswith("]"):
        raise ValueError(f"unclosed inline list: {raw!r}")
    inner = raw[1:-1].strip()
    if not inner:
        return []
    return [parse_scalar(part) for part in inner.split(",")]


def parse_frontmatter(lines):
    """Return (entries, close_idx). entries: list of dicts {key, value, start, end}
    where start/end are line indexes [start, end) covering the entry.
    Raises ValueError on malformed frontmatter."""
    if not lines or lines[0].strip() != "---":
        raise ValueError("no frontmatter found (file does not start with ---)")
    close = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            close = i
            break
    if close is None:
        raise ValueError("no frontmatter found (unterminated --- block)")
    entries = []
    i = 1
    while i < close:
        line = lines[i]
        if not line.strip() or line.lstrip().startswith("#"):
            i += 1
            continue
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_]*):(.*)$", line.rstrip("\n"))
        if not m:
            i += 1
            continue
        key, rest = m.group(1), m.group(2).strip()
        start = i
        if rest == "":
            items = []
            j = i + 1
            while j < close and re.match(r"^\s*-\s+", lines[j]):
                items.append(parse_scalar(re.sub(r"^\s*-\s+", "", lines[j].rstrip("\n"))))
                j += 1
            entries.append({"key": key, "value": items, "start": start, "end": j})
            i = j
        else:
            value = parse_inline_list(rest) if rest.startswith("[") else parse_scalar(rest)
            entries.append({"key": key, "value": value, "start": start, "end": i + 1})
            i += 1
    return entries, close


def render(key, value):
    if isinstance(value, bool):
        return f"{key}: {'true' if value else 'false'}\n"
    if isinstance(value, int):
        return f"{key}: {value}\n"
    if isinstance(value, list):
        return f"{key}: [{', '.join(str(v) for v in value)}]\n"
    if key in QUOTED_FIELDS:
        escaped = str(value).replace('"', '\\"')
        return f'{key}: "{escaped}"\n'
    s = str(value)
    if (key in PLAIN_STR_FIELDS and s == "") or re.search(r'[:#\[\]{}"\']', s) or s != s.strip():
        return f'{key}: "{s.replace(chr(34), chr(92) + chr(34))}"\n'
    return f"{key}: {s}\n"


def coerce(field, raw, ticket_type):
    """Validate and convert a raw --set string for a field. Returns value or fails."""
    if any(c in raw for c in "\n\r"):
        fail(f"{field} must be a single line — a newline in a value would "
             "terminate the frontmatter block")
    if field in LIST_FIELDS:
        return [p.strip() for p in raw.split(",") if p.strip()]
    if field in INT_FIELDS:
        lo, hi = INT_FIELDS[field]
        if not re.fullmatch(r"-?\d+", raw.strip()):
            fail(f"{field} must be an integer {lo}-{hi}, got '{raw}'")
        val = int(raw)
        if not lo <= val <= hi:
            fail(f"{field} must be {lo}-{hi}, got {val}")
        return val
    if field in BOOL_FIELDS:
        if raw.strip() not in ("true", "false"):
            fail(f"{field} must be true or false, got '{raw}'")
        return raw.strip() == "true"
    return raw.strip()


def collect_tree(root):
    """Map every ticket in the tree: id -> path, id -> depends_on list, and
    id -> list of duplicate paths. Uses the same parser as the target file so
    quoted ids and block-style lists resolve identically everywhere."""
    ids, deps, dups = {}, {}, {}
    # Only the root node and everything under root/tickets/. The initiative
    # folder's sibling content (prd/, spec/, brief/) carries frontmatter ids
    # of its own and must never be mistaken for tickets.
    candidates = sorted((root / "tickets").rglob("*.md")) if (root / "tickets").is_dir() else []
    if (root / "ticket.md").is_file():
        candidates.insert(0, root / "ticket.md")
    for p in candidates:
        if any(part.startswith(".") for part in p.relative_to(root).parts):
            continue  # dot folders (.archive/, .git/) are not the live tree
        try:
            lines = p.read_text(encoding="utf-8").splitlines(keepends=True)
            entries, _ = parse_frontmatter(lines)
        except (OSError, UnicodeDecodeError, ValueError):
            continue
        fm = {e["key"]: e["value"] for e in entries}
        if "id" not in fm:
            continue
        tid = str(fm["id"])
        if tid in ids:
            dups.setdefault(tid, [ids[tid]]).append(p)
            continue
        tdeps = fm.get("depends_on")
        ids[tid] = p
        deps[tid] = [str(d) for d in tdeps] if isinstance(tdeps, list) else []
    return ids, deps, dups


def cycle_via(graph, start):
    """Return the id path of a cycle through `start`, or None."""
    path, onpath, visited = [start], {start}, set()
    stack = [(start, iter(graph.get(start, [])))]
    while stack:
        node, it = stack[-1]
        step = next(it, None)
        if step is None:
            stack.pop()
            visited.add(node)
            path.pop()
            onpath.discard(node)
            continue
        if step == start:
            return path + [start]
        if step in onpath or step in visited:
            continue
        stack.append((step, iter(graph.get(step, []))))
        path.append(step)
        onpath.add(step)
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", help="ticket tree root (find ticket by --id; validates depends_on refs)")
    ap.add_argument("--id", help="ticket id (KEY-n) to update; requires --root")
    ap.add_argument("--path", help="direct path to the ticket file")
    ap.add_argument("--set", action="append", default=[], metavar="FIELD=VALUE",
                    help="field to set; repeatable; lists are comma-separated")
    ap.add_argument("--transitions", default=None,
                    help='allowed leaf status moves as "from>to,from>to"; defaults to the '
                         "skill's customize.toml lifecycle_transitions, else built-ins")
    ap.add_argument("--node-transitions", default=None,
                    help='allowed node (initiative, epic) status moves as "from>to,from>to"; '
                         "defaults to the skill's customize.toml "
                         "node_lifecycle_transitions, else built-ins")
    ap.add_argument("--hitl-threshold", type=int, default=None,
                    help="risk level at/above which hitl derives true; defaults to the "
                         "skill's customize.toml hitl_threshold, else 3")
    ap.add_argument("--force", action="store_true",
                    help="apply a user-decided status move outside the transition graph; "
                         "unknown states are still refused")
    args = ap.parse_args()

    if not args.set:
        fail("nothing to do: pass at least one --set FIELD=VALUE")

    cfg = sibling_workflow_config()
    if args.transitions is None:
        cfg_transitions = cfg.get("lifecycle_transitions") or DEFAULT_TRANSITIONS
        args.transitions = ",".join(str(t) for t in cfg_transitions)
    if args.node_transitions is None:
        cfg_node = cfg.get("node_lifecycle_transitions") or DEFAULT_NODE_TRANSITIONS
        args.node_transitions = ",".join(str(t) for t in cfg_node)
    hitl_threshold = args.hitl_threshold
    if hitl_threshold is None:
        ht = cfg.get("hitl_threshold", DEFAULT_HITL_THRESHOLD)
        hitl_threshold = ht if isinstance(ht, int) and not isinstance(ht, bool) \
            else DEFAULT_HITL_THRESHOLD

    tree_ids, tree_deps = None, None
    if args.path:
        path = Path(args.path)
        if not path.is_file():
            fail(f"no such file: {path}")
    elif args.root and args.id:
        root = Path(args.root)
        if not root.is_dir():
            fail(f"no such directory: {args.root}")
        tree_ids, tree_deps, dups = collect_tree(root)
        if args.id in dups:
            files = ", ".join(str(p) for p in dups[args.id])
            fail(f"id '{args.id}' is duplicated across: {files} — fix the tree "
                 "before updating (run ticket_tree.py validate)")
        if args.id not in tree_ids:
            known = ", ".join(sorted(tree_ids)) or "none"
            fail(f"id '{args.id}' not found under {args.root} — known ids: {known}")
        path = tree_ids[args.id]
    else:
        fail("target the ticket with --path FILE, or --root DIR --id KEY-n")

    if args.root and tree_ids is None:
        tree_ids, tree_deps, _ = collect_tree(Path(args.root))

    leaf_transitions = set(t.strip() for t in args.transitions.split(",") if t.strip())
    node_transitions = set(t.strip() for t in args.node_transitions.split(",") if t.strip())

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    try:
        entries, close = parse_frontmatter(lines)
    except ValueError as e:
        fail(str(e))
    fm = {e["key"]: e["value"] for e in entries}
    ticket_type = fm.get("type")
    if ticket_type not in NODE_TYPES + ("story", "bug", "task", "spike"):
        fail(f"unsupported or missing type '{ticket_type}' in {path.name}")

    if ticket_type == "initiative":
        allowed = set(PROJECT_FIELDS)
    elif ticket_type == "epic":
        allowed = set(EPIC_FIELDS)
    else:
        allowed = set(LEAF_FIELDS)
    if ticket_type == "bug":
        allowed.add("severity")

    # Parse and validate every --set before touching anything.
    updates = {}
    for spec in args.set:
        if "=" not in spec:
            fail(f"bad --set '{spec}': expected FIELD=VALUE")
        field, raw = spec.split("=", 1)
        field = field.strip()
        if field in IMMUTABLE:
            fail(f"{field} is immutable — set at creation, never updated")
        if field not in allowed:
            fail(f"'{field}' is not writable on a {ticket_type} — writable: {', '.join(sorted(allowed))}")
        updates[field] = coerce(field, raw, ticket_type)

    # Status gating. Leaves and nodes run different graphs, through one gate:
    # every move is deliberate at both altitudes, and nothing is calculated.
    if "status" in updates:
        transitions = node_transitions if ticket_type in NODE_TYPES else leaf_transitions
        known_states = {"backlog"} | {s for t in transitions for s in t.split(">")}
        new_status = updates["status"]
        # A node written before it carried a status reads as backlog, the same
        # default the tree scanner applies — never a dead end.
        current = fm.get("status")
        if current is None and ticket_type in NODE_TYPES:
            current = "backlog"
        if new_status != current:
            if new_status not in known_states:
                fail(f"unknown status '{new_status}' — known: {', '.join(sorted(known_states))}")
            if current is None:
                fail(f"{path.name} has no current status; malformed leaf")
            if not args.force and f"{current}>{new_status}" not in transitions:
                legal = sorted(t.split(">")[1] for t in transitions if t.startswith(current + ">"))
                fail(f"transition {current} -> {new_status} not allowed — legal from "
                     f"'{current}': {', '.join(legal) if legal else 'none (terminal)'}; "
                     "pass --force to apply a user-decided override")

    # Derive hitl when risk is set without an explicit hitl: raise to true at the
    # threshold, never lower automatically (an explicit --set hitl always wins).
    if ticket_type not in NODE_TYPES and "risk" in updates and "hitl" not in updates:
        if updates["risk"] >= hitl_threshold and fm.get("hitl") is not True:
            updates["hitl"] = True

    # depends_on validation.
    if "depends_on" in updates:
        own_id = fm.get("id")
        for ref in updates["depends_on"]:
            if not ID_RE.match(str(ref)):
                fail(f"depends_on entry '{ref}' is not a KEY-n id")
            if ref == own_id:
                fail(f"{own_id} cannot depend on itself")
            if tree_ids is not None and ref not in tree_ids:
                fail(f"depends_on ref '{ref}' not found in the tree — pass a real id "
                     "or omit --root to skip existence checks")
        if tree_deps is not None and own_id:
            graph = dict(tree_deps)
            graph[own_id] = list(updates["depends_on"])
            cycle = cycle_via(graph, own_id)
            if cycle:
                fail("depends_on would close a cycle: " + " -> ".join(cycle))

    # Apply: patch entry lines in place; append new keys after `type:`.
    changes, unchanged = {}, []
    by_key = {e["key"]: e for e in entries}
    replacements = []  # (start, end, new_line)
    for field, value in updates.items():
        if field in by_key:
            old = by_key[field]["value"]
            if old == value:
                unchanged.append(field)
                continue
            replacements.append((by_key[field]["start"], by_key[field]["end"], render(field, value)))
            changes[field] = {"from": old, "to": value}
        else:
            anchor = by_key.get("type") or by_key.get("id")
            replacements.append((anchor["end"], anchor["end"], render(field, value)))
            changes[field] = {"from": None, "to": value}

    if changes:
        new_lines = list(lines)
        # Apply bottom-up; at an equal start index the replacement (end > start)
        # must land before the insertion (end == start), or the insertion is
        # silently spliced away by the replacement of the line it sits on.
        for start, end, new_line in sorted(replacements,
                                           key=lambda r: (r[0], r[1] > r[0]),
                                           reverse=True):
            new_lines[start:end] = [new_line]
        fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=".update-", suffix=".tmp")
        try:
            with os.fdopen(fd, "w", encoding="utf-8", newline="") as f:
                f.write("".join(new_lines))
                f.flush()
                os.fsync(f.fileno())
            # mkstemp creates 0600; keep the ticket's own mode.
            os.chmod(tmp, path.stat().st_mode)
            os.replace(tmp, path)
        except BaseException:
            if os.path.exists(tmp):
                os.unlink(tmp)
            raise

    out = {"ok": True, "file": str(path), "changes": changes, "unchanged": unchanged}
    if ticket_type == "epic" and changes.get("status", {}).get("to") == "done":
        out["hint"] = ("epic marked done — offer to archive its stories to the dated "
                       "record: ticket_tree.py archive --epic <id> (--purge if the "
                       "record lives elsewhere, e.g. Jira)")
    print(json.dumps(out))


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:  # keep the JSON output contract on fs/encoding errors
        fail(f"{e.__class__.__name__}: {e}")
