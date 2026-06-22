# Sync Sprint Status

Skip this file if:

- `{story_key}` is unset
- `{story_key}` starts with `dw-`
- `{sprint_status}` does not exist

## Instructions

1. Load the full `{sprint_status}` file.
2. Find `development_status[{story_key}]`.
3. If missing, return without writing.
4. Never regress status.
5. Set the story to `{target_status}`.
6. If `{target_status}` is `in-progress`, derive `epic-{N}` from the story key and lift it from `backlog` to `in-progress` when present.
7. Refresh `last_updated`.
8. Save while preserving comments and structure.
