"""Tests for read_session_log.py over a synthetic Claude Code transcript and a synthetic memlog."""

import json
import os
import re
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
    def test_claude_code_turns(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = write_transcript(Path(tmp))
            code, data, err = run(path)
            self.assertEqual(code, 0, err)
            self.assertEqual(set(data), {"sources", "skipped", "turns", "files_touched", "skills_invoked", "totals"})
            self.assertEqual(
                data["sources"], [{"path": str(path), "format": "claude-code", "entries": 14, "bad_lines": 1}]
            )
            self.assertEqual(data["skipped"], [])
            turns = data["turns"]
            self.assertEqual(len(turns), 4)
            self.assertEqual({t["source"] for t in turns}, {0})
            self.assertTrue(turns[0]["request"].startswith("Build me a changelog skill"))
            self.assertEqual(len(turns[0]["request"]), 300)
            self.assertTrue(turns[0]["request"].endswith("..."))
            self.assertEqual(turns[0]["tools"], ["Read", "Bash", "Edit"])
            self.assertEqual(turns[0]["followed_by"], "No, don't touch SKILL.md, put it in references instead")
            self.assertFalse(turns[0]["interrupted"])
            self.assertIsNone(turns[0]["tag"])
            self.assertEqual(turns[1]["tools"], ["Write"])
            self.assertTrue(turns[1]["interrupted"])
            self.assertEqual(turns[1]["followed_by"], "/bmad-eval")
            self.assertEqual(turns[2]["request"], "/bmad-eval")
            self.assertEqual(turns[2]["tools"], ["Skill", "Read"])
            self.assertEqual(turns[2]["followed_by"], turns[3]["request"])
            self.assertEqual(turns[3]["tools"], ["Read", "Bash"])
            self.assertIsNone(turns[3]["followed_by"])
            dumped = json.dumps(data)
            for hidden in ("secret meta", "sidechain content", "assistant prose", "<command-name>"):
                self.assertNotIn(hidden, dumped)
            self.assertEqual(data["skills_invoked"], [{"name": "bmad-eval", "count": 2}])
            self.assertEqual(
                data["files_touched"],
                ["/repo/evals/cases.json", "/repo/skills/bmad-x/SKILL.md", "/repo/skills/bmad-x/references/history.md"],
            )
            self.assertEqual(
                data["totals"],
                {"turns": 4, "turns_shown": 4, "interrupted": 1, "files_touched": 3, "skills_invoked": 1},
            )

    def test_command_args_become_the_request(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "c.jsonl"
            record = user("<command-name>/bmad-toolsmith</command-name>\n<command-args>fix this skill</command-args>")
            path.write_text(json.dumps(record) + "\n", encoding="utf-8")
            code, data, err = run(path)
            self.assertEqual(code, 0, err)
            self.assertEqual(data["turns"][0]["request"], "/bmad-toolsmith fix this skill")

    def test_memlog_entries_keep_their_tags(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / ".memlog.md"
            path.write_text(MEMLOG, encoding="utf-8")
            code, data, err = run(path, "--format", "memlog")
            self.assertEqual(code, 0, err)
            self.assertEqual(data["sources"][0]["entries"], 7)
            self.assertEqual(data["sources"][0]["bad_lines"], 0)
            turns = data["turns"]
            self.assertEqual(
                [t["tag"] for t in turns],
                ["note", "direction", "decision by user", "gap", "assumption", "idea by user", "note"],
            )
            self.assertEqual(turns[1]["request"], "keep the skill to one file")
            self.assertEqual(turns[1]["followed_by"], "name it bmad-changelog")
            self.assertEqual(turns[1]["tools"], [])

    def test_max_turns_keeps_the_latest_and_totals_count_all(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / ".memlog.md"
            path.write_text(MEMLOG, encoding="utf-8")
            code, data, _ = run(path, "--max-turns", "2", "--max-items", "1")
            self.assertEqual(code, 0)
            self.assertEqual([t["request"] for t in data["turns"]], ["also read tags", "wait, the folder was wrong"])
            self.assertEqual(data["totals"]["turns"], 7)
            self.assertEqual(data["totals"]["turns_shown"], 2)

    def test_folder_and_project_resolution(self):
        with tempfile.TemporaryDirectory() as tmp:
            config = Path(tmp) / "config"
            project_dir = Path(tmp) / "work" / "_my.repo x"
            project_dir.mkdir(parents=True)
            # Claude Code turns every character outside [A-Za-z0-9-] into "-": "/_" becomes "--".
            encoded = re.sub(r"[^A-Za-z0-9-]", "-", str(Path(tmp).resolve())) + "-work--my-repo-x"
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
            self.assertEqual(sorted({t["source"] for t in data["turns"]}), [0, 1, 2])
            # followed_by never crosses from one source into the next
            last_of_first = [t for t in data["turns"] if t["source"] == 0][-1]
            self.assertIsNone(last_of_first["followed_by"])
            code, _, err = run("--project", Path(tmp) / "nowhere", env=env)
            self.assertEqual(code, 2)

    def test_nothing_read_exits_one_with_reasons(self):
        with tempfile.TemporaryDirectory() as tmp:
            other = Path(tmp) / "notes.txt"
            other.write_text("hello", encoding="utf-8")
            code, data, err = run(other)
            self.assertEqual(code, 1)
            self.assertEqual(data["sources"], [])
            self.assertEqual(data["skipped"][0]["path"], str(other))
            self.assertIn("unknown format", data["skipped"][0]["reason"])
            self.assertIn("no source was read", err)
            empty = Path(tmp) / "empty"
            empty.mkdir()
            code, data, err = run(empty)
            self.assertEqual(code, 1)
            self.assertIn("no *.jsonl", data["skipped"][0]["reason"])

    def test_one_source_read_is_success_and_skips_are_listed(self):
        with tempfile.TemporaryDirectory() as tmp:
            other = Path(tmp) / "notes.txt"
            other.write_text("hello", encoding="utf-8")
            path = write_transcript(Path(tmp))
            code, data, err = run(path, other)
            self.assertEqual(code, 0, err)
            self.assertEqual(len(data["sources"]), 1)
            self.assertEqual([s["path"] for s in data["skipped"]], [str(other)])

    def test_usage_errors(self):
        with tempfile.TemporaryDirectory() as tmp:
            code, _, _ = run(Path(tmp) / "missing.jsonl")
            self.assertEqual(code, 2)
        code, _, _ = run()
        self.assertEqual(code, 2)


if __name__ == "__main__":
    unittest.main()
