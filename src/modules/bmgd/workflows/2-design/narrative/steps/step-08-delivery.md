---
name: 'step-08-delivery'
description: 'Design narrative delivery methods including cutscenes, in-game storytelling, and endings'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-08-delivery.md'
nextStepFile: './step-09-integration.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 8: Narrative Delivery

**Progress: Step 8 of 11** - Next: Gameplay Integration

## STEP GOAL:

Define how narrative content is delivered to players: cutscenes, in-game storytelling, optional content, and ending structures.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a narrative design facilitator
- Delivery method affects player experience
- Balance story delivery with gameplay

### Step-Specific Rules:

- FORBIDDEN to decide delivery without user input
- Consider production effort for each method
- Match delivery to game type

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Explore delivery methods
- **P (Party Mode)**: Get perspectives on delivery approach
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Cutscenes Discovery

"**How will you use cutscenes in {{game_name}}?**

**Cutscene considerations:**

- **Quantity** - How many major cutscenes?
- **Length** - Average duration?
- **Style** - Real-time rendered? Pre-rendered? Animated?
- **Skippable** - Can players skip?
- **Interactive** - Any QTEs or choices during cutscenes?

Describe your cutscene approach:"

### 2. In-Game Storytelling Discovery

"**How will story be delivered during gameplay?**

**In-game storytelling methods:**

- **NPC conversations** - Talking to characters
- **Radio/comm chatter** - Voice in player's ear
- **Environmental cues** - Reading the world
- **Player actions** - Story through doing
- **UI elements** - Quest logs, journals, etc.

**Balance considerations:**

- Show vs. tell - How much is shown vs. explained?
- Interruption tolerance - How often stop for story?
- Player control - Can players skip/speed up?

How will you deliver story during gameplay?"

### 3. Optional Content Discovery

"**What narrative content is optional?**

**Optional content types:**

- **Side quests** - Optional story missions
- **Collectible lore** - World-building items
- **Optional conversations** - Extra NPC dialogue
- **Secret endings** - Hidden conclusions
- **Extended content** - Post-game, NG+, DLC hooks

What optional narrative content will {{game_name}} have?"

### 4. Endings Discovery

"**If your game has multiple endings, describe them.**

**Ending considerations:**

- **How many endings?**
- **What determines the ending?** (choices, stats, completion)
- **Ending variety** - Minor variations vs. drastically different
- **True/golden ending** - Is there a "best" ending?
- **Replayability** - Can players see all endings?

Describe your ending structure (or indicate single ending):"

### 5. Generate Delivery Content

Based on the conversation, prepare the content:

```markdown
## Narrative Delivery

### Cutscenes

**Quantity:** {{cutscene_count}}
**Average Length:** {{typical_duration}}
**Style:** {{cutscene_style}}
**Skippable:** {{yes_no}}
**Interactive Elements:** {{if_any}}

**Major Cutscenes:**
{{list_of_major_cutscenes}}

---

### In-Game Storytelling

**Primary Methods:**
{{delivery_methods_list}}

**Show vs. Tell Balance:** {{balance_description}}

**Interruption Approach:** {{how_often_story_stops_gameplay}}

**Player Control:** {{skip_speedup_options}}

---

### Optional Content

{{for_each_optional_type}}
**{{content_type}}:**
{{description_and_scope}}
{{/for_each}}

---

### Ending Structure

{{if_multiple_endings}}
**Number of Endings:** {{ending_count}}

**Ending Triggers:** {{what_determines_ending}}

**Ending Variety:**
{{description_of_differences}}

**True Ending:** {{if_exists}}

**Replayability:** {{how_to_see_all}}
{{/if_multiple_endings}}

{{if_single_ending}}
**Ending Type:** Single ending
**Description:** {{ending_approach}}
{{/if_single_ending}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've documented the narrative delivery approach.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**Delivery Summary:**

- Cutscenes: {{count_or_none}}
- In-game methods: {{methods_list}}
- Optional content: {{types}}
- Endings: {{single_or_multiple}}

**Validation Check:**

- Is delivery method realistic for scope?
- Does it match your narrative complexity?
- Are endings meaningful?

**Select an Option:**
[A] Advanced Elicitation - Explore delivery methods
[P] Party Mode - Get perspectives on delivery approach
[C] Continue - Save this and move to Gameplay Integration (Step 9 of 11)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [delivery content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Cutscene approach defined
- In-game delivery methods established
- Optional content scoped
- Ending structure documented
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]

### SYSTEM FAILURE:

- Deciding delivery without user input
- Methods unrealistic for scope
- Missing ending documentation
- Not presenting A/P/C menu after content
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
