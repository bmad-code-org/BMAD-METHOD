---
name: 'step-08-progression'
description: 'Define player progression systems and game balance'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-08-progression.md'
nextStepFile: './step-09-levels.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 8: Progression & Balance

**Progress: Step 8 of 14** - Next: Level Design

## STEP GOAL:

Define how players progress through the game (skill, power, narrative, etc.), the difficulty curve, and any economy or resource systems.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Progression is what keeps players engaged over time
- Balance determines if the game feels fair and fun

### Step-Specific Rules:

- Focus on player growth and challenge scaling
- FORBIDDEN to generate progression systems without user input
- Some games have no explicit progression - that's valid
- Economy/resources are optional - ask before including

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]` before loading next step
- FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into progression curves and balance
- **P (Party Mode)**: Test progression ideas with multiple perspectives
- **C (Continue)**: Save the content to the document and proceed to next step

## CONTEXT BOUNDARIES:

- All previous context available (especially core loop and mechanics)
- Progression should reinforce the core loop
- Balance affects all previously defined mechanics

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Player Progression Discovery

**Guide user through progression definition:**

"Let's define how players grow and progress through {{game_name}}.

**Types of Progression:**

| Type           | Description                                | Examples                  |
| -------------- | ------------------------------------------ | ------------------------- |
| **Skill**      | Player gets better at the game             | Dark Souls, Celeste       |
| **Power**      | Character gets stronger (stats, abilities) | RPGs, Metroidvanias       |
| **Narrative**  | Story unfolds and advances                 | Visual novels, adventures |
| **Content**    | New levels, areas, or modes unlock         | Most games                |
| **Collection** | Gathering items, achievements              | Completionist games       |
| **Social**     | Rank, reputation, community status         | Competitive games         |

**For {{game_type}} games, typical progression includes:**
{typical_progression_for_game_type}

**Questions to consider:**

1. What type(s) of progression does {{game_name}} have?
2. How long until players feel meaningful progress?
3. Is there a "meta" progression (between runs/sessions)?

How do players progress in {{game_name}}?"

### 2. Difficulty Curve Discovery

**Guide user through difficulty design:**

"Now let's design the difficulty curve.

**Difficulty Curve Patterns:**

| Pattern               | Description                             | Best For                       |
| --------------------- | --------------------------------------- | ------------------------------ |
| **Linear**            | Steady increase in challenge            | Story games, first playthrough |
| **Sawtooth**          | Build-release pattern (easy after hard) | Level-based games              |
| **Exponential**       | Gentle start, steep late-game           | RPGs, incremental games        |
| **Flat**              | Consistent challenge throughout         | Roguelikes, skill games        |
| **Player-controlled** | User selects difficulty                 | Accessibility-focused          |

**Questions to consider:**

1. How does challenge increase over time?
2. Are there difficulty spikes (bosses, skill checks)?
3. Can players adjust difficulty? How?
4. How do you handle players who are stuck?

Describe the difficulty curve for {{game_name}}."

### 3. Economy/Resources Discovery (Optional)

**Ask first:**

"Does {{game_name}} have an in-game economy or resource system?

Examples:

- Currency (gold, coins, gems)
- Crafting materials
- Energy/stamina systems
- Ammunition or consumables

If yes, we'll define it. If no, we'll skip this section."

**If yes:**

"Let's define the economy/resources:

**Economy Questions:**

1. What resources exist?
2. How are resources earned?
3. How are resources spent?
4. Is there inflation/scarcity design?
5. Are there sinks to remove resources?
6. Premium currency? (if F2P)

Describe the economy in {{game_name}}."

### 4. Generate Progression Content

Based on the conversation, prepare the content:

```markdown
## Progression and Balance

### Player Progression

{{progression_system_description}}

#### Progression Types

{{progression_types_used}}

#### Progression Pacing

{{how_fast_players_progress}}

### Difficulty Curve

{{difficulty_curve_description}}

#### Challenge Scaling

{{how_difficulty_increases}}

#### Difficulty Options

{{accessibility_and_difficulty_settings}}

### Economy and Resources

{{if_has_economy}}
{{economy_system_description}}

#### Resources

{{resource_types_and_purposes}}

#### Economy Flow

{{earn_and_spend_loop}}
{{/if_has_economy}}

{{if_no_economy}}
_This game does not feature an in-game economy or resource system._
{{/if_no_economy}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Progression & Balance sections based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Does progression reinforce your core loop?
- Is the difficulty curve appropriate for your audience?
- Does the economy (if any) feel fair?

**Select an Option:**
[A] Advanced Elicitation - Deep dive into balance and pacing
[P] Party Mode - Test these systems with other perspectives
[C] Continue - Save this and move to Level Design (Step 9 of 14)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [progression content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Progression system clearly defined
- Difficulty curve appropriate for game type and audience
- Economy handled correctly (defined or explicitly skipped)
- Balance considerations documented
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]

### SYSTEM FAILURE:

- Generating progression without user input
- Assuming economy exists without asking
- Difficulty curve mismatched with audience
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
