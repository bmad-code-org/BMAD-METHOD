---
name: 'step-02-vtc-consistency'
description: 'Verify Value Trigger Chain consistency and validity'

# File References
nextStepFile: './step-03-seo-strategy.md'
workflowFile: '../workflow.md'
activityWorkflowFile: '../workflow-validate.md'
---

# Validation Step 02: VTC Consistency

## STEP GOAL:
Verify the Value Trigger Chain(s) form a valid chain from business goals through personas to driving forces.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Strategic Business Analyst validating VTC chain integrity
- If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- We engage in collaborative dialogue, not command-response
- You bring structured thinking and facilitation skills, user brings domain expertise and product vision
- Maintain collaborative and strategic tone throughout

### Step-Specific Rules:
- Focus: VTC completeness, chain validity, cross-VTC consistency
- FORBIDDEN: Do not skip chain validity checks
- Approach: Locate VTCs, check completeness, validate chains, check cross-VTC consistency

## EXECUTION PROTOCOLS:
- Primary goal: VTC consistency verified
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: VTC files and Product Brief
- Focus: Chain validity and consistency
- Limits: Validation only, not modification
- Dependencies: Step 01 completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Locate VTC Files

Check for:
- `{output_folder}/A-Product-Brief/vtc-primary.yaml` (Product Pitch VTC)
- Any scenario-level VTCs in `{output_folder}/C-UX-Scenarios/`

### 2. VTC Completeness

For each VTC:
- [ ] `businessGoal` — specific and measurable
- [ ] `solution` — describes how we help the user
- [ ] `user` — identifies who we're helping
- [ ] `drivingForces.positive` — at least 2 entries
- [ ] `drivingForces.negative` — at least 2 entries
- [ ] `customerAwareness.start` — defined
- [ ] `customerAwareness.end` — defined

### 3. Chain Validity

- [ ] Business goal in VTC matches a goal in the Product Brief
- [ ] User in VTC matches a target user in the Product Brief
- [ ] Driving forces are specific (not generic like "wants it to work")
- [ ] Awareness journey makes logical sense (start ≠ end)

### 4. Cross-VTC Consistency (if multiple)

- [ ] No contradictory business goals across VTCs
- [ ] Users are distinct or represent different contexts
- [ ] Driving forces don't duplicate across VTCs without reason

### 5. Report

```
## VTC Consistency Report

**VTCs found:** [N]
**All complete:** [Yes/No]
**Chain issues:** [N]

[List any broken chains or inconsistencies]
```

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
- All VTCs located and checked
- Completeness verified for each VTC
- Chain validity confirmed
- Cross-VTC consistency checked (if multiple)
- Consistency report generated

### FAILURE:
- Skipped chain validity checks
- Missed VTC files
- Did not check cross-VTC consistency

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
