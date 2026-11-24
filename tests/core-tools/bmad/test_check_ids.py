# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0", "pyyaml>=6.0.2"]
# ///
"""Tests for bmad check_ids.py. Run: uv run --frozen python -B -m pytest tests/core-tools/bmad/test_check_ids.py"""

import importlib.util
import json
import sys
from pathlib import Path

import pytest

SCRIPTS_DIR = Path(__file__).resolve().parents[3] / "skills/core-tools/bmad/scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

_SPEC = importlib.util.spec_from_file_location("check_ids", SCRIPTS_DIR / "check_ids.py")
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

    epic = (
        "- **E02-FR-01**: A.\n"
        "- **E02-FR-02**: B.\n"
        "- **E02-FR-03**: C.\n\n"
        "Covered by E02-FR-01 to E02-FR-03, and E02-FR-09.\n"
    )
    epic_res = report(epic)
    assert epic_res["counts"]["E02-FR"] == {"defined": 3, "referenced": 4}
    assert epic_res["undefined"] == {"E02-FR-09": ["doc0.md:5"]}

    assert (
        report("- **E02-FR-01**: A.\n- **E02-FR-02**: B.\n- **E02-FR-03**: C.\n\nE02-FR-01 to E02-FR-03.\n")[
            "undefined"
        ]
        == {}
    )


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
        "unresolved_sources": [],
        "counts": {
            "INV": {"defined": 3, "referenced": 0},
            "OKR": {"defined": 2, "referenced": 2},
        },
    }


def test_fence_suffix_inline_code_and_unclosed_comment_interplay():
    text = (
        "- **FR-1**: Remove the `<!--` prefix.\n"
        "Use <!-- unclosed marker literally.\n"
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
        "FR-9": ["doc0.md:6"],
        "FR-10": ["doc0.md:12"],
    }


def test_child_table_and_parent_collision_detection(tmp_path, capsys):
    (tmp_path / "_bmad").mkdir()
    parent = tmp_path / "parent.md"
    parent.write_text(
        "---\ntitle: Parent PRD\n---\n\n"
        "| ID | Measure |\n|---|---|\n| OKR-1 | Activation |\n| OKR-2 | Retention |\n\n"
        "- **INV-1**: Tenant isolation holds.\n",
        encoding="utf-8",
    )
    child = tmp_path / "child.md"
    child.write_text(
        "---\n"
        "title: Child PRD\n"
        "sources:\n"
        '  - "{project-root}/parent.md"\n'
        "---\n\n"
        "| ID | Measure |\n|---|---|\n"
        "| OKR-1 | Redefined |\n"
        "| OKR-2 | Redefined |\n"
        "| OKR-3 | New child okr |\n\n"
        "- **INV-1**: Redefined invariant.\n",
        encoding="utf-8",
    )

    assert check_ids.main([str(child)]) == 0
    found = json.loads(capsys.readouterr().out)
    assert found["undefined"] == {}
    assert found["unresolved_sources"] == []
    assert found["duplicate"] == {
        "INV-1": [f"{parent}:10", f"{child}:13"],
        "OKR-1": [f"{parent}:7", f"{child}:9"],
        "OKR-2": [f"{parent}:8", f"{child}:10"],
    }
    assert found["counts"]["OKR"] == {"defined": 3, "referenced": 0}


def test_sources_scalar_mapping_project_root_and_unresolved(tmp_path, capsys):
    (tmp_path / "_bmad").mkdir()
    parent_dir = tmp_path / "out"
    parent_dir.mkdir()
    parent = parent_dir / "parent.md"
    parent.write_text(
        "---\ntitle: Parent\n---\n\n- **OKR-1**: Speed.\n- **OQ-7.** Withdrawn: old.\n",
        encoding="utf-8",
    )

    # Scalar source string resolves cleanly.
    child_scalar = tmp_path / "child-scalar.md"
    child_scalar.write_text(
        "---\ntitle: Scalar\nsources: out/parent.md\n---\n\n- **E01-FR-01**: Moves OKR-1, breaks OKR-9, cites OQ-7.\n",
        encoding="utf-8",
    )
    assert check_ids.main([str(child_scalar)]) == 0
    scalar_res = json.loads(capsys.readouterr().out)
    assert scalar_res["unresolved_sources"] == []
    assert scalar_res["undefined"] == {"OKR-9": [f"{child_scalar}:6"]}
    assert scalar_res["withdrawn"] == {"OQ-7": [f"{child_scalar}:6"]}

    # Mapping source + unresolved local markdown path + known planning prefix catch when parent missing.
    child_broken = tmp_path / "child-broken.md"
    child_broken.write_text(
        "---\n"
        "title: Broken\n"
        "sources:\n"
        '  - path: "{project-root}/out/missing-parent.md"\n'
        "  - https://example.com/spec.md\n"
        "---\n\n"
        "- **E01-FR-01**: Cites OKR-9 and INV-7.\n",
        encoding="utf-8",
    )
    assert check_ids.main([str(child_broken)]) == 0
    broken_res = json.loads(capsys.readouterr().out)
    assert broken_res["unresolved_sources"] == [
        {"source": "{project-root}/out/missing-parent.md", "document": str(child_broken)}
    ]
    assert broken_res["undefined"] == {
        "INV-7": [f"{child_broken}:8"],
        "OKR-9": [f"{child_broken}:8"],
    }


def test_cli_json_and_exit_codes(tmp_path, capsys):
    doc = tmp_path / "prd.md"
    doc.write_text(DOC, encoding="utf-8")
    assert check_ids.main([str(doc)]) == 0
    assert json.loads(capsys.readouterr().out)["undefined"] == {"FR-9": [f"{doc}:17"]}

    assert check_ids.main([str(doc), str(tmp_path / "absent.md")]) == 2
    assert "not found" in capsys.readouterr().err

    assert check_ids.main([str(doc), "--context", str(tmp_path / "absent.md")]) == 2
    assert "not found" in capsys.readouterr().err

    with pytest.raises(SystemExit) as help_exc:
        check_ids.main(["--help"])
    assert help_exc.value.code == 0

    with pytest.raises(SystemExit) as empty_exc:
        check_ids.main([])
    assert empty_exc.value.code == 2
