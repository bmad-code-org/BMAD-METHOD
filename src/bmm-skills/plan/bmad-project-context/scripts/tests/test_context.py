# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Smoke tests for the skill's bundled context.py (the R10 bootstrap source).

The full Layer-1 suite lives with the core script at src/scripts/tests/test_context.py;
this file only proves the bundled copy is intact and runnable on its own.
Run: uv run --with pytest pytest scripts/tests/test_context.py
"""
import json
import subprocess
import sys
from pathlib import Path

CONTEXT_PY = Path(__file__).resolve().parent.parent / "context.py"


def run(args, cwd):
    return subprocess.run([sys.executable, str(CONTEXT_PY), *args],
                          cwd=str(cwd), capture_output=True, text=True)


def test_bootstrap_installs_to_known_spot(tmp_path):
    proc = run(["--json", "bootstrap"], tmp_path)
    assert proc.returncode == 0, proc.stderr
    target = tmp_path / "_bmad" / "scripts" / "context.py"
    assert target.exists()
    assert target.read_bytes() == CONTEXT_PY.read_bytes()


def test_index_validate_roundtrip(tmp_path):
    docs = tmp_path / "docs"
    docs.mkdir()
    (docs / "kernel.md").write_text("# Project Kernel — smoke\n")
    (docs / "rule.md").write_text(
        "---\ntype: convention\ntitle: rule\ndescription: d\nverified: 2026-01-01\n---\nBody.\n")
    assert run(["index"], tmp_path).returncode == 0
    proc = run(["--json", "validate"], tmp_path)
    assert proc.returncode == 0
    assert json.loads(proc.stdout)["ok"] is True


def test_matches_core_script_when_in_repo():
    core = CONTEXT_PY.parents[5] / "scripts" / "context.py"
    if core.exists():  # only meaningful inside the bmm source repo
        assert core.read_bytes() == CONTEXT_PY.read_bytes()
