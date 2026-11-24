# /// script
# requires-python = ">=3.11"
# dependencies = ["pytest>=8.0"]
# ///
"""Tests for scan_repo_readiness.py. Run: uv run --frozen python -B -m unittest tests/method/bmad-agent-architect/test_scan_repo_readiness.py"""

import importlib.util
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[3] / "skills/method/bmad-agent-architect/scripts/scan_repo_readiness.py"
_SPEC = importlib.util.spec_from_file_location("scan_repo_readiness", SCRIPT)
scanner = importlib.util.module_from_spec(_SPEC)
sys.modules["scan_repo_readiness"] = scanner
_SPEC.loader.exec_module(scanner)


def _git_env(repo: Path) -> dict[str, str]:
    """Build an isolated environment so ambient git hook variables cannot redirect test repos."""
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    env.update(
        {
            "GIT_AUTHOR_NAME": "Test",
            "GIT_AUTHOR_EMAIL": "test@example.com",
            "GIT_COMMITTER_NAME": "Test",
            "GIT_COMMITTER_EMAIL": "test@example.com",
            "GIT_CONFIG_NOSYSTEM": "1",
            "GIT_ATTR_NOSYSTEM": "1",
            "GIT_CONFIG_GLOBAL": os.devnull,
            "HOME": str(repo.parent),
            "XDG_CONFIG_HOME": str(repo.parent),
            "LC_ALL": "C",
            "LANG": "C",
        }
    )
    return env


class TestScanRepoReadiness(unittest.TestCase):
    def test_scan_detects_docs_comments_guardrails_and_ignores_vendor(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "src").mkdir()
            (root / "docs").mkdir()
            (root / "node_modules" / "pkg").mkdir(parents=True)
            (root / ".github" / "workflows").mkdir(parents=True)

            # Ignored vendor/lock files should never count.
            (root / "node_modules" / "pkg" / "index.js").write_text("console.log(1);\n" * 300, encoding="utf-8")
            (root / "package-lock.json").write_text("{}\n", encoding="utf-8")

            # Guardrails and competing instruction docs.
            (root / "pyproject.toml").write_text("[project]\nname = 'demo'\n", encoding="utf-8")
            (root / ".pre-commit-config.yaml").write_text("repos: []\n", encoding="utf-8")
            (root / "tsconfig.json").write_text("{}\n", encoding="utf-8")
            (root / ".github" / "workflows" / "ci.yml").write_text("name: ci\n", encoding="utf-8")
            (root / "AGENTS.md").write_text("# Agents\nKeep small.\n", encoding="utf-8")
            (root / "CLAUDE.md").write_text("# Claude\nDifferent rules.\n", encoding="utf-8")
            (root / ".cursorrules").write_text("legacy cursor rules\n", encoding="utf-8")
            (root / "docs" / "huge.md").write_text("line\n" * 220, encoding="utf-8")

            # Source files: one clean, one noisy with TODO, ticket ref, and commented-out code.
            (root / "src" / "clean.py").write_text("def add(a, b):\n    return a + b\n", encoding="utf-8")
            (root / "src" / "noisy.ts").write_text(
                "\n".join(
                    [
                        "// JIRA-402 temporary workaround",
                        "// TODO: clean this up",
                        "// const oldVal = compute(x);",
                        "// return oldVal + 1;",
                        "export function run(x: number): number {",
                        "  return x * 2;",
                        "}",
                    ]
                )
                + "\n",
                encoding="utf-8",
            )

            with patch.dict(
                os.environ,
                {"GIT_DIR": str(Path(__file__).resolve().parents[3] / ".git"), "GIT_INDEX_FILE": "/tmp/fake.idx"},
            ):
                report = scanner.scan_repo(root, top=10)
            self.assertFalse(report["git_available"])
            self.assertEqual(report["summary"]["source_files"], 2)
            self.assertEqual(report["summary"]["languages"], {".py": 1, ".ts": 1})

            doc_paths = {d["path"] for d in report["instruction_and_doc_files"]}
            self.assertEqual(doc_paths, {"AGENTS.md", "CLAUDE.md", ".cursorrules", "docs/huge.md"})

            noisy = next(c for c in report["comment_hotspots"] if c["path"] == "src/noisy.ts")
            self.assertEqual(noisy["todo_markers"], 1)
            self.assertEqual(noisy["ticket_refs"], 1)
            self.assertEqual(noisy["commented_code_runs"], 1)

            self.assertIn("pyproject.toml", report["guardrails"]["manifests"])
            self.assertIn(".pre-commit-config.yaml", report["guardrails"]["configs"])
            self.assertIn("tsconfig.json", report["guardrails"]["configs"])
            self.assertIn(".github/workflows/ci.yml", report["guardrails"]["ci_workflows"])

    def test_git_churn_ranks_hot_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "repo"
            root.mkdir()
            env = _git_env(root)
            subprocess.run(["git", "init"], cwd=root, check=True, capture_output=True, env=env)

            cold = root / "cold.py"
            hot = root / "hot.py"
            cold.write_text("x = 1\n" * 20, encoding="utf-8")
            hot.write_text("y = 1\n" * 10, encoding="utf-8")
            subprocess.run(["git", "add", "."], cwd=root, check=True, env=env)
            subprocess.run(["git", "commit", "-m", "init"], cwd=root, check=True, capture_output=True, env=env)

            for idx in range(3):
                hot.write_text("y = 1\n" * (11 + idx), encoding="utf-8")
                subprocess.run(["git", "add", "hot.py"], cwd=root, check=True, env=env)
                subprocess.run(
                    ["git", "commit", "-m", f"touch {idx}"], cwd=root, check=True, capture_output=True, env=env
                )

            report = scanner.scan_repo(root, top=5)
            self.assertTrue(report["git_available"])
            self.assertEqual(report["churn_hotspots"][0]["path"], "hot.py")
            self.assertEqual(report["churn_hotspots"][0]["churn_commits"], 4)

    def test_cli_output_help_and_errors(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "app.py").write_text("print('hi')\n", encoding="utf-8")
            out_file = root / "readiness.json"

            buf = io.StringIO()
            with redirect_stdout(buf):
                rc = scanner.main([str(root), "-o", str(out_file)])
            self.assertEqual(rc, 0)
            data = json.loads(out_file.read_text(encoding="utf-8"))
            self.assertEqual(data["summary"]["source_files"], 1)

            err = io.StringIO()
            with redirect_stderr(err):
                rc_bad = scanner.main([str(root / "missing-dir")])
            self.assertEqual(rc_bad, 2)
            self.assertIn("not a directory", err.getvalue())

            with self.assertRaises(SystemExit) as exc:
                scanner.main(["--help"])
            self.assertEqual(exc.exception.code, 0)

    def test_skips_installed_agent_skill_trees_but_keeps_rules_and_project_skills(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / ".agents" / "skills" / "bmad" / "scripts").mkdir(parents=True)
            (root / ".claude" / "skills" / "bmad" / "scripts").mkdir(parents=True)
            (root / ".cursor" / "rules").mkdir(parents=True)
            (root / "skills").mkdir()
            (root / "src").mkdir()

            # Installed skill trees inside hidden dot-dirs must be ignored completely.
            (root / ".agents" / "skills" / "bmad" / "scripts" / "big.py").write_text(
                "# TODO: should be skipped\n" + "x = 1\n" * 600, encoding="utf-8"
            )
            (root / ".claude" / "skills" / "bmad" / "SKILL.md").write_text("# Skill\n" * 250, encoding="utf-8")

            # Agent instruction files inside dot-dirs and project-owned top-level skills/ remain visible.
            (root / ".claude" / "CLAUDE.md").write_text("# Claude rules\n", encoding="utf-8")
            (root / ".cursor" / "rules" / "style.md").write_text("# Style rules\n", encoding="utf-8")
            (root / ".cursor" / "rules" / "security.mdc").write_text("# Security rule\n", encoding="utf-8")
            (root / "skills" / "tool.py").write_text("def run():\n    return 1\n", encoding="utf-8")
            (root / "src" / "app.py").write_text("def ok():\n    return True\n", encoding="utf-8")

            report = scanner.scan_repo(root, top=10)
            self.assertEqual(report["summary"]["source_files"], 2)
            self.assertEqual(report["summary"]["doc_files"], 3)
            self.assertEqual({f["path"] for f in report["largest_files"]}, {"skills/tool.py", "src/app.py"})
            self.assertEqual(report["comment_hotspots"], [])
            doc_paths = {d["path"] for d in report["instruction_and_doc_files"]}
            self.assertEqual(doc_paths, {".claude/CLAUDE.md", ".cursor/rules/security.mdc", ".cursor/rules/style.md"})

    def test_subdir_scan_and_non_ascii_churn_paths(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp) / "repo"
            app = repo / "packages" / "app"
            (app / "src").mkdir(parents=True)
            env = _git_env(repo)
            subprocess.run(["git", "init"], cwd=repo, check=True, capture_output=True, env=env)

            cafe = app / "src" / "caf\u00e9.py"
            cafe.write_text("x = 1\n", encoding="utf-8")
            subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
            subprocess.run(["git", "commit", "-m", "init"], cwd=repo, check=True, capture_output=True, env=env)

            cafe.write_text("x = 2\n", encoding="utf-8")
            subprocess.run(["git", "add", "."], cwd=repo, check=True, env=env)
            subprocess.run(["git", "commit", "-m", "bump"], cwd=repo, check=True, capture_output=True, env=env)

            report = scanner.scan_repo(app, top=5)
            self.assertTrue(report["git_available"])
            self.assertEqual(report["churn_hotspots"][0]["path"], "src/caf\u00e9.py")
            self.assertEqual(report["churn_hotspots"][0]["churn_commits"], 2)

    def test_comment_noise_ignores_c_hashes_jsdoc_and_standards_prefixes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "src").mkdir()
            (root / "src" / "lib.c").write_text(
                "\n".join(["#include <stdio.h>", "#define X 1"] * 12) + "\n// Supports UTF-8, SHA-256, ISO-8601\n",
                encoding="utf-8",
            )
            (root / "src" / "doc.ts").write_text(
                "\n".join(
                    [
                        "/**",
                        " * @param {string} userId",
                        " * @returns {boolean} ok = true",
                        " */",
                        "export const ok = true;",
                    ]
                )
                + "\n",
                encoding="utf-8",
            )
            (root / "nested").mkdir()
            nested_out = root / "nested" / "sub" / "report.json"

            buf = io.StringIO()
            with redirect_stdout(buf):
                rc = scanner.main([str(root), "-o", str(nested_out)])
            self.assertEqual(rc, 0)
            data = json.loads(nested_out.read_text(encoding="utf-8"))
            self.assertEqual(data["comment_hotspots"], [])

            with redirect_stderr(io.StringIO()):
                with self.assertRaises(SystemExit) as bad_top:
                    scanner.main([str(root), "--top", "0"])
                self.assertEqual(bad_top.exception.code, 2)
                with self.assertRaises(SystemExit) as bad_commits:
                    scanner.main([str(root), "--commits", "0"])
                self.assertEqual(bad_commits.exception.code, 2)


if __name__ == "__main__":
    unittest.main()
