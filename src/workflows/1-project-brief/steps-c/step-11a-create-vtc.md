---
name: 'step-11a-create-vtc'
description: 'Create simplified Trigger Map for strategic summary'

# File References
nextStepFile: './step-12-create-product-brief.md'
workflowFile: '../workflow.md'
activityWorkflowFile: '../workflow.md'
---

# Step 11A: Create Trigger Map

## STEP GOAL:
Create a simplified Trigger Map to capture strategic essence for stakeholder communication.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:
- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

### Role Reinforcement:
- You are a Strategic Business Analyst helping distill the Product Brief into a focused Trigger Map
- If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- We engage in collaborative dialogue, not command-response
- You bring structured thinking and facilitation skills, user brings domain expertise and product vision
- Maintain collaborative and strategic tone throughout

### Step-Specific Rules:
- Focus: Trigger Map creation from Product Brief context - Business Goal, Solution, User, Driving Forces, Customer Awareness
- FORBIDDEN: Do not start from zero - use the strategic work already completed
- Approach: Leverage existing Product Brief context, route to Trigger Map Workshop

## EXECUTION PROTOCOLS:
- Primary goal: Trigger Map created and added to Product Brief
- Save/document outputs appropriately
- Avoid generating content without user input

## CONTEXT BOUNDARIES:
- Available context: Complete Product Brief content from steps 1-11
- Focus: Strategic Trigger Map summarizing the product's value chain
- Limits: This is a simplified strategic summary, not detailed scenario Trigger Maps
- Dependencies: Steps 1-11 completed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Explain Trigger Map to User

> "Before we finalize the Product Brief, let's create a Trigger Map.
>
> This is a simplified strategic summary that captures:
> - **Business Goal** - What measurable outcome we want
> - **Solution** - What we're building
> - **User** - Who the primary user is
> - **Driving Forces** - What motivates them (positive + negative)
> - **Customer Awareness** - Where they start and where we move them
>
> This will take about 20-30 minutes and gives you a powerful one-page strategic foundation.
>
> Shall we create the Trigger Map now?"

### 2. Route to Trigger Map Workshop

**If user agrees:**

Load and execute the Trigger Map Workshop Router:
`../vtc-workshop/workflow.md`

**Note:** Since Product Brief stage typically has NO Trigger Map yet, the router will likely send you to the **Creation Workshop**.

### 3. Leverage Product Brief Context

**Important:** You have extensive context from the Product Brief! Use it:

- **Business Goal:** From success_criteria
- **Solution:** From vision
- **User:** From ideal_user_profile
- **Driving Forces:** Infer from positioning, need/opportunity, and user profile
- **Customer Awareness:** Infer from positioning and target customer

**Don't start from zero** - use the strategic work already completed.

### 4. Save Trigger Map

Trigger Map should be saved to:
`{output_folder}/A-Product-Brief/vtc-primary.yaml`

### 5. Add Trigger Map to Brief

After Trigger Map is created, add it to the Product Brief document BEFORE the "Next Steps" section:

```markdown
---

## Trigger Map

**Strategic Summary** - [View full Trigger Map](./vtc-primary.yaml)

- **Business Goal:** [primary goal]
- **Solution:** [solution]
- **User:** [user name/type]
- **Driving Forces:**
  - *Wants to:* [positive forces]
  - *Wants to avoid:* [negative forces]
- **Awareness Journey:** [start stage] → [end stage]

This Trigger Map provides quick strategic reference and will inform all design decisions.

---
```

### 6. Confirm Completion

> "Excellent! Your Product Brief now includes a Trigger Map.
>
> This Trigger Map will:
> - Help you pitch the project to stakeholders
> - Guide early design decisions
> - Serve as foundation for scenario-specific Trigger Maps in Phase 4
>
> Product Brief is now complete!"

### 7. If User Declines Trigger Map

**If user says:** "Let's skip the Trigger Map for now"

**Response:**
> "No problem! You can create a Trigger Map later using:
> `../vtc-workshop/workflow.md`
>
> However, I recommend creating it before pitching to stakeholders or starting Phase 4 (UX Design). It takes 30 minutes and provides valuable strategic clarity.
>
> Product Brief is complete. You can add a Trigger Map anytime."

Then proceed to mark workflow as complete.

### 8. Agent Dialog Update
**Mandatory:** Append to `dialog/decisions.md` if key decisions were made.

**Record:**
- Trigger Map framework decisions
- Value/Transformation/Cost mapping
- Strategic insights from framework

**Then:** Mark Step 11a complete in `dialog/progress-tracker.md` progress tracker

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
- Trigger Map created or user explicitly deferred
- Product Brief context leveraged (not starting from zero)
- Trigger Map saved to correct location
- Trigger Map summary added to Product Brief document
- User confirmed

### FAILURE:
- Started Trigger Map from zero ignoring existing Product Brief context
- Skipped Trigger Map without offering
- Generated Trigger Map without user collaboration

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
