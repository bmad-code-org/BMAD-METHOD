# Multi-skill module

Read this when the user asks what a module is made of, or has several skills that belong together.

A module is a record folder, `bmod-<code>/`, beside the skills it ships, plus a small `bmod.toml` in each member. The record holds: a `SKILL.md` that only says "never invoke this, ask `bmad setup <code>`"; `bmod.toml` with the code, version, update source, the member list, required and recommended skills, configuration questions and install messages; `help/help.md`, read by the `bmad` help agent, with optional `help/<topic>.md` files for depth; `roster.toml` when a member is an agent, so `bmad` and party mode know who is available; `retired.toml` once a skill has been renamed or removed, so setup can clean up. Each member's `bmod.toml` names the record and the source, and lists what that skill alone requires.

Members carry the module's code as a prefix (`acme-release-notes`, agents `acme-agent-scout`); `bmad-` names belong to modules shipped by the bmad-code-org (`help/naming.md`). Configuration is asked once, in the record, and every member reads the answer the same way. A skill belongs to one module; one it uses from another module is a dependency, not a member.

Smithy reaches this shape when the read-back names two or more skills, when one skill joins a record that exists (`help/how-to-add-to-module.md`), or through package mode for skills already written.
