#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Tests for shard_tool.py."""

import io
import json
import sys
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import shard_tool  # noqa: E402


def run(*argv: str) -> tuple[int, dict]:
    out = io.StringIO()
    with redirect_stdout(out), redirect_stderr(io.StringIO()):
        code = shard_tool.main(list(argv))
    return code, json.loads(out.getvalue())


def doc(sections: int = 6, para: int = 40) -> str:
    """A markdown document with a title and sections of predictable size, one holding a table and a diagram."""
    lines = ["# Sample", ""]
    for i in range(1, sections + 1):
        lines += [f"## Section {i}: FR-AB-{i:03d}", ""]
        lines += [f"Line {i}.{j} with some words to fill it out for the size test." for j in range(para)]
        if i == 2:
            lines += [
                "",
                "| a | b |",
                "|---|---|",
                "| 1 | 2 |",
                "",
                "```mermaid",
                "graph TD",
                "## not a heading",
                "```",
            ]
        lines.append("")
    return "\n".join(lines) + "\n"


def faithful_plan(tmp: Path, src: Path, lines: int, cut: list[int], extra: dict | None = None) -> Path:
    """A faithful plan cutting src at the given start lines."""
    starts = [1] + cut
    shards = []
    for i, a in enumerate(starts):
        b = starts[i + 1] - 1 if i + 1 < len(starts) else lines
        shards.append(
            {"file": f"part-{i + 1}.md", "title": f"Part {i + 1}", "summary": f"Lines {a} to {b}", "start": a, "end": b}
        )
    plan = {
        "source": str(src),
        "folder": str(tmp / "doc-sample"),
        "title": "Sample",
        "kind": "faithful",
        "groups": [{"heading": "All", "shards": shards}],
    }
    plan |= extra or {}
    path = tmp / "plan.json"
    path.write_text(json.dumps(plan))
    return path


@pytest.fixture
def built(tmp_path):
    src = tmp_path / "sample.md"
    src.write_text(doc())
    lines = src.read_text().splitlines()
    heads = [i for i, x in enumerate(lines, 1) if x.startswith("## Section")]
    plan = faithful_plan(tmp_path, src, len(lines), heads[1:4], {"lookup": r"FR-AB-\d+"})
    code, out = run("build", str(plan))
    assert code == 0, out
    return tmp_path / "doc-sample"


def test_outline_cut_respects_blocks_and_sizes(tmp_path):
    src = tmp_path / "big.md"
    src.write_text(doc(sections=12, para=120))
    code, out = run("outline", str(src))
    assert code == 0
    assert all(h["text"] != "not a heading" for h in out["headings"])
    blocks = [(b["start"], b["end"]) for b in out["blocks"]]
    for seg in out["proposed_cut"]:
        assert not any(a < seg["start"] <= b for a, b in blocks)
    assert max(s["chars"] for s in out["proposed_cut"]) <= shard_tool.MAX_CHARS
    starts = [s["start"] for s in out["proposed_cut"]]
    assert starts == sorted(starts) and out["proposed_cut"][-1]["end"] == out["lines"]


def test_outline_flags_bare_identifier_headings(tmp_path):
    src = tmp_path / "manual.md"
    src.write_text("# Manual\n\n## 1\n\n### 1-1\n\ntext\n\n### C-2\n\ntext\n")
    _, out = run("outline", str(src))
    assert out["bare_heading_share"] == 1.0


def test_convert_vtt(tmp_path):
    vtt = tmp_path / "call.vtt"
    vtt.write_text(
        "WEBVTT\n\n00:00:41.000 --> 00:00:44.663\n<v Priya Raman>Okay. Is this\nrecording?\n\n01:02:03.500 --> 01:02:05.000\n<v Jun>Yes.\n"
    )
    code, out = run("convert", str(vtt), "--out", str(tmp_path / "call.txt"))
    assert code == 0
    assert (tmp_path / "call.txt").read_text().splitlines() == [
        "[00:00:41] Priya Raman: Okay. Is this recording?",
        "[01:02:03] Jun: Yes.",
    ]


def test_convert_srt(tmp_path):
    srt = tmp_path / "call.srt"
    srt.write_text("1\n00:00:01,000 --> 00:00:02,000\nHello there\n\n2\n00:00:03,000 --> 00:00:04,000\nSecond line\n")
    run("convert", str(srt), "--out", str(tmp_path / "out.txt"))
    assert (tmp_path / "out.txt").read_text().splitlines() == ["[00:00:01] Hello there", "[00:00:03] Second line"]


def test_convert_slack_nests_threads_and_resolves_users(tmp_path):
    exp = tmp_path / "export"
    (exp / "general").mkdir(parents=True)
    (exp / "users.json").write_text(
        json.dumps([{"id": "U1", "profile": {"real_name": "Ana"}}, {"id": "U2", "name": "bo"}])
    )
    (exp / "channels.json").write_text("[]")
    msgs = [
        {"ts": "1782892800.0", "user": "U1", "text": "Plan?", "thread_ts": "1782892800.0"},
        {"ts": "1782893400.0", "user": "U2", "text": "Yes <@U1>", "thread_ts": "1782892800.0"},
    ]
    (exp / "general" / "2026-07-01.json").write_text(json.dumps(msgs))
    code, _ = run("convert", str(exp), "--out", str(tmp_path / "s.md"))
    assert code == 0
    text = (tmp_path / "s.md").read_text()
    assert "- [08:00] Ana: Plan?" in text and "  - [2026-07-01 08:10] bo: Yes @Ana" in text


def test_convert_folder_marks_files(tmp_path):
    notes = tmp_path / "notes"
    notes.mkdir()
    (notes / "a.md").write_text("# A\n")
    (notes / "b.txt").write_text("b\n")
    run("convert", str(notes), "--out", str(tmp_path / "all.md"))
    assert (tmp_path / "all.md").read_text().splitlines()[:2] == ["<!-- file: a.md -->", "# A"]


def test_build_moves_source_and_rebuilds_exactly(built):
    assert not (built.parent / "sample.md").exists()
    assert (built / ".source" / "sample.md").exists()
    main = (built / "doc-sample.md").read_text()
    assert shard_tool.NOTE_MARK in main and "](./part-3.md)" in main and "identifier-lookup.md" in main
    code, out = run("check", str(built), "--rebuild")
    assert code == 0, out


def test_build_rejects_gaps(tmp_path):
    src = tmp_path / "s.md"
    src.write_text(doc())
    plan = json.loads(faithful_plan(tmp_path, src, 10, [40]).read_text())
    plan["groups"][0]["shards"][1]["start"] = 45
    (tmp_path / "plan.json").write_text(json.dumps(plan))
    code, out = run("build", str(tmp_path / "plan.json"))
    assert code == 2 and "gap or overlap" in out["error"]


def test_build_keeps_frontmatter_in_main(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("---\nstatus: draft\ntype: prd\n---\n" + doc())
    n = len(src.read_text().splitlines())
    run("build", str(faithful_plan(tmp_path, src, n, [60])))
    folder = tmp_path / "doc-sample"
    assert (folder / "doc-sample.md").read_text().startswith("---\nstatus: draft\ntype: prd\n---\n# Sample")
    assert not (folder / "part-1.md").read_text().count("type: prd")
    code, out = run("check", str(folder), "--rebuild")
    assert code == 0, out


def test_long_map_splits_into_sub_maps(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("\n".join(f"line {i}" for i in range(1, 501)) + "\n")
    shards = [
        {"file": f"s{i}.md", "title": f"S{i}", "summary": "x", "start": i * 2 + 1, "end": i * 2 + 2} for i in range(250)
    ]
    groups = [{"heading": f"Group {g}", "shards": shards[g * 50 : (g + 1) * 50]} for g in range(5)]
    plan = {"source": str(src), "folder": str(tmp_path / "big"), "title": "Big", "kind": "faithful", "groups": groups}
    (tmp_path / "p.json").write_text(json.dumps(plan))
    code, out = run("build", str(tmp_path / "p.json"))
    assert code == 0 and len(out["sub_maps"]) == 5
    assert len((tmp_path / "big" / "big.md").read_text().splitlines()) <= shard_tool.WINDOW
    code, out = run("check", str(tmp_path / "big"), "--rebuild")
    assert code == 0, out


def test_check_catches_broken_links_orphans_names_and_edits(built):
    (built / "part-2.md").write_text((built / "part-2.md").read_text() + "\nSee [gone](./gone.md).\n")
    main = built / "doc-sample.md"
    main.write_text("".join(x for x in main.read_text().splitlines(keepends=True) if "](./part-4.md)" not in x))
    code, out = run("check", str(built), "--rebuild")
    kinds = {f["check"] for f in out["failures"]}
    assert code == 1 and {"link", "orphan", "rebuild"} <= kinds
    plan = json.loads((built / ".shards.json").read_text())
    plan["groups"][0]["shards"][0]["file"] = "doc-intro.md"
    (built / "part-1.md").rename(built / "doc-intro.md")
    (built / ".shards.json").write_text(json.dumps(plan))
    _, out = run("check", str(built))
    assert any(f["check"] == "name" for f in out["failures"])


def test_check_rewritten_timestamp_citations(tmp_path):
    src = tmp_path / "t.txt"
    src.write_text("[00:00:10] Jun: ARR is $4.8M.\n[00:05:00] Jun: Correction, ARR is $4.6M.\n[00:06:00] Ana: Fine.\n")
    shards = [{"file": "metrics.md", "title": "Metrics", "summary": "ARR", "sources": ["00:00:10-00:06:00"]}]
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "call"),
        "title": "Call",
        "kind": "rewrite",
        "groups": [{"heading": "All", "shards": shards}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan))
    code, out = run("build", str(tmp_path / "p.json"))
    assert out["to_write"] == ["metrics.md"]
    folder = tmp_path / "call"
    good = "# Metrics\n\nPart of [Call](./call.md).\n\nARR is $4.6M (00:05:00).\n\n**Superseded** (00:05:00, by the correction): $4.8M (00:00:10; 00:05:00-00:06:00).\n"
    (folder / "metrics.md").write_text(good)
    code, out = run("check", str(folder))
    assert code == 0 and not out["warnings"], out
    bad = "# Metrics\n\nAna agreed (00:05:00-00:05:30). Jun said so (00:00:10, 00:09:00). An aside (not a citation).\n"
    (folder / "metrics.md").write_text(bad)
    code, out = run("check", str(folder))
    texts = [f["text"] for f in out["failures"]]
    assert code == 1 and len(texts) == 2 and "00:05:30" in texts[0] and "00:09:00" in texts[1]


def test_line_citations_out_of_range(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("a\nb 30 mm\nc\n")
    shards = [{"file": "x.md", "title": "X", "summary": "x", "sources": ["L1-3"]}]
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "d"),
        "title": "D",
        "kind": "rewrite",
        "groups": [{"heading": "G", "shards": shards}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan))
    run("build", str(tmp_path / "p.json"))
    (tmp_path / "d" / "x.md").write_text("# X\n\nGap 30 mm (L2). Gap 40 mm (L2). Other (L9).\n")
    _, out = run("check", str(tmp_path / "d"))
    assert any(f["check"] == "citation" for f in out["failures"])
    assert [w["text"] for w in out["warnings"]] == ["40 mm is not in the cited source lines"]


def test_map_rewrites_after_a_new_shard(built):
    (built / "extra.md").write_text("# Extra\n\nNew content.\n")
    plan = json.loads((built / ".shards.json").read_text())
    plan["groups"][0]["shards"].append({"file": "extra.md", "title": "Extra", "summary": "Added later"})
    (built / ".shards.json").write_text(json.dumps(plan))
    _, out = run("check", str(built))
    assert any(f["check"] == "orphan" for f in out["failures"])
    code, _ = run("map", str(built))
    assert code == 0 and "](./extra.md)" in (built / "doc-sample.md").read_text()
    code, out = run("check", str(built))
    assert code == 0, out


def test_lookup_lists_each_identifier_home(built):
    text = (built / "identifier-lookup.md").read_text()
    assert "| FR-AB-001 | [part-1](./part-1.md) |" in text


def test_toc_insert_check_and_refresh(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text(doc())
    _, outline = run("outline", str(f))
    starts = [h["line"] for h in outline["headings"] if h["level"] == 2]
    plan = {
        "groups": [{"heading": "All", "shards": [{"start": s, "title": f"Title {k}"} for k, s in enumerate(starts, 1)]}]
    }
    (tmp_path / "toc.json").write_text(json.dumps(plan))
    code, out = run("toc", str(f), "--plan", str(tmp_path / "toc.json"))
    assert code == 0 and out["fits_window"]
    lines = f.read_text().splitlines()
    entry = next(x for x in lines if x.endswith(" Title 3"))
    start = int(entry.split()[1][1:].split("-")[0])
    assert lines[start - 1] == "## Section 3: FR-AB-003"
    assert run("check", str(f))[0] == 0
    lines.insert(lines.index("## Section 2: FR-AB-002"), "Inserted paragraph.")
    f.write_text("\n".join(lines) + "\n")
    assert run("check", str(f))[0] == 1
    run("toc", str(f))
    assert run("check", str(f))[0] == 0
    run("toc", str(f))
    assert f.read_text().count(shard_tool.TOC_START) == 1
    _, out = run("outline", str(f))
    assert out["existing_contents"]["made_by"] == "shard-pro"
    assert all(h["text"] != "Contents" for h in out["headings"])


def test_build_again_with_a_new_plan_replaces_old_shards(built):
    plan = json.loads((built / ".shards.json").read_text())
    shards = plan["groups"][0]["shards"]
    merged = dict(shards[0], file="merged.md", title="Merged", end=shards[1]["end"])
    plan["groups"][0]["shards"] = [merged] + shards[2:]
    plan["source"] = "sample.md"
    (built.parent / "plan2.json").write_text(json.dumps(plan))
    code, out = run("build", str(built.parent / "plan2.json"))
    assert code == 0, out
    assert not (built / "part-1.md").exists() and (built / "merged.md").exists()
    code, out = run("check", str(built), "--rebuild")
    assert code == 0, out


def test_identifier_in_a_title_is_not_a_definition(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("## FR-X-001 Thing\n\ntext\n\n## Other\n\nmore\n")
    shards = [
        {"file": "a.md", "title": "About FR-X-001", "summary": "a", "start": 1, "end": 4},
        {"file": "b.md", "title": "FR-X-001 again", "summary": "b", "start": 5, "end": 7},
    ]
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "d"),
        "title": "D",
        "kind": "faithful",
        "lookup": r"FR-X-\d+",
        "groups": [{"heading": "G", "shards": shards}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan))
    code, out = run("build", str(tmp_path / "p.json"))
    assert out["lookup"] == {"identifiers": 1, "in_several_shards": []}


def test_outline_cuts_text_without_headings_by_size(tmp_path):
    src = tmp_path / "t.txt"
    src.write_text("".join(f"[00:{i // 60:02d}:{i % 60:02d}] Ana: {'word ' * 30}\n" for i in range(600)))
    _, out = run("outline", str(src))
    cut = out["proposed_cut"]
    assert len(cut) > 5 and all(c["chars"] <= shard_tool.MAX_CHARS for c in cut)
    assert cut[1]["heading"].startswith("[00:")


def test_check_accepts_a_relative_path(built, monkeypatch):
    monkeypatch.chdir(built)
    code, out = run("check", ".")
    assert code == 0, out


def test_uncited_statements_fail(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("hosting costs 400 a month\nother\n")
    shards = [
        {"file": "x.md", "title": "X", "summary": "x", "sources": ["L1-2"]},
        {"file": "d.md", "title": "D", "summary": "d", "derived": True},
    ]
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "doc"),
        "title": "Doc",
        "kind": "rewrite",
        "groups": [{"heading": "G", "shards": shards}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan))
    run("build", str(tmp_path / "p.json"))
    folder = tmp_path / "doc"
    (folder / "x.md").write_text(
        "# X\n\nPart of [Doc](./doc.md).\n\nHosting costs 400 a month (L1).\n\nThe team will cancel in May.\n\n| item | cost |\n|---|---|\n| hosting | 400 (L1) |\n| other | 900 |\n\n- one (L2)\n- two\n"
    )
    (folder / "d.md").write_text("# D\n\n- Hosting is 400 ([X](./x.md)).\n\nNo link here.\n")
    _, out = run("check", str(folder))
    got = sorted((f["file"], f["line"]) for f in out["failures"] if f["check"] == "uncited")
    assert got == [("d.md", 5), ("x.md", 7), ("x.md", 12)]


def test_build_refuses_a_cut_inside_a_table_or_steps(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("# T\n\n| a | b |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n\n1. one\n2. two\n3. three\n")
    for cut in (5, 9):
        plan = faithful_plan(tmp_path, src, 10, [cut])
        code, out = run("build", str(plan))
        assert code == 2 and "inside the" in out["error"]


def test_bad_lookup_pattern_fails_before_anything_moves(tmp_path):
    src = tmp_path / "s.md"
    src.write_text(doc())
    n = len(src.read_text().splitlines())
    code, out = run("build", str(faithful_plan(tmp_path, src, n, [40], {"lookup": "FR-(["})))
    assert code == 2 and "lookup pattern" in out["error"] and src.exists()


def test_toc_rejects_a_bad_plan_and_adds_a_section(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n\n## B\n\ntext b\n\n## C\n\ntext c\n")
    bad = {"groups": [{"heading": "G", "shards": [{"start": 11, "title": "C"}, {"start": 3, "title": "A"}]}]}
    (tmp_path / "bad.json").write_text(json.dumps(bad))
    code, out = run("toc", str(f), "--plan", str(tmp_path / "bad.json"))
    assert code == 2 and "must rise" in out["error"]
    good = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}, {"start": 11, "title": "C"}]}]}
    (tmp_path / "good.json").write_text(json.dumps(good))
    assert run("toc", str(f), "--plan", str(tmp_path / "good.json"))[0] == 0
    now = f.read_text().splitlines().index("## B") + 1
    code, out = run("toc", str(f), "--add", str(now), "--title", "B")
    assert code == 0 and out["entries"] == 3
    lines = f.read_text().splitlines()
    entry = next(x for x in lines if x.endswith(" B"))
    assert lines[int(entry.split()[1][1:].split("-")[0]) - 1] == "## B"
    assert run("check", str(f))[0] == 0
    _, outline = run("outline", str(f))
    assert outline["existing_contents"]["made_by"] == "shard-pro"


def test_oversized_shard_warns(built):
    (built / "part-2.md").write_text("# Part 2\n\n" + "x" * (shard_tool.MAX_CHARS + 10) + "\n")
    _, out = run("check", str(built))
    assert any(w["check"] == "size" and w["file"] == "part-2.md" for w in out["warnings"])


def test_user_updates_cite_the_update(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("hosting costs 400 a month\n")
    shards = [{"file": "x.md", "title": "X", "summary": "x", "sources": ["L1"]}]
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "doc"),
        "title": "Doc",
        "kind": "rewrite",
        "groups": [{"heading": "G", "shards": shards}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan))
    run("build", str(tmp_path / "p.json"))
    (tmp_path / "doc" / "x.md").write_text(
        "# X\n\nHosting costs 400 a month (L1).\n\nHosting rises to 450 in May (updated 2026-11-02).\n"
    )
    code, out = run("check", str(tmp_path / "doc"))
    assert code == 0 and not out["warnings"], out


def test_toc_plan_counts_lines_as_the_file_reads_now(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n\n## B\n\ntext b\n")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}, {"start": 7, "title": "B"}]}]}
    (tmp_path / "p.json").write_text(json.dumps(plan))
    run("toc", str(f), "--plan", str(tmp_path / "p.json"))
    _, out = run("outline", str(f))
    starts = [h["line"] for h in out["headings"] if h["level"] == 2]
    plan = {
        "groups": [
            {"heading": "G", "shards": [{"start": starts[0], "title": "A2"}, {"start": starts[1], "title": "B2"}]}
        ]
    }
    (tmp_path / "p2.json").write_text(json.dumps(plan))
    assert run("toc", str(f), "--plan", str(tmp_path / "p2.json"))[0] == 0
    lines = f.read_text().splitlines()
    entry = next(x for x in lines if x.endswith(" B2"))
    assert lines[int(entry.split()[1][1:].split("-")[0]) - 1] == "## B"
    assert run("check", str(f))[0] == 0


def test_toc_reports_a_renamed_section_and_keeps_the_rest(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n\n## B\n\ntext b\n")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}, {"start": 7, "title": "B"}]}]}
    (tmp_path / "p.json").write_text(json.dumps(plan))
    run("toc", str(f), "--plan", str(tmp_path / "p.json"))
    f.write_text(f.read_text().replace("## B", "## B renamed"))
    code, out = run("toc", str(f))
    assert code == 1 and out["lost"][0]["title"] == "B" and out["entries"] == 1
    now = f.read_text().splitlines().index("## B renamed") + 1
    assert run("toc", str(f), "--add", str(now), "--title", "B")[0] == 0
    assert run("check", str(f))[0] == 0


def test_check_toc_catches_a_stale_last_range(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}]}]}
    (tmp_path / "p.json").write_text(json.dumps(plan))
    run("toc", str(f), "--plan", str(tmp_path / "p.json"))
    f.write_text(f.read_text() + "more\nlines\n")
    code, out = run("check", str(f))
    assert code == 1 and "end of the file" in out["failures"][0]["text"]


def test_build_refuses_a_file_with_a_contents_list_until_removed(tmp_path):
    src = tmp_path / "s.md"
    src.write_text(doc())
    lines = src.read_text().splitlines()
    heads = [i for i, x in enumerate(lines, 1) if x.startswith("## ")]
    toc = {"groups": [{"heading": "G", "shards": [{"start": h, "title": f"T{h}"} for h in heads]}]}
    (tmp_path / "toc.json").write_text(json.dumps(toc))
    run("toc", str(src), "--plan", str(tmp_path / "toc.json"))
    code, out = run("build", str(faithful_plan(tmp_path, src, len(lines), heads[1:2])))
    assert code == 2 and "--remove" in out["error"]
    assert run("toc", str(src), "--remove")[0] == 0
    assert src.read_text() == doc() and not (tmp_path / ".s.contents.json").exists()
    assert run("build", str(faithful_plan(tmp_path, src, len(lines), heads[1:2])))[0] == 0


def test_loose_numbered_list_is_not_cut(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("# T\n\n1. one\n\n2. two\n\n3. three\n")
    code, out = run("build", str(faithful_plan(tmp_path, src, 7, [7])))
    assert code == 2 and "steps" in out["error"]


def test_label_before_a_cited_list_passes(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("price 27\nprice 29\n")
    shards = [{"file": "x.md", "title": "X", "summary": "x", "sources": ["L1-2"]}]
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "doc"),
        "title": "Doc",
        "kind": "rewrite",
        "groups": [{"heading": "G", "shards": shards}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan))
    run("build", str(tmp_path / "p.json"))
    (tmp_path / "doc" / "x.md").write_text(
        "# X\n\n**Conflict:**\n- 27 (L1)\n- 29 (L2)\n\nThe board decided:\n- 27 (L1)\n"
    )
    code, out = run("check", str(tmp_path / "doc"))
    assert code == 0, out


def test_plan_missing_a_group_heading_fails_before_writing(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("a\nb\n")
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "d"),
        "title": "D",
        "kind": "faithful",
        "groups": [{"shards": [{"file": "a.md", "title": "A", "summary": "a", "start": 1, "end": 2}]}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan))
    code, out = run("build", str(tmp_path / "p.json"))
    assert code == 2 and "heading" in out["error"] and not (tmp_path / "d").exists()
