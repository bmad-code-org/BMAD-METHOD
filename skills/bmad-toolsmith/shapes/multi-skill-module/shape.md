# Multi-skill module

A `bmod-<code>/` record folder beside the skills it ships, and a `[skill]` `bmod.toml` in each of them. The record is inert: `bmad` reads it for setup, help, the roster and update checks.

## When the conversation is here

The read-back lists two or more skills that ship and install together, or one skill joining a module that already has a record. Planning what a large module should contain is the user's own discovery with you, or the method's planning skills; this shape starts once the skill list exists. One skill with its own questions is `shapes/single-skill-module/shape.md`.

## Files

The record, `bmod-<code>/`:

- `SKILL.md` from `assets/record-SKILL-template.md`: `name: bmod-<code>`, the fixed description `Required bmod metadata. Never invoke this skill.`, and a body that only redirects to `bmad setup <code>`.
- `bmod.toml` from `assets/record-bmod-template.toml`: `[bmod]` with `code`, `version`, `update_source`, `skills` (every member), `required_skills`, optional `recommended_skills`, the `[[bmod.config_questions]]`, and both install messages, empty when unused.
- `roster.toml` from `assets/roster-template.toml`, only when a member is an agent.
- `help/help.md` from `assets/help-template.md`, always. `help/<topic>.md` for depth, each named in `help.md` with when to read it; a topic `help.md` does not name is never read.
- `retired.toml` from `assets/retired-template.toml`, only when the module has renamed or removed a skill.

Each member: `bmod.toml` from `assets/member-bmod-template.toml`, with `bmod = "bmod-<code>"`, `source` equal to the record's `update_source`, and its own `required_skills`, `recommended_skills` and `scripts` (files it ships into `_bmad/scripts`) when it has them. A skill belongs to one module; a skill it uses from another module is a dependency entry, not a member.

## Joining an existing record

When the read-back registers one skill as a member of a record that exists, the scaffold writes the member `bmod.toml` (`--bmod bmod-<code> --source <the record's update_source>`); then change the record: add the name to `[bmod].skills`; add a row to `help/help.md`, and a `help/<topic>.md` only when the skill has depth the row cannot hold; for an agent, a `[[members]]` entry in `roster.toml`. The record's version is not yours to bump. The read-back's files list shows these edits.

## Rules

- Names: members carry the code as prefix (`acme-brainstorm`, agents `acme-agent-<name>`); `bmad-` names belong to the bmad-code-org, which writes `bmad-<code>-<skill>`. The record folder is `bmod-` plus the code exactly.
- Config: a question is `key`, `prompt`, `default`, optional `scope = "team"|"user"`, nothing else; `key` is not the code and does not start with `<code>.`. Every member reads answers as `modules.<code>.<key>` through `resolve_config.py`. One question serves every skill that needs the value, so the record is the only place a path is asked.
- Dependencies: `{ skill = "bmad", version = "{bmad_version}", source = "github:bmad-code-org/BMAD-METHOD/skills" }` in the record's `required_skills`, because members run `_bmad/scripts`; `{bmad_version}` is the `version` in the `bmod-core-tools` record installed beside `{skill-root}`, asked of the user when it is not installed. A plain name is a skill from this module's source; a table names one from elsewhere. Module-wide needs go in the record, one skill's needs in its own file.
- Roster `[[members]]`: `code`, `skill`, `name`, `icon`, `title`, `persona`, copied from the agent's `customize.toml`. A member without `skill` is a guest who exists only in `[[groups]]`.
- Help has one reader, the `bmad` help agent, answering a user: what each skill gives, when to recommend it, what to offer next, where output lands and which `bmad setup` answer sets it. Leave out install mechanics and manifest keys, which it cannot act on while answering.

Fill a template with `uv run {skill-root}/scripts/process_template.py <template> -o <dest> --var key=value ... --true <condition> ...`; a `{if-X}...{/if-X}` block survives only when `--true X` is given, and `{project-root}` passes through untouched.
