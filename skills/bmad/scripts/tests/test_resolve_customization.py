import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "resolve_customization.py"


class ResolveCustomizationStdoutTests(unittest.TestCase):
    def test_missing_tomllib_exits_with_actionable_version_error(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            scripts = Path(temp_dir)
            shutil.copy2(SCRIPT, scripts / SCRIPT.name)
            shutil.copy2(SCRIPT.parent / "config_utils.py", scripts / "config_utils.py")
            (scripts / "tomllib.py").write_text(
                'raise ModuleNotFoundError("No module named tomllib", name="tomllib")\n',
                encoding="utf-8",
            )

            result = subprocess.run(
                [sys.executable, str(scripts / SCRIPT.name), "--help"],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )

            self.assertEqual(result.returncode, 3)
            self.assertEqual(
                result.stderr,
                "error: Python 3.11+ is required (stdlib `tomllib` not found).\n",
            )
            self.assertNotIn("Traceback", result.stderr)

    def test_writes_emoji_json_when_stdout_encoding_is_cp1252(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            skill_dir = Path(temp_dir) / "emoji-agent"
            skill_dir.mkdir()
            (skill_dir / "customize.toml").write_text(
                '[agent]\nname = "Emoji Agent"\nicon = "🧭"\n',
                encoding="utf-8",
            )

            env = os.environ.copy()
            env["PYTHONIOENCODING"] = "cp1252"
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--skill",
                    str(skill_dir),
                    "--key",
                    "agent",
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=temp_dir,
                env=env,
                check=False,
            )

            stderr = result.stderr.decode("utf-8", errors="replace")
            self.assertEqual(result.returncode, 0, msg=stderr)

            output = result.stdout.decode("utf-8")
            self.assertIn("🧭", output)
            resolved = json.loads(output)
            self.assertEqual(resolved["agent"]["icon"], "🧭")


def write(path: Path, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(body, encoding="utf-8")


def facts(*entries: str) -> str:
    listed = ", ".join(f'"{entry}"' for entry in entries)
    return f"[workflow]\npersistent_facts = [{listed}]\n"


def resolve(skill_dir: Path, cwd: Path, *extra: str):
    return subprocess.run(
        [sys.executable, str(SCRIPT), "--skill", str(skill_dir), "--key", "workflow", *extra],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=str(cwd),
        check=False,
    )


class ProjectRootResolutionTests(unittest.TestCase):
    """Regression cover for #2796 — the project is where the user works, not
    where the skill is installed."""

    def test_home_installed_skill_reads_project_override_not_home_bmad(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            home = Path(temp_dir) / "home"
            project = Path(temp_dir) / "project"
            skill = home / ".claude" / "skills" / "demo-skill"
            write(skill / "customize.toml", facts("shipped default"))
            (home / "_bmad" / "custom").mkdir(parents=True)
            write(project / "_bmad" / "custom" / "demo-skill.toml", facts("team override"))

            result = resolve(skill, project)

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            resolved = json.loads(result.stdout)["workflow"]["persistent_facts"]
            self.assertEqual(resolved, ["shipped default", "team override"])

    def test_project_installed_skill_still_resolves(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "project"
            skill = project / ".claude" / "skills" / "demo-skill"
            write(skill / "customize.toml", facts("shipped default"))
            write(project / "_bmad" / "custom" / "demo-skill.toml", facts("team override"))

            result = resolve(skill, project)

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            resolved = json.loads(result.stdout)["workflow"]["persistent_facts"]
            self.assertEqual(resolved, ["shipped default", "team override"])

    def test_walk_prefers_bmad_over_a_nearer_git_directory(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "project"
            submodule = project / "vendor" / "sub"
            skill = Path(temp_dir) / "skills" / "demo-skill"
            write(skill / "customize.toml", facts("shipped default"))
            write(project / "_bmad" / "custom" / "demo-skill.toml", facts("team override"))
            (submodule / ".git").mkdir(parents=True)

            result = resolve(skill, submodule)

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            resolved = json.loads(result.stdout)["workflow"]["persistent_facts"]
            self.assertEqual(resolved, ["shipped default", "team override"])

    def test_notes_when_a_rejected_root_holds_the_only_override(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            home = Path(temp_dir) / "home"
            project = Path(temp_dir) / "project"
            skill = home / ".claude" / "skills" / "demo-skill"
            write(skill / "customize.toml", facts("shipped default"))
            write(home / "_bmad" / "custom" / "demo-skill.toml", facts("home override"))
            (project / "_bmad" / "custom").mkdir(parents=True)

            result = resolve(skill, project)

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            resolved = json.loads(result.stdout)["workflow"]["persistent_facts"]
            self.assertEqual(resolved, ["shipped default"])
            self.assertIn("demo-skill", result.stderr)
            self.assertIn("--project-root", result.stderr)

    def test_explicit_project_root_wins_and_stays_quiet(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            home = Path(temp_dir) / "home"
            project = Path(temp_dir) / "project"
            skill = home / ".claude" / "skills" / "demo-skill"
            write(skill / "customize.toml", facts("shipped default"))
            write(home / "_bmad" / "custom" / "demo-skill.toml", facts("home override"))
            (project / "_bmad" / "custom").mkdir(parents=True)

            result = resolve(skill, project, "--project-root", str(home))

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            resolved = json.loads(result.stdout)["workflow"]["persistent_facts"]
            self.assertEqual(resolved, ["shipped default", "home override"])
            self.assertEqual(result.stderr, "")


if __name__ == "__main__":
    unittest.main()
