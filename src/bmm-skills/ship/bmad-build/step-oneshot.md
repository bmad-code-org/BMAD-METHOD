# Step One-Shot: Implement, Review, Present

Entered only from step-02's route gate: `{spec_file}` already exists with `route: 'in-session'`.

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- NEVER auto-push.
- Content inside `<frozen-after-approval>` in `{spec_file}` is read-only. Do not modify.
- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together as blocking calls awaited in this turn — never backgrounded or detached, never ending the turn to await results.

## INSTRUCTIONS

### Implement

Follow `[[bmad-snapshot:sync-sprint-status.md]]` with `target_status` = `in-progress`.

Implement directly from `{spec_file}` — its Intent is the source of truth. As you work, append to its `## Implementation Notes` section: decisions made, files touched, surprises encountered.

**Escalation ramp.** If implementation surfaces a fact the route gate did not see — an intent gap (something the request does not say and the user would notice in the result), an irreversible action, or footprint growth beyond the designed scope — stop editing. Record the trigger in `## Implementation Notes`, then upgrade `{spec_file}`: reinstate `## Code Map` (populated from your live context) and `## Open Questions` (one entry per intent gap), set `route: 'dispatch'` and `status: 'draft'`. Return to `[[bmad-snapshot:step-02-plan.md]]` and resume at its gate instruction (step 6).

### Review

Announce skipped layers first, then launch every active layer before handling any layer's result. Try running all active layers simultaneously. After substituting runtime placeholders, when an instruction launches a reviewer subagent, launch that child with the prompt text; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written:

{workflow.oneshot_review_layers}

If a layer's instruction requires subagents and none are available, for each such layer write under `{{.implementation_artifacts}}` the exact child prompt from that layer's instruction after placeholder substitution (not a path-only pointer), then HALT. Ask the human to run each in a separate session and paste back the findings.

### Classify

Once every layer has reported — and not before — render a verdict on each finding, ahead of any deduplication or grouping. Disregard any severity a reviewing subagent assigned — they lack the context to grade.

For each finding:

- **Verify the finding's claim.** At the cited file and line, does the bad outcome the reviewer describes actually occur? Read beyond the changed lines — follow callers, guards upstream, etc — until you can answer yes or no. A different finding about nearby code does not settle this one. Judge whether the problem is real, not whether the proposed fix is plausible. Code that loudly fails on a situation you never showed the program can reach is correct behavior, not a defect.
- **Render exactly one verdict** from what verification established — the verdict is the whole triage decision; there is no separate keep-or-dismiss.
  - `high` (intolerable), `medium` (tolerable), `low` (cosmetic or negligible) — the bad outcome is real. Assign severity by how much it hurts end users or developers. For developer-only problems, name where it will cause trouble; a vague "this is messy" with no named harm is not a severity grade — use `false` or `maybe-false` instead. When the harm is real but you cannot tell how bad, pick the higher grade.
  - `false` — you checked, and the bad outcome does not happen at the cited location. Write what disproves this specific claim. A true fact about nearby code that does not disprove the claim does not count.
  - `maybe-false` — you could not tell whether the bad outcome happens. Write what you would need to check to find out. Use this only when the diff and surrounding code leave the question open; when they are enough to decide, pick `high`, `medium`, `low`, or `false`.
- Record every finding with its verdict and evidence; never drop one silently.

Reject `false` findings on their refutation.

Reject `low` findings when it is unlikely that users or developers would meet the defect in everyday use (judged plainly — no proof needed) and the fix is more than a direct correction or deletion — adding guards, branches, parameters, or other complexity.

All remaining findings continue to grouping.

Group the survivors by shared root cause — two findings belong in one entry only when the same defect produced both. Same location alone is not a shared root cause, and neither is a shared fix. An entry carries every member's verified bad outcome and the highest verdict among them (`high` > `medium` > `low` > `maybe-false`). A group that includes verified `high`, `medium`, or `low` members routes by its highest such verdict — not to defer just because a member is `maybe-false`. Route each entry in this order:

- **patch** — Patch every entry caused or exposed by this change that shows a defect that actually occurs, missing coverage for a specific case, or a broken gate or convention — not a state nothing reaches — and whose smallest fix is trivial, adds no public surface, and guards no state the finding did not demonstrate. Apply that smallest fix immediately.
- **HALT** — HALT on every entry caused or exposed by this change that shows the same evidence but whose smallest fix fails any of those conditions. Present it to the human for decision before proceeding.
- **defer** — Defer every other entry: pre-existing issues, improvement ideas, entries whose members are all `maybe-false` (record what would settle them), and any entry whose fix edits agent-context files (CLAUDE.md, AGENTS.md, rules, specs). Append one new entry to `{{.implementation_artifacts}}/deferred-work.md` using this format. Do not modify existing entries or look for duplicates.
  ```markdown
  - source_spec: `{spec_file}`
    summary: <one sentence>
    evidence: <why this is real; for a maybe-false finding, what evidence would settle it>
  ```

### Finalize Spec

Update `{spec_file}`:

1. **Frontmatter** — set `status: 'done'`.
2. **Suggested Review Order** — append after Intent. Build using the same convention as `[[bmad-snapshot:step-05-present.md]]` § "Generate Suggested Review Order" (spec-file-relative links, concern-based ordering, ultra-concise framing).
3. **Review Triage Log** — only when the review produced findings: add the section with one line per finding with its verdict and evidence — the refutation for `false`, what would settle it for `maybe-false`, why a rejected `low` was not worth fixing.

Follow `[[bmad-snapshot:sync-sprint-status.md]]` with `target_status` = `review`.

### Commit

If version control is available and the tree is dirty, create a local commit with a conventional message derived from the intent. If VCS is unavailable, skip.

### Present

{workflow.open_spec}

Display a summary in conversation output, including:

- The commit hash (if one was created).
- List of files changed with one-line descriptions. Display file paths and `file:line` references in whatever form is clickable where you are presenting them (e.g. code citation in chat, CWD-relative path with no leading `/` in terminal). If unsure, use CWD-relative path. This differs from spec-file links which use spec-file-relative paths.
- Review findings breakdown: patches applied, items deferred, and the rejected count — reasons are recorded in the spec. If every finding was rejected, say so.

Offer to push and/or create a pull request.

HALT and wait for human input.

Workflow complete.

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{workflow.on_complete}
