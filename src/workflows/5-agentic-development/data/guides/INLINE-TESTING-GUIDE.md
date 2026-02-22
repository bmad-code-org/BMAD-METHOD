# Inline Testing Guide

**For**: WDS Agents performing Agentic Development
**Purpose**: Self-verify implementation using Puppeteer before presenting to user
**Scope**: During-development testing (NOT Phase 7 post-development validation)

---

## Core Principle

**The agent tests its own work before presenting it to the user.**

After implementing a section, the agent uses Puppeteer to open the browser, navigate to the page, and verify all measurable acceptance criteria. Only after all measurable criteria pass does the agent present the result to the user for qualitative feedback.

---

## Responsibility Split

| Responsibility | Owner | Examples |
|---------------|-------|----------|
| **Measurable criteria** | Agent (Puppeteer) | Text content matches spec, colors match hex values, touch targets >= 44px, error states display correctly, element visibility, layout positioning |
| **Qualitative judgment** | Human | Flow feels natural, visual hierarchy works, user understands next steps, pacing feels right, overall consistency |

**The agent never asks the user to verify something it can measure itself.**

---

## When to Test

| Trigger | Action |
|---------|--------|
| Section implementation complete (4c done) | Run Puppeteer verification before presenting (4d) |
| Public page implementation complete | Run SEO validation → [SEO-VALIDATION-GUIDE.md](SEO-VALIDATION-GUIDE.md) |
| Issue fixed (4e done) | Re-verify the fix + check for regressions before re-presenting |
| Modifying existing feature | Capture baseline BEFORE making changes |
| Integration test (Phase 5) | Verify all states across all sections |

---

## Baseline Capture

When modifying an existing feature, capture current state BEFORE making changes:

1. Open browser with Puppeteer
2. Navigate to the page/component
3. Document current state:
   - Screenshot the current rendering
   - Key measurable values (text, colors, dimensions)
   - Current behavior for each relevant interaction
4. Record as baseline in the story file under "Baseline State"
5. After implementation, compare against baseline to confirm only intended changes occurred

**Why:** Without a baseline, you can't distinguish intended changes from regressions. The agent needs to know what "before" looked like to verify "after" is correct.

---

## Puppeteer Verification Process

### Step 1: Open and Navigate

```
1. Open browser with Puppeteer
2. Navigate to [View].html or the relevant page URL
3. Wait for page to fully load
4. Set viewport to target device width if relevant (e.g., 375px for mobile)
```

### Step 2: Verify Each Criterion

For each acceptance criterion in the test plan:

```
1. Locate the element (by data-object-id, selector, or content)
2. Read the actual value (text, computed style, dimensions, visibility)
3. Compare against the spec value
4. Record result with narration
```

### Step 3: Narrate Findings

Use this narration pattern — group by category, state both actual and expected:

```
Verifying Section [N]: [Section Name]

Text Content:
  Headline text is "Boka promenad" — matches spec. ✓
  Subtext is "Välj tid och dag" — matches spec. ✓

Styling:
  Primary button background is #2563EB — matches spec. ✓
  Error text color is #EF4444 — spec says #DC2626. ✗ Mismatch.

Layout:
  Touch target is 48x48px — meets minimum 44px. ✓
  Input field width is 100% of container — matches spec. ✓

States:
  Empty state shows placeholder text — correct. ✓
  Error state displays validation message — correct. ✓
  Loading state disables button and shows spinner — correct. ✓

Result: 8/9 criteria pass. 1 mismatch found.
```

**Rules:**
- Always state both actual and expected values
- Always group by category for readability
- Always end with a summary line (X/Y criteria pass)

### Step 4: Fix or Present

- **All criteria pass** — Proceed to Phase 4d (present to user for qualitative feedback)
- **Any criteria fail** — Fix the issue, then re-run verification. Do NOT present to user with known measurable failures.

---

## Test Plan Structure

Story files split acceptance criteria into two categories. This is the format:

### Agent-Verifiable (Puppeteer)

Measurable criteria the agent checks itself:

| # | Criterion | Element | Expected | How to Verify |
|---|-----------|---------|----------|---------------|
| 1 | Headline text | `[data-object-id="section-title"]` | "Boka promenad" | Read textContent |
| 2 | Button color | `[data-object-id="submit-btn"]` | bg: #2563EB | Read computed backgroundColor |
| 3 | Touch target | `[data-object-id="submit-btn"]` | >= 44x44px | Read offsetWidth, offsetHeight |
| 4 | Error display | `#emailError` | Visible when email invalid | Trigger error, check visibility |
| 5 | Loading state | `[data-object-id="submit-btn"]` | Disabled + spinner | Click submit, check disabled attr |

### User-Evaluable (Qualitative)

Criteria only the human can judge:

- [ ] Flow feels natural and intuitive
- [ ] Visual hierarchy guides the eye correctly
- [ ] Error messages are understandable (not just present)
- [ ] Section feels consistent with the rest of the prototype

---

## Integration with Phase 4 Flow

```
4a: Announce & Gather
4b: Create Story File (includes split test plan)
4c: Implement Section
        ↓
   Agent runs Puppeteer verification
   Agent runs SEO validation (if public page) → SEO-VALIDATION-GUIDE.md
        ↓
  All pass? ── No ──→ Agent fixes, re-verifies (loop)
        │
       Yes
        ↓
4d: Present for Testing (user evaluates qualitative criteria only)
4e/4f: Handle Issue/Improvement (if needed)
4g: Section Approved
```

---

## Distinction from Phase 7 Testing

| Aspect | Inline Testing (This Guide) | Phase 7 Testing |
|--------|----------------------------|-----------------|
| **When** | During development, per section | After development complete |
| **Who tests** | Agent (automated via Puppeteer) | Designer (manual validation) |
| **What** | Measurable spec conformity | Full design vision validation |
| **Scope** | Single section at a time | Entire feature/delivery |
| **Outcome** | Agent fixes before showing user | Issues documented for developer |

These are complementary, not competing. Inline testing catches measurable issues early. Phase 7 testing validates the complete feature against the full design vision.

---

## Anti-Patterns

- **Never present to user with known measurable failures** — Fix them first
- **Never ask user to check something Puppeteer can verify** — Colors, text, sizes are the agent's job
- **Never skip baseline capture when modifying existing features** — Prevents unintended regressions
- **Never narrate without comparison values** — Always state both actual and expected
- **Never batch all testing to the end** — Test each section as you build it

---

*Test as you build. Fix before you present. Let the human focus on what only humans can judge.*
