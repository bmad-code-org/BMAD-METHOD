---
name: 'step-12-review'
description: 'Review the generated workflow and provide final validation and next steps'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-12-review.md'
workflowFile: '{workflow_path}/workflow.md'
# Output files for workflow creation process
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'
targetWorkflowPath: '{custom_workflow_location}/{new_workflow_name}'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'

# Template References
reviewTemplate: '{workflow_path}/templates/review-section.md'
completionTemplate: '{workflow_path}/templates/completion-section.md'
---

# Step 6: Workflow Review and Completion

## STEP GOAL:

To review the generated workflow for completeness, accuracy, and adherence to best practices, then provide next steps for deployment and usage.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Always read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and systems designer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring quality assurance expertise and validation knowledge
- ✅ User provides final approval and feedback

### Step-Specific Rules:

- 🎯 Focus ONLY on reviewing and validating generated workflow
- 🚫 FORBIDDEN to make changes without user approval
- 💬 Guide review process collaboratively
- 🚪 COMPLETE the workflow creation process

## EXECUTION PROTOCOLS:

- 🎯 Conduct thorough review of generated workflow
- 💾 Document review findings and completion status
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` and mark complete
- 🚫 This is the final step - no next step to load

## CONTEXT BOUNDARIES:

- Generated workflow files are available for review
- Focus on validation and quality assurance
- This step completes the workflow creation process
- No file modifications without explicit user approval

## WORKFLOW REVIEW PROCESS:

### 1. File Structure Review

Verify the workflow organization:

- Are all required files present?
- Is the directory structure correct?
- Are file names following conventions?
- Are paths properly configured?

### 2. Configuration Validation

Check workflow.yaml:

- Is all metadata correctly filled?
- Are path variables properly formatted?
- Is the standalone property set correctly?
- Are all dependencies declared?

### 3. Step File Compliance

Review each step file:

- Does each step follow the template structure?
- Are all mandatory rules included?
- Is menu handling properly implemented?
- Are frontmatter variables correct?
- Are steps properly numbered?

### 4. Cross-File Consistency

Verify integration between files:

- Do variable names match across all files?
- Are path references consistent?
- Is the step sequence logical?
- Are there any broken references?

### 5. Requirements Verification

Confirm original requirements are met:

- Does the workflow address the original problem?
- Are all user types supported?
- Are inputs and outputs as specified?
- Is the interaction style as designed?

### 6. Best Practices Adherence

Check quality standards:

- Are step files focused and reasonably sized (5-10KB typical)?
- Is collaborative dialogue implemented?
- Is error handling included?
- Are naming conventions followed?

### 7. Test Scenario Planning

Prepare for testing:

- What test data would be useful?
- What scenarios should be tested?
- How can the workflow be invoked?
- What would indicate successful execution?

### 8. Deployment Preparation

Provide next steps:

- Installation requirements
- Invocation commands
- Testing procedures
- Documentation needs

## REVIEW FINDINGS DOCUMENTATION:

### Issues Found

Document any issues discovered:

- **Critical Issues**: Must fix before use
- **Warnings**: Should fix for better experience
- **Suggestions**: Nice to have improvements

### Validation Results

Record validation outcomes:

- Configuration validation: PASSED/FAILED
- Step compliance: PASSED/FAILED
- Cross-file consistency: PASSED/FAILED
- Requirements verification: PASSED/FAILED

### Recommendations

Provide specific recommendations:

- Immediate actions needed
- Future improvements
- Training needs
- Maintenance considerations

## COMPLETION CHECKLIST:

### Final Validations

- [ ] All files generated successfully
- [ ] No syntax errors in YAML
- [ ] All paths are correct
- [ ] Variables are consistent
- [ ] Design requirements met
- [ ] Best practices followed

### User Acceptance

- [ ] User has reviewed generated workflow
- [ ] User approves of the implementation
- [ ] User understands next steps
- [ ] User satisfied with the result

### Documentation

- [ ] Build summary complete
- [ ] Review findings documented
- [ ] Next steps provided
- [ ] Contact information for support

## CONTENT TO APPEND TO PLAN:

After completing review, append to {workflowPlanFile}:

Load and append the content from {reviewTemplate}

Then load and append the content from {completionTemplate}

## FINAL MENU OPTIONS

Display: **All Files Created Successfully!** [C] Complete & Get Validation Instructions

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- Provide compliance check guidance for new context execution
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- IF C: Save content to {workflowPlanFile}, update frontmatter, then provide validation instructions for running in new context
- IF Any other comments or queries: respond and redisplay menu

## COMPLIANCE CHECK INSTRUCTIONS

When user selects [C], provide these instructions:

**🎯 Workflow Creation Complete! Your new workflow is ready at:**
`{target_workflow_path}`

**⚠️ IMPORTANT - Run Compliance Check in New Context:**
To validate your workflow meets BMAD standards:

1. **Start a new Claude conversation** (fresh context)
2. **Use this command:** `/bmad:bmm:workflows:workflow-compliance-check`
3. **Provide the path:** `{target_workflow_path}/workflow.md`
4. **Follow the validation process** to identify and fix any violations

**Why New Context?**

- Compliance checking requires fresh analysis without workflow creation context
- Ensures objective validation against template standards
- Provides detailed violation reporting with specific fix recommendations

**Your workflow will be checked for:**

- Template compliance and structure
- Step-by-step validation standards
- File optimization and formatting
- Meta-workflow best practices

Ready to validate when you are! [Start new context and run compliance check]

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Generated workflow thoroughly reviewed
- All validations performed
- Issues documented with solutions
- User approves final workflow
- Complete documentation provided

### ❌ SYSTEM FAILURE:

- Skipping review steps
- Not documenting findings
- Ending without user approval
- Not providing next steps

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
