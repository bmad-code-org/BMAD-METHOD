# Shape: script utility

A thin `SKILL.md` over a script that does the work. The conversation has reached it when the job is deterministic: the same input gives the same output, success is checkable, and a model doing it by hand would be slower and less reliable than code (file transforms, extraction, counting, validation, driving a fixed CLI). The prose only tells the agent how to run the script and what to do with the result.

## Files

| File | From |
|---|---|
| `SKILL.md` | `assets/SKILL-template.md` |
| `scripts/<name>.py` | `assets/script-template.py` |
| `scripts/tests/test_<name>.py` | `assets/test-template.py` |
| `bmod.toml` | the scaffold, `init_skill.py --bmod <record> --source <update_source>`, when the skill joins a module; `ecosystem.md` adds its dependency lists; a skill outside BMad has none. When other skills must call the script, add `scripts = ["scripts/<name>.py"]` under `[skill]`, which installs it to `_bmad/scripts/` |

## Rules

- `SKILL.md` says what the script does, the one command that runs it, how to read its output, and what to do when it fails. Nothing the script's `--help` already says.
- The call form is always `uv run {skill-root}/scripts/<name>.py ...`. A script installed for other skills is called as `uv run {project-root}/_bmad/scripts/<name>.py ...`.
- The script carries a PEP 723 header with `requires-python = ">=3.11"` and uses argparse, so `--help` is the reference. It prints one JSON object with stable keys when a model reads the result, plain text when a person does. On failure it exits non-zero with a one-line reason on stderr, so the agent reports instead of guessing. No network calls and no model ids baked in.
- Judgment stays out of the script. When a result needs interpreting, `SKILL.md` says what each outcome asks the agent to do next; the script does not decide for it.
- The test uses `unittest`, runs the script as a subprocess on a fixture built in a temp directory, and covers the success path and the one-line failure.
