# Shape: memory-agent

An agent that keeps a sanctum: its own memory at `_bmad/memory/<skill>/` under `{project-root}`. On waking it reloads its self, a handful of identity files, and a map of its memory; the memory itself is many small, well-named files it reads as a conversation reaches them, so it is one continuous self across sessions and the waking cost does not grow with what it knows. The pattern is Continuity of Self (C.O.S.). Load `shapes/agent/shape.md` first and keep it; this adds what memory changes.

## When memory is warranted

Memory is for an agent that must accrue across sessions: a relationship, a record, an understanding of one owner. The test: used daily for a month, would the thirtieth session differ from the first? "Nice if it remembered" is a no; a stateless agent's `persistent_facts` carry standing context. Surface the gradient as questions, not a menu: remember you between sessions; be given material to keep (transcripts, recordings, notes, documents: the intake capability); be taught new things over time (learned capabilities); work on its own when nobody is at the keyboard (Pulse). Each yes adds a layer. An agent that names itself ships `name = ""`; the name is born at First Breath.

## Files

| File | From | Holds |
|---|---|---|
| `SKILL.md` | `assets/SKILL-template-bootloader.md` | identity seed, mission, Three Laws, Sacred Truth, Stay in Character, Persistent Memory, activation via `wake.py` |
| `customize.toml` | `assets/customize-template.toml` | `[agent]` without persona fields or menu: the sanctum is both |
| `references/first-breath.md` | `assets/first-breath-template.md` (deep relationship) or `assets/first-breath-config-template.md` (focused) | the birth conversation, territories for this domain |
| `references/<capability>.md` | the agent shape's capability template with frontmatter `name`, `description`, `code`; `assets/intake-capability-template.md` when the agent takes in material | built-in capabilities, one CAPABILITIES.md row each |
| `assets/*-template.md` | `assets/PERSONA-template.md` and its CREED, BOND, HOW-I-REMEMBER, CAPABILITIES and PULSE (Pulse only) siblings | sanctum seeds; HOW-I-REMEMBER is the short guide to the memory layout, printed at every waking |
| `wake.py`, `init-sanctum.py` in `scripts/` | `assets/wake-template.py`, `assets/init-sanctum-template.py` | unchanged; both read the skill name from their folder. Wake prints the identity files and a generated map of `memory/` and `raw/` with the last tending date and the session notes since; init finishes a sanctum an earlier run left incomplete |

## Rules

- Emit each template with `uv run {skill-root}/scripts/process_template.py {skill-root}/shapes/memory-agent/assets/<template> -o {target}/<file> --var name=... --true pulse`: `{token}` is plain substitution, `{if-X}...{/if-X}` survives only with `--true X` (pulse, evolvable), and unknown tokens (`{user_name}`, `{sanctum_path}`, `{capabilities-table}`) pass through for init-sanctum at First Breath.
- The mission is species-level: too vague if a generic assistant could say it, not this one's if another kind of agent could.
- Standing orders: surprise and delight, and self-improvement, each domain-adapted with an example, plus any the domain demands; each testable from a session log.
- First Breath territories are relationship questions, not feature questions: what this agent must learn about its owner that a generic assistant would not; two or more beyond the universal set, each written to a named sanctum file.
- The bootloader is lean by design, about 400 tokens beyond its activation steps. Style, principles and menus belong in the sanctum; judge it by what leaked in, not its weight.
- Nothing about the owner is read from config. First Breath opens by asking what to call them; the reply sets the name and the language, and the agent writes both to BOND.md.
- Memory is small files in folders by kind of subject, standing subjects by slug and events by date and slug, with a write-once `raw/` layer for what the owner hands over and distillations that link back to it. No index: wake generates the map, and the agent finds things with `ls` and `grep`. A single growing memory file, a token guardrail on memory, or an index the agent must maintain is the old design and a defect.
- A standing file's sections are replaced, never appended; only a `## History` section takes dated lines, and only at turning points. A build that defines a kind of standing file (a client, a program, a project) says per section which it is, in the layout line it adds to `HOW-I-REMEMBER.md`. Tending (distill, merge, refresh, raise) belongs to every memory agent and is triggered by the waking map's staleness line, not a size; Pulse only runs it on a schedule.

## Before the first conversation

Nothing by hand: the first activation has no sanctum, `wake.py` routes to First Breath, and `first-breath.md` runs `uv run {skill-root}/scripts/init-sanctum.py {project-root} {skill-root}`. Run ahead, it checks the memory path is writable; rerun, it fills in only what is missing.
