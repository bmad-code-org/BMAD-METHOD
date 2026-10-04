#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Unit tests for resolve_party.py — merge, alias, override, group resolution."""

import contextlib
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import resolve_party as rp  # noqa: E402

AGENTS = {
    "bmad-agent-analyst": {"name": "Mary", "icon": "📊", "title": "Analyst"},
    "bmad-agent-pm": {"name": "John", "icon": "📋", "title": "PM"},
}


class TestAlias(unittest.TestCase):
    def test_strips_known_prefixes(self):
        self.assertEqual(rp._alias("bmad-agent-analyst"), "analyst")
        self.assertEqual(rp._alias("bmad-foo"), "foo")

    def test_passes_through_unprefixed(self):
        self.assertEqual(rp._alias("morpheus"), "morpheus")


class TestBuildCollective(unittest.TestCase):
    def test_installed_agents_indexed_by_code_alias_and_name(self):
        col, idx, _ = rp.build_collective(AGENTS, [])
        self.assertEqual(set(col), {"bmad-agent-analyst", "bmad-agent-pm"})
        self.assertEqual(idx["analyst"], "bmad-agent-analyst")      # alias
        self.assertEqual(idx["mary"], "bmad-agent-analyst")         # name (ci)
        self.assertEqual(idx["bmad-agent-pm"], "bmad-agent-pm")     # full code
        self.assertEqual(col["bmad-agent-analyst"]["source"], "installed")

    def test_custom_member_appends(self):
        col, _, _ = rp.build_collective(AGENTS, [{"code": "morpheus", "name": "Morpheus", "persona": "riddles"}])
        self.assertIn("morpheus", col)
        self.assertEqual(col["morpheus"]["source"], "custom")
        self.assertEqual(col["morpheus"]["persona"], "riddles")

    def test_custom_overrides_installed_by_alias(self):
        col, _, _ = rp.build_collective(AGENTS, [{"code": "analyst", "name": "Mary-Custom", "persona": "p"}])
        # Override lands on the canonical installed code, not a new "analyst" entry.
        self.assertNotIn("analyst", col)
        self.assertEqual(col["bmad-agent-analyst"]["source"], "custom")
        self.assertEqual(col["bmad-agent-analyst"]["name"], "Mary-Custom")

    def test_member_without_code_skipped(self):
        col, _, _ = rp.build_collective(AGENTS, [{"name": "Nameless"}])
        self.assertEqual(set(col), {"bmad-agent-analyst", "bmad-agent-pm"})


class TestResolveMembers(unittest.TestCase):
    def setUp(self):
        self.col, self.idx, _ = rp.build_collective(AGENTS, [{"code": "morpheus", "name": "Morpheus"}])

    def test_resolves_in_listed_order_and_flags_unknowns(self):
        resolved, unresolved = rp.resolve_members(["morpheus", "analyst", "ghost"], self.col, self.idx)
        self.assertEqual([m["code"] for m in resolved], ["morpheus", "bmad-agent-analyst"])
        self.assertEqual(unresolved, ["ghost"])

    def test_empty(self):
        self.assertEqual(rp.resolve_members([], self.col, self.idx), ([], []))


class TestGroups(unittest.TestCase):
    GROUPS = [
        {"id": "wr", "name": "Writers", "members": ["analyst", "morpheus"]},
        {"id": "bad"},  # no name -> falls back to id; no members -> count 0
        {"name": "no-id"},  # dropped from menu
    ]

    def test_menu_is_names_only_with_counts_and_open_cast_flag(self):
        menu = rp.group_menu(self.GROUPS)
        self.assertEqual(menu, [
            {"id": "wr", "name": "Writers", "member_count": 2},
            {"id": "bad", "name": "bad", "member_count": 0, "open_cast": True},
        ])

    def test_find_group(self):
        self.assertEqual(rp.find_group(self.GROUPS, "wr")["name"], "Writers")
        self.assertIsNone(rp.find_group(self.GROUPS, "missing"))


class TestGroupDetail(unittest.TestCase):
    def setUp(self):
        self.col, self.idx, _ = rp.build_collective(AGENTS, [{"code": "morpheus", "name": "Morpheus"}])

    def test_scene_passes_through_when_present(self):
        g = {"id": "tos-10-forward", "name": "Ten Forward", "members": ["morpheus"],
             "scene": "Late evening, a few rounds in."}
        d = rp.group_detail(g, self.col, self.idx)
        self.assertEqual(d["scene"], "Late evening, a few rounds in.")
        self.assertEqual([m["code"] for m in d["members"]], ["morpheus"])

    def test_scene_omitted_when_absent_or_empty(self):
        for g in ({"id": "g", "members": ["morpheus"]},
                  {"id": "g", "members": ["morpheus"], "scene": ""}):
            self.assertNotIn("scene", rp.group_detail(g, self.col, self.idx))

    def test_anchored_group_is_not_open_cast(self):
        g = {"id": "g", "members": ["morpheus"]}
        self.assertNotIn("open_cast", rp.group_detail(g, self.col, self.idx))

    def test_open_cast_group_flagged_with_empty_members(self):
        g = {"id": "rebels", "name": "Star Wars Rebels",
             "scene": "Figures from the Rebels universe drop in as the topic calls for them."}
        d = rp.group_detail(g, self.col, self.idx)
        self.assertTrue(d["open_cast"])
        self.assertEqual(d["members"], [])
        self.assertEqual(d["scene"][:7], "Figures")

    def test_memory_enabled_follows_group_flag_and_defaults_off(self):
        on = rp.group_detail({"id": "g", "members": ["morpheus"], "memory": True}, self.col, self.idx)
        self.assertTrue(on["memory_enabled"])
        off = rp.group_detail({"id": "g", "members": ["morpheus"], "memory": False}, self.col, self.idx)
        self.assertFalse(off["memory_enabled"])
        absent = rp.group_detail({"id": "g", "members": ["morpheus"]}, self.col, self.idx)
        self.assertFalse(absent["memory_enabled"])  # opt-in per named group


class TestInstalledCodesIsDefaultRoom(unittest.TestCase):
    """The default room is installed agents only; pure customs stay in the pool."""

    def test_pure_custom_excluded_override_kept_in_default_room(self):
        col, _, installed = rp.build_collective(AGENTS, [
            {"code": "morpheus", "name": "Morpheus"},                 # pure custom
            {"code": "analyst", "name": "Mary-Custom", "persona": "p"},  # override
            {"code": "sec-hawk", "name": "Vex"},                      # shipped crew member
        ])
        # Pure customs are in the pool...
        self.assertIn("morpheus", col)
        self.assertIn("sec-hawk", col)
        # ...but NOT in the default room.
        self.assertEqual(installed, ["bmad-agent-analyst", "bmad-agent-pm"])
        default_room = [col[c]["code"] for c in installed]
        self.assertEqual(default_room, ["bmad-agent-analyst", "bmad-agent-pm"])
        # An override keeps its installed slot (and its custom content).
        self.assertEqual(col["bmad-agent-analyst"]["name"], "Mary-Custom")


class TestDefaultOutput(unittest.TestCase):
    def test_exposes_resolvable_tokens_without_loading_custom_members(self):
        workflow = {
            "party_members": [{"code": "morpheus", "name": "Morpheus"}],
            "party_groups": [],
            "default_party": "",
        }
        out = io.StringIO()
        with (
            patch.object(rp, "load_workflow", return_value=(workflow, True)),
            patch.object(rp, "load_agents", return_value=(AGENTS, True)),
            patch.object(sys, "argv", ["resolve_party.py", "--project-root", ".", "--skill", "skill"]),
            contextlib.redirect_stdout(out),
        ):
            rp.main()

        result = json.loads(out.getvalue())
        self.assertEqual(
            result["resolvable_tokens"],
            ["analyst", "bmad-agent-analyst", "bmad-agent-pm", "john", "mary", "morpheus", "pm"],
        )
        self.assertTrue(result["workflow_resolved"])
        self.assertTrue(result["installed_agents_resolved"])
        self.assertEqual([member["code"] for member in result["members"]], list(AGENTS))

    def test_marks_collision_tokens_incomplete_when_workflow_falls_back(self):
        out = io.StringIO()
        workflow = {"party_members": [], "party_groups": [], "default_party": ""}
        with (
            patch.object(rp, "load_workflow", return_value=(workflow, False)),
            patch.object(rp, "load_agents", return_value=(AGENTS, True)),
            patch.object(sys, "argv", ["resolve_party.py", "--project-root", ".", "--skill", "skill"]),
            contextlib.redirect_stdout(out),
        ):
            rp.main()

        result = json.loads(out.getvalue())
        self.assertFalse(result["workflow_resolved"])
        self.assertIn("analyst", result["resolvable_tokens"])

    def test_marks_installed_tokens_incomplete_when_agent_data_is_invalid(self):
        out = io.StringIO()
        workflow = {"party_members": [], "party_groups": [], "default_party": ""}
        with (
            patch.object(rp, "load_workflow", return_value=(workflow, True)),
            patch.object(rp, "load_agents", return_value=({}, False)),
            patch.object(sys, "argv", ["resolve_party.py", "--project-root", ".", "--skill", "skill"]),
            contextlib.redirect_stdout(out),
        ):
            rp.main()

        result = json.loads(out.getvalue())
        self.assertFalse(result["installed_agents_resolved"])

    def test_exposes_tokens_when_a_default_party_is_configured(self):
        workflow = {
            "party_members": [{"code": "morpheus", "name": "Morpheus"}],
            "party_groups": [{"id": "writers-room", "members": ["analyst"]}],
            "default_party": "writers-room",
        }
        out = io.StringIO()
        with (
            patch.object(rp, "load_workflow", return_value=(workflow, True)),
            patch.object(rp, "load_agents", return_value=(AGENTS, True)),
            patch.object(sys, "argv", ["resolve_party.py", "--project-root", ".", "--skill", "skill"]),
            contextlib.redirect_stdout(out),
        ):
            rp.main()

        result = json.loads(out.getvalue())
        self.assertEqual(result["active"], "writers-room")
        self.assertIn("morpheus", result["resolvable_tokens"])


class TestResolverInvocation(unittest.TestCase):
    """The wrapper knows the project root, so it must not let the resolver
    infer one from the working directory (#2796)."""

    def _captured_command(self, tmp):
        captured = []
        original = rp._run_json
        rp._run_json = lambda cmd: captured.append(cmd) or {"workflow": {}}
        try:
            rp.load_workflow(Path(tmp) / "project", Path(tmp) / "skill")
        finally:
            rp._run_json = original
        return captured[0]

    def test_passes_project_root_to_the_customization_resolver(self):
        with tempfile.TemporaryDirectory() as tmp:
            cmd = self._captured_command(tmp)
            self.assertIn("--project-root", cmd)
            self.assertEqual(cmd[cmd.index("--project-root") + 1], str(Path(tmp) / "project"))


class TestWorkflowFallback(unittest.TestCase):
    def test_uses_the_merged_project_workflow_when_resolver_succeeds(self):
        workflow = {"party_members": [{"code": "project-custom"}]}
        with tempfile.TemporaryDirectory() as tmp:
            err = io.StringIO()
            with (
                patch.object(rp, "_run_json", return_value={"workflow": workflow}),
                contextlib.redirect_stderr(err),
            ):
                resolved_workflow, resolved = rp.load_workflow(Path(tmp) / "project", Path(tmp) / "skill")

        self.assertEqual(resolved_workflow, workflow)
        self.assertTrue(resolved)
        self.assertEqual(err.getvalue(), "")

    def test_falls_back_when_workflow_response_has_the_wrong_type(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            skill.mkdir()
            (skill / "customize.toml").write_text('[workflow]\nparty_members = []\n')
            err = io.StringIO()
            with (
                patch.object(rp, "_run_json", return_value={"workflow": []}),
                contextlib.redirect_stderr(err),
            ):
                workflow, resolved = rp.load_workflow(Path(tmp) / "project", skill)

        self.assertEqual(workflow, {"party_members": []})
        self.assertFalse(resolved)
        self.assertIn("Project overrides may be missing", err.getvalue())

    def test_warns_when_project_overrides_cannot_be_resolved(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            skill.mkdir()
            (skill / "customize.toml").write_text('[workflow]\nparty_members = [{ code = "morpheus" }]\n')
            err = io.StringIO()
            with (
                patch.object(rp, "_run_json", return_value=None),
                contextlib.redirect_stderr(err),
            ):
                workflow, resolved = rp.load_workflow(Path(tmp) / "project", skill)

        self.assertEqual(workflow, {"party_members": [{"code": "morpheus"}]})
        self.assertFalse(resolved)
        self.assertIn("Project overrides may be missing", err.getvalue())


class TestAgentResolution(unittest.TestCase):
    def test_distinguishes_valid_empty_roster_from_invalid_response(self):
        with patch.object(rp, "_run_json", return_value={"agents": {}}):
            self.assertEqual(rp.load_agents(Path("project")), ({}, True))
        with patch.object(rp, "_run_json", return_value={"agents": AGENTS}):
            self.assertEqual(rp.load_agents(Path("project")), (AGENTS, True))
        for response in (
            None,
            False,
            [],
            {},
            {"agents": None},
            {"agents": []},
            {"agents": {"bmad-agent-broken": False}},
        ):
            with self.subTest(response=response), patch.object(rp, "_run_json", return_value=response):
                self.assertEqual(rp.load_agents(Path("project")), ({}, False))


if __name__ == "__main__":
    unittest.main()
