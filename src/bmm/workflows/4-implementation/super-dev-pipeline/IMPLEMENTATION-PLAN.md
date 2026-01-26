# Super-Dev-Pipeline v2.0 - Comprehensive Implementation Plan

**Goal:** Implement the complete a-k workflow for robust, test-driven story implementation with intelligent code review.

## Architecture

**batch-super-dev:** Story discovery & selection loop (unchanged)
**super-dev-pipeline:** Steps a-k for each story (MAJOR ENHANCEMENT)

---

## Complete Workflow (Steps a-k)

### ✅ Step 1: Init + Validate Story (a-c)
**File:** `step-01-init.md` (COMPLETED)
- [x] a. Validate story file exists and is robust
- [x] b. If no story file, run /create-story-with-gap-analysis (auto-invoke)
- [x] c. Validate story is robust after creation

**Status:** ✅ DONE - Already implemented in commit a68b7a65

### ✅ Step 2: Smart Gap Analysis (d)
**File:** `step-02-pre-gap-analysis.md` (NEEDS ENHANCEMENT)
- [ ] d. Run gap analysis (smart: skip if we just ran create-story-with-gap-analysis)

**Status:** ⚠️ NEEDS UPDATE - Add logic to skip if story was just created in step 1

**Implementation:**
```yaml
# In step-02-pre-gap-analysis.md
Check state from step 1:
  If story_just_created == true:
    Skip gap analysis (already done in create-story-with-gap-analysis)
    Display: ✅ Gap analysis skipped (already performed during story creation)
  Else:
    Run gap analysis as normal
```

### ✅ Step 3: Write Tests (e) - NEW
**File:** `step-03-write-tests.md` (COMPLETED)
- [x] e. Write tests that should pass for story to be valid

**Status:** ✅ DONE - Created comprehensive TDD step file

**Features:**
- Write tests BEFORE implementation
- Test all acceptance criteria
- Red phase (tests fail initially)
- Comprehensive coverage requirements

### ⚠️ Step 4: Implement (f)
**File:** `step-04-implement.md` (NEEDS RENAME)
- [ ] f. Run dev-story to implement actual code changes

**Status:** ⚠️ NEEDS RENAME - Rename `step-03-implement.md` → `step-04-implement.md`

**Implementation:**
```bash
# Rename file
mv step-03-implement.md step-04-implement.md

# Update references
# Update workflow.yaml step 4 definition
# Update next step references in step-03-write-tests.md
```

### ⚠️ Step 5: Post-Validation (g)
**File:** `step-05-post-validation.md` (NEEDS RENAME)
- [ ] g. Run post-validation to ensure claimed work was ACTUALLY implemented

**Status:** ⚠️ NEEDS RENAME - Rename `step-04-post-validation.md` → `step-05-post-validation.md`

### ✅ Step 6: Run Quality Checks (h) - NEW
**File:** `step-06-run-quality-checks.md` (COMPLETED)
- [x] h. Run tests, type checks, linter - fix all problems

**Status:** ✅ DONE - Created comprehensive quality gate step

**Features:**
- Run test suite (must pass 100%)
- Check test coverage (≥80%)
- Run type checker (zero errors)
- Run linter (zero errors/warnings)
- Auto-fix what's possible
- Manual fix remaining issues
- BLOCKING step - cannot proceed until ALL pass

### ⚠️ Step 7: Intelligent Code Review (i)
**File:** `step-07-code-review.md` (NEEDS RENAME + ENHANCEMENT)
- [ ] i. Run adversarial review for basic/standard, multi-agent-review for complex

**Status:** ⚠️ NEEDS WORK
1. Rename `step-05-code-review.md` → `step-07-code-review.md`
2. Enhance to actually invoke multi-agent-review workflow
3. Route based on complexity:
   - MICRO: Skip review (low risk)
   - STANDARD: Adversarial review
   - COMPLEX: Multi-agent review (or give option)

**Implementation:**
```yaml
# In step-07-code-review.md

Complexity-based routing:

If complexity_level == "micro":
  Display: ✅ Code review skipped (micro story, low risk)
  Skip to step 8

Else if complexity_level == "standard":
  Display: 📋 Running adversarial code review...
  Run adversarial review (existing logic)
  Save findings to {review_report}

Else if complexity_level == "complex":
  Display: 🤖 Running multi-agent code review...
  <invoke-workflow path="{multi_agent_review_workflow}">
    <input name="story_id">{story_id}</input>
  </invoke-workflow>
  Save findings to {review_report}
```

### ✅ Step 8: Review Analysis (j) - NEW
**File:** `step-08-review-analysis.md` (COMPLETED)
- [x] j. Analyze review findings - distinguish real issues from gold plating

**Status:** ✅ DONE - Created comprehensive review analysis step

**Features:**
- Categorize findings: MUST FIX, SHOULD FIX, CONSIDER, REJECTED, OPTIONAL
- Critical thinking framework
- Document rejection rationale
- Estimated fix time
- Classification report

### ⚠️ Step 9: Fix Issues - NEW
**File:** `step-09-fix-issues.md` (NEEDS CREATION)
- [ ] Fix real issues from review analysis

**Status:** 🔴 TODO - Create new step file

**Implementation:**
```markdown
# Step 9: Fix Issues

Load classification report from step 8

For each MUST FIX issue:
  1. Read file at location
  2. Understand the issue
  3. Implement fix
  4. Verify fix works (run tests)
  5. Commit fix

For each SHOULD FIX issue:
  1. Read file at location
  2. Understand the issue
  3. Implement fix
  4. Verify fix works (run tests)
  5. Commit fix

For CONSIDER items:
  - If time permits and in scope, fix
  - Otherwise, document as tech debt

For REJECTED items:
  - Skip (already documented why in step 8)

For OPTIONAL items:
  - Create tech debt tickets
  - Skip implementation

After all fixes:
  - Re-run quality checks (step 6)
  - Ensure all tests still pass
```

### ⚠️ Step 10: Complete + Update Status (k)
**File:** `step-10-complete.md` (NEEDS RENAME + ENHANCEMENT)
- [ ] k. Update story to "done", update sprint-status.yaml (MANDATORY)

**Status:** ⚠️ NEEDS WORK
1. Rename `step-06-complete.md` → `step-10-complete.md`
2. Add MANDATORY sprint-status.yaml update
3. Update story status to "done"
4. Verify status update persisted

**Implementation:**
```yaml
# In step-10-complete.md

CRITICAL ENFORCEMENT:

1. Update story file:
   - Mark all checkboxes as checked
   - Update status to "done"
   - Add completion timestamp

2. Update sprint-status.yaml (MANDATORY):
   development_status:
     {story_id}: done  # ✅ COMPLETED: {brief_summary}

3. Verify update persisted:
   - Re-read sprint-status.yaml
   - Confirm status == "done"
   - HALT if verification fails

NO EXCEPTIONS - Story MUST be marked done in both files
```

### ⚠️ Step 11: Summary
**File:** `step-11-summary.md` (NEEDS RENAME)
- [ ] Final summary report

**Status:** ⚠️ NEEDS RENAME - Rename `step-07-summary.md` → `step-11-summary.md`

---

## Multi-Agent Review Workflow

### ✅ Workflow Created
**Location:** `src/modules/bmm/workflows/4-implementation/multi-agent-review/`

**Files:**
- [x] `workflow.yaml` (COMPLETED)
- [x] `instructions.md` (COMPLETED)

**Status:** ✅ DONE - Workflow wrapper around multi-agent-review skill

**Integration:**
- Invoked from step-07-code-review.md when complexity == "complex"
- Uses Skill tool to invoke multi-agent-review skill
- Returns comprehensive review report
- Aggregates findings by severity

---

## Workflow.yaml Updates Needed

**File:** `src/modules/bmm/workflows/4-implementation/super-dev-pipeline/workflow.yaml`

**Changes Required:**
1. Update version to `1.5.0`
2. Update description to mention test-first approach
3. Redefine steps array (11 steps instead of 7)
4. Add multi-agent-review workflow path
5. Update complexity routing for new steps
6. Add skip conditions for new steps

**New Steps Definition:**
```yaml
steps:
  - step: 1
    file: "{steps_path}/step-01-init.md"
    name: "Init + Validate Story"
    description: "Load, validate, auto-create if needed (a-c)"

  - step: 2
    file: "{steps_path}/step-02-smart-gap-analysis.md"
    name: "Smart Gap Analysis"
    description: "Gap analysis (skip if just created story) (d)"

  - step: 3
    file: "{steps_path}/step-03-write-tests.md"
    name: "Write Tests (TDD)"
    description: "Write tests before implementation (e)"

  - step: 4
    file: "{steps_path}/step-04-implement.md"
    name: "Implement"
    description: "Run dev-story implementation (f)"

  - step: 5
    file: "{steps_path}/step-05-post-validation.md"
    name: "Post-Validation"
    description: "Verify work actually implemented (g)"

  - step: 6
    file: "{steps_path}/step-06-run-quality-checks.md"
    name: "Quality Checks"
    description: "Tests, type check, linter (h)"
    quality_gate: true
    blocking: true

  - step: 7
    file: "{steps_path}/step-07-code-review.md"
    name: "Code Review"
    description: "Adversarial or multi-agent review (i)"

  - step: 8
    file: "{steps_path}/step-08-review-analysis.md"
    name: "Review Analysis"
    description: "Analyze findings - reject gold plating (j)"

  - step: 9
    file: "{steps_path}/step-09-fix-issues.md"
    name: "Fix Issues"
    description: "Implement MUST FIX and SHOULD FIX items"

  - step: 10
    file: "{steps_path}/step-10-complete.md"
    name: "Complete + Update Status"
    description: "Mark done, update sprint-status.yaml (k)"
    quality_gate: true
    mandatory_sprint_status_update: true

  - step: 11
    file: "{steps_path}/step-11-summary.md"
    name: "Summary"
    description: "Final report"
```

---

## File Rename Operations

Execute these renames:
```bash
cd src/modules/bmm/workflows/4-implementation/super-dev-pipeline/steps/

# Rename existing files to new step numbers
mv step-03-implement.md step-04-implement.md
mv step-04-post-validation.md step-05-post-validation.md
mv step-05-code-review.md step-07-code-review.md
mv step-06-complete.md step-10-complete.md
mv step-06a-queue-commit.md step-10a-queue-commit.md
mv step-07-summary.md step-11-summary.md

# Update step-02 to step-02-smart-gap-analysis.md (add "smart" logic)
# No rename needed, just update content
```

---

## Implementation Checklist

### Phase 1: File Structure ✅ (Partially Done)
- [x] Create multi-agent-review workflow
- [x] Create step-03-write-tests.md
- [x] Create step-06-run-quality-checks.md
- [x] Create step-08-review-analysis.md
- [ ] Create step-09-fix-issues.md
- [ ] Rename existing step files
- [ ] Update workflow.yaml

### Phase 2: Content Updates
- [ ] Update step-02 with smart gap analysis logic
- [ ] Update step-07 with multi-agent integration
- [ ] Update step-10 with mandatory sprint-status update
- [ ] Update all step file references to new numbering

### Phase 3: Integration
- [ ] Update batch-super-dev to reference new pipeline
- [ ] Test complete workflow end-to-end
- [ ] Update documentation

### Phase 4: Agent Configuration
- [ ] Add multi-agent-review to sm.agent.yaml
- [ ] Add multi-agent-review to dev.agent.yaml (optional)
- [ ] Update agent menu descriptions

---

## Testing Plan

1. **Test micro story:** Should skip steps 3, 7, 8, 9 (write tests, code review, analysis, fix)
2. **Test standard story:** Should run all steps with adversarial review
3. **Test complex story:** Should run all steps with multi-agent review
4. **Test story creation:** Verify auto-create in step 1 works
5. **Test smart gap analysis:** Verify step 2 skips if story just created
6. **Test quality gate:** Verify step 6 blocks on failing tests
7. **Test review analysis:** Verify step 8 correctly categorizes findings
8. **Test sprint-status update:** Verify step 10 updates sprint-status.yaml

---

## Version History

**v1.4.0** (Current - Committed): Auto-create story via /create-story-with-gap-analysis
**v1.5.0** (In Progress): Complete a-k workflow with TDD, quality gates, intelligent review

---

## Next Steps

1. Create `step-09-fix-issues.md`
2. Perform all file renames
3. Update `workflow.yaml` with new 11-step structure
4. Test each step individually
5. Test complete workflow end-to-end
6. Commit and document
