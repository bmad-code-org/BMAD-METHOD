import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "resolve_config.py"


class ResolveConfigCliTests(unittest.TestCase):
    def test_full_and_repeated_key_output_follow_layer_precedence(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            custom = root / "_bmad" / "custom"
            custom.mkdir(parents=True)
            (root / "_bmad" / "config.toml").write_text(
                '[core]\nname = "base"\nkeep = "yes"\n', encoding="utf-8"
            )
            (root / "_bmad" / "config.user.toml").write_text(
                '[core]\nname = "base-user"\n', encoding="utf-8"
            )
            (custom / "config.toml").write_text(
                '[core]\nname = "team"\n', encoding="utf-8"
            )
            (custom / "config.user.toml").write_text(
                '[core]\nname = "user"\n', encoding="utf-8"
            )

            full = self._run(root)
            self.assertEqual(full.returncode, 0, msg=full.stderr)
            self.assertEqual(json.loads(full.stdout)["core"], {"name": "user", "keep": "yes"})

            keyed = self._run(root, "--key", "core.name", "--key", "missing")
            self.assertEqual(keyed.returncode, 0, msg=keyed.stderr)
            self.assertEqual(json.loads(keyed.stdout), {"core.name": "user"})

    def test_malformed_present_layer_fails(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            custom = root / "_bmad" / "custom"
            custom.mkdir(parents=True)
            (root / "_bmad" / "config.toml").write_text("[core]\nvalid = true\n", encoding="utf-8")
            (custom / "config.toml").write_text("[broken\n", encoding="utf-8")

            result = self._run(root)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("failed to parse", result.stderr)

    @staticmethod
    def _run(root: Path, *args: str) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(SCRIPT), "--project-root", str(root), *args],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )


if __name__ == "__main__":
    unittest.main()
