# Single-skill module

One folder that is both a module record and the module's only skill. It is the default registration for a standalone skill: setup asks its questions when it has any, help answers from its document, updates are checked, and there is no second folder to install.

## When the conversation is here

The read-back names one skill and nothing else ships with it, whether or not it has anything to ask. Only a user who wants no record, or a project with no `_bmad/`, makes it a plain skill instead. A second skill arriving later turns this into `shapes/multi-skill-module/shape.md`: the record moves to a `bmod-<code>/` folder and this `bmod.toml` keeps only `[skill]`.

## Files

- `bmod.toml` from `assets/bmod-template.toml`: `[bmod]` with `code`, `version`, `update_source`, `required_skills`, the questions, both install messages (empty when unused), and an empty `[skill]`. A skill with nothing to ask drops the `[[bmod.config_questions]]` block rather than shipping a placeholder question.
- `SKILL.md` and the rest of the skill from whichever skill shape the read-back chose; this shape adds only the record.
- `help/help.md` from `assets/help-template.md`: what the skill gives the user and when to recommend it, written for the `bmad` help agent.

## Rules

- `code` is the config namespace and what the user types in `bmad setup <code>`: short, lowercase, not a module the user already has. The folder name is free, because `bmad` finds a module by the `[bmod]` table, never by folder name.
- The skill reads every answer as `modules.<code>.<key>`: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key modules.<code>.<key>`. Nothing a question could hold is hardcoded.
- A question is `key`, `prompt`, `default` and optional `scope = "team"|"user"`, no other keys. `key` is not the code and does not start with `<code>.`, since the namespace already says it. `scope = "user"` for a personal preference; a path the team shares stays team. Defaults keep `{project-root}` literal.
- `required_skills` lists `{ skill = "bmad", version = "{bmad_version}", source = "github:bmad-code-org/BMAD-METHOD/skills" }`, because the skill runs `_bmad/scripts`; `{bmad_version}` is the `version` in the `bmod-core-tools` record installed beside `{skill-root}`, asked of the user when it is not installed. Add any other skill it invokes.
- `update_source` is where `npx skills add` fetches the skill from, `github:<owner>/<repo>` or `github:<owner>/<repo>/<path>`; ask when it is not in the conversation.

Fill a template with `uv run {skill-root}/scripts/process_template.py <template> -o <dest> --var key=value ... --true <condition> ...`; a `{if-X}...{/if-X}` block survives only when `--true X` is given, and `{project-root}` passes through untouched.
