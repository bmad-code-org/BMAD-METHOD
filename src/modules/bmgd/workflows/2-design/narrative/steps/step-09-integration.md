---
name: 'step-09-integration'
description: 'Define how narrative integrates with gameplay including gating, agency, and ludonarrative harmony'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-09-integration.md'
nextStepFile: './step-10-production.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 9: Gameplay Integration

**Progress: Step 9 of 11** - Next: Production Planning

## STEP GOAL:

Define how narrative integrates with gameplay: story-gameplay connection, progression gating, and player agency within the narrative.

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
- Ludonarrative harmony matters
- Story and gameplay should reinforce each other

### Step-Specific Rules:

- FORBIDDEN to design integration without user input
- Consider player experience flow
- Address potential ludonarrative dissonance

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Explore integration depth
- **P (Party Mode)**: Get perspectives on integration
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Narrative-Gameplay Connection Discovery

"**How does narrative integrate with gameplay in {{game_name}}?**

**Integration questions:**

- Does story unlock new mechanics or abilities?
- Do mechanics reflect the themes?
- Is there harmony between what player DOES and what story SAYS?
- What's the balance of story vs. gameplay sections?

**Ludonarrative consideration:**
Games work best when mechanics and narrative tell the same story. A game about pacifism shouldn't require combat.

Describe how narrative and gameplay connect:"

### 2. Story Gating Discovery

"**How does story gate progression?**

**Gating types:**

- **Hard gates** - Must complete story to proceed
- **Soft gates** - Story available but optional
- **Skill gates** - Narrative rewards for mastery
- **Exploration gates** - Story found through exploring

**Questions:**

- What areas are story-locked?
- What triggers cutscenes?
- What story beats are mandatory?
- What's optional vs. required?

How does story gate progress in {{game_name}}?"

### 3. Player Agency Discovery

"**How much narrative agency does the player have?**

**Agency spectrum:**

- **Full agency** - Player creates their own story
- **Meaningful choices** - Player shapes outcomes
- **Flavor choices** - Player affects tone, not outcome
- **Witness** - Player observes a fixed story

**Questions:**

- Can player affect the story?
- Are choices meaningful or cosmetic?
- How much role-playing freedom?
- Is the narrative predetermined or dynamic?

Describe player agency in {{game_name}}:"

### 4. Generate Integration Content

Based on the conversation, prepare the content:

```markdown
## Gameplay Integration

### Narrative-Gameplay Connection

**Integration Approach:**
{{integration_description}}

**Mechanic-Theme Alignment:**
{{how_mechanics_reflect_themes}}

**Story-Gameplay Balance:**
{{balance_description}}

**Ludonarrative Considerations:**
{{harmony_or_dissonance_notes}}

---

### Story Gating

**Gating Approach:** {{gating_type}}

**Story-Locked Elements:**
{{what_requires_story_progress}}

**Cutscene Triggers:**
{{when_cutscenes_play}}

**Mandatory Story Beats:**
{{required_narrative_content}}

**Optional Narrative:**
{{skippable_content}}

---

### Player Agency

**Agency Level:** {{agency_type}}

**Player Influence:**
{{what_player_can_affect}}

**Choice System:**
{{if_has_choices}}

- Choice types: {{choice_types}}
- Consequence scope: {{how_choices_matter}}
- Timing: {{when_choices_occur}}
  {{/if_has_choices}}

**Role-Playing Freedom:**
{{roleplay_options}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've documented the gameplay-narrative integration.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Integration Summary:**

- Connection: {{integration_type}}
- Gating: {{gating_approach}}
- Agency: {{agency_level}}

**Validation Check:**

- Do mechanics support themes?
- Is gating appropriate for your game?
- Is agency level what you want?

**Select an Option:**
[A] Advanced Elicitation - Explore integration depth
[P] Party Mode - Get perspectives on integration
[C] Continue - Save this and move to Production Planning (Step 10 of 11)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [integration content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Narrative-gameplay connection defined
- Gating structure documented
- Player agency level established
- Ludonarrative harmony considered
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]

### SYSTEM FAILURE:

- Designing integration without user input
- Ignoring ludonarrative harmony
- Missing agency documentation
- Not presenting A/P/C menu after content
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
