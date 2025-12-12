---
name: 'step-04-plan-review'
description: 'Review complete workflow plan (requirements + tools) and get user approval before design'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-04-plan-review.md'
nextStepFormDesign: '{workflow_path}/steps/step-05-output-format-design.md'
nextStepDesign: '{workflow_path}/steps/step-06-design.md'

targetWorkflowPath: '{custom_stand_alone_location}/workflows/{new_workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
# Template References
# No template needed - will append review summary directly to workflow plan
---

# Step 4: Plan Review and Approval

## STEP GOAL:

To present the complete workflow plan (requirements and tools configuration) for user review and approval before proceeding to design.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and systems designer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in workflow design review and quality assurance
- ✅ User brings their specific requirements and approval authority

### Step-Specific Rules:

- 🎯 Focus ONLY on reviewing and refining the plan
- 🚫 FORBIDDEN to start designing workflow steps in this step
- 💬 Present plan clearly and solicit feedback
- 🚫 DO NOT proceed to design without user approval

## EXECUTION PROTOCOLS:

- 🎯 Present complete plan summary from {workflowPlanFile}
- 💾 Capture any modifications or refinements
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step
- 🚫 FORBIDDEN to load next step until user approves plan

## CONTEXT BOUNDARIES:

- All requirements from step 2 are available
- Tools configuration from step 3 is complete
- Focus ONLY on review and approval
- This is the final check before design phase

## PLAN REVIEW PROCESS:

### 1. Initialize Plan Review

"**Workflow Plan Review**

We've gathered all requirements and configured tools for your workflow. Let's review the complete plan to ensure it meets your needs before we start designing the workflow structure."

### 2. Present Complete Plan Summary

Load and present from {workflowPlanFile}:

"**Complete Workflow Plan: {new_workflow_name}**

**1. Project Overview:**

- [Present workflow purpose, user type, module from plan]

**2. Workflow Requirements:**

- [Present all gathered requirements]

**3. Tools Configuration:**

- [Present selected tools and integration points]

**4. Technical Specifications:**

- [Present technical constraints and requirements]

**5. Success Criteria:**

- [Present success metrics from requirements]"

### 3. Detailed Review by Category

"**Detailed Review:**

**A. Workflow Scope and Purpose**

- Is the workflow goal clearly defined?
- Are the boundaries appropriate?
- Any missing requirements?

**B. User Interaction Design**

- Does the interaction style match your needs?
- Are collaboration points clear?
- Any adjustments needed?

**C. Tools Integration**

- Are selected tools appropriate for your workflow?
- Are integration points logical?
- Any additional tools needed?

**D. Technical Feasibility**

- Are all requirements achievable?
- Any technical constraints missing?
- Installation requirements acceptable?"

### 4. Collect Feedback and Refinements

"**Review Feedback:**

Please review each section and provide feedback:

1. What looks good and should stay as-is?
2. What needs modification or refinement?
3. What's missing that should be added?
4. Anything unclear or confusing?"

For each feedback item:

- Document the requested change
- Discuss implications on workflow design
- Confirm the refinement with user

### 5. Update Plan with Refinements

Update {workflowPlanFile} with any approved changes:

- Modify requirements section as needed
- Update tools configuration if changed
- Add any missing specifications
- Ensure all changes are clearly documented

### 6. Output Document Check

"**Output Document Check:**

Before we proceed to design, does your workflow produce any output documents or files?

Based on your requirements:

- [Analyze if workflow produces documents/files]
- Consider: Does it create reports, forms, stories, or any persistent output?"

**If NO:**
"Great! Your workflow focuses on actions/interactions without document output. We'll proceed directly to designing the workflow steps."

**If YES:**
"Perfect! Let's design your output format to ensure your workflow produces exactly what you need."

### 7. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Design

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Check if workflow produces documents:
  - If YES: Update frontmatter, then load nextStepFormDesign
  - If NO: Update frontmatter, then load nextStepDesign
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected AND the user has explicitly approved the plan and the plan document is updated as needed, then you load either {nextStepFormDesign} or {nextStepDesign}

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complete plan presented clearly from {workflowPlanFile}
- User feedback collected and documented
- All refinements incorporated
- User explicitly approves the plan
- Plan ready for design phase

### ❌ SYSTEM FAILURE:

- Not loading plan from {workflowPlanFile}
- Skipping review categories
- Proceeding without user approval
- Not documenting refinements

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
