---
title: The Ticket Tree
description: "Reference for Sofia's ticket tree: the folder layout, what each ticket file and tickets.toml entry holds, statuses and who writes them, what makes a ticket ready, and the tickets.py commands."
sidebar:
  order: 2
---

These are the exact rules for the ticket tree that Sofia, the Product Owner
(`bmad-agent-po`), keeps. For the tasks, see
[Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md),
[Plan an Epic's Stories](../plan/plan-an-epics-stories.md), and
[Build and Verify](../build/build-and-verify.md).

## Layout

The tree is the folder `active_initiative` names under `output_folder`
(`_bmad-output` by default): a `program-*`, `initiative-*`, or standalone
`epic-*` container, or a nested path like `program-shop/tickets/initiative-checkout`.
Each container keeps its own file, other skills' run folders, and its
retrospective at the top of its folder. Its breakdown goes in a `tickets/`
folder inside it.

```text
_bmad-output/
  program-<slug>/                     # optional Altitude 0
    program-<slug>.md
    prd-program-<slug>/  arch-enterprise-<slug>/
    tickets/
      tickets.toml                    # the initiatives, in build order
      initiative-<slug>/              # Altitude 1 (or top-level)
        initiative-<slug>.md
        prd-<slug>/  ux-system-<slug>/  arch-spine-<slug>/
        tickets/
          tickets.toml                # the epics, in build order
          epic-<slug>/                # Altitude 2 (or top-level)
            epic-<slug>.md
            epic-<slug>-retrospective.md
            tickets/
              tickets.toml            # the entries, in build order
              story-<slug>.md         # Refined Story (at inception or pickup)
              story-<slug>-plan.md    # written by the build
  backlog/                            # tickets with no epic, and their plans
```

A `program-*` container's `tickets.toml` lists child initiatives stored under
`tickets/initiative-*` (sibling child initiatives remain readable only under a
legacy parent initiative before converting to `type: program`). `tickets.py`
refuses a tree in the earlier layout, with `tickets.toml` beside the
container's own file: run `bmad migrate method`.

## Ticket Files

An initiative or epic file is the spec at its level.

| Section | Holds | Written by |
| --- | --- | --- |
| Description, Outcome | What the work is, and what is true when it is done | Sofia |
| Requirements | One line per requirement, with a stable `R<n>` id naming its source: `R1 (E01)`, or on an epic `R1 (parent R1)` | Sofia only |
| Constraints | Rules the work must keep, each citing its source id; no `R<n>` of their own | Sofia only |
| Done when | Three to six checks that show the work is finished, judged at closure and by the retrospective | Sofia |
| Boundaries | What is out of scope, and units the work only touches | Sofia |
| References | Documents a build reads beside the ticket, such as UX files and the spine | Sofia, when she adopts them |
| Notes | `Assumption:`, `Open question:`, dated `Decision:`, and `Dropped:` lines | Sofia |

The frontmatter names `sources:`, the documents the requirements were derived
from, and `companions:`, the files downstream skills read beside the ticket.
Only Sofia re-reads the sources, when she updates the ticket. An epic carries
`refined: false` until it is refined; an epic file with no `refined` key counts
as refined.

A story file uses the same template at story level: Description, a `Verify:`
line or numbered criteria, Boundaries when it has criteria, References, and
Notes. A bug adds Reproduction, Cause Hypothesis, and Acceptance Criteria,
plus `severity` P0 to P3; a spike has Approach and Acceptance Criteria and
defaults to `hitl: true`.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app:

A refined epic, shortened:

```markdown wrap
---
type: epic
title: "Door check-in: people check in at the door"
parent: initiative-check-in
covers: [R1]
risk: medium
---

# Door check-in: people check in at the door

## Requirements

R1 (parent R1): A person checks in at their room's door tablet.
R2 (parent R1): A door tablet shows its room's bookings for the day.

## Done when

- Every room's tablet is paired and shows its bookings.
- A person can check in at every paired tablet.
- Each check-in is recorded against its booking.

## Boundaries

- Freeing rooms belongs to epic-free-no-show-rooms.
```
:::

## Entries

Each `[[entry]]` table in an epic's `tickets.toml` is one story, spike, or
bug. Table order is build order.

| Key | Meaning |
| --- | --- |
| `id` | Never reused in its folder; `move` gives the entry a new id in its new folder. A story is named by its epic's id and its own, such as `2.1` |
| `type` | `story`, `spike`, or `bug` |
| `title`, `description` | What it delivers |
| `verify` | How it is checked |
| `covers` | The epic's requirement ids it delivers |
| `after` | Real prerequisites only: a sibling's id, `"<epic id>.<entry id>"` in another epic, or `"epic-<slug>"` for a whole epic |
| `hitl` | `true` when a person does part of the work |
| `risk` | `low`, `medium`, or `high`: the business impact if the change is wrong |
| `unknown` | A question that blocks the entry until it is answered and removed |
| `refine` | `true` to write full acceptance criteria before it starts |
| `plan_checkpoint` | A person reviews the ticket or plan before the run. Honored by whoever starts the runs, not the build |
| `done_checkpoint` | Pause after the run until a person says continue. Honored by whoever starts the runs, not the build |

Optional keys also include `estimate`, `references`, and `notes`. A build
that leaves work for a later story in the same epic adds a line to that story's
`notes`, or to its file's `## Notes`, with `tickets.py note`, as long as no
build has started it. An entry needs no file to be built. Once a story's file exists, the file is the source
of truth: a build reads the file, and Sofia keeps the entry's `id`, `type`, `title`,
`after`, and `hitl` equal to it. `tickets.py status` reports `drift` only for
`after` and `hitl`.

## Epic and Initiative Tables

An initiative's `tickets.toml` holds one `[[epic]]` table per epic, in build
order. A `program-*` container holds `[[initiative]]` tables with the same
keys, and an initiative with no epics holds `[[entry]]` tables; a file holds one
kind of table.

| Key | Meaning |
| --- | --- |
| `id` | Permanent; never reused |
| `slug` | The child container's folder inside `tickets/` (or a sibling `initiative-*` folder under a legacy parent initiative) |
| `title` | The epic's or initiative's name |
| `description` | What is true when it is done |
| `covers` | The parent's requirement ids it delivers |
| `after` | The epics it depends on, as `[{ epic = 1, needs = "…" }]`, or `initiative = 1` in a `program-*` container. It declares the dependency; entries pin it with their own `after`, or the epic file's `after` gates every story until that epic is done |

`tickets.py status` flags `unpinned_after`, `undeclared_after`, and
`order_conflict`.

`next_id`, at the top of the file, is the folder's id counter, written by
`tickets.py move`.

```toml
[[epic]]
id = 2
slug = "epic-free-no-show-rooms"
title = "Free no-show rooms"
description = "A booked room nobody checks in to is freed, and anyone can book it."
covers = ["R2"]
after = [{ epic = 1, needs = "check-ins recorded by the door tablet" }]
```

## Status

A ticket's `status` lives in its build plan, `<type>-<slug>-plan.md`, beside
`tickets.toml`. The plan stays local on every store; a tracker never receives
it.

| Status | Written by | Board state |
| --- | --- | --- |
| No plan and no file (an entry only) | Nobody yet | planned |
| A story file with no plan yet; then `draft`, `ready-for-dev` | Nobody yet; then the build, as it plans | backlog |
| `in-progress` | The build | in progress |
| `blocked` | `bmad-build-auto` when it halts, with the reason in the plan | in progress |
| `in-review`, `built` | The build; `built` is the last status it writes | review |
| `done` | You, or a script or AI session you direct: `tickets.py mark` on the repo store; on a tracker, Sofia moves the card when you say so | done |
| `dropped` | Sofia, when the user says so, with a `Dropped:` line | dropped |

The plan's own frontmatter keys:

| Key | Holds |
| --- | --- |
| `ticket` | The entry's id, or the file's stem for a backlog ticket |
| `status` | One of the statuses above |
| `baseline_revision` | The commit the work starts from; code review and the retrospective diff from it |
| `type` | `feature`, `bugfix`, `refactor`, or `chore` |
| `route` | `oneshot` or `full`, set by the build as it plans |
| `risk` | From the entry; the build may raise it. `bmad-build-auto` never lowers it, and `bmad-build` lowers it only when you say so |
| `assignee`, `blocked_at`, `blocked_reason` | Who has it, and when and why it was blocked; written by `tickets.py mark` |
| `deferred`, `followup_review_recommended` | Findings set aside, and whether another review pass is advised; written by `bmad-build-auto` |

`bmad-code-review` appends a dated block under `## Code Review` in the plan
and never changes status. On a tracker store, `tickets.py mirror` writes the
tracker's state to the leaf file as `tracker_status`. That state, not the
plan's `status`, sets the board state and the ready lists, though a plan at
`blocked`, or with a block recorded, still lists an open story as Blocked.
The tracker state never makes a build skip planning.

## What Is Ready

Ask Sofia "what's next?", or run `tickets.py next`. Each open ticket falls in
one list. With a tracker store, `tickets.py next` refuses until you sync ticket
status from the tracker and rerun it with `--synced`.

| List | When |
| --- | --- |
| Blocked | Its plan is `blocked`; a prerequisite is not yet at `in-review`, `built`, or `done`; or a whole epic it waits on is not done. An `unknown` blocks only when no refinement is pending, and a dropped prerequisite still blocks |
| In progress | Its plan is `in-progress`, `in-review`, or `built` |
| Ready to refine | A bug, a ticket with no epic, or an entry with `refine = true`, still without approved acceptance criteria. Refining settles its `unknown`, if it has one |
| Ready to start | Anything else that is not done or dropped |

A story at `built` meets the prerequisites of the stories that wait on it, so
builds can follow one another before anyone marks it done.

## The Script

`tickets.py` reads the tree and prints one JSON object. Sofia and the build
skills run it for you; it is installed at `_bmad/method/scripts/tickets.py`.

| Command | Does |
| --- | --- |
| `next` | Lists what is ready to refine, ready to start, in progress, and blocked |
| `status` | Every ticket, resolved, with problems such as drift between an entry and its file |
| `find <ref>` | One ticket: its entry, its epic, its file if any, and its plan's path |
| `pull <dir> <id>` | Writes an entry's file in that epic folder |
| `mark <ref> <status>` | Writes `status` in the plan, creating it if needed; `--assignee <who>` records who has it; `--blocked <reason>` records a block, and a `mark` without it clears the block |
| `move <from> <ref> <to>` | Moves an entry, its file, and its plan to another folder under that folder's next id, and rewrites every `after` that names it |
| `mirror` | Records tracker ids and statuses in the leaf files |

Exit codes: `0` on success, `2` when the store forbids the operation, such
as `mark` on a tracker store, and `1` on any other error, such as a malformed
tree or no active initiative.
