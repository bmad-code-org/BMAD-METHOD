---
name: 'step-01-find-story'
description: 'Find the next ready story (or accept explicit input), load it completely, and identify the next actionable task'
nextStepFile: './step-02-load-context.md'
---

  <step n="1" goal="Find next ready story and load it" tag="sprint-status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE story file</action>
      <action>Extract story_key from filename or metadata</action>
      <goto anchor="task_check" />
    </check>

    <!-- Sprint-based story discovery -->
    <check if="{{sprint_status}} file exists">
      <critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
      <action>Load the FULL file: {{sprint_status}}</action>
      <action>Read ALL lines from beginning to end - do not skip any content</action>
      <action>Parse the development_status section completely to understand story order</action>

      <action>Find the FIRST story (by reading in order from top to bottom) where:
        - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
        - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
        - Status value equals "ready-for-dev"
      </action>

      <check if="no ready-for-dev or in-progress story found">
        <output>📋 No ready-for-dev stories found in sprint-status.yaml

          **Current Sprint Status:** {{sprint_status_summary}}

          **What would you like to do?**
          1. Run `create-story` to create next story from epics with comprehensive context
          2. Run `*validate-create-story` to improve existing stories before development (recommended quality check)
          3. Specify a particular story file to develop (provide full path)
          4. Check {{sprint_status}} file to see current sprint status

          💡 **Tip:** Stories in `ready-for-dev` may not have been validated. Consider running `validate-create-story` first for a quality
          check.
        </output>
        <ask>Choose option [1], [2], [3], or [4], or specify story file path:</ask>

        <check if="user chooses '1'">
          <action>HALT - Run create-story to create next story</action>
        </check>

        <check if="user chooses '2'">
          <action>HALT - Run validate-create-story to improve existing stories</action>
        </check>

        <check if="user chooses '3'">
          <ask>Provide the story file path to develop:</ask>
          <action>Store user-provided story path as {{story_path}}</action>
          <goto anchor="task_check" />
        </check>

        <check if="user chooses '4'">
          <output>Loading {{sprint_status}} for detailed status review...</output>
          <action>Display detailed sprint status analysis</action>
          <action>HALT - User can review sprint status and provide story path</action>
        </check>

        <check if="user provides story file path">
          <action>Store user-provided story path as {{story_path}}</action>
          <goto anchor="task_check" />
        </check>
      </check>
    </check>

    <!-- Non-sprint story discovery -->
    <check if="{{sprint_status}} file does NOT exist">
      <action>Search {story_dir} for stories directly</action>
      <action>Find stories with "ready-for-dev" status in files</action>
      <action>Look for story files matching pattern: *-*-*.md</action>
      <action>Read each candidate story file to check Status section</action>

      <check if="no ready-for-dev stories found in story files">
        <output>📋 No ready-for-dev stories found

          **Available Options:**
          1. Run `create-story` to create next story from epics with comprehensive context
          2. Run `*validate-create-story` to improve existing stories
          3. Specify which story to develop
        </output>
        <ask>What would you like to do? Choose option [1], [2], or [3]:</ask>

        <check if="user chooses '1'">
          <action>HALT - Run create-story to create next story</action>
        </check>

        <check if="user chooses '2'">
          <action>HALT - Run validate-create-story to improve existing stories</action>
        </check>

        <check if="user chooses '3'">
          <ask>It's unclear what story you want developed. Please provide the full path to the story file:</ask>
          <action>Store user-provided story path as {{story_path}}</action>
          <action>Continue with provided story file</action>
        </check>
      </check>

      <check if="ready-for-dev story found in files">
        <action>Use discovered story file and extract story_key</action>
      </check>
    </check>

    <action>Store the found story_key (e.g., "1-2-user-authentication") for later status updates</action>
    <action>Find matching story file in {story_dir} using story_key pattern: {{story_key}}.md</action>
    <action>Read COMPLETE story file from discovered path</action>

    <anchor id="task_check" />

    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, File List, Change Log, Status</action>

    <action>Load comprehensive context from story file's Dev Notes section</action>
    <action>Extract developer guidance from Dev Notes: architecture requirements, previous learnings, technical specifications</action>
    <action>Use enhanced story context to inform implementation decisions and approaches</action>

    <action>Identify first incomplete task (unchecked [ ]) in Tasks/Subtasks</action>

    <action if="no incomplete tasks">
      <goto step="6">Completion sequence</goto>
    </action>
    <action if="story file inaccessible">HALT: "Cannot develop story without access to story file"</action>
    <action if="incomplete task or subtask requirements ambiguous">ASK user to clarify or HALT</action>
  </step>

## Next
- Read fully and follow: `./step-02-load-context.md`.
