# Memory agent (Continuity of Self)

Read this when the user asks how an agent remembers across sessions, what a sanctum is, how memory is kept and tended, or what First Breath and Pulse are. Build this shape only when the agent must accrue across sessions: used daily for a month, the thirtieth session should differ from the first. "Nice if it remembered" is a stateless agent with standing facts.

## The sanctum

The agent's memory lives at `_bmad/memory/<skill>/` in the project. The skill itself is a short bootloader: identity seed, mission, the Three Laws, the Sacred Truth (one continuous self, sleep not death), Stay in Character (never expose the machinery), Persistent Memory (write as you go), and an activation that runs `wake.py`. Everything about who the agent is lives in the sanctum, not the skill.

## What loads at waking

Five identity files, read whole: `PERSONA.md` (who I am), `CREED.md` (what I believe, mission, standing orders, boundaries), `BOND.md` (who I serve and what to call them), `HOW-I-REMEMBER.md` (how my memory is laid out and used), `CAPABILITIES.md` (built-in and learned abilities, tools). Then a generated map: each memory folder with its file count, the newest dated files, how many raw files are still undistilled, when memory was last tended and how many session notes came since, and anything pending. The memory itself is not loaded; the agent reads what a conversation reaches.

## How memory is kept

Small files, one subject each, under `memory/<kind>/`: a standing subject by slug (`memory/people/<name>.md`), an event by date and slug (`memory/decisions/2026-10-04-<slug>.md`, `memory/sessions/...`). A standing file says what is true now; its sections are replaced, never appended, except a `## History` section that takes a dated line only at a turning point. Material the user hands over (transcripts, recordings, notes, documents) goes to `raw/` as given, write-once, with `status: raw`; the agent distills it into subject files that link back, marks it distilled, and reads the distillations from then on. `memory/pending.md` holds what to raise next time; waking shows and clears it. No index: the agent finds things with `ls` and `grep`, and the map is generated.

## Tending

Memory stays good by being tended, not by growing. When the map shows session notes since the last tending, the agent distills raw files, merges duplicate subject files, refreshes standing files a recent session contradicted, raises what the user should hear, and stamps the date. Nothing is deleted for being old. Pulse, when enabled, runs the same pass on a schedule.

## First Breath and Pulse

The first activation finds no sanctum and runs First Breath: a conversation, not a form. It opens by asking what to call the user, which also settles the language, then learns the user and discovers its own mission; nothing about the user comes from config. Unfinished items, the agent's own name included, go to `memory/pending.md` for the next waking. Pulse is optional: the agent woken on a schedule with nobody at the keyboard, tending memory first and then doing the tasks its `PULSE.md` lists. The user can also teach new capabilities over time; they land in `capabilities/` and the agent knows them next session.
