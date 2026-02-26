# Module 16: Design Delivery

**Time: 45 min | Agent: Freya | Phase: UX Design [H] Handover | Focus: Delivery**

---

## Where Design Meets Development

You've designed complete flows — scenarios, specifications, prototypes, visual design. Now you package them for development.

In the BMad method, design deliveries are the bridge between your design work and the development team (or development agents). Each delivery is a **complete, testable flow** — not a single widget or half-finished page, but a full user journey from entry to exit.

---

## What Is a Design Delivery?

A Design Delivery (DD) is a YAML file that acts as a **contract between design and development**. It packages everything needed to build one complete flow:

- What you're delivering and why it matters
- Which scenarios, pages, and components are included
- What technical requirements exist
- How to validate the implementation
- How complex the work is

The DD file doesn't contain the actual design work — it **references** your scenarios, specifications, and design system. One source of truth, no duplication.

---

## Where Deliveries Live

Design deliveries sit alongside the PRD in the `E-PRD` folder:

```
E-PRD/
├── 10-PRD.md                              ← Master PRD document
├── design-deliveries/
│   ├── DD-001-user-registration.yaml      ← Complete flow: signup → welcome
│   ├── DD-001-handoff-log.md              ← Notes from handoff dialog
│   ├── DD-002-dashboard.yaml              ← Complete flow: login → dashboard
│   └── DD-002-handoff-log.md
└── test-scenarios/
    ├── TS-001-user-registration.yaml      ← Tests for DD-001
    └── TS-002-dashboard.yaml              ← Tests for DD-002
```

### How this connects to the PRD

The master PRD (`10-PRD.md`) has a **Section 4: Functional Requirements** that grows as you complete deliveries. Each DD adds its functional requirements to this section, building up the complete product specification over time.

The PRD provides the technical foundation (architecture, APIs, data models). The DD files provide the design specification. Together they give development everything needed to build.

---

## The Rule: Complete and Testable

A design delivery must be a **complete, testable flow**. This means:

- **Complete:** Entry point to exit point, every screen specified
- **Testable:** A tester can verify it works without asking you questions
- **Valuable:** It delivers real user and business value on its own

**Good delivery scope:**
- User registration flow (landing → signup → email verification → welcome)
- Dashboard experience (login → dashboard → key actions)
- Checkout flow (cart → payment → confirmation)

**Bad delivery scope:**
- Just the signup form (not a complete flow)
- A button component (not a flow at all)
- Half the dashboard with placeholder pages

If a flow isn't complete, go back to the design activities in Phase 4 and finish it.

---

## The Delivery Process

In the WDS workflow, design delivery is the **[H] Handover** activity within Phase 4 (UX Design). When Freya detects that a flow is complete, she initiates the handover:

```
Step 1: Detect completion — Is the flow complete and testable?
    ↓
Step 2: Create Design Delivery (DD-XXX.yaml)
    ↓
Step 3: Create Test Scenario (TS-XXX.yaml)
    ↓
Step 4: Handoff Dialog (20-30 min with development team)
    ↓
Step 5: Hand off (mark as in_development)
    ↓
Step 6: Continue with next flow (return to design activity)
```

**This is iterative.** You don't deliver everything at once. As soon as one flow is complete, package it and hand it off. Then start the next flow while development builds the first one.

---

## Parallel Work

The delivery model enables parallel work:

```
Week 1: Design Flow 1
Week 2: Hand off Flow 1 → Dev builds Flow 1
        Design Flow 2
Week 3: Hand off Flow 2 → Dev builds Flow 2
        Test Flow 1 (Module 17)
        Design Flow 3
```

You design the next flow while development builds the current one. Testing validates what was built last. Everyone stays productive.

---

## What You'll Learn

### Lesson 1: Validation and Packaging

The validation checklist, the Freya audit, creating the DD file and test scenario, the handoff dialog, and what makes a delivery ready.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Delivering incomplete flows | Check: entry to exit, every screen specified |
| Missing acceptance criteria | Write them before delivery — testable, specific |
| Vague specifications | Run Freya's audit: no "appropriate" or "suitable" |
| Duplicating content in DD | Reference artifacts, don't copy them |
| Delivering too late | Hand off as soon as a flow is complete |
| Skipping the handoff dialog | 20-30 minutes prevents weeks of misunderstanding |

---

## The Test

Can a developer who has never seen this project build this flow correctly from your DD file and the artifacts it references?

If no, it's not ready.

---

## Practice

For one completed flow:

1. Run through the validation checklist
2. Fill any gaps
3. Create the DD-XXX.yaml file
4. Write acceptance criteria
5. Create the test scenario

---

## Lessons

### [Lesson 1: Validation and Packaging](lesson-01-validation-packaging.md)
Ensuring everything is complete and packaging for handoff

---

## Tutorial

### [Tutorial 16: Create Your Delivery](tutorial-16.md)
Hands-on guide to validating specifications and packaging for handoff

---

## Next Module

**[Module 17: Usability Testing →](../module-17-usability-testing/module-17-usability-testing-overview.md)**

Test your design with real users.

---

*Part of the WDS Course: From Designer to Linchpin*
