<!-- BMAD BMM Tech Spec Workflow Instructions (v6) -->

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This workflow generates a comprehensive Technical Specification from PRD and Architecture, including detailed design, NFRs, acceptance criteria, and traceability mapping.</critical>
<critical>Default execution mode: #yolo (non-interactive). If required inputs cannot be auto-discovered and {{non_interactive}} == true, HALT with a clear message listing missing documents; do not prompt.</critical>

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
      - project_level: Project complexity level (0-4)

      <action>Set status_file_found = true</action>
      <action>Store status_file_path for later updates</action>

      <check if="project_level < 3">
        <ask>**⚠️ Project Level Notice**

Status file shows project_level = {{project_level}}.

Tech-spec workflow is typically only needed for Level 3-4 projects.
For Level 0-2, solution-architecture usually generates tech specs automatically.

Options:
1. Continue anyway (manual tech spec generation)
2. Exit (check if solution-architecture already generated tech specs)
3. Run workflow-status to verify project configuration

What would you like to do?</ask>
        <action>If user chooses exit → HALT with message: "Check docs/ folder for existing tech-spec files"</action>
      </check>
    </check>

    <check if="not exists">
      <ask>**No workflow status file found.**

The status file tracks progress across all workflows and stores project configuration.

Note: This workflow is typically invoked automatically by solution-architecture, or manually for JIT epic tech specs.

Options:
1. Run workflow-status first to create the status file (recommended)
2. Continue in standalone mode (no progress tracking)
3. Exit

What would you like to do?</ask>
      <action>If user chooses option 1 → HALT with message: "Please run workflow-status first, then return to tech-spec"</action>
      <action>If user chooses option 2 → Set standalone_mode = true and continue</action>
      <action>If user chooses option 3 → HALT</action>
    </check>
  </step>

  <step n="2" goal="Collect inputs and initialize">
    <action>Identify PRD and Architecture documents from recommended_inputs. Attempt to auto-discover at default paths.</action>
    <ask optional="true" if="{{non_interactive}} == false">If inputs are missing, ask the user for file paths.</ask>

    <check if="inputs are missing and {{non_interactive}} == true">HALT with a clear message listing missing documents and do not proceed until user provides sufficient documents to proceed.</check>

    <action>Extract {{epic_title}} and {{epic_id}} from PRD (or ASK if not present).</action>
    <action>Resolve output file path using workflow variables and initialize by writing the template.</action>
  </step>

  <step n="3" goal="Overview and scope">
    <action>Read COMPLETE PRD and Architecture files.</action>
    <template-output file="{default_output_file}">
      Replace {{overview}} with a concise 1-2 paragraph summary referencing PRD context and goals
      Replace {{objectives_scope}} with explicit in-scope and out-of-scope bullets
      Replace {{system_arch_alignment}} with a short alignment summary to the architecture (components referenced, constraints)
    </template-output>
  </step>

  <step n="4" goal="Detailed design">
    <action>Derive concrete implementation specifics from Architecture and PRD (NO invention).</action>
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

  <step n="9" goal="Validate">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using bmad/core/tasks/validate-workflow.xml</invoke-task>
  </step>

  <step n="10" goal="Update status file on completion">
    <action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
    <action>Find the most recent file (by date in filename)</action>

    <check if="status file exists">
      <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
        <param>mode: update</param>
        <param>action: complete_workflow</param>
        <param>workflow_name: tech-spec</param>
      </invoke-workflow>

      <check if="success == true">
        <output>✅ Status updated for Epic {{epic_id}} tech-spec</output>
      </check>

      <output>**✅ Tech Spec Generated Successfully, {user_name}!**

**Epic Details:**
- Epic ID: {{epic_id}}
- Epic Title: {{epic_title}}
- Tech Spec File: {{default_output_file}}

**Status file updated:**
- Current step: tech-spec (Epic {{epic_id}}) ✓
- Progress: {{new_progress_percentage}}%

**Note:** This is a JIT (Just-In-Time) workflow.
- Run again for other epics that need detailed tech specs
- Or proceed to Phase 4 (Implementation) if all tech specs are complete

**Next Steps:**
1. If more epics need tech specs: Run tech-spec again with different epic_id
2. If all tech specs complete: Proceed to Phase 4 implementation
3. Check status anytime with: `workflow-status`
      </output>
    </check>

    <check if="status file not found">
      <output>**✅ Tech Spec Generated Successfully, {user_name}!**

**Epic Details:**
- Epic ID: {{epic_id}}
- Epic Title: {{epic_title}}
- Tech Spec File: {{default_output_file}}

Note: Running in standalone mode (no status file).

To track progress across workflows, run `workflow-status` first.

**Note:** This is a JIT workflow - run again for other epics as needed.
      </output>
    </check>
  </step>

</workflow>
```
