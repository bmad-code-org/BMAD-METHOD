---
name: 'step-03-improve'
description: 'Facilitate collaborative improvements to the workflow'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/workflows/edit-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-03-improve.md'
nextStepFile: '{workflow_path}/steps/step-04-validate.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/workflow-edit-{target_workflow_name}.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'

# Template References
improvementLogTemplate: '{workflow_path}/templates/improvement-log.md'
---

# Step 3: Collaborative Improvement

## STEP GOAL:

To facilitate collaborative improvements to the workflow, working iteratively on each identified issue.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow editor and improvement specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You guide improvements with explanations and options
- ✅ User makes decisions and approves changes

### Step-Specific Rules:

- 🎯 Work on ONE improvement at a time
- 🚫 FORBIDDEN to make changes without user approval
- 💬 Explain the rationale for each proposed change
- 🚪 ITERATE: improve, review, refine

## EXECUTION PROTOCOLS:

- 🎯 Facilitate improvements collaboratively and iteratively
- 💾 Document all changes in improvement log
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' and improvements are complete

## CONTEXT BOUNDARIES:

- Analysis and goals from previous steps guide improvements
- Load workflow creation documentation as needed
- Focus on improvements prioritized in step 2
- This is about collaborative implementation, not solo editing

## IMPROVEMENT PROCESS:

### 1. Load Reference Materials

Load documentation as needed for specific improvements:

- `{project-root}/.bmad/bmb/docs/workflows/templates/step-template.md`
- `{project-root}/.bmad/bmb/docs/workflows/templates/workflow-template.md`
- `{project-root}/.bmad/bmb/docs/workflows/architecture.md`

### 2. Address Each Improvement Iteratively

For each prioritized improvement:

#### A. Explain Current State

Show the relevant section:
"Here's how this step currently works:
[Display current content]

This can cause {{problem}} because {{reason}}."

#### B. Propose Improvement

Suggest specific changes:
"Based on best practices, we could:
{{proposedSolution}}

This would help users by {{benefit}}."

#### C. Collaborate on Approach

Ask for input:
"Does this approach address your need?"
"Would you like to modify this suggestion?"
"What concerns do you have about this change?"

#### D. Get Explicit Approval

"Should I apply this change?"

#### E. Apply and Show Result

Make the change and display:
"Here's the updated version:
[Display new content]

Does this look right to you?"

### 3. Common Improvement Patterns

#### Step Flow Improvements

- Merge redundant steps
- Split complex steps
- Reorder for better flow
- Add missing transitions

#### Instruction Style Refinement

Load step-template.md for reference:

- Convert prescriptive to intent-based for discovery steps
- Add structure to vague instructions
- Balance guidance with autonomy

#### Variable Consistency Fixes

- Identify all variable references
- Ensure consistent naming (snake_case)
- Verify variables are defined in workflow.md
- Update all occurrences

#### Menu System Updates

- Standardize menu patterns
- Ensure proper A/P/C options
- Fix menu handling logic
- Add Advanced Elicitation where useful

#### Frontmatter Compliance

- Add required fields to workflow.md
- Ensure proper path variables
- Include web_bundle configuration if needed
- Remove unused fields

#### Template Updates

- Align template variables with step outputs
- Improve variable naming
- Add missing template sections
- Test variable substitution

### 4. Track All Changes

For each improvement made, document:

- What was changed
- Why it was changed
- Files modified
- User approval

## CONTENT TO APPEND TO DOCUMENT:

After each improvement iteration, append to {outputFile}:

Load and append content from {improvementLogTemplate}

### 5. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save improvement log to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all prioritized improvements are complete and documented, will you then load, read entire file, then execute {nextStepFile} to execute and begin validation step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All prioritized improvements addressed
- User approved each change
- Changes documented clearly
- Workflow follows best practices
- Improvement log updated

### ❌ SYSTEM FAILURE:

- Making changes without user approval
- Not documenting changes
- Skipping prioritized improvements
- Breaking workflow functionality

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
