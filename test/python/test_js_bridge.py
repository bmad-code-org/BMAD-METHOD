# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Smoke test for the Node/Python JS bridge (test/python/support/js_bridge.{js,py}).

Proves the bridge pattern end-to-end against a real production export
(CustomModuleManager.parseSource) and against an unknown export name, so
later stories have a copyable example instead of writing new bridge code.
"""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent / "support"))
import js_bridge  # noqa: E402

CUSTOM_MODULE_MANAGER = "tools/installer/modules/custom-module-manager.js"


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
