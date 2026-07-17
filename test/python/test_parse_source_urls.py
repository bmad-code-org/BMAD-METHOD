# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Pytest parity for CustomModuleManager.parseSource() from
tools/installer/modules/custom-module-manager.js.

Ports every assertion from the retired test/test-parse-source-urls.js runner,
calling the real JS export through js_bridge rather than reimplementing
URL-parsing logic in Python.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "support"))
import js_bridge  # noqa: E402

CUSTOM_MODULE_MANAGER = "tools/installer/modules/custom-module-manager.js"


def parse_source(source: str):
    return js_bridge.call(CUSTOM_MODULE_MANAGER, "CustomModuleManager.parseSource", source)


# ─── Deep path shapes (4+ segments) ─────────────────────────────────────────


def test_nested_path_url_is_valid():
    result = parse_source("https://git.example.com/myorg/MyProject/_git/my-module")

    assert result["isValid"] is True
    assert result["type"] == "url"
    assert result["cloneUrl"] == "https://git.example.com/myorg/MyProject/_git/my-module"
    assert result["subdir"] is None
    assert result["cacheKey"] == "git.example.com/myorg/MyProject/_git/my-module"
    assert result["displayName"] == "_git/my-module"


def test_nested_path_url_with_git_suffix_strips_suffix_from_clone_url():
    result = parse_source("https://git.example.com/myorg/MyProject/_git/my-module.git")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://git.example.com/myorg/MyProject/_git/my-module"


def test_nested_path_url_with_path_query_extracts_subdir():
    result = parse_source(
        "https://git.example.com/myorg/MyProject/_git/my-module?path=/path/to/subdir"
    )

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://git.example.com/myorg/MyProject/_git/my-module"
    assert result["subdir"] == "path/to/subdir"


# ─── Azure DevOps URLs (Issue #2268) ────────────────────────────────────────


def test_ado_modern_url_is_valid():
    result = parse_source("https://dev.azure.com/myorg/MyProject/_git/my-module")

    assert result["isValid"] is True
    assert result["type"] == "url"
    assert result["cloneUrl"] == "https://dev.azure.com/myorg/MyProject/_git/my-module"
    assert result["cacheKey"] == "dev.azure.com/myorg/MyProject/_git/my-module"
    assert result["subdir"] is None


def test_ado_modern_git_suffix_stripped_from_clone_url():
    result = parse_source("https://dev.azure.com/myorg/MyProject/_git/my-module.git")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://dev.azure.com/myorg/MyProject/_git/my-module"


def test_ado_modern_path_query_extracts_subdir():
    result = parse_source(
        "https://dev.azure.com/myorg/MyProject/_git/my-module?path=/src/skills"
    )

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://dev.azure.com/myorg/MyProject/_git/my-module"
    assert result["subdir"] == "src/skills"


def test_ado_legacy_url_is_valid():
    result = parse_source("https://myorg.visualstudio.com/MyProject/_git/my-module")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://myorg.visualstudio.com/MyProject/_git/my-module"
    assert result["cacheKey"] == "myorg.visualstudio.com/MyProject/_git/my-module"


def test_ado_legacy_git_suffix_stripped_from_clone_url():
    result = parse_source("https://myorg.visualstudio.com/MyProject/_git/my-module.git")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://myorg.visualstudio.com/MyProject/_git/my-module"


def test_ado_legacy_path_query_extracts_subdir():
    result = parse_source("https://myorg.visualstudio.com/MyProject/_git/my-module?path=/src")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://myorg.visualstudio.com/MyProject/_git/my-module"
    assert result["subdir"] == "src"


# ─── Subdomain hosts ────────────────────────────────────────────────────────


def test_subdomain_url_is_valid():
    result = parse_source("https://myorg.example.com/MyProject/_git/my-module")

    assert result["isValid"] is True
    assert result["type"] == "url"
    assert result["cloneUrl"] == "https://myorg.example.com/MyProject/_git/my-module"
    assert result["subdir"] is None
    assert result["cacheKey"] == "myorg.example.com/MyProject/_git/my-module"


# ─── Simple owner/repo URLs (regression) ────────────────────────────────────


def test_github_basic_url_still_valid():
    result = parse_source("https://github.com/owner/repo")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://github.com/owner/repo"
    assert result["cacheKey"] == "github.com/owner/repo"


def test_github_tree_url_subdir_still_extracted():
    result = parse_source("https://github.com/owner/repo/tree/main/subdir")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://github.com/owner/repo"
    assert result["subdir"] == "subdir"


def test_ssh_url_still_valid():
    result = parse_source("git@github.com:owner/repo.git")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "git@github.com:owner/repo.git"


# ─── Windows local paths ────────────────────────────────────────────────────


def test_windows_drive_path_missing_gets_path_specific_error():
    result = parse_source(r"C:\__bmad_missing_module__\source")

    assert result["type"] == "local"
    assert result["error"] is not None
    assert result["error"].startswith("Path does not exist:")


def test_windows_forward_slash_drive_path_missing_gets_path_specific_error():
    result = parse_source("C:/__bmad_missing_module__/source")

    assert result["type"] == "local"
    assert result["error"] is not None
    assert result["error"].startswith("Path does not exist:")


def test_windows_relative_path_missing_gets_path_specific_error():
    result = parse_source(r".\__bmad_missing_module__\source")

    assert result["type"] == "local"
    assert result["error"] is not None
    assert result["error"].startswith("Path does not exist:")


def test_windows_drive_path_with_version_suffix_is_rejected():
    result = parse_source(r"C:\__bmad_missing_module__\source@main")

    assert result["type"] == "local"
    assert result["error"] == "Local paths do not support @version suffixes"


def test_windows_relative_path_with_version_suffix_is_rejected():
    result = parse_source(r".\__bmad_missing_module__\source@main")

    assert result["type"] == "local"
    assert result["error"] == "Local paths do not support @version suffixes"


# ─── Generic URL handling (any host, any path depth) ────────────────────────


def test_gitlab_nested_group_url_is_valid():
    result = parse_source("https://gitlab.com/group/subgroup/repo")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://gitlab.com/group/subgroup/repo"
    assert result["cacheKey"] == "gitlab.com/group/subgroup/repo"
    assert result["displayName"] == "subgroup/repo"


def test_gitlab_nested_group_tree_url_extracts_subdir():
    result = parse_source("https://gitlab.com/group/subgroup/repo/-/tree/main/src/module")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://gitlab.com/group/subgroup/repo"
    assert result["subdir"] == "src/module"


def test_repo_name_with_dots_is_valid():
    result = parse_source("https://git.example.com/owner/my.repo.name")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://git.example.com/owner/my.repo.name"
    assert result["displayName"] == "owner/my.repo.name"


def test_tree_url_without_subdir_strips_ref_from_clone_url():
    result = parse_source("https://github.com/owner/repo/tree/main")

    assert result["isValid"] is True
    assert result["cloneUrl"] == "https://github.com/owner/repo"
    assert result["subdir"] is None
    assert result["displayName"] == "owner/repo"


def test_gitlab_tree_form_without_subdir_strips_ref():
    result = parse_source("https://gitlab.com/group/repo/-/tree/main")

    assert result["cloneUrl"] == "https://gitlab.com/group/repo"
    assert result["subdir"] is None


def test_gitea_branch_form_without_subdir_strips_ref():
    result = parse_source("https://gitea.example.com/owner/repo/src/branch/main")

    assert result["cloneUrl"] == "https://gitea.example.com/owner/repo"
    assert result["subdir"] is None
