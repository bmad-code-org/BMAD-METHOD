# Writing and refining a ticket

Ask only what is unsettled, offering defaults strictly on ticket shape, ordering, or verification mechanics — never invent product or UX answers. Take a new ticket's `id` from `next_id` in `tickets.py status <folder>`. Open only the template for its type: `{{ workflow.ticket_template }}` (`program`, `initiative`, `epic`, `story`), `{{ workflow.spike_template }}`, or `{{ workflow.bug_template }}`. Match its detail level, not its sample domain.

{{ workflow.refine_before }}

## Each fact lives in one place

A **Refined Story** (`story-<slug>.md`) — authored at epic inception by default, or at pickup for any story left thin, plus bugs and standalone `backlog/` leaves — is a verification contract pointing back to the epic ticket (when an epic exists) and its companions rather than a second spec. Epic stories cite the epic's `R<m>` and, when `prd-epic` exists, `E0X-FR-xx` ids (standalone `backlog/` leaves have no epic to cite); keep parent spec prose out and leave code paths and build tasks in Amelia's local `story-<slug>-plan.md`.

Full acceptance criteria ("Reviewing or refining an existing ticket" says when) use Given/When/Then to cover behavior changes, failure paths, binding decisions, and production measurement checks when the epic or OKR requires them; point at the epic for everything else.

## Rules the template cannot carry

- Criteria use the template's Given/When/Then format, each provable without pointing at code, together failing any wrong build. Behavior that must not change goes under Boundaries.
- Short plain sentences in the project's vocabulary, no invented terms. Offer the user a rewrite where their text breaks this.
- A reference is a References line, `type — [label](relative-path#section)` (a relative markdown link from the ticket file when local, or a url, opened before citing; cite the nearest document, and keep frontmatter `sources:`/`companions:` and `tickets.toml` `references` as plain paths). Before drafting, read `tickets.reference` from the store config (`read_store.py -k tickets`; the repo store has none).
- No source-code paths or snippets unless the snippet is the decision; a path the user wants kept goes in Notes.
- A UI ticket cites every UX artifact that exists for the work (`DESIGN.md`, `EXPERIENCE.md#<section>`, promoted mockup/wireframe paths) plus relevant `arch-epic` / `contract.yaml` / `AD-n` anchors in References while keeping criteria functional. If user-facing work has no UX design yet (at real stakes), offer Sally (`bmad-agent-ux-designer`) in a **fresh chat**; if declined, warn that the builder will guess layout and states unless Notes supplies them.
- `hitl: true` only when a person does part of the work; name that step in Description and list known steps in criteria or Notes.
- Risk on every ticket: `low`, `medium`, or `high` business impact if wrong, proposed with a one-line reason; the user decides. A high-risk ticket names in Notes one check beyond its criteria.
- Record an `estimate` only when the user gives one, on the entry or frontmatter; never propose one.
- A bug carries reproduction steps and a cause hypothesis, never a fix; ask for missing steps and tighten unclear ones. Run them when cheap; if the behavior already holds, show the evidence and create nothing. Criteria name the other valid outcome: proof no change is needed.
- A spike names the question, who waits on it, and where the answer goes. A question several epics wait on is a shared decision per `slice.md`.
- Notes holds marked lines local to this ticket; what spans tickets goes in the parent's Notes, referenced. Confirm each `Assumption:` with the user; the answer is a dated `Decision:`. An `Open question:` is answered during the work (for open product or UX questions, offer John or Sally in a fresh chat unless the user supplies the call).
- An `Unknown:` on a leaf file or an entry's `unknown` gates the start: settle it per `board.md`, or as a spike in its dependents' `after` when the user asks, rather than guessing. With a `.memlog.md`, `Assumption:` and `Open question:` lines go to the memlog first (`spec.md`, Memory and derivation).

## Reviewing or refining an existing ticket

A story with no file (`find` gives `story_file` null) is pulled first: `tickets.py pull <epic folder> <id>` writes a fixed layout, not the template. Leave done or dropped tickets and plans as they are.

Refining sets `refine = true` on the entry and `refined: false` in the file until approved. `tickets.py next` lists under `ready_to_refine` every bug, entry with `refine = true` whose file is not yet `refined: true`, and leaf with no entry.

`title`, `type`, `after`, and `hitl` change in both the file and the entry (the file's `after` and `hitl` win on `drift`); order lives in `tickets.toml`. Once published, changes also go through `write`.

**Review** — the next story, or more on request. Read the file, its epic file, companions, and finished siblings and their plans. With the user, improve the ticket, order, and prerequisites; run the Set check in `validate.md` when order or prerequisites change. Set neither `status` nor `refined`.

**Refine** — producing a **Refined Story** (at epic inception by default, or at pickup for any story left thin). Read what a review reads (when an epic exists), plus the code it touches when present. Where the code contradicts a Requirements line, add a `Source conflict:` line (the template's format) to the Notes of the container that owns the line, tell the user, and offer the correction through `spec.md`; tickets covering that id stay `refined: false` until a `Decision:` line settles it. Confirm prerequisites are declared or done and expand per the type's template and "Rules the template cannot carry".

**A ticket that already carries full criteria, or a container** — with the user, confirm they still agree, check it against its references, tracker state, and the parent above, and settle questions blocking implementation. A container may end in a re-slice per `slice.md`.

Preserve identity, `status`, `tracker_status`, and assignee.

## Self-review before the user sees it

Check its level (an entry: 1–2 outcome sentences and verification approach; Refined Story: runnable functional + measurement ACs, settled prerequisites, zero copied spec prose), size (one cohesive capability a person can verify end to end), design/contract references, and consistency with the epic above. Fix gaps, then mention fixes that change intent.

## After approval

Save the approved ticket to the repo store via `write` (`board.md`), or keep it local in the tree if using a tracker until published. Once the user approves full acceptance criteria, set `refined: true` and run the Ticket check in `validate.md` before starting execution. Report the file path and invite the user to start a fresh chat for `bmad-build` (or start it per `board.md`).

{{ workflow.refine_after }}
