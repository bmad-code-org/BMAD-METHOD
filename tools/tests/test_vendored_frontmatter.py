"""Regression tests for vendored frontmatter.py copies inside skills."""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CANONICAL = ROOT / "skills" / "core-tools" / "bmad" / "scripts" / "frontmatter.py"

VENDORED_PATHS = (
    ROOT / "skills/core-tools/bmad-brainstorming/scripts/frontmatter.py",
    ROOT / "skills/core-tools/bmad-customize/scripts/frontmatter.py",
    ROOT / "skills/core-tools/bmad-deep-recon/scripts/frontmatter.py",
    ROOT / "skills/core-tools/bmad-facilitate/scripts/frontmatter.py",
    ROOT / "skills/core-tools/bmad-shard-pro/scripts/frontmatter.py",
    ROOT / "skills/creative/bmad-creative-agent-director/scripts/frontmatter.py",
    ROOT / "skills/method/bmad-agent-po/scripts/frontmatter.py",
    ROOT / "skills/toolsmith/bmad-eval/scripts/frontmatter.py",
    ROOT / "skills/toolsmith/bmad-toolsmith/scripts/frontmatter.py",
    ROOT / "skills/toolsmith/bmad-toolsmith/shapes/memory-agent/assets/frontmatter-template.py",
)

# tickets.py stays tied to the central _bmad/scripts/ runtime on its own PR.
ALLOWED_CENTRAL_FRONTMATTER = {
    ROOT / "skills/method/bmad-agent-po/scripts/tickets.py",
}


def _lf(path: Path) -> bytes:
    return path.read_bytes().replace(b"\r\n", b"\n")


class VendoredFrontmatterTest(unittest.TestCase):
    def test_all_vendored_copies_match_canonical(self):
        expected = _lf(CANONICAL)
        for copy in VENDORED_PATHS:
            self.assertTrue(copy.is_file(), f"missing vendored copy: {copy}")
            self.assertEqual(_lf(copy), expected, f"stale vendored copy: {copy}")

    def test_no_standalone_script_loads_central_frontmatter(self):
        for script in sorted((ROOT / "skills").rglob("scripts/*.py")):
            if script in ALLOWED_CENTRAL_FRONTMATTER or script.parent == CANONICAL.parent:
                continue
            text = script.read_text(encoding="utf-8", errors="replace")
            self.assertNotIn("shared_frontmatter", text, str(script))
            self.assertNotIn('"_bmad" / "scripts" / "frontmatter.py"', text, str(script))
            self.assertNotIn("_bmad/scripts/frontmatter.py", text, str(script))

    def test_scripts_execute_standalone_without_bmad_folder(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)

            # ideas.py
            ideas_dir = base / "ideas_pkg"
            ideas_dir.mkdir()
            shutil.copy2(ROOT / "skills/core-tools/bmad-brainstorming/scripts/ideas.py", ideas_dir)
            shutil.copy2(CANONICAL, ideas_dir)
            res = subprocess.run(
                [sys.executable, str(ideas_dir / "ideas.py"), "start", "--folder", str(base / "bs"), "--topic", "demo"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0, res.stderr)

            # recon_kit.py
            recon_dir = base / "recon_pkg"
            recon_dir.mkdir()
            shutil.copy2(ROOT / "skills/core-tools/bmad-deep-recon/scripts/recon_kit.py", recon_dir)
            shutil.copy2(CANONICAL, recon_dir)
            res = subprocess.run(
                [sys.executable, str(recon_dir / "recon_kit.py"), "ledger", str(base / "rc"), "--field", "topic=x"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0, res.stderr)

            # progress.py
            prog_dir = base / "prog_pkg"
            prog_dir.mkdir()
            shutil.copy2(ROOT / "skills/core-tools/bmad-facilitate/scripts/progress.py", prog_dir)
            shutil.copy2(CANONICAL, prog_dir)
            doc = base / "doc.md"
            doc.write_text("---\ntitle: D\n---\n\n## One\n\nBody.\n", encoding="utf-8")
            res = subprocess.run(
                [sys.executable, str(prog_dir / "progress.py"), str(doc)], capture_output=True, text=True
            )
            self.assertEqual(res.returncode, 0, res.stderr)

            # shard_tool.py
            shard_dir = base / "shard_pkg"
            shard_dir.mkdir()
            shutil.copy2(ROOT / "skills/core-tools/bmad-shard-pro/scripts/shard_tool.py", shard_dir)
            shutil.copy2(CANONICAL, shard_dir)
            res = subprocess.run(
                [sys.executable, str(shard_dir / "shard_tool.py"), "outline", str(doc)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0, res.stderr)

            # creative_lint.py
            lint_dir = base / "lint_pkg"
            lint_dir.mkdir()
            shutil.copy2(ROOT / "skills/creative/bmad-creative-agent-director/scripts/creative_lint.py", lint_dir)
            shutil.copy2(CANONICAL, lint_dir)
            res = subprocess.run(
                [sys.executable, str(lint_dir / "creative_lint.py"), "metrics", str(doc)],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0, res.stderr)

            # memlog.py
            mem_dir = base / "mem_pkg"
            mem_dir.mkdir()
            shutil.copy2(ROOT / "skills/method/bmad-agent-po/scripts/memlog.py", mem_dir)
            shutil.copy2(CANONICAL, mem_dir)
            res = subprocess.run(
                [sys.executable, str(mem_dir / "memlog.py"), "init", "--workspace", str(base / "mem_ws")],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0, res.stderr)

            # init_skill.py
            tool_skill = base / "bmad-toolsmith"
            (tool_skill / "scripts").mkdir(parents=True)
            shutil.copy2(ROOT / "skills/toolsmith/bmad-toolsmith/scripts/init_skill.py", tool_skill / "scripts")
            shutil.copy2(CANONICAL, tool_skill / "scripts")
            res = subprocess.run(
                [
                    sys.executable,
                    str(tool_skill / "scripts/init_skill.py"),
                    "--name",
                    "bmad-solo",
                    "--dest",
                    str(base / "out_skills"),
                    "--shape",
                    "plain-skill",
                ],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0, res.stderr)

            # run_triggers.py --help (verifies sibling import without bmad skill beside it)
            eval_dir = base / "eval_pkg"
            eval_dir.mkdir()
            for name in ("run_triggers.py", "eval_common.py", "frontmatter.py"):
                shutil.copy2(ROOT / "skills/toolsmith/bmad-eval/scripts" / name, eval_dir)
            res = subprocess.run(
                [sys.executable, str(eval_dir / "run_triggers.py"), "--help"], capture_output=True, text=True
            )
            self.assertEqual(res.returncode, 0, res.stderr)
