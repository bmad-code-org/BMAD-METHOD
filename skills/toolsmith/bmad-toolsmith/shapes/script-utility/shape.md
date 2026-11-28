# Shape: script utility

A thin `SKILL.md` over a script that does the work.

## Files

| File | From |
|---|---|
| `{target}/SKILL.md` | `shapes/script-utility/assets/SKILL-template.md` |
| `{target}/scripts/<name>.py` | `shapes/script-utility/assets/script-template.py` |
| `{tests}/test_<name>.py` (hyphens in `<name>` become underscores) | `shapes/script-utility/assets/test-template.py` |
| `{target}/bmod.toml` | `init_skill.py --bmod <record> --source <update_source>` when the skill joins a module; `ship.md` adds its dependency lists; a skill outside BMad has none |

Fill each template with `uv run "{skill-root}/scripts/process_template.py" "{skill-root}/shapes/script-utility/assets/<template>" -o <file> --var <token>=<value> ...`, where `<file>` is its row in Files, passing `{name}`, `{title}`, `{description}`, `{script}` (the script's name, no `.py`), `{skill_path}` (`{target}`'s path from the first folder above it holding `.git` or `_bmad/`) and `{purpose}`. Then write by hand each `{...}` instruction left; `{skill-root}` and the f-string fields in the Python files stay as they are.

## Rules

- `SKILL.md` says what the script does, the one command that runs it, how to read its output, and what to do when it fails. Nothing the script's `--help` already says.
- The call form is `uv run "{skill-root}/scripts/<name>.py" ...`.
- When several skills in a module call a shared script, put module-wide scripts on the module record (`bmod-<code>/scripts/` via `scripts = ["scripts/<name>.py"]` under `[bmod]` in `bmod-<code>/bmod.toml`) or skill-owned shared scripts under `[skill]` in the owning skill's `bmod.toml`. Both install into `_bmad/<code>/scripts/` and are called as `uv run "{project-root}/_bmad/<code>/scripts/<name>.py" ...`.
- The script carries a PEP 723 header with `requires-python = ">=3.11"` and uses argparse.
- It prints one JSON object with stable keys when a model reads the result, plain text when a person does.
- On failure it exits non-zero with a one-line reason on stderr, so the agent reports instead of guessing.
- It makes no network calls and bakes in no model ids.
- Judgment stays out of the script: when a result needs interpreting, `SKILL.md` says what each outcome asks the agent to do next.
- The test uses `unittest`, runs the script as a subprocess on a fixture built in a temp directory, and covers the success path and the one-line failure.
