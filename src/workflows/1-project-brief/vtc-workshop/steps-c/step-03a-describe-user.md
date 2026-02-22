---
name: 'step-03a-describe-user'
description: 'Identify and describe the primary user with psychological depth'

# File References
nextStepFile: './step-04a-positive-driving-forces.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 3: Describe User

## STEP GOAL:
Create a rich description of ONE primary user who will use this solution - going beyond demographics to psychology.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Strategic Business Analyst facilitating VTC creation from scratch
- If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- We engage in collaborative dialogue, not command-response
- You bring structured thinking and facilitation skills, user brings domain expertise and product vision
- Maintain collaborative and strategic tone throughout

### Step-Specific Rules:
- Focus: ONE primary user with psychological depth, not just demographics
- FORBIDDEN: Do not accept demographics-only descriptions without probing deeper
- Approach: Ask, probe for psychology, capture rich description, validate

## EXECUTION PROTOCOLS:
- Primary goal: Rich user description captured
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Business goal and solution from steps 1-2
- Focus: User description with psychological depth
- Limits: One primary user per VTC
- Dependencies: Step 02a completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Ask for User Description

> "Who is the primary user for this solution? Tell me about them."

**Follow-up questions:**
- "What's their role or context?"
- "What are their key traits or characteristics?"
- "When/where do they encounter this solution?"
- "What are they trying to accomplish?"

### 2. Apply Guidelines

**Go beyond demographics to psychology:**
- Not just "female, 35, urban"
- Include mindset, goals, context
- Make them feel like a real person

**Focus on ONE primary user:**
- Can add others later with separate VTCs
- Multiple users = multiple VTCs

### 3. Use Template

```
[Name] ([role/context], [key traits])
Context: [when/where they encounter solution]
Current state: [what they're trying to accomplish]
```

**Example:**
```
Harriet (hairdresser, ambitious, small-town salon owner)
Context: Late evening, researching industry trends online
Current state: Wants to stay ahead of local competitors
```

### 4. Capture Format

```yaml
user:
  name: "[Name or type]"
  description: "[Role, traits, context]"
  context: "[When/where they encounter solution]"
  current_state: "[What they're trying to accomplish]"
```

### 5. Validation Checklist

Before proceeding, confirm:

- [ ] Can you picture this person?
- [ ] Clear why they'd care about this solution?
- [ ] Understand what they're trying to achieve?
- [ ] Description feels real (not generic)?
- [ ] User confirms this matches their target?

### 6. Handle Common Issues

**Issue:** User gives demographics only ("women 25-45")
> "Let's go deeper. Pick ONE person from that group. What's their name? What are they trying to achieve? What's their mindset?"

**Issue:** User wants multiple people
> "For THIS VTC, let's focus on one primary user. We can create additional VTCs for other users. Who matters most for this solution?"

**Issue:** Too generic ("busy professional")
> "Can you be more specific? What kind of professional? What makes them busy? What are they trying to accomplish?"

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
- Rich user description captured with psychological depth
- User feels like a real person, not a demographic
- Validation checklist passed
- User confirmed the description

### FAILURE:
- Accepted demographics-only description
- Skipped psychological depth probing
- Generated user description without user input

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
