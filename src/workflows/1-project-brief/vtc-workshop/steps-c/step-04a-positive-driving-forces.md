---
name: 'step-04a-positive-driving-forces'
description: 'Discover what the user WANTS to achieve - aspirations and wishes'

# File References
nextStepFile: './step-05a-negative-driving-forces.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 4: Identify Positive Driving Forces

## STEP GOAL:
Discover what the user WANTS to achieve - their aspirations, wishes, and what makes them want to engage with the solution.

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
- Focus: Aspirations, not just functional needs - emotionally resonant wishes
- FORBIDDEN: Do not accept only functional needs without probing for emotional aspirations
- Approach: Ask, probe for emotions, capture 2-3 strong wishes, validate

## EXECUTION PROTOCOLS:
- Primary goal: 2-3 positive driving forces captured
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Business goal, solution, user description from steps 1-3
- Focus: Positive driving forces (wishes, aspirations)
- Limits: 2-3 forces, quality over quantity
- Dependencies: Step 03a completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Ask for Positive Forces

> "What does [user name] WANT to achieve? What would make them feel successful?"

**Probing questions:**
- "What would 'winning' look like for them?"
- "What outcome would they be proud of?"
- "What would they brag about to colleagues/friends?"
- "What capability would transform their work/life?"

### 2. Apply Guidelines

**Think aspirations, not just functional needs:**
- Not: "Upload files"
- Yes: "Wish to feel organized and in control"

**What would they feel:**
- Proud of?
- Excited about?
- Validated by?
- Transformed by?

**Aim for 2-3 strong wishes:**
- Quality over quantity
- Specific enough to inform design
- Emotionally resonant

### 3. Reference Examples

**Hairdresser (Harriet):**
- "Wish to be the local beauty authority"
- "Wish to attract premium clients"
- "Wish to be seen as cutting-edge"

**Developer (reviewing code):**
- "Wish to be helpful to teammates"
- "Wish to catch critical bugs"
- "Wish to be recognized for thorough reviews"

**Small business owner:**
- "Wish to understand finances clearly"
- "Wish to make confident decisions"
- "Wish to prove business is growing"

### 4. Capture Format

```yaml
driving_forces:
  positive:
    - "Wish to [aspiration]"
    - "Wish to [aspiration]"
    - "Wish to [aspiration]"
```

### 5. Validation Checklist

Before proceeding, confirm:

- [ ] Forces feel true for this user?
- [ ] Specific enough to inform design?
- [ ] Emotionally resonant (not just functional)?
- [ ] 2-3 forces captured (not too many)?
- [ ] User agrees these motivate their target?

### 6. Handle Common Issues

**Issue:** Forces too generic ("want to save time")
> "Save time doing WHAT specifically? WHY does saving that time matter to them? What would they do with that time?"

**Issue:** Too many wishes listed (7+)
> "Which 2-3 matter MOST? If we could only address three, which would transform their experience?"

**Issue:** Only functional needs ("need to upload files")
> "Why do they need that? What would having that enable them to achieve? What would they feel?"

### 7. Design Hint

These positive forces should inform:
- Success messaging
- Aspirational content
- Celebration moments
- Value proposition

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
- 2-3 emotionally resonant positive forces captured
- Forces are specific enough to inform design
- Validation checklist passed
- User confirmed the aspirations

### FAILURE:
- Accepted only functional needs without emotional depth
- Captured too many or too few forces
- Generated forces without user input

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
