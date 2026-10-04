"""convert_cases.py maps skill-creator evals.json to runner cases.json and back."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "convert_cases.py"

SKILL_CREATOR = {
    "skill_name": "brief-writer",
    "evals": [
        {
            "id": 1,
            "prompt": "write a brief for InsuLens from memo.md",
            "expected_output": "a brief.md naming InsuLens",
            "files": ["evals/files/memo.md"],
            "expectations": ["brief.md exists and names InsuLens", "no invented claims"],
        },
        {"id": 2, "prompt": "just say hi", "expected_output": "", "files": [], "expectations": []},
    ],
}


def run(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run([sys.executable, str(SCRIPT), *args], capture_output=True, text=True)


class ConvertCasesTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.evals = self.tmp / "my-skill" / "evals" / "evals.json"
        self.evals.parent.mkdir(parents=True)
        self.evals.write_text(json.dumps(SKILL_CREATOR), encoding="utf-8")

    def test_to_runner(self):
        proc = run(str(self.evals))
        self.assertEqual(proc.returncode, 0, proc.stderr)
        cases = json.loads(proc.stdout)
        self.assertEqual(
            cases[0],
            {
                "id": "1",
                "input": "write a brief for InsuLens from memo.md",
                "rubric": [
                    "brief.md exists and names InsuLens",
                    "no invented claims",
                    "output matches: a brief.md naming InsuLens",
                ],
                "state_prefix": None,
                "files": ["evals/files/memo.md"],
            },
        )
        self.assertEqual(cases[1]["rubric"], [], "empty expected_output adds no rubric line")
        self.assertEqual(cases[1]["id"], "2")

    def test_output_flag_writes_file(self):
        out = self.tmp / "out" / "cases.json"
        proc = run(str(self.evals), "--output", str(out))
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertEqual(proc.stdout, "")
        self.assertEqual(len(json.loads(out.read_text(encoding="utf-8"))), 2)

    def test_round_trip(self):
        cases_path = self.tmp / "my-skill" / "evals" / "cases.json"
        run(str(self.evals), "--output", str(cases_path))
        proc = run(str(cases_path), "--to", "skill-creator")
        self.assertEqual(proc.returncode, 0, proc.stderr)
        back = json.loads(proc.stdout)
        self.assertEqual(back["skill_name"], "my-skill", "skill_name defaults to the folder above evals/")
        self.assertEqual(back["evals"], SKILL_CREATOR["evals"])

    def test_skill_name_flag_and_non_numeric_id(self):
        cases_path = self.tmp / "cases.json"
        cases_path.write_text(
            json.dumps(
                {"cases": [{"id": "create-1", "input": "x", "rubric": ["a"], "state_prefix": None, "files": []}]}
            ),
            encoding="utf-8",
        )
        proc = run(str(cases_path), "--to", "skill-creator", "--skill-name", "named")
        self.assertEqual(proc.returncode, 0, proc.stderr)
        back = json.loads(proc.stdout)
        self.assertEqual(back["skill_name"], "named")
        self.assertEqual(back["evals"][0]["id"], "create-1")
        self.assertEqual(back["evals"][0]["expected_output"], "")

    def test_rejects_runner_input_toward_runner(self):
        bad = self.tmp / "cases.json"
        bad.write_text("[]", encoding="utf-8")
        proc = run(str(bad))
        self.assertEqual(proc.returncode, 2)
        self.assertIn("evals", proc.stderr)


if __name__ == "__main__":
    unittest.main()
