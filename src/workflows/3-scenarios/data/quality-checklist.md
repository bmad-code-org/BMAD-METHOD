# Scenario Quality Checklist

**Used by:** step-07-quality-review.md
**Source:** Adapted from dream-up-rubric-phase-4-scenarios.md

---

## Dimension 1: Completeness (7 sections)

For each scenario, verify all 7 components exist:

- [ ] **Core Feature** — Clear statement of what scenario covers, aligned to business goal
- [ ] **Entry Point** — Specific starting location with device, context, and discovery method
- [ ] **Mental State** — All three present: Trigger (what happened), Hope (what they want), Worry (what they fear)
- [ ] **Success Goals** — Both present: User success (tangible) + Business success (measurable)
- [ ] **Shortest Path** — Linear steps listed with name + purpose, no branches
- [ ] **Scenario Name** — Persona name in title, ID assigned (01, 02...)
- [ ] **Trigger Map Connections** — Persona named, driving forces listed, business goal referenced

**Minimum:** 6/7 present (Trigger Map Connections can be implicit if obvious from other sections)

---

## Dimension 2: Quality Criteria (7 checks)

### 2.1 Persona Alignment
- Scenario serves a specific persona from Trigger Map (not generic "user")
- Mental state matches persona's psychological profile
- Entry point reflects persona's behavior patterns

### 2.2 Mental State Richness
- All three components (Trigger/Hope/Worry) are specific and visceral
- You can FEEL the user's emotional state
- Mental state informs design decisions

**Bad:** "User is interested in the product"
**Good:** "Panicked — motorhome broke down, family vacation at risk, unfamiliar area"

### 2.3 Mutual Success Clarity
- Both successes are specific and measurable
- Business success is not just "revenue" or "engagement"
- User success is tangible (not "satisfied" or "happy")

**Bad:** Business: "Get more customers" / User: "Successfully use the site"
**Good:** Business: "High-intent tourist call captured, info call avoided" / User: "Confirmed capability, got location, feels confident calling"

### 2.4 Sunshine Path Focus
- Path is completely linear (no "if" statements)
- Error states and edge cases deferred
- This is the absolute happiest path

### 2.5 Minimum Viable Steps
- Each step moves meaningfully toward success
- No unnecessary pages or detours
- Can you remove any step without breaking the flow?

### 2.6 Entry Point Realism
- Describes HOW user actually discovered this
- Includes device context
- Reflects real-world behavior

**Bad:** "User opens app"
**Good:** "Tourist googles 'car repair Öland' on mobile at gas station, clicks top result"

### 2.7 Business Goal Connection
- Traces to specific business goal from Trigger Map
- Business value is explicit, not assumed
- User success drives business success (not competes)

**Minimum:** 5/7 fully met

---

## Dimension 3: Common Mistakes (7 checks)

All 7 must be avoided — any single mistake requires correction.

### 3.1 Edge Cases in Sunshine Path
**Check:** Are there any "if" statements, error states, or branches?
**Fix:** Remove all conditional logic. Document edge cases separately.

### 3.2 Feature-First Naming
**Check:** Does the scenario name describe a feature or a user goal?
**Fix:** Rename to persona + purpose format.
- Bad: "Homepage and Services"
- Good: "Hasse's Emergency Search"

### 3.3 Missing Mental State
**Check:** Is mental state present with all three components?
**Fix:** Add Trigger/Hope/Worry with specific, visceral descriptions.

### 3.4 Vague Page Descriptions
**Check:** Do pages have just names, or names + purpose?
**Fix:** Add what user accomplishes at each step.
- Bad: "1. Homepage 2. Services 3. Contact"
- Good: "1. Homepage — confirms mechanic fixes motorhomes 2. Contact — gets phone + directions"

### 3.5 Generic Persona
**Check:** Does scenario use a Trigger Map persona with name?
**Fix:** Replace "user" with specific persona name and driving forces.

### 3.6 Missing Business Value
**Check:** Is business success explicitly defined and measurable?
**Fix:** Add specific business outcome connected to Trigger Map goal.

### 3.7 Bloated Descriptions
**Check:** Does any single component (Entry Point, Mental State, Success Goals) exceed 2 sentences?
**Fix:** Trim to bullet-point essentials. Entry points: device + context + discovery. Mental state: one phrase per component. Success: one measurable statement each.

**Minimum:** 7/7 avoided (zero tolerance for mistakes)

---

## Dimension 4: Best Practices (4 checks)

### 4.1 Persona in Scenario Name
Scenario title includes persona name (e.g., "Hasse's Emergency Search")

### 4.2 Highest-Value Persona First
Scenario 01 serves the Primary persona. Design scenarios for Primary first, then Secondary.

### 4.3 One Job Per Scenario
Each scenario accomplishes ONE clear job-to-be-done. No scope creep.

### 4.4 Driving Forces Explicitly Linked
Scenario states which specific wants/fears from Trigger Map it addresses, with checkmark format:
- ✅ Want: [specific force]
- ❌ Fear: [specific force]

**Minimum:** 2/4 followed

---

## Scoring Summary Template

```
## Quality Review: [Scenario ID]

**Completeness:** [X]/7
**Quality:** [X]/7
**Mistakes Avoided:** [X]/7
**Best Practices:** [X]/4

**Status:** [Excellent / Good / Needs Work]
**Gaps:** [list or "None"]
```

---

## Thresholds

| Level | Complete | Quality | Mistakes | Practices |
|-------|----------|---------|----------|-----------|
| Minimum | 6/7 | 5/7 | 7/7 | 2/4 |
| Excellent | 7/7 | 7/7 | 7/7 | 4/4 |

**If not meeting Minimum after corrections:** Note gaps and consult user for guidance.

---

_Quality checklist for Step 07: Quality Review_
