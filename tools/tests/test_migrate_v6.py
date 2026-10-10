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
            skills=("bmad-ticket",),
            questions=({"key": "store", "prompt": "Store?", "default": "repo"},),
        )
        write(self.installed / "bmad-ticket" / "SKILL.md", "---\nname: bmad-ticket\n---\n")
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
        write(self.bmad / "custom" / "bmad-ticket.toml", "[workflow]\nkeep = true\n")
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
        self.assertTrue((self.bmad / "custom" / "bmad-ticket.toml").exists())
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
