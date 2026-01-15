---
name: 'step-02-context'
description: 'Load and understand project context from GDD and supporting documents'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture'

# File References
thisStepFile: './step-02-context.md'
nextStepFile: './step-03-starter.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-architecture.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: Project Context

**Progress: Step 2 of 9** - Next: Engine/Starter Selection

## STEP GOAL:

Load and analyze the GDD and supporting documents to understand the game's technical requirements, systems, and constraints that will drive architectural decisions.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game architect facilitator
- Extract technical implications from game design
- Identify complexity drivers and novel requirements

### Step-Specific Rules:

- Load ALL referenced input documents
- Identify systems that need architectural support
- Flag novel concepts requiring special attention

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after context analysis
- ONLY proceed when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into technical requirements
- **P (Party Mode)**: Get multiple perspectives on complexity
- **C (Continue)**: Confirm understanding and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load GDD Document

**Load the full GDD:**

Read the GDD file identified in initialization. Extract:

- Game title and core concept
- Platform targets
- Core mechanics and systems
- Technical requirements section
- Performance constraints
- Multiplayer/networking needs
- Any technical risks identified

### 2. Load Supporting Documents

**Load any available supporting documents:**

- **Epics**: User stories and acceptance criteria
- **Game Brief**: Vision and scope constraints
- **Narrative**: Story-driven technical needs

### 3. Analyze Technical Requirements

**Extract and categorize technical needs:**

**Core Systems Identified:**

| System          | Complexity          | GDD Reference |
| --------------- | ------------------- | ------------- |
| {{system_name}} | {{low/medium/high}} | {{section}}   |

**Platform Requirements:**

- Primary platform: {{platform}}
- Secondary platforms: {{if_any}}
- Cross-platform considerations: {{if_applicable}}

**Performance Constraints:**

- Frame rate target: {{fps}}
- Resolution support: {{resolutions}}
- Memory constraints: {{if_specified}}
- Load time requirements: {{if_specified}}

**Networking Requirements:**

- Multiplayer type: {{none/local/online}}
- Network architecture: {{p2p/client-server/hybrid}}
- Sync requirements: {{if_applicable}}

### 4. Identify Complexity Drivers

**Flag areas requiring architectural attention:**

"Based on my analysis, these are the complexity drivers:

**High Complexity:**
{{list_of_high_complexity_items}}

**Novel Concepts:**
{{unique_features_without_standard_patterns}}

**Technical Risks:**
{{risks_from_gdd}}"

### 5. Reflect Understanding

**Present analysis to user:**

"{{user_name}}, I've analyzed the technical requirements for **{{game_name}}**.

**Project Summary:**

- {{core_concept}}
- Platform: {{platform}}
- {{key_distinguishing_features}}

**Key Systems Requiring Architecture:**

1. {{system_1}} - {{brief_description}}
2. {{system_2}} - {{brief_description}}
3. {{system_3}} - {{brief_description}}

**Complexity Assessment:**

- Overall complexity: {{low/medium/high}}
- Novel elements: {{count}} requiring custom patterns
- Critical decisions: {{estimated_count}}

**Technical Constraints:**
{{summary_of_constraints}}

Does this match your understanding of the project?"

### 6. Generate Context Section

Based on the analysis, prepare the content:

```markdown
## Project Context

### Game Overview

**{{game_name}}** - {{core_concept}}

### Technical Scope

**Platform:** {{platform}}
**Genre:** {{genre}}
**Project Level:** {{complexity_level}}

### Core Systems

{{systems_table}}

### Technical Requirements

{{requirements_summary}}

### Complexity Drivers

{{complexity_analysis}}

### Technical Risks

{{identified_risks}}
```

### 7. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Project Context section based on my analysis.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 6]

**Validation Check:**

- Have I captured all core systems?
- Are the complexity assessments accurate?
- Any technical constraints I missed?

**Select an Option:**
[A] Advanced Elicitation - Deep dive into technical requirements
[P] Party Mode - Get multiple perspectives on complexity
[C] Continue - Save this and move to Engine Selection (Step 3 of 9)"

### 8. Handle Menu Selection

#### IF A (Advanced Elicitation):

- Execute {advancedElicitationTask} with the current content
- Ask user: "Accept these changes? (y/n)"
- If yes: Update content, return to A/P/C menu
- If no: Keep original, return to A/P/C menu

#### IF P (Party Mode):

- Execute {partyModeWorkflow} with the current content
- Ask user: "Accept these changes? (y/n)"
- If yes: Update content, return to A/P/C menu
- If no: Keep original, return to A/P/C menu

#### IF C (Continue):

- Append the final content to `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [context content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- GDD fully loaded and analyzed
- Supporting documents incorporated
- Systems and complexity identified
- Technical constraints documented
- User confirmed understanding accuracy
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2]

### SYSTEM FAILURE:

- Generating analysis without reading documents
- Missing critical systems from GDD
- Proceeding without user confirmation
- Not presenting A/P/C menu after analysis
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
