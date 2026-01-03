# Component File Structure

**Modular Organization for Complex Components**

---

## Problem Statement

Complex components (calendars, calculators, graphs, interactive widgets) contain three distinct types of information that should be separated:

1. **Page Context** - Where/how component appears on specific pages
2. **Design System** - Visual design, states, Figma specifications
3. **Feature Logic** - Interactive behavior, business rules, data flow

**Current Issue:** All three are mixed in page specifications, making them hard to maintain and reuse.

---

## Proposed Structure

### File Organization

```
project-root/
├─ Pages/                          # Page-specific context
│  ├─ 01-start-page.md
│  ├─ 02-calendar-page.md
│  └─ 03-profile-page.md
│
├─ Components/                     # Design System components
│  ├─ navigation-bar.component.md
│  ├─ feature-card.component.md
│  ├─ calendar-widget.component.md
│  └─ walk-scheduler.component.md
│
└─ Features/                       # Interactive logic & business rules
   ├─ calendar-logic.feature.md
   ├─ walk-assignment.feature.md
   ├─ notification-system.feature.md
   └─ user-permissions.feature.md
```

---

## File Type Definitions

### 1. Page Files (`Pages/*.md`)

**Purpose:** Page-specific layout, component placement, and context

**Contains:**

- Page metadata (URL, scenario, purpose)
- Layout structure (sections, grid)
- Component instances with page-specific config
- Content in all languages
- Navigation flow (entry/exit points)

**Does NOT contain:**

- Component visual design (→ Components/)
- Interactive logic (→ Features/)

**Example:** `02-calendar-page.md`

```markdown
# 02-calendar-page

**Scenario:** Manage Dog Care Schedule
**URL:** `/calendar`

## Layout Structure

### Header Section

- Component: `navigation-bar` (from Components/)
- Position: Top, full-width

### Main Content

- Component: `calendar-widget` (from Components/)
- Position: Center, 80% width
- Configuration:
  - View: Month
  - Start Day: Monday
  - Show: Walk assignments only
- Feature: `calendar-logic` (from Features/)

### Sidebar

- Component: `walk-scheduler` (from Components/)
- Position: Right, 20% width
- Feature: `walk-assignment` (from Features/)

## Content

**Page Title:**

- EN: "Family Dog Care Calendar"
- SE: "Familjens Hundvårdskalender"
```

---

### 2. Component Files (`Components/*.md`)

**Purpose:** Visual design, states, variants, Figma specifications

**Contains:**

- Component name and purpose
- Visual specifications (colors, spacing, typography)
- States (default, hover, active, disabled, loading, error)
- Variants (sizes, types, themes)
- Figma component mapping
- Responsive behavior
- Accessibility requirements

**Does NOT contain:**

- Business logic (→ Features/)
- Page-specific placement (→ Pages/)

**Example:** `calendar-widget.component.md`

```markdown
# Calendar Widget Component

**Type:** Complex Interactive Component
**Design System ID:** `calendar-widget`
**Figma Component:** `DS/Widgets/Calendar`

## Purpose

Displays a monthly calendar view with interactive date selection and event display.

## Visual Specifications

### Layout

- Grid: 7 columns (days) × 5-6 rows (weeks)
- Cell size: 48px × 48px (desktop), 40px × 40px (mobile)
- Gap: 4px between cells
- Padding: 16px container padding

### Typography

- Month/Year header: Large Heading (24px Bold)
- Day labels: Caption (12px Medium)
- Date numbers: Body Text (16px Regular)
- Event indicators: Caption (10px Regular)

### Colors

- Background: `--color-surface`
- Cell default: `--color-surface-elevated`
- Cell hover: `--color-surface-hover`
- Cell selected: `--color-primary`
- Cell today: `--color-accent`
- Cell disabled: `--color-surface-disabled`

## States

### Default State

- All dates visible
- Current month displayed
- Today highlighted with accent color
- No date selected

### Date Selected

- Selected date: Primary color background
- Date number: White text
- Border: 2px solid primary-dark

### Date Hover

- Background: Surface-hover color
- Cursor: Pointer
- Transition: 150ms ease

### Date Disabled (Past dates)

- Background: Surface-disabled
- Text: Gray-400
- Cursor: Not-allowed
- No hover effect

### Loading State

- Skeleton animation on date cells
- Month/year header visible
- Navigation disabled

### With Events

- Small dot indicator below date number
- Dot color: Event category color
- Max 3 dots visible per cell

## Variants

### Size Variants

- **Large:** 56px cells (desktop default)
- **Medium:** 48px cells (tablet)
- **Small:** 40px cells (mobile)

### View Variants

- **Month View:** Default, shows full month
- **Week View:** Shows 7 days in row
- **Day View:** Shows single day with hourly slots

## Figma Specifications

**Component Path:** `Design System > Widgets > Calendar`

**Variants to Create:**

- Size: Large / Medium / Small
- View: Month / Week / Day
- State: Default / Selected / Disabled / Loading

**Auto-layout:** Enabled
**Constraints:** Fill container width

## Responsive Behavior

### Mobile (< 768px)

- Use Small variant (40px cells)
- Stack month navigation vertically
- Reduce padding to 12px

### Tablet (768px - 1024px)

- Use Medium variant (48px cells)
- Horizontal month navigation
- Standard padding (16px)

### Desktop (> 1024px)

- Use Large variant (56px cells)
- Full navigation controls
- Increased padding (20px)

## Accessibility

- **Keyboard Navigation:**
  - Arrow keys: Navigate between dates
  - Enter/Space: Select date
  - Tab: Move to month navigation
- **Screen Readers:**
  - ARIA label: "Calendar, {Month} {Year}"
  - Each date: "Select {Day}, {Date} {Month}"
  - Selected date: "Selected, {Day}, {Date} {Month}"
- **Focus Management:**
  - Visible focus ring on keyboard navigation
  - Focus trap within calendar when open

## Dependencies

- **Features:** Requires `calendar-logic.feature.md` for interaction behavior
- **Data:** Expects events array from API
```

---

### 3. Feature Files (`Features/*.md`)

**Purpose:** Interactive logic, business rules, data flow, state management

**Contains:**

- Feature name and purpose
- User interactions and system responses
- Business rules and validation
- State transitions
- Data requirements (API endpoints, data models)
- Edge cases and error handling

**Does NOT contain:**

- Visual design (→ Components/)
- Page layout (→ Pages/)

**Example:** `calendar-logic.feature.md`

````markdown
# Calendar Logic Feature

**Feature ID:** `calendar-logic`
**Type:** Interactive Widget Logic
**Complexity:** High

## Purpose

Manages calendar interactions, date selection, event display, and navigation between months/weeks/days.

## User Interactions

### Interaction 1: Select Date

**Trigger:** User clicks on a date cell

**Flow:**

1. User clicks date cell
2. System validates date is not disabled
3. System updates selected date state
4. System triggers `onDateSelect` callback with date
5. System highlights selected date
6. System updates related components (e.g., event list for that date)

**Business Rules:**

- Cannot select dates in the past (configurable)
- Cannot select dates beyond 1 year in future (configurable)
- Can only select one date at a time (single-select mode)
- Can select date range (range-select mode, if enabled)

**Edge Cases:**

- Clicking already selected date: Deselects it
- Clicking disabled date: No action, show tooltip
- Rapid clicking: Debounce to prevent multiple selections

### Interaction 2: Navigate to Next Month

**Trigger:** User clicks "Next Month" button

**Flow:**

1. User clicks next month button
2. System increments month by 1
3. System fetches events for new month (if needed)
4. System re-renders calendar with new month
5. System clears selected date (optional, configurable)
6. System updates month/year header

**Business Rules:**

- Cannot navigate beyond max date (1 year from today)
- Loading state shown while fetching events
- Previous selections cleared on month change

### Interaction 3: View Events for Date

**Trigger:** User hovers over date with event indicators

**Flow:**

1. User hovers over date cell with events
2. System shows tooltip with event summary
3. Tooltip displays: Event count, first 2 event titles
4. User can click to see full event list

**Business Rules:**

- Tooltip appears after 300ms hover
- Max 2 events shown in tooltip
- "And X more" shown if > 2 events

## State Management

### Component State

```javascript
{
  currentMonth: Date,           // Currently displayed month
  selectedDate: Date | null,    // User-selected date
  viewMode: 'month' | 'week' | 'day',
  events: Event[],              // Events for current view
  loading: boolean,             // Loading state
  error: string | null          // Error message
}
```
````

### State Transitions

**Initial State:**

- currentMonth: Current month
- selectedDate: null
- viewMode: 'month'
- events: []
- loading: false
- error: null

**On Date Select:**

- selectedDate: clicked date
- Trigger callback: onDateSelect(date)

**On Month Change:**

- currentMonth: new month
- selectedDate: null (if clearOnMonthChange = true)
- loading: true
- Fetch events for new month
- loading: false

**On Error:**

- error: error message
- loading: false
- Show error state in UI

## Data Requirements

### API Endpoints

**Get Events for Month**

- **Method:** GET
- **Path:** `/api/calendar/events?month={YYYY-MM}`
- **Purpose:** Fetch all events for specified month
- **Response:**
  ```json
  {
    "events": [
      {
        "id": "evt_123",
        "date": "2024-12-15",
        "title": "Morning Walk - Max",
        "category": "walk",
        "assignedTo": "user_456"
      }
    ]
  }
  ```

**Create Event**

- **Method:** POST
- **Path:** `/api/calendar/events`
- **Purpose:** Create new calendar event
- **Request:**
  ```json
  {
    "date": "2024-12-15",
    "title": "Morning Walk",
    "category": "walk",
    "assignedTo": "user_456"
  }
  ```

### Data Models

**Event Model:**

```typescript
interface Event {
  id: string;
  date: string; // ISO date format
  title: string;
  category: 'walk' | 'feeding' | 'vet' | 'grooming';
  assignedTo: string; // User ID
  completed: boolean;
  notes?: string;
}
```

## Validation Rules

| Rule         | Validation                                | Error Message                          |
| ------------ | ----------------------------------------- | -------------------------------------- |
| Date in past | `date < today`                            | "Cannot select past dates"             |
| Date too far | `date > today + 365 days`                 | "Cannot select dates beyond 1 year"    |
| Event title  | `title.length > 0 && title.length <= 100` | "Event title required (max 100 chars)" |

## Error Handling

### Network Error (Failed to fetch events)

- **Trigger:** API request fails
- **Action:** Show error state in calendar
- **Message:** "Unable to load events. Please try again."
- **Recovery:** Retry button

### Invalid Date Selection

- **Trigger:** User attempts to select disabled date
- **Action:** Show tooltip
- **Message:** "This date is not available"
- **Recovery:** Select different date

## Configuration Options

```javascript
{
  minDate: Date | null,          // Earliest selectable date
  maxDate: Date | null,          // Latest selectable date
  disablePastDates: boolean,     // Disable dates before today
  clearOnMonthChange: boolean,   // Clear selection on month change
  selectionMode: 'single' | 'range',
  showEventIndicators: boolean,  // Show dots for events
  fetchEventsOnMount: boolean,   // Auto-fetch on load
  onDateSelect: (date: Date) => void,
  onMonthChange: (month: Date) => void,
  onEventClick: (event: Event) => void
}
```

## Dependencies

- **Component:** `calendar-widget.component.md` (visual design)
- **Feature:** `walk-assignment.feature.md` (for creating walk events)
- **API:** Calendar Events API

```

---

## Benefits of This Structure

### 1. Separation of Concerns

| Concern | File Type | Example |
|---------|-----------|---------|
| **Where** component appears | Page | `02-calendar-page.md` |
| **How** component looks | Component | `calendar-widget.component.md` |
| **What** component does | Feature | `calendar-logic.feature.md` |

### 2. Reusability

**Component used on multiple pages:**
```

Pages/02-calendar-page.md → Components/calendar-widget.component.md
Pages/05-dashboard.md → Components/calendar-widget.component.md
↓
Features/calendar-logic.feature.md

```

**Same component, different configurations:**
- Calendar Page: Month view, full-width
- Dashboard: Week view, sidebar widget

### 3. Team Collaboration

| Role | Primary Files | Secondary Files |
|------|---------------|-----------------|
| **UX Designer** | Components/ | Pages/ (layout) |
| **Developer** | Features/ | Components/ (implementation) |
| **Content Writer** | Pages/ | - |
| **Product Manager** | Features/ (rules) | Pages/ (flow) |

### 4. Maintainability

**Change visual design:**
- Edit: `Components/calendar-widget.component.md`
- Impact: All pages using calendar automatically updated

**Change business logic:**
- Edit: `Features/calendar-logic.feature.md`
- Impact: All instances of calendar use new logic

**Change page layout:**
- Edit: `Pages/02-calendar-page.md`
- Impact: Only that specific page

---

## File Naming Conventions

### Pages
```

{number}-{page-name}.md

Examples:
01-start-page.md
02-calendar-page.md
03-profile-settings.md

```

### Components
```

{component-name}.component.md

Examples:
navigation-bar.component.md
feature-card.component.md
calendar-widget.component.md
walk-scheduler.component.md

```

### Features
```

{feature-name}.feature.md

Examples:
calendar-logic.feature.md
walk-assignment.feature.md
user-authentication.feature.md
notification-system.feature.md

````

---

## Cross-Reference System

### In Page Files

Reference components and features:

```markdown
### Main Content Section

**Component:** `calendar-widget` (→ Components/calendar-widget.component.md)
**Feature:** `calendar-logic` (→ Features/calendar-logic.feature.md)
**Configuration:**
- View: Month
- Disable past dates: true
````

### In Component Files

Reference required features:

```markdown
## Dependencies

- **Feature:** `calendar-logic.feature.md` (interaction behavior)
- **Feature:** `walk-assignment.feature.md` (event creation)
```

### In Feature Files

Reference related components:

```markdown
## Dependencies

- **Component:** `calendar-widget.component.md` (visual implementation)
- **API:** Calendar Events API
```

---

## Migration Strategy

### Phase 1: Create Structure

1. Create `Components/` folder
2. Create `Features/` folder
3. Keep existing `Pages/` (or create if needed)

### Phase 2: Extract Components

1. Identify reusable components in page specs
2. Create component files with visual design only
3. Update page files to reference components

### Phase 3: Extract Features

1. Identify complex interactive logic
2. Create feature files with business rules
3. Update page and component files to reference features

### Phase 4: Refactor Existing Pages

1. Move visual specs → Components/
2. Move logic → Features/
3. Keep layout & content in Pages/

---

## Example: Dog Week Calendar

### Before (Monolithic)

```
Pages/02-calendar-page.md (500 lines)
├─ Page layout
├─ Calendar visual design
├─ Calendar interaction logic
├─ Walk scheduler visual design
├─ Walk assignment logic
├─ Navigation bar design
└─ All content in all languages
```

### After (Modular)

```
Pages/02-calendar-page.md (100 lines)
├─ Page layout
├─ Component references
├─ Feature references
└─ Content in all languages

Components/calendar-widget.component.md (150 lines)
├─ Visual specifications
├─ States & variants
└─ Figma mapping

Components/walk-scheduler.component.md (100 lines)
├─ Visual specifications
└─ States & variants

Features/calendar-logic.feature.md (200 lines)
├─ Interaction flows
├─ Business rules
├─ Data requirements
└─ Error handling

Features/walk-assignment.feature.md (150 lines)
├─ Assignment logic
├─ Validation rules
└─ API integration
```

**Result:** Easier to maintain, reuse, and collaborate!

---

## Summary

**Three-tier architecture:**

1. **Pages/** - Layout, placement, content (WHERE)
2. **Components/** - Visual design, states, Figma (HOW IT LOOKS)
3. **Features/** - Logic, rules, data (WHAT IT DOES)

**Benefits:**

- ✅ Clear separation of concerns
- ✅ Reusable components across pages
- ✅ Maintainable business logic
- ✅ Better team collaboration
- ✅ Aligns with BMad v6 modular philosophy
