# Content Placement Rules

**Decision tree for where to document content**

---

## The Core Question

```
Does CONTENT vary by page context?
│
├─ YES → Page File
│        (Hero heading, user-specific data)
│
└─ NO → Feature File
         (Generic button text, error messages)
```

---

## Page File Content

**Document in Page file when:**

- ✅ Content changes per page
- ✅ Data varies by user/context
- ✅ Configuration differs by placement

**Examples:**

- Hero heading: "Welcome" (Home) vs "About Us" (About)
- Search placeholder: "Search products..." vs "Search help..."
- Calendar header: "Familjen Svensson: Vecka 40" (user's family)
- API endpoint: `/api/families/:currentFamilyId/walks` (user-specific)

**⚠️ Common Mistake:**

```markdown
❌ Wrong: Features/hero-logic.feature.md
**Content:**

- Heading: "Welcome to TaskFlow" (Home page)
- Heading: "About TaskFlow" (About page)

✅ Right: Put in respective Page files
Pages/01-home-page.md → "Welcome to TaskFlow"
Pages/02-about-page.md → "About TaskFlow"
```

---

## Feature File Content

**Document in Feature file when:**

- ✅ Content is the same everywhere
- ✅ Generic validation messages
- ✅ Standard UI text

**Examples:**

- Button text: "Submit" (always the same)
- Error message: "Invalid email" (generic validation)
- Loading text: "Loading..." (standard)
- Tooltip: "Click to expand" (generic interaction)

**⚠️ Common Mistake:**

```markdown
❌ Wrong: Pages/01-home-page.md
**Content:**

- Submit button: "Submit"
- Error message: "Invalid email"

✅ Right: Features/form-submit-logic.feature.md
**Generic Content:**

- Submit button: "Submit"
- Error message: "Invalid email"
```

---

## Component File Content

**Component files contain NO content:**

- ❌ No text
- ❌ No images
- ❌ No data
- ✅ Only visual design (colors, spacing, states)

**Exception:** Content slots

```markdown
**Content Slots:**

- Heading text (configurable per page)
- Background image (configurable per page)
```

**⚠️ Common Mistakes:**

```markdown
❌ Wrong: Features/button-logic.feature.md
**Visual:** Background: Blue, Height: 48px

✅ Right: Components/button-primary.component.md
**Visual Specifications:** Background: Blue (#3B82F6), Height: 48px

---

❌ Wrong: Components/walk-slot-card.component.md
**Logic:** Can't start walk if another is active

✅ Right: Features/walk-booking-logic.feature.md
**Business Rules:** One active walk per dog
```

---

## Decision Matrix

| Content Type          | Page-Specific? | Where?    |
| --------------------- | -------------- | --------- |
| Hero heading          | ✅ YES         | Page      |
| Hero background       | ✅ YES         | Page      |
| Search placeholder    | ✅ YES         | Page      |
| User's family name    | ✅ YES         | Page      |
| API with user context | ✅ YES         | Page      |
| Submit button text    | ❌ NO          | Feature   |
| Error messages        | ❌ NO          | Feature   |
| Loading text          | ❌ NO          | Feature   |
| Tooltip text          | ❌ NO          | Feature   |
| Button color          | ❌ Visual      | Component |

---

## Examples

- [Simple Button](examples/simple-button.md)
- [Search Bar](examples/search-bar.md)
- [Calendar Widget](examples/complex-calendar.md)
