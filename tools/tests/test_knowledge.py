import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
KNOWLEDGE_PY = REPO_ROOT / "skills" / "bmad" / "scripts" / "knowledge.py"


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


def make_skill(root: Path, skill: str, module: str, docs: dict[str, str]) -> None:
    entries = ", ".join(f'"{name}"' for name in docs)
    write(
        root / skill / "module-manifest.toml",
        f'module = "{module}"\nversion = "1.0.0"\n'
        f'update_source = "file:skills"\nknowledge = [{entries}]\n',
    )
    for name, content in docs.items():
        write(root / skill / name, content)


class KnowledgeCollectionTests(unittest.TestCase):
    def setUp(self):
        self.knowledge = load_knowledge()
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name) / "skills"
        self.root.mkdir(parents=True)
        self.addCleanup(self.tmp.cleanup)

    def documents(self, report):
        return {(item["module"], item["path"]): item for item in report["documents"]}

    def test_replicated_document_collapses_to_one_with_its_carriers(self):
        for skill in ("a-1", "a-2", "a-3"):
            make_skill(self.root, skill, "alpha", {"module-help.md": "# alpha\n"})

        report = self.knowledge.collect([self.root])

        self.assertEqual(len(report["documents"]), 1)
        document = report["documents"][0]
        self.assertEqual(document["skills"], ["a-1", "a-2", "a-3"])
        self.assertEqual(document["drift"], [])

    def test_same_filename_in_two_modules_stays_two_documents(self):
        make_skill(self.root, "a-1", "alpha", {"module-help.md": "# alpha\n"})
        make_skill(self.root, "b-1", "beta", {"module-help.md": "# beta\n"})

        report = self.knowledge.collect([self.root])

        self.assertEqual(len(report["documents"]), 2)
        documents = self.documents(report)
        self.assertEqual(documents[("alpha", "module-help.md")]["skills"], ["a-1"])
        self.assertEqual(documents[("beta", "module-help.md")]["skills"], ["b-1"])

    def test_skills_of_one_module_may_carry_different_documents(self):
        make_skill(self.root, "a-1", "alpha", {"module-help.md": "# alpha\n"})
        make_skill(self.root, "a-2", "alpha", {"module-help.md": "# alpha\n", "foo-help.md": "# foo\n"})

        report = self.knowledge.collect([self.root])

        documents = self.documents(report)
        self.assertEqual(documents[("alpha", "module-help.md")]["skills"], ["a-1", "a-2"])
        self.assertEqual(documents[("alpha", "foo-help.md")]["skills"], ["a-2"])

    def test_copies_that_disagree_are_reported_as_drift(self):
        make_skill(self.root, "a-1", "alpha", {"module-help.md": "# alpha\n"})
        make_skill(self.root, "a-2", "alpha", {"module-help.md": "# tampered\n"})

        report = self.knowledge.collect([self.root])

        drift = report["documents"][0]["drift"]
        self.assertEqual([item["skill"] for item in drift], ["a-2"])
        self.assertNotEqual(drift[0]["sha256"], report["documents"][0]["sha256"])
        # The disagreeing copy must not be counted as carrying the reported document.
        self.assertEqual(report["documents"][0]["skills"], ["a-1"])
        self.assertEqual(report["documents"][0]["reported_from"], "a-1")

    def test_a_url_is_reported_as_a_problem_not_read_as_a_path(self):
        write(
            self.root / "a-1" / "module-manifest.toml",
            'module = "alpha"\nversion = "1.0.0"\n'
            'update_source = "file:skills"\nknowledge = ["https://example.com/help.md"]\n',
        )

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"], [])
        self.assertEqual(len(report["problems"]), 1)
        self.assertIn("unsafe path", report["problems"][0]["problem"])

    def test_traversal_is_refused(self):
        write(
            self.root / "a-1" / "module-manifest.toml",
            'module = "alpha"\nversion = "1.0.0"\n'
            'update_source = "file:skills"\nknowledge = ["../escape.md"]\n',
        )
        write(self.root / "escape.md", "# escaped\n")

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"], [])
        self.assertIn("unsafe path", report["problems"][0]["problem"])

    def test_a_named_document_that_is_absent_is_a_problem(self):
        write(
            self.root / "a-1" / "module-manifest.toml",
            'module = "alpha"\nversion = "1.0.0"\n'
            'update_source = "file:skills"\nknowledge = ["absent.md"]\n',
        )

        report = self.knowledge.collect([self.root])

        self.assertEqual(report["documents"], [])
        self.assertEqual(len(report["problems"]), 1)

    def test_an_unreadable_manifest_is_named_and_the_rest_continue(self):
        make_skill(self.root, "a-1", "alpha", {"module-help.md": "# alpha\n"})
        write(self.root / "a-2" / "module-manifest.toml", "module = [\n")

        report = self.knowledge.collect([self.root])

        self.assertEqual(len(report["documents"]), 1)
        self.assertEqual(report["problems"][0]["skill"], "a-2")

    def test_a_folder_without_a_manifest_is_ignored(self):
        make_skill(self.root, "a-1", "alpha", {"module-help.md": "# alpha\n"})
        write(self.root / "not-a-skill" / "SKILL.md", "# nope\n")

        report = self.knowledge.collect([self.root])

        self.assertEqual([item["skill"] for item in report["skills"]], ["a-1"])
        self.assertEqual(report["problems"], [])

    def test_the_first_root_shadows_later_ones(self):
        other = Path(self.tmp.name) / "user-skills"
        other.mkdir()
        make_skill(self.root, "a-1", "alpha", {"module-help.md": "# project\n"})
        make_skill(other, "a-1", "alpha", {"module-help.md": "# user\n"})

        report = self.knowledge.collect([self.root, other], include_content=True)

        self.assertEqual(len(report["skills"]), 1)
        self.assertEqual(report["documents"][0]["drift"], [])
        self.assertEqual(report["documents"][0]["content"], "# project\n")

    def test_content_is_returned_on_request(self):
        make_skill(self.root, "a-1", "alpha", {"module-help.md": "# alpha\n"})

        report = self.knowledge.collect([self.root], include_content=True)

        self.assertEqual(report["documents"][0]["content"], "# alpha\n")


if __name__ == "__main__":
    unittest.main()
