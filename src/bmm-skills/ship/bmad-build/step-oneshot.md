# Step One-Shot: Implement, Review, Present

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- NEVER auto-push.
- All review subagents must run at the same model capability as the current session.
- Run subagents synchronously: launch them together as blocking calls awaited in this turn — never backgrounded or detached, never ending the turn to await results.

## INSTRUCTIONS

### Implement

Follow `[[bmad-snapshot:sync-sprint-status.md]]` with `target_status` = `in-progress`.

Implement the clarified intent directly.

### Review

Announce skipped layers first, then launch every active layer before handling any layer's result. Try running all active layers simultaneously. After substituting runtime placeholders, when an instruction launches a reviewer subagent, launch that child with the prompt text; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written:

{workflow.oneshot_review_layers}

If a layer's instruction requires subagents and none are available, for each such layer write under `{{.implementation_artifacts}}` the exact child prompt from that layer's instruction after placeholder substitution (not a path-only pointer), then HALT. Ask the human to run each in a separate session and paste back the findings.

### Classify

Once every layer has reported — and not before — render a verdict on each finding on its own, ahead of any deduplication or grouping:

- **Verify its own claimed consequence** at the location it names. Read past the changed lines — into the callers, the guards upstream, whatever else the site depends on — far enough to tell whether that consequence actually occurs. Another finding's outcome, however adjacent, never settles this one.
- **Assign severity** from the verified consequence for the software's user: `low` (none or cosmetic), `medium` (tolerable), `high` (intolerable).
- **Keep or dismiss.** Keep a finding only where verification confirmed its consequence. Dismiss noise, claims the verification refuted, and claims it could not substantiate — no path to the claimed consequence at the named site is a valid disposal. Whatever the reason, it must dispose of the finding's own claim: a true fact about neighboring code that leaves the claim standing is not a dismissal, and the finding stays kept. Record each dismissal with its reason; never drop a finding silently.
- A finding whose fix edits an agent-context document (e.g. CLAUDE.md, AGENTS.md, rules files, specs): defer, never patch.

Group the survivors by shared root cause — two findings belong in one entry only when the same underlying defect produced both. Same location alone is not a shared root cause, and neither is a shared fix. An entry carries every member's verified consequence and the highest severity among them. Then route each entry in this order:

- **patch** — Patch every entry caused or exposed by this change that shows a defect that actually occurs, missing coverage for a specific case, or a broken gate or convention — not a state nothing reaches — and whose smallest fix is trivial, adds no public surface, and guards no state the finding did not demonstrate. Apply that smallest fix immediately.
- **HALT** — HALT on every entry caused or exposed by this change that shows the same evidence but whose smallest fix fails any of those conditions. Present it to the human for decision before proceeding.
- **defer** — Defer every other entry, including pre-existing issues and improvement ideas. Append one new entry to `{{.implementation_artifacts}}/deferred-work.md` using this format. Do not modify existing entries or look for duplicates.
  ```markdown
  - source_spec: `{spec_file}`
    summary: <one sentence>
    evidence: <why this is real>
  ```

### Generate Spec Trace

Set `title` = a concise title derived from the clarified intent.

Write `{spec_file}` using `[[bmad-snapshot:spec-template.md]]`. Fill only these sections — delete all others:

1. **Frontmatter** — set `title: '{title}'`, `type`, `created`, `status: 'done'`. Add `route: 'one-shot'`.
2. **Title and Intent** — `# {title}` heading and `## Intent` with **Problem** and **Approach** lines. Reuse the summary you already generated for the terminal.
3. **Suggested Review Order** — append after Intent. Build using the same convention as `[[bmad-snapshot:step-05-present.md]]` § "Generate Suggested Review Order" (spec-file-relative links, concern-based ordering, ultra-concise framing).
4. **Review Triage Log** — only when findings were dismissed: one line per dismissal, the finding and the reason that disposed of its claim.

Follow `[[bmad-snapshot:sync-sprint-status.md]]` with `target_status` = `review`.

### Commit

If version control is available and the tree is dirty, create a local commit with a conventional message derived from the intent. If VCS is unavailable, skip.

### Present

{workflow.open_spec}

Display a summary in conversation output, including:

- The commit hash (if one was created).
- List of files changed with one-line descriptions. Any file paths shown in conversation/terminal output must use CWD-relative format (no leading `/`) with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability — this differs from spec-file links which use spec-file-relative paths.
- Review findings breakdown: patches applied, items deferred, and the dismissed count — dismissal reasons are recorded in the spec trace. If every finding was dismissed, say so.

Offer to push and/or create a pull request.

HALT and wait for human input.

Workflow complete.

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{workflow.on_complete}
