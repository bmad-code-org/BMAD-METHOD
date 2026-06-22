# Sync Sprint Status

Updates `sprint-status.yaml` for the current `{story_key}` using `{target_status}`.

## Preconditions

Stop executing this file if ANY of:
- `{story_key}` is unset
- `{sprint_status}` does not exist on disk

## Instructions

1. Load the FULL `{sprint_status}` file.
2. Find the `development_status` entry matching `{story_key}`. If not found, add `sprint-sync-skipped` to `{spec_file}` frontmatter `warnings` and stop executing this file.
3. **Idempotency check.** If `development_status[{story_key}]` is already at `{target_status}` or a later state (`review` is later than `in-progress`; `done` is later than both), stop executing this file — no write needed. Never regress a story's status.
4. Set `development_status[{story_key}]` to `{target_status}`.
5. **Epic lift (only when `{target_status}` = `in-progress`).** Derive the parent epic key as `epic-{N}` from the leading numeric segment of `{story_key}` (e.g., `3-2-digest-delivery` → `epic-3`). If that entry exists and is `backlog`, set it to `in-progress`. Leave it alone otherwise. Skip this sub-step entirely when `{target_status}` is not `in-progress`.
6. Refresh `last_updated` to the current date.
7. Save the file, preserving ALL comments and structure including STATUS DEFINITIONS and WORKFLOW NOTES.
