# Batch Super-Dev - Interactive Story Selector
## AKA: "Mend the Gap" 🚇

**Primary Use Case:** Gap analysis and reconciliation workflow

This workflow helps you "mind the gap" between story requirements and codebase reality, then "mend the gap" by building only what's truly missing.

### What This Workflow Does

1. **Scans codebase** to verify what's actually implemented vs what stories claim
2. **Finds the gap** between story requirements and reality
3. **Mends the gap** by building ONLY what's truly missing (no duplicate work)
4. **Updates tracking** to reflect actual completion status (check boxes, sprint-status)

### Common Use Cases

**Reconciliation Mode (Most Common):**
- Work was done but not properly tracked
- Stories say "build X" but X is 60-80% already done
- Need second set of eyes to find real gaps
- Update story checkboxes to match reality

**Greenfield Mode:**
- Story says "build X", nothing exists
- Build 100% from scratch with full quality gates

**Brownfield Mode:**
- Story says "modify X", X exists
- Refactor carefully, add only new requirements

### Execution Modes

**Sequential (Recommended for Gap Analysis):**
- Process stories ONE-BY-ONE in THIS SESSION
- After each story: verify existing code → build only gaps → check boxes → move to next
- Easier to monitor, can intervene if issues found
- Best for reconciliation work

**Parallel (For Greenfield Batch Implementation):**
- Spawn autonomous Task agents to process stories concurrently
- Faster completion but harder to monitor
- Best when stories are independent and greenfield

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/_bmad/bmm/workflows/4-implementation/batch-super-dev/workflow.yaml</critical>

<critical>⚕️ HOSPITAL-GRADE CODE STANDARDS ⚕️</critical>
<critical>This code may be used in healthcare settings where LIVES ARE AT STAKE.</critical>
<critical>Every line of code must meet hospital-grade reliability standards.</critical>
<critical>QUALITY >> SPEED. Take 5 hours to do it right, not 1 hour to do it poorly.</critical>

<workflow>

<step n="0" goal="Load and parse sprint-status.yaml">
  <action>Read {sprint_status} file</action>
  <action>Parse metadata: project, project_key, tracking_system</action>
  <action>Parse development_status map</action>

  <action>Filter stories with status = "ready-for-dev" OR "backlog"</action>
  <action>Exclude entries that are epics (keys starting with "epic-") or retrospectives (keys ending with "-retrospective")</action>
  <action>Group by status: ready_for_dev_stories, backlog_stories</action>

  <check if="filter_by_epic is not empty">
    <action>Further filter stories to only include those starting with "{filter_by_epic}-"</action>
    <example>If filter_by_epic = "3", only include stories like "3-1-...", "3-2-...", etc.</example>
  </check>

  <action>Sort filtered stories by epic number, then story number (e.g., 1-1, 1-2, 2-1, 3-1)</action>
  <action>Store as: ready_for_dev_stories (list of story keys)</action>

  <check if="ready_for_dev_stories is empty AND backlog_stories is empty">
    <output>✅ No available stories found (ready-for-dev or backlog).

All stories are either in-progress, review, or done!

Run `/bmad_bmm_sprint-status` to see current status.</output>
    <action>Exit workflow</action>
  </check>

  <action>Combine both lists: available_stories = ready_for_dev_stories + backlog_stories</action>
</step>

<step n="1" goal="Display available stories with details">
  <action>Read comment field for each story from sprint-status.yaml (text after # on the same line)</action>

  <action>For each story, verify story file exists using COMPREHENSIVE naming pattern detection:</action>

  <substep n="2a" title="Parse story key to extract epic and story numbers">
    <action>Parse story_key (e.g., "20-9-megamenu-navigation" or "20-9") to extract:</action>
    <action>  - epic_num: first number (e.g., "20")</action>
    <action>  - story_num: second number (e.g., "9")</action>
    <action>  - optional_suffix: everything after second number (e.g., "-megamenu-navigation" or empty)</action>
    <example>Input: "20-9-megamenu-navigation" → epic=20, story=9, suffix="-megamenu-navigation"</example>
    <example>Input: "20-11" → epic=20, story=11, suffix=""</example>
  </substep>

  <substep n="2b" title="Check for story file using CANONICAL format only">
    <critical>🚨 ONE CANONICAL FORMAT - NO VARIATIONS</critical>

    <action>CANONICAL FORMAT: {story_key}.md</action>
    <example>20-9-megamenu-navigation.md (epic-story-slug, NO prefix)</example>
    <example>18-1-charge-model-state-machine.md (epic-story-slug, NO prefix)</example>

    <action>Check if file exists: {sprint_artifacts}/{story_key}.md</action>

    <check if="file exists">
      <action>Set file_status = ✅ EXISTS</action>
      <action>Store file_path = {sprint_artifacts}/{story_key}.md</action>
    </check>

    <check if="file does NOT exist">
      <action>Set file_status = ❌ MISSING</action>

      <action>Check for legacy wrong-named files:</action>
      <action>  Search for: story-{story_key}.md (wrong - has "story-" prefix)</action>

      <check if="found wrong-named file">
        <output>⚠️ Found legacy file: story-{story_key}.md</output>
        <output>🔧 AUTO-RENAMING to canonical: {story_key}.md</output>

        <action>Rename: mv story-{story_key}.md {story_key}.md</action>
        <action>Verify rename worked</action>
        <action>Set file_status = ✅ EXISTS (after rename)</action>
        <action>Store file_path = {sprint_artifacts}/{story_key}.md</action>
      </check>

      <check if="no file found (canonical OR legacy)">
        <action>file_status = ❌ MISSING (genuinely missing)</action>
      </check>
    </check>
  </substep>

  <action>Mark stories as: ✅ (file exists), ❌ (file missing), 🔄 (already implemented but not marked done)</action>

  <output>
## 📦 Available Stories ({{count}})

{{#if filter_by_epic}}
**Filtered by Epic {{filter_by_epic}}**
{{/if}}

{{#if ready_for_dev_stories.length > 0}}
### Ready for Dev ({{ready_for_dev_stories.length}})
{{#each ready_for_dev_stories}}
{{@index}}. **{{key}}** {{file_status_icon}} {{sprint_status}}
   {{#if comment}}→ {{comment}}{{/if}}
   {{#if file_path}}   File: {{file_path}}{{/if}}
{{/each}}
{{/if}}

{{#if backlog_stories.length > 0}}
### Backlog ({{backlog_stories.length}})
{{#each backlog_stories}}
{{@index}}. **{{key}}** {{file_status_icon}} [BACKLOG]
   {{#if comment}}→ {{comment}}{{/if}}
   {{#if file_path}}   File: {{file_path}}{{else}}   Needs story creation{{/if}}
{{/each}}
{{/if}}

---
**Legend:**
- ✅ Story file exists, ready to implement
- 🔄 Already implemented, just needs status update
- ❌ Story file missing, needs creation first
- [BACKLOG] Story needs gap analysis before implementation

**Total:** {{count}} stories available
**Max batch size:** {{max_stories}} stories
  </output>
</step>

<step n="1.5" goal="Validate and create/regenerate stories as needed">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 VALIDATING STORY FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <iterate>For each story in available_stories (ready_for_dev + backlog):</iterate>

  <substep n="2.5a" title="Check story file existence and validity">
    <action>Check if story file exists (already done in Step 2)</action>

    <check if="file_status_icon == '❌' (file missing)">
      <check if="story status is BACKLOG">
        <output>📝 Story {{story_key}}: BACKLOG - will create basic story file</output>
        <action>Mark story as needs_story_creation = true</action>
        <action>Mark story.creation_workflow = "/create-story" (lightweight, no gap analysis)</action>
        <action>Mark story as validated (will create in next step)</action>
      </check>

      <check if="story status is ready-for-dev">
        <output>❌ Story {{story_key}}: File MISSING but status is ready-for-dev</output>
        <action>Mark story for removal from selection</action>
        <action>Add to skipped_stories list with reason: "Story file missing (status ready-for-dev but no file)"</action>
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
      <action>Check Acceptance Criteria item count: ac_count</action>
      <action>Count unchecked tasks ([ ]) in Tasks/Subtasks: task_count</action>
      <action>Look for gap analysis markers (✅/❌) in Current State</action>

      <check if="task_count < 3">
        <output>
❌ Story {{story_key}}: INVALID - Insufficient tasks ({{task_count}}/3 minimum)

This story has TOO FEW TASKS to be a valid story (found {{task_count}}, need ≥3).

Analysis:
- 0 tasks: Story is a stub or empty
- 1-2 tasks: Too small to represent meaningful feature work
- ≥3 tasks: Minimum valid (MICRO threshold)

Possible causes:
- Story file is incomplete/stub
- Tasks section is empty or malformed
- Story needs proper task breakdown
- Story is too small and should be combined with another

Required action:
- Run /validate-create-story to regenerate with proper task breakdown
- Or manually add tasks to reach minimum of 3 tasks
- Or combine this story with a related story

This story will be SKIPPED.
        </output>
        <action>Mark story for removal from selection</action>
        <action>Add to skipped_stories list with reason: "INVALID - Only {{task_count}} tasks (need ≥3)"</action>
        <goto next iteration />
      </check>

      <check if="sections_found < 12 OR Current State < 100 words OR no gap analysis markers OR ac_count < 3">
        <output>
⚠️ Story {{story_key}}: File incomplete or invalid
   - Sections: {{sections_found}}/12
   {{#if Current State < 100 words}}- Current State: stub ({{word_count}} words, expected ≥100){{/if}}
   {{#if no gap analysis}}- Gap analysis: missing{{/if}}
   {{#if ac_count < 3}}- Acceptance Criteria: {{ac_count}} items (expected ≥3){{/if}}
   {{#if task_count < 3}}- Tasks: {{task_count}} items (expected ≥3){{/if}}
        </output>

        <ask>Regenerate story with codebase scan? (yes/no):</ask>

        <check if="response == 'yes'">
          <output>
⚠️ STORY REGENERATION REQUIRES MANUAL WORKFLOW EXECUTION

**Story:** {{story_key}}
**Status:** File incomplete or invalid ({{sections_found}}/12 sections)

**Problem:**
Agents cannot invoke /create-story-with-gap-analysis workflow autonomously.
Story regeneration requires:
- Interactive user prompts
- Context-heavy codebase scanning
- Gap analysis decision-making

**Required Action:**

1. **Exit this batch execution:**
   - This story will be skipped
   - Batch will continue with valid stories only

2. **Backup existing file (optional):**
   ```
   cp {{file_path}} {{file_path}}.backup
   ```

3. **Regenerate story manually:**
   ```
   /create-story-with-gap-analysis
   ```
   When prompted, provide:
   - Story key: {{story_key}}

4. **Validate story format:**
   ```
   ./scripts/validate-all-stories.sh
   ```

5. **Re-run batch-super-dev:**
   - Story will now be properly formatted

**Skipping story {{story_key}} from current batch execution.**
          </output>

          <action>Mark story for removal from selection</action>
          <action>Add to skipped_stories list with reason: "Story regeneration requires manual workflow (agents cannot invoke /create-story)"</action>
          <action>Add to manual_actions_required list: "Regenerate {{story_key}} with /create-story-with-gap-analysis"</action>
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

<step n="1.6" goal="Score story complexity for pipeline routing (NEW v1.3.0)">
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

    <check if="task_count < 3">
      <output>
⚠️ Story {{story_key}}: Cannot score complexity - INSUFFICIENT TASKS ({{task_count}}/3 minimum)

This story was not caught in Step 2.5 validation but has too few tasks.
It should have been rejected during validation.

Skipping complexity scoring for this story - marking as INVALID.
      </output>
      <action>Set {{story_key}}.complexity = {level: "INVALID", score: 0, task_count: {{task_count}}, reason: "Insufficient tasks ({{task_count}}/3 minimum)"}</action>
      <action>Continue to next story</action>
    </check>

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

  <action>Filter out INVALID stories (those with level="INVALID"):</action>
  <action>For each INVALID story, add to skipped_stories with reason from complexity object</action>
  <action>Remove INVALID stories from complexity_groups and ready_for_dev_stories</action>

  <check if="any INVALID stories found">
    <output>
❌ **Invalid Stories Skipped ({{invalid_count}}):**
{{#each invalid_stories}}
  - {{story_key}}: {{reason}}
{{/each}}

These stories need to be regenerated with /create-story or /validate-create-story before processing.
    </output>
  </check>

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

  <check if="all stories are INVALID">
    <output>
❌ No valid stories remaining after complexity analysis.

All stories were either:
- Missing story files (Step 2.5)
- Invalid/incomplete (Step 2.5)
- Zero tasks (Step 2.6)

Run /create-story or /validate-create-story to create proper story files, then rerun /batch-super-dev.
    </output>
    <action>Exit workflow</action>
  </check>
</step>

<step n="2" goal="Get user selection">
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
{{@index}}. {{key}} {{#if is_backlog}}[BACKLOG - needs story creation]{{/if}}
{{/each}}

**Estimated time:** {{count}} stories × 30-60 min/story = {{estimated_hours}} hours
  </output>
</step>

<step n="2.5" goal="Implementation Readiness Check">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 IMPLEMENTATION READINESS CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Validating selected stories for quality and completeness...
  </output>

  <iterate>For each selected story:</iterate>

  <substep n="2.5a" title="Validate story quality">
    <action>Read story file: {{story_file_path}}</action>

    <check if="story file missing">
      <check if="story status is BACKLOG">
        <output>⚠️  {{story_key}}: No story file (BACKLOG) - will create during execution</output>
        <action>Mark story as needs_creation</action>
        <action>Continue to next story</action>
      </check>

      <check if="story status is ready-for-dev">
        <output>❌ {{story_key}}: Story file MISSING but status is ready-for-dev (inconsistent state)</output>
        <action>Add to validation_failures list</action>
        <action>Continue to next story</action>
      </check>
    </check>

    <check if="story file exists">
      <action>Validate story completeness:
        - Count sections (need 12)
        - Check Current State word count (need ≥100)
        - Check gap analysis markers (✅/❌)
        - Count Acceptance Criteria (need ≥3)
        - Count unchecked tasks (need ≥3)
      </action>

      <check if="task_count < 3">
        <output>❌ {{story_key}}: INSUFFICIENT TASKS ({{task_count}}/3 minimum)</output>
        <action>Add to validation_failures: "{{story_key}}: Only {{task_count}} tasks"</action>
      </check>

      <check if="sections_found < 12 OR missing gap analysis OR ac_count < 3">
        <output>⚠️  {{story_key}}: Story incomplete ({{sections_found}}/12 sections{{#if !gap_analysis}}, no gap analysis{{/if}})</output>
        <action>Add to validation_warnings: "{{story_key}}: Needs regeneration"</action>
      </check>

      <check if="all validations pass">
        <output>✅ {{story_key}}: Valid and ready</output>
        <action>Add to validated_stories list</action>
      </check>
    </check>
  </substep>

  <check if="validation_failures.length > 0">
    <output>
❌ **Validation Failures ({{validation_failures.length}}):**

{{#each validation_failures}}
  - {{this}}
{{/each}}

These stories CANNOT be processed. Options:
1. Remove them from selection
2. Fix them manually
3. Cancel batch execution
    </output>

    <ask>Remove failed stories and continue? (yes/no):</ask>

    <check if="response == 'yes'">
      <action>Remove validation_failures from selected_stories</action>
      <output>✅ Removed {{validation_failures.length}} invalid stories. Continuing with {{selected_stories.length}} valid stories.</output>
    </check>

    <check if="response == 'no'">
      <output>❌ Batch processing cancelled. Please fix story validation issues first.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <check if="validation_warnings.length > 0">
    <output>
⚠️  **Validation Warnings ({{validation_warnings.length}}):**

{{#each validation_warnings}}
  - {{this}}
{{/each}}

These stories have quality issues but can still be processed.
Recommend regenerating with /create-story-with-gap-analysis for better quality.
    </output>

    <ask>Continue with these stories anyway? (yes/no):</ask>

    <check if="response == 'no'">
      <output>❌ Batch processing cancelled.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Implementation Readiness: PASS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Validated:** {{validated_stories.length}} stories
**Needs Creation:** {{needs_creation.length}} stories (BACKLOG)
**Quality:** All stories meet minimum standards
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="2.7" goal="Batch create story files for backlog stories">
  <check if="needs_creation.length == 0">
    <output>✅ All stories have files - skipping story creation</output>
    <action>Jump to Step 3</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 BATCH STORY CREATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{needs_creation.length}} stories need creation (BACKLOG status):
{{#each needs_creation}}
  - {{story_key}}
{{/each}}

These will be created using /create-story (lightweight, no gap analysis).
Gap analysis will happen just-in-time during implementation (Step 2 of super-dev-pipeline).
  </output>

  <ask>Create these {{needs_creation.length}} story files now? (yes/no):</ask>

  <check if="response != 'yes'">
    <output>⏭️  Skipping story creation. These stories will be removed from batch.</output>
    <action>Remove needs_creation stories from selected_stories</action>

    <check if="selected_stories.length == 0">
      <output>❌ No stories remaining after removing backlog stories. Exiting.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <output>🚀 Spawning {{needs_creation.length}} parallel agents for story creation...</output>

  <action>Spawn Task agents in PARALLEL (send all Task calls in SINGLE message):</action>

  <iterate>For each story in needs_creation:</iterate>

  <substep n="2.7a" title="Spawn story creation agent">
    <action>
      Task tool call:
      - subagent_type: "general-purpose"
      - description: "Create story {{story_key}}"
      - prompt: "Create basic story file for {{story_key}}.

                 INSTRUCTIONS:
                 1. Read epic description from docs/epics.md (Epic {{epic_num}})
                 2. Read PRD requirements (docs/prd-art-collective-tenants.md)
                 3. Read architecture (docs/architecture-space-rentals.md)
                 4. Extract FRs for this story from PRD
                 5. Break down into 3-7 tasks with subtasks
                 6. Create story file at: docs/sprint-artifacts/{{story_key}}.md
                 7. Use template from: _bmad/bmm/workflows/4-implementation/create-story/template.md
                 8. NO gap analysis (defer to implementation)
                 9. Commit story file when complete
                 10. Report: story file path

                 Mode: batch (lightweight, no codebase scanning)"
      - Store returned agent_id for tracking
    </action>
  </substep>

  <output>
⏳ Waiting for {{needs_creation.length}} parallel agents to complete...

Story creation agents:
{{#each needs_creation}}
  - Agent {{@index}}: {{story_key}}
{{/each}}
  </output>

  <action>Wait for ALL agents to complete (blocking)</action>

  <iterate>Check each agent output:</iterate>

  <substep n="2.7b" title="Verify story creation results">
    <action>Parse agent output for {{story_key}}</action>

    <check if="agent succeeded AND story file exists">
      <output>✅ Story created: {{story_key}}</output>
      <action>Verify file exists at docs/sprint-artifacts/{{story_key}}.md</action>
      <action>Mark story.needs_story_creation = false</action>
    </check>

    <check if="agent failed OR story file missing">
      <output>❌ Failed to create story: {{story_key}}</output>
      <action>Add to failed_creations list</action>
      <action>Remove from selected_stories</action>
    </check>
  </substep>

  <check if="failed_creations.length > 0">
    <output>
⚠️  {{failed_creations.length}} stories failed creation:
{{#each failed_creations}}
  - {{this}}
{{/each}}

These will be skipped in batch execution.
    </output>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Story Creation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Created:** {{needs_creation.length - failed_creations.length}} stories
**Failed:** {{failed_creations.length}} stories
**Ready for implementation:** {{selected_stories.length}} stories

Note: Gap analysis will happen just-in-time during implementation.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="3" goal="Choose execution mode and strategy">
  <output>
╔═══════════════════════════════════════════════════════════════════╗
║  BATCH SUPER-DEV: Execution Mode Selection                        ║
╚═══════════════════════════════════════════════════════════════════╝

⚕️ HOSPITAL-GRADE CODE STANDARDS ACTIVE ⚕️
Lives are at stake. All code must meet safety-critical reliability standards.
  </output>

  <ask>
**Choose execution mode:**

[I] INTERACTIVE CHECKPOINT MODE
    - After each story completes, pause for your review
    - You approve before proceeding to next story
    - Allows course correction if issues detected
    - Best for: When you want to monitor progress

[A] FULLY AUTONOMOUS MODE
    - Process all selected stories without pausing
    - No human interaction until completion
    - Best for: When stories are well-defined and you trust the process

Which mode? [I/A]:
  </ask>

  <action>Read user input</action>

  <check if="user selects 'I' or 'i'">
    <action>Set execution_mode = "interactive_checkpoint"</action>
    <output>
✅ Interactive Checkpoint Mode Selected

After each story implementation:
- Full quality report displayed
- You approve before next story begins
- Allows real-time oversight and intervention
    </output>
  </check>

  <check if="user selects 'A' or 'a'">
    <action>Set execution_mode = "fully_autonomous"</action>
    <output>
⚕️ Fully Autonomous Mode Selected - HOSPITAL-GRADE STANDARDS ENFORCED

Quality enhancements for autonomous mode:
✅ Double validation at each step
✅ Comprehensive error checking
✅ Detailed audit trail generation
✅ Zero-tolerance for shortcuts
✅ Hospital-grade code verification

Processing will continue until ALL selected stories complete.
NO human interaction required until completion.

QUALITY OVER SPEED: Taking time to ensure correctness.
    </output>
    <action>Activate hospital_grade_mode = true</action>
    <action>Set quality_multiplier = 1.5</action>
  </check>

  <substep n="3.1" title="Automatic Dependency Analysis (from GSD)">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ANALYZING STORY DEPENDENCIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <iterate>For each selected story:</iterate>

    <action>Read story file Tasks section</action>
    <action>Analyze task descriptions for dependencies on other selected stories:</action>
    <action>
      Dependency detection rules:
      - Look for mentions of other story keys (e.g., "18-1", "18-2")
      - Look for phrases like "requires", "depends on", "needs", "after"
      - Look for file paths that other stories create
      - Look for models/services that other stories define
    </action>

    <action>Build dependency map:
      story_key: {
        depends_on: [list of story keys this depends on],
        blocks: [list of story keys that depend on this]
      }
    </action>

    <action>Compute waves using topological sort:</action>
    <action>
      Wave 1: Stories with no dependencies (can start immediately)
      Wave 2: Stories that only depend on Wave 1
      Wave 3: Stories that depend on Wave 2
      ...
    </action>

    <output>
📊 **Dependency Analysis Complete**

{{#each waves}}
**Wave {{@index}}** ({{count}} stories):
{{#each stories}}
  - {{story_key}}{{#if depends_on}} [depends on: {{depends_on}}]{{/if}}
{{/each}}
{{/each}}

**Execution Strategy:**
{{#if waves.length == 1}}
✅ All stories are independent - can run fully in parallel
{{else}}
⚙️ Dependencies detected - wave-based execution recommended
- Wave 1: {{wave_1_count}} stories (parallel)
- Total waves: {{waves.length}}
- Sequential time: {{total_time_sequential}}
- Wave-based time: {{total_time_waves}} ({{time_savings}}% faster)
{{/if}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </substep>

  <ask>
**How should these stories be processed?**

Options:
- **S**: Sequential - Run stories one-by-one (Task agent finishes before next starts)
- **P**: Parallel - Run stories concurrently (Multiple Task agents running simultaneously)

**Note:** Both modes use Task agents to keep story context out of the main thread.
The only difference is the number running at once.

Enter: S or P
  </ask>

  <action>Capture response as: execution_strategy</action>

  <check if="execution_strategy == 's' OR execution_strategy == 'S'">
    <action>Set execution_mode = "sequential"</action>
    <action>Set parallel_count = 1</action>
    <action>Set use_task_agents = true</action>
    <output>
⏺ ✅ Sequential mode selected - stories will be processed one-by-one

Each story runs in its own Task agent. Agents execute sequentially (one completes before next starts).
This keeps the main thread clean while maintaining easy monitoring.
    </output>
  </check>

  <check if="execution_strategy == 'p' OR execution_strategy == 'P'">
    <action>Set execution_mode = "parallel"</action>
    <action>Set use_task_agents = true</action>

    <ask>
**How many agents should run in parallel?**

Options:
- **2**: Conservative (low resource usage, easier debugging)
- **4**: Moderate (balanced performance, recommended)
- **8**: Aggressive (higher throughput)
- **10**: Maximum (10 agent limit for safety)
- **all**: Use all stories (max 10 agents)

Enter number (2-10) or 'all':
    </ask>

    <action>Capture response as: parallel_count</action>
    <action>If parallel_count == 'all': set parallel_count = min(count of selected_stories, 10)</action>
    <action>If parallel_count > 10: set parallel_count = 10 (safety limit)</action>

    <check if="parallel_count was capped at 10">
      <output>⚠️ Requested {{original_count}} agents, capped at 10 (safety limit)</output>
    </check>

    <output>
⏺ ✅ Parallel mode selected - {{parallel_count}} Task agents will run concurrently

Each story runs in its own Task agent. Multiple agents execute in parallel for faster completion.
    </output>
  </check>

  <output>
## ⚙️ Execution Plan

**Mode:** {{execution_mode}}
**Task Agents:** {{parallel_count}} {{#if parallel_count > 1}}running concurrently{{else}}running sequentially{{/if}}
**Agent Type:** general-purpose (autonomous)

**Stories to process:** {{count}}
**Estimated total time:**
{{#if parallel_count > 1}}
- With {{parallel_count}} agents: {{estimated_hours / parallel_count}} hours
{{else}}
- Sequential: {{estimated_hours}} hours
{{/if}}

**Complexity Routing:**
{{#each stories_by_complexity}}
- {{complexity}}: {{count}} stories ({{pipeline_description}})
{{/each}}
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

  <check if="parallel_count == 1">
    <action>Jump to Step 4-Sequential (Task agents, one at a time)</action>
  </check>

  <check if="parallel_count > 1 AND waves.length > 1">
    <action>Jump to Step 4-Wave (Task agents, wave-based parallel)</action>
  </check>

  <check if="parallel_count > 1 AND waves.length <= 1">
    <action>Jump to Step 4-Parallel (Task agents, multiple concurrent)</action>
  </check>
</step>

<step n="4-Wave" goal="Wave-based parallel execution">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 WAVE-BASED PARALLEL PROCESSING STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Stories:** {{count}}
**Total waves:** {{waves.length}}
**Mode:** Task agents (parallel by wave)
**Max concurrent agents:** {{parallel_count}}
**Continue on failure:** {{continue_on_failure}}
**Pattern:** Wave barrier (complete wave before next wave)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Wave Plan (from dependency analysis):**
{{#each waves}}
Wave {{@index}}: {{count}} stories
{{#each stories}}
  - {{story_key}}{{#if depends_on}} [depends on: {{depends_on}}]{{/if}}
{{/each}}
{{/each}}
  </output>

  <action>Set abort_batch = false</action>

  <iterate>For each wave in waves (in order):</iterate>

  <substep n="4w-start" title="Start wave {{@index}}">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌊 STARTING WAVE {{@index}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stories in this wave:
{{#each stories}}
  - {{story_key}}{{#if depends_on}} (depends on: {{depends_on}}){{/if}}
{{/each}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Initialize wave worker pool state:</action>
    <action>
      - wave_queue = stories
      - Resolve wave_queue items to full story objects by matching story_key in selected_stories (include complexity_level, story_file_path)
      - active_workers = {} (map of worker_id → {story_key, task_id, started_at})
      - completed_wave_stories = []
      - failed_wave_stories = []
      - next_story_index = 0
      - max_workers = min(parallel_count, wave_queue.length)
    </action>
  </substep>

  <substep n="4w-init" title="Fill initial worker slots for wave {{@index}}">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Initializing {{max_workers}} worker slots for Wave {{@index}}...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Spawn first {{max_workers}} agents (or fewer if less stories):</action>

    <iterate>While next_story_index < min(max_workers, wave_queue.length):</iterate>

    <action>
      story_key = wave_queue[next_story_index].story_key
      complexity_level = wave_queue[next_story_index].complexity_level
      story_file_path = wave_queue[next_story_index].story_file_path
      worker_id = next_story_index + 1

      Spawn Task agent:
      - subagent_type: "general-purpose"
      - description: "Implement story {{story_key}}"
      - prompt: "Execute super-dev-pipeline workflow for story {{story_key}}.

                 Story file: docs/sprint-artifacts/{{story_key}}.md
                 Complexity: {{complexity_level}}
                 Mode: batch

                 Load workflow: /Users/jonahschulte/git/BMAD-METHOD/src/modules/bmm/workflows/4-implementation/super-dev-pipeline
                 Follow the multi-agent pipeline (builder, inspector, reviewer, fixer).
                 Commit when complete, update story status, report results."
      - run_in_background: true (non-blocking)

      Store in active_workers[worker_id]:
        story_key: {{story_key}}
        task_id: {{returned_task_id}}
        started_at: {{timestamp}}
        status: "running"
    </action>

    <action>Increment next_story_index</action>
    <output>🚀 Worker {{worker_id}} started: {{story_key}}</output>
  </substep>

  <substep n="4w-pool" title="Maintain wave worker pool for wave {{@index}}">
    <critical>WAVE BARRIER: Complete all stories in this wave before starting next wave</critical>

    <iterate>While active_workers.size > 0 OR next_story_index < wave_queue.length:</iterate>

    <action>Poll for completed workers (check task outputs non-blocking):</action>

    <iterate>For each worker_id in active_workers:</iterate>

    <action>Check if worker task completed using TaskOutput(task_id, block=false)</action>

    <check if="worker task is still running">
      <action>Continue to next worker (don't wait)</action>
    </check>

    <check if="worker task completed successfully">
      <action>Get worker details: story_key = active_workers[worker_id].story_key</action>

      <output>✅ Worker {{worker_id}} completed: {{story_key}}</output>

      <action>Execute Step 4.5: Smart Story Reconciliation</action>
      <action>Load reconciliation instructions: {installed_path}/step-4.5-reconcile-story-status.md</action>
      <action>Execute reconciliation with story_key={{story_key}}</action>

      <critical>🚨 MANDATORY STORY FILE VERIFICATION - MAIN ORCHESTRATOR MUST RUN BASH</critical>

      <bash_required>
STORY_FILE="docs/sprint-artifacts/{{story_key}}.md"
echo "🔍 Verifying story file: {{story_key}}"

CHECKED_COUNT=$(grep -c "^- \[x\]" "$STORY_FILE" 2>/dev/null || echo "0")
TOTAL_COUNT=$(grep -c "^- \[.\]" "$STORY_FILE" 2>/dev/null || echo "0")
echo "  Checked tasks: $CHECKED_COUNT/$TOTAL_COUNT"

RECORD_FILLED=$(grep -A 20 "^### Dev Agent Record" "$STORY_FILE" 2>/dev/null | grep -c "Claude Sonnet" || echo "0")
echo "  Dev Agent Record: $RECORD_FILLED"

echo "$CHECKED_COUNT" > /tmp/checked_{{story_key}}.txt
echo "$RECORD_FILLED" > /tmp/record_{{story_key}}.txt
      </bash_required>

      <check if="checked_count == 0 OR record_filled == 0">
        <output>
❌ Story {{story_key}}: Agent FAILED to update story file

Checked tasks: {{checked_tasks}}/{{total_tasks}}
Dev Agent Record: {{dev_agent_record_status}}

🔧 EXECUTING AUTO-FIX RECONCILIATION...
        </output>

        <action>AUTO-FIX PROCEDURE:</action>
        <action>1. Read agent's commit to see what files were created/modified</action>
        <action>2. Read story Tasks section to see what was supposed to be built</action>
        <action>3. For each task, check if corresponding code exists in commit</action>
        <action>4. If code exists, check off the task using Edit tool</action>
        <action>5. Fill in Dev Agent Record with commit details</action>
        <action>6. Verify fixes worked (re-count checked tasks)</action>

        <check if="auto_fix_succeeded AND checked_tasks > 0">
          <output>✅ AUTO-FIX SUCCESS: {{checked_tasks}}/{{total_tasks}} tasks now checked</output>
          <action>Continue with story completion</action>
        </check>

        <check if="auto_fix_failed OR checked_tasks still == 0">
          <output>
❌ AUTO-FIX FAILED: Cannot reconcile story {{story_key}}

After auto-fix attempts:
- Checked tasks: {{checked_tasks}}/{{total_tasks}}
- Dev Agent Record: {{dev_agent_record_status}}

**Agent produced code but story file cannot be updated.**

Marking story as "in-progress" (not done) and continuing with warnings.
          </output>
          <action>Override story status to "in-progress"</action>
          <action>Add to reconciliation_warnings with detailed diagnostic</action>
          <action>Continue (do NOT kill workers)</action>
        </check>
      </check>

      <check if="reconciliation succeeded AND checked_tasks > 0 AND dev_agent_record_filled">
        <output>✅ COMPLETED: {{story_key}} (reconciled and verified)</output>
        <output>  Tasks: {{checked_tasks}}/{{total_tasks}} ({{task_completion_pct}}%)</output>
        <action>Increment completed counter</action>
        <action>Add to completed_wave_stories</action>
      </check>

      <check if="task_completion_pct < 80">
        <output>⚠️ WARNING: {{story_key}} - Low completion ({{task_completion_pct}}%)</output>
        <action>Add to reconciliation_warnings: {story_key: {{story_key}}, warning_message: "Only {{task_completion_pct}}% tasks checked - manual verification needed"}</action>
      </check>

      <action>Remove worker_id from active_workers (free the slot)</action>

      <action>IMMEDIATELY refill slot if stories remain in this wave:</action>
      <check if="next_story_index < wave_queue.length">
        <action>story_key = wave_queue[next_story_index].story_key</action>
        <action>complexity_level = wave_queue[next_story_index].complexity_level</action>
        <action>story_file_path = wave_queue[next_story_index].story_file_path</action>

        <output>🔄 Worker {{worker_id}} refilled: {{story_key}}</output>

        <action>Spawn new Task agent for this worker_id (same parameters as init)</action>
        <action>Update active_workers[worker_id] with new task_id and story_key</action>
        <action>Increment next_story_index</action>
      </check>
    </check>

    <check if="worker task failed">
      <action>Get worker details: story_key = active_workers[worker_id].story_key</action>

      <output>❌ Worker {{worker_id}} failed: {{story_key}}</output>

      <action>Increment failed counter</action>
      <action>Add story_key to failed_stories list</action>
      <action>Add to failed_wave_stories</action>
      <action>Remove worker_id from active_workers (free the slot)</action>

      <check if="continue_on_failure == false">
        <output>⚠️ Stopping wave and batch due to failure (continue_on_failure=false)</output>
        <action>Kill all active workers</action>
        <action>Clear active_workers</action>
        <action>Set abort_batch = true</action>
        <action>Break worker pool loop</action>
      </check>

      <check if="continue_on_failure == true AND next_story_index < wave_queue.length">
        <action>story_key = wave_queue[next_story_index].story_key</action>
        <action>complexity_level = wave_queue[next_story_index].complexity_level</action>
        <action>story_file_path = wave_queue[next_story_index].story_file_path</action>

        <output>🔄 Worker {{worker_id}} refilled: {{story_key}} (despite previous failure)</output>

        <action>Spawn new Task agent for this worker_id</action>
        <action>Update active_workers[worker_id] with new task_id and story_key</action>
        <action>Increment next_story_index</action>
      </check>
    </check>

    <check if="abort_batch == true">
      <action>Break worker pool loop</action>
    </check>

    <action>Display live progress every 30 seconds:</action>
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Live Progress (Wave {{@index}} - {{timestamp}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Completed: {{completed}}
❌ Failed: {{failed}}
🔄 Active workers: {{active_workers.size}}
📋 Queued in wave: {{wave_queue.length - next_story_index}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Sleep 5 seconds before next poll (prevents tight loop)</action>

  </substep>

  <check if="abort_batch == true">
    <output>⛔ Aborting remaining waves due to failure and continue_on_failure=false</output>
    <action>Jump to Step 5 (Summary)</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ WAVE {{@index}} COMPLETE
Stories completed: {{completed_wave_stories.length}}
Stories failed: {{failed_wave_stories.length}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>After all waves processed, jump to Step 5 (Summary)</action>
</step>

<step n="4-Sequential" goal="Sequential Task agent execution (one at a time)">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 SEQUENTIAL BATCH PROCESSING STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Stories:** {{count}}
**Mode:** Task agents (sequential, one at a time)
**Continue on failure:** {{continue_on_failure}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <iterate>For each story in selected_stories:</iterate>

  <substep n="4s-a" title="Spawn Task agent for story">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Story {{current_index}}/{{total_count}}: {{story_key}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Complexity: {{complexity_level}}
Pipeline: {{#if complexity_level == 'micro'}}Lightweight (skip tests, skip review){{else if complexity_level == 'standard'}}Full quality gates{{else}}Enhanced validation{{/if}}

Spawning Task agent...
    </output>

    <action>
      Use Task tool to spawn agent:
      - subagent_type: "general-purpose"
      - description: "Implement story {{story_key}}"
      - prompt: "Execute super-dev-pipeline workflow for story {{story_key}}.

                 Story file: docs/sprint-artifacts/{{story_key}}.md
                 Complexity: {{complexity_level}}
                 Mode: batch

                 Load workflow: /Users/jonahschulte/git/BMAD-METHOD/src/modules/bmm/workflows/4-implementation/super-dev-pipeline
                 Follow the multi-agent pipeline (builder, inspector, reviewer, fixer).
                 Commit when complete, update story status, report results."
      - Store agent_id
    </action>

    <action>WAIT for agent to complete (blocking call)</action>

    <check if="Task agent succeeded">
      <output>✅ Implementation complete: {{story_key}}</output>

      <critical>🚨 STORY RECONCILIATION - ORCHESTRATOR DOES THIS NOW (NOT AGENTS)</critical>

      <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 RECONCILING STORY FILE: {{story_key}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Main orchestrator performing reconciliation (not delegating)
      </output>

      <action>YOU (orchestrator) must use Bash tool NOW with this command:</action>

      <bash_command>
STORY_FILE="docs/sprint-artifacts/{{story_key}}.md"

echo "Verifying story file: $STORY_FILE"

CHECKED_COUNT=$(grep -c "^- \[x\]" "$STORY_FILE" 2>/dev/null || echo "0")
TOTAL_COUNT=$(grep -c "^- \[.\]" "$STORY_FILE" 2>/dev/null || echo "0")
echo "Checked tasks: $CHECKED_COUNT/$TOTAL_COUNT"

RECORD_FILLED=$(grep -A 20 "^### Dev Agent Record" "$STORY_FILE" 2>/dev/null | grep -c "Claude Sonnet" || echo "0")
echo "Dev Agent Record: $RECORD_FILLED"

echo "checked_count=$CHECKED_COUNT"
echo "record_filled=$RECORD_FILLED"
      </bash_command>

      <action>After running Bash tool, read the output and extract checked_count and record_filled values</action>

      <check if="checked_count == 0 OR record_filled == 0">
        <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ STORY FILE VERIFICATION FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: {{story_key}}
Checked tasks: {{checked_count}}/{{total_count}}
Dev Agent Record: {{#if record_filled > 0}}FILLED{{else}}EMPTY{{/if}}

🚨 The agent DID NOT update the story file.

YOU (the main orchestrator) must fix this NOW.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </output>

        <critical>MANDATORY AUTO-FIX - MAIN ORCHESTRATOR MUST EXECUTE THIS</critical>

        <action>AUTO-FIX PROCEDURE (YOU MUST DO THIS):</action>

        <bash_required>
# Step 1: Get commit for this story
COMMIT_SHA=$(git log -1 --grep="{{story_key}}" --pretty=format:"%H" 2>/dev/null)
if [ -z "$COMMIT_SHA" ]; then
  # Try finding by story key pattern
  COMMIT_SHA=$(git log -5 --pretty=format:"%H %s" | grep -i "{{story_key}}" | head -1 | cut -d' ' -f1)
fi

echo "Found commit: $COMMIT_SHA"

# Step 2: Get files changed
git diff ${COMMIT_SHA}~1 $COMMIT_SHA --name-only | grep -v "test/" | grep -v "__tests__"
        </bash_required>

        <action>Step 3: Read story file to get Tasks section:</action>
        <read_required>docs/sprint-artifacts/{{story_key}}.md</read_required>

        <action>Step 4: For EACH task in Tasks section:</action>
        <iterate>For each line starting with "- [ ]":</iterate>

        <action>
          - Extract task description
          - Check if git diff contains related file/function
          - If YES: Use Edit tool to change "- [ ]" to "- [x]"
          - Verify edit: Run bash grep to confirm checkbox is now checked
        </action>

        <action>Step 5: Fill Dev Agent Record using Edit tool:</action>
        <action>
          - Find "### Dev Agent Record" section
          - Replace with actual data:
            * Agent Model: Claude Sonnet 4.5 (multi-agent pipeline)
            * Date: {{current_date}}
            * Files: {{files_from_git_diff}}
            * Notes: {{from_commit_message}}
        </action>

        <action>Step 6: Re-run verification bash commands:</action>

        <bash_required>
CHECKED_COUNT=$(grep -c "^- \[x\]" "$STORY_FILE")
RECORD_FILLED=$(grep -A 20 "^### Dev Agent Record" "$STORY_FILE" | grep -c "Claude Sonnet")

echo "After auto-fix:"
echo "  Checked tasks: $CHECKED_COUNT"
echo "  Dev Agent Record: $RECORD_FILLED"

if [ "$CHECKED_COUNT" -eq 0 ]; then
  echo "❌ AUTO-FIX FAILED: Story file still not updated"
  exit 1
fi

echo "✅ AUTO-FIX SUCCESS"
        </bash_required>

        <check if="auto_fix_bash_exit_code == 0">
          <output>✅ AUTO-FIX SUCCESS: Story file now updated ({{checked_count}} tasks checked)</output>
          <action>Continue with story as completed</action>
        </check>

        <check if="auto_fix_bash_exit_code != 0">
          <output>
❌ AUTO-FIX FAILED: Cannot reconcile story {{story_key}}

After multiple fix attempts, story file still shows:
- Checked tasks: {{checked_count}}
- Dev Agent Record: {{record_status}}

Marking story as "in-progress" (not done).
          </output>
          <action>Update sprint-status to "in-progress" instead of "done"</action>
          <action>Add to failed_stories list</action>
          <action>Continue to next story (if continue_on_failure)</action>
        </check>
      </check>

      <check if="task_completion_pct < 80">
        <output>
⚠️ WARNING: Story {{story_key}} - LOW TASK COMPLETION

Only {{checked_tasks}}/{{total_tasks}} tasks checked ({{task_completion_pct}}%).

This suggests incomplete implementation. Cannot mark as "done".
Marking as "in-progress" instead.
        </output>
        <action>Override story status to "in-progress"</action>
        <action>Override sprint-status to "in-progress"</action>
        <action>Add to reconciliation_warnings</action>
      </check>

      <check if="reconciliation succeeded AND checked_tasks > 0 AND dev_agent_record_filled">
        <output>✅ COMPLETED: {{story_key}} (reconciled and verified)</output>
        <output>  Tasks: {{checked_tasks}}/{{total_tasks}} ({{task_completion_pct}}%)</output>
        <action>Increment completed counter</action>

        <check if="execution_mode == 'interactive_checkpoint'">
          <action>PAUSE FOR USER REVIEW</action>
          <output>
╔═══════════════════════════════════════════════════════════════════╗
║  INTERACTIVE CHECKPOINT: Story {{story_key}} Complete             ║
╚═══════════════════════════════════════════════════════════════════╝

✅ Story {{story_key}} successfully implemented and reconciled

Quality Summary:
- All tests passing
- Type checks passing
- Linter passing
- Code review completed
- Sprint status updated

Remaining stories: {{remaining}}

Options:
[C] Continue to next story
[R] Review implementation details
[P] Pause batch (exit workflow)

Your choice [C/R/P]:
          </output>

          <action>Read user input</action>

          <check if="user selects 'C' or 'c'">
            <output>✅ Continuing to next story...</output>
          </check>

          <check if="user selects 'R' or 'r'">
            <output>📋 Implementation Details for {{story_key}}</output>
            <action>Display story file, test results, review findings</action>
            <output>
Press [C] to continue or [P] to pause:
            </output>
            <action>Read user input</action>
            <check if="user selects 'C' or 'c'">
              <output>✅ Continuing to next story...</output>
            </check>
            <check if="user selects 'P' or 'p'">
              <output>⏸️  Batch paused. Run batch-super-dev again to continue with remaining stories.</output>
              <action>Jump to Step 5 (Summary)</action>
            </check>
          </check>

          <check if="user selects 'P' or 'p'">
            <output>⏸️  Batch paused. Run batch-super-dev again to continue with remaining stories.</output>
            <action>Jump to Step 5 (Summary)</action>
          </check>
        </check>

        <check if="execution_mode == 'fully_autonomous'">
          <output>✅ {{story_key}} complete. Automatically continuing to next story (autonomous mode)...</output>
        </check>
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

<step n="4-Parallel" goal="Parallel processing with semaphore pattern">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PARALLEL PROCESSING STARTED (Semaphore Pattern)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Stories:** {{count}}
**Mode:** Task agents (autonomous, continuous)
**Max concurrent agents:** {{parallel_count}}
**Continue on failure:** {{continue_on_failure}}
**Pattern:** Worker pool with {{parallel_count}} slots
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **Semaphore Pattern Benefits:**
- No idle time between batches
- Constant {{parallel_count}} agents running
- As soon as slot frees → next story starts immediately
- Faster completion (no batch synchronization delays)
  </output>

  <action>Initialize worker pool state:</action>
  <action>
    - story_queue = selected_stories (all stories to process)
    - active_workers = {} (map of worker_id → {story_key, task_id, started_at})
    - completed_stories = []
    - failed_stories = []
    - next_story_index = 0
    - max_workers = {{parallel_count}}
  </action>

  <substep n="4p-init" title="Fill initial worker slots">
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Initializing {{max_workers}} worker slots...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Spawn first {{max_workers}} agents (or fewer if less stories):</action>

    <iterate>While next_story_index < min(max_workers, story_queue.length):</iterate>

    <action>
      story_key = story_queue[next_story_index]
      worker_id = next_story_index + 1

      Spawn Task agent:
      - subagent_type: "general-purpose"
      - description: "Implement story {{story_key}}"
      - prompt: "Execute super-dev-pipeline workflow for story {{story_key}}.

                 Story file: docs/sprint-artifacts/{{story_key}}.md
                 Complexity: {{complexity_level}}
                 Mode: batch

                 Load workflow: /Users/jonahschulte/git/BMAD-METHOD/src/modules/bmm/workflows/4-implementation/super-dev-pipeline
                 Follow the multi-agent pipeline (builder, inspector, reviewer, fixer).
                 Commit when complete, update story status, report results."
      - run_in_background: true (non-blocking - critical for semaphore pattern)

      Store in active_workers[worker_id]:
        story_key: {{story_key}}
        task_id: {{returned_task_id}}
        started_at: {{timestamp}}
        status: "running"
    </action>

    <action>Increment next_story_index</action>

    <output>🚀 Worker {{worker_id}} started: {{story_key}}</output>

    <action>After spawning initial workers:</action>
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {{active_workers.size}} workers active
📋 {{story_queue.length - next_story_index}} stories queued
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>
  </substep>

  <substep n="4p-pool" title="Maintain worker pool until all stories complete">
    <critical>SEMAPHORE PATTERN: Keep {{max_workers}} agents running continuously</critical>

    <iterate>While active_workers.size > 0 OR next_story_index < story_queue.length:</iterate>

    <action>Poll for completed workers (check task outputs non-blocking):</action>

    <iterate>For each worker_id in active_workers:</iterate>

    <action>Check if worker task completed using TaskOutput(task_id, block=false)</action>

    <check if="worker task is still running">
      <action>Continue to next worker (don't wait)</action>
    </check>

    <check if="worker task completed successfully">
      <action>Get worker details: story_key = active_workers[worker_id].story_key</action>

      <output>✅ Worker {{worker_id}} completed: {{story_key}}</output>

      <action>Execute Step 4.5: Smart Story Reconciliation</action>
      <action>Load reconciliation instructions: {installed_path}/step-4.5-reconcile-story-status.md</action>
      <action>Execute reconciliation with story_key={{story_key}}</action>

      <critical>🚨 MANDATORY STORY FILE VERIFICATION - MAIN ORCHESTRATOR MUST RUN BASH</critical>

      <bash_required>
STORY_FILE="docs/sprint-artifacts/{{story_key}}.md"
echo "🔍 Verifying story file: {{story_key}}"

CHECKED_COUNT=$(grep -c "^- \[x\]" "$STORY_FILE" 2>/dev/null || echo "0")
TOTAL_COUNT=$(grep -c "^- \[.\]" "$STORY_FILE" 2>/dev/null || echo "0")
echo "  Checked tasks: $CHECKED_COUNT/$TOTAL_COUNT"

RECORD_FILLED=$(grep -A 20 "^### Dev Agent Record" "$STORY_FILE" 2>/dev/null | grep -c "Claude Sonnet" || echo "0")
echo "  Dev Agent Record: $RECORD_FILLED"

echo "$CHECKED_COUNT" > /tmp/checked_{{story_key}}.txt
echo "$RECORD_FILLED" > /tmp/record_{{story_key}}.txt
      </bash_required>

      <check if="checked_count == 0 OR record_filled == 0">
        <output>
❌ Story {{story_key}}: Agent FAILED to update story file

Checked tasks: {{checked_tasks}}/{{total_tasks}}
Dev Agent Record: {{dev_agent_record_status}}

🔧 EXECUTING AUTO-FIX RECONCILIATION...
        </output>

        <action>AUTO-FIX PROCEDURE:</action>
        <action>1. Read agent's commit to see what files were created/modified</action>
        <action>2. Read story Tasks section to see what was supposed to be built</action>
        <action>3. For each task, check if corresponding code exists in commit</action>
        <action>4. If code exists, check off the task using Edit tool</action>
        <action>5. Fill in Dev Agent Record with commit details</action>
        <action>6. Verify fixes worked (re-count checked tasks)</action>

        <check if="auto_fix_succeeded AND checked_tasks > 0">
          <output>✅ AUTO-FIX SUCCESS: {{checked_tasks}}/{{total_tasks}} tasks now checked</output>
          <action>Continue with story completion</action>
        </check>

        <check if="auto_fix_failed OR checked_tasks still == 0">
          <output>
❌ AUTO-FIX FAILED: Cannot reconcile story {{story_key}}

After auto-fix attempts:
- Checked tasks: {{checked_tasks}}/{{total_tasks}}
- Dev Agent Record: {{dev_agent_record_status}}

**Agent produced code but story file cannot be updated.**

Marking story as "in-progress" (not done) and continuing with warnings.
          </output>
          <action>Override story status to "in-progress"</action>
          <action>Add to reconciliation_warnings with detailed diagnostic</action>
          <action>Continue (do NOT kill workers)</action>
        </check>
      </check>

      <check if="reconciliation succeeded AND checked_tasks > 0 AND dev_agent_record_filled">
        <output>✅ COMPLETED: {{story_key}} (reconciled and verified)</output>
        <output>  Tasks: {{checked_tasks}}/{{total_tasks}} ({{task_completion_pct}}%)</output>
        <action>Add to completed_stories</action>
      </check>

      <check if="task_completion_pct < 80">
        <output>⚠️ WARNING: {{story_key}} - Low completion ({{task_completion_pct}}%)</output>
        <action>Add to reconciliation_warnings: {story_key: {{story_key}}, warning_message: "Only {{task_completion_pct}}% tasks checked - manual verification needed"}</action>
      </check>

      <action>Remove worker_id from active_workers (free the slot)</action>

      <action>IMMEDIATELY refill slot if stories remain:</action>
      <check if="next_story_index < story_queue.length">
        <action>story_key = story_queue[next_story_index]</action>

        <output>🔄 Worker {{worker_id}} refilled: {{story_key}}</output>

        <action>Spawn new Task agent for this worker_id (same parameters as init)</action>
        <action>Update active_workers[worker_id] with new task_id and story_key</action>
        <action>Increment next_story_index</action>
      </check>
    </check>

    <check if="worker task failed">
      <action>Get worker details: story_key = active_workers[worker_id].story_key</action>

      <output>❌ Worker {{worker_id}} failed: {{story_key}}</output>

      <action>Add to failed_stories</action>
      <action>Remove worker_id from active_workers (free the slot)</action>

      <check if="continue_on_failure == false">
        <output>⚠️ Stopping all workers due to failure (continue_on_failure=false)</output>
        <action>Kill all active workers</action>
        <action>Clear story_queue</action>
        <action>Break worker pool loop</action>
      </check>

      <check if="continue_on_failure == true AND next_story_index < story_queue.length">
        <action>story_key = story_queue[next_story_index]</action>

        <output>🔄 Worker {{worker_id}} refilled: {{story_key}} (despite previous failure)</output>

        <action>Spawn new Task agent for this worker_id</action>
        <action>Update active_workers[worker_id] with new task_id and story_key</action>
        <action>Increment next_story_index</action>
      </check>
    </check>

    <action>Display live progress every 30 seconds:</action>
    <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Live Progress ({{timestamp}})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Completed: {{completed_stories.length}}
❌ Failed: {{failed_stories.length}}
🔄 Active workers: {{active_workers.size}}
📋 Queued: {{story_queue.length - next_story_index}}

Active stories:
{{#each active_workers}}
  Worker {{@key}}: {{story_key}} (running {{duration}})
{{/each}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    </output>

    <action>Sleep 5 seconds before next poll (prevents tight loop)</action>

  </substep>

  <action>After worker pool drains (all stories processed), jump to Step 5 (Summary)</action>
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

{{#if manual_actions_required.length > 0}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MANUAL ACTIONS REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**{{manual_actions_required.length}} stories require manual intervention:**

{{#each manual_actions_required}}
{{@index}}. **{{story_key}}**
   Action: Regenerate story with proper BMAD format
   Command: `/create-story-with-gap-analysis`
{{/each}}

**After completing these actions:**
1. Validate all stories: `./scripts/validate-all-stories.sh`
2. Re-run batch-super-dev for these stories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
