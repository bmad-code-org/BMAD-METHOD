---
name: 'step-05-activation'
description: 'Plan activation behavior and route to build'

# File References
agentPlan: '{bmb_creations_output_folder}/agent-plan-{agent_name}.md'
criticalActions: ../data/critical-actions.md

# Build Step Routes (determined by agent type)
simpleBuild: './step-07a-build-simple.md'
expertBuild: './step-07b-build-expert.md'
moduleBuild: './step-07c-build-module.md'

# Example critical_actions (for reference)
expertExample: ../data/reference/expert-examples/journal-keeper/journal-keeper.agent.yaml

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL
Define activation behavior through critical_actions and route to the appropriate build step based on agent complexity.

# MANDATORY EXECUTION RULES

1. **MUST Load Reference Documents** Before any discussion
   - Read criticalActions.md to understand activation patterns
   - Read agentPlan to access all accumulated metadata
   - These are non-negotiable prerequisites

2. **MUST Determine Route Before Activation Discussion**
   - Check hasSidecar from plan metadata
   - Determine destination build step FIRST
   - Inform user of routing decision

3. **MUST Document Activation Decision**
   - Either define critical_actions array explicitly
   - OR document deliberate omission with rationale
   - No middle ground - commit to one path

4. **MUST Follow Routing Logic Exactly**
   ```yaml
   # Route determination based on hasSidecar and module
   hasSidecar: false → step-06-build-simple.md
   hasSidecar: true + module: "stand-alone" → step-06-build-expert.md
   hasSidecar: true + module: ≠ "stand-alone" → step-06-build-module.md
   ```

5. **NEVER Skip Documentation**
   - Every decision about activation must be recorded
   - Every routing choice must be justified
   - Plan file must reflect final state

# EXECUTION PROTOCOLS

## Protocol 1: Reference Loading
Execute BEFORE engaging user:

1. Load criticalActions.md
2. Load agentPlan-{agent_name}.md
3. Extract routing metadata:
   - hasSidecar (boolean)
   - module (string)
   - agentType (if defined)
4. Determine destination build step

## Protocol 2: Routing Disclosure
Inform user immediately of determined route:

```
"Based on your agent configuration:
- hasSidecar: {hasSidecar}
- module: {module}

→ Routing to: {destinationStep}

Now let's plan your activation behavior..."
```

## Protocol 3: Activation Planning
Guide user through decision:

1. **Explain critical_actions Purpose**
   - What they are: autonomous triggers the agent can execute
   - When they're useful: proactive capabilities, workflows, utilities
   - When they're unnecessary: simple assistants, pure responders

2. **Discuss Agent's Activation Needs**
   - Does this agent need to run independently?
   - Should it initiate actions without prompts?
   - What workflows or capabilities should it trigger?

3. **Decision Point**
   - Define specific critical_actions if needed
   - OR explicitly opt-out with rationale

## Protocol 4: Documentation
Update agentPlan with activation metadata:

```yaml
# Add to agent metadata
activation:
  hasCriticalActions: true/false
  rationale: "Explanation of why or why not"
  criticalActions: []  # Only if hasCriticalActions: true
routing:
  destinationBuild: "step-06-{X}.md"
  hasSidecar: {boolean}
  module: "{module}"
```

# CONTEXT BOUNDARIES

## In Scope
- Planning activation behavior for the agent
- Defining critical_actions array
- Routing to appropriate build step
- Documenting activation decisions

## Out of Scope
- Writing actual activation code (build step)
- Designing sidecar workflows (build step)
- Changing core agent metadata (locked after step 04)
- Implementing commands (build step)

## Routing Boundaries
- Simple agents: No sidecar, straightforward activation
- Expert agents: Sidecar + stand-alone module
- Module agents: Sidecar + parent module integration

# EXECUTION SEQUENCE

## 1. Load Reference Documents
```bash
# Read these files FIRST
cat {criticalActions}
cat {agentPlan}
```

## 2. Discuss Activation Needs
Ask user:
- "Should your agent be able to take autonomous actions?"
- "Are there specific workflows it should trigger?"
- "Should it run as a background process or scheduled task?"
- "Or will it primarily respond to direct prompts?"

## 3. Define critical_actions OR Explicitly Omit

**If defining:**
- Reference criticalActions.md patterns
- List 3-7 specific actions
- Each action should be clear and scoped
- Document rationale for each

**If omitting:**
- State clearly: "This agent will not have critical_actions"
- Explain why: "This agent is a responsive assistant that operates under direct user guidance"
- Document the rationale

## 4. Route to Build Step

Determine destination:

```yaml
# Check plan metadata
hasSidecar: {value from step 04}
module: "{value from step 04}"

# Route logic
if hasSidecar == false:
  destination = simpleBuild
elif hasSidecar == true and module == "stand-alone":
  destination = expertBuild
else:  # hasSidecar == true and module != "stand-alone"
  destination = moduleBuild
```

## 5. Document to Plan

Update agentPlan with:

```yaml
---
activation:
  hasCriticalActions: true
  rationale: "Agent needs to autonomously trigger workflows for task automation"
  criticalActions:
    - name: "start-workflow"
      description: "Initiate a predefined workflow for task execution"
    - name: "schedule-task"
      description: "Schedule tasks for future execution"
    - name: "sync-data"
      description: "Synchronize data with external systems"

routing:
  destinationBuild: "step-06-build-expert.md"
  hasSidecar: true
  module: "stand-alone"
  rationale: "Agent requires sidecar workflows for autonomous operation"
---
```

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Save content to {agentPlan}, update frontmatter, determine appropriate build step based on hasSidecar and module values, then only then load, read entire file, then execute {simpleBuild} or {expertBuild} or {moduleBuild} as determined
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

This is the **ROUTING HUB** of agent creation. ONLY WHEN [C continue option] is selected and [routing decision determined with activation needs documented], will you then determine the appropriate build step based on hasSidecar/module values and load and read fully that build step file to execute.

Routing logic:
- hasSidecar: false → step-06-build-simple.md
- hasSidecar: true + module: "stand-alone" → step-06-build-expert.md
- hasSidecar: true + module: ≠ "stand-alone" → step-06-build-module.md

You cannot proceed to build without completing routing.

---

# SUCCESS METRICS

✅ **COMPLETION CRITERIA:**
- [ ] criticalActions.md loaded and understood
- [ ] agentPlan loaded with all prior metadata
- [ ] Routing decision determined and communicated
- [ ] Activation needs discussed with user
- [ ] critical_actions defined OR explicitly omitted with rationale
- [ ] Plan updated with activation and routing metadata
- [ ] User confirms routing to appropriate build step

✅ **SUCCESS INDICATORS:**
- Clear activation decision documented
- Route to build step is unambiguous
- User understands why they're going to {simple|expert|module} build
- Plan file reflects complete activation configuration

❌ **FAILURE MODES:**
- Attempting to define critical_actions without reading reference
- Routing decision not documented in plan
- User doesn't understand which build step comes next
- Ambiguous activation configuration (neither defined nor omitted)
- Skipping routing discussion entirely

⚠️ **RECOVERY PATHS:**
If activation planning goes wrong:

1. **Can't decide on activation?**
   - Default: Omit critical_actions
   - Route to simpleBuild
   - Can add later via edit-agent workflow

2. **Uncertain about routing?**
   - Check hasSidecar value
   - Check module value
   - Apply routing logic strictly

3. **User wants to change route?**
   - Adjust hasSidecar or module values
   - Re-run routing logic
   - Update plan accordingly
