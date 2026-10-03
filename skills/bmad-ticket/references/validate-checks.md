# Validation checks

One section per scope. `validate.md` says which sections an agent runs and what it is given.

## Ticket

- Every file or link referenced exists and opens; no unfilled placeholder; every assumption is marked.
- Nothing contradicts the requirement source, its companions, the architecture, or a recorded decision.
- An entry has a description, known uncertainty, and a `verify` check someone other than the builder can run. Full criteria are required before execution only for a bug, an entry with `refine = true`, and a ticket with no epic.
- A ticket that needs full criteria and whose `covers` includes an id named in a `Source conflict:` line with no later `Decision:` settling it has `refined: false`.

## Set

The set is every entry in the epic's `tickets.toml` or draft breakdown, pulled or not.

- Together the tickets account for every requirement in the epic's spec, referenced numbered source, or Requirements, except scope deferred with the user. Each `covers` id exists there; several tickets may cover one id, each description saying which part it delivers.
- UX, architecture, constraints, and integration work are accounted for even when they lack ids. The combined results must satisfy the epic's Done when; citing an id alone is not coverage.
- Every `after` is a real prerequisite, those in other epics included, and none restates the order. Once `tickets.toml` exists, `tickets.py status` on the epic runs clean: no cycle, no `drift`, no `unpinned_after`, `undeclared_after`, or `order_conflict`. The tracer bullet (the first entry: the thinnest path through every layer the epic touches) and the sequencing decisions are in the epic's Notes.
- Given the epic, an entry, and its references, a builder could write that story's acceptance criteria if it had to. If it could not, fix the epic's requirements or the references; the entry stays one sentence each for `description` and `verify`.
- An epic of more than three entries closes with a "Refactor sweep" story that waits on every other entry except a closing end-to-end suite, or a `Decision:` line says why not.

## Tree

The tree is the initiative and its epic envelopes, drafted or written.

- Every initiative requirement has an accountable epic or an agreed deferral. Shared requirements say which part each epic delivers; no unexplained overlap.
- Each epic's `covers` cites parent ids. Every id it assigns in Requirements or a local spec maps to one of them, and a child citing a local id resolves through that map to a parent id; an epic with empty `covers` cites a source section on every line instead. Verify the map resolves; a non-empty `covers` is not coverage.
- Every unit the source touches is an epic, a touch point (a unit the work only consumes or configures, named in the initiative's Boundaries with the epic that owns the work there), or named out of scope.
- Every decision two or more epics must adopt has one home: a spine section, or an entry in the opening epic (the first `[[epic]]`) that the others wait on.
- Every epic envelope has Outcome, Done when, boundaries, upstream coverage, and references; a future epic needs neither a breakdown nor a completed spec. The initiative's `tickets.toml` lists every epic in build order, and each `after` names what is needed and from which epic. It opens with a platform-baseline epic (scaffold, environments, CI, deployment, operations), or a `Decision:` line says why not. Each epic's Done when includes production delivery.
- With epics, no leaf sits directly under the initiative.

## Dependencies

Missing prerequisites, run with the set and with the tree. An item is an entry in the set and an epic in the tree; a prerequisite is an `after` on either.

- Needs: list what must exist before each item can start and before its check can run: code, schema, setup, test tooling, fixtures, an entry point, a decision, an investigation's answer. The item builds it itself, or something in its `after` delivers it.
- Collisions: two items with no dependency path between them can run at the same time, so they share no code, config, schema, or setup. Where they would, one goes in the other's `after` or they merge.
- Shared setup: whatever more than one item needs (test harness, scaffold, schema, a shared component or contract, an integration) has one owner, the earliest item that needs it, and the others list it in `after`.
- Handoffs: where one item relies on another's output (a default, an interface, a link target), both descriptions say so, so neither builder invents its own.

## Closure

- Verify the container's Done when against implementation evidence and its requirements, including constraints and companions. All known children done is evidence, not proof the parent is complete; explain any dropped work and confirm remaining scope with the user.
