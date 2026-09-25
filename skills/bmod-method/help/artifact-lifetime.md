# Keep ticket state and evidence

Joined plans are live ticket state, including after work is done. Keep them beside their entries or backlog leaves. They preserve status, baseline revisions, implementation evidence, and review findings for later work and retrospective.

Before closing an epic, run `bmad-retrospective`, decide how to handle its findings, and close through `bmad-preview-ticketing`. Keep the epic, entries, plans, existing leaf files, and retrospective together. Deleting plans can turn completed entries back into planned work.

Scope ordinary agent reads to the active initiative and current epic in `AGENTS.md`. Historical plans are evidence, not a replacement for the current code. Superseded planning documents can be archived once their references and requirement sources remain accessible. Never remove live plans as part of that cleanup.

The output folder can be its own git repository, with commits as planning progresses. See `help/monorepo-and-polyrepo.md` for workspace layouts.
