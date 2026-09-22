# Writing a ticket

A ticket starts from what is known: what exists when it is done, how it will be verified, what must not change, and what is already decided. Ask only what remains unsettled, offering a default for each, then draft into the ticket tree. Under an epic with a breakdown, add the ticket's entry first, with the next unused `id`, placed where it goes in the build order. Open only the template for the type: `{workflow.initiative_template}`, `{workflow.epic_template}`, `{workflow.story_template}`, `{workflow.spike_template}`, or `{workflow.bug_template}`. Its placeholders say what each section holds; its example is the level of detail to match, not copied.

## Each fact lives in one place

The input (PRD, brief, notes) owns the product argument. The requirement source at a level is the container's own Requirements section, an existing numbered source, or a separate spec when the source outgrows the section. Reference that source rather than duplicating it. The container owns Description, Outcome, Done when, Boundaries, References, Notes. An epic's `covers` records the parent requirement ids it owns, and every id it assigns locally — in Requirements or its own spec — maps to one of them. An initiative's `covers` records its source ids. Adding a local spec does not replace upstream coverage; update affected references and child mappings with it.

A story under an epic is one slice of its build order: `covers` cites ids from the epic's requirement source, and its description says what it delivers toward them. Several stories can cover one requirement. Where full criteria are written (`{workflow.refinement}` says when), add criteria for what changes and for the failure paths, boundaries, and binding decisions; point at the source for the rest.

## Rules the template cannot carry

- Acceptance criteria, where `{workflow.refinement}` calls for them, follow `{workflow.acceptance_criteria}`; every sentence follows `{workflow.prose}`. When the user's text misses either, offer the rewrite with the reason; show what is missing, not only what is written.
- References name the nearest document, not the documents behind it. Attach per the store's `reference` global.
- No source-code paths or snippets; the builder reads the repo. A snippet stays only when it is the decision itself, not an illustration of it. A path the user wants recorded goes in Notes.
- A UI ticket links its design in References; criteria stay functional, layout lives in the design. No design and user-facing: offer `bmad-ux` first; declined, say the builder will guess the layout unless they add details in Notes.
- `hitl: true` only when a person must do part of the work; say which step in the Description, and spell known steps out in the criteria or Notes.
- Risk on every ticket, severity on a bug, proposed per `{workflow.scoring}` with a one-line reason; the user's value wins.
- A bug carries a reproduction and a cause hypothesis, never a fix. Missing steps: ask; unclear: tighten until someone else could follow them. Run them when cheap; if the behavior already holds, say so with evidence and create nothing. Criteria include tests for the condition found and fixed, and name the other valid outcome: proof no change is needed.
- A spike names the question, who waits on the answer, and where it is recorded. A spike is `hitl`. When tickets in more than one epic wait on the answer, it is a decision several epics adopt: handle it per `slice.md`, not as a spike inside one of them.
- Notes holds what is not in the repo or the source and what is unsettled, each line marked, and only what is local to this ticket. Anything touching more than one ticket lives in the parent's Notes and is referenced; an unknown that gates work goes to the user, and becomes a spike its dependents list in `after` only when they ask for one. `Assumption:` — offer each; confirmed, it becomes a dated decision; corrected, the ticket changes. `Open question:` — answering it is part of the ticket's work when it starts. Never resolve either by guessing.

## Refining an existing ticket

A story under an epic is refined per `slice.md`: pulled when it has no file, then reviewed in its file. Once a leaf file exists it is truth; the entry keeps only `id`, `type`, `title`, `after`, and `hitl` current, `after` edited in both places. For a ticket that carries full criteria: read the local ticket and open what it references; query its remote state if already published to a tracker. With the user: confirm they still agree with it; check its description against the current requirement source, criteria and references; find what is missing, unclear, or wrong; settle questions that prevent implementation. Save unpublished changes locally; published changes go through `write`. Preserve identity and any existing `status`, `tracker_status`, and assignee. A ticket keeps `refined: false` until it passes self-review in full and the user approves it. A container may end in a re-slice per `slice.md`.

## Self-review before the user sees it

Read it back at its current level of detail: an entry needs its description and verification approach; a refined ticket needs runnable acceptance criteria and settled prerequisites. Check size per `{workflow.slice_to_tickets}`, wording, references, and source consistency. Fix what you find; mention changes to the user's intent.
