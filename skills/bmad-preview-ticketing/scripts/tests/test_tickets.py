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
        self.initiative = self.root / "out" / "initiative-checkout"
        self.epic = self.add_epic("epic-cart")
        self.write_store("repo")

    def tearDown(self):
        self.tmp.cleanup()

    def write_store(self, name):
        (self.root / "_bmad" / "custom" / "ticketing-store-config.toml").write_text(f'[tickets]\nstore = "{name}"\n')

    def add_epic(self, slug, status="backlog", blocked_by="[]"):
        folder = self.initiative / slug
        folder.mkdir(parents=True)
        (folder / f"{slug}.md").write_text(
            f"---\ntype: epic\nstatus: {status}\nblocked_by: {blocked_by}\n---\n# {slug}\n"
        )
        return folder

    def add(self, name, text, folder=None):
        ((folder or self.epic) / name).write_text(text)

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
        self.assertEqual(out["longest_remaining_chain"], ["epic-cart/02", "epic-cart/03", "epic-cart/04"])

    BREAKDOWN = """
[[entry]]
n = 1
type = "story"
title = "Scaffold"
covers = ["R1"]

[[entry]]
n = 2
type = "story"
title = "UI shell"
blocked_by = [1]
covers = ["R1"]

[[entry]]
n = 3
type = "spike"
title = "Tax engine?"
blocked_by = ["01"]
covers = ["R4"]
hitl = true

[[entry]]
n = 4
type = "story"
title = "Codes"
blocked_by = [2, 3]
covers = ["R2", "R3"]
"""

    def breakdown_epic(self, text=None):
        (self.epic / "tickets.toml").write_text(text or self.BREAKDOWN, encoding="utf-8")

    def test_text_outside_ascii_is_read_and_written_as_utf8(self):
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Scaffold"', 'title = "Café ✓ menu"'))
        r = subprocess.run([sys.executable, str(SCRIPT), "next", str(self.epic)], capture_output=True, check=False)
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout.decode("utf-8"))
        self.assertEqual(out["to_pull"][0]["title"], "Café ✓ menu")
        r = subprocess.run([sys.executable, str(SCRIPT), "pull", str(self.epic), "1"], capture_output=True, check=False)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("# Café ✓ menu", (self.epic / "story-01-caf-menu.md").read_text(encoding="utf-8"))

    def test_planned_entries_surface_when_unblocked(self):
        self.breakdown_epic()
        self.add("story-01-scaffold.md", ticket("done"))
        out = self.next()
        self.assertEqual(
            [(e["n"], e["type"], e["title"]) for e in out["to_pull"]],
            [(2, "story", "UI shell"), (3, "spike", "Tax engine?")],
        )
        self.assertEqual(out["to_pull"][1]["covers"], ["R4"])
        self.assertEqual(out["to_pull"][1]["blocked_by"], ["01"])
        self.assertTrue(out["to_pull"][1]["hitl"])
        self.assertEqual([e["n"] for e in out["blocked"]], [4])
        self.add("story-02-ui-shell.md", ticket("draft", blocked_by="[1]"))
        out = self.next()
        self.assertEqual([e["n"] for e in out["to_pull"]], [3])
        self.assertIn("story-02-ui-shell.md", self.files(out["ready_to_start"]))
        status = json.loads(run("status", str(self.epic)).stdout)
        self.assertEqual(status["counts"], {"total": 4, "done": 1, "draft": 1, "planned": 2})
        self.assertEqual(status["tickets"][0]["blocks"], ["epic-cart/02", "epic-cart/03"])

    def test_entry_blocked_by_unwritten_entry_stays_blocked(self):
        self.breakdown_epic()
        out = self.next()
        self.assertEqual([e["n"] for e in out["to_pull"]], [1])

    def test_file_blockers_win_over_the_entry_and_status_flags_the_drift(self):
        self.breakdown_epic()
        self.add("story-01-scaffold.md", ticket("draft"))
        self.add("story-02-ui-shell.md", ticket("draft", blocked_by="[]"))
        self.assertIn("story-02-ui-shell.md", self.files(self.next()["ready_to_start"]))
        rows = json.loads(run("status", str(self.epic)).stdout)["tickets"]
        self.assertTrue(rows[1]["drift"])
        self.assertNotIn("drift", rows[0])

    def test_pull_writes_the_leaf_and_only_a_refine_entry_waits_for_refinement(self):
        self.breakdown_epic(
            self.BREAKDOWN.replace(
                'title = "Scaffold"', 'title = "Scaffold: the cart!"\nverify = "It runs."\nrefine = true'
            )
        )
        r = run("pull", str(self.epic), "1")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(json.loads(r.stdout), {"file": "story-01-scaffold-the-cart.md", "refine": True})
        text = (self.epic / "story-01-scaffold-the-cart.md").read_text(encoding="utf-8")
        self.assertIn("Verify: It runs.", text)
        self.assertIn("covers: [R1]", text)
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-01-scaffold-the-cart.md"])
        self.assertEqual(run("pull", str(self.epic), "1").returncode, 1)
        run("mark", str(self.epic / "story-01-scaffold-the-cart.md"), "done")
        run("pull", str(self.epic), "2")
        out = self.next()
        self.assertEqual(self.files(out["ready_to_start"]), ["story-02-ui-shell.md"])
        self.assertEqual(out["ready_to_start"][0]["blocked_by"], ["01"])

    def test_pull_writes_references_and_notes(self):
        self.breakdown_epic(
            self.BREAKDOWN.replace(
                'title = "Scaffold"',
                'title = "Scaffold"\nunknown = "Which host?"\nreferences = ["SPINE.md#ad-8"]\nnotes = ["Reuse the mailer."]',
            )
        )
        self.assertEqual(run("pull", str(self.epic), "1").returncode, 0)
        text = (self.epic / "story-01-scaffold.md").read_text(encoding="utf-8")
        parent = (self.epic / "epic-cart.md").resolve().relative_to(self.root.resolve()).as_posix()
        self.assertIn(f"## References\n\n- parent — {parent}\n- SPINE.md#ad-8\n", text)
        self.assertIn("## Notes\n\n- Open question: Which host?\n- Reuse the mailer.\n", text)

    def test_a_quoted_title_survives_the_pull(self):
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Scaffold"', "title = 'Say \"hi\"'"))
        self.assertEqual(run("pull", str(self.epic), "1").returncode, 0)
        self.assertEqual(self.next()["ready_to_start"][0]["title"], 'Say "hi"')

    def test_references_must_be_a_list(self):
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Scaffold"', 'title = "Scaffold"\nreferences = "SPINE.md"'))
        r = run("status", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("`references` must be a list", r.stderr)

    def test_dropped_blocker_still_blocks(self):
        self.breakdown_epic()
        self.add("story-01-scaffold.md", ticket("dropped"))
        self.add("story-02-ui-shell.md", ticket("draft", blocked_by="[1]"))
        out = self.next()
        self.assertEqual(self.files(out["blocked"])[0], "story-02-ui-shell.md")
        self.assertEqual(out["ready_to_refine"], [])
        self.assertEqual(out["to_pull"], [])

    def test_malformed_breakdown_errors(self):
        for text, message in (
            (self.BREAKDOWN.replace("n = 3", "n = 2"), "two entries numbered 02"),
            (self.BREAKDOWN.replace("blocked_by = [2, 3]", "blocked_by = [2, 9]"), "matches no ticket"),
            (self.BREAKDOWN.replace('type = "spike"', 'type = "task"'), "is not one of"),
            (self.BREAKDOWN.replace("n = 4", 'n = "4"'), "integer `n`"),
            ("[[entry]\nn = ", "tickets.toml"),
            ('[entry]\nn = 1\ntype = "story"\n', "[[entry]]"),
            (self.BREAKDOWN.replace('covers = ["R4"]', "covers = 1"), "must be a list"),
        ):
            self.breakdown_epic(text)
            r = run("next", str(self.epic))
            self.assertEqual(r.returncode, 1, text)
            self.assertIn(message, json.loads(r.stderr)["error"])

    def pricing(self):
        pricing = self.add_epic("epic-pricing")
        (pricing / "tickets.toml").write_text(
            '[[entry]]\nn = 1\ntype = "story"\ntitle = "Pricing contract"\n\n'
            '[[entry]]\nn = 2\ntype = "story"\ntitle = "Pricing rules"\nblocked_by = [1]\n'
        )
        return pricing

    def test_ticket_waits_on_an_entry_in_another_epic(self):
        pricing = self.pricing()
        self.breakdown_epic(self.BREAKDOWN.replace("blocked_by = [1]", 'blocked_by = [1, "epic-pricing/01"]'))
        self.add("story-01-scaffold.md", ticket("done"))
        out = self.next()
        self.assertEqual([e["n"] for e in out["to_pull"]], [3])
        self.assertEqual(out["blocked"][0]["blocked_by"], ["01", "epic-pricing/01"])
        self.add("story-01-contract.md", ticket("done"), pricing)
        self.assertEqual([e["n"] for e in self.next()["to_pull"]], [2, 3])

    def test_whole_epic_blocker_and_epic_gate(self):
        pricing = self.pricing()
        self.add("story-01-scaffold.md", ticket("draft", blocked_by="[epic-pricing]"))
        self.assertEqual(self.files(self.next()["blocked"]), ["story-01-scaffold.md"])
        (pricing / "epic-pricing.md").write_text("---\ntype: epic\nstatus: done\n---\n")
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-01-scaffold.md"])
        gated = self.add_epic("epic-tax", blocked_by="[epic-cart]")
        self.add("story-01-rates.md", ticket("draft"), gated)
        out = json.loads(run("next", str(gated)).stdout)
        self.assertEqual(out["blocked"][0]["blocked_by"], [])
        self.assertEqual(out["blocked"][0]["gated_by"], ["epic-cart"])

    def test_gate_deadlock_with_a_ticketless_epic_is_a_cycle(self):
        self.add_epic("epic-tax", blocked_by="[epic-cart]")
        self.add("story-01-scaffold.md", ticket("draft", blocked_by="[epic-tax]"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("cycle", r.stderr)

    def test_ids_resolve_across_epics_and_duplicates_collapse(self):
        pricing = self.pricing()
        self.add("story-01-contract.md", ticket("done", ticket_id='"PRICE-1"'), pricing)
        self.add("story-01-scaffold.md", ticket("draft", blocked_by="[PRICE-1, epic-pricing/1, epic-pricing/01]"))
        out = self.next()
        self.assertEqual(out["ready_to_refine"][0]["blocked_by"], ["epic-pricing/01"])

    def test_malformed_files_name_their_folder(self):
        pricing = self.pricing()
        self.seed()
        cases = (
            (ticket("todo"), "epic-pricing/story-01-contract.md"),
            (ticket("draft").replace("blocked_by: []", "blocked_by:\n  - 1"), "must be inline"),
            (ticket("draft").replace("---\n\n# x", "\n# x"), "does not close"),
        )
        for text, message in cases:
            self.add("story-01-contract.md", text, pricing)
            self.assertIn(message, json.loads(run("next", str(self.epic)).stderr)["error"])
        self.add("story-01-contract.md", ticket("draft"), pricing)
        (pricing / "epic-pricing.md").write_text("---\ntype: epic\nstatus: Finished\n---\n")
        self.assertIn("epic-pricing/epic-pricing.md", json.loads(run("next", str(self.epic)).stderr)["error"])

    def test_cross_epic_unknown_target_and_cycle_error(self):
        pricing = self.pricing()
        for ref, message in (("epic-missing/01", "names no epic"), ("epic-pricing/09", "names no entry")):
            self.add("story-01-scaffold.md", ticket("draft", blocked_by=f"[{ref}]"))
            r = run("next", str(self.epic))
            self.assertEqual(r.returncode, 1)
            self.assertIn(message, json.loads(r.stderr)["error"])
        self.add("story-01-scaffold.md", ticket("draft", blocked_by="[epic-pricing/02]"))
        self.add("story-01-contract.md", ticket("draft", blocked_by="[epic-cart/01]"), pricing)
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("cycle", r.stderr)

    def test_initiative_view_spans_epics_and_reports_unpinned_after(self):
        self.pricing()
        self.breakdown_epic()
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nslug = "epic-pricing"\n\n'
            '[[epic]]\nslug = "epic-cart"\nafter = [{ epic = "epic-pricing", needs = "the pricing contract" }]\n'
        )
        out = json.loads(run("next", str(self.initiative)).stdout)
        self.assertEqual([(e["epic"], e["n"]) for e in out["to_pull"]], [("epic-pricing", 1), ("epic-cart", 1)])
        self.assertEqual(
            out["unpinned_after"], [{"epic": "epic-cart", "after": "epic-pricing", "needs": "the pricing contract"}]
        )
        self.breakdown_epic(self.BREAKDOWN.replace("blocked_by = [1]", 'blocked_by = [1, "epic-pricing/01"]'))
        status = json.loads(run("status", str(self.initiative)).stdout)
        self.assertEqual(status["unpinned_after"], [])
        self.assertEqual(status["counts"], {"total": 6, "planned": 6})
        self.assertEqual([e["slug"] for e in status["epics"]], ["epic-pricing", "epic-cart"])
        self.assertEqual(status["tickets"][0]["blocks"], ["epic-pricing/02", "epic-cart/02"])
        (self.initiative / "tickets.toml").write_text('[[epic]]\nslug = "epic-cart"\nafter = [{ epic = "epic-x" }]\n')
        r = run("status", str(self.initiative))
        self.assertEqual(r.returncode, 1)
        self.assertIn("no epic listed", r.stderr)

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
        text = (self.epic / "story-01-scaffold.md").read_text(encoding="utf-8")
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
        text = path.read_text(encoding="utf-8")
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
        self.assertIn("matches no ticket", r.stderr)
        self.add("story-01-scaffold.md", ticket("todo"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("status", r.stderr)


if __name__ == "__main__":
    unittest.main()
