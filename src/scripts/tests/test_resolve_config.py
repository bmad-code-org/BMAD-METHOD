import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "resolve_config.py"


def run_raw(args, env_overrides=None):
    """Run resolver, return CompletedProcess-like object with decoded streams.
    Use this when the test expects a non-zero exit (e.g. fail-fast checks)."""
    env = os.environ.copy()
    # Force BMAD_HOME to a guaranteed-missing path so any value the developer
    # has set in their shell can't leak the real ~/.bmad into a test that
    # expected an empty global. Tests that need a populated global pass it via
    # env_overrides below.
    env["BMAD_HOME"] = "/nonexistent-bmad-home-default"
    if env_overrides:
        env.update(env_overrides)
    result = subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env,
        check=False,
    )
    result.stdout = result.stdout.decode("utf-8", errors="replace")
    result.stderr = result.stderr.decode("utf-8", errors="replace")
    return result


def run(args, env_overrides=None):
    result = run_raw(args, env_overrides=env_overrides)
    if result.returncode != 0:
        raise AssertionError(f"resolve_config failed ({result.returncode}): {result.stderr}")
    return json.loads(result.stdout)


class ResolveConfigTests(unittest.TestCase):
    def test_no_project_root_no_global_returns_empty(self):
        with tempfile.TemporaryDirectory() as empty_global:
            data = run([], env_overrides={"BMAD_HOME": empty_global})
        self.assertEqual(data, {})

    def test_global_only_when_no_project_root(self):
        with tempfile.TemporaryDirectory() as global_dir:
            (Path(global_dir) / "config.toml").write_text(
                '[core]\nuser_name = "Globie"\n', encoding="utf-8"
            )
            data = run([], env_overrides={"BMAD_HOME": global_dir})
        self.assertEqual(data["core"]["user_name"], "Globie")

    def test_project_overrides_global(self):
        with tempfile.TemporaryDirectory() as global_dir, tempfile.TemporaryDirectory() as proj:
            (Path(global_dir) / "config.toml").write_text(
                '[core]\nuser_name = "Globie"\ncommunication_language = "French"\n',
                encoding="utf-8",
            )
            bmad = Path(proj) / "_bmad"
            bmad.mkdir()
            (bmad / "config.toml").write_text(
                '[core]\nuser_name = "ProjectUser"\n', encoding="utf-8"
            )
            data = run(
                ["--project-root", proj], env_overrides={"BMAD_HOME": global_dir}
            )
        # Project wins on user_name; global fills in communication_language
        self.assertEqual(data["core"]["user_name"], "ProjectUser")
        self.assertEqual(data["core"]["communication_language"], "French")

    def test_custom_user_beats_everything(self):
        with tempfile.TemporaryDirectory() as global_dir, tempfile.TemporaryDirectory() as proj:
            (Path(global_dir) / "config.user.toml").write_text(
                '[core]\nuser_name = "Globie"\n', encoding="utf-8"
            )
            bmad = Path(proj) / "_bmad"
            (bmad / "custom").mkdir(parents=True)
            (bmad / "config.toml").write_text(
                '[core]\nuser_name = "Installer"\n', encoding="utf-8"
            )
            (bmad / "custom" / "config.user.toml").write_text(
                '[core]\nuser_name = "Pinned"\n', encoding="utf-8"
            )
            data = run(
                ["--project-root", proj], env_overrides={"BMAD_HOME": global_dir}
            )
        self.assertEqual(data["core"]["user_name"], "Pinned")

    def test_project_config_optional(self):
        # _bmad/ exists (installed project) but no config.toml inside — that's
        # the lean / global-only case and must not error.
        with tempfile.TemporaryDirectory() as proj:
            (Path(proj) / "_bmad").mkdir()
            data = run(["--project-root", proj])
        self.assertEqual(data, {})

    def test_project_root_without_bmad_dir_errors(self):
        # --project-root pointing at a directory with no _bmad/ is treated
        # as a broken install (typo, wiped install) — resolver exits non-zero
        # rather than silently returning {}. Global-only mode (no
        # --project-root) keeps the permissive behavior.
        with tempfile.TemporaryDirectory() as proj:
            result = run_raw(["--project-root", proj])
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("no _bmad/ directory", result.stderr)

    def test_module_floor_contributes_when_no_overrides(self):
        # Module-shipped defaults from _bmad/{module}/module.toml should
        # appear when nothing else specifies them.
        with tempfile.TemporaryDirectory() as proj:
            bmad = Path(proj) / "_bmad" / "bmm"
            bmad.mkdir(parents=True)
            (bmad / "module.toml").write_text(
                '[modules.bmm]\nplanning_artifacts = "/from/module/yaml"\n'
                '[agents.bmad-agent-analyst]\nname = "Mary"\nmodule = "bmm"\n',
                encoding="utf-8",
            )
            data = run(["--project-root", proj])
        self.assertEqual(data["modules"]["bmm"]["planning_artifacts"], "/from/module/yaml")
        self.assertEqual(data["agents"]["bmad-agent-analyst"]["name"], "Mary")

    def test_config_toml_overrides_module_floor(self):
        # Config layers sit above the module floor — explicit overrides win.
        with tempfile.TemporaryDirectory() as proj:
            bmad = Path(proj) / "_bmad"
            mod = bmad / "bmm"
            mod.mkdir(parents=True)
            (mod / "module.toml").write_text(
                '[modules.bmm]\nplanning_artifacts = "/module/default"\n',
                encoding="utf-8",
            )
            (bmad / "config.toml").write_text(
                '[modules.bmm]\nplanning_artifacts = "/user/override"\n',
                encoding="utf-8",
            )
            data = run(["--project-root", proj])
        self.assertEqual(
            data["modules"]["bmm"]["planning_artifacts"], "/user/override"
        )

    def test_multiple_modules_merge_independently(self):
        # Each module writes its own [modules.X] / [agents.X] subtree;
        # the merge should not collide across modules.
        with tempfile.TemporaryDirectory() as proj:
            bmad = Path(proj) / "_bmad"
            (bmad / "bmm").mkdir(parents=True)
            (bmad / "bmb").mkdir(parents=True)
            (bmad / "bmm" / "module.toml").write_text(
                '[modules.bmm]\nplanning_artifacts = "/bmm/path"\n',
                encoding="utf-8",
            )
            (bmad / "bmb" / "module.toml").write_text(
                '[modules.bmb]\nbmad_builder_output_folder = "/bmb/path"\n',
                encoding="utf-8",
            )
            data = run(["--project-root", proj])
        self.assertEqual(data["modules"]["bmm"]["planning_artifacts"], "/bmm/path")
        self.assertEqual(
            data["modules"]["bmb"]["bmad_builder_output_folder"], "/bmb/path"
        )

    def test_module_floor_ignored_when_no_project_root(self):
        # Without --project-root, no per-project files (including module
        # floor) should be read. Just global.
        with tempfile.TemporaryDirectory() as g:
            (Path(g) / "config.toml").write_text(
                '[core]\nuser_name = "Globie"\n', encoding="utf-8"
            )
            data = run([], env_overrides={"BMAD_HOME": g})
        self.assertEqual(data, {"core": {"user_name": "Globie"}})

    def test_non_module_dirs_skipped(self):
        # _bmad/_config, _bmad/custom, _bmad/scripts must NOT be treated as
        # modules even though they're direct children of _bmad/.
        with tempfile.TemporaryDirectory() as proj:
            bmad = Path(proj) / "_bmad"
            for sub in ("_config", "custom", "scripts"):
                (bmad / sub).mkdir(parents=True)
            # No module.toml anywhere — resolver should return {}, not error
            data = run(["--project-root", proj])
        self.assertEqual(data, {})

    def test_bmad_home_env_var_honored(self):
        with tempfile.TemporaryDirectory() as global_dir:
            (Path(global_dir) / "config.toml").write_text(
                '[core]\nuser_name = "FromEnv"\n', encoding="utf-8"
            )
            data = run([], env_overrides={"BMAD_HOME": global_dir})
        self.assertEqual(data["core"]["user_name"], "FromEnv")


if __name__ == "__main__":
    unittest.main()
