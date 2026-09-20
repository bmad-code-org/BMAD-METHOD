# Validation skills in detail

Read this when the question is about `bmad-code-review`, `bmad-walkthrough`, `bmad-qa-generate-e2e-tests`, or `bmad-retrospective`. For choosing review depth, getting another pass, and slow reviews, see `help/review-choices.md`.

| | Reviewer | Looks at | Fixes |
|---|---|---|---|
| Review inside `bmad-build` | Agents | The change just built | Clear findings, itself |
| `bmad-code-review` | Agents | Any diff, PR, branch, or commit | What the human chooses |
| `bmad-walkthrough` | The human, guided | A commit, PR, file, or directory | Nothing unless asked |
| `bmad-retrospective` | Agents, across stories | A whole epic or spec folder | Nothing; proposes action items |

**`bmad-code-review`** — agent review of any diff, with verified and triaged findings.
- Pick when: the code did not come from `bmad-build`; a PR or branch needs review; a build ran with review skipped or on the quick setting; after material fixes. `bmad-build` does not re-review a finished change: handed a `done` record it treats it as context for new work. After an unattended run that sets `followup_review_recommended`, re-dispatch `bmad-build-auto` on the same `done` story instead; it goes straight to a fresh review pass.
- Not when: `bmad-build` just ran its full review on the same change. It is the same four lenses again. A run can take half an hour or more, and more than two rounds on one change usually points to a problem outside the change, such as weak planning or a messy codebase.
- Writes: a `Review Findings` section in the story file when there is one; otherwise findings stay in the chat.

**`bmad-walkthrough`** — the human reviews a change block by block, at their own pace, with the agent as guide.
- Pick when: a person needs to understand and accept a change, after a build or for someone else's PR. It orders attention: intent first, then the broad strokes, then details.
- Not when: the user wants an automated bug hunt → `bmad-code-review`.
- Writes: a review narrative and a review log under `{implementation_artifacts}`.

**`bmad-qa-generate-e2e-tests`** — generates API and end-to-end tests for features that already exist.
- Pick when: the project has a UI or API with little end-to-end coverage. It covers the happy path plus one or two error cases and runs the tests until they pass.
- Not when: the user wants unit tests for work in flight (`bmad-build` writes and runs tests for the edge cases its plan lists; ask for more in the build request), a review, or a test strategy (the Test Architect module covers that).
- Writes: tests under `{project-root}/tests`, summary at `{implementation_artifacts}/tests/test-summary.md`.

**`bmad-retrospective`** — judges a finished epic, or a finished spec folder's stories, as a whole against its spec.
- Gives: sourced findings no single session could see (architecture drift, duplication, spec versus built), owned action items, and a verdict: accepted, accepted with open items, or rejected.
- Pick when: every story of the epic or spec folder is done, and especially after unattended runs. An unfinished story forces a rejected verdict.
- Not when: one story or one diff is in question → `bmad-code-review` or `bmad-walkthrough`.
- Writes: `{implementation_artifacts}/epic-{n}-retro-{date}.md` on the epics route, `RETROSPECTIVE.md` inside the spec folder on the spec route.
