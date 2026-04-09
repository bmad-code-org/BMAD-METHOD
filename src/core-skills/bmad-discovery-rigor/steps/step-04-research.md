# Step 4: Research (Conditional)

Enter this step only when unresolved unknowns justify deeper investigation or convergence work needs more evidence. Research should stay targeted: resolve the gaps blocking a reliable handoff rather than broadening scope.

## Recovery

Run recovery per workflow.md §RECOVERY PROTOCOL. Confirm `discoveryCounter ≥ 2` or that `researchReason: 'evidence-depth-override'` from step 3 justified research.

## Build the Research Plan

List every gap that incremented the counter, or when `researchReason: 'evidence-depth-override'`, list the contract-candidate or blind-spot evidence gaps that triggered the override even if they did not increment the counter:

```markdown
**Unresolved gaps requiring research:**
1. [Source: Interview/Blind-spot] — [What is unknown]
```

Create a compact plan:

| # | Gap | Approach | Owner |
|---|-----|----------|-------|
| 1 | [gap] | Workspace search / User input / External reference | Agent / User |

For deeper investigation, consider invoking `bmad-domain-research` for domain gaps or `bmad-technical-research` for architecture and technology gaps when those skills are installed.

## Resolve Gaps

Use this routing table per gap:

| Gap type | Action |
|----------|--------|
| Workspace-resolvable | Search, read, and present evidence |
| User-resolvable | Ask targeted questions with `vscode_askQuestions` and wait for response |
| External | Mark deferred and note the required external input |

**🛑 After each gap — Use `vscode_askQuestions` to confirm whether the gap is resolved or more evidence is needed. In autonomous mode, self-serve and log the decision.**

When the planned gaps are addressed, present a compact satisfaction check:

```markdown
**Research summary:**

| # | Gap | Status | Resolution |
|---|-----|--------|------------|
| 1 | [gap] | ✅ Resolved / ⏸️ Deferred | [summary] |

**Satisfied to proceed?**
```

**🛑 HALT — Use `vscode_askQuestions` for the satisfaction check. In autonomous mode, self-serve from workspace evidence and log the result.**

| Response | Action |
|----------|--------|
| Satisfied | Reset Counter to 0 and proceed |
| Not satisfied | Identify the remaining gaps and iterate |

## Update State

Reset the Discovery Counter to 0.

Update `{outputFile}` frontmatter:

```yaml
stepsCompleted: [1, 2, 3, 4]
discoveryCounter: 0
researchReason: 'resolved'
lastStep: 'step-04-research'
```

Append:

```markdown
## Research

| # | Gap | Source | Resolution | Status |
|---|-----|--------|------------|--------|
| 1 | [gap] | [interview/blind-spot] | [resolution] | ✅ / ⏸️ |

**Discovery Counter reset:** [previous] → 0
```

Update and output the State Ledger. Record any files, commands, logs, and self-served surfaces consulted during research in `Evidence:`.

## Memory Checkpoint

Per workflow.md §MEMORY CHECKPOINT.
