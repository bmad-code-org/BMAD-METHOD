# Content Placement Decision Tree

**One-page flowchart for file placement**

---

## The Decision Tree

```
┌─────────────────────────────────────────────────┐
│  Does CONTENT vary by page context?             │
│  (text, images, data source)                    │
└────────────┬────────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
     YES            NO
      │             │
      ▼             ▼
┌─────────────┐  ┌──────────────┐
│ Page File   │  │ Feature File │
│             │  │              │
│ Document:   │  │ Document:    │
│ - Headings  │  │ - Generic    │
│ - Text      │  │   content    │
│ - Images    │  │ - Default    │
│ - Data API  │  │   config     │
│ - Scope     │  │              │
└─────────────┘  └──────────────┘
```

---

## Examples

**Page File (Content Varies):**

- ✅ Hero heading: "Welcome" (Home) vs "About" (About)
- ✅ Search placeholder: "Search products..." vs "Search help..."
- ✅ Calendar header: "Familjen Svensson: Vecka 40" (user's family)
- ✅ Data API: `/api/families/:currentFamilyId/walks` (user-specific)

**Feature File (Content Same Everywhere):**

- ✅ Button text: "Submit" (always the same)
- ✅ Error message: "Invalid email" (generic validation)
- ✅ Tooltip: "Click to expand" (generic interaction)
- ✅ Data API: `/api/products` (same for all users)

---

## Visual Design?

```
Is this VISUAL design (colors, spacing, states)?
│
└─ YES → Component File
         (Colors, typography, layout, states)
```

---

## Quick Rule

- **Page File** = WHERE + WHAT (page-specific)
- **Component File** = HOW IT LOOKS (visual design)
- **Feature File** = WHAT IT DOES (functionality + generic content)
