# Review choices

Use this when the user asks how much review to run, how to get another pass, when to stop, why review is slow, or how to change review.

## Review depth in `bmad-build`

- `none`: no reviewers. Reasonable for a throwaway prototype.
- `quick`: one reviewer checks acceptance criteria, the repo's agent rules, and bugs.
- `thorough`: four independent lenses covering the bare diff, edge cases, test gaps, and intent alignment.
- Default: a change of about 100 lines or fewer gets `quick`, a larger one `thorough`. The user picks by saying "quick", "thorough", or "skip review" when invoking.
- It fixes clear findings itself, asks the user when the intent cannot settle one, and logs pre-existing issues to `deferred-work.md`.

## Another pass, and when to stop

- After `bmad-build`: run `bmad-code-review` with the story file. Handing `bmad-build` a `done` story file does not repeat the review.
- After `bmad-build-auto`: dispatch the `done` record again.
- Worth it when review was skipped or `quick`, after material fixes, or when an unattended run set `followup_review_recommended`. After a `thorough` build review it only repeats the same lenses.
- Stop when findings are mostly minor notes about unlikely corner cases.
- Real findings on a third pass point outside the change: a weak spec or unclear repo rules. Tell the user to fix that.

## `bmad-code-review`

- Target: a PR, commit, branch, commit range, uncommitted changes, a pasted diff, or files.
- Tell the user to supply the intent: a spec, story file, or plain description. Without it the reviewers can only judge the diff against itself.
- Defaults to `thorough`; "quick" uses one reviewer. Above about 3000 diff lines it offers to review in file groups.
- Triage checks every finding against the code and rejects disproved ones, plus low ones whose fix would add complexity.
- Survivors become patch (a clear fix), defer (pre-existing or unverified), or decision needed (only when a spec was given).
- The user chooses: apply all patches, walk through each, or leave them as action items in the story file.

## Why review is slow

- It is thorough on purpose and can take half an hour or more. Offer `quick`.
- `AGENTS.md` has too many rules, or source files are very large. Reviewers read both.
- The platform has no subagents or runs them one at a time.

## `bmad-walkthrough`: the human reviews

Recommend it when a person must understand and accept a change: after a build, or on someone else's PR. It walks the change in blocks, intent first, and stays on a block until the user says it is done. It gives no severity and no verdict. Moves the user can pick:

- **Thoughts**: the agent's own read. **Second opinion**: a fresh subagent's read.
- **Formal review**: runs `bmad-code-review` when installed.
- **Test**: helps test the part. **Drive**: starts the app and says what to click.
- **Wrap-up**: proposes the follow-through, such as merging, and waits for a yes.

For specs and docs, `bmad-review` (core tools), if installed, reports findings and fixes nothing.

## What `bmad-customize` can change

- The default depth, separately for `bmad-build`, `bmad-build-auto`, and `bmad-code-review`.
- The lenses: add, replace, disable, or run one on another model.
- `bmad-walkthrough`: instructions at start, per block, and at wrap-up.
