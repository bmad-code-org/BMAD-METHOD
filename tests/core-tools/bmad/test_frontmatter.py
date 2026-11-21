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
