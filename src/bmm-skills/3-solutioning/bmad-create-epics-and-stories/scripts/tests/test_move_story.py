#!/usr/bin/env python3
"""Tests for scripts/move_story.py — cross-epic move, self-dep rewrite, sibling rewrite."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
INIT_EPIC = SCRIPTS / "init_epic.py"
INIT_STORY = SCRIPTS / "init_story.py"
MOVE = SCRIPTS / "move_story.py"
VALIDATE = SCRIPTS / "validate_initiative.py"


def _run(script: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True, check=False)


class TestMoveStory(unittest.TestCase):
    def _bootstrap(self, store: Path) -> None:
        _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "1", "--title", "Auth")
        _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "2", "--title", "Mig", "--depends-on", "1")
        _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "1", "--title", "Schema", "--type", "task")
        _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "2", "--title", "Register", "--type", "feature", "--depends-on", "01-schema")

    def test_move_rewrites_epic_and_within_dep(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(MOVE, "--initiative-store", str(store), "--from", "01-auth/02-register", "--to-epic", "02-mig", "--new-nn", "1")
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(data["new"], "02-mig/01-register")
            moved = (store / "epics" / "02-mig" / "01-register.md").read_text(encoding="utf-8")
            self.assertIn("epic: 02-mig", moved)
            self.assertIn('"01-auth/01-schema"', moved)
            self.assertNotIn('depends_on: ["01-schema"]', moved)
            self.assertFalse((store / "epics" / "01-auth" / "02-register.md").exists())

    def test_move_keeps_validator_clean(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            _run(INIT_STORY, "--initiative-store", str(store), "--epic", "02-mig", "--story-nn", "1", "--title", "Mailer", "--type", "task", "--depends-on", "01-auth/01-schema")
            _run(MOVE, "--initiative-store", str(store), "--from", "01-auth/02-register", "--to-epic", "02-mig", "--new-nn", "2")
            r = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)

    def test_sibling_dep_rewritten_to_cross_epic(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            # Add a third sibling that depends on the soon-to-move story via bare ref.
            _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "3", "--title", "Login", "--type", "feature", "--depends-on", "02-register")
            _run(MOVE, "--initiative-store", str(store), "--from", "01-auth/02-register", "--to-epic", "02-mig", "--new-nn", "1")
            login = (store / "epics" / "01-auth" / "03-login.md").read_text(encoding="utf-8")
            self.assertIn('"02-mig/01-register"', login)
            self.assertNotIn('depends_on: ["02-register"]', login)

    def test_same_epic_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(MOVE, "--initiative-store", str(store), "--from", "01-auth/02-register", "--to-epic", "01-auth")
            self.assertEqual(r.returncode, 1)
            self.assertIn("rename_story.py", r.stderr)

    def test_missing_destination_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            self._bootstrap(store)
            r = _run(MOVE, "--initiative-store", str(store), "--from", "01-auth/02-register", "--to-epic", "99-nope")
            self.assertEqual(r.returncode, 1)
            self.assertIn("does not exist", r.stderr)


if __name__ == "__main__":
    unittest.main()
