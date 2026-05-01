#!/usr/bin/env python3
"""Tests for scripts/from_spec.py — spec validation, deterministic generation."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent
FROM_SPEC = SCRIPTS / "from_spec.py"


def _run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(FROM_SPEC), *args], capture_output=True, text=True, check=False)


BASE_SPEC = {
    "title": "Demo",
    "intent": "Stand up the v7 tree from a spec.",
    "inventory": {
        "requirements": {
            "functional": [{"code": "FR1", "text": "Users can log in"}],
            "non_functional": [{"code": "NFR1", "text": "p99 latency under 200ms"}],
        }
    },
    "epics": [
        {
            "nn": 1, "title": "Auth", "intent": "User-facing login.",
            "shared_context": "Sessions are JWT.",
            "stories": [
                {"nn": 1, "title": "Login form", "type": "feature",
                 "user_story": "As a user\nI want to log in\nSo that I can access the app",
                 "acceptance_criteria": ["Given valid creds When I submit Then I am signed in"],
                 "coverage": {"AC1": ["FR1"]}},
            ]
        },
        {
            "nn": 2, "title": "Perf", "intent": "Latency tightening.",
            "depends_on": [1],
            "stories": [
                {"nn": 1, "title": "Profile p99", "type": "task",
                 "acceptance_criteria": ["Given prod traffic shape When measured Then p99 < 200ms"],
                 "coverage": {"AC1": ["NFR1"]}},
            ]
        }
    ]
}


class TestFromSpec(unittest.TestCase):
    def test_generates_tree_and_passes_validation(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp) / "store"
            spec = Path(tmp) / "spec.json"
            spec.write_text(json.dumps(BASE_SPEC), encoding="utf-8")
            r = _run("--initiative-store", str(store), "--spec", str(spec))
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            data = json.loads(r.stdout)
            self.assertEqual(data["epics_created"], ["01-auth", "02-perf"])
            self.assertIn("01-auth/01-login-form", data["stories_created"])
            self.assertEqual(data["validation"]["summary"]["errors"], 0)
            self.assertEqual(data["validation"]["summary"]["coverage_missing"], [])
            self.assertTrue(Path(data["inventory_path"]).is_file())
            self.assertIn("Sessions are JWT.", (store / "epics/01-auth/epic.md").read_text(encoding="utf-8"))

    def test_invalid_spec_fails_with_details(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp) / "store"
            spec = Path(tmp) / "spec.json"
            spec.write_text(json.dumps({"title": "x"}), encoding="utf-8")
            r = _run("--initiative-store", str(store), "--spec", str(spec))
            self.assertEqual(r.returncode, 1)
            data = json.loads(r.stdout)
            self.assertEqual(data["error"], "invalid spec")
            self.assertTrue(any("epics" in msg for msg in data["details"]))

    def test_invalid_story_type_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp) / "store"
            spec_data = json.loads(json.dumps(BASE_SPEC))
            spec_data["epics"][0]["stories"][0]["type"] = "bogus"
            spec = Path(tmp) / "spec.json"
            spec.write_text(json.dumps(spec_data), encoding="utf-8")
            r = _run("--initiative-store", str(store), "--spec", str(spec))
            self.assertEqual(r.returncode, 1)
            data = json.loads(r.stdout)
            self.assertTrue(any("type invalid" in msg for msg in data["details"]))

    def test_invalid_inventory_shape_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp) / "store"
            spec_data = json.loads(json.dumps(BASE_SPEC))
            # Drop the `code` from one entry; spec validator should reject before authoring.
            spec_data["inventory"]["requirements"]["functional"] = [{"text": "Missing code"}]
            spec = Path(tmp) / "spec.json"
            spec.write_text(json.dumps(spec_data), encoding="utf-8")
            r = _run("--initiative-store", str(store), "--spec", str(spec))
            self.assertEqual(r.returncode, 1)
            data = json.loads(r.stdout)
            self.assertEqual(data["error"], "invalid spec")
            self.assertTrue(any("missing `code`" in msg for msg in data["details"]))
            # Tree must not have been created on a rejected spec.
            self.assertFalse((store / "epics").exists())

    def test_coverage_strict_fails_when_missing(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp) / "store"
            spec_data = json.loads(json.dumps(BASE_SPEC))
            spec_data["inventory"]["requirements"]["functional"].append({"code": "FR99", "text": "Uncovered"})
            spec = Path(tmp) / "spec.json"
            spec.write_text(json.dumps(spec_data), encoding="utf-8")
            r = _run("--initiative-store", str(store), "--spec", str(spec), "--coverage-strict")
            self.assertEqual(r.returncode, 1)
            data = json.loads(r.stdout)
            self.assertIn("FR99", data["validation"]["summary"]["coverage_missing"])


if __name__ == "__main__":
    unittest.main()
