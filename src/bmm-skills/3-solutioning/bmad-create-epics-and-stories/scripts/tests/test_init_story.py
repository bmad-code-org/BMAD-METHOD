#!/usr/bin/env python3
"""Tests for scripts/init_story.py — type-driven body, depends_on, missing epic."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
INIT_EPIC = SCRIPTS / "init_epic.py"
INIT_STORY = SCRIPTS / "init_story.py"


def _run(script: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True, check=False)


def _bootstrap_epic(store: Path, nn: int = 1, title: str = "Auth") -> str:
    r = _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", str(nn), "--title", title)
    assert r.returncode == 0, r.stderr
    return json.loads(r.stdout)["epic"]


class TestInitStory(unittest.TestCase):
    def test_feature_keeps_user_story_block(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            epic = _bootstrap_epic(store)
            r = _run(
                INIT_STORY, "--initiative-store", str(store), "--epic", epic,
                "--story-nn", "1", "--title", "Register", "--type", "feature",
            )
            self.assertEqual(r.returncode, 0, r.stderr)
            content = Path(json.loads(r.stdout)["path"]).read_text(encoding="utf-8")
            self.assertIn("As a {{user_type}}", content)
            self.assertIn("type: feature", content)
            self.assertIn(f"epic: {epic}", content)
            self.assertNotIn(f'epic: "{epic}"', content)
            self.assertIn("status: draft", content)
            # The user-story marker comments stay so the LLM can locate the block.
            self.assertIn("USER_STORY_START", content)
            self.assertNotIn("Stripping rules", content)

    def test_task_strips_user_story_block(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            epic = _bootstrap_epic(store)
            r = _run(
                INIT_STORY, "--initiative-store", str(store), "--epic", epic,
                "--story-nn", "1", "--title", "Schema", "--type", "task",
            )
            self.assertEqual(r.returncode, 0, r.stderr)
            content = Path(json.loads(r.stdout)["path"]).read_text(encoding="utf-8")
            self.assertNotIn("As a {{user_type}}", content)
            self.assertIn("type: task", content)

    def test_depends_on_inline_list(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            epic = _bootstrap_epic(store)
            r = _run(
                INIT_STORY, "--initiative-store", str(store), "--epic", epic,
                "--story-nn", "1", "--title", "Schema", "--type", "task",
                "--depends-on", "01-foo,02-bar/03-baz",
            )
            content = Path(json.loads(r.stdout)["path"]).read_text(encoding="utf-8")
            self.assertIn('depends_on: ["01-foo", "02-bar/03-baz"]', content)

    def test_missing_epic_folder_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            r = _run(
                INIT_STORY, "--initiative-store", tmp, "--epic", "99-nope",
                "--story-nn", "1", "--title", "X", "--type", "task",
            )
            self.assertEqual(r.returncode, 1)
            self.assertIn("does not exist", r.stderr)


if __name__ == "__main__":
    unittest.main()
