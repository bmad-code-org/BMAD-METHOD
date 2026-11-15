# Single-skill module

One folder that is both a module record and the module's only skill: setup, help and update checks with no second folder to install.

A later second skill turns this into `shapes/multi-skill-module/shape.md`, whose From a single-skill module section moves the record to a `bmod-<code>/` folder.

## Files

- `bmod.toml` from `shapes/single-skill-module/assets/bmod-template.toml`: `[bmod]` and an empty `[skill]` in one file, both install messages empty when unused. A skill with nothing to ask drops the `[[bmod.config_questions]]` block.
- `SKILL.md` and the rest of the skill from the skill shape the execution plan chose.
- `help/help.md` from `shapes/single-skill-module/assets/help-template.md`: what the skill gives the user, written for the `bmad` help agent.
- `roster.toml` from `shapes/multi-skill-module/assets/roster-template.toml`, only when the skill is an agent.
- `doc-templates/`, only when the skill ships document templates for `bmad-facilitate`: one `template-<id>.md` per template, its frontmatter carrying `template: <id>`.
- `migration-<n>.toml`, only when a new version must change files in users' projects; `bmad migrate` runs them in `<n>` order. Ask the user for its contents.

## Rules

- `code` is the config namespace and what the user types in `bmad setup <code>`: short, lowercase, not a module the user already has.
- The folder name is free, because `bmad` finds a module by the `[bmod]` table.
- The skill reads every answer with `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key modules.<code>.<key>`. Nothing a question could hold is hardcoded.
- A question has only `key`, `prompt`, `default` and optional `scope = "team"|"user"`.
- `key` is not the code and does not start with `<code>.`, since the namespace already says it.
- `scope = "user"` is for a personal preference; a path the team shares stays team.
- Defaults keep `{project-root}` literal.
- `required_skills` lists `{ skill = "bmad", version = "{bmad_version}", source = "github:bmad-code-org/BMAD-METHOD/skills/core-tools" }`, because the skill runs `_bmad/scripts`, plus any other skill it invokes.
- `{bmad_version}` is `bmad.version` from `uv run {skill-root}/scripts/registry.py --project-root {project-root}`; ask the user when it is null.
- `update_source` is where `npx skills add` fetches the skill from, `github:<owner>/<repo>` or `github:<owner>/<repo>/<path>`; ask when it is not in the conversation.

Fill a template with `uv run {skill-root}/scripts/process_template.py <template> -o <dest> --var key=value ... --true <condition> ...`; a `{if-X}...{/if-X}` block survives only when `--true X` is given, and `{project-root}` passes through untouched.
