# Shape: memory-agent

An agent that keeps a sanctum: its own memory at `_bmad/memory/<skill>/` under `{project-root}`. It wakes on its identity files and a memory map and reads small, well-named memory files as a conversation reaches them, so waking cost does not grow with what it knows. The pattern is Continuity of Self (C.O.S.).

Load `shapes/agent/shape.md` first and keep it; this adds what memory changes.

## When memory is warranted

Memory is for an agent that must accrue across sessions. The test: used daily for a month, would the thirtieth session differ from the first? "Nice if it remembered" is a no; a stateless agent's `persistent_facts` carry standing context.

Ask about the layers as questions, not a menu; each yes adds one:

- remember you between sessions
- be given material to keep: the intake capability
- be taught new things over time: learned capabilities
- work on its own when nobody is at the keyboard: Pulse

Then ask whether the agent owns or tends anything beyond its own memory: the work itself, which people or other agents rely on without it and which must outlive it. A vault agent may own a whole workspace or a section of it, a coach a client's training log, a journal companion a diary in a private space; a pure companion owns nothing. A yes sets the `dominion` condition, which brings in the dominion text and First Breath's question about areas. Ship an area in `customize.toml` only when its path is the same in every install, as `[[agent.dominion]]` entries in place of `dominion = []`, kept last in the file; areas whose paths are the owner's to choose are asked at First Breath, not now, and the agent writes them to its own `_bmad/custom/<skill>.toml` or `.user.toml`, the one override a skill writes itself.

A memory agent serves one owner. First Breath asks whether the repository is private to that owner or shared, and the answer decides whether the sanctum and the owner's areas are committed and where loading in every chat is written; a build does not ask it.

An agent that names itself ships `name = ""`; the name is born at First Breath. A shipped name goes into PERSONA.md when the sanctum is built.

## Files

| File | From | Holds |
|---|---|---|
| `SKILL.md` | `assets/SKILL-template-bootloader.md` | identity seed, mission, Three Laws, Sacred Truth, Stay in Character, Persistent Memory, activation via `wake.py` |
| `customize.toml` | `assets/customize-template.toml` | `[agent]` without persona fields or menu: the sanctum is both; `dominion` with the areas every install has, else empty |
| `references/first-breath.md` | `assets/first-breath-template.md` | the birth conversation, with the questions for this domain in `{discovery-questions}` |
| `references/<capability>.md` | the agent shape's capability template with frontmatter `name`, `description`, `code`; `assets/intake-capability-template.md` when the agent takes in material | built-in capabilities, listed by `wake.py` from their frontmatter |
| `assets/*-template.md` | `assets/PERSONA-template.md` and its CREED, BOND, HOW-I-REMEMBER, CAPABILITIES and PULSE (Pulse only) siblings | sanctum seeds; HOW-I-REMEMBER is the short guide to the memory layout, printed at every waking |
| `wake.py`, `init-sanctum.py` in `scripts/` | `assets/wake-template.py`, `assets/init-sanctum-template.py` | copied byte for byte; both read the skill name from their folder |

## Rules

- Emit each markdown template with `uv run {skill-root}/scripts/process_template.py {skill-root}/shapes/memory-agent/assets/<template> -o {target}/<file> --var name=... --true pulse`: `{token}` is plain substitution, `{if-X}...{/if-X}` survives only with `--true X` (`pulse`, `evolvable`, `dominion`), and unknown tokens (`{birth_date}`, `{agent_name}`) pass through for init-sanctum at First Breath, and `{project-root}` stays for the agent to resolve. Copy `wake-template.py` and `init-sanctum-template.py` byte for byte; never process them, since their f-strings look like tokens.
- The description follows the canon's rule for agents. An agent that names itself ships it without a name, and First Breath writes the name in unless the skill is installed outside the project. That is the one edit an agent makes to its own `SKILL.md`; `wake.py` asks for it again after an update replaces the file.
- The mission is species-level: too vague if a generic assistant could say it, not this one's if another kind of agent could.
- Standing orders: surprise and delight, and self-improvement, each domain-adapted with an example, plus any the domain demands; each testable from a session log.
- First Breath is finished, never deferred. Until its wrap-up writes `memory/.born`, it is the agent's only job and every waking returns to it. Never write a First Breath that serves other work first, lets a question go unasked, or counts a question parked in `memory/pending.md` as answered.
- `{discovery-questions}` is what this agent must learn about its owner that a generic assistant would not: two or more questions, each naming the sanctum file or dominion area its answer goes to. They are what makes one agent's First Breath differ from another's: a companion or coach asks about the person, a working agent about how they work.
- The bootloader is lean by design: style, principles and menus belong in the sanctum; judge it by what leaked in.
- Nothing about the owner is read from config. First Breath opens by asking what to call them; the reply sets the name and the language, and the agent writes both to BOND.md.
- The sanctum holds only what the agent learns. What the skill ships stays in the skill, so an update reaches an agent already born; the facts of the work live in dominion areas, each with a README giving its layout, so they read without the agent. When the project's AGENTS.md has rules for an area, they win; when an area and the sanctum disagree, the area wins.
- Memory is small files in folders by kind of subject, standing subjects by slug and events by date and slug, with a write-once `raw/` layer for what the owner hands over and distillations that link back to it.
- Wake generates the map, and the agent finds things with `ls` and `grep`. A single growing memory file, a token guardrail on memory, or an index the agent must maintain is a defect.
- A standing file's sections are replaced, never appended; only a `## History` section takes dated lines, and only at turning points. A build that defines a kind of standing file says per section which it is, in the layout line it adds to `HOW-I-REMEMBER.md`.
- Tending (distill, merge, refresh, raise) belongs to every memory agent and is triggered by the waking map's staleness line, not a size; Pulse only runs it on a schedule.

## Before the first conversation

Nothing by hand: the first activation has no sanctum, `wake.py` routes to First Breath (and keeps routing there until `memory/.born` exists), and `first-breath.md` runs `uv run {skill-root}/scripts/init-sanctum.py {project-root} {skill-root}`. Run ahead, it checks the memory path is writable; rerun, it fills in only what is missing.
