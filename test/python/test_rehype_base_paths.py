# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Pytest parity for website/src/rehype-base-paths.js.

Ports every assertion from the retired test/test-rehype-plugins.mjs runner
that exercises the `rehypeBasePaths` default-export transformer, plus the
4 "both plugins together" integration cases, which also call
`rehypeMarkdownLinks`. Calls the real JS exports through js_bridge rather
than reimplementing base-path logic in Python.

`rehypeBasePaths`/`rehypeMarkdownLinks` are default-export factories
(`options => (tree, file) => void`), ported via `js_bridge.transform`.

Each `js_bridge.transform` call returns a *new* tree (JSON round-tripped
through a Node subprocess) rather than mutating the input tree in place, so
tests rebind `tree = transform_base(...)` instead of relying on the JS
suite's in-place-mutation idiom.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "support"))
import js_bridge  # noqa: E402

REHYPE_BASE_PATHS = "website/src/rehype-base-paths.js"
REHYPE_MARKDOWN_LINKS = "website/src/rehype-markdown-links.js"

STD_FILE = {"path": "/project/src/content/docs/guide/intro.md"}
STD_OPTS = {"contentDir": "/project/src/content/docs"}
BASE = "/BMAD-METHOD/"


def transform_base(tree, options=None):
    if options is None:
        options = {}
    return js_bridge.transform(REHYPE_BASE_PATHS, "default", options, tree)


def transform_links(tree, file, options):
    return js_bridge.transform(REHYPE_MARKDOWN_LINKS, "default", options, tree, file)


def make_anchor_tree(href):
    return {
        "type": "root",
        "children": [
            {
                "type": "element",
                "tagName": "a",
                "properties": {"href": href},
                "children": [{"type": "text", "value": "link"}],
            }
        ],
    }


def make_element_tree(tag_name, properties):
    return {
        "type": "root",
        "children": [
            {
                "type": "element",
                "tagName": tag_name,
                "properties": dict(properties),
                "children": [],
            }
        ],
    }


def get_href(tree):
    return tree["children"][0]["properties"]["href"]


def get_src(tree):
    return tree["children"][0]["properties"]["src"]


def get_raw_value(tree):
    return tree["children"][0]["value"]


# ─── Option handling (5 tests) ──────────────────────────────────────────────


def test_option_handling_default_no_op_for_absolute_href():
    tree = transform_base(make_anchor_tree("/page/"), {})
    assert get_href(tree) == "/page/"


def test_option_handling_base_bmad_method_prefixes():
    tree = transform_base(make_anchor_tree("/page/"), {"base": "/BMAD-METHOD/"})
    assert get_href(tree) == "/BMAD-METHOD/page/"


def test_option_handling_base_normalizes_adds_trailing_slash():
    tree = transform_base(make_anchor_tree("/page/"), {"base": "/BMAD-METHOD"})
    assert get_href(tree) == "/BMAD-METHOD/page/"


def test_option_handling_empty_string_falls_back_to_root_no_op():
    tree = transform_base(make_anchor_tree("/page/"), {"base": ""})
    assert get_href(tree) == "/page/"


def test_option_handling_root_is_no_op():
    tree = transform_base(make_anchor_tree("/page/"), {"base": "/"})
    assert get_href(tree) == "/page/"


# ─── Element rewriting (9 tests) ────────────────────────────────────────────


def test_element_rewriting_anchor_href_prefixed():
    tree = transform_base(make_anchor_tree("/page/"), {"base": BASE})
    assert get_href(tree) == "/BMAD-METHOD/page/"


def test_element_rewriting_img_src_prefixed():
    tree = transform_base(make_element_tree("img", {"src": "/img/logo.png"}), {"base": BASE})
    assert get_src(tree) == "/BMAD-METHOD/img/logo.png"


def test_element_rewriting_link_href_prefixed():
    tree = transform_base(
        make_element_tree("link", {"href": "/styles/main.css"}), {"base": BASE}
    )
    assert tree["children"][0]["properties"]["href"] == "/BMAD-METHOD/styles/main.css"


def test_element_rewriting_script_src_not_prefixed():
    tree = transform_base(make_element_tree("script", {"src": "/js/app.js"}), {"base": BASE})
    assert get_src(tree) == "/js/app.js"


def test_element_rewriting_video_src_prefixed():
    tree = transform_base(
        make_element_tree("video", {"src": "/media/intro.mp4"}), {"base": BASE}
    )
    assert get_src(tree) == "/BMAD-METHOD/media/intro.mp4"


def test_element_rewriting_audio_src_prefixed():
    tree = transform_base(
        make_element_tree("audio", {"src": "/media/clip.mp3"}), {"base": BASE}
    )
    assert get_src(tree) == "/BMAD-METHOD/media/clip.mp3"


def test_element_rewriting_iframe_src_prefixed():
    tree = transform_base(
        make_element_tree("iframe", {"src": "/embed/widget"}), {"base": BASE}
    )
    assert get_src(tree) == "/BMAD-METHOD/embed/widget"


def test_element_rewriting_area_href_not_prefixed():
    tree = transform_base(make_element_tree("area", {"href": "/map/region"}), {"base": BASE})
    assert tree["children"][0]["properties"]["href"] == "/map/region"


def test_element_rewriting_source_src_prefixed():
    tree = transform_base(
        make_element_tree("source", {"src": "/media/alt.mp4"}), {"base": BASE}
    )
    assert get_src(tree) == "/BMAD-METHOD/media/alt.mp4"


# ─── No-op base / (2 tests) ─────────────────────────────────────────────────


def test_no_op_base_anchor_href_unchanged():
    tree = transform_base(make_anchor_tree("/page/"), {"base": "/"})
    assert get_href(tree) == "/page/"


def test_no_op_base_img_src_unchanged():
    tree = transform_base(make_element_tree("img", {"src": "/img/logo.png"}), {"base": "/"})
    assert get_src(tree) == "/img/logo.png"


# ─── Skip conditions (10 tests) ─────────────────────────────────────────────


def test_skip_protocol_relative():
    tree = transform_base(make_anchor_tree("//cdn.example.com/path"), {"base": BASE})
    assert get_href(tree) == "//cdn.example.com/path"


def test_skip_external_https():
    tree = transform_base(make_anchor_tree("https://example.com"), {"base": BASE})
    assert get_href(tree) == "https://example.com"


def test_skip_external_http():
    tree = transform_base(make_anchor_tree("http://example.com"), {"base": BASE})
    assert get_href(tree) == "http://example.com"


def test_skip_data_uri():
    tree = transform_base(make_anchor_tree("data:text/html,hello"), {"base": BASE})
    assert get_href(tree) == "data:text/html,hello"


def test_skip_hash_section():
    tree = transform_base(make_anchor_tree("#section"), {"base": BASE})
    assert get_href(tree) == "#section"


def test_skip_empty_href():
    tree = transform_base(make_anchor_tree(""), {"base": BASE})
    assert get_href(tree) == ""


def test_skip_already_prefixed():
    tree = transform_base(make_anchor_tree("/BMAD-METHOD/page/"), {"base": BASE})
    assert get_href(tree) == "/BMAD-METHOD/page/"


def test_skip_relative_path():
    tree = transform_base(make_anchor_tree("relative/path"), {"base": BASE})
    assert get_href(tree) == "relative/path"


def test_skip_non_target_element_button():
    tree = transform_base(make_element_tree("button", {"href": "/page/"}), {"base": BASE})
    assert tree["children"][0]["properties"]["href"] == "/page/"


def test_skip_non_target_attribute_data_url():
    tree = transform_base(
        make_element_tree("img", {"src": "/img/logo.png", "data-url": "/some/path"}),
        {"base": BASE},
    )
    assert tree["children"][0]["properties"]["data-url"] == "/some/path"


# ─── Anchor .md handling (4 tests) ──────────────────────────────────────────


def test_md_handling_href_skipped():
    tree = transform_base(make_anchor_tree("/docs/guide/page.md"), {"base": BASE})
    assert get_href(tree) == "/docs/guide/page.md"


def test_md_handling_href_with_hash_skipped():
    tree = transform_base(make_anchor_tree("/docs/guide/page.md#section"), {"base": BASE})
    assert get_href(tree) == "/docs/guide/page.md#section"


def test_md_handling_href_with_query_skipped():
    tree = transform_base(make_anchor_tree("/docs/guide/page.md?v=1"), {"base": BASE})
    assert get_href(tree) == "/docs/guide/page.md?v=1"


def test_md_handling_index_md_skipped():
    tree = transform_base(make_anchor_tree("/docs/index.md"), {"base": BASE})
    assert get_href(tree) == "/docs/index.md"


# ─── srcset (1 test) ─────────────────────────────────────────────────────────


def test_srcset_not_handled_by_plugin():
    tree = transform_base(
        make_element_tree(
            "img", {"src": "/img/logo.png", "srcset": "/img/logo-2x.png 2x"}
        ),
        {"base": BASE},
    )
    assert tree["children"][0]["properties"]["srcset"] == "/img/logo-2x.png 2x"


# ─── Raw HTML (7 tests) ──────────────────────────────────────────────────────


def test_raw_html_img_src_rewritten():
    tree = {
        "type": "root",
        "children": [{"type": "raw", "value": '<img src="/img/logo.png">'}],
    }
    tree = transform_base(tree, {"base": BASE})
    assert get_raw_value(tree) == '<img src="/BMAD-METHOD/img/logo.png">'


def test_raw_html_a_href_rewritten():
    tree = {
        "type": "root",
        "children": [{"type": "raw", "value": '<a href="/page/">link</a>'}],
    }
    tree = transform_base(tree, {"base": BASE})
    assert get_raw_value(tree) == '<a href="/BMAD-METHOD/page/">link</a>'


def test_raw_html_protocol_relative_unchanged():
    tree = {
        "type": "root",
        "children": [
            {"type": "raw", "value": '<img src="//cdn.example.com/img.png">'}
        ],
    }
    tree = transform_base(tree, {"base": BASE})
    assert get_raw_value(tree) == '<img src="//cdn.example.com/img.png">'


def test_raw_html_already_prefixed_unchanged():
    tree = {
        "type": "root",
        "children": [
            {"type": "raw", "value": '<img src="/BMAD-METHOD/img/logo.png">'}
        ],
    }
    tree = transform_base(tree, {"base": BASE})
    assert get_raw_value(tree) == '<img src="/BMAD-METHOD/img/logo.png">'


def test_raw_html_multiple_attributes_rewritten():
    tree = {
        "type": "root",
        "children": [
            {
                "type": "raw",
                "value": '<a href="/page/"><img src="/img/logo.png"></a>',
            }
        ],
    }
    tree = transform_base(tree, {"base": BASE})
    assert (
        get_raw_value(tree)
        == '<a href="/BMAD-METHOD/page/"><img src="/BMAD-METHOD/img/logo.png"></a>'
    )


def test_raw_html_external_url_unchanged():
    tree = {
        "type": "root",
        "children": [
            {"type": "raw", "value": '<a href="https://example.com">external</a>'}
        ],
    }
    tree = transform_base(tree, {"base": BASE})
    assert get_raw_value(tree) == '<a href="https://example.com">external</a>'


def test_raw_html_base_root_skips_raw_visit():
    tree = {
        "type": "root",
        "children": [{"type": "raw", "value": '<img src="/img/logo.png">'}],
    }
    tree = transform_base(tree, {"base": "/"})
    assert get_raw_value(tree) == '<img src="/img/logo.png">'


# ─── Integration: both plugins together (4 tests) ──────────────────────────


def test_integration_sibling_md_through_both_no_double_prefix():
    tree = make_anchor_tree("./sibling.md")
    tree = transform_links(tree, STD_FILE, {**STD_OPTS, "base": BASE})
    tree = transform_base(tree, {"base": BASE})
    assert get_href(tree) == "/BMAD-METHOD/guide/sibling/"


def test_integration_img_only_base_paths_prefixes():
    # markdown-links doesn't touch img elements, so only run base-paths.
    tree = make_element_tree("img", {"src": "/img/logo.png"})
    tree = transform_base(tree, {"base": BASE})
    assert get_src(tree) == "/BMAD-METHOD/img/logo.png"


def test_integration_external_both_skip():
    tree = make_anchor_tree("https://example.com")
    tree = transform_links(tree, STD_FILE, {**STD_OPTS, "base": BASE})
    tree = transform_base(tree, {"base": BASE})
    assert get_href(tree) == "https://example.com"


def test_integration_non_md_only_base_paths_prefixes():
    tree = make_anchor_tree("/page/")
    tree = transform_links(tree, STD_FILE, {**STD_OPTS, "base": BASE})
    tree = transform_base(tree, {"base": BASE})
    assert get_href(tree) == "/BMAD-METHOD/page/"
