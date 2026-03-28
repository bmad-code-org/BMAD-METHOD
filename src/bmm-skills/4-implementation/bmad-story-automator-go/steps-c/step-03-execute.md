---
nextStep: './step-03a-execute-review.md'
dataFileIndex: '../data/data-file-index.md'
scriptsDir: '../bin/story-automator'
outputFolder: '{output_folder}/story-automator'
stateFilePattern: '{outputFolder}/orchestration-*.md'
outputFile: '{outputFolder}/orchestration-{epic_id}-{timestamp}.md'
retryStrategy: '../data/retry-fallback-strategy.md'
executionPatterns: '../data/execution-patterns.md'
subagentPrompts: '../data/subagent-prompts.md'
---

## 🚨 CRITICAL: Load Data File Index FIRST

**BEFORE ANY EXECUTION**, load and read `{dataFileIndex}` completely.
**DO NOT proceed until you have read the index and loaded the required files.**

---
Set: `scripts="{scriptsDir}"`

## 🚨 CRITICAL: CLI Contract Check (Interface Drift Guard)

Before running any story loop logic, verify required helper commands/flags still exist.

```bash
# Core command availability
"$scripts" tmux-wrapper --help >/dev/null
"$scripts" monitor-session --help >/dev/null
"$scripts" orchestrator-helper --help >/dev/null

# Required spawn contract: --command must exist
"$scripts" tmux-wrapper spawn --help | grep -q -- "--command"

# Build command contract must be available
"$scripts" tmux-wrapper build-cmd --help >/dev/null
```

If any check fails: **STOP and escalate immediately** with "helper CLI contract changed".

---

# Step 3: Execute Build Cycle

**Goal:** Autonomously execute all stories. Escalate only when decisions needed.
**Interaction mode:** Deterministic autonomous execution.

---

## Setup

Load from state document (located via `{stateFilePattern}`; output folder `{outputFolder}`; resolved path stored as `{outputFile}` for this run):
- `storyRange`, `currentStory`, `currentStep`
- `overrides` (skipAutomate, maxParallel)
- `customInstructions`

Resolve agent configuration using deterministic agents file (see `{retryStrategy}` for full function):
```bash
state_file="{outputFile}"
# resolve_agent_for_task "{task}" "$state_file" "{story_id}" -> sets primary_agent,fallback_agent
```

**IF resuming** (currentStory set): Skip to that point in loop.
**IF fresh**: Display "**Starting build cycle for {count} stories...**"

## 🚨 CRITICAL: Execution Patterns

**BEFORE executing any steps, read `{executionPatterns}` for:**
- FORBIDDEN patterns (never chain multiple workflow steps)
- REQUIRED patterns (verify state after each step)
- Monitoring failure fallback sequence

**Key rule:** Each step (create/dev/auto/review) MUST be executed and monitored separately. NEVER chain steps in loops.

## Story Loop

> **⚠️ SPAWN PATTERN - READ THIS:**
> Every `story-automator tmux-wrapper spawn` call **MUST** include `--command` with the built command:
> ```bash
> session=$("$scripts" tmux-wrapper spawn {step} {epic} {story_id} \
>   --agent "$agent" \
>   --command "$("$scripts" tmux-wrapper build-cmd {step} {story_id} --agent "$agent")")
> ```
> **Missing `--command` = session sits idle → `never_active` failure!**

**FOR EACH story in range:**

```bash
"$scripts" orchestrator-helper state-update "$state_file" \
  --set currentStory={story_id} --set currentStep=step-03-execute \
  --set lastUpdated="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "- **[$(date -u +%Y-%m-%dT%H:%M:%SZ)]** Starting story {story_id}" >> "$state_file"

# Initialize Story Progress row
sed -i '' "/<!-- Progress rows/i\\
| {story_id} | - | - | - | - | - | in-progress |" "$state_file"
```

Display: "**Story {N}/{total}: {title}**"
Use compact operator output format for routine progress:
```text
[story {N}/{total}] {step} -> {state} (agent={agent}, retries={attempts})
```
After any session completes (create/dev/auto/review): `"$scripts" tmux-wrapper kill "$session"`

**MANDATORY log pre-filter (all sessions):** Before any deep parsing, pre-filter logs with a single grep/regex pass and pass only focused output forward.
```bash
log_file=$(echo "$result" | jq -r '.output_file')
log_focus=$(grep -nE "SUCCESS|FAIL|ERROR|CRITICAL|WARN|RETRY|ESCALATE" "$log_file" | head -n 120)
if [ -z "$log_focus" ]; then
  log_focus=$(tail -n 120 "$log_file")
fi
```
If multiple logs exist, run one grep/regex pass across all log files and forward only matched lines + file names.

**Compact result contract (required):**
- Return only: `next_action`, `confidence`, `error_class`, `retryable`, `reasons`, `session_id`
- Do not pass full raw logs to parent flow unless escalation explicitly requires evidence payload

### A. Create Story
*Skip if story file exists*

**Apply retry/fallback pattern from `{retryStrategy}`:** Up to 5 attempts, alternating agents, network-aware delays.

```bash
before=$("$scripts" validate-story-creation count {story_id})
# Retry loop: see {retryStrategy}
session=$("$scripts" tmux-wrapper spawn create {epic} {story_id} \
  --agent "$current_agent" \
  --command "$("$scripts" tmux-wrapper build-cmd create {story_id} --agent "$current_agent")")
result=$("$scripts" monitor-session "$session" --json --agent "$current_agent")
"$scripts" tmux-wrapper kill "$session"
after=$("$scripts" validate-story-creation count {story_id})
validation=$("$scripts" validate-story-creation check {story_id} --before $before --after $after)
```

- If `validation.valid == true`:
  ```bash
  # Update Story Progress: mark create-story done
  sed -i '' "s/^| ${story_id} |.*$/| ${story_id} | done | - | - | - | - | in-progress |/" "$state_file"
  ```
  → proceed to B
- If `validation.valid == false` AND attempts < 5 → retry with next agent (see `{retryStrategy}`)
- If `validation.valid == false` AND attempts == 5 → escalate (all retries exhausted)

### B. Dev Story

**Apply retry/fallback pattern from `{retryStrategy}`:** Up to 5 attempts, alternating agents.

```bash
# Retry loop with agent alternation: see {retryStrategy}
session=$("$scripts" tmux-wrapper spawn dev {epic} {story_id} \
  --agent "$current_agent" \
  --command "$("$scripts" tmux-wrapper build-cmd dev {story_id} --agent "$current_agent")")
result=$("$scripts" monitor-session "$session" --json --agent "$current_agent")
"$scripts" tmux-wrapper kill "$session"
```

**Session Parsing Contract (required):**
- Preferred: use Session Output Parser prompt from `{subagentPrompts}` on `result.output_file`
- Fallback: use local parser below
- Return normalized schema only: `next_action`, `confidence`, `error_class`, `reasons`

```bash
parsed=$("$scripts" orchestrator-helper parse-output "$(echo $result | jq -r '.output_file')" dev)
next_action=$(echo "$parsed" | jq -r '.next_action')
confidence=$(echo "$parsed" | jq -r '.confidence // 0.0')
error_class=$(echo "$parsed" | jq -r '.error_class // "none"')
reasons=$(echo "$parsed" | jq -c '.reasons // []')
```

- If `next_action == "proceed"`:
  ```bash
  # Update Story Progress: mark dev-story done
  sed -i '' "s/^| ${story_id} |.*$/| ${story_id} | done | done | - | - | - | in-progress |/" "$state_file"
  ```
  → proceed to C (next step)
- If `next_action == "retry"` OR `result.final_state == "crashed"`:
  - Attempts < 5 → retry with next agent (see `{retryStrategy}`)
  - Plateau detected (same task 3x) → DEFER story, continue to next
  - Attempts == 5 → escalate (all retries exhausted)

## Auto-Proceed to Review Phase

Display: "**Dev story complete. Proceeding to automate and code review...**"

```bash
"$scripts" orchestrator-helper state-update "$state_file" \
  --set currentStep=step-03a-execute-review \
  --set lastUpdated="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "- **[$(date -u +%Y-%m-%dT%H:%M:%SZ)]** Dev complete, proceeding to review phase" >> "$state_file"
```

## Then
→ Immediately load and execute `{nextStep}`
