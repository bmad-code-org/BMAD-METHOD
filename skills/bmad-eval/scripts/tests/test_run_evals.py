"""run_evals.py against the fake harness: staging, containment, exit codes, run folders."""

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

import eval_common  # noqa: E402

RUNNER = SCRIPTS_DIR / "run_evals.py"
FAKE = Path(__file__).resolve().parent / "fake_harness.py"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def make_project(root: Path, command: list[str] | None = None) -> tuple[Path, Path, Path]:
    """A project with a skill, a cases file, a fixture and a harness file. Returns (skill, cases, harness)."""
    skill = root / "skills" / "greet"
    write(skill / "SKILL.md", "---\nname: greet\ndescription: Greets. Use when greeting.\n---\nSay hi.\n")
    write(skill / "scripts" / "__pycache__" / "x.pyc", "")
    write(root / "fixtures" / "notes.md", "fixture\n")
    cases = root / "evals" / "cases.json"
    write(
        cases,
        json.dumps(
            [
                {"id": "c1", "input": "yes hello", "rubric": ["says hi"], "files": ["fixtures/notes.md"]},
                {"id": "../escape", "input": "hello", "rubric": ["x"]},
            ]
        ),
    )
    harness = root / "harness.json"
    write(
        harness,
        json.dumps(
            {
                "command": command or [sys.executable, str(FAKE), "{prompt}", "{cwd}"],
                "skill_dir": ".agents/skills",
                "env": {"FAKE_CONFIG_DIR": "~/.fake", "FORWARDED": "", "ABSENT": ""},
                "home_files": [".fake/auth.json"],
            }
        ),
    )
    return skill, cases, harness


def run(*args: str, host_home: Path | None = None) -> subprocess.CompletedProcess:
    """Run the runner with a host secret set and, when given, a fake host home holding a login file."""
    env = {**os.environ, "HOST_SECRET": "must-not-leak", "FORWARDED": "yes"}
    env.pop("ABSENT", None)
    if host_home is not None:
        (host_home / ".fake").mkdir(parents=True, exist_ok=True)
        (host_home / ".fake" / "auth.json").write_text("{}", encoding="utf-8")
        env.update(HOME=str(host_home), USERPROFILE=str(host_home))
    return subprocess.run([sys.executable, str(RUNNER), *args], capture_output=True, text=True, env=env)


class RunEvalsTest(unittest.TestCase):
    def test_baseline_stages_a_copy_and_contains_the_run(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill, cases, harness = make_project(root)
            out = root / "out"
            res = run(
                "--cases", str(cases), "--skill-path", str(skill), "--output-dir", str(out),
                "--mode", "baseline", "--project-root", str(root), "--harness", str(harness), "--quiet",
                host_home=root / "host-home",
            )  # fmt: skip
            self.assertEqual(res.returncode, 0, res.stderr)
            summary = json.loads(res.stdout)
            self.assertEqual(summary["executed"], 4)
            run_dir = Path(summary["run_dir"])
            staged = run_dir / "skill" / "c1" / "cwd" / ".agents" / "skills" / "greet"
            self.assertTrue(staged.is_dir() and not staged.is_symlink(), "the skill is copied, not linked")
            self.assertFalse((staged / "scripts" / "__pycache__").exists())
            self.assertFalse((run_dir / "bare" / "c1" / "cwd" / ".agents").exists(), "bare config stages nothing")
            self.assertEqual((run_dir / "skill" / "c1" / "cwd" / "fixtures" / "notes.md").read_text(), "fixture\n")
            case = run_dir / "skill" / "c1"
            self.assertTrue((case / "cwd" / "made.txt").is_file(), "the workspace comes back as cwd/")
            self.assertFalse((case / "cwd" / ".git").exists())
            where = Path((case / "cwd" / "where.txt").read_text())
            self.assertNotIn(run_dir.resolve(), where.parents, "the run happened outside the project")
            self.assertEqual((case / "cwd" / "login.txt").read_text(), "True", "home_files brought the login over")
            seen = json.loads((case / "cwd" / "env.json").read_text())
            self.assertEqual(seen["FORWARDED"], "yes", "an empty value forwards the host's")
            self.assertNotIn("ABSENT", seen, "a var the host lacks is left out")
            self.assertTrue(
                seen["FAKE_CONFIG_DIR"].endswith(".fake") and Path(seen["FAKE_CONFIG_DIR"]).is_absolute(), "~ expands"
            )
            for name in ("prompt.txt", "transcript.jsonl", "stderr.txt", "timing.json", "case.json"):
                self.assertTrue((case / name).is_file(), name)
            # the id with `..` stays inside the run folder
            self.assertTrue((run_dir / "skill" / "_escape").is_dir())
            self.assertFalse((out / "escape").exists())
            timing = json.loads((run_dir / "skill" / "c1" / "timing.json").read_text())
            self.assertEqual(timing["status"], "ok")
            self.assertEqual(timing["total_tokens"], 15)
            self.assertTrue(timing["tokens_reported"])
            run_json = json.loads((run_dir / "run.json").read_text())
            self.assertEqual(run_json["command"][2], "{prompt}")

    def test_edit_in_a_run_does_not_touch_the_source(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill, cases, harness = make_project(root)
            write(cases, json.dumps([{"id": "e", "input": "edit-me", "rubric": ["x"]}]))
            res = run(
                "--cases", str(cases), "--skill-path", str(skill), "--output-dir", str(root / "out"),
                "--project-root", str(root), "--harness", str(harness), "--quiet",
            )  # fmt: skip
            self.assertEqual(res.returncode, 0, res.stderr)
            self.assertIn("name: greet", (skill / "SKILL.md").read_text())

    def test_fixture_escaping_the_workspace_is_an_error(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill, cases, harness = make_project(root)
            write(root / "secret.txt", "s\n")
            write(cases, json.dumps([{"id": "f", "input": "hello", "rubric": ["x"], "files": ["../../secret.txt"]}]))
            out = root / "out"
            res = run(
                "--cases", str(cases), "--skill-path", str(skill), "--output-dir", str(out),
                "--project-root", str(root / "evals" / "deep"), "--harness", str(harness), "--quiet",
            )  # fmt: skip
            self.assertEqual(res.returncode, 1)
            summary = json.loads(res.stdout)
            self.assertEqual(summary["results"][0]["status"], "error")
            self.assertIn("escapes", summary["results"][0]["reason"])
            # nothing landed above the case's cwd
            run_dir = Path(summary["run_dir"])
            self.assertEqual(sorted(p.name for p in run_dir.iterdir()), ["execution-summary.json", "run.json", "skill"])

    def test_failures_exit_nonzero(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill, cases, harness = make_project(root)
            write(cases, json.dumps([{"id": "k", "input": "crash", "rubric": ["x"]}]))
            res = run(
                "--cases", str(cases), "--skill-path", str(skill), "--output-dir", str(root / "out"),
                "--project-root", str(root), "--harness", str(harness), "--quiet",
            )  # fmt: skip
            self.assertEqual(res.returncode, 1)
            self.assertEqual(json.loads(res.stdout)["failures"], 1)

    def test_missing_command_exits_nonzero(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill, cases, harness = make_project(root, command=["no-such-harness-xyz", "{prompt}"])
            res = run(
                "--cases", str(cases), "--skill-path", str(skill), "--output-dir", str(root / "out"),
                "--project-root", str(root), "--harness", str(harness), "--quiet",
            )  # fmt: skip
            self.assertEqual(res.returncode, 1)
            self.assertEqual({r["status"] for r in json.loads(res.stdout)["results"]}, {"harness-missing"})

    def test_no_harness_stages_only_and_exits_3(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill, cases, _ = make_project(root)
            res = run(
                "--cases", str(cases), "--skill-path", str(skill), "--output-dir", str(root / "out"),
                "--project-root", str(root), "--quiet",
            )  # fmt: skip
            self.assertEqual(res.returncode, 3, res.stderr)
            summary = json.loads(res.stdout)
            self.assertEqual(summary["skipped"], 2)
            self.assertIn("BMad is not set up", summary["harness"])

    def test_invalid_harness_is_a_usage_error(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill, cases, harness = make_project(root)
            write(harness, json.dumps({"command": ["claude", "-p"]}))
            res = run(
                "--cases", str(cases), "--skill-path", str(skill), "--output-dir", str(root / "out"),
                "--harness", str(harness), "--quiet",
            )  # fmt: skip
            self.assertEqual(res.returncode, 2)
            self.assertIn("{prompt}", res.stderr)

    def test_run_folders_never_collide(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            a_id, a_dir = eval_common.make_run_dir(out, "x")
            b_id, b_dir = eval_common.make_run_dir(out, "x")
            self.assertNotEqual(a_dir, b_dir)
            self.assertTrue(a_dir.is_dir() and b_dir.is_dir())
            self.assertTrue(b_id.startswith(a_id))

    def test_contained_and_safe_name(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.assertEqual(eval_common.contained(root, "a/b.txt"), (root / "a" / "b.txt").resolve())
            with self.assertRaises(ValueError):
                eval_common.contained(root, "../b.txt")
            with self.assertRaises(ValueError):
                eval_common.contained(root, "/etc/passwd")
        self.assertEqual(eval_common.safe_name("../escape"), "_escape")
        self.assertEqual(eval_common.safe_name(".."), "unnamed")
        self.assertEqual(eval_common.safe_name("Case 1/B"), "Case_1_B")


if __name__ == "__main__":
    unittest.main()
