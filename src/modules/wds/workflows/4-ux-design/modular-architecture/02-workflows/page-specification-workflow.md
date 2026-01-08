# Page Specification Workflow

**Step-by-step iterative decomposition from sketch to specs**

---

## Overview

The agent guides you through specifying a page **from top to bottom**, one section at a time. You control the level of detail at each step.

---

## The Workflow

### Step 1: Identify All Sections

**Agent analyzes sketch and outputs:**

```
📋 Page Sections Detected:

1. Navigation Header
2. Hero Section
3. Calendar Component
4. Leaderboard Component
5. Footer

Does this match your sketch? Any sections missing or incorrectly identified?
```

**You respond:**

- Confirm sections
- Add missing sections
- Rename sections
- Reorder sections

---

### Step 2: Section Purpose

**For each section, agent asks:**

```
📍 Section: Navigation Header

What is the purpose of this section?
- User navigation?
- Branding?
- User account access?
- Search functionality?
```

**You respond:**

```
"User navigation and branding. Shows logo, main menu, and user profile."
```

**Agent captures:**

```markdown
## Navigation Header

**Purpose:** User navigation and branding
**Contains:** Logo, main menu, user profile
```

---

### Step 3: List Objects in Section

**Agent outputs:**

```
🔍 Objects in Navigation Header:

1. Logo (image)
2. Main Menu (navigation)
3. User Profile (dropdown)

Shall I specify each object, or is this section simple enough to keep schematic?
```

**You choose:**

- **Option A:** "Specify each object" → Go deeper
- **Option B:** "Keep schematic" → Move to next section

---

### Step 4: Decompose Containers

**If object is a container, agent asks:**

```
📦 Main Menu (Container)

What components does this contain?
1. Home link
2. Calendar link
3. Leaderboard link
4. Settings link

Are these simple links, or do any need detailed specs?
```

**You respond:**

```
"Simple links, no detail needed"
```

**Agent captures:**

```markdown
### Main Menu

- Home link
- Calendar link
- Leaderboard link
- Settings link
```

---

### Step 5: Specify Atomic Components

**When reaching smallest parts:**

```
🔬 User Profile (Dropdown)

This looks complex (multiple states, interactions).

Should I:
A) Create detailed Component + Feature files (3-tier)
B) Keep simple specification in Page file
C) Skip for now, mark as TODO
```

**You choose based on complexity:**

- **Simple:** Keep in Page file
- **Complex:** Decompose to 3 files
- **Later:** Mark TODO

---

## Example: TaskFlow Calendar Page

### Full Workflow

**Step 1: Sections**

```
Agent: "I see 5 sections: Header, Week Overview, Leaderboard, Calendar, Footer"
You: "Correct!"
```

**Step 2: Section Purposes**

```
Agent: "What's the purpose of Week Overview?"
You: "Shows current week number and 7-day status circles"
```

**Step 3: Week Overview Objects**

```
Agent: "Objects detected:
1. Week number label (text)
2. 7 day circles (repeated component)

Specify each or keep schematic?"
You: "Specify the day circles, they have states"
```

**Step 4: Day Circle Component**

```
Agent: "Day circles look complex (3 states: empty, booked, completed).
Should I create Component + Feature files?"
You: "Yes, decompose it"
```

**Step 5: Calendar Section**

```
Agent: "Calendar has 6 walk states, countdown timers, business rules.
This is highly complex. Should I:
- Create 3-tier decomposition
- Reference your storyboard (App-Main-Booking-States.jpg)"
You: "Yes, decompose and reference storyboard"
```

---

## Designer Control Points

At each step, you decide:

### Detail Level

- **Schematic:** Just list components, no details
- **Moderate:** Basic specs (size, position, content)
- **Detailed:** Full 3-tier decomposition

### When to Stop

- **Good enough:** "This is clear, move on"
- **Need detail:** "Let's specify this fully"
- **Later:** "Mark as TODO, we'll come back"

### Feedback Loop

```
Agent: "Here's what I captured for Navigation Header..."
You: "Actually, the logo should be clickable and link to home"
Agent: "Updated! Logo is now a link component."
```

---

## Output Structure

### Schematic Page Spec

```markdown
Pages/02-calendar-page.md

## Navigation Header

**Purpose:** User navigation and branding

- Logo (clickable, links to home)
- Main menu (4 links)
- User profile dropdown

## Calendar Section

**Purpose:** Book and manage dog walks
**Component:** → walk-slot-card.component.md
**Feature:** → walk-booking-logic.feature.md
**Storyboard:** → Features/Storyboards/walk-states.jpg
```

### Detailed Page Spec

```markdown
Pages/02-calendar-page.md

## Navigation Header

**Purpose:** User navigation and branding
**Position:** Top, full-width, fixed
**Height:** 64px

### Logo

**Component:** → logo.component.md
**Position:** Left, 16px padding
**Size:** 40x40px
**Action:** Click → Navigate to home

### Main Menu

**Component:** → nav-menu.component.md
**Position:** Center
**Items:** Home, Calendar, Leaderboard, Settings

### User Profile

**Component:** → user-dropdown.component.md
**Feature:** → user-menu-logic.feature.md
**Position:** Right, 16px padding
```

---

## Benefits

✅ **Iterative:** Specify what you need, when you need it
✅ **Flexible:** Control detail level per section
✅ **Collaborative:** Agent asks, you decide
✅ **Efficient:** Don't over-specify simple sections
✅ **Complete:** Nothing gets missed
✅ **Aligned:** Feedback loop at every step

---

## When to Use

**Use this workflow when:**

- Starting a new page specification
- Converting a sketch to structured specs
- Unsure how detailed to be
- Want guided decomposition

**Skip this workflow when:**

- Page is extremely simple (1-2 sections)
- You already know the structure
- Rapid prototyping (schematic only)

---

## Next Steps

- [Complexity Detection](01-complexity-detection.md) - When to decompose components
- [Complexity Router Workflow](02-complexity-router-workflow.md) - How to decompose complex components
