---
name: 'step-06-build-expert'
description: 'Generate Expert agent YAML with sidecar from plan'

# File References
nextStepFile: './step-08a-plan-traceability.md'
agentPlan: '{bmb_creations_output_folder}/agent-plan-{agent_name}.md'
agentBuildOutput: '{bmb_creations_output_folder}/{agent-name}/'
agentYamlOutput: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'

# Template and Architecture
expertTemplate: ../templates/expert-agent-template/expert-agent.template.md
expertArch: ../data/expert-agent-architecture.md
agentCompilation: ../data/agent-compilation.md
criticalActions: ../data/critical-actions.md

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL

Assemble the agent plan content into a complete Expert agent YAML file with sidecar folder structure. Expert agents require persistent memory storage for specialized operations, accessed via `{project-root}/_bmad/_memory/{sidecar-folder}/` paths in critical_actions.

## MANDATORY EXECUTION RULES

1. **EXPERT AGENT = SIDECAR REQUIRED**: Every Expert agent MUST have a sidecar folder created under `_bmad/_memory/`
2. **CRITICAL_ACTIONS FORMAT**: All critical_actions MUST use `{project-root}/_bmad/_memory/{sidecar-folder}/` for file operations
3. **TEMPLATE COMPLIANCE**: Follow expert-agent-template.md structure exactly
4. **YAML VALIDATION**: Ensure valid YAML syntax with proper indentation (2-space)
5. **EXISTING CHECK**: If agentYamlOutput exists, ask user before overwriting
6. **NO DRIFT**: Use ONLY content from agentPlan - no additions or interpretations

## EXECUTION PROTOCOLS

### Phase 1: Load Architecture and Templates
1. Read `expertTemplate` - defines YAML structure for Expert agents
2. Read `expertArch` - architecture requirements for Expert-level agents
3. Read `agentCompilation` - assembly rules for YAML generation
4. Read `criticalActions` - validation requirements for critical_actions

### Phase 2: Load Agent Plan
1. Read `agentPlan` containing all collected content from Steps 1-5
2. Verify plan contains:
   - Agent type: "expert"
   - Sidecar folder name
   - Persona content
   - Commands structure
   - Critical actions (if applicable)

### Phase 3: Assemble Expert YAML
Using expertTemplate as structure:

```yaml
name: '{agent-name}'
description: '{short-description}'
type: 'expert'
version: '1.0.0'

author:
  name: '{author}'
  created: '{date}'

persona: |
  {multi-line persona content from plan}

system-context: |
  {expanded context from plan}

capabilities:
  - {capability from plan}
  - {capability from plan}
  # ... all capabilities

critical-actions:
  - name: '{action-name}'
    description: '{what it does}'
    invocation: '{when/how to invoke}'
    implementation: |
      {multi-line implementation}
    output: '{expected-output}'
    sidecar-folder: '{sidecar-folder-name}'
    sidecar-files:
      - '{project-root}/_bmad/_memory/{sidecar-folder}/{file1}.md'
      - '{project-root}/_bmad/_memory/{sidecar-folder}/{file2}.md'
  # ... all critical actions referencing sidecar structure

commands:
  - name: '{command-name}'
    description: '{what command does}'
    steps:
      - {step 1}
      - {step 2}
    # ... all commands from plan

configuration:
  temperature: {temperature}
  max-tokens: {max-tokens}
  response-format: {format}
  # ... other configuration from plan

metadata:
  sidecar-folder: '{sidecar-folder-name}'
  sidecar-path: '{project-root}/_bmad/_memory/{sidecar-folder}/'
  agent-type: 'expert'
  memory-type: 'persistent'
```

### Phase 4: Create Sidecar Structure

1. **Create Sidecar Directory**:
   - Path: `{project-root}/_bmad/_memory/{sidecar-folder}/`
   - Use `mkdir -p` to create full path

2. **Create Starter Files** (if specified in critical_actions):
   ```bash
   touch _bmad/_memory/{sidecar-folder}/{file1}.md
   touch _bmad/_memory/{sidecar-folder}/{file2}.md
   ```

3. **Add README to Sidecar**:
   ```markdown
   # {sidecar-folder} Memory

   This folder stores persistent memory for the **{agent-name}** Expert agent.

   ## Purpose
   {purpose from critical_actions}

   ## Files
   - {file1}.md: {description}
   - {file2}.md: {description}

   ## Access Pattern
   Agent accesses these files via: `{project-root}/_bmad/_memory/{sidecar-folder}/{filename}.md`
   ```

### Phase 5: Write Agent YAML

1. Create `agentBuildOutput` directory: `mkdir -p {agentBuildOutput}`
2. Write YAML to `agentYamlOutput`
3. Confirm write success
4. Display file location to user

### Phase 6: Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Write agent YAML to {agentBuildOutput}/{agent-name}/{agent-name}.agent.yaml (or appropriate output path), update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#phase-6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CONTEXT BOUNDARIES

- **USE ONLY**: Content from agentPlan, expertTemplate, expertArch, agentCompilation, criticalActions
- **DO NOT ADD**: New capabilities, commands, or actions not in plan
- **DO NOT INTERPRET**: Use exact language from plan
- **DO NOT SKIP**: Any field in expertTemplate structure
- **CRITICAL**: Expert agents MUST have sidecar-folder metadata

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [complete YAML generated and written to output], will you then load and read fully `{nextStepFile}` to execute and begin validation.

This step produces TWO artifacts:
1. **Agent YAML**: Complete expert agent definition at `{agentYamlOutput}`
2. **Sidecar Structure**: Folder and files at `{project-root}/_bmad/_memory/{sidecar-folder}/`

Both must exist before proceeding to validation.

## SUCCESS METRICS

✅ Agent YAML file created at expected location
✅ Valid YAML syntax (no parse errors)
✅ All template fields populated
✅ Sidecar folder created under `_bmad/_memory/`
✅ Sidecar folder contains starter files from critical_actions
✅ critical_actions reference `{project-root}/_bmad/_memory/{sidecar-folder}/` paths
✅ metadata.sidecar-folder populated
✅ metadata.agent-type = "expert"
✅ User validation choice received (one-at-a-time or YOLO)

## FAILURE MODES

❌ Missing required template fields
❌ Invalid YAML syntax
❌ Sidecar folder creation failed
❌ critical_actions missing sidecar-folder references
❌ agentPlan missing expert-specific content (sidecar-folder name)
❌ File write permission errors
