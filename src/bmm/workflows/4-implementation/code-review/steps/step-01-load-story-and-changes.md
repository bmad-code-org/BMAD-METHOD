---
name: 'step-01-load-story-and-changes'
description: 'Load target story, gather git deltas, and establish review scope'
nextStepFile: './step-02-build-attack-plan.md'
---

  <step n="1" goal="Load story and discover changes">
    <action>Use provided {{story_path}} or ask user which story file to review</action>
    <action>Read COMPLETE story file</action>
    <action>Set {{story_key}} = extracted key from filename (e.g., "1-2-user-authentication.md" → "1-2-user-authentication") or story
      metadata</action>
    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Agent Record → File List, Change Log</action>

    <!-- Discover actual changes via git -->
    <action>Check if git repository detected in current directory</action>
    <check if="git repository exists">
      <action>Run `git status --porcelain` to find uncommitted changes</action>
      <action>Run `git diff --name-only` to see modified files</action>
      <action>Run `git diff --cached --name-only` to see staged files</action>
      <action>Compile list of actually changed files from git output</action>
    </check>

    <!-- Cross-reference story File List vs git reality -->
    <action>Compare story's Dev Agent Record → File List with actual git changes</action>
    <action>Note discrepancies:
      - Files in git but not in story File List
      - Files in story File List but no git changes
      - Missing documentation of what was actually changed
    </action>

    <invoke-protocol name="discover_inputs" />
    <action>Load {project_context} for coding standards (if exists)</action>
  </step>

## Next
- Read fully and follow: `./step-02-build-attack-plan.md`.
