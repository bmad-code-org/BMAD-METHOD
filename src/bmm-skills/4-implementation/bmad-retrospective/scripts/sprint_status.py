#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["ruamel.yaml>=0.18"]
# ///
"""Detect the current retrospective epic and surgically update sprint-status.yaml.

Prints ONLY JSON to stdout. Errors are emitted as JSON to stdout with a non-zero
exit code. The ``update`` subcommand round-trips the YAML to preserve all comments
and formatting, writes atomically (temp file + ``os.replace``), and restores the
original file bytes on any validation failure.
"""

import argparse
import hashlib
import io
import json
import os
import re
import stat
import sys
import tempfile
from collections import Counter
from collections.abc import Mapping
from datetime import datetime

from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import DoubleQuotedScalarString

STORY_RE = re.compile(r"^(\d+)-\d+[a-z]?-")  # trailing [a-z]? matches split-story keys like 2-6a-...
DATE_FORMAT = "%m-%d-%Y %H:%M"


def _load_yaml(path):
    yaml = YAML(typ="rt")
    yaml.preserve_quotes = True
    # Pin the emitter to the indentation the sprint-status template ships with.
    # Without this, ruamel re-dumps block sequences at its own default offset and
    # every write silently de-indents pre-existing, untouched action_items.
    yaml.indent(mapping=2, sequence=4, offset=2)
    with open(path, "r", encoding="utf-8") as fh:
        data = yaml.load(fh)
    return yaml, data


def _emit(obj, code=0):
    sys.stdout.write(json.dumps(obj))
    sys.exit(code)


def _emit_error(message, code=1, restored=None):
    """Emit a failure on the JSON-only contract.

    ``restored`` is included only when the caller can speak to the state of the
    target file; ``retro-document.md`` teaches callers to read it, so a write-path
    failure must never omit it and a read-only subcommand must never invent it.
    """
    payload = {"ok": False, "error": message}
    if restored is not None:
        payload["restored"] = restored
    _emit(payload, code)


class JsonArgumentParser(argparse.ArgumentParser):
    """Emit argparse failures on the JSON-only stdout contract, not usage text."""

    def error(self, message):
        _emit({"ok": False, "error": f"argument error: {message}"}, 2)


def _slugify(text, maxlen=40):
    text = str(text)
    # Unicode-aware: a non-Latin action must keep its own characters in the id
    # rather than collapsing to a single placeholder shared by every item.
    slug = re.sub(r"[^\w]+", "-", text.lower(), flags=re.UNICODE).strip("-")
    slug = slug[:maxlen].strip("-")
    if not slug:
        # Nothing sluggable (punctuation/emoji only): a short content hash keeps
        # the id deterministic and distinct instead of a bare "item".
        slug = hashlib.sha256(text.encode("utf-8")).hexdigest()[:8]
    return slug


def _comment_counts(text):
    """Multiset of the comment lines in ``text``, indentation included.

    Keyed by the whole line so that a re-indented comment counts as a loss too:
    the guarantee callers are given is comments *and formatting*, and ruamel
    re-emits comments at their original column even when the block around them
    is re-indented, so an exact key costs nothing in practice.
    """
    return Counter(
        line for line in text.splitlines() if line.lstrip().startswith("#")
    )


def _load_document(path, restored=None):
    """Load and shape-check the document, reporting every failure as JSON.

    Returns ``(yaml, data, dev)``. ``dev`` is the live ``development_status``
    mapping when the key exists, otherwise a detached empty mapping -- the key is
    never inserted into the document as a side effect of loading.
    """
    try:
        yaml, data = _load_yaml(path)
    except UnicodeDecodeError as exc:
        _emit_error(f"{path} is not valid UTF-8: {exc}", 1, restored)
    except OSError as exc:
        _emit_error(str(exc), 1, restored)
    except Exception as exc:  # noqa: BLE001 - report any parse error as JSON
        _emit_error(str(exc), 1, restored)

    if data is not None and not isinstance(data, Mapping):
        _emit_error("root document is not a mapping", 1, restored)

    dev = data.get("development_status") if data is not None else None
    if dev is None:
        dev = {}
    elif not isinstance(dev, Mapping):
        _emit_error("development_status is not a mapping", 1, restored)

    return yaml, data, dev


def _dump_bytes(yaml, data):
    """Serialize the document to bytes before any file is touched, so a dump
    failure cannot leave a partial file anywhere."""
    buf = io.BytesIO()
    yaml.dump(data, buf)
    return buf.getvalue()


def _atomic_write(path, payload, mode=None):
    """Replace ``path``'s contents with ``payload`` atomically.

    The bytes land in a temp file alongside the target, are fsynced, take the
    target's permission bits (mkstemp creates 0600, which would silently narrow
    the file), and only then rename over it -- so a kill or a full disk leaves
    the original file intact rather than truncated. ``path`` is resolved through
    symlinks first: renaming onto a symlink would detach the link and leave the
    real file stale while reporting success. The directory is fsynced too, so
    the rename survives a power loss and not just the bytes.
    """
    path = os.path.realpath(path)
    directory = os.path.dirname(path) or "."
    fd, tmp_path = tempfile.mkstemp(
        prefix=".sprint-status-", suffix=".tmp", dir=directory
    )
    try:
        with os.fdopen(fd, "wb") as fh:
            fh.write(payload)
            fh.flush()
            os.fsync(fh.fileno())
        if mode is not None:
            os.chmod(tmp_path, mode)
        os.replace(tmp_path, path)
        dir_fd = os.open(directory, os.O_RDONLY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except BaseException:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
        raise


def cmd_detect_epic(args):
    # detect-epic never writes, so it reports no "restored" key.
    _, _, dev = _load_document(args.file)

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
    # Every failure below happens before the write is attempted, so the file is
    # untouched and "restored": true is the honest report.
    untouched = True

    # 0. Validate the inputs before anything is mutated or written.
    if args.date is not None:
        try:
            parsed_date = datetime.strptime(args.date, DATE_FORMAT)
        except (ValueError, TypeError):
            _emit_error(
                f'invalid --date {args.date!r} (expected "MM-DD-YYYY HH:MM")',
                1,
                untouched,
            )
        # Normalize: strptime also accepts unpadded spellings like
        # "1-2-2026 9:05", and writing those through would defeat the point of
        # validating the format at all.
        last_updated = parsed_date.strftime(DATE_FORMAT)
    else:
        last_updated = datetime.now().strftime(DATE_FORMAT)

    actions = []
    if args.add_action:
        try:
            actions = json.loads(args.add_action)
        except json.JSONDecodeError as exc:
            _emit_error(f"invalid --add-action JSON: {exc}", 1, untouched)
        if not isinstance(actions, list):
            _emit_error("--add-action must be a JSON array", 1, untouched)
        for item in actions:
            if not isinstance(item, dict):
                _emit_error(
                    "each --add-action item must be an object", 1, untouched
                )
            action_value = item.get("action")
            if not isinstance(action_value, str) or not action_value.strip():
                # A JSON null/number/object would otherwise be str()'d into a
                # literal "None"/"{...}" and written as a real action item.
                _emit_error(
                    "each --add-action item must have a non-empty string action",
                    1,
                    untouched,
                )

    # 1. Keep original bytes for restore-on-failure, and the mode to write back
    #    with -- taken from the open handle so an unlink mid-run cannot leave the
    #    replacement silently narrowed to mkstemp's 0600.
    try:
        with open(args.file, "rb") as fh:
            original_bytes = fh.read()
            original_mode = stat.S_IMODE(os.fstat(fh.fileno()).st_mode)
    except OSError as exc:
        _emit_error(str(exc), 1, untouched)

    try:
        original_text = original_bytes.decode("utf-8")
    except UnicodeDecodeError as exc:
        _emit_error(f"{args.file} is not valid UTF-8: {exc}", 1, untouched)

    # Every comment line in the file, not just the leading block: the template
    # ships one above action_items, and losing it corrupts the document just the
    # same as losing the header.
    original_comments = _comment_counts(original_text)

    yaml, data, dev = _load_document(args.file, restored=untouched)

    if data is None:
        _emit_error("empty or invalid YAML document", 1, untouched)

    epic = args.epic
    retro_key = f"epic-{epic}-retrospective"

    # null distinguishes "the flag was not passed" from "the key was absent",
    # which is the only case retro-document.md assigns "false" to.
    retro_key_found = None
    retro_status_before = None
    retro_status_after = None

    # 2. Optionally set the retrospective status to done (only if key exists).
    if args.set_retro_done:
        retro_key_found = retro_key in dev
        if retro_key_found:
            retro_status_before = dev[retro_key]
            dev[retro_key] = "done"
            retro_status_after = "done"

    # 3. Optionally append action items.
    existing_actions = data.get("action_items")
    if existing_actions is not None and not isinstance(existing_actions, list):
        # A hand-corrupted file must still fail on the JSON contract, not crash.
        _emit_error("action_items in file is not a list", 1, untouched)
    items_added = 0
    original_action_len = len(existing_actions) if existing_actions is not None else 0

    if actions:
        seq = data.get("action_items")
        if seq is None:
            seq = []
            data["action_items"] = seq

        for item in actions:
            # Stable identity for orchestrator consumers: an id that lets a
            # re-run dedupe against prior items, and a ref back to the sourced
            # finding in the retro document. Both accept an explicit override.
            seq_num = len(seq) + 1
            action_text = str(item.get("action", ""))
            item_id = item.get("id") or (
                f"epic-{int(epic)}-retro-item-{seq_num}-{_slugify(action_text)}"
            )
            ref = item.get("ref") or (args.ref or "")
            entry = {
                "id": DoubleQuotedScalarString(str(item_id)),
                "epic": int(epic),
                "action": DoubleQuotedScalarString(action_text),
                "owner": DoubleQuotedScalarString(str(item.get("owner", ""))),
                "status": "open",
                "ref": DoubleQuotedScalarString(str(ref)),
            }
            seq.append(entry)
            items_added += 1

    # 4. Update last_updated.
    data["last_updated"] = last_updated

    # 5. Serialize, then swap the file atomically.
    try:
        _atomic_write(args.file, _dump_bytes(yaml, data), original_mode)
    except Exception as exc:  # noqa: BLE001
        # The target is only ever touched by the final rename, so if the write
        # raised, the original is still on disk byte-for-byte. Calling _restore
        # here would rewrite a file that was never modified -- the one write in
        # the program with nothing to gain and a truncated file to lose.
        _emit({"ok": False, "error": f"write failed: {exc}", "restored": True}, 1)

    # 6. Validate the written file; restore on any failure.
    def _fail(msg):
        restored = _restore(args.file, original_bytes, original_mode)
        _emit({"ok": False, "error": msg, "restored": restored}, 1)

    try:
        _, reloaded = _load_yaml(args.file)
    except Exception as exc:  # noqa: BLE001
        _fail(f"re-parse failed after write: {exc}")

    if reloaded is None:
        _fail("re-parse produced empty document after write")

    if not isinstance(reloaded, Mapping):
        _fail("re-parse produced a non-mapping document after write")

    rdev = reloaded.get("development_status") or {}
    if args.set_retro_done and retro_key_found:
        if not isinstance(rdev, Mapping) or rdev.get(retro_key) != "done":
            _fail(f"validation: {retro_key} not set to done after write")

    new_action_len = 0
    if reloaded.get("action_items") is not None:
        new_action_len = len(reloaded.get("action_items"))
    if new_action_len != original_action_len + items_added:
        _fail(
            "validation: action_items length mismatch "
            f"(expected {original_action_len + items_added}, got {new_action_len})"
        )

    try:
        with open(args.file, "r", encoding="utf-8") as fh:
            new_text = fh.read()
    except (OSError, UnicodeDecodeError) as exc:
        _fail(f"re-read failed after write: {exc}")

    # Loss-only: a comment may legitimately move or be added (a long quoted value
    # can wrap onto a line that begins with '#'), but none may disappear.
    lost = original_comments - _comment_counts(new_text)
    if lost:
        first = next(
            (line for line in original_text.splitlines() if line in lost), None
        )
        _fail(f"validation: comment line lost after write: {first!r}")

    _emit(
        {
            "ok": True,
            "retro_key_found": retro_key_found,
            "retro_status_before": retro_status_before,
            "retro_status_after": retro_status_after,
            "action_items_added": items_added,
            "last_updated": last_updated,
            "verdict": args.verdict,
        }
    )


def _restore(path, original_bytes, mode=None):
    """Best-effort restore of the original bytes. Returns True on success so a
    caller can surface a restore failure instead of hiding a half-written file.

    Atomic for the same reason the primary write is: a truncating rewrite that
    dies halfway destroys the very bytes it was trying to put back.
    """
    try:
        _atomic_write(path, original_bytes, mode)
        return True
    except Exception as exc:  # noqa: BLE001 - best-effort restore
        sys.stderr.write(f"restore failed: {exc}\n")
        return False


def build_parser():
    parser = JsonArgumentParser(
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
        help='JSON array of {"action":str,"owner":str,"id"?:str,"ref"?:str} to append.',
    )
    p_update.add_argument(
        "--ref",
        help="Reference (e.g. the retro document path) recorded on each appended action item.",
    )
    p_update.add_argument(
        "--verdict",
        help="Acceptance verdict echoed back in the JSON result for orchestrator consumers.",
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
