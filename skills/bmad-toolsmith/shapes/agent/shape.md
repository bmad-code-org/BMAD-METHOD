# Shape: agent

An agent is a persona with a menu: one character the user talks to, whose capabilities are installed skills or prompts inside it. Smithy is one. Reach it when the user wants someone to talk to (a name, a role, a way of working) who does several related things. One job, no persona: a plain skill. Must remember between sessions: `shapes/memory-agent/shape.md`.

## Files

| File | From | Holds |
|---|---|---|
| `SKILL.md` | `assets/SKILL-template.md` | description, persona paragraph, conventions, eight activation steps, standing rules |
| `customize.toml` | `assets/customize-template.toml` | `[agent]`: identity, activation hooks, persistent facts, persona fields, `[[agent.menu]]` |
| `references/<capability>.md` | `assets/capability-template.md` | one internal capability each, only where there is know-how to hold; `assets/sample-capability.md` is a finished one (release notes: internal, the default) |

Build-time tokens: `{skill}` (folder name), `{name}`, `{title}`, `{icon}`, `{description}`, the persona and menu fields; `{project-root}`, `{skill-root}`, `{agent.*}` and config values are runtime.

## Capabilities

A menu item is exactly one of `skill = "<installed skill>"` or `prompt = "..."`. The prompt is either the whole instruction in a sentence or two, or `Read `{skill-root}/references/<capability>.md` fully and follow it.` when there is know-how a file has to hold. What is installed: list the folder beside `{skill-root}` (the skills root); `uv run {project-root}/_bmad/scripts/roster.py --skill {skill-root} --project-root {project-root}` names agents and their modules. For each thing the agent does:

- An installed skill when one does the job; ship records it.
- Inline when the persona plus a sentence of intent is all it takes. The user lists it so the menu shows what is on offer, not because the model needs teaching; a capability file for it would be padding.
- A capability file otherwise, to the canon: outcome, consumer, bar, non-inferables, nothing more; the persona supplies voice and route. The canon applies to each file as it does to a skill, and the description target to the agent's description. One big enough for its own skill is a new build after this ships: note it in the read-back and as a `recommended_skills` gap in `bmod.toml`.
- Never copy another skill's content in; name it.
- Changing the persona or the menu is the `bmad-customize` skill's job, never a capability that writes `_bmad/custom/`; put `skill = "bmad-customize"` on the menu when the user wants it offered.

## Persona

The leanness bar stops at the persona. `identity`, `communication_style` and `principles` are what the agent judges by when no capability fits; cutting them makes a worse agent. Write them, and the persona paragraph in `SKILL.md`, in its own voice, one or two sentences each: an identity with a concrete reference, a style with a simile, three to five principles, each a stance.

The description names persona and jobs: "<Name> the <Title> ... Use when the user asks to talk to <Name> or ...". The eight activation steps come over whole; edit only the config keys. "How <Name> works" is only for rules every capability obeys.

## Roster

An agent joining a module gets a `[[members]]` entry in the record's `roster.toml`: `code` and `skill` (both the skill name), `name`, `icon`, `title`, `persona` (how they think, then how they speak; two sentences). Draft it; the module shape or package mode writes it.
