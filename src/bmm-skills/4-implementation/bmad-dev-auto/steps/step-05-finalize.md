---
---

# Step 5: Finalize

## Rules

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`.
- No push. No remote operations.
- Do not commit.
- Final output is disk artifacts first, chat summary second.

## Instructions

1. Determine final status.
   - `completed` when implementation is done, review has no unresolved `patch`, `bad_spec`, or `intent_gap` findings, and verification is passing or limitations are explicitly recorded.
   - `blocked` when `{result_file}` already exists with a blocked status from an earlier step.
   - `failed` only for unexpected execution errors that prevented artifact completion.

2. Finalize spec.
   - If final status is `completed`, set `{spec_file}` frontmatter `status` to `done`.
   - Ensure completed execution tasks are checked.
   - Ensure `Spec Change Log` entries are append-only.

3. Ensure review artifact exists.
   - If `{review_file}` does not exist, write a minimal review artifact explaining why review could not run or why an earlier blocked result ended the workflow.

4. Write result JSON.
   - Read `../result-schema.md`.
   - Write `{result_file}` as valid JSON matching that schema.

5. Completion behavior.
   - If `{workflow.on_complete}` is non-empty, execute it after writing `{result_file}`.
   - Emit a concise terminal summary naming `{result_file}`, final status, changed files, and verification state.
   - Do not ask for next steps.
