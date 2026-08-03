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

    def test_epic_dep_releases_only_when_marked_done(self):
        # All children done — epic done is intentional, never computed.
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="done", deps="[ALRT-12]"))
        code, out = run("frontier", "--root", str(self.root))
        ids = [t["id"] for t in out["frontier"]]
        self.assertNotIn("ALRT-31", ids)   # still gated: nobody marked the epic done
        # Retrospective/user stores done on the envelope — now it releases.
        (self.root / "alert-rules" / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\nstatus: done\n'))
        code, out = run("frontier", "--root", str(self.root))
        ids = [t["id"] for t in out["frontier"]]
        self.assertIn("ALRT-31", ids)

    def test_board_states(self):
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["epics"]}
        self.assertEqual(states["ALRT-3"], "in-progress")  # one done, one backlog
        self.assertEqual(states["ALRT-40"], "not-started")  # childless
        self.assertEqual(out["blocked"][0]["id"], "ALRT-31")
        self.assertEqual(out["leaf_totals"]["done"], 1)

    def test_board_all_children_done_is_still_in_progress(self):
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="done", deps="[ALRT-12]"))
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["epics"]}
        self.assertEqual(states["ALRT-3"], "in-progress")  # done is never computed

    def test_board_all_dropped_epic_is_not_started(self):
        for name, tid in (("ALRT-12-rule-crud.md", "ALRT-12"),
                          ("ALRT-13-rule-eval.md", "ALRT-13")):
            (self.root / "alert-rules" / name).write_text(
                ticket(tid, "story", "x", status="dropped"))
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["epics"]}
        self.assertEqual(states["ALRT-3"], "not-started")  # abandoned != shipped
        code, out = run("frontier", "--root", str(self.root))
        self.assertNotIn("ALRT-31", [t["id"] for t in out["frontier"]])

    def test_board_stored_done_wins(self):
        (self.root / "reporting" / "ticket.md").write_text(ticket(
            "ALRT-40", "epic", "Reporting",
            extra='description: "Reports"\nstatus: done\n'))
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["epics"]}
        self.assertEqual(states["ALRT-40"], "done")

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

    def test_graph_lanes_and_mermaid(self):
        code, out = run("graph", "--root", str(self.root), "--mermaid")
        self.assertEqual(code, 0)
        self.assertIn("ALRT-12", out["lanes"][0])   # no deps
        self.assertIn("ALRT-13", out["lanes"][1])   # depends on ALRT-12
        self.assertEqual(len(out["critical_path"]), 2)
        self.assertIn(out["critical_path"], [["ALRT-12", "ALRT-13"], ["ALRT-3", "ALRT-31"]])
        self.assertIn("flowchart TD", out["mermaid"])
        self.assertIn("ALRT_12 --> ALRT_13", out["mermaid"])
        self.assertIn("ALRT_3 --> ALRT_31", out["mermaid"])

    def test_coverage_proposed(self):
        code, out = run("coverage", "--root", str(self.root),
                        "--require", "CAP-4,CAP-9", "--proposed", "CAP-9")
        self.assertEqual(out["uncovered"], [])
        self.assertEqual(out["proposed"], ["CAP-9"])
        self.assertNotIn("CAP-9", out["covered"])  # proposed is never real coverage

    def test_validate_flags_duplicate_ids(self):
        (self.root / "ALRT-31-dupe.md").write_text(
            ticket("ALRT-31", "task", "Snooze dupe"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("duplicate id ALRT-31", msgs)

    def test_malformed_file_is_an_error_not_invisible(self):
        (self.root / "ALRT-50-broken.md").write_text(
            "---\nschema: 1\nid: ALRT-50\ntype: task\n")  # unterminated block
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("failed to parse", msgs)
        code, out = run("next-id", "--root", str(self.root))
        self.assertEqual(out["id"], "ALRT-41")  # broken file can't be counted...
        self.assertTrue(out.get("warnings"))    # ...so the caller is warned

    def test_validate_flags_unclosed_inline_list(self):
        (self.root / "ALRT-51-badlist.md").write_text(
            ticket("ALRT-51", "task", "Bad list").replace(
                "depends_on: []", "depends_on: [ALRT-12, ALRT-13"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("failed to parse", msgs)

    def test_validate_flags_orphan_leaf_folder(self):
        orphan = self.root / "alert-rules" / "notes"
        orphan.mkdir()
        (orphan / "ALRT-52-orphan.md").write_text(ticket("ALRT-52", "task", "Orphan"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("no epic ticket.md", msgs)

    def test_scalar_dep_is_not_iterated_charwise(self):
        (self.root / "ALRT-53-scalar.md").write_text(
            ticket("ALRT-53", "task", "Scalar dep").replace(
                "depends_on: []", "depends_on: ALRT-13"))
        code, out = run("board", "--root", str(self.root))
        blocked = {b["id"]: b["waiting_on"] for b in out["blocked"]}
        self.assertEqual(blocked["ALRT-53"], ["ALRT-13"])  # one id, not 7 characters
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)  # still a schema violation validate names
        self.assertIn("must be a list",
                      " | ".join(e["error"] for e in out["errors"]))

    def test_validate_path_skips_treewide_cycle(self):
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", deps="[ALRT-12]"))
        (self.root / "alert-rules" / "ALRT-12-rule-crud.md").write_text(
            ticket("ALRT-12", "story", "Rule CRUD", status="done", deps="[ALRT-13]"))
        code, out = run("validate", "--root", str(self.root),
                        "--path", str(self.root / "ALRT-31-snooze.md"))
        self.assertEqual(code, 0, out)  # the cycle lives in two other files

    def test_graph_survives_deep_chains(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / "index.md").write_text("---\nkey: DEEP\n---\n")
            n = 1200  # past the default recursion limit
            for i in range(1, n + 1):
                deps = f"[DEEP-{i - 1}]" if i > 1 else "[]"
                (root / f"DEEP-{i}-t.md").write_text(
                    ticket(f"DEEP-{i}", "task", f"t{i}", deps=deps))
            code, out = run("graph", "--root", str(root))
            self.assertEqual(code, 0)
            self.assertTrue(out["ok"])
            self.assertEqual(len(out["lanes"]), n)
            self.assertEqual(len(out["critical_path"]), n)

    def _finish_alert_rules(self):
        (self.root / "alert-rules" / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\nstatus: done\n'))
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="done",
                   deps="[ALRT-12]", covers="[CAP-5]"))

    def test_archive_moves_leaves_and_drops_satisfied_edges(self):
        self._finish_alert_rules()
        (self.root / "ALRT-45-followup.md").write_text(
            ticket("ALRT-45", "task", "Follow-up", deps="[ALRT-12, ALRT-40]"))
        code, out = run("archive", "--root", str(self.root),
                        "--epic", "ALRT-3", "--date", "2026-08-02")
        self.assertEqual(code, 0, out)
        self.assertEqual(out["archived"], ["ALRT-12", "ALRT-13"])
        dest = self.root / ".archive" / "2026-08-02-alert-rules"
        self.assertTrue((dest / "ALRT-12-rule-crud.md").is_file())
        self.assertFalse((self.root / "alert-rules" / "ALRT-12-rule-crud.md").exists())
        self.assertTrue((self.root / "alert-rules" / "ticket.md").is_file())  # envelope stays
        # satisfied edge into the archive dropped; unrelated edge kept
        self.assertIn("depends_on: [ALRT-40]",
                      (self.root / "ALRT-45-followup.md").read_text())
        # archived leaves are off the board everywhere
        code, out = run("list", "--root", str(self.root))
        ids = [r["id"] for r in out["tickets"]]
        self.assertNotIn("ALRT-12", ids)
        self.assertIn("ALRT-3", ids)
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 0, out)

    def test_archive_refuses_unfinished(self):
        code, out = run("archive", "--root", str(self.root), "--epic", "ALRT-3")
        self.assertEqual(code, 1)
        self.assertIn("not marked done", out["error"])
        (self.root / "alert-rules" / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\nstatus: done\n'))
        code, out = run("archive", "--root", str(self.root), "--epic", "ALRT-3")
        self.assertEqual(code, 1)  # ALRT-13 still backlog
        self.assertIn("still open", out["error"])
        self.assertIn("ALRT-13", out["error"])

    def test_archive_refuses_dep_on_dropped_leaf(self):
        self._finish_alert_rules()
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="dropped"))
        (self.root / "ALRT-46-waiting.md").write_text(
            ticket("ALRT-46", "task", "Waiting", deps="[ALRT-13]"))
        code, out = run("archive", "--root", str(self.root), "--epic", "ALRT-3")
        self.assertEqual(code, 1)
        self.assertIn("dropped", out["error"])
        self.assertIn("ALRT-46", out["error"])

    def test_archive_purge_deletes(self):
        self._finish_alert_rules()
        code, out = run("archive", "--root", str(self.root),
                        "--epic", "ALRT-3", "--purge")
        self.assertEqual(code, 0, out)
        self.assertEqual(out["purged"], ["ALRT-12", "ALRT-13"])
        self.assertIsNone(out["dest"])
        self.assertFalse((self.root / ".archive").exists())
        self.assertFalse((self.root / "alert-rules" / "ALRT-12-rule-crud.md").exists())

    def test_archived_ids_never_reissued(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / "index.md").write_text("---\nkey: NEW\n---\n")
            e = root / "one"
            e.mkdir()
            (e / "ticket.md").write_text(ticket(
                "NEW-1", "epic", "One", extra='description: "x"\nstatus: done\n'))
            (e / "NEW-2-only.md").write_text(
                ticket("NEW-2", "task", "Only", status="done"))
            code, out = run("archive", "--root", str(root), "--epic", "NEW-1")
            self.assertEqual(code, 0, out)
            code, out = run("next-id", "--root", str(root))
            self.assertEqual(out["id"], "NEW-3")  # NEW-2 lives in .archive, still owns its id

    def test_render_monofile_view(self):
        out_file = self.root / "epics-and-stories.md"
        code, out = run("render", "--root", str(self.root), "--out", str(out_file))
        self.assertEqual(code, 0)
        text = out_file.read_text()
        self.assertIn("Generated from the ticket tree", text)
        self.assertIn("## ALRT-3 — Alert rules [in-progress]", text)
        self.assertIn("### ALRT-12 — Rule CRUD [done] (story, risk 2)", text)
        self.assertIn("## Bin", text)
        self.assertIn("### ALRT-31 — Snooze button [backlog] (task, risk 2)", text)
        # A status flip in the tree shows up on re-render — the tree is truth.
        (self.root / "alert-rules" / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="in-progress",
                   deps="[ALRT-12]", covers="[CAP-5]"))
        run("render", "--root", str(self.root), "--out", str(out_file))
        self.assertIn("ALRT-13 — Rule eval [in-progress]", out_file.read_text())

    def test_mermaid_sanitizes_hostile_ids_and_titles(self):
        (self.root / "KEY-n-template.md").write_text(
            "---\nschema: 1\nid: [KEY-n]\ntype: story\n"
            'title: "[Outcome] with \\"quotes\\""\nstatus: backlog\n'
            "depends_on: []\ncovers: []\nrisk: 2\nhitl: false\n"
            "created: 2026-08-01\n---\n\n# x\n")
        code, out = run("graph", "--root", str(self.root), "--mermaid")
        self.assertEqual(code, 0)
        for line in out["mermaid"].splitlines()[1:]:
            if "[" in line:  # node lines: id must be word-safe, label bracket-free
                self.assertRegex(line.strip(), r'^\w+\["[^"\[\]]*"\]$')

    def test_coverage(self):
        code, out = run("coverage", "--root", str(self.root),
                        "--require", "CAP-4,CAP-5,CAP-9")
        self.assertEqual(sorted(out["covered"]["CAP-4"]), ["ALRT-12", "ALRT-3"])
        self.assertEqual(out["uncovered"], ["CAP-9"])


if __name__ == "__main__":
    unittest.main()
