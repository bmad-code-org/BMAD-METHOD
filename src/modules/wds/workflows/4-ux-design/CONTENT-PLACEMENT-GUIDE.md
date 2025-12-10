# Content Placement Guide

**Where to Document Content: Page vs Component vs Feature**

---

## Quick Decision Tree

```
Is this CONTENT (text, images, data)?
│
├─ YES → Does it vary by page context?
│        │
│        ├─ YES → Page File
│        │        (e.g., "Welcome to Dog Week" on Home, "About Dog Week" on About)
│        │
│        └─ NO → Feature File
│                 (e.g., "Submit" button text is always the same)
│
└─ NO → Is this VISUAL design (colors, spacing, states)?
         │
         └─ YES → Component File
                  (e.g., button is blue, 48px height, has hover state)
```

---

## The Three File Types

### 1. Page File (WHERE)

**Contains:**

- ✅ Position & size
- ✅ **Page-specific content** (headings, text, images that change per page)
- ✅ **Page-specific data** (API endpoints with page context)
- ✅ Component references
- ✅ Feature references

**Example:**

```markdown
## Pages/01-home-page.md

### Hero Section

**Component:** `hero-banner.component.md`

**Position:** Top of page, full-width
**Size:** 400px height (desktop), 300px (mobile)

**Page-Specific Content:**

- Heading: "Welcome to Dog Week" / "Välkommen till Dog Week"
- Subheading: "Coordinate your family's dog walks effortlessly"
- Background Image: `/images/hero-home-happy-dog.jpg`
- CTA Button Text: "Get Started" / "Kom igång"
- CTA Button Link: → `/onboarding/start`
```

---

### 2. Component File (HOW IT LOOKS)

**Contains:**

- ✅ Visual specifications (colors, spacing, typography)
- ✅ States (default, hover, active, disabled, loading, error)
- ✅ Variants (sizes, types, themes)
- ✅ Figma component mapping
- ✅ Responsive behavior
- ✅ Accessibility
- ❌ **NO content** (no text, no images, no data)

**Example:**

```markdown
## Components/hero-banner.component.md

# Hero Banner Component

**Visual Specifications:**

- Height: 400px (desktop), 300px (mobile)
- Layout: Centered text over background image
- Background: Image with dark overlay (40% opacity)
- Typography:
  - Heading: 48px Bold, white color
  - Subheading: 18px Regular, white color
- CTA Button: Primary button style (blue background, white text)

**Content Slots:**

- Heading text (configurable per page)
- Subheading text (configurable per page)
- Background image (configurable per page)
- CTA button text + link (configurable per page)

**States:**

- Default: Full opacity
- Loading: Skeleton placeholder
```

---

### 3. Feature File (WHAT IT DOES)

**Contains:**

- ✅ User interactions & system responses
- ✅ Business rules & validation
- ✅ State management
- ✅ **Generic content** (content that's the same everywhere)
- ✅ **Generic data** (API endpoints without page context)
- ✅ Error handling
- ✅ Configuration options
- ❌ **NO visual design** (no colors, no spacing, no states)

**Example:**

```markdown
## Features/hero-cta-logic.feature.md

# Hero CTA Logic Feature

**User Interactions:**

### Click CTA Button

1. User clicks CTA button
2. System validates user session
3. If logged in → Navigate to destination
4. If not logged in → Show login modal first

**Generic Content:**

- Loading text: "Loading..." / "Laddar..."
- Error message: "Something went wrong" / "Något gick fel"

**API Endpoints:**

- GET /api/user/session (check if logged in)

**Business Rules:**

- CTA disabled during loading
- CTA shows loading spinner when clicked
```

---

## Content Placement Examples

### Example 1: Hero Section

**Scenario:** Hero banner appears on multiple pages with different content

**Page File (Home):**

```markdown
**Page-Specific Content:**

- Heading: "Welcome to Dog Week"
- Subheading: "Coordinate your family's dog walks"
- Background Image: `/images/hero-home.jpg`
- CTA Text: "Get Started"
- CTA Link: `/onboarding/start`
```

**Page File (About):**

```markdown
**Page-Specific Content:**

- Heading: "About Dog Week"
- Subheading: "Our mission to simplify dog care"
- Background Image: `/images/hero-about.jpg`
- CTA Text: "Contact Us"
- CTA Link: `/contact`
```

**Component File:**

```markdown
**Visual Specifications:**

- Height: 400px
- Typography: 48px Bold heading, 18px Regular subheading
- Layout: Centered text over image

**Content Slots:**

- Heading (configurable)
- Subheading (configurable)
- Background image (configurable)
- CTA button (configurable)
```

**Feature File:**

```markdown
**Generic Content:**

- Loading text: "Loading..."

**Interactions:**

- Click CTA → Navigate to link
```

---

### Example 2: Search Bar

**Scenario:** Search bar appears on Product page and Help page with different scopes

**Page File (Product Catalog):**

```markdown
**Page-Specific Content:**

- Placeholder: "Search products..." / "Sök produkter..."

**Page-Specific Data:**

- API Endpoint: GET /api/products/search?q=:query
- Scope: Products only
- Result Display: Product cards grid
```

**Page File (Help Center):**

```markdown
**Page-Specific Content:**

- Placeholder: "Search help articles..." / "Sök hjälpartiklar..."

**Page-Specific Data:**

- API Endpoint: GET /api/help/search?q=:query
- Scope: Help articles only
- Result Display: Article list
```

**Component File:**

```markdown
**Visual Specifications:**

- Height: 48px
- Border: 1px solid gray
- States:
  - Default: Gray border
  - Focused: Blue border
  - Loading: Spinner icon on right
  - Results: Dropdown below input

**Content Slots:**

- Placeholder text (configurable per page)
```

**Feature File:**

```markdown
**Generic Content:**

- No results message: "No results found" / "Inga resultat"
- Error message: "Search failed" / "Sökning misslyckades"

**Interactions:**

- User types → Debounce 300ms → API call
- Min 3 characters required
- Max 10 results displayed
- Keyboard navigation (arrow keys, enter, escape)

**Business Rules:**

- Debounce: 300ms
- Min characters: 3
- Max results: 10
```

---

### Example 3: Calendar Widget

**Scenario:** Calendar appears only on Calendar page, shows current user's family data

**Page File (Calendar Page):**

```markdown
**Page-Specific Content:**

- Header Format: "[Family Name]: Vecka [Week Number]"
  - SE: "Familjen Svensson: Vecka 40"
  - EN: "Svensson Family: Week 40"

**Page-Specific Data:**

- Data Source: Current user's family from session
- API Endpoint: GET /api/families/:currentFamilyId/walks?week=:weekNumber
- Dogs Displayed: All dogs in current user's family
- Family Members: All members in current user's family

**Configuration:**

- Initial View: Current week, scrolled to today
- Time Slots: 4 hardcoded (8-11, 12-13, 15-17, 18-20)
```

**Component File:**

```markdown
**Visual Specifications:**

- 6 walk states (WHITE, GRAY, ORANGE, BLUE, GREEN, RED)
- Week circles: 7 days with quarter segments
- Leaderboard cards: Avatar + badge + name

**Content Slots:**

- Header text (configurable per page)
- Time slot labels (configurable)
```

**Feature File:**

```markdown
**Generic Content:**

- Empty state: "Add a dog to start planning walks"
- Error message: "Failed to load walks"
- Countdown format: "32 min left" / "32 min kvar"
- Duration format: "32 min walk" / "32 min promenad"

**Interactions:**

- Book walk → GRAY state
- Start walk → BLUE state
- Complete walk → GREEN state
- Miss walk → RED state

**Business Rules:**

- One active walk per dog
- Can't book if slot taken
- Countdown starts at slot start time

**API Endpoints:**

- GET /api/families/:familyId/walks?week=:weekNumber
- POST /api/walks (create booking)
- PUT /api/walks/:walkId/start
- PUT /api/walks/:walkId/complete
```

---

### Example 4: Submit Button

**Scenario:** Submit button appears on multiple forms, always says "Submit"

**Page File:**

```markdown
**Position:** Bottom of form, right-aligned
**Size:** Full-width on mobile, auto-width on desktop

**Component:** `button-primary.component.md`
**Feature:** `form-submit-logic.feature.md`

(No page-specific content - button text is always "Submit")
```

**Component File:**

```markdown
**Visual Specifications:**

- Background: Blue (#3B82F6)
- Text: White, 16px Medium
- Height: 48px
- Border Radius: 8px
- States:
  - Default: Blue background
  - Hover: Darker blue
  - Active: Even darker blue
  - Disabled: Gray background
  - Loading: Blue background + spinner
```

**Feature File:**

```markdown
**Generic Content:**

- Button text: "Submit" / "Skicka"
- Loading text: "Submitting..." / "Skickar..."
- Success message: "Submitted successfully" / "Skickat"
- Error message: "Submission failed" / "Misslyckades"

**Interactions:**

- Click → Validate form
- If valid → Submit to API
- If invalid → Show validation errors
- Show loading state during submission
```

---

## Decision Matrix

| Content Type                       | Page-Specific?                    | Where to Document |
| ---------------------------------- | --------------------------------- | ----------------- |
| **Hero heading**                   | ✅ YES (different per page)       | Page File         |
| **Hero background image**          | ✅ YES (different per page)       | Page File         |
| **Search placeholder**             | ✅ YES (different per page)       | Page File         |
| **Calendar header**                | ✅ YES (shows user's family name) | Page File         |
| **API endpoint with user context** | ✅ YES (varies by user/page)      | Page File         |
| **Submit button text**             | ❌ NO (always "Submit")           | Feature File      |
| **Error messages**                 | ❌ NO (generic validation)        | Feature File      |
| **Loading text**                   | ❌ NO (always "Loading...")       | Feature File      |
| **Tooltip text**                   | ❌ NO (generic interaction)       | Feature File      |
| **API endpoint (generic)**         | ❌ NO (same for all users)        | Feature File      |
| **Button color**                   | ❌ NO (visual design)             | Component File    |
| **Font size**                      | ❌ NO (visual design)             | Component File    |
| **Hover state**                    | ❌ NO (visual design)             | Component File    |
| **Layout spacing**                 | ❌ NO (visual design)             | Component File    |

---

## Common Mistakes

### ❌ Mistake 1: Putting page-specific content in Feature file

**Wrong:**

```markdown
## Features/hero-logic.feature.md

**Content:**

- Heading: "Welcome to Dog Week" (Home page)
- Heading: "About Dog Week" (About page)
```

**Right:**

```markdown
## Pages/01-home-page.md

**Page-Specific Content:**

- Heading: "Welcome to Dog Week"

## Pages/02-about-page.md

**Page-Specific Content:**

- Heading: "About Dog Week"
```

---

### ❌ Mistake 2: Putting generic content in Page file

**Wrong:**

```markdown
## Pages/01-home-page.md

**Content:**

- Submit button: "Submit"
- Error message: "Invalid email"
```

**Right:**

```markdown
## Features/form-submit-logic.feature.md

**Generic Content:**

- Submit button: "Submit"
- Error message: "Invalid email"
```

---

### ❌ Mistake 3: Putting visual design in Feature file

**Wrong:**

```markdown
## Features/button-logic.feature.md

**Visual:**

- Background: Blue
- Height: 48px
- Hover: Darker blue
```

**Right:**

```markdown
## Components/button-primary.component.md

**Visual Specifications:**

- Background: Blue (#3B82F6)
- Height: 48px
- States:
  - Hover: Darker blue (#2563EB)
```

---

## Summary

**Content Placement Rule:**

```
Does content vary by page context?
├─ YES → Page File
│        (Hero heading, search placeholder, user-specific data)
│
└─ NO → Feature File
         (Button text, error messages, generic tooltips)

Is this visual design?
└─ YES → Component File
         (Colors, spacing, states, typography)
```

**Key Principle:**

- **Page File** = WHERE + WHAT (page-specific)
- **Component File** = HOW IT LOOKS (visual design)
- **Feature File** = WHAT IT DOES (functionality + generic content)

**Result:**

- ✅ Clear separation of concerns
- ✅ Easy to maintain and update
- ✅ Clean handoffs to designers and developers
- ✅ No confusion about where content belongs
