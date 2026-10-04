"""Guard the clean-room env contract in run_evals.py and run_triggers.py.

The eval result is only honest if nothing from the host shell leaks into the subprocess. Both
scripts carry their own build_case_env (they are deliberately self-contained); this test pins the
contract on both copies: exactly PATH + fresh HOME + CLAUDE_CONFIG_DIR + auth-var-only-when-set +
declared passthrough keys, nothing else.
"""

import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

import run_evals  # noqa: E402
import run_triggers  # noqa: E402

BUILDERS = [run_evals.build_case_env, run_triggers.build_case_env]

HOST_ENV = {
    "PATH": "/usr/bin:/bin",
    "HOME": "/Users/host",
    "ANTHROPIC_API_KEY": "sk-test-123",
    "AWS_SECRET_ACCESS_KEY": "host-secret-must-not-leak",
    "CLAUDE_CONFIG_DIR": "/Users/host/.claude",
    "EXTRA_VAR": "extra",
}

HOME = Path("/tmp/eval-case/.home")


class EnvIsolationTest(unittest.TestCase):
    def test_minimal_env_keys(self):
        adapter = {"auth_env": "ANTHROPIC_API_KEY"}
        for build in BUILDERS:
            env = build(adapter, HOME, HOST_ENV)
            self.assertEqual(set(env), {"PATH", "HOME", "CLAUDE_CONFIG_DIR", "ANTHROPIC_API_KEY"}, build.__module__)
            self.assertEqual(env["PATH"], HOST_ENV["PATH"])
            self.assertEqual(env["HOME"], str(HOME), "HOME must be the fresh case home")
            self.assertEqual(env["CLAUDE_CONFIG_DIR"], str(HOME / ".claude"))
            self.assertEqual(env["ANTHROPIC_API_KEY"], "sk-test-123")
            self.assertNotIn("AWS_SECRET_ACCESS_KEY", env, "host secrets leaked")

    def test_auth_var_absent_when_unset(self):
        # Setting auth to "" breaks the runtime's OAuth fallback: the key must be absent, never empty.
        adapter = {"auth_env": "ANTHROPIC_API_KEY"}
        for host in ({}, {"ANTHROPIC_API_KEY": ""}):
            for build in BUILDERS:
                env = build(adapter, HOME, {"PATH": "/bin", **host})
                self.assertNotIn("ANTHROPIC_API_KEY", env, build.__module__)

    def test_no_adapter_still_minimal(self):
        for build in BUILDERS:
            env = build(None, HOME, HOST_ENV)
            self.assertEqual(set(env), {"PATH", "HOME", "CLAUDE_CONFIG_DIR"})

    def test_env_passthrough_only_declared_and_present(self):
        adapter = {"auth_env": "ANTHROPIC_API_KEY", "env_passthrough": ["EXTRA_VAR", "NOT_SET_ON_HOST"]}
        for build in BUILDERS:
            env = build(adapter, HOME, HOST_ENV)
            self.assertEqual(env.get("EXTRA_VAR"), "extra")
            self.assertNotIn("NOT_SET_ON_HOST", env)
            self.assertNotIn("AWS_SECRET_ACCESS_KEY", env)


if __name__ == "__main__":
    unittest.main()
