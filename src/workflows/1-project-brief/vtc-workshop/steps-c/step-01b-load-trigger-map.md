---
name: 'step-01b-load-trigger-map'
description: 'Load and verify existing Trigger Map for VTC extraction'

# File References
nextStepFile: './step-02b-select-business-goal.md'
workflowFile: '../../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 1: Load Trigger Map

## STEP GOAL:
Access existing Trigger Map and verify it's ready for VTC extraction.

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
- Focus: Load Trigger Map, verify it contains necessary elements
- FORBIDDEN: Do not proceed without verifying the map has business goals, users, and driving forces
- Approach: Ask for path, load, verify contents, handle incomplete maps

## EXECUTION PROTOCOLS:
- Primary goal: Trigger Map loaded and verified
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Project config, Trigger Map location
- Focus: Map loading and verification
- Limits: Verification only, not modification
- Dependencies: VTC workshop routing completed (Selection path chosen)

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Ask for Trigger Map Location

> "What's the path to your Trigger Map document?"

**Expected locations:**
- `{output_folder}/B-Trigger-Map/trigger-map.md`
- `{output_folder}/B-Trigger-Map/trigger-map.yaml`
- `{output_folder}/B-Trigger-Map/00-trigger-map.md`

### 2. Load and Verify

**Check Trigger Map contains:**
- [ ] Business goals (with priorities if available)
- [ ] Target groups/users (with descriptions)
- [ ] Driving forces per user (positive and negative)
- [ ] Priorities/scores (optional but helpful)

**Confirm availability:**
```
Found Trigger Map with:
- [X] business goals
- [X] target groups/users
- [Y] total driving forces
- Priorities: [Yes/No]

Ready to extract VTC!
```

### 3. Handle Incomplete Map

**Missing elements?**

**Option A** - Pause and complete map:
> "Your Trigger Map seems incomplete. Should we finish mapping first, or work with what we have?"

**Option B** - Switch to Creation Workshop:
> "Since the Trigger Map isn't complete, would you prefer to create a VTC from scratch instead?"

### 4. Capture Map Reference

```yaml
metadata:
  source: "trigger_map"
  trigger_map_path: "[path to map file]"
  trigger_map_date: "[last modified date]"
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
- Trigger Map located and loaded
- Contents verified (goals, users, forces present)
- Map reference metadata captured
- Ready for VTC extraction

### FAILURE:
- Proceeded without verifying map contents
- Did not handle incomplete map scenario
- Skipped verification checklist

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
