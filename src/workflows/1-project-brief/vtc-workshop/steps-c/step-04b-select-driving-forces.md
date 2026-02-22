---
name: 'step-04b-select-driving-forces'
description: 'Choose 2-5 most relevant driving forces from Trigger Map for this VTC'

# File References
nextStepFile: './step-05b-define-solution.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 4: Select Driving Forces

## STEP GOAL:
Choose 2-5 most relevant driving forces from the Trigger Map for this VTC.

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
- Focus: Present available forces, guide selection of 2-5, handle forces not in map
- FORBIDDEN: Do not select forces without user confirmation; do not include all forces (lose focus)
- Approach: Present forces with priorities, guide selection criteria, handle missing forces, capture

## EXECUTION PROTOCOLS:
- Primary goal: 2-5 relevant driving forces selected from Trigger Map
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Trigger Map, selected goal, selected user from steps 1-3
- Focus: Driving forces selection
- Limits: 2-5 total, mix of positive and negative
- Dependencies: Step 03b completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Present Available Forces

Show all driving forces for selected user:

> "For [selected user], your Trigger Map shows:
>
> **Positive (Wishes):**
> 1. [Force 1] - Priority: [score]
> 2. [Force 2] - Priority: [score]
> 3. [Force 3] - Priority: [score]
>
> **Negative (Fears/Avoid):**
> 1. [Force 1] - Priority: [score]
> 2. [Force 2] - Priority: [score]
> 3. [Force 3] - Priority: [score]"

### 2. Guide Selection

> "Which of these driving forces does [this solution/scenario] directly address?
>
> Pick 2-5 total (mix of positive and negative) that are most relevant here."

**Selection criteria:**
- Does THIS solution actually address this force?
- Balance positive and negative
- Don't include everything (lose focus)
- Higher priority forces are good candidates

### 3. Handle Driving Force Missing

**User:** "None of these capture [specific driving force]. But that's critical for this scenario!"

**This is valuable discovery!** Using the map reveals gaps.

**Options:**

**A) Add to Trigger Map now:**
1. Pause VTC workshop
2. Add new driving force to Trigger Map
3. Assign priority
4. Resume and select it

**B) Add to VTC and note for map:**
1. Use new force in this VTC
2. Note: "Add to Trigger Map: [new force]"
3. Update map after workshop

**C) Reword existing force:**
1. Take closest match from map
2. Refine wording in VTC
3. Consider updating map

**Recommendation:** If you discovered this force is critical, add it to the map. Other scenarios likely need it too.

### 4. Capture Format

```yaml
driving_forces:
  positive:
    - "[Selected wish 1 from map]"
    - "[Selected wish 2 from map]"
  negative:
    - "[Selected fear 1 from map]"
    - "[Selected fear 2 from map]"
```

### 5. Validation

- [ ] Selected forces directly addressed by this solution?
- [ ] Focused enough (not too many)?
- [ ] Includes both positive and negative?
- [ ] User confirms these are the right ones?
- [ ] If adding new forces, documented for map update?

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
- Available forces presented with priorities
- 2-5 forces selected with balance of positive and negative
- Missing forces handled and documented (if applicable)
- User confirmed selection

### FAILURE:
- Selected forces without user confirmation
- Included all forces without focus
- Did not handle missing force scenario

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
