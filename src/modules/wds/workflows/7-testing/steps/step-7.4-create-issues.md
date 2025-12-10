# Step 7.4: Create Issues

## Your Task

Document all problems found during testing as issue tickets that BMad can fix.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 7.3 (all tests executed)
- ✅ Test results documented
- ✅ Screenshots captured
- ✅ Issues identified

---

## Issue Creation Process

### For Each Issue Found

**Create issue file:** `issues/ISS-XXX-description.md`

**Numbering:**

- Start at ISS-001
- Increment for each issue
- Use leading zeros

---

## Issue Template

````markdown
# Issue: [Short Description]

**ID:** ISS-XXX
**Severity:** [Critical | High | Medium | Low]
**Status:** Open
**Delivery:** DD-XXX
**Test:** TS-XXX, Check: [Test ID]
**Created:** 2024-12-09
**Assigned:** BMad Developer

## Description

[Clear description of the problem]

## Expected

[What should happen according to design]

## Actual

[What actually happens]

## Impact

[Why this matters - user impact, business impact]

## Design Reference

- Design Spec: [Path to specification]
- Design Token: [Path to token if applicable]
- Component Spec: [Path to component spec if applicable]

## Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Screenshot/Video

![Issue screenshot](../testing/DD-XXX/screenshots/ISS-XXX.png)

## Recommendation

[How to fix this - be specific]

```code
[Code example if applicable]
```
````

## Related Issues

- [Link to related issues if any]

---

**Priority for fix:** [Next release | This release | Future]

````

---

## Severity Levels

### Critical
**Definition:** Blocks usage, prevents core functionality

**Examples:**
- App crashes
- Cannot complete core flow
- Data loss
- Security vulnerability

**Action:** Must fix immediately before any release

---

### High
**Definition:** Major issue, significantly impacts UX

**Examples:**
- Wrong button color (brand inconsistency)
- Missing error handling
- Progress not saved
- Accessibility blocker

**Action:** Must fix before release

---

### Medium
**Definition:** Noticeable issue, impacts UX but has workaround

**Examples:**
- Error message not helpful enough
- Transition animation missing
- Screen reader labels incomplete
- Minor design system deviation

**Action:** Fix soon, can ship with workaround

---

### Low
**Definition:** Minor issue, cosmetic or edge case

**Examples:**
- Text link touch target slightly small
- Minor spacing inconsistency
- Rare edge case not handled

**Action:** Fix when possible, can ship as-is

---

## Example Issues

### Example 1: Functionality Issue

```markdown
# Issue: Transition Animation Missing

**ID:** ISS-001
**Severity:** Medium
**Status:** Open
**Delivery:** DD-001
**Test:** TS-001, Check: HP-001-step-3

## Description

Transition from Login/Signup choice to Signup form is instant instead of smooth animated transition.

## Expected

Smooth 300ms fade transition when tapping "Create Account" button, as specified in design.

## Actual

Signup form appears instantly with no transition. Feels jarring and abrupt.

## Impact

- User experience feels less polished
- Doesn't match design specifications
- Reduces perceived quality

## Design Reference

- Design Spec: C-Scenarios/03-signup/Frontend/specifications.md#transitions
- Specification states: "300ms ease-in-out fade transition"

## Steps to Reproduce

1. Open app
2. Tap "Get Started"
3. Tap "Create Account"
4. Observe instant transition (no animation)

## Screenshot

![Instant transition](../testing/DD-001/screenshots/ISS-001-transition.png)

## Recommendation

Add transition animation to navigation:

```tsx
// React Native
<Stack.Screen
  name="Signup"
  component={SignupScreen}
  options={{
    animation: 'fade',
    animationDuration: 300,
  }}
/>
````

---

**Priority for fix:** This release

````

---

### Example 2: Design System Issue

```markdown
# Issue: Button Color Incorrect

**ID:** ISS-002
**Severity:** High
**Status:** Open
**Delivery:** DD-001
**Test:** TS-001, Check: DS-001

## Description

Primary button background color doesn't match design system specification. Using lighter blue instead of brand primary.

## Expected

Primary button background: #2563EB (brand primary color)

## Actual

Primary button background: #3B82F6 (lighter blue, not brand color)

## Impact

- Brand inconsistency across app
- Doesn't match design system
- All primary buttons affected
- Reduces brand recognition

## Design Reference

- Design System: D-Design-System/03-Atomic-Components/Buttons/Button-Primary.md
- Design Token: D-Design-System/02-Foundation/Colors/tokens.json
- Token path: `button.primary.background` → `#2563EB`

## Steps to Reproduce

1. Open any screen with primary button
2. Observe button color
3. Compare to design token

## Screenshot

![Button color comparison](../testing/DD-001/screenshots/ISS-002-button-color.png)

## Recommendation

Update button component to use design token:

```tsx
// Before
backgroundColor: '#3B82F6'

// After
backgroundColor: tokens.button.primary.background // #2563EB
````

Affected components:

- "Get Started" button
- "Create Account" button
- "Continue" button
- All primary buttons

---

**Priority for fix:** This release (High severity)

````

---

### Example 3: Accessibility Issue

```markdown
# Issue: Button Labels Not Descriptive for Screen Reader

**ID:** ISS-003
**Severity:** Medium
**Status:** Open
**Delivery:** DD-001
**Test:** TS-001, Check: A11Y-001

## Description

Buttons are announced as just "Button" by screen reader instead of descriptive labels.

## Expected

Buttons should have descriptive accessibility labels:
- "Get Started button"
- "Create Account button"
- "Log In button"

## Actual

VoiceOver announces all buttons as just "Button" with no context.

## Impact

- Screen reader users cannot understand button purpose
- Fails WCAG 2.1 AA accessibility standards
- Blocks visually impaired users

## Design Reference

- Accessibility requirement: All interactive elements must have descriptive labels
- WCAG 2.1: 2.4.6 Headings and Labels (Level AA)

## Steps to Reproduce

1. Enable VoiceOver (iOS) or TalkBack (Android)
2. Navigate to Welcome screen
3. Focus on "Get Started" button
4. Observe announcement: "Button" (not descriptive)

## Screenshot

![VoiceOver announcement](../testing/DD-001/screenshots/ISS-003-voiceover.png)

## Recommendation

Add accessibility labels to all buttons:

```tsx
<Button
  title="Get Started"
  accessibilityLabel="Get Started button"
  accessibilityHint="Opens login or signup options"
/>

<Button
  title="Create Account"
  accessibilityLabel="Create Account button"
  accessibilityHint="Opens signup form"
/>
````

Affected buttons:

- All buttons in onboarding flow
- Estimate: 8 buttons total

---

**Priority for fix:** This release (Accessibility blocker)

````

---

## Issue Tracking

**Create issues list:** `issues/issues-list.md`

```markdown
# Issues List: DD-001

**Total Issues:** 8
**Status:** Open

## Critical (0)

None

## High (3)

- [ISS-002](ISS-002-button-color.md) - Button Color Incorrect
- [ISS-004](ISS-004-progress-not-saved.md) - Progress Not Saved on App Close
- [ISS-005](ISS-005-network-timeout.md) - No Network Timeout Handling

## Medium (3)

- [ISS-001](ISS-001-transition-missing.md) - Transition Animation Missing
- [ISS-003](ISS-003-button-labels.md) - Button Labels Not Descriptive
- [ISS-006](ISS-006-error-message.md) - Error Message Too Brief

## Low (2)

- [ISS-007](ISS-007-link-touch-target.md) - Text Link Touch Target Too Small
- [ISS-008](ISS-008-link-contrast.md) - Link Color Contrast Too Low

---

## By Category

**Functionality:** 3 issues
- ISS-001, ISS-004, ISS-005

**Design System:** 1 issue
- ISS-002

**Accessibility:** 4 issues
- ISS-003, ISS-006, ISS-007, ISS-008

---

## Priority for Fix

**Must fix before release:**
- ISS-002 (High)
- ISS-003 (High)
- ISS-004 (High)
- ISS-005 (High)

**Should fix before release:**
- ISS-001 (Medium)
- ISS-006 (Medium)

**Can fix later:**
- ISS-007 (Low)
- ISS-008 (Low)
````

---

## Next Step

After creating all issue tickets:

```
[C] Continue to step-7.5-create-report.md
```

---

## Success Metrics

✅ All issues documented as tickets
✅ Each issue has clear description
✅ Each issue has expected vs actual
✅ Each issue has design reference
✅ Each issue has screenshot/video
✅ Each issue has recommendation
✅ Severity assigned correctly
✅ Issues list created

---

## Failure Modes

❌ Vague issue descriptions
❌ No design references
❌ No screenshots
❌ No recommendations
❌ Wrong severity assignment
❌ Missing steps to reproduce

---

## Tips

### DO ✅

**Be specific:**

- Clear descriptions
- Exact values (colors, sizes)
- Precise steps to reproduce

**Be helpful:**

- Provide recommendations
- Include code examples
- Link to design references

**Be organized:**

- Consistent numbering
- Clear file names
- Issues list for tracking

### DON'T ❌

**Don't be vague:**

- "It doesn't look right" ❌
- "Button color is #3B82F6, should be #2563EB" ✅

**Don't blame:**

- Focus on the issue, not the person
- Be collaborative, not critical

**Don't skip documentation:**

- Every issue needs full documentation
- Screenshots are required
- Design references are required

---

**Remember:** Good issue tickets = fast fixes. Be thorough and helpful!
