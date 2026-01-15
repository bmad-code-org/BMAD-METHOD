---
name: 'step-06-mechanics'
description: 'Define primary game mechanics and control schemes'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-06-mechanics.md'
nextStepFile: './step-07-game-type.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Game Mechanics

**Progress: Step 6 of 14** - Next: Game Type Specifics

## STEP GOAL:

Define the primary game mechanics that players interact with and the control scheme/input methods for the target platform(s).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- Mechanics must serve the pillars and core loop defined in step 5
- Controls must work for the target platform defined in step 3

### Step-Specific Rules:

- Focus on moment-to-moment player interactions
- FORBIDDEN to generate mechanics without real user input
- Challenge: Does each mechanic serve a pillar?
- Approach: Start with verbs - what does the player DO?

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6]` before loading next step
- FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into mechanic interactions and edge cases
- **P (Party Mode)**: Test mechanic clarity with multiple perspectives
- **C (Continue)**: Save the content to the document and proceed to next step

## CONTEXT BOUNDARIES:

- All previous context available (especially pillars and platform)
- Mechanics are the building blocks of gameplay
- Controls must feel good on target platform(s)

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Primary Mechanics Discovery

**Guide user through mechanics definition:**

"Let's define the primary mechanics - the core actions players perform to engage with your game.

**Mechanics Framework:**

Think in terms of VERBS - what does the player DO?

| Mechanic Category | Example Verbs                            |
| ----------------- | ---------------------------------------- |
| **Movement**      | Run, jump, dash, climb, swim, fly        |
| **Combat**        | Attack, block, dodge, parry, aim, shoot  |
| **Interaction**   | Talk, pickup, use, craft, build, destroy |
| **Resource**      | Collect, spend, trade, manage, invest    |
| **Information**   | Discover, read, scan, analyze, remember  |
| **Social**        | Cooperate, compete, trade, communicate   |

**For {{game_type}} games, key mechanics typically include:**
{typical_mechanics_for_game_type}

**Your core loop is:** {{core_loop}}
**Your pillars are:** {{pillars}}

**Questions to consider:**

1. What are the 3-5 most important things players do?
2. Which mechanics support which pillars?
3. How do mechanics combine or interact?

What are the primary mechanics in {{game_name}}?"

### 2. Mechanics Deep Dive

**For each mechanic identified, ask:**

"Let's detail **{{mechanic_name}}**:

- **When does the player use this?** (constantly, situationally, rarely)
- **What skill does it test?** (timing, positioning, strategy, knowledge)
- **How does it feel?** (snappy, weighty, floaty, precise)
- **How does it progress?** (unlocks, upgrades, mastery)
- **How does it interact with other mechanics?**"

### 3. Controls Discovery

**Guide user through control scheme definition:**

"Now let's map these mechanics to controls for {{primary_platform}}.

**Control Considerations:**

| Platform    | Key Considerations                                                 |
| ----------- | ------------------------------------------------------------------ |
| **PC**      | Keyboard/mouse precision, rebindable keys, many available inputs   |
| **Console** | Limited buttons, shoulder triggers, stick deadzone, rumble         |
| **Mobile**  | Touch targets, gesture clarity, screen real estate, one-hand play? |
| **VR**      | Motion control, tracked hands, comfort, physical space             |

**Control Design Principles:**

1. **Frequency = Accessibility:** Common actions get easy-to-reach inputs
2. **Similar actions, similar buttons:** Jump/interact shouldn't be opposite hands
3. **No hand gymnastics:** Avoid requiring uncomfortable button combos
4. **Platform conventions:** Use expected mappings where appropriate

**For {{game_type}} on {{platform}}, typical control schemes include:**
{typical_controls_for_game_type_and_platform}

How do you want controls to work in {{game_name}}?"

### 4. Generate Mechanics Content

Based on the conversation, prepare the content:

```markdown
## Game Mechanics

### Primary Mechanics

{{mechanics_list_with_details}}

### Mechanic Interactions

{{how_mechanics_combine}}

### Mechanic Progression

{{how_mechanics_evolve_or_unlock}}

---

## Controls and Input

### Control Scheme ({{primary_platform}})

{{control_mapping_table_or_description}}

### Input Feel

{{how_controls_should_feel}}

### Accessibility Controls

{{planned_accessibility_options}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Mechanics & Controls sections based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Does each mechanic serve at least one pillar?
- Do controls feel natural for the platform?
- Are common actions easily accessible?

**Select an Option:**
[A] Advanced Elicitation - Deep dive into mechanic feel and edge cases
[P] Party Mode - Test these mechanics with other perspectives
[C] Continue - Save this and move to Game Type Specifics (Step 7 of 14)"

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

ONLY WHEN [C continue option] is selected and [mechanics content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- 3-5 primary mechanics clearly defined
- Each mechanic linked to pillars
- Mechanic interactions described
- Control scheme appropriate for platform
- Input feel considerations captured
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6]

### SYSTEM FAILURE:

- Mechanics that don't serve pillars
- Controls inappropriate for target platform
- Generating content without real user input
- Missing mechanic interactions
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
