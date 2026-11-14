"""Tests for the memory-agent shape's wake and init-sanctum templates: birth, resume after a cut-off birth, the waking map, capabilities and dominion."""

import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ASSETS = Path(__file__).resolve().parents[2] / "shapes" / "memory-agent" / "assets"
RESOLVER_SCRIPTS = Path(__file__).resolve().parents[4] / "core-tools" / "bmad" / "scripts"
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
    shutil.copy(ASSETS / "customize-template.toml", skill / "customize.toml")
    (project / "_bmad" / "custom").mkdir(parents=True)
    (project / "_bmad" / "scripts").mkdir()
    for name in ("resolve_customization.py", "config_utils.py"):
        shutil.copy(RESOLVER_SCRIPTS / name, project / "_bmad" / "scripts" / name)
    return project, skill


def capability(folder: Path, file: str, code: str, name: str, extra: str = "") -> None:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / file).write_text(
        f"---\nname: {name}\ndescription: {name} desc\ncode: {code}\n{extra}---\n\nbody\n", encoding="utf-8"
    )


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

    def birth(self) -> None:
        """Scaffold the sanctum and finish First Breath, as its wrap-up does."""
        run(self.init, self.project, self.skill)
        (self.sanctum / "memory" / ".born").write_text("2026-10-01\n", encoding="utf-8")

    def test_no_sanctum_routes_to_first_breath(self):
        res = run(self.wake, self.project)
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertIn("MODE: FIRST_BREATH", res.stdout)
        self.assertIn("NO SANCTUM", res.stdout)

    def test_birth_writes_the_layout_and_copies_nothing_from_the_skill(self):
        res = run(self.init, self.project, self.skill)
        self.assertEqual(res.returncode, 0, res.stderr)
        for name in ("PERSONA.md", "CREED.md", "BOND.md", "HOW-I-REMEMBER.md", "CAPABILITIES.md"):
            self.assertTrue((self.sanctum / name).is_file(), name)
        for rel in ("memory/sessions", "raw", "capabilities"):
            self.assertTrue((self.sanctum / rel).is_dir(), rel)
        for rel in ("INDEX.md", "references", "scripts"):
            self.assertFalse((self.sanctum / rel).exists(), rel)
        bond = (self.sanctum / "BOND.md").read_text(encoding="utf-8")
        self.assertNotIn("friend", bond)
        self.assertIn("learned at First Breath", bond)

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
        self.assertIn("MODE: FIRST_BREATH", res.stdout)
        self.assertIn("UNFINISHED BIRTH", res.stdout)

    def test_unfinished_birth_returns_to_first_breath_with_what_is_open(self):
        run(self.init, self.project, self.skill)
        bond = self.sanctum / "BOND.md"
        bond.write_text(
            bond.read_text(encoding="utf-8").replace("{learned at First Breath}", "Brian", 1), encoding="utf-8"
        )
        out = run(self.wake, self.project).stdout
        self.assertIn("MODE: FIRST_BREATH", out)
        self.assertIn("UNFINISHED BIRTH", out)
        self.assertIn("===== BOND.md =====", out)
        still_open = out.split("===== still open =====")[1].split("=====")[0]
        self.assertIn("BOND.md: - **Call them:** {learned at First Breath}", still_open)
        self.assertNotIn("**Name:** Brian", still_open)
        self.assertNotIn("===== memory map =====", out)
        (self.sanctum / "memory" / ".born").write_text("2026-10-01\n", encoding="utf-8")
        self.assertIn("MODE: WAKING", run(self.wake, self.project).stdout)

    def test_pulse_before_birth_does_nothing(self):
        run(self.init, self.project, self.skill)
        out = run(self.wake, self.project, "--pulse").stdout
        self.assertIn("MODE: UNBORN", out)
        self.assertNotIn("=====", out)

    def test_finished_sanctum_is_left_alone(self):
        run(self.init, self.project, self.skill)
        (self.sanctum / "BOND.md").write_text("# Bond\n\nCall them: Brian\n", encoding="utf-8")
        res = run(self.init, self.project, self.skill)
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertIn("nothing to scaffold", res.stdout)
        self.assertNotIn("born", res.stdout)
        self.assertIn("Call them: Brian", (self.sanctum / "BOND.md").read_text(encoding="utf-8"))

    def test_waking_prints_self_and_map_not_memory(self):
        self.birth()
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
        self.birth()
        res = run(self.wake, self.project, "--pulse")
        self.assertIn("MODE: PULSE", res.stdout)
        self.assertNotIn("===== PULSE.md =====", res.stdout)
        (self.sanctum / "PULSE.md").write_text("# Pulse\n\ntend\n", encoding="utf-8")
        res = run(self.wake, self.project, "--pulse")
        self.assertIn("===== PULSE.md =====", res.stdout)

    def name_the_agent(self) -> None:
        self.birth()
        persona = self.sanctum / "PERSONA.md"
        text = persona.read_text(encoding="utf-8").replace("- **Name:** {awaiting First Breath}", "- **Name:** Bubbles")
        persona.write_text(text, encoding="utf-8")

    def test_waking_says_when_an_update_removed_the_name_from_the_description(self):
        self.name_the_agent()
        skill_md = self.skill / "SKILL.md"
        skill_md.write_text(
            "---\nname: acme-agent-sage\ndescription: 'A companion.'\n---\n# Bubbles\n", encoding="utf-8"
        )
        self.assertIn("Your name, Bubbles, is missing", run(self.wake, self.project).stdout)
        skill_md.write_text(
            "---\nname: acme-agent-sage\ndescription: 'Use when the user asks to talk to Bubbles.'\n---\n",
            encoding="utf-8",
        )
        self.assertNotIn("===== description =====", run(self.wake, self.project).stdout)

    def test_waking_leaves_an_unnamed_agent_and_a_global_install_alone(self):
        self.birth()
        (self.skill / "SKILL.md").write_text("---\ndescription: 'A companion.'\n---\n", encoding="utf-8")
        self.assertNotIn("===== description =====", run(self.wake, self.project).stdout)
        self.name_the_agent()
        installed = self.project.parent / "global" / self.skill.name
        shutil.copytree(self.skill, installed)
        self.assertNotIn("===== description =====", run(installed / "scripts" / "wake.py", self.project).stdout)

    def capabilities_section(self, out: str) -> str:
        return out.split("===== capabilities =====")[1].split("=====")[0]

    def test_capabilities_come_from_the_skill_and_the_sanctum_at_every_waking(self):
        run(self.init, self.project, self.skill)
        table = self.capabilities_section(run(self.wake, self.project).stdout)
        self.assertIn("| [INTAKE] | Intake | Keep and distill material | built-in | `references/intake.md` |", table)
        self.assertNotIn("first-breath", table)
        capability(self.skill / "references", "plan.md", "PLAN", "Plan")
        learned = self.sanctum / "capabilities"
        capability(learned, "brief.md", "BRIEF", "Brief", "added: 2026-10-05\n")
        (learned / "quoted.md").write_text(
            "---\nname: 'Lee''s quiz'\ndescription: >\n  folded\n  text\ncode: QUIZ\n---\n", encoding="utf-8"
        )
        capability(learned, "intake.md", "INTAKE", "Intake, my way")
        table = self.capabilities_section(run(self.wake, self.project).stdout)
        self.assertIn("| [PLAN] | Plan |", table)
        self.assertIn("| [BRIEF] | Brief | Brief desc | learned | `capabilities/brief.md` |", table)
        self.assertIn("| [QUIZ] | Lee's quiz | folded text |", table)
        self.assertIn("| [INTAKE] | Intake, my way | Intake, my way desc | learned, replaces built-in |", table)
        self.assertNotIn("references/intake.md", table)
        capability(learned, "plan.md", "PLAN", "Plan", "retired: true\n")
        self.assertNotIn("[PLAN]", self.capabilities_section(run(self.wake, self.project).stdout))

    def dominion(self, layer: str, body: str) -> None:
        with (self.project / "_bmad" / "custom" / layer).open("a", encoding="utf-8") as f:
            f.write(body)

    def test_no_dominion_prints_no_section(self):
        self.birth()
        self.assertNotIn("===== dominion =====", run(self.wake, self.project).stdout)

    def test_waking_maps_each_area_and_flags_what_is_wrong(self):
        self.birth()
        vault = self.project / "vault"
        (vault / "people").mkdir(parents=True)
        (vault / "decisions").mkdir()
        (vault / ".obsidian").mkdir()
        (vault / "README.md").write_text("# Vault\n", encoding="utf-8")
        (vault / "people" / "ruben.md").write_text("AREA-BODY\n", encoding="utf-8")
        (vault / "decisions" / "2026-10-01-pricing.md").write_text("x\n", encoding="utf-8")
        (vault / "decisions" / "2026-10-04-hiring.md").write_text("x\n", encoding="utf-8")
        (vault / ".obsidian" / "2026-12-01-cache.md").write_text("x\n", encoding="utf-8")
        notes = self.project / "notes"
        notes.mkdir()
        (notes / "a.md").write_text("x\n", encoding="utf-8")
        self.dominion(
            "acme-agent-sage.toml",
            '[[agent.dominion]]\nid = "vault"\npath = "vault"\naccess = "write"\nabout = "The business vault"\n\n'
            '[[agent.dominion]]\nid = "notes"\npath = "notes"\naccess = "write"\n\n'
            '[[agent.dominion]]\nid = "docs"\npath = "docs"\n',
        )
        journal = Path(self._tmp.name) / "safe" / "journal"
        journal.mkdir(parents=True)
        self.dominion(
            "acme-agent-sage.user.toml",
            f'[[agent.dominion]]\nid = "journal"\npath = "{journal.as_posix()}"\naccess = "write"\nprivate = true\n\n'
            '[[agent.dominion]]\nid = "notes"\npath = "notes"\naccess = "read"\n',
        )
        res = run(self.wake, self.project)
        self.assertEqual(res.returncode, 0, res.stderr)
        out = res.stdout.split("===== dominion =====")[1]
        self.assertIn(f"vault → {vault.resolve()} (write): The business vault", out)
        self.assertIn("decisions/ (2 files)", out)
        self.assertIn("people/ (1 files)", out)
        self.assertNotIn(".obsidian", out)
        self.assertLess(out.index("decisions/2026-10-04-hiring.md"), out.index("decisions/2026-10-01-pricing.md"))
        self.assertNotIn("AREA-BODY", out)
        self.assertIn(f"notes → {notes.resolve()} (read)", out)
        self.assertIn(f"journal → {journal.resolve()} (write, private: other agents keep out)", out)
        journal_block = out.split("journal →")[1]
        self.assertIn("No README.md", journal_block)
        self.assertIn("0 files; names not shown", journal_block)
        docs_block = out.split("docs →")[1].split("journal →")[0]
        self.assertIn("(read)", docs_block)
        self.assertIn("MISSING", docs_block)
        self.assertNotIn("No README.md", out.split("vault →")[1].split("notes →")[0])

    def test_whole_workspace_area_skips_bmad_folders_and_needs_no_readme(self):
        self.birth()
        (self.sanctum / "memory" / "sessions" / "2026-10-09-chat.md").write_text("x\n", encoding="utf-8")
        (self.project / "_bmad-output").mkdir()
        self.dominion("acme-agent-sage.toml", '[[agent.dominion]]\nid = "all"\npath = "."\naccess = "write"\n')
        out = run(self.wake, self.project).stdout.split("===== dominion =====")[1]
        self.assertIn(f"all → {self.project.resolve()} (write)", out)
        self.assertNotIn("_bmad", out)
        self.assertNotIn("2026-10-09-chat.md", out)
        self.assertNotIn("No README.md", out)

    def test_private_area_shows_a_count_not_names(self):
        self.birth()
        diary = self.project / "diary" / "entries"
        diary.mkdir(parents=True)
        (diary / "2026-11-10-argued-with-sister.md").write_text("x\n", encoding="utf-8")
        (diary.parent / "README.md").write_text("# Diary\n", encoding="utf-8")
        self.dominion(
            "acme-agent-sage.user.toml",
            '[[agent.dominion]]\nid = "diary"\npath = "diary"\naccess = "write"\nprivate = true\n',
        )
        out = run(self.wake, self.project).stdout.split("===== dominion =====")[1]
        self.assertIn("2 files; names not shown", out)
        self.assertNotIn("sister", out)
        self.assertNotIn("entries", out)

    def test_retired_area_is_dropped_and_malformed_entries_are_named(self):
        self.birth()
        for folder in ("log", "notes"):
            (self.project / folder).mkdir()
        self.dominion(
            "acme-agent-sage.toml",
            '[[agent.dominion]]\nid = "log"\npath = "log"\naccess = "write"\n\n'
            '[[agent.dominion]]\nid = "notes"\npath = "notes"\naccess = "rw"\n\n'
            '[[agent.dominion]]\nid = "gone"\npath = "gone"\n',
        )
        self.dominion(
            "acme-agent-sage.user.toml",
            '[[agent.dominion]]\nid = "gone"\npath = "gone"\nretired = true\n\n'
            '[[agent.dominion]]\nid = "log"\nabout = "only the about"\n',
        )
        out = run(self.wake, self.project).stdout.split("===== dominion =====")[1]
        self.assertNotIn("gone", out)
        self.assertIn("log: no path, skipped", out)
        self.assertNotIn("log →", out)
        self.assertIn("notes: access 'rw' is neither write nor read; treated as read", out)
        self.assertIn(f"notes → {(self.project / 'notes').resolve()} (read)", out)

    def test_project_root_token_in_an_area_path_resolves(self):
        self.birth()
        (self.project / "journal").mkdir()
        (self.project / "journal" / "README.md").write_text("# Journal\n", encoding="utf-8")
        self.dominion(
            "acme-agent-sage.toml",
            '[[agent.dominion]]\nid = "journal"\npath = "{project-root}/journal"\naccess = "write"\n',
        )
        out = run(self.wake, self.project).stdout.split("===== dominion =====")[1]
        self.assertIn(f"journal → {(self.project / 'journal').resolve()} (write)", out)
        self.assertNotIn("MISSING", out)

    def test_unwritable_sanctum_fails_with_one_line(self):
        memory = self.project / "_bmad" / "memory"
        memory.mkdir()
        memory.chmod(0o500)
        try:
            res = run(self.init, self.project, self.skill)
        finally:
            memory.chmod(0o700)
        self.assertEqual(res.returncode, 1)
        self.assertIn("Cannot write the sanctum", res.stderr)
        self.assertNotIn("Traceback", res.stderr)

    def test_wrong_skill_path_fails_instead_of_claiming_success(self):
        res = run(self.init, self.project, self.project)
        self.assertEqual(res.returncode, 1)
        self.assertIn("No template for PERSONA.md", res.stderr)
        self.assertNotIn("complete", res.stdout)

    def test_unknown_flag_is_refused(self):
        res = run(self.wake, self.project, "--bogus")
        self.assertEqual(res.returncode, 2)
        self.assertIn("unrecognized arguments", res.stderr)

    def test_entry_without_id_is_named(self):
        self.birth()
        (self.project / "notes").mkdir()
        self.dominion("acme-agent-sage.toml", '[[agent.dominion]]\npath = "notes"\n')
        out = run(self.wake, self.project).stdout.split("===== dominion =====")[1]
        self.assertIn("notes: no id", out)
        self.assertIn("notes → ", out)

    def test_first_breath_shows_shipped_areas_and_capabilities(self):
        with (self.skill / "customize.toml").open("r+", encoding="utf-8") as f:
            text = f.read().replace(
                "dominion = []", '[[agent.dominion]]\nid = "log"\npath = "training-log"\naccess = "write"'
            )
            f.seek(0)
            f.write(text)
            f.truncate()
        out = run(self.wake, self.project).stdout
        self.assertIn("MODE: FIRST_BREATH", out)
        self.assertIn("[INTAKE]", out)
        self.assertIn("log → ", out)
        self.assertIn("MISSING", out)

    def test_dominion_without_the_resolver_says_why(self):
        self.birth()
        (self.project / "_bmad" / "scripts" / "resolve_customization.py").unlink()
        out = run(self.wake, self.project).stdout
        self.assertIn("MODE: WAKING", out)
        self.assertIn("Dominion not read:", out)


if __name__ == "__main__":
    unittest.main()
