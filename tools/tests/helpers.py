"""Helpers shared by the test suite, under tools/tests and under skills alike.

pytest puts this folder on the import path (``pythonpath`` in pyproject.toml).
"""

import os
import subprocess
from pathlib import Path


def chmod(path: Path, mode: int, deny: str | None = None) -> None:
    """``os.chmod``, or on Windows its nearest equivalent.

    Windows has no permission bits. ``deny`` names the rights to take away from the
    current user in the path's access list; without it, the denial is removed.
    """
    if os.name != "nt":
        os.chmod(path, mode)
        return
    user = os.environ["USERNAME"]
    change = ["/deny", f"{user}:({deny})"] if deny else ["/remove:d", user]
    subprocess.run(["icacls", str(path), *change], check=True, capture_output=True)
