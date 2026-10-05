#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""What run_evals.py and run_triggers.py share: the harness, the clean room, containment, run folders.

The harness is the agent CLI the evals run through. Nothing about it is known here: its
non-interactive command, the folder it reads skills from and the env vars it keeps its config
in are recorded in this skill's customization (`[workflow.harness]`) by the model that first
runs an eval, and read back through the project's customization resolver. `--harness <json>`
hands the same keys in directly for a project without BMad.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from collections.abc import Mapping
from datetime import UTC, datetime
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
HARNESS_KEY = "workflow.harness"
DEFAULT_SKILL_DIR = ".agents/skills"
SAFE_NAME_RE = re.compile(r"[^A-Za-z0-9._-]+")
# A Python subprocess on Windows cannot start without these; nothing else crosses.
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
    for key in ("home_env", "env_passthrough", "sandbox"):
        if not isinstance(harness.get(key, []), list):
            raise ValueError(f"harness.{key} must be a list")
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
    """The sandbox prefix, when set, then the command with its placeholders filled."""
    tokens = [*(harness.get("sandbox") or []), *harness["command"]]
    return [str(t).replace("{prompt}", prompt).replace("{query}", prompt).replace("{cwd}", cwd) for t in tokens]


def build_case_env(harness: Mapping | None, home_dir: Path, host_env: Mapping[str, str]) -> dict[str, str]:
    """The subprocess environment, built from scratch, never from os.environ.

    Exactly: PATH, a fresh HOME, each `home_env` var pointed inside it, the `auth_env` var only
    when the host has it set non-empty (an empty value would override the harness's own
    credential fallback), and the `env_passthrough` vars the host has.
    """
    harness = harness or {}
    env = {"PATH": host_env.get("PATH", ""), "HOME": str(home_dir)}
    for name in PLATFORM_ENV:
        if name in host_env:
            env[name] = host_env[name]
    for name in harness.get("home_env") or []:
        env[str(name)] = str(home_dir / str(name).lower())
    auth_env = harness.get("auth_env")
    if auth_env and host_env.get(str(auth_env)):
        env[str(auth_env)] = host_env[str(auth_env)]
    for key in harness.get("env_passthrough") or []:
        if str(key) in host_env:
            env[str(key)] = host_env[str(key)]
    return env


def make_home(harness: Mapping | None, case_dir: Path) -> Path:
    """The fresh HOME for one run, with each `home_env` folder already there."""
    home = case_dir / ".home"
    home.mkdir(parents=True, exist_ok=True)
    for name in (harness or {}).get("home_env") or []:
        (home / str(name).lower()).mkdir(exist_ok=True)
    return home


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
