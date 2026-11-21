# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for render_view.py. Run: uv run --with pytest pytest tests/core-tools/bmad-facilitate/test_render_view.py

The deterministic half of the view: what is stripped before rendering, the page title, how a
deck splits into slides with titles and speaker notes, how a view file's slots fill, which style
files are inlined, where the page is written, and the exit code for a missing document. Browser
behavior is not tested.
"""

import importlib.util
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[3] / "skills/core-tools/bmad-facilitate/scripts/render_view.py"
FRONTMATTER = SCRIPT.parents[2] / "bmad" / "scripts" / "frontmatter.py"
_SPEC = importlib.util.spec_from_file_location("render_view", SCRIPT)
render_view = importlib.util.module_from_spec(_SPEC)
sys.modules["render_view"] = render_view
_SPEC.loader.exec_module(render_view)
sys.path.insert(0, str(FRONTMATTER.parent))
import frontmatter  # noqa: E402

render_view.frontmatter = frontmatter  # main() loads the project's copy; the rendering tests call past it


@pytest.fixture
def project(tmp_path):
    root = tmp_path / "project"
    (root / "_bmad" / "scripts").mkdir(parents=True)
    shutil.copy2(FRONTMATTER, root / "_bmad" / "scripts")
    return ["--project-root", str(root)]


DECK = """---
title: "Measure first"
template: pitch-deck
layout: slides
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
    def title(fields):
        return render_view.prepare(f"---\n{fields}\n---\n# Heading\n")[0]

    assert title('title: "A \\"quoted\\" title"') == 'A "quoted" title'
    assert title("title: 'It''s here'") == "It's here"
    assert title("title: plain") == "plain"
    assert title("template: x") == ""
    assert title("title: >\n  Folded --- over\n  two lines") == "Folded --- over two lines"


def test_plain_markdown_and_unreadable_frontmatter_keep_the_h1_title():
    assert "<title>Plain</title>" in render_view.render("# Plain\n\n---\n\ntext\n", "document")
    page = render_view.render("---\ntitle: a: b\n---\n# From the heading\n", "document")
    assert "<title>From the heading</title>" in page
    assert "title: a: b" not in page
    _, body = render_view.prepare("---\ntitle: never closed\n# Heading\n")
    assert body.startswith("---\ntitle: never closed")


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


def test_table_of_contents_gets_no_slide():
    text = "# T\n\n## Table of Contents\n\n- [Problem](#problem)\n\n## Problem\n\nPain.\n"
    assert [s["section"] for s in render_view.split_slides(text)] == ["T", "Problem"]


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


def test_default_output_path_and_stdout(tmp_path, project, capsys):
    doc = tmp_path / "pm-1-deck.md"
    doc.write_text(DECK, encoding="utf-8")
    assert render_view.main([*project, str(doc), "--layout", "slides"]) == 0
    out = tmp_path / "pm-1-deck.html"
    assert capsys.readouterr().out == f"{out}\n"
    assert payload(out.read_text(encoding="utf-8"))["layout"] == "slides"


def test_out_option_creates_parent(tmp_path, project, capsys):
    doc = tmp_path / "doc.md"
    doc.write_text("# T\n", encoding="utf-8")
    out = tmp_path / "views" / "view.html"
    assert render_view.main([*project, str(doc), "--out", str(out)]) == 0
    assert out.is_file()
    assert capsys.readouterr().out == f"{out}\n"


def test_missing_document_exits_2(tmp_path, project, capsys):
    assert render_view.main([*project, str(tmp_path / "absent.md")]) == 2
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


SHEET = """---
title: "Wren"
template: character
tagline: "Keeps every secret but her own"
class: ""
---

<!-- purpose: A character. -->

# Wren

## Table of Contents

- [Concept](#concept)

## Concept
<!-- required. -->

A smuggler who **cannot** lie.

## Secrets

```mermaid
graph LR
  A --> B
```

## Arc

## Relationships

Owes the harbor master.
"""

VIEW = """<!doctype html>
<html><head><meta charset="utf-8"><title data-field="title">Sheet</title><style>h1 { color: red; }</style></head>
<body>
<br>
<img src="frame.png">
<h1 data-field="title">Name</h1>
<p class="tag" data-field="tagline"></p>
<p class="cls" data-field="class">Class</p>
<div class="a" data-section="Concept">placeholder</div>
<section class="b" data-section="secrets"><h2>Secrets</h2><div data-body></div></section>
<section class="c" data-section="Arc"><h2>Arc</h2><div data-body></div></section>
<section class="d" data-rest><p>leftovers</p></section>
</body></html>
"""


def test_section_slot_takes_the_section_body():
    page, pieces, _ = render_view.fill_view(VIEW, SHEET)
    assert "A smuggler who **cannot** lie." in pieces
    assert "placeholder" not in page
    assert '<div class="a" data-section="Concept"><div data-md="0">' in page


def test_section_names_match_without_case_and_body_child_keeps_the_label():
    page, _, _ = render_view.fill_view(VIEW, SHEET)
    assert re.search(r'<h2>Secrets</h2><div data-body><div data-md="\d+">', page)


def test_slot_for_an_empty_or_absent_section_is_removed_with_its_label():
    page, _, _ = render_view.fill_view(VIEW, SHEET)
    assert "<h2>Arc</h2>" not in page
    absent = '<section data-section="Nowhere"><h2>Label</h2></section>'
    assert "Label" not in render_view.fill_view(absent, SHEET)[0]


def test_field_slot_takes_the_frontmatter_value_escaped():
    page, _, _ = render_view.fill_view('<i data-field="title"></i>', '---\ntitle: "A & <B>"\n---\n# x\n')
    assert page == '<i data-field="title">A &amp; &lt;B&gt;</i>'


def test_title_field_falls_back_to_the_heading():
    assert render_view.fill_view('<i data-field="title"></i>', "# Wren\n")[0] == '<i data-field="title">Wren</i>'


def test_empty_field_slot_is_removed():
    page, _, _ = render_view.fill_view(VIEW, SHEET)
    assert 'class="cls"' not in page
    assert 'class="tag" data-field="tagline">Keeps every secret but her own<' in page


def test_rest_slot_takes_unclaimed_sections_with_their_headings():
    page, pieces, unplaced = render_view.fill_view(VIEW, SHEET)
    assert "## Relationships\n\nOwes the harbor master." in pieces
    assert "leftovers" not in page
    assert unplaced == []
    assert not any("Table of Contents" in piece for piece in pieces)


def test_sections_with_no_slot_are_reported_without_a_rest_slot():
    _, _, unplaced = render_view.fill_view('<div data-section="Concept"></div>', SHEET)
    assert unplaced == ["Secrets", "Relationships"]


def test_field_inside_a_removed_section_does_not_disturb_the_page():
    view = '<a><section data-section="Arc"><b data-field="title"></b></section></a><i data-section="Concept"></i>'
    page, _, _ = render_view.fill_view(view, SHEET)
    assert page.startswith('<a></a><i data-section="Concept"><div data-md="0">')


def test_view_keeps_its_own_markup_and_adds_no_default_css():
    page = render_view.render_into_view(SHEET, VIEW)
    assert "h1 { color: red; }" in page
    assert "--code-bg" not in page
    assert page.index('id="view-data"') < page.index("</body>")
    assert payload(page)["layout"] == "view"


def test_view_payload_cannot_close_the_script():
    page = render_view.render_into_view("# T\n\n## Concept\n\n</script>x\n", '<div data-section="Concept"></div>')
    assert "</script" not in re.search(r'id="view-data">(.*?)</script>', page, re.DOTALL).group(1)


def test_css_style_goes_into_a_view(tmp_path):
    page = render_view.render_into_view(SHEET, VIEW, "body { color: hotpink; }")
    assert page.index("hotpink") < page.index("</head>")


def test_view_file_layout_writes_the_page(tmp_path, project, capsys):
    doc = tmp_path / "character-wren.md"
    doc.write_text(SHEET, encoding="utf-8")
    view = tmp_path / "sheet.html"
    view.write_text('<body><div data-section="Concept"></div></body>', encoding="utf-8")
    assert render_view.main([*project, str(doc), "--layout", str(view)]) == 0
    captured = capsys.readouterr()
    assert "no slot in sheet.html for: Secrets, Relationships" in captured.err
    assert "A smuggler" in (tmp_path / "character-wren.html").read_text(encoding="utf-8")


def test_a_project_without_the_shared_scripts_is_told_to_run_setup(tmp_path):
    doc = tmp_path / "doc.md"
    doc.write_text("# T\n", encoding="utf-8")
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--project-root", str(tmp_path), str(doc)], capture_output=True, text=True
    )
    missing = tmp_path / "_bmad" / "scripts" / "frontmatter.py"
    assert result.returncode == 2
    assert result.stderr.splitlines() == [f"error: {missing} is missing. Run bmad setup for this project."]
    assert not (tmp_path / "doc.html").exists()


def test_unknown_layout_exits_2(tmp_path, project, capsys):
    doc = tmp_path / "doc.md"
    doc.write_text("# T\n", encoding="utf-8")
    assert render_view.main([*project, str(doc), "--layout", "poster"]) == 2
    assert "not a layout or an .html view file" in capsys.readouterr().err


SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'


def test_a_linked_image_beside_the_document_is_inlined(tmp_path):
    (tmp_path / "flow.svg").write_text(SVG, encoding="utf-8")
    text = render_view.inline_images('Before ![The flow](flow.svg "Flow") after.', tmp_path)
    assert text.startswith("Before ![The flow](data:image/svg+xml;base64,")
    assert text.endswith(' "Flow") after.')
    encoded = re.search(r"base64,([A-Za-z0-9+/=]+)", text).group(1)
    assert render_view.base64.b64decode(encoded).decode("utf-8") == SVG


def test_images_the_folder_does_not_hold_keep_their_links(tmp_path):
    (tmp_path / "docs").mkdir()
    (tmp_path / "secret.png").write_bytes(b"\x89PNG")
    (tmp_path / "docs" / "notes.txt").write_text("x", encoding="utf-8")
    text = "![a](../secret.png) ![b](https://example.com/x.png) ![c](absent.svg) ![d](notes.txt)"
    assert render_view.inline_images(text, tmp_path / "docs") == text


def test_an_image_inside_a_code_fence_is_left_alone(tmp_path):
    (tmp_path / "flow.svg").write_text(SVG, encoding="utf-8")
    text = "```\n![The flow](flow.svg)\n```\n"
    assert render_view.inline_images(text, tmp_path) == text


def test_an_image_inside_inline_code_is_left_alone(tmp_path):
    (tmp_path / "flow.svg").write_text(SVG, encoding="utf-8")
    text = "Write `![The flow](flow.svg)` or ``![The flow](flow.svg)`` to show ![The flow](flow.svg) here."
    out = render_view.inline_images(text, tmp_path)
    assert out.startswith(
        "Write `![The flow](flow.svg)` or ``![The flow](flow.svg)`` to show ![The flow](data:image/svg+xml;base64,"
    )
    assert out.endswith(") here.")


def test_an_image_with_code_in_its_alt_text_is_inlined(tmp_path):
    (tmp_path / "states.svg").write_text(SVG, encoding="utf-8")
    out = render_view.inline_images("See `x`: ![The `Booking` states](states.svg) and `y`.", tmp_path)
    assert out.startswith("See `x`: ![The `Booking` states](data:image/svg+xml;base64,")
    assert out.endswith(") and `y`.")


def test_the_page_carries_the_inlined_image(tmp_path, project, capsys):
    (tmp_path / "flow.svg").write_text(SVG, encoding="utf-8")
    doc = tmp_path / "doc.md"
    doc.write_text("# T\n\n![The flow](flow.svg)\n", encoding="utf-8")
    assert render_view.main([*project, str(doc)]) == 0
    capsys.readouterr()
    assert "data:image/svg+xml;base64," in payload((tmp_path / "doc.html").read_text(encoding="utf-8"))["markdown"]
