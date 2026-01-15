---
name: 'step-07-content'
description: 'Define content framework, art/audio direction, and risk assessment'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/game-brief'

# File References
thisStepFile: './step-07-content.md'
nextStepFile: './step-08-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-brief.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 7: Content & Production

**Progress: Step 7 of 8** - Next: Final Review

## STEP GOAL:

Define the content framework (world, narrative approach, volume), art and audio direction, and assess key risks with mitigation strategies.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Ensure art/audio vision aligns with budget and team
- Facilitate honest risk assessment

### Step-Specific Rules:

- Focus on production realities
- FORBIDDEN to generate content framework without user input
- Flag content-heavy areas that need planning
- Prioritize risks by impact and likelihood

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into risks
- **P (Party Mode)**: Get perspectives on feasibility
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. World & Setting Discovery

**Explore the game's world:**

"Let's define the world of {{game_name}}.

**World Questions:**

- **Setting:** Where and when does this take place?
- **World-building depth:** How much lore matters?
- **Narrative importance:** Story-driven or story-light?
- **Atmosphere:** What mood should the world evoke?

Describe the world and setting for {{game_name}}."

### 2. Narrative Approach Discovery

**Define storytelling strategy:**

"How will {{game_name}} handle narrative?

**Narrative Approaches:**

| Approach          | Examples                                  |
| ----------------- | ----------------------------------------- |
| **Story-Driven**  | Linear narrative with cutscenes, dialogue |
| **Environmental** | Story told through world, items, visuals  |
| **Emergent**      | Player creates their own stories          |
| **Minimal**       | Pure gameplay, little to no story         |

**Questions:**

- How is story delivered? (cutscenes, dialogue, text, environmental)
- Is there a dedicated narrative workflow needed later?

What's the narrative approach for {{game_name}}?"

### 3. Art & Audio Direction Discovery

**Establish aesthetic vision:**

"Let's define the look and sound of {{game_name}}.

**Visual Style:**

- Art style (pixel, low-poly, stylized 3D, realistic)
- Color palette and mood
- Reference games or images
- Animation complexity

**Audio Style:**

- Music genre and mood
- Sound effect approach
- Voice acting scope (none, grunts, partial, full)

**Production Reality:**

- What can be created in-house?
- What needs outsourcing?
- Are asset store/AI tools acceptable?

Describe the art and audio direction for {{game_name}}."

### 4. Risk Assessment Discovery

**Facilitate honest risk evaluation:**

"Now let's honestly assess the risks for {{game_name}}.

**Risk Categories:**

| Category      | Questions                               |
| ------------- | --------------------------------------- |
| **Technical** | Unproven systems? Performance concerns? |
| **Market**    | Saturated genre? Discoverability?       |
| **Scope**     | Too ambitious? Feature creep?           |
| **Team**      | Skill gaps? Availability?               |
| **Financial** | Runway? Unexpected costs?               |

**For each major risk:**

- What could go wrong?
- How likely is it?
- What's the impact if it happens?
- How can we mitigate it?

What are the key risks for {{game_name}}?"

### 5. Generate Content & Production Content

Based on the conversation, prepare the content:

```markdown
## Content Framework

### World and Setting

{{world_setting_description}}

### Narrative Approach

{{narrative_approach}}

**Story Delivery:** {{how_story_delivered}}

### Content Volume

{{content_volume_estimates}}

---

## Art and Audio Direction

### Visual Style

{{visual_style_description}}

**References:** {{reference_games_or_images}}

### Audio Style

{{audio_direction}}

### Production Approach

{{production_strategy}}

---

## Risk Assessment

### Key Risks

{{prioritized_risk_list}}

### Technical Challenges

{{technical_risks}}

### Market Risks

{{market_risks}}

### Mitigation Strategies

{{mitigation_strategies}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Content & Production section based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**Validation Check:**

- Does art/audio align with budget and team?
- Have we identified the biggest risks?
- Are mitigations actionable?

**Select an Option:**
[A] Advanced Elicitation - Deep dive into risks
[P] Party Mode - Get perspectives on feasibility
[C] Continue - Save this and move to Final Review (Step 8 of 8)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- World and setting clearly defined
- Narrative approach documented
- Art/audio direction established
- Risks prioritized with mitigations
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7]

### SYSTEM FAILURE:

- Generating content without user input
- Art/audio vision misaligned with resources
- Missing major risk categories
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
