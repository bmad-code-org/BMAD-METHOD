# Senior Developer Review - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow performs a Senior Developer Review on a story flagged Ready for Review, appends structured review notes, and can update the story status based on the outcome.</critical>
<critical>Default execution mode: #yolo (non-interactive). Only ask if {{non_interactive}} == false. If auto-discovery of the target story fails, HALT with a clear message to provide 'story_path' or 'story_dir'.</critical>
<critical>Only modify the story file in these areas: Status (optional per settings), Dev Agent Record (Completion Notes), File List (if corrections are needed), Change Log, and the appended "Senior Developer Review (AI)" section at the end of the document.</critical>
<critical>Execute ALL steps in exact order; do NOT skip steps</critical>

<critical>DOCUMENT OUTPUT: Technical review reports. Structured findings with severity levels and action items. User skill level ({user_skill_level}) affects conversation style ONLY, not review content.</critical>

<workflow>

  <step n="1" goal="Locate story and verify review status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE file and parse sections</action>
      <action>Extract story_key from filename or story metadata</action>
      <goto>verify_status</goto>
    </check>

    <action>Query sprint-status for review stories:</action>

    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: list_stories</param>
      <param>filter_status: review</param>
      <param>limit: 10</param>
    </invoke-workflow>

    <check if="{{result_count}} == 0">
      <output>📋 No stories in review status found

**Options:**
1. Run `dev-story` to implement and mark stories ready for review
2. Check sprint-status.yaml for current story states
      </output>
      <action>HALT</action>
    </check>

    <action>Display available review stories:

**Stories Ready for Review ({{result_count}} found):**

{{result_story_list}}

    </action>

    <ask if="{{non_interactive}} == false">Select story to review (enter story key or number):</ask>
    <action if="{{non_interactive}} == true">Auto-select first story from result_stories</action>

    <action>Resolve selected story_key and find file path in {{story_dir}}</action>
    <action>Resolve {{story_path}} and read the COMPLETE file</action>

    <anchor id="verify_status" />

    <action>Extract {{epic_num}} and {{story_num}} from filename (e.g., story-2.3.*.md) and story metadata if available</action>
    <action>Parse sections: Status, Story, Acceptance Criteria, Tasks/Subtasks (and completion states), Dev Notes, Dev Agent Record (Context Reference, Completion Notes, File List), Change Log</action>
    <action if="Status is not one of {{allow_status_values}}">HALT with message: "Story status must be 'Ready for Review' to proceed" (accept 'Review' as equivalent).</action>
    <action if="story cannot be read">HALT.</action>
  </step>

  <step n="2" goal="Resolve context and specification inputs">
    <action>Locate Story Context: Under Dev Agent Record → Context Reference, read referenced path(s). If missing and {{auto_discover_context}}: search {{output_folder}} for files named "story-context-{{epic_num}}.{{story_num}}*.xml"; pick the most recent.</action>
    <action if="no context found">Continue but record a WARNING in review notes: "No Story Context found".</action>
    <action>Locate Epic Tech Spec: If {{auto_discover_tech_spec}}, search {{tech_spec_search_dir}} with glob {{tech_spec_glob_template}} (resolve {{epic_num}}); else use provided input.</action>
    <action if="no tech spec found">Continue but record a WARNING in review notes: "No Tech Spec found for epic {{epic_num}}".</action>
    <action>Load architecture/standards docs: For each file name in {{arch_docs_file_names}} within {{arch_docs_search_dirs}}, read if exists. Collect any testing, coding standards, security, and architectural patterns.</action>
  </step>

  <step n="3" goal="Detect tech stack and establish best-practice reference set">
    <action>Detect primary ecosystem(s) by scanning for manifests (e.g., package.json, pyproject.toml, go.mod, Dockerfile). Record key frameworks (e.g., Node/Express, React/Vue, Python/FastAPI, etc.).</action>
    <action>If {{enable_mcp_doc_search}} and MCP servers are available → Use them to search for up-to-date best practices, security advisories, and framework-specific guidance relevant to the detected stack and the story's domain.</action>
    <action>If MCP is unavailable or insufficient and {{enable_web_fallback}} → Perform targeted web searches and fetch authoritative references (framework docs, OWASP, language style guides). Prefer official documentation and widely-recognized standards.</action>
    <action>Synthesize a concise "Best-Practices and References" note capturing any updates or considerations that should influence the review (cite links and versions if available).</action>
  </step>

  <step n="4" goal="Assess implementation against acceptance criteria and specs">
    <action>From the story, read Acceptance Criteria and Tasks/Subtasks with their completion state.</action>
    <action>From Dev Agent Record → File List, compile list of changed/added files. If File List is missing or clearly incomplete, search repo for recent changes relevant to the story scope (heuristics: filenames matching components/services/routes/tests inferred from ACs/tasks).</action>
    <action>Cross-check epic tech-spec requirements and architecture constraints against the implementation intent in files.</action>
    <action>For each acceptance criterion, verify there is evidence of implementation and corresponding tests (unit/integration/E2E as applicable). Note any gaps explicitly.</action>
    <action if="critical architecture constraints are violated (e.g., layering, dependency rules)">flag as High Severity finding.</action>
  </step>

  <step n="5" goal="Perform code quality and risk review">
    <action>For each changed file, skim for common issues appropriate to the stack: error handling, input validation, logging, dependency injection, thread-safety/async correctness, resource cleanup, performance anti-patterns.</action>
    <action>Perform security review: injection risks, authZ/authN handling, secret management, unsafe defaults, un-validated redirects, CORS misconfigured, dependency vulnerabilities (based on manifests).</action>
    <action>Check tests quality: assertions are meaningful, edge cases covered, deterministic behavior, proper fixtures, no flakiness patterns.</action>
    <action>Capture concrete, actionable suggestions with severity (High/Med/Low) and rationale. When possible, suggest specific code-level changes (filenames + line ranges) without rewriting large sections.</action>
  </step>

  <step n="6" goal="Decide review outcome and prepare notes">
    <action>Determine outcome: Approve, Changes Requested, or Blocked.</action>
    <action>Prepare a structured review report with sections: Summary, Outcome, Key Findings (by severity), Acceptance Criteria Coverage, Test Coverage and Gaps, Architectural Alignment, Security Notes, Best-Practices and References, Action Items.</action>
    <action>For Action Items, use imperative phrasing and map each to related ACs or files. Include suggested owners if clear.</action>
  </step>

  <step n="7" goal="Append review to story and update metadata">
    <action>Open {{story_path}} and append a new section at the end titled exactly: "Senior Developer Review (AI)".</action>
    <action>Insert subsections:
      - Reviewer: {{user_name}}
      - Date: {{date}}
      - Outcome: (Approve | Changes Requested | Blocked)
      - Summary
      - Key Findings
      - Acceptance Criteria Coverage
      - Test Coverage and Gaps
      - Architectural Alignment
      - Security Notes
      - Best-Practices and References (with links)
      - Action Items
    </action>
    <action>Add a Change Log entry with date, version bump if applicable, and description: "Senior Developer Review notes appended".</action>
    <action>If {{update_status_on_result}} is true: update Status to {{status_on_approve}} when approved; to {{status_on_changes_requested}} when changes requested; otherwise leave unchanged.</action>
    <action>Save the story file.</action>
  </step>

  <step n="7.5" goal="Update sprint-status based on review outcome">
    <action>Determine target status based on review outcome:
      - If {{outcome}} == "Approve" → target_status = "done"
      - If {{outcome}} == "Changes Requested" → target_status = "in-progress"
      - If {{outcome}} == "Blocked" → target_status = "review" (stay in review)
    </action>

    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: update_story_status</param>
      <param>story_key: {{story_key}}</param>
      <param>new_status: {{target_status}}</param>
      <param>validate: true</param>
    </invoke-workflow>

    <check if="{{result_success}} == true">
      <output>✅ Sprint status updated: {{result_old_status}} → {{result_new_status}}</output>
    </check>

    <check if="{{result_success}} == false">
      <output>⚠️ Could not update sprint-status: {{result_error}}

Review was saved to story file, but sprint-status.yaml may be out of sync.
      </output>
    </check>
  </step>

  <step n="8" goal="Persist action items to tasks/backlog/epic">
    <action>Normalize Action Items into a structured list: description, severity (High/Med/Low), type (Bug/TechDebt/Enhancement), suggested owner (if known), related AC/file references.</action>
    <action if="{{persist_action_items}} == true and 'story_tasks' in {{persist_targets}}">
      Append under the story's "Tasks / Subtasks" a new subsection titled "Review Follow-ups (AI)", adding each item as an unchecked checkbox in imperative form, prefixed with "[AI-Review]" and severity. Example: "- [ ] [AI-Review][High] Add input validation on server route /api/x (AC #2)".
    </action>
    <ask optional="true" if="{{non_interactive}} == false">Confirm adding follow-ups into story Tasks/Subtasks. Proceed?</ask>
    <action if="{{persist_action_items}} == true and 'backlog_file' in {{persist_targets}}">
      If {{backlog_file}} does not exist, copy {installed_path}/backlog_template.md to {{backlog_file}} location.
      Append a row per action item with Date={{date}}, Story={{epic_num}}.{{story_num}}, Epic={{epic_num}}, Type, Severity, Owner (or "TBD"), Status="Open", Notes with short context and file refs.
    </action>
    <action if="{{persist_action_items}} == true and ('epic_followups' in {{persist_targets}} or {{update_epic_followups}} == true)">
      If an epic Tech Spec was found: open it and create (if missing) a section titled "{{epic_followups_section_title}}". Append a bullet list of action items scoped to this epic with references back to Story {{epic_num}}.{{story_num}}.
    </action>
    <action>Save modified files.</action>
    <action>Optionally invoke tests or linters to verify quick fixes if any were applied as part of review (requires user approval for any dependency changes).</action>
  </step>

  <step n="9" goal="Validation and completion">
    <invoke-task>Run validation checklist at {installed_path}/checklist.md using {project-root}/bmad/core/tasks/validate-workflow.xml</invoke-task>
    <action>Report workflow completion.</action>
    <output>**✅ Story Review Complete, {user_name}!**

**Story Details:**
- Story: {{epic_num}}.{{story_num}}
- Story Key: {{story_key}}
- Review Outcome: {{outcome}}
- Sprint Status: {{result_new_status}}
- Action Items: {{action_item_count}}

**Next Steps:**
1. Review the Senior Developer Review notes appended to story
2. If approved: Story is marked done, continue with next story
3. If changes requested: Address action items and re-run `dev-story`
4. If blocked: Resolve blockers before proceeding
    </output>
  </step>

</workflow>
```
