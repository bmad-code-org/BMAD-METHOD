---
name: 'step-01-load-vtc-context'
description: 'Establish the strategic foundation by loading Value Trigger Chain context for content creation'
nextStepFile: './step-02-awareness-strategy.md'
---

# Step 1: Load VTC Context

## STEP GOAL:

Load the Value Trigger Chain (VTC) that defines the strategic context — WHO we are serving, WHAT motivates them, and WHERE they are in their awareness journey — so that all content decisions are anchored in strategy, not guesswork.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a strategic content analyst loading the VTC foundation
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring strategic methodology for VTC loading, user brings their project knowledge
- ✅ Maintain a thorough, investigative tone — the VTC must be correct before proceeding

### Step-Specific Rules:

- 🎯 Focus ONLY on loading and validating the VTC context
- 🚫 FORBIDDEN to generate content text or apply awareness strategy in this step
- 💬 If no VTC exists, offer to route to VTC Workshop or flag risk
- 📋 Ensure all VTC fields are populated before proceeding

## EXECUTION PROTOCOLS:

- 🎯 Follow the Sequence of Instructions exactly
- 💾 Document VTC context for traceability
- 📖 Check for existing VTCs in project documentation before asking user
- 🚫 FORBIDDEN to proceed without a confirmed VTC

## CONTEXT BOUNDARIES:

- Available context: Purpose definition from Step 0, project configuration
- Focus: Loading and validating the correct VTC for this content
- Limits: Do not apply the VTC yet — just load and confirm it
- Dependencies: Purpose definition from Step 0

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Check for Existing VTCs

Search project documentation for VTCs:
- Check project documentation and scenario definitions
- Check page specifications
- Look for VTC references in trigger map

### 2. Identify the Correct VTC

Ask: **"Which VTC applies to this content section?"**

- Is there an existing VTC for this page/scenario?
- If multiple VTCs exist, which one is active here?
- If no VTC exists, offer to create one (route to VTC Workshop) or flag risk

### 3. Present and Confirm VTC

Display the selected VTC:

```
Business Goal: [goal]
Solution: [solution being designed]
User: [persona name and description]
Driving Forces:
  - Wish: [positive motivator]
  - Fear: [negative motivator]
Customer Awareness: [START level] → [END level]
```

Ask: **"Is this the correct VTC for this content? Any adjustments needed?"**

### 4. Handle Missing VTC

If no VTC exists:
- Explain that VTC is needed for strategic content
- Ask: "Should we create a VTC now?"
- If YES: Route to VTC Workshop
- If NO: Flag risk and continue with limited context

### 5. Document VTC Context

Save the confirmed VTC reference:

```yaml
vtc_reference:
  business_goal: "[goal text]"
  solution: "[solution name/description]"
  user:
    name: "[persona name]"
    description: "[brief persona description]"
  driving_forces:
    positive: "[wish/aspiration]"
    negative: "[fear/frustration]"
  customer_awareness:
    start: "[awareness level where user begins]"
    end: "[awareness level we want them to reach]"
```

### 6. Present MENU OPTIONS

Display: **"Select an Option:** [C] Continue"

#### Menu Handling Logic:

- IF C: Save VTC context, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- User can chat or ask questions — always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and the VTC is confirmed and documented will you load {nextStepFile} to begin applying the Customer Awareness Strategy.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- VTC is identified and loaded
- All VTC fields are populated (goal, solution, user, driving forces, awareness)
- User confirms this is the correct VTC for this content
- VTC is documented for traceability

### ❌ SYSTEM FAILURE:

- Proceeding without a confirmed VTC
- Generating content text in this step
- Applying awareness strategy before VTC is loaded
- Not offering VTC Workshop route when no VTC exists
- Not waiting for user input at menu

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
