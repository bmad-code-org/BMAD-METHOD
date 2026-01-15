---
name: 'step-04-vision'
description: 'Define project goals, context, and unique selling points'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-04-vision.md'
nextStepFile: './step-05-core-gameplay.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Goals & Vision

**Progress: Step 4 of 14** - Next: Core Gameplay

## STEP GOAL:

Define the project goals, background context for why this game matters now, and the unique selling points that differentiate this game from others in the market.

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
- Vision and USPs are critical for maintaining focus throughout development

### Step-Specific Rules:

- Focus on the "why" behind this game project
- FORBIDDEN to generate goals/USPs without real user input
- Help user articulate what makes their game worth making
- Approach: Challenge assumptions about differentiation

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step
- FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Dig deeper into goals and differentiation
- **P (Party Mode)**: Challenge and strengthen the vision with multiple perspectives
- **C (Continue)**: Save the content to the document and proceed to next step

## CONTEXT BOUNDARIES:

- Game type, platform, and audience from previous steps are available
- Goals should be achievable and measurable where possible
- USPs must be genuinely differentiating, not just features

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Goals Discovery

**Guide user through goal definition:**

"Let's define what success looks like for {{game_name}}.

**Types of Goals to Consider:**

| Goal Type         | Examples                                             |
| ----------------- | ---------------------------------------------------- |
| **Creative**      | "Create a game that makes players feel powerful"     |
| **Technical**     | "Ship a stable 60fps experience on target platforms" |
| **Business**      | "Achieve 10,000 wishlists before launch"             |
| **Personal**      | "Learn Godot through this project"                   |
| **Player Impact** | "Create a speedrunning community"                    |

**Questions to consider:**

1. What does success look like for this project?
2. What would make you proud to have shipped this?
3. Are there specific metrics you want to hit?

What are your 2-4 main goals for {{game_name}}?"

### 2. Context Discovery

**Guide user through background context:**

"Now let's capture why this game matters right now.

**Context Questions:**

- **Motivation:** What inspired you to make this game?
- **Timing:** Why is now the right time for this game?
- **Gap:** What's missing in the market that this fills?
- **Personal:** What unique perspective or experience do you bring?

Tell me the story behind {{game_name}}. Why are you making this?"

### 3. USP Discovery

**Guide user through unique selling points:**

"Now for the critical question: What makes {{game_name}} different?

**USP Framework:**

A strong USP answers: "Why would someone play THIS game instead of the alternatives?"

**Categories of Differentiation:**

- **Mechanical Innovation:** New gameplay systems or combinations
- **Narrative/World:** Unique setting, story, or characters
- **Art/Audio:** Distinctive aesthetic or soundscape
- **Audience Focus:** Serving an underserved player segment
- **Technical:** Performance, accessibility, or platform features

**For {{game_type}} games, common USPs include:**
{typical_usps_for_game_type}

But what's YOUR unique angle?

**Challenge Questions:**

1. If I removed your USP, would the game still be interesting?
2. Can another developer easily copy this USP?
3. Does this USP matter to your target audience?

What 2-4 things make {{game_name}} genuinely different?"

### 4. Generate Vision Content

Based on the conversation, prepare the content:

```markdown
## Goals and Context

### Project Goals

{{goals_list_with_descriptions}}

### Background and Rationale

{{context_narrative}}

---

## Unique Selling Points (USPs)

{{usps_with_descriptions}}

### Competitive Positioning

{{how_this_game_stands_out_in_the_market}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Goals & Vision sections based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Select an Option:**
[A] Advanced Elicitation - Challenge and strengthen these points
[P] Party Mode - Get other perspectives on differentiation
[C] Continue - Save this and move to Core Gameplay (Step 5 of 14)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [vision content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- 2-4 clear, achievable goals defined
- Background context captures the "why"
- USPs are genuinely differentiating, not just features
- Competitive positioning is clear
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4]

### SYSTEM FAILURE:

- Generating generic goals without user input
- USPs that are just feature lists, not differentiation
- Not challenging weak USPs
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
