---
name: 'step-06-build-module'
description: 'Generate Module agent YAML from plan'

# File References
nextStepFile: './step-08-celebrate.md'
agentPlan: '{bmb_creations_output_folder}/agent-plan-{agent_name}.md'
agentBuildOutput: '{bmb_creations_output_folder}/{agent-name}/'
agentYamlOutput: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

# Template and Architecture (use expert as baseline)
expertTemplate: ../templates/expert-agent-template/expert-agent.template.md
expertArch: ../data/expert-agent-architecture.md
agentCompilation: ../data/agent-compilation.md
criticalActions: ../data/critical-actions.md

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL
Assemble the Module agent YAML file from the approved plan, using the expert agent template as the baseline architecture and adding module-specific workflow integration paths and sidecar configuration.

# MANDATORY EXECUTION RULES

1. **TEMPLATE BASELINE**: Module agents MUST use the expert agent template as their structural foundation - do not create custom templates

2. **PLAN ADHERENCE**: Extract content from agentPlan exactly as written - no enhancement, interpretation, or extrapolation

3. **MODULE SPECIFICITY**: Module agents require workflow integration paths and may need sidecar configuration for multi-workflow modules

4. **OUTPUT VALIDATION**: YAML must be valid, complete, and ready for immediate deployment

5. **LANGUAGE PRESERVATION**: Maintain any language choice configured in the plan throughout the YAML

# EXECUTION PROTOCOLS

## PREPARATION PHASE

### 1. Load Expert Template Baseline
```
Read: expertTemplate
Read: expertArch
Read: agentCompilation
Read: criticalActions
```

**Purpose**: Understand the expert agent structure that serves as the Module agent baseline

**Validation**: Confirm expert template has all required sections (name, description, persona, instructions, tools, skills, etc.)

### 2. Load Agent Plan
```
Read: agentPlan (using dynamic path)
```

**Validation**: Plan contains all mandatory sections:
- Agent identity (name, description)
- Persona profile
- Command structure
- Critical actions
- Workflow integrations (module-specific)
- Language choice (if configured)

### 3. Verify Output Directory
```
Bash: mkdir -p {agentBuildOutput}
```

**Purpose**: Ensure output directory exists for the module agent

## ASSEMBLY PHASE

### 4. Assemble Module Agent YAML

**FROM PLAN TO YAML MAPPING:**

| Plan Section | YAML Field | Notes |
|--------------|------------|-------|
| Agent Name | `name` | Plan → YAML |
| Description | `description` | Plan → YAML |
| Persona | `persona` | Plan → YAML |
| Instructions | `instructions` | Plan → YAML (verbatim) |
| Commands | `commands` | Plan → YAML (with handlers) |
| Critical Actions | `criticalActions` | Plan → YAML (mandatory) |
| Workflow Paths | `skills` | Module-specific |
| Sidecar Need | `sidecar` | If multi-workflow |

**MODULE-SPECIAL ENHANCEMENTS:**

```yaml
# Module agents include workflow integration
skills:
  - workflow: "{project-root}/_bmad/{module-id}/workflows/{workflow-name}/workflow.md"
    description: "From plan workflow list"
  - workflow: "{project-root}/_bmad/{module-id}/workflows/{another-workflow}/workflow.md"
    description: "From plan workflow list"

# Optional: Sidecar for complex modules
sidecar:
  enabled: true
  workflows:
    - ref: "primary-workflow"
      type: "primary"
    - ref: "secondary-workflow"
      type: "support"
```

**CRITICAL ACTIONS MAPPING:**
```
For each critical action in plan:
1. Identify matching command in YAML
2. Add `critical: true` flag
3. Ensure handler references agent function
```

### 5. Create Sidecar (If Needed)

**SIDEAR REQUIRED IF:**
- Module has 3+ workflows
- Workflows have complex interdependencies
- Module needs initialization workflow

**SIDECAR STRUCTURE:**
```yaml
# {agent-name}.sidecar.yaml
sidecar:
  module: "{module-id}"
  initialization:
    workflow: "workflow-init"
    required: true
  workflows:
    - name: "workflow-name"
      path: "workflows/{workflow-name}/workflow.md"
      type: "primary|support|utility"
      dependencies: []
  agent:
    path: "{agent-name}.agent.yaml"
```

**IF SIDEAR NOT NEEDED**: Skip this step

### 6. Write Module Agent YAML
```
Write: agentYamlOutput (using dynamic path)
Content: Assembled YAML from step 4
```

**Validation Checklist:**
- [ ] All plan fields present in YAML
- [ ] Workflow paths are valid and correct
- [ ] Critical actions flagged
- [ ] Sidecar created (if needed) or skipped (if not)
- [ ] YAML syntax is valid
- [ ] Language choice preserved throughout

## COMPLETION PHASE

### 7. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Write agent YAML to {agentBuildOutput}/{agent-name}/{agent-name}.agent.yaml (or appropriate output path), update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

**USER RESPONSE HANDLING:**
- **Option 1**: Proceed to step-07a-plan-traceability.md with sequential mode
- **Option 2**: Proceed to step-07a-plan-traceability.md with yolo mode
- **Invalid input**: Re-ask with options

# CONTEXT BOUNDARIES

**IN SCOPE:**
- Reading expert template and architecture
- Loading agent plan
- Assembling Module agent YAML
- Creating sidecar (if needed)
- Writing valid YAML output

**OUT OF SCOPE:**
- Modifying plan content
- Creating new template structures
- Implementing agent code
- Writing workflow files
- Testing agent functionality

**DO NOT:**
- Add commands not in plan
- Modify persona from plan
- Create custom template structures
- Skip critical actions mapping
- Assume sidecar need - evaluate based on workflow count

# CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [complete YAML generated and written to output], will you then load and read fully `{nextStepFile}` to execute and celebrate completion.

**THIS STEP IS COMPLETE WHEN:**
1. Module agent YAML file exists at agentYamlOutput path
2. YAML contains all plan content correctly mapped
3. Module-specific workflow paths are configured
4. Sidecar is created (if needed) or correctly skipped (if not)
5. User has chosen review mode (one-at-a-time or YOLO)
6. Ready to proceed to step-07a-plan-traceability.md

**STOP BEFORE:**
- Writing workflow implementations
- Creating agent code files
- Testing agent functionality
- Deploying to active system

# SUCCESS METRICS

**COMPLETION:**
- [ ] Module agent YAML exists with all required fields
- [ ] All plan content accurately mapped to YAML
- [ ] Workflow integration paths configured correctly
- [ ] Critical actions properly flagged
- [ ] Sidecar created or correctly skipped
- [ ] YAML syntax is valid
- [ ] User confirms review mode choice
- [ ] Transitions to step-07a-plan-traceability.md

**VALIDATION:**
- Plan-to-YAML mapping: 100% accuracy
- Workflow paths: All valid and correct
- Critical actions: All present and flagged
- Sidecar decision: Correctly evaluated
- Language choice: Preserved throughout

# FAILURE MODES

**IF PLAN MISSING CONTENT:**
→ Return to step-02-discover.md to complete plan

**IF EXPERT TEMPLATE MISSING:**
→ Raise error - template is mandatory baseline

**IF YAML SYNTAX ERROR:**
→ Fix and retry write operation

**IF WORKFLOW PATHS INVALID:**
→ Flag for review in traceability step

**IF USER ASKS FOR MODIFICATIONS:**
→ Return to appropriate planning step (03-persona, 04-commands, or 05-name)
