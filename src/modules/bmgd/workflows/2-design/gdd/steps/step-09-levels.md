---
name: 'step-09-levels'
description: 'Define level design framework and level progression'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-09-levels.md'
nextStepFile: './step-10-art-audio.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 9: Level Design

**Progress: Step 9 of 14** - Next: Art & Audio

## STEP GOAL:

Define the level design framework including level types, structure, and how levels progress or unlock throughout the game.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Level design is where mechanics meet content
- Not all games have "levels" - some have open worlds, others are endless

### Step-Specific Rules:

- Focus on spatial design and content structure
- FORBIDDEN to generate level designs without user input
- Adapt terminology to game type (levels, stages, areas, dungeons, etc.)
- Some games have no level structure - that's valid

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]` before loading next step
- FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into level design principles
- **P (Party Mode)**: Get perspectives on level structure
- **C (Continue)**: Save the content to the document and proceed to next step

## CONTEXT BOUNDARIES:

- All previous context available (especially mechanics and progression)
- Level design should teach and challenge using defined mechanics
- Structure should support defined progression system

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Determine Level Structure Type

**First, establish the structural approach:**

"Let's define how {{game_name}} structures its playable content.

**Structure Types:**

| Type                 | Description                       | Examples                    |
| -------------------- | --------------------------------- | --------------------------- |
| **Linear Levels**    | Distinct stages played in order   | Mario, Celeste              |
| **Hub-Based**        | Central area connecting levels    | Mario 64, Hollow Knight     |
| **Open World**       | Large continuous space            | Breath of the Wild, GTA     |
| **Procedural**       | Generated levels each playthrough | Spelunky, Dead Cells        |
| **Arena/Match**      | Self-contained competitive spaces | Fighting games, MOBAs       |
| **Puzzle Sets**      | Collections of puzzles            | Portal, The Witness         |
| **Narrative Scenes** | Story-driven segments             | Visual novels, adventures   |
| **Endless**          | Infinite generated content        | Endless runners, idle games |

**For {{game_type}} games, typical structures include:**
{typical_structures_for_game_type}

What structure best fits {{game_name}}?"

### 2. Level Types Discovery

**Based on structure choice, elicit level types:**

"Now let's define the types of {levels/areas/stages} in {{game_name}}.

**Questions to consider:**

1. What different environments or settings exist?
2. Are there tutorial levels? How are they integrated?
3. Are there boss levels or climax moments?
4. What's the shortest level? Longest?
5. Any special or secret levels?

Describe the types of {levels/areas/stages} in {{game_name}}."

### 3. Level Progression Discovery

**Guide user through progression structure:**

"Now let's define how players progress through {levels/areas/content}.

**Progression Models:**

| Model                 | Description                      | Best For               |
| --------------------- | -------------------------------- | ---------------------- |
| **Linear Sequence**   | 1 -> 2 -> 3 -> ...               | Story games, tutorials |
| **Branching Paths**   | Choices lead to different levels | Replayability          |
| **Open Selection**    | Player chooses order             | Mega Man style         |
| **Gated Progress**    | Abilities unlock new areas       | Metroidvania           |
| **Score/Star Unlock** | Performance unlocks levels       | Angry Birds style      |
| **Story Unlock**      | Narrative triggers unlock        | Adventure games        |

**Questions to consider:**

1. How do players unlock new {levels/areas}?
2. Can players replay previous {levels/areas}?
3. Is there a "world map" or selection screen?
4. How is the final {level/area} unlocked?

How do players progress through {{game_name}}'s content?"

### 4. Level Design Principles (Optional)

"Would you like to establish specific level design principles or guidelines for {{game_name}}?

Examples:

- 'Teach through play, never through text'
- 'Every room has one new idea'
- '30 second rule - something interesting every 30 seconds'
- 'Left is safety, right is danger'

These can guide consistent level design throughout development."

### 5. Generate Level Design Content

Based on the conversation, prepare the content:

```markdown
## Level Design Framework

### Structure Type

{{structure_type_description}}

### Level Types

{{level_types_list}}

#### Tutorial Integration

{{how_tutorials_work}}

#### Special Levels

{{boss_levels_secret_levels_etc}}

### Level Progression

{{progression_model_description}}

#### Unlock System

{{how_levels_unlock}}

#### Replayability

{{replay_and_revisit_mechanics}}

### Level Design Principles

{{if_has_principles}}
{{level_design_guidelines}}
{{/if_has_principles}}

{{if_no_principles}}
_Level design principles will be established during production._
{{/if_no_principles}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Level Design Framework based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**Validation Check:**

- Does the structure support your core loop?
- Does progression feel rewarding?
- Are level types varied enough to maintain interest?

**Select an Option:**
[A] Advanced Elicitation - Deep dive into level design specifics
[P] Party Mode - Get other perspectives on level structure
[C] Continue - Save this and move to Art & Audio (Step 10 of 14)"

### 7. Handle Menu Selection

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [level design content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Level structure type clearly identified
- Level types defined with variety
- Progression model documented
- Tutorial integration addressed
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]

### SYSTEM FAILURE:

- Generating level designs without user input
- Using wrong terminology for game type
- Structure doesn't support core loop
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
