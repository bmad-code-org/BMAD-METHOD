# Batch-Super-Dev Resilience Fix

**Problem:** Agents crash mid-execution, resume fails, no intermediate state saved

---

## Issues Observed

**Story 18-4 → 18-5 Transition:**
```
✅ Story 18-4: Builder → Inspector → Fixer → Reviewer all complete
❌ Story 18-5: Workflow crashed on "Error reading file"
```

**Evidence:**
- Task output files empty (0 bytes)
- Resume attempts failed (0 tools used, 0 tokens)
- No state saved between stories
- When agent crashes, all progress lost

---

## Root Cause

**Sequential processing in main context has no resilience:**

```
Story 18-4:
  ├─ Builder agent completes → outputs to temp file
  ├─ Main reads output file → starts Inspector
  ├─ Inspector completes → outputs to temp file
  ├─ Main reads output → starts Fixer
  └─ Fixer completes → Story 18-4 done

Story 18-5:
  ├─ Main tries to read Story 18-5 file
  ├─ ❌ "Error reading file" (crash)
  └─ All progress lost, no state saved
```

**Problem:** Main context doesn't save state between stories. If it crashes, batch starts over.

---

## Solution: Save State After Each Story

### Add state file tracking:

```yaml
# In batch-super-dev/workflow.yaml
state_tracking:
  enabled: true
  state_file: "{sprint_artifacts}/batch-execution-state-{batch_id}.yaml"
  save_after_each_story: true
```

### State file format:

```yaml
batch_id: "epic-18-2026-01-26"
started: "2026-01-26T18:45:00Z"
execution_mode: "fully_autonomous"
strategy: "sequential"
total_stories: 2

stories:
  - story_key: "18-4-billing-worker-retry-logic"
    status: "completed"
    started: "2026-01-26T18:46:00Z"
    completed: "2026-01-26T19:05:00Z"
    agents:
      - phase: "builder"
        agent_id: "ae3bd2b"
        status: "completed"
      - phase: "inspector"
        agent_id: "a9f0d11"
        status: "completed"
      - phase: "fixer"
        agent_id: "abc123"
        status: "completed"
      - phase: "reviewer"
        agent_id: "def456"
        status: "completed"

  - story_key: "18-5-precharge-payment-validation"
    status: "in_progress"
    started: "2026-01-26T19:05:30Z"
    last_checkpoint: "attempting_to_read_story_file"
    error: "Error reading file"
```

### Resume logic:

```bash
# At batch-super-dev start, check for existing state file
state_file="{sprint_artifacts}/batch-execution-state-*.yaml"

if ls $state_file 2>/dev/null; then
  echo "🔄 Found interrupted batch execution"
  echo "Resume from where it left off? (yes/no)"

  if yes:
    # Load state file
    # Skip completed stories
    # Start from next story
    # Reuse agent IDs if resumable
fi
```

### After each story completes:

```bash
# Update state file
update_state_file() {
  story_key="$1"
  status="$2"  # completed | failed

  # Update YAML
  # Mark story as completed
  # Save timestamp
  # Record agent IDs
}

# After Builder completes
update_state_file "$story_key" "builder_complete"

# After Inspector completes
update_state_file "$story_key" "inspector_complete"

# After Fixer completes
update_state_file "$story_key" "fixer_complete"

# After Reviewer completes
update_state_file "$story_key" "reviewer_complete"

# When entire story done
update_state_file "$story_key" "completed"
```

### Error handling:

```bash
# Wrap file reads in try-catch
read_with_retry() {
  file_path="$1"
  max_attempts=3

  for attempt in {1..$max_attempts}; do
    if content=$(cat "$file_path" 2>&1); then
      echo "$content"
      return 0
    else
      echo "⚠️ Failed to read $file_path (attempt $attempt/$max_attempts)" >&2
      sleep 2
    fi
  done

  echo "❌ Cannot read file after $max_attempts attempts: $file_path" >&2
  return 1
}

# Use in workflow
story_content=$(read_with_retry "$story_file") || {
  echo "❌ Cannot proceed with Story $story_key - file read failed"
  # Save state
  # Skip this story
  # Continue to next story (if continue_on_failure=true)
}
```

---

## Implementation

Add to batch-super-dev Step 4-Sequential:

```xml
<substep n="4s-0" title="Check for previous execution state">
  <action>Check for state file: batch-execution-state-*.yaml</action>

  <check if="state file exists">
    <output>🔄 Found interrupted batch from {state.started}</output>
    <output>Completed: {state.completed_count} stories</output>
    <output>Failed: {state.failed_count} stories</output>
    <output>In progress: {state.current_story}</output>

    <ask>Resume from where it left off? (yes/no)</ask>

    <check if="response == yes">
      <action>Load state</action>
      <action>Skip completed stories</action>
      <action>Start from next story</action>
    </check>

    <check if="response == no">
      <action>Archive old state file</action>
      <action>Start fresh batch</action>
    </check>
  </check>
</substep>

<substep n="4s-a" title="Process individual story">
  <action>Save state: story started</action>

  <try>
    <action>Read story file with retry</action>
    <action>Execute super-dev-pipeline</action>
    <action>Save state: story completed</action>
  </try>

  <catch error="file_read_error">
    <output>⚠️ Cannot read story file for {story_key}</output>
    <action>Save state: story failed (file read error)</action>
    <action>Add to failed_stories list</action>
    <action>Continue to next story if continue_on_failure=true</action>
  </catch>

  <catch error="agent_crash">
    <output>⚠️ Agent crashed for {story_key}</output>
    <action>Save state: story failed (agent crash)</action>
    <action>Record partial progress in state file</action>
    <action>Continue to next story if continue_on_failure=true</action>
  </catch>
</substep>
```

---

## Expected Behavior After Fix

**If crash happens:**

```
Story 18-4: ✅ Complete (state saved)
Story 18-5: ❌ Crashed (state saved with error)

State file created: batch-execution-state-epic-18.yaml

User re-runs: /batch-super-dev

Workflow: "🔄 Found interrupted batch. Resume? (yes/no)"
User: "yes"
Workflow: "✅ Skipping 18-4 (already complete)"
Workflow: "🔄 Retrying 18-5 (was in_progress)"
Workflow: Starts 18-5 from beginning
```

**Benefits:**
- No lost progress
- Can resume after crashes
- Intermediate state preserved
- Failures don't block batch

---

Should I implement this resilience fix now?
