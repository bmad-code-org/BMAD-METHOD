#!/usr/bin/env python3
"""Tests for scripts/rename_story.py — renumber, retitle, ref propagation."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
INIT_EPIC = SCRIPTS / "init_epic.py"
INIT_STORY = SCRIPTS / "init_story.py"
RENAME = SCRIPTS / "rename_story.py"


def _run(script: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True, check=False)


class TestRenameStory(unittest.TestCase):
    def _bootstrap(self, store: Path) -> None:
        _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "1", "--title", "Auth")
        _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "2", "--title", "Mig", "--depends-on", "1")
        _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "1", "--title", "Schema", "--type", "task")
        _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "2", "--title", "Register", "--type", "feature", "--depends-on", "01-schema")
        _run(INIT_STORY, "--initiative-store", str(store), "--epic", "02-mig", "--story-nn", "1", "--title", "Mailer", "--type", "task", "--depends-on", "01-auth/01-schema")

    def test_renumber_only(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(RENAME, "--initiative-store", str(store), "--epic", "01-auth", "--from", "02-register", "--to-nn", "3")
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(data["new"], "03-register")
            self.assertTrue((store / "epics" / "01-auth" / "03-register.md").is_file())
            self.assertFalse((store / "epics" / "01-auth" / "02-register.md").exists())

    def test_retitle_propagates_within_epic_refs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(
                RENAME, "--initiative-store", str(store), "--epic", "01-auth",
                "--from", "01-schema", "--to-title", "User and Session Schema",
            )
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(data["new"], "01-user-and-session-schema")
            self.assertGreaterEqual(data["refs_updated"], 1)
            register = (store / "epics" / "01-auth" / "02-register.md").read_text(encoding="utf-8")
            self.assertIn('"01-user-and-session-schema"', register)
            self.assertNotIn('"01-schema"', register)

    def test_retitle_propagates_cross_epic_refs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(
                RENAME, "--initiative-store", str(store), "--epic", "01-auth",
                "--from", "01-schema", "--to-title", "User Schema", "--to-nn", "5",
            )
            self.assertEqual(r.returncode, 0, r.stderr)
            mailer = (store / "epics" / "02-mig" / "01-mailer.md").read_text(encoding="utf-8")
            self.assertIn('"01-auth/05-user-schema"', mailer)
            self.assertNotIn("01-auth/01-schema", mailer)

    def test_target_collision_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            # Rename 01-schema -> 02-register would collide with the existing 02-register.md
            r = _run(
                RENAME, "--initiative-store", str(store), "--epic", "01-auth",
                "--from", "01-schema", "--to-title", "Register", "--to-nn", "2",
            )
            self.assertEqual(r.returncode, 1)
            self.assertIn("already exists", r.stderr)


if __name__ == "__main__":
    unittest.main()
