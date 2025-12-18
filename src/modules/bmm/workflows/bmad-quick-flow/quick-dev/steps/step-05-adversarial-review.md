---
name: 'step-05-adversarial-review'
description: 'Construct diff and invoke adversarial review task'

workflow_path: '{project-root}/_bmad/bmm/workflows/bmad-quick-flow/quick-dev'
thisStepFile: '{workflow_path}/steps/step-05-adversarial-review.md'
nextStepFile: '{workflow_path}/steps/step-06-resolve-findings.md'
---

# Step 5: Adversarial Code Review

**Goal:** Construct diff of all changes, invoke adversarial review task, present findings.

---

## AVAILABLE STATE

From previous steps:

- `{baseline_commit}` - Git HEAD at workflow start (CRITICAL for diff)
- `{execution_mode}` - "tech-spec" or "direct"
- `{tech_spec_path}` - Tech-spec file (if Mode A)

---

## STEP 1: CONSTRUCT DIFF

Build complete diff of all changes since workflow started.

### Tracked File Changes

```bash
git diff {baseline_commit}
```

### New Untracked Files

Only include untracked files that YOU created during this workflow (steps 2-4).
Do not include pre-existing untracked files.
For each new file created, include its full content as a "new file" addition.

### Capture as {diff_output}

Merge tracked changes and new files into `{diff_output}`.

**Note:** Do NOT `git add` anything - this is read-only inspection.

---

## STEP 2: INVOKE ADVERSARIAL REVIEW

With `{diff_output}` constructed, invoke the review task:

```xml
<invoke-task input="{diff_output}">{project-root}/_bmad/core/tasks/review-adversarial-general.xml</invoke-task>
```

**Platform fallback:** If task invocation not available, load the task file and execute its instructions inline, passing `{diff_output}` as the content input.

The task will:

- Review with cynical skepticism
- Find at least 5 issues
- Assign IDs (F1, F2...), severity (critical/high/medium/low), classification (real/noise/uncertain)
- Return structured findings table

---

## STEP 3: RECEIVE FINDINGS

Capture the findings from the task output.

**If zero findings:** HALT - this is suspicious. Re-analyze or request user guidance.

---

## NEXT STEP

With findings in hand, load `step-06-resolve-findings.md` for user to choose resolution approach.

---

## SUCCESS METRICS

- Diff constructed from baseline_commit
- New files included in diff
- Task invoked with diff as input
- Findings received with IDs, severity, classification
- Zero-findings case handled appropriately

## FAILURE MODES

- Missing baseline_commit (can't construct accurate diff)
- Not including new untracked files in diff
- Invoking task without providing diff input
- Accepting zero findings without questioning
