# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8", "ruamel.yaml>=0.18"]
# ///
"""Subprocess tests for the stories-mode retrospective inspector."""

import json
import subprocess
import sys
from pathlib import Path

import pytest


SCRIPT = Path(__file__).parents[1] / "stories_status.py"


def _run(*args):
    return subprocess.run(
        [sys.executable, str(SCRIPT), *map(str, args)],
        capture_output=True,
        text=True,
        check=False,
    )


def _json(proc):
    assert proc.stderr == ""
    return json.loads(proc.stdout)


def _folder(tmp_path, entries=None, artifacts=None):
    folder = tmp_path / "spec-one"
    (folder / "stories").mkdir(parents=True)
    (folder / "SPEC.md").write_text("# Spec\n", encoding="utf-8")
    if entries is None:
        entries = [
            '- id: "2"\n  title: Second\n  description: Run second.\n',
            '- id: "1"\n  title: First\n  description: Run first.\n',
        ]
    (folder / "stories.yaml").write_text("".join(entries), encoding="utf-8")
    if artifacts is None:
        artifacts = {
            "2-second.md": "---\nstatus: done\nbaseline_revision: aaa\nfinal_revision: bbb\n---\n",
            "1-first.md": "---\nstatus: in-progress\n---\n",
        }
    for name, content in artifacts.items():
        (folder / "stories" / name).write_text(content, encoding="utf-8")
    return folder


def test_inspect_preserves_inventory_order_and_reports_revisions(tmp_path):
    folder = _folder(tmp_path)
    proc = _run("inspect", "--folder", folder)
    assert proc.returncode == 0
    data = _json(proc)
    assert [story["id"] for story in data["stories"]] == ["2", "1"]
    assert data["stories"][0]["revision_range"] == "aaa..bbb"
    assert data["stories"][0] == {
        "id": "2",
        "title": "Second",
        "description": "Run second.",
        "file": str(folder / "stories" / "2-second.md"),
        "status": "done",
        "baseline_revision": "aaa",
        "final_revision": "bbb",
        "revision_range": "aaa..bbb",
    }
    assert data["pending_stories"] == ["1"]
    assert data["complete"] is False
    assert data["retrospective_file"] == str(folder / "RETROSPECTIVE.md")
    assert set(data["source_hashes"]) == {
        str(folder / "SPEC.md"),
        str(folder / "stories.yaml"),
        str(folder / "stories" / "2-second.md"),
        str(folder / "stories" / "1-first.md"),
    }


def test_complete_inventory(tmp_path):
    folder = _folder(
        tmp_path,
        entries=['- id: "a-1"\n  title: One\n  description: Complete.\n'],
        artifacts={"a-1-story.md": "---\nstatus: done\nbaseline_revision: NO_VCS\nfinal_revision: NO_VCS\n---\n"},
    )
    data = _json(_run("inspect", "--folder", folder))
    assert data["complete"] is True
    assert data["pending_stories"] == []
    assert data["stories"][0]["revision_range"] is None


def test_empty_yaml_list_is_not_an_epic(tmp_path):
    folder = _folder(tmp_path, entries=["[]\n"], artifacts={})
    proc = _run("inspect", "--folder", folder)
    assert proc.returncode == 1
    assert "at least one story" in _json(proc)["error"]


@pytest.mark.parametrize(
    ("frontmatter", "expected_range"),
    [
        ("baseline_revision: aaa\n", None),
        ("final_revision: bbb\n", None),
        ("baseline_revision: NO_VCS\nfinal_revision: bbb\n", None),
        ("baseline_revision: aaa\nfinal_revision: NO_VCS\n", None),
    ],
)
def test_partial_or_no_vcs_revision_pairs_have_no_range(
    tmp_path, frontmatter, expected_range
):
    folder = _folder(
        tmp_path,
        entries=['- id: "1"\n  title: One\n  description: One.\n'],
        artifacts={"1-one.md": f"---\nstatus: done\n{frontmatter}---\n"},
    )
    data = _json(_run("inspect", "--folder", folder))
    assert data["stories"][0]["revision_range"] is expected_range


def test_detect_finds_nested_candidates_in_stable_order(tmp_path):
    second = _folder(tmp_path / "z")
    first = _folder(tmp_path / "a")
    data = _json(_run("detect", "--root", tmp_path))
    assert data["candidate_count"] == 2
    assert data["candidates"] == sorted([str(first), str(second)])


def test_detect_deduplicates_overlapping_roots(tmp_path):
    folder = _folder(tmp_path)
    data = _json(_run("detect", "--root", tmp_path, "--root", folder))
    assert data["candidates"] == [str(folder)]


@pytest.mark.parametrize(
    ("entries", "message"),
    [
        ([], "top-level list"),
        (["id: nope\n"], "top-level list"),
        (["- id: [\n"], "invalid YAML"),
        (['- id: 1\n  title: One\n  description: Bad id type.\n'], "field 'id'"),
        (['- id: "a/*"\n  title: One\n  description: Bad chars.\n'], "letters, digits, and dashes"),
        (['- id: "1"\n  title: One\n'], "missing required field 'description'"),
        (['- id: "1"\n  title: One\n  description: One.\n  status: done\n'], "must not contain a status"),
        (
            [
                '- id: "1"\n  title: One\n  description: One.\n',
                '- id: "1"\n  title: Again\n  description: Again.\n',
            ],
            "duplicate story id",
        ),
        (
            [
                '- id: "3"\n  title: One\n  description: One.\n',
                '- id: "3-2"\n  title: Two\n  description: Two.\n',
            ],
            "not prefix-free",
        ),
    ],
)
def test_invalid_inventory_is_structured_error(tmp_path, entries, message):
    folder = _folder(tmp_path, entries=entries, artifacts={})
    proc = _run("inspect", "--folder", folder)
    assert proc.returncode == 1
    data = _json(proc)
    assert data["ok"] is False
    assert message in data["error"]


@pytest.mark.parametrize(
    ("artifacts", "message"),
    [
        ({}, "found 0"),
        (
            {"1-a.md": "---\nstatus: done\n---\n", "1-b.md": "---\nstatus: done\n---\n"},
            "found 2",
        ),
        ({"1-a.md": "status: done\n"}, "must start with YAML frontmatter"),
        ({"1-a.md": "---\nstatus: [done]\n---\n"}, "status must be a non-empty string"),
        ({"1-a.md": "---\nstatus: Done\n---\n"}, "unrecognized frontmatter status"),
        ({"1-a.md": "---\nstatus: done\nbaseline_revision: 123\n---\n"}, "baseline_revision"),
        (
            {"1-a.md": "---\nstatus: done\nbaseline_revision: $(bad)\n---\n"},
            "invalid revision",
        ),
    ],
)
def test_broken_story_artifacts_are_structured_errors(tmp_path, artifacts, message):
    folder = _folder(
        tmp_path,
        entries=['- id: "1"\n  title: One\n  description: One.\n'],
        artifacts=artifacts,
    )
    proc = _run("inspect", "--folder", folder)
    assert proc.returncode == 1
    assert message in _json(proc)["error"]


def test_missing_fixed_files_are_errors(tmp_path):
    folder = tmp_path / "empty"
    folder.mkdir()
    proc = _run("inspect", "--folder", folder)
    assert proc.returncode == 1
    assert "missing SPEC.md" in _json(proc)["error"]


def test_inspection_preserves_all_source_bytes(tmp_path):
    folder = _folder(tmp_path)
    sources = [folder / "SPEC.md", folder / "stories.yaml", *sorted((folder / "stories").iterdir())]
    before = {path: path.read_bytes() for path in sources}
    assert _run("inspect", "--folder", folder).returncode == 0
    assert {path: path.read_bytes() for path in sources} == before
    assert not (folder / "RETROSPECTIVE.md").exists()


def test_argument_errors_are_json_only():
    proc = _run("inspect")
    assert proc.returncode == 2
    assert _json(proc)["error"].startswith("argument error:")


def test_folder_resolution_errors_are_json_only(tmp_path):
    loop = tmp_path / "loop"
    loop.symlink_to(loop)
    proc = _run("inspect", "--folder", loop)
    assert proc.returncode == 1
    assert _json(proc)["error"].startswith("cannot resolve spec folder")


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-q"]))
