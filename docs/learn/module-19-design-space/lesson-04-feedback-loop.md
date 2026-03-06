# Lesson 4: The Feedback Loop

**Module 19: Design Space | Time: 10 min**

---

## How Agents Learn Taste

When you work with a designer and they suggest improvements, that's not just a correction — it's a preference signal. The feedback loop captures these signals as linked pairs, and over time, the agent develops design taste.

**Philosophy:** The feedback loop captures solutions, not complaints. The "before" state is context. The "after" state — the improvement — is the real knowledge.

---

## The Flow

```
Agent creates a design
    ↓
Designer suggests an improvement
    ↓
Agent captures BEFORE (the starting state)
    ↓
Agent asks: "What would make this better?"
    ↓
Designer explains (or agent infers)
    ↓
Agent applies the improvement
    ↓
Agent captures AFTER (the improved version)
    ↓
Both saved as a linked pair
    ↓
Agent confirms: "Learned: [X] works better because [Y]"
```

---

## The WHY Question

This is the most valuable moment. The designer's reasoning is what makes the learning transferable.

Ask naturally — don't interrogate:

- **Forward-looking:** "What would make this feel right?"
- **Specific:** "Should it be more open / minimal / bold?"
- **Outcome-oriented:** "What feeling should this create?"
- **Inference:** "Got it — lighter weight works better here because [reason]. Right?"

Sometimes the designer can't articulate why. That's fine. Capture the observable change: "Improved from bold to light weight — designer's intuitive direction. The result creates a calmer, more elegant feel."

---

## Framing Matters

How you frame the learning determines whether the Design Space becomes a library of solutions or a list of complaints.

### Good Framing (solutions)
- "Light heading weight (300) creates elegance — works better than bold for confident calm brands"
- "80px section padding gives content room to breathe — outperforms 48px on service pages"
- "Left-aligned text follows natural reading flow better than centered for body copy"

### Bad Framing (complaints)
- "Designer hates bold headings"
- "48px padding was wrong"
- "Centered text is bad"

The good framing is actionable. The bad framing is a dead end.

---

## Capture Format

```javascript
capture_feedback_pair({
  before_description: "Hero section with H1 at 48px bold (700) Rubik,
    navy background, full-width. Bold heading feels authoritative
    but heavy.",
  after_description: "Hero section with H1 at 48px light (300) Rubik,
    navy background, max-width 800px. Light weight creates elegance
    and breathing room. Same authority, less weight.",
  reasoning: "Bold headings feel corporate and generic. Light weight
    at large sizes is distinctive — the brand is confident calm,
    not loud authority.",
  pattern_type_before: "rejected",
  pattern_type_after: "approved",
  project: "whiteport",
  topics: ["typography", "heading-weight", "brand-voice", "elegance"],
  components: ["hero-banner", "heading-h1"]
})
```

Both descriptions should be specific enough that someone could recreate the design from the text alone.

---

## The Learning Curve

| Stage | Pairs | Agent Behavior |
|-------|-------|---------------|
| **Cold start** | 0-10 | Individual solutions. "Light headings work better for this brand." |
| **Accumulation** | 10-50 | Principles emerge. "Understated elegance across typography, spacing, color." |
| **Taste profile** | 50+ | Agent anticipates improvements. "The lighter option with more whitespace will work." |
| **Design DNA** | 100+ | New agents inherit design sensibility from day one. |

The cold start is unavoidable. But every feedback pair accelerates the learning. By project 3-4, agents start making noticeably better first proposals.

---

## Key Takeaway

The feedback loop isn't an interruption to design work — it is the design work. Every improvement you suggest teaches the system what good design looks like. Over time, the system learns to produce it.

---

**[← Lesson 3](lesson-03-capture-patterns.md)** | **[Next: Lesson 5 →](lesson-05-proactive-improvement.md)**
