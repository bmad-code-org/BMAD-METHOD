<!--
  NAVIGATION BEST PRACTICE: Navigation links appear in THREE places:
  1. Above the sketch (top)
  2. Below the sketch (still in header area)
  3. At document bottom
  This is intentional for long specifications - users should not need to
  scroll the entire document to navigate between pages.
-->

### {page-number}-{page-name}

**Previous Step:** ← [{previous-page-name}]({previous-page-path})
**Next Step:** → [{next-page-name}]({next-page-path})

![{Page Name}](Sketches/{page-number}-{page-name}.jpg)

**Previous Step:** ← [{previous-page-name}]({previous-page-path})
**Next Step:** → [{next-page-name}]({next-page-path})

---

# {page-number}-{page-name}

## Page Metadata

| Property | Value |
|----------|-------|
| **Scenario** | {scenario-name} |
| **Page Number** | {page-number} |
| **Platform** | {Mobile web / Desktop / PWA / Native} |
| **Page Type** | {Full Page / Modal / Drawer / Popup} |
| **Viewport** | {Mobile-first / Desktop-first} |
| **Interaction** | {Touch-first / Mouse+keyboard} |
| **Visibility** | {Public / Authenticated / Admin} |

---

## Overview

**Page Purpose:** {What job must this page accomplish?}

**User Situation:** {What brings the user here?}

**Success Criteria:** {How will we know this page succeeded?}

**Entry Points:**
- {How users arrive}

**Exit Points:**
- {Where users go next}

---

## Reference Materials

**Strategic Foundation:**
- [Product Brief]({path}) - {brief description}
- [Trigger Map]({path}) - {brief description}

**Related Pages:**
- [{Related Page}]({path})

**Design System:**
- [{Component}]({path})

---

## Layout Structure

{High-level description of page layout}

```
[ASCII layout diagram]
+------------------+
| Header           |
+------------------+
| Main Content     |
+------------------+
| Footer           |
+------------------+
```

---

## Page Sections

### Section: {Section Name}

**OBJECT ID:** `{page-name}-{section-name}`

| Property | Value |
|----------|-------|
| Purpose | {What this section does} |
| Component | [{Design System Component}]({path}) |

---

#### {Object Name}

**OBJECT ID:** `{page-name}-{object-name}`

| Property | Value |
|----------|-------|
| Component | [{Component}]({path}) |
| Translation Key | `{translation.key}` |
| SE | "{Swedish text}" |
| EN | "{English text}" |
| Behavior | {onClick / onChange / etc.} |

---

#### {Group Name} (Container)

**OBJECT ID:** `{page-name}-{group-name}`

| Property | Value |
|----------|-------|
| Component | [{Container Component}]({path}) |
| Purpose | {Groups related objects} |
| Layout | {Horizontal / Vertical / Grid} |

##### {Object in Group}

**OBJECT ID:** `{page-name}-{group-name}-{object}`

| Property | Value |
|----------|-------|
| Component | [{Component}]({path}) |
| Translation Key | `{translation.key}` |
| SE | "{Swedish text}" |
| EN | "{English text}" |

##### {Object in Group 2}

**OBJECT ID:** `{page-name}-{group-name}-{object-2}`

| Property | Value |
|----------|-------|
| Component | [{Component}]({path}) |
| Translation Key | `{translation.key}` |
| SE | "{Swedish text}" |
| EN | "{English text}" |

---

## Page States

| State | When | Appearance | Actions |
|-------|------|------------|---------|
| Default | {condition} | {description} | {available actions} |
| Loading | {condition} | {description} | {available actions} |
| Empty | {condition} | {description} | {available actions} |
| Error | {condition} | {description} | {recovery actions} |
| Success | {condition} | {description} | {next steps} |

---

## Conditional Sections

Include these micro-instructions when applicable:

| Condition | Include |
|-----------|---------|
| Public page (SEO needed) | → [meta-content.instructions.md](instructions/meta-content.instructions.md) |
| Public page (SEO needed) | → [seo-content.instructions.md](instructions/seo-content.instructions.md) |
| Has forms/inputs | → [form-validation.instructions.md](instructions/form-validation.instructions.md) |
| Needs API data | → [data-api.instructions.md](instructions/data-api.instructions.md) |
| Multiple breakpoints | → [responsive.instructions.md](instructions/responsive.instructions.md) |
| Final review | → [accessibility.instructions.md](instructions/accessibility.instructions.md) |
| Multiple sketches | → [storyboard-specification.template.md](storyboard-specification.template.md) |
| **Always (spec creation/audit)** | → [open-questions.instructions.md](instructions/open-questions.instructions.md) |

---

## Technical Notes

{Any constraints, performance requirements, or implementation notes}

---

## Open Questions

<!--
  This section captures decisions needed before development.
  During spec creation or audits, auto-populate questions based on:
  → instructions/open-questions.instructions.md

  Categories to check:
  - Responsive breakpoints (if multiple viewports)
  - Loading/Error/Empty states (if API data)
  - SEO meta content (if public page)
  - Accessibility requirements
  - User permissions/roles
  - Time-sensitive behaviors
  - Form validation rules
  - Navigation/back behavior
-->

_No open questions at this time._

<!-- When questions exist, use this format:
| # | Question | Context | Status |
|---|----------|---------|--------|
| 1 | {What needs to be decided?} | {Why it matters} | 🔴 Open |
| 2 | {Question} | {Context} | 🟢 Resolved: {answer} |

**Status Legend:** 🔴 Open | 🟡 In Discussion | 🟢 Resolved
-->

---

## Checklist

- [ ] Page purpose clear
- [ ] All Object IDs assigned
- [ ] Components reference design system
- [ ] Translations complete (SE/EN)
- [ ] States documented
- [ ] Conditional sections included where needed

---

**Previous Step:** ← [{previous-page-name}]({previous-page-path})
**Next Step:** → [{next-page-name}]({next-page-path})

---

_Created using Whiteport Design Studio (WDS) methodology_
