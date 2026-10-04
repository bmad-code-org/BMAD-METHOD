import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPO = Path(__file__).resolve().parents[3]
SCRIPT = REPO / "src" / "scripts" / "render_skill.py"
BUILD_SKILL = REPO / "src" / "bmm-skills" / "ship" / "bmad-build"
BUILD_AUTO_SKILL = REPO / "src" / "bmm-skills" / "ship" / "bmad-build-auto"


class RenderSkillConfigDefaultsTests(unittest.TestCase):
    def test_build_auto_uses_neutral_defaults_when_both_user_values_are_missing(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = self._project(Path(temp_dir))

            result = self._render(root, BUILD_AUTO_SKILL)

            self.assertEqual(result.returncode, 0, msg=result.stdout + result.stderr)
            rendered = self._rendered_workflow(result)
            self.assertIn("Speak in `English`", rendered)
            self.assertIn("tailor communication to `intermediate`", rendered)
            self.assertNotIn("{{.communication_language}}", rendered)
            self.assertNotIn("{{.user_skill_level}}", rendered)

    def test_build_uses_neutral_communication_language_when_missing(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = self._project(Path(temp_dir))

            result = self._render(root, BUILD_SKILL)

            self.assertEqual(result.returncode, 0, msg=result.stdout + result.stderr)
            rendered = self._rendered_workflow(result)
            self.assertIn("Speak in `English`", rendered)
            self.assertNotIn("{{.communication_language}}", rendered)

    def test_build_auto_uses_neutral_skill_level_when_missing(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = self._project(Path(temp_dir), communication_language="French")

            result = self._render(root, BUILD_AUTO_SKILL)

            self.assertEqual(result.returncode, 0, msg=result.stdout + result.stderr)
            rendered = self._rendered_workflow(result)
            self.assertIn("tailor communication to `intermediate`", rendered)
            self.assertNotIn("{{.user_skill_level}}", rendered)

    def test_configured_personal_values_override_neutral_defaults(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = self._project(
                Path(temp_dir),
                communication_language="French",
                user_skill_level="expert",
            )

            result = self._render(root, BUILD_AUTO_SKILL)

            self.assertEqual(result.returncode, 0, msg=result.stdout + result.stderr)
            rendered = self._rendered_workflow(result)
            self.assertIn("Speak in `French`", rendered)
            self.assertIn("tailor communication to `expert`", rendered)

    def test_non_scalar_user_values_fail_instead_of_using_defaults(self):
        invalid_values = (
            ('[core]\ncommunication_language = ["French"]\n', "got list"),
            ('[core.communication_language]\nvalue = "French"\n', "got dict"),
        )
        for config, expected_type in invalid_values:
            with (
                self.subTest(expected_type=expected_type),
                tempfile.TemporaryDirectory() as temp_dir,
            ):
                root = self._project(Path(temp_dir))
                (root / "_bmad" / "config.user.toml").write_text(
                    config, encoding="utf-8"
                )

                result = self._render(root, BUILD_SKILL)

                self.assertNotEqual(result.returncode, 0)
                self.assertIn(f"must be a string, {expected_type}", result.stdout)
                self.assertNotIn("read and follow", result.stdout)

    @staticmethod
    def _project(
        root: Path,
        *,
        communication_language: str | None = None,
        user_skill_level: str | None = None,
    ) -> Path:
        bmad = root / "_bmad"
        bmad.mkdir()
        values = [
            "[core]",
            'project_name = "Fixture"',
            'document_output_language = "English"',
            'output_folder = "{project-root}/_bmad-output"',
            "",
            "[modules.bmm]",
            'planning_artifacts = "{project-root}/_bmad-output/planning-artifacts"',
            'implementation_artifacts = "{project-root}/_bmad-output/implementation-artifacts"',
        ]
        (bmad / "config.toml").write_text("\n".join(values) + "\n", encoding="utf-8")
        user_values = []
        if communication_language is not None:
            user_values.extend(
                ["[core]", f'communication_language = "{communication_language}"']
            )
        if user_skill_level is not None:
            user_values.extend(
                ["[modules.bmm]", f'user_skill_level = "{user_skill_level}"']
            )
        if user_values:
            (bmad / "config.user.toml").write_text(
                "\n".join(user_values) + "\n", encoding="utf-8"
            )
        return root

    @staticmethod
    def _render(root: Path, skill: Path) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "--project-root",
                str(root),
                "--skill",
                str(skill),
            ],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )

    @staticmethod
    def _rendered_workflow(result: subprocess.CompletedProcess[str]) -> str:
        path = Path(result.stdout.removeprefix("read and follow ").strip())
        return "\n".join(
            file.read_text(encoding="utf-8") for file in path.parent.rglob("*.md")
        )


if __name__ == "__main__":
    unittest.main()
