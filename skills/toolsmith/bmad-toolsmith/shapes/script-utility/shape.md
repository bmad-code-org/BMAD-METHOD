# Shape: script utility

A thin `SKILL.md` over a script that does the work.

## Files

| File | From |
|---|---|
| `{target}/SKILL.md` | `shapes/script-utility/assets/SKILL-template.md` |
| `{target}/scripts/<name>.py` | `shapes/script-utility/assets/script-template.py` |
| `{tests}/test_<name>.py` | `shapes/script-utility/assets/test-template.py` |
| `{target}/bmod.toml` | `init_skill.py --bmod <record> --source <update_source>` when the skill joins a module; `ship.md` adds its dependency lists; a skill outside BMad has none |

Fill each template with `uv run {skill-root}/scripts/process_template.py {skill-root}/shapes/script-utility/assets/<template> -o <file> --var <token>=<value> ...`, where `<file>` is its row in Files, passing `{name}`, `{title}`, `{description}`, `{script}` (the script's name, no `.py`), `{skill_path}` (`{target}`'s path from the folder holding `{tests}`) and `{purpose}`. Then write by hand each `{...}` instruction left; `{skill-root}` and the f-string fields in the Python files stay as they are.

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
