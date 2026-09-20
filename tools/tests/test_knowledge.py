import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
KNOWLEDGE_PY = REPO_ROOT / "skills" / "bmad" / "scripts" / "knowledge.py"
SOURCE = "github:acme/tools/skills"


def load_knowledge():
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location("bmad_knowledge", KNOWLEDGE_PY)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def knowledge_entry(path: str, skills: object = None) -> str:
    lines = ["[[bmod.knowledge]]", f"path = {json.dumps(path)}"]
    if skills is not None:
        lines.append(f"skills = {json.dumps(skills)}")
    return "\n".join(lines) + "\n"


def make_skill(root: Path, skill: str, bmod: str) -> None:
    write(root / skill / "bmod.toml", f'[skill]\nbmod = "{bmod}"\nsource = "{SOURCE}"\n')


def make_module(
    root: Path,
    code: str,
    skills: list[str],
    docs: dict[str, object],
    *,
    folder: str | None = None,
    installed: list[str] | None = None,
) -> Path:
    """Write a module record, its documents, and its installed member skills.

    `docs` maps a document path to the entry's `skills` value; None leaves the key out.
    """
    folder = folder or f"bmod-{code}"
    record = (
        f'[bmod]\ncode = "{code}"\nversion = "1.0.0"\nupdate_source = "{SOURCE}"\nskills = {json.dumps(skills)}\n\n'
    )
    write(root / folder / "bmod.toml", record + "\n".join(knowledge_entry(path, docs[path]) for path in docs))
    for path in docs:
        write(root / folder / path, f"# {code} {path}\n")
    for skill in skills if installed is None else installed:
        make_skill(root, skill, folder)
    return root / folder


class KnowledgeCollectionTests(unittest.TestCase):
    def setUp(self):
        self.knowledge = load_knowledge()
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name) / "skills"
        self.root.mkdir(parents=True)
        self.addCleanup(self.tmp.cleanup)

    def documents(self, report):
        return {(item["module"], item["path"]): item for item in report["documents"]}

    def test_a_document_is_reported_once_with_the_modules_skills(self):
        make_module(self.root, "alpha", ["a-1", "a-2", "a-3"], {"module-help.md": "*"})

        report = self.knowledge.collect([self.root])

        self.assertEqual(len(report["documents"]), 1)
        document = report["documents"][0]
        self.assertEqual(document["skills"], ["a-1", "a-2", "a-3"])
        self.assertEqual(document["installed_skills"], ["a-1", "a-2", "a-3"])
        self.assertEqual(document["reported_from"], "bmod-alpha")
        self.assertEqual(report["problems"], [])

    def test_same_filename_in_two_modules_stays_two_documents(self):
        make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*"})
        make_module(self.root, "beta", ["b-1"], {"module-help.md": "*"})

        report = self.knowledge.collect([self.root])

        self.assertEqual(len(report["documents"]), 2)
        documents = self.documents(report)
        self.assertEqual(documents[("alpha", "module-help.md")]["skills"], ["a-1"])
        self.assertEqual(documents[("beta", "module-help.md")]["skills"], ["b-1"])

    def test_a_named_skills_list_limits_a_document_and_a_star_or_no_key_covers_the_module(self):
        make_module(self.root, "alpha", ["a-1", "a-2"], {"module-help.md": "*", "foo-help.md": ["a-2"], "bar.md": None})

        documents = self.documents(self.knowledge.collect([self.root]))

        self.assertEqual(documents[("alpha", "module-help.md")]["skills"], ["a-1", "a-2"])
        self.assertEqual(documents[("alpha", "bar.md")]["skills"], ["a-1", "a-2"])
        self.assertEqual(documents[("alpha", "foo-help.md")]["skills"], ["a-2"])

    def test_installed_skills_are_the_listed_skills_whose_folder_exists(self):
        make_module(self.root, "alpha", ["a-1", "a-2"], {"module-help.md": "*"}, installed=["a-2"])

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"][0]["skills"], ["a-1", "a-2"])
        self.assertEqual(report["documents"][0]["installed_skills"], ["a-2"])
        self.assertEqual([item["skill"] for item in report["skills"]], ["a-2"])
        self.assertEqual(report["problems"], [])

    def test_a_single_skill_module_is_its_own_one_member(self):
        write(
            self.root / "changelog" / "bmod.toml",
            f'[bmod]\ncode = "notes"\nversion = "1.0.0"\nupdate_source = "{SOURCE}"\n\n[skill]\n',
        )
        write(self.root / "changelog" / "help" / "help.md", "# notes\n")

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"][0]["skills"], ["changelog"])
        self.assertEqual(report["documents"][0]["installed_skills"], ["changelog"])
        (skill,) = report["skills"]
        self.assertEqual((skill["skill"], skill["module"], skill["bmod"]), ("changelog", "notes", "changelog"))
        self.assertEqual(report["problems"], [])

    def test_a_record_is_found_whatever_its_folder_is_called(self):
        make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*"}, folder="alpha-record")

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"][0]["reported_from"], "alpha-record")
        self.assertEqual(report["skills"][0]["module"], "alpha")
        self.assertEqual(report["problems"], [])

    def test_a_second_record_for_a_code_is_a_problem_and_the_first_wins(self):
        make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*"}, folder="a-record")
        make_module(self.root, "alpha", ["a-2"], {"other-help.md": "*"}, folder="b-record")

        report = self.knowledge.collect([self.root])

        self.assertEqual([item["path"] for item in report["documents"]], ["module-help.md"])
        (problem,) = report["problems"]
        self.assertEqual((problem["kind"], problem["skill"]), ("module", "b-record"))

    def test_a_skill_whose_record_is_absent_has_no_module_and_names_the_install_command(self):
        make_skill(self.root, "a-1", "bmod-alpha")
        make_skill(self.root, "a-2", "bmod-alpha")

        report = self.knowledge.collect([self.root])

        self.assertEqual([(item["skill"], item["module"]) for item in report["skills"]], [("a-1", None), ("a-2", None)])
        (problem,) = report["problems"]
        self.assertEqual(
            (problem["kind"], problem["bmod"], problem["skills"]), ("module", "bmod-alpha", ["a-1", "a-2"])
        )
        self.assertEqual(problem["install"], "npx skills add acme/tools --skill bmod-alpha")
        self.assertTrue(problem["problem"].endswith("install it with `npx skills add acme/tools --skill bmod-alpha`"))

    def test_a_named_record_folder_with_no_usable_record_offers_no_install_command(self):
        make_skill(self.root, "a-1", "bmod-alpha")
        write(self.root / "bmod-alpha" / "SKILL.md", "# no record here\n")

        report = self.knowledge.collect([self.root])

        self.assertIsNone(report["skills"][0]["module"])
        (problem,) = report["problems"]
        self.assertEqual((problem["kind"], problem["bmod"]), ("module", "bmod-alpha"))
        self.assertIn("has no usable module record", problem["problem"])
        self.assertNotIn("install", problem)

    def test_a_skill_that_names_no_record_is_a_problem(self):
        write(self.root / "a-1" / "bmod.toml", f'[skill]\nsource = "{SOURCE}"\n')

        report = self.knowledge.collect([self.root])

        self.assertEqual((report["skills"][0]["module"], report["skills"][0]["bmod"]), (None, None))
        (problem,) = report["problems"]
        self.assertEqual((problem["kind"], problem["skill"]), ("manifest", "a-1"))

    def test_a_skills_value_of_the_wrong_type_drops_the_document(self):
        make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*", "bad.md": "a-1", "worse.md": [1]})

        report = self.knowledge.collect([self.root])

        self.assertEqual([item["path"] for item in report["documents"]], ["module-help.md"])
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["knowledge", "knowledge"])

    def test_help_md_is_read_with_no_entry_and_covers_every_skill(self):
        folder = make_module(self.root, "alpha", ["a-1", "a-2"], {"extra.md": ["a-2"]})
        write(folder / "help" / "help.md", "# alpha help\n")

        report = self.knowledge.collect([self.root], include_content=True)

        documents = self.documents(report)
        self.assertEqual(sorted(documents), [("alpha", "extra.md"), ("alpha", "help/help.md")])
        self.assertEqual(documents[("alpha", "help/help.md")]["skills"], ["a-1", "a-2"])
        self.assertEqual(documents[("alpha", "help/help.md")]["content"], "# alpha help\n")
        self.assertEqual(report["problems"], [])

    def test_a_module_without_help_md_offers_no_document_and_no_problem(self):
        make_module(self.root, "alpha", ["a-1"], {})

        report = self.knowledge.collect([self.root])

        self.assertEqual((report["documents"], report["problems"]), ([], []))

    def test_an_entry_naming_help_md_is_reported_and_the_file_is_read_once(self):
        make_module(self.root, "alpha", ["a-1", "a-2"], {"help/help.md": ["a-1"]})

        report = self.knowledge.collect([self.root])

        self.assertEqual([item["skills"] for item in report["documents"]], [["a-1", "a-2"]])
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["knowledge"])

    def test_topic_files_are_listed_with_their_path_and_never_their_text(self):
        folder = make_module(self.root, "alpha", ["a-1"], {})
        write(folder / "help" / "help.md", "# help\n")
        write(folder / "help" / "deep-dive.md", "# deep dive\n")
        write(folder / "help" / "notes.txt", "not a topic\n")

        report = self.knowledge.collect([self.root], include_content=True)

        self.assertEqual(
            report["topics"],
            [
                {
                    "module": "alpha",
                    "topic": "deep-dive",
                    "path": "help/deep-dive.md",
                    "file": str(folder / "help" / "deep-dive.md"),
                }
            ],
        )
        self.assertEqual([item["path"] for item in report["documents"]], ["help/help.md"])
        self.assertEqual(report["problems"], [])

    def test_a_help_file_named_as_a_knowledge_document_is_not_also_a_topic(self):
        make_module(self.root, "alpha", ["a-1"], {"help/extra.md": "*"})

        report = self.knowledge.collect([self.root])

        self.assertEqual([item["path"] for item in report["documents"]], ["help/extra.md"])
        self.assertEqual(report["topics"], [])

    def test_a_topic_that_links_outside_the_record_is_a_problem_and_not_listed(self):
        folder = make_module(self.root, "alpha", ["a-1"], {})
        write(self.root / "elsewhere.md", "# elsewhere\n")
        (folder / "help").mkdir()
        try:
            (folder / "help" / "leak.md").symlink_to(self.root / "elsewhere.md")
        except OSError:
            self.skipTest("symlinks are not available")

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["topics"], [])
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["document"])

    def test_a_path_named_twice_is_reported_and_the_first_entry_is_kept(self):
        make_module(self.root, "alpha", ["a-1", "a-2"], {"module-help.md": ["a-1"]})
        record = self.root / "bmod-alpha" / "bmod.toml"
        write(record, record.read_text(encoding="utf-8") + "\n" + knowledge_entry("./module-help.md", ["a-2"]))

        report = self.knowledge.collect([self.root])

        self.assertEqual([item["skills"] for item in report["documents"]], [["a-1"]])
        (problem,) = report["problems"]
        self.assertEqual(problem["kind"], "knowledge")
        self.assertIn("twice", problem["problem"])

    def test_a_url_is_reported_as_a_problem_not_read_as_a_path(self):
        make_module(self.root, "alpha", ["a-1"], {})
        record = self.root / "bmod-alpha" / "bmod.toml"
        write(record, record.read_text(encoding="utf-8") + knowledge_entry("https://example.com/help.md"))

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"], [])
        self.assertEqual(len(report["problems"]), 1)
        self.assertIn("unsafe path", report["problems"][0]["problem"])

    def test_traversal_is_refused(self):
        make_module(self.root, "alpha", ["a-1"], {})
        record = self.root / "bmod-alpha" / "bmod.toml"
        write(record, record.read_text(encoding="utf-8") + knowledge_entry("../escape.md"))
        write(self.root / "escape.md", "# escaped\n")

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"], [])
        self.assertIn("unsafe path", report["problems"][0]["problem"])

    def test_a_document_that_links_outside_the_record_folder_is_refused(self):
        folder = make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*"})
        write(self.root / "a-1" / "secret.md", "# elsewhere\n")
        (folder / "module-help.md").unlink()
        try:
            (folder / "module-help.md").symlink_to(self.root / "a-1" / "secret.md")
        except OSError:
            self.skipTest("symlinks are not available")

        report = self.knowledge.collect([self.root], include_content=True)

        self.assertEqual(report["documents"], [])
        self.assertEqual([problem["kind"] for problem in report["problems"]], ["document"])

    def test_a_named_document_that_is_absent_is_a_problem(self):
        folder = make_module(self.root, "alpha", ["a-1"], {"absent.md": "*"})
        (folder / "absent.md").unlink()

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"], [])
        self.assertEqual(len(report["problems"]), 1)

    def test_an_unreadable_file_is_named_and_the_rest_continue(self):
        make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*"})
        write(self.root / "a-2" / "bmod.toml", "[skill\n")

        report = self.knowledge.collect([self.root])

        self.assertEqual(len(report["documents"]), 1)
        self.assertEqual(report["problems"][0]["skill"], "a-2")

    def test_a_folder_without_a_bmod_file_is_ignored(self):
        make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*"})
        write(self.root / "not-a-skill" / "SKILL.md", "# nope\n")

        report = self.knowledge.collect([self.root])

        self.assertEqual([item["skill"] for item in report["skills"]], ["a-1"])
        self.assertEqual(report["problems"], [])

    def test_the_first_root_shadows_later_ones(self):
        other = Path(self.tmp.name) / "user-skills"
        other.mkdir()
        make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*"})
        user = make_module(other, "alpha", ["a-1"], {"module-help.md": "*"})
        write(user / "module-help.md", "# user\n")

        report = self.knowledge.collect([self.root, other], include_content=True)

        self.assertEqual(len(report["skills"]), 1)
        self.assertEqual(report["skills"][0]["root"], str(self.root))
        self.assertEqual(report["documents"][0]["content"], "# alpha module-help.md\n")
        self.assertEqual(report["problems"], [])

    def test_a_record_in_one_root_covers_its_skills_in_another(self):
        other = Path(self.tmp.name) / "user-skills"
        other.mkdir()
        make_module(other, "alpha", ["a-1"], {"module-help.md": "*"}, installed=[])
        make_skill(self.root, "a-1", "bmod-alpha")

        report = self.knowledge.collect([self.root, other])

        self.assertEqual(report["skills"][0]["module"], "alpha")
        self.assertEqual(report["documents"][0]["installed_skills"], ["a-1"])
        self.assertEqual(report["problems"], [])

    def test_content_is_returned_on_request(self):
        make_module(self.root, "alpha", ["a-1"], {"module-help.md": "*"})

        self.assertNotIn("content", self.knowledge.collect([self.root])["documents"][0])
        report = self.knowledge.collect([self.root], include_content=True)

        self.assertEqual(report["documents"][0]["content"], "# alpha module-help.md\n")


if __name__ == "__main__":
    unittest.main()
