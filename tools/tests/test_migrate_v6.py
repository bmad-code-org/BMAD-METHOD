import contextlib
import io
import json
import os
import shutil
import stat
import subprocess
import sys
import tempfile
import tomllib
import unittest
from pathlib import Path
from unittest import mock

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

MIGRATE_V6_PY = REPO_ROOT / "skills" / "core-tools" / "bmad" / "scripts" / "migrate_v6.py"
sys.path.insert(0, str(MIGRATE_V6_PY.parent))
import frontmatter  # noqa: E402
import migrate_v6  # noqa: E402


def read_fields(path: Path) -> dict:
    return frontmatter.load(frontmatter.split(path.read_text(encoding="utf-8"))[0])


class MigrateV6Tests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.root = Path(temp.name).resolve()
        self.project = self.root / "project"
        self.installed = self.project / ".agents" / "skills"
        self.installed.mkdir(parents=True)
        self.skill = write_dest_bmad(self.installed)
        for script in (MIGRATE_V6_PY, MIGRATE_V6_PY.with_name("frontmatter.py")):
            shutil.copy2(script, self.skill / "scripts" / script.name)
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

    def test_a_customization_of_a_skill_another_tool_installed_is_not_unused(self):
        # Only Codex has bmad-foo; a Claude Code user's --clean must not delete the team's bmad-foo.toml.
        self.write_v6_traces()
        write(self.project / ".codex" / "skills" / "bmad-foo" / "SKILL.md", "---\nname: bmad-foo\n---\n")
        write(self.bmad / "custom" / "bmad-foo.toml", "[workflow]\nshared = true\n")

        self.assertEqual(self.migrate()["unused_customizations"], ["_bmad/custom/bmad-sprint-planning.user.toml"])
        self.migrate("--clean")
        self.assertTrue((self.bmad / "custom" / "bmad-foo.toml").exists())
        self.assertFalse((self.bmad / "custom" / "bmad-sprint-planning.user.toml").exists())

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

    def test_a_config_file_saved_with_a_byte_order_mark_is_cleaned(self):
        user = self.bmad / "custom" / "config.user.toml"
        user.write_bytes(b'\xef\xbb\xbf[core]\nuser_name = "Ann"\nfuture_key = "x"\n')
        stale = [{"file": "_bmad/custom/config.user.toml", "key": "core.user_name"}]

        self.assertEqual(self.migrate()["stale_config_keys"], stale)
        self.assertEqual(self.migrate("--clean")["removed_keys"], stale)
        self.assertEqual(tomllib.loads(user.read_text(encoding="utf-8-sig")), {"core": {"future_key": "x"}})

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

    def test_a_linked_custom_folder_is_not_cleaned(self):
        # A junction on Windows, which needs no privilege and which `Path.is_symlink` does not see.
        shared = self.root / "shared-custom"
        write(shared / "bmad-other-skill.toml", "[workflow]\nkeep = true\n")
        write(shared / "bmad-agent-po.toml", '[workflow]\non_complete = "x"\n')
        custom = self.bmad / "custom"
        shutil.rmtree(custom)
        if sys.platform == "win32":
            import _winapi

            _winapi.CreateJunction(str(shared), str(custom))
        else:
            custom.symlink_to(shared, target_is_directory=True)
        write(self.bmad / "_config" / "manifest.yaml", "installation: v6\n")
        before = snapshot(shared)

        report = self.migrate()
        cleaned = self.migrate("--clean")

        self.assertEqual(report["unused_customizations"], [])
        self.assertEqual(cleaned["removed_files"], ["_bmad/_config/manifest.yaml"])
        self.assertEqual(cleaned["removed_customizations"], [])
        self.assertEqual(snapshot(shared), before)

    def test_clean_removes_read_only_entries(self):
        self.write_v6_traces()
        shims = self.bmad / "core" / "v6-shims"
        read_only = (
            self.bmad / "_config" / "manifest.yaml",
            shims / "shim.md",
            shims,
            self.bmad / "config.toml",
            self.bmad / "custom" / "bmad-sprint-planning.user.toml",
        )
        for path in read_only:
            path.chmod(0o555 if path.is_dir() else 0o444)

        report = self.migrate("--clean")

        self.assertEqual(report["not_removed"], [])
        self.assertFalse((self.bmad / "_config").exists())
        self.assertFalse((self.bmad / "core").exists())
        self.assertFalse((self.bmad / "custom" / "bmad-sprint-planning.user.toml").exists())
        team = tomllib.loads((self.bmad / "config.toml").read_text(encoding="utf-8"))
        self.assertNotIn("user_name", team["core"])

    def test_a_file_that_cannot_be_removed_does_not_stop_the_rest(self):
        self.write_v6_traces()
        locked = self.bmad / "_config" / "manifest.yaml"
        unlink = migrate_v6.unlink_force

        def unlink_unless_locked(path: Path) -> None:
            if path == locked:
                raise PermissionError("in use")
            unlink(path)

        out = io.StringIO()
        with mock.patch.object(migrate_v6, "unlink_force", unlink_unless_locked), contextlib.redirect_stdout(out):
            code = migrate_v6.main(["--project-root", str(self.project), "--skill", str(self.skill), "--clean"])
        report = json.loads(out.getvalue())

        self.assertEqual(code, 1)
        self.assertTrue((self.project / report["backup"] / "_bmad" / "_config" / "manifest.yaml").is_file())
        self.assertEqual(report["not_removed"], [{"file": "_bmad/_config/manifest.yaml", "error": "in use"}])
        self.assertTrue(locked.is_file())
        self.assertEqual(report["removed_files"], ["_bmad/config.user.toml", "_bmad/core/v6-shims"])
        self.assertFalse((self.bmad / "core").exists())
        self.assertIn({"file": "_bmad/config.toml", "key": "core.user_name"}, report["removed_keys"])
        self.assertEqual(report["removed_customizations"], ["_bmad/custom/bmad-sprint-planning.user.toml"])

    def test_linked_file_inside_plain_custom_folder_is_not_removed(self):
        shared = self.root / "shared-skill.toml"
        write(shared, "[workflow]\nkeep = true\n")
        link = self.bmad / "custom" / "bmad-not-installed.toml"
        try:
            link.symlink_to(shared)
        except OSError:
            self.skipTest("symlinks unavailable")

        report = self.migrate()
        cleaned = self.migrate("--clean")

        self.assertEqual(report["unused_customizations"], [])
        self.assertEqual(cleaned["removed_customizations"], [])
        self.assertTrue(link.is_symlink())
        self.assertEqual(shared.read_text(encoding="utf-8"), "[workflow]\nkeep = true\n")

    def test_failed_config_rewrite_during_clean_records_not_removed_and_exits_one(self):
        self.write_v6_traces()
        config_path = self.bmad / "config.toml"
        real_write_force = migrate_v6.write_force

        def fail_config(path: Path, content: str, **kwargs) -> None:
            if path.resolve() == config_path.resolve():
                raise PermissionError("config locked")
            real_write_force(path, content, **kwargs)

        out = io.StringIO()
        with mock.patch.object(migrate_v6, "write_force", fail_config), contextlib.redirect_stdout(out):
            code = migrate_v6.main(["--project-root", str(self.project), "--skill", str(self.skill), "--clean"])
        report = json.loads(out.getvalue())

        self.assertEqual(code, 1)
        self.assertEqual(report["not_removed"], [{"file": "_bmad/config.toml", "error": "config locked"}])
        self.assertFalse(any(k["file"] == "_bmad/config.toml" for k in report["removed_keys"]))
        self.assertFalse(any(k["file"] == "_bmad/config.toml" for k in report["moved_keys"]))
        self.assertIn("user_name", config_path.read_text(encoding="utf-8"))

    def test_backup_bmad_appends_numeric_suffix_when_timestamps_collide(self):
        fixed = mock.Mock()
        fixed.now.return_value = __import__("datetime").datetime(2026, 11, 27, 12, 0, 5)
        (self.project / f"{migrate_v6.BACKUP_PREFIX}20261127-1200").mkdir()
        (self.project / f"{migrate_v6.BACKUP_PREFIX}20261127-120005").mkdir()

        with mock.patch.object(migrate_v6.datetime, "datetime", fixed):
            backup = migrate_v6.backup_bmad(self.project)

        self.assertEqual(backup.name, f"{migrate_v6.BACKUP_PREFIX}20261127-120005-1")
        self.assertTrue((backup / "_bmad").is_dir())


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

    def test_a_ticket_and_spec_saved_with_a_byte_order_mark_fold_into_one_frontmatter(self):
        epic = self.write_epic_with_spec()
        for path in (epic / "epic-ball.md", epic / "spec-ball" / "spec-ball.md"):
            path.write_bytes(b"\xef\xbb\xbf" + path.read_bytes())

        report = self.fold()

        self.assertEqual(report["problems"], [])
        text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertTrue(text.startswith("---\n"), msg=text)
        self.assertEqual(frontmatter.split(text)[1].count("\n---\n"), 0, msg=text)
        self.assertIn("sources: [_bmad-output/initiative-golf/prd-golf/prd-golf.md]\n", text)
        self.assertIn("- R1 (CAP-1): A player sees the ball follow a physically plausible arc.", text)

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

    def test_hidden_and_tmp_files_move_beside_the_ticket(self):
        epic = self.write_epic_with_spec()
        write(epic / "spec-ball" / ".working" / "mock.html", "mock\n")
        write(epic / "spec-ball" / ".draft-notes.md", "draft\n")
        write(epic / "spec-ball" / "plan.md.tmp", "partial\n")

        report = self.fold()

        (fold,) = report["folded"]
        self.assertEqual(report["problems"], [])
        self.assertEqual(
            fold["companions"],
            [
                "_bmad-output/initiative-golf/epic-ball/.draft-notes.md",
                "_bmad-output/initiative-golf/epic-ball/.working",
                "_bmad-output/initiative-golf/epic-ball/glossary.md",
                "_bmad-output/initiative-golf/epic-ball/plan.md.tmp",
            ],
        )
        self.assertEqual((epic / ".working" / "mock.html").read_text(encoding="utf-8"), "mock\n")
        self.assertEqual((epic / ".draft-notes.md").read_text(encoding="utf-8"), "draft\n")
        self.assertEqual((epic / "plan.md.tmp").read_text(encoding="utf-8"), "partial\n")
        self.assertFalse((epic / "spec-ball").exists())

    def test_a_hidden_file_whose_name_is_taken_is_reported_and_nothing_moves(self):
        epic = self.write_epic_with_spec()
        write(epic / "spec-ball" / ".draft-notes.md", "the spec's draft\n")
        write(epic / ".draft-notes.md", "the epic's own\n")
        before = snapshot(self.project)

        report = self.fold()

        self.assertEqual(report["folded"], [])
        self.assertEqual(
            report["problems"],
            [
                {
                    "spec": "_bmad-output/initiative-golf/epic-ball/spec-ball",
                    "problem": ".draft-notes.md already exist(s) beside the ticket",
                }
            ],
        )
        self.assertEqual(snapshot(self.project), before)

    def test_loose_spec_folders_holding_os_files_all_fold(self):
        for slug in ("caddie", "putter"):
            loose = self.store / f"spec-{slug}"
            write(loose / f"spec-{slug}.md", spec_frontmatter(companions="[]", sources="[]") + SPEC_BODY)
            write(loose / ".DS_Store", "")
            write(loose / "Thumbs.db", "")

        report = self.fold()

        self.assertEqual(report["problems"], [])
        self.assertEqual(len(report["folded"]), 2, msg=report)
        backlog = self.store / "backlog"
        self.assertTrue((backlog / "story-caddie.md").is_file())
        self.assertTrue((backlog / "story-putter.md").is_file())
        self.assertFalse((backlog / ".DS_Store").exists())
        self.assertFalse((backlog / "Thumbs.db").exists())

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

    def test_a_backlog_tickets_toml_saved_with_a_byte_order_mark_still_sets_the_next_id(self):
        loose = self.store / "spec-caddie"
        write(loose / "spec-caddie.md", spec_frontmatter(companions="[]", sources="[]") + SPEC_BODY)
        write(loose / ".memlog.md", MEMLOG_BALL)
        write(self.store / "backlog" / "bug-slice.md", "---\nid: 4\ntype: bug\n---\n\n# Slice\n")
        (self.store / "backlog" / "tickets.toml").write_bytes(b"\xef\xbb\xbfnext_id = 9\n")

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

    def test_a_title_with_a_colon_reads_back_from_the_story_and_the_new_memlog(self):
        loose = self.store / "spec-caddie"
        title = 'Caddie: the "smart" advice'
        write(
            loose / "spec-caddie.md",
            spec_frontmatter(companions="[]", sources="[]") + SPEC_BODY.replace("# Ball flight physics", f"# {title}"),
        )
        write(self.store / "backlog" / "bug-slice.md", "---\nid: 4\ntype: bug\n---\n\nid: 9\n")

        self.assertEqual(self.fold()["problems"], [])

        story = read_fields(self.store / "backlog" / "story-caddie.md")
        self.assertEqual((story["id"], story["title"]), ("5", title))
        self.assertEqual(read_fields(self.store / "backlog" / ".memlog.md")["topic"], title)

    def test_a_ticket_whose_frontmatter_is_not_yaml_is_reported_and_nothing_changes(self):
        epic = self.write_epic_with_spec()
        write(epic / "epic-ball.md", "---\ntitle: Ball: flight\n---\n\n# Ball\n")
        before = snapshot(self.project)

        report = self.fold()

        self.assertEqual(report["folded"], [])
        (problem,) = report["problems"]
        self.assertIn("epic-ball/epic-ball.md has invalid frontmatter", problem["problem"])
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

    def test_sibling_specs_in_one_ticket_both_fold_without_dropping_capabilities(self):
        demo = self.store / "demo"
        write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
        write(
            demo / "spec-a" / "spec-a.md",
            spec_frontmatter(companions="[a-notes.md]", sources="[]")
            + "# Alpha\n\n## Capabilities\n\n- **CAP-1** Alpha flow.\n",
        )
        write(demo / "spec-a" / "a-notes.md", "Traces CAP-1.\n")
        write(
            demo / "spec-b" / "spec-b.md",
            spec_frontmatter(companions="[b-notes.md]", sources="[]")
            + "# Beta\n\n## Capabilities\n\n- **CAP-1** Beta flow.\n",
        )
        write(demo / "spec-b" / "b-notes.md", "Traces CAP-1.\n")

        report = self.fold()

        self.assertEqual(report["problems"], [])
        self.assertEqual(len(report["folded"]), 2)
        demo_text = (demo / "demo.md").read_text(encoding="utf-8")
        self.assertIn("- R1 (CAP-1): Alpha flow.", demo_text)
        self.assertIn("- R2 (CAP-1): Beta flow.", demo_text)
        self.assertEqual((demo / "a-notes.md").read_text(encoding="utf-8"), "Traces R1.\n")
        self.assertEqual((demo / "b-notes.md").read_text(encoding="utf-8"), "Traces R2.\n")

    def test_sibling_specs_with_disjoint_caps_only_rewrite_their_own_ids(self):
        demo = self.store / "demo"
        write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
        write(demo / "tickets.toml", '[[entry]]\nid = "1"\nname = "One"\ncovers = ["CAP-1", "CAP-2"]\n')
        write(
            demo / "spec-a" / "spec-a.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Alpha\n\n## Capabilities\n\n- **CAP-1** One.\n",
        )
        write(
            demo / "spec-b" / "spec-b.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Beta\n\n## Capabilities\n\n- **CAP-2** Two.\n",
        )

        report = self.fold()

        self.assertEqual(report["problems"], [])
        demo_text = (demo / "demo.md").read_text(encoding="utf-8")
        self.assertIn("- R1 (CAP-1): One.", demo_text)
        self.assertIn("- R3 (CAP-2): Two.", demo_text)
        self.assertEqual(
            tomllib.loads((demo / "tickets.toml").read_text(encoding="utf-8"))["entry"][0]["covers"],
            ["R1", "R3"],
        )

    def test_sibling_specs_with_shared_cap_cited_by_ticket_children_are_refused(self):
        demo = self.store / "demo"
        write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
        write(demo / "tickets.toml", '[[entry]]\nid = "1"\nname = "One"\ncovers = ["CAP-1"]\n')
        write(
            demo / "spec-a" / "spec-a.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Alpha\n\n## Capabilities\n\n- **CAP-1** One.\n",
        )
        write(
            demo / "spec-b" / "spec-b.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Beta\n\n## Capabilities\n\n- **CAP-1** Two.\n",
        )
        before = snapshot(self.project)

        report = self.fold()

        self.assertEqual(report["folded"], [])
        self.assertEqual(len(report["problems"]), 2)
        self.assertIn("defined by both spec-a and spec-b", report["problems"][0]["problem"])
        self.assertEqual(snapshot(self.project), before)

    def test_spec_with_unparsed_capabilities_is_not_deleted(self):
        demo = self.store / "demo"
        write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
        write(
            demo / "spec-bad" / "spec-bad.md",
            spec_frontmatter(companions="[]", sources="[]")
            + "# Bad\n\n## Capabilities\n\n- **R1** Already rewritten.\n",
        )
        before = snapshot(self.project)

        report = self.fold()

        self.assertEqual(report["folded"], [])
        self.assertEqual(len(report["problems"]), 1)
        self.assertIn("did not parse as CAP-<n>", report["problems"][0]["problem"])
        self.assertEqual(snapshot(self.project), before)

    def test_sibling_spec_with_invalid_frontmatter_stops_the_fold_without_crashing(self):
        demo = self.store / "demo"
        write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
        write(
            demo / "spec-a" / "spec-a.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Alpha\n\n## Capabilities\n\n- **CAP-1** One.\n",
        )
        write(
            demo / "spec-b" / "spec-b.md",
            "---\ntitle: [unclosed\n---\n\n# Beta\n\n## Capabilities\n\n- **CAP-1** Two.\n",
        )
        before = snapshot(self.project)

        report = self.fold()

        self.assertEqual(report["folded"], [])
        self.assertEqual(len(report["problems"]), 2)
        self.assertIn("spec-b.md has invalid frontmatter", report["problems"][0]["problem"])
        self.assertEqual(snapshot(self.project), before)

    def test_partially_unparsed_capabilities_before_or_after_valid_cap_are_not_deleted(self):
        for body in (
            "# Mixed\n\n## Capabilities\n\n- **R1** Unparsed before.\n- **CAP-2** Valid.\n",
            "# Mixed\n\n## Capabilities\n\n- **CAP-1** Valid.\n  - **intent:** Kept intent.\n- **R2** Unparsed after.\n",
        ):
            with self.subTest(body=body):
                with tempfile.TemporaryDirectory() as tmp:
                    project = Path(tmp)
                    store = project / "_bmad-output"
                    demo = store / "demo"
                    write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
                    write(demo / "spec-mixed" / "spec-mixed.md", spec_frontmatter(companions="[]", sources="[]") + body)
                    before = snapshot(project)

                    report = migrate_v6.fold_specs(project, store)

                    self.assertEqual(report["folded"], [])
                    self.assertEqual(len(report["problems"]), 1)
                    self.assertIn("did not parse as CAP-<n>", report["problems"][0]["problem"])
                    self.assertEqual(snapshot(project), before)

    def test_zero_padded_cap_id_rewrites_and_triggers_sibling_ambiguity(self):
        demo = self.store / "demo"
        write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
        write(demo / "tickets.toml", '[[entry]]\nid = "1"\nname = "One"\ncovers = ["CAP-01"]\n')
        write(
            demo / "spec-a" / "spec-a.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Alpha\n\n## Capabilities\n\n- **CAP-01** One.\n",
        )
        write(
            demo / "spec-b" / "spec-b.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Beta\n\n## Capabilities\n\n- **CAP-1** Two.\n",
        )
        before = snapshot(self.project)

        refused = self.fold()
        self.assertEqual(refused["folded"], [])
        self.assertEqual(len(refused["problems"]), 2)
        self.assertIn("defined by both spec-a and spec-b", refused["problems"][0]["problem"])
        self.assertEqual(snapshot(self.project), before)

        shutil.rmtree(demo / "spec-b")
        write(demo / "spec-a" / "notes.md", "Traces CAP-01.\n")
        write(
            demo / "spec-a" / "spec-a.md",
            spec_frontmatter(companions="[notes.md]", sources="[]")
            + "# Alpha\n\n## Capabilities\n\n- **CAP-01** One.\n",
        )
        report = self.fold()
        self.assertEqual(report["problems"], [])
        self.assertIn("- R1 (CAP-1): One.", (demo / "demo.md").read_text(encoding="utf-8"))
        self.assertEqual((demo / "notes.md").read_text(encoding="utf-8"), "Traces R1.\n")
        self.assertEqual(
            tomllib.loads((demo / "tickets.toml").read_text(encoding="utf-8"))["entry"][0]["covers"],
            ["R1"],
        )

    def test_sibling_spec_with_unparsed_capabilities_stops_the_fold(self):
        demo = self.store / "demo"
        write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
        write(
            demo / "spec-a" / "spec-a.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Alpha\n\n## Capabilities\n\n- **CAP-1** One.\n",
        )
        write(
            demo / "spec-b" / "spec-b.md",
            spec_frontmatter(companions="[]", sources="[]") + "# Beta\n\n## Capabilities\n\n- **R1** Unparsed.\n",
        )
        before = snapshot(self.project)

        report = self.fold()
        self.assertEqual(report["folded"], [])
        self.assertEqual(len(report["problems"]), 2)
        by_spec = {p["spec"]: p["problem"] for p in report["problems"]}
        self.assertIn("has unparsed capabilities", by_spec["_bmad-output/demo/spec-a"])
        self.assertIn("did not parse as CAP-<n>", by_spec["_bmad-output/demo/spec-b"])
        self.assertEqual(snapshot(self.project), before)

    def test_duplicate_or_non_dash_capabilities_refuse_and_comments_are_ignored(self):
        for body, expected in (
            ("# Dup\n\n## Capabilities\n\n- **CAP-1** First.\n- **CAP-01** Second.\n", "defines CAP-1 more than once"),
            ("# Star\n\n## Capabilities\n\n- **CAP-1** First.\n* **CAP-2** Second.\n", "**CAP-2** Second."),
            ("# Num\n\n## Capabilities\n\n- **CAP-1** First.\n1. **CAP-2** Second.\n", "1. **CAP-2** Second."),
        ):
            with self.subTest(expected=expected):
                with tempfile.TemporaryDirectory() as tmp:
                    project = Path(tmp)
                    store = project / "_bmad-output"
                    demo = store / "demo"
                    write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
                    write(demo / "spec-x" / "spec-x.md", spec_frontmatter(companions="[]", sources="[]") + body)
                    before = snapshot(project)

                    report = migrate_v6.fold_specs(project, store)
                    self.assertEqual(report["folded"], [])
                    (problem,) = report["problems"]
                    self.assertIn(expected, problem["problem"])
                    self.assertEqual(snapshot(project), before)

        demo = self.store / "demo"
        write(demo / "demo.md", "---\nid: 1\ntype: epic\n---\n\n# Demo\n\n## Requirements\n")
        write(
            demo / "spec-comments" / "spec-comments.md",
            spec_frontmatter(companions="[]", sources="[]")
            + "# Comments\n\n## Capabilities\n\n"
            + "<!-- single line comment -->\n"
            + "- **CAP-1** Kept capability.\n"
            + "<!-- multi-line\n     comment -->\n",
        )
        ok = self.fold()
        self.assertEqual(ok["problems"], [])
        demo_text = (demo / "demo.md").read_text(encoding="utf-8")
        self.assertIn("- R1 (CAP-1): Kept capability.", demo_text)
        self.assertNotIn("comment", demo_text)

    def test_a_folder_that_cannot_move_stops_the_fold_before_any_write_and_a_rerun_folds_it(self):
        epic = self.write_epic_with_spec()
        before = snapshot(self.project)
        real_rename = os.rename

        def held_open(src, dst):
            if Path(src).name == "spec-ball":
                raise PermissionError("a file in it is open")
            return real_rename(src, dst)

        with mock.patch("os.rename", side_effect=held_open):
            report = migrate_v6.fold_specs(self.project, self.store)

        self.assertEqual(report["folded"], [])
        (problem,) = report["problems"]
        self.assertIn("cannot move spec-ball", problem["problem"])
        self.assertEqual(snapshot(self.project), before)

        retry = self.fold()
        self.assertEqual(retry["problems"], [])
        self.assertEqual(len(retry["folded"]), 1)
        self.assertFalse((epic / "spec-ball").exists())

    def test_a_fold_that_stops_after_staging_leaves_the_folder_under_its_own_name(self):
        epic = self.write_epic_with_spec()

        with mock.patch.object(migrate_v6, "write_force", side_effect=PermissionError("ticket is locked")):
            with self.assertRaises(PermissionError):
                migrate_v6.fold_specs(self.project, self.store)

        self.assertTrue((epic / "spec-ball" / "spec-ball.md").is_file())
        self.assertEqual([p.name for p in epic.iterdir() if p.name.startswith(".folding-")], [])

    def test_read_only_files_in_the_spec_folder_fold_cleanly(self):
        epic = self.write_epic_with_spec()
        spec = epic / "spec-ball"
        write(spec / "notes.tmp", "tmp\n")
        for name in ("spec-ball.md", ".memlog.md", "notes.tmp"):
            os.chmod(spec / name, 0o444)

        report = self.fold()

        self.assertEqual(report["problems"], [])
        self.assertEqual(len(report["folded"]), 1)
        self.assertFalse(spec.exists())
        self.assertEqual(
            memlog_entries(epic / ".memlog.md")[-1],
            "- (event) folded spec-ball/ into epic-ball.md; CAP-1 is R1, CAP-2 is R2",
        )

    def test_read_only_companion_ticket_and_destination_memlog_fold_cleanly(self):
        epic = self.write_epic_with_spec()
        write(epic / "shared.md", "Traces spec-ball/spec-ball.md and CAP-1.\n")
        write(epic / ".memlog.md", "---\ntopic: Existing\nupdated: 2026-01-01T00:00\n---\n\n- (note) earlier entry\n")
        for target in (epic / "shared.md", epic / "epic-ball.md", epic / ".memlog.md"):
            os.chmod(target, 0o444)

        report = self.fold()

        self.assertEqual(report["problems"], [])
        self.assertEqual(len(report["folded"]), 1)
        self.assertFalse((epic / "spec-ball").exists())
        self.assertIn("Traces epic-ball.md and R1.", (epic / "shared.md").read_text(encoding="utf-8"))
        self.assertIn("- R1 (CAP-1):", (epic / "epic-ball.md").read_text(encoding="utf-8"))
        self.assertEqual(
            memlog_entries(epic / ".memlog.md")[-1],
            "- (event) folded spec-ball/ into epic-ball.md; CAP-1 is R1, CAP-2 is R2",
        )

    def test_symlinked_memlog_is_refused_without_touching_target(self):
        for location in ("spec", "home"):
            with self.subTest(location=location):
                with tempfile.TemporaryDirectory() as tmp:
                    root = Path(tmp)
                    outside = root / "outside-secret.md"
                    original = "---\ntopic: Secret\n---\n\n- (note) keep untouched\n"
                    write(outside, original)
                    os.chmod(outside, 0o444)
                    project = root / "project"
                    store = project / "_bmad-output"
                    epic = store / "initiative-golf" / "epic-ball"
                    write(epic / "epic-ball.md", "---\nid: 1\ntype: epic\n---\n\n# Ball\n\n## Requirements\n")
                    spec = epic / "spec-ball"
                    write(
                        spec / "spec-ball.md",
                        spec_frontmatter(companions="[]", sources="[]") + SPEC_BODY,
                    )
                    link = (spec if location == "spec" else epic) / ".memlog.md"
                    try:
                        link.symlink_to(outside)
                    except OSError:
                        self.skipTest("symlinks unavailable")
                    mode_before = stat.S_IMODE(outside.stat().st_mode)

                    report = migrate_v6.fold_specs(project, store)

                    self.assertEqual(report["folded"], [])
                    (problem,) = report["problems"]
                    self.assertIn("symlink or junction", problem["problem"])
                    self.assertEqual(stat.S_IMODE(outside.stat().st_mode), mode_before)
                    self.assertEqual(outside.read_text(encoding="utf-8"), original)
                    self.assertTrue(spec.exists())

    def test_symlinked_ticket_is_refused_without_touching_target(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            outside = root / "outside-ticket.md"
            original = "---\nid: 1\ntype: epic\n---\n\n# Outside\n\n## Requirements\n"
            write(outside, original)
            os.chmod(outside, 0o444)
            project = root / "project"
            store = project / "_bmad-output"
            epic = store / "initiative-golf" / "epic-ball"
            write(epic / "spec-ball" / "spec-ball.md", spec_frontmatter(companions="[]", sources="[]") + SPEC_BODY)
            ticket_link = epic / "epic-ball.md"
            try:
                ticket_link.symlink_to(outside)
            except OSError:
                self.skipTest("symlinks unavailable")
            mode_before = stat.S_IMODE(outside.stat().st_mode)

            report = migrate_v6.fold_specs(project, store)

            self.assertEqual(report["folded"], [])
            (problem,) = report["problems"]
            self.assertIn("symlink or junction", problem["problem"])
            self.assertEqual(stat.S_IMODE(outside.stat().st_mode), mode_before)
            self.assertEqual(outside.read_text(encoding="utf-8"), original)
            self.assertTrue((epic / "spec-ball").exists())

    def test_failure_after_ticket_write_prevents_refold_and_reports_stranded_staging(self):
        epic = self.write_epic_with_spec()

        with mock.patch.object(migrate_v6, "rmtree_force", side_effect=PermissionError("cleanup locked")):
            with self.assertRaises(OSError) as caught:
                migrate_v6.fold_specs(self.project, self.store)
        self.assertIn(".folding-", str(caught.exception))
        self.assertFalse((epic / "spec-ball").exists())
        stranded = [p for p in epic.iterdir() if p.name.startswith(".folding-")]
        self.assertEqual(len(stranded), 1)
        self.assertFalse((stranded[0] / "spec-ball.md").exists())

        rerun = self.fold()
        self.assertEqual(rerun["folded"], [])
        self.assertEqual(len(rerun["problems"]), 1)
        self.assertIn(stranded[0].name, rerun["problems"][0]["problem"])
        ticket_text = (epic / "epic-ball.md").read_text(encoding="utf-8")
        self.assertEqual(ticket_text.count("- R1 (CAP-1):"), 1)

    def test_failure_naming_staged_path_when_rollback_rename_fails(self):
        self.write_epic_with_spec()
        real_rename = os.rename

        def fail_rollback(src, dst):
            if Path(src).name.startswith(".folding-"):
                raise PermissionError("restore denied")
            return real_rename(src, dst)

        with (
            mock.patch.object(migrate_v6, "write_force", side_effect=PermissionError("ticket locked")),
            mock.patch("os.rename", side_effect=fail_rollback),
        ):
            with self.assertRaises(OSError) as caught:
                migrate_v6.fold_specs(self.project, self.store)
        self.assertIn(".folding-", str(caught.exception))
