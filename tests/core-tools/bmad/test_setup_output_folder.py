import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_SRC = Path(__file__).resolve().parents[3] / "skills/core-tools/bmad/scripts"
sys.path.insert(0, str(SCRIPTS_SRC))

import render_skill as rs  # noqa: E402

_spec = importlib.util.spec_from_file_location("bmad_setup", SCRIPTS_SRC / "setup.py")
setup = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(setup)


def config(value: str) -> str:
    return f"[core]\noutput_folder = {setup.toml_string(value)}\n"


class OutputFolderTests(unittest.TestCase):
    def test_a_missing_key_uses_the_default_folder(self):
        self.assertEqual(setup.output_folder("[core]\n"), "_bmad-output")

    def test_an_empty_value_uses_the_default_folder(self):
        self.assertEqual(setup.output_folder(config("")), "_bmad-output")

    def test_the_project_root_prefix_is_removed(self):
        self.assertEqual(setup.output_folder(config("{project-root}/_bmad-output")), "_bmad-output")
        self.assertEqual(setup.output_folder(config("{project-root}/docs/out")), "docs/out")

    def test_a_plain_relative_value_is_kept(self):
        self.assertEqual(setup.output_folder(config("docs")), "docs")

    def test_the_bare_project_root_is_the_project_root_itself(self):
        self.assertEqual(setup.output_folder(config("{project-root}")), ".")

    def test_the_project_root_with_a_trailing_slash_is_the_project_root_itself(self):
        self.assertEqual(setup.output_folder(config("{project-root}/")), ".")

    def test_a_windows_separator_after_the_project_root_is_removed(self):
        self.assertEqual(setup.output_folder(config("{project-root}\\docs")), "docs")

    def test_setup_and_render_agree_on_where_the_folder_is(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir).resolve()
            for value in ("{project-root}", "{project-root}/", "{project-root}/_bmad-output", "{project-root}/a/b"):
                with self.subTest(value=value):
                    created = project / setup.output_folder(config(value))
                    rendered = Path(rs._resolve_config_value(value, "output_folder", project))
                    self.assertEqual(created.resolve(), rendered.resolve())

    def test_the_bare_project_root_creates_no_literal_placeholder_folder(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir)
            setup.ensure_dir(project / setup.output_folder(config("{project-root}")))
            self.assertEqual(list(project.iterdir()), [])


if __name__ == "__main__":
    unittest.main()
