# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for export-ideas.py. Run: uv run --with pytest pytest scripts/tests/test_export_ideas.py

Under test: a selection.json downloaded from a brainstorm.html Export button becomes a
clean, grouped-by-section selected-ideas.md sitting in the session workspace.
"""
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import importlib

export_ideas = importlib.import_module("export-ideas")  # module name has a hyphen


@pytest.fixture
def ws(tmp_path):
    return tmp_path / "workspace"


def write_selection(tmp_path, items) -> Path:
    p = tmp_path / "selection.json"
    p.write_text(json.dumps(items), encoding="utf-8")
    return p


def run(input_path, workspace, **kwargs):
    argv = ["--input", str(input_path), "--workspace", str(workspace)]
    for k, v in kwargs.items():
        argv += [f"--{k.replace('_', '-')}", str(v)]
    return export_ideas.main(argv)


def test_writes_markdown_grouped_by_section(tmp_path, ws):
    sel = write_selection(tmp_path, [
        {"text": "Idea one", "section": "Morphological Analysis"},
        {"text": "Idea two", "section": "Morphological Analysis"},
        {"text": "An insight worth keeping", "section": "Synthesis"},
    ])
    assert run(sel, ws) == 0
    out = (ws / "selected-ideas.md").read_text(encoding="utf-8")
    assert "## Morphological Analysis" in out
    assert "- Idea one" in out
    assert "- Idea two" in out
    assert "## Synthesis" in out
    assert "- An insight worth keeping" in out
    assert "3 items selected" in out


def test_defaults_missing_section_to_selected(tmp_path, ws):
    sel = write_selection(tmp_path, [{"text": "No section given"}])
    assert run(sel, ws) == 0
    out = (ws / "selected-ideas.md").read_text(encoding="utf-8")
    assert "## Selected" in out
    assert "- No section given" in out


def test_collapses_internal_whitespace(tmp_path, ws):
    sel = write_selection(tmp_path, [{"text": "line one\n  line two   with   gaps", "section": "S"}])
    assert run(sel, ws) == 0
    out = (ws / "selected-ideas.md").read_text(encoding="utf-8")
    assert "- line one line two with gaps" in out


def test_creates_missing_workspace(tmp_path):
    sel = write_selection(tmp_path, [{"text": "x", "section": "S"}])
    nested = tmp_path / "a" / "b"
    assert run(sel, nested) == 0
    assert (nested / "selected-ideas.md").is_file()


def test_custom_out_name(tmp_path, ws):
    sel = write_selection(tmp_path, [{"text": "x", "section": "S"}])
    assert run(sel, ws, out_name="picks.md") == 0
    assert (ws / "picks.md").is_file()
    assert not (ws / "selected-ideas.md").exists()


def test_missing_input_file_errors(tmp_path, ws):
    assert run(tmp_path / "does-not-exist.json", ws) == 2


def test_malformed_json_errors(tmp_path, ws):
    bad = tmp_path / "selection.json"
    bad.write_text("not json", encoding="utf-8")
    with pytest.raises(SystemExit):
        run(bad, ws)


def test_non_array_json_errors(tmp_path, ws):
    bad = tmp_path / "selection.json"
    bad.write_text(json.dumps({"not": "a list"}), encoding="utf-8")
    with pytest.raises(SystemExit):
        run(bad, ws)


def test_empty_selection_errors(tmp_path, ws):
    sel = write_selection(tmp_path, [])
    assert run(sel, ws) == 2


def test_items_with_blank_text_are_skipped(tmp_path, ws):
    sel = write_selection(tmp_path, [
        {"text": "   ", "section": "S"},
        {"text": "real one", "section": "S"},
    ])
    assert run(sel, ws) == 0
    out = (ws / "selected-ideas.md").read_text(encoding="utf-8")
    assert "1 item selected" in out
    assert "real one" in out
