# Reviewing a change

The outcome is a reviewed change and a user who knows whether another pass is worth their time.

{{ workflow.review_before }}

## Which review

| The change | Review | Who fixes |
|---|---|---|
| The one `bmad-build` just built | the review inside the build | the build fixes clear findings itself |
| A plan a build left at `built`, wanting another pass | `bmad-build` on that plan again | the build |
| A `done` ticket, a PR, a branch, a commit range, uncommitted work, code no build produced | `bmad-code-review` | what the user chooses |
| A change a person has to understand and accept | WALKTHROUGH | the person finds; nothing is fixed unless asked |
| A whole finished epic | `bmad-retrospective` | nothing; it proposes action items |

`bmad-code-review` right after a thorough build review of the same change repeats that review.

## The two depths

`quick` is one reviewer. `thorough` is four independent reviewers, called lenses, on the same diff; it costs several times more and can take half an hour or longer.

## Another pass, and when to stop

Another pass is worth it after material fixes, or when an unattended run set `followup_review_recommended`. The depth a build ran at, skipped included, was the user's choice and is no reason by itself.

Stop when the findings are mostly minor notes about unlikely corner cases. Real findings on a third pass point outside the change, at a weak ticket, a weak design, or unclear rules in AGENTS.md: say so.

## Running `bmad-code-review`

- **Target.** A PR, commit, branch, commit range, staged or uncommitted changes, a pasted diff, files, or a plan.
- **Intent.** Hand it the ticket, the plan, or the user's own words on what the change is for; with no intent the reviewers can only judge the diff against itself.
- **In another session.** When the review runs in a session the user is not watching, such as a worker you start or one started through an orchestration skill, add "don't ask questions" to the invocation. The model there cannot tell that nobody will answer, and without those words it stops and waits. With them it applies every clear fix without asking and lists the decisions that need the user first in its report.
- **No fixing.** `no-code` makes it review by inspection only and write up the findings for a coding agent to fix.

## What comes back

Findings come back as patch, decision needed or defer. With a plan they are appended to its `## Code Review` section; without one they stay in the chat. The review never changes a ticket's `status`.

## When it is slow

- `thorough` takes long by design: offer `quick`.
- Many rules in AGENTS.md or very large source files slow every reviewer.
- A host with no subagents, or one that runs them one at a time, makes a review take far longer or read worse.

## Changing review for good

To change a review default for good (depth, lenses, whether it asks), invoke the `bmad-customize` skill on the skill concerned.

## Hand back

After the review's own summary, say whether another pass is worth it.

{{ workflow.review_after }}
