---
---

# Step 1: Resolve Task

## Instructions

1. Parse the invocation into one of:
   - story mode
   - story + feedback mode
   - bundle mode
   - bundle + feedback mode
2. Set:
   - `{result_file}` = `$BMAD_AUTO_RUN_DIR/tasks/$BMAD_AUTO_TASK_ID/result.json`
   - `{escalation_file}` = `$BMAD_AUTO_RUN_DIR/tasks/$BMAD_AUTO_TASK_ID/escalation.json`
3. If required environment variables are missing, write a `CRITICAL` escalation (`type: missing-env`) and end the run.
4. If in bundle mode:
   - read the bundle file first
   - set `{bundle_name}`
   - set `{dw_ids}` from the bundle file
   - set `{story_key}` = `dw-{bundle_name}`
   - set `{spec_file}` = `{implementation_artifacts}/spec-dw-{bundle_name}.md`
5. Otherwise:
   - set `{story_key}` from the invocation
   - derive `{epic_num}` and `{story_num}` from its leading numeric segments
   - set `{spec_file}` = `{implementation_artifacts}/spec-{story_key}.md`
6. If a feedback file was passed, read it before deciding the route.
7. Route:
   - if feedback mode and `{spec_file}` exists: go to step 3
   - else if `{spec_file}` exists with `status: draft`: go to step 2
   - else if `{spec_file}` exists with `status: ready-for-dev|in-progress|in-review|done`: go to step 3
   - else: go to step 2

## Next

- Step 2: `./step-02-plan.md`
- Step 3: `./step-03-implement.md`
