#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Check the shipped manifests against the runtime that has to install them.

The release stamper already runs these rules, but only at release time. A
manifest that the runtime cannot parse, or a knowledge document that a skill
names and does not ship, would otherwise sit on the branch until someone cuts
a release. This runs the same checks on every commit, and additionally proves
the skills tree can actually be discovered — the thing that breaks when a
module's skills stop being interchangeable.

Usage:
  uv run tools/validate_manifests.py
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parent.parent


def load(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise SystemExit(f"cannot load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> int:
    setup = load("bmad_setup_validate", ROOT / "skills" / "bmad" / "scripts" / "setup.py")
    knowledge = load("bmad_knowledge_validate", ROOT / "skills" / "bmad" / "scripts" / "knowledge.py")
    skills = ROOT / "skills"
    problems: list[str] = []

    for folder in sorted(path for path in skills.iterdir() if path.is_dir()):
        manifest = folder / "module-manifest.toml"
        rel = manifest.relative_to(ROOT).as_posix()
        if not manifest.is_file():
            problems.append(f"{folder.relative_to(ROOT).as_posix()}: missing module-manifest.toml")
            continue
        try:
            parsed = setup.parse_packaged_manifest(manifest, manifest.read_bytes())
        except Exception as error:
            problems.append(f"{rel}: {error}")
            continue
        if not parsed.knowledge:
            problems.append(f"{rel}: knowledge names no document")
        for relative in parsed.knowledge:
            document = folder.joinpath(*relative.parts)
            if not document.is_file():
                problems.append(f"{rel}: knowledge names {relative.as_posix()!r}, which the skill does not ship")

    # The stamper's own rules (known module, canonical update_source, plain-file
    # documents, well-formed requires and recommends), run here rather than
    # restated so the two can never disagree.
    stamper = load("bmad_stamper_validate", ROOT / "tools" / "stamp_release.py")
    try:
        stamper.collect_skills(ROOT)
    except stamper.StampError as error:
        problems.append(str(error))

    # Every skill of a module must be interchangeable, or `bmad setup` refuses
    # the install. This is the check that the branch itself must pass.
    try:
        setup.discover_installed_modules(skills / "bmad")
    except Exception as error:
        problems.append(f"skills/: a module's skills are not interchangeable: {error}")

    report = knowledge.collect([skills])
    for problem in report["problems"]:
        problems.append(f"skills/: {problem['problem']}")
    for document in report["documents"]:
        if document["drift"]:
            carriers = ", ".join(str(item["skill"]) for item in document["drift"])
            problems.append(
                f"skills/: copies of {document['path']} in module {document['module']} disagree: {carriers}"
            )

    if problems:
        print(f"Manifest validation failed ({len(problems)}):", file=sys.stderr)
        for problem in problems:
            print(f"  {problem}", file=sys.stderr)
        return 1

    print(f"Manifests valid: {len(report['skills'])} skills, {len(report['documents'])} knowledge documents.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
