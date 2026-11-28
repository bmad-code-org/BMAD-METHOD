"""Tests for scan_config_reads.py on a multi-skill module and a single-skill module."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "skills/toolsmith/bmad-toolsmith/scripts/scan_config_reads.py"
RESOLVE = "uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root}"

RECORD = """[bmod]
code = "acme"
version = "1.0.0"
skills = ["acme-notes", "acme-agent-scout"]

[[bmod.config_questions]]
key = "notes_folder"
prompt = "Where do notes go?"

[[bmod.config_questions]]
key = "tone"
prompt = "Which tone?"
"""


def write(root: Path, files: dict[str, str]) -> None:
    for relative, text in files.items():
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")


def run(folder: Path):
    res = subprocess.run([sys.executable, str(SCRIPT), str(folder)], capture_output=True, text=True)
    return res.returncode, json.loads(res.stdout) if res.stdout.strip() else None, res.stderr


class ScanConfigReadsTest(unittest.TestCase):
    def test_multi_skill_module(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "acme"
            write(
                root,
                {
                    "bmod-acme/SKILL.md": "---\nname: bmod-acme\ndescription: x\n---\n",
                    "bmod-acme/bmod.toml": RECORD,
                    "bmod-acme/help/help.md": f"Example: `{RESOLVE} --key modules.acme.example_only`\n",
                    "acme-notes/SKILL.md": (
                        "---\nname: acme-notes\ndescription: x\n---\n\n"
                        f"1. Config: `{RESOLVE} --key core.output_folder --key modules.acme.notes_folder"
                        " --key modules.acme.archive_folder`.\n"
                    ),
                    "acme-notes/bmod.toml": '[skill]\nbmod = "bmod-acme"\n',
                    "acme-notes/scripts/load.py": 'ARGS = ["-k", "modules.acme.tone"]\nCMD = "-k modules.other.thing"\n',
                    "acme-notes/scripts/tests/test_load.py": 'ARGS = "--key modules.acme.fixture_key"\n',
                    "acme-agent-scout/SKILL.md": (
                        f"---\nname: acme-agent-scout\ndescription: x\n---\n\nRun `{RESOLVE} --key=modules.acme.depth`.\n"
                    ),
                    "acme-agent-scout/bmod.toml": '[skill]\nbmod = "bmod-acme"\n',
                },
            )
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertEqual(
                data["records"],
                [{"code": "acme", "path": "bmod-acme/bmod.toml", "questions": ["notes_folder", "tone"]}],
            )
            self.assertEqual(
                data["unasked"],
                [
                    {
                        "skill": "acme-agent-scout",
                        "file": "acme-agent-scout/SKILL.md",
                        "line": 6,
                        "key": "modules.acme.depth",
                    },
                    {
                        "skill": "acme-notes",
                        "file": "acme-notes/SKILL.md",
                        "line": 6,
                        "key": "modules.acme.archive_folder",
                    },
                ],
            )
            self.assertEqual(data["unread"], [])

    def test_single_skill_module_with_unread_question(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "doc-standards"
            write(
                root,
                {
                    "SKILL.md": f"---\nname: doc-standards\ndescription: x\n---\n\n`{RESOLVE} --key modules.docstd.style`\n",
                    "bmod.toml": (
                        '[bmod]\ncode = "docstd"\nversion = "0.1.0"\n\n'
                        '[[bmod.config_questions]]\nkey = "style"\nprompt = "Style?"\n\n'
                        '[[bmod.config_questions]]\nkey = "glossary"\nprompt = "Glossary?"\n\n[skill]\n'
                    ),
                },
            )
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertEqual(data["records"][0]["path"], "bmod.toml")
            self.assertEqual(data["unasked"], [])
            self.assertEqual(data["unread"], [{"key": "modules.docstd.glossary"}])

    def test_whole_table_read_and_key_split_across_an_argv_list(self):
        argv = (
            "import subprocess\n\n\ndef read(root):\n    return subprocess.run(\n        [\n"
            '            "uv", "run", f"{root}/_bmad/scripts/resolve_config.py",\n'
            '            "--key",\n            "modules.acme.typo",\n        ]\n    )\n'
        )
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "acme"
            write(
                root,
                {
                    "bmod-acme/SKILL.md": "---\nname: bmod-acme\ndescription: x\n---\n",
                    "bmod-acme/bmod.toml": RECORD,
                    "acme-notes/SKILL.md": f"---\nname: acme-notes\ndescription: x\n---\n\n`{RESOLVE} --key modules.acme`.\n",
                    "acme-notes/bmod.toml": "[skill]\n",
                    "acme-notes/scripts/read.py": argv,
                },
            )
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertEqual(data["unread"], [])
            self.assertEqual(
                data["unasked"],
                [{"skill": "acme-notes", "file": "acme-notes/scripts/read.py", "line": 8, "key": "modules.acme.typo"}],
            )

    def test_dotted_question_keys_and_prefix_reads(self):
        record = '[bmod]\ncode = "acme"\nversion = "1.0.0"\nskills = ["acme-notes"]\n\n'
        record += "".join(
            f'[[bmod.config_questions]]\nkey = "{k}"\nprompt = "?"\n\n'
            for k in ("export.format", "export.path", "style")
        )
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "acme"
            write(
                root,
                {
                    "bmod-acme/SKILL.md": "---\nname: bmod-acme\ndescription: x\n---\n",
                    "bmod-acme/bmod.toml": record,
                    "acme-notes/SKILL.md": (
                        f"---\nname: acme-notes\ndescription: x\n---\n\n`{RESOLVE} --key modules.acme.export.format`.\n"
                        f"`{RESOLVE} --key modules.acme.export`.\n"
                    ),
                    "acme-notes/bmod.toml": "[skill]\n",
                },
            )
            code, data, err = run(root)
            self.assertEqual(code, 0, err)
            self.assertEqual(data["unasked"], [])
            self.assertEqual(data["unread"], [{"key": "modules.acme.style"}])

    def test_no_record_or_bad_manifest_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "plain"
            write(root, {"a/SKILL.md": "---\nname: a\ndescription: x\n---\n"})
            code, _, err = run(root)
            self.assertEqual(code, 1)
            self.assertIn("no bmod.toml", err)
            write(root, {"a/bmod.toml": "[bmod\n"})
            code, _, err = run(root)
            self.assertEqual(code, 1)
            self.assertIn("does not parse", err)
        res = subprocess.run([sys.executable, str(SCRIPT), "/nonexistent"], capture_output=True, text=True)
        self.assertEqual(res.returncode, 2)


if __name__ == "__main__":
    unittest.main()
