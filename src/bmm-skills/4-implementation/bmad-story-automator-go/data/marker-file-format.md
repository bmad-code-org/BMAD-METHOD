# Marker File Format

**Location:** `.claude/.story-automator-active` (relative to project root)

**Purpose:** Enables the Stop hook to prevent premature stopping during orchestration.

---

## JSON Structure

```json
{
  "epic": "{epic_id}",
  "currentStory": "{first_story_id}",
  "storiesRemaining": {story_count},
  "stateFile": "{path_to_state_document}",
  "startedAt": "{timestamp}",
  "heartbeat": "{timestamp}",
  "pid": {process_id},
  "projectSlug": "{project_slug}"
}
```

---

## Field Descriptions

| Field | Description |
|-------|-------------|
| `epic` | Epic identifier (e.g., "5") |
| `currentStory` | Current story being processed (e.g., "5.3") |
| `storiesRemaining` | Count of stories left in queue |
| `stateFile` | Path to orchestration state document |
| `startedAt` | Orchestration start timestamp (ISO 8601) |
| `heartbeat` | Last activity timestamp, updated periodically |
| `pid` | Process ID of orchestrator (crash detection) |
| `projectSlug` | (v2.0) Project identifier for session naming |

---

## Heartbeat Updates

The orchestrator should update the heartbeat timestamp periodically during long-running operations. This prevents the marker from going stale if the orchestrator is still running but taking a while on a complex story.

**Staleness threshold:** 30 minutes (see story-automator stop-hook)

---

## Creation Command

```bash
project_slug=$(echo "$("{deriveProjectSlug}" derive-project-slug --project-root "{project-root}")" | jq -r '.slug')
"{stateHelper}" orchestrator-helper marker create --epic "$epic_id" --story "$first_story_id" \
  --remaining "$selected_count" --state-file "$state_path" \
  --project-slug "$project_slug" --pid "$$" --heartbeat "{timestamp}"
```

---

## Related Documentation

- **Stop Hook:** See `stop-hook-config.md` for hook behavior
- **Troubleshooting:** See `stop-hook-troubleshooting.md` for issues
