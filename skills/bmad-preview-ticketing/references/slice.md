# Slicing

An initiative is sliced into epics: containers the product owner and developer own and complete.

Inception plans the whole selected epic so AI agents can build it: all anticipated tickets, their contributions, dependencies, verification approaches, and known uncertainty. Detailed acceptance criteria and implementation planning wait until each ticket is pulled. `{workflow.slice_to_epics}` and `{workflow.slice_to_tickets}` carry the recommended split; the user's preference comes first. `{workflow.ordering}` says what opens and closes a parent.

When an initiative has epics, every story is under an epic. An initiative with no epics is planned like an epic with stories directly underneath.

## Every container, in order

Apply this when authoring the initiative or incepting the selected epic.

1. **Envelope.** A document in the folder is an input, not the container. When the container file is missing, offer to create it from its template: title, a paragraph of intent, Outcome, Done when, boundaries, known decisions, and references. An epic also records its parent and the parent requirement ids it owns in `covers`. Done when is three to six checks at the altitude of the source's ids; it is the definition of the container and is never deferred.
2. **The requirement source at this altitude.** The container's own Requirements section holds it: the source's lines as stable ids, each mapping to a parent id in `covers`. A referenced numbered source replaces it; a numbered spec anywhere in the container's folder is that source. Offer `bmad-spec` only when the source outgrows the section or the user asks; a `spec-<slug>/` beside the container then owns the ids, and `covers` still maps them upward. The architecture spine, UX design, and research inform everything below either way.
3. **Complete the container** per `{workflow.container_definition}` and `ticket.md`: the requirement source, References, and a re-read of Outcome and Done when against it. Propose the fields together with reasons, discuss what is unsettled, and confirm before slicing. With estimation on, offer an imagined-split size per `estimate.md`; XL is the cue to offer splitting the epic first.

## Learn the codebase and team first

Start from the parent chain: the parent ticket, its spec, and what they reference, including the design when the work is user-facing. Then the codebase: greenfield or brownfield; mono or poly repo; team, service, and UI boundaries; vocabulary and recorded decisions — from the architecture document, else the repo layout. Then the areas the slices will touch, enough to draw lanes that do not collide. Tell the user what you read and concluded; ask what is wrong or missing and whether there are other references or tools you do not already know of.

## Ask the questions that decide the split

Use what is already known. Ask the remaining questions that change the split: what is first worth demoing; what is least certain; what will the first piece teach about the rest; whether the user has a split in mind; how the team defines epics. Group related questions and say which answer you would pick and why.

## Initiative into epics

Existing epics are the working set: read them first and refine in place, or drop one per `board.md` when it no longer fits; add only after the user confirms the set is insufficient. Present the proposed set in recommended build order: for each, title, one to three sentences of what is true when it is done, the parent ids it owns, its boundary, and what it needs from the epics before it. Name the tracer path across epics when the first demo cuts through several. Work with the user on order, boundaries, merges, splits, and anything unplaced.

On confirmation, write the order into the initiative's Breakdown, `after` naming what each epic needs from an earlier one; `blocked_by` on an epic only for a whole-epic gate. Each new epic gets its folder and envelope with Outcome and Done when. Run the tree check in `validate.md` against the initiative and these envelopes. Stop at this level unless the user wants to incept an epic now; complete and plan only the selected epic. The others retain their scope, references, and place in the order without story files.

## Epic into stories

The epic is ready to be worked and its spec exists or the user chose to go without. Read all existing child tickets and their results before proposing changes. Plan the entire epic per `{workflow.slice_to_tickets}` and `{workflow.ordering}`, not only its next story. Use a spike where an investigation must precede implementation; keep dependent work visible with the uncertainty stated rather than guessing its design.

Present one numbered breakdown in build order. Each entry names its type and title, `hitl` when needed, requirement ids and its contribution to them, blockers, what exists when it is done, how that result will be verified, and any unresolved question. Name the tracer bullet, what can run in parallel, and any deferred scope. Adjust size, order, and blockers with the user until they approve the set; past the size in `{workflow.slice_to_tickets}`, offer a split first. A split at inception is a second epic folder and envelope, a new line in the initiative's Breakdown with its `after`, the covers ids moved, and the agreed entries placed under the right epic; no file is renamed.

On approval, write the whole set into the epic's Breakdown in the template's line shape, then resolve `{workflow.creation}`: `on_pull` writes files only for the tracer bullet and whatever else is unblocked now; `at_inception` writes a file for every entry. A pulled entry keeps its nn. The user's request overrides. Each file comes from its type's template frontmatter, `status: draft`, `refined: false`, with parent, `covers`, `blocked_by`, `hitl`, and risk filled. Use sibling file names for local blockers so numbering and ticket ids stay distinct. Keep the Description and the `Verify:` line to a sentence each, add the nearest source in References, and put only ticket-local lines in Notes. Full criteria and implementation detail wait. With estimation on, each carries its points.

Record the breakdown's decisions in the epic's Notes as dated `Decision:` lines — tracer bullet, sequencing, deferred scope — then run the set check in `validate.md`. Fix or resolve gaps with the user before publication. Notes carry the decisions, Breakdown carries the entries, files carry the work; status lives on files only. Publication follows `board.md` and is separate from approving the split.

## Refining a story

When a ticket is pulled, read it, its source, the finished siblings and the build records beside them, and the code it will touch at the revision the work starts from. A document that contradicts the code goes to the user before criteria are written. Confirm its blockers are done and expand it per `ticket.md`: criteria, boundaries, references, and decisions. Resolve questions that prevent implementation; set `refined: true` when the user approves. A reply approves what was presented; publication and starting work are approved separately unless the user asks for them together. Refining alone does not change status or assignee.

When completed work changes the picture, revisit the whole remaining breakdown with the user. Update unstarted tickets in place, preserving identities; published changes go through the store. Do not rewrite completed or active work as a new plan. Re-run the set check and record the reason in the epic's Notes.
