# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for memlog.py. Run: uv run --with pytest pytest scripts/tests/test_memlog.py

The spine under test is the flat, append-only, chronological invariant: every entry is
one line recorded at the end in the order it happened — no sections, no grouping.
"""
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import memlog  # noqa: E402

MEMLOG = ".memlog.md"


@pytest.fixture
def ws(tmp_path):
    return str(tmp_path)


def read(ws):
    return (Path(ws) / MEMLOG).read_text(encoding="utf-8")


def body_of(ws):
    return memlog.split(read(ws))[1]


def entries(ws):
    return [ln for ln in body_of(ws).splitlines() if ln.startswith("- ")]


def init(ws, **fields):
    fields = fields or {"topic": "Reinvent the lunchbox", "goal": "ideas for a pitch"}
    argv = ["init", "--workspace", ws]
    for k, v in fields.items():
        argv += ["--field", f"{k}={v}"]
    assert memlog.main(argv) == 0


def append(ws, text, entry_type=None, by=None):
    argv = ["append", "--workspace", ws, "--text", text]
    if entry_type:
        argv += ["--type", entry_type]
    if by:
        argv += ["--by", by]
    assert memlog.main(argv) == 0


# --- init ---------------------------------------------------------------

def test_init_writes_frontmatter_fields(ws):
    init(ws)
    meta, body = memlog.split(read(ws))
    assert meta["topic"] == "Reinvent the lunchbox"
    assert meta["goal"] == "ideas for a pitch"
    assert meta["status"] == "active"
    assert "updated" in meta
    assert body.strip() == ""


def test_init_arbitrary_fields(ws):
    init(ws, topic="T", audience="board")
    meta, _ = memlog.split(read(ws))
    assert meta["audience"] == "board"


def test_init_refuses_overwrite(ws):
    init(ws)
    assert memlog.main(["init", "--workspace", ws, "--field", "topic=other"]) == 2


def test_init_creates_missing_workspace(tmp_path):
    nested = str(tmp_path / "a" / "b")
    assert memlog.main(["init", "--workspace", nested, "--field", "topic=T"]) == 0
    assert (Path(nested) / MEMLOG).is_file()


def test_init_rejects_malformed_field(ws):
    assert memlog.main(["init", "--workspace", ws, "--field", "noequals"]) == 2


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


# --- set ----------------------------------------------------------------

def test_set_flips_status(ws):
    init(ws)
    memlog.main(["set", "--workspace", ws, "--key", "status", "--value", "complete"])
    assert memlog.split(read(ws))[0]["status"] == "complete"


def test_set_preserves_body(ws):
    init(ws)
    append(ws, "keep me", entry_type="idea")
    memlog.main(["set", "--workspace", ws, "--key", "status", "--value", "complete"])
    meta, body = memlog.split(read(ws))
    assert meta["status"] == "complete"
    assert "- (idea) keep me" in body


def test_set_can_add_new_field(ws):
    init(ws)
    memlog.main(["set", "--workspace", ws, "--key", "owner", "--value", "BMad"])
    assert memlog.split(read(ws))[0]["owner"] == "BMad"


def test_updated_stays_last(ws):
    init(ws)
    memlog.main(["set", "--workspace", ws, "--key", "owner", "--value", "BMad"])
    meta = memlog.split(read(ws))[0]
    assert list(meta)[-1] == "updated"


# --- robustness ---------------------------------------------------------

def test_roundtrip_render_is_stable(ws):
    init(ws)
    append(ws, "one", entry_type="idea")
    first = read(ws)
    meta, body = memlog.split(first)
    assert memlog.render(meta, body) == first


def test_commas_in_field_survive(ws):
    init(ws, topic="cars, trains, and planes")
    append(ws, "z", entry_type="idea")
    meta, _ = memlog.split(read(ws))
    assert meta["topic"] == "cars, trains, and planes"


def test_triple_dash_in_field_does_not_corrupt_frontmatter(ws):
    # A `---` inside a value must NOT be read as the closing fence: topic stays intact,
    # status survives, and the body never leaks frontmatter text.
    init(ws, topic="Pricing --- tiers --- and add-ons")
    append(ws, "an idea", entry_type="idea")
    meta, body = memlog.split(read(ws))
    assert meta["topic"] == "Pricing --- tiers --- and add-ons"
    assert meta["status"] == "active"
    assert entries(ws) == ["- (idea) an idea"]
    assert "status:" not in body  # frontmatter never bled into the body


def test_triple_dash_status_survives_in_ack(ws, capsys):
    init(ws, topic="a --- b")
    append(ws, "x", entry_type="idea")
    out = json.loads(capsys.readouterr().out.strip().splitlines()[-1])
    assert out["status"] == "active"  # not "" — frontmatter recovered cleanly


def test_newline_in_field_is_neutralized(ws):
    # A value carrying a newline can't break the fence on the next round-trip.
    memlog.main(["init", "--workspace", ws, "--field", "topic=line one\nline two"])
    append(ws, "x", entry_type="idea")
    meta, _ = memlog.split(read(ws))
    assert "\n" not in meta["topic"]
    assert meta["status"] == "active"


def test_append_emits_json_ack(ws, capsys):
    init(ws)
    append(ws, "x", entry_type="idea")
    out = json.loads(capsys.readouterr().out.strip().splitlines()[-1])
    assert out["ok"] is True
    assert out["status"] == "active"
    assert out["entries"] == 1
    assert out["memlog"].endswith(MEMLOG)
    assert "section" not in out  # sections are gone


def test_ack_entry_count_climbs(ws, capsys):
    init(ws)
    append(ws, "a")
    append(ws, "b")
    out = json.loads(capsys.readouterr().out.strip().splitlines()[-1])
    assert out["entries"] == 2
