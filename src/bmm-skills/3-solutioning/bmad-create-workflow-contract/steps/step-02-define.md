# Step 2: Contract Surface Discovery and Definition

Turn the systems map into explicit contract surfaces, let the user triage which ones belong in this document, then define each included surface with evidence-ready compliance questions. Mark each confirmed section frozen with `<!-- frozen-after-approval -->`.

## Recovery

Recover per workflow.md §RECOVERY PROTOCOL. If context was compressed, announce the recovered state before proceeding.

## Enumerate and Triage Surfaces

Load `../resources/contract-surface-types.csv`. For each system boundary from step 1, probe each surface type with this taxonomy:

| Surface Type | Probe Question |
|-------------|---------------|
| identity | How are entities named across this boundary? Stable IDs or context-dependent? |
| ownership | Who produces, consumes, and owns each artifact or config? |
| operator | What commands does an operator run? Which configs and state transitions matter? |
| evidence | What proves correctness, and where does that evidence land? |
| compatibility | What backward-compatibility rules apply? Versioning? Drift detection? |
| migration | Is there a transition period, and do old and new systems coexist? |

Apply `when_applicable` from the CSV with this filter:

| when_applicable value | Include? |
|----------------------|----------|
| always | Yes — probe for every boundary |
| when_multiple_versions | Only if versioning or parallel versions exist |
| when_migrating | Only if a migration is in progress or planned |

Zero-surface guard:

| Surfaces found | Action |
|----------------|--------|
| 0 | Halt: `No contract surfaces were discovered from the input documents. This usually means either the systems in scope do not have cross-boundary contracts to define, or the source material does not describe boundaries clearly enough. Consider invoking bmad-discovery-rigor before returning here.` |
| ≥ 1 | Proceed to presentation |

Present discovered surfaces in a table:

| # | Boundary | Surface Type | Source | Status |
|---|----------|-------------|--------|--------|
| 1 | [system → system] | [type] | Seeded / New | [pending] |

Ask the user to triage each surface as:

- **Include** — define it formally in this contract
- **Defer** — acknowledge it but leave it out of this document
- **N/A** — the boundary or surface does not actually apply

**🛑 HALT — Use `vscode_askQuestions` to collect Include / Defer / N/A decisions. In autonomous mode, self-serve from workspace evidence and log the triage.**

## Draft and Confirm Contracts

Work through included surfaces in the CSV `definition_order` (identity → ownership → operator → evidence → compatibility → migration).

For each included surface:

- Draft the contract using the CSV `table_columns`
- Add 2-3 inline compliance questions that can be answered with evidence and cover the happy path plus at least one edge case
- Make those compliance questions specific to the actual contract content, not generic templates
- Highlight any places where the input documents were silent or contradictory
- Present the draft for confirmation

Mode-dependent presentation:

| Mode | Presentation |
|------|-------------|
| Lightweight (≤3 surfaces) | Present all drafted contracts at once, then single halt |
| Full (>3 surfaces) | Present one contract at a time, halt after each |

**🛑 HALT — Use `vscode_askQuestions` for contract confirmation per the mode rules above. In autonomous mode, self-serve from workspace evidence and log the result.**

On confirmation, mark the section frozen with `<!-- frozen-after-approval -->`.

## Verify Consistency and Update Document

After all contracts are defined, verify consistency across them:

| Check | What to verify |
|-------|---------------|
| Identity ↔ Operator | Do operator commands use the canonical names from Identity? |
| Ownership ↔ Operator | Does the owning entity also run or authorize the operator commands it owns? |
| Operator ↔ Evidence | Do operator outputs land where Evidence expects to find them? |
| Evidence ↔ Compatibility | Does drift detection inspect the locations where evidence is produced? |

If inconsistencies appear, present them and ask the user to resolve them with `vscode_askQuestions` before continuing. In autonomous mode, self-serve the most defensible resolution from workspace evidence and log it.

Write all confirmed contract sections and their inline compliance questions to `{outputFile}`.

Populate the **Boundaries and Constraints** table:

| Category | Rule |
|----------|------|
| Always | [rules that must always hold — from confirmed contracts] |
| Ask First | [rules that need human judgment case by case] |
| Never | [hard prohibitions — from contracts and constraints] |

Update frontmatter:

```yaml
stepsCompleted: [1, 2]
lastStep: 'step-02-define'
```

Present:

```markdown
**All contracts defined.** {N} contract sections frozen with {M} compliance questions.

[C] Continue to finalization
```

**🛑 HALT — Use `vscode_askQuestions` to confirm continuation into finalization. In autonomous mode, self-serve and log the decision.**
