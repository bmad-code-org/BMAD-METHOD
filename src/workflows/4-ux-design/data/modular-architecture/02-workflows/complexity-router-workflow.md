# Complexity Router Workflow

**Step-by-step guided decomposition**

---

## Overview

When a complex component is detected, the agent guides you through 3 steps:

1. **WHERE** - Page context
2. **HOW** - Visual design
3. **WHAT** - Functional logic

---

## Step 1: Page Context (WHERE)

**Agent asks:**

1. Which page(s) does this appear on?
2. Where on the page?
3. How big is it?
4. Same component on multiple pages, or page-specific?
5. **Does CONTENT change based on page context?**
6. **Does DATA source change based on page context?**

**You answer, agent captures:**

- Pages list
- Position
- Size
- Reusability
- Content varies: YES/NO
- Data source varies: YES/NO

**Result:** Page file specification

---

## Step 2: Visual Design (HOW)

**Agent asks:**

1. How many visual states?
2. Do you have a storyboard showing states?
3. For each state:
   - What does it look like?
   - What triggers this state?
   - Can it transition to other states?

**You answer, agent captures:**

- State count
- State definitions
- Storyboard reference (if exists)
- Visual specifications

**Result:** Component file specification

---

## Step 3: Functional Logic (WHAT)

**Agent asks:**

1. What can users DO with this?
2. What happens when they interact?
3. Are there business rules?
4. Does it need data from an API?
5. Does it update other components?

**You answer, agent captures:**

- User actions
- System responses
- Business rules
- API endpoints
- Component sync

**Result:** Feature file specification

---

## Example Dialogue

See: [Coaching Dialogue Example](examples/coaching-dialogue.md)

---

## Output: Three Files

**1. Page File**

```markdown
Pages/02-calendar-page.md

**Component:** walk-slot-card.component.md
**Feature:** walk-booking-logic.feature.md

**Position:** Main content, full-width
**Page-Specific Content:**

- Header: "Familjen Svensson: Vecka 40"
- Data: GET /api/families/:currentFamilyId/walks
```

**2. Component File**

```markdown
Components/walk-slot-card.component.md

**Visual Specifications:**

- 6 states (WHITE, GRAY, ORANGE, BLUE, GREEN, RED)
- Typography, colors, spacing
- Storyboard: Features/Storyboards/walk-states.jpg
```

**3. Feature File**

```markdown
Features/walk-booking-logic.feature.md

**User Interactions:**

- Book walk → GRAY state
- Start walk → BLUE state

**Business Rules:**

- One active walk per dog
- Can't book if slot taken

**API Endpoints:**

- POST /api/walks
- PUT /api/walks/:id/start
```

---

## Benefits

- ✅ Clean handoffs (designer, developer, AI)
- ✅ Nothing gets missed (all features documented)
- ✅ Easy to maintain (update specs, not code)
- ✅ Design system integrity (consistent patterns)

---

## Next Steps

- [Examples](examples/) - See real decompositions
- [Storyboards](02-storyboards/00-STORYBOARDS-GUIDE.md) - Visual documentation
