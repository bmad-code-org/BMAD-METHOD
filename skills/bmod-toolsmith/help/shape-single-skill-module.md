# Single-skill module

Read this when the user has, or wants, one skill that `bmad` should know about: set it up, recommend it from help, check it for updates.

One folder is both the skill and its module record. Its `bmod.toml` carries a `[bmod]` table (code, version, update source, required skills, optional configuration questions, install messages) and an empty `[skill]` table that says the module's one skill is this folder. A `help/help.md` beside it tells the `bmad` help agent what the skill gives and when to recommend it. The folder keeps the skill's name; `bmad` finds the module by the `[bmod]` table.

What it gives over a plain skill: `bmad setup <code>` asks its questions and the skill reads the answers as `modules.<code>.<key>`; `bmad` help recommends it; update checks follow its source; another skill can require it by name. It is the default registration for any lone skill in a BMad project, whether or not it has anything to ask; a skill with nothing to ask drops the questions block rather than shipping a placeholder question. Only a user who wants no record, or a project with no `_bmad/`, gets a plain skill instead.

If a second skill arrives later, the record moves to a `bmod-<code>/` folder and both become members (`help/shape-multi-skill-module.md`). Smithy does that move when you package the skills or build the second one into the module.
