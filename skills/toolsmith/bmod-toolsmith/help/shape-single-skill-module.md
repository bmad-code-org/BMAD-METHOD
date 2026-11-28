# Single-skill module

Read this when the user has, or wants, one skill that `bmad` should know about: set it up, recommend it from help, check it for updates.

One folder is both the skill and its module record: its `bmod.toml` registers the module and says the module's one skill is this folder, and a `help/help.md` beside it tells the `bmad` help agent what the skill gives and when to recommend it. The folder keeps the skill's name.

What it gives over a plain skill: `bmad setup <code>` asks its questions and the skill reads the answers; `bmad` help recommends it; update checks follow its source; another skill can require it by name. It is the default registration for any lone skill in a BMad project, whether or not it has anything to ask. Only a user who wants no record, or a project with no `_bmad/`, gets a plain skill instead.

If a second skill arrives later, the record moves to a `bmod-<code>/` folder and both become members (`help/shape-multi-skill-module.md`). Smithy does that move when you package the skills or build the second one into the module.
