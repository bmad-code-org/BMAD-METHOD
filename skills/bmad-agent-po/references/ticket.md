# Writing a ticket

Ask only what is unsettled, with a default for each. Take a new ticket's `id` from `next_id` in `tickets.py status <folder>`. Open only the template for its type: `{{ workflow.ticket_template }}` (initiative, epic, story), `{{ workflow.spike_template }}` or `{{ workflow.bug_template }}`. Match its example's detail, not its content.

{{ workflow.refine_before }}

## Each fact lives in one place

Reference the Requirements of the ticket above; never copy them. Full criteria ("Reviewing or refining an existing ticket" says when) cover what changes, failure paths and binding decisions; point at the epic for the rest.

## Rules the template cannot carry

- Criteria use the template's format, each provable without pointing at code, together failing any wrong build. Behavior that must not change goes under Boundaries.
- Short plain sentences in the project's vocabulary, no invented terms. Offer the user a rewrite where their text breaks this.
- A reference is a References line, `type — location, section`; location is a path from `{project-root}` or a url, opened before citing; cite the nearest document. Before drafting, read `tickets.reference` from the store config (`read_store.py -k tickets`; the repo store has none).
- No source-code paths or snippets unless the snippet is the decision; a path the user wants kept goes in Notes.
- A UI ticket links its design in References; criteria stay functional. User-facing without a design: offer `bmad-ux`; if declined, warn that the builder will guess the layout unless Notes gives details.
- `hitl: true` only when a person does part of the work; name that step in the Description and list known steps in criteria or Notes.
- Risk on every ticket: `low`, `medium` or `high` business impact if wrong, proposed with a one-line reason; the user decides. A high-risk ticket names in Notes one check beyond its criteria.
- Record an `estimate` only when the user gives one, on the entry or frontmatter; never propose one.
- A bug carries reproduction steps and a cause hypothesis, never a fix; ask for missing steps, tighten unclear ones. Run them when cheap; if the behavior already holds, show the evidence and create nothing. Criteria name the other valid outcome: proof no change is needed.
- A spike names the question, who waits on it, and where the answer goes. A question several epics wait on is a shared decision per `slice.md`.
- Notes holds marked lines local to this ticket; what spans tickets goes in the parent's Notes, referenced. Confirm each `Assumption:` with the user; the answer is a dated decision. An `Open question:` is answered during the work. An `Unknown:` on a leaf file or an entry's `unknown` gates the start: settle it per `board.md`, or as a spike in its dependents' `after` when the user asks. Never guess. With a `.memlog.md`, `Assumption:` and `Open question:` lines go to the memlog first (`spec.md`, Memory and derivation).

## Reviewing or refining an existing ticket

A story with no file (`find` gives `story_file` null) is pulled first: `tickets.py pull <epic folder> <id>` writes a fixed layout, not the template. Leave done or dropped tickets and plans as they are.

A refine sets `refine = true` on the entry and `refined: false` in the file. `tickets.py next` lists under `ready_to_refine` every bug, entry with `refine = true`, and leaf with no entry.

`title`, `type`, `after` and `hitl` change in the file and the entry (the file's `after` and `hitl` win on `drift`); order lives in `tickets.toml`. Once published, changes also go through `write`.

**Review** — the next story, or more on request. Read the file, its epic file, and finished siblings and their plans. With the user, improve the ticket, order and prerequisites; run the Set check in `validate.md` when order or prerequisites change. Set neither `status` nor `refined`.

**Refine** — before the ticket starts. Read what a review reads, plus the code it touches. Where the code contradicts a Requirements line, add a `Source conflict:` line (the template's format) to the Notes of the container that owns the line, tell the user, and offer the correction through `spec.md`; tickets covering that id stay `refined: false` until a `Decision:` line settles it. Confirm prerequisites are done or in review and expand per the type's template and "Rules the template cannot carry".

**A ticket that already carries full criteria, or a container** — with the user, confirm they still agree, check it against its references, tracker state and the ticket above, and settle questions blocking implementation. A container may end in a re-slice per `slice.md`.

Preserve identity, `status`, `tracker_status` and assignee.

## Self-review before the user sees it

Check its level (an entry: description and verification approach; refined: runnable criteria, settled prerequisites), size (one agent session), references and consistency with the ticket above. Fix, then mention fixes that change intent.

## After approval

On the repo store, save through `write`; on a tracker it stays in the tree until published per `board.md`. A ticket with full criteria gets `refined: true` on the user's approval, then the Ticket check in `validate.md` before a build starts it. Then say the file's path and the next step: build it, or start it per `board.md`.

{{ workflow.refine_after }}
