# Step 7: Review and Save VTC

**Duration:** 3-5 minutes

**Purpose:** Validate complete VTC, refine if needed, and save with source attribution

---

## Read Back Complete VTC

```yaml
vtc:
  business_goal:
    primary: "[From Trigger Map]"
    priority: "[From map]"
  solution: "[Newly defined]"
  user:
    name: "[From Trigger Map]"
    description: "[From map]"
    priority: "[From map]"
  driving_forces:
    positive: "[Selected from map]"
    negative: "[Selected from map]"
  customer_awareness:
    start: "[Newly defined]"
    end: "[Newly defined]"
    
metadata:
  source: "trigger_map"
  trigger_map_path: "[path]"
  extracted_date: "[today]"
```

---

## Final Refinement Check

> "Now that you see the complete VTC, did using the Trigger Map for this real scenario reveal anything we should capture?"

**Ask:**
- Missing elements we should add to VTC?
- Wording that needs adjustment?
- Gaps we should update in Trigger Map?

**If refinements needed:**
- Make adjustments to VTC
- Document what should update in Trigger Map
- Note: "Refinements made during final review: [changes]"

**If refinements reveal major Trigger Map gaps:**
- Consider pausing to update Trigger Map
- Document urgency: "now/soon/later"

**If VTC perfect as-is:**
- Great! Trigger Map is robust ✅

---

## Validation

Same 4 questions as Creation Workshop:

1. **Coherence:** Does this tell a coherent story?
2. **Actionable:** Can designers make decisions from this?
3. **Specific:** Are driving forces specific enough?
4. **Realistic:** Does awareness progression make sense?

**All YES?** → Save  
**Any NO?** → Refine and re-validate

---

## Save Location

**Product Pitch:** `docs/A-Product-Brief/vtc-primary.yaml`  
**Scenario:** `docs/D-UX-Design/[scenario-name]/vtc.yaml`

---

## Important: Include Source Metadata

```yaml
metadata:
  source: "trigger_map"
  trigger_map_path: "[path to source map]"
  extracted_date: "[date]"
  business_goal_priority: "[from map]"
  user_priority: "[from map]"
  
notes: |
  Extracted from Trigger Map for [purpose]
  
  Selection rationale:
  - Chose [goal] because [reason]
  - Chose [user] because [reason]
  - Selected these driving forces because [reason]
  
  Refinements made during workshop:
  - [Any changes/additions during selection]
  - [What should update in Trigger Map]
  
  Trigger Map update recommendations:
  - Element: [what] | Urgency: [now/soon/later] | Reason: [why]
```

---

## Communicate to User

> "Excellent! We've extracted a focused VTC from your Trigger Map.
> 
> **Advantage:** This VTC is backed by your strategic research and remains consistent with your map's priorities.
> 
> **Traceability:** We've documented the source, so if your Trigger Map evolves, we can update this VTC accordingly."

---

## Define Next Actions

Same as Creation Workshop - based on context (Pitch or Scenario).

---

## Completion Checklist

- [ ] VTC validated
- [ ] Saved to correct location
- [ ] Source metadata included
- [ ] Selection rationale documented
- [ ] User understands traceability
- [ ] Next actions defined

---

## Workshop Complete! 🎉

**What was accomplished:**

✅ Extracted strategic VTC from Trigger Map  
✅ Leveraged existing research and priorities  
✅ Maintained consistency with strategic foundation  
✅ Documented source and selection rationale  
✅ Saved for use in design process  

**Time invested:** 10-15 minutes  
**Strategic value:** Focused slice of comprehensive strategy

---

*VTC Selection Workshop Complete - Strategic focus from strategic foundation!*

