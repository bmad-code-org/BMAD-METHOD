"""Tests for registry.py: records, members, single-skill modules, unregistered skills, symlink dedupe."""

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "registry.py"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def make_project(root: Path) -> Path:
    project = root / "project"
    agents = project / ".agents" / "skills"
    (project / "_bmad").mkdir(parents=True)
    # core record
    write(agents / "bmod-core-tools" / "SKILL.md", "---\nname: bmod-core-tools\ndescription: x\n---\n")
    write(
        agents / "bmod-core-tools" / "bmod.toml",
        '[bmod]\ncode = "core-tools"\nversion = "6.13.0"\nupdate_source = "github:bmad-code-org/BMAD-METHOD/skills"\nskills = ["bmad"]\n',
    )
    write(agents / "bmad" / "SKILL.md", "---\nname: bmad\ndescription: x\n---\n")
    write(
        agents / "bmad" / "bmod.toml",
        '[skill]\nbmod = "bmod-core-tools"\nsource = "github:bmad-code-org/BMAD-METHOD/skills"\n',
    )
    # an org module with an agent member and help
    write(agents / "bmod-acme" / "SKILL.md", "---\nname: bmod-acme\ndescription: x\n---\n")
    write(
        agents / "bmod-acme" / "bmod.toml",
        '[bmod]\ncode = "acme"\nversion = "1.0.0"\nupdate_source = "github:acme/skills"\nskills = ["acme-release-notes"]\n',
    )
    write(agents / "bmod-acme" / "help" / "help.md", "# Acme\n")
    write(agents / "bmod-acme" / "roster.toml", "[[members]]\ncode = 'acme-agent-scout'\n")
    write(agents / "acme-release-notes" / "SKILL.md", "---\nname: acme-release-notes\ndescription: x\n---\n")
    write(agents / "acme-release-notes" / "bmod.toml", '[skill]\nbmod = "bmod-acme"\nsource = "github:acme/skills"\n')
    write(agents / "acme-agent-scout" / "SKILL.md", "---\nname: acme-agent-scout\ndescription: x\n---\n")
    write(agents / "acme-agent-scout" / "bmod.toml", '[skill]\nbmod = "bmod-acme"\nsource = "github:acme/skills"\n')
    # a single-skill module
    write(agents / "doc-standards" / "SKILL.md", "---\nname: doc-standards\ndescription: x\n---\n")
    write(
        agents / "doc-standards" / "bmod.toml",
        '[bmod]\ncode = "docstd"\nversion = "0.1.0"\nupdate_source = "github:me/doc-standards"\n\n[skill]\n',
    )
    write(agents / "doc-standards" / "help" / "help.md", "# Doc standards\n")
    # wired to BMad, registered nowhere
    write(agents / "random-generator" / "SKILL.md", "---\nname: random-generator\ndescription: x\n---\n")
    write(agents / "random-generator" / "customize.toml", "[workflow]\n")
    write(
        agents / "joke" / "SKILL.md",
        "---\nname: joke\ndescription: x\n---\nRun `uv run {project-root}/_bmad/scripts/resolve_config.py`.\n",
    )
    # plain, outside BMad
    write(agents / "plain" / "SKILL.md", "---\nname: plain\ndescription: x\n---\nJust do it.\n")
    # .claude/skills mirrors .agents/skills through symlinks
    claude = project / ".claude" / "skills"
    claude.mkdir(parents=True)
    for folder in agents.iterdir():
        os.symlink(Path("..") / ".." / ".agents" / "skills" / folder.name, claude / folder.name)
    return project


def run(project: Path, *extra: str) -> dict:
    res = subprocess.run(
        [sys.executable, str(SCRIPT), "--project-root", str(project), *extra], capture_output=True, text=True
    )
    assert res.returncode == 0, res.stderr
    return json.loads(res.stdout)


class RegistryTest(unittest.TestCase):
    def test_records_members_and_unregistered(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = make_project(Path(tmp))
            roots = [str(project / ".agents" / "skills"), str(project / ".claude" / "skills")]
            data = run(project, "--root", roots[0], "--root", roots[1])
            self.assertEqual(data["bmad"], {"present": True, "version": "6.13.0"})
            self.assertFalse(data["skills_repo"])
            by_code = {r["code"]: r for r in data["records"]}
            self.assertEqual(sorted(by_code), ["acme", "core-tools", "docstd"])
            acme = by_code["acme"]
            self.assertEqual(acme["skills"], ["acme-agent-scout", "acme-release-notes"])
            self.assertEqual(acme["prefix"], "acme-")
            self.assertTrue(acme["has_help"])
            self.assertTrue(acme["has_roster"])
            self.assertFalse(acme["single_skill"])
            self.assertEqual(acme["scope"], "project")
            doc = by_code["docstd"]
            self.assertTrue(doc["single_skill"])
            self.assertEqual(doc["skills"], [])
            self.assertEqual(doc["prefix"], "docstd-")
            self.assertEqual(by_code["core-tools"]["prefix"], "bmad-")
            self.assertEqual(sorted(u["skill"] for u in data["unregistered"]), ["joke", "random-generator"])
            # the symlinked copies did not double anything
            self.assertEqual(len(data["records"]), 3)
            self.assertEqual(len(data["unregistered"]), 2)

    def test_empty_project(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "empty"
            project.mkdir()
            data = run(project, "--root", str(project / "nowhere"))
            self.assertEqual(data["bmad"], {"present": False, "version": None})
            self.assertEqual(data["records"], [])
            self.assertEqual(data["unregistered"], [])

    def test_skills_repo_detected(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "repo"
            write(project / "skills" / "bmod-x" / "SKILL.md", "---\nname: bmod-x\ndescription: x\n---\n")
            write(
                project / "skills" / "bmod-x" / "bmod.toml",
                '[bmod]\ncode = "x"\nversion = "1"\nupdate_source = "github:a/b"\n',
            )
            data = run(project, "--root", str(project / "skills"))
            self.assertTrue(data["skills_repo"])
            self.assertEqual(data["records"][0]["code"], "x")


if __name__ == "__main__":
    unittest.main()
