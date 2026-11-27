# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for creative_lint.py. Run: uv run --with pytest pytest tests/creative/bmad-creative-agent-director/test_creative_lint.py"""

from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SCRIPT_PATH = ROOT / "skills/creative/bmad-creative-agent-director/scripts/creative_lint.py"
STARTER_BLACKLIST = ROOT / "skills/creative/bmad-creative-agent-director/assets/blacklist-starter.md"

_SPEC = importlib.util.spec_from_file_location("creative_lint", SCRIPT_PATH)
assert _SPEC is not None and _SPEC.loader is not None
creative_lint = importlib.util.module_from_spec(_SPEC)
sys.modules["creative_lint"] = creative_lint
_SPEC.loader.exec_module(creative_lint)


def invoke(*argv: str) -> tuple[int, dict | None, str]:
    stdout_buf = io.StringIO()
    stderr_buf = io.StringIO()
    code = 0
    with contextlib.redirect_stdout(stdout_buf), contextlib.redirect_stderr(stderr_buf):
        try:
            code = creative_lint.main(list(argv))
        except SystemExit as exc:
            code = int(exc.code) if isinstance(exc.code, int) else 1
    out = stdout_buf.getvalue().strip()
    payload = json.loads(out) if out else None
    return code, payload, stderr_buf.getvalue()


class CreativeLintTests(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp = Path(self._tmp.name)
        self.blacklist = self.tmp / "blacklist.md"
        self.blacklist.write_text(
            "# Test Blacklist\n\n"
            "```regex\n"
            "# scope: all\n"
            "\\bdelve\\b\n"
            "\\bgame.?changer\\b\n"
            "```\n\n"
            "```regex\n"
            "# scope: spoken\n"
            "—\n"
            "```\n\n"
            "```regex\n"
            "# scope: written\n"
            "\\bclick below\\b\n"
            "```\n",
            encoding="utf-8",
        )

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def write(self, name: str, content: str) -> Path:
        path = self.tmp / name
        path.write_text(content, encoding="utf-8")
        return path

    def test_lint_clean_draft_exits_zero(self) -> None:
        draft = self.write("clean.md", "---\ntitle: Test\n---\nThis script uses plain direct speech.\n")
        code, data, err = invoke("lint", str(draft), "--blacklist", str(self.blacklist))
        self.assertEqual(code, 0, err)
        assert data is not None
        self.assertTrue(data["ok"])
        self.assertEqual(data["blocking_count"], 0)
        self.assertEqual(data["advisory_count"], 0)
        self.assertEqual(data["patterns_checked"], 4)

    def test_lint_spoken_blocks_em_dash_and_reports_exact_file_line(self) -> None:
        draft = self.write(
            "spoken.md",
            "---\ntitle: Talk — ignored\n---\nLine four is fine.\nWe should delve — right now.\n",
        )
        code, data, _ = invoke("lint", str(draft), "--blacklist", str(self.blacklist), "--surface", "spoken")
        self.assertEqual(code, 1)
        assert data is not None
        self.assertFalse(data["ok"])
        self.assertEqual(data["blocking_count"], 2)
        self.assertEqual({hit["match"] for hit in data["blocking"]}, {"delve", "—"})
        self.assertTrue(all(hit["line"] == 5 for hit in data["blocking"]))

    def test_lint_written_surface_makes_spoken_rules_advisory(self) -> None:
        draft = self.write("essay.md", "A written essay can use an em dash — intentionally.\n")
        code, data, _ = invoke("lint", str(draft), "--blacklist", str(self.blacklist), "--surface", "written")
        self.assertEqual(code, 0)
        assert data is not None
        self.assertTrue(data["ok"])
        self.assertEqual(data["blocking_count"], 0)
        self.assertEqual(data["advisory_count"], 1)
        self.assertEqual(data["advisory"][0]["match"], "—")

    def test_lint_skips_code_blocks_and_html_comments(self) -> None:
        draft = self.write(
            "comments.md",
            "<!-- delve into game-changer -->\n```text\ndelve\n```\nClean spoken sentence.\n",
        )
        code, data, _ = invoke("lint", str(draft), "--blacklist", str(self.blacklist))
        self.assertEqual(code, 0)
        assert data is not None
        self.assertEqual(data["blocking_count"], 0)

    def test_lint_errors_exit_two_on_missing_or_invalid_inputs(self) -> None:
        draft = self.write("ok.md", "Hello world.\n")
        bad_blacklist = self.write("bad.md", "```regex\n[unclosed\n```\n")
        empty_blacklist = self.write("empty.md", "No blocks here.\n")

        self.assertEqual(invoke("lint", str(self.tmp / "nope.md"), "--blacklist", str(self.blacklist))[0], 2)
        self.assertEqual(invoke("lint", str(draft), "--blacklist", str(self.tmp / "missing.md"))[0], 2)
        self.assertEqual(invoke("lint", str(draft), "--blacklist", str(bad_blacklist))[0], 2)
        self.assertEqual(invoke("lint", str(draft), "--blacklist", str(empty_blacklist))[0], 2)

    def test_starter_blacklist_asset_parses_cleanly_if_present(self) -> None:
        if not STARTER_BLACKLIST.is_file():
            self.skipTest("starter blacklist not yet created")
        draft = self.write("slop.md", "Let's dive deep into this game-changer — right now.\n")
        code, data, err = invoke("lint", str(draft), "--blacklist", str(STARTER_BLACKLIST), "--surface", "spoken")
        self.assertEqual(code, 1, err)
        assert data is not None
        self.assertGreaterEqual(data["blocking_count"], 3)

    def test_metrics_counts_words_runtime_and_short_punches(self) -> None:
        words_90 = ("word " * 8 + "end. ") * 10
        draft = self.write("talk.md", f"---\ntitle: Demo\n---\n# Section\n\n{words_90}\nStop now.\n")
        code, data, err = invoke("metrics", str(draft), "--wpm", "180")
        self.assertEqual(code, 0, err)
        assert data is not None
        self.assertEqual(data["word_count"], 92)
        self.assertEqual(data["sentence_count"], 11)
        self.assertEqual(data["short_punch_count"], 1)
        self.assertEqual(data["runtime_seconds"], 31)
        self.assertEqual(data["runtime_mmss"], "00:31")
        self.assertEqual(data["burstiness_runs"], [])

    def test_metrics_flags_burstiness_over_four_long_sentences(self) -> None:
        long_sentence = " ".join(["word"] * 22) + "."
        clean_four = self.write("four.md", "\n".join([long_sentence] * 4) + "\nShort punch.\n")
        code_ok, data_ok, _ = invoke("metrics", str(clean_four))
        self.assertEqual(code_ok, 0)
        assert data_ok is not None
        self.assertEqual(data_ok["burstiness_runs"], [])

        five_long = self.write("five.md", "Punch.\n" + " ".join([long_sentence] * 5) + "\n")
        code_five, data_five, _ = invoke("metrics", str(five_long))
        self.assertEqual(code_five, 0)
        assert data_five is not None
        self.assertEqual(data_five["burstiness_runs"], [{"start_sentence": 2, "end_sentence": 6, "length": 5}])

    def test_metrics_check_invented_enforces_threshold(self) -> None:
        boundary = self.write(
            "quarter.md",
            "One real line. Two real line. Three real line. Bridge line. [INVENTED]\n",
        )
        code_ok, data_ok, _ = invoke("metrics", str(boundary), "--check-invented")
        self.assertEqual(code_ok, 0)
        assert data_ok is not None
        self.assertEqual(data_ok["invented_sentences"], 1)
        self.assertEqual(data_ok["invented_pct"], 25.0)

        over = self.write(
            "too-much.md",
            "One real line. [INVENTED] Glue two. [INVENTED] Real three.\n",
        )
        code_fail, data_fail, _ = invoke("metrics", str(over), "--check-invented")
        self.assertEqual(code_fail, 1)
        assert data_fail is not None
        self.assertGreater(data_fail["invented_pct"], 25.0)
        self.assertFalse(data_fail["ok"])

    def test_metrics_handles_empty_doc_and_bad_args(self) -> None:
        empty = self.write("empty.md", "---\ntitle: Empty\n---\n# Just headings\n")
        code, data, err = invoke("metrics", str(empty))
        self.assertEqual(code, 0, err)
        assert data is not None
        self.assertEqual(data["word_count"], 0)
        self.assertEqual(data["sentence_count"], 0)
        self.assertEqual(data["runtime_mmss"], "00:00")

        self.assertEqual(invoke("metrics", str(empty), "--wpm", "0")[0], 2)
        self.assertEqual(invoke("metrics", str(empty), "--max-invented-pct", "120")[0], 2)

    def test_metrics_counts_multiple_trailing_and_prefix_invented_tags(self) -> None:
        four_two = self.write(
            "four-two.md",
            "One. Two. Three. Four. Five. [INVENTED] Six. [INVENTED]\n",
        )
        code, data, err = invoke("metrics", str(four_two), "--check-invented")
        self.assertEqual(code, 1, err)
        assert data is not None
        self.assertEqual(data["sentence_count"], 6)
        self.assertEqual(data["invented_sentences"], 2)
        self.assertEqual(data["invented_pct"], 33.3)
        self.assertFalse(data["ok"])

        two_two = self.write(
            "two-two.md",
            "Real one. Real two. Made three. [INVENTED] Made four. [INVENTED]\n",
        )
        code2, data2, err2 = invoke("metrics", str(two_two), "--check-invented")
        self.assertEqual(code2, 1, err2)
        assert data2 is not None
        self.assertEqual(data2["sentence_count"], 4)
        self.assertEqual(data2["invented_sentences"], 2)
        self.assertEqual(data2["invented_pct"], 50.0)

        prefixed = self.write(
            "prefixed.md",
            "[INVENTED] Made one. [INVENTED] Made two.\n",
        )
        code3, data3, err3 = invoke("metrics", str(prefixed), "--check-invented")
        self.assertEqual(code3, 1, err3)
        assert data3 is not None
        self.assertEqual(data3["sentence_count"], 2)
        self.assertEqual(data3["invented_sentences"], 2)
        self.assertEqual(data3["invented_pct"], 100.0)

    def test_metrics_compares_unrounded_invented_percentage(self) -> None:
        one_third = self.write("third.md", "One. Two. [INVENTED] Three.\n")
        code, data, err = invoke("metrics", str(one_third), "--check-invented", "--max-invented-pct", "33.3")
        self.assertEqual(code, 1, err)
        assert data is not None
        self.assertEqual(data["invented_pct"], 33.3)
        self.assertFalse(data["ok"])

    def test_metrics_supports_non_latin_unicode_prose(self) -> None:
        russian = self.write("ru.md", "Привет мир. Это мой рассказ.\n")
        code, data, err = invoke("metrics", str(russian), "--wpm", "150")
        self.assertEqual(code, 0, err)
        assert data is not None
        self.assertEqual(data["word_count"], 5)
        self.assertEqual(data["sentence_count"], 2)
        self.assertEqual(data["runtime_seconds"], 2)

    def test_metrics_section_filters_talk_script_to_spoken_sections(self) -> None:
        talk = self.write(
            "talk-script.md",
            "---\ntitle: Demo Talk\n---\n\n"
            "# Demo Talk\n\n"
            "## Table of Contents\n\n- Slot and audience\n- Spoken draft\n\n"
            "## Slot and audience\n\nTwenty minute keynote for skeptical engineers.\n\n"
            "## Body beats and visual cues\n\nBeat one explains the failure.\n\n"
            "## Spoken draft\n\nHere is the first spoken sentence. Here is the second.\n\n"
            "## Hook written last\n\nWatch this fail.\n\n"
            "## Pacing and lint check\n\nClean pass recorded earlier.\n",
        )
        code, data, err = invoke(
            "metrics",
            str(talk),
            "--section",
            "Hook written last",
            "--section",
            "Spoken draft",
        )
        self.assertEqual(code, 0, err)
        assert data is not None
        self.assertEqual(data["word_count"], 13)
        self.assertEqual(data["sentence_count"], 3)

        missing_code, _, missing_err = invoke("metrics", str(talk), "--section", "No Such Section")
        self.assertEqual(missing_code, 2)
        self.assertIn("no matching ## sections found", missing_err)

    def test_lint_handles_fence_inside_html_comment_and_longer_closing_fence(self) -> None:
        draft = self.write(
            "fences.md",
            "<!-- comment opening a fake fence\n```text\n-->\nWe should delve here.\n"
            "```\nignored inside three-backtick fence\n````\nStill fine.\n",
        )
        code, data, err = invoke("lint", str(draft), "--blacklist", str(self.blacklist))
        self.assertEqual(code, 1, err)
        assert data is not None
        self.assertEqual(data["blocking_count"], 1)
        self.assertEqual(data["blocking"][0]["line"], 4)
        self.assertEqual(data["blocking"][0]["match"], "delve")

    def test_starter_blacklist_catches_curly_apostrophes(self) -> None:
        if not STARTER_BLACKLIST.is_file():
            self.skipTest("starter blacklist not yet created")
        draft = self.write("curly.md", "Let’s dive in because it’s worth noting.\n")
        code, data, err = invoke("lint", str(draft), "--blacklist", str(STARTER_BLACKLIST), "--surface", "spoken")
        self.assertEqual(code, 1, err)
        assert data is not None
        self.assertEqual(data["blocking_count"], 2)

    def test_lint_frontmatter_line_offset_via_shared_helper(self) -> None:
        draft = self.write(
            "fm.md",
            "---\ntitle: Test\ntags: [one, two]\n---\nLine five.\nWe delve on line six.\n",
        )
        code, data, err = invoke("lint", str(draft), "--blacklist", str(self.blacklist), "--project-root", str(ROOT))
        self.assertEqual(code, 1, err)
        assert data is not None
        self.assertEqual(data["blocking_count"], 1)
        self.assertEqual(data["blocking"][0]["line"], 6)


if __name__ == "__main__":
    unittest.main()
