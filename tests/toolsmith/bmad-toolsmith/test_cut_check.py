"""Tests for cut_check.py: what a rewrite dropped, file by file."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "skills/toolsmith/bmad-toolsmith/scripts/cut_check.py"

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

    def test_any_change_to_the_frontmatter_text_is_lost(self):
        old = "---\nname: x\n# why x\ndescription: 'Does x --- well.'\n---\n# X\n"
        for new in (
            "---\n# why x\nname: x\ndescription: 'Does x --- well.'\n---\n# X\n",
            "# X\n",
        ):
            (self.before / "SKILL.md").write_text(old, encoding="utf-8")
            (self.after / "SKILL.md").write_text(new, encoding="utf-8")
            self.assertEqual({f["path"]: f["lost"] for f in self.check()["files"]}["SKILL.md"], ["frontmatter"], new)
        (self.after / "SKILL.md").write_text(old.replace("# X", "# Y"), encoding="utf-8")
        self.assertEqual(self.check()["lost"], [], "a body change is not a frontmatter change")

    def test_whole_protected_file_must_match(self):
        (self.after / "references" / "r.md").write_text("Some reference, reworded.\n", encoding="utf-8")
        data = self.check("--protect", "references/r.md")
        self.assertEqual({f["path"]: f["lost"] for f in data["files"]}["references/r.md"], ["protected"])

    def test_bad_protect_fails(self):
        for entry in ("SKILL.md#Nowhere", "typo.md"):
            res = run(self.before, self.after, "--protect", entry)
            self.assertNotEqual(res.returncode, 0)
            self.assertIn(entry.split("#")[-1], res.stderr)

    def test_token_table_pairs_the_prompt_files(self):
        (self.after / "references" / "r.md").write_text("Short.\n", encoding="utf-8")
        (self.after / "references" / "new.md").write_text("A new file.\n", encoding="utf-8")
        tokens = self.check()["tokens"]
        rows = {r["path"]: r for r in tokens["files"]}
        self.assertEqual(sorted(rows), ["SKILL.md", "references/new.md", "references/r.md"])
        self.assertEqual(rows["SKILL.md"]["before"], rows["SKILL.md"]["after"])
        self.assertEqual(rows["SKILL.md"]["percent"], 0.0)
        r = rows["references/r.md"]
        self.assertLess(r["after"], r["before"])
        self.assertEqual(r["percent"], round((r["after"] - r["before"]) * 100 / r["before"], 1))
        self.assertEqual(rows["references/new.md"]["before"], 0)
        self.assertIsNone(rows["references/new.md"]["percent"])
        self.assertEqual(tokens["total"]["before"], sum(x["before"] for x in tokens["files"]))
        self.assertEqual(tokens["total"]["after"], sum(x["after"] for x in tokens["files"]))
        self.assertIn(tokens["method"], ("tiktoken", "fallback"))

    def test_protect_text_reports_each_passage_not_kept_verbatim(self):
        protect = Path(self._tmp.name) / "protect.txt"
        protect.write_text("Word for word.\n\nLong prose here.\n", encoding="utf-8")
        (self.after / "SKILL.md").write_text(OLD.replace("Long prose here.", "Prose."), encoding="utf-8")
        data = self.check("--protect-text", protect)
        self.assertEqual(
            {f["path"]: f["lost"] for f in data["files"]}["SKILL.md"], ["protected text: Long prose here."]
        )
        protect.write_text("Not in the skill.\n", encoding="utf-8")
        res = run(self.before, self.after, "--protect-text", protect)
        self.assertNotEqual(res.returncode, 0)
        self.assertIn("Not in the skill.", res.stderr)

    def test_heading_inside_a_fence_does_not_end_a_section(self):
        text = "# X\n\n## Keep\n\nRun:\n\n```bash\n# a comment\necho hi\n```\n\nAfter the fence.\n\n## Next\n\nMore.\n"
        (self.before / "SKILL.md").write_text(text, encoding="utf-8")
        (self.after / "SKILL.md").write_text(text.replace("After the fence.", "Changed."), encoding="utf-8")
        data = self.check("--protect", "SKILL.md#Keep")
        self.assertEqual({f["path"]: f["lost"] for f in data["files"]}["SKILL.md"], ["protected: Keep"])


if __name__ == "__main__":
    unittest.main()
