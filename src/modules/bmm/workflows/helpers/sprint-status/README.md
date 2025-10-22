# Sprint Status Helper

**Purpose:** Utility workflow for reading and updating `sprint-status.yaml` tracking file used across Phase 4 implementation workflows.

**Location:** `src/modules/bmm/workflows/helpers/sprint-status/`

**Status File:** `{output_folder}/sprint-status.yaml` (created by sprint-planning workflow)

---

## Quick Reference

### Usage Pattern

```xml
<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: ACTION_NAME</param>
  <param>PARAM_NAME: value</param>
  <!-- Optional params -->
</invoke-workflow>

<!-- Use returned variables -->
<action>Do something with {{result_*}} variables</action>
```

---

## Available Actions

### Read Operations

| Action                | Purpose                      | Key Parameters                          | Key Returns                                                                   |
| --------------------- | ---------------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `get_next_story`      | Find first story by status   | `filter_status`, `epic_filter`          | `result_found`, `result_story_key`, `result_epic_id`, `result_story_id`       |
| `list_stories`        | Get all matching stories     | `filter_status`, `epic_filter`, `limit` | `result_count`, `result_stories`, `result_story_list`                         |
| `get_story_status`    | Check story's current status | `story_key`                             | `result_found`, `result_status`                                               |
| `get_epic_status`     | Check epic status + stats    | `epic_id`                               | `result_status`, `result_story_count`, `result_done_count`, `result_complete` |
| `check_epic_complete` | Verify all stories done      | `epic_id`                               | `result_complete`, `result_pending_stories`                                   |
| `get_metadata`        | Get project info from file   | none                                    | `result_project`, `result_story_location`, `result_generated_date`            |
| `get_file_path`       | Get file location            | none                                    | `result_file_path`, `result_exists`                                           |

### Write Operations

| Action                   | Purpose                | Key Parameters                        | Key Returns                                                |
| ------------------------ | ---------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `update_story_status`    | Change story status    | `story_key`, `new_status`, `validate` | `result_success`, `result_old_status`, `result_new_status` |
| `update_epic_status`     | Mark epic as contexted | `epic_id`, `new_status`               | `result_success`, `result_old_status`, `result_new_status` |
| `complete_retrospective` | Mark epic retro done   | `epic_id`                             | `result_success`, `result_retro_key`                       |

### Utility Operations

| Action                | Purpose                         | Key Parameters             | Key Returns                                               |
| --------------------- | ------------------------------- | -------------------------- | --------------------------------------------------------- |
| `validate_transition` | Check if status change is legal | `from_status`, `to_status` | `result_valid`, `result_message`, `result_suggested_path` |

---

## Status Flow Reference

**Epic Status:**

```
backlog → contexted
```

**Story Status:**

```
backlog → drafted → ready-for-dev → in-progress → review → done
         ↑_________ Corrections allowed (backward movement) ________↑
```

**Retrospective Status:**

```
optional ↔ completed
```

---

## Common Patterns

### Pattern 1: Find and Update Next Story

```xml
<!-- Find next backlog story -->
<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: get_next_story</param>
  <param>filter_status: backlog</param>
</invoke-workflow>

<check if="{{result_found}} == true">
  <action>Work on story: {{result_story_key}}</action>

  <!-- Update status after work -->
  <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
    <param>action: update_story_status</param>
    <param>story_key: {{result_story_key}}</param>
    <param>new_status: drafted</param>
  </invoke-workflow>
</check>

<check if="{{result_found}} == false">
  <output>No backlog stories available</output>
</check>
```

### Pattern 2: List Stories for User Selection

```xml
<!-- Get all drafted stories -->
<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: list_stories</param>
  <param>filter_status: drafted</param>
  <param>limit: 10</param>
</invoke-workflow>

<check if="{{result_count}} > 0">
  <output>Available drafted stories ({{result_count}} found):
{{result_story_list}}
  </output>
  <ask>Select a story to work on:</ask>
</check>
```

### Pattern 3: Check Epic Completion Before Retrospective

```xml
<!-- Verify epic is complete -->
<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: check_epic_complete</param>
  <param>epic_id: 1</param>
</invoke-workflow>

<check if="{{result_complete}} == true">
  <output>Epic 1 is complete! Ready for retrospective.</output>

  <!-- Mark retrospective as completed -->
  <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
    <param>action: complete_retrospective</param>
    <param>epic_id: 1</param>
  </invoke-workflow>
</check>

<check if="{{result_complete}} == false">
  <output>Epic 1 has {{result_total_stories - result_done_stories}} pending stories:
{{result_pending_stories}}
  </output>
</check>
```

### Pattern 4: Validate Before Update

```xml
<!-- Check if transition is legal first -->
<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: validate_transition</param>
  <param>from_status: drafted</param>
  <param>to_status: in-progress</param>
</invoke-workflow>

<check if="{{result_valid}} == false">
  <output>Cannot transition directly from drafted to in-progress.
{{result_suggested_path}}
  </output>
  <action>HALT</action>
</check>
```

### Pattern 5: Mark Epic Contexted

```xml
<!-- After creating epic tech context -->
<invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
  <param>action: update_epic_status</param>
  <param>epic_id: {{epic_num}}</param>
  <param>new_status: contexted</param>
</invoke-workflow>
```

---

## Return Variables

**All actions return:**

- `result_success`: `true` | `false`
- `result_error`: Error message (if `result_success == false`)

**Common additional returns:**

- `result_found`: `true` | `false` (for query operations)
- `result_status`: Current status value
- `result_old_status`: Previous status (for updates)
- `result_new_status`: Updated status (for updates)
- `result_story_key`: Story key like "1-1-story-name"
- `result_epic_id`: Epic number extracted from key
- `result_story_id`: Story number extracted from key

---

## Error Handling

**File Not Found:**

```xml
<check if="{{result_error}} == 'file_not_found'">
  <output>Sprint status file not found.
Run sprint-planning workflow first to initialize tracking.
  </output>
  <action>HALT</action>
</check>
```

**Story Not Found:**

```xml
<check if="{{result_found}} == false">
  <output>Story {{story_key}} not found in sprint-status.yaml.
Run sprint-planning to refresh tracking.
  </output>
</check>
```

**Invalid Transition:**

```xml
<check if="{{result_success}} == false AND {{result_validation_message}} != ''">
  <output>{{result_error}}
{{result_validation_message}}
  </output>
</check>
```

---

## Options

| Parameter     | Default | Description                                                |
| ------------- | ------- | ---------------------------------------------------------- |
| `validate`    | `true`  | Enforce legal status transitions for `update_story_status` |
| `dry_run`     | `false` | Test update without saving (for debugging)                 |
| `show_output` | `true`  | Helper displays status messages (✅/❌/📋)                 |

---

## Integration Checklist

When adding sprint-status helper to a workflow:

- [ ] Add `sprint_status_file` variable to workflow.yaml if needed
- [ ] Use `invoke-workflow` with correct action parameter
- [ ] Check `result_success` and `result_found` before proceeding
- [ ] Handle `result_error == 'file_not_found'` case
- [ ] Use returned `result_*` variables in workflow logic
- [ ] Update status at appropriate workflow steps

---

## Workflow Integration Map

| Workflow              | Actions Used                                      | When                                        |
| --------------------- | ------------------------------------------------- | ------------------------------------------- |
| **epic-tech-context** | `get_epic_status`<br>`update_epic_status`         | Check epic exists → Mark contexted          |
| **create-story**      | `get_next_story`<br>`update_story_status`         | Find backlog → Mark drafted                 |
| **story-ready**       | `list_stories`<br>`update_story_status`           | List drafted → Mark ready-for-dev           |
| **story-context**     | `get_next_story`                                  | Find drafted (read-only)                    |
| **dev-story**         | `get_next_story`<br>`update_story_status` (2x)    | Find ready → Mark in-progress → Mark review |
| **review-story**      | `list_stories`<br>`update_story_status`           | List review → Update based on outcome       |
| **story-done**        | `list_stories`<br>`update_story_status`           | List review → Mark done                     |
| **retrospective**     | `check_epic_complete`<br>`complete_retrospective` | Verify complete → Mark retro done           |

---

## Notes

- **Source of Truth:** File system is authoritative. Sprint-planning regenerates from epics + file detection.
- **Refresh Strategy:** Re-run sprint-planning anytime to resync tracking with actual files.
- **Concurrency:** Not designed for concurrent access. Single-user CLI workflow execution.
- **Alpha Status:** No backward compatibility. Re-run sprint-planning with latest version before using.

---

## Examples in Context

See individual workflow instructions in `src/modules/bmm/workflows/4-implementation/` for integration examples.

**Helper Files:**

- `workflow.yaml` - Interface definition
- `instructions.md` - Action implementation logic
- `README.md` - This file
