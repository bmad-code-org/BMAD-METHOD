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
                capture_output=True,
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
                capture_output=True,
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
        capture_output=True,
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
            self.assertNotIn("note:", result.stderr)


def resolve_with_overrides(layers: dict[str, str], defaults: str = facts("shipped default")):
    with tempfile.TemporaryDirectory() as temp_dir:
        project = Path(temp_dir) / "project"
        skill = project / ".claude" / "skills" / "demo-skill"
        write(skill / "customize.toml", defaults)
        (project / "_bmad" / "custom").mkdir(parents=True)
        for name, body in layers.items():
            write(project / "_bmad" / "custom" / name, body)

        return resolve(skill, project, "--project-root", str(project))


class OverrideAnnouncementTests(unittest.TestCase):
    def announce(self, *layers: str) -> str:
        result = resolve_with_overrides({layer: facts(layer) for layer in layers})
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        return result.stderr

    def test_names_each_override_file_the_skill_runs_with(self):
        self.assertEqual(
            self.announce("demo-skill.toml", "demo-skill.user.toml"),
            "customization: before continuing, tell the user in one line that `demo-skill` runs with overrides from "
            "`_bmad/custom/demo-skill.toml` (team) and `_bmad/custom/demo-skill.user.toml` (personal).\n",
        )

    def test_names_a_lone_personal_override(self):
        self.assertEqual(
            self.announce("demo-skill.user.toml"),
            "customization: before continuing, tell the user in one line that `demo-skill` runs with overrides from "
            "`_bmad/custom/demo-skill.user.toml` (personal).\n",
        )

    def test_stays_quiet_without_an_override_of_this_skill(self):
        self.assertEqual(self.announce("config.user.toml", "other-skill.toml"), "")


class UndeclaredKeyNoteTests(unittest.TestCase):
    DEFAULTS = '[workflow]\nmessage = "shipped"\npersistent_facts = ["shipped default"]\n'

    def resolve(self, layers: dict[str, str]):
        result = resolve_with_overrides(layers, self.DEFAULTS)
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        return result

    def note(self, result) -> list[str]:
        return [line for line in result.stderr.splitlines() if "does not declare" in line]

    def test_names_a_misspelled_key_and_keeps_the_merged_values(self):
        result = self.resolve({"demo-skill.toml": '[workflow]\nmesage = "typo"\n'})

        self.assertEqual(
            self.note(result),
            [
                "customization: before continuing, tell the user in one line that `_bmad/custom/demo-skill.toml` sets "
                "`workflow.mesage`, which `demo-skill` does not declare, so it may ignore it."
            ],
        )
        self.assertEqual(
            json.loads(result.stdout)["workflow"],
            {"message": "shipped", "persistent_facts": ["shipped default"], "mesage": "typo"},
        )

    def test_names_each_file_with_its_own_keys_in_one_line(self):
        result = self.resolve(
            {
                "demo-skill.toml": "[a]\nx = 1\nz = 2\n",
                "demo-skill.user.toml": "[b]\ny = 3\n",
            }
        )

        self.assertEqual(
            self.note(result),
            [
                "customization: before continuing, tell the user in one line that `_bmad/custom/demo-skill.toml` sets "
                "`a.x`, `a.z` and `_bmad/custom/demo-skill.user.toml` sets `b.y`, which `demo-skill` "
                "does not declare, so it may ignore them."
            ],
        )

    def test_checks_the_whole_file_not_only_the_requested_keys(self):
        result = self.resolve({"demo-skill.toml": '[agent]\nname = "stray"\n'})

        self.assertEqual(list(json.loads(result.stdout)), ["workflow"])
        self.assertEqual(len(self.note(result)), 1)
        self.assertIn("`agent.name`", self.note(result)[0])

    def test_items_added_to_a_declared_array_are_not_reported(self):
        result = self.resolve({"demo-skill.toml": facts("team fact")})

        self.assertEqual(self.note(result), [])

    def test_a_key_under_a_declared_scalar_is_reported(self):
        result = self.resolve({"demo-skill.toml": '[workflow.message]\nnested = "deep"\n'})

        self.assertEqual(len(self.note(result)), 1)
        self.assertIn("`workflow.message.nested`", self.note(result)[0])

    def test_stays_quiet_without_an_override(self):
        self.assertEqual(self.resolve({}).stderr, "")


if __name__ == "__main__":
    unittest.main()
