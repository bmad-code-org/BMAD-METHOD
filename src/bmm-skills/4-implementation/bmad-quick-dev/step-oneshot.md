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
   - Resolve two sets of absolute paths: (1) the repository root (`git rev-parse --show-toplevel` — returns the worktree root when in a worktree, project root otherwise; if this fails, fall back to the current working directory), (2) each changed file. Run `code -r "{absolute-root}" <absolute-changed-file-paths>` — the root first so VS Code opens in the right context, then each changed file. Always double-quote paths to handle spaces and special characters.
   - If `code` is not available (command fails), skip gracefully and list the file paths instead.
2. Display a summary in conversation output, including:
   - The commit hash (if one was created).
   - List of files changed with one-line descriptions. Use CWD-relative paths with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability. No leading `/`.
   - Review findings breakdown: patches applied, items deferred, items rejected. If all findings were rejected, say so.
3. Offer to push and/or create a pull request.

HALT and wait for human input.

Workflow complete.
