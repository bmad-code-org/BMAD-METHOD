"""Run every check CI runs, in the same order.

Usage: uv run --frozen tools/quality.py
Requires `uv sync --frozen` and `npm ci` in docs-site/ to have run.

The Python side (ruff, rumdl, yamllint, yamlfix, JSON, validators, pytest) is
the pre-commit hook set over the whole tree. The docs-site side is that
directory's own npm scripts.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "docs-site"

STEPS: list[tuple[Path, list[str]]] = [
    (ROOT, ["uv", "run", "--frozen", "pre-commit", "run", "--all-files", "--show-diff-on-failure"]),
    (SITE, ["npm", "run", "lint"]),
    (SITE, ["npm", "run", "format:check"]),
    (SITE, ["npm", "run", "build"]),
    (SITE, ["npm", "run", "validate-sidebar"]),
    (SITE, ["npm", "test"]),
]


def main() -> int:
    for cwd, step in STEPS:
        where = "" if cwd == ROOT else f" (in {cwd.relative_to(ROOT)})"
        print(f"\n${where} {' '.join(step)}", flush=True)
        if subprocess.run(step, cwd=cwd).returncode != 0:
            print(f"quality: failed at: {' '.join(step)}", file=sys.stderr)
            return 1
    print("\nquality: all checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
