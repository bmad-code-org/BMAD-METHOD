---
name: 'step-07d-menu-validation'
description: 'Validate menu items and patterns'

# File References
nextStepFile: './step-08e-structure-validation.md'
agentMenuPatterns: ../data/agent-menu-patterns.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL

Validate that the agent's menu (commands/tools) follows BMAD patterns, is well-structured, properly documented, and aligns with the agent's persona and purpose.

## MANDATORY EXECUTION RULES

- **NEVER skip validation checks** - All menu items must be verified
- **ALWAYS load the reference document** - agentMenuPatterns.md
- **NEVER modify files without user approval** - Report findings first, await menu selection
- **ALWAYS use absolute paths** when referencing files
- **CRITICAL:** This is a validation step, not an editing step

## EXECUTION PROTOCOLS

### Protocol 1: Load and Compare
1. Read the menu patterns reference from `{agentMenuPatterns}`
2. Read the built agent YAML from `{builtYaml}`
3. Extract the menu/commands section from the builtYaml
4. Compare actual menu against validation rules

### Protocol 2: Validation Checks
Perform these checks systematically:

1. **Menu Structure**
   - [ ] Menu section exists and is properly formatted
   - [ ] At least one menu item defined (unless intentionally tool-less)
   - [ ] Menu items follow proper YAML structure
   - [ ] Each item has required fields (name, description, pattern)

2. **Menu Item Requirements**
   For each menu item:
   - [ ] name: Present, unique, uses kebab-case
   - [ ] description: Clear and concise
   - [ ] pattern: Valid regex pattern or tool reference
   - [ ] scope: Appropriate scope defined (if applicable)

3. **Pattern Quality**
   - [ ] Patterns are valid and testable
   - [ ] Patterns are specific enough to match intended inputs
   - [ ] Patterns are not overly restrictive
   - [ ] Patterns use appropriate regex syntax

4. **Description Quality**
   - [ ] Each item has clear description
   - [ ] Descriptions explain what the item does
   - [ ] Descriptions are consistent in style
   - [ ] Descriptions help users understand when to use

5. **Alignment Checks**
   - [ ] Menu items align with agent's role/purpose
   - [ ] Menu items are supported by agent's expertise
   - [ ] Menu items fit within agent's constraints
   - [ ] Menu items are appropriate for target users

6. **Completeness**
   - [ ] Core capabilities for this role are covered
   - [ ] No obvious missing functionality
   - [ ] Menu scope is appropriate (not too sparse/overloaded)
   - [ ] Related functionality is grouped logically

7. **Standards Compliance**
   - [ ] No prohibited patterns or commands
   - [ ] No security vulnerabilities in patterns
   - [ ] No ambiguous or conflicting items
   - [ ] Consistent naming conventions

### Protocol 3: Report Findings
Organize your report into three sections:

**PASSING CHECKS** (List what passed)
```
✓ Menu structure properly formatted
✓ 5 menu items defined, all with required fields
✓ All patterns are valid regex
✓ Menu items align with agent role
```

**WARNINGS** (Non-blocking issues)
```
⚠ Item "analyze-data" description is vague
⚠ No menu item for [common capability X]
⚠ Pattern for "custom-command" very broad, may over-match
```

**FAILURES** (Blocking issues that must be fixed)
```
✗ Duplicate menu item name: "process" appears twice
✗ Invalid regex pattern: "[unclosed bracket"
✗ Menu item "system-admin" violates security guidelines
✗ No menu items defined for agent type that requires tools
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
- Menu/commands section of agent.yaml
- Referencing agentMenuPatterns.md
- Menu structure, patterns, and alignment
- Individual menu item validation

**OUT OF SCOPE:**
- Metadata fields (handled in step-07b)
- Persona fields (handled in step-07c)
- System architecture (handled in step-07e)
- Workflow/capability implementation (handled in step-07f)

**DO NOT:**
- Validate metadata or persona in this step
- Suggest entirely new capabilities (that's for earlier steps)
- Question whether menu items are "good enough" qualitatively beyond standards
- Modify fields beyond menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation complete with any findings addressed], will you then load and read fully `{nextStepFile}` to execute and begin [structure validation].

## SUCCESS METRICS

✓ **Complete Success:** All checks pass, menu is well-structured and aligned
✓ **Partial Success:** Failures fixed via [F] option, warnings acknowledged
✓ **Failure:** Blocking failures remain when user selects [C]

**CRITICAL:** Invalid regex patterns or security vulnerabilities in menu items are blocking issues.
