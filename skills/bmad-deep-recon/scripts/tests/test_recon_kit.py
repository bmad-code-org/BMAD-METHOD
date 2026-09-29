#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Tests for recon_kit.py."""

import io
import json
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from recon_kit import add_months, main, parse_date, slugify

REPORT = """---
title: 'market research: widgets'
---

# Report

The market is growing fast [1] and pricing clusters at $20 [2].
An uncited assertion sits here [4].

```
[9] inside a fence never counts
```

## Source appendix

| [n] | Supports | Publisher | Pub date | Accessed | Confidence |
| --- | --- | --- | --- | --- | --- |
| [1] | market growth | [Gartner](https://example.com/g) | 2026-01 | 2026-07-01 | high |
| [2] | pricing | [Acme](javascript:alert(1)) | 2026-05 | 2026-07-01 | medium |
| [3] | never cited | https://example.com/x | 2025-11 | 2026-07-01 | low |
"""

MEMLOG = """---
topic: widgets
updated: 2026-07-22T10:00
---

- (decision) plan approved
- (source) round 1 batch: 4 sources
- (claim) ref=[1] status=verified class=size/growth pub=2026-01 — market growing 12% CAGR
- (claim) ref=[2] status=unverified class=pricing pub=2026-05 — pricing clusters at $20
- (claim) ref=[2] status=verified class=pricing pub=2026-05 — confirmed by second source
- (claim) status=unverified class=behavior pub=2025-03 — users churn at day 8
- (event) dimension 1 complete
"""


def run(argv):
    buf = io.StringIO()
    with redirect_stdout(buf):
        code = main(argv)
    return code, json.loads(buf.getvalue())


class CitationsTest(unittest.TestCase):
    def test_cross_check(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = Path(tmp) / "report.md"
            report.write_text(REPORT, encoding="utf-8")
            code, result = run(["citations", str(report)])
        self.assertEqual(result["dangling_markers"], [4])
        self.assertEqual(result["orphaned_rows"], [3])
        self.assertNotIn(9, result["markers"])  # fenced content ignored
        self.assertEqual(code, 1)


def run_text(argv, text, name="report.md"):
    with tempfile.TemporaryDirectory() as tmp:
        f = Path(tmp) / name
        f.write_text(text, encoding="utf-8")
        return run([argv[0], str(f), *argv[1:]])


class CitationsEdgeTest(unittest.TestCase):
    def test_a_bare_number_table_is_not_the_source_appendix(self):
        text = (
            "Growth is fast [1].\n\n| Rank | Vendor |\n| --- | --- |\n| 1 | Acme |\n| 2 | Beta |\n| 3 | Gamma |\n\n"
            "| [n] | Supports |\n| --- | --- |\n| [1] | growth |\n"
        )
        code, result = run_text(["citations"], text)
        self.assertEqual(result["appendix_rows"], [1])
        self.assertTrue(result["ok"])
        self.assertEqual(code, 0)

    def test_tilde_and_long_backtick_fences(self):
        text = (
            "~~~\n[7] tilde fenced\n~~~\n\n"
            "````\n```\n[8] still fenced after an inner three-backtick line\n```\n````\n\n"
            "Read after the close [1].\n\n| [n] | Supports |\n| --- | --- |\n| [1] | x |\n"
        )
        code, result = run_text(["citations"], text)
        self.assertEqual(result["markers"], [1])
        self.assertTrue(result["ok"])

    def test_a_fence_nested_in_a_list_item_hides_its_markers(self):
        text = (
            "- Example:\n\n    ```\n    [5] inside a list-nested fence\n    ```\n\n"
            "Cited [1].\n\n| [n] | Supports |\n| --- | --- |\n| [1] | x |\n"
        )
        code, result = run_text(["citations"], text)
        self.assertEqual(result["markers"], [1])
        self.assertTrue(result["ok"])


class TallyTest(unittest.TestCase):
    def test_last_status_wins_per_ref(self):
        with tempfile.TemporaryDirectory() as tmp:
            log = Path(tmp) / "memlog.md"
            log.write_text(MEMLOG, encoding="utf-8")
            code, result = run(["tally", str(log)])
        self.assertEqual(result["by_type"]["claim"], 4)
        self.assertEqual(result["claims"], {"unverified": 1, "verified": 2})
        self.assertEqual(result["claims_total"], 3)  # ref=[2] counted once
        self.assertEqual(code, 0)


class StalenessTest(unittest.TestCase):
    def test_dates(self):
        self.assertEqual(parse_date("2026-01"), date(2026, 1, 1))
        self.assertEqual(add_months(date(2026, 1, 31), 1), date(2026, 2, 28))

    def test_windows(self):
        claims = json.dumps(
            [
                {"claim": "sizing", "class": "size/growth", "pub_date": "2024-06"},
                {"claim": "pricing", "class": "pricing", "pub_date": "2026-06"},
                {"claim": "odd", "class": "unmapped", "pub_date": "2026-06"},
            ]
        )
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / "claims.json"
            f.write_text(claims, encoding="utf-8")
            code, result = run(
                [
                    "staleness",
                    str(f),
                    "--windows",
                    '{"size/growth": 18, "pricing": 3}',
                    "--today",
                    "2026-07-22",
                ]
            )
        self.assertEqual(result["stale_count"], 1)  # sizing recheck 2025-12 < today
        self.assertEqual(result["earliest_recheck"], "2025-12-01")
        self.assertEqual(result["no_window_classes"], ["unmapped"])
        self.assertEqual(code, 1)

    def test_malformed_claims_exit_2(self):
        for payload in ('{"x": 1}', '{"claims": [5]}'):
            err = io.StringIO()
            with tempfile.TemporaryDirectory() as tmp:
                f = Path(tmp) / "claims.json"
                f.write_text(payload, encoding="utf-8")
                with redirect_stderr(err), redirect_stdout(io.StringIO()):
                    code = main(["staleness", str(f), "--windows", '{"pricing": 3}'])
            self.assertEqual(code, 2, payload)
            self.assertTrue(err.getvalue().startswith("error: "), payload)

    def test_stdin_is_read_as_utf8_whatever_the_locale(self):
        claims = json.dumps([{"claim": "café prices", "class": "pricing", "pub_date": "2026-06"}], ensure_ascii=False)
        stdin = io.TextIOWrapper(io.BytesIO(claims.encode("utf-8")), encoding="latin-1")
        original = sys.stdin
        sys.stdin = stdin
        try:
            code, result = run(["staleness", "-", "--windows", '{"pricing": 3}', "--today", "2026-07-01"])
        finally:
            sys.stdin = original
        self.assertEqual(result["claims"][0]["claim"], "café prices")
        self.assertEqual(code, 0)


class SlugTest(unittest.TestCase):
    def test_deterministic_folder(self):
        self.assertEqual(slugify("Créme Brûlée: AI Tools!"), "creme-brulee-ai-tools")
        code, result = run(["slug", "SMB Accounting SaaS", "--type", "market"])
        self.assertEqual(result["folder"], "research-smb-accounting-saas")
        self.assertEqual(code, 0)
        pattern = "{research_type}-{topic_slug}-{date}"
        code, result = run(
            ["slug", "SMB Accounting SaaS", "--type", "market", "--date", "2026-07-22", "--pattern", pattern]
        )
        self.assertEqual(result["folder"], "market-smb-accounting-saas-2026-07-22")
        self.assertEqual(code, 0)


class EscapeSourcesTest(unittest.TestCase):
    def test_escaping_and_url_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = Path(tmp) / "report.md"
            report.write_text(REPORT, encoding="utf-8")
            code, result = run(["escape-sources", str(report)])
        self.assertEqual(result["rows"], 3)
        self.assertTrue(any(u.startswith("javascript:") for u in result["invalid_urls"]))
        self.assertNotIn("javascript:", result["html"])  # never linked
        self.assertIn('href="https://example.com/g"', result["html"])
        self.assertIn('id="src-1"', result["html"])
        self.assertEqual(code, 1)

    def test_urls_keep_balanced_parentheses(self):
        text = (
            "| [n] | Supports | Publisher |\n| --- | --- | --- |\n"
            "| [1] | a | [Rust](https://en.wikipedia.org/wiki/Rust_(programming_language)) |\n"
            "| [2] | b | https://en.wikipedia.org/wiki/Go_(programming_language) |\n"
        )
        code, result = run_text(["escape-sources"], text)
        self.assertIn('href="https://en.wikipedia.org/wiki/Rust_(programming_language)"', result["html"])
        self.assertIn('href="https://en.wikipedia.org/wiki/Go_(programming_language)"', result["html"])
        self.assertEqual(result["invalid_urls"], [])
        self.assertEqual(code, 0)


if __name__ == "__main__":
    unittest.main()
