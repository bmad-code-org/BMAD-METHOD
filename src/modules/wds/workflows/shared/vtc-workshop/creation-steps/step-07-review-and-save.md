# Step 7: Review and Save VTC

**Duration:** 3 minutes

**Purpose:** Validate completeness and save the VTC for use

---

## What You'll Do

Review the complete VTC for coherence, then save it to the appropriate location.

---

## Step 7A: Read Back Complete VTC

**Present the full VTC to user:**

```yaml
vtc:
  business_goal: "[goal]"
  solution: "[solution]"
  user:
    name: "[name]"
    description: "[description]"
    context: "[context]"
  driving_forces:
    positive:
      - "[wish 1]"
      - "[wish 2]"
    negative:
      - "[fear 1]"
      - "[fear 2]"
  customer_awareness:
    start: "[start stage]"
    end: "[end stage]"
```

---

## Step 7B: Validate with Questions

**Ask each validation question:**

### 1. Coherence
> "Does this tell a coherent story?"

- Business goal → Solution → User → Forces → Awareness
- Does it flow logically?
- Does each piece connect to the others?

### 2. Actionable
> "Can you make design decisions from this?"

- Specific enough to guide choices?
- Clear what would/wouldn't serve this VTC?
- Could someone else use this?

### 3. Specific
> "Are the driving forces specific enough?"

- Go beyond generic?
- Emotionally resonant?
- Different from other users?

### 4. Realistic
> "Does the awareness progression make sense?"

- Can solution realistically move user that far?
- Appropriate for this interaction type?
- Supports business goal?

**All YES?** → VTC is ready to save  
**Any NO?** → Refine that specific element

---

## Step 7C: Quick Refinement (if needed)

**If any validation failed:**

1. Identify which element needs work
2. Return to that step briefly
3. Make adjustment
4. Re-validate

**Keep momentum** - don't get stuck perfecting. "Good enough to guide design" is the bar.

---

## Step 7D: Determine Save Location

**Ask:**
> "What is this VTC for?"

**If Product Pitch:**
- Location: `docs/A-Product-Brief/vtc-primary.yaml`
- Purpose: Stakeholder communication, strategic alignment

**If Scenario:**
- Location: `docs/D-UX-Design/[scenario-name]/vtc.yaml`
- Purpose: Guide scenario design decisions
- Example: `docs/D-UX-Design/1.1-landing-page/vtc.yaml`

**If Prototype/Other:**
- Location: `docs/[appropriate-folder]/vtc-[name].yaml`
- Purpose: As defined by user

---

## Step 7E: Create VTC File

**Use template:** Copy from `workflows/shared/vtc-workshop/vtc-template.yaml`

**Fill in all sections:**

```yaml
vtc:
  business_goal: "[captured value]"
  solution: "[captured value]"
  user:
    name: "[captured value]"
    description: "[captured value]"
    context: "[captured value]"
  driving_forces:
    positive: [captured values]
    negative: [captured values]
  customer_awareness:
    start: "[captured value]"
    end: "[captured value]"

metadata:
  created_date: "[today's date]"
  created_by: "[team/person]"
  version: "1.0"
  source: "creation"  # Created from scratch
  purpose: "[product_pitch / scenario / etc]"
  phase: "[WDS phase]"

notes: |
  Created: [date]
  Context: [why this VTC was created]
  
  Key decisions made:
  - [Important choices during workshop]
  - [Insights captured]
  
  Usage guidance:
  - [How this VTC should inform design]
```

**Save file to determined location**

---

## Step 7F: Communicate What They Have

**Explain to user:**

> "Excellent! We've created a Value Trigger Chain that shows:
> 
> **Business Goal:** [goal]  
> **User:** [name] who wants to [positive force] and avoid [negative force]  
> **Solution:** [solution] that moves them from [start] to [end] awareness
> 
> This VTC will guide all design decisions for [context]. Every piece of content, every interaction, every design choice should serve this strategic chain.
> 
> **Next time you're making a design decision, ask:**  
> 'Does this serve the business goal by triggering these driving forces while moving the user forward in awareness?'
> 
> If yes → Good decision  
> If no → Reconsider"

---

## Step 7G: Define Next Actions

**Based on context:**

**If Product Pitch:**
> "Next steps:
> 1. Add this VTC to your pitch document
> 2. Structure pitch narrative around this chain
> 3. Use it to explain strategic reasoning to stakeholders
> 4. Can evolve into full Trigger Map later as project grows"

**If Scenario:**
> "Next steps:
> 1. Use this VTC to guide page design in this scenario
> 2. All content should address these driving forces
> 3. Track if you're actually moving users through awareness
> 4. Create additional VTCs for other scenarios as needed"

---

## Completion Checklist

- [ ] VTC validated with all 4 questions
- [ ] VTC saved to appropriate location
- [ ] Metadata completed (date, source, purpose)
- [ ] Notes section filled with context
- [ ] User understands what they have
- [ ] User knows how to use VTC
- [ ] Next actions defined

---

## Workshop Complete! 🎉

**What was accomplished:**

✅ Created strategic VTC from scratch  
✅ Captured business goal, user psychology, solution  
✅ Identified positive and negative driving forces  
✅ Positioned customer awareness progression  
✅ Validated coherence and actionability  
✅ Saved for use in design process  

**Time invested:** 20-30 minutes  
**Strategic value:** Guides all future design decisions

---

## Related Resources

- [Value Trigger Chain Guide](../../../../docs/method/value-trigger-chain-guide.md) - Full methodology
- [Using VTC in Design](../vtc-workshop-guide.md) - Applications and examples
- [Trigger Mapping Guide](../../../../docs/method/phase-2-trigger-mapping-guide.md) - When to create full map

---

*VTC Creation Workshop Complete - Strategic clarity achieved!*

