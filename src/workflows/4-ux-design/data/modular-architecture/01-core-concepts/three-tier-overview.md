# Three-Tier Architecture Overview

**Separation of WHERE, HOW, and WHAT**

---

## The Three File Types

### 1. Pages/ (WHERE)

**Purpose:** Page-specific context and placement

**Contains:**

- Position & size
- Page-specific content (varies by page)
- Page-specific data (user context)
- Component references
- Feature references

**Example:**

```markdown
Pages/02-calendar-page.md

- Position: Main content, full-width
- Content: "Familjen Svensson: Vecka 40" (user's family)
- Data: GET /api/families/:currentFamilyId/walks
- Component: → walk-slot-card.component.md
- Feature: → walk-booking-logic.feature.md
```

---

### 2. Components/ (HOW IT LOOKS)

**Purpose:** Visual design specifications

**Contains:**

- Visual specs (colors, spacing, typography)
- States (default, hover, active, loading, error)
- Variants (sizes, types, themes)
- Figma mapping
- Responsive behavior
- ❌ NO content, NO logic

**Example:**

```markdown
Components/walk-slot-card.component.md

- 6 visual states (WHITE, GRAY, ORANGE, BLUE, GREEN, RED)
- Typography: 16px Medium, 12px Regular
- Colors: Blue (#3B82F6), Orange (#FB923C), etc.
- Storyboard reference: Features/Storyboards/walk-states.jpg
```

---

### 3. Features/ (WHAT IT DOES)

**Purpose:** Functional logic and business rules

**Contains:**

- User interactions
- Business rules
- State management
- Generic content (same everywhere)
- API endpoints
- Validation rules
- ❌ NO visual design

**Example:**

```markdown
Features/walk-booking-logic.feature.md

- Book walk → GRAY state
- Start walk → BLUE state
- Business rule: One active walk per dog
- API: POST /api/walks, PUT /api/walks/:id/start
- Generic content: "Loading...", "Error: Failed to load"
```

---

## Why Three Tiers?

### Before (Monolithic)

```
Pages/02-calendar-page.md (800 lines)
├─ Everything mixed together
├─ Developer confused
├─ Designer confused
└─ Features get missed
```

### After (Modular)

```
Pages/02-calendar-page.md (100 lines)
├─ Just placement + user context

Components/walk-slot-card.component.md (150 lines)
├─ Visual design only
└─ → Send to Figma designer

Features/walk-booking-logic.feature.md (200 lines)
├─ Logic only
└─ → Send to developer
```

---

## Handoff Strategy

**Visual Designer** receives:

- `Components/` folder
- Creates Figma components
- Matches visual specs exactly

**Developer** receives:

- `Features/` folder
- Implements business logic
- Uses API endpoints specified

**You** maintain:

- `Pages/` folder
- Track design system integrity
- Manage page-specific content

---

## Next Steps

- [Content Placement Rules](01-content-placement-rules.md) - Where does content go?
- [Complexity Detection](01-complexity-detection.md) - When to decompose?
- [Workflow](02-complexity-router-workflow.md) - How to decompose?
