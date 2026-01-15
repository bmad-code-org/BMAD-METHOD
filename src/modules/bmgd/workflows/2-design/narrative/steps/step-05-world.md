---
name: 'step-05-world'
description: 'Build the world including setting, history, factions, and key locations'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-05-world.md'
nextStepFile: './step-06-dialogue.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: World Building

**Progress: Step 5 of 11** - Next: Dialogue Systems

## STEP GOAL:

Build the game's world including setting, history/backstory, factions/organizations, and key locations where the narrative unfolds.

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
- World should support and enhance the story
- Draw out user's vision of their world

### Step-Specific Rules:

- FORBIDDEN to create world elements without user input
- Connect world to themes and story
- Focus on narrative-relevant world-building

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Explore world depth
- **P (Party Mode)**: Get perspectives on world-building
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. World Overview Discovery

"**Let's build the world of {{game_name}}.**

Describe your world:

- **Setting** - Where and when does this take place?
- **World type** - Fantasy, sci-fi, modern, historical, etc.
- **World rules** - Magic systems? Technology level? Physical laws?
- **Atmosphere** - What mood does the world evoke?
- **What makes it unique?**

Describe the world:"

### 2. History and Backstory Discovery

"**What's the history of your world?**

Consider:

- **Major historical events** - Wars, discoveries, cataclysms?
- **How did the world reach its current state?**
- **Legends and myths** - What do people believe?
- **Past conflicts** - What shaped the present?
- **Secrets** - What is hidden or forgotten?

Describe the history:"

### 3. Factions Discovery (Optional)

"**Are there factions, organizations, or groups?** (Optional)

If applicable, for each faction:

- **Name and purpose**
- **Leadership and structure**
- **Goals and methods**
- **Relationships with other factions**
- **Role in the story**

Describe any factions:"

### 4. Locations Discovery

"**Describe the key locations in your world.**

For each significant location:

- **Name and description**
- **Narrative significance** - Why does it matter to the story?
- **Atmosphere and mood**
- **Key events that occur there**
- **Who controls/inhabits it?**

What are the key locations?"

### 5. Generate World Content

Based on the conversation, prepare the content:

```markdown
## World Building

### World Overview

**Setting:** {{setting_description}}

**World Type:** {{world_type}}

**World Rules:**
{{rules_and_systems}}

**Atmosphere:** {{world_atmosphere}}

**Unique Elements:** {{what_makes_it_unique}}

---

### History and Backstory

**Timeline Overview:**
{{historical_timeline}}

**Major Events:**
{{significant_events}}

**Legends and Myths:**
{{beliefs_and_legends}}

**Hidden Secrets:**
{{world_secrets}}

---

### Factions and Organizations

{{for_each_faction}}

#### {{faction_name}}

**Purpose:** {{purpose}}
**Leadership:** {{leadership}}
**Goals:** {{goals}}
**Methods:** {{methods}}
**Relationships:** {{faction_relationships}}
**Story Role:** {{narrative_function}}
{{/for_each}}

---

### Key Locations

{{for_each_location}}

#### {{location_name}}

**Description:** {{description}}
**Narrative Significance:** {{why_important}}
**Atmosphere:** {{mood}}
**Key Events:** {{events_here}}
**Inhabitants:** {{who_is_here}}
{{/for_each}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've documented the world of {{game_name}}.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**World Summary:**

- Setting: {{setting}}
- Factions: {{count}}
- Key locations: {{count}}

**Validation Check:**

- Does the world support your themes?
- Are locations narratively significant?
- Is history relevant to the present story?

**Select an Option:**
[A] Advanced Elicitation - Explore world depth
[P] Party Mode - Get perspectives on world-building
[C] Continue - Save this and move to Dialogue Systems (Step 6 of 11)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [world content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- World setting clearly defined
- History connects to current story
- Factions developed (if applicable)
- Locations are narratively significant
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5]

### SYSTEM FAILURE:

- Creating world without user input
- World disconnected from story
- Generic locations without significance
- Not presenting A/P/C menu after content
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
