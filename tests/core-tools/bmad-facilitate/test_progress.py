# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for progress.py. Run: uv run --with pytest pytest tests/core-tools/bmad-facilitate/test_progress.py

What counts as settled, which order the count follows, and the exit code for a missing file.
"""

import importlib.util
import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[3] / "skills/core-tools/bmad-facilitate/scripts/progress.py"
FRONTMATTER = SCRIPT.parents[2] / "bmad" / "scripts" / "frontmatter.py"
_SPEC = importlib.util.spec_from_file_location("progress", SCRIPT)
progress = importlib.util.module_from_spec(_SPEC)
sys.modules["progress"] = progress
_SPEC.loader.exec_module(progress)
sys.path.insert(0, str(FRONTMATTER.parent))
import frontmatter  # noqa: E402

progress.frontmatter = frontmatter  # main() loads the project's copy; the counting tests call past it


@pytest.fixture
def project(tmp_path):
    (tmp_path / "_bmad" / "scripts").mkdir(parents=True)
    shutil.copy2(FRONTMATTER, tmp_path / "_bmad" / "scripts")
    return str(tmp_path)


DOC = """---
title: "Pilot"
---

# Pilot

## Table of Contents

## Summary
<!-- open -->

## Goal
Prove walkers send a report after every walk.

## Pilot customers
<!-- open -->
Muddy Paws.

## Risks
<!-- settled out: nothing in the pilot carries one -->

```
## Not a section
<!-- open -->
```
"""

TEMPLATE = "---\ntemplate: pilot\nfacilitation_order: [goal, pilot-customers, risks, summary]\n---\n\n## Summary\n<!-- open -->\n"


def test_a_section_without_its_open_marker_is_settled_and_one_settled_out_counts():
    assert progress.progress(DOC, TEMPLATE) == {
        "total": 4,
        "settled": 2,
        "open": ["Pilot customers", "Summary"],
        "place": 2,
        "missing": [],
        "extra": [],
    }


def test_without_a_template_the_documents_own_headings_are_the_order():
    found = progress.progress(DOC)
    assert (found["total"], found["open"], found["place"]) == (4, ["Summary", "Pilot customers"], 1)


def test_an_opening_comment_is_not_an_open_marker():
    doc = "## Goal\n<!-- opening: what the pilot proves -->\nProve it.\n"
    assert progress.progress(doc)["settled"] == 1


def test_a_section_the_order_lists_and_the_document_lacks_is_open():
    found = progress.progress("## Goal\nDone.\n", "---\nfacilitation_order: [goal, scope]\n---\n")
    assert (found["settled"], found["open"], found["place"], found["missing"]) == (1, ["scope"], 2, ["scope"])


def test_a_repeated_heading_is_open_while_any_copy_is():
    doc = "## Point\nOne.\n\n## Point\n<!-- open -->\n"
    found = progress.progress(doc, "---\nfacilitation_order: [point]\n---\n")
    assert (found["total"], found["settled"]) == (1, 0)


def test_headings_that_replaced_the_templates_are_named():
    doc = "## Our approach\nDone.\n\n## Budget\n<!-- open -->\n"
    found = progress.progress(doc, "---\nfacilitation_order: [approach, budget]\n---\n")
    assert (found["missing"], found["extra"]) == (["approach"], ["Our approach"])


def test_all_settled_has_no_place():
    assert progress.progress("## Goal\nDone.\n")["place"] is None


def test_optional_sections_and_a_block_list_are_read_from_the_order():
    template = "---\nfacilitation_order:\n  - goal\n  - 'risks?'\n  - scope?\n---\n"
    found = progress.progress("## Goal\nDone.\n\n## Risks\n<!-- open -->\n", template)
    assert (found["total"], found["open"], found["missing"]) == (3, ["Risks", "scope"], ["scope"])


@pytest.mark.parametrize(
    "template",
    [
        "",
        "# No frontmatter\nfacilitation_order: [goal]\n",
        "---\nfacilitation_order: goal\n---\n",
        "---\nfacilitation_order: [goal\n---\n",
        "---\nfacilitation_order: [goal]\n",
    ],
)
def test_without_a_readable_order_the_documents_headings_are_the_order(template):
    found = progress.progress(DOC, template)
    assert (found["total"], found["open"]) == (4, ["Summary", "Pilot customers"])


def test_main_prints_json_and_a_missing_file_exits_2(tmp_path, project, capsys):
    (tmp_path / "d.md").write_text(DOC)
    (tmp_path / "t.md").write_text(TEMPLATE)
    assert progress.main(["--project-root", project, str(tmp_path / "d.md"), str(tmp_path / "t.md")]) == 0
    assert json.loads(capsys.readouterr().out)["settled"] == 2
    assert progress.main(["--project-root", project, str(tmp_path / "nope.md")]) == 2


def test_a_byte_order_mark_does_not_hide_the_templates_order(tmp_path, project, capsys):
    (tmp_path / "d.md").write_text(DOC, encoding="utf-8-sig")
    (tmp_path / "t.md").write_text(TEMPLATE, encoding="utf-8-sig")
    assert progress.main(["--project-root", project, str(tmp_path / "d.md"), str(tmp_path / "t.md")]) == 0
    assert json.loads(capsys.readouterr().out)["place"] == 2


def test_a_project_without_the_shared_scripts_is_told_to_run_setup(tmp_path):
    (tmp_path / "d.md").write_text(DOC)
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--project-root", str(tmp_path), str(tmp_path / "d.md")],
        capture_output=True,
        text=True,
    )
    missing = tmp_path / "_bmad" / "scripts" / "frontmatter.py"
    assert result.returncode == 2
    assert result.stderr.splitlines() == [f"error: {missing} is missing. Run bmad setup for this project."]
