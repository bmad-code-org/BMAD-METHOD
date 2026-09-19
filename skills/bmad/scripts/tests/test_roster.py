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


def write_skill(root: Path, name: str, *, module: str = "demo", roster_text: str | None = ROSTER) -> Path:
    folder = root / name
    (folder / "bmad-meta").mkdir(parents=True)
    lines = [f'module = "{module}"', 'version = "1.0.0"', f'update_source = "{SOURCE}"', 'knowledge = ["help.md"]']
    if roster_text is not None:
        lines.append('roster = ["bmad-meta/roster.toml"]')
        (folder / "bmad-meta" / "roster.toml").write_text(roster_text, encoding="utf-8")
    (folder / "module-manifest.toml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (folder / "help.md").write_text("help\n", encoding="utf-8")
    return folder


class RosterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.project = Path(self.temp.name)
        self.skills = self.project / ".claude" / "skills"

    def test_only_members_whose_skill_is_installed_are_agents(self):
        ann = write_skill(self.skills, "demo-agent-ann")
        (ann / "customize.toml").write_text('[agent]\nname = "Ann"\n', encoding="utf-8")
        report = roster.collect([self.skills])
        self.assertEqual(list(report["agents"]), ["demo-agent-ann"])
        self.assertEqual(set(report["members"]), {"demo-agent-ann", "demo-agent-bob", "guest"})
        self.assertNotIn("installed", report["members"]["guest"])

    def test_an_absent_agent_keeps_its_persona_and_names_its_install_command(self):
        write_skill(self.skills, "demo-workflow")
        bob = roster.collect([self.skills])["members"]["demo-agent-bob"]
        self.assertFalse(bob["installed"])
        self.assertEqual(bob["persona"], "Builds it.")
        self.assertEqual(bob["install"], "npx skills add acme/tools --skill demo-agent-bob")

    def test_an_installed_agent_answers_to_its_customized_name(self):
        ann = write_skill(self.skills, "demo-agent-ann")
        (ann / "customize.toml").write_text('[agent]\nname = "Ann"\ntitle = "Analyst"\n', encoding="utf-8")
        custom = self.project / "_bmad" / "custom"
        custom.mkdir(parents=True)
        (custom / "demo-agent-ann.toml").write_text('[agent]\nname = "Annika"\n', encoding="utf-8")
        agent = roster.collect([self.skills], self.project)["agents"]["demo-agent-ann"]
        self.assertEqual((agent["name"], agent["title"], agent["persona"]), ("Annika", "Analyst", "Asks for evidence."))

    def test_one_roster_carried_by_many_skills_is_read_once(self):
        write_skill(self.skills, "demo-one")
        write_skill(self.skills, "demo-two")
        report = roster.collect([self.skills])
        (found,) = report["rosters"]
        self.assertEqual(found["skills"], ["demo-one", "demo-two"])
        self.assertEqual([group["id"] for group in report["groups"]], ["demo-room"])
        self.assertEqual(report["problems"], [])

    def test_copies_that_disagree_are_reported_as_drift(self):
        write_skill(self.skills, "demo-one")
        write_skill(self.skills, "demo-two", roster_text=ROSTER + "\n# edited\n")
        (found,) = roster.collect([self.skills])["rosters"]
        self.assertEqual(found["drift"], ["demo-two"])

    def test_a_second_module_cannot_redefine_a_member_or_group(self):
        write_skill(self.skills, "demo-one")
        write_skill(self.skills, "other-one", module="other")
        report = roster.collect([self.skills])
        self.assertEqual(report["members"]["guest"]["module"], "demo")
        self.assertEqual(sorted(problem["kind"] for problem in report["problems"]), ["group", "member", "member", "member"])

    def test_central_config_agents_are_laid_over_the_scan(self):
        write_skill(self.skills, "demo-workflow")
        (self.project / "_bmad").mkdir()
        (self.project / "_bmad" / "config.toml").write_text(
            '[agents.my-agent]\nname = "Mine"\ndescription = "From before rosters."\n', encoding="utf-8"
        )
        agent = roster.collect([self.skills], self.project)["agents"]["my-agent"]
        self.assertEqual((agent["name"], agent["persona"], agent["source"]), ("Mine", "From before rosters.", "config"))

    def test_a_roster_path_outside_the_skill_is_refused(self):
        folder = write_skill(self.skills, "demo-one", roster_text=None)
        manifest = folder / "module-manifest.toml"
        manifest.write_text(manifest.read_text(encoding="utf-8") + 'roster = ["../elsewhere.toml"]\n', encoding="utf-8")
        report = roster.collect([self.skills])
        self.assertEqual(report["members"], {})
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["roster"])

    def test_a_skill_without_a_roster_offers_nothing(self):
        write_skill(self.skills, "demo-one", roster_text=None)
        report = roster.collect([self.skills])
        self.assertEqual((report["agents"], report["groups"], report["problems"]), ({}, [], []))


if __name__ == "__main__":
    unittest.main()
