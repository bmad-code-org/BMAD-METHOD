---
name: 'step-02b-select-business-goal'
description: 'Choose which business goal from Trigger Map this VTC serves'

# File References
nextStepFile: './step-03b-select-user.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 2: Select Business Goal

## STEP GOAL:
Choose which business goal from the Trigger Map this VTC serves.

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
- Focus: Present available goals, guide selection, handle goals not in map
- FORBIDDEN: Do not select a goal without user confirmation
- Approach: Present goals from map, user selects, handle edge cases, capture

## EXECUTION PROTOCOLS:
- Primary goal: Business goal selected from Trigger Map
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Loaded Trigger Map from step 1
- Focus: Business goal selection
- Limits: One primary goal per VTC
- Dependencies: Step 01b completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Present Available Goals

Show user all business goals from Trigger Map:

> "Your Trigger Map has these business goals:
>
> 1. [Goal 1] - Priority: [score/rank]
> 2. [Goal 2] - Priority: [score/rank]
> 3. [Goal 3] - Priority: [score/rank]
>
> Which goal does this [solution/scenario] primarily serve?"

### 2. User Selects

**One primary goal** - This VTC will focus here

**Can note secondary:**
> "Does this also support another goal?"

If yes, capture but keep one primary.

### 3. Handle Goal Not in Map

**User:** "Actually, none of these goals fit. This is about [different goal]."

**Options:**

**A) Add to Trigger Map now:**
1. Pause VTC workshop
2. Add new goal to Trigger Map
3. Resume with new goal available

**B) Add to VTC and note for map update:**
1. Use new goal in this VTC
2. Note: "Add to Trigger Map: [new goal]"
3. Update map in separate session

**C) Refine existing goal:**
1. Adjust wording for clarity
2. Use refined version in VTC
3. Consider updating map

**Recommendation:** If this is a significant gap, pause and update the Trigger Map. It will benefit all future VTCs.

### 4. Capture Format

```yaml
business_goal:
  primary: "[Selected goal from map]"
  priority: "[Priority from map]"
  secondary: "[Optional secondary goal]"
```

### 5. Validation

- [ ] Goal selected makes sense for this solution/scenario?
- [ ] User confirms this is the right focus?

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
- Available goals presented from Trigger Map
- User selected primary goal
- Goal not in map handled appropriately (if applicable)
- Selection captured with priority

### FAILURE:
- Selected goal without user confirmation
- Did not present available options
- Skipped handling goal-not-in-map scenario

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
