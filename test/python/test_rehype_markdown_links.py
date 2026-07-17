# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Pytest parity for website/src/rehype-markdown-links.js.

Ports every assertion from the retired test/test-rehype-plugins.mjs runner
that exercises `findFirstDelimiter`, `detectContentDir`, and the
`rehypeMarkdownLinks` default-export transformer, calling the real JS
exports through js_bridge rather than reimplementing link-rewriting logic
in Python.

`findFirstDelimiter`/`detectContentDir` are bare named exports, ported via
`js_bridge.call`. `rehypeMarkdownLinks` is a default-export factory
(`options => (tree, file) => void`), ported via `js_bridge.transform`.

Each `js_bridge.transform` call returns a *new* tree (JSON round-tripped
through a Node subprocess) rather than mutating the input tree in place, so
tests rebind `tree = transform(...)` instead of relying on the JS suite's
in-place-mutation idiom.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent / "support"))
import js_bridge  # noqa: E402

REHYPE_MARKDOWN_LINKS = "website/src/rehype-markdown-links.js"

CONTENT_DIR = "/project/src/content/docs"
STD_FILE = {"path": "/project/src/content/docs/guide/intro.md"}
STD_OPTS = {"contentDir": CONTENT_DIR}


def find_first_delimiter(value: str):
    return js_bridge.call(REHYPE_MARKDOWN_LINKS, "findFirstDelimiter", value)


def detect_content_dir(path: str):
    return js_bridge.call(REHYPE_MARKDOWN_LINKS, "detectContentDir", path)


def transform(tree, file, options=None):
    if options is None:
        options = {}
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


def make_anchor_tree_no_href():
    """Wire equivalent of the JS suite's `properties: { href: undefined }`.

    JSON has no `undefined`; omitting the "href" key entirely is the closest
    analog and hits the same `typeof href !== 'string'` guard in the plugin
    (see spec Design Notes / I/O matrix).
    """
    return {
        "type": "root",
        "children": [
            {
                "type": "element",
                "tagName": "a",
                "properties": {},
                "children": [{"type": "text", "value": "link"}],
            }
        ],
    }


def get_href(tree):
    return tree["children"][0]["properties"]["href"]


def has_href(tree):
    return "href" in tree["children"][0]["properties"]


# ─── findFirstDelimiter helper (8 tests) ────────────────────────────────────


def test_find_first_delimiter_no_delimiters_returns_negative_one():
    assert find_first_delimiter("page") == -1


def test_find_first_delimiter_only_question_mark_returns_its_index():
    assert find_first_delimiter("page.md?v=1") == 7


def test_find_first_delimiter_only_hash_returns_its_index():
    assert find_first_delimiter("page.md#sec") == 7


def test_find_first_delimiter_question_mark_before_hash_returns_question_mark_index():
    assert find_first_delimiter("page.md?v=1#sec") == 7


def test_find_first_delimiter_hash_before_question_mark_returns_hash_index():
    assert find_first_delimiter("page.md#sec?v=1") == 7


def test_find_first_delimiter_empty_string_returns_negative_one():
    assert find_first_delimiter("") == -1


def test_find_first_delimiter_hash_at_position_zero_returns_zero():
    assert find_first_delimiter("#top") == 0


def test_find_first_delimiter_question_mark_at_position_zero_returns_zero():
    assert find_first_delimiter("?q=1") == 0


# ─── detectContentDir helper (6 tests) ──────────────────────────────────────


def test_detect_content_dir_standard_path_finds_content_dir():
    assert (
        detect_content_dir("/project/src/content/docs/guide/intro.md")
        == "/project/src/content/docs"
    )


def test_detect_content_dir_no_match_returns_null():
    assert detect_content_dir("/some/random/path/file.md") is None


def test_detect_content_dir_too_few_segments_returns_null():
    assert detect_content_dir("/src/content") is None


def test_detect_content_dir_exactly_three_matching_segments_returns_match():
    assert detect_content_dir("/src/content/docs") == "/src/content/docs"


def test_detect_content_dir_nested_double_match_finds_innermost():
    assert (
        detect_content_dir(
            "/a/src/content/docs/nested/src/content/docs/deep/file.md"
        )
        == "/a/src/content/docs/nested/src/content/docs"
    )


def test_detect_content_dir_empty_string_returns_null():
    assert detect_content_dir("") is None


# ─── Transformer skip conditions (21 tests) ─────────────────────────────────


def test_skip_external_https_url_unchanged():
    tree = transform(make_anchor_tree("https://example.com"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "https://example.com"


def test_skip_external_http_url_unchanged():
    tree = transform(make_anchor_tree("http://example.com"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "http://example.com"


def test_skip_protocol_relative_unchanged():
    tree = transform(make_anchor_tree("//cdn.example.com/path"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "//cdn.example.com/path"


def test_skip_mailto_unchanged():
    tree = transform(make_anchor_tree("mailto:user@example.com"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "mailto:user@example.com"


def test_skip_tel_unchanged():
    tree = transform(make_anchor_tree("tel:+15551234567"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "tel:+15551234567"


def test_skip_html_unchanged():
    tree = transform(make_anchor_tree("./page.html"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "./page.html"


def test_skip_pdf_unchanged():
    tree = transform(make_anchor_tree("./doc.pdf"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "./doc.pdf"


def test_skip_mdx_unchanged():
    tree = transform(make_anchor_tree("./page.mdx"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "./page.mdx"


def test_skip_hash_section_unchanged():
    tree = transform(make_anchor_tree("#section"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "#section"


def test_skip_query_only_unchanged():
    tree = transform(make_anchor_tree("?page=2"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "?page=2"


def test_skip_empty_href_unchanged():
    tree = transform(make_anchor_tree(""), STD_FILE, STD_OPTS)
    assert get_href(tree) == ""


def test_skip_non_anchor_element_div_unchanged():
    tree = {
        "type": "root",
        "children": [
            {
                "type": "element",
                "tagName": "div",
                "properties": {"href": "page.md"},
                "children": [],
            }
        ],
    }
    tree = transform(tree, STD_FILE, STD_OPTS)
    assert tree["children"][0]["properties"]["href"] == "page.md"


def test_skip_anchor_without_properties_unchanged_no_crash():
    tree = {
        "type": "root",
        "children": [{"type": "element", "tagName": "a", "children": []}],
    }
    # Must not raise.
    transform(tree, STD_FILE, STD_OPTS)


def test_skip_anchor_with_numeric_href_unchanged():
    tree = {
        "type": "root",
        "children": [
            {
                "type": "element",
                "tagName": "a",
                "properties": {"href": 42},
                "children": [],
            }
        ],
    }
    tree = transform(tree, STD_FILE, STD_OPTS)
    assert tree["children"][0]["properties"]["href"] == 42


def test_skip_anchor_with_null_href_unchanged():
    tree = {
        "type": "root",
        "children": [
            {
                "type": "element",
                "tagName": "a",
                "properties": {"href": None},
                "children": [],
            }
        ],
    }
    tree = transform(tree, STD_FILE, STD_OPTS)
    assert tree["children"][0]["properties"]["href"] is None


def test_skip_anchor_with_absent_href_unchanged():
    tree = transform(make_anchor_tree_no_href(), STD_FILE, STD_OPTS)
    assert not has_href(tree)


def test_skip_target_outside_content_root_unchanged():
    tree = transform(
        make_anchor_tree("../../../../../../outside.md"), STD_FILE, STD_OPTS
    )
    assert get_href(tree) == "../../../../../../outside.md"


def test_skip_no_file_path_no_processing():
    tree = transform(make_anchor_tree("sibling.md"), {"path": None}, STD_OPTS)
    assert get_href(tree) == "sibling.md"


def test_skip_empty_string_path_no_processing():
    tree = transform(make_anchor_tree("sibling.md"), {"path": ""}, STD_OPTS)
    assert get_href(tree) == "sibling.md"


def test_skip_uppercase_md_extension_unchanged():
    tree = transform(make_anchor_tree("page.MD"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "page.MD"


def test_skip_mixed_case_md_extension_unchanged():
    tree = transform(make_anchor_tree("page.Md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "page.Md"


# ─── Error conditions (1 test) ──────────────────────────────────────────────


def test_no_content_dir_and_no_content_dir_option_raises():
    file = {"path": "/some/random/path/file.md"}
    with pytest.raises(RuntimeError, match="Could not detect content directory"):
        transform(make_anchor_tree("sibling.md"), file, {})


# ─── Path resolution (7 tests) ──────────────────────────────────────────────


def test_path_resolution_bare_relative_sibling():
    tree = transform(make_anchor_tree("sibling.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/sibling/"


def test_path_resolution_dot_slash_sibling():
    tree = transform(make_anchor_tree("./sibling.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/sibling/"


def test_path_resolution_parent_other_page():
    tree = transform(make_anchor_tree("../other/page.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/other/page/"


def test_path_resolution_deep_parent_root_level():
    # File two levels deep so ../../ still stays inside the content root.
    deep_file = {"path": "/project/src/content/docs/guide/sub/intro.md"}
    tree = transform(make_anchor_tree("../../root-level.md"), deep_file, STD_OPTS)
    assert get_href(tree) == "/root-level/"


def test_path_resolution_into_subdir():
    tree = transform(make_anchor_tree("./sub/deep/page.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/sub/deep/page/"


def test_path_resolution_absolute_docs_prefixed():
    tree = transform(make_anchor_tree("/docs/guide/page.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/page/"


def test_path_resolution_absolute_without_docs_prefix():
    tree = transform(make_anchor_tree("/guide/page.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/page/"


# ─── Index handling (5 tests) ───────────────────────────────────────────────


def test_index_handling_bare_index_md():
    tree = transform(make_anchor_tree("index.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/"


def test_index_handling_subdir_index_md():
    tree = transform(make_anchor_tree("./sub/index.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/sub/"


def test_index_handling_parent_index_md():
    tree = transform(make_anchor_tree("../index.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/"


def test_index_handling_root_index_md():
    root_file = {"path": "/project/src/content/docs/intro.md"}
    tree = transform(make_anchor_tree("index.md"), root_file, STD_OPTS)
    assert get_href(tree) == "/"


def test_index_handling_absolute_docs_index_md():
    tree = transform(make_anchor_tree("/docs/index.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/"


# ─── Query/hash preservation (5 tests) ──────────────────────────────────────


def test_query_hash_hash_only():
    tree = transform(make_anchor_tree("page.md#section"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/page/#section"


def test_query_hash_query_only():
    tree = transform(make_anchor_tree("page.md?foo=bar"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/page/?foo=bar"


def test_query_hash_query_then_hash():
    tree = transform(make_anchor_tree("page.md?foo=bar#section"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/page/?foo=bar#section"


def test_query_hash_hash_then_query():
    tree = transform(make_anchor_tree("page.md#section?foo=bar"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/page/#section?foo=bar"


def test_query_hash_index_with_hash():
    tree = transform(make_anchor_tree("index.md#top"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/#top"


# ─── Base path (4 tests) ────────────────────────────────────────────────────


def test_base_path_root():
    tree = transform(make_anchor_tree("page.md"), STD_FILE, {**STD_OPTS, "base": "/"})
    assert get_href(tree) == "/guide/page/"


def test_base_path_subpath_trailing_slash():
    tree = transform(
        make_anchor_tree("page.md"), STD_FILE, {**STD_OPTS, "base": "/BMAD-METHOD/"}
    )
    assert get_href(tree) == "/BMAD-METHOD/guide/page/"


def test_base_path_subpath_no_trailing_slash():
    tree = transform(
        make_anchor_tree("page.md"), STD_FILE, {**STD_OPTS, "base": "/BMAD-METHOD"}
    )
    assert get_href(tree) == "/BMAD-METHOD/guide/page/"


def test_base_path_nested_subpath():
    tree = transform(
        make_anchor_tree("page.md"), STD_FILE, {**STD_OPTS, "base": "/org/repo/docs/"}
    )
    assert get_href(tree) == "/org/repo/docs/guide/page/"


# ─── Normalization (3 tests) ────────────────────────────────────────────────


def test_normalization_no_double_slash_for_root_base():
    tree = transform(make_anchor_tree("page.md"), STD_FILE, {**STD_OPTS, "base": "/"})
    assert "//" not in get_href(tree)


def test_normalization_no_double_slash_for_subpath_base():
    tree = transform(
        make_anchor_tree("page.md"), STD_FILE, {**STD_OPTS, "base": "/BMAD-METHOD/"}
    )
    assert "//" not in get_href(tree)


def test_normalization_trailing_slash_before_suffix():
    tree = transform(make_anchor_tree("page.md#section"), STD_FILE, STD_OPTS)
    href = get_href(tree)
    hash_index = href.index("#")
    assert href[hash_index - 1] == "/"


# ─── Edge cases (5 tests) ────────────────────────────────────────────────────


def test_edge_case_version_like_filename():
    tree = transform(make_anchor_tree("v2.0.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/v2.0/"


def test_edge_case_dotted_filename():
    tree = transform(make_anchor_tree("file.test.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/file.test/"


def test_edge_case_dash_containing_segment():
    tree = transform(make_anchor_tree("markdown-guide/foo.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/markdown-guide/foo/"


def test_edge_case_bare_dot_md_processes():
    tree = transform(make_anchor_tree(".md"), STD_FILE, STD_OPTS)
    assert get_href(tree) != ".md"


def test_edge_case_unicode_filename():
    tree = transform(make_anchor_tree("über-guide.md"), STD_FILE, STD_OPTS)
    assert get_href(tree) == "/guide/über-guide/"
