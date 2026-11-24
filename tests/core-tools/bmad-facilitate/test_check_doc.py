# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for check_doc.py. Run: uv run --with pytest pytest tests/core-tools/bmad-facilitate/test_check_doc.py"""

import importlib.util
import json
import sys
from pathlib import Path

import pytest

_SPEC = importlib.util.spec_from_file_location(
    "check_doc", Path(__file__).resolve().parents[3] / "skills/core-tools/bmad-facilitate/scripts/check_doc.py"
)
check_doc = importlib.util.module_from_spec(_SPEC)
sys.modules["check_doc"] = check_doc
_SPEC.loader.exec_module(check_doc)


def report(*texts: str, forbid_prefixes=()) -> dict:
    return check_doc.scan([(f"doc{i}.md", text) for i, text in enumerate(texts)], forbid_prefixes=forbid_prefixes)


def test_placeholders_detected_in_frontmatter_and_body_ignoring_fences_comments_and_inline_code():
    text = (
        '---\ntitle: "Plan"\ncreated: "TBD"\nowner: "{owner_name}"\n---\n\n'
        "# Plan\n\n"
        "Status is TODO and details are FIXME or XXX.\n"
        "Unfilled {team-name} in prose.\n"
        "Inline `{slug}` and `/users/{id}` stay clean.\n\n"
        "```\nTBD TODO {fenced_token}\n```\n\n"
        "<!-- TODO {comment_token} -->\n"
    )
    assert report(text)["placeholders"] == [
        {"kind": "marker", "text": "TBD", "location": "doc0.md:3"},
        {"kind": "token", "text": "{owner_name}", "location": "doc0.md:4"},
        {"kind": "marker", "text": "TODO", "location": "doc0.md:9"},
        {"kind": "marker", "text": "FIXME", "location": "doc0.md:9"},
        {"kind": "marker", "text": "XXX", "location": "doc0.md:9"},
        {"kind": "token", "text": "{team-name}", "location": "doc0.md:10"},
    ]


TOC = """# Doc

## Table of Contents

- [Why it matters](#why-it-matters): the problem
- [Point](#point): first
- [Point](#point-1): second
- [Detail](#detail): one part

## Why it matters?

## Point

### Detail

## Point
"""


def test_table_of_contents_checks():
    assert report(TOC)["toc"] == {"missing": {}, "stale": {}, "out_of_order": []}

    missing = report(TOC + "\n## Risks\n")["toc"]
    assert missing["missing"] == {"Risks": ["doc0.md:18"]}

    stale = report(TOC.replace("## Why it matters?", "## Reasons"))["toc"]
    assert stale["stale"] == {"why-it-matters": ["doc0.md:5"]}
    assert stale["missing"] == {"Reasons": ["doc0.md:10"]}

    swapped = TOC.replace(
        "- [Point](#point): first\n- [Point](#point-1): second",
        "- [Point](#point-1): second\n- [Point](#point): first",
    )
    assert report(swapped)["toc"]["out_of_order"] == ["doc0.md:3"]

    prefixed = "---\ntitle: Doc\n---\n\n## Table of Contents\n\n- [Keep](#keep)\n\n## Keep\n\n## Missing\n"
    assert report(prefixed)["toc"]["missing"] == {"Missing": ["doc0.md:11"]}
    assert report("# No TOC\n\nJust prose.\n")["toc"] == {"missing": {}, "stale": {}, "out_of_order": []}


def test_forbid_prefix_catches_exact_scoped_backticked_and_range_tokens_across_files(tmp_path, capsys):
    doc = tmp_path / "doc.md"
    comp = tmp_path / "companion.md"
    doc.write_text(
        "- **R-1**: Keep\n"
        "- `FR-1`: Backticked leak\n"
        "Refs E01-FR-02 and `FR-3` to `FR-5`.\n"
        "```\nFR-99 in fence ignored\n```\n"
        "<!-- FR-98 in comment ignored -->\n",
        encoding="utf-8",
    )
    comp.write_text("- **TASK-2**: Companion leak\n", encoding="utf-8")
    assert check_doc.main([str(doc), str(comp), "--forbid-prefix", "FR-", "--forbid-prefix", "TASK"]) == 0
    found = json.loads(capsys.readouterr().out)
    assert found["forbidden_prefix"] == {
        "FR-1": [f"{doc}:2"],
        "FR-3": [f"{doc}:3"],
        "FR-4": [f"{doc}:3"],
        "FR-5": [f"{doc}:3"],
        "E01-FR-02": [f"{doc}:3"],
        "TASK-2": [f"{comp}:1"],
    }


def test_cli_exit_codes_and_help(tmp_path, capsys):
    doc = tmp_path / "doc.md"
    doc.write_text("# Clean\n\nBody.\n", encoding="utf-8")
    assert check_doc.main([str(doc)]) == 0
    assert json.loads(capsys.readouterr().out) == {
        "placeholders": [],
        "forbidden_prefix": {},
        "toc": {"missing": {}, "stale": {}, "out_of_order": []},
    }

    assert check_doc.main([str(doc), str(tmp_path / "absent.md")]) == 2
    assert "not found" in capsys.readouterr().err

    with pytest.raises(SystemExit) as help_exc:
        check_doc.main(["--help"])
    assert help_exc.value.code == 0

    with pytest.raises(SystemExit) as empty_exc:
        check_doc.main([])
    assert empty_exc.value.code == 2


def test_fence_suffix_and_html_comment_interplay():
    text = (
        "<!--\n```\n-->\n"
        "TODO in prose after comment containing unmatched fence.\n"
        "```markdown\t\n"
        "TODO inside fence with trailing tab ignored\n"
        "```~\n"
        "Still inside fence because mixed tilde does not close backtick fence: TODO\n"
        "<!-- unclosed comment inside fence ignored\n"
        "```\t \n"
        "```python\n"
        "<!-- comment marker in second fence ignored\n"
        "```\n"
        "FIXME visible after closing fences.\n"
    )
    hits = report(text)["placeholders"]
    assert hits == [
        {"kind": "marker", "text": "TODO", "location": "doc0.md:4"},
        {"kind": "marker", "text": "FIXME", "location": "doc0.md:14"},
    ]
