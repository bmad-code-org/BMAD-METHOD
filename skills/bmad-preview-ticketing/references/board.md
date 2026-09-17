# Board

Operations on existing tickets. Read an existing ticket before changing it; if it has been published to a tracker, query its current remote state too.

## Publish and pull

Approving a breakdown records it in the epic's Breakdown and creates thin files per `{workflow.creation}`; it does not start work or publish. Resolve `{workflow.publication}`: `on_pull` keeps them local until refinement, while `at_inception` offers to publish the agreed set after validation. An explicit user request takes precedence. A single approval can cover both the split and publication when the user asks for both.

Publish through `write`, moving new tickets to backlog. With the repo store this records the approved files locally; with a tracker it creates the corresponding remote items. A type mapped to `""` is never sent: it stays local and its children attach to the nearest published ancestor, which is how an initiative behaves on a tracker whose hierarchy has no level above the epic. Say so once when it first matters rather than at every publish. At first publish, or when maps name missing fields or statuses, offer `setup`. If any prerequisite is still local, include it in the proposed publication scope.

A thin ticket may be published for planning visibility. It keeps `refined: false`; backlog means available to pull, not already detailed enough to build. With a tracker, the `refined: false` line stays in the published body, so a placeholder is not mistaken for ready work. Refinement updates that same file and remote item, preserving identity. Do not invent full criteria merely to populate a tracker.

Before starting a candidate, read it and its source. If `refined: false` or it lacks buildable criteria, follow `slice.md` to refine it first, regardless of status. Confirm blockers, including container blockers, are satisfied and it is not already assigned to someone else. Then `write` the in-progress status with the user's approval, which publishes it if still a draft.

## Progress and closure

- Progress lives on tickets, not in a separate sprint/status file. For an epic's folder, `uv run {skill-root}/scripts/tickets.py --project-root {project-root} next <folder>` proposes candidates, grouped by state. `status <folder>` reports that folder's tickets, counts, and remaining chain. For an initiative, read its container and aggregate its epic folders. With a tracker, query before either view and pass `--synced` to `next`. Its `to_create` group is the Breakdown entries with no file yet whose blockers are done; offer the next one to pull and write its file then.
- Offer all unblocked, unassigned candidates when work can run in parallel.
- Status and assignee changes go through `write`; on the repo store, for a leaf, that is `tickets.py --project-root {project-root} mark <ticket> <status> [--assignee <who>]` followed by the commit its verb describes. `mark` writes what it is told; the checks above are yours. A container's status is an edit to its file, and containers never take review. On done with estimation on, ask for the actual (`estimate.md`).
- A ticket waiting on a person or an answer, not on a blocker: set `blocked_at` (date) and `blocked_reason`; clear both when it moves. `next` skips it.
- Closing every child does not close the parent. Run the closure check in `validate.md` against its requirements and Done when; the user confirms the parent is complete.
- Drop only after a `Dropped:` line in Notes says why. A dropped ticket still blocks its dependents: remove or repoint it in each one's `blocked_by` with the user. Cancelling a container cancels its descendants after the user confirms.
- Whatever `query` returns lands in the tree: id, remote, status, assignee, and blocked_by into frontmatter, a ticket with no file gets one per the layout. A body that differs from the file: show and ask.

## Layout

```
{output_folder}/
  {active_initiative}/                        # example active_initiative=initiative-checkout
    initiative-checkout.md
    spec-checkout/
    epic-cart-rules/
      epic-cart-rules.md
      spec-cart-rules/
      story-01-cart-service-scaffold.md
      story-01-cart-service-scaffold-plan.md   # written by bmad-build
      story-02-cart-ui-shell.md                # thin: contribution, verification, references
      spike-03-discount-engine-latency.md
  backlog/
    bug-01-checkout-total-ignores-discount-codes.md
```
