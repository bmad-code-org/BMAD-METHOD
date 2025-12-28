---
name: 'step-07-summary'
description: 'Generate audit trail and pipeline summary'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-07-summary.md'

# Role
role: null
---

# Step 7: Pipeline Summary

## STEP GOAL

Generate comprehensive audit trail and summary:
1. Calculate total duration
2. Summarize work completed
3. Generate audit trail file
4. Display final summary
5. Clean up state file

## EXECUTION SEQUENCE

### 1. Calculate Metrics

From state file, calculate:
- Total duration: `{completed_at} - {started_at}`
- Step durations
- Files modified count
- Issues found and fixed
- Tasks completed

### 2. Generate Audit Trail

Create file: `{sprint_artifacts}/audit-super-dev-{story_id}-{date}.yaml`

```yaml
---
audit_version: "1.0"
workflow: "super-dev-pipeline"
workflow_version: "1.0.0"

# Story identification
story_id: "{story_id}"
story_file: "{story_file}"
story_title: "{story_title}"

# Execution summary
execution:
  started_at: "{started_at}"
  completed_at: "{completed_at}"
  total_duration: "{duration}"
  mode: "{mode}"
  status: "completed"

# Development analysis
development:
  type: "{greenfield|brownfield|hybrid}"
  existing_files_modified: {count}
  new_files_created: {count}
  migrations_applied: {count}

# Step results
steps:
  step-01-init:
    duration: "{duration}"
    status: "completed"

  step-02-pre-gap-analysis:
    duration: "{duration}"
    tasks_analyzed: {count}
    tasks_refined: {count}
    tasks_added: {count}
    status: "completed"

  step-03-implement:
    duration: "{duration}"
    tasks_completed: {count}
    files_created: {list}
    files_modified: {list}
    migrations: {list}
    tests_added: {count}
    status: "completed"

  step-04-post-validation:
    duration: "{duration}"
    tasks_verified: {count}
    false_positives: {count}
    re_implementations: {count}
    status: "completed"

  step-05-code-review:
    duration: "{duration}"
    issues_found: {count}
    issues_fixed: {count}
    categories: {list}
    status: "completed"

  step-06-complete:
    duration: "{duration}"
    commit_hash: "{hash}"
    files_committed: {count}
    pushed: {true|false}
    status: "completed"

# Quality metrics
quality:
  all_tests_passing: true
  lint_clean: true
  build_success: true
  no_vibe_coding: true
  followed_step_sequence: true

# Files affected
files:
  created: {list}
  modified: {list}
  deleted: {list}

# Commit information
commit:
  hash: "{hash}"
  message: "{message}"
  files_committed: {count}
  pushed_to_remote: {true|false}
```

### 3. Display Final Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SUPER-DEV PIPELINE COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: {story_title}
Duration: {total_duration}

Development Type: {greenfield|brownfield|hybrid}

Results:
✅ Tasks Completed: {completed_count}
✅ Files Created: {created_count}
✅ Files Modified: {modified_count}
✅ Tests Added: {test_count}
✅ Issues Found & Fixed: {issue_count}

Quality Gates Passed:
✅ Pre-Gap Analysis
✅ Implementation
✅ Post-Validation (no false positives)
✅ Code Review (3-10 issues)
✅ All tests passing
✅ Lint clean
✅ Build success

Git:
✅ Commit: {commit_hash}
{if pushed}✅ Pushed to remote{endif}

Story Status: review (ready for human review)

Audit Trail: {audit_file}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ No vibe coding occurred! Disciplined execution maintained.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Clean Up State File

```bash
rm {sprint_artifacts}/super-dev-state-{story_id}.yaml
```

State is no longer needed - audit trail is the permanent record.

### 5. Final Message

```
Super-Dev Pipeline Complete!

This story was developed with disciplined step-file execution.
All quality gates passed. Ready for human review.

Next Steps:
1. Review the commit: git show {commit_hash}
2. Test manually if needed
3. Merge when approved
```

## PIPELINE COMPLETE

Pipeline execution is finished. No further steps.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Audit trail generated
- Summary accurate
- State file cleaned up
- Story marked "review"
- All metrics captured

### ❌ FAILURE
- Missing audit trail
- Incomplete summary
- State file not cleaned
- Metrics inaccurate
