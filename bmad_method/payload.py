"""Locate the BMAD payload (skills/agents/modules/scripts + metadata).

The payload is the ``src/`` tree plus a few metadata files the installer reads.
It lives in two places depending on how the code is running:

* **Installed wheel** - force-included at ``bmad_method/_payload/`` (see
  ``pyproject.toml``), so the package is self-contained.
* **Repo checkout** - the code runs straight from the repository, where the
  payload is the repo root itself (``src/`` next to ``bmad_method/``).

``payload_root()`` returns whichever base directory contains ``src/`` so the
rest of the installer is agnostic to how it was invoked.
"""

from __future__ import annotations

import functools
import json
from pathlib import Path


class PayloadError(RuntimeError):
    """Raised when the BMAD payload cannot be located."""


@functools.lru_cache(maxsize=1)
def payload_root() -> Path:
    """Return the directory that contains the BMAD ``src/`` payload."""
    here = Path(__file__).resolve().parent

    packaged = here / "_payload"
    if (packaged / "src" / "core-skills").is_dir():
        return packaged

    repo = here.parent
    if (repo / "src" / "core-skills").is_dir():
        return repo

    raise PayloadError(
        "Could not locate the BMAD payload. Expected either "
        f"{packaged / 'src'} (installed) or {repo / 'src'} (repo checkout)."
    )


def src_path(*segments: str) -> Path:
    """Join ``segments`` onto the payload's ``src/`` directory."""
    return payload_root().joinpath("src", *segments)


def module_source(module: str) -> Path:
    """Resolve a module code to its source directory in the payload.

    ``core`` and ``bmm`` are built-in and live directly under ``src/``; any
    other module is looked up under ``src/modules/<code>``.
    """
    if module == "core":
        return src_path("core-skills")
    if module == "bmm":
        return src_path("bmm-skills")
    return src_path("modules", module)


def platform_codes_path() -> Path:
    """Path to ``platform-codes.yaml`` (IDE/tool target-dir registry)."""
    packaged = payload_root() / "platform-codes.yaml"
    if packaged.is_file():
        return packaged
    # Repo checkout fallback: the canonical file lives under tools/installer.
    repo_copy = payload_root() / "tools" / "installer" / "ide" / "platform-codes.yaml"
    if repo_copy.is_file():
        return repo_copy
    raise PayloadError(f"platform-codes.yaml not found near {packaged}")


@functools.lru_cache(maxsize=1)
def bmad_version() -> str:
    """The BMAD content version, read from the payload's ``package.json``."""
    for candidate in (payload_root() / "package.json", payload_root() / ".." / "package.json"):
        try:
            data = json.loads(Path(candidate).read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        version = data.get("version")
        if version:
            return str(version)
    return "0.0.0"
