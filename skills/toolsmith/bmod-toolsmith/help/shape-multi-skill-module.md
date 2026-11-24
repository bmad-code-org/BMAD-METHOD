# Multi-skill module

Read this when the user asks what a module is made of, has several skills that belong together, or wants to plan a module before building it.

A module is a record folder, `bmod-<code>/`, beside the skills it ships, plus a small `bmod.toml` in each member naming the record. The record carries what `bmad` needs to set the module up, recommend its skills and check for updates: the member list, the skills it requires, the configuration questions setup asks, the module's help, a roster when a member is an agent (so `bmad` and party mode know who is available), and a retired list once a skill has been renamed or removed, so setup can clean up.

## Planning a module

When the user describes several skills that belong together, Smithy settles a module plan in discovery before building any of them: the module's code and folder, the member skills, the configuration questions they share, the roster of agents and any groups to meet together in party mode, and the build order. He saves the plan, then builds the members one at a time, each through a normal build with its own execution plan; the first build writes the record. A later session picks up from the saved plan.

## Rules the user sees

Members carry the module's code as a prefix (`acme-release-notes`, agents `acme-agent-scout`); `bmad-` names belong to modules shipped by the bmad-code-org (`help/naming.md`). Configuration is asked once, by `bmad setup <code>`, and every member reads the answer the same way. A skill belongs to one module; one it uses from another module is a dependency, not a member.

Smithy reaches this shape from a module plan, when one skill joins a record that exists (`help/how-to-add-to-module.md`), or through package mode for skills already written. A user who builds one skill and only expects more later gets a single-skill module under the planned code; the record moves out when the second skill arrives.
