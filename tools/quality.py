"""Run every check CI runs, in the same order.

Usage: uv run --frozen tools/quality.py

The Python side (ruff, rumdl, yamllint, yamlfix, JSON, validators, pytest) is
the pre-commit hook set over the whole tree. The docs-site side is its own
npm scripts, run from the repository root until docs-site owns its package.json.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

STEPS: list[list[str]] = [
    ["uv", "run", "--frozen", "pre-commit", "run", "--all-files", "--show-diff-on-failure"],
    ["npm", "run", "lint"],
    ["npm", "run", "format:check"],
    ["npm", "run", "docs:build"],
    ["npm", "run", "docs:validate-sidebar"],
    ["npm", "run", "test:docs"],
]


def main() -> int:
    for step in STEPS:
        print(f"\n$ {' '.join(step)}", flush=True)
        if subprocess.run(step, cwd=ROOT).returncode != 0:
            print(f"quality: failed at: {' '.join(step)}", file=sys.stderr)
            return 1
    print("\nquality: all checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
