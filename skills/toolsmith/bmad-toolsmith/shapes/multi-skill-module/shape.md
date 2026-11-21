# Multi-skill module

A `bmod-<code>/` record folder beside the skills it ships, and a `[skill]` `bmod.toml` in each of them. The record is inert: `bmad` reads it for setup, help, the roster and update checks.

## The module plan

Present it under that title before any member is built:

- The code, and the folder the record and its members will live in.
- Each member: its name, one line on what it gets done, and its shape.
- The config questions the members share, each with `key`, `prompt`, `default` and `scope`, and the members that read it. A value several members read is one question.
- The roster: each agent member's `name`, `title` and `icon`, and any group of agents the user wants to meet together in party mode.
- The build order: a member that others invoke comes before them.

The first member's execution plan adds the record, written from the module plan with `skills` holding only the members built so far. Every member registers as a member of `bmod-<code>` and joins the record as Joining an existing record says, so none passes through the single-skill form.

## Files

The record, `bmod-<code>/`:

- `SKILL.md` from `shapes/multi-skill-module/assets/record-SKILL-template.md`: `name: bmod-<code>`, the template's fixed description, and a body that only redirects to `bmad setup <code>`.
- `bmod.toml` from `shapes/multi-skill-module/assets/record-bmod-template.toml`: `[bmod]` with `code`, `version`, `update_source`, `skills` (every member), `required_skills`, optional `recommended_skills`, the `[[bmod.config_questions]]`, and both install messages, empty when unused.
- `roster.toml` from `shapes/multi-skill-module/assets/roster-template.toml`, only when a member is an agent.
- `help/help.md` from `shapes/multi-skill-module/assets/help-template.md`, always. `help/<topic>.md` for depth, each named in `help.md` with when to read it; a topic `help.md` does not name is never read.
- `retired.toml` from `shapes/multi-skill-module/assets/retired-template.toml`, only when the module has renamed or removed a skill.
- `doc-templates/`, only when the module ships document templates for `bmad-facilitate`: one `template-<id>.md` per template, its frontmatter carrying `template: <id>` and, when a member offers it, `agents:` naming the members that do, with any rubric beside it. `shapes/document-template/shape.md` has the rest.
- `migration-<n>.toml`, only when a new version must change files in users' projects; `bmad migrate` runs them in `<n>` order. Ask the user for its contents.

Each member: `bmod.toml` from `shapes/multi-skill-module/assets/member-bmod-template.toml`, with `bmod = "bmod-<code>"`, `source` equal to the record's `update_source`, and its own `required_skills`, `recommended_skills` and `scripts` (files it ships into `_bmad/scripts`) when it has them.

A skill belongs to one module; a skill it uses from another module is a dependency entry, not a member.

## Joining an existing record

The scaffold writes the member `bmod.toml` (`--bmod bmod-<code> --source <the record's update_source>`). Then change the record:

- Add the name to `[bmod].skills`.
- Add a row to `help/help.md`, and a `help/<topic>.md` only when the skill has depth the row cannot hold.
- For an agent, add a `[[members]]` entry to `roster.toml`.

Leave the record's version unchanged. The execution plan's files list shows these edits.

## From a single-skill module

A single-skill module has no record folder yet, so build one before anything joins. Write `bmod-<code>/` as Files says, keeping `code`, `version`, `update_source`, dependencies and questions from its `[bmod]`, so installed answers still resolve, and move its `help/`, `roster.toml`, `doc-templates/` and `migration-<n>.toml` files there. Its `bmod.toml` becomes a member file.

## Rules

- The record folder is `bmod-` plus the code exactly.
- Config: a question is `key`, `prompt`, `default`, optional `scope = "team"|"user"`, nothing else; `key` is not the code and does not start with `<code>.`. Every member reads answers as `modules.<code>.<key>` through `resolve_config.py`. One question serves every skill that needs the value, so the record is the only place a path is asked.
- Dependencies: `{ skill = "bmad", version = "{bmad_version}", source = "github:bmad-code-org/BMAD-METHOD/skills/core-tools" }` in the record's `required_skills`, because members run `_bmad/scripts`. `{bmad_version}` is `bmad.version` from `uv run "{skill-root}/scripts/registry.py" --project-root "{project-root}"`; ask the user when it is null. A plain name is a skill from this module's source; a table names one from elsewhere. Module-wide needs go in the record, one skill's needs in its own file.
- Roster `[[members]]`: `code`, `skill`, `name`, `icon`, `title`, `persona`, copied from the agent's `customize.toml`. A member without `skill` is a guest who exists only in `[[groups]]`. A group the plan names is a `[[groups]]` entry (`--true group`): `id`, `name`, a one-line `scene`, its `members` by code, and `memory = true` only when the user wants the party to remember past sessions.
- Help has one reader, the `bmad` help agent, so it holds what each skill gives, when to recommend it, what to offer next, where output lands and which `bmad setup` answer sets it. Leave out install mechanics and manifest keys.

Fill a template with `uv run {skill-root}/scripts/process_template.py <template> -o <dest> --var key=value ... --true <condition> ...`; a `{if-X}...{/if-X}` block survives only when `--true X` is given, and `{project-root}` passes through untouched.
