import io
import sys
import tempfile
import unittest
from contextlib import redirect_stderr
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import setup_check  # noqa: E402

SOURCE = "github:bmad-code-org/BMAD-METHOD/skills"
REQUIRES_BMAD = f'required_skills = [{{ skill = "bmad", version = "6.13.0", source = "{SOURCE}" }}]\n'


def write_bmod(folder: Path, *, code: str, version: str, skills: list[str], extra: str = "") -> None:
    folder.mkdir(parents=True, exist_ok=True)
    listed = ", ".join(f'"{name}"' for name in skills)
    (folder / "bmod.toml").write_text(
        f'[bmod]\ncode = "{code}"\nversion = "{version}"\nupdate_source = "{SOURCE}"\nskills = [{listed}]\n{extra}',
        encoding="utf-8",
    )


def write_skill(folder: Path, *, bmod: str, source: str = SOURCE, extra: str = "") -> None:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "bmod.toml").write_text(f'[skill]\nbmod = "{bmod}"\nsource = "{source}"\n{extra}', encoding="utf-8")


class OwedSetupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name) / "project"
        self.skills = self.project / ".claude" / "skills"
        (self.project / "_bmad").mkdir(parents=True)
        (self.project / "_bmad" / "config.toml").write_text("[core]\n", encoding="utf-8")

    def hub(self, version: str) -> None:
        write_bmod(self.skills / "bmod-core-tools", code="core-tools", version=version, skills=["bmad"])
        write_skill(self.skills / "bmad", bmod="bmod-core-tools")

    def skill(self, *, module_extra: str = "", skill_extra: str = "") -> Path:
        write_bmod(self.skills / "bmod-demo", code="demo", version="1.0.0", skills=["demo-skill"], extra=module_extra)
        folder = self.skills / "demo-skill"
        write_skill(folder, bmod="bmod-demo", extra=skill_extra)
        return folder

    def test_nothing_is_owed_when_requirements_are_met(self):
        self.hub("6.13.0")
        folder = self.skill(module_extra=REQUIRES_BMAD)
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_a_skill_without_a_bmod_file_owes_nothing(self):
        folder = self.skills / "plain-skill"
        folder.mkdir(parents=True)
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_a_module_record_owes_nothing(self):
        self.skill(module_extra=REQUIRES_BMAD)
        self.assertEqual(setup_check.owed(self.skills / "bmod-demo", self.project), [])

    def test_a_missing_module_record_is_named_with_its_install_command(self):
        folder = self.skills / "demo-skill"
        write_skill(folder, bmod="bmod-demo", source="github:acme/demo/skills")
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("`bmod-demo`", note)
        self.assertIn("`npx skills add acme/demo --skill bmod-demo`", note)

    def test_a_skill_without_its_record_still_reports_its_own_requirements(self):
        folder = self.skills / "demo-skill"
        write_skill(folder, bmod="bmod-demo", extra='required_skills = ["other-skill"]\n')
        record, requirement = setup_check.owed(folder, self.project)
        self.assertIn("`bmod-demo`", record)
        self.assertIn("`npx skills add bmad-code-org/BMAD-METHOD --skill other-skill`", requirement)

    def test_an_older_required_skill_is_reported_with_both_versions(self):
        self.hub("6.12.0")
        folder = self.skill(module_extra=REQUIRES_BMAD)
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("`bmad` 6.13.0 or later", note)
        self.assertIn("6.12.0 is installed", note)

    def test_the_next_build_of_the_required_version_meets_it(self):
        self.hub("6.13.0-next")
        folder = self.skill(module_extra=REQUIRES_BMAD)
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_the_next_build_of_an_earlier_version_does_not(self):
        self.hub("6.12.0-next")
        folder = self.skill(module_extra=REQUIRES_BMAD)
        self.assertEqual(len(setup_check.owed(folder, self.project)), 1)

    def test_a_required_skill_without_its_module_record_is_not_called_outdated(self):
        write_skill(self.skills / "bmad", bmod="bmod-core-tools")
        folder = self.skill(module_extra=REQUIRES_BMAD)
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_a_required_skill_with_no_bmod_file_is_reported_with_an_unreadable_version(self):
        (self.skills / "bmad").mkdir(parents=True)
        folder = self.skill(module_extra=REQUIRES_BMAD)
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("version cannot be read", note)
        self.assertIn("npx skills update", note)

    def test_a_requirement_may_carry_no_version(self):
        (self.skills / "other-skill").mkdir(parents=True)
        folder = self.skill(skill_extra='required_skills = ["other-skill"]\n')
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_the_modules_requirements_and_the_skills_own_are_both_checked(self):
        folder = self.skill(
            module_extra='required_skills = ["module-need"]\n',
            skill_extra='required_skills = ["skill-need", "module-need"]\n',
        )
        notes = setup_check.owed(folder, self.project)
        self.assertEqual(len(notes), 2)
        self.assertIn("`module-need`", notes[0])
        self.assertIn("`skill-need`", notes[1])

    def test_a_skill_required_by_both_lists_is_held_to_the_higher_minimum(self):
        self.hub("6.13.0")
        higher = f'required_skills = [{{ skill = "bmad", version = "6.14.0", source = "{SOURCE}" }}]\n'
        for module_extra, skill_extra in (
            (REQUIRES_BMAD, higher),
            (higher, REQUIRES_BMAD),
            ('required_skills = ["bmad"]\n', higher),
        ):
            with self.subTest(module=module_extra):
                folder = self.skill(module_extra=module_extra, skill_extra=skill_extra)
                (note,) = setup_check.owed(folder, self.project)
                self.assertIn("`bmad` 6.14.0 or later", note)

    def test_a_requirement_that_names_the_skill_itself_is_skipped(self):
        folder = self.skill(module_extra='required_skills = ["demo-skill"]\n')
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_a_missing_required_skill_names_its_install_command(self):
        folder = self.skill(
            skill_extra='required_skills = [{ skill = "other-skill", version = "2.0.0", source = "github:acme/tools/skills" }]\n'
        )
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("`npx skills add acme/tools --skill other-skill`", note)

    def test_a_missing_required_skill_defaults_to_the_declaring_files_source(self):
        folder = self.skill(skill_extra='required_skills = ["bmad"]\n')
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`", note)

    def test_recommended_skills_are_never_reported(self):
        folder = self.skill(
            module_extra='recommended_skills = ["module-extra"]\n',
            skill_extra='recommended_skills = ["other-skill"]\n',
        )
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_an_unanswered_question_is_reported_and_an_empty_answer_is_not(self):
        question = (
            '\n[[bmod.config_questions]]\nkey = "active_initiative"\nprompt = "Active initiative?"\ndefault = ""\n'
        )
        folder = self.skill(module_extra=question)
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("active_initiative", note)
        self.assertIn("`bmad setup`", note)

        (self.project / "_bmad" / "config.toml").write_text(
            '[core]\n\n[modules.demo]\nactive_initiative = ""\n', encoding="utf-8"
        )
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_a_user_question_is_answered_by_the_users_own_file(self):
        question = (
            '\n[[bmod.config_questions]]\nkey = "note_style"\nscope = "user"\nprompt = "Style?"\ndefault = "bullets"\n'
        )
        folder = self.skill(module_extra=question)
        self.assertEqual(len(setup_check.owed(folder, self.project)), 1)

        custom = self.project / "_bmad" / "custom"
        custom.mkdir()
        (custom / "config.user.toml").write_text('[modules.demo]\nnote_style = "prose"\n', encoding="utf-8")
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_a_missing_or_stale_placed_script_is_reported(self):
        folder = self.skill(skill_extra='scripts = ["scripts/tool.py"]\n')
        (folder / "scripts").mkdir()
        (folder / "scripts" / "tool.py").write_bytes(b"new\n")
        (note,) = setup_check.owed(folder, self.project)
        self.assertIn("`_bmad/demo/scripts/`", note)
        self.assertIn("`bmad setup`", note)

        placed = self.project / "_bmad" / "demo" / "scripts" / "tool.py"
        placed.parent.mkdir(parents=True)
        placed.write_bytes(b"old\n")
        self.assertEqual(len(setup_check.owed(folder, self.project)), 1)
        placed.write_bytes(b"new\n")
        self.assertEqual(setup_check.owed(folder, self.project), [])

    def test_a_single_skill_module_reads_both_tables_from_its_own_file(self):
        folder = self.skills / "release-notes"
        folder.mkdir(parents=True)
        (folder / "bmod.toml").write_text(
            '[bmod]\ncode = "notes"\nversion = "1.0.0"\nupdate_source = "github:acme/release-notes"\n'
            'required_skills = ["other-skill"]\n\n'
            '[[bmod.config_questions]]\nkey = "path"\nprompt = "Path?"\ndefault = "x"\n\n[skill]\n',
            encoding="utf-8",
        )
        requirement, question = setup_check.owed(folder, self.project)
        self.assertIn("`npx skills add acme/release-notes --skill other-skill`", requirement)
        self.assertIn("module `notes`", question)

    def test_report_writes_each_note_as_an_instruction(self):
        folder = self.skills / "demo-skill"
        write_skill(folder, bmod="bmod-demo")
        stream = io.StringIO()
        with redirect_stderr(stream):
            setup_check.report(folder, self.project)
        self.assertTrue(stream.getvalue().startswith("setup: before continuing, tell the user that `demo-skill` "))

    def test_report_stays_silent_when_a_bmod_file_cannot_be_parsed(self):
        folder = self.skills / "broken-skill"
        folder.mkdir(parents=True)
        (folder / "bmod.toml").write_text("not toml [", encoding="utf-8")
        stream = io.StringIO()
        with redirect_stderr(stream):
            setup_check.report(folder, self.project)
        self.assertEqual(stream.getvalue(), "")

        write_skill(folder, bmod="bmod-demo")
        (self.skills / "bmod-demo").mkdir()
        (self.skills / "bmod-demo" / "bmod.toml").write_text("not toml [", encoding="utf-8")
        with redirect_stderr(stream):
            setup_check.report(folder, self.project)
        self.assertEqual(stream.getvalue(), "")


if __name__ == "__main__":
    unittest.main()
