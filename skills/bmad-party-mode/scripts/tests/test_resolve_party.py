#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Unit tests for resolve_party.py — merge, alias, override, group resolution."""

import sys
import tempfile
import unittest
from pathlib import Path

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

    def test_strips_a_module_prefix_before_agent(self):
        self.assertEqual(rp._alias("bmad-cis-agent-storyteller"), "storyteller")


class TestBuildCollective(unittest.TestCase):
    def test_installed_agents_indexed_by_code_alias_and_name(self):
        col, idx, _ = rp.build_collective(AGENTS, [])
        self.assertEqual(set(col), {"bmad-agent-analyst", "bmad-agent-pm"})
        self.assertEqual(idx["analyst"], "bmad-agent-analyst")  # alias
        self.assertEqual(idx["mary"], "bmad-agent-analyst")  # name (ci)
        self.assertEqual(idx["bmad-agent-pm"], "bmad-agent-pm")  # full code
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
        self.assertEqual(
            menu,
            [
                {"id": "wr", "name": "Writers", "member_count": 2},
                {"id": "bad", "name": "bad", "member_count": 0, "open_cast": True},
            ],
        )

    def test_find_group(self):
        self.assertEqual(rp.find_group(self.GROUPS, "wr")["name"], "Writers")
        self.assertIsNone(rp.find_group(self.GROUPS, "missing"))


class TestGroupDetail(unittest.TestCase):
    def setUp(self):
        self.col, self.idx, _ = rp.build_collective(AGENTS, [{"code": "morpheus", "name": "Morpheus"}])

    def test_scene_passes_through_when_present(self):
        g = {
            "id": "tos-10-forward",
            "name": "Ten Forward",
            "members": ["morpheus"],
            "scene": "Late evening, a few rounds in.",
        }
        d = rp.group_detail(g, self.col, self.idx)
        self.assertEqual(d["scene"], "Late evening, a few rounds in.")
        self.assertEqual([m["code"] for m in d["members"]], ["morpheus"])

    def test_scene_omitted_when_absent_or_empty(self):
        for g in ({"id": "g", "members": ["morpheus"]}, {"id": "g", "members": ["morpheus"], "scene": ""}):
            self.assertNotIn("scene", rp.group_detail(g, self.col, self.idx))

    def test_anchored_group_is_not_open_cast(self):
        g = {"id": "g", "members": ["morpheus"]}
        self.assertNotIn("open_cast", rp.group_detail(g, self.col, self.idx))

    def test_open_cast_group_flagged_with_empty_members(self):
        g = {
            "id": "rebels",
            "name": "Star Wars Rebels",
            "scene": "Figures from the Rebels universe drop in as the topic calls for them.",
        }
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
        col, _, installed = rp.build_collective(
            AGENTS,
            [
                {"code": "morpheus", "name": "Morpheus"},  # pure custom
                {"code": "analyst", "name": "Mary-Custom", "persona": "p"},  # override
                {"code": "sec-hawk", "name": "Vex"},  # shipped crew member
            ],
        )
        # Pure customs are in the pool...
        self.assertIn("morpheus", col)
        self.assertIn("sec-hawk", col)
        # ...but NOT in the default room.
        self.assertEqual(installed, ["bmad-agent-analyst", "bmad-agent-pm"])
        default_room = [col[c]["code"] for c in installed]
        self.assertEqual(default_room, ["bmad-agent-analyst", "bmad-agent-pm"])
        # An override keeps its installed slot (and its custom content).
        self.assertEqual(col["bmad-agent-analyst"]["name"], "Mary-Custom")


class TestRoster(unittest.TestCase):
    GUESTS = {
        "pip": {"name": "Pip", "persona": "Asks why."},
        "bmad-agent-dev": {"name": "Amelia", "persona": "Exact.", "skill": "bmad-agent-dev", "installed": False},
    }

    def test_guests_join_the_pool_and_never_the_default_room(self):
        col, idx, installed = rp.build_collective(AGENTS, [], self.GUESTS)
        self.assertEqual(installed, ["bmad-agent-analyst", "bmad-agent-pm"])
        self.assertEqual(col["pip"]["source"], "roster")
        self.assertEqual(idx["amelia"], "bmad-agent-dev")
        self.assertIs(col["bmad-agent-dev"]["installed"], False)

    def test_a_group_can_seat_a_guest_and_an_agent_whose_skill_is_absent(self):
        col, idx, _ = rp.build_collective(AGENTS, [], self.GUESTS)
        detail = rp.group_detail({"id": "room", "members": ["analyst", "pip", "dev"]}, col, idx)
        self.assertEqual([m["name"] for m in detail["members"]], ["Mary", "Pip", "Amelia"])
        self.assertEqual(detail["unresolved"], [])

    def test_a_short_alias_two_codes_claim_resolves_to_neither(self):
        agents = {"bmad-agent-dev": {"name": "Amelia"}, "bmad-cis-agent-dev": {"name": "Devi"}}
        col, idx, _ = rp.build_collective(agents, [])
        members, unresolved = rp.resolve_members(["dev", "bmad-cis-agent-dev", "amelia"], col, idx)
        self.assertEqual([m["name"] for m in members], ["Devi", "Amelia"])
        self.assertEqual(unresolved, ["dev"])

    def test_what_the_roster_could_not_use_is_passed_on(self):
        absent = "module record bmod-demo is not installed; it is named by demo-one; install it with `npx skills add acme/tools --skill bmod-demo`"
        report = {
            "agents": {},
            "problems": [
                {"kind": "member", "problem": "demo: member 'x' is already defined by other"},
                {
                    "kind": "module",
                    "bmod": "bmod-demo",
                    "install": "npx skills add acme/tools --skill bmod-demo",
                    "problem": absent,
                },
            ],
        }
        original = rp._run_json
        rp._run_json = lambda cmd: report
        try:
            problems = rp.load_roster(Path("project"), Path("skill"))[4]
        finally:
            rp._run_json = original
        self.assertEqual(problems, ["demo: member 'x' is already defined by other", absent])

    def test_a_custom_group_replaces_a_roster_group_with_its_id(self):
        groups = rp.merge_groups(
            [{"id": "room", "name": "Shipped"}, {"id": "other", "name": "Other"}], [{"id": "room", "name": "Mine"}]
        )
        self.assertEqual([(g["id"], g["name"]) for g in groups], [("room", "Mine"), ("other", "Other")])

    def test_an_install_from_before_rosters_keeps_its_description_as_the_persona(self):
        col, _, _ = rp.build_collective({"bmad-agent-pm": {"name": "John", "description": "Asks why."}}, [])
        self.assertEqual(col["bmad-agent-pm"]["persona"], "Asks why.")


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


class TestArguments(unittest.TestCase):
    def test_group_is_an_alias_of_party(self):
        for flag in ("--party", "--group"):
            args = rp.build_parser().parse_args(["--project-root", "p", "--skill", "s", flag, "writers-room"])
            self.assertEqual(args.party, "writers-room")


if __name__ == "__main__":
    unittest.main()
