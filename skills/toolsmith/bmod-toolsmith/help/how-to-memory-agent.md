# How to: a memory agent

Read this when the user wants an agent that remembers them between sessions and asks what building and living with one looks like. How the memory itself works, First Breath and Pulse are in `help/shape-memory-agent.md`.

1. **Whether memory is warranted.** Smithy asks the test in `help/shape-memory-agent.md` and proposes a stateless agent with standing facts when it fails. The rest comes as questions, not a menu: remember you between sessions; be given material to keep (transcripts, recordings, notes); be taught new things over time; work on its own on a schedule. Each yes adds a layer. He also asks whether it owns or tends anything beyond its memory, such as a workspace, some folders or a journal.
2. **Execution plan.** The agent's name, or an empty name when it should name itself at First Breath; its mission, specific to this kind of agent; the questions First Breath will ask you; its built-in capabilities; registration and location like any build.
3. **What Smithy writes.** A short bootloader `SKILL.md`, a `customize.toml` with the identity, a First Breath reference, a capability file where there is know-how to hold, the sanctum seed templates, and the two scripts that build and wake the sanctum, copied from Smithy's own.
4. **First waking.** The agent runs First Breath with you. An agent that named itself adds the name to its description, so you can ask for it by name from the next session, and restores it at the next waking after an update. A global install skips that step, because it serves every project.
5. **Later.** Each session it wakes as the same self, raises what is pending and tends its memory. You can hand it material to keep, teach it a capability, or ask it to review what it remembers.

When Smithy's memory-agent scripts improve, Smithy's validate mode names an agent whose copies are behind, and edit mode brings them up to date. The agent's memory is not touched.
