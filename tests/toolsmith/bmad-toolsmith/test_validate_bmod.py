"""Tests for bmad-toolsmith's validate_manifests.py wrapper."""

import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
WRAPPER = REPO_ROOT / "skills" / "toolsmith" / "bmad-toolsmith" / "scripts" / "validate_bmod.py"
BMAD_VALIDATOR = REPO_ROOT / "skills" / "core-tools" / "bmad" / "scripts" / "validate_manifests.py"


class ToolsmithValidateManifestsTests(unittest.TestCase):
    def test_validates_repo_using_root_bmad_skill(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skills_root = root / ".claude" / "skills"
            bmad_scripts = skills_root / "bmad" / "scripts"
            bmad_scripts.mkdir(parents=True)
            for name in (
                "validate_manifests.py",
                "setup.py",
                "knowledge.py",
                "bmod_utils.py",
                "list_templates.py",
                "frontmatter.py",
                "config_utils.py",
            ):
                shutil.copy2(BMAD_VALIDATOR.parent / name, bmad_scripts / name)

            repo = root / "repo"
            record = repo / "skills" / "bmod-demo"
            record.mkdir(parents=True)
            (record / "SKILL.md").write_text(
                "---\nname: bmod-demo\ndescription: Required bmod metadata. Never invoke this skill.\n---\n",
                encoding="utf-8",
            )
            (record / "help").mkdir()
            (record / "help" / "help.md").write_text("# Help\n", encoding="utf-8")
            (record / "bmod.toml").write_text(
                '[bmod]\ncode = "demo"\nversion = "1.0.0"\n'
                'update_source = "github:acme/demo/skills"\n'
                'skills = ["demo-skill"]\n'
                'pre_install_message = ""\npost_install_message = ""\n',
                encoding="utf-8",
            )
            member = repo / "skills" / "demo-skill"
            member.mkdir()
            (member / "SKILL.md").write_text(
                "---\nname: demo-skill\ndescription: 'Demo. Use when testing.'\n---\nBody.\n", encoding="utf-8"
            )
            (member / "bmod.toml").write_text(
                '[skill]\nbmod = "bmod-demo"\nsource = "github:acme/demo/skills"\n',
                encoding="utf-8",
            )

            res = subprocess.run(
                [
                    sys.executable,
                    str(WRAPPER),
                    "--project-root",
                    str(repo),
                    "--root",
                    str(skills_root),
                ],
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(res.returncode, 0, msg=res.stderr)
            self.assertIn("bmod files valid:", res.stdout)

    def test_missing_bmad_skill_exits_nonzero_with_install_hint(self):
        with tempfile.TemporaryDirectory() as tmp:
            isolated = Path(tmp) / "isolated"
            isolated_scripts = isolated / "skills" / "bmad-toolsmith" / "scripts"
            isolated_scripts.mkdir(parents=True)
            isolated_wrapper = isolated_scripts / "validate_manifests.py"
            shutil.copy2(WRAPPER, isolated_wrapper)
            repo = Path(tmp) / "repo"
            repo.mkdir()

            res = subprocess.run(
                [sys.executable, str(isolated_wrapper), "--project-root", str(repo)],
                text=True,
                capture_output=True,
                check=False,
                env={"HOME": str(Path(tmp) / "empty-home"), "PATH": ""},
            )
            self.assertEqual(res.returncode, 1)
            self.assertIn("bmad skill not found", res.stderr)


if __name__ == "__main__":
    unittest.main()
