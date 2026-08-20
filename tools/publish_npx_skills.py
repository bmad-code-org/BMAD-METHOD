#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Replace the artifact repo's tree with packager output and push it.

Prototype of the release publish step: takes the skills/ directory the
packager emitted, clones the artifact repo, replaces everything except
README.md with that tree, commits, pushes, and optionally tags the stamped
version. Humans run this until release CI owns it.
"""

import argparse
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

VERSION_LINE = re.compile(r"^version: (.+)$", re.MULTILINE)


def run(args: list[str], cwd: Path) -> None:
    subprocess.run(args, cwd=cwd, check=True)


def stamped_version(skills_dir: Path) -> str:
    manifests = sorted(skills_dir.glob("*/module-manifest.md"))
    if not manifests:
        raise SystemExit(f"no */module-manifest.md under {skills_dir}; not packager output")
    versions = set()
    for manifest in manifests:
        match = VERSION_LINE.search(manifest.read_text(encoding="utf-8"))
        if match is None:
            raise SystemExit(f"{manifest} carries no version stamp")
        versions.add(match.group(1).strip())
    if len(versions) != 1:
        raise SystemExit(f"manifests disagree on version: {sorted(versions)}")
    return versions.pop()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skills-dir", type=Path, required=True,
                        help="the skills/ directory the packager emitted")
    parser.add_argument("--repo", default="git@github.com:bmad-code-org/bmad-skills.git")
    parser.add_argument("--tag", action="store_true",
                        help="also tag the artifact repo v<stamped version>")
    args = parser.parse_args(argv)

    skills_dir = args.skills_dir.resolve()
    version = stamped_version(skills_dir)

    with tempfile.TemporaryDirectory() as temp:
        clone = Path(temp) / "repo"
        run(["git", "clone", "--depth", "1", args.repo, str(clone)], cwd=Path(temp))
        for entry in clone.iterdir():
            if entry.name in (".git", "README.md", "SECURITY.md"):
                continue
            shutil.rmtree(entry) if entry.is_dir() else entry.unlink()
        shutil.copytree(skills_dir, clone / "skills")
        run(["git", "add", "-A"], cwd=clone)
        status = subprocess.run(["git", "status", "--porcelain"], cwd=clone,
                                check=True, capture_output=True, text=True)
        if not status.stdout.strip():
            print(f"tree already matches {version}; nothing to publish")
            return 0
        run(["git", "commit", "-m", f"publish {version} from BMAD-METHOD"], cwd=clone)
        run(["git", "push", "origin", "HEAD"], cwd=clone)
        if args.tag:
            run(["git", "tag", f"v{version}"], cwd=clone)
            run(["git", "push", "origin", f"v{version}"], cwd=clone)
    print(f"published {version}" + (f", tagged v{version}" if args.tag else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
