# User Feedback Protocol

**CRITICAL: Never implement feedback without first classifying it and stating when it should be addressed.**

## Feedback Types

| Type | What It Is | When to Address |
|------|------------|-----------------|
| **Bug/Issue** | Something broken, error, not working | Now — fix immediately, iterate until resolved |
| **Quick Adjustment** | Small tweak, change X to Y | Now — implement immediately |
| **Addition** | New requirement that fits current dialog | Later step — add to plan |
| **Change Request** | Outside current dialog scope | Future session — document in Change Requests |

## The 2-Minute Rule (GTD)

**If a fix takes less than 2 minutes, do it immediately.**

From David Allen's "Getting Things Done": planning overhead should not exceed task complexity.

| Situation | Action |
|-----------|--------|
| Missing condition check | Fix now, log as sub-step |
| Wrong variable name | Fix now, log as sub-step |
| Needs new component | Add to plan |
| Architectural change | Add to plan |

**Pattern:** Do the fix → Log as sub-step (e.g., 20a-1) → Continue main task

## Response Flow

When user reports something:

1. **CLASSIFY** — What type of feedback is this?
2. **TIMING** — When should it be addressed?
3. **DOCUMENT** — For bugs, add to plan BEFORE fixing
4. **CONFIRM** — For additions and change requests, confirm before proceeding
5. **EXECUTE** — Implement or document as appropriate

### Bug/Issue (Document First, Then Fix)

**User says:** "This is broken" / "Error occurred" / "Not working"

**Agent response:**
```
This is a bug — [brief description].
Let's call it 10A and let me add it to the plan, then fix it.
```

Required sequence:
1. Identify — Understand and describe the bug
2. Document — Add to dialog plan as sub-step (e.g., 21a, 21b)
3. Execute — Fix and iterate until resolved
4. Log — Record resolution in progress log

If user reports multiple issues: list each separately, add ALL to plan first, then fix one by one.

### Quick Adjustment (Fix Now)

**User says:** "Change X to Y" / "Make this button go here"

**Agent response:** "Quick adjustment — I'll implement this now." Then implement.

### Addition (Add to Plan)

**User says:** "We should also add X"

**Agent response:** "This is an addition that fits the current dialog. I'll add it to Step {N}. Confirm?"

### Change Request (Document for Later)

**User says:** "We need a settings page"

**Agent response:**
```
This is outside the current dialog scope.
It doesn't block {feature name}.
I'll add it to Change Requests for a future session. Confirm?
```

**WAIT for user confirmation.** If user says "do it now" → treat as quick adjustment.

### Anti-Pattern

**NEVER** immediately implement without classifying. **ALWAYS** classify, state timing, then confirm or act.

The extra seconds to classify and confirm build trust and ensure alignment.
