# /// script
# requires-python = ">=3.10"
# dependencies = ["ruamel.yaml>=0.18"]
# ///
"""Parse epic files and deterministically generate or refresh sprint-status.yaml.

Prints ONLY JSON to stdout. Errors are emitted as JSON to stdout with a non-zero
exit code. Writes are atomic (temp file + ``os.replace``) and the original file
bytes are restored if post-write validation fails.

Subcommands:
  generate  Parse epics, merge with any existing status file, write the result.
  check     Parse epics and report drift against an existing status file. No writes.

The LLM decides *which* files are epics (discovery is judgment); this script owns
everything after that decision: parsing, key derivation, ordering, status
preservation, story-file detection, action-item carry-over, and validation.
"""

import argparse
import io
import json
import os
import re
import sys
import tempfile
from pathlib import Path

from ruamel.yaml import YAML
from ruamel.yaml.comments import CommentedMap

EPIC_RE = re.compile(r"^#{1,3}\s*Epic\s+(\d+)\s*:?\s*(.*?)\s*#*\s*$", re.IGNORECASE)
STORY_RE = re.compile(
    r"^#{2,4}\s*Story\s+(\d+)\.(\d+[a-z]?)\s*:?\s*(.*?)\s*#*\s*$", re.IGNORECASE
)
# Heading lines that mention Epic/Story but failed the strict patterns above.
SUSPECT_RE = re.compile(r"^#{1,4}\s.*\b(?:epic|story)\b", re.IGNORECASE)

STORY_RANK = {"backlog": 0, "ready-for-dev": 1, "in-progress": 2, "review": 3, "done": 4}
EPIC_RANK = {"backlog": 0, "in-progress": 1, "done": 2}
RETRO_RANK = {"optional": 0, "done": 1}

HEADER_COMMENT = """\
STATUS DEFINITIONS:
==================
Epic Status:
  - backlog: Epic not yet started
  - in-progress: Epic actively being worked on
  - done: All stories in epic completed

Story Status:
  - backlog: Story only exists in epic file
  - ready-for-dev: Story file created, ready for development
  - in-progress: Developer actively working on implementation
  - review: Implementation complete, ready for review
  - done: Story completed

Retrospective Status:
  - optional: Can be completed but not required
  - done: Retrospective has been completed

Action Item Status:
  - open: Committed during a retrospective, not yet addressed
  - in-progress: Actively being worked on
  - done: Completed

WORKFLOW NOTES:
===============
- Epic transitions to 'in-progress' automatically when its first story starts (via build's sprint sync)
- Stories can be worked in parallel if team capacity allows
- Developer typically creates the next story after the previous one is 'done' to incorporate learnings
- Dev moves story to 'review', then runs code-review (fresh context, different LLM recommended)
- Retrospective appends its action items to action_items; sprint-status surfaces open ones
"""


def _fail(message, **extra):
    print(json.dumps({"ok": False, "error": message, **extra}))
    sys.exit(1)


def _slug(text):
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "untitled"


def parse_epics(paths):
    """Return (entries, warnings). Entries are (key, kind, epic_num) in file order."""
    epics = {}  # epic_num -> [story keys in order]
    warnings = []
    for path in paths:
        try:
            lines = Path(path).read_text(encoding="utf-8").splitlines()
        except OSError as exc:
            _fail(f"cannot read epic file {path}: {exc}")
        for lineno, line in enumerate(lines, 1):
            epic_m = EPIC_RE.match(line)
            if epic_m:
                epics.setdefault(int(epic_m.group(1)), [])
                continue
            story_m = STORY_RE.match(line)
            if story_m:
                epic_num = int(story_m.group(1))
                story_num = story_m.group(2).replace(".", "-")
                key = f"{epic_num}-{story_num}-{_slug(story_m.group(3))}"
                stories = epics.setdefault(epic_num, [])
                if key in stories:
                    warnings.append(f"duplicate story heading '{key}' at {path}:{lineno}")
                else:
                    stories.append(key)
                continue
            if SUSPECT_RE.match(line):
                warnings.append(f"unparsed Epic/Story-like heading at {path}:{lineno}: {line.strip()}")
    entries = []
    for epic_num in sorted(epics):
        entries.append((f"epic-{epic_num}", "epic", epic_num))
        for story_key in epics[epic_num]:
            entries.append((story_key, "story", epic_num))
        entries.append((f"epic-{epic_num}-retrospective", "retro", epic_num))
    return entries, warnings


def _load_existing(path):
    yaml = YAML()
    yaml.preserve_quotes = True
    if not Path(path).exists():
        return yaml, None
    try:
        with io.open(path, "r", encoding="utf-8") as fh:
            return yaml, yaml.load(fh)
    except Exception as exc:
        _fail(f"existing status file is not valid YAML: {exc}", status_file=str(path))


def _merge_status(kind, computed, existing, key, warnings):
    """Return the higher-ranked of computed/existing; never downgrade."""
    rank = {"epic": EPIC_RANK, "story": STORY_RANK, "retro": RETRO_RANK}[kind]
    if existing is None:
        return computed
    if existing not in rank:
        warnings.append(f"illegal status '{existing}' on '{key}' replaced with '{computed}'")
        return computed
    return existing if rank[existing] >= rank[computed] else computed


def build_status(entries, existing_data, stories_dir, warnings):
    """Return (development_status CommentedMap, merge report dict)."""
    existing_status = {}
    if existing_data is not None:
        existing_status = dict(existing_data.get("development_status") or {})
    report = {"new_entries": [], "preserved": 0, "upgraded_from_disk": [], "dropped_orphans": []}
    dev = CommentedMap()
    first_epic = True
    for key, kind, _epic_num in entries:
        default = {"epic": "backlog", "story": "backlog", "retro": "optional"}[kind]
        computed = default
        if kind == "story" and stories_dir and (Path(stories_dir) / f"{key}.md").exists():
            computed = "ready-for-dev"
        merged = _merge_status(kind, computed, existing_status.get(key), key, warnings)
        if key not in existing_status:
            report["new_entries"].append(key)
        elif merged == existing_status.get(key):
            report["preserved"] += 1
        if kind == "story" and computed == "ready-for-dev" and existing_status.get(key) in (None, "backlog"):
            report["upgraded_from_disk"].append(key)
        dev[key] = merged
        if kind == "epic" and not first_epic:
            dev.yaml_set_comment_before_after_key(key, before="\n")
        if kind == "epic":
            first_epic = False
    computed_keys = {key for key, _, _ in entries}
    report["dropped_orphans"] = [k for k in existing_status if k not in computed_keys]
    return dev, report


def _counts(dev):
    counts = {}
    for value in dev.values():
        counts[value] = counts.get(value, 0) + 1
    return counts


def _atomic_write(yaml, doc, path):
    directory = os.path.dirname(os.path.abspath(path)) or "."
    os.makedirs(directory, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=directory, suffix=".tmp")
    try:
        with io.open(fd, "w", encoding="utf-8") as fh:
            yaml.dump(doc, fh)
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def cmd_generate(args):
    entries, warnings = parse_epics(args.epic_file)
    if not entries:
        _fail("no epics or stories parsed from the given epic files", epic_files=args.epic_file)
    yaml, existing = _load_existing(args.status_file)
    original_bytes = Path(args.status_file).read_bytes() if Path(args.status_file).exists() else None

    dev, report = build_status(entries, existing, args.stories_dir, warnings)

    doc = CommentedMap()
    generated = args.date
    if existing is not None and existing.get("generated"):
        generated = existing["generated"]
    doc["generated"] = generated
    doc["last_updated"] = args.date
    doc["project"] = args.project
    doc["project_key"] = args.project_key
    doc["tracking_system"] = args.tracking_system
    doc["story_location"] = args.story_location or args.stories_dir
    doc["development_status"] = dev
    doc.yaml_set_start_comment(HEADER_COMMENT)
    if existing is not None and existing.get("action_items") is not None:
        doc["action_items"] = existing["action_items"]
        doc.yaml_set_comment_before_after_key(
            "action_items",
            before="\nAction items committed during retrospectives (section created by the retrospective workflow)",
        )

    result = {
        "ok": True,
        "action": "generate",
        "status_file": str(args.status_file),
        "dry_run": bool(args.dry_run),
        "epics": sum(1 for _, kind, _ in entries if kind == "epic"),
        "stories": sum(1 for _, kind, _ in entries if kind == "story"),
        "counts": _counts(dev),
        "generated": doc["generated"],
        "last_updated": doc["last_updated"],
        "warnings": warnings,
        **report,
    }

    if args.dry_run:
        print(json.dumps(result))
        return

    _atomic_write(yaml, doc, args.status_file)
    try:
        verify_yaml = YAML()
        with io.open(args.status_file, "r", encoding="utf-8") as fh:
            reread = verify_yaml.load(fh)
        assert dict(reread["development_status"]) == dict(dev), "development_status mismatch after write"
        for field in ("generated", "last_updated", "project"):
            assert reread[field] == doc[field], f"{field} mismatch after write"
    except BaseException as exc:
        if original_bytes is not None:
            Path(args.status_file).write_bytes(original_bytes)
        else:
            Path(args.status_file).unlink(missing_ok=True)
        _fail(f"validation failed after write, original restored: {exc}", restored=True)
    print(json.dumps(result))


def cmd_check(args):
    entries, warnings = parse_epics(args.epic_file)
    _, existing = _load_existing(args.status_file)
    if existing is None:
        print(json.dumps({
            "ok": True, "action": "check", "in_sync": False,
            "status_file": str(args.status_file), "error": "status file does not exist",
            "missing": [key for key, _, _ in entries], "orphans": [], "illegal": [],
            "warnings": warnings,
        }))
        return
    existing_status = dict(existing.get("development_status") or {})
    computed_keys = [key for key, _, _ in entries]
    kinds = {key: kind for key, kind, _ in entries}
    missing = [k for k in computed_keys if k not in existing_status]
    orphans = [k for k in existing_status if k not in set(computed_keys)]
    illegal = []
    for key, value in existing_status.items():
        rank = {"epic": EPIC_RANK, "story": STORY_RANK, "retro": RETRO_RANK}.get(kinds.get(key))
        if rank is not None and value not in rank:
            illegal.append({"key": key, "status": value})
    print(json.dumps({
        "ok": True, "action": "check",
        "in_sync": not missing and not orphans and not illegal,
        "status_file": str(args.status_file),
        "missing": missing, "orphans": orphans, "illegal": illegal,
        "warnings": warnings,
    }))


def build_parser():
    parser = argparse.ArgumentParser(prog="sprint_plan.py", description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--epic-file", action="append", required=True,
                        help="Path to an epic markdown file (repeat per file)")
    common.add_argument("--status-file", required=True, help="Path to sprint-status.yaml")

    gen = sub.add_parser("generate", parents=[common], help="Generate or refresh the status file")
    gen.add_argument("--stories-dir", required=True, help="Directory holding story .md files")
    gen.add_argument("--project", required=True, help="Project name")
    gen.add_argument("--date", required=True, help="Timestamp, e.g. '08-01-2026 14:30'")
    gen.add_argument("--project-key", default="NOKEY")
    gen.add_argument("--tracking-system", default="file-system")
    gen.add_argument("--story-location", default=None,
                     help="Display value for story_location (defaults to --stories-dir)")
    gen.add_argument("--dry-run", action="store_true", help="Report without writing")
    gen.set_defaults(func=cmd_generate)

    chk = sub.add_parser("check", parents=[common], help="Report drift; never writes")
    chk.set_defaults(func=cmd_check)
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
