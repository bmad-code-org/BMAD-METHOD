import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "skills/core-tools/bmad/scripts"))

import session_start_hook as hook  # noqa: E402


class HookFileTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.project = Path(self.tmp.name) / "project"
        self.claude = self.project / ".claude" / "skills"
        self.agents = self.project / ".agents" / "skills"
        self.claude.mkdir(parents=True)
        self.agents.mkdir(parents=True)
        self.settings = self.project / ".claude" / "settings.json"
        self.codex = self.project / ".codex" / "hooks.json"

    def roots(self, *paths: Path) -> tuple[Path, ...]:
        return tuple(paths)

    def test_answer_is_read_from_the_core_tools_module(self) -> None:
        self.assertEqual(hook.answer({"modules": {"core-tools": {"session_start_hook": " On "}}}), "on")
        self.assertIsNone(hook.answer({"modules": {"core-tools": {}}}))
        self.assertIsNone(hook.answer({}))
        self.assertIsNone(hook.answer("junk"))

    def test_only_tools_with_a_skills_root_in_the_project_are_present(self) -> None:
        hosts = hook.hosts_present(self.project, self.roots(self.claude, Path(self.tmp.name) / "elsewhere"))
        self.assertEqual([host.code for host in hosts], ["claude-code"])

    def test_on_writes_an_entry_and_keeps_the_rest_of_the_file(self) -> None:
        self.settings.write_text(json.dumps({"permissions": {"allow": ["Read"]}, "hooks": {"Stop": [{"hooks": []}]}}))
        result = hook.apply(self.project, self.roots(self.claude, self.agents), "on")
        self.assertTrue(result["changed"])
        self.assertEqual([h["state"] for h in result["hosts"]], ["written", "written"])
        data = json.loads(self.settings.read_text())
        self.assertEqual(data["permissions"], {"allow": ["Read"]})
        self.assertIn("Stop", data["hooks"])
        (ours,) = data["hooks"]["SessionStart"]
        self.assertEqual(ours["matcher"], "startup|clear")
        command = ours["hooks"][0]["command"]
        self.assertIn("_bmad/scripts/session_start.py", command)
        self.assertIn('--root "${CLAUDE_PROJECT_DIR:-.}/.claude/skills"', command)
        self.assertIn('--root "${CLAUDE_PROJECT_DIR:-.}/.agents/skills"', command)
        self.assertEqual(ours["hooks"][0]["statusMessage"], "BMad session start")
        codex = json.loads(self.codex.read_text())
        self.assertNotIn("statusMessage", codex["hooks"]["SessionStart"][0]["hooks"][0])
        self.assertIn("trusts", result["hosts"][1]["note"])

    def test_a_second_on_run_changes_nothing(self) -> None:
        hook.apply(self.project, self.roots(self.claude), "on")
        before = self.settings.read_text()
        result = hook.apply(self.project, self.roots(self.claude), "on")
        self.assertFalse(result["changed"])
        self.assertEqual(result["hosts"][0]["state"], "present")
        self.assertEqual(self.settings.read_text(), before)

    def test_a_changed_root_set_makes_the_entry_stale_and_on_rewrites_it(self) -> None:
        hook.apply(self.project, self.roots(self.claude), "on")
        report = hook.report(self.project, self.roots(self.claude, self.agents), "on")
        self.assertEqual(report["hosts"][0]["state"], "stale")
        self.assertTrue(report["owed"])
        result = hook.apply(self.project, self.roots(self.claude, self.agents), "on")
        self.assertEqual(result["hosts"][0]["state"], "written")
        (ours,) = json.loads(self.settings.read_text())["hooks"]["SessionStart"]
        self.assertIn(".agents/skills", ours["hooks"][0]["command"])

    def test_off_removes_only_our_entry(self) -> None:
        theirs = {"matcher": "startup", "hooks": [{"type": "command", "command": "echo hi"}]}
        self.settings.write_text(json.dumps({"hooks": {"SessionStart": [theirs]}}))
        hook.apply(self.project, self.roots(self.claude), "on")
        self.assertEqual(len(json.loads(self.settings.read_text())["hooks"]["SessionStart"]), 2)
        result = hook.apply(self.project, self.roots(self.claude), "off")
        self.assertTrue(result["changed"])
        self.assertEqual(result["hosts"][0]["state"], "removed")
        self.assertEqual(json.loads(self.settings.read_text()), {"hooks": {"SessionStart": [theirs]}})

    def test_off_deletes_a_file_that_held_nothing_else(self) -> None:
        hook.apply(self.project, self.roots(self.agents), "on")
        self.assertTrue(self.codex.exists())
        hook.apply(self.project, self.roots(self.agents), "off")
        self.assertFalse(self.codex.exists())

    def test_off_with_nothing_present_is_quiet(self) -> None:
        result = hook.apply(self.project, self.roots(self.claude), "off")
        self.assertFalse(result["changed"])
        self.assertEqual(result["hosts"][0]["state"], "absent")
        self.assertFalse(self.settings.exists())

    def test_unanswered_changes_nothing_and_reports_absent(self) -> None:
        result = hook.apply(self.project, self.roots(self.claude), None)
        self.assertFalse(result["changed"])
        self.assertEqual(result["answer"], "unanswered")
        self.assertFalse(hook.report(self.project, self.roots(self.claude), None)["owed"])

    def test_an_unreadable_file_is_reported_and_left_alone(self) -> None:
        self.settings.write_text("{not json")
        result = hook.apply(self.project, self.roots(self.claude), "on")
        self.assertFalse(result["changed"])
        self.assertEqual(result["hosts"][0]["state"], "unreadable")
        self.assertEqual(self.settings.read_text(), "{not json")
        self.assertEqual(hook.report(self.project, self.roots(self.claude), "on")["hosts"][0]["state"], "unreadable")

    def test_a_hook_file_reached_through_a_symlink_is_never_used(self) -> None:
        outside = Path(self.tmp.name) / "outside.json"
        outside.write_text("{}")
        self.settings.symlink_to(outside)
        result = hook.apply(self.project, self.roots(self.claude), "on")
        self.assertEqual(result["hosts"][0]["state"], "unreadable")
        self.assertEqual(outside.read_text(), "{}")
        self.settings.unlink()
        # A linked folder below the project root counts too.
        codex_dir = self.project / ".codex"
        real = Path(self.tmp.name) / "real-codex"
        real.mkdir()
        codex_dir.symlink_to(real)
        result = hook.apply(self.project, self.roots(self.agents), "on")
        self.assertEqual(result["hosts"][0]["state"], "unreadable")
        self.assertEqual(list(real.iterdir()), [])

    def test_report_owes_setup_when_the_file_disagrees_with_the_answer(self) -> None:
        self.assertTrue(hook.report(self.project, self.roots(self.claude), "on")["owed"])
        self.assertFalse(hook.report(self.project, self.roots(self.claude), "off")["owed"])
        hook.apply(self.project, self.roots(self.claude), "on")
        self.assertFalse(hook.report(self.project, self.roots(self.claude), "on")["owed"])
        self.assertTrue(hook.report(self.project, self.roots(self.claude), "off")["owed"])


if __name__ == "__main__":
    unittest.main()
