#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Resolve the party-mode roster, lazily.

Merges the roster the installed skills offer (agents, guests and groups, read
by `_bmad/scripts/roster.py`) with the user's custom `party_members` and
`party_groups` into one collective, then projects only what the moment needs:

  * default (no flag) — the active roster to load on entry: the
    `default_party` group if one is configured, else the whole collective.
    Other groups come back as names only, so nothing you aren't using is
    loaded into the party.
  * --list-groups — just id + name + size for every configured group. The
    cheap menu for "which room?", with no member detail.
  * --party <id> — full member detail for one chosen group, on demand
    (e.g. when the user switches rooms). Unknown id returns the available
    names instead of an error wall.

The merge is deterministic (a keyed union; a custom member whose code
matches an installed agent overrides it), so the orchestrator consumes a
resolved roster instead of re-deriving it every session.

Stdlib only (Python 3.11+ for tomllib). Shells out to the project's roster.py
and resolve_customization.py. An install whose `_bmad/scripts` predates
roster.py falls back to the `[agents]` table resolve_config.py returns, and a
missing customization resolver falls back to reading customize.toml directly.

  resolve_party.py --project-root P --skill S
  resolve_party.py --project-root P --skill S --list-groups
  resolve_party.py --project-root P --skill S --party writers-room   (alias: --group)
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

try:
    import tomllib
except ImportError:  # pragma: no cover - guarded for <3.11
    sys.stderr.write("error: Python 3.11+ is required (stdlib `tomllib`).\n")
    sys.exit(3)


def _run_json(cmd):
    """Run a resolver script and parse its JSON stdout. None on any failure."""
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", timeout=60)
    except (OSError, subprocess.SubprocessError):
        return None
    if out.returncode != 0 or not out.stdout.strip():
        return None
    try:
        return json.loads(out.stdout)
    except json.JSONDecodeError:
        return None


def load_roster(project_root: Path, skill_root: Path):
    """(agents, guests, groups, resolved, problems) from the skills installed beside this one.

    agents are {code: entry} for the default room; guests are roster members
    that are not installed agents, available to groups only. problems are what
    roster.py could not use, so a missing agent or room is explained.
    """
    scripts = project_root / "_bmad" / "scripts"
    data = _run_json(
        [sys.executable, str(scripts / "roster.py"), "--skill", str(skill_root), "--project-root", str(project_root)]
    )
    if data is not None:
        agents = data.get("agents", {}) or {}
        guests = {code: m for code, m in (data.get("members", {}) or {}).items() if code not in agents}
        problems = [p.get("problem", "") for p in data.get("problems", []) or [] if isinstance(p, dict)]
        return agents, guests, data.get("groups", []) or [], True, [p for p in problems if p]
    data = _run_json(
        [sys.executable, str(scripts / "resolve_config.py"), "--project-root", str(project_root), "--key", "agents"]
    )
    if data is None:
        return {}, {}, [], False, []
    return data.get("agents", {}) or {}, {}, [], True, []


def merge_groups(roster_groups: list, custom_groups: list) -> list:
    """Roster groups first, then the user's; a custom group replaces a roster group with its id."""
    merged = {g["id"]: g for g in roster_groups if isinstance(g, dict) and g.get("id")}
    for g in custom_groups or []:
        if isinstance(g, dict) and g.get("id"):
            merged[g["id"]] = g
    return list(merged.values())


def load_workflow(project_root: Path, skill_root: Path):
    """Merged [workflow] table. Falls back to the skill's base customize.toml."""
    script = project_root / "_bmad" / "scripts" / "resolve_customization.py"
    data = _run_json(
        [
            sys.executable,
            str(script),
            "--skill",
            str(skill_root),
            "--project-root",
            str(project_root),
            "--key",
            "workflow",
        ]
    )
    if data is not None and "workflow" in data:
        return data["workflow"]
    # Fallback: read the skill's base customize.toml directly (no override merge).
    toml_path = skill_root / "customize.toml"
    if toml_path.exists():
        try:
            with toml_path.open("rb") as f:
                return tomllib.load(f).get("workflow", {})
        except (OSError, tomllib.TOMLDecodeError):
            pass
    return {}


def _alias(code: str) -> str:
    """Short alias for an installed agent code: bmad-agent-analyst -> analyst."""
    if "-agent-" in code:
        return code.split("-agent-", 1)[1]
    for prefix in ("bmad-agent-", "bmad-"):
        if code.startswith(prefix):
            return code[len(prefix) :]
    return code


def build_collective(agents: dict, party_members: list, guests: dict | None = None):
    """One pool keyed by code. Custom members override matching installed agents.

    `guests` are roster members that are not installed agents: a module's extra
    personas, or an agent whose skill is absent. They join the pool so a group
    can seat them, and never the default room.

    Returns (collective, index, installed_codes):
      * collective — every member (installed + custom), the pool groups draw
        from and the orchestrator can summon by name.
      * index — maps every resolvable token (code, prefix-stripped alias,
        lower-cased name) to a canonical code.
      * installed_codes — the codes occupying an installed-agent slot, in
        order. This is the DEFAULT room: installed agents (with any custom
        override applied in place), and NOT the pure-custom additions. So
        shipping or defining custom members grows the pool without crowding
        the default party.
    """
    collective = {}
    index = {}
    installed_codes = []
    alias_owner = {}

    def register(code, entry):
        collective[code] = entry
        index[code] = code
        index[code.lower()] = code
        # A short alias two codes claim resolves to neither; the full code still works.
        alias = _alias(code).lower()
        owner = alias_owner.setdefault(alias, code)
        if owner == code:
            index.setdefault(alias, code)
        elif owner is not None:
            alias_owner[alias] = None
            if index.get(alias) == owner and alias != owner.lower():
                del index[alias]
        name = entry.get("name")
        if name:
            index[name.lower()] = code

    for code, info in agents.items():
        entry = {
            "code": code,
            "name": info.get("name", code),
            "icon": info.get("icon", ""),
            "title": info.get("title", ""),
            "module": info.get("module", ""),
            "source": "installed",
        }
        # Installs from before rosters recorded the persona as `description`.
        persona = info.get("persona") or info.get("description")
        if persona:
            entry["persona"] = persona
        for field in ("capabilities", "model"):
            if info.get(field):
                entry[field] = info[field]
        register(code, entry)
        installed_codes.append(code)

    for code, info in (guests or {}).items():
        entry = {"code": code, "source": "roster"}
        for field in ("name", "icon", "title", "persona", "capabilities", "model", "module", "skill", "install"):
            if info.get(field):
                entry[field] = info[field]
        entry.setdefault("name", code)
        if info.get("installed") is False:
            entry["installed"] = False
        register(code, entry)

    for m in party_members if isinstance(party_members, list) else []:
        if not isinstance(m, dict):
            continue
        code = m.get("code")
        if not code:
            continue
        # A custom member overrides an installed agent it matches by code/alias/name.
        canonical = index.get(code) or index.get(code.lower()) or code
        # Start from the installed entry so fields the override omits
        # (icon, title, persona, module) survive.
        entry = dict(collective.get(canonical, {}))
        entry.update({"code": canonical, "source": "custom"})
        for field in ("name", "icon", "title", "persona", "capabilities", "model"):
            if m.get(field) is not None:
                entry[field] = m[field]
        entry.setdefault("name", canonical)
        register(canonical, entry)
        # An override keeps the installed slot; a brand-new custom does not join it.

    return collective, index, installed_codes


def resolve_members(member_tokens, collective, index):
    """(resolved entries in listed order, unresolved tokens)."""
    resolved, unresolved = [], []
    for token in member_tokens or []:
        if not isinstance(token, str):
            unresolved.append(token)  # malformed config value — never a key lookup
            continue
        code = index.get(token) or index.get(token.lower())
        if code and code in collective:
            resolved.append(collective[code])
        else:
            unresolved.append(token)
    return resolved, unresolved


def group_menu(groups):
    """Names only — the cheap menu. Open-cast groups (no roster) are flagged."""
    out = []
    for g in groups or []:
        if not isinstance(g, dict) or not g.get("id"):
            continue
        members = g.get("members", []) or []
        entry = {"id": g["id"], "name": g.get("name", g["id"]), "member_count": len(members)}
        if not members:
            entry["open_cast"] = True
        out.append(entry)
    return out


def find_group(groups, group_id):
    for g in groups or []:
        if isinstance(g, dict) and g.get("id") == group_id:
            return g
    return None


def group_detail(g, collective, index):
    """Full detail for one group: resolved members + the optional scene.

    `scene` is a freeform line the orchestrator plays — setting, what's
    happening, room dynamics, in-the-moment character notes. Surfaced only
    here (when a group is the active/chosen roster), never in the menu.

    `members` is optional. With none, the group is open-cast: `open_cast`
    is flagged and the scene describes the pool the orchestrator casts from
    on the fly (e.g. "figures from the Star Wars Rebels universe"). A few
    listed members anchor the room; the scene can still invite more.
    """
    raw_members = g.get("members", []) or []
    members, unresolved = resolve_members(raw_members, collective, index)
    detail = {
        "active": g["id"],
        "name": g.get("name", g["id"]),
        "members": members,
        "unresolved": unresolved,
        "memory_enabled": bool(g.get("memory", False)),
    }
    if g.get("scene"):
        detail["scene"] = g["scene"]
    if not raw_members:
        detail["open_cast"] = True
    return detail


def build_parser():
    ap = argparse.ArgumentParser(description="Resolve the party-mode roster, lazily.")
    ap.add_argument("--project-root", required=True)
    ap.add_argument("--skill", required=True, help="Path to the bmad-party-mode skill dir")
    ap.add_argument("--party", "--group", dest="party", help="Resolve full detail for this group id")
    ap.add_argument("--list-groups", action="store_true", help="Group names only")
    return ap


def main():
    args = build_parser().parse_args()

    project_root = Path(args.project_root).resolve()
    skill_root = Path(args.skill).resolve()

    workflow = load_workflow(project_root, skill_root)
    agents, guests, roster_groups, agents_ok, roster_problems = load_roster(project_root, skill_root)
    groups = merge_groups(roster_groups, workflow.get("party_groups", []) or [])
    default_party = workflow.get("default_party", "") or ""
    party_mode = workflow.get("party_mode", "session") or "session"
    # The global party_memory flag governs only the DEFAULT installed-agent room;
    # a named group carries its own `memory` flag (resolved in group_detail).
    party_memory = bool(workflow.get("party_memory", True))

    if args.list_groups:
        _emit(
            {
                "party_mode": party_mode,
                "default_party": default_party,
                "groups": group_menu(groups),
            }
        )
        return

    collective, index, installed_codes = build_collective(agents, workflow.get("party_members", []), guests)

    if args.party:
        g = find_group(groups, args.party)
        if g is None:
            _emit({"error": "unknown_group", "requested": args.party, "available": group_menu(groups)})
            return
        detail = {**group_detail(g, collective, index), "party_mode": party_mode}
        if roster_problems:
            detail["roster_problems"] = roster_problems
        _emit(detail)
        return

    # Default: the active roster to load on entry.
    result = {"party_mode": party_mode, "groups": group_menu(groups), "installed_agents_resolved": agents_ok}
    if roster_problems:
        result["roster_problems"] = roster_problems
    g = find_group(groups, default_party) if default_party else None
    if g is not None:
        result.update(group_detail(g, collective, index))
    else:
        # No default group: the installed agents (custom additions stay in the
        # pool but don't crowd the default room), exactly like a plain install.
        result.update(
            {"active": "installed", "members": [collective[c] for c in installed_codes], "memory_enabled": party_memory}
        )
    _emit(result)


def _emit(obj):
    reconfigure = getattr(sys.stdout, "reconfigure", None)
    if reconfigure is not None:
        reconfigure(encoding="utf-8")
    sys.stdout.write(json.dumps(obj, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    main()
