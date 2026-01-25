---
title: "How to Implement a Story"
description: How to implement a story using the dev-story workflow
---

Use the `dev-story` workflow to implement a story with tests following the architecture and conventions.

## When to Use This

- After create-story has prepared the story file
- When ready to write code for a story
- Story dependencies are marked DONE

:::note[Prerequisites]
- BMad Method installed
- DEV agent available
- Story file created by create-story
- Architecture and tech-spec available for context
:::

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

## What Happens

The dev-story workflow:

1. **Reads context** — Story file, architecture, existing patterns
2. **Plans implementation** — Identifies files to create/modify
3. **Writes code** — Following conventions and patterns
4. **Writes tests** — Unit, integration, or E2E as appropriate
5. **Validates** — Runs tests and checks acceptance criteria

## Key Principles

**One Story at a Time** — Complete each story's full lifecycle before starting the next. This prevents context switching and ensures quality.

**Follow Architecture** — The DEV agent references ADRs for technology decisions, standards for naming and structure, and existing patterns in the codebase.

**Write Tests** — Every story includes appropriate tests: unit tests for business logic, integration tests for API endpoints, E2E tests for critical flows.

## After Implementation

1. **Update sprint-status.yaml** — Mark story as READY FOR REVIEW
2. **Run code-review** — Quality assurance
3. **Address feedback** — If code review finds issues
4. **Mark DONE** — After code review passes

## Tips

- **Keep the story file open** — Reference it during implementation
- **Ask the agent to explain decisions** — Understand the approach
- **Run tests frequently** — Catch issues early
- **Don't skip tests** — Even for "simple" changes

## Troubleshooting

**Story needs significant changes mid-implementation?**
Run `correct-course` to analyze impact and route appropriately.

**Can I work on multiple stories in parallel?**
Not recommended. Complete one story's full lifecycle first.

**What if implementation reveals the story is too large?**
Split the story and document the change.

## Next Steps

After implementing a story:

1. **Code Review** — Run code-review with the DEV agent
2. **Create Next Story** — Run create-story with the SM agent
