import json
import shutil
import subprocess
import sys
import tempfile
import tomllib
import unittest
from datetime import date
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "tickets.py"
CONFIG_UTILS = SCRIPT.parents[2] / "bmad" / "scripts" / "config_utils.py"


def ticket(
    status,
    ticket_id=None,
    after="[]",
    hitl="false",
    tracker_id='""',
    assignee='""',
    blocked_at=None,
    blocked_reason=None,
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
    if blocked_reason:
        lines.append(f'blocked_reason: "{blocked_reason}"')
    lines += ["---", "", "# x", ""]
    return "\n".join(lines)


def plan(ticket_id, status=None, assignee=None, blocked_at=None, blocked_reason=None):
    """A plan as the build's template writes it: quoted values, trailing comments, block lists."""
    lines = [
        "---",
        "title: 'x'",
        "type: 'feature' # feature | bugfix | refactor | chore",
        f"ticket: '{ticket_id}' # the entry id from the ticket tree, or the story file's stem when the entry has no id; empty outside it",
    ]
    if status:
        lines.append(f"status: '{status}' # draft | ready-for-dev | in-progress | in-review | built | done")
    for key, value in (("assignee", assignee), ("blocked_at", blocked_at), ("blocked_reason", blocked_reason)):
        if value:
            lines.append(f"{key}: '{value}'")
    lines += ["lenses_ran: []", "deferred:", "  - summary: a", "    evidence: b", "---", "", "# x", ""]
    return "\n".join(lines)


def run(*args, cwd=None):
    # tickets.py writes UTF-8; text=True alone would decode with the locale's code page on Windows.
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args], encoding="utf-8", capture_output=True, check=False, cwd=cwd
    )


class TreeCase(unittest.TestCase):
    """A temp project with `_bmad/custom/` and the epic `out/initiative-checkout/epic-cart`."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "_bmad" / "custom").mkdir(parents=True)
        self.initiative = self.root / "out" / "initiative-checkout"
        self.epic = self.add_epic("epic-cart")
        self.write_store("repo")

    def tearDown(self):
        self.tmp.cleanup()

    def write_store(self, name="repo", root=None):
        line = f'root = "{root}"\n' if root is not None else ""
        (self.root / "_bmad" / "custom" / "ticketing-store-config.toml").write_text(
            f'[tickets]\nstore = "{name}"\n{line}'
        )

    def add_epic(self, slug, status="", after="[]"):
        folder = self.initiative / slug
        folder.mkdir(parents=True)
        line = f"status: {status}\n" if status else ""
        (folder / f"{slug}.md").write_text(f"---\ntype: epic\n{line}after: {after}\n---\n# {slug}\n")
        return folder

    def add_backlog(self):
        backlog = self.root / "out" / "backlog"
        backlog.mkdir()
        return backlog

    def status_rows(self, folder):
        return json.loads(run("status", str(folder)).stdout)["tickets"]

    def add(self, name, text, folder=None):
        ((folder or self.epic) / name).write_text(text, encoding="utf-8")

    def seed(self, s1="", s2="", s3=""):
        self.add("story-scaffold.md", ticket(s1, 1, hitl="true"))
        self.add("story-ui-shell.md", ticket(s2, 2))
        self.add("story-tracer.md", ticket(s3, 3, after="[1, 2]"))
        self.add("story-codes.md", ticket("", 4, after="[story-tracer]"))
        self.add("spike-tax.md", ticket("", 5, after="[3]", kind="spike"))

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


class TicketsTests(TreeCase):
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
        self.assertEqual(out["ready_to_start"][0]["title"], "Café ✓ menu")
        r = subprocess.run([sys.executable, str(SCRIPT), "pull", str(self.epic), "1"], capture_output=True, check=False)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("# Café ✓ menu", (self.epic / "story-caf-menu.md").read_text(encoding="utf-8"))

    def test_planned_entries_surface_when_unblocked(self):
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("done", 1))
        out = self.next()
        self.assertEqual(
            [(e["id"], e["type"], e["title"]) for e in out["ready_to_start"]],
            [(2, "story", "UI shell"), (3, "spike", "Tax engine?")],
        )
        self.assertEqual(out["ready_to_start"][1]["covers"], ["R4"])
        self.assertEqual(out["ready_to_start"][1]["after"], [1])
        self.assertTrue(out["ready_to_start"][1]["hitl"])
        self.assertEqual([e["id"] for e in out["blocked"]], [4])
        self.add("story-ui-shell.md", ticket("", 2, after="[1]"))
        out = self.next()
        self.assertEqual(self.files(out["ready_to_start"]), ["story-ui-shell.md", None])
        status = json.loads(run("status", str(self.epic)).stdout)
        self.assertEqual(status["counts"], {"total": 4, "done": 1, "backlog": 1, "planned": 2})
        self.assertEqual(status["tickets"][0]["blocks"], [2, 3])

    def test_table_order_is_build_order_not_id(self):
        self.breakdown_epic(
            '[[entry]]\nid = 2\ntype = "story"\ntitle = "Second first"\n\n'
            '[[entry]]\nid = 1\ntype = "story"\ntitle = "First second"\n\n'
            '[[entry]]\nid = 3\ntype = "story"\ntitle = "Third"\nafter = [1, 2]\n'
        )
        self.assertEqual([e["id"] for e in self.next()["ready_to_start"]], [2, 1])
        self.add("story-first-second.md", ticket("draft", 1))
        rows = self.status_rows(self.epic)
        self.assertEqual([r["id"] for r in rows], [2, 1, 3])

    def test_entry_waiting_on_unwritten_entry_stays_blocked(self):
        self.breakdown_epic()
        out = self.next()
        self.assertEqual([e["id"] for e in out["ready_to_start"]], [1])
        self.assertEqual([e["id"] for e in out["blocked"]], [2, 3, 4])

    def test_a_prerequisite_in_review_is_met_and_one_in_progress_is_not(self):
        self.breakdown_epic()
        self.add("story-scaffold-plan.md", plan(1, "in-review"))
        out = self.next()
        self.assertEqual([e["id"] for e in out["ready_to_start"]], [2, 3])
        self.assertEqual([e["id"] for e in out["in_progress"]], [1])
        self.add("story-scaffold-plan.md", plan(1, "in-progress"))
        out = self.next()
        self.assertEqual(out["ready_to_start"], [])
        self.assertEqual([e["id"] for e in out["blocked"]], [2, 3, 4])

    def test_an_epic_gate_waits_for_the_epic_to_be_done_even_with_its_tickets_in_review(self):
        pricing = self.pricing()
        self.breakdown_epic('[[entry]]\nid = 1\ntype = "story"\ntitle = "Cart"\nafter = ["1.2"]\n')
        self.add("story-pricing-contract-plan.md", plan(1, "in-review"), pricing)
        self.add("story-pricing-rules-plan.md", plan(2, "in-review"), pricing)
        self.assertEqual([e["id"] for e in self.next()["ready_to_start"]], [1])
        (self.epic / "epic-cart.md").write_text("---\ntype: epic\nafter: [epic-pricing]\n---\n# epic-cart\n")
        out = self.next()
        self.assertEqual(out["ready_to_start"], [])
        self.assertEqual(out["blocked"][0]["gated_by"], ["epic-pricing"])
        (pricing / "epic-pricing.md").write_text("---\ntype: epic\nstatus: done\n---\n# epic-pricing\n")
        self.assertEqual([e["id"] for e in self.next()["ready_to_start"]], [1])

    def test_every_row_carries_a_ref_that_find_resolves_to_the_same_row(self):
        self.pricing()
        self.breakdown_epic()
        backlog = self.add_backlog()
        self.add("bug-x.md", ticket("draft", kind="bug"), backlog)
        cases = (
            (self.initiative, ["1.1", "1.2", "2.1", "2.2", "2.3", "2.4"]),
            (self.epic, ["2.1", "2.2", "2.3", "2.4"]),
            (backlog, ["bug-x.md"]),
        )
        for folder, refs in cases:
            rows = self.status_rows(folder)
            self.assertEqual([r["ref"] for r in rows], refs, folder.name)
            for row in rows:
                r = run("find", str(folder), row["ref"])
                self.assertEqual(r.returncode, 0, r.stderr)
                found = json.loads(r.stdout)
                self.assertEqual(
                    [found[k] for k in ("epic", "id", "file", "ref")], [row[k] for k in ("epic", "id", "file", "ref")]
                )
            for group in ("ready_to_start", "blocked"):
                for row in json.loads(run("next", str(folder)).stdout)[group]:
                    self.assertIn(row["ref"], refs)

    def test_a_ref_is_the_bare_id_in_an_epic_the_initiative_does_not_number(self):
        self.breakdown_epic()
        self.assertEqual([r["ref"] for r in self.next()["ready_to_start"]], ["1"])
        self.assertEqual(json.loads(run("find", str(self.epic), "1").stdout)["title"], "Scaffold")

    def test_file_prerequisites_win_over_the_entry_and_status_flags_the_drift(self):
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("draft", 1))
        self.add("story-ui-shell.md", ticket("draft", 2, after="[]"))
        self.assertIn("story-ui-shell.md", self.files(self.next()["ready_to_start"]))
        rows = self.status_rows(self.epic)
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
        run("mark", str(self.epic), "1", "done")
        run("pull", str(self.epic), "2")
        out = self.next()
        self.assertEqual(self.files(out["ready_to_start"]), ["story-ui-shell.md", None])
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

    def test_pull_ends_after_the_references(self):
        self.breakdown_epic()
        run("pull", str(self.epic), "1")
        text = (self.epic / "story-scaffold.md").read_text(encoding="utf-8")
        self.assertTrue(
            text.endswith("## References\n\n- parent — out/initiative-checkout/epic-cart/epic-cart.md\n"), text
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
        self.assertEqual(hit["story_file"], str((self.epic / "story-scaffold.md").resolve()))
        self.assertNotIn("path", hit)
        self.assertEqual(find(self.epic, "3")["title"], "Tax engine?")
        self.assertIsNone(find(self.epic, "3")["story_file"])
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
        self.assertEqual(out["ready_to_start"], [])

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

    def test_ticket_waits_on_an_entry_in_another_epic(self):
        pricing = self.pricing()
        self.breakdown_epic(
            self.BREAKDOWN.replace('title = "UI shell"\nafter = [1]', 'title = "UI shell"\nafter = [1, "1.1"]')
        )
        self.add("story-scaffold.md", ticket("done", 1))
        out = self.next()
        self.assertEqual([e["id"] for e in out["ready_to_start"]], [3])
        self.assertEqual(out["blocked"][0]["after"], [1, "1.1"])
        self.add("story-contract.md", ticket("done", 1), pricing)
        self.assertEqual([e["id"] for e in self.next()["ready_to_start"]], [2, 3])

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
        self.assertEqual([(e["epic"], e["id"]) for e in out["ready_to_start"]], [("epic-pricing", 1), ("epic-cart", 1)])
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

    def mark(self, *args):
        r = run("mark", *args)
        self.assertEqual(r.returncode, 0, r.stderr)
        return json.loads(r.stdout)

    def test_mark_writes_a_plan_beside_the_leaf_and_never_the_leaf(self):
        self.seed()
        leaf = (self.epic / "story-scaffold.md").read_text(encoding="utf-8")
        out = self.mark(str(self.epic), "1", "in-progress", "--assignee", "ann")
        plan_file = self.epic / "story-scaffold-plan.md"
        self.assertEqual(
            out,
            {
                "plan": str(plan_file.resolve()),
                "created": True,
                "status": "in-progress",
                "assignee": "ann",
                "blocked_at": "",
                "blocked_reason": "",
            },
        )
        self.assertEqual((self.epic / "story-scaffold.md").read_text(encoding="utf-8"), leaf)
        self.assertEqual(
            plan_file.read_text(encoding="utf-8"),
            '---\ntitle: "x"\nticket: 1\nstatus: in-progress\nassignee: "ann"\n---\n',
        )
        self.assertEqual(self.files(self.next()["in_progress"]), ["story-scaffold.md"])

    def test_mark_clears_the_leafs_blocking_fields_and_takes_a_literal_assignee(self):
        path = self.epic / "story-scaffold.md"
        path.write_text(ticket("", 1, blocked_at="2026-09-05", blocked_reason="legal"))
        out = self.mark(str(self.epic), "1", "draft", "--assignee", "\\1")
        self.assertEqual(out["assignee"], "\\1")
        text = (self.epic / "story-scaffold-plan.md").read_text(encoding="utf-8")
        self.assertNotIn("blocked_at", text)
        self.assertIn('assignee: "\\\\1"\n', text)
        self.assertIn("blocked_reason", path.read_text(encoding="utf-8"))
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["story-scaffold.md"])

    def test_mark_on_a_pulled_leaf_keeps_the_leafs_assignee_in_the_new_plan(self):
        self.breakdown_epic()
        run("pull", str(self.epic), "1")
        self.add(
            "story-scaffold.md",
            (self.epic / "story-scaffold.md").read_text().replace("---\n\n", 'assignee: "bob"\n---\n\n', 1),
        )
        self.mark(str(self.epic), "1", "ready-for-dev")
        text = (self.epic / "story-scaffold-plan.md").read_text(encoding="utf-8")
        self.assertEqual(text, '---\ntitle: "Scaffold"\nticket: 1\nstatus: ready-for-dev\nassignee: "bob"\n---\n')
        self.assertEqual(
            [(e["file"], e["assignee"]) for e in self.next()["ready_to_start"]], [("story-scaffold.md", "bob")]
        )

    def test_find_on_an_entry_with_nothing_yet(self):
        self.breakdown_epic(
            self.BREAKDOWN.replace(
                'title = "UI shell"',
                'title = "UI shell"\ndescription = "The page frame."\nverify = "It renders."\n'
                'unknown = "Which grid?"\nreferences = ["SPINE.md#ad-8"]\nnotes = ["Reuse the header."]',
            )
        )
        r = run("find", str(self.epic), "2")
        self.assertEqual(r.returncode, 0, r.stderr)
        hit = json.loads(r.stdout)
        epic = self.epic.resolve()
        self.assertEqual((hit["id"], hit["title"], hit["state"], hit["after"]), (2, "UI shell", "planned", [1]))
        self.assertEqual(
            {k: hit[k] for k in ("folder", "description", "verify", "references", "notes", "unknown")},
            {
                "folder": "epic-cart",
                "description": "The page frame.",
                "verify": "It renders.",
                "references": ["SPINE.md#ad-8"],
                "notes": ["Reuse the header."],
                "unknown": "Which grid?",
            },
        )
        self.assertIsNone(hit["story_file"])
        self.assertEqual(hit["plan"], str(epic / "story-ui-shell-plan.md"))
        self.assertFalse(Path(hit["plan"]).exists())
        self.assertEqual(hit["epic_file"], str(epic / "epic-cart.md"))

    def test_find_names_a_joined_plan_whatever_its_name(self):
        self.breakdown_epic()
        self.add("custom-name.md", plan(2, "in-progress"))
        hit = json.loads(run("find", str(self.epic), "2").stdout)
        self.assertEqual(hit["plan"], str(self.epic.resolve() / "custom-name.md"))
        self.assertEqual(hit["status"], "in-progress")

    def test_find_on_a_refined_entry_names_its_story_file_and_the_plan_after_it(self):
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Scaffold"', 'title = "Scaffold, renamed"'))
        self.add("story-scaffold.md", ticket("", 1))
        hit = json.loads(run("find", str(self.epic), "1").stdout)
        self.assertEqual(hit["story_file"], str(self.epic.resolve() / "story-scaffold.md"))
        self.assertEqual(hit["plan"], str(self.epic.resolve() / "story-scaffold-plan.md"))

    def test_find_and_mark_in_a_backlog(self):
        backlog = self.add_backlog()
        self.add("bug-x.md", ticket("draft", kind="bug"), backlog)
        r = run("find", str(backlog), "bug-x")
        self.assertEqual(r.returncode, 0, r.stderr)
        hit = json.loads(r.stdout)
        self.assertIsNone(hit["epic_file"])
        self.assertEqual(
            [hit[k] for k in ("description", "verify", "references", "notes", "unknown")], ["", "", [], [], ""]
        )
        self.assertEqual(hit["plan"], str(backlog.resolve() / "bug-x-plan.md"))
        self.mark(str(backlog), "bug-x", "in-review")
        self.assertIn('\nticket: "bug-x"\n', (backlog / "bug-x-plan.md").read_text(encoding="utf-8"))
        rows = self.status_rows(backlog)
        self.assertEqual([(t["file"], t["state"]) for t in rows], [("bug-x.md", "review")])

    def test_mark_done_on_a_plan_only_entry_clears_blocking_and_keeps_the_plan(self):
        self.breakdown_epic()
        path = self.epic / "story-ui-shell-plan.md"
        self.add(path.name, plan(2, "blocked", assignee="ann", blocked_at="2026-09-05", blocked_reason="legal"))
        before = path.read_text(encoding="utf-8")
        out = self.mark(str(self.epic), "2", "done")
        self.assertEqual((out["created"], out["status"], out["assignee"]), (False, "done", "ann"))
        text = path.read_text(encoding="utf-8")
        self.assertIn("\nstatus: done\n", text)
        self.assertNotIn("blocked_", text)
        expected = [
            line for line in before.splitlines() if not line.startswith(("status:", "blocked_at:", "blocked_reason:"))
        ]
        self.assertEqual([line for line in text.splitlines() if not line.startswith("status:")], expected)
        rows = self.status_rows(self.epic)
        self.assertEqual(rows[1]["state"], "done")
        out = self.next()
        self.assertNotIn(2, [e["id"] for group in ("ready_to_start", "in_progress", "blocked") for e in out[group]])

    def test_mark_on_a_build_plan_keeps_its_body_and_other_frontmatter(self):
        self.breakdown_epic()
        path = self.epic / "story-scaffold-plan.md"
        text = plan(1, "in-progress").replace("# x\n", "# x\n\nbody: stays\n") + "## Code Review\n"
        self.add(path.name, text)
        self.mark(str(self.epic), "1", "in-review", "--assignee", "ann")
        after = path.read_text(encoding="utf-8")
        self.assertEqual(
            after,
            text.replace(
                "status: 'in-progress' # draft | ready-for-dev | in-progress | in-review | built | done",
                "status: in-review",
            ).replace("\n---\n\n# x", '\nassignee: "ann"\n---\n\n# x'),
        )

    def test_a_blocked_reason_with_colons_and_quotes_reads_back_exactly(self):
        self.breakdown_epic()
        for reason in ('waiting on legal: "terms"', "it's 'odd' \\ and: # not a comment   # still not", "Café ✓ next"):
            out = self.mark(str(self.epic), "2", "blocked", "--blocked", reason)
            self.assertEqual(out["blocked_reason"], reason)
            row = self.next()["blocked"][0]
            self.assertEqual((row["id"], row["status"], row["blocked_reason"]), (2, "blocked", reason))

    def test_mark_with_no_plan_creates_one_that_next_reads(self):
        self.breakdown_epic()
        self.mark(str(self.epic), "2", "ready-for-dev", "--assignee", "ann")
        self.assertEqual(
            (self.epic / "story-ui-shell-plan.md").read_text(encoding="utf-8"),
            '---\ntitle: "UI shell"\nticket: 2\nstatus: ready-for-dev\nassignee: "ann"\n---\n',
        )
        self.assertEqual(
            [(e["id"], e["state"], e["status"], e["assignee"]) for e in self.next()["blocked"]][0],
            (2, "backlog", "ready-for-dev", "ann"),
        )

    def test_mark_blocked_writes_the_design_notes_plan(self):
        self.breakdown_epic()
        self.mark(str(self.epic), "UI shell", "blocked", "--blocked", 'waiting on legal: "terms"')
        today = date.today().isoformat()
        self.assertEqual(
            (self.epic / "story-ui-shell-plan.md").read_text(encoding="utf-8"),
            f'---\ntitle: "UI shell"\nticket: 2\nstatus: blocked\nblocked_at: "{today}"\n'
            'blocked_reason: "waiting on legal: \\"terms\\""\n---\n',
        )

    def test_mark_refuses_an_empty_ref_and_never_matches_digits_against_titles(self):
        self.pricing()
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Scaffold"', 'title = "Phase 2"'))
        r = run("mark", str(self.initiative), "2", "done")
        self.assertEqual(r.returncode, 1, r.stdout)
        self.assertIn("no ticket matches", r.stderr)
        for ref in ("", " "):
            r = run("mark", str(self.epic), ref, "done")
            self.assertEqual(r.returncode, 1, r.stdout)
            self.assertIn("empty", r.stderr)
        self.assertEqual(sorted(p.name for p in self.initiative.rglob("*-plan.md")), [])

    @unittest.skipIf(sys.platform == "win32", "Windows passes arguments as Unicode, so none is undecodable")
    def test_mark_with_an_undecodable_value_leaves_the_plan_unchanged(self):
        self.breakdown_epic()
        path = self.epic / "story-scaffold-plan.md"
        self.add(path.name, plan(1, "in-progress"))
        before = path.read_bytes()
        r = subprocess.run(
            [sys.executable, str(SCRIPT), "mark", str(self.epic), "1", "blocked", "--blocked", b"\xff"],
            capture_output=True,
            check=False,
        )
        self.assertNotEqual(r.returncode, 0, r.stdout)
        self.assertEqual(path.read_bytes(), before)

    def test_mark_refuses_a_plan_name_taken_by_another_file(self):
        self.breakdown_epic()
        for text in (plan(3), "# notes, not a plan\n"):
            self.add("story-ui-shell-plan.md", text)
            r = run("mark", str(self.epic), "2", "done")
            self.assertEqual(r.returncode, 1, r.stdout)
            self.assertIn("story-ui-shell-plan.md", json.loads(r.stderr)["error"])
            self.assertEqual((self.epic / "story-ui-shell-plan.md").read_text(encoding="utf-8"), text)

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
        r = run("--project-root", str(self.root), "mark", str(folder), "1", "done")
        self.assertEqual(r.returncode, 2)

    def test_mark_refuses_on_tracker_store(self):
        self.write_store("jira")
        self.seed()
        r = run("mark", str(self.epic), "1", "done")
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

    def test_entries_with_no_files_start_without_a_pull(self):
        self.breakdown_epic()
        self.add("old-spec.md", "---\ntype: 'feature'\nstatus: 'done'\nsteps:\n  - a\n---\n")
        out = self.next()
        self.assertNotIn("to_pull", out)
        self.assertEqual([(e["id"], e["state"], e["file"]) for e in out["ready_to_start"]], [(1, "planned", None)])
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Scaffold"', 'title = "Scaffold"\nrefine = true'))
        out = self.next()
        self.assertEqual([e["id"] for e in out["ready_to_refine"]], [1])
        self.assertEqual(out["ready_to_start"], [])

    def test_a_plan_sets_the_state_with_or_without_a_story_file(self):
        self.breakdown_epic()
        self.add("story-scaffold-plan.md", plan(1, "done"))
        self.add("story-ui-shell-plan.md", plan(2, "in-review", assignee="ann"))
        for _ in range(2):
            out = self.next()
            self.assertEqual([(e["id"], e["state"], e["assignee"]) for e in out["in_progress"]], [(2, "review", "ann")])
            self.assertEqual([e["id"] for e in out["ready_to_start"]], [3])
            rows = self.status_rows(self.epic)
            self.assertEqual([r["state"] for r in rows], ["done", "review", "planned", "planned"])
            self.add("story-ui-shell.md", ticket("draft", 2, after="[1]", refined="true", assignee='"bob"'))
        self.assertEqual(out["in_progress"][0]["file"], "story-ui-shell.md")
        self.assertEqual(out["in_progress"][0]["status"], "in-review")
        self.add("story-ui-shell.md", ticket("draft", 2, after="[1]", tracker_status="done"))
        self.assertEqual(json.loads(run("status", str(self.epic)).stdout)["tickets"][1]["state"], "done")

    def test_a_built_plan_reads_as_review_and_mark_accepts_built(self):
        self.breakdown_epic()
        self.add("story-scaffold-plan.md", plan(1, "built"))
        out = self.next()
        self.assertEqual([(e["id"], e["status"], e["state"]) for e in out["in_progress"]], [(1, "built", "review")])
        self.assertEqual([e["id"] for e in out["ready_to_start"]], [2, 3])
        self.assertEqual(self.mark(str(self.epic), "2", "built")["status"], "built")
        self.assertEqual(self.status_rows(self.epic)[1]["state"], "review")

    def test_a_plan_with_blocked_at_blocks_its_entry(self):
        self.breakdown_epic()
        self.add("story-scaffold-plan.md", plan(1, "in-progress", blocked_at="2026-09-05", blocked_reason="legal"))
        out = self.next()
        self.assertEqual([(e["id"], e["blocked_reason"]) for e in out["blocked"]][0], (1, "legal"))
        self.assertEqual(out["in_progress"], [])

    def test_a_leaf_with_blocked_at_and_no_plan_is_blocked_with_its_reason(self):
        self.add(
            "story-scaffold.md",
            ticket("in-progress", 1, blocked_at="2026-09-05", blocked_reason="legal"),
        )
        out = self.next()
        self.assertEqual([(e["file"], e["blocked_reason"]) for e in out["blocked"]], [("story-scaffold.md", "legal")])
        self.assertEqual(out["in_progress"], [])

    def test_a_plan_leaving_out_a_field_blanks_the_leafs_value(self):
        self.breakdown_epic()
        self.add("story-scaffold-plan.md", plan(1, "done"))
        self.add(
            "story-ui-shell.md",
            ticket("in-review", 2, after="[1]", blocked_at="2026-09-05", blocked_reason="legal"),
        )
        self.add("story-ui-shell-plan.md", plan(2))
        self.assertNotIn(2, [e["id"] for e in self.next()["blocked"]])
        row = self.status_rows(self.epic)[1]
        self.assertEqual((row["status"], row["state"], row["blocked_reason"]), ("", "backlog", ""))

    def test_a_quoted_numeric_ticket_joins_its_entry_and_a_doubled_quote_reads_as_one(self):
        self.breakdown_epic()
        self.add("story-ui-shell-plan.md", plan(2, "blocked", blocked_reason="can''t"))
        blocked = self.next()["blocked"]
        self.assertEqual([(e["id"], e["status"], e["blocked_reason"]) for e in blocked][0], (2, "blocked", "can't"))

    def test_a_backlog_plan_joins_its_leaf_by_stem_and_a_leaf_without_a_plan_keeps_its_status(self):
        backlog = self.add_backlog()
        self.add("bug-x.md", ticket("draft", kind="bug"), backlog)
        self.add("bug-x-plan.md", plan("bug-x", "in-progress"), backlog)
        self.add("bug-y.md", ticket("in-review", kind="bug"), backlog)
        rows = self.status_rows(backlog)
        self.assertEqual([(r["file"], r["state"]) for r in rows], [("bug-x.md", "in-progress"), ("bug-y.md", "review")])

    def test_orphan_duplicate_and_malformed_plans_error(self):
        self.breakdown_epic()
        for files, names in (
            ({"story-a-plan.md": plan(9)}, ["story-a-plan.md"]),
            ({"story-a-plan.md": plan("story-nothing")}, ["story-a-plan.md"]),
            ({"story-a-plan.md": plan(1), "story-b-plan.md": plan(1)}, ["story-a-plan.md", "story-b-plan.md"]),
            ({"story-a-plan.md": plan(1, "backlog")}, ["story-a-plan.md", "status 'backlog'"]),
        ):
            for path in self.epic.glob("*-plan.md"):
                path.unlink()
            for name, text in files.items():
                self.add(name, text)
            r = run("next", str(self.epic))
            self.assertEqual(r.returncode, 1, r.stdout)
            for name in names:
                self.assertIn(name, json.loads(r.stderr)["error"])


class ActiveInitiativeTests(TreeCase):
    """With no folder, next, status, and find run on `{tickets.root}/{active_initiative}`."""

    def setUp(self):
        super().setUp()
        (self.root / "_bmad" / "scripts").mkdir()
        shutil.copy(CONFIG_UTILS, self.root / "_bmad" / "scripts" / "config_utils.py")
        self.configure("initiative-checkout")
        self.seed()

    def configure(self, initiative, layer="config.toml"):
        line = f'active_initiative = "{initiative}"\n' if initiative is not None else ""
        path = self.root / "_bmad" / ("custom" if layer != "config.toml" else "") / layer
        path.write_text(f'[core]\noutput_folder = "{{project-root}}/out"\n\n[modules.bmm]\n{line}')

    def elsewhere(self):
        other = tempfile.TemporaryDirectory()
        self.addCleanup(other.cleanup)
        return other.name

    def ok(self, r):
        self.assertEqual(r.returncode, 0, r.stderr)
        return json.loads(r.stdout)

    def fails(self, r, message):
        self.assertEqual(r.returncode, 1, r.stdout)
        self.assertIn(message, json.loads(r.stderr)["error"])

    def test_next_with_no_folder_runs_on_the_active_initiative(self):
        expected = self.ok(run("next", str(self.initiative)))
        self.assertEqual(self.ok(run("next", cwd=self.epic)), expected)
        self.assertEqual(expected["folder"], "initiative-checkout")

    def test_project_root_flag_names_the_project_from_anywhere(self):
        self.write_store(root="out")
        out = self.ok(run("--project-root", str(self.root), "status", cwd=self.elsewhere()))
        self.assertEqual(out["folder"], "initiative-checkout")
        self.assertEqual(out["counts"]["total"], 5)

    def test_root_substitutes_project_root_and_output_folder(self):
        for root in ("{project-root}/out", "{output_folder}"):
            self.write_store(root=root)
            self.assertEqual(self.ok(run("status", cwd=self.root))["folder"], "initiative-checkout", root)

    def test_find_by_ref_only(self):
        self.pricing()
        expected = self.ok(run("find", str(self.initiative), "1.2"))
        self.assertEqual(self.ok(run("find", "1.2", cwd=self.root)), expected)
        self.assertEqual(expected["title"], "Pricing rules")

    def test_a_given_folder_never_reads_the_config(self):
        (self.root / "_bmad" / "config.toml").write_text("not toml [")
        self.assertEqual(self.ok(run("next", str(self.epic), cwd=self.root))["folder"], "epic-cart")
        self.fails(run("next", cwd=self.root), "config.toml")

    def test_unset_active_initiative_names_the_key(self):
        for value in (None, ""):
            self.configure(value)
            self.fails(run("next", cwd=self.root), "modules.bmm.active_initiative")

    def test_no_project_root_found(self):
        self.fails(run("status", cwd=self.elsewhere()), "no project root")

    def test_missing_initiative_folder_names_the_resolved_path(self):
        self.configure("initiative-gone")
        self.fails(run("next", cwd=self.root), str((self.root / "out" / "initiative-gone").resolve()))

    def test_store_is_read_from_the_project_found_when_root_lies_outside_it(self):
        outside = Path(self.elsewhere())
        shutil.copytree(self.initiative, outside / "initiative-checkout")
        self.write_store("linear", outside.as_posix())
        r = run("next", cwd=self.root)
        self.assertEqual(r.returncode, 2, r.stderr)
        self.assertIn("sync ticket status", r.stderr)
        self.assertEqual(self.ok(run("status", cwd=self.root))["store"], "linear")

    def test_the_skill_installs_the_script_and_a_lone_copy_runs(self):
        bmod = tomllib.loads((SCRIPT.parents[1] / "bmod.toml").read_text(encoding="utf-8"))
        self.assertIn("scripts/tickets.py", bmod["skill"]["scripts"])
        installed = self.root / "_bmad" / "method" / "scripts"
        installed.mkdir(parents=True)
        shutil.copy(SCRIPT, installed)
        r = subprocess.run(
            [sys.executable, str(installed / "tickets.py"), "next"],
            text=True,
            capture_output=True,
            check=False,
            cwd=self.root,
        )
        self.assertEqual(self.ok(r)["folder"], "initiative-checkout")

    def test_mark_with_no_folder_blocks_a_ticket_in_the_active_initiative(self):
        pricing = self.pricing()
        r = run("mark", "1.2", "in-progress", "--blocked", "legal", cwd=self.root)
        self.assertEqual(self.ok(r)["plan"], str(pricing.resolve() / "story-pricing-rules-plan.md"))
        text = (pricing / "story-pricing-rules-plan.md").read_text(encoding="utf-8")
        self.assertIn(f'\nblocked_at: "{date.today().isoformat()}"\nblocked_reason: "legal"\n', text)
        blocked = self.ok(run("next", cwd=self.root))["blocked"]
        self.assertIn(
            ("epic-pricing", 2, "in-progress", "legal"),
            [(e["epic"], e["id"], e["status"], e["blocked_reason"]) for e in blocked],
        )

    def test_user_layer_overrides_the_base_config(self):
        self.configure("initiative-gone")
        self.configure("initiative-checkout", layer="config.user.toml")
        self.assertEqual(self.ok(run("next", cwd=self.root))["folder"], "initiative-checkout")


if __name__ == "__main__":
    unittest.main()
