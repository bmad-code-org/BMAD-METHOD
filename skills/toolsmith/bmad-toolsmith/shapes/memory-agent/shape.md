# Shape: memory-agent

An agent that keeps a sanctum: its own memory at `_bmad/memory/<skill>/` under `{project-root}`. It wakes on its identity files and a memory map and reads small, well-named memory files as a conversation reaches them, so waking cost does not grow with what it knows.

Load `shapes/agent/shape.md` first and keep its rules for capability files, the description and the roster. Its Files section, menu, persona fields and activation steps do not apply: here every capability is a file `wake.py` lists, the sanctum holds the persona, and the bootloader has its own activation.

## What discovery's answers set

Material to keep brings the intake capability; new capabilities, `--true evolvable`; scheduled work with nobody present, Pulse and `--true pulse`.

Owning or tending work beyond its memory (a vault agent's workspace, a coach's client log; a pure companion owns nothing) sets `--true dominion`, which brings in the dominion text and First Breath's question about areas.

- An area whose path is the same in every install ships in `customize.toml`, as an `[[agent.dominion]]` entry in place of `dominion = []`, kept last in the file.
- An area whose path is the owner's to choose is asked at First Breath, not now. The agent writes it to its own `_bmad/custom/<skill>.toml` or `.user.toml`, the one override a skill writes itself.

A memory agent serves one owner. First Breath asks whether the repository is private to that owner or shared, and the answer decides whether the sanctum and the list of the owner's areas are committed and where loading in every chat is written; a build does not ask it.

## Files

| File | From | Holds |
|---|---|---|
| `{target}/SKILL.md` | `shapes/memory-agent/assets/SKILL-template-bootloader.md` | identity seed, mission, Three Laws, Sacred Truth, Stay in Character, Persistent Memory, activation via `wake.py` |
| `{target}/customize.toml` | `shapes/memory-agent/assets/customize-template.toml` | `[agent]` without persona fields or menu: the sanctum is both; `dominion` with the areas every install has, else empty |
| `{target}/references/first-breath.md` | `shapes/memory-agent/assets/first-breath-template.md` | the birth conversation, with the questions for this domain in `{discovery-questions}` |
| `{target}/references/<capability>.md` | `shapes/agent/assets/capability-template.md` with frontmatter `name`, `description`, `code`; `shapes/memory-agent/assets/intake-capability-template.md` when the agent takes in material | built-in capabilities, listed by `wake.py` from their frontmatter |
| `{target}/assets/*-template.md` | `shapes/memory-agent/assets/PERSONA-template.md` and its CREED, BOND, HOW-I-REMEMBER, CAPABILITIES and PULSE (Pulse only) siblings | sanctum seeds; HOW-I-REMEMBER is the short guide to the memory layout, printed at every waking |
| `{target}/scripts/wake.py`, `{target}/scripts/init-sanctum.py` | `shapes/memory-agent/assets/wake-template.py`, `shapes/memory-agent/assets/init-sanctum-template.py` | copied byte for byte; both read the skill name from their folder |

## Rules

- Emit each markdown template with `uv run {skill-root}/scripts/process_template.py {skill-root}/shapes/<shape>/assets/<template> -o {target}/<file> --var <token>=<value> ... --true <condition> ...`, with `--true` for each of `pulse`, `evolvable` and `dominion` the agent has. Tokens left unfilled (`{birth_date}`, `{agent_name}`) pass through for init-sanctum at First Breath, and `{project-root}` for the agent to resolve. Copy `wake-template.py` and `init-sanctum-template.py` byte for byte; never process them, since their f-strings look like tokens.
- The description follows the canon's rule for agents. An agent that names itself ships `name = ""` and a description without a name; First Breath sets the name and writes it into the description unless the skill is installed outside the project. That is the one edit an agent makes to its own `SKILL.md`; `wake.py` asks for it again after an update replaces the file. A shipped name goes into PERSONA.md when the sanctum is built.
- The mission in `SKILL.md` is the one every install shares: specific enough that neither a generic assistant nor another kind of agent could claim it.
- Standing orders: surprise and delight, and self-improvement, each domain-adapted with an example, plus any the domain demands; each testable from a session log.
- The templates carry the memory rules and are emitted as they are: First Breath before any other work, the owner's name and language learned in that conversation, small files by subject over a write-once `raw/` layer, a generated map, tending. A question, capability or script you add keeps to them: no First Breath question left unasked or counted as answered because it is parked in `memory/pending.md`, nothing about the owner read from config, no single growing memory file, no size limit on memory, no index the agent maintains.
- `{discovery-questions}` is what this agent must learn about its owner that a generic assistant would not: two or more questions, each naming the sanctum file or dominion area its answer goes to. They are what makes one agent's First Breath differ from another's: a companion or coach asks about the person, a working agent about how they work.
- Style, principles and menus belong in the sanctum, not the bootloader.
- The sanctum holds only what the agent learns. Nothing copies the skill's references or scripts into it, so an update reaches an agent already born, and the facts of the work go to dominion areas.
- A build that defines a kind of standing file says per section whether it is replaced or is a `## History` section taking dated lines, in the layout line it adds to `HOW-I-REMEMBER.md`.

## Before the first conversation

Nothing by hand: the first activation finds no sanctum, and First Breath builds it.
