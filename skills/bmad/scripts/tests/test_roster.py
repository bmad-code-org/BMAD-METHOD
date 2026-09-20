import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import roster  # noqa: E402

SOURCE = "github:acme/tools/skills"
ROSTER = """
[[members]]
code = "demo-agent-ann"
skill = "demo-agent-ann"
name = "Ann"
icon = "A"
title = "Analyst"
persona = "Asks for evidence."

[[members]]
code = "demo-agent-bob"
skill = "demo-agent-bob"
name = "Bob"
persona = "Builds it."

[[members]]
code = "guest"
name = "Guest"
persona = "Only in groups."

[[groups]]
id = "demo-room"
name = "Demo Room"
members = ["demo-agent-ann", "demo-agent-bob", "guest"]
"""


def write_skill(root: Path, name: str, *, bmod: str = "bmod-demo") -> Path:
    folder = root / name
    folder.mkdir(parents=True)
    (folder / "bmod.toml").write_text(f'[skill]\nbmod = "{bmod}"\nsource = "{SOURCE}"\n', encoding="utf-8")
    return folder


def write_module(
    root: Path,
    skills: tuple[str, ...] = (),
    *,
    code: str = "demo",
    folder: str | None = None,
    listed: tuple[str, ...] | None = None,
    roster_text: str | None = ROSTER,
) -> Path:
    """Write a module record and the member skill folders in `skills`; `listed` is what the record names."""
    record = root / (folder or f"bmod-{code}")
    record.mkdir(parents=True)
    names = ", ".join(f'"{name}"' for name in (skills if listed is None else listed))
    lines = ["[bmod]", f'code = "{code}"', 'version = "1.0.0"', f'update_source = "{SOURCE}"', f"skills = [{names}]"]
    if roster_text is not None:
        (record / "roster.toml").write_text(roster_text, encoding="utf-8")
    (record / "bmod.toml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    for name in skills:
        write_skill(root, name, bmod=record.name)
    return record


class RosterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name)
        self.skills = self.project / ".claude" / "skills"

    def test_only_members_whose_skill_is_installed_are_agents(self):
        write_module(self.skills, ("demo-agent-ann",), listed=("demo-agent-ann", "demo-agent-bob"))
        (self.skills / "demo-agent-ann" / "customize.toml").write_text('[agent]\nname = "Ann"\n', encoding="utf-8")
        report = roster.collect([self.skills])
        self.assertEqual(list(report["agents"]), ["demo-agent-ann"])
        self.assertEqual(set(report["members"]), {"demo-agent-ann", "demo-agent-bob", "guest"})
        self.assertNotIn("installed", report["members"]["guest"])

    def test_an_absent_agent_keeps_its_persona_and_names_its_install_command(self):
        write_module(self.skills, ("demo-workflow",))
        bob = roster.collect([self.skills])["members"]["demo-agent-bob"]
        self.assertFalse(bob["installed"])
        self.assertEqual(bob["persona"], "Builds it.")
        self.assertEqual(bob["install"], "npx skills add acme/tools --skill demo-agent-bob")

    def test_an_installed_agent_answers_to_its_customized_name(self):
        write_module(self.skills, ("demo-agent-ann",))
        (self.skills / "demo-agent-ann" / "customize.toml").write_text(
            '[agent]\nname = "Ann"\ntitle = "Analyst"\n', encoding="utf-8"
        )
        custom = self.project / "_bmad" / "custom"
        custom.mkdir(parents=True)
        (custom / "demo-agent-ann.toml").write_text('[agent]\nname = "Annika"\n', encoding="utf-8")
        agent = roster.collect([self.skills], self.project)["agents"]["demo-agent-ann"]
        self.assertEqual((agent["name"], agent["title"], agent["persona"]), ("Annika", "Analyst", "Asks for evidence."))

    def test_a_roster_is_read_from_the_record_and_lists_the_installed_member_skills(self):
        write_module(self.skills, ("demo-one", "demo-two"), listed=("demo-one", "demo-two", "demo-absent"))
        report = roster.collect([self.skills])
        self.assertEqual(
            report["rosters"], [{"module": "demo", "path": "roster.toml", "skills": ["demo-one", "demo-two"]}]
        )
        self.assertEqual([group["id"] for group in report["groups"]], ["demo-room"])
        self.assertEqual(report["problems"], [])

    def test_a_module_with_no_skills_still_offers_its_roster(self):
        write_module(self.skills)
        report = roster.collect([self.skills])
        self.assertEqual(report["rosters"], [{"module": "demo", "path": "roster.toml", "skills": []}])
        self.assertEqual(set(report["members"]), {"demo-agent-ann", "demo-agent-bob", "guest"})
        self.assertEqual((report["agents"], report["problems"]), ({}, []))

    def test_a_single_skill_module_is_its_own_member(self):
        folder = self.skills / "demo-agent-ann"
        folder.mkdir(parents=True)
        (folder / "bmod.toml").write_text(
            f'[bmod]\ncode = "solo"\nversion = "1.0.0"\nupdate_source = "{SOURCE}"\n\n[skill]\n',
            encoding="utf-8",
        )
        (folder / "roster.toml").write_text(ROSTER, encoding="utf-8")
        report = roster.collect([self.skills])
        self.assertEqual(report["rosters"], [{"module": "solo", "path": "roster.toml", "skills": ["demo-agent-ann"]}])
        self.assertEqual(list(report["agents"]), ["demo-agent-ann"])
        self.assertEqual(report["problems"], [])

    def test_a_record_is_found_whatever_its_folder_is_called(self):
        write_module(self.skills, ("demo-agent-ann",), folder="demo-record")
        report = roster.collect([self.skills])
        self.assertEqual(list(report["agents"]), ["demo-agent-ann"])
        self.assertEqual(report["problems"], [])

    def test_a_second_record_for_a_code_is_a_problem_and_the_first_wins(self):
        write_module(self.skills, ("demo-one",), folder="a-record")
        write_module(self.skills, ("demo-two",), folder="b-record", roster_text='[[members]]\ncode = "late"\n')
        report = roster.collect([self.skills])
        self.assertNotIn("late", report["members"])
        self.assertEqual([found["skills"] for found in report["rosters"]], [["demo-one"]])
        self.assertEqual(
            [(problem["kind"], problem["skill"]) for problem in report["problems"]], [("module", "b-record")]
        )

    def test_a_member_skill_whose_record_is_absent_is_a_problem(self):
        write_skill(self.skills, "demo-agent-ann")
        report = roster.collect([self.skills])
        self.assertEqual((report["agents"], report["members"], report["rosters"]), ({}, {}, []))
        (problem,) = report["problems"]
        self.assertEqual(
            (problem["kind"], problem["bmod"], problem["skills"]), ("module", "bmod-demo", ["demo-agent-ann"])
        )
        self.assertEqual(problem["install"], "npx skills add acme/tools --skill bmod-demo")

    def test_a_second_module_cannot_redefine_a_member_or_group(self):
        write_module(self.skills, ("demo-one",))
        write_module(self.skills, ("other-one",), code="other")
        report = roster.collect([self.skills])
        self.assertEqual(report["members"]["guest"]["module"], "demo")
        self.assertEqual(
            sorted(problem["kind"] for problem in report["problems"]), ["group", "member", "member", "member"]
        )

    def test_central_config_agents_are_laid_over_the_scan(self):
        write_module(self.skills, ("demo-workflow",))
        (self.project / "_bmad").mkdir()
        (self.project / "_bmad" / "config.toml").write_text(
            '[agents.my-agent]\nname = "Mine"\ndescription = "From before rosters."\n', encoding="utf-8"
        )
        agent = roster.collect([self.skills], self.project)["agents"]["my-agent"]
        self.assertEqual((agent["name"], agent["persona"], agent["source"]), ("Mine", "From before rosters.", "config"))

    def test_a_recorded_agent_whose_skill_was_removed_stays_out_of_the_default_room(self):
        write_module(self.skills, ("demo-agent-ann",))
        (self.project / "_bmad").mkdir()
        (self.project / "_bmad" / "config.toml").write_text(
            '[agents.demo-agent-ann]\nteam = "crew"\n\n[agents.demo-agent-bob]\nname = "Bob"\n', encoding="utf-8"
        )
        agents = roster.collect([self.skills], self.project)["agents"]
        self.assertEqual(sorted(agents), ["demo-agent-ann"])
        self.assertEqual(agents["demo-agent-ann"]["team"], "crew")

    def test_config_does_not_replace_a_roster_agents_name_or_module(self):
        write_module(self.skills, ("demo-agent-ann",))
        (self.project / "_bmad").mkdir()
        (self.project / "_bmad" / "config.toml").write_text(
            '[agents.demo-agent-ann]\nmodule = "old"\nname = "Recorded"\nteam = "crew"\n', encoding="utf-8"
        )
        agent = roster.collect([self.skills], self.project)["agents"]["demo-agent-ann"]
        self.assertEqual((agent["module"], agent["team"]), ("demo", "crew"))
        self.assertNotEqual(agent["name"], "Recorded")

    def test_a_roster_key_in_the_record_is_ignored(self):
        record = write_module(self.skills, ("demo-one",), roster_text=None)
        text = (record / "bmod.toml").read_text(encoding="utf-8")
        (record / "bmod.toml").write_text(text + 'roster = ["other.toml"]\n', encoding="utf-8")
        (record / "other.toml").write_text(ROSTER, encoding="utf-8")
        report = roster.collect([self.skills])
        self.assertEqual((report["members"], report["rosters"], report["problems"]), ({}, [], []))

    def test_a_roster_that_links_outside_the_record_folder_is_refused(self):
        record = write_module(self.skills, ("demo-one",))
        (self.skills / "demo-one" / "elsewhere.toml").write_text(ROSTER, encoding="utf-8")
        (record / "roster.toml").unlink()
        try:
            (record / "roster.toml").symlink_to(self.skills / "demo-one" / "elsewhere.toml")
        except OSError:
            self.skipTest("symlinks are not available")
        report = roster.collect([self.skills])
        self.assertEqual(report["members"], {})
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["roster"])

    def test_members_or_groups_that_are_not_lists_are_problems(self):
        write_module(self.skills, ("demo-one",), roster_text='members = "ann"\n\n[groups]\nid = "room"\n')
        report = roster.collect([self.skills])
        self.assertEqual((report["members"], report["groups"]), ({}, []))
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["roster", "roster"])

    def test_a_module_without_a_roster_offers_nothing(self):
        write_module(self.skills, ("demo-one",), roster_text=None)
        report = roster.collect([self.skills])
        self.assertEqual((report["agents"], report["groups"], report["problems"]), ({}, [], []))


if __name__ == "__main__":
    unittest.main()
