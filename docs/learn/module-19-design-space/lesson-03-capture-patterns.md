# Lesson 3: Capture Patterns

**Module 19: Design Space | Time: 10 min**

---

## The Quality Formula

**Good capture = Specific + Contextual + Actionable + Tagged**

The difference between useful knowledge and noise comes down to these four qualities.

---

## Specific

Include concrete details. Values, names, measurements — not vague adjectives.

| Bad | Good |
|-----|------|
| "The spacing is nice" | "80px section padding creates breathing room on desktop — more effective than the 48px we started with" |
| "Good colors" | "Coral (#e8734a) on navy (#0a1628) achieves 7.2:1 contrast while maintaining brand warmth" |
| "Big heading" | "H1 at 48px Rubik Light (300) — the light weight at large size creates elegance" |

---

## Contextual

Say where it was tested, which project, what constraints existed.

| Bad | Good |
|-----|------|
| "Bottom sheets are good" | "Bottom sheet navigation works better than hamburger for mobile service sites with 4-6 primary actions. Tested on Kalla." |
| "Cards work well" | "3-column card grid with 24px gaps on desktop, stacking to 1-column on mobile. Used for service listing on Whiteport — each card has icon, heading, description, link." |

---

## Actionable

Another agent reading this should be able to apply it without asking for more information.

| Bad | Good |
|-----|------|
| "We changed the navigation" | "Replaced hamburger menu with visible bottom sheet navigation for mobile. Show 4-6 primary action buttons. Users found services faster — task completion improved." |
| "The hero was improved" | "Reduced H1 from bold (700) to light (300) at 48px. Added max-width 800px. Result: same authority, less visual weight. Works for brands that want confident calm, not loud authority." |

---

## Tagged

Topics and components make the entry findable via search. Without tags, knowledge dies.

```
topics: ["mobile", "navigation", "service-design"]
components: ["bottom-sheet", "hamburger-menu"]
```

### Tag Vocabulary

**Design dimensions:** `typography`, `color`, `spacing`, `layout`, `hierarchy`, `animation`, `responsive`

**Brand qualities:** `elegance`, `warmth`, `minimalism`, `boldness`, `playfulness`

**Page areas:** `hero`, `navigation`, `footer`, `above-fold`, `content-area`

**Component types:** `button`, `card`, `modal`, `form`, `accordion`, `carousel`

---

## Category Selection

Choose the category that best fits:

| Category | When to Use | Example |
|----------|-------------|---------|
| `successful_pattern` | Validated solution worth reusing | "Bottom sheet nav for mobile service sites" |
| `component_experience` | How a component behaves in real use | "Radix Dialog z-index conflict with sticky header" |
| `design_system_evolution` | Token or component API decision | "Changed --space-lg from 24px to 32px" |
| `methodology` | Process improvement | "25s delay between captures improves description quality" |
| `inspiration` | External reference worth remembering | "Stripe's pricing page card layout" |

---

## Auto-Capture vs Deliberate Capture

### Auto-Capture (during work)
Agents capture insights in the background as conversations flow. No interruption, no ceremony. Capture as you go.

**When:** After completing a UX flow, after a failed experiment, after a design system update, after client feedback.

### Deliberate Capture (Knowledge Capture workflow)
Structured capture session for consolidating learnings after a project milestone.

**When:** End of a design sprint, after a project launch, after a usability test round.

Both are important. Auto-capture prevents knowledge loss. Deliberate capture ensures quality.

---

## What NOT to Capture

- Debugging steps (capture the solution, not the struggle)
- Temporary decisions that will change next session
- Information already in project specs
- Vague observations without conclusions
- Complaints without solutions

---

## Key Takeaway

The Design Space is only as valuable as the quality of its entries. One specific, contextual, actionable insight is worth more than ten vague observations. Write for the agent who reads this six months from now on a different project.

---

**[← Lesson 2](lesson-02-dual-embeddings.md)** | **[Next: Lesson 4 →](lesson-04-feedback-loop.md)**
