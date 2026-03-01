# Module 14: Agentic Development

## Lesson 2: Evaluation and Feedback

**Staying in control as the agent builds**

---

## The Step Is Done. Now What?

The agent completed a step. You have output — code, a component, a visual.

Now is the most important moment: **evaluation**.

This is where you, the designer, earn your keep. The AI builds fast. You decide if what it built is right.

---

## The Evaluation Cycle

After every step:

### 1. Compare to Intent

Does the output match what you asked for?

- Check against the specification
- Check against the test protocol
- Look at it with fresh eyes — not just technically correct, but does it *feel* right?

### 2. Give Feedback

Tell the agent specifically what's wrong or right. The more precise your feedback, the better the next iteration.

### 3. Update the Plan

Based on what you learned, adjust:

- **Reprioritize** — this task turned out to be more important
- **Add tasks** — something new emerged
- **Remove tasks** — this is no longer needed
- **Split tasks** — this was too big, break it down
- **Shuffle order** — the sequence should change

---

## Giving Effective Feedback

### Bad Feedback

> "This doesn't look right."

The agent doesn't know what "right" means. It will guess, probably wrong.

### Good Feedback

> "The spacing between the form fields is too tight. The spec says 16px between fields, this looks like 8px. Also, the submit button should be full-width, not centered at 200px."

Specific. Referenced to spec. Actionable.

### Better Feedback

> "Two issues:
> 1. Field spacing: spec says 16px gap, implementation has 8px. Fix to 16px.
> 2. Submit button: spec says full-width (100%), implementation is 200px centered. Fix to 100%.
>
> Everything else looks correct. Proceed to next step after fixing."

Numbered. Clear priority. Confirms what's correct too.

---

## What to Evaluate

### Against Specification

| Check | Question |
|-------|----------|
| Content | Does text match spec exactly? |
| Layout | Are elements positioned correctly? |
| States | Are all states present and correct? |
| Behavior | Do interactions work as specified? |
| Styling | Do colors, fonts, spacing match tokens? |

### Against Intent

Not everything is in the spec. Use your design judgment:

- Does the visual hierarchy feel right?
- Is the flow natural?
- Would a user understand this immediately?
- Does it match the persona's needs?

### Against Quality

- Accessibility: contrast, focus states, touch targets
- Responsiveness: does it work on all sizes?
- Performance: is it smooth?

---

## Re-evaluating the Plan

After evaluation, open the Design Log and update the task list.

**Before step 3:**
```markdown
## Tasks
1. [x] Create form layout
2. [x] Add validation
3. [ ] Implement error states
4. [ ] Loading and success states
5. [ ] Responsive adjustments
6. [ ] Accessibility pass
```

**After step 3 revealed mobile layout issues:**
```markdown
## Tasks
1. [x] Create form layout
2. [x] Add validation
3. [x] Implement error states
4. [ ] Fix mobile layout for error messages    ← NEW
5. [ ] Loading and success states
6. [ ] Responsive adjustments
7. [ ] Accessibility pass
8. [ ] Revisit password strength on mobile     ← NEW (from step 2 learning)
```

The plan grows and shrinks. That's normal.

---

## When Output Is Wrong

Three common situations:

### 1. Spec Divergence

The output doesn't match the spec.

**Action:** Point to the specific spec section. Ask the agent to fix it.

> "The spec says the error message appears below the field, but it's rendering as a toast notification. Fix to inline below-field as per spec section 4.2."

### 2. Spec Was Wrong

Building revealed the spec needs updating.

**Action:** Update the spec first, then continue building.

> "The spec says inline validation on keypress, but that's too aggressive. Updating spec to blur-based validation. Continue with updated approach."

### 3. Better Idea

The agent or you discovered a better approach during building.

**Action:** Document the improvement, update spec, continue.

> "The agent suggested a shake animation on error instead of just red text. That's better UX. Updating spec to include shake. Document as intentional improvement."

---

## The Evaluation Mindset

Think of yourself as a creative director reviewing work:

- **Be specific** — point to exact elements
- **Be decisive** — approve or reject, don't waffle
- **Be efficient** — one round of feedback per step, not five
- **Confirm what's right** — not just what's wrong
- **Think strategically** — does this serve the user, the persona, the business goal?

---

## What's Next

In the next lesson, you'll learn what to do when things go wrong — when the agent can't solve the problem and you need to troubleshoot or escalate.

---

**[Continue to Lesson 3: When You Get Stuck →](lesson-03-when-you-get-stuck.md)**

---

[← Back to Lesson 1](lesson-01-iterative-building.md) | [Back to Module Overview](module-14-agentic-development-overview.md)

*Part of Module 14: Agentic Development*
