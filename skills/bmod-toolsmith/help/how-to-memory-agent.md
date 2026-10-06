# How to: a memory agent

Read this when the user wants an agent that remembers them between sessions and asks what building and living with one looks like.

1. **The test first.** Smithy asks whether memory is warranted: used daily for a month, would the thirtieth session differ from the first? If not, he proposes a stateless agent with standing facts instead. The gradient comes as questions, not a menu: remember you between sessions; be given material to keep (transcripts, recordings, notes); be taught new things over time; work on its own on a schedule. Each yes adds a layer.
2. **Read-back.** The agent's name, or an empty name when it should name itself at First Breath; its mission at the species level, specific to this kind of agent; the territories First Breath will explore with you; its built-in capabilities; registration and location like any build.
3. **What Smithy writes.** A short bootloader `SKILL.md`, a `customize.toml` with the identity, a First Breath reference, a capability file where there is know-how to hold, the sanctum seed templates, and two scripts, `wake.py` and `init-sanctum.py`, unchanged from the shape.
4. **First waking.** The agent finds no sanctum and runs First Breath: it builds the sanctum, then opens by asking what to call you. Your reply sets your name and the language. It learns you through conversation, not a form, writes as it goes, and settles its own name and mission. Anything unfinished waits in `memory/pending.md` for next time.
5. **Every later waking.** It reloads its five identity files and a map of its memory, raises what is pending, tends its memory when session notes have built up, and carries on as the same self. You can hand it material to keep, teach it a capability, or ask it to review what it remembers.

Where memory lives: `_bmad/memory/<skill>/` in the project, as small files by subject (`help/shape-memory-agent.md`). The agent writes nothing about you from config; everything comes from talking to you.
