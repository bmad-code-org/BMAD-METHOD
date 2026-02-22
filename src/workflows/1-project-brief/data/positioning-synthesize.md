# Substep 4: Synthesize & Document

## Task

Create positioning statement from captured components and document in product brief.

## Instructions

### 1. Create Positioning Statement

Use the classic framework:

**Format:**
> "For [target customer] who [need/opportunity], [product name] is a [category] that [key benefit]. Unlike [alternatives], we [differentiator]."

**Craft the statement:**
- Use natural language (not robotic template-speak)
- Focus on clarity over cleverness
- Make it useful for stakeholders and team (not marketing copy)

### 2. Present to User

Show them the positioning statement:

> "Based on our conversation, here's your positioning statement:
>
> [Positioning statement]
>
> This captures who it's for, what makes it different, and the key value. Does this feel right?"

**If user wants adjustments:**
- Listen to what they want to change
- Revise and re-present
- Get final confirmation

### 3. Document with Context

**Add to product brief with supporting components:**

```markdown
## Positioning

**Positioning Statement:**
[Final confirmed statement]

**Components:**

- **Target Customer:** [who]
- **Their Need:** [problem/opportunity]
- **Product Category:** [type]
- **Key Benefit:** [value]
- **Alternatives:** [what people use instead]
- **Differentiator:** [what makes it unique]

**Strategic Rationale:**
[1-2 sentences explaining why this positioning makes sense - reference specific context from conversation]
```

### 4. Update Agent Dialog

**In `dialog/07-positioning.md`:**

Document:
- Opening question used
- Key exchanges that revealed positioning components
- Reflection checkpoint (synthesis + confirmation/correction)
- Final positioning statement (with all components)
- Strategic rationale

### 5. Mark Progress

**In `dialog/progress-tracker.md`:**
- Mark Step 3 (Positioning) as complete
- Update last_updated timestamp

---

## Example

**Agent:** "Based on our conversation, here's your positioning statement:

**For vehicle owners in northern Öland** who need reliable service for any type of vehicle (cars, motorhomes, tractors, or equipment), **Källa Fordonservice is a full-spectrum certified garage** that provides peace of mind with 20+ years of trusted expertise. **Unlike garages that specialize or can't handle certain vehicles**, we service everything from lawnmowers to tour buses as the region's only AutoExperten-certified comprehensive option.

This captures who it's for (locals + tourists), what makes it different (handles all vehicle types), and the key value (peace of mind from expertise). Does this feel right?"

**User:** "Perfect - that's it."

**Agent:** [Documents in product brief]

```markdown
## Positioning

**Positioning Statement:**
For vehicle owners in northern Öland who need reliable service for any type of vehicle, Källa Fordonservice is a full-spectrum certified garage that provides peace of mind with 20+ years of trusted expertise. Unlike garages that specialize or can't handle certain vehicles, we service everything from lawnmowers to tour buses as the region's only AutoExperten-certified comprehensive option.

**Components:**

- **Target Customer:** Vehicle owners in northern Öland (year-round locals, summer tourists)
- **Their Need:** Reliable service for any vehicle type, particularly when uncertain if a garage can handle their specific vehicle
- **Product Category:** Full-spectrum certified auto service garage
- **Key Benefit:** Peace of mind from comprehensive expertise (any vehicle type)
- **Alternatives:** Specialized garages, Borgholm alternatives, calling around to find capable service
- **Differentiator:** Only comprehensive option in northern Öland, handles all vehicle types (lawnmowers→tour buses), 20+ years experience, AutoExperten certified

**Strategic Rationale:**
Northern Öland's geography creates a natural monopoly during summer season, but year-round locals are the core customer base. Positioning emphasizes breadth of capability (reducing "do you service X?" calls) and credibility (AutoExperten certification, 20+ years) to serve both stressed tourists and loyal local customers.
```

---

## Agent Dialog Update

**Mandatory:** Update `dialog/07-positioning.md` with:
- Full conversation flow
- Reflection checkpoint with corrections (if any)
- Final positioning statement and components
- Strategic rationale

**Then:** Mark Step 3 complete in `dialog/progress-tracker.md`

---

## Next Step

Update frontmatter:

```yaml
stepsCompleted: ['step-01-init.md', 'step-02-vision.md', 'step-03-positioning.md']
positioning: '[final positioning statement]'
```

Load, read full file, and execute: `step-04-create-vtc.md`
