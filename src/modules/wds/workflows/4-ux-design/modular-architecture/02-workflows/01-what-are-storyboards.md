# What Are Storyboards?

**Visual documentation of component functionality**

---

## Definition

A **storyboard** is a visual sequence showing:

- State transitions (empty → loading → active → completed)
- User interactions (click, type, swipe)
- System responses (updates, animations, feedback)
- Time-based changes (countdowns, timers)

---

## Format

**Hand-drawn sketches** (recommended):

- Quick to create
- Easy to iterate
- Focus on functionality, not polish

**Example:** TaskFlow `task-status-states.jpg`

- 6 frames showing walk states
- Numbered sequentially
- Annotated with triggers

---

## Purpose

Storyboards answer:

- "What does this look like in each state?"
- "How do users move between states?"
- "What triggers each transition?"
- "What happens over time?"

---

## Why Visual?

**Text description:**

```
When the user books a walk, the card changes to gray,
the leaderboard updates, and the week overview changes.
```

**Storyboard:**

```
Frame 1: WHITE card with "Book" button
Frame 2: User taps "Book"
Frame 3: GRAY card, leaderboard +1, week circle gray
```

Visual is **faster to understand** and **harder to misinterpret**.

---

## Next Steps

- [When to Use Storyboards](01-when-to-use.md)
- [Storyboard Types](01-storyboard-types.md)
- [Creation Guide](creation-guide.md)
