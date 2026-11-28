# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0", "pyyaml>=6.0.2,<7"]
# ///
"""Tests for memlog.py. Run: uv run --with pytest pytest tests/method/bmad-agent-po/test_memlog.py

The spine under test is the flat, append-only, chronological invariant: every entry is
one line recorded at the end in the order it happened — no sections, no grouping, and no
lifecycle status the log would have to mutate.
"""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest
import yaml

SCRIPT = Path(__file__).resolve().parents[3] / "skills/method/bmad-agent-po/scripts/memlog.py"
FRONTMATTER = SCRIPT.parents[3] / "core-tools" / "bmad" / "scripts" / "frontmatter.py"
sys.path.insert(0, str(FRONTMATTER.parent))
sys.path.insert(0, str(SCRIPT.parent))
import frontmatter  # noqa: E402
import memlog  # noqa: E402

MEMLOG = ".memlog.md"


@pytest.fixture
def ws(tmp_path):
    scripts = tmp_path / "_bmad" / "scripts"
    scripts.mkdir(parents=True)
    shutil.copy2(FRONTMATTER, scripts)
    return str(tmp_path)


def read(ws):
    return (Path(ws) / MEMLOG).read_text(encoding="utf-8-sig")


def read_log(text):
    fields, body = frontmatter.split(text)
    return frontmatter.load(fields), body


def run(project_root, *args):
    return memlog.main(["--project-root", project_root, *args])


def body_of(ws):
    return frontmatter.split(read(ws))[1]


def entries(ws):
    return [ln for ln in body_of(ws).splitlines() if ln.startswith("- ")]


def init(ws, **fields):
    fields = fields or {"topic": "Reinvent the lunchbox", "goal": "ideas for a pitch"}
    argv = ["init", "--workspace", ws]
    for k, v in fields.items():
        argv += ["--field", f"{k}={v}"]
    assert run(ws, *argv) == 0


def append(ws, text, entry_type=None, by=None):
    argv = ["append", "--workspace", ws, "--text", text]
    if entry_type:
        argv += ["--type", entry_type]
    if by:
        argv += ["--by", by]
    assert run(ws, *argv) == 0


# --- init ---------------------------------------------------------------


def test_init_writes_frontmatter_fields(ws):
    init(ws)
    meta, body = read_log(read(ws))
    assert meta["topic"] == "Reinvent the lunchbox"
    assert meta["goal"] == "ideas for a pitch"
    assert "updated" in meta
    assert body.strip() == ""


def test_init_has_no_lifecycle_status(ws):
    # A memory log carries no "status" flag; completion is an appended entry, not frontmatter.
    init(ws)
    meta, _ = read_log(read(ws))
    assert "status" not in meta


def test_init_arbitrary_fields(ws):
    init(ws, topic="T", audience="board")
    meta, _ = read_log(read(ws))
    assert meta["audience"] == "board"


def test_init_refuses_overwrite(ws):
    init(ws)
    assert run(ws, "init", "--workspace", ws, "--field", "topic=other") == 2


def test_init_creates_missing_workspace(ws):
    nested = str(Path(ws) / "a" / "b")
    assert run(ws, "init", "--workspace", nested, "--field", "topic=T") == 0
    assert (Path(nested) / MEMLOG).is_file()


def test_init_rejects_malformed_field(ws):
    assert run(ws, "init", "--workspace", ws, "--field", "noequals") == 2


# --- addressing: --workspace and --path are interchangeable --------------


def test_path_addressing_targets_the_file_directly(ws):
    target = Path(ws) / "run" / ".memlog.md"
    assert run(ws, "init", "--path", str(target), "--field", "topic=T") == 0
    assert target.is_file()
    assert run(ws, "append", "--path", str(target), "--text", "an idea", "--type", "idea") == 0
    body = read_log(target.read_text(encoding="utf-8"))[1]
    assert "- (idea) an idea" in body


def test_workspace_and_path_resolve_to_same_file(ws):
    init(ws)
    via_path = str(Path(ws) / MEMLOG)
    assert run(ws, "append", "--path", via_path, "--text", "from path") == 0
    assert run(ws, "append", "--workspace", ws, "--text", "from workspace") == 0
    assert entries(ws) == ["- from path", "- from workspace"]


def test_target_is_required(ws):
    with pytest.raises(SystemExit):
        run(ws, "append", "--text", "orphan")  # neither --workspace nor --path


# --- append: flat chronological order is the whole point -----------------


def test_append_lands_at_end_in_order(ws):
    init(ws)
    append(ws, "first")
    append(ws, "second")
    append(ws, "third")
    assert entries(ws) == ["- first", "- second", "- third"]


def test_no_sections_or_headings_ever(ws):
    init(ws)
    append(ws, "started foo", entry_type="technique")
    append(ws, "an idea", entry_type="idea")
    append(ws, "started bar", entry_type="technique")
    assert "## " not in body_of(ws)  # the flat log never grows headings


def test_type_renders_as_inline_tag(ws):
    init(ws)
    append(ws, "the earth revolves around the sun", entry_type="idea")
    append(ws, "how do we handle stampede?", entry_type="question")
    body = body_of(ws)
    assert "- (idea) the earth revolves around the sun" in body
    assert "- (question) how do we handle stampede?" in body


def test_append_without_type_is_plain_note(ws):
    init(ws)
    append(ws, "bare entry")
    assert entries(ws) == ["- bare entry"]


def test_completion_is_an_entry_not_a_status(ws):
    # The documented way to mark a session done: append it. Frontmatter never gains a status.
    init(ws)
    append(ws, "session complete", entry_type="event")
    meta, _ = read_log(read(ws))
    assert "status" not in meta
    assert entries(ws)[-1] == "- (event) session complete"


def test_append_collapses_newlines_into_one_line(ws):
    init(ws)
    append(ws, "line one\nline two\n  spaced   out")
    assert entries(ws) == ["- line one line two spaced out"]


def test_revisited_technique_is_just_a_later_entry(ws):
    # the user's model: switching techniques is an entry, not a section to return to
    init(ws)
    append(ws, "started SCAMPER", entry_type="technique")
    append(ws, "magnetic latch", entry_type="idea")
    append(ws, "started Six Hats", entry_type="technique")
    append(ws, "stale data risk", entry_type="idea")
    append(ws, "started SCAMPER", entry_type="technique")  # back to SCAMPER — just appended again
    append(ws, "stackable tiers", entry_type="idea")
    assert entries(ws) == [
        "- (technique) started SCAMPER",
        "- (idea) magnetic latch",
        "- (technique) started Six Hats",
        "- (idea) stale data risk",
        "- (technique) started SCAMPER",
        "- (idea) stackable tiers",
    ]


def test_by_renders_attribution_in_tag(ws):
    # Creative Partner mode must record whose idea each one was
    init(ws)
    append(ws, "magnetic latch lid", entry_type="idea", by="user")
    append(ws, "lid doubles as a plate", entry_type="idea", by="coach")
    body = body_of(ws)
    assert "- (idea by user) magnetic latch lid" in body
    assert "- (idea by coach) lid doubles as a plate" in body


def test_by_without_type_renders_alone(ws):
    init(ws)
    append(ws, "off-the-cuff thought", by="coach")
    assert entries(ws) == ["- (by coach) off-the-cuff thought"]


def test_heterogeneous_entry_types_coexist(ws):
    init(ws)
    append(ws, "an idea", entry_type="idea")
    append(ws, "an open question", entry_type="question")
    append(ws, "a decision we made", entry_type="decision")
    append(ws, "user wants mobile-first", entry_type="direction")
    body = body_of(ws)
    for tag in ("(idea)", "(question)", "(decision)", "(direction)"):
        assert tag in body


def test_free_vocabulary_is_not_enforced(ws):
    # The tool is neutral: any --type the host skill names renders verbatim.
    init(ws)
    append(ws, "a custom kind", entry_type="crack")
    append(ws, "another", entry_type="lock")
    body = body_of(ws)
    assert "- (crack) a custom kind" in body
    assert "- (lock) another" in body


# --- set: generic descriptive frontmatter, no lifecycle semantics --------


def test_set_adds_field(ws):
    init(ws)
    run(ws, "set", "--workspace", ws, "--key", "mode", "--value", "partner")
    assert read_log(read(ws))[0]["mode"] == "partner"


def test_set_replaces_field(ws):
    init(ws, topic="T", mode="facilitator")
    run(ws, "set", "--workspace", ws, "--key", "mode", "--value", "partner")
    assert read_log(read(ws))[0]["mode"] == "partner"


def test_set_preserves_body(ws):
    init(ws)
    append(ws, "keep me", entry_type="idea")
    run(ws, "set", "--workspace", ws, "--key", "mode", "--value", "partner")
    meta, body = read_log(read(ws))
    assert meta["mode"] == "partner"
    assert "- (idea) keep me" in body


def test_set_reports_malformed_frontmatter_on_one_line(ws, capsys):
    raw = "---\ntopic: Auth: phase 2\n---\n\n- keep me\n"
    (Path(ws) / MEMLOG).write_text(raw, encoding="utf-8")

    assert run(ws, "set", "--workspace", ws, "--key", "mode", "--value", "partner") == 2

    output = capsys.readouterr()
    assert output.out == ""
    assert output.err.startswith("error: mapping values are not allowed here")
    assert len(output.err.splitlines()) == 1
    assert read(ws) == raw


def test_updated_stays_last(ws):
    init(ws)
    run(ws, "set", "--workspace", ws, "--key", "owner", "--value", "BMad")
    meta = read_log(read(ws))[0]
    assert list(meta)[-1] == "updated"


# --- robustness ---------------------------------------------------------


def test_set_roundtrip_preserves_frontmatter_and_body(ws):
    init(ws)
    append(ws, "one", entry_type="idea")
    meta, body = read_log(read(ws))
    assert run(ws, "set", "--workspace", ws, "--key", "topic", "--value", meta["topic"]) == 0
    after, after_body = read_log(read(ws))
    assert {k: v for k, v in after.items() if k != "updated"} == {k: v for k, v in meta.items() if k != "updated"}
    assert after_body == "\n" + body.lstrip("\n")


def test_missing_installed_module_prompts_setup(tmp_path):
    result = subprocess.run(
        [sys.executable, str(SCRIPT), "--project-root", str(tmp_path), "init", "--workspace", str(tmp_path)],
        capture_output=True,
        encoding="utf-8",
        check=False,
    )
    assert result.returncode == 2
    assert result.stdout == ""
    missing = tmp_path / "_bmad" / "scripts" / "frontmatter.py"
    assert result.stderr.splitlines() == [f"error: {missing} is missing. Run bmad setup for this project."]
    assert not (tmp_path / MEMLOG).exists()


def test_commas_in_field_survive(ws):
    init(ws, topic="cars, trains, and planes")
    append(ws, "z", entry_type="idea")
    meta, _ = read_log(read(ws))
    assert meta["topic"] == "cars, trains, and planes"


def test_triple_dash_in_field_does_not_corrupt_frontmatter(ws):
    # A `---` inside a value must NOT be read as the closing fence: topic stays intact
    # and the body never leaks frontmatter text.
    init(ws, topic="Pricing --- tiers --- and add-ons")
    append(ws, "an idea", entry_type="idea")
    meta, body = read_log(read(ws))
    assert meta["topic"] == "Pricing --- tiers --- and add-ons"
    assert entries(ws) == ["- (idea) an idea"]
    assert "topic:" not in body  # frontmatter never bled into the body


def test_newline_in_field_is_neutralized(ws):
    # A value carrying a newline can't break the fence on the next round-trip.
    run(ws, "init", "--workspace", ws, "--field", "topic=line one\nline two")
    append(ws, "x", entry_type="idea")
    meta, _ = read_log(read(ws))
    assert "\n" not in meta["topic"]


def test_append_emits_json_ack(ws, capsys):
    init(ws)
    append(ws, "x", entry_type="idea")
    out = json.loads(capsys.readouterr().out.strip().splitlines()[-1])
    assert out["ok"] is True
    assert out["entries"] == 1
    assert out["memlog"].endswith(MEMLOG)
    assert "status" not in out  # no lifecycle status
    assert "section" not in out  # sections are gone


def test_ack_entry_count_climbs(ws, capsys):
    init(ws)
    append(ws, "a")
    append(ws, "b")
    out = json.loads(capsys.readouterr().out.strip().splitlines()[-1])
    assert out["entries"] == 2


# --- append writes only its own line ------------------------------------


def test_first_entry_after_init(ws):
    init(ws)
    append(ws, "first", entry_type="idea")
    meta, _ = read_log(read(ws))
    assert meta["topic"] == "Reinvent the lunchbox"
    assert entries(ws) == ["- (idea) first"]


def test_append_does_not_restamp_updated(ws):
    init(ws)
    path = Path(ws) / MEMLOG
    path.write_text(read(ws).replace(read_log(read(ws))[0]["updated"], "2000-01-01T00:00"), encoding="utf-8")
    append(ws, "a")
    append(ws, "b")
    assert read_log(read(ws))[0]["updated"] == "2000-01-01T00:00"
    assert entries(ws) == ["- a", "- b"]


def test_append_to_missing_log_fails_and_creates_nothing(ws):
    with pytest.raises(FileNotFoundError):
        run(ws, "append", "--workspace", ws, "--text", "orphan")
    assert not (Path(ws) / MEMLOG).exists()


def test_append_after_missing_trailing_newline_starts_new_line(ws):
    init(ws)
    append(ws, "first")
    path = Path(ws) / MEMLOG
    path.write_text(read(ws).rstrip("\n"), encoding="utf-8")
    append(ws, "second")
    assert entries(ws) == ["- first", "- second"]


def test_parallel_appends_all_land(ws):
    init(ws)
    n = 40
    procs = [
        subprocess.Popen(
            [sys.executable, str(SCRIPT), "--project-root", ws, "append", "--workspace", ws, "--text", f"entry {i}"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
        )
        for i in range(n)
    ]
    failures = [p.stderr.read().decode() for p in procs if p.wait() != 0]
    assert failures == []
    assert sorted(entries(ws)) == sorted(f"- entry {i}" for i in range(n))
    assert not (Path(ws) / "_bmad" / "scripts" / "__pycache__").exists()


def test_fields_that_clash_with_yaml_round_trip_as_yaml(ws):
    init(ws, topic="Fix #42: login", commit="0123456", flag="yes")
    run(ws, "set", "--workspace", ws, "--key", "owner: alex", "--value", "x")
    run(ws, "set", "--workspace", ws, "--key", "a\n---\nb", "--value", "y")
    want = {"topic": "Fix #42: login", "commit": "0123456", "flag": "yes", "owner: alex": "x", "a --- b": "y"}
    assert {k: v for k, v in read_log(read(ws))[0].items() if k != "updated"} == want
    assert {k: v for k, v in yaml.safe_load(frontmatter.split(read(ws))[0]).items() if k != "updated"} == want


def test_init_writes_lf_line_endings(ws):
    init(ws)
    raw = (Path(ws) / MEMLOG).read_bytes()
    assert b"\r\n" not in raw


def test_append_preserves_lf_even_when_os_linesep_is_crlf(ws, monkeypatch):
    init(ws)
    monkeypatch.setattr(os, "linesep", "\r\n")
    append(ws, "first", entry_type="note")
    append(ws, "second", entry_type="note")
    raw = (Path(ws) / MEMLOG).read_bytes()
    assert b"\r\n" not in raw
    assert entries(ws) == ["- (note) first", "- (note) second"]


def test_append_preserves_crlf_and_bom_and_handles_missing_trailing_newline(ws):
    init(ws)
    path = Path(ws) / MEMLOG
    path.write_bytes(b"\xef\xbb\xbf" + path.read_bytes().replace(b"\n", b"\r\n").rstrip(b"\r\n"))
    append(ws, "crlf entry", entry_type="note")
    raw = path.read_bytes()
    assert raw.startswith(b"\xef\xbb\xbf---\r\n")
    assert b"\r\n" in raw
    assert b"\n" not in raw.replace(b"\r\n", b"")
    assert entries(ws) == ["- (note) crlf entry"]


def test_set_preserves_lf_or_crlf_and_bom(ws):
    init(ws)
    append(ws, "kept", entry_type="note")
    path = Path(ws) / MEMLOG
    assert b"\r\n" not in path.read_bytes()
    assert run(ws, "set", "--workspace", ws, "--key", "mode", "--value", "lf") == 0
    assert b"\r\n" not in path.read_bytes()

    crlf_bom = b"\xef\xbb\xbf" + path.read_bytes().replace(b"\n", b"\r\n")
    path.write_bytes(crlf_bom)
    assert run(ws, "set", "--workspace", ws, "--key", "mode", "--value", "crlf") == 0
    after = path.read_bytes()
    assert after.startswith(b"\xef\xbb\xbf")
    assert b"\r\n" in after
    assert b"\n" not in after.replace(b"\r\n", b"")
    assert read_log(read(ws))[0]["mode"] == "crlf"
    assert entries(ws) == ["- (note) kept"]


def test_append_and_set_handle_cr_only_line_endings(ws):
    init(ws)
    path = Path(ws) / MEMLOG
    path.write_bytes(path.read_bytes().replace(b"\n", b"\r"))
    append(ws, "cr entry", entry_type="note")
    assert b"\n" not in path.read_bytes()
    assert run(ws, "set", "--workspace", ws, "--key", "mode", "--value", "cr") == 0
    assert b"\n" not in path.read_bytes()
    assert read_log(read(ws))[0]["mode"] == "cr"
    assert entries(ws) == ["- (note) cr entry"]
