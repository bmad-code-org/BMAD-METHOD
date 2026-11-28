#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Run eval cases through the recorded harness.

A case is `input + rubric + optional state_prefix + optional files + optional skills`. Each file is
a path relative to the project root or the cases file, or a GitHub file URL pinned to a ref, or
`{"from": <either>, "to": <workspace path>}` to stage it under another name; absolute paths are
refused and a missing fixture stops the run before it starts. `skills` lists skill folders staged
beside the skill under test, for a skill that hands work to another; the bare config gets none. For each case and
config the runner makes a clean room outside the project, copies the skill under test into
the folder the harness reads skills from, stages the fixtures, runs the harness command once
from the workspace, and records what it printed with timing and token usage. Grading happens
elsewhere, from the transcript and artifacts left behind.

Modes (--mode) decide which configs each case runs under:

  quality  : one config, "skill", the skill staged in the workspace.
  baseline : "skill" and "bare" (nothing staged), same input, so the bare-model floor is
             measured under identical conditions.
  variant  : "skill" (--skill-path) and "variant" (--variant-path).

Run layout: <run-dir>/<config>/<case-id>/ (plus /run-N/ when --runs > 1), each holding
prompt.txt, transcript.jsonl, stderr.txt, timing.json and cwd/ (the workspace after the run),
so `aggregate_benchmark.py --baseline <run-dir>/bare --variant <run-dir>/skill` compares
configs from the timing.json files.

Harness: `[workflow.harness]` in this skill's customization, read through the project's
resolver; `--harness <json>` with the same keys for a project without BMad. The keys and the
clean room are described in eval_common.py. Without a harness the runner stages every case,
records each as skipped and exits 3.

Usage:
  uv run run_evals.py --cases CASES.json --skill-path SKILL_DIR --output-dir DIR
    [--mode quality|baseline|variant] [--variant-path SKILL_DIR] [--project-root DIR]
    [--harness HARNESS.json | --harness-name NAME ...] [--case-ids A1,B3] [--runs N] [--timeout SECS]
    [--workers N] [--label NAME] [--quiet]

CASES.json is a list of cases or {"cases": [...]}. Each case:
  {"id": "...", "input": "...", "rubric": [...], "state_prefix": "..."?, "files": ["..." | {"from", "to"}]?,
   "skills": ["<skill folder>"]?}

Exit 0 when every run completed, 1 when any run errored or timed out or the command was
not found, 2 on a usage error, 3 when no harness is recorded.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote, unquote

from eval_common import (
    DEFAULT_SKILL_DIR,
    account_transcript,
    add_harness_args,
    contained,
    find_project_root,
    make_run_dir,
    read_json,
    resolve_harness,
    run_each_harness,
    run_in_clean_room,
    safe_name,
    utc_now_iso,
    write_json,
)

FAILURE_STATUSES = ("error", "timeout", "exception", "harness-missing")

# --- staging: skill under test + fixtures ------------------------------------


def stage_skill(skill_path: Path, cwd: Path, skills_subdir: str) -> Path:
    """Copy the skill where the harness discovers skills inside the workspace.

    A copy, not a symlink: a run that edits its staged skill must not touch the source or
    the other cases. A skill's own `evals/` stays behind, so the run never sees its rubric.
    """
    dest = cwd / skills_subdir / skill_path.name
    skip = shutil.ignore_patterns("__pycache__", ".git")

    def ignore(folder: str, names: list[str]) -> set[str]:
        return skip(folder, names) | ({"evals"} if Path(folder) == skill_path else set())

    shutil.copytree(skill_path, dest, dirs_exist_ok=True, ignore=ignore)
    return dest


GITHUB_FILE = re.compile(r"^https://github\.com/(?P<owner>[^/]+)/(?P<repo>[^/]+)/blob/(?P<ref>[^/]+)/(?P<path>.+)$")


def fixture_entry(entry: object) -> tuple[str, str | None]:
    """A `files` entry as (source, explicit destination or None)."""
    if isinstance(entry, dict):
        return (
            "" if entry.get("from") is None else str(entry["from"]),
            "" if entry.get("to") is None else str(entry["to"]),
        )
    return str(entry), None


def is_machine_path(path: str) -> bool:
    return path.startswith(("~", "/", "\\")) or bool(Path(path).anchor) or bool(re.match(r"^[A-Za-z]:", path))


def fixture_problems(files: list, project_root: Path, cases_dir: Path) -> list[str]:
    """Why each `files` entry cannot be staged on any machine, checked before anything runs.

    An entry is a path relative to the project root or the cases file's folder, or a GitHub
    file URL, optionally as `{"from", "to"}`. An absolute or home path is refused: it names one
    person's machine.
    """
    problems, dests = [], {}
    for raw in files or []:
        entry, to = fixture_entry(raw)
        if to is not None and (not entry or not to):
            problems.append(f"{raw}: a renamed fixture needs both `from` and `to`")
            continue
        if to is not None and (is_machine_path(to) or ".." in Path(to).parts):
            problems.append(f"{raw}: `to` must be a path inside the workspace")
            continue
        m = GITHUB_FILE.match(entry)
        dest = Path(to or (Path(unquote(m["path"])).name if m else entry)).as_posix()
        if dest in dests:
            problems.append(f"{entry}: lands at {dest}, as {dests[dest]} does; one would replace the other")
        dests.setdefault(dest, entry)
        if m:
            if ".." in Path(unquote(m["path"])).parts or ".." in unquote(m["ref"]):
                problems.append(f"{entry}: a GitHub fixture path cannot contain '..'")
            continue
        if "://" in entry:
            problems.append(
                f"{entry}: a URL fixture must be a GitHub file URL, https://github.com/<owner>/<repo>/blob/<ref>/<path>"
            )
        elif is_machine_path(entry):
            problems.append(
                f"{entry}: absolute paths break on other machines; use a path relative to the project root "
                "or the cases file, or a GitHub file URL pinned to a commit"
            )
        elif not any((root / entry).resolve().is_file() for root in (project_root, cases_dir)):
            problems.append(f"{entry}: not found under {project_root} or {cases_dir}")
    return problems


def fetch_github(m: re.Match, into: Path) -> Path:
    """Download one GitHub file at its ref through `gh`, so private repos work too."""
    path = unquote(m["path"])
    api = f"repos/{m['owner']}/{m['repo']}/contents/{quote(path)}?ref={quote(unquote(m['ref']), safe='')}"
    data = subprocess.run(
        ["gh", "api", "-H", "Accept: application/vnd.github.raw", api], capture_output=True, check=True, timeout=60
    ).stdout
    dest = contained(into, f"{m['owner']}/{m['repo']}/{unquote(m['ref'])}/{path}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return dest


def resolve_fixtures(files: list, project_root: Path, cases_dir: Path, fetch_dir: Path) -> list[tuple[Path, str]]:
    """Map each `files` entry to (source, dest-relative-path).

    A relative entry keeps its own path inside the workspace, so a bare filename lands at its
    root and a nested path keeps its directory structure, matching the path the case input
    references. A GitHub file lands at the workspace root under its file name.
    """
    out: list[tuple[Path, str]] = []
    for raw in files or []:
        entry, to = fixture_entry(raw)
        m = GITHUB_FILE.match(entry)
        if m:
            out.append((fetch_github(m, fetch_dir), to or Path(unquote(m["path"])).name))
            continue
        src = next((root / entry).resolve() for root in (project_root, cases_dir) if (root / entry).resolve().is_file())
        out.append((src, to or entry))
    return out


def companion_skills(
    skills: list,
    project_root: Path,
    cases_dir: Path,
    reserved_names: dict[str, str] | None = None,
) -> tuple[list[Path], list[str]]:
    """Each `skills` entry as a skill folder, and why any cannot be staged."""
    found, problems, seen_names = [], [], {}
    for entry in map(str, skills or []):
        if is_machine_path(entry) or ".." in Path(entry).parts:
            problems.append(f"{entry}: a companion skill must be a path relative to the project root or the cases file")
            continue
        folder = next(
            ((root / entry).resolve() for root in (project_root, cases_dir) if (root / entry / "SKILL.md").is_file()),
            None,
        )
        if folder is None:
            problems.append(f"{entry}: no SKILL.md under {project_root} or {cases_dir}")
        elif reserved_names and folder.name in reserved_names:
            problems.append(
                f"{entry}: companion skill folder name `{folder.name}` collides with {reserved_names[folder.name]}"
            )
        elif folder.name in seen_names:
            problems.append(
                f"{entry}: companion skill folder name `{folder.name}` collides with {seen_names[folder.name]}"
            )
        else:
            seen_names[folder.name] = entry
            found.append(folder)
    return found, problems


def stage_fixtures(fixtures: list[tuple[Path, str]], cwd: Path) -> None:
    for src, dest_rel in fixtures:
        dest = contained(cwd, dest_rel)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)


def compose_prompt(case: dict) -> str:
    """Prepend the state_prefix, a bracketed prime that places the skill mid-workflow."""
    input_text = str(case.get("input", ""))
    prefix = case.get("state_prefix")
    if prefix:
        return f"{str(prefix).rstrip()}\n\n{input_text}"
    return input_text


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
    companions: list[Path] = (),
) -> dict:
    case_id = str(case.get("id", "unnamed"))
    case_dir.mkdir(parents=True, exist_ok=True)
    prompt = compose_prompt(case)
    write_json(case_dir / "case.json", case)

    def timing(status: str, **extra: object) -> None:
        write_json(case_dir / "timing.json", {"case_id": case_id, "config": config, "status": status, **extra})

    def result(status: str, **extra: object) -> dict:
        return {
            "case_id": case_id,
            "config": config,
            "status": status,
            "case_dir": str(case_dir.relative_to(run_dir)),
            **extra,
        }

    def stage(cwd: Path) -> None:
        stage_fixtures(fixtures, cwd)
        if skill_path is not None:
            skills_subdir = (harness or {}).get("skill_dir", DEFAULT_SKILL_DIR)
            stage_skill(skill_path, cwd, skills_subdir)
            for companion in companions:
                stage_skill(companion, cwd, skills_subdir)

    if harness is None:
        (case_dir / "prompt.txt").write_text(prompt, encoding="utf-8")
        try:
            stage(case_dir / "cwd")
        except ValueError as e:
            timing("error", reason=str(e), captured_at=utc_now_iso())
            return result("error", reason=str(e))
        timing("skipped", captured_at=utc_now_iso())
        return result("skipped", reason="no harness recorded", prompt_chars=len(prompt))

    try:
        run = run_in_clean_room(harness, case_dir, prompt, timeout, stage)
    except ValueError as e:
        timing("error", reason=str(e), captured_at=utc_now_iso())
        return result("error", reason=str(e))

    accounting = account_transcript(run["stdout"])
    timing(
        run["status"],
        elapsed_s=run["elapsed_s"],
        return_code=run["return_code"],
        input_tokens=accounting["input_tokens"],
        output_tokens=accounting["output_tokens"],
        total_tokens=accounting["total_tokens"],
        tokens_reported=accounting["tokens_reported"],
        total_steps=accounting["total_steps"],
        total_tool_calls=accounting["total_tool_calls"],
        captured_at=utc_now_iso(),
    )
    return result(
        run["status"],
        elapsed_s=run["elapsed_s"],
        return_code=run["return_code"],
        tokens=accounting["total_tokens"],
        tool_calls=accounting["tool_calls"],
        error_tail=run["stderr"][-2000:],
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
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter, allow_abbrev=False
    )
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
    add_harness_args(p)
    p.add_argument("--case-ids", default=None, help="comma-separated subset of case ids to run")
    p.add_argument("--runs", type=int, default=1, help="repeats per case per config for the variance benchmark")
    p.add_argument("--timeout", type=int, default=600)
    p.add_argument("--workers", type=int, default=4)
    p.add_argument("--label", default="evals", help="label for the run id")
    p.add_argument("--quiet", action="store_true")
    args = p.parse_args(argv)
    if len(args.harness_name) > 1:
        return run_each_harness(main, list(sys.argv[1:] if argv is None else argv), args.harness_name)
    if args.harness and args.harness_name:
        print("pass --harness or --harness-name, not both", file=sys.stderr)
        return 2
    harness_name = args.harness_name[0] if args.harness_name else None

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
        harness, harness_note = resolve_harness(project_root, args.harness, harness_name)
    except (ValueError, json.JSONDecodeError) as e:
        print(f"harness invalid: {e}", file=sys.stderr)
        return 2

    reserved = {skill_path.name: f"the skill under test ({skill_path.name})"}
    if variant_path is not None:
        reserved.setdefault(variant_path.name, f"the variant skill ({variant_path.name})")
    companions = {
        id(c): companion_skills(c.get("skills", []), fixture_root, cases_file.parent, reserved) for c in cases
    }
    problems = [
        f"case {c.get('id')}: {x}"
        for c in cases
        for x in [*fixture_problems(c.get("files", []), fixture_root, cases_file.parent), *companions[id(c)][1]]
    ]
    if problems:
        print("fixtures cannot be staged:\n  " + "\n  ".join(problems), file=sys.stderr)
        return 2

    run_id, run_dir = make_run_dir(
        args.output_dir, safe_name(args.label + (f"-{harness_name}" if harness_name else ""))
    )
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
            "started_at": utc_now_iso(),
            "case_count": len(cases),
        },
    )

    if not args.quiet:
        if harness is None:
            print(f"[run_evals] no harness ({harness_note}); staging cases only", file=sys.stderr)
        else:
            print(f"[run_evals] harness: {' '.join(harness['command'])}", file=sys.stderr)
        print(
            f"[run_evals] {len(cases)} cases x {len(configs)} configs x {args.runs} runs, "
            f"mode={args.mode}, run_dir={run_dir}",
            file=sys.stderr,
        )

    fixtures: dict[int, list[tuple[Path, str]]] = {}
    try:
        for c in cases:
            fixtures[id(c)] = resolve_fixtures(
                c.get("files", []), fixture_root, cases_file.parent, run_dir / "fixtures"
            )
    except (subprocess.SubprocessError, OSError) as e:
        detail = getattr(e, "stderr", b"") or b""
        print(f"could not fetch a GitHub fixture: {e} {detail.decode(errors='replace').strip()}", file=sys.stderr)
        return 2

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
                fixtures[id(c)],
                companions[id(c)][0],
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
