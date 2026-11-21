"""Tests for prepass.py: the JSON contract and the shape inference."""

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "skills/toolsmith/bmad-toolsmith/scripts/prepass.py"
FRONTMATTER = SCRIPT.parents[3] / "core-tools" / "bmad" / "scripts" / "frontmatter.py"
PROJECT = tempfile.TemporaryDirectory()  # a project with the shared scripts installed, as bmad setup leaves it
(Path(PROJECT.name) / "_bmad" / "scripts").mkdir(parents=True)
shutil.copy2(FRONTMATTER, Path(PROJECT.name) / "_bmad" / "scripts")

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
    "long_paragraphs",
    "toml_errors",
    "token_method",
    "customize_findings",
    "repeated_passages",
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
    res = subprocess.run(
        [sys.executable, str(SCRIPT), "--project-root", PROJECT.name, str(skill)], capture_output=True, text=True
    )
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
                    ".scratch.md": "- (note) hidden\n",
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
                    {"path": "scripts/bare.py", "has_pep723": False, "has_test": False, "has_argparse": False},
                    {"path": "scripts/go.py", "has_pep723": True, "has_test": True, "has_argparse": False},
                ],
            )
            self.assertEqual(data["description_chars"], len("Does a thing. Use when asked."))
            self.assertTrue(data["has_use_when"])
            self.assertTrue(data["frontmatter_ok"])
            self.assertEqual(sorted(f["rule"] for f in data["path_findings"]), ["bare-script-call", "missing-file"])
            self.assertEqual(sorted(f["rule"] for f in data["script_findings"]), ["pep723-missing", "test-missing"])
            self.assertEqual(data["shape_hint"], "script-utility")
            self.assertIn(data["token_method"], ("tiktoken", "fallback"))

    def test_long_paragraphs(self):
        long_paragraph = " ".join(["Do this thing now."] * 40)
        long_sentence = " ".join(["word"] * 61) + "."
        body = f"Short line.\n\n{long_paragraph}\n\n- {long_sentence}\n\n# {long_paragraph}\n\n| {long_paragraph} |"
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                body=body,
                files={
                    "references/fenced.md": f"```text\n{long_paragraph}\n```\n",
                    "assets/template.md": f"{long_paragraph}\n",
                },
            )
            found = prepass(skill)["long_paragraphs"]
            self.assertEqual(
                found,
                [
                    {"path": "SKILL.md", "line": 10, "words": 160, "sentences": 40, "longest_sentence": 4},
                    {"path": "SKILL.md", "line": 12, "words": 62, "sentences": 1, "longest_sentence": 62},
                    {"path": "assets/template.md", "line": 1, "words": 160, "sentences": 40, "longest_sentence": 4},
                ],
            )

    def test_long_paragraph_lines_count_from_the_top_of_the_file(self):
        long_paragraph = " ".join(["Do this thing now."] * 40)
        skill_md = (
            "---\r\nname: bmad-demo\r\ndescription: |\r\n  Does a thing --- fast.\r\n  ---\r\n"
            f"  Use when asked.\r\n---\r\n\r\n{long_paragraph}\r\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                skill_md=False,
                files={
                    "SKILL.md": skill_md,
                    "references/open.md": f"---\ntitle: never closed\n\n{long_paragraph}\n",
                },
            )
            result = prepass(skill)
            found = [(item["path"], item["line"]) for item in result["long_paragraphs"]]
            self.assertEqual(found, [("SKILL.md", 9), ("references/open.md", 4)])
            self.assertTrue(result["frontmatter_ok"])

    def test_dense_lines_are_flagged_by_length_or_by_rule_count(self):
        six_rules = " ".join(["Do the first thing with care; then check it twice now."] * 4)  # 44 words, 8 clauses
        dense = f"- {six_rules} {six_rules}"  # 89 words, 16 clauses
        few_rules = " ".join(["word"] * 40) + ". " + " ".join(["word"] * 44) + "."  # 84 words, 2 sentences
        long_bullet = "- " + " ".join((["word"] * 30 + ["end."]) * 4)  # 125 words, 4 sentences
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), body=f"{dense}\n\n{few_rules}\n\n{long_bullet}\n\n- {six_rules}")
            found = [(item["line"], item["words"], item["sentences"]) for item in prepass(skill)["long_paragraphs"]]
            self.assertEqual(found, [(8, 89, 16), (12, 125, 4)])

    def test_customize_findings(self):
        customize = (
            "# {workflow.in_a_comment} is ignored\n"
            "[workflow]\n"
            'used = "x"\n'
            'unused = "y"\n'
            "switch = true\n"
            "[[workflow.items]]\n"
            'code = "A"\n'
            "private = true\n"
            "[[workflow.items]]\n"
            'label = "no id"\n'
            "[agent]\n"
            'name = "Ann"\n'
            "[[agent.menu]]\n"
            'code = "ONE"\n'
            'prompt = "Read {agent.nickname}."\n'
            "[[agent.menu]]\n"
            'code = "TWO"\n'
            'prompt = "x"\n'
            'skill = "bmad-x"\n'
            "[[agent.menu]]\n"
            'code = "THREE"\n'
        )
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                body="Write to `{workflow.used}`; `{workflow.missing}` and `{{ workflow.items }}` here.",
                files={
                    "customize.toml": customize,
                    "assets/customize-template.toml": "[agent\n{placeholder} = {workflow.nope}\n",
                    "assets/note.md": "{workflow.also_nope}\n",
                    "references/r.md": "Loop {% for i in workflow.items %}x{% endfor %}.\n",
                },
            )
            got = [(f["rule"], f["location"]) for f in prepass(skill)["customize_findings"]]
            self.assertEqual(
                sorted(got),
                sorted(
                    [
                        ("unknown-token", "SKILL.md:8"),
                        ("unread-key", "customize.toml:4"),
                        ("unread-key", "customize.toml:5"),
                        ("boolean-toggle", "customize.toml:5"),
                        ("entry-without-id", "customize.toml:9"),
                        ("agent-missing-field", "customize.toml:11"),
                        ("unknown-token", "customize.toml:15"),
                        ("menu-item-target", "customize.toml:16"),
                        ("menu-item-target", "customize.toml:20"),
                    ]
                ),
            )
            rendered = make_skill(
                Path(tmp),
                name="bmad-rendered",
                body='Run `uv run "{project-root}/_bmad/scripts/render_skill.py"`. {{ workflow.ghost }} {{ workflow.real }}',
                files={"customize.toml": '[workflow]\nreal = "x"\n'},
            )
            got = [(f["rule"], f["detail"]) for f in prepass(rendered)["customize_findings"]]
            self.assertEqual(got, [("unknown-token", "workflow.ghost is not declared")])
            broken = make_skill(Path(tmp), name="bmad-broken", files={"customize.toml": "[agent\n"})
            self.assertEqual(prepass(broken)["customize_findings"], [])

    def test_customize_key_lines_come_from_their_own_table(self):
        customize = (
            '[agent]\nname = "A"\ntitle = "T"\nicon = "x"\n\n'
            '[[agent.menu]]\ncode = "go"\nskill = "s"\nenabled = true\n\n'
            "[workflow]\n\nenabled = false\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), body="Nothing here.", files={"customize.toml": customize})
            got = sorted((f["rule"], f["location"]) for f in prepass(skill)["customize_findings"])
            self.assertEqual(got, [("boolean-toggle", "customize.toml:13"), ("unread-key", "customize.toml:13")])

    def test_jinja_constructs_are_scanned_whole_and_bound_names_skipped(self):
        render = 'Run `uv run "{project-root}/_bmad/scripts/render_skill.py"`.'
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                body=render
                + '\n\n{% if workflow.depth and workflow.missing %}\nGo {{ 1 | default(workflow.gone) }} {{ rendered("workflow.md") }}.\n{% endif %}',
                files={
                    "customize.toml": "[workflow]\ndepth = 3\n",
                    "references/loop.md": (
                        "{% for workflow in workflows %}{{ workflow.title }}{% endfor %}\n"
                        "{% set agent = pick() %}{{ agent.nick }} {{ x | default(workflow.ghost) }}\n"
                    ),
                },
            )
            got = sorted((f["location"], f["detail"]) for f in prepass(skill)["customize_findings"])
            self.assertEqual(
                got,
                [("SKILL.md:10", "workflow.missing is not declared"), ("SKILL.md:11", "workflow.gone is not declared")],
            )

    def test_repeated_passages(self):
        rule = "Every reviewer gets the canon, the standards and its own lens file as absolute paths."
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                body=f"Intro. {rule}\n\n- Too short to count here.",
                files={
                    "modes/review.md": f"- {rule.replace('absolute', 'full')}\n\nToo short to count here.\n",
                    "modes/other.md": f"```\n{rule}\n```\n{rule.replace('canon', 'whole canon and more')}\n",
                    "assets/template.md": f"{rule}\n",
                },
            )
            found = prepass(skill)["repeated_passages"]
            self.assertEqual(len(found), 1)
            self.assertEqual(found[0]["text"], rule)
            self.assertEqual(
                found[0]["locations"], [{"path": "SKILL.md", "line": 8}, {"path": "modes/review.md", "line": 1}]
            )

    def test_long_paragraphs_close_a_fence_only_on_its_own_marker(self):
        prose = " ".join(["word"] * 151)
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                files={
                    "references/nested.md": f"````\n```\n{prose}\n````\n\n{prose}\n",
                    "references/tilde.md": f"~~~\n{prose}\n```\n{prose}\n~~~\n\n{prose}\n",
                },
            )
            found = [(item["path"], item["line"]) for item in prepass(skill)["long_paragraphs"]]
            self.assertEqual(found, [("references/nested.md", 6), ("references/tilde.md", 7)])

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
                "bmad-broken": ({"customize.toml": "[agent\nname = 'Ann'\n"}, "unknown"),
            }
            for name, (files, expected) in cases.items():
                skill = make_skill(root, name=name, files=files)
                self.assertEqual(prepass(skill)["shape_hint"], expected, name)

            self.assertEqual(prepass(root / "bmad-broken")["toml_errors"][0]["path"], "customize.toml")
            self.assertEqual(prepass(root / "bmad-agent")["toml_errors"], [])

            rendered = make_skill(
                root, name="bmad-rendered", body='Run `uv run "{project-root}/_bmad/scripts/render_skill.py"`.'
            )
            self.assertEqual(prepass(rendered)["shape_hint"], "rendered-skill")

            rendered_agent = make_skill(
                root,
                name="bmad-rendered-agent",
                body='Run `uv run "{project-root}/_bmad/scripts/render_skill.py"`.',
                files={"customize.toml": "[agent]\nname = 'Ann'\n"},
            )
            self.assertEqual(prepass(rendered_agent)["shape_hint"], "rendered-agent")

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
            (skill / "SKILL.md").write_text("---\nname: s\ndescription: [Use when asked]\n---\n\nBody\n")
            self.assertFalse(prepass(skill)["frontmatter_ok"])

    def test_disable_model_invocation_frontmatter(self):
        with tempfile.TemporaryDirectory() as tmp:
            ok_skill = make_skill(
                Path(tmp),
                name="bmad-manual",
                files={
                    "SKILL.md": "---\nname: bmad-manual\ndescription: 'Manual skill.'\ndisable-model-invocation: true\n---\n\nBody\n"
                },
            )
            self.assertTrue(prepass(ok_skill)["frontmatter_ok"])
            bad_skill = make_skill(
                Path(tmp),
                name="bmad-manual-false",
                files={
                    "SKILL.md": "---\nname: bmad-manual-false\ndescription: 'Manual skill.'\ndisable-model-invocation: false\n---\n\nBody\n"
                },
            )
            self.assertFalse(prepass(bad_skill)["frontmatter_ok"])


if __name__ == "__main__":
    unittest.main()
