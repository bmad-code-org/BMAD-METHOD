# Module 18: Product Evolution

## Lesson 2: Update the Spec — Project the Code

**The specification changes first. The code follows.**

---

## Spec First, Always

In greenfield, the specification is the blueprint. You write it, then you build from it.

In brownfield, the specification is also the record. It describes what exists today. When you change the product, you change the spec first — then project that change into the code.

This is the single most important discipline in product evolution. Skip it, and specs drift from reality. Within months, nobody knows what's current. The spec says one thing, the product does another, and every future change becomes guesswork.

---

## Reading the Current Spec

Before you change anything, read what's there.

**You say to the agent:**
> "Read the current specification for the signup form — P02-signup-form.md."

**The agent reads and summarizes:**
> "Current password field spec:
> - Label: 'Password'
> - Helper text: 'At least 8 characters'
> - Validation: On blur — 8+ chars, 1 number, 1 letter
> - Error message: 'Password must be at least 8 characters with a number and letter'
> - Strength indicator: Appears on typing"

Now you know exactly what exists. You know the designed intent, the states, the validation rules. You're not guessing from looking at the live product — you're reading the source of truth.

### What if the spec doesn't match reality?

This happens. Code changes sneak in without spec updates. A developer fixes something in production. A quick patch that was never documented.

When you find drift:

1. **Note it** — Document the discrepancy in the Design Log
2. **Decide** — Does reality match the original intent, or has it drifted in a useful direction?
3. **Update the spec** — Make the spec match what should be true, whether that's the current state or the intended change
4. **Then proceed** — Now you're working from an accurate baseline

Don't pretend drift doesn't exist. Acknowledge it, fix the spec, and move forward.

---

## Making the Spec Change

The change you're making gets written into the specification before a single line of code changes.

### What to update

**The element itself** — New values, new behavior, new states.

```markdown
#### Password Field (v1.2)
- Label: "Password"
- Helper text: "8+ characters, including a number and letter"
- Requirements: Shown below field at all times
- Validation: On blur — check 8+ chars, 1 number, 1 letter
- Error: Red border + message
- Strength indicator: Appears on typing
```

**The changelog** — What changed, why, and where it connects to strategy.

```markdown
### Changelog
#### v1.2 (2026-03-15)
- Changed: Password helper text shows full requirements upfront
- Reason: Usability testing — 3/5 users confused by hidden requirements
- Connection: Felix — efficiency driving force
```

**The version number** — Increment it. Every change gets a version. This creates a trail you can follow backward through the product's history.

### What to preserve

Mark unchanged elements explicitly. This prevents the agent — or a future reader — from wondering whether something was intentionally kept or accidentally missed.

```markdown
- Validation: On blur (unchanged)
- Strength indicator: Appears on typing (unchanged)
- Email field: Not affected by this change
```

The word "unchanged" is documentation. It says: we looked at this, we decided to keep it.

---

## Projecting into Code

With the spec updated, the agent builds from it. This is the same agentic development loop from Module 14 — but the starting point is an existing codebase, not a blank project.

### The agent reads the updated spec

**You say:**
> "Implement the spec change for the password field. The updated spec is P02-signup-form.md v1.2."

The agent reads the spec, finds the changed elements, and identifies what code to modify.

### The agent finds the current implementation

> "Found password field component at src/components/SignupForm/PasswordField.tsx"
> "Current helper text: 'At least 8 characters'"
> "Requirements display: Conditional — only shown on validation error"

### The agent makes the change

> "Updating helper text to '8+ characters, including a number and letter'"
> "Changing requirements display from conditional to always visible"
> "Preserving: validation logic, strength indicator, error styling"

### The agent verifies with Puppeteer

> "Opening localhost:3000/signup..."
> "Helper text: '8+ characters, including a number and letter' — matches spec v1.2. ✓"
> "Requirements visible before typing — confirmed. ✓"
> "Blur validation still triggers. ✓"
> "Strength indicator still works. ✓"
> "Email field unchanged. ✓"

The updated spec is the acceptance criteria. The agent checks each element against what the spec now says. Pass or fail — no ambiguity.

---

## The Scope Boundary

The Design Log defines what changes and what doesn't. The spec update makes this concrete.

When the agent is working, it has a clear boundary:

- **Changed elements** — Implement exactly as the updated spec describes
- **Unchanged elements** — Verify they still work, but don't modify them
- **Out of scope** — Don't touch. Don't even look at.

This is how you prevent a small change from snowballing. The password field helper text changes. The email field doesn't. The form layout doesn't. The submission flow doesn't.

If the agent discovers something out of scope that needs attention — a bug, a related improvement, an inconsistency — it logs it in the Design Log for a future cycle. It doesn't fix it now.

```markdown
## Notes
- Noticed: Submit button text could be clearer ("Create Account" vs "Sign Up")
- Not in scope for this dialog — log for future evaluation
```

Discipline means doing one thing well, not three things halfway.

---

## Version History as Product Memory

Over time, your specifications accumulate changelogs. This is your product's memory.

```markdown
### Changelog
#### v1.3 (2026-04-20)
- Added: Password visibility toggle
- Reason: Accessibility audit finding
- Connection: All personas — universal usability

#### v1.2 (2026-03-15)
- Changed: Password helper text shows full requirements upfront
- Reason: Usability testing — 3/5 users confused
- Connection: Felix — efficiency driving force

#### v1.1 (2026-02-01)
- Added: Password strength indicator
- Reason: Security requirement from domain expert review
- Connection: Business — reduce weak password incidents

#### v1.0 (2026-01-15)
- Initial specification
```

Every entry answers three questions:
1. **What** changed?
2. **Why** did it change?
3. **Who** does it serve?

When a new team member asks "why does the password field work this way?" — the answer is in the changelog. When someone proposes a change that was already tried and reverted — the history shows it. When you need to understand how a feature evolved — you read the versions, not the git log.

The spec changelog is the design decision record. Git tracks what code changed. The spec tracks why.

---

## When to Write a New Spec vs. Update an Existing One

### Update the existing spec when:

- You're modifying an element that's already specified
- The change affects behavior, content, or appearance of a documented component
- The page or flow already has a specification

This is most evolution work. You're changing what's there.

### Create a new spec when:

- You're adding a completely new page or flow
- The new feature has no existing specification to extend
- The scope is large enough that adding to an existing spec would make it unwieldy

New specs follow the same format from Module 11. They just happen to live alongside existing ones.

### Never skip the spec

Even for a "quick fix." Even for "just a text change." If it changes what the user sees or experiences, it belongs in a specification.

The cost of updating a spec is minutes. The cost of spec drift is hours — spent later, by someone who doesn't remember why things are the way they are.

---

## What's Next

In the tutorial, you'll run a complete evolution cycle — from receiving feedback to closing the Design Log with a verified change.

---

**[Continue to Tutorial: Evolve Your Product →](tutorial-18.md)**

---

[← Back to Lesson 1](lesson-01-continuous-improvement.md) | [Module Overview](module-18-product-evolution-overview.md)

*Part of Module 18: Product Evolution*
