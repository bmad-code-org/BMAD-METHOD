# Sprint Planning - Sprint Status Generator

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/4-implementation/sprint-planning/workflow.yaml</critical>

<workflow>

<step n="1" goal="Parse epic files and extract all work items">
<action>Communicate in {communication_language} with {user_name}</action>
<action>Look for all files matching `{epics_pattern}` in {epics_location}</action>
<action>Could be a single `epics.md` file or multiple `epic-1.md`, `epic-2.md` files</action>

<action>For each epic file found, extract:</action>

- Epic numbers from headers like `## Epic 1:` or `## Epic 2:`
- Story IDs and titles from patterns like `### Story 1.1: User Authentication`
- Convert story format from `Epic.Story: Title` to kebab-case key: `epic-story-title`

**Story ID Conversion Rules:**

- Original: `### Story 1.1: User Authentication`
- Replace period with dash: `1-1`
- Convert title to kebab-case: `user-authentication`
- Final key: `1-1-user-authentication`

<action>Build complete inventory of all epics and stories from all epic files</action>
</step>

<step n="2" goal="Build sprint status structure">
<action>For each epic found, create entries in this order:</action>

1. **Epic entry** - Key: `epic-{num}`, Default status: `backlog`
2. **Story entries** - Key: `{epic}-{story}-{title}`, Default status: `backlog`
3. **Retrospective entry** - Key: `epic-{num}-retrospective`, Default status: `optional`

**Example structure:**

```yaml
development_status:
  epic-1: backlog
  1-1-user-authentication: backlog
  1-2-account-management: backlog
  epic-1-retrospective: optional
```

</step>

<step n="3" goal="Apply intelligent status detection">
<action>For each epic, check if tech context file exists:</action>

- Check: `{output_folder}/epic-{num}-context.md`
- If exists → set epic status to `contexted`
- Else → keep as `backlog`

<action>For each story, detect current status by checking files:</action>

**Story file detection:**

- Check: `{story_location_absolute}/{story-key}.md` (e.g., `stories/1-1-user-authentication.md`)
- If exists → upgrade status to at least `drafted`

**Story context detection:**

- Check: `{story_location_absolute}/{story-key}-context.md` (e.g., `stories/1-1-user-authentication-context.md`)
- If exists → upgrade status to at least `ready-for-dev`

**Preservation rule:**

- If existing `{status_file}` exists and has more advanced status, preserve it
- Never downgrade status (e.g., don't change `done` to `drafted`)

**Status Flow Reference:**

- Epic: `backlog` → `contexted`
- Story: `backlog` → `drafted` → `ready-for-dev` → `in-progress` → `review` → `done`
- Retrospective: `optional` ↔ `completed`
  </step>

<step n="4" goal="Generate sprint status file">
<action>Create or update {status_file} with:</action>

**File Structure:**

```yaml
# generated: {date}
# project: {project_name}
# project_key: {project_key}
# tracking_system: {tracking_system}
# story_location: {story_location}

# STATUS DEFINITIONS:
# ==================
# Epic Status:
#   - backlog: Epic exists in epic file but not contexted
#   - contexted: Epic tech context created (required before drafting stories)
#
# Story Status:
#   - backlog: Story only exists in epic file
#   - drafted: Story file created in stories folder
#   - ready-for-dev: Draft approved and story context created
#   - in-progress: Developer actively working on implementation
#   - review: Under SM review (via code-review workflow)
#   - done: Story completed
#
# Retrospective Status:
#   - optional: Can be completed but not required
#   - completed: Retrospective has been done
#
# WORKFLOW NOTES:
# ===============
# - Epics should be 'contexted' before stories can be 'drafted'
# - Stories can be worked in parallel if team capacity allows
# - SM typically drafts next story after previous one is 'done' to incorporate learnings
# - Dev moves story to 'review', SM reviews, then Dev moves to 'done'

generated: { date }
project: { project_name }
project_key: { project_key }
tracking_system: { tracking_system }
story_location: { story_location }

development_status:
  # All epics, stories, and retrospectives in order
```

<action>Write the complete sprint status YAML to {status_file}</action>
<action>CRITICAL: For story_location field, write the variable value EXACTLY as defined in workflow.yaml: "{project-root}/docs/stories"</action>
<action>CRITICAL: Do NOT resolve {project-root} to an absolute path - keep it as the literal string "{project-root}/docs/stories"</action>
<action>CRITICAL: Metadata appears TWICE - once as comments (#) for documentation, once as YAML key:value fields for parsing</action>
<action>Ensure all items are ordered: epic, its stories, its retrospective, next epic...</action>
</step>

<step n="5" goal="Validate and report">
<action>Perform validation checks:</action>

- [ ] Every epic in epic files appears in sprint-status.yaml
- [ ] Every story in epic files appears in sprint-status.yaml
- [ ] Every epic has a corresponding retrospective entry
- [ ] No items in sprint-status.yaml that don't exist in epic files
- [ ] All status values are legal (match state machine definitions)
- [ ] File is valid YAML syntax

<action>Count totals:</action>

- Total epics: {{epic_count}}
- Total stories: {{story_count}}
- Epics contexted: {{contexted_count}}
- Stories in progress: {{in_progress_count}}
- Stories done: {{done_count}}

<action>Display completion summary to {user_name} in {communication_language}:</action>

**Sprint Status Generated Successfully**

- **File Location:** {status_file}
- **Total Epics:** {{epic_count}}
- **Total Stories:** {{story_count}}
- **Contexted Epics:** {{contexted_count}}
- **Stories In Progress:** {{in_progress_count}}
- **Stories Completed:** {{done_count}}

**Next Steps:**

1. Review the generated sprint-status.yaml
2. Use this file to track development progress
3. Agents will update statuses as they work
4. Re-run this workflow to refresh auto-detected statuses

</step>

</workflow>

## Additional Documentation

### Status State Machine

**Epic Status Flow:**

```
backlog → contexted
```

- **backlog**: Epic exists in epic file but tech context not created
- **contexted**: Epic tech context has been generated (prerequisite for story drafting)

**Story Status Flow:**

```
backlog → drafted → ready-for-dev → in-progress → review → done
```

- **backlog**: Story only exists in epic file
- **drafted**: Story file created (e.g., `stories/1-3-plant-naming.md`)
- **ready-for-dev**: Draft approved + story context created
- **in-progress**: Developer actively working
- **review**: Under SM review (via code-review workflow)
- **done**: Completed

**Retrospective Status:**

```
optional ↔ completed
```

- **optional**: Can be done but not required
- **completed**: Retrospective has been completed

### Guidelines

1. **Epic Context Recommended**: Epics should be `contexted` before stories can be `drafted`
2. **Sequential Default**: Stories are typically worked in order, but parallel work is supported
3. **Parallel Work Supported**: Multiple stories can be `in-progress` if team capacity allows
4. **Review Before Done**: Stories should pass through `review` before `done`
5. **Learning Transfer**: SM typically drafts next story after previous one is `done` to incorporate learnings

### Error Handling

- If epic file can't be parsed, report specific file and continue with others
- If existing status file is malformed, backup and regenerate
- Log warnings for duplicate story IDs across epics
- Validate status transitions are legal (can't go from `backlog` to `done`)
