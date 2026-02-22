# Session Start Protocol

When starting or resuming a session, **always follow this sequence before implementing anything:**

## 1. Read the Dialog Document

Read the dialog file completely to understand:
- What steps are done
- What steps remain
- Any blockers or change requests
- Current context and decisions

## 2. Verify Plan Against Reality

**The plan may be outdated.** Check if:
- Steps marked "To Do" have actually been implemented
- Steps marked "Done" are truly complete
- Numbering is sequential and accurate

If the plan is outdated → Update it before proceeding.

## 3. Present Current Status

Summarize for the designer:
- What's done (with step numbers)
- What's remaining (with step numbers)
- Any change requests pending

## 4. Before Implementing a Step

**Always check the specification/sketches first:**

```
Agent: "Before implementing step 20, let me check the sketches..."
Agent: "I see this requires a nested drawer pattern, not inline buttons.
        Should I break this into sub-steps?"
```

This prevents building the wrong thing and wasting effort.

## Why This Matters

Sessions can be interrupted. Context can be lost. The dialog document survives — but only if it's kept accurate. This protocol ensures:
- No duplicate work (re-implementing what exists)
- No missed work (skipping what's actually needed)
- Correct understanding of requirements before implementation
