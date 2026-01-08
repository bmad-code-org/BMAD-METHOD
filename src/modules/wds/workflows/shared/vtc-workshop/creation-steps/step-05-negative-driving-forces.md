# Step 5: Identify Negative Driving Forces

**Duration:** 5 minutes

**Purpose:** Discover what the user FEARS or wants to avoid (anxieties, frustrations)

---

## What You'll Do

Identify 2-3 negative driving forces - what pushes the user away from failure/frustration.

---

## Questions to Ask User

> "What does [user name] FEAR or want to avoid? What keeps them up at night?"

**Probing questions:**
- "What are they worried about?"
- "What would be embarrassing or costly?"
- "What would feel like failure?"
- "What friction do they currently experience?"
- "What do they NOT want to happen?"

---

## Guidelines

**Think anxieties and frustrations:**
- Not: "Don't want slow system"
- Yes: "Fear of wasting hours on complex tools"

**What do they fear:**
- Losing?
- Missing?
- Being seen as?
- Experiencing?

**Aim for 2-3 strong fears:**
- Often opposite side of positive forces
- Specific and emotionally real
- Inform risk reduction in design

---

## Examples

**Hairdresser (Harriet):**
- "Fear of missing industry trends"
- "Fear of losing clients to trendier salons"
- "Avoid appearing outdated to clients"

**Developer (reviewing code):**
- "Fear of missing critical bugs"
- "Fear of slowing down teammates"
- "Avoid looking careless or rushed"

**Small business owner:**
- "Fear of making wrong financial decisions"
- "Fear of tax compliance issues"
- "Avoid feeling stupid about numbers"

---

## Connection to Positive Forces

**Notice patterns:**
- Positive: "Wish to be authority" ↔ Negative: "Fear of appearing outdated"
- Positive: "Wish to catch bugs" ↔ Negative: "Fear of missing bugs"

**Both sides of same coin** - this is good! Shows coherent psychology.

---

## Capture Format

```yaml
driving_forces:
  positive:
    - "[from previous step]"
  negative:
    - "Fear of [anxiety]"
    - "Fear of [frustration]"
    - "Avoid [problem]"
```

**Example:**
```yaml
driving_forces:
  positive:
    - "Wish to be local beauty authority"
    - "Wish to attract premium clients"
  negative:
    - "Fear of missing industry trends"
    - "Fear of losing clients to trendier salons"
```

---

## Validation Checklist

Before proceeding, confirm:

- [ ] Forces feel true for this user?
- [ ] Specific enough to inform design?
- [ ] Connect to positive forces (opposite sides)?
- [ ] 2-3 forces captured (total 4-6 positive + negative)?
- [ ] User agrees these are real anxieties?

---

## Common Issues

**Issue:** Forces too mild ("don't like complexity")

**Solution:**
> "What's the REAL fear behind that? What happens if they encounter complexity? What cost do they pay?"

**Issue:** Only negative stated as positive inverse ("want to not fail")

**Solution:**
> "What ARE they afraid of specifically? What would failure look like?"

**Issue:** Too many fears (overwhelming)

**Solution:**
> "Which 2-3 fears are strongest? Which would prevent them from using this solution?"

---

## Design Hint

These negative forces should inform:
- Risk reduction features
- Reassurance messaging
- Error prevention
- Trust signals
- Recovery paths

---

## Review Combined Forces

**At this point, review ALL driving forces together:**

```yaml
driving_forces:
  positive:
    - "[wish 1]"
    - "[wish 2]"
    - "[wish 3]"
  negative:
    - "[fear 1]"
    - "[fear 2]"
```

**Ask:** "Do these forces tell a coherent story about what drives [user name]?"

If yes → Proceed  
If no → Refine before moving forward

---

## Next Step

Once negative driving forces are captured and all forces validated:

**→ Proceed to [Step 6: Position Customer Awareness](./step-06-customer-awareness.md)**

---

## Output at This Point

You now have:
- ✅ Business goal
- ✅ Solution
- ✅ User description
- ✅ Positive driving forces
- ✅ Negative driving forces

Still need:
- ⏸️ Customer Awareness

**This is the core strategic content! Almost done.**

---

*Step 5 complete - Fears and frustrations captured*

