# Shape: plain skill

A `SKILL.md` an agent follows, with references, scripts or assets only where the body would otherwise carry them.

Reach it when the execution plan names no persona or menu, no steps a team must swap, and judgment rather than a deterministic transform, or when no signal points elsewhere.

## Files

| File | From | When |
|---|---|---|
| `SKILL.md` | `assets/SKILL-template.md` | always |
| `references/<topic>.md` | by hand | a branch the body only names, loaded when reached |
| `scripts/<name>.py`, `assets/<file>` | by hand | a fragile sequence, or a template the skill emits |
| `customize.toml` | `assets/customize-template.toml` | the user wants team customization |
| `bmod.toml` | the scaffold, `init_skill.py --bmod <record> --source <update_source>`; `ship.md` adds its dependency lists | the skill joins a module |

Before drafting, read `assets/sample-skill/`, a finished plain skill at the size to aim for.

## Rules

- Frontmatter is `name` and `description` only. Every "when to use" lives in the description, none in the body.
- The body stays well under 500 lines.
- A reference is one level deep, `SKILL.md` to reference. One over about 100 lines opens with a short table of contents.
- Several operating modes get one reference each; one thing to do gets no router.
- No README, changelog or install notes inside the skill.
- Use prose where the agent judges, a parameterised pattern where a preferred way exists, a script where the sequence is fragile or every run would rewrite the same helper.
- A script handles its own errors and says whether the agent runs it or reads it.
- Inside BMad, a skill that writes a document puts it at `{output_folder}/{active_initiative}/<type>-<slug>/<type>-<slug>.md`, dropping `/{active_initiative}` when unset, both values from `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key core.active_initiative`.
- A skill in a module reads its own settings as `--key modules.<code>.<key>` in the same call.
- A skill resolves the `[workflow]` table with `resolve_customization.py` only when it ships a `customize.toml`.
- A skill outside BMad has plain paths and no `_bmad/` scripts, `customize.toml`, `bmod.toml` or template activation section.
- `customize.toml` carries `activation_steps_prepend`, `activation_steps_append`, `persistent_facts` and `on_complete`, plus `<type>_output_path` and `run_folder_pattern` when the skill writes an artifact. Nothing else goes in until a team asks for it.
- Changing a value is the `bmad-customize` skill's job, never the skill's own: no save command, no override writer, no merge script, no fallback reader for when `_bmad/` is absent. When users will change a value, one line in the body says to invoke `bmad-customize` naming the key, and offers `npx skills add bmad-code-org/BMAD-METHOD --skill bmad-customize` when it is not installed.
