# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for check_doc.py. Run: uv run --with pytest pytest tests/core-tools/bmad-facilitate/test_check_doc.py"""

import importlib.util
import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[3] / "skills/core-tools/bmad-facilitate/scripts/check_doc.py"
FRONTMATTER = SCRIPT.parents[2] / "bmad" / "scripts" / "frontmatter.py"
sys.path.insert(0, str(FRONTMATTER.parent))
import frontmatter  # noqa: E402

_SPEC = importlib.util.spec_from_file_location("check_doc", SCRIPT)
check_doc = importlib.util.module_from_spec(_SPEC)
sys.modules["check_doc"] = check_doc
_SPEC.loader.exec_module(check_doc)
check_doc.frontmatter = frontmatter


def report(*texts: str, forbid_prefixes=()) -> dict:
    return check_doc.scan([(f"doc{i}.md", text) for i, text in enumerate(texts)], forbid_prefixes=forbid_prefixes)


def test_placeholders_detected_in_frontmatter_and_body_ignoring_fences_comments_and_inline_code():
    text = (
        '---\ntitle: "Plan"\ncreated: "TBD"\nowner: "{owner_name}"\n---\n\n'
        "# Plan\n\n"
        "Status is TODO and details are FIXME or XXX.\n"
        "Unfilled {team-name} in prose.\n"
        "Inline `{slug}`, `/users/{id}`, and `# TODO: legacy` (`TBD`, `FIXME`, `XXX`) stay clean.\n\n"
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


def test_inline_backtick_and_unclosed_comment_do_not_hide_rest_of_document():
    text = (
        "## Table of Contents\n\n"
        "- [A](#a)\n"
        "- [B](#b)\n\n"
        "## A\n\n"
        "Remove the `<!--` prefix. TODO one. Use bare <!-- safely too.\n\n"
        "## B\n\n"
        "Status TBD here. Cites FR-7.\n"
    )
    res = report(text, forbid_prefixes=("FR",))
    assert res["placeholders"] == [
        {"kind": "marker", "text": "TODO", "location": "doc0.md:8"},
        {"kind": "marker", "text": "TBD", "location": "doc0.md:12"},
    ]
    assert res["forbidden_prefix"] == {"FR-7": ["doc0.md:12"]}
    assert res["toc"] == {"missing": {}, "stale": {}, "out_of_order": []}


def test_escaped_backticks_do_not_preserve_hidden_comments():
    text = (
        "Escaped \\` <!-- TODO FR-9 --> \\` should still strip comments.\n"
        "Escaped backslash \\\\`<!--` prefix still shows TODO.\n"
        "Closed `span \\` <!-- TODO --> after marker TBD.\n"
    )
    res = report(text, forbid_prefixes=("FR",))
    assert res["placeholders"] == [
        {"kind": "marker", "text": "TODO", "location": "doc0.md:2"},
        {"kind": "marker", "text": "TBD", "location": "doc0.md:3"},
    ]
    assert res["forbidden_prefix"] == {}


def test_standalone_script_resolves_frontmatter_from_doc_root_and_exits_2_when_absent(tmp_path):
    isolated = tmp_path / "bin"
    isolated.mkdir()
    copied = isolated / "check_doc.py"
    shutil.copy2(SCRIPT, copied)

    outside_cwd = tmp_path / "outside"
    outside_cwd.mkdir()

    proj = tmp_path / "proj"
    (proj / "_bmad" / "scripts").mkdir(parents=True)
    shutil.copy2(FRONTMATTER, proj / "_bmad" / "scripts" / "frontmatter.py")
    doc = proj / "doc.md"
    doc.write_text("---\ntitle: OK\n---\n\n# OK\n\nStatus TODO.\n", encoding="utf-8")

    ok = subprocess.run(
        [sys.executable, str(copied), str(doc)],
        cwd=outside_cwd,
        capture_output=True,
        text=True,
    )
    assert ok.returncode == 0, ok.stderr
    assert json.loads(ok.stdout)["placeholders"] == [{"kind": "marker", "text": "TODO", "location": f"{doc}:7"}]

    orphan = tmp_path / "orphan.md"
    orphan.write_text("# Orphan\n", encoding="utf-8")
    missing = subprocess.run(
        [sys.executable, str(copied), str(orphan)],
        cwd=outside_cwd,
        capture_output=True,
        text=True,
    )
    assert missing.returncode == 2
    assert "Traceback" not in missing.stderr
    assert "frontmatter.py not found" in missing.stderr
