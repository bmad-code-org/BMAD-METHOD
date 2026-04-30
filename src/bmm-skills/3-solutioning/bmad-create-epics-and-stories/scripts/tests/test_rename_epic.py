#!/usr/bin/env python3
"""Tests for scripts/rename_epic.py — retitle, renumber, ref propagation."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
INIT_EPIC = SCRIPTS / "init_epic.py"
INIT_STORY = SCRIPTS / "init_story.py"
RENAME_EPIC = SCRIPTS / "rename_epic.py"
VALIDATE = SCRIPTS / "validate_initiative.py"


def _run(script: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True, check=False)


class TestRenameEpic(unittest.TestCase):
    def _bootstrap(self, store: Path) -> None:
        _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "1", "--title", "Auth")
        _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "2", "--title", "Migration", "--depends-on", "1")
        _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "1", "--title", "Schema", "--type", "task")
        _run(INIT_STORY, "--initiative-store", str(store), "--epic", "02-migration", "--story-nn", "1", "--title", "Mailer", "--type", "task", "--depends-on", "01-auth/01-schema")

    def test_retitle_propagates_to_story_epic_field_and_cross_epic_deps(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(RENAME_EPIC, "--initiative-store", str(store), "--epic", "01-auth", "--to-title", "User Authentication")
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(data["new"], "01-user-authentication")
            self.assertTrue((store / "epics" / "01-user-authentication" / "epic.md").is_file())
            schema = (store / "epics" / "01-user-authentication" / "01-schema.md").read_text(encoding="utf-8")
            self.assertIn('epic: "01-user-authentication"', schema)
            mailer = (store / "epics" / "02-migration" / "01-mailer.md").read_text(encoding="utf-8")
            self.assertIn('"01-user-authentication/01-schema"', mailer)
            v = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(v.returncode, 0, v.stdout + v.stderr)

    def test_renumber_updates_other_epic_depends_on(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(RENAME_EPIC, "--initiative-store", str(store), "--epic", "01-auth", "--to-nn", "5")
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertTrue((store / "epics" / "05-auth").is_dir())
            mig_epic = (store / "epics" / "02-migration" / "epic.md").read_text(encoding="utf-8")
            self.assertIn('"05"', mig_epic)
            self.assertNotIn('"01"', mig_epic.split("---", 2)[1])
            auth_epic = (store / "epics" / "05-auth" / "epic.md").read_text(encoding="utf-8")
            self.assertIn('epic: "05"', auth_epic)
            v = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(v.returncode, 0, v.stdout + v.stderr)

    def test_collision_with_existing_nn_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(RENAME_EPIC, "--initiative-store", str(store), "--epic", "01-auth", "--to-nn", "2")
            self.assertEqual(r.returncode, 1)
            self.assertIn("already used", r.stderr)

    def test_no_op_when_target_equals_source(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(RENAME_EPIC, "--initiative-store", str(store), "--epic", "01-auth")
            self.assertEqual(r.returncode, 0)
            data = json.loads(r.stdout)
            self.assertEqual(data["refs_updated"], 0)


if __name__ == "__main__":
    unittest.main()
