import datetime
import importlib.util
import json
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
SETUP_PY = REPO_ROOT / "skills" / "bmad" / "scripts" / "setup.py"
SHARED_SCRIPTS = (
    "config_utils.py",
    "memlog.py",
    "render_skill.py",
    "resolve_config.py",
    "resolve_customization.py",
)
MINIMAL_CONFIG = """\
[core]
project_name = "{directory_name}"
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
) -> Path:
    bmad_dir = root / "bmad"
    write(bmad_dir / "SKILL.md", "---\nname: bmad\n---\n")
    dest_setup = bmad_dir / "scripts" / "setup.py"
    dest_setup.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SETUP_PY, dest_setup)
    if scripts:
        for name in SHARED_SCRIPTS:
            source = REPO_ROOT / "skills" / "bmad" / "scripts" / name
            shutil.copy2(source, bmad_dir / "scripts" / name)
    if assets and config is not None:
        write(bmad_dir / "assets" / "config.template.toml", config)
    return bmad_dir


def module_answers_args(
    project: Path, answers: dict[str, dict[str, str]]
) -> list[str]:
    path = project / ".bmad-help-setup-modules.toml"
    lines: list[str] = []
    for module, values in answers.items():
        lines.append(f"[modules.{json.dumps(module, ensure_ascii=False)}]")
        lines.extend(
            f"{json.dumps(key, ensure_ascii=False)} = "
            f"{json.dumps(value, ensure_ascii=False)}"
            for key, value in values.items()
        )
        lines.append("")
    write(path, "\n".join(lines))
    return ["--module-answers", str(path)]


def toml_inline(value: object) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, list) and all(isinstance(item, str) for item in value):
        return "[" + ", ".join(toml_inline(item) for item in value) + "]"
    raise TypeError(f"unsupported TOML fixture value: {value!r}")


def dump_manifest_toml(data: dict[str, object]) -> str:
    scalars: list[tuple[str, object]] = []
    arrays_of_tables: list[tuple[str, list]] = []
    tables: list[tuple[str, dict]] = []
    for key, value in data.items():
        if isinstance(value, list) and value and all(
            isinstance(item, dict) for item in value
        ):
            arrays_of_tables.append((key, value))
        elif isinstance(value, dict):
            tables.append((key, value))
        else:
            scalars.append((key, value))
    lines = [f"{key} = {toml_inline(value)}" for key, value in scalars]
    for key, items in arrays_of_tables:
        for item in items:
            if lines:
                lines.append("")
            lines.append(f"[[{key}]]")
            for nested_key, nested_value in item.items():
                lines.append(f"{nested_key} = {toml_inline(nested_value)}")
    for key, table in tables:
        if lines:
            lines.append("")
        lines.append(f"[{key}]")
        for nested_key, nested_value in table.items():
            lines.append(f"{nested_key} = {toml_inline(nested_value)}")
    return "\n".join(lines) + "\n"


def write_module_skill(
    root: Path,
    skill_id: str,
    module: str,
    *,
    questions: tuple[dict[str, str], ...] = (),
    scripts: dict[str, bytes] | None = None,
    script_entries: tuple[str, ...] | None = None,
    update_source: str = "file:skills",
    version: str = "1.2.3",
    extra_fields: dict[str, object] | None = None,
) -> Path:
    skill = root / skill_id
    scripts = scripts or {}
    manifest: dict[str, object] = {
        "version": version,
        "module": module,
        "update_source": update_source,
    }
    if questions:
        manifest["config_questions"] = list(questions)
    entries = tuple(scripts) if script_entries is None else script_entries
    if entries:
        manifest["scripts"] = list(entries)
    if extra_fields:
        manifest.update(extra_fields)
    write(skill / "module-manifest.toml", dump_manifest_toml(manifest))
    for relative, content in scripts.items():
        path = skill / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
    return skill


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


def run_setup_python(
    project: Path, skill: Path, *extra: str
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [
            sys.executable,
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

        for skill_md in (REPO_ROOT / "skills").rglob("SKILL.md"):
            if skill_md.parent.name == "bmad":
                continue
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

            sys.path.insert(0, str(REPO_ROOT / "skills" / "bmad" / "scripts"))
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

    def test_first_setup_fixture_dest_bmad(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "demo-proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            result = run_setup(project, skill)
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self._assert_first_run_tree(project, skill, project_name="demo-proj")

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
                (bmad / "_config" / "bmad-help.csv").read_text(encoding="utf-8"),
                "old-catalog\n",
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
            self._assert_team_tables_match_template(parsed, skill, "proj")
            scripts = project / "_bmad" / "scripts"
            self._assert_scripts_identity(scripts, skill / "scripts")
            self.assertTrue((project / "_bmad" / "core" / "config.yaml").is_file())
            self.assertTrue((project / "_bmad" / "bmm" / "config.yaml").is_file())
            self.assertTrue((project / "_bmad" / "custom").is_dir())
            self.assertFalse(
                (project / "_bmad" / "_config" / "bmad-help.csv").exists()
            )
            self.assertTrue((project / "_bmad-output").is_dir())

    def test_setup_leaves_legacy_catalog_alone(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            legacy_catalog = project / "_bmad" / "_config" / "bmad-help.csv"
            write(legacy_catalog, "old-catalog\n")

            result = run_setup(project, skill)

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self.assertEqual(
                legacy_catalog.read_text(encoding="utf-8"), "old-catalog\n"
            )

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
            core_map["legacy_note"] = "Spanish"
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
            self.assertEqual(filled_core["legacy_note"], "Spanish")
            self.assertEqual(filled_core["review_language"], "English")
            self.assertEqual(filled_core["project_name"], "proj")
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

            result = run_setup(project, skill)
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
                (bmad / "_config" / "bmad-help.csv").read_text(encoding="utf-8"),
                "old-catalog\n",
            )

    def test_lists_ordered_missing_manifest_questions_without_writing(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "demo-proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            write(
                project / "_bmad" / "config.toml",
                "[modules.alpha]\nexisting = false\n",
            )
            write(project / "_bmad" / "custom" / "keep.txt", "keep\n")
            write_module_skill(
                root,
                "zeta-skill",
                "zeta",
                questions=(
                    {
                        "key": "choice",
                        "prompt": "Choose zeta",
                        "default": "{directory_name}/{project-root}/{unknown}",
                    },
                ),
            )
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                questions=(
                    {
                        "key": "existing",
                        "prompt": "Do not ask",
                        "default": "ignored",
                    },
                    {
                        "key": "first",
                        "prompt": "First alpha",
                        "default": "one",
                    },
                    {
                        "key": "nested.second",
                        "prompt": "Second alpha",
                        "default": "two",
                    },
                ),
            )
            before = {
                path.relative_to(project): path.read_bytes()
                for path in project.rglob("*")
                if path.is_file()
            }

            result = run_setup(project, skill, "--list-config-questions")

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            questions = json.loads(result.stdout)
            self.assertEqual(
                [
                    (item["module"], item["key"], item["prompt"])
                    for item in questions
                ],
                [
                    ("alpha", "first", "First alpha"),
                    ("alpha", "nested.second", "Second alpha"),
                    ("zeta", "choice", "Choose zeta"),
                ],
            )
            self.assertEqual(
                questions[2]["default"],
                "demo-proj/{project-root}/{unknown}",
            )
            self.assertEqual(
                {
                    path.relative_to(project): path.read_bytes()
                    for path in project.rglob("*")
                    if path.is_file()
                },
                before,
            )
            self.assertFalse((project / "_bmad-output").exists())
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_manifest_answers_and_nested_scripts_are_installed_and_refreshed(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(
                bmad / "config.toml",
                "[modules.alpha]\n"
                "existing = 42\n"
                '"naïve" = "café"\n'
                "release_date = 2026-08-18\n"
                "release_time = 14:35:22.123456\n"
                "release_datetime = 2026-08-18T14:35:22-07:00\n",
            )
            original_values = tomllib.loads(
                (bmad / "config.toml").read_text(encoding="utf-8")
            )["modules"]["alpha"]
            write(bmad / "custom" / "keep.txt", "custom\n")
            write(bmad / "config.user.toml", "# user\n")
            questions = (
                {
                    "key": "existing",
                    "prompt": "Existing",
                    "default": "ignored",
                },
                {
                    "key": "nested.answer",
                    "prompt": "Nested",
                    "default": "default",
                },
                {
                    "key": "escaped",
                    "prompt": "Escaped",
                    "default": "default",
                },
            )
            script_path = "scripts/tools/check.py"
            module_skill = write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                questions=questions,
                scripts={script_path: b"# module script\n"},
            )
            escaped = 'quote " slash \\ tab\t line\n control\x01'

            result = run_setup(
                project,
                skill,
                *module_answers_args(
                    project,
                    {
                        "alpha": {
                            "nested.answer": "chosen",
                            "escaped": escaped,
                        }
                    },
                ),
            )

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            parsed = tomllib.loads(
                (bmad / "config.toml").read_text(encoding="utf-8")
            )
            self.assertEqual(parsed["modules"]["alpha"]["existing"], 42)
            for key in (
                "naïve",
                "release_date",
                "release_time",
                "release_datetime",
            ):
                self.assertEqual(parsed["modules"]["alpha"][key], original_values[key])
                self.assertIs(
                    type(parsed["modules"]["alpha"][key]),
                    type(original_values[key]),
                )
            self.assertIsInstance(
                parsed["modules"]["alpha"]["release_date"], datetime.date
            )
            self.assertIsInstance(
                parsed["modules"]["alpha"]["release_time"], datetime.time
            )
            self.assertIsInstance(
                parsed["modules"]["alpha"]["release_datetime"],
                datetime.datetime,
            )
            self.assertEqual(
                parsed["modules"]["alpha"]["nested"]["answer"], "chosen"
            )
            self.assertEqual(parsed["modules"]["alpha"]["escaped"], escaped)
            installed = bmad / "alpha" / "scripts" / "tools" / "check.py"
            self.assertEqual(
                installed.read_bytes(),
                (module_skill / script_path).read_bytes(),
            )
            self.assertFalse((bmad / "scripts" / "tools" / "check.py").exists())
            self.assertFalse((bmad / "alpha" / "config.yaml").exists())
            self.assertEqual(
                (bmad / "custom" / "keep.txt").read_bytes(), b"custom\n"
            )
            self.assertEqual(
                (bmad / "config.user.toml").read_bytes(), b"# user\n"
            )

            expanded_questions = questions + (
                {
                    "key": "new_key",
                    "prompt": "New question",
                    "default": "new default",
                },
            )
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                questions=expanded_questions,
                scripts={script_path: b"# refreshed\n"},
            )
            pending = run_setup(project, skill, "--list-config-questions")
            self.assertEqual(pending.returncode, 0, msg=pending.stderr)
            self.assertEqual(
                [item["key"] for item in json.loads(pending.stdout)],
                ["new_key"],
            )
            second = run_setup(
                project,
                skill,
                *module_answers_args(
                    project, {"alpha": {"new_key": "new answer"}}
                ),
            )
            self.assertEqual(second.returncode, 0, msg=second.stderr)
            reparsed = tomllib.loads(
                (bmad / "config.toml").read_text(encoding="utf-8")
            )
            self.assertEqual(reparsed["modules"]["alpha"]["existing"], 42)
            self.assertEqual(reparsed["modules"]["alpha"]["escaped"], escaped)
            for key in (
                "naïve",
                "release_date",
                "release_time",
                "release_datetime",
            ):
                self.assertEqual(
                    reparsed["modules"]["alpha"][key], original_values[key]
                )
                self.assertIs(
                    type(reparsed["modules"]["alpha"][key]),
                    type(original_values[key]),
                )
            self.assertEqual(
                reparsed["modules"]["alpha"]["new_key"], "new answer"
            )
            self.assertEqual(installed.read_bytes(), b"# refreshed\n")

    def test_bmm_manifest_answers_do_not_enter_legacy_module_yaml(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            write_module_skill(
                root,
                "bmm-skill",
                "bmm",
                questions=(
                    {
                        "key": "review.mode",
                        "prompt": "Review mode",
                        "default": "strict",
                    },
                ),
            )

            result = run_setup(
                project,
                skill,
                *module_answers_args(
                    project, {"bmm": {"review.mode": "strict"}}
                ),
            )

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            parsed = tomllib.loads(
                (project / "_bmad" / "config.toml").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual(
                parsed["modules"]["bmm"]["review"]["mode"], "strict"
            )
            legacy = (project / "_bmad" / "bmm" / "config.yaml").read_text(
                encoding="utf-8"
            )
            self.assertNotIn("review", legacy)
            self.assertNotIn("strict", legacy)

    def test_future_manifest_fields_are_ignored_by_runtime_setup(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                questions=(
                    {
                        "key": "answer",
                        "prompt": "Future-compatible prompt",
                        "default": "yes",
                    },
                ),
                extra_fields={
                    "future_manifest_feature": {
                        "enabled": True,
                        "format": 2,
                    }
                },
            )

            pending = run_setup(project, skill, "--list-config-questions")
            self.assertEqual(pending.returncode, 0, msg=pending.stderr)
            self.assertEqual(
                json.loads(pending.stdout)[0]["prompt"],
                "Future-compatible prompt",
            )
            result = run_setup(
                project,
                skill,
                *module_answers_args(
                    project, {"alpha": {"answer": "accepted"}}
                ),
            )

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            parsed = tomllib.loads(
                (project / "_bmad" / "config.toml").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual(
                parsed["modules"]["alpha"]["answer"], "accepted"
            )

    def test_module_scripts_with_same_relative_path_stay_isolated(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            relative = "scripts/shared/tool.py"
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                scripts={relative: b"# alpha\n"},
            )
            write_module_skill(
                root,
                "beta-skill",
                "beta",
                scripts={relative: b"# beta\n"},
            )

            result = run_setup(project, skill)

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            bmad = project / "_bmad"
            self.assertEqual(
                (bmad / "alpha" / relative).read_bytes(), b"# alpha\n"
            )
            self.assertEqual(
                (bmad / "beta" / relative).read_bytes(), b"# beta\n"
            )
            self.assertFalse((bmad / relative).exists())

    def test_existing_scalar_blocks_declared_descendant_without_overwrite(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            config = project / "_bmad" / "config.toml"
            write(config, '[modules.alpha]\noutput = "keep"\n')
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                questions=(
                    {
                        "key": "output.directory",
                        "prompt": "Output directory",
                        "default": "out",
                    },
                ),
            )
            before = config.read_bytes()

            result = run_setup(
                project,
                skill,
                *module_answers_args(
                    project,
                    {"alpha": {"output.directory": "replacement"}},
                ),
            )

            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(config), result.stderr)
            self.assertIn("parent value", result.stderr)
            self.assertEqual(config.read_bytes(), before)
            self.assertEqual(
                tomllib.loads(config.read_text(encoding="utf-8"))["modules"]
                ["alpha"]["output"],
                "keep",
            )
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_identical_manifest_copies_dedupe_and_conflicts_are_atomic(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            question = (
                {
                    "key": "answer",
                    "prompt": "Answer",
                    "default": "yes",
                },
            )
            write_module_skill(root, "alpha-one", "alpha", questions=question)
            write_module_skill(root, "alpha-two", "alpha", questions=question)
            pending = run_setup(project, skill, "--list-config-questions")
            self.assertEqual(pending.returncode, 0, msg=pending.stderr)
            self.assertEqual(len(json.loads(pending.stdout)), 1)

            write(project / "_bmad" / "config.toml", MINIMAL_CONFIG)
            write(project / "_bmad" / "custom" / "keep.txt", "keep\n")
            before = {
                path.relative_to(project / "_bmad"): path.read_bytes()
                for path in (project / "_bmad").rglob("*")
                if path.is_file()
            }
            write_module_skill(
                root,
                "alpha-two",
                "alpha",
                questions=(
                    {
                        "key": "different",
                        "prompt": "Different",
                        "default": "no",
                    },
                ),
            )

            result = run_setup(project, skill)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("conflicting installed manifests", result.stderr)
            self.assertIn("alpha-one", result.stderr)
            self.assertIn("alpha-two", result.stderr)
            self.assertEqual(
                {
                    path.relative_to(project / "_bmad"): path.read_bytes()
                    for path in (project / "_bmad").rglob("*")
                    if path.is_file()
                },
                before,
            )
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_missing_declared_script_and_invalid_answers_are_atomic(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            write(project / "_bmad" / "config.toml", MINIMAL_CONFIG)
            write(project / "_bmad" / "custom" / "keep.txt", "keep\n")
            original = {
                path.relative_to(project / "_bmad"): path.read_bytes()
                for path in (project / "_bmad").rglob("*")
                if path.is_file()
            }
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                script_entries=("scripts/missing.py",),
            )

            missing = run_setup(project, skill)

            self.assertNotEqual(missing.returncode, 0)
            self.assertIn("scripts/missing.py", missing.stderr)
            self.assertEqual(
                {
                    path.relative_to(project / "_bmad"): path.read_bytes()
                    for path in (project / "_bmad").rglob("*")
                    if path.is_file()
                },
                original,
            )

            shutil.rmtree(root / "alpha-skill")
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                questions=(
                    {
                        "key": "answer",
                        "prompt": "Answer",
                        "default": "yes",
                    },
                ),
            )
            answer_path = project / ".bmad-help-setup-modules.toml"
            write(answer_path, "[modules.alpha]\nanswer = 7\n")

            invalid = run_setup(
                project, skill, "--module-answers", str(answer_path)
            )

            self.assertNotEqual(invalid.returncode, 0)
            self.assertIn("must be a string", invalid.stderr)
            self.assertEqual(
                {
                    path.relative_to(project / "_bmad"): path.read_bytes()
                    for path in (project / "_bmad").rglob("*")
                    if path.is_file()
                },
                original,
            )

    def test_invalid_packaged_manifest_is_source_specific_and_atomic(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "config.toml", MINIMAL_CONFIG)
            write(bmad / "custom" / "keep.txt", "keep\n")
            manifest = root / "alpha-skill" / "module-manifest.toml"
            write(
                manifest,
                'version = "1.2.3"\n'
                'module = "alpha"\n'
                'update_source = "file:skills"\n'
                'config_questions = "invalid"\n',
            )
            before = {
                path.relative_to(bmad): path.read_bytes()
                for path in bmad.rglob("*")
                if path.is_file()
            }

            result = run_setup(project, skill)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(manifest), result.stderr)
            self.assertIn("config_questions", result.stderr)
            self.assertEqual(
                {
                    path.relative_to(bmad): path.read_bytes()
                    for path in bmad.rglob("*")
                    if path.is_file()
                },
                before,
            )
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_runtime_manifest_validation_rejects_recognized_bad_shapes(self):
        setup = load_setup()
        base = {
            "version": "1.2.3",
            "module": "alpha",
            "update_source": "file:skills",
        }
        cases: tuple[tuple[str, bytes, str], ...] = (
            ("malformed-toml", b"version = [\n", "TOML"),
            (
                "duplicate-toml-key",
                (
                    'version = "1.2.3"\n'
                    'module = "alpha"\n'
                    'module = "beta"\n'
                    'update_source = "file:skills"\n'
                ).encode(),
                "overwrite",
            ),
            (
                "duplicate-question",
                dump_manifest_toml(
                    {
                        **base,
                        "config_questions": [
                            {"key": "output", "prompt": "One", "default": "1"},
                            {"key": "output", "prompt": "Two", "default": "2"},
                        ],
                    }
                ).encode(),
                "conflicts",
            ),
            (
                "question-prefix-collision",
                dump_manifest_toml(
                    {
                        **base,
                        "config_questions": [
                            {"key": "output", "prompt": "One", "default": "1"},
                            {
                                "key": "output.directory",
                                "prompt": "Two",
                                "default": "2",
                            },
                        ],
                    }
                ).encode(),
                "conflicts",
            ),
            *tuple(
                (
                    f"unsafe-script-{index}",
                    dump_manifest_toml({**base, "scripts": [entry]}).encode(),
                    repr(entry),
                )
                for index, entry in enumerate(
                    ("scripts", "scripts/", "scripts/../tool.py", "other/tool.py")
                )
            ),
            (
                "unsafe-module",
                dump_manifest_toml({**base, "module": "../escape"}).encode(),
                "unsafe",
            ),
            (
                "case-insensitive-reserved-module",
                dump_manifest_toml({**base, "module": "ScRiPtS"}).encode(),
                "unsafe",
            ),
        )

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            for name, raw, diagnostic in cases:
                path = root / name / "module-manifest.toml"
                with self.subTest(name=name), self.assertRaises(Exception) as caught:
                    setup.parse_packaged_manifest(path, raw)
                message = str(caught.exception)
                self.assertIn(str(path), message)
                self.assertIn(diagnostic.lower(), message.lower())

    def test_case_only_module_ids_name_both_sources_and_are_atomic(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "config.toml", MINIMAL_CONFIG)
            write(bmad / "custom" / "keep.txt", "keep\n")
            upper = write_module_skill(root, "upper-skill", "Alpha")
            lower = write_module_skill(root, "lower-skill", "alpha")
            before = {
                path.relative_to(bmad): path.read_bytes()
                for path in bmad.rglob("*")
                if path.is_file()
            }

            result = run_setup(project, skill)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("differ only by case", result.stderr)
            self.assertIn(str(upper / "module-manifest.toml"), result.stderr)
            self.assertIn(str(lower / "module-manifest.toml"), result.stderr)
            self.assertEqual(
                {
                    path.relative_to(bmad): path.read_bytes()
                    for path in bmad.rglob("*")
                    if path.is_file()
                },
                before,
            )
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_symlinked_declared_script_is_rejected(self):
        if not symlink_to_temp_dir_succeeds():
            self.skipTest("symlinks not available")
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            module_skill = write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                script_entries=("scripts/link.py",),
            )
            outside = root / "outside.py"
            write(outside, "# outside\n")
            link = module_skill / "scripts" / "link.py"
            link.parent.mkdir(parents=True)
            os.symlink(outside, link)

            result = run_setup(project, skill)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(module_skill / "module-manifest.toml"), result.stderr)
            self.assertIn("scripts/link.py", result.stderr)
            self.assertFalse((project / "_bmad").exists())
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_declared_script_read_error_is_source_specific_and_atomic(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "config.toml", MINIMAL_CONFIG)
            write(bmad / "custom" / "keep.txt", "keep\n")
            module_skill = write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                scripts={"scripts/tool.py": b"# tool\n"},
            )
            declared = (module_skill / "scripts" / "tool.py").resolve()
            manifest = module_skill / "module-manifest.toml"
            before = {
                path.relative_to(bmad): path.read_bytes()
                for path in bmad.rglob("*")
                if path.is_file()
            }
            real_read_bytes = Path.read_bytes

            def fail_declared(path: Path) -> bytes:
                if path == declared:
                    raise OSError("declared read failed")
                return real_read_bytes(path)

            with mock.patch.object(Path, "read_bytes", fail_declared):
                with self.assertRaises(Exception) as caught:
                    setup.main(
                        [
                            "--project-root",
                            str(project),
                            "--skill",
                            str(skill),
                        ]
                    )

            message = str(caught.exception)
            self.assertIn(str(declared), message)
            self.assertIn(str(manifest), message)
            self.assertIn("declared read failed", message)
            self.assertEqual(
                {
                    path.relative_to(bmad): path.read_bytes()
                    for path in bmad.rglob("*")
                    if path.is_file()
                },
                before,
            )
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_module_answer_collisions_and_diagnostics_name_source(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            collision = root / "collision.toml"
            write(
                collision,
                '[modules.alpha]\n"nested.answer" = "literal"\n'
                "[modules.alpha.nested]\nanswer = \"table\"\n",
            )
            with self.assertRaises(Exception) as caught:
                setup.load_module_answers(collision)
            self.assertIn(str(collision), str(caught.exception))
            self.assertIn("more than once", str(caught.exception))

            for mode in ("missing", "extra"):
                with self.subTest(mode=mode):
                    case_root = root / mode
                    project = case_root / "proj"
                    skill = write_dest_bmad(case_root)
                    project.mkdir()
                    questions = (
                        {
                            "key": "first",
                            "prompt": "First",
                            "default": "one",
                        },
                        {
                            "key": "second",
                            "prompt": "Second",
                            "default": "two",
                        },
                    )
                    write_module_skill(
                        case_root,
                        "alpha-skill",
                        "alpha",
                        questions=questions,
                    )
                    answer_path = project / "chosen-module-answers.toml"
                    if mode == "missing":
                        write(answer_path, '[modules.alpha]\nfirst = "one"\n')
                        diagnostic = "modules.alpha.second"
                    else:
                        write(
                            answer_path,
                            '[modules.alpha]\nfirst = "one"\n'
                            'second = "two"\nextra = "three"\n',
                        )
                        diagnostic = "modules.alpha.extra"

                    result = run_setup(
                        project,
                        skill,
                        "--module-answers",
                        str(answer_path),
                    )

                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn(str(answer_path), result.stderr)
                    self.assertIn(diagnostic, result.stderr)
                    self.assertFalse((project / "_bmad").exists())
                    self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_unparseable_team_toml_is_hard_error_and_yaml_is_unchanged(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "config.toml", "[broken\n")
            write(bmad / "core" / "config.yaml", ":::not-yaml\n")
            write(bmad / "bmm" / "config.yaml", "- nested:\n  - list\n")
            before = {
                path.relative_to(bmad): path.read_bytes()
                for path in bmad.rglob("*")
                if path.is_file()
            }

            result = run_setup(project, skill)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(bmad / "config.toml"), result.stderr)
            self.assertIn("cannot parse TOML", result.stderr)
            self.assertEqual(
                {
                    path.relative_to(bmad): path.read_bytes()
                    for path in bmad.rglob("*")
                    if path.is_file()
                },
                before,
            )
            self.assertFalse((project / "_bmad-output").exists())
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

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

    def test_existing_user_toml_is_left_alone(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            write(project / "_bmad" / "config.user.toml", "# keep-user\n")
            result = run_setup(project, skill)
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
    ) -> None:
        bmad = project / "_bmad"
        scripts = bmad / "scripts"
        skill_scripts = skill / "scripts"
        self._assert_scripts_identity(scripts, skill_scripts)

        parsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
        self.assertEqual(parsed["core"]["project_name"], project_name)
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

        self.assertFalse((bmad / "_config" / "bmad-help.csv").exists())

        self.assertTrue((project / "_bmad-output").is_dir())


class BmadUpdateDoctorTests(unittest.TestCase):
    def test_update_reports_version_matrix_spreads_and_source_failures_read_only(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(
                root,
                "bmad",
                "core",
                update_source="file:sources",
            )
            write_module_skill(project / "sources", "bmad", "core")
            cases = (
                ("equal-skill", "equal", "1.2.3", "1.2.3", "current"),
                (
                    "newer-skill",
                    "newer",
                    "1.2.3",
                    "1.3.0",
                    "newer-available",
                ),
                ("ahead-skill", "ahead", "2.0.0", "1.9.9", "ahead"),
                (
                    "dev-skill",
                    "dev",
                    "2.0.0-dev.gabc",
                    "2.0.0",
                    "differing-unordered",
                ),
                (
                    "invalid-skill",
                    "invalid",
                    "tomorrow",
                    "2.0.0",
                    "differing-unordered",
                ),
            )
            for skill_id, module, installed, source, _state in cases:
                write_module_skill(
                    root,
                    skill_id,
                    module,
                    version=installed,
                    update_source="file:sources",
                )
                write_module_skill(
                    project / "sources",
                    skill_id,
                    module,
                    version=source,
                )
            write_module_skill(
                root,
                "spread-old",
                "spread",
                version="1.0.0",
                update_source="file:sources",
            )
            write_module_skill(
                root,
                "spread-new",
                "spread",
                version="2.0.0",
                update_source="file:sources",
            )
            for skill_id, version in (("spread-old", "2.0.0"), ("spread-new", "2.0.0")):
                write_module_skill(
                    project / "sources",
                    skill_id,
                    "spread",
                    version=version,
                )
            write_module_skill(
                root,
                "missing-source",
                "unreachable",
                update_source="file:sources",
            )
            write_module_skill(
                root,
                "broken-source",
                "broken",
                update_source="file:sources",
            )
            write(
                project / "sources" / "broken-source" / "module-manifest.toml",
                'module = "broken"\n',
            )
            write(project / "skills-lock.json", "keep\n")
            before = {
                path: path.read_bytes()
                for path in root.rglob("*")
                if path.is_file()
            }

            result = run_setup_python(project, skill, "--update")

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            report = json.loads(result.stdout)
            by_module = {item["module"]: item for item in report["modules"]}
            for _skill_id, module, _installed, _source, state in cases:
                self.assertEqual(by_module[module]["state"], state)
            self.assertEqual(by_module["spread"]["state"], "version-spread")
            self.assertEqual(
                [(copy["skill"], copy["version"]) for copy in by_module["spread"]["copies"]],
                [("spread-new", "2.0.0"), ("spread-old", "1.0.0")],
            )
            self.assertEqual(
                by_module["unreachable"]["state"], "could-not-check"
            )
            self.assertIn(
                "missing-source/module-manifest.toml",
                by_module["unreachable"]["copies"][0]["reason"],
            )
            self.assertEqual(by_module["broken"]["state"], "could-not-check")
            self.assertIn(
                "field 'version'",
                by_module["broken"]["copies"][0]["reason"],
            )
            self.assertEqual(report["bmad_copy"]["version"], "1.2.3")
            self.assertFalse(report["current"])
            self.assertEqual(
                {
                    path: path.read_bytes()
                    for path in root.rglob("*")
                    if path.is_file()
                },
                before,
            )

    def test_update_source_resolution_uses_https_roots_and_github_head(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            https_skill = write_module_skill(
                root,
                "https-skill",
                "httpsmod",
                update_source="https://example.test/tree",
            )
            github_skill = write_module_skill(
                root,
                "github-skill",
                "githubmod",
                update_source="github:owner/repository/skills",
            )
            copies = {
                copy_item.skill: copy_item
                for copy_item in setup.discover_installed_copies(skill)
            }
            response = mock.MagicMock()
            response.__enter__.return_value.read.return_value = (
                b'version = "1.2.3"\n'
            )
            response.__exit__.return_value = False
            with mock.patch.object(
                setup.urllib.request, "urlopen", return_value=response
            ) as opened:
                for copy_item in (
                    copies[https_skill.name],
                    copies[github_skill.name],
                ):
                    setup.read_source_manifest(
                        setup.source_manifest_location(project, copy_item),
                        copy_item,
                    )
            urls = [call.args[0].full_url for call in opened.call_args_list]
            self.assertEqual(
                urls[0],
                "https://example.test/tree/https-skill/module-manifest.toml",
            )
            self.assertEqual(
                urls[1],
                "https://raw.githubusercontent.com/owner/repository/HEAD/"
                "skills/github-skill/module-manifest.toml",
            )

    def test_doctor_uses_highest_release_adds_only_missing_and_exactly_repairs(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core", version="3.0.0")
            old_question = {
                "key": "existing",
                "prompt": "Existing value",
                "default": "old",
            }
            new_question = {
                "key": "new.answer",
                "prompt": "New value",
                "default": "new default",
            }
            write_module_skill(
                root,
                "alpha-old",
                "alpha",
                version="1.0.0",
                questions=(old_question,),
                scripts={"scripts/old.py": b"old payload\n"},
            )
            write_module_skill(
                root,
                "alpha-new",
                "alpha",
                version="2.0.0",
                questions=(old_question, new_question),
                scripts={"scripts/tools/new.py": b"new payload\n"},
            )
            bmad = project / "_bmad"
            write(
                bmad / "config.toml",
                '[modules.alpha]\nexisting = "keep"\nnumber = 7\n',
            )
            write(bmad / "config.user.toml", "# keep user\n")
            write(bmad / "custom" / "keep.txt", "keep custom\n")
            write(bmad / "alpha" / "keep.txt", "keep module\n")
            write(bmad / "alpha" / "scripts" / "obsolete.py", "obsolete\n")
            write(bmad / "scripts" / "stale.py", "stale\n")

            pending = run_setup_python(
                project, skill, "--doctor", "--list-config-questions"
            )
            self.assertEqual(pending.returncode, 0, msg=pending.stderr)
            self.assertEqual(
                [(item["module"], item["key"]) for item in json.loads(pending.stdout)],
                [("alpha", "new.answer")],
            )
            result = run_setup_python(
                project,
                skill,
                "--doctor",
                *module_answers_args(
                    project, {"alpha": {"new.answer": "chosen"}}
                ),
            )

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            report = json.loads(result.stdout)
            self.assertEqual(report["bmad_copy"]["skill"], "bmad")
            self.assertEqual(report["bmad_copy"]["version"], "3.0.0")
            self.assertEqual(report["version_spreads"], ["alpha"])
            self.assertFalse(report["current"])
            alpha = next(item for item in report["modules"] if item["module"] == "alpha")
            self.assertEqual(alpha["selected_copy"]["skill"], "alpha-new")
            self.assertEqual(alpha["scripts"], "repaired")
            config = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(config["modules"]["alpha"]["existing"], "keep")
            self.assertEqual(config["modules"]["alpha"]["number"], 7)
            self.assertEqual(config["modules"]["alpha"]["new"]["answer"], "chosen")
            self.assertEqual(
                (bmad / "alpha" / "scripts" / "tools" / "new.py").read_bytes(),
                b"new payload\n",
            )
            self.assertFalse((bmad / "alpha" / "scripts" / "obsolete.py").exists())
            self.assertFalse((bmad / "alpha" / "scripts" / "old.py").exists())
            self.assertEqual((bmad / "alpha" / "keep.txt").read_text(), "keep module\n")
            self.assertEqual((bmad / "custom" / "keep.txt").read_text(), "keep custom\n")
            self.assertEqual((bmad / "config.user.toml").read_text(), "# keep user\n")
            self.assertTrue(scripts_match(bmad / "scripts", skill / "scripts"))
            self.assertFalse((bmad / "scripts").is_symlink())
            self.assertEqual(list(project.glob("_bmad.doctor-*")), [])
            self.assertEqual(list(project.glob("_bmad.old-*")), [])

    def test_doctor_blocks_tied_disagreement_and_missing_runtime_is_actionable(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core", version="1.0.0")
            write_module_skill(
                root,
                "alpha-one",
                "alpha",
                version="2.0.0",
                scripts={"scripts/one.py": b"one\n"},
            )
            write_module_skill(
                root,
                "alpha-two",
                "alpha",
                version="2.0.0",
                scripts={"scripts/two.py": b"two\n"},
            )
            write_module_skill(
                root,
                "preview-one",
                "preview",
                version="3.0.0-dev.gone",
            )
            write_module_skill(
                root,
                "preview-two",
                "preview",
                version="3.0.0-dev.gtwo",
            )
            missing = run_setup_python(project, skill, "--doctor")
            self.assertEqual(missing.returncode, 0, msg=missing.stderr)
            missing_report = json.loads(missing.stdout)
            self.assertEqual(missing_report["status"], "setup-required")
            self.assertIn("bmad setup", missing_report["message"])
            self.assertFalse((project / "_bmad").exists())
            self.assertEqual(list(project.glob("_bmad.*-*")), [])

            bmad = project / "_bmad"
            shutil.copytree(skill / "scripts", bmad / "scripts")
            (bmad / "core" / "scripts").mkdir(parents=True)
            write(bmad / "config.toml", "[modules.alpha]\nkeep = 1\n")
            write(bmad / "alpha" / "scripts" / "keep.py", "keep\n")
            before = {
                path.relative_to(bmad): path.read_bytes()
                for path in bmad.rglob("*")
                if path.is_file()
            }
            result = run_setup_python(project, skill, "--doctor")

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            report = json.loads(result.stdout)
            alpha = next(item for item in report["modules"] if item["module"] == "alpha")
            preview = next(
                item for item in report["modules"] if item["module"] == "preview"
            )
            self.assertEqual(alpha["state"], "blocked")
            self.assertIn("disagree", alpha["reason"])
            self.assertEqual(alpha["scripts"], "unchanged")
            self.assertEqual(preview["state"], "blocked")
            self.assertIn("unordered", preview["reason"])
            self.assertEqual(report["remaining_staleness"], ["alpha", "preview"])
            self.assertFalse(report["current"])
            self.assertEqual(
                {
                    path.relative_to(bmad): path.read_bytes()
                    for path in bmad.rglob("*")
                    if path.is_file()
                },
                before,
            )

    def test_doctor_never_orders_unordered_copies_but_can_use_a_sole_copy(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core", version="1.0.0")
            write_module_skill(
                root,
                "solo-dev",
                "solo",
                version="2.0.0-dev.gabc",
                scripts={"scripts/solo.py": b"solo\n"},
            )
            write_module_skill(
                root,
                "mixed-release",
                "mixed",
                version="2.0.0",
                scripts={"scripts/release.py": b"release\n"},
            )
            write_module_skill(
                root,
                "mixed-dev",
                "mixed",
                version="3.0.0-dev.gabc",
                scripts={"scripts/dev.py": b"dev\n"},
            )

            modules, selections = setup.select_doctor_modules(skill)

            by_module = {item["module"]: item for item in selections}
            selected = {item.module: item for item in modules}
            self.assertEqual(by_module["solo"]["state"], "selected")
            self.assertEqual(by_module["solo"]["selected_copy"]["skill"], "solo-dev")
            self.assertIn("solo", selected)
            self.assertEqual(by_module["mixed"]["state"], "blocked")
            self.assertIn("unordered", by_module["mixed"]["reason"])
            self.assertNotIn("mixed", selected)

    def test_doctor_invalid_config_and_unreadable_selected_script_are_atomic(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core", version="1.0.0")
            module_skill = write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                scripts={"scripts/tool.py": b"tool\n"},
            )
            bmad = project / "_bmad"
            write(bmad / "config.toml", "invalid = [\n")
            write(bmad / "custom" / "keep.txt", "keep\n")
            before = (bmad / "custom" / "keep.txt").read_bytes()
            invalid = run_setup_python(project, skill, "--doctor")
            self.assertNotEqual(invalid.returncode, 0)
            self.assertIn(str(bmad / "config.toml"), invalid.stderr)
            self.assertEqual((bmad / "custom" / "keep.txt").read_bytes(), before)
            self.assertEqual(list(project.glob("_bmad.doctor-*")), [])

            write(bmad / "config.toml", "[modules.alpha]\nkeep = 1\n")
            declared = (module_skill / "scripts" / "tool.py").resolve()
            real_read_bytes = Path.read_bytes

            def fail_selected(path: Path) -> bytes:
                if path == declared:
                    raise OSError("selected script unreadable")
                return real_read_bytes(path)

            with mock.patch.object(Path, "read_bytes", fail_selected):
                with self.assertRaisesRegex(Exception, "selected script unreadable"):
                    setup.doctor(project, skill)
            self.assertEqual((bmad / "custom" / "keep.txt").read_bytes(), before)
            self.assertEqual(list(project.glob("_bmad.doctor-*")), [])

    def test_semver_ordering_is_numeric_and_dev_or_invalid_is_unordered(self):
        setup = load_setup()
        self.assertEqual(setup.compare_semver("1.10.0", "1.9.9"), 1)
        self.assertEqual(setup.compare_semver("1.0.0-alpha.2", "1.0.0-alpha.10"), -1)
        self.assertEqual(setup.compare_semver("1.0.0", "1.0.0+build.2"), 0)
        self.assertEqual(setup.compare_semver("1.0.0-rc.1", "1.0.0"), -1)
        self.assertEqual(setup.compare_semver("1.0.0-alpha.1", "1.0.0-alpha"), 1)
        self.assertIsNone(setup.compare_semver("1.0.0-dev.gabc", "1.0.0"))
        self.assertIsNone(setup.compare_semver("latest", "1.0.0"))

    def test_update_reports_current_installation_and_source_disagreement(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            for source_root in ("sources-a", "sources-b"):
                write_module_skill(
                    root, "bmad", "core", update_source=f"file:{source_root}"
                )
                write_module_skill(project / source_root, "bmad", "core")
            report = json.loads(
                self.run_update(project, skill),
            )
            self.assertTrue(report["current"])
            self.assertEqual(
                [module["state"] for module in report["modules"]], ["current"]
            )

            write_module_skill(
                root, "pair-a", "pair", update_source="file:sources-a"
            )
            write_module_skill(
                root, "pair-b", "pair", update_source="file:sources-b"
            )
            write_module_skill(project / "sources-a", "pair-a", "pair")
            write_module_skill(
                project / "sources-b", "pair-b", "pair", version="9.0.0"
            )

            report = json.loads(self.run_update(project, skill))
            self.assertFalse(report["current"])
            pair = next(
                module for module in report["modules"] if module["module"] == "pair"
            )
            self.assertEqual(pair["state"], "source-disagreement")
            self.assertFalse(pair["version_spread"])
            self.assertEqual(
                sorted(copy["state"] for copy in pair["copies"]),
                ["current", "newer-available"],
            )

    def test_update_reports_an_unusable_source_url_without_aborting_the_run(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(
                root, "bmad", "core", update_source="file:sources"
            )
            write_module_skill(project / "sources", "bmad", "core")
            write_module_skill(
                root, "broken-skill", "broken", update_source="https://[oops/tree"
            )

            report = json.loads(self.run_update(project, skill))
            self.assertFalse(report["current"])
            broken = next(
                module for module in report["modules"] if module["module"] == "broken"
            )
            self.assertEqual(broken["state"], "could-not-check")
            self.assertIn("https://[oops/tree", broken["copies"][0]["reason"])
            core = next(
                module for module in report["modules"] if module["module"] == "core"
            )
            self.assertEqual(core["state"], "current")

    def test_doctor_replaces_symlinked_legacy_shared_scripts(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core")
            legacy = root / "legacy-scripts"
            write(legacy / "resolve_config.py", "# legacy shared copy\n")
            bmad = project / "_bmad"
            write(bmad / "config.toml", "[core]\nkeep = true\n")
            (bmad / "scripts").symlink_to(legacy, target_is_directory=True)

            result = run_setup_python(project, skill, "--doctor")
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            report = json.loads(result.stdout)
            self.assertEqual(report["status"], "repaired")
            self.assertEqual(report["shared_scripts"], "repaired")
            scripts = bmad / "scripts"
            self.assertFalse(scripts.is_symlink())
            self.assertTrue(scripts.is_dir())
            self.assertTrue(scripts_match(scripts, skill / "scripts"))
            self.assertEqual(
                [path.name for path in sorted(legacy.rglob("*"))],
                ["resolve_config.py"],
            )
            self.assertEqual(
                (legacy / "resolve_config.py").read_text(encoding="utf-8"),
                "# legacy shared copy\n",
            )

            second = run_setup_python(project, skill, "--doctor")
            self.assertEqual(second.returncode, 0, msg=second.stderr)
            self.assertEqual(json.loads(second.stdout)["status"], "current")

    def test_first_doctor_after_setup_reports_current(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core")
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                scripts={"scripts/tool.py": b"payload\n"},
            )

            setup = run_setup_python(project, skill)
            self.assertEqual(setup.returncode, 0, msg=setup.stderr)
            bmad = project / "_bmad"
            self.assertTrue((bmad / "core" / "scripts").is_dir())
            self.assertTrue((bmad / "alpha" / "scripts" / "tool.py").is_file())

            doctor = run_setup_python(project, skill, "--doctor")
            self.assertEqual(doctor.returncode, 0, msg=doctor.stderr)
            report = json.loads(doctor.stdout)
            self.assertEqual(report["status"], "current")
            self.assertFalse(report["changed"])
            self.assertEqual(report["shared_scripts"], "current")
            self.assertEqual(report["legacy_leftovers"], [])
            for module in report["modules"]:
                if module["state"] == "selected":
                    self.assertEqual(module["scripts"], "current")

    def test_doctor_reports_legacy_leftovers_read_only(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core")
            bmad = project / "_bmad"
            write(bmad / "config.toml", "[core]\nkeep = true\n")
            write(bmad / "_config" / "manifest.yaml", "leftover: installer\n")
            write(bmad / "_config" / "bmad-help.csv", "old-catalog\n")
            write(bmad / "config.user.toml", "# old-user\n")
            write(bmad / "core" / "v6-shims" / "shim.md", "shim\n")

            result = run_setup_python(project, skill, "--doctor")
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            report = json.loads(result.stdout)
            self.assertEqual(
                report["legacy_leftovers"],
                [
                    "_config/manifest.yaml",
                    "_config/bmad-help.csv",
                    "config.user.toml",
                    "core/v6-shims",
                ],
            )
            self.assertEqual(
                (bmad / "_config" / "manifest.yaml").read_text(encoding="utf-8"),
                "leftover: installer\n",
            )
            self.assertEqual(
                (bmad / "_config" / "bmad-help.csv").read_text(encoding="utf-8"),
                "old-catalog\n",
            )
            self.assertEqual(
                (bmad / "config.user.toml").read_text(encoding="utf-8"),
                "# old-user\n",
            )
            self.assertEqual(
                (bmad / "core" / "v6-shims" / "shim.md").read_text(
                    encoding="utf-8"
                ),
                "shim\n",
            )

    def test_doctor_leaves_an_already_correct_runtime_untouched(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core")
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                scripts={"scripts/tool.py": b"payload\n"},
            )
            bmad = project / "_bmad"
            write(bmad / "config.toml", "[core]\nkeep = true\n")

            first = run_setup_python(project, skill, "--doctor")
            self.assertEqual(first.returncode, 0, msg=first.stderr)
            self.assertTrue(json.loads(first.stdout)["changed"])
            before = {
                path: path.read_bytes()
                for path in sorted(bmad.rglob("*"))
                if path.is_file()
            }

            second = run_setup_python(project, skill, "--doctor")
            self.assertEqual(second.returncode, 0, msg=second.stderr)
            report = json.loads(second.stdout)
            self.assertEqual(report["status"], "current")
            self.assertFalse(report["changed"])
            self.assertEqual(report["shared_scripts"], "current")
            self.assertEqual(report["answers_added"], [])
            self.assertTrue(report["current"])
            self.assertEqual(
                {
                    path: path.read_bytes()
                    for path in sorted(bmad.rglob("*"))
                    if path.is_file()
                },
                before,
            )

    def test_doctor_prefers_a_release_over_its_release_candidate(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core")
            write_module_skill(
                root,
                "mixed-rc",
                "mixed",
                version="2.0.0-rc.1",
                scripts={"scripts/tool.py": b"candidate\n"},
            )
            write_module_skill(
                root,
                "mixed-release",
                "mixed",
                version="2.0.0",
                scripts={"scripts/tool.py": b"release\n"},
            )
            write(project / "_bmad" / "config.toml", "[core]\nkeep = true\n")

            result = run_setup_python(project, skill, "--doctor")
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            report = json.loads(result.stdout)
            mixed = next(
                module for module in report["modules"] if module["module"] == "mixed"
            )
            self.assertEqual(mixed["selected_copy"]["skill"], "mixed-release")
            self.assertEqual(
                (project / "_bmad" / "mixed" / "scripts" / "tool.py").read_bytes(),
                b"release\n",
            )

    def test_doctor_question_listing_without_a_runtime_is_actionable(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core")

            result = run_setup_python(
                project, skill, "--doctor", "--list-config-questions"
            )
            self.assertEqual(result.returncode, 0, msg=result.stderr)
            report = json.loads(result.stdout)
            self.assertEqual(report["status"], "setup-required")
            self.assertIn("bmad setup", report["message"])
            self.assertFalse(report["changed"])
            self.assertFalse((project / "_bmad").exists())

    def test_mode_flags_reject_incompatible_combinations(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "bmad", "core")
            answers = module_answers_args(project, {"core": {"key": "value"}})

            for extra in (
                ("--update", "--doctor"),
                ("--update", "--list-config-questions"),
                ("--update", *answers),
                ("--list-config-questions", *answers),
            ):
                with self.subTest(extra=extra):
                    result = run_setup_python(project, skill, *extra)
                    self.assertEqual(result.returncode, 2, msg=result.stdout)
                    self.assertFalse((project / "_bmad").exists())

    def run_update(self, project: Path, skill: Path) -> str:
        result = run_setup_python(project, skill, "--update")
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        return result.stdout


if __name__ == "__main__":
    unittest.main()
