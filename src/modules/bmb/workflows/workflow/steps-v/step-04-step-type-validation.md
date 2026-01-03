---
name: 'step-04-step-type-validation'
description: 'Validate that each step follows its correct step type pattern'

nextStepFile: './step-05-output-format-validation.md'
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
validationReportFile: '{targetWorkflowPath}/validation-report-{new_workflow_name}.md'
stepTypePatterns: '../data/step-type-patterns.md'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'
---

# Validation Step 4: Step Type Validation

## STEP GOAL:

To validate that each step file follows the correct pattern for its step type - init, continuation, middle, branch, validation, final polish, or final.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 DO NOT BE LAZY - LOAD AND REVIEW EVERY FILE
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ Validation does NOT stop for user input - auto-proceed through all validation steps

### Step-Specific Rules:

- 🎯 Load and validate EVERY step against its type pattern
- 🚫 DO NOT skip any files or checks
- 💬 Append findings to report, then auto-load next step
- 🚪 This is validation - systematic and thorough

## EXECUTION PROTOCOLS:

- 🎯 Load step type patterns first
- 💾 Check EACH file follows its designated type pattern
- 📖 Append findings to validation report
- 🚫 DO NOT halt for user input - validation runs to completion

## CONTEXT BOUNDARIES:

- All step files in steps-c/ must be validated
- Load {stepTypePatterns} for pattern definitions
- The design in {workflowPlanFile} specifies what each step should be

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip or shortcut.

### 1. Load Step Type Patterns

Load {stepTypePatterns} to understand the pattern for each type:

**Step Types:**
1. **Init (Non-Continuable)** - Auto-proceed, no continuation logic
2. **Init (Continuable)** - Has continueFile reference, continuation detection
3. **Continuation (01b)** - Paired with continuable init, routes based on stepsCompleted
4. **Middle (Standard)** - A/P/C menu, collaborative content
5. **Middle (Simple)** - C only menu, no A/P
6. **Branch** - Custom menu with routing to different steps
7. **Validation Sequence** - Auto-proceed through checks, no menu
8. **Init (With Input Discovery)** - Has inputDocuments array, discovery logic
9. **Final Polish** - Loads entire doc, optimizes flow
10. **Final** - No next step, completion message

### 2. Check EACH Step Against Its Type

**DO NOT BE LAZY - For EACH file in steps-c/:**

1. Determine what type this step SHOULD be from:
   - Step number (01 = init, 01b = continuation, last = final)
   - Design in {workflowPlanFile}
   - Step name pattern

2. Load the step file

3. Validate it follows the pattern for its type:

**For Init Steps:**
- ✅ Creates output from template (if document-producing)
- ✅ No A/P menu (or C-only)
- ✅ If continuable: has continueFile reference

**For Continuation (01b):**
- ✅ Has nextStepOptions in frontmatter
- ✅ Reads stepsCompleted from output
- ✅ Routes to appropriate step

**For Middle (Standard):**
- ✅ Has A/P/C menu
- ✅ Outputs to document (if applicable)
- ✅ Has mandatory execution rules

**For Middle (Simple):**
- ✅ Has C-only menu
- ✅ No A/P options

**For Branch:**
- ✅ Has custom menu letters
- ✅ Handler routes to different steps

**For Validation Sequence:**
- ✅ Auto-proceeds (no user choice)
- ✅ Proceeds to next validation

**For Final Polish:**
- ✅ Loads entire document
- ✅ Optimizes flow, removes duplication
- ✅ Uses ## Level 2 headers

**For Final:**
- ✅ No nextStepFile in frontmatter
- ✅ Completion message
- ✅ No next step to load

### 3. Document Findings

Create report table:

```markdown
### Step Type Validation Results

| File | Should Be Type | Follows Pattern | Issues | Status |
|------|----------------|-----------------|--------|--------|
| step-01-init.md | Init (Continuable) | ✅ | None | ✅ PASS |
| step-01b-continue.md | Continuation | ✅ | None | ✅ PASS |
| step-02-*.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-03-*.md | Middle (Simple) | ❌ | Has A/P (should be C-only) | ❌ FAIL |
| step-04-*.md | Branch | ⚠️ | Missing custom menu letters | ⚠️ WARN |
| step-N-final.md | Final | ✅ | None | ✅ PASS |
```

### 4. List Violations

```markdown
### Step Type Violations Found

**step-03-[name].md:**
- Designated as Middle (Simple) but has A/P menu
- Should have C-only menu

**step-04-[name].md:**
- Designated as Branch but missing custom menu letters
- Handler doesn't route to different steps

**step-05-[name].md:**
- Designated as Validation Sequence but has user menu
- Should auto-proceed

**All other steps:** ✅ Follow their type patterns correctly
```

### 5. Append to Report

Update {validationReportFile} - replace "## Step Type Validation *Pending...*" with actual findings.

### 6. Save Report and Auto-Proceed

**CRITICAL:** Save the validation report BEFORE loading next step.

Then immediately load, read entire file, then execute {nextStepFile}.

**Display:**
"**Step Type validation complete.** Proceeding to Output Format Validation..."

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- EVERY step validated against its type pattern
- All violations documented
- Findings appended to report
- Report saved before proceeding
- Next validation step loaded

### ❌ SYSTEM FAILURE:

- Not checking every file's type pattern
- Skipping type-specific checks
- Not documenting violations
- Not saving report before proceeding

**Master Rule:** Validation is systematic and thorough. DO NOT BE LAZY. Check EVERY file's type pattern. Auto-proceed through all validation steps.
