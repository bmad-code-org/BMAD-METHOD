# Sprint Planning Workflow

## Overview

The sprint-planning workflow generates and manages the sprint status tracking file that serves as the single source of truth for Phase 4 implementation. It extracts all epics and stories from epic files and tracks their progress through the development lifecycle.

In Agile terminology, this workflow facilitates **Sprint Planning** or **Sprint 0 Kickoff** - the transition from planning/architecture into actual development execution.

## Purpose

This workflow creates a `sprint-status.yaml` file that:

- Lists all epics, stories, and retrospectives in order
- Tracks the current status of each item
- Provides a clear view of what needs to be worked on next
- Ensures only one story is in progress at a time
- Maintains the development flow from backlog to done

## When to Use

Run this workflow:

1. **Initially** - After Phase 3 (solutioning) is complete and epics are finalized
2. **After epic context creation** - To update epic status to 'contexted'
3. **Periodically** - To auto-detect newly created story files
4. **For status checks** - To see overall project progress

## Status State Machine

### Epic Flow

```
backlog → contexted
```

### Story Flow

```
backlog → drafted → ready-for-dev → in-progress → review → done
```

### Retrospective Flow

```
optional ↔ completed
```

## Key Guidelines

1. **Epic Context Recommended**: Epics should be `contexted` before their stories can be `drafted`
2. **Flexible Parallelism**: Multiple stories can be `in-progress` based on team capacity
3. **Sequential Default**: Stories within an epic are typically worked in order, but parallel work is supported
4. **Review Flow**: Stories should go through `review` before `done`
5. **Learning Transfer**: SM typically drafts next story after previous is `done`, incorporating learnings

## File Locations

### Input Files

- **Epic Files**: `{output_folder}/epic*.md` or `{output_folder}/epics.md`
- **Epic Context**: `{output_folder}/epic-{n}-context.md`
- **Story Files**: `{story_dir}/{epic}-{story}-{title}.md`
  - Example: `stories/1-1-user-authentication.md`
- **Story Context**: `{story_dir}/{epic}-{story}-{title}-context.md`
  - Example: `stories/1-1-user-authentication-context.md`

### Output File

- **Status File**: `{output_folder}/sprint-status.yaml`

## Usage by Agents

### SM (Scrum Master) Agent

```yaml
Tasks:
  - Check sprint-status.yaml for stories in 'done' status
  - Identify next 'backlog' story to draft
  - Run create-story workflow
  - Update status to 'drafted'
  - Create story context
  - Update status to 'ready-for-dev'
```

### Developer Agent

```yaml
Tasks:
  - Find stories with 'ready-for-dev' status
  - Update to 'in-progress' when starting
  - Implement the story
  - Update to 'review' when complete
  - Address review feedback
  - Update to 'done' after review
```

### Test Architect

```yaml
Tasks:
  - Monitor stories entering 'review'
  - Track epic progress
  - Identify when retrospectives are needed
```

## Example Output

```yaml
# Sprint Status
# Generated: 2025-01-20
# Project: MyPlantFamily

development_status:
  epic-1: contexted
  1-1-project-foundation: done
  1-2-app-shell: done
  1-3-user-authentication: in-progress
  1-4-plant-data-model: ready-for-dev
  1-5-add-plant-manual: drafted
  1-6-photo-identification: backlog
  epic-1-retrospective: optional

  epic-2: contexted
  2-1-personality-system: in-progress
  2-2-chat-interface: drafted
  2-3-llm-integration: backlog
  2-4-reminder-system: backlog
  epic-2-retrospective: optional
```

## Integration with BMM Workflow

This workflow is part of Phase 4 (Implementation) and integrates with:

1. **epic-tech-context** - Creates technical context for epics
2. **create-story** - Drafts individual story files
3. **story-context** - Adds implementation context to stories
4. **dev-story** - Developer implements the story
5. **review-story** - SM reviews implementation
6. **retrospective** - Optional epic retrospective

## Benefits

- **Clear Visibility**: Everyone knows what's being worked on
- **Flexible Capacity**: Supports both sequential and parallel work patterns
- **Learning Transfer**: SM can incorporate learnings when drafting next story
- **Progress Tracking**: Easy to see overall project status
- **Automation Friendly**: Simple YAML format for agent updates

## Tips

1. **Initial Generation**: Run immediately after epics are finalized
2. **Regular Updates**: Agents should update status as they work
3. **Manual Override**: You can manually edit the file if needed
4. **Backup First**: The workflow backs up existing status before regenerating
5. **Validation**: The workflow validates legal status transitions
