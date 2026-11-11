# Rendered skill with customizable steps

Read this when the user asks how several teams can share one skill and still run different steps, or what `render_skill.py` is for. `bmad-build` is this shape.

A rendered skill keeps its steps as a template with switches and prose blocks. Before the skill runs, the project's `render_skill.py` fills the template from the skill's `customize.toml` merged with the team's and the user's override files, and the agent reads the rendered result. A team switches a step off, adds a rule or changes wording in its override file; nobody edits the skill, so the copies never drift.

It is worth the machinery only when teams genuinely differ in which steps run. A skill with one set of steps and a few settable values is a plain skill with a `customize.toml` (`help/craft-customization.md`). Jinja or `{{ }}` syntax in a skill that never renders is a defect the review catches, because the agent would read it verbatim.
