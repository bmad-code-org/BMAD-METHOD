---
title: "How to Run Code Review"
description: How to run code review for quality assurance
---


Use the `code-review` workflow to perform a thorough quality review of implemented code.

---

## When to Use This

- After dev-story completes implementation
- Before marking a story as DONE
- Every story goes through code review - no exceptions

---

## Prerequisites

- BMad Method installed
- DEV agent available
- Story implementation complete
- Tests written and passing

---

## Steps

### 1. Load the DEV Agent

Start a fresh chat (or continue from dev-story) and load the DEV agent.

### 2. Run the Workflow

```
*code-review
```

### 3. Provide Context

Point the agent to:
- The story file
- Files changed during implementation
- Test files

### 4. Review Findings

The agent performs a senior developer code review and reports findings.

### 5. Address Issues

If issues are found:
1. Fix issues using dev-story
2. Re-run tests
3. Run code-review again

---

## What Gets Reviewed

The code review checks:

### Code Quality
- Clean, readable code
- Appropriate abstractions
- No code smells
- Proper error handling

### Architecture Alignment
- Follows ADRs and architecture decisions
- Consistent with existing patterns
- Proper separation of concerns

### Testing
- Adequate test coverage
- Tests are meaningful (not just for coverage)
- Edge cases handled
- Tests follow project patterns

### Security
- No hardcoded secrets
- Input validation
- Authentication/authorization proper
- No common vulnerabilities

### Performance
- No obvious performance issues
- Appropriate data structures
- Efficient queries

---

## Review Outcomes

### ✅ Approved

- Code meets quality standards
- Tests pass
- **Action:** Mark story as DONE in sprint-status.yaml

### 🔧 Changes Requested

- Issues identified that need fixing
- **Action:** Fix issues in dev-story, then re-run code-review

---

## Quality Gates

Every story goes through code-review before being marked done. This ensures:

- Consistent code quality
- Architecture adherence
- Test coverage
- Security review

---

## Tips

- Don't skip code review for "simple" changes
- Address all findings, not just critical ones
- Use findings as learning opportunities
- Re-run review after fixes

---

## After Code Review

1. **If approved:** Update sprint-status.yaml to mark story DONE
2. **If changes requested:** Fix issues and re-run review
3. **Move to next story:** Run create-story for the next item

---

## Related

- [Implement Story](/docs/how-to/workflows/implement-story.md) - Before code review
- [Create Story](/docs/how-to/workflows/create-story.md) - Move to next story
- [Run Sprint Planning](/docs/how-to/workflows/run-sprint-planning.md) - Sprint organization
