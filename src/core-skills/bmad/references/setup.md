## Setup

`uv` is required. If `uv` is missing or cannot run, tell the user that
`uv` must be installed and stop. Do not write `_bmad` another way.

### Update

If `_bmad/config.user.toml` exists under `{project-root}`, read it. If
`user_name`, `communication_language`, and `user_skill_level` are
already set, do not ask the three first-run questions again. A second run
keeps existing team answers, including non-string values, and asks only newly
declared module questions. It replaces `_bmad/_config/bmad-help.csv` when that
packaged asset exists and removes a legacy copy when it does not. It also
repairs `_bmad/scripts` when that path is a symlink or a copy that is not
byte-identical to the packaged `bmad` skill's `scripts/`. Every symlink is
replaced with a plain copy; a byte-identical copy is left as-is. Never touch
`custom/` or existing `*.user.toml`.

### First run

Successful setup creates `_bmad/scripts` as a plain copied directory and
never attempts to create a symlink.

If that file is missing, ask these three questions first (defaults in
parentheses). Do not invent answers.

- What should agents call you? (BMad)
- What language should agents use when chatting with you? (English)
- beginner, intermediate, or expert? (intermediate)

Write their answers with the Write tool (not the shell) to
`{project-root}/.bmad-help-setup-user.toml`:

```toml
user_name = "BMad"
communication_language = "English"
user_skill_level = "intermediate"
```

Replace the example values. Use TOML basic strings (double quotes;
escape `\` and `"` inside a value). Keep this temporary file for the final
setup command below.

### Installed module questions

After handling the three first-run questions, discover unanswered installed
module questions with the script in this skill. This command is read-only:

```
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}" --list-config-questions
```

The command prints a JSON array. Ask every returned question exactly once and
in array order, showing its `default`. Do not ask a question when it is absent
from the array. If the user accepts a default, use the emitted default exactly:
the script has already expanded `{directory_name}` to the project directory
name while retaining `{project-root}` and unknown placeholders literally.

If the array is non-empty, write the selected answers with the Write tool (not
the shell) to `{project-root}/.bmad-help-setup-modules.toml`. If that path
already exists, choose another temporary path so no existing file is
overwritten. Record the path actually chosen as `{module-answers-path}`; this
is the default path above only when no collision required another name. Put
answers only below their returned module. Quote each returned key as one TOML
key so dotted keys remain unambiguous:

```toml
[modules."example"]
"simple_key" = "selected answer"
"nested.key" = "selected answer"
```

All values must be TOML basic strings. Escape backslashes, double quotes,
newlines, carriage returns, tabs, and other control characters correctly. Do
not place these answers in `config.user.toml` or another `*.user.toml`.

Run the skill-root script with the answer files created during this setup:

```text
# No answer files
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}"

# First-run answers only
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}" --user-answers "{project-root}/.bmad-help-setup-user.toml"

# Module answers only
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}" --module-answers "{module-answers-path}"

# Both answer files
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}" --user-answers "{project-root}/.bmad-help-setup-user.toml" --module-answers "{module-answers-path}"
```

If discovery or setup reports malformed team TOML, conflicting or invalid
manifests, invalid answers, or an unreadable declared script, report the named
source and stop. Do not attempt another materialization path. After setup
succeeds, delete only the actual temporary answer paths created during this
setup, including `{module-answers-path}` when module answers were written.
