---
name: 'step-10-report-complete'
description: 'Finalize validation report - check for plan file, summarize all findings, present to user'

targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
validationReportFile: '{targetWorkflowPath}/validation-report-{new_workflow_name}.md'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'
planValidationStep: './step-11-plan-validation.md'
---

# Validation Step 10: Report Complete

## STEP GOAL:

To check if a plan file exists (and run plan validation if it does), then summarize all validation findings and present to the user.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 This is the final validation step - present findings
- 🚫 DO NOT modify the workflow without user request
- 💬 Present summary and ask what changes are needed
- 🚪 This ends validation - user decides next steps

## EXECUTION PROTOCOLS:

- 🎯 Load the complete validation report
- 💾 Summarize ALL findings
- 📖 Update report status to COMPLETE
- 🚫 DO NOT proceed without user review

## CONTEXT BOUNDARIES:

- All 9 previous validation steps have completed
- Report contains findings from all checks
- User needs to see summary and decide on changes
- This step DOES NOT auto-proceed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip or shortcut.

### 1. Check for Plan File

Before finalizing the report, check if a plan file exists:

**Check if {workflowPlanFile} exists:**
- **IF YES:** Run plan validation first
  - Load, read entire file, then execute {planValidationStep}
  - The plan validation will append its findings to the report
  - Then return to this step to finalize the report
- **IF NO:** Proceed to finalize the report (no plan to validate)

### 2. Load Complete Validation Report

After plan validation (if applicable), load {validationReportFile} and read ALL findings from every validation step.

### 3. Create Summary Section

At the end of {validationReportFile}, replace "## Summary *Pending...*" with:

```markdown
## Summary

**Validation Completed:** [current date]

**Overall Status:**
[Based on all validation steps, determine overall status]

**Validation Steps Completed:**
1. ✅ File Structure & Size - [PASS/FAIL/WARN]
2. ✅ Frontmatter Validation - [PASS/FAIL/WARN]
3. ✅ Menu Handling Validation - [PASS/FAIL/WARN]
4. ✅ Step Type Validation - [PASS/FAIL/WARN]
5. ✅ Output Format Validation - [PASS/FAIL/WARN]
6. ✅ Validation Design Check - [PASS/FAIL/WARN/N/A]
7. ✅ Instruction Style Check - [PASS/FAIL/WARN]
8. ✅ Collaborative Experience Check - [PASS/FAIL/WARN]
9. ✅ Cohesive Review - [EXCELLENT/GOOD/NEEDS WORK/PROBLEMATIC]
10. ✅ Plan Quality Validation - [FULLY IMPLEMENTED/PARTIALLY/MISSING/N/A]

**Issues Summary:**

**Critical Issues (Must Fix):**
- [List any critical issues from all validation steps]
- [If none, state: No critical issues found]

**Warnings (Should Fix):**
- [List any warnings from all validation steps]
- [If none, state: No warnings found]

**Strengths:**
- [List key strengths identified in validation]

**Overall Assessment:**
[Summarize the overall quality of the workflow]

**Recommendation:**
- [Ready to use / Ready with minor tweaks / Needs revision / Major rework needed]

**Next Steps:**
- Review the detailed findings above
- Decide what changes to make
- Either fix issues directly or use edit workflow (if tri-modal)
```

### 3. Update Report Status

Update frontmatter of {validationReportFile}:

```yaml
---
validationDate: [original date]
completionDate: [current date]
workflowName: {new_workflow_name}
workflowPath: {targetWorkflowPath}
validationStatus: COMPLETE
---
```

### 4. Present Summary to User

"**✅ Validation Complete!**

I've completed extensive validation of your workflow. Here's the summary:"

**Overall Status:** [Overall status from summary]

**Quick Results:**
| Validation Step | Result |
|-----------------|--------|
| File Structure & Size | [emoji] [result] |
| Frontmatter | [emoji] [result] |
| Menu Handling | [emoji] [result] |
| Step Types | [emoji] [result] |
| Output Format | [emoji] [result] |
| Validation Design | [emoji] [result or N/A] |
| Instruction Style | [emoji] [result] |
| Collaborative Experience | [emoji] [result] |
| Cohesive Review | [emoji] [result] |
| Plan Quality | [emoji] [result or N/A] |

**Issues Found:**
- **Critical:** [count or "none"]
- **Warnings:** [count or "none"]

**Recommendation:** [Ready to use / Needs tweaks / Needs revision]

"**The full validation report is available at:**
`{validationReportFile}`

**Would you like me to:**
1. Review the detailed findings with you
2. Make specific changes to address issues
3. Explain any validation result in detail
4. Something else"

### 5. Present MENU OPTIONS

Display: **Validation Complete! Select an Option:** [R] Review Detailed Findings [F] Fix Issues [X] Exit Validation

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- User chooses their next action

#### Menu Handling Logic:

- IF R: Walk through the validation report section by section, explaining findings, then redisplay menu
- IF F: "What issues would you like to fix?" → Discuss specific changes needed → User can make edits manually OR you can help edit files
- IF X: "Validation complete. Your workflow is at: {targetWorkflowPath}. You can make changes and re-run validation anytime."
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

### 6. If User Wants to Fix Issues

**Options for fixing:**

**Option A: Manual Edits**
- User edits files directly
- Re-run validation to check fixes

**Option B: Guided Edits**
- User specifies what to fix
- Help create specific edits for user approval
- User applies edits

**Option C: Edit Workflow (if tri-modal)**
- If workflow has steps-e/, use edit workflow
- Edit workflow can make systematic changes

### 7. Update Plan with Validation Status

Update {workflowPlanFile} frontmatter:

```yaml
---
validationStatus: COMPLETE
validationDate: [current date]
validationReport: {validationReportFile}
---
```

## CRITICAL STEP COMPLETION NOTE

This is the final validation step. User reviews findings and decides whether to make changes. Validation workflow ends here.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All validation findings summarized
- Complete report presented to user
- Summary section added to report
- Report status updated to COMPLETE
- User can review findings and decide on changes
- Plan updated with validation status

### ❌ SYSTEM FAILURE:

- Not summarizing all findings
- Not presenting complete report to user
- Not updating report status
- Not giving user clear options for next steps

**Master Rule:** Validation is complete. User reviews findings and decides what changes to make. Provide clear summary and options.
