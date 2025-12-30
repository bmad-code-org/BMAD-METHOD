---
name: 'e-03f-validation-summary'
description: 'Display all validation findings before edit'

nextStepFile: './e-04-type-metadata.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 3f: Validation Summary (Before Edit)

## STEP GOAL:

Display all validation findings from the previous 5 validation steps to the user. Present findings clearly and await confirmation to proceed.

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Read editPlan to collect all validation findings
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Display all validation findings clearly organized
- 📊 Aggregate findings from all 5 validation steps
- 💬 Present options for handling any issues found

## EXECUTION PROTOCOLS:

- 🎯 Read editPlan to get validation findings
- 📊 Display organized summary
- 💾 Allow user to decide how to proceed
- ➡️ Proceed to edit plan on [C]

## Sequence of Instructions:

### 1. Load Validation Findings

Read `{editPlan}` frontmatter to collect:
- validationBefore.metadata.status and findings
- validationBefore.persona.status and findings
- validationBefore.menu.status and findings
- validationBefore.structure.status and findings
- validationBefore.sidecar.status and findings

### 2. Display Validation Summary

```markdown
## Pre-Edit Validation Report for {agent-name}

### Metadata Validation
**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL}
{Findings summary}

### Persona Validation
**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL}
{Findings summary}

### Menu Validation
**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL}
{Findings summary}

### Structure Validation
**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL}
{Findings summary}

### Sidecar Validation
**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL / N/A}
{Findings summary}
```

### 3. Present Options

"How would you like to proceed?

**[I**ntegrate fixes**] - Add validation fixes to your edit plan
**[S]kip** - Proceed with your planned edits only
**[A]dvanced** - Deeper exploration of any issues"

### 4. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Edit Plan"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF I: Add validation fixes to editPlan, then redisplay menu
- IF C: Save validation summary to {editPlan}, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#4-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation summary displayed], will you then load and read fully `{nextStepFile}` to execute and begin edit planning.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All validation findings displayed clearly
- User given options for handling issues
- Validation summary saved to editPlan

### ❌ SYSTEM FAILURE:

- Findings not displayed to user
- Proceeding without user acknowledgment

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
