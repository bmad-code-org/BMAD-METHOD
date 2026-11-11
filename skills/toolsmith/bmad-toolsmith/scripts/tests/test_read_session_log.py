"""Tests for read_session_log.py over a synthetic Claude Code transcript and a synthetic memlog."""

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "read_session_log.py"


def user(text, **extra):
    return {"type": "user", "message": {"role": "user", "content": text}, **extra}


def tool_result():
    return {
        "type": "user",
        "message": {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "t", "content": "x"}]},
    }


def assistant(*tool_uses):
    blocks = [{"type": "text", "text": "assistant prose never copied"}]
    blocks += [
        {"type": "tool_use", "id": f"t{i}", "name": name, "input": inp} for i, (name, inp) in enumerate(tool_uses)
    ]
    return {"type": "assistant", "message": {"role": "assistant", "content": blocks}}


TRANSCRIPT = [
    {"type": "last-prompt", "lastPrompt": "noise record without a message"},
    user("Build me a changelog skill that reads git history. " + "x" * 400),
    assistant(
        ("Read", {"file_path": "/repo/skills/bmad-x/SKILL.md"}),
        ("Bash", {"command": "ls"}),
        ("Bash", {"command": "pwd"}),
    ),
    tool_result(),
    assistant(("Edit", {"file_path": "/repo/skills/bmad-x/SKILL.md", "old_string": "a", "new_string": "b"})),
    user("No, don't touch SKILL.md, put it in references instead"),
    assistant(("Write", {"file_path": "/repo/skills/bmad-x/references/history.md"})),
    user("[Request interrupted by user for tool use]"),
    user("<command-name>/bmad-eval</command-name>\n<command-args></command-args>"),
    assistant(("Skill", {"skill": "bmad-eval"}), ("Read", {"file_path": "/repo/evals/cases.json"})),
    user("build me a changelog skill that reads git history. " + "x" * 400),
    user("secret meta content", isMeta=True),
    user("sidechain content", isSidechain=True),
    assistant(("Read", {"file_path": "/repo/skills/bmad-x/SKILL.md"}), ("Bash", {"command": "ls"})),
    "this line is not json",
]

MEMLOG = """---
topic: bmad-changelog
updated: 2026-06-07T14:22
---

- (note) user picked the lean approach
- (direction) keep the skill to one file
- (decision by user) name it bmad-changelog
- (gap) no eval cases yet
- (assumption) git is installed
- (idea by user) also read tags
- (note) wait, the folder was wrong
"""


def write_transcript(folder: Path, name="s1.jsonl"):
    path = folder / name
    path.write_text("\n".join(r if isinstance(r, str) else json.dumps(r) for r in TRANSCRIPT) + "\n", encoding="utf-8")
    return path


def run(*args, env=None):
    res = subprocess.run(
        [sys.executable, str(SCRIPT), *[str(a) for a in args]], capture_output=True, text=True, env=env
    )
    return res.returncode, json.loads(res.stdout) if res.stdout.strip() else None, res.stderr


class ReadSessionLogTest(unittest.TestCase):
    def test_claude_code_digest(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = write_transcript(Path(tmp))
            code, data, err = run(path)
            self.assertEqual(code, 0, err)
            self.assertEqual(
                set(data),
                {"sources", "user_requests", "tool_sequences", "corrections", "files_touched", "skills_invoked"},
            )
            self.assertEqual(data["sources"], [{"path": str(path), "format": "claude-code", "entries": 14}])

            requests = data["user_requests"]
            self.assertEqual(requests[0]["count"], 2)
            self.assertTrue(requests[0]["text"].startswith("Build me a changelog skill"))
            self.assertEqual(len(requests[0]["text"]), 300)
            self.assertTrue(requests[0]["text"].endswith("..."))
            texts = " ".join(r["text"] for r in requests)
            self.assertNotIn("secret meta", texts)
            self.assertNotIn("sidechain", texts)
            self.assertNotIn("assistant prose", json.dumps(data))
            self.assertNotIn("<command-name>", texts)

            self.assertEqual(
                data["corrections"],
                [
                    "No, don't touch SKILL.md, put it in references instead",
                    "[Request interrupted by user for tool use]",
                ],
            )
            self.assertEqual(data["skills_invoked"], [{"name": "bmad-eval", "count": 2}])
            self.assertEqual(
                data["files_touched"],
                ["/repo/evals/cases.json", "/repo/skills/bmad-x/SKILL.md", "/repo/skills/bmad-x/references/history.md"],
            )
            sequences = {tuple(s["tools"]): s["count"] for s in data["tool_sequences"]}
            self.assertEqual(sequences[("Read", "Bash")], 1)
            self.assertEqual(sequences[("Read", "Bash", "Edit")], 1)
            self.assertEqual(sequences[("Write",)], 1)
            self.assertEqual(sequences[("Skill", "Read")], 1)

    def test_memlog_digest_and_max_items(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / ".memlog.md"
            path.write_text(MEMLOG, encoding="utf-8")
            code, data, err = run(path, "--format", "memlog")
            self.assertEqual(code, 0, err)
            self.assertEqual(data["sources"][0]["entries"], 7)
            self.assertEqual(
                [r["text"] for r in data["user_requests"]],
                ["keep the skill to one file", "name it bmad-changelog", "also read tags"],
            )
            self.assertEqual(data["corrections"], ["no eval cases yet", "wait, the folder was wrong"])
            code, data, _ = run(path, "--max-items", "1")
            self.assertEqual(len(data["user_requests"]), 1)
            self.assertEqual(len(data["corrections"]), 1)

    def test_folder_and_project_resolution(self):
        with tempfile.TemporaryDirectory() as tmp:
            config = Path(tmp) / "config"
            project_dir = Path(tmp) / "work" / "my.repo"
            project_dir.mkdir(parents=True)
            encoded = str(project_dir.resolve()).replace("/", "-").replace(".", "-")
            folder = config / "projects" / encoded
            folder.mkdir(parents=True)
            write_transcript(folder, "a.jsonl")
            write_transcript(folder, "b.jsonl")
            (folder / ".memlog.md").write_text(MEMLOG, encoding="utf-8")
            env = dict(os.environ, CLAUDE_CONFIG_DIR=str(config))
            code, data, err = run("--project", project_dir, env=env)
            self.assertEqual(code, 0, err)
            self.assertEqual([s["format"] for s in data["sources"]], ["claude-code", "claude-code", "memlog"])
            self.assertEqual(data["skills_invoked"], [{"name": "bmad-eval", "count": 4}])
            code, _, err = run("--project", Path(tmp) / "nowhere", env=env)
            self.assertEqual(code, 2)

    def test_unknown_format_is_skipped_and_missing_path_errors(self):
        with tempfile.TemporaryDirectory() as tmp:
            other = Path(tmp) / "notes.txt"
            other.write_text("hello", encoding="utf-8")
            code, data, err = run(other)
            self.assertEqual(code, 0)
            self.assertEqual(data["sources"], [])
            self.assertIn("unknown format", err)
            code, _, _ = run(Path(tmp) / "missing.jsonl")
            self.assertEqual(code, 2)
            code, _, _ = run()
            self.assertEqual(code, 2)


if __name__ == "__main__":
    unittest.main()
