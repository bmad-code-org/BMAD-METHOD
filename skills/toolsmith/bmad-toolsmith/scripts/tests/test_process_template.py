"""Tests for process_template.py: variables, conditionals, nesting, leftover markers and metadata."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "process_template.py"

TEMPLATE = """---
name: {skillName}
---

# {displayName}

{if-memory}
Memory lives at {project-root}/_bmad/memory/{skillName}/.
{if-pulse}
Pulse is on.
{/if-pulse}
{/if-memory}

Always: {agent.name}
"""


def run(*args, template=TEMPLATE):
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "t.md"
        path.write_text(template, encoding="utf-8")
        res = subprocess.run([sys.executable, str(SCRIPT), str(path), *args], capture_output=True, text=True)
        out_file = Path(tmp) / "out.md"
        output = out_file.read_text(encoding="utf-8") if out_file.exists() else None
    return res, output


class ProcessTemplateTest(unittest.TestCase):
    def test_variables_and_false_block_removed(self):
        res, _ = run("--var", "skillName=bmad-x", "--var", "displayName=X", "--json")
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertIn("name: bmad-x", res.stdout)
        self.assertIn("# X", res.stdout)
        self.assertNotIn("Memory lives", res.stdout)
        self.assertNotIn("{if-", res.stdout)
        self.assertNotIn("\n\n\n", res.stdout)
        meta = json.loads(res.stderr)
        self.assertEqual(meta["vars_substituted"], ["skillName", "displayName"])
        self.assertEqual(meta["conditions_false"], ["memory"])
        self.assertEqual(meta["conditions_true"], [])
        self.assertEqual(meta["tokens_remaining"], ["{agent.name}"])

    def test_nested_true_blocks_kept(self):
        res, _ = run("--var", "skillName=bmad-x", "--true", "memory", "--true", "pulse", "--json")
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertIn("Memory lives at {project-root}/_bmad/memory/bmad-x/.", res.stdout)
        self.assertIn("Pulse is on.", res.stdout)
        meta = json.loads(res.stderr)
        self.assertEqual(sorted(meta["conditions_true"]), ["memory", "pulse"])
        self.assertIn("{project-root}", meta["tokens_remaining"])

    def test_outer_true_inner_false(self):
        res, _ = run("--true", "memory")
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertIn("Memory lives", res.stdout)
        self.assertNotIn("Pulse is on.", res.stdout)

    def test_output_file_prints_metadata_on_stdout(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "t.md"
            out = Path(tmp) / "out.md"
            path.write_text(TEMPLATE, encoding="utf-8")
            res = subprocess.run(
                [sys.executable, str(SCRIPT), str(path), "-o", str(out), "--var", "skillName=s"],
                capture_output=True,
                text=True,
            )
            self.assertEqual(res.returncode, 0, res.stderr)
            meta = json.loads(res.stdout)
            self.assertEqual(meta["output_file"], str(out))
            self.assertIn("name: s", out.read_text(encoding="utf-8"))

    def test_plain_substitution_leaves_jinja_anchors_and_guidance_alone(self):
        template = (
            '{% raw %}{{epic_number}}{% endraw %} {{ workflow.{selector} }} {% if workflow.route == "x" %}on{% endif %}\n'
            "{project-root}/{skill-root}/{slug}/{output_folder}/{active_initiative} {workflow.lenses}\n"
            "{purpose: one paragraph on what the skill is for}\n"
            "name: {skillName}\n"
        )
        res, _ = run("--var", "selector=route", "--var", "skillName=bmad-x", "--json", template=template)
        self.assertEqual(res.returncode, 0, res.stderr)
        self.assertEqual(
            res.stdout,
            '{% raw %}{{epic_number}}{% endraw %} {{ workflow.route }} {% if workflow.route == "x" %}on{% endif %}\n'
            "{project-root}/{skill-root}/{slug}/{output_folder}/{active_initiative} {workflow.lenses}\n"
            "{purpose: one paragraph on what the skill is for}\n"
            "name: bmad-x\n",
        )
        meta = json.loads(res.stderr)
        self.assertEqual(meta["vars_substituted"], ["selector", "skillName"])

    def test_leftover_marker_exits_3(self):
        res, _ = run(template="start {if-a} unclosed")
        self.assertEqual(res.returncode, 3)
        self.assertIn("{if-a}", res.stderr)

    def test_bad_var_format_is_usage_error(self):
        res, _ = run("--var", "novalue")
        self.assertEqual(res.returncode, 2)

    def test_missing_template(self):
        res = subprocess.run([sys.executable, str(SCRIPT), "/nonexistent/t.md"], capture_output=True, text=True)
        self.assertEqual(res.returncode, 2)


if __name__ == "__main__":
    unittest.main()
