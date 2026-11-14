# Shape: plain skill

A `SKILL.md` an agent follows, with references, scripts or assets only where the body would otherwise carry them.

## Files

| File | From | When |
|---|---|---|
| `{target}/SKILL.md` | `shapes/plain-skill/assets/SKILL-template.md` | always |
| `{target}/references/<topic>.md` | by hand | a branch the body only names, loaded when reached |
| `{target}/scripts/<name>.py`, `{target}/assets/<file>` | by hand | a fragile sequence, or a template the skill emits |
| `{target}/customize.toml` | `shapes/plain-skill/assets/customize-template.toml` | the user wants team customization |
| `{target}/bmod.toml` | the scaffold, `init_skill.py --bmod <record> --source <update_source>`; `ship.md` adds its dependency lists | the skill joins a module |

Fill each template with `uv run {skill-root}/scripts/process_template.py {skill-root}/shapes/plain-skill/assets/<template> -o {target}/<file> --var <token>=<value> ...`, passing `{name}`, `{title}`, `{description}` and, for a skill that writes a document, `{type}` (the document type, such as `adr`). Then write by hand each `{...}` left that is not a run-time token; `{project-root}`, `{skill-root}`, `{workflow.*}`, `{slug}` and config values stay for run time.

Before drafting, read `shapes/plain-skill/assets/sample-skill/SKILL.md`, a finished plain skill at the size to aim for.

## Rules

- The template carries the config call, the output path and the `bmad-customize` line, and `customize-template.toml` the standard keys: keep the steps this skill needs and add no key until a team asks for it.
- A skill outside BMad has plain paths and no `_bmad/` scripts, `customize.toml`, `bmod.toml` or activation section.
- Several operating modes get one reference each; one thing to do gets no router. A reference over about 100 lines opens with a table of contents.
- No README, changelog or install notes inside the skill.
- A script handles its own errors and says whether the agent runs it or reads it.
- The skill never saves, merges or falls back for its own customization; that is the `bmad-customize` skill's job.
