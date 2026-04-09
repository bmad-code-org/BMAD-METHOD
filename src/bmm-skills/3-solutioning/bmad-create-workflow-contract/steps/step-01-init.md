# Step 1: Initialization

Establish whether this contract is grounded in enough upstream context, identify the systems and boundaries in scope, and choose the approval cadence that fits the number of surfaces to define.

## Recovery

If `{outputFile}` exists, recover per workflow.md §RECOVERY PROTOCOL.

## Gather Inputs

Search in `{planning_artifacts}/**`, `{output_folder}/**`, and `{project_knowledge}/**` when that path is configured:

| Document Type | Glob Pattern | Priority |
|--------------|-------------|----------|
| Discovery Context | `*discovery-context*.md` | Primary — may already contain Contract Candidates |
| Architecture | `*architecture*.md` | High — system boundaries and technical decisions |
| PRD | `*prd*.md` | Medium — requirements and constraints |
| Technical Design | `*tech-spec*.md`, `*technical-design*.md` | Medium — implementation details and tradeoffs |
| Epics / Stories | `*epic*.md`, `*stor*.md` | Low — implementation slices |

Before loading document contents, present the discovered candidates and use `vscode_askQuestions` to confirm which documents are in scope. In autonomous mode, self-serve the scope selection from workspace evidence and log it.

For sharded folders, load `index.md` first and then the relevant shards from the selected documents.

Use these loading rules:

- Load every discovered file the user confirms is in scope.
- Treat Discovery Context as the strongest seed source; check it for a **Contract Candidates** section.
- Track loaded files in frontmatter `inputDocuments`.

Minimum input check:

| Condition | Action |
|-----------|--------|
| At least one of Discovery Context, Architecture, or Technical Design loaded and confirmed in scope | Proceed |
| None found | Halt: `A Workflow Contract needs upstream context. Please run bmad-discovery-rigor, bmad-create-architecture, or provide a technical design first.` |

From the loaded documents, extract:

- **Contract Candidates** from Discovery Context when present
- **Systems, repos, or services** named across the source material
- **Boundaries** between components or stages
- **Identity schemes** such as IDs, aliases, paths, or manifest names

Build a preliminary systems map:

| System / Repo | Role (Producer / Consumer / Both) | Repo / Location | Owner |
|--------------|-----------------------------------|-----------------|-------|

## Select Mode and Initialize Output

Load `../resources/contract-surface-types.csv` and count how many contract surfaces need definition based on the seeded candidates, systems, and boundaries.

| Surface count | Mode | Behavior |
|--------------|------|----------|
| ≤ 3 | Lightweight | Single halt gate per step; compact presentation |
| > 3 | Full | Per-surface halt gates; batch presentation |

Copy `../workflow-contract-template.md` to `{outputFile}` and update frontmatter:

- Replace `{{project_name}}`, `{{user_name}}`, and `{{date}}` placeholders in the copied template before writing it.
- Render the document title with the resolved project name so the initialized file contains no leftover template placeholders.
- Write the preliminary systems map into the `## Systems in Scope` table immediately so recovery and later verification use saved state rather than reconstructed notes.

```yaml
stepsCompleted: [1]
inputDocuments: [list of loaded files]
mode: '[lightweight or full]'
surfaceCount: [count]
lastStep: 'step-01-init'
```

Present the documents loaded, contract candidates seeded, systems identified, and selected mode with surface count.

**🛑 HALT — Use `vscode_askQuestions` to confirm the selected scope and mode before proceeding. In autonomous mode, self-serve and log the decision.**
