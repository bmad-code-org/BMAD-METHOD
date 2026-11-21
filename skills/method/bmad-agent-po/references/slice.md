# Slicing

The level comes from the work itself, never from team size or time: one story is a story; more than one story of one capability is an epic; several capabilities that share outcomes, invariants or nouns are an initiative; several initiatives are a program, a parent initiative. An initiative is sliced into epics; an epic is refined, then planning it writes all its stories. When the user has a split in mind, or the initiative's PRD carries an epic map, use it and say where the rules below would cut differently.

{{ workflow.tickets_before }}

## Every container, in order

1. **Envelope.** A document in the folder is an input, not the container; a missing container is written from its input per `spec.md`.
2. **Requirements.** Unwritten spec sections are written per The Operation in `spec.md` from an input; an epic's are written when it is refined.
3. **Complete the container**: known unknowns in Notes, Outcome and `Done when` re-read against Requirements and Constraints. When the container was just written, confirm its scope with the user before slicing, unless it was written from a PRD the user has just finished.

## Read the code

Before planning an epic's stories on an existing codebase, read enough code to see which stories would touch the same code.

Where the code contradicts a Requirements line, add a `Source conflict:` line (the template's format) to the Notes of the container that owns the line, tell the user, and offer the correction through `spec.md`.

## One message, then revise

Before the draft is revised, one message holds what the spec and code show, each question that changes the split (first demo, least certain part) with your pick, and the draft in build order. Revise it in place until approved. A split taken from a PRD's epic map carries no questions: show it once for confirmation.

Record each slicing choice, declined suggestions included, as a dated `Decision:` line in the container's Notes as it is made.

## Several initiatives

When the work is more than one initiative's worth, propose a parent initiative over several initiatives, not epics inside epics; every initiative keeps initiative, epic and story. The parent's file holds the Requirements and the decisions its children share. Draft its `tickets/tickets.toml` from `{{ workflow.tickets_template }}`: one `[[initiative]]` per child in build order, with an `id`, the child's folder name as `slug`, a `description` of what is true when it is done, the parent ids it `covers`, and an `after` naming what it needs from which child. Run the tree check in `validate.md`, present the draft, and revise it in place until approved.

On approval, create each child as its own `initiative-<slug>/` beside the parent, its file from `{{ workflow.ticket_template }}` with the parent's file in `sources:`; its Requirements, citing parent ids, are written per `spec.md` when it is taken up. A parent holds no epics or entries. Commit. To work a child, record it as `active_initiative` the way On activation in `workflow.md` does; `tickets.py status` on the parent shows every child.

## Initiative into epics

Revise or drop existing epics per `board.md`; add only when the user confirms the need.

When the initiative's PRD carries an epic map, the split is settled: one epic per entry, in the map's order, its description from the outcome the entry names and its `after` from what the entry needs from another epic.

Otherwise the epics are the initiative's cohesive capabilities: each is something a person could see working by itself, and one that takes an "and" joining two things which each stand alone is two.

Either way:

- A unit the work only consumes or configures is a touch point: list it in the initiative's Boundaries with its owning epic.
- Every epic delivers to production; its `Done when` includes integrated verification.

Draft the set as the initiative's `tickets/tickets.toml` from `{{ workflow.tickets_template }}`: one `[[epic]]` per epic in build order, each with an `id`, a `description` of what is true when it is done, the parent ids it `covers`, and an `after` naming what it needs from which epic; `after` on an epic file only for a whole-epic gate. Run the tree check in `validate.md`, then present the draft in build order, saying whether it came from the PRD's map or is your own cut, with each epic's boundary, the tracer path, touch points with owners, and decisions several epics share.

On approval, create each new epic's folder in the initiative's `tickets/` folder and its file from `{{ workflow.ticket_template }}`, written thin: Description, Outcome, Boundaries, `Done when` as far as known, References to the parent, `covers` and `after`, with `refined: false` and no Requirements. Commit (on a tracker, publish) per `board.md`.

Offer `bmad-architecture` to settle shared decisions in the architecture spine, cited in adopting epics' References. If declined, each becomes a `story` entry (`hitl = true`) in the opening epic's `tickets.toml`, written now, and each adopting epic gets `after = [{ epic = <opening>, needs = <the decision> }]`; planning keeps those entries first, ids kept.

Stop here unless the user wants to refine an epic now.

## Refining an epic

An epic with `refined: false` has its scope agreed, not its detail; refine it on request or before planning its stories.

An epic with open product questions the initiative and its companions do not answer (how it works for the user, its rules, what to measure) gets its own PRD: invoke John (`bmad-agent-pm`) for the epic PRD (`prd-epic`), naming the epic file, the initiative's PRD when there is one, and the epic's folder as the output. The document lands in the epic's folder and SPEC adopts it as a companion. More design is `bmad-ux` or `bmad-architecture` on the epic, and research is `bmad-deep-recon`; each lands in the epic's folder the same way.

With none open, or when the user says to, fill the epic in from the initiative's lines and what the PRD's epic map saved for this epic, and say why it needs no PRD.

Either way, write its Requirements per `spec.md`, re-read Outcome and `Done when`, set `refined: true`, and commit (on a tracker, publish) per `board.md`.

## Epic into stories

After the epic file, read its breakdown, child tickets, and results. Each blocking unknown is settled now per `board.md`, recorded as the `unknown` of the entries it blocks, or spiked if the user asks.

What makes a good story:

- A story is one complete capability a person can see working end to end and verify in one sitting. It is large on purpose: an epic may have one story, or a few. The steps inside it, such as a migration, an endpoint, a screen or its tests, are not stories: the build plans those itself, and they are never tickets.
- Too small when it cannot be verified as an outcome by itself: merge it into the story it serves.
- Stories touching the same code form one ordered lane.
- Done is one runnable check.
- Split, never shrink: "for now", "placeholder", "simplified", "wired later" is a second story.
- Each hitl step goes on the first story that needs it. Setup, the platform baseline included, is part of the first story that needs it and production delivery part of the last; neither is a story of its own. Tests go in every story; the only test story is the closing end-to-end suite.

Offer a closing end-to-end suite if the source has a test plan or the user asks.

Draft the breakdown as the epic's `tickets/tickets.toml` from `{{ workflow.tickets_template }}`, run the set check in `validate.md`, and revise it in place with the user until approved. Beyond the template:

- `after`: if this epic has an `after` in the initiative's breakdown, add the provider to each entry that needs it: `<epic id>.<entry id>` once that entry exists, else `epic-<slug>`.
- `refine = true` only on request.
- When the user says the epic will build unattended, ask for `plan_checkpoint` and `done_checkpoint` per entry, proposing `plan_checkpoint` on risky ones.
- Each touch point this epic owns is an entry or part of one.

With the draft, name parallel work and deferred scope.

A split while planning adds an epic (folder, envelope, `[[epic]]` with its `after`) and moves its covers ids and entries; no file is renamed.

Write no leaf file until its entry is pulled.

Run `tickets.py status <initiative folder>`. Repoint each ticket in this epic's `blocks` (under `epics`) to the entry it waits for. Clear any `unpinned_after`, `undeclared_after`, or `order_conflict`, then commit (on a tracker, publish), both per `board.md`.

Tell the user the entries are ready to build; for `bmad-build-auto`, a loop, or a factory, recommend reviewing each entry now (`ticket.md`).

## Re-slicing

When completed work changes the picture, revise unstarted entries and tickets in place with the user, keeping each `id`; run the set check before approval, commit (on a tracker, publish) per `board.md`, and record the reason in the epic's Notes.

{{ workflow.tickets_after }}
