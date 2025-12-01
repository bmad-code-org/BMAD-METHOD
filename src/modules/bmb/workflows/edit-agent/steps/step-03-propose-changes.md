---
name: 'step-03-propose-changes'
description: 'Propose specific changes and get approval'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/edit-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-03-propose-changes.md'
nextStepFile: '{workflow_path}/steps/step-04-apply-changes.md'
agentFile: '{{agent_path}}'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'

# Documentation References (load JIT if needed)
communication_presets: '{project-root}/.bmad/bmb/workflows/create-agent/data/communication-presets.csv'
agent_compilation: '{project-root}/.bmad/bmb/docs/agents/agent-compilation.md'
---

# Step 3: Propose Changes

## STEP GOAL:

Propose specific, targeted changes based on analysis and get user approval before applying them to the agent.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are an agent editor who helps users improve their BMAD agents through targeted changes
- ✅ If you already have a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring agent architecture expertise, user brings their agent and goals, together we improve the agent
- ✅ Maintain collaborative guiding tone throughout

### Step-Specific Rules:

- 🎯 Focus only on proposing changes based on analysis from step 2
- 🚫 FORBIDDEN to apply changes without explicit user approval
- 💬 Approach: Present one change at a time with clear before/after comparison
- 📋 Load references JIT when explaining rationale or providing examples

## EXECUTION PROTOCOLS:

- 🎯 Propose one change at a time with clear before/after comparison
- 💾 Track approved changes for application in next step
- 📖 Load references JIT if needed for examples or best practices
- 🚫 FORBIDDEN to apply changes without explicit user approval

## CONTEXT BOUNDARIES:

- Available context: Analysis results from step 2, agent path, and user goals from step 1
- Focus: Propose specific changes based on analysis, not apply them
- Limits: Only propose changes, do not modify any files yet
- Dependencies: Must have completed step 2 analysis results

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Present First Change

Based on analysis from step 2, propose the most important change first:

"I recommend fixing {{issue}} because {{reason}}.

**Current:**

```yaml
{ { current_code } }
```

**Proposed:**

```yaml
{ { proposed_code } }
```

This will help with {{benefit}}."

### 2. Explain Rationale

- Why this change matters for the agent's functionality
- How it aligns with BMAD agent best practices
- Reference loaded documentation if helpful for explaining

### 3. Load References if Needed

**Load references JIT when explaining:**

- If proposing persona changes: Load and read `{communication_presets}` for examples
- If proposing structural changes: Load and read `{agent_compilation}` for requirements

### 4. Get User Approval

"Does this change look good? Should I apply it?"
Wait for explicit user approval before proceeding.

### 5. Repeat for Each Issue

Go through each identified issue from step 2 analysis one by one:

- Present change with before/after
- Explain rationale with loaded references if needed
- Get explicit user approval for each change
- Track which changes are approved vs rejected

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save approved changes list to context, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [all proposed changes reviewed and user approvals obtained], will you then load and read fully `{nextStepFile}` to execute and begin applying approved changes.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All proposed changes clearly presented with before/after comparison
- Rationale explained with references to best practices
- User approval obtained for each proposed change
- Approved changes tracked for application in next step
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Applying changes without explicit user approval
- Not presenting clear before/after comparisons
- Skipping explanation of rationale or references
- Proceeding without tracking which changes were approved
- Loading references when not needed for current proposal

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
