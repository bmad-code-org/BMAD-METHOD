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

PLACEHOLDER_SPELLINGS = (
    "{project-root}",
    "{project-root}/",
    "{project-root}/_bmad-output",
    "{project-root}/a/b",
    "{project-root}\\docs",
    "{project-root}-output",
)


def config(value: str) -> str:
    return f"[core]\noutput_folder = {setup.toml_string(value)}\n"


class OutputFolderTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.project = Path(temp.name).resolve() / "demo"
        self.project.mkdir()

    def test_a_missing_key_uses_the_default_folder(self):
        self.assertEqual(setup.output_folder("[core]\n", self.project), self.project / "_bmad-output")

    def test_an_empty_value_uses_the_default_folder(self):
        self.assertEqual(setup.output_folder(config(""), self.project), self.project / "_bmad-output")

    def test_a_plain_relative_value_is_under_the_project(self):
        self.assertEqual(setup.output_folder(config("docs"), self.project), self.project / "docs")

    def test_a_project_root_path_is_under_the_project(self):
        self.assertEqual(
            setup.output_folder(config("{project-root}/docs/out"), self.project), self.project / "docs/out"
        )

    def test_the_bare_project_root_is_the_project_root_itself(self):
        self.assertEqual(setup.output_folder(config("{project-root}"), self.project), self.project)

    def test_the_project_root_with_a_trailing_slash_is_the_project_root_itself(self):
        self.assertEqual(setup.output_folder(config("{project-root}/"), self.project), self.project)

    def test_setup_and_render_agree_on_where_the_folder_is(self):
        for value in PLACEHOLDER_SPELLINGS:
            with self.subTest(value=value):
                created = setup.output_folder(config(value), self.project)
                rendered = Path(rs._resolve_config_value(value, "output_folder", self.project))
                self.assertEqual(created, rendered)

    def test_the_bare_project_root_creates_no_literal_placeholder_folder(self):
        setup.ensure_dir(setup.output_folder(config("{project-root}"), self.project))
        self.assertEqual(list(self.project.iterdir()), [])


if __name__ == "__main__":
    unittest.main()
