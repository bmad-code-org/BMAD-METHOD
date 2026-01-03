# Storyboard Integration Guide

**Using Visual Storyboards to Document Complex Component Functionality**

---

## Problem Statement

Complex interactive components (calendars, booking systems, multi-step workflows) have **state transitions** and **interaction flows** that are difficult to describe in text alone.

**Storyboards** provide visual, sequential documentation of:

- State transitions (e.g., Empty → Booked → Active → Completed)
- User interactions and system responses
- Time-based changes (countdowns, timers)
- Multi-step workflows

---

## Storyboard Types

### 1. **State Transition Storyboards**

**Purpose:** Show how a component changes states over time

**Example:** Dog Week Walk Booking States

```
┌─────────────────────────────────────────────────┐
│  State Transition Storyboard                    │
│  Component: Walk Time Slot Card                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. WHITE (Empty)        → User books           │
│     [Dog icon] 8-11      → [Book button]        │
│                                                 │
│  2. GRAY (Booked)        → Time arrives         │
│     [Dog+User] 8-11                             │
│                                                 │
│  3. ORANGE (Countdown)   → User starts          │
│     [Dog icon] 32 min left → [Start button]    │
│                                                 │
│  4. BLUE (In Progress)   → User completes       │
│     [Dog+User] Started 09:32 • 23 min ago      │
│                                                 │
│  5. GREEN (Completed)    → Final state          │
│     [Dog+User] 32 min walk ✓                   │
│                                                 │
│  Alt: RED (Missed)       → Window expired       │
│     [Dog icon] No walk registered ⊖            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**File:** `Sketches/App-Main-Booking-States.jpg` (Dog Week example)

### 2. **Interaction Flow Storyboards**

**Purpose:** Show step-by-step user interactions

**Example:** Calendar Booking Flow

```
Frame 1: User views calendar
Frame 2: User taps "Book" button
Frame 3: Card transitions to GRAY state
Frame 4: Leaderboard updates (+1 point)
Frame 5: Week overview quarter circle turns gray
```

### 3. **Multi-Component Storyboards**

**Purpose:** Show how multiple components interact

**Example:** Week View + Leaderboard + Calendar Sync

```
Frame 1: User clicks day circle in week overview
Frame 2: Calendar scrolls to that day
Frame 3: User books walk
Frame 4: Week overview quarter circle updates
Frame 5: Leaderboard count increments
```

---

## Integration with Modular Structure

### Where Storyboards Belong

| File Type       | Contains Storyboard?  | Purpose                               |
| --------------- | --------------------- | ------------------------------------- |
| **Pages/**      | ❌ No                 | Page layout only                      |
| **Components/** | ⚠️ Visual states only | Static appearance of each state       |
| **Features/**   | ✅ YES                | State transitions & interaction flows |

### Storyboard Storage

```
project-root/
├─ Pages/
│  └─ 02-calendar-page.md
│
├─ Components/
│  └─ walk-slot-card.component.md
│
├─ Features/
│  ├─ walk-booking-logic.feature.md
│  └─ Storyboards/                    ← NEW FOLDER
│     ├─ walk-state-transitions.jpg
│     ├─ booking-flow.jpg
│     └─ calendar-sync-flow.jpg
│
└─ Sketches/                          ← Existing page sketches
   └─ 02-calendar-page-sketch.jpg
```

---

## Feature File with Storyboard Reference

### Example: `walk-booking-logic.feature.md`

```markdown
# Walk Booking Logic Feature

**Feature ID:** `walk-booking-logic`
**Type:** State Machine with Time-Based Transitions
**Complexity:** High

## Purpose

Manages walk slot state transitions, user booking interactions, and automatic time-based state changes for the Dog Week calendar.

---

## Visual Storyboard

**State Transition Flow:**

![Walk State Transitions](Storyboards/walk-state-transitions.jpg)

**Key:** This storyboard shows all 6 walk states and the triggers that cause transitions between them.

---

## State Definitions

### State 1: WHITE (Empty / Available)

**Visual Reference:** Storyboard Frame 1

**Appearance:**

- White background
- Dog avatar only (no user avatar)
- Time range: "8-11"
- Action button: "Book" / "Boka"

**Triggers:**

- Initial state for all unbooked slots
- Appears when walk is unbooked

**Transitions:**

- User clicks "Book" → GRAY (Booked)

**Business Rules:**

- Any family member can book
- Booking awards +1 leaderboard point
- Updates week overview quarter circle to gray

---

### State 2: GRAY (Booked / Scheduled)

**Visual Reference:** Storyboard Frame 2

**Appearance:**

- Gray background
- Dog avatar + User avatar overlay
- Names: "Rufus & Patrick"
- Time range: "8-11"
- No action button (tap card for details)

**Triggers:**

- User books empty slot (WHITE → GRAY)
- Walk is scheduled but time window not yet open

**Transitions:**

- Time window opens (8:00 arrives) → ORANGE (Countdown)
- User unbooks walk → WHITE (Empty)

**Business Rules:**

- Shows who booked the walk
- Tap card to view details/unbook
- Leaderboard point already awarded

---

### State 3: ORANGE (Window Open / Countdown)

**Visual Reference:** Storyboard Frame 3

**Appearance:**

- Orange background
- Dog avatar only (user avatar removed)
- Countdown timer: "32 min left" / "32 min kvar"
- Warning icon: ⚠️
- Action button: "Start" / "Starta"

**Triggers:**

- Scheduled time arrives (8:00) → GRAY to ORANGE
- Real-time countdown updates every minute

**Transitions:**

- User clicks "Start" → BLUE (In Progress)
- Countdown reaches 0 (11:00) → RED (Missed)

**Business Rules:**

- Countdown shows time remaining in window
- Urgency indicator (warning icon)
- Can only start if no other walk active for this dog

---

### State 4: BLUE (In Progress / Active Walk)

**Visual Reference:** Storyboard Frame 4

**Appearance:**

- Blue background
- Dog avatar + User avatar overlay
- Status: "Started 09:32 • 23 min ago"
- Refresh icon: ↻
- No action button (tap card for completion)

**Triggers:**

- User starts walk (ORANGE → BLUE)
- Real-time duration updates every minute

**Transitions:**

- User completes walk → GREEN (Completed)

**Business Rules:**

- Blocks other walks for this dog
- Shows elapsed time since start
- Tap card to complete walk or view progress

---

### State 5: GREEN (Completed)

**Visual Reference:** Storyboard Frame 5

**Appearance:**

- Green background
- Dog avatar + User avatar overlay
- Duration: "32 min walk" / "32 min promenad"
- Checkmark icon: ✓
- No action button

**Triggers:**

- User completes active walk (BLUE → GREEN)

**Transitions:**

- None (final successful state)

**Business Rules:**

- Permanent record of completed walk
- Shows actual walk duration
- Unblocks dog for next walk

---

### State 6: RED (Missed / Overdue)

**Visual Reference:** Storyboard Frame 6

**Appearance:**

- Red background
- Dog avatar only (no user avatar)
- Message: "No walk registered" / "Ingen promenad registrerad"
- Minus icon: ⊖
- No action button

**Triggers:**

- Countdown expires without walk being started (ORANGE → RED)

**Transitions:**

- None (permanent accountability record)

**Business Rules:**

- Cannot be changed or deleted
- Leaderboard point remains (no penalty)
- Shows who booked but didn't complete

---

## Interaction Flows

### Flow 1: Successful Walk Booking & Completion

**Storyboard:** `Storyboards/booking-flow.jpg`

**Steps:**

1. **User views empty slot** (WHITE state)
   - Sees "Book" button
2. **User taps "Book"**
   - System validates user is family member
   - System creates booking record
3. **Immediate updates:**
   - Card → GRAY state
   - Leaderboard: User +1 point
   - Week overview: Quarter circle → gray
4. **Time window opens** (8:00 arrives)
   - Card → ORANGE state
   - Countdown timer starts
5. **User taps "Start"**
   - System validates no other active walk for dog
   - System records start time
6. **Immediate updates:**
   - Card → BLUE state
   - Duration counter starts
   - Other walks for dog → disabled
7. **User completes walk** (via Walk Details page)
   - System records completion time
   - System calculates duration
8. **Immediate updates:**
   - Card → GREEN state
   - Week overview: Quarter circle → green
   - Other walks for dog → re-enabled

---

### Flow 2: Missed Walk

**Storyboard:** `Storyboards/missed-walk-flow.jpg`

**Steps:**

1. Walk booked (GRAY state)
2. Time window opens (ORANGE state)
3. Countdown timer runs
4. User doesn't start walk
5. Countdown reaches 0 (11:00)
6. **Automatic transition:** ORANGE → RED
7. Permanent missed walk record created

---

### Flow 3: Multi-Component Sync

**Storyboard:** `Storyboards/calendar-sync-flow.jpg`

**Components Involved:**

- Week Overview (top section)
- Leaderboard (middle section)
- Booking Calendar (bottom section)

**Sync Flow:**

1. User books walk in calendar
2. **Sync 1:** Week overview quarter circle updates
3. **Sync 2:** Leaderboard count increments
4. User starts walk
5. **Sync 3:** Week overview quarter circle changes color
6. User completes walk
7. **Sync 4:** Week overview quarter circle turns green

---

## State Machine Diagram
```

                    ┌─────────────┐
                    │   WHITE     │
                    │   (Empty)   │
                    └──────┬──────┘
                           │ User books
                           ▼
                    ┌─────────────┐
                    │    GRAY     │
                    │  (Booked)   │
                    └──────┬──────┘
                           │ Time arrives
                           ▼
                    ┌─────────────┐
                    │   ORANGE    │◄──── Countdown timer
                    │ (Countdown) │      updates every 1 min
                    └──┬───────┬──┘
                       │       │
        User starts    │       │ Countdown expires
                       │       │
                       ▼       ▼
                ┌─────────┐ ┌─────────┐
                │  BLUE   │ │   RED   │
                │(Active) │ │(Missed) │
                └────┬────┘ └─────────┘
                     │           │
      User completes │           │ Permanent
                     │           │ record
                     ▼           ▼
                ┌─────────┐   [END]
                │  GREEN  │
                │(Complete)│
                └─────────┘
                     │
                     ▼
                   [END]

```

---

## Storyboard Creation Guidelines

### When to Create Storyboards

Create storyboards for:
- ✅ Components with 3+ states
- ✅ Time-based transitions (countdowns, timers)
- ✅ Multi-step user flows
- ✅ Complex interactions between multiple components
- ✅ State machines with branching paths

Don't need storyboards for:
- ❌ Simple buttons (hover, active states)
- ❌ Static content sections
- ❌ Single-state components

### Storyboard Format

**Hand-drawn sketches** (recommended):
- Quick to create
- Easy to iterate
- Focus on functionality, not polish
- Example: Dog Week `App-Main-Booking-States.jpg`

**Digital wireframes:**
- Use Figma, Sketch, or similar
- More polished for client presentations
- Easier to update

**Annotated screenshots:**
- Use actual prototype screenshots
- Add arrows and labels
- Good for documenting existing systems

### Storyboard Numbering

Number frames sequentially:
```

1. Initial state
2. After user action
3. System response
4. Next state
5. Alternative path

````

### Storyboard Annotations

Include:
- **State names** (e.g., "ORANGE - Countdown")
- **Trigger descriptions** (e.g., "User taps Start")
- **Time indicators** (e.g., "After 32 minutes")
- **Icons/symbols** for actions (→ for transitions, ⚠️ for warnings)

---

## Feature File Template with Storyboard

```markdown
# {Feature Name} Feature

**Feature ID:** `{feature-id}`
**Type:** {State Machine / Workflow / Calculator / etc.}
**Complexity:** {Low / Medium / High}

## Purpose

{Brief description of what this feature does}

---

## Visual Storyboard

**{Storyboard Type}:**

![{Storyboard Name}](Storyboards/{storyboard-file}.jpg)

**Key:** {Brief explanation of what the storyboard shows}

---

## State Definitions

{If applicable - for state machines}

### State 1: {State Name}

**Visual Reference:** Storyboard Frame {number}

**Appearance:**
- {Visual description}

**Triggers:**
- {What causes this state}

**Transitions:**
- {What states this can transition to}

**Business Rules:**
- {Rules governing this state}

---

## Interaction Flows

### Flow 1: {Flow Name}

**Storyboard:** `Storyboards/{flow-storyboard}.jpg`

**Steps:**
1. {Step description}
2. {Step description}
3. {Step description}

---

## State Machine Diagram

{ASCII diagram showing state transitions}

---

## Data Requirements

{API endpoints, data models, etc.}

---

## Validation Rules

{Business rules, constraints, etc.}

---

## Error Handling

{Error states, recovery flows, etc.}
````

---

## Dog Week Example: Complete Structure

```
Features/
├─ walk-booking-logic.feature.md
│  ├─ References: Storyboards/walk-state-transitions.jpg
│  ├─ Contains: 6 state definitions
│  └─ Contains: State machine diagram
│
├─ calendar-sync.feature.md
│  ├─ References: Storyboards/calendar-sync-flow.jpg
│  └─ Contains: Multi-component interaction flows
│
└─ Storyboards/
   ├─ walk-state-transitions.jpg       ← Main state storyboard
   ├─ booking-flow.jpg                 ← Successful booking flow
   ├─ missed-walk-flow.jpg             ← Missed walk scenario
   ├─ calendar-sync-flow.jpg           ← Component sync flow
   └─ week-navigation-flow.jpg         ← Week navigation interactions
```

---

## Benefits of Storyboard Integration

### 1. Visual Clarity

**Before (Text only):**

```
When the user books a walk, the card changes to gray,
the leaderboard updates, and the week overview changes.
```

**After (With storyboard):**

```
See Storyboard Frame 2-3 for visual state transition.
```

### 2. Developer Understanding

Developers can:

- See exact visual states
- Understand transition triggers
- Identify edge cases visually
- Reference storyboard during implementation

### 3. Design Consistency

Designers can:

- Ensure all states are visually distinct
- Verify state transitions make sense
- Spot missing states or transitions
- Create Figma components matching storyboard

### 4. QA Testing

QA can:

- Use storyboard as test script
- Verify all states are implemented
- Test all transition paths
- Identify missing functionality

---

## Workflow Integration

### Step 1: Sketch Storyboard

During UX design phase:

1. Identify complex interactive components
2. Sketch state transitions on paper/whiteboard
3. Number frames sequentially
4. Add annotations for triggers and transitions
5. Take photo or scan

### Step 2: Store Storyboard

```
Features/Storyboards/{component-name}-{type}.jpg
```

### Step 3: Reference in Feature File

```markdown
## Visual Storyboard

![Walk State Transitions](Storyboards/walk-state-transitions.jpg)
```

### Step 4: Document States

For each frame in storyboard:

- Create state definition
- Link to storyboard frame number
- Describe triggers and transitions

### Step 5: Create State Machine

Convert storyboard to ASCII state machine diagram for quick reference

---

## Summary

**Storyboards are essential for:**

- 🎯 Complex state machines (calendars, booking systems)
- 🎯 Multi-step workflows (onboarding, checkout)
- 🎯 Time-based interactions (countdowns, timers)
- 🎯 Multi-component synchronization

**Store storyboards in:**

- `Features/Storyboards/` folder
- Reference from Feature files
- Link to specific frames in state definitions

**Benefits:**

- ✅ Visual clarity for developers
- ✅ Design consistency
- ✅ QA test scripts
- ✅ Stakeholder communication
- ✅ Documentation that doesn't get stale

**Result:** Complex component functionality is documented visually and textually, making implementation and testing straightforward.
