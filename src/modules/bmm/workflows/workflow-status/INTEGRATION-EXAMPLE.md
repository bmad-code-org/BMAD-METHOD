# Workflow Status Service - Integration Examples

## How Other Workflows Can Use the Enhanced workflow-status Service

### Example 1: Simple Validation (product-brief workflow)

Replace the old Step 0:

```xml
<!-- OLD WAY - 35+ lines of duplicate code -->
<step n="0" goal="Check and load workflow status file">
<action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
<action>Find the most recent file...</action>
<!-- ... 30+ more lines of checking logic ... -->
</step>
```

With the new service call:

```xml
<!-- NEW WAY - Clean and simple -->
<step n="0" goal="Validate workflow readiness">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: validate</param>
  <param>calling_workflow: product-brief</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>{{suggestion}}</output>
  <output>Note: Status tracking is optional. You can continue without it.</output>
</check>

<check if="warning != ''">
  <output>{{warning}}</output>
  <ask>Continue anyway? (y/n)</ask>
  <check if="n">
    <action>Exit workflow</action>
  </check>
</check>

<action>Store {{status_file_path}} for later updates if needed</action>
</step>
```

### Example 2: Getting Story Data (create-story workflow)

Replace the complex Step 2.5:

```xml
<!-- OLD WAY - Complex parsing logic -->
<step n="2.5" goal="Check status file TODO section for story to draft">
<action>Read {output_folder}/bmm-workflow-status.md (if exists)</action>
<action>Navigate to "### Implementation Progress (Phase 4 Only)" section</action>
<action>Find "#### TODO (Needs Drafting)" section</action>
<!-- ... 40+ lines of parsing and extraction ... -->
</step>
```

With the new service call:

```xml
<!-- NEW WAY - Let workflow-status handle the complexity -->
<step n="2.5" goal="Get next story to draft">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: next_story</param>
</invoke-workflow>

<check if="status_exists == false">
  <action>Fall back to legacy story discovery</action>
</check>

<check if="todo_story_id exists">
  <action>Use {{todo_story_id}} as story to draft</action>
  <action>Use {{todo_story_title}} for validation</action>
  <action>Create file: {{todo_story_file}}</action>
  <output>Drafting story {{todo_story_id}}: {{todo_story_title}}</output>
</check>
</step>
```

### Example 3: Getting Project Configuration (solution-architecture workflow)

```xml
<step n="0" goal="Load project configuration">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <ask>No status file. Run standalone or create status first?</ask>
</check>

<check if="status_exists == true">
  <action>Use {{project_level}} to determine architecture complexity</action>
  <action>Use {{project_type}} to select appropriate templates</action>
  <action>Use {{field_type}} to know if brownfield constraints apply</action>
</check>
</step>
```

### Example 4: Quick Init Check (any workflow)

```xml
<step n="0" goal="Check if status exists">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: init-check</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>{{suggestion}}</output>
  <output>Proceeding without status tracking...</output>
</check>
</step>
```

## Benefits of This Approach

1. **DRY Principle**: No more duplicating status check logic across 50+ workflows
2. **Centralized Logic**: Bug fixes and improvements happen in one place
3. **Backward Compatible**: Old workflows continue to work, can migrate gradually
4. **Advisory Not Blocking**: Workflows can proceed even without status file
5. **Flexible Data Access**: Get just what you need (next_story, project_config, etc.)
6. **Cleaner Workflows**: Focus on core logic, not status management

## Available Modes

### `update` Mode ⭐ NEW - Centralized Status Updates

- **Purpose**: Centralized status file updates - **NO MORE manual template-output hackery!**
- **Parameters**: `action` + action-specific params
- **Returns**: `success`, action-specific outputs

#### Available Actions:

**1. complete_workflow** - Mark workflow done, advance to next in path

```xml
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: complete_workflow</param>
  <param>workflow_name: prd</param>
  <param>populate_stories_from: {output_folder}/bmm-epics.md</param> <!-- optional -->
</invoke-workflow>

<check if="success == true">
  <output>PRD complete! Next: {{next_workflow}} ({{next_agent}} agent)</output>
</check>
```

**2. populate_stories** - Load story queue from epics.md

```xml
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: populate_stories</param>
  <param>epics_file: {output_folder}/bmm-epics.md</param>
</invoke-workflow>

<check if="success == true">
  <output>Loaded {{total_stories}} stories. First: {{first_story}}</output>
</check>
```

**3. start_story** - Move TODO → IN PROGRESS

```xml
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: start_story</param>
</invoke-workflow>

<check if="success == true">
  <output>Started: {{in_progress_story}}. Next TODO: {{next_todo}}</output>
</check>
```

**4. complete_story** - Move IN PROGRESS → DONE, advance queue

```xml
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: complete_story</param>
</invoke-workflow>

<check if="success == true">
  <output>Completed: {{completed_story}}. {{stories_remaining}} remaining.</output>
  <check if="all_complete == true">
    <output>🎉 All stories complete!</output>
  </check>
</check>
```

**5. set_current_workflow** - Manual override (rarely needed)

```xml
<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: set_current_workflow</param>
  <param>workflow_name: tech-spec</param>
</invoke-workflow>
```

---

### `validate` Mode

- **Purpose**: Check if this workflow should run
- **Returns**:
  - `status_exists`: true/false
  - `should_proceed`: true (always - advisory only)
  - `warning`: Any sequence warnings
  - `suggestion`: What to do
  - `project_level`, `project_type`, `field_type`: For workflow decisions
  - `status_file_path`: For later updates

### `data` Mode

- **Purpose**: Extract specific information
- **Parameters**: `data_request` = one of:
  - `next_story`: Get TODO story details
  - `project_config`: Get project configuration
  - `phase_status`: Get phase completion status
  - `all`: Get everything
- **Returns**: Requested fields as template outputs

### `init-check` Mode

- **Purpose**: Simple existence check
- **Returns**:
  - `status_exists`: true/false
  - `suggestion`: Brief message

### `interactive` Mode (default)

- **Purpose**: User-facing status check
- **Shows**: Current status, options menu
- **Returns**: User proceeds with selected action

## Migration Strategy

1. Start with high-value workflows that have complex Step 0s
2. Test with a few workflows first
3. Gradually migrate others as they're updated
4. Old workflows continue to work unchanged

## Before & After: The Power of Update Mode

### OLD WAY (PRD workflow) - 40+ lines of pollution:

```xml
<step n="10" goal="Update status and complete">
  <action>Load {{status_file_path}}</action>

  <template-output file="{{status_file_path}}">current_workflow</template-output>
  <action>Set to: "prd - Complete"</action>

  <template-output file="{{status_file_path}}">phase_2_complete</template-output>
  <action>Set to: true</action>

  <template-output file="{{status_file_path}}">decisions_log</template-output>
  <action>Add entry: "- **{{date}}**: Completed PRD workflow..."</action>

  <action>Populate STORIES_SEQUENCE from epics.md story list</action>
  <action>Count total stories and update story counts</action>

  <action>Save {{status_file_path}}</action>
</step>
```

### NEW WAY - 6 clean lines:

```xml
<step n="10" goal="Mark PRD complete">
  <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
    <param>mode: update</param>
    <param>action: complete_workflow</param>
    <param>workflow_name: prd</param>
    <param>populate_stories_from: {output_folder}/bmm-epics.md</param>
  </invoke-workflow>

  <output>PRD complete! Next: {{next_workflow}}</output>
</step>
```

**Benefits:**

- ✅ No manual file manipulation
- ✅ No template-output pollution
- ✅ Centralized logic handles path navigation
- ✅ Story population happens automatically
- ✅ Status file stays clean (just key-value pairs)

---

## Migration Priority

**High Priority (Complex Status Updates):**

1. Phase 2: prd, gdd, tech-spec - populate stories + complete workflow
2. Phase 4: story-approved, story-ready - complex queue management

**Medium Priority (Simple Completions):** 3. Phase 1: product-brief, brainstorm-project, research 4. Phase 3: solution-architecture, tech-spec

**Low Priority (Minimal/No Updates):** 5. Phase 4: create-story, dev-story - mostly just read status

---

## Next Steps

To migrate a workflow:

1. **Step 0**: Keep `validate` or `data` mode calls (for reading)
2. **Final Step**: Replace all `template-output` with single `update` mode call
3. **Test**: Verify status file stays clean (no prose pollution)
4. **Delete**: Remove 30-100 lines of status manipulation code 🎉
