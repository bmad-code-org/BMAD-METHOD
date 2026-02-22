---
name: 'step-05a-negative-driving-forces'
description: 'Discover what the user FEARS or wants to avoid - anxieties and frustrations'

# File References
nextStepFile: './step-06a-customer-awareness.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 5: Identify Negative Driving Forces

## STEP GOAL:
Discover what the user FEARS or wants to avoid - their anxieties, frustrations, and what pushes them away from failure.

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
- Focus: Anxieties and frustrations, not just functional dislikes
- FORBIDDEN: Do not accept mild or generic fears without probing deeper
- Approach: Ask, probe for real fears, capture 2-3 strong forces, validate, review combined forces

## EXECUTION PROTOCOLS:
- Primary goal: 2-3 negative driving forces captured and combined forces reviewed
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Business goal, solution, user, positive forces from steps 1-4
- Focus: Negative driving forces (fears, anxieties, frustrations)
- Limits: 2-3 forces, total 4-6 combined with positive
- Dependencies: Step 04a completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Ask for Negative Forces

> "What does [user name] FEAR or want to avoid? What keeps them up at night?"

**Probing questions:**
- "What are they worried about?"
- "What would be embarrassing or costly?"
- "What would feel like failure?"
- "What friction do they currently experience?"
- "What do they NOT want to happen?"

### 2. Apply Guidelines

**Think anxieties and frustrations:**
- Not: "Don't want slow system"
- Yes: "Fear of wasting hours on complex tools"

**What do they fear:**
- Losing?
- Missing?
- Being seen as?
- Experiencing?

**Aim for 2-3 strong fears:**
- Often opposite side of positive forces
- Specific and emotionally real
- Inform risk reduction in design

### 3. Reference Examples

**Hairdresser (Harriet):**
- "Fear of missing industry trends"
- "Fear of losing clients to trendier salons"
- "Avoid appearing outdated to clients"

**Developer (reviewing code):**
- "Fear of missing critical bugs"
- "Fear of slowing down teammates"
- "Avoid looking careless or rushed"

**Small business owner:**
- "Fear of making wrong financial decisions"
- "Fear of tax compliance issues"
- "Avoid feeling stupid about numbers"

### 4. Note Connection to Positive Forces

**Notice patterns:**
- Positive: "Wish to be authority" <-> Negative: "Fear of appearing outdated"
- Positive: "Wish to catch bugs" <-> Negative: "Fear of missing bugs"

**Both sides of same coin** - this is good! Shows coherent psychology.

### 5. Capture Format

```yaml
driving_forces:
  positive:
    - "[from previous step]"
  negative:
    - "Fear of [anxiety]"
    - "Fear of [frustration]"
    - "Avoid [problem]"
```

### 6. Validation Checklist

Before proceeding, confirm:

- [ ] Forces feel true for this user?
- [ ] Specific enough to inform design?
- [ ] Connect to positive forces (opposite sides)?
- [ ] 2-3 forces captured (total 4-6 positive + negative)?
- [ ] User agrees these are real anxieties?

### 7. Handle Common Issues

**Issue:** Forces too mild ("don't like complexity")
> "What's the REAL fear behind that? What happens if they encounter complexity? What cost do they pay?"

**Issue:** Only negative stated as positive inverse ("want to not fail")
> "What ARE they afraid of specifically? What would failure look like?"

**Issue:** Too many fears (overwhelming)
> "Which 2-3 fears are strongest? Which would prevent them from using this solution?"

### 8. Review Combined Forces

**At this point, review ALL driving forces together:**

```yaml
driving_forces:
  positive:
    - "[wish 1]"
    - "[wish 2]"
    - "[wish 3]"
  negative:
    - "[fear 1]"
    - "[fear 2]"
```

**Ask:** "Do these forces tell a coherent story about what drives [user name]?"

If yes -> Proceed
If no -> Refine before moving forward

### 9. Design Hint

These negative forces should inform:
- Risk reduction features
- Reassurance messaging
- Error prevention
- Trust signals
- Recovery paths

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
- 2-3 emotionally real negative forces captured
- Forces connect to positive forces (coherent psychology)
- Combined forces reviewed and validated
- User confirmed the anxieties

### FAILURE:
- Accepted mild or generic fears without depth
- Skipped combined forces review
- Generated forces without user input

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
