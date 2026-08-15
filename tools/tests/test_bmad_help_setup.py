import importlib.util
import os
import shutil
import subprocess
import sys
import tempfile
import tomllib
import unittest
from pathlib import Path
from unittest import mock


REPO_ROOT = Path(__file__).resolve().parents[2]
SETUP_PY = REPO_ROOT / "src" / "core-skills" / "bmad-help" / "setup.py"
SHARED_SCRIPTS = (
    "config_utils.py",
    "memlog.py",
    "render_skill.py",
    "resolve_config.py",
    "resolve_customization.py",
)
HELP_CSV = (
    "module,skill,display-name,menu-code,description,action,args,"
    "phase,preceded-by,followed-by,required,output-location,outputs\n"
    "Core,bmad-help,BMad Help,BH,,,,anytime,,,false,,\n"
)
MINIMAL_CONFIG = """\
[core]
project_name = "{directory_name}"
document_output_language = "English"
output_folder = "{project-root}/_bmad-output"

[modules.bmm]
planning_artifacts = "{project-root}/_bmad-output/planning-artifacts"
implementation_artifacts = "{project-root}/_bmad-output/implementation-artifacts"
project_knowledge = "{project-root}/docs"

[agents.bmad-agent-pm]
module = "bmm"
team = "software-development"
name = "John"
title = "Product Manager"
icon = "📋"
description = "Drives Jobs-to-be-Done."
"""
MINIMAL_USER_CONFIG = """\
[core]
user_name = {user_name}
communication_language = {communication_language}

[modules.bmm]
user_skill_level = {user_skill_level}
"""
USER_ANSWERS = """\
user_name = "Alex"
communication_language = "English"
user_skill_level = "intermediate"
"""


def load_setup():
    sys.dont_write_bytecode = True
    spec = importlib.util.spec_from_file_location("bmad_help_setup", SETUP_PY)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def write(path: Path, content: str = "x\n") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def write_dest_help(
    root: Path,
    *,
    scripts: bool = True,
    assets: bool = True,
    config: str | None = MINIMAL_CONFIG,
    user_config: str | None = MINIMAL_USER_CONFIG,
    catalog: str | None = HELP_CSV,
) -> Path:
    help_dir = root / "bmad-help"
    write(help_dir / "SKILL.md", "---\nname: bmad-help\n---\n")
    shutil.copy2(SETUP_PY, help_dir / "setup.py")
    if scripts:
        for name in SHARED_SCRIPTS:
            source = REPO_ROOT / "src" / "scripts" / name
            dest = help_dir / "scripts" / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, dest)
    if assets:
        if config is not None:
            write(help_dir / "assets" / "config.toml", config)
        if user_config is not None:
            write(help_dir / "assets" / "config.user.toml", user_config)
        if catalog is not None:
            write(help_dir / "assets" / "bmad-help.csv", catalog)
    return help_dir


def user_answers_args(project: Path, text: str = USER_ANSWERS) -> list[str]:
    path = project / ".bmad-help-setup-user.toml"
    write(path, text)
    return ["--user-answers", str(path)]


def run_setup(project: Path, skill: Path, *extra: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [
            "uv",
            "run",
            "--no-cache",
            str(skill / "setup.py"),
            "--project-root",
            str(project),
            "--skill",
            str(skill),
            *extra,
        ],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def user_toml_files(root: Path) -> list[Path]:
    return sorted(root.rglob("*.user.toml"))


def scripts_match(dest: Path, src: Path) -> bool:
    dest_files = {p.name: p.read_bytes() for p in dest.iterdir() if p.is_file()}
    src_files = {p.name: p.read_bytes() for p in src.iterdir() if p.is_file()}
    return dest_files == src_files


def symlink_to_temp_dir_succeeds() -> bool:
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        target = root / "target"
        link = root / "link"
        target.mkdir()
        try:
            os.symlink(target, link, target_is_directory=True)
        except OSError:
            return False
        return link.is_symlink()


class BmadHelpSetupTests(unittest.TestCase):
    def test_other_skill_without_setup_is_file_not_found(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "project"
            project.mkdir()
            missing = project / "_bmad" / "scripts" / "resolve_config.py"
            result = subprocess.run(
                ["uv", "run", str(missing), "--project-root", str(project)],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )
            self.assertNotEqual(result.returncode, 0)
            combined = result.stdout + result.stderr
            self.assertRegex(combined, r"No such file|not found|Errno 2|cannot find", msg=combined)

        for skill_md in (REPO_ROOT / "src" / "core-skills").rglob("SKILL.md"):
            if skill_md.parent.name == "bmad-help":
                continue
            text = skill_md.read_text(encoding="utf-8")
            self.assertNotIn("bmad-help setup", text, skill_md)
        for skill_md in (REPO_ROOT / "src" / "bmm-skills").rglob("SKILL.md"):
            text = skill_md.read_text(encoding="utf-8")
            self.assertNotIn("bmad-help setup", text, skill_md)

    def test_scripts_present_missing_config_toml_is_hard_error(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            skill = write_dest_help(root)
            project.mkdir()
            scripts = project / "_bmad" / "scripts"
            scripts.mkdir(parents=True)
            for name in SHARED_SCRIPTS:
                shutil.copy2(skill / "scripts" / name, scripts / name)

            result = subprocess.run(
                [sys.executable, str(scripts / "resolve_config.py"), "--project-root", str(project)],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("not found", result.stderr.lower())
            self.assertIn("config.toml", result.stderr)

            sys.path.insert(0, str(REPO_ROOT / "src" / "scripts"))
            try:
                from config_utils import ConfigError, load_central_config
            finally:
                sys.path.pop(0)
            with self.assertRaises(ConfigError):
                load_central_config(project)

            malformed = project / "_bmad" / "config.toml"
            malformed.write_text("[broken\n", encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(scripts / "resolve_config.py"), "--project-root", str(project)],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("failed to parse", result.stderr)

    def test_first_setup_from_packaged_help(self):
        sys.path.insert(0, str(REPO_ROOT / "tools"))
        try:
            import package_npx_skills
        finally:
            sys.path.pop(0)

        with tempfile.TemporaryDirectory() as temp_dir:
            out = Path(temp_dir) / "flatten"
            project = Path(temp_dir) / "my-app"
            project.mkdir()
            package_npx_skills.main(["--repo-root", str(REPO_ROOT), "--out", str(out)])
            skill = out / "skills" / "bmad-help"
            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_first_run_tree(project, skill, project_name="my-app")

    def test_first_setup_fixture_dest_help(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "demo-proj"
            skill = write_dest_help(root)
            project.mkdir()
            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_first_run_tree(project, skill, project_name="demo-proj", catalog=HELP_CSV)

            parsed = tomllib.loads((project / "_bmad" / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(
                parsed["agents"]["bmad-agent-pm"]["name"],
                "John",
            )

    def test_symlink_refused_copies_scripts(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root)
            project.mkdir()
            with mock.patch("os.symlink", side_effect=OSError("operation not permitted")):
                code = setup.main(["--project-root", str(project), "--skill", str(skill)])
            self.assertEqual(code, 0)
            scripts = project / "_bmad" / "scripts"
            self.assertFalse(scripts.is_symlink())
            self.assertTrue(scripts.is_dir())
            self.assertTrue(scripts_match(scripts, skill / "scripts"))

    def test_already_present_paths_are_left_alone(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "scripts" / "resolve_config.py", "# old-scripts\n")
            write(bmad / "config.toml", "# old-config\n")
            write(bmad / "config.user.toml", "# old-user\n")
            write(bmad / "core" / "config.yaml", "old: core\n")
            write(bmad / "bmm" / "config.yaml", "old: bmm\n")
            write(bmad / "custom" / "keep.txt", "custom-keep\n")
            write(bmad / "_config" / "bmad-help.csv", "old-catalog\n")
            output = project / "_bmad-output"
            write(output / "keep.txt", "output-keep\n")

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)

            self.assertEqual((bmad / "scripts" / "resolve_config.py").read_text(encoding="utf-8"), "# old-scripts\n")
            self.assertFalse((bmad / "scripts").is_symlink())
            self.assertEqual((bmad / "config.toml").read_text(encoding="utf-8"), "# old-config\n")
            self.assertEqual((bmad / "config.user.toml").read_text(encoding="utf-8"), "# old-user\n")
            self.assertEqual((bmad / "core" / "config.yaml").read_text(encoding="utf-8"), "old: core\n")
            self.assertEqual((bmad / "bmm" / "config.yaml").read_text(encoding="utf-8"), "old: bmm\n")
            self.assertEqual((bmad / "custom" / "keep.txt").read_text(encoding="utf-8"), "custom-keep\n")
            self.assertEqual((bmad / "_config" / "bmad-help.csv").read_text(encoding="utf-8"), "old-catalog\n")
            self.assertEqual((output / "keep.txt").read_text(encoding="utf-8"), "output-keep\n")

    def test_already_present_creates_missing_siblings(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root)
            project.mkdir()
            write(project / "_bmad" / "config.toml", "# keep-config\n")

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)

            self.assertEqual((project / "_bmad" / "config.toml").read_text(encoding="utf-8"), "# keep-config\n")
            scripts = project / "_bmad" / "scripts"
            self.assertTrue(scripts.is_symlink() or scripts_match(scripts, skill / "scripts"))
            self.assertTrue((project / "_bmad" / "core" / "config.yaml").is_file())
            self.assertTrue((project / "_bmad" / "bmm" / "config.yaml").is_file())
            self.assertTrue((project / "_bmad" / "custom").is_dir())
            self.assertEqual(
                (project / "_bmad" / "_config" / "bmad-help.csv").read_bytes(),
                (skill / "assets" / "bmad-help.csv").read_bytes(),
            )
            self.assertTrue((project / "_bmad-output").is_dir())

    def test_no_user_toml_without_answers(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root)
            project.mkdir()
            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self.assertEqual(user_toml_files(project / "_bmad"), [])
            custom = project / "_bmad" / "custom"
            self.assertTrue(custom.is_dir())
            self.assertEqual(list(custom.iterdir()), [])

    def test_user_answers_write_user_toml(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root)
            project.mkdir()
            result = run_setup(project, skill, *user_answers_args(project))
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            parsed = tomllib.loads(
                (project / "_bmad" / "config.user.toml").read_text(encoding="utf-8")
            )
            self.assertEqual(parsed["core"]["user_name"], "Alex")
            self.assertEqual(parsed["core"]["communication_language"], "English")
            self.assertEqual(parsed["modules"]["bmm"]["user_skill_level"], "intermediate")
            team = (project / "_bmad" / "config.toml").read_text(encoding="utf-8")
            self.assertNotIn("user_name", team)

    def test_user_answers_file_write_user_toml(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root)
            project.mkdir()
            result = run_setup(
                project,
                skill,
                *user_answers_args(
                    project,
                    "user_name = \"Alex \\\"AJ\\\" Rivera\"\n"
                    "communication_language = \"English\"\n"
                    "user_skill_level = \"intermediate\"\n",
                ),
            )
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            parsed = tomllib.loads(
                (project / "_bmad" / "config.user.toml").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual(parsed["core"]["user_name"], 'Alex "AJ" Rivera')
            self.assertEqual(
                parsed["core"]["communication_language"], "English"
            )
            self.assertEqual(
                parsed["modules"]["bmm"]["user_skill_level"], "intermediate"
            )

    def test_existing_user_toml_is_left_alone(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root)
            project.mkdir()
            write(project / "_bmad" / "config.user.toml", "# keep-user\n")
            result = run_setup(project, skill, *user_answers_args(project))
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self.assertEqual(
                (project / "_bmad" / "config.user.toml").read_text(encoding="utf-8"),
                "# keep-user\n",
            )

    def test_missing_scripts_does_not_leave_new_bmad(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root, scripts=False)
            project.mkdir()
            result = run_setup(project, skill)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(skill / "scripts"), result.stderr)
            self.assertFalse((project / "_bmad").exists())
            self.assertFalse((project / "_bmad-output").exists())

    def test_missing_assets_does_not_leave_new_bmad(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_help(root, assets=False)
            project.mkdir()
            result = run_setup(project, skill)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(skill / "assets"), result.stderr)
            self.assertFalse((project / "_bmad").exists())
            self.assertFalse((project / "_bmad-output").exists())

    def _assert_first_run_tree(
        self,
        project: Path,
        skill: Path,
        *,
        project_name: str,
        catalog: str | None = None,
    ) -> None:
        bmad = project / "_bmad"
        scripts = bmad / "scripts"
        skill_scripts = skill / "scripts"
        if symlink_to_temp_dir_succeeds():
            self.assertTrue(scripts.is_symlink())
            self.assertEqual(Path(os.readlink(scripts)).resolve(), skill_scripts.resolve())
        else:
            self.assertFalse(scripts.is_symlink())
            self.assertTrue(scripts_match(scripts, skill_scripts))

        parsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
        self.assertEqual(parsed["core"]["project_name"], project_name)
        self.assertEqual(parsed["core"]["document_output_language"], "English")
        self.assertEqual(parsed["core"]["output_folder"], "{project-root}/_bmad-output")
        self.assertNotIn("user_name", parsed["core"])
        self.assertNotIn("communication_language", parsed["core"])
        self.assertNotIn("user_skill_level", parsed["modules"]["bmm"])
        self.assertEqual(
            parsed["modules"]["bmm"]["planning_artifacts"],
            "{project-root}/_bmad-output/planning-artifacts",
        )
        self.assertEqual(
            parsed["modules"]["bmm"]["implementation_artifacts"],
            "{project-root}/_bmad-output/implementation-artifacts",
        )
        self.assertEqual(parsed["modules"]["bmm"]["project_knowledge"], "{project-root}/docs")
        expected = tomllib.loads(
            (skill / "assets" / "config.toml")
            .read_text(encoding="utf-8")
            .replace("{directory_name}", project_name)
        )
        self.assertEqual(set(parsed["agents"]), set(expected["agents"]))
        for code, expected_agent in expected["agents"].items():
            got = parsed["agents"][code]
            for field in ("module", "team", "name", "title", "icon", "description"):
                self.assertEqual(got[field], expected_agent[field], field)

        core_yaml = (bmad / "core" / "config.yaml").read_text(encoding="utf-8")
        bmm_yaml = (bmad / "bmm" / "config.yaml").read_text(encoding="utf-8")
        self.assertIn("project_name:", core_yaml)
        self.assertIn("output_folder:", core_yaml)
        self.assertIn("planning_artifacts:", bmm_yaml)
        self.assertIn("project_name:", bmm_yaml)
        self.assertIn("{project-root}/_bmad-output", core_yaml)

        custom = bmad / "custom"
        self.assertTrue(custom.is_dir())
        self.assertEqual(list(custom.iterdir()), [])
        self.assertEqual(user_toml_files(bmad), [])

        dest_catalog = bmad / "_config" / "bmad-help.csv"
        source_catalog = skill / "assets" / "bmad-help.csv"
        self.assertEqual(dest_catalog.read_bytes(), source_catalog.read_bytes())
        if catalog is not None:
            self.assertEqual(dest_catalog.read_text(encoding="utf-8"), catalog)

        self.assertTrue((project / "_bmad-output").is_dir())


if __name__ == "__main__":
    unittest.main()
