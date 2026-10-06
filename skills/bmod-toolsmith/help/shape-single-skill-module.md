# Single-skill module

Read this when the user has, or wants, one skill that `bmad` should know about: set it up, recommend it from help, check it for updates.

One folder is both the skill and its module record. Its `bmod.toml` carries a `[bmod]` table (code, version, update source, required skills, optional configuration questions, install messages) and an empty `[skill]` table that says the module's one skill is this folder. A `help/help.md` beside it tells the `bmad` help agent what the skill gives and when to recommend it. The folder keeps the skill's name; `bmad` finds the module by the `[bmod]` table.

What it gives over a plain skill: `bmad setup <code>` asks its questions and the skill reads the answers as `modules.<code>.<key>`; `bmad` help recommends it; update checks follow its source; another skill can require it by name. It is the default offer for a lone skill that needs a project-level answer (an output folder, a file it maintains, a style) or that the user simply wants registered. A skill with nothing to ask drops the questions block rather than shipping a placeholder question.

If a second skill arrives later, the record moves to a `bmod-<code>/` folder and both become members (`help/shape-multi-skill-module.md`). Package mode does that move.
