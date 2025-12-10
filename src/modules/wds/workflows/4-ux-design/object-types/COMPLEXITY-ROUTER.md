# Complexity Router & Decomposition Coach

**Goal:** Detect component complexity and guide designer through modular decomposition

---

## STEP 1: OBJECT IDENTIFICATION

<output>**Analyzing object from sketch...**</output>

<action>Identify object type using standard object-router.md logic</action>

<output>**✓ Object Identified:** {{object_type}}

**{{object_name}}** - {{brief_description}}</output>

---

## STEP 2: COMPLEXITY ASSESSMENT

<action>Analyze complexity indicators:

**Simple Component Indicators:**

- Single state (no hover, active, loading variations)
- No user interaction (static display)
- No data dependencies
- No business logic

**Complex Component Indicators:**

- Multiple states (3+ states: empty, loading, active, completed, error)
- Time-based changes (countdowns, timers, real-time updates)
- Multi-step interactions (booking → starting → completing)
- Business rules (validation, permissions, blocking logic)
- Data synchronization (updates other components)
- State machines (defined transition paths)

**Examples:**

- **Simple:** Static text, image, basic button
- **Complex:** Calendar widget, booking system, search with filters, multi-step form
  </action>

---

## STEP 3: ROUTE BASED ON COMPLEXITY

### Path A: Simple Component

<check if="complexity == simple">

<output>**✅ Simple Component Detected**

This {{object_name}} is straightforward - I'll document it in the page specification.

**What I'll capture:**

- Visual appearance (size, color, position)
- Content (text in all languages)
- Basic interaction (if any)

Let's proceed!</output>

<action>Route to standard object-type file (e.g., button.md, heading-text.md)</action>
<action>Document in Page file only</action>

</check>

---

### Path B: Complex Component - DECOMPOSITION COACHING

<check if="complexity == complex">

<output>**🔍 Complex Component Detected**

I see this {{object_name}} has multiple states and interactions. Let me help you break this down properly!

**Complexity Indicators I Found:**
{{#each complexity_indicators}}

- {{indicator_description}}
  {{/each}}

**To keep this manageable, I'll help you separate:**

1. **Page Context** - Where it appears, size, position
2. **Visual Design** - How each state looks (for Figma)
3. **Functional Logic** - How it behaves, business rules

This makes handoff to developers and designers much cleaner!

Ready to break this down?</output>

<ask>**Shall we decompose this component?**

1. **Yes** - Guide me through the separation
2. **No** - Keep it simple, document in page only

Choice [1/2]:</ask>

<check if="choice == 1">
  <action>Proceed to DECOMPOSITION WORKFLOW</action>
</check>

<check if="choice == 2">
  <output>**Okay!** I'll document everything in the page spec.

⚠️ **Note:** This may create a large specification file. Consider decomposition for easier maintenance.</output>

<action>Route to standard object-type file</action>
<action>Document in Page file only</action>
</check>

</check>

---

## DECOMPOSITION WORKFLOW

<output>**Let's break down this {{object_name}} into manageable pieces!**

I'll ask you questions to separate the three concerns:

- **WHERE** it appears (Page)
- **HOW** it looks (Component)
- **WHAT** it does (Feature)

---

### Step 1: Page Context (WHERE)

**First, let's establish where this component appears on the page.**</output>

<ask>**Page Placement Questions:**

1. **Which page(s)** does this appear on?
   - Example: "Calendar page", "Dashboard and Profile pages"

2. **Where on the page?**
   - Example: "Main content area, center", "Sidebar, right side"

3. **How big is it?**
   - Example: "Full width", "80% width", "300px fixed width"

4. **Is this the same component on multiple pages, or page-specific?**
   - Example: "Same calendar on Dashboard and Calendar pages" vs "Unique to this page"

5. **Does the CONTENT change based on page context?**
   - Example: "Yes - hero heading is different on each page"
   - Example: "Yes - search placeholder changes (Products vs Help)"
   - Example: "Yes - shows current user's family name"
   - Example: "No - content is the same everywhere"

6. **Does the DATA source change based on page context?**
   - Example: "Yes - fetches different data per page"
   - Example: "No - always fetches same data"

Your answers:</ask>

<action>Capture page context:

- Pages: {{pages_list}}
- Position: {{position}}
- Size: {{size}}
- Reusability: {{is_reusable}}
- Content Varies: {{content_varies_by_page}}
- Data Source Varies: {{data_source_varies_by_page}}
  </action>

<output>**✅ Page Context Captured**

**What goes in the Page file:**
{{#if content_varies_by_page}}

- ✅ **Page-Specific Content** (headings, text, images that change per page)
  {{/if}}
  {{#if data_source_varies_by_page}}
- ✅ **Page-Specific Data Configuration** (API endpoints, filters, scope)
  {{/if}}
- ✅ **Position & Size** (where and how big)
- ✅ **Component Reference** (link to visual design)
- ✅ **Feature Reference** (link to functionality)

{{#if not content_varies_by_page}}
**Note:** Content is the same everywhere, so it will be documented in the Feature file instead.
{{/if}}

This will go in:
{{#each pages_list}}

- `Pages/{{page_number}}-{{page_name}}.md`
  {{/each}}

---

### Step 2: Visual Design (HOW IT LOOKS)

**Now let's document the visual appearance and states.**</output>

<ask>**Visual States Questions:**

Looking at your sketch/storyboard, how many different visual states does this component have?

Examples:

- **Simple:** Just 1 state (always looks the same)
- **Interactive:** 2-3 states (default, hover, active)
- **Complex:** 4+ states (empty, loading, active, completed, error)

**How many states do you see?**</ask>

<action>Count states: {{state_count}}</action>

<check if="state_count >= 3">
  <output>**📊 Multiple States Detected!**
  
  Let's document each state's visual appearance.</output>
  
  <ask>**For each state, I need:**
  
  {{#each states}}
  **State {{index}}: {{state_name}}**
  1. What does it look like? (colors, icons, layout)
  2. What triggers this state?
  3. Can it transition to other states?
  
  {{/each}}
  
  **Do you have a storyboard sketch showing these states?**
  - Example: "Yes, see Sketches/booking-states.jpg"
  - If yes, provide filename
  - If no, I'll document from your descriptions
  
  Your input:</ask>
  
  <action>Capture visual states:
  {{#each states}}
  - State: {{state_name}}
  - Appearance: {{visual_description}}
  - Trigger: {{trigger_description}}
  - Transitions: {{transition_list}}
  {{/each}}
  
  {{#if has_storyboard}}
  - Storyboard: {{storyboard_file}}
  {{/if}}
  </action>
</check>

<output>**✅ Visual Design Captured**

This will go in:

- `Components/{{component_name}}.component.md`
  {{#if has_storyboard}}
- Storyboard reference: `Features/Storyboards/{{storyboard_file}}`
  {{/if}}

---

### Step 3: Functional Logic (WHAT IT DOES)

**Finally, let's document the interactive behavior and business rules.**</output>

<ask>**Functionality Questions:**

1. **What can users DO with this component?**
   - Example: "Book a walk", "Search for items", "Filter results"

2. **What happens when they interact?**
   - Example: "Card changes color, leaderboard updates, week view syncs"

3. **Are there any business rules?**
   - Example: "Can't book if slot is taken", "Can't start walk if another is active"

4. **Does it need data from an API?**
   - Example: "Yes, fetches walk slots from /api/calendar/walks"

5. **Does it update other components?**
   - Example: "Yes, updates leaderboard and week overview when booking"

Your answers:</ask>

<action>Capture functional logic:

- User Actions: {{user_actions_list}}
- System Responses: {{system_responses_list}}
- Business Rules: {{business_rules_list}}
- API Dependencies: {{api_endpoints_list}}
- Component Sync: {{synced_components_list}}
  </action>

<output>**✅ Functional Logic Captured**

This will go in:

- `Features/{{feature_name}}.feature.md`
  {{#if has_storyboard}}
- Storyboard reference: `Features/Storyboards/{{storyboard_file}}`
  {{/if}}

---

### Summary: Three Files Created

**Great! Here's how your {{object_name}} will be documented:**

**1. Page File** (`Pages/{{page_number}}-{{page_name}}.md`)

```markdown
### {{section_name}}

**Component:** `{{component_name}}` (→ Components/{{component_name}}.component.md)
**Feature:** `{{feature_name}}` (→ Features/{{feature_name}}.feature.md)

**Position:** {{position}}
**Size:** {{size}}

**Configuration:**
{{#each page_specific_config}}

- {{config_item}}
  {{/each}}
```

**2. Component File** (`Components/{{component_name}}.component.md`)

```markdown
# {{component_name}} Component

**Type:** {{component_type}}
**Design System ID:** `{{component_id}}`

## Visual Specifications

{{#each states}}

### State: {{state_name}}

- Background: {{background_color}}
- Icons: {{icons_list}}
- Layout: {{layout_description}}
  {{/each}}

{{#if has_storyboard}}

## Visual Storyboard

![{{storyboard_name}}](../Features/Storyboards/{{storyboard_file}})
{{/if}}
```

**3. Feature File** (`Features/{{feature_name}}.feature.md`)

```markdown
# {{feature_name}} Feature

**Feature ID:** `{{feature_id}}`
**Type:** {{feature_type}}

{{#if has_storyboard}}

## Visual Storyboard

![{{storyboard_name}}](Storyboards/{{storyboard_file}})
{{/if}}

## User Interactions

{{#each user_actions}}

### {{action_name}}

**Flow:**

1. User {{user_action}}
2. System {{system_response}}
3. Updates: {{component_updates}}
   {{/each}}

## Business Rules

{{#each business_rules}}

- {{rule_description}}
  {{/each}}

## API Endpoints

{{#each api_endpoints}}

- {{endpoint_description}}
  {{/each}}
```

**Does this breakdown look good?**</output>

<ask>1. **Yes** - Create these files 2. **Adjust** - I need to change something

Choice [1/2]:</ask>

<check if="choice == 1">
  <output>**✅ Perfect! I'll create the three files.**
  
  **Next Steps:**
  - Page file: Lightweight, just placement and config
  - Component file: Visual design for Figma handoff
  - Feature file: Logic for developer implementation
  
  This keeps everything organized and maintainable!</output>
  
  <action>Create three separate file specifications</action>
  <action>Cross-reference between files</action>
</check>

<check if="choice == 2">
  <ask>**What needs adjustment?**</ask>
  
  <action>Listen to feedback</action>
  <action>Adjust file structure</action>
  <action>Re-present summary</action>
</check>

</output>

---

## COMPLEXITY DETECTION EXAMPLES

### Example 1: Simple Button

**Object:** "Get Started" button

**Complexity Assessment:**

- ✅ Single interaction (click → navigate)
- ✅ 2-3 states (default, hover, active)
- ❌ No business logic
- ❌ No data dependencies
- ❌ No multi-component sync

**Result:** **SIMPLE** - Document in Page file only

---

### Example 2: Search Bar with Autocomplete

**Object:** Search input with dropdown suggestions

**Complexity Assessment:**

- ⚠️ Multiple states (empty, typing, loading, results, no results, error)
- ⚠️ Real-time updates (debounced API calls)
- ⚠️ Business logic (minimum 3 characters, max 10 results)
- ⚠️ Data dependencies (search API endpoint)
- ⚠️ Keyboard navigation (arrow keys, enter, escape)

**Result:** **COMPLEX** - Decompose into 3 files

**Decomposition:**

- **Page (if content varies):**
  - Product page: Placeholder "Search products...", scope: products only
  - Help page: Placeholder "Search help...", scope: help articles only
- **Component:** Visual states (empty, focused, loading, results dropdown)
- **Feature:** Search logic (debounce, API calls, keyboard nav, result selection)

---

### Example 3: Calendar Booking Widget

**Object:** Dog Week calendar with week view, leaderboard, booking slots

**Complexity Assessment:**

- ⚠️ 6 walk states (WHITE, GRAY, ORANGE, BLUE, GREEN, RED)
- ⚠️ Time-based transitions (countdown timers, auto-state changes)
- ⚠️ Complex business rules (per-dog blocking, early start rules)
- ⚠️ Multi-component sync (week view, leaderboard, calendar)
- ⚠️ Real-time updates (every 1 minute)
- ⚠️ API dependencies (fetch walks, create booking, start walk, complete walk)

**Result:** **HIGHLY COMPLEX** - Decompose into 3 files + storyboard

**Decomposition:**

- **Page:** Layout (3 sections: week overview, leaderboard, calendar), responsive behavior
- **Component:** Visual design of all 6 states, week circles, leaderboard cards
- **Feature:** State machine logic, booking flow, time-based transitions, API integration
- **Storyboard:** `walk-state-transitions.jpg` showing all 6 states and triggers

---

## COACHING DIALOGUE EXAMPLE

### Scenario: Designer adds Calendar Widget

**Agent:**

```
🔍 Complex Component Detected

I see this "Calendar Booking Widget" has multiple states and interactions.
Let me help you break this down properly!

**Complexity Indicators I Found:**
- 6 different visual states (empty, booked, countdown, active, completed, missed)
- Time-based transitions (countdown timers update every minute)
- Business rules (can't start walk if another is active for same dog)
- Multi-component sync (updates week view and leaderboard)
- API dependencies (fetch/create/update walk data)

**To keep this manageable, I'll help you separate:**
1. **Page Context** - Where it appears, size, position
2. **Visual Design** - How each state looks (for Figma)
3. **Functional Logic** - How it behaves, business rules

This makes handoff to developers and designers much cleaner!

Ready to break this down?
```

**Designer:** "Yes"

**Agent:**

```
Let's break down this Calendar Booking Widget into manageable pieces!

---

### Step 1: Page Context (WHERE)

**Page Placement Questions:**

1. Which page(s) does this appear on?
2. Where on the page?
3. How big is it?
4. Is this the same component on multiple pages, or page-specific?
```

**Designer:**

```
1. Calendar page only
2. Main content area, takes up full width below header
3. Full width, height adjusts based on content
4. Unique to calendar page
5. Yes - shows current user's family name in header ("Familjen Svensson: Vecka 40")
6. Yes - fetches walks for current user's family only
```

**Agent:**

````
✅ Page Context Captured

**What goes in the Page file:**
- ✅ Page-Specific Content (family name in header)
- ✅ Page-Specific Data Configuration (fetch walks for current user's family)
- ✅ Position & Size (main content, full-width)
- ✅ Component Reference (link to visual design)
- ✅ Feature Reference (link to functionality)

This will go in:
- `Pages/02-calendar-page.md`

**Example Page Content:**
```markdown
### Calendar Section

**Component:** `walk-slot-card.component.md`
**Feature:** `walk-booking-logic.feature.md`

**Position:** Main content area, full-width below header
**Size:** Full width, height adjusts to content

**Page-Specific Content:**
- Header Format: "[Family Name]: Vecka [Week Number]"
  - SE: "Familjen Svensson: Vecka 40"
  - EN: "Svensson Family: Week 40"
- Data Source: Current user's family from session

**Configuration:**
- API Endpoint: GET /api/families/:currentFamilyId/walks?week=:weekNumber
- Dogs Displayed: All dogs in current user's family
- Family Members: All members in current user's family
````

---

### Step 2: Visual Design (HOW IT LOOKS)

Looking at your sketch/storyboard, how many different visual states does
this component have?

**How many states do you see?**

```

**Designer:** "6 states - I have a storyboard showing them all"

**Agent:**
```

📊 Multiple States Detected!

**For each state, I need:**

State 1: Empty (WHITE)

1. What does it look like?
2. What triggers this state?
3. Can it transition to other states?

[... repeat for all 6 states ...]

**Do you have a storyboard sketch showing these states?**

```

**Designer:** "Yes, see Sketches/App-Main-Booking-States.jpg"

**Agent:**
```

✅ Visual Design Captured

This will go in:

- `Components/walk-slot-card.component.md`
- Storyboard reference: `Features/Storyboards/walk-state-transitions.jpg`

---

### Step 3: Functional Logic (WHAT IT DOES)

**Functionality Questions:**

1. What can users DO with this component?
2. What happens when they interact?
3. Are there any business rules?
4. Does it need data from an API?
5. Does it update other components?

```

**Designer:**
```

1. Book walks, start walks, complete walks
2. Card changes color, leaderboard updates, week view syncs
3. Can't start walk if another is active for same dog,
   can't book if slot already taken
4. Yes - GET /api/walks, POST /api/walks, PUT /api/walks/:id
5. Yes - updates leaderboard count and week overview quarter circles

```

**Agent:**
```

✅ Functional Logic Captured

This will go in:

- `Features/walk-booking-logic.feature.md`
- Storyboard reference: `Features/Storyboards/walk-state-transitions.jpg`

---

### Summary: Three Files Created

**Great! Here's how your Calendar Booking Widget will be documented:**

**1. Page File** (`Pages/02-calendar-page.md`)

- Position: Main content, full-width
- Component reference: `walk-slot-card.component.md`
- Feature reference: `walk-booking-logic.feature.md`

**2. Component File** (`Components/walk-slot-card.component.md`)

- 6 visual states with colors, icons, layouts
- Storyboard: `Features/Storyboards/walk-state-transitions.jpg`
- Figma component mapping

**3. Feature File** (`Features/walk-booking-logic.feature.md`)

- State machine with 6 states
- Business rules (blocking, validation)
- API endpoints
- Multi-component sync logic
- Storyboard: `Storyboards/walk-state-transitions.jpg`

**Does this breakdown look good?**

```

**Designer:** "Yes!"

**Agent:**
```

✅ Perfect! I'll create the three files.

**Next Steps:**

- Page file: Lightweight, just placement and config
- Component file: Visual design for Figma handoff
- Feature file: Logic for developer implementation

This keeps everything organized and maintainable!

**Handoff Strategy:**

- Send Component file → Visual Designer (for Figma)
- Send Feature file → Developer (for implementation)
- Keep Page file → Your reference for layout

```

---

## KEY BENEFITS

### 1. Prevents Overwhelming Specs

**Before (Monolithic):**
```

Pages/02-calendar-page.md (800 lines)
├─ Everything mixed together
├─ Developer confused about what to build
├─ Designer confused about what to design
└─ Prototype misses features (leaderboard, week view)

```

**After (Decomposed):**
```

Pages/02-calendar-page.md (100 lines)
├─ Just layout and references

Components/walk-slot-card.component.md (150 lines)
├─ Visual design only
└─ Designer knows exactly what to create in Figma

Features/walk-booking-logic.feature.md (200 lines)
├─ Logic only
└─ Developer knows exactly what to implement

```

### 2. Clear Handoffs

- **Visual Designer** gets `Components/` folder → Creates Figma components
- **Developer** gets `Features/` folder → Implements logic
- **You** keep `Pages/` folder → Track design system integrity

### 3. Prevents Prototype Errors

**Why your prototype failed:**
- Leaderboard missing → Not in Component file
- Calendar wrong → Visual states not documented
- Week view only 5 days → Layout not specified

**With decomposition:**
- Component file explicitly lists all visual elements
- Feature file explicitly lists all interactions
- Storyboard shows all states visually
- Nothing gets missed!

---

## Content Placement Decision Tree

```

┌─────────────────────────────────────────────────┐
│ Does CONTENT vary by page context? │
│ (text, images, data source) │
└────────────┬────────────────────────────────────┘
│
┌──────┴──────┐
│ │
YES NO
│ │
▼ ▼
┌─────────────┐ ┌──────────────┐
│ Page File │ │ Feature File │
│ │ │ │
│ Document: │ │ Document: │
│ - Headings │ │ - Generic │
│ - Text │ │ content │
│ - Images │ │ - Default │
│ - Data API │ │ config │
│ - Scope │ │ │
└─────────────┘ └──────────────┘

Examples:

Page File (Content Varies):
✅ Hero heading: "Welcome to Dog Week" (Home) vs "About Dog Week" (About)
✅ Search placeholder: "Search products..." vs "Search help..."
✅ Calendar header: "Familjen Svensson: Vecka 40" (uses current user's family)
✅ Data API: /api/families/:currentFamilyId/walks (varies by user)

Feature File (Content Same Everywhere):
✅ Button text: "Submit" (always the same)
✅ Error message: "Invalid email" (generic validation)
✅ Tooltip: "Click to expand" (generic interaction)
✅ Data API: /api/products (same for all users)

```

---

## Summary

**Complexity Router:**
1. **Detects** simple vs complex components
2. **Coaches** you through decomposition
3. **Asks about content placement** (page-specific vs generic)
4. **Creates** three separate files automatically
5. **Prevents** overwhelming monolithic specs

**Content Placement Rule:**
- **Page File:** Content that changes based on WHERE it appears
- **Feature File:** Content that's the same everywhere
- **Component File:** Visual design only (no content)

**Result:**
- ✅ Clean handoffs to developers and designers
- ✅ Nothing gets missed in prototypes
- ✅ Easy to maintain and update
- ✅ Design system integrity preserved
- ✅ Clear separation of page-specific vs generic content
```
