# Package

Wrap one skill or several that already exist into a module, so `bmad` sets them up, answers help about them and checks them for updates. The outcome: a record, a `[skill]` file in each member, and skills that read their config through it, all approved before anything is written.

## Read what exists

The user points at a folder of skills or at one skill. Run `uv run {skill-root}/scripts/prepass.py <skill>` for each and take its facts: shape hint, description length and `Use when`, customize and scripts, path findings. Read raw files only for what it does not give: the `[agent]` block in `customize.toml`, each path or value the skill hardcodes or reads from config, and the skills it invokes. A skill whose `bmod.toml` already carries `[skill]` belongs to another module: it can be a dependency here, not a member. Say so.

## Propose

Show one plan and wait for a yes or changes:

- The shape: one skill with its own answers is the single-skill module; two or more, or a skill joining an existing record, is the multi-skill module. Load the shape file at the write step, not now.
- The code: short, lowercase, the user's org or the module's purpose, and not a module the user already has. Members carry it as prefix (`acme-...`, agents `acme-agent-...`); `bmad-` belongs to the bmad-code-org. Offer a rename for a member that lacks it, say that renaming changes how the skill is invoked, and let the user decline.
- `update_source`: the pushed repo, `github:<owner>/<repo>` or `github:<owner>/<repo>/<path>`; ask when it is not in the conversation.
- The config questions, one per path or setting the skills hardcode or share, each with `key`, `prompt`, `default` and `scope`. A value several skills read the same way is one question.
- The roster entries for agents, from each `customize.toml` `[agent]`.
- `help.md` drafted from each description: what it gives, when to recommend it, what to offer next.
- Dependencies: `bmad` required at the installed `bmod-core-tools` version; skills a member invokes as required or recommended, in the record when module-wide, in the member otherwise.
- The files it will write and the config reads it will change, by file.

## Write

On approval set `{target}`: the record folder `bmod-<code>/` for a multi-skill module, the skill folder for a single-skill one. Load `shapes/single-skill-module/shape.md` or `shapes/multi-skill-module/shape.md` and emit its files. Then rewrite each skill's config reads to `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key modules.<code>.<key>`, one call per skill with every key it needs, dropping the hardcoded value each replaces. Touch nothing else in the skills.

Load `ship.md`.
