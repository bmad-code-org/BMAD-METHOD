---
name: 'step-04-complete'
description: 'Complete the brainstorming session with summary and next steps'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/brainstorm-game'

# File References
thisStepFile: './step-04-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/brainstorming-session-{date}.md'

# Handoff References
gameBriefWorkflow: '{project-root}/_bmad/bmgd/workflows/1-preproduction/game-brief/workflow.yaml'
gddWorkflow: '{project-root}/_bmad/bmgd/workflows/2-design/gdd/workflow.yaml'
---

# Step 4: Complete Session

**Progress: Step 4 of 4** - Brainstorming Complete!

## STEP GOAL:

Finalize the brainstorming session, generate actionable next steps, update workflow status, and provide clear handoff guidance.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a creative game design facilitator
- Help user identify most promising concepts
- Provide clear path forward

### Step-Specific Rules:

- Highlight top 1-3 concepts for further development
- Generate actionable next steps
- Update workflow status if tracking enabled

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Generate final summary
- Update frontmatter `stepsCompleted: [1, 2, 3, 4]`
- Present completion summary and next steps

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Generate Session Summary

**Create executive summary:**

Based on all ideation, synthesize a summary:

```markdown
## Session Summary

### Most Promising Concepts

**Top Pick: {{top_concept}}**
{{why_most_promising}}

**Runner-up: {{second_concept}}**
{{why_promising}}

**Honorable Mention: {{third_concept}}**
{{why_worth_exploring}}

### Key Insights

{{insights_from_session}}

### Recommended Next Steps

1. {{next_step_1}}
2. {{next_step_2}}
3. {{next_step_3}}
```

### 2. Present Final Summary

"**Brainstorming Session Complete!**

{{user_name}}, here's what we accomplished:

**Session Stats:**

- Ideas generated: {{idea_count}}
- Concepts developed: {{concept_count}}
- Techniques used: {{technique_list}}

**Most Promising Concept:**
**{{top_concept_name}}** - {{brief_description}}

**Why This Stands Out:**
{{reasons}}

**Document saved to:** `{outputFile}`

Would you like to review or adjust the summary before we finalize?"

### 3. Handle Review Requests

**If user wants to review:**

"Which would you like to review?

1. Most Promising Concepts
2. All Ideas Generated
3. Session Insights
4. Full Document

Or type 'all' to see the complete document."

### 4. Update Workflow Status

**If not in standalone mode:**

Load `{output_folder}/bmgd-workflow-status.yaml` and:

- Update `brainstorm-game` status to the output file path
- Preserve all comments and structure
- Determine next workflow in sequence

### 5. Generate Completion Section

Prepare the final content:

```markdown
---

## Session Complete

**Date:** {{date}}
**Duration:** Brainstorming session
**Participant:** {{user_name}}

### Output

This brainstorming session generated:

- {{idea_count}} raw ideas
- {{concept_count}} developed concepts
- {{theme_count}} emerging themes

### Document Status

Status: Complete
Steps Completed: [1, 2, 3, 4]
```

### 6. Present Next Steps Menu

"**Recommended Next Steps:**

1. **Create Game Brief** - Transform your top concept into a formal game brief
   - Workflow: `create-brief`
   - Input: This brainstorming session
   - Output: Structured game vision document

2. **Research Market** - Validate your concept against the market
   - Look at similar games
   - Identify your unique angle
   - Understand competition

3. **Prototype Core Mechanic** - Test your core idea immediately
   - Quick paper prototype
   - Simple digital prototype
   - Get hands-on feel for the concept

4. **Another Brainstorm Session** - Explore more concepts
   - Try different techniques
   - Explore alternative directions

**Which would you like to do next?**

1. Start Game Brief workflow
2. Review the brainstorming results
3. Run another brainstorm session
4. Exit workflow"

### 7. Handle User Selection

Based on user choice:

**If 1 (Game Brief):**

- Confirm document is saved
- Provide handoff guidance for game brief workflow
- Note that brainstorming results will be input

**If 2 (Review):**

- Present document summary
- Return to next steps menu

**If 3 (Another Session):**

- Note that a new session file will be created
- Route back to step 1 for fresh start

**If 4 (Exit):**

- Confirm document is saved and complete
- Exit workflow gracefully

### 8. Final Completion Message

"**Brainstorming Session Complete!**

**Deliverables:**

- Brainstorming results saved to: `{outputFile}`
- {{idea_count}} ideas captured
- Top concepts identified and summarized

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated: brainstorm-game marked complete
- Next recommended: Game Brief workflow
  {{/if}}

**Your Ideas Are Ready For:**

- Game Brief creation
- Concept validation
- Prototyping
- Team discussion

Great brainstorming session, {{user_name}}! Your creativity is the foundation for an exciting game."

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Top concepts identified and highlighted
- Session summary generated
- Actionable next steps provided
- Workflow status updated (if tracking)
- Document saved and complete
- Clear handoff guidance provided
- Frontmatter shows all 4 steps completed

### SYSTEM FAILURE:

- No clear top concepts identified
- Missing session summary
- No actionable next steps
- Status not updated when tracking enabled
- User left without guidance

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

---

## Brainstorm Game Workflow Complete

The Brainstorm Game workflow facilitates creative game ideation through 4 collaborative steps:

1. **Initialize** - Set brainstorming mindset and prepare session
2. **Context** - Load game-specific techniques and select approach
3. **Ideation** - Execute brainstorming with user driving ideas
4. **Complete** - Summarize results and provide next steps

This step-file architecture ensures consistent, creative brainstorming with user collaboration throughout.
