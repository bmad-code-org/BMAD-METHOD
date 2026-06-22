---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 4: Finalize

## Instructions

1. Verify every task in `## Tasks & Acceptance` is checked.
2. Run every command in the spec `## Verification` section.
3. If a command fails and you cannot fix it without violating the frozen intent, write a `CRITICAL` escalation (`type: verification-failure`) and end the run.
4. Set final spec status:
   - `done` when `BMAD_AUTO_SKIP_REVIEW=1`
   - `in-review` otherwise
5. If not bundle mode, follow `./sync-sprint-status.md` with:
   - `{target_status}` = `done` when `BMAD_AUTO_SKIP_REVIEW=1`
   - `{target_status}` = `review` otherwise
6. If bundle mode, update every referenced deferred-work entry:
   - `status: done <date>`
   - `resolution: <one line>`
7. Write `{result_file}` using the schema from `SKILL.md`.
8. End the turn with a one-line outcome.
