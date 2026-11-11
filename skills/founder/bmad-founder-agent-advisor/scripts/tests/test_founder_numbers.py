# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for founder_numbers.py. Run: uv run --with pytest pytest scripts/tests/test_founder_numbers.py

Hand-computed cases for each subcommand: runway and default alive, scenarios, personal runway,
unit economics, market size, SAFE conversion where the cap or the discount binds, SAFE stakes before a priced round, the option
pool shuffle, the operating model's CSV, and the error exits.
"""

import csv
import importlib.util
import json
import sys
from pathlib import Path

import pytest

_SPEC = importlib.util.spec_from_file_location(
    "founder_numbers", Path(__file__).resolve().parent.parent / "founder_numbers.py"
)
founder_numbers = importlib.util.module_from_spec(_SPEC)
sys.modules["founder_numbers"] = founder_numbers
_SPEC.loader.exec_module(founder_numbers)


def run(capsys, *argv: str) -> dict:
    assert founder_numbers.main(list(argv)) == 0
    return json.loads(capsys.readouterr().out)


def fails(capsys, *argv: str, code: int = 1) -> str:
    assert founder_numbers.main(list(argv)) == code
    captured = capsys.readouterr()
    assert captured.out == ""
    assert captured.err.startswith("error: ")
    return captured.err


# runway


def test_runway_without_revenue_is_cash_over_costs():
    result = founder_numbers.runway(cash=120000, costs=10000)
    assert result["months_of_runway"] == 12.0
    assert result["default_alive"] is False
    assert result["breakeven_month_index"] is None
    assert len(result["months"]) == 12
    assert result["months"][-1]["cash_end"] == 0.0


def test_runway_interpolates_the_last_month_and_labels_it():
    result = founder_numbers.runway(cash=125000, costs=10000, start="2026-03")
    assert result["months_of_runway"] == 12.5
    assert result["zero_cash_month"] == "2027-03"
    assert result["months"][0]["month"] == "2026-03"


def test_runway_net_of_flat_revenue():
    result = founder_numbers.runway(cash=100000, costs=30000, revenue=10000)
    assert result["months_of_runway"] == 5.0


def test_default_alive_when_revenue_reaches_costs_first():
    # Revenue 5000 doubling monthly reaches costs of 20000 in month 3; net burn 15000 + 10000 = 25000.
    result = founder_numbers.runway(cash=50000, costs=20000, revenue=5000, revenue_growth=100, start="2026-01")
    assert result["default_alive"] is True
    assert result["breakeven_month_index"] == 3
    assert result["breakeven_month"] == "2026-03"
    assert result["cash_at_breakeven"] == 25000.0
    assert result["months_of_runway"] is None
    assert len(result["months"]) == 3


def test_default_dead_when_cash_runs_out_first():
    result = founder_numbers.runway(cash=20000, costs=20000, revenue=5000, revenue_growth=100)
    assert result["default_alive"] is False
    assert result["breakeven_month_index"] is None
    # Month 1 net burn 15000 leaves 5000; month 2 net burn 10000 runs out halfway.
    assert result["months_of_runway"] == 1.5


def test_runway_undecided_within_max_months():
    result = founder_numbers.runway(cash=1_000_000, costs=10000, max_months=12)
    assert result["default_alive"] is None
    assert result["months_of_runway"] is None
    assert len(result["months"]) == 12


def test_cost_growth_shortens_runway():
    flat = founder_numbers.runway(cash=100000, costs=10000)
    growing = founder_numbers.runway(cash=100000, costs=10000, cost_growth=5)
    assert growing["months_of_runway"] < flat["months_of_runway"]


def test_profit_that_costs_outgrow_is_not_breakeven():
    # Revenue equals costs in month 1, but costs grow 10% a month and revenue does not.
    result = founder_numbers.runway(cash=100000, costs=10000, revenue=10000, cost_growth=10)
    assert result["default_alive"] is False
    assert result["breakeven_month_index"] is None
    assert result["months_of_runway"] > 1
    assert any("profit does not last" in a for a in result["assumptions"])


def test_breakeven_with_matching_growth_is_default_alive():
    result = founder_numbers.runway(cash=100000, costs=10000, revenue=10000, revenue_growth=5, cost_growth=5)
    assert result["default_alive"] is True
    assert result["breakeven_month_index"] == 1


def test_scenarios_listed_with_base_first(capsys):
    result = run(
        capsys, "runway", "--cash", "120000", "--costs", "10000",
        "--scenario", "hire-now:costs=12000", "--scenario", "raise:cash=240000,max_months=30",
    )  # fmt: skip
    assert [s["name"] for s in result["scenarios"]] == ["base", "hire-now", "raise"]
    assert [s["months_of_runway"] for s in result["scenarios"]] == [12.0, 10.0, 24.0]
    assert result["scenarios"][2]["inputs"]["max_months"] == 30
    assert all("months" not in s for s in result["scenarios"])
    assert len(result["months"]) == 12


def test_no_scenarios_key_without_scenarios(capsys):
    assert "scenarios" not in run(capsys, "runway", "--cash", "1000", "--costs", "100")


def test_scenario_parsing():
    assert founder_numbers.parse_scenario("hire:costs=62000, revenue-growth=5,start=2026-04") == (
        "hire",
        {"costs": 62000.0, "revenue_growth": 5.0, "start": "2026-04"},
    )


@pytest.mark.parametrize("scenario", ["hire:payroll=5", "no-colon", ":costs=5", "hire:costs", "hire:costs=lots"])
def test_bad_scenario_exits_1(capsys, scenario):
    fails(capsys, "runway", "--cash", "1000", "--costs", "100", "--scenario", scenario)


# personal runway


def test_personal_runway_keeps_the_buffer():
    result = founder_numbers.personal_runway(
        savings=60000, monthly_costs=5000, monthly_income=1000, buffer_months=3, start="2026-01"
    )
    assert result["buffer_amount"] == 15000.0
    assert result["usable_savings"] == 45000.0
    assert result["months_until_buffer"] == 11.2
    assert result["buffer_reached_month"] == "2026-12"


def test_personal_runway_whole_months_end_in_the_last_month():
    result = founder_numbers.personal_runway(savings=12000, monthly_costs=4000, start="2026-01")
    assert result["months_until_buffer"] == 3.0
    assert result["buffer_reached_month"] == "2026-03"


def test_personal_runway_income_covers_costs():
    result = founder_numbers.personal_runway(savings=1000, monthly_costs=3000, monthly_income=3000)
    assert result["months_until_buffer"] is None


# unit economics


def test_unit_economics_hand_case():
    result = founder_numbers.unit_economics(arpa=100, gross_margin=80, cac=1000, churn=2)
    assert result["ltv"] == 4000.0
    assert result["ltv_to_cac"] == 4.0
    assert result["cac_payback_months"] == 12.5
    assert result["customer_lifetime_months"] == 50.0
    assert len(result["notes"]) == 1 and "payback" in result["notes"][0].lower()


def test_unit_economics_flags_low_ltv_to_cac():
    result = founder_numbers.unit_economics(arpa=100, gross_margin=80, cac=2000, churn=2)
    assert result["ltv_to_cac"] == 2.0
    assert len(result["notes"]) == 2


def test_unit_economics_healthy_has_no_notes():
    assert founder_numbers.unit_economics(arpa=100, gross_margin=80, cac=500, churn=2)["notes"] == []


def test_fraction_given_for_a_percent_is_flagged(capsys):
    result = run(capsys, "unit-economics", "--arpa", "100", "--gross-margin", "80", "--cac", "1000", "--churn", "0.02")
    assert result["notes"][0] == "--churn 0.02 is read as 0.02%; for 2% pass 2."
    assert not any("gross-margin" in note for note in result["notes"])


def test_fraction_warning_reaches_subcommands_without_notes(capsys):
    result = run(capsys, "runway", "--cash", "1000", "--costs", "100", "--revenue-growth", "0.5")
    assert result["notes"] == ["--revenue-growth 0.5 is read as 0.5%; for 50% pass 50."]
    assert "notes" not in run(capsys, "runway", "--cash", "1000", "--costs", "100", "--revenue-growth", "1")


def test_zero_churn_exits_1(capsys):
    fails(capsys, "unit-economics", "--arpa", "100", "--gross-margin", "80", "--cac", "1000", "--churn", "0")


# market size


def test_market_size_bottom_up():
    result = founder_numbers.market_size(accounts=10000, annual_price=1200, reachable=30, win_rate=10)
    assert result["total"] == {"accounts": 10000, "value": 12_000_000.0}
    assert result["reachable"] == {"accounts": 3000, "value": 3_600_000.0}
    assert result["obtainable"] == {"accounts": 300, "value": 360_000.0}


def test_market_size_defaults_to_everything():
    result = founder_numbers.market_size(accounts=500, annual_price=100)
    assert result["total"] == result["reachable"] == result["obtainable"]


# round


def cap_table(safes=(), pool_target=0, unallocated=0, pre=20_000_000, new=5_000_000) -> dict:
    return {
        "holders": [
            {"name": "Founder A", "shares": 5_000_000, "class": "common"},
            {"name": "Founder B", "shares": 5_000_000, "class": "common"},
        ],
        "options_pool": {"granted": 0, "unallocated": unallocated},
        "safes": list(safes),
        "round": {"pre_money": pre, "new_money": new, "pool_target_post": pool_target},
    }


def after(result: dict, name: str) -> float:
    return next(row["percent_after"] for row in result["cap_table"] if row["name"] == name)


def test_round_without_safes_or_pool():
    result = founder_numbers.priced_round(cap_table())
    assert result["price_per_share"] == 2.0
    assert result["post_money"] == 25_000_000.0
    assert result["new_investor_shares"] == 2_500_000
    assert after(result, "Founder A") == 40.0
    assert after(result, "New investors") == 20.0


def test_safe_converts_at_the_cap_when_the_cap_binds():
    # The SAFE owns 1M / 10M cap = 10% just before the round: 1,111,111 shares at 0.90.
    # Round price 20M / 11,111,111 = 1.80, discounted 1.44, so the cap price is lower.
    safe = {"name": "Angel", "amount": 1_000_000, "cap": 10_000_000, "discount": 20}
    result = founder_numbers.priced_round(cap_table([safe]))
    converted = result["safes"][0]
    assert converted["price_basis"] == "cap"
    assert converted["conversion_price"] == 0.9
    assert converted["shares"] == 1_111_111
    assert result["price_per_share"] == 1.8
    assert converted["percent_after"] == 8.0
    assert after(result, "New investors") == 20.0
    assert after(result, "Founder A") == 36.0


def test_safe_converts_at_the_discount_when_the_discount_binds():
    # Discounted price 0.8 x round price; the SAFE owns 1M / (25M post x 0.8) = 5% after the round.
    safe = {"name": "Angel", "amount": 1_000_000, "cap": 50_000_000, "discount": 20}
    result = founder_numbers.priced_round(cap_table([safe]))
    converted = result["safes"][0]
    assert converted["price_basis"] == "discount"
    assert result["price_per_share"] == 1.875
    assert converted["conversion_price"] == 1.5
    assert converted["shares"] == 666_667
    assert converted["percent_after"] == 5.0
    assert after(result, "Founder A") == 37.5


def test_uncapped_safe_uses_the_discount_and_bare_safe_the_round_price():
    discount_only = founder_numbers.priced_round(cap_table([{"name": "S", "amount": 1_000_000, "discount": 20}]))
    assert discount_only["safes"][0]["percent_after"] == 5.0
    bare = founder_numbers.priced_round(cap_table([{"name": "S", "amount": 1_000_000}]))
    assert bare["safes"][0]["price_basis"] == "round"
    assert bare["safes"][0]["conversion_price"] == bare["price_per_share"]
    assert bare["safes"][0]["percent_after"] == 4.0


def test_pool_shuffle_comes_out_of_the_founders():
    # 10% pool and 20% new money leave the founders 70% instead of 80%; the top-up is
    # 10% of post-money, so the effective pre-money is 20M - 2.5M.
    result = founder_numbers.priced_round(cap_table(pool_target=10))
    assert after(result, "Founder A") + after(result, "Founder B") == 70.0
    assert after(result, "Unallocated option pool") == 10.0
    assert result["pool_top_up_value"] == 2_500_000.0
    assert result["effective_pre_money"] == 17_500_000.0
    assert result["fully_diluted_after"] == round(10_000_000 / 0.7)


def test_existing_pool_over_target_gets_no_top_up():
    result = founder_numbers.priced_round(cap_table(pool_target=5, unallocated=2_000_000))
    assert result["pool_top_up_shares"] == 0
    assert result["effective_pre_money"] == result["pre_money"]


def test_percentages_sum_to_100_with_pool_and_mixed_safes():
    safes = [
        {"name": "Angel", "amount": 1_000_000, "cap": 10_000_000, "discount": 20},
        {"name": "Fund", "amount": 500_000, "discount": 20},
    ]
    result = founder_numbers.priced_round(cap_table(safes, pool_target=10, unallocated=500_000))
    assert sum(row["percent_after"] for row in result["cap_table"]) == pytest.approx(100, abs=0.05)
    assert sum(row["percent_before"] for row in result["cap_table"]) == pytest.approx(100, abs=0.05)
    assert after(result, "Unallocated option pool") == 10.0
    assert after(result, "New investors") == 20.0
    assert after(result, "Fund") == 2.5
    capitalization = 10_500_000 + sum(s["shares"] for s in result["safes"])
    assert result["safes"][0]["shares"] == pytest.approx(capitalization / 10, abs=1)


def test_round_reads_the_cap_table_file(tmp_path, capsys):
    path = tmp_path / "cap.json"
    path.write_text(json.dumps(cap_table()), encoding="utf-8")
    result = run(capsys, "round", "--cap-table", str(path))
    assert result["inputs"]["cap_table"] == str(path)
    assert result["price_per_share"] == 2.0


def test_round_flags_override_the_file(tmp_path, capsys):
    path = tmp_path / "cap.json"
    path.write_text(json.dumps(cap_table()), encoding="utf-8")
    result = run(capsys, "round", "--cap-table", str(path), "--pre-money", "30000000", "--pool-target", "10")
    assert result["inputs"]["round"] == {"pre_money": 30_000_000, "new_money": 5_000_000, "pool_target_post": 10}
    assert result["post_money"] == 35_000_000.0
    assert after(result, "Unallocated option pool") == 10.0
    assert json.loads(path.read_text(encoding="utf-8"))["round"]["pre_money"] == 20_000_000


def test_round_flags_supply_a_missing_round(tmp_path, capsys):
    data = cap_table()
    del data["round"]
    path = tmp_path / "cap.json"
    path.write_text(json.dumps(data), encoding="utf-8")
    result = run(capsys, "round", "--cap-table", str(path), "--pre-money", "20000000", "--new-money", "5000000")
    assert result["price_per_share"] == 2.0
    assert "--pre-money" in fails(capsys, "round", "--cap-table", str(path))


def test_missing_cap_table_exits_2(tmp_path, capsys):
    assert "not found" in fails(capsys, "round", "--cap-table", str(tmp_path / "absent.json"), code=2)


def test_safes_claiming_the_whole_company_exit_1(tmp_path, capsys):
    path = tmp_path / "cap.json"
    path.write_text(json.dumps(cap_table([{"name": "S", "amount": 2_000_000, "cap": 1_000_000}])), encoding="utf-8")
    fails(capsys, "round", "--cap-table", str(path))


# model


def test_model_writes_the_csv(tmp_path, capsys):
    out = tmp_path / "plan" / "model.csv"
    result = run(
        capsys, "model", "--cash", "100000", "--revenue", "1000", "--revenue-growth", "10",
        "--costs", "10000", "--months", "6", "--start", "2026-01",
        "--hire", "Engineer:2026-03:8000", "--expense", "Laptop:2026-02:3000", "--out", str(out),
    )  # fmt: skip
    with out.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    assert list(rows[0]) == founder_numbers.CSV_COLUMNS
    assert [r["month"] for r in rows] == ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"]
    assert [float(r["hires_cost"]) for r in rows] == [0, 0, 8000, 8000, 8000, 8000]
    assert [float(r["one_off"]) for r in rows] == [0, 3000, 0, 0, 0, 0]
    assert float(rows[1]["revenue"]) == 1100.0
    assert float(rows[1]["total_costs"]) == 13000.0
    assert float(rows[0]["cash_end"]) == 91000.0
    assert result["path"] == str(out)
    assert result["rows"] == 6
    assert result["ending_cash"] == float(rows[-1]["cash_end"])
    assert result["zero_cash_month"] is None
    assert result["breakeven_month"] is None


def test_model_zero_cash_and_sustained_breakeven(tmp_path):
    summary, rows = founder_numbers.operating_model(
        cash=5000, costs=10000, start="2026-01", months=4, revenue=4000, revenue_growth=100
    )
    # Revenue 4000, 8000, 16000, 32000 against costs 10000: cash -1000 in January, breakeven from March.
    assert summary["zero_cash_month"] == "2026-01"
    assert summary["breakeven_month"] == "2026-03"
    assert [r["net"] for r in rows] == [-6000.0, -2000.0, 6000.0, 22000.0]


def test_model_breakeven_must_hold_to_the_end():
    summary, _ = founder_numbers.operating_model(
        cash=100000, costs=10000, start="2026-01", months=3, revenue=12000, hires=["Sales:2026-03:5000"]
    )
    assert summary["breakeven_month"] is None


@pytest.mark.parametrize("hire", ["Engineer:2026-3:8000", "Engineer:8000", "Engineer:2026-03:lots"])
def test_bad_hire_exits_1(tmp_path, capsys, hire):
    fails(
        capsys, "model", "--cash", "1", "--costs", "1", "--start", "2026-01",
        "--hire", hire, "--out", str(tmp_path / "m.csv"),
    )  # fmt: skip


def test_missing_required_flag_exits_1(capsys):
    fails(capsys, "runway", "--cash", "1000")


# safes before a priced round


def test_safe_offer_owns_amount_over_cap_before_a_round(tmp_path, capsys):
    # 10M shares; two $500k SAFEs at a $7M cap claim 1/7 together, so the company is 10M / (6/7) shares.
    path = tmp_path / "cap.json"
    path.write_text(
        json.dumps(
            {
                "holders": [{"name": "A", "shares": 5_000_000}, {"name": "B", "shares": 4_000_000}],
                "options_pool": {"granted": 0, "unallocated": 1_000_000},
            }
        )
    )
    result = run(
        capsys, "safes", "--cap-table", str(path), "--safe", "Lead:500000:7000000:20", "--safe", "Others:500000:7000000"
    )
    assert [s["percent"] for s in result["safes"]] == [7.14, 7.14]
    assert result["fully_diluted_after"] == 11_666_667
    rows = {r["name"]: r for r in result["cap_table"]}
    assert rows["A"]["percent_before"] == 50.0
    assert rows["A"]["percent_after"] == 42.86
    assert sum(r["percent_after"] for r in result["cap_table"]) == pytest.approx(100, abs=0.02)
    assert any("discount applies only at a priced round" in a for a in result["assumptions"])


def test_uncapped_safe_is_listed_unpriced(tmp_path, capsys):
    path = tmp_path / "cap.json"
    path.write_text(
        json.dumps({"holders": [{"name": "A", "shares": 1000}], "safes": [{"name": "Friend", "amount": 50000}]})
    )
    result = run(capsys, "safes", "--cap-table", str(path))
    assert result["safes"] == []
    assert result["unpriced_safes"] == ["Friend"]
    assert result["cap_table"][0]["percent_after"] == 100.0


def test_safes_claiming_the_whole_company_before_a_round_exit_1(tmp_path, capsys):
    path = tmp_path / "cap.json"
    path.write_text(json.dumps({"holders": [{"name": "A", "shares": 1000}]}))
    fails(capsys, "safes", "--cap-table", str(path), "--safe", "Too much:1000000:1000000")


def test_round_takes_an_offered_safe_as_a_flag(tmp_path, capsys):
    path = tmp_path / "cap.json"
    path.write_text(json.dumps({"holders": [{"name": "A", "shares": 1_000_000}]}))
    flagged = run(
        capsys,
        "round",
        "--cap-table",
        str(path),
        "--pre-money",
        "8000000",
        "--new-money",
        "2000000",
        "--safe",
        "Lead:500000:7000000",
    )
    path.write_text(
        json.dumps(
            {
                "holders": [{"name": "A", "shares": 1_000_000}],
                "safes": [{"name": "Lead", "amount": 500000, "cap": 7000000}],
            }
        )
    )
    in_file = run(capsys, "round", "--cap-table", str(path), "--pre-money", "8000000", "--new-money", "2000000")
    assert flagged["safes"] == in_file["safes"]


@pytest.mark.parametrize("spec", ["no-amount", "x:lots", ":500"])
def test_bad_safe_flag_exits_1(tmp_path, capsys, spec):
    path = tmp_path / "cap.json"
    path.write_text(json.dumps({"holders": [{"name": "A", "shares": 1000}]}))
    fails(capsys, "safes", "--cap-table", str(path), "--safe", spec)
