# Complexity Detection

**How to identify simple vs complex components**

---

## Simple Component Indicators

- ✅ Single state (no variations)
- ✅ No user interaction (static display)
- ✅ No data dependencies
- ✅ No business logic

**Examples:**

- Static text
- Image
- Basic button (just click → navigate)

**Action:** Document in Page file only

---

## Complex Component Indicators

- ⚠️ Multiple states (3+ states)
- ⚠️ Time-based changes (countdowns, timers)
- ⚠️ Multi-step interactions (workflows)
- ⚠️ Business rules (validation, permissions)
- ⚠️ Data synchronization (updates other components)
- ⚠️ State machines (defined transition paths)

**Examples:**

- Calendar widget (6 states)
- Search with autocomplete (5+ states)
- Multi-step form (progress tracking)
- Booking system (state machine)

**Action:** Decompose into 3 files (Page, Component, Feature)

---

## Detection Examples

### Example 1: Simple Button

**Indicators:**

- ✅ Single interaction (click → navigate)
- ✅ 2-3 states (default, hover, active)
- ❌ No business logic
- ❌ No data dependencies

**Result:** SIMPLE - Page file only

---

### Example 2: Search Bar

**Indicators:**

- ⚠️ Multiple states (empty, typing, loading, results, error)
- ⚠️ Real-time updates (debounced API calls)
- ⚠️ Business logic (min 3 characters, max 10 results)
- ⚠️ Data dependencies (search API)
- ⚠️ Keyboard navigation

**Result:** COMPLEX - Decompose into 3 files

---

### Example 3: Calendar Widget

**Indicators:**

- ⚠️ 6 walk states
- ⚠️ Time-based transitions (countdown timers)
- ⚠️ Complex business rules (per-dog blocking)
- ⚠️ Multi-component sync (week view, leaderboard)
- ⚠️ Real-time updates (every 1 minute)
- ⚠️ API dependencies (4+ endpoints)

**Result:** HIGHLY COMPLEX - Decompose + storyboard

---

## When to Decompose

**Decompose when component has:**

- 3+ visual states
- Business rules
- API dependencies
- State machine logic
- Multi-component interactions

**Keep simple when component has:**

- 1-2 states
- No logic
- No data
- Static display

**⚠️ Common Mistake:**

```markdown
❌ Wrong: Everything in one file
Pages/02-calendar-page.md (800 lines)
├─ Layout + Visual design + Business logic + API endpoints

✅ Right: Decompose into 3 files
Pages/02-calendar-page.md (100 lines) → Layout + page content
Components/walk-slot-card.component.md (150 lines) → Visual design
Features/walk-booking-logic.feature.md (200 lines) → Logic
```

---

## Next Steps

- [Complexity Router Workflow](02-complexity-router-workflow.md) - How to decompose
- [Examples](examples/) - See real decompositions
