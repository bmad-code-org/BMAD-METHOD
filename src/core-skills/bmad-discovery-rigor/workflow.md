---
outputFile: '{output_folder}/discovery-context.md'
---

# Discovery Rigor Workflow

This workflow creates a Discovery Context before execution work begins. Use it when the cost of acting on assumptions is high: ambiguous diagnosis, high-stakes delivery, or convergence work that needs explicit boundaries before implementation.

Keep each step self-contained so the workflow survives context compression. `{outputFile}` frontmatter and the State Ledger are the canonical recovery surfaces, and every step should be able to resume cleanly from them. Speak in `{communication_language}`.

## Step Sequence

| Step | File | Purpose | Conditional |
|------|------|---------|-------------|
| 1 | `step-01-classify.md` | Determine the problem type, discovery depth, and convergence signal | No |
| 1b | `step-01b-quick-handoff.md` | Collapse the workflow for Solve/Quick work after a sanity check | Yes — Solve/Quick only |
| 2 | `step-02-interview.md` | Close the highest-value information gaps | No |
| 3 | `step-03-blind-spots.md` | Sweep applicable System Reality Categories | No |
| 4 | `step-04-research.md` | Resolve unknowns that block a reliable handoff | Yes — Discovery Counter ≥ 2 or evidence-depth override |
| 5 | `step-05-handoff.md` | Compile, verify, and route the Discovery Context | No |

## STATE LEDGER

Maintain this compact summary across the run. Update it whenever a halt gate or state change materially changes the discovery picture.

```
State Ledger
---
Problem: [one-line summary]
Class: [activity] | [tier] | Convergence: [Y/N] | Domains: [fragments]
Position: [current] ✅ → [next] [N/5]
Counter: [N]
Findings: [one-line per step]
Evidence: [files, commands, logs, and self-served surfaces consulted]
Open: [unresolved items]
Decisions: [key decisions]
Skill: [recommended downstream skill or Proceed directly]
```

## RECOVERY PROTOCOL

At every step entry, before doing anything else:

| `{outputFile}` exists? | `stepsCompleted` match memory? | Action |
|------------------------|-------------------------------|--------|
| No | — | Fresh run — proceed normally |
| Yes | Match | Proceed normally |
| Yes | Mismatch | Context compressed — reconstruct the State Ledger from file, announce the recovery, then continue from the recovered state |
| Yes, status: complete | — | Ask: re-run or use existing? |

## AUTONOMOUS MODE

When user requests autonomous execution (e.g., "just investigate", "autonomous mode"):

| Behavior | Rule |
|----------|------|
| Step sequence | Run every step — no skipping |
| Gate answers | Self-serve from workspace evidence |
| Logging | 🔍 prefix in State Ledger for self-served items |
| Halting | Only halt for genuinely unresolvable inputs |
| Summary | `🔍 Self-served: [step] ([N]/[M] resolved via [method]). Unresolved: [items].` |

## DOMAIN FRAGMENT LOADING

Load fragments just in time at steps 2 and 3. Step 1 identifies the likely domains; later steps load only what they need.

| Condition | Fragment | Path |
|-----------|----------|------|
| Tier is Structured or Full-Formal | Structured reasoning | `./resources/structured-reasoning.md` |
| Tier is Full-Formal | Formal readiness probe | `./resources/formal-readiness.md` |
| Domain is software | Software engineering | `./resources/software-engineering.md` |
| Domain is LLM/agent | LLM systems | `./resources/llm-systems.md` |

Check `./resources/discovery-resources-index.csv` for the full index. Record applicable fragments in State Ledger `Decisions:`.

## MEMORY CHECKPOINT

Use `bmad-memory-manager` as the durable sidecar for recovery support. `{outputFile}` remains the canonical workflow artifact.

| Event | Operation |
|-------|-----------|
| After each completed step | `persist | scope: session | key: state-ledger | caller: "discovery-rigor"` with current frontmatter + State Ledger |
| Recovery mismatch | `recover | scope: session | key: state-ledger | caller: "discovery-rigor"` |
| Workflow completion | `persist | scope: workspace | key: learned-patterns | caller: "discovery-rigor"` with reusable insights from the run |

## QUALITY ENHANCEMENT

Optional skill invocations. Evaluate them at step 5 entry only, after the core discovery work is already present.

| Condition | Skill to invoke | Input | What it adds |
|-----------|----------------|-------|-------------|
| Interview findings accepted too readily | `bmad-advanced-elicitation` | Interview Q&A | Pushes for refinement |
| Blind-spot coverage thin | `bmad-review-edge-case-hunter` | Findings so far | Walks branching paths sweep missed |
| High-stakes or many open items | `bmad-review-adversarial-general` | Full Discovery Context | Adversarial review |
| Output > 2000 words | `bmad-distillator` | Saved Discovery Context | Compressed handoff version |

Skip any skill that is not installed.

## MULTI-RUN ISOLATION

| Condition | Action |
|-----------|--------|
| Single investigation | Use `{outputFile}` directly |
| Multiple concurrent | Use `{output_folder}/discovery-context-{topic-slug}.md` per run; add `runId` to frontmatter |

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/core/config.yaml` and resolve:

- `user_name`, `output_folder`, `communication_language`
- `date` as system-generated current datetime

### Check for Existing Work

Check `{outputFile}` per §RECOVERY PROTOCOL table.

### Route to First Step

Read fully and follow: `./steps/step-01-classify.md`
