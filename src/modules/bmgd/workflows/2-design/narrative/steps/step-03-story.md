---
name: 'step-03-story'
description: 'Define major story beats and narrative pacing'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-03-story.md'
nextStepFile: './step-04-characters.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Story Beats

**Progress: Step 3 of 11** - Next: Characters

## STEP GOAL:

Define the major story beats (key narrative moments) and establish pacing and flow throughout the game experience.

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
- Story beats are the skeleton of the narrative
- Help user identify key moments, don't create them

### Step-Specific Rules:

- FORBIDDEN to generate story beats without user input
- Guide user through beat mapping
- Connect beats to structure defined in Step 2

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Explore beats and connections
- **P (Party Mode)**: Get perspectives on pacing
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Story Beats Discovery

"**Let's map the major story beats for {{game_name}}.**

Story beats are significant events that drive the narrative forward.

**Key beat types:**

- **Inciting Incident** - What sets the story in motion?
- **Plot Points** - Major turning points
- **Midpoint** - Central pivot moment
- **Climax** - Highest tension point
- **Resolution** - How things conclude

**Based on your {{structure_type}} structure, list 10-20 key moments.**

Format:

1. [Beat name] - Brief description
2. [Beat name] - Brief description

What are the major story beats for {{game_name}}?"

### 2. Beat Placement

"**Now let's place these beats within your structure.**

For {{structure_type}}:

**Act 1 beats:**
Which of your beats belong in the setup/introduction?

**Act 2 beats:**
Which beats drive the main conflict/development?

**Act 3 beats:**
Which beats resolve the story?

Let's organize your beats:"

### 3. Pacing Discovery

"**Let's define the pacing and flow.**

**Pacing considerations:**

| Aspect              | Options                           |
| ------------------- | --------------------------------- |
| **Overall tempo**   | Slow burn vs. fast-paced          |
| **Tension pattern** | Escalating vs. waves              |
| **Story density**   | Heavy sections vs. light sections |
| **Player agency**   | Mandatory vs. optional content    |

**Questions:**

- When should tension be highest?
- Where are the breathing room moments?
- How much story per gameplay hour?

Describe the pacing for {{game_name}}:"

### 4. Generate Story Content

Based on the conversation, prepare the content:

```markdown
## Story Beats

### Major Story Beats

{{beats_list_with_descriptions}}

### Beat Placement by Act

**Act 1: Setup**
{{act1_beats}}

**Act 2: Confrontation**
{{act2_beats}}

**Act 3: Resolution**
{{act3_beats}}

---

## Pacing and Flow

### Narrative Tempo

{{pacing_description}}

### Tension Curve

{{tension_pattern}}

### Story Density

{{density_by_section}}

### Key Moments

**Highest tension:** {{peak_moment}}
**Emotional climax:** {{emotional_peak}}
**Resolution beat:** {{resolution_moment}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've mapped out the story beats and pacing.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Are all major moments captured?
- Does pacing match your vision?
- Are beats properly distributed?

**Select an Option:**
[A] Advanced Elicitation - Explore beats and connections
[P] Party Mode - Get perspectives on pacing
[C] Continue - Save this and move to Characters (Step 4 of 11)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [story content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- 10-20 story beats identified from user input
- Beats organized by act/structure
- Pacing and flow defined
- Tension curve established
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3]

### SYSTEM FAILURE:

- Generating beats FOR user
- Beats not connected to structure
- Missing pacing considerations
- Not presenting A/P/C menu after content
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
