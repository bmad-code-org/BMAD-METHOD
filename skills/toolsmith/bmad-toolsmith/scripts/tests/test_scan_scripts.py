"""Tests for scan_scripts.py: header, floor, test presence, network and model-id rules."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scan_scripts.py"

GOOD = '# /// script\n# requires-python = ">=3.11"\n# ///\n"""Good."""\nimport json\nprint(json.dumps({}))\n'
OLD_FLOOR = '# /// script\n# requires-python = ">=3.9"\n# ///\nprint(1)\n'
NO_FLOOR = "# /// script\n# dependencies = []\n# ///\nprint(1)\n"
NO_HEADER = '#!/usr/bin/env python3\nimport requests\nMODEL = "claude-opus-4-1"\nprint(requests, MODEL)\n'
BROKEN = '# /// script\n# requires-python = ">=3.11"\n# ///\ndef (:\n'
CUSTOM_IO = '# /// script\n# requires-python = ">=3.11"\n# ///\nfrom pathlib import Path\np = Path("_bmad/custom") / "demo.user.toml"\nprint(p)\n'


def make_skill(root: Path, scripts: dict[str, str], tests: tuple[str, ...] = ()) -> Path:
    skill = root / "bmad-demo"
    (skill / "scripts" / "tests").mkdir(parents=True)
    for name, text in scripts.items():
        (skill / "scripts" / name).write_text(text, encoding="utf-8")
    for name in tests:
        (skill / "scripts" / "tests" / name).write_text("import unittest\n", encoding="utf-8")
    return skill


def scan(skill: Path):
    res = subprocess.run([sys.executable, str(SCRIPT), str(skill)], capture_output=True, text=True)
    return res.returncode, json.loads(res.stdout)


class ScanScriptsTest(unittest.TestCase):
    def test_custom_io_fires_on_override_paths(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), {"formats.py": CUSTOM_IO}, ("test_formats.py",))
            code, data = scan(skill)
            self.assertEqual(code, 1)
            hits = sorted((f["rule"], f["text"]) for f in data["findings"])
            self.assertEqual(hits, [("custom-io", "_bmad/custom"), ("custom-io", "demo.user.toml")])

    def test_clean_script(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), {"good.py": GOOD}, ("test_good.py",))
            code, data = scan(skill)
            self.assertEqual(code, 0, data)
            self.assertEqual(data["findings"], [])
            self.assertEqual(
                data["scripts"], [{"path": "scripts/good.py", "has_pep723": True, "floor": ">=3.11", "has_test": True}]
            )

    def test_rules_fire(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(
                Path(tmp),
                {"old.py": OLD_FLOOR, "nofloor.py": NO_FLOOR, "bare.py": NO_HEADER, "broken.py": BROKEN},
                ("test_old.py", "test_nofloor.py", "test_broken.py"),
            )
            code, data = scan(skill)
            self.assertEqual(code, 1)
            found = sorted((f["path"], f["rule"]) for f in data["findings"])
            self.assertEqual(
                found,
                [
                    ("scripts/bare.py", "model-id"),
                    ("scripts/bare.py", "network-call"),
                    ("scripts/bare.py", "pep723-missing"),
                    ("scripts/bare.py", "test-missing"),
                    ("scripts/broken.py", "syntax-error"),
                    ("scripts/nofloor.py", "pep723-floor"),
                    ("scripts/old.py", "pep723-floor"),
                ],
            )
            by_path = {s["path"]: s for s in data["scripts"]}
            self.assertFalse(by_path["scripts/bare.py"]["has_pep723"])
            self.assertEqual(by_path["scripts/old.py"]["floor"], ">=3.9")
            self.assertIsNone(by_path["scripts/nofloor.py"]["floor"])

    def test_no_scripts_folder_is_clean(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "bmad-demo"
            skill.mkdir()
            code, data = scan(skill)
            self.assertEqual(code, 0)
            self.assertEqual(data, {"skill": "bmad-demo", "scripts": [], "findings": []})

    def test_not_a_directory(self):
        res = subprocess.run([sys.executable, str(SCRIPT), "/nonexistent"], capture_output=True, text=True)
        self.assertEqual(res.returncode, 2)


if __name__ == "__main__":
    unittest.main()
