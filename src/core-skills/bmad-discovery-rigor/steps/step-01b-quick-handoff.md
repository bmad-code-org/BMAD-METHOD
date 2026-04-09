# Step 1b: Quick Handoff

Use this branch only for Solve/Quick work that still looks simple after a short sanity check. The goal is to avoid over-processing straightforward requests while still guarding against hidden complexity.

## Recovery

Run recovery per workflow.md §RECOVERY PROTOCOL.

## Sanity Check

Ask at most 1-2 questions that could escalate the task out of Quick tier:

- "Is there anything about this that's more complex than it first appears?"
- "Are there constraints or dependencies I should know about?"

**🛑 HALT — Use `vscode_askQuestions` for this gate. In autonomous mode, self-serve from workspace evidence and log the result.**

| Response | Action |
|----------|--------|
| Confirms simple | Proceed to the gut check |
| Reveals complexity | Reclassify to Structured or Full-Formal, update `{outputFile}` frontmatter, the Classification section, and the State Ledger `Class:` entry, then route to `./step-02-interview.md` |

## Gut-Check Reality

Load `../resources/system-reality-categories.csv` and quickly assess the three most relevant categories for this problem. This is a fast sanity sweep, not the full blind-spot pass.

If the gut check surfaces a real gap or dependency, reclassify to Structured, update `{outputFile}` frontmatter, the Classification section, and the State Ledger `Class:` entry, then route to `./step-02-interview.md`.

## Compile Thin Discovery Context

Create `{outputFile}`:

```yaml
---
stepsCompleted: [1, '1b']
activity: 'Solve'
tier: 'Quick'
convergence: [true/false]
discoveryCounter: 0
lastStep: 'step-01b-quick-handoff'
status: 'complete'
---
```

Replace the body with:

```markdown
# Discovery Context

## Classification

- **Activity:** Solve
- **Tier:** Quick
- **Convergence:** [Y/N]
- **Confirmed:** [date]

## Interview Findings

- Quick sanity-check findings: [one-line summary of what the user needs]

## Blind Spots

- Quick gut-check coverage: [the three categories checked] — [none required escalation, or note the issue that forced escalation]

## Research Summary

Not required on the quick path.

## Evidence Manifest

- Workspace files consulted: [list or `none`]
- Commands or logs consulted: [list or `none`]
- Self-served surfaces: [list or `none`]
- External research: none

## Contract Candidates

[If Convergence = Yes: thin seeds for identity, ownership, operator, evidence, compatibility, or migration.
Otherwise: `Not a contract-standardization task.`]

## Verification Strategy

[How downstream work should verify the quick-path recommendation.]

## Open Items

[None, or a concise table of remaining unknowns with owner and next action.]

## Constraints and Non-Goals

[Any constraints or non-goals surfaced during the sanity check.]

## Recommendation

### Discovery Narrative

[One-line summary of why the work remained in Quick tier.]

### Handoff Brief

- [Most important finding]
- [Key constraint or risk]

### Next Skill or Workflow

[Recommended next step — typically `Proceed directly` or a specific skill such as `bmad-create-workflow-contract` when Convergence = Yes]
```

Update and output the final State Ledger, including `Evidence:` and `Skill:`.

## Memory Checkpoint

Per workflow.md §MEMORY CHECKPOINT.

## Next

Discovery complete. Proceed directly or hand off to the recommended skill.
