import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "{script}.py"


def run(*args: str) -> subprocess.CompletedProcess[str]:
    """Run the script as a subprocess, the way the agent does."""
    return subprocess.run([sys.executable, str(SCRIPT), *args], capture_output=True, text=True, check=False)


class ScriptTest(unittest.TestCase):
    def setUp(self) -> None:
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)

    def test_reports_the_result(self) -> None:
        fixture = self.root / "input.txt"
        fixture.write_text("{fixture contents}\n", encoding="utf-8")
        result = run(str(fixture))
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads(result.stdout)
        self.assertEqual(data["path"], str(fixture))

    def test_fails_with_one_line(self) -> None:
        result = run(str(self.root / "missing.txt"))
        self.assertEqual(result.returncode, 1)
        self.assertEqual(result.stderr.count("\n"), 1, result.stderr)
        self.assertIn("not found", result.stderr)


if __name__ == "__main__":
    unittest.main()
