---
name: 'step-11-complete'
description: 'Complete the narrative workflow with final summary, visualizations, and handoff'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-11-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Handoff References
architectureWorkflow: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture/workflow.yaml'
---

# Step 11: Complete

**Progress: Step 11 of 11** - Narrative Design Complete!

## STEP GOAL:

Generate final visualizations (character relationships, timeline), capture references, update workflow status, and provide clear handoff guidance.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a narrative design facilitator
- This is the final step - ensure completeness
- Provide actionable next steps

### Step-Specific Rules:

- Generate relationship map from characters defined
- Generate timeline from story beats
- Capture any references user wants to note

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Generate final visualizations
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]`
- Present completion summary and next steps

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Generate Character Relationship Map

**Create text-based relationship visualization:**

Based on all characters documented, generate:

```markdown
## Appendix: Character Relationships

### Relationship Map
```

                    [ANTAGONIST]
                         |
                    (opposes)
                         |
    [MENTOR] ---(guides)--- [PROTAGONIST] ---(allies)--- [COMPANION]
                         |
                    (romantic)
                         |
                  [LOVE INTEREST]

```

### Relationship Key

- {{character_1}} → {{character_2}}: {{relationship_type}}
- {{character_2}} → {{character_3}}: {{relationship_type}}
{{continue_for_all_relationships}}
```

### 2. Generate Story Timeline

**Create timeline visualization:**

Based on story beats documented, generate:

```markdown
## Appendix: Story Timeline

### Chronological Events
```

[BACKSTORY]
|
v
[ACT 1: SETUP]
├── {{beat_1}}
├── {{beat_2}}
└── {{inciting_incident}}
|
v
[ACT 2: CONFRONTATION]
├── {{beat_3}}
├── {{midpoint}}
├── {{beat_4}}
└── {{crisis}}
|
v
[ACT 3: RESOLUTION]
├── {{climax}}
└── {{resolution}}

```

### Timeline Notes

{{any_timeline_clarifications}}
```

### 3. References Discovery

"**Do you have any references or inspirations to note?**

This helps future writers understand your vision:

- Books, movies, games that inspired you
- Reference materials for tone/style
- Mood boards or concept art references
- Theme or narrative references

What references should be documented? (or 'none'):"

### 4. Finalize Document

**Update the document with final content:**

Add relationship map and timeline to document.

**Final frontmatter:**

```yaml
---
title: 'Narrative Design Document'
project: '{{game_name}}'
date: '{{date}}'
author: '{{user_name}}'
version: '1.0'
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
status: 'complete'
narrativeComplexity: '{{complexity}}'
---
```

### 5. Update Workflow Status

**If not in standalone mode:**

Load `{output_folder}/bmgd-workflow-status.yaml` and:

- Update `narrative` status to the output file path
- Preserve all comments and structure
- Determine next workflow in sequence

### 6. Present Completion Summary

"**Narrative Design Complete!**

{{user_name}}, the Narrative Design Document for **{{game_name}}** is complete!

**Narrative Summary:**

- **Premise:** {{premise_summary}}
- **Themes:** {{themes_list}}
- **Characters:** {{character_count}} ({{protagonist_count}} protagonist, {{antagonist_count}} antagonist, {{supporting_count}} supporting)
- **Story Structure:** {{structure_type}}
- **Writing Scope:** ~{{word_count}} words

**Sections Completed:**

1. Story Foundation (premise, themes, structure)
2. Story Beats (major moments, pacing)
3. Characters (all characters and arcs)
4. World Building (setting, history, locations)
5. Dialogue Framework (style, key conversations)
6. Environmental Storytelling (visual, audio, documents)
7. Narrative Delivery (cutscenes, in-game, endings)
8. Gameplay Integration (gating, agency)
9. Production Planning (scope, localization, voice)
10. Appendices (relationships, timeline)

**Document saved to:** `{outputFile}`

Do you want to review or adjust anything before we finalize?"

### 7. Handle Review Requests

**If user wants to review:**

"Which would you like to review?

1. Story Foundation
2. Story Beats
3. Characters
4. World Building
5. Dialogue
6. Environmental Storytelling
7. Narrative Delivery
8. Gameplay Integration
9. Production Planning
10. Full Document

Select a section:"

### 8. Present Next Steps Menu

"**Recommended Next Steps:**

1. **Technical Architecture** - Define how narrative systems will be implemented
   - Workflow: `create-architecture`
   - Input: GDD + Narrative Design
   - Output: Technical architecture document

2. **Create Script/Screenplay** - Write the actual dialogue and scenes
   - This is done outside the workflow
   - Use the Narrative Design as your blueprint

3. **Review with Team** - Share with collaborators for feedback

4. **Exit Workflow**

**Which would you like to do next?**

1. Start Architecture workflow
2. Review the narrative document
3. Exit workflow"

### 9. Handle User Selection

Based on user choice:

**If 1 (Architecture):**

- Confirm document is saved
- Provide handoff guidance
- Note narrative will inform technical decisions

**If 2 (Review):**

- Present full document or requested section
- Return to next steps menu

**If 3 (Exit):**

- Confirm document is saved and complete
- Exit workflow gracefully

### 10. Final Completion Message

"**Narrative Design Complete!**

**Deliverables:**

- Narrative design saved to: `{outputFile}`
- {{character_count}} characters documented
- {{beat_count}} story beats mapped
- {{location_count}} locations defined

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated: narrative marked complete
- Next recommended: Architecture workflow
  {{/if}}

**Your Narrative Is Ready For:**

- Script/screenplay writing
- Technical implementation planning
- Team review and iteration
- Production scheduling

Excellent work crafting the narrative for {{game_name}}, {{user_name}}!"

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Relationship map generated
- Timeline generated
- References captured
- All content saved to document
- Workflow status updated (if tracking)
- Frontmatter shows all 11 steps completed
- User has clear next steps

### SYSTEM FAILURE:

- Missing visualizations
- Incomplete document
- Status not updated when tracking
- No clear next steps provided
- User left without guidance

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

---

## Narrative Design Workflow Complete

The Narrative Design workflow creates comprehensive narrative documentation through 11 collaborative steps:

1. **Initialize** - Validate readiness, assess complexity
2. **Foundation** - Premise, themes, tone, structure
3. **Story** - Beats and pacing
4. **Characters** - All characters and arcs
5. **World** - Setting, history, factions, locations
6. **Dialogue** - Style and systems
7. **Environmental** - Environmental storytelling
8. **Delivery** - Narrative delivery methods
9. **Integration** - Gameplay-narrative connection
10. **Production** - Scope and planning
11. **Complete** - Visualizations and handoff

This step-file architecture ensures consistent, thorough narrative design with user collaboration at every step.
