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
import yaml

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


def front(path: Path) -> dict:
    lines = path.read_text(encoding="utf-8").splitlines()
    return yaml.safe_load("\n".join(lines[1 : shard_tool.frontmatter_end(lines) - 1]))


def shard(title: str, summary: str, body: str, group: str = "All") -> str:
    """A shard as an agent would write one by hand."""
    return f"---\npart_of: ./doc-sample.md\ntitle: {title}\nsummary: {summary}\ngroup: {group}\n---\n\n{body}\n"


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
        "groups": [{"heading": "All", "shards": shards}],
    }
    plan |= extra or {}
    path = tmp / "plan.json"
    path.write_text(json.dumps(plan), encoding="utf-8")
    return path


@pytest.fixture
def built(tmp_path):
    src = tmp_path / "sample.md"
    src.write_text(doc(), encoding="utf-8")
    lines = src.read_text(encoding="utf-8").splitlines()
    heads = [i for i, x in enumerate(lines, 1) if x.startswith("## Section")]
    plan = faithful_plan(tmp_path, src, len(lines), heads[1:4], {"lookup": r"FR-AB-\d+"})
    code, out = run("build", str(plan))
    assert code == 0, out
    return tmp_path / "doc-sample"


def test_outline_cut_respects_blocks_and_sizes(tmp_path):
    src = tmp_path / "big.md"
    src.write_text(doc(sections=12, para=120), encoding="utf-8")
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
    src.write_text("# Manual\n\n## 1\n\n### 1-1\n\ntext\n\n### C-2\n\ntext\n", encoding="utf-8")
    _, out = run("outline", str(src))
    assert out["bare_heading_share"] == 1.0


def test_build_moves_source_and_rebuilds_exactly(built):
    assert not (built.parent / "sample.md").exists()
    assert (built / ".source" / "sample.md").exists()
    main = (built / "doc-sample.md").read_text(encoding="utf-8")
    assert shard_tool.NOTE_MARK in main and "](./part-3.md)" in main and "identifier-lookup.md" in main
    code, out = run("check", str(built), "--rebuild")
    assert code == 0, out


def test_build_rejects_gaps(tmp_path):
    src = tmp_path / "s.md"
    src.write_text(doc(), encoding="utf-8")
    plan = json.loads(faithful_plan(tmp_path, src, 10, [40]).read_text(encoding="utf-8"))
    plan["groups"][0]["shards"][1]["start"] = 45
    (tmp_path / "plan.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(tmp_path / "plan.json"))
    assert code == 2 and "gap or overlap" in out["error"]


def test_build_keeps_frontmatter_in_main(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("---\nstatus: draft\ntype: prd\n---\n" + doc(), encoding="utf-8")
    n = len(src.read_text(encoding="utf-8").splitlines())
    run("build", str(faithful_plan(tmp_path, src, n, [60])))
    folder = tmp_path / "doc-sample"
    assert (
        (folder / "doc-sample.md")
        .read_text(encoding="utf-8")
        .startswith("---\nstatus: draft\ntype: prd\n---\n# Sample")
    )
    assert not (folder / "part-1.md").read_text(encoding="utf-8").count("type: prd")
    code, out = run("check", str(folder), "--rebuild")
    assert code == 0, out


def test_long_map_splits_into_sub_maps(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("\n".join(f"line {i}" for i in range(1, 501)) + "\n", encoding="utf-8")
    shards = [
        {"file": f"s{i}.md", "title": f"S{i}", "summary": "x", "start": i * 2 + 1, "end": i * 2 + 2} for i in range(250)
    ]
    groups = [{"heading": f"Group {g}", "shards": shards[g * 50 : (g + 1) * 50]} for g in range(5)]
    plan = {"source": str(src), "folder": str(tmp_path / "big"), "title": "Big", "groups": groups}
    (tmp_path / "p.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(tmp_path / "p.json"))
    assert code == 0 and len(out["sub_maps"]) == 5
    assert len((tmp_path / "big" / "big.md").read_text(encoding="utf-8").splitlines()) <= shard_tool.WINDOW
    code, out = run("check", str(tmp_path / "big"), "--rebuild")
    assert code == 0, out


def test_check_catches_broken_links_orphans_names_and_edits(built):
    (built / "part-2.md").write_text(
        (built / "part-2.md").read_text(encoding="utf-8") + "\nSee [gone](./gone.md).\n", encoding="utf-8"
    )
    main = built / "doc-sample.md"
    main.write_text(
        "".join(x for x in main.read_text(encoding="utf-8").splitlines(keepends=True) if "](./part-4.md)" not in x),
        encoding="utf-8",
    )
    code, out = run("check", str(built), "--rebuild")
    kinds = {f["check"] for f in out["failures"]}
    assert code == 1 and {"link", "orphan", "rebuild"} <= kinds
    plan = json.loads((built / ".shards.json").read_text(encoding="utf-8"))
    plan["groups"][0]["shards"][0]["file"] = "doc-intro.md"
    (built / "part-1.md").rename(built / "doc-intro.md")
    (built / ".shards.json").write_text(json.dumps(plan), encoding="utf-8")
    _, out = run("check", str(built))
    assert any(f["check"] == "name" for f in out["failures"])


def test_shards_carry_frontmatter_that_names_the_main_file(tmp_path):
    src = tmp_path / "sample.md"
    src.write_text(doc(), encoding="utf-8")
    plan = json.loads(faithful_plan(tmp_path, src, len(doc().splitlines()), [60]).read_text(encoding="utf-8"))
    plan["groups"][0]["shards"][0]["related"] = ["part-2.md"]
    (tmp_path / "plan.json").write_text(json.dumps(plan), encoding="utf-8")
    assert run("build", str(tmp_path / "plan.json"))[0] == 0
    folder = tmp_path / "doc-sample"
    assert front(folder / "part-1.md") == {
        "part_of": "./doc-sample.md",
        "title": "Part 1",
        "summary": "Lines 1 to 59",
        "group": "All",
        "related": ["./part-2.md"],
    }
    assert "related" not in front(folder / "part-2.md")


def test_related_must_name_a_shard_in_the_plan(tmp_path):
    src = tmp_path / "sample.md"
    src.write_text(doc(), encoding="utf-8")
    plan = json.loads(faithful_plan(tmp_path, src, len(doc().splitlines()), [60]).read_text(encoding="utf-8"))
    plan["groups"][0]["shards"][0]["related"] = ["nowhere.md"]
    (tmp_path / "plan.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(tmp_path / "plan.json"))
    assert code == 2 and "nowhere.md" in out["error"] and src.exists()


def test_a_shard_added_by_hand_is_found_by_check_map_and_lookup(built):
    (built / "extra.md").write_text(shard("Extra", "Added later", "## FR-AB-099 New\n\nNew content."), encoding="utf-8")
    _, out = run("check", str(built))
    assert any(f["check"] == "orphan" and f["file"] == "extra.md" for f in out["failures"])
    code, out = run("map", str(built))
    assert code == 0 and out["added"] == ["extra.md"]
    assert "- [Extra](./extra.md) — Added later" in (built / "doc-sample.md").read_text(encoding="utf-8")
    run("lookup", str(built))
    assert "| FR-AB-099 | [extra](./extra.md) |" in (built / "identifier-lookup.md").read_text(encoding="utf-8")
    code, out = run("check", str(built))
    assert code == 0, out


def test_map_keeps_the_maps_order_and_drops_lines_for_deleted_shards(built):
    main = built / "doc-sample.md"
    lines = main.read_text(encoding="utf-8").splitlines()
    two = next(i for i, x in enumerate(lines) if "](./part-2.md)" in x)
    lines[two], lines[two + 1] = lines[two + 1], lines[two]
    main.write_text("\n".join(lines).replace("# Sample", "# Sample, renamed", 1) + "\n", encoding="utf-8")
    (built / "part-4.md").unlink()
    code, out = run("map", str(built))
    assert code == 0 and out["dropped"] == ["part-4.md"]
    text = main.read_text(encoding="utf-8")
    assert text.index("](./part-3.md)") < text.index("](./part-2.md)") and "part-4.md" not in text
    assert "# Sample, renamed" in text


def test_a_summary_edited_in_frontmatter_is_flagged_until_the_map_matches(built):
    p = built / "part-2.md"
    p.write_text(
        p.read_text(encoding="utf-8").replace("summary: Lines", "summary: Now covers lines", 1), encoding="utf-8"
    )
    code, out = run("check", str(built), "--rebuild")
    assert code == 1 and any(f["check"] == "map" and f["file"] == "part-2.md" for f in out["failures"])
    run("map", str(built))
    assert "— Now covers lines" in (built / "doc-sample.md").read_text(encoding="utf-8")
    code, out = run("check", str(built))
    assert code == 0, out


def test_check_needs_no_build_record_except_to_rebuild(built):
    (built / ".shards.json").unlink()
    code, out = run("check", str(built))
    assert code == 0, out
    code, out = run("check", str(built), "--rebuild")
    assert code == 1 and out["failures"][0]["check"] == "manifest"
    assert run("map", str(built))[0] == 0


def test_check_rejects_frontmatter_that_does_not_parse(built):
    (built / "bad.md").write_text("---\npart_of: [unclosed\n---\n\ntext\n", encoding="utf-8")
    code, out = run("check", str(built))
    assert code == 1 and any(f["check"] == "frontmatter" and f["file"] == "bad.md" for f in out["failures"])
    code, out = run("map", str(built))
    assert code == 1 and [u["file"] for u in out["unparsed"]] == ["bad.md"]


def test_map_keeps_the_line_of_a_shard_whose_frontmatter_breaks_and_maps_the_rest(built):
    p = built / "part-2.md"
    p.write_text(p.read_text(encoding="utf-8").replace("title: Part 2", "title: Part 2: broken", 1), encoding="utf-8")
    (built / "extra.md").write_text(shard("Extra", "Added later", "text"), encoding="utf-8")
    code, out = run("map", str(built))
    main = (built / "doc-sample.md").read_text(encoding="utf-8")
    assert code == 1 and out["added"] == ["extra.md"] and out["dropped"] == []
    assert "](./part-2.md)" in main and "](./extra.md)" in main


def test_lookup_lists_each_identifier_home(built):
    text = (built / "identifier-lookup.md").read_text(encoding="utf-8")
    assert "| FR-AB-001 | [part-1](./part-1.md) |" in text


def test_toc_insert_check_and_refresh(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text(doc(), encoding="utf-8")
    _, outline = run("outline", str(f))
    starts = [h["line"] for h in outline["headings"] if h["level"] == 2]
    plan = {
        "groups": [{"heading": "All", "shards": [{"start": s, "title": f"Title {k}"} for k, s in enumerate(starts, 1)]}]
    }
    (tmp_path / "toc.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("toc", str(f), "--plan", str(tmp_path / "toc.json"))
    assert code == 0 and out["fits_window"]
    lines = f.read_text(encoding="utf-8").splitlines()
    entry = next(x for x in lines if x.endswith(" Title 3"))
    start = int(entry.split()[1][1:].split("-")[0])
    assert lines[start - 1] == "## Section 3: FR-AB-003"
    assert run("check", str(f))[0] == 0
    lines.insert(lines.index("## Section 2: FR-AB-002"), "Inserted paragraph.")
    f.write_text("\n".join(lines) + "\n", encoding="utf-8")
    assert run("check", str(f))[0] == 1
    run("toc", str(f))
    assert run("check", str(f))[0] == 0
    run("toc", str(f))
    assert f.read_text(encoding="utf-8").count(shard_tool.TOC_START) == 1
    _, out = run("outline", str(f))
    assert out["existing_contents"]["made_by"] == "shard-pro"
    assert all(h["text"] != "Contents" for h in out["headings"])


def test_build_again_with_a_new_plan_replaces_old_shards(built):
    plan = json.loads((built / ".shards.json").read_text(encoding="utf-8"))
    shards = plan["groups"][0]["shards"]
    merged = dict(shards[0], file="merged.md", title="Merged", end=shards[1]["end"])
    plan["groups"][0]["shards"] = [merged] + shards[2:]
    plan["source"] = "sample.md"
    (built.parent / "plan2.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(built.parent / "plan2.json"))
    assert code == 0, out
    assert not (built / "part-1.md").exists() and (built / "merged.md").exists()
    code, out = run("check", str(built), "--rebuild")
    assert code == 0, out


def rebuild_plan(built: Path) -> Path:
    plan = json.loads((built / ".shards.json").read_text(encoding="utf-8"))
    plan["source"] = "sample.md"
    path = built.parent / "again.json"
    path.write_text(json.dumps(plan), encoding="utf-8")
    return path


@pytest.mark.parametrize(
    "edit",
    [
        lambda d: (d / "part-2.md").write_text(
            (d / "part-2.md").read_text(encoding="utf-8") + "New text.\n", encoding="utf-8"
        ),
        lambda d: (d / "part-2.md").write_text(
            (d / "part-2.md").read_text(encoding="utf-8").replace("summary: Lines", "summary: Now"), encoding="utf-8"
        ),
        lambda d: (d / "extra.md").write_text(shard("Extra", "Added later", "text"), encoding="utf-8"),
        lambda d: (d / "part-2.md").write_text(
            (d / "part-2.md").read_text(encoding="utf-8").replace("title: Part 2", "title: Part 2: broken"),
            encoding="utf-8",
        ),
    ],
    ids=["body", "frontmatter", "new-shard", "frontmatter-that-does-not-parse"],
)
def test_build_refuses_to_discard_edits_made_since_build(built, edit):
    edit(built)
    before = {p.name: p.read_text(encoding="utf-8") for p in built.glob("*.md")}
    code, out = run("build", str(rebuild_plan(built)))
    assert code == 2 and "--force" in out["error"]
    assert {p.name: p.read_text(encoding="utf-8") for p in built.glob("*.md")} == before
    assert run("build", str(rebuild_plan(built)), "--force")[0] == 0


def test_a_link_broken_many_times_is_one_warning(tmp_path):
    src = tmp_path / "sample.md"
    text = doc().replace("Line 1.", "See [the end](#section-6-fr-ab-006). Line 1.")
    src.write_text(text, encoding="utf-8")
    lines = text.splitlines()
    heads = [i for i, x in enumerate(lines, 1) if x.startswith("## Section")]
    assert run("build", str(faithful_plan(tmp_path, src, len(lines), heads[1:])))[0] == 0
    _, out = run("check", str(tmp_path / "doc-sample"))
    links = [w for w in out["warnings"] if w["check"] == "link"]
    assert len(links) == 1 and "(40 times)" in links[0]["text"]


def test_check_all_finds_every_prepared_document_under_a_folder(built, tmp_path):
    f = tmp_path / "notes" / "doc.md"
    f.parent.mkdir()
    f.write_text("# Doc\n\n## A\n\ntext a\n", encoding="utf-8")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}]}]}
    (tmp_path / "toc.json").write_text(json.dumps(plan), encoding="utf-8")
    run("toc", str(f), "--plan", str(tmp_path / "toc.json"))
    code, out = run("check", str(tmp_path), "--all")
    assert code == 0 and out["checked"] == ["doc-sample", "notes/doc.md"], out
    (built / "extra.md").write_text(shard("Extra", "Added later", "text"), encoding="utf-8")
    code, out = run("check", str(tmp_path), "--all")
    assert code == 1 and {(x["target"], x["check"]) for x in out["failures"]} == {("doc-sample", "orphan")}


def test_identifier_in_a_title_is_not_a_definition(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("## FR-X-001 Thing\n\ntext\n\n## Other\n\nmore\n", encoding="utf-8")
    shards = [
        {"file": "a.md", "title": "About FR-X-001", "summary": "a", "start": 1, "end": 4},
        {"file": "b.md", "title": "FR-X-001 again", "summary": "b", "start": 5, "end": 7},
    ]
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "d"),
        "title": "D",
        "lookup": r"FR-X-\d+",
        "groups": [{"heading": "G", "shards": shards}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(tmp_path / "p.json"))
    assert out["lookup"] == {"identifiers": 1, "in_several_shards": []}


def test_outline_cuts_text_without_headings_by_size(tmp_path):
    src = tmp_path / "t.txt"
    src.write_text(
        "".join(f"[00:{i // 60:02d}:{i % 60:02d}] Ana: {'word ' * 30}\n" for i in range(600)), encoding="utf-8"
    )
    _, out = run("outline", str(src))
    cut = out["proposed_cut"]
    assert len(cut) > 5 and all(c["chars"] <= shard_tool.MAX_CHARS for c in cut)
    assert cut[1]["heading"].startswith("[00:")


def test_check_accepts_a_relative_path(built, monkeypatch):
    monkeypatch.chdir(built)
    code, out = run("check", ".")
    assert code == 0, out


def test_build_refuses_a_cut_inside_a_table_or_steps(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("# T\n\n| a | b |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |\n\n1. one\n2. two\n3. three\n", encoding="utf-8")
    for cut in (5, 9):
        plan = faithful_plan(tmp_path, src, 10, [cut])
        code, out = run("build", str(plan))
        assert code == 2 and "inside the" in out["error"]


def test_bad_lookup_pattern_fails_before_anything_moves(tmp_path):
    src = tmp_path / "s.md"
    src.write_text(doc(), encoding="utf-8")
    n = len(src.read_text(encoding="utf-8").splitlines())
    code, out = run("build", str(faithful_plan(tmp_path, src, n, [40], {"lookup": "FR-(["})))
    assert code == 2 and "lookup pattern" in out["error"] and src.exists()


def test_toc_rejects_a_bad_plan_and_adds_a_section(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n\n## B\n\ntext b\n\n## C\n\ntext c\n", encoding="utf-8")
    bad = {"groups": [{"heading": "G", "shards": [{"start": 11, "title": "C"}, {"start": 3, "title": "A"}]}]}
    (tmp_path / "bad.json").write_text(json.dumps(bad), encoding="utf-8")
    code, out = run("toc", str(f), "--plan", str(tmp_path / "bad.json"))
    assert code == 2 and "must rise" in out["error"]
    good = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}, {"start": 11, "title": "C"}]}]}
    (tmp_path / "good.json").write_text(json.dumps(good), encoding="utf-8")
    assert run("toc", str(f), "--plan", str(tmp_path / "good.json"))[0] == 0
    now = f.read_text(encoding="utf-8").splitlines().index("## B") + 1
    code, out = run("toc", str(f), "--add", str(now), "--title", "B")
    assert code == 0 and out["entries"] == 3
    lines = f.read_text(encoding="utf-8").splitlines()
    entry = next(x for x in lines if x.endswith(" B"))
    assert lines[int(entry.split()[1][1:].split("-")[0]) - 1] == "## B"
    assert run("check", str(f))[0] == 0
    _, outline = run("outline", str(f))
    assert outline["existing_contents"]["made_by"] == "shard-pro"


def test_oversized_shard_warns(built):
    (built / "part-2.md").write_text(shard("Part 2", "Big", "x" * (shard_tool.MAX_CHARS + 10)), encoding="utf-8")
    _, out = run("check", str(built))
    assert any(w["check"] == "size" and w["file"] == "part-2.md" for w in out["warnings"])


def test_toc_plan_counts_lines_as_the_file_reads_now(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n\n## B\n\ntext b\n", encoding="utf-8")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}, {"start": 7, "title": "B"}]}]}
    (tmp_path / "p.json").write_text(json.dumps(plan), encoding="utf-8")
    run("toc", str(f), "--plan", str(tmp_path / "p.json"))
    _, out = run("outline", str(f))
    starts = [h["line"] for h in out["headings"] if h["level"] == 2]
    plan = {
        "groups": [
            {"heading": "G", "shards": [{"start": starts[0], "title": "A2"}, {"start": starts[1], "title": "B2"}]}
        ]
    }
    (tmp_path / "p2.json").write_text(json.dumps(plan), encoding="utf-8")
    assert run("toc", str(f), "--plan", str(tmp_path / "p2.json"))[0] == 0
    lines = f.read_text(encoding="utf-8").splitlines()
    entry = next(x for x in lines if x.endswith(" B2"))
    assert lines[int(entry.split()[1][1:].split("-")[0]) - 1] == "## B"
    assert run("check", str(f))[0] == 0


def test_toc_reports_a_renamed_section_and_keeps_the_rest(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n\n## B\n\ntext b\n", encoding="utf-8")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}, {"start": 7, "title": "B"}]}]}
    (tmp_path / "p.json").write_text(json.dumps(plan), encoding="utf-8")
    run("toc", str(f), "--plan", str(tmp_path / "p.json"))
    f.write_text(f.read_text(encoding="utf-8").replace("## B", "## B renamed"), encoding="utf-8")
    code, out = run("toc", str(f))
    assert code == 1 and out["lost"][0]["title"] == "B" and out["entries"] == 1
    now = f.read_text(encoding="utf-8").splitlines().index("## B renamed") + 1
    assert run("toc", str(f), "--add", str(now), "--title", "B")[0] == 0
    assert run("check", str(f))[0] == 0


def test_check_toc_catches_a_stale_last_range(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n", encoding="utf-8")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}]}]}
    (tmp_path / "p.json").write_text(json.dumps(plan), encoding="utf-8")
    run("toc", str(f), "--plan", str(tmp_path / "p.json"))
    f.write_text(f.read_text(encoding="utf-8") + "more\nlines\n", encoding="utf-8")
    code, out = run("check", str(f))
    assert code == 1 and "end of the file" in out["failures"][0]["text"]


def test_build_refuses_a_file_with_a_contents_list_until_removed(tmp_path):
    src = tmp_path / "s.md"
    src.write_text(doc(), encoding="utf-8")
    lines = src.read_text(encoding="utf-8").splitlines()
    heads = [i for i, x in enumerate(lines, 1) if x.startswith("## ")]
    toc = {"groups": [{"heading": "G", "shards": [{"start": h, "title": f"T{h}"} for h in heads]}]}
    (tmp_path / "toc.json").write_text(json.dumps(toc), encoding="utf-8")
    run("toc", str(src), "--plan", str(tmp_path / "toc.json"))
    code, out = run("build", str(faithful_plan(tmp_path, src, len(lines), heads[1:2])))
    assert code == 2 and "--remove" in out["error"]
    assert run("toc", str(src), "--remove")[0] == 0
    assert src.read_text(encoding="utf-8") == doc() and not (tmp_path / ".s.contents.json").exists()
    assert run("build", str(faithful_plan(tmp_path, src, len(lines), heads[1:2])))[0] == 0


def test_loose_numbered_list_is_not_cut(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("# T\n\n1. one\n\n2. two\n\n3. three\n", encoding="utf-8")
    code, out = run("build", str(faithful_plan(tmp_path, src, 7, [7])))
    assert code == 2 and "steps" in out["error"]


def test_plan_missing_a_group_heading_fails_before_writing(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("a\nb\n", encoding="utf-8")
    plan = {
        "source": str(src),
        "folder": str(tmp_path / "d"),
        "title": "D",
        "groups": [{"shards": [{"file": "a.md", "title": "A", "summary": "a", "start": 1, "end": 2}]}],
    }
    (tmp_path / "p.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(tmp_path / "p.json"))
    assert code == 2 and "heading" in out["error"] and not (tmp_path / "d").exists()


def test_rebuild_in_place_reads_the_frozen_copy_not_the_map(tmp_path):
    folder = tmp_path / "doc-sample"
    folder.mkdir()
    src = folder / "doc-sample.md"
    src.write_text(doc(), encoding="utf-8")
    n = len(src.read_text(encoding="utf-8").splitlines())
    plan = faithful_plan(tmp_path, src, n, [60])
    assert run("build", str(plan))[0] == 0
    code, out = run("build", str(plan))
    assert code == 0, out
    assert run("check", str(folder), "--rebuild")[0] == 0


def test_build_never_overwrites_a_file_it_did_not_write(tmp_path):
    folder = tmp_path / "doc-sample"
    folder.mkdir()
    (folder / "part-2.md").write_text("someone else's notes\n", encoding="utf-8")
    src = tmp_path / "sample.md"
    src.write_text(doc(), encoding="utf-8")
    code, out = run("build", str(faithful_plan(tmp_path, src, len(doc().splitlines()), [60])))
    assert code == 2 and "part-2.md already exists" in out["error"]
    assert (folder / "part-2.md").read_text(encoding="utf-8") == "someone else's notes\n" and src.exists()


def test_a_shard_cannot_take_a_name_build_writes_itself(tmp_path):
    src = tmp_path / "sample.md"
    src.write_text(doc(), encoding="utf-8")
    plan = json.loads(
        faithful_plan(tmp_path, src, len(doc().splitlines()), [60], {"lookup": "FR"}).read_text(encoding="utf-8")
    )
    plan["groups"][0]["shards"][1]["file"] = "identifier-lookup.md"
    (tmp_path / "plan.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(tmp_path / "plan.json"))
    assert code == 2 and "collide" in out["error"]


def test_plan_must_start_at_the_top_and_hold_shards(tmp_path):
    src = tmp_path / "s.md"
    src.write_text(doc(), encoding="utf-8")
    n = len(doc().splitlines())
    plan = json.loads(faithful_plan(tmp_path, src, n, [60]).read_text(encoding="utf-8"))
    plan["groups"][0]["shards"] = plan["groups"][0]["shards"][1:]
    (tmp_path / "plan.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(tmp_path / "plan.json"))
    assert code == 2 and "first shard starts at line 1" in out["error"]
    plan["groups"][0]["shards"] = []
    (tmp_path / "plan.json").write_text(json.dumps(plan), encoding="utf-8")
    code, out = run("build", str(tmp_path / "plan.json"))
    assert code == 2 and "no shards" in out["error"]


def test_a_group_too_big_for_one_map_page_is_refused(tmp_path):
    src = tmp_path / "s.md"
    src.write_text("\n".join(f"line {i}" for i in range(1, 301)) + "\n", encoding="utf-8")
    plan = faithful_plan(tmp_path, src, 300, list(range(2, 201)))
    code, out = run("build", str(plan))
    assert code == 2 and "map page holds" in out["error"]


def test_check_warns_about_links_the_split_moved(tmp_path):
    (tmp_path / "guide.md").write_text("# Guide\n", encoding="utf-8")
    src = tmp_path / "sample.md"
    text = doc().replace("Line 1.0 with", "See [guide](guide.md) and [the end](#section-6-fr-ab-006). Line 1.0 with")
    src.write_text(text, encoding="utf-8")
    lines = text.splitlines()
    heads = [i for i, x in enumerate(lines, 1) if x.startswith("## Section")]
    assert run("build", str(faithful_plan(tmp_path, src, len(lines), heads[1:])))[0] == 0
    code, out = run("check", str(tmp_path / "doc-sample"), "--rebuild")
    assert code == 0
    moved = [w["text"] for w in out["warnings"] if w["check"] == "link"]
    assert any("guide.md" in t for t in moved) and any("#section-6" in t for t in moved)


def test_toc_refresh_refuses_to_guess_between_two_matching_sections(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text(doc(), encoding="utf-8")
    _, outline = run("outline", str(f))
    starts = [h["line"] for h in outline["headings"] if h["level"] == 2]
    plan = {"groups": [{"heading": "All", "shards": [{"start": s, "title": f"T{k}"} for k, s in enumerate(starts)]}]}
    (tmp_path / "toc.json").write_text(json.dumps(plan), encoding="utf-8")
    run("toc", str(f), "--plan", str(tmp_path / "toc.json"))
    lines = f.read_text(encoding="utf-8").splitlines()
    lines.insert(lines.index("## Section 2: FR-AB-002"), "## Section 5: FR-AB-005")
    f.write_text("\n".join(lines) + "\n", encoding="utf-8")
    before = f.read_text(encoding="utf-8")
    code, out = run("toc", str(f))
    assert code == 1 and out["ambiguous"][0]["first_line"] == "## Section 5: FR-AB-005"
    assert f.read_text(encoding="utf-8") == before
    assert run("check", str(f))[0] == 1


def test_a_longer_fence_holds_a_shorter_one(tmp_path):
    lines = ["# T", "", "````markdown", "```", "## not a heading", "```", "````", "", "## Real"]
    spans = shard_tool.block_spans(lines)
    assert spans[0] == (3, 7, "markdown")
    heads = shard_tool.headings(lines, spans)
    assert [h["text"] for h in heads] == ["T", "Real"]


def test_toc_refresh_keeps_a_line_added_to_the_list_by_hand(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n\n## B\n\ntext b\n", encoding="utf-8")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}]}]}
    (tmp_path / "p.json").write_text(json.dumps(plan), encoding="utf-8")
    run("toc", str(f), "--plan", str(tmp_path / "p.json"))
    lines = f.read_text(encoding="utf-8").splitlines()
    b = lines.index("## B") + 1
    lines.insert(lines.index(shard_tool.TOC_END), f"- L{b} B")
    f.write_text("\n".join(lines) + "\n", encoding="utf-8")
    assert run("check", str(f))[0] == 1
    code, out = run("toc", str(f))
    assert code == 0 and out["added_from_list"] == ["B"] and out["entries"] == 2
    lines = f.read_text(encoding="utf-8").splitlines()
    entry = next(x for x in lines if x.endswith(" B"))
    assert lines[int(entry.split()[1][1:].split("-")[0]) - 1] == "## B"
    assert run("check", str(f))[0] == 0


def test_map_never_follows_a_map_page_link_out_of_the_folder(built):
    (built / "map-x").mkdir()
    outside = built.parent / "keep.md"
    outside.write_text("not part of the document\n", encoding="utf-8")
    main = built / "doc-sample.md"
    main.write_text(main.read_text(encoding="utf-8") + "- [X](./map-x/../../keep.md) — x\n", encoding="utf-8")
    run("map", str(built))
    assert outside.exists()


def test_check_fails_when_the_identifier_lookup_is_stale(built):
    assert run("check", str(built))[0] == 0
    p = built / "part-2.md"
    p.write_text(p.read_text(encoding="utf-8") + "\n## FR-AB-777 New\n", encoding="utf-8")
    code, out = run("check", str(built))
    assert code == 1 and any(f["check"] == "lookup" for f in out["failures"])
    run("lookup", str(built))
    assert run("check", str(built))[0] == 0


def test_check_all_checks_a_damaged_document_instead_of_skipping_it(built, tmp_path):
    main = built / "doc-sample.md"
    main.write_text(main.read_text(encoding="utf-8").replace(shard_tool.NOTE_MARK, ""), encoding="utf-8")
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## A\n\ntext a\n", encoding="utf-8")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 3, "title": "A"}]}]}
    (tmp_path / "toc.json").write_text(json.dumps(plan), encoding="utf-8")
    run("toc", str(f), "--plan", str(tmp_path / "toc.json"))
    shard_tool.sidecar(f).unlink()
    code, out = run("check", str(tmp_path), "--all")
    assert code == 1 and out["checked"] == ["doc-sample", "doc.md"]
    assert {x["target"] for x in out["failures"]} == {"doc-sample", "doc.md"}


def test_toc_refresh_keeps_a_hand_added_line_that_repeats_a_title(tmp_path):
    f = tmp_path / "doc.md"
    f.write_text("# Doc\n\n## Notes\n\nfirst\n\n## B\n\ntext b\n", encoding="utf-8")
    plan = {"groups": [{"heading": "G", "shards": [{"start": 7, "title": "Notes"}]}]}
    (tmp_path / "p.json").write_text(json.dumps(plan), encoding="utf-8")
    run("toc", str(f), "--plan", str(tmp_path / "p.json"))
    lines = f.read_text(encoding="utf-8").splitlines()
    first = lines.index("## Notes") + 2
    lines.insert(next(i for i, x in enumerate(lines) if x.startswith("- L")), f"- L{first} Notes")
    f.write_text("\n".join(lines) + "\n", encoding="utf-8")
    code, out = run("toc", str(f))
    assert code == 0 and out["entries"] == 2, out
    lines = f.read_text(encoding="utf-8").splitlines()
    starts = [int(x.split()[1][1:].split("-")[0]) for x in lines if x.startswith("- L")]
    assert [lines[a - 1] for a in starts] == ["## Notes", "## B"]
