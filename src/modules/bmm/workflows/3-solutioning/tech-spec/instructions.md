<!-- BMAD BMM Tech Spec Workflow Instructions (v6) -->

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow generates a comprehensive Technical Specification from PRD and Architecture, including detailed design, NFRs, acceptance criteria, and traceability mapping.</critical>
<critical>Default execution mode: #yolo (non-interactive). If required inputs cannot be auto-discovered and {{non_interactive}} == true, HALT with a clear message listing missing documents; do not prompt.</critical>

<workflow>
  <step n="1" goal="Collect inputs and initialize">
    <action>Identify PRD and Architecture documents from recommended_inputs. Attempt to auto-discover at default paths.</action>
    <ask optional="true" if="{{non_interactive}} == false">If inputs are missing, ask the user for file paths.</ask>

    <check if="inputs are missing and {{non_interactive}} == true">HALT with a clear message listing missing documents and do not proceed until user provides sufficient documents to proceed.</check>

    <action>Extract {{epic_title}} and {{epic_id}} from PRD (or ASK if not present).</action>
    <action>Resolve output file path using workflow variables and initialize by writing the template.</action>
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
    <action>Derive concrete implementation specifics from Architecture and PRD (NO invention).</action>
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

  <step n="8" goal="Validate">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using bmad/core/tasks/validate-workflow.xml</invoke-task>
  </step>

</workflow>
```
