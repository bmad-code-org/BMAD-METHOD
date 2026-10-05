#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Run eval cases through the recorded harness.

A case is `input + rubric + optional state_prefix + optional files`. For each case and
config the runner builds a clean working directory, copies the skill under test into the
folder the harness reads skills from, stages the fixtures, runs the harness command once
from that directory, and records what it printed with timing and token usage. Grading
happens elsewhere, from the transcript and artifacts left behind.

Modes (--mode) decide which configs each case runs under:

  quality  : one config, "skill", the skill staged in the cwd.
  baseline : "skill" and "bare" (nothing staged), same input, so the bare-model floor is
             measured under identical conditions.
  variant  : "skill" (--skill-path) and "variant" (--variant-path).

Run layout: <run-dir>/<config>/<case-id>/ (plus /run-N/ when --runs > 1), so
`aggregate_benchmark.py --baseline <run-dir>/bare --variant <run-dir>/skill` compares
configs from the timing.json files.

Harness: `[workflow.harness]` in this skill's customization, read through the project's
resolver; `--harness <json>` with the same keys for a project without BMad. Its `command`
is the argv of one non-interactive run with "{prompt}" and "{cwd}" filled in, prefixed by
`sandbox` when that is set. Without a harness the runner stages every case, records each
as skipped and exits 3.

Isolation: the subprocess environment is built from scratch: PATH, a fresh empty HOME at
<case>/.home, each `home_env` var pointed inside it, `auth_env` only when the host has it
set, and `env_passthrough`. Containment beyond that is the `sandbox` prefix; the run
records whether one was used.

Usage:
  uv run run_evals.py --cases CASES.json --skill-path SKILL_DIR --output-dir DIR
    [--mode quality|baseline|variant] [--variant-path SKILL_DIR] [--project-root DIR]
    [--harness HARNESS.json] [--case-ids A1,B3] [--runs N] [--timeout SECS]
    [--workers N] [--label NAME] [--quiet]

CASES.json is a list of cases or {"cases": [...]}. Each case:
  {"id": "...", "input": "...", "rubric": [...], "state_prefix": "..."?, "files": ["..."]?}

Exit 0 when every run completed, 1 when any run errored or timed out or the command was
not found, 2 on a usage error, 3 when no harness is recorded.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from eval_common import (
    DEFAULT_SKILL_DIR,
    build_argv,
    build_case_env,
    contained,
    find_project_root,
    make_home,
    make_run_dir,
    read_json,
    resolve_harness,
    safe_name,
    utc_now_iso,
    write_json,
)

FAILURE_STATUSES = ("error", "timeout", "exception", "harness-missing")

# --- staging: skill under test + fixtures ------------------------------------


def stage_skill(skill_path: Path, cwd: Path, skills_subdir: str) -> Path:
    """Copy the skill where the harness discovers skills inside the cwd.

    A copy, not a symlink: a run that edits its staged skill must not touch the source or
    the other cases.
    """
    dest = cwd / skills_subdir / skill_path.name
    shutil.copytree(skill_path, dest, dirs_exist_ok=True, ignore=shutil.ignore_patterns("__pycache__", ".git"))
    return dest


def resolve_fixtures(files: list, project_root: Path, cases_dir: Path) -> list[tuple[Path, str]]:
    """Map each `files` entry to (source, dest-relative-path).

    The entry's own relative path is preserved inside the cwd, so a bare filename lands at
    the workspace root and a nested path keeps its directory structure, matching the path
    the case input references.
    """
    out: list[tuple[Path, str]] = []
    for entry in files or []:
        entry = str(entry)
        for candidate in (
            (project_root / entry).resolve(),
            (cases_dir / entry).resolve(),
            Path(entry).resolve(),
        ):
            if candidate.is_file():
                out.append((candidate, entry))
                break
        else:
            print(f"Warning: fixture not found: {entry}", file=sys.stderr)
    return out


def stage_fixtures(fixtures: list[tuple[Path, str]], cwd: Path) -> None:
    for src, dest_rel in fixtures:
        dest = contained(cwd, dest_rel)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)


# --- case composition -------------------------------------------------------


def compose_prompt(case: dict) -> str:
    """Prepend the state_prefix, a bracketed prime that places the skill mid-workflow."""
    input_text = str(case.get("input", ""))
    prefix = case.get("state_prefix")
    if prefix:
        return f"{str(prefix).rstrip()}\n\n{input_text}"
    return input_text


# --- transcript + token accounting -----------------------------------------


def account_transcript(transcript_text: str) -> dict:
    """Best-effort usage from what the harness printed.

    When the output is line-delimited JSON with usage blocks on assistant or result events,
    tokens and tool calls are counted; anything else degrades to zero counts with
    `tokens_reported` false, and elapsed time is the metric.
    """
    input_tokens = 0
    output_tokens = 0
    total_steps = 0
    tool_calls: dict[str, int] = {}
    found_usage = False

    for raw in transcript_text.splitlines():
        raw = raw.strip()
        if not raw:
            continue
        try:
            evt = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if not isinstance(evt, dict):
            continue
        etype = evt.get("type")
        if etype == "assistant":
            total_steps += 1
            msg = evt.get("message", {})
            usage = msg.get("usage") if isinstance(msg, dict) else None
            if isinstance(usage, dict):
                found_usage = True
                input_tokens += int(usage.get("input_tokens", 0) or 0)
                output_tokens += int(usage.get("output_tokens", 0) or 0)
            for item in msg.get("content", []) if isinstance(msg, dict) else []:
                if isinstance(item, dict) and item.get("type") == "tool_use":
                    name = item.get("name", "?")
                    tool_calls[name] = tool_calls.get(name, 0) + 1
        elif etype == "result":
            usage = evt.get("usage")
            if isinstance(usage, dict):
                found_usage = True
                input_tokens = int(usage.get("input_tokens", input_tokens) or input_tokens)
                output_tokens = int(usage.get("output_tokens", output_tokens) or output_tokens)

    return {
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens,
        "tokens_reported": found_usage,
        "total_steps": total_steps,
        "tool_calls": tool_calls,
        "total_tool_calls": sum(tool_calls.values()),
    }


# --- per-case execution -----------------------------------------------------


def run_case(
    case: dict,
    case_dir: Path,
    run_dir: Path,
    harness: dict | None,
    timeout: int,
    config: str,
    skill_path: Path | None,
    fixtures: list[tuple[Path, str]],
) -> dict:
    case_id = str(case.get("id", "unnamed"))
    cwd = case_dir / "cwd"
    cwd.mkdir(parents=True, exist_ok=True)

    def timing(status: str, **extra: object) -> None:
        write_json(case_dir / "timing.json", {"case_id": case_id, "config": config, "status": status, **extra})

    def result(status: str, **extra: object) -> dict:
        return {"case_id": case_id, "config": config, "status": status, "cwd": str(cwd.relative_to(run_dir)), **extra}

    try:
        stage_fixtures(fixtures, cwd)
    except ValueError as e:
        timing("error", reason=str(e), captured_at=utc_now_iso())
        return result("error", reason=str(e))
    if skill_path is not None:
        stage_skill(skill_path, cwd, (harness or {}).get("skill_dir", DEFAULT_SKILL_DIR))

    prompt = compose_prompt(case)
    (case_dir / "prompt.txt").write_text(prompt, encoding="utf-8")
    write_json(case_dir / "case.json", case)

    if harness is None:
        timing("skipped", captured_at=utc_now_iso())
        return result("skipped", reason="no harness recorded", prompt_chars=len(prompt))

    argv = build_argv(harness, prompt, str(cwd))
    env = build_case_env(harness, make_home(harness, case_dir), os.environ)

    start = time.time()
    captured = b""
    return_code = 0
    error_tail = ""
    status = "ok"
    try:
        proc = subprocess.run(argv, capture_output=True, cwd=str(cwd), env=env, timeout=timeout)
        captured = proc.stdout or b""
        return_code = proc.returncode
        error_tail = (proc.stderr or b"").decode("utf-8", errors="replace")[-2000:]
        if return_code != 0:
            status = "error"
    except FileNotFoundError as e:
        timing("harness-missing", elapsed_s=round(time.time() - start, 3), captured_at=utc_now_iso())
        return result("harness-missing", reason=f"command not found: {e}")
    except subprocess.TimeoutExpired as e:
        captured = e.stdout or b""
        return_code = -1
        status = "timeout"
        error_tail = f"TIMEOUT after {timeout}s"
    elapsed = time.time() - start

    transcript_text = captured.decode("utf-8", errors="replace")
    transcript_path = case_dir / "transcript.jsonl"
    transcript_path.write_text(transcript_text, encoding="utf-8")
    accounting = account_transcript(transcript_text)

    timing(
        status,
        elapsed_s=round(elapsed, 3),
        return_code=return_code,
        input_tokens=accounting["input_tokens"],
        output_tokens=accounting["output_tokens"],
        total_tokens=accounting["total_tokens"],
        tokens_reported=accounting["tokens_reported"],
        total_steps=accounting["total_steps"],
        total_tool_calls=accounting["total_tool_calls"],
        captured_at=utc_now_iso(),
    )
    return result(
        status,
        elapsed_s=round(elapsed, 3),
        return_code=return_code,
        transcript=str(transcript_path.relative_to(run_dir)),
        tokens=accounting["total_tokens"],
        tool_calls=accounting["tool_calls"],
        error_tail=error_tail,
    )


# --- main -------------------------------------------------------------------


def load_cases(cases_file: Path) -> list[dict]:
    data = read_json(cases_file)
    if isinstance(data, dict) and "cases" in data:
        cases = data["cases"]
    elif isinstance(data, list):
        cases = data
    else:
        raise ValueError("cases file must be a list or {'cases': [...]}")
    if not isinstance(cases, list):
        raise ValueError("'cases' must be a list")
    return cases


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--cases", required=True, type=Path)
    p.add_argument("--skill-path", required=True, type=Path, help="the skill under test (holds SKILL.md)")
    p.add_argument("--output-dir", required=True, type=Path)
    p.add_argument("--mode", choices=("quality", "baseline", "variant"), default="quality")
    p.add_argument("--variant-path", type=Path, default=None, help="variant mode: the stripped or prior skill")
    p.add_argument(
        "--project-root",
        type=Path,
        default=None,
        help="holds _bmad/ and anchors fixture paths; found from the skill path when omitted",
    )
    p.add_argument("--harness", type=Path, default=None, help="harness JSON for a project without BMad")
    p.add_argument("--case-ids", default=None, help="comma-separated subset of case ids to run")
    p.add_argument("--runs", type=int, default=1, help="repeats per case per config for the variance benchmark")
    p.add_argument("--timeout", type=int, default=600)
    p.add_argument("--workers", type=int, default=4)
    p.add_argument("--label", default="evals", help="label for the run id")
    p.add_argument("--quiet", action="store_true")
    args = p.parse_args(argv)

    cases_file = args.cases.resolve()
    if not cases_file.is_file():
        print(f"cases file not found: {cases_file}", file=sys.stderr)
        return 2

    skill_path = args.skill_path.resolve()
    if not (skill_path / "SKILL.md").is_file():
        print(f"skill path has no SKILL.md: {skill_path}", file=sys.stderr)
        return 2

    if args.mode == "variant":
        if args.variant_path is None:
            print("--mode variant requires --variant-path", file=sys.stderr)
            return 2
        variant_path = args.variant_path.resolve()
        if not (variant_path / "SKILL.md").is_file():
            print(f"variant path has no SKILL.md: {variant_path}", file=sys.stderr)
            return 2
    else:
        variant_path = None

    project_root = args.project_root.resolve() if args.project_root else find_project_root(skill_path)
    fixture_root = project_root or cases_file.parent

    if args.mode == "baseline":
        configs: list[tuple[str, Path | None]] = [("skill", skill_path), ("bare", None)]
    elif args.mode == "variant":
        configs = [("skill", skill_path), ("variant", variant_path)]
    else:
        configs = [("skill", skill_path)]

    cases = load_cases(cases_file)
    if args.case_ids:
        wanted = {x.strip() for x in args.case_ids.split(",") if x.strip()}
        cases = [c for c in cases if str(c.get("id")) in wanted]

    try:
        harness, harness_note = resolve_harness(project_root, args.harness)
    except (ValueError, json.JSONDecodeError) as e:
        print(f"harness invalid: {e}", file=sys.stderr)
        return 2

    run_id, run_dir = make_run_dir(args.output_dir, safe_name(args.label))
    write_json(
        run_dir / "run.json",
        {
            "run_id": run_id,
            "cases_file": str(cases_file),
            "skill_path": str(skill_path),
            "variant_path": str(variant_path) if variant_path else None,
            "mode": args.mode,
            "configs": [name for name, _ in configs],
            "runs_per_case": args.runs,
            "harness": harness_note,
            "command": (harness or {}).get("command"),
            "contained": bool((harness or {}).get("sandbox")),
            "started_at": utc_now_iso(),
            "case_count": len(cases),
        },
    )

    if not args.quiet:
        if harness is None:
            print(f"[run_evals] no harness ({harness_note}); staging cases only", file=sys.stderr)
        else:
            contained_note = "contained by sandbox" if harness.get("sandbox") else "not contained"
            print(f"[run_evals] harness: {' '.join(harness['command'])} ({contained_note})", file=sys.stderr)
        print(
            f"[run_evals] {len(cases)} cases x {len(configs)} configs x {args.runs} runs, "
            f"mode={args.mode}, run_dir={run_dir}",
            file=sys.stderr,
        )

    jobs: list[tuple[str, dict, Path, Path | None]] = []
    for config_name, config_skill in configs:
        for c in cases:
            base = run_dir / config_name / safe_name(c.get("id", "unnamed"))
            for i in range(max(1, args.runs)):
                case_dir = base / f"run-{i + 1}" if args.runs > 1 else base
                jobs.append((config_name, c, case_dir, config_skill))

    results: list[dict] = []
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        fut_to_case = {
            pool.submit(
                run_case,
                c,
                case_dir,
                run_dir,
                harness,
                int(c.get("timeout", args.timeout)),
                config_name,
                config_skill,
                resolve_fixtures(c.get("files", []), fixture_root, cases_file.parent),
            ): c
            for config_name, c, case_dir, config_skill in jobs
        }
        for fut in as_completed(fut_to_case):
            c = fut_to_case[fut]
            try:
                res = fut.result()
            except Exception as e:
                res = {"case_id": str(c.get("id")), "status": "exception", "reason": str(e)}
            results.append(res)
            if not args.quiet:
                print(
                    f"  [{res.get('status')}] {res.get('config', '?')}/{res.get('case_id')} "
                    f"({res.get('elapsed_s', 0)}s)",
                    file=sys.stderr,
                )

    failures = sum(1 for r in results if r.get("status") in FAILURE_STATUSES)
    summary = {
        "run_id": run_id,
        "completed_at": utc_now_iso(),
        "mode": args.mode,
        "harness": harness_note,
        "contained": bool((harness or {}).get("sandbox")),
        "total": len(jobs),
        "executed": sum(1 for r in results if r.get("status") == "ok"),
        "skipped": sum(1 for r in results if r.get("status") == "skipped"),
        "failures": failures,
        "run_dir": str(run_dir),
        "results": results,
    }
    write_json(run_dir / "execution-summary.json", summary)
    print(json.dumps(summary, indent=2))
    if harness is None:
        return 3
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
