# Step 3: Finalization and Handoff

Verify that the contract is complete enough to trust, run any final challenge pass that adds value, then save the contract and recommend the next workflow.

## Recovery

Check `{outputFile}` frontmatter per workflow.md step sequence. If context was compressed, recover and announce the recovered state.

## Verify the Contract

Verify each item against `{outputFile}`:

| # | Check | How to verify |
|---|-------|--------------|
| 1 | Systems in Scope populated | At least one system row with role and owner |
| 2 | At least one contract section defined | Non-empty contract content exists |
| 3 | Each contract section has frozen marker | `<!-- frozen-after-approval -->` present |
| 4 | Inline compliance questions present | Each contract has at least one compliance question |
| 5 | Boundaries and Constraints populated | At least one row in each category |
| 6 | No placeholder text remaining | No `[TODO]`, `[TBD]`, or `{{...}}` anywhere in the document, including frontmatter and title |
| 7 | Cross-contract consistency verified | Step 2 consistency check was completed |

If any check fails, state which one failed, explain why, and ask how to proceed.

**🛑 HALT if any check fails — use `vscode_askQuestions` to resolve or explicitly defer the failure before finalizing. In autonomous mode, self-serve and log the decision.**

## Optional Adversarial Review

If `bmad-review-adversarial-general` is available, invoke it against the compiled contract to look for unstated assumptions, missing boundaries, ambiguous ownership, or unverifiable claims.

If findings are returned, present them to the user, use `vscode_askQuestions` to resolve or explicitly defer them, and do not proceed to save until that gate is complete. In autonomous mode, self-serve the most defensible resolution from workspace evidence and log it.

Skip this pass if the skill is not installed or the contract is straightforward.

## Save and Recommend Next Steps

Update `{outputFile}` frontmatter:

```yaml
stepsCompleted: [1, 2, 3]
status: 'complete'
completedDate: '{date}'
lastStep: 'step-03-finalize'
```

Recommend the next workflow based on contract content:

| Contract content signals | Recommended skill | Reason |
|-------------------------|-------------------|--------|
| Implementation slices in input docs | `bmad-sprint-planning` | Plan implementation of the contract |
| Architecture decisions still needed | `bmad-create-architecture` | Design the system that fulfills the contract |
| Story creation still needed | `bmad-create-epics-and-stories` | Break the contract into implementation stories |
| Came directly from discovery | Note the discovery lineage | Contract is now ready for the next phase |

Present a completion summary with systems in scope, contracts defined, compliance question count, boundary rules, saved location, and recommended next step. Note that downstream skills should load this contract as reference.

**🛑 Workflow contract workflow complete.**
