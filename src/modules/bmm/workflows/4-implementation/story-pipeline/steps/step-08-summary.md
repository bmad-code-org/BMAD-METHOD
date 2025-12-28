---
name: 'step-08-summary'
description: 'Generate audit trail and pipeline summary report'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-08-summary.md'
auditFile: '{sprint_artifacts}/audit-{story_id}-{date}.yaml'

# No role needed - orchestrator
role: null
---

# Step 8: Pipeline Summary

## STEP GOAL

Generate final audit trail and summary report:
1. Calculate pipeline metrics
2. Generate audit trail file
3. Create summary report
4. Clean up pipeline state
5. Suggest next steps

## EXECUTION SEQUENCE

### 1. Calculate Pipeline Metrics

From pipeline state file, calculate:

```yaml
metrics:
  total_duration: {sum of all step durations}
  steps_completed: {count}
  issues_found: {from code review}
  issues_fixed: {from code review}
  tests_created: {count}
  files_modified: {count}
  migrations_applied: {count}
```

### 2. Generate Audit Trail

Create: `{auditFile}`

```yaml
---
audit_version: "1.0"
pipeline: "story-pipeline-v2.0"
story_id: "{story_id}"
epic_num: {epic_num}
---

# Pipeline Audit Trail

## Execution Summary
started_at: "{started_at}"
completed_at: "{timestamp}"
total_duration: "{duration}"
mode: "{mode}"
status: "completed"

## Steps Executed
steps:
  - step: 1
    name: "Initialize"
    status: completed
    duration: "{duration}"

  - step: 2
    name: "Create Story"
    status: completed
    duration: "{duration}"
    agent: sm
    output: "{story_file_path}"

  - step: 3
    name: "Validate Story"
    status: completed
    duration: "{duration}"
    agent: sm
    issues_found: {count}
    issues_fixed: {count}

  - step: 4
    name: "ATDD"
    status: completed
    duration: "{duration}"
    agent: tea
    tests_created: {count}
    test_files:
      - "{file_1}"
      - "{file_2}"

  - step: 5
    name: "Implement"
    status: completed
    duration: "{duration}"
    agent: dev
    files_modified: {count}
    migrations:
      - "{migration_1}"

  - step: 6
    name: "Code Review"
    status: completed
    duration: "{duration}"
    agent: dev
    issues_found: {count}
    issues_fixed: {count}
    categories_reviewed:
      - security
      - performance
      - error-handling
      - testing
      - quality
      - architecture

  - step: 7
    name: "Complete"
    status: completed
    duration: "{duration}"
    agent: sm
    commit_hash: "{hash}"

  - step: 8
    name: "Summary"
    status: completed
    duration: "{duration}"

## Quality Gates
gates:
  story_creation:
    passed: true
    criteria_met: [list]
  validation:
    passed: true
    quality_score: {score}
  atdd:
    passed: true
    tests_failing: true  # Expected in red phase
  implementation:
    passed: true
    tests_passing: true
  code_review:
    passed: true
    minimum_issues_found: true

## Artifacts Produced
artifacts:
  story_file: "{path}"
  test_files:
    - "{path}"
  migrations:
    - "{path}"
  atdd_checklist: "{path}"
  review_report: "{path}"
  commit: "{hash}"

## Token Efficiency
token_estimate:
  traditional_approach: "~71K tokens (6 claude calls)"
  step_file_approach: "~{actual}K tokens (1 session)"
  savings: "{percentage}%"
```

### 3. Generate Summary Report

Display to user:

```
═══════════════════════════════════════════════════════════════════
                    PIPELINE COMPLETE: Story {story_id}
═══════════════════════════════════════════════════════════════════

📊 EXECUTION SUMMARY
────────────────────
Duration: {total_duration}
Mode: {mode}
Status: ✓ Completed Successfully

📋 STORY DETAILS
────────────────────
Epic: {epic_num}
Title: {story_title}
Commit: {commit_hash}

✅ QUALITY METRICS
────────────────────
Validation Score: {score}/100
Issues Found: {count}
Issues Fixed: {count}
Tests Created: {count}
Files Modified: {count}

📁 ARTIFACTS
────────────────────
Story: {story_file}
Tests: {test_count} files
Migrations: {migration_count}
Audit: {audit_file}

💰 TOKEN EFFICIENCY
────────────────────
Traditional: ~71K tokens
Step-file: ~{actual}K tokens
Savings: {percentage}%

═══════════════════════════════════════════════════════════════════
```

### 4. Update Final Pipeline State

Update state file:
- Add `8` to `stepsCompleted`
- Set `lastStep: 8`
- Set `status: completed`
- Set `completed_at: {timestamp}`

### 5. Suggest Next Steps

Display:

```
📌 NEXT STEPS
────────────────────
1. Review commit: git show {hash}
2. Push when ready: git push
3. Next story: bmad build {next_story_id}
4. View audit: cat {audit_file}

Optional:
- Run verification: bmad verify {story_id}
- Run with coverage: npm test -- --coverage
```

### 6. Clean Up (Optional)

In batch mode, optionally archive pipeline state:

```bash
mv {state_file} {state_file}.completed
```

Or keep for reference.

## COMPLETION

Pipeline execution complete. No next step to load.

Display final message:
```
Pipeline complete. Story {story_id} is ready.
```

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Audit trail generated with all details
- Summary displayed clearly
- All metrics calculated
- State marked complete
- Next steps provided

### ❌ FAILURE
- Missing audit trail
- Incomplete metrics
- State not finalized
- No summary provided
