---
name: 'step-05-compliance-check'
description: 'Run comprehensive compliance validation on the edited workflow'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/workflows/edit-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-05-compliance-check.md'
workflowFile: '{workflow_path}/workflow.md'
editedWorkflowPath: '{target_workflow_path}'
complianceCheckWorkflow: '{project-root}/.bmad/bmb/workflows/workflow-compliance-check/workflow.md'
outputFile: '{output_folder}/workflow-edit-{target_workflow_name}.md'

# Task References
complianceCheckTask: '{project-root}/.bmad/bmb/workflows/workflow-compliance-check/workflow.md'
---

# Step 5: Compliance Validation

## STEP GOAL:

Run comprehensive compliance validation on the edited workflow using the workflow-compliance-check workflow to ensure it meets all BMAD standards before completion.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow editor and quality assurance specialist
- ✅ If you already have been given a name, communication_style, and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD standards and workflow validation
- ✅ User brings their edited workflow and needs quality assurance

### Step-Specific Rules:

- 🎯 Focus only on running compliance validation on the edited workflow
- 🚫 FORBIDDEN to skip compliance validation or declare workflow complete without it
- 💬 Approach: Quality-focused, thorough, and collaborative
- 📋 Ensure user understands compliance results and next steps

## EXECUTION PROTOCOLS:

- 🎯 Launch workflow-compliance-check on the edited workflow
- 💾 Review compliance report and present findings to user
- 📖 Explain any issues found and provide fix recommendations
- 🚫 FORBIDDEN to proceed without compliance validation completion

## CONTEXT BOUNDARIES:

- Available context: Edited workflow files from previous improve step
- Focus: Compliance validation using workflow-compliance-check workflow
- Limits: Validation and reporting only, no further workflow modifications
- Dependencies: Successful workflow improvements in previous step

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Initialize Compliance Validation

"**Final Quality Check: Workflow Compliance Validation**

Your workflow has been edited! Now let's run a comprehensive compliance check to ensure it meets all BMAD standards and follows best practices.

This validation will check:

- Template compliance (workflow-template.md and step-template.md)
- File size optimization and markdown formatting
- CSV data file standards (if applicable)
- Intent vs Prescriptive spectrum alignment
- Web search and subprocess optimization
- Overall workflow flow and goal alignment"

### 2. Launch Compliance Check Workflow

**A. Execute Compliance Validation:**

"Running comprehensive compliance validation on your edited workflow...
Target: `{editedWorkflowPath}`

**Executing:** {complianceCheckTask}
**Validation Scope:** Full 8-phase compliance analysis
**Expected Duration:** Thorough validation may take several minutes"

**B. Monitor Validation Progress:**

Provide updates as the validation progresses:

- "✅ Workflow.md validation in progress..."
- "✅ Step-by-step compliance checking..."
- "✅ File size and formatting analysis..."
- "✅ Intent spectrum assessment..."
- "✅ Web search optimization analysis..."
- "✅ Generating comprehensive compliance report..."

### 3. Compliance Report Analysis

**A. Review Validation Results:**

"**Compliance Validation Complete!**

**Overall Assessment:** [PASS/PARTIAL/FAIL - based on compliance report]

- **Critical Issues:** [number found]
- **Major Issues:** [number found]
- **Minor Issues:** [number found]
- **Compliance Score:** [percentage]%"

**B. Present Key Findings:**

"**Key Compliance Results:**

- **Template Adherence:** [summary of template compliance]
- **File Optimization:** [file size and formatting issues]
- **Intent Spectrum:** [spectrum positioning validation]
- **Performance Optimization:** [web search and subprocess findings]
- **Overall Flow:** [workflow structure and completion validation]"

### 4. Issue Resolution Options

**A. Review Compliance Issues:**

If issues are found:
"**Issues Requiring Attention:**

**Critical Issues (Must Fix):**
[List any critical violations that prevent workflow functionality]

**Major Issues (Should Fix):**
[List major issues that impact quality or maintainability]

**Minor Issues (Nice to Fix):**
[List minor standards compliance issues]"

**B. Resolution Options:**

"**Resolution Options:**

1. **Automatic Fixes** - I can apply automated fixes where possible
2. **Manual Guidance** - I'll guide you through manual fixes step by step
3. **Return to Edit** - Go back to step 3 for additional improvements
4. **Accept as Is** - Proceed with current state (if no critical issues)
5. **Detailed Review** - Review full compliance report in detail"

### 5. Final Validation Confirmation

**A. User Choice Handling:**

Based on user selection:

- **If Automatic Fixes**: Apply fixes and re-run validation
- **If Manual Guidance**: Provide step-by-step fix instructions
- **If Return to Edit**: Load step-03-discover.md with compliance report context
- **If Accept as Is**: Confirm understanding of any remaining issues
- **If Detailed Review**: Present full compliance report

**B. Final Status Confirmation:**

"**Workflow Compliance Status:** [FINAL/PROVISIONAL]

**Completion Criteria:**

- ✅ All critical issues resolved
- ✅ Major issues addressed or accepted
- ✅ Compliance documentation complete
- ✅ User understands any remaining minor issues

**Your edited workflow is ready!**"

### 6. Completion Documentation

**A. Update Compliance Status:**

Document final compliance status in {outputFile}:

- **Validation Date:** [current date]
- **Compliance Score:** [final percentage]
- **Issues Resolved:** [summary of fixes applied]
- **Remaining Issues:** [any accepted minor issues]

**B. Final User Guidance:**

"**Next Steps for Your Edited Workflow:**

1. **Test the workflow** with real users to validate functionality
2. **Monitor performance** and consider optimization opportunities
3. **Gather feedback** for potential future improvements
4. **Consider compliance check** periodically for maintenance

**Support Resources:**

- Use workflow-compliance-check for future validations
- Refer to BMAD documentation for best practices
- Use edit-workflow again for future modifications"

### 7. Final Menu Options

"**Workflow Edit and Compliance Complete!**

**Select an Option:**

- [C] Complete - Finish workflow editing with compliance validation
- [R] Review Compliance - View detailed compliance report
- [M] More Modifications - Return to editing for additional changes
- [T] Test Workflow - Try a test run (if workflow supports testing)"

## Menu Handling Logic:

- IF C: End workflow editing successfully with compliance validation summary
- IF R: Present detailed compliance report findings
- IF M: Return to step-03-discover.md for additional improvements
- IF T: If workflow supports testing, suggest test execution method
- IF Any other comments or queries: respond and redisplay completion options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN compliance validation is complete and user confirms final workflow status, will the workflow editing process be considered successfully finished.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Comprehensive compliance validation executed on edited workflow
- All compliance issues identified and documented with severity rankings
- User provided with clear understanding of validation results
- Appropriate resolution options offered and implemented
- Final edited workflow meets BMAD standards and is ready for production
- User satisfaction with workflow quality and compliance

### ❌ SYSTEM FAILURE:

- Skipping compliance validation before workflow completion
- Not addressing critical compliance issues found during validation
- Failing to provide clear guidance on issue resolution
- Declaring workflow complete without ensuring standards compliance
- Not documenting final compliance status for future reference

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
