---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step One-Shot: Implement, Review, Present

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- NEVER auto-push.

## INSTRUCTIONS

### Implement

Implement the clarified intent directly.

### Review

Invoke the `bmad-review-adversarial-general` skill in a subagent with the changed files. The subagent gets NO conversation context — to avoid anchoring bias. If no sub-agents are available, write the changed files to a review prompt file in `{implementation_artifacts}` and HALT. Ask the human to run the review in a separate session and paste back the findings.

### Classify

Deduplicate all review findings. Three categories only:

- **patch** — trivially fixable. Auto-fix immediately.
- **defer** — pre-existing issue not caused by this change. Append to `{deferred_work_file}`.
- **reject** — noise. Drop silently.

If a finding is caused by this change but too significant for a trivial patch, HALT and present it to the human for decision before proceeding.

### Commit

If version control is available and the tree is dirty, create a local commit with a conventional message derived from the intent. If VCS is unavailable, skip.

### Present

1. Open all changed files in the user's editor so they can review the code directly:
   - Run `code -r "{project-root}" <changed-file-paths>` — the project root as the first argument, then each changed file path. Always double-quote paths with spaces.
   - If `code` is not available (command fails), skip gracefully and list the file paths instead.
2. Display a summary in conversation output, including:
   - The commit hash (if one was created).
   - List of files changed with one-line descriptions.
   - Review findings breakdown: patches applied, items deferred, items rejected. If all findings were rejected, say so.
3. Offer to push and/or create a pull request.

HALT and wait for human input.

Workflow complete.
