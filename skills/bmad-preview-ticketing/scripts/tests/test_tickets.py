import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "tickets.py"


def ticket(
    status, blocked_by="[]", hitl="false", ticket_id='""', assignee='""', blocked_at=None, kind="story", refined="false"
):
    lines = [
        "---",
        f"id: {ticket_id}",
        'remote: ""',
        f"type: {kind}",
        'title: "x"',
        "parent: EPIC-1",
        "covers: [R1]",
        f"blocked_by: {blocked_by}",
        f"assignee: {assignee}",
        f"status: {status}",
        f"refined: {refined}",
        f"hitl: {hitl}",
        "risk: low",
    ]
    if blocked_at:
        lines.append(f'blocked_at: "{blocked_at}"')
    lines += ["---", "", "# x", ""]
    return "\n".join(lines)


def run(*args):
    return subprocess.run([sys.executable, str(SCRIPT), *args], text=True, capture_output=True, check=False)


class TicketsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "_bmad" / "custom").mkdir(parents=True)
        self.epic = self.root / "out" / "epic-cart"
        self.epic.mkdir(parents=True)
        (self.epic / "epic-cart.md").write_text("---\ntype: epic\nstatus: backlog\n---\n# Cart\n")
        self.write_store("repo")

    def tearDown(self):
        self.tmp.cleanup()

    def write_store(self, name):
        (self.root / "_bmad" / "custom" / "ticketing-store-config.toml").write_text(f'[tickets]\nstore = "{name}"\n')

    def add(self, name, text):
        (self.epic / name).write_text(text)

    def seed(self, s1="draft", s2="draft", s3="draft"):
        self.add("story-01-scaffold.md", ticket(s1, hitl="true"))
        self.add("story-02-ui-shell.md", ticket(s2))
        self.add("story-03-tracer.md", ticket(s3, blocked_by="[1, 2]"))
        self.add("story-04-codes.md", ticket("draft", blocked_by="[story-03-tracer]"))
        self.add("spike-05-tax.md", ticket("draft", blocked_by="[3]", kind="spike"))

    def next(self, *extra):
        r = run("next", str(self.epic), *extra)
        self.assertEqual(r.returncode, 0, r.stderr)
        return json.loads(r.stdout)

    def files(self, rows):
        return [r["file"] for r in rows]

    def test_drafts_with_no_blockers_are_ready_to_refine(self):
        self.seed()
        out = self.next()
        self.assertEqual(self.files(out["ready_to_refine"]), ["story-01-scaffold.md", "story-02-ui-shell.md"])
        self.assertEqual(out["ready_to_start"], [])
        self.assertEqual(self.files(out["blocked"]), ["story-03-tracer.md", "story-04-codes.md", "spike-05-tax.md"])
        self.assertTrue(out["ready_to_refine"][0]["hitl"])

    def test_unrefined_backlog_ticket_is_never_ready_to_start(self):
        self.seed(s1="done", s2="backlog")
        out = self.next()
        self.assertEqual(out["ready_to_start"], [])
        self.assertIn("story-02-ui-shell.md", self.files(out["ready_to_refine"]))

    def test_backlog_is_ready_to_start_and_ready_set_moves_when_blockers_done(self):
        self.seed(s1="done", s2="backlog")
        self.add("story-02-ui-shell.md", ticket("backlog", refined="true"))
        out = self.next()
        self.assertEqual(self.files(out["ready_to_start"]), ["story-02-ui-shell.md"])
        self.assertIn("story-03-tracer.md", self.files(out["blocked"]))
        self.seed(s1="done", s2="done")
        out = self.next()
        self.assertEqual(self.files(out["ready_to_refine"]), ["story-03-tracer.md"])

    def test_blockers_resolve_by_number_stem_and_id(self):
        self.seed(s1="done", s2="done", s3="done")
        self.add("story-06-by-id.md", ticket("draft", blocked_by="[CART-4]"))
        self.add("story-04-codes.md", ticket("done", blocked_by="[story-03-tracer]", ticket_id='"CART-4"'))
        out = self.next()
        self.assertIn("story-06-by-id.md", self.files(out["ready_to_refine"]))
        self.assertIn("spike-05-tax.md", self.files(out["ready_to_refine"]))

    def test_in_progress_review_and_blocked_at(self):
        self.seed(s1="in-progress", s2="review")
        self.add("story-02-ui-shell.md", ticket("backlog", blocked_at="2026-09-05"))
        out = self.next()
        self.assertEqual(self.files(out["in_progress"]), ["story-01-scaffold.md"])
        self.assertIn("story-02-ui-shell.md", self.files(out["blocked"]))

    def test_status_counts_order_and_chain(self):
        self.seed(s1="done")
        r = run("status", str(self.epic))
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout)
        self.assertEqual([t["n"] for t in out["tickets"]], [1, 2, 3, 4, 5])
        self.assertEqual(out["counts"], {"total": 5, "done": 1, "draft": 4})
        self.assertEqual(out["breakdown"], {"entries": 0, "without_file": 0})
        self.assertEqual(
            out["longest_remaining_chain"], ["story-02-ui-shell.md", "story-03-tracer.md", "story-04-codes.md"]
        )

    def breakdown_epic(self):
        (self.epic / "epic-cart.md").write_text(
            "---\ntype: epic\nstatus: backlog\n---\n# Cart\n\n## Done when\n\n1. x\n\n## Breakdown\n\n"
            "[placeholder line that must not parse]\n"
            "- 01 story — Scaffold; covers: R1\n"
            "- 02 story — UI shell; blocked_by: 01; covers: R1\n"
            "- 03 spike — Tax engine?; blocked_by: 01; covers: R4\n"
            "- 04 story — Codes; blocked_by: 02, 03; covers: R2, R3\n\n## Notes\n\n- Decision: none\n"
        )

    def test_breakdown_entries_without_files_surface_when_unblocked(self):
        self.breakdown_epic()
        self.add("story-01-scaffold.md", ticket("done"))
        out = self.next()
        self.assertEqual(
            [(e["n"], e["type"], e["title"]) for e in out["to_create"]],
            [(2, "story", "UI shell"), (3, "spike", "Tax engine?")],
        )
        self.assertEqual(out["to_create"][1]["covers"], ["R4"])
        self.assertEqual(out["to_create"][1]["blocked_by"], [1])
        self.add("story-02-ui-shell.md", ticket("draft", blocked_by="[1]"))
        out = self.next()
        self.assertEqual([e["n"] for e in out["to_create"]], [3])
        self.assertIn("story-02-ui-shell.md", self.files(out["ready_to_refine"]))
        status = json.loads(run("status", str(self.epic)).stdout)
        self.assertEqual(status["breakdown"], {"entries": 4, "without_file": 2})

    def test_breakdown_entry_blocked_by_unwritten_entry_stays_hidden(self):
        self.breakdown_epic()
        out = self.next()
        self.assertEqual([e["n"] for e in out["to_create"]], [1])

    def test_breakdown_fields_in_either_order_and_malformed_line_errors(self):
        self.breakdown_epic()
        text = (
            (self.epic / "epic-cart.md")
            .read_text()
            .replace(
                "- 02 story — UI shell; blocked_by: 01; covers: R1", "- 02 story — UI shell; covers: R1; blocked_by: 01"
            )
        )
        (self.epic / "epic-cart.md").write_text(text)
        out = self.next()
        self.assertEqual([e["n"] for e in out["to_create"]], [1])
        (self.epic / "epic-cart.md").write_text(
            text.replace(
                "- 03 spike — Tax engine?; blocked_by: 01; covers: R4", "- 03 spike — Tax engine?; blocks: none"
            )
        )
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("unknown field `blocks`", json.loads(r.stderr)["error"])
        (self.epic / "epic-cart.md").write_text(
            text.replace("- 03 spike — Tax engine?; blocked_by: 01; covers: R4", "- 03 Tax engine?")
        )
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("does not match", json.loads(r.stderr)["error"])

    def test_dropped_blocker_still_blocks(self):
        self.breakdown_epic()
        self.add("story-01-scaffold.md", ticket("dropped"))
        self.add("story-02-ui-shell.md", ticket("draft", blocked_by="[1]"))
        out = self.next()
        self.assertEqual(self.files(out["blocked"]), ["story-02-ui-shell.md"])
        self.assertEqual(out["ready_to_refine"], [])
        self.assertEqual(out["to_create"], [])

    def test_breakdown_duplicate_number_and_unknown_blocker_error(self):
        self.breakdown_epic()
        text = (self.epic / "epic-cart.md").read_text()
        (self.epic / "epic-cart.md").write_text(text.replace("- 03 spike", "- 02 spike"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("two entries numbered 02", json.loads(r.stderr)["error"])
        (self.epic / "epic-cart.md").write_text(text.replace("blocked_by: 02, 03", "blocked_by: 02, 09"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("blocked_by 09, which is no entry", json.loads(r.stderr)["error"])

    def test_numeric_blocker_falls_back_to_ticket_id(self):
        self.add("story-01-scaffold.md", ticket("done", ticket_id="101"))
        self.add("story-02-ui-shell.md", ticket("draft", blocked_by="[101]"))
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-02-ui-shell.md"])

    def test_two_files_sharing_a_number_error(self):
        self.add("story-01-a.md", ticket("done"))
        self.add("story-01-b.md", ticket("draft"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("share the number 01", json.loads(r.stderr)["error"])

    def test_malformed_input_returns_json_error(self):
        (self.epic / "story-01-bad.md").write_bytes(ticket("draft").encode().replace(b"# x", b"\xff"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1, r.stderr)
        self.assertIn("error", json.loads(r.stderr))
        (self.epic / "story-01-bad.md").unlink()
        self.seed()
        (self.root / "_bmad" / "custom" / "ticketing-store-config.toml").write_text("[tickets\nstore = ")
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1, r.stderr)
        self.assertIn("error", json.loads(r.stderr))

    def test_unnumbered_leaf_sorts_last_and_container_file_is_ignored(self):
        self.seed()
        self.add("bug-stray.md", ticket("backlog", kind="bug"))
        out = json.loads(run("status", str(self.epic)).stdout)
        self.assertEqual(out["tickets"][-1]["file"], "bug-stray.md")
        self.assertIsNone(out["tickets"][-1]["n"])
        self.assertEqual(out["counts"]["total"], 6)

    def test_mark_rewrites_status_and_assignee_on_repo_store(self):
        self.seed()
        r = run("mark", str(self.epic / "story-01-scaffold.md"), "in-progress", "--assignee", "ann")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(
            json.loads(r.stdout), {"file": "story-01-scaffold.md", "status": "in-progress", "assignee": "ann"}
        )
        text = (self.epic / "story-01-scaffold.md").read_text()
        self.assertIn("status: in-progress\n", text)
        self.assertIn('assignee: "ann"\n', text)
        self.assertIn("# x", text)

    def test_mark_clears_blocking_fields_and_takes_a_literal_assignee(self):
        path = self.epic / "story-01-scaffold.md"
        path.write_text(
            ticket("backlog", blocked_at="2026-09-05").replace("---\n\n# x", 'blocked_reason: "legal"\n---\n\n# x')
        )
        r = run("mark", str(path), "backlog", "--assignee", "\\1")
        self.assertEqual(r.returncode, 0, r.stderr)
        text = path.read_text()
        self.assertIn('blocked_at: ""\n', text)
        self.assertIn('blocked_reason: ""\n', text)
        self.assertIn('assignee: "\\1"\n', text)
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-01-scaffold.md"])

    def test_project_root_flag_finds_the_store_for_tickets_outside_the_project(self):
        self.write_store("jira")
        outside = tempfile.TemporaryDirectory()
        self.addCleanup(outside.cleanup)
        folder = Path(outside.name) / "epic-cart"
        folder.mkdir()
        (folder / "story-01-scaffold.md").write_text(ticket("draft"))
        self.assertEqual(json.loads(run("next", str(folder)).stdout)["store"], "repo")
        r = run("--project-root", str(self.root), "next", str(folder))
        self.assertEqual(r.returncode, 2)
        r = run("--project-root", str(self.root), "mark", str(folder / "story-01-scaffold.md"), "done")
        self.assertEqual(r.returncode, 2)

    def test_mark_refuses_on_tracker_store(self):
        self.write_store("jira")
        self.seed()
        r = run("mark", str(self.epic / "story-01-scaffold.md"), "done")
        self.assertEqual(r.returncode, 2)
        self.assertIn("write verb", r.stderr)

    def test_next_on_tracker_store_needs_synced_flag(self):
        self.write_store("linear")
        self.seed()
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 2)
        self.assertIn("sync", r.stderr)
        self.assertEqual(self.next("--synced")["store"], "linear")

    def test_cycle_unknown_blocker_and_bad_status_are_errors(self):
        self.seed()
        self.add("story-01-scaffold.md", ticket("draft", blocked_by="[3]"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("cycle", r.stderr)
        self.add("story-01-scaffold.md", ticket("draft", blocked_by="[9]"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("matches no sibling", r.stderr)
        self.add("story-01-scaffold.md", ticket("todo"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("status", r.stderr)


if __name__ == "__main__":
    unittest.main()
