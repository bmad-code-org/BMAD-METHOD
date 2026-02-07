---
name: 'step-02-load-context'
description: 'Load project and story context needed for implementation decisions'
nextStepFile: './step-03-detect-review-continuation.md'
---

  <step n="2" goal="Load project context and story information">
    <critical>Load all available context to inform implementation</critical>

    <action>Load {project_context} for coding standards and project-wide patterns (if exists)</action>
    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status</action>
    <action>Load comprehensive context from story file's Dev Notes section</action>
    <action>Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications</action>
    <action>Use enhanced story context to inform implementation decisions and approaches</action>
    <output>✅ **Context Loaded**
      Story and project context available for implementation
    </output>
  </step>

## Next
- Read fully and follow: `./step-03-detect-review-continuation.md`.
