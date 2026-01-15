---
name: 'step-05-scope'
description: 'Define project scope including platforms, constraints, and resources'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/game-brief'

# File References
thisStepFile: './step-05-scope.md'
nextStepFile: './step-06-references.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-brief.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Scope & Constraints

**Progress: Step 5 of 8** - Next: Reference Framework

## STEP GOAL:

Define realistic project constraints including target platforms, budget considerations, team resources, and technical constraints. Push for realism about scope.

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
- Push for realism about constraints
- Identify potential blockers early

### Step-Specific Rules:

- Focus on establishing realistic boundaries
- FORBIDDEN to generate scope without real user input
- Help identify skill gaps and resource assumptions
- Document constraints that will affect design decisions

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after generating content
- ONLY save when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Challenge assumptions about scope
- **P (Party Mode)**: Get perspectives on feasibility
- **C (Continue)**: Save the content and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Platform Discovery

**Guide user through platform selection:**

"Let's define where {{game_name}} will be played.

**Platform Considerations:**

| Platform       | Key Considerations                                      |
| -------------- | ------------------------------------------------------- |
| **PC (Steam)** | Keyboard/mouse, largest indie audience, most flexible   |
| **Console**    | Controller-first, certification, couch play             |
| **Mobile**     | Touch controls, short sessions, different monetization  |
| **Web**        | Instant access, file size limits, browser compatibility |
| **VR**         | Specialized hardware, motion controls, comfort          |

**Questions to consider:**

- Where does your target audience primarily play?
- Which platform(s) are you targeting for launch?
- Are there secondary platforms for later?

What platform(s) are you targeting for {{game_name}}?"

### 2. Budget Considerations

**Explore financial constraints:**

"Let's be realistic about budget constraints.

**Budget Categories:**

- **Development costs:** Tools, software, hardware
- **Asset creation:** Art, audio, music (in-house vs outsource)
- **Marketing:** Visibility, trailers, press
- **Platform fees:** Store cuts, devkit costs
- **External services:** Servers, analytics, localization

**Questions to consider:**

- What's your budget reality? (self-funded, funded, shoestring)
- What can you create yourself vs need to outsource?
- Are there areas where budget will limit scope?

What are the budget considerations for {{game_name}}?"

### 3. Team Resources Discovery

**Assess team capabilities:**

"Let's understand what team resources you have.

**Resource Questions:**

- **Team size:** Solo, small team, larger team?
- **Roles covered:** Design, programming, art, audio, marketing?
- **Availability:** Full-time, part-time, nights/weekends?
- **Skill gaps:** What expertise is missing?
- **Outsourcing:** What might need external help?

What team resources do you have for {{game_name}}?"

### 4. Technical Constraints Discovery

**Identify technical boundaries:**

"Finally, let's identify technical constraints.

**Technical Considerations:**

- **Engine/framework:** Already decided or open?
- **Performance targets:** Frame rate, file size, load times?
- **Technical experience:** Team's technical capabilities?
- **Accessibility:** What accessibility features are required?
- **Online features:** Multiplayer, leaderboards, cloud saves?

What technical constraints apply to {{game_name}}?"

### 5. Generate Scope Content

Based on the conversation, prepare the content:

```markdown
## Scope and Constraints

### Target Platforms

**Primary:** {{primary_platform}}
**Secondary:** {{secondary_platforms}}

### Budget Considerations

{{budget_overview}}

### Team Resources

{{team_composition}}

**Skill Gaps:** {{identified_gaps}}

### Technical Constraints

{{technical_constraints}}

### Scope Realities

{{scope_acknowledgements}}
```

### 6. Present Content and Menu

Show the generated content to the user and present:

"I've drafted the Scope & Constraints section based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 5]

**Validation Check:**

- Are these constraints realistic?
- Have we identified potential blockers?
- Is the scope achievable with these resources?

**Select an Option:**
[A] Advanced Elicitation - Challenge scope assumptions
[P] Party Mode - Get perspectives on feasibility
[C] Continue - Save this and move to Reference Framework (Step 6 of 8)"

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
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [scope content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Target platforms clearly defined
- Budget constraints documented realistically
- Team resources and gaps identified
- Technical constraints established
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5]

### SYSTEM FAILURE:

- Generating scope without user input
- Unrealistic constraints that set project up for failure
- Missing critical blockers
- Not presenting A/P/C menu after content generation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
