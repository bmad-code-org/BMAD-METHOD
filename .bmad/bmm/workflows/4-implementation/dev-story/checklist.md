---
title: 'Dev Story Completion Checklist'
validation-target: 'Story markdown ({{story_path}})'
required-inputs:
  - 'Story markdown file with Tasks/Subtasks, Acceptance Criteria'
optional-inputs:
  - 'Test results output (if saved)'
  - 'CI logs (if applicable)'
validation-rules:
  - 'Only permitted sections in story were modified: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List, Change Log, and Status'
---

# Dev Story Completion Checklist

## Tasks Completion

- [ ] All tasks and subtasks for this story are marked complete with [x]
- [ ] Implementation aligns with every Acceptance Criterion in the story

## Tests and Quality

- [ ] Unit tests added/updated for core functionality changed by this story
- [ ] Integration tests added/updated when component interactions are affected
- [ ] End-to-end tests created for critical user flows, if applicable
- [ ] All tests pass locally (no regressions introduced)
- [ ] Linting and static checks (if configured) pass

## Story File Updates

- [ ] File List section includes every new/modified/deleted file (paths relative to repo root)
- [ ] Dev Agent Record contains relevant Debug Log and/or Completion Notes for this work
- [ ] Change Log includes a brief summary of what changed
- [ ] Only permitted sections of the story file were modified

## Final Status

- [ ] Regression suite executed successfully
- [ ] Story Status is set to "Ready for Review"
