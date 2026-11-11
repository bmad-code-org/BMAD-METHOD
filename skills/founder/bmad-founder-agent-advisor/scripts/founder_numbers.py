#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""founder-numbers — runway, unit economics, market size and cap-table arithmetic for a founder.

Money is plain numbers in one currency; the caller tracks the unit. Percentages are given as
numbers, `5` for 5%. Growth rates are monthly and compound. Months are `YYYY-MM`, and month 1 is
the `--start` month. Output rounds money to 2 decimals, months to 1 decimal and percentages to
2 decimals; the arithmetic keeps full precision. Every output has `inputs`, an echo of what was
used, and `assumptions`, the plain-words assumptions the result rests on.

Subcommands:

  runway --cash N --costs N [--revenue N] [--revenue-growth PCT] [--cost-growth PCT]
         [--start YYYY-MM] [--max-months N] [--scenario 'name:key=value,...' ...]
    Company runway, simulated month by month. `--costs` is monthly gross costs (net burn plus
    revenue) and `--revenue` current monthly revenue (default 0); month 1 uses them as given and the growth rates
    (default 0) apply from month 2. Net burn = costs - revenue, taken from cash each month.
    `--max-months` defaults to 60. The simulation stops at zero cash, at breakeven (revenue
    reaches costs while growing at least as fast, so the profit lasts) or at max-months,
    whichever comes first. A month in profit while costs grow faster is not breakeven.
    Output: months_of_runway (fractional, interpolated within the month cash crosses zero;
    null when cash does not run out within max-months), zero_cash_month (YYYY-MM, needs
    --start), default_alive (true when breakeven comes before cash runs out, false when cash
    runs out first, null when neither happens within max-months), breakeven_month_index,
    breakeven_month (YYYY-MM, needs --start), cash_at_breakeven (cash at the end of the
    breakeven month), and months: [{index, month, revenue, costs, net_burn, cash_end}].
    `--scenario` is repeatable. Its keys are the flag names above without dashes in front
    (cash, costs, revenue, revenue-growth, cost-growth, start, max-months), each overriding the
    base input, e.g. 'hire-now:costs=62000'. With any scenario, `scenarios` lists the base case
    first, named `base`, then each scenario: {name, inputs, assumptions, and the summary
    fields above without months}.

  personal-runway --savings N --monthly-costs N [--monthly-income N] [--buffer-months N]
                  [--start YYYY-MM]
    How long savings last after quitting a job. The buffer, `--buffer-months` x monthly
    costs (default 0), stays untouched; side income (default 0) offsets costs.
    Output: buffer_amount, usable_savings (savings - buffer), monthly_draw (costs - income),
    months_until_buffer (null when income covers costs), buffer_reached_month (YYYY-MM, the
    month the usable savings are gone, needs --start).

  unit-economics --arpa N --gross-margin PCT --cac N --churn PCT
    `--arpa` is monthly revenue per account and `--churn` monthly churn, which must be > 0.
    Output: ltv = arpa x margin / churn, ltv_to_cac = ltv / cac, cac_payback_months =
    cac / (arpa x margin), customer_lifetime_months = 1 / churn, and notes: plain
    observations when LTV:CAC is under 3 or payback is over 12 months.

  market-size --accounts N --annual-price N [--reachable PCT] [--win-rate PCT]
    Bottom-up market size. total = accounts x annual price; reachable = total x reachable %
    (default 100); obtainable = reachable x win rate % (default 100).
    Output: total, reachable, obtainable, each {accounts, value}, and formula in words.
    Account counts are rounded to whole numbers; values use the unrounded counts.

  round --cap-table PATH [--pre-money N] [--new-money N] [--pool-target PCT] [--safe SPEC ...]
    Cap table after a priced round in which YC post-money SAFEs convert. PATH is JSON shaped
    like CAP_TABLE_SCHEMA below, which `round --help` prints. `options_pool` and `safes` are
    optional; a SAFE's `cap` and `discount` are optional, and `pool_target_post` defaults to 0.
    `--pre-money`, `--new-money` and `--pool-target` supply or override the file's `round`
    values, so the file can hold only the current cap table. `--safe 'name:amount[:cap[:discount]]'`
    is repeatable and adds a SAFE to the file's, such as one on offer. Rules:
      - Company capitalization before the round = holders' shares + granted options +
        unallocated pool + every SAFE's conversion shares. The pool top-up made for this round
        is left out, as the YC post-money SAFE defines it.
      - Cap price = cap / company capitalization, so a capped SAFE owns amount / cap of the
        company just before the round.
      - Round price = pre-money / (company capitalization + pool top-up).
      - A SAFE converts at the lower of its cap price and round price x (1 - discount); with
        no cap, at the discounted round price; with neither, at the round price.
      - The pool is topped up so the unallocated pool is `pool_target_post` % of post-money
        fully diluted shares. The top-up is created before the round and counted in the
        pre-money (the option pool shuffle). An unallocated pool already at or over the
        target gets no top-up.
      - New investors buy new_money / round price shares, so they own new_money / post-money.
    The round price, the pool top-up and the SAFE shares depend on each other. The script
    solves this with a fixed-point iteration on total SAFE shares: start from zero, compute
    the post-round share count and the pool top-up in closed form for that SAFE total, convert
    each SAFE at its price, and repeat until the SAFE total changes by under 1e-9 of a share.
    Each step is increasing in the SAFE total, so the iteration climbs monotonically to the
    solution; it fails with an error when the SAFEs together claim more than the company.
    Output: price_per_share (4 decimals), pre_money, post_money, effective_pre_money
    (pre-money minus the pool top-up's value at the round price), pool_top_up_shares,
    pool_top_up_value, new_investor_shares, safes: [{name, amount, cap, discount,
    conversion_price, price_basis (cap, discount or round), shares, percent_after}],
    fully_diluted_before, fully_diluted_after, and cap_table: [{name, class, shares_before,
    percent_before, shares_after, percent_after}] covering holders, granted options, the
    unallocated pool, each SAFE and the new investors. Shares are rounded to whole numbers;
    percentages use the unrounded shares.

  safes --cap-table PATH [--safe 'name:amount[:cap[:discount]]' ...]
    Ownership once the YC post-money SAFEs convert at their caps, before any priced round: the
    stake a SAFE offer costs on its own. Each capped SAFE owns amount / cap of the company
    capitalization including every SAFE; the rest is shared pro rata as it is now. An uncapped
    SAFE has no price until a priced round and is listed in `unpriced_safes`; a discount only
    applies at a priced round. Output: safes: [{name, amount, cap, discount, shares, percent}],
    unpriced_safes, fully_diluted_before, fully_diluted_after, and cap_table as in `round`.

  model --cash N --costs N --start YYYY-MM --out PATH.csv [--revenue N] [--revenue-growth PCT]
        [--months N] [--hire 'role:YYYY-MM:monthly_cost' ...] [--expense 'name:YYYY-MM:amount' ...]
    A monthly operating model written to CSV for a spreadsheet. Revenue (default 0) grows at
    `--revenue-growth` from month 2; base costs stay flat; a hire's monthly cost runs from its
    month on; an expense is paid once in its month. `--months` defaults to 24.
    CSV columns: month, revenue, base_costs, hires_cost, one_off, total_costs, net, cash_end.
    Output: path, rows, zero_cash_month (first month cash_end <= 0, or null),
    breakeven_month (first month from which net >= 0 in every remaining month, or null),
    ending_cash.

A percent flag given strictly between 0 and 1 adds a warning to `notes`, since it is usually a
fraction given for a percent.

Prints one JSON object on stdout. Errors print `error: <message>` on stderr and exit 1;
a missing cap-table file exits 2.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
from pathlib import Path

MONTH_RE = re.compile(r"^(\d{4})-(\d{2})$")
LTV_CAC_FLOOR = 3.0
PAYBACK_CEILING = 12.0
SAFE_TOLERANCE = 1e-9
SAFE_MAX_ITERATIONS = 10000
SAFE_RUNAWAY = 1e9
PERCENT_FLAGS = ("revenue_growth", "cost_growth", "gross_margin", "churn", "reachable", "win_rate", "pool_target")
CAP_TABLE_SCHEMA = """\
  {"holders": [{"name": "Founder A", "shares": 4000000, "class": "common"}, ...],
   "options_pool": {"granted": 0, "unallocated": 500000},
   "safes": [{"name": "Angel", "amount": 100000, "cap": 8000000, "discount": 20}],
   "round": {"pre_money": 12000000, "new_money": 3000000, "pool_target_post": 10}}"""


SAFE_HELP = "repeatable 'name:amount[:cap[:discount]]', a SAFE added to the file's, such as one on offer"


class InputError(Exception):
    """A bad input; printed as `error: <message>`, exit 1."""


class MissingFile(Exception):
    """An input file that does not exist; exit 2."""


def money(x: float | None) -> float | None:
    return None if x is None else round(x, 2) + 0.0


def months_out(x: float | None) -> float | None:
    return None if x is None else round(x, 1) + 0.0


def pct_out(x: float) -> float:
    return round(x, 2) + 0.0


def parse_month(text: str) -> tuple[int, int]:
    m = MONTH_RE.match(text)
    if not m or not 1 <= int(m.group(2)) <= 12:
        raise InputError(f"month must be YYYY-MM: {text!r}")
    return int(m.group(1)), int(m.group(2))


def month_label(start: str | None, index: int) -> str | None:
    """The YYYY-MM label of month `index` (1 = start), or None without a start."""
    if start is None:
        return None
    year, month = parse_month(start)
    total = year * 12 + (month - 1) + (index - 1)
    return f"{total // 12:04d}-{total % 12 + 1:02d}"


def month_index(start: str, month: str) -> int:
    """The index of `month` counted from `start` as month 1."""
    (y0, m0), (y1, m1) = parse_month(start), parse_month(month)
    return (y1 * 12 + m1) - (y0 * 12 + m0) + 1


def require(condition: bool, message: str) -> None:
    if not condition:
        raise InputError(message)


def growth(pct: float, name: str) -> float:
    require(pct > -100, f"{name} must be above -100")
    return pct / 100


# runway


RUNWAY_KEYS = {
    "cash": ("cash", float),
    "costs": ("costs", float),
    "revenue": ("revenue", float),
    "revenue-growth": ("revenue_growth", float),
    "cost-growth": ("cost_growth", float),
    "start": ("start", str),
    "max-months": ("max_months", int),
}


def runway(
    cash: float,
    costs: float,
    revenue: float = 0.0,
    revenue_growth: float = 0.0,
    cost_growth: float = 0.0,
    start: str | None = None,
    max_months: int = 60,
) -> dict:
    """Runway summary with the month-by-month list."""
    require(cash >= 0, "cash must be 0 or more")
    require(costs >= 0, "costs must be 0 or more")
    require(revenue >= 0, "revenue must be 0 or more")
    require(1 <= max_months <= 1200, "max-months must be between 1 and 1200")
    if start is not None:
        parse_month(start)
    rg, cg = growth(revenue_growth, "revenue-growth"), growth(cost_growth, "cost-growth")

    rows: list[dict] = []
    balance = cash
    runway_months = zero_index = breakeven = cash_at_breakeven = None
    passing_profit = False
    for i in range(1, max_months + 1):
        rev = revenue * (1 + rg) ** (i - 1)
        cost = costs * (1 + cg) ** (i - 1)
        net = cost - rev
        end = balance - net
        rows.append(
            {
                "index": i,
                "month": month_label(start, i),
                "revenue": money(rev),
                "costs": money(cost),
                "net_burn": money(net),
                "cash_end": money(end),
            }
        )
        if net <= 0:
            if rg >= cg:
                breakeven, cash_at_breakeven = i, end
                break
            passing_profit = True
        elif end <= 0:
            runway_months, zero_index = (i - 1) + balance / net, i
            break
        balance = end

    assumptions = [
        "Month 1 uses the current revenue and costs; the monthly growth rates apply from month 2 and stay constant.",
        "No new funding, loans or one-off costs.",
    ]
    if runway_months is not None:
        assumptions.append("Cash runs down evenly within a month, so the final month is counted as a fraction.")
    if breakeven is not None:
        assumptions.append("After breakeven the company is taken to stay profitable, so runway is not counted past it.")
    if passing_profit:
        assumptions.append("Revenue covers costs in some months, but costs grow faster, so that profit does not last.")
    if runway_months is None and breakeven is None:
        assumptions.append(f"Neither zero cash nor breakeven happens within {max_months} months.")

    return {
        "inputs": {
            "cash": cash,
            "costs": costs,
            "revenue": revenue,
            "revenue_growth": revenue_growth,
            "cost_growth": cost_growth,
            "start": start,
            "max_months": max_months,
        },
        "assumptions": assumptions,
        "months_of_runway": months_out(runway_months),
        "zero_cash_month": month_label(start, zero_index) if zero_index else None,
        "default_alive": True if breakeven else (False if zero_index else None),
        "breakeven_month_index": breakeven,
        "breakeven_month": month_label(start, breakeven) if breakeven else None,
        "cash_at_breakeven": money(cash_at_breakeven),
        "months": rows,
    }


def parse_scenario(text: str) -> tuple[str, dict]:
    """'name:key=value,key=value' -> (name, {runway parameter: value})."""
    name, sep, body = text.partition(":")
    name = name.strip()
    require(bool(sep) and bool(name), f"scenario must look like 'name:key=value,...': {text!r}")
    overrides: dict = {}
    for pair in body.split(","):
        key, eq, value = pair.partition("=")
        key = key.strip().replace("_", "-")
        require(bool(eq) and bool(key), f"scenario {name!r} needs key=value pairs: {pair.strip()!r}")
        require(key in RUNWAY_KEYS, f"scenario {name!r} has unknown key {key!r}; use one of {', '.join(RUNWAY_KEYS)}")
        param, kind = RUNWAY_KEYS[key]
        try:
            overrides[param] = kind(value.strip())
        except ValueError:
            raise InputError(f"scenario {name!r}: {key} must be a number: {value.strip()!r}") from None
    return name, overrides


def run_runway(args: argparse.Namespace) -> dict:
    base = {param: getattr(args, param) for param, _ in RUNWAY_KEYS.values()}
    scenarios = [parse_scenario(text) for text in args.scenario or []]
    result = runway(**base)
    if scenarios:
        summaries = []
        for name, overrides in [("base", {}), *scenarios]:
            summary = runway(**{**base, **overrides})
            del summary["months"]
            summaries.append({"name": name, **summary})
        result["scenarios"] = summaries
    return result


# personal runway


def personal_runway(
    savings: float,
    monthly_costs: float,
    monthly_income: float = 0.0,
    buffer_months: float = 0.0,
    start: str | None = None,
) -> dict:
    require(savings >= 0, "savings must be 0 or more")
    require(monthly_costs > 0, "monthly-costs must be more than 0")
    require(monthly_income >= 0, "monthly-income must be 0 or more")
    require(buffer_months >= 0, "buffer-months must be 0 or more")
    if start is not None:
        parse_month(start)
    buffer = buffer_months * monthly_costs
    usable = savings - buffer
    draw = monthly_costs - monthly_income
    assumptions = ["Monthly costs and side income stay the same every month."]
    if draw <= 0:
        months = None
        assumptions.append("Side income covers monthly costs, so savings do not run down.")
    elif usable <= 0:
        months = 0.0
        assumptions.append("Savings are already at or below the buffer.")
    else:
        months = usable / draw
        assumptions.append("Savings run down evenly within a month, so the final month is counted as a fraction.")
    reached = None if months is None else month_label(start, max(1, math.ceil(months)))
    return {
        "inputs": {
            "savings": savings,
            "monthly_costs": monthly_costs,
            "monthly_income": monthly_income,
            "buffer_months": buffer_months,
            "start": start,
        },
        "assumptions": assumptions,
        "buffer_amount": money(buffer),
        "usable_savings": money(usable),
        "monthly_draw": money(draw),
        "months_until_buffer": months_out(months),
        "buffer_reached_month": reached,
    }


# unit economics


def unit_economics(arpa: float, gross_margin: float, cac: float, churn: float) -> dict:
    require(arpa > 0, "arpa must be more than 0")
    require(0 < gross_margin <= 100, "gross-margin must be more than 0 and at most 100")
    require(cac > 0, "cac must be more than 0")
    require(0 < churn <= 100, "churn must be more than 0 and at most 100")
    margin, rate = gross_margin / 100, churn / 100
    monthly_profit = arpa * margin
    ltv = monthly_profit / rate
    ratio = ltv / cac
    payback = cac / monthly_profit
    notes = []
    if ratio < LTV_CAC_FLOOR:
        notes.append(f"LTV:CAC is {ratio:.2f}, under the 3:1 often cited as healthy.")
    if payback > PAYBACK_CEILING:
        notes.append(f"CAC payback is {payback:.1f} months, over the 12 months often cited as a ceiling.")
    return {
        "inputs": {"arpa": arpa, "gross_margin": gross_margin, "cac": cac, "churn": churn},
        "assumptions": [
            "ARPA, gross margin and churn stay constant for the life of an account.",
            "No expansion revenue, and future revenue is not discounted.",
        ],
        "ltv": money(ltv),
        "ltv_to_cac": round(ratio, 2) + 0.0,
        "cac_payback_months": months_out(payback),
        "customer_lifetime_months": months_out(1 / rate),
        "notes": notes,
    }


# market size


def market_size(accounts: float, annual_price: float, reachable: float = 100.0, win_rate: float = 100.0) -> dict:
    require(accounts > 0, "accounts must be more than 0")
    require(annual_price > 0, "annual-price must be more than 0")
    require(0 < reachable <= 100, "reachable must be more than 0 and at most 100")
    require(0 < win_rate <= 100, "win-rate must be more than 0 and at most 100")
    reach_accounts = accounts * reachable / 100
    won_accounts = reach_accounts * win_rate / 100

    def tier(count: float) -> dict:
        return {"accounts": round(count), "value": money(count * annual_price)}

    return {
        "inputs": {"accounts": accounts, "annual_price": annual_price, "reachable": reachable, "win_rate": win_rate},
        "assumptions": [
            "Every account pays the same annual price.",
            "The win rate applies to the reachable accounts over the period in question.",
        ],
        "total": tier(accounts),
        "reachable": tier(reach_accounts),
        "obtainable": tier(won_accounts),
        "formula": (
            f"total = {accounts:g} accounts x {annual_price:g} a year; "
            f"reachable = total x {reachable:g}%; obtainable = reachable x {win_rate:g}%"
        ),
    }


# round


def _number(value, where: str, *, positive: bool = False, optional: bool = False) -> float | None:
    if value is None and optional:
        return None
    require(isinstance(value, (int, float)) and not isinstance(value, bool), f"{where} must be a number")
    require(value > 0 if positive else value >= 0, f"{where} must be {'more than 0' if positive else '0 or more'}")
    return float(value)


def load_cap_table(path: str) -> dict:
    file = Path(path)
    if not file.is_file():
        raise MissingFile(f"cap table not found: {path}")
    try:
        data = json.loads(file.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise InputError(f"cap table is not valid JSON: {e}") from None
    require(isinstance(data, dict), "cap table must be a JSON object")
    return data


def read_table(data: dict) -> tuple[list, float, float, list]:
    """(holder rows, granted options, unallocated pool, SAFEs) from a cap table."""
    holders = data.get("holders")
    require(isinstance(holders, list) and holders, "cap table needs a non-empty `holders` list")
    rows = []
    for i, h in enumerate(holders):
        require(isinstance(h, dict) and isinstance(h.get("name"), str), f"holders[{i}] needs a `name`")
        rows.append(
            (h["name"], h.get("class", "common"), _number(h.get("shares"), f"holders[{i}].shares", positive=True))
        )
    pool = data.get("options_pool") or {}
    require(isinstance(pool, dict), "`options_pool` must be an object")
    granted = _number(pool.get("granted", 0), "options_pool.granted")
    unallocated = _number(pool.get("unallocated", 0), "options_pool.unallocated")

    safes = []
    for i, s in enumerate(data.get("safes") or []):
        require(isinstance(s, dict) and isinstance(s.get("name"), str), f"safes[{i}] needs a `name`")
        discount = _number(s.get("discount"), f"safes[{i}].discount", optional=True) or 0.0
        require(discount < 100, f"safes[{i}].discount must be under 100")
        safes.append(
            {
                "name": s["name"],
                "amount": _number(s.get("amount"), f"safes[{i}].amount", positive=True),
                "cap": _number(s.get("cap"), f"safes[{i}].cap", positive=True, optional=True),
                "discount": discount,
            }
        )
    return rows, granted, unallocated, safes


def parse_safe(text: str) -> dict:
    """'name:amount[:cap[:discount]]' -> a SAFE entry for the cap table."""
    parts = [part.strip() for part in text.split(":")]
    require(2 <= len(parts) <= 4 and parts[0], f"--safe must look like 'name:amount[:cap[:discount]]': {text!r}")
    entry: dict = {"name": parts[0]}
    for key, value in zip(("amount", "cap", "discount"), parts[1:], strict=False):
        if value:
            try:
                entry[key] = float(value)
            except ValueError:
                raise InputError(f"--safe {parts[0]!r}: {key} must be a number: {value!r}") from None
    return entry


def with_flag_safes(data: dict, specs: list[str] | None) -> dict:
    if specs:
        existing = data.get("safes") or []
        require(isinstance(existing, list), "`safes` must be a list")
        data["safes"] = [*existing, *(parse_safe(spec) for spec in specs)]
    return data


TOO_MUCH = "the SAFEs together claim more than the whole company"


def safes_at_cap(data: dict) -> dict:
    rows, granted, unallocated, safes = read_table(data)
    base = sum(shares for _, _, shares in rows) + granted + unallocated
    capped = [s for s in safes if s["cap"] is not None]
    claimed = sum(s["amount"] / s["cap"] for s in capped)
    require(claimed < 1, TOO_MUCH)
    total = base / (1 - claimed)
    conversions = [(s, s["amount"] / s["cap"] * total) for s in capped]

    table = [(name, cls, shares, shares) for name, cls, shares in rows]
    if granted:
        table.append(("Options granted", "options", granted, granted))
    if unallocated:
        table.append(("Unallocated option pool", "options", unallocated, unallocated))
    table += [(s["name"], "safe", 0.0, shares) for s, shares in conversions]

    assumptions = [
        "Each SAFE is a YC post-money SAFE and owns amount / cap of the company once every SAFE has converted.",
        "Before any priced round: its new money and any option pool top-up dilute everyone further.",
        "Shares are rounded to whole numbers; percentages use unrounded shares.",
    ]
    if any(s["discount"] for s in capped):
        assumptions.append("A discount applies only at a priced round, so it does not change these stakes.")
    unpriced = [s["name"] for s in safes if s["cap"] is None]
    if unpriced:
        assumptions.append("An uncapped SAFE has no price until a priced round, so it is left out here.")

    return {
        "inputs": data,
        "assumptions": assumptions,
        "safes": [
            {
                "name": s["name"],
                "amount": money(s["amount"]),
                "cap": money(s["cap"]),
                "discount": s["discount"],
                "shares": round(shares),
                "percent": pct_out(100 * shares / total),
            }
            for s, shares in conversions
        ],
        "unpriced_safes": unpriced,
        "fully_diluted_before": round(base),
        "fully_diluted_after": round(total),
        "cap_table": [
            {
                "name": name,
                "class": cls,
                "shares_before": round(before),
                "percent_before": pct_out(100 * before / base),
                "shares_after": round(after),
                "percent_after": pct_out(100 * after / total),
            }
            for name, cls, before, after in table
        ],
    }


def run_safes(args: argparse.Namespace) -> dict:
    data = with_flag_safes(load_cap_table(args.cap_table), args.safe)
    result = safes_at_cap(data)
    result["inputs"] = {"cap_table": args.cap_table, **result["inputs"]}
    return result


def priced_round(data: dict) -> dict:
    rows, granted, unallocated, safes = read_table(data)
    terms = data.get("round")
    require(isinstance(terms, dict), "cap table needs a `round` object, or pass --pre-money and --new-money")
    pre = _number(terms.get("pre_money"), "round.pre_money", positive=True)
    new = _number(terms.get("new_money"), "round.new_money")
    target = _number(terms.get("pool_target_post", 0), "round.pool_target_post") / 100
    post = pre + new
    require(
        target < pre / post,
        f"round.pool_target_post must be under the pre-money's share of the post-money ({100 * pre / post:.2f}%)",
    )

    base = sum(shares for _, _, shares in rows) + granted + unallocated

    def post_shares(safe_total: float) -> tuple[float, float]:
        """(post-round fully diluted shares, pool top-up) for a given SAFE total."""
        without_top_up = (base + safe_total) * post / pre
        if unallocated >= target * without_top_up:
            return without_top_up, 0.0
        total = (base + safe_total - unallocated) / (pre / post - target)
        return total, target * total - unallocated

    def convert(safe_total: float, total: float) -> list[tuple[float, float, str]]:
        """(shares, price, basis) for each SAFE."""
        round_price = post / total
        out = []
        for s in safes:
            price, basis = round_price * (1 - s["discount"] / 100), "discount" if s["discount"] else "round"
            if s["cap"] is not None:
                cap_price = s["cap"] / (base + safe_total)
                if cap_price < price:
                    price, basis = cap_price, "cap"
            out.append((s["amount"] / price, price, basis))
        return out

    too_much = TOO_MUCH
    safe_total = 0.0
    for _ in range(SAFE_MAX_ITERATIONS):
        updated = sum(shares for shares, _, _ in convert(safe_total, post_shares(safe_total)[0]))
        require(updated <= SAFE_RUNAWAY * base, too_much)
        done = abs(updated - safe_total) <= SAFE_TOLERANCE * max(1.0, updated)
        safe_total = updated
        if done:
            break
    else:
        raise InputError(too_much)

    total, top_up = post_shares(safe_total)
    conversions = convert(safe_total, total)
    price = post / total
    new_shares = new / price

    table = [(name, cls, shares, shares) for name, cls, shares in rows]
    if granted:
        table.append(("Options granted", "options", granted, granted))
    if unallocated or top_up:
        table.append(("Unallocated option pool", "options", unallocated, unallocated + top_up))
    for s, (shares, _, _) in zip(safes, conversions, strict=True):
        table.append((s["name"], "safe", 0.0, shares))
    if new_shares:
        table.append(("New investors", "preferred", 0.0, new_shares))

    assumptions = [
        "Each SAFE is a YC post-money SAFE; its cap price counts all SAFEs as converted and leaves out this round's pool top-up.",
        "The pool target counts the unallocated pool only, as a share of post-money fully diluted shares.",
        "Shares are rounded to whole numbers; percentages use unrounded shares.",
        "No convertible notes, warrants or other converting securities.",
    ]
    if top_up:
        assumptions.insert(
            1, "The pool top-up is created before the round and counted in the pre-money (the option pool shuffle)."
        )

    return {
        "inputs": data,
        "assumptions": assumptions,
        "price_per_share": round(price, 4) + 0.0,
        "pre_money": money(pre),
        "post_money": money(post),
        "effective_pre_money": money(pre - top_up * price),
        "pool_top_up_shares": round(top_up),
        "pool_top_up_value": money(top_up * price),
        "new_investor_shares": round(new_shares),
        "safes": [
            {
                "name": s["name"],
                "amount": money(s["amount"]),
                "cap": money(s["cap"]),
                "discount": s["discount"],
                "conversion_price": round(conv_price, 4) + 0.0,
                "price_basis": basis,
                "shares": round(shares),
                "percent_after": pct_out(100 * shares / total),
            }
            for s, (shares, conv_price, basis) in zip(safes, conversions, strict=True)
        ],
        "fully_diluted_before": round(base),
        "fully_diluted_after": round(total),
        "cap_table": [
            {
                "name": name,
                "class": cls,
                "shares_before": round(before),
                "percent_before": pct_out(100 * before / base),
                "shares_after": round(after),
                "percent_after": pct_out(100 * after / total),
            }
            for name, cls, before, after in table
        ],
    }


def run_round(args: argparse.Namespace) -> dict:
    data = with_flag_safes(load_cap_table(args.cap_table), args.safe)
    flags = {"pre_money": args.pre_money, "new_money": args.new_money, "pool_target_post": args.pool_target}
    overrides = {key: value for key, value in flags.items() if value is not None}
    if overrides:
        terms = data.get("round") or {}
        require(isinstance(terms, dict), "`round` must be an object")
        data["round"] = {**terms, **overrides}
    result = priced_round(data)
    result["inputs"] = {"cap_table": args.cap_table, **result["inputs"]}
    return result


# model


CSV_COLUMNS = ["month", "revenue", "base_costs", "hires_cost", "one_off", "total_costs", "net", "cash_end"]


def parse_dated(text: str, kind: str) -> tuple[str, str, float]:
    """'name:YYYY-MM:amount' -> (name, month, amount)."""
    parts = text.rsplit(":", 2)
    require(len(parts) == 3 and parts[0].strip(), f"{kind} must look like 'name:YYYY-MM:amount': {text!r}")
    name, month, amount = parts[0].strip(), parts[1].strip(), parts[2].strip()
    parse_month(month)
    try:
        value = float(amount)
    except ValueError:
        raise InputError(f"{kind} {name!r}: amount must be a number: {amount!r}") from None
    return name, month, value


def operating_model(
    cash: float,
    costs: float,
    start: str,
    months: int = 24,
    revenue: float = 0.0,
    revenue_growth: float = 0.0,
    hires: list[str] | None = None,
    expenses: list[str] | None = None,
) -> tuple[dict, list[dict]]:
    """(summary without the path, CSV rows)."""
    require(cash >= 0, "cash must be 0 or more")
    require(costs >= 0, "costs must be 0 or more")
    require(revenue >= 0, "revenue must be 0 or more")
    require(1 <= months <= 1200, "months must be between 1 and 1200")
    parse_month(start)
    rg = growth(revenue_growth, "revenue-growth")
    hire_list = [parse_dated(h, "hire") for h in hires or []]
    for name, _, cost in hire_list:
        require(cost >= 0, f"hire {name!r}: monthly cost must be 0 or more")
    expense_list = [parse_dated(e, "expense") for e in expenses or []]

    assumptions = [
        "Revenue grows at the constant monthly rate from month 2; base costs stay flat.",
        "A hire's monthly cost runs from its start month to the end of the model; an expense is paid once.",
        "Breakeven is the first month from which revenue covers total costs in every remaining month.",
    ]
    for name, month, _ in expense_list:
        if not 1 <= month_index(start, month) <= months:
            assumptions.append(f"Expense {name!r} in {month} falls outside the modeled months and is not counted.")

    rows, nets = [], []
    balance = cash
    zero_month = None
    for i in range(1, months + 1):
        label = month_label(start, i)
        rev = revenue * (1 + rg) ** (i - 1)
        hired = sum(cost for _, month, cost in hire_list if month_index(start, month) <= i)
        one_off = sum(amount for _, month, amount in expense_list if month_index(start, month) == i)
        total = costs + hired + one_off
        net = rev - total
        balance += net
        nets.append(net)
        if zero_month is None and balance <= 0:
            zero_month = label
        values = [rev, costs, hired, one_off, total, net, balance]
        rows.append({"month": label, **dict(zip(CSV_COLUMNS[1:], map(money, values), strict=True))})

    breakeven = None
    for i in range(months, 0, -1):
        if nets[i - 1] < 0:
            break
        breakeven = month_label(start, i)

    summary = {
        "inputs": {
            "cash": cash,
            "costs": costs,
            "start": start,
            "months": months,
            "revenue": revenue,
            "revenue_growth": revenue_growth,
            "hires": hires or [],
            "expenses": expenses or [],
        },
        "assumptions": assumptions,
        "rows": len(rows),
        "zero_cash_month": zero_month,
        "breakeven_month": breakeven,
        "ending_cash": money(balance),
    }
    return summary, rows


def run_model(args: argparse.Namespace) -> dict:
    summary, rows = operating_model(
        args.cash, args.costs, args.start, args.months, args.revenue, args.revenue_growth, args.hire, args.expense
    )
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)
    summary["inputs"]["out"] = args.out
    return {"path": str(out), **summary}


# command line


class Parser(argparse.ArgumentParser):
    def error(self, message: str):
        raise InputError(message)


def build_parser() -> Parser:
    parser = Parser(
        prog="founder_numbers.py",
        description="Founder money arithmetic. Prints JSON. Money is plain numbers in one currency; "
        "percents are numbers, 5 for 5%; months are YYYY-MM.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    def command(name: str, summary: str, **kwargs) -> Parser:
        return sub.add_parser(name, help=summary, description=summary[0].upper() + summary[1:] + ".", **kwargs)

    p = command("runway", "company runway and default alive, simulated month by month")
    p.add_argument("--cash", type=float, required=True, help="cash in the bank now")
    p.add_argument("--costs", type=float, required=True, help="monthly gross costs: net burn plus revenue")
    p.add_argument("--revenue", type=float, default=0.0, help="current monthly revenue (default 0)")
    p.add_argument("--revenue-growth", type=float, default=0.0, help="monthly revenue growth in percent, 5 for 5%%")
    p.add_argument("--cost-growth", type=float, default=0.0, help="monthly cost growth in percent, 5 for 5%%")
    p.add_argument("--start", help="month 1 as YYYY-MM, usually the current month; needed for zero_cash_month")
    p.add_argument("--max-months", type=int, default=60, help="months to simulate (default 60)")
    p.add_argument(
        "--scenario",
        action="append",
        help="repeatable 'name:key=value,...' overriding flags above without dashes, e.g. 'hire:costs=62000'",
    )
    p.set_defaults(func=run_runway)

    p = command("personal-runway", "how long savings last after quitting a job, keeping a buffer")
    p.add_argument("--savings", type=float, required=True, help="personal savings now")
    p.add_argument("--monthly-costs", type=float, required=True, help="personal monthly costs")
    p.add_argument("--monthly-income", type=float, default=0.0, help="monthly side income (default 0)")
    p.add_argument("--buffer-months", type=float, default=0.0, help="months of costs to keep untouched (default 0)")
    p.add_argument("--start", help="month 1 as YYYY-MM, usually the current month; needed for buffer_reached_month")
    p.set_defaults(
        func=lambda a: personal_runway(a.savings, a.monthly_costs, a.monthly_income, a.buffer_months, a.start)
    )

    p = command("unit-economics", "LTV, LTV:CAC and CAC payback")
    p.add_argument("--arpa", type=float, required=True, help="monthly revenue per account")
    p.add_argument("--gross-margin", type=float, required=True, help="gross margin in percent, 80 for 80%%")
    p.add_argument("--cac", type=float, required=True, help="cost to acquire one account")
    p.add_argument("--churn", type=float, required=True, help="monthly churn in percent, 3 for 3%%")
    p.set_defaults(func=lambda a: unit_economics(a.arpa, a.gross_margin, a.cac, a.churn))

    p = command("market-size", "bottom-up market size from accounts times annual price")
    p.add_argument("--accounts", type=float, required=True, help="number of accounts in the market")
    p.add_argument("--annual-price", type=float, required=True, help="price per account per year")
    p.add_argument("--reachable", type=float, default=100.0, help="share reachable in percent (default 100)")
    p.add_argument("--win-rate", type=float, default=100.0, help="share of reachable won in percent (default 100)")
    p.set_defaults(func=lambda a: market_size(a.accounts, a.annual_price, a.reachable, a.win_rate))

    p = command(
        "round",
        "cap table after a priced round with post-money SAFEs converting",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="cap table JSON (options_pool, safes, round optional; SAFE cap and discount optional):\n"
        + CAP_TABLE_SCHEMA,
    )
    p.add_argument("--cap-table", required=True, help="path to the cap table JSON")
    p.add_argument("--pre-money", type=float, help="pre-money valuation; overrides round.pre_money")
    p.add_argument("--new-money", type=float, help="amount raised in this round; overrides round.new_money")
    p.add_argument(
        "--pool-target",
        type=float,
        help="unallocated pool after the round in percent of post-money, 10 for 10%%; overrides round.pool_target_post",
    )
    p.add_argument("--safe", action="append", help=SAFE_HELP)
    p.set_defaults(func=run_round)

    p = command(
        "safes",
        "ownership once post-money SAFEs convert at their caps, before any priced round",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="cap table JSON (options_pool, safes optional; round ignored):\n" + CAP_TABLE_SCHEMA,
    )
    p.add_argument("--cap-table", required=True, help="path to the cap table JSON")
    p.add_argument("--safe", action="append", help=SAFE_HELP)
    p.set_defaults(func=run_safes)

    p = command("model", "monthly operating model with dated hires and one-off costs, written to CSV")
    p.add_argument("--cash", type=float, required=True, help="cash in the bank now")
    p.add_argument("--revenue", type=float, default=0.0, help="current monthly revenue (default 0)")
    p.add_argument("--revenue-growth", type=float, default=0.0, help="monthly revenue growth in percent, 5 for 5%%")
    p.add_argument("--costs", type=float, required=True, help="monthly base costs, flat")
    p.add_argument("--months", type=int, default=24, help="months to model (default 24)")
    p.add_argument("--start", required=True, help="month 1 as YYYY-MM, usually the current month")
    p.add_argument("--hire", action="append", help="repeatable 'role:YYYY-MM:monthly_cost', cost runs from that month")
    p.add_argument("--expense", action="append", help="repeatable 'name:YYYY-MM:amount', paid once in that month")
    p.add_argument("--out", required=True, help="CSV path to write")
    p.set_defaults(func=run_model)
    return parser


def fraction_warnings(args: argparse.Namespace) -> list[str]:
    """A note for each percent flag strictly between 0 and 1."""
    notes = []
    for dest in PERCENT_FLAGS:
        value = getattr(args, dest, None)
        if value is not None and 0 < value < 1:
            flag, meant = dest.replace("_", "-"), f"{100 * value:g}"
            notes.append(f"--{flag} {value:g} is read as {value:g}%; for {meant}% pass {meant}.")
    return notes


def main(argv: list[str] | None = None) -> int:
    try:
        args = build_parser().parse_args(argv)
        result = args.func(args)
        warnings = fraction_warnings(args)
        if warnings:
            result["notes"] = [*warnings, *result.get("notes", [])]
    except MissingFile as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    except InputError as e:
        print(f"error: {e}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
