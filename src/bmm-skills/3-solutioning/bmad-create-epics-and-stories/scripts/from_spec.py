#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Generate a complete v7 epic-and-story tree from a structured spec, then validate.

Spec schema (JSON):
{
  "title": "...",                          # initiative name (informational)
  "intent": "...",                         # one-line intent (informational)
  "inventory": {                           # optional; written to .bmad-cache/inventory.json
    "requirements": {
      "functional":     [{"code": "FR1",  "text": "..."}],
      "non_functional": [{"code": "NFR1", "text": "..."}],
      "ux_design":      [{"code": "UX-DR1","text": "..."}]
    }
  },
  "epics": [
    {
      "nn": 1, "title": "...", "intent": "...",
      "depends_on": [],                    # epic NNs as ints or strings
      "shared_context": "...",             # optional; replaces the placeholder
      "story_sequence": "...",             # optional; replaces the placeholder
      "references": "...",                 # optional; replaces the placeholder
      "stories": [
        {
          "nn": 1, "title": "...", "type": "feature|task|bug|spike",
          "depends_on": [],                # within-epic basenames or <epic>/<basename>
          "user_story": "...",             # optional; absent for type=task
          "acceptance_criteria": ["..."],  # rendered as bullet list under ## Acceptance Criteria
          "technical_notes": "...",        # optional
          "coverage": {"AC1": ["FR1"]}     # AC -> codes
        }
      ]
    }
  ]
}

The script invokes init_epic.py / init_story.py for every file and then patches
each file's body with the optional fields the spec provides. Finally, it runs
validate_initiative.py strict (with --inventory if a spec inventory was present)
and emits a JSON envelope summarizing the run.

Output (stdout, JSON):
{
  "initiative_store": "<abs>",
  "epics_created": ["01-foo", "02-bar"],
  "stories_created": ["01-foo/01-baz", ...],
  "inventory_path": "<abs>" | null,
  "validation": {"findings": [...], "summary": {...}},
  "exit_code": 0
}
Exit code mirrors the validation: 0 if no errors, 1 otherwise. Spec errors exit 1.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
INIT_EPIC = SCRIPTS / "init_epic.py"
INIT_STORY = SCRIPTS / "init_story.py"
VALIDATE = SCRIPTS / "validate_initiative.py"


def _load_spec(path: Path) -> dict:
    if not path.is_file():
        raise SystemExit(f"spec not found: {path}")
    text = path.read_text(encoding="utf-8")
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"could not parse spec as JSON: {exc}") from exc


def _run(cmd: list[str]) -> tuple[int, str, str]:
    p = subprocess.run(cmd, capture_output=True, text=True, check=False)
    return p.returncode, p.stdout, p.stderr


def _replace_section(body: str, heading: str, replacement: str) -> str:
    pattern = re.compile(rf"^(##\s+{re.escape(heading)}\s*\n)(.*?)(?=^##\s+|\Z)", re.MULTILINE | re.DOTALL)
    if not pattern.search(body):
        return body
    return pattern.sub(lambda m: m.group(1) + replacement.rstrip() + "\n\n", body)


def _replace_user_story(body: str, user_story: str | None) -> str:
    if user_story is None:
        return re.sub(r"\n*<!-- USER_STORY_START -->.*?<!-- USER_STORY_END -->\n*", "\n\n", body, flags=re.DOTALL)
    block = f"\n<!-- USER_STORY_START -->\n{user_story.strip()}\n<!-- USER_STORY_END -->\n"
    return re.sub(r"\n*<!-- USER_STORY_START -->.*?<!-- USER_STORY_END -->\n*", block, body, flags=re.DOTALL)


def _render_acs(acs: list[str]) -> str:
    return "\n".join(f"- {ac.strip()}" for ac in acs if ac.strip())


def _render_coverage(coverage: dict[str, list[str]] | None) -> str:
    if not coverage:
        return ""
    return "\n".join(f"- {ac.strip()}: {', '.join(coverage[ac])}" for ac in sorted(coverage.keys()))


def _patch_epic_md(epic_md: Path, epic_spec: dict) -> None:
    body = epic_md.read_text(encoding="utf-8")
    if "shared_context" in epic_spec and epic_spec["shared_context"]:
        body = _replace_section(body, "Shared Context", epic_spec["shared_context"])
    if "intent" in epic_spec and epic_spec["intent"]:
        body = _replace_section(body, "Goal", epic_spec["intent"])
    if "story_sequence" in epic_spec and epic_spec["story_sequence"]:
        body = _replace_section(body, "Story Sequence", epic_spec["story_sequence"])
    if "references" in epic_spec and epic_spec["references"]:
        body = _replace_section(body, "References", epic_spec["references"])
    epic_md.write_text(body, encoding="utf-8")


def _patch_story_file(story_path: Path, story_spec: dict) -> None:
    body = story_path.read_text(encoding="utf-8")
    body = _replace_user_story(body, story_spec.get("user_story"))
    if story_spec.get("acceptance_criteria"):
        body = _replace_section(body, "Acceptance Criteria", _render_acs(story_spec["acceptance_criteria"]))
    if story_spec.get("technical_notes"):
        body = _replace_section(body, "Technical Notes", story_spec["technical_notes"])
    cov = _render_coverage(story_spec.get("coverage"))
    if cov:
        body = _replace_section(body, "Coverage", cov)
    story_path.write_text(body, encoding="utf-8")


def _validate_spec(spec: dict) -> list[str]:
    errs: list[str] = []
    if not isinstance(spec.get("epics"), list) or not spec["epics"]:
        errs.append("spec must contain a non-empty `epics` list")
        return errs
    for i, epic in enumerate(spec["epics"]):
        for k in ("nn", "title"):
            if k not in epic:
                errs.append(f"epic[{i}] missing `{k}`")
        for j, story in enumerate(epic.get("stories", []) or []):
            for k in ("nn", "title", "type"):
                if k not in story:
                    errs.append(f"epic[{i}].stories[{j}] missing `{k}`")
            if story.get("type") not in {"feature", "task", "bug", "spike"}:
                errs.append(f"epic[{i}].stories[{j}].type invalid: {story.get('type')!r}")

    inv = spec.get("inventory")
    if inv is not None:
        if not isinstance(inv, dict):
            errs.append("inventory must be an object")
        else:
            reqs = inv.get("requirements")
            if reqs is not None:
                if not isinstance(reqs, dict):
                    errs.append("inventory.requirements must be an object keyed by category")
                else:
                    for cat, entries in reqs.items():
                        if not isinstance(entries, list):
                            errs.append(f"inventory.requirements.{cat} must be a list")
                            continue
                        for k_idx, entry in enumerate(entries):
                            if not isinstance(entry, dict):
                                errs.append(f"inventory.requirements.{cat}[{k_idx}] must be an object")
                            elif "code" not in entry:
                                errs.append(f"inventory.requirements.{cat}[{k_idx}] missing `code`")
    return errs


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--initiative-store", required=True, type=Path)
    ap.add_argument("--spec", required=True, type=Path, help="Path to JSON spec")
    ap.add_argument("--coverage-strict", action="store_true", help="Pass --coverage-strict to validation when an inventory is present")
    args = ap.parse_args()

    spec = _load_spec(args.spec)
    errs = _validate_spec(spec)
    if errs:
        print(json.dumps({"error": "invalid spec", "details": errs}))
        return 1

    epics_created: list[str] = []
    stories_created: list[str] = []

    for epic_spec in spec["epics"]:
        deps = epic_spec.get("depends_on", []) or []
        deps_str = ",".join(str(d) for d in deps)
        rc, out, err = _run([
            sys.executable, str(INIT_EPIC),
            "--initiative-store", str(args.initiative_store),
            "--epic-nn", str(epic_spec["nn"]),
            "--title", str(epic_spec["title"]),
            "--depends-on", deps_str,
        ])
        if rc != 0:
            print(json.dumps({"error": "init_epic.py failed", "details": err.strip(), "epic": epic_spec.get("title")}))
            return 1
        epic = json.loads(out)
        epics_created.append(epic["epic"])
        epic_md = Path(epic["path"])
        _patch_epic_md(epic_md, epic_spec)

        for story_spec in epic_spec.get("stories", []) or []:
            sdeps = story_spec.get("depends_on", []) or []
            sdeps_str = ",".join(str(d) for d in sdeps)
            rc, out, err = _run([
                sys.executable, str(INIT_STORY),
                "--initiative-store", str(args.initiative_store),
                "--epic", epic["epic"],
                "--story-nn", str(story_spec["nn"]),
                "--title", str(story_spec["title"]),
                "--type", str(story_spec["type"]),
                "--depends-on", sdeps_str,
            ])
            if rc != 0:
                print(json.dumps({"error": "init_story.py failed", "details": err.strip(), "epic": epic["epic"], "story": story_spec.get("title")}))
                return 1
            story = json.loads(out)
            stories_created.append(f"{epic['epic']}/{story['story']}")
            _patch_story_file(Path(story["path"]), story_spec)

    inventory_path: Path | None = None
    if "inventory" in spec and spec["inventory"]:
        cache_dir = args.initiative_store / ".bmad-cache"
        cache_dir.mkdir(parents=True, exist_ok=True)
        inventory_path = cache_dir / "inventory.json"
        inventory = dict(spec["inventory"])
        inventory.setdefault("title", spec.get("title"))
        inventory.setdefault("intent", spec.get("intent"))
        inventory["source"] = "from-spec"
        inventory_path.write_text(json.dumps(inventory, indent=2), encoding="utf-8")

    validate_cmd = [sys.executable, str(VALIDATE), "--initiative-store", str(args.initiative_store)]
    if inventory_path is not None:
        validate_cmd.extend(["--inventory", str(inventory_path)])
        if args.coverage_strict:
            validate_cmd.append("--coverage-strict")
    rc, out, err = _run(validate_cmd)
    try:
        validation = json.loads(out)
    except json.JSONDecodeError:
        validation = {"error": "could not parse validator output", "stdout": out, "stderr": err}

    envelope = {
        "initiative_store": str(args.initiative_store),
        "epics_created": epics_created,
        "stories_created": stories_created,
        "inventory_path": str(inventory_path) if inventory_path else None,
        "validation": validation,
        "exit_code": rc,
    }
    print(json.dumps(envelope))
    return rc


if __name__ == "__main__":
    sys.exit(main())
