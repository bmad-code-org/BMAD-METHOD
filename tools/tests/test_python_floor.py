"""Every shipped script declares the same Python floor as pyproject.toml.

Scripts run through `uv run`, which reads their inline (PEP 723) metadata,
while ruff reads only pyproject.toml. Keeping the two equal means lint
targets exactly the runtime the scripts advertise.
"""

import re
import tomllib
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SCAN_DIRS = ("skills", "tools")
INLINE_BLOCK = re.compile(r"^# /// script\n(?P<body>(?:^#(?: .*)?\n)+?)^# ///$", re.MULTILINE)
REQUIRES = re.compile(r'^#\s*requires-python\s*=\s*"([^"]*)"', re.MULTILINE)


def declared_floor(path: Path) -> str | None:
    match = INLINE_BLOCK.search(path.read_text(encoding="utf-8"))
    if not match:
        return None
    found = REQUIRES.search(match.group("body"))
    return found.group(1) if found else None


class PythonFloorTest(unittest.TestCase):
    def test_inline_metadata_matches_project(self):
        config = tomllib.loads((REPO_ROOT / "pyproject.toml").read_text(encoding="utf-8"))
        project_floor = config["project"]["requires-python"]
        target = config["tool"]["ruff"]["target-version"]
        self.assertEqual(target, "py" + project_floor.removeprefix(">=").replace(".", ""))
        mismatches = []
        seen = 0
        for scan in SCAN_DIRS:
            for path in sorted((REPO_ROOT / scan).rglob("*.py")):
                floor = declared_floor(path)
                if floor is None:
                    continue
                seen += 1
                if floor != project_floor:
                    mismatches.append(f"{path.relative_to(REPO_ROOT).as_posix()}: {floor}")
        self.assertGreater(seen, 0, "no scripts with inline metadata found")
        self.assertEqual(mismatches, [], "\n".join(mismatches))


if __name__ == "__main__":
    unittest.main()
