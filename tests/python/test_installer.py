"""Tests for the pure-Python BMAD installer (bmad_method).

Covers the two things the Phase-1 PoC promised: `bmad --help` runs, and a
non-interactive scaffold into a temp dir succeeds and is actually usable - down
to the shipped runtime script reading the generated config.
"""

from __future__ import annotations

import csv
import json
import subprocess
import sys
import tomllib
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]

import bmad_method
from bmad_method.installer import InstallConfig, install


def _run_cli(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, "-m", "bmad_method.cli", *args],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )


# --------------------------- CLI smoke tests ---------------------------


def test_help_runs():
    result = _run_cli("--help")
    assert result.returncode == 0
    assert "install" in result.stdout
    assert "list-tools" in result.stdout


def test_version_runs():
    result = _run_cli("--version")
    assert result.returncode == 0
    assert bmad_method.__version__ in result.stdout


def test_list_tools_includes_claude_code():
    result = _run_cli("list-tools")
    assert result.returncode == 0
    assert "claude-code" in result.stdout
    assert ".claude/skills" in result.stdout


def test_install_requires_yes(tmp_path):
    result = _run_cli("install", "--directory", str(tmp_path), "--tools", "claude-code")
    assert result.returncode == 2
    assert "yes" in result.stderr.lower()


def test_install_rejects_unknown_tool(tmp_path):
    result = _run_cli("install", "--directory", str(tmp_path), "--tools", "not-a-tool", "--yes")
    assert result.returncode == 2
    assert "unknown tool" in result.stderr.lower()


# --------------------------- scaffold via API ---------------------------


@pytest.fixture(scope="module")
def scaffold(tmp_path_factory):
    project = tmp_path_factory.mktemp("bmad_project")
    result = install(
        InstallConfig(
            directory=project,
            modules=["bmm"],
            tools=["claude-code"],
            yes=True,
        )
    )
    return result


def test_scaffold_creates_expected_layout(scaffold):
    bmad = scaffold.bmad_dir
    assert bmad.is_dir()
    assert (bmad / "config.toml").is_file()
    assert (bmad / "config.user.toml").is_file()
    assert (bmad / "_config" / "manifest.yaml").is_file()
    assert (bmad / "_config" / "skill-manifest.csv").is_file()
    assert (bmad / "_config" / "files-manifest.csv").is_file()
    assert (bmad / "_config" / "bmad-help.csv").is_file()
    # Shared runtime scripts shipped, dev tests excluded.
    assert (bmad / "scripts" / "resolve_config.py").is_file()
    assert not (bmad / "scripts" / "tests").exists()
    # Custom override stubs + gitignore.
    assert (bmad / "custom" / "config.toml").is_file()
    assert (bmad / "custom" / ".gitignore").read_text().strip() == "*.user.toml"
    # The one directory created eagerly by core.
    assert (scaffold.project_root / "_bmad-output").is_dir()
    # core is always installed alongside the requested module.
    assert scaffold.modules == ["core", "bmm"]


def test_config_toml_is_valid_and_populated(scaffold):
    with (scaffold.bmad_dir / "config.toml").open("rb") as fh:
        config = tomllib.load(fh)
    assert config["core"]["project_name"] == scaffold.project_root.name
    assert config["core"]["output_folder"] == "_bmad-output"
    assert config["modules"]["bmm"]["project_knowledge"] == "{project-root}/docs"
    assert config["agents"]["bmad-agent-pm"]["name"] == "John"
    assert config["agents"]["bmad-agent-pm"]["module"] == "bmm"

    # User-scoped answers land in config.user.toml, not config.toml.
    with (scaffold.bmad_dir / "config.user.toml").open("rb") as fh:
        user = tomllib.load(fh)
    assert "user_name" in user["core"]
    assert "user_name" not in config.get("core", {})
    assert user["modules"]["bmm"]["user_skill_level"] == "intermediate"


def test_skills_installed_into_claude(scaffold):
    manifest = scaffold.bmad_dir / "_config" / "skill-manifest.csv"
    with manifest.open(encoding="utf-8", newline="") as fh:
        rows = list(csv.DictReader(fh))
    canonical_ids = {r["canonicalId"] for r in rows}
    assert len(canonical_ids) == scaffold.skill_count > 0

    skills_dir = scaffold.project_root / ".claude" / "skills"
    installed = {p.name for p in skills_dir.iterdir() if p.is_dir()}
    assert installed == canonical_ids
    # Every installed skill is self-contained (has its SKILL.md).
    for cid in canonical_ids:
        assert (skills_dir / cid / "SKILL.md").is_file()
    # Well-known skills are present.
    assert "bmad-help" in canonical_ids
    assert "bmad-agent-pm" in canonical_ids


def test_skill_dirs_removed_from_bmad(scaffold):
    # After IDE install, skills live only in .claude/skills - not under _bmad/.
    assert not list((scaffold.bmad_dir / "core").rglob("SKILL.md"))
    assert not list((scaffold.bmad_dir / "bmm").rglob("SKILL.md"))
    # Module-level files remain.
    assert (scaffold.bmad_dir / "core" / "config.yaml").is_file()
    assert (scaffold.bmad_dir / "bmm" / "module-help.csv").is_file()


def test_runtime_resolve_config_reads_scaffold(scaffold):
    """The shipped, stdlib-only runtime script reads our generated config."""
    script = scaffold.bmad_dir / "scripts" / "resolve_config.py"
    result = subprocess.run(
        [sys.executable, str(script), "--project-root", str(scaffold.project_root)],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr
    resolved = json.loads(result.stdout)
    assert resolved["core"]["project_name"] == scaffold.project_root.name
    assert resolved["agents"]["bmad-agent-pm"]["name"] == "John"


def test_install_with_dot_directory_uses_folder_name(tmp_path, monkeypatch):
    # Regression: `bmad install --directory .` must set project_name to the real
    # folder name, not an empty string from Path(".").name.
    project = tmp_path / "my-cool-project"
    project.mkdir()
    monkeypatch.chdir(project)
    result = install(InstallConfig(directory=Path("."), modules=["bmm"], tools=["claude-code"], yes=True))
    with (result.bmad_dir / "config.toml").open("rb") as fh:
        config = tomllib.load(fh)
    assert config["core"]["project_name"] == "my-cool-project"


def test_central_config_header_bytes_match_node(scaffold):
    # Byte-parity guard: the Node installer emits a U+2500 rule (exactly 65
    # dashes) and U+2014 em-dashes in these headers. A formatter that "dumbs
    # down" the source Unicode would turn U+2014 into a hyphen and change the
    # rule length, silently breaking parity. Assert the exact codepoints so that
    # regression fails here (no Node required).
    rule = "# " + chr(0x2500) * 65  # U+2500 box-drawing, exactly 65 dashes
    em = chr(0x2014)  # em dash

    config = (scaffold.bmad_dir / "config.toml").read_text(encoding="utf-8")
    assert rule in config
    assert f"install {em} treat as read-only" in config
    # The dumbed-down forms must NOT appear.
    assert "# " + chr(0x2500) * 66 not in config
    assert "install - treat as read-only" not in config

    user = (scaffold.bmad_dir / "config.user.toml").read_text(encoding="utf-8")
    assert rule in user
    assert f"# {em} it is never touched by the installer." in user

    team_stub = (scaffold.bmad_dir / "custom" / "config.toml").read_text(encoding="utf-8")
    assert f"repo {em} applies to every developer" in team_stub

    user_stub = (scaffold.bmad_dir / "custom" / "config.user.toml").read_text(encoding="utf-8")
    assert f"(gitignored) {em} applies only" in user_stub


def test_skill_copy_filter_is_recursive(tmp_path):
    # The skill copy must filter identically at every depth (mirrors Node):
    # `.gitkeep` is the one kept dotfile; other dotfiles, bytecode caches, and
    # editor/OS artifacts are dropped nested as well as at the top level.
    from bmad_method.ide import _copy_skill_dir

    src = tmp_path / "skill"
    (src / "sub" / "__pycache__").mkdir(parents=True)
    (src / "SKILL.md").write_text("x")
    (src / ".gitkeep").write_text("")
    (src / ".hidden").write_text("secret")
    (src / "sub" / ".gitkeep").write_text("")
    (src / "sub" / ".hidden").write_text("secret")
    (src / "sub" / "normal.txt").write_text("ok")
    (src / "sub" / ".DS_Store").write_text("junk")
    (src / "sub" / "__pycache__" / "m.cpython-313.pyc").write_text("bytecode")
    (src / "sub" / "tool.pyc").write_text("bytecode")

    dst = tmp_path / "out"
    _copy_skill_dir(src, dst)
    copied = {p.relative_to(dst).as_posix() for p in dst.rglob("*") if p.is_file()}
    assert copied == {".gitkeep", "SKILL.md", "sub/.gitkeep", "sub/normal.txt"}
    assert not (dst / "sub" / "__pycache__").exists()


def test_shared_scripts_wipe_does_not_follow_symlink(tmp_path):
    # Guard on the recursive delete in _copy_shared_scripts: if _bmad/scripts is
    # a symlink, we must unlink it (removing only the link), never rmtree through
    # it into whatever it points at.
    from bmad_method.installer import _copy_shared_scripts
    from bmad_method.payload import src_path

    important = tmp_path / "important"
    important.mkdir()
    (important / "keepme.txt").write_text("do not delete")

    dest = tmp_path / "_bmad" / "scripts"
    dest.parent.mkdir(parents=True)
    dest.symlink_to(important, target_is_directory=True)

    _copy_shared_scripts(src_path("scripts"), dest, [])

    assert (important / "keepme.txt").exists()  # target untouched
    assert dest.is_dir() and not dest.is_symlink()  # replaced by a real dir
    assert (dest / "resolve_config.py").is_file()


def test_install_is_idempotent(tmp_path):
    cfg = InstallConfig(directory=tmp_path, modules=["bmm"], tools=["claude-code"], yes=True)
    first = install(cfg)
    second = install(cfg)
    assert first.skill_count == second.skill_count
    assert (tmp_path / ".claude" / "skills" / "bmad-help" / "SKILL.md").is_file()
