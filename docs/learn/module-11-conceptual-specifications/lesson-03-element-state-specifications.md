# Module 11: Conceptual Specifications

## Lesson 3: Element & State Specifications

**Deep dive on Layers 4 & 5 — Complete implementation details**

---

## The Final Layers

You've specified pages, sections, and widgets. Now you document the details that developers implement:

- **Layer 4: Cards** — Content grouping patterns
- **Layer 5: Elements** — Individual UI pieces with complete state coverage

These are the most detailed specifications. Get them right, and developers build exactly what you envisioned.

---

## Card-Level Specifications (Layer 4)

Cards group related content into repeatable patterns.

### What Cards Define

```
Widget-Level:   "Task list widget displays user tasks"
                ↓
Card-Level:     "Each task card shows title, assignee,
                 due date, status, and action buttons"
```

Cards answer:
- **What content pattern does this represent?**
- **What data structure feeds it?**
- **How many instances appear?**
- **Is it interactive?**

---

## Card Specification Pattern

```markdown
## Card: [Card Name]
**ID:** [Parent-ID]-[Card-ID]

### Purpose
[What this card displays/represents]

### Data Structure
[Schema or data shape that feeds this card]

### Instances
[Single/Template/Fixed count]

### Interaction
[Static/Clickable/Expandable/Draggable]

### States
[If interactive, document states]

### Content Slots
[What content areas exist]

### Layout
[Visual arrangement of elements]

### Contains
[List child elements]
```

---

## Card Example: Task Card

```markdown
## Card: Task Card
**ID:** W01-C01-task-card

### Purpose
Display one task with key information and actions.
Allow quick status updates and task access.

### Data Structure
```json
{
  "id": "string (UUID)",
  "title": "string (max 100 chars)",
  "assignee": {
    "id": "string",
    "name": "string",
    "avatar": "string (URL)"
  },
  "dueDate": "ISO 8601 date string",
  "status": "enum (pending|in_progress|completed)",
  "priority": "enum (low|medium|high)"
}
```

### Instances
Template card, rendered once per task (dynamic count)

### Interaction
- Clickable: Yes (entire card navigates to task detail)
- Expandable: No
- Draggable: Yes (for reordering in list)

### States
- Default: White background, normal text
- Hover: Light gray background (#F3F4F6)
- Pressed: Slight scale down (0.98)
- Dragging: Lifted appearance (shadow), slightly rotated
- Overdue: Red accent border when past due date
- Completed: Strikethrough title, muted colors

### Content Slots
- Priority indicator (left edge, colored bar)
- Title text
- Assignee avatar + name
- Due date
- Status badge
- Quick action menu (three dots, right edge)

### Layout
```
┌────────────────────────────────────┐
│ ┃ [Title Text]           [•••]    │
│ ┃                                  │
│ ┃ [👤 Assignee]  [📅 Date]  [●]   │
└────────────────────────────────────┘
 ↑                               ↑
Priority                      Status
```

### Contains
- E01: Priority Bar
- E02: Task Title
- E03: Assignee Avatar
- E04: Assignee Name
- E05: Due Date Label
- E06: Status Badge
- E07: Action Menu Button
```

---

## Card Example: Feature Card

```markdown
## Card: Feature Card
**ID:** P01-S04-C01-feature-card

### Purpose
Highlight one product feature to build trust before signup.

### Data Structure
```json
{
  "icon": "string (icon identifier)",
  "title": "string (max 50 chars)",
  "description": "string (max 120 chars)"
}
```

### Instances
Template, rendered 3 times with fixed data

### Interaction
Static (not clickable)

### States
N/A (no interactive states)

### Content Slots
- Icon (centered, 48x48px)
- Title (centered, h3)
- Description (centered, body text)

### Layout
```
┌─────────────────┐
│                 │
│      [Icon]     │
│                 │
│   Feature Title │
│                 │
│   Description   │
│   text goes     │
│   here          │
│                 │
└─────────────────┘
```

### Contains
- E01: Feature Icon
- E02: Feature Title
- E03: Feature Description
```

---

## Element-Level Specifications (Layer 5)

Elements are the atomic UI pieces: buttons, inputs, labels, icons.

### What Elements Define

```
Card-Level:     "Task card contains title, assignee, status"
                ↓
Element-Level:  "Status badge has 3 states: pending (gray),
                 in_progress (blue), completed (green),
                 with specific text and aria-label for each"
```

Elements answer:
- **What are ALL possible states?**
- **What is the EXACT content?**
- **What ARIA attributes apply?**
- **How does it behave on interaction?**
- **What are the translations?**

---

## Element Specification Pattern

```markdown
## Element: [Element Name]
**ID:** [Full-Hierarchy-ID]

### Type
[Button/Input/Label/Icon/Link/Text/etc.]

### States
[Every possible state with complete description]

### Content
- Label: "[Exact text]"
- Placeholder: "[Exact text if applicable]"
- Translations: [All supported languages]

### ARIA
[All ARIA attributes for each state]

### Behavior
[What happens on interaction]

### Visual
[Colors, sizes, spacing if critical to specification]
```

---

## Element Example: Submit Button

```markdown
## Element: Submit Button
**ID:** P01-S03-W01-E05-submit-button

### Type
Button (primary action)

### States

#### Default
- Label: "Create Free Account"
- Appearance: Blue background (#2563EB), white text
- Cursor: Pointer
- Enabled: Yes
- aria-disabled: "false"

#### Hover
- Appearance: Darker blue (#1E40AF)
- Transition: 150ms ease
- Everything else: Same as default

#### Active (pressed)
- Appearance: Even darker blue (#1E3A8A)
- Scale: 0.98 (slight press effect)

#### Disabled
- Label: "Create Free Account"
- Appearance: Gray background (#D1D5DB), gray text (#6B7280)
- Cursor: Not-allowed
- Enabled: No
- aria-disabled: "true"
- Reason: Form validation incomplete

#### Loading
- Label: [Hidden, replaced by spinner]
- Appearance: Blue background, spinner centered
- Cursor: Wait
- Enabled: No (can't click during submit)
- aria-busy: "true"
- aria-label: "Creating account, please wait"

#### Success (brief)
- Label: [Hidden, replaced by checkmark ✓]
- Appearance: Green background (#10B981)
- Duration: 1.5s visible, then redirect
- aria-label: "Account created successfully"

#### Error (server error)
- Returns to Default state
- Error message appears above form (not on button)

### Content

**English:**
- Label: "Create Free Account"
- Loading: aria-label "Creating account, please wait"
- Success: aria-label "Account created successfully"

**Spanish:**
- Label: "Crear Cuenta Gratuita"
- Loading: aria-label "Creando cuenta, por favor espere"
- Success: aria-label "Cuenta creada exitosamente"

**German:**
- Label: "Kostenloses Konto erstellen"
- Loading: aria-label "Konto wird erstellt, bitte warten"
- Success: aria-label "Konto erfolgreich erstellt"

### ARIA

**Default/Hover/Active:**
- role: "button" (implicit from <button>)
- type: "submit"
- aria-label: Not needed (label is visible)
- aria-disabled: "false"

**Disabled:**
- aria-disabled: "true"
- aria-describedby: Points to validation error if specific reason

**Loading:**
- aria-busy: "true"
- aria-label: "Creating account, please wait"
- aria-live: "polite" (announces state change)

**Success:**
- aria-label: "Account created successfully"
- aria-live: "polite" (announces success)

### Behavior

**On Click (when enabled):**
1. Trigger form validation
2. If invalid: Prevent submit, focus first error field
3. If valid: Change to Loading state
4. Submit form data to server
5. On success response: Change to Success state (1.5s), then redirect
6. On error response: Return to Default, show error message above form

**On Enter key (when focused):**
Same as click behavior

### Visual
- Height: 48px (comfortable touch target)
- Width: 100% of form width (mobile), min 200px (desktop)
- Border radius: 8px
- Font: 16px, semi-bold
- Padding: 12px 24px
```

---

## Element Example: Email Input Field

```markdown
## Element: Email Input Field
**ID:** P01-S03-W01-E01-email-field

### Type
Text input (email)

### States

#### Default (empty)
- Placeholder: "you@example.com"
- Border: 1px gray (#D1D5DB)
- Background: White
- Label: "Email" (above field)
- Value: ""
- aria-invalid: "false"

#### Focused (user clicks in)
- Border: 2px blue (#2563EB)
- Placeholder: Fades to 50% opacity
- Focus ring: 2px blue outline, 2px offset
- All else: Same as default

#### Typing (user entering text)
- Shows typed characters
- Placeholder: Hidden
- Validation: Not yet triggered
- All else: Same as focused

#### Valid (after blur, email format correct)
- Border: 1px green (#10B981)
- Success icon: Green checkmark appears (right side)
- aria-invalid: "false"
- All else: Same as default

#### Invalid - Format (after blur, email format incorrect)
- Border: 2px red (#DC2626)
- Error message: "Please enter a valid email address" (below field)
- Error icon: Red X appears (right side)
- aria-invalid: "true"
- aria-describedby: "email-error"

#### Invalid - Taken (async check, email already registered)
- Border: 2px red (#DC2626)
- Error message: "This email is already registered. [Log in instead →]" (below field)
- Error icon: Red X appears
- aria-invalid: "true"
- aria-describedby: "email-error"
- Link: "Log in instead" navigates to login page

#### Disabled (during form submission)
- Background: Light gray (#F3F4F6)
- Text: Gray (#6B7280)
- Cursor: Not-allowed
- Editable: No
- aria-disabled: "true"

### Content

**English:**
- Label: "Email"
- Placeholder: "you@example.com"
- Error (format): "Please enter a valid email address"
- Error (taken): "This email is already registered. [Log in instead →]"
- Helper text: None

**Spanish:**
- Label: "Correo electrónico"
- Placeholder: "tu@ejemplo.com"
- Error (format): "Por favor, introduce una dirección de correo válida"
- Error (taken): "Este correo ya está registrado. [Iniciar sesión →]"

**German:**
- Label: "E-Mail"
- Placeholder: "du@beispiel.com"
- Error (format): "Bitte geben Sie eine gültige E-Mail-Adresse ein"
- Error (taken): "Diese E-Mail ist bereits registriert. [Anmelden →]"

### ARIA

**Default:**
- role: "textbox" (implicit)
- type: "email"
- id: "email-field"
- aria-label: "Email address for your account"
- aria-required: "true"
- aria-invalid: "false"
- autocomplete: "email"

**Invalid:**
- aria-invalid: "true"
- aria-describedby: "email-error"
- Error element: id="email-error", role="alert"

**Disabled:**
- aria-disabled: "true"

### Behavior

**On Focus:**
- Border becomes blue
- Placeholder fades
- Cursor appears in field

**On Blur (user leaves field):**
1. Validate email format (regex check)
2. If invalid format: Show format error
3. If valid format: Start async check (debounced 1s)
4. Async check: Verify email not already registered
5. If taken: Show "already registered" error with login link
6. If available: Show green checkmark

**On Change (while typing):**
- Real-time character entry
- No validation until blur (except clearing previous errors)

**On Paste:**
- Accept pasted text
- Trigger validation after paste completes

### Visual
- Height: 48px
- Width: 100% of form width
- Border radius: 8px
- Font: 16px (prevents zoom on iOS)
- Padding: 12px 16px
- Error message: 14px, red (#DC2626), 4px below field
```

---

## All States Matter

Every element needs complete state documentation:

### Button States Checklist

- [ ] Default
- [ ] Hover
- [ ] Active (pressed)
- [ ] Focused (keyboard navigation)
- [ ] Disabled
- [ ] Loading
- [ ] Success (if applicable)
- [ ] Error (if applicable)

### Input States Checklist

- [ ] Default (empty)
- [ ] Focused
- [ ] Typing
- [ ] Valid
- [ ] Invalid (with all error types)
- [ ] Disabled
- [ ] Read-only (if applicable)

### Link States Checklist

- [ ] Default
- [ ] Hover
- [ ] Active (pressed)
- [ ] Visited (if applicable)
- [ ] Focused

**The rule: If developers might ask "What happens when...", you need a state for it.**

---

## Edge Cases

Document what happens when things go wrong or unusual:

```markdown
## Edge Cases for Form Submission

### Email Already Exists
- **Trigger:** Server returns 409 Conflict
- **Display:** Error below email field: "This email is already registered. [Log in instead →]"
- **Action:** Link navigates to login page
- **Recovery:** User can try different email or click link to login
- **State:** Form re-enabled, focus stays on email field

### Network Error
- **Trigger:** Request times out (>10s) or connection fails
- **Display:** Error banner above form: "Connection lost. Your data is saved."
- **Action:** [Retry] button appears
- **Recovery:** Click Retry resubmits with same data (not lost)
- **State:** Form re-enabled

### Rate Limited
- **Trigger:** Too many signup attempts from IP
- **Display:** Error banner: "Too many attempts. Try again in 5 minutes."
- **Action:** Countdown timer visible (5:00, 4:59, 4:58...)
- **Recovery:** Wait for timer, form re-enables when timer expires
- **State:** Form disabled during countdown

### Browser Back Button During Submit
- **Trigger:** User clicks browser back while form is submitting
- **Display:** Browser confirms: "Are you sure? Form submission in progress."
- **Recovery:** If user proceeds back, request is cancelled
- **State:** Form data lost (unless browser preserves it)

### JavaScript Disabled
- **Trigger:** User has JavaScript disabled
- **Display:** Form still renders, no client-side validation
- **Behavior:** Server-side validation handles everything
- **Recovery:** Server returns page with errors highlighted
- **State:** Progressive enhancement - works without JS
```

---

## Empty States

Every collection can be empty. Document what users see:

```markdown
## Task List Empty State

**When:** User has no tasks assigned

**Display:**
- Illustration: Simple line drawing of empty checklist
- Headline: "No tasks yet"
- Subtext: "Tasks will appear here when they're assigned to you"
- Action: [Browse all household tasks] button
- Alternative: If user can create tasks: [Create your first task] button

**Why:** Reduces confusion, sets expectation, provides next action

**Visual:**
```
┌─────────────────────────────────┐
│                                 │
│           [Empty                │
│            checklist            │
│            illustration]        │
│                                 │
│         No tasks yet            │
│                                 │
│   Tasks will appear here when   │
│   they're assigned to you       │
│                                 │
│   [Browse all household tasks]  │
│                                 │
└─────────────────────────────────┘
```

**ARIA:**
- Container: role="status" (announces to screen readers)
- aria-label: "No tasks assigned"
```

---

## Loading States

Document what users see while data loads:

```markdown
## Dashboard Loading State

**Duration:** Typically 0-3 seconds

**Skeleton Structure:**
- Header: Static (user info visible, loaded from auth)
- Task section: 3 skeleton cards (gray shimmer rectangles)
- Calendar section: Skeleton grid matching final layout
- Sidebar: Skeleton menu items

**Animation:**
- Shimmer effect: Light sweep left-to-right
- Duration: 1.5s loop
- Color: Gray (#E5E7EB) to lighter gray (#F3F4F6)

**Fallback:**
- If loading exceeds 5 seconds: Show "Taking longer than expected..."
- Action: [Refresh] button appears
- Why: Network issue or slow connection

**Error State:**
- If load fails: "Couldn't load dashboard"
- Message: "Something went wrong. Please try again."
- Action: [Retry] button
- Alternative: "If problem persists, [contact support]"

**Visual Comparison:**

```
LOADING                          LOADED
┌────────────────────┐          ┌────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓        │          │ Walk Max at 3pm    │
│ ▓▓▓▓              │          │ Assigned: Alice    │
│                    │          │ Due: Today         │
├────────────────────┤          ├────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓        │          │ Buy dog food       │
│ ▓▓▓▓              │          │ Assigned: Bob      │
│                    │          │ Due: Tomorrow      │
└────────────────────┘          └────────────────────┘
```

**Accessibility:**
- aria-busy="true" on loading container
- aria-live="polite" announces when loaded
- Screen reader: "Loading tasks..." → "3 tasks loaded"
```

---

## Content Specifications

Go beyond just listing text. Specify tone, constraints, and variations:

```markdown
## Error Message Content Standards

### Tone
- Helpful, not blaming
- Use "Please" for requests
- Avoid "Invalid", "Error", "Wrong"
- Offer solutions when possible

### Format
- Sentence case (not ALL CAPS)
- Period at end if complete sentence
- No period if fragment
- Link format: [Action text →]

### Validation Error Table

| Field | Condition | Message | Link |
|-------|-----------|---------|------|
| Email | Empty | "Email is required" | None |
| Email | Invalid format | "Please enter a valid email address" | None |
| Email | Already exists | "This email is already registered." | [Log in instead →] |
| Password | Empty | "Password is required" | None |
| Password | Too short | "Password must be at least 8 characters" | None |
| Password | No number | "Include at least one number" | None |
| Name | Empty | "Name is required" | None |
| Name | Too long | "Name must be under 50 characters" | None |

### System Error Messages

| Scenario | Message | Action |
|----------|---------|--------|
| Network timeout | "Connection lost. Your data is saved." | [Retry] |
| Server error (5xx) | "Something went wrong. Please try again." | [Retry] |
| Rate limit | "Too many attempts. Try again in {time}." | Timer countdown |
| Maintenance mode | "We're performing maintenance. Back soon!" | None |

### Position
- Field errors: 4px below field, left-aligned
- Form errors: Above form, full width, with icon
- System errors: Top of page, banner style, dismissible
```

---

## Timing and Animation

When timing matters, specify it precisely:

```markdown
## Modal Dialog Timing

### Opening Animation
- Duration: 200ms
- Easing: ease-out
- Sequence:
  1. Backdrop fades in: 0% → 60% opacity
  2. Modal scales + fades: scale(0.95) opacity(0) → scale(1) opacity(1)
  3. Both complete simultaneously

### Closing Animation
- Duration: 150ms
- Easing: ease-in
- Sequence:
  1. Modal fades out + scales down
  2. When modal reaches 50% opacity: Backdrop starts fade out
  3. Both complete, modal removed from DOM

### Auto-Dismiss (Success Message)
- Visible duration: 3 seconds
- Fade out: Last 300ms
- Total time on screen: 3.3s
- User can dismiss early by clicking X

### Delayed Appearance (Loading Spinner)
- Delay: 300ms
- Why: Don't flash spinner for quick operations
- If operation completes < 300ms: No spinner shown
- If operation > 300ms: Spinner appears

### Debounced Validation
- Delay: 1000ms after last keystroke
- Why: Don't validate while actively typing
- Triggers: After user stops typing for 1 second
- Example: Email availability check
```

---

## Accessibility Attributes in Detail

Complete ARIA specification for complex elements:

```markdown
## Dropdown Menu ARIA Specification

### Trigger Button

```html
<button
  id="user-menu-button"
  type="button"
  aria-haspopup="true"
  aria-expanded="false"  <!-- Changes to "true" when open -->
  aria-controls="user-menu-list"
  aria-label="User menu">
  [User Avatar] John Doe ▼
</button>
```

### Dropdown Container (when open)

```html
<ul
  id="user-menu-list"
  role="menu"
  aria-labelledby="user-menu-button"
  aria-orientation="vertical">

  <li role="none">
    <a role="menuitem" href="/profile">Profile</a>
  </li>

  <li role="none">
    <a role="menuitem" href="/settings">Settings</a>
  </li>

  <li role="separator"></li>

  <li role="none">
    <button role="menuitem" type="button" onclick="logout()">
      Log out
    </button>
  </li>
</ul>
```

### Focus Management
1. When opened: Focus moves to first menu item
2. Arrow Down: Next menu item
3. Arrow Up: Previous menu item
4. Home: First menu item
5. End: Last menu item
6. Escape: Close menu, return focus to trigger
7. Tab: Close menu, move focus to next focusable element
8. Click outside: Close menu, focus stays where clicked

### Screen Reader Announcements
- Button: "User menu, button, collapsed"
- Opens: "User menu, menu, 4 items"
- Each item: "Profile, menu item" / "Settings, menu item" / etc.
- Closes: "User menu, button, collapsed"
```

---

## Translation Planning

Document content in all supported languages:

```markdown
## Task Status Badge Translations

### English
- pending: "Pending"
- in_progress: "In Progress"
- completed: "Completed"
- overdue: "Overdue"

### Spanish
- pending: "Pendiente"
- in_progress: "En Progreso"
- completed: "Completado"
- overdue: "Atrasado"

### German
- pending: "Ausstehend"
- in_progress: "In Bearbeitung"
- completed: "Abgeschlossen"
- overdue: "Überfällig"

### French
- pending: "En attente"
- in_progress: "En cours"
- completed: "Terminé"
- overdue: "En retard"

### Text Expansion Considerations
- English "Pending" (7 chars)
- German "Ausstehend" (10 chars) — 43% longer
- Design must accommodate ±40% expansion
- Badge width: Min 80px to handle longest translation
```

---

## Completeness Checklist

Use this to verify each element specification:

### For Every Element:

**States:**
- [ ] All possible states documented
- [ ] State transitions specified
- [ ] Default state clearly identified
- [ ] Edge case states covered

**Content:**
- [ ] Real text (not lorem ipsum)
- [ ] All labels written
- [ ] All error messages written
- [ ] All helper text written
- [ ] Translations provided (all supported languages)

**Accessibility:**
- [ ] ARIA role specified (if not semantic HTML)
- [ ] aria-label provided (where needed)
- [ ] aria-required for required fields
- [ ] aria-invalid for validation states
- [ ] aria-describedby for error messages
- [ ] Focus management specified
- [ ] Keyboard interactions documented
- [ ] Screen reader behavior described

**Behavior:**
- [ ] Click/tap behavior defined
- [ ] Keyboard behavior defined
- [ ] Validation timing specified
- [ ] Animation timing specified (if applicable)
- [ ] What triggers state changes

**Visual (if critical):**
- [ ] Colors specified (with hex codes)
- [ ] Sizes specified (touch targets 44px+)
- [ ] Spacing specified (if precise)
- [ ] Responsive behavior noted

---

## The Test

**Your element specification is complete when:**

✅ A developer can build it without asking questions
✅ A translator can extract all content
✅ A tester can verify every state
✅ An accessibility auditor can validate ARIA
✅ A designer can recreate it 6 months later

**If any role needs to guess, the spec is incomplete.**

---

## What's Next

In the tutorial, you'll practice writing complete specifications with Freya guiding you through each section. She'll ensure nothing is missed.

---

**[Continue to Tutorial: Write Your Specifications →](tutorial-11.md)**

---

[← Back to Lesson 2](lesson-02-section-widget-specifications.md) | [Back to Module Overview](module-11-conceptual-specifications-overview.md)

*Part of Module 11: Conceptual Specifications*
