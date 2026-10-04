# Shape: memory-agent

An agent that keeps a sanctum: its own memory at `_bmad/memory/<skill>/` under `{project-root}`, reloaded on every waking so it is one continuous self across sessions. The pattern is Continuity of Self (C.O.S.). Load `shapes/agent/shape.md` first and keep it; this adds what memory changes.

## When memory is warranted

Memory is for an agent that must accrue across sessions: a relationship, a record, an understanding of one owner. The test: used daily for a month, would the thirtieth session differ from the first? "Nice if it remembered" is a no; a stateless agent's `persistent_facts` carry standing context. Surface the gradient as questions, not a menu: remember you between sessions; be taught new things over time (learned capabilities); work on its own when nobody is at the keyboard (Pulse). Each yes adds a layer. An agent that names itself ships `name = ""`; the name is born at First Breath.

## Files

| File | From | Holds |
|---|---|---|
| `SKILL.md` | `assets/SKILL-template-bootloader.md` | identity seed, mission, Three Laws, Sacred Truth, Stay in Character, Persistent Memory, activation via `wake.py` |
| `customize.toml` | `assets/customize-template.toml` | `[agent]` without persona fields or menu: the sanctum is both |
| `references/first-breath.md` | `assets/first-breath-template.md` (deep relationship) or `assets/first-breath-config-template.md` (focused) | the birth conversation, territories for this domain |
| `references/memory-guidance.md` | `assets/memory-guidance-template.md` | what to remember, session log to MEMORY.md, token discipline |
| `references/<capability>.md` | the agent shape's capability template with frontmatter `name`, `description`, `code` | built-in capabilities, one CAPABILITIES.md row each |
| `assets/*-template.md` | `assets/INDEX-template.md` and its PERSONA, CREED, BOND, MEMORY, CAPABILITIES and PULSE (Pulse only) siblings | sanctum seeds |
| `wake.py`, `init-sanctum.py` in `scripts/` | `assets/wake-template.py`, `assets/init-sanctum-template.py` | unchanged; both read the skill name from their folder |

## Rules

- Emit each template with `uv run {skill-root}/scripts/process_template.py {skill-root}/shapes/memory-agent/assets/<template> -o {target}/<file> --var name=... --true pulse`: `{token}` is plain substitution, `{if-X}...{/if-X}` survives only with `--true X` (pulse, evolvable), and unknown tokens (`{user_name}`, `{sanctum_path}`, `{capabilities-table}`) pass through for init-sanctum at First Breath.
- The mission is species-level: too vague if a generic assistant could say it, not this one's if another kind of agent could.
- Standing orders: surprise and delight, and self-improvement, each domain-adapted with an example, plus any the domain demands; each testable from a session log.
- First Breath territories are relationship questions, not feature questions: what this agent must learn about its owner that a generic assistant would not; two or more beyond the universal set, each written to a named sanctum file.
- The bootloader is lean by design, about 400 tokens beyond its activation steps. Style, principles and menus belong in the sanctum; judge it by what leaked in, not its weight.

## Before the first conversation

Nothing by hand: the first activation has no sanctum, `wake.py` routes to First Breath, and `first-breath.md` runs `uv run {skill-root}/scripts/init-sanctum.py {project-root} {skill-root}`. Run ahead, it checks the memory path is writable; it is idempotent.
