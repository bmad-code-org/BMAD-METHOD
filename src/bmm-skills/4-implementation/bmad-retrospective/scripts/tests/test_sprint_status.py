"""Corruption-critical tests for sprint-status.py.

Each test runs the script as a subprocess via ``uv run`` against a temp copy of
an inline fixture, then re-reads the file to assert comments and formatting
survive and punctuation-heavy action values round-trip intact.
"""

import json
import subprocess
import sys
from pathlib import Path

from ruamel.yaml import YAML

SCRIPT = Path(__file__).resolve().parents[1] / "sprint_status.py"

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
    return subprocess.run(cmd, capture_output=True, text=True)


def _write_fixture(tmp_path):
    target = tmp_path / "sprint-status.yaml"
    target.write_text(FIXTURE, encoding="utf-8")
    return target


def _load(path):
    yaml = YAML(typ="rt")
    with open(path, "r", encoding="utf-8") as fh:
        return yaml.load(fh)


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


if __name__ == "__main__":
    sys.exit(subprocess.call(["uv", "run", "--with", "pytest", "--with", "ruamel.yaml",
                              "-m", "pytest", str(Path(__file__).parent), "-q"]))
