"""Tests for bmod_utils.py and allowlisted runtime execution without setup.py or knowledge.py."""

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_SRC = Path(__file__).resolve().parents[3] / "skills" / "core-tools" / "bmad" / "scripts"
sys.path.insert(0, str(SCRIPTS_SRC))

import bmod_utils  # noqa: E402


class BmodUtilsTests(unittest.TestCase):
    def test_scan_and_parse_bmod_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skills = root / "skills"
            record = skills / "bmod-demo"
            record.mkdir(parents=True)
            (record / "bmod.toml").write_text(
                '[bmod]\ncode = "demo"\nversion = "1.2.0"\n'
                'update_source = "github:acme/demo/skills"\n'
                'skills = ["demo-skill"]\n',
                encoding="utf-8",
            )
            (record / "roster.toml").write_text(
                '[[members]]\ncode = "demo-skill"\nskill = "demo-skill"\nname = "Demo"\n',
                encoding="utf-8",
            )
            member = skills / "demo-skill"
            member.mkdir()
            (member / "SKILL.md").write_text(
                "---\nname: demo-skill\ndescription: 'Test. Use when testing.'\n---\n", encoding="utf-8"
            )
            (member / "bmod.toml").write_text(
                '[skill]\nbmod = "bmod-demo"\nsource = "github:acme/demo/skills"\n',
                encoding="utf-8",
            )

            parsed = bmod_utils.read_bmod_file(record / "bmod.toml")
            self.assertIsNotNone(parsed)
            assert parsed is not None and parsed.bmod is not None
            self.assertEqual(parsed.bmod.code, "demo")
            self.assertEqual(bmod_utils.compare_semver("1.2.0", "1.1.0"), 1)
            self.assertEqual(
                bmod_utils.install_command("github:acme/demo/skills", "demo-skill"),
                "npx skills add acme/demo --skill demo-skill",
            )

            found = bmod_utils.scan([skills])
            self.assertEqual([m.code for m in found.modules], ["demo"])
            self.assertEqual(found.problems, [])

    def test_allowlisted_runtime_runs_setup_check_and_roster_without_setup_or_knowledge(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"
            scripts = project / "_bmad" / "scripts"
            scripts.mkdir(parents=True)
            (project / "_bmad" / "config.toml").write_text('[core]\noutput_folder = "_bmad-output"\n', encoding="utf-8")
            for name in (
                "bmod_utils.py",
                "config_utils.py",
                "resolve_customization.py",
                "roster.py",
                "setup_check.py",
            ):
                shutil.copy2(SCRIPTS_SRC / name, scripts / name)

            skills = project / ".claude" / "skills"
            record = skills / "bmod-demo"
            record.mkdir(parents=True)
            (record / "bmod.toml").write_text(
                '[bmod]\ncode = "demo"\nversion = "1.0.0"\n'
                'update_source = "github:acme/demo/skills"\n'
                'skills = ["demo-agent"]\n',
                encoding="utf-8",
            )
            (record / "roster.toml").write_text(
                '[[members]]\ncode = "demo-agent"\nskill = "demo-agent"\nname = "Ada"\npersona = "Concise."\n',
                encoding="utf-8",
            )
            agent = skills / "demo-agent"
            agent.mkdir()
            (agent / "bmod.toml").write_text(
                '[skill]\nbmod = "bmod-demo"\nsource = "github:acme/demo/skills"\n',
                encoding="utf-8",
            )
            (agent / "customize.toml").write_text('[agent]\nname = "Ada"\n', encoding="utf-8")

            custom = subprocess.run(
                [
                    sys.executable,
                    str(scripts / "resolve_customization.py"),
                    "--project-root",
                    str(project),
                    "--skill",
                    str(agent),
                    "--root",
                    str(skills),
                    "--key",
                    "agent",
                ],
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(custom.returncode, 0, msg=custom.stderr)
            self.assertEqual(custom.stderr, "")
            self.assertEqual(json.loads(custom.stdout)["agent"]["name"], "Ada")

            roster_res = subprocess.run(
                [
                    sys.executable,
                    str(scripts / "roster.py"),
                    "--project-root",
                    str(project),
                    "--skill",
                    str(agent),
                    "--root",
                    str(skills),
                ],
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(roster_res.returncode, 0, msg=roster_res.stderr)
            roster_data = json.loads(roster_res.stdout)
            self.assertIn("demo-agent", roster_data["agents"])
            self.assertEqual(roster_data["problems"], [])


if __name__ == "__main__":
    unittest.main()
