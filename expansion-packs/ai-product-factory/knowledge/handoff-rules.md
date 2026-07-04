# Handoff Rules — AI Product Factory

Every agent must follow these rules when completing work and passing context to the next agent.

## Core Principles

1. **Artifacts over chat** — Every handoff includes file paths to deterministic artifacts, not conversation summaries.
2. **Explicit next agent** — State which agent/skill receives the handoff and why.
3. **Gap declaration** — If upstream artifacts are missing, declare gaps before proceeding.
4. **No silent assumptions** — Tag inferences as `[ASSUMPTION]` in artifact files.

## Handoff Protocol

When completing work:

```markdown
## Handoff Summary

**From:** {current-agent}
**To:** {next-agent}
**Status:** complete | partial | blocked

### Artifacts Produced
- `{apf_artifacts}/layer/artifact-name.md` — description

### Key Decisions
- Decision 1 (rationale)

### Open Items for Next Agent
- Item 1

### Recommended Next Action
Invoke `{next-skill}` with context from artifacts above.
```

## Layer Transition Gates

| From Layer | To Layer | Gate Condition |
|---|---|---|
| Founder → Product | Idea validation = GO or CONDITIONAL GO |
| Product → UX | PRD status = final |
| UX → Design | User flows approved |
| Design → Engineering | Design system complete |
| Engineering → Deployment | MVP stories complete, tests passing |
| Deployment → Marketing | App deployed to staging/production |
| Marketing → Growth | Launch assets ready |

## Cursor Delegation Rules

When handing off to Cursor for implementation:

1. Include all relevant artifact paths in the task context
2. Reference specific acceptance criteria IDs
3. Point to design system tokens and component specs
4. Specify file paths and naming conventions from architecture
5. Do NOT include business decisions — those stay in BMAD artifacts

## Resuming Interrupted Workflows

1. Read `{apf_artifacts}/runs/*/run-manifest.yaml`
2. Find last completed phase
3. Load all artifacts from completed phases
4. Resume from next incomplete phase
