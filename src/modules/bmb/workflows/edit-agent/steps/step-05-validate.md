---
name: 'step-05-validate'
description: 'Validate that changes work correctly'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/edit-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-05-validate.md'
agentFile: '{{agent_path}}'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'

# Documentation References (load JIT)
validation: '{project-root}/.bmad/bmb/workflows/create-agent/data/agent-validation-checklist.md'
agent_compilation: '{project-root}/.bmad/bmb/docs/agents/agent-compilation.md'
---

# Step 5: Validate Changes

## STEP GOAL:

Validate that the applied changes work correctly and the edited agent follows BMAD best practices and standards.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are an agent editor who helps users ensure their edited BMAD agents meet quality standards
- ✅ If you already have a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring agent architecture expertise, user brings their agent and goals, together we ensure quality
- ✅ Maintain collaborative guiding tone throughout

### Step-Specific Rules:

- 🎯 Focus only on validating changes that were applied in step 4
- 🚫 FORBIDDEN to make additional changes during validation
- 💬 Approach: Systematic validation using standard checklist
- 📋 Load validation references JIT when needed for specific checks

## EXECUTION PROTOCOLS:

- 🎯 Validate only the changes that were applied in step 4
- 💾 Report validation results clearly and systematically
- 📖 Load validation checklist and standards JIT as needed
- 🚫 FORBIDDEN to make additional modifications during validation

## CONTEXT BOUNDARIES:

- Available context: Applied changes from step 4, agent path from step 1, original goals from step 1
- Focus: Validate that applied changes work and meet standards
- Limits: Do not modify anything, only validate and report
- Dependencies: Must have completed step 4 with applied changes

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load and Read Validation Standards

Load and read fully: `{validation}`

### 2. Load Updated Agent File

Read the updated agent file to see all applied changes in context.

### 3. Check Each Applied Change

Verify each change that was applied in step 4:

- "Checking {{change}}... ✓ Works correctly"
- "Validating {{modification}}... ✓ Follows best practices"

### 4. Run Standard Validation Checklist

Check key items from validation checklist:

- YAML syntax is valid and properly formatted
- Persona fields are properly separated (if persona was changed)
- All references and paths resolve correctly (if references were fixed)
- Menu structure follows BMAD patterns (if menu was modified)
- Agent compilation requirements are met (if structure changed)

### 5. Load Agent Compilation if Needed

If persona or agent structure was changed:

- Load and read fully: `{agent_compilation}`
- Verify persona fields follow compilation requirements
- Check that agent structure meets BMAD standards

### 6. Report Validation Results

"Validation results:
✓ All {{number}} changes applied correctly
✓ Agent meets BMAD standards and best practices
✓ No issues found in modified sections
✓ Ready for use"

### 7. Present MENU OPTIONS

Display: "**Select an Option:** [A] Edit Another Agent [P] Party Mode [C] Complete"

#### Menu Handling Logic:

- IF A: Start fresh workflow with new agent path
- IF P: Execute {partyModeWorkflow} to celebrate successful agent editing
- IF C: Complete workflow and provide final success message
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed when user selects 'A', 'P', or 'C'
- After party mode execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C complete option] is selected and [all changes from step 4 have been validated successfully], will you then provide a final workflow completion message. The agent editing workflow is complete.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All applied changes from step 4 validated successfully
- Agent meets BMAD standards and best practices
- Validation checklist completed with no critical issues
- Clear validation report provided to user
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Not validating all applied changes from step 4
- Making modifications during validation step
- Skipping validation checklist or standards checks
- Not reporting validation results clearly
- Not loading references when needed for specific validation

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
