# Value Trigger Chain Workshop Suite

**Purpose:** Create or extract Value Trigger Chains for strategic design guidance

**Location:** Shared across multiple WDS phases

**Used in:**
- Phase 1: Product Pitch (simplified VTC for stakeholder communication)
- Phase 4: Scenario Definition (VTC for each scenario)

---

## ⚠️ Alpha Status

**This workshop suite is in ALPHA.**

**What this means:**
- Methodology is sound, structure is complete
- **Not yet validated in real projects**
- Steps may need refinement based on actual usage
- Timing estimates may be off
- Edge cases may emerge

**We need your feedback:**
- What worked well?
- What was confusing?
- What took longer than estimated?
- What's missing?
- Where did you get stuck?

**Report issues/feedback:** Add notes to your VTC file or create session log

**This notice will be removed** once validated across 3-5 real projects.

---

## Quick Start

**Run VTC Workshop:**

```
1. Start here: vtc-workshop-router.md
2. Answer: "Do you have a Trigger Map?"
3. Router sends you to appropriate workshop
4. Complete workshop (10-30 minutes)
5. Get VTC file ready to use
```

---

## Workshop Files

### [vtc-workshop-router.md](./vtc-workshop-router.md)

**What:** Entry point that routes to correct workshop  
**Duration:** 1 minute  
**Use when:** You need a VTC

**Decision:**
- Has Trigger Map? → Selection Workshop
- No Trigger Map? → Creation Workshop

---

### [vtc-creation-workshop.md](./vtc-creation-workshop.md)

**What:** Create VTC from scratch (no Trigger Map)  
**Duration:** 20-30 minutes  
**Use when:** Early stage, quick projects, no time for full Trigger Map

**Process:**
1. Define business goal
2. Identify solution
3. Describe user
4. Identify driving forces (positive + negative)
5. Position customer awareness

**Output:** Complete VTC

---

### [vtc-selection-workshop.md](./vtc-selection-workshop.md)

**What:** Extract VTC from existing Trigger Map  
**Duration:** 10-15 minutes  
**Use when:** Trigger Map exists, want consistency

**Process:**
1. Load Trigger Map
2. Select business goal
3. Select user
4. Select relevant driving forces (subset)
5. Define solution
6. Position customer awareness
7. Optional refinements

**Output:** VTC extracted from map

---

### [vtc-template.yaml](./vtc-template.yaml)

**What:** Standard format for all VTCs  
**Use:** Both workshops output this format

**Contains:**
- Business Goal
- Solution
- User description
- Driving Forces (positive + negative)
- Customer Awareness (start → end)
- Metadata and notes

---

## When to Use VTC vs. Trigger Map

### Use VTC (Lightweight) When:

**Time:**
- < 2 weeks total timeline
- Need to start NOW
- Can't dedicate 1-2 days to mapping

**Scope:**
- 1-3 key flows
- Single primary user
- Focused project/prototype
- Standalone scenario

**Resources:**
- Small team
- Limited research budget
- Founder/solo designer

**Context:**
- Early product pitch
- Quick validation
- MVP/POC
- Client presentation

**Result:** Sufficient strategic grounding for focused work

---

### Use Trigger Map (Comprehensive) When:

**Time:**
- > 1 month timeline
- Can invest 1-2 days upfront
- Long-term product

**Scope:**
- Multiple user types
- Complex product
- Many scenarios
- Full platform

**Resources:**
- Full team
- Research capacity
- Stakeholder availability

**Context:**
- Strategic foundation needed
- Multiple VTCs will be extracted
- Prioritization crucial
- Long shelf life desired

**Result:** Deep strategic foundation, many VTCs derived

---

## VTC in Product Pitch (Phase 1)

### Purpose
Create ONE simplified VTC for stakeholder communication

### Typical Flow
```
Product Brief Workshop
  ↓
VTC Workshop (usually Creation - no map yet)
  ↓
VTC added to Pitch Document
  ↓
Pitch uses VTC to explain:
  - WHO we're building for
  - WHAT motivates them
  - WHY this solution matters
```

### Example Pitch Structure with VTC

**Slide 1: The Opportunity**
- Business Goal (from VTC)

**Slide 2: The User**
- User description (from VTC)
- Driving Forces (from VTC)

**Slide 3: Our Solution**
- Solution (from VTC)
- How it triggers positive forces
- How it addresses negative forces

**Slide 4: The Journey**
- Customer Awareness progression (from VTC)
- What changes for the user

**Result:** Stakeholders understand strategic grounding

---

## VTC in Scenario Definition (Phase 4)

### Purpose
Assign VTC to each scenario for design guidance

### Typical Flow
```
Scenario Identified
  ↓
VTC Workshop
  ├─ If Trigger Map exists → Selection Workshop
  └─ If no map → Creation Workshop
  ↓
VTC assigned to Scenario
  ↓
All pages in scenario inherit VTC
  ↓
Design decisions reference VTC
```

### Multiple Scenarios = Multiple VTCs

**Example: User Onboarding Product**

```
Scenario 1: First Visit (Landing Page)
VTC-01:
- Goal: 500 signups
- User: Curious visitor
- Forces: Want to understand, fear commitment
- Awareness: Problem Aware → Product Aware

Scenario 2: Account Setup
VTC-02:
- Goal: 80% activation
- User: New signup
- Forces: Want quick value, fear complexity
- Awareness: Product Aware → Most Aware

Scenario 3: Dashboard (First Use)
VTC-03:
- Goal: 80% activation
- User: First-time user
- Forces: Want to feel capable, fear looking stupid
- Awareness: Most Aware (maintain and deepen)
```

**Notice:** Same product, different VTCs based on context

---

## Workshop Tips

### For Agents Running Workshops

**Momentum:**
- Keep workshop moving (don't get stuck)
- "We can refine later" if user hesitates
- Capture first, perfect second

**Validation:**
- Quick checks at each step
- "Does this feel right?"
- Catch issues early

**Examples:**
- Use examples from guide to illustrate
- Show good vs bad
- Make abstract concrete

**Focus:**
- One VTC at a time
- One primary user
- 2-5 driving forces (not 20)

### For Users Creating VTCs

**Don't Overthink:**
- This is a heuristic, not science
- Better to have rough VTC than none
- Can refine as you learn

**Be Specific:**
- Generic = not useful
- "Save time" → "Save time doing WHAT?"
- "Better experience" → "Feel capable doing WHAT?"

**Test It:**
- After creating VTC, try making a design decision
- Does VTC guide you?
- If not, refine VTC

---

## Common Questions

### Q: How many VTCs do I need?

**Product Pitch:** 1 (maybe 2 for complex products)  
**Scenarios:** 1 per major scenario  
**Simple product:** 2-3 total  
**Complex product:** 5-10 total

### Q: Can scenarios share VTCs?

Yes, if they serve same goal, same user, same forces. But often scenarios have slightly different contexts, so separate VTCs maintain clarity.

### Q: What if I have a Trigger Map but it's old?

Run Selection Workshop but be prepared for Refinement step. May discover need to update Trigger Map.

### Q: Can I create VTC now and Trigger Map later?

Absolutely! VTC is lightweight start. As project grows, create Trigger Map and extract more VTCs from it. Original VTC becomes input to Trigger Map.

### Q: How do I know if VTC is good enough?

Ask: "Can I make design decisions from this?"
- Yes → It's good enough
- No → Which part is too vague? Refine that

---

## File Outputs

### Product Pitch VTC
**Location:** `docs/A-Product-Brief/vtc-primary.yaml`

**Used in:**
- Pitch deck
- Stakeholder presentations
- Project kickoff
- Strategic alignment

### Scenario VTC
**Location:** `docs/D-UX-Design/[scenario-name]/vtc.yaml`

**Used in:**
- Scenario specification
- Page design decisions
- Content creation
- Component specifications

### Multiple Scenarios
```
docs/D-UX-Design/
├── 1.1-landing-page/
│   └── vtc.yaml
├── 1.2-signup-flow/
│   └── vtc.yaml
├── 2.1-dashboard/
│   └── vtc.yaml
└── 2.2-settings/
    └── vtc.yaml
```

---

## Maintenance

### When VTC Changes
1. Update YAML file
2. Increment version (v1 → v2)
3. Keep old version for reference
4. Update related documents
5. If extracted from Trigger Map, consider updating map

### When Trigger Map Changes
1. Review all VTCs extracted from it
2. Check if VTCs still align
3. Update VTCs if needed
4. Document changes

---

## Success Metrics

**Good VTC when:**
- ✅ Designer can make decisions without asking "why?"
- ✅ Content creator knows which driving forces to address
- ✅ Stakeholders understand strategic reasoning
- ✅ Team aligned on WHO and WHY
- ✅ Can evaluate design alternatives objectively

**VTC needs work when:**
- ❌ Team argues about design opinions (not strategy)
- ❌ Content feels generic
- ❌ Can't explain why design choice serves strategy
- ❌ Driving forces too vague to inform design

---

## Related Resources

- [Value Trigger Chain Guide](../../../docs/method/value-trigger-chain-guide.md) - Complete VTC methodology
- [Trigger Mapping Guide](../../../docs/method/phase-2-trigger-mapping-guide.md) - When to create full map
- [Customer Awareness Cycle](../../../docs/models/customer-awareness-cycle.md) - Understanding awareness stages
- [Product Pitch Process](../../1-project-brief/project-pitch/) - Using VTC in pitches
- [Scenario Definition](../../4-ux-design/scenario-init/) - Using VTC in scenarios

---

*VTC Workshop Suite - Strategic clarity in 10-30 minutes*

