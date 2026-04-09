---
---

# Step 3: Implement

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No push. No remote ops.
- Sequential execution only.
- Content inside `<frozen-after-approval>` in `{spec_file}` is read-only. Do not modify.

## PRECONDITION

Verify `{spec_file}` resolves to a non-empty path and the file exists on disk. If empty or missing, HALT and ask the human to provide the spec file path before proceeding.

## INSTRUCTIONS

### Baseline

Capture `baseline_commit` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before making any changes.

### Implement

Change `{spec_file}` status to `in-progress` in the frontmatter before starting implementation.

#### Sync sprint status

Skip this subsection if `{story_key}` is unset (the intent is not an epic story, or `step-01` could not resolve a sprint-status entry) or if `{sprint_status}` does not exist on disk.

Otherwise:

1. Load the FULL `{sprint_status}` file.
2. Find the `development_status` entry matching `{story_key}`. If not found, warn the user once (`"{story_key} not found in sprint-status; skipping sprint sync"`) and skip the remaining sub-steps.
3. Derive the parent epic key as `epic-{N}` where `{N}` is the leading numeric segment of `{story_key}` (e.g., `3-2-digest-delivery` → `epic-3`).
4. **Idempotency check.** If `development_status[{story_key}]` is already `in-progress` AND the parent epic entry is already `in-progress` or `done` (or missing), skip the remaining sub-steps — no write needed. This prevents step-04 loopbacks from clobbering human edits and from bumping `last_updated` without cause.
5. Set `development_status[{story_key}]` to `in-progress`.
6. If the parent epic entry exists and its current value is `backlog`, set it to `in-progress`. Leave it alone otherwise.
7. Refresh `last_updated` to the current date.
8. Save the file, preserving ALL comments and structure including STATUS DEFINITIONS and WORKFLOW NOTES.

If `{spec_file}` has a non-empty `context:` list in its frontmatter, load those files before implementation begins. When handing to a sub-agent, include them in the sub-agent prompt so it has access to the referenced context.

Hand `{spec_file}` to a sub-agent/task and let it implement. If no sub-agents are available, implement directly.

**Path formatting rule:** Any markdown links written into `{spec_file}` must use paths relative to `{spec_file}`'s directory so they are clickable in VS Code. Any file paths displayed in terminal/conversation output must use CWD-relative format with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability. No leading `/` in either case.

### Self-Check

Before leaving this step, verify every task in the `## Tasks & Acceptance` section of `{spec_file}` is complete. Mark each finished task `[x]`. If any task is not done, finish it before proceeding.

## NEXT

Read fully and follow `./step-04-review.md`
