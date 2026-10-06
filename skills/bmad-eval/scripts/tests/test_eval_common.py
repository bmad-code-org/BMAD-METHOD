"""The clean-room contract in eval_common.build_case_env, shared by both runners.

The eval result is only honest if nothing from the host shell leaks into the subprocess: exactly
PATH, a fresh HOME, and the harness's `env` table, where a value is set as given with "~" meaning
the fresh HOME and an empty value forwards the host's only when the host has it. Nothing else.
"""

import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from eval_common import PLATFORM_ENV, build_case_env, validate_harness  # noqa: E402

HOST_ENV = {
    "PATH": "/usr/bin:/bin",
    "HOME": "/Users/host",
    "MY_API_KEY": "sk-test-123",
    "AWS_SECRET_ACCESS_KEY": "host-secret-must-not-leak",
    "AGENT_CONFIG_DIR": "/Users/host/.agent",
    "EXTRA_VAR": "extra",
}

HOME = Path("/tmp/eval-case/.home")


def keys(env: dict) -> set[str]:
    return set(env) - set(PLATFORM_ENV) - {"USERPROFILE"}


class EnvIsolationTest(unittest.TestCase):
    def test_set_forward_and_expand(self):
        harness = {"env": {"MY_API_KEY": "", "AGENT_CONFIG_DIR": "~/.agent", "MODE": "quiet"}}
        env = build_case_env(harness, HOME, HOST_ENV)
        self.assertEqual(keys(env), {"PATH", "HOME", "AGENT_CONFIG_DIR", "MY_API_KEY", "MODE"})
        self.assertEqual(env["PATH"], HOST_ENV["PATH"])
        self.assertEqual(env["HOME"], str(HOME), "HOME must be the fresh case home")
        self.assertEqual(env["AGENT_CONFIG_DIR"], str(HOME / ".agent"), "~ points into the fresh home, not the host's")
        self.assertEqual(env["MY_API_KEY"], "sk-test-123", "an empty value forwards the host's")
        self.assertEqual(env["MODE"], "quiet")
        self.assertNotIn("AWS_SECRET_ACCESS_KEY", env, "host secrets leaked")

    def test_forwarded_var_absent_when_host_lacks_it(self):
        # An empty credential would override the CLI's own login; the key must be absent, never empty.
        for host in ({}, {"MY_API_KEY": ""}):
            env = build_case_env({"env": {"MY_API_KEY": ""}}, HOME, {"PATH": "/bin", **host})
            self.assertNotIn("MY_API_KEY", env)

    def test_no_harness_still_minimal(self):
        self.assertEqual(keys(build_case_env(None, HOME, HOST_ENV)), {"PATH", "HOME"})

    def test_validation(self):
        good = {"command": ["x", "{prompt}"], "env": {"A": ""}, "home_files": []}
        self.assertIs(validate_harness(good), good)
        for bad in (
            {"command": ["x"]},
            {"command": "x {prompt}"},
            {"command": ["x", "{prompt}"], "env": ["A"]},
            {"command": ["x", "{prompt}"], "home_files": "a"},
        ):
            with self.assertRaises(ValueError, msg=bad):
                validate_harness(bad)


if __name__ == "__main__":
    unittest.main()
