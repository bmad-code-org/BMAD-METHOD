---
name: 'step-03-market'
description: 'Define target audience and market context'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/game-brief'

# File References
thisStepFile: './step-03-market.md'
nextStepFile: './step-04-fundamentals.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-brief.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Target Market

**Progress: Step 3 of 8** - Next: Game Fundamentals

## STEP GOAL:

Define the primary and secondary target audiences with specific demographics, and establish the market context including competitive landscape and timing.

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
- Push for specificity beyond generic descriptions
- Challenge vague answers like "people who like fun games"

### Step-Specific Rules:

- Focus on who will actually play this game
- FORBIDDEN to generate audience without real user input
- Help identify a realistic and reachable audience segment
- Consider secondary audiences if applicable

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Dig deeper into audience insights
- **P (Party Mode)**: Get multiple perspectives on market positioning
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Primary Audience Discovery

**Guide user through audience definition:**

"Let's define who {{game_name}} is really for.

**Primary Audience Questions:**

- **Age range:** Who are you designing for?
- **Gaming experience:** Casual, core, or hardcore gamers?
- **Genre familiarity:** Do they know this genre well, or are they new to it?
- **Play patterns:** When and how do they play? (commute, evening sessions, weekends)
- **Motivations:** What draws them to games like this?

**Push for specificity:**
'People who like roguelikes' is too broad. 'Experienced roguelike fans who want deeper deckbuilding strategy' is better.

Who is your primary audience for {{game_name}}?"

### 2. Secondary Audience Discovery

**Explore additional audiences:**

"Are there secondary audiences who might enjoy {{game_name}}?

**Examples:**

- Primary: Hardcore roguelike fans → Secondary: Strategy game players looking for something new
- Primary: Cozy game fans → Secondary: Burnt-out competitive gamers seeking relaxation

**If you have a secondary audience:**

- How do their needs differ from primary?
- What features might appeal specifically to them?

Do you have a secondary audience in mind?"

### 3. Market Context Discovery

**Explore the competitive landscape:**

"Let's understand the market context for {{game_name}}.

**Market Questions:**

- **Similar successful games:** What games have proven there's an audience?
- **Market gaps:** What's missing that {{game_name}} could fill?
- **Timing:** Why is now the right time for this game?
- **Competition:** Who are you competing with for player attention?
- **Discoverability:** How will players find your game?

What does the market look like for {{game_name}}?"

### 4. Generate Market Content

Based on the conversation, prepare the content:

```markdown
## Target Market

### Primary Audience

{{primary_audience_description}}

**Demographics:**
{{demographics}}

**Gaming Preferences:**
{{gaming_preferences}}

**Motivations:**
{{what_draws_them}}

### Secondary Audience

{{secondary_audience_description}}

### Market Context

{{market_context_analysis}}

**Similar Successful Games:**
{{comparable_titles}}

**Market Opportunity:**
{{why_now}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Target Market section based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Is the primary audience specific enough to guide design decisions?
- Does the market context support the viability of this game?

**Select an Option:**
[A] Advanced Elicitation - Dig deeper into market insights
[P] Party Mode - Get perspectives on market positioning
[C] Continue - Save this and move to Game Fundamentals (Step 4 of 8)"

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

ONLY WHEN [C continue option] is selected and [market content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Primary audience is specific and well-defined
- Secondary audience considered (even if none exists)
- Market context provides business rationale
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3]

### SYSTEM FAILURE:

- Generating audience without user input
- Audience is too vague to guide decisions
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
