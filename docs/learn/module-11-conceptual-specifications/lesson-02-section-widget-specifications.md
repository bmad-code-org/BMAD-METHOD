# Module 11: Conceptual Specifications

## Lesson 2: Section & Widget Specifications

**Deep dive on Layers 2 & 3 of the hierarchy**

---

## Working Down the Hierarchy

You've specified the page-level context (Lesson 1). Now you work down to the major structural elements:

- **Layer 2: Sections** — Major areas that organize the page
- **Layer 3: Widgets** — Reusable components with complex behavior

These middle layers bridge strategy (page level) and implementation (element level).

---

## Section-Level Specifications (Layer 2)

Sections divide the page into logical areas. Each section serves a purpose.

### What Sections Define

```
Page-Level:     "This is the signup page for Felix"
                ↓
Section-Level:  "This hero section communicates value prop"
                "This form section collects minimal data"
                "This footer section provides legal links"
```

Sections answer:
- **Why does this section exist?**
- **Where does it appear on the page?**
- **How does it behave responsively?**
- **When does it load?**

---

## Section Specification Pattern

Every section follows this structure:

```markdown
## Section: [Section Name]
**ID:** [Page-ID]-[Section-ID]

### Purpose
[Why this section exists, what it accomplishes]

### Placement
- Position: [Header/Above fold/Below fold/Footer]
- Order: [Relative to other sections]
- Responsive: [How it adapts across breakpoints]

### Behavior
- Sticky: [Yes/No, conditions]
- Collapsible: [Yes/No, interaction]
- Animation: [Entry/exit animations]
- Visibility: [Always/Conditional]

### Load Priority
[Critical/High/Normal/Low - when it loads]

### Accessibility
- Landmark: [ARIA landmark role]
- Heading: [h1/h2/h3 - heading hierarchy]
- Skip Link: [Yes/No - skip to this section]

### Contains
[List of widgets/cards in this section]
```

---

## Section Example: Header

```markdown
## Section: Header
**ID:** P01-S01-header-section

### Purpose
Provide consistent navigation and branding across all authenticated pages.
Allow users to access account settings and log out.

### Placement
- Position: Top of page (header)
- Order: First section on all pages
- Responsive:
  - Mobile (<768px): Logo left, hamburger menu right
  - Tablet (768-1024px): Logo left, condensed nav center, profile right
  - Desktop (>1024px): Logo left, full nav center, profile + logout right

### Behavior
- Sticky: Yes (remains visible on scroll)
- Collapsible: No
- Animation: Slides down on page load (200ms ease-out)
- Visibility: Always (on all authenticated pages)

### Load Priority
Critical (renders immediately, blocks page display)

### Accessibility
- Landmark: role="banner"
- Heading: No heading in header (page h1 is below)
- Skip Link: Yes ("Skip to main content" link for keyboard users)

### Contains
- W01: Logo Link (navigates to dashboard)
- W02: Main Navigation Widget
- W03: User Profile Menu Widget
```

---

## Section Example: Form Area

```markdown
## Section: Form Area
**ID:** P01-S03-form-section

### Purpose
Contain the signup form widget, isolated from distractions to maintain
focus on the primary action (account creation).

### Placement
- Position: Above fold, centered
- Order: After hero section, before footer
- Responsive:
  - Mobile: Full width, padding 16px
  - Tablet: Max-width 480px, centered
  - Desktop: Max-width 480px, centered

### Behavior
- Sticky: No
- Collapsible: No
- Animation: Fade in after hero (300ms delay)
- Visibility: Always

### Load Priority
Critical (primary conversion point)

### Accessibility
- Landmark: role="main"
- Heading: h1 ("Create Your Account")
- Skip Link: No (already in main content)

### Contains
- W01: Signup Form Widget
```

---

## Section Responsive Behavior

Document how sections adapt across breakpoints:

```markdown
### Dashboard Section Responsive Behavior

**Mobile (<768px):**
- Stack all content vertically
- Full width cards
- Collapse navigation to hamburger
- Priority content first (tasks before calendar)

**Tablet (768-1024px):**
- Two-column grid
- Tasks left (60%), Calendar right (40%)
- Condensed navigation
- Touch targets 44px minimum

**Desktop (>1024px):**
- Three-column grid
- Tasks left (40%), Calendar center (40%), Sidebar right (20%)
- Full navigation visible
- Hover interactions enabled
```

**The pattern:** Mobile-first content priority, progressive enhancement for larger screens.

---

## Widget-Level Specifications (Layer 3)

Widgets are reusable components. They appear in multiple places and carry complex behavior.

### What Widgets Define

```
Section-Level:  "This section contains the signup form"
                ↓
Widget-Level:   "The signup form widget has 7 states,
                 validates in real-time, and can be
                 embedded in modal or standalone page"
```

Widgets answer:
- **Where is this widget reused?**
- **What are all its states?**
- **How does it validate?**
- **What accessibility pattern does it follow?**

---

## Widget Specification Pattern

Every widget follows this structure:

```markdown
## Widget: [Widget Name]
**ID:** [Page-ID]-[Section-ID]-[Widget-ID]

### Purpose
[What this widget accomplishes]

### Reusability
- Used in: [List all pages/contexts]
- Variations: [Different configurations if any]

### States
[All possible states with descriptions]

### Validation
[Rules, timing, feedback]

### Accessibility
- ARIA Pattern: [Standard pattern name]
- Keyboard: [Key interactions]
- Focus: [Focus management rules]
- Screen Reader: [Announcement strategy]

### Responsive Behavior
[How widget adapts to screen sizes]

### Content Structure
[Slots, placeholders, dynamic content areas]

### Contains
[List child elements - detailed in Lesson 3]
```

---

## Widget Example: Navigation Menu

```markdown
## Widget: Main Navigation Menu
**ID:** W02-main-nav-widget

### Purpose
Provide access to all primary sections of the application.
Orient users to available features.

### Reusability
- Used in: All authenticated pages (header section)
- Variations:
  - Full navigation (desktop)
  - Condensed navigation (tablet)
  - Hamburger menu (mobile)

### States
- Default: All nav items visible (desktop)
- Hover: Item background highlights
- Active: Current page highlighted with underline
- Mobile Closed: Hamburger icon only
- Mobile Open: Full-screen overlay with nav items
- Disabled: Some items disabled based on user permissions

### Validation
N/A (navigation doesn't validate)

### Accessibility
- ARIA Pattern: Navigation landmark + menu pattern
- Keyboard:
  - Tab: Move through nav items
  - Enter/Space: Activate link
  - Escape: Close mobile menu (when open)
  - Arrow keys: Optional, move between items
- Focus: Visible focus ring (2px blue, 2px offset)
- Screen Reader:
  - Announces "Main navigation"
  - Announces current page as "Current page, [Page Name]"
  - Mobile menu state: "Menu, collapsed" / "Menu, expanded"

### Responsive Behavior
**Desktop (>1024px):**
- Horizontal list, all items visible
- Hover states active
- Dropdown menus on hover (if nested)

**Tablet (768-1024px):**
- Condensed labels ("Dashboard" → "Dash")
- Icons + short text
- Touch-friendly spacing (44px targets)

**Mobile (<768px):**
- Hamburger icon only (☰)
- Full-screen overlay when open
- Vertical list, large touch targets
- Close button (×) in top-right

### Content Structure
- Logo slot (left)
- Nav items collection (center)
  - Each item: Label + optional icon + optional badge
- User menu slot (right)

### Contains
- E01: Logo Link
- E02-E06: Navigation Links (5 primary nav items)
- E07: User Profile Menu Trigger
```

---

## Widget Example: Searchable Dropdown

```markdown
## Widget: User Selector Dropdown
**ID:** W05-user-selector-widget

### Purpose
Allow task assignment by selecting from household members.
Provide quick search/filter when household has many members.

### Reusability
- Used in: Task creation form, Task edit form, Calendar event form
- Variations: Single-select (most contexts), Multi-select (bulk assignment)

### States
- Closed: Shows selected user (or "Select user..." placeholder)
- Opening: 150ms ease-out animation, dropdown expands
- Open: All users visible, search field focused
- Searching: Filtered list based on search input
- No Results: "No users found" empty state
- Selected: Checkmark next to selected user
- Closing: 150ms ease-in animation, dropdown collapses

### Validation
- Required field: Must select at least one user before form submit
- Validation timing: On blur and on submit attempt
- Error message: "Please select a user" (appears below dropdown)

### Accessibility
- ARIA Pattern: Combobox with listbox
- Keyboard:
  - Tab: Focus dropdown trigger
  - Enter/Space: Open dropdown
  - Arrow Down: Next user (when open)
  - Arrow Up: Previous user (when open)
  - Home: First user
  - End: Last user
  - Type characters: Filter list
  - Enter: Select current user
  - Escape: Close without selection
- Focus: Moves to search field when dropdown opens
- Screen Reader:
  - Dropdown trigger: "Select user, combobox, collapsed"
  - When open: "Select user, combobox, expanded, 5 users"
  - Each option: "User name, [selected/not selected]"
  - No results: "No users found, 0 results"

### Responsive Behavior
**All screen sizes:**
- Dropdown width matches trigger button width (min 240px)
- Max height: 320px, scrollable if more users
- Search field always visible at top when open

**Mobile considerations:**
- Larger touch targets (48px rows)
- Search field gets focus + brings up keyboard
- Consider modal on very small screens (<375px)

### Content Structure
- Trigger button (shows current selection or placeholder)
- Dropdown container (visible when open):
  - Search field
  - User list (scrollable)
  - Each user item:
    - Avatar (optional)
    - Name
    - Role label (optional)
    - Selection indicator (checkmark)

### Contains
- E01: Dropdown Trigger Button
- E02: Search Input Field
- E03: User List Container
- E04-E0N: User List Items (dynamic count)
- E0N+1: No Results Message (conditional)
```

---

## Widget States in Depth

Widgets often have complex state machines. Document them systematically:

```markdown
### Accordion Widget States

**State Diagram:**

```
┌─────────────┐
│  Collapsed  │ ◄─── Default
└──────┬──────┘
       │ (user clicks header)
       ↓
┌─────────────┐
│  Expanding  │ ◄─── Transition (300ms)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Expanded   │
└──────┬──────┘
       │ (user clicks header again)
       ↓
┌─────────────┐
│ Collapsing  │ ◄─── Transition (300ms)
└──────┬──────┘
       │
       ↓
Back to Collapsed
```

**State Details:**

| State | Visual | Keyboard Focus | ARIA |
|-------|--------|----------------|------|
| Collapsed | Content hidden, chevron → | Header focusable | aria-expanded="false" |
| Expanding | Content animates in, chevron rotates | Focus stays on header | aria-expanded="true" |
| Expanded | Content visible, chevron ↓ | Content focusable | aria-expanded="true" |
| Collapsing | Content animates out, chevron rotates | Focus stays on header | aria-expanded="false" |
```

---

## Widget Interaction Details

For complex widgets, specify exact interaction behavior:

```markdown
### Modal Dialog Interaction

**Opening:**
1. Trigger: User clicks "Create Task" button
2. Animation: 200ms ease-out
   - Backdrop: Fade in from 0% to 60% opacity
   - Modal: Scale from 0.95 to 1.0 + fade in
3. Focus: Moves to first input field in modal
4. Body scroll: Disabled (overflow: hidden on body)

**While Open:**
- Tab: Cycles through focusable elements within modal
- Shift+Tab: Reverse cycle
- Escape: Close modal (same as clicking Cancel)
- Click backdrop: Prompt "Unsaved changes. Close anyway?" if form is dirty

**Closing:**
1. Trigger: Click Cancel, click X, press Escape, or submit successfully
2. Animation: 150ms ease-in
   - Modal: Fade out + scale to 0.95
   - Backdrop: Fade out (starts when modal hits 50% opacity)
3. Focus: Returns to trigger button that opened modal
4. Body scroll: Re-enabled

**Submit Flow:**
1. User clicks Submit
2. Validation runs (client-side)
3. If invalid: Show errors, focus first error, stay open
4. If valid: Submit to server
5. While submitting: Show loading spinner, disable all inputs
6. On success: Brief success state (1s), then close modal
7. On error: Show error message, re-enable inputs, stay open
```

---

## Widget Validation Patterns

Document validation rules clearly:

```markdown
### Form Widget Validation

**Validation Strategy:**
- Inline validation (on blur from field)
- Submit validation (when Submit clicked)
- Real-time validation (for password strength, username availability)

**Validation Rules:**

| Field | Rule | Check Timing | Error Message |
|-------|------|--------------|---------------|
| Email | Required | On blur, On submit | "Email is required" |
| Email | Valid format | On blur, On submit | "Please enter a valid email" |
| Email | Not already registered | 1s after typing stops | "This email is already registered. [Log in →]" |
| Password | Required | On blur, On submit | "Password is required" |
| Password | Min 8 characters | Real-time (as typing) | "At least 8 characters needed" |
| Password | Contains number | Real-time (as typing) | "Include at least one number" |
| Password | Strength check | Real-time (as typing) | Indicator: Weak/Fair/Strong |

**Validation Display:**
- Error messages: Below field, red text (#DC2626)
- Field border: Red (#DC2626) when invalid
- Success indicator: Green checkmark (when valid + blurred)
- Submit button: Disabled until all fields valid
```

---

## Section & Widget Integration

Sections contain widgets. Specify the relationship:

```markdown
## Section: Dashboard Main
**ID:** P05-S02-dashboard-main

### Contains
- W01: Task List Widget
  - Displays user's assigned tasks
  - Allows status updates
  - Supports filtering by status/date
  - See: [Widget W01 specification](../widgets/W01-task-list.md)

- W02: Calendar Widget
  - Shows weekly view
  - Displays scheduled tasks and events
  - Allows drag-to-reschedule
  - See: [Widget W02 specification](../widgets/W02-calendar.md)

- W03: Quick Add Widget
  - Floating action button (bottom-right)
  - Opens task creation modal
  - Persists across page scroll
  - See: [Widget W03 specification](../widgets/W03-quick-add.md)
```

**The pattern:** Sections define WHERE and WHEN. Widgets define WHAT and HOW.

---

## Responsive Section + Widget Example

```markdown
## Section: Product Grid
**ID:** P08-S03-product-grid-section

### Responsive Behavior

**Mobile (<768px):**
- Single column layout
- Each product card full width
- Stack: Image → Title → Price → Add to Cart
- Infinite scroll (load more on scroll)

**Tablet (768-1024px):**
- Two-column grid
- Product cards in 2-up layout
- Gap: 24px between cards
- Pagination (load more button at bottom)

**Desktop (>1024px):**
- Three-column grid
- Product cards in 3-up layout
- Gap: 32px between cards
- Pagination (load more button at bottom)

### Contains
- W01: Filter Bar Widget (sticky on scroll)
- W02: Product Card Widget (template, rendered N times)
  - Widget adapts to container width
  - See: [Widget W02 specification](../widgets/W02-product-card.md)
```

---

## Accessibility Landmarks

Sections use ARIA landmarks for screen reader navigation:

```markdown
### Page Landmark Structure

```
<body>
  <header role="banner">                    ← P01-S01-header-section
    <nav role="navigation">                 ← W02-main-nav-widget
  </header>

  <main role="main">                        ← P01-S02-main-section
    <section aria-labelledby="tasks-heading">  ← P01-S03-tasks-section
      <h2 id="tasks-heading">Your Tasks</h2>
    </section>

    <aside role="complementary" aria-label="Calendar">  ← P01-S04-calendar-section
    </aside>
  </main>

  <footer role="contentinfo">               ← P01-S05-footer-section
  </footer>
</body>
```

**Landmark Guidelines:**
- One banner per page (header)
- One main per page
- One contentinfo per page (footer)
- Navigation landmarks for nav menus
- Complementary for sidebars/related content
- Label sections with aria-labelledby or aria-label when multiple of same type
```

---

## Common Section Patterns

### Sticky Header

```markdown
### Behavior
- Sticky: Yes
- Sticky Threshold: Scroll > 100px
- Animation: Shrinks from 80px to 60px height on scroll
- Shadow: Adds drop shadow when stuck
- Z-index: 100 (above all other content)
```

### Collapsible Sidebar

```markdown
### Behavior
- Collapsible: Yes
- Collapsed Width: 60px (icons only)
- Expanded Width: 240px (icons + labels)
- Toggle: Button in sidebar header
- Animation: 200ms ease-out width transition
- Persistence: State saved to localStorage
```

### Loading Section

```markdown
### Load Priority
Priority: Low (below fold)

### Loading Behavior
- Skeleton: Show 3 skeleton cards while loading
- Lazy: Only load when user scrolls within 200px of section
- Timeout: If load exceeds 5s, show "Taking longer..." message
- Error: If load fails, show "Couldn't load. [Retry]" button
```

---

## Common Widget Patterns

### Form Widgets

- Real-time validation as user types
- Debounced async checks (username availability, email verification)
- Disabled submit until valid
- Loading state on submit
- Error recovery (re-enable form on error)

### List Widgets

- Empty states ("No items yet")
- Loading states (skeleton items)
- Pagination or infinite scroll
- Sort and filter controls
- Bulk actions (select multiple items)

### Dialog/Modal Widgets

- Backdrop click behavior
- Escape key closes
- Focus trap (Tab cycles within modal)
- Return focus to trigger on close
- Prevent body scroll when open

---

## What's Next

You've specified sections and widgets — the structural and behavioral layers.

In Lesson 3, you'll learn how to specify cards and elements with complete state coverage, including all edge cases, error states, and exact content.

---

**[Continue to Lesson 3: Element & State Specifications →](lesson-03-element-state-specifications.md)**

---

[← Back to Lesson 1](lesson-01-design-is-specification.md) | [Back to Module Overview](module-11-conceptual-specifications-overview.md)

*Part of Module 11: Conceptual Specifications*
