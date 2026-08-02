#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Tests for update_ticket.py — run: uv run python -m unittest discover -s scripts/tests"""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parent.parent / "update_ticket.py"

STORY = """---
schema: 1
id: ALRT-12
type: story
title: "Rule CRUD"
status: backlog
depends_on: []
covers: [CAP-4, FR-12]
discovered_from: ""
risk: 3
hitl: true
created: 2026-08-01
---

# ALRT-12 — Rule CRUD

## Context

Body must never change.
"""

BUG = STORY.replace("type: story", "type: bug").replace("id: ALRT-12", "id: ALRT-20") \
           .replace("risk: 3", "severity: 3\nrisk: 3")

EPIC = """---
schema: 1
id: ALRT-3
type: epic
title: "Alert rules"
description: "Rules people can manage"
depends_on: []
covers: [CAP-4]
risk: 3
created: 2026-08-01
---

# ALRT-3 — Alert rules
"""


def run(*args):
    proc = subprocess.run([sys.executable, str(SCRIPT), *args],
                          capture_output=True, text=True)
    return proc.returncode, json.loads(proc.stdout)


class UpdateTicketTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "alert-rules").mkdir()
        self.story = self.root / "alert-rules" / "ALRT-12-rule-crud.md"
        self.story.write_text(STORY, encoding="utf-8")
        self.bug = self.root / "ALRT-20-crash.md"
        self.bug.write_text(BUG, encoding="utf-8")
        self.epic = self.root / "alert-rules" / "ticket.md"
        self.epic.write_text(EPIC, encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def test_legal_transition(self):
        code, out = run("--path", str(self.story), "--set", "status=in-progress")
        self.assertEqual(code, 0)
        self.assertEqual(out["changes"]["status"]["to"], "in-progress")
        self.assertIn("status: in-progress", self.story.read_text())

    def test_illegal_transition_names_legal_moves_and_force(self):
        code, out = run("--path", str(self.story), "--set", "status=done")
        self.assertEqual(code, 1)
        self.assertIn("backlog -> done not allowed", out["error"])
        self.assertIn("in-progress", out["error"])
        self.assertIn("--force", out["error"])
        self.assertIn("status: backlog", self.story.read_text())  # untouched

    def test_force_allows_any_known_state(self):
        code, out = run("--path", str(self.story), "--set", "status=done", "--force")
        self.assertEqual(code, 0)
        self.assertIn("status: done", self.story.read_text())

    def test_force_still_refuses_gibberish(self):
        code, out = run("--path", str(self.story), "--set", "status=wip", "--force")
        self.assertEqual(code, 1)
        self.assertIn("unknown status", out["error"])

    def test_unknown_status_rejected(self):
        code, out = run("--path", str(self.story), "--set", "status=ready-for-dev")
        self.assertEqual(code, 1)
        self.assertIn("unknown status", out["error"])

    def test_epic_status_intentional_only(self):
        code, out = run("--path", str(self.epic), "--set", "status=in-progress")
        self.assertEqual(code, 1)
        self.assertIn("dropped", out["error"])
        # Structural, not a transition rule: --force does not open it.
        code, out = run("--path", str(self.epic), "--set", "status=in-progress", "--force")
        self.assertEqual(code, 1)
        # done and dropped are both storable — intentional human calls.
        code, out = run("--path", str(self.epic), "--set", "status=done")
        self.assertEqual(code, 0)
        self.assertIn("status: done", self.epic.read_text())
        code, out = run("--path", str(self.epic), "--set", "status=dropped")
        self.assertEqual(code, 0)
        self.assertIn("status: dropped", self.epic.read_text())

    def test_insert_and_replace_adjacent_lines_both_land(self):
        # status is absent on the epic (insert after type:) while title is the
        # very next line (replace) — both must survive the splice.
        code, out = run("--path", str(self.epic), "--set", "status=done",
                        "--set", "title=Renamed epic")
        self.assertEqual(code, 0)
        text = self.epic.read_text()
        self.assertIn("status: done", text)
        self.assertIn('title: "Renamed epic"', text)
        self.assertEqual(text.count("title:"), 1)
        self.assertEqual(text.count("description:"), 1)

    def test_newline_in_value_refused(self):
        code, out = run("--path", str(self.story),
                        "--set", "title=Pwned\n---\njunk: yes")
        self.assertEqual(code, 1)
        self.assertIn("single line", out["error"])
        self.assertIn('title: "Rule CRUD"', self.story.read_text())  # untouched

    def test_cycle_rejected_through_block_style_dep(self):
        # ALRT-13 declares its dep in block form; the gate must still see it.
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            STORY.replace("id: ALRT-12", "id: ALRT-13")
                 .replace("depends_on: []", "depends_on:\n  - ALRT-12"))
        code, out = run("--root", str(self.root), "--id", "ALRT-12",
                        "--set", "depends_on=ALRT-13")
        self.assertEqual(code, 1)
        self.assertIn("cycle", out["error"])

    def test_quoted_id_resolves(self):
        quoted = self.root / "ALRT-77-quoted.md"
        quoted.write_text(STORY.replace("id: ALRT-12", 'id: "ALRT-77"'))
        code, out = run("--root", str(self.root), "--id", "ALRT-77",
                        "--set", "status=in-progress")
        self.assertEqual(code, 0)
        self.assertTrue(out["file"].endswith("ALRT-77-quoted.md"))

    def test_duplicate_id_refused(self):
        (self.root / "ALRT-12-clone.md").write_text(STORY)
        code, out = run("--root", str(self.root), "--id", "ALRT-12",
                        "--set", "status=in-progress")
        self.assertEqual(code, 1)
        self.assertIn("duplicated", out["error"])

    def test_malformed_target_fails_json_clean(self):
        bad = self.root / "ALRT-88-bad.md"
        bad.write_text("---\nschema: 1\nid: ALRT-88\ntype: task\n")  # unterminated
        code, out = run("--path", str(bad), "--set", "status=in-progress")
        self.assertEqual(code, 1)
        self.assertIn("unterminated", out["error"])

    def test_immutable_fields(self):
        for spec in ("id=ALRT-99", "type=task", "created=2026-01-01", "schema=2"):
            code, out = run("--path", str(self.story), "--set", spec)
            self.assertEqual(code, 1)
            self.assertIn("immutable", out["error"])

    def test_severity_only_on_bugs(self):
        code, out = run("--path", str(self.story), "--set", "severity=4")
        self.assertEqual(code, 1)
        code, out = run("--path", str(self.bug), "--set", "severity=5")
        self.assertEqual(code, 0)
        self.assertIn("severity: 5", self.bug.read_text())

    def test_int_bounds(self):
        code, out = run("--path", str(self.story), "--set", "risk=6")
        self.assertEqual(code, 1)
        self.assertIn("1-5", out["error"])

    def test_hitl_raised_when_risk_crosses_threshold(self):
        low = self.root / "ALRT-50-low.md"
        low.write_text(STORY.replace("id: ALRT-12", "id: ALRT-50")
                            .replace("risk: 3", "risk: 2")
                            .replace("hitl: true", "hitl: false"))
        code, out = run("--path", str(low), "--set", "risk=4")
        self.assertEqual(code, 0)
        text = low.read_text()
        self.assertIn("risk: 4", text)
        self.assertIn("hitl: true", text)

    def test_hitl_never_lowered_automatically(self):
        code, out = run("--path", str(self.story), "--set", "risk=1")
        self.assertEqual(code, 0)
        self.assertIn("hitl: true", self.story.read_text())

    def test_cycle_rejected(self):
        # ALRT-13 already depends on ALRT-12; the reverse edge closes a cycle.
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            STORY.replace("id: ALRT-12", "id: ALRT-13")
                 .replace("depends_on: []", "depends_on: [ALRT-12]"))
        code, out = run("--root", str(self.root), "--id", "ALRT-12",
                        "--set", "depends_on=ALRT-13")
        self.assertEqual(code, 1)
        self.assertIn("cycle", out["error"])
        self.assertIn("ALRT-12", out["error"])

    def test_risk_hitl_any_combination(self):
        # The user's call wins: any allowed values in any combination.
        code, out = run("--path", str(self.story), "--set", "risk=5", "--set", "hitl=false")
        self.assertEqual(code, 0)
        text = self.story.read_text()
        self.assertIn("risk: 5", text)
        self.assertIn("hitl: false", text)

    def test_depends_on_validated_against_tree(self):
        code, out = run("--root", str(self.root), "--id", "ALRT-12",
                        "--set", "depends_on=ALRT-99")
        self.assertEqual(code, 1)
        self.assertIn("not found in the tree", out["error"])
        code, out = run("--root", str(self.root), "--id", "ALRT-12",
                        "--set", "depends_on=ALRT-3,ALRT-20")
        self.assertEqual(code, 0)
        self.assertIn("depends_on: [ALRT-3, ALRT-20]", self.story.read_text())

    def test_self_dependency_rejected(self):
        code, out = run("--path", str(self.story), "--set", "depends_on=ALRT-12")
        self.assertEqual(code, 1)
        self.assertIn("itself", out["error"])

    def test_find_by_id(self):
        code, out = run("--root", str(self.root), "--id", "ALRT-20",
                        "--set", "status=in-progress")
        self.assertEqual(code, 0)
        self.assertTrue(out["file"].endswith("ALRT-20-crash.md"))

    def test_body_untouched(self):
        before = self.story.read_text().split("---", 2)[2]
        run("--path", str(self.story), "--set", "status=in-progress",
            "--set", "risk=2", "--set", "title=New title")
        after = self.story.read_text().split("---", 2)[2]
        self.assertEqual(before, after)

    def test_noop_reports_unchanged(self):
        code, out = run("--path", str(self.story), "--set", "status=backlog")
        self.assertEqual(code, 0)
        self.assertEqual(out["changes"], {})
        self.assertEqual(out["unchanged"], ["status"])

    def test_custom_transitions(self):
        code, out = run("--path", str(self.story), "--set", "status=done",
                        "--transitions", "backlog>done")
        self.assertEqual(code, 0)
        self.assertIn("status: done", self.story.read_text())

    def test_unknown_field(self):
        code, out = run("--path", str(self.story), "--set", "points=5")
        self.assertEqual(code, 1)
        self.assertIn("not writable", out["error"])


if __name__ == "__main__":
    unittest.main()
