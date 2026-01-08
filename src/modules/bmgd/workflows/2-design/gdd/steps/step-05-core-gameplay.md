---
name: 'step-05-core-gameplay'
description: 'Define game pillars, core gameplay loop, and win/loss conditions'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-05-core-gameplay.md'
nextStepFile: './step-06-mechanics.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Core Gameplay

**Progress: Step 5 of 14** - Next: Game Mechanics

## STEP GOAL:

Define the fundamental gameplay elements: game pillars (core design tenets), the core gameplay loop (what players repeatedly do), and win/loss conditions (how players succeed or fail).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- These are GAME-DEFINING decisions - treat them with appropriate weight
- Every future decision should serve these pillars and loop

### Step-Specific Rules:

- Focus on the heart of the gameplay experience
- FORBIDDEN to generate pillars/loops without real user input
- Challenge: Do these pillars and loop serve the stated USPs?
- Approach: Help user think through the player experience

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` before loading next step
- FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into the player experience
- **P (Party Mode)**: Test these fundamentals with multiple perspectives
- **C (Continue)**: Save the content to the document and proceed to next step

## CONTEXT BOUNDARIES:

- All previous context (type, platform, audience, goals, USPs) available
- Pillars are the "constitution" that guides all design decisions
- Core loop is what players do 80% of the time
- Win/loss conditions provide motivation and stakes

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Game Pillars Discovery

**Guide user through pillar definition:**

"Now we define the core pillars - the fundamental design principles that every feature must serve.

**What are Game Pillars?**

Pillars are 2-4 non-negotiable design tenets. Every mechanic, system, and feature should support at least one pillar. If something doesn't serve a pillar, question whether it belongs.

**Examples of Pillars:**

| Game           | Pillars                                            |
| -------------- | -------------------------------------------------- |
| **Dark Souls** | Challenge, Discovery, Consequence                  |
| **Celeste**    | Tight Controls, Accessibility, Emotional Narrative |
| **Minecraft**  | Creativity, Exploration, Player Agency             |
| **Dead Cells** | Mastery, Variety, Momentum                         |

**For your {{game_type}} with USPs of {{usps}}:**

What 2-4 pillars will define every design decision in {{game_name}}?"

### 2. Core Loop Discovery

**Guide user through loop definition:**

"Now let's define the core gameplay loop - the cycle of actions players repeat throughout the game.

**Core Loop Structure:**

A good loop has: **Action -> Feedback -> Reward -> Motivation to repeat**

**Examples:**

| Game          | Core Loop                                                              |
| ------------- | ---------------------------------------------------------------------- |
| **Roguelike** | Enter dungeon -> Fight/loot -> Die/extract -> Upgrade -> Enter dungeon |
| **Puzzle**    | See puzzle -> Analyze -> Attempt -> Succeed/fail -> Next puzzle        |
| **FPS**       | Engage enemy -> Shoot -> Kill/die -> Respawn/proceed -> Engage         |

**For {{game_type}} games, typical loops include:**
{typical_loops_for_game_type}

**Questions to consider:**

1. What does the player do most of the time?
2. What makes each loop iteration feel different from the last?
3. How long is one loop cycle? (seconds, minutes, hours?)

Describe the core loop for {{game_name}}."

### 3. Win/Loss Conditions Discovery

**Guide user through win/loss definition:**

"Finally, let's define how players succeed and fail.

**Win/Loss Framework:**

| Condition Type | Examples                                                        |
| -------------- | --------------------------------------------------------------- |
| **Victory**    | Beat final boss, reach score, complete story, survive time      |
| **Failure**    | Run out of lives, time expires, resources depleted, story fails |
| **Soft Fail**  | Lose progress, restart level, dropped loot                      |
| **No Failure** | Sandbox games, creative tools, walking sims                     |

**Questions to consider:**

1. Is there a definitive "win state" or is success ongoing?
2. What happens when players fail? How punishing is it?
3. Are there multiple win/lose conditions (lives AND time)?
4. Does failure teach the player something?

How do players win and lose in {{game_name}}?"

### 4. Generate Core Gameplay Content

Based on the conversation, prepare the content:

```markdown
## Core Gameplay

### Game Pillars

{{pillar_list_with_descriptions}}

**Pillar Prioritization:** When pillars conflict, prioritize in this order:
{{pillar_priority_order}}

### Core Gameplay Loop

{{loop_description}}

**Loop Diagram:**
{{text_based_loop_visualization}}

**Loop Timing:** {{typical_loop_duration}}

**Loop Variation:** {{what_makes_each_iteration_different}}

### Win/Loss Conditions

#### Victory Conditions

{{win_conditions}}

#### Failure Conditions

{{loss_conditions}}

#### Failure Recovery

{{what_happens_on_failure}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Core Gameplay sections based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Do all pillars support your USPs?
- Does the core loop deliver on your pillars?
- Do win/loss conditions create appropriate stakes?

**Select an Option:**
[A] Advanced Elicitation - Stress test these fundamentals
[P] Party Mode - Get other perspectives on the core design
[C] Continue - Save this and move to Game Mechanics (Step 6 of 14)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [core gameplay content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- 2-4 clear, actionable pillars defined
- Pillar prioritization established for conflicts
- Core loop clearly described with timing and variation
- Win/loss conditions appropriate for game type
- Failure recovery explained
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5]

### SYSTEM FAILURE:

- Generic pillars that don't guide decisions
- Core loop that doesn't match the game type
- Generating content without real user input
- Win/loss conditions misaligned with stated goals
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
