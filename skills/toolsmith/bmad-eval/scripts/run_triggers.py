#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Trigger evals: does a skill's description fire on each near-miss query?

A trigger query is a should/should-not user message that shares keywords with the skill, so
the description has to discriminate. For each query the runner stages a synthetic skill with
the description under test where the harness reads skills, sends the query through the
harness in a clean room, and checks whether the skill loaded. Each query runs several times
(--runs-per-query) so the rate is stable, not a coin flip.

Detection is a canary, the same on every harness. The synthetic skill's body asks the model
to begin its reply with a token unique to that attempt; the token appearing in what the
harness printed is the load. The skill's name and description never contain the token, so a
harness that lists its discovered skills at startup cannot fake a hit.

A query whose attempts did not all complete (command failed, timed out) is unmeasured, never
passed: a should-not query with no completed attempts would otherwise pass at a rate of zero.

Each attempt keeps prompt.txt, transcript.jsonl (what the harness printed), stderr.txt,
timing.json and cwd/ (the workspace after the run, staged skill included) under
<run-dir>/queries/qNNN-rN/. Harness and clean room are as in run_evals.py.

Usage:
  uv run run_triggers.py --skill-path SKILL_DIR --queries QUERIES.json --output-dir DIR
    [--project-root DIR] [--harness HARNESS.json] [--runs-per-query N] [--threshold 0.5]
    [--timeout SECS] [--workers N] [--quiet]

QUERIES.json is a list of {"query": "...", "should_trigger": true|false}.

Exit 0 when every query was measured, 1 when any attempt failed or the command was not
found, 2 on a usage error, 3 when no harness is recorded. A query failing its threshold is a
result, not an error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from eval_common import (
    DEFAULT_SKILL_DIR,
    account_transcript,
    find_project_root,
    make_run_dir,
    read_json,
    resolve_harness,
    run_in_clean_room,
    utc_now_iso,
    write_json,
)

CANARY_PREFIX = "TRIGGER-LOADED-"


def unquote_yaml(value: str) -> str:
    """A YAML scalar's text: single quotes doubled inside, double quotes with backslash escapes."""
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] == "'":
        return value[1:-1].replace("''", "'")
    if len(value) >= 2 and value[0] == value[-1] == '"':
        return value[1:-1].replace('\\"', '"').replace("\\n", "\n").replace("\\\\", "\\")
    return value


def parse_skill_md(skill_path: Path) -> tuple[str, str]:
    """Return (name, description) from SKILL.md frontmatter, quotes and block indicators removed."""
    text = (skill_path / "SKILL.md").read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not m:
        raise ValueError(f"SKILL.md at {skill_path} is missing frontmatter")
    fields: dict[str, list[str]] = {}
    current = None
    for line in m.group(1).splitlines():
        if line[:1] not in (" ", "\t") and ":" in line:
            key, _, value = line.partition(":")
            current = key.strip()
            fields[current] = [] if value.strip() in ("|", ">", "|-", ">-") else [value.strip()]
        elif current and line.strip():
            fields[current].append(line.strip())
    name = unquote_yaml(" ".join(fields.get("name", [])))
    if not name:
        raise ValueError(f"SKILL.md at {skill_path} has no name")
    return name, unquote_yaml(" ".join(fields.get("description", [])))


# --- synthetic skill and detection -------------------------------------------


def write_synthetic_skill(skills_dir: Path, skill_name: str, description: str, token: str) -> str:
    """Write a skill the harness can discover, carrying the description and the canary. Returns its name."""
    clean_name = f"{skill_name}-trig-{token[len(CANARY_PREFIX) :]}"
    root = skills_dir / clean_name
    root.mkdir(parents=True, exist_ok=True)
    indented = "\n  ".join(description.split("\n"))
    (root / "SKILL.md").write_text(
        f"---\nname: {clean_name}\ndescription: |\n  {indented}\n---\n\n"
        f"# {skill_name}\n\nThis skill handles: {description}\n\n"
        f"Begin your reply with the exact token `{token}`, then continue.\n",
        encoding="utf-8",
    )
    return clean_name


def detect_load(output: str, token: str) -> bool:
    """Did the synthetic skill load? Its canary token in the output says so."""
    return token in output


# --- per-attempt execution ----------------------------------------------------


def run_query_once(
    query: str, skill_name: str, description: str, harness: dict, attempt_dir: Path, timeout: int
) -> tuple[bool | None, str]:
    """One attempt: (loaded, "") when it completed, (None, why) when it did not."""
    token = CANARY_PREFIX + uuid.uuid4().hex[:8]

    def stage(cwd: Path) -> None:
        write_synthetic_skill(cwd / harness.get("skill_dir", DEFAULT_SKILL_DIR), skill_name, description, token)

    run = run_in_clean_room(harness, attempt_dir, query, timeout, stage)
    accounting = account_transcript(run["stdout"])
    loaded = detect_load(run["stdout"], token) if run["status"] == "ok" else None
    write_json(
        attempt_dir / "timing.json",
        {
            "status": run["status"],
            "elapsed_s": run["elapsed_s"],
            "return_code": run["return_code"],
            "loaded": loaded,
            "total_tokens": accounting["total_tokens"],
            "tokens_reported": accounting["tokens_reported"],
            "captured_at": utc_now_iso(),
        },
    )
    if run["status"] != "ok":
        return None, f"{run['status']}: {run['stderr'][-500:].strip()}"
    return loaded, ""


# --- main -------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--skill-path", required=True, type=Path)
    p.add_argument("--queries", required=True, type=Path)
    p.add_argument("--output-dir", required=True, type=Path)
    p.add_argument(
        "--project-root", type=Path, default=None, help="holds _bmad/; found from the skill path when omitted"
    )
    p.add_argument("--harness", type=Path, default=None, help="harness JSON for a project without BMad")
    p.add_argument("--runs-per-query", type=int, default=3)
    p.add_argument("--threshold", type=float, default=0.5)
    p.add_argument("--timeout", type=int, default=180)
    p.add_argument("--workers", type=int, default=4)
    p.add_argument("--quiet", action="store_true")
    args = p.parse_args(argv)

    skill_path = args.skill_path.resolve()
    queries_file = args.queries.resolve()
    if not queries_file.is_file():
        print(f"queries file not found: {queries_file}", file=sys.stderr)
        return 2

    skill_name, description = parse_skill_md(skill_path)
    queries = read_json(queries_file)
    if not isinstance(queries, list):
        print("queries file must be a JSON list", file=sys.stderr)
        return 2

    project_root = args.project_root.resolve() if args.project_root else find_project_root(skill_path)
    try:
        harness, harness_note = resolve_harness(project_root, args.harness)
    except (ValueError, json.JSONDecodeError) as e:
        print(f"harness invalid: {e}", file=sys.stderr)
        return 2

    run_id, run_dir = make_run_dir(args.output_dir, f"{skill_name}-triggers")
    (run_dir / "queries").mkdir(parents=True, exist_ok=True)
    write_json(
        run_dir / "run.json",
        {
            "run_id": run_id,
            "skill_name": skill_name,
            "description": description,
            "harness": harness_note,
            "command": (harness or {}).get("command"),
            "started_at": utc_now_iso(),
            "query_count": len(queries),
            "runs_per_query": args.runs_per_query,
            "threshold": args.threshold,
        },
    )

    if harness is None:
        if not args.quiet:
            print(f"[run_triggers] no harness ({harness_note}); staging only", file=sys.stderr)
        output = {
            "run_id": run_id,
            "completed_at": utc_now_iso(),
            "skill_name": skill_name,
            "description": description,
            "status": "skipped",
            "reason": "no harness recorded",
            "results": [],
            "summary": {"total": len(queries), "passed": 0, "failed": 0, "unmeasured": len(queries)},
        }
        write_json(run_dir / "triggers-result.json", output)
        print(json.dumps(output, indent=2))
        return 3

    def run_one(idx: int, q: dict, run_idx: int) -> tuple[int, bool | None, str]:
        attempt_dir = run_dir / "queries" / f"q{idx:03d}-r{run_idx}"
        try:
            loaded, error = run_query_once(q["query"], skill_name, description, harness, attempt_dir, args.timeout)
        except (OSError, ValueError) as e:
            loaded, error = None, str(e)
        return idx, loaded, error

    attempts: dict[int, list[bool]] = {idx: [] for idx in range(len(queries))}
    errors: dict[int, list[str]] = {idx: [] for idx in range(len(queries))}
    if not args.quiet:
        print(f"[run_triggers] harness: {' '.join(harness['command'])}", file=sys.stderr)
        print(f"[run_triggers] {len(queries)} queries x {args.runs_per_query} runs", file=sys.stderr)

    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = [
            pool.submit(run_one, idx, q, run_idx)
            for idx, q in enumerate(queries)
            for run_idx in range(args.runs_per_query)
        ]
        for fut in as_completed(futures):
            idx, loaded, error = fut.result()
            if loaded is None:
                errors[idx].append(error)
                if not args.quiet:
                    print(f"  attempt failed for query {idx}: {error}", file=sys.stderr)
            else:
                attempts[idx].append(loaded)

    results = []
    for idx, q in enumerate(queries):
        runs = attempts[idx]
        measured = len(runs) == args.runs_per_query
        rate = (sum(runs) / len(runs)) if runs else 0.0
        should = bool(q.get("should_trigger", True))
        passed = ((rate >= args.threshold) if should else (rate < args.threshold)) if measured else None
        results.append(
            {
                "query": q["query"],
                "should_trigger": should,
                "trigger_rate": round(rate, 3),
                "triggers": int(sum(runs)),
                "runs": len(runs),
                "errors": errors[idx],
                "pass": passed,
            }
        )

    unmeasured = sum(1 for r in results if r["pass"] is None)
    output = {
        "run_id": run_id,
        "completed_at": utc_now_iso(),
        "skill_name": skill_name,
        "description": description,
        "harness": harness_note,
        "results": results,
        "summary": {
            "total": len(results),
            "passed": sum(1 for r in results if r["pass"] is True),
            "failed": sum(1 for r in results if r["pass"] is False),
            "unmeasured": unmeasured,
        },
    }
    write_json(run_dir / "triggers-result.json", output)
    print(json.dumps(output, indent=2))
    return 1 if unmeasured else 0


if __name__ == "__main__":
    sys.exit(main())
