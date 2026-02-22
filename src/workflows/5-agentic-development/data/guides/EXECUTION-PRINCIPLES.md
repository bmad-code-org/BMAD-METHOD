# Execution Principles

## Document Before Acting

**Every decision, action, and problem must be documented in the dialog file BEFORE acting on it.**

This ensures full traceability, clean handoff, and the dialog document is always the source of truth.

## Sketch Fidelity

**Implement code as close to the provided sketches as possible.**

Sketches are intentional design decisions, not loose suggestions:

| Element | Approach |
|---------|----------|
| **Text sizes** | Match relative sizes (headings vs body vs labels) |
| **Proportions** | Preserve ratios between elements |
| **Spacing** | Maintain visual rhythm and whitespace |
| **Layout** | Follow the arrangement precisely |
| **Component style** | Match the visual pattern (pills, cards, buttons) |

When in doubt: ask the designer. If constraints make exact matching impossible, document the deviation and explain why.

## Sub-Steps During Execution

While working on a step, add discovered tasks as sub-steps:

```markdown
| # | Section | Status | Notes |
|---|---------|--------|-------|
| 14 | Book It Button | Done | Complete |
| 14a | Fix button alignment | Done | Added during 14 |
| 14b | Add loading state | Done | Added during 14 |
| 15 | Cancel Button | In Progress | |
```

Sub-steps use letter suffixes (14a, 14b) to maintain parent position.

## Dynamic Planning After Step Completion

After completing each step, review and adjust the plan:

1. Review remaining steps — still accurate?
2. Shuffle if needed — reorder based on learnings
3. Add new steps — if implementation revealed new requirements
4. Remove steps — if no longer needed
5. Update the dialog file

**Numbering rules:** Completed steps = fixed numbering. Future steps = dynamic numbering.

## Plan-then-Execute Pattern

**Separate planning from execution into distinct sessions.**

Context windows are finite. Long sessions accumulate noise. The solution:

**Planning Session:**
1. Explore codebase and requirements
2. Discuss approach with designer
3. Write plan to dialog file
4. End with clear handoff

**Execution Session:**
1. Start fresh (new conversation)
2. Read product brief for context
3. Read page specification for requirements
4. Read dialog document for plan and progress
5. Execute steps one by one

**When to split:** After complex exploration, when plan is complete, when session is getting long, before major implementation.

## Handoff Always References Dialog

Any handoff — to a new session, agent, or human — **MUST** reference the dialog document. Never hand off verbally. Always point to the dialog.
