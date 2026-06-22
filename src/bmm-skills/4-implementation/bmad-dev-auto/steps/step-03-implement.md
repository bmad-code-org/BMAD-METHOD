---
baseline_commit: ''
---

# Step 3: Implement

## Rules

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`.
- No push. No remote operations.
- Do not commit.
- Do not modify the `<frozen-after-resolution>` block.
- Do not hand implementation ownership to a subagent.

## Instructions

1. Establish baseline.
   - If version control is available, capture current HEAD as `{baseline_commit}`.
   - If version control is unavailable, set `{baseline_commit}` to `NO_VCS`.
   - Write `{baseline_commit}` to `{spec_file}` frontmatter unless a resume spec already has a non-empty `baseline_commit`.

2. Enter implementation state.
   - Set `{spec_file}` frontmatter `status` to `in-progress`.
   - Load any files listed in the `context` frontmatter.

3. Implement directly.
   - Follow the tasks and acceptance criteria in `{spec_file}`.
   - Preserve existing project architecture, naming, formatting, and test patterns.
   - If the implementation reveals a spec problem outside the frozen block, amend the spec before continuing and append a `## Spec Change Log` entry.
   - If the implementation reveals a missing orchestrator decision inside the frozen block, stop product-code work, revert product-code changes from this run when safe, write `{result_file}` using the result schema from `../result-schema.md` with `status` = `blocked`, `blocked_reason` = `intent_gap`, and the exact missing decision. End cleanly.

4. Self-check.
   - Verify every task in `## Tasks & Acceptance` is complete.
   - Mark completed task checkboxes `[x]`.
   - Run applicable verification commands from the spec and from project conventions.
   - If verification fails because of the current change, repair and rerun.
   - If verification cannot run because of environment limitations, record the limitation for `{result_file}` but continue only if code inspection can still establish task correctness.

## Next

Read fully and follow `./step-04-review-and-repair.md`.
