#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Resolve the personas and parties the forge can bring into the room.

The forge cross-examines witnesses: the installed BMAD agents, plus any
custom personas and party groups the user has authored for `bmad-party-mode`.
This surfaces all of them in one shot so the orchestrator never has to ask
"who's available?" — it just intermixes whoever fits the branch, alongside
any persona the user names on the fly.

What it returns (JSON, stdout):
  * agents   — the installed BMAD roster: the default room, always present.
  * members  — extra personas in the pool: guests an installed module's
               roster offers, and party_members the user defined that
               aren't already an installed slot.
  * parties  — the named party groups, an installed module's first and then
               the user's, members resolved to brief entries; open-cast
               groups (scene names a pool, no roster) are flagged.
  * default_party — the group id pinned as party-mode's default, if any.

Discovery is best-effort and never blocks the forge. The installed roster
comes from `_bmad/scripts/roster.py`, the same source `bmad-party-mode` uses,
so both skills see the same room; the `[agents]` table of the central config
is the fallback for a project set up before rosters existed. Custom personas/parties come from
`bmad-party-mode`'s resolved customization when that skill is found beside
this one, else from the user's override TOMLs read directly. Anything that
can't be resolved is simply omitted and flagged, never fatal.

Stdlib only (Python 3.11+ for tomllib).

  resolve_personas.py --project-root P --skill S
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

PARTY_SKILL = "bmad-party-mode"


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


def _load_toml(path: Path):
    if not path.exists():
        return {}
    try:
        with path.open("rb") as f:
            data = tomllib.load(f)
        return data if isinstance(data, dict) else {}
    except (OSError, tomllib.TOMLDecodeError):
        return {}


def load_roster(project_root: Path, skill_root: Path):
    """(agents, guests, groups, resolved_ok) from the skills installed beside this one.

    agents are {code: entry} for the default room. guests are the other
    roster members, available by name or through a group, as in party mode.
    """
    scripts = project_root / "_bmad" / "scripts"
    data = _run_json(
        [sys.executable, str(scripts / "roster.py"), "--skill", str(skill_root), "--project-root", str(project_root)]
    )
    if data is not None:
        agents = data.get("agents", {})
        members = data.get("members", {})
        groups = data.get("groups", [])
        agents = agents if isinstance(agents, dict) else {}
        guests = {
            code: member
            for code, member in (members if isinstance(members, dict) else {}).items()
            if code not in agents and isinstance(member, dict)
        }
        return agents, guests, groups if isinstance(groups, list) else [], True
    agents, resolved = load_config_agents(project_root)
    return agents, {}, [], resolved


def load_config_agents(project_root: Path):
    """The central config's [agents] table as {code: entry}. (dict, resolved_ok).

    The core resolver may emit agents as a dict keyed by code or as an array
    of tables (depending on how the layers merged); normalize both to a dict.
    """
    script = project_root / "_bmad" / "scripts" / "resolve_config.py"
    data = _run_json([sys.executable, str(script), "--project-root", str(project_root), "--key", "agents"])
    if data is None:
        return {}, False
    agents = data.get("agents", {}) or {}
    if isinstance(agents, list):
        agents = {a["code"]: a for a in agents if isinstance(a, dict) and a.get("code")}
    elif not isinstance(agents, dict):
        agents = {}
    return agents, True


def merge_groups(roster_groups: list, custom_groups: list) -> list:
    """Roster groups first, then the user's; a custom group replaces a roster group with its id."""
    merged = {g["id"]: g for g in roster_groups if isinstance(g, dict) and g.get("id")}
    for g in custom_groups if isinstance(custom_groups, list) else []:
        if isinstance(g, dict) and g.get("id"):
            merged[g["id"]] = g
    return list(merged.values())


def find_party_skill(project_root: Path, skill_root: Path):
    """Locate the installed bmad-party-mode skill dir, or None.

    Skills install as siblings, so the party skill is almost always next to
    this one. A couple of common install roots cover the rest.
    """
    candidates = [
        skill_root.parent / PARTY_SKILL,
        project_root / ".claude" / "skills" / PARTY_SKILL,
        project_root / "_bmad" / "skills" / PARTY_SKILL,
    ]
    for c in candidates:
        if (c / "customize.toml").exists():
            return c
    return None


def load_party_workflow(project_root: Path, party_skill: Path):
    """Merged [workflow] table for bmad-party-mode (base + user overrides)."""
    resolver = project_root / "_bmad" / "scripts" / "resolve_customization.py"
    data = _run_json(
        [
            sys.executable,
            str(resolver),
            "--skill",
            str(party_skill),
            "--project-root",
            str(project_root),
            "--key",
            "workflow",
        ]
    )
    if data is not None and isinstance(data.get("workflow"), dict):
        return data["workflow"]
    # Fallback: base customize.toml directly, no override merge.
    wf = _load_toml(party_skill / "customize.toml").get("workflow", {})
    return wf if isinstance(wf, dict) else {}


def load_party_overrides(project_root: Path):
    """Custom personas/parties when party-mode itself isn't installed.

    Reads only the user's override TOMLs (team then personal, personal wins on
    scalars). No base roster exists in this path, so a shallow merge is enough.
    """
    custom = project_root / "_bmad" / "custom"
    team = _load_toml(custom / f"{PARTY_SKILL}.toml").get("workflow", {})
    user = _load_toml(custom / f"{PARTY_SKILL}.user.toml").get("workflow", {})
    team = team if isinstance(team, dict) else {}
    user = user if isinstance(user, dict) else {}
    merged = dict(team)
    for key, val in user.items():
        if isinstance(val, list) and isinstance(merged.get(key), list):
            merged[key] = merged[key] + val
        else:
            merged[key] = val
    return merged


def _alias(code: str) -> str:
    """Short alias for an installed agent code: bmad-agent-analyst -> analyst."""
    for prefix in ("bmad-agent-", "bmad-"):
        if code.startswith(prefix):
            return code[len(prefix) :]
    return code


def build_pool(agents: dict, party_members: list, guests: dict | None = None):
    """One pool keyed by code; custom members override matching installed slots.

    Returns (pool, index, installed_codes, custom_codes):
      * installed_codes — the default room (installed agents, overrides applied
        in place); custom-only additions stay in the pool but don't crowd it.
      * custom_codes — pure-custom personas (no installed slot), the extra
        faces the forge can summon by name or via a party group.
    """
    pool, index, installed_codes, custom_codes = {}, {}, [], []

    def register(code, entry):
        pool[code] = entry
        index[code] = code
        index[code.lower()] = code
        index[_alias(code).lower()] = code
        name = entry.get("name")
        if name:
            key = name.lower()
            # A custom rename must not hijack another agent's name lookup.
            if index.get(key, code) == code:
                index[key] = code

    for code, info in (agents or {}).items():
        register(
            code,
            {
                "code": code,
                "name": info.get("name", code),
                "icon": info.get("icon", ""),
                "title": info.get("title", ""),
                "description": info.get("description", ""),
                "persona": info.get("persona", ""),
                "source": "installed",
            },
        )
        installed_codes.append(code)

    for code, info in (guests or {}).items():
        entry = {"code": code, "source": "roster"}
        for field in ("name", "icon", "title", "persona", "capabilities", "model"):
            if info.get(field):
                entry[field] = info[field]
        entry.setdefault("name", code)
        register(code, entry)
        custom_codes.append(code)

    for m in party_members if isinstance(party_members, list) else []:
        if not isinstance(m, dict):
            continue
        code = m.get("code")
        if not code:
            continue
        canonical = index.get(code) or index.get(code.lower()) or code
        was_installed = canonical in pool
        # Start from the installed entry so fields the override omits
        # (icon, title, description) survive.
        entry = dict(pool.get(canonical, {}))
        entry.update({"code": canonical, "source": "custom"})
        for field in ("name", "icon", "title", "persona", "capabilities", "model"):
            if m.get(field) is not None:
                entry[field] = m[field]
        entry.setdefault("name", canonical)
        register(canonical, entry)
        if not was_installed:
            custom_codes.append(canonical)

    return pool, index, installed_codes, custom_codes


def _brief(entry):
    """The slim card the orchestrator needs to cast a persona."""
    out = {k: entry[k] for k in ("code", "name", "icon", "title", "source") if entry.get(k)}
    for k in ("description", "persona", "capabilities", "model"):
        if entry.get(k):
            out[k] = entry[k]
    return out


def resolve_parties(groups, pool, index):
    out = []
    for g in groups or []:
        if not isinstance(g, dict) or not g.get("id"):
            continue
        raw = g.get("members", []) or []
        members = []
        for t in raw:
            key = t if isinstance(t, str) else str(t)
            code = index.get(key) or index.get(key.lower())
            if code in pool:
                members.append(_brief(pool[code]))
        party = {"id": g["id"], "name": g.get("name", g["id"]), "members": members}
        if g.get("scene"):
            party["scene"] = g["scene"]
        if not raw:
            party["open_cast"] = True
        out.append(party)
    return out


def main():
    ap = argparse.ArgumentParser(description="Resolve forge personas and parties.")
    ap.add_argument("--project-root", required=True)
    ap.add_argument("--skill", required=True, help="Path to the bmad-forge-idea skill dir")
    args = ap.parse_args()

    project_root = Path(args.project_root).resolve()
    skill_root = Path(args.skill).resolve()

    agents, guests, roster_groups, agents_ok = load_roster(project_root, skill_root)

    party_skill = find_party_skill(project_root, skill_root)
    if party_skill is not None:
        workflow = load_party_workflow(project_root, party_skill)
    else:
        workflow = load_party_overrides(project_root)

    pool, index, installed_codes, custom_codes = build_pool(agents, workflow.get("party_members", []), guests)
    parties = resolve_parties(merge_groups(roster_groups, workflow.get("party_groups", [])), pool, index)

    _emit(
        {
            "agents": [_brief(pool[c]) for c in installed_codes],
            "members": [_brief(pool[c]) for c in custom_codes],
            "parties": parties,
            "default_party": workflow.get("default_party", "") or "",
            "party_mode_found": party_skill is not None,
            "agents_resolved": agents_ok,
        }
    )


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
