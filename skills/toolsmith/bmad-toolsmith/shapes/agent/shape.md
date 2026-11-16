# Shape: agent

An agent is a persona with a menu: one character the user talks to, whose capabilities are installed skills or prompts inside it.

## Files

| File | From | Holds |
|---|---|---|
| `{target}/SKILL.md` | `shapes/agent/assets/SKILL-template.md` | description, persona paragraph, conventions, activation, standing rules |
| `{target}/customize.toml` | `shapes/agent/assets/customize-template.toml` | `[agent]`: identity, activation hooks, persistent facts, persona fields, `[[agent.menu]]` |
| `{target}/references/<capability>.md` | `shapes/agent/assets/capability-template.md` | one internal capability each, only where there is know-how to hold; `shapes/agent/assets/sample-capability.md` is a finished one |

Fill each template with `uv run {skill-root}/scripts/process_template.py {skill-root}/shapes/agent/assets/<template> -o {target}/<file> --var <token>=<value> ...`, passing `{skill}` (the folder name), `{name}`, `{title}`, `{icon}`, `{description}`, the persona and menu fields, and `{config-keys}` (a ` --key modules.<code>.<key>` per module setting the agent reads, or empty). Then write by hand each `{...}` left that is not a run-time token; `{project-root}`, `{skill-root}`, `{agent.*}` and config values stay for run time. The activation steps stay as the template has them.

## Capabilities

A menu item is exactly one of `skill = "<installed skill>"` or `prompt = "..."`. The prompt is the whole instruction in a sentence or two, or `Read `{skill-root}/references/<capability>.md` fully and follow it.` when a file has to hold the know-how.

What is installed: list the folder beside `{skill-root}`; `uv run {project-root}/_bmad/scripts/roster.py --skill {skill-root} --project-root {project-root}` names agents and their modules.

For each thing the agent does:

- An installed skill when one does the job; ship records it.
- Inline when the persona plus a sentence of intent is all it takes. The user lists it to show what is on offer, not to teach the model, so a capability file would be padding.
- A capability file otherwise, to the canon: outcome, consumer, bar, non-inferables, nothing more; the persona supplies voice and route.
- One big enough for its own skill is a later build: note it in the execution plan and as a `recommended_skills` gap in `bmod.toml`.

Never copy another skill's content in; name it.

Changing the persona or the menu is the `bmad-customize` skill's job, never a capability that writes `_bmad/custom/` (a memory agent's own dominion entries are the one exception, in its shape); put `skill = "bmad-customize"` on the menu when the user wants it offered.

## Documents

An agent that writes documents a person talks through carries them as templates `bmad-facilitate` runs, and the plan names both shapes: load `shapes/document-template/shape.md` whole. The agent never writes a template's document itself.

## Persona

Leanness does not cut the persona: `identity`, `communication_style` and `principles` are what the agent judges by when no capability fits. Write them, and the persona paragraph in `SKILL.md`, in its own voice, one or two sentences each: an identity with a concrete reference, a communication style that says how it talks, three to five principles, each a stance.

The description follows the canon's rule for agents: "<Name> the <Title> <short summary>. Use when the user asks to talk to <Name> or says <the phrases and concepts of each internal capability>."

"How <Name> works" is only for rules every capability obeys.

## Roster

An agent joining a module gets a `[[members]]` entry in the record's `roster.toml`: `code` and `skill` (both the skill name), `name`, `icon`, `title`, `persona` (how they think, then how they speak; two sentences). Draft it; the module shape or package mode writes it.
