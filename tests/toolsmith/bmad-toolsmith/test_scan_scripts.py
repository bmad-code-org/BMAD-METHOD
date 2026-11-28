"""Tests for scan_scripts.py: header, floor, test presence, argparse, network and model-id rules."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "skills/toolsmith/bmad-toolsmith/scripts/scan_scripts.py"
WAKE = (
    Path(__file__).resolve().parents[3]
    / "skills/toolsmith/bmad-toolsmith"
    / "shapes"
    / "memory-agent"
    / "assets"
    / "wake-template.py"
)

GOOD = '# /// script\n# requires-python = ">=3.11"\n# ///\n"""Good."""\nimport argparse\nimport json\nprint(json.dumps({}))\n'
OLD_FLOOR = '# /// script\n# requires-python = ">=3.9"\n# ///\nimport argparse\nprint(1)\n'
NO_FLOOR = "# /// script\n# dependencies = []\n# ///\nfrom argparse import ArgumentParser\nprint(1)\n"
NO_HEADER = (
    '#!/usr/bin/env python3\nimport argparse\nimport requests\nMODEL = "claude-opus-4-1"\nprint(requests, MODEL)\n'
)
BROKEN = '# /// script\n# requires-python = ">=3.11"\n# ///\ndef (:\n'
CUSTOM_IO = '# /// script\n# requires-python = ">=3.11"\n# ///\nimport argparse\nfrom pathlib import Path\np = Path("_bmad/custom") / "demo.user.toml"\nprint(p)\n'
NO_ARGPARSE = '# /// script\n# requires-python = ">=3.11"\n# ///\nimport sys\n\n\nif __name__ == "__main__":\n    print(sys.argv[1])\n'
HEADER = '# /// script\n# requires-python = ">=3.11"\n# ///\n'
REFUSES = (
    HEADER + 'import sys\n\nif __name__ == "__main__":\n    sys.exit("a library module; never invoked directly")\n'
)
RAISES = HEADER + 'if __name__ == "__main__":\n    raise SystemExit("import me instead")\n'
EXITS_MAIN = (
    HEADER + 'import sys\n\n\ndef main():\n    return 0\n\n\nif __name__ == "__main__":\n    sys.exit(main())\n'
)
CLICK = (
    HEADER + 'import click\n\n\n@click.command()\ndef main():\n    pass\n\n\nif __name__ == "__main__":\n    main()\n'
)
TYPER = HEADER + 'from typer import run\n\nif __name__ == "__main__":\n    run(print)\n'
LIBRARY = '# /// script\n# requires-python = ">=3.11"\n# ///\n"""Helpers the other scripts import."""\nVALUE = 1\n'


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
                data["scripts"],
                [
                    {
                        "path": "scripts/good.py",
                        "has_pep723": True,
                        "floor": ">=3.11",
                        "has_test": True,
                        "has_argparse": True,
                    }
                ],
            )

    def test_script_without_argparse_fires(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), {"raw.py": NO_ARGPARSE, "lib.py": LIBRARY}, ("test_raw.py", "test_lib.py"))
            code, data = scan(skill)
            self.assertEqual(code, 1)
            self.assertEqual(
                [(f["path"], f["rule"]) for f in data["findings"]], [("scripts/raw.py", "argparse-missing")]
            )
            self.assertEqual([s["has_argparse"] for s in data["scripts"]], [False, False])

    def test_refusing_library_and_click_or_typer_scripts_need_no_argparse(self):
        scripts = {"refuses.py": REFUSES, "raises.py": RAISES, "cli.py": CLICK, "app.py": TYPER, "runs.py": EXITS_MAIN}
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), scripts, tuple(f"test_{name}" for name in scripts))
            code, data = scan(skill)
            self.assertEqual(code, 1)
            self.assertEqual(
                [(f["path"], f["rule"]) for f in data["findings"]], [("scripts/runs.py", "argparse-missing")]
            )

    def test_tests_are_found_under_the_root_mirroring_the_skill_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / ".git").mkdir()
            skill = make_skill(root / "skills" / "core-tools", {"good.py": GOOD, "bare.py": GOOD})
            tests = root / "tests" / "core-tools" / "bmad-demo"
            tests.mkdir(parents=True)
            (tests / "test_good.py").write_text("import unittest\n", encoding="utf-8")
            (root / "tests" / "bmad-demo").mkdir()
            (root / "tests" / "bmad-demo" / "test_bare.py").write_text("import unittest\n", encoding="utf-8")
            _, data = scan(skill)
            self.assertEqual(
                {s["path"]: s["has_test"] for s in data["scripts"]}, {"scripts/bare.py": False, "scripts/good.py": True}
            )
            (missing,) = [f for f in data["findings"] if f["rule"] == "test-missing"]
            self.assertEqual(missing["fix"], "add tests/core-tools/bmad-demo/test_bare.py (unittest)")

    def test_copy_with_crlf_line_endings_is_still_a_copy(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), {})
            (skill / "scripts" / "wake.py").write_bytes(
                WAKE.read_bytes().replace(b"\r\n", b"\n").replace(b"\n", b"\r\n")
            )
            code, data = scan(skill)
            self.assertNotIn("test-missing", [f["rule"] for f in data["findings"]])
            self.assertEqual(data["scripts"][0].get("copy_of"), "shapes/memory-agent/assets/wake-template.py")

    def test_copied_memory_agent_script_needs_no_test_but_an_edited_copy_does(self):
        wake = WAKE.read_text(encoding="utf-8")
        with tempfile.TemporaryDirectory() as tmp:
            skill = make_skill(Path(tmp), {"wake.py": wake, "edited.py": wake + "\n# edited\n"})
            _, data = scan(skill)
            missing = [f["path"] for f in data["findings"] if f["rule"] == "test-missing"]
            self.assertEqual(missing, ["scripts/edited.py"])
            by_path = {s["path"]: s for s in data["scripts"]}
            self.assertEqual(by_path["scripts/wake.py"]["copy_of"], "shapes/memory-agent/assets/wake-template.py")
            self.assertNotIn("copy_of", by_path["scripts/edited.py"])

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
