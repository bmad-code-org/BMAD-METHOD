# Slicing

The altitude comes from the work itself, never from team size or time:

- **Story:** a standalone single-story capability stays a story, never an epic.
- **Epic:** one cohesive capability (`epic-<slug>/`, standalone or inside an initiative); inside a multi-epic initiative (or from a PRD map), an epic may hold one story or a few.
- **Initiative:** multiple capabilities sharing outcomes, invariants, or nouns.
- **Program:** bounded initiatives under one portfolio (`program-<slug>/` nesting child initiatives under `tickets/`).

When a `prd-program` Initiative Map (`INIT-01`..), `prd` Epic Map (`E01`..), or `prd-epic` `Chunky story slice map` exists, adopt its names, boundaries, and scope verbatim (citing map ids in the container's `Requirements` lines while `tickets.toml` `id`s use integers from `next_id`). Flag only real code, invariant, or scope conflicts to the user rather than renaming or moving scope on your own.

{{ workflow.tickets_before }}

## Every container, in order

1. **Envelope & reconciliation.** Read the container file first when it exists, then run `tickets.py status` on the container (if no container file exists yet, inspect the folder directly). A document in the folder is an input, not the container; reconcile a missing container and all final `unadopted_runs` in one pass per `spec.md`, flagging `draft` runs as unfinished.
2. **Requirements.** Unwritten spec sections are written per The Operation in `spec.md`; an epic's are written when it is refined.
3. **Complete the container.** Confirm known unknowns in Notes, Outcome, and `Done when` against Requirements and Constraints. When the container was just written, confirm its scope with the user before slicing, unless it came from a PRD the user just finished.

## Read the code

Before planning an epic's stories on an existing codebase, read enough code to see which stories would touch the same code.

Where the code contradicts a Requirements line, add a `Source conflict:` line (the template's format) to the Notes of the container that owns the line, tell the user, and offer the correction through `spec.md`.

## One message, then revise

Before the draft is revised, one message holds what the spec and code show, any open slicing or ordering question with your pick (strictly on slicing, ordering, or dependency mechanics — never product or UX decisions), and the draft in build order. Revise it in place until approved. If open product or UX questions block the split, stop and recommend John or Sally in a fresh chat unless the user explicitly says skip and supplies the call.

A split taken verbatim from a PRD Initiative Map, Epic Map, or `Chunky story slice map` carries no slicing questions: show it once for confirmation. Record each slicing choice, declined suggestions included, as a dated `Decision:` line in the container's Notes.

## Program into initiatives

When the work spans multiple bounded initiatives under shared portfolio outcomes or cross-domain seams, propose a `program-<slug>/` (`type: program`), never epics inside epics; each child initiative keeps its own initiative, epic, and story layers.

Adopt `prd-program` (`INIT-01`..) verbatim when present; never cut rollout, migration, or pilot phases as initiatives (fold phased rollout into adaptive rollout gates). Draft `tickets/tickets.toml` from `{{ workflow.tickets_template }}`: one `[[initiative]]` per child in build order with `id`, child folder `slug`, `description`, parent `covers`, and `after` naming what it needs from another child. Run the tree check in `validate.md`, present the draft, and revise until approved.

On approval, create each child under `tickets/initiative-<slug>/` (`type: initiative`) from `{{ workflow.ticket_template }}` with the program file in `sources:`. Do not invent or write a child initiative's requirements before its own discovery/PRD; when a child is taken up with open product questions, recommend John (`prd`) in a fresh chat unless the user explicitly skips. Commit; to work a child, set `core.active_initiative` to `<program-slug>/tickets/<initiative-slug>` per `workflow.md` (`tickets.py status` on the program rolls up every child).

## Initiative into epics

Revise or drop existing epics per `board.md`; add only when the user confirms the need.

- **With a `prd` Epic Map:** the split is settled — adopt one epic per entry verbatim in the map's order, using its outcome for `description` and its dependencies for `after`.
- **Without a PRD:** enforce 1 capability = 1 epic (each something a person can see working by itself; a standalone single-story capability stays a story, never an epic, and a single-capability product stays a standalone `epic-<slug>/`; never mix `[[epic]]` and `[[entry]]` in one `tickets.toml`). Never cut rollout or pilot phases as epics — fold phased rollout into adaptive rollout/verification checks.

Either way:

- A unit the work only consumes or configures is a touch point: list it in the initiative's Boundaries with its owning epic.
- **Closed-loop OKRs:** map every OKR and baseline (including long-horizon targets) to an owning epic and instrumentation — or flag explicitly every unowned OKR or baseline as an unmapped gap in the container's Notes (`Open question:` or `Parked:`) before approval rather than leaving targets orphaned.
- Include integrated verification in each epic's `Done when` without forcing standalone go-live stories.

Draft `tickets/tickets.toml` from `{{ workflow.tickets_template }}`: one `[[epic]]` per epic in build order with `id`, `description` (outcome), parent `covers`, and `after` naming what it needs from which epic (`after` on an epic file only for a whole-epic gate). Run the tree check in `validate.md`, then present the draft in build order saying whether it came verbatim from the PRD map or is your cut, showing each epic's boundary, OKR/baseline ownership (plus any unmapped gaps), tracer path, touch points, and cross-epic decisions.

On approval, create each new epic under `tickets/epic-<slug>/` from `{{ workflow.ticket_template }}`, written thin: Description, Outcome, Boundaries, known `Done when`, parent References, `covers`, `after`, `refined: false`, and no Requirements. Commit (on a tracker, publish) per `board.md`.

Offer Winston (`bmad-agent-architect`, `arch-spine`) in a **fresh chat** when no architecture spine exists (and Sally `bmad-agent-ux-designer`, `ux-system` in a **fresh chat** for UI initiatives lacking UX). If an architecture spine is declined, shared cross-epic decisions become `story` entries (`hitl = true`) in the opening epic's `tickets.toml` with adopting epics adding `after = [{ epic = <opening>, needs = <the decision> }]`.

Stop here unless the user wants to refine an epic now.

## Refining an epic

An epic with `refined: false` has its scope agreed, not its detail; refine it on request or before planning its stories. Read the epic file first, then run `tickets.py status <epic-folder>` (`unadopted_runs`, `companions`) and reconcile any final unadopted epic runs via `spec.md` in one pass (flagging `draft` runs as unfinished).

**PRD judgment gate (never a mechanical rule):** Evaluate explicitly whether the parent ticket, its companions (`prd`, `ux-*`, `arch-*`), and saved epic notes already settle how it works for users, its business rules/edge cases/failure paths, and what proves its target OKR band. Give **one clear recommendation with reasons** (never a neutral coin toss):

- **Open product discovery remains (at real stakes):** stop and recommend a **fresh chat with John (`bmad-agent-pm`)** to create or update `prd-epic`, giving him the epic file, parent PRD (if any), and `<epic-folder>/prd-epic-<slug>/` (or the existing `prd-epic` run) as output. Never load John or `bmad-facilitate` inside Sofia's chat.
- **Settled by parent + saved notes + companions, hobby stakes, or user explicitly skips `prd-epic`:** explain why no epic PRD is needed, derive the epic ticket from the parent/inputs via `spec.md` (recording any user skip of open questions as a dated `Decision:`), re-read Outcome and `Done when`, set `refined: true`, and commit (or publish) per `board.md`.

**Unprompted UX & Architecture offers before slicing:** Before planning stories on any refined or unrefined epic at real stakes lacking these companions for **this epic** (a parent `ux-system` does not replace `ux-epic`, and with no prior decline recorded in Notes):

- **UI-bearing epic lacking `ux-*`:** unpromptedly offer a **fresh chat with Sally (`bmad-agent-ux-designer`, `ux-epic`)** so screen flows, states, `DESIGN.md`, `EXPERIENCE.md#<section>`, and mockups are settled before stories slice.
- **Shared non-trivial contracts, schemas/migrations, API/event payloads, or state flows lacking `arch-*`:** unpromptedly offer a **fresh chat with Winston (`bmad-agent-architect`, `arch-epic`)** against live code when present.
- Record any user decline as a dated `Decision:` in the epic's Notes. At hobby or personal stakes, skip unprompted specialist offers unless asked.

## Epic into stories

After the epic file, read its breakdown, child tickets, `companions:`, and `unadopted_runs` (reconciling final unadopted runs via `spec.md` first). Run any unprompted UX or architecture offer above before drafting `tickets.toml`, and settle each blocking unknown per `board.md` (`unknown` on blocked entries, or spiked if requested).

**Story sizing and slice source:**

- **With `prd-epic` `Chunky story slice map`:** adopt its story names, boundaries, FR coverage, and instrumentation assignments verbatim (flagging only real code/invariant conflicts).
- **Without a `Chunky story slice map`:** slice by cohesive end-to-end journeys sized by end-to-end verifiability in one sitting and clean review/context fit. Active epics typically hold 1–3 chunky stories (no fixed quota or cap; more may mean the epic is too large), never horizontal layers or topics (a migration, endpoint, screen, validation, or isolated config). Merge slices too small to verify as a real outcome; split only when independent workflows or failure domains cannot be verified together, or promote a second capability into a new epic.
- **No standalone setup or go-live stories:** fold setup and platform baselines into the first journey story that needs them, each `hitl` step onto the first story needing it, and validation, error handling, instrumentation, tests, and production delivery into the journeys they serve (deployment into the final journey story unless explicitly requested).
- **Shared code lane:** stories touching the same code form one ordered lane; offer a closing end-to-end suite only if a test plan calls for it or the user asks.

Draft `tickets/tickets.toml` from `{{ workflow.tickets_template }}` and revise with the user until the split is agreed:

- **1–2 sentence `description`:** keep each entry's `description` strictly 1–2 outcome sentences — never a mini-spec (full criteria live in the Refined Story).
- **Mandatory design & contract `references`:** every UI-bearing entry cites every UX artifact that exists for the epic (`DESIGN.md` — epic or inherited parent `ux-system`, `EXPERIENCE.md#<section>`, and promoted mockup/wireframe paths) plus any relevant `arch-epic` / `contract.yaml` / `AD-n` anchors, even when the epic's `References` already links the companion folder.
- **Closed-loop coverage:** every epic `R<n>` line (covering both `E0X-FR-xx` and instrumentation/measurement needs) lands in an owning story's `covers` (using the epic's leading `R<n>` ids so `tickets.py body` resolves them) and `verify`.
- **`after`, `refine`, & checkpoints:** copy parent epic `after` providers to the entries needing them (`<epic id>.<entry id>` or `epic-<slug>`), set `refine = true` by default (omit `refine = true` only when the user explicitly asks to build straight from a bare entry), and for unattended builds ask about `plan_checkpoint` / `done_checkpoint` (proposing `plan_checkpoint` on risky entries).

With the draft, name parallel work and deferred scope. A split while planning adds an epic (folder, envelope, `[[epic]]` with `after`) and moves its `covers` ids and entries without renaming files.

**Detail every story by default (at epic inception):** Once the split is agreed, pull and detail each entry into its **Refined Story** (`tickets/story-<slug>.md`) per `ticket.md` in the same chat (suggesting a fresh chat if context is heavy) — writing Given/When/Then functional + measurement criteria, boundaries, and opening every referenced file to confirm paths and `#section` anchors resolve. The user approves each story (`refined: true`). The user may opt to detail only the next story now and leave the rest as thin `refine = true` entries (which stay in `ready_to_refine`, not `ready_to_start`, until detailed at pickup).

Run the Set check in `validate.md` across the approved story set so every epic `R<n>` (both functional and instrumentation) is proven by at least one criterion and results satisfy `Done when`. Then run `tickets.py status <initiative folder>` (or epic folder if standalone), repoint any `blocks` entries waiting on this epic to the exact entry, clear any `unpinned_after`, `undeclared_after`, or `order_conflict`, and commit — or on a tracker, offer to publish **after** the stories are approved (`board.md`) so each story is sent once and complete.

Report the `ready_to_start` approved stories (and any `ready_to_refine` stories left thin), inviting the user to start a fresh chat for `bmad-build`.

## Re-slicing

When completed work changes the picture, revise unstarted entries and tickets in place with the user, keeping each `id`; run the set check before approval, commit (on a tracker, publish) per `board.md`, and record the reason in the epic's Notes.

{{ workflow.tickets_after }}
