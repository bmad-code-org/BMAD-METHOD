#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Tests for recon_kit.py."""

import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from datetime import date
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import recon_kit
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


SESSION_OLD = """class SessionStore:
    def load(self, key):
        return self.cache[key]

    def evict(self, key):
        del self.cache[key]
"""

# load moves from line 2 to line 5; evict and the old return line are gone.
SESSION_NEW = """import os


class SessionStore:
    def load(self, key):
        return self.cache.get(key)
"""


def git(repo, *args):
    """git in a fixture repository, shut off from the machine's config and from a hook's GIT_DIR."""
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    env.update(GIT_CONFIG_GLOBAL=os.devnull, GIT_CONFIG_NOSYSTEM="1")
    ident = ["-c", "user.name=test", "-c", "user.email=test@example.com", "-c", "commit.gpgsign=false"]
    proc = subprocess.run(["git", *ident, *args], cwd=repo, env=env, capture_output=True, text=True, check=True)
    return proc.stdout.strip()


@unittest.skipUnless(shutil.which("git"), "git is not on PATH")
class AnchorsTest(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.report = Path(tmp.name) / "report.md"
        self.repo = Path(tmp.name) / "repo"
        self.repo.mkdir()
        git(self.repo, "init", "-q")
        self.old = self.commit(
            "add session store",
            {
                "README.md": "# demo\n",
                "app/[id]/page.tsx": "export default Page\n",
                "app/(site)/page.tsx": "export default Page\n",
                "app/i/page.tsx": "a\n",
                "src/legacy.py": "def old():\n    pass\n",
                "src/session.py": SESSION_OLD,
            },
        )
        (self.repo / "src" / "legacy.py").unlink()
        # app/i/page.tsx changes too: read as a glob, app/[id]/page.tsx would match it.
        self.new = self.commit("Make eviction one-way (#412)", {"src/session.py": SESSION_NEW, "app/i/page.tsx": "b\n"})

    def commit(self, subject, files):
        for name, text in files.items():
            path = self.repo / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8", newline="\n")
        git(self.repo, "add", "-A")
        git(self.repo, "commit", "-q", "-m", subject)
        return git(self.repo, "rev-parse", "HEAD")

    def anchors(self, doc, *extra):
        self.report.write_text(doc, encoding="utf-8")
        return run(["anchors", str(self.report), "--repo", str(self.repo), *extra])

    def test_an_unchanged_file_is_anchored(self):
        old = self.old[:7]
        doc = (
            f"`README.md:1 (title) @ {old}` `app/[id]/page.tsx:1 (Page) @ {old}` (app/(site)/page.tsx:1 (Page) @ {old})"
        )
        self.report.write_text(doc, encoding="utf-8")
        code, result = run(["anchors", str(self.report), "--repo", str(self.repo / "src")])
        readme, page, group = result["code"]
        self.assertEqual(
            (readme["status"], readme["line_text"], readme["changed_since"], readme["head_line"]),
            ("anchored", "# demo", False, 1),
        )
        self.assertEqual(
            (page["status"], group["path"], group["status"]), ("anchored", "app/(site)/page.tsx", "anchored")
        )
        self.assertTrue(Path(result["repo"]).samefile(self.repo))  # found from a subfolder
        self.assertEqual(result["at"], self.new)
        self.assertEqual(code, 0)

    def test_a_moved_line_is_found_at_head(self):
        doc = f"`src/session.py:2-3 (SessionStore.load) @ {self.old[:7]}`\n"
        code, result = self.anchors(doc)
        claim = result["code"][0]
        self.assertEqual(
            (claim["status"], claim["end_line"], claim["line_text"], claim["head_line"]),
            ("moved", 3, "def load(self, key):", 5),
        )
        self.assertEqual(code, 0)
        code, result = self.anchors(doc, "--at", self.old[:7])
        self.assertEqual((result["at"], result["code"][0]["status"]), (self.old, "anchored"))

    def test_a_moved_range_is_matched_whole_before_its_first_line(self):
        models = "class A:\n    def __init__(self):\n        self.a = 1\n\n\nclass B:\n    def __init__(self):\n        self.b = 2\n"
        cited = self.commit("add models", {"src/models.py": models})[:7]
        self.commit("import os in models", {"src/models.py": "import os\n\n\n" + models})
        code, result = self.anchors(f"`src/models.py:7-8 (B.__init__) @ {cited}` `src/models.py:8-7 (B) @ {cited}`")
        self.assertEqual(
            [(c["status"], c["line_text"], c["head_line"]) for c in result["code"]],
            [("moved", "def __init__(self):", 10), ("moved", "self.b = 2", 11)],
        )
        self.assertEqual(code, 0)

    def test_head_line_is_null_when_the_text_or_the_file_is_gone(self):
        old = self.old[:7]
        code, result = self.anchors(f"`src/session.py:5 (SessionStore.evict) @ {old}` `src/legacy.py:1 (old) @ {old}`")
        self.assertEqual(
            [(c["path"], c["status"], c["head_line"]) for c in result["code"]],
            [("src/session.py", "moved", None), ("src/legacy.py", "moved", None)],
        )
        self.assertEqual(code, 0)

    def test_missing_files_lines_and_commits_exit_1(self):
        old = self.old[:7]
        code, result = self.anchors(
            f"`src/nope.py:1 (gone) @ {old}`, `src/session.py:7 (past) @ {old}`, "
            f"`src/session.py:6-9 (SessionStore.evict) @ {old}`"
        )
        self.assertEqual([c["status"] for c in result["code"]], ["missing"] * 3)
        self.assertEqual(code, 1)
        code, result = self.anchors('`README.md:1 (title) @ deadbeef` and `deadbeef "never made"`')
        self.assertEqual([c["status"] for c in result["code"] + result["history"]], ["unknown-commit"] * 2)
        self.assertEqual(result["counts"]["unknown_commit"], 2)
        self.assertEqual(code, 1)

    def test_a_cited_path_is_normalized_for_git_and_reported_as_written(self):
        old = self.old[:7]
        code, result = self.anchors(
            f"`src/../README.md:1 (title) @ {old}` `app/./[id]/page.tsx:1 (Page) @ {old}` "
            f"`src/../../repo/README.md:1 (title) @ {old}`"
        )
        self.assertEqual(
            [(c["path"], c["status"]) for c in result["code"]],
            [
                ("src/../README.md", "anchored"),
                ("app/./[id]/page.tsx", "anchored"),
                ("src/../../repo/README.md", "missing"),  # normalizes to ../repo, outside the repository
            ],
        )
        self.assertEqual(code, 1)

    def test_history_subjects_match_exactly_or_as_a_prefix(self):
        old, new = self.old[:7], self.new[:7]
        code, result = self.anchors(f'Added in `{old} "add session store"`, then `{new} "make eviction" #412`.')
        exact, prefix = result["history"]
        self.assertEqual((exact["status"], exact["actual_pr"]), ("anchored", None))
        self.assertEqual(
            (prefix["status"], prefix["pr"], prefix["actual_subject"], prefix["actual_pr"]),
            ("anchored", 412, "Make eviction one-way (#412)", 412),
        )
        self.assertEqual(code, 0)
        code, result = self.anchors(f'`{old} "add the session cache"`')
        self.assertEqual(result["history"][0]["status"], "subject-mismatch")
        self.assertEqual(code, 1)

    def test_a_quote_after_a_code_claim_sha_is_not_a_history_claim(self):
        old, new = self.old[:7], self.new[:7]
        code, result = self.anchors(
            f'README.md:1 (title) @ {old} "the title"\n{old} "add session store"\nThen `{new} "make eviction" #412`.\n'
        )
        self.assertEqual([c["path"] for c in result["code"]], ["README.md"])
        self.assertEqual(
            [(h["subject"], h["pr"]) for h in result["history"]], [("add session store", None), ("make eviction", 412)]
        )
        self.assertEqual(code, 0)

    def test_fenced_claims_count_and_duplicates_are_listed_once(self):
        old = self.old[:7]
        claim = f"README.md:1 (title) @ {old}"
        code, result = self.anchors(f'See `{claim}`.\n\n```text\n{claim}\n{old} "add session store"\n```\n')
        self.assertEqual([c["occurrences"] for c in result["code"]], [2])
        self.assertEqual(result["history"][0]["status"], "anchored")  # cited only inside the fence
        self.assertEqual(code, 0)

    def test_stdin(self):
        doc = f"`README.md:1 (title) @ {self.old[:7]}`\n"
        original = sys.stdin
        sys.stdin = io.TextIOWrapper(io.BytesIO(doc.encode("utf-8")))
        try:
            code, result = run(["anchors", "-", "--repo", str(self.repo)])
        finally:
            sys.stdin = original
        self.assertEqual((result["file"], result["code"][0]["status"]), ("-", "anchored"))
        self.assertEqual(code, 0)

    def test_no_claims_exit_0_and_usage_errors_exit_2(self):
        code, result = self.anchors("No citations here.\n")
        self.assertEqual((result["code"], result["history"], code), ([], [], 0))
        plain = self.repo.parent / "plain"
        plain.mkdir()
        for repo, at in ((plain, "HEAD"), (self.repo, "no-such-rev")):
            err = io.StringIO()
            with redirect_stderr(err), redirect_stdout(io.StringIO()):
                code = main(["anchors", str(self.report), "--repo", str(repo), "--at", at])
            self.assertEqual(code, 2, repo)
            self.assertTrue(err.getvalue().startswith("error: "), repo)

    def test_dash_ranges_and_curly_quoted_subjects_parse(self):
        old = self.old[:7]
        code, result = self.anchors(
            f"`src/session.py:2\u20133 (SessionStore.load) @ {old}`, `src/session.py:5\u20146 (SessionStore.evict) @ {old}`"
            f" and {old} \u201cadd session store\u201d.",
            "--at",
            old,
        )
        self.assertEqual(
            [(c["line"], c["end_line"], c["status"]) for c in result["code"]], [(2, 3, "anchored"), (5, 6, "anchored")]
        )
        self.assertEqual([(h["subject"], h["status"]) for h in result["history"]], [("add session store", "anchored")])
        self.assertEqual((result["unparsed"], code), ([], 0))

    def test_citation_shaped_text_no_claim_matched_is_unparsed(self):
        old = self.old[:7]
        code, result = self.anchors(
            "Not citations: https://example.com:8080/a/b.py:3, localhost:3000, 127.0.0.1:8080, 10:30\u201311:00,\n"
            f"`uses: actions/checkout@{self.old}`, dev@{old}.io.\n"
            f"No commit `src/session.py:2`, a range `config/app.yaml:4\u20136 @ {old}`, empty `src/session.py:2 ()`.\n"
            f"No path shape `Dockerfile:3 @ {old}`, `src/session.py:2 (load()) @ {old}`, `src/session.py:2:5 (load) @ {old}`.\n"
            f"Upper case `README.md:1 (title) @ ABCDEF0`, single quotes {old} \u2018add session store\u2019.\n"
        )
        self.assertEqual(
            [(u["line"], u["text"]) for u in result["unparsed"]],
            [
                (3, "src/session.py:2"),
                (3, f"config/app.yaml:4\u20136 @ {old}"),
                (3, "src/session.py:2 ()"),
                (4, f"@ {old}"),
                (4, f"src/session.py:2 (load()) @ {old}"),
                (4, f"src/session.py:2:5 (load) @ {old}"),
                (5, "README.md:1 (title) @ ABCDEF0"),
                (5, f"{old} \u2018add session store\u2019"),
            ],
        )
        self.assertEqual((result["code"], result["history"], result["counts"]["unparsed"], code), ([], [], 8, 1))

    def test_an_empty_symbol_is_incomplete(self):
        old = self.old[:7]
        code, result = self.anchors(
            f"`README.md:1 () @ {old}` `src/session.py:2 ( ) @ {old}` `README.md:1 () @ deadbeef`"
        )
        self.assertEqual(
            [(c["status"], c["line_text"]) for c in result["code"]],
            [("incomplete", "# demo"), ("incomplete", "def load(self, key):"), ("unknown-commit", None)],
        )
        self.assertEqual(code, 1)
        self.assertEqual((result["counts"]["incomplete"], result["unparsed"]), (2, []))
        self.assertEqual([c["symbol_found"] for c in result["code"]], [False, False, None])

    def test_a_path_with_spaces_parses_whole_and_words_before_it_are_left_out(self):
        spaced = self.commit("add a spaced file", {"src/My File.java": "class A {\n  void load() {}\n}\n"})[:7]
        old = self.old[:7]
        code, result = self.anchors(
            f"`src/My File.java:2 (A.load) @ {spaced}`\nThe loader in src/My File.java:2 (A.load) @ {spaced} reads it, "
            f"as does src/session.py:2 (SessionStore.load) @ {old}. Gone: src/No File.java:1 (A) @ {spaced}."
        )
        self.assertEqual(
            [(c["path"], c["status"], c["occurrences"]) for c in result["code"]],
            [("src/My File.java", "anchored", 2), ("src/session.py", "moved", 1), ("File.java", "missing", 1)],
        )
        self.assertEqual((result["unparsed"], code), ([], 1))

    def test_a_subject_with_a_quoted_phrase_parses_whole_with_its_pr(self):
        quoted = self.commit('fix: handle "cached" sessions (#412)', {"README.md": "# demo 2\n"})[:7]
        code, result = self.anchors(
            f'`{quoted} "fix: handle "cached" sessions (#412)" #412` and then {quoted} "fix: handle "cached" sessions" #412 '
            f'landed. Reverted in `{self.old[:7]} "add session store"`.'
        )
        self.assertEqual(
            [(h["subject"], h["pr"], h["status"]) for h in result["history"]],
            [
                ('fix: handle "cached" sessions (#412)', 412, "anchored"),
                ('fix: handle "cached" sessions', 412, "anchored"),
                ("add session store", None, "anchored"),
            ],
        )
        self.assertEqual((result["unparsed"], code), ([], 0))

    def test_a_subject_ending_in_a_pr_needs_the_citation_to_name_it(self):
        old, new = self.old[:7], self.new[:7]
        code, result = self.anchors(
            f'`{new} "Make eviction one-way"` `{new} "Make eviction one-way" #999` `{new} "Make eviction one-way (#412)"` '
            f'`{new} "Make eviction one-way (#412)" #999` `{old} "add session store" #7`'
        )
        self.assertEqual(
            [(h["status"], h["actual_pr"]) for h in result["history"]],
            [("pr-mismatch", 412), ("pr-mismatch", 412), ("anchored", 412), ("pr-mismatch", 412), ("anchored", None)],
        )
        self.assertEqual((result["counts"]["pr_mismatch"], code), (3, 1))

    def test_symbol_found_is_reported_and_never_fails_the_run(self):
        big = self.commit("add a long file", {"src/big.py": "def target():\n" + "    pass\n" * 90})[:7]
        old = self.old[:7]
        code, result = self.anchors(
            f"`src/big.py:81 (target) @ {big}` `src/big.py:82 (target) @ {big}` "
            f"`src/session.py:3 (SessionStore.load) @ {old}` `src/session.py:2 (SessionStore.loa) @ {old}` "
            f"`README.md:1 (title) @ {old}`"
        )
        self.assertEqual(
            [(c["status"], c["symbol_found"]) for c in result["code"]],
            [("anchored", True), ("anchored", False), ("moved", True), ("moved", False), ("anchored", False)],
        )
        self.assertEqual(code, 0)
        code, result = self.anchors(f"`src/nope.py:1 (target) @ {old}` `README.md:1 (title) @ deadbeef`")
        self.assertEqual([c["symbol_found"] for c in result["code"]], [None, None])

    def test_git_errors_other_than_a_missing_object_exit_2(self):
        real_git = recon_kit.git
        self.report.write_text(
            f'`src/session.py:2 (load) @ {self.old[:7]}` `{self.new[:7]} "Make eviction one-way" #412`',
            encoding="utf-8",
        )
        for failing in ("-e", "blob", "diff", "log"):

            def offline(repo, *args, failing=failing):
                if failing in args:
                    stderr = "fatal: could not fetch 3f2a9c1 from promisor remote\n"
                    return subprocess.CompletedProcess(["git", *args], 128, "", stderr)
                return real_git(repo, *args)

            err = io.StringIO()
            with self.subTest(failing), mock.patch.object(recon_kit, "git", offline):
                with redirect_stderr(err), redirect_stdout(io.StringIO()):
                    code = main(["anchors", str(self.report), "--repo", str(self.repo)])
                self.assertEqual(code, 2)
                self.assertTrue(err.getvalue().startswith("error: git "))
                self.assertIn("could not fetch 3f2a9c1 from promisor remote", err.getvalue())


if __name__ == "__main__":
    unittest.main()
