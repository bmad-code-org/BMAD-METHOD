#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""render-view — turn a finished markdown document into one self-contained HTML view.

The markdown travels in the page as JSON and is rendered in the browser by marked, with
mermaid drawing every mermaid code block; both load from jsDelivr at pinned versions. With
no network the page still shows the raw markdown in <pre> blocks. Raw HTML in the markdown
is shown as text and javascript:, vbscript: and non-image data: links are dropped.

  --layout document   the whole document as one readable page (default)
  --layout slides     the `# ` title is slide 1, then one slide per `## ` section. A bold
                      first line replaces the section heading as the slide title, and a
                      trailing blockquote becomes speaker notes, kept out of the slide DOM:
                      `n` shows them under the slide, `p` opens them in a presenter window.
                      A `## Table of Contents` section gets no slide.
  --layout <file>     an .html view file, its markup and inline CSS kept as written. Slots are
                      attributes: `data-section="Heading"` takes that `## ` section (inside its
                      `data-body` child when it has one, so a label can sit beside the content),
                      `data-field="key"` takes a frontmatter value, and `data-rest` takes every
                      section no slot names. A slot with nothing to show is removed with its
                      element. With no `data-rest`, a section with no slot is named on stderr.

Frontmatter and <!-- comments --> are stripped. `--style` inlines a .css file after the
default CSS; any other file is ignored with a warning. Prints the output path on success;
exits 2 when the document is missing.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

MARKED = "https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"
MERMAID = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"

FENCE_OPEN = re.compile(r"^ {0,3}(`{3,}|~{3,})")
COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)
FRONTMATTER = re.compile(r"\A---[ \t]*\n(.*?)\n---[ \t]*(?:\n|\Z)", re.DOTALL)
H1 = re.compile(r"^# +(.+?)[ \t#]*$")
H2 = re.compile(r"^## +(.+?)[ \t#]*$")
QUOTE = re.compile(r"^ {0,3}> ?")
BOLD_LINE = re.compile(r"^(\*\*|__)(.+)\1[ \t]*$")

LAYOUTS = ("document", "slides")
SLOT_ATTRS = {"data-section", "data-field", "data-rest", "data-body"}
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr",
}  # fmt: skip


def code_mask(lines: list[str]) -> list[bool]:
    """True for each line inside (or fencing) a fenced code block."""
    mask, fence = [], None
    for line in lines:
        m = FENCE_OPEN.match(line)
        if fence is None:
            if m:
                fence = m.group(1)
            mask.append(fence is not None)
        else:
            mask.append(True)
            if m and m.group(1)[0] == fence[0] and len(m.group(1)) >= len(fence) and not line.strip(" `~"):
                fence = None
    return mask


def strip_comments(text: str) -> str:
    """Remove HTML comments outside fenced code blocks."""
    lines = text.split("\n")
    out, prose = [], []
    for line, in_code in zip(lines, code_mask(lines), strict=True):
        if in_code:
            if prose:
                out.append(COMMENT.sub("", "\n".join(prose)))
                prose = []
            out.append(line)
        else:
            prose.append(line)
    if prose:
        out.append(COMMENT.sub("", "\n".join(prose)))
    return "\n".join(out)


def split_frontmatter(text: str) -> tuple[str, str]:
    """Return (frontmatter block without fences, body). No frontmatter: ("", text)."""
    m = FRONTMATTER.match(text)
    if not m:
        return "", text
    return m.group(1), text[m.end() :]


def frontmatter_value(frontmatter: str, key: str) -> str:
    m = re.search(rf"^{re.escape(key)}:[ \t]*(.*?)[ \t]*$", frontmatter, re.MULTILINE)
    if not m:
        return ""
    value = m.group(1)
    if len(value) >= 2 and value[0] == value[-1] == '"':
        return value[1:-1].replace('\\"', '"')
    if len(value) >= 2 and value[0] == value[-1] == "'":
        return value[1:-1].replace("''", "'")
    return value


def frontmatter_title(frontmatter: str) -> str:
    return frontmatter_value(frontmatter, "title")


def clean(text: str) -> tuple[str, str]:
    """Strip comments. Returns (frontmatter block, markdown body)."""
    frontmatter, body = split_frontmatter(strip_comments(text.replace("\r\n", "\n")).lstrip())
    return frontmatter, body.strip("\n") + "\n"


def prepare(text: str) -> tuple[str, str]:
    """Strip comments and frontmatter. Returns (title from frontmatter, markdown body)."""
    frontmatter, body = clean(text)
    return frontmatter_title(frontmatter), body


def first_h1(body: str) -> str:
    lines = body.split("\n")
    for line, in_code in zip(lines, code_mask(lines), strict=True):
        m = not in_code and H1.match(line)
        if m:
            return m.group(1)
    return ""


def split_notes(lines: list[str]) -> tuple[list[str], list[str]]:
    """Split a trailing blockquote off as speaker notes. Returns (content lines, notes lines)."""
    end = len(lines)
    while end and not lines[end - 1].strip():
        end -= 1
    start = end
    while start and (QUOTE.match(lines[start - 1]) or not lines[start - 1].strip()):
        start -= 1
    while start < end and not lines[start].strip():
        start += 1
    if start == end:
        return lines[:end], []
    return lines[:start], [QUOTE.sub("", line) for line in lines[start:end]]


def make_slide(heading: str, lines: list[str], *, title_slide: bool = False) -> dict:
    content, notes = split_notes(lines)
    while content and not content[0].strip():
        content.pop(0)
    title = heading
    m = not title_slide and content and BOLD_LINE.match(content[0].strip())
    if m and m.group(1) not in m.group(2):
        title = m.group(2).strip()
        content = content[1:]
    return {
        "section": heading,
        "title": title,
        "body": "\n".join(content).strip("\n"),
        "notes": "\n".join(notes).strip("\n"),
        "title_slide": title_slide,
    }


def h2_groups(body: str) -> list[tuple[str | None, list[str]]]:
    """The lines before the first `## ` under None, then each `## ` heading with its lines."""
    lines = body.split("\n")
    groups: list[tuple[str | None, list[str]]] = [(None, [])]
    for line, in_code in zip(lines, code_mask(lines), strict=True):
        m = not in_code and H2.match(line)
        if m:
            groups.append((m.group(1), []))
        else:
            groups[-1][1].append(line)
    return groups


def split_slides(body: str, fallback_title: str = "") -> list[dict]:
    """One slide for the part before the first `## ` (the `# ` title), then one per `## ` section."""
    groups = h2_groups(body)
    slides = []
    _, preamble = groups[0]
    if any(line.strip() for line in preamble):
        heading = fallback_title
        mask = code_mask(preamble)
        for i, line in enumerate(preamble):
            m = not mask[i] and H1.match(line)
            if m:
                heading = m.group(1)
                preamble = preamble[:i] + preamble[i + 1 :]
                break
        slides.append(make_slide(heading, preamble, title_slide=True))
    slides.extend(make_slide(heading, group) for heading, group in groups[1:] if heading.lower() != "table of contents")
    return slides


class SlotElements(HTMLParser):
    """Finds each element with a slot attribute: `start` and `end` around it, `inner` and `close` around its contents."""

    def __init__(self, page: str):
        super().__init__(convert_charrefs=False)
        self.page = page
        self.line_starts = [0] + [m.end() for m in re.finditer("\n", page)]
        self.stack: list[dict] = []
        self.found: list[dict] = []
        self.feed(page)
        self.close()

    def position(self) -> int:
        line, column = self.getpos()
        return self.line_starts[line - 1] + column

    def handle_starttag(self, tag, attrs):
        if tag not in VOID_TAGS:
            start = self.position()
            self.stack.append(
                {"tag": tag, "attrs": dict(attrs), "start": start, "inner": start + len(self.get_starttag_text())}
            )

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]["tag"] == tag:
                element = self.stack[i]
                del self.stack[i:]
                if SLOT_ATTRS & element["attrs"].keys():
                    close = self.position()
                    self.found.append({**element, "close": close, "end": self.page.index(">", close) + 1})
                return


def fill_view(view: str, markdown_text: str) -> tuple[str, list[str], list[str]]:
    """Fill a view's slots. Returns (page, markdown for the browser to render, sections with no slot)."""
    frontmatter, body = clean(markdown_text)
    sections = {
        heading.lower(): (heading, "\n".join(lines).strip())
        for heading, lines in h2_groups(body)[1:]
        if heading.lower() != "table of contents"
    }
    elements = SlotElements(view).found
    pieces: list[str] = []
    edits: list[tuple[int, int, str]] = []

    def fill(element: dict, text: str) -> None:
        if text:
            pieces.append(text)
            slot = f'<div data-md="{len(pieces) - 1}">{fallback(text)}</div>'
            edits.append((element["inner"], element["close"], slot))
        else:
            edits.append((element["start"], element["end"], ""))

    claimed = set()
    for element in elements:
        key = element["attrs"].get("data-section")
        if key is None:
            continue
        claimed.add(key.strip().lower())
        text = sections.get(key.strip().lower(), ("", ""))[1]
        inside = (
            e
            for e in elements
            if "data-body" in e["attrs"] and element["start"] < e["start"] and e["end"] < element["end"]
        )
        fill(next(inside, element) if text else element, text)

    for element in elements:
        key = element["attrs"].get("data-field")
        if key is None:
            continue
        value = frontmatter_value(frontmatter, key.strip()) or (first_h1(body) if key.strip() == "title" else "")
        if value:
            edits.append((element["inner"], element["close"], html.escape(value)))
        else:
            edits.append((element["start"], element["end"], ""))

    left = [(heading, text) for key, (heading, text) in sections.items() if key not in claimed and text]
    rest = [element for element in elements if "data-rest" in element["attrs"]]
    for element in rest[:1]:
        fill(element, "\n\n".join(f"## {heading}\n\n{text}" for heading, text in left))

    # An edit inside one that replaces or removes its surroundings has nothing left to change.
    edits.sort(key=lambda edit: (edit[0], -edit[1]))
    kept, reach = [], 0
    for edit in edits:
        if edit[0] >= reach:
            kept.append(edit)
            reach = edit[1]
    for start, end, text in reversed(kept):
        view = view[:start] + text + view[end:]
    return view, pieces, [] if rest else [heading for heading, _ in left]


def insert_before(page: str, closing_tag: str, text: str) -> str:
    """`text` before the last `closing_tag`, or at the end of a page without one."""
    at = page.lower().rfind(closing_tag)
    return page + text if at < 0 else page[:at] + text + page[at:]


def load_style(path: str | None) -> str:
    """CSS text to inline after the default, or "" with a warning for anything that is not a .css file."""
    if not path:
        return ""
    p = Path(path)
    if p.suffix.lower() != ".css":
        print(f"render_view: ignoring --style {path}: not a .css file", file=sys.stderr)
        return ""
    try:
        return p.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as e:
        print(f"render_view: ignoring --style {path}: {e}", file=sys.stderr)
        return ""


def script_json(value) -> str:
    """JSON safe to place inside a <script> element."""
    return json.dumps(value, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")


def fallback(text: str) -> str:
    return f'<pre class="fallback">{html.escape(text)}</pre>' if text else ""


def scripts(payload: dict) -> str:
    return SCRIPTS.format(payload=script_json(payload), marked=MARKED, mermaid=MERMAID, js=JS)


def render_into_view(markdown_text: str, view: str, style_css: str = "", view_name: str = "the view") -> str:
    page, pieces, unplaced = fill_view(view, markdown_text)
    if unplaced:
        print(f"render_view: no slot in {view_name} for: {', '.join(unplaced)}", file=sys.stderr)
    page = insert_before(page, "</head>", f"<style>\n{VIEW_CSS}\n{style_css}\n</style>\n")
    return insert_before(page, "</body>", scripts({"layout": "view", "slots": pieces}))


def render(markdown_text: str, layout: str, style_css: str = "", name: str = "document") -> str:
    fm_title, body = prepare(markdown_text)
    title = fm_title or first_h1(body) or name
    if layout == "slides":
        slides = split_slides(body, title)
        sections = "\n".join(
            f'<section class="slide{" title-slide" if s["title_slide"] else ""}" data-n="{i + 1}">'
            f'<div class="slide-inner"><h1 class="slide-title">{html.escape(s["title"])}</h1>'
            f'<div class="slide-body">{fallback(s["body"])}</div></div></section>'
            for i, s in enumerate(slides)
        )
        main = (
            f'<main id="deck">\n{sections}\n</main>\n<aside id="notes-panel" hidden></aside>\n<div id="counter"></div>'
        )
        payload = {"layout": "slides", "slides": slides}
    else:
        main = f'<main id="doc">{fallback(body)}</main>'
        payload = {"layout": "document", "markdown": body}
    custom = f"<style>\n{style_css}\n</style>\n" if style_css else ""
    return PAGE.format(
        title=html.escape(title),
        layout=layout,
        css=CSS,
        custom=custom,
        main=main,
        scripts=scripts(payload),
    )


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Render a markdown document as a self-contained HTML view.")
    ap.add_argument("document", help="the markdown document")
    ap.add_argument("--layout", default="document", help="document, slides, or an .html view file")
    ap.add_argument("--style", help="a .css file to inline; any other file is ignored")
    ap.add_argument("--out", help="output path (default: the document path with .html)")
    args = ap.parse_args(argv)

    doc = Path(args.document)
    if not doc.is_file():
        print(f"render_view: {doc} not found", file=sys.stderr)
        return 2
    out = Path(args.out) if args.out else doc.with_suffix(".html")
    text = doc.read_text(encoding="utf-8-sig")
    if args.layout in LAYOUTS:
        page = render(text, args.layout, load_style(args.style), doc.stem)
    else:
        view = Path(args.layout)
        if view.suffix.lower() != ".html" or not view.is_file():
            print(f"render_view: --layout {view}: not a layout or an .html view file", file=sys.stderr)
            return 2
        page = render_into_view(text, view.read_text(encoding="utf-8-sig"), load_style(args.style), view.name)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    print(out)
    return 0


CSS = """
:root {
  color-scheme: light dark;
  --bg: #ffffff; --fg: #1f2328; --muted: #59636e; --accent: #0b5cad;
  --rule: #d8dee4; --code-bg: #f3f5f7; --quote: #59636e;
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #15181d; --fg: #e3e6ea; --muted: #9aa3ad; --accent: #6cb0ff;
    --rule: #30363d; --code-bg: #1e232a; --quote: #9aa3ad; }
}
@media print {
  :root { --bg: #ffffff; --fg: #000000; --muted: #444444; --accent: #000000;
    --rule: #bbbbbb; --code-bg: #f3f3f3; --quote: #444444; }
}
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--fg); }
body { font: 17px/1.6 var(--font); -webkit-text-size-adjust: 100%; }
a { color: var(--accent); }
h1, h2, h3, h4 { line-height: 1.25; margin: 1.6em 0 0.5em; }
h1 { font-size: 2em; margin-top: 0; }
h2 { font-size: 1.45em; padding-bottom: 0.25em; border-bottom: 1px solid var(--rule); }
h3 { font-size: 1.2em; }
p, ul, ol, table, pre, blockquote { margin: 0 0 1em; }
li > ul, li > ol { margin: 0.25em 0; }
code { font: 0.9em var(--mono); background: var(--code-bg); padding: 0.1em 0.35em; border-radius: 4px; }
pre { background: var(--code-bg); padding: 0.9em 1em; border-radius: 6px; overflow-x: auto; }
pre code { background: none; padding: 0; font-size: 0.85em; }
pre.fallback { white-space: pre-wrap; word-wrap: break-word; font: 0.9em/1.55 var(--mono); }
blockquote { margin-left: 0; padding: 0.1em 1em; border-left: 4px solid var(--rule); color: var(--quote); }
table { border-collapse: collapse; display: block; overflow-x: auto; }
th, td { border: 1px solid var(--rule); padding: 0.4em 0.7em; text-align: left; vertical-align: top; }
th { background: var(--code-bg); }
hr { border: 0; border-top: 1px solid var(--rule); margin: 2em 0; }
img, svg { max-width: 100%; }
.mermaid { text-align: center; margin: 0 0 1em; }

#doc { max-width: 46rem; margin: 0 auto; padding: 3rem 1.25rem 4rem; }

body.slides { overflow: hidden; }
#deck { position: fixed; inset: 0; }
.slide { position: absolute; inset: 0; visibility: hidden; overflow: auto;
  display: flex; padding: 5vh 7vw;
  font-size: clamp(16px, 1.25vw + 1.1vh, 34px); }
.slide.active { visibility: visible; }
.slide-inner { width: 100%; max-width: 62em; margin: auto; }
.slide-title { font-size: 1.75em; margin: 0 0 0.8em; border: 0; }
.title-slide .slide-inner { text-align: center; }
.title-slide .slide-title { font-size: 2.4em; }
.slide-body > :last-child { margin-bottom: 0; }
.slide-body h2, .slide-body h3 { border: 0; }
.slide-body .mermaid svg { max-height: 60vh; }
#counter { position: fixed; right: 1.2em; bottom: 0.8em; font-size: 14px; color: var(--muted); }
#notes-panel { position: fixed; left: 0; right: 0; bottom: 0; max-height: 35vh; overflow: auto;
  padding: 1em 7vw 2.2em; background: var(--code-bg); border-top: 1px solid var(--rule); font-size: 18px; }
#notes-panel[hidden] { display: none; }

@media print {
  #doc { max-width: none; padding: 0; }
  pre, blockquote, table, .mermaid { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  body.slides { overflow: visible; }
  @page { size: landscape; margin: 0.5in; }
  #deck { position: static; }
  .slide { position: relative; inset: auto; visibility: visible; overflow: visible;
    height: 7in; padding: 0.4in 0.6in; font-size: 18pt; break-after: page; break-inside: avoid; }
  .slide:last-child { break-after: auto; }
  #counter, #notes-panel { display: none !important; }
}
"""

VIEW_CSS = "pre.fallback { white-space: pre-wrap; word-wrap: break-word; }"

JS = r"""
(function () {
  var data = JSON.parse(document.getElementById('view-data').textContent);
  var hasMarked = false;

  function md(text) { return hasMarked ? window.marked.parse(text) : null; }
  function inline(text) { return hasMarked ? window.marked.parseInline(text) : null; }

  function load(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function drawDiagrams() {
    var blocks = document.querySelectorAll('pre > code.language-mermaid');
    if (!blocks.length) return;
    var nodes = [];
    blocks.forEach(function (code) {
      var div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code.textContent;
      code.parentNode.replaceWith(div);
      nodes.push(div);
    });
    load(MERMAID_SRC).then(function () {
      var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      window.mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default', securityLevel: 'strict' });
      return window.mermaid.run({ nodes: nodes, suppressErrors: true });
    }).catch(function () {
      nodes.forEach(function (div) {
        if (div.querySelector('svg')) return;
        var pre = document.createElement('pre');
        pre.className = 'fallback';
        pre.textContent = div.textContent;
        div.replaceWith(pre);
      });
    });
  }

  function renderDocument() {
    var html = md(data.markdown);
    if (html === null) return;
    var doc = document.getElementById('doc');
    doc.innerHTML = html;
    // marked adds no heading ids, and table-of-contents links need GitHub's anchors.
    var seen = {};
    doc.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (h) {
      var base = h.textContent.trim().toLowerCase().replace(/[^\p{L}\p{N}_\- ]/gu, '').replace(/ /g, '-');
      h.id = seen[base] ? base + '-' + seen[base] : base;
      seen[base] = (seen[base] || 0) + 1;
    });
  }

  function renderSlides() {
    document.querySelectorAll('.slide').forEach(function (el, i) {
      var s = data.slides[i];
      var t = inline(s.title);
      if (t !== null) el.querySelector('.slide-title').innerHTML = t;
      var b = md(s.body);
      if (b !== null) el.querySelector('.slide-body').innerHTML = b;
    });
  }

  function notesHtml(i) {
    var s = data.slides[i];
    if (!s.notes) return '<p class="empty">No notes for this slide.</p>';
    var h = md(s.notes);
    if (h !== null) return h;
    var pre = document.createElement('pre');
    pre.className = 'fallback';
    pre.textContent = s.notes;
    return pre.outerHTML;
  }

  function startDeck() {
    var slides = document.querySelectorAll('.slide');
    var total = slides.length;
    var current = 0;
    var panel = document.getElementById('notes-panel');
    var counter = document.getElementById('counter');
    var presenter = null;
    document.body.classList.add('slides');

    function fromHash() {
      var m = /^#(\d+)$/.exec(location.hash);
      if (!m) return null;
      var n = parseInt(m[1], 10);
      return n >= 1 && n <= total ? n - 1 : null;
    }

    function updatePresenter() {
      if (!presenter || presenter.closed) return;
      var d = presenter.document;
      var s = data.slides[current];
      d.getElementById('pos').textContent = (current + 1) + ' / ' + total;
      d.getElementById('section').textContent = s.section && s.section !== s.title ? s.section : '';
      d.getElementById('title').innerHTML = slides[current].querySelector('.slide-title').innerHTML;
      d.getElementById('notes').innerHTML = notesHtml(current);
      d.getElementById('next').textContent = current + 1 < total ? 'Next: ' + data.slides[current + 1].title : 'Last slide';
    }

    function show(i) {
      if (!total) return;
      current = Math.max(0, Math.min(total - 1, i));
      slides.forEach(function (el, j) { el.classList.toggle('active', j === current); });
      counter.textContent = (current + 1) + ' / ' + total;
      if (!panel.hidden) panel.innerHTML = notesHtml(current);
      // Some browsers refuse replaceState on file:// pages.
      try { if (location.hash !== '#' + (current + 1)) history.replaceState(null, '', '#' + (current + 1)); } catch (e) {}
      updatePresenter();
    }

    function toggleNotes() {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) panel.innerHTML = notesHtml(current);
    }

    function openPresenter() {
      if (presenter && !presenter.closed) { presenter.focus(); return; }
      presenter = window.open('', 'deck-presenter', 'width=760,height=600');
      if (!presenter) { toggleNotes(); return; }
      var d = presenter.document;
      d.open();
      d.write(PRESENTER_HTML);
      d.close();
      d.addEventListener('keydown', onKey);
      updatePresenter();
    }

    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) show(current + 1);
      else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) show(current - 1);
      else if (k === 'Home') show(0);
      else if (k === 'End') show(total - 1);
      else if (k === 'n' || k === 'N') toggleNotes();
      else if (k === 'p' || k === 'P') openPresenter();
      else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      } else return;
      e.preventDefault();
    }

    document.addEventListener('keydown', onKey);
    document.getElementById('deck').addEventListener('click', function (e) {
      if (e.target.closest('a') || String(window.getSelection())) return;
      show(e.clientX < window.innerWidth / 3 ? current - 1 : current + 1);
    });
    window.addEventListener('hashchange', function () {
      var n = fromHash();
      if (n !== null && n !== current) show(n);
    });
    window.addEventListener('beforeunload', function () { if (presenter && !presenter.closed) presenter.close(); });
    var start = fromHash();
    show(start === null ? 0 : start);
  }

  function renderSlots() {
    document.querySelectorAll('[data-md]').forEach(function (el) {
      var h = md(data.slots[+el.getAttribute('data-md')]);
      if (h !== null) el.innerHTML = h;
    });
  }

  function renderAll() {
    if (data.layout === 'slides') renderSlides();
    else if (data.layout === 'view') renderSlots();
    else renderDocument();
    if (hasMarked) drawDiagrams();
  }

  if (data.layout === 'slides') startDeck();
  // A document can carry text from outside sources, so raw HTML shows as text and script URLs are dropped.
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function unsafeUrl(href) {
    var h = String(href || '').replace(/[\s\u0000-\u001f]/g, '').toLowerCase();
    return /^(javascript|vbscript):/.test(h) || (/^data:/.test(h) && !/^data:image\/(png|gif|jpe?g|webp);/.test(h));
  }
  function harden() {
    window.marked.use({ renderer: {
      html: function (h) { return escapeHtml(h); },
      link: function (href, title, text) { return unsafeUrl(href) ? text : false; },
      image: function (href, title, text) { return unsafeUrl(href) ? escapeHtml(text) : false; }
    } });
  }

  load(MARKED_SRC).then(function () { hasMarked = !!window.marked; if (hasMarked) harden(); }, function () {}).then(renderAll);
})();
"""

PRESENTER = """<!doctype html><html><head><meta charset="utf-8"><title>Speaker notes</title><style>
:root { color-scheme: light dark; --bg: #ffffff; --fg: #1f2328; --muted: #59636e; }
@media (prefers-color-scheme: dark) { :root { --bg: #15181d; --fg: #e3e6ea; --muted: #9aa3ad; } }
body { margin: 0; padding: 1.2em 1.6em; background: var(--bg); color: var(--fg);
  font: 20px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
header { display: flex; justify-content: space-between; color: var(--muted); font-size: 15px; }
h1 { font-size: 1.3em; margin: 0.4em 0 0.8em; }
#next { color: var(--muted); font-size: 15px; border-top: 1px solid var(--muted); padding-top: 0.6em; margin-top: 1.5em; }
.empty { color: var(--muted); }
pre { white-space: pre-wrap; font: inherit; }
</style></head><body><header><span id="section"></span><span id="pos"></span></header>
<h1 id="title"></h1><div id="notes"></div><div id="next"></div></body></html>"""

PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>{css}</style>
{custom}</head>
<body class="layout-{layout}">
{main}
{scripts}</body>
</html>
"""

SCRIPTS = """<script type="application/json" id="view-data">{payload}</script>
<script>
var MARKED_SRC = "{marked}";
var MERMAID_SRC = "{mermaid}";
var PRESENTER_HTML = {presenter};
{js}
</script>
""".replace("{presenter}", script_json(PRESENTER).replace("{", "{{").replace("}", "}}"))


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
