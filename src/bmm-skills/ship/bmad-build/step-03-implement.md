---
---

# Step 3: Implement

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- No push. No remote ops.
- Sequential execution only.
- In manifest-story mode, content inside `<intent-contract>` in `{spec_file}` is read-only. In standalone mode, content inside `<frozen-after-approval>` is read-only. Do not modify the selected intent boundary.

## PRECONDITION

Verify `{spec_file}` resolves to a non-empty path and the file exists on disk. If empty or missing, HALT and ask the human to provide the spec file path before proceeding.

## INSTRUCTIONS

### Baseline

When `manifest_story_mode` is true, capture `baseline_revision` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before making any changes, using Build Auto's field name. Otherwise capture `baseline_commit` the same way; if standalone frontmatter already contains `baseline_commit` (resumed run), preserve the existing value — never overwrite it. Never add `baseline_commit` to a manifest story or `baseline_revision` to a standalone spec.

### Implement

Change `{spec_file}` status to `in-progress` in the frontmatter before starting implementation.

Follow `./sync-sprint-status.md` with `target_status` = `in-progress`.

Execute the implementation handoff below: substitute the runtime placeholders (e.g. `{spec_file}`) into it, then follow it verbatim.

{workflow.implementation_handoff}

Do not add goal restatements, file lists, ownership boundaries, investigation detail, acceptance criteria, or CLAUDE.md/house-style rules to the dispatch — the spec is the subagent's sole source of truth, and that material already lives in it (investigation findings in its Code Map, the rest in the spec body). One line of sanctioned hedging belongs in the spec at planning time, not in the dispatch. If no subagents are available, implement directly from the spec. If the platform allows, keep the subagent available for re-engagement after it returns — step-04 may send it review fixes.

The handoff directs the subagent to load the spec's `context:` files itself, so never pre-load and paste those files into the dispatch. Only when you implement directly (no subagent available) do you load a non-empty `context:` list yourself before starting.

**Path formatting rule:** Any markdown links written into `{spec_file}` must use paths relative to `{spec_file}`'s directory so they are clickable in VS Code. Any file paths displayed in terminal/conversation output must use CWD-relative format with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability. No leading `/` in either case.

### Tasks & Acceptance Verification

Before leaving this step, verify every task in the `## Tasks & Acceptance` section of `{spec_file}` is complete and every acceptance criterion is satisfied. Mark each finished task `[x]`. If any task is not done or any acceptance criterion is not satisfied, finish the missing work before proceeding.

### Matrix Test Audit

Select the immutable intent boundary by route: `<intent-contract>` when `manifest_story_mode` is true, or `<frozen-after-approval>` in standalone mode. If that selected block contains an I/O & Edge-Case Matrix, verify every matrix row is covered by at least one test that verifies its expected behavior, and that each covering test ran and passed in the verification output. A covering test that exists but did not run — unregistered, filtered out, skipped, or disabled — counts as missing. If a test disagrees with the matrix, never edit the expectation to match the code: fix the code, or if the matrix row itself is ambiguous, HALT and ask the human. Fix any other audit failure before proceeding.

## NEXT

Read fully and follow `./step-04-review.md`
