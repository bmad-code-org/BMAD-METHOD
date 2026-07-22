"""BMAD Method - pure-Python installer.

``pip install bmad-method`` provides a ``bmad`` command that scaffolds the BMAD
Method (skills, agents, workflows) into a project for use with AI IDEs - with no
npm/Node toolchain required.

This is a proof-of-concept Python packaging of the installer; the BMAD payload
and trademark belong to the upstream project (see the bundled ``TRADEMARK.md``).
"""

from __future__ import annotations

from .installer import InstallConfig, InstallResult, install

try:  # Populated from installed distribution metadata.
    from importlib.metadata import PackageNotFoundError, version as _pkg_version

    try:
        __version__ = _pkg_version("bmad-method")
    except PackageNotFoundError:  # running from a source checkout
        from .payload import bmad_version

        __version__ = bmad_version()
except Exception:  # pragma: no cover - extreme fallback
    __version__ = "0.0.0"

__all__ = ["InstallConfig", "InstallResult", "install", "__version__"]
