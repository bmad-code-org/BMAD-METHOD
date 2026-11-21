#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""Trigger matrix: with every skill of an install staged at once, which one does each query load?

A trigger eval asks whether one skill fires on its own. The matrix asks which skill wins when
all of them are installed, so two descriptions that claim the same request show up as a skill
loading in another's place.

Every SKILL.md under each --skills folder is staged under its own name with its real
description and a body holding a canary unique to that skill and attempt. A canary in what the
harness printed means that skill loaded. Bodies are replaced, so a loaded skill does no work.

A query passes when at least --threshold of its runs loaded its expected skill or one named in
`also_ok` (with `expect` null, nothing outside `also_ok`), and no other skill loaded in that
share of runs. Folders linked into a --skills folder are followed, as tool folders link skills. A
query whose attempts did not all complete is unmeasured, never passed.

Each attempt keeps prompt.txt, transcript.jsonl, stderr.txt, timing.json and cwd/ under
<run-dir>/queries/qNNN-rN/. Harness and clean room are as in run_evals.py.

Usage:
  uv run run_matrix.py --skills DIR [--skills DIR ...] --queries MATRIX.json --output-dir DIR
    [--project-root DIR] [--harness HARNESS.json | --harness-name NAME ...] [--runs-per-query N] [--threshold 0.5]
    [--timeout SECS] [--workers N] [--quiet]

MATRIX.json is a list of {"query": "...", "expect": "<skill name>" | null, "also_ok": ["<name>", ...]}.

Output, also written to matrix-result.json: each query with every skill that loaded and its
rate, and `confusion`, which for each expected skill counts the queries where another skill
loaded in its place, and `missed` the queries that failed with no other skill taking them.

Exit 0 when every query was measured, 1 when any attempt failed, 2 on a usage error, 3 when no
harness is recorded. A failing query is a result, not an error. With several --harness-name, it runs
once per name and prints {"harnesses": {name: result}}, exiting with the worst code.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from eval_common import (
    DEFAULT_SKILL_DIR,
    account_transcript,
    add_harness_args,
    find_project_root,
    make_run_dir,
    read_json,
    resolve_harness,
    run_each_harness,
    run_in_clean_room,
    utc_now_iso,
    write_json,
)
from run_triggers import frontmatter, parse_skill_md

CANARY_PREFIX = "ROUTED-"
NAME_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9._-]*")
NONE = "(none)"


def skill_folders(root: Path) -> list[Path]:
    """Folders holding a SKILL.md under root, following linked folders (tool folders link each skill)."""
    found, seen = [], set()
    for folder, dirs, files in os.walk(root, followlinks=True):
        real = os.path.realpath(folder)
        if real in seen:
            dirs[:] = []
            continue
        seen.add(real)
        if "SKILL.md" in files:
            found.append(Path(folder))
    return sorted(found)


def discover(roots: list[Path]) -> dict[str, str]:
    """Every skill under the roots, name to description; a name found twice is a usage error."""
    skills: dict[str, str] = {}
    origin: dict[str, str] = {}
    for root in roots:
        folders = skill_folders(root)
        for folder in folders:
            if any(other in folder.parents for other in folders):
                continue  # a sample inside a skill's assets is not installed
            name, description = parse_skill_md(folder)
            if not NAME_RE.fullmatch(name):
                raise ValueError(f"{folder}: skill name {name!r} is not a plain folder name")
            if name in skills:
                if origin[name] == os.path.realpath(folder):
                    continue  # the same skill reached through two folders
                raise ValueError(f"two skills are named {name!r}; stage one install at a time")
            skills[name], origin[name] = description, os.path.realpath(folder)
    if not skills:
        raise ValueError("no SKILL.md under " + ", ".join(str(r) for r in roots))
    return skills


def read_queries(path: Path, skills: dict[str, str]) -> list[dict]:
    queries = read_json(path)
    if not isinstance(queries, list):
        raise ValueError("the queries file must be a JSON list")
    for i, q in enumerate(queries):
        if not isinstance(q, dict) or not isinstance(q.get("query"), str) or "expect" not in q:
            raise ValueError(f"query {i} needs a `query` string and an `expect` (a skill name or null)")
        for name in [q["expect"], *q.get("also_ok", [])]:
            if name is not None and name not in skills:
                raise ValueError(f"query {i} names {name!r}, which is not among the staged skills")
    return queries


def stage_all(skills_dir: Path, skills: dict[str, str]) -> dict[str, str]:
    """Stage every skill with its own canary; returns canary to skill name."""
    canaries = {}
    for name, description in skills.items():
        token = CANARY_PREFIX + uuid.uuid4().hex[:10]
        canaries[token] = name
        root = skills_dir / name
        root.mkdir(parents=True, exist_ok=True)
        (root / "SKILL.md").write_text(
            frontmatter.dump({"name": name, "description": description}) + "\n"
            f"Reply with only the exact token `{token}` and stop.\n",
            encoding="utf-8",
        )
    return canaries


def loaded_skills(output: str, canaries: dict[str, str]) -> list[str]:
    return sorted(name for token, name in canaries.items() if token in output)


def score(query: dict, runs: list[list[str]], expected_runs: int, threshold: float) -> dict:
    """One query's result from the skills each completed run loaded.

    A run is acceptable when it loaded a skill the query allows (or, with `expect` null, nothing
    else). The query passes when enough runs are acceptable and no other skill reaches the
    threshold; that skill is `stolen_by`. Rates are compared unrounded.
    """
    counts: dict[str, int] = {}
    for loaded in runs:
        for name in loaded:
            counts[name] = counts.get(name, 0) + 1
    ok = {query["expect"], *query.get("also_ok", [])} - {None}
    total = len(runs)
    if query["expect"] is None:
        acceptable = sum(1 for loaded in runs if set(loaded) <= ok)
    else:
        acceptable = sum(1 for loaded in runs if set(loaded) & ok)
    stolen_by = sorted(n for n, c in counts.items() if n not in ok and total and c / total >= threshold)
    measured = total == expected_runs and total > 0
    passed = (acceptable / total >= threshold and not stolen_by) if measured else None
    return {
        "query": query["query"],
        "expect": query["expect"],
        "also_ok": query.get("also_ok", []),
        "loaded": {n: round(c / total, 3) for n, c in sorted(counts.items())},
        "runs": total,
        "pass": passed,
        "stolen_by": stolen_by,
    }


def confusion(results: list[dict]) -> dict[str, dict[str, int]]:
    """For each expected skill, how often another skill loaded in its place, or none did."""
    table: dict[str, dict[str, int]] = {}
    for r in results:
        if r["pass"] is not False:
            continue
        row = table.setdefault(r["expect"] or NONE, {})
        for name in r["stolen_by"]:
            row[name] = row.get(name, 0) + 1
        if not r["stolen_by"]:
            row["missed"] = row.get("missed", 0) + 1
    return table


def run_once(query: str, skills: dict[str, str], harness: dict, attempt_dir: Path, timeout: int):
    """One attempt: (skills loaded, "") when it completed, (None, why) when it did not."""
    canaries: dict[str, str] = {}

    def stage(cwd: Path) -> None:
        canaries.update(stage_all(cwd / harness.get("skill_dir", DEFAULT_SKILL_DIR), skills))

    run = run_in_clean_room(harness, attempt_dir, query, timeout, stage)
    loaded = loaded_skills(run["stdout"], canaries) if run["status"] == "ok" else None
    accounting = account_transcript(run["stdout"])
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
    if loaded is None:
        return None, f"{run['status']}: {run['stderr'][-500:].strip()}"
    return loaded, ""


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter, allow_abbrev=False
    )
    p.add_argument("--skills", required=True, type=Path, action="append", help="a folder of skills; repeatable")
    p.add_argument("--queries", required=True, type=Path)
    p.add_argument("--output-dir", required=True, type=Path)
    p.add_argument("--project-root", type=Path, default=None, help="holds _bmad/; found from --skills when omitted")
    add_harness_args(p)
    p.add_argument("--runs-per-query", type=int, default=3)
    p.add_argument("--threshold", type=float, default=0.5)
    p.add_argument("--timeout", type=int, default=180)
    p.add_argument("--workers", type=int, default=4)
    p.add_argument("--quiet", action="store_true")
    args = p.parse_args(argv)
    if args.runs_per_query < 1:
        print("--runs-per-query must be at least 1", file=sys.stderr)
        return 2
    if len(args.harness_name) > 1:
        return run_each_harness(main, list(sys.argv[1:] if argv is None else argv), args.harness_name)
    if args.harness and args.harness_name:
        print("pass --harness or --harness-name, not both", file=sys.stderr)
        return 2
    harness_name = args.harness_name[0] if args.harness_name else None

    try:
        skills = discover([root.resolve() for root in args.skills])
        queries = read_queries(args.queries.resolve(), skills)
    except (OSError, ValueError, json.JSONDecodeError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2

    project_root = args.project_root.resolve() if args.project_root else find_project_root(args.skills[0].resolve())
    try:
        harness, harness_note = resolve_harness(project_root, args.harness, harness_name)
    except (ValueError, json.JSONDecodeError) as e:
        print(f"harness invalid: {e}", file=sys.stderr)
        return 2

    run_id, run_dir = make_run_dir(args.output_dir, "trigger-matrix" + (f"-{harness_name}" if harness_name else ""))
    (run_dir / "queries").mkdir(parents=True, exist_ok=True)
    write_json(
        run_dir / "run.json",
        {
            "run_id": run_id,
            "skills": sorted(skills),
            "harness": harness_note,
            "command": (harness or {}).get("command"),
            "started_at": utc_now_iso(),
            "query_count": len(queries),
            "runs_per_query": args.runs_per_query,
            "threshold": args.threshold,
        },
    )
    if harness is None:
        print(json.dumps({"run_id": run_id, "status": "skipped", "reason": harness_note}, indent=2))
        return 3

    runs: dict[int, list[list[str]]] = {i: [] for i in range(len(queries))}
    errors: dict[int, list[str]] = {i: [] for i in range(len(queries))}
    if not args.quiet:
        print(
            f"[run_matrix] {len(skills)} skills, {len(queries)} queries x {args.runs_per_query} runs", file=sys.stderr
        )

    def attempt(i: int, r: int):
        try:
            return i, *run_once(
                queries[i]["query"], skills, harness, run_dir / "queries" / f"q{i:03d}-r{r}", args.timeout
            )
        except (OSError, ValueError) as e:
            return i, None, str(e)

    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        futures = [pool.submit(attempt, i, r) for i in range(len(queries)) for r in range(args.runs_per_query)]
        for fut in as_completed(futures):
            i, loaded, error = fut.result()
            if loaded is None:
                errors[i].append(error)
                if not args.quiet:
                    print(f"  attempt failed for query {i}: {error}", file=sys.stderr)
            else:
                runs[i].append(loaded)

    results = []
    for i, q in enumerate(queries):
        result = score(q, runs[i], args.runs_per_query, args.threshold)
        result["errors"] = errors[i]
        results.append(result)
    unmeasured = sum(1 for r in results if r["pass"] is None)
    output = {
        "run_id": run_id,
        "completed_at": utc_now_iso(),
        "harness": harness_note,
        "skills": len(skills),
        "results": results,
        "confusion": confusion(results),
        "summary": {
            "total": len(results),
            "passed": sum(1 for r in results if r["pass"] is True),
            "failed": sum(1 for r in results if r["pass"] is False),
            "unmeasured": unmeasured,
        },
    }
    write_json(run_dir / "matrix-result.json", output)
    print(json.dumps(output, indent=2))
    return 1 if unmeasured else 0


if __name__ == "__main__":
    sys.exit(main())
