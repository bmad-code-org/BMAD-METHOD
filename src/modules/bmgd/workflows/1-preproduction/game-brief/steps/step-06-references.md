---
name: 'step-06-references'
description: 'Define inspiration games, competitive analysis, and key differentiators'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/game-brief'

# File References
thisStepFile: './step-06-references.md'
nextStepFile: './step-07-content.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-brief.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Reference Framework

**Progress: Step 6 of 8** - Next: Content Framework

## STEP GOAL:

Identify inspiration games (what you're drawing from and NOT taking), analyze competition, and define concrete differentiators that make this game worth making.

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
- Challenge "just better" thinking
- Push for genuine, specific differentiation

### Step-Specific Rules:

- Focus on what makes this game unique
- FORBIDDEN to generate references without real user input
- Validate that differentiators are concrete and achievable
- Understand both what you're taking AND what you're avoiding

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Challenge differentiation claims
- **P (Party Mode)**: Get perspectives on uniqueness
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Inspiration Games Discovery

**Guide user through references:**

"Let's identify the games that inspire {{game_name}}.

**For each inspiration game, I want to know:**

1. **What game?**
2. **What are you taking?** (mechanics, feel, art style, structure)
3. **What are you NOT taking?** (equally important!)

**Example:**

- 'From Hades: the combat feel and build variety'
- 'NOT from Hades: the roguelike structure or the dialogue system'

What 3-5 games inspire {{game_name}}, and what specifically are you drawing from each?"

### 2. Competitive Analysis Discovery

**Explore the competition:**

"Now let's analyze your competition.

**Competition Questions:**

- **Direct competitors:** Games that scratch the same itch
- **What they do well:** Why do players love them?
- **What they do poorly:** Where do they fall short?
- **Market positioning:** How crowded is this space?

**For {{game_name}}, who are you competing with?**

Remember: if there are no competitors, that might mean there's no market. Some competition is healthy."

### 3. Differentiators Discovery

**Define unique value:**

"Now for the critical question: What makes {{game_name}} genuinely different?

**Differentiation Test:**

A strong differentiator passes ALL of these:

1. Is it concrete and achievable?
2. Does it matter to your target audience?
3. Can competitors easily copy it?
4. Would you still make the game without it?

**Challenge 'just better' thinking:**
'Better graphics' or 'more content' aren't differentiators - they're expectations.

What 2-4 things make {{game_name}} genuinely different and worth players' attention?"

### 4. Generate References Content

Based on the conversation, prepare the content:

```markdown
## Reference Framework

### Inspiration Games

{{for_each_inspiration}}
**{{game_name}}**

- Taking: {{what_taking}}
- Not Taking: {{what_avoiding}}
  {{/for_each}}

### Competitive Analysis

**Direct Competitors:**
{{competitors_list}}

**Competitor Strengths:**
{{what_they_do_well}}

**Competitor Weaknesses:**
{{where_they_fall_short}}

### Key Differentiators

{{differentiators_with_descriptions}}

**Unique Value Proposition:**
{{one_sentence_why_choose_this}}
```

### 5. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Reference Framework section based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 4]

**Validation Check:**

- Are differentiators genuine, not just features?
- Does the competitive analysis reveal opportunity?
- Are inspirations specific about what you're taking vs avoiding?

**Select an Option:**
[A] Advanced Elicitation - Challenge differentiation claims
[P] Party Mode - Get perspectives on uniqueness
[C] Continue - Save this and move to Content Framework (Step 7 of 8)"

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

ONLY WHEN [C continue option] is selected and [references content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- 3-5 inspiration games with specific takeaways
- Competition analyzed with strengths and weaknesses
- Differentiators are concrete and achievable
- Unique value proposition is clear
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6]

### SYSTEM FAILURE:

- Generating references without user input
- Generic differentiators like "better gameplay"
- Missing the "not taking" aspect of inspirations
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
