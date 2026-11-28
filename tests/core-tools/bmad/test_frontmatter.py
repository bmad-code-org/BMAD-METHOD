import sys
from pathlib import Path

import pytest
import yaml

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "skills/core-tools/bmad/scripts"))
import frontmatter  # noqa: E402


def test_split_accepts_trailing_fence_whitespace_and_preserves_text():
    fields = "topic: Pricing --- tiers\r\nnotes: |\r\n  ---\r\n"
    body = "\r\n# Body\r\n---\r\n"
    assert frontmatter.split(f"--- \t\r\n{fields}---\t \r\n{body}") == (fields, body)
    assert frontmatter.split("---\n---") == ("", "")


@pytest.mark.parametrize("text", ["", "# Body\n---\ntopic: x\n---", " ---\ntopic: x\n---"])
def test_split_requires_frontmatter_at_start(text):
    with pytest.raises(ValueError, match="no frontmatter"):
        frontmatter.split(text)


def test_split_requires_a_closing_fence_on_its_own_line():
    with pytest.raises(ValueError, match="not terminated"):
        frontmatter.split("---\ntopic: Pricing ---\n--- more\n  ---\n")


def test_load_keeps_scalars_as_text_inside_collections():
    fields = frontmatter.load("flag: yes\nzero: 001\ndate: 2026-11-19\nitems: [false, null]\n")
    assert fields == {"flag": "yes", "zero": "001", "date": "2026-11-19", "items": ["false", "null"]}


def test_typed_load_types_only_plain_booleans_whole_numbers_and_null():
    fields = frontmatter.load(
        "id: 6\nq: '6'\nhitl: true\nyes: yes\nn:\nv: 1.10\nd: 2026-11-19\nl: [010, -2]\n", typed=True
    )
    assert fields == {
        "id": 6,
        "q": "6",
        "hitl": True,
        "yes": "yes",
        "n": None,
        "v": "1.10",
        "d": "2026-11-19",
        "l": ["010", -2],
    }


def test_load_accepts_empty_frontmatter_and_rejects_non_mappings():
    assert frontmatter.load("# no fields\n") == {}
    with pytest.raises(ValueError, match="must be a YAML mapping"):
        frontmatter.load("- item\n")


def test_load_reports_malformed_yaml_as_value_error():
    text = "topic: Auth: phase 2\n"
    with pytest.raises(yaml.YAMLError) as original:
        yaml.load(text, Loader=yaml.BaseLoader)
    with pytest.raises(ValueError) as error:
        frontmatter.load(text)
    assert str(error.value) == str(original.value)


def test_dump_preserves_order_unicode_and_long_text():
    long_text = "phrase " * 40 + "café"
    fields = {"z": long_text, "a": "Fix #42: login", "flag": "yes", "count": "001"}
    block = frontmatter.dump(fields)
    yaml_text, body = frontmatter.split(block)
    assert block.endswith("---\n")
    assert body == ""
    assert long_text in yaml_text
    assert list(frontmatter.load(yaml_text).items()) == list(fields.items())
    assert yaml.safe_load(yaml_text) == fields


def test_set_fields_rewrites_named_entries_and_keeps_the_rest_as_written():
    text = (
        "# kept comment\n"
        "title: 'Quoted'\n"
        "agents:\n- a\n- b\n"
        "notes: |\n  one\n\n  two\n"
        '"mode": fast  # inline\n'
        "after: [x, y]"
    )
    result = frontmatter.set_fields(
        text, {"agents": ["c", "d: e"], "mode": "", "new": "Fix #42: x"}, remove=("title", "absent")
    )
    assert result == (
        "# kept comment\nagents: [c, 'd: e']\nnotes: |\n  one\n\n  two\nmode: ''\nnew: 'Fix #42: x'\nafter: [x, y]\n"
    )
    assert frontmatter.load(result)["notes"] == "one\n\ntwo\n"
    placed = frontmatter.set_fields("a: 1\nsources:\n  - x\nz: 2\n", {"sources": ["x", "y"], "companions": ["c"]})
    assert placed == "a: 1\nsources: [x, y]\ncompanions: [c]\nz: 2\n"


def test_set_fields_keeps_a_comment_inside_a_block_list_with_its_field():
    text = "agents:\n  - a\n# reason\n  - b\n# kept\nmode: fast\n"
    assert frontmatter.set_fields(text, {"agents": ["c"]}) == "agents: [c]\n# kept\nmode: fast\n"


@pytest.mark.parametrize(
    ("text", "fields", "remove"),
    [
        ("{type: epic, sources: [a]}\n", {"sources": ["a", "b"]}, ()),
        ("defaults: &d {state: open}\ncopy: *d\n", {}, ("copy",)),
    ],
)
def test_set_fields_refuses_text_it_cannot_rewrite_entry_by_entry(text, fields, remove):
    with pytest.raises(ValueError, match="field by field"):
        frontmatter.set_fields(text, fields, remove)


def test_quoted_text_is_written_in_double_quotes():
    title = frontmatter.Quoted('Login: the "magic" link')
    assert (
        frontmatter.set_fields("", {"title": title, "plain": "x"}) == 'title: "Login: the \\"magic\\" link"\nplain: x\n'
    )
    assert frontmatter.load(frontmatter.split(frontmatter.dump({"title": title}))[0]) == {"title": title}
    assert frontmatter.dump({"title": title, "after": [1, "x"]}, flow_lists=True) == (
        '---\ntitle: "Login: the \\"magic\\" link"\nafter: [1, x]\n---\n'
    )
    assert frontmatter.set_fields("", {"a": "1"}) == "a: '1'\n"


def test_split_accepts_a_leading_byte_order_mark():
    assert frontmatter.split("\ufeff---\ntopic: BOM\n---\nBody\n") == ("topic: BOM\n", "Body\n")
