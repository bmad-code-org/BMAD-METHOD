# Step 5: Handoff

Compile the final Discovery Context, verify that the discovery work is complete enough to trust, and recommend the next workflow. Do not execute the downstream work here.

## Recovery

Run recovery per workflow.md §RECOVERY PROTOCOL.

## Optional Quality Pass

Check workflow.md §QUALITY ENHANCEMENT. Invoke only the installed skills that materially improve the handoff.

## Compile the Discovery Context

Read `{outputFile}` and replace the working notes with a final Discovery Context using this fixed heading order:

```markdown
# Discovery Context

## Classification
## Interview Findings
## Blind Spots
## Research Summary
## Evidence Manifest
## Contract Candidates
## Verification Strategy
## Open Items
## Constraints and Non-Goals
## Recommendation

### Discovery Narrative
### Handoff Brief
### Next Skill or Workflow
```

Populate those sections with the following content:

| Section | What to include |
|---------|-----------------|
| Classification | Activity, tier, convergence flag, and reasoning from step 1 |
| Interview Findings | The key answers, contradictions resolved, and remaining unknowns from step 2 |
| Blind Spots | Resolved items, deferred items with rationale, and any still-open gaps from step 3 |
| Research Summary | Step 4 findings, or `Not required` when research was not needed |
| Evidence Manifest | Workspace files, commands, logs, self-served surfaces, and any external sources consulted across the run |
| Contract Candidates | For convergence work: identity, ownership, operator, evidence, compatibility, and migration seeds |
| Verification Strategy | How downstream work should prove correctness; include traceability expectations for Structured or Full-Formal work |
| Open Items | Items with type, owner, and next action |
| Constraints and Non-Goals | Scope boundaries confirmed during discovery |
| Recommendation | Discovery narrative, handoff brief, and the next skill or workflow to run |

Compile `Evidence Manifest` and `Open Items` from the running State Ledger and step outputs rather than reconstructing them ad hoc at the end.

## Verify Before Handoff

Run this checklist against the compiled document:

| # | Check |
|---|-------|
| 1 | Problem statement unambiguous — no competing interpretations |
| 2 | Constraints explicit (stated or confirmed `none`) |
| 3 | Non-goals documented |
| 4 | Blind spots addressed or deferred with rationale |
| 5 | All applicable System Reality Categories swept |
| 6 | Discovery Counter < 2, or research completed and the counter reset |
| 7 | Verification strategy identified for downstream work |
| 8 | Evidence Manifest populated |
| 9 | Open items have owner and next action |
| 10 | If Convergence = Yes, contract candidates recorded |

**🛑 If any check fails — state which one failed, explain why, and ask how to proceed. Do not hand off until the gap is resolved or explicitly deferred.**

## Save and Recommend

Update `{outputFile}` frontmatter:

```yaml
stepsCompleted: [1, 2, 3, 5] # or [1, 2, 3, 4, 5] if research conducted
discoveryCounter: [N]
lastStep: 'step-05-handoff'
status: 'complete'
```

Replace the document body with the compiled Discovery Context.

Discover available skills from `{project-root}/_bmad/_config/bmad-help.csv` if it exists:

1. Load the CSV and ignore `_meta` rows.
2. Use `phase`, `name`, `code`, `description`, `workflow-file`, and `command` as routing surfaces.
3. Rank candidate rows by alignment with the classification, convergence signal, open items, and the kind of downstream artifact needed.
4. Recommend the strongest fit, then record it in `State Ledger Skill:`.

Fallback routing:

| Signal | Skill |
|--------|-------|
| Convergence = Yes | `bmad-create-workflow-contract` |
| Build + architecture | `bmad-create-architecture` |
| Build + product definition | `bmad-create-prd` |
| Execute + implementation | `bmad-sprint-planning` or `bmad-create-story` |
| Solve + Quick | Proceed directly |

Present the completion summary with saved location, recommended next skill, and a reminder that the Discovery Context should inform downstream execution.

**🛑 HALT — Use `vscode_askQuestions` to confirm whether to proceed with the recommended handoff or adjust it. In autonomous mode, self-serve and log the decision.**

## Final State Ledger

Output the final State Ledger with all step summaries, including `Evidence:` and `Skill:`.

## Memory Checkpoint

Per workflow.md §MEMORY CHECKPOINT. Additionally:

- **persist** | scope: workspace | key: learned-patterns | caller: "discovery-rigor"
- Content: reusable insights from this discovery run
