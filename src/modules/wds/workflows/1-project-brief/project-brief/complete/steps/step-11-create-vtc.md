# Step 11: Create Value Trigger Chain

## Purpose

Create a simplified Value Trigger Chain (VTC) to capture strategic essence for stakeholder communication.

## Context for Agent

The Product Brief contains comprehensive strategic foundation. Now we'll distill this into a focused VTC that captures the essential strategic chain: Business Goal → Solution → User → Driving Forces → Customer Awareness.

This VTC will be used for:
- Pitching the project to stakeholders
- Quick strategic reference during design
- Foundation for scenario-specific VTCs later

## Instructions

### 1. Explain VTC to User

> "Before we finalize the Product Brief, let's create a Value Trigger Chain (VTC).
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
> Shall we create the VTC now?"

### 2. Route to VTC Workshop

**If user agrees:**

Load and execute the VTC Workshop Router:
`{project-root}/{bmad_folder}/wds/workflows/shared/vtc-workshop/vtc-workshop-router.md`

**Note:** Since Product Brief stage typically has NO Trigger Map yet, the router will likely send you to the **Creation Workshop**.

### 3. Leverage Product Brief Context

**Important:** You have extensive context from the Product Brief! Use it:

- **Business Goal:** From success_criteria
- **Solution:** From vision
- **User:** From ideal_user_profile
- **Driving Forces:** Infer from positioning, need/opportunity, and user profile
- **Customer Awareness:** Infer from positioning and target customer

**Don't start from zero** - use the strategic work already completed.

### 4. Save VTC

VTC should be saved to:
`{output_folder}/A-Product-Brief/vtc-primary.yaml`

### 5. Add VTC to Brief

After VTC is created, add it to the Product Brief document BEFORE the "Next Steps" section:

```markdown
---

## Value Trigger Chain

**Strategic Summary** - [View full VTC](./vtc-primary.yaml)

- **Business Goal:** [primary goal]
- **Solution:** [solution]
- **User:** [user name/type]
- **Driving Forces:**
  - *Wants to:* [positive forces]
  - *Wants to avoid:* [negative forces]
- **Awareness Journey:** [start stage] → [end stage]

This VTC provides quick strategic reference and will inform all design decisions.

---
```

### 6. Confirm Completion

> "Excellent! Your Product Brief now includes a Value Trigger Chain.
> 
> This VTC will:
> - Help you pitch the project to stakeholders
> - Guide early design decisions
> - Serve as foundation for scenario-specific VTCs in Phase 4
> 
> Product Brief is now complete!"

## Next Step

Workflow complete. Update state and present completion.

## State Update

Update frontmatter of output file:

```yaml
stepsCompleted:
  [
    'step-01-init.md',
    'step-02-vision.md',
    'step-03-positioning.md',
    'step-04-business-model.md',
    'step-05-business-customers.md',
    'step-06-target-users.md',
    'step-07-success-criteria.md',
    'step-08-competitive-landscape.md',
    'step-09-constraints.md',
    'step-10-synthesize.md',
    'step-11-create-vtc.md',
  ]
status: 'complete'
```

## If User Declines VTC

**If user says:** "Let's skip the VTC for now"

**Response:**
> "No problem! You can create a VTC later using:
> `{bmad_folder}/wds/workflows/shared/vtc-workshop/vtc-workshop-router.md`
> 
> However, I recommend creating it before pitching to stakeholders or starting Phase 4 (UX Design). It takes 30 minutes and provides valuable strategic clarity.
> 
> Product Brief is complete. You can add VTC anytime."

Then proceed to mark workflow as complete.

