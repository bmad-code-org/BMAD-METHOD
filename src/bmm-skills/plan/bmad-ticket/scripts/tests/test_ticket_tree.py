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
        # A node carries status but never hitl; callers may pin it via extra.
        leaf_lines = "" if "status:" in extra else f"status: {status}\n"
        if "description:" not in extra:
            extra += f'description: "{title} epic"\n'
    else:
        leaf_lines = f"status: {status}\nhitl: false\n"
    return (f"---\nschema: 1\nid: {tid}\ntype: {ttype}\ntitle: \"{title}\"\n"
            f"{leaf_lines}depends_on: {deps}\ncovers: {covers}\n{extra}"
            f"risk: 2\ncreated: 2026-08-01\n---\n\n# {tid}\n")


def initiative_ticket(tid, title, status="backlog", extra=""):
    """The root node: no risk, no hitl, no depends_on, no covers."""
    if "description:" not in extra:
        extra += f'description: "{title} product"\n'
    state = "" if "status:" in extra else f"status: {status}\n"
    return (f"---\nschema: 1\nid: {tid}\ntype: initiative\ntitle: \"{title}\"\n"
            f"{state}{extra}created: 2026-08-01\n---\n\n# {tid}\n")


def run(*args):
    proc = subprocess.run([sys.executable, str(SCRIPT), *args],
                          capture_output=True, text=True)
    try:
        return proc.returncode, json.loads(proc.stdout)
    except json.JSONDecodeError:
        raise AssertionError(
            f"non-JSON output (exit {proc.returncode})\n"
            f"stdout: {proc.stdout!r}\nstderr: {proc.stderr!r}")


class TicketTreeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.tickets = self.root / "tickets"
        self.epic_dir = self.tickets / "alert-rules"
        self.epic_kids = self.epic_dir / "tickets"
        self.epic2_dir = self.tickets / "reporting"
        self.epic_kids.mkdir(parents=True)
        self.epic2_dir.mkdir(parents=True)
        (self.root / "ticket.md").write_text(initiative_ticket("ALRT-1", "Alerting"))
        (self.epic_dir / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\n'))
        (self.epic_kids / "ALRT-12-rule-crud.md").write_text(
            ticket("ALRT-12", "story", "Rule CRUD", status="done", covers="[CAP-4]"))
        (self.epic_kids / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", deps="[ALRT-12]", covers="[CAP-5]"))
        (self.tickets / "ALRT-31-snooze.md").write_text(
            ticket("ALRT-31", "task", "Snooze button", deps="[ALRT-3]"))
        # empty epic → unsliced
        (self.epic2_dir / "ticket.md").write_text(ticket("ALRT-40", "epic", "Reporting"))

    def tearDown(self):
        self.tmp.cleanup()

    def test_next_id_reads_key_from_root_node(self):
        code, out = run("next-id", "--root", str(self.root))
        self.assertEqual(code, 0)
        self.assertEqual(out["key"], "ALRT")  # the root node's id prefix, not a key: field
        self.assertEqual(out["id"], "ALRT-41")

    def test_initiative_node_key_wins_over_ids_in_tree(self):
        # A stray foreign-keyed ticket never confuses the key: the root node owns it.
        (self.tickets / "OTHER-9-stray.md").write_text(
            ticket("OTHER-9", "task", "Stray"))
        code, out = run("next-id", "--root", str(self.root))
        self.assertEqual(code, 0)
        self.assertEqual(out["id"], "ALRT-41")

    def test_rootless_tree_derives_key_from_ids(self):
        # No initiative set: tickets sit straight in the root tickets/ bin of the work store.
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / "tickets").mkdir()
            (root / "tickets" / "ALRT-5-loose.md").write_text(
                ticket("ALRT-5", "task", "Loose"))
            (root / "tickets" / "ALRT-6-other.md").write_text(
                ticket("ALRT-6", "task", "Other", deps="[ALRT-5]"))
            code, out = run("next-id", "--root", str(root))
            self.assertEqual(code, 0)
            self.assertEqual(out["key"], "ALRT")
            self.assertEqual(out["id"], "ALRT-7")
            # root/tickets/ is a legal home for leaves when there is no root node
            code, out = run("validate", "--root", str(root))
            self.assertEqual(code, 0, out)
            code, out = run("board", "--root", str(root))
            self.assertEqual(out["nodes"], [])
            self.assertEqual([b["id"] for b in out["bin"]], ["ALRT-5", "ALRT-6"])

    def test_next_id_empty_tree(self):
        with tempfile.TemporaryDirectory() as d:
            code, out = run("next-id", "--root", d, "--key", "NEW")
            self.assertEqual(out["id"], "NEW-1")

    def test_index_renders_a_map_to_out(self):
        out_file = self.root / "ticket-map.md"
        code, out = run("index", "--root", str(self.root), "--out", str(out_file))
        self.assertEqual(code, 0)
        text = out_file.read_text()
        self.assertIn("* [Alerting](ticket.md) - Alerting product", text)
        self.assertIn("  * [Alert rules](tickets/alert-rules/ticket.md) - Rules people manage",
                      text)
        self.assertIn("    * [Rule CRUD](tickets/alert-rules/tickets/ALRT-12-rule-crud.md)",
                      text)
        self.assertIn("  * [Snooze button](tickets/ALRT-31-snooze.md)", text)
        self.assertNotIn("status", text)  # identity only, no state
        # No frontmatter: a map written inside the tree is never read as a ticket.
        self.assertFalse(text.lstrip().startswith("---"))
        # The map is rendered on demand, never maintained on disk.
        self.assertFalse((self.root / "index.md").exists())
        proc = subprocess.run([sys.executable, str(SCRIPT), "index", "--root", str(self.root)],
                              capture_output=True, text=True)
        self.assertNotEqual(proc.returncode, 0)  # --out is required

    def test_scan_ignores_sibling_skill_folders(self):
        # prd/, spec/ and friends belong to other skills — never scanned as tickets.
        spec = self.root / "spec"
        spec.mkdir()
        (spec / "SPEC.md").write_text(
            "---\nschema: 1\nid: SPEC-foo\ntype: spec\ntitle: \"The spec\"\n---\n\n# spec\n")
        prd = self.root / "prd"
        prd.mkdir()
        (prd / "prd.md").write_text("---\ntitle: PRD\n---\n\n# PRD\n")
        code, out = run("list", "--root", str(self.root))
        self.assertEqual(code, 0)
        self.assertNotIn("SPEC-foo", [r["id"] for r in out["tickets"]])
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 0, out)
        self.assertEqual(out["errors"], [])

    def test_leaf_two_levels_deep_rolls_up_to_every_ancestor(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            outer = root / "tickets" / "outer"
            inner = outer / "tickets" / "inner"
            (inner / "tickets").mkdir(parents=True)
            (root / "ticket.md").write_text(initiative_ticket("DEEP-1", "Deep"))
            (outer / "ticket.md").write_text(ticket("DEEP-2", "epic", "Outer"))
            (inner / "ticket.md").write_text(ticket("DEEP-3", "epic", "Inner"))
            leaf = inner / "tickets" / "DEEP-4-deep-leaf.md"
            leaf.write_text(ticket("DEEP-4", "story", "Deep leaf"))
            code, out = run("validate", "--root", str(root))
            self.assertEqual(code, 0, out)
            code, out = run("list", "--root", str(root))
            self.assertIn("DEEP-4", [r["id"] for r in out["tickets"]])
            code, out = run("board", "--root", str(root))
            self.assertEqual({n["id"]: n["state"] for n in out["nodes"]},
                             {"DEEP-1": "backlog", "DEEP-2": "backlog",
                              "DEEP-3": "backlog"})
            # A leaf moving is progress against its ancestors, never their state:
            # only a person moves a node.
            leaf.write_text(ticket("DEEP-4", "story", "Deep leaf", status="done"))
            code, out = run("board", "--root", str(root))
            self.assertEqual({n["id"]: n["state"] for n in out["nodes"]},
                             {"DEEP-1": "backlog", "DEEP-2": "backlog",
                              "DEEP-3": "backlog"})
            counts = {n["id"]: n["counts"] for n in out["nodes"]}
            self.assertEqual(counts["DEEP-3"], {"done": 1})   # progress is derived
            self.assertEqual(counts["DEEP-2"], {})            # only direct leaves
            self.assertEqual({n["id"]: n["type"] for n in out["nodes"]},
                             {"DEEP-1": "initiative", "DEEP-2": "epic", "DEEP-3": "epic"})

    def test_frontier_dep_gating(self):
        code, out = run("frontier", "--root", str(self.root))
        ids = [t["id"] for t in out["frontier"]]
        self.assertIn("ALRT-13", ids)      # dep ALRT-12 is done
        self.assertNotIn("ALRT-31", ids)   # dep is epic ALRT-3, not computed done
        self.assertNotIn("ALRT-12", ids)   # already done

    def test_epic_dep_releases_only_when_marked_done(self):
        # All children done — epic done is intentional, never computed.
        (self.epic_kids / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="done", deps="[ALRT-12]"))
        code, out = run("frontier", "--root", str(self.root))
        ids = [t["id"] for t in out["frontier"]]
        self.assertNotIn("ALRT-31", ids)   # still gated: nobody marked the epic done
        # Retrospective/user stores done on the envelope — now it releases.
        (self.epic_dir / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\nstatus: done\n'))
        code, out = run("frontier", "--root", str(self.root))
        ids = [t["id"] for t in out["frontier"]]
        self.assertIn("ALRT-31", ids)

    def test_board_states(self):
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["nodes"]}
        counts = {e["id"]: e["counts"] for e in out["nodes"]}
        types = {e["id"]: e["type"] for e in out["nodes"]}
        # Nodes report what somebody stored; the counts carry the progress.
        self.assertEqual(states["ALRT-3"], "backlog")
        self.assertEqual(counts["ALRT-3"], {"done": 1, "backlog": 1})
        self.assertEqual(states["ALRT-40"], "backlog")  # childless
        self.assertEqual(counts["ALRT-40"], {})
        self.assertEqual(states["ALRT-1"], "backlog")
        self.assertEqual(types["ALRT-1"], "initiative")
        self.assertEqual(types["ALRT-3"], "epic")
        self.assertEqual(out["blocked"][0]["id"], "ALRT-31")
        self.assertEqual(out["leaf_totals"]["done"], 1)

    def test_board_node_state_is_stored_not_read_off_children(self):
        # Every child done still leaves the epic where its owner left it: an
        # epic finishes because someone agreed it did, not when a counter zeroes.
        (self.epic_kids / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="done", deps="[ALRT-12]"))
        code, out = run("board", "--root", str(self.root))
        nodes = {e["id"]: e for e in out["nodes"]}
        self.assertEqual(nodes["ALRT-3"]["state"], "backlog")
        self.assertEqual(nodes["ALRT-3"]["counts"], {"done": 2})

    def test_board_ready_is_a_stored_node_state(self):
        (self.epic_dir / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\nstatus: ready\n'))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(out["errors"], [])
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["nodes"]}
        self.assertEqual(states["ALRT-3"], "ready")
        # ready records that inception finished — it gates nothing downstream.
        code, out = run("frontier", "--root", str(self.root))
        self.assertNotIn("ALRT-31", [t["id"] for t in out["frontier"]])

    def test_board_all_dropped_children_leave_the_epic_alone(self):
        for name, tid in (("ALRT-12-rule-crud.md", "ALRT-12"),
                          ("ALRT-13-rule-eval.md", "ALRT-13")):
            (self.epic_kids / name).write_text(
                ticket(tid, "story", "x", status="dropped"))
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["nodes"]}
        self.assertEqual(states["ALRT-3"], "backlog")  # abandoned != shipped
        code, out = run("frontier", "--root", str(self.root))
        self.assertNotIn("ALRT-31", [t["id"] for t in out["frontier"]])

    def test_board_stored_done_wins(self):
        (self.epic2_dir / "ticket.md").write_text(ticket(
            "ALRT-40", "epic", "Reporting",
            extra='description: "Reports"\nstatus: done\n'))
        code, out = run("board", "--root", str(self.root))
        states = {e["id"]: e["state"] for e in out["nodes"]}
        self.assertEqual(states["ALRT-40"], "done")

    def test_validate_clean_tree(self):
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 0, out)
        self.assertTrue(out["ok"])
        self.assertEqual(out["errors"], [])

    def test_validate_catches_unfilled_template(self):
        bad = self.tickets / "KEY-n-something.md"
        bad.write_text("---\nschema: 1\nid: [KEY-n]\ntype: story\n"
                       'title: "[Outcome-focused title]"\nstatus: backlog\n'
                       "depends_on: []\ncovers: []\nrisk: [1-5]\nhitl: [true|false]\n"
                       "created: [YYYY-MM-DD]\n---\n\n# x\n")
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("placeholder", msgs)
        self.assertIn("risk", msgs)

    def test_validate_node_lifecycle_rule(self):
        # Both node altitudes run the node vocabulary: `ready` belongs to them,
        # `review` does not — that one is a leaf's "complete on a branch".
        (self.epic2_dir / "ticket.md").write_text(
            ticket("ALRT-40", "epic", "Reporting", status="ready"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 0, out)
        (self.epic2_dir / "ticket.md").write_text(
            ticket("ALRT-40", "epic", "Reporting", status="review"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("ready", msgs)
        self.assertEqual({e["file"] for e in out["errors"]},
                         {"tickets/reporting/ticket.md"})
        (self.root / "ticket.md").write_text(
            initiative_ticket("ALRT-1", "Alerting", extra="status: review\n"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        by_file = {e["file"]: e["error"] for e in out["errors"]}
        self.assertIn("ready", by_file["ticket.md"])  # the initiative node too

    def test_validate_node_missing_status_is_named(self):
        (self.epic2_dir / "ticket.md").write_text(
            ticket("ALRT-40", "epic", "Reporting").replace("status: backlog\n", ""))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        by_file = {e["file"]: e["error"] for e in out["errors"]}
        self.assertIn("status", by_file["tickets/reporting/ticket.md"])

    def test_validate_project_node_rejects_execution_fields(self):
        # The initiative node scores nothing and traces nothing sideways.
        (self.root / "ticket.md").write_text(
            initiative_ticket("ALRT-1", "Alerting", extra="risk: 2\ncovers: [CAP-4]\n"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("risk is not an initiative field", msgs)
        self.assertIn("covers is not an initiative field", msgs)

    def test_validate_project_node_only_at_the_root(self):
        (self.epic_dir / "ticket.md").write_text(
            initiative_ticket("ALRT-3", "Misplaced initiative"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("initiative node may only sit at the tree root", msgs)

    def test_validate_detects_cycle(self):
        (self.epic_kids / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", deps="[ALRT-12]"))
        (self.epic_kids / "ALRT-12-rule-crud.md").write_text(
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
        self.assertEqual(rows["ALRT-1"]["path"], "ticket.md")

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
        (self.tickets / "ALRT-31-dupe.md").write_text(
            ticket("ALRT-31", "task", "Snooze dupe"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("duplicate id ALRT-31", msgs)

    def test_malformed_file_is_an_error_not_invisible(self):
        (self.tickets / "ALRT-50-broken.md").write_text(
            "---\nschema: 1\nid: ALRT-50\ntype: task\n")  # unterminated block
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("failed to parse", msgs)
        code, out = run("next-id", "--root", str(self.root))
        self.assertEqual(out["id"], "ALRT-41")  # broken file can't be counted...
        self.assertTrue(out.get("warnings"))    # ...so the caller is warned

    def test_validate_flags_unclosed_inline_list(self):
        (self.tickets / "ALRT-51-badlist.md").write_text(
            ticket("ALRT-51", "task", "Bad list").replace(
                "depends_on: []", "depends_on: [ALRT-12, ALRT-13"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("failed to parse", msgs)

    def test_validate_flags_orphan_leaf_folder(self):
        # A leaf beside its epic's ticket.md is outside any tickets/ folder.
        (self.epic_dir / "ALRT-52-orphan.md").write_text(
            ticket("ALRT-52", "task", "Orphan"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        msgs = " | ".join(e["error"] for e in out["errors"])
        self.assertIn("leaf must sit in a tickets/ folder", msgs)

    def test_zero_indent_block_list_parses(self):
        # YAML allows block-sequence items at zero indent — the parser must too.
        (self.tickets / "ALRT-54-zeroindent.md").write_text(
            ticket("ALRT-54", "task", "Zero indent").replace(
                "depends_on: []", "depends_on:\n- ALRT-13"))
        code, out = run("board", "--root", str(self.root))
        blocked = {b["id"]: b["waiting_on"] for b in out["blocked"]}
        self.assertEqual(blocked["ALRT-54"], ["ALRT-13"])

    def test_validate_flags_unknown_type(self):
        (self.tickets / "ALRT-55-badtype.md").write_text(
            ticket("ALRT-55", "task", "Bad type").replace("type: task", "type: storyy"))
        code, out = run("validate", "--root", str(self.root))
        self.assertEqual(code, 1)
        self.assertIn("type must be one of",
                      " | ".join(e["error"] for e in out["errors"]))

    def test_scalar_dep_is_not_iterated_charwise(self):
        (self.tickets / "ALRT-53-scalar.md").write_text(
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
        (self.epic_kids / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", deps="[ALRT-12]"))
        (self.epic_kids / "ALRT-12-rule-crud.md").write_text(
            ticket("ALRT-12", "story", "Rule CRUD", status="done", deps="[ALRT-13]"))
        code, out = run("validate", "--root", str(self.root),
                        "--path", str(self.tickets / "ALRT-31-snooze.md"))
        self.assertEqual(code, 0, out)  # the cycle lives in two other files

    def test_graph_survives_deep_chains(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            kids = root / "tickets"
            kids.mkdir()
            n = 1200  # past the default recursion limit
            for i in range(1, n + 1):
                deps = f"[DEEP-{i - 1}]" if i > 1 else "[]"
                (kids / f"DEEP-{i}-t.md").write_text(
                    ticket(f"DEEP-{i}", "task", f"t{i}", deps=deps))
            code, out = run("graph", "--root", str(root))
            self.assertEqual(code, 0)
            self.assertTrue(out["ok"])
            self.assertEqual(len(out["lanes"]), n)
            self.assertEqual(len(out["critical_path"]), n)

    def _finish_alert_rules(self):
        (self.epic_dir / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\nstatus: done\n'))
        (self.epic_kids / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="done",
                   deps="[ALRT-12]", covers="[CAP-5]"))

    def test_archive_moves_leaves_and_drops_satisfied_edges(self):
        self._finish_alert_rules()
        (self.tickets / "ALRT-45-followup.md").write_text(
            ticket("ALRT-45", "task", "Follow-up", deps="[ALRT-12, ALRT-40]"))
        code, out = run("archive", "--root", str(self.root),
                        "--epic", "ALRT-3", "--date", "2026-08-02")
        self.assertEqual(code, 0, out)
        self.assertEqual(out["archived"], ["ALRT-12", "ALRT-13"])
        dest = self.root / ".archive" / "2026-08-02-alert-rules"
        self.assertTrue((dest / "ALRT-12-rule-crud.md").is_file())
        self.assertFalse((self.epic_kids / "ALRT-12-rule-crud.md").exists())
        self.assertTrue((self.epic_dir / "ticket.md").is_file())  # envelope stays
        # satisfied edge into the archive dropped; unrelated edge kept
        self.assertIn("depends_on: [ALRT-40]",
                      (self.tickets / "ALRT-45-followup.md").read_text())
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
        (self.epic_dir / "ticket.md").write_text(ticket(
            "ALRT-3", "epic", "Alert rules", covers="[CAP-4]",
            extra='description: "Rules people manage"\nstatus: done\n'))
        code, out = run("archive", "--root", str(self.root), "--epic", "ALRT-3")
        self.assertEqual(code, 1)  # ALRT-13 still backlog
        self.assertIn("still open", out["error"])
        self.assertIn("ALRT-13", out["error"])

    def test_archive_refuses_dep_on_dropped_leaf(self):
        self._finish_alert_rules()
        (self.epic_kids / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="dropped"))
        (self.tickets / "ALRT-46-waiting.md").write_text(
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
        self.assertFalse((self.epic_kids / "ALRT-12-rule-crud.md").exists())

    def test_archived_ids_never_reissued(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            e = root / "tickets" / "one"
            (e / "tickets").mkdir(parents=True)
            (root / "ticket.md").write_text(initiative_ticket("NEW-1", "New"))
            (e / "ticket.md").write_text(ticket(
                "NEW-2", "epic", "One", extra='description: "x"\nstatus: done\n'))
            (e / "tickets" / "NEW-3-only.md").write_text(
                ticket("NEW-3", "task", "Only", status="done"))
            code, out = run("archive", "--root", str(root), "--epic", "NEW-2")
            self.assertEqual(code, 0, out)
            code, out = run("next-id", "--root", str(root))
            self.assertEqual(out["id"], "NEW-4")  # NEW-3 lives in .archive, still owns its id

    def test_render_monofile_view(self):
        out_file = self.root / "epics-and-stories.md"
        code, out = run("render", "--root", str(self.root), "--out", str(out_file))
        self.assertEqual(code, 0)
        text = out_file.read_text()
        self.assertIn("Generated from the ticket tree", text)
        self.assertIn("## ALRT-3 — Alert rules [backlog]", text)
        self.assertIn("### ALRT-12 — Rule CRUD [done] (story, risk 2)", text)
        self.assertIn("## Bin", text)
        self.assertIn("### ALRT-31 — Snooze button [backlog] (task, risk 2)", text)
        # A status flip in the tree shows up on re-render — the tree is truth.
        (self.epic_kids / "ALRT-13-rule-eval.md").write_text(
            ticket("ALRT-13", "story", "Rule eval", status="in-progress",
                   deps="[ALRT-12]", covers="[CAP-5]"))
        run("render", "--root", str(self.root), "--out", str(out_file))
        self.assertIn("ALRT-13 — Rule eval [in-progress]", out_file.read_text())

    def test_mermaid_sanitizes_hostile_ids_and_titles(self):
        (self.tickets / "KEY-n-template.md").write_text(
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
