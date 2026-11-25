# Requirements

Turns any intent input (PRD, BRD, charter, brief, UX, transcript, `intent.md`, or notes) into a concise container ticket (`program-<slug>.md`, `initiative-<slug>.md`, `epic-<slug>.md`) with `Requirements`, `Constraints`, `Assumption:`, and `Open question:` lines plus backlinked companions. Sofia stays off `bmad-facilitate` and never invents product or UX discovery decisions.

{{ workflow.spec_before }}

## Workspace

The workspace is the container the user or calling skill names, else the active container; resolve an id or title as Dispatch in `workflow.md` says.

A missing container file is created first from `{{ workflow.ticket_template }}`, filling Description, Outcome, `Done when` (at this altitude), Boundaries (non-goals), and typed `References` from the input, with open questions in Notes; a later slice revises them. A new top-level container (`program-<slug>/`, `initiative-<slug>/`, or standalone `epic-<slug>/`), named from the input's title, is created and set active per On activation in `workflow.md`.

**No input.** Ask for a file path, pasted content, an explanation, or a source.

## Memory and derivation

`.memlog.md` is append-only, one line per entry; requirements carry their stable `R<n>`. Each run derives the derived lines (`Requirements`, `Constraints`, `Assumption:`, and `Open question:` lines) and every spec-authored companion from the memlog plus the sources it cites.

On a container, SPEC is the only writer of those derived lines; a change goes to the memlog, never into them by hand. A derive replaces those lines, updates `Done when` when derived from source OKRs or targets, sets `sources:` and `companions:` in the frontmatter, adds a References line per companion, sets `refined: true` on an epic once its Requirements are settled, and leaves the container's title, outcome, boundaries, and Notes untouched. A source id on a line must exist in a `sources:` file; neither list names the memlog, README files, or process records.

Writes go through `{skill-root}/scripts/memlog.py`:

- `uv run "{skill-root}/scripts/memlog.py" --project-root "{project-root}" init --workspace "<ticket folder>" --field topic="<the ticket's title>"` — once, at create.
- `uv run "{skill-root}/scripts/memlog.py" --project-root "{project-root}" append --workspace "<ticket folder>" --type <decision|constraint|requirement|assumption|question|direction|note|event> --text "<one-line gist, reason included>"` — one per line; batch them in one shell call per section.
- Terminal moments (a validation verdict, "spec finalized") are `--type event` entries; the memlog has no status field.

## The Operation

Run `tickets.py status` on the container first when a container file exists; when no container file exists yet, inspect the folder directly for existing run directories. Read the input, any linked `sources:`/`companions:`, and every final entry in `unadopted_runs` in **one pass**. Flag `status: draft` runs as unfinished work-in-progress rather than adopting them into `companions:` unless the user asks, and do not sweep brainstorm, research, or walkthrough folders into `companions:`.

When adopting a `prd-epic` whose `Changes to the parent` is not `None`, update the parent container ticket in the same pass (or name syncing the parent as the immediate next step).

With a `.memlog.md`, this is an update: read the memlog (authority on decisions and requirement ids) and re-read every file in `sources:`; preserve existing ids and give new requirements the next unused `R<n>`. A container with Requirements lines and no memlog is also an update: run `init`, then append each existing derived line keeping its ids.

An epic whose refinement settled that its parent's lines are its only input (the ids its `covers` names) gets one line per parent id, `R<n> (parent R<m>)`, in the parent's words, with no elicitation, self-validate, or memlog. When the parent changes, re-render those lines from the parent with ids kept.

Pre-sorted inputs keep their separation and stable ids (`R<n>` citing source ids in parentheses), with long tables or details placed in companions:

- `prd-program`: each `INIT-01`.. entry becomes a Requirements line from its outcome; `INV-N` becomes Constraints; wave OKRs set `Done when`.
- `prd`: each `E01`.. entry becomes a Requirements line from its outcome; `INV-N` becomes Constraints; tiered OKRs + measurement set `Done when`.
- `prd-epic`: group cohesive `E0X-FR-xx` (or `FR-N`) items into crisp capability `R<n>` lines listing every covered FR id explicitly in parentheses (no vague ranges; keep standalone FRs on their own line, and split when stories would divide one). Give each `Instrumentation` requirement its own `R<n>` line so stories own it via `covers`. Rules and invariants become Constraints; target OKR band and end checks set `Done when`.
- `brd` / `charter`: `BR-N` becomes Requirements, `RULE-N` becomes Constraints, and `OKR-N` sets `Done when`.
- Mixed input: sort each claim by the test in Load-bearing into Requirements, Constraints, or a companion.

Rich input: extract directly into the altitude's shape (Outcome, Requirements, Constraints, `Done when`, Boundaries, typed `References`).

Read stakes as hobby or personal use, internal, launch, or regulated or contracted. On sparse or non-PRD input with no success measure or OKR, first ask one crisp question — *"What proves this worked and how will we measure it?"* — and walk missing sections one at a time. Never invent product or UX answers or propose picks on open product questions; at regulated or contracted stakes, never invent a regulation, citation, or threshold.

At hobby or personal stakes (or already-settled work), keep it light and proceed directly unless the user asks for a specialist.

At real stakes (`internal`, `launch`, `regulated or contracted`), if open product or UX questions remain that the user cannot settle on the spot, record them as `Open question:` lines and write a new standalone epic thin with `refined: false`. Then stop and recommend starting a **fresh chat** with John (`bmad-agent-pm`) or Sally (`bmad-agent-ux-designer`) — unless the user explicitly skips discovery and supplies the answers (record skips as dated `Decision:` lines). Unaddressed domain implications (like healthcare silent on PHI) also become `Open question:` lines.

## Contradiction arbiter

A later memlog entry supersedes an earlier one. Whenever a new input, an `unadopted_runs` artifact, or a changed source conflicts with the memlog or another companion/source (for example, UX assuming anonymous access while PRD mandates verified accounts), surface both positions clearly to the user as fix (new memlog entry and re-derive, or update source) or ignore (`Decision:` line in Notes). Never pick a winner silently.

## Load-bearing

A claim is **load-bearing** if any consumer (downstream skill, implementing agent, verification pass) would change a decision without it.

## Companions

Load-bearing content needing more than one line (tables, diagrams, mockups, deep domain notes) stays in a backlinked companion; never pad the ticket with sub-bullets or copied prose.

- **Spec-authored** companions sit beside the ticket, named for their content; SPEC may edit them on update.
- **Adopted** files keep their names and are never edited or duplicated: upstream intent inputs SPEC derives from go in `sources:`, and downstream build or verification contracts (`prd-*`, `DESIGN.md`, `EXPERIENCE.md`, `arch-*`, `contract.yaml`, test docs) go in `companions:` (a PRD used for both sits in both).

## Spec Law

1. **Each Requirements line says what is possible and what shows it was met.**
2. **Requirements say WHAT, not HOW.** Implementation goes in a companion.
3. **Constraints bend design decisions.**
4. **Boundaries name at least one thing that is out.**
5. **Each `Done when` check is testable or demonstrable.**
6. **Requirement ids are never reused or renumbered.**
7. **Every load-bearing source claim lands in the ticket or a companion.**
8. **Every sentence in the ticket, companions, and `.memlog.md` carries load-bearing content.**

## Self-validate

{{ workflow.spec_self_validate }}

## When lines change

Offer to slice at most once per run, when the input reads as several independently shippable slices. Slicing runs per `slice.md`; load-bearing detail surfaced while slicing comes back here as an update, never into a child alone.

When an update changes or retires an id, name the stale entries and the tickets whose `covers` cite it, and offer to re-slice them per `slice.md`, Re-slicing; never edit a child.

## Output

In one or two sentences, report the container path, requirement count, adopted or written companions, and check verdict. List every `Assumption:` and `Open question:` line and any surfaced contradiction, inviting the user to confirm or hand off open discovery in a fresh chat; answers go to the ticket (and source if requested).

When ready, offer to slice (or re-slice stale children) per `slice.md`. On the repo store, user approval commits via `write` (`board.md`); with a tracker, it remains local in the tree until published.

{{ workflow.spec_after }}
