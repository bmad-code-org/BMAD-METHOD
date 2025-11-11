<!-- BMAD BMM Tech Spec Workflow Instructions (v6) -->

```xml
<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This workflow generates a comprehensive Technical Specification from PRD and Architecture, including detailed design, NFRs, acceptance criteria, and traceability mapping.</critical>
<critical>If required inputs cannot be auto-discovered HALT with a clear message listing missing documents, allow user to provide them to proceed.</critical>

<workflow>
  <step n="1" goal="Collect inputs and discover next epic" tag="sprint-status">
    Document Discovery - Selective Epic Loading

    **Strategy**: This workflow needs only ONE specific epic and its stories, not all epics. This provides huge efficiency gains when epics are sharded.

    **Epic Discovery Process (SELECTIVE OPTIMIZATION):**

    1. **Determine which epic** you need (epic_num from workflow context or user input)
    2. **Check for sharded version**: Look for `epics/index.md`
    3. **If sharded version found**:
      - Read `index.md` to understand structure
      - **Load ONLY `epic-{epic_num}.md`** (e.g., `epics/epic-3.md` for Epic 3)
      - DO NOT load all epic files - only the one needed!
      - This is the key efficiency optimization for large multi-epic projects
    4. **If whole document found**: Load the complete `epics.md` file and extract the relevant epic

    **Other Documents (prd, gdd, architecture, ux-design) - Full Load:**

    1. **Search for whole document first** - Use fuzzy file matching
    2. **Check for sharded version** - If whole document not found, look for `{doc-name}/index.md`
    3. **If sharded version found**:
      - Read `index.md` to understand structure
      - Read ALL section files listed in the index
      - Treat combined content as single document
    4. **Brownfield projects**: The `document-project` workflow creates `{output_folder}/docs/index.md`

    **Priority**: If both whole and sharded versions exist, use the whole document.

    **UX-Heavy Projects**: Always check for ux-design documentation as it provides critical context for UI-focused epics and stories.
    <action>Identify PRD and Architecture documents from recommended_inputs. Attempt to auto-discover at default paths.</action>
    <ask if="inputs are missing">ask the user for file paths. HALT and wait for docs to proceed</ask>

    <!-- Intelligent Epic Discovery -->
    <critical>MUST read COMPLETE {sprint-status} file to discover next epic</critical>
    <action>Read ALL development_status entries</action>
    <action>Find all epics with status "backlog" (not yet contexted)</action>
    <action>Identify the FIRST backlog epic as the suggested default</action>

    <check if="backlog epics found">
      <output>📋 **Next Epic Suggested:** Epic {{suggested_epic_id}}: {{suggested_epic_title}}</output>
      <ask>Use this epic?
- [y] Yes, use {{suggested_epic_id}}
- [n] No, let me specify a different epic_id
      </ask>

      <check if="user selects 'n'">
        <ask>Enter the epic_id you want to context</ask>
        <action>Store user-provided epic_id as {{epic_id}}</action>
      </check>

      <check if="user selects 'y'">
        <action>Use {{suggested_epic_id}} as {{epic_id}}</action>
      </check>
    </check>

    <check if="no backlog epics found">
      <output>✅ All epics are already contexted!

No epics with status "backlog" found in sprint-status.yaml.
      </output>
      <ask>Do you want to re-context an existing epic? Enter epic_id or [q] to quit:</ask>

      <check if="user enters epic_id">
        <action>Store as {{epic_id}}</action>
      </check>

      <check if="user enters 'q'">
        <action>HALT - No work needed</action>
      </check>
    </check>

    <action>Extract {{epic_title}} from PRD based on {{epic_id}}.</action>
    <action>Resolve output file path using workflow variables and initialize by writing the template.</action>
  </step>

  <step n="2" goal="Validate epic exists in sprint status" tag="sprint-status">
    <action>Look for epic key "epic-{{epic_id}}" in development_status (already loaded from step 1)</action>
    <action>Get current status value if epic exists</action>

    <check if="epic not found">
      <output>⚠️ Epic {{epic_id}} not found in sprint-status.yaml

This epic hasn't been registered in the sprint plan yet.
Run sprint-planning workflow to initialize epic tracking.
      </output>
      <action>HALT</action>
    </check>

    <check if="epic status == 'contexted'">
      <output>ℹ️ Epic {{epic_id}} already marked as contexted

Continuing to regenerate tech spec...
      </output>
    </check>
  </step>

  <step n="3" goal="Overview and scope">
    <action>Read COMPLETE found {recommended_inputs}.</action>
    <template-output file="{default_output_file}">
      Replace {{overview}} with a concise 1-2 paragraph summary referencing PRD context and goals
      Replace {{objectives_scope}} with explicit in-scope and out-of-scope bullets
      Replace {{system_arch_alignment}} with a short alignment summary to the architecture (components referenced, constraints)
    </template-output>
  </step>

  <step n="4" goal="Detailed design">
    <action>Derive concrete implementation specifics from all {recommended_inputs} (CRITICAL: NO invention). If a epic tech spec precedes this one and exists, maintain consistency where appropriate.</action>
    <template-output file="{default_output_file}">
      Replace {{services_modules}} with a table or bullets listing services/modules with responsibilities, inputs/outputs, and owners
      Replace {{data_models}} with normalized data model definitions (entities, fields, types, relationships); include schema snippets where available
      Replace {{apis_interfaces}} with API endpoint specs or interface signatures (method, path, request/response models, error codes)
      Replace {{workflows_sequencing}} with sequence notes or diagrams-as-text (steps, actors, data flow)
    </template-output>
  </step>

  <step n="5" goal="Non-functional requirements">
    <template-output file="{default_output_file}">
      Replace {{nfr_performance}} with measurable targets (latency, throughput); link to any performance requirements in PRD/Architecture
      Replace {{nfr_security}} with authn/z requirements, data handling, threat notes; cite source sections
      Replace {{nfr_reliability}} with availability, recovery, and degradation behavior
      Replace {{nfr_observability}} with logging, metrics, tracing requirements; name required signals
    </template-output>
  </step>

  <step n="6" goal="Dependencies and integrations">
    <action>Scan repository for dependency manifests (e.g., package.json, pyproject.toml, go.mod, Unity Packages/manifest.json).</action>
    <template-output file="{default_output_file}">
      Replace {{dependencies_integrations}} with a structured list of dependencies and integration points with version or commit constraints when known
    </template-output>
  </step>

  <step n="7" goal="Acceptance criteria and traceability">
    <action>Extract acceptance criteria from PRD; normalize into atomic, testable statements.</action>
    <template-output file="{default_output_file}">
      Replace {{acceptance_criteria}} with a numbered list of testable acceptance criteria
      Replace {{traceability_mapping}} with a table mapping: AC → Spec Section(s) → Component(s)/API(s) → Test Idea
    </template-output>
  </step>

  <step n="8" goal="Risks and test strategy">
    <template-output file="{default_output_file}">
      Replace {{risks_assumptions_questions}} with explicit list (each item labeled as Risk/Assumption/Question) with mitigation or next step
      Replace {{test_strategy}} with a brief plan (test levels, frameworks, coverage of ACs, edge cases)
    </template-output>
  </step>

  <step n="9" goal="Validate and mark epic contexted" tag="sprint-status">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using .bmad/core/tasks/validate-workflow.xml</invoke-task>

    <!-- Mark epic as contexted -->
    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Find development_status key "epic-{{epic_id}}"</action>
    <action>Verify current status is "backlog" (expected previous state)</action>
    <action>Update development_status["epic-{{epic_id}}"] = "contexted"</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

    <check if="epic key not found in file">
      <output>⚠️ Could not update epic status: epic-{{epic_id}} not found</output>
    </check>

    <output>**✅ Tech Spec Generated Successfully, {user_name}!**

**Epic Details:**
- Epic ID: {{epic_id}}
- Epic Title: {{epic_title}}
- Tech Spec File: {{default_output_file}}
- Epic Status: contexted (was backlog)

**Note:** This is a JIT (Just-In-Time) workflow - run again for other epics as needed.

**Next Steps:**
1. Load SM agent and run `create-story` to begin implementing the first story under this epic.
    </output>
  </step>

</workflow>
```
