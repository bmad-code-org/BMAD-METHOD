---
name: 'step-02-load-context'
description: 'Load project and story context needed for implementation decisions'
nextStepFile: './step-03-detect-review-continuation.md'
---

  <step n="2" goal="Load project context and story information">
    <critical>Load all available context to inform implementation</critical>

    <action>Load {project_context} for coding standards and project-wide patterns (if exists)</action>
    <action>Validate story source before parsing:
      - Verify story file exists and is readable
      - If missing/unreadable: emit explicit error and HALT
    </action>
    <action>Parse and validate required sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Status
      - If section missing, empty, or malformed: emit explicit error with section name and HALT
      - Dev Notes is CRITICAL and MUST be present with non-empty actionable content
    </action>
    <action>Parse and validate optional section: Change Log
      - If missing/empty: create warning and continue with safe default ("No prior change log entries")
    </action>
    <action>Validate structure before extraction:
      - Story: identifiable title + narrative structure
      - Acceptance Criteria: parseable list/numbered clauses
      - Tasks/Subtasks: checkbox task format with stable task boundaries
      - Dev Agent Record/File List/Status: parseable heading + body content
      - If malformed structure prevents reliable parsing: emit explicit error and HALT
    </action>
    <action>Load comprehensive context from story file's Dev Notes section ONLY after validation passes</action>
    <action>Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications</action>
    <action>Use enhanced story context to inform implementation decisions and approaches</action>
    <output>✅ **Context Loaded**
      Story and project context available for implementation
    </output>
  </step>

## Next
- Read fully and follow: `./step-03-detect-review-continuation.md`.
