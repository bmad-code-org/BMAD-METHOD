"""Tests for prepass.py: the JSON contract and the shape inference."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "prepass.py"

KEYS = {
    "skill",
    "shape_hint",
    "files",
    "skill_md_tokens",
    "total_tokens",
    "has_customize",
    "has_scripts",
    "scripts",
    "description_chars",
    "has_use_when",
    "frontmatter_ok",
    "bmod_kind",
    "path_findings",
    "script_findings",
}
SKILL_MD = "---\nname: {name}\ndescription: 'Does a thing. Use when asked.'\n---\n\n# Body\n\n{body}\n"
GOOD_SCRIPT = '# /// script\n# requires-python = ">=3.11"\n# ///\nprint(1)\n'


def make_skill(root: Path, name="bmad-demo", body="Read `references/a.md`.", files=None, skill_md=True) -> Path:
    skill = root / name
    skill.mkdir(parents=True)
    if skill_md:
        (skill / "SKILL.md").write_text(SKILL_MD.format(name=name, body=body), encoding="utf-8")
    for rel, text in (files or {}).items():
        path = skill / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    return skill


def prepass(skill: Path):
    res = subprocess.run([sys.executable, str(SCRIPT), str(skill)], capture_output=True, text=True)
    assert res.returncode == 0, res.stderr
    return json.loads(res.stdout)


class PrepassTest(unittest.TestCase):
    def test_contract(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                body="Read `references/a.md` and `references/missing.md`. Run `uv run scripts/go.py`.",
                files={
                    "references/a.md": "A reference.\n",
                    "scripts/go.py": GOOD_SCRIPT,
                    "scripts/bare.py": "print(2)\n",
                    "scripts/tests/test_go.py": "import unittest\n",
                    "assets/SKILL-template.md": "template\n",
                    "customize.toml": "[workflow]\nx = 1\n",
                    ".memlog.md": "- (note) hidden\n",
                },
            )
            data = prepass(skill)
            self.assertEqual(set(data), KEYS)
            self.assertEqual(data["skill"], "bmad-demo")
            kinds = {f["path"]: f["kind"] for f in data["files"]}
            self.assertEqual(
                kinds,
                {
                    "SKILL.md": "entry",
                    "references/a.md": "prompt",
                    "scripts/go.py": "script",
                    "scripts/bare.py": "script",
                    "scripts/tests/test_go.py": "test",
                    "assets/SKILL-template.md": "asset",
                    "customize.toml": "config",
                },
            )
            self.assertTrue(all(f["tokens"] > 0 for f in data["files"]))
            self.assertEqual(data["total_tokens"], sum(f["tokens"] for f in data["files"]))
            self.assertEqual(
                data["skill_md_tokens"], kinds and next(f["tokens"] for f in data["files"] if f["path"] == "SKILL.md")
            )
            self.assertTrue(data["has_customize"])
            self.assertTrue(data["has_scripts"])
            self.assertEqual(
                data["scripts"],
                [
                    {"path": "scripts/bare.py", "has_pep723": False, "has_test": False},
                    {"path": "scripts/go.py", "has_pep723": True, "has_test": True},
                ],
            )
            self.assertEqual(data["description_chars"], len("Does a thing. Use when asked."))
            self.assertTrue(data["has_use_when"])
            self.assertTrue(data["frontmatter_ok"])
            self.assertEqual(sorted(f["rule"] for f in data["path_findings"]), ["bare-script-call", "missing-file"])
            self.assertEqual(sorted(f["rule"] for f in data["script_findings"]), ["pep723-missing", "test-missing"])
            self.assertEqual(data["shape_hint"], "script-utility")

    def test_shape_hints(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            cases = {
                "bmad-plain": ({}, "plain-skill"),
                "bmad-long": ({"scripts/x.py": GOOD_SCRIPT}, "script-utility"),
                "bmad-agent": ({"customize.toml": "[agent]\nname = 'Ann'\n"}, "agent"),
                "bmad-memory": ({"customize.toml": "[agent]\n", "scripts/wake.py": GOOD_SCRIPT}, "memory-agent"),
                "bmad-single": ({"bmod.toml": "[bmod]\ncode = 'x'\n[skill]\n"}, "single-skill-module"),
                "bmod-multi": ({"bmod.toml": "[bmod]\ncode = 'multi'\n"}, "multi-skill-module"),
            }
            for name, (files, expected) in cases.items():
                skill = make_skill(root, name=name, files=files)
                self.assertEqual(prepass(skill)["shape_hint"], expected, name)

            rendered = make_skill(
                root, name="bmad-rendered", body='Run `uv run "{project-root}/_bmad/scripts/render_skill.py"`.'
            )
            self.assertEqual(prepass(rendered)["shape_hint"], "rendered-skill")

            memory_text = make_skill(root, name="bmad-mem2", body="Memory at `{project-root}/_bmad/memory/bmad-mem2/`.")
            self.assertEqual(prepass(memory_text)["shape_hint"], "memory-agent")

            long_body = "\n".join(f"Line {i}." for i in range(70))
            long_skill = make_skill(root, name="bmad-long2", body=long_body, files={"scripts/x.py": GOOD_SCRIPT})
            self.assertEqual(prepass(long_skill)["shape_hint"], "plain-skill")

    def test_no_skill_md(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), skill_md=False, files={"notes.md": "x\n"})
            data = prepass(skill)
            self.assertEqual(data["shape_hint"], "unknown")
            self.assertEqual(data["skill_md_tokens"], 0)
            self.assertFalse(data["frontmatter_ok"])
            self.assertEqual(data["description_chars"], 0)
            self.assertFalse(data["has_use_when"])

    def test_bad_frontmatter_is_not_ok(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp), files={"SKILL.md": "---\nname: wrong\ndescription: 'x'\nextra: 1\n---\n\nBody\n"}
            )
            data = prepass(skill)
            self.assertFalse(data["frontmatter_ok"])
            self.assertFalse(data["has_use_when"])
            self.assertEqual(data["description_chars"], 1)


if __name__ == "__main__":
    unittest.main()
