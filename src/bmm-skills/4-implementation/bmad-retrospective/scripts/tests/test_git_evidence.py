"""Tests for git_evidence.py — measurement over a real temp git repo."""

import json
import subprocess
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "git_evidence.py"


def _run(*args):
    proc = subprocess.run(
        ["uv", "run", str(SCRIPT), *args], capture_output=True, text=True
    )
    return proc.returncode, json.loads(proc.stdout)


def _git(repo, *args):
    env = {
        "GIT_AUTHOR_NAME": "T",
        "GIT_AUTHOR_EMAIL": "t@t",
        "GIT_COMMITTER_NAME": "T",
        "GIT_COMMITTER_EMAIL": "t@t",
    }
    subprocess.run(["git", "-C", str(repo), *args], check=True, capture_output=True, env={**env})


def _make_repo(tmp_path):
    repo = tmp_path / "repo"
    repo.mkdir()
    _git(repo, "init", "-q")
    (repo / "a.py").write_text("one\ntwo\n")
    _git(repo, "add", "-A")
    _git(repo, "commit", "-qm", "epic-1-1 initial a")
    (repo / "a.py").write_text("one\ntwo\nthree\nfour\n")
    (repo / "b.py").write_text("x\n")
    _git(repo, "add", "-A")
    _git(repo, "commit", "-qm", "epic-1-2 grow a, add b")
    return repo


def test_no_range_returns_empty(tmp_path):
    repo = _make_repo(tmp_path)
    code, out = _run("--repo", str(repo))
    assert code == 0
    assert out["range"] is None
    assert out["commits"] == [] and out["files"] == []


def test_measures_commits_and_files_with_attribution(tmp_path):
    repo = _make_repo(tmp_path)
    code, out = _run(
        "--repo", str(repo), "--range", "HEAD~1..HEAD", "--stories", "1-2,1-1"
    )
    assert code == 0
    assert out["range"] == "HEAD~1..HEAD"
    assert out["commit_count"] == 1
    # The single commit in range is the second one; attributed to story "1-2".
    assert out["commits"][0]["story"] == "1-2"
    files = {f["path"]: f for f in out["files"]}
    # a.py grew by two lines, b.py added one — measured, not judged.
    assert files["a.py"]["added"] == 2 and files["a.py"]["net"] == 2
    assert files["b.py"]["added"] == 1


def test_story_attribution_respects_word_boundary(tmp_path):
    # Story id "1-2" must NOT match a commit subject mentioning "11-2".
    repo = tmp_path / "repo"
    repo.mkdir()
    _git(repo, "init", "-q")
    (repo / "f.py").write_text("a\n")
    _git(repo, "add", "-A")
    _git(repo, "commit", "-qm", "base")
    (repo / "f.py").write_text("a\nb\n")
    _git(repo, "add", "-A")
    _git(repo, "commit", "-qm", "epic-11-2 unrelated story")
    code, out = _run("--repo", str(repo), "--range", "HEAD~1..HEAD", "--stories", "1-2")
    assert code == 0
    assert out["commits"][0]["story"] is None


def test_bad_range_errors_as_json(tmp_path):
    repo = _make_repo(tmp_path)
    code, out = _run("--repo", str(repo), "--range", "nope..alsonope")
    assert code == 1
    assert out["ok"] is False and out["error"]
