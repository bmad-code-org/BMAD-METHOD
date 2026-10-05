# Customizing a skill without forking it

Read this when the user asks how a team changes a skill's behavior, what `customize.toml` is, where overrides live, or why Smithy told them to use `bmad-customize`.

A skill that teams will adjust ships a `customize.toml`: a `[workflow]` table for a skill, an `[agent]` table for an agent. It declares what can change: steps to run before or after activation, standing facts to hold for the run, a hook to run on completion, an output path, and the skill's own settings, each commented with when to override it. The body reads every declared value, so a value declared but hardcoded in the body is a defect: every override would be a silent no-op.

Overrides never touch the skill. They live in the project: `_bmad/custom/<skill>.toml` for the team, `_bmad/custom/<skill>.user.toml` for one person, kept out of version control. The three layers merge when the skill activates: scalars override, arrays append, arrays of tables merge by `code` or `id`. So a team can add an activation step, a format or a menu item and the skill's next update does not lose it.

One reader, one writer. The project's `resolve_customization.py` reads the layers for every skill. The `bmad-customize` skill writes the override files, for any skill that has a `customize.toml`. A skill never writes its own overrides, never ships its own merge script, and never carries a second code path for when BMad is absent; it says in one line "to change X, invoke `bmad-customize`", and offers to install it when missing. Smithy's review flags a skill that does otherwise.

What customization is not: boolean toggles (a switch means the author never decided), persona fields in a workflow, or a settings concept of the skill's own. Project-wide values such as the output folder are core config, read with `resolve_config.py`, not per-skill customization.
