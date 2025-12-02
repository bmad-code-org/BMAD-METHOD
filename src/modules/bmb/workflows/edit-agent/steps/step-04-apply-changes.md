---
name: 'step-04-apply-changes'
description: 'Apply approved changes to the agent'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/edit-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-04-apply-changes.md'
agentFile: '{{agent_path}}'
nextStepFile: '{workflow_path}/steps/step-05-validate.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Apply Changes

## STEP GOAL:

Apply all user-approved changes to the agent files directly using the Edit tool.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are an agent editor who helps users improve their BMAD agents through precise modifications
- ✅ If you already have a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring agent architecture expertise, user brings their agent and goals, together we improve the agent
- ✅ Maintain collaborative guiding tone throughout

### Step-Specific Rules:

- 🎯 Focus only on applying changes that were explicitly approved in step 3
- 🚫 FORBIDDEN to make any changes that were not approved by the user
- 💬 Approach: Apply changes one by one with confirmation after each
- 📋 Use Edit tool to make precise modifications to agent files

## EXECUTION PROTOCOLS:

- 🎯 Apply only changes that were explicitly approved in step 3
- 💾 Show confirmation after each change is applied
- 📖 Edit files directly using Edit tool with precise modifications
- 🚫 FORBIDDEN to make unapproved changes or extra modifications

## CONTEXT BOUNDARIES:

- Available context: Approved changes list from step 3, agent path from step 1
- Focus: Apply ONLY the approved changes, nothing more
- Limits: Do not make any modifications beyond what was explicitly approved
- Dependencies: Must have approved changes list from step 3

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load Agent File

Read the complete agent file to understand current state before making changes.

### 2. Apply First Approved Change

For each change approved in step 3, apply it systematically:

**For YAML changes in main agent file:**

- Use Edit tool to modify the agent YAML file at `{agentFile}`
- Make the exact approved modification
- Confirm the change was applied correctly

**For sidecar file changes (Expert agents):**

- Use Edit tool to modify the specific sidecar file
- Make the exact approved modification
- Confirm the change was applied correctly

### 3. Confirm Each Change Applied

After each change is applied:
"Applied change: {{description}}

- Updated section matches approved change ✓
- File saved successfully ✓"

### 4. Continue Until All Changes Applied

Repeat step 2-3 for each approved change until complete:

- Apply change using Edit tool
- Confirm it matches what was approved
- Move to next approved change

### 5. Verify All Changes Complete

"Summary of changes applied:

- {{number}} changes applied successfully
- All modifications match user approvals from step 3
- Agent files updated and saved"

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save completion status to context, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [all approved changes from step 3 have been applied to agent files], will you then load and read fully `{nextStepFile}` to execute and begin validation of applied changes.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All approved changes from step 3 applied using Edit tool
- Each modification matches exactly what was approved by user
- Agent files updated and saved correctly
- Confirmation provided for each applied change
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Making changes that were not approved in step 3
- Using tools other than Edit tool for file modifications
- Not confirming each change was applied correctly
- Making extra modifications beyond approved changes
- Skipping confirmation steps or verification

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
