# Step 2: Interview

Close the highest-risk information gaps before blind-spot analysis. Ask only the questions that materially improve the next decision, and use small batches so the user can answer precisely. If any single unknown directly threatens safety, security, or data integrity, treat it as a research override regardless of Counter.

## Recovery

Run recovery per workflow.md §RECOVERY PROTOCOL.

## Load Interview Context

Load any domain fragments named in State Ledger `Decisions:`.

If tier is Full-Formal, also load `../resources/formal-readiness.md` and fold only the relevant probes into the question set. They count toward the total question budget rather than creating a second interview.

## Ask and Process Batches

Formulate 3-6 questions targeting:

- Missing information needed to proceed confidently
- Assumptions you would otherwise make silently
- Unstated constraints, scope boundaries, and non-goals
- Prior work, existing context, or related artifacts
- If Activity = Build: alternative approaches the user may not have considered

Present 2-3 questions at a time.

**🛑 HALT — Use `vscode_askQuestions` in batches of 2-3. In autonomous mode, self-serve from workspace evidence and log the answers.**

Process each response with this table:

| Response type | Action |
|--------------|--------|
| Clear answer | Record the finding |
| "I don't know" | Increment Counter. Log: `Counter: [N-1] → [N] (Interview: [gap])` |
| Contradicts earlier info | Challenge the contradiction and wait for resolution |
| Ambiguous | Ask a follow-up; do not interpret silently |

**Autonomous mode:** self-serve from workspace evidence with a `🔍` prefix. Only increment Counter for genuinely unresolvable gaps.

If more questions remain, present the next batch and repeat the same halt-and-process loop.

## Final Check and State Update

Ask: **🛑 HALT — Use `vscode_askQuestions` to ask whether there are other details worth capturing before blind-spot analysis. In autonomous mode, self-serve from workspace evidence and log the result.**

Update `{outputFile}` frontmatter:

```yaml
stepsCompleted: [1, 2]
discoveryCounter: [N]
lastStep: 'step-02-interview'
```

Append:

```markdown
## Interview Findings

| # | Question | Answer | Status |
|---|----------|--------|--------|
| 1 | [question] | [answer] | ✅ Resolved / ❓ Unknown |

**Discovery Counter:** [N]
```

Update and output the State Ledger. Record any files, commands, logs, and self-served surfaces consulted during the interview in `Evidence:`.

## Memory Checkpoint

Per workflow.md §MEMORY CHECKPOINT.
