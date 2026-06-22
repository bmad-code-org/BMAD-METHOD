---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 2: Plan

## Instructions

1. Investigate the codebase and relevant context files.
2. Read `./spec-template.md` fully.
3. Write `{spec_file}` from the template.
4. Self-review the spec:
   - one goal
   - actionable tasks
   - testable acceptance criteria
   - no placeholders
5. If intent is still unclear, write a `CRITICAL` escalation (`type: intent-gap`) and end the run.
6. If the scope is truly multi-goal or the spec exceeds 4000 tokens:
   - keep the main goal in `{spec_file}`
   - append each deferred secondary goal to `{deferred_work_file}` using `./deferred-work-format.md`
   - rewrite the spec to match the narrowed scope
7. Re-read `{spec_file}` from disk.
8. If it is missing or empty, write a `CRITICAL` escalation (`type: spec-write-failure`) and end the run.
9. Set the spec frontmatter `status:` to `ready-for-dev`.

## Next

Read fully and follow `./step-03-implement.md`.
