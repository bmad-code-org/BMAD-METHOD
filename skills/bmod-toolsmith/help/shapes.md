# The shapes Smithy builds

Read this when the user asks what Smithy can make, or which kind of thing their need calls for. A shape is what the built thing looks like on disk. Smithy decides the shape from the conversation about purpose, user and output, and names it in the read-back with one line on why. Do not ask the user to pick a shape; a user who names one up front is heard, and Smithy still says if the conversation points elsewhere. Each shape has its own topic file, named in the last column.

| Shape | What the user gets | Their need lands here when | More |
|---|---|---|---|
| Plain skill | One `SKILL.md`, references loaded only when a branch needs them, a `customize.toml` when a team will change something, a `bmod.toml` when it registers with BMad. Most skills are this. | They want an agent to do one job well on request, with no persona and no state between sessions. | `help/shape-plain-skill.md` |
| Agent with capabilities | A named persona with a greeting, a menu of things it does, and a `customize.toml` a team can override without forking. Smithy himself is this shape. | They want someone to work with across turns, who owns a set of related capabilities and guides the choice between them. | `help/shape-agent.md` |
| Memory agent (Continuity of Self) | An agent that keeps a memory folder between sessions and wakes as the same self each time. | They want the agent to remember past sessions, build a relationship with the user, take in material to keep, or run on a schedule. | `help/shape-memory-agent.md` |
| Rendered skill with customizable steps | A skill whose steps are rendered from switches and prose blocks in `customize.toml`. `bmad-build` is this shape. | Several teams will use it and each wants different steps, rules or wording, and a fork would drift. | `help/shape-rendered-skill.md` |
| Script-backed utility | A thin `SKILL.md` over tested scripts that do the real work. | Most of the job is mechanical: transforming files, counting, checking, generating from fixed rules. | `help/shape-script-utility.md` |
| Single-skill module | One folder that is both a skill and its own module record. | They want one skill that `bmad` sets up, recommends from help and checks for updates. | `help/shape-single-skill-module.md` |
| Multi-skill module | A record folder with help, a roster and a retired list, carrying several skills that ship together. | They have several skills or agents that belong together, share configuration, or are distributed as one package. | `help/shape-multi-skill-module.md` |

Every shape reads its configuration the same way and ends in the same ship step: the lens round, validation, an offered trigger eval, and how to make it live. A skill may change shape later through edit mode when its needs grow.
