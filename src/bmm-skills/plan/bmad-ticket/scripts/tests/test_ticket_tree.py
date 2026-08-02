#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = []
# ///
"""Tests for ticket_tree.py — run: uv run python -m unittest discover -s scripts/tests"""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parent.parent / "ticket_tree.py"


def ticket(tid, ttype, title, status="backlog", deps="[]", covers="[]", extra=""):
    if ttype == "epic":
        leaf_lines = ""
        if "description:" not in extra:
            extra += f'description: "{title} epic"\n'
    else:
        leaf_lines = f"status: {status}\nhitl: false\n"
    return (f"---\nschema: 1\nid: {tid}\ntype: {ttype}\ntitle: \"{title}\"\n"
            f"{leaf_lines}depends_on: {deps}\ncovers: {covers}\n{extra}"
            f"risk: 2\ncreated: 2026-08-01\n---\n\n# {tid}\n")


def run(*args):
    proc = subprocess.run([sys.executable, str(SCRIPT), *args],
                          capture_output=True, text=True)
    return proc.returncode, json.loads(proc.stdout)


class TicketTreeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "index.md").write_text("---\nkey: ALRT\ngenerated: true\n---\n")
        epic = self.root / "alert-rules"
        epic.mkdir()
        (epic / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\n'))
        (epic / "ALRT-12-rule-crud.md").write_text(
            ticket("ALRT-12", "story", "Rule CRUD", status="done", covers="[CAP-4]"))
        (epic / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", deps="[ALRT-12]", covers="[CAP-5]"))
        (self.root / "ALRT-31-snooze.md").write_text(
            ticket("ALRT-31", "task", "Snooze button", deps="[ALRT-3]"))
        # empty epic → unsliced
        e2 = self.root / "reporting"
        e2.mkdir()
        (e2 / "ticket.md").write_text(ticket("ALRT-40", "epic", "Reporting"))

    def tearDown(self):
        self.tmp.cleanup()

    def test_next_id_reads_key_from_index(self):
        code, out = run("next-id", "--root", str(self.root))
        self.assertEqual(code, 0)
        self.assertEqual(out["id"], "ALRT-41")

    def test_next_id_empty_tree(self):
        with tempfile.TemporaryDirectory() as d:
            code, out = run("next-id", "--root", d, "--key", "NEW")
            self.assertEqual(out["id"], "NEW-1")

    def test_index_regenerates_and_keeps_key(self):
        code, out = run("index", "--root", str(self.root))
        self.assertEqual(code, 0)
        text = (self.root / "index.md").read_text()
        self.assertIn("key: ALRT", text)
        self.assertIn("* [Alert rules](alert-rules/ticket.md) - Rules people manage", text)
        self.assertIn("  * [Rule CRUD](alert-rules/ALRT-12-rule-crud.md)", text)
        self.assertIn("* [Snooze button](ALRT-31-snooze.md)", text)
        self.assertNotIn("status", text.split("---")[2])  # identity only, no state

    def test_frontier_dep_gating(self):
        code, out = run("frontier", "--root", str(self.root))
        ids = [t["id"] for t in out["frontier"]]
        self.assertIn("ALRT-13", ids)      # dep ALRT-12 is done
        self.assertNotIn("ALRT-31", ids)   # dep is epic ALRT-3, not computed done
        self.assertNotIn("ALRT-12", ids)   # already done

    def test_epic_dep_releases_when_children_done(self):
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="done", deps="[ALRT-12]"))
        code, out = run("frontier", "--root", str(self.root))
        ids = [t["id"] for t in out["frontier"]]
        self.assertIn("ALRT-31", ids)      # epic now computed done

    def test_board_states(self):
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["epics"]}
        self.assertEqual(states["ALRT-3"], "in-progress")  # one done, one backlog
        self.assertEqual(states["ALRT-40"], "unsliced")
        self.assertEqual(out["blocked"][0]["id"], "ALRT-31")
        self.assertEqual(out["leaf_totals"]["done"], 1)

    def test_validate_clean_tree(self):
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 0, out)
        self.assertTrue(out["ok"])
        self.assertEqual(out["errors"], [])

    def test_validate_catches_unfilled_template(self):
        bad = self.root / "KEY-n-something.md"
        bad.write_text("---\nschema: 1\nid: [KEY-n]\ntype: story\n"
                       'title: "[Outcome-focused title]"\nstatus: backlog\n'
                       "depends_on: []\ncovers: []\nrisk: [1-5]\nhitl: [true|false]\n"
                       "created: [YYYY-MM-DD]\n---\n\n# x\n")
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("placeholder", msgs)
        self.assertIn("risk", msgs)

    def test_validate_epic_lifecycle_rule(self):
        (self.root / "reporting" / "ticket.md").write_text(
            ticket("ALRT-40", "epic", "Reporting").replace(
                "depends_on: []", "status: in-progress\ndepends_on: []"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        self.assertIn("dropped", out["errors"][0]["error"])

    def test_validate_detects_cycle(self):
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", deps="[ALRT-12]"))
        (self.root / "alert-rules" / "ALRT-12-rule-crud.md").write_text(
            ticket("ALRT-12", "story", "Rule CRUD", status="done", deps="[ALRT-13]"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("cycle", msgs)

    def test_list(self):
        code, out = run("list", "--root", str(self.root))
        self.assertEqual(code, 0)
        rows = {r["id"]: r for r in out["tickets"]}
        self.assertEqual(rows["ALRT-12"]["status"], "done")
        self.assertTrue(rows["ALRT-3"]["path"].endswith("ticket.md"))

    def test_coverage_proposed(self):
        code, out = run("coverage", "--root", str(self.root),
                        "--require", "CAP-4,CAP-9", "--proposed", "CAP-9")
        self.assertEqual(out["uncovered"], [])
        self.assertIn("(proposed)", out["covered"]["CAP-9"])

    def test_coverage(self):
        code, out = run("coverage", "--root", str(self.root),
                        "--require", "CAP-4,CAP-5,CAP-9")
        self.assertEqual(sorted(out["covered"]["CAP-4"]), ["ALRT-12", "ALRT-3"])
        self.assertEqual(out["uncovered"], ["CAP-9"])


if __name__ == "__main__":
    unittest.main()
