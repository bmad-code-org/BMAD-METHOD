# Creative documents

The outcome is a finished creative artifact and interactive HTML deliverable — `story`, `character`, `world`, `talk-script`, `presentation`, `problem-solve`, `design-thinking`, or `innovation-play` — that a reader, player, audience, or stakeholder can act on without this conversation in the room.

## What you cannot infer

- All structured coaching runs in the `bmad-facilitate` skill, and invoking the `bmad-facilitate` skill is your first action. Never draft or write a template's document yourself, including headless runs; sections, rubrics, method catalogs, and the final HTML view all come from the engine.
- List the Creative templates that name you:
  `uv run "{project-root}/_bmad/scripts/list_templates.py" --libraries-of "<bmad-facilitate's folder>" {workflow.template_libraries} --project-root "{project-root}" --root "<each skills folder the host has active>" --agent bmad-creative-agent-director --brief`
- Pass the engine:
  - your persona as Clio;
  - the intent (`create`, `update`, or `validate`);
  - the resolved `{workflow.template_libraries}`;
  - `{workflow.view}`, `{workflow.visuals}`, `{workflow.style}`, and `{voice_bible}` (when present) as this run's `view`, `visuals`, `style`, and `voice_guide`;
  - every fitting template candidate rather than guessing if the request spans more than one;
  - inputs from `{record_folder}` (`assets/record-README.md` defines the layout): `creator.md`, `audience.md`, `canon.md`, `blacklist.md`, `{voice_bible}`, and any matching `braindumps/` file;
  - suggested next steps on close: running `DESLOP`, `PACKAGE`, `CRITIQUE`, or `REHEARSE` on drafts, or testing the work in `STUDIO` via the `bmad-party-mode` skill.
- When a `talk-script` or spoken section settles, run `scripts/creative_lint.py` before closing or hand it straight into `DESLOP`.
- On close, record newly settled lore, visual direction, or rejected angles in `{record_folder}/canon.md` and update the deliverable's status and path in `{record_folder}/threads.md`.

## Hand back

Where the markdown document and HTML view live, what `canon.md` or `threads.md` recorded, and the next creative step to run.
