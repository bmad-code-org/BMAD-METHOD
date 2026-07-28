"""Corruption-critical tests for sprint-status.py.

Each test runs the script as a subprocess via ``uv run`` against a temp copy of
an inline fixture, then re-reads the file to assert comments and formatting
survive and punctuation-heavy action values round-trip intact.
"""

import importlib.util
import json
import os
import re
import stat
import subprocess
import sys
from pathlib import Path

import pytest
from ruamel.yaml import YAML

SCRIPT = Path(__file__).resolve().parents[1] / "sprint_status.py"
TEMPLATE = (
    Path(__file__).resolve().parents[3]
    / "bmad-sprint-planning"
    / "sprint-status-template.yaml"
)

FIXTURE = """\
# Sprint Status Tracking
# STATUS DEFINITIONS:
#   backlog        - not yet started
#   ready-for-dev  - ready to be implemented
#   done           - completed
generated: "01-01-2026 09:00"
last_updated: "01-01-2026 09:00"
project: "Demo Project"
project_key: "DEMO"
tracking_system: "file"
story_location: "docs/stories"
development_status:
  epic-1: backlog
  1-1-user-authentication: done
  1-2-account-management: done
  epic-1-retrospective: optional
  epic-2: backlog
  2-1-dashboard: backlog
"""


def _run(args):
    cmd = ["uv", "run", str(SCRIPT), *args]
    # LC_ALL=C keeps os.strerror text stable so error-string assertions do not
    # depend on the developer's locale.
    return subprocess.run(
        cmd, capture_output=True, text=True, env={**os.environ, "LC_ALL": "C"}
    )


def _module():
    """Import the script as a module, for the few properties that cannot be
    triggered through the CLI (a failure after the temp file already exists)."""
    spec = importlib.util.spec_from_file_location("sprint_status", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _write_fixture(tmp_path):
    target = tmp_path / "sprint-status.yaml"
    target.write_text(FIXTURE, encoding="utf-8")
    return target


def _load(path):
    yaml = YAML(typ="rt")
    with open(path, "r", encoding="utf-8") as fh:
        return yaml.load(fh)


def _json(proc):
    """Parse the JSON-only stdout contract, surfacing a crash instead of hiding
    it behind a JSONDecodeError."""
    assert proc.stdout, f"empty stdout; stderr was: {proc.stderr}"
    assert "Traceback" not in proc.stderr, proc.stderr
    return json.loads(proc.stdout)


def test_detect_epic(tmp_path):
    target = _write_fixture(tmp_path)
    proc = _run(["detect-epic", "--file", str(target)])
    assert proc.returncode == 0, proc.stderr
    out = json.loads(proc.stdout)
    assert out["epic"] == 1
    assert out["retro_key"] == "epic-1-retrospective"
    assert out["retro_status"] == "optional"
    assert set(out["done_stories"]) == {
        "1-1-user-authentication",
        "1-2-account-management",
    }


def test_update_sets_retro_and_appends_action(tmp_path):
    target = _write_fixture(tmp_path)
    payload = '[{"action":"Fix #42: colons: and # hashes","owner":"Amelia"}]'
    proc = _run(
        [
            "update",
            "--file",
            str(target),
            "--epic",
            "1",
            "--set-retro-done",
            "--add-action",
            payload,
        ]
    )
    assert proc.returncode == 0, proc.stderr
    out = json.loads(proc.stdout)
    assert out["ok"] is True
    assert out["retro_key_found"] is True
    assert out["retro_status_after"] == "done"
    assert out["action_items_added"] == 1

    # File must still parse cleanly (punctuation did not corrupt it).
    data = _load(target)
    assert data is not None

    # STATUS DEFINITIONS comment survived.
    raw = target.read_text(encoding="utf-8")
    assert "STATUS DEFINITIONS" in raw

    # Retro status flipped to done.
    assert data["development_status"]["epic-1-retrospective"] == "done"

    # The action value round-trips with literal '#' and ':' intact.
    action = data["action_items"][0]
    assert action["action"] == "Fix #42: colons: and # hashes"
    assert action["owner"] == "Amelia"
    assert action["epic"] == 1
    assert action["status"] == "open"


def test_detect_epic_matches_split_story_keys(tmp_path):
    # A split-story key like 2-6a-... is first-class in BMAD (an oversized story
    # split into 2-6a / 2-6b) and must not be invisible to detection — otherwise
    # an epic whose only done stories are splits is silently skipped.
    fixture = (
        "development_status:\n"
        "  1-1-first: done\n"
        "  2-6a-split-auth: done\n"
        "  epic-2-retrospective: optional\n"
    )
    target = tmp_path / "sprint-status.yaml"
    target.write_text(fixture, encoding="utf-8")
    proc = _run(["detect-epic", "--file", str(target)])
    assert proc.returncode == 0, proc.stderr
    out = json.loads(proc.stdout)
    assert out["epic"] == 2
    assert "2-6a-split-auth" in out["done_stories"]
    assert out["retro_key"] == "epic-2-retrospective"


def test_update_rejects_non_list_action_items(tmp_path):
    # A hand-corrupted action_items must fail on the JSON contract, not crash.
    fixture = (
        "development_status:\n"
        "  1-1-a: done\n"
        "  epic-1-retrospective: optional\n"
        'action_items: "oops-not-a-list"\n'
    )
    target = tmp_path / "sprint-status.yaml"
    target.write_text(fixture, encoding="utf-8")
    proc = _run(
        ["update", "--file", str(target), "--epic", "1",
         "--add-action", '[{"action":"x","owner":"y"}]']
    )
    assert proc.returncode == 1
    out = json.loads(proc.stdout)  # must be JSON, not a traceback
    assert out["ok"] is False
    assert "action_items" in out["error"]


def test_appended_items_carry_id_and_ref(tmp_path):
    target = _write_fixture(tmp_path)
    ref = "docs/stories/epic-1-retro-2026-07-21.md"
    proc = _run(
        ["update", "--file", str(target), "--epic", "1", "--set-retro-done",
         "--add-action", '[{"action":"Fix the seam","owner":"Amelia"}]',
         "--ref", ref, "--verdict", "accepted-with-open-items"]
    )
    assert proc.returncode == 0, proc.stderr
    out = json.loads(proc.stdout)
    assert out["verdict"] == "accepted-with-open-items"  # echoed, not written to a key

    item = _load(target)["action_items"][0]
    assert item["id"].startswith("epic-1-retro-item-1-")
    assert item["ref"] == ref
    # The retro key value stays "done" — verdict is not encoded into it.
    assert _load(target)["development_status"]["epic-1-retrospective"] == "done"


def test_explicit_item_id_is_preserved(tmp_path):
    target = _write_fixture(tmp_path)
    proc = _run(
        ["update", "--file", str(target), "--epic", "1",
         "--add-action", '[{"action":"a","owner":"o","id":"custom-id-7"}]']
    )
    assert proc.returncode == 0, proc.stderr
    assert _load(target)["action_items"][0]["id"] == "custom-id-7"


@pytest.mark.skipif(
    hasattr(os, "geteuid") and os.geteuid() == 0,
    reason="root bypasses file permission bits",
)
def test_write_failure_reports_restore_status(tmp_path):
    # If the write cannot happen, the caller must be told whether the original
    # was restored — a silent failure defeats the script's core guarantee.
    #
    # The write is atomic (temp file + os.replace), and os.replace needs write
    # permission on the *directory*, not on the target — a read-only target is
    # now replaceable. Making the containing directory read-only is what blocks
    # the write: mkstemp fails, while the restore write to the still-writable
    # target succeeds.
    holder = tmp_path / "holder"
    holder.mkdir()
    target = _write_fixture(holder)
    os.chmod(holder, 0o555)
    try:
        proc = _run(
            ["update", "--file", str(target), "--epic", "1", "--set-retro-done"]
        )
    finally:
        os.chmod(holder, 0o755)
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert out["restored"] is True
    # The file was never touched: the temp file could not even be created.
    assert target.read_text(encoding="utf-8") == FIXTURE
    assert [p.name for p in holder.iterdir()] == ["sprint-status.yaml"]


def test_punctuation_does_not_corrupt_file(tmp_path):
    # Explicit re-parse guarantee for YAML-breaking punctuation.
    target = _write_fixture(tmp_path)
    payload = '[{"action":"weird: value # with: hashes","owner":"Bob # Smith"}]'
    proc = _run(
        [
            "update",
            "--file",
            str(target),
            "--epic",
            "1",
            "--add-action",
            payload,
        ]
    )
    assert proc.returncode == 0, proc.stderr
    # Re-parse must succeed and preserve the literal punctuation.
    data = _load(target)
    assert data["action_items"][0]["action"] == "weird: value # with: hashes"
    assert data["action_items"][0]["owner"] == "Bob # Smith"


# --- Formatting fidelity -----------------------------------------------------


def test_template_round_trip_changes_only_last_updated(tmp_path):
    # The repo's own sprint-status template is the shape every generated file
    # inherits: 2-space sequence indent and a mid-file comment above
    # action_items. An update must touch nothing but last_updated — a re-indent
    # of a pre-existing, untouched entry defeats the preservation guarantee that
    # motivates "do not hand-edit this file".
    source = TEMPLATE.read_text(encoding="utf-8")
    target = tmp_path / "sprint-status.yaml"
    target.write_text(source, encoding="utf-8")

    proc = _run(
        ["update", "--file", str(target), "--epic", "1", "--date", "01-01-2026 09:00"]
    )
    assert proc.returncode == 0, proc.stderr
    assert _json(proc)["ok"] is True

    before = source.splitlines()
    after = target.read_text(encoding="utf-8").splitlines()
    assert len(before) == len(after)
    changed = [(b, a) for b, a in zip(before, after) if b != a]
    assert len(changed) == 1, changed
    assert changed[0][1] == "last_updated: 01-01-2026 09:00"
    # The pre-existing action item keeps its 2-space sequence indent.
    assert "  - epic: 1" in after


def test_mid_file_comment_survives_update(tmp_path):
    fixture = (
        "# header\n"
        "development_status:\n"
        "  1-1-a: done\n"
        "  epic-1-retrospective: optional\n"
        "\n"
        "# Action items committed during retrospectives\n"
        "action_items:\n"
        "  - epic: 1\n"
        '    action: "Pre-existing item"\n'
        '    owner: "Charlie"\n'
        "    status: open\n"
    )
    target = tmp_path / "sprint-status.yaml"
    target.write_text(fixture, encoding="utf-8")
    proc = _run(
        ["update", "--file", str(target), "--epic", "1", "--set-retro-done",
         "--add-action", '[{"action":"New item","owner":"Amelia"}]']
    )
    assert proc.returncode == 0, proc.stderr
    raw = target.read_text(encoding="utf-8")
    assert "# Action items committed during retrospectives" in raw
    assert "# header" in raw
    assert '    action: "Pre-existing item"' in raw


def test_legacy_offset_zero_file_is_canonicalized(tmp_path):
    # Files the previous version of this script wrote carry action_items at
    # column 0. The indent pin re-indents them to the template's shape on the
    # next write. That is a deliberate one-time canonicalization, not a silent
    # failure: the update still succeeds and no comment is lost.
    fixture = (
        "# header\n"
        "development_status:\n"
        "  1-1-a: done\n"
        "  epic-1-retrospective: optional\n"
        "action_items:\n"
        '- id: "legacy"\n'
        "  epic: 1\n"
        '  action: "written by the old code"\n'
        "  status: open\n"
    )
    target = tmp_path / "sprint-status.yaml"
    target.write_text(fixture, encoding="utf-8")
    proc = _run(["update", "--file", str(target), "--epic", "1", "--set-retro-done"])
    assert proc.returncode == 0, proc.stderr
    raw = target.read_text(encoding="utf-8")
    assert '  - id: "legacy"' in raw
    assert '    action: "written by the old code"' in raw
    assert "# header" in raw


def test_lost_comment_fails_with_restore(tmp_path):
    # A standalone comment inside a flow collection is genuinely dropped by the
    # round-trip. The leading-block check never saw it; the full multiset does,
    # and the original bytes must come back.
    fixture = (
        "# header\n"
        "development_status:\n"
        "  1-1-a: done\n"
        "  epic-1-retrospective: optional\n"
        "tags: [\n"
        "  # a standalone comment the round-trip drops\n"
        '  "alpha",\n'
        '  "beta",\n'
        "]\n"
    )
    target = tmp_path / "sprint-status.yaml"
    target.write_text(fixture, encoding="utf-8")
    proc = _run(
        ["update", "--file", str(target), "--epic", "1", "--set-retro-done"]
    )
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert out["restored"] is True
    assert "comment line lost" in out["error"]
    assert "a standalone comment the round-trip drops" in out["error"]
    assert target.read_text(encoding="utf-8") == fixture


# --- Malformed input stays on the JSON contract ------------------------------


@pytest.mark.parametrize("command", ["detect-epic", "update"])
def test_non_mapping_root_is_json_error(tmp_path, command):
    target = tmp_path / "sprint-status.yaml"
    target.write_text("- a\n- b\n", encoding="utf-8")
    args = ["--file", str(target)] + (["--epic", "1"] if command == "update" else [])
    proc = _run([command, *args])
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert "root document is not a mapping" in out["error"]
    assert target.read_text(encoding="utf-8") == "- a\n- b\n"


@pytest.mark.parametrize("command", ["detect-epic", "update"])
@pytest.mark.parametrize(
    "body",
    ['development_status: "not-a-mapping"\n', "development_status:\n  - a\n  - b\n"],
    ids=["scalar", "list"],
)
def test_non_mapping_development_status_is_json_error(tmp_path, command, body):
    target = tmp_path / "sprint-status.yaml"
    target.write_text(body, encoding="utf-8")
    args = ["--file", str(target)] + (["--epic", "1"] if command == "update" else [])
    proc = _run([command, *args])
    # update used to report ok:true here while silently doing nothing.
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert "development_status is not a mapping" in out["error"]


@pytest.mark.parametrize("command", ["detect-epic", "update"])
def test_directory_target_is_json_error(tmp_path, command):
    target = tmp_path / "a-directory"
    target.mkdir()
    args = ["--file", str(target)] + (["--epic", "1"] if command == "update" else [])
    proc = _run([command, *args])
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert out["error"]


@pytest.mark.skipif(
    hasattr(os, "geteuid") and os.geteuid() == 0,
    reason="root bypasses file permission bits",
)
@pytest.mark.parametrize("command", ["detect-epic", "update"])
def test_unreadable_target_is_json_error(tmp_path, command):
    # The other half of the OSError widening: PermissionError, not just
    # IsADirectoryError, has to stay on the JSON contract.
    target = _write_fixture(tmp_path)
    os.chmod(target, 0o000)
    args = ["--file", str(target)] + (["--epic", "1"] if command == "update" else [])
    try:
        proc = _run([command, *args])
    finally:
        os.chmod(target, 0o644)
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert "denied" in out["error"].lower()


@pytest.mark.parametrize("command", ["detect-epic", "update"])
def test_invalid_utf8_is_json_error(tmp_path, command):
    target = tmp_path / "sprint-status.yaml"
    target.write_bytes(b"development_status:\n  1-1-a: d\xffone\n")
    args = ["--file", str(target)] + (["--epic", "1"] if command == "update" else [])
    proc = _run([command, *args])
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert "utf-8" in out["error"].lower()


# --- Atomic write ------------------------------------------------------------


def test_atomic_write_failure_leaves_target_byte_identical(tmp_path, monkeypatch):
    # The failure the atomic write exists for: something goes wrong after the
    # temp file has been written. Nothing may reach the target and no temp file
    # may survive. No CLI path reaches here -- a read-only directory fails at
    # mkstemp instead -- so this drives the helper directly.
    mod = _module()
    target = _write_fixture(tmp_path)

    def boom(*args, **kwargs):
        raise OSError(28, "No space left on device")

    monkeypatch.setattr(mod.os, "replace", boom)
    with pytest.raises(OSError):
        mod._atomic_write(str(target), b"replacement bytes\n", 0o644)
    assert target.read_text(encoding="utf-8") == FIXTURE
    assert [p.name for p in tmp_path.iterdir()] == ["sprint-status.yaml"]


def test_restore_is_atomic(tmp_path, monkeypatch):
    # _restore is the rollback the reference sells as the safety net. A
    # truncating rewrite that dies halfway would destroy the very bytes it is
    # putting back, which is how a full disk used to corrupt the file.
    mod = _module()
    target = tmp_path / "sprint-status.yaml"
    target.write_text("damaged\n", encoding="utf-8")

    def boom(*args, **kwargs):
        raise OSError(28, "No space left on device")

    monkeypatch.setattr(mod.os, "replace", boom)
    assert mod._restore(str(target), FIXTURE.encode("utf-8"), 0o644) is False
    # It reported failure honestly and left the file no worse than it found it.
    assert target.read_text(encoding="utf-8") == "damaged\n"
    assert [p.name for p in tmp_path.iterdir()] == ["sprint-status.yaml"]


def test_symlinked_target_is_written_through(tmp_path):
    # os.replace onto a symlink would detach the link and leave the real file
    # stale while reporting ok:true.
    real = tmp_path / "real-sprint-status.yaml"
    real.write_text(FIXTURE, encoding="utf-8")
    link = tmp_path / "sprint-status.yaml"
    link.symlink_to(real)
    proc = _run(["update", "--file", str(link), "--epic", "1", "--set-retro-done"])
    assert proc.returncode == 0, proc.stderr
    assert link.is_symlink(), "the symlink was replaced by a regular file"
    assert _load(real)["development_status"]["epic-1-retrospective"] == "done"


def test_atomic_write_preserves_mode_and_leaves_no_temp_file(tmp_path):
    # mkstemp creates 0600; without carrying the target's mode over, every
    # update would silently narrow the file.
    holder = tmp_path / "holder"
    holder.mkdir()
    target = _write_fixture(holder)
    os.chmod(target, 0o640)
    proc = _run(["update", "--file", str(target), "--epic", "1", "--set-retro-done"])
    assert proc.returncode == 0, proc.stderr
    assert stat.S_IMODE(target.stat().st_mode) == 0o640
    assert [p.name for p in holder.iterdir()] == ["sprint-status.yaml"]


# --- Result-JSON precision ---------------------------------------------------


def test_retro_key_found_is_null_without_the_flag(tmp_path):
    # No development_status key at all: the update must not conjure one, and
    # retro_key_found must say "not asked" rather than "absent".
    fixture = 'project: "Demo"\nlast_updated: "01-01-2026 09:00"\n'
    target = tmp_path / "sprint-status.yaml"
    target.write_text(fixture, encoding="utf-8")
    proc = _run(["update", "--file", str(target), "--epic", "1"])
    assert proc.returncode == 0, proc.stderr
    out = _json(proc)
    assert out["ok"] is True
    assert out["retro_key_found"] is None
    assert "development_status" not in target.read_text(encoding="utf-8")


def test_retro_key_found_is_false_when_the_key_is_absent(tmp_path):
    target = _write_fixture(tmp_path)
    proc = _run(["update", "--file", str(target), "--epic", "2", "--set-retro-done"])
    assert proc.returncode == 0, proc.stderr
    out = _json(proc)
    assert out["ok"] is True
    assert out["retro_key_found"] is False
    # Nothing was written into the mapping.
    assert "epic-2-retrospective" not in _load(target)["development_status"]


@pytest.mark.parametrize("command", ["detect-epic", "update"])
def test_only_the_write_path_reports_restored(tmp_path, command):
    # "restored" speaks to the state of a file the command may have written.
    # detect-epic never writes, so inventing the key there would mislead callers
    # that branch on it.
    target = tmp_path / "sprint-status.yaml"
    target.write_text("- a\n- b\n", encoding="utf-8")
    args = ["--file", str(target)] + (["--epic", "1"] if command == "update" else [])
    out = _json(_run([command, *args]))
    assert out["ok"] is False
    assert ("restored" in out) is (command == "update")


def test_pre_write_failure_reports_restored(tmp_path):
    # retro-document.md teaches callers that ok:false carries restored:true;
    # a failure before the write must not read as "the file may be incomplete".
    target = _write_fixture(tmp_path)
    proc = _run(
        ["update", "--file", str(target), "--epic", "1", "--add-action", "{not json"]
    )
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert out["restored"] is True
    assert target.read_text(encoding="utf-8") == FIXTURE


# --- Action-item validation and identity -------------------------------------


def test_non_latin_action_keeps_its_text_in_the_id(tmp_path):
    target = _write_fixture(tmp_path)
    payload = json.dumps(
        [{"action": "Улучшить обработку ошибок", "owner": "Amelia"}],
        ensure_ascii=False,
    )
    proc = _run(["update", "--file", str(target), "--epic", "1", "--add-action", payload])
    assert proc.returncode == 0, proc.stderr
    item_id = _load(target)["action_items"][0]["id"]
    assert item_id == "epic-1-retro-item-1-улучшить-обработку-ошибок"


def test_unsluggable_action_falls_back_to_a_hash(tmp_path):
    target = _write_fixture(tmp_path)
    payload = json.dumps([{"action": "!!! 🎉", "owner": "Amelia"}], ensure_ascii=False)
    proc = _run(["update", "--file", str(target), "--epic", "1", "--add-action", payload])
    assert proc.returncode == 0, proc.stderr
    item_id = _load(target)["action_items"][0]["id"]
    assert not item_id.endswith("-item")
    assert re.fullmatch(r"epic-1-retro-item-1-[0-9a-f]{8}", item_id), item_id


def test_empty_action_is_rejected(tmp_path):
    target = _write_fixture(tmp_path)
    proc = _run(
        ["update", "--file", str(target), "--epic", "1",
         "--add-action", '[{"action":"   ","owner":"x"}]']
    )
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert out["restored"] is True
    assert "action" in out["error"]
    assert target.read_text(encoding="utf-8") == FIXTURE


def test_non_string_action_is_rejected(tmp_path):
    # A JSON null would otherwise be str()'d into a literal "None" and written
    # as a real action item, which the new emptiness check alone lets through.
    target = _write_fixture(tmp_path)
    proc = _run(
        ["update", "--file", str(target), "--epic", "1",
         "--add-action", '[{"action":null,"owner":"x"}]']
    )
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert out["restored"] is True
    assert target.read_text(encoding="utf-8") == FIXTURE


def test_date_is_normalized_to_the_canonical_format(tmp_path):
    # strptime accepts unpadded spellings; writing those through would defeat
    # the point of validating the format.
    target = _write_fixture(tmp_path)
    proc = _run(
        ["update", "--file", str(target), "--epic", "1", "--date", "1-2-2026 9:05"]
    )
    assert proc.returncode == 0, proc.stderr
    assert _json(proc)["last_updated"] == "01-02-2026 09:05"
    assert _load(target)["last_updated"] == "01-02-2026 09:05"


def test_malformed_date_is_rejected(tmp_path):
    target = _write_fixture(tmp_path)
    proc = _run(
        ["update", "--file", str(target), "--epic", "1", "--date", "not-a-date"]
    )
    assert proc.returncode == 1
    out = _json(proc)
    assert out["ok"] is False
    assert out["restored"] is True
    assert "--date" in out["error"]
    assert target.read_text(encoding="utf-8") == FIXTURE


if __name__ == "__main__":
    sys.exit(subprocess.call(["uv", "run", "--with", "pytest", "--with", "ruamel.yaml",
                              "-m", "pytest", str(Path(__file__).parent), "-q"]))
