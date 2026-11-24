# Unattended builds with `bmad-build-auto`

`bmad-build-auto` builds the one ticket its invocation names and never asks a question, so you choose each ticket and read each result. The outcome is the ready tickets built one run at a time, and a report the user can act on without having watched: what is built, what is blocked and why, what was deferred.

{{ workflow.unattended_before }}

## When it fits

It fits when the decisions and patterns are settled, the tickets are well specified, and someone will read the results. The early, foundational tickets set those patterns, so they are built with `bmad-build`, where a person approves the plan.

Each run needs a clean working tree on a branch that fits the ticket's epic, and subagents inside the worker. The tickets must live in the repository: in a tracker `mark` refuses, so a run cannot record its status.

## The loop

1. Run `tickets.py next` and take the first `ready_to_start` row. Skip a `hitl` row and say so: the run does not read `hitl`, and part of that ticket needs a person.
2. Honor the row's checkpoints, which the run never reads. `plan_checkpoint` on a ticket Sofia refined (`refined` in `find`'s output): a person approves its story file before the run. On one she did not: start the run with `Halt after planning.`, which stops it at `ready-for-dev`, wait for a person to approve the plan, then start it again. `done_checkpoint`: after that ticket's run, wait until a person says to continue.
3. Start a worker whose whole instruction is to run the `bmad-build-auto` skill on `ticket <ref>`. The word `ticket` is required: a bare ref is read as a loose description, and its plan and status never reach the tree.

   {{ workflow.unattended_worker }}
4. Read the result from the plan at `find`'s `plan`, or from `tickets.py status`.
   - `built`: the run finished. `followup_review_recommended: true` means review fixed a high finding or several medium ones: run the same ticket again, which goes straight to a fresh review pass.
   - `blocked`: see Blocked runs.
   - `deferred` in the frontmatter lists findings the run set aside: carry them into the report.
5. Run `next` again and repeat until nothing is ready, a checkpoint waits for a person, or the user's limit is reached.

## Blocked runs

The reason is `blocked_reason` in the plan, with detail under `## Auto Run Result`; together they say what to fix. Two reasons need more: on `unclear intent` or `intent gap` the user answers and Sofia writes the answer into the ticket; on `review repair loop exceeded 5 iterations (non-convergence)` a person builds the ticket with `bmad-build`.

A run that could not resolve its ticket leaves its reason in a `bmad-build-auto-result-*.md` file in `{{ initiative_folder }}`, and the tree still shows the ticket as ready: report it instead of starting it again.

A blocked plan halts every later run of its ticket. To retry, fix the cause, then run `tickets.py mark <ref> <status>` with the status to resume from, which clears the block: `draft` plans again, `ready-for-dev` or `in-progress` implements, `in-review` reviews.

When review halts on `intent gap`, the run saves the attempted change as a `.patch` file beside the plan, names it in the plan, and reverts the code. The patch shows which reading of the intent was built. Once the ticket says which reading is right: if it is the one built, `git apply` the patch, mark the ticket `in-review` and run it again; if not, mark it `draft` and the run plans again.

## Hand back

Report per ticket: its `status`, its commits (`baseline_revision` to the next ticket's, or to `HEAD` for the last), what was deferred, and for a blocked one the reason and what clears it. The runs commit locally and never push. Say which tickets now wait for the user to accept them.

{{ workflow.unattended_after }}
