<!-- BMAD BMM Story Context Assembly Instructions (v6) -->

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow assembles a Story Context XML for a single user story by extracting ACs, tasks, relevant docs/code, interfaces, constraints, and testing guidance to support implementation.</critical>
<critical>Default execution mode: #yolo (non-interactive). Only ask if {{non_interactive}} == false. If auto-discovery fails, HALT and request 'story_path' or 'story_dir'.</critical>

<workflow>
  <step n="1" goal="Locate story and initialize output">
    <action>If {{story_path}} provided and valid → use it; else auto-discover from {{story_dir}}.</action>
    <action>Auto-discovery: read {{story_dir}} (dev_story_location). If invalid/missing or contains no .md files, ASK for a story file path or directory to scan.</action>
    <action>If a directory is provided, list markdown files named "story-*.md" recursively; sort by last modified time; display top {{story_selection_limit}} with index, filename, path, modified time.</action>
    <ask optional="true" if="{{non_interactive}} == false">"Select a story (1-{{story_selection_limit}}) or enter a path:"</ask>
    <action>If {{non_interactive}} == true: choose the most recently modified story automatically. If none found, HALT with a clear message to provide 'story_path' or 'story_dir'. Else resolve selection into {{story_path}} and READ COMPLETE file.</action>
    <action>Extract {{epic_id}}, {{story_id}}, {{story_title}}, {{story_status}} from filename/content; parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes.</action>
    <action>Extract user story fields (asA, iWant, soThat).</action>
    <action>Initialize output by writing template to {default_output_file}.</action>
    <template-output file="{default_output_file}">as_a</template-output>
    <template-output file="{default_output_file}">i_want</template-output>
    <template-output file="{default_output_file}">so_that</template-output>
  </step>

  <step n="2" goal="Collect relevant documentation">
    <action>Scan docs and src module docs for items relevant to this story's domain: search keywords from story title, ACs, and tasks<</action>
    <action>Prefer authoritative sources: PRD, Architecture, Front-end Spec, Testing standards, module-specific docs.</action>
    <template-output file="{default_output_file}">
      Add artifacts.docs entries with {path, title, section, snippet} (NO invention)
    </template-output>
  </step>

  <step n="3" goal="Analyze existing code, interfaces, and constraints">
    <action>Search source tree for modules, files, and symbols matching story intent and AC keywords (controllers, services, components, tests).</action>
    <action>Identify existing interfaces/APIs the story should reuse rather than recreate.</action>
    <action>Extract development constraints from Dev Notes and architecture (patterns, layers, testing requirements).</action>
    <template-output file="{default_output_file}">
      Add artifacts.code entries with {path, kind, symbol, lines, reason}; include a brief reason explaining relevance to the story
      Populate interfaces with any API/interface signatures that the developer must call (name, kind, signature, path)
      Populate constraints with development rules extracted from Dev Notes and architecture (e.g., patterns, layers, testing requirements)
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

  <step n="7" goal="Update story status and context reference">
    <action>Open {{story_path}}; if Status == 'Draft' then set to 'ContextReadyDraft'; otherwise leave unchanged.</action>
    <action>Under 'Dev Agent Record' → 'Context Reference' (create if missing), add or update a list item for {default_output_file}.</action>
    <action>Save the story file.</action>
  </step>

</workflow>
```
