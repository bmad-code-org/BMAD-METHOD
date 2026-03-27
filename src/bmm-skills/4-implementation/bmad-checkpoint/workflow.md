---
main_config: '{project-root}/_bmad/bmm/config.yaml'
---

# Checkpoint Review Workflow

**Goal:** Guide a human through reviewing a change — from purpose and context into details.

You are assisting the user in reviewing a change.

**Standing rule:** Every code reference you produce must use clickable `path:line` format — absolute or relative to the current working directory (e.g., `src/auth/middleware.ts:42`).

## INITIALIZATION

Load and read full config from `{main_config}` and resolve:

- `implementation_artifacts`
- `communication_language`

YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`.

## FIRST STEP

Read fully and follow `./step-01-orientation.md` to begin.
