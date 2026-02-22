---
name: 'step-05b-define-solution'
description: 'Define what solution is being built - NOT in Trigger Map, solutions stay out of map'

# File References
nextStepFile: './step-06b-customer-awareness.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 5: Define Solution

## STEP GOAL:
Define what we're building - solutions are NOT in the Trigger Map, they are defined per VTC as the bridge between business goal and user.

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
- Focus: Specific solution definition, test connection to map elements
- FORBIDDEN: Do not accept vague solution descriptions
- Approach: Ask, apply guidelines, test chain connection, validate

## EXECUTION PROTOCOLS:
- Primary goal: Solution defined and validated against map elements
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Trigger Map, selected goal, user, forces from steps 1-4
- Focus: Solution definition (new element, not from map)
- Limits: Specific, focused, user-facing
- Dependencies: Step 04b completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Ask for Solution

> "What solution are you building to serve this VTC?"

**Reminder:** This is the bridge between business goal and user.

### 2. Apply Guidelines

Same as Creation Workshop - specific about WHAT this is:

**Good examples:**
- "Landing page with newsletter signup"
- "Onboarding flow for new users"
- "User profile settings page"

**Bad examples:**
- "A great experience" (too vague)
- "Lots of features" (not specific)

### 3. Capture Format

```yaml
solution: "[Specific solution being built]"
```

### 4. Test Connection

Business Goal (from map) -> Solution (new) -> User (from map) -> Forces (from map)

Does this chain make sense?

### 5. Validation

- [ ] Solution is specific?
- [ ] Solution serves selected business goal?
- [ ] Solution connects to selected user and forces?

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
- Specific solution defined
- Chain connection tested (goal -> solution -> user -> forces)
- User confirmed the solution
- Solution bridges business goal and user

### FAILURE:
- Accepted vague solution description
- Skipped chain connection test
- Generated solution without user input

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
