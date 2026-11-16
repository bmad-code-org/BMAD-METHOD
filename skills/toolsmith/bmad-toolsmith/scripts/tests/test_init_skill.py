"""Tests for init_skill.py: scaffolding each shape and checking skills for the frontmatter and bmod rules."""

import json
import subprocess
import sys
import tempfile
import tomllib
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "init_skill.py"

GOOD_DESCRIPTION = "Counts things in a folder. Use when the user asks how big a skill is."


def run(*args):
    res = subprocess.run([sys.executable, str(SCRIPT), *[str(a) for a in args]], capture_output=True, text=True)
    data = json.loads(res.stdout) if res.stdout.strip().startswith("{") else None
    return res.returncode, data, res.stderr


def rules(data):
    return sorted(f["rule"] for f in data["findings"])


class CreateTest(unittest.TestCase):
    def test_plain_skill_with_dirs_and_skill_table(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, data, err = run(
                "--name",
                "bmad-demo",
                "--dest",
                tmp,
                "--shape",
                "plain-skill",
                "--dirs",
                "references,scripts",
                "--bmod",
                "bmod-example",
                "--source",
                "github:acme/example/skills",
                "--description",
                GOOD_DESCRIPTION,
            )
            self.assertEqual(code, 0, err)
            skill = Path(tmp) / "bmad-demo"
            self.assertEqual(data["created"], ["SKILL.md", "bmod.toml", "references/", "scripts/"])
            self.assertEqual(data["shape"], "plain-skill")
            text = (skill / "SKILL.md").read_text(encoding="utf-8")
            self.assertTrue(text.startswith("---\nname: bmad-demo\ndescription: '"))
            self.assertIn("# bmad-demo", text)
            bmod = tomllib.loads((skill / "bmod.toml").read_text(encoding="utf-8"))
            self.assertEqual(bmod, {"skill": {"bmod": "bmod-example", "source": "github:acme/example/skills"}})
            self.assertTrue((skill / "references").is_dir())
            # The new skill passes its own check.
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 0, data)
            self.assertEqual(data["bmod"], "ok")

    def test_doc_templates_dir(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, data, err = run(
                "--name",
                "acme-agent-vic",
                "--dest",
                tmp,
                "--shape",
                "agent",
                "--dirs",
                "doc-templates",
                "--description",
                GOOD_DESCRIPTION,
            )
            self.assertEqual(code, 0, err)
            self.assertIn("doc-templates/", data["created"])
            self.assertTrue((Path(tmp) / "acme-agent-vic" / "doc-templates").is_dir())

    def test_no_bmod_without_flag(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "bmad-demo"
            code, data, err = run(
                "--name", "bmad-demo", "--dest", tmp, "--shape", "plain-skill", "--description", GOOD_DESCRIPTION
            )
            self.assertEqual(code, 0, err)
            self.assertEqual(data["created"], ["SKILL.md"])
            self.assertFalse((target / "bmod.toml").exists())
            code, data, _ = run("--check", target)
            self.assertEqual(code, 0, data)
            self.assertEqual(data["bmod"], "absent")

    def test_placeholder_description_fails_check(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, _, _ = run("--name", "bmad-demo", "--dest", tmp, "--shape", "script-utility")
            self.assertEqual(code, 0)
            code, data, _ = run("--check", Path(tmp) / "bmad-demo")
            self.assertEqual(code, 1)
            # The placeholder carries "Use when", so only the TODO marker fails the check.
            self.assertEqual(rules(data), ["todo-left"])

    def test_single_skill_module(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, _, _ = run(
                "--name",
                "bmad-changelog",
                "--dest",
                tmp,
                "--shape",
                "single-skill-module",
                "--source",
                "github:acme/changelog",
                "--description",
                GOOD_DESCRIPTION,
            )
            self.assertEqual(code, 0)
            bmod = tomllib.loads((Path(tmp) / "bmad-changelog" / "bmod.toml").read_text(encoding="utf-8"))
            self.assertEqual(
                bmod["bmod"], {"code": "changelog", "version": "0.1.0", "update_source": "github:acme/changelog"}
            )
            self.assertEqual(bmod["skill"], {})
            code, data, _ = run("--check", Path(tmp) / "bmad-changelog")
            self.assertEqual(code, 0, data)

    def test_multi_skill_module_record(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, _, _ = run(
                "--name",
                "bmod-acme",
                "--dest",
                tmp,
                "--shape",
                "multi-skill-module",
                "--source",
                "github:acme/x/skills",
            )
            self.assertEqual(code, 0)
            skill = Path(tmp) / "bmod-acme"
            bmod = tomllib.loads((skill / "bmod.toml").read_text(encoding="utf-8"))
            self.assertEqual(
                bmod,
                {"bmod": {"code": "acme", "version": "0.1.0", "update_source": "github:acme/x/skills", "skills": []}},
            )
            self.assertIn(
                "Required bmod metadata. Never invoke this skill.", (skill / "SKILL.md").read_text(encoding="utf-8")
            )
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 0, data)
            code, _, _ = run("--name", "bmad-acme", "--dest", tmp, "--shape", "multi-skill-module")
            self.assertEqual(code, 1)

    def test_refuses_bad_name_existing_folder_and_unknown_dir(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, data, _ = run("--name", "Bad_Name", "--dest", tmp, "--shape", "plain-skill")
            self.assertEqual(code, 1)
            self.assertFalse(data["ok"])
            (Path(tmp) / "bmad-taken").mkdir()
            code, _, _ = run("--name", "bmad-taken", "--dest", tmp, "--shape", "plain-skill")
            self.assertEqual(code, 1)
            code, _, _ = run("--name", "bmad-new", "--dest", tmp, "--shape", "plain-skill", "--dirs", "steps")
            self.assertEqual(code, 1)
            code, _, _ = run("--name", "bmad-new", "--dest", tmp)
            self.assertEqual(code, 2)


class CheckTest(unittest.TestCase):
    def write_skill(self, tmp, name, skill_md, bmod="[skill]\n", extra=None):
        skill = Path(tmp) / name
        skill.mkdir()
        (skill / "SKILL.md").write_text(skill_md, encoding="utf-8")
        if bmod is not None:
            (skill / "bmod.toml").write_text(bmod, encoding="utf-8")
        for rel, text in (extra or {}).items():
            path = skill / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8")
        return skill

    def test_good_skill_with_multiline_description(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = self.write_skill(
                tmp,
                "bmad-good",
                "---\nname: bmad-good\ndescription: >-\n  Does a thing.\n  Use when asked.\n---\n\nBody.\n",
                extra={".memlog.md": "- (note) [TODO: hidden files are not scanned]\n"},
            )
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 0, data)
            self.assertEqual(data, {"ok": True, "skill": "bmad-good", "bmod": "ok", "findings": []})

    def test_every_rule(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = self.write_skill(
                tmp,
                "my-skill",
                "---\nname: other-name\ndescription: '" + "x" * 1025 + "'\nversion: 1\n---\n\n   \n",
                bmod="[skill\nbroken",
                extra={"references/a.md": "[TODO: write]\n"},
            )
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 1)
            self.assertEqual(
                rules(data),
                [
                    "bmod-invalid",
                    "body-empty",
                    "description-length",
                    "description-trigger",
                    "frontmatter-keys",
                    "name-folder-mismatch",
                    "name-format",
                    "todo-left",
                ],
            )
            todo = next(f for f in data["findings"] if f["rule"] == "todo-left")
            self.assertEqual((todo["path"], todo["line"]), ("references/a.md", 1))

    def test_any_name_and_missing_pieces(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = self.write_skill(
                tmp,
                "acme-notes",
                "---\nname: acme-notes\ndescription: 'Notes. Use when writing.'\n---\n\nBody.\n",
                bmod=None,
            )
            code, data, _ = run("--check", skill)
            self.assertEqual(rules(data), ["name-format"])
            self.assertEqual(data["bmod"], "absent")
            code, data, _ = run("--check", skill, "--any-name")
            self.assertEqual(code, 0, data)
            empty = Path(tmp) / "bmad-empty"
            empty.mkdir()
            code, data, _ = run("--check", empty)
            self.assertEqual(rules(data), ["skill-md-missing"])
            no_fm = self.write_skill(tmp, "bmad-nofm", "# Just a heading\n", bmod="[other]\n")
            code, data, _ = run("--check", no_fm)
            self.assertEqual(rules(data), ["bmod-tables", "frontmatter-missing"])
            self.assertEqual(data["bmod"], "invalid")

    def test_todo_markers_about_the_marker_do_not_count(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = self.write_skill(
                tmp,
                "bmad-good",
                "---\nname: bmad-good\ndescription: 'Does a thing. Use when asked.'\n---\n\n"
                "The scaffold leaves a `[TODO:` marker; `--check` fails on any `[TODO:` left.\n"
                "```\n[TODO: shown in a fence]\n```\n"
                "Still to do: [TODO: real marker]\n",
                extra={
                    "scripts/gen.py": 'PLACEHOLDER = "[TODO: written by code]"\n# [TODO: a real note]\n',
                    "customize.toml": 'path = "[TODO: fill]"\n',
                },
            )
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 1)
            self.assertEqual(
                sorted((f["path"], f["line"]) for f in data["findings"] if f["rule"] == "todo-left"),
                [("SKILL.md", 10), ("customize.toml", 1), ("scripts/gen.py", 2)],
            )

    def test_customize_that_does_not_parse(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = self.write_skill(
                tmp,
                "bmad-good",
                "---\nname: bmad-good\ndescription: 'Does a thing. Use when asked.'\n---\n\nBody.\n",
                extra={"customize.toml": '[workflow]\nok = "x"\nbroken = \n'},
            )
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 1)
            self.assertEqual(rules(data), ["customize-invalid"])
            self.assertEqual(data["findings"][0]["line"], 3)

    def test_memory_script_that_differs_from_the_shape_template(self):
        assets = SCRIPT.parents[1] / "shapes" / "memory-agent" / "assets"
        wake = (assets / "wake-template.py").read_text(encoding="utf-8")
        sanctum = (assets / "init-sanctum-template.py").read_text(encoding="utf-8")
        with tempfile.TemporaryDirectory() as tmp:
            skill = self.write_skill(
                tmp,
                "bmad-agent-mem",
                "---\nname: bmad-agent-mem\ndescription: 'Remembers. Use when asked.'\n---\n\nWake from `{project-root}/_bmad/memory/bmad-agent-mem/`.\n",
                extra={"scripts/wake.py": wake, "scripts/init-sanctum.py": sanctum + "\n# local edit\n"},
            )
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 1)
            self.assertEqual(
                [(f["path"], f["rule"]) for f in data["findings"]], [("scripts/init-sanctum.py", "memory-script-stale")]
            )

    def test_memory_script_with_crlf_line_endings_is_not_stale(self):
        assets = SCRIPT.parents[1] / "shapes" / "memory-agent" / "assets"
        wake = (assets / "wake-template.py").read_bytes()
        with tempfile.TemporaryDirectory() as tmp:
            skill = self.write_skill(
                tmp,
                "bmad-agent-mem",
                "---\nname: bmad-agent-mem\ndescription: 'Remembers. Use when asked.'\n---\n\nWake from `{project-root}/_bmad/memory/bmad-agent-mem/`.\n",
                extra={"scripts/wake.py": ""},
            )
            (skill / "scripts" / "wake.py").write_bytes(wake.replace(b"\r\n", b"\n").replace(b"\n", b"\r\n"))
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 0)
            self.assertEqual(rules(data), [])

    def test_wake_script_in_a_skill_that_is_not_a_memory_agent_is_left_alone(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = self.write_skill(
                tmp,
                "bmad-alarm",
                "---\nname: bmad-alarm\ndescription: 'Sets alarms. Use when asked.'\n---\n\nBody.\n",
                extra={"scripts/wake.py": "print('wake up')\n"},
            )
            code, data, _ = run("--check", skill)
            self.assertEqual(code, 0)
            self.assertEqual(rules(data), [])

    def test_record_rules(self):
        with tempfile.TemporaryDirectory() as tmp:
            record = self.write_skill(
                tmp,
                "bmod-acme",
                "---\nname: bmod-acme\ndescription: 'Acme tools. Use when needed.'\n---\n\nBody.\n",
                bmod='[bmod]\ncode = "acme"\nversion = "1.0.0"\nupdate_source = "github:acme/x"\n',
            )
            code, data, _ = run("--check", record)
            self.assertEqual(rules(data), ["description-trigger"])


if __name__ == "__main__":
    unittest.main()
