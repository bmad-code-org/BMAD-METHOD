<!-- BMAD BMM Story Context Assembly Instructions (v6) -->

```xml
<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow assembles a Story Context file for a single drafted story by extracting acceptance criteria, tasks, relevant docs/code, interfaces, constraints, and testing guidance.</critical>
<critical>If story_path is provided, use it. Otherwise, find the first story with status "drafted" in sprint-status.yaml. If none found, HALT.</critical>
<critical>Check if context file already exists. If it does, ask user if they want to replace it, verify it, or cancel.</critical>

<critical>DOCUMENT OUTPUT: Technical context file (.context.md). Concise, structured, project-relative paths only.</critical>

<workflow>
  <step n="1" goal="Find drafted story and check for existing context" tag="sprint-status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE story file and parse sections</action>
      <action>Extract story_key from filename or story metadata</action>
      <action>Verify Status is "drafted" - if not, HALT with message: "Story status must be 'drafted' to generate context"</action>
    </check>

    <check if="{{story_path}} is NOT provided">
      <critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
      <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
      <action>Read ALL lines from beginning to end - do not skip any content</action>
      <action>Parse the development_status section completely</action>

      <action>Find FIRST story (reading in order from top to bottom) where:
        - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
        - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
        - Status value equals "drafted"
      </action>

      <check if="no story with status 'drafted' found">
        <output>📋 No drafted stories found in sprint-status.yaml

All stories are either still in backlog or already marked ready/in-progress/done.

**Next Steps:**
1. Run `create-story` to draft more stories
2. Run `sprint-planning` to refresh story tracking
        </output>
        <action>HALT</action>
      </check>

      <action>Use the first drafted story found</action>
      <action>Find matching story file in {{story_dir}} using story_key pattern</action>
      <action>Read the COMPLETE story file</action>
    </check>

    <action>Extract {{epic_id}}, {{story_id}}, {{story_title}}, {{story_status}} from filename/content</action>
    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes</action>
    <action>Extract user story fields (asA, iWant, soThat)</action>
    <template-output file="{default_output_file}">story_tasks</template-output>
    <template-output file="{default_output_file}">acceptance_criteria</template-output>

    <!-- Check if context file already exists -->
    <action>Check if file exists at {default_output_file}</action>

    <check if="context file already exists">
      <output>⚠️ Context file already exists: {default_output_file}

**What would you like to do?**
1. **Replace** - Generate new context file (overwrites existing)
2. **Verify** - Validate existing context file
3. **Cancel** - Exit without changes
      </output>
      <ask>Choose action (replace/verify/cancel):</ask>

      <check if="user chooses verify">
        <action>GOTO validation_step</action>
      </check>

      <check if="user chooses cancel">
        <action>HALT with message: "Context generation cancelled"</action>
      </check>

      <check if="user chooses replace">
        <action>Continue to generate new context file</action>
      </check>
    </check>

    <action>Store project root path for relative path conversion: extract from {project-root} variable</action>
    <action>Define path normalization function: convert any absolute path to project-relative by removing project root prefix</action>
    <action>Initialize output by writing template to {default_output_file}</action>
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
    <anchor id="validation_step" />
    <action>Validate output context file structure and content</action>
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using bmad/core/tasks/validate-workflow.xml</invoke-task>
  </step>

  <step n="7" goal="Update story file and mark ready for dev" tag="sprint-status">
    <action>Open {{story_path}}</action>
    <action>Find the "Status:" line (usually at the top)</action>
    <action>Update story file: Change Status to "ready-for-dev"</action>
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

    <output>✅ Story context generated successfully, {user_name}!

**Story Details:**
- Story: {{epic_id}}.{{story_id}} - {{story_title}}
- Story Key: {{story_key}}
- Context File: {default_output_file}
- Status: drafted → ready-for-dev

**Context Includes:**
- Documentation artifacts and references
- Existing code and interfaces
- Dependencies and frameworks
- Testing standards and ideas
- Development constraints

**Next Steps:**
1. Review the context file: {default_output_file}
2. Run `dev-story` to implement the story
3. Generate context for more drafted stories if needed
    </output>
  </step>

</workflow>
```
