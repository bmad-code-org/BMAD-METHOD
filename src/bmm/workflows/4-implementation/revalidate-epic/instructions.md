# Revalidate Epic - Batch Story Revalidation with Semaphore Pattern

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="1" goal="Load sprint status and find epic stories">
  <action>Verify epic_number parameter provided</action>

  <check if="epic_number not provided">
    <output>❌ ERROR: epic_number parameter required

Usage:
  /revalidate-epic epic_number=2
  /revalidate-epic epic_number=2 fill_gaps=true
  /revalidate-epic epic_number=2 fill_gaps=true max_concurrent=5
    </output>
    <action>HALT</action>
  </check>

  <action>Read {sprint_status} file</action>
  <action>Parse development_status map</action>

  <action>Filter stories starting with "{{epic_number}}-" (e.g., "2-1-", "2-2-", etc.)</action>
  <action>Exclude epics (keys starting with "epic-") and retrospectives</action>

  <action>Store as: epic_stories (list of story keys)</action>

  <check if="epic_stories is empty">
    <output>❌ No stories found for Epic {{epic_number}}

Check sprint-status.yaml to verify epic number is correct.
    </output>
    <action>HALT</action>
  </check>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 EPIC {{epic_number}} REVALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Stories Found:** {{epic_stories.length}}
**Mode:** {{#if fill_gaps}}Verify & Fill Gaps{{else}}Verify Only{{/if}}
**Max Concurrent:** {{max_concurrent}} agents
**Pattern:** Semaphore (continuous worker pool)

**Stories to Revalidate:**
{{#each epic_stories}}
{{@index + 1}}. {{this}}
{{/each}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <ask>Proceed with revalidation? (yes/no):</ask>

  <check if="response != 'yes'">
    <output>❌ Revalidation cancelled</output>
    <action>Exit workflow</action>
  </check>
</step>

<step n="2" goal="Initialize semaphore pattern for parallel revalidation">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Starting Parallel Revalidation (Semaphore Pattern)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <action>Initialize worker pool state:</action>
  <action>
    - story_queue = epic_stories
    - active_workers = {}
    - completed_stories = []
    - failed_stories = []
    - verification_results = {}
    - next_story_index = 0
    - max_workers = {{max_concurrent}}
  </action>

  <action>Fill initial worker slots:</action>

  <iterate>While next_story_index < min(max_workers, story_queue.length):</iterate>

  <action>
    story_key = story_queue[next_story_index]
    story_file = {sprint_artifacts}/{{story_key}}.md  # Try multiple naming patterns if needed
    worker_id = next_story_index + 1

    Spawn Task agent:
    - subagent_type: "general-purpose"
    - description: "Revalidate story {{story_key}}"
    - prompt: "Execute revalidate-story workflow for {{story_key}}.

               CRITICAL INSTRUCTIONS:
               1. Load workflow: _bmad/bmm/workflows/4-implementation/revalidate-story/workflow.yaml
               2. Parameters: story_file={{story_file}}, fill_gaps={{fill_gaps}}
               3. Clear all checkboxes
               4. Verify each AC/Task/DoD against codebase
               5. Re-check verified items
               6. Report gaps
               {{#if fill_gaps}}7. Fill gaps and commit{{/if}}
               8. Return verification summary"
    - run_in_background: true

    Store in active_workers[worker_id]:
      story_key: {{story_key}}
      task_id: {{returned_task_id}}
      started_at: {{timestamp}}
  </action>

  <action>Increment next_story_index</action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {{active_workers.size}} workers active
📋 {{story_queue.length - next_story_index}} stories queued
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="3" goal="Maintain worker pool until all stories revalidated">
  <critical>SEMAPHORE PATTERN: Keep {{max_workers}} agents running continuously</critical>

  <iterate>While active_workers.size > 0 OR next_story_index < story_queue.length:</iterate>

  <action>Poll for completed workers (non-blocking):</action>

  <iterate>For each worker_id in active_workers:</iterate>

  <action>Check worker status using TaskOutput(task_id, block=false)</action>

  <check if="worker completed successfully">
    <action>Get verification results from worker output</action>
    <action>Parse: verified_pct, gaps_found, gaps_filled</action>

    <action>Store in verification_results[story_key]</action>
    <action>Add to completed_stories</action>
    <action>Remove from active_workers</action>

    <output>✅ Worker {{worker_id}}: {{story_key}} → {{verified_pct}}% verified{{#if gaps_filled > 0}}, {{gaps_filled}} gaps filled{{/if}}</output>

    <check if="next_story_index < story_queue.length">
      <action>Refill slot with next story (same pattern as batch-super-dev)</action>
      <output>🔄 Worker {{worker_id}} refilled: {{next_story_key}}</output>
    </check>
  </check>

  <check if="worker failed">
    <action>Add to failed_stories with error</action>
    <action>Remove from active_workers</action>
    <output>❌ Worker {{worker_id}}: {{story_key}} failed</output>

    <check if="continue_on_failure AND next_story_index < story_queue.length">
      <action>Refill slot despite failure</action>
    </check>
  </check>

  <action>Display live progress every 30 seconds:</action>
  <output>
📊 Live Progress: {{completed_stories.length}} completed, {{active_workers.size}} active, {{story_queue.length - next_story_index}} queued
  </output>

  <action>Sleep 5 seconds before next poll</action>
</step>

<step n="4" goal="Generate epic-level summary">
  <action>Aggregate verification results across all stories:</action>
  <action>
    epic_total_items = sum of all items across stories
    epic_verified = sum of verified items
    epic_partial = sum of partial items
    epic_missing = sum of missing items
    epic_gaps_filled = sum of gaps filled

    epic_verified_pct = (epic_verified / epic_total_items) × 100
  </action>

  <action>Group stories by verification percentage:</action>
  <action>
    - complete_stories (≥95% verified)
    - mostly_complete_stories (80-94% verified)
    - partial_stories (50-79% verified)
    - incomplete_stories (<50% verified)
  </action>

  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EPIC {{epic_number}} REVALIDATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Total Stories:** {{epic_stories.length}}
**Completed:** {{completed_stories.length}}
**Failed:** {{failed_stories.length}}

**Epic-Wide Verification:**
- ✅ Verified: {{epic_verified}}/{{epic_total_items}} ({{epic_verified_pct}}%)
- 🔶 Partial: {{epic_partial}}/{{epic_total_items}}
- ❌ Missing: {{epic_missing}}/{{epic_total_items}}
{{#if fill_gaps}}- 🔧 Gaps Filled: {{epic_gaps_filled}}{{/if}}

**Story Health:**
- ✅ Complete (≥95%): {{complete_stories.length}} stories
- 🔶 Mostly Complete (80-94%): {{mostly_complete_stories.length}} stories
- ⚠️ Partial (50-79%): {{partial_stories.length}} stories
- ❌ Incomplete (<50%): {{incomplete_stories.length}} stories

---

**Complete Stories (≥95% verified):**
{{#each complete_stories}}
- {{story_key}}: {{verified_pct}}% verified
{{/each}}

{{#if mostly_complete_stories.length > 0}}
**Mostly Complete Stories (80-94%):**
{{#each mostly_complete_stories}}
- {{story_key}}: {{verified_pct}}% verified ({{gaps_count}} gaps{{#if gaps_filled > 0}}, {{gaps_filled}} filled{{/if}})
{{/each}}
{{/if}}

{{#if partial_stories.length > 0}}
**⚠️ Partial Stories (50-79%):**
{{#each partial_stories}}
- {{story_key}}: {{verified_pct}}% verified ({{gaps_count}} gaps{{#if gaps_filled > 0}}, {{gaps_filled}} filled{{/if}})
{{/each}}

Recommendation: Continue development on these stories
{{/if}}

{{#if incomplete_stories.length > 0}}
**❌ Incomplete Stories (<50%):**
{{#each incomplete_stories}}
- {{story_key}}: {{verified_pct}}% verified ({{gaps_count}} gaps{{#if gaps_filled > 0}}, {{gaps_filled}} filled{{/if}})
{{/each}}

Recommendation: Re-implement these stories from scratch
{{/if}}

{{#if failed_stories.length > 0}}
**❌ Failed Revalidations:**
{{#each failed_stories}}
- {{story_key}}: {{error}}
{{/each}}
{{/if}}

---

**Epic Health Score:** {{epic_verified_pct}}/100

{{#if epic_verified_pct >= 95}}
✅ Epic is COMPLETE and verified
{{else if epic_verified_pct >= 80}}
🔶 Epic is MOSTLY COMPLETE ({{epic_missing}} items need attention)
{{else if epic_verified_pct >= 50}}
⚠️ Epic is PARTIALLY COMPLETE (significant gaps remain)
{{else}}
❌ Epic is INCOMPLETE (major rework needed)
{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <check if="create_epic_report == true">
    <action>Write epic summary to: {sprint_artifacts}/revalidation-epic-{{epic_number}}-{{timestamp}}.md</action>
    <output>📄 Epic report: {{report_path}}</output>
  </check>

  <check if="update_sprint_status == true">
    <action>Update sprint-status.yaml with revalidation timestamp and results</action>
    <action>Add comment to epic entry: # Revalidated: {{epic_verified_pct}}% verified ({{timestamp}})</action>
  </check>
</step>

</workflow>
