import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import setup_check  # noqa: E402

SOURCE = "github:bmad-code-org/BMAD-METHOD/skills"


def write_manifest(folder: Path, *, module: str, version: str, extra: str = "") -> None:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "help.md").write_text("help\n", encoding="utf-8")
    (folder / "module-manifest.toml").write_text(
        f'module = "{module}"\nversion = "{version}"\nupdate_source = "{SOURCE}"\nknowledge = ["help.md"]\n{extra}',
        encoding="utf-8",
    )


class OwedSetupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name) / "project"
        self.skills = self.project / ".claude" / "skills"
        (self.project / "_bmad").mkdir(parents=True)
        (self.project / "_bmad" / "config.toml").write_text("[core]\n", encoding="utf-8")

    def skill(self, extra: str) -> Path:
        folder = self.skills / "demo-skill"
        write_manifest(folder, module="demo", version="1.0.0", extra=extra)
        return folder

    def test_nothing_is_owed_when_requirements_are_met(self):
        write_manifest(self.skills / "bmad", module="bmad", version="6.13.0")
        folder = self.skill('\n[requires]\nbmad = { version = "6.13.0" }\n')
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_a_skill_without_a_manifest_owes_nothing(self):
        folder = self.skills / "plain-skill"
        folder.mkdir(parents=True)
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_an_older_required_skill_is_reported_with_both_versions(self):
        write_manifest(self.skills / "bmad", module="bmad", version="6.12.0")
        folder = self.skill('\n[requires]\nbmad = { version = "6.13.0" }\n')
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("`bmad` 6.13.0 or later", note)
        self.assertIn("6.12.0 is installed", note)

    def test_the_next_build_of_the_required_version_meets_it(self):
        write_manifest(self.skills / "bmad", module="bmad", version="6.13.0-next")
        folder = self.skill('\n[requires]\nbmad = { version = "6.13.0" }\n')
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_the_next_build_of_an_earlier_version_does_not(self):
        write_manifest(self.skills / "bmad", module="bmad", version="6.12.0-next")
        folder = self.skill('\n[requires]\nbmad = { version = "6.13.0" }\n')
        self.assertEqual(len(setup_check.owed(folder, self.project)), 1)

    def test_a_missing_required_skill_names_its_install_command(self):
        folder = self.skill('\n[requires]\nother-skill = { version = "2.0.0", source = "github:acme/tools/skills" }\n')
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("`npx skills add acme/tools --skill other-skill`", note)

    def test_a_missing_required_skill_defaults_to_the_skills_own_source(self):
        folder = self.skill('\n[requires]\nbmad = { version = "6.13.0" }\n')
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`", note)

    def test_recommended_skills_are_never_reported(self):
        folder = self.skill('\n[recommends]\nother-skill = { version = "2.0.0" }\n')
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_an_unanswered_question_is_reported_and_an_empty_answer_is_not(self):
        question = '\n[[config_questions]]\nkey = "active_initiative"\nprompt = "Active initiative?"\ndefault = ""\n'
        folder = self.skill(question)
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("active_initiative", note)
        self.assertIn("`bmad doctor`", note)

        (self.project / "_bmad" / "config.toml").write_text(
            '[core]\n\n[modules.demo]\nactive_initiative = ""\n', encoding="utf-8"
        )
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_report_stays_silent_when_the_manifest_cannot_be_parsed(self):
        folder = self.skills / "broken-skill"
        folder.mkdir(parents=True)
        (folder / "module-manifest.toml").write_text("not toml [", encoding="utf-8")
        setup_check.report(folder, self.project)


if __name__ == "__main__":
    unittest.main()
