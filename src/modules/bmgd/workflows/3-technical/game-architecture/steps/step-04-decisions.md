---
name: 'step-04-decisions'
description: 'Facilitate collaborative architectural decision making for game systems'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture'

# File References
thisStepFile: './step-04-decisions.md'
nextStepFile: './step-05-crosscutting.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-architecture.md'

# Knowledge Bases
decisionCatalog: '{workflow_path}/decision-catalog.yaml'
architecturePatterns: '{workflow_path}/architecture-patterns.yaml'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Architectural Decisions

**Progress: Step 4 of 9** - Next: Cross-cutting Concerns

## STEP GOAL:

Facilitate collaborative decision-making for all remaining architectural choices. Each decision must be made WITH the user, not FOR them.

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
- Each decision must be made WITH the user
- Present options, explain trade-offs, accept user choice

### Step-Specific Rules:

- Load decision catalog for structured guidance
- Verify technology versions via web search
- Document rationale for every decision

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after all decisions documented
- ONLY proceed when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Challenge decisions and explore alternatives
- **P (Party Mode)**: Get multiple perspectives on choices
- **C (Continue)**: Confirm decisions and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load Decision Framework

**Load decision catalog if available:**

Load `{decisionCatalog}` and `{architecturePatterns}` to guide the decision process.

**Identify required decisions based on game type:**

| Category               | Decisions Needed            |
| ---------------------- | --------------------------- |
| **State Management**   | {{if_applicable}}           |
| **Data Persistence**   | Save system, config storage |
| **Networking**         | {{if_multiplayer}}          |
| **AI Systems**         | {{if_has_ai}}               |
| **Asset Loading**      | Streaming, caching          |
| **Scene Structure**    | Scene graph, loading        |
| **UI Framework**       | In-game, menus              |
| **Audio Architecture** | Channels, mixing            |

### 2. Prioritize Decisions

**Create decision priority list:**

"Based on your project, here are the architectural decisions we need to make:

**CRITICAL (blocks everything):**
{{critical_decisions}}

**IMPORTANT (shapes architecture):**
{{important_decisions}}

**NICE-TO-HAVE (can defer):**
{{optional_decisions}}

Let's work through these in priority order."

### 3. Facilitate Each Decision

**For each decision, follow this pattern:**

"**Decision: {{decision_name}}**

{{context_about_why_this_matters}}

**Options:**

| Option       | Pros     | Cons     |
| ------------ | -------- | -------- |
| {{option_1}} | {{pros}} | {{cons}} |
| {{option_2}} | {{pros}} | {{cons}} |
| {{option_3}} | {{pros}} | {{cons}} |

**Recommendation:** {{recommendation}} because {{reason}}

What's your preference? (or 'explain more' for details)"

**After user decides:**

Record:

- Category: {{category}}
- Decision: {{user_choice}}
- Version: {{if_applicable}}
- Rationale: {{user_reasoning}}

### 4. Game-Specific Decision Categories

**State Management:**

"How should game state be managed?

**Options:**

- **Singleton Pattern** - Simple, global access, harder to test
- **State Machine** - Clear transitions, good for game modes
- **ECS (Entity Component System)** - Scalable, decoupled, learning curve
- **Redux-style** - Predictable, time travel debugging, more boilerplate

For {{game_type}}, {{recommendation}} works well because {{reason}}.

Your choice?"

**Save System:**

"How should player progress be saved?

**Options:**

- **Local files** - JSON/binary, works offline
- **Cloud saves** - Cross-device, requires backend
- **Hybrid** - Local primary, cloud sync
- **Platform-specific** - Steam Cloud, console saves

Your choice?"

**Asset Loading:**

"How should assets be loaded?

**Options:**

- **Preload all** - Simple, longer initial load
- **Lazy loading** - Fast startup, potential hitches
- **Streaming** - Seamless, complex implementation
- **Scene-based** - Load per scene, clear boundaries

Your choice?"

### 5. Handle Version Verification

**For any technology-specific decisions:**

Search web: "{{technology}} latest stable version {{current_year}}"

Document:

- Technology: {{name}}
- Verified Version: {{version}}
- Verification Date: {{today}}

### 6. Generate Decisions Section

After all decisions are made, prepare the content:

```markdown
## Architectural Decisions

### Decision Summary

| Category | Decision | Version | Rationale |
| -------- | -------- | ------- | --------- |

{{decision_table_rows}}

### State Management

**Approach:** {{state_management_choice}}

{{state_management_details}}

### Data Persistence

**Save System:** {{save_system_choice}}

{{save_system_details}}

### Asset Management

**Loading Strategy:** {{asset_loading_choice}}

{{asset_loading_details}}

### {{Additional_Categories}}

{{additional_decision_details}}

### Architecture Decision Records

{{key_decisions_with_context}}
```

### 7. Present Content and Menu

Show the generated content to the user and present:

"I've documented all our architectural decisions.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 6]

**Decisions Made:** {{count}} decisions documented

**Validation Check:**

- Are all critical decisions captured?
- Are versions current and verified?
- Does the rationale reflect your reasoning?

**Select an Option:**
[A] Advanced Elicitation - Challenge decisions, explore alternatives
[P] Party Mode - Get different perspectives on choices
[C] Continue - Save this and move to Cross-cutting Concerns (Step 5 of 9)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [decisions content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All required decisions identified
- User made each decision (not generated)
- Versions verified via web search
- Rationale documented for each decision
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4]

### SYSTEM FAILURE:

- Making decisions FOR the user
- Using unverified versions
- Missing critical decisions
- Not documenting rationale
- Not presenting A/P/C menu after decisions
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
