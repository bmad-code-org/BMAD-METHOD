---
name: 'step-06b-customer-awareness'
description: 'Define awareness start/end - typically NOT in Trigger Map, defined per scenario'

# File References
nextStepFile: './step-07b-review-and-save.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 6: Position Customer Awareness

## STEP GOAL:
Define awareness start/end positions - typically NOT in the Trigger Map, defined per scenario. Explore what user knows NOW and what transformation happens.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Strategic Business Analyst facilitating VTC selection from an existing Trigger Map
- If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- We engage in collaborative dialogue, not command-response
- You bring structured thinking and facilitation skills, user brings domain expertise and product vision
- Maintain collaborative and strategic tone throughout

### Step-Specific Rules:
- Focus: Customer awareness start and end with context, realistic progression
- FORBIDDEN: Do not skip storytelling validation of the awareness journey
- Approach: Use same exploratory approach as Creation Workshop, capture with context, validate through story

## EXECUTION PROTOCOLS:
- Primary goal: Customer awareness journey defined and validated
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Trigger Map, selected goal, user, forces, solution from steps 1-5
- Focus: Customer awareness positioning (new element, not from map)
- Limits: Realistic progression, usually 1-2 stages
- Dependencies: Step 05b completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Quick Exploration Questions

**Current State:**

1. **"Do they know something's wrong?"**
2. **"What language are they using?"** (when talking about this)
3. **"What are they looking for?"** (search terms, questions)
4. **"Have they tried anything?"** (your product, competitors, nothing)

**Desired Transformation:**

1. **"What will they realize?"** (new insight)
2. **"What will they be able to articulate?"** (to a friend)
3. **"What action becomes possible?"** (what can they DO now)

### 2. Capture with Context

```yaml
customer_awareness:
  start: "[Stage]"
  start_context: "[What they know/feel NOW]"
  end: "[Stage]"
  end_context: "[What they'll know/feel AFTER]"
  transformation: "[Key shift that happens]"
```

**Example:**
```yaml
customer_awareness:
  start: "Solution Aware"
  start_context: "Researching design tools, overwhelmed by options"
  end: "Product Aware"
  end_context: "Knows WDS exists, understands it's agent-based, considering trial"
  transformation: "From 'tools are complex' to 'this specific approach might work'"
```

### 3. Validate Through Story

**Ask user:**
> "Walk me through their awareness journey in this scenario."

Story should flow naturally and match the selected driving forces from Trigger Map.

### N. Present MENU OPTIONS
Display: "**Select an Option:** [C] Continue to next step"

#### Menu Handling Logic:
- IF C: Update agent dialog, then load, read entire file, then execute {nextStepFile}
- IF M: Return to {workflowFile} or {activityWorkflowFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options]

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- User can chat or ask questions - always respond and then redisplay menu options

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN step objectives are met and user confirms will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:
- Customer awareness start and end defined with context
- Transformation clearly articulated
- Storytelling validation passed
- Journey matches selected driving forces

### FAILURE:
- Skipped storytelling validation
- Defined positions without context
- Generated awareness positions without user input

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
