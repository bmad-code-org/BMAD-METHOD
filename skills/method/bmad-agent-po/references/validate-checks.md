# Validation checks

`validate.md` assigns sections to agents.

## Ticket

- References open; no unfilled placeholders; assumptions marked.
- Nothing contradicts its epic file, its companions, the architecture, or a recorded decision.
- A Refined Story points back to the epic ticket when an epic exists (never duplicating parent spec prose; standalone `backlog/` stories and bugs invent no epic ids). Epic stories cite `E0X-FR-xx` (when `prd-epic` exists) and epic `R<m>`, cover functional + failure paths and measurement checks when required, and UI stories link every UX artifact that exists for the epic (`DESIGN.md`, `EXPERIENCE.md#<section>`, mockups) unless declined.
- Each unrefined entry has a 1–2 sentence outcome `description`, `unknown` when one is known, and a `verify` a non-builder can run; bugs, `refine = true` entries, and leaves with no entry carry full criteria before execution.
- A ticket needing full criteria and covering an id in a `Source conflict:` line with no later `Decision:` has `refined: false`.

{% if workflow.checks.ticket %}
{{ workflow.checks.ticket }}
{% endif %}

## Set

Every entry in the epic's `tickets.toml`, draft or committed, pulled or not.

- Tickets cover every epic Requirements `R<n>` line (covering all `E0X-FR-xx` and instrumentation/measurement `R<n>` lines) not deferred with the user; each `covers` id matches a leading `R<n>` in the epic's Requirements; tickets sharing an id say which part each delivers. Once story files exist, coverage is checked criterion by criterion: every covered requirement and measurement `R<n>` is proven by at least one criterion.
- When `prd-epic` provides `Chunky story slice map`, entries adopt its story names, boundaries, and 100% FR + measurement coverage verbatim unless a dated `Decision:` records a conflict.
- Every entry's `description` is 1–2 outcome sentences (never a mini-spec); stories are cohesive, end-to-end verifiable journeys with no horizontal micro-stories and no standalone setup or go-live story unless explicitly requested.
- Every UI-bearing entry cites every UX artifact that exists for the epic (`DESIGN.md`, `EXPERIENCE.md#<section>`, and promoted mockups/wireframes) in `references` (unless a dated `Decision:` records UX was declined); shared UX, architecture, and integration work is covered without gaps; results satisfy `Done when`; citing an id alone is not coverage.
- Every `after`, cross-epic too, is a real prerequisite, not restated order; once `tickets.toml` exists, `tickets.py status` on the epic shows no cycle, `drift`, `unpinned_after`, `undeclared_after`, or `order_conflict`; the epic's Notes hold a dated `Decision:` line for each sequencing decision.
- For any entry left thin without a story file, a builder could write each story's acceptance criteria from the epic, entry, and references; if not, fix the epic, not the 1–2 sentence `description` and `verify`.

{% if workflow.checks.set %}
{{ workflow.checks.set }}
{% endif %}

## Tree

The container (`program` or `initiative`), its `tickets.toml` (draft or committed), and child files once written.

- Every parent requirement and every OKR and baseline (including long-horizon targets) maps to an owning child epic/initiative and instrumentation (or an explicit unmapped-gap / deferral flag); shared ids say which part each child delivers with no unexplained overlap.
- When a `prd-program` (`INIT-01`..) or `prd` (`E01`..) map exists, names, ids, and boundaries match verbatim (barring a recorded `Decision:`); on non-PRD slices, 1 capability = 1 epic (single-story capabilities stay stories; no rollout, migration, or pilot phases cut as epics or initiatives).
- Each child's `covers` cites parent ids; each Requirements line names in parentheses its parent id or source section; a grandchild's `covers` resolves through Requirements to a parent id.
- Every source id on a Requirements line exists in `sources:`; every parent id exists in the parent's Requirements; `tickets.py status` shows final `unadopted_runs` reconciled (or explicitly deferred) and draft runs flagged; upstream inputs sit in `sources:` and adopted design, architecture, or test contracts sit in `companions:`.
- Every unit the source touches is an epic, out of scope, or a touch point (consumed or configured only, named in the initiative's Boundaries with its owner).
- Each decision several epics adopt has one home: an architecture spine section, or an opening-epic entry (first `[[epic]]`) the others wait on.
- Every written epic file has Outcome, `Done when` (target OKR band and deliverables), Boundaries, its `covers`, and references; one with `refined: false` needs no Requirements or breakdown yet; the initiative's `tickets.toml` lists every epic in build order, each `after` naming what it needs, and `tickets.py status` shows no cycle or `order_conflict`.
- A program's (or parent initiative's) `tickets.toml` lists every child initiative in build order with `after` naming what it needs, each child nested under `tickets/initiative-*` (or legacy sibling for older parent initiatives) with `sources:` citing the parent file and zero `order_conflict`.
- Each `tickets.toml` holds child initiatives, epics, or entries — one kind only; with epics, no leaf sits in the initiative's `tickets/` folder.

{% if workflow.checks.tree %}
{{ workflow.checks.tree }}
{% endif %}

## Dependencies

An item is a set entry, a tree epic, or a program's or parent initiative's child initiative.

- Needs: what each item needs to start and to run its check is built by it or its `after`.
- Collisions: items with no dependency path share no code, config, schema, or setup; else add an `after` or merge them.
- Shared setup: the earliest item needing it owns it; others list it in `after`.
- Handoffs: when one item relies on another's output, both descriptions say so.

{% if workflow.checks.dependencies %}
{{ workflow.checks.dependencies }}
{% endif %}

## Closure

- Verify the container's `Done when`, requirements, constraints, and companions against implementation evidence, not child status; explain dropped work and confirm remaining scope with the user.

{% if workflow.checks.closure %}
{{ workflow.checks.closure }}
{% endif %}
