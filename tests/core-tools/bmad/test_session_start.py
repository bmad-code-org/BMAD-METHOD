import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "skills/core-tools/bmad/scripts"))

import session_start  # noqa: E402

SOURCE = "github:acme/tools/skills"
ROSTER = """
[[members]]
code = "demo-agent-ann"
skill = "demo-agent-ann"
name = "Ann"
title = "Analyst"

[[members]]
code = "demo-agent-missing"
skill = "demo-agent-missing"
name = "Nobody"

[[members]]
code = "guest"
name = "Guest"
"""


def write_skill(root: Path, name: str, description: str = "", *, bmod: str = "bmod-demo") -> Path:
    folder = root / name
    folder.mkdir(parents=True)
    (folder / "bmod.toml").write_text(f'[skill]\nbmod = "{bmod}"\nsource = "{SOURCE}"\n', encoding="utf-8")
    if description:
        (folder / "SKILL.md").write_text(f"---\nname: {name}\ndescription: '{description}'\n---\n# {name}\n")
    return folder


def write_module(root: Path, skills: tuple[str, ...], *, code: str = "demo", roster: str | None = ROSTER) -> Path:
    record = root / f"bmod-{code}"
    record.mkdir(parents=True)
    names = ", ".join(f'"{name}"' for name in skills)
    text = f'[bmod]\ncode = "{code}"\nversion = "1.0.0"\nupdate_source = "{SOURCE}"\nskills = [{names}]\n'
    (record / "bmod.toml").write_text(text, encoding="utf-8")
    if roster is not None:
        (record / "roster.toml").write_text(roster, encoding="utf-8")
    return record


class ComposeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name) / "skills"
        self.root.mkdir()

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def test_empty_when_nothing_is_installed(self) -> None:
        self.assertEqual(session_start.compose([self.root]), "")

    def test_names_agents_then_workflows_then_the_help_skill(self) -> None:
        write_module(self.root, ("bmad", "demo-agent-ann", "demo-build", "demo-agent-missing"))
        write_skill(self.root, "bmad", "Answers BMad questions.")
        write_skill(self.root, "demo-agent-ann", "Ann, the Analyst. Use when the user asks for Ann.")
        write_skill(self.root, "demo-build", "Implements a story end to end: plan, code, review. Use when handed one.")
        note = session_start.compose([self.root])
        lines = note.splitlines()
        self.assertIn("modules: demo", lines[0])
        self.assertEqual(lines[1], "- Ann (demo-agent-ann): Analyst")
        self.assertEqual(lines[2], "- demo-build: Implements a story end to end: plan, code, review.")
        self.assertEqual(lines[-1], session_start.TAIL)
        self.assertNotIn("Nobody", note, "a roster member whose skill is not installed stays out")
        self.assertNotIn("- bmad:", note, "the help skill is the tail, not a list entry")

    def test_cap_keeps_lead_and_tail_and_counts_the_rest(self) -> None:
        names = tuple(f"demo-skill-{n:02d}" for n in range(30))
        write_module(self.root, names, roster=None)
        for name in names:
            write_skill(self.root, name, f"Does thing {name}.")
        note = session_start.compose([self.root], max_lines=8)
        lines = note.splitlines()
        self.assertEqual(len(lines), 8)
        self.assertTrue(lines[0].startswith("BMad Method skills are installed"))
        self.assertEqual(lines[-1], session_start.TAIL)
        self.assertEqual(lines[-2], session_start.MORE.format(count=30 - 5))

    def test_long_descriptions_are_cut_at_the_first_sentence_and_limit(self) -> None:
        write_module(self.root, ("demo-long",), roster=None)
        write_skill(self.root, "demo-long", "A" * 200 + ". Second sentence.")
        line = session_start.compose([self.root]).splitlines()[1]
        self.assertTrue(line.endswith("…"))
        self.assertLessEqual(len(line), len("- demo-long: ") + session_start.DESCRIPTION_LIMIT)

    def test_project_root_shadows_a_global_copy(self) -> None:
        other = Path(self.tmp.name) / "global"
        other.mkdir()
        write_module(self.root, ("demo-x",), roster=None)
        write_skill(self.root, "demo-x", "Project copy.")
        write_module(other, ("demo-x", "demo-y"), code="demo", roster=None)
        write_skill(other, "demo-x", "Global copy.")
        write_skill(other, "demo-y", "Only global.")
        note = session_start.compose([self.root, other])
        self.assertIn("demo-x: Project copy.", note)
        self.assertNotIn("Global copy.", note)


class RenderTests(unittest.TestCase):
    def test_shapes(self) -> None:
        note = "hello"
        self.assertEqual(session_start.render(note, "text", "SessionStart"), "hello")
        self.assertEqual(
            json.loads(session_start.render(note, "cursor", "SessionStart")), {"additional_context": "hello"}
        )
        self.assertEqual(
            json.loads(session_start.render(note, "copilot", "SessionStart")), {"additionalContext": "hello"}
        )
        claude = json.loads(session_start.render(note, "claude", "UserPromptSubmit"))
        self.assertEqual(claude["hookSpecificOutput"]["hookEventName"], "UserPromptSubmit")
        self.assertEqual(claude["hookSpecificOutput"]["additionalContext"], "hello")

    def test_auto_detects_the_host(self) -> None:
        self.assertEqual(session_start.detect_format({}), "text")
        self.assertEqual(session_start.detect_format({"CLAUDE_PROJECT_DIR": "/p"}), "claude")
        self.assertEqual(session_start.detect_format({"CURSOR_PLUGIN_ROOT": "/p"}), "cursor")
        self.assertEqual(session_start.detect_format({"COPILOT_CLI": "1"}), "copilot")


class MainTests(unittest.TestCase):
    def test_prints_nothing_and_exits_zero_without_modules(self) -> None:
        with tempfile.TemporaryDirectory() as tmp, redirect_stdout(io.StringIO()) as out:
            code = session_start.main(["--root", tmp, "--format", "claude"])
        self.assertEqual(code, 0)
        self.assertEqual(out.getvalue(), "")

    def test_unreadable_root_exits_zero(self) -> None:
        with redirect_stdout(io.StringIO()) as out:
            code = session_start.main(["--root", "/nonexistent/skills", "--format", "claude"])
        self.assertEqual(code, 0)
        self.assertEqual(out.getvalue(), "")


if __name__ == "__main__":
    unittest.main()
