# Shape: script utility

A thin `SKILL.md` over a script that does the work. The conversation has reached it when the job is deterministic, success is checkable, and code beats a model doing it by hand.

## Files

| File | From |
|---|---|
| `SKILL.md` | `assets/SKILL-template.md` |
| `scripts/<name>.py` | `assets/script-template.py` |
| `scripts/tests/test_<name>.py` | `assets/test-template.py` |
| `bmod.toml` | `init_skill.py --bmod <record> --source <update_source>` when the skill joins a module; `ship.md` adds its dependency lists; a skill outside BMad has none |

## Rules

- `SKILL.md` says what the script does, the one command that runs it, how to read its output, and what to do when it fails. Nothing the script's `--help` already says.
- The call form is `uv run {skill-root}/scripts/<name>.py ...`.
- When other skills must call the script, add `scripts = ["scripts/<name>.py"]` under `[skill]` in `bmod.toml`, which installs it to `_bmad/scripts/`; it is then called as `uv run {project-root}/_bmad/scripts/<name>.py ...`.
- The script carries a PEP 723 header with `requires-python = ">=3.11"` and uses argparse.
- It prints one JSON object with stable keys when a model reads the result, plain text when a person does.
- On failure it exits non-zero with a one-line reason on stderr, so the agent reports instead of guessing.
- It makes no network calls and bakes in no model ids.
- Judgment stays out of the script: when a result needs interpreting, `SKILL.md` says what each outcome asks the agent to do next.
- The test uses `unittest`, runs the script as a subprocess on a fixture built in a temp directory, and covers the success path and the one-line failure.
