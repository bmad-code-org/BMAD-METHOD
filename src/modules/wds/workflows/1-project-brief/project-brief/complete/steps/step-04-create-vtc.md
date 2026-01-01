# Step 4: Create Value Trigger Chain

## Purpose

Create a simplified Value Trigger Chain (VTC) to crystallize strategic thinking early and guide all subsequent discovery.

## Context for Agent

You now have Vision and Positioning - the essential product idea. Before diving into detailed discovery, we'll create a VTC to serve as a **strategic benchmark**. This forces early clarity and ensures all subsequent work aligns with core strategy.

This VTC will be used for:
- **Strategic benchmark** - "Does this align with our VTC?"
- **Guiding discovery** - Informs questions about users, success criteria, etc.
- **Early validation** - If VTC isn't clear, vision needs work
- **Quick reference** - One-page strategy throughout project

## Instructions

### 1. Explain VTC to User

> "Now that we have your vision and positioning, let's create a Value Trigger Chain (VTC).
> 
> This is a strategic benchmark that will guide all remaining discovery work. It captures:
> - **Business Goal** - What measurable outcome we want
> - **Solution** - What we're building
> - **User** - Who the primary user is
> - **Driving Forces** - What motivates them (positive + negative)
> - **Customer Awareness** - Where they start and where we move them
> 
> This takes 20-30 minutes but is incredibly valuable. It forces strategic clarity NOW and gives us a benchmark to evaluate all future decisions against.
> 
> As we continue discovery (business model, users, success criteria), we'll use this VTC to ensure everything aligns.
> 
> Shall we create the VTC now?"

### 2. Route to VTC Workshop

**If user agrees:**

Load and execute the VTC Workshop Router:
`{project-root}/{bmad_folder}/wds/workflows/shared/vtc-workshop/vtc-workshop-router.md`

**Note:** Since Product Brief stage typically has NO Trigger Map yet, the router will likely send you to the **Creation Workshop**.

### 3. Leverage Vision and Positioning Context

**Important:** You have vision and positioning completed! Use it:

- **Solution:** From vision (what we're building)
- **Business Goal:** Infer from vision (what outcome we want)
- **User:** From positioning (target_customer)
- **Driving Forces:** Infer from positioning (need/opportunity, differentiator)
- **Customer Awareness:** Infer from positioning (where they are now)

**Don't start from zero** - use the strategic work already completed.

**Note:** At this stage, estimates are fine. The VTC will be validated and refined as we discover more detail in later steps.

### 4. Save VTC

VTC should be saved to:
`{output_folder}/A-Product-Brief/vtc-primary.yaml`

### 5. Save VTC (Brief Integration Later)

VTC is saved but NOT yet added to brief document.

**Why:** Product Brief document isn't complete yet. We'll add VTC section during final synthesis (Step 11).

**For now:** VTC exists as separate file and serves as strategic benchmark for remaining discovery steps.

### 6. Confirm Completion and Set Expectation

> "Excellent! We've created your Value Trigger Chain.
> 
> This VTC will serve as our strategic benchmark. As we continue discovery (business model, target users, success criteria, etc.), we'll use this VTC to ensure everything aligns.
> 
> If anything in remaining discovery contradicts this VTC, it means either:
> - The VTC needs adjustment (vision wasn't clear enough)
> - The discovery finding doesn't serve our strategy
> 
> We'll validate and refine the VTC during final synthesis if needed.
> 
> Let's continue with the detailed discovery!"

## Next Step

Load, read full file, and execute: `step-05-business-model.md`

## State Update

Update frontmatter of output file:

```yaml
stepsCompleted:
  [
    'step-01-init.md',
    'step-02-vision.md',
    'step-03-positioning.md',
    'step-04-create-vtc.md',
  ]
status: 'in-progress'
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

