---
review_target: ''
story_file: ''
diff_output: ''
review_mode: ''
automation_result_file: '{implementation_artifacts}/code-review-auto-result.json'
---

# Step 1: Collect Inputs

## Rules

- Speak in `{communication_language}`.
- Treat the invocation prompt and loaded context as automation input.
- Do not present interactive choices.
- Do not ask follow-up questions.
- Do not write prompt files for a human to run.
- A missing or invalid required input must become a structured failure result.

## Instructions

1. Resolve the review target from the invocation prompt, environment, or loaded workflow context.
2. Resolve story context when a story file path or story reference is supplied.
3. Detect every supplied diff source from this list:
   - An explicit diff supplied in the invocation context.
   - An explicit commit range supplied in the invocation context.
   - An explicit file list supplied in the invocation context.
   - Uncommitted working tree changes, including staged, unstaged, and untracked existing files, when the invocation explicitly requests them.
4. If zero diff sources are supplied, write a structured failure result with `failure_type: "missing_diff_input"`.
5. If more than one diff source is supplied, write a structured failure result with `failure_type: "ambiguous_review_input"` and include the detected source names.
6. Resolve a unified diff from the single supplied source.
7. When the source is uncommitted working tree changes, include staged changes, unstaged changes, untracked existing files, and tracked file deletions.
8. When the source is an explicit file list, resolve every listed path against `{project-root}` before reading or diffing it.
9. Reject absolute paths outside `{project-root}` and paths that resolve outside `{project-root}` after parent-directory traversal is normalized.
10. When the source is an explicit file list, include staged changes, unstaged changes, untracked existing files, and tracked file deletions for the listed paths.
11. For each untracked file included in review evidence, synthesize a `/dev/null` unified diff from the file's full contents so new files cannot be omitted from review evidence.
12. For each listed path that is absent from the working tree but tracked by the review baseline or index, include the deletion diff instead of treating it as missing.
13. Treat listed files that are neither readable in the working tree nor tracked by the review baseline or index as invalid input.
14. Treat an explicit file list that produces no diff as invalid input.
15. Validate that the diff is non-empty and parseable as review evidence.
16. Set `review_mode` to `full` when story or spec context is available.
17. Set `review_mode` to `no-spec` when no story or spec context is available.
18. If any required input is absent or invalid, write a structured failure result to `{automation_result_file}` with:
   - `workflow: "bmad-code-review-auto"`
   - `status: "ERROR"`
   - `failure_type`
   - `message`
   - `story_file` when known
   - `review_target` when known
19. Stop after writing the structured failure result when validation fails.

## Output For Next Step

Carry forward `review_target`, `story_file`, `diff_output`, and `review_mode`.

## Next

Read fully and follow `./step-02-run-review.md`.
