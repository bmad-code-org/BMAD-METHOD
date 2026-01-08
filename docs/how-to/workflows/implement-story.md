---
title: "How to Implement a Story"
description: How to implement a story using the dev-story workflow
---


Use the `dev-story` workflow to implement a story with tests following the architecture and conventions.

---

## When to Use This

- After create-story has prepared the story file
- When ready to write code for a story
- Story dependencies are marked DONE

---

## Prerequisites

- BMad Method installed
- DEV agent available
- Story file created by create-story
- Architecture and tech-spec available for context

---

## Steps

### 1. Load the DEV Agent

Start a fresh chat and load the DEV agent.

### 2. Run the Workflow

```
*dev-story
```

### 3. Provide Story Context

Point the agent to the story file created by create-story.

### 4. Implement with Guidance

The DEV agent:
- Reads the story file and acceptance criteria
- References architecture decisions
- Follows existing code patterns
- Implements with tests

### 5. Complete Implementation

Work with the agent until all acceptance criteria are met.

---

## What Happens

The dev-story workflow:

1. **Reads context** - Story file, architecture, existing patterns
2. **Plans implementation** - Identifies files to create/modify
3. **Writes code** - Following conventions and patterns
4. **Writes tests** - Unit, integration, or E2E as appropriate
5. **Validates** - Runs tests and checks acceptance criteria

---

## Key Principles

### One Story at a Time

Complete each story's full lifecycle before starting the next. This prevents context switching and ensures quality.

### Follow Architecture

The DEV agent references:
- ADRs for technology decisions
- Standards for naming and structure
- Existing patterns in the codebase

### Write Tests

Every story includes appropriate tests:
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical flows

---

## After Implementation

1. **Update sprint-status.yaml** - Mark story as READY FOR REVIEW
2. **Run code-review** - Quality assurance
3. **Address feedback** - If code review finds issues
4. **Mark DONE** - After code review passes

---

## Tips

- Keep the story file open for reference
- Ask the agent to explain decisions
- Run tests frequently during implementation
- Don't skip tests for "simple" changes

---

## Troubleshooting

**Q: Story needs significant changes mid-implementation?**
A: Run `correct-course` to analyze impact and route appropriately.

**Q: Can I work on multiple stories in parallel?**
A: Not recommended. Complete one story's full lifecycle first.

**Q: What if implementation reveals the story is too large?**
A: Split the story and document the change.

---

## Related

- [Create Story](/docs/how-to/workflows/create-story.md) - Prepare the story first
- [Run Code Review](/docs/how-to/workflows/run-code-review.md) - After implementation
- [Run Sprint Planning](/docs/how-to/workflows/run-sprint-planning.md) - Sprint organization
