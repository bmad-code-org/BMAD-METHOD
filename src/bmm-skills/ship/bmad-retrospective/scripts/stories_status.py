# /// script
# requires-python = ">=3.10"
# dependencies = ["ruamel.yaml>=0.18"]
# ///
"""Detect and inspect BMAD spec folders for retrospective stories mode.

The CLI prints only JSON to stdout and never writes to the inspected folders.
"""

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

from ruamel.yaml import YAML


ID_RE = re.compile(r"^[A-Za-z0-9-]+$")
REVISION_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._/@{}^~:+-]*$")
STORY_STATUSES = {
    "draft",
    "ready-for-dev",
    "in-progress",
    "in-review",
    "done",
    "blocked",
}
REQUIRED_FIELDS = {"id": str, "title": str, "description": str}
OPTIONAL_FIELDS = {
    "spec_checkpoint": bool,
    "done_checkpoint": bool,
    "invoke_dev_with": str,
}


def _emit(payload, code=0):
    sys.stdout.write(json.dumps(payload))
    raise SystemExit(code)


def _error(message, code=1):
    _emit({"ok": False, "error": message}, code)


class JsonArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        _error(f"argument error: {message}", 2)


def _load_yaml(path, label):
    yaml = YAML(typ="safe")
    yaml.allow_duplicate_keys = False
    try:
        return yaml.load(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError) as exc:
        _error(f"cannot read {label} {path}: {exc}")
    except Exception as exc:  # noqa: BLE001 - normalize parser failures as JSON
        _error(f"invalid YAML in {label} {path}: {exc}")


def _require_text(entry, field, index, path):
    value = entry.get(field)
    if type(value) is not str:  # bool is an int subclass; require exact schema types
        _error(f"story entry {index} field {field!r} in {path} must be a string")
    if field == "title" and ("\n" in value or "\r" in value):
        _error(f"story entry {index} field 'title' in {path} must be one line")
    return value


def _load_inventory(path):
    data = _load_yaml(path, "story inventory")
    if not isinstance(data, list):
        _error(f"story inventory {path} must be a top-level list")
    if not data:
        _error(f"story inventory {path} must contain at least one story")

    entries = []
    ids = []
    for index, entry in enumerate(data, start=1):
        if not isinstance(entry, dict):
            _error(f"story entry {index} in {path} must be a mapping")
        if "status" in entry:
            _error(f"story entry {index} in {path} must not contain a status field")

        for field in REQUIRED_FIELDS:
            if field not in entry:
                _error(f"story entry {index} in {path} is missing required field {field!r}")
        story_id = _require_text(entry, "id", index, path)
        title = _require_text(entry, "title", index, path)
        description = _require_text(entry, "description", index, path)
        if not ID_RE.fullmatch(story_id):
            _error(
                f"story entry {index} id {story_id!r} in {path} must contain only letters, digits, and dashes"
            )
        if story_id in ids:
            _error(f"duplicate story id {story_id!r} in {path}")

        for field, expected_type in OPTIONAL_FIELDS.items():
            if field in entry and type(entry[field]) is not expected_type:
                _error(
                    f"story entry {index} field {field!r} in {path} must be a {expected_type.__name__}"
                )

        ids.append(story_id)
        entries.append({"id": story_id, "title": title, "description": description})

    for left in ids:
        for right in ids:
            if left != right and right.startswith(f"{left}-"):
                _error(f"story ids {left!r} and {right!r} in {path} are not prefix-free")
    return entries


def _load_frontmatter(path):
    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        _error(f"cannot read story artifact {path}: {exc}")

    lines = content.splitlines()
    if not lines or lines[0] != "---":
        _error(f"story artifact {path} must start with YAML frontmatter")
    try:
        end = lines.index("---", 1)
    except ValueError:
        _error(f"story artifact {path} has unterminated YAML frontmatter")

    yaml = YAML(typ="safe")
    yaml.allow_duplicate_keys = False
    try:
        data = yaml.load("\n".join(lines[1:end]))
    except Exception as exc:  # noqa: BLE001 - normalize parser failures as JSON
        _error(f"invalid YAML frontmatter in story artifact {path}: {exc}")
    if not isinstance(data, dict):
        _error(f"story artifact {path} frontmatter must be a mapping")

    status = data.get("status")
    if type(status) is not str or not status.strip():
        _error(f"story artifact {path} frontmatter status must be a non-empty string")
    if status not in STORY_STATUSES:
        _error(
            f"story artifact {path} has unrecognized frontmatter status {status!r}"
        )

    revisions = {}
    for field in ("baseline_revision", "final_revision"):
        value = data.get(field)
        if value is not None and (type(value) is not str or not value.strip()):
            _error(f"story artifact {path} frontmatter {field} must be a non-empty string")
        if value is not None and value != "NO_VCS" and not REVISION_RE.fullmatch(value):
            _error(
                f"story artifact {path} frontmatter {field} contains an invalid revision"
            )
        revisions[field] = value
    return status, revisions


def _sha256(path):
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError as exc:
        _error(f"cannot hash source artifact {path}: {exc}")


def inspect_folder(folder):
    try:
        folder = Path(folder).expanduser().resolve()
    except (OSError, RuntimeError) as exc:
        _error(f"cannot resolve spec folder {folder}: {exc}")
    if not folder.is_dir():
        _error(f"spec folder does not exist or is not a directory: {folder}")

    spec_path = folder / "SPEC.md"
    inventory_path = folder / "stories.yaml"
    stories_dir = folder / "stories"
    if not spec_path.is_file():
        _error(f"spec folder is missing SPEC.md: {folder}")
    if not inventory_path.is_file():
        _error(f"spec folder is missing stories.yaml: {folder}")
    if not stories_dir.is_dir():
        _error(f"spec folder is missing stories directory: {folder}")
    try:
        spec_path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        _error(f"cannot read SPEC.md {spec_path}: {exc}")

    source_hashes = {
        str(spec_path): _sha256(spec_path),
        str(inventory_path): _sha256(inventory_path),
    }
    stories = []
    pending = []
    for entry in _load_inventory(inventory_path):
        try:
            matches = sorted(stories_dir.glob(f"{entry['id']}-*.md"))
        except OSError as exc:
            _error(f"cannot inspect story files for id {entry['id']!r}: {exc}")
        matches = [path for path in matches if path.is_file()]
        if len(matches) != 1:
            _error(
                f"story id {entry['id']!r} must match exactly one stories/{entry['id']}-*.md file; found {len(matches)}"
            )

        story_path = matches[0]
        status, revisions = _load_frontmatter(story_path)
        source_hashes[str(story_path)] = _sha256(story_path)
        baseline = revisions["baseline_revision"]
        final = revisions["final_revision"]
        revision_range = None
        if baseline and final and baseline != "NO_VCS" and final != "NO_VCS":
            revision_range = f"{baseline}..{final}"
        if status != "done":
            pending.append(entry["id"])
        stories.append(
            {
                **entry,
                "file": str(story_path),
                "status": status,
                "baseline_revision": baseline,
                "final_revision": final,
                "revision_range": revision_range,
            }
        )

    return {
        "ok": True,
        "mode": "stories",
        "spec_folder": str(folder),
        "spec_file": str(spec_path),
        "inventory_file": str(inventory_path),
        "retrospective_file": str(folder / "RETROSPECTIVE.md"),
        "story_count": len(stories),
        "stories": stories,
        "pending_stories": pending,
        "complete": not pending,
        "source_hashes": source_hashes,
    }


def detect_candidates(roots):
    candidates = set()
    for raw_root in roots:
        root = Path(raw_root).expanduser().resolve()
        if not root.exists():
            continue
        if not root.is_dir():
            _error(f"spec root is not a directory: {root}")
        if (root / "SPEC.md").is_file() and (root / "stories.yaml").is_file():
            candidates.add(root)
        try:
            for inventory in root.rglob("stories.yaml"):
                folder = inventory.parent
                if (folder / "SPEC.md").is_file():
                    candidates.add(folder.resolve())
        except OSError as exc:
            _error(f"cannot scan spec root {root}: {exc}")
    return sorted(str(path) for path in candidates)


def build_parser():
    parser = JsonArgumentParser(add_help=False)
    subparsers = parser.add_subparsers(dest="command", required=True)

    inspect_parser = subparsers.add_parser("inspect", add_help=False)
    inspect_parser.add_argument("--folder", required=True)

    detect_parser = subparsers.add_parser("detect", add_help=False)
    detect_parser.add_argument("--root", action="append", required=True)
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    if args.command == "inspect":
        _emit(inspect_folder(args.folder))
    candidates = detect_candidates(args.root)
    _emit(
        {
            "ok": True,
            "mode": "stories",
            "candidate_count": len(candidates),
            "candidates": candidates,
        }
    )


if __name__ == "__main__":
    main()
