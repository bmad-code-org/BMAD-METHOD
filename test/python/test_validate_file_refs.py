# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Pytest parity for extractCsvRefs() from tools/validate-file-refs.js.

Ports every assertion from the retired test/test-file-refs-csv.js runner,
calling the real JS export through js_bridge rather than reimplementing CSV
extraction/filtering logic in Python. Uses the existing fixtures under
test/fixtures/file-refs-csv/** in place.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "support"))
import js_bridge  # noqa: E402

VALIDATE_FILE_REFS = "tools/validate-file-refs.js"
FIXTURES = Path(__file__).resolve().parents[1] / "fixtures" / "file-refs-csv"


def load_fixture(relative_path: str):
    full_path = FIXTURES / relative_path
    content = full_path.read_text(encoding="utf-8")
    return str(full_path), content


def extract_csv_refs(full_path: str, content: str):
    return js_bridge.call(VALIDATE_FILE_REFS, "extractCsvRefs", full_path, content)


# --- Valid fixtures ---


def test_bmm_style_extracts_workflow_file_refs_with_trailing_commas():
    full_path, content = load_fixture("valid/bmm-style.csv")
    refs = extract_csv_refs(full_path, content)

    assert len(refs) == 2
    assert refs[0]["raw"] == "_bmad/bmm/workflows/document-project/workflow.md"
    assert refs[1]["raw"] == "_bmad/core/workflows/brainstorming/workflow.md"
    assert refs[0]["type"] == "project-root"
    assert refs[0]["line"] == 2
    assert refs[1]["line"] == 3
    assert refs[0]["file"] == full_path


def test_core_style_extracts_refs_from_core_module_help_format():
    full_path, content = load_fixture("valid/core-style.csv")
    refs = extract_csv_refs(full_path, content)

    assert len(refs) == 2
    assert refs[0]["raw"] == "_bmad/core/workflows/brainstorming/workflow.md"
    assert refs[1]["raw"] == "_bmad/core/workflows/bmad-party-mode/workflow.md"


def test_minimal_extracts_refs_from_minimal_three_column_csv():
    full_path, content = load_fixture("valid/minimal.csv")
    refs = extract_csv_refs(full_path, content)

    assert len(refs) == 1
    assert refs[0]["raw"] == "_bmad/core/tasks/help.md"
    assert refs[0]["line"] == 2


# --- Invalid fixtures (expect 0 refs) ---


def test_no_workflow_column_returns_zero_refs_when_column_missing():
    full_path, content = load_fixture("invalid/no-workflow-column.csv")
    refs = extract_csv_refs(full_path, content)

    assert len(refs) == 0


def test_empty_data_returns_zero_refs_when_csv_has_header_only():
    full_path, content = load_fixture("invalid/empty-data.csv")
    refs = extract_csv_refs(full_path, content)

    assert len(refs) == 0


def test_all_empty_workflow_returns_zero_refs_when_all_workflow_cells_empty():
    full_path, content = load_fixture("invalid/all-empty-workflow.csv")
    refs = extract_csv_refs(full_path, content)

    assert len(refs) == 0


def test_unresolvable_vars_filters_template_variables_keeps_resolvable_ref():
    full_path, content = load_fixture("invalid/unresolvable-vars.csv")
    refs = extract_csv_refs(full_path, content)

    assert len(refs) == 1
    assert refs[0]["raw"] == "_bmad/core/tasks/help.md"
