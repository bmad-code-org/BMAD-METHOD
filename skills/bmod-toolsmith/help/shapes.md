# The shapes Smithy builds

Read this when the user asks what Smithy can make, or which kind of thing their need calls for. A shape is what the built thing looks like on disk. Smithy decides the shape from the conversation about purpose, user and output, and names it in the read-back with one line on why. Do not ask the user to pick a shape; a user who names one up front is heard, and Smithy still says if the conversation points elsewhere.

| Shape | What the user gets | Their need lands here when |
|---|---|---|
| Plain skill | One `SKILL.md`, references loaded only when a branch needs them, and a `bmod.toml` when it joins a module or is itself a single-skill module; a skill outside BMad has none. Most skills are this. | They want an agent to do one job well on request, with no persona and no state between sessions. |
| Agent with capabilities | A named persona with a greeting, a menu of things it does, and a `customize.toml` a team can override without forking. Smithy himself is this shape. | They want someone to work with across turns, who owns a set of related skills or capabilities and guides the choice between them. |
| Memory agent with a sanctum (Continuity of Self) | An agent that keeps a memory folder between sessions: who it is, who it works with, and what it has learned as small dated files by subject, with the raw material the user gave it kept alongside. It wakes, reads itself in, sees a map of what it remembers, and carries on. At its first waking it asks what to call the user. | They want the agent to remember past sessions, build a relationship with the user, or run autonomously on a schedule. |
| Rendered skill with customizable steps | A skill whose steps are rendered from switches and prose blocks in `customize.toml`, so teams change what runs without editing the skill. `bmad-build` is this shape. | Several teams will use it and each wants different steps, rules or wording, and a fork would drift. |
| Script-backed utility | A thin `SKILL.md` over tested scripts that do the real work deterministically. | Most of the job is mechanical: transforming files, counting, checking, generating from fixed rules. Prose would do it worse and differently every run. |
| Single-skill module | One folder that is both a skill and its own module record, with a help document for the `bmad` help agent. | They want one skill to install, update and set up as a unit, perhaps with its own configuration questions. |
| Multi-skill module | A module record with a roster, help documents and a retired list, carrying several skills that ship together. | They have several skills or agents that belong together, share configuration, or are distributed as one package. |

Every shape reads its configuration the same way and ends in the same ship step: validation, an offered trigger eval, and the install command. A skill may change shape later through edit mode when its needs grow.
