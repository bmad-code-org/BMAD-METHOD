# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for grade_spine.py. Run: uv run --with pytest pytest scripts/tests/test_grade_spine.py

The grade is a pure function of dimension verdicts and summed severity counts; each test
pins one branch of the ladder, plus the most-severe-wins precedence and the reviewer sum.
"""
import importlib.util
import sys
from pathlib import Path

import pytest

_SPEC = importlib.util.spec_from_file_location(
    "grade_spine", Path(__file__).resolve().parent.parent / "grade_spine.py"
)
grade_spine = importlib.util.module_from_spec(_SPEC)
sys.modules["grade_spine"] = grade_spine
_SPEC.loader.exec_module(grade_spine)

grade = grade_spine.grade
sum_severity = grade_spine.sum_severity

ALL_STRONG = {"consistency": "strong", "leanness": "adequate", "decisions": "strong"}


def test_excellent_all_strong_no_findings():
    assert grade(ALL_STRONG, {})["grade"] == "Excellent"


def test_good_one_thin():
    assert grade({"a": "strong", "b": "thin"}, {})["grade"] == "Good"


def test_fair_two_thin():
    assert grade({"a": "thin", "b": "thin"}, {})["grade"] == "Fair"


def test_fair_any_high():
    assert grade(ALL_STRONG, {"high": 1})["grade"] == "Fair"


def test_poor_any_critical():
    assert grade(ALL_STRONG, {"critical": 1})["grade"] == "Poor"


def test_poor_broken_dimension():
    assert grade({"a": "strong", "b": "broken"}, {})["grade"] == "Poor"


def test_critical_outranks_high_and_thin():
    assert grade({"a": "thin"}, {"critical": 1, "high": 3})["grade"] == "Poor"


def test_medium_and_low_do_not_lower_grade():
    assert grade(ALL_STRONG, {"medium": 5, "low": 9})["grade"] == "Excellent"


def test_sum_severity_across_reviewers():
    payload = {"reviewers": [
        {"slug": "rubric", "severity": {"high": 1}},
        {"slug": "divergence", "severity": {"high": 2, "critical": 1}},
    ]}
    assert sum_severity(payload) == {"critical": 1, "high": 3, "medium": 0, "low": 0}


def test_sum_severity_bare_fallback():
    assert sum_severity({"severity": {"medium": 2}}) == {"critical": 0, "high": 0, "medium": 2, "low": 0}


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-q"]))
