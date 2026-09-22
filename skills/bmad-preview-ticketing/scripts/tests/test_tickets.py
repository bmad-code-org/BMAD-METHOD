import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "tickets.py"


def ticket(
    status,
    ticket_id=None,
    after="[]",
    hitl="false",
    tracker_id='""',
    assignee='""',
    blocked_at=None,
    kind="story",
    refined="false",
    tracker_status=None,
):
    lines = ["---"]
    if ticket_id is not None:
        lines.append(f"id: {ticket_id}")
    lines += [
        f"tracker_id: {tracker_id}",
        'remote: ""',
        f"type: {kind}",
        'title: "x"',
        "parent: epic-cart",
        "covers: [R1]",
        f"after: {after}",
        f"assignee: {assignee}",
    ]
    if status:
        lines.append(f"status: {status}")
    if tracker_status:
        lines.append(f"tracker_status: {tracker_status}")
    lines += [
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

    def add_epic(self, slug, status="", after="[]"):
        folder = self.initiative / slug
        folder.mkdir(parents=True)
        line = f"status: {status}\n" if status else ""
        (folder / f"{slug}.md").write_text(f"---\ntype: epic\n{line}after: {after}\n---\n# {slug}\n")
        return folder

    def add(self, name, text, folder=None):
        ((folder or self.epic) / name).write_text(text)

    def seed(self, s1="", s2="", s3=""):
        self.add("story-scaffold.md", ticket(s1, 1, hitl="true"))
        self.add("story-ui-shell.md", ticket(s2, 2))
        self.add("story-tracer.md", ticket(s3, 3, after="[1, 2]"))
        self.add("story-codes.md", ticket("", 4, after="[story-tracer]"))
        self.add("spike-tax.md", ticket("", 5, after="[3]", kind="spike"))

    def next(self, *extra):
        r = run("next", str(self.epic), *extra)
        self.assertEqual(r.returncode, 0, r.stderr)
        return json.loads(r.stdout)

    def files(self, rows):
        return [r["file"] for r in rows]

    def test_unstarted_tickets_with_no_prerequisites_are_ready_to_refine(self):
        self.seed()
        out = self.next()
        self.assertEqual(self.files(out["ready_to_refine"]), ["story-scaffold.md", "story-ui-shell.md"])
        self.assertEqual(out["ready_to_start"], [])
        self.assertEqual(self.files(out["blocked"]), ["story-tracer.md", "story-codes.md", "spike-tax.md"])
        self.assertTrue(out["ready_to_refine"][0]["hitl"])

    def test_unrefined_ticket_is_never_ready_to_start(self):
        self.seed(s1="done", s2="draft")
        out = self.next()
        self.assertEqual(out["ready_to_start"], [])
        self.assertIn("story-ui-shell.md", self.files(out["ready_to_refine"]))

    def test_refined_is_ready_to_start_and_ready_set_moves_when_prerequisites_done(self):
        self.seed(s1="done")
        self.add("story-ui-shell.md", ticket("ready-for-dev", 2, refined="true"))
        out = self.next()
        self.assertEqual(self.files(out["ready_to_start"]), ["story-ui-shell.md"])
        self.assertIn("story-tracer.md", self.files(out["blocked"]))
        self.seed(s1="done", s2="done")
        out = self.next()
        self.assertEqual(self.files(out["ready_to_refine"]), ["story-tracer.md"])

    def test_prerequisites_resolve_by_id_stem_and_tracker_id(self):
        self.seed(s1="done", s2="done", s3="done")
        self.add("story-by-id.md", ticket("", 6, after="[CART-4]"))
        self.add("story-codes.md", ticket("done", 4, after="[story-tracer]", tracker_id='"CART-4"'))
        out = self.next()
        self.assertIn("story-by-id.md", self.files(out["ready_to_refine"]))
        self.assertIn("spike-tax.md", self.files(out["ready_to_refine"]))

    def test_in_progress_review_blocked_build_and_blocked_at(self):
        self.seed(s1="in-progress", s2="in-review")
        self.add("story-ui-shell.md", ticket("", 2, blocked_at="2026-09-05"))
        self.add("story-codes.md", ticket("blocked", 4))
        out = self.next()
        self.assertEqual(self.files(out["in_progress"]), ["story-scaffold.md"])
        self.assertEqual(
            self.files(out["blocked"]), ["story-ui-shell.md", "story-tracer.md", "story-codes.md", "spike-tax.md"]
        )
        self.assertEqual([r["state"] for r in out["blocked"]], ["backlog", "backlog", "in-progress", "backlog"])

    def test_tracker_status_wins_over_the_build_status_for_state(self):
        self.seed(s1="in-progress", s2="ready-for-dev")
        self.add("story-scaffold.md", ticket("in-progress", 1, tracker_status="done"))
        self.add("story-ui-shell.md", ticket("", 2, tracker_status="in-progress"))
        out = self.next()
        self.assertEqual(self.files(out["in_progress"]), ["story-ui-shell.md"])
        self.assertEqual(out["in_progress"][0]["status"], "")
        self.assertEqual(self.files(out["blocked"]), ["story-tracer.md", "story-codes.md", "spike-tax.md"])
        self.add("story-ui-shell.md", ticket("", 2, tracker_status="done"))
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-tracer.md"])
        self.add("story-ui-shell.md", ticket("", 2, tracker_status="todo"))
        self.assertIn("tracker_status", run("next", str(self.epic)).stderr)

    def test_status_counts_order_and_chain(self):
        self.seed(s1="done")
        r = run("status", str(self.epic))
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout)
        self.assertEqual([t["id"] for t in out["tickets"]], [1, 2, 3, 4, 5])
        self.assertEqual(out["counts"], {"total": 5, "done": 1, "backlog": 4})
        self.assertEqual(out["longest_remaining_chain"], ["epic-cart/2", "epic-cart/3", "epic-cart/4"])
        self.assertEqual(out["tickets"][2]["blocks"], [4, 5])

    BREAKDOWN = """
[[entry]]
id = 1
type = "story"
title = "Scaffold"
covers = ["R1"]

[[entry]]
id = 2
type = "story"
title = "UI shell"
after = [1]
covers = ["R1"]

[[entry]]
id = 3
type = "spike"
title = "Tax engine?"
after = [1]
covers = ["R4"]
hitl = true

[[entry]]
id = 4
type = "story"
title = "Codes"
after = [2, 3]
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
        self.assertIn("# Café ✓ menu", (self.epic / "story-caf-menu.md").read_text(encoding="utf-8"))

    def test_planned_entries_surface_when_unblocked(self):
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("done", 1))
        out = self.next()
        self.assertEqual(
            [(e["id"], e["type"], e["title"]) for e in out["to_pull"]],
            [(2, "story", "UI shell"), (3, "spike", "Tax engine?")],
        )
        self.assertEqual(out["to_pull"][1]["covers"], ["R4"])
        self.assertEqual(out["to_pull"][1]["after"], [1])
        self.assertTrue(out["to_pull"][1]["hitl"])
        self.assertEqual([e["id"] for e in out["blocked"]], [4])
        self.add("story-ui-shell.md", ticket("", 2, after="[1]"))
        out = self.next()
        self.assertEqual([e["id"] for e in out["to_pull"]], [3])
        self.assertIn("story-ui-shell.md", self.files(out["ready_to_start"]))
        status = json.loads(run("status", str(self.epic)).stdout)
        self.assertEqual(status["counts"], {"total": 4, "done": 1, "backlog": 1, "planned": 2})
        self.assertEqual(status["tickets"][0]["blocks"], [2, 3])

    def test_table_order_is_build_order_not_id(self):
        self.breakdown_epic(
            '[[entry]]\nid = 2\ntype = "story"\ntitle = "Second first"\n\n'
            '[[entry]]\nid = 1\ntype = "story"\ntitle = "First second"\n\n'
            '[[entry]]\nid = 3\ntype = "story"\ntitle = "Third"\nafter = [1, 2]\n'
        )
        self.assertEqual([e["id"] for e in self.next()["to_pull"]], [2, 1])
        self.add("story-first-second.md", ticket("draft", 1))
        rows = json.loads(run("status", str(self.epic)).stdout)["tickets"]
        self.assertEqual([r["id"] for r in rows], [2, 1, 3])

    def test_entry_waiting_on_unwritten_entry_stays_blocked(self):
        self.breakdown_epic()
        out = self.next()
        self.assertEqual([e["id"] for e in out["to_pull"]], [1])

    def test_file_prerequisites_win_over_the_entry_and_status_flags_the_drift(self):
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("draft", 1))
        self.add("story-ui-shell.md", ticket("draft", 2, after="[]"))
        self.assertIn("story-ui-shell.md", self.files(self.next()["ready_to_start"]))
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
        self.assertEqual(json.loads(r.stdout), {"file": "story-scaffold-the-cart.md", "refine": True})
        text = (self.epic / "story-scaffold-the-cart.md").read_text(encoding="utf-8")
        self.assertIn("Verify: It runs.", text)
        self.assertIn("covers: [R1]", text)
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-scaffold-the-cart.md"])
        self.assertEqual(run("pull", str(self.epic), "1").returncode, 1)
        run("mark", str(self.epic / "story-scaffold-the-cart.md"), "done")
        run("pull", str(self.epic), "2")
        out = self.next()
        self.assertEqual(self.files(out["ready_to_start"]), ["story-ui-shell.md"])
        self.assertEqual(out["ready_to_start"][0]["after"], [1])

    def test_pull_leaves_out_empty_fields_and_keeps_set_ones(self):
        self.breakdown_epic()
        run("pull", str(self.epic), "1")
        head = (self.epic / "story-scaffold.md").read_text(encoding="utf-8").split("---")[1]
        self.assertEqual(head, '\nid: 1\ntype: story\ntitle: "Scaffold"\nparent: epic-cart\ncovers: [R1]\n')
        self.assertEqual(self.next()["ready_to_start"][0]["state"], "backlog")
        run("pull", str(self.epic), "3")
        head = (self.epic / "spike-tax-engine.md").read_text(encoding="utf-8").split("---")[1]
        self.assertIn("\nafter: [1]\n", head)
        self.assertIn("\nhitl: true\n", head)
        self.assertNotIn("refined", head)

    def test_pull_ends_with_an_empty_plan_section(self):
        self.breakdown_epic()
        run("pull", str(self.epic), "1")
        text = (self.epic / "story-scaffold.md").read_text(encoding="utf-8")
        self.assertTrue(
            text.endswith(
                "- parent — out/initiative-checkout/epic-cart/epic-cart.md\n\n## Plan\n\n<!-- Filled in by the coding agent; never sent to a tracker. -->\n"
            ),
            text,
        )

    def test_find_by_cross_ref_id_file_tracker_id_and_title(self):
        pricing = self.pricing()
        self.breakdown_epic()
        self.add("story-contract.md", ticket("done", 1, tracker_id='"PRICE-1"'), pricing)
        run("pull", str(self.epic), "1")

        def find(folder, ref):
            r = run("find", str(folder), ref)
            self.assertEqual(r.returncode, 0, r.stderr)
            return json.loads(r.stdout)

        hit = find(self.initiative, "2.1")
        self.assertEqual((hit["folder"], hit["id"], hit["file"]), ("epic-cart", 1, "story-scaffold.md"))
        self.assertEqual(hit["path"], str((self.epic / "story-scaffold.md").resolve()))
        self.assertEqual(find(self.epic, "3")["title"], "Tax engine?")
        self.assertIsNone(find(self.epic, "3")["path"])
        self.assertEqual(find(self.epic, "1.1")["file"], "story-contract.md")
        self.assertEqual(find(self.epic, "price-1")["file"], "story-contract.md")
        self.assertEqual(find(self.initiative, "story-scaffold")["folder"], "epic-cart")
        self.assertEqual(find(self.initiative, "ui shell")["id"], 2)
        self.assertEqual(find(self.epic, "codes")["id"], 4)
        r = run("find", str(self.initiative), "in")
        self.assertEqual(r.returncode, 1)
        self.assertIn("more than one", r.stderr)
        r = run("find", str(self.initiative), "9.1")
        self.assertEqual(r.returncode, 1)
        self.assertIn("no ticket matches", r.stderr)

    def test_pull_refuses_a_file_name_already_taken(self):
        self.breakdown_epic(self.BREAKDOWN.replace('title = "UI shell"', 'title = "Scaffold"'))
        self.assertEqual(run("pull", str(self.epic), "1").returncode, 0)
        self.add("story-scaffold.md", ticket("done", 1))
        r = run("pull", str(self.epic), "2")
        self.assertEqual(r.returncode, 1)
        self.assertIn("exists already", r.stderr)

    def test_pull_writes_references_and_notes(self):
        self.breakdown_epic(
            self.BREAKDOWN.replace(
                'title = "Scaffold"',
                'title = "Scaffold"\nunknown = "Which host?"\nreferences = ["SPINE.md#ad-8"]\nnotes = ["Reuse the mailer."]',
            )
        )
        self.assertEqual(run("pull", str(self.epic), "1").returncode, 0)
        text = (self.epic / "story-scaffold.md").read_text(encoding="utf-8")
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

    def test_dropped_prerequisite_still_blocks(self):
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("dropped", 1))
        self.add("story-ui-shell.md", ticket("", 2, after="[1]"))
        out = self.next()
        self.assertEqual(self.files(out["blocked"])[0], "story-ui-shell.md")
        self.assertEqual(out["ready_to_refine"], [])
        self.assertEqual(out["to_pull"], [])

    def test_malformed_breakdown_errors(self):
        for text, message in (
            (self.BREAKDOWN.replace("id = 3", "id = 2"), "two entries with id 2"),
            (self.BREAKDOWN.replace("after = [2, 3]", "after = [2, 9]"), "names no entry in epic-cart"),
            (self.BREAKDOWN.replace('type = "spike"', 'type = "task"'), "is not one of"),
            (self.BREAKDOWN.replace("id = 4", 'id = "4"'), "integer `id`"),
            (self.BREAKDOWN.replace("id = 4\n", ""), "integer `id`"),
            ("[[entry]\nid = ", "tickets.toml"),
            ('[entry]\nid = 1\ntype = "story"\n', "[[entry]]"),
            (self.BREAKDOWN.replace('covers = ["R4"]', "covers = 1"), "must be a list"),
        ):
            self.breakdown_epic(text)
            r = run("next", str(self.epic))
            self.assertEqual(r.returncode, 1, text)
            self.assertIn(message, json.loads(r.stderr)["error"])

    def pricing(self):
        pricing = self.add_epic("epic-pricing")
        (pricing / "tickets.toml").write_text(
            '[[entry]]\nid = 1\ntype = "story"\ntitle = "Pricing contract"\n\n'
            '[[entry]]\nid = 2\ntype = "story"\ntitle = "Pricing rules"\nafter = [1]\n'
        )
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = 1\nslug = "epic-pricing"\n\n[[epic]]\nid = 2\nslug = "epic-cart"\n'
        )
        return pricing

    def test_ticket_waits_on_an_entry_in_another_epic(self):
        pricing = self.pricing()
        self.breakdown_epic(
            self.BREAKDOWN.replace('title = "UI shell"\nafter = [1]', 'title = "UI shell"\nafter = [1, "1.1"]')
        )
        self.add("story-scaffold.md", ticket("done", 1))
        out = self.next()
        self.assertEqual([e["id"] for e in out["to_pull"]], [3])
        self.assertEqual(out["blocked"][0]["after"], [1, "1.1"])
        self.add("story-contract.md", ticket("done", 1), pricing)
        self.assertEqual([e["id"] for e in self.next()["to_pull"]], [2, 3])

    def test_whole_epic_prerequisite_and_epic_gate(self):
        pricing = self.pricing()
        self.add("story-scaffold.md", ticket("draft", 1, after="[epic-pricing]"))
        self.assertEqual(self.files(self.next()["blocked"]), ["story-scaffold.md"])
        (pricing / "epic-pricing.md").write_text("---\ntype: epic\nstatus: done\n---\n")
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-scaffold.md"])
        gated = self.add_epic("epic-tax", after="[epic-cart]")
        self.add("story-rates.md", ticket("draft", 1), gated)
        out = json.loads(run("next", str(gated)).stdout)
        self.assertEqual(out["blocked"][0]["after"], [])
        self.assertEqual(out["blocked"][0]["gated_by"], ["epic-cart"])

    def test_gate_deadlock_with_a_ticketless_epic_is_a_cycle(self):
        self.add_epic("epic-tax", after="[epic-cart]")
        self.add("story-scaffold.md", ticket("draft", 1, after="[epic-tax]"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("cycle", r.stderr)

    def test_tracker_ids_resolve_across_epics_and_duplicates_collapse(self):
        pricing = self.pricing()
        self.add("story-contract.md", ticket("done", 1, tracker_id='"PRICE-1"'), pricing)
        self.add("story-scaffold.md", ticket("draft", 1, after="[PRICE-1, 1.1, 1.01]"))
        out = self.next()
        self.assertEqual(out["ready_to_refine"][0]["after"], ["1.1"])

    def test_malformed_files_name_their_folder(self):
        pricing = self.pricing()
        self.seed()
        cases = (
            (ticket("todo", 1), "epic-pricing/story-contract.md"),
            (ticket("draft", 1).replace("after: []", "after:\n  - 1"), "must be inline"),
            (ticket("draft", 1).replace("---\n\n# x", "\n# x"), "does not close"),
        )
        for text, message in cases:
            self.add("story-contract.md", text, pricing)
            self.assertIn(message, json.loads(run("next", str(self.epic)).stderr)["error"])
        self.add("story-contract.md", ticket("draft", 1), pricing)
        (pricing / "epic-pricing.md").write_text("---\ntype: epic\nstatus: Finished\n---\n")
        self.assertIn("epic-pricing/epic-pricing.md", json.loads(run("next", str(self.epic)).stderr)["error"])

    def test_cross_epic_unknown_target_and_cycle_error(self):
        pricing = self.pricing()
        for ref, message in (("9.1", "names no epic id"), ("1.9", "names no entry"), ("epic-missing", "names no epic")):
            self.add("story-scaffold.md", ticket("draft", 1, after=f"[{ref}]"))
            r = run("next", str(self.epic))
            self.assertEqual(r.returncode, 1)
            self.assertIn(message, json.loads(r.stderr)["error"])
        self.add("story-scaffold.md", ticket("draft", 1, after="[1.2]"))
        self.add("story-contract.md", ticket("draft", 1, after="[2.1]"), pricing)
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("cycle", r.stderr)

    def test_initiative_view_spans_epics_in_file_order_and_reports_unpinned_after(self):
        self.pricing()
        self.breakdown_epic()
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = 1\nslug = "epic-pricing"\n\n'
            '[[epic]]\nid = 2\nslug = "epic-cart"\nafter = [{ epic = 1, needs = "the pricing contract" }]\n'
        )
        out = json.loads(run("next", str(self.initiative)).stdout)
        self.assertEqual([(e["epic"], e["id"]) for e in out["to_pull"]], [("epic-pricing", 1), ("epic-cart", 1)])
        self.assertEqual(
            out["unpinned_after"], [{"epic": "epic-cart", "after": "epic-pricing", "needs": "the pricing contract"}]
        )
        self.breakdown_epic(
            self.BREAKDOWN.replace('title = "UI shell"\nafter = [1]', 'title = "UI shell"\nafter = [1, "1.1"]')
        )
        status = json.loads(run("status", str(self.initiative)).stdout)
        self.assertEqual(status["unpinned_after"], [])
        self.assertEqual(status["counts"], {"total": 6, "planned": 6})
        self.assertEqual([(e["slug"], e["id"]) for e in status["epics"]], [("epic-pricing", 1), ("epic-cart", 2)])
        self.assertEqual(status["tickets"][0]["blocks"], [2, "2.2"])
        self.assertEqual(status["longest_remaining_chain"][1:], ["2.2", "2.4"])
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = 1\nslug = "epic-pricing"\n\n[[epic]]\nid = 2\nslug = "epic-cart"\nafter = [{ epic = "epic-x" }]\n'
        )
        r = run("status", str(self.initiative))
        self.assertEqual(r.returncode, 1)
        self.assertIn("no epic listed", r.stderr)
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = 2\nslug = "epic-cart"\n\n[[epic]]\nid = 2\nslug = "epic-pricing"\n'
        )
        self.assertIn("two epics with id 2", run("status", str(self.initiative)).stderr)

    def test_epics_need_an_id_a_slug_and_a_valid_after(self):
        self.pricing()
        toml = self.initiative / "tickets.toml"
        good = toml.read_text(encoding="utf-8")
        for bad, message in (
            (good.replace("id = 2\n", ""), "integer `id`"),
            (good.replace('slug = "epic-cart"', 'slug = "epic-pricing"'), "two epics with slug"),
            (good.replace('slug = "epic-cart"\n', ""), "needs a `slug`"),
            (good + "after = [{ epic = true }]\n", "epic = <id or slug>"),
        ):
            toml.write_text(bad, encoding="utf-8")
            r = run("status", str(self.initiative))
            self.assertEqual(r.returncode, 1, r.stdout)
            self.assertIn(message, r.stderr)

    def test_find_prefers_the_folder_asked_about_for_a_file_name(self):
        pricing = self.pricing()
        self.add("story-scaffold.md", ticket("", 1), pricing)
        self.breakdown_epic()
        run("pull", str(self.epic), "1")
        r = run("find", str(pricing), "story-scaffold")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(json.loads(r.stdout)["folder"], "epic-pricing")
        r = run("find", str(self.initiative), "story-scaffold")
        self.assertEqual(r.returncode, 1)
        self.assertIn("more than one", r.stderr)

    def test_a_numeric_tracker_id_is_never_a_sibling_id(self):
        self.seed(s1="done")
        self.add("story-ui-shell.md", ticket("done", 2, tracker_id='"47"'))
        self.add("story-tracer.md", ticket("", 3, after='["47"]'))
        self.assertIn("story-tracer.md", self.files(self.next()["ready_to_refine"]))

    def test_a_quoted_number_is_a_tracker_id_and_a_bare_one_a_sibling(self):
        self.add("story-scaffold.md", ticket("done", 1, tracker_id="101"))
        self.add("story-ui-shell.md", ticket("draft", 2, after='["101"]'))
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-ui-shell.md"])
        self.add("story-ui-shell.md", ticket("draft", 2, after="[101]"))
        self.assertIn("names no entry", run("next", str(self.epic)).stderr)

    def test_two_files_sharing_an_id_error(self):
        self.add("story-a.md", ticket("done", 1))
        self.add("story-b.md", ticket("draft", 1))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("share the id 1", json.loads(r.stderr)["error"])

    def test_malformed_input_returns_json_error(self):
        (self.epic / "story-bad.md").write_bytes(ticket("draft", 1).encode().replace(b"# x", b"\xff"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1, r.stderr)
        self.assertIn("error", json.loads(r.stderr))
        (self.epic / "story-bad.md").unlink()
        self.seed()
        (self.root / "_bmad" / "custom" / "ticketing-store-config.toml").write_text("[tickets\nstore = ")
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1, r.stderr)
        self.assertIn("error", json.loads(r.stderr))

    def test_leaf_without_id_sorts_last_and_container_file_is_ignored(self):
        self.seed()
        self.add("bug-stray.md", ticket("", kind="bug"))
        out = json.loads(run("status", str(self.epic)).stdout)
        self.assertEqual(out["tickets"][-1]["file"], "bug-stray.md")
        self.assertIsNone(out["tickets"][-1]["id"])
        self.assertEqual(out["counts"]["total"], 6)

    def test_mark_rewrites_status_and_assignee_on_repo_store(self):
        self.seed()
        r = run("mark", str(self.epic / "story-scaffold.md"), "in-progress", "--assignee", "ann")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(
            json.loads(r.stdout), {"file": "story-scaffold.md", "status": "in-progress", "assignee": "ann"}
        )
        text = (self.epic / "story-scaffold.md").read_text(encoding="utf-8")
        self.assertIn("status: in-progress\n", text)
        self.assertIn('assignee: "ann"\n', text)
        self.assertIn("# x", text)

    def test_mark_clears_blocking_fields_and_takes_a_literal_assignee(self):
        path = self.epic / "story-scaffold.md"
        path.write_text(
            ticket("", 1, blocked_at="2026-09-05").replace("---\n\n# x", 'blocked_reason: "legal"\n---\n\n# x')
        )
        r = run("mark", str(path), "draft", "--assignee", "\\1")
        self.assertEqual(r.returncode, 0, r.stderr)
        text = path.read_text(encoding="utf-8")
        self.assertNotIn("blocked_at", text)
        self.assertNotIn("blocked_reason", text)
        self.assertIn('assignee: "\\1"\n', text)
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-scaffold.md"])

    def test_mark_adds_the_fields_a_pulled_file_left_out(self):
        self.breakdown_epic()
        run("pull", str(self.epic), "1")
        path = self.epic / "story-scaffold.md"
        r = run("mark", str(path), "ready-for-dev", "--assignee", "ann")
        self.assertEqual(r.returncode, 0, r.stderr)
        text = path.read_text(encoding="utf-8")
        self.assertIn("status: ready-for-dev\n", text)
        self.assertTrue(text.startswith("---\nid: 1\ntype: story\n"), text)
        self.assertIn('\nassignee: "ann"\n---\n', text)
        self.assertEqual(self.files(self.next()["ready_to_start"]), ["story-scaffold.md"])

    def test_project_root_flag_finds_the_store_for_tickets_outside_the_project(self):
        self.write_store("jira")
        outside = tempfile.TemporaryDirectory()
        self.addCleanup(outside.cleanup)
        folder = Path(outside.name) / "epic-cart"
        folder.mkdir()
        (folder / "story-scaffold.md").write_text(ticket("", 1))
        self.assertEqual(json.loads(run("next", str(folder)).stdout)["store"], "repo")
        r = run("--project-root", str(self.root), "next", str(folder))
        self.assertEqual(r.returncode, 2)
        r = run("--project-root", str(self.root), "mark", str(folder / "story-scaffold.md"), "done")
        self.assertEqual(r.returncode, 2)

    def test_mark_refuses_on_tracker_store(self):
        self.write_store("jira")
        self.seed()
        r = run("mark", str(self.epic / "story-scaffold.md"), "done")
        self.assertEqual(r.returncode, 2)
        self.assertIn("write verb", r.stderr)

    def test_next_on_tracker_store_needs_synced_flag(self):
        self.write_store("linear")
        self.seed()
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 2)
        self.assertIn("sync", r.stderr)
        self.assertEqual(self.next("--synced")["store"], "linear")

    def test_cycle_unknown_prerequisite_and_bad_status_are_errors(self):
        self.seed()
        self.add("story-scaffold.md", ticket("draft", 1, after="[3]"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("cycle", r.stderr)
        self.add("story-scaffold.md", ticket("draft", 1, after="[9]"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("names no entry in epic-cart", r.stderr)
        self.add("story-scaffold.md", ticket("draft", 1, after='["9"]'))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("matches no ticket", r.stderr)
        self.add("story-scaffold.md", ticket("backlog", 1))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("status 'backlog'", r.stderr)
        self.add("story-scaffold.md", ticket("", 1))
        (self.epic / "epic-cart.md").write_text("---\ntype: epic\nstatus: backlog\n---\n")
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("in-progress, done, dropped", r.stderr)


if __name__ == "__main__":
    unittest.main()
