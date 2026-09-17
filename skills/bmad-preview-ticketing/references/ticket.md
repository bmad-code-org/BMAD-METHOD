# Writing a ticket

A ticket starts from what is known: what exists when it is done, how it will be verified, what must not change, and what is already decided. Ask only what remains unsettled, offering a default for each, then draft into the ticket tree. Open only the template for the type: `{workflow.initiative_template}`, `{workflow.epic_template}`, `{workflow.story_template}`, `{workflow.spike_template}`, or `{workflow.bug_template}`. Its placeholders say what each section holds; its example is the level of detail to match, not copied.

## Each fact lives in one place

The input (PRD, brief, notes) owns the product argument. The requirement source at a level is the container's own Requirements section, an existing numbered source, or a separate spec when the source outgrows the section. Reference that source rather than duplicating it. The container owns Description, Outcome, Done when, Boundaries, References, Notes. An epic's `covers` records the parent requirement ids it owns, and every id it assigns locally — in Requirements or its own spec — maps to one of them. An initiative's `covers` records its source ids. Adding a local spec does not replace upstream coverage; update affected references and child mappings with it.

A story under an epic is one slice of its build order: `covers` cites ids from the epic's requirement source, and its description names its contribution. Several stories can contribute to one requirement. On refinement, add criteria for what changes and for the failure paths, boundaries, and binding decisions; point at the source for the rest.

## Rules the template cannot carry

- Acceptance criteria follow `{workflow.acceptance_criteria}`; every sentence follows `{workflow.prose}`. When the user's text misses either, offer the rewrite with the reason; show what is missing, not only what is written.
- References name the nearest document, not the documents behind it. Attach per the store's `reference` global.
- No source-code paths or snippets; the builder reads the repo. A snippet stays only when it is the decision itself, not an illustration of it. A path the user wants recorded goes in Notes.
- A UI ticket links its design in References; criteria stay functional, layout lives in the design. No design and user-facing: offer `bmad-ux` first; declined, say the builder will guess the layout unless they add details in Notes.
- `hitl: true` only when a person must do part of the work; say which step in the Description, and spell known steps out in the criteria or Notes.
- Risk on every ticket, severity on a bug, proposed per `{workflow.scoring}` with a one-line reason; the user's value wins.
- A bug carries a reproduction and a cause hypothesis, never a fix. Missing steps: ask; unclear: tighten until someone else could follow them. Run them when cheap; if the behavior already holds, say so with evidence and create nothing. Criteria include tests for the condition found and fixed, and name the other valid outcome: proof no change is needed.
- A spike names the question, who waits on the answer, and where it is recorded. A spike is `hitl`.
- Notes holds what is not in the repo or the source and what is unsettled, each line marked, and only what is local to this ticket. Anything touching more than one ticket lives in the parent's Notes and is referenced; anything that gates work becomes a spike its dependents list in `blocked_by`. `Assumption:` — offer each; confirmed, it becomes a dated decision; corrected, the ticket changes. `Open question:` — answering it is part of the ticket's work when it starts. Never resolve either by guessing.
- A container's Breakdown lists its agreed children in order; the files in its folder are the children that exist; status lives on the files.

## Refining an existing ticket

Read the local ticket and open what it references; query its remote state if already published to a tracker. With the user: confirm they still agree with it; check its contribution against the current requirement source, criteria and references; find what is missing, unclear, or wrong; settle questions that prevent implementation. Save unpublished changes locally; published changes go through `write`. Preserve identity and the existing status and assignee. A thin ticket keeps `refined: false` until the full ticket passes self-review and the user approves it. A container may end in a re-slice per `slice.md`.

## Self-review before the user sees it

Read the ticket back at its current level of detail: a thin ticket needs its contribution and verification approach; a refined one needs runnable acceptance criteria and settled prerequisites. Check size per `{workflow.slice_to_tickets}`, wording, references, and source consistency. Fix what you find; mention changes to the user's intent.
