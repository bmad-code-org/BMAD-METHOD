#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Report the knowledge documents an install carries, each one once.

A module replicates a document across its skills and its skills may carry
different documents, so the same document is usually present many times over.
Two entries are the same document only when they share a module, a path, and
their bytes; the skills carrying one document are what make those skills a
group. Copies that disagree are reported as drift, never resolved by picking
one.

Usage:
  uv run knowledge.py --root .claude/skills [--root ...] [--content]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import stat
import sys
import tomllib
from pathlib import Path, PurePosixPath

sys.dont_write_bytecode = True

MANIFEST_NAME = "module-manifest.toml"
READ_LIMIT = 1024 * 1024


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Report the distinct knowledge documents an install carries.")
    parser.add_argument("--root", type=Path, action="append", required=True, help="a skills root to scan")
    parser.add_argument("--content", action="store_true", help="include each document's text")
    args = parser.parse_args(argv)
    print(json.dumps(collect(args.root, include_content=args.content), ensure_ascii=False))
    return 0


def collect(roots: list[Path], *, include_content: bool = False) -> dict[str, object]:
    documents: dict[tuple[str, str], dict[str, object]] = {}
    problems: list[dict[str, str]] = []
    skills: list[dict[str, object]] = []
    seen_skills: set[str] = set()

    for root in roots:
        try:
            folders = sorted(path for path in root.iterdir() if path.is_dir())
        except OSError as error:
            problems.append({"kind": "root", "root": str(root), "problem": f"cannot read root {root}: {error}"})
            continue
        for folder in folders:
            # The first root wins a skill name outright: a project copy shadows a
            # user copy even when the project copy carries no manifest.
            if folder.name in seen_skills:
                continue
            seen_skills.add(folder.name)
            manifest = folder / MANIFEST_NAME
            try:
                if not manifest.is_file():
                    continue
                data = tomllib.loads(manifest.read_text(encoding="utf-8"))
                module = data["module"]
                entries = data["knowledge"]
                if not isinstance(module, str) or not module:
                    raise ValueError("manifest has no usable 'module'")
            except OSError as error:
                problems.append(
                    {
                        "kind": "manifest",
                        "skill": folder.name,
                        "manifest": str(manifest),
                        "problem": f"cannot read manifest {manifest}: {error}",
                    }
                )
                continue
            except (UnicodeError, tomllib.TOMLDecodeError, KeyError, ValueError) as error:
                problems.append(
                    {
                        "kind": "manifest",
                        "skill": folder.name,
                        "manifest": str(manifest),
                        "problem": f"cannot use manifest {manifest}: {error}",
                    }
                )
                continue

            skills.append({"skill": folder.name, "module": module, "root": str(root)})
            if isinstance(entries, str):
                problems.append(
                    {
                        "kind": "knowledge",
                        "skill": folder.name,
                        "problem": "manifest predates the knowledge list format and carries no document of its own",
                    }
                )
                continue
            if not isinstance(entries, list):
                problems.append(
                    {"kind": "knowledge", "skill": folder.name, "problem": "manifest 'knowledge' is not a list"}
                )
                continue
            for entry in entries:
                record_document(documents, problems, folder, module, entry, include_content=include_content)

    ordered = sorted(documents.values(), key=lambda item: (str(item["module"]), str(item["path"])))
    for document in ordered:
        document["skills"] = sorted(document["skills"])
        document["drift"] = sorted(document["drift"], key=lambda item: str(item["skill"]))
    return {
        "roots": [str(root) for root in roots],
        "skills": sorted(skills, key=lambda item: str(item["skill"])),
        "documents": ordered,
        "problems": problems,
    }


def record_document(
    documents: dict[tuple[str, str], dict[str, object]],
    problems: list[dict[str, str]],
    folder: Path,
    module: str,
    entry: object,
    *,
    include_content: bool,
) -> None:
    if not isinstance(entry, str):
        problems.append({"kind": "knowledge", "skill": folder.name, "problem": f"knowledge names {entry!r}"})
        return
    relative = safe_skill_relative(entry)
    if relative is None:
        problems.append(
            {"kind": "knowledge", "skill": folder.name, "problem": f"knowledge names unsafe path {entry!r}"}
        )
        return

    path = folder.joinpath(*relative.parts)
    try:
        raw = read_document(path, folder)
    except (OSError, ValueError) as error:
        problems.append(
            {"kind": "document", "skill": folder.name, "document": str(path), "problem": f"{path}: {error}"}
        )
        return
    try:
        text = raw.decode("utf-8")
    except UnicodeError as error:
        problems.append(
            {
                "kind": "document",
                "skill": folder.name,
                "document": str(path),
                "problem": f"{path}: not valid UTF-8, so it is not a knowledge document: {error}",
            }
        )
        return

    digest = hashlib.sha256(raw).hexdigest()
    # Identity is (module, normalized path) plus matching bytes: two modules may
    # ship the same filename with different content, and must stay separate.
    key = (module, relative.as_posix())
    document = documents.get(key)
    if document is None:
        document = {
            "module": module,
            "path": relative.as_posix(),
            "sha256": digest,
            "reported_from": folder.name,
            "skills": set(),
            "drift": [],
        }
        if include_content:
            document["content"] = text
        documents[key] = document
    if digest != document["sha256"]:
        drift: dict[str, object] = {"skill": folder.name, "sha256": digest}
        if include_content:
            drift["content"] = text
        document["drift"].append(drift)
        return
    document["skills"].add(folder.name)


def read_document(path: Path, folder: Path) -> bytes:
    """Read a knowledge document, refusing anything that is not a plain file inside the skill."""
    resolved = path.resolve()
    if not resolved.is_relative_to(folder.resolve()):
        raise ValueError("resolves outside the skill folder")
    status = resolved.stat()
    if not stat.S_ISREG(status.st_mode):
        raise ValueError("is not a regular file")
    with resolved.open("rb") as handle:
        raw = handle.read(READ_LIMIT + 1)
    if len(raw) > READ_LIMIT:
        raise ValueError(f"is larger than {READ_LIMIT} bytes")
    return raw


def safe_skill_relative(entry: str) -> PurePosixPath | None:
    """A manifest path that cannot escape the skill folder, or None if it can.

    Mirrors safe_skill_relative in setup.py. A URL parses as an ordinary
    relative path and a Windows drive prefix makes a later join discard the
    skill folder, so both are refused by name. pathlib drops "." components
    itself, so only ".." and an empty final component need checking.
    """
    if not entry or "://" in entry or "\\" in entry or ":" in entry:
        return None
    relative = PurePosixPath(entry)
    if relative.is_absolute() or ".." in relative.parts or not relative.name:
        return None
    return relative


if __name__ == "__main__":
    sys.exit(main())
