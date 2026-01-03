---
name: 'e-07-activation'
description: 'Review critical_actions and route to type-specific edit'

editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
criticalActions: ../data/critical-actions.md

# Type-specific edit routes
simpleEdit: './e-08a-edit-simple.md'
expertEdit: './e-08b-edit-expert.md'
moduleEdit: './e-08c-edit-module.md'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 7: Activation and Routing

## STEP GOAL:

Review critical_actions and route to the appropriate type-specific edit step (Simple/Expert/Module).

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Load criticalActions and editPlan first
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}}`

### Step-Specific Rules:

- 🎯 Load criticalActions.md before discussing activation
- 📊 Determine target type for routing
- 💬 Route based on POST-EDIT agent type

## EXECUTION PROTOCOLS:

- 🎯 Load criticalActions.md
- 📊 Check editPlan for target agent type
- 💾 Route to appropriate type-specific edit step
- ➡️ Auto-advance to type-specific edit on [C]

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Reference Documents

Read `{criticalActions}` and `{editPlan}` to understand:
- Current critical_actions (if any)
- Target agent type after edits

### 2. Review Critical Actions

If user wants to add/modify critical_actions:
- Reference patterns from criticalActions.md
- Define action name, description, invocation
- For Expert agents: specify sidecar-folder and file paths

### 3. Determine Routing

Check `{editPlan}` for agent metadata (module and hasSidecar):

```yaml
# Determine agent type from module + hasSidecar combination
module ≠ "stand-alone" → route to e-08c-edit-module.md
module = "stand-alone" + hasSidecar: true → route to e-08b-edit-expert.md
module = "stand-alone" + hasSidecar: false → route to e-08a-edit-simple.md
```

### 4. Document to Edit Plan

Append to `{editPlan}`:

```yaml
activationEdits:
  criticalActions:
    additions: []
    modifications: []
routing:
  destinationEdit: {e-08a|e-08b|e-08c}
  sourceType: {simple|expert|module}  # Derived from module + hasSidecar
```

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Type-Specific Edit"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Save to {editPlan}, determine routing based on module + hasSidecar, then only then load and execute the appropriate type-specific edit step
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

## CRITICAL STEP COMPLETION NOTE

This is the **ROUTING HUB** for edit flow. ONLY WHEN [C continue option] is selected and [routing determined], load and execute the appropriate type-specific edit step:

- module ≠ "stand-alone" → e-08c-edit-module.md (Module agent)
- module = "stand-alone" + hasSidecar: true → e-08b-edit-expert.md (Expert agent)
- module = "stand-alone" + hasSidecar: false → e-08a-edit-simple.md (Simple agent)

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- criticalActions.md loaded
- Routing determined based on target type
- Edit plan updated with routing info

### ❌ SYSTEM FAILURE:

- Proceeded without loading reference documents
- Routing not determined
- Wrong type-specific edit step selected

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
