# Validation skills in detail

Read this when the question is about `bmad-code-review`, `bmad-walkthrough`, `bmad-qa-generate-e2e-tests`, or `bmad-retrospective`. For choosing review depth, getting another pass, and slow reviews, see `help/review-choices.md`.

| | Reviewer | Looks at | Fixes |
|---|---|---|---|
| Review inside `bmad-build` | Agents | The change just built | Clear findings, itself |
| `bmad-code-review` | Agents | Any diff, PR, branch, or commit | What the human chooses |
| `bmad-walkthrough` | The human, guided | A commit, PR, file, or directory | Nothing unless asked |
| `bmad-retrospective` | Agents, across tickets | A whole epic folder | Nothing; proposes action items |

**`bmad-code-review`** — agent review of any diff, with verified and triaged findings. With no argument it offers the tickets in review and diffs from the chosen plan's `baseline_revision`.
- Pick when: the code did not come from `bmad-build`; a PR or branch needs review; a build ran with review skipped or on the quick setting; after material fixes. Handing `bmad-build` its `built` plan also runs another review; a plan the user marked `done` is only context for new work. After an unattended run that sets `followup_review_recommended`, dispatch `bmad-build-auto` on the same ticket again; it goes straight to a fresh review pass.
- Not when: `bmad-build` just ran its full review on the same change. It is the same four lenses again. A run can take half an hour or more, and more than two rounds on one change usually points to a problem outside the change, such as weak planning or a messy codebase.
- Writes: a dated block in the plan's `## Code Review` section when it reviews a plan; otherwise findings stay in the chat. It never changes the ticket's `status`.

**`bmad-walkthrough`** — the human reviews a change block by block, at their own pace, with the agent as guide.
- Pick when: a person needs to understand and accept a change, after a build or for someone else's PR. It orders attention: intent first, then the broad strokes, then details.
- Not when: the user wants an automated bug hunt → `bmad-code-review`.
- Writes: a review narrative and a review log under `{implementation_artifacts}`.

**`bmad-qa-generate-e2e-tests`** — generates API and end-to-end tests for features that already exist.
- Pick when: the project has a UI or API with little end-to-end coverage. It covers the happy path plus one or two error cases and runs the tests until they pass.
- Not when: the user wants unit tests for work in flight (`bmad-build` writes and runs tests for the edge cases its plan lists; ask for more in the build request), a review, or a test strategy (the Test Architect module covers that).
- Writes: tests under `{project-root}/tests`, summary at `{implementation_artifacts}/tests/test-summary.md`.

**`bmad-retrospective`** — judges a finished epic folder in the ticket tree as a whole against the epic's Done when and the initiative's requirements.
- Gives: sourced findings no single session could see (architecture drift, duplication, spec versus built), owned action items, and a verdict: accepted, accepted with open items, or rejected.
- Pick when: every ticket of the epic is `built`, `done`, or `dropped`, and especially after unattended runs. It reads `tickets.toml`, the epic file, and each ticket's plan. An unfinished ticket forces a rejected verdict; tickets still at `built` are listed for the user to mark done.
- Not when: one ticket or one diff is in question → `bmad-code-review` or `bmad-walkthrough`.
- Writes: `epic-<slug>-retrospective.md` in the epic folder, with the verdict in its frontmatter, and nothing else. It marks nothing done.
