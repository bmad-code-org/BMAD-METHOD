import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import knowledge  # noqa: E402

SOURCE = "github:acme/tools/skills"
MIGRATION = """
[migration]
module = "demo"
from = "1"
to = "2"
title = "Move demo artifacts to the v2 layout"
summary = "v1 to v2"
detect = "a v1 folder"
guide = "move it"
checklist = ["it moved"]
"""


def write_module(root: Path, skills: tuple[str, ...] = (), *, code: str = "demo") -> Path:
    record = root / f"bmod-{code}"
    record.mkdir(parents=True)
    names = ", ".join(f'"{name}"' for name in skills)
    lines = ["[bmod]", f'code = "{code}"', 'version = "1.0.0"', f'update_source = "{SOURCE}"', f"skills = [{names}]"]
    (record / "bmod.toml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    for name in skills:
        folder = root / name
        folder.mkdir(parents=True)
        (folder / "bmod.toml").write_text(f'[skill]\nbmod = "{record.name}"\nsource = "{SOURCE}"\n', encoding="utf-8")
    return record


class MigrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.skills = Path(self.temp.name) / ".claude" / "skills"

    def test_a_migration_file_is_listed_by_its_table_without_its_text(self):
        record = write_module(self.skills, ("demo-one",))
        (record / "v1-v2-migration.toml").write_text(MIGRATION, encoding="utf-8")
        report = knowledge.collect([self.skills])
        self.assertEqual(
            report["migrations"],
            [
                {
                    "module": "demo",
                    "path": "v1-v2-migration.toml",
                    "file": str(record / "v1-v2-migration.toml"),
                    "from": "1",
                    "to": "2",
                    "title": "Move demo artifacts to the v2 layout",
                }
            ],
        )
        self.assertEqual(report["problems"], [])

    def test_other_toml_files_beside_the_record_are_not_migrations_and_a_bad_key_is_named(self):
        record = write_module(self.skills)
        (record / "roster.toml").write_text("[[members]\nnot even toml\n", encoding="utf-8")
        (record / "notes.toml").write_text('migration = "not a table"\n', encoding="utf-8")
        report = knowledge.collect([self.skills])
        self.assertEqual(report["migrations"], [])
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["migration"])
        self.assertIn("'migration' is not a table", report["problems"][0]["problem"])

    def test_a_migration_without_its_fields_is_a_problem_not_a_listing(self):
        record = write_module(self.skills)
        (record / "bad-migration.toml").write_text(
            '[migration]\nmodule = "demo"\nfrom = 1\nto = "2"\n', encoding="utf-8"
        )
        report = knowledge.collect([self.skills])
        self.assertEqual(report["migrations"], [])
        self.assertEqual(len(report["problems"]), 1)
        self.assertEqual(report["problems"][0]["kind"], "migration")
        self.assertIn(
            "needs non-empty from, title, summary, detect, guide, checklist", report["problems"][0]["problem"]
        )

    def test_whitespace_only_fields_and_blank_checklist_items_are_missing(self):
        record = write_module(self.skills)
        text = MIGRATION.replace('guide = "move it"', 'guide = "  "').replace(
            'checklist = ["it moved"]', 'checklist = [" "]'
        )
        (record / "blank-migration.toml").write_text(text, encoding="utf-8")
        report = knowledge.collect([self.skills])
        self.assertEqual(report["migrations"], [])
        self.assertIn("needs non-empty guide, checklist", report["problems"][0]["problem"])

    def test_a_migration_for_another_module_is_a_problem(self):
        record = write_module(self.skills)
        text = MIGRATION.replace('module = "demo"', 'module = "other"')
        (record / "other-migration.toml").write_text(text, encoding="utf-8")
        report = knowledge.collect([self.skills])
        self.assertEqual(report["migrations"], [])
        self.assertIn("is not this record's 'demo'", report["problems"][0]["problem"])

    def test_migrations_are_listed_in_path_order(self):
        record = write_module(self.skills)
        later = MIGRATION.replace('from = "1"', 'from = "2"').replace('to = "2"', 'to = "3"')
        (record / "v2-v3-migration.toml").write_text(later, encoding="utf-8")
        (record / "v1-v2-migration.toml").write_text(MIGRATION, encoding="utf-8")
        report = knowledge.collect([self.skills])
        self.assertEqual([(m["from"], m["to"]) for m in report["migrations"]], [("1", "2"), ("2", "3")])

    def test_a_migration_that_is_not_toml_is_a_problem(self):
        record = write_module(self.skills)
        (record / "broken-migration.toml").write_text('[migration\nfrom = "1"\n', encoding="utf-8")
        report = knowledge.collect([self.skills])
        self.assertEqual(report["migrations"], [])
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["migration"])


if __name__ == "__main__":
    unittest.main()
