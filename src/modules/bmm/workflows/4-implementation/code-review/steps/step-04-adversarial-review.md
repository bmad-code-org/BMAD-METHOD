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
- `{git_changed_files}` - Files changed according to git
- `{context_aware_findings}` - Findings from Phase 1

---

## STATE VARIABLE (capture now)

- `{diff_output}` - Complete diff of changes
- `{asymmetric_findings}` - Findings from adversarial review

---

## EXECUTION SEQUENCE

### 1. Construct Diff

Build complete diff of all changes for this story.

**Determine diff source:**

If uncommitted changes exist for story files:

```bash
git diff
git diff --cached
```

If story work is already committed, find story-related commits:

```bash
# Find commits that reference this story
git log --oneline --all --grep="{story_key}" --format="%H"
# Or find recent commits touching story files
git log --oneline -10 -- {story_file_list}
```

Then construct diff:

```bash
git diff {first_story_commit}^..HEAD -- {files}
```

**Include in `{diff_output}`:**

- All modified tracked files (except files in `{implementation_artifacts}` - asymmetry requires hiding intent)
- All new files created for this story
- Full content for new files

**Note:** Do NOT `git add` anything - this is read-only inspection.

### 2. Invoke Adversarial Review

<critical>Use information asymmetry: separate context from review</critical>

**Execution Hierarchy (try in order):**

**Option A: Subagent (Preferred)**

If Task tool available with subagent capability:

```xml
<invoke-task subagent="true">
  Review {diff_output} using {project-root}/_bmad/core/tasks/review-adversarial-general.xml
</invoke-task>
```

The subagent:

- Has FULL read access to the repository
- Receives ONLY `{diff_output}` as context
- Does NOT know story requirements, ACs, or intent
- Reviews code purely on technical merit

**Option B: CLI Fallback**

If subagent not available but CLI available:

```bash
# Pipe diff to adversarial review task
cat {diff_file} | claude --task {adversarial_review_task}
```

**Option C: Inline Execution**

If neither available, load `review-adversarial-general.xml` and execute inline:

1. Load task file
2. Adopt adversarial persona
3. Review `{diff_output}` with zero story context
4. Generate findings

### 3. Process Adversarial Findings

Capture findings from adversarial review.

**If zero findings returned:**

<critical>HALT - Zero findings is suspicious. Re-analyze or ask for guidance.</critical>

**For each finding:**

Assign severity:

- CRITICAL: Security vulnerabilities, data loss risks
- HIGH: Logic errors, missing error handling
- MEDIUM: Performance issues, code smells
- LOW: Style, documentation

Assign validity:

- REAL: Genuine issue to address
- NOISE: False positive (explain why)
- UNDECIDED: Needs human judgment

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
- Subagent invoked with proper isolation (or fallback used)
- Adversarial review executed
- Findings captured with severity and validity
- `{asymmetric_findings}` populated
- Phase summary presented
- Explicit NEXT directive provided

## FAILURE MODES

- Including story file in diff (breaks asymmetry)
- Skipping adversarial review entirely
- Accepting zero findings without halt
- Not using subagent when available
- Missing severity/validity classification
- Not storing findings for consolidation
- No explicit NEXT directive at step completion
