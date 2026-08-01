# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0", "ruamel.yaml>=0.18"]
# ///
"""Tests for sprint_plan.py — deterministic sprint-status generation.

Run: uv run scripts/tests/test_sprint_plan.py
 or: uv run --with pytest --with ruamel.yaml -m pytest scripts/tests/test_sprint_plan.py
"""

import importlib.util
import json
import sys
from pathlib import Path

import pytest
from ruamel.yaml import YAML

SCRIPT = Path(__file__).resolve().parents[1] / "sprint_plan.py"

spec = importlib.util.spec_from_file_location("sprint_plan", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

EPICS_FIXTURE = """\
# Project Epics

## Epic 1: Foundation
Some prose.

### Story 1.1: User Authentication
Acceptance criteria...

### Story 1.2: Account Management

## Epic 2: Chat
### Story 2.1: Personality System
### Story 2.6a: Split Story, With Punctuation!
"""

DATE = "08-01-2026 14:30"


def run_generate(tmp_path, epics_text=EPICS_FIXTURE, existing=None, stories=(), extra=()):
    epic_file = tmp_path / "epics.md"
    epic_file.write_text(epics_text, encoding="utf-8")
    status_file = tmp_path / "impl" / "sprint-status.yaml"
    if existing is not None:
        status_file.parent.mkdir(parents=True, exist_ok=True)
        status_file.write_text(existing, encoding="utf-8")
    stories_dir = tmp_path / "impl"
    stories_dir.mkdir(parents=True, exist_ok=True)
    for name in stories:
        (stories_dir / f"{name}.md").write_text("story", encoding="utf-8")
    argv = [
        "generate", "--epic-file", str(epic_file), "--status-file", str(status_file),
        "--stories-dir", str(stories_dir), "--project", "My Project", "--date", DATE,
        *extra,
    ]
    mod.main(argv)
    return status_file


def load(status_file):
    yaml = YAML()
    with open(status_file, encoding="utf-8") as fh:
        return yaml.load(fh)


def out_json(capsys):
    return json.loads(capsys.readouterr().out)


def test_fresh_generate_orders_and_defaults(tmp_path, capsys):
    status_file = run_generate(tmp_path)
    result = out_json(capsys)
    data = load(status_file)
    keys = list(data["development_status"].keys())
    assert keys == [
        "epic-1", "1-1-user-authentication", "1-2-account-management", "epic-1-retrospective",
        "epic-2", "2-1-personality-system", "2-6a-split-story-with-punctuation", "epic-2-retrospective",
    ]
    assert data["development_status"]["epic-1"] == "backlog"
    assert data["development_status"]["1-1-user-authentication"] == "backlog"
    assert data["development_status"]["epic-1-retrospective"] == "optional"
    assert data["project"] == "My Project"
    assert data["generated"] == DATE and data["last_updated"] == DATE
    assert result["ok"] and result["epics"] == 2 and result["stories"] == 4
    text = status_file.read_text(encoding="utf-8")
    assert "STATUS DEFINITIONS" in text
    assert "\n\n  epic-2:" in text  # blank line between epic groups


EXISTING = """\
generated: 01-01-2026 09:00
last_updated: 01-01-2026 09:00
project: My Project
project_key: NOKEY
tracking_system: file-system
story_location: impl

development_status:
  epic-1: in-progress
  1-1-user-authentication: done
  1-2-account-management: backlog
  epic-1-retrospective: optional
  9-9-ghost-story: done

action_items:
  - epic: 1
    action: "Add error-handling review; watch: quotes, commas"
    owner: "Charlie"
    status: open
"""


def test_merge_preserves_and_never_downgrades(tmp_path, capsys):
    status_file = run_generate(tmp_path, existing=EXISTING)
    result = out_json(capsys)
    data = load(status_file)
    assert data["development_status"]["epic-1"] == "in-progress"
    assert data["development_status"]["1-1-user-authentication"] == "done"
    assert data["generated"] == "01-01-2026 09:00"
    assert data["last_updated"] == DATE
    assert result["dropped_orphans"] == ["9-9-ghost-story"]
    assert "9-9-ghost-story" not in data["development_status"]


def test_action_items_carried_verbatim(tmp_path):
    status_file = run_generate(tmp_path, existing=EXISTING)
    data = load(status_file)
    assert data["action_items"][0]["action"] == "Add error-handling review; watch: quotes, commas"
    assert data["action_items"][0]["status"] == "open"


def test_story_file_on_disk_floors_ready_for_dev(tmp_path, capsys):
    status_file = run_generate(tmp_path, stories=["1-2-account-management"])
    result = out_json(capsys)
    data = load(status_file)
    assert data["development_status"]["1-2-account-management"] == "ready-for-dev"
    assert data["development_status"]["1-1-user-authentication"] == "backlog"
    assert result["upgraded_from_disk"] == ["1-2-account-management"]


def test_story_file_never_downgrades_done(tmp_path):
    status_file = run_generate(tmp_path, existing=EXISTING, stories=["1-1-user-authentication"])
    data = load(status_file)
    assert data["development_status"]["1-1-user-authentication"] == "done"


def test_illegal_existing_status_warns_and_resets(tmp_path, capsys):
    existing = EXISTING.replace("1-2-account-management: backlog", "1-2-account-management: shipped")
    status_file = run_generate(tmp_path, existing=existing)
    result = out_json(capsys)
    data = load(status_file)
    assert data["development_status"]["1-2-account-management"] == "backlog"
    assert any("illegal status 'shipped'" in w for w in result["warnings"])


def test_suspect_heading_is_reported(tmp_path, capsys):
    text = EPICS_FIXTURE + "\n### Story Two point one: Bad Format\n"
    run_generate(tmp_path, epics_text=text)
    result = out_json(capsys)
    assert any("unparsed Epic/Story-like heading" in w for w in result["warnings"])


def test_dry_run_writes_nothing(tmp_path, capsys):
    epic_file = tmp_path / "epics.md"
    epic_file.write_text(EPICS_FIXTURE, encoding="utf-8")
    status_file = tmp_path / "sprint-status.yaml"
    mod.main([
        "generate", "--epic-file", str(epic_file), "--status-file", str(status_file),
        "--stories-dir", str(tmp_path), "--project", "P", "--date", DATE, "--dry-run",
    ])
    result = out_json(capsys)
    assert result["dry_run"] is True and result["ok"] is True
    assert not status_file.exists()


def test_no_epics_fails_with_json(tmp_path, capsys):
    epic_file = tmp_path / "notes.md"
    epic_file.write_text("just prose, no epics", encoding="utf-8")
    with pytest.raises(SystemExit) as excinfo:
        mod.main([
            "generate", "--epic-file", str(epic_file), "--status-file", str(tmp_path / "s.yaml"),
            "--stories-dir", str(tmp_path), "--project", "P", "--date", DATE,
        ])
    assert excinfo.value.code == 1
    assert out_json(capsys)["ok"] is False


def test_check_reports_drift(tmp_path, capsys):
    epic_file = tmp_path / "epics.md"
    epic_file.write_text(EPICS_FIXTURE, encoding="utf-8")
    status_file = tmp_path / "sprint-status.yaml"
    status_file.write_text(EXISTING, encoding="utf-8")
    mod.main(["check", "--epic-file", str(epic_file), "--status-file", str(status_file)])
    result = out_json(capsys)
    assert result["in_sync"] is False
    assert "epic-2" in result["missing"]
    assert result["orphans"] == ["9-9-ghost-story"]


def test_check_in_sync_after_generate(tmp_path, capsys):
    status_file = run_generate(tmp_path)
    capsys.readouterr()
    mod.main(["check", "--epic-file", str(tmp_path / "epics.md"), "--status-file", str(status_file)])
    result = out_json(capsys)
    assert result["in_sync"] is True
    assert result["missing"] == [] and result["orphans"] == [] and result["illegal"] == []


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-q"]))
