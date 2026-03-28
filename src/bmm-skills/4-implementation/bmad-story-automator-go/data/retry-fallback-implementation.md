# Retry & Fallback Implementation Examples

**Purpose:** Detailed implementation wrapper and step-specific validation patterns.

---

## Implementation Pattern

```bash
# Universal retry wrapper with deterministic agent resolution
task_type="{step}"  # create, dev, auto, or review
resolve_agent_for_task "$task_type" "$state_file" "{story_id}"
# Now primary_agent and fallback_agent are set for this story/task

max_attempts=5
attempt=0
success=false

while [ $attempt -lt $max_attempts ] && [ "$success" = "false" ]; do
    attempt=$((attempt + 1))

    # Alternate agent: odd attempts = primary, even = fallback (if available)
    if [ $((attempt % 2)) -eq 1 ] || [ -z "$fallback_agent" ]; then
        current_agent="$primary_agent"
    else
        current_agent="$fallback_agent"
    fi

    # Delay logic (after first attempt)
    if [ $attempt -gt 1 ]; then
        if [ $attempt -ge 4 ] || [ "$last_was_network_error" = "true" ]; then
            echo "Waiting 60s before retry (attempt $attempt)..."
            sleep 60
        fi
    fi

    # Execute workflow step
    session=$("$scripts" tmux-wrapper spawn {step} {epic} {story_id} \
        --agent "$current_agent" \
        --command "$("$scripts" tmux-wrapper build-cmd {step} {story_id} --agent "$current_agent")")
    result=$("$scripts" monitor-session "$session" --json --agent "$current_agent")

    # Cleanup session
    "$scripts" tmux-wrapper kill "$session"

    # Check for network errors
    last_was_network_error="false"
    if echo "$result" | grep -qiE "(connection refused|timeout|rate limit|503|502|never_active)"; then
        last_was_network_error="true"
    fi
    if [ "$(echo "$result" | jq -r '.final_state')" = "crashed" ]; then
        output_size=$(wc -c < "$(echo "$result" | jq -r '.output_file')" 2>/dev/null || echo "0")
        [ "$output_size" -lt 100 ] && last_was_network_error="true"
    fi

    # Check success (step-specific validation)
    # ... validation logic here ...

    if [ "$validation_passed" = "true" ]; then
        success=true
    else
        echo "Attempt $attempt failed (agent: $current_agent). $([ $attempt -lt $max_attempts ] && echo "Retrying..." || echo "Escalating.")"
    fi
done

if [ "$success" = "false" ]; then
    # All attempts exhausted - NOW escalate
    escalate_to_user "Step failed after $max_attempts attempts"
fi
```

---

## Step-Specific Validation

### Create Story
```bash
after=$("$scripts" validate-story-creation count {story_id})
validation=$("$scripts" validate-story-creation check {story_id} --before $before --after $after)
validation_passed=$(echo "$validation" | jq -r '.valid')
```

### Dev Story
```bash
parsed=$("$scripts" orchestrator-helper parse-output "$output_file" dev)
next_action=$(echo "$parsed" | jq -r '.next_action')
validation_passed=$([ "$next_action" = "proceed" ] && echo "true" || echo "false")
```

### Automate
```bash
parsed=$("$scripts" orchestrator-helper parse-output "$output_file" auto)
# Non-blocking: log warning but continue
validation_passed="true"  # Always proceed (automate is non-blocking)
```

### Code Review
```bash
# See code-review-loop.md for specific review cycle handling
# Reviews have their own internal retry loop
```
