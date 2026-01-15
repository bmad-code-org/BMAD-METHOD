---
name: 'step-04-characters'
description: 'Develop all characters including protagonists, antagonists, supporting cast, and their arcs'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-04-characters.md'
nextStepFile: './step-05-world.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Characters

**Progress: Step 4 of 11** - Next: World Building

## STEP GOAL:

Develop all characters: protagonists, antagonists, and supporting cast. Define their backgrounds, motivations, relationships, and character arcs.

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
- Characters should feel like user's creations
- Draw out personality through questions

### Step-Specific Rules:

- FORBIDDEN to create characters without user input
- Guide user through character development
- Ensure characters connect to themes

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into characters
- **P (Party Mode)**: Get perspectives on character design
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Protagonist Discovery

"**Let's develop the protagonist(s) of {{game_name}}.**

For each protagonist, tell me:

- **Name and description** - Who are they?
- **Background** - Where do they come from?
- **Motivation** - What do they want?
- **Strengths** - What are they good at?
- **Flaws** - What holds them back?
- **Internal conflict** - What do they struggle with inside?
- **External conflict** - What obstacles do they face?

Describe your protagonist(s):"

### 2. Antagonist Discovery

"**Now let's develop the antagonist(s).**

Great antagonists:

- Have understandable motivations
- Challenge the protagonist meaningfully
- May have sympathetic elements
- Represent or oppose the themes

For each antagonist:

- **Name and description**
- **Background** - How did they become this way?
- **Goals** - What do they want?
- **Methods** - How do they pursue their goals?
- **Relationship to protagonist**
- **Sympathetic elements** (if any)

Describe your antagonist(s):"

### 3. Supporting Cast Discovery

"**Let's flesh out the supporting characters.**

Common supporting roles:

- **Mentor** - Guides the protagonist
- **Ally/Companion** - Travels with protagonist
- **Foil** - Contrasts protagonist's traits
- **Love interest** - Romantic connection
- **Comic relief** - Lightens tone
- **Informant** - Provides information

For each supporting character:

- **Name and role**
- **Personality and traits**
- **Relationship to protagonist**
- **Function in story**
- **Key scenes/moments**

Describe your supporting characters:"

### 4. Character Arcs Discovery

"**Now let's map character arcs.**

A character arc shows how a character changes (or refuses to change) through the story.

**Arc types:**

- **Positive arc** - Character overcomes flaw, grows
- **Negative arc** - Character falls, corrupts
- **Flat arc** - Character's beliefs tested but hold
- **Transformation** - Character becomes something new

For major characters:

- **Starting state** - Who are they at the beginning?
- **Transformation moments** - What changes them?
- **Ending state** - Who are they at the end?
- **Lessons learned**

Describe the character arcs:"

### 5. Generate Characters Content

Based on the conversation, prepare the content:

```markdown
## Characters

### Protagonist(s)

#### {{protagonist_name}}

**Description:** {{description}}

**Background:** {{background}}

**Motivation:** {{motivation}}

**Strengths:** {{strengths}}

**Flaws:** {{flaws}}

**Conflicts:**

- Internal: {{internal_conflict}}
- External: {{external_conflict}}

---

### Antagonist(s)

#### {{antagonist_name}}

**Description:** {{description}}

**Background:** {{background}}

**Goals:** {{goals}}

**Methods:** {{methods}}

**Relationship to Protagonist:** {{relationship}}

**Sympathetic Elements:** {{if_any}}

---

### Supporting Characters

{{for_each_supporting_character}}

#### {{character_name}}

**Role:** {{role}}
**Personality:** {{personality}}
**Function:** {{story_function}}
**Key Moments:** {{key_scenes}}
{{/for_each}}

---

## Character Arcs

### {{character_name}} Arc

**Starting State:** {{beginning}}

**Transformation Moments:**
{{transformation_points}}

**Ending State:** {{end}}

**Lessons Learned:** {{lessons}}

{{repeat_for_each_major_character}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've documented all characters and their arcs.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**Character Summary:**

- Protagonists: {{count}}
- Antagonists: {{count}}
- Supporting: {{count}}

**Validation Check:**

- Do characters connect to your themes?
- Are arcs meaningful and complete?
- Do relationships create conflict?

**Select an Option:**
[A] Advanced Elicitation - Deep dive into characters
[P] Party Mode - Get perspectives on character design
[C] Continue - Save this and move to World Building (Step 5 of 11)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [characters content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Protagonists fully developed from user input
- Antagonists with clear motivations
- Supporting cast defined with functions
- Character arcs mapped for major characters
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4]

### SYSTEM FAILURE:

- Creating characters without user input
- Flat characters without depth
- Missing character arcs
- Not presenting A/P/C menu after content
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
