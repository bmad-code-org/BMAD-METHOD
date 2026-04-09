---
outputFile: '{planning_artifacts}/workflow-contract.md'
---

# Workflow Contract Workflow

This workflow turns discovery, architecture, or design context into an explicit workflow or operator contract. Use it when interface drift, cross-repo coordination, or migration risk make implicit knowledge too expensive.

Keep each step self-contained so the workflow can recover cleanly from context compression. Mode selection changes approval cadence, not contract quality: lightweight mode batches decisions; full mode slows down to protect boundary accuracy.

## Step Sequence

| Step | File | Purpose | Conditional |
|------|------|---------|-------------|
| 1 | `step-01-init.md` | Gather grounded inputs, detect existing work, and select mode | No |
| 2 | `step-02-define.md` | Discover surfaces, define contracts, and add inline compliance questions | No |
| 3 | `step-03-finalize.md` | Verify completeness, save the contract, and recommend next steps | No |

## Recovery Protocol

| Condition | Action |
|-----------|--------|
| `{outputFile}` missing | Fresh run — start at step 1 |
| `{outputFile}` exists with `status: 'complete'` | Ask whether to reuse or rerun |
| `stepsCompleted: [1]` | Reconstruct `inputDocuments`, `mode`, `surfaceCount`, and the current systems map, then resume at step 2 |
| `stepsCompleted: [1, 2]` | Reconstruct confirmed contract sections, frozen markers, and Boundaries and Constraints, then resume at step 3 |
| Frontmatter and document body conflict | Present the mismatch, then ask whether to repair or restart |

### Mode Selection (determined in Step 1)

| Condition | Mode | Behavior |
|-----------|------|----------|
| ≤ 3 contract surfaces to define | Lightweight | Single halt gate per step; surfaces + contracts in one pass |
| > 3 contract surfaces to define | Full | Per-surface halt gates; batch presentation |

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `output_folder`, `planning_artifacts`, `project_knowledge`, `user_name`
- `communication_language`, `document_output_language`
- `date` as system-generated current datetime

### Resource Loading

Load `./resources/contract-surface-types.csv` — this drives which contract types are available and the definition order.

## EXECUTION

Read fully and follow: `./steps/step-01-init.md`
