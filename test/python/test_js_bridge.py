# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Smoke test for the Node/Python JS bridge (test/python/support/js_bridge.{js,py}).

Proves the bridge pattern end-to-end against a real production export
(CustomModuleManager.parseSource) and against an unknown export name, so
later stories have a copyable example instead of writing new bridge code.
Also proves the "transform" mode's two error paths (factory export not
found, factory that doesn't return a function) against real rehype plugin
exports — see test/python/test_rehype_markdown_links.py and
test/python/test_rehype_base_paths.py for the happy-path transform coverage.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent / "support"))
import js_bridge  # noqa: E402

CUSTOM_MODULE_MANAGER = "tools/installer/modules/custom-module-manager.js"
REHYPE_MARKDOWN_LINKS = "website/src/rehype-markdown-links.js"


def test_parse_source_returns_real_result_for_a_url():
    result = js_bridge.call(
        CUSTOM_MODULE_MANAGER,
        "CustomModuleManager.parseSource",
        "https://github.com/foo/bar/tree/main/subdir",
    )

    assert result["isValid"] is True
    assert result["type"] == "url"
    assert result["cloneUrl"] == "https://github.com/foo/bar"
    assert result["subdir"] == "subdir"
    assert result["cacheKey"] == "github.com/foo/bar"
    assert result["displayName"] == "foo/bar"
    assert result["error"] is None


def test_unknown_export_name_raises():
    with pytest.raises(RuntimeError):
        js_bridge.call(CUSTOM_MODULE_MANAGER, "NoSuchExport")


def test_transform_unknown_factory_export_raises():
    """transform mode: the named export doesn't exist on the module at all."""
    with pytest.raises(RuntimeError, match="not found"):
        js_bridge.transform(REHYPE_MARKDOWN_LINKS, "noSuchFactory", {}, {"type": "root", "children": []})


def test_transform_factory_not_returning_function_raises():
    """transform mode: the named export exists but doesn't return a transformer.

    `findFirstDelimiter` is a real export on this module, but it's a plain
    string -> number function, not a `options => (tree, file) => void`
    factory, so calling it in transform mode must raise rather than silently
    treat its numeric return value as a transformer.
    """
    with pytest.raises(RuntimeError, match="did not return a function"):
        js_bridge.transform(
            REHYPE_MARKDOWN_LINKS, "findFirstDelimiter", "page.md", {"type": "root", "children": []}
        )
