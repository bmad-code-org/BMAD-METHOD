# Step 3: Blind-Spot Sweep

Sweep the problem across the applicable System Reality Categories so hidden risks, missing constraints, and unspoken failure modes become explicit before handoff. If any single unknown directly threatens safety, security, or data integrity, route to research regardless of Counter.

## Recovery

Run recovery per workflow.md §RECOVERY PROTOCOL.

## Load Sweep Context

Load `../resources/system-reality-categories.csv` and any domain fragments already identified in the State Ledger.

Filter categories using this table:

| `applies_when` value | Include? |
|---------------------|----------|
| always | Yes — always probe |
| software | Only if software domain |
| convergence | Only if Convergence = Yes |

When in doubt, include the category; false positives are safer than missed blind spots.

## Sweep and Triage

For each applicable category, assess:

- Does the problem statement already address this?
- Did the interview surface information here?
- Is there an unaddressed gap a domain expert would flag?

Each blind spot should state **what is missing**, **why it matters**, and **which category** it belongs to.

Present blind spots in batches of up to 5:

```markdown
**Blind spots identified:**
1. **[Category]:** [Gap] — [Impact]

For each: intentional, should address, or can't assess?
```

**🛑 HALT — Use `vscode_askQuestions` to collect responses for each blind spot. In autonomous mode, self-serve from workspace evidence and log the resolutions.**

Process responses with this table:

| Response | Action |
|----------|--------|
| Intentional / Deferred | Mark deferred with rationale |
| Address it | Add to Open Items with type, owner, and next action for downstream |
| Can't assess / Don't know | Increment Counter. Log: `Counter: [N-1] → [N] (Blind-spot: [category])` |
| Contradicts earlier finding | Challenge the contradiction and resolve it before continuing |

Use these deferral criteria:

| Defer when | Do NOT defer when |
|------------|-------------------|
| Out of scope for the current problem | Directly affects the problem being solved |
| Requires a separate discovery run | Security or safety concern |
| Would expand scope beyond stated constraints | Would make downstream work unreliable |

**Autonomous mode:** self-assess from workspace evidence with a `🔍` prefix. Only increment Counter for genuinely unresolvable gaps.

If all findings cluster in one category, explicitly re-sweep the remaining categories before proceeding.

## Route and Update State

Choose the next step with this routing table:

| Condition | Route to |
|-----------|----------|
| Counter ≥ 2 | `step-04-research` and set `researchReason: 'counter'` |
| Counter < 2, Convergence = Yes, and contract candidates still need workspace evidence | `step-04-research` and set `researchReason: 'evidence-depth-override'` |
| Counter < 2 | `step-05-handoff` and set `researchReason: 'none'` |

Update `{outputFile}` frontmatter:

```yaml
stepsCompleted: [1, 2, 3]
discoveryCounter: [N]
researchReason: '[counter|evidence-depth-override|none]'
lastStep: 'step-03-blind-spots'
```

Append:

```markdown
## Blind Spots

| # | Category | Gap | Impact | Resolution |
|---|----------|-----|--------|------------|
| 1 | [category] | [gap] | [impact] | ✅ Address / ⏸️ Deferred / ❓ Unknown |

**Discovery Counter after sweep:** [N]
```

Update and output the State Ledger. Record any files, commands, logs, and self-served surfaces consulted during the sweep in `Evidence:`.

## Memory Checkpoint

Per workflow.md §MEMORY CHECKPOINT.
