# Release Planning Instructions

## Objective
Create a new release candidate by selecting stories, determining version number, and preparing for quality gate validation.

## Prerequisites
- Stories marked as "done" available for release
- Previous release version known (for version increment)
- Quality gate configuration in bmm-metrics

---

<step n="1" goal="Determine release type">

### Determine Release Type

<ask>What type of release is this?
[M] Major - Breaking changes, significant new features
[m] Minor - New features, backward compatible
[p] Patch - Bug fixes only
[h] Hotfix - Critical production fix

Release type: </ask>

<action>Store as {{release_type}}</action>

<ask>Do you want to specify a version number, or auto-generate?
[a] Auto-generate based on release type
[s] Specify version manually

Choice: </ask>

<check if="choice == 's'">
<ask>Enter version number (e.g., 2.1.0): </ask>
<action>Store as {{version}}</action>
</check>

<check if="choice == 'a'">
<action>Load current version from state</action>
<action>Increment based on release_type</action>
<action>Store as {{version}}</action>
</check>

**Release Version:** {{version}}

</step>

---

<step n="2" goal="Select stories for release">

### Select Stories

<action>Load pending stories from state (stories marked done since last release)</action>

**Pending Stories:**

| Story ID | Title | Type | Points |
|----------|-------|------|--------|
{{#each pending_stories}}
| {{id}} | {{title}} | {{type}} | {{points}} |
{{/each}}

**Total:** {{pending_stories.length}} stories, {{total_points}} points

<ask>Which stories should be included in this release?
[a] All pending stories
[s] Select specific stories (comma-separated IDs)
[e] Exclude specific stories

Choice: </ask>

<check if="choice == 'a'">
<action>Include all pending stories</action>
</check>

<check if="choice == 's'">
<ask>Enter story IDs to include (comma-separated): </ask>
<action>Parse and validate story IDs</action>
<action>Include only specified stories</action>
</check>

<check if="choice == 'e'">
<ask>Enter story IDs to exclude (comma-separated): </ask>
<action>Parse and validate story IDs</action>
<action>Include all except excluded stories</action>
</check>

**Stories Selected:** {{selected_stories.length}}

</step>

---

<step n="3" goal="Categorize changes">

### Categorize Changes

<action>Categorize selected stories by type</action>

**Release Contents:**

**Features ({{features.length}}):**
{{#each features}}
- {{id}}: {{title}}
{{/each}}

**Bug Fixes ({{bug_fixes.length}}):**
{{#each bug_fixes}}
- {{id}}: {{title}}
{{/each}}

**Improvements ({{improvements.length}}):**
{{#each improvements}}
- {{id}}: {{title}}
{{/each}}

<ask>Are there any breaking changes in this release?
[y] Yes - describe them
[n] No breaking changes

Response: </ask>

<check if="response == 'y'">
<ask>Describe the breaking changes: </ask>
<action>Store as {{breaking_changes}}</action>
</check>

</step>

---

<step n="4" goal="Set release metadata">

### Release Metadata

<ask>Who is the release owner/coordinator?
(Default: {{user_name}}): </ask>

<action>Store as {{release_owner}} or default to user_name</action>

<ask>Target release date (YYYY-MM-DD or "asap"): </ask>

<action>Store as {{target_date}}</action>

<ask>Any release notes or highlights to include?
(Press Enter to skip): </ask>

<action>Store as {{release_highlights}}</action>

</step>

---

<step n="5" goal="Create release candidate">

### Create Release Candidate

<action>Generate release candidate ID</action>
<action>Calculate expiry time based on config</action>

**Release Candidate Summary:**

| Field | Value |
|-------|-------|
| Release ID | {{release_id}} |
| Version | {{version}} |
| Type | {{release_type}} |
| Stories | {{selected_stories.length}} |
| Points | {{total_points}} |
| Owner | {{release_owner}} |
| Target Date | {{target_date}} |
| Expires | {{expiry_time}} |

<ask>Create this release candidate?
[y] Yes - create and trigger quality gates
[n] No - cancel

Confirm: </ask>

<check if="confirm != 'y'">
<action>Cancel workflow</action>
</check>

</step>

---

<step n="6" goal="Save and publish">

### Save Release Candidate

<action>Create release candidate record</action>
<action>Save to state file</action>
<action>Generate release candidate YAML file</action>

<template-output section="release-candidate">
Generate release candidate file with:
- Release ID and version
- Selected stories with full details
- Categorized changes
- Breaking changes (if any)
- Release metadata
- Quality gate requirements
</template-output>

</step>

---

<step n="7" goal="Publish release candidate event" critical="true">

### Publish Release Candidate Event

<publish event="release.candidate.created">
  <payload>
    <release_id>{{release_id}}</release_id>
    <version>{{version}}</version>
    <release_type>{{release_type}}</release_type>
    <stories>{{selected_story_ids}}</stories>
    <story_count>{{selected_stories.length}}</story_count>
    <total_points>{{total_points}}</total_points>
    <created_by>{{release_owner}}</created_by>
    <target_date>{{target_date}}</target_date>
    <expires_at>{{expiry_time}}</expires_at>
    <breaking_changes>{{breaking_changes}}</breaking_changes>
    <timestamp>{{current_timestamp}}</timestamp>
  </payload>
</publish>

<action>Log: "Release candidate {{version}} created with {{selected_stories.length}} stories"</action>

</step>

---

## Completion

Release candidate **{{version}}** created successfully.

**Release ID:** {{release_id}}
**Stories:** {{selected_stories.length}}
**Status:** Pending Quality Gate Validation

**Next Steps:**
1. Quality gates will be automatically validated (bmm-metrics will receive the event)
2. Monitor for `metrics.quality.pass` or `metrics.quality.fail` event
3. Once validated, run `*release-notes` to generate release notes
4. After approval, run `*deploy` to deploy the release

**File Saved:** {{output_file_path}}
