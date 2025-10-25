<!-- BMAD BMM Story Context Assembly Instructions (v6) -->

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow assembles a Story Context XML for a single user story by extracting ACs, tasks, relevant docs/code, interfaces, constraints, and testing guidance to support implementation.</critical>
<critical>Default execution mode: #yolo (non-interactive). Only ask if {{non_interactive}} == false. If auto-discovery fails, HALT and request 'story_path' or 'story_dir'.</critical>

<critical>DOCUMENT OUTPUT: Technical XML context file. Concise, structured, project-relative paths only. User skill level ({user_skill_level}) affects conversation style ONLY, not context content.</critical>

<workflow>
  <step n="1" goal="Find drafted story from sprint status" tag="sprint-status">
    <action>If {{story_path}} provided and valid → use it; extract story_key from filename/metadata; GOTO initialize_context</action>

    <critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Read ALL lines from beginning to end - do not skip any content</action>
    <action>Parse the development_status section completely</action>

    <action>Find ALL stories (reading in order from top to bottom) where:
      - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
      - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
      - Status value equals "drafted"
    </action>

    <action>Collect up to 10 drafted story keys in order (limit for display purposes)</action>
    <action>Count total drafted stories found</action>

    <check if="no drafted stories found">
      <output>📋 No drafted stories found in sprint-status.yaml

All stories are either still in backlog or already marked ready/in-progress/done.

**Options:**
1. Run `create-story` to draft more stories
2. Run `sprint-planning` to refresh story tracking
      </output>
      <action>HALT</action>
    </check>

    <action>Display available drafted stories:

**Drafted Stories Available ({{drafted_count}} found):**

{{list_of_drafted_story_keys}}

    </action>

    <ask if="{{non_interactive}} == false">Select the drafted story to generate context for (enter story key or number):</ask>
    <action if="{{non_interactive}} == true">Auto-select first story from the list</action>

    <action>Resolve selected story_key from user input or auto-selection</action>
    <action>Find matching story file in {{story_dir}} using story_key pattern</action>
    <action>Resolve {{story_path}} and READ COMPLETE file</action>

    <anchor id="initialize_context" />

    <action>Extract {{epic_id}}, {{story_id}}, {{story_title}}, {{story_status}} from filename/content; parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes.</action>
    <action>Extract user story fields (asA, iWant, soThat).</action>
    <action>Store project root path for relative path conversion: extract from {project-root} variable.</action>
    <action>Define path normalization function: convert any absolute path to project-relative by removing project root prefix.</action>
    <action>Initialize output by writing template to {default_output_file}.</action>
    <template-output file="{default_output_file}">as_a</template-output>
    <template-output file="{default_output_file}">i_want</template-output>
    <template-output file="{default_output_file}">so_that</template-output>
  </step>

  <step n="2" goal="Collect relevant documentation">
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

  <step n="3" goal="Analyze existing code, interfaces, and constraints">
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

  <step n="4" goal="Gather dependencies and frameworks">
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

  <step n="5" goal="Testing standards and ideas">
    <action>From Dev Notes, architecture docs, testing docs, and existing tests, extract testing standards (frameworks, patterns, locations).</action>
    <template-output file="{default_output_file}">
      Populate tests.standards with a concise paragraph
      Populate tests.locations with directories or glob patterns where tests live
      Populate tests.ideas with initial test ideas mapped to acceptance criteria IDs
    </template-output>
  </step>

  <step n="6" goal="Validate and save">
    <action>Validate output XML structure and content.</action>
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using bmad/core/tasks/validate-workflow.xml</invoke-task>
  </step>

  <step n="7" goal="Update story file and mark ready for dev" tag="sprint-status">
    <action>Open {{story_path}}</action>
    <action>Find the "Status:" line (usually at the top)</action>
    <action>Update story file: Change Status to "Ready"</action>
    <action>Under 'Dev Agent Record' → 'Context Reference' (create if missing), add or update a list item for {default_output_file}.</action>
    <action>Save the story file.</action>

    <!-- Update sprint status to mark ready-for-dev -->
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Find development_status key matching {{story_key}}</action>
    <action>Verify current status is "drafted" (expected previous state)</action>
    <action>Update development_status[{{story_key}}] = "ready-for-dev"</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

    <check if="story key not found in file">
      <output>⚠️ Story file updated, but could not update sprint-status: {{story_key}} not found

You may need to run sprint-planning to refresh tracking.
      </output>
    </check>

    <output>**✅ Story Context Generated Successfully, {user_name}!**

**Story Details:**
- Story ID: {{story_id}}
- Story Key: {{story_key}}
- Title: {{story_title}}
- Context File: {{default_output_file}}
- Story Status: Ready (was Draft)
- Sprint Status: ready-for-dev (was drafted)

**Next Steps:**
1. Load DEV agent (bmad/bmm/agents/dev.md)
2. Run `dev-story` workflow to implement the story
3. The context file will provide comprehensive implementation guidance
    </output>
  </step>

</workflow>
```
