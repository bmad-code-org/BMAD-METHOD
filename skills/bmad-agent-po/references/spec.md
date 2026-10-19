# Requirements

Turns any intent input into a container's **derived lines**: the Requirements and Constraints sections and the `Assumption:` and `Open question:` lines, plus its companions.

{{ workflow.spec_before }}

## Workspace

The workspace is the ticket the user or the calling capability names, else the active initiative; a ticket named by id or title resolves as Dispatch in `workflow.md` says. A ticket with no file yet is created first from `{{ workflow.ticket_template }}`; at create SPEC also fills Description, Outcome, Done when (three to six checks at the altitude of the source's ids), Boundaries (the input's non-goals) and References from the input, open questions to Notes; a later slice revises them. A new initiative, named from the input's title, is created and recorded as On activation in `workflow.md` says.

**No input.** Ask for a file path, pasted content, an explanation, or a source.

## Memory and derivation

`.memlog.md` is append-only, one line per entry; requirements carry their stable `R<n>`. Each run derives the derived lines and every spec-authored companion from the memlog plus the sources it cites.

On a container, SPEC is the only writer of the derived lines; a change goes to the memlog, never into them by hand. A derive replaces exactly those lines, sets `sources:` and `companions:` in the frontmatter, adds a References line per companion, and touches nothing else. A source id on a line must exist in a `sources:` file; neither list names the memlog, README files or process records.

Writes go through `{project-root}/_bmad/scripts/memlog.py`:

- `uv run {project-root}/_bmad/scripts/memlog.py init --workspace <ticket folder> --field topic="<the ticket's title>"` — once, at create.
- `uv run {project-root}/_bmad/scripts/memlog.py append --workspace <ticket folder> --type <decision|constraint|requirement|assumption|question|direction|note|event> --text "<one-line gist, reason included>"` — one per line; batch them in one shell call per section.
- Terminal moments (a validation verdict, "spec finalized") are `--type event` entries; the memlog has no status field.

## The Operation

Read the input and what it links. With a `.memlog.md`, this is an update: read the memlog, the authority on decisions and requirement ids, and re-read every file in `sources:`; preserve the ids and give new requirements the next unused `R<n>`. A ticket with Requirements lines and no memlog is also an update: `memlog.py init`, then append each existing derived line as its own entry, ids kept. Otherwise this is a create. An epic whose refinement settled that its parent's lines are its only input (the ids its `covers` names) gets one line per parent id, `R<n> (parent R<m>)`, in the parent's words, with no elicitation, self-validate or memlog; when the parent changes, its lines are re-rendered from the parent, ids kept.

Pre-sorted input (a PRD, a brief from an upstream BMad skill): keep its separation; lift each requirement and constraint into its line with the source's id in parentheses (`R1 (FR-2, FR-5)`), overflow into companions. Mixed input: sort each claim by the test in Load-bearing into a Requirements or Constraints line or a companion.

The template's comments say what Requirements and Constraints hold at this altitude. Rich input: extract directly. Sparse input: name the gaps and walk them with the user one section at a time, Requirements then Constraints; if the user would rather move on, each gap is an `Open question:` line.

An unaddressed domain implication (healthcare silent on PHI) becomes an `Open question:` line; never invent the answer.

A later memlog entry supersedes an earlier one. A new input, or a source changed since the memlog last cited it, is read against the memlog and the other sources; each disagreement, and any either/or never resolved, is put to the user as fix (a new memlog entry, the lines re-derived) or ignore (a `Decision:` line in Notes), never settled silently.

When the user would rather work the idea itself out first, offer `bmad-product-brief` or `bmad-prd`.

## Load-bearing

A claim is **load-bearing** if any consumer (downstream skill, implementing agent, verification pass) would change a decision without it.

## Companions

Load-bearing content that needs more than one line (tables, diagrams, long reference material) goes in a companion; a line growing sub-bullets wants one.

- **Spec-authored** companions sit beside the ticket, named for their content; SPEC may edit them on update.
- **Adopted** companions (upstream artifacts such as `DESIGN.md`, pre-existing project docs) keep their names; SPEC lists them in `companions:` and never edits or duplicates them.

## Spec Law

1. **Each Requirements line says what is possible and what shows it was met.**
2. **Requirements say WHAT, not HOW.** Implementation goes in a companion.
3. **Constraints bend design decisions.**
4. **Boundaries name at least one thing that is out.**
5. **The Outcome's signal is testable or demonstrable.**
6. **Requirement ids are never reused or renumbered.**
7. **Every load-bearing source claim lands in the ticket or a companion.**
8. **Every sentence in the ticket, companions, and `.memlog.md` carries load-bearing content.**

## Self-validate

{{ workflow.spec_self_validate }}

## When lines change

Offer to slice at most once per run, when the input reads as several independently shippable slices. Slicing runs per `slice.md`; load-bearing detail surfaced while slicing comes back here as an update, never into a child alone.

When an update changes or retires an id, name the stale entries and the tickets whose `covers` cite it, and offer to re-slice them per `slice.md`, Re-slicing; never edit a child.

## Output

In one or two sentences, share the ticket's path, requirement count, the files written beside it, and whether the checks passed. List any `Assumption:` or `Open question:` lines, one each, and invite the user to walk through them; answers go to the ticket, and to the source too when the user wants it. When the ticket is a container, offer to slice per `slice.md`, or to re-slice what went stale. On the repo store, save it through `write` per `board.md`; on a tracker it stays in the tree until published.

{{ workflow.spec_after }}
