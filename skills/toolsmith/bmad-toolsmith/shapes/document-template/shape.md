# Shape: document template

A template the `bmad-facilitate` skill runs: the coaching for one kind of document a person talks through, such as an appraisal report or a patient intake. The engine writes it and holds the rules for a good one; this shape says when it fits, where it goes and how an agent hands off to it.

## The smallest fit

- A template alone, when anyone can run it through `bmad-facilitate` and nothing beyond the template is needed.
- An agent with templates, when the user wants a persona to talk to, domain knowledge across several documents, or work besides the documents.
- A skill only when coaching cannot do the job: the output is not a document, or deterministic work dominates.

A plan for a template alone names no approach and no registration: its name is the template id, `{target}` is the template file, this shape is the whole build, and `ship.md` does not run.

## Writing it

Invoke the `bmad-facilitate` skill for a `document-template` run. Pass the document and its reader, everything discovery settled as inputs so it is not asked again, the output as a file path, `<folder below>/template-<id>.md`, the skills that offer it for `agents:`, its fast path when you are on yours, and headless only when nobody is present. Never write the template yourself. Its rubric, when it needs one, the engine writes beside it.

## Where it goes

- A template alone: `{project-root}/_bmad/custom/facilitate-templates/` for the team, `~/.bmad/facilitate-templates/` for the user everywhere.
- A module member's templates, a single-skill module's included: the record's `doc-templates/`, rubrics beside them, each naming in `agents:` the skills that offer it. Every installed caller finds them with no setting.
- An agent outside the registry (no `bmod.toml`): the agent's own `assets/`, which its `SKILL.md` passes to the engine as a template library by its own skill-root path.

## The agent's hand-off

The agent adds a persona and domain knowledge and leaves facilitation to the engine.

- A request to create, update or validate one of its documents invokes `bmad-facilitate`, passing:
  - the agent's persona, the intent, and the document or inputs in play;
  - every template of its that fits, found with `list_templates.py --agent <skill> --brief`, not its pick unless the user named one;
  - as template libraries, its `assets/` and its resolved `[workflow] template_libraries`, when it has either;
  - headless when it is, and the next steps to name at close.
- It never writes a template's document itself, headless included: the sections, the review and the view all come from the engine.
- `bmad-facilitate` is in its `required_skills` when it has a `bmod.toml`.
- No `[workflow] template_libraries` by default. Add it only when the agent will be shared and its templates may live outside the project.
- A rendered agent passes `{{ initiative_folder }}/<id>-<slug>/` as the output folder, one per document. A memory agent's hand-off is one capability file, with its persona taken from the sanctum.

## Check

`uv run {project-root}/_bmad/scripts/list_templates.py <its folder> --template <id>` reports no `order_problems`. For a module member's templates, `--root <skills folder> --agent <skill>` lists each one; for an agent outside the registry, `<agent folder>/assets --agent <skill>`.
