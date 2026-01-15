---
name: 'e-04-type-metadata'
description: 'Review and plan metadata edits'

nextStepFile: './e-05-persona.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
agentMetadata: ../data/agent-metadata.md
agentTypesDoc: ../data/understanding-agent-types.md

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 4: Type and Metadata

## STEP GOAL:

Review the agent's type and metadata, and plan any changes. If edits involve type conversion, identify the implications.

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Load agentMetadata and agentTypesDoc first
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Load reference documents before discussing edits
- 📊 Document type conversion requirements if applicable
- 💬 Focus on metadata that user wants to change

## EXECUTION PROTOCOLS:

- 🎯 Load agentMetadata.md and agentTypesDoc.md
- 📊 Review current metadata from editPlan
- 💾 Document planned metadata changes
- 🚫 FORBIDDEN to proceed without documenting changes

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Reference Documents

Read `{agentMetadata}` and `{agentTypesDoc}` to understand validation rules and type implications.

### 2. Review Current Metadata

From `{editPlan}`, display current:
- agentType (simple/expert/module)
- All metadata fields: id, name, title, icon, module, hasSidecar

### 3. Discuss Metadata Edits

If user wants metadata changes:

**For type conversion:**
- "Converting from {current} to {target}"
- Explain implications (e.g., Simple → Expert requires sidecar)
- Update editPlan with type conversion

**For metadata field changes:**
- id: kebab-case requirements
- name: display name conventions
- title: function description format
- icon: emoji/symbol
- module: path format
- hasSidecar: boolean implications

### 4. Document to Edit Plan

Append to `{editPlan}`:

```yaml
metadataEdits:
  typeConversion:
    from: {current-type}
    to: {target-type}
    rationale: {explanation}
  fieldChanges:
    - field: {field-name}
      from: {current-value}
      to: {target-value}
```

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Persona"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Save to {editPlan}, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [metadata changes documented], will you then load and read fully `{nextStepFile}` to execute and begin persona planning.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Reference documents loaded
- Metadata changes discussed and documented
- Type conversion implications understood
- Edit plan updated

### ❌ SYSTEM FAILURE:

- Proceeded without loading reference documents
- Type conversion without understanding implications
- Changes not documented to edit plan

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
