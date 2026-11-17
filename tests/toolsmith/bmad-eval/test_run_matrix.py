"""run_matrix.py against the fake harness: which staged skill loads, scoring, confusion, exit codes."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[3] / "skills/toolsmith/bmad-eval/scripts"
RUNNER = SCRIPTS_DIR / "run_matrix.py"
FAKE = Path(__file__).resolve().parent / "fake_harness.py"
RESOLVER = Path(__file__).resolve().parents[3] / "skills/core-tools/bmad/scripts"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def skill(root: Path, name: str, description: str) -> None:
    write(root / name / "SKILL.md", f"---\nname: {name}\ndescription: '{description}'\n---\n\nReal body.\n")


class MatrixTest(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)
        self.skills = self.root / "skills"
        for name in ("alpha", "beta", "gamma"):
            skill(self.skills / "mod", name, f"Does {name} things. Use when the user says {name}.")
        write(self.skills / "mod" / "beta" / "assets" / "sample" / "SKILL.md", "---\nname: sample\n---\n")
        self.harness = self.root / "harness.json"
        write(self.harness, json.dumps({"command": [sys.executable, str(FAKE), "{prompt}", "{cwd}"]}))

    def run_matrix(self, queries, *extra):
        path = self.root / "matrix.json"
        write(path, json.dumps(queries))
        res = subprocess.run(
            [sys.executable, str(RUNNER), "--skills", str(self.skills), "--queries", str(path),
             "--output-dir", str(self.root / "out"), "--harness", str(self.harness), "--quiet", *extra],
            capture_output=True, text=True,
        )  # fmt: skip
        return res.returncode, json.loads(res.stdout) if res.stdout.strip() else None, res.stderr

    def test_scores_each_query_by_the_skills_that_loaded(self):
        code, out, err = self.run_matrix(
            [
                {"query": "route:alpha", "expect": "alpha"},
                {"query": "route:beta", "expect": "alpha"},
                {"query": "hello", "expect": None},
                {"query": "route:beta route:gamma", "expect": "beta", "also_ok": ["gamma"]},
                {"query": "route:gamma", "expect": None},
                {"query": "hello again", "expect": "alpha"},
                {"query": "crash", "expect": "beta"},
                {"query": "quiet", "expect": None, "also_ok": ["gamma"]},
                {"query": "route:gamma again", "expect": None, "also_ok": ["gamma"]},
            ],
            "--runs-per-query", "2",
        )  # fmt: skip
        self.assertEqual(code, 1, err)
        passed = {r["query"]: r["pass"] for r in out["results"]}
        self.assertEqual(
            passed,
            {
                "route:alpha": True,
                "route:beta": False,
                "hello": True,
                "route:beta route:gamma": True,
                "route:gamma": False,
                "hello again": False,
                "crash": None,
                "quiet": True,
                "route:gamma again": True,
            },
        )
        by_query = {r["query"]: r for r in out["results"]}
        self.assertEqual(by_query["route:beta route:gamma"]["loaded"], {"beta": 1.0, "gamma": 1.0})
        self.assertEqual(by_query["crash"]["runs"], 0)
        self.assertEqual(len(by_query["crash"]["errors"]), 2)
        self.assertEqual(out["confusion"], {"alpha": {"beta": 1, "missed": 1}, "(none)": {"gamma": 1}})
        self.assertEqual(out["summary"], {"total": 9, "passed": 5, "failed": 3, "unmeasured": 1})
        self.assertEqual(out["skills"], 3, "a sample inside a skill's assets is not staged")

        attempt = self.root / "out" / out["run_id"] / "queries" / "q000-r0"
        staged = sorted(p.parent.name for p in (attempt / "cwd" / ".agents" / "skills").glob("*/SKILL.md"))
        self.assertEqual(staged, ["alpha", "beta", "gamma"], "every skill is staged under its own name")
        body = (attempt / "cwd" / ".agents" / "skills" / "alpha" / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("Does alpha things.", body)
        self.assertNotIn("Real body.", body)
        self.assertEqual(json.loads((attempt / "timing.json").read_text())["loaded"], ["alpha"])

    def test_a_query_naming_a_skill_that_is_not_staged_is_a_usage_error(self):
        code, _, err = self.run_matrix([{"query": "x", "expect": "delta"}])
        self.assertEqual(code, 2)
        self.assertIn("'delta'", err)

    def test_two_skills_with_one_name_is_a_usage_error(self):
        skill(self.skills / "other", "alpha", "A second alpha.")
        code, _, err = self.run_matrix([{"query": "x", "expect": None}])
        self.assertEqual(code, 2)
        self.assertIn("two skills are named 'alpha'", err)

    def named_project(self) -> Path:
        project = self.root / "project"
        (project / "_bmad" / "scripts").mkdir(parents=True)
        for name in ("resolve_customization.py", "config_utils.py"):
            (project / "_bmad" / "scripts" / name).write_bytes((RESOLVER / name).read_bytes())
        fake = json.dumps([sys.executable, str(FAKE), "{prompt}", "{cwd}"])
        write(
            project / "_bmad" / "custom" / "bmad-eval.user.toml",
            f"[workflow.harnesses.one]\ncommand = {fake}\n\n[workflow.harnesses.two]\ncommand = {fake}\n",
        )
        return project

    def run_named(self, *names_and_flags):
        path = self.root / "matrix.json"
        write(path, json.dumps([{"query": "route:alpha", "expect": "alpha"}]))
        res = subprocess.run(
            [sys.executable, str(RUNNER), "--skills", str(self.skills), "--queries", str(path),
             "--output-dir", str(self.root / "out"), "--project-root", str(self.named_project()), "--quiet",
             "--runs-per-query", "1", *names_and_flags],
            capture_output=True, text=True,
        )  # fmt: skip
        return res.returncode, res.stdout, res.stderr

    def test_each_named_harness_gets_its_own_run(self):
        code, stdout, err = self.run_named("--harness-name", "one", "--harness-name=two")
        self.assertEqual(code, 0, err)
        out = json.loads(stdout)["harnesses"]
        self.assertEqual(sorted(out), ["one", "two"])
        for name, result in out.items():
            self.assertEqual(result["summary"]["passed"], 1, name)
            self.assertEqual(result["harness"], f"customization workflow.harnesses.{name}")
            self.assertTrue(result["run_id"].endswith(f"trigger-matrix-{name}"), result["run_id"])

    def test_an_unrecorded_harness_name_is_a_usage_error(self):
        code, _, err = self.run_named("--harness-name", "three")
        self.assertEqual(code, 2)
        self.assertIn("recorded: one, two", err)

    def test_a_harness_file_and_a_name_together_are_a_usage_error(self):
        code, _, err = self.run_named("--harness", str(self.harness), "--harness-name", "one")
        self.assertEqual(code, 2)
        self.assertIn("not both", err)

    def test_no_harness_exits_3(self):
        path = self.root / "matrix.json"
        write(path, json.dumps([{"query": "x", "expect": None}]))
        res = subprocess.run(
            [sys.executable, str(RUNNER), "--skills", str(self.skills), "--queries", str(path),
             "--output-dir", str(self.root / "out"), "--project-root", str(self.root), "--quiet"],
            capture_output=True, text=True,
        )  # fmt: skip
        self.assertEqual(res.returncode, 3, res.stderr)
        self.assertEqual(json.loads(res.stdout)["status"], "skipped")


if __name__ == "__main__":
    unittest.main()
