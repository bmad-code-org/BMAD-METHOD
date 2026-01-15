---
name: 'step-07a-build-simple'
description: 'Generate Simple agent YAML from plan'

# File References
nextStepFile: './step-08-celebrate.md'
agentPlan: '{bmb_creations_output_folder}/agent-plan-{agent_name}.md'
agentBuildOutput: '{bmb_creations_output_folder}/{agent-name}.agent.yaml'

# Template and Architecture
simpleTemplate: ../templates/simple-agent.template.md
simpleArch: ../data/simple-agent-architecture.md
agentCompilation: ../data/agent-compilation.md

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL

Assemble the agent plan content into a Simple agent YAML configuration using the template, producing a complete agent definition ready for validation.

## MANDATORY EXECUTION RULES

- **MUST** read all referenced files before beginning assembly
- **MUST** use exact YAML structure from template
- **MUST** preserve all plan content without modification
- **MUST** maintain proper YAML indentation and formatting
- **MUST NOT** deviate from template structure
- **MUST** write output before asking validation question
- **MUST** present validation choice clearly

## EXECUTION PROTOCOLS

### File Loading Sequence
1. Read `simpleTemplate` - provides the YAML structure
2. Read `simpleArch` - defines Simple agent architecture rules
3. Read `agentCompilation` - provides assembly guidelines
4. Read `agentPlan` - contains structured content from steps 2-5

### YAML Assembly Process
1. Parse template structure
2. Extract content sections from agentPlan YAML
3. Map plan content to template fields
4. Validate YAML syntax before writing
5. Write complete agent YAML to output path

## CONTEXT BOUNDARIES

**INCLUDE:**
- Template structure exactly as provided
- All agent metadata from agentPlan
- Persona, commands, and rules from plan
- Configuration options specified

**EXCLUDE:**
- Any content not in agentPlan
- Sidecar file references (Simple agents don't use them)
- Template placeholders (replace with actual content)
- Comments or notes in final YAML

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Template and Architecture Files

Read the following files in order:
- `simpleTemplate` - YAML structure template
- `simpleArch` - Simple agent architecture definition
- `agentCompilation` - Assembly instructions

**Verify:** All files loaded successfully.

### 2. Load Agent Plan

Read `agentPlan` which contains structured YAML from steps 2-5:
- Step 2: Discovery findings
- Step 3: Persona development
- Step 4: Command structure
- Step 5: Agent naming

**Verify:** Plan contains all required sections.

### 3. Assemble YAML Using Template

Execute the following assembly process:

1. **Parse Template Structure**
   - Identify all YAML fields
   - Note required vs optional fields
   - Map field types and formats

2. **Extract Plan Content**
   - Read agent metadata
   - Extract persona definition
   - Retrieve command specifications
   - Gather rules and constraints

3. **Map Content to Template**
   - Replace template placeholders with plan content
   - Maintain exact YAML structure
   - Preserve indentation and formatting
   - Validate field types and values

4. **Validate YAML Syntax**
   - Check proper indentation
   - Verify quote usage
   - Ensure list formatting
   - Confirm no syntax errors

**Verify:** YAML is valid, complete, and follows template structure.

### 4. Write Agent Build Output

Write the assembled YAML to `agentBuildOutput`:
- Use exact output path from variable
- Include all content without truncation
- Maintain YAML formatting
- Confirm write operation succeeded

**Verify:** File written successfully and contains complete YAML.

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Write agent YAML to {agentBuildOutput}/{agent-name}.agent.yaml (or appropriate output path), update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

### 6. Route Based on User Choice

**If user chooses "one-at-a-time":**
- Proceed to `nextStepFile` (step-08-celebrate.md)
- Continue through each validation step sequentially
- Allow review between each validation

**If user chooses "YOLO":**
- Run all validation steps (7A through 7F) consecutively
- Do not pause between validations
- After all validations complete, proceed to Step 8
- Present summary of all validation results

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [complete YAML generated and written to output], will you then load and read fully `{nextStepFile}` to execute and celebrate completion.

## SUCCESS METRICS

**SUCCESS looks like:**
- Agent YAML file exists at specified output path
- YAML is syntactically valid and well-formed
- All template fields populated with plan content
- Structure matches Simple agent architecture
- User has selected validation approach
- Clear next step identified

**FAILURE looks like:**
- Template or architecture files not found
- Agent plan missing required sections
- YAML syntax errors in output
- Content not properly mapped to template
- File write operation fails
- User selection unclear

## TRANSITION CRITERIA

**Ready for Step 7A when:**
- Simple agent YAML successfully created
- User chooses "one-at-a-time" validation

**Ready for Step 8 when:**
- Simple agent YAML successfully created
- User chooses "YOLO" validation
- All validations (7A-7F) completed consecutively
