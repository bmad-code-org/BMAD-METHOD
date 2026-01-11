---
name: 'step-01b-resume'
description: 'Resume pipeline from checkpoint after failure or interruption'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-01b-resume.md'
stepsPath: '{workflow_path}/steps'

# State Management
stateFile: '{sprint_artifacts}/pipeline-state-{story_id}.yaml'
---

# Step 1b: Resume from Checkpoint

## STEP GOAL

Resume a previously started pipeline from the last completed checkpoint:
1. Load existing pipeline state
2. Restore cached document context
3. Determine next step to execute
4. Present resume options to user

## MANDATORY EXECUTION RULES

### Universal Rules

- **NEVER** restart from step 1 if progress exists
- **ALWAYS** restore cached context before resuming
- **PRESERVE** all completed step data
- **VALIDATE** state file integrity before resuming

### Resume Priority

- Resume from `lastStep + 1` by default
- Allow user to override and restart from earlier step
- Warn if restarting would lose completed work

## EXECUTION SEQUENCE

### 1. Load Pipeline State

Read state file: `{stateFile}`

Extract:
- `story_id`, `epic_num`, `story_num`, `mode`
- `stepsCompleted`: Array of completed step numbers
- `lastStep`: Last successfully completed step
- `cached_context`: Document loading status
- `steps`: Individual step status records

### 2. Validate State Integrity

Check state file is valid:
- [ ] `story_id` matches requested story
- [ ] `stepsCompleted` is valid array
- [ ] `lastStep` corresponds to actual completed work
- [ ] No corruption in step records

**If invalid:**
- Warn user: "State file appears corrupted"
- Offer: "Start fresh or attempt recovery?"

### 3. Restore Cached Context

Re-load documents if not in memory:

```yaml
cached_context:
  project_context_loaded: {reload if false}
  epic_loaded: {reload if false}
  architecture_sections: {reload specified sections}
  story_file_exists: {verify still exists}
  story_file_path: {verify path valid}
```

**Efficiency note:** Only reload what's needed, don't duplicate work.

### 4. Present Resume Summary

Display current state:

```
Pipeline Resume for Story {story_id}

Previous Session:
- Started: {started_at}
- Last Update: {updated_at}
- Mode: {mode}

Progress:
- Steps Completed: {stepsCompleted}
- Last Step: {lastStep} ({step_name})
- Next Step: {lastStep + 1} ({next_step_name})

Step Status:
  [✓] Step 1: Initialize
  [✓] Step 2: Create Story
  [✓] Step 3: Validate Story
  [ ] Step 4: ATDD (NEXT)
  [ ] Step 5: Implement
  [ ] Step 6: Code Review
  [ ] Step 7: Complete
  [ ] Step 8: Summary
```

### 5. Present Resume Options

**Menu:**
```
Resume Options:

[C] Continue from Step {lastStep + 1} ({next_step_name})
[R] Restart from specific step (will mark later steps as pending)
[F] Fresh start (lose all progress)
[H] Halt

Select option:
```

### 6. Handle User Selection

**C (Continue):**
- Update state: `currentStep: {lastStep + 1}`
- Load and execute next step file

**R (Restart from step):**
- Ask: "Which step? (2-8)"
- Validate step number
- Mark selected step and all later as `pending`
- Update `lastStep` to step before selected
- Load and execute selected step

**F (Fresh start):**
- Confirm: "This will lose all progress. Are you sure? (y/n)"
- If confirmed: Delete state file, redirect to step-01-init.md
- If not: Return to menu

**H (Halt):**
- Save current state
- Exit gracefully

### 7. Determine Next Step File

Map step number to file:

| Step | File |
|------|------|
| 2 | step-02-create-story.md |
| 3 | step-03-validate-story.md |
| 4 | step-04-atdd.md |
| 5 | step-05-implement.md |
| 6 | step-06-code-review.md |
| 7 | step-07-complete.md |
| 8 | step-08-summary.md |

### 8. Update State and Execute

Before loading next step:
- Update `updated_at` to current timestamp
- Set `currentStep` to target step
- Set target step status to `in_progress`

Then load and execute: `{stepsPath}/step-{XX}-{name}.md`

## BATCH MODE HANDLING

If `mode == "batch"`:
- Skip menu presentation
- Auto-continue from `lastStep + 1`
- If `lastStep` was a failure, check error details
- If retryable error, attempt same step again
- If non-retryable, halt with error report

## ERROR RECOVERY

### Common Resume Scenarios

**Story file missing after step 2:**
- Warn user
- Offer to restart from step 2

**Tests missing after step 4:**
- Warn user
- Offer to restart from step 4

**Implementation incomplete after step 5:**
- Check git status for partial changes
- Offer to continue or rollback

**Code review incomplete after step 6:**
- Check if issues were logged
- Offer to continue review or re-run

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- State file loaded and validated
- Context restored efficiently
- User presented clear resume options
- Correct step file loaded and executed
- No data loss during resume

### ❌ FAILURE
- Starting from step 1 when progress exists
- Not validating state file integrity
- Loading wrong step after resume
- Losing completed work without confirmation
- Not restoring cached context
