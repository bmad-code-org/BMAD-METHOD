---
name: 'step-08-complete'
description: 'Define success criteria and complete the game brief with handoff guidance'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/game-brief'

# File References
thisStepFile: './step-08-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-brief.md'

# Workflow References
gddWorkflow: '{project-root}/_bmad/bmgd/workflows/2-design/gdd/workflow.yaml'
---

# Step 8: Success & Handoff

**Progress: Step 8 of 8** - Game Brief Complete!

## STEP GOAL:

Define MVP scope, success metrics, immediate next steps, and provide clear handoff guidance for proceeding to GDD creation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- This is the final step - ensure completeness
- Provide actionable next steps

### Step-Specific Rules:

- Focus on measurable success criteria
- Push for specificity - challenge vague aspirations
- Clearly distinguish MVP from full release

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Generate final sections
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]`
- Present completion summary and next steps

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. MVP Definition Discovery

**Define minimum viable product:**

"Let's define the MVP (Minimum Playable Version) for {{game_name}}.

**MVP is the absolute minimum where:**

- Core gameplay loop is fun and complete
- Only essential content is included
- It could stand alone as a playable experience

**Questions:**

- What features are absolutely required?
- What content is the minimum to prove the concept?
- What can be cut and added later?

What's the MVP for {{game_name}}?"

### 2. Success Metrics Discovery

**Define measurable success:**

"Let's define how you'll measure success for {{game_name}}.

**Metric Categories:**

| Category               | Examples                                |
| ---------------------- | --------------------------------------- |
| **Player Acquisition** | Wishlists, downloads, sales             |
| **Engagement**         | Session length, retention, completion   |
| **Quality**            | Review scores, bug reports              |
| **Community**          | Discord members, streamers, fan content |
| **Financial**          | Revenue, ROI, sustainability            |

**For each metric, answer:** How will you measure that?

What success metrics matter for {{game_name}}?"

### 3. Immediate Actions Discovery

**Identify next steps:**

"What should happen immediately after this brief is complete?

**Common Next Actions:**

- Prototype core mechanic
- Create art style test
- Validate technical feasibility
- Build vertical slice
- Playtest with target audience
- Proceed to GDD workflow

**Open Questions:**

- What design questions are still unresolved?
- What assumptions need validation?
- What blockers must be resolved?

What are the immediate next steps for {{game_name}}?"

### 4. Generate Executive Summary

**Create summary section:**

Based on all previous sections, synthesize an executive summary:

```markdown
## Executive Summary

{{game_name}} is {{core_concept}}.

**Target Audience:** {{primary_audience_summary}}

**Core Pillars:** {{pillars_list}}

**Key Differentiators:** {{top_differentiators}}

**Platform:** {{primary_platform}}

**Success Vision:** {{what_success_looks_like}}
```

### 5. Generate Success & Next Steps Content

Based on the conversation, prepare the content:

```markdown
## Success Criteria

### MVP Definition

{{mvp_scope}}

### Success Metrics

{{metrics_with_targets}}

### Launch Goals

{{launch_targets}}

---

## Next Steps

### Immediate Actions

{{prioritized_action_list}}

### Research Needs

{{research_requirements}}

### Open Questions

{{unresolved_questions}}
```

### 6. Present Completion Summary

"**Game Brief Complete!**

{{user_name}}, the Game Brief for **{{game_name}}** is now complete!

**Brief Summary:**

- **Core Concept:** {{core_concept}}
- **Target Audience:** {{primary_audience}}
- **Pillars:** {{pillars}}
- **Platform:** {{platform}}

**Sections Completed:**

1. Game Vision
2. Target Market
3. Game Fundamentals
4. Scope & Constraints
5. Reference Framework
6. Content & Production
7. Success Criteria
8. Next Steps

**Document saved to:** `{outputFile}`

Do you want to review or adjust anything before we finalize?"

### 7. Present Next Steps Menu

**After user confirms completion:**

"**Recommended Next Steps for {{game_name}}:**

1. **Create GDD** - Transform this brief into a detailed Game Design Document
   - Command: `create-gdd` (Game Designer agent)
   - Input: This game brief
   - Output: Comprehensive GDD

2. **Prototype Core Mechanic** - Validate gameplay before full production

3. **Art Style Test** - Validate visual direction

4. **Market Validation** - Test interest with target audience

**Which would you like to do next?**

1. Start GDD workflow
2. Review the completed brief
3. Exit workflow"

### 8. Handle User Selection

Based on user choice:

**If 1 (Start GDD):**

- Update frontmatter with final `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]`
- Provide handoff guidance for GDD workflow

**If 2 (Review):**

- Present full document summary
- Return to next steps menu

**If 3 (Exit):**

- Update frontmatter with final stepsCompleted
- Confirm brief is saved
- Exit workflow gracefully

## CRITICAL STEP COMPLETION NOTE

This is the final step. Ensure:

- Executive summary is generated
- All content is saved to game-brief.md
- Frontmatter shows all 8 steps completed
- User has clear actionable next steps
- Handoff to GDD workflow is smooth

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- MVP clearly scoped
- Success metrics are measurable
- Immediate actions are actionable
- Executive summary synthesizes the brief
- Document is complete and saved
- Clear next steps provided
- Frontmatter updated with all steps completed

### SYSTEM FAILURE:

- Missing MVP definition
- Vague success metrics that can't be measured
- No clear next steps
- Frontmatter not updated to show completion
- User left without actionable guidance

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

---

## Game Brief Workflow Complete

The Game Brief workflow transforms a game idea into a validated vision through 8 collaborative steps:

1. **Initialize** - Set up workflow and discover input documents
2. **Vision** - Capture core concept, pitch, and vision statement
3. **Market** - Define target audience and market context
4. **Fundamentals** - Establish pillars, mechanics, and experience goals
5. **Scope** - Set realistic constraints and resources
6. **References** - Identify inspirations and differentiators
7. **Content** - Define world, art/audio, and assess risks
8. **Complete** - Set success criteria and provide handoff

This step-file architecture ensures consistent, thorough game brief creation with user collaboration at every step.
