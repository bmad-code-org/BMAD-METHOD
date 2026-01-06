---
name: 'step-03-ideation'
description: 'Execute the brainstorming session with game-specific techniques'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/brainstorm-game'

# File References
thisStepFile: '{workflow_path}/steps/step-03-ideation.md'
nextStepFile: '{workflow_path}/steps/step-04-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/brainstorming-session-{date}.md'

# Core Brainstorming Reference
coreBrainstorming: '{project-root}/_bmad/core/workflows/brainstorming/workflow.yaml'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Ideation Session

**Progress: Step 3 of 4** - Next: Complete Session

## STEP GOAL:

Facilitate the actual brainstorming session using selected techniques. Capture all ideas, concepts, and insights generated during the session.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a creative game design facilitator
- Draw out user's ideas - don't generate for them
- Use techniques to unlock creativity
- ALL ideas are valid during brainstorming

### Step-Specific Rules:

- Apply selected techniques from Step 2
- Capture EVERY idea, no matter how wild
- Build on ideas rather than criticize
- User drives the ideation; you facilitate

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after ideation session
- ONLY proceed when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Dig deeper into promising ideas
- **P (Party Mode)**: Get multiple perspectives on concepts
- **C (Continue)**: Save ideas and complete session

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Begin Ideation Session

**Start the brainstorming:**

"**Let's Start Brainstorming!**

Based on your selected approach ({{selected_mode}}), let's explore game ideas.

**First Question:**
What kind of game experience are you drawn to?

Think about:

- A feeling you want players to have
- A mechanic you find compelling
- A theme or setting that excites you
- A problem you want to solve through games

Share whatever comes to mind:"

### 2. Apply Selected Techniques

**Based on mode selected in Step 2:**

**For Guided Mode:**
Walk through each technique sequentially:

1. **Player Fantasy Mining**
   "What fantasy does your player want to fulfill? Being a hero? Building an empire? Surviving? Exploring? Describe the core fantasy."

2. **Core Loop Brainstorming**
   "What's the central action players repeat? Think: [Action] → [Reward/Feedback] → [Motivation to continue]"

3. **MDA Framework**
   "Let's explore: What Aesthetics (emotions)? What Dynamics (behaviors)? What Mechanics enable them?"

4. **Genre Mashup**
   "What two unexpected genres could combine? Example: 'Puzzle + Horror' = tension through problem-solving"

**For Selective Mode:**
Present technique menu, execute chosen techniques.

**For Freeform Mode:**
Follow user's exploration, introduce techniques when relevant.

**For YOLO Mode:**
Drive comprehensive exploration using all techniques.

### 3. Capture Ideas Throughout

**For EACH idea generated:**

Add to running list:

```markdown
### Idea: {{idea_title}}

**Source Technique:** {{technique_used}}
**Description:** {{idea_description}}
**Potential:** {{quick_assessment}}
**Build-on ideas:** {{related_concepts}}
```

### 4. Probe for Depth

**Throughout the session:**

Use probing questions:

- "What makes that exciting to you?"
- "How would that feel moment-to-moment?"
- "What's the twist that makes it unique?"
- "What game does this remind you of, and how is it different?"
- "What would the 'aha' moment be?"

### 5. Build Idea Connections

**As ideas accumulate:**

"I'm noticing some connections:

- {{idea_1}} and {{idea_2}} share {{common_element}}
- {{idea_3}} could be the 'twist' for {{idea_4}}

Should we explore these combinations?"

### 6. Session Checkpoint

**After sufficient ideation:**

"**Brainstorming Progress**

We've generated {{idea_count}} ideas so far:

**Top Concepts:**
{{summary_of_strongest_ideas}}

**Themes Emerging:**
{{recurring_themes}}

**Would you like to:**

1. Continue exploring (more techniques)
2. Deep dive into a specific concept
3. Wrap up and save what we have

Your choice:"

### 7. Generate Ideation Section

Based on all ideas captured, prepare the content:

```markdown
## Ideas Generated

### Concept 1: {{concept_name}}

{{full_concept_description}}

**Core Elements:**

- {{element_1}}
- {{element_2}}

**Questions to Explore:**

- {{question_1}}
- {{question_2}}

---

### Concept 2: {{concept_name}}

{{repeat_structure}}

---

## Themes and Patterns

{{observed_themes}}

## Promising Combinations

{{combination_ideas}}

## Raw Ideas List

{{all_ideas_bullet_points}}
```

### 8. Present Content and Menu

Show the generated content to the user and present:

"**Ideation Session Summary**

Here's everything we captured:

[Show the complete markdown content from step 7]

**Session Stats:**

- Ideas generated: {{count}}
- Concepts developed: {{count}}
- Themes identified: {{count}}

**Select an Option:**
[A] Advanced Elicitation - Dig deeper into promising ideas
[P] Party Mode - Get multiple perspectives on concepts
[C] Continue - Save ideas and complete session (Step 4 of 4)"

### 9. Handle Menu Selection

#### IF A (Advanced Elicitation):

- Deep dive into selected concepts
- Ask user: "Accept these additions? (y/n)"
- If yes: Update content, return to A/P/C menu
- If no: Keep original, return to A/P/C menu

#### IF P (Party Mode):

- Get diverse perspectives on concepts
- Ask user: "Accept these perspectives? (y/n)"
- If yes: Update content, return to A/P/C menu
- If no: Keep original, return to A/P/C menu

#### IF C (Continue):

- Append the ideation section to `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [ideation content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- User drove the ideation
- Multiple techniques applied
- All ideas captured without judgment
- Connections and themes identified
- Ideas organized and summarized
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3]

### SYSTEM FAILURE:

- Generating ideas FOR the user instead of WITH them
- Dismissing or criticizing ideas during session
- Not capturing all ideas
- Rushing through techniques
- Not presenting A/P/C menu after ideation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
