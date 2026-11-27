---
title: The Ticket Tree
description: "Reference for Sofia's ticket tree: folder layout, altitudes, ticket and Refined Story files, tickets.toml entries, status rules, container metadata, and tickets.py commands."
sidebar:
  order: 2
---

These are the exact rules for the ticket tree maintained by Sofia, the Product Owner (`bmad-agent-po`). For step-by-step usage, see [Write and Slice the Initiative](../plan/write-and-slice-the-initiative.md), [Plan an Epic's Stories](../plan/plan-an-epics-stories.md), and [Build and Verify](../build/build-and-verify.md).

## Layout and Altitudes

The ticket tree lives at `{output_folder}/{active_initiative}` (`_bmad-output` by default). Work starts at the lowest altitude (planning level) that holds it and moves up only when scope requires it:

| Altitude | Folder | Scope |
| --- | --- | --- |
| Altitude 0 | `program-<slug>/` | A portfolio container grouping multiple bounded initiatives under shared outcomes. |
| Altitude 1 | `initiative-<slug>/` | A product effort grouping multiple related capabilities (epics). |
| Altitude 2 | `epic-<slug>/` | One cohesive capability containing stories, spikes, or bugs; a single-capability effort can live as a standalone top-level `epic-<slug>/` folder without a parent initiative. |

Each container stores its own spec file (`<type>-<slug>.md`), `.memlog.md`, companion run folders (such as `prd-*`, `ux-*`, or `arch-*`), and its retrospective at the top of its folder, while its breakdown lives inside a `tickets/` subfolder:

```text
_bmad-output/
  program-<slug>/                     # optional Altitude 0
    program-<slug>.md
    prd-program-<slug>/  arch-enterprise-<slug>/
    tickets/
      tickets.toml                    # [[initiative]] entries, in build order
      initiative-<slug>/              # Altitude 1 (nested or top-level)
        initiative-<slug>.md
        prd-<slug>/  ux-system-<slug>/  arch-spine-<slug>/
        tickets/
          tickets.toml                # [[epic]] entries, in build order
          epic-<slug>/                # Altitude 2 (nested or top-level)
            epic-<slug>.md
            epic-<slug>-retrospective.md
            tickets/
              tickets.toml            # [[entry]] items, in build order
              story-<slug>.md         # Refined Story (leaf file; written by default at epic inception)
              story-<slug>-plan.md    # local build plan written by bmad-build / bmad-build-auto
  backlog/                            # standalone tickets with no epic, and their plans
```

**Leaf files** are individual story, bug, or spike markdown files (`story-<slug>.md`, `bug-<slug>.md`, `spike-<slug>.md`) stored inside an epic's `tickets/` folder (or inside `backlog/` when unattached to an epic). A **Refined Story** is a leaf file containing full Given/When/Then acceptance criteria, boundaries, and verified references, marked `refined: true` once approved by the user.

### Program Container Rules

A `program-<slug>/` (`type: program`) nests child `initiative-*` folders under `tickets/` (listed via `[[initiative]]` in `tickets.toml` or discovered as unlisted `tickets/initiative-*` folders). Programs reject `[[epic]]` and `[[entry]]` in their `tickets.toml`. Legacy parent initiatives (`type: initiative` with `[[initiative]]`) check `tickets/initiative-*` first and retain read compatibility for sibling `../initiative-*` folders.

On a program or parent initiative container:

- `tickets.py find`, `pull`, `mark`, `mirror`, `note`, `add`, and `move` exit with an error stating that the container holds initiatives. Point `core.active_initiative` at a child initiative (for example, `program-shop/tickets/initiative-checkout`) before building stories.
- `tickets.py next` reports `initiatives`, `order_conflict`, and `ready`.
- `tickets.py status` reports `initiatives[]` and recursively rolls up open child initiatives into aggregate `counts`, `unrefined_epics` (`<child>/<epic>`), `ready_entries` (`<child>/<ref>`), and `open_questions_count` (`done` and `dropped` children contribute only to `counts`, and `waiting_on`-blocked children are omitted from `ready_entries`).

`tickets.py` refuses older layouts where `tickets.toml` or child containers sit beside `<folder>.md` instead of inside `tickets/`; run `bmad migrate method` to upgrade.

## Ticket Files

Each container file (`program-*.md`, `initiative-*.md`, `epic-*.md`) is the specification at its altitude:

| Section | Holds | Written by |
| --- | --- | --- |
| Description, Outcome | What the work is and what is true when it finishes | Sofia |
| Requirements | Numbered lines with stable `R<n>` ids citing their source (`R1 (E01)` or `R1 (parent R1)`) | Sofia only |
| Constraints | Rules the work must obey, citing their source id without creating new `R<n>` ids | Sofia only |
| Done when | Three to six observable completion checks evaluated at closure and retrospective | Sofia |
| Boundaries | Explicit non-goals and adjacent units the work only touches | Sofia |
| References | Companion documents downstream skills read beside the ticket (such as UX docs and `arch-spine` / `arch-epic`) | Sofia |
| Notes | `Assumption:`, `Open question:`, dated `Decision:`, and `Dropped:` lines | Sofia |

Frontmatter lists `sources:` (upstream documents Sofia distilled into the ticket; only Sofia re-reads them during updates) and `companions:` (downstream specs read alongside the ticket). An unrefined epic carries `refined: false` until Sofia refines its requirements; an epic without a `refined` key counts as refined.

A **Refined Story** file (`tickets/story-<slug>.md`) uses the story template: Description, `Verify:` or numbered Given/When/Then acceptance criteria, Boundaries, References, Notes, and `refined: true` once approved (or `refined: false` while still unapproved). A bug leaf file adds Reproduction, Cause Hypothesis, Acceptance Criteria, and `severity` (`P0` to `P3`). A spike leaf file adds Approach and `Verify:` acceptance criteria and defaults to `hitl: true`.

:::note[Example: Refined Epic]
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

## Entries (`tickets.toml`)

Each `[[entry]]` table in an epic's `tickets/tickets.toml` represents one story, spike, or bug in build order:

| Key | Meaning |
| --- | --- |
| `id` | Permanent integer id in that folder (`move` assigns the target folder's next id). Referenced externally as `<epic id>.<entry id>`, such as `2.1` |
| `type` | `story`, `spike`, or `bug` |
| `title`, `description` | Short title and 1 to 2 outcome sentences (full criteria live in the Refined Story file) |
| `verify` | How completion is verified |
| `covers` | Epic `R<n>` requirement ids delivered by this entry |
| `after` | Real prerequisites: a sibling id, `"<epic id>.<entry id>"` in another epic, or `"epic-<slug>"` for a whole epic |
| `hitl` | `true` when a human performs part of the work |
| `risk` | `low`, `medium`, or `high` business impact if the change is wrong |
| `unknown` | An unresolved question that blocks the entry until answered and removed |
| `refine` | Set `true` by default at epic inception so Sofia details every story into an approved Refined Story (`tickets/story-<slug>.md`, `refined: true`) before build pickup; omit only when explicitly opting to build straight from a bare entry |
| `plan_checkpoint` | Signals an orchestrator to pause for human review before building (ignored by build skills themselves) |
| `done_checkpoint` | Signals an orchestrator to pause for human sign-off after the build finishes (ignored by build skills themselves) |

Optional keys include `estimate`, `references`, and `notes`. By default at epic inception, Sofia sets `refine = true` and pulls and details every entry into its Refined Story file (`tickets/story-<slug>.md`) for user approval (`refined: true`). If the user chooses to detail only the next story now, remaining `refine = true` entries stay thin in `ready_to_refine` until refined at pickup.

Once a leaf file exists, it is the source of truth for builds, and Sofia keeps the entry's `id`, `type`, `title`, `after`, and `hitl` synced with it (`tickets.py status` flags `drift` when `after` or `hitl` diverge). A build may append a one-line handoff note to a later unstarted entry in the same epic with `tickets.py note` (repo store only).

## Epic and Initiative Tables

An initiative's `tickets/tickets.toml` holds `[[epic]]` tables in build order (or `[[entry]]` tables if the initiative has no epics). A program's `tickets/tickets.toml` holds `[[initiative]]` tables. A single `tickets.toml` never mixes table kinds.

| Key | Meaning |
| --- | --- |
| `id` | Permanent integer id counter; never reused |
| `slug` | Child folder name inside `tickets/` |
| `title` | Display title of the epic or initiative |
| `description` | Observable outcome when finished |
| `covers` | Parent `R<n>` ids delivered by this child |
| `after` | Dependencies as `[{ epic = 1, needs = "..." }]` (or `initiative = 1` inside a program). Child entries pin specific prerequisites with their own `after`, or the epic file's `after` gates all stories until that epic is done |

`next_id` at the top of `tickets.toml` tracks the next unused integer id (maintained by `tickets.py add` and `tickets.py move`).

```toml
[[epic]]
id = 2
slug = "epic-free-no-show-rooms"
title = "Free no-show rooms"
description = "A booked room nobody checks in to is freed, and anyone can book it."
covers = ["R2"]
after = [{ epic = 1, needs = "check-ins recorded by the door tablet" }]
```

### Dependency Validation Flags

`tickets.py status` reports three dependency integrity flags so broken cross-epic ordering is caught before implementation:

| Flag | Meaning |
| --- | --- |
| `unpinned_after` | A container declares `after = [{ epic = N, needs = "..." }]` in its parent `tickets.toml`, but no story entry (nor the epic file itself) pins an `after` dependency on that upstream epic. |
| `undeclared_after` | A story entry declares an `after` dependency on another epic that its own epic did not declare in the parent `tickets.toml`. |
| `order_conflict` | An entry or container depends (`after`) on an item that appears later in `tickets.toml` build order, or forms a cycle. |

## Status and Plan Files

On the repository store, a ticket's live `status` lives in its local build plan (`<type>-<slug>-plan.md` beside `tickets.toml`). Plans always remain local and are never published to external trackers.

| Status | Written by | Board state |
| --- | --- | --- |
| No plan and no leaf file (bare entry) | Nobody yet | `planned` |
| Leaf file with no plan yet; then `draft`, `ready-for-dev` | Sofia (leaf file); then Build as it plans | `backlog` |
| `in-progress` | Build | `in-progress` |
| `blocked` | `bmad-build-auto` when it halts, with `blocked_reason` | `in-progress` |
| `in-review`, `built` | Build (`built` is the final status any build writes) | `review` |
| `done` | You or an orchestrator via `tickets.py mark` (or Sofia on a tracker store) | `done` |
| `dropped` | Sofia on user confirmation, with a `Dropped:` note | `dropped` |

Key frontmatter fields on `<type>-<slug>-plan.md`:

| Key | Holds |
| --- | --- |
| `ticket` | The entry's id, or the file stem for a standalone `backlog/` ticket |
| `status` | One of the statuses above |
| `baseline_revision` | Commit SHA recorded before implementation begins (used by code review and retrospective) |
| `type` | `feature`, `bugfix`, `refactor`, or `chore` |
| `route` | `oneshot` or `full` |
| `risk` | `low`, `medium`, or `high` (started from the entry; Build Auto never lowers it) |
| `assignee`, `blocked_at`, `blocked_reason` | Ownership and block details written by `tickets.py mark` |
| `deferred`, `followup_review_recommended` | Deferred findings and follow-up review flag written by `bmad-build-auto` |

`bmad-code-review` appends dated findings under `## Code Review` in the plan and never alters `status`. On tracker stores, `tickets.py mirror` writes `tracker_id`, `remote`, and `tracker_status` to the leaf file, and `tracker_status` drives board state and ready lists (while a `blocked` plan still places an open story in Blocked).

## What Is Ready

Ask Sofia "what's next?" or run `tickets.py next` (with `--synced` on tracker stores after mirroring status):

| List | Included when |
| --- | --- |
| **Blocked** | The plan is `blocked`; a prerequisite is not yet `in-review`, `built`, or `done`; a whole epic it waits on is not `done`; a prerequisite was `dropped`; or an unblocked `unknown` exists when no refinement is pending |
| **In progress** | The plan is `in-progress`, `in-review`, or `built` |
| **Ready to refine** | A bug, an unattached ticket, or an entry with `refine = true` that lacks an approved Refined Story file (`tickets/story-<slug>.md` missing or carrying `refined: false`) |
| **Ready to start** | Any other open ticket whose prerequisites are satisfied (`in-review`, `built`, or `done`), including entries with `refine = true` whose Refined Story file has `refined: true` |

A story at `built` satisfies entry-level `after` prerequisites for downstream stories so implementation can proceed without waiting for final closure.

## Container Status Metadata

`tickets.py status` emits seven template-agnostic metadata fields on every container (and `backlog/`):

| Field | Meaning |
| --- | --- |
| `container_type` | `"program"`, `"initiative"`, `"epic"`, or `null` (`backlog/`) |
| `has_spec` | `true` when `<folder>.md` exists, `refined` is not `false`, and `## Requirements` has non-empty content |
| `unadopted_runs` | Container-local `[{path, template, status}]` entries for non-reserved run folders with frontmatter not yet listed in `sources:` or `companions:` |
| `companions` | `[{path, template}]` entries resolved from frontmatter `companions:` |
| `unrefined_epics` | Open epic slugs with `refined: false` (`<child>/<epic>` on program rollups) |
| `ready_entries` | Ready-to-start entry refs (`<child>/<ref>` on program rollups, or file names under `backlog/`) |
| `open_questions_count` | Count of active `Open question:` / `Unknown:` lines on the container (and open child epics) plus open tickets' `unknown` fields |

## `tickets.py` Subcommands

`tickets.py` is installed at `_bmad/method/scripts/tickets.py` and prints one JSON object per call. Sofia and the build skills invoke it automatically. When called without a folder argument, `next`, `status`, `find`, `body`, `mark`, `mirror`, and `note` resolve `core.active_initiative` (and `next` / `status` also report `backlog/`).

| Subcommand | Purpose |
| --- | --- |
| `next [dir] [--synced]` | Lists tickets grouped into `ready_to_refine`, `ready_to_start`, `in_progress`, and `blocked` (or `initiatives` on a program) |
| `status [dir]` | Resolves every ticket, container metadata field, drift warning, and dependency flag (`unpinned_after`, `undeclared_after`, `order_conflict`) |
| `find [dir] <ref>` | Resolves one ticket: its entry, epic file, leaf file (if present), `refined` state, prerequisites, and plan path |
| `body [dir] <ref>` | Renders the title and full markdown body to publish to an external tracker (resolving `covers` lines from the epic) |
| `pull <dir> <id>` | Writes an entry's leaf file (`tickets/<type>-<slug>.md`) in the given folder |
| `mark [dir] <ref> <status> [--assignee <who>] [--blocked <reason>]` | Writes `status` (plus optional assignee or block reason) to the ticket's plan file, creating frontmatter-only plans if needed (repo store only) |
| `mirror [dir]` | Writes tracker ids, remote links, and tracker statuses into leaf files (tracker stores only) |
| `note [dir] <ref> <text>` | Appends a one-line handoff note to an unstarted ticket's entry `notes` or leaf `## Notes` (repo store only; refuses tickets with a plan or status) |
| `add <dir>` | Appends a new entry to a folder's `tickets/tickets.toml` using `next_id` |
| `move <from> <ref> <to>` | Moves an entry, its leaf file, and its plan to another folder under that folder's `next_id` and rewrites every `after` pointing to it |

Exit codes: `0` on success, `2` when the configured store forbids the operation (such as `mark` on a tracker store), and `1` on any other error (such as a malformed tree, program-level build command, or missing active initiative).
