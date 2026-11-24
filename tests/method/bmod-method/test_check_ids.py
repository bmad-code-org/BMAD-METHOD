# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for Method check_ids.py. Run: uv run --with pytest pytest tests/method/bmod-method/test_check_ids.py"""

import importlib.util
import json
import sys
from pathlib import Path

import pytest

_SPEC = importlib.util.spec_from_file_location(
    "method_check_ids", Path(__file__).resolve().parents[3] / "skills/method/bmod-method/scripts/check_ids.py"
)
check_ids = importlib.util.module_from_spec(_SPEC)
sys.modules["method_check_ids"] = check_ids
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


def test_definition_positions_bare_bold_and_backticked():
    assert defined("### FR-3 Prompts") == "FR-3"
    assert defined("### `FR-3` Prompts") == "FR-3"
    assert defined("**FR-3** text") == "FR-3"
    assert defined("**`D-1`** text") == "D-1"
    assert defined("**D-1 Approve this charter** as the mandate") == "D-1"
    assert defined("- FR-3: text") == "FR-3"
    assert defined("- `FR-3`: text") == "FR-3"
    assert defined("- **`FR-3`**: text") == "FR-3"
    assert defined("- `INV-1` — must hold") == "INV-1"
    assert defined("2. FR-3. text") == "FR-3"
    assert defined("- [ ] FR-3: text") == "FR-3"
    assert defined("> - FR-3: quoted") == "FR-3"
    assert defined("| FR-3 | text |") == "FR-3"
    assert defined("| `OKR-1` | measure |") == "OKR-1"
    assert defined("| **`OKR-1`** | measure |") == "OKR-1"
    assert defined("| Wave 1 | text | **M-2, end Q3:** live |") == "M-2"
    assert defined("| Wave 1 | text | **`M-2`**: live |") == "M-2"
    assert defined("FR-3 (withdrawn)") == "FR-3"
    assert defined("- `OQ-7` (withdrawn)") == "OQ-7"


def test_reference_positions_and_grouped_lists_stay_non_defining():
    assert defined("Realizes UJ-3.") is None
    assert defined("  - SM-1 can be computed from the reports.") is None
    assert defined("  - `INV-1` holds on mobile.") is None
    assert defined("FR-3 depends on UJ-1.") is None
    assert defined("| Finance | Tolerance (OQ-1) |") is None
    assert defined("| Wave 1 | `IN-1` live |") is None
    assert defined("- FR-1 to FR-8 are in scope.") is None
    assert defined("- **FR-1, FR-2**: grouped") is None
    assert defined("- `FR-1`, `FR-2`: grouped") is None
    assert defined("- **`FR-1`**, **`FR-2`**: grouped") is None
    assert defined("FR-1–FR-8: in scope") is None
    assert defined("| FR-1 / FR-2 | both |") is None
    assert defined("| `FR-1` / `FR-2` | both |") is None
    assert defined("- `FR-1 extra`: not an id") is None


def test_undefined_counts_ranges_companions_and_traceability():
    result = report(DOC)
    assert result["undefined"] == {"FR-9": ["doc0.md:17"]}
    assert result["duplicate"] == {}
    assert result["counts"]["FR"] == {"defined": 3, "referenced": 4}
    assert result["counts"]["M"] == {"defined": 1, "referenced": 0}
    assert result["counts"]["UJ"] == {"defined": 1, "referenced": 0}

    assert report("- **BR-1**: a\n- **BR-2**: b\n- **BR-4**: d\n\nUnder BR-1 to BR-4.\n")["undefined"] == {
        "BR-3": ["doc0.md:5"]
    }
    assert report("- `BR-1`: a\n- `BR-2`: b\n- `BR-4`: d\n\nUnder `BR-1` to `BR-4`.\n")["undefined"] == {
        "BR-3": ["doc0.md:5"]
    }

    doc = "- **FR-1**: a\n"
    addendum = "Expands FR-1 and FR-2.\n"
    assert report(doc, addendum)["undefined"] == {"FR-2": ["doc1.md:1"]}

    assert report("- **FR-1**: a\n", "### FR-1 again\n")["duplicate"] == {"FR-1": ["doc0.md:1", "doc1.md:1"]}

    trace = (
        "## Business requirements\n\n| Id | Requirement |\n|---|---|\n| BR-1 | a |\n| BR-2 | b |\n\n"
        "## Traceability\n\n| Id | PRD line | Test |\n|---|---|---|\n| BR-1 | | |\n| BR-2 | | |\n| BR-3 | | |\n"
    )
    trace_res = report(trace)
    assert trace_res["duplicate"] == {}
    assert trace_res["undefined"] == {"BR-3": ["doc0.md:14"]}


def test_withdrawn_scoped_zero_padded_and_skip_code_comments():
    withdrawn = report("- `OQ-7` (withdrawn)\n- **OQ-8.** Open.\n- **FR-1**: a (`OQ-7`, OQ-8)\n")
    assert withdrawn["withdrawn"] == {"OQ-7": ["doc0.md:3"]}
    assert withdrawn["undefined"] == {}

    epic = "- **E02-FR-01**: A.\n- **E02-FR-02**: B.\n- **E02-FR-03**: C.\n\nCovered by E02-FR-01 to E02-FR-03, and E02-FR-09.\n"
    epic_res = report(epic)
    assert epic_res["counts"]["E02-FR"] == {"defined": 3, "referenced": 4}
    assert epic_res["undefined"] == {"E02-FR-09": ["doc0.md:5"]}

    assert (
        report("- **E02-FR-01**: A.\n- **E02-FR-02**: B.\n- **E02-FR-03**: C.\n\nE02-FR-01 to E02-FR-03.\n")[
            "undefined"
        ]
        == {}
    )

    fenced = "- **FR-1**: a\n\n```\nFR-7 in code\n```\n<!-- FR-8 -->\nCites FR-9.\n"
    assert report(fenced)["undefined"] == {"FR-9": ["doc0.md:7"]}


def test_outside_tokens_and_non_monotonic_edits_stay_clean():
    res = report(
        "| ID | Measure |\n|---|---|\n| `OKR-1` | Speed |\n| `OKR-2` | Quality |\n\n"
        "- `INV-1`: Must export UTF-8 CSV and W-2 forms in UTC-5 for CO-27 (Workorder WO-4810).\n"
        "- `INV-3`: Out-of-order insert still clean (`OKR-1`, `OKR-2`).\n"
        "- `INV-2`: Added later above or below.\n"
    )
    assert "unknown_prefix" not in res
    assert "non_monotonic" not in res
    assert res == {
        "undefined": {},
        "duplicate": {},
        "withdrawn": {},
        "counts": {
            "INV": {"defined": 3, "referenced": 0},
            "OKR": {"defined": 2, "referenced": 2},
        },
    }


def test_cli_json_and_exit_codes(tmp_path, capsys):
    doc = tmp_path / "prd.md"
    doc.write_text(DOC, encoding="utf-8")
    assert check_ids.main([str(doc)]) == 0
    assert json.loads(capsys.readouterr().out)["undefined"] == {"FR-9": [f"{doc}:17"]}

    assert check_ids.main([str(doc), str(tmp_path / "absent.md")]) == 2
    assert "not found" in capsys.readouterr().err

    with pytest.raises(SystemExit) as help_exc:
        check_ids.main(["--help"])
    assert help_exc.value.code == 0

    with pytest.raises(SystemExit) as empty_exc:
        check_ids.main([])
    assert empty_exc.value.code == 2


def test_fence_suffix_and_comment_interplay():
    text = (
        "- **FR-1**: First.\n"
        "<!--\n```\n-->\n"
        "Cites FR-9.\n"
        "```markdown\n"
        "<!-- unclosed comment inside fence (FR-8 ignored)\n"
        "```\t\n"
        "```~\n"
        "```\n"
        "Cites FR-10.\n"
    )
    assert report(text)["undefined"] == {
        "FR-9": ["doc0.md:5"],
        "FR-10": ["doc0.md:11"],
    }


def test_inherited_parent_sources_and_context_files(tmp_path, capsys):
    (tmp_path / "_bmad").mkdir()
    parent_dir = tmp_path / "_bmad-output" / "initiative-app" / "prd-app"
    epic_dir = tmp_path / "_bmad-output" / "initiative-app" / "tickets" / "epic-01" / "prd-epic-one"
    parent_dir.mkdir(parents=True)
    epic_dir.mkdir(parents=True)

    parent = parent_dir / "prd-app.md"
    parent.write_text(
        "---\ntitle: Parent PRD\n---\n\n"
        "| ID | Measure |\n|---|---|\n| `OKR-1` | Activation |\n\n"
        "- **INV-1**: Tenant isolation holds.\n"
        "- **BR-1**: Signed consent required.\n"
        "- **BR-2**: Audit log kept 7 years.\n"
        "- **OQ-7.** Withdrawn: resolved earlier.\n",
        encoding="utf-8",
    )

    child = epic_dir / "prd-epic-one.md"
    child.write_text(
        "---\n"
        "title: Child Epic PRD\n"
        "sources:\n"
        "  - _bmad-output/initiative-app/prd-app/prd-app.md#e01\n"
        "  - https://example.com/external-spec.md\n"
        "  - missing-optional-source.md\n"
        "---\n\n"
        "- **OKR-2**: Epic target builds on OKR-1 and broken OKR-99.\n"
        "- **E01-FR-01**: Respects INV-1 and cites deprecated OQ-7.\n\n"
        "| ID | Note |\n|---|---|\n| BR-1 | Trace 1 |\n| BR-2 | Trace 2 |\n",
        encoding="utf-8",
    )

    assert check_ids.main([str(child)]) == 0
    found = json.loads(capsys.readouterr().out)
    assert found["undefined"] == {"OKR-99": [f"{child}:9"]}
    assert found["duplicate"] == {}
    assert found["withdrawn"] == {"OQ-7": [f"{child}:10"]}
    assert found["counts"] == {
        "E01-FR": {"defined": 1, "referenced": 0},
        "OKR": {"defined": 1, "referenced": 2},
    }

    assert check_ids.main([str(child), "--context", str(tmp_path / "absent.md")]) == 2
    assert "not found" in capsys.readouterr().err
