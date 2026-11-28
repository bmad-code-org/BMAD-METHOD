#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""Validate bmod.toml manifests in a repository using the installed bmad skill's validator."""

from __future__ import annotations

import argparse
import importlib.util
import sys
from pathlib import Path

sys.dont_write_bytecode = True

SKILL_ROOT = Path(__file__).resolve().parent.parent


def candidate_bmad_dirs(project_root: Path, roots: list[Path]) -> list[Path]:
    home = Path.home()
    candidates: list[Path] = []
    for root in roots:
        candidates.append(root / "bmad")
        candidates.append(root / "core-tools" / "bmad")
    candidates.extend(
        [
            SKILL_ROOT.parent / "bmad",
            SKILL_ROOT.parents[1] / "core-tools" / "bmad",
            project_root / "skills" / "core-tools" / "bmad",
            project_root / "skills" / "bmad",
            project_root / ".agents" / "skills" / "bmad",
            project_root / ".claude" / "skills" / "bmad",
            home / ".agents" / "skills" / "bmad",
            home / ".claude" / "skills" / "bmad",
        ]
    )
    return candidates


def find_validator(project_root: Path, roots: list[Path]) -> Path | None:
    for folder in candidate_bmad_dirs(project_root, roots):
        candidate = folder / "scripts" / "validate_manifests.py"
        if candidate.is_file():
            return candidate
    return None


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate every bmod.toml under skills/ in a repository.")
    parser.add_argument(
        "--project-root",
        type=Path,
        default=Path.cwd(),
        help="repository to check (default: the current directory)",
    )
    parser.add_argument(
        "--root",
        type=Path,
        action="append",
        default=[],
        help="active skills folder to locate the bmad skill in (repeatable)",
    )
    args = parser.parse_args(argv)
    project_root = args.project_root.resolve()
    validator_path = find_validator(project_root, [root.resolve() for root in args.root])
    if validator_path is None:
        print(
            "error: bmad skill not found; install it with `npx skills add bmad-code-org/BMAD-METHOD --skill bmad`",
            file=sys.stderr,
        )
        return 1
    spec = importlib.util.spec_from_file_location("bmad_validate_manifests", validator_path)
    if spec is None or spec.loader is None:
        print(f"error: cannot load manifest validator at {validator_path}", file=sys.stderr)
        return 1
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return int(module.main(["--project-root", str(project_root)]))


if __name__ == "__main__":
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8", errors=getattr(sys.stdout, "errors", None) or "strict")
        sys.stderr.reconfigure(encoding="utf-8", errors=getattr(sys.stderr, "errors", None) or "strict")
    sys.exit(main())
