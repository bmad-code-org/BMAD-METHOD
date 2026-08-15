## Setup

`uv` is required. If `uv` is missing or cannot run, tell the user that
`uv` must be installed and stop. Do not write `_bmad` another way.

### Update

If `_bmad/config.user.toml` exists under `{project-root}`, read it. If
`user_name`, `communication_language`, and `user_skill_level` are
already set, do not ask again. Run:

```
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}"
```

### First run

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
escape `\` and `"` inside a value). Then run:

```
uv run --no-cache "{skill-root}/scripts/setup.py" --project-root "{project-root}" --skill "{skill-root}" --user-answers "{project-root}/.bmad-help-setup-user.toml"
```

After setup succeeds, delete `{project-root}/.bmad-help-setup-user.toml`.
