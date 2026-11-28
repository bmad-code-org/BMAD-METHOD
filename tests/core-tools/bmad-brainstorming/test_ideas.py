#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Tests for ideas.py: the append-only session log, its frontmatter, the resume list, and older `.memlog.md` logs."""

import contextlib
import io
import json
import os
import sys
import tempfile
import unittest
from datetime import datetime
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "skills/core-tools/bmad-brainstorming/scripts/ideas.py"
sys.path.insert(0, str(SCRIPT.parent))
import ideas  # noqa: E402

# A session as the shared script of earlier versions wrote it: unquoted YAML, blank lines under the fence.
OLD_LOG = """---
topic: names for the kiln booking app
goal: 'a name members will say: out loud'
mode: facilitator
updated: 2026-06-07T14:22
---


- (technique) started Word Association
- (idea by user) Kiln Queue
- (idea by user) Firing Line
"""


def run(*args):
    out, err = io.StringIO(), io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = ideas.main([*args])
    return code, json.loads(out.getvalue()) if out.getvalue().strip() else None, err.getvalue()


def entries(path: Path) -> list[str]:
    return [line for line in path.read_text(encoding="utf-8").splitlines() if line.startswith("- ")]


def read_only(folder: Path):
    """Make a folder refuse new files and renames for the length of a test; skipped where that cannot be done."""
    if sys.platform == "win32" or os.geteuid() == 0:
        raise unittest.SkipTest("needs POSIX permissions and a non-root user")
    folder.chmod(0o555)
    return lambda: folder.chmod(0o755)


class IdeasTest(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)
        self.folder = self.root / "brainstorm-names"
        self.log = self.folder / "ideas.md"

    def start(self, **fields):
        args = [x for k, v in {"topic": "names", **fields}.items() for x in (f"--{k}", v)]
        return run("start", "--folder", str(self.folder), *args)

    def add(self, text, *extra):
        return run("add", "--folder", str(self.folder), "--text", text, *extra)

    def test_entries_land_at_the_end_in_order_with_their_tags(self):
        self.assertEqual(self.start(goal="pick one", mode="partner")[0], 0)
        code, data, _ = self.add("Kiln  Queue\nacross two lines", "--type", "idea", "--by", "user")
        self.assertEqual((code, data["entries"], data["ideas"]), (0, 1, self.log.as_posix()))
        self.add("why not both?", "--type", "question")
        self.add("coach noted this", "--by", "coach")
        self.add("a plain note")
        self.assertEqual(
            entries(self.log),
            [
                "- (idea by user) Kiln Queue across two lines",
                "- (question) why not both?",
                "- (by coach) coach noted this",
                "- a plain note",
            ],
        )
        text = self.log.read_text(encoding="utf-8")
        self.assertIn("---\n\n- (idea by user)", text, "one blank line between the frontmatter and the first entry")
        self.assertTrue(text.endswith("- a plain note\n"))

    def test_several_texts_in_one_call_are_several_entries_in_order(self):
        self.start()
        code, data, _ = self.add(
            "one", "--text", "two\nstill two", "--text", "three", "--type", "idea", "--by", "coach"
        )
        self.assertEqual((code, data["entries"]), (0, 3))
        self.assertEqual(
            entries(self.log), ["- (idea by coach) one", "- (idea by coach) two still two", "- (idea by coach) three"]
        )

    def test_a_log_cut_off_mid_line_gets_its_newline_back(self):
        self.start()
        self.add("first", "--type", "idea")
        self.log.write_bytes(self.log.read_bytes().rstrip(b"\n"))
        self.add("second", "--type", "idea")
        self.assertTrue(self.log.read_text(encoding="utf-8").endswith("- (idea) first\n- (idea) second\n"))

    def test_fields_survive_text_that_is_not_plain_yaml(self):
        self.start(topic='Fix #42: "names"', goal="say: it's ok\nplease", mode="facilitator")
        raw = self.log.read_text(encoding="utf-8").splitlines()
        self.assertEqual(raw[1:3], ["topic: 'Fix #42: \"names\"'", "goal: 'say: it''s ok please'"], "values are quoted")
        fields, _ = ideas.read(self.log)
        self.assertEqual(
            {k: v for k, v in fields.items() if k != "created"},
            {"topic": 'Fix #42: "names"', "goal": "say: it's ok please", "mode": "facilitator"},
        )

    def test_set_changes_one_field_and_keeps_every_entry(self):
        self.start(mode="autonomous")
        self.add("one", "--type", "idea")
        code, data, _ = run("set", "--folder", str(self.folder), "--key", "mode", "--value", "partner")
        self.assertEqual((code, data["mode"], data["entries"]), (0, "partner", 1))
        run("set", "--folder", str(self.folder), "--key", "status", "--value", "complete")
        self.add("two", "--type", "idea")
        fields, _ = ideas.read(self.log)
        self.assertEqual((fields["mode"], fields["status"], fields["topic"]), ("partner", "complete", "names"))
        self.assertRegex(fields["created"], r"^\d{4}-\d\d-\d\dT\d\d:\d\d$")
        self.assertEqual(entries(self.log), ["- (idea) one", "- (idea) two"])

    def test_start_refuses_a_session_that_exists_and_add_refuses_one_that_does_not(self):
        code, _, err = self.add("orphan")
        self.assertEqual(code, 2)
        self.assertIn("run start first", err)
        self.start()
        self.add("kept", "--type", "idea")
        code, _, err = self.start(topic="again")
        self.assertEqual(code, 2)
        self.assertIn("already exists", err)
        self.assertEqual(entries(self.log), ["- (idea) kept"])
        self.assertEqual(run("set", "--folder", str(self.folder), "--key", "a: b", "--value", "x")[0], 2)

    def test_an_older_memlog_is_renamed_and_carried_on(self):
        self.folder.mkdir()
        old = self.folder / ".memlog.md"
        old.write_text(OLD_LOG, encoding="utf-8")
        code, data, _ = self.add("Bisque", "--type", "idea", "--by", "user")
        self.assertEqual((code, data["entries"]), (0, 4))
        self.assertFalse(old.exists())
        self.assertEqual(
            entries(self.log),
            [
                "- (technique) started Word Association",
                "- (idea by user) Kiln Queue",
                "- (idea by user) Firing Line",
                "- (idea by user) Bisque",
            ],
        )
        fields, _ = ideas.read(self.log)
        self.assertEqual(fields["goal"], "a name members will say: out loud")

    def test_start_does_not_write_over_an_older_memlog(self):
        self.folder.mkdir()
        (self.folder / ".memlog.md").write_text(OLD_LOG, encoding="utf-8")
        code, _, err = self.start(topic="again")
        self.assertEqual(code, 2)
        self.assertIn("already exists", err)
        self.assertEqual(self.log.read_text(encoding="utf-8"), OLD_LOG)
        self.assertFalse((self.folder / ".memlog.md").exists())

    def test_an_older_memlog_that_cannot_be_renamed_stops_the_write(self):
        self.folder.mkdir()
        old = self.folder / ".memlog.md"
        old.write_text(OLD_LOG, encoding="utf-8")
        self.addCleanup(read_only(self.folder))
        code, _, err = self.add("Bisque", "--type", "idea")
        self.assertEqual(code, 2)
        self.assertIn("cannot rename", err)
        self.assertEqual(old.read_text(encoding="utf-8"), OLD_LOG)
        self.assertFalse(self.log.exists())

    def test_a_write_that_fails_is_one_line_and_exit_2(self):
        self.start()
        self.addCleanup(read_only(self.folder))
        code, _, err = run("set", "--folder", str(self.folder), "--key", "status", "--value", "complete")
        self.assertEqual(code, 2)
        self.assertTrue(err.startswith("error: ") and err.count("\n") == 1, err)

    def test_an_older_memlog_stays_put_when_ideas_md_is_already_there(self):
        self.start()
        old = self.folder / ".memlog.md"
        old.write_text(OLD_LOG, encoding="utf-8")
        self.add("new", "--type", "idea")
        self.assertEqual(old.read_text(encoding="utf-8"), OLD_LOG)
        self.assertEqual(entries(self.log), ["- (idea) new"])

    def test_open_lists_unfinished_sessions_and_renames_nothing(self):
        self.start(goal="pick one", mode="partner")
        self.add("one", "--type", "idea")
        finished = self.root / "brainstorm-done"
        run("start", "--folder", str(finished), "--topic", "done")
        run("set", "--folder", str(finished), "--key", "status", "--value", "complete")
        paused = self.root / "brainstorm-paused"
        run("start", "--folder", str(paused), "--topic", "paused")
        run("set", "--folder", str(paused), "--key", "status", "--value", "paused")
        older = self.root / "brainstorm-older"
        older.mkdir()
        (older / ".memlog.md").write_text(OLD_LOG, encoding="utf-8")
        older_done = self.root / "brainstorm-older-done"
        older_done.mkdir()
        (older_done / ".memlog.md").write_text(
            OLD_LOG.replace("mode: facilitator", "mode: facilitator\nstatus: complete")
        )
        not_ours = self.root / "brainstorm-tickets"  # another skill's log: no `mode`
        not_ours.mkdir()
        (not_ours / ".memlog.md").write_text("---\ntopic: Checkout initiative\n---\n\n- (requirement) R1\n")
        (self.root / "brainstorm-empty").mkdir()
        broken = self.root / "brainstorm-broken"
        broken.mkdir()
        (broken / "ideas.md").write_text("no frontmatter\n", encoding="utf-8")
        other = self.root / "research-names"
        other.mkdir()
        (other / ".memlog.md").write_text(OLD_LOG, encoding="utf-8")

        code, data, _ = run("open", "--root", str(self.root), "--root", str(self.root / "missing"))
        self.assertEqual(code, 0)
        found = {Path(s["folder"]).name: s for s in data["sessions"]}
        self.assertEqual(
            sorted(found), ["brainstorm-broken", "brainstorm-names", "brainstorm-older", "brainstorm-paused"]
        )
        self.assertEqual(
            {k: found["brainstorm-names"][k] for k in ("topic", "goal", "mode", "entries")},
            {"topic": "names", "goal": "pick one", "mode": "partner", "entries": 1},
        )
        self.assertEqual(found["brainstorm-older"]["ideas"], (older / ".memlog.md").as_posix())
        self.assertEqual(found["brainstorm-older"]["entries"], 3)
        self.assertEqual(found["brainstorm-older"]["mode"], "facilitator")
        stale = datetime(2020, 1, 2, 3, 4).timestamp()
        os.utime(self.log, (stale, stale))
        os.utime(older / ".memlog.md", (stale, stale))
        again = {Path(s["folder"]).name: s for s in run("open", "--root", str(self.root))[1]["sessions"]}
        self.assertEqual(again["brainstorm-names"]["updated"], "2020-01-02T03:04", "when the file last changed")
        self.assertEqual(again["brainstorm-older"]["updated"], "2020-01-02T03:04", "not the stale frontmatter value")
        self.assertEqual(found["brainstorm-paused"]["status"], "paused")
        self.assertIn("no frontmatter", found["brainstorm-broken"]["error"])
        for folder in (older, older_done, not_ours, other):
            self.assertTrue((folder / ".memlog.md").is_file(), f"{folder.name}: listing renames nothing")
            self.assertFalse((folder / "ideas.md").exists())

        code, data, _ = run("open", "--root", str(self.root), "--glob", "*")
        self.assertNotIn("brainstorm-tickets", {Path(s["folder"]).name for s in data["sessions"]})
        self.assertTrue((not_ours / ".memlog.md").is_file(), "a wide pattern still leaves another skill's log alone")

    def test_open_keeps_its_own_folder_and_ideas_over_fields_of_those_names(self):
        self.start()
        run("set", "--folder", str(self.folder), "--key", "folder", "--value", "elsewhere")
        run("set", "--folder", str(self.folder), "--key", "ideas", "--value", "elsewhere/ideas.md")
        (session,) = run("open", "--root", str(self.root))[1]["sessions"]
        self.assertEqual((session["folder"], session["ideas"]), (self.folder.as_posix(), self.log.as_posix()))

    def test_open_reports_a_session_once_when_a_root_repeats(self):
        self.start()
        code, data, _ = run("open", "--root", str(self.root), "--root", str(self.root))
        self.assertEqual((code, len(data["sessions"])), (0, 1))

    def test_open_reports_a_session_once_when_roots_overlap(self):
        self.start()
        link = self.root / "alias"
        try:
            link.symlink_to(self.root, target_is_directory=True)
        except OSError:
            self.skipTest("this account cannot create symlinks")
        code, data, _ = run("open", "--root", str(self.root), "--root", str(link))
        self.assertEqual((code, len(data["sessions"])), (0, 1))

    def test_open_rejects_a_pattern_that_is_not_relative(self):
        code, _, err = run("open", "--root", str(self.root), "--glob", "/abs/*")
        self.assertEqual(code, 2)
        self.assertIn("--glob", err)


if __name__ == "__main__":
    unittest.main()
