"""Guard trigger detection in run_triggers.py.

The stream-json init event lists every discovered skill by name, so any detection that
substring-matches the whole transcript reports a 100% trigger rate. These tests pin the rule: only
tool_use events (a Skill call naming the synthetic skill, or a Read inside its directory) count as a
load, and substring-style load signals are rejected outright.
"""

import json
import sys
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from run_triggers import detect_load, validate_load_signal  # noqa: E402

NAME = "my-skill-trig-abc12345"


def line(obj) -> str:
    return json.dumps(obj)


def init_event() -> str:
    # Claude Code's init event advertises every discovered skill.
    return line(
        {
            "type": "system",
            "subtype": "init",
            "tools": ["Skill", "Read", "Bash"],
            "slash_commands": [],
            "skills": [NAME, "other-skill"],
        }
    )


def assistant(content) -> str:
    return line({"type": "assistant", "message": {"content": content}})


class TriggerDetectionTest(unittest.TestCase):
    def test_init_event_alone_is_not_a_load(self):
        transcript = "\n".join(
            [
                init_event(),
                assistant([{"type": "text", "text": "I can't help with that."}]),
                line({"type": "result", "usage": {}}),
            ]
        )
        self.assertFalse(detect_load(transcript, {}, NAME))

    def test_text_mention_is_not_a_load(self):
        transcript = assistant([{"type": "text", "text": f"There is a skill called {NAME} available."}])
        self.assertFalse(detect_load(transcript, {}, NAME))

    def test_skill_tool_call_is_a_load(self):
        transcript = "\n".join(
            [init_event(), assistant([{"type": "tool_use", "name": "Skill", "input": {"skill": NAME}}])]
        )
        self.assertTrue(detect_load(transcript, {}, NAME))

    def test_read_of_synthetic_skill_md_is_a_load(self):
        read = {
            "type": "tool_use",
            "name": "Read",
            "input": {"file_path": f"/tmp/stage/.claude/skills/{NAME}/SKILL.md"},
        }
        transcript = "\n".join([init_event(), assistant([read])])
        self.assertTrue(detect_load(transcript, {}, NAME))

    def test_unrelated_tool_calls_are_not_a_load(self):
        transcript = "\n".join(
            [
                init_event(),
                assistant([{"type": "tool_use", "name": "Read", "input": {"file_path": "/tmp/stage/notes.md"}}]),
                assistant([{"type": "tool_use", "name": "Skill", "input": {"skill": "other-skill"}}]),
                assistant([{"type": "tool_use", "name": "Bash", "input": {"command": f"echo {NAME}"}}]),
            ]
        )
        self.assertFalse(detect_load(transcript, {}, NAME))

    def test_custom_tool_names_from_load_signal(self):
        sig = {"skill_tool": "InvokeSkill", "read_tool": "OpenFile"}
        hit = assistant([{"type": "tool_use", "name": "InvokeSkill", "input": {"name": NAME}}])
        miss = assistant([{"type": "tool_use", "name": "Skill", "input": {"skill": NAME}}])
        self.assertTrue(detect_load(hit, sig, NAME))
        self.assertFalse(detect_load(miss, sig, NAME), "default tool name must not fire when the adapter renames it")

    def test_garbage_lines_do_not_crash(self):
        transcript = 'not json\n\n{"type": 42}\n[1,2,3]\n'
        self.assertFalse(detect_load(transcript, {}, NAME))

    def test_string_load_signal_rejected(self):
        with self.assertRaises(ValueError):
            validate_load_signal({"type": "string"})
        with self.assertRaises(ValueError):
            detect_load("", {"type": "string"}, NAME)


if __name__ == "__main__":
    unittest.main()
