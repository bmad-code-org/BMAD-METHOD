# Slicing

An initiative is sliced into epics: containers the product owner and developer own and complete.

Inception plans the whole selected epic so AI agents can build it. `{workflow.slice_to_epics}` and `{workflow.slice_to_tickets}` carry the recommended split; the user's preference comes first. `{workflow.ordering}` says what opens and closes a parent.

When an initiative has epics, every story is under an epic. Work that fits one epic is one epic. An initiative with no epics happens only at the user's request and is planned like an epic with stories directly underneath.

## Every container, in order

Apply this when authoring the initiative or incepting the selected epic.

1. **Envelope.** A document in the folder is an input, not the container. When the container file is missing, offer to create it from its template: title, a paragraph of intent, Outcome, Done when, boundaries, known decisions, and references. An epic also records its parent and the parent requirement ids it owns in `covers`. Done when is three to six checks at the altitude of the source's ids; it is the definition of the container and is never deferred.
2. **The requirement source at this altitude.** The container's own Requirements section holds it: the source's lines as stable ids, each mapping to a parent id in `covers`. A referenced numbered source replaces it; a numbered spec anywhere in the container's folder is that source. Offer `bmad-spec` only when the source outgrows the section or the user asks; a `spec-<slug>/` beside the container then owns the ids, and `covers` still maps them upward. The architecture spine, UX design, and research inform everything below either way.
3. **Complete the container** per `{workflow.container_definition}` and `ticket.md`: the requirement source, References, and a re-read of Outcome and Done when against it. Propose the fields together with reasons, discuss what is unsettled, and confirm before slicing. With estimation on, offer an imagined-split size per `estimate.md`; XL is the cue to offer splitting the epic first.

## Learn the codebase and team first

Start from the parent chain: the parent ticket, its spec, and what they reference, including the design when the work is user-facing. Then the codebase: greenfield or brownfield; mono or poly repo; team, service, and UI boundaries; vocabulary and recorded decisions — from the architecture document, else the repo layout. Then the areas the slices will touch, enough to draw lanes that do not collide. Tell the user what you read and concluded; ask what is wrong or missing and whether there are other references or tools you do not already know of.

Where the source contradicts the code or another source, add `Source conflict: <id or section> — <what the source says> vs <what was found>` to the Notes of the container whose source it is, and tell the user. When the source is a BMad spec, offer to pass the correction to `bmad-spec`.

## Ask the questions that decide the split

Use what is already known. Ask the remaining questions that change the split: what is first worth demoing; what is least certain; what will the first piece teach about the rest; whether the user has a split in mind; how the team defines epics. Group related questions and say which answer you would pick and why.

When the user states how their team cuts epics, offer to save it as `slice_to_epics` under `[workflow]` in `{project-root}/_bmad/custom/bmad-preview-ticketing.toml`. It replaces the default, so keep the default lines the team still wants.

## Initiative into epics

Existing epics are the working set: read them first and refine in place, or drop one per `board.md` when it no longer fits; add only after the user confirms the set is insufficient. Draft the set, run the tree check in `validate.md` on the draft, then present it in recommended build order, and say in one sentence which rule cut it: for each epic, title, one to three sentences of what is true when it is done, the parent ids it owns, its boundary, and what it needs from the epics before it. Name the tracer path across epics when the first demo cuts through several. List every unit the source touches that gets no epic as a touch point with the epic that owns it. With it, list the decisions more than one epic must adopt: a contract, a message or data format, a shared value list. One repo or one unit has none. Work with the user on order, boundaries, merges, splits, and anything unplaced.

On confirmation, write the initiative's `tickets.toml` from `{skill-root}/assets/tickets-template.toml`: one `[[epic]]` per epic in build order, each with an `id`, `after` naming what it needs and from which epic; `after` on an epic file only for a whole-epic gate. Each new epic gets its folder and envelope with Outcome and Done when.

For the decisions more than one epic must adopt, offer `bmad-architecture` to settle them in the spine, and cite the spine section in each adopting epic's References. Declined: add each as a `story` entry (`hitl = true`) in the opening epic's `tickets.toml`, and give each adopting epic `after = [{ epic = <opening>, needs = <the decision> }]`; its entries name that entry in `after` at their inception.

Stop at this level unless the user wants to incept an epic now; complete and plan only the selected epic. The others retain their scope, references, and place in the order without a breakdown.

## Epic into stories

The epic is ready to be worked and its spec exists or the user chose to go without. Read its breakdown, every child ticket, and their results before proposing changes. Plan the entire epic per `{workflow.slice_to_tickets}` and `{workflow.ordering}`, not only its next story. Put each unknown that must be settled before implementation to the user: answer it now, record it as the `unknown` of the entries it affects, or add a spike when they ask for one. Never guess the design of work that depends on it.

Draft one breakdown in build order, each entry with an `id` it keeps for good, run the set check in `validate.md` on the draft, then present it. Each entry names its type and title, `hitl` when needed, requirement ids and what it delivers toward them, its prerequisites, what exists when it is done, how that result will be verified, known uncertainty, and `refine` per `{workflow.refinement}`; when the epic will run unattended, also ask for `spec_checkpoint` and `done_checkpoint` per entry. Each touch point this epic owns is an entry or part of one. Name the tracer bullet, what can run in parallel, and any deferred scope. Give an entry `references` for the spine section, design screen, or document it needs beyond the epic's own References. With the approval question, ask once whether the user wants to change a description or add a note or reference to any entry; `notes` holds only what the user said, in their words. Adjust size, order (the order of the tables), and prerequisites with the user until they approve the set; past the size in `{workflow.slice_to_tickets}`, offer a split first. A split at inception is a second epic folder and envelope, a new `[[epic]]` in the initiative's breakdown with its `after`, the covers ids moved, and the agreed entries placed under the right epic; no file is renamed.

For each `after` on this epic in the initiative's breakdown, put the provider in `after` of every entry that needs it: `<epic id>.<entry id>` when the providing entry exists, `epic-<slug>` until it does.

On approval, write the whole set into the epic's `tickets.toml` from `{skill-root}/assets/tickets-template.toml`, one sentence each for `description` and `verify`. No leaf file is written until its entry is pulled. With estimation on, each entry carries its points.

Then run `uv run {skill-root}/scripts/tickets.py --project-root {project-root} status <initiative folder>`. In `epics`, this epic's `blocks` lists the tickets in other epics whose `after` names the whole epic; replace each with the entry that delivers what it waits for. Add the prerequisite for every `unpinned_after` it reports.

Record the breakdown's decisions in the epic's Notes as dated `Decision:` lines — tracer bullet, sequencing, deferred scope. Publication follows `board.md`.

Then tell the user the entries are ready to build, and what that means for how they build. With `bmad-build`, each ticket is refined during the build: the builder questions the user and writes the criteria itself, so refining here repeats that work. With `bmad-build-auto`, a loop, or a factory, nobody answers questions during the build and the entry is all the builder gets: recommend one more review of the sequence and of each entry now, and offer the checkpoints where none are set.

## Pulling and refining a ticket

Resolve what the user names with `uv run {skill-root}/scripts/tickets.py --project-root {project-root} find <folder> <ref>` first: `<epic id>.<entry id>`, an entry id inside the epic folder, a tracker id, a file name, or words from the title; it returns one ticket with its `path` (null until pulled) and `folder`. Pull with `tickets.py pull <epic folder> <id>` (same `--project-root`): it writes `<type>-<slug>.md` from the entry in a fixed layout, no `status` line and only the fields the entry sets (`refined: false` when it asks for refinement), ending with an empty `## Plan` for the coding agent; an absent field reads as empty. The templates apply only to tickets you write. From then on the file is truth. The entry keeps `id`, `type`, `title`, `after`, and `hitl` current; its content fields are not maintained after pull. Refinement edits go to the file, and through `write` once published; a changed `after` goes to the file and the entry both, since the file's wins and `tickets.py status` flags the difference as `drift`. Reordering is still moving tables in `tickets.toml`. Where the file's and the entry's `after` differ, the script uses the file's and `tickets.py status` marks the row `drift`.

A pulled ticket goes to the builder as it is, with its epic: the builder plans story criteria from the epic's Requirements and Done when, the entry's description, and its `Verify:` check, which it may extend and never weaken.

Refining follows `{workflow.refinement}`. For an epic's stories — the next one by default, several or all on request — pull the file when the entry has none, then review the file with the user: read it, its source, the finished siblings and their build records; improve description, `Verify:`, references, and notes in the file; adjust order (move tables) and prerequisites, and run the set check on the revised draft when they change. When the user approves the reviewed file, set `refined: true`. A refined file has no `status`; it is intent that is ready for the build. No Given/When/Then unless the ticket is a bug, has no epic, its entry says `refine = true`, or the user asks.

For a ticket with no epic, a bug, and an entry where `pull` returns `refine: true`, expand the ticket before it starts. Read the ticket, its source, the finished siblings and the build records beside them, and the code it will touch at the revision the work starts from. A `Source conflict:` found here is recorded as above, and a ticket covering the conflicting id stays `refined: false` until a `Decision:` line settles it. Confirm its prerequisites are done and expand it per `ticket.md`: criteria, boundaries, references, and decisions. Resolve questions that prevent implementation; set `refined: true` when the user approves. A reply approves what was presented; publication and starting work are approved separately unless the user asks for them together. Refining alone does not change status or assignee.

When completed work changes the picture, revisit the whole remaining breakdown with the user. Update unstarted entries and tickets in place, preserving each `id`; published changes go through the store. Do not rewrite completed or active work as a new plan. Run the set check on the revised draft before the user approves it, and record the reason in the epic's Notes.
