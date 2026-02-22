# Working with Existing Materials

**Purpose:** Guide for naturally incorporating existing materials into conversational PB workflow.

---

## Core Principles

1. **Reference, don't re-ask** - Build on documented work
2. **Validate currency** - "Is this still accurate?"
3. **Focus on gaps** - What's missing or needs refinement?
4. **Document refinement** - Capture UPDATE conversation, not just creation
5. **Stay casual** - No judgment about what exists or doesn't

---

## Checking for Materials

**Phase 0 asks:** "Do you have existing materials?" (website, brief, guidelines, research)

**Stored in outline:**
```yaml
existing_materials:
  has_materials: true/false
  website: "[URL]"
  previous_brief: "[path]"
  brand_guidelines: "[path]"
  research: "[path]"
  context_notes: "[brief notes]"
```

**If materials exist:** Read them before starting PB steps

---

## Adaptation Pattern

### Opening Adaptation

**Without materials:**
> "Let's start with vision. What are you envisioning?"

**With materials:**
> "I see you mentioned [reference from materials]. Let's build on that - tell me more."

### Follow-Up Patterns

- **Validate:** "You wrote X - is that still accurate?"
- **Fill gaps:** "Your brief mentions Y, but I'm curious about Z..."
- **Refine:** "When you said X, did you mean [interpretation]?"
- **Update:** "Has your thinking evolved since you wrote this?"

---

## Step-by-Step Application

**Apply to all conversational steps** (2, 3, 5, 7, 7a, 8, 9, 10, 11, 12):

| Step | No Materials | With Materials |
|------|-------------|----------------|
| Vision (2) | "What are you envisioning?" | "You mentioned [vision]. Tell me more." |
| Positioning (3) | "Let's explore positioning." | "Your brief positions this as [quote]. Still accurate?" |
| Users (7) | "Who are ideal users?" | "You described [archetypes]. Still primary users?" |
| Concept (7a) | "What's the core concept?" | "I see [concept from materials]. Tell me more about that principle." |
| Success (8) | "What does success look like?" | "You mentioned success means [quote]. Still the goal?" |

**Pattern:** Reference existing → Validate → Build on it

---

## Dialog Documentation

When materials exist, capture:

1. **What existed:** Quote/summarize existing material
2. **Validation:** User's response to "Is this still accurate?"
3. **Refinement:** What changed, added, or clarified
4. **Why:** Rationale for changes
5. **Synthesis:** Updated version (old + new integrated)

**Template:**

```markdown
**Existing context:** [What was documented]

**Opening:** "I see [reference]. [Question]"

**User response:** [Confirmed/refined/changed]

**Key exchanges:**
- [Exploration]
- [Gaps filled]
- [Evolution]

**Reflection checkpoint:**
"Building on your earlier work: [synthesis].
Keeps [solid parts], adds [new], refines [changed].
Does that capture it?"

**User confirmation:** [Confirmed / Corrected]

**Final:** [Updated artifact]
```

---

## Common Scenarios

**Scenario: Previous brief exists**
1. Read it thoroughly
2. Identify solid vs gaps/unclear
3. Open: "I read your brief. [Strong points] captured well. Questions about [gaps]."
4. Explore gaps conversationally
5. Dialog: what was there + what we added + why

**Scenario: Existing website**
1. Review site (if URL in materials)
2. Note current positioning/tone/UX
3. Reference: "I looked at your site. It positions you as [observation]. Still the direction?"
4. Use as baseline for "what's changing?"

**Scenario: Brand guidelines exist**
1. Read guidelines (voice, values, identity)
2. Reference when discussing tone: "Your guidelines describe tone as [quote]. Match exactly or evolve?"
3. Don't re-ask defined things (colors, values)
4. Focus on how brand translates to this project

**Scenario: Research exists**
1. Review findings
2. Reference insights: "Your research showed [finding]. Great insight for..."
3. Validate currency: "Is this still what you hear from customers?"

---

## What NOT to Do

❌ Ignore existing materials (if outline says they exist)
❌ Make users repeat documented work
❌ Assume everything is still current (validate!)
❌ Judge quality of existing work
❌ Create separate "refinement workflow" (same conversational pattern, just adapt openings)

---

## Benefits

✅ Efficiency - Don't re-explore documented areas
✅ Continuity - Build on previous work
✅ Respect - Acknowledge existing thinking
✅ Focus - Spend time on gaps/unclear areas
✅ Natural flow - Same pattern, context-aware
✅ Rich dialog - Captures refinement, not just creation

---

## Quick Reference

**Check:** `existing_materials.has_materials` in outline

**If true:**
1. Read materials before starting PB
2. Adapt openings to reference what exists
3. Validate currency with each step
4. Fill gaps conversationally
5. Document: old + new + why

**Dialog pattern:** Existing → Validate → Refine → Synthesize → Confirm

---

**Remember:** Not a separate workflow - same conversational pattern, just context-aware.
If materials exist, read and adapt. If not, explore from scratch. Either way, natural conversation.
