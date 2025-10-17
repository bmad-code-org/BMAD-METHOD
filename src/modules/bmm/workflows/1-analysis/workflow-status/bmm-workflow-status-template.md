# Project Workflow Status

**Project:** {{project_name}}
**Created:** {{start_date}}
**Last Updated:** {{last_updated}}
**Status File:** `bmm-workflow-status.md`

---

## Workflow Status Tracker

**Current Phase:** {{current_phase}}
**Current Workflow:** {{current_workflow}}
**Current Agent:** {{current_agent}}
**Overall Progress:** {{progress_percentage}}%

### Phase Completion Status

- [ ] **1-Analysis** - Research, brainstorm, brief (optional)
- [ ] **2-Plan** - PRD/GDD/Tech-Spec + Stories/Epics
- [ ] **3-Solutioning** - Architecture + Tech Specs (Level 2+ only)
- [ ] **4-Implementation** - Story development and delivery

### Planned Workflow Journey

**This section documents your complete workflow plan from start to finish.**

| Phase | Step | Agent | Description | Status |
| ----- | ---- | ----- | ----------- | ------ |

{{#planned_workflow}}
| {{phase}} | {{step}} | {{agent}} | {{description}} | {{status}} |
{{/planned_workflow}}

**Current Step:** {{current_step}}
**Next Step:** {{next_step}}

**Instructions:**

- This plan was created during initial workflow-status setup
- Status values: Planned, Optional, Conditional, In Progress, Complete
- Current/Next steps update as you progress through the workflow
- Use this as your roadmap to know what comes after each phase

### Implementation Progress (Phase 4 Only)

**Story Tracking:** {{story_tracking_mode}}

{{#if in_phase_4}}

#### BACKLOG (Not Yet Drafted)

**Ordered story sequence - populated at Phase 4 start:**

| Epic | Story | ID  | Title | File |
| ---- | ----- | --- | ----- | ---- |

{{#backlog_stories}}
| {{epic_num}} | {{story_num}} | {{story_id}} | {{story_title}} | {{story_file}} |
{{/backlog_stories}}

**Total in backlog:** {{backlog_count}} stories

**Instructions:**

- Stories move from BACKLOG → TODO when previous story is complete
- SM agent uses story information from this table to draft new stories
- Story order is sequential (Epic 1 stories first, then Epic 2, etc.)

#### TODO (Needs Drafting)

- **Story ID:** {{todo_story_id}}
- **Story Title:** {{todo_story_title}}
- **Story File:** `{{todo_story_file}}`
- **Status:** Not created OR Draft (needs review)
- **Action:** SM should run `create-story` workflow to draft this story

**Instructions:**

- Only ONE story in TODO at a time
- Story stays in TODO until user marks it "ready for development"
- SM reads this section to know which story to draft next
- After SM creates/updates story, user reviews and approves via `story-ready` workflow

#### IN PROGRESS (Approved for Development)

- **Story ID:** {{current_story_id}}
- **Story Title:** {{current_story_title}}
- **Story File:** `{{current_story_file}}`
- **Story Status:** Ready | In Review
- **Context File:** `{{current_story_context_file}}`
- **Action:** DEV should run `dev-story` workflow to implement this story

**Instructions:**

- Only ONE story in IN PROGRESS at a time
- Story stays here until user marks it "approved" (DoD complete)
- DEV reads this section to know which story to implement
- After DEV completes story, user reviews and runs `story-approved` workflow

#### DONE (Completed Stories)

| Story ID | File | Completed Date | Points |
| -------- | ---- | -------------- | ------ |

{{#done_stories}}
| {{story_id}} | {{story_file}} | {{completed_date}} | {{story_points}} |
{{/done_stories}}

**Total completed:** {{done_count}} stories
**Total points completed:** {{done_points}} points

**Instructions:**

- Stories move here when user runs `story-approved` workflow (DEV agent)
- Immutable record of completed work
- Used for velocity tracking and progress reporting

#### Epic/Story Summary

**Total Epics:** {{total_epics}}
**Total Stories:** {{total_stories}}
**Stories in Backlog:** {{backlog_count}}
**Stories in TODO:** {{todo_count}} (should always be 0 or 1)
**Stories in IN PROGRESS:** {{in_progress_count}} (should always be 0 or 1)
**Stories DONE:** {{done_count}}

**Epic Breakdown:**
{{#epics}}

- Epic {{epic_number}}: {{epic_title}} ({{epic_done_stories}}/{{epic_total_stories}} stories complete)
  {{/epics}}

#### State Transition Logic

**Story Lifecycle:**

```
BACKLOG → TODO → IN PROGRESS → DONE
```

**Transition Rules:**

1. **BACKLOG → TODO**: Automatically when previous story moves TODO → IN PROGRESS
2. **TODO → IN PROGRESS**: User runs SM agent `story-ready` workflow after reviewing drafted story
3. **IN PROGRESS → DONE**: User runs DEV agent `story-approved` workflow after DoD complete

**Important:**

- SM agent NEVER searches for "next story" - always reads TODO section
- DEV agent NEVER searches for "current story" - always reads IN PROGRESS section
- Both agents update this status file after their workflows complete

{{/if}}

### Artifacts Generated

| Artifact | Status | Location | Date |
| -------- | ------ | -------- | ---- |

{{#artifacts}}
| {{name}} | {{status}} | {{path}} | {{date}} |
{{/artifacts}}

### Next Action Required

**What to do next:** {{next_action}}

**Command to run:** {{next_command}}

**Agent to load:** {{next_agent}}

---

## Assessment Results

### Project Classification

- **Project Type:** {{project_type}} ({{project_type_display_name}})
- **Project Level:** {{project_level}}
- **Instruction Set:** {{instruction_set}}
- **Greenfield/Brownfield:** {{field_type}}

### Scope Summary

- **Brief Description:** {{scope_description}}
- **Estimated Stories:** {{story_count}}
- **Estimated Epics:** {{epic_count}}
- **Timeline:** {{timeline}}

### Context

- **Existing Documentation:** {{existing_docs}}
- **Team Size:** {{team_size}}
- **Deployment Intent:** {{deployment_intent}}

## Recommended Workflow Path

### Primary Outputs

{{expected_outputs}}

### Workflow Sequence

{{workflow_steps}}

### Next Actions

{{next_steps}}

## Special Considerations

{{special_notes}}

## Technical Preferences Captured

{{technical_preferences}}

## Story Naming Convention

### Level 0 (Single Atomic Change)

- **Format:** `story-<short-title>.md`
- **Example:** `story-icon-migration.md`, `story-login-fix.md`
- **Location:** `{{dev_story_location}}/`
- **Max Stories:** 1 (if more needed, consider Level 1)

### Level 1 (Coherent Feature)

- **Format:** `story-<title>-<n>.md`
- **Example:** `story-oauth-integration-1.md`, `story-oauth-integration-2.md`
- **Location:** `{{dev_story_location}}/`
- **Max Stories:** 2-3 (prefer longer stories over more stories)

### Level 2+ (Multiple Epics)

- **Format:** `story-<epic>.<story>.md`
- **Example:** `story-1.1.md`, `story-1.2.md`, `story-2.1.md`
- **Location:** `{{dev_story_location}}/`
- **Max Stories:** Per epic breakdown in epics.md

## Decision Log

### Planning Decisions Made

{{#decisions}}

- **{{decision_date}}**: {{decision_description}}
  {{/decisions}}

---

## Change History

{{#changes}}

### {{change_date}} - {{change_author}}

- Phase: {{change_phase}}
- Changes: {{change_description}}
  {{/changes}}

---

## Agent Usage Guide

### For SM (Scrum Master) Agent

**When to use this file:**

- Running `create-story` workflow → Read "TODO (Needs Drafting)" section for exact story to draft
- Running `story-ready` workflow → Update status file, move story from TODO → IN PROGRESS, move next story from BACKLOG → TODO
- Checking epic/story progress → Read "Epic/Story Summary" section

**Key fields to read:**

- `todo_story_id` → The story ID to draft (e.g., "1.1", "auth-feature-1")
- `todo_story_title` → The story title for drafting
- `todo_story_file` → The exact file path to create

**Key fields to update:**

- Move completed TODO story → IN PROGRESS section
- Move next BACKLOG story → TODO section
- Update story counts

**Workflows:**

1. `create-story` - Drafts the story in TODO section (user reviews it)
2. `story-ready` - After user approval, moves story TODO → IN PROGRESS

### For DEV (Developer) Agent

**When to use this file:**

- Running `dev-story` workflow → Read "IN PROGRESS (Approved for Development)" section for current story
- Running `story-approved` workflow → Update status file, move story from IN PROGRESS → DONE, move TODO story → IN PROGRESS, move BACKLOG story → TODO
- Checking what to work on → Read "IN PROGRESS" section

**Key fields to read:**

- `current_story_file` → The story to implement
- `current_story_context_file` → The context XML for this story
- `current_story_status` → Current status (Ready | In Review)

**Key fields to update:**

- Move completed IN PROGRESS story → DONE section with completion date
- Move TODO story → IN PROGRESS section
- Move next BACKLOG story → TODO section
- Update story counts and points

**Workflows:**

1. `dev-story` - Implements the story in IN PROGRESS section
2. `story-approved` - After user approval (DoD complete), moves story IN PROGRESS → DONE

### For PM (Product Manager) Agent

**When to use this file:**

- Checking overall progress → Read "Phase Completion Status"
- Planning next phase → Read "Overall Progress" percentage
- Course correction → Read "Decision Log" for context

**Key fields:**

- `progress_percentage` → Overall project progress
- `current_phase` → What phase are we in
- `artifacts` table → What's been generated

---

_This file serves as the **single source of truth** for project workflow status, epic/story tracking, and next actions. All BMM agents and workflows reference this document for coordination._

_Template Location: `bmad/bmm/workflows/_shared/bmm-workflow-status-template.md`_

_File Created: {{start_date}}_
