"""Tests for git_evidence.py — measurement over a real temp git repo."""

import json
import os
import subprocess
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "git_evidence.py"

def _run(*args):
    # LC_ALL=C keeps git's error strings in English so assertions on them
    # are stable across locales.
    proc = subprocess.run(
        ["uv", "run", str(SCRIPT), *args],
        capture_output=True,
        text=True,
        env={**os.environ, "LC_ALL": "C", "LANG": "C"},
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


def test_single_rev_range_rejected(tmp_path):
    # A single rev is not a range: git would log ALL history up to it and the
    # script would report the whole repo as the epic's evidence.
    repo = _make_repo(tmp_path)
    code, out = _run("--repo", str(repo), "--range", "HEAD")
    assert code == 2
    assert out["ok"] is False and "invalid --range" in out["error"]


def test_pathspec_range_rejected(tmp_path):
    # A path that exists must not be silently consumed as a pathspec.
    repo = _make_repo(tmp_path)
    code, out = _run("--repo", str(repo), "--range", "a.py")
    assert code == 2
    assert out["ok"] is False and "invalid --range" in out["error"]


def test_range_shaped_pathspec_forced_to_rev_parse(tmp_path):
    # A committed file literally named "a..b" passes the REV..REV shape check;
    # without the trailing "--" in the git argv, git silently logs that FILE's
    # history with exit 0. The "--" forces rev interpretation, so this must
    # error instead of measuring the decoy.
    repo = _make_repo(tmp_path)
    (repo / "a..b").write_text("decoy\n")
    _git(repo, "add", "-A")
    _git(repo, "commit", "-qm", "add decoy file named like a range")
    code, out = _run("--repo", str(repo), "--range", "a..b")
    assert code == 1
    assert out["ok"] is False and "bad revision" in out["error"]


def test_option_like_range_rejected(tmp_path):
    # A range starting with "-" must never reach git, where it would be
    # consumed as an option (e.g. --output=... writes an arbitrary file).
    repo = _make_repo(tmp_path)
    code, out = _run("--repo", str(repo), "--range=--output=evil.txt")
    assert code == 2
    assert out["ok"] is False and "invalid --range" in out["error"]
    assert not (repo / "evil.txt").exists()


def test_degenerate_range_shapes_rejected(tmp_path):
    # Shapes that contain ".." but are not REV..REV: git would silently
    # default an empty endpoint to HEAD ("..", "a..", "..HEAD"), a leading
    # dash must never reach git even when dots are present ("-3..HEAD"),
    # and unstripped values must not slip past the dash guard.
    repo = _make_repo(tmp_path)
    for bad in ("..", "a..", "..HEAD", "-3..HEAD", " HEAD~1..HEAD"):
        code, out = _run("--repo", str(repo), f"--range={bad}")
        assert code == 2, f"accepted {bad!r}"
        assert out["ok"] is False and "invalid --range" in out["error"], bad


def test_malformed_args_emit_json_not_usage(tmp_path):
    # An unknown flag must still land on the JSON contract, not argparse's
    # plain usage text on stderr.
    code, out = _run("--bogus-flag")
    assert code != 0
    assert out["ok"] is False and out["error"]
