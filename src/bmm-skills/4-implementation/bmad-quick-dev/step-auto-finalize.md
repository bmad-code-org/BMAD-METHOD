---
---

# Step Auto-Finalize (automation mode only)

Terminal step when `{auto_mode}` is set. The orchestrator creates the commit
itself.

- **Default** (`$BMAD_AUTO_SKIP_REVIEW` unset): replaces step-04-review and
  step-05-present — the orchestrator runs code review in a separate
  fresh-context session, so this step finalizes the spec at `in-review`.
- **Skip-review** (`$BMAD_AUTO_SKIP_REVIEW` = `1`): the orchestrator runs **no**
  separate review session. You have already run step-04-review's internal
  triple-review, so this step finalizes the spec straight to `done`.

## RULES

- No commit. No push. No editor.
- Default mode: no review subagents (review is the orchestrator's job). In
  skip-review mode the triple-review already ran in step-04-review — do not
  re-run it here.
- Do not generate a Suggested Review Order.

## INSTRUCTIONS

1. Verify every task in the `## Tasks & Acceptance` section of `{spec_file}` is
   marked `[x]`. If any are not done, go back and finish them first — an
   incomplete task list fails the orchestrator's verification and burns a retry.
2. **Run the spec's `## Verification` commands.** Execute every command listed
   there (skip this instruction only if the spec has no Verification section).
   A checked-off task list is a claim; passing commands are evidence — the
   orchestrator runs its own deterministic gates next, so a failure you skip
   here just burns a retry. If a command fails: fix the code and re-run until
   it passes. If you cannot make it pass without violating the frozen intent,
   escalate `CRITICAL` (`type: verification-failure`) instead of finalizing.
3. Change `{spec_file}` status in the frontmatter. If `$BMAD_AUTO_SKIP_REVIEW`
   is set, use `done` (no review session follows); otherwise use `in-review`.
4. Follow `./sync-sprint-status.md` with `{target_status}` = `done` when
   `$BMAD_AUTO_SKIP_REVIEW` is set, else `review`.
   **Bundle mode** (`{story_key}` starts with `dw-`): bundles have no
   sprint-status entry — skip the sync. Instead, update the deferred-work
   file: for EACH dw id listed in the bundle file, set its entry's `status:`
   to `done <today's date>` and add `resolution: <one line: what was built>`
   directly after it (see `./deferred-work-format.md`). The orchestrator
   verifies these on disk after review — an unmarked entry fails the gate
   and burns a repair session.
5. Write `$BMAD_AUTO_RUN_DIR/tasks/$BMAD_AUTO_TASK_ID/result.json`:

   ```json
   {
     "workflow": "quick-dev",
     "story_key": "<{story_key}, or null if unset>",
     "spec_file": "<absolute path to {spec_file}>",
     "baseline_commit": "<baseline_commit from {spec_file} frontmatter>",
     "tasks_total": <count of tasks in the spec>,
     "tasks_done": <count of tasks marked [x]>,
     "verification": [<one {"command": "<cmd>", "ok": <bool>} per Verification
                       command run in instruction 2, else empty>],
     "escalations": [<contents of any escalations raised this run, else empty>]
   }
   ```

   **Bundle mode**: additionally include `"dw_ids": [<the bundle file's dw
ids, verbatim>]` — the orchestrator rejects the result when the list does
   not match the bundle.

6. State in one line what was implemented and end your turn. Do not ask
   questions, offer next steps, or wait for anything.

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.
