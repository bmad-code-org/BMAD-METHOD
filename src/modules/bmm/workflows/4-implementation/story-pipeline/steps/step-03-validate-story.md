---
name: 'step-03-validate-story'
description: 'Adversarial validation of story completeness and quality'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-03-validate-story.md'
nextStepFile: '{workflow_path}/steps/step-04-atdd.md'
checklist: '{workflow_path}/checklists/story-validation.md'

# Role (same as step 2, no switch needed)
role: sm
---

# Step 3: Validate Story

## ROLE CONTINUATION

**Continuing as SM (Scrum Master) - Adversarial Validator mode.**

You are now an ADVERSARIAL validator. Your job is to FIND PROBLEMS, not approve.
Challenge every assumption. Question every AC. Ensure the story is truly ready.

## STEP GOAL

Perform rigorous validation of the story file:
1. Research common AC anti-patterns
2. Validate each acceptance criterion
3. Check technical feasibility
4. Ensure all edge cases covered
5. Fix all issues found
6. Add validation report

## MANDATORY EXECUTION RULES

### Adversarial Mindset

- **ASSUME** something is wrong - find it
- **NEVER** say "looks good" without deep analysis
- **QUESTION** every assumption
- **FIND** at least 3 issues (if no issues, you haven't looked hard enough)

### Validation Rules

- Every AC must be: Specific, Measurable, Testable
- Every AC must have test scenarios
- No vague terms: "should", "might", "could", "etc."
- No undefined boundaries: "appropriate", "reasonable"

## EXECUTION SEQUENCE

### 1. Research Validation Patterns

Use MCP for research:

```
mcp__exa__web_search_exa:
  query: "acceptance criteria anti-patterns common mistakes user stories"
```

**Extract:**
- Common AC problems
- Validation techniques
- Red flags to look for

### 2. Load Story File

Read from cached path: `{story_file_path}`

Parse and extract:
- All acceptance criteria
- All test scenarios
- Task definitions
- Dependencies

### 3. Validate Each AC (MANDATORY CHECKLIST)

For EACH acceptance criterion:

**Structure Check:**
- [ ] Has Given/When/Then format
- [ ] Given is a valid precondition
- [ ] When is a clear action
- [ ] Then is a measurable outcome

**Quality Check:**
- [ ] Specific (no vague terms)
- [ ] Measurable (clear success criteria)
- [ ] Testable (can write automated test)
- [ ] Independent (no hidden dependencies)

**Completeness Check:**
- [ ] Edge cases considered
- [ ] Error scenarios defined
- [ ] Boundary conditions clear

**Anti-pattern Check:**
- [ ] No implementation details
- [ ] No AND conjunctions (split into multiple AC)
- [ ] No OR alternatives (ambiguous)

### 4. Technical Feasibility Check

Cross-reference with architecture.md (from cache):

- [ ] Required data model exists or migration defined
- [ ] API endpoints fit existing patterns
- [ ] No conflicts with existing functionality
- [ ] Security model (RLS) can support requirements

### 5. Test Scenario Coverage

Verify test scenarios:
- [ ] At least 2 scenarios per AC
- [ ] Happy path covered
- [ ] Error paths covered
- [ ] Edge cases covered
- [ ] Each scenario is unique (no duplicates)

### 6. Document All Issues Found

Create issues list:

```yaml
issues_found:
  - id: 1
    severity: high|medium|low
    ac: AC1
    problem: "Description of issue"
    fix: "How to fix it"
  - id: 2
    ...
```

### 7. Fix All Issues

For EACH issue:
1. Edit the story file to fix
2. Document the fix
3. Verify fix is correct

### 8. Add Validation Report

Append to story file:

```yaml
# Validation Report
validated_by: sm-validator
validated_at: {timestamp}
issues_found: {count}
issues_fixed: {count}
quality_score: {0-100}
test_scenarios_count: {count}
edge_cases_covered: {list}
ready_for_dev: true|false
validation_notes: |
  - {note 1}
  - {note 2}
```

### 9. Update Pipeline State

Update state file:
- Add `3` to `stepsCompleted`
- Set `lastStep: 3`
- Set `steps.step-03-validate-story.status: completed`
- Record `issues_found` and `issues_fixed` counts

### 10. Present Summary and Menu

Display:
```
Story Validation Complete

Issues Found: {count}
Issues Fixed: {count}
Quality Score: {score}/100

Validation Areas:
- AC Structure: ✓/✗
- Testability: ✓/✗
- Technical Feasibility: ✓/✗
- Edge Cases: ✓/✗

Ready for Development: {yes/no}
```

**Interactive Mode Menu:**
```
[C] Continue to ATDD (Test Generation)
[R] Re-validate
[E] Edit story manually
[H] Halt pipeline
```

**Batch Mode:** Auto-continue if ready_for_dev: true

## QUALITY GATE

Before proceeding:
- [ ] All issues identified and fixed
- [ ] Quality score >= 80
- [ ] ready_for_dev: true
- [ ] Validation report appended to story file

## CRITICAL STEP COMPLETION

**ONLY WHEN** [validation complete AND quality gate passed AND ready_for_dev: true],
load and execute `{nextStepFile}` for ATDD test generation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Found and fixed at least 3 issues
- Quality score >= 80
- All AC pass validation checklist
- Validation report added
- Story marked ready for dev

### ❌ FAILURE
- Approving story as "looks good" without deep review
- Missing edge case analysis
- Not fixing all identified issues
- Proceeding with quality_score < 80
- Not adding validation report
