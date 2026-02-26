# Module 16: Design Delivery

## Lesson 1: Validation and Packaging

**Ensuring everything is complete and packaging for handoff**

---

## Two Steps Before Handoff

Before any design work leaves your hands, it goes through two steps:

1. **Validate** — Is everything complete? Are there gaps?
2. **Package** — Create the DD file and test scenario

Gaps found during development are expensive. Gaps found during validation are cheap.

---

## Step 1: Validate

### The Completeness Check

Before creating a Design Delivery, verify the flow is truly complete. Freya helps run this audit.

**Is it a complete flow?**

- [ ] Entry point is clear (where does the user start?)
- [ ] Exit point is clear (where does the user end up?)
- [ ] Every screen in between is fully specified
- [ ] The flow delivers real user value on its own

**Are all pages specified?**

- [ ] All elements documented with Object IDs
- [ ] All states defined (default, hover, loading, error, empty)
- [ ] All content written — no placeholder text, no "lorem ipsum"
- [ ] All interactions described (what happens when user clicks, types, scrolls)
- [ ] Error states handled with specific error messages
- [ ] Loading states defined
- [ ] Empty states defined

**Is it traceable?**

- [ ] Every element connects to the Trigger Map
- [ ] Personas referenced
- [ ] Driving forces addressed
- [ ] Features linked
- [ ] Business goals traceable

**Is it unambiguous?**

- [ ] Consistent terminology throughout
- [ ] No vague descriptions ("appropriate", "suitable", "nice")
- [ ] Accessibility considered (contrast, touch targets, focus order)
- [ ] Visual design matches specification

**Is it testable?**

- [ ] Acceptance criteria defined for every interaction
- [ ] Success states clear
- [ ] Error conditions specified with exact messages
- [ ] Expected behaviors documented

---

### The Freya Audit

Ask Freya to audit your specifications. She reads through every page in the flow and flags issues:

> "Auditing S01-User-Registration..."

> "Page P02 is missing the error state for network timeout."

> "Element signup-button has no Object ID — should be 'signup-submit-btn'."

> "This spec says 'appropriate error message' — what's the actual text?"

> "Page P03 references a 'Continue' button but the specification doesn't describe what happens when it's clicked."

She finds gaps before developers do.

### Common Gaps

| Gap Type | Example | Fix |
|----------|---------|-----|
| Missing state | No loading state for form submission | Add loading specification |
| Vague content | "Show error message" | Write exact error text |
| No Object ID | Button without identifier | Add consistent ID |
| Disconnected | Feature not linked to Trigger Map | Add connection |
| Missing edge case | What if network fails? | Document recovery path |
| Incomplete flow | Signup works but no email verification | Add verification screens |

---

## Step 2: Create the Design Delivery

Once validation passes, create the DD file. This is the contract that tells development exactly what to build.

### The DD-XXX.yaml File

Each delivery follows the standard template. Here's what goes into each section:

```yaml
delivery:
  id: "DD-001"
  name: "User Registration"
  type: "user_flow"           # user_flow | feature | component
  status: "ready"             # ready | in_progress | blocked
  priority: "high"            # high | medium | low
```

**Delivery metadata.** The ID follows the format DD-001, DD-002, etc. Status should be "ready" when you're done validating.

---

```yaml
description: |
  First-time user signup flow from landing page
  through registration to welcome dashboard.
  Includes email/password signup, real-time validation,
  and immediate access to the product.
```

**What this delivery contains.** One paragraph that gives development the full picture.

---

```yaml
user_value:
  problem: "Users need to create an account to access the product"
  solution: "Simple email + password signup with immediate access"
  success_criteria:
    - "User can register in under 2 minutes"
    - "Zero confusion on required fields"
    - "Immediate access after registration"
```

**Why this matters.** Developers build better when they understand the user problem they're solving.

---

```yaml
design_artifacts:
  scenarios:
    - id: "01-user-registration"
      path: "C-UX-Scenarios/01-user-registration/"
      screens: ["landing", "signup-form", "email-verification", "welcome"]

  user_flows:
    - name: "Registration Flow"
      path: "C-UX-Scenarios/flows/registration.excalidraw"
      entry: "landing"
      exit: "welcome"

  design_system:
    components:
      - "Button (primary, secondary, loading)"
      - "Input (text, email, password with toggle)"
      - "FormField (label, input, helper, error)"
    path: "D-Design-System/"
```

**What's included.** References to your scenarios, user flows, and components. These are paths to the actual files — not copies of the content.

---

```yaml
technical_requirements:
  platform:
    frontend: "next.js"
    backend: "supabase"

  integrations:
    - name: "authentication-api"
      purpose: "User registration and session management"
      required: true
    - name: "email-service"
      purpose: "Verification emails"
      required: true

  data_models:
    - name: "User"
      fields: ["email", "password_hash", "created_at", "verified"]
```

**What development needs.** Platform info comes from the PRD's technical foundation (Phase 3). If no PRD exists yet, describe what you know.

---

```yaml
acceptance_criteria:
  functional:
    - "User can enter email and password"
    - "Real-time validation shows errors on blur"
    - "Submit button disabled when form is invalid"
    - "Loading state shown during submission"
    - "Redirect to welcome screen on success"
    - "Welcome screen shows user's email"

  non_functional:
    - "Form submission completes under 2 seconds"
    - "WCAG AA contrast compliance on all elements"
    - "Touch targets minimum 44px"
    - "Works on mobile viewports (320px+)"

  edge_cases:
    - "Duplicate email → 'This email is already registered'"
    - "Network error → 'Check your connection' with retry button"
    - "Server error → 'Something went wrong. Please try again.'"
    - "Refresh during submission → no duplicate account created"
    - "Back button from welcome → clean signup form"
```

**How to verify.** Every criterion must be testable — a tester can read this list and check each item without asking you.

---

```yaml
testing_guidance:
  user_testing:
    - "Can a new user complete registration without help?"
    - "Does the validation feel helpful or annoying?"

  qa_testing:
    - "Test all error states trigger correctly"
    - "Verify email verification flow end-to-end"
    - "Test on mobile (iOS Safari, Android Chrome)"

estimated_complexity:
  size: "small"
  effort: "1-2 weeks"
  risk: "low"
  dependencies: []
```

**Testing approach and effort estimate.** Helps development plan their work.

---

## Create the Test Scenario

Alongside the DD file, create a test scenario file (TS-XXX.yaml) that defines:

- Happy path tests (the normal user journey)
- Error state tests (what goes wrong and how to verify handling)
- Edge case tests (unusual but important situations)
- Design system validation (components render correctly)
- Accessibility tests (keyboard, screen reader, contrast)

This file is used by testers in Module 17 to verify the implementation matches your design.

---

## The Handoff Dialog

Before marking a delivery as handed off, sit down with the development team (or the BMad architect agent) for a 20-30 minute handoff dialog.

**What you cover:**

- Walk through the user flow
- Highlight key interactions and states
- Discuss technical requirements
- Agree on epic breakdown (how to split the work)
- Answer questions
- Identify risks or unknowns

**Document the dialog** in a handoff log (`DD-XXX-handoff-log.md`):

```markdown
# Handoff Log: DD-001 User Registration

## Date: 2026-02-15
## Duration: 25 minutes
## Participants: Mårten (designer), Marcus (developer)

## Key Discussion Points
- Agreed on email-first registration (no social login in v1)
- Password strength indicator: nice-to-have, not blocking
- Mobile: must work on 320px viewport

## Epic Breakdown
1. Form UI + validation (3 days)
2. Auth API integration (2 days)
3. Email verification flow (2 days)
4. Welcome screen + redirect (1 day)

## Questions Resolved
- Q: Real-time validation on every keystroke?
  A: No, on blur. Spec updated.

## Action Items
- [ ] Marcus: Set up auth API endpoint
- [ ] Mårten: Add 320px viewport to test scenario
```

---

## Reference, Don't Duplicate

The DD file **references** your design artifacts. It doesn't copy them.

```yaml
design_artifacts:
  scenarios:
    - id: "01-user-registration"
      path: "C-UX-Scenarios/01-user-registration/"    # ← reference
```

This means:
- When specs update, the delivery stays current
- Single source of truth maintained
- No sync issues between documents

---

## After Handoff

Once delivered:

- Mark the DD status as `in_development`
- The development team (or BMad agents) builds from the DD and referenced artifacts
- You continue designing the next flow
- When development is complete, you test the implementation (Module 17)

---

## What's Next

In the tutorial, you'll run the validation checklist on your own specifications and create your delivery package.

---

**[Continue to Tutorial: Create Your Delivery →](tutorial-16.md)**

---

[← Back to Module Overview](module-16-design-delivery-overview.md)

*Part of Module 16: Design Delivery*
