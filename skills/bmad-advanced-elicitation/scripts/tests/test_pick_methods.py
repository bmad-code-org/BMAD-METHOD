# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for pick_methods.py.

Run from the repo root: uv run --frozen python -B -m pytest skills/bmad-advanced-elicitation/scripts/tests/
"""

import json
import random
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import pick_methods  # noqa: E402

CSV = """num,direction,method_name,description,form,tier
1,future,Pre-mortem Analysis,Assume it failed,Written from after the failure,core
2,missing,Assumption Audit,List and stress-test every assumption,A rated table then the weakest stress-tested,core
3,premise,First Principles Analysis,Rebuild from fundamental truths,Assumptions stripped then rebuilt,core
4,other-side,Socratic Questioning,Question until it cannot answer,A chain of questions,core
5,premise,SCAMPER Method,Seven creativity lenses,One line per lens,more
"""

EXTRA = [
    {
        "code": "reg-inversion",
        "category": "domain",
        "method_name": "Regulatory Inversion",
        "description": "Start from the compliance constraint",
        "output_pattern": "constraint → possibility",
    },
    {
        "code": "premortem-lite",
        "direction": "future",
        "method_name": "Pre-mortem Analysis",
        "description": "RETUNED pre-mortem",
        "form": "failure → prevention",
    },
]


@pytest.fixture
def lib(tmp_path):
    csv_path = tmp_path / "methods.csv"
    csv_path.write_text(CSV, encoding="utf-8")
    return csv_path


def rows(lib):
    return pick_methods.load(lib)


# --- load / normalize / merge ------------------------------------------------


def test_load_all_fields_present(lib):
    r = rows(lib)
    assert len(r) == 5
    assert r[0]["method_name"] == "Pre-mortem Analysis"
    assert all(set(pick_methods.FIELDS) <= set(row) for row in r)
    assert r[4]["tier"] == "more"


def test_old_columns_are_accepted():
    row = pick_methods.normalize(
        {"category": "risk", "method_name": "X", "description": "d", "output_pattern": "a → b", "bogus": "ignored"}
    )
    assert row["direction"] == "custom"  # an old category is not a direction
    assert row["form"] == "a → b"  # output_pattern stands in for form
    assert row["tier"] == "core"  # tier defaults to core
    assert "bogus" not in row


def test_unknown_direction_or_tier_is_an_error():
    with pytest.raises(ValueError, match="direction 'premsie'"):
        pick_methods.normalize({"direction": "premsie", "method_name": "X", "description": "d", "form": "f"})
    with pytest.raises(ValueError, match="tier 'x'"):
        pick_methods.normalize({"direction": "wrong", "method_name": "X", "description": "d", "form": "f", "tier": "x"})


def test_shipped_style_catalog_missing_a_field_is_rejected(tmp_path):
    bad = tmp_path / "bad.csv"
    bad.write_text("num,direction,method_name,description\n1,wrong,X,d\n", encoding="utf-8")
    with pytest.raises(ValueError, match="line 2 \\(X\\) is missing form"):
        pick_methods.load(bad)
    assert pick_methods.main(["--file", str(bad), "directions"]) == 2


def test_cli_empty_stdin_names_the_resolver(monkeypatch, capsys):
    import io

    monkeypatch.setattr(sys, "stdin", io.StringIO(""))
    assert pick_methods.main(["--customization", "-", "directions"]) == 2
    assert "resolver" in capsys.readouterr().err


def test_customization_object_binds_methods_file_and_extras(tmp_path, lib):
    spec = {"workflow": {"methods_file": str(lib), "additional_methods": EXTRA}}
    path, extras = pick_methods.load_customization(json.dumps(spec), tmp_path)
    assert path == lib and len(extras) == 2
    # {skill-root} is bound to the given root; an empty additional_methods is a no-op
    path, extras = pick_methods.load_customization(
        '{"methods_file": "{skill-root}/assets/m.csv", "additional_methods": []}', tmp_path
    )
    assert path == tmp_path / "assets" / "m.csv" and extras == []
    path, _ = pick_methods.load_customization(
        '{"methods_file": "{project-root}/_bmad/custom/m.csv"}', tmp_path, tmp_path / "p"
    )
    assert path == tmp_path / "p" / "_bmad" / "custom" / "m.csv"
    with pytest.raises(ValueError, match="project-root"):
        pick_methods.load_customization('{"methods_file": "{project-root}/m.csv"}', tmp_path)
    with pytest.raises(ValueError, match="code"):
        pick_methods.load_customization(
            '{"additional_methods": [{"method_name": "X", "description": "d", "form": "f"}]}', tmp_path
        )
    with pytest.raises(ValueError):
        pick_methods.load_customization("[1]", tmp_path)


def test_load_extra_json_literal_and_file(tmp_path, lib):
    literal = pick_methods.load_extra(json.dumps(EXTRA))
    f = tmp_path / "extra.json"
    f.write_text(json.dumps(EXTRA), encoding="utf-8")
    from_file = pick_methods.load_extra(str(f))
    assert literal == from_file
    assert literal[0]["method_name"] == "Regulatory Inversion"
    assert literal[0]["num"] == ""  # missing fields normalize to empty
    assert literal[0]["code"] == "reg-inversion"  # code survives loading


def test_merge_extra_replaces_by_name_and_appends(lib):
    merged = pick_methods.merge_extra(rows(lib), pick_methods.load_extra(json.dumps(EXTRA)))
    assert len(merged) == 6  # 5 shipped, 1 replaced in place, 1 appended
    premortem = next(r for r in merged if r["method_name"] == "Pre-mortem Analysis")
    assert premortem["description"] == "RETUNED pre-mortem"
    assert premortem["num"] == "1"  # replacement inherits the shipped num
    appended = next(r for r in merged if r["method_name"] == "Regulatory Inversion")
    assert appended["num"] == "6"  # appended extras get the next free num
    assert appended["direction"] == "custom"
    assert [d[0] for d in pick_methods.directions(merged)][-1] == "custom"  # custom is listed last


def test_extras_are_addressable_by_num(lib):
    merged = pick_methods.merge_extra(rows(lib), pick_methods.load_extra(json.dumps(EXTRA)))
    found, missing = pick_methods.find(merged, ["6", "1"])
    assert [r["method_name"] for r in found] == ["Regulatory Inversion", "Pre-mortem Analysis"]
    assert missing == []


# --- directions / filter / find / exclude ------------------------------------


def test_directions_in_presentation_order_with_counts(lib):
    got = pick_methods.directions(rows(lib))
    assert [d[0] for d in got] == ["missing", "premise", "future", "other-side"]
    assert got[1] == ("premise", "Challenge the premise", 1, 1)


def test_filter_direction_is_case_insensitive(lib):
    got = pick_methods.filter_rows(rows(lib), ["PREMISE"])
    assert {r["method_name"] for r in got} == {"First Principles Analysis", "SCAMPER Method"}


def test_filter_tier(lib):
    assert {r["method_name"] for r in pick_methods.filter_rows(rows(lib), tier="more")} == {"SCAMPER Method"}
    assert len(pick_methods.filter_rows(rows(lib), ["premise"], "core")) == 1


def test_filter_none_returns_all(lib):
    assert len(pick_methods.filter_rows(rows(lib))) == 5


def test_find_by_name_num_and_missing(lib):
    found, missing = pick_methods.find(rows(lib), ["scamper method", "3", "Nope"])
    assert [r["method_name"] for r in found] == ["SCAMPER Method", "First Principles Analysis"]
    assert missing == ["Nope"]


def test_exclude_skips_named(lib):
    got = pick_methods.exclude(rows(lib), ["pre-mortem analysis", "SCAMPER Method"])
    assert {r["method_name"] for r in got} == {
        "Assumption Audit",
        "First Principles Analysis",
        "Socratic Questioning",
    }


# --- spread sampling ---------------------------------------------------------


def test_spread_hits_distinct_directions(lib):
    for seed in range(20):
        picks = pick_methods.spread_sample(rows(lib), 3, random.Random(seed))
        assert len({r["direction"] for r in picks}) == 3


def test_spread_wraps_when_directions_run_out(lib):
    picks = pick_methods.spread_sample(rows(lib), 5, random.Random(0))
    assert len(picks) == 5
    assert len({r["method_name"] for r in picks}) == 5  # no duplicates


def test_spread_clamps_to_pool(lib):
    assert len(pick_methods.spread_sample(rows(lib), 99, random.Random(0))) == 5


# --- CLI ---------------------------------------------------------------------


def run(args, lib, capsys):
    code = pick_methods.main(["--file", str(lib), *args])
    captured = capsys.readouterr()
    return code, captured.out, captured.err


def test_cli_directions(lib, capsys):
    code, out, _ = run(["directions"], lib, capsys)
    assert code == 0
    assert "premise\tChallenge the premise\t1 core\t1 more" in out


def test_cli_list_requires_scope(lib, capsys):
    code, _, err = run(["list"], lib, capsys)
    assert code == 2
    assert "--direction" in err


def test_cli_list_direction_tier_and_all(lib, capsys):
    code, out, _ = run(["list", "--direction", "premise"], lib, capsys)
    assert code == 0 and len(out.strip().splitlines()) == 2
    assert "SCAMPER" in out and "Socratic" not in out
    assert "form:" not in out  # the index leaves the form line out
    code, out, _ = run(["list", "--tier", "core"], lib, capsys)
    assert code == 0 and len(out.strip().splitlines()) == 4
    code, out, _ = run(["list", "--all"], lib, capsys)
    assert code == 0 and len(out.strip().splitlines()) == 5


def test_cli_show_found_and_missing(lib, capsys):
    code, out, err = run(["show", "Assumption Audit", "Ghost"], lib, capsys)
    assert code == 0
    assert "form: A rated table" in out
    assert "not found: Ghost" in err
    code, _, _ = run(["show", "Ghost"], lib, capsys)
    assert code == 1


def test_cli_random_spread_exclude(lib, capsys):
    code, out, _ = run(["random", "-n", "3", "--spread", "--exclude", "SCAMPER Method"], lib, capsys)
    assert code == 0
    lines = [ln for ln in out.strip().splitlines() if ln]
    assert len(lines) == 3
    assert "SCAMPER" not in out and "form:" in out


def test_cli_random_clamps_and_empty_pool(lib, capsys):
    code, out, _ = run(["random", "-n", "99"], lib, capsys)
    assert code == 0 and len(out.strip().splitlines()) == 5
    code, _, err = run(["random", "--direction", "custom"], lib, capsys)
    assert code == 1 and "no methods match" in err


def test_cli_unknown_direction_is_rejected(lib, capsys):
    for cmd in ("list", "random"):
        with pytest.raises(SystemExit) as e:
            run([cmd, "--direction", "other side"], lib, capsys)
        assert e.value.code == 2 and "invalid choice" in capsys.readouterr().err


def test_cli_random_tier(lib, capsys):
    code, out, _ = run(["random", "-n", "9", "--tier", "more"], lib, capsys)
    assert code == 0 and out.strip().splitlines() == [ln for ln in out.strip().splitlines() if ln.endswith("more")]


def test_cli_customization_from_file_and_stdin(tmp_path, lib, capsys, monkeypatch):
    spec = {"workflow": {"methods_file": str(lib), "additional_methods": EXTRA}}
    f = tmp_path / "customization.json"
    f.write_text(json.dumps(spec), encoding="utf-8")
    code = pick_methods.main(["--customization", str(f), "list", "--direction", "custom"])
    out = capsys.readouterr().out
    assert code == 0 and "Regulatory Inversion" in out
    import io

    monkeypatch.setattr(sys, "stdin", io.StringIO(json.dumps(spec)))
    code = pick_methods.main(["--customization", "-", "directions"])
    out = capsys.readouterr().out
    assert code == 0 and "custom\tCustom\t1 core" in out
    code = pick_methods.main(["--customization", "[]", "directions"])
    assert code == 2 and "customization" in capsys.readouterr().err


def test_cli_extra_inline_json(lib, capsys):
    code, out, _ = run(["--extra", json.dumps(EXTRA), "list", "--direction", "custom"], lib, capsys)
    assert code == 0 and "Regulatory Inversion" in out


def test_cli_bad_extra_and_missing_file(tmp_path, lib, capsys):
    code, _, err = run(["--extra", str(tmp_path / "gone.json"), "directions"], lib, capsys)
    assert code == 2 and "customization" in err
    code = pick_methods.main(["--file", str(tmp_path / "gone.csv"), "directions"])
    assert code == 2


def test_cli_extra_row_missing_a_required_field_exits_2(lib, capsys):
    partial = [{"direction": "future", "method_name": "Pre-mortem Analysis", "description": "No form."}]
    code, out, err = run(["--extra", json.dumps(partial), "list", "--all"], lib, capsys)
    assert code == 2 and out == ""
    assert "Pre-mortem Analysis" in err and "form" in err
    assert "customization" in err


def test_cli_extra_duplicate_num_exits_2_naming_the_num(lib, capsys):
    clash = [{**EXTRA[0], "num": "3"}]
    code, out, err = run(["--extra", json.dumps(clash), "list", "--all"], lib, capsys)
    assert code == 2 and out == ""
    assert "num 3" in err


def test_cli_json_output(lib, capsys):
    code, out, _ = run(["--json", "show", "1"], lib, capsys)
    assert code == 0
    data = json.loads(out)
    assert data[0]["method_name"] == "Pre-mortem Analysis" and data[0]["form"]


# --- shipped catalog integration ----------------------------------------------


def test_shipped_catalog_loads_clean():
    shipped = pick_methods.DEFAULT_FILE
    assert shipped.is_file(), f"shipped catalog missing: {shipped}"
    r = pick_methods.load(shipped)
    assert len(r) >= 40
    for row in r:
        assert row["direction"] != "custom", row  # every shipped row sits in one of the six
        assert row["method_name"] and row["description"] and row["form"], row
    core = [row for row in r if row["tier"] == "core"]
    assert 20 <= len(core) <= 35
    assert len({row["direction"] for row in core}) == 6  # every direction has a core method
    nums = [row["num"] for row in r]
    assert len(nums) == len(set(nums))


def test_old_names_resolve_through_aliases(tmp_path):
    cat = tmp_path / "m.csv"
    cat.write_text(
        "num,direction,method_name,description,form,tier,aliases\n"
        "1,future,Cascading Failure Simulation,Break one thing,A trace,core,Chaos Monkey Scenarios\n"
        "2,missing,Expert Panel,Experts read it,One view,core,Expert Panel Review; Panel\n",
        encoding="utf-8",
    )
    rows = pick_methods.load(cat)
    found, missing = pick_methods.find(rows, ["chaos monkey scenarios", "Panel", "Nope"])
    assert [r["method_name"] for r in found] == ["Cascading Failure Simulation", "Expert Panel"]
    assert missing == ["Nope"]
    retuned = {"method_name": "Expert Panel Review", "direction": "missing", "description": "d", "form": "f"}
    merged = pick_methods.merge_extra(rows, pick_methods.load_extra(json.dumps([retuned])))
    assert len(merged) == 2 and merged[1]["method_name"] == "Expert Panel Review" and merged[1]["num"] == "2"
    found, missing = pick_methods.find(merged, ["Expert Panel", "Panel", "expert panel review"])
    assert [r["method_name"] for r in found] == ["Expert Panel Review"] * 3 and not missing
