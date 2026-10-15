"""Tests for cut_plan.py: plan schema, the floor, protection, the old-file source, measure and its loss report."""

import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "cut_plan.py"

LONG = (
    "The cutter keeps every rule and drops the reason for a rule a model would follow anyway. "
    "A line stays when the author can name the different action the model takes without it.\n"
) * 12
SHORT = "One line under the floor.\n"


def count(text: str) -> int:
    spec = importlib.util.spec_from_file_location("count_tokens", SCRIPT.parent / "count_tokens.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.count_tokens(text)[0]


# A pre-commit hook exports GIT_INDEX_FILE and friends, which would point the temp repo at the outer one.
ENV = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")} | {
    "GIT_CEILING_DIRECTORIES": tempfile.gettempdir()
}


def run(*args):
    return subprocess.run([sys.executable, str(SCRIPT), *map(str, args)], capture_output=True, text=True, env=ENV)


def git(root: Path, *args):
    subprocess.run(
        ["git", "-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", "-C", str(root), *args],
        check=True,
        capture_output=True,
        env=ENV,
    )


def make_skill(root: Path) -> None:
    (root / "references").mkdir()
    (root / "assets").mkdir()
    (root / "scripts" / "tests").mkdir(parents=True)
    (root / "SKILL.md").write_text(LONG, encoding="utf-8")
    (root / "references" / "a.md").write_text(LONG, encoding="utf-8")
    (root / "references" / "small.md").write_text(SHORT, encoding="utf-8")
    (root / "assets" / "template.md").write_text(LONG, encoding="utf-8")
    (root / "customize.toml").write_text(LONG, encoding="utf-8")
    (root / "scripts" / "tool.py").write_text(LONG, encoding="utf-8")
    (root / "scripts" / "notes.md").write_text(LONG, encoding="utf-8")
    (root / "scripts" / "tests" / "test_tool.py").write_text(LONG, encoding="utf-8")
    (root / "evals.json").write_text(LONG, encoding="utf-8")
    (root / "bmod.toml").write_text(LONG, encoding="utf-8")
    (root / "assets" / "record-template.toml").write_text(LONG, encoding="utf-8")


class CutPlanTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name) / "my-skill"
        self.root.mkdir()
        make_skill(self.root)

    def tearDown(self):
        self._tmp.cleanup()

    def plan(self, *extra):
        res = run("plan", self.root, *extra)
        self.assertEqual(res.returncode, 0, res.stderr)
        data = json.loads(res.stdout)
        return data, {f["path"]: f for f in data["files"]}

    def write(self, rel: str, text: str) -> None:
        (self.root / rel).write_text(text, encoding="utf-8")

    def test_plan_schema(self):
        data, by_path = self.plan()
        self.assertEqual(set(data), {"files", "total", "floor", "method", "before_source"})
        self.assertEqual(
            sorted(by_path),
            ["SKILL.md", "assets/template.md", "customize.toml", "references/a.md", "references/small.md"],
        )
        long_tokens = count(LONG)
        for path in ("SKILL.md", "references/a.md", "assets/template.md", "customize.toml"):
            entry = by_path[path]
            self.assertEqual(
                set(entry),
                {"path", "tokens", "cut", "protected", "old_command", "names", "jinja", "root_paths", "sections"},
            )
            self.assertEqual(entry["tokens"], long_tokens)
            self.assertTrue(entry["cut"])
            self.assertFalse(entry["protected"])
        self.assertEqual(data["total"], sum(f["tokens"] for f in data["files"]))
        self.assertEqual(data["floor"], 150)
        self.assertIn(data["method"], ("tiktoken", "fallback"))

    def test_floor_skips_small_files(self):
        _, by_path = self.plan()
        small = by_path["references/small.md"]
        self.assertLess(small["tokens"], 150)
        self.assertFalse(small["cut"])
        self.assertFalse(small["protected"])

        _, by_path = self.plan("--floor", "0")
        self.assertTrue(by_path["references/small.md"]["cut"])

    def test_protect_by_relative_and_absolute_path(self):
        _, by_path = self.plan("--protect", "references/a.md", "--protect", self.root / "assets")
        for path in ("references/a.md", "assets/template.md"):
            self.assertTrue(by_path[path]["protected"])
            self.assertFalse(by_path[path]["cut"])
        self.assertFalse(by_path["SKILL.md"]["protected"])
        self.assertTrue(by_path["SKILL.md"]["cut"])

    def test_protect_matching_nothing_fails(self):
        res = run("plan", self.root, "--protect", "references/typo.md")
        self.assertNotEqual(res.returncode, 0)
        self.assertIn("references/typo.md", res.stderr)

    def test_measure_after_a_cut(self):
        baseline = Path(self._tmp.name) / "reports" / "plan.json"
        planned, _ = self.plan("--out", baseline)
        self.assertEqual(json.loads(baseline.read_text(encoding="utf-8")), planned)

        half = LONG[: len(LONG) // 2]
        (self.root / "references" / "a.md").write_text(half, encoding="utf-8")
        (self.root / "assets" / "template.md").unlink()

        res = run("measure", self.root, "--baseline", baseline)
        self.assertEqual(res.returncode, 0, res.stderr)
        data = json.loads(res.stdout)
        self.assertEqual(set(data), {"files", "before", "after", "percent", "missing", "lost"})
        by_path = {f["path"]: f for f in data["files"]}
        self.assertEqual(sorted(by_path), sorted(f["path"] for f in planned["files"]))

        long_tokens, half_tokens = count(LONG), count(half)
        a = by_path["references/a.md"]
        self.assertEqual((a["before"], a["after"]), (long_tokens, half_tokens))
        self.assertEqual(a["percent"], round((long_tokens - half_tokens) * 100 / long_tokens))
        gone = by_path["assets/template.md"]
        self.assertEqual((gone["after"], gone["percent"], gone["missing"]), (0, 100, True))
        self.assertFalse(a["missing"])
        self.assertEqual(data["missing"], ["assets/template.md"])
        self.assertEqual(data["lost"], [])
        self.assertEqual(by_path["SKILL.md"]["percent"], 0)

        self.assertEqual(data["before"], planned["total"])
        self.assertEqual(data["after"], sum(f["after"] for f in data["files"]))
        self.assertEqual(data["percent"], round((data["before"] - data["after"]) * 100 / data["before"]))

    def test_only_markdown_and_root_customize_are_prompt_files(self):
        _, by_path = self.plan()
        self.assertIn("customize.toml", by_path)
        self.assertNotIn("bmod.toml", by_path)
        self.assertNotIn("assets/record-template.toml", by_path)

    def test_shape_copies_and_agent_customize_are_protected(self):
        self.write("SKILL.md", LONG + 'uv run "{project-root}/_bmad/scripts/render_skill.py"\n')
        self.write("customize.toml", "[agent]\n" + LONG)
        _, by_path = self.plan()
        for path in ("SKILL.md", "customize.toml"):
            self.assertTrue(by_path[path]["protected"])
            self.assertFalse(by_path[path]["cut"])

    def test_protected_section_is_recorded_and_checked(self):
        kept = "## Keep\n\n" + LONG
        self.write("SKILL.md", "# Title\n\n" + LONG + kept)
        baseline = Path(self._tmp.name) / "plan.json"
        _, by_path = self.plan("--protect", "SKILL.md#Keep", "--out", baseline)
        entry = by_path["SKILL.md"]
        self.assertEqual(entry["sections"], {"Keep": kept})
        self.assertFalse(entry["protected"])
        self.assertTrue(entry["cut"])

        self.write("SKILL.md", "# Title\n\n## Keep\n\nShorter.\n")
        data = json.loads(run("measure", self.root, "--baseline", baseline).stdout)
        self.assertEqual({f["path"]: f["lost"] for f in data["files"]}["SKILL.md"]["sections"], ["Keep"])

        res = run("plan", self.root, "--protect", "SKILL.md#Nowhere")
        self.assertNotEqual(res.returncode, 0)
        self.assertIn("SKILL.md#Nowhere", res.stderr)

    def test_measure_reports_what_a_file_lost(self):
        self.write(
            "references/a.md",
            "---\nid: 1\n---\n# A\n\n## Plan\n\n- **Verdict**: one line.\n- **Local**: two.\n\n"
            + "```bash\n# not a heading\n```\n"
            + '{{ rendered("x.md") }} and {% if workflow.mode %}x{% endif %} `{skill-root}/scripts/x.py`.\n'
            + LONG,
        )
        self.write("SKILL.md", LONG + "Write the Verdict section.\n")
        baseline = Path(self._tmp.name) / "plan.json"
        _, by_path = self.plan("--out", baseline)
        a = by_path["references/a.md"]
        self.assertEqual(a["names"], ["A", "Plan", "id", "Verdict"])
        self.assertEqual(a["jinja"], ['{{ rendered("x.md") }}', "{% if workflow.mode %}", "{% endif %}"])
        self.assertEqual(a["root_paths"], ["{skill-root}/scripts/x.py"])

        self.write("references/a.md", "# A\n\n- **Local**: two.\n{% if workflow.mode %}x{% endif %}\n")
        res = run("measure", self.root, "--baseline", baseline)
        data = json.loads(res.stdout)
        lost = {f["path"]: f["lost"] for f in data["files"]}["references/a.md"]
        self.assertEqual(
            lost,
            {
                "names": ["Plan", "id", "Verdict"],
                "jinja": ['{{ rendered("x.md") }}'],
                "root_paths": ["{skill-root}/scripts/x.py"],
                "sections": [],
            },
        )
        self.assertEqual(data["lost"], ["references/a.md"])

    def test_old_files_come_from_a_copy_outside_git(self):
        _, by_path = self.plan()
        self.assertIsNone(by_path["SKILL.md"]["old_command"])

        baseline = Path(self._tmp.name) / "reports" / "x-cut-plan.json"
        data, by_path = self.plan("--out", baseline)
        copy = baseline.parent / "x-cut-before"
        self.assertEqual(data["before_source"], "copy")
        self.assertEqual((copy / "SKILL.md").read_text(encoding="utf-8"), LONG)
        self.assertEqual(by_path["SKILL.md"]["old_command"], f"cat {copy.resolve() / 'SKILL.md'}")

        res = run("plan", self.root, "--out", baseline)
        self.assertNotEqual(res.returncode, 0)
        self.assertIn("already exists", res.stderr)

    def test_old_files_come_from_head_when_committed(self):
        repo = Path(self._tmp.name)
        git(repo, "init", "-q")
        git(repo, "add", ".")
        git(repo, "commit", "-q", "-m", "x")
        data, by_path = self.plan()
        self.assertEqual(data["before_source"], "git")
        shown = subprocess.run(
            by_path["references/a.md"]["old_command"], shell=True, capture_output=True, text=True, env=ENV
        )
        self.assertEqual(shown.stdout, LONG)

        self.write("references/a.md", "changed\n")
        data, _ = self.plan()
        self.assertEqual(data["before_source"], "none")

    def test_missing_baseline_fails_with_reason(self):
        res = run("measure", self.root, "--baseline", Path(self._tmp.name) / "nope.json")
        self.assertNotEqual(res.returncode, 0)
        self.assertIn("baseline not found", res.stderr)


if __name__ == "__main__":
    unittest.main()
