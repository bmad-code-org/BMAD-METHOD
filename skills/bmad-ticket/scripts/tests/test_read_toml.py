import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "read_toml.py"

TOML = '''
# comment that must never be printed
[tickets]
store = "obeya"
key = ""
publish = """
Line one.
Line two.
"""
[tickets.status]
done = "done"
'''


def run(*args):
    return subprocess.run([sys.executable, str(SCRIPT), *args], text=True, capture_output=True, check=False)


class ReadTomlTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / "t.toml"
        self.path.write_text(TOML, encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def test_single_string_key_prints_bare_value(self):
        result = run("--file", str(self.path), "--key", "tickets.publish")
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, "Line one.\nLine two.\n")
        self.assertNotIn("comment", result.stdout)

    def test_multiple_keys_print_json(self):
        result = run("--file", str(self.path), "-k", "tickets.store", "-k", "tickets.status")
        self.assertEqual(result.returncode, 0)
        self.assertEqual(json.loads(result.stdout), {"tickets.store": "obeya", "tickets.status": {"done": "done"}})

    def test_missing_key_reports_and_exits_2(self):
        result = run("--file", str(self.path), "-k", "tickets.nope")
        self.assertEqual(result.returncode, 2)
        self.assertIn("missing: tickets.nope", result.stderr)

    def test_unreadable_file_exits_1(self):
        result = run("--file", str(self.path.with_name("none.toml")), "-k", "tickets.store")
        self.assertEqual(result.returncode, 1)


if __name__ == "__main__":
    unittest.main()
