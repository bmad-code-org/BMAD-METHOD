---
name: 'step-03-context-aware-review'
description: 'Story-aware validation: verify ACs, audit task completion, check git discrepancies'

thisStepFile: '{installed_path}/steps/step-03-context-aware-review.md'
nextStepFile: '{installed_path}/steps/step-04-adversarial-review.md'
---

# Step 3: Context-Aware Review

**Goal:** Perform story-aware validation - verify AC implementation, audit task completion, review code quality with full story context.

<critical>VALIDATE EVERY CLAIM - Check git reality vs story claims</critical>
<critical>You KNOW the story requirements - use that knowledge to find gaps</critical>

---

## AVAILABLE STATE

From previous steps:

- `{story_path}`, `{story_key}`
- `{story_file_list}`, `{git_changed_files}`, `{git_discrepancies}`
- `{acceptance_criteria}`, `{tasks_with_status}`
- `{comprehensive_file_list}`, `{review_attack_plan}`

---

## STATE VARIABLE (capture now)

- `{context_aware_findings}` - All findings from this phase

Initialize `{context_aware_findings}` as empty list.

---

## EXECUTION SEQUENCE

### 1. Git vs Story Discrepancies

Review `{git_discrepancies}` and create findings:

| Discrepancy Type | Severity |
| --- | --- |
| Files changed but not in story File List | Medium |
| Story lists files but no git changes | High |
| Uncommitted changes not documented | Medium |

For each discrepancy, add to `{context_aware_findings}` (no IDs yet - assigned after merge):

```
{
  source: "git-discrepancy",
  severity: "...",
  description: "...",
  evidence: "file: X, git says: Y, story says: Z"
}
```

### 2. Acceptance Criteria Validation

For EACH AC in `{acceptance_criteria}`:

1. Read the AC requirement
2. Search implementation files in `{comprehensive_file_list}` for evidence
3. Determine status: IMPLEMENTED, PARTIAL, or MISSING
4. If PARTIAL or MISSING → add High severity finding

Add to `{context_aware_findings}`:

```
{
  source: "ac-validation",
  severity: "High",
  description: "AC {id} not fully implemented: {details}",
  evidence: "Expected: {ac}, Found: {what_was_found}"
}
```

### 3. Task Completion Audit

For EACH task marked [x] in `{tasks_with_status}`:

1. Read the task description
2. Search files for evidence it was actually done
3. **Critical**: If marked [x] but NOT DONE → Critical finding
4. Record specific proof (file:line) if done

Add to `{context_aware_findings}` if false:

```
{
  source: "task-audit",
  severity: "Critical",
  description: "Task marked complete but not implemented: {task}",
  evidence: "Searched: {files}, Found: no evidence of {expected}"
}
```

### 4. Code Quality Review (Context-Aware)

For EACH file in `{comprehensive_file_list}`:

Review with STORY CONTEXT (you know what was supposed to be built):

- **Security**: Missing validation for AC-specified inputs?
- **Performance**: Story mentioned scale requirements met?
- **Error Handling**: Edge cases from AC covered?
- **Test Quality**: Tests actually verify ACs or just placeholders?
- **Architecture Compliance**: Follows patterns in architecture doc?

Add findings to `{context_aware_findings}` with appropriate severity.

### 5. Minimum Finding Check

<critical>If total findings < 3, NOT LOOKING HARD ENOUGH</critical>

Re-examine for:

- Edge cases not covered by implementation
- Documentation gaps
- Integration issues with other components
- Dependency problems
- Comments missing for complex logic

---

## PHASE 1 SUMMARY

Present context-aware findings:

```
**Phase 1: Context-Aware Review Complete**

**Findings:** {count}
- Critical: {count}
- High: {count}
- Medium: {count}
- Low: {count}

Proceeding to Phase 2: Adversarial Review...
```

Store `{context_aware_findings}` for consolidation in step 5.

---

## NEXT STEP DIRECTIVE

**CRITICAL:** When this step completes, explicitly state:

"**NEXT:** Loading `step-04-adversarial-review.md`"

---

## SUCCESS METRICS

- All git discrepancies reviewed and findings created
- Every AC checked for implementation evidence
- Every [x] task verified with proof
- Code quality reviewed with story context
- Minimum 3 findings (push harder if not)
- `{context_aware_findings}` populated
- Phase summary presented
- Explicit NEXT directive provided

## FAILURE MODES

- Accepting "looks good" with < 3 findings
- Not verifying [x] tasks with actual evidence
- Missing AC validation
- Ignoring git discrepancies
- Not storing findings for consolidation
- No explicit NEXT directive at step completion
