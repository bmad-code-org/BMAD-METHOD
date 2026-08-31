# /// script
# requires-python = ">=3.10"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for memlog.py. Run: uv run --with pytest pytest scripts/tests/test_memlog.py

The spine under test is the flat, append-only, chronological invariant: every entry is
one line recorded at the end in the order it happened — no sections, no grouping, and no
lifecycle status the log would have to mutate.
"""
import json
import os
import subprocess
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
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
    assert "updated" in meta
    assert body.strip() == ""


def test_init_has_no_lifecycle_status(ws):
    # A memory log carries no "status" flag; completion is an appended entry, not frontmatter.
    init(ws)
    meta, _ = memlog.split(read(ws))
    assert "status" not in meta


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


# --- addressing: --workspace and --path are interchangeable --------------

def test_path_addressing_targets_the_file_directly(tmp_path):
    target = tmp_path / "run" / ".memlog.md"
    assert memlog.main(["init", "--path", str(target), "--field", "topic=T"]) == 0
    assert target.is_file()
    assert memlog.main(["append", "--path", str(target), "--text", "an idea", "--type", "idea"]) == 0
    body = memlog.split(target.read_text(encoding="utf-8"))[1]
    assert "- (idea) an idea" in body


def test_workspace_and_path_resolve_to_same_file(ws):
    init(ws)
    via_path = str(Path(ws) / MEMLOG)
    assert memlog.main(["append", "--path", via_path, "--text", "from path"]) == 0
    assert memlog.main(["append", "--workspace", ws, "--text", "from workspace"]) == 0
    assert entries(ws) == ["- from path", "- from workspace"]


def test_target_is_required(ws):
    with pytest.raises(SystemExit):
        memlog.main(["append", "--text", "orphan"])  # neither --workspace nor --path


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
    meta, _ = memlog.split(read(ws))
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
    memlog.main(["set", "--workspace", ws, "--key", "mode", "--value", "partner"])
    assert memlog.split(read(ws))[0]["mode"] == "partner"


def test_set_replaces_field(ws):
    init(ws, topic="T", mode="facilitator")
    memlog.main(["set", "--workspace", ws, "--key", "mode", "--value", "partner"])
    assert memlog.split(read(ws))[0]["mode"] == "partner"


def test_set_preserves_body(ws):
    init(ws)
    append(ws, "keep me", entry_type="idea")
    memlog.main(["set", "--workspace", ws, "--key", "mode", "--value", "partner"])
    meta, body = memlog.split(read(ws))
    assert meta["mode"] == "partner"
    assert "- (idea) keep me" in body


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
    # A `---` inside a value must NOT be read as the closing fence: topic stays intact
    # and the body never leaks frontmatter text.
    init(ws, topic="Pricing --- tiers --- and add-ons")
    append(ws, "an idea", entry_type="idea")
    meta, body = memlog.split(read(ws))
    assert meta["topic"] == "Pricing --- tiers --- and add-ons"
    assert entries(ws) == ["- (idea) an idea"]
    assert "topic:" not in body  # frontmatter never bled into the body


def test_newline_in_field_is_neutralized(ws):
    # A value carrying a newline can't break the fence on the next round-trip.
    memlog.main(["init", "--workspace", ws, "--field", "topic=line one\nline two"])
    append(ws, "x", entry_type="idea")
    meta, _ = memlog.split(read(ws))
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


def test_permission_error_without_visible_lock_is_not_misreported_as_contention(tmp_path, monkeypatch):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    real_open = os.open

    def deny_open(candidate, *args, **kwargs):
        if Path(candidate) == lock:
            raise PermissionError("workspace is not writable")
        return real_open(candidate, *args, **kwargs)

    monkeypatch.setattr(memlog.os, "open", deny_open)
    with pytest.raises(PermissionError, match="not writable"):
        with memlog.exclusive_lock(target):
            pass


def test_windows_style_permission_error_on_existing_lock_times_out_as_contention(tmp_path, monkeypatch):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    lock.write_text(f"holder-token 123 {time.time()}\n", encoding="ascii")
    real_open = os.open

    def deny_open(candidate, *args, **kwargs):
        if Path(candidate) == lock:
            raise PermissionError("file is locked")
        return real_open(candidate, *args, **kwargs)

    monkeypatch.setattr(memlog.os, "open", deny_open)
    monkeypatch.setattr(memlog, "LOCK_TIMEOUT_SECONDS", 0.0)
    with pytest.raises(TimeoutError, match="holder-token"):
        with memlog.exclusive_lock(target):
            pass
    assert lock.exists()


def test_lock_cleanup_runs_when_the_protected_operation_fails(tmp_path):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    with pytest.raises(RuntimeError, match="boom"):
        with memlog.exclusive_lock(target):
            raise RuntimeError("boom")
    assert not lock.exists()
    guard = lock.with_suffix(lock.suffix + ".guard")
    assert guard.is_file()  # persistent inode; the advisory lock itself is released


def test_coordination_guard_never_initializes_through_an_existing_hardlink(tmp_path):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    guard = lock.with_suffix(lock.suffix + ".guard")
    victim = tmp_path / "victim.txt"
    victim.write_bytes(b"")
    os.link(victim, guard)

    with pytest.raises(OSError, match="multiple hard links"):
        with memlog.exclusive_lock(target):
            pass
    assert victim.read_bytes() == b""
    assert not lock.exists()


def test_unpublished_guard_is_awaited_instead_of_failing_the_write(tmp_path):
    """A guard created but not yet published is contention, not corruption."""
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    guard = lock.with_suffix(lock.suffix + ".guard")
    guard.touch()  # creator paused between its O_EXCL create and its byte

    def publish():
        time.sleep(0.1)
        with open(guard, "r+b") as handle:
            handle.write(b"\0")
            handle.flush()
            os.fsync(handle.fileno())

    publisher = threading.Thread(target=publish)
    publisher.start()
    try:
        with memlog.exclusive_lock(target):
            assert lock.is_file()
    finally:
        publisher.join()
    assert not lock.exists()
    assert guard.stat().st_size == 1


def test_empty_guard_from_a_dead_creator_is_reclaimed(tmp_path, monkeypatch):
    """A zero-length guard left by a crashed creator must not wedge writes forever."""
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    guard = lock.with_suffix(lock.suffix + ".guard")
    guard.touch()  # creator died after its O_EXCL create, before publishing the byte
    assert guard.stat().st_size == 0
    monkeypatch.setattr(memlog, "LOCK_TIMEOUT_SECONDS", 0.05)
    monkeypatch.setattr(memlog, "LOCK_POLL_SECONDS", 0.001)

    with memlog.exclusive_lock(target):
        assert lock.is_file()
        assert guard.stat().st_size == 1  # reclaimed and recreated, fully formed

    assert not lock.exists()
    assert guard.is_file()


def test_guard_removed_between_open_attempts_is_retried(tmp_path, monkeypatch):
    """An operator deleting the sidecar mid-open must not fail an application write."""
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    guard = lock.with_suffix(lock.suffix + ".guard")
    real_open = memlog.os.open
    attempts = {"count": 0}

    def flaky_open(path, flags, *rest):
        if str(path) == str(guard):
            attempts["count"] += 1
            if attempts["count"] == 1:
                raise FileExistsError(f"synthetic contention: {guard}")
            if attempts["count"] == 2:
                raise FileNotFoundError(f"synthetic removal: {guard}")
        return real_open(path, flags, *rest)

    monkeypatch.setattr(memlog.os, "open", flaky_open)
    with memlog.exclusive_lock(target):
        assert lock.is_file()
    assert attempts["count"] >= 3
    assert not lock.exists()


def test_lock_cleanup_still_unlinks_after_close_error(tmp_path, monkeypatch):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    real_close = os.close

    def close_then_fail(descriptor):
        real_close(descriptor)
        raise OSError("close failed")

    monkeypatch.setattr(memlog.os, "close", close_then_fail)
    with pytest.raises(OSError, match="close failed"):
        with memlog.exclusive_lock(target):
            pass
    assert not lock.exists()


def test_orphaned_lock_is_reclaimed_after_the_documented_lease(tmp_path, monkeypatch):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    lock.write_text(f"orphan-token 999 {time.time() - 60}\n", encoding="ascii")
    monkeypatch.setattr(memlog, "LOCK_TIMEOUT_SECONDS", 0.0)
    monkeypatch.setattr(memlog, "ORPHAN_LOCK_SECONDS", 1.0)

    with memlog.exclusive_lock(target):
        assert lock.exists()
        assert not lock.read_text(encoding="ascii").startswith("orphan-token ")
    assert not lock.exists()


def test_young_lock_is_preserved_and_timeout_is_actionable(tmp_path, monkeypatch):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    lock.write_text(f"active-token 321 {time.time()}\n", encoding="ascii")
    monkeypatch.setattr(memlog, "LOCK_TIMEOUT_SECONDS", 0.01)
    monkeypatch.setattr(memlog, "LOCK_POLL_SECONDS", 0.001)

    with pytest.raises(TimeoutError, match="inspect the process"):
        with memlog.exclusive_lock(target):
            pass
    assert lock.exists()


def test_expired_writer_does_not_remove_a_successor_lock(tmp_path):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    successor = f"successor-token 456 {time.time()}\n"

    with memlog.exclusive_lock(target):
        lock.write_text(successor, encoding="ascii")
    assert lock.read_text(encoding="ascii") == successor
    lock.unlink()


def test_orphan_reclaim_is_serialized_with_successor_acquisition(tmp_path, monkeypatch):
    target = tmp_path / MEMLOG
    lock = target.with_suffix(target.suffix + ".lock")
    lock.write_text(f"orphan-token 999 {time.time() - 60}\n", encoding="ascii")
    monkeypatch.setattr(memlog, "LOCK_TIMEOUT_SECONDS", 0.2)
    monkeypatch.setattr(memlog, "LOCK_POLL_SECONDS", 0.001)
    monkeypatch.setattr(memlog, "ORPHAN_LOCK_SECONDS", 0.0)

    reclaim_paused = threading.Event()
    allow_unlink = threading.Event()
    real_unlink = memlog._unlink_lock_path
    first_unlink = True

    def pause_before_orphan_unlink(lock_path):
        nonlocal first_unlink
        if first_unlink:
            first_unlink = False
            reclaim_paused.set()
            assert allow_unlink.wait(timeout=2)
        real_unlink(lock_path)

    monkeypatch.setattr(memlog, "_unlink_lock_path", pause_before_orphan_unlink)

    state_guard = threading.Lock()
    active = 0
    max_active = 0
    observed_tokens = []

    def writer():
        nonlocal active, max_active
        with memlog.exclusive_lock(target):
            with state_guard:
                active += 1
                max_active = max(max_active, active)
                observed_tokens.append(lock.read_text(encoding="ascii").split()[0])
            time.sleep(0.03)
            with state_guard:
                active -= 1

    with ThreadPoolExecutor(max_workers=2) as pool:
        first = pool.submit(writer)
        assert reclaim_paused.wait(timeout=2)
        second = pool.submit(writer)
        assert not second.done()  # successor cannot replace the pathname mid-reclaim
        allow_unlink.set()
        first.result(timeout=3)
        second.result(timeout=3)

    assert max_active == 1
    assert len(set(observed_tokens)) == 2
    assert not lock.exists()


def test_concurrent_appends_preserve_every_entry(tmp_path):
    target = tmp_path / MEMLOG
    script = str(Path(memlog.__file__).resolve())
    subprocess.run(
        [sys.executable, script, "init", "--path", str(target), "--field", "topic=concurrency"],
        check=True,
        capture_output=True,
        text=True,
        timeout=30,
    )

    def append_in_process(index):
        return subprocess.run(
            [
                sys.executable,
                script,
                "append",
                "--path",
                str(target),
                "--type",
                "note",
                "--text",
                f"entry-{index}",
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )

    count = 50
    with ThreadPoolExecutor(max_workers=count) as pool:
        results = list(pool.map(append_in_process, range(count)))

    failures = [
        f"{index}: exit {result.returncode}: {result.stderr.strip()}"
        for index, result in enumerate(results)
        if result.returncode != 0
    ]
    assert not failures, "\n".join(failures)

    body = memlog.split(target.read_text(encoding="utf-8"))[1]
    actual = [line for line in body.splitlines() if line.startswith("- ")]
    expected = {f"- (note) entry-{index}" for index in range(count)}
    assert len(actual) == count
    assert set(actual) == expected
    assert not target.with_suffix(target.suffix + ".lock").exists()
