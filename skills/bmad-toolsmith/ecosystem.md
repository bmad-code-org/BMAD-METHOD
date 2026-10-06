# Ecosystem

Loaded by `ship.md`. Its outcome: the skill names what it depends on, the user can install what is missing, and a module stays consistent when a skill joins it or replaces one.

## What is installed

Agents: `uv run {project-root}/_bmad/scripts/roster.py --skill {skill-root} --project-root {project-root}`. Modules and their help: `uv run {project-root}/_bmad/scripts/knowledge.py --root <skills root>`. Everything else: list the folder the user's agent reads skills from, and open a `SKILL.md` only when the name does not say what it does.

## Dependencies

From the discovery, decide for each installed skill: `required_skills` when the new skill invokes it, `recommended_skills` when it helps beside it, nothing otherwise. Write them into `bmod.toml` under `[skill]`: a plain name for a skill from the same source, `{ skill = "<name>", source = "<source>", version = "<min>" }` for another, version optional. For anything named but not installed, offer `npx skills add <repo> --skill <name>`; never run it unasked.

## Joining or replacing

When the built skill replaces another, record the old name in the module record's `retired.toml`: `renamed = [{ from, to }]` for a successor, `removed` for a skill that is gone. `bmad setup` then deletes the stale install and moves its `_bmad/custom/` files. When the skill sits beside others in a module, the record's `skills` list gains it, and `roster.toml` when it is an agent; edit both in place, matching the record's existing entries.

## Distribution

Smithy builds and packages offline. The install path from a public repo is `npx skills add <repo> --skill <name>`; say that and no more. When the user names a marketplace or registry, fetch its current docs then rather than describing it from memory.
