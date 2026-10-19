import json
import shutil
import subprocess
import sys
import tempfile
import tomllib
import unittest
from pathlib import Path

from test_bmad_setup import (
    REPO_ROOT,
    module_answers_args,
    setup_report,
    snapshot,
    write,
    write_bmod,
    write_core,
    write_dest_bmad,
    write_skill,
)

MIGRATE_V6_PY = REPO_ROOT / "skills" / "bmad" / "scripts" / "migrate_v6.py"


class MigrateV6Tests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name).resolve()
        self.project = self.root / "project"
        self.installed = self.project / ".agents" / "skills"
        self.installed.mkdir(parents=True)
        self.skill = write_dest_bmad(self.installed)
        shutil.copy2(MIGRATE_V6_PY, self.skill / "scripts" / "migrate_v6.py")
        write_core(self.installed)
        write_bmod(
            self.installed,
            "bmod-method",
            "method",
            skills=("bmad-agent-po",),
            questions=({"key": "store", "prompt": "Store?", "default": "repo"},),
        )
        write(self.installed / "bmad-agent-po" / "SKILL.md", "---\nname: bmad-agent-po\n---\n")
        setup_report(self, self.project, self.skill, *module_answers_args(self.project, {"method": {"store": "repo"}}))
        self.bmad = self.project / "_bmad"

    def run_migrate(self, *extra: str) -> subprocess.CompletedProcess[str]:
        command = [sys.executable, str(self.skill / "scripts" / "migrate_v6.py"), "--project-root", str(self.project)]
        return subprocess.run(
            [*command, "--skill", str(self.skill), *extra], text=True, capture_output=True, check=False
        )

    def migrate(self, *extra: str) -> dict:
        result = self.run_migrate(*extra)
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        return json.loads(result.stdout)

    def write_v6_traces(self) -> None:
        config = self.bmad / "config.toml"
        text = config.read_text(encoding="utf-8").replace("[core]\n", '[core]\nuser_name = "Ann"\n', 1)
        write(config, text + '\n[modules.bmm]\nplanning_artifacts = "{project-root}/_bmad-output/planning-artifacts"\n')
        write(self.bmad / "config.user.toml", '[core]\nuser_name = "Ann"\n')
        write(self.bmad / "_config" / "manifest.yaml", "installation: v6\n")
        write(self.bmad / "core" / "v6-shims" / "shim.md", "shim\n")
        write(
            self.bmad / "custom" / "config.user.toml",
            '# mine\n[core]\nactive_initiative = "initiative-a"\ncommunication_language = "Hungarian"\n',
        )
        write(self.bmad / "custom" / "bmad-agent-po.toml", "[workflow]\nkeep = true\n")
        write(self.bmad / "custom" / "bmad-sprint-planning.user.toml", "[workflow]\nold = true\n")
        write(self.bmad / "custom" / "ticketing-store-config.toml", "kind = 'repo'\n")

    def test_status_lists_v6_traces_without_changing_them(self):
        self.write_v6_traces()
        before = snapshot(self.project)

        report = self.migrate()

        self.assertEqual(snapshot(self.project), before)
        self.assertEqual(report["legacy_leftovers"], ["_config/manifest.yaml", "config.user.toml", "core/v6-shims"])
        self.assertEqual(
            report["stale_config_keys"],
            [
                {"file": "_bmad/config.toml", "key": "core.user_name"},
                {"file": "_bmad/config.toml", "key": "modules.bmm.planning_artifacts"},
                {"file": "_bmad/custom/config.user.toml", "key": "core.communication_language"},
            ],
        )
        self.assertEqual(report["unused_customizations"], ["_bmad/custom/bmad-sprint-planning.user.toml"])

    def test_clean_backs_up_then_removes_only_what_v7_does_not_read(self):
        self.write_v6_traces()
        original = snapshot(self.bmad)

        report = self.migrate("--clean")

        backup = self.project / report["backup"]
        self.assertTrue(backup.name.startswith(".v6-v7-migration-backup-"))
        self.assertEqual(snapshot(backup / "_bmad"), original)
        self.assertFalse((self.bmad / "_config").exists())
        self.assertFalse((self.bmad / "core").exists())
        self.assertFalse((self.bmad / "config.user.toml").exists())
        self.assertFalse((self.bmad / "custom" / "bmad-sprint-planning.user.toml").exists())
        self.assertTrue((self.bmad / "custom" / "bmad-agent-po.toml").exists())
        self.assertTrue((self.bmad / "custom" / "ticketing-store-config.toml").exists())
        user = (self.bmad / "custom" / "config.user.toml").read_text(encoding="utf-8")
        self.assertEqual(user, '# mine\n[core]\nactive_initiative = "initiative-a"\n')
        team = tomllib.loads((self.bmad / "config.toml").read_text(encoding="utf-8"))
        self.assertNotIn("user_name", team["core"])
        self.assertNotIn("bmm", team["modules"])
        self.assertEqual(team["modules"]["method"], {"store": "repo"})
        self.assertIn("bmad-agent-pm", team["agents"])

        after = self.migrate()
        self.assertEqual(
            (after["legacy_leftovers"], after["stale_config_keys"], after["unused_customizations"]), ([], [], [])
        )

    def test_only_listed_v6_keys_are_removed(self):
        user = self.bmad / "custom" / "config.user.toml"
        text = '[core]\nuser_name = "Ann"\nfuture_key = "x"\n\n[modules.bmm]\nproject_knowledge = "docs"\nnew_setting = 1\n'
        write(user, text)

        report = self.migrate("--clean")

        self.assertEqual(
            report["removed_keys"],
            [
                {"file": "_bmad/custom/config.user.toml", "key": "core.user_name"},
                {"file": "_bmad/custom/config.user.toml", "key": "modules.bmm.project_knowledge"},
            ],
        )
        self.assertEqual(
            tomllib.loads(user.read_text(encoding="utf-8")),
            {"core": {"future_key": "x"}, "modules": {"bmm": {"new_setting": 1}}},
        )

    def test_clean_with_nothing_to_remove_writes_nothing(self):
        before = snapshot(self.project)

        report = self.migrate("--clean")

        self.assertIsNone(report["backup"])
        self.assertEqual(snapshot(self.project), before)

    def test_the_backup_ignores_itself(self):
        self.write_v6_traces()

        report = self.migrate("--clean")

        self.assertEqual((self.project / report["backup"] / ".gitignore").read_text(encoding="utf-8"), "*\n")

    def test_a_multi_line_value_is_cut_without_losing_comments(self):
        user = self.bmad / "custom" / "config.user.toml"
        write(
            user,
            '# mine\n[core]\nactive_initiative = "initiative-a"\n'
            'user_name = """\nAnn\nB.\n"""\n# kept\nproject_name = "p"\n',
        )

        self.migrate("--clean")

        self.assertEqual(
            user.read_text(encoding="utf-8"),
            '# mine\n[core]\nactive_initiative = "initiative-a"\n# kept\nproject_name = "p"\n',
        )

    def test_clean_refuses_while_a_module_record_is_missing(self):
        self.write_v6_traces()
        write_skill(self.installed, "extra-skill", "bmod-extra")
        before = snapshot(self.project)

        result = self.run_migrate("--clean")

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("module record is missing", result.stderr)
        self.assertEqual(snapshot(self.project), before)

    def test_a_link_out_of_bmad_is_not_cleaned(self):
        outside = self.root / "elsewhere"
        write(outside / "v6-shims" / "shim.md", "shim\n")
        (self.bmad / "core").symlink_to(outside, target_is_directory=True)

        report = self.migrate()
        self.migrate("--clean")

        self.assertEqual(report["legacy_leftovers"], [])
        self.assertTrue((outside / "v6-shims" / "shim.md").exists())

    def test_retired_customization_keys_are_dropped_with_a_note(self):
        write(
            self.installed / "bmod-method" / "retired.toml", 'renamed = [{ from = "bmad-old", to = "bmad-agent-po" }]\n'
        )
        custom = self.bmad / "custom"
        write(
            custom / "bmad-agent-po.toml",
            '[workflow]\n# mine\nstory_template = "x.md"\npublication = "on_start"\non_complete = "say done"\n',
        )
        write(custom / "bmad-agent-po.user.toml", '[workflow]\nspec_output_path = "{output_folder}"\n')
        write(custom / "bmad-old.toml", '[workflow]\nrun_folder_pattern = "x-{slug}"\n')

        report = self.migrate()
        self.assertEqual(
            report["stale_config_keys"],
            [
                {"file": "_bmad/custom/bmad-agent-po.toml", "key": "workflow.story_template"},
                {"file": "_bmad/custom/bmad-agent-po.toml", "key": "workflow.on_complete"},
                {"file": "_bmad/custom/bmad-agent-po.user.toml", "key": "workflow.spec_output_path"},
                {"file": "_bmad/custom/bmad-old.toml", "key": "workflow.run_folder_pattern"},
            ],
        )

        cleaned = self.migrate("--clean")
        self.assertEqual(
            cleaned["removed_keys"],
            report["stale_config_keys"],
        )
        self.assertEqual(len(cleaned["notes"]), 3)
        self.assertIn("_bmad/custom/bmad-agent-po.toml: story_template, on_complete", cleaned["notes"][0])
        self.assertIn("ticket_template", cleaned["notes"][0])
        self.assertIn("<capability>_after", cleaned["notes"][0])
        self.assertEqual(
            (custom / "bmad-agent-po.toml").read_text(encoding="utf-8"),
            '[workflow]\n# mine\npublication = "on_start"\n',
        )
        self.assertEqual(tomllib.loads((custom / "bmad-agent-po.user.toml").read_text(encoding="utf-8")), {})
        self.assertEqual(tomllib.loads((custom / "bmad-old.toml").read_text(encoding="utf-8")), {})
        self.assertEqual(self.migrate()["notes"], [])

    def test_activation_and_fact_keys_move_from_workflow_to_agent(self):
        custom = self.bmad / "custom"
        write(
            custom / "bmad-agent-po.toml",
            '[workflow]\n# mine\npersistent_facts = ["file:docs/*.md"]\npublication = "on_start"\n'
            'activation_steps_append = ["say hi"]\n',
        )
        write(
            custom / "bmad-agent-po.user.toml",
            '[agent]\npersistent_facts = ["team fact"]\n\n[workflow]\npersistent_facts = ["my fact"]\n',
        )

        report = self.migrate()
        self.assertEqual(
            report["stale_config_keys"],
            [
                {"file": "_bmad/custom/bmad-agent-po.toml", "key": "workflow.activation_steps_append"},
                {"file": "_bmad/custom/bmad-agent-po.toml", "key": "workflow.persistent_facts"},
                {"file": "_bmad/custom/bmad-agent-po.user.toml", "key": "workflow.persistent_facts"},
            ],
        )

        cleaned = self.migrate("--clean")
        self.assertEqual(cleaned["removed_keys"], [])
        self.assertEqual(
            [(moved["file"], moved["to"]) for moved in cleaned["moved_keys"]],
            [
                ("_bmad/custom/bmad-agent-po.toml", "agent.activation_steps_append"),
                ("_bmad/custom/bmad-agent-po.toml", "agent.persistent_facts"),
                ("_bmad/custom/bmad-agent-po.user.toml", "agent.persistent_facts"),
            ],
        )
        self.assertIn("moved from [workflow] to [agent]", cleaned["notes"][0])
        team = (custom / "bmad-agent-po.toml").read_text(encoding="utf-8")
        self.assertIn("# mine", team)
        self.assertEqual(
            tomllib.loads(team),
            {
                "workflow": {"publication": "on_start"},
                "agent": {"activation_steps_append": ["say hi"], "persistent_facts": ["file:docs/*.md"]},
            },
        )
        self.assertEqual(
            tomllib.loads((custom / "bmad-agent-po.user.toml").read_text(encoding="utf-8")),
            {"agent": {"persistent_facts": ["team fact", "my fact"]}},
        )
        self.assertEqual(self.migrate()["stale_config_keys"], [])

    def test_every_classic_installer_trace_is_listed(self):
        leftovers = (
            "_config/manifest.yaml",
            "_config/bmad-help.csv",
            "config.user.toml",
            "core/config.yaml",
            "core/module-help.csv",
            "core/v6-shims/README.md",
            "bmm/config.yaml",
            "bmm/module-help.csv",
            "bmm/v6-shims/README.md",
        )
        for relative in leftovers:
            write(self.bmad / relative)

        self.assertEqual(
            self.migrate()["legacy_leftovers"],
            [
                "_config/manifest.yaml",
                "_config/bmad-help.csv",
                "config.user.toml",
                "core/config.yaml",
                "core/module-help.csv",
                "core/v6-shims",
                "bmm/config.yaml",
                "bmm/module-help.csv",
                "bmm/v6-shims",
            ],
        )


def spec_frontmatter(**lists: str) -> str:
    """The pre-release spec's frontmatter. Built, not spelled out: the retired keys must not appear as text outside the migration rules."""
    return "---\nid: SPEC-ball\n" + "".join(f"{key}: {value}\n" for key, value in lists.items()) + "---\n"


SPEC_BODY = """
# Ball flight physics

## Why

Players leave when the ball flies wrong.

## Capabilities

- **CAP-1**
  - **intent:** A player sees the ball follow a physically plausible arc.
  - **success:** Carry distance within 3% of the reference table.
- **CAP-2**
  - **intent:** A player sets the launch angle and sees the arc change.
  - **success:** The arc updates within one frame.

## Constraints

- Simulation runs at 120 Hz on the minimum device.

## Non-goals

- Wind.

## Success signal

- A tester cannot tell the arc from the reference footage.

## Assumptions

- Assumed metric units.

## Open Questions

- Is spin in scope for CAP-2?
"""

SPEC_BALL = (
    spec_frontmatter(companions="[glossary.md, ../../ux-golf/DESIGN.md]", sources="[../../prd-golf/prd-golf.md]")
    + SPEC_BODY
)

MEMLOG_BALL = """\
---
topic: Ball flight physics
updated: 2026-09-01T10:00
---

- (capability) CAP-1 plausible arc
- (decision) metric units
- (capability) CAP-2 launch angle
"""

EPIC_BALL = """\
---
type: epic
title: "Ball flight"
parent: initiative-golf
covers: [R2]
after: []
assignee: ""
risk: medium
---

# Ball flight

## Description

The spec at spec-ball/ owns the capabilities.

## Outcome

Players see a realistic flight; the spec's success signal is the measure.

## Requirements

See spec-ball/spec-ball.md.

## Done when

1. Every capability works end to end.

## Boundaries

The physics engine. Not rendering (epic-render).

## References

- parent — _bmad-output/initiative-golf/initiative-golf.md, section Requirements
- spec — _bmad-output/initiative-golf/epic-ball/spec-ball/spec-ball.md

## Notes

- Decision: metric units (2026-09-01).
"""


def memlog_entries(path: Path) -> list[str]:
    body = path.read_text(encoding="utf-8").split("---\n", 2)[2]
    return [line for line in body.splitlines() if line.startswith("- ")]


def reference_paths(path: Path) -> list[str]:
    section = path.read_text(encoding="utf-8").split("## References\n", 1)[1].split("\n## ", 1)[0]
    return [line.split(" — ", 1)[1].split(",", 1)[0].strip() for line in section.splitlines() if line.startswith("- ")]


class FoldSpecsTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.project = Path(temp.name).resolve() / "project"
        self.store = self.project / "_bmad-output"
        self.initiative = self.store / "initiative-golf"
        write(self.initiative / "initiative-golf.md", "---\ntype: initiative\n---\n\n# Golf\n")
        write(self.initiative / "ux-golf" / "DESIGN.md", "design\n")
        write(self.initiative / "prd-golf" / "prd-golf.md", "prd\n")

    def fold(self) -> dict:
        command = [
            sys.executable,
            str(MIGRATE_V6_PY),
            "--project-root",
            str(self.project),
            "--skill",
            str(self.project),
        ]
        result = subprocess.run(
            [*command, "--fold-specs", str(self.store)], text=True, capture_output=True, check=False
        )
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        return json.loads(result.stdout)

    def assert_references_resolve(self, ticket: Path) -> None:
        for location in reference_paths(ticket):
            self.assertTrue(
                (ticket.parent / location).exists() or (self.project / location).exists(),
                msg=f"{ticket.name}: {location} does not resolve",
            )

    def write_epic_with_spec(self) -> Path:
        epic = self.initiative / "epic-ball"
        write(epic / "epic-ball.md", EPIC_BALL)
        write(
            epic / "tickets.toml",
            '[[entry]]\nid = 1\ntype = "story"\ntitle = "Arc"\ncovers = ["CAP-1"]\n\n'
            '[[entry]]\nid = 2\ntype = "story"\ntitle = "Launch angle"\ncovers = ["CAP-2"]\n',
        )
        write(
            epic / "story-launch-angle.md",
            "---\nid: 2\ntype: story\ncovers: [CAP-2]\n---\n\n# Launch angle\n\n## References\n\n"
            "- spec — spec-ball/spec-ball.md, CAP-2\n",
        )
        write(epic / "spec-ball" / "spec-ball.md", SPEC_BALL)
        write(epic / "spec-ball" / ".memlog.md", MEMLOG_BALL)
        write(epic / "spec-ball" / "glossary.md", "Carry: distance in the air.\n")
        return epic

    def test_a_spec_folder_inside_a_ticket_folds_into_it(self):
        epic = self.write_epic_with_spec()

        report = self.fold()

        (fold,) = report["folded"]
        self.assertEqual(report["problems"], [])
        self.assertEqual(fold["ids"], {"CAP-1": "R1", "CAP-2": "R2"})
        self.assertFalse((epic / "spec-ball").exists())
        self.assertEqual((epic / "glossary.md").read_text(encoding="utf-8"), "Carry: distance in the air.\n")
        self.assertEqual(
            memlog_entries(epic / ".memlog.md"),
            [
                "- (capability) CAP-1 plausible arc",
                "- (decision) metric units",
                "- (capability) CAP-2 launch angle",
                "- (note) why, from spec-ball: Players leave when the ball flies wrong.",
                "- (note) success signal, from spec-ball: A tester cannot tell the arc from the reference footage.",
                "- (event) folded spec-ball/ into epic-ball.md; CAP-1 is R1, CAP-2 is R2",
            ],
        )
        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertIn("covers: [R2]\nafter: []", text)
        self.assertIn(
            "sources: [_bmad-output/initiative-golf/prd-golf/prd-golf.md]\n"
            "companions: [_bmad-output/initiative-golf/epic-ball/glossary.md, "
            "_bmad-output/initiative-golf/ux-golf/DESIGN.md]\n---",
            text,
        )
        self.assertIn(
            "## Requirements\n\n"
            "- R1 (CAP-1): A player sees the ball follow a physically plausible arc. "
            "Success: Carry distance within 3% of the reference table.\n"
            "- R2 (CAP-2): A player sets the launch angle and sees the arc change. "
            "Success: The arc updates within one frame.\n\n"
            "## Constraints\n\n- Simulation runs at 120 Hz on the minimum device.\n\n## Done when",
            text,
        )
        self.assertIn("Not rendering (epic-render).\n\n- Non-goal: Wind.\n\n## References", text)
        self.assertIn(
            "## References\n\n"
            "- parent — _bmad-output/initiative-golf/initiative-golf.md, section Requirements\n"
            "- companion — glossary.md\n"
            "- design — _bmad-output/initiative-golf/ux-golf/DESIGN.md\n\n## Notes",
            text,
        )
        self.assertIn(
            "- Decision: metric units (2026-09-01).\n- Assumption: Assumed metric units.\n- Open question: Is spin in scope for R2?\n",
            text,
        )
        self.assertNotIn("CAP-", (epic / "tickets.toml").read_text(encoding="utf-8"))
        self.assertIn('covers = ["R2"]', (epic / "tickets.toml").read_text(encoding="utf-8"))
        story = (epic / "story-launch-angle.md").read_text(encoding="utf-8")
        self.assertIn("covers: [R2]", story)
        self.assertIn("- spec — epic-ball.md, R2\n", story)
        self.assert_references_resolve(epic / "epic-ball.md")
        self.assert_references_resolve(epic / "story-launch-angle.md")
        self.assertEqual(self.fold()["folded"], [])

    def test_a_spec_folder_in_an_epic_of_the_tickets_layout_folds_and_maps_the_epics_tickets(self):
        epic = self.initiative / "tickets" / "epic-ball"
        write(
            epic / "epic-ball.md", EPIC_BALL.replace("initiative-golf/epic-ball/", "initiative-golf/tickets/epic-ball/")
        )
        write(
            epic / "tickets" / "tickets.toml",
            '[[entry]]\nid = 2\ntype = "story"\ntitle = "Launch angle"\ncovers = ["CAP-2"]\n',
        )
        write(
            epic / "tickets" / "story-launch-angle.md",
            "---\nid: 2\ntype: story\ncovers: [CAP-2]\n---\n\n# Launch angle\n\n## References\n\n"
            "- spec — ../spec-ball/spec-ball.md, CAP-2\n",
        )
        write(
            epic / "spec-ball" / "spec-ball.md",
            spec_frontmatter(companions="[glossary.md]", sources="[../../../prd-golf/prd-golf.md]") + SPEC_BODY,
        )
        write(epic / "spec-ball" / "glossary.md", "Carry: distance in the air.\n")

        (fold,) = self.fold()["folded"]

        self.assertEqual(fold["ticket"], "_bmad-output/initiative-golf/tickets/epic-ball/epic-ball.md")
        self.assertEqual(fold["companions"], ["_bmad-output/initiative-golf/tickets/epic-ball/glossary.md"])
        self.assertFalse((epic / "spec-ball").exists())
        self.assertIn('covers = ["R2"]', (epic / "tickets" / "tickets.toml").read_text(encoding="utf-8"))
        story = (epic / "tickets" / "story-launch-angle.md").read_text(encoding="utf-8")
        self.assertIn("covers: [R2]", story)
        self.assertIn("- spec — ../epic-ball.md, R2\n", story)
        self.assert_references_resolve(epic / "epic-ball.md")
        self.assert_references_resolve(epic / "tickets" / "story-launch-angle.md")

    def test_a_same_named_spec_in_another_epic_keeps_its_references(self):
        self.write_epic_with_spec()
        other = self.initiative / "epic-putt"
        write(
            other / "epic-putt.md",
            EPIC_BALL.replace("epic-ball", "epic-putt").replace("See spec-ball/spec-ball.md.", "- R1: Putts roll."),
        )
        write(
            other / "story-green.md", "---\nid: 1\n---\n\n# Green\n\n## References\n\n- spec — spec-ball/spec-ball.md\n"
        )
        write(other / "spec-ball" / "spec-ball.md", spec_frontmatter(companions="[]", sources="[]") + SPEC_BODY)

        report = self.fold()

        self.assertEqual(len(report["folded"]), 2, msg=report)
        self.assertIn("- spec — epic-putt.md\n", (other / "story-green.md").read_text(encoding="utf-8"))
        self.assertNotIn("epic-ball", (other / "epic-putt.md").read_text(encoding="utf-8"))
        self.assertIn(
            "- spec — epic-ball.md, R2\n",
            (self.initiative / "epic-ball" / "story-launch-angle.md").read_text(encoding="utf-8"),
        )

    def test_a_nested_companion_keeps_its_path_below_the_ticket(self):
        epic = self.write_epic_with_spec()
        write(
            epic / "spec-ball" / "spec-ball.md",
            spec_frontmatter(companions="[details/table.md]", sources="[]") + SPEC_BODY,
        )
        write(epic / "spec-ball" / "details" / "table.md", "| carry |\n")

        (fold,) = self.fold()["folded"]

        self.assertEqual((epic / "details" / "table.md").read_text(encoding="utf-8"), "| carry |\n")
        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertIn("companions: [_bmad-output/initiative-golf/epic-ball/details/table.md]\n", text)
        self.assertIn("- companion — details/table.md\n", text)
        self.assertNotIn("spec-ball/details", text)
        self.assert_references_resolve(epic / "epic-ball.md")

    def test_a_block_list_in_the_tickets_frontmatter_is_replaced_whole(self):
        epic = self.write_epic_with_spec()
        write(
            epic / "epic-ball.md",
            EPIC_BALL.replace("after: []\n", "after: []\nsources:\n  - ../initiative-golf.md\n"),
        )

        self.fold()

        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertIn(
            "sources: [../initiative-golf.md, _bmad-output/initiative-golf/prd-golf/prd-golf.md]\ncompanions:", text
        )
        self.assertNotIn("  - ../initiative-golf.md", text)

    def test_a_store_outside_the_project_folds(self):
        outside = self.project.parent / "plans"
        shutil.move(self.store, outside)
        self.store = outside
        self.initiative = outside / "initiative-golf"
        epic = self.write_epic_with_spec()

        report = self.fold()

        self.assertEqual(report["problems"], [])
        (fold,) = report["folded"]
        self.assertEqual(fold["ticket"], (epic / "epic-ball.md").as_posix())
        self.assertFalse((epic / "spec-ball").exists())

    def test_the_spec_ids_follow_the_requirements_a_ticket_already_has(self):
        epic = self.write_epic_with_spec()
        write(
            epic / "epic-ball.md",
            EPIC_BALL.replace("See spec-ball/spec-ball.md.", "- R1 (parent R2): The arc is real."),
        )

        (fold,) = self.fold()["folded"]

        self.assertEqual(fold["ids"], {"CAP-1": "R2", "CAP-2": "R3"})
        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertIn("- R1 (parent R2): The arc is real.\n- R2 (CAP-1): ", text)
        self.assertIn('covers = ["R3"]', (epic / "tickets.toml").read_text(encoding="utf-8"))

    def test_the_tickets_own_lines_stay_when_prose_beside_them_names_the_folder(self):
        epic = self.write_epic_with_spec()
        write(
            epic / "epic-ball.md",
            EPIC_BALL.replace(
                "See spec-ball/spec-ball.md.",
                "- R1 (parent R2): The arc is real.\n\nThe rest is in spec-ball/spec-ball.md.",
            ),
        )

        (fold,) = self.fold()["folded"]

        self.assertEqual(fold["ids"], {"CAP-1": "R2", "CAP-2": "R3"})
        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertIn("## Requirements\n\n- R1 (parent R2): The arc is real.\n- R2 (CAP-1): ", text)
        self.assertNotIn("spec-ball", text.split("## Requirements", 1)[1].split("## Constraints", 1)[0])
        self.assertIn('covers = ["R3"]', (epic / "tickets.toml").read_text(encoding="utf-8"))

    def test_requirements_a_ticket_wrote_in_another_form_are_kept(self):
        epic = self.write_epic_with_spec()
        write(
            epic / "epic-ball.md",
            EPIC_BALL.replace(
                "See spec-ball/spec-ball.md.", "- E1 (R2): The arc is real.\n- E2 (R2): The angle is set."
            ),
        )

        (fold,) = self.fold()["folded"]

        self.assertEqual(fold["ids"], {"CAP-1": "R1", "CAP-2": "R2"})
        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertIn("- E1 (R2): The arc is real.\n- E2 (R2): The angle is set.\n- R1 (CAP-1): ", text)

    def test_dot_files_in_the_spec_folder_are_not_companions(self):
        epic = self.write_epic_with_spec()
        write(epic / "spec-ball" / ".DS_Store", "")
        write(epic / ".DS_Store", "")

        report = self.fold()

        (fold,) = report["folded"]
        self.assertEqual(report["problems"], [])
        self.assertEqual(fold["companions"], ["_bmad-output/initiative-golf/epic-ball/glossary.md"])
        self.assertFalse((epic / "spec-ball").exists())

    def test_a_loose_spec_folder_becomes_a_backlog_story(self):
        loose = self.store / "spec-caddie"
        write(
            loose / "spec-caddie.md",
            spec_frontmatter(companions="[notes.md]", sources="[]")
            + SPEC_BODY.replace("# Ball flight physics", "# Caddie advice"),
        )
        write(loose / ".memlog.md", MEMLOG_BALL)
        write(loose / "notes.md", "notes\n")
        write(self.store / "backlog" / "bug-slice.md", "---\nid: 4\ntype: bug\n---\n\n# Slice\n")
        write(
            self.initiative / "initiative-golf.md",
            "---\ntype: initiative\n---\n\n# Golf\n\n## References\n\n- spec — _bmad-output/spec-caddie/spec-caddie.md\n",
        )

        report = self.fold()

        (fold,) = report["folded"]
        self.assertEqual(fold["ticket"], "_bmad-output/backlog/story-caddie.md")
        self.assertFalse(loose.exists())
        story = self.store / "backlog" / "story-caddie.md"
        text = story.read_text(encoding="utf-8")
        self.assertTrue(
            text.startswith(
                '---\nid: 5\ntype: story\ntitle: "Caddie advice"\nparent: none\ncovers: []\nsources: []\n'
                "companions: [_bmad-output/backlog/notes.md]\nafter: []\n"
                "refined: false\nhitl: false\nrisk: low\n---\n\n# Caddie advice\n\n## Description\n\n"
                "Players leave when the ball flies wrong.\n\n## Requirements\n\n- R1 (CAP-1): "
            ),
            msg=text,
        )
        self.assertIn("## Constraints\n\n- Simulation runs", text)
        self.assertIn(
            "## Boundaries\n\n- Non-goal: Wind.\n\n## References\n\n- companion — notes.md\n\n## Notes\n\n- Assumption:",
            text,
        )
        self.assertNotIn("## Outcome", text)
        self.assertEqual((self.store / "backlog" / "notes.md").read_text(encoding="utf-8"), "notes\n")
        entries = memlog_entries(self.store / "backlog" / ".memlog.md")
        self.assertEqual(
            entries[:3],
            ["- (capability) CAP-1 plausible arc", "- (decision) metric units", "- (capability) CAP-2 launch angle"],
        )
        self.assertEqual(entries[-1], "- (event) folded spec-caddie/ into story-caddie.md; CAP-1 is R1, CAP-2 is R2")
        self.assertIn(
            "- spec — _bmad-output/backlog/story-caddie.md",
            (self.initiative / "initiative-golf.md").read_text(encoding="utf-8"),
        )
        self.assert_references_resolve(story)
        self.assert_references_resolve(self.initiative / "initiative-golf.md")

    def test_a_loose_story_takes_the_backlog_next_id_when_it_is_higher(self):
        loose = self.store / "spec-caddie"
        write(loose / "spec-caddie.md", spec_frontmatter(companions="[]", sources="[]") + SPEC_BODY)
        write(loose / ".memlog.md", MEMLOG_BALL)
        write(self.store / "backlog" / "bug-slice.md", "---\nid: 4\ntype: bug\n---\n\n# Slice\n")
        write(self.store / "backlog" / "tickets.toml", "next_id = 9\n")

        self.fold()

        text = (self.store / "backlog" / "story-caddie.md").read_text(encoding="utf-8")
        self.assertTrue(text.startswith("---\nid: 9\n"), msg=text)

    def test_a_companion_whose_name_is_taken_is_reported_and_nothing_moves(self):
        epic = self.write_epic_with_spec()
        write(epic / "glossary.md", "the epic's own\n")
        before = snapshot(self.project)

        report = self.fold()

        self.assertEqual(report["folded"], [])
        self.assertEqual(
            report["problems"],
            [
                {
                    "spec": "_bmad-output/initiative-golf/epic-ball/spec-ball",
                    "problem": "glossary.md already exist(s) beside the ticket",
                }
            ],
        )
        self.assertEqual(snapshot(self.project), before)

    def test_wrapped_lines_in_a_spec_keep_their_text(self):
        epic = self.write_epic_with_spec()
        spec = (epic / "spec-ball" / "spec-ball.md").read_text(encoding="utf-8")
        spec = spec.replace(
            "  - **intent:** A player sees the ball follow a physically plausible arc.",
            "  - **intent:** A player sees the ball follow\n    a physically plausible arc.",
        ).replace(
            "- Simulation runs at 120 Hz on the minimum device.",
            "- Simulation runs at 120 Hz\n  on the minimum device.",
        )
        write(epic / "spec-ball" / "spec-ball.md", spec)

        self.fold()

        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertIn("- R1 (CAP-1): A player sees the ball follow a physically plausible arc. Success:", text)
        self.assertIn("- Simulation runs at 120 Hz on the minimum device.\n", text)

    def test_a_moving_companions_links_still_reach_their_files(self):
        epic = self.write_epic_with_spec()
        write(
            epic / "spec-ball" / "glossary.md",
            "See [the PRD](../../prd-golf/prd-golf.md#carry), spec-ball.md and [details](./details.md).\n",
        )
        write(epic / "spec-ball" / "details.md", "details\n")

        self.fold()

        self.assertEqual(
            (epic / "glossary.md").read_text(encoding="utf-8"),
            "See [the PRD](../prd-golf/prd-golf.md#carry), epic-ball.md and [details](./details.md).\n",
        )

    def test_an_unreadable_file_in_the_store_is_reported_and_nothing_changes(self):
        self.write_epic_with_spec()
        (self.initiative / "notes.md").write_bytes(b"\xff\xfe not utf-8")
        before = snapshot(self.project)

        report = self.fold()

        self.assertEqual(report["folded"], [])
        (problem,) = report["problems"]
        self.assertIn("_bmad-output/initiative-golf/notes.md cannot be read", problem["problem"])
        self.assertEqual(snapshot(self.project), before)

    def test_an_unreadable_memlog_is_reported_and_nothing_changes(self):
        epic = self.write_epic_with_spec()
        write(epic / ".memlog.md", "---\ntopic: Ball\n---\n")
        (epic / "spec-ball" / ".memlog.md").write_bytes(b"\xff\xfe not utf-8")
        before = snapshot(self.project)

        report = self.fold()

        self.assertEqual(report["folded"], [])
        (problem,) = report["problems"]
        self.assertIn("spec-ball/.memlog.md cannot be read", problem["problem"])
        self.assertEqual(snapshot(self.project), before)

    def test_a_parent_folded_on_a_later_run_leaves_the_folded_childs_ids_alone(self):
        epic = self.write_epic_with_spec()
        write(
            self.initiative / "spec-golf" / "spec-golf.md",
            spec_frontmatter(companions="[glossary.md]", sources="[]")
            + SPEC_BODY.replace("# Ball flight physics", "# Golf"),
        )
        write(self.initiative / "spec-golf" / "glossary.md", "Golf terms.\n")
        write(self.initiative / "glossary.md", "the initiative's own\n")

        first = self.fold()

        self.assertEqual(
            [fold["spec"] for fold in first["folded"]], ["_bmad-output/initiative-golf/epic-ball/spec-ball"]
        )
        self.assertEqual([problem["spec"] for problem in first["problems"]], ["_bmad-output/initiative-golf/spec-golf"])
        (self.initiative / "glossary.md").unlink()

        second = self.fold()

        self.assertEqual([fold["spec"] for fold in second["folded"]], ["_bmad-output/initiative-golf/spec-golf"])
        self.assertEqual(second["problems"], [])
        self.assertFalse((self.initiative / "spec-golf").exists())
        self.assertEqual((self.initiative / "glossary.md").read_text(encoding="utf-8"), "Golf terms.\n")
        self.assertIn("- R1 (CAP-1): ", (self.initiative / "initiative-golf.md").read_text(encoding="utf-8"))
        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertIn("- R1 (CAP-1): A player sees the ball follow a physically plausible arc.", text)
        self.assertIn("- R2 (CAP-2): A player sets the launch angle and sees the arc change.", text)
        self.assertEqual((epic / "glossary.md").read_text(encoding="utf-8"), "Carry: distance in the air.\n")
        self.assertNotIn("CAP-", (epic / "story-launch-angle.md").read_text(encoding="utf-8"))
