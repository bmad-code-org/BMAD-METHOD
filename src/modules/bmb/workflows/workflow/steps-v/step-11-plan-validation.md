---
name: 'step-11-plan-validation'
description: 'Validate plan quality - ensure all user intent and requirements are implemented'

targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
validationReportFile: '{targetWorkflowPath}/validation-report-{new_workflow_name}.md'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'
---

# Validation Step 11: Plan Quality Validation

## STEP GOAL:

To validate that a workflow plan (if it exists) has been fully implemented - all user intent captured, all requirements met with high quality.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 DO NOT BE LAZY - LOAD AND REVIEW EVERY FILE
- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ This validation step only runs if a plan file exists

### Step-Specific Rules:

- 🎯 Load the complete plan file
- 🚫 DO NOT skip checking any requirement from the plan
- 💬 Validate that built workflow matches plan specifications
- 🚪 This ensures the build actually delivered what was planned

## EXECUTION PROTOCOLS:

- 🎯 Load plan and extract all requirements/intent
- 💾 Check built workflow against plan
- 📖 Document gaps and quality issues
- 🚫 Only run this step if workflowPlanFile exists

## CONTEXT BOUNDARIES:

- This step runs AFTER the workflow is built
- Compares what was planned vs what was implemented
- Checks for: missing features, quality gaps, unmet user intent

## MANDATORY SEQUENCE

**CRITICAL:** Only run this step if {workflowPlanFile} exists. If it doesn't exist, skip to final summary.

### 1. Check if Plan Exists

First, check if {workflowPlanFile} exists:

**IF plan file does NOT exist:**
- Skip this validation step
- Proceed to summary with note: "No plan file found - workflow may have been built without BMAD create-workflow process"

**IF plan file exists:**
- Load the complete plan file
- Proceed with validation

### 2. Extract Plan Requirements

**DO NOT BE LAZY - Extract EVERY requirement from the plan:**

From {workflowPlanFile}, extract:

**From Discovery Section:**
- User's original idea/vision
- Core problem being solved

**From Classification Section:**
- 4 key decisions (document output, module, continuable, tri-modal)
- Target path
- Workflow name

**From Requirements Section:**
- Flow structure (linear/looping/branching)
- User interaction style
- Inputs required
- Output specifications
- Success criteria

**From Design Section:**
- Step outline with names and purposes
- Flow diagram
- Interaction patterns
- File structure requirements

**From Tools Section:**
- Tools configured
- Data files specified

### 3. Validate Each Requirement Against Built Workflow

**For EACH requirement extracted:**

Check the built workflow to see if it was implemented:

**Discovery Validation:**
- ✅ Built workflow addresses the original problem?
- ✅ Vision from discovery is reflected in final workflow?

**Classification Validation:**
- ✅ Document output matches plan (yes/no)?
- ✅ Module affiliation correct?
- ✅ Continuable support as specified?
- ✅ Tri-modal structure as specified?

**Requirements Validation:**
- ✅ Flow structure matches plan?
- ✅ User interaction style as specified?
- ✅ All required inputs configured?
- ✅ Output format matches specification?
- ✅ Success criteria achievable?

**Design Validation:**
- ✅ All steps from design present in workflow?
- ✅ Step purposes match design?
- ✅ Flow follows design diagram?
- ✅ Interaction patterns as specified?

**Tools Validation:**
- ✅ Specified tools configured in workflow?
- ✅ Data files created as specified?

### 4. Check Implementation Quality

For each implemented requirement, assess quality:

**Quality Questions:**
- Is the implementation high quality or minimal/barely working?
- Would this actually facilitate well?
- Are there obvious gaps or issues?

**Example:**
- Plan: "Highly collaborative, intent-based facilitation"
- Implementation: Has A/P menus, uses intent-based language ✅

- Plan: "Continuable workflow with session resume"
- Implementation: Has step-01b-continue.md, tracks stepsCompleted ✅

### 5. Document Findings

```markdown
### Plan Quality Validation Results

**Plan File:** {workflowPlanFile}
**Plan Exists:** ✅ Yes

**Requirements Extracted:** [number] requirements from plan sections

**Implementation Coverage:**

| Requirement Area | Specified | Implemented | Quality | Status |
|------------------|-----------|--------------|---------|--------|
| Discovery/Vision | [summary] | ✅/❌ | High/Med/Low | ✅/❌ |
| Document Output | [yes/no] | ✅/❌ | High/Med/Low | ✅/❌ |
| Continuable | [yes/no] | ✅/❌ | High/Med/Low | ✅/❌ |
| Tri-Modal | [yes/no] | ✅/❌ | High/Med/Low | ✅/❌ |
| Flow Structure | [type] | ✅/❌ | High/Med/Low | ✅/❌ |
| Interaction Style | [style] | ✅/❌ | High/Med/Low | ✅/❌ |
| [Step 01] | [purpose] | ✅/❌ | High/Med/Low | ✅/❌ |
| [Step 02] | [purpose] | ✅/❌ | High/Med/Low | ✅/❌ |
| ... | ... | ... | ... | ... |

**Missing Implementations:**
- [List any requirements from plan that are NOT in the built workflow]

**Quality Issues:**
- [List any requirements that are implemented but with poor quality]

**Gaps Between Plan and Reality:**
- [List where the built workflow doesn't match the plan]

**Plan Implementation Score:** [X]%

**Status:** ✅ FULLY IMPLEMENTED / ⚠️ PARTIALLY IMPLEMENTED / ❌ POORLY IMPLEMENTED / ❌ MISSING CRITICAL ITEMS
```

### 6. Append to Report

Append findings to {validationReportFile} after the "## Cohesive Review" section.

### 7. Save and Complete

Save the validation report. This is the final validation step.

**Display:**
"**Plan Quality validation complete.** Validation report finalized."

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Plan file loaded completely
- Every requirement extracted and validated
- Implementation gaps documented
- Quality assessed for each requirement
- Findings appended to report

### ❌ SYSTEM FAILURE:

- Not loading complete plan
- Skipping requirement checks
- Not documenting implementation gaps
- Not assessing quality

**Master Rule:** Validation is systematic and thorough. DO NOT BE LAZY. Check EVERY requirement from the plan. Document all gaps.
