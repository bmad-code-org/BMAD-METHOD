"""The clean-room contract in eval_common.build_case_env, shared by both runners.

The eval result is only honest if nothing from the host shell leaks into the subprocess: exactly
PATH, a fresh HOME, each declared home_env var pointed inside it, the auth var only when the host
has it set, and the declared passthrough keys. Nothing else.
"""

import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from eval_common import PLATFORM_ENV, build_case_env  # noqa: E402

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
    return set(env) - set(PLATFORM_ENV)


class EnvIsolationTest(unittest.TestCase):
    def test_minimal_env_keys(self):
        harness = {"auth_env": "MY_API_KEY", "home_env": ["AGENT_CONFIG_DIR"]}
        env = build_case_env(harness, HOME, HOST_ENV)
        self.assertEqual(keys(env), {"PATH", "HOME", "AGENT_CONFIG_DIR", "MY_API_KEY"})
        self.assertEqual(env["PATH"], HOST_ENV["PATH"])
        self.assertEqual(env["HOME"], str(HOME), "HOME must be the fresh case home")
        self.assertEqual(env["AGENT_CONFIG_DIR"], str(HOME / "agent_config_dir"), "config points into the fresh home")
        self.assertEqual(env["MY_API_KEY"], "sk-test-123")
        self.assertNotIn("AWS_SECRET_ACCESS_KEY", env, "host secrets leaked")

    def test_auth_var_absent_when_unset(self):
        # An empty auth var would override the harness's own login; the key must be absent, never empty.
        harness = {"auth_env": "MY_API_KEY"}
        for host in ({}, {"MY_API_KEY": ""}):
            env = build_case_env(harness, HOME, {"PATH": "/bin", **host})
            self.assertNotIn("MY_API_KEY", env)

    def test_no_harness_still_minimal(self):
        self.assertEqual(keys(build_case_env(None, HOME, HOST_ENV)), {"PATH", "HOME"})

    def test_env_passthrough_only_declared_and_present(self):
        harness = {"auth_env": "MY_API_KEY", "env_passthrough": ["EXTRA_VAR", "NOT_SET_ON_HOST"]}
        env = build_case_env(harness, HOME, HOST_ENV)
        self.assertEqual(env.get("EXTRA_VAR"), "extra")
        self.assertNotIn("NOT_SET_ON_HOST", env)
        self.assertNotIn("AWS_SECRET_ACCESS_KEY", env)


if __name__ == "__main__":
    unittest.main()
