---
title: "How to Create a Story"
description: How to create implementation-ready stories from epic backlog
---

Use the `create-story` workflow to prepare the next story from the epic backlog for implementation.

## When to Use This

- Before implementing each story
- When moving to the next story in an epic
- After sprint-planning has been run

:::note[Prerequisites]
- BMad Method installed
- SM (Scrum Master) agent available
- Sprint-status.yaml created by sprint-planning
- Architecture and PRD available for context
:::

## Steps

### 1. Load the SM Agent

Start a fresh chat and load the SM (Scrum Master) agent.

### 2. Run the Workflow

```
*create-story
```

### 3. Specify the Story

The agent will:
- Read the sprint-status.yaml
- Identify the next story to work on
- Or let you specify a particular story

### 4. Review the Story File

The agent creates a comprehensive story file ready for development.

## What You Get

A `story-[slug].md` file containing:

- Story objective and scope
- Acceptance criteria (specific, testable)
- Technical implementation notes
- References to architecture decisions
- Dependencies on other stories
- Definition of Done

## Story Content Sources

The create-story workflow pulls from:

- **PRD** — Requirements and acceptance criteria
- **Architecture** — Technical approach and ADRs
- **Epic file** — Story context and dependencies
- **Existing code** — Patterns to follow (brownfield)

## Example Output

```markdown
## Objective
Implement email verification flow for new user registrations.

## Acceptance Criteria
- [ ] User receives verification email within 30 seconds
- [ ] Email contains unique verification link
- [ ] Link expires after 24 hours
- [ ] User can request new verification email

## Technical Notes
- Use SendGrid API per ADR-003
- Store verification tokens in Redis per architecture
- Follow existing email template patterns in /templates

## Dependencies
- Story 1.1 (User Registration) - DONE

## Definition of Done
- All acceptance criteria pass
- Tests written and passing
- Code review approved
```

## Tips

- **Complete one story before creating the next** — Focus on finishing
- **Ensure dependencies are DONE** — Don't start blocked stories
- **Review technical notes** — Align with architecture
- **Use the story file as context** — Pass to dev-story workflow

## Next Steps

After creating a story:

1. **Implement Story** — Run dev-story with the DEV agent
2. **Code Review** — Run code-review after implementation
