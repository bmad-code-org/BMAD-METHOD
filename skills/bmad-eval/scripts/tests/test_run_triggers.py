"""run_triggers.py against the fake harness: canary detection, unmeasured queries, exit codes."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from run_triggers import CANARY_PREFIX, detect_load, parse_skill_md, write_synthetic_skill  # noqa: E402

RUNNER = SCRIPTS_DIR / "run_triggers.py"
FAKE = Path(__file__).resolve().parent / "fake_harness.py"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


class TriggerRunTest(unittest.TestCase):
    def test_canary_scores_queries_and_leaves_failed_ones_unmeasured(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill = root / "skills" / "greet"
            write(
                skill / "SKILL.md",
                "---\nname: greet\ndescription: 'Greets the user''s friends. Use when greeting.'\n---\nSay hi.\n",
            )
            queries = root / "triggers.json"
            write(
                queries,
                json.dumps(
                    [
                        {"query": "yes greet me", "should_trigger": True},
                        {"query": "no thanks", "should_trigger": False},
                        {"query": "yes but wrong", "should_trigger": False},
                        {"query": "crash", "should_trigger": False},
                    ]
                ),
            )
            harness = root / "harness.json"
            write(harness, json.dumps({"command": [sys.executable, str(FAKE), "{prompt}", "{cwd}"]}))
            res = subprocess.run(
                [sys.executable, str(RUNNER), "--skill-path", str(skill), "--queries", str(queries),
                 "--output-dir", str(root / "out"), "--harness", str(harness), "--runs-per-query", "2", "--quiet"],
                capture_output=True, text=True,
            )  # fmt: skip
            self.assertEqual(res.returncode, 1, res.stderr)
            out = json.loads(res.stdout)
            by_query = {r["query"]: r for r in out["results"]}
            self.assertEqual(by_query["yes greet me"]["trigger_rate"], 1.0)
            self.assertTrue(by_query["yes greet me"]["pass"])
            self.assertEqual(by_query["no thanks"]["trigger_rate"], 0.0)
            self.assertTrue(by_query["no thanks"]["pass"])
            self.assertFalse(by_query["yes but wrong"]["pass"], "a should-not query that fired fails")
            crashed = by_query["crash"]
            self.assertIsNone(crashed["pass"], "a query with failed attempts is never a pass")
            self.assertEqual(crashed["runs"], 0)
            self.assertEqual(len(crashed["errors"]), 2)
            self.assertEqual(out["summary"], {"total": 4, "passed": 2, "failed": 1, "unmeasured": 1})
            self.assertEqual(
                out["description"], "Greets the user's friends. Use when greeting.", "YAML quotes are removed"
            )
            attempt = root / "out" / out["run_id"] / "queries" / "q000-r0"
            for name in ("prompt.txt", "transcript.jsonl", "stderr.txt", "timing.json"):
                self.assertTrue((attempt / name).is_file(), name)
            staged = list((attempt / "cwd" / ".agents" / "skills").glob("greet-trig-*/SKILL.md"))
            self.assertEqual(len(staged), 1, "the workspace with the staged skill comes back")
            self.assertIn("user's friends", staged[0].read_text())
            self.assertEqual(json.loads((attempt / "timing.json").read_text())["loaded"], True)

    def test_no_harness_exits_3(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill = root / "greet"
            write(skill / "SKILL.md", "---\nname: greet\ndescription: Greets.\n---\n")
            queries = root / "triggers.json"
            write(queries, json.dumps([{"query": "hi", "should_trigger": True}]))
            res = subprocess.run(
                [sys.executable, str(RUNNER), "--skill-path", str(skill), "--queries", str(queries),
                 "--output-dir", str(root / "out"), "--project-root", str(root), "--quiet"],
                capture_output=True, text=True,
            )  # fmt: skip
            self.assertEqual(res.returncode, 3, res.stderr)
            self.assertEqual(json.loads(res.stdout)["summary"]["unmeasured"], 1)


class ParseSkillTest(unittest.TestCase):
    def test_quoted_and_block_descriptions(self):
        with tempfile.TemporaryDirectory() as tmp:
            cases = {
                "description: 'It''s quoted. Use when x.'\n": "It's quoted. Use when x.",
                'description: "Say \\"hi\\". Use when x."\n': 'Say "hi". Use when x.',
                "description: |\n  Block one.\n  Block two.\n": "Block one. Block two.",
                "description: 'Spans\n  two lines.'\n": "Spans two lines.",
                "description: Plain. Use when x.\n": "Plain. Use when x.",
            }
            for frontmatter, expected in cases.items():
                write(Path(tmp) / "SKILL.md", f"---\nname: s\n{frontmatter}---\nBody.\n")
                self.assertEqual(parse_skill_md(Path(tmp)), ("s", expected), frontmatter)


class CanaryTest(unittest.TestCase):
    def test_token_is_in_the_body_not_the_name_or_description(self):
        with tempfile.TemporaryDirectory() as tmp:
            token = CANARY_PREFIX + "abcd1234"
            name = write_synthetic_skill(Path(tmp), "greet", "Greets people.\nUse when greeting.", token)
            text = (Path(tmp) / name / "SKILL.md").read_text()
            frontmatter = text.split("---")[1]
            self.assertNotIn(token, frontmatter)
            self.assertNotIn(token, name)
            self.assertIn(f"token `{token}`", text)
            self.assertIn("  Use when greeting.", frontmatter)

    def test_detection_needs_the_token(self):
        token = CANARY_PREFIX + "abcd1234"
        listing = json.dumps({"type": "system", "skills": ["greet-trig-abcd1234", "other"]})
        self.assertFalse(detect_load(listing, token), "a startup listing of skill names is not a load")
        self.assertTrue(detect_load(listing + "\n" + json.dumps({"text": f"{token} hello"}), token))


if __name__ == "__main__":
    unittest.main()
