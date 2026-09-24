# Board

Operations on existing tickets. Read an existing ticket before changing it; if it has been published to a tracker, query its current remote state too.

## Publish

Approving a breakdown records it in the epic's `tickets.toml`; it does not start work. On the repo store, committing the approved `tickets.toml` is the publish. On a tracker, resolve `{workflow.publication}`: `on_start` publishes each ticket when it starts; `at_inception` offers to publish the agreed set after validation; `auto` is `at_inception`. An explicit user request takes precedence.

Publish through `write`. Publishing is not a status: with the repo store it is the commit of the approved files; with a tracker it is the remote item existing, `tracker_id` and `remote` set in the file. Publishing to a tracker writes the leaf's file first, with `tickets.py pull` when it has none, because that file is the body the tracker receives. A type mapped to `""` is never sent: it stays local and its children attach to the nearest published ancestor, which is how an initiative behaves on a tracker whose hierarchy has no level above the epic. Say so once when it first matters rather than at every publish. At first publish, or when maps name missing fields or statuses, offer `setup`. If any prerequisite is still local, include it in the proposed publication scope.

An unrefined ticket may be published for planning visibility. One that needs refining keeps `refined: false`; the `backlog` state means available to start. With a tracker, that line stays in the published body. Refinement updates that same file and remote item, preserving identity.

Before starting a candidate, read it and its source. One in `next`'s `ready_to_refine` group is refined first per `slice.md`. Confirm it is in `ready_to_start` and not assigned to someone else. Then, with the user's approval, publish it if it is not yet published, and start it: on a tracker, `write` transitions the item to `[tickets.status].in-progress` and the file gets `tracker_status: in-progress`; on the repo store, hand the ticket to the build, which writes `status` in the ticket's plan as it works. In an unattended run, an entry's `plan_checkpoint` waits for a person to approve the ticket, or the builder's plan when it is not refined, and `done_checkpoint` waits after the ticket closes.

## Progress and closure

- A ticket the user names — "refine 1.2", "start ABCD-13", "build the cart scaffold" — resolves through `uv run {skill-root}/scripts/tickets.py --project-root {project-root} find <folder> <ref>` before you pull, refine, start, or mark it: one ticket with its row, its entry's `description`, `verify`, `references`, `notes`, and `unknown`, its `folder`, and the absolute paths `epic_file`, `story_file` (null until pulled), and `plan` (where its plan is or goes). Words that match more than one ticket: ask.
- Progress lives on tickets, not in a separate sprint/status file. `tickets.py next <folder>` (same `--project-root`) proposes candidates grouped by state; `status <folder>` reports every ticket with its `status`, `tracker_status`, and state, what it blocks, counts by state, and the remaining chain; a row's `gated_by` is its epic file's `after`. `<folder>` is an epic, `backlog/`, or the initiative for all its epics at once. With a tracker, query before either view and pass `--synced` to `next`. `next`'s `ready_to_start` group is the tickets, with or without a file, that are not started, blocked, or waiting to be refined and whose prerequisites are done or in review, in build order; a row's `gated_by` epics must be done. Offer the first and start it as above, passing its row's `ref` to `find`.
- `unpinned_after` lists an epic that has tickets but none waiting on the epic its `after` names: add the prerequisite with the user. `drift: true` on a `status` row: show the file's and the entry's `after` to the user and make them equal.
- Offer all unblocked, unassigned candidates when work can run in parallel.
- A leaf's `status`, `assignee`, `blocked_at`, and `blocked_reason` live in its plan, `<type>-<slug>-plan.md` beside where its file is or would be (`tree-rules.md`); a leaf file's own `status` is read only when there is no plan. Who writes each status:

  | Status | Written by |
  |---|---|
  | `draft`, `ready-for-dev`, `in-progress`, `in-review`, `built` | `bmad-build`, `bmad-build-auto` as they work |
  | `blocked` | `bmad-build-auto` when it halts, with the reason in the plan |
  | `done` | the user, or an orchestrator, through `tickets.py mark` |
  | `dropped` | the ticketing skill, when the user says so |

  No skill moves a ticket past `built`, and ticketing does not move a leaf the build is working. When the user says a ticket is done, run `mark` for them. Assignee changes, and a `status` the user asks for — `done`, `dropped`, or a person working the ticket by hand — go through `write`; on the repo store, for a leaf, that is `tickets.py --project-root {project-root} mark [<folder>] <ref> <status> [--assignee <who>] [--blocked <reason>]` followed by the commit its verb describes. `mark` takes its folder and ref as `find` does, writes the plan and never the leaf file, and creates a plan holding only frontmatter when there is none. `mark` writes what it is told; the checks above are yours. On a tracker, `write` transitions the item to `[tickets.status].<state>` and never sends `status` as a word; the tracker's status comes back as `tracker_status` on `query`. A container's `status` is ticketing's, an edit to its file: absent until work under it starts, then `in-progress`, `done`, or `dropped`; containers never take review. On done with estimation on, ask for the actual (`estimate.md`).
- A ticket waiting on a person or an answer, not on a prerequisite: `mark` with `--blocked <reason>` sets `blocked_at` (today) and `blocked_reason`; a `mark` without it clears both when the ticket moves. `next` lists it under `blocked`.
- Closing every child does not close the parent. Run the closure check in `validate.md` against its requirements and Done when; the user confirms the parent is complete.
- Drop only after a `Dropped:` line in Notes says why. A dropped ticket still blocks its dependents, in any epic: `status` lists them under `blocks`; remove or repoint it in each one's `after` with the user. An entry with no file and no plan is dropped by deleting it from `tickets.toml`. Cancelling a container cancels its descendants after the user confirms.
- Whatever `query` returns lands in the tree: `tracker_id`, `remote`, `tracker_status`, `assignee`, and `after` into frontmatter, never `status`; a ticket with no file gets one per the layout. A body that differs from the file: show and ask.

## Layout

```
{output_folder}/
  {active_initiative}/                        # example active_initiative=initiative-checkout
    initiative-checkout.md
    tickets.toml                             # the epics in build order
    spec-checkout/
    epic-cart-rules/
      epic-cart-rules.md
      tickets.toml                           # every planned entry, refined or not
      spec-cart-rules/
      story-cart-service-scaffold.md           # refined; its id is in its frontmatter
      story-cart-service-scaffold-plan.md      # the build's plan, with the ticket's status
      story-apply-discount-codes-plan.md       # a plan for an entry with no file
      spike-discount-engine-latency.md
  backlog/
    bug-checkout-total-ignores-discount-codes.md
```
