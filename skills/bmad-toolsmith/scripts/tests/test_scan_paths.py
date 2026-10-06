"""Tests for scan_paths.py: each rule fires on its case and stays quiet on the conventions it enforces."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scan_paths.py"


def make_skill(root: Path, files: dict[str, str]) -> Path:
    skill = root / "bmad-demo"
    for rel, text in files.items():
        path = skill / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    return skill


def scan(skill: Path):
    res = subprocess.run([sys.executable, str(SCRIPT), str(skill)], capture_output=True, text=True)
    return res.returncode, json.loads(res.stdout)


def rules(data):
    return sorted((f["path"], f["rule"]) for f in data["findings"])


class ScanPathsTest(unittest.TestCase):
    def test_python_call_fires_and_uv_run_does_not(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\n"
                        "Run `python3 scripts/go.py` then `python -m json.tool out.json`.\n"
                        "```\npip install rich\n```\n"
                        "Written in Python with argparse. Fine: `uv run {skill-root}/scripts/go.py`.\n"
                    ),
                    "scripts/go.py": "print(1)\n",
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            hits = [f for f in data["findings"] if f["rule"] == "python-call"]
            self.assertEqual([f["text"] for f in hits], ["python3 scripts/go.py", "python -m json.tool", "pip install"])
            self.assertEqual(len(data["findings"]), 3, data["findings"])

    def test_clean_skill_has_no_findings(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "---\nname: bmad-demo\ndescription: 'Demo. Use when testing.'\n---\n\n"
                        "Run `uv run {skill-root}/scripts/go.py` then read `references/notes.md`.\n"
                        "Runtime: `uv run {project-root}/_bmad/scripts/memlog.py`.\n"
                        "Invoke the `bmad-eval` skill. Output goes to `{output_folder}/report.md`.\n"
                    ),
                    "references/notes.md": "Back to `../SKILL.md` and `scripts/go.py`.\n",
                    "scripts/go.py": "print(1)\n",
                    "assets/SKILL-template.md": "Emits `references/made-up.md`.\n",
                    "sample-output.md": "Shows `references/other-made-up.md`.\n",
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 0, data)
            self.assertEqual(data["findings"], [])
            self.assertEqual(data["skill"], "bmad-demo")
            self.assertEqual(data["files_scanned"], 4)

    def test_each_rule_fires(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {
                    "SKILL.md": (
                        "---\nname: bmad-demo\n---\n\n"
                        "Run `uv run scripts/go.py`.\n"
                        "Also `uv run --no-cache ./scripts/go.py`.\n"
                        "Old: {installed_path}/x.md\n"
                        "Mine: /Users/someone/skills/x.md and ~/.claude/skills/y.md\n"
                        "Read `references/missing.md`.\n"
                        "Borrow `skills/bmad-other/references/canon.md`.\n"
                        "Also `{project-root}/_bmad/bmad-other/SKILL.md` but not `{project-root}/_bmad/scripts/memlog.py`.\n"
                        "Describe it in module.yaml and module-help.csv.\n"
                        "```\nuv run scripts/in-fence.py\n```\n"
                    ),
                    "references/a.md": "Sibling `../../bmad-other/SKILL.md`. Fine: `../SKILL.md`.\n",
                    "scripts/go.py": "print(1)\n",
                },
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            found = rules(data)
            self.assertEqual(found.count(("SKILL.md", "bare-script-call")), 3)
            self.assertIn(("SKILL.md", "installed-path"), found)
            self.assertEqual(found.count(("SKILL.md", "absolute-path")), 2)
            self.assertEqual(found.count(("SKILL.md", "missing-file")), 1)
            self.assertEqual(found.count(("SKILL.md", "cross-skill-ref")), 2)
            self.assertEqual(found.count(("SKILL.md", "old-module-format")), 2)
            self.assertEqual(found.count(("references/a.md", "cross-skill-ref")), 1)
            for f in data["findings"]:
                self.assertEqual(set(f), {"path", "line", "rule", "text", "fix"})
                self.assertGreater(f["line"], 0)

    def test_allow_suppresses_a_rule(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp), {"SKILL.md": "Migrate module.yaml and module-help.csv; never `uv run scripts/x.py`.\n"}
            )
            code, data = scan(skill)
            self.assertEqual(
                sorted(f["rule"] for f in data["findings"]),
                ["bare-script-call", "old-module-format", "old-module-format"],
            )
            res = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    str(skill),
                    "--allow",
                    "old-module-format",
                    "--allow",
                    "bare-script-call",
                ],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0)
            self.assertEqual(json.loads(res.stdout)["findings"], [])
            res = subprocess.run(
                [sys.executable, str(SCRIPT), str(skill), "--allow", "nope"], capture_output=True, text=True
            )
            self.assertEqual(res.returncode, 2)

    def test_prose_path_without_existing_folder_is_not_flagged(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), {"SKILL.md": "Writes `docs/plan.md` for the user.\n"})
            code, data = scan(skill)
            self.assertEqual(code, 0, data)

    def test_not_a_directory(self):
        res = subprocess.run([sys.executable, str(SCRIPT), "/nonexistent"], capture_output=True, text=True)
        self.assertEqual(res.returncode, 2)


if __name__ == "__main__":
    unittest.main()
