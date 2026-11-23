# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for check_ids.py. Run: uv run --with pytest pytest tests/core-tools/bmad-facilitate/test_check_ids.py

Which positions define an id and which reference it, ranges, skipped code and comments, how
companion files share definitions, the report's sections, and the exit code for a missing file.
"""

import importlib.util
import json
import sys
from pathlib import Path

_SPEC = importlib.util.spec_from_file_location(
    "check_ids", Path(__file__).resolve().parents[3] / "skills/core-tools/bmad-facilitate/scripts/check_ids.py"
)
check_ids = importlib.util.module_from_spec(_SPEC)
sys.modules["check_ids"] = check_ids
_SPEC.loader.exec_module(check_ids)


DOC = """# PRD

**UJ-1: Mara answers.** She replies (FR-1).

### F-1. Prompts

- **FR-1**: A member is prompted.
- FR-2: A member can answer.
  - FR-2 holds on mobile.
1. FR-3. A member can flag a blocker.

| Id | Risk |
|---|---|
| R-1 | Answers are late. |
| Phase | **M-1, end Q1:** prompts live |

SM-1: Answers rise. Validates FR-1 to FR-3 and FR-9.
"""


def report(*texts: str) -> dict:
    return check_ids.scan([(f"doc{i}.md", text) for i, text in enumerate(texts)])


def defined(line: str) -> str | None:
    found = check_ids.definition(line)
    return found and found[1]


def test_definition_positions():
    assert defined("### FR-3 Prompts") == "FR-3"
    assert defined("**FR-3** text") == "FR-3"
    assert defined("**D-1 Approve this charter** as the mandate") == "D-1"
    assert defined("- FR-3: text") == "FR-3"
    assert defined("- **FR-3**: text") == "FR-3"
    assert defined("2. FR-3. text") == "FR-3"
    assert defined("- [ ] FR-3: text") == "FR-3"
    assert defined("> - FR-3: quoted") == "FR-3"
    assert defined("| FR-3 | text |") == "FR-3"
    assert defined("| Wave 1 | text | **M-2, end Q3:** live |") == "M-2"
    assert defined("FR-3 (withdrawn)") == "FR-3"


def test_reference_positions():
    assert defined("Realizes UJ-3.") is None
    assert defined("  - SM-1 can be computed from the reports.") is None
    assert defined("FR-3 depends on UJ-1.") is None
    assert defined("| Finance | Tolerance (OQ-1) |") is None
    assert defined("| Wave 1 | IN-1 live |") is None


def test_an_id_opening_a_list_of_ids_is_not_a_definition():
    assert defined("- FR-1 to FR-8 are in scope.") is None
    assert defined("- **FR-1, FR-2**: grouped") is None
    assert defined("FR-1–FR-8: in scope") is None
    assert defined("| FR-1 / FR-2 | both |") is None


def test_planted_undefined_reference_found():
    result = report(DOC)
    assert result["undefined"] == {"FR-9": ["doc0.md:17"]}
    assert result["duplicate"] == {}


def test_counts_per_prefix():
    counts = report(DOC)["counts"]
    assert counts["FR"] == {"defined": 3, "referenced": 4}
    assert counts["M"] == {"defined": 1, "referenced": 0}
    assert counts["UJ"] == {"defined": 1, "referenced": 0}


def test_range_references_each_id_in_it():
    result = report("- **BR-1**: a\n- **BR-2**: b\n- **BR-4**: d\n\nUnder BR-1 to BR-4.\n")
    assert result["undefined"] == {"BR-3": ["doc0.md:5"]}


def test_outside_names_reported_apart_from_undefined():
    result = report("- **FR-1**: Prompted at 9:00 in UTC-5.\n")
    assert result["undefined"] == {}
    assert result["unknown_prefix"] == {"UTC-5": ["doc0.md:1"]}


def test_code_and_comments_skipped_with_line_numbers_kept():
    text = "- **FR-1**: a\n\n```\nFR-7 in code\n```\n<!-- FR-8\nin a comment -->\nCites FR-9.\n"
    result = report(text)
    assert result["undefined"] == {"FR-9": ["doc0.md:8"]}


def test_companion_definitions_count_for_all_files():
    doc = "- **FR-1**: a\n"
    addendum = "Expands FR-1 and FR-2.\n"
    result = report(doc, addendum)
    assert result["undefined"] == {"FR-2": ["doc1.md:1"]}


def test_duplicate_definitions_across_files():
    result = report("- **FR-1**: a\n", "### FR-1 again\n")
    assert result["duplicate"] == {"FR-1": ["doc0.md:1", "doc1.md:1"]}


def test_traceability_table_references_ids_defined_above_it():
    text = (
        "## Business requirements\n\n| Id | Requirement |\n|---|---|\n| BR-1 | a |\n| BR-2 | b |\n\n"
        "## Traceability\n\n| Id | PRD line | Test |\n|---|---|---|\n| BR-1 | | |\n| BR-2 | | |\n| BR-3 | | |\n"
    )
    result = report(text)
    assert result["duplicate"] == {}
    assert result["undefined"] == {"BR-3": ["doc0.md:14"]}


def test_duplicate_row_in_a_defining_table_still_found():
    text = "| Id | Requirement |\n|---|---|\n| BR-1 | a |\n| BR-2 | b |\n\n| Id | Again |\n|---|---|\n| BR-2 | c |\n| BR-4 | d |\n"
    assert report(text)["duplicate"] == {"BR-2": ["doc0.md:4", "doc0.md:8"]}


def test_references_to_withdrawn_items():
    text = "- **OQ-7.** Withdrawn: met by FR-1.\n- **OQ-8.** Open.\n- **FR-1**: a (OQ-7, OQ-8)\n"
    assert report(text)["withdrawn"] == {"OQ-7": ["doc0.md:3"]}


TOC = """# Doc

## Table of Contents

- [Why it matters](#why-it-matters): the problem
- [Point](#point): first
- [Point](#point-1): second
- [Detail](#detail): one part

## Why it matters?

## Point

### Detail

## Point
"""


def test_table_of_contents_in_step_with_headings():
    assert report(TOC)["toc"] == {"missing": {}, "stale": {}, "out_of_order": []}


def test_table_of_contents_section_with_no_entry():
    toc = report(TOC + "\n## Risks\n")["toc"]
    assert toc["missing"] == {"Risks": ["doc0.md:18"]}


def test_table_of_contents_entry_for_a_removed_heading():
    toc = report(TOC.replace("## Why it matters?", "## Reasons"))["toc"]
    assert toc["stale"] == {"why-it-matters": ["doc0.md:5"]}
    assert toc["missing"] == {"Reasons": ["doc0.md:10"]}


def test_table_of_contents_out_of_order():
    swapped = TOC.replace(
        "- [Point](#point): first\n- [Point](#point-1): second", "- [Point](#point-1): second\n- [Point](#point): first"
    )
    assert report(swapped)["toc"]["out_of_order"] == ["doc0.md:3"]


def test_document_without_a_table_of_contents_has_no_toc_hits():
    assert report(DOC)["toc"] == {"missing": {}, "stale": {}, "out_of_order": []}


def test_linked_table_of_contents_entries_define_no_ids():
    text = "## Table of Contents\n\n- [FR-1: Login](#fr-1-login): sign in\n\n## FR-1: Login\n"
    assert report(text)["duplicate"] == {}


def test_main_prints_json(tmp_path, capsys):
    doc = tmp_path / "prd.md"
    doc.write_text(DOC, encoding="utf-8")
    assert check_ids.main([str(doc)]) == 0
    assert json.loads(capsys.readouterr().out)["undefined"] == {"FR-9": [f"{doc}:17"]}


def test_missing_file_exits_2(tmp_path, capsys):
    doc = tmp_path / "prd.md"
    doc.write_text(DOC, encoding="utf-8")
    assert check_ids.main([str(doc), str(tmp_path / "absent.md")]) == 2
    captured = capsys.readouterr()
    assert captured.out == ""
    assert "not found" in captured.err


EPIC_DOC = """# Epic

- **E02-FR-01**: The owner is emailed 60 days ahead.
- **E02-FR-02**: The owner can snooze once.
- **E02-FR-03**: A snooze never passes the deadline.

Covered by E02-FR-01 to E02-FR-03, and by E02-FR-09.
"""


def test_an_id_carrying_its_epic_is_read_whole():
    found = report(EPIC_DOC)
    assert found["counts"]["E02-FR"]["defined"] == 3
    assert list(found["undefined"]) == ["E02-FR-09"]


def test_a_range_of_zero_padded_ids_keeps_the_padding():
    assert report(EPIC_DOC.replace(", and by E02-FR-09", ""))["undefined"] == {}


def test_placeholders_detected_in_frontmatter_and_body_ignoring_fences_comments_and_inline_code():
    text = (
        '---\ntitle: "Plan"\ncreated: "TBD"\nowner: "{owner_name}"\n---\n\n'
        "# Plan\n\n"
        "Status is TODO and details are FIXME or XXX.\n"
        "Unfilled {team-name} in prose.\n"
        "Inline `{slug}` and `/users/{id}` stay clean.\n\n"
        "```\nTBD TODO {fenced_token}\n```\n\n"
        "<!-- TODO {comment_token} -->\n"
    )
    hits = report(text)["placeholders"]
    assert hits == [
        {"kind": "marker", "text": "TBD", "location": "doc0.md:3"},
        {"kind": "token", "text": "{owner_name}", "location": "doc0.md:4"},
        {"kind": "marker", "text": "TODO", "location": "doc0.md:9"},
        {"kind": "marker", "text": "FIXME", "location": "doc0.md:9"},
        {"kind": "marker", "text": "XXX", "location": "doc0.md:9"},
        {"kind": "token", "text": "{team-name}", "location": "doc0.md:10"},
    ]


def test_toc_line_numbers_account_for_frontmatter():
    text = "---\ntitle: Doc\n---\n\n## Table of Contents\n\n- [Keep](#keep)\n\n## Keep\n\n## Missing\n"
    toc = report(text)["toc"]
    assert toc["missing"] == {"Missing": ["doc0.md:11"]}


def test_non_monotonic_ids_flagged_while_gaps_duplicates_scopes_and_traceability_pass():
    bad = "- **REQ-1**: First\n- **REQ-3**: Third\n- **REQ-2**: Out of order\n"
    assert report(bad)["non_monotonic"] == [{"id": "REQ-2", "after": "REQ-3", "location": "doc0.md:3"}]

    gaps = "- **REQ-1**: First\n- **REQ-2**: Second\n- **REQ-4**: Fourth\n"
    assert report(gaps)["non_monotonic"] == []

    dup = "- **REQ-1**: First\n- **REQ-3**: Third\n- **REQ-3**: Duplicate\n"
    dup_res = report(dup)
    assert dup_res["non_monotonic"] == []
    assert dup_res["duplicate"] == {"REQ-3": ["doc0.md:2", "doc0.md:3"]}

    scoped = "- **S01-REQ-02**: First scope\n- **S02-REQ-01**: Second scope\n"
    assert report(scoped)["non_monotonic"] == []

    trace = (
        "| Id | Rule |\n|---|---|\n| REQ-1 | a |\n| REQ-2 | b |\n\n"
        "| Id | Check |\n|---|---|\n| REQ-2 | c |\n| REQ-1 | d |\n"
    )
    assert report(trace)["non_monotonic"] == []


def test_forbid_prefix_catches_exact_and_scoped_tokens_across_files(tmp_path, capsys):
    doc = tmp_path / "doc.md"
    comp = tmp_path / "companion.md"
    doc.write_text("- **R-1**: Keep\n- **FR-1**: Leak\nRefs E01-FR-02 and FR-3 to FR-5.\n", encoding="utf-8")
    comp.write_text("- **TASK-2**: Companion leak\n", encoding="utf-8")
    assert check_ids.main([str(doc), str(comp), "--forbid-prefix", "FR-", "--forbid-prefix", "TASK"]) == 0
    found = json.loads(capsys.readouterr().out)
    assert found["forbidden_prefix"] == {
        "FR-1": [f"{doc}:2"],
        "FR-3": [f"{doc}:3"],
        "FR-4": [f"{doc}:3"],
        "FR-5": [f"{doc}:3"],
        "E01-FR-02": [f"{doc}:3"],
        "TASK-2": [f"{comp}:1"],
    }


def test_help_and_missing_args_exit_codes():
    import pytest

    with pytest.raises(SystemExit) as help_exc:
        check_ids.main(["--help"])
    assert help_exc.value.code == 0

    with pytest.raises(SystemExit) as empty_exc:
        check_ids.main([])
    assert empty_exc.value.code == 2
