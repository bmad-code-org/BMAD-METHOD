---
name: 'step-02-context'
description: 'Load game context from brief and determine the game type'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-02-context.md'
nextStepFile: './step-03-platforms.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Data Files
gameTypesCSV: '{workflow_path}/game-types.csv'
gameTypesFolder: '{workflow_path}/game-types'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: Game Context & Type

**Progress: Step 2 of 14** - Next: Platforms & Audience

## STEP GOAL:

Load and analyze the game brief (if available), determine the game type from game-types.csv, load the corresponding game type guide, and capture the core game concept that will drive the entire GDD.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- We engage in collaborative dialogue, not command-response
- You bring structured game design thinking and facilitation skills, while the user brings their game vision

### Step-Specific Rules:

- Focus on understanding the game concept and determining the correct game type
- CRITICAL: Load game-types.csv to understand available game types
- FORBIDDEN to generate detailed content without real user input
- Approach: Leverage existing documents while validating with user

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating core concept content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2]` before loading next step
- FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper insights about the game concept
- **P (Party Mode)**: Bring multiple perspectives to discuss and improve the game concept
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Execute {advancedElicitationTask}
- When 'P' selected: Execute {partyModeWorkflow}
- PROTOCOLS always return to this step's A/P/C menu
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from step 1 are available
- Input documents already loaded are in memory (game briefs, research, brainstorming)
- **Document counts available in frontmatter `documentCounts`**
- Game types CSV data will be loaded in this step
- This will be the first content section appended to the document

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Read Document State from Frontmatter

**CRITICAL FIRST ACTION:** Read the frontmatter from `{outputFile}` to get document counts.

```
Read documentCounts from gdd.md frontmatter:
- briefCount = documentCounts.briefs
- researchCount = documentCounts.research
- brainstormingCount = documentCounts.brainstorming
- projectDocsCount = documentCounts.projectDocs
```

**ANNOUNCE your understanding:**

"From step 1, I have loaded:

- Game briefs: {{briefCount}} files
- Research: {{researchCount}} files
- Brainstorming: {{brainstormingCount}} files
- Project docs: {{projectDocsCount}} files

{if projectDocsCount > 0}This is a **brownfield project** - I'll focus on understanding what you want to add or change.{else}This is a **greenfield project** - I'll help you define the full game vision.{/if}"

### 2. Load Game Types Data

Load and prepare CSV data for intelligent game type classification:

- Load `{gameTypesCSV}` completely
- Parse columns: id, name, description, key_mechanics, detection_signals
- Store in memory for classification matching

### 3. Begin Discovery Conversation

**SELECT EXACTLY ONE DISCOVERY PATH based on document state:**

---

#### PATH A: Has Game Brief (briefCount > 0)

**Use this path when:** `briefCount > 0`

"As your game design peer, I've reviewed your game brief and have a great starting point. Let me share what I understand and you can refine or correct as needed.

**Based on your game brief:**

**Game Name:**
{{extracted_name_from_brief}}

**Core Concept:**
{{extracted_concept_from_brief}}

**Genre/Type:**
{{extracted_genre_from_brief}}

**Target Experience:**
{{extracted_experience_from_brief}}

{if projectDocsCount > 0}I also see you have existing project documentation. This GDD will define how new features integrate with your existing game.{/if}

**How does this align with your vision?** Should we refine any of these points or are there important aspects I'm missing?"

**AFTER this message, SKIP to Section 4.**

---

#### PATH B: No Brief but Has Brainstorming (briefCount == 0 AND brainstormingCount > 0)

**Use this path when:** `briefCount == 0 AND brainstormingCount > 0`

"As your game design peer, I've reviewed your brainstorming documents.

**Ideas I've extracted:**
{{summarize key concepts from brainstorming}}

Let's crystallize these ideas into a clear game concept:

- What's the core gameplay experience you want to create?
- What genre or type of game is this?
- What's the one thing that makes this game special?

I'll use this to identify the right game type framework for our GDD."

**AFTER this message, SKIP to Section 4.**

---

#### PATH C: No Documents - Greenfield (briefCount == 0 AND brainstormingCount == 0)

**Use this path when:** `briefCount == 0 AND brainstormingCount == 0`

"Let's start by understanding your game vision!

**Tell me about what you want to create:**

- What kind of game is it? (genre, style, references)
- What does the player do? (core actions, moment-to-moment gameplay)
- What makes it special or different?
- What experience or feeling do you want players to have?

I'll be listening for signals to help us identify the right game type framework."

**AFTER this message, SKIP to Section 4.**

---

### 4. Determine Game Type

As the user describes their game, match against `detection_signals` from `game-types.csv`:

#### Game Type Detection Logic

Compare user description against game-types.csv entries:

- Look for keyword matches from semicolon-separated detection_signals
- Examples: "platform;jump;run;2D;side-scroll" -> action-platformer
- Examples: "RPG;level;quest;stats;inventory" -> rpg
- Examples: "story;choices;narrative;dialogue" -> visual-novel

Store the best matching `game_type` id.

### 5. Present Classification for Validation

**Present to user:**

"Based on our conversation, I'm classifying this as:

**Game Type:** {matched_game_type_name} ({matched_game_type_id})

**Why this type:**
{explain the detection signals that matched}

**This game type includes these focus areas:**
{key_mechanics from game-types.csv}

Does this sound right? If not, tell me what type better fits your vision and I'll adjust."

### 6. Load Game Type Guide

**After user confirms game type:**

- Load the corresponding game type guide: `{gameTypesFolder}/{game_type}.md`
- Store the guide content for use in step-07 (game-type specific sections)
- Update frontmatter: `game_type: '{game_type}'`

### 7. Capture Game Name

"What would you like to call this game? (Working title is fine)"

- Store in frontmatter: `game_name: '{user_provided_name}'`

### 8. Generate Core Concept Content

Based on the conversation, prepare the content to append to the document:

#### Content Structure:

```markdown
## Executive Summary

### Game Name

{{game_name}}

### Core Concept

{{description - 2-3 paragraphs describing the game concept}}

### Game Type

**Type:** {{game_type_name}}
**Framework:** This GDD uses the {{game_type}} template with type-specific sections for {{key_mechanics}}
```

### 9. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Executive Summary based on our conversation. This will be the opening section of your GDD.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 8]

**Select an Option:**
[A] Advanced Elicitation - Let's dive deeper and refine this content
[P] Party Mode - Bring in different perspectives to improve this
[C] Continue - Save this and move to Platforms & Audience (Step 3 of 14)"

### 10. Handle Menu Selection

#### IF A (Advanced Elicitation):

- Execute {advancedElicitationTask} with the current content
- Process the enhanced content that comes back
- Ask user: "Accept these changes to the Core Concept? (y/n)"
- If yes: Update the content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### IF P (Party Mode):

- Execute {partyModeWorkflow} with the current content
- Process the collaborative improvements that come back
- Ask user: "Accept these changes to the Core Concept? (y/n)"
- If yes: Update the content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### IF C (Continue):

- Append the final content to `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2]`, `game_type: '{game_type}'`, `game_name: '{game_name}'`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [core concept content finalized and saved to document with frontmatter updated including game_type and game_name], will you then load and read fully `{nextStepFile}` to execute and begin platforms definition.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Document counts read from frontmatter and announced
- Game types CSV loaded and used effectively
- **Correct discovery path selected based on document counts**
- Input documents analyzed and leveraged for head start
- Game type identified and validated with user
- Game type guide loaded and stored for later use
- Game name captured and stored in frontmatter
- Core concept content generated collaboratively
- A/P/C menu presented and handled correctly
- Content properly appended to document when C selected
- Frontmatter updated with stepsCompleted: [1, 2], game_type, game_name

### SYSTEM FAILURE:

- **Not reading documentCounts from frontmatter first**
- **Executing multiple discovery paths instead of exactly one**
- Not loading game-types.csv for classification
- Not validating game type with user before proceeding
- Generating detailed content without real user input
- Not loading the game type guide file
- Not capturing game name
- Not presenting A/P/C menu after content generation
- Appending content without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
