---
---

# Step 3: Implement

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No human interaction: do not ask questions or wait for approval in this step.
- Content inside `<intent-contract>` in `{spec_file}` is read-only. Do not modify.

## PRECONDITION

Verify `{spec_file}` resolves to a non-empty path and the file exists on disk. If empty or missing, HALT with status `blocked` and blocking condition `missing spec_file before implementation`.

## INSTRUCTIONS

### Baseline

Capture `baseline_revision` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before making any changes.

### Implement

Change `{spec_file}` status to `in-progress` in the frontmatter before starting implementation.

If `{spec_file}` has a non-empty `context:` list in its frontmatter, load those files before implementation begins. When handing to a subagent, include them in the subagent prompt so it has access to the referenced context.

Hand `{spec_file}` to an implementation subagent. Invoke it **synchronously** and wait for it to return in this same turn — do not background/detach it (`run_in_background`) or end your turn to await a notification (see SKILL.md → Subagents). Resume at "Tasks & Acceptance Verification" only after it returns.

**Path formatting rule:** Any markdown links written into `{spec_file}` must use paths relative to `{spec_file}`'s directory so they are clickable in VS Code. Any file paths displayed in terminal/conversation output must use CWD-relative format with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability. No leading `/` in either case.

### Tasks & Acceptance Verification

After the implementation subagent returns, verify every task in the `## Tasks & Acceptance` section of `{spec_file}` is complete and every acceptance criterion is satisfied. Mark each finished task `[x]`. If any task is not done or any acceptance criterion is not satisfied, finish the missing work before proceeding. If the missing work cannot be completed, HALT with status `blocked`, blocking condition `implementation verification failed`, and include the unfinished task or failing acceptance criterion and reason.

### Matrix Test Audit

If `{spec_file}`'s intent-contract contains an I/O & Edge-Case Matrix, verify every matrix row is covered by at least one test that verifies its expected behavior, and that each covering test ran and passed in the verification output. A covering test that exists but did not run — unregistered, filtered out, skipped, or disabled — counts as missing. If a test disagrees with the matrix, never edit the expectation to match the code: fix the code, or if the matrix row itself is ambiguous, HALT with status `blocked` and blocking condition `matrix ambiguity`. If the audit cannot otherwise be satisfied, HALT with status `blocked` and blocking condition `matrix test audit failed`.

## NEXT

Read fully and follow `./step-04-review.md`
