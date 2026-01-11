---
name: 'step-06-dialogue'
description: 'Define dialogue style, key conversations, and branching systems'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-06-dialogue.md'
nextStepFile: './step-07-environmental.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Dialogue Systems

**Progress: Step 6 of 11** - Next: Environmental Storytelling

## STEP GOAL:

Define dialogue style, key conversations, and branching dialogue systems if applicable.

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
- Dialogue is how characters come alive
- Style should match tone and setting

### Step-Specific Rules:

- FORBIDDEN to write dialogue without user direction
- Define style and systems, not actual dialogue
- Consider technical implementation implications

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Explore dialogue depth
- **P (Party Mode)**: Get perspectives on dialogue approach
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Dialogue Style Discovery

"**Let's define how characters speak in {{game_name}}.**

**Style considerations:**

| Aspect        | Options                      |
| ------------- | ---------------------------- |
| **Formality** | Formal ←→ Casual             |
| **Period**    | Period-appropriate ←→ Modern |
| **Length**    | Verbose ←→ Concise           |
| **Humor**     | Serious ←→ Comedic           |
| **Profanity** | None ←→ Heavy                |

**Questions:**

- How do different characters speak differently?
- Are there speech patterns or verbal tics?
- What's the overall voice of the game?

Describe your dialogue style:"

### 2. Key Conversations Discovery

"**List key conversations/dialogue moments.**

For each important conversation:

- **Who is involved?**
- **When does it occur?**
- **What's discussed?**
- **Narrative purpose** - What does it accomplish?
- **Emotional tone**

What are the key conversations in {{game_name}}?"

### 3. Branching Dialogue Discovery

"**Does {{game_name}} have branching dialogue?**

If yes, describe:

- **How many branches/paths?**
- **What determines branches?** (player choice, stats, flags)
- **Do branches converge or stay separate?**
- **How much unique dialogue?**
- **What are the consequences of choices?**

Describe your branching system (or indicate N/A):"

### 4. Generate Dialogue Content

Based on the conversation, prepare the content:

```markdown
## Dialogue Framework

### Dialogue Style

**Overall Voice:** {{dialogue_voice}}

**Style Elements:**

- Formality: {{formality_level}}
- Period: {{period_style}}
- Verbosity: {{verbosity}}
- Humor: {{humor_level}}
- Profanity: {{profanity_level}}

**Character Voice Distinctions:**
{{how_characters_differ}}

---

### Key Conversations

{{for_each_conversation}}

#### {{conversation_name}}

**Participants:** {{who}}
**When:** {{timing}}
**Topic:** {{what_discussed}}
**Purpose:** {{narrative_function}}
**Tone:** {{emotional_tone}}
{{/for_each}}

---

### Branching Dialogue System

{{if_branching}}
**System Type:** {{branching_type}}

**Branch Triggers:** {{what_causes_branches}}

**Branch Scope:**

- Total branches: {{branch_count}}
- Convergence: {{do_they_converge}}
- Unique content: {{percentage_unique}}

**Consequence System:**
{{how_choices_matter}}
{{/if_branching}}

{{if_not_branching}}
**System:** Linear dialogue
**Notes:** {{why_linear}}
{{/if_not_branching}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've documented the dialogue framework.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Dialogue Summary:**

- Style: {{style_summary}}
- Key conversations: {{count}}
- Branching: {{yes_no}}

**Validation Check:**

- Does style match your tone?
- Are key conversations identified?
- Is branching scope realistic?

**Select an Option:**
[A] Advanced Elicitation - Explore dialogue depth
[P] Party Mode - Get perspectives on dialogue approach
[C] Continue - Save this and move to Environmental Storytelling (Step 7 of 11)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [dialogue content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Dialogue style clearly defined
- Key conversations identified
- Branching system documented (if applicable)
- Style matches game tone
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6]

### SYSTEM FAILURE:

- Writing actual dialogue without direction
- Style disconnected from tone
- Missing branching documentation
- Not presenting A/P/C menu after content
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
