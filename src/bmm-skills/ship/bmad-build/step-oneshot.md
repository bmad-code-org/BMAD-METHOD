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

Execute these review layers in parallel wherever their execution methods allow. After substituting runtime placeholders, when an instruction launches a reviewer subagent, launch that child with the prompt text; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written:

{workflow.oneshot_review_layers}

If a layer's instruction requires subagents and none are available, for each such layer write under `{{.implementation_artifacts}}` the exact child prompt from that layer's instruction after placeholder substitution (not a path-only pointer), then HALT. Ask the human to run each in a separate session and paste back the findings.

### Classify

Deduplicate all review findings, then route each finding in this order:

- **patch** — Patch every finding caused or exposed by this change that shows a defect that actually occurs, missing coverage for a specific case, or a broken gate or convention — not a state nothing reaches — and whose smallest fix is trivial, adds no public surface, and guards no state the finding did not demonstrate. Apply that smallest fix immediately.
- **HALT** — HALT on every finding caused or exposed by this change that shows the same evidence but whose smallest fix fails any of those conditions. Present it to the human for decision before proceeding.
- **defer** — Defer every other real finding, including pre-existing issues and improvement ideas. Append one new entry to `{{.implementation_artifacts}}/deferred-work.md` using this format. Do not modify existing entries or look for duplicates.
  ```markdown
  - source_spec: `{spec_file}`
    summary: <one sentence>
    evidence: <why this is real>
  ```
- **reject** — Reject only noise. Drop silently.

### Generate Spec Trace

Set `title` = a concise title derived from the clarified intent.

Write `{spec_file}` using `[[bmad-snapshot:spec-template.md]]`. Fill only these sections — delete all others:

1. **Frontmatter** — set `title: '{title}'`, `type`, `created`, `status: 'done'`. Add `route: 'one-shot'`.
2. **Title and Intent** — `# {title}` heading and `## Intent` with **Problem** and **Approach** lines. Reuse the summary you already generated for the terminal.
3. **Suggested Review Order** — append after Intent. Build using the same convention as `[[bmad-snapshot:step-05-present.md]]` § "Generate Suggested Review Order" (spec-file-relative links, concern-based ordering, ultra-concise framing).

Follow `[[bmad-snapshot:sync-sprint-status.md]]` with `target_status` = `review`.

### Commit

If version control is available and the tree is dirty, create a local commit with a conventional message derived from the intent. If VCS is unavailable, skip.

### Present

{workflow.open_spec}

Display a summary in conversation output, including:

- The commit hash (if one was created).
- List of files changed with one-line descriptions. Any file paths shown in conversation/terminal output must use CWD-relative format (no leading `/`) with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability — this differs from spec-file links which use spec-file-relative paths.
- Review findings breakdown: patches applied, items deferred, items rejected. If all findings were rejected, say so.

Offer to push and/or create a pull request.

HALT and wait for human input.

Workflow complete.

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{workflow.on_complete}
