# Validation checks

`validate.md` assigns sections to agents.

## Ticket

- References open; no unfilled placeholders; assumptions marked.
- Nothing contradicts its epic file, its companions, the architecture, or a recorded decision.
- Each entry has a description, `unknown` when one is known, and a `verify` a non-builder can run; only bugs, `refine = true` entries, and leaves with no entry need full criteria before execution.
- A ticket needing full criteria and covering an id in a `Source conflict:` line with no later `Decision:` has `refined: false`.

{% if workflow.checks.ticket %}
{{ workflow.checks.ticket }}
{% endif %}

## Set

Every entry in the epic's `tickets.toml`, draft or committed, pulled or not.

- Tickets cover every Requirements line not deferred with the user; each `covers` id exists there; tickets sharing an id say which part each delivers.
- UX, architecture, constraint and integration work is covered without ids; results satisfy Done when; citing an id alone is not coverage.
- Every `after`, cross-epic too, is a real prerequisite, not restated order; once `tickets.toml` exists, `tickets.py status` on the epic shows no cycle, `drift`, `unpinned_after`, `undeclared_after`, or `order_conflict`; the epic's Notes hold a dated `Decision:` line naming the tracer bullet, and the sequencing decisions.
- A builder could write each story's acceptance criteria from the epic, entry, and references; if not, fix the epic, not the one-sentence `description` and `verify`.
- Tracer bullet, as rendered in `slice.md`: {{ workflow.tickets_tracer_bullet }}
- Refactor sweep, as rendered in `slice.md`: {{ workflow.tickets_refactor_sweep }}

{% if workflow.checks.set %}
{{ workflow.checks.set }}
{% endif %}

## Tree

The initiative, its `tickets.toml`, draft or committed, and the epic files once written; for a parent initiative, the child initiatives in place of epics.

- Every initiative requirement has an accountable epic or agreed deferral; shared ones say which part each epic delivers; no unexplained overlap.
- Each epic's `covers` cites parent ids; each Requirements line names in parentheses its parent id, or its source section if the parent lacks it; a child's `covers` resolves through the Requirements line to a parent id.
- Every source id on a Requirements line exists in a `sources:` file, every parent id in the parent's Requirements; every adopted design or architecture document is in `companions:`.
- Every unit the source touches is an epic, out of scope, or a touch point (consumed or configured only, named in the initiative's Boundaries with its owner).
- Each decision several epics adopt has one home: an architecture spine section, or an opening-epic entry (first `[[epic]]`) the others wait on.
- Every written epic file has Outcome, Done when (including production delivery), Boundaries, its `covers`, and references; one with `refined: false` needs no Requirements or breakdown yet; the initiative's `tickets.toml` lists every epic in build order, each `after` naming what it needs, and `tickets.py status` on the initiative shows no cycle or `order_conflict`; it opens with a platform-baseline epic, or its first epic's first stories, or a `Decision:` line saying why not.
- A parent initiative's `tickets.toml` lists every child in build order, each `after` naming what it needs; every child's `sources:` lists the parent's file; `tickets.py status` on the parent shows no `order_conflict`.
- The initiative's `tickets.toml` lists child initiatives, epics, or entries, one kind only; with epics, no leaf sits in the initiative's `tickets/` folder.

{% if workflow.checks.tree %}
{{ workflow.checks.tree }}
{% endif %}

## Dependencies

An item is a set entry, a tree epic, or a parent's child initiative.

- Needs: what each item needs to start and to run its check is built by it or its `after`.
- Collisions: items with no dependency path share no code, config, schema, or setup; else add an `after` or merge them.
- Shared setup: the earliest item needing it owns it; others list it in `after`.
- Handoffs: when one item relies on another's output, both descriptions say so.

{% if workflow.checks.dependencies %}
{{ workflow.checks.dependencies }}
{% endif %}

## Closure

- Verify the container's Done when, requirements, constraints and companions against implementation evidence, not child status; explain dropped work and confirm remaining scope with the user.

{% if workflow.checks.closure %}
{{ workflow.checks.closure }}
{% endif %}
