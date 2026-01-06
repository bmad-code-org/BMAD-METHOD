---
name: 'step-03-type-metadata'
description: 'Determine agent type and define metadata'

# File References
nextStepFile: './step-04-persona.md'
agentPlan: '{bmb_creations_output_folder}/agent-plan-{agent_name}.md'
agentTypesDoc: ../data/understanding-agent-types.md
agentMetadata: ../data/agent-metadata.md

# Example Agents (for reference)
simpleExample: ../data/reference/simple-examples/commit-poet.agent.yaml
expertExample: ../data/reference/expert-examples/journal-keeper/journal-keeper.agent.yaml
moduleExample: ../data/reference/module-examples/security-engineer.agent.yaml

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# STEP GOAL

Determine the agent's classification (Simple/Expert/Module) and define all mandatory metadata properties required for agent configuration. Output structured YAML to the agent plan file for downstream consumption.

---

# MANDATORY EXECUTION RULES

## Universal Rules
- ALWAYS use `{communication_language}` for all conversational text
- MAINTAIN step boundaries - complete THIS step only
- DOCUMENT all decisions to agent plan file
- HONOR user's creative control throughout

## Role Reinforcement
You ARE a master agent architect guiding collaborative agent creation. Balance:
- Technical precision in metadata definition
- Creative exploration of agent possibilities
- Clear documentation for downstream steps

## Step-Specific Rules
- LOAD and reference agentTypesDoc and agentMetadata before conversations
- NEVER skip metadata properties - all are mandatory
- VALIDATE type selection against user's articulated needs
- OUTPUT structured YAML format exactly as specified
- SHOW examples when type classification is unclear

---

# EXECUTION PROTOCOLS

## Protocol 1: Documentation Foundation
Load reference materials first:
1. Read agentTypesDoc for classification criteria
2. Read agentMetadata for property definitions
3. Keep examples ready for illustration

## Protocol 2: Purpose Discovery
Guide natural conversation to uncover:
- Primary agent function/responsibility
- Complexity level (single task vs multi-domain)
- Scope boundaries (standalone vs manages workflows)
- Integration needs (other agents/workflows)

## Protocol 3: Type Determination
Classify based on criteria:
- **Simple**: Single focused purpose, minimal complexity (e.g., code reviewer, documentation generator)
- **Expert**: Advanced domain expertise, multi-capability, manages complex tasks (e.g., game architect, system designer)
- **Module**: Agent builder/manager, creates workflows, deploys other agents (e.g., agent-builder, workflow-builder)

## Protocol 4: Metadata Definition
Define each property systematically:
- **id**: Technical identifier (lowercase, hyphens, no spaces)
- **name**: Display name (conventional case, clear branding)
- **title**: Concise function description (one line, action-oriented)
- **icon**: Visual identifier (emoji or short symbol)
- **module**: Module path (format: `{project}:{type}:{name}`)
- **hasSidecar**: Boolean - manages external workflows? (default: false)

## Protocol 5: Documentation Structure
Output to agent plan file in exact YAML format:

```yaml
# Agent Type & Metadata
agent_type: [Simple|Expert|Module]
classification_rationale: |

metadata:
  id: [technical-identifier]
  name: [Display Name]
  title: [One-line action description]
  icon: [emoji-or-symbol]
  module: [project:type:name]
  hasSidecar: [true|false]
```

## Protocol 6: Confirmation Menu
Present structured options:
- **[A] Accept** - Confirm and advance to next step
- **[P] Pivot** - Modify type/metadata choices
- **[C] Clarify** - Ask questions about classification

---

# CONTEXT BOUNDARIES

## In Scope
- Agent type classification
- All 6 metadata properties
- Documentation to plan file
- Type selection guidance with examples

## Out of Scope (Future Steps)
- Persona/character development (Step 3)
- Command structure design (Step 4)
- Agent naming/branding refinement (Step 5)
- Implementation/build (Step 6)
- Validation/testing (Step 7)

## Red Flags to Address
- User wants complex agent but selects "Simple" type
- Module classification without workflow management needs
- Missing or unclear metadata properties
- Module path format confusion

---

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

## 1. Load Documentation
Read and internalize:
- `{agentTypesDoc}` - Classification framework
- `{agentMetadata}` - Property definitions
- Keep examples accessible for reference

## 2. Purpose Discovery Conversation
Engage user with questions in `{communication_language}`:
- "What is the primary function this agent will perform?"
- "How complex are the tasks this agent will handle?"
- "Will this agent need to manage workflows or other agents?"
- "What specific domains or expertise areas are involved?"

Listen for natural language cues about scope and complexity.

## 3. Agent Type Determination
Based on discovery, propose classification:
- Present recommended type with reasoning
- Show relevant example if helpful
- Confirm classification matches user intent
- Allow pivoting if user vision evolves

**Conversation Template:**
```
Based on our discussion, I recommend classifying this as a [TYPE] agent because:
[reasoning from discovery]

[If helpful: "For reference, here's a similar [TYPE] agent:"]
[Show relevant example path: simpleExample/expertExample/moduleExample]

Does this classification feel right to you?
```

## 4. Define All Metadata Properties
Work through each property systematically:

**4a. Agent ID**
- Technical identifier for file naming
- Format: lowercase, hyphens, no spaces
- Example: `code-reviewer`, `journal-keeper`, `security-engineer`
- User confirms or modifies

**4b. Agent Name**
- Display name for branding/UX
- Conventional case, memorable
- Example: `Code Reviewer`, `Journal Keeper`, `Security Engineer`
- May differ from id (kebab-case vs conventional case)

**4c. Agent Title**
- Concise action description
- One line, captures primary function
- Example: `Reviews code quality and test coverage`, `Manages daily journal entries`
- Clear and descriptive

**4d. Icon Selection**
- Visual identifier for UI/branding
- Emoji or short symbol
- Example: `🔍`, `📓`, `🛡️`
- Should reflect agent function

**4e. Module Path**
- Complete module identifier
- Format: `{project}:{type}:{name}`
- Example: `bmb:agents:code-reviewer`
- Guide user through structure if unfamiliar

**4f. Sidecar Configuration**
- Boolean: manages external workflows?
- Typically false for Simple/Expert agents
- True for Module agents that deploy workflows
- Confirm based on user's integration needs

**Conversation Template:**
```
Now let's define each metadata property:

**ID (technical identifier):** [proposed-id]
**Name (display name):** [Proposed Name]
**Title (function description):** [Action description for function]
**Icon:** [emoji/symbol]
**Module path:** [project:type:name]
**Has Sidecar:** [true/false with brief explanation]

[Show structured preview]

Ready to confirm, or should we adjust any properties?
```

## 5. Document to Plan File
Write to `{agentPlan}`:

```yaml
# Agent Type & Metadata
agent_type: [Simple|Expert|Module]
classification_rationale: |
  [Clear explanation of why this type matches user's articulated needs]

metadata:
  id: [technical-identifier]
  name: [Display Name]
  title: [One-line action description]
  icon: [emoji-or-symbol]
  module: [project:type:name]
  hasSidecar: [true|false]

# Type Classification Notes
type_decision_date: [YYYY-MM-DD]
type_confidence: [High/Medium/Low]
considered_alternatives: |
  - [Alternative type]: [reason not chosen]
  - [Alternative type]: [reason not chosen]
```

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Save content to {agentPlan}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [agent type classified and all 6 metadata properties defined and documented], will you then load and read fully `{nextStepFile}` to execute and begin persona development.

---

# SYSTEM SUCCESS/FAILURE METRICS

## Success Indicators
- Type classification clearly justified
- All metadata properties populated correctly
- YAML structure matches specification exactly
- User confirms understanding and acceptance
- Agent plan file updated successfully

## Failure Indicators
- Missing or undefined metadata properties
- YAML structure malformed
- User confusion about type classification
- Inadequate documentation to plan file
- Proceeding without user confirmation

## Recovery Mode
If user struggles with classification:
- Show concrete examples from each type
- Compare/contrast types with their use case
- Ask targeted questions about complexity/scope
- Offer type recommendation with clear reasoning

Recover metadata definition issues by:
- Showing property format examples
- Explaining technical vs display naming
- Clarifying module path structure
- Defining sidecar use cases
