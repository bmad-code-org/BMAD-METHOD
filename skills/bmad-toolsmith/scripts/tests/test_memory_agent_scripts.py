"""Tests for the memory-agent shape's wake and init-sanctum templates: birth, resume after a cut-off birth, and the waking map."""

import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ASSETS = Path(__file__).resolve().parents[2] / "shapes" / "memory-agent" / "assets"
TEMPLATES = [
    "PERSONA-template.md",
    "CREED-template.md",
    "BOND-template.md",
    "HOW-I-REMEMBER-template.md",
    "CAPABILITIES-template.md",
]


def make_skill(root: Path) -> tuple[Path, Path]:
    """A built memory agent: scripts from the templates, sanctum seeds in assets/, one capability."""
    project = root / "project"
    skill = project / ".claude" / "skills" / "acme-agent-sage"
    (skill / "scripts").mkdir(parents=True)
    (skill / "assets").mkdir()
    (skill / "references").mkdir()
    shutil.copy(ASSETS / "wake-template.py", skill / "scripts" / "wake.py")
    shutil.copy(ASSETS / "init-sanctum-template.py", skill / "scripts" / "init-sanctum.py")
    for name in TEMPLATES:
        shutil.copy(ASSETS / name, skill / "assets" / name)
    (skill / "references" / "first-breath.md").write_text("birth\n", encoding="utf-8")
    (skill / "references" / "intake.md").write_text(
        "---\nname: Intake\ndescription: Keep and distill material\ncode: INTAKE\n---\n\nbody\n", encoding="utf-8"
    )
    (project / "_bmad").mkdir()
    return project, skill


def run(script: Path, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run([sys.executable, str(script), *map(str, args)], capture_output=True, text=True)


class MemoryAgentScriptsTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.project, self.skill = make_skill(Path(self._tmp.name))
        self.sanctum = self.project / "_bmad" / "memory" / "acme-agent-sage"
        self.wake = self.skill / "scripts" / "wake.py"
        self.init = self.skill / "scripts" / "init-sanctum.py"

    def tearDown(self):
        self._tmp.cleanup()

    def test_no_sanctum_routes_to_first_breath(self):
        res = run(self.wake, self.project)
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertIn("MODE: FIRST_BREATH", res.stdout)
        self.assertIn("NO SANCTUM", res.stdout)

    def test_birth_writes_the_layout_without_config(self):
        res = run(self.init, self.project, self.skill)
        self.assertEqual(res.returncode, 0, res.stderr)
        for name in ("PERSONA.md", "CREED.md", "BOND.md", "HOW-I-REMEMBER.md", "CAPABILITIES.md"):
            self.assertTrue((self.sanctum / name).is_file(), name)
        for rel in ("memory/sessions", "raw", "capabilities", "references"):
            self.assertTrue((self.sanctum / rel).is_dir(), rel)
        self.assertFalse((self.sanctum / "INDEX.md").exists())
        self.assertFalse((self.sanctum / "references" / "first-breath.md").exists())
        bond = (self.sanctum / "BOND.md").read_text(encoding="utf-8")
        self.assertNotIn("friend", bond)
        self.assertIn("learned at First Breath", bond)
        self.assertIn("| [INTAKE] | Intake |", (self.sanctum / "CAPABILITIES.md").read_text(encoding="utf-8"))

    def test_cut_off_birth_is_finished_by_the_next_run(self):
        self.sanctum.mkdir(parents=True)
        (self.sanctum / "PERSONA.md").write_text("# Persona\n\nName: Sage\n", encoding="utf-8")
        res = run(self.wake, self.project)
        self.assertIn("MODE: FIRST_BREATH", res.stdout)
        self.assertIn("INCOMPLETE SANCTUM", res.stdout)
        res = run(self.init, self.project, self.skill)
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertIn("Finished sanctum", res.stdout)
        self.assertEqual((self.sanctum / "PERSONA.md").read_text(encoding="utf-8"), "# Persona\n\nName: Sage\n")
        self.assertTrue((self.sanctum / "CREED.md").is_file())
        res = run(self.wake, self.project)
        self.assertIn("MODE: WAKING", res.stdout)

    def test_finished_sanctum_is_left_alone(self):
        run(self.init, self.project, self.skill)
        (self.sanctum / "BOND.md").write_text("# Bond\n\nCall them: Brian\n", encoding="utf-8")
        res = run(self.init, self.project, self.skill)
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertIn("already been born", res.stdout)
        self.assertIn("Call them: Brian", (self.sanctum / "BOND.md").read_text(encoding="utf-8"))

    def test_waking_prints_self_and_map_not_memory(self):
        run(self.init, self.project, self.skill)
        people = self.sanctum / "memory" / "people"
        people.mkdir()
        (people / "ruben.md").write_text("Partner. SECRET-PEOPLE-BODY\n", encoding="utf-8")
        sessions = self.sanctum / "memory" / "sessions"
        (sessions / "2026-10-01-first-breath.md").write_text("born\n", encoding="utf-8")
        (sessions / "2026-10-03-pricing.md").write_text("talked\n", encoding="utf-8")
        (self.sanctum / "memory" / "pending.md").write_text("Ask about the launch date.\n", encoding="utf-8")
        raw = self.sanctum / "raw"
        (raw / "2026-10-02-oss-call.md").write_text(
            "---\nstatus: raw\ndistilled_to: []\n---\nwords\n", encoding="utf-8"
        )
        (raw / "2026-09-30-oss-notes.md").write_text("---\nstatus: distilled\n---\nwords\n", encoding="utf-8")
        res = run(self.wake, self.project)
        self.assertEqual(res.returncode, 0, res.stderr)
        out = res.stdout
        self.assertIn("MODE: WAKING", out)
        for name in ("PERSONA.md", "CREED.md", "BOND.md", "HOW-I-REMEMBER.md", "CAPABILITIES.md"):
            self.assertIn(f"===== {name} =====", out)
        self.assertIn("memory/people/ (1 files)", out)
        self.assertIn("memory/sessions/ (2 files)", out)
        self.assertIn("raw/ (2 files)", out)
        self.assertLess(
            out.index("memory/sessions/2026-10-03-pricing.md"), out.index("memory/sessions/2026-10-01-first-breath.md")
        )
        self.assertIn("Never tended; session notes: 2", out)
        (self.sanctum / "memory" / ".tended").write_text("2026-10-02\n", encoding="utf-8")
        again = run(self.wake, self.project).stdout
        self.assertIn("Tended: 2026-10-02; session notes since: 1", again)
        self.assertIn("memory/sessions/ (2 files)", again)
        self.assertNotIn(".tended", again.split("memory map")[1].split("Tended:")[0])
        self.assertIn("Undistilled raw (1):", out)
        self.assertIn("raw/2026-10-02-oss-call.md", out)
        self.assertNotIn("2026-09-30-oss-notes.md", out.split("Undistilled raw")[1])
        self.assertIn("===== pending.md =====", out)
        self.assertIn("Ask about the launch date.", out)
        self.assertNotIn("SECRET-PEOPLE-BODY", out)

    def test_pulse_appends_pulse_file_when_present(self):
        run(self.init, self.project, self.skill)
        res = run(self.wake, self.project, "--pulse")
        self.assertIn("MODE: PULSE", res.stdout)
        self.assertNotIn("===== PULSE.md =====", res.stdout)
        (self.sanctum / "PULSE.md").write_text("# Pulse\n\ntend\n", encoding="utf-8")
        res = run(self.wake, self.project, "--pulse")
        self.assertIn("===== PULSE.md =====", res.stdout)


if __name__ == "__main__":
    unittest.main()
