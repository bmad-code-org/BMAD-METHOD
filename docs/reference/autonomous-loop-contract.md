---
title: Autonomous Loop Orchestrator Contract
description: Machine-readable contract for orchestrators invoking bmad-build-auto, including invocation inputs, tickets.py interactions, plan frontmatter, exit states, deferred findings, and patch recovery.
sidebar:
  order: 9
---

This page specifies the exact machine contract between an external orchestrator (such as a loop script, CI job, or supervising AI session) and `bmad-build-auto`. For the human overview and practical workflow guidance, see [Autonomous Development Loops](../build/autonomous-development-loops.md).

## Execution Model and Prerequisites

`bmad-build-auto` executes exactly one unattended implementation iteration per invocation: clarify and route, plan, implement, review, and write a terminal status. It never picks the next ticket, iterates over a backlog, coordinates across epics, or runs retrospectives.

### Mandatory Subagent Rule

`bmad-build-auto` requires blocking subagent execution. If the host cannot launch subagents, the workflow halts immediately with `status: blocked` and blocking condition `no subagents`. Every step's subagents must run as blocking calls awaited in the same turn, never detached or backgrounded, because unattended invocations have no event loop to resume a yielded turn.

### Version Control and `NO_VCS`

Version control is recommended but optional:

- With VCS present, before code changes start, the working tree must be clean, the active branch must fit the intent (for a ticket from the tree, judged against the epic rather than the individual story), and repository metadata must be writable (`git add --refresh -- .`). On failure, the run halts `blocked` (`version-control metadata not writable`, dirty tree, or branch mismatch). At completion, `bmad-build-auto` commits remaining reviewed-diff files locally, never pushes, and verifies a clean working copy (halting `blocked` with `finalization left repository dirty` if anything remains dirty).
- Without VCS, `baseline_revision` is recorded as `NO_VCS`, VCS clean-tree and commit steps are skipped, and final status is written directly to the plan frontmatter.

## Invocation Contract

One invocation accepts exactly one of four input shapes:

| Input shape | How `bmad-build-auto` handles it |
| --- | --- |
| Ticket from the tree | Explicitly presented as a ticket (`ticket 1.2`, a ticket file path whose frontmatter `type` is `story`, `spike`, or `bug`, or a ticket title called out as a ticket). A bare ref or title not labeled as a ticket is treated as free-form intent. |
| Existing plan file | A path to a plan file carrying a recognized frontmatter `status`. |
| Intent file path | A path to an unformatted intent file. |
| Free-form change request | A bounded task description; if insufficient to determine what to build, the run halts `blocked` with `unclear intent`. |

### Ticket Tree Interactions (`tickets.py`)

`bmad-build-auto` reads the ticket tree strictly through `_bmad/method/scripts/tickets.py`:

| Interaction | Behavior |
| --- | --- |
| Resolution | Named tickets run `tickets.py find <ref>` (passing `<dir> <file>` for ticket files); any non-zero exit halts `blocked` with `ticket not resolved`. |
| Read-only ticket files | Build Auto reads `story_file` (when present) or the entry fields from `tickets.toml`, plus `epic_file`, relevant `References` and `companions:`, and same-epic prerequisite plans for continuity. It never edits ticket files and never runs `tickets.py pull`. |
| Forward handoff notes | On the repo store only, Build Auto may append a one-line note to an unstarted later ticket in the same epic via `tickets.py note <folder> <entry id> "<note>"`. |
| Status writes | Build Auto never moves a ticket to `done`. Only its HALT protocol calls `tickets.py mark <ticket_args> blocked --blocked <reason>` on the repo store. On tracker stores (where `tickets.py mark` exits with code `2`), status transitions on the tracker happen through Sofia (`bmad-agent-po`). |
| Checkpoints (`plan_checkpoint` and `done_checkpoint`) | Build Auto ignores both entry fields; the orchestrator enforces them. To honor `plan_checkpoint` on a refined story (`refined: true`), require human approval of the story file before dispatch; on an unrefined entry, include `Halt after planning.` in the invocation prompt so the run stops at `ready-for-dev`, then re-dispatch after human approval. To honor `done_checkpoint`, pause after `built` until a human approves continuing. |

## Resume Routing Table

When invoked with an existing plan path or a ticket whose plan file already exists, step 1 routes immediately from the plan's frontmatter `status`:

| Existing `status` | Entry step or action |
| --- | --- |
| `draft` | Step 2 (plan) |
| `ready-for-dev` | Step 3 (implement) |
| `in-progress` | Step 3 (implement) |
| `in-review` | Step 4 (review) |
| `built` | Resets `review_loop_iteration` to `0`, sets `followup_pass = true`, enters Step 4 for a fresh review pass (finishes `built`) |
| `done` | Resets `review_loop_iteration` to `0`, sets `followup_pass = true`, enters Step 4 for a fresh review pass (preserves `done`) |
| `blocked` | Halts immediately with `blocked plan supplied` (writes nothing, preserving original `blocked_reason`) |
| `dropped` | Halts immediately with `dropped plan supplied` (writes nothing, preserving `dropped`) |

## Plan Artifact Schema

For a ticket from the tree, the plan lives at the `plan` path returned by `tickets.py find` (`<type>-<slug>-plan.md` inside the epic's `tickets/` folder or `backlog/`). For standalone work, it lives at `{output_folder}/{active_initiative}/plan-<slug>.md` (or `{output_folder}/plan-<slug>.md` when no initiative is active).

### Frontmatter Keys

| Key | Type / Values | Meaning |
| --- | --- | --- |
| `title` | String | Work item title |
| `type` | `feature`, `bugfix`, `refactor`, `chore` | Implementation change type (never a ticket type) |
| `ticket` | String | Entry `id` from `tickets.toml`, file stem for a `backlog/` ticket, or `""` outside the tree |
| `created` | Date string | Plan creation date |
| `status` | `draft`, `ready-for-dev`, `in-progress`, `in-review`, `built`, `done`, `blocked`, `dropped` | Primary machine-readable orchestration state |
| `baseline_revision` | Commit SHA or `NO_VCS` | Full canonical revision captured before implementation (preserved on resume) |
| `route`, `route_source` | `oneshot` or `full`; `pinned` or `auto` | Chosen execution route and how it was selected |
| `risk` | `low`, `medium`, `high` | Business impact scored at planning (never lowered below the ticket's `risk`) |
| `review`, `review_source` | `none`, `quick`, `thorough`; `pinned` or `auto` | Review depth and how it was selected |
| `lenses_ran` | String array | Review lens ids executed in launch order |
| `review_loop_iteration` | Integer | Incremented before each `bad_plan` repair loopback (halts above `5`) |
| `followup_review_recommended` | Boolean | Set at finalize when another review pass is warranted |
| `context` | String array | `{project-root}/`-prefixed contract paths loaded directly by implementer and reviewer |
| `warnings` | String array | Machine-readable orchestration warnings (for example, `oversized`, `multiple-goals`) |
| `deferred` | YAML list of mappings | Append-only deferred review findings (see [Deferred Findings Schema](#deferred-findings-schema)) |
| `assignee`, `blocked_at`, `blocked_reason` | Strings | Optional ownership and block metadata written by `tickets.py mark` |

### Immutable `<intent-contract>` Block

Every plan encloses its settled intent in `<intent-contract> ... </intent-contract>` containing `## Intent` (`Problem`, `Approach`), and on `full` routes `## Boundaries & Constraints` (`Always`, `Never`) and `## I/O & Edge-Case Matrix`. During review repair loopbacks (`bad_plan`), the workflow may amend tasks, code map, and design notes outside `<intent-contract>` (recording each amendment in `## Plan Change Log`), but it never modifies content inside `<intent-contract>`. Any defect whose root cause lies inside `<intent-contract>` halts as `intent gap`.

### `## Auto Run Result` Section

At completion or halt on an existing plan (except `blocked plan supplied` and `dropped plan supplied`, which write nothing), `bmad-build-auto` writes or updates `## Auto Run Result` and verifies it on disk before committing or halting. On an early halt before implementation, only `Status`, `Blocking condition`, and any run details gathered so far are recorded. Full runs contain:

- `Status: <final status>`, matching frontmatter `status` (plus `Blocking condition: <condition>` on `blocked`)
- Summary of the implemented change
- Files changed with one-line descriptions
- Review findings breakdown (patches applied, items deferred, and every rejected finding with its reason; or `Review: none, no lenses launched`)
- Follow-up review recommendation (`followup_review_recommended`) with patched counts by verdict and the specific unverified risk whenever `true`:
  - First pass: `true` if any patched finding was `high`, or two or more patched findings were `medium`
  - Follow-up pass (`followup_pass = true`): `true` only if this pass patched a `high` finding
- Verification performed (command outcomes or manual inspection notes)
- Residual risks, including execution tasks left unticked (or blocking details on `blocked`)

### Fallback Result Artifact

If a run halts before a valid `plan_file` exists and either no ticket was resolved or `tickets.py mark` failed, the workflow writes a fallback artifact at `{output_folder}/{active_initiative}/bmad-build-auto-result-<slug-or-timestamp>.md` (or in `{output_folder}/` when no initiative is active):

```markdown
---
status: blocked
---

# BMad Build Auto Result

Status: blocked
Blocking condition: unclear intent
```

## Exit States and Blocking Conditions

Every invocation terminates cleanly in one of four terminal plan statuses:

| Terminal status | Meaning |
| --- | --- |
| `ready-for-dev` | Returned only when the invocation explicitly requested `Halt after planning.` and the plan passed the Ready for Development standard |
| `built` | Implementation, verification, review, and local commit succeeded on a standard run (or follow-up review of a `built` plan) |
| `done` | Preserved when a follow-up review pass completes on a plan already marked `done` |
| `blocked` | Unattended execution cannot continue safely; requires orchestrator routing or human intervention |

Standard blocking conditions recorded in `blocked_reason` and `## Auto Run Result`:

- `unclear intent`
- `intent gap`
- `no subagents`
- `ticket not resolved`
- `version-control metadata not writable`
- `plan failed ready-for-development standard`
- `missing plan_file before implementation`
- `implementation verification failed`
- `patch verification failed`
- `review repair loop exceeded 5 iterations (non-convergence)`
- `finalization left repository dirty`
- `blocked plan supplied`
- `dropped plan supplied`

## Deferred Findings Schema

Real pre-existing issues outside the current change, agent-context file edits (`AGENTS.md`, `CLAUDE.md`), and `maybe-false` findings whose true severity would be `medium` or `high` are appended to the single `deferred:` YAML list in plan frontmatter (free-form values serialized as YAML block scalars):

```yaml
deferred:
  - summary: >-
      Existing retry helper swallows HTTP 429 Retry-After headers.
    evidence: |-
      Observed in src/http/client.py:88 while tracing caller error handling; pre-existing before this change.
    location: >-
      src/http/client.py:88
    severity: medium
```

- `summary` (required): One-sentence description of the issue.
- `evidence` (required): Proof the finding is real, or for a `maybe-false` entry, what check would settle it.
- `location` (optional): `file:line` or component reference.
- `severity` (optional): `high`, `medium`, or `low`; a `maybe-false` entry appends `" (unverified)"` (for example, `medium (unverified)`). Weaker `low` `maybe-false` items are rejected in `## Review Triage Log` rather than deferred.

`deferred:` is a machine-readable output, not a backlog. The orchestrator decides whether to file tickets, deduplicate across runs, or ignore entries.

## `intent gap` Patch Recovery

When Step 4 review halts on `intent gap`:

1. `bmad-build-auto` saves the attempted working-tree changes as a `.patch` file beside `{plan_file}` (same stem, `.patch` replacing `.md`) and records its path in `## Review Triage Log` and the halt output.
2. The working tree is reverted to `{baseline_revision}` and the plan is marked `blocked` with `intent gap` and the unresolved questions.
3. After inspecting the patch and resolving the intent question:
   - If the attempted reading was wrong, update the ticket or `<intent-contract>`, clear the block with `tickets.py mark <ref> draft`, and re-dispatch.
   - If the attempted reading was correct, update `<intent-contract>` so the intent is explicit, apply the saved patch with `git apply <plan-stem>.patch`, set status to `in-review` via `tickets.py mark <ref> in-review` (which clears `blocked_at` and `blocked_reason`), and re-dispatch to resume directly at review instead of re-implementing from scratch.

To retry any other `blocked` ticket after fixing its cause, run `tickets.py mark <ref> <resume-status>` (or delete a frontmatter-only stub plan to start fresh).

## Orchestrator Responsibilities

- Dispatch one ticket (`ticket <ref>`) or one bounded intent per invocation.
- Pass the same ticket ref (or standalone plan path) on resume so halts update `blocked_reason` on the same plan.
- Read terminal state from plan frontmatter (`status`, `blocked_reason`, `followup_review_recommended`, `deferred`, `warnings`) or the fallback result file rather than parsing chat prose.
- Identify a ticket's commit range with `<baseline_revision>..<next ticket's baseline_revision>` (or `<baseline_revision>..HEAD` when no later ticket has started).
- Call `tickets.py mark <ref> done` (or move the card via Sofia on tracker stores) once a `built` ticket is accepted.
- Enforce `plan_checkpoint` and `done_checkpoint` externally.
- Treat `blocked` as a routing signal for human escalation or spec repair, not merely a crash.
