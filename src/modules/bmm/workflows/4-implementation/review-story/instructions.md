# Senior Developer Review - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow performs a Senior Developer Review on a story with status "review", appends structured review notes, and updates the story status based on outcome.</critical>
<critical>If story_path is provided, use it. Otherwise, find the first story in sprint-status.yaml with status "review". If none found, HALT and ask for clarification.</critical>
<critical>Only modify the story file in these areas: Status, Dev Agent Record (Completion Notes), File List (if corrections needed), Change Log, and the appended "Senior Developer Review (AI)" section.</critical>
<critical>Execute ALL steps in exact order; do NOT skip steps</critical>

<critical>DOCUMENT OUTPUT: Technical review reports. Structured findings with severity levels and action items. User skill level ({user_skill_level}) affects conversation style ONLY, not review content.</critical>

<workflow>

  <step n="1" goal="Find story ready for review" tag="sprint-status">
    <check if="{{story_path}} is provided">
      <action>Use {{story_path}} directly</action>
      <action>Read COMPLETE story file and parse sections</action>
      <action>Extract story_key from filename or story metadata</action>
      <action>Verify Status is "review" - if not, HALT with message: "Story status must be 'review' to proceed"</action>
    </check>

    <check if="{{story_path}} is NOT provided">
      <critical>MUST read COMPLETE sprint-status.yaml file from start to end to preserve order</critical>
      <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
      <action>Read ALL lines from beginning to end - do not skip any content</action>
      <action>Parse the development_status section completely</action>

      <action>Find FIRST story (reading in order from top to bottom) where:
        - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
        - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
        - Status value equals "review"
      </action>

      <check if="no story with status 'review' found">
        <output>📋 No stories with status "review" found

**Next Steps:**
1. Run `dev-story` to implement and mark a story ready for review
2. Check sprint-status.yaml for current story states
        </output>
        <action>HALT</action>
      </check>

      <action>Use the first story found with status "review"</action>
      <action>Resolve story file path in {{story_dir}}</action>
      <action>Read the COMPLETE story file</action>
    </check>

    <action>Extract {{epic_num}} and {{story_num}} from filename (e.g., story-2.3.*.md) and story metadata</action>
    <action>Parse sections: Status, Story, Acceptance Criteria, Tasks/Subtasks (and completion states), Dev Notes, Dev Agent Record (Context Reference, Completion Notes, File List), Change Log</action>
    <action if="story cannot be read">HALT with message: "Unable to read story file"</action>
  </step>

  <step n="2" goal="Resolve story context file and specification inputs">
    <action>Locate story context file: Under Dev Agent Record → Context Reference, read referenced path(s). If missing, search {{output_folder}} for files matching pattern "story-{{epic_num}}.{{story_num}}*.context.md" and use the most recent.</action>
    <action if="no story context file found">Continue but record a WARNING in review notes: "No story context file found"</action>

    <action>Locate Epic Tech Spec: Search {{tech_spec_search_dir}} with glob {{tech_spec_glob_template}} (resolve {{epic_num}})</action>
    <action if="no tech spec found">Continue but record a WARNING in review notes: "No Tech Spec found for epic {{epic_num}}"</action>

    <action>Load architecture/standards docs: For each file name in {{arch_docs_file_names}} within {{arch_docs_search_dirs}}, read if exists. Collect testing, coding standards, security, and architectural patterns.</action>
  </step>

  <step n="3" goal="Detect tech stack and establish best-practice reference set">
    <action>Detect primary ecosystem(s) by scanning for manifests (e.g., package.json, pyproject.toml, go.mod, Dockerfile). Record key frameworks (e.g., Node/Express, React/Vue, Python/FastAPI, etc.).</action>
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

  <step n="8" goal="Update sprint status based on review outcome" tag="sprint-status">
    <action>Determine target status based on review outcome:
      - If {{outcome}} == "Approve" → target_status = "done"
      - If {{outcome}} == "Changes Requested" → target_status = "in-progress"
      - If {{outcome}} == "Blocked" → target_status = "review" (stay in review)
    </action>

    <action>Load the FULL file: {{output_folder}}/sprint-status.yaml</action>
    <action>Read all development_status entries to find {{story_key}}</action>
    <action>Verify current status is "review" (expected previous state)</action>
    <action>Update development_status[{{story_key}}] = {{target_status}}</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

    <check if="update successful">
      <output>✅ Sprint status updated: review → {{target_status}}</output>
    </check>

    <check if="story key not found">
      <output>⚠️ Could not update sprint-status: {{story_key}} not found

Review was saved to story file, but sprint-status.yaml may be out of sync.
      </output>
    </check>
  </step>

  <step n="9" goal="Persist action items to tasks/backlog/epic">
    <action>Normalize Action Items into a structured list: description, severity (High/Med/Low), type (Bug/TechDebt/Enhancement), suggested owner (if known), related AC/file references.</action>
    <ask if="action items exist and 'story_tasks' in {{persist_targets}}">Add {{action_item_count}} follow-up items to story Tasks/Subtasks?</ask>
    <action if="user confirms or no ask needed">
      Append under the story's "Tasks / Subtasks" a new subsection titled "Review Follow-ups (AI)", adding each item as an unchecked checkbox in imperative form, prefixed with "[AI-Review]" and severity. Example: "- [ ] [AI-Review][High] Add input validation on server route /api/x (AC #2)".
    </action>
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

  <step n="10" goal="Validation and completion">
    <invoke-task>Run validation checklist at {installed_path}/checklist.md using {project-root}/bmad/core/tasks/validate-workflow.xml</invoke-task>
    <action>Report workflow completion.</action>
    <output>**✅ Story Review Complete, {user_name}!**

**Story Details:**
- Story: {{epic_num}}.{{story_num}}
- Story Key: {{story_key}}
- Review Outcome: {{outcome}}
- Sprint Status: {{target_status}}
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
