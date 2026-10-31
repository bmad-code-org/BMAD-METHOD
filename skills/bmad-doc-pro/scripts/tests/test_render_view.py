# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for render_view.py. Run: uv run --with pytest pytest scripts/tests/test_render_view.py

The deterministic half of the view: what is stripped before rendering, the page title, how a
deck splits into slides with titles and speaker notes, which style files are inlined, where
the page is written, and the exit code for a missing document. Browser behavior is not tested.
"""

import importlib.util
import json
import re
import sys
from pathlib import Path

_SPEC = importlib.util.spec_from_file_location("render_view", Path(__file__).resolve().parent.parent / "render_view.py")
render_view = importlib.util.module_from_spec(_SPEC)
sys.modules["render_view"] = render_view
_SPEC.loader.exec_module(render_view)


DECK = """---
title: "Measure first"
template: pitch-deck
view: slides
---

<!-- purpose: Move the room to measure first. -->

# Measure first

A talk for the meetup.

## Problem
<!-- required. Whose pain. -->

**CI took 40 minutes.**

- 300 engineers

> Ours was 40 minutes.
>
> Keep your hand up.

## Open questions

- Which tools?

> A quote that is the slide's content, mid-slide.

Closing line.
"""


def payload(page: str) -> dict:
    return json.loads(re.search(r'id="view-data">(.*?)</script>', page, re.DOTALL).group(1))


def test_comments_and_frontmatter_stripped():
    title, body = render_view.prepare(DECK)
    assert title == "Measure first"
    assert "<!--" not in body and "required. Whose pain" not in body
    assert "template: pitch-deck" not in body
    assert body.startswith("# Measure first")


def test_comments_inside_code_fences_kept():
    text = "# T\n\n```html\n<!-- keep me -->\n```\n\n<!-- drop me -->\n"
    _, body = render_view.prepare(text)
    assert "<!-- keep me -->" in body
    assert "drop me" not in body


def test_title_quotes_unwrapped():
    assert render_view.frontmatter_title('title: "A \\"quoted\\" title"') == 'A "quoted" title'
    assert render_view.frontmatter_title("title: 'It''s here'") == "It's here"
    assert render_view.frontmatter_title("title: plain") == "plain"
    assert render_view.frontmatter_title("template: x") == ""


def test_page_title_falls_back_to_h1_then_filename():
    assert "<title>From the heading</title>" in render_view.render("# From the heading\n\ntext\n", "document")
    assert "<title>my-doc</title>" in render_view.render("no heading\n", "document", name="my-doc")
    assert "<title>A &amp; B</title>" in render_view.render('---\ntitle: "A & B"\n---\n# x\n', "document")


def test_slides_split_on_h2_with_h1_first():
    _, body = render_view.prepare(DECK)
    slides = render_view.split_slides(body)
    assert [s["section"] for s in slides] == ["Measure first", "Problem", "Open questions"]
    assert slides[0]["title_slide"] and slides[0]["title"] == "Measure first"
    assert slides[0]["body"] == "A talk for the meetup."


def test_bold_first_line_becomes_title_and_heading_is_dropped():
    _, body = render_view.prepare(DECK)
    problem = render_view.split_slides(body)[1]
    assert problem["title"] == "CI took 40 minutes."
    assert problem["body"] == "- 300 engineers"


def test_heading_stays_title_without_bold_line():
    slides = render_view.split_slides("## Team\n\n**Ana** and **Bo** lead it.\n")
    assert slides[0]["title"] == "Team"
    assert slides[0]["body"] == "**Ana** and **Bo** lead it."


def test_trailing_blockquote_becomes_notes():
    _, body = render_view.prepare(DECK)
    problem = render_view.split_slides(body)[1]
    assert problem["notes"] == "Ours was 40 minutes.\n\nKeep your hand up."
    assert ">" not in problem["body"]


def test_blockquote_before_more_content_is_not_notes():
    _, body = render_view.prepare(DECK)
    last = render_view.split_slides(body)[2]
    assert last["notes"] == ""
    assert "> A quote that is the slide's content" in last["body"]


def test_h2_inside_code_fence_does_not_split():
    slides = render_view.split_slides("## One\n\n```md\n## not a slide\n```\n")
    assert len(slides) == 1
    assert "## not a slide" in slides[0]["body"]


def test_notes_stay_out_of_slide_markup():
    page = render_view.render(DECK, "slides")
    markup = page.split('id="view-data"')[0]
    assert "Ours was 40 minutes" not in markup
    assert payload(page)["slides"][1]["notes"].startswith("Ours was 40 minutes")


def test_embedded_markdown_cannot_close_the_script():
    page = render_view.render("# T\n\n</script><script>alert(1)</script>\n", "document")
    data_block = re.search(r'id="view-data">(.*?)</script>', page, re.DOTALL).group(1)
    assert "</script" not in data_block
    assert payload(page)["markdown"].startswith("# T")


def test_fallback_pre_escapes_markdown():
    page = render_view.render("# T\n\n<b>raw</b>\n", "document")
    assert '<pre class="fallback"># T\n\n&lt;b&gt;raw&lt;/b&gt;\n</pre>' in page


def test_css_style_inlined_after_default(tmp_path):
    css = tmp_path / "brand.css"
    css.write_text("body { color: hotpink; }", encoding="utf-8")
    page = render_view.render("# T\n", "document", render_view.load_style(str(css)))
    assert page.index("hotpink") > page.index("--code-bg")


def test_non_css_style_ignored_with_warning(tmp_path, capsys):
    guide = tmp_path / "voice.md"
    guide.write_text("Write warmly.", encoding="utf-8")
    assert render_view.load_style(str(guide)) == ""
    assert "not a .css file" in capsys.readouterr().err


def test_empty_style_is_no_style(capsys):
    assert render_view.load_style("") == ""
    assert capsys.readouterr().err == ""


def test_default_output_path_and_stdout(tmp_path, capsys):
    doc = tmp_path / "pm-1-deck.md"
    doc.write_text(DECK, encoding="utf-8")
    assert render_view.main([str(doc), "--layout", "slides"]) == 0
    out = tmp_path / "pm-1-deck.html"
    assert capsys.readouterr().out == f"{out}\n"
    assert payload(out.read_text(encoding="utf-8"))["layout"] == "slides"


def test_out_option_creates_parent(tmp_path, capsys):
    doc = tmp_path / "doc.md"
    doc.write_text("# T\n", encoding="utf-8")
    out = tmp_path / "views" / "view.html"
    assert render_view.main([str(doc), "--out", str(out)]) == 0
    assert out.is_file()
    assert capsys.readouterr().out == f"{out}\n"


def test_missing_document_exits_2(tmp_path, capsys):
    assert render_view.main([str(tmp_path / "absent.md")]) == 2
    captured = capsys.readouterr()
    assert captured.out == ""
    assert "not found" in captured.err


def test_title_slide_keeps_the_document_title():
    slides = render_view.split_slides(
        "# How we cut CI\n**Measure before you optimize.**\n\n## Problem\n**Builds are slow.**\n"
    )
    assert slides[0]["title"] == "How we cut CI"
    assert "Measure before you optimize." in slides[0]["body"]
    assert slides[1]["title"] == "Builds are slow."
