---
name: 'step-03b-select-user'
description: 'Choose which user/target group from Trigger Map this VTC focuses on'

# File References
nextStepFile: './step-04b-select-driving-forces.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 3: Select User

## STEP GOAL:
Choose which user/target group from the Trigger Map this VTC focuses on.

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
- Focus: Present users connected to selected goal, guide selection, handle users not in map
- FORBIDDEN: Do not select a user without user confirmation
- Approach: Present users from map, user selects one primary, handle edge cases, capture

## EXECUTION PROTOCOLS:
- Primary goal: User/target group selected from Trigger Map
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Trigger Map and selected business goal from steps 1-2
- Focus: User selection
- Limits: One primary user per VTC
- Dependencies: Step 02b completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Present Available Users

Show users connected to selected business goal:

> "For [selected goal], your Trigger Map has these target groups:
>
> 1. [User 1 - brief description]
>    Priority: [score]
>    Key driving forces: [top 2-3]
>
> 2. [User 2 - brief description]
>    Priority: [score]
>    Key driving forces: [top 2-3]
>
> Which user is primary for this [solution/scenario]?"

### 2. User Selects

**One primary user** for this VTC

**If multiple users important:**
> "We can create additional VTCs for other users. For THIS VTC, let's focus on one."

### 3. Handle User Not in Map

**User:** "None of these users match. My scenario is for [different user type]."

**Options:**

**A) Add to Trigger Map now:**
1. Pause VTC workshop
2. Add new user/target group to Trigger Map
3. Map their driving forces
4. Resume with new user available

**B) Switch to Creation Workshop:**
1. If this is a one-off scenario
2. Create VTC from scratch for this user
3. Consider adding to Trigger Map later

**C) Adapt existing user:**
1. Pick closest match
2. Note variations in VTC
3. Consider if map needs new segment

**Recommendation:** If this represents a significant new user segment, add to Trigger Map. Future scenarios will benefit.

### 4. Capture Format

```yaml
user:
  name: "[Selected user name from map]"
  description: "[From Trigger Map]"
  context: "[From Trigger Map]"
  priority: "[Priority score from map]"
```

### 5. Validation

- [ ] User selection makes sense for this solution/scenario?
- [ ] User confirms this is primary target?

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
- Available users presented from Trigger Map with priorities
- User selected primary target
- User not in map handled appropriately (if applicable)
- Selection captured with priority

### FAILURE:
- Selected user without confirmation
- Did not present available options with context
- Skipped handling user-not-in-map scenario

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
