---
blocked_reason: ''
---

# Step 2: Plan or Resume

## Rules

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`.
- Do not ask for approval.
- Do not create conversational checkpoints.
- The `<frozen-after-resolution>` block is the orchestrator-owned intent boundary once written.
- Review-driven spec repair may change only sections outside `<frozen-after-resolution>`.

## Instructions

1. Resume path.
   - If `{mode}` = `resume`, read `{spec_file}` completely.
   - Validate that it has frontmatter, a recognized `status`, and a `<frozen-after-resolution>` block.
   - If the spec is malformed, write `{result_file}` using the result schema from `../result-schema.md` with `status` = `blocked`, `blocked_reason` = `invalid_resume_spec`, and the validation failures. End cleanly.
   - Load any files listed in the `context` frontmatter.
   - If the spec is valid, keep it as the controlling plan and continue to Step 3.

2. Planning path.
   - Investigate the codebase enough to identify affected files, existing patterns, verification commands, and risk boundaries.
   - Use subagents only for bounded research summaries if available. Do not delegate ownership of the plan.
   - Read `../spec-template.md` fully.
   - Fill the template from the invocation, loaded references, persistent facts, and investigation.
   - Remove placeholder text and any sections that do not apply.
   - Write the completed spec to `{spec_file}`.

3. Precision gate.
   - Verify the spec has one cohesive task, explicit boundaries, concrete code map entries, actionable tasks, and testable acceptance criteria.
   - If independent shippable goals are present, narrow to the primary goal only when a primary goal is unambiguous. Append secondary goals to `{deferred_work_file}` with a heading `## Deferred from bmad-dev-auto {task_id} ({date})`.
   - If the primary goal is ambiguous or any acceptance-critical intent gap remains, write `{result_file}` using the result schema from `../result-schema.md` with `status` = `blocked`, `blocked_reason` = `ambiguous_intent`, and the unresolved questions as machine-readable items. End cleanly.

4. Ready state.
   - Set `{spec_file}` frontmatter `status` to `ready-for-dev`.
   - Preserve the `<frozen-after-resolution>` block exactly after this point unless a new orchestrator invocation changes it in a later run.

## Next

Read fully and follow `./step-03-implement.md`.
