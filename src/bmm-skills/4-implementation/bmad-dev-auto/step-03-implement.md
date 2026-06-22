---
---

# Step 3: Implement

## Instructions

1. Verify `{spec_file}` exists and is non-empty. If not, write a `CRITICAL` escalation (`type: missing-spec`) and end the run.
2. Capture `baseline_commit` into the spec frontmatter:
   - full `git rev-parse HEAD`
   - or `NO_VCS` if git is unavailable
3. If this is not repair mode against an already-`done` spec, set the spec `status:` to `in-progress`.
4. If this is not bundle mode, follow `./sync-sprint-status.md` with `{target_status}` = `in-progress`.
5. Load any spec `context:` files.
6. Implement the spec directly or via sub-agents.
7. Mark every completed task in `## Tasks & Acceptance` as `[x]`.
8. If any listed task remains incomplete, finish it before continuing.

## Next

Read fully and follow `./step-04-finalize.md`.
