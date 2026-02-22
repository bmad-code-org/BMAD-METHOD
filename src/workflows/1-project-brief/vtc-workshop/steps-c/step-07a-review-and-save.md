---
name: 'step-07a-review-and-save'
description: 'Validate completeness and save the VTC - final step of Creation Workshop'

# File References
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 7: Review and Save VTC

## STEP GOAL:
Validate completeness and save the VTC for use - review the complete VTC for coherence, then save it to the appropriate location.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Strategic Business Analyst completing the VTC Creation Workshop
- If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- We engage in collaborative dialogue, not command-response
- You bring structured thinking and facilitation skills, user brings domain expertise and product vision
- Maintain collaborative and strategic tone throughout

### Step-Specific Rules:
- Focus: Read back complete VTC, validate with 4 questions, refine if needed, determine save location, save
- FORBIDDEN: Do not skip any of the 4 validation questions
- Approach: Present VTC, validate coherence/actionability/specificity/realism, refine, save, communicate

## EXECUTION PROTOCOLS:
- Primary goal: VTC validated, saved, and user understands what they have
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: All VTC elements from steps 1-6
- Focus: Review, validation, and save
- Limits: Finalizing, not starting new work
- Dependencies: Steps 01a-06a completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Read Back Complete VTC (7A)

**Present the full VTC to user:**

```yaml
vtc:
  business_goal: "[goal]"
  solution: "[solution]"
  user:
    name: "[name]"
    description: "[description]"
    context: "[context]"
  driving_forces:
    positive:
      - "[wish 1]"
      - "[wish 2]"
    negative:
      - "[fear 1]"
      - "[fear 2]"
  customer_awareness:
    start: "[start stage]"
    end: "[end stage]"
```

### 2. Validate with Questions (7B)

**Ask each validation question:**

**Coherence:**
> "Does this tell a coherent story?"
- Business goal -> Solution -> User -> Forces -> Awareness
- Does it flow logically?
- Does each piece connect to the others?

**Actionable:**
> "Can you make design decisions from this?"
- Specific enough to guide choices?
- Clear what would/wouldn't serve this VTC?
- Could someone else use this?

**Specific:**
> "Are the driving forces specific enough?"
- Go beyond generic?
- Emotionally resonant?
- Different from other users?

**Realistic:**
> "Does the awareness progression make sense?"
- Can solution realistically move user that far?
- Appropriate for this interaction type?
- Supports business goal?

**All YES?** -> VTC is ready to save
**Any NO?** -> Refine that specific element

### 3. Quick Refinement (7C) - if needed

**If any validation failed:**

1. Identify which element needs work
2. Return to that step briefly
3. Make adjustment
4. Re-validate

**Keep momentum** - don't get stuck perfecting. "Good enough to guide design" is the bar.

### 4. Determine Save Location (7D)

**Ask:**
> "What is this VTC for?"

**If Product Pitch:**
- Location: `{output_folder}/A-Product-Brief/vtc-primary.yaml`
- Purpose: Stakeholder communication, strategic alignment

**If Scenario:**
- Location: `{output_folder}/C-UX-Scenarios/[scenario-name]/vtc.yaml`
- Purpose: Guide scenario design decisions

**If Prototype/Other:**
- Location: `{output_folder}/[appropriate-folder]/vtc-[name].yaml`
- Purpose: As defined by user

### 5. Create VTC File (7E)

**Use template:** Copy from `../../templates/vtc-template.yaml`

**Fill in all sections:**

```yaml
vtc:
  business_goal: "[captured value]"
  solution: "[captured value]"
  user:
    name: "[captured value]"
    description: "[captured value]"
    context: "[captured value]"
  driving_forces:
    positive: [captured values]
    negative: [captured values]
  customer_awareness:
    start: "[captured value]"
    end: "[captured value]"

metadata:
  created_date: "[today's date]"
  created_by: "[team/person]"
  version: "1.0"
  source: "creation"
  purpose: "[product_pitch / scenario / etc]"
  phase: "[WDS phase]"

notes: |
  Created: [date]
  Context: [why this VTC was created]

  Key decisions made:
  - [Important choices during workshop]
  - [Insights captured]

  Usage guidance:
  - [How this VTC should inform design]
```

**Save file to determined location**

### 6. Communicate What They Have (7F)

**Explain to user:**

> "Excellent! We've created a Value Trigger Chain that shows:
>
> **Business Goal:** [goal]
> **User:** [name] who wants to [positive force] and avoid [negative force]
> **Solution:** [solution] that moves them from [start] to [end] awareness
>
> This VTC will guide all design decisions for [context]. Every piece of content, every interaction, every design choice should serve this strategic chain.
>
> **Next time you're making a design decision, ask:**
> 'Does this serve the business goal by triggering these driving forces while moving the user forward in awareness?'
>
> If yes -> Good decision
> If no -> Reconsider"

### 7. Define Next Actions (7G)

**If Product Pitch:**
> "Next steps:
> 1. Add this VTC to your pitch document
> 2. Structure pitch narrative around this chain
> 3. Use it to explain strategic reasoning to stakeholders
> 4. Can evolve into full Trigger Map later as project grows"

**If Scenario:**
> "Next steps:
> 1. Use this VTC to guide page design in this scenario
> 2. All content should address these driving forces
> 3. Track if you're actually moving users through awareness
> 4. Create additional VTCs for other scenarios as needed"

### 8. Completion Checklist

- [ ] VTC validated with all 4 questions
- [ ] VTC saved to appropriate location
- [ ] Metadata completed (date, source, purpose)
- [ ] Notes section filled with context
- [ ] User understands what they have
- [ ] User knows how to use VTC
- [ ] Next actions defined

### N. Present MENU OPTIONS
Display: "**Select an Option:** [M] Return to workflow menu"

#### Menu Handling Logic:
- IF M: Return to {workflowFile} or {activityWorkflowFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options]

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- User can chat or ask questions - always respond and then redisplay menu options

## CRITICAL STEP COMPLETION NOTE
This is the FINAL step of the VTC Creation Workshop. Workshop is complete.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- Complete VTC presented and validated
- All 4 validation questions answered YES
- VTC saved to correct location with metadata
- User understands what they have and how to use it
- Next actions defined

### FAILURE:
- Skipped validation questions
- Saved without metadata or notes
- Did not communicate value to user
- Left user without clear next actions

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
