#!/usr/bin/env python3
"""Tests for scripts/init_epic.py — happy path, depends_on, conflict."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "init_epic.py"


def run(*args: str, store: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(SCRIPT), "--initiative-store", str(store), *args],
        capture_output=True,
        text=True,
        check=False,
    )


class TestInitEpic(unittest.TestCase):
    def test_creates_folder_and_epic_md(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            r = run("--epic-nn", "1", "--title", "User Authentication", store=store)
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(data["epic"], "01-user-authentication")
            self.assertEqual(data["epic_nn"], "01")
            self.assertTrue(Path(data["path"]).is_file())
            content = Path(data["path"]).read_text(encoding="utf-8")
            self.assertIn('title: "User Authentication"', content)
            self.assertIn('epic: "01"', content)
            self.assertIn("status: draft", content)
            self.assertIn("depends_on: []", content)

    def test_emits_depends_on(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            run("--epic-nn", "1", "--title", "A", store=store)
            r = run("--epic-nn", "2", "--title", "B", "--depends-on", "1", store=store)
            self.assertEqual(r.returncode, 0, r.stderr)
            content = Path(json.loads(r.stdout)["path"]).read_text(encoding="utf-8")
            self.assertIn('depends_on: ["01"]', content)

    def test_collision_fails(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            run("--epic-nn", "1", "--title", "Auth", store=store)
            r = run("--epic-nn", "1", "--title", "Auth", store=store)
            self.assertEqual(r.returncode, 1)
            self.assertIn("already exists", r.stderr)

    def test_slug_special_chars(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            r = run("--epic-nn", "1", "--title", "Billing & Stripe v2!", store=store)
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertEqual(json.loads(r.stdout)["epic"], "01-billing-stripe-v2")


if __name__ == "__main__":
    unittest.main()
