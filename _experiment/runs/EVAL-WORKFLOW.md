# Evaluate Workflow Efficiency from JSONL Logs

**Read and follow these instructions to produce an eval report comparing two workflow variants.**

---

## Prerequisites

You need JSONL session logs from both the baseline workflow and the variant being evaluated. These are Claude Code conversation logs, typically found at:

```
~/.claude/projects/<project-slug>/<session-uuid>.jsonl
```

Or pre-captured in `_experiment/runs/YYYY-MM-DD-<slug>.jsonl`.

---

## Step 1: Identify Session Logs

For each workflow variant, find the JSONL files that contain actual workflow runs:

```bash
# List recent sessions for this project
ls -lt ~/.claude/projects/<project-slug>/*.jsonl | head -10
```

To confirm a session used a specific workflow, grep for the skill invocation:

```bash
# Example: find sessions that ran quick-dev2
grep -l "bmad-bmm-quick-dev2" ~/.claude/projects/<slug>/*.jsonl
```

**Critical:** A single JSONL file may contain MULTIPLE workflow runs, housekeeping, or unrelated activities. You must identify the exact line boundaries of each workflow run (see Step 2).

---

## Step 2: Establish Workflow Boundaries

A workflow run starts and ends at specific JSONL lines. Everything outside those boundaries is NOT part of the workflow.

**Start boundary:** The slash-command invocation line (e.g., `/bmad-bmm-quick-dev2`). Look for `<command-name>` entries.

**End boundary:** The last workflow-produced action BEFORE the user moves on to housekeeping (saving logs, writing prompts, starting a new task). Typical end markers:
- PR creation
- Final commit
- The user's next non-workflow request ("save the log", "write a prompt", etc.)

**Record boundaries as line numbers:** `start_line` and `end_line` for each run. ALL subsequent analysis must be scoped to these boundaries.

### Multi-Workflow Pipelines

If the baseline requires multiple workflows to complete one task (e.g., quick-spec then quick-dev), each workflow run is a separate JSONL file (or a separate bounded range within one file). Combine their metrics for the total baseline.

---

## Step 3: Count Human Turns

Count every action the user typed during the workflow. The JSONL `type: "user"` entries include many things that are NOT human input. Filter them carefully.

### What IS a human turn (count these)

| Category | Example | Notes |
|----------|---------|-------|
| Slash-command invocations | `/bmad-bmm-quick-dev2`, `/clear` | The user typed these |
| Task input | Issue URL, task description | The actual request |
| Feedback / challenges | "One shot, really?" | Substantive interaction |
| Approvals | "Okay, approve", "Yes" | Checkpoint responses |
| AskUserQuestion answers | (appears as `tool_result` with `"answers"`) | Real human choice, hidden in tool results |
| Mechanical continues | `c`, `f`, `z` | Single-char checkpoint presses |

### What is NOT a human turn (exclude these)

| Category | How to detect |
|----------|--------------|
| Tool results | `tool_result` or `tool_use_id` in first 200 chars of message |
| Skill auto-loads | `IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND` or `Base directory for this skill` |
| System messages | `<local-command-caveat>`, `<local-command-stdout>`, `<bash-input>`, `<bash-stdout>` |
| Interrupts | `[Request interrupted by user]` |
| Resume signals | `Continue from where you left off` |
| Post-workflow housekeeping | Log saving, prompt writing, analysis requests |

### Classify turns into categories

- **Invocation**: Slash commands (`/bmad-bmm-*`, `/clear`, `/output-style`)
- **Substantive**: Real human input with intent or feedback
- **Mechanical**: Single-character checkpoint continues (`c`, `z`, `f`)
- **Quality-improving**: User challenges that caught real issues (a subset of substantive)
- **Context re-establishment**: Turns spent re-explaining intent after a context reset (only in multi-session workflows)
- **Non-workflow**: User manually requesting something the workflow should have done (e.g., "Commit and push. Make PR." when VC isn't automated)

Report total count AND breakdown by category.

---

## Step 4: Count API Turns and Token Usage

### Deduplication is critical

Multiple JSONL lines can share the same `requestId` (thinking, text, tool_use blocks from one API call). Deduplicate by `requestId` before summing.

### Finding the usage field

Usage data can be at two locations in a JSONL entry:
- Top level: `entry["usage"]`
- Nested: `entry["message"]["usage"]`

Check both.

### Token categories to extract

| Field | What it means |
|-------|---------------|
| `input_tokens` | Fresh (non-cached) input tokens |
| `output_tokens` | Model output tokens |
| `cache_creation_input_tokens` | New content added to prompt cache |
| `cache_read_input_tokens` | Cached content re-read this turn |

The per-turn context size is approximately: `input_tokens + cache_creation_input_tokens + cache_read_input_tokens`.

### What to report

- Total API turns (deduplicated by requestId)
- Token totals by category
- Context size at first turn and last turn (to show growth)
- Per-turn average tokens

---

## Step 5: Normalize the Comparison

Before comparing metrics, account for these asymmetries:

### Starting context

If a run started mid-session (carrying prior conversation), its context begins inflated. Note the starting context size. Estimate what a fresh-session run would cost:

```
fresh_estimate = actual_total - (turns × (actual_start_context - fresh_start_context))
```

Where `fresh_start_context` ≈ the baseline's starting context.

### Multi-workflow overhead

If the baseline uses multiple workflows (e.g., quick-spec + quick-dev):
- Count invocation turns for EACH workflow (`/clear`, `/bmad-bmm-*`)
- Note context reset between sessions (fresh initialization cost paid twice)
- Note turns spent re-establishing context in the second session

### Task complexity

Different tasks have different complexity. A 7-file identical edit is not comparable to a multi-file structural refactor. Note this caveat explicitly. The comparison is still valid for structural/overhead differences, but substantive turn counts reflect task complexity, not just workflow efficiency.

### VC operations

Check whether commit/push/PR is part of the workflow or an ad-hoc user request. If one workflow automates VC and the other doesn't, the one without automated VC has an artificially lower turn count.

---

## Step 6: Write the Eval Report

Output to `_experiment/results/<report-name>.md` with this structure:

```markdown
# Eval Report: <Variant> vs <Baseline>

**Date:** YYYY-MM-DD
**Data sources:** (list JSONL files with line boundaries)

## Methodology
- How logs were identified
- Workflow boundaries used
- Comparability caveats

## North Star: Human Turns
- Per-workflow turn table with category breakdown
- Total comparison with delta

## API Turns and Token Usage
- Deduplicated API turn counts
- Token totals by category
- Context growth curves
- Fresh-session estimate if applicable

## Where <Variant> Is Better / Worse / Equivalent

## Recommendations (prioritized by north star impact)

## Summary Scorecard
```

---

## Pitfalls to Avoid

1. **Never use the full JSONL file without boundaries.** A session file may contain multiple runs, housekeeping, and unrelated activities.

2. **Never count tool results as human turns.** They are the most common source of inflation — a 50-turn session might show 200+ "user" entries because every tool call generates a tool_result.

3. **Never compare tokens without deduplication.** Raw JSONL token sums can be 2-3x inflated due to multiple lines per API call.

4. **Never ignore starting context.** A mid-session run at 62K context costs more per turn than a fresh run at 24K. This is session placement, not workflow design.

5. **Never assume workflow = session.** One session can contain multiple workflows; one workflow can span multiple sessions.
