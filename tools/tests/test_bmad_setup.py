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
SETUP_PY = REPO_ROOT / "src" / "core-skills" / "bmad" / "scripts" / "setup.py"
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
    spec = importlib.util.spec_from_file_location("bmad_setup", SETUP_PY)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def write(path: Path, content: str = "x\n") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def write_dest_bmad(
    root: Path,
    *,
    scripts: bool = True,
    assets: bool = True,
    config: str | None = MINIMAL_CONFIG,
    user_config: str | None = MINIMAL_USER_CONFIG,
    catalog: str | None = HELP_CSV,
) -> Path:
    bmad_dir = root / "bmad"
    write(bmad_dir / "SKILL.md", "---\nname: bmad\n---\n")
    dest_setup = bmad_dir / "scripts" / "setup.py"
    dest_setup.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SETUP_PY, dest_setup)
    if scripts:
        for name in SHARED_SCRIPTS:
            source = REPO_ROOT / "src" / "scripts" / name
            shutil.copy2(source, bmad_dir / "scripts" / name)
    if assets:
        if config is not None:
            write(bmad_dir / "assets" / "config.template.toml", config)
        if user_config is not None:
            write(bmad_dir / "assets" / "config.user.template.toml", user_config)
        if catalog is not None:
            write(bmad_dir / "assets" / "bmad-help.csv", catalog)
    return bmad_dir


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
            str(skill / "scripts" / "setup.py"),
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
    dest_items = list(dest.iterdir())
    dest_files = {
        p.name: p.read_bytes()
        for p in dest_items
        if p.is_file() and not p.is_symlink()
    }
    src_files = {p.name: p.read_bytes() for p in src.iterdir() if p.is_file()}
    return len(dest_items) == len(dest_files) and dest_files == src_files


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


class BmadSetupTests(unittest.TestCase):
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
            if skill_md.parent.name == "bmad":
                continue
            self.assertFalse((skill_md.parent / "references" / "setup.md").exists())
            self.assertFalse((skill_md.parent / "scripts" / "setup.py").exists())
        for skill_md in (REPO_ROOT / "src" / "bmm-skills").rglob("SKILL.md"):
            self.assertFalse((skill_md.parent / "references" / "setup.md").exists())
            self.assertFalse((skill_md.parent / "scripts" / "setup.py").exists())

    def test_scripts_present_missing_config_toml_is_hard_error(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            skill = write_dest_bmad(root)
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

    def test_first_setup_from_packaged_bmad(self):
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
            skill = out / "skills" / "bmad"
            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_first_run_tree(project, skill, project_name="my-app")

    def test_first_setup_fixture_dest_bmad(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "demo-proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_first_run_tree(project, skill, project_name="demo-proj", catalog=HELP_CSV)

            parsed = tomllib.loads((project / "_bmad" / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(
                parsed["agents"]["bmad-agent-pm"]["name"],
                "John",
            )

    def test_first_setup_copies_scripts(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            with mock.patch(
                "os.symlink",
                side_effect=AssertionError("setup must not create a symlink"),
            ) as symlink:
                code = setup.main(
                    ["--project-root", str(project), "--skill", str(skill)]
                )
            self.assertEqual(code, 0)
            symlink.assert_not_called()
            self._assert_scripts_identity(
                project / "_bmad" / "scripts", skill / "scripts"
            )

    def test_already_present_paths_are_left_alone(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
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

            self._assert_scripts_identity(bmad / "scripts", skill / "scripts")
            parsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(parsed["core"]["project_name"], "proj")
            self.assertEqual(
                parsed["core"]["document_output_language"], "English"
            )
            self._assert_team_tables_match_template(parsed, skill, "proj")
            setup = load_setup()
            core_yaml = setup.parse_module_yaml(
                (bmad / "core" / "config.yaml").read_text(encoding="utf-8")
            )
            bmm_yaml = setup.parse_module_yaml(
                (bmad / "bmm" / "config.yaml").read_text(encoding="utf-8")
            )
            self.assertIsNotNone(core_yaml)
            self.assertIsNotNone(bmm_yaml)
            self.assertEqual(core_yaml["old"], "core")
            self.assertEqual(core_yaml["project_name"], "proj")
            self.assertEqual(bmm_yaml["old"], "bmm")
            self.assertIn("planning_artifacts", bmm_yaml)
            self.assertEqual(
                (bmad / "config.user.toml").read_text(encoding="utf-8"),
                "# old-user\n",
            )
            self.assertEqual(
                (bmad / "custom" / "keep.txt").read_text(encoding="utf-8"),
                "custom-keep\n",
            )
            self.assertEqual(
                (bmad / "_config" / "bmad-help.csv").read_bytes(),
                (skill / "assets" / "bmad-help.csv").read_bytes(),
            )
            self.assertEqual(
                (output / "keep.txt").read_text(encoding="utf-8"),
                "output-keep\n",
            )

    def test_already_present_creates_missing_siblings(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            write(project / "_bmad" / "config.toml", "# keep-config\n")

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)

            parsed = tomllib.loads(
                (project / "_bmad" / "config.toml").read_text(encoding="utf-8")
            )
            self.assertEqual(parsed["core"]["project_name"], "proj")
            self.assertEqual(
                parsed["core"]["document_output_language"], "English"
            )
            self._assert_team_tables_match_template(parsed, skill, "proj")
            scripts = project / "_bmad" / "scripts"
            self._assert_scripts_identity(scripts, skill / "scripts")
            self.assertTrue((project / "_bmad" / "core" / "config.yaml").is_file())
            self.assertTrue((project / "_bmad" / "bmm" / "config.yaml").is_file())
            self.assertTrue((project / "_bmad" / "custom").is_dir())
            self.assertEqual(
                (project / "_bmad" / "_config" / "bmad-help.csv").read_bytes(),
                (skill / "assets" / "bmad-help.csv").read_bytes(),
            )
            self.assertTrue((project / "_bmad-output").is_dir())

    def test_second_setup_keeps_answers_and_fills_new_keys(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            first = run_setup(project, skill)
            self.assertEqual(first.returncode, 0, msg=first.stderr)

            bmad = project / "_bmad"
            team = (bmad / "config.toml").read_text(encoding="utf-8")
            write(
                bmad / "config.toml",
                team.replace('project_name = "proj"', 'project_name = "Renamed"'),
            )
            setup = load_setup()
            core_path = bmad / "core" / "config.yaml"
            core_map = setup.parse_module_yaml(
                core_path.read_text(encoding="utf-8")
            )
            self.assertIsNotNone(core_map)
            core_map["document_output_language"] = "Spanish"
            write(core_path, setup.render_module_yaml(core_map))
            write(bmad / "custom" / "keep.txt", "custom-keep\n")
            write(bmad / "config.user.toml", "# keep-user\n")
            write(bmad / "custom" / "extra.user.toml", "# extra-user\n")

            write(
                skill / "assets" / "config.template.toml",
                MINIMAL_CONFIG.replace(
                    'output_folder = "{project-root}/_bmad-output"\n',
                    'output_folder = "{project-root}/_bmad-output"\n'
                    'review_language = "English"\n',
                ),
            )
            new_catalog = HELP_CSV + "Core,bmad-help,Help,H,,,,anytime,,,false,,\n"
            write(skill / "assets" / "bmad-help.csv", new_catalog)

            second = run_setup(project, skill)
            self.assertEqual(second.returncode, 0, msg=second.stderr)

            parsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(parsed["core"]["project_name"], "Renamed")
            self.assertEqual(parsed["core"]["review_language"], "English")
            self._assert_team_tables_match_template(parsed, skill, "proj")
            filled_core = setup.parse_module_yaml(
                (bmad / "core" / "config.yaml").read_text(encoding="utf-8")
            )
            self.assertIsNotNone(filled_core)
            self.assertEqual(filled_core["document_output_language"], "Spanish")
            self.assertEqual(filled_core["review_language"], "English")
            self.assertEqual(filled_core["project_name"], "proj")
            self.assertEqual(
                (bmad / "_config" / "bmad-help.csv").read_text(encoding="utf-8"),
                new_catalog,
            )
            self.assertEqual(
                (bmad / "custom" / "keep.txt").read_text(encoding="utf-8"),
                "custom-keep\n",
            )
            self.assertEqual(
                (bmad / "config.user.toml").read_text(encoding="utf-8"),
                "# keep-user\n",
            )
            self.assertEqual(
                (bmad / "custom" / "extra.user.toml").read_text(encoding="utf-8"),
                "# extra-user\n",
            )
            self._assert_scripts_identity(bmad / "scripts", skill / "scripts")

    def test_broken_or_wrong_scripts_link_is_repaired(self):
        if not symlink_to_temp_dir_succeeds():
            self.skipTest("symlinks not available")
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            bmad.mkdir()
            elsewhere = root / "elsewhere"
            elsewhere.mkdir()
            os.symlink(
                elsewhere, bmad / "scripts", target_is_directory=True
            )

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_scripts_identity(bmad / "scripts", skill / "scripts")

            scripts = bmad / "scripts"
            if scripts.is_symlink() or scripts.is_file():
                scripts.unlink()
            elif scripts.is_dir():
                shutil.rmtree(scripts)
            os.symlink(
                project / "missing-scripts",
                bmad / "scripts",
                target_is_directory=True,
            )
            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_scripts_identity(bmad / "scripts", skill / "scripts")

    def test_existing_scripts_link_does_not_require_symlink_permission(self):
        if not symlink_to_temp_dir_succeeds():
            self.skipTest("symlinks not available")
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            bmad.mkdir()
            write(bmad / "custom" / "keep.txt", "keep\n")
            os.symlink(
                skill / "scripts",
                bmad / "scripts",
                target_is_directory=True,
            )

            with mock.patch(
                "os.symlink", side_effect=OSError("operation not permitted")
            ) as symlink:
                code = setup.main(
                    ["--project-root", str(project), "--skill", str(skill)]
                )

            self.assertEqual(code, 0)
            symlink.assert_not_called()
            self._assert_scripts_identity(bmad / "scripts", skill / "scripts")
            self.assertEqual(
                (bmad / "custom" / "keep.txt").read_text(encoding="utf-8"),
                "keep\n",
            )

    def test_stale_scripts_copy_is_replaced(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            scripts = project / "_bmad" / "scripts"
            write(scripts / "resolve_config.py", "# stale\n")
            write(scripts / "leftover.py", "# leftover\n")

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_scripts_identity(scripts, skill / "scripts")
            self.assertFalse((scripts / "leftover.py").exists())

    def test_identical_scripts_copy_with_extra_directory_is_replaced(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            scripts = project / "_bmad" / "scripts"
            scripts.mkdir(parents=True)
            for item in (skill / "scripts").iterdir():
                if item.is_file():
                    shutil.copy2(item, scripts / item.name)
            (scripts / "leftover").mkdir()

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_scripts_identity(scripts, skill / "scripts")
            self.assertFalse((scripts / "leftover").exists())

    def test_expected_script_file_links_are_replaced_with_plain_files(self):
        if not symlink_to_temp_dir_succeeds():
            self.skipTest("symlinks not available")
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            scripts = project / "_bmad" / "scripts"
            scripts.mkdir(parents=True)
            for item in (skill / "scripts").iterdir():
                if item.is_file():
                    os.symlink(item, scripts / item.name)
            self.assertTrue(all(item.is_symlink() for item in scripts.iterdir()))

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_scripts_identity(scripts, skill / "scripts")

    def test_identical_scripts_copy_stays_a_copy(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            scripts = project / "_bmad" / "scripts"
            scripts.mkdir(parents=True)
            for item in (skill / "scripts").iterdir():
                if item.is_file():
                    shutil.copy2(item, scripts / item.name)
            marker = scripts / "resolve_config.py"
            source_marker = skill / "scripts" / marker.name
            os.utime(
                marker,
                ns=(946_684_800_000_000_000, 946_684_800_000_000_000),
            )
            preserved_mtime = marker.stat().st_mtime_ns
            self.assertNotEqual(
                preserved_mtime, source_marker.stat().st_mtime_ns
            )

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_scripts_identity(scripts, skill / "scripts")
            self.assertEqual(marker.stat().st_mtime_ns, preserved_mtime)

    def test_right_scripts_symlink_is_replaced_with_copy(self):
        if not symlink_to_temp_dir_succeeds():
            self.skipTest("symlinks not available")
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            bmad.mkdir()
            scripts = project / "_bmad" / "scripts"
            os.symlink(
                skill / "scripts", scripts, target_is_directory=True
            )

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_scripts_identity(scripts, skill / "scripts")

    def test_user_layers_and_leftovers_survive_second_setup(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "custom" / "keep.txt", "custom-keep\n")
            write(bmad / "config.user.toml", "# keep-user\n")
            write(bmad / "custom" / "notes.user.toml", "# custom-user\n")
            write(bmad / "_config" / "manifest.yaml", "leftover: installer\n")
            write(bmad / "_config" / "bmad-help.csv", "old-catalog\n")

            result = run_setup(project, skill, *user_answers_args(project))
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self.assertEqual(
                (bmad / "custom" / "keep.txt").read_text(encoding="utf-8"),
                "custom-keep\n",
            )
            self.assertEqual(
                (bmad / "config.user.toml").read_text(encoding="utf-8"),
                "# keep-user\n",
            )
            self.assertEqual(
                (bmad / "custom" / "notes.user.toml").read_text(encoding="utf-8"),
                "# custom-user\n",
            )
            self.assertEqual(
                (bmad / "_config" / "manifest.yaml").read_text(encoding="utf-8"),
                "leftover: installer\n",
            )
            self.assertEqual(
                (bmad / "_config" / "bmad-help.csv").read_bytes(),
                (skill / "assets" / "bmad-help.csv").read_bytes(),
            )

    def test_unparseable_toml_and_yaml_are_rewritten(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "config.toml", "[broken\n")
            write(bmad / "core" / "config.yaml", ":::not-yaml\n")
            write(bmad / "bmm" / "config.yaml", "- nested:\n  - list\n")

            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            parsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(parsed["core"]["project_name"], "proj")
            setup = load_setup()
            core_yaml = setup.parse_module_yaml(
                (bmad / "core" / "config.yaml").read_text(encoding="utf-8")
            )
            bmm_yaml = setup.parse_module_yaml(
                (bmad / "bmm" / "config.yaml").read_text(encoding="utf-8")
            )
            self.assertIsNotNone(core_yaml)
            self.assertIsNotNone(bmm_yaml)
            self.assertEqual(core_yaml["project_name"], "proj")
            self.assertIn("planning_artifacts", bmm_yaml)

    def test_no_user_toml_without_answers(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
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
            skill = write_dest_bmad(root)
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
            skill = write_dest_bmad(root)
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
            skill = write_dest_bmad(root)
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
            skill = write_dest_bmad(root, scripts=False)
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
            skill = write_dest_bmad(root, assets=False)
            project.mkdir()
            result = run_setup(project, skill)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(skill / "assets"), result.stderr)
            self.assertFalse((project / "_bmad").exists())
            self.assertFalse((project / "_bmad-output").exists())

    def test_script_copy_failure_preserves_existing_bmad_and_cleans_staging(
        self,
    ):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "scripts" / "resolve_config.py", "# original\n")
            write(bmad / "custom" / "keep.txt", "keep\n")
            write(bmad / "config.user.toml", "# user\n")
            (bmad / "empty-preserved").mkdir()
            before_inode = bmad.stat().st_ino
            before_files = {
                path.relative_to(bmad): path.read_bytes()
                for path in bmad.rglob("*")
                if path.is_file()
            }
            before_dirs = {
                path.relative_to(bmad)
                for path in bmad.rglob("*")
                if path.is_dir()
            }
            real_copy2 = shutil.copy2
            script_copy_attempts = 0
            skill_scripts = (skill / "scripts").resolve()

            def fail_second_script_copy(source, dest, *args, **kwargs):
                nonlocal script_copy_attempts
                source_path = Path(source)
                dest_path = Path(dest)
                if (
                    source_path.parent.resolve() == skill_scripts
                    and dest_path.parent.name == "scripts"
                    and dest_path.parent.parent.name.startswith("_bmad.setup-")
                ):
                    script_copy_attempts += 1
                    if script_copy_attempts == 2:
                        raise OSError("script copy failed")
                return real_copy2(source, dest, *args, **kwargs)

            with mock.patch.object(
                setup.shutil, "copy2", side_effect=fail_second_script_copy
            ):
                with self.assertRaisesRegex(OSError, "script copy failed"):
                    setup.main(
                        [
                            "--project-root",
                            str(project),
                            "--skill",
                            str(skill),
                        ]
                    )

            self.assertEqual(script_copy_attempts, 2)
            self.assertEqual(bmad.stat().st_ino, before_inode)
            self.assertEqual(
                {
                    path.relative_to(bmad): path.read_bytes()
                    for path in bmad.rglob("*")
                    if path.is_file()
                },
                before_files,
            )
            self.assertEqual(
                {
                    path.relative_to(bmad)
                    for path in bmad.rglob("*")
                    if path.is_dir()
                },
                before_dirs,
            )
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def _assert_scripts_identity(self, dest: Path, src: Path) -> None:
        self.assertFalse(dest.is_symlink())
        self.assertTrue(dest.is_dir())
        self.assertTrue(scripts_match(dest, src))

    def _assert_team_tables_match_template(
        self, parsed: dict, skill: Path, project_name: str
    ) -> None:
        expected = tomllib.loads(
            (skill / "assets" / "config.template.toml")
            .read_text(encoding="utf-8")
            .replace("{directory_name}", project_name)
        )
        self.assertEqual(
            parsed["modules"]["bmm"]["planning_artifacts"],
            "{project-root}/_bmad-output/planning-artifacts",
        )
        self.assertEqual(
            parsed["modules"]["bmm"]["implementation_artifacts"],
            "{project-root}/_bmad-output/implementation-artifacts",
        )
        self.assertEqual(
            parsed["modules"]["bmm"]["project_knowledge"], "{project-root}/docs"
        )
        self.assertEqual(set(parsed["agents"]), set(expected["agents"]))
        for code, expected_agent in expected["agents"].items():
            got = parsed["agents"][code]
            for field in ("module", "team", "name", "title", "icon", "description"):
                self.assertEqual(got[field], expected_agent[field], field)

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
        self._assert_scripts_identity(scripts, skill_scripts)

        parsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
        self.assertEqual(parsed["core"]["project_name"], project_name)
        self.assertEqual(parsed["core"]["document_output_language"], "English")
        self.assertEqual(parsed["core"]["output_folder"], "{project-root}/_bmad-output")
        self.assertNotIn("user_name", parsed["core"])
        self.assertNotIn("communication_language", parsed["core"])
        self.assertNotIn("user_skill_level", parsed["modules"]["bmm"])
        self._assert_team_tables_match_template(parsed, skill, project_name)

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
