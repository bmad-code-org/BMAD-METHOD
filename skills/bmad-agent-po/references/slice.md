# Slicing

An initiative is sliced into epics; an epic is refined, then planning it writes all its stories. When the user has a split in mind, use it and say where the rules below would cut differently.

{{ workflow.tickets_before }}

## Every container, in order

1. **Envelope.** A document in the folder is an input, not the container; a missing container is written from its input per `spec.md`.
2. **Requirements.** Unwritten spec sections are written per The Operation in `spec.md` from an input; an epic's are written when it is refined.
3. **Complete the container**: known unknowns in Notes, Outcome and Done when re-read against Requirements and Constraints. When the container was just written, confirm its scope with the user before slicing.

## Read the code

On an existing codebase, read enough code to see where deployment splits and which stories would touch the same code.

Where the code contradicts a Requirements line, add a `Source conflict:` line (the template's format) to the Notes of the container that owns the line, tell the user, and offer the correction through `spec.md`.

## One message, then revise

Before the draft is revised, one message holds what the spec and code show, each question that changes the split (first demo, least certain part, the team's epic rule) with your pick, and the draft in build order. Revise it in place until approved.

Offer to save a stated team rule as `slice_to_epics` (customize.toml).

Record each slicing choice, declined suggestions included, as a dated `Decision:` line in the container's Notes as it is made.

## Several initiatives

When the work is more than one initiative's worth, propose a parent initiative over several initiatives, not epics inside epics; every initiative keeps initiative, epic and story. The parent's file holds the Requirements and the decisions its children share. Draft its `tickets/tickets.toml` from `{{ workflow.tickets_template }}`: one `[[initiative]]` per child in build order, with an `id`, the child's folder name as `slug`, a `description` of what is true when it is done, the parent ids it `covers`, and an `after` naming what it needs from which child. Run the tree check in `validate.md`, present the draft, and revise it in place until approved.

On approval, create each child as its own `initiative-<slug>/` beside the parent, its file from `{{ workflow.ticket_template }}` with the parent's file in `sources:`; its Requirements, citing parent ids, are written per `spec.md` when it is taken up. A parent holds no epics or entries. Commit. To work a child, record it as `active_initiative` the way On activation in `workflow.md` does; `tickets.py status` on the parent shows every child.

## Initiative into epics

Revise or drop existing epics per `board.md`; add only when the user confirms the need.

{% if workflow.slice_to_epics %}
Draw boundaries by the team's own rule:

{{ workflow.slice_to_epics }}
{% else %}
- An epic is one source capability, or a tightly coupled pair, delivered and deployed together; two epics need at most a contract between them.
- A module, service, or bounded context is an epic boundary only when it is also a deployment boundary.
{% endif %}

Under either rule:

- One epic unless a distinct outcome or an early-usable part splits it. Offer to split an epic whose stories would run past the count in Epic into stories.
- A unit the work only consumes or configures is a touch point: list it in the initiative's Boundaries with its owning epic.
- The platform baseline (scaffold, CI, deployment) is the opening epic or the first stories of the first epic.
- Every epic delivers to production; its Done when includes integrated verification.

Draft the set as the initiative's `tickets/tickets.toml` from `{{ workflow.tickets_template }}`: one `[[epic]]` per epic in build order, each with an `id`, a `description` of what is true when it is done, the parent ids it `covers`, and an `after` naming what it needs from which epic; `after` on an epic file only for a whole-epic gate. Run the tree check in `validate.md`, then present the draft in build order, naming the rule that cut it, with each epic's boundary, the tracer path, touch points with owners, and decisions several epics share.

On approval, create each new epic's folder in the initiative's `tickets/` folder and its file from `{{ workflow.ticket_template }}`, written thin: Description, Outcome, Boundaries, Done when as far as known, References to the parent, `covers` and `after`, with `refined: false` and no Requirements. Commit (on a tracker, publish) per `board.md`.

Offer `bmad-architecture` to settle shared decisions in the architecture spine, cited in adopting epics' References. If declined, each becomes a `story` entry (`hitl = true`) in the opening epic's `tickets.toml`, written now, and each adopting epic gets `after = [{ epic = <opening>, needs = <the decision> }]`; planning keeps those entries first, ids kept.

Stop here unless the user wants to refine an epic now.

## Refining an epic

An epic with `refined: false` has its scope agreed, not its detail; refine it on request or before planning its stories. Read the epic file and the initiative Requirements lines it covers. In one message, scaled to the initiative (on a small one, a single question: does the epic need anything before stories?):

- What the epic, the initiative and their companions already settle for its stories.
- Each thing its stories would have to agree on that is still open, with your pick: settle it with the user now, plan a spike first when only code can answer it, or leave it to the stories.
- A reminder that the user can flesh the epic out further: more intent, as their own notes or a `bmad-prd` run on the epic; more design, as `bmad-ux` or `bmad-architecture` on the epic; or research with `bmad-deep-recon`.

A UX, architecture or PRD run the user chooses lands in the epic's folder, and SPEC adopts what it produces as a companion. Fill the epic in from the initiative's lines alone only when the user says to, or when it needs nothing more. Then write its Requirements per `spec.md`, re-read Outcome and Done when, set `refined: true`, and commit (on a tracker, publish) per `board.md`.

## Epic into stories

After the epic file, read its breakdown, child tickets, and results. Each blocking unknown is settled now per `board.md`, recorded as the `unknown` of the entries it blocks, or spiked if the user asks.

What makes a good story:

- One step toward the epic's Done when, sized for one agent session; it need not be user-visible. Too small when setup outweighs the work: merge. A one-session epic gets one story.
- {{ workflow.tickets_tracer_bullet }}
- Stories touching the same code form one ordered lane; an interface two lanes share gets a stub as its own early story.
- Done is one runnable check.
- Split, never shrink: "for now", "placeholder", "simplified", "wired later" is a second story.
- Setup and each hitl step go on the first story that needs them, initiative-wide setup in the opening epic. Tests go in every story; the only test story is the closing end-to-end suite.
- {{ workflow.tickets_story_count }}

What opens and closes the breakdown:

- Offer an opening refactor when code quality calls for one.
- {{ workflow.tickets_refactor_sweep }}
- Offer a closing end-to-end suite after the sweep if the source has a test plan or the user asks.

Draft the breakdown as the epic's `tickets/tickets.toml` from `{{ workflow.tickets_template }}`, run the set check in `validate.md`, and revise it in place with the user until approved. Beyond the template:

- `after`: if this epic has an `after` in the initiative's breakdown, add the provider to each entry that needs it: `<epic id>.<entry id>` once that entry exists, else `epic-<slug>`.
- `refine = true` only on request.
- When the user says the epic will build unattended, ask for `plan_checkpoint` and `done_checkpoint` per entry, proposing `plan_checkpoint` on risky ones.
- Each touch point this epic owns is an entry or part of one.

With the draft, name the tracer bullet, parallel work, and deferred scope; record the tracer bullet as a dated `Decision:` line in the epic's Notes.

A split while planning adds an epic (folder, envelope, `[[epic]]` with its `after`) and moves its covers ids and entries; no file is renamed.

Write no leaf file until its entry is pulled.

Run `tickets.py status <initiative folder>`. Repoint each ticket in this epic's `blocks` (under `epics`) to the entry it waits for. Clear any `unpinned_after`, `undeclared_after`, or `order_conflict`, then commit (on a tracker, publish), both per `board.md`.

Tell the user the entries are ready to build; for `bmad-build-auto`, a loop, or a factory, recommend reviewing each entry now (`ticket.md`).

## Re-slicing

When completed work changes the picture, revise unstarted entries and tickets in place with the user, keeping each `id`; run the set check before approval, commit (on a tracker, publish) per `board.md`, and record the reason in the epic's Notes.

{{ workflow.tickets_after }}
