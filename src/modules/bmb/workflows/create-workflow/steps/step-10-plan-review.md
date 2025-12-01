---
name: 'step-10-plan-review'
description: 'Review the complete workflow plan before generating files'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-10-plan-review.md'
nextStepFile: '{workflow_path}/steps/step-11-build.md'
workflowFile: '{workflow_path}/workflow.md'
# Output files for workflow creation process
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'
targetWorkflowPath: '{custom_workflow_location}/{new_workflow_name}'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'
---

# Step 4: Workflow Plan Review

## STEP GOAL:

To present the complete workflow plan for user review and approval before generating the actual workflow files.

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
- ✅ You present the plan clearly and answer questions
- ✅ User provides approval or requests changes

### Step-Specific Rules:

- 🎯 Focus ONLY on reviewing the plan, not building yet
- 🚫 FORBIDDEN to generate any workflow files in this step
- 💬 Present the complete plan clearly and answer all questions
- 🚪 GET explicit approval before proceeding to build

## EXECUTION PROTOCOLS:

- 🎯 Present the complete workflow plan for review
- 💾 Update plan frontmatter with review status
- 📖 Only proceed to build step with explicit user approval
- 🚫 FORBIDDEN to skip review or proceed without consent

## CONTEXT BOUNDARIES:

- Requirements and design from previous steps are in the plan
- Focus ONLY on review and approval
- Don't modify the design significantly here
- This is the final checkpoint before file generation

## REVIEW REFERENCE MATERIALS:

When reviewing, you may load for comparison:

- Example workflow: `{project-root}/{bmad_folder}/bmb/reference/workflows/meal-prep-nutrition/workflow.md`
- Step examples from same workflow's steps folder
- Architecture guide: `{project-root}/{bmad_folder}/bmb/docs/workflows/architecture.md`

## PLAN REVIEW PROCESS:

### 1. Present the Complete Plan

Read the entire {workflowPlanFile} and present it to the user:

- Executive Summary
- Requirements Analysis
- Detailed Design
- Implementation Plan
- Target Location and file structure

### 2. Analyze Plan for Gaps and Issues

Perform systematic analysis of the loaded plan:

**Logical Flow Check:**

- Do requirements align with proposed solution?
- Are tools appropriate for the workflow type?
- Is step sequence logical and complete?
- Are there missing transitions between steps?

**Completeness Review:**

- All requirements captured and addressed?
- Design covers all user scenarios?
- Implementation plan includes all necessary files?
- Are there unclear or ambiguous specifications?

**Architecture Validation:**

- Follows BMAD step-file architecture?
- Proper use of template patterns?
- Menu flow is logical and complete?
- Variable naming is consistent?

**Issue Identification:**
If gaps or issues found:

- Clearly identify each issue
- Propose specific solutions
- Ask for user input on resolution approach

### 3. Present Menu for Plan Approval

Display: **Plan Review Complete - Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Build

### 4. Address Questions and Concerns

Ask for specific feedback:

- Does this plan fully address your requirements?
- Are there any missing aspects?
- Would you like any changes to the design?
- Are you satisfied with the proposed structure?

### 5. Confirm or Revise

Based on feedback:

- If approved: Proceed to build step
- If changes needed: Go back to design step with specific feedback
- If major revisions: Consider going back to requirements step

## REVIEW CHECKPOINTS:

### Requirements Coverage

- [ ] All user requirements addressed
- [ ] Success criteria defined
- [ ] Technical constraints considered
- [ ] User interaction level appropriate

### Design Quality

- [ ] Step flow is logical
- [ ] Instruction style chosen appropriately
- [ ] Menu systems designed properly
- [ ] Error handling included

### Implementation Feasibility

- [ ] File structure is clear
- [ ] Target location confirmed
- [ ] Templates identified correctly
- [ ] Dependencies documented

## PLAN APPROVAL:

### Explicit Confirmation Required

Before proceeding to build, get explicit confirmation:
"Based on this plan, I will generate:

- [List of files]
  in [target location]"

Ready to proceed when you are! Select your option below to build or modify the plan.

### 6. Present MENU OPTIONS

Display: **Review Complete - Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Build

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to build step with explicit 'C' selection AND approval
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: AND user has approved the plan, update plan frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected AND user has explicitly approved the plan, will you then update the plan frontmatter and load, read entire file, then execute {nextStepFile} to execute and begin workflow file generation step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complete plan presented clearly
- All user questions answered
- Feedback collected and documented
- Explicit approval received (or revisions planned)
- Plan ready for implementation

### ❌ SYSTEM FAILURE:

- Skipping the review presentation
- Proceeding without explicit approval
- Not answering user questions
- Rushing through the review process

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
