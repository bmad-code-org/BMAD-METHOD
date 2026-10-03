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


def run(*args, cwd=None, stdin=None):
    # tickets.py writes UTF-8; text=True alone would decode with the locale's code page on Windows.
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args], encoding="utf-8", capture_output=True, check=False, cwd=cwd, input=stdin
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
        self.assertIn("# Café ✓ menu", (self.epic / "story-cafe-menu.md").read_text(encoding="utf-8"))

    def test_titles_that_slug_alike_get_their_own_file_and_plan(self):
        self.breakdown_epic(
            '[[entry]]\nid = 1\ntype = "story"\ntitle = "Café menu"\n\n'
            '[[entry]]\nid = 2\ntype = "story"\ntitle = "Cafe menu"\n'
        )
        plans = [Path(json.loads(run("find", str(self.epic), n).stdout)["plan"]).name for n in ("1", "2")]
        self.assertEqual(plans, ["story-cafe-menu-plan.md", "story-cafe-menu-2-plan.md"])
        self.assertEqual(json.loads(run("pull", str(self.epic), "2").stdout)["file"], "story-cafe-menu-2.md")
        self.assertEqual(json.loads(run("pull", str(self.epic), "1").stdout)["file"], "story-cafe-menu.md")
        plans = [Path(json.loads(run("find", str(self.epic), n).stdout)["plan"]).name for n in ("1", "2")]
        self.assertEqual(plans, ["story-cafe-menu-plan.md", "story-cafe-menu-2-plan.md"])

    def test_a_leaf_file_with_a_byte_order_mark_is_read(self):
        (self.epic / "story-scaffold.md").write_bytes(b"\xef\xbb\xbf" + ticket("done", 1).encode("utf-8"))
        rows = self.status_rows(self.epic)
        self.assertEqual([(r["file"], r["state"]) for r in rows], [("story-scaffold.md", "done")])

    def test_mark_keeps_a_plans_crlf_line_endings_and_byte_order_mark(self):
        self.breakdown_epic()
        path = self.epic / "story-scaffold-plan.md"
        text = plan(1, "in-progress").replace("\n", "\r\n")
        path.write_bytes(b"\xef\xbb\xbf" + text.encode("utf-8"))
        self.mark(str(self.epic), "1", "done")
        data = path.read_bytes()
        self.assertTrue(data.startswith(b"\xef\xbb\xbf"))
        self.assertNotIn(b"\n", data.replace(b"\r\n", b""))
        self.assertIn(b"\r\nstatus: done\r\n", data)
        self.assertEqual(self.status_rows(self.epic)[0]["status"], "done")

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

    def test_a_leaf_file_without_after_or_hitl_reads_them_as_empty_and_flags_the_drift(self):
        self.breakdown_epic()
        self.add("story-ui-shell.md", '---\nid: 2\ntype: story\ntitle: "UI shell"\n---\n# UI shell\n')
        self.add("spike-tax-engine.md", '---\nid: 3\ntype: spike\ntitle: "Tax engine?"\nafter: [1]\n---\n# Tax\n')
        rows = {r["id"]: r for r in self.status_rows(self.epic)}
        self.assertEqual((rows[2]["after"], rows[2]["drift"]), ([], {"after": {"file": [], "entry": [1]}}))
        self.assertEqual((rows[3]["hitl"], rows[3]["drift"]), (False, {"hitl": {"file": False, "entry": True}}))
        self.assertNotIn("drift", rows[1])

    def test_a_blocked_row_names_the_prerequisites_it_waits_on(self):
        self.pricing()
        self.breakdown_epic(self.BREAKDOWN.replace("after = [2, 3]", 'after = [2, 3, "1.2"]'))
        self.add("story-scaffold-plan.md", plan(1, "in-progress"))
        self.add("spike-tax-engine-plan.md", plan(3, "in-review"))
        self.add("story-ui-shell-plan.md", plan(2, "blocked", blocked_reason="legal"))
        out = self.next()
        blocked = {e["id"]: e for e in out["blocked"]}
        self.assertEqual(blocked[4]["waiting_on"], [2, "1.2"])
        self.assertEqual(blocked[2]["waiting_on"], [1])
        # 3 is in review with 1 still open: a ticket already under way is not waiting.
        self.assertEqual([e["id"] for e in out["in_progress"]], [1, 3])
        self.assertFalse(any("waiting_on" in e for e in out["in_progress"]))
        self.add("story-scaffold-plan.md", plan(1, "done"))
        self.assertNotIn("waiting_on", {e["id"]: e for e in self.next()["blocked"]}[2])

    def test_status_gives_the_id_a_new_ticket_takes(self):
        self.pricing()
        self.breakdown_epic()
        self.assertEqual(json.loads(run("status", str(self.epic)).stdout)["next_id"], 5)
        self.breakdown_epic(self.BREAKDOWN + '\n[[entry]]\nid = "6a"\ntype = "story"\ntitle = "Lettered"\n')
        self.assertEqual(json.loads(run("status", str(self.epic)).stdout)["next_id"], 7)
        self.add("story-unlisted.md", ticket("", 9))
        out = json.loads(run("status", str(self.epic)).stdout)
        self.assertEqual(out["next_id"], 10)
        out = json.loads(run("status", str(self.initiative)).stdout)
        self.assertNotIn("next_id", out)
        self.assertEqual({e["slug"]: e["next_id"] for e in out["epics"]}, {"epic-pricing": 3, "epic-cart": 10})
        backlog = self.add_backlog()
        self.assertEqual(json.loads(run("status", str(backlog)).stdout)["next_id"], 1)
        self.add("bug-x.md", ticket("draft", 7, kind="bug"), backlog)
        self.assertEqual(json.loads(run("status", str(backlog)).stdout)["next_id"], 8)

    def test_a_folders_own_next_id_keeps_a_moved_entrys_id_from_coming_back(self):
        self.breakdown_epic("next_id = 9\n" + self.BREAKDOWN)
        self.assertEqual(json.loads(run("status", str(self.epic)).stdout)["next_id"], 9)
        self.breakdown_epic("next_id = 3\n" + self.BREAKDOWN)
        self.assertEqual(json.loads(run("status", str(self.epic)).stdout)["next_id"], 5)
        self.breakdown_epic('next_id = "9"\n' + self.BREAKDOWN)
        r = run("status", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("`next_id` must be a whole number", r.stderr)

    def test_next_and_find_carry_the_drift_too(self):
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("draft", 1))
        self.add("story-ui-shell.md", ticket("draft", 2, after="[]"))
        drift = {"after": {"file": [], "entry": [1]}}
        ready = {r["id"]: r for r in self.next()["ready_to_start"]}
        self.assertEqual(ready[2]["drift"], drift)
        self.assertNotIn("drift", ready[1])
        self.assertEqual(json.loads(run("find", str(self.epic), "2").stdout)["drift"], drift)

    def test_an_unknown_holds_a_ticket_until_it_is_settled(self):
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Scaffold"', 'title = "Scaffold"\nunknown = "Which host?"'))
        out = self.next()
        self.assertEqual(out["ready_to_start"], [])
        row = {e["id"]: e for e in out["blocked"]}[1]
        self.assertEqual(row["unknown"], "Which host?")
        self.assertNotIn("waiting_on", row)
        # Pulled, the file's Notes hold it.
        self.assertEqual(run("pull", str(self.epic), "1").returncode, 0)
        self.assertEqual({e["id"]: e for e in self.next()["blocked"]}[1]["unknown"], "Which host?")
        leaf = self.epic / "story-scaffold.md"
        text = leaf.read_text(encoding="utf-8")
        leaf.write_text(text.replace("- Unknown: Which host?", "- Decision: the EU host."), encoding="utf-8")
        out = self.next()
        self.assertEqual([e["id"] for e in out["ready_to_start"]], [1])
        self.assertNotIn("unknown", out["ready_to_start"][0])

    def test_an_unknown_does_not_keep_a_ticket_from_refining(self):
        self.breakdown_epic(
            self.BREAKDOWN.replace('title = "Scaffold"', 'title = "Scaffold"\nrefine = true\nunknown = "Which host?"')
        )
        self.assertEqual([e["id"] for e in self.next()["ready_to_refine"]], [1])
        # Refined, and the only `Unknown:` left is a template's example in a comment.
        self.add("story-scaffold.md", ticket("", 1, refined="true") + "<!-- Example:\n- Unknown: not this one\n-->\n")
        self.assertEqual([e["id"] for e in self.next()["ready_to_start"]], [1])

    def test_rows_carry_the_checkpoints_an_entry_sets(self):
        self.breakdown_epic(
            self.BREAKDOWN.replace(
                'title = "Scaffold"', 'title = "Scaffold"\nplan_checkpoint = true\ndone_checkpoint = true'
            )
        )
        first, second = self.next()["ready_to_start"][0], self.status_rows(self.epic)[1]
        self.assertEqual((first["plan_checkpoint"], first["done_checkpoint"]), (True, True))
        self.assertNotIn("plan_checkpoint", second)
        self.assertTrue(json.loads(run("find", str(self.epic), "1").stdout)["done_checkpoint"])

    def test_every_row_carries_the_tickets_risk_and_the_leaf_files_wins(self):
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Scaffold"', 'title = "Scaffold"\nrisk = "medium"'))
        rows = {r["id"]: r for r in self.status_rows(self.epic)}
        self.assertEqual((rows[1]["risk"], rows[2]["risk"]), ("medium", ""))
        self.assertEqual(self.next()["ready_to_start"][0]["risk"], "medium")
        self.add("story-scaffold.md", ticket("", 1).replace("risk: low", "risk: high"))
        self.assertEqual(json.loads(run("find", str(self.epic), "1").stdout)["risk"], "high")

    def test_a_plan_without_an_assignee_keeps_the_leafs_and_one_with_it_wins(self):
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("", 1, assignee='"ann"'))
        self.add("story-scaffold-plan.md", plan(1, "in-progress"))
        self.assertEqual(self.status_rows(self.epic)[0]["assignee"], "ann")
        self.add("story-scaffold-plan.md", plan(1, "in-progress", assignee="bob"))
        self.assertEqual(self.status_rows(self.epic)[0]["assignee"], "bob")

    def mirror(self, items, folder=None):
        return run("mirror", str(folder or self.epic), stdin=json.dumps(items))

    def test_mirror_refuses_the_repo_store(self):
        self.breakdown_epic()
        r = self.mirror([{"ref": "1", "tracker_status": "done"}])
        self.assertEqual(r.returncode, 2)
        self.assertIn("no tracker", r.stderr)
        self.assertEqual(list(self.epic.glob("story-*.md")), [])

    def test_mirror_pulls_a_leaf_and_writes_only_the_keys_given(self):
        self.write_store("jira")
        self.breakdown_epic()
        r = self.mirror(
            [
                {
                    "ref": 2,
                    "tracker_id": "42",
                    "remote": "https://x.test/42",
                    "tracker_status": "in-progress",
                    "assignee": "ann",
                    "after": [1, "41"],
                },
                {"ref": "scaffold", "tracker_id": "41", "tracker_status": "done"},
            ]
        )
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout)
        self.assertEqual(
            [(m["ref"], m["file"], m["pulled"]) for m in out["mirrored"]],
            [("2", "story-ui-shell.md", True), ("1", "story-scaffold.md", True)],
        )
        self.assertEqual(out["unmatched"], [])
        text = (self.epic / "story-ui-shell.md").read_text(encoding="utf-8")
        for line in (
            'tracker_id: "42"',
            'remote: "https://x.test/42"',
            "tracker_status: in-progress",
            'assignee: "ann"',
            'after: [1, "41"]',
        ):
            self.assertIn(f"\n{line}\n", text)
        self.assertNotIn("\nstatus:", text)
        rows = {t["id"]: t for t in self.status_rows(self.epic)}
        self.assertEqual((rows[2]["state"], rows[2]["assignee"], rows[2]["after"]), ("in-progress", "ann", [1]))
        self.assertEqual(rows[1]["state"], "done")
        self.assertNotIn("drift", rows[2])
        self.assertEqual([e["id"] for e in self.next("--synced")["ready_to_start"]], [3])

    def test_mirror_finds_a_ticket_by_its_tracker_id_and_an_empty_value_removes_the_line(self):
        self.write_store("github")
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("", 1, tracker_id='"41"', assignee='"ann"', tracker_status="backlog"))
        r = self.mirror([{"tracker_id": "41", "tracker_status": "review", "assignee": ""}])
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertFalse(json.loads(r.stdout)["mirrored"][0]["pulled"])
        text = (self.epic / "story-scaffold.md").read_text(encoding="utf-8")
        self.assertIn("\ntracker_status: review\n", text)
        self.assertNotIn("assignee", text)
        self.assertIn('\ntracker_id: "41"\n', text)

    def test_a_tracker_id_alone_matches_only_the_ticket_that_carries_it(self):
        self.write_store("github")
        self.breakdown_epic(self.BREAKDOWN.replace('title = "Codes"', 'title = "Port SHOP-12 codes"'))
        self.add("story-scaffold.md", ticket("", 1, tracker_id='"3"'))
        r = self.mirror([{"tracker_id": 3, "tracker_status": "done"}, {"tracker_id": "SHOP-12", "assignee": "ann"}])
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout)
        self.assertEqual([m["file"] for m in out["mirrored"]], ["story-scaffold.md"])
        self.assertEqual([u["ref"] for u in out["unmatched"]], ["SHOP-12"])
        self.assertEqual([p.name for p in self.epic.glob("s*.md")], ["story-scaffold.md"])
        self.assertEqual(self.status_rows(self.epic)[0]["state"], "done")
        self.add("story-ui-shell.md", ticket("", 2, tracker_id='"3"'))
        r = self.mirror([{"tracker_id": "3", "tracker_status": "backlog"}])
        self.assertEqual(r.returncode, 1)
        self.assertIn("more than one", json.loads(r.stderr)["error"])

    def test_mirror_lists_a_ticket_the_tree_does_not_hold_and_writes_the_rest(self):
        self.write_store("linear")
        self.breakdown_epic()
        r = self.mirror([{"ref": "SHOP-99", "tracker_status": "done"}, {"ref": 1, "tracker_status": "done"}])
        self.assertEqual(r.returncode, 0, r.stderr)
        out = json.loads(r.stdout)
        self.assertEqual([u["ref"] for u in out["unmatched"]], ["SHOP-99"])
        self.assertEqual(self.status_rows(self.epic)[0]["state"], "done")

    def test_a_failed_mirror_still_lists_the_unmatched_tickets(self):
        self.write_store("linear")
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("", 1, tracker_id='"SHOP-1"'))
        before = (self.epic / "story-scaffold.md").read_bytes()
        # A known ticket now waits on a tracker item the tree does not hold yet.
        r = self.mirror(
            [{"tracker_id": "SHOP-1", "after": ["SHOP-2"]}, {"tracker_id": "SHOP-2", "tracker_status": "backlog"}]
        )
        self.assertEqual(r.returncode, 1)
        err = json.loads(r.stderr)
        self.assertIn("nothing was mirrored", err["error"])
        self.assertEqual([u["ref"] for u in err["unmatched"]], ["SHOP-2"])
        self.assertEqual((self.epic / "story-scaffold.md").read_bytes(), before)

    def test_a_tracker_id_on_two_tickets_is_refused_and_a_mirror_that_makes_one_rolls_back(self):
        self.write_store("linear")
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("", 1, tracker_id='"SHOP-1"'))
        before = (self.epic / "story-scaffold.md").read_bytes()
        # The same id again, in another case, would make `after = ["SHOP-1"]` point at whichever was read last.
        r = self.mirror([{"ref": 2, "tracker_id": "shop-1"}])
        self.assertEqual(r.returncode, 1)
        self.assertIn("more than one ticket", json.loads(r.stderr)["error"])
        self.assertEqual((self.epic / "story-scaffold.md").read_bytes(), before)
        self.assertFalse((self.epic / "story-ui-shell.md").exists())
        self.add("story-ui-shell.md", ticket("", 2, after="[1]", tracker_id='"SHOP-1"'))
        r = run("status", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("tracker_id 'shop-1' is on more than one ticket", json.loads(r.stderr)["error"])

    def test_mirror_writes_nothing_when_a_value_is_refused_or_breaks_the_tree(self):
        self.write_store("jira")
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("", 1))
        before = (self.epic / "story-scaffold.md").read_text(encoding="utf-8")
        for items, message in (
            ([{"ref": 1, "tracker_status": "done"}, {"ref": 2, "status": "done"}], "never mirrored"),
            ([{"ref": 1, "tracker_status": "closed"}], "tracker_status"),
            ([{"ref": 1, "tracker_status": "done"}, {"ref": 2, "after": ["NOPE-7"]}], "nothing was mirrored"),
            ([{"ref": 1, "tracker_status": "done"}, {"ref": "1", "assignee": "ann"}], "named twice"),
            ({"ref": 1}, "JSON array"),
        ):
            r = self.mirror(items)
            self.assertEqual(r.returncode, 1, items)
            self.assertIn(message, json.loads(r.stderr)["error"])
            self.assertEqual((self.epic / "story-scaffold.md").read_text(encoding="utf-8"), before)
            self.assertFalse((self.epic / "story-ui-shell.md").exists())
        r = run("mirror", str(self.epic), stdin="not json")
        self.assertEqual(r.returncode, 1)

    def test_mirror_keeps_a_leafs_crlf_line_endings(self):
        self.write_store("jira")
        self.breakdown_epic()
        (self.epic / "story-scaffold.md").write_bytes(ticket("", 1).replace("\n", "\r\n").encode("utf-8"))
        self.assertEqual(self.mirror([{"ref": 1, "tracker_status": "done"}]).returncode, 0)
        raw = (self.epic / "story-scaffold.md").read_bytes()
        self.assertIn(b"\r\ntracker_status: done\r\n", raw)
        self.assertNotIn(b"\n", raw.replace(b"\r\n", b""))

    def test_a_pulled_leaf_matches_its_entry_until_the_entry_changes(self):
        self.breakdown_epic()
        for n in ("2", "3"):
            self.assertEqual(run("pull", str(self.epic), n).returncode, 0)
        self.assertFalse(any("drift" in r for r in self.status_rows(self.epic)))
        self.breakdown_epic(self.BREAKDOWN.replace("hitl = true", "hitl = false"))
        rows = {r["id"]: r for r in self.status_rows(self.epic)}
        self.assertTrue(rows[3]["drift"])
        self.assertTrue(rows[3]["hitl"])

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

    def test_a_bug_waits_for_refinement_without_refine_set(self):
        self.breakdown_epic('[[entry]]\nid = 1\ntype = "bug"\ntitle = "Missing criteria"\n')
        out = self.next()
        self.assertEqual([t["id"] for t in out["ready_to_refine"]], [1])
        self.assertEqual(out["ready_to_start"], [])
        r = run("pull", str(self.epic), "1")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(json.loads(r.stdout), {"file": "bug-missing-criteria.md", "refine": True})
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["bug-missing-criteria.md"])

    def test_a_leaf_file_that_says_bug_waits_for_refinement(self):
        self.breakdown_epic('[[entry]]\nid = 1\ntype = "story"\ntitle = "Was a story"\n')
        self.add("bug-was-a-story.md", ticket("ready-for-dev", 1, kind="bug"))
        self.assertEqual(self.files(self.next()["ready_to_refine"]), ["bug-was-a-story.md"])

    def test_a_refined_bug_is_ready_to_start(self):
        self.breakdown_epic('[[entry]]\nid = 1\ntype = "bug"\ntitle = "Refined bug"\n')
        self.add("bug-refined-bug.md", ticket("ready-for-dev", 1, kind="bug", refined="true"))
        out = self.next()
        self.assertEqual(self.files(out["ready_to_start"]), ["bug-refined-bug.md"])
        self.assertEqual(out["ready_to_refine"], [])

    def test_pull_leaves_out_empty_fields_but_always_writes_after_and_hitl(self):
        self.breakdown_epic()
        run("pull", str(self.epic), "1")
        head = (self.epic / "story-scaffold.md").read_text(encoding="utf-8").split("---")[1]
        self.assertEqual(
            head, '\nid: 1\ntype: story\ntitle: "Scaffold"\nparent: epic-cart\ncovers: [R1]\nafter: []\nhitl: false\n'
        )
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
        self.breakdown_epic()
        self.add("story-ui-shell.md", "notes, not a ticket\n")
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
        self.assertIn("## Notes\n\n- Unknown: Which host?\n- Reuse the mailer.\n", text)

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
            (self.BREAKDOWN.replace("id = 4", 'id = "3"'), "two entries with id 3"),
            (self.BREAKDOWN.replace("id = 4", 'id = "4-b"'), "needs an `id`"),
            (self.BREAKDOWN.replace("id = 4", 'id = "true"'), "needs an `id`"),
            (self.BREAKDOWN.replace("id = 4\n", ""), "needs an `id`"),
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

    def test_status_shows_the_declared_epic_graph_before_and_after_inception(self):
        self.pricing()
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = 1\nslug = "epic-pricing"\n\n'
            '[[epic]]\nid = 2\nslug = "epic-cart"\nafter = [{ epic = 1, needs = "the pricing contract" }]\n'
        )
        for _ in range(2):
            status = json.loads(run("status", str(self.initiative)).stdout)
            self.assertEqual(
                [(e["slug"], e["after"], e["gated_by"]) for e in status["epics"]],
                [
                    ("epic-pricing", [], []),
                    ("epic-cart", [{"epic": "epic-pricing", "needs": "the pricing contract"}], []),
                ],
            )
            self.breakdown_epic()

    def test_an_undeclared_or_backward_cross_epic_after_is_reported(self):
        self.pricing()
        self.breakdown_epic()
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = 1\nslug = "epic-pricing"\n\n[[epic]]\nid = 2\nslug = "epic-cart"\n'
        )
        (self.initiative / "epic-pricing" / "tickets.toml").write_text(
            '[[entry]]\nid = 1\ntype = "story"\ntitle = "Pricing contract"\nafter = ["2.1"]\n'
        )
        for command, folder in (("status", self.initiative), ("next", self.initiative), ("status", self.epic)):
            out = json.loads(run(command, str(folder)).stdout)
            if folder == self.epic:
                self.assertEqual((out["undeclared_after"], out["order_conflict"]), ([], []))
                continue
            self.assertEqual(
                out["undeclared_after"], [{"epic": "epic-pricing", "after": "epic-cart", "ref": "1.1", "names": "2.1"}]
            )
            self.assertEqual(out["order_conflict"], [{"epic": "epic-pricing", "after": "epic-cart"}])
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = 1\nslug = "epic-pricing"\nafter = [{ epic = 2, needs = "the cart" }]\n\n'
            '[[epic]]\nid = 2\nslug = "epic-cart"\n'
        )
        out = json.loads(run("status", str(self.initiative)).stdout)
        self.assertEqual(out["undeclared_after"], [])
        self.assertEqual(out["order_conflict"], [{"epic": "epic-pricing", "after": "epic-cart"}])

    def test_after_naming_a_backlog_file_says_to_move_it_into_the_epic(self):
        self.add("story-thing.md", ticket("", kind="story"), self.add_backlog())
        self.add("story-scaffold.md", ticket("draft", 1, after="[story-thing]"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("move a backlog ticket into the epic as an entry", json.loads(r.stderr)["error"])
        self.breakdown_epic()
        self.add("story-scaffold.md", ticket("draft", 1, after="[story-ui-shell]"))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1)
        self.assertIn("use the entry's id", json.loads(r.stderr)["error"])

    def test_an_epic_gate_counts_once_and_its_order_before_inception(self):
        self.pricing()
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = 1\nslug = "epic-cart"\n\n[[epic]]\nid = 2\nslug = "epic-pricing"\n'
        )
        (self.epic / "epic-cart.md").write_text("---\ntype: epic\nafter: [epic-pricing]\n---\n# epic-cart\n")
        out = json.loads(run("status", str(self.initiative)).stdout)
        self.assertEqual(
            (out["undeclared_after"], out["order_conflict"]), ([], [{"epic": "epic-cart", "after": "epic-pricing"}])
        )
        self.breakdown_epic('[[entry]]\nid = 1\ntype = "story"\ntitle = "Scaffold"\nafter = ["epic-pricing"]\n')
        out = json.loads(run("status", str(self.initiative)).stdout)
        self.assertEqual(
            out["undeclared_after"],
            [{"epic": "epic-cart", "after": "epic-pricing", "ref": "1.1", "names": "epic-pricing"}],
        )
        self.assertEqual(out["order_conflict"], [{"epic": "epic-cart", "after": "epic-pricing"}])

    def test_epics_need_an_id_a_slug_and_a_valid_after(self):
        self.pricing()
        toml = self.initiative / "tickets.toml"
        good = toml.read_text(encoding="utf-8")
        for bad, message in (
            (good.replace("id = 2\n", ""), "needs an `id`"),
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

    def test_an_id_takes_letters_and_digits_wherever_a_number_goes(self):
        pricing = self.add_epic("epic-pricing")
        (pricing / "tickets.toml").write_text(
            '[[entry]]\nid = "6a"\ntype = "story"\ntitle = "Pricing contract"\n\n'
            '[[entry]]\nid = 7\ntype = "story"\ntitle = "Pricing rules"\nafter = ["6a"]\n'
        )
        (self.initiative / "tickets.toml").write_text(
            '[[epic]]\nid = "1b"\nslug = "epic-pricing"\n\n'
            '[[epic]]\nid = 2\nslug = "epic-cart"\nafter = [{ epic = "1b", needs = "prices" }]\n'
        )
        self.breakdown_epic('[[entry]]\nid = "2a"\ntype = "story"\ntitle = "Totals for 6a"\nafter = ["1b.6a"]\n')
        status = json.loads(run("status", str(self.initiative)).stdout)
        rows = {r["ref"]: r for r in status["tickets"]}
        self.assertEqual(list(rows), ["1b.6a", "1b.7", "2.2a"])
        self.assertEqual((rows["1b.7"]["after"], rows["2.2a"]["after"]), (["6a"], ["1b.6a"]))
        self.assertEqual(status["unpinned_after"] + status["undeclared_after"], [])

        self.assertEqual(run("pull", str(pricing), "7").returncode, 0)
        self.assertIn("id: 7\n", (pricing / "story-pricing-rules.md").read_text(encoding="utf-8"))
        self.assertIn("after: [6a]\n", (pricing / "story-pricing-rules.md").read_text(encoding="utf-8"))
        self.assertEqual(run("pull", str(pricing), "6a").returncode, 0)
        self.assertIn("id: 6a\n", (pricing / "story-pricing-contract.md").read_text(encoding="utf-8"))
        self.assertNotIn("drift", json.dumps(self.status_rows(pricing)))

        self.assertEqual([e["id"] for e in self.next()["blocked"]], ["2a"])
        self.add("story-pricing-contract-plan.md", plan("6a", "done"), pricing)
        self.assertEqual([e["id"] for e in self.next()["ready_to_start"]], ["2a"])
        # A bare lettered id names its ticket from any folder, before the title that contains it.
        for folder, ref in ((self.initiative, "1b.6a"), (pricing, "6a"), (self.initiative, "6a"), (self.epic, "6a")):
            found = json.loads(run("find", str(folder), ref).stdout)
            self.assertEqual((found["id"], found["state"]), ("6a", "done"))
        self.assertEqual(run("mark", str(self.epic), "2a", "in-review").returncode, 0)
        self.assertIn("ticket: 2a\n", (self.epic / "story-totals-for-6a-plan.md").read_text(encoding="utf-8"))
        self.assertEqual(self.status_rows(self.epic)[0]["state"], "review")

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

    def test_find_on_a_pulled_entry_leaves_the_text_to_the_file(self):
        self.breakdown_epic(
            self.BREAKDOWN.replace(
                'title = "Scaffold"',
                'title = "Scaffold"\ndescription = "The service."\nverify = "It runs."\n'
                'unknown = "Which host?"\nreferences = ["SPINE.md#ad-8"]\nnotes = ["Reuse the mailer."]',
            )
        )
        self.assertEqual(run("pull", str(self.epic), "1").returncode, 0)
        leaf = self.epic / "story-scaffold.md"
        leaf.write_text(leaf.read_text(encoding="utf-8").replace("Which host?", "Which region?"), encoding="utf-8")
        hit = json.loads(run("find", str(self.epic), "1").stdout)
        self.assertEqual([hit[k] for k in ("description", "verify", "references", "notes")], ["", "", [], []])
        self.assertEqual(hit["unknown"], "Which region?")
        self.assertEqual(hit["story_file"], str(self.epic.resolve() / "story-scaffold.md"))

    def test_find_names_the_initiative_file_for_a_leaf_directly_under_it(self):
        solo = self.root / "out" / "initiative-solo"
        solo.mkdir()
        (solo / "initiative-solo.md").write_text("---\ntype: initiative\n---\n# Solo\n")
        (solo / "tickets.toml").write_text('[[entry]]\nid = 1\ntype = "story"\ntitle = "Only"\n')
        hit = json.loads(run("find", str(solo), "1").stdout)
        self.assertEqual(hit["epic_file"], str(solo.resolve() / "initiative-solo.md"))
        self.assertIsNone(hit["story_file"])

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

    def test_two_plans_for_one_ticket_error(self):
        self.breakdown_epic()
        self.add("story-a-plan.md", plan(1))
        self.add("story-b-plan.md", plan(1))
        r = run("next", str(self.epic))
        self.assertEqual(r.returncode, 1, r.stdout)
        for name in ("story-a-plan.md", "story-b-plan.md"):
            self.assertIn(name, json.loads(r.stderr)["error"])

    def test_an_orphan_plan_is_a_problem_and_the_rest_of_the_tree_still_reads(self):
        self.breakdown_epic()
        for ref in (9, "story-nothing"):
            self.add("story-a-plan.md", plan(ref))
            for command in ("next", "status"):
                r = run(command, str(self.epic))
                self.assertEqual(r.returncode, 0, r.stderr)
                out = json.loads(r.stdout)
                self.assertEqual(len(out["problems"]), 1)
                self.assertIn("story-a-plan.md", out["problems"][0])
            self.assertEqual(self.files(self.next()["ready_to_start"]), [None])

    def test_a_plan_with_an_unknown_status_blocks_its_ticket_until_mark_fixes_it(self):
        self.breakdown_epic()
        self.add("story-scaffold-plan.md", plan(1, "already-satisfied"))
        out = self.next()
        self.assertEqual(out["ready_to_start"], [])
        blocked = {t["id"]: t for t in out["blocked"]}
        self.assertIn("already-satisfied", blocked[1]["blocked_reason"])
        self.assertIn("status 'already-satisfied'", out["problems"][0])
        self.assertEqual(run("mark", str(self.epic), "1", "done").returncode, 0)
        out = self.next()
        self.assertNotIn("problems", out)
        self.assertEqual([t["id"] for t in out["ready_to_start"]], [2, 3])


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
        path.write_text(f'[core]\noutput_folder = "{{project-root}}/out"\n{line}')

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

    def test_with_no_folder_next_and_status_also_report_the_backlog(self):
        self.assertNotIn("backlog", self.ok(run("next", cwd=self.root)))
        backlog = self.add_backlog()
        self.add("bug-x.md", ticket("ready-for-dev", kind="bug", refined="true"), backlog)
        out = self.ok(run("next", cwd=self.root))
        self.assertEqual(out["folder"], "initiative-checkout")
        self.assertEqual(
            (out["backlog"]["folder"], out["backlog"]["ready_to_start"][0]["ref"]), ("backlog", "bug-x.md")
        )
        self.assertEqual(self.ok(run("find", "backlog", "bug-x.md", cwd=self.root))["file"], "bug-x.md")
        out = self.ok(run("status", cwd=self.root))
        self.assertEqual((out["counts"]["total"], out["backlog"]["counts"]), (5, {"total": 1, "backlog": 1}))
        self.assertNotIn("backlog", self.ok(run("next", str(self.initiative))))
        self.add("bug-y.md", ticket("nonsense", kind="bug"), backlog)
        out = self.ok(run("next", cwd=self.root))
        self.assertIn("status", out["backlog"]["error"])
        self.assertEqual(len(out["ready_to_refine"]), 2)

    def test_with_no_folder_a_ticket_the_initiative_lacks_is_found_in_the_backlog(self):
        backlog = self.add_backlog()
        self.add("bug-x.md", ticket("draft", 7, kind="bug", tracker_id='"SHOP-7"'), backlog)
        hit = self.ok(run("find", "bug-x.md", cwd=self.root))
        self.assertEqual((hit["folder"], hit["plan"]), ("backlog", str(backlog.resolve() / "bug-x-plan.md")))
        self.assertEqual(self.ok(run("find", "SHOP-7", cwd=self.root))["ref"], "bug-x.md")
        self.fails(run("find", "bug-nope", cwd=self.root), "no ticket matches")
        self.fails(run("find", str(self.initiative), "bug-x.md"), "no ticket matches")
        self.ok(run("mark", "bug-x.md", "done", cwd=self.root))
        self.assertTrue((backlog / "bug-x-plan.md").is_file())
        self.write_store("jira")
        r = run("mirror", cwd=self.root, stdin=json.dumps([{"tracker_id": "SHOP-7", "tracker_status": "done"}]))
        self.assertEqual([m["ref"] for m in self.ok(r)["mirrored"]], ["bug-x.md"])
        self.assertIn("\ntracker_status: done\n", (backlog / "bug-x.md").read_text(encoding="utf-8"))

    def test_a_backlog_that_cannot_be_read_is_reported_and_the_initiative_still_answers(self):
        backlog = self.add_backlog()
        (backlog / "bug-x.md").write_bytes(b"---\ntype: bug\ntitle: \xff\n---\n")
        out = self.ok(run("status", cwd=self.root))
        self.assertEqual((out["counts"]["total"], out["backlog"]["folder"]), (5, "backlog"))
        self.assertIn("error", out["backlog"])
        self.fails(run("find", "bug-x.md", cwd=self.root), "no ticket matches")
        self.write_store("jira")
        r = run("mirror", cwd=self.root, stdin=json.dumps([{"ref": "story-scaffold", "tracker_status": "done"}]))
        self.assertEqual([m["file"] for m in self.ok(r)["mirrored"]], ["story-scaffold.md"])

    def test_an_epic_is_found_by_its_folder_name_under_the_active_initiative(self):
        out = self.ok(run("--project-root", str(self.root), "status", "epic-cart", cwd=self.elsewhere()))
        self.assertEqual((out["folder"], out["counts"]["total"]), ("epic-cart", 5))
        self.configure(None)
        self.fails(run("--project-root", str(self.root), "status", "epic-cart", cwd=self.elsewhere()), "not a folder")

    def test_the_backlog_as_active_initiative_is_reported_once(self):
        backlog = self.add_backlog()
        self.add("bug-x.md", ticket("draft", kind="bug"), backlog)
        self.configure("backlog")
        out = self.ok(run("status", cwd=self.root))
        self.assertEqual(out["folder"], "backlog")
        self.assertNotIn("backlog", out)

    def test_project_root_flag_names_the_project_from_anywhere(self):
        self.write_store(root="out")
        out = self.ok(run("--project-root", str(self.root), "status", cwd=self.elsewhere()))
        self.assertEqual(out["folder"], "initiative-checkout")
        self.assertEqual(out["counts"]["total"], 5)

    def test_a_relative_folder_is_found_under_the_store_from_anywhere(self):
        out = self.ok(run("--project-root", str(self.root), "status", "initiative-checkout", cwd=self.elsewhere()))
        self.assertEqual(out["folder"], "initiative-checkout")
        out = self.ok(
            run("--project-root", str(self.root), "next", "out/initiative-checkout/epic-cart", cwd=self.elsewhere())
        )
        self.assertEqual(out["folder"], "epic-cart")
        self.fails(
            run("--project-root", str(self.root), "status", "initiative-gone", cwd=self.elsewhere()), "not a folder"
        )

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
            self.fails(run("next", cwd=self.root), "core.active_initiative")

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
