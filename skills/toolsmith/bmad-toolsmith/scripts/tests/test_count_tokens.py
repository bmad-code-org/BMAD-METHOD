"""Tests for count_tokens.py: output schema, the forced fallback, files, directories and stdin."""

import builtins
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "count_tokens.py"

SAMPLE = (
    "The builder is platform-agnostic. Nothing assumes a single runtime, and no "
    "model list is ever hardcoded. Token counts replace line counts as the one "
    "length metric, with a chars-over-four fallback when tiktoken is absent.\n"
) * 8


def load_module():
    spec = importlib.util.spec_from_file_location("count_tokens", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def run(*args, stdin=None):
    return subprocess.run([sys.executable, str(SCRIPT), *args], input=stdin, capture_output=True, text=True)


class CountTokensTest(unittest.TestCase):
    def test_count_returns_int_and_known_method(self):
        tokens, method = load_module().count_tokens(SAMPLE)
        self.assertIn(method, ("tiktoken", "fallback"))
        self.assertIsInstance(tokens, int)
        self.assertGreater(tokens, 0)
        if method == "fallback":
            self.assertEqual(tokens, len(SAMPLE) // 4)

    def test_fallback_when_tiktoken_import_blocked(self):
        mod = load_module()
        real_import = builtins.__import__

        def blocked(name, *args, **kwargs):
            if name == "tiktoken" or name.startswith("tiktoken."):
                raise ImportError("blocked for test")
            return real_import(name, *args, **kwargs)

        builtins.__import__ = blocked
        try:
            tokens, method = mod.count_tokens(SAMPLE)
        finally:
            builtins.__import__ = real_import
        self.assertEqual(method, "fallback")
        self.assertEqual(tokens, len(SAMPLE) // 4)

    def test_fallback_within_tolerance_of_tiktoken(self):
        mod = load_module()
        real_tokens, method = mod.count_tokens(SAMPLE)
        if method != "tiktoken":
            self.skipTest("tiktoken not installed")
        fallback = len(SAMPLE) // 4
        self.assertTrue(real_tokens * 0.5 <= fallback <= real_tokens * 1.5)

    def test_cli_file_schema(self):
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / "sample.md"
            f.write_text(SAMPLE, encoding="utf-8")
            res = run(str(f))
            self.assertEqual(res.returncode, 0, res.stderr)
            data = json.loads(res.stdout)
            self.assertEqual(set(data), {"files", "total", "method"})
            self.assertEqual(data["files"][0]["path"], str(f))
            self.assertEqual(data["total"], data["files"][0]["tokens"])
            self.assertGreater(data["total"], 0)

    def test_cli_directory_recurses_and_skips_hidden(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "SKILL.md").write_text(SAMPLE, encoding="utf-8")
            (root / "references").mkdir()
            (root / "references" / "a.md").write_text(SAMPLE, encoding="utf-8")
            (root / ".memlog.md").write_text(SAMPLE, encoding="utf-8")
            (root / "logo.png").write_bytes(b"\x89PNG")
            data = json.loads(run(str(root)).stdout)
            paths = [Path(f["path"]).name for f in data["files"]]
            self.assertEqual(paths, ["SKILL.md", "a.md"])
            self.assertEqual(data["total"], sum(f["tokens"] for f in data["files"]))

    def test_cli_stdin_matches_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / "sample.md"
            f.write_text(SAMPLE, encoding="utf-8")
            from_file = json.loads(run(str(f)).stdout)
        from_stdin = json.loads(run("--stdin", stdin=SAMPLE).stdout)
        self.assertEqual(from_stdin["files"][0]["path"], "<stdin>")
        self.assertEqual(from_stdin["total"], from_file["total"])

    def test_cli_requires_input(self):
        self.assertNotEqual(run().returncode, 0)
        self.assertNotEqual(run("/nonexistent/path/x.md").returncode, 0)


if __name__ == "__main__":
    unittest.main()
