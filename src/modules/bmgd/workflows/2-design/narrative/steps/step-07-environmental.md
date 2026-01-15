---
name: 'step-07-environmental'
description: 'Plan environmental storytelling including visual, audio, and found documents'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-07-environmental.md'
nextStepFile: './step-08-delivery.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 7: Environmental Storytelling

**Progress: Step 7 of 11** - Next: Narrative Delivery

## STEP GOAL:

Define how story is told through the environment: visual storytelling, audio storytelling, and found documents/collectibles.

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
- Show, don't tell - environmental storytelling is powerful
- Help user think beyond dialogue

### Step-Specific Rules:

- FORBIDDEN to design environmental narrative without user input
- Connect environmental elements to story
- Consider implementation effort

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Explore environmental depth
- **P (Party Mode)**: Get perspectives on environmental storytelling
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Visual Storytelling Discovery

"**How will you tell story through visuals in {{game_name}}?**

**Visual storytelling elements:**

- **Set dressing and props** - What objects tell stories?
- **Environmental damage/aftermath** - What happened here?
- **Visual symbolism** - Recurring images with meaning
- **Color and lighting** - Mood and meaning through visuals
- **Character design details** - What do appearances reveal?

How will visuals tell story in {{game_name}}?"

### 2. Audio Storytelling Discovery

"**How will audio contribute to storytelling?**

**Audio storytelling elements:**

- **Ambient sounds** - What do players hear in the world?
- **Music emotional cues** - How does music guide feeling?
- **Voice acting** - How is it used beyond dialogue?
- **Audio logs/recordings** - Found audio content?
- **Sound design** - Sounds that carry meaning

How will audio tell story in {{game_name}}?"

### 3. Found Documents Discovery

"**Will you have found documents?** (Journals, notes, emails, etc.)

If yes, describe:

- **Types of documents** - What forms do they take?
- **How many** - Approximate count
- **What they reveal** - Backstory? World-building? Character?
- **Optional vs required** - Must players find them?
- **Reward for finding** - Achievement? Story unlock? Lore only?

Describe your found documents (or indicate N/A):"

### 4. Generate Environmental Content

Based on the conversation, prepare the content:

```markdown
## Environmental Storytelling

### Visual Storytelling

**Set Dressing:**
{{set_dressing_approach}}

**Environmental Details:**
{{environmental_storytelling_examples}}

**Visual Symbolism:**
{{symbolic_elements}}

**Color and Lighting:**
{{color_lighting_approach}}

---

### Audio Storytelling

**Ambient Design:**
{{ambient_sound_approach}}

**Music Integration:**
{{music_storytelling}}

**Voice Elements:**
{{voice_beyond_dialogue}}

**Sound Design Narrative:**
{{meaningful_sounds}}

---

### Found Documents

{{if_has_documents}}
**Document Types:**
{{document_types}}

**Quantity:** {{approximate_count}}

**Content Focus:**
{{what_documents_reveal}}

**Discovery:**

- Required: {{required_documents}}
- Optional: {{optional_documents}}

**Rewards:** {{finding_rewards}}
{{/if_has_documents}}

{{if_no_documents}}
**Approach:** No found documents
**Rationale:** {{why_no_documents}}
{{/if_no_documents}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've documented the environmental storytelling approach.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Environmental Summary:**

- Visual elements: Defined
- Audio elements: Defined
- Found documents: {{yes_no}}

**Validation Check:**

- Does visual storytelling match your world?
- Is audio approach realistic for scope?
- Are found documents well-integrated?

**Select an Option:**
[A] Advanced Elicitation - Explore environmental depth
[P] Party Mode - Get perspectives on environmental storytelling
[C] Continue - Save this and move to Narrative Delivery (Step 8 of 11)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [environmental content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Visual storytelling approach defined
- Audio storytelling integrated
- Found documents documented (if applicable)
- Elements connect to story themes
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7]

### SYSTEM FAILURE:

- Creating environmental details without user input
- Elements disconnected from story
- Missing audio considerations
- Not presenting A/P/C menu after content
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
