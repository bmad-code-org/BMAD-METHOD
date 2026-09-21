# Unattended builds

Use this when the user asks about `bmad-build-auto`, building stories with no human present, a blocked run, or what to check after a run.

## What one run does

- One invocation plans, implements, and reviews one story, then writes a final status to the story record. It never asks a question.
- It does not pick the next story. Something else runs the loop: the user, a script, an AI coding session starting one worker per story, or the optional bmad-loop orchestrator, which runs `stories.yaml` in list order, so prerequisites must come first.
- It needs subagents and, under version control, a clean working tree on a fitting branch.

## Accepted inputs

- Free text, a ticket or story id, or a path to an intent file.
- A story record an earlier run wrote.
- A pulled ticket file, for work planned with `bmad-preview-ticketing`: one run per ticket, with the file as the intent. Dispatch straight from `tickets.toml` is not available yet.
- A spec folder that already has `stories.yaml`, plus a story id. The folder also needs `SPEC.md`. The record lands at `stories/<id>-<slug>.md`.
- "Halt after planning" stops the run at `ready-for-dev`. The next dispatch implements it.

## Resume follows the record's status

- `draft`: plans.
- `ready-for-dev`, `in-progress`: implements.
- `in-review`: reviews.
- `done`: runs a fresh follow-up review.
- `blocked`: halts at once.

## Blocked runs

`blocked` means continuing without a human was unsafe. The reason is in the record under `Auto Run Result`, or in a `bmad-build-auto-result-*.md` file under `{implementation_artifacts}` when no record exists yet. Common reasons:

- `unclear intent`, `intent gap`: the input cannot answer a question the run hit.
- `no subagents`.
- `implementation verification failed`.
- `review repair loop exceeded 5 iterations`: review kept sending the work back.
- `no stories.yaml found`, `story id not found in stories.yaml`, `no epic spec found`: the spec folder is incomplete.
- `story already blocked`, `blocked spec supplied`: the record is still marked blocked.
- A dirty working tree or a mismatched branch.

To retry, fix the cause, delete the blocked story record, and dispatch again. A blocked record halts every later dispatch, even after the cause is fixed.

## The saved patch on an intent-gap halt

When review halts on `intent gap`, the run saves the attempted change as a patch file in `{implementation_artifacts}`, names the path in the record, and reverts the code. If the patch reads the intent correctly, the user runs `git apply` on it, sets the record's status to `in-review`, and dispatches again. If it was wrong, they fix the intent and start fresh.

## What to read afterwards

- `status` in the record's frontmatter. Chat output is not proof of success.
- `followup_review_recommended`: true when review fixed a high finding or two or more medium ones. It is a suggestion; dispatching the `done` record again gives another pass.
- `deferred` in the frontmatter: real findings that were not this story's problem. Nothing files them; the user decides whether to make tickets.
- `Auto Run Result`: summary, review findings, verification, residual risks.
- The run commits locally and never pushes.
- After the last story, recommend `bmad-retrospective`.

## When it fits

- Fits: decisions and patterns are settled, stories are well specified, and someone reads the results.
- Use `bmad-build` instead for risky or foundational stories, thin intent, or whenever a human should approve the plan. Do not offer `bmad-build-auto` to a user who is present.
