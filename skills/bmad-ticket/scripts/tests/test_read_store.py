import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "read_store.py"

REPO = '''
# comment that must never be printed
description = "Files in the repo."

[tickets]
store = "repo"
access = "Read and write the files."

[verbs]
write = """
Edit the file.
Commit it.
"""

[tickets.status]
backlog = "backlog"
done = "done"
'''

JIRA = """
description = "Jira through acli."

[tickets]
store = "jira"
key = ""
site = ""

[verbs]
write = "acli create"
query = "acli view"

[tickets.status]
backlog = "To Do"
review = "In Review"
done = "Done"
"""


class ReadStoreTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name) / "project"
        self.starters = Path(self.tmp.name) / "config"
        (self.root / "_bmad" / "custom").mkdir(parents=True)
        self.starters.mkdir()
        (self.starters / "repo-ticketing.toml").write_text(REPO, encoding="utf-8")
        (self.starters / "jira-ticketing.toml").write_text(JIRA, encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def project(self, text):
        (self.root / "_bmad" / "custom" / "ticketing-store-config.toml").write_text(text, encoding="utf-8")

    def run_script(self, *args):
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--starters-dir", str(self.starters), *args],
            encoding="utf-8",
            capture_output=True,
            check=False,
        )

    def read(self, *keys):
        args = [a for k in keys for a in ("-k", k)]
        return self.run_script("--project-root", str(self.root), *args)

    def test_no_project_file_reads_the_repo_starter(self):
        result = self.read("tickets.store")
        self.assertEqual((result.returncode, result.stdout), (0, "repo\n"))
        result = self.read("verbs.write")
        self.assertEqual(result.stdout, "Edit the file.\nCommit it.\n")
        self.assertNotIn("comment", self.read().stdout)

    def test_the_project_file_names_the_store_and_its_keys_win_one_by_one(self):
        self.project('[tickets]\nstore = "jira"\nkey = "SHOP"\n\n[tickets.status]\nreview = ""\n')
        result = self.read("tickets", "verbs.query")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(
            json.loads(result.stdout),
            {
                "tickets": {
                    "store": "jira",
                    "key": "SHOP",
                    "site": "",
                    "status": {"backlog": "To Do", "review": "", "done": "Done"},
                },
                "verbs.query": "acli view",
            },
        )

    def test_a_verb_the_project_file_sets_replaces_the_starters(self):
        self.project('[tickets]\nstore = "jira"\n\n[verbs]\nwrite = "our own create"\n')
        self.assertEqual(self.read("verbs.write").stdout, "our own create\n")
        self.assertEqual(self.read("verbs.query").stdout, "acli view\n")

    def test_a_store_with_no_starter_is_read_from_the_project_file_alone(self):
        self.project('[tickets]\nstore = "azure"\n\n[verbs]\nwrite = "az boards"\n')
        self.assertEqual(self.read("verbs.write").stdout, "az boards\n")
        result = self.read("verbs.query")
        self.assertEqual(result.returncode, 2)
        self.assertIn("missing: verbs.query", result.stderr)

    def test_a_store_name_that_is_no_file_name_reads_no_starter(self):
        self.project('[tickets]\nstore = "../repo"\n')
        self.assertEqual(self.read("verbs.write").returncode, 2)

    def test_a_project_file_that_names_no_store_reads_the_repo_starter(self):
        for text in ("[workflow]\nx = 1\n", "[tickets]\nstore = 5\n", '[tickets]\nstore = ""\nkey = "K"\n'):
            self.project(text)
            self.assertEqual(self.read("verbs.write").stdout, "Edit the file.\nCommit it.\n", text)
            self.assertEqual(self.read("tickets.store").stdout, "repo\n", text)
        self.assertEqual(self.read("tickets.key").stdout, "K\n")

    def test_several_keys_with_one_missing_print_the_rest_and_exit_2(self):
        result = self.read("tickets.store", "tickets.nope")
        self.assertEqual(result.returncode, 2)
        self.assertEqual(json.loads(result.stdout), {"tickets.store": "repo"})
        self.assertIn("missing: tickets.nope", result.stderr)

    def test_an_unreadable_project_file_exits_1(self):
        self.project("[tickets\nstore = ")
        result = self.read("tickets.store")
        self.assertEqual(result.returncode, 1)
        self.assertIn("cannot read the store config", result.stderr)

    def test_starters_lists_each_store_with_its_description(self):
        result = self.run_script("--starters")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), {"jira": "Jira through acli.", "repo": "Files in the repo."})

    def test_every_shipped_starter_parses_and_is_named_for_its_store(self):
        shipped = SCRIPT.parents[1] / "config"
        result = subprocess.run(
            [sys.executable, str(SCRIPT), "--starters"], encoding="utf-8", capture_output=True, check=False
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(
            sorted(f"{store}-ticketing.toml" for store in json.loads(result.stdout)),
            sorted(p.name for p in shipped.glob("*-ticketing.toml")),
        )


if __name__ == "__main__":
    unittest.main()
