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
BMAD_SOURCE = "github:bmad-code-org/BMAD-METHOD/skills"
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
ARRAYS_OF_TABLES = ("config_questions", "knowledge")


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


def module_answers_args(project: Path, answers: dict[str, dict[str, str]]) -> list[str]:
    path = project / ".bmad-help-setup-modules.toml"
    lines: list[str] = []
    for module, values in answers.items():
        lines.append(f"[modules.{json.dumps(module, ensure_ascii=False)}]")
        lines.extend(
            f"{json.dumps(key, ensure_ascii=False)} = {json.dumps(value, ensure_ascii=False)}"
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
    if isinstance(value, list):
        return "[" + ", ".join(toml_inline(item) for item in value) + "]"
    if isinstance(value, dict):
        return "{" + ", ".join(f"{key} = {toml_inline(item)}" for key, item in value.items()) + "}"
    raise TypeError(f"unsupported TOML fixture value: {value!r}")


def dump_table(name: str, data: dict[str, object]) -> list[str]:
    lines = [f"[{name}]"]
    arrays = {key: value for key, value in data.items() if key in ARRAYS_OF_TABLES and isinstance(value, list)}
    lines.extend(f"{key} = {toml_inline(value)}" for key, value in data.items() if key not in arrays)
    for key, items in arrays.items():
        for item in items:
            lines.append("")
            lines.append(f"[[{name}.{key}]]")
            lines.extend(f"{nested_key} = {toml_inline(nested_value)}" for nested_key, nested_value in item.items())
    return lines


def dump_bmod_toml(*, bmod: dict[str, object] | None = None, skill: dict[str, object] | None = None) -> str:
    lines: list[str] = []
    for name, data in (("bmod", bmod), ("skill", skill)):
        if data is None:
            continue
        if lines:
            lines.append("")
        lines.extend(dump_table(name, data))
    return "\n".join(lines) + "\n"


def write_bmod(
    root: Path,
    folder: str,
    code: str,
    *,
    skills: tuple[str, ...] | None = (),
    questions: tuple[dict[str, str], ...] = (),
    update_source: str = "file:skills",
    version: str = "1.2.3",
    extra_fields: dict[str, object] | None = None,
    skill: dict[str, object] | None = None,
) -> Path:
    """A module record. `skills=None` leaves the key out; `skill` adds a [skill] table to the same file."""
    record: dict[str, object] = {"code": code, "version": version, "update_source": update_source}
    if skills is not None:
        record["skills"] = list(skills)
    if questions:
        record["config_questions"] = list(questions)
    if extra_fields:
        record.update(extra_fields)
    write(root / folder / "bmod.toml", dump_bmod_toml(bmod=record, skill=skill))
    return root / folder


def write_skill(
    root: Path,
    folder: str,
    bmod: str,
    *,
    source: str = "file:skills",
    scripts: dict[str, bytes] | None = None,
    script_entries: tuple[str, ...] | None = None,
    extra_fields: dict[str, object] | None = None,
) -> Path:
    skill = root / folder
    scripts = scripts or {}
    table: dict[str, object] = {"bmod": bmod, "source": source}
    entries = tuple(scripts) if script_entries is None else script_entries
    if entries:
        table["scripts"] = list(entries)
    if extra_fields:
        table.update(extra_fields)
    write(skill / "SKILL.md", f"---\nname: {folder}\n---\n")
    write(skill / "bmod.toml", dump_bmod_toml(skill=table))
    for relative, content in scripts.items():
        path = skill / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
    return skill


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
    skill_fields: dict[str, object] | None = None,
    bmod_folder: str | None = None,
) -> Path:
    """A module with one skill: the record in `bmod-<module>` and the skill beside it."""
    folder = bmod_folder or f"bmod-{module}"
    write_bmod(
        root,
        folder,
        module,
        skills=(skill_id,),
        questions=questions,
        update_source=update_source,
        version=version,
        extra_fields=extra_fields,
    )
    return write_skill(
        root,
        skill_id,
        folder,
        source=update_source,
        scripts=scripts,
        script_entries=script_entries,
        extra_fields=skill_fields,
    )


def write_core(root: Path, *, version: str = "1.2.3", update_source: str = "file:skills") -> None:
    """Give the bmad fixture its own bmod.toml and its module record."""
    write_bmod(root, "bmod-core-tools", "core-tools", skills=("bmad",), version=version, update_source=update_source)
    write(root / "bmad" / "bmod.toml", dump_bmod_toml(skill={"bmod": "bmod-core-tools", "source": update_source}))


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
        capture_output=True,
        check=False,
    )


def run_setup_python(project: Path, skill: Path, *extra: str) -> subprocess.CompletedProcess[str]:
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
        capture_output=True,
        check=False,
    )


def snapshot(root: Path) -> dict[Path, bytes | None]:
    """Every file with its bytes and every directory, so any write under root shows."""
    return {
        path.relative_to(root): path.read_bytes() if path.is_file() and not path.is_symlink() else None
        for path in root.rglob("*")
    }


def user_toml_files(root: Path) -> list[Path]:
    return sorted(root.rglob("*.user.toml"))


def scripts_match(dest: Path, src: Path) -> bool:
    dest_items = list(dest.iterdir())
    dest_files = {p.name: p.read_bytes() for p in dest_items if p.is_file() and not p.is_symlink()}
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
                capture_output=True,
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
                capture_output=True,
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
                capture_output=True,
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
                code = setup.main(["--project-root", str(project), "--skill", str(skill)])
            self.assertEqual(code, 0)
            symlink.assert_not_called()
            self._assert_scripts_identity(project / "_bmad" / "scripts", skill / "scripts")

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
            self.assertEqual(
                (bmad / "core" / "config.yaml").read_text(encoding="utf-8"),
                "old: core\n",
            )
            self.assertEqual(
                (bmad / "bmm" / "config.yaml").read_text(encoding="utf-8"),
                "old: bmm\n",
            )
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

            parsed = tomllib.loads((project / "_bmad" / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(parsed["core"]["project_name"], "proj")
            self._assert_team_tables_match_template(parsed, skill, "proj")
            scripts = project / "_bmad" / "scripts"
            self._assert_scripts_identity(scripts, skill / "scripts")
            self.assertFalse((project / "_bmad" / "core" / "config.yaml").exists())
            self.assertFalse((project / "_bmad" / "bmm" / "config.yaml").exists())
            self.assertTrue((project / "_bmad" / "custom").is_dir())
            self.assertFalse((project / "_bmad" / "_config" / "bmad-help.csv").exists())
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
            self.assertEqual(legacy_catalog.read_text(encoding="utf-8"), "old-catalog\n")

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
            write(bmad / "custom" / "keep.txt", "custom-keep\n")
            write(bmad / "config.user.toml", "# keep-user\n")
            write(bmad / "custom" / "extra.user.toml", "# extra-user\n")

            write(
                skill / "assets" / "config.template.toml",
                MINIMAL_CONFIG.replace(
                    'output_folder = "{project-root}/_bmad-output"\n',
                    'output_folder = "{project-root}/_bmad-output"\nreview_language = "English"\n',
                ),
            )
            second = run_setup(project, skill)
            self.assertEqual(second.returncode, 0, msg=second.stderr)

            parsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(parsed["core"]["project_name"], "Renamed")
            self.assertEqual(parsed["core"]["review_language"], "English")
            self._assert_team_tables_match_template(parsed, skill, "proj")
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
            os.symlink(elsewhere, bmad / "scripts", target_is_directory=True)

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

            with mock.patch("os.symlink", side_effect=OSError("operation not permitted")) as symlink:
                code = setup.main(["--project-root", str(project), "--skill", str(skill)])

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
            self.assertNotEqual(preserved_mtime, source_marker.stat().st_mtime_ns)

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
            os.symlink(skill / "scripts", scripts, target_is_directory=True)

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

    def test_lists_ordered_missing_questions_without_writing(self):
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
            before = {path.relative_to(project): path.read_bytes() for path in project.rglob("*") if path.is_file()}

            result = run_setup(project, skill, "--list-config-questions")

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            questions = json.loads(result.stdout)
            self.assertEqual(
                [(item["module"], item["key"], item["prompt"]) for item in questions],
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
                {path.relative_to(project): path.read_bytes() for path in project.rglob("*") if path.is_file()},
                before,
            )
            self.assertFalse((project / "_bmad-output").exists())
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_answers_and_nested_scripts_are_installed_and_refreshed(self):
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
            original_values = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))["modules"]["alpha"]
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
            parsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
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
            self.assertIsInstance(parsed["modules"]["alpha"]["release_date"], datetime.date)
            self.assertIsInstance(parsed["modules"]["alpha"]["release_time"], datetime.time)
            self.assertIsInstance(
                parsed["modules"]["alpha"]["release_datetime"],
                datetime.datetime,
            )
            self.assertEqual(parsed["modules"]["alpha"]["nested"]["answer"], "chosen")
            self.assertEqual(parsed["modules"]["alpha"]["escaped"], escaped)
            installed = bmad / "alpha" / "scripts" / "tools" / "check.py"
            self.assertEqual(
                installed.read_bytes(),
                (module_skill / script_path).read_bytes(),
            )
            self.assertFalse((bmad / "scripts" / "tools" / "check.py").exists())
            self.assertEqual((bmad / "custom" / "keep.txt").read_text(), "custom\n")
            self.assertEqual((bmad / "config.user.toml").read_text(), "# user\n")

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
                *module_answers_args(project, {"alpha": {"new_key": "new answer"}}),
            )
            self.assertEqual(second.returncode, 0, msg=second.stderr)
            reparsed = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(reparsed["modules"]["alpha"]["existing"], 42)
            self.assertEqual(reparsed["modules"]["alpha"]["escaped"], escaped)
            for key in (
                "naïve",
                "release_date",
                "release_time",
                "release_datetime",
            ):
                self.assertEqual(reparsed["modules"]["alpha"][key], original_values[key])
                self.assertIs(
                    type(reparsed["modules"]["alpha"][key]),
                    type(original_values[key]),
                )
            self.assertEqual(reparsed["modules"]["alpha"]["new_key"], "new answer")
            self.assertEqual(installed.read_bytes(), b"# refreshed\n")

    def test_unknown_fields_are_ignored_by_runtime_setup(self):
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
                skill_fields={"future_skill_feature": ["anything"]},
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
                *module_answers_args(project, {"alpha": {"answer": "accepted"}}),
            )

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            parsed = tomllib.loads((project / "_bmad" / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(parsed["modules"]["alpha"]["answer"], "accepted")

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
            self.assertEqual((bmad / "alpha" / relative).read_bytes(), b"# alpha\n")
            self.assertEqual((bmad / "beta" / relative).read_bytes(), b"# beta\n")
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
                tomllib.loads(config.read_text(encoding="utf-8"))["modules"]["alpha"]["output"],
                "keep",
            )
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_two_skills_of_one_module_share_a_script_tree_and_a_clash_is_atomic(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            write_bmod(root, "bmod-alpha", "alpha", skills=("alpha-one", "alpha-two"))
            write_skill(root, "alpha-one", "bmod-alpha", scripts={"scripts/shared.py": b"# same\n"})
            write_skill(
                root,
                "alpha-two",
                "bmod-alpha",
                scripts={"scripts/shared.py": b"# same\n", "scripts/two.py": b"# two\n"},
            )

            result = run_setup(project, skill)

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            placed = project / "_bmad" / "alpha" / "scripts"
            self.assertEqual(sorted(path.name for path in placed.iterdir()), ["shared.py", "two.py"])
            self.assertEqual((placed / "shared.py").read_bytes(), b"# same\n")

            write(project / "_bmad" / "custom" / "keep.txt", "keep\n")
            before = snapshot(project / "_bmad")
            (root / "alpha-two" / "scripts" / "shared.py").write_bytes(b"# different\n")

            clash = run_setup(project, skill)

            self.assertNotEqual(clash.returncode, 0)
            self.assertIn("two different scripts", clash.stderr)
            self.assertIn(str(root / "alpha-one" / "bmod.toml"), clash.stderr)
            self.assertIn(str(root / "alpha-two" / "bmod.toml"), clash.stderr)
            self.assertEqual(snapshot(project / "_bmad"), before)
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

            invalid = run_setup(project, skill, "--module-answers", str(answer_path))

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

    def test_an_unusable_bmod_file_is_a_problem_and_the_rest_of_the_install_carries_on(self):
        bodies = {
            "no-table": "x = 1\n",
            "not-toml": "[bmod\n",
            "bad-question": '[bmod]\nversion = "1.2.3"\ncode = "alpha"\nupdate_source = "file:skills"\n'
            'config_questions = "invalid"\n',
            "no-source": '[skill]\nbmod = "bmod-good"\nsource = "file:skills"\nrequired_skills = [{ skill = "x" }]\n',
        }
        for name, body in bodies.items():
            with self.subTest(name=name), tempfile.TemporaryDirectory() as temp_dir:
                root = Path(temp_dir)
                project = root / "proj"
                skill = write_dest_bmad(root)
                project.mkdir()
                write_module_skill(
                    root, "good-skill", "good", update_source="plugin:good", scripts={"scripts/tool.py": b"# tool\n"}
                )
                broken = root / "broken-folder" / "bmod.toml"
                write(broken, body)

                for extra in (("--status",), ()):
                    result = run_setup_python(project, skill, *extra)
                    self.assertEqual(result.returncode, 0, msg=result.stderr)
                    report = json.loads(result.stdout)
                    (problem,) = report["problems"]
                    self.assertEqual((problem["kind"], problem["folder"]), ("bmod-file", "broken-folder"))
                    self.assertIn(str(broken), problem["message"])
                    self.assertEqual([item["module"] for item in report["modules"]], ["good"])
                    self.assertFalse(report["current"])
                listed = run_setup_python(project, skill, "--list-config-questions")
                self.assertEqual(listed.returncode, 0, msg=listed.stderr)
                self.assertTrue((project / "_bmad" / "good" / "scripts" / "tool.py").is_file())

    def test_the_bmad_skills_own_unusable_file_leaves_its_version_unknown(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            write(skill / "bmod.toml", "x = 1\n")

            report = json.loads(run_setup_python(project, skill).stdout)

            self.assertIsNone(report["bmad"]["version"])
            self.assertEqual([item["folder"] for item in report["problems"]], ["bmad"])
            self.assertEqual(report["status"], "created")

    def test_bmod_file_validation_rejects_recognized_bad_shapes(self):
        setup = load_setup()
        base = {"version": "1.2.3", "code": "alpha", "update_source": "file:skills"}
        skill_base = {"bmod": "bmod-alpha", "source": "file:skills"}
        question = {"key": "output", "prompt": "One", "default": "1"}
        cases: tuple[tuple[str, bytes, str], ...] = (
            ("malformed-toml", b"[bmod]\nversion = [\n", "TOML"),
            (
                "duplicate-toml-key",
                b'[bmod]\nversion = "1.2.3"\ncode = "alpha"\ncode = "beta"\nupdate_source = "file:skills"\n',
                "overwrite",
            ),
            ("neither-table", b'code = "alpha"\nversion = "1.2.3"\n', "[bmod]"),
            ("bmod-not-a-table", b'bmod = "alpha"\n', "must be a table"),
            (
                "missing-version",
                dump_bmod_toml(bmod={"code": "alpha", "update_source": "file:skills"}).encode(),
                "bmod.version",
            ),
            ("missing-skill-bmod", dump_bmod_toml(skill={"source": "file:skills"}).encode(), "skill.bmod"),
            ("missing-skill-source", dump_bmod_toml(skill={"bmod": "bmod-alpha"}).encode(), "skill.source"),
            ("unsafe-skill-bmod", dump_bmod_toml(skill={**skill_base, "bmod": "../escape"}).encode(), "unsafe"),
            (
                "duplicate-question",
                dump_bmod_toml(bmod={**base, "config_questions": [question, {**question, "prompt": "Two"}]}).encode(),
                "conflicts",
            ),
            (
                "question-prefix-collision",
                dump_bmod_toml(
                    bmod={**base, "config_questions": [question, {**question, "key": "output.directory"}]}
                ).encode(),
                "conflicts",
            ),
            (
                "question-unknown-key",
                dump_bmod_toml(bmod={**base, "config_questions": [{**question, "hint": "no"}]}).encode(),
                "unknown key 'hint'",
            ),
            (
                "question-missing-key",
                dump_bmod_toml(bmod={**base, "config_questions": [{"key": "output", "prompt": "One"}]}).encode(),
                "missing key 'default'",
            ),
            *tuple(
                (
                    f"unsafe-script-{index}",
                    dump_bmod_toml(skill={**skill_base, "scripts": [entry]}).encode(),
                    repr(entry),
                )
                for index, entry in enumerate(("scripts", "scripts/", "scripts/../tool.py", "other/tool.py"))
            ),
            ("unsafe-module", dump_bmod_toml(bmod={**base, "code": "../escape"}).encode(), "unsafe"),
            ("case-insensitive-reserved-module", dump_bmod_toml(bmod={**base, "code": "ScRiPtS"}).encode(), "unsafe"),
            ("unsafe-member", dump_bmod_toml(bmod={**base, "skills": ["../escape"]}).encode(), "unsafe"),
            ("repeated-member", dump_bmod_toml(bmod={**base, "skills": ["one", "one"]}).encode(), "repeats"),
            (
                "requirement-without-source",
                dump_bmod_toml(bmod={**base, "required_skills": [{"skill": "other"}]}).encode(),
                "required_skills[0].source",
            ),
            (
                "requirement-without-skill",
                dump_bmod_toml(skill={**skill_base, "required_skills": [{"source": "file:skills"}]}).encode(),
                "required_skills[0].skill",
            ),
            (
                "requirement-unorderable-version",
                dump_bmod_toml(
                    bmod={**base, "required_skills": [{"skill": "bmad", "source": "file:skills", "version": "6.13"}]}
                ).encode(),
                "required_skills[0].version",
            ),
            (
                "requirement-unsafe-name",
                dump_bmod_toml(skill={**skill_base, "recommended_skills": ["../other"]}).encode(),
                "unsafe",
            ),
            (
                "requirement-wrong-type",
                dump_bmod_toml(bmod={**base, "required_skills": [7]}).encode(),
                "skill name or a table",
            ),
        )

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            for name, raw, diagnostic in cases:
                path = root / name / "bmod.toml"
                with self.subTest(name=name), self.assertRaises(Exception) as caught:
                    setup.parse_bmod_file(path, raw)
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
            write_module_skill(root, "upper-skill", "Alpha", bmod_folder="bmod-upper")
            write_module_skill(root, "lower-skill", "alpha", bmod_folder="bmod-lower")
            before = {path.relative_to(bmad): path.read_bytes() for path in bmad.rglob("*") if path.is_file()}

            result = run_setup(project, skill)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("differ only by case", result.stderr)
            self.assertIn(str(root / "bmod-upper" / "bmod.toml"), result.stderr)
            self.assertIn(str(root / "bmod-lower" / "bmod.toml"), result.stderr)
            self.assertEqual(
                {path.relative_to(bmad): path.read_bytes() for path in bmad.rglob("*") if path.is_file()},
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
            self.assertIn(str(module_skill / "bmod.toml"), result.stderr)
            self.assertIn("scripts/link.py", result.stderr)
            self.assertFalse((project / "_bmad").exists())
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_symlinked_bmad_is_rejected_before_any_write(self):
        if not symlink_to_temp_dir_succeeds():
            self.skipTest("symlinks not available")
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            project.mkdir()
            skill = write_dest_bmad(root)
            real = root / "real-install" / "_bmad"
            write(real / "config.toml", "[core]\nkeep = 1\n")
            os.symlink(real, project / "_bmad", target_is_directory=True)
            before = {path.relative_to(real): path.read_bytes() for path in real.rglob("*") if path.is_file()}

            for extra in ((), ("--status",), ("--list-config-questions",)):
                with self.subTest(extra=extra):
                    result = run_setup_python(project, skill, *extra)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn("symlink", result.stderr)
                    self.assertIn(str(real.resolve().parent), result.stderr)

            self.assertTrue((project / "_bmad").is_symlink())
            self.assertEqual(
                {path.relative_to(real): path.read_bytes() for path in real.rglob("*") if path.is_file()},
                before,
            )
            self.assertEqual(list(project.glob("_bmad.*-*")), [])

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
            manifest = module_skill / "bmod.toml"
            before = {path.relative_to(bmad): path.read_bytes() for path in bmad.rglob("*") if path.is_file()}
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
                {path.relative_to(bmad): path.read_bytes() for path in bmad.rglob("*") if path.is_file()},
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
                '[modules.alpha]\n"nested.answer" = "literal"\n[modules.alpha.nested]\nanswer = "table"\n',
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
                            '[modules.alpha]\nfirst = "one"\nsecond = "two"\nextra = "three"\n',
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

    def test_unparseable_team_toml_is_hard_error_and_tree_is_unchanged(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "proj"
            skill = write_dest_bmad(root)
            project.mkdir()
            bmad = project / "_bmad"
            write(bmad / "config.toml", "[broken\n")
            write(bmad / "core" / "config.yaml", ":::not-yaml\n")
            write(bmad / "bmm" / "config.yaml", "- nested:\n  - list\n")
            before = {path.relative_to(bmad): path.read_bytes() for path in bmad.rglob("*") if path.is_file()}

            result = run_setup(project, skill)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(bmad / "config.toml"), result.stderr)
            self.assertIn("cannot parse TOML", result.stderr)
            self.assertEqual(
                {path.relative_to(bmad): path.read_bytes() for path in bmad.rglob("*") if path.is_file()},
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
            self.assertEqual([item.name for item in custom.iterdir()], [".gitignore"])

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
            before_files = {path.relative_to(bmad): path.read_bytes() for path in bmad.rglob("*") if path.is_file()}
            before_dirs = {path.relative_to(bmad) for path in bmad.rglob("*") if path.is_dir()}
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

            with mock.patch.object(setup.shutil, "copy2", side_effect=fail_second_script_copy):
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
                {path.relative_to(bmad): path.read_bytes() for path in bmad.rglob("*") if path.is_file()},
                before_files,
            )
            self.assertEqual(
                {path.relative_to(bmad) for path in bmad.rglob("*") if path.is_dir()},
                before_dirs,
            )
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def _assert_scripts_identity(self, dest: Path, src: Path) -> None:
        self.assertFalse(dest.is_symlink())
        self.assertTrue(dest.is_dir())
        self.assertTrue(scripts_match(dest, src))

    def _assert_team_tables_match_template(self, parsed: dict, skill: Path, project_name: str) -> None:
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
        self.assertEqual(parsed["modules"]["bmm"]["project_knowledge"], "{project-root}/docs")
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

        self.assertFalse((bmad / "core" / "config.yaml").exists())
        self.assertFalse((bmad / "bmm" / "config.yaml").exists())

        custom = bmad / "custom"
        self.assertTrue(custom.is_dir())
        self.assertEqual([item.name for item in custom.iterdir()], [".gitignore"])
        self.assertEqual(user_toml_files(bmad), [])

        self.assertFalse((bmad / "_config" / "bmad-help.csv").exists())

        self.assertTrue((project / "_bmad-output").is_dir())


def setup_report(test: unittest.TestCase, project: Path, skill: Path, *extra: str) -> dict:
    result = run_setup_python(project, skill, *extra)
    test.assertEqual(result.returncode, 0, msg=result.stderr)
    return json.loads(result.stdout)


def status_report(test: unittest.TestCase, project: Path, skill: Path, *extra: str) -> dict:
    return setup_report(test, project, skill, "--status", *extra)


class BmadSetupRepairTests(unittest.TestCase):
    def test_setup_adds_only_missing_answers_and_exactly_repairs(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root, version="3.0.0")
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                version="2.0.0",
                questions=(
                    {"key": "existing", "prompt": "Existing value", "default": "old"},
                    {"key": "new.answer", "prompt": "New value", "default": "new default"},
                ),
                scripts={"scripts/tools/new.py": b"new payload\n"},
            )
            bmad = project / "_bmad"
            write(bmad / "config.toml", '[modules.alpha]\nexisting = "keep"\nnumber = 7\n')
            write(bmad / "config.user.toml", "# keep user\n")
            write(bmad / "custom" / "keep.txt", "keep custom\n")
            write(bmad / "alpha" / "keep.txt", "keep module\n")
            write(bmad / "alpha" / "scripts" / "obsolete.py", "obsolete\n")
            write(bmad / "scripts" / "stale.py", "stale\n")

            pending = run_setup_python(project, skill, "--list-config-questions")
            self.assertEqual(pending.returncode, 0, msg=pending.stderr)
            self.assertEqual(
                [(item["module"], item["key"]) for item in json.loads(pending.stdout)],
                [("alpha", "new.answer")],
            )
            report = setup_report(
                self,
                project,
                skill,
                *module_answers_args(project, {"alpha": {"new.answer": "chosen"}}),
            )

            self.assertEqual(report["mode"], "setup")
            self.assertEqual(report["status"], "repaired")
            self.assertTrue(report["changed"])
            self.assertEqual(report["bmad"], {"skill": "bmad", "version": "3.0.0", "module": "core-tools"})
            self.assertEqual(report["shared_scripts"], "repaired")
            self.assertEqual(report["config"], "updated")
            self.assertEqual(
                report["answers_added"],
                [{"module": "alpha", "key": "new.answer", "scope": "team", "file": "_bmad/config.toml"}],
            )
            self.assertEqual(
                report["answers"]["alpha"],
                [
                    {"key": "existing", "scope": "team", "file": "_bmad/config.toml", "value": "keep"},
                    {"key": "new.answer", "scope": "team", "file": "_bmad/config.toml", "value": "chosen"},
                ],
            )
            alpha = next(item for item in report["modules"] if item["module"] == "alpha")
            self.assertEqual(alpha["folder"], "bmod-alpha")
            self.assertEqual(alpha["version"], "2.0.0")
            self.assertEqual(alpha["skills"], ["alpha-skill"])
            self.assertEqual(alpha["scripts"], "repaired")
            core = next(item for item in report["modules"] if item["module"] == "core-tools")
            self.assertEqual(core["scripts"], "created")
            config = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(config["modules"]["alpha"]["existing"], "keep")
            self.assertEqual(config["modules"]["alpha"]["number"], 7)
            self.assertEqual(config["modules"]["alpha"]["new"]["answer"], "chosen")
            self.assertEqual((bmad / "alpha" / "scripts" / "tools" / "new.py").read_bytes(), b"new payload\n")
            self.assertFalse((bmad / "alpha" / "scripts" / "obsolete.py").exists())
            self.assertEqual((bmad / "alpha" / "keep.txt").read_text(), "keep module\n")
            self.assertEqual((bmad / "custom" / "keep.txt").read_text(), "keep custom\n")
            self.assertEqual((bmad / "config.user.toml").read_text(), "# keep user\n")
            self.assertTrue(scripts_match(bmad / "scripts", skill / "scripts"))
            self.assertFalse((bmad / "scripts").is_symlink())
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])
            self.assertEqual(list(project.glob("_bmad.old-*")), [])

    def test_first_setup_reports_created_and_the_second_changes_nothing(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root)
            write_module_skill(root, "alpha-skill", "alpha", scripts={"scripts/tool.py": b"payload\n"})

            first = setup_report(self, project, skill)
            self.assertEqual(first["status"], "created")
            self.assertTrue(first["changed"])
            self.assertEqual(first["shared_scripts"], "created")
            self.assertEqual(first["config"], "created")
            self.assertEqual(first["custom_gitignore"], "created")
            bmad = project / "_bmad"
            self.assertTrue((bmad / "core-tools" / "scripts").is_dir())
            self.assertTrue((bmad / "alpha" / "scripts" / "tool.py").is_file())
            before = snapshot(project)
            inode = bmad.stat().st_ino

            second = setup_report(self, project, skill)

            self.assertEqual(second["status"], "current")
            self.assertFalse(second["changed"])
            self.assertEqual(second["shared_scripts"], "current")
            self.assertEqual(second["config"], "current")
            self.assertEqual(second["custom_gitignore"], "current")
            self.assertEqual(second["answers_added"], [])
            self.assertEqual(second["legacy_leftovers"], [])
            self.assertEqual({module["scripts"] for module in second["modules"]}, {"current"})
            self.assertTrue(second["current"])
            self.assertIsNone(second["next"])
            self.assertEqual(snapshot(project), before)
            self.assertEqual(bmad.stat().st_ino, inode)

    def test_setup_invalid_config_and_unreadable_script_are_atomic(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root)
            module_skill = write_module_skill(root, "alpha-skill", "alpha", scripts={"scripts/tool.py": b"tool\n"})
            bmad = project / "_bmad"
            write(bmad / "config.toml", "invalid = [\n")
            write(bmad / "custom" / "keep.txt", "keep\n")
            before = (bmad / "custom" / "keep.txt").read_bytes()
            invalid = run_setup_python(project, skill)
            self.assertNotEqual(invalid.returncode, 0)
            self.assertIn(str(bmad / "config.toml"), invalid.stderr)
            self.assertEqual((bmad / "custom" / "keep.txt").read_bytes(), before)
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

            write(bmad / "config.toml", "[modules.alpha]\nkeep = 1\n")
            declared = (module_skill / "scripts" / "tool.py").resolve()
            real_read_bytes = Path.read_bytes

            def fail_selected(path: Path) -> bytes:
                if path == declared:
                    raise OSError("selected script unreadable")
                return real_read_bytes(path)

            with mock.patch.object(Path, "read_bytes", fail_selected):
                with self.assertRaisesRegex(Exception, "selected script unreadable"):
                    setup.setup(project, skill)
            self.assertEqual((bmad / "custom" / "keep.txt").read_bytes(), before)
            self.assertEqual(list(project.glob("_bmad.setup-*")), [])

    def test_setup_refuses_a_module_runtime_that_is_not_a_plain_directory(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "alpha-skill", "alpha")
            bmad = project / "_bmad"
            write(bmad / "config.toml", "[core]\nkeep = true\n")
            write(bmad / "alpha", "a file where the module folder belongs\n")
            before = snapshot(project)

            result = run_setup_python(project, skill)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(bmad / "alpha"), result.stderr)
            self.assertEqual(snapshot(project), before)

    def test_setup_replaces_symlinked_legacy_shared_scripts(self):
        if not symlink_to_temp_dir_succeeds():
            self.skipTest("symlinks not available")
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root)
            legacy = root / "legacy-scripts"
            write(legacy / "resolve_config.py", "# legacy shared copy\n")
            bmad = project / "_bmad"
            write(bmad / "config.toml", "[core]\nkeep = true\n")
            (bmad / "scripts").symlink_to(legacy, target_is_directory=True)

            report = setup_report(self, project, skill)
            self.assertEqual(report["status"], "repaired")
            self.assertEqual(report["shared_scripts"], "repaired")
            scripts = bmad / "scripts"
            self.assertFalse(scripts.is_symlink())
            self.assertTrue(scripts.is_dir())
            self.assertTrue(scripts_match(scripts, skill / "scripts"))
            self.assertEqual([path.name for path in sorted(legacy.rglob("*"))], ["resolve_config.py"])
            self.assertEqual((legacy / "resolve_config.py").read_text(encoding="utf-8"), "# legacy shared copy\n")

            self.assertEqual(setup_report(self, project, skill)["status"], "current")

    def test_legacy_leftovers_are_reported_and_left_alone(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root)
            bmad = project / "_bmad"
            leftovers = {
                "_config/manifest.yaml": "leftover: installer\n",
                "_config/bmad-help.csv": "old-catalog\n",
                "config.user.toml": "# old-user\n",
                "core/config.yaml": "project_name: proj\n",
                "bmm/config.yaml": "project_name: proj\n",
                "core/v6-shims/shim.md": "shim\n",
            }
            write(bmad / "config.toml", "[core]\nkeep = true\n")
            for relative, content in leftovers.items():
                write(bmad / relative, content)
            expected = [
                "_config/manifest.yaml",
                "_config/bmad-help.csv",
                "config.user.toml",
                "core/config.yaml",
                "bmm/config.yaml",
                "core/v6-shims",
            ]

            self.assertEqual(status_report(self, project, skill)["legacy_leftovers"], expected)
            self.assertEqual(setup_report(self, project, skill)["legacy_leftovers"], expected)
            for relative, content in leftovers.items():
                self.assertEqual((bmad / relative).read_text(encoding="utf-8"), content)

    def test_a_missing_recommended_skill_is_listed_without_calling_it_a_fault(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root, version="6.13.0")
            write_module_skill(root, "alpha-skill", "alpha", skill_fields={"recommended_skills": ["absent-skill"]})

            report = setup_report(self, project, skill)
            self.assertTrue(report["current"])
            self.assertEqual(report["unmet_requirements"], [])
            (entry,) = report["unmet_recommendations"]
            self.assertEqual(
                (entry["skill"], entry["requires"], entry["state"]), ("alpha-skill", "absent-skill", "missing")
            )

    def test_a_missing_required_skill_is_reported_with_its_install_command(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root, version="6.13.0")
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                skill_fields={
                    "required_skills": [
                        {"skill": "absent-skill", "version": "1.0.0", "source": "github:acme/other-repo/skills"}
                    ]
                },
            )

            report = setup_report(self, project, skill)
            self.assertFalse(report["current"])
            self.assertEqual(
                report["unmet_requirements"],
                [
                    {
                        "skill": "alpha-skill",
                        "module": "alpha",
                        "requires": "absent-skill",
                        "minimum": "1.0.0",
                        "installed": None,
                        "state": "missing",
                        "source": "github:acme/other-repo/skills",
                        "channel": "skills-cli",
                        "install": "npx skills add acme/other-repo --skill absent-skill",
                    }
                ],
            )
            self.assertEqual(report["next"], "npx skills add acme/other-repo --skill absent-skill")

    def test_a_plain_requirement_takes_the_source_of_the_file_that_declares_it(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root)
            write_bmod(
                root,
                "bmod-alpha",
                "alpha",
                skills=("alpha-skill",),
                update_source="plugin:alpha-plugin",
                extra_fields={"required_skills": ["module-need"]},
            )
            write_skill(
                root,
                "alpha-skill",
                "bmod-alpha",
                source="github:acme/alpha/skills",
                extra_fields={"required_skills": ["skill-need"]},
            )

            unmet = {entry["requires"]: entry for entry in setup_report(self, project, skill)["unmet_requirements"]}
            self.assertEqual(unmet["module-need"]["skill"], "bmod-alpha")
            self.assertEqual(unmet["module-need"]["source"], "plugin:alpha-plugin")
            self.assertEqual(unmet["module-need"]["channel"], "plugin")
            self.assertIsNone(unmet["module-need"]["install"])
            self.assertEqual(unmet["skill-need"]["skill"], "alpha-skill")
            self.assertEqual(unmet["skill-need"]["source"], "github:acme/alpha/skills")
            self.assertEqual(unmet["skill-need"]["install"], "npx skills add acme/alpha --skill skill-need")

    def test_a_requirement_that_names_the_declaring_skill_is_skipped(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "alpha-skill", "alpha", skill_fields={"required_skills": ["alpha-skill"]})

            self.assertEqual(setup_report(self, project, skill)["unmet_requirements"], [])


class BmadRequirementVersionTests(unittest.TestCase):
    def fixture(self, root: Path, *, core_version: str, record: bool = True) -> tuple[Path, Path]:
        project = root / "project"
        project.mkdir()
        skill = write_dest_bmad(root)
        write_core(root, version=core_version)
        if not record:
            shutil.rmtree(root / "bmod-core-tools")
        write_bmod(
            root,
            "bmod-alpha",
            "alpha",
            skills=("alpha-skill",),
            extra_fields={"required_skills": [{"skill": "bmad", "version": "6.13.0", "source": BMAD_SOURCE}]},
        )
        write_skill(root, "alpha-skill", "bmod-alpha")
        return project, skill

    def test_a_version_is_checked_through_the_named_skills_module(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir), core_version="6.12.0")

            report = setup_report(self, project, skill)

            (unmet,) = report["unmet_requirements"]
            self.assertEqual(unmet["skill"], "bmod-alpha")
            self.assertEqual(unmet["requires"], "bmad")
            self.assertEqual(unmet["state"], "outdated")
            self.assertEqual(unmet["installed"], "6.12.0")
            self.assertEqual(unmet["minimum"], "6.13.0")
            self.assertEqual(unmet["install"], "npx skills update")
            self.assertFalse(report["current"])
            self.assertEqual(report["next"], "npx skills update")

    def test_a_met_minimum_and_its_next_build_are_accepted(self):
        for version in ("6.13.0", "6.13.0-next", "7.0.0"):
            with self.subTest(version=version), tempfile.TemporaryDirectory() as temp_dir:
                project, skill = self.fixture(Path(temp_dir), core_version=version)
                report = setup_report(self, project, skill)
                self.assertEqual(report["unmet_requirements"], [])
                self.assertTrue(report["current"])

    def test_a_single_skill_module_is_its_own_version(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_bmod(root, "solo", "solo", skills=None, version="1.0.0", skill={})
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                skill_fields={"required_skills": [{"skill": "solo", "version": "2.0.0", "source": "file:skills"}]},
            )

            (unmet,) = setup_report(self, project, skill)["unmet_requirements"]
            self.assertEqual((unmet["requires"], unmet["state"], unmet["installed"]), ("solo", "outdated", "1.0.0"))

    def test_a_required_skill_with_no_bmod_file_has_an_unknown_version(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project, skill = self.fixture(root, core_version="6.13.0")
            write_bmod(
                root,
                "bmod-beta",
                "beta",
                skills=(),
                extra_fields={"required_skills": [{"skill": "old-skill", "version": "2.0.0", "source": BMAD_SOURCE}]},
            )
            (root / "old-skill").mkdir()
            (root / "old-skill" / "SKILL.md").write_text("# from before module records\n", encoding="utf-8")

            report = status_report(self, project, skill)

            (unmet,) = report["unmet_requirements"]
            self.assertEqual(
                (unmet["requires"], unmet["state"], unmet["installed"]), ("old-skill", "unknown-version", None)
            )
            self.assertEqual(unmet["install"], "npx skills update")
            self.assertFalse(report["current"])
            self.assertEqual(report["next"], "npx skills update")

    def test_a_missing_module_record_with_no_install_command_is_not_current(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir), core_version="6.13.0", record=False)

            for report in (status_report(self, project, skill), setup_report(self, project, skill)):
                self.assertEqual([entry["install"] for entry in report["missing_module_records"]], [None])
                self.assertFalse(report["current"])

    def test_a_skill_without_its_module_record_is_not_called_outdated(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir), core_version="6.12.0", record=False)

            report = status_report(self, project, skill)

            self.assertEqual(report["unmet_requirements"], [])
            self.assertEqual(
                report["missing_module_records"],
                [
                    {
                        "skill": "bmad",
                        "bmod": "bmod-core-tools",
                        "source": "file:skills",
                        "channel": "local",
                        "install": None,
                    }
                ],
            )


class BmadDiscoveryTests(unittest.TestCase):
    def test_a_single_skill_module_holds_both_tables_in_one_file(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write(
                root / "release-notes" / "bmod.toml",
                "[bmod]\n"
                'code = "notes"\n'
                'version = "1.0.0"\n'
                'update_source = "github:acme/release-notes-skill"\n\n'
                "[[bmod.knowledge]]\n"
                'path = "help.md"\n\n'
                "[[bmod.config_questions]]\n"
                'key = "changelog_path"\n'
                'prompt = "Which file is the changelog?"\n'
                'default = "CHANGELOG.md"\n\n'
                "[skill]\n"
                'scripts = ["scripts/notes.py"]\n',
            )
            (root / "release-notes" / "scripts").mkdir()
            (root / "release-notes" / "scripts" / "notes.py").write_bytes(b"# notes\n")

            parsed = setup.parse_bmod_file(
                root / "release-notes" / "bmod.toml", (root / "release-notes" / "bmod.toml").read_bytes()
            )
            self.assertIsNone(parsed.bmod.skills)
            self.assertEqual(parsed.skill.bmod, None)
            self.assertEqual(parsed.skill.source, None)
            self.assertEqual([entry.path.as_posix() for entry in parsed.bmod.knowledge], ["help.md"])
            self.assertIsNone(parsed.bmod.knowledge[0].skills)

            (module,) = setup.discover_installation(skill).modules
            self.assertEqual(
                (module.module, module.folder, module.skills), ("notes", "release-notes", ("release-notes",))
            )

            report = setup_report(
                self,
                project,
                skill,
                "--module",
                "notes",
                *module_answers_args(project, {"notes": {"changelog_path": "NOTES.md"}}),
            )
            self.assertEqual(report["problems"], [])
            self.assertEqual(report["missing_module_records"], [])
            self.assertEqual(report["modules"][0]["skills"], ["release-notes"])
            self.assertEqual((project / "_bmad" / "notes" / "scripts" / "notes.py").read_bytes(), b"# notes\n")
            config = tomllib.loads((project / "_bmad" / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(config["modules"]["notes"]["changelog_path"], "NOTES.md")

    def test_bmod_and_source_are_ignored_in_a_skill_table_beside_its_record(self):
        setup = load_setup()
        raw = (
            b'[bmod]\ncode = "notes"\nversion = "1.0.0"\nupdate_source = "file:skills"\n\n'
            b'[skill]\nbmod = "../anything"\nsource = 7\n'
        )
        parsed = setup.parse_bmod_file(Path("notes/bmod.toml"), raw)
        self.assertIsNone(parsed.skill.bmod)
        self.assertIsNone(parsed.skill.source)

    def test_a_record_with_no_skills_list_and_no_skill_table_has_no_skills(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            skill = write_dest_bmad(root)
            write_bmod(root, "bmod-rooms", "rooms", skills=None)

            (module,) = setup.discover_installation(skill).modules

            self.assertEqual(module.skills, ())

    def test_unknown_keys_and_tables_are_ignored_at_every_level(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write(
                root / "bmod-alpha" / "bmod.toml",
                'builder_note = "top-level key"\n\n'
                "[bmod]\n"
                'code = "alpha"\n'
                'version = "1.2.3"\n'
                'update_source = "file:skills"\n'
                'skills = ["alpha-skill"]\n'
                'future_key = "anything"\n'
                'required_skills = [{ skill = "bmad", source = "file:skills", reason = "unknown key" }]\n\n'
                "[[bmod.knowledge]]\n"
                'path = "help.md"\n'
                'audience = "unknown key"\n\n'
                "[bmod.acme]\n"
                'support = "https://example.com/support"\n\n'
                "[bmod.acme.nested]\n"
                "deep = true\n\n"
                "[unrelated]\n"
                "format = 2\n",
            )
            write(
                root / "alpha-skill" / "bmod.toml",
                '[skill]\nbmod = "bmod-alpha"\nsource = "file:skills"\nfuture_key = [1, 2]\n\n'
                "[skill.acme]\nnote = true\n\n[other]\nkey = 1\n",
            )

            (module,) = setup.discover_installation(skill).modules
            self.assertEqual(module.skills, ("alpha-skill",))
            self.assertEqual(module.parsed.required_skills, (setup.Requirement("bmad", None, "file:skills"),))

            report = setup_report(self, project, skill)
            self.assertEqual(report["problems"], [])
            self.assertTrue(report["current"])

    def test_requirement_lists_mix_plain_names_and_tables(self):
        setup = load_setup()
        raw = (
            b'[skill]\nbmod = "bmod-alpha"\nsource = "file:skills"\n'
            b"required_skills = [\n"
            b'  "plain-skill",\n'
            b'  { skill = "other", source = "github:acme/tools/skills" },\n'
            b'  { skill = "bmad", version = "6.13.0", source = "github:bmad-code-org/BMAD-METHOD/skills" },\n'
            b"]\n"
        )
        parsed = setup.parse_bmod_file(Path("alpha-skill/bmod.toml"), raw)
        self.assertEqual(
            parsed.skill.required_skills,
            (
                setup.Requirement("plain-skill", None, None),
                setup.Requirement("other", None, "github:acme/tools/skills"),
                setup.Requirement("bmad", "6.13.0", BMAD_SOURCE),
            ),
        )
        self.assertEqual(parsed.skill.recommended_skills, ())

    def test_a_duplicate_module_code_is_reported_and_the_first_folder_wins(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            question = {"key": "answer", "prompt": "From the first record", "default": "yes"}
            write_bmod(root, "bmod-alpha", "alpha", version="1.0.0", questions=(question,))
            write_bmod(
                root,
                "zz-alpha-again",
                "alpha",
                version="9.0.0",
                questions=({**question, "prompt": "From the second record"},),
            )

            report = status_report(self, project, skill)

            (module,) = report["modules"]
            self.assertEqual((module["folder"], module["version"]), ("bmod-alpha", "1.0.0"))
            self.assertEqual([item["prompt"] for item in report["pending_questions"]], ["From the first record"])
            (problem,) = report["problems"]
            self.assertEqual(
                (problem["kind"], problem["module"], problem["folder"], problem["kept"]),
                ("duplicate-module", "alpha", "zz-alpha-again", "bmod-alpha"),
            )
            self.assertFalse(report["current"])

    def test_a_membership_mismatch_is_reported_both_ways_and_nothing_is_raised(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_bmod(root, "bmod-alpha", "alpha", skills=("alpha-skill", "borrowed-skill"))
            write_bmod(root, "bmod-beta", "beta", skills=())
            write_skill(root, "alpha-skill", "bmod-alpha")
            write_skill(root, "borrowed-skill", "bmod-beta", scripts={"scripts/tool.py": b"# tool\n"})
            write_skill(root, "unlisted-skill", "bmod-alpha")

            report = setup_report(self, project, skill)

            problems = {(item["kind"], item["skill"], item["bmod"]) for item in report["problems"]}
            self.assertEqual(
                problems,
                {
                    ("membership", "borrowed-skill", "bmod-alpha"),
                    ("membership", "borrowed-skill", "bmod-beta"),
                    ("membership", "unlisted-skill", "bmod-alpha"),
                },
            )
            self.assertFalse(report["current"])
            self.assertFalse((project / "_bmad" / "alpha" / "scripts" / "tool.py").exists())
            self.assertFalse((project / "_bmad" / "beta" / "scripts" / "tool.py").exists())

    def test_a_two_table_file_whose_skills_list_leaves_itself_out_is_reported(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_bmod(root, "solo", "solo", skills=("other-skill",), update_source="plugin:solo", skill={})

            report = status_report(self, project, skill)

            (problem,) = report["problems"]
            self.assertEqual((problem["kind"], problem["skill"], problem["bmod"]), ("membership", "solo", "solo"))
            self.assertEqual(report["modules"][0]["absent_skills"], ["other-skill"])

    def test_listed_skills_that_are_not_installed_are_named(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_bmod(root, "bmod-alpha", "alpha", skills=("alpha-skill", "not-installed"))
            write_skill(root, "alpha-skill", "bmod-alpha")

            (module,) = status_report(self, project, skill)["modules"]

            self.assertEqual(module["skills"], ["alpha-skill"])
            self.assertEqual(module["absent_skills"], ["not-installed"])

    def test_bmad_runs_with_no_core_tools_record(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write(root / "bmad" / "bmod.toml", dump_bmod_toml(skill={"bmod": "bmod-core-tools", "source": BMAD_SOURCE}))
            command = "npx skills add bmad-code-org/BMAD-METHOD --skill bmod-core-tools"

            status = status_report(self, project, skill)

            self.assertEqual(status["bmad"], {"skill": "bmad", "version": None, "module": None})
            self.assertEqual(status["modules"], [])
            self.assertEqual(
                status["missing_module_records"],
                [
                    {
                        "skill": "bmad",
                        "bmod": "bmod-core-tools",
                        "source": BMAD_SOURCE,
                        "channel": "skills-cli",
                        "install": command,
                    }
                ],
            )
            self.assertEqual(status["next"], command)
            self.assertFalse(status["current"])

            report = setup_report(self, project, skill)
            self.assertEqual(report["status"], "created")
            self.assertIsNone(report["bmad"]["version"])
            self.assertEqual(report["next"], command)
            self.assertTrue((project / "_bmad" / "scripts" / "resolve_config.py").is_file())

            unknown = setup_report(self, project, skill, "--module", "core-tools")
            self.assertEqual(unknown["status"], "unknown-module")
            self.assertEqual([item["install"] for item in unknown["missing_module_records"]], [command])


class BmadModuleFilterTests(unittest.TestCase):
    def fixture(self, root: Path) -> tuple[Path, Path]:
        project = root / "project"
        project.mkdir()
        skill = write_dest_bmad(root)
        for code in ("alpha", "beta"):
            write_module_skill(
                root,
                f"{code}-skill",
                code,
                questions=({"key": "answer", "prompt": f"Answer for {code}", "default": "yes"},),
                scripts={"scripts/tool.py": code.encode()},
            )
        return project, skill

    def test_a_module_is_found_by_code_and_by_its_bmod_name(self):
        for name in ("beta", "bmod-beta"):
            with self.subTest(name=name), tempfile.TemporaryDirectory() as temp_dir:
                project, skill = self.fixture(Path(temp_dir))

                listed = run_setup_python(project, skill, "--list-config-questions", "--module", name)
                self.assertEqual(listed.returncode, 0, msg=listed.stderr)
                self.assertEqual([item["module"] for item in json.loads(listed.stdout)], ["beta"])

                status = status_report(self, project, skill, "--module", name)
                self.assertEqual(status["module"], "beta")
                self.assertEqual([item["module"] for item in status["modules"]], ["beta"])
                self.assertEqual([item["module"] for item in status["pending_questions"]], ["beta"])
                self.assertEqual(status["next"], "bmad setup beta")

                report = setup_report(
                    self,
                    project,
                    skill,
                    "--module",
                    name,
                    *module_answers_args(project, {"beta": {"answer": "chosen"}}),
                )
                self.assertEqual(report["module"], "beta")
                self.assertEqual([item["module"] for item in report["modules"]], ["beta"])
                self.assertEqual(list(report["answers"]), ["beta"])
                self.assertEqual([item["module"] for item in report["pending_questions"]], ["alpha"])
                self.assertEqual(report["next"], "bmad setup")
                self.assertFalse(report["current"])
                bmad = project / "_bmad"
                config = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
                self.assertEqual(config["modules"]["beta"]["answer"], "chosen")
                self.assertNotIn("alpha", config["modules"])
                self.assertTrue((bmad / "beta" / "scripts" / "tool.py").is_file())
                self.assertFalse((bmad / "alpha").exists())
                # The install-wide parts run for a named module too.
                self.assertTrue(scripts_match(bmad / "scripts", skill / "scripts"))

    def test_a_module_code_wins_over_a_folder_with_the_same_name(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_bmod(root, "beta", "alpha", update_source="plugin:x")
            write_bmod(root, "bmod-gamma", "beta", update_source="plugin:x")
            write_bmod(root, "zeta", "bmod-beta", update_source="plugin:x")

            for name, code in (("beta", "beta"), ("alpha", "alpha"), ("bmod-beta", "bmod-beta"), ("zeta", "bmod-beta")):
                with self.subTest(name=name):
                    self.assertEqual(status_report(self, project, skill, "--module", name)["module"], code)

    def test_an_answer_for_another_module_is_refused_when_one_is_named(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))

            result = run_setup_python(
                project,
                skill,
                "--module",
                "beta",
                *module_answers_args(project, {"alpha": {"answer": "x"}, "beta": {"answer": "y"}}),
            )

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("modules.alpha.answer", result.stderr)
            self.assertFalse((project / "_bmad").exists())

    def test_a_failure_is_one_error_line_and_a_missing_answers_file_reads_plainly(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))

            result = run_setup_python(project, skill)

            self.assertEqual(result.returncode, 1)
            self.assertEqual(
                result.stderr,
                "error: pending question modules.alpha.answer has no answer; "
                "pass --module-answers (run --list-config-questions first)\n",
            )
            self.assertEqual(result.stdout, "")
            self.assertFalse((project / "_bmad").exists())

    def test_an_unknown_name_lists_the_installed_modules_and_changes_nothing(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project, skill = self.fixture(root)
            before = snapshot(root)

            for extra, mode in (
                ((), "setup"),
                (("--status",), "status"),
                (("--list-config-questions",), "list-config-questions"),
            ):
                with self.subTest(mode=mode):
                    report = setup_report(self, project, skill, "--module", "nope", *extra)
                    self.assertEqual(
                        report,
                        {
                            "mode": mode,
                            "status": "unknown-module",
                            "changed": False,
                            "module": "nope",
                            "installed_modules": ["alpha", "beta"],
                            "missing_module_records": [],
                        },
                    )
            self.assertEqual(snapshot(root), before)

    def test_an_unknown_name_whose_skill_is_present_gives_the_install_command(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project, skill = self.fixture(root)
            write_skill(root, "gamma-skill", "bmod-gamma", source="github:acme/gamma/skills")

            for name in ("gamma", "bmod-gamma"):
                with self.subTest(name=name):
                    report = setup_report(self, project, skill, "--module", name)
                    self.assertEqual(report["status"], "unknown-module")
                    (record,) = report["missing_module_records"]
                    self.assertEqual(record["skill"], "gamma-skill")
                    self.assertEqual(record["install"], "npx skills add acme/gamma --skill bmod-gamma")
            self.assertFalse((project / "_bmad").exists())


class BmadConfigScopeTests(unittest.TestCase):
    QUESTIONS = (
        {"key": "notes_folder", "prompt": "Where should notes go?", "default": "{directory_name}/notes"},
        {"key": "note_style", "scope": "user", "prompt": "Bullets or prose?", "default": "bullets"},
    )

    def fixture(self, root: Path) -> tuple[Path, Path]:
        project = root / "project"
        project.mkdir()
        skill = write_dest_bmad(root)
        write_module_skill(root, "alpha-skill", "alpha", questions=self.QUESTIONS)
        return project, skill

    def pending(self, project: Path, skill: Path) -> list[tuple[str, str]]:
        result = run_setup_python(project, skill, "--list-config-questions")
        self.assertEqual(result.returncode, 0, msg=result.stderr)
        return [(item["key"], item["scope"]) for item in json.loads(result.stdout)]

    def answer_all(self, project: Path, skill: Path) -> dict:
        return setup_report(
            self,
            project,
            skill,
            *module_answers_args(project, {"alpha": {"notes_folder": "docs/notes", "note_style": "prose"}}),
        )

    def test_scope_is_team_by_default_and_only_team_or_user(self):
        setup = load_setup()
        base = '[bmod]\ncode = "alpha"\nversion = "1.2.3"\nupdate_source = "file:skills"\n\n[[bmod.config_questions]]\n'
        question = 'key = "style"\nprompt = "Style?"\ndefault = "plain"\n'
        path = Path("bmod-alpha/bmod.toml")

        self.assertEqual(setup.parse_bmod_file(path, (base + question).encode()).bmod.questions[0].scope, "team")
        for scope in ("team", "user"):
            parsed = setup.parse_bmod_file(path, (base + question + f'scope = "{scope}"\n').encode())
            self.assertEqual(parsed.bmod.questions[0].scope, scope)
        for bad in ('"project"', '"User"', '""', "7", "true"):
            with self.subTest(scope=bad), self.assertRaises(Exception) as caught:
                setup.parse_bmod_file(path, (base + question + f"scope = {bad}\n").encode())
            self.assertIn("scope", str(caught.exception))
            self.assertIn(str(path), str(caught.exception))

    def test_the_question_list_carries_each_scope(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))

            result = run_setup_python(project, skill, "--list-config-questions")

            self.assertEqual(result.returncode, 0, msg=result.stderr)
            self.assertEqual(
                json.loads(result.stdout),
                [
                    {
                        "module": "alpha",
                        "key": "notes_folder",
                        "prompt": "Where should notes go?",
                        "default": "project/notes",
                        "scope": "team",
                    },
                    {
                        "module": "alpha",
                        "key": "note_style",
                        "prompt": "Bullets or prose?",
                        "default": "bullets",
                        "scope": "user",
                    },
                ],
            )
            self.assertFalse((project / "_bmad").exists())

    def test_a_user_answer_lands_in_the_user_file_and_not_in_the_team_file(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))

            report = self.answer_all(project, skill)

            bmad = project / "_bmad"
            team = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            user = tomllib.loads((bmad / "custom" / "config.user.toml").read_text(encoding="utf-8"))
            self.assertEqual(team["modules"]["alpha"], {"notes_folder": "docs/notes"})
            self.assertEqual(user, {"modules": {"alpha": {"note_style": "prose"}}})
            self.assertEqual(
                report["answers_added"],
                [
                    {"module": "alpha", "key": "notes_folder", "scope": "team", "file": "_bmad/config.toml"},
                    {
                        "module": "alpha",
                        "key": "note_style",
                        "scope": "user",
                        "file": "_bmad/custom/config.user.toml",
                    },
                ],
            )
            self.assertEqual(
                report["answers"]["alpha"],
                [
                    {"key": "notes_folder", "scope": "team", "file": "_bmad/config.toml", "value": "docs/notes"},
                    {
                        "key": "note_style",
                        "scope": "user",
                        "file": "_bmad/custom/config.user.toml",
                        "value": "prose",
                    },
                ],
            )
            self.assertEqual(self.pending(project, skill), [])

            resolved = subprocess.run(
                [
                    sys.executable,
                    str(bmad / "scripts" / "resolve_config.py"),
                    "--project-root",
                    str(project),
                    "--key",
                    "modules.alpha",
                ],
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(resolved.returncode, 0, msg=resolved.stderr)
            self.assertIn("prose", resolved.stdout)
            self.assertIn("docs/notes", resolved.stdout)

    def test_deleting_the_user_file_makes_only_the_user_question_pending_again(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            self.answer_all(project, skill)
            bmad = project / "_bmad"
            team_before = (bmad / "config.toml").read_bytes()

            (bmad / "custom" / "config.user.toml").unlink()

            self.assertEqual(self.pending(project, skill), [("note_style", "user")])
            status = status_report(self, project, skill)
            self.assertEqual(
                [(item["key"], item["scope"]) for item in status["pending_questions"]], [("note_style", "user")]
            )
            self.assertEqual(status["next"], "bmad setup")
            report = setup_report(
                self, project, skill, *module_answers_args(project, {"alpha": {"note_style": "bullets"}})
            )
            self.assertEqual([item["key"] for item in report["answers_added"]], ["note_style"])
            self.assertEqual((bmad / "config.toml").read_bytes(), team_before)
            user = tomllib.loads((bmad / "custom" / "config.user.toml").read_text(encoding="utf-8"))
            self.assertEqual(user["modules"]["alpha"]["note_style"], "bullets")

    def test_a_user_question_is_pending_whatever_the_team_file_says(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            write(
                project / "_bmad" / "config.toml",
                '[modules.alpha]\nnotes_folder = "team"\nnote_style = "a teammate\'s answer"\n',
            )

            self.assertEqual(self.pending(project, skill), [("note_style", "user")])

    def test_an_existing_value_is_never_overwritten(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            bmad = project / "_bmad"
            write(bmad / "config.toml", '[modules.alpha]\nnotes_folder = "team keeps this"\n')
            write(
                bmad / "custom" / "config.user.toml",
                '[core]\nuser_name = "Sam"\n\n[modules.alpha]\nnote_style = "user keeps this"\n\n'
                "[modules.other]\nflag = true\n",
            )
            user_before = (bmad / "custom" / "config.user.toml").read_bytes()
            self.assertEqual(self.pending(project, skill), [])

            refused = run_setup_python(
                project,
                skill,
                *module_answers_args(project, {"alpha": {"notes_folder": "new", "note_style": "new"}}),
            )
            self.assertNotEqual(refused.returncode, 0)
            self.assertIn("not a pending question", refused.stderr)

            report = setup_report(self, project, skill)
            self.assertEqual(report["answers_added"], [])
            self.assertEqual(
                [item["value"] for item in report["answers"]["alpha"]], ["team keeps this", "user keeps this"]
            )
            team = tomllib.loads((bmad / "config.toml").read_text(encoding="utf-8"))
            self.assertEqual(team["modules"]["alpha"]["notes_folder"], "team keeps this")
            self.assertEqual((bmad / "custom" / "config.user.toml").read_bytes(), user_before)

    def test_a_new_user_answer_keeps_every_value_already_in_the_user_file(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            bmad = project / "_bmad"
            write(
                bmad / "custom" / "config.user.toml",
                '[core]\nuser_name = "Sam"\n\n[modules.alpha]\nother = 42\n',
            )

            self.answer_all(project, skill)

            user = tomllib.loads((bmad / "custom" / "config.user.toml").read_text(encoding="utf-8"))
            self.assertEqual(
                user,
                {"core": {"user_name": "Sam"}, "modules": {"alpha": {"other": 42, "note_style": "prose"}}},
            )

    def test_new_answers_keep_the_comments_and_layout_of_both_files(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project, skill = self.fixture(root)
            write_module_skill(
                root,
                "beta-skill",
                "beta",
                questions=({"key": "style", "scope": "user", "prompt": "Style?", "default": "plain"},),
            )
            setup_report(
                self, project, skill, "--module", "beta", *module_answers_args(project, {"beta": {"style": "b"}})
            )
            bmad = project / "_bmad"
            team_text = (
                (bmad / "config.toml").read_text(encoding="utf-8")
                + "\n# why alpha is set up this way\n[modules.alpha]\nother = 1  # keep me\n\n"
                "# the table after alpha\n[modules.zeta]\nflag = true\n"
            )
            user_text = (
                '# my own notes\n[core]\nuser_name = "Sam"  # that is me\n\n'
                '[modules.beta]\nstyle = "b"\n# trailing comment\n'
            )
            write(bmad / "config.toml", team_text)
            write(bmad / "custom" / "config.user.toml", user_text)

            self.answer_all(project, skill)

            self.assertEqual(
                (bmad / "config.toml").read_text(encoding="utf-8"),
                team_text.replace("other = 1  # keep me\n", 'other = 1  # keep me\nnotes_folder = "docs/notes"\n'),
            )
            self.assertEqual(
                (bmad / "custom" / "config.user.toml").read_text(encoding="utf-8"),
                user_text + '\n[modules.alpha]\nnote_style = "prose"\n',
            )

    def test_a_table_that_cannot_be_placed_by_text_is_rendered_with_every_value_kept(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            user_file = project / "_bmad" / "custom" / "config.user.toml"
            write(user_file, '# comment\nmodules.alpha.other = 42\n\n[core]\nuser_name = "Sam"\n')

            self.answer_all(project, skill)

            self.assertEqual(
                tomllib.loads(user_file.read_text(encoding="utf-8")),
                {"core": {"user_name": "Sam"}, "modules": {"alpha": {"other": 42, "note_style": "prose"}}},
            )

    def test_an_unparseable_user_file_stops_setup_before_any_write(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            user_file = project / "_bmad" / "custom" / "config.user.toml"
            write(user_file, "[broken\n")
            before = snapshot(project)

            result = run_setup_python(project, skill)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn(str(user_file), result.stderr)
            self.assertEqual(snapshot(project), before)

    def test_a_symlinked_user_file_is_never_written_through(self):
        if not symlink_to_temp_dir_succeeds():
            self.skipTest("symlinks not available")
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project, skill = self.fixture(root)
            outside = root / "outside.toml"
            write(outside, "[core]\nkeep = true\n")
            custom = project / "_bmad" / "custom"
            custom.mkdir(parents=True)
            os.symlink(outside, custom / "config.user.toml")

            result = run_setup_python(
                project,
                skill,
                *module_answers_args(project, {"alpha": {"notes_folder": "n", "note_style": "prose"}}),
            )

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("symlink", result.stderr)
            self.assertEqual(outside.read_text(encoding="utf-8"), "[core]\nkeep = true\n")
            self.assertFalse((project / "_bmad" / "config.toml").exists())

    def test_the_custom_gitignore_is_written_once_and_never_edited(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            gitignore = project / "_bmad" / "custom" / ".gitignore"

            first = self.answer_all(project, skill)
            self.assertEqual(first["custom_gitignore"], "created")
            self.assertEqual(gitignore.read_text(encoding="utf-8"), "*.user.toml\n")

            for covered in ("# ours now\n*.toml\n", "config.user.toml\n", "  *  \n"):
                gitignore.write_text(covered, encoding="utf-8")
                second = setup_report(self, project, skill)
                self.assertEqual(second["custom_gitignore"], "current")
                self.assertFalse(second["changed"])
                self.assertEqual(second["problems"], [])
                self.assertEqual(gitignore.read_text(encoding="utf-8"), covered)

    def test_a_gitignore_that_does_not_cover_user_answers_is_reported_and_never_edited(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            self.answer_all(project, skill)
            gitignore = project / "_bmad" / "custom" / ".gitignore"
            gitignore.write_text("# *.user.toml\nnotes/\n", encoding="utf-8")

            for report in (status_report(self, project, skill), setup_report(self, project, skill)):
                self.assertEqual(report["custom_gitignore"], "unprotected")
                (problem,) = report["problems"]
                self.assertEqual(problem["kind"], "custom-gitignore")
                self.assertIn("may be committed", problem["message"])
                self.assertFalse(report["current"])
                self.assertIsNone(report["next"])
            self.assertEqual(gitignore.read_text(encoding="utf-8"), "# *.user.toml\nnotes/\n")

    def test_a_custom_folder_without_a_gitignore_gets_one(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            project, skill = self.fixture(Path(temp_dir))
            self.answer_all(project, skill)
            custom = project / "_bmad" / "custom"
            (custom / ".gitignore").unlink()
            write(custom / "keep.txt", "keep\n")

            status = status_report(self, project, skill)
            self.assertEqual(status["custom_gitignore"], "missing")
            self.assertEqual(status["next"], "bmad setup")
            report = setup_report(self, project, skill)

            self.assertEqual(report["custom_gitignore"], "created")
            self.assertEqual((custom / ".gitignore").read_text(encoding="utf-8"), "*.user.toml\n")
            self.assertEqual((custom / "keep.txt").read_text(encoding="utf-8"), "keep\n")


class BmadStatusTests(unittest.TestCase):
    def test_status_changes_nothing_on_disk(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root, update_source="file:sources")
            write_module_skill(
                root,
                "alpha-skill",
                "alpha",
                update_source="file:sources",
                questions=({"key": "answer", "prompt": "Answer", "default": "yes"},),
                scripts={"scripts/tool.py": b"tool\n"},
            )
            write_bmod(project / "sources", "bmod-alpha", "alpha", version="2.0.0")
            write(project / "skills-lock.json", "keep\n")

            before = snapshot(root)
            fresh = status_report(self, project, skill)
            self.assertEqual(snapshot(root), before)
            self.assertFalse(fresh["bmad_exists"])
            self.assertEqual(fresh["shared_scripts"], "missing")
            self.assertEqual(fresh["next"], "npx skills update")

            bmad = project / "_bmad"
            write(bmad / "config.toml", "[core]\nkeep = true\n")
            write(bmad / "scripts" / "stale.py", "stale\n")
            write(bmad / "alpha" / "scripts" / "tool.py", "old\n")
            before = snapshot(root)
            stale = status_report(self, project, skill)
            self.assertEqual(snapshot(root), before)
            self.assertTrue(stale["bmad_exists"])
            self.assertEqual(stale["shared_scripts"], "stale")
            alpha = next(item for item in stale["modules"] if item["module"] == "alpha")
            self.assertEqual(alpha["scripts"], "stale")
            self.assertEqual(alpha["update"]["state"], "newer-available")
            self.assertEqual(alpha["update"]["source_version"], "2.0.0")
            self.assertEqual([item["key"] for item in stale["pending_questions"]], ["answer"])
            self.assertFalse(stale["current"])

    def test_status_names_setup_when_only_setup_is_owed_and_nothing_when_current(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root, update_source="file:sources")
            write_bmod(project / "sources", "bmod-core-tools", "core-tools")

            self.assertEqual(status_report(self, project, skill)["next"], "bmad setup")
            setup_report(self, project, skill)
            current = status_report(self, project, skill)
            self.assertIsNone(current["next"])
            self.assertTrue(current["current"])
            self.assertEqual(current["bmad"]["version"], "1.2.3")

            # A newer bmad skill copy leaves _bmad/scripts stale; setup refreshes it and asks nothing.
            with (skill / "scripts" / "resolve_config.py").open("a", encoding="utf-8") as stream:
                stream.write("\n# newer\n")
            stale = status_report(self, project, skill)
            self.assertEqual(stale["shared_scripts"], "stale")
            self.assertEqual(stale["next"], "bmad setup")
            self.assertEqual(stale["pending_questions"], [])
            repaired = setup_report(self, project, skill)
            self.assertEqual((repaired["status"], repaired["shared_scripts"]), ("repaired", "repaired"))
            self.assertTrue(status_report(self, project, skill)["current"])

    def test_status_owes_setup_whenever_setup_would_write(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            setup_report(self, project, skill)
            self.assertIsNone(status_report(self, project, skill)["next"])

            shutil.rmtree(project / "_bmad-output")
            self.assertEqual(status_report(self, project, skill)["next"], "bmad setup")
            self.assertTrue(setup_report(self, project, skill)["changed"])
            self.assertIsNone(status_report(self, project, skill)["next"])

            write(
                skill / "assets" / "config.template.toml",
                MINIMAL_CONFIG.replace("[modules.bmm]", 'review_language = "English"\n\n[modules.bmm]'),
            )
            owed = status_report(self, project, skill)
            self.assertEqual(owed["next"], "bmad setup")
            self.assertFalse(owed["current"])
            self.assertEqual(setup_report(self, project, skill)["config"], "updated")
            settled = status_report(self, project, skill)
            self.assertIsNone(settled["next"])
            self.assertTrue(settled["current"])

    def test_status_reports_a_module_runtime_that_is_not_a_plain_directory(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "alpha-skill", "alpha", update_source="plugin:alpha")
            setup_report(self, project, skill)
            shutil.rmtree(project / "_bmad" / "alpha")
            write(project / "_bmad" / "alpha", "a file where the module folder belongs\n")

            report = status_report(self, project, skill)

            (alpha,) = report["modules"]
            self.assertEqual(alpha["scripts"], "could-not-check")
            (problem,) = report["problems"]
            self.assertEqual((problem["kind"], problem["module"]), ("scripts", "alpha"))
            self.assertIn(str(project / "_bmad" / "alpha"), problem["message"])
            self.assertFalse(report["current"])

    def test_status_reports_the_update_state_of_every_module_read_only(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root, update_source="file:sources")
            write_bmod(project / "sources", "bmod-core-tools", "core-tools")
            cases = (
                ("equal", "1.2.3", "1.2.3", "current"),
                ("newer", "1.2.3", "1.3.0", "newer-available"),
                ("ahead", "2.0.0", "1.9.9", "ahead"),
                ("dev", "2.0.0-dev.gabc", "2.0.0", "differing-unordered"),
                ("invalid", "tomorrow", "2.0.0", "differing-unordered"),
            )
            for module, installed, source, _state in cases:
                write_module_skill(root, f"{module}-skill", module, version=installed, update_source="file:sources")
                write_bmod(project / "sources", f"bmod-{module}", module, version=source)
            write_module_skill(root, "missing-source", "unreachable", update_source="file:sources")
            write_module_skill(root, "broken-source", "broken", update_source="file:sources")
            write(project / "sources" / "bmod-broken" / "bmod.toml", '[bmod]\ncode = "broken"\n')
            before = snapshot(root)

            report = status_report(self, project, skill)

            by_module = {item["module"]: item for item in report["modules"]}
            for module, _installed, _source, state in cases:
                self.assertEqual(by_module[module]["update"]["state"], state)
            self.assertEqual(by_module["unreachable"]["update"]["state"], "could-not-check")
            self.assertIn("bmod-unreachable/bmod.toml", by_module["unreachable"]["update"]["reason"])
            self.assertEqual(by_module["broken"]["update"]["state"], "could-not-check")
            self.assertIn("'bmod.version'", by_module["broken"]["update"]["reason"])
            self.assertEqual(report["bmad"]["version"], "1.2.3")
            self.assertFalse(report["current"])
            self.assertEqual(report["next"], "npx skills update")
            self.assertEqual(snapshot(root), before)

    def test_source_resolution_uses_https_roots_and_pins_github_to_main(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "https-skill", "httpsmod", update_source="https://example.test/tree")
            write_module_skill(root, "github-skill", "githubmod", update_source=BMAD_SOURCE)
            modules = {module.module: module for module in setup.discover_installation(skill).modules}
            response = mock.MagicMock()
            response.__enter__.return_value.read.return_value = b'[bmod]\nversion = "1.2.3"\n'
            response.__exit__.return_value = False
            with mock.patch.object(setup.urllib.request, "urlopen", return_value=response) as opened:
                reports = [setup.module_update_report(project, modules[code]) for code in ("httpsmod", "githubmod")]
            urls = [call.args[0].full_url for call in opened.call_args_list]
            self.assertEqual(urls[0], "https://example.test/tree/bmod-httpsmod/bmod.toml")
            self.assertEqual(
                urls[1],
                "https://raw.githubusercontent.com/bmad-code-org/BMAD-METHOD/main/skills/bmod-githubmod/bmod.toml",
            )
            self.assertEqual([item["state"] for item in reports], ["current", "current"])
            self.assertEqual([item["source_version"] for item in reports], ["1.2.3", "1.2.3"])

    def test_a_github_source_with_no_path_reads_the_file_at_the_repo_root(self):
        setup = load_setup()
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            skill = write_dest_bmad(root)
            write_bmod(
                root, "release-notes", "notes", skills=None, update_source="github:acme/release-notes-skill", skill={}
            )
            (module,) = setup.discover_installation(skill).modules

            self.assertEqual(
                setup.source_file_location(root, module),
                "https://raw.githubusercontent.com/acme/release-notes-skill/main/bmod.toml",
            )
            for bad in ("github:acme", "github:acme/", "github:/repo"):
                with self.subTest(source=bad), self.assertRaisesRegex(Exception, "owner/repo"):
                    setup.validate_source(bad, "bmod.update_source", root / "bmod.toml")

    def test_a_source_that_cannot_be_checked_does_not_make_the_install_not_current(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "alpha-skill", "alpha", update_source="file:nowhere")
            setup_report(self, project, skill)

            report = status_report(self, project, skill)

            (alpha,) = report["modules"]
            self.assertEqual(alpha["update"]["state"], "could-not-check")
            self.assertIn("bmod-alpha", alpha["update"]["reason"])
            self.assertIsNone(report["next"])
            self.assertTrue(report["current"])

    def test_status_reports_plugin_managed_modules_without_fetching(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "plugged", "alpha", update_source="plugin:bmad-method")
            setup_report(self, project, skill)

            report = status_report(self, project, skill)

            (alpha,) = report["modules"]
            self.assertEqual(alpha["update"]["state"], "plugin-managed")
            self.assertEqual(alpha["update"]["plugin"], "bmad-method")
            self.assertIn("update the plugin", alpha["update"]["instruction"])
            self.assertNotIn("source_version", alpha["update"])
            self.assertIsNone(report["next"])

    def test_status_reports_an_unusable_source_url_without_aborting_the_run(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root, update_source="file:sources")
            write_bmod(project / "sources", "bmod-core-tools", "core-tools")
            write_module_skill(root, "broken-skill", "broken", update_source="https://[oops/tree")

            report = status_report(self, project, skill)

            self.assertFalse(report["current"])
            by_module = {item["module"]: item for item in report["modules"]}
            self.assertEqual(by_module["broken"]["update"]["state"], "could-not-check")
            self.assertIn("https://[oops/tree", by_module["broken"]["update"]["reason"])
            self.assertEqual(by_module["core-tools"]["update"]["state"], "current")

    def test_status_reports_a_script_it_cannot_read_as_a_problem(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_module_skill(root, "alpha-skill", "alpha", script_entries=("scripts/missing.py",))

            report = status_report(self, project, skill)

            (alpha,) = report["modules"]
            self.assertEqual(alpha["scripts"], "could-not-check")
            (problem,) = report["problems"]
            self.assertEqual((problem["kind"], problem["module"]), ("scripts", "alpha"))
            self.assertIn("scripts/missing.py", problem["message"])

    def test_semver_ordering_is_numeric_and_dev_or_invalid_is_unordered(self):
        setup = load_setup()
        self.assertEqual(setup.compare_semver("1.10.0", "1.9.9"), 1)
        self.assertEqual(setup.compare_semver("1.0.0-alpha.2", "1.0.0-alpha.10"), -1)
        self.assertEqual(setup.compare_semver("1.0.0", "1.0.0+build.2"), 0)
        self.assertEqual(setup.compare_semver("1.0.0-rc.1", "1.0.0"), -1)
        self.assertEqual(setup.compare_semver("1.0.0-alpha.1", "1.0.0-alpha"), 1)
        self.assertIsNone(setup.compare_semver("1.0.0-dev.gabc", "1.0.0"))
        self.assertIsNone(setup.compare_semver("latest", "1.0.0"))

    def test_mode_flags_reject_incompatible_combinations_and_removed_modes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            project = root / "project"
            project.mkdir()
            skill = write_dest_bmad(root)
            write_core(root)
            answers = module_answers_args(project, {"core-tools": {"key": "value"}})

            for extra in (
                ("--status", "--list-config-questions"),
                ("--status", *answers),
                ("--list-config-questions", *answers),
                ("--doctor",),
                ("--update",),
            ):
                with self.subTest(extra=extra):
                    result = run_setup_python(project, skill, *extra)
                    self.assertEqual(result.returncode, 2, msg=result.stdout)
                    self.assertFalse((project / "_bmad").exists())


class BmadKnowledgeEntryTests(unittest.TestCase):
    def parse(self, entries: str):
        setup = load_setup()
        body = f'[bmod]\ncode = "alpha"\nversion = "1.2.3"\nupdate_source = "file:skills"\n{entries}'
        return setup.parse_bmod_file(Path("bmod-alpha/bmod.toml"), body.encode()).bmod.knowledge

    def entry(self, path: str, extra: str = "") -> str:
        return f"\n[[bmod.knowledge]]\npath = {path}\n{extra}"

    def test_entries_keep_their_order_and_their_skills(self):
        knowledge = self.parse(
            self.entry('"references/help.md"', 'skills = "*"\n')
            + self.entry('"agents.md"', 'skills = ["one", "two"]\n')
            + self.entry('"notes.md"')
        )
        self.assertEqual(
            [entry.path.as_posix() for entry in knowledge], ["references/help.md", "agents.md", "notes.md"]
        )
        self.assertEqual([entry.skills for entry in knowledge], [None, ("one", "two"), None])

    def test_a_module_may_have_no_documents(self):
        self.assertEqual(self.parse(""), ())

    def test_a_list_of_plain_paths_is_rejected(self):
        with self.assertRaises(Exception) as caught:
            self.parse('knowledge = ["help.md"]\n')
        self.assertIn("must be a table", str(caught.exception))

    def test_an_entry_without_a_path_is_rejected(self):
        with self.assertRaises(Exception) as caught:
            self.parse('\n[[bmod.knowledge]]\nskills = "*"\n')
        self.assertIn("knowledge[0].path", str(caught.exception))

    def test_a_skills_value_that_is_neither_star_nor_a_list_is_rejected(self):
        with self.assertRaises(Exception) as caught:
            self.parse(self.entry('"help.md"', 'skills = "all"\n'))
        self.assertIn("knowledge[0].skills", str(caught.exception))

    def test_unsafe_paths_are_rejected(self):
        for path in (
            '"https://docs.example.com/help.md"',
            '"C:help.md"',
            '"references\\\\help.md"',
            '"../escape.md"',
            '"/etc/passwd"',
        ):
            with self.subTest(path=path), self.assertRaises(Exception) as caught:
                self.parse(self.entry(path))
            self.assertIn("unsafe value", str(caught.exception))

    def test_a_repeated_path_is_rejected(self):
        for second in ('"help.md"', '"./help.md"'):
            with self.subTest(second=second), self.assertRaises(Exception) as caught:
                self.parse(self.entry('"help.md"') + self.entry(second))
            self.assertIn("repeats", str(caught.exception))


if __name__ == "__main__":
    unittest.main()
