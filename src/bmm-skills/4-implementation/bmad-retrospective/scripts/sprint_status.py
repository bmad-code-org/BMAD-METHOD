#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["ruamel.yaml>=0.18"]
# ///
"""Detect the current retrospective epic and surgically update sprint-status.yaml.

Prints ONLY JSON to stdout. Errors are emitted as JSON to stdout with a non-zero
exit code. The ``update`` subcommand round-trips the YAML to preserve all comments
and formatting, and restores the original file bytes on any validation failure.
"""

import argparse
import json
import re
import sys
from datetime import datetime

from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import DoubleQuotedScalarString

STORY_RE = re.compile(r"^(\d+)-\d+-")


def _load_yaml(path):
    yaml = YAML(typ="rt")
    yaml.preserve_quotes = True
    with open(path, "r", encoding="utf-8") as fh:
        data = yaml.load(fh)
    return yaml, data


def _emit(obj, code=0):
    sys.stdout.write(json.dumps(obj))
    sys.exit(code)


def cmd_detect_epic(args):
    try:
        _, data = _load_yaml(args.file)
    except FileNotFoundError as exc:
        _emit({"ok": False, "error": str(exc)}, 1)
    except Exception as exc:  # noqa: BLE001 - report any parse error as JSON
        _emit({"ok": False, "error": str(exc)}, 1)

    dev = (data or {}).get("development_status") or {}
    done_stories = []
    max_epic = None
    for key, value in dev.items():
        m = STORY_RE.match(str(key))
        if m and value == "done":
            done_stories.append(key)
            epic_num = int(m.group(1))
            if max_epic is None or epic_num > max_epic:
                max_epic = epic_num

    if max_epic is None:
        _emit(
            {
                "epic": None,
                "done_stories": done_stories,
                "retro_key": None,
                "retro_status": None,
            }
        )

    retro_key = f"epic-{max_epic}-retrospective"
    retro_status = dev.get(retro_key)
    _emit(
        {
            "epic": max_epic,
            "done_stories": done_stories,
            "retro_key": retro_key,
            "retro_status": retro_status,
        }
    )


def cmd_update(args):
    # 1. Keep original bytes for restore-on-failure.
    try:
        with open(args.file, "rb") as fh:
            original_bytes = fh.read()
    except FileNotFoundError as exc:
        _emit({"ok": False, "error": str(exc)}, 1)

    original_text = original_bytes.decode("utf-8")

    # Capture top-of-file comment lines (leading '#' block) from the original.
    original_comment_lines = []
    for line in original_text.splitlines():
        if line.lstrip().startswith("#"):
            original_comment_lines.append(line)
        elif line.strip() == "":
            continue
        else:
            break

    try:
        yaml, data = _load_yaml(args.file)
    except Exception as exc:  # noqa: BLE001
        _emit({"ok": False, "error": str(exc)}, 1)

    if data is None:
        _emit({"ok": False, "error": "empty or invalid YAML document"}, 1)

    epic = args.epic
    retro_key = f"epic-{epic}-retrospective"

    dev = data.get("development_status")
    if dev is None:
        dev = {}
        data["development_status"] = dev

    retro_key_found = False
    retro_status_before = None
    retro_status_after = None

    # 2. Optionally set the retrospective status to done (only if key exists).
    if args.set_retro_done:
        if retro_key in dev:
            retro_key_found = True
            retro_status_before = dev[retro_key]
            dev[retro_key] = "done"
            retro_status_after = "done"

    # 3. Optionally append action items.
    items_added = 0
    original_action_len = 0
    if data.get("action_items") is not None:
        original_action_len = len(data.get("action_items"))

    if args.add_action:
        try:
            actions = json.loads(args.add_action)
        except json.JSONDecodeError as exc:
            _emit({"ok": False, "error": f"invalid --add-action JSON: {exc}"}, 1)
        if not isinstance(actions, list):
            _emit({"ok": False, "error": "--add-action must be a JSON array"}, 1)

        seq = data.get("action_items")
        if seq is None:
            seq = []
            data["action_items"] = seq

        for item in actions:
            if not isinstance(item, dict):
                _emit(
                    {"ok": False, "error": "each --add-action item must be an object"},
                    1,
                )
            entry = {
                "epic": int(epic),
                "action": DoubleQuotedScalarString(str(item.get("action", ""))),
                "owner": DoubleQuotedScalarString(str(item.get("owner", ""))),
                "status": "open",
            }
            seq.append(entry)
            items_added += 1

    # 4. Update last_updated.
    if args.date:
        last_updated = args.date
    else:
        last_updated = datetime.now().strftime("%m-%d-%Y %H:%M")
    data["last_updated"] = last_updated

    # 5. Dump and write.
    try:
        with open(args.file, "w", encoding="utf-8") as fh:
            yaml.dump(data, fh)
    except Exception as exc:  # noqa: BLE001
        _restore(args.file, original_bytes)
        _emit({"ok": False, "error": f"write failed: {exc}"}, 1)

    # 6. Validate the written file; restore on any failure.
    def _fail(msg):
        _restore(args.file, original_bytes)
        _emit({"ok": False, "error": msg}, 1)

    try:
        _, reloaded = _load_yaml(args.file)
    except Exception as exc:  # noqa: BLE001
        _fail(f"re-parse failed after write: {exc}")

    if reloaded is None:
        _fail("re-parse produced empty document after write")

    rdev = reloaded.get("development_status") or {}
    if args.set_retro_done and retro_key_found:
        if rdev.get(retro_key) != "done":
            _fail(f"validation: {retro_key} not set to done after write")

    new_action_len = 0
    if reloaded.get("action_items") is not None:
        new_action_len = len(reloaded.get("action_items"))
    if new_action_len != original_action_len + items_added:
        _fail(
            "validation: action_items length mismatch "
            f"(expected {original_action_len + items_added}, got {new_action_len})"
        )

    with open(args.file, "r", encoding="utf-8") as fh:
        new_text = fh.read()
    for cline in original_comment_lines:
        if cline not in new_text:
            _fail(f"validation: comment line lost after write: {cline!r}")

    _emit(
        {
            "ok": True,
            "retro_key_found": retro_key_found,
            "retro_status_before": retro_status_before,
            "retro_status_after": retro_status_after,
            "action_items_added": items_added,
            "last_updated": last_updated,
        }
    )


def _restore(path, original_bytes):
    try:
        with open(path, "wb") as fh:
            fh.write(original_bytes)
    except Exception:  # noqa: BLE001 - best-effort restore
        pass


def build_parser():
    parser = argparse.ArgumentParser(
        description=(
            "Detect the current retrospective epic and surgically update "
            "sprint-status.yaml while preserving comments and formatting."
        )
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_detect = sub.add_parser(
        "detect-epic",
        help="Find the highest epic with a done story and its retrospective status.",
    )
    p_detect.add_argument("--file", required=True, help="Path to sprint-status.yaml")
    p_detect.set_defaults(func=cmd_detect_epic)

    p_update = sub.add_parser(
        "update",
        help="Surgically update retro status and/or action items.",
    )
    p_update.add_argument("--file", required=True, help="Path to sprint-status.yaml")
    p_update.add_argument("--epic", required=True, type=int, help="Epic number")
    p_update.add_argument(
        "--set-retro-done",
        action="store_true",
        help="Set epic-<N>-retrospective to done if the key exists.",
    )
    p_update.add_argument(
        "--add-action",
        help='JSON array of {"action":str,"owner":str} to append.',
    )
    p_update.add_argument(
        "--date",
        help='Value for last_updated (default: now as "MM-DD-YYYY HH:MM").',
    )
    p_update.set_defaults(func=cmd_update)

    return parser


def main(argv=None):
    parser = build_parser()
    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
