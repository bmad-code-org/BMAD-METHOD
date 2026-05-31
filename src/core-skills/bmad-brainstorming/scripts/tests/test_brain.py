# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for brain.py. Run: uv run -m pytest scripts/tests/test_brain.py"""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import brain  # noqa: E402

CSV = """category,technique_name,description,detail
collaborative,Yes And Building,Build on every idea with "yes and" to keep momentum,
wild,Quantum Superposition,Hold contradictory ideas as simultaneously true,techniques/quantum.md
structured,SCAMPER Method,Run the idea through seven transformation lenses,
wild,Anti-Solution,Brainstorm how to make the problem worse then invert,
"""

DETAIL = "# Quantum Superposition\nFull multi-step instructions for the complex technique."


@pytest.fixture
def lib(tmp_path):
    csv_path = tmp_path / "brain-methods.csv"
    csv_path.write_text(CSV, encoding="utf-8")
    (tmp_path / "techniques").mkdir()
    (tmp_path / "techniques" / "quantum.md").write_text(DETAIL, encoding="utf-8")
    return csv_path


def test_load_normalizes_detail(lib):
    rows = brain.load(lib)
    assert len(rows) == 4
    assert rows[0]["detail"] == ""
    assert rows[1]["detail"] == "techniques/quantum.md"


def test_categories_counts_sorted(lib):
    assert brain.categories(brain.load(lib)) == [("collaborative", 1), ("structured", 1), ("wild", 2)]


def test_filter_is_case_insensitive(lib):
    rows = brain.filter_cats(brain.load(lib), ["WILD"])
    assert {r["technique_name"] for r in rows} == {"Quantum Superposition", "Anti-Solution"}


def test_filter_none_returns_all(lib):
    assert len(brain.filter_cats(brain.load(lib), None)) == 4


def test_find_hits_and_misses(lib):
    found, missing = brain.find(brain.load(lib), ["scamper method", "Nope"])
    assert [r["technique_name"] for r in found] == ["SCAMPER Method"]
    assert missing == ["Nope"]


def test_resolve_detail_present(lib):
    row = next(r for r in brain.load(lib) if r["detail"])
    assert "multi-step instructions" in brain.resolve_detail(row, lib.parent)


def test_resolve_detail_absent_is_none(lib):
    row = next(r for r in brain.load(lib) if not r["detail"])
    assert brain.resolve_detail(row, lib.parent) is None


def test_resolve_detail_missing_file_warns_not_fatal(lib, capsys):
    rows = brain.load(lib)
    rows[1]["detail"] = "techniques/gone.md"
    assert brain.resolve_detail(rows[1], lib.parent) is None
    assert "not found" in capsys.readouterr().err


def test_show_inlines_detail(lib, capsys):
    assert brain.main(["--file", str(lib), "show", "Quantum Superposition"]) == 0
    out = capsys.readouterr().out
    assert "multi-step instructions" in out and "[wild]" in out


def test_show_simple_has_no_detail(lib, capsys):
    brain.main(["--file", str(lib), "show", "SCAMPER Method"])
    out = capsys.readouterr().out
    assert "transformation lenses" in out


def test_show_all_missing_returns_1(lib):
    assert brain.main(["--file", str(lib), "show", "Ghost"]) == 1


def test_list_filtered_text(lib, capsys):
    brain.main(["--file", str(lib), "list", "--category", "structured"])
    out = capsys.readouterr().out.strip().splitlines()
    assert len(out) == 1 and out[0].startswith("structured\tSCAMPER Method\t")


def test_list_bare_is_refused(lib, capsys):
    # the footgun: bare `list` must NOT dump the catalog into context
    assert brain.main(["--file", str(lib), "list"]) == 2
    captured = capsys.readouterr()
    assert captured.out == ""  # nothing leaked to stdout
    assert "--category" in captured.err and "--all" in captured.err


def test_list_all_dumps_everything(lib, capsys):
    assert brain.main(["--file", str(lib), "list", "--all"]) == 0
    out = capsys.readouterr().out.strip().splitlines()
    assert len(out) == 4  # the deliberate full-catalog escape hatch


def test_json_output(lib, capsys):
    import json
    brain.main(["--file", str(lib), "--json", "categories"])
    data = json.loads(capsys.readouterr().out)
    assert {"category": "wild", "count": 2} in data


def test_random_respects_n_and_category(lib, capsys):
    brain.main(["--file", str(lib), "random", "--category", "wild", "-n", "5"])
    lines = capsys.readouterr().out.strip().splitlines()
    assert len(lines) == 2  # only 2 wild exist, n capped
    assert all(l.startswith("wild\t") for l in lines)


def test_missing_file_returns_2(tmp_path):
    assert brain.main(["--file", str(tmp_path / "nope.csv"), "categories"]) == 2
