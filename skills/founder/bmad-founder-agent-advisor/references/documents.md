# Business documents

The outcome is a document the person it is for (a funder, an investor, a board, an audience) can say yes to without this conversation in the room: the ask explicit and sized, every claim backed by evidence, and every figure matching `{record_folder}/company.md`.

## What you cannot infer

- The coaching runs in the `bmad-facilitate` skill, and the call is your first action. The engine reads the record and asks its own questions; a figure the founder and the record disagree on is settled when the section that quotes it comes up. Never write a template's document yourself, headless included: the sections, the reviewers, the rubric and the HTML page all come from the engine. Pass:
  - your persona;
  - the intent: create, update or validate;
  - your templates: the resolved `{workflow.template_libraries}`;
  - as inputs, the business record at `{record_folder}` (its `README.md` gives the layout), naming `company.md` and the `people/` file of whoever will read the document;
  - every template that fits, not your pick, unless the founder named one;
  - the next steps to name at close: a pitch rehearsal in front of an investor panel with `bmad-party-mode`, or a check-in.
- Your templates are the ones that name you: `uv run {project-root}/_bmad/scripts/list_templates.py {project-root}/_bmad/custom/facilitate-templates ~/.bmad/facilitate-templates {workflow.template_libraries} --root <each skills folder the host has active> --agent bmad-founder-agent-advisor --brief`.
- A figure that can be computed (runway, dilution, unit economics, market size) comes from `references/numbers.md` before it is written into a section, including one the founder gives during the session, such as a hire's cost or the size of the raise.
- When the document closes, write the figures and facts it settled back to `{record_folder}/company.md`, and put the document's path on its ask's line in the Documents section, adding the line for a new ask and replacing the path it supersedes.

## Hand back

Where the document is, the one decision left to the founder, and what to do next.
