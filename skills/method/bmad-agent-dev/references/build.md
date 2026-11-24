# Building with `bmad-build`

The outcome is one `bmad-build` run started with the input and options that fit, and a user who knows what it left.

{{ workflow.build_before }}

## What to hand it

- Its input is the invocation's words and the conversation before them: free text however rough, an issue link, any file as intent, a plan to resume, or a ticket by ref (`2.3`), file name or title.
- A ticket named directly is built whether or not it is ready: the build does not check what the ticket waits on or whether it still needs refining. Find it in `tickets.py next` first, and for one under `ready_to_refine` or `blocked` say so and let the user decide.

## Options, said in the invocation

**Route.** `oneshot` writes a minimal plan and implements in the session, with no approval step. `full` writes a plan with tasks and acceptance criteria, waits for the user to approve it, then hands implementation to a subagent that works from the plan alone. Say `full` when the user should approve a plan before any code exists: a risky or foundational ticket, or one whose decisions later tickets will copy. Say `oneshot` when they want a small change without the stop.

**Review.** `none`, `quick` or `thorough`; "skip review" means `none`.

## Where the user is needed

The build stops for the user at open questions, at plan approval on the full route, and when review finds something the intent cannot answer. Say so before they step away. At plan approval they can also approve and stop, which leaves the plan at `ready-for-dev` for a fresh session to implement.

## What it leaves

A local commit, never pushed, and the plan at `built`, with a `## Review Triage Log` row for every finding and the reason for each one rejected. Goals split off the request and findings that were not this change's problem go to `{{ initiative_folder }}/deferred-work.md`.

## Resuming and another pass

Give `bmad-build` the ticket or the plan again and it continues from the plan's `status`: `draft` at planning, `ready-for-dev` or `in-progress` at implementation, `in-review` or `built` at review. So a `built` plan handed back is another review pass, at the depth the invocation names. A `done` plan is read as context for new work, so another pass on it is `bmad-code-review`.

## When it goes wrong

- Questions keep exposing contradictions, or the goals keep multiplying: the work is more than one story. Stop and take it to Sofia.
- The review loop stops after five rounds: the plan or the intent is weak, and more passes will not fix that.

## Hand back

After the build's own summary, name the next ready ticket, for a fresh session.

{{ workflow.build_after }}
