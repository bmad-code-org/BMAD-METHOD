import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import knowledge  # noqa: E402

SOURCE = "github:acme/tools/skills"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def template(key: str, value: str, *extra: str) -> str:
    return "\n".join(["---", f"{key}: {value}", 'description: "When to use it"', *extra, "---", "", "# Title", ""])


class ModuleTemplatesTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name) / "skills"
        record = self.root / "bmod-demo"
        write(
            record / "bmod.toml",
            f'[bmod]\ncode = "demo"\nversion = "1.0.0"\nupdate_source = "{SOURCE}"\nskills = ["demo-agent"]\n',
        )
        self.record = record
        self.agent = self.root / "demo-agent"
        write(self.agent / "bmod.toml", f'[skill]\nbmod = "bmod-demo"\nsource = "{SOURCE}"\n')

    def templates(self) -> list[dict[str, object]]:
        return knowledge.collect([self.root])["templates"]

    def test_a_record_template_lists_its_agents_and_description(self) -> None:
        write(
            self.record / "doc-templates" / "shared.md",
            template("template", "shared", "version: 1.2.0", 'agents: [demo-agent, "other-agent"]'),
        )
        listed = self.templates()
        self.assertEqual(len(listed), 1)
        self.assertEqual(listed[0]["module"], "demo")
        self.assertEqual(listed[0]["id"], "shared")
        self.assertEqual(listed[0]["version"], "1.2.0")
        self.assertEqual(listed[0]["description"], "When to use it")
        self.assertEqual(listed[0]["agents"], ["demo-agent", "other-agent"])

    def test_only_the_short_fields_are_listed(self) -> None:
        write(self.record / "doc-templates" / "open.md", template("template", "open", 'not_for: "Long detail."'))
        self.assertEqual(self.templates(), [{"module": "demo", "id": "open", "description": "When to use it"}])

    def test_a_template_in_a_skills_assets_belongs_to_that_skill(self) -> None:
        write(self.agent / "assets" / "template-own.md", template("template", "own"))
        self.assertEqual(self.templates()[0]["agents"], ["demo-agent"])

    def test_an_extension_is_listed_by_what_it_extends(self) -> None:
        write(self.record / "doc-templates" / "more.md", template("extends", "shared"))
        listed = self.templates()[0]
        self.assertEqual(listed["extends"], "shared")
        self.assertNotIn("id", listed)

    def test_other_files_are_left_out(self) -> None:
        write(self.agent / "assets" / "notes.md", "# Notes\n")
        write(self.record / "doc-templates" / "rubric-demo.md", "Rate each one.\n")
        self.assertEqual(self.templates(), [])

    def test_an_unreadable_template_is_a_problem_not_a_crash(self) -> None:
        write(self.record / "doc-templates" / "large.md", "x" * (knowledge.READ_LIMIT + 1))
        report = knowledge.collect([self.root])
        self.assertEqual(report["templates"], [])
        self.assertTrue(any("large.md" in str(problem["problem"]) for problem in report["problems"]))


if __name__ == "__main__":
    unittest.main()
