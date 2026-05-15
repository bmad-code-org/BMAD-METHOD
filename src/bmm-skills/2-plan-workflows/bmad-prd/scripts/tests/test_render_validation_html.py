#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Unit tests for render-validation-html.py.

Run from the skill root:
    python3 -m unittest scripts/tests/test_render_validation_html.py
"""

import importlib.util
import sys
import unittest
from pathlib import Path

# Load the sibling module via importlib because its filename has a hyphen.
SCRIPT_PATH = Path(__file__).resolve().parents[1] / "render-validation-html.py"
spec = importlib.util.spec_from_file_location("render_validation_html", SCRIPT_PATH)
rvh = importlib.util.module_from_spec(spec)
sys.modules["render_validation_html"] = rvh
spec.loader.exec_module(rvh)


class CategoryForTests(unittest.TestCase):
    def test_explicit_category_wins(self):
        self.assertEqual(rvh.category_for({"id": "Q-1", "category": "Custom"}), "Custom")

    def test_known_prefixes_map(self):
        self.assertEqual(rvh.category_for({"id": "Q-3"}), "Quality")
        self.assertEqual(rvh.category_for({"id": "D-2"}), "Discipline")
        self.assertEqual(rvh.category_for({"id": "S-1"}), "Structural integrity")
        self.assertEqual(rvh.category_for({"id": "STK-1"}), "Stakes-gated")
        self.assertEqual(rvh.category_for({"id": "M-9"}), "Mechanical")

    def test_unknown_prefix_falls_through(self):
        self.assertEqual(rvh.category_for({"id": "X-1"}), "X")

    def test_id_without_hyphen_used_directly(self):
        self.assertEqual(rvh.category_for({"id": "FOO"}), "FOO")

    def test_empty_id_yields_other(self):
        self.assertEqual(rvh.category_for({}), "Other")


class GradeThresholdTests(unittest.TestCase):
    def _stats(self, **kw):
        base = {"total": 0, "passed": 0, "warned": 0, "failed": 0, "na": 0,
                "failed_critical": 0, "failed_high": 0}
        base.update(kw)
        return base

    def test_any_critical_fail_is_poor(self):
        grade, cls = rvh.grade_from(self._stats(failed=1, failed_critical=1))
        self.assertEqual(grade, "Poor")
        self.assertEqual(cls, "grade-poor")

    def test_single_high_fail_is_fair(self):
        grade, _ = rvh.grade_from(self._stats(failed=1, failed_high=1))
        self.assertEqual(grade, "Fair")

    def test_four_failures_is_fair_even_without_high(self):
        grade, _ = rvh.grade_from(self._stats(failed=4))
        self.assertEqual(grade, "Fair")

    def test_three_failures_no_high_is_good(self):
        grade, _ = rvh.grade_from(self._stats(failed=3))
        self.assertEqual(grade, "Good")

    def test_many_warnings_drops_to_good(self):
        grade, _ = rvh.grade_from(self._stats(warned=3))
        self.assertEqual(grade, "Good")

    def test_clean_run_is_excellent(self):
        grade, cls = rvh.grade_from(self._stats(passed=10))
        self.assertEqual(grade, "Excellent")
        self.assertEqual(cls, "grade-excellent")

    def test_two_warnings_still_excellent(self):
        grade, _ = rvh.grade_from(self._stats(passed=5, warned=2))
        self.assertEqual(grade, "Excellent")


class ComputeStatsTests(unittest.TestCase):
    def test_counts_by_status_and_severity(self):
        findings = [
            {"status": "pass"},
            {"status": "warn"},
            {"status": "fail", "severity": "critical"},
            {"status": "fail", "severity": "high"},
            {"status": "fail", "severity": "low"},
            {"status": "n/a"},
        ]
        stats = rvh.compute_stats(findings)
        self.assertEqual(stats["total"], 6)
        self.assertEqual(stats["passed"], 1)
        self.assertEqual(stats["warned"], 1)
        self.assertEqual(stats["failed"], 3)
        self.assertEqual(stats["na"], 1)
        self.assertEqual(stats["failed_critical"], 1)
        self.assertEqual(stats["failed_high"], 1)

    def test_missing_status_treated_as_na(self):
        stats = rvh.compute_stats([{}, {}])
        self.assertEqual(stats["na"], 2)

    def test_empty_findings(self):
        stats = rvh.compute_stats([])
        self.assertEqual(stats["total"], 0)


class ScoreBarTests(unittest.TestCase):
    def test_renders_svg_with_four_segments(self):
        stats = {"total": 4, "passed": 1, "warned": 1, "failed": 1, "na": 1}
        svg = rvh.render_score_bar(stats, width=400, height=20)
        self.assertIn("<svg", svg)
        self.assertEqual(svg.count("<rect"), 4)
        self.assertIn('fill="#22c55e"', svg)  # pass
        self.assertIn('fill="#eab308"', svg)  # warn
        self.assertIn('fill="#ef4444"', svg)  # fail
        self.assertIn('fill="#94a3b8"', svg)  # n/a

    def test_zero_total_does_not_divide_by_zero(self):
        stats = {"total": 0, "passed": 0, "warned": 0, "failed": 0, "na": 0}
        svg = rvh.render_score_bar(stats)
        self.assertIn("<svg", svg)
        self.assertEqual(svg.count("<rect"), 4)


if __name__ == "__main__":
    unittest.main()
