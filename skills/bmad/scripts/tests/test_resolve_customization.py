import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "resolve_customization.py"


class ResolveCustomizationStdoutTests(unittest.TestCase):
    def test_missing_tomllib_exits_with_actionable_version_error(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            scripts = Path(temp_dir)
            shutil.copy2(SCRIPT, scripts / SCRIPT.name)
            shutil.copy2(SCRIPT.parent / "config_utils.py", scripts / "config_utils.py")
            (scripts / "tomllib.py").write_text(
                'raise ModuleNotFoundError("No module named tomllib", name="tomllib")\n',
                encoding="utf-8",
            )

            result = subprocess.run(
                [sys.executable, str(scripts / SCRIPT.name), "--help"],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )

            self.assertEqual(result.returncode, 3)
            self.assertEqual(
                result.stderr,
                "error: Python 3.11+ is required (stdlib `tomllib` not found).\n",
            )
            self.assertNotIn("Traceback", result.stderr)

    def test_writes_emoji_json_when_stdout_encoding_is_cp1252(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            skill_dir = Path(temp_dir) / "emoji-agent"
            skill_dir.mkdir()
            (skill_dir / "customize.toml").write_text(
                '[agent]\nname = "Emoji Agent"\nicon = "🧭"\n',
                encoding="utf-8",
            )

            env = os.environ.copy()
            env["PYTHONIOENCODING"] = "cp1252"
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--skill",
                    str(skill_dir),
                    "--key",
                    "agent",
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=temp_dir,
                env=env,
                check=False,
            )

            stderr = result.stderr.decode("utf-8", errors="replace")
            self.assertEqual(result.returncode, 0, msg=stderr)

            output = result.stdout.decode("utf-8")
            self.assertIn("🧭", output)
            resolved = json.loads(output)
            self.assertEqual(resolved["agent"]["icon"], "🧭")


if __name__ == "__main__":
    unittest.main()
