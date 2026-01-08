---
name: 'step-04-fundamentals'
description: 'Define core gameplay pillars, mechanics, and player experience goals'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/game-brief'

# File References
thisStepFile: './step-04-fundamentals.md'
nextStepFile: './step-05-scope.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-brief.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Game Fundamentals

**Progress: Step 4 of 8** - Next: Scope & Constraints

## STEP GOAL:

Define the core gameplay pillars (fundamental design tenets), primary mechanics (what players do), and player experience goals (what feelings are designed for).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Pillars are the "constitution" - everything must serve them
- Connect mechanics directly to emotional experiences

### Step-Specific Rules:

- Focus on the core of what makes this game unique
- FORBIDDEN to generate fundamentals without real user input
- Ensure pillars are specific and measurable
- Focus on player actions rather than implementation details

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Stress test the fundamentals
- **P (Party Mode)**: Get perspectives on core design
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Core Pillars Discovery

**Guide user through pillar definition:**

"Let's define the core pillars for {{game_name}} - the 2-4 fundamental design tenets that everything must serve.

**Examples of Great Pillars:**

| Game               | Pillars                                                   |
| ------------------ | --------------------------------------------------------- |
| **Hollow Knight**  | Tight controls, challenging combat, rewarding exploration |
| **Celeste**        | Precision movement, accessibility, emotional narrative    |
| **Dead Cells**     | Mastery, variety, momentum                                |
| **Stardew Valley** | Relaxation, progression, community                        |

**Questions to consider:**

- If a feature doesn't serve a pillar, should it be in the game?
- When pillars conflict, which wins?

What are the 2-4 core pillars for {{game_name}}?"

### 2. Primary Mechanics Discovery

**Explore what players actually do:**

"Now let's define what players actually DO in {{game_name}}.

**Think in verbs - what actions define the experience?**

Examples:

- Jump, dash, climb (movement)
- Attack, dodge, parry (combat)
- Craft, build, place (creation)
- Talk, choose, influence (social)
- Collect, trade, manage (economy)

**Questions to consider:**

- What's the core action players repeat most often?
- What actions create the most satisfying moments?
- How do different mechanics interact?

What are the primary mechanics in {{game_name}}?"

### 3. Experience Goals Discovery

**Define the emotional targets:**

"Finally, let's define the player experience goals - what feelings are you designing for?

**Emotional Experience Framework:**

| Emotion                   | Examples                               |
| ------------------------- | -------------------------------------- |
| **Tension/Relief**        | Horror games, difficult boss fights    |
| **Mastery/Growth**        | Skill-based games, RPG progression     |
| **Creativity/Expression** | Sandbox games, character customization |
| **Discovery/Surprise**    | Exploration games, mystery narratives  |
| **Connection/Belonging**  | Multiplayer, community-driven games    |
| **Relaxation/Flow**       | Cozy games, rhythm games               |

**Questions to consider:**

- What feeling do you want players to have after a session?
- What emotional journey happens during play?
- What makes this experience meaningful?

What are the player experience goals for {{game_name}}?"

### 4. Generate Fundamentals Content

Based on the conversation, prepare the content:

```markdown
## Game Fundamentals

### Core Gameplay Pillars

{{pillars_with_descriptions}}

**Pillar Priority:** When pillars conflict, prioritize:
{{pillar_priority_order}}

### Primary Mechanics

{{mechanics_list_with_descriptions}}

**Core Loop:** {{how_mechanics_combine_into_loop}}

### Player Experience Goals

{{experience_goals}}

**Emotional Journey:** {{what_players_feel_during_play}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Game Fundamentals section based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Do all pillars support your vision?
- Do mechanics serve the pillars?
- Do experience goals match your audience?

**Select an Option:**
[A] Advanced Elicitation - Stress test these fundamentals
[P] Party Mode - Get other perspectives on core design
[C] Continue - Save this and move to Scope & Constraints (Step 5 of 8)"

### 6. Handle Menu Selection

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

ONLY WHEN [C continue option] is selected and [fundamentals content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- 2-4 clear, actionable pillars defined
- Primary mechanics clearly described
- Experience goals tied to audience and vision
- Pillar priority established
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4]

### SYSTEM FAILURE:

- Generating fundamentals without user input
- Generic pillars that don't guide decisions
- Mechanics disconnected from experience goals
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
