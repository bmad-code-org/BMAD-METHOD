#!/usr/bin/env python3
"""
BMAD YOLO (Cursor CLI)

Automates a full "draft -> build -> test -> review -> status update -> handoff notes"
development loop for one or more BMAD stories using Cursor's `cursor-agent` CLI.

Supports:
- Default: resume first unfinished story that has YOLO logs; else run first backlog story
- Force first backlog story (--first-backlog)
- Run a specific story by ID (--story)
- List backlog stories (--list-backlog)
- Interactive backlog selection (--pick)
- Batch run multiple stories sequentially (--batch)

Logs:
- Writes Markdown logs to: docs/sprint-artifacts/yolo-logs/<story-id>/<step>.md
- On failure/timeout/Ctrl+C writes: <step>_ERROR.md

Exit codes:
- 0 success
- 1 usage / input error
- 2 runtime failure (cursor-agent failure, missing YAML, etc.)
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional

import yaml


# ---------------------------
# Defaults / paths
# ---------------------------

DEFAULT_SPRINT_STATUS_PATH = Path("docs/sprint-artifacts/sprint-status.yaml")
DEFAULT_LOGS_ROOT = Path("docs/sprint-artifacts/yolo-logs")

# YAML key(s) seen in the wild
DEV_STATUS_KEYS = ("development_status", "development-status")

# Matches story IDs like "2-4-user-login-frontend"
STORY_ID_PATTERN = re.compile(r"^\d+-\d+-")

# Step filenames like "07-dev-run-tests-fix.md"
STEP_FILENAME_PATTERN = re.compile(r"^(?P<num>\d{2})-(?P<slug>.+)\.md$")

# Global behavior
HEARTBEAT_SECONDS = 60
STEP_TIMEOUT_SECONDS = 10 * 60  # 10 minutes

# Validation phrases for optional "apply recommendations" step
APPLY_ENHANCEMENTS_REGEX = re.compile(r"Apply the \[\d+\] enhancements to the story file\?")
APPLY_CHOICE_ENDING = "Your choice:"
APPLY_DONE_PHRASE = "All changes have been applied."


# ---------------------------
# Data model
# ---------------------------

@dataclass(frozen=True)
class RunResult:
    story_id: str
    ok: bool
    steps_completed: List[str]
    failed_step: Optional[str]
    error: Optional[str]
    logs_dir: str


# ---------------------------
# Cursor runner
# ---------------------------

def require_cursor_agent() -> None:
    """Ensures 'cursor-agent' is available on PATH."""
    if shutil.which("cursor-agent") is None:
        raise RuntimeError(
            "cursor-agent not found on PATH. Install Cursor and ensure the 'cursor-agent' "
            "CLI is available before running this script."
        )


def run_cursor_agent(
    prompt: str,
    *,
    heartbeat_seconds: int = HEARTBEAT_SECONDS,
    timeout_seconds: int = STEP_TIMEOUT_SECONDS,
) -> str:
    """
    Run Cursor Agent once in headless mode, returning final text output.

    Adds:
    - Heartbeats every `heartbeat_seconds`
    - Hard timeout after `timeout_seconds`
    - On Ctrl+C: kills cursor-agent and re-raises KeyboardInterrupt
    """
    print(f"\n[cursor-agent] Running prompt:\n{prompt}\n", flush=True)

    cmd = ["cursor-agent", "-p", "--force", "--output-format", "text", prompt]

    start = time.time()
    last_beat = start

    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.DEVNULL,
        text=True,
        encoding="utf-8",
    )

    try:
        while True:
            now = time.time()

            # finished?
            rc = proc.poll()
            if rc is not None:
                break

            # heartbeat
            if now - last_beat >= heartbeat_seconds:
                elapsed = int(now - start)
                print(f"[cursor-agent] ...still running ({elapsed}s elapsed)", flush=True)
                last_beat = now

            # timeout
            if timeout_seconds and (now - start) > timeout_seconds:
                try:
                    proc.kill()
                finally:
                    out, err = proc.communicate()
                raise TimeoutError(
                    f"cursor-agent timed out after {timeout_seconds}s.\n\n"
                    f"Last stdout tail:\n{(out or '')[-2000:]}\n\n"
                    f"Last stderr tail:\n{(err or '')[-2000:]}\n"
                )

            time.sleep(0.5)

        out, err = proc.communicate()

    except KeyboardInterrupt:
        try:
            proc.kill()
        except Exception:
            pass
        raise

    if err and err.strip():
        print("[cursor-agent stderr]:", file=sys.stderr)
        print(err, file=sys.stderr)

    if proc.returncode != 0:
        raise RuntimeError(f"cursor-agent failed with code {proc.returncode}")

    return (out or "").strip()


# ---------------------------
# YAML helpers
# ---------------------------

def load_yaml(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"Cannot find YAML file: {path}")

    raw = path.read_text(encoding="utf-8")
    data = yaml.safe_load(raw)
    if data is None:
        return {}
    if not isinstance(data, dict):
        raise RuntimeError(f"Expected a YAML mapping at top-level in {path}")
    return data


def get_development_status_map(data: dict) -> dict:
    for key in DEV_STATUS_KEYS:
        val = data.get(key)
        if isinstance(val, dict):
            return val
    return {}


def list_backlog_story_ids(dev_status: dict) -> List[str]:
    """Returns all story IDs in backlog state in file order."""
    backlog: List[str] = []
    for story_id, status in dev_status.items():
        if not isinstance(story_id, str):
            continue
        if not STORY_ID_PATTERN.match(story_id):
            continue
        if str(status).strip().lower() == "backlog":
            backlog.append(story_id)
    return backlog


def find_first_backlog_story_id(dev_status: dict) -> str:
    """Finds the first backlog story ID in file order."""
    for story_id, status in dev_status.items():
        if not isinstance(story_id, str):
            continue
        if STORY_ID_PATTERN.match(story_id) and str(status).strip().lower() == "backlog":
            return story_id
    raise RuntimeError(f"No backlog story found in any of: {', '.join(DEV_STATUS_KEYS)}")


# ---------------------------
# Logging helpers
# ---------------------------

def write_md(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def format_seconds(seconds: float) -> str:
    seconds = max(0.0, seconds)
    if seconds < 60:
        return f"{seconds:.1f}s"
    mins = int(seconds // 60)
    rem = seconds - mins * 60
    return f"{mins}m {rem:.1f}s"


def save_step_log(
    log_dir: Path,
    step_slug: str,
    prompt: str,
    output: str,
    *,
    duration_seconds: float,
) -> None:
    """Store a Markdown log with prompt, output, and timing."""
    md: List[str] = []
    md.append(f"# {step_slug}\n\n")
    md.append(f"- Duration: **{format_seconds(duration_seconds)}**\n\n")
    md.append("## Prompt\n\n")
    md.append("```text\n" + prompt.strip() + "\n```\n\n")
    md.append("## Output\n\n")
    md.append("```text\n" + (output.strip() if output else "") + "\n```\n")
    write_md(log_dir / f"{step_slug}.md", "".join(md))


def save_step_error_log(
    log_dir: Path,
    step_slug: str,
    prompt: str,
    error: BaseException,
    *,
    duration_seconds: float,
) -> None:
    """Writes a useful error log named '<step>_ERROR.md'."""
    name = f"{step_slug}_ERROR"
    md: List[str] = []
    md.append(f"# {name}\n\n")
    md.append(f"- Duration before failure: **{format_seconds(duration_seconds)}**\n\n")
    md.append("## Prompt\n\n")
    md.append("```text\n" + prompt.strip() + "\n```\n\n")
    md.append("## Error\n\n")
    md.append(f"- Type: `{type(error).__name__}`\n")
    md.append("```text\n" + str(error) + "\n```\n")
    write_md(log_dir / f"{name}.md", "".join(md))


def extract_output_from_step_log(path: Path) -> str:
    """
    Extracts the 'Output' fenced block from our step log format.
    Best-effort; returns entire file if parsing fails.
    """
    text = path.read_text(encoding="utf-8")
    marker = "## Output"
    idx = text.find(marker)
    if idx == -1:
        return text
    after = text[idx:]
    fence = "```text"
    fidx = after.find(fence)
    if fidx == -1:
        return text
    after2 = after[fidx + len(fence):]
    endf = after2.find("```")
    if endf == -1:
        return after2.strip()
    return after2[:endf].strip()


def get_last_completed_step_number(log_dir: Path) -> int:
    """
    Looks for existing successful step logs and returns the highest step number found.
    - Ignores *_ERROR.md
    - Treats any '<NN>-*.md' as completed
    """
    if not log_dir.exists():
        return 0

    max_num = 0
    for p in log_dir.iterdir():
        if not p.is_file():
            continue
        if p.name.endswith("_ERROR.md"):
            continue
        m = STEP_FILENAME_PATTERN.match(p.name)
        if not m:
            continue
        try:
            n = int(m.group("num"))
            max_num = max(max_num, n)
        except ValueError:
            continue
    return max_num


# ---------------------------
# Resume-first selection helper (NO hardcoded step count)
# ---------------------------

def find_first_resumable_story_id(dev_status: dict, logs_root: Path) -> Optional[str]:
    """
    Resume-first logic:
    - Iterate stories in YAML order.
    - Pick the first story that:
        * matches STORY_ID_PATTERN
        * status is NOT "done" (per sprint-status.yaml)
        * has an existing logs folder with at least one successful step log
    """
    for story_id, status in dev_status.items():
        if not isinstance(story_id, str):
            continue
        if not STORY_ID_PATTERN.match(story_id):
            continue

        status_str = str(status).strip().lower()
        if status_str == "done":
            continue

        log_dir = logs_root / story_id
        last_completed = get_last_completed_step_number(log_dir)
        if last_completed > 0:
            return story_id

    return None


# ---------------------------
# CLI selection
# ---------------------------

def parse_selection(selection: str, max_index: int) -> List[int]:
    """Parse '1,3,5-7' -> [1,3,5,6,7]."""
    indices: List[int] = []
    parts = [p.strip() for p in selection.split(",") if p.strip()]
    if not parts:
        raise ValueError("Empty selection")

    for part in parts:
        if "-" in part:
            a, b = part.split("-", 1)
            if not a.isdigit() or not b.isdigit():
                raise ValueError(f"Invalid range: {part}")
            start, end = int(a), int(b)
            if start < 1 or end < 1 or start > end or end > max_index:
                raise ValueError(f"Range out of bounds: {part} (1..{max_index})")
            indices.extend(range(start, end + 1))
        else:
            if not part.isdigit():
                raise ValueError(f"Invalid index: {part}")
            idx = int(part)
            if idx < 1 or idx > max_index:
                raise ValueError(f"Index out of bounds: {idx} (1..{max_index})")
            indices.append(idx)

    seen = set()
    out: List[int] = []
    for i in indices:
        if i not in seen:
            seen.add(i)
            out.append(i)
    return out


def interactive_pick(backlog: List[str]) -> List[str]:
    if not backlog:
        raise RuntimeError("No backlog stories available to pick from.")

    print("\nBacklog stories:\n")
    for i, sid in enumerate(backlog, start=1):
        print(f"  {i}. {sid}")
    print("")

    while True:
        choice = input("Pick stories (e.g. 1,3,5-7 | 'all' | 'q'): ").strip().lower()
        if choice in {"q", "quit", "exit"}:
            print("Exiting.")
            sys.exit(0)
        if choice in {"all", "*"}:
            return backlog
        try:
            idxs = parse_selection(choice, len(backlog))
            picked = [backlog[i - 1] for i in idxs]
            print("\nSelected:")
            for sid in picked:
                print(f"  - {sid}")
            confirm = input("\nProceed? [y/N]: ").strip().lower()
            if confirm == "y":
                return picked
        except ValueError as e:
            print(f"Invalid selection: {e}\n")


# ---------------------------
# YOLO flow (Cursor-only)
# ---------------------------

def run_yolo_for_story(
    story_id: str,
    logs_root: Path,
    *,
    atdd_checklist_filename: Optional[str] = None,
) -> RunResult:
    """Run the multi-step YOLO development flow for one story ID (with resume + timeouts)."""
    require_cursor_agent()

    log_dir = logs_root / story_id
    log_dir.mkdir(parents=True, exist_ok=True)

    last_completed_num = get_last_completed_step_number(log_dir)
    if last_completed_num > 0:
        print(
            f"\n[resume] Found existing logs for {story_id}. "
            f"Last completed step: {last_completed_num:02d}. Resuming after it.\n",
            flush=True,
        )

    steps_completed: List[str] = []

    def step(step_num: int, step_slug: str, prompt: str) -> str:
        """
        Runs a step unless resuming past it.
        On failure/timeout/Ctrl+C, writes '<step>_ERROR.md' and re-raises.
        """
        if step_num <= last_completed_num:
            steps_completed.append(step_slug)
            print(f"[resume] Skipping {step_slug} (already completed).", flush=True)
            return ""

        t0 = time.time()
        try:
            out = run_cursor_agent(prompt, heartbeat_seconds=HEARTBEAT_SECONDS, timeout_seconds=STEP_TIMEOUT_SECONDS)
            duration = time.time() - t0
            save_step_log(log_dir, step_slug, prompt, out, duration_seconds=duration)
            steps_completed.append(step_slug)
            return out
        except BaseException as e:
            duration = time.time() - t0
            save_step_error_log(log_dir, step_slug, prompt, e, duration_seconds=duration)
            raise

    try:
        # 01
        step(1, "01-sm-create-story", f"@sm *create-story {story_id}")

        # 02
        validate_out = ""
        if 2 <= last_completed_num:
            validate_path = log_dir / "02-sm-validate-create-story.md"
            if validate_path.exists():
                validate_out = extract_output_from_step_log(validate_path)
        else:
            validate_out = step(
                2,
                "02-sm-validate-create-story",
                f"@sm *validate-create-story {story_id} and apply all recommended improvements",
            )

        # 03 (conditional)
        needs_apply = (
            bool(validate_out)
            and APPLY_ENHANCEMENTS_REGEX.search(validate_out) is not None
            and validate_out.rstrip().endswith(APPLY_CHOICE_ENDING)
        )

        if needs_apply:
            apply_out = step(3, "03-sm-apply-recommendations", f"@sm apply recommendations for {story_id}")
            if 3 > last_completed_num and APPLY_DONE_PHRASE not in apply_out:
                raise RuntimeError(f'Apply recommendations did not confirm: "{APPLY_DONE_PHRASE}"')
        else:
            if 3 > last_completed_num:
                save_step_log(
                    log_dir,
                    "03-sm-apply-recommendations",
                    "(skipped)",
                    "No enhancements prompt detected; apply step skipped.",
                    duration_seconds=0.0,
                )
                steps_completed.append("03-sm-apply-recommendations")
            else:
                steps_completed.append("03-sm-apply-recommendations")
                print("[resume] Skipping 03-sm-apply-recommendations (already completed).", flush=True)

        # 04
        step(4, "04-tea-atdd", f"@tea *atdd {story_id}")

        # 05
        step(5, "05-dev-develop-story", f"@dev *develop-story {story_id}")

        # 06
        checklist_file = atdd_checklist_filename or f"atdd-checklist-{story_id}.md"
        step(6, "06-dev-atdd-checklist", f"@dev verify and check all tasks in {checklist_file}")

        # 07
        step(7, "07-dev-run-tests-fix", "@dev run all tests (e2e and unit tests) and fix all issues")

        # 08
        step(8, "08-dev-code-review-round-1", f"@dev *code-review {story_id} and fix automatically")

        # 09
        step(9, "09-dev-code-review-round-2", f"@dev *code-review {story_id} and fix automatically")

        # 10
        step(10, "10-dev-run-tests-fix-after-review", "@dev run all tests (e2e and unit tests) and fix all issues")

        # 11
        step(11, "11-sm-update-status", f"@sm update the story {story_id} development status")

        # 12
        step(
            12,
            "12-dev-final-notes",
            f"@dev what do I need to know about the last story implemented {story_id}? "
            f"anything I need to know, or run locally, or test?",
        )

        return RunResult(
            story_id=story_id,
            ok=True,
            steps_completed=steps_completed,
            failed_step=None,
            error=None,
            logs_dir=str(log_dir),
        )

    except Exception as e:
        return RunResult(
            story_id=story_id,
            ok=False,
            steps_completed=steps_completed,
            failed_step=steps_completed[-1] if steps_completed else None,
            error=str(e),
            logs_dir=str(log_dir),
        )


# ---------------------------
# Main
# ---------------------------

def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="yolo_cursor.py",
        description="Run BMAD YOLO development workflow using Cursor CLI (cursor-agent).",
    )
    p.add_argument(
        "--sprint-status",
        default=str(DEFAULT_SPRINT_STATUS_PATH),
        help="Path to sprint-status.yaml (default: docs/sprint-artifacts/sprint-status.yaml)",
    )
    p.add_argument(
        "--logs-root",
        default=str(DEFAULT_LOGS_ROOT),
        help="Root folder for logs (default: docs/sprint-artifacts/yolo-logs)",
    )

    g = p.add_mutually_exclusive_group()
    g.add_argument("--story", help="Run a specific story by ID (e.g. 2-4-user-login-frontend)")
    g.add_argument("--first-backlog", action="store_true", help="Run the first backlog story (skip resume)")
    g.add_argument("--list-backlog", action="store_true", help="List backlog stories and exit")
    g.add_argument("--pick", action="store_true", help="Interactively pick backlog stories to run")

    p.add_argument(
        "--batch",
        help="Comma-separated list of story IDs to run in order. Example: 2-4-foo,2-5-bar",
    )
    p.add_argument(
        "--atdd-checklist-file",
        default=None,
        help="Override checklist filename used in the Dev checklist step (default: atdd-checklist-<story>.md)",
    )
    return p


def main() -> None:
    parser = build_arg_parser()
    args = parser.parse_args()

    sprint_status_path = Path(args.sprint_status)
    logs_root = Path(args.logs_root)

    data = load_yaml(sprint_status_path)
    dev_status = get_development_status_map(data)

    if not dev_status:
        print(
            f"ERROR: Could not find a development status map under any of {DEV_STATUS_KEYS} "
            f"in {sprint_status_path}",
            file=sys.stderr,
        )
        sys.exit(2)

    backlog = list_backlog_story_ids(dev_status)

    if args.list_backlog:
        for sid in backlog:
            print(sid)
        sys.exit(0)

    to_run: List[str] = []

    if args.batch:
        to_run = [s.strip() for s in args.batch.split(",") if s.strip()]
    elif args.story:
        to_run = [args.story.strip()]
    elif args.pick:
        to_run = interactive_pick(backlog)
    elif args.first_backlog:
        # Explicitly skip resume behavior
        try:
            to_run = [find_first_backlog_story_id(dev_status)]
        except RuntimeError as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(2)
    else:
        # Default behavior:
        # 1) Resume first unfinished story that already has logs (status != done)
        # 2) Else run first backlog story
        try:
            resumable = find_first_resumable_story_id(dev_status, logs_root)
            if resumable:
                to_run = [resumable]
            else:
                to_run = [find_first_backlog_story_id(dev_status)]
        except RuntimeError as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(2)

    results: List[RunResult] = []
    for sid in to_run:
        print("\n" + "=" * 90)
        print(f"YOLO: {sid}")
        print("=" * 90)
        res = run_yolo_for_story(sid, logs_root, atdd_checklist_filename=args.atdd_checklist_file)
        results.append(res)
        if not res.ok:
            break

    summary = {
        "ok": all(r.ok for r in results),
        "results": [
            {
                "story_id": r.story_id,
                "ok": r.ok,
                "steps_completed": r.steps_completed,
                "failed_step": r.failed_step,
                "error": r.error,
                "logs_dir": r.logs_dir,
            }
            for r in results
        ],
    }
    print("\n=== YOLO SUMMARY (json) ===")
    print(json.dumps(summary, indent=2))

    sys.exit(0 if summary["ok"] else 2)


if __name__ == "__main__":
    main()
