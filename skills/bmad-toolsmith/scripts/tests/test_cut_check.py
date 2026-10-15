"""Tests for cut_check.py: what a rewrite dropped, file by file."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "cut_check.py"

OLD = (
    "---\nname: x\ndescription: 'Does x.'\n---\n# X\n\n"
    '{{ rendered("a.md") }} then {% if workflow.mode %}y{% endif %}.\n'
    "Run `{skill-root}/scripts/x.py`.\n\n## Keep\n\nWord for word.\n\n## Other\n\nLong prose here.\n"
)


def run(*args):
    return subprocess.run([sys.executable, str(SCRIPT), *map(str, args)], capture_output=True, text=True)


class CutCheckTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        tmp = Path(self._tmp.name)
        self.before, self.after = tmp / "before", tmp / "after"
        for root in (self.before, self.after):
            (root / "references").mkdir(parents=True)
            (root / "scripts").mkdir()
            (root / "SKILL.md").write_text(OLD, encoding="utf-8")
            (root / "references" / "r.md").write_text("Some reference.\n", encoding="utf-8")
            (root / "scripts" / "notes.md").write_text("Not a prompt file.\n", encoding="utf-8")
            (root / "bmod.toml").write_text("x = 1\n", encoding="utf-8")

    def tearDown(self):
        self._tmp.cleanup()

    def check(self, *extra):
        res = run(self.before, self.after, *extra)
        self.assertEqual(res.returncode, 0, res.stderr)
        return json.loads(res.stdout)

    def test_unchanged_skill_loses_nothing(self):
        data = self.check("--protect", "SKILL.md#Keep")
        self.assertEqual([f["path"] for f in data["files"]], ["SKILL.md", "references/r.md"])
        self.assertEqual((data["lost"], data["missing"]), ([], []))

    def test_reports_what_a_rewrite_dropped(self):
        (self.after / "SKILL.md").write_text(
            "---\nname: x\ndescription: 'Changed.'\n---\n# X\n\n{% if workflow.mode %}y{% endif %}.\n\n## Keep\n\nShorter.\n",
            encoding="utf-8",
        )
        (self.after / "references" / "r.md").unlink()
        data = self.check("--protect", "SKILL.md#Keep", "--protect", "references/r.md")
        lost = {f["path"]: f["lost"] for f in data["files"]}
        self.assertEqual(
            lost["SKILL.md"],
            ['{{ rendered("a.md") }}', "{skill-root}/scripts/x.py", "frontmatter", "protected: Keep"],
        )
        self.assertEqual((data["lost"], data["missing"]), (["SKILL.md"], ["references/r.md"]))

    def test_whole_protected_file_must_match(self):
        (self.after / "references" / "r.md").write_text("Some reference, reworded.\n", encoding="utf-8")
        data = self.check("--protect", "references/r.md")
        self.assertEqual({f["path"]: f["lost"] for f in data["files"]}["references/r.md"], ["protected"])

    def test_bad_protect_fails(self):
        for entry in ("SKILL.md#Nowhere", "typo.md"):
            res = run(self.before, self.after, "--protect", entry)
            self.assertNotEqual(res.returncode, 0)
            self.assertIn(entry.split("#")[-1], res.stderr)


if __name__ == "__main__":
    unittest.main()
