<!-- BMAD BMM Story Context Assembly Instructions (v6) -->

````xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This workflow assembles a Story Context XML for a single user story by extracting ACs, tasks, relevant docs/code, interfaces, constraints, and testing guidance to support implementation.</critical>
<critical>Default execution mode: #yolo (non-interactive). Only ask if {{non_interactive}} == false. If auto-discovery fails, HALT and request 'story_path' or 'story_dir'.</critical>

<workflow>
  <step n="1" goal="Check and load workflow status file">
    <action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
    <action>Find the most recent file (by date in filename: bmm-workflow-status.md)</action>

    <check if="exists">
      <action>Load the status file</action>
      <action>Extract key information:</action>
      - current_step: What workflow was last run
      - next_step: What workflow should run next
      - planned_workflow: The complete workflow journey table
      - progress_percentage: Current progress
      - IN PROGRESS story: The story being worked on (from Implementation Progress section)

      <action>Set status_file_found = true</action>
      <action>Store status_file_path for later updates</action>

      <check if='next_step != "story-context" AND current_step != "story-ready"'>
        <ask>**⚠️ Workflow Sequence Note**

Status file shows:
- Current step: {{current_step}}
- Expected next: {{next_step}}

This workflow (story-context) is typically run after story-ready.

Options:
1. Continue anyway (story-context is optional)
2. Exit and run the expected workflow: {{next_step}}
3. Check status with workflow-status

What would you like to do?</ask>
        <action>If user chooses exit → HALT with message: "Run workflow-status to see current state"</action>
      </check>
    </check>

    <check if="not exists">
      <ask>**No workflow status file found.**

The status file tracks progress across all workflows and provides context about which story to work on.

Options:
1. Run workflow-status first to create the status file (recommended)
2. Continue in standalone mode (no progress tracking)
3. Exit

What would you like to do?</ask>
      <action>If user chooses option 1 → HALT with message: "Please run workflow-status first, then return to story-context"</action>
      <action>If user chooses option 2 → Set standalone_mode = true and continue</action>
      <action>If user chooses option 3 → HALT</action>
    </check>
  </step>

  <step n="2" goal="Locate story and initialize output">
    <action>If {{story_path}} provided and valid → use it; else auto-discover from {{story_dir}}.</action>
    <action>Auto-discovery: read {{story_dir}} (dev_story_location). If invalid/missing or contains no .md files, ASK for a story file path or directory to scan.</action>
    <action>If a directory is provided, list markdown files named "story-*.md" recursively; sort by last modified time; display top {{story_selection_limit}} with index, filename, path, modified time.</action>
    <ask optional="true" if="{{non_interactive}} == false">"Select a story (1-{{story_selection_limit}}) or enter a path:"</ask>
    <action>If {{non_interactive}} == true: choose the most recently modified story automatically. If none found, HALT with a clear message to provide 'story_path' or 'story_dir'. Else resolve selection into {{story_path}} and READ COMPLETE file.</action>
    <action>Extract {{epic_id}}, {{story_id}}, {{story_title}}, {{story_status}} from filename/content; parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes.</action>
    <action>Extract user story fields (asA, iWant, soThat).</action>
    <action>Store project root path for relative path conversion: extract from {project-root} variable.</action>
    <action>Define path normalization function: convert any absolute path to project-relative by removing project root prefix.</action>
    <action>Initialize output by writing template to {default_output_file}.</action>
    <template-output file="{default_output_file}">as_a</template-output>
    <template-output file="{default_output_file}">i_want</template-output>
    <template-output file="{default_output_file}">so_that</template-output>
  </step>

  <step n="3" goal="Collect relevant documentation">
    <action>Scan docs and src module docs for items relevant to this story's domain: search keywords from story title, ACs, and tasks.</action>
    <action>Prefer authoritative sources: PRD, Architecture, Front-end Spec, Testing standards, module-specific docs.</action>
    <action>For each discovered document: convert absolute paths to project-relative format by removing {project-root} prefix. Store only relative paths (e.g., "docs/prd.md" not "/Users/.../docs/prd.md").</action>
    <template-output file="{default_output_file}">
      Add artifacts.docs entries with {path, title, section, snippet}:
      - path: PROJECT-RELATIVE path only (strip {project-root} prefix)
      - title: Document title
      - section: Relevant section name
      - snippet: Brief excerpt (2-3 sentences max, NO invention)
    </template-output>
  </step>

  <step n="4" goal="Analyze existing code, interfaces, and constraints">
    <action>Search source tree for modules, files, and symbols matching story intent and AC keywords (controllers, services, components, tests).</action>
    <action>Identify existing interfaces/APIs the story should reuse rather than recreate.</action>
    <action>Extract development constraints from Dev Notes and architecture (patterns, layers, testing requirements).</action>
    <action>For all discovered code artifacts: convert absolute paths to project-relative format (strip {project-root} prefix).</action>
    <template-output file="{default_output_file}">
      Add artifacts.code entries with {path, kind, symbol, lines, reason}:
      - path: PROJECT-RELATIVE path only (e.g., "src/services/api.js" not full path)
      - kind: file type (controller, service, component, test, etc.)
      - symbol: function/class/interface name
      - lines: line range if specific (e.g., "45-67")
      - reason: brief explanation of relevance to this story

      Populate interfaces with API/interface signatures:
      - name: Interface or API name
      - kind: REST endpoint, GraphQL, function signature, class interface
      - signature: Full signature or endpoint definition
      - path: PROJECT-RELATIVE path to definition

      Populate constraints with development rules:
      - Extract from Dev Notes and architecture
      - Include: required patterns, layer restrictions, testing requirements, coding standards
    </template-output>
  </step>

  <step n="5" goal="Gather dependencies and frameworks">
    <action>Detect dependency manifests and frameworks in the repo:
      - Node: package.json (dependencies/devDependencies)
      - Python: pyproject.toml/requirements.txt
      - Go: go.mod
      - Unity: Packages/manifest.json, Assets/, ProjectSettings/
      - Other: list notable frameworks/configs found</action>
    <template-output file="{default_output_file}">
      Populate artifacts.dependencies with keys for detected ecosystems and their packages with version ranges where present
    </template-output>
  </step>

  <step n="6" goal="Testing standards and ideas">
    <action>From Dev Notes, architecture docs, testing docs, and existing tests, extract testing standards (frameworks, patterns, locations).</action>
    <template-output file="{default_output_file}">
      Populate tests.standards with a concise paragraph
      Populate tests.locations with directories or glob patterns where tests live
      Populate tests.ideas with initial test ideas mapped to acceptance criteria IDs
    </template-output>
  </step>

  <step n="7" goal="Validate and save">
    <action>Validate output XML structure and content.</action>
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using bmad/core/tasks/validate-workflow.xml</invoke-task>
  </step>

  <step n="8" goal="Update story status and context reference">
    <action>Open {{story_path}}; if Status == 'Draft' then set to 'ContextReadyDraft'; otherwise leave unchanged.</action>
    <action>Under 'Dev Agent Record' → 'Context Reference' (create if missing), add or update a list item for {default_output_file}.</action>
    <action>Save the story file.</action>
  </step>

  <step n="9" goal="Update status file on completion">
    <action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
    <action>Find the most recent file (by date in filename)</action>

    <check if="status file exists">
      <action>Load the status file</action>

      <template-output file="{{status_file_path}}">current_step</template-output>
      <action>Set to: "story-context (Story {{story_id}})"</action>

      <template-output file="{{status_file_path}}">current_workflow</template-output>
      <action>Set to: "story-context (Story {{story_id}}) - Complete"</action>

      <template-output file="{{status_file_path}}">progress_percentage</template-output>
      <action>Calculate per-story weight: remaining_40_percent / total_stories / 5</action>
      <action>Increment by: {{per_story_weight}} * 1 (story-context weight is ~1% per story)</action>

      <template-output file="{{status_file_path}}">decisions_log</template-output>
      <action>Add entry:</action>
      ```
      - **{{date}}**: Completed story-context for Story {{story_id}} ({{story_title}}). Context file: {{default_output_file}}. Next: DEV agent should run dev-story to implement.
      ```

      <output>**✅ Story Context Generated Successfully, {user_name}!**

**Story Details:**
- Story ID: {{story_id}}
- Title: {{story_title}}
- Context File: {{default_output_file}}

**Status file updated:**
- Current step: story-context (Story {{story_id}}) ✓
- Progress: {{new_progress_percentage}}%

**Next Steps:**
1. Load DEV agent (bmad/bmm/agents/dev.md)
2. Run `dev-story` workflow to implement the story
3. The context file will provide comprehensive implementation guidance

Check status anytime with: `workflow-status`
      </output>
    </check>

    <check if="status file not found">
      <output>**✅ Story Context Generated Successfully, {user_name}!**

**Story Details:**
- Story ID: {{story_id}}
- Title: {{story_title}}
- Context File: {{default_output_file}}

Note: Running in standalone mode (no status file).

To track progress across workflows, run `workflow-status` first.

**Next Steps:**
1. Load DEV agent and run `dev-story` to implement
      </output>
    </check>
  </step>

</workflow>
````
