import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "resolve_config.py"
CONTEXT = Path(__file__).resolve().parents[1] / "context.py"


class ResolveConfigCliTests(unittest.TestCase):
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

    def test_writes_emoji_json_when_stdout_encoding_is_cp1252(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "_bmad").mkdir(parents=True)
            (root / "_bmad" / "config.toml").write_text(
                '[agents]\nname = "Analyst"\nicon = "📊"\n',
                encoding="utf-8",
            )

            env = os.environ.copy()
            env["PYTHONIOENCODING"] = "cp1252"
            result = subprocess.run(
                [sys.executable, str(SCRIPT), "--project-root", str(root)],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env,
                check=False,
            )

            stderr = result.stderr.decode("utf-8", errors="replace")
            self.assertEqual(result.returncode, 0, msg=stderr)

            output = result.stdout.decode("utf-8")
            self.assertIn("📊", output)
            resolved = json.loads(output)
            self.assertEqual(resolved["agents"]["icon"], "📊")

    def test_context_consumer_reads_emoji_output_without_locale_decoding(self):
        # context.py captures this script's stdout; if it omits encoding= the
        # decode falls back to the locale. On Windows that raises on the reader
        # thread, which surfaces as stdout=None with returncode 0 rather than an
        # exception. warn_default_encoding turns the omission into a hard error
        # on every platform, so this stays a tripwire off Windows too.
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            scripts = root / "_bmad" / "scripts"
            scripts.mkdir(parents=True)
            shutil.copy2(SCRIPT, scripts / SCRIPT.name)
            shutil.copy2(SCRIPT.parent / "config_utils.py", scripts / "config_utils.py")
            (root / "_bmad" / "config.toml").write_text(
                'project_name = "Café 📍"\n', encoding="utf-8"
            )

            driver = root / "driver.py"
            driver.write_text(
                "import importlib.util, json, sys\n"
                "from pathlib import Path\n"
                "spec = importlib.util.spec_from_file_location('ctx', sys.argv[1])\n"
                "ctx = importlib.util.module_from_spec(spec)\n"
                "spec.loader.exec_module(ctx)\n"
                "resolved = ctx._installed_resolver_config(Path(sys.argv[2]))\n"
                "sys.stdout.buffer.write(json.dumps(resolved).encode('utf-8'))\n",
                encoding="utf-8",
            )

            result = subprocess.run(
                [
                    sys.executable,
                    "-X",
                    "warn_default_encoding",
                    "-W",
                    "error::EncodingWarning",
                    str(driver),
                    str(CONTEXT),
                    str(root),
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )

            stderr = result.stderr.decode("utf-8", errors="replace")
            self.assertEqual(result.returncode, 0, msg=stderr)

            resolved = json.loads(result.stdout.decode("utf-8"))
            self.assertEqual(resolved["project_name"], "Café 📍")

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
