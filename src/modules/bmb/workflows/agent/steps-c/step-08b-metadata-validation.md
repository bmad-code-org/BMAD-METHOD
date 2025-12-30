---
name: 'step-07b-metadata-validation'
description: 'Validate agent metadata properties'

# File References
nextStepFile: './step-08c-persona-validation.md'
agentMetadata: ../data/agent-metadata.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL

Validate that the agent's metadata properties (name, description, version, tags, category, etc.) are properly formatted, complete, and follow BMAD standards.

## MANDATORY EXECUTION RULES

- **NEVER skip validation checks** - All metadata fields must be verified
- **ALWAYS load both reference documents** - agentMetadata.md AND the builtYaml
- **NEVER modify files without user approval** - Report findings first, await menu selection
- **ALWAYS use absolute paths** when referencing files
- **CRITICAL:** This is a validation step, not an editing step

## EXECUTION PROTOCOLS

### Protocol 1: Load and Compare
1. Read the metadata validation reference from `{agentMetadata}`
2. Read the built agent YAML from `{builtYaml}`
3. Extract the metadata section from the builtYaml
4. Compare actual metadata against validation rules

### Protocol 2: Validation Checks
Perform these checks systematically:

1. **Required Fields Existence**
   - [ ] name: Present and non-empty
   - [ ] description: Present and non-empty
   - [ ] version: Present and follows semantic versioning (X.Y.Z)
   - [ ] category: Present and matches valid category
   - [ ] tags: Present as array, not empty

2. **Format Validation**
   - [ ] name: Uses kebab-case, no spaces
   - [ ] description: 50-200 characters (unless intentionally brief)
   - [ ] version: Follows semver pattern (e.g., 1.0.0)
   - [ ] tags: Array of lowercase strings with hyphens
   - [ ] category: Matches one of the allowed categories

3. **Content Quality**
   - [ ] description: Clear and concise, explains what the agent does
   - [ ] tags: Relevant to agent's purpose (3-7 tags recommended)
   - [ ] category: Most appropriate classification

4. **Standards Compliance**
   - [ ] No prohibited characters in fields
   - [ ] No redundant or conflicting information
   - [ ] Consistent formatting with other agents

### Protocol 3: Report Findings
Organize your report into three sections:

**PASSING CHECKS** (List what passed)
```
✓ Required fields present
✓ Version format valid (1.0.0)
✓ Name follows kebab-case convention
```

**WARNINGS** (Non-blocking issues)
```
⚠ Description is brief (45 chars, recommended 50-200)
⚠ Only 2 tags provided, 3-7 recommended
```

**FAILURES** (Blocking issues that must be fixed)
```
✗ Missing required field: version
✗ Invalid version format: "v1.0" (should be "1.0.0")
✗ Category "custom-type" not in allowed list
```

### Protocol 4: Menu System

#### 5. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [F] Fix Findings [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF F: Apply auto-fixes to {builtYaml} for identified issues, then redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Proceed to next validation step, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CONTEXT BOUNDARIES

**IN SCOPE:**
- Metadata section of agent.yaml (name, description, version, tags, category, author, license, etc.)
- Referencing the agentMetadata.md validation rules
- Comparing against BMAD standards

**OUT OF SCOPE:**
- Persona fields (handled in step-07c)
- Menu items (handled in step-07d)
- System architecture (handled in step-07e)
- Capability implementation (handled in step-07f)

**DO NOT:**
- Validate persona properties in this step
- Suggest major feature additions
- Question the agent's core purpose
- Modify fields beyond metadata

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation complete with any findings addressed], will you then load and read fully `{nextStepFile}` to execute and begin [persona validation].

## SUCCESS METRICS

✓ **Complete Success:** All checks pass, no failures, warnings are optional
✓ **Partial Success:** Failures fixed via [F] option, warnings acknowledged
✓ **Failure:** Blocking failures remain when user selects [C]

**CRITICAL:** Never proceed to next step if blocking failures exist and user hasn't acknowledged them.
