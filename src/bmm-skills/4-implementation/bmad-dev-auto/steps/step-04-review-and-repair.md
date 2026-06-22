---
max_review_iterations: 5
---

# Step 4: Review and Repair

## Rules

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`.
- Review subagents receive no conversation context.
- Review subagents provide signals only. This session owns triage and repair decisions.
- Do not ask the user to run review prompts manually.
- Do not leave known patch findings unresolved when the fix is unambiguous.

## Instructions

1. Enter review state.
   - Set `{spec_file}` frontmatter `status` to `in-review`.
   - Increment `review_iterations` in `{spec_file}` frontmatter.

2. Construct the review payload.
   - Read `baseline_commit` from `{spec_file}` frontmatter.
   - Build a diff covering tracked and untracked changes since `baseline_commit`.
   - If `baseline_commit` is missing or `NO_VCS`, construct a best-effort file-change summary from the working tree.
   - Do not stage files.

3. Run review layers.
   - **Spec compliance:** Compare the diff to `{spec_file}`, including acceptance criteria, boundaries, context docs, and verification expectations.
   - **Edge-case review:** Walk boundary conditions, failure paths, compatibility risks, and state transitions introduced by the diff.
   - **Regression review:** Look for unintended behavior changes outside the spec, deleted behavior, security issues, data loss, and integration breakage.
   - Use subagents for independent review signals when available, but perform an inline review yourself even if subagents run.

4. Classify findings.
   - `patch` -- caused by this change and unambiguously fixable in code.
   - `bad_spec` -- caused by this change, but the non-frozen spec failed to direct the implementation clearly enough.
   - `intent_gap` -- caused by missing or conflicting orchestrator-owned intent inside `<frozen-after-resolution>`.
   - `defer` -- real pre-existing issue not caused by this task.
   - `reject` -- false positive, already handled, or outside scope without actionable evidence.

5. Process findings in order.
   - If any `intent_gap` finding exists, revert product-code changes from this run when safe, preserve run artifacts, write `{result_file}` using the result schema from `../result-schema.md` with `status` = `blocked`, `blocked_reason` = `intent_gap`, and the exact orchestrator decision required. End cleanly.
   - If any `bad_spec` finding exists, amend only the non-frozen spec sections, append a `Spec Change Log` entry with KEEP instructions, revert or repair code as needed, then read fully and follow `./step-03-implement.md`.
   - If any `patch` finding exists, apply all unambiguous fixes, rerun relevant verification, then repeat this step from section 1.
   - If any `defer` finding exists, append it to `{deferred_work_file}` with source task, evidence, and reason for deferral.
   - Drop `reject` findings.

6. Iteration guard.
   - If the `review_iterations` value in `{spec_file}` frontmatter exceeds `{max_review_iterations}`, write `{result_file}` using the result schema from `../result-schema.md` with `status` = `blocked`, `blocked_reason` = `review_loop_limit`, and the unresolved findings. End cleanly.

7. Write review artifact.
   - Write `{review_file}` with review payload summary, findings by classification, actions taken, verification reruns, deferred items, and final open risks.

## Next

Read fully and follow `./step-05-finalize.md`.
