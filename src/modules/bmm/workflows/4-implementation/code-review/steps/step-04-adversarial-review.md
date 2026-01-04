---
name: 'step-04-adversarial-review'
description: 'Context-independent adversarial diff review via subagent - no story knowledge'

workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/code-review'
thisStepFile: '{workflow_path}/steps/step-04-adversarial-review.md'
nextStepFile: '{workflow_path}/steps/step-05-consolidate-findings.md'
---

# Step 4: Adversarial Review (Information Asymmetric)

**Goal:** Perform context-independent adversarial review of code changes. Reviewer sees ONLY the diff - no story, no ACs, no context about WHY changes were made.

<critical>Reviewer has FULL repo access but NO knowledge of WHY changes were made</critical>
<critical>DO NOT include story file in prompt - asymmetry is about intent, not visibility</critical>
<critical>This catches issues a fresh reviewer would find that story-biased review might miss</critical>

---

## AVAILABLE STATE

From previous steps:

- `{story_path}`, `{story_key}`
- `{file_list}` - Files listed in story's File List section
- `{context_aware_findings}` - Findings from Phase 1

---

## STATE VARIABLE (capture now)

- `{baseline_commit}` - From story file Dev Agent Record
- `{diff_output}` - Complete diff of changes
- `{asymmetric_findings}` - Findings from adversarial review

---

## EXECUTION SEQUENCE

### 1. Construct Diff

Build complete diff of all changes for this story.

**Step 1a: Read baseline from story file**

Extract `Baseline Commit` from the story file's Dev Agent Record section.

- If found and not "NO_GIT": use as `{baseline_commit}`
- If "NO_GIT" or missing: proceed to fallback

**Step 1b: Construct diff (with baseline)**

If `{baseline_commit}` is a valid commit hash:

```bash
git diff {baseline_commit} -- ':!{implementation_artifacts}'
```

This captures all changes (committed + uncommitted) since dev-story started.

**Step 1c: Fallback (no baseline)**

If no baseline available, review current state of files in `{file_list}`:

- Read each file listed in the story's File List section
- Review as full file content (not a diff)

**Include in `{diff_output}`:**

- All modified tracked files (except files in `{implementation_artifacts}` - asymmetry requires hiding intent)
- All new files created for this story
- Full content for new files

**Note:** Do NOT `git add` anything - this is read-only inspection.

### 2. Invoke Adversarial Review

With `{diff_output}` constructed, invoke the review task. If possible, use information asymmetry: run this step, and only it, in a separate subagent or process with read access to the project, but no context except the `{diff_output}`.

```xml
<invoke-task>Review {diff_output} using {project-root}/_bmad/core/tasks/review-adversarial-general.xml</invoke-task>
```

**Platform fallback:** If task invocation not available, load the task file and execute its instructions inline, passing `{diff_output}` as the content.

The task should: review `{diff_output}` and return a list of findings.

### 3. Process Adversarial Findings

Capture findings from adversarial review.

**If zero findings:** HALT - this is suspicious. Re-analyze or ask for guidance.

Evaluate severity (Critical, High, Medium, Low) and validity (Real, Noise, Undecided).

Create `{asymmetric_findings}` list:

```
{
  id: "AAF-{n}",
  source: "adversarial-review",
  severity: "...",
  validity: "...",
  description: "...",
  location: "file:line (if applicable)"
}
```

### 4. Phase 2 Summary

Present adversarial findings:

```
**Phase 2: Adversarial Review Complete**

**Reviewer Context:** Pure diff review (no story knowledge)
**Findings:** {count}
- CRITICAL: {count}
- HIGH: {count}
- MEDIUM: {count}
- LOW: {count}

**Validity Assessment:**
- Real issues: {count}
- Noise/false positives: {count}
- Needs judgment: {count}

Proceeding to findings consolidation...
```

---

## NEXT STEP DIRECTIVE

**CRITICAL:** When this step completes, explicitly state:

"**NEXT:** Loading `step-05-consolidate-findings.md`"

---

## SUCCESS METRICS

- Diff constructed from correct source (uncommitted or commits)
- Story file excluded from diff
- Task invoked with diff as input
- Adversarial review executed
- Findings captured with severity and validity
- `{asymmetric_findings}` populated
- Phase summary presented
- Explicit NEXT directive provided

## FAILURE MODES

- Including story file in diff (breaks asymmetry)
- Skipping adversarial review entirely
- Accepting zero findings without halt
- Invoking task without providing diff input
- Missing severity/validity classification
- Not storing findings for consolidation
- No explicit NEXT directive at step completion
