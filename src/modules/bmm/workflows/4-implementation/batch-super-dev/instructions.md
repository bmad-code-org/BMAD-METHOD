# Batch Super-Dev - Interactive Story Selector

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/_bmad/bmm/workflows/4-implementation/batch-super-dev/workflow.yaml</critical>

<workflow>

<step n="1" goal="Load and parse sprint-status.yaml">
  <action>Read {sprint_status} file</action>
  <action>Parse metadata: project, project_key, tracking_system</action>
  <action>Parse development_status map</action>

  <action>Filter stories with status = "ready-for-dev"</action>
  <action>Exclude entries that are epics (keys starting with "epic-") or retrospectives (keys ending with "-retrospective")</action>

  <check if="filter_by_epic is not empty">
    <action>Further filter stories to only include those starting with "{filter_by_epic}-"</action>
    <example>If filter_by_epic = "3", only include stories like "3-1-...", "3-2-...", etc.</example>
  </check>

  <action>Sort filtered stories by epic number, then story number (e.g., 1-1, 1-2, 2-1, 3-1)</action>
  <action>Store as: ready_for_dev_stories (list of story keys)</action>

  <check if="ready_for_dev_stories is empty">
    <output>✅ No ready-for-dev stories found.

All stories are either in-progress, review, or done!

Run `/bmad:bmm:workflows:sprint-status` to see current status.</output>
    <action>Exit workflow</action>
  </check>
</step>

<step n="2" goal="Display available stories with details">
  <action>Read comment field for each story from sprint-status.yaml (text after # on the same line)</action>

  <action>For each story, verify story file exists using multiple naming patterns:</action>
  <action>Try in order: 1) {sprint_artifacts}/{story_key}.md, 2) {sprint_artifacts}/story-{story_key}.md, 3) {sprint_artifacts}/{story_key_with_dots}.md</action>
  <action>Mark stories as: ✅ (file exists), ❌ (file missing), 🔄 (already implemented but not marked done)</action>

  <output>
## 📦 Ready-for-Dev Stories ({{count}})

{{#if filter_by_epic}}
**Filtered by Epic {{filter_by_epic}}**
{{/if}}

{{#each ready_for_dev_stories}}
{{@index}}. **{{key}}** {{file_status_icon}}
   {{#if comment}}→ {{comment}}{{/if}}
   {{#if file_path}}   File: {{file_path}}{{/if}}
{{/each}}

---
**Legend:**
- ✅ Story file exists, ready to implement
- 🔄 Already implemented, just needs status update
- ❌ Story file missing, needs creation first

**Total:** {{count}} stories available
**Max batch size:** {{max_stories}} stories
  </output>
</step>

<step n="2.5" goal="Validate and create/regenerate stories as needed">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 VALIDATING STORY FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <iterate>For each story in ready_for_dev_stories:</iterate>

  <substep n="2.5a" title="Check story file existence and validity">
    <action>Check if story file exists (already done in Step 2)</action>

    <check if="file_status_icon == '❌' (file missing)">
      <output>
📝 Story {{story_key}}: File missing
      </output>

      <ask>Create story file with gap analysis? (yes/no):</ask>

      <check if="response == 'yes'">
        <output>Creating story {{story_key}} with codebase gap analysis...</output>
        <action>Invoke workflow: /bmad:bmm:workflows:create-story-with-gap-analysis</action>
        <action>Parameters: story_key={{story_key}}</action>

        <check if="story creation succeeded">
          <output>✅ Story {{story_key}} created successfully (12/12 sections)</output>
          <action>Update file_status_icon to ✅</action>
          <action>Mark story as validated</action>
        </check>

        <check if="story creation failed">
          <output>❌ Story creation failed: {{story_key}}</output>
          <action>Mark story for removal from selection</action>
          <action>Add to skipped_stories list with reason: "Creation failed"</action>
        </check>
      </check>

      <check if="response == 'no'">
        <output>⏭️ Skipping story {{story_key}} (file missing)</output>
        <action>Mark story for removal from selection</action>
        <action>Add to skipped_stories list with reason: "User declined creation"</action>
      </check>
    </check>

    <check if="file_status_icon == '✅' (file exists)">
      <action>Read story file: {{file_path}}</action>
      <action>Parse sections and validate BMAD format</action>

      <action>Check for all 12 required sections:
        1. Business Context
        2. Current State
        3. Acceptance Criteria
        4. Tasks and Subtasks
        5. Technical Requirements
        6. Architecture Compliance
        7. Testing Requirements
        8. Dev Agent Guardrails
        9. Definition of Done
        10. References
        11. Dev Agent Record
        12. Change Log
      </action>

      <action>Count sections present: sections_found</action>
      <action>Check Current State content length (word count)</action>
      <action>Check Acceptance Criteria item count</action>
      <action>Check Tasks item count</action>
      <action>Look for gap analysis markers (✅/❌) in Current State</action>

      <check if="sections_found < 12 OR Current State < 100 words OR no gap analysis markers">
        <output>
⚠️ Story {{story_key}}: File incomplete or invalid
   - Sections: {{sections_found}}/12
   {{#if Current State < 100 words}}- Current State: stub ({{word_count}} words, expected ≥100){{/if}}
   {{#if no gap analysis}}- Gap analysis: missing{{/if}}
        </output>

        <ask>Regenerate story with codebase scan? (yes/no):</ask>

        <check if="response == 'yes'">
          <output>Regenerating story {{story_key}} with gap analysis...</output>
          <action>Backup existing file to {{file_path}}.backup</action>
          <action>Invoke workflow: /bmad:bmm:workflows:create-story-with-gap-analysis</action>
          <action>Parameters: story_key={{story_key}}</action>

          <check if="regeneration succeeded">
            <output>✅ Story {{story_key}} regenerated successfully (12/12 sections)</output>
            <action>Mark story as validated</action>
          </check>

          <check if="regeneration failed">
            <output>❌ Regeneration failed, using backup: {{story_key}}</output>
            <action>Restore from backup</action>
            <action>Mark story for removal with warning</action>
            <action>Add to skipped_stories list with reason: "Regeneration failed"</action>
          </check>
        </check>

        <check if="response == 'no'">
          <output>⏭️ Skipping story {{story_key}} (file incomplete)</output>
          <action>Mark story for removal from selection</action>
          <action>Add to skipped_stories list with reason: "User declined regeneration"</action>
        </check>
      </check>

      <check if="sections_found == 12 AND sufficient content">
        <output>✅ Story {{story_key}}: Valid (12/12 sections, gap analysis present)</output>
        <action>Mark story as validated</action>
      </check>
    </check>

    <check if="file_status_icon == '🔄' (already implemented)">
      <output>✅ Story {{story_key}}: Already implemented (will skip or reconcile only)</output>
      <action>Mark story as validated (already done)</action>
    </check>
  </substep>

  <action>Remove skipped stories from ready_for_dev_stories</action>
  <action>Update count of available stories</action>

  <check if="skipped_stories is not empty">
    <output>
⏭️ Skipped Stories ({{skipped_count}}):
{{#each skipped_stories}}
  - {{story_key}}: {{reason}}
{{/each}}
    </output>
  </check>

  <check if="ready_for_dev_stories is empty after validation">
    <output>
❌ No valid stories remaining after validation.

All stories were either:
- Missing files (user declined creation)
- Invalid/incomplete (user declined regeneration)
- Already implemented

Run `/bmad:bmm:workflows:sprint-status` to see status.
    </output>
    <action>Exit workflow</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Story Validation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Validated:** {{validated_count}} stories ready to process
{{#if skipped_count > 0}}**Skipped:** {{skipped_count}} stories{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="2.6" goal="Score story complexity for pipeline routing (NEW v1.3.0)">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SCORING STORY COMPLEXITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <iterate>For each validated story:</iterate>

  <substep n="2.6a" title="Analyze story complexity">
    <action>Read story file: {{file_path}}</action>

    <action>Count unchecked tasks ([ ]) at top level only in Tasks/Subtasks section → task_count
      (See workflow.yaml complexity.task_counting.method = "top_level_only")
    </action>
    <action>Extract file paths mentioned in tasks → file_count</action>
    <action>Scan story title and task descriptions for risk keywords using rules from workflow.yaml:
      - Case insensitive matching (require_word_boundaries: true)
      - Include keyword variants (e.g., "authentication" matches "auth")
      - Scan: story_title, task_descriptions, subtask_descriptions
    </action>

    <action>Calculate complexity score:
      - Base score = task_count
      - Add 5 for each HIGH risk keyword match (auth, security, payment, migration, database, schema, encryption)
      - Add 2 for each MEDIUM risk keyword match (api, integration, external, third-party, cache)
      - Add 0 for LOW risk keywords (ui, style, config, docs, test)
      - Count each keyword only once (no duplicates)
    </action>

    <action>Assign complexity level using mutually exclusive decision tree (priority order):

      1. Check COMPLEX first (highest priority):
         IF (task_count ≥ 16 OR complexity_score ≥ 20 OR has ANY HIGH risk keyword)
         THEN level = COMPLEX

      2. Else check MICRO (lowest complexity):
         ELSE IF (task_count ≤ 3 AND complexity_score ≤ 5 AND file_count ≤ 5)
         THEN level = MICRO

      3. Else default to STANDARD:
         ELSE level = STANDARD

      This ensures no overlaps:
      - Story with HIGH keyword → COMPLEX (never MICRO or STANDARD)
      - Story with 4-15 tasks or >5 files → STANDARD (not MICRO or COMPLEX)
      - Story with ≤3 tasks, ≤5 files, no HIGH keywords → MICRO
    </action>

    <action>Store complexity_level for story: {{story_key}}.complexity = {level, score, task_count, risk_keywords}</action>
  </substep>

  <action>Group stories by complexity level</action>

  <output>
📊 **Complexity Analysis Complete**

{{#each complexity_groups}}
**{{level}} Stories ({{count}}):**
{{#each stories}}
  - {{story_key}}: {{task_count}} tasks, score {{score}}{{#if risk_keywords}}, risk: {{risk_keywords}}{{/if}}
{{/each}}
{{/each}}

---
**Pipeline Routing:**
- 🚀 **MICRO** ({{micro_count}}): Lightweight path - skip gap analysis + code review
- ⚙️ **STANDARD** ({{standard_count}}): Full pipeline with all quality gates
- 🔒 **COMPLEX** ({{complex_count}}): Enhanced validation + consider splitting

{{#if complex_count > 0}}
⚠️ **Warning:** {{complex_count}} complex stories detected. Consider:
- Breaking into smaller stories before processing
- Running these separately with extra attention
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="3" goal="Get user selection">
  <ask>
**Select stories to process:**

Enter story numbers to process (examples):
  - Single: `1`
  - Multiple: `1,3,5`
  - Range: `1-5` (processes 1,2,3,4,5)
  - Mixed: `1,3-5,8` (processes 1,3,4,5,8)
  - All: `all` (processes all {{count}} stories)

Or:
  - `cancel` - Exit without processing

**Your selection:**
  </ask>

  <action>Parse user input</action>

  <check if="input == 'cancel'">
    <output>❌ Batch processing cancelled.</output>
    <action>Exit workflow</action>
  </check>

  <check if="input == 'all'">
    <action>Set selected_stories = all ready_for_dev_stories</action>
  </check>

  <check if="input is numeric selection">
    <action>Parse selection (handle commas, ranges)</action>
    <example>Input "1,3-5,8" → indexes [1,3,4,5,8] → map to story keys</example>
    <action>Map selected indexes to story keys from ready_for_dev_stories</action>
    <action>Store as: selected_stories</action>
  </check>

  <check if="selected_stories count > max_stories">
    <output>⚠️ You selected {{count}} stories, but max_stories is {{max_stories}}.

Only the first {{max_stories}} will be processed.</output>
    <action>Truncate selected_stories to first max_stories entries</action>
  </check>

  <action>Display confirmation</action>
  <output>
## 📋 Selected Stories ({{count}})

{{#each selected_stories}}
{{@index}}. {{key}}
{{/each}}

**Estimated time:** {{count}} stories × 30-60 min/story = {{estimated_hours}} hours
  </output>
</step>

<step n="3.5" goal="Choose execution strategy">
  <action>Use AskUserQuestion to determine execution mode and parallelization</action>

  <ask>
**How should these stories be processed?**

**Execution Mode:**
- Sequential: Run stories one-by-one in this session (slower, easier to monitor)
- Parallel: Spawn Task agents to process stories concurrently (faster, autonomous)

**If Parallel, how many agents in parallel?**
- Conservative: 2 agents (low resource usage, easier debugging)
- Moderate: 4 agents (balanced performance)
- Aggressive: All stories at once (fastest, high resource usage)
  </ask>

  <action>Capture responses: execution_mode, parallel_count</action>

  <check if="execution_mode == 'sequential'">
    <action>Set parallel_count = 1</action>
    <action>Set use_task_agents = false</action>
  </check>

  <check if="execution_mode == 'parallel'">
    <action>Set use_task_agents = true</action>
    <action>If parallel_count == 'all': set parallel_count = count of selected_stories</action>
  </check>

  <output>
## ⚙️ Execution Plan

**Mode:** {{execution_mode}}
{{#if use_task_agents}}
**Task Agents:** {{parallel_count}} running concurrently
**Agent Type:** general-purpose (autonomous)
{{else}}
**Sequential processing** in current session
{{/if}}

**Stories to process:** {{count}}
**Estimated total time:**
{{#if use_task_agents}}
- With {{parallel_count}} agents: {{estimated_hours / parallel_count}} hours
{{else}}
- Sequential: {{estimated_hours}} hours
{{/if}}
  </output>

  <ask>Confirm execution plan? (yes/no):</ask>

  <check if="response != 'yes'">
    <output>❌ Batch processing cancelled.</output>
    <action>Exit workflow</action>
  </check>
</step>

<step n="4" goal="Process stories with super-dev-pipeline">
  <action>Initialize counters: completed=0, failed=0, failed_stories=[], reconciliation_warnings=[], reconciliation_warnings_count=0</action>
  <action>Set start_time = current timestamp</action>

  <check if="use_task_agents == true">
    <action>Jump to Step 4-Parallel (Task Agent execution)</action>
  </check>

  <check if="use_task_agents == false">
    <action>Continue to Step 4-Sequential (In-session execution)</action>
  </check>
</step>

<step n="4-Sequential" goal="Sequential processing in current session">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 SEQUENTIAL BATCH PROCESSING STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Stories:** {{count}}
**Mode:** super-dev-pipeline (batch, sequential)
**Continue on failure:** {{continue_on_failure}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <iterate>For each story in selected_stories:</iterate>

  <substep n="4s-a" title="Process individual story">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Story {{current_index}}/{{total_count}}: {{story_key}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Invoke workflow: /bmad:bmm:workflows:super-dev-pipeline</action>
    <action>Parameters: mode=batch, story_key={{story_key}}, complexity_level={{story_key}}.complexity.level</action>

    <check if="super-dev-pipeline succeeded">
      <output>✅ Implementation complete: {{story_key}}</output>

      <action>Execute Step 4.5: Smart Story Reconciliation</action>
      <action>Load reconciliation instructions: {installed_path}/step-4.5-reconcile-story-status.md</action>
      <action>Execute reconciliation with story_key={{story_key}}</action>

      <check if="reconciliation succeeded">
        <output>✅ COMPLETED: {{story_key}} (reconciled)</output>
        <action>Increment completed counter</action>
      </check>

      <check if="reconciliation failed">
        <output>⚠️ WARNING: {{story_key}} completed but reconciliation failed</output>
        <action>Increment completed counter (implementation was successful)</action>
        <action>Add to reconciliation_warnings: {story_key: {{story_key}}, warning_message: "Reconciliation failed - manual verification needed"}</action>
        <action>Increment reconciliation_warnings_count</action>
      </check>
    </check>

    <check if="super-dev-pipeline failed">
      <output>❌ FAILED: {{story_key}}</output>
      <action>Increment failed counter</action>
      <action>Add story_key to failed_stories list</action>

      <check if="continue_on_failure == false">
        <output>⚠️ Stopping batch due to failure (continue_on_failure=false)</output>
        <action>Jump to Step 5 (Summary)</action>
      </check>
    </check>

    <check if="display_progress == true">
      <output>
**Progress:** {{completed}} completed, {{failed}} failed, {{remaining}} remaining
      </output>
    </check>

    <check if="not last story AND pause_between_stories > 0">
      <output>⏸️ Pausing {{pause_between_stories}} seconds before next story...</output>
      <action>Wait {{pause_between_stories}} seconds</action>
    </check>
  </substep>

  <action>After all stories processed, jump to Step 5 (Summary)</action>
</step>

<step n="4-Parallel" goal="Parallel processing with Task agents">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PARALLEL BATCH PROCESSING STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Stories:** {{count}}
**Mode:** Task agents (autonomous, parallel)
**Agents in parallel:** {{parallel_count}}
**Continue on failure:** {{continue_on_failure}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Split selected_stories into batches of size parallel_count</action>
  <action>Example: If 10 stories and parallel_count=4, create batches: [1-4], [5-8], [9-10]</action>

  <iterate>For each batch of stories:</iterate>

  <substep n="4p-a" title="Spawn Task agents for batch">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Batch {{batch_index}}/{{total_batches}}: Spawning {{stories_in_batch}} agents
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stories in this batch:
{{#each stories_in_batch}}
{{@index}}. {{story_key}}
{{/each}}

Spawning Task agents in parallel...
    </output>

    <action>For each story in current batch, spawn Task agent with these parameters:</action>
    <action>
      Task tool parameters:
      - subagent_type: "general-purpose"
      - description: "Implement story {{story_key}}"
      - prompt: "Execute super-dev-pipeline workflow for story {{story_key}}.

                 CRITICAL INSTRUCTIONS:
                 1. Load workflow.xml: _bmad/core/tasks/workflow.xml
                 2. Load workflow config: _bmad/bmm/workflows/4-implementation/super-dev-pipeline/workflow.yaml
                 3. Execute in BATCH mode with story_key={{story_key}} and complexity_level={{story_key}}.complexity.level
                 4. Follow all 7 pipeline steps (init, pre-gap, implement, post-validate, code-review, complete, summary)
                 5. Commit changes when complete
                 6. Report final status (done/failed) with file list

                 Story file will be auto-resolved from multiple naming conventions."
      - run_in_background: false (wait for completion to track results)
    </action>

    <action>Store task IDs for this batch: task_ids[]</action>

    <output>
✅ Spawned {{stories_in_batch}} Task agents

Agents will process stories autonomously with full quality gates:
- Pre-gap analysis (validate tasks)
- Implementation (TDD/refactor)
- Post-validation (verify completion)
- Code review (find 3-10 issues)
- Git commit (targeted files only)

{{#if not last_batch}}
Waiting for this batch to complete before spawning next batch...
{{/if}}
    </output>

    <action>Wait for all agents in batch to complete</action>
    <action>Collect results from each agent via TaskOutput</action>

    <iterate>For each completed agent:</iterate>
    <check if="agent succeeded">
      <output>✅ Implementation complete: {{story_key}}</output>

      <action>Execute Step 4.5: Smart Story Reconciliation</action>
      <action>Load reconciliation instructions: {installed_path}/step-4.5-reconcile-story-status.md</action>
      <action>Execute reconciliation with story_key={{story_key}}</action>

      <check if="reconciliation succeeded">
        <output>✅ COMPLETED: {{story_key}} (reconciled)</output>
        <action>Increment completed counter</action>
      </check>

      <check if="reconciliation failed">
        <output>⚠️ WARNING: {{story_key}} completed but reconciliation failed</output>
        <action>Increment completed counter (implementation was successful)</action>
        <action>Add to reconciliation_warnings: {story_key: {{story_key}}, warning_message: "Reconciliation failed - manual verification needed"}</action>
        <action>Increment reconciliation_warnings_count</action>
      </check>
    </check>

    <check if="agent failed">
      <output>❌ FAILED: {{story_key}}</output>
      <action>Increment failed counter</action>
      <action>Add story_key to failed_stories list</action>
    </check>

    <output>
**Batch {{batch_index}} Complete:** {{batch_completed}} succeeded, {{batch_failed}} failed
**Overall Progress:** {{completed}}/{{total_count}} completed
    </output>
  </substep>

  <action>After all batches processed, jump to Step 5 (Summary)</action>
</step>

<step n="5" goal="Display batch summary">
  <action>Calculate end_time and total_duration</action>
  <action>Calculate success_rate = (completed / total_count) * 100</action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 BATCH SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Total stories:** {{total_count}}
**✅ Completed:** {{completed}}
**❌ Failed:** {{failed}}
**⚠️ Reconciliation warnings:** {{reconciliation_warnings_count}}
**Success rate:** {{success_rate}}%
**Duration:** {{total_duration}}

{{#if failed > 0}}
**Failed stories:**
{{#each failed_stories}}
  - {{this}}
{{/each}}

**Retry failed stories:**
```bash
{{#each failed_stories}}
/bmad:bmm:workflows:super-dev-pipeline mode=batch story_key={{this}}
{{/each}}
```
{{/if}}

{{#if reconciliation_warnings_count > 0}}
**⚠️ Reconciliation warnings (stories completed but status may be inaccurate):**
{{#each reconciliation_warnings}}
  - {{story_key}}: {{warning_message}}
{{/each}}

**Manual reconciliation needed:**
Review these stories to ensure checkboxes and status are accurate.
Check Dev Agent Record vs Acceptance Criteria/Tasks/DoD sections.
{{/if}}

**Next steps:**
1. Check sprint-status.yaml - stories should be marked "done" or "review"
2. Run tests: `pnpm test`
3. Check coverage: `pnpm test --coverage`
4. Review commits: `git log -{{completed}}`
5. Spot-check 2-3 stories for quality

**Run another batch?**
`/bmad:bmm:workflows:batch-super-dev`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Save batch log to {batch_log}</action>
  <action>Log contents: start_time, end_time, total_duration, selected_stories, completed_stories, failed_stories, success_rate</action>
</step>

</workflow>
