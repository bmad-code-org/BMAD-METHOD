"""A stand-in agent CLI for the runner tests: `fake_harness.py <prompt> <cwd>`.

Behaves like a harness enough to exercise the runners: reads the skills staged under
`.agents/skills` in the cwd, obeys a canary line when the prompt says "yes", writes an
artifact, prints a usage line, and exits non-zero when the prompt says "crash". It also
checks the clean room: HOME must sit inside the stage and the host secret must be absent.
"""

import json
import os
import re
import sys
from pathlib import Path

CANARY_RE = re.compile(r"token `([^`]+)`")


def main() -> int:
    prompt, cwd = sys.argv[1], Path(sys.argv[2])
    home = Path(os.environ.get("HOME", ""))
    # run_evals puts HOME beside the cwd; run_triggers puts it inside the stage it runs from.
    if home.resolve().parent not in (cwd.resolve().parent, cwd.resolve()):
        print(f"HOME not inside the stage: {home}", file=sys.stderr)
        return 4
    if "HOST_SECRET" in os.environ:
        print("host secret leaked", file=sys.stderr)
        return 5
    if "crash" in prompt:
        print("boom", file=sys.stderr)
        return 1
    tokens = []
    for skill_md in sorted(cwd.glob(".agents/skills/*/SKILL.md")):
        m = CANARY_RE.search(skill_md.read_text(encoding="utf-8"))
        if m:
            tokens.append(m.group(1))
        if "edit-me" in prompt:
            skill_md.write_text("edited by the run\n", encoding="utf-8")
    (cwd / "made.txt").write_text(prompt, encoding="utf-8")
    (cwd / "where.txt").write_text(str(cwd.resolve()), encoding="utf-8")
    (cwd / "env.json").write_text(
        json.dumps({k: v for k, v in os.environ.items() if k in ("FORWARDED", "ABSENT", "FAKE_CONFIG_DIR")}),
        encoding="utf-8",
    )
    (cwd / "login.txt").write_text(str((home / ".fake" / "auth.json").is_file()), encoding="utf-8")
    reply = ("yes" in prompt and tokens and tokens[0] + " ") or ""
    print(json.dumps({"type": "assistant", "message": {"content": [{"type": "text", "text": reply + "done"}]}}))
    print(json.dumps({"type": "result", "usage": {"input_tokens": 10, "output_tokens": 5}}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
