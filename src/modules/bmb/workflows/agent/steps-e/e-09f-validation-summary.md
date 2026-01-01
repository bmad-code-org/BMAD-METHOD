---
name: 'e-09f-validation-summary'
description: 'Display all validation findings after edit'

nextStepFile: './e-10-celebrate.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 9f: Validation Summary (After Edit)

## STEP GOAL:

Display all post-edit validation findings and compare with pre-edit state. Present findings and await confirmation to proceed to celebration.

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Read editPlan to collect all validation findings
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Display all validation findings clearly organized
- 📊 Compare before/after states
- 💬 Present options for handling any remaining issues

## EXECUTION PROTOCOLS:

- 🎯 Read editPlan to get validation findings
- 📊 Display organized summary with before/after comparison
- 💾 Allow user to decide how to proceed

## Sequence of Instructions:

### 1. Load Validation Findings

Read `{editPlan}` frontmatter to collect validationBefore and validationAfter findings.

### 2. Display Validation Summary

```markdown
## Post-Edit Validation Report for {agent-name}

### Before vs After Comparison

| Component | Before | After | Status |
|-----------|--------|-------|--------|
| Metadata | {status} | {status} | {Δ} |
| Persona | {status} | {status} | {Δ} |
| Menu | {status} | {status} | {Δ} |
| Structure | {status} | {status} | {Δ} |
| Sidecar | {status} | {status} | {Δ} |

### Detailed Findings (After Edit)

**Metadata:** {summary}
**Persona:** {summary}
**Menu:** {summary}
**Structure:** {summary}
**Sidecar:** {summary}
```

### 3. Present Options

"How do the edits look?

**[R]eview** - Show detailed before/after for any component
**[F]ix** - Address any remaining issues
**[A]ccept** - Proceed to celebration"

### 4. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Celebration"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF R: Show detailed before/after comparison, then redisplay menu
- IF C: Save validation summary to {editPlan}, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#4-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation summary displayed], will you then load and read fully `{nextStepFile}` to execute and celebrate completion.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All validation findings displayed clearly
- Before/after comparison shown
- User given options for handling issues

### ❌ SYSTEM FAILURE:

- Findings not displayed to user
- Proceeding without user acknowledgment

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
