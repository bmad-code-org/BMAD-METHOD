<!-- BMAD BMM Tech Spec Workflow Instructions (v6) -->

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This workflow generates a comprehensive Technical Specification from PRD and Architecture, including detailed design, NFRs, acceptance criteria, and traceability mapping.</critical>
<critical>If required inputs cannot be auto-discovered HALT with a clear message listing missing documents, allow user to provide them to proceed.</critical>

<workflow>
  <step n="1" goal="Collect inputs and initialize">
    <action>Identify PRD and Architecture documents from recommended_inputs. Attempt to auto-discover at default paths.</action>
    <ask if="inputs are missing">ask the user for file paths. HALT and wait for docs to proceed with the rest of step 2</ask>

    <action>Extract {{epic_title}} and {{epic_id}} from PRD.</action>
    <action>Resolve output file path using workflow variables and initialize by writing the template.</action>
  </step>

  <step n="1.5" goal="Validate epic in sprint status">
    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: get_epic_status</param>
      <param>epic_id: {{epic_id}}</param>
    </invoke-workflow>

    <check if="{{result_found}} == false">
      <output>⚠️ Epic {{epic_id}} not found in sprint-status.yaml

This epic hasn't been registered in the sprint plan yet.
Run sprint-planning workflow to initialize epic tracking.
      </output>
      <action>HALT</action>
    </check>

    <check if="{{result_status}} == 'contexted'">
      <output>ℹ️ Epic {{epic_id}} already marked as contexted

Continuing to regenerate tech spec...
      </output>
    </check>
  </step>

  <step n="2" goal="Overview and scope">
    <action>Read COMPLETE PRD and Architecture files.</action>
    <template-output file="{default_output_file}">
      Replace {{overview}} with a concise 1-2 paragraph summary referencing PRD context and goals
      Replace {{objectives_scope}} with explicit in-scope and out-of-scope bullets
      Replace {{system_arch_alignment}} with a short alignment summary to the architecture (components referenced, constraints)
    </template-output>
  </step>

  <step n="3" goal="Detailed design">
    <action>Derive concrete implementation specifics from Architecture and PRD (CRITICAL: NO invention).</action>
    <template-output file="{default_output_file}">
      Replace {{services_modules}} with a table or bullets listing services/modules with responsibilities, inputs/outputs, and owners
      Replace {{data_models}} with normalized data model definitions (entities, fields, types, relationships); include schema snippets where available
      Replace {{apis_interfaces}} with API endpoint specs or interface signatures (method, path, request/response models, error codes)
      Replace {{workflows_sequencing}} with sequence notes or diagrams-as-text (steps, actors, data flow)
    </template-output>
  </step>

  <step n="4" goal="Non-functional requirements">
    <template-output file="{default_output_file}">
      Replace {{nfr_performance}} with measurable targets (latency, throughput); link to any performance requirements in PRD/Architecture
      Replace {{nfr_security}} with authn/z requirements, data handling, threat notes; cite source sections
      Replace {{nfr_reliability}} with availability, recovery, and degradation behavior
      Replace {{nfr_observability}} with logging, metrics, tracing requirements; name required signals
    </template-output>
  </step>

  <step n="5" goal="Dependencies and integrations">
    <action>Scan repository for dependency manifests (e.g., package.json, pyproject.toml, go.mod, Unity Packages/manifest.json).</action>
    <template-output file="{default_output_file}">
      Replace {{dependencies_integrations}} with a structured list of dependencies and integration points with version or commit constraints when known
    </template-output>
  </step>

  <step n="6" goal="Acceptance criteria and traceability">
    <action>Extract acceptance criteria from PRD; normalize into atomic, testable statements.</action>
    <template-output file="{default_output_file}">
      Replace {{acceptance_criteria}} with a numbered list of testable acceptance criteria
      Replace {{traceability_mapping}} with a table mapping: AC → Spec Section(s) → Component(s)/API(s) → Test Idea
    </template-output>
  </step>

  <step n="7" goal="Risks and test strategy">
    <template-output file="{default_output_file}">
      Replace {{risks_assumptions_questions}} with explicit list (each item labeled as Risk/Assumption/Question) with mitigation or next step
      Replace {{test_strategy}} with a brief plan (test levels, frameworks, coverage of ACs, edge cases)
    </template-output>
  </step>

  <step n="8" goal="Validate and complete">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using bmad/core/tasks/validate-workflow.xml</invoke-task>

    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: update_epic_status</param>
      <param>epic_id: {{epic_id}}</param>
      <param>new_status: contexted</param>
    </invoke-workflow>

    <check if="{{result_success}} == false">
      <output>⚠️ Could not update epic status: {{result_error}}</output>
    </check>

    <output>**✅ Tech Spec Generated Successfully, {user_name}!**

**Epic Details:**
- Epic ID: {{epic_id}}
- Epic Title: {{epic_title}}
- Tech Spec File: {{default_output_file}}
- Epic Status: {{result_new_status}} (was {{result_old_status}})

**Note:** This is a JIT (Just-In-Time) workflow - run again for other epics as needed.

**Next Steps:**
1. If more epics need tech specs: Run tech-spec again with different epic_id
2. If all tech specs complete: Proceed to Phase 4 implementation
   - Load SM agent and run `create-story` to begin implementing stories
    </output>
  </step>

</workflow>
```
