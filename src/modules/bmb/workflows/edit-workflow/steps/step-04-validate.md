---
name: 'step-04-validate'
description: 'Validate improvements and prepare for completion'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/workflows/edit-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-04-validate.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/workflow-edit-{target_workflow_name}.md'
nextStepFile: '{workflow_path}/steps/step-05-compliance-check.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'

# Template References
validationTemplate: '{workflow_path}/templates/validation-results.md'
completionTemplate: '{workflow_path}/templates/completion-summary.md'
---

# Step 4: Validation and Completion

## STEP GOAL:

To validate all improvements and prepare a completion summary of the workflow editing process.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Always read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow editor and improvement specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You ensure quality and completeness
- ✅ User confirms final state

### Step-Specific Rules:

- 🎯 Focus ONLY on validation and completion
- 🚫 FORBIDDEN to make additional edits at this stage
- 💬 Explain validation results clearly
- 🚪 PREPARE final summary and next steps

## EXECUTION PROTOCOLS:

- 🎯 Validate all changes systematically
- 💾 Document validation results
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' and validation is complete

## CONTEXT BOUNDARIES:

- All improvements from step 3 should be implemented
- Focus on validation, not additional changes
- Reference best practices for validation criteria
- This completes the editing process

## VALIDATION PROCESS:

### 1. Comprehensive Validation Checks

Validate the improved workflow systematically:

#### File Structure Validation

- [ ] All required files present
- [ ] Directory structure correct
- [ ] File names follow conventions
- [ ] Path references resolve correctly

#### Configuration Validation

- [ ] workflow.md frontmatter complete
- [ ] All variables properly formatted
- [ ] Path variables use correct syntax
- [ ] No hardcoded paths exist

#### Step File Compliance

- [ ] Each step follows template structure
- [ ] Mandatory rules included
- [ ] Menu handling implemented properly
- [ ] Step numbering sequential
- [ ] Step files reasonably sized (5-10KB)

#### Cross-File Consistency

- [ ] Variable names match across files
- [ ] No orphaned references
- [ ] Dependencies correctly defined
- [ ] Template variables match outputs

#### Best Practices Adherence

- [ ] Collaborative dialogue implemented
- [ ] Error handling included
- [ ] Naming conventions followed
- [ ] Instructions clear and specific

### 2. Present Validation Results

Load validationTemplate and document findings:

- If issues found: Explain clearly and propose fixes
- If all passes: Confirm success warmly

### 3. Create Completion Summary

Load completionTemplate and prepare:

- Story of transformation
- Key improvements made
- Impact on users
- Next steps for testing

### 4. Guide Next Steps

Based on changes made, suggest:

- Testing the edited workflow
- Running it with sample data
- Getting user feedback
- Additional refinements if needed

### 5. Document Final State

Update {outputFile} with:

- Validation results
- Completion summary
- Change log summary
- Recommendations

## CONTENT TO APPEND TO DOCUMENT:

After validation, append to {outputFile}:

Load and append content from {validationTemplate}

Then load and append content from {completionTemplate}

## FINAL MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#final-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and content is saved to {outputFile} with frontmatter updated, will you then load, read entire file, then execute {nextStepFile} to execute and begin compliance validation step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All improvements validated successfully
- No critical issues remain
- Completion summary provided
- Next steps clearly outlined
- User satisfied with results

### ❌ SYSTEM FAILURE:

- Skipping validation steps
- Not documenting final state
- Ending without user confirmation
- Leaving issues unresolved

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
