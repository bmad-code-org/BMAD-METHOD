#!/usr/bin/env python3
"""Tests for scripts/extract_coverage.py — AC->codes parsing."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
INIT_EPIC = SCRIPTS / "init_epic.py"
INIT_STORY = SCRIPTS / "init_story.py"
EXTRACT = SCRIPTS / "extract_coverage.py"


def _run(script: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True, check=False)


def _set_coverage(path: Path, coverage_md: str) -> None:
    text = path.read_text(encoding="utf-8")
    if "## Coverage" in text:
        head, _, _ = text.partition("## Coverage")
        path.write_text(head + "## Coverage\n\n" + coverage_md.rstrip() + "\n", encoding="utf-8")
    else:
        path.write_text(text.rstrip() + "\n\n## Coverage\n\n" + coverage_md.rstrip() + "\n", encoding="utf-8")


class TestExtractCoverage(unittest.TestCase):
    def test_parses_ac_to_codes_map(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "1", "--title", "Auth")
            _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "1", "--title", "Login", "--type", "feature")
            sf = store / "epics" / "01-auth" / "01-login.md"
            _set_coverage(sf, "- AC1: FR1, NFR3.2\n- AC2: UX-DR2\n- AC3: D1\n")
            r = _run(EXTRACT, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(len(data["stories"]), 1)
            story = data["stories"][0]
            self.assertTrue(story["has_coverage_section"])
            self.assertEqual(story["ac_to_codes"]["AC1"], ["FR1", "NFR3.2"])
            self.assertEqual(story["ac_to_codes"]["AC2"], ["UX-DR2"])
            self.assertEqual(story["ac_to_codes"]["AC3"], ["D1"])
            self.assertIn("FR1", data["all_codes"])
            self.assertIn("UX-DR2", data["all_codes"])

    def test_flags_stories_without_coverage_section(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "1", "--title", "Auth")
            _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "1", "--title", "Login", "--type", "feature")
            sf = store / "epics" / "01-auth" / "01-login.md"
            text = sf.read_text(encoding="utf-8")
            sf.write_text(text.replace("## Coverage", "## CoverageRemoved"), encoding="utf-8")
            r = _run(EXTRACT, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 0, r.stderr)
            data = json.loads(r.stdout)
            self.assertIn("01-auth/01-login", data["stories_without_coverage_section"])

    def test_skips_epic_md_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "1", "--title", "Auth")
            r = _run(EXTRACT, "--initiative-store", str(store))
            data = json.loads(r.stdout)
            self.assertEqual(data["stories"], [])


if __name__ == "__main__":
    unittest.main()
