# Package

Wrap one or more existing skills into a module so `bmad` sets them up, answers help about them and checks them for updates. The outcome: a record, a `[skill]` file in each member, and skills that read their config through it.

## Read what exists

For each skill the user points at, alone or in a folder, run `uv run "{skill-root}/scripts/prepass.py" --project-root "{project-root}" <skill>`. Read raw files only for what it does not give: the `[agent]` block in `customize.toml`, each path or value the skill hardcodes or reads from config, and the skills it invokes.

A skill whose `bmod.toml` carries `[skill]` without `[bmod]` belongs to another module: it can be a dependency here, not a member. Say so.

## Propose

Show one Smithy execution plan and wait for a yes or changes:

- The shape: the single-skill module for one skill; the multi-skill module for two or more, or a skill joining an existing record. A single-skill module among them keeps its code. Load the shape file at the write step, not now.
- The code: short, lowercase, the user's org or the module's purpose, and not a module the user already has.
- The prefix: members carry the module code as prefix (`acme-...`, agents `acme-agent-...`); `bmad-` is reserved for bmad-code-org modules. Offer a rename for a member that lacks it, say that renaming changes how the skill is invoked, and let the user decline.
- `update_source`: the pushed repo, `github:<owner>/<repo>` or `github:<owner>/<repo>/<path>`; ask when it is not in the conversation.
- The config questions, one per path or setting the skills hardcode or share, each with `key`, `prompt`, `default` and `scope`. A value several skills read the same way is one question.
- The roster entries for agents, from each `customize.toml` `[agent]`.
- `help/help.md` drafted from each description: what it gives, when to recommend it, what to offer next.
- Dependencies: `bmad` required; skills a member invokes as required or recommended, in the record when module-wide, in the member otherwise.
- The files to write and the config reads to change, by file.

## Write

On approval set `{target}` to the folder holding the record and its members, the skill folder itself for a single-skill module. Load `shapes/single-skill-module/shape.md` or `shapes/multi-skill-module/shape.md` and emit its files.

Then rewrite each skill's config reads to `uv run "{project-root}/_bmad/scripts/resolve_config.py" --project-root "{project-root}" --key modules.<code>.<key>`, one call per skill with every key it needs, dropping the hardcoded value each replaces. Touch nothing else in the skills.

Load `ship.md`.
