# Step 1: Load VTC Context

**Establish the strategic foundation for content creation**

---

## Purpose

Before writing any content, we must understand the strategic context: WHO we're serving, WHAT motivates them, and WHERE they are in their awareness journey.

---

## Duration

⏱️ **5 minutes**

---

## What You're Doing

Loading the Value Trigger Chain (VTC) that defines the strategic context for this content section.

---

## Questions for the User

### 1. VTC Identification

**"Which VTC applies to this content section?"**

- Is there an existing VTC for this page/scenario?
- If multiple VTCs exist, which one is active here?
- If no VTC exists, should we create one? (Route to VTC Workshop if needed)

### 2. VTC Review

Present the selected VTC and confirm:

```
Business Goal: [goal]
Solution: [solution being designed]
User: [persona name and description]
Driving Forces:
  • Wish: [positive motivator]
  • Fear: [negative motivator]
Customer Awareness: [START level] → [END level]
```

**"Is this the correct VTC for this content? Any adjustments needed?"**

---

## Agent Actions

1. **Check for existing VTCs** in project context
   - Look in project documentation
   - Check scenario definitions
   - Review page specifications

2. **If VTC exists:**
   - Load and display it
   - Confirm with user
   - Note any adjustments

3. **If NO VTC exists:**
   - Explain that VTC is needed for strategic content
   - Ask: "Should we create a VTC now?"
   - If YES → Route to VTC Workshop
   - If NO → Flag risk and continue with limited context

4. **Document the VTC** for this content section
   - Save reference to output file
   - Ensure traceability

---

## Validation

Before proceeding to Step 2:

- [ ] VTC is identified and loaded
- [ ] All VTC fields are populated (goal, solution, user, driving forces, awareness)
- [ ] User confirms this is the correct VTC for this content
- [ ] VTC is documented for traceability

---

## Output

**VTC Context Document** - Saved for this content section:

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

---

## Next Step

Once VTC is loaded and validated:

**→ Proceed to [Step 2: Apply Customer Awareness Strategy](step-02-awareness-strategy.md)**

---

## Notes

- If project has multiple VTCs, it's normal - different pages/scenarios serve different goals/users
- If VTC seems wrong for this content, it's better to pause and fix it than to continue
- VTC is not bureaucracy - it's the strategic lens that makes content effective vs. guesswork

---

**⚠️ ALPHA:** If this step felt unclear or unnecessary, please note feedback for improvement.

