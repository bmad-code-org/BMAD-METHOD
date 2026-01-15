---
name: 'step-14-complete'
description: 'Document out of scope items, capture assumptions, and provide handoff guidance'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-14-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'
epicsFile: '{output_folder}/epics.md'

# Workflow References
narrativeWorkflow: '{project-root}/_bmad/bmgd/workflows/2-design/narrative/workflow.yaml'
architectureWorkflow: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture/workflow.yaml'
---

# Step 14: Complete & Handoff

**Progress: Step 14 of 14** - GDD Complete!

## STEP GOAL:

Document what is explicitly out of scope, capture key assumptions and dependencies, and provide clear next steps for the game development process.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- This is the final step - ensure completeness
- Provide clear actionable next steps

### Step-Specific Rules:

- Focus on scope boundaries and assumptions
- Check if narrative workflow is recommended
- Provide concrete next steps based on workflow status

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Generate final sections without A/P/C menu (just confirmation)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]`
- Present completion summary and next steps

## CONTEXT BOUNDARIES:

- All GDD content from previous steps available
- Check for `needs_narrative` flag from step 7
- Reference workflow-status if integrated with BMM

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Out of Scope Discovery

**Guide user through scope boundaries:**

"Let's document what is explicitly NOT in scope for {{game_name}} v1.0.

**Out of Scope Categories:**

| Category         | Examples                               |
| ---------------- | -------------------------------------- |
| **Features**     | Multiplayer, level editor, mod support |
| **Content**      | Additional game modes, DLC areas       |
| **Platforms**    | Console ports, VR version              |
| **Polish**       | Full voice acting, orchestral score    |
| **Localization** | Additional languages                   |

**Questions to consider:**

1. What features have you intentionally cut for v1.0?
2. What platforms are NOT in initial scope?
3. What post-launch content are you deferring?
4. What's 'nice to have' vs 'required for launch'?

What's explicitly out of scope for {{game_name}} v1.0?"

### 2. Assumptions and Dependencies Discovery

**Guide user through assumptions:**

"Now let's document key assumptions and dependencies.

**Assumption Categories:**

| Category      | Examples                                                          |
| ------------- | ----------------------------------------------------------------- |
| **Technical** | 'Unity LTS will remain stable', 'Players have controllers'        |
| **Team**      | 'Art contractor available Q2', 'Solo developer capacity'          |
| **External**  | 'Steam review approval in 2 weeks', 'Asset store assets licensed' |
| **Market**    | 'Genre remains popular', 'Pricing assumptions'                    |

**Dependency Categories:**

| Category        | Examples                                  |
| --------------- | ----------------------------------------- |
| **Third-party** | Middleware, plugins, asset licenses       |
| **Services**    | Backend providers, analytics, multiplayer |
| **Content**     | External art, music, voice acting         |
| **Platform**    | SDK versions, certification requirements  |

What assumptions is {{game_name}} built on? What external dependencies exist?"

### 3. Check Narrative Workflow Recommendation

**Check if game type suggested narrative:**

If `needs_narrative` flag is true (from step 7):

"**Narrative Recommendation:**

Based on your game type ({{game_type}}), a dedicated Narrative Design Document would benefit {{game_name}}. This covers:

- Story structure and arcs
- Character development
- World lore and history
- Dialogue framework
- Environmental storytelling

Would you like to create a Narrative Design Document as your next step?"

Store user response for next steps.

### 4. Generate Completion Content

Based on the conversation, prepare the content:

```markdown
## Out of Scope

{{out_of_scope_items}}

### Deferred to Post-Launch

{{post_launch_items}}

---

## Assumptions and Dependencies

### Key Assumptions

{{assumptions_list}}

### External Dependencies

{{dependencies_list}}

### Risk Factors

{{risks_based_on_assumptions}}

---

## Document Information

**Document:** {{game_name}} - Game Design Document
**Version:** 1.0
**Created:** {{date}}
**Author:** {{user_name}}
**Status:** Complete

### Change Log

| Version | Date     | Changes              |
| ------- | -------- | -------------------- |
| 1.0     | {{date}} | Initial GDD complete |
```

### 5. Present Completion Summary

"**GDD Complete!**

{{user_name}}, the Game Design Document for **{{game_name}}** is now complete!

**Document Summary:**

- **Game Type:** {{game_type}}
- **Platform:** {{platform}}
- **Epics:** {{epic_count}} development epics
- **Estimated Stories:** {{story_estimate}}

**Files Created:**

- `gdd.md` - Full Game Design Document
- `epics.md` - Detailed epic and story breakdown

**GDD Sections Completed:**

1. Executive Summary & Game Type
2. Platforms & Target Audience
3. Goals & Unique Selling Points
4. Core Gameplay (Pillars, Loop, Win/Loss)
5. Game Mechanics & Controls
6. {{game_type}} Specific Design
7. Progression & Balance
8. Level Design Framework
9. Art & Audio Direction
10. Technical Specifications
11. Development Epics
12. Success Metrics
13. Out of Scope & Assumptions

Do you want me to add or modify anything before we finalize?"

### 6. Present Next Steps

**After user confirms completion:**

"**Next Steps for {{game_name}}:**

{{if needs_narrative and user_wants_narrative}}
**Immediate Next Step:**

1. **Narrative Design Document** - Create story, characters, and world lore
   - Command: `narrative` (Game Designer agent)
   - Input: This GDD
   - Output: narrative-design.md
     {{/if}}

**Required Next Steps:**

1. **Game Architecture** - Define engine, tech stack, and system design
   - Command: `create-architecture` (Game Architect agent)
   - Input: This GDD
   - Output: architecture.md

2. **Sprint Planning** - Set up your first development sprint
   - Command: `sprint-planning` (Scrum Master agent)
   - Input: GDD + epics.md
   - Output: sprint-status.yaml

**Recommended Actions:**

- [ ] Review GDD with any team members or stakeholders
- [ ] Create a prototype for core gameplay validation
- [ ] Set up project repository and dev environment
- [ ] Gather reference materials for art direction

**Which would you like to do next?**

1. {{if needs_narrative}}Create Narrative Design Document{{else}}Create Game Architecture{{/if}}
2. Start Sprint Planning
3. Review the completed GDD
4. Exit workflow"

### 7. Handle User Selection

Based on user choice:

**If 1 (Narrative or Architecture):**

- Update frontmatter with final `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]`
- Provide handoff guidance for next workflow

**If 2 (Sprint Planning):**

- Update frontmatter with final stepsCompleted
- Provide handoff guidance for sprint planning

**If 3 (Review):**

- Present document summary
- Offer to highlight any sections
- Return to next steps menu

**If 4 (Exit):**

- Update frontmatter with final stepsCompleted
- Confirm GDD is saved
- Exit workflow gracefully

## CRITICAL STEP COMPLETION NOTE

This is the final step. Ensure:

- All content is saved to gdd.md
- Frontmatter shows all 14 steps completed
- User has clear actionable next steps
- Handoff to next workflow is smooth

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Out of scope clearly documented
- Assumptions and dependencies captured
- Narrative workflow recommendation handled
- Final document status updated
- Clear next steps provided
- Smooth handoff to next workflow

### SYSTEM FAILURE:

- Missing out of scope documentation
- Not checking for narrative flag
- No clear next steps provided
- Frontmatter not updated to show completion
- User left without actionable guidance

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

---

## GDD Workflow Complete

The GDD workflow transforms a game concept into a comprehensive design document through 14 collaborative steps:

1. **Initialize** - Set up workflow and discover input documents
2. **Context** - Determine game type and load relevant guide
3. **Platforms** - Define target platforms and audience
4. **Vision** - Establish goals, context, and USPs
5. **Core Gameplay** - Define pillars, loop, and win/loss
6. **Mechanics** - Detail player actions and controls
7. **Game Type** - Process genre-specific sections
8. **Progression** - Design player growth and balance
9. **Levels** - Structure playable content
10. **Art & Audio** - Establish aesthetic direction
11. **Technical** - Define performance requirements
12. **Epics** - Organize features into development units
13. **Metrics** - Define success criteria
14. **Complete** - Document scope and hand off

This step-file architecture ensures consistent, thorough GDD creation with user collaboration at every step.
