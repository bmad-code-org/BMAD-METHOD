#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Tests for word_metrics.py."""

import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from word_metrics import section_metrics, word_count

DOC = """Intro line before any heading.

# Title

Two words here indeed.

## Section A

Alpha beta gamma.

```
# not a heading
fenced words ignored as headings
```

## Section B

Delta epsilon.
"""


class WordMetricsTest(unittest.TestCase):
    def test_word_count(self):
        self.assertEqual(word_count("one two  three\nfour"), 4)
        self.assertEqual(word_count(""), 0)

    def test_sections_split_on_headings(self):
        sections = section_metrics(DOC)
        headings = [s["heading"] for s in sections]
        self.assertEqual(headings, ["(preamble)", "Title", "Section A", "Section B"])

    def test_fenced_heading_not_a_section(self):
        sections = section_metrics(DOC)
        self.assertNotIn("not a heading", [s["heading"] for s in sections])

    def test_section_words_counted(self):
        sections = {s["heading"]: s["words"] for s in section_metrics(DOC)}
        self.assertEqual(sections["Section B"], 2)
        # Section A body includes the fenced block's tokens
        self.assertGreater(sections["Section A"], 3)

    def test_empty_preamble_dropped(self):
        sections = section_metrics("# Only\n\nwords here\n")
        self.assertEqual([s["heading"] for s in sections], ["Only"])


SCRIPT = Path(__file__).resolve().parent.parent / "word_metrics.py"


class StderrEncodingTests(unittest.TestCase):
    """stderr quotes the caller's path, so it needs the same pin as stdout."""

    def test_missing_path_is_named_readably_on_a_cp1252_console(self):
        """The user has to be able to read which path the tool could not open."""
        with tempfile.TemporaryDirectory() as tmp:
            missing = Path(tmp) / "belge-şık.md"
            env = dict(os.environ)
            env["PYTHONIOENCODING"] = "cp1252"
            result = subprocess.run(
                [sys.executable, str(SCRIPT), str(missing)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env,
                check=False,
            )

        stderr = result.stderr.decode("utf-8", errors="replace")
        self.assertEqual(result.returncode, 2, msg=stderr)
        self.assertIn("belge-şık.md", stderr)
        self.assertNotIn(r"\u015f", stderr)
        self.assertNotIn("Traceback", stderr)

if __name__ == "__main__":
    unittest.main()
