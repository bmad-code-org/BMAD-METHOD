#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Tests for party_memory.py: recall, remember, and a memory kept under the older `.memlog.md` name."""

import contextlib
import io
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import party_memory  # noqa: E402

OLD_LOG = """---
party: installed
updated: 2026-06-07T14:22
---


- (dynamic) Winston and Amelia clashed over the rewrite
- (outcome) ship the export before the dashboard
"""


def run(*args):
    out, err = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = party_memory.main(list(args))
    return code, json.loads(out.getvalue()) if out.getvalue().strip() else None, err.getvalue()


def read_only(folder: Path):
    """Make a folder refuse new files and renames for the length of a test; skipped where that cannot be done."""
    if sys.platform == "win32" or os.geteuid() == 0:
        raise unittest.SkipTest("needs POSIX permissions and a non-root user")
    folder.chmod(0o555)
    return lambda: folder.chmod(0o755)


class PartyMemoryTest(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.dir = Path(tmp.name) / "memories"
        self.file = self.dir / "crew" / "memory.md"

    def where(self, party="crew"):
        return ("--dir", str(self.dir), "--party", party)

    def test_a_party_with_no_memory_recalls_nothing_and_writes_no_file(self):
        code, data, _ = run("recall", *self.where())
        self.assertEqual((code, data), (0, {"ok": True, "path": self.file.as_posix(), "exists": False, "entries": 0}))
        self.assertFalse(self.dir.exists())

    def test_remember_creates_the_file_then_adds_at_the_end(self):
        code, data, _ = run("remember", *self.where(), "--text", "met at\nthe  dock", "--type", "moment")
        self.assertEqual((code, data["exists"], data["entries"]), (0, True, 1))
        run("remember", *self.where(), "--text", "Mary's joke", "--type", "callback", "--by", "analyst")
        run("remember", *self.where(), "--text", "a plain one")
        self.assertEqual(
            self.file.read_text(encoding="utf-8"),
            "- (moment) met at the dock\n- (callback by analyst) Mary's joke\n- a plain one\n",
        )
        self.assertEqual(run("recall", *self.where())[1]["entries"], 3)
        self.assertEqual(run("recall", *self.where("other"))[1]["exists"], False, "each party has its own memory")

    def test_an_older_memlog_is_renamed_on_recall_and_carried_on(self):
        old = self.dir / "crew" / ".memlog.md"
        old.parent.mkdir(parents=True)
        old.write_text(OLD_LOG, encoding="utf-8")
        code, data, _ = run("recall", *self.where())
        self.assertEqual((code, data["exists"], data["entries"]), (0, True, 2))
        self.assertFalse(old.exists())
        run("remember", *self.where(), "--text", "sailed north", "--type", "outcome")
        self.assertEqual(self.file.read_text(encoding="utf-8"), OLD_LOG + "- (outcome) sailed north\n")

    def test_an_older_memlog_is_renamed_when_remember_comes_first(self):
        old = self.dir / "crew" / ".memlog.md"
        old.parent.mkdir(parents=True)
        old.write_text(OLD_LOG.rstrip("\n"), encoding="utf-8")
        run("remember", *self.where(), "--text", "sailed north")
        self.assertFalse(old.exists())
        self.assertEqual(self.file.read_text(encoding="utf-8"), OLD_LOG + "- sailed north\n")

    def test_an_older_memlog_stays_put_when_memory_md_is_already_there(self):
        run("remember", *self.where(), "--text", "new")
        old = self.dir / "crew" / ".memlog.md"
        old.write_text(OLD_LOG, encoding="utf-8")
        self.assertEqual(run("recall", *self.where())[1]["entries"], 1)
        self.assertEqual(old.read_text(encoding="utf-8"), OLD_LOG)

    def test_an_older_memlog_that_cannot_be_renamed_stops_the_command(self):
        old = self.dir / "crew" / ".memlog.md"
        old.parent.mkdir(parents=True)
        old.write_text(OLD_LOG, encoding="utf-8")
        self.addCleanup(read_only(old.parent))
        for args in (("recall", *self.where()), ("remember", *self.where(), "--text", "sailed north")):
            code, _, err = run(*args)
            self.assertEqual(code, 2, args[0])
            self.assertIn("cannot rename", err)
        self.assertEqual(old.read_text(encoding="utf-8"), OLD_LOG)
        self.assertFalse(self.file.exists())

    def test_a_party_id_that_is_a_path_is_refused(self):
        for party in ("../crew", "a/b", "", ".."):
            code, _, err = run("remember", *self.where(party), "--text", "x")
            self.assertEqual(code, 2, party)
            self.assertIn("--party", err)
        self.assertFalse(self.dir.exists())


if __name__ == "__main__":
    unittest.main()
