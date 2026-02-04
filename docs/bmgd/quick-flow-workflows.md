---
title: "Quick Flow Workflows"
draft: true
---

How to create tech specs and execute implementations with Quick Flow.

## Choosing a Workflow

| Situation | Workflow | Command |
|-----------|----------|---------|
| Need to document before implementing | Quick-Spec | `/bmad-gds-quick-spec` |
| Multiple approaches to evaluate | Quick-Spec | `/bmad-gds-quick-spec` |
| Have a completed tech-spec | Quick-Dev | `/bmad-gds-quick-dev path/to/spec.md` |
| Have clear, direct instructions | Quick-Dev | `/bmad-gds-quick-dev` |
| Building complete game system | Full GDS | `/bmad-gds-workflow-init` |
| Epic-level features | Full GDS | `/bmad-gds-workflow-init` |

---

## How to Create a Tech Spec (Quick-Spec)

### Step 1: Start the workflow

```bash
/bmad-gds-quick-spec
```

### Step 2: Describe your requirement

Provide your feature request. The agent scans the codebase and asks clarifying questions.

**Checkpoint options:**
- `[a]` Advanced Elicitation - explore requirements deeper
- `[c]` Continue to investigation
- `[p]` Party Mode - consult expert agents

### Step 3: Review investigation findings

The agent analyzes the codebase for patterns, constraints, and similar implementations. Review the findings.

**Checkpoint options:**
- `[c]` Continue to spec generation
- `[p]` Party Mode - get technical review

### Step 4: Review generated spec

The agent creates an ordered task list with file paths and acceptance criteria. Verify completeness.

**Checkpoint options:**
- `[c]` Continue to final review
- `[p]` Party Mode - technical review

### Step 5: Finalize

Confirm the spec meets these standards:
- Every task has a file path and specific action
- Tasks ordered by dependency
- Acceptance criteria in Given/When/Then format
- No placeholders or TBD sections

**Options:**
- `[d]` Start Quick-Dev immediately
- `[done]` Save spec and exit

**Output:** `{planning_artifacts}/tech-spec-{slug}.md`

---

## How to Execute Implementation (Quick-Dev)

### With a Tech-Spec

```bash
/bmad-gds-quick-dev path/to/tech-spec-feature.md
```

The agent:
1. Captures baseline git commit
2. Loads and validates the spec
3. Executes tasks in order
4. Runs self-check
5. Performs adversarial review
6. Resolves findings
7. Validates against acceptance criteria

### With Direct Instructions

```bash
/bmad-gds-quick-dev
```

Then describe what you want implemented:
1. Captures baseline git commit
2. Evaluates complexity (may suggest planning)
3. Gathers context from codebase
4. Executes implementation
5. Runs self-check and adversarial review
6. Resolves findings

**Escalation:** If the agent detects complexity (multiple components, system-level scope, uncertainty), it offers:
- `[t]` Create tech-spec first
- `[w]` Use full GDS workflow
- `[e]` Execute anyway

---

## Troubleshooting

### Spec has placeholders or TBD sections

Return to investigation step. Complete missing research, inline all findings, re-run review.

### Workflow lost context mid-step

Check frontmatter for `stepsCompleted`. Resume from last completed step.

### Agent suggested planning but you want to execute

You can override with `[e]`, but document your assumptions. Escalation heuristics exist because planning saves time on complex tasks.

### Tests failing after implementation

Return to the resolve-findings step. Review failures, fix issues, ensure test expectations are correct, re-run full suite.

### Need help

```bash
/bmad-help
```

---

## Reference

### File Locations

| File | Location |
|------|----------|
| Work in progress | `{implementation_artifacts}/tech-spec-wip.md` |
| Completed specs | `{planning_artifacts}/tech-spec-{slug}.md` |
| Archived specs | `{implementation_artifacts}/tech-spec-{slug}-archived-{date}.md` |
| Workflow files | `_bmad/gds/workflows/gds-quick-flow/` |

### Validation Criteria

**Self-check (before adversarial review):**
- All tasks/instructions completed
- Tests written and passing
- Follows existing patterns
- No obvious bugs
- Acceptance criteria met
- Code is readable

**Adversarial review:**
- Correctness
- Security
- Performance
- Maintainability
- Test coverage
- Error handling
