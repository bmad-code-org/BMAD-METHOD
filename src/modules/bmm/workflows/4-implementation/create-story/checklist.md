---
title: 'Create Story Checklist'
validation-target: 'Newly generated story markdown file'
required-inputs:
  - 'epics.md (preferred) or PRD'
optional-inputs:
  - 'architecture document for architecture context'
validation-rules:
  - 'Story structure matches sections: Status, Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Change Log, Dev Agent Record'
  - 'Dev Notes include Project Structure Notes and References subsections'
  - 'All non-trivial technical notes include a source citation'
  - 'Tasks include explicit testing subtasks based on testing strategy'
---

# Create Story Checklist

## Document Structure

- [ ] Title includes story id and title
- [ ] Status set to Draft
- [ ] Story section present with As a / I want / so that
- [ ] Acceptance Criteria is a numbered list
- [ ] Tasks/Subtasks present with checkboxes
- [ ] Dev Notes includes architecture/testing context
- [ ] Change Log table initialized
- [ ] Dev Agent Record sections present (Context Reference, Agent Model Used, Debug Log References, Completion Notes, File List)

## Content Quality

- [ ] Acceptance Criteria sourced from epics/PRD (or explicitly confirmed by user)
- [ ] Tasks reference AC numbers where applicable
- [ ] Dev Notes do not invent details; cite sources where possible
- [ ] File saved to stories directory from config (dev_story_location)
- [ ] If creating a new story number, epics.md explicitly enumerates this story under the target epic; otherwise generation HALTED with instruction to run PM/SM `*correct-course` (open `{project-root}/bmad/bmm/agents/pm.md` or `{project-root}/bmad/bmm/agents/sm.md` and execute `*correct-course`)

## Optional Post-Generation

- [ ] Story Context generation run (if auto_run_context)
- [ ] Context Reference recorded in story
