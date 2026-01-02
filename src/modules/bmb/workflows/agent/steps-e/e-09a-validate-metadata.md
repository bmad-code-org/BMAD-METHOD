---
name: 'e-09a-validate-metadata'
description: 'Validate metadata (after edit) - no menu, auto-advance'

nextStepFile: './e-09b-validate-persona.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
agentMetadata: ../data/agent-metadata.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 9a: Validate Metadata (After Edit)

## STEP GOAL

Validate that the agent's metadata properties (id, name, title, icon, module, hasSidecar, etc.) are properly formatted, complete, and follow BMAD standards as defined in agentMetadata.md. Record findings to editPlan and auto-advance.

## MANDATORY EXECUTION RULES

- **NEVER skip validation checks** - All metadata fields must be verified
- **ALWAYS load both reference documents** - agentMetadata.md AND the builtYaml
- **ALWAYS use absolute paths** when referencing files
- **CRITICAL:** Load and validate EVERYTHING specified in the agentMetadata.md file
- **🚫 NO MENU in this step** - record findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS

### Protocol 1: Load and Compare
1. Read the metadata validation reference from `{agentMetadata}`
2. Read the built agent YAML from `{builtYaml}`
3. Read the edit plan from `{editPlan}`
4. Extract the metadata section from the builtYaml
5. Compare actual metadata against ALL validation rules in agentMetadata.md

### Protocol 2: Validation Checks

Perform these checks systematically - validate EVERY rule specified in agentMetadata.md:

1. **Required Fields Existence**
   - [ ] id: Present and non-empty
   - [ ] name: Present and non-empty (display name)
   - [ ] title: Present and non-empty
   - [ ] icon: Present (emoji or symbol)
   - [ ] module: Present and valid format
   - [ ] hasSidecar: Present (boolean, if applicable)

2. **Format Validation**
   - [ ] id: Uses kebab-case, no spaces, unique identifier
   - [ ] name: Clear display name for UI
   - [ ] title: Concise functional description
   - [ ] icon: Appropriate emoji or unicode symbol
   - [ ] module: Either a 3-4 letter module code (e.g., 'bmm', 'bmb') OR 'stand-alone'
   - [ ] hasSidecar: Boolean value, matches actual agent structure

3. **Content Quality**
   - [ ] id: Unique and descriptive
   - [ ] name: Clear and user-friendly
   - [ ] title: Accurately describes agent's function
   - [ ] icon: Visually representative of agent's purpose
   - [ ] module: Correctly identifies module membership
   - [ ] hasSidecar: Correctly indicates if agent uses sidecar files

4. **Agent Type Consistency**
   - [ ] If hasSidecar: true, sidecar folder path must be specified
   - [ ] If module is a module code, agent is a module agent
   - [ ] If module is 'stand-alone', agent is not part of a module
   - [ ] No conflicting type indicators

5. **Standards Compliance**
   - [ ] No prohibited characters in fields
   - [ ] No redundant or conflicting information
   - [ ] Consistent formatting with other agents
   - [ ] All required BMAD metadata fields present

### Protocol 3: Record Findings

Organize findings into three sections and append to editPlan frontmatter under `validationAfter.metadata`:

```yaml
validationAfter:
  metadata:
    status: [pass|fail|warning]
    passing:
      - "{check description}"
      - "{check description}"
    warnings:
      - "{non-blocking issue}"
    failures:
      - "{blocking issue that must be fixed}"
```

**PASSING CHECKS** (List what passed)
```
✓ All required fields present
✓ id follows kebab-case convention
✓ module value is valid
```

**WARNINGS** (Non-blocking issues)
```
⚠ Description is brief
⚠ Only 2 tags provided, 3-7 recommended
```

**FAILURES** (Blocking issues that must be fixed)
```
✗ id field is empty
✗ module value is invalid
✗ hasSidecar is true but no sidecar-folder specified
```

### Protocol 4: Auto-Advance

**🚫 NO MENU PRESENTED** - After recording findings, immediately load and execute `{nextStepFile}`

---

**Auto-advancing to persona validation...**

## SUCCESS METRICS

✅ All metadata checks from agentMetadata.md performed
✅ All checks validated against the actual builtYaml
✅ Findings saved to editPlan with detailed status
✅ Auto-advanced to next step
