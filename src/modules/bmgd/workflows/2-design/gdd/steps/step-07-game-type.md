---
name: 'step-07-game-type'
description: 'Process game-type specific sections from the loaded game type guide'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-07-game-type.md'
nextStepFile: './step-08-progression.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Game Type Resources
gameTypesFolder: '{workflow_path}/game-types'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 7: Game Type Specifics

**Progress: Step 7 of 14** - Next: Progression & Balance

## STEP GOAL:

Process the game-type specific sections from the loaded game type guide ({game_type}.md). Each game type has unique sections that must be addressed (e.g., RPGs need character systems, platformers need movement feel, etc.).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Game type guides contain expert knowledge for specific genres
- This step varies significantly based on game type

### Step-Specific Rules:

- CRITICAL: Load and process the game type guide file
- Each section in the guide should be elicited from user
- FORBIDDEN to generate type-specific content without user input
- Some game types have optional sections - respect them

## EXECUTION PROTOCOLS:

- Load the game type guide from `{gameTypesFolder}/{game_type}.md`
- Process each section in the guide sequentially
- Present A/P/C menu after completing all type-specific sections
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into genre-specific elements
- **P (Party Mode)**: Get genre expert perspectives
- **C (Continue)**: Save the content to the document and proceed to next step

## CONTEXT BOUNDARIES:

- Game type was determined in step 2 and stored in frontmatter
- Game type guide should already be loaded in memory from step 2
- All previous context (pillars, mechanics, etc.) available
- Type-specific content goes in the {{GAME_TYPE_SPECIFIC_SECTIONS}} placeholder

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load Game Type Guide

**CRITICAL FIRST ACTION:**

- Read `game_type` from frontmatter
- If not already loaded, load `{gameTypesFolder}/{game_type}.md`
- Parse the guide to identify all sections that need elicitation

**Announce to user:**

"Now we'll work through the **{{game_type}}** specific sections. This game type has unique design elements that we need to define.

**{{game_type}} requires these specific sections:**
{list_sections_from_game_type_guide}

Let's work through each one."

### 2. Process Each Section from Guide

**For each section defined in the game type guide:**

The game type guide will have sections marked with placeholders like `{{section_name}}`. For each:

1. **Read the guidance** in the guide for this section
2. **Present the guidance and questions** to the user
3. **Elicit user input** for this specific section
4. **Store the content** for final assembly

**Example flow for an RPG game type:**

"**Character System**

Your game type guide suggests addressing:

- Character creation options
- Attribute/stat system
- Class or build system
- Character progression path

{guidance_from_guide}

How do you want the character system to work in {{game_name}}?"

### 3. Handle Optional Sections

Some game type guides have optional sections marked with `[optional]` or similar:

- Present optional sections to user
- Ask: "This section is optional for {{game_type}}. Would you like to define {{section_name}}?"
- If yes: elicit content
- If no: skip and note as "Not applicable for this game"

### 4. Handle Narrative Flags

Some game type guides include narrative flags:

- `<narrative-workflow-critical>` - Story is essential for this game type
- `<narrative-workflow-recommended>` - Story would enhance this game type

If flag found:

- Store `needs_narrative = true` for use in step 14
- Note to user: "This game type typically benefits from dedicated narrative design. We'll address this in the final step."

### 5. Generate Game Type Content

Based on all elicited sections, prepare the content:

```markdown
## {{game_type_name}} Specific Design

{{assembled_sections_from_guide_elicitation}}
```

The content structure will vary based on game type:

**Example for RPG:**

```markdown
## RPG Specific Design

### Character System

{{character_system_content}}

### Combat System

{{combat_system_content}}

### Inventory & Equipment

{{inventory_content}}

### Quest System

{{quest_system_content}}
```

**Example for Platformer:**

```markdown
## Platformer Specific Design

### Movement Feel

{{movement_feel_content}}

### Jump Mechanics

{{jump_mechanics_content}}

### Hazards & Enemies

{{hazards_content}}

### Collectibles

{{collectibles_content}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the {{game_type}} Specific Design sections based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**Validation Check:**

- Does each section align with your core pillars?
- Have we covered all required elements for {{game_type}}?
- Any genre conventions you want to subvert?

**Select an Option:**
[A] Advanced Elicitation - Deep dive into genre specifics
[P] Party Mode - Get genre expert perspectives
[C] Continue - Save this and move to Progression & Balance (Step 8 of 14)"

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

- Append the final content to `{outputFile}` in place of {{GAME_TYPE_SPECIFIC_SECTIONS}}
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]`
- If `needs_narrative` flag was set, store in frontmatter
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [game type content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Game type guide loaded and parsed
- All required sections elicited from user
- Optional sections offered and handled appropriately
- Narrative flags detected and stored
- Content matches game type guide structure
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7]

### SYSTEM FAILURE:

- Not loading the game type guide file
- Generating type-specific content without user input
- Missing required sections from the guide
- Ignoring narrative flags
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
