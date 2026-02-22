---
name: 'step-03c-create-vtc'
description: 'Create a simplified Value Trigger Chain to strengthen the pitch with strategic clarity'

# File References
nextStepFile: './step-03d-present-approval.md'
workflowFile: '../workflow.md'
---

# Step 19: Create Value Trigger Chain

## STEP GOAL:

Create a simplified VTC (Value Trigger Chain) to add strategic clarity to the pitch document before presenting to stakeholders.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are the Alignment & Signoff facilitator, guiding users to create stakeholder alignment
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring alignment and stakeholder management expertise, user brings their project knowledge
- ✅ Maintain a supportive and clarifying tone throughout

### Step-Specific Rules:

- 🎯 Focus only on creating the VTC or handling decline
- 🚫 FORBIDDEN to force VTC creation - user can decline
- 💬 Approach: Offer VTC creation, leverage existing pitch context
- 📋 Don't start from zero - use strategic work already completed in pitch sections

## EXECUTION PROTOCOLS:

- 🎯 Create VTC or handle decline gracefully
- 💾 Save VTC to `docs/1-project-brief/vtc-primary.yaml`
- 📖 Load VTC Workshop Router at `../../1-project-brief/vtc-workshop/workflow.md` if user agrees
- 🚫 Do not force VTC creation

## CONTEXT BOUNDARIES:

- Available context: Complete alignment document from step-03b
- Focus: VTC creation as strategic enhancement
- Limits: Optional step - user can decline
- Dependencies: step-03b must be completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Offer VTC Creation

"Before we present this for approval, let's create a Value Trigger Chain (VTC) to add strategic clarity to your pitch.

A VTC is a simplified strategic summary that captures:
- **Business Goal** - What measurable outcome you want
- **Solution** - What you're building
- **User** - Who the primary user is
- **Driving Forces** - What motivates them (positive + negative)
- **Customer Awareness** - Where they start and where you move them

This takes about 20-30 minutes and gives stakeholders a clear, strategic view of the project. It will be added to your pitch document.

Shall we create the VTC now?"

### 2. If User Agrees

Load and execute the VTC Workshop Router:
`../../1-project-brief/vtc-workshop/workflow.md`

**Note:** At pitch stage, there's typically NO Trigger Map yet, so router will likely send you to the **Creation Workshop**.

#### Leverage Pitch Context

**Important:** You have extensive context from the pitch sections! Use it:

- **Business Goal:** From "Value We'll Create" and "Why It Matters"
- **Solution:** From "Recommended Solution"
- **User:** From "Why It Matters" (who we help)
- **Driving Forces:** Infer from "Why It Matters" and "Cost of Inaction"
- **Customer Awareness:** Infer from "The Realization" and solution approach

**Don't start from zero** - use the strategic work already completed.

#### Save VTC

VTC should be saved to:
`docs/1-project-brief/vtc-primary.yaml`

#### Add VTC to Pitch

After VTC is created, add it to the pitch document using the template placeholders.

### 3. If User Declines

**If user says:** "Let's skip the VTC for now"

**Response:**
> "No problem! You can create a VTC later using:
> `{project-root}/_bmad/wds/workflows/1-project-brief/vtc-workshop/workflow.md`
>
> However, I recommend creating it before presenting to stakeholders. It takes 30 minutes and provides powerful strategic clarity that helps secure buy-in.
>
> You can also add it after stakeholder feedback if needed."

Then proceed to next step.

### 4. Present MENU OPTIONS

Display: "**Select an Option:** [C] Continue to step-03d-present-approval"

#### Menu Handling Logic:
- IF C: Update agent dialog, then load, read entire file, then execute {nextStepFile}
- IF M: Return to {workflowFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options]

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- User can chat or ask questions - always respond and then redisplay menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN the VTC is created (or declined) will you then load and read fully `{nextStepFile}` to execute and begin the next step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- VTC is created leveraging pitch context (or gracefully declined)
- VTC is saved to correct location if created
- VTC is added to pitch document if created
- User's choice to skip is respected

### ❌ SYSTEM FAILURE:
- Forcing VTC creation when user declines
- Starting VTC from scratch instead of leveraging pitch context
- Not saving VTC to correct location
- Not offering the skip option

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
