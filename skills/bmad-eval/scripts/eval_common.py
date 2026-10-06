#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""What run_evals.py and run_triggers.py share: the harness, the clean room, containment, run folders.

The harness is the agent CLI the evals run through, described by four keys the model that first
runs an eval records in this skill's customization (`[workflow.harness]`):

  command     argv for one non-interactive run; "{prompt}" is the input, "{cwd}" the workspace.
  skill_dir   the folder under the workspace the CLI reads skills from.
  env         env vars for the run: a value is set as given, with "~" meaning the fresh HOME;
              an empty value forwards the host's value when it has one.
  home_files  files or folders under the host home brought into the fresh HOME at the same
              path, so a CLI logged in through a file or keychain stays logged in.

The runners read them through the project's customization resolver, or from `--harness <json>`
for a project without BMad. A run happens in a clean room: a temporary folder outside the
project holding the workspace and the fresh HOME, so the project's instruction files and
installed skills are not ancestors of the run. The workspace is copied back afterwards.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from collections.abc import Callable, Mapping
from datetime import UTC, datetime
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
HARNESS_KEY = "workflow.harness"
DEFAULT_SKILL_DIR = ".agents/skills"
SAFE_NAME_RE = re.compile(r"[^A-Za-z0-9._-]+")
# A subprocess on Windows cannot start without these; nothing else crosses uninvited.
PLATFORM_ENV = ("SYSTEMROOT", "COMSPEC", "PATHEXT", "TEMP", "TMP") if sys.platform == "win32" else ()


def utc_now_iso() -> str:
    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def write_json(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def read_json(path: Path) -> object:
    return json.loads(path.read_text(encoding="utf-8"))


def find_project_root(start: Path) -> Path | None:
    """Nearest ancestor holding `_bmad/`, else the nearest holding `.git`."""
    git_root = None
    current = start.resolve()
    while True:
        if (current / "_bmad").is_dir():
            return current
        if git_root is None and (current / ".git").exists():
            git_root = current
        if current.parent == current:
            return git_root
        current = current.parent


# --- harness -----------------------------------------------------------------


def validate_harness(harness: object) -> dict:
    if not isinstance(harness, dict):
        raise ValueError("harness must be a table")
    command = harness.get("command")
    if not isinstance(command, list) or not command or not all(isinstance(t, str) for t in command):
        raise ValueError("harness.command must be a non-empty list of strings")
    if not any("{prompt}" in t for t in command):
        raise ValueError("harness.command needs a {prompt} token")
    if not isinstance(harness.get("skill_dir", DEFAULT_SKILL_DIR), str):
        raise ValueError("harness.skill_dir must be a string")
    env = harness.get("env", {})
    if not isinstance(env, dict) or not all(isinstance(v, str) for v in env.values()):
        raise ValueError('harness.env is a table of var = "value" ("" forwards the host value, "~" is the fresh HOME)')
    if not isinstance(harness.get("home_files", []), list):
        raise ValueError("harness.home_files must be a list")
    return harness


def resolve_harness(project_root: Path | None, explicit: Path | None) -> tuple[dict | None, str]:
    """The harness table and where it came from; (None, why) when there is none.

    The runner never reads the override files itself: the project's resolver merges the layers.
    """
    if explicit is not None:
        if not explicit.is_file():
            return None, f"harness file not found: {explicit}"
        return validate_harness(read_json(explicit)), str(explicit)
    if project_root is None:
        return None, "no project root"
    resolver = project_root / "_bmad" / "scripts" / "resolve_customization.py"
    if not resolver.is_file():
        return None, "BMad is not set up in this project; pass --harness"
    argv = [sys.executable, str(resolver), "--skill", str(SKILL_ROOT), "--project-root", str(project_root)]
    proc = subprocess.run([*argv, "--key", HARNESS_KEY], capture_output=True, text=True)
    if proc.returncode != 0:
        return None, f"customization resolver failed: {proc.stderr.strip()[-300:]}"
    harness = json.loads(proc.stdout or "{}").get(HARNESS_KEY)
    if not isinstance(harness, dict) or not harness.get("command"):
        return None, "no harness recorded in bmad-eval's customization"
    return validate_harness(harness), f"customization {HARNESS_KEY}"


def build_argv(harness: Mapping, prompt: str, cwd: str) -> list[str]:
    """The command with its placeholders filled."""
    return [
        str(t).replace("{prompt}", prompt).replace("{query}", prompt).replace("{cwd}", cwd) for t in harness["command"]
    ]


def build_case_env(harness: Mapping | None, home_dir: Path, host_env: Mapping[str, str]) -> dict[str, str]:
    """The subprocess environment, built from scratch, never from os.environ.

    PATH, the fresh HOME (and USERPROFILE on Windows), then the harness's `env`: a value is set
    as given with "~" expanded to the fresh HOME; an empty value forwards the host's value when
    the host has one set non-empty, and is left out otherwise, since an empty credential would
    override the CLI's own login.
    """
    env = {"PATH": host_env.get("PATH", ""), "HOME": str(home_dir)}
    if sys.platform == "win32":
        env["USERPROFILE"] = str(home_dir)
    for name in PLATFORM_ENV:
        if name in host_env:
            env[name] = host_env[name]
    for name, value in ((harness or {}).get("env") or {}).items():
        if value == "":
            if host_env.get(str(name)):
                env[str(name)] = host_env[str(name)]
        else:
            env[str(name)] = expand_home(str(value), home_dir)
    return env


def expand_home(value: str, home_dir: Path) -> str:
    if value == "~":
        return str(home_dir)
    if value.startswith("~/"):
        return str(home_dir / value[2:])
    return value


def make_home(harness: Mapping | None, room: Path) -> Path:
    """The fresh HOME for one run: folders named by `env` values made, `home_files` brought over.

    `home_files` are paths relative to the host home (`.codex/auth.json`, `Library/Keychains`),
    placed at the same path inside the fresh HOME: a file is copied, a folder is linked.
    """
    harness = harness or {}
    home = room / ".home"
    home.mkdir(parents=True, exist_ok=True)
    for value in (harness.get("env") or {}).values():
        if str(value).startswith("~/"):
            contained(home, str(value)[2:]).mkdir(parents=True, exist_ok=True)
    host_home = Path.home()
    for entry in harness.get("home_files") or []:
        rel = str(entry).removeprefix("~/").removeprefix("~")
        src = host_home / rel
        dest = contained(home, rel)
        if dest.exists() or dest.is_symlink():
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        if src.is_dir():
            dest.symlink_to(src, target_is_directory=True)
        elif src.is_file():
            shutil.copy2(src, dest)
        else:
            print(f"Warning: home_files entry not found on this host: {src}", file=sys.stderr)
    return home


# --- the clean room ----------------------------------------------------------


def run_in_clean_room(
    harness: Mapping, case_dir: Path, prompt: str, timeout: int, stage: Callable[[Path], None]
) -> dict:
    """One harness run in a temporary room outside the project; the workspace comes back to case_dir/cwd.

    `stage(cwd)` fills the workspace before the run. The room holds the workspace, made a git
    root so harnesses that look for a project boundary stop there, and the fresh HOME beside it.
    Leaves prompt.txt, transcript.jsonl (stdout), stderr.txt and cwd/ in case_dir. Returns
    status ("ok", "error", "timeout", "harness-missing"), return_code, elapsed_s, stdout, stderr.
    """
    case_dir.mkdir(parents=True, exist_ok=True)
    (case_dir / "prompt.txt").write_text(prompt, encoding="utf-8")
    with tempfile.TemporaryDirectory(prefix="bmad-eval-", ignore_cleanup_errors=True) as tmp:
        room = Path(tmp)
        cwd = room / "cwd"
        cwd.mkdir()
        stage(cwd)
        subprocess.run(["git", "init", "-q", str(cwd)], capture_output=True)
        env = build_case_env(harness, make_home(harness, room), os.environ)
        argv = build_argv(harness, prompt, str(cwd))
        status, return_code, stdout, stderr = "ok", 0, b"", b""
        start = time.time()
        try:
            proc = subprocess.run(
                argv, capture_output=True, stdin=subprocess.DEVNULL, cwd=str(cwd), env=env, timeout=timeout
            )
            stdout, stderr, return_code = proc.stdout or b"", proc.stderr or b"", proc.returncode
            if return_code != 0:
                status = "error"
        except FileNotFoundError as e:
            status, return_code, stderr = "harness-missing", -1, f"command not found: {e}".encode()
        except subprocess.TimeoutExpired as e:
            status, return_code = "timeout", -1
            stdout, stderr = e.stdout or b"", (e.stderr or b"") + f"\nTIMEOUT after {timeout}s".encode()
        elapsed = time.time() - start
        shutil.copytree(cwd, case_dir / "cwd", symlinks=True, ignore=shutil.ignore_patterns(".git"), dirs_exist_ok=True)
    stdout_text = stdout.decode("utf-8", errors="replace")
    stderr_text = stderr.decode("utf-8", errors="replace")
    (case_dir / "transcript.jsonl").write_text(stdout_text, encoding="utf-8")
    (case_dir / "stderr.txt").write_text(stderr_text, encoding="utf-8")
    return {
        "status": status,
        "return_code": return_code,
        "elapsed_s": round(elapsed, 3),
        "stdout": stdout_text,
        "stderr": stderr_text,
    }


def account_transcript(transcript_text: str) -> dict:
    """Best-effort usage from what the harness printed.

    When the output is line-delimited JSON, per-message usage on assistant events is summed,
    a turn-level usage block on any event overrides the sum, and tool calls are counted;
    anything else degrades to zero counts with `tokens_reported` false, and elapsed time is
    the metric.
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
        if evt.get("type") == "assistant":
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
        elif isinstance(evt.get("usage"), dict):
            # A turn-level usage block is authoritative over the running sum.
            usage = evt["usage"]
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


# --- containment and run folders ----------------------------------------------


def safe_name(value: object) -> str:
    """A folder name from a case id: no separators, no `..`, never empty."""
    name = SAFE_NAME_RE.sub("_", str(value)).strip(".")
    return name or "unnamed"


def contained(root: Path, rel: str) -> Path:
    """`root / rel` when it stays inside root; ValueError when it would escape."""
    root = root.resolve()
    target = (root / rel).resolve()
    if target != root and root not in target.parents:
        raise ValueError(f"path escapes the workspace: {rel}")
    return target


def make_run_dir(output_dir: Path, label: str) -> tuple[str, Path]:
    """A new run folder. A second run in the same second gets a suffix, never the same folder."""
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    for n in range(1, 1000):
        run_id = f"{stamp}-{label}" if n == 1 else f"{stamp}-{label}-{n}"
        run_dir = (output_dir / run_id).resolve()
        try:
            run_dir.mkdir(parents=True, exist_ok=False)
        except FileExistsError:
            continue
        return run_id, run_dir
    raise RuntimeError(f"could not create a run folder under {output_dir}")
