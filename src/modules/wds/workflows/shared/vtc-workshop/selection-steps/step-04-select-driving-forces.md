# Step 4: Select Driving Forces

**Duration:** 5 minutes

**Purpose:** Choose 2-5 most relevant driving forces from Trigger Map for this VTC

---

## Present Available Forces

Show all driving forces for selected user:

> "For [selected user], your Trigger Map shows:
> 
> **Positive (Wishes):**
> 1. [Force 1] - Priority: [score]
> 2. [Force 2] - Priority: [score]
> 3. [Force 3] - Priority: [score]
> 
> **Negative (Fears/Avoid):**
> 1. [Force 1] - Priority: [score]
> 2. [Force 2] - Priority: [score]
> 3. [Force 3] - Priority: [score]"

---

## Guide Selection

> "Which of these driving forces does [this solution/scenario] directly address?
> 
> Pick 2-5 total (mix of positive and negative) that are most relevant here."

**Selection criteria:**
- Does THIS solution actually address this force?
- Balance positive and negative
- Don't include everything (lose focus)
- Higher priority forces are good candidates

---

## Capture Format

```yaml
driving_forces:
  positive:
    - "[Selected wish 1 from map]"
    - "[Selected wish 2 from map]"
  negative:
    - "[Selected fear 1 from map]"
    - "[Selected fear 2 from map]"
```

---

## If Driving Force Missing

**User:** "None of these capture [specific driving force]. But that's critical for this scenario!"

**This is valuable discovery!** Using the map reveals gaps.

**Options:**

**A) Add to Trigger Map now:**
1. Pause VTC workshop
2. Add new driving force to Trigger Map
3. Assign priority
4. Resume and select it

**B) Add to VTC and note for map:**
1. Use new force in this VTC
2. Note: "Add to Trigger Map: [new force]"
3. Update map after workshop

**C) Reword existing force:**
1. Take closest match from map
2. Refine wording in VTC
3. Consider updating map

**Recommendation:** If you discovered this force is critical, add it to the map. Other scenarios likely need it too.

---

## Validation

- [ ] Selected forces directly addressed by this solution?
- [ ] Focused enough (not too many)?
- [ ] Includes both positive and negative?
- [ ] User confirms these are the right ones?
- [ ] If adding new forces, documented for map update?

---

## Next Step

**→ Proceed to [Step 5: Define Solution](./step-05-define-solution.md)**

---

*Step 4 complete - Forces selected*

