# Storyboard File Structure

**Where to store storyboards in the three-tier architecture**

---

## Storage Location

```
project-root/
├─ Pages/
│  └─ 02-calendar-page.md
│
├─ Components/
│  └─ walk-slot-card.component.md
│
├─ Features/
│  ├─ walk-booking-logic.feature.md
│  └─ Storyboards/                    ← Store here
│     ├─ walk-state-transitions.jpg
│     ├─ booking-flow.jpg
│     └─ calendar-sync-flow.jpg
│
└─ Sketches/                          ← Page sketches
   └─ 02-calendar-page-sketch.jpg
```

---

## Why Features/Storyboards/?

Storyboards document **functionality**, not visual design:

- State transitions (functional)
- User interactions (functional)
- Business logic flows (functional)

Therefore, they belong with **Features**, not Components.

---

## Reference Pattern

**From Feature File:**

```markdown
Features/walk-booking-logic.feature.md

## Visual Storyboard

![Walk State Transitions](Storyboards/walk-state-transitions.jpg)
```

**From Component File:**

```markdown
Components/walk-slot-card.component.md

## Visual States

See storyboard for state transitions:
→ Features/Storyboards/walk-state-transitions.jpg
```

---

## Separation from Page Sketches

**Page Sketches** (Sketches/ folder):

- Show page layout
- Static view of entire page
- Used during initial design

**Storyboards** (Features/Storyboards/ folder):

- Show component behavior
- Sequential frames showing changes
- Used during specification

---

## Next Steps

- [Naming Conventions](02-naming-conventions.md)
- [Feature File Integration](feature-file-integration.md)
