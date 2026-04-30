#!/usr/bin/env python3
"""Tests for scripts/validate_initiative.py — happy path, schema/dep/cycle errors."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
INIT_EPIC = SCRIPTS / "init_epic.py"
INIT_STORY = SCRIPTS / "init_story.py"
VALIDATE = SCRIPTS / "validate_initiative.py"


def _run(script: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(script), *args], capture_output=True, text=True, check=False)


def _build_clean_tree(store: Path) -> tuple[str, str]:
    _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "1", "--title", "Auth")
    _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "2", "--title", "Migration", "--depends-on", "1")
    _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "1", "--title", "Schema", "--type", "task")
    _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-auth", "--story-nn", "2", "--title", "Register", "--type", "feature", "--depends-on", "01-schema")
    _run(INIT_STORY, "--initiative-store", str(store), "--epic", "02-migration", "--story-nn", "1", "--title", "Mailer", "--type", "task", "--depends-on", "01-auth/01-schema")
    return "01-auth", "02-migration"


class TestValidateInitiative(unittest.TestCase):
    def test_clean_tree_passes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            r = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 0, r.stderr + r.stdout)
            data = json.loads(r.stdout)
            self.assertEqual(data["findings"], [])
            self.assertEqual(data["summary"]["story_count"], 3)
            self.assertEqual(data["summary"]["story_status_counts"], {"draft": 3})

    def test_bad_status_enum(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            sp = store / "epics" / "01-auth" / "01-schema.md"
            sp.write_text(sp.read_text(encoding="utf-8").replace("status: draft", "status: bogus", 1), encoding="utf-8")
            r = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 1)
            codes = {f["code"] for f in json.loads(r.stdout)["findings"]}
            self.assertIn("story-bad-status", codes)

    def test_dangling_dep(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            sp = store / "epics" / "02-migration" / "01-mailer.md"
            sp.write_text(sp.read_text(encoding="utf-8").replace('"01-auth/01-schema"', '"01-auth/99-nope"'), encoding="utf-8")
            r = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 1)
            codes = {f["code"] for f in json.loads(r.stdout)["findings"]}
            self.assertIn("story-dep-unresolved", codes)

    def test_epic_dep_cycle(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            ep = store / "epics" / "01-auth" / "epic.md"
            ep.write_text(ep.read_text(encoding="utf-8").replace("depends_on: []", 'depends_on: ["02"]', 1), encoding="utf-8")
            r = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 1)
            codes = {f["code"] for f in json.loads(r.stdout)["findings"]}
            self.assertIn("epic-dep-cycle", codes)

    def test_extra_top_level_key(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            sp = store / "epics" / "01-auth" / "01-schema.md"
            sp.write_text(sp.read_text(encoding="utf-8").replace("status: draft", "status: draft\nbogus: 1", 1), encoding="utf-8")
            r = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 1)
            codes = {f["code"] for f in json.loads(r.stdout)["findings"]}
            self.assertIn("story-extra-keys", codes)

    def test_numbering_gap(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            (store / "epics" / "01-auth" / "01-schema.md").unlink()
            r = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(r.returncode, 1)
            codes = {f["code"] for f in json.loads(r.stdout)["findings"]}
            self.assertIn("story-numbering-gaps", codes)

    def test_inventory_coverage_warning_then_strict_error(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            inv = store / "inventory.json"
            inv.write_text(json.dumps({
                "requirements": {
                    "functional": [{"code": "FR1", "text": "Users can register"}, {"code": "FR99", "text": "Uncovered"}],
                }
            }), encoding="utf-8")
            schema = store / "epics" / "01-auth" / "01-schema.md"
            schema.write_text(schema.read_text(encoding="utf-8") + "\n## Coverage\n- AC1: FR1\n", encoding="utf-8")

            r = _run(VALIDATE, "--initiative-store", str(store), "--inventory", str(inv))
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            data = json.loads(r.stdout)
            warnings = [f for f in data["findings"] if f["code"] == "coverage-missing"]
            self.assertEqual(len(warnings), 1)
            self.assertEqual(warnings[0]["level"], "warning")
            self.assertEqual(data["summary"]["coverage_missing"], ["FR99"])

            r = _run(VALIDATE, "--initiative-store", str(store), "--inventory", str(inv), "--coverage-strict")
            self.assertEqual(r.returncode, 1)
            data = json.loads(r.stdout)
            errors = [f for f in data["findings"] if f["code"] == "coverage-missing"]
            self.assertEqual(errors[0]["level"], "error")

    def test_inventory_coverage_recognizes_debt_and_research_codes(self) -> None:
        # The validator's mentioned-codes regex must include D (debt) and R (research)
        # in addition to FR/NFR/UX-DR. Otherwise tech-debt and research initiatives
        # always report spurious coverage-missing on inventory codes the stories
        # actually reference.
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            inv = store / "inventory.json"
            inv.write_text(json.dumps({
                "requirements": {
                    "debt":     [{"code": "D1", "text": "Remove legacy /charge endpoint"}],
                    "research": [{"code": "R1", "text": "Investigate webhook ordering"}],
                }
            }), encoding="utf-8")
            schema = store / "epics" / "01-auth" / "01-schema.md"
            schema.write_text(
                schema.read_text(encoding="utf-8") + "\n## Coverage\n- AC1: D1, R1\n",
                encoding="utf-8",
            )
            r = _run(VALIDATE, "--initiative-store", str(store), "--inventory", str(inv))
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(data["summary"]["coverage_missing"], [])
            self.assertIn("D1", data["summary"]["mentioned_requirements"])
            self.assertIn("R1", data["summary"]["mentioned_requirements"])

    def test_summary_only_emits_per_story_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            r = _run(VALIDATE, "--initiative-store", str(store), "--summary-only")
            self.assertEqual(r.returncode, 0)
            data = json.loads(r.stdout)
            self.assertIn("summary", data)
            epics = data["summary"]["epics"]
            self.assertEqual(len(epics), 2)
            self.assertEqual(epics[0]["story_count"], 2)
            story_titles = {s["title"] for s in epics[0]["stories"]}
            self.assertEqual(story_titles, {"Schema", "Register"})
            self.assertIn("type", epics[0]["stories"][0])

    def test_tree_emits_plain_text(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            r = _run(VALIDATE, "--initiative-store", str(store), "--tree")
            self.assertEqual(r.returncode, 0)
            self.assertIn("01-auth/", r.stdout)
            self.assertIn("01-schema.md", r.stdout)
            self.assertIn("(task, draft)", r.stdout)
            self.assertIn("└──", r.stdout)

    def test_inventory_missing_file_fails_cleanly(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _build_clean_tree(store)
            r = _run(VALIDATE, "--initiative-store", str(store), "--inventory", str(store / "nope.json"))
            self.assertEqual(r.returncode, 1)
            self.assertIn("not found", r.stderr)

    def test_lax_skips_sizing_warnings(self) -> None:
        # Sizing warnings fire when one body exceeds 3x the epic mean. With 5 normal
        # stories and one massively-padded outlier, the mean stays low enough for
        # the outlier to clear the 3x threshold.
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp)
            _run(INIT_EPIC, "--initiative-store", str(store), "--epic-nn", "1", "--title", "E1")
            for nn, title in ((1, "Tiny A"), (2, "Tiny B"), (3, "Tiny C"), (4, "Tiny D"), (5, "Big One")):
                _run(INIT_STORY, "--initiative-store", str(store), "--epic", "01-e1", "--story-nn", str(nn), "--title", title, "--type", "task")
            big = store / "epics" / "01-e1" / "05-big-one.md"
            big.write_text(big.read_text(encoding="utf-8") + ("filler " * 50000), encoding="utf-8")
            r_strict = _run(VALIDATE, "--initiative-store", str(store))
            self.assertEqual(r_strict.returncode, 0)
            warns_strict = [f for f in json.loads(r_strict.stdout)["findings"] if f["level"] == "warning"]
            self.assertTrue(any(f["code"] == "story-oversized" for f in warns_strict), warns_strict)
            r_lax = _run(VALIDATE, "--initiative-store", str(store), "--lax")
            warns_lax = [f for f in json.loads(r_lax.stdout)["findings"] if f["level"] == "warning"]
            self.assertEqual(warns_lax, [])


if __name__ == "__main__":
    unittest.main()
