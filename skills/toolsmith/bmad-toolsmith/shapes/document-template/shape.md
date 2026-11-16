# Shape: document template

A template the `bmad-facilitate` skill runs: the coaching for one kind of document a person talks through, such as an appraisal report or a patient intake. The engine writes it and holds the rules for a good one; this shape says when it fits, where it goes and how an agent hands off to it.

## The smallest fit

- A template alone, when anyone can run it through `bmad-facilitate` and nothing beyond it is needed.
- An agent with templates, for a persona to talk to, domain knowledge across several documents, or work besides the documents.
- A skill only when coaching cannot do the job: the output is not a document, or deterministic work dominates.

A template alone has no approach and no registration: its name is the template id, `{target}` is the template file, this shape is the whole build, and `ship.md` does not run.

## Writing it

Invoke `bmad-facilitate` for a `document-template` run, passing the document and its reader, what discovery settled as inputs, the output file `<folder below>/template-<id>.md`, the skills that offer it for `agents:`, and the fast path when you are on yours; headless only when nobody is present. Never write the template yourself; the engine writes any rubric beside it.

## Where it goes

- A template alone: `{project-root}/_bmad/custom/facilitate-templates/` for the team, `~/.bmad/facilitate-templates/` for the user everywhere.
- A module member's, a single-skill module's included: the record's `doc-templates/`, rubrics beside them, `agents:` naming the skills that offer each. Installed callers find them with no setting.
- An agent outside the registry (no `bmod.toml`): its own `assets/`, passed to the engine as a template library.

## The agent's hand-off

The agent adds a persona and domain knowledge; the engine does the facilitation, so the agent never writes a template's document itself, headless included.

- Create, update and validate invoke `bmad-facilitate` with:
  - the persona, the intent, and the document or inputs in play;
  - every template of its that fits, not its pick unless the user named one: `uv run {project-root}/_bmad/scripts/list_templates.py {project-root}/_bmad/custom/facilitate-templates ~/.bmad/facilitate-templates <its libraries> --root <each skills folder the host has active> --agent <skill> --brief`;
  - its libraries: its `assets/` and resolved `[workflow] template_libraries`, when it has either;
  - headless when it is, and the next steps to name at close.
- With a `bmod.toml`, `bmad-facilitate` is in `required_skills`; not installed, the agent offers `npx skills add bmad-code-org/BMAD-METHOD --skill bmad-facilitate`.
- `[workflow] template_libraries` only for an agent shared beyond the project whose templates may live elsewhere.
- A rendered agent passes no output path; the engine's default puts each document in its own folder under the initiative's. A memory agent hands off from one capability file, its persona from the sanctum.

## Check

`uv run {project-root}/_bmad/scripts/list_templates.py <its folder> --template <id>` reports no `order_problems`. A module member's templates list with `--root <skills folder> --agent <skill>`; an outside agent's with `<agent folder>/assets --agent <skill>`.
