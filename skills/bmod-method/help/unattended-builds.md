# Unattended builds

Use this when the user asks about `bmad-build-auto`, building tickets with no human present, a blocked run, or what to check after a run.

## What one run does

- One invocation plans, implements, and reviews one ticket, then writes a final status to its plan. It never asks a question.
- It builds only what the invocation names and never picks work itself; given nothing, it halts `unclear intent`. It never moves on to a second ticket. Something else chooses each ticket and runs the loop: the user, a script, an AI coding session starting one worker per ticket, or an orchestrator such as bmad-loop, which does not dispatch from the ticket tree yet.
- It needs subagents and, under version control, a clean working tree on a branch that fits the ticket's epic.

## Accepted inputs

- A ticket from the tree, named as a ticket (`ticket 1.2`, or a ticket's title), or a ticket file. A bare ref or title is not taken as a ticket. It builds from the entry, its epic file, and the entry's story file when it has one, and never writes a ticket file.
- Free text or a path to an intent file.
- A plan an earlier run wrote.
- "Halt after planning" stops the run at `ready-for-dev`. The next dispatch implements it. An orchestrator uses this for the `plan_checkpoint` of an entry that is not refined; the run itself never reads `plan_checkpoint` or `done_checkpoint`.

## Where the plan goes

- A ticket's plan sits beside `tickets.toml`, or in `backlog/` for a backlog ticket, at the path `tickets.py find` returns, with `ticket` and `baseline_revision` in its frontmatter. Other work gets `{implementation_artifacts}/plan-<slug>.md`.
- A successful run ends at `built`, which the board shows as review. Only the user or an orchestrator marks the ticket done, with `tickets.py mark <ref> done`.
- This is the repo store. On a tracker store, `next` and `mark` refuse, so name the ticket and move it through the ticketing skill.

## Resume follows the plan's status

- `draft`: plans.
- `ready-for-dev`, `in-progress`: implements.
- `in-review`: reviews.
- `built`, `done`: runs a fresh follow-up review.
- `blocked`: halts at once.

## Blocked runs

`blocked` means continuing without a human was unsafe. For a ticket named by ref, file, or title, the run records it with `tickets.py mark`, so `blocked_at` and `blocked_reason` sit in the plan, which is created if the run halted before planning; details are under `Auto Run Result`. Other halts set `status` in the plan and put the reason under `Auto Run Result`, or write a `bmad-build-auto-result-*.md` file under `{implementation_artifacts}` when there is no plan yet. `tickets.py status` shows each blocked ticket with its reason. Common reasons:

- `unclear intent`, `intent gap`: the input cannot answer a question the run hit.
- `no subagents`.
- `ticket not resolved`: `find` failing on the reference.
- `implementation verification failed`.
- `review repair loop exceeded 5 iterations`: review kept sending the work back.
- `blocked plan supplied`: the plan is still marked blocked.
- A dirty working tree or a mismatched branch.

A blocked plan halts every later dispatch of its ticket and keeps its first reason. To retry, fix the cause, then run `tickets.py mark <ref> <status>` with the status to resume from, which clears the blocked fields. A plan that holds only frontmatter can be deleted instead, and the next dispatch starts fresh.

## The saved patch on an intent-gap halt

When review halts on `intent gap`, the run saves the attempted change as a patch file in `{implementation_artifacts}`, names the path in the plan, and reverts the code. If the patch reads the intent correctly, the user runs `git apply` on it, sets the plan's status to `in-review`, and dispatches again. If it was wrong, they fix the intent and start fresh.

## What to read afterwards

- `status` in the plan's frontmatter, or `tickets.py status`. Chat output is not proof of success.
- `followup_review_recommended`: true when review fixed a high finding or two or more medium ones. It is a suggestion; dispatching the ticket again gives another pass.
- `deferred` in the frontmatter: real findings that were not this ticket's problem. Nothing files them; the user decides whether to make tickets.
- `Auto Run Result`: summary, review findings, verification, residual risks.
- The run commits locally and never pushes.
- After the epic's last ticket, recommend `bmad-retrospective`.

## When it fits

- Fits: decisions and patterns are settled, tickets are well specified, and someone reads the results.
- Use `bmad-build` instead for risky or foundational tickets, thin intent, or whenever a human should approve the plan. Do not offer `bmad-build-auto` to a user who is present.
