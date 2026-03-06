# Lesson 5: Proactive Improvement

**Module 19: Design Space | Time: 8 min**

---

## From Reactive to Proactive

In the early stages, the feedback loop is reactive — the designer suggests improvements, the agent captures them. But as feedback pairs accumulate, something changes: the agent starts recognizing patterns before they're pointed out.

This is the shift from "let me capture what you taught me" to "I already applied what you taught me."

---

## How It Works

Before presenting any new design, the agent runs a pre-check:

```javascript
search_preference_patterns({
  description: "Full-width hero with bold H1 heading,
    centered layout, dark background",
  image_base64: "[screenshot if available]",
  project: "whiteport"
})
```

This searches against the "before" states of all feedback pairs. If the proposed design resembles something that was later improved, the agent knows what the improvement was.

### Two Search Channels

**Semantic match:** The description of your design is similar to a known starting point.
- "Bold heading" → "We learned that light weight works better for this brand"

**Visual match:** Your design looks like a known starting point.
- The screenshot resembles a layout that was later improved with more whitespace

Either channel can trigger. Both together is a strong signal.

---

## What Happens When a Match Is Found

1. Agent reads the paired approved alternative
2. Agent identifies the specific improvement
3. Agent applies it to the current design
4. Agent presents the improved version
5. Agent mentions it naturally: "I applied light heading weight — it's worked well in similar designs."

The designer still has full control. The agent is applying learned improvements, not making autonomous decisions. The designer can override, which creates a new feedback pair if needed.

---

## Threshold Tuning

| Check | Default | Effect |
|-------|---------|--------|
| Semantic threshold | 0.75 | Higher = fewer matches, more precise |
| Visual threshold | 0.70 | Higher = fewer matches, more precise |

Lower thresholds cast a wider net but increase false positives. For a new project with few pairs, keep defaults. For a mature project with 50+ pairs, you might lower thresholds to catch more subtle patterns.

---

## When to Override

Sometimes a match is contextually wrong:

- **Different brand:** A pattern rejected for a minimalist brand might work for an energetic one
- **Different context:** A rejected mobile pattern might be the right choice for desktop
- **Surface similarity:** The match is visual-only and the design principle doesn't transfer

In these cases, the agent proceeds but notes the override: "This resembles [pattern] but the context differs because [reason]."

---

## The Compounding Effect

Every project benefits from every previous project. Here's how it compounds:

- **Project 1:** Cold start. Agent learns 15 preferences through feedback.
- **Project 2:** Agent starts with 15 known improvements. Learns 12 more.
- **Project 3:** Agent starts with 27 improvements. First proposals are noticeably better. Fewer feedback cycles needed.
- **Project 5:** Agent rarely proposes designs that match known "before" states. Feedback shifts from "change this" to "refine this."
- **Project 10:** The Design Space contains a full design sensibility. New agents produce work that feels like it came from an experienced designer.

This is the long game. Each interaction makes the next one better.

---

## Key Takeaway

Proactive improvement is where the Design Space pays off. Every feedback pair invested during design work returns compound interest on future projects. The system doesn't just remember what you taught it — it applies it before you have to ask.

---

**[← Lesson 4](lesson-04-feedback-loop.md)** | **[Next: Tutorial →](tutorial-19.md)**
