---
name: 'step-04-create-vtc'
description: 'Create a simplified Trigger Map to crystallize strategic thinking early'

# File References
nextStepFile: './step-05-business-model.md'
workflowFile: '../workflow.md'
---

# Step 4: Create Trigger Map

## STEP GOAL:
Create a simplified Trigger Map to crystallize strategic thinking early and guide all subsequent discovery. The Trigger Map serves as a strategic benchmark — capturing Business Goal, Solution, User, Driving Forces, and Customer Awareness.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- ✅ You are Saga, a strategic facilitator helping create Trigger Map based on available context
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring structured strategic thinking, user brings domain expertise
- ✅ Maintain focused, strategic tone throughout

### Step-Specific Rules:
- 🎯 Focus on creating Trigger Map leveraging existing Vision and Positioning context
- 🚫 FORBIDDEN to start from zero — use the strategic work already completed
- 💬 Approach: Leverage existing context, fill gaps collaboratively
- 📋 Trigger Map is saved separately, NOT added to brief document yet (that happens at Step 12)

## EXECUTION PROTOCOLS:
- 🎯 Produce a complete Trigger Map (Business Goal, Solution, User, Driving Forces, Customer Awareness)
- 💾 Save Trigger Map to `{output_folder}/A-Product-Brief/vtc-primary.yaml`
- 📖 Route to Trigger Map Workshop at `../vtc-workshop/workflow.md` if user agrees
- 🚫 Avoid starting from zero — leverage Vision and Positioning

## CONTEXT BOUNDARIES:
- Available context: Vision from Step 2, Positioning from Step 3
- Focus: Trigger Map creation as strategic benchmark
- Limits: At this stage, estimates are fine — Trigger Map will be refined later
- Dependencies: Steps 1-3 completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Explain Trigger Map to User
Explain Trigger Map components and purpose:
- Business Goal — What measurable outcome we want
- Solution — What we are building
- User — Who the primary user is
- Driving Forces — What motivates them (positive + negative)
- Customer Awareness — Where they start and where we move them

Explain this takes 20-30 minutes and is incredibly valuable for strategic clarity. Ask: "Shall we create the Trigger Map now?"

### 2. Route to Trigger Map Workshop
**If user agrees:** Load and execute the Trigger Map Workshop Router at `../vtc-workshop/workflow.md`. Since Product Brief stage typically has NO Trigger Map yet, the router will likely send to the Creation Workshop.

### 3. Leverage Vision and Positioning Context
Use existing strategic work:
- Solution: From vision (what we are building)
- Business Goal: Infer from vision (what outcome we want)
- User: From positioning (target_customer)
- Driving Forces: Infer from positioning (need/opportunity, differentiator)
- Customer Awareness: Infer from positioning (where they are now)

### 4. Save Trigger Map
Save to `{output_folder}/A-Product-Brief/vtc-primary.yaml`. Trigger Map is saved but NOT yet added to brief document — that happens during final synthesis.

### 5. Confirm Completion
Explain that Trigger Map will serve as strategic benchmark. As discovery continues, we use this Trigger Map to ensure everything aligns. If contradictions arise, either Trigger Map needs adjustment or the discovery finding does not serve strategy.

### 6. Agent Dialog Update
**Mandatory:** Append to `dialog/decisions.md` if key decisions were made.

Record: Value/Transformation/Cost framework decisions, how value and transformation connect, key insights about user journey.

Mark Step 4 complete in `dialog/progress-tracker.md` progress tracker.

### 7. If User Declines Trigger Map
If user says "Let's skip the Trigger Map for now," explain they can create it later using `_bmad/wds/workflows/1-project-brief/vtc-workshop/workflow.md`. Recommend creating it before pitching to stakeholders or starting Phase 4. Then proceed to next step.

### 8. Present MENU OPTIONS
Display: "**Select an Option:** [C] Continue to Business Model"

#### Menu Handling Logic:
- IF C: Update agent dialog, then load, read entire file, then execute {nextStepFile}
- IF M: Return to {workflowFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options]

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- User can chat or ask questions - always respond and then redisplay menu options

## CRITICAL STEP COMPLETION NOTE
ONLY WHEN Trigger Map is created (or user declines) and completion is confirmed will you then load and read fully `{nextStepFile}`.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:
- Trigger Map created with all components or user explicitly declined
- Existing Vision and Positioning context leveraged (not starting from zero)
- Trigger Map saved to correct output location
- User understands Trigger Map purpose as strategic benchmark
- Agent dialog updated

### ❌ SYSTEM FAILURE:
- Started Trigger Map from zero without using existing context
- Generated Trigger Map components without user input
- Did not save Trigger Map to correct location
- Skipped confirmation with user

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
