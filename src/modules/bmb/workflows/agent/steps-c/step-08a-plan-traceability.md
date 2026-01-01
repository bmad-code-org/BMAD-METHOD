---
name: 'step-07a-plan-traceability'
description: 'Verify build matches original plan'

# File References
nextStepFile: './step-08b-metadata-validation.md'
agentPlan: '{bmb_creations_output_folder}/agent-plan-{agent_name}.md'
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL
Verify that the built agent YAML file contains all elements specified in the original agent plan. This step ensures plan traceability - confirming that what we planned is what we actually built.

# MANDATORY EXECUTION RULES
- MUST load both agentPlan and builtYaml files before comparison
- MUST compare ALL planned elements against built implementation
- MUST report specific missing items, not just "something is missing"
- MUST offer fix option before proceeding to next validation
- MUST handle missing files gracefully (report clearly, don't crash)
- MUST respect YOLO mode behavior (part of combined validation report)

# EXECUTION PROTOCOLS

## File Loading Protocol
1. Load agentPlan from `{bmb_creations_output_folder}/agent-plan-{agent_name}.md`
2. Load builtYaml from `{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml`
3. If either file is missing, report the specific missing file and stop comparison
4. Use Read tool to access both files with absolute paths

## Comparison Protocol
Compare the following categories systematically:

### 1. Metadata Comparison
- Agent name
- Description
- Version
- Author/creator information
- Location/module path
- Language settings (if specified in plan)

### 2. Persona Field Comparison
For each field in persona section:
- Check presence in built YAML
- Verify field content matches planned intent
- Note any significant deviations (minor wording differences ok)

### 3. Commands Comparison
- Verify all planned commands are present
- Check command names match
- Verify command descriptions are present
- Confirm critical actions are referenced

### 4. Critical Actions Comparison
- Verify all planned critical_actions are present
- Check action names match exactly
- Verify action descriptions are present
- Confirm each action has required fields

### 5. Additional Elements
- Dependencies (if planned)
- Configuration (if planned)
- Installation instructions (if planned)

## Reporting Protocol
Present findings in clear, structured format:

```
PLAN TRACEABILITY REPORT
========================

Agent: {agent_name}
Plan File: {path to agent plan}
Build File: {path to built YAML}

COMPARISON RESULTS:
-------------------

✅ Metadata: All present / Missing: {list}
✅ Persona Fields: All present / Missing: {list}
✅ Commands: All present / Missing: {list}
✅ Critical Actions: All present / Missing: {list}
✅ Other Elements: All present / Missing: {list}

OVERALL STATUS: [PASS / FAIL]

```

If ANY elements are missing:
- List each missing element with category
- Provide specific location reference (what was planned)
- Ask if user wants to fix items or continue anyway

## Menu Protocol

### 8. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [F] Fix Findings [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF F: Apply auto-fixes to {builtYaml} for identified missing elements, then redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Proceed to next validation step, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#8-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

If YOLO mode:
- Include this report in combined validation report
- Auto-select [C] Continue if all elements present
- Auto-select [F] Fix if missing critical elements (name, commands)
- Flag non-critical missing items in summary

# CONTEXT BOUNDARIES
- ONLY compare plan vs build - do NOT evaluate quality or correctness
- Do NOT suggest improvements or changes beyond planned elements
- Do NOT re-open persona/commands discovery - this is verification only
- Fix option should return to step-06-build, not earlier steps
- If plan file is ambiguous, note ambiguity but use reasonable interpretation

# SEQUENCE

## 1. Load Required Files
```yaml
action: read
target:
  - agentPlan
  - builtYaml
on_failure: report which file is missing and suggest resolution
```

## 2. Perform Structured Comparison
```yaml
action: compare
categories:
  - metadata
  - persona_fields
  - commands
  - critical_actions
  - other_elements
method: systematic category-by-category check
```

## 3. Generate Comparison Report
```yaml
action: report
format: structured pass/fail with specific missing items
output: console display + optional save to validation log
```

## 4. Present Menu Options
```yaml
action: menu
options:
  - F: Fix missing items
  - C: Continue to metadata validation
  - V: View detailed comparison (optional)
default: C if pass, F if fail
```

## 5. Handle User Choice
- **[F] Fix Findings**: Apply auto-fixes to {builtYaml} for identified missing elements, then re-present menu
- **[C] Continue**: Proceed to step-07b-metadata-validation
- **[A] Advanced Elicitation**: Execute advanced elicitation workflow, then re-present menu
- **[P] Party Mode**: Execute party mode workflow, then re-present menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation complete with any findings addressed], will you then load and read fully `{nextStepFile}` to execute and begin [metadata validation].

# SUCCESS/FAILURE METRICS

## Success Criteria
- All planned elements present in built YAML: **COMPLETE PASS**
- Minor deviations (wording, formatting) but all core elements present: **PASS**
- Missing elements identified and user chooses to continue: **PASS WITH NOTED DEFICIENCIES**

## Failure Criteria
- Unable to load plan or build file: **BLOCKING FAILURE**
- Critical elements missing (name, commands, or critical_actions): **FAIL**
- Comparison cannot be completed due to file corruption: **BLOCKING FAILURE**

## Next Step Triggers
- **PASS → step-07b-metadata-validation**
- **PASS WITH DEFICIENCIES → step-07b-metadata-validation** (user choice)
- **FAIL → step-06-build** (with specific fix instructions)
- **BLOCKING FAILURE → STOP** (resolve file access issues first)

## YOLO Mode Behavior
- Auto-fix missing critical elements by returning to build step
- Log non-critical missing items for review but continue validation
- Include traceability report in final YOLO summary
- Do NOT stop for user confirmation unless plan file is completely missing
