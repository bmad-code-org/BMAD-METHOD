#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Convert eval cases between the skill-creator and the runner formats.

skill-creator's evals.json:
  {"skill_name": "...", "evals": [{"id": 1, "prompt": "...", "expected_output": "...",
                                   "files": [...], "expectations": [...]}]}

The runner's cases.json:
  [{"id": "1", "input": "...", "rubric": [...], "state_prefix": null, "files": [...]}]

Toward the runner, `expected_output` lands at the end of the rubric as
"output matches: <text>". Toward skill-creator, that rubric line becomes
`expected_output` again and a numeric id becomes an int.

Usage:
  uv run convert_cases.py EVALS.json [--to runner|skill-creator] [--output OUT.json]
         [--skill-name NAME]

Without --output the result goes to stdout.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

OUTPUT_PREFIX = "output matches: "


def to_runner(data: dict) -> list[dict]:
    cases = []
    for ev in data.get("evals", []):
        rubric = [str(e) for e in ev.get("expectations", [])]
        expected = ev.get("expected_output")
        if expected:
            rubric.append(f"{OUTPUT_PREFIX}{expected}")
        cases.append(
            {
                "id": str(ev["id"]),
                "input": ev.get("prompt", ""),
                "rubric": rubric,
                "state_prefix": None,
                "files": list(ev.get("files", [])),
            }
        )
    return cases


def to_skill_creator(cases: list[dict], skill_name: str) -> dict:
    evals = []
    for case in cases:
        raw_id = str(case["id"])
        expectations = []
        expected_output = ""
        for item in case.get("rubric", []):
            text = str(item)
            if text.startswith(OUTPUT_PREFIX) and not expected_output:
                expected_output = text[len(OUTPUT_PREFIX) :]
            else:
                expectations.append(text)
        evals.append(
            {
                "id": int(raw_id) if raw_id.isdigit() else raw_id,
                "prompt": case.get("input", ""),
                "expected_output": expected_output,
                "files": list(case.get("files", [])),
                "expectations": expectations,
            }
        )
    return {"skill_name": skill_name, "evals": evals}


def load_cases(data: object) -> list[dict]:
    if isinstance(data, dict) and "cases" in data:
        data = data["cases"]
    if not isinstance(data, list):
        raise ValueError("runner cases must be a list or {'cases': [...]}")
    return data


def default_skill_name(path: Path) -> str:
    # <skill>/evals/cases.json names the skill two levels up.
    parent = path.resolve().parent
    return parent.parent.name if parent.name == "evals" else parent.name


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("input", type=Path, help="evals.json (skill-creator) or cases.json (runner)")
    p.add_argument("--to", choices=("runner", "skill-creator"), default="runner")
    p.add_argument("--output", type=Path, default=None, help="write here instead of stdout")
    p.add_argument("--skill-name", default=None, help="skill_name for --to skill-creator")
    args = p.parse_args(argv)

    data = json.loads(args.input.read_text(encoding="utf-8"))
    if args.to == "runner":
        if not isinstance(data, dict) or "evals" not in data:
            print("error: skill-creator input must be an object with an 'evals' list", file=sys.stderr)
            return 2
        result: object = to_runner(data)
    else:
        result = to_skill_creator(load_cases(data), args.skill_name or default_skill_name(args.input))

    text = json.dumps(result, indent=2, ensure_ascii=False) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
