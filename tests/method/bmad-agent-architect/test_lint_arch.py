# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for lint_arch.py. Run: uv run --frozen python -B -m unittest tests/method/bmad-agent-architect/test_lint_arch.py"""

import importlib.util
import io
import json
import shutil
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "skills/method/bmad-agent-architect/scripts/lint_arch.py"
FRONTMATTER = SCRIPT.parents[3] / "core-tools" / "bmad" / "scripts" / "frontmatter.py"
_SPEC = importlib.util.spec_from_file_location("lint_arch", SCRIPT)
lint_arch = importlib.util.module_from_spec(_SPEC)
sys.modules["lint_arch"] = lint_arch
_SPEC.loader.exec_module(lint_arch)
sys.path.insert(0, str(FRONTMATTER.parent))
import frontmatter  # noqa: E402

lint_arch.frontmatter = frontmatter

CLEAN = """---
title: 'Demo'
template: arch-spine
---

## Invariants and decisions

### AD-1 — single write path

- **Binds:** all
- **Prevents:** divergent mutation
- **Rule:** state changes only through the command bus

### `AD-2` — layered deps `[ADOPTED]`

- **Binds:** all
- **Prevents:** import cycles
- **Rule:** ui -> app -> domain, never backward

```mermaid
flowchart LR
  A --> B{decision}
```

## Stack

| Name | Version |
| --- | --- |
| fastapi | 0.115 |
| pydantic | 2.9 |
"""


def cats(result: dict) -> list[str]:
    return sorted(f["category"] for f in result["findings"])


class TestLintArch(unittest.TestCase):
    def test_clean_arch_passes(self) -> None:
        result = lint_arch.lint(CLEAN)
        self.assertTrue(result["ok"])
        self.assertEqual(result["total_findings"], 0)

    def test_generic_placeholders_not_duplicated(self) -> None:
        text = CLEAN.replace("the command bus", "TBD").replace("import cycles", "{placeholder}")
        result = lint_arch.lint(text)
        self.assertTrue(result["ok"])

    def test_similar_to_caught(self) -> None:
        text = CLEAN.replace("import cycles", "similar to AD-1")
        result = lint_arch.lint(text)
        self.assertEqual(cats(result), ["ad_crossref"])

    def test_duplicate_and_non_monotonic_ad_id_caught(self) -> None:
        dup = CLEAN.replace("### `AD-2` — layered deps `[ADOPTED]`", "### AD-1 — layered deps")
        self.assertIn("ad_id", cats(lint_arch.lint(dup)))

        non_mono = CLEAN.replace("### `AD-2` — layered deps `[ADOPTED]`", "### **AD-5** — layered deps").replace(
            "### AD-1 — single write path", "### AD-9 — single write path"
        )
        res = lint_arch.lint(non_mono)
        self.assertTrue(any(f["category"] == "ad_id" and "non-monotonic" in f["detail"] for f in res["findings"]))

    def test_missing_ad_fields_and_label_variants(self) -> None:
        missing_rule = CLEAN.replace("- **Rule:** state changes only through the command bus\n", "")
        res = lint_arch.lint(missing_rule)
        self.assertTrue(any(f["category"] == "ad_fields" and "rule" in f["detail"] for f in res["findings"]))

        # Mentioning the word "rule" in prose without a Rule: label must still fail.
        prose_only = CLEAN.replace(
            "- **Rule:** state changes only through the command bus",
            "- **Note:** follows the golden rule of state.",
        )
        res_prose = lint_arch.lint(prose_only)
        self.assertTrue(any(f["category"] == "ad_fields" and "rule" in f["detail"] for f in res_prose["findings"]))

        # Alternate label syntax (`- **Rule**:` and plain `Rule:`) passes.
        alt = CLEAN.replace("- **Rule:**", "- **Rule**:").replace("- **Binds:**", "Binds:")
        self.assertTrue(lint_arch.lint(alt)["ok"])

    def test_fences_and_html_comments_ignored(self) -> None:
        text = (
            "---\ntitle: 'x'\n---\n\n"
            "### AD-1 — real\n\n- **Binds:** all\n- **Prevents:** drift\n- **Rule:** do x\n\n"
            "<!-- ### AD-2 — commented out\nsimilar to AD-1 -->\n\n"
            "```text\n### AD-3 — fenced example\nsimilar to AD-1\n```\n"
        )
        self.assertTrue(lint_arch.lint(text)["ok"])

    def test_stack_version_pin_checks(self) -> None:
        blank = CLEAN.replace("| fastapi | 0.115 |", "| fastapi |  |")
        res_blank = lint_arch.lint(blank, name="arch-spine-shop.md")
        self.assertEqual(cats(res_blank), ["version_pin"])
        self.assertTrue(res_blank["findings"][0]["location"].startswith("arch-spine-shop.md (line "))

        for bad in ("{pin}", "TBD", "latest", "unpinned"):
            res = lint_arch.lint(CLEAN.replace("| fastapi | 0.115 |", f"| fastapi | {bad} |"))
            self.assertEqual(cats(res), ["version_pin"], msg=bad)

        # No Stack section or skeleton {token} row or HTML comment in Stack stays clean.
        self.assertNotIn("version_pin", cats(lint_arch.lint(CLEAN.split("## Stack")[0])))
        skel = CLEAN.replace("| fastapi | 0.115 |", "| {language / framework} | {pinned version} |")
        self.assertNotIn("version_pin", cats(lint_arch.lint(skel)))
        commented = CLEAN.replace("## Stack\n", "## Stack\n\n<!-- SEED -->\n")
        self.assertNotIn("version_pin", cats(lint_arch.lint(commented)))

        # Fenced stack heading/rows ignored; renamed heading and reordered columns work.
        fenced = "---\ntitle: 'x'\n---\n\n```md\n## Stack\n\n| foo |  |\n```\n"
        self.assertTrue(lint_arch.lint(fenced)["ok"])

        reordered = "---\ntitle: 'x'\n---\n\n## Stack & Versions\n\n| Version | Name |\n| --- | --- |\n| 0.115 | fastapi |\n|  | redis |\n"
        res_reord = lint_arch.lint(reordered)
        self.assertEqual(len(res_reord["findings"]), 1)
        self.assertIn("redis", res_reord["findings"][0]["detail"])

    def test_absolute_line_numbers_past_crlf_and_inline_dashes(self) -> None:
        text = (
            "---\r\n"
            "title: 'x --- y'\r\n"
            "---\r\n\r\n"
            "## Stack\r\n\r\n"
            "| Name | Version |\r\n"
            "| --- | --- |\r\n"
            "| redis |  |\r\n"
        )
        res = lint_arch.lint(text, name="doc.md")
        self.assertEqual(res["findings"][0]["location"], "doc.md (line 9)")

    def test_cli_multifile_companions_help_and_errors(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "_bmad" / "scripts").mkdir(parents=True)
            shutil.copy2(FRONTMATTER, root / "_bmad" / "scripts")

            doc = root / "arch-epic-demo.md"
            doc.write_text(CLEAN, encoding="utf-8")
            companion = root / "contract.yaml"
            companion.write_text("openapi: 3.1.0\n", encoding="utf-8")
            out_json = root / "out.json"

            buf = io.StringIO()
            with redirect_stdout(buf):
                rc = lint_arch.main(["--project-root", str(root), "-o", str(out_json), str(doc), str(companion)])
            self.assertEqual(rc, 0)
            payload = json.loads(out_json.read_text(encoding="utf-8"))
            self.assertTrue(payload["ok"])
            self.assertEqual(payload["files"], [str(doc)])

            # Duplicate AD-1 across two markdown files caught.
            doc2 = root / "extra.md"
            doc2.write_text(
                "---\ntitle: Extra\n---\n\n### AD-1 — dup\n\n- **Binds:** all\n- **Prevents:** x\n- **Rule:** y\n",
                encoding="utf-8",
            )
            buf2 = io.StringIO()
            with redirect_stdout(buf2):
                rc2 = lint_arch.main([str(doc), str(doc2)])
            self.assertEqual(rc2, 0)
            self.assertTrue(any(f["category"] == "ad_id" for f in json.loads(buf2.getvalue())["findings"]))

            # Missing file exits 2.
            err = io.StringIO()
            with redirect_stderr(err):
                rc_missing = lint_arch.main([str(root / "missing.md")])
            self.assertEqual(rc_missing, 2)
            self.assertIn("not found", err.getvalue())

            # --help exits 0.
            with self.assertRaises(SystemExit) as exc:
                lint_arch.main(["--help"])
            self.assertEqual(exc.exception.code, 0)


if __name__ == "__main__":
    unittest.main()
