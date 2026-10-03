# Board

Operations on existing tickets. Read an existing ticket before changing it; if it has been published to a tracker, query its current remote state too.

`tickets.py` below is `uv run {skill-root}/scripts/tickets.py --project-root {project-root}`. `tickets.py <command> --help` gives a command's arguments and output keys.

## Reading the tree

- A ticket the user names — "refine 1.2", "start ABCD-13", "build the cart service scaffold" — resolves through `tickets.py find [<folder>] <ref>` before you pull, review, refine, start, or mark it. `<ref>` is `<epic id>.<entry id>`, an entry id inside the epic folder, a tracker id, a file name, or an unbroken phrase from the title. When the user's words are looser than that, read `status` and pick the ticket yourself, asking when more than one fits. In the result, `story_file` is null until the entry is pulled, and `plan` is where the plan is or goes.
- Progress lives on tickets, not in a separate sprint or status file. `tickets.py next [<folder>]` groups the open tickets by what can happen next; `tickets.py status [<folder>]` reports every ticket with its `status`, `tracker_status`, and `state`, what it blocks, and counts by state.
- `<folder>` is an epic (its folder name is enough), `backlog`, or the initiative for all its epics at once. Left out, it is the active initiative: `next` and `status` add `backlog`, the same view of `backlog/`, so show both, and `find`, `mark`, and `mirror` look in `backlog/` for a ticket the initiative does not hold. A done standalone ticket stays in `backlog/` beside its plan.
- With a tracker, bring the tree up to date first (Tracker sync, below) and pass `--synced` to `next`.

When one of these comes back with something in it, act on it:

| Key | Means | Do |
|---|---|---|
| `unpinned_after` | an epic has tickets, but none waits on the epic its `after` names | with the user, add the prerequisite to the entry that needs it |
| `undeclared_after` | an entry waits on an epic its own epic does not declare | with the user, add that epic to this epic's `after` in the initiative's breakdown with its `needs`, or drop the prerequisite |
| `order_conflict` | an epic waits on one later in build order | reorder or merge the epics, or record why in a `Decision:` line |
| `drift`, on a row | the leaf file's `after` or `hitl` differs from the entry's; the row gives both values | show them to the user and make them equal |
| `problems` | a plan whose `ticket` names nothing, or whose `status` is unknown, so its ticket reads as blocked | show each to the user and fix the plan; `mark` sets a valid status |
| `waiting_on`, on a `blocked` row of `next` | the prerequisites not yet done or in review | say what the ticket waits on |
| `unknown`, on a `blocked` row of `next` | a question that must be settled before the ticket starts | settle it with the user, remove it, and record the answer as a dated `Decision:` line: in the file's Notes, or in its epic's Notes when it has no file |

## Publish

Approving a breakdown records it in the epic's `tickets.toml`; it does not start work. On the repo store, committing the approved `tickets.toml` is the publish. On a tracker, `{workflow.publication}` says when: `at_inception` offers to publish the agreed set after validation; `on_start` publishes each ticket when it starts. An explicit user request takes precedence.

Publishing is not a status: on a tracker it is the remote item existing, with `tracker_id` and `remote` in the leaf file. Publish through `write`:

- The leaf's file is written first, with `tickets.py pull` when it has none, because the file is the body the tracker receives: the whole file without the frontmatter lines `tracker_id`, `remote`, `tracker_status`, `status`, and `assignee`.
- Create parents before children, and a prerequisite before what waits on it. A prerequisite that is still local joins the proposed publication scope. An `after` naming a sibling's id or `<epic id>.<entry id>` is that entry's remote item; `epic-<slug>` is the epic's item.
- A type mapped to `""` is never sent: it stays local and its children attach to the nearest published ancestor, which is how an initiative behaves on a tracker whose hierarchy has no level above the epic. Say so once when it first matters rather than at every publish.
- At first publish, or when the tracker lacks something the maps or `fields` name — a label, list, status, or property — offer `setup`.
- Then mirror what the tracker returned (Tracker sync). `mirror` writes leaves only: a published container's `tracker_id` and `remote` go into its own file by edit.

An unrefined ticket may be published for planning visibility. One that needs refining keeps `refined: false`, and that line stays in the published body; the `backlog` state means available to start. Refinement updates that same file and remote item, preserving identity.

## Start

Candidates are `next`'s `ready_to_start` rows: tickets, with or without a file, that are not started, blocked, or waiting to be refined, whose prerequisites are done or in review, whose `gated_by` epics are done, and that carry no `unknown`. Offer the first, in build order; when work can run in parallel, offer every one that is unassigned.

Before starting a candidate, read it and its source, passing its row's `ref` to `find`. One in `ready_to_refine` is refined first per `ticket.md`. Confirm it is in `ready_to_start` and not assigned to someone else. Then, with the user's approval, publish it if it is not yet published, and start it. On a tracker, `write` transitions the item to `[tickets.status].in-progress` and the mirror sets `tracker_status: in-progress`. On either store the ticket then goes to the build, `bmad-build` or `bmad-build-auto`, which writes `status` in the ticket's plan as it works; on the repo store that is all starting is. An entry's `plan_checkpoint` waits for a person to approve the ticket, or the builder's plan when it is not refined, and `done_checkpoint` waits after the ticket closes. Both are on the ticket's row, and the orchestrator that dispatches an unattended run does the waiting: `bmad-build-auto` reads neither, so run without an orchestrator nothing pauses.

## Status

A leaf's `status`, `blocked_at`, and `blocked_reason` live in its plan, `<type>-<slug>-plan.md` beside where its file is or would be, joined by the plan's `ticket` field; a leaf file's own `status` is read only when there is no plan. Who writes each status:

| Status | Written by |
|---|---|
| `draft`, `ready-for-dev`, `in-progress`, `in-review`, `built` | `bmad-build`, `bmad-build-auto` as they work |
| `blocked` | `bmad-build-auto` when it halts, with the reason in the plan |
| `done` | the user, or an orchestrator, through `tickets.py mark` |
| `dropped` | `bmad-ticket`, when the user says so |

A ticket's state is `planned` for an entry with no file and no plan; else `tracker_status` when present; else from `status`: none, `draft`, or `ready-for-dev` is `backlog`; `in-progress` or `blocked` is `in-progress`; `in-review` or `built` is `review`; `done` and `dropped` are themselves. `tracker_status` exists only on a tracker store: the BMad word for the tracker's current status.

No skill moves a ticket past `built`, which means the build finished and nobody has called it done. `bmad-ticket` never moves a leaf on its own: it changes a leaf's status or assignee only when the user asks, for `done`, `dropped`, or a person working the ticket by hand. When the user says a ticket is done, mark it for them.

- **Repo store.** `tickets.py mark [<folder>] <ref> <status> [--assignee <who>] [--blocked <reason>]`, then the commit the `write` verb describes. `mark` takes its folder and ref as `find` does, writes the plan and never the leaf file, and creates a plan holding only frontmatter when there is none. It writes what it is told; the checks in this file are yours. The assignee is in the plan.
- **Tracker.** `write` transitions the item to `[tickets.status].<state>`, the ticket's `state`, and sets its assignee; it never sends `status` as a word. Then mirror the item (Tracker sync): its status comes back as `tracker_status` and its assignee lands in the leaf file. `mark` refuses a tracker store.
- **Waiting on a person or an answer**, not on a prerequisite, on the repo store: `mark` with the ticket's current status, `draft` when it has none, and `--blocked <reason>` sets `blocked_at` (today) and `blocked_reason`, and `next` lists the ticket under `blocked`; a `mark` without it clears both when the ticket moves.
- **A container's** `status` is `bmad-ticket`'s, an edit to its file: absent until the first ticket under it starts, then `in-progress`, and `done` or `dropped` when the user confirms it; containers never take review. A published container gets the same transition through `write`.

## Close, drop, move

- Closing every child does not close the parent. Run the closure check in `validate.md` against its requirements and Done when; the user confirms the parent is complete.
- Drop only after a `Dropped:` line says why: in the ticket's Notes, or in its epic's Notes when the ticket has no file. Then set its status to `dropped` as Status says; an entry never published to the tracker takes `tracker_status: dropped` through `mirror`. An entry is never deleted from an approved `tickets.toml`, so its id is never reused. A dropped ticket still blocks what waits on it, in any epic: `status` lists them under `blocks`; remove or repoint it in each one's `after` with the user. Cancelling a container cancels its descendants after the user confirms.
- Moving a leaf to another parent: first write the old folder's `next_id` (from `tickets.py status <folder>`) at the top of its `tickets.toml` as `next_id = <n>`, so the id that leaves is not given out again. Then move its entry from the old `tickets.toml` to its place in the new one's build order, with that folder's `next_id` (from `tickets.py status <folder>`) as its id; move the leaf file and its plan into the new folder; set the file's `id` and `parent` and the plan's `ticket` to the new id. Then rewrite both directions of `after`: its own, where a sibling it left is now `<epic id>.<entry id>`, and every `after` that named it. Move its `covers` ids between the two epics when the requirement moves with it. An epic moves as its whole folder, with its `[[epic]]` table. Then run `tickets.py status` on the initiative and clear what it reports.

## Tracker sync

The tree is the working copy and a tracker is its remote; nothing syncs on its own. After every `write`, and after the `query` that precedes a board view, put what the tracker holds into the tree with `tickets.py mirror [<folder>]`. It reads a JSON array on stdin, one object per ticket: `ref` (or the `tracker_id` the ticket already carries) and any of `tracker_id`, `remote`, `tracker_status`, `assignee`, and `after`. `tracker_status` is the BMad state the tracker's status maps back to through `[tickets.status]`. After a `write`, it is the state that was sent. After a `query`, when two states share one tracker status and `query` does not say how to tell them apart, keep the ticket's current `tracker_status` if it is one of them, else take the earlier state. `assignee` is the tracker's name for the person; `after` lists the prerequisites as tracker ids, each a string, since a bare number there is a sibling's entry id. `mirror` pulls a leaf file when the entry has none, writes only the keys given, removes a line whose value is an empty string, and never writes `status`, which is the build's.

- A leaf the tracker holds and the tree does not comes back under `unmatched`, also when the mirror failed because a known ticket's `after` names it: add its `[[entry]]` to the parent's `tickets.toml` with the folder's `next_id` and the item's type, title, and a one-sentence description, mirror it again with `ref` naming the new entry, then put the item's body in the pulled file.
- A published container is queried with its leaves, and `mirror` does not write containers. When the tracker's status for one differs from its file's, tell the user; closing it here still takes the closure check.
- A body that differs from the file: show both and ask.
- A ticket the tracker shows under another parent is moved as Close, drop, move says, then mirrored again.
- Commit the changed files on the current branch when `output_folder` is in a git repo; never push.
