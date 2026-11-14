# Rendered skills and rendered agents

Read this when the user asks how several teams can share one skill or agent and still have it work differently for each, or what `render_skill.py` is for. `bmad-build` is a rendered skill.

## Rendered skill

A rendered skill keeps its steps as templates. Before the skill runs, the project's `render_skill.py` fills them from the skill's `customize.toml` merged with the team's and the user's override files, and the agent reads the rendered result. A team changes the skill at the points its author declared: a setting with named values that picks a route, an instruction block it replaces whole, or instructions added at activation or when the workflow completes. A value the skill cannot act on, such as a misspelled setting, stops the run with a clear message. A single run can override a value from the invocation. Nobody edits the skill, so the copies never drift.

It is worth the machinery only when teams differ in what the skill does, not only in a few values or standing facts. A skill with one set of steps and a few settable values is a plain skill with a `customize.toml` (`help/craft-customization.md`). Template syntax in a skill that never renders is a defect the review catches, because the agent would read it verbatim.

## Rendered agent

An agent with a persona and a menu (`help/shape-agent.md`) whose capability files are rendered the same way, so a team can change a rule inside one capability without forking the agent. Each capability declares its own points: instructions before and after, settings, and blocks a team replaces whole. The agent shows no menu: a request that names what the user wants runs the matching capability, and asked what it does, the agent answers in a sentence or two. Smithy builds this shape when the user wants an agent and teams must change what its capabilities do. A memory agent is never rendered.
