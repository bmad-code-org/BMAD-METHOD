# Create Story - Workflow Instructions (Spec-compliant, non-interactive by default)

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow creates or updates the next user story from epics/PRD and architecture context, saving to the configured stories directory and optionally invoking Story Context.</critical>
<critical>Default execution mode: #yolo (minimal prompts). Only elicit if absolutely required and {{non_interactive}} == false.</critical>

<critical>DOCUMENT OUTPUT: Concise, technical, actionable story specifications. Use tables/lists for acceptance criteria and tasks. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>

<workflow>

  <step n="1" goal="Load config and initialize">
    <action>Resolve variables from config_source: story_dir (dev_story_location), output_folder, user_name, communication_language. If story_dir missing and {{non_interactive}} == false → ASK user to provide a stories directory and update variable. If {{non_interactive}} == true and missing, HALT with a clear message.</action>
    <action>Create {{story_dir}} if it does not exist</action>
    <action>Resolve installed component paths from workflow.yaml: template, instructions, validation</action>
    <action>Resolve recommended inputs if present: epics_file, prd_file, solution-architecture_file</action>
  </step>

  <step n="2" goal="Discover and load source documents">
    <action>If {{tech_spec_file}} empty: derive from {{tech_spec_glob_template}} with {{epic_num}} and search {{tech_spec_search_dir}} recursively. If multiple, pick most recent by modified time.</action>
    <action>Build a prioritized document set for this epic:
      1) tech_spec_file (epic-scoped)
      2) epics_file (acceptance criteria and breakdown)
      3) prd_file (business requirements and constraints)
      4) solution-architecture_file (architecture constraints)
      5) Architecture docs under docs/ and output_folder/: tech-stack.md, unified-project-structure.md, coding-standards.md, testing-strategy.md, backend-architecture.md, frontend-architecture.md, data-models.md, database-schema.md, rest-api-spec.md, external-apis.md (include if present)
    </action>
    <action>READ COMPLETE FILES for all items found in the prioritized set. Store content and paths for citation.</action>
  </step>

  <step n="2.5" goal="Get story to draft from status file">
    <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
      <param>mode: data</param>
      <param>data_request: next_story</param>
    </invoke-workflow>

    <check if="status_exists == true AND todo_story_id != ''">
      <action>Use extracted story information:</action>
      - {{todo_story_id}}: The story ID to draft
      - {{todo_story_title}}: The story title
      - {{todo_story_file}}: The exact story file path to create

      <critical>This is the PRIMARY source - DO NOT search or guess</critical>

      <action>Set {{story_path}} = {story_dir}/{{todo_story_file}}</action>
      <action>Skip legacy discovery in Step 3</action>
    </check>

    <check if="status_exists == false OR todo_story_id == ''">
      <action>Fall back to legacy story discovery in Step 3</action>
    </check>
  </step>

  <step n="3" goal="Determine target story (do not prompt in #yolo)">
    <action>List existing story markdown files in {{story_dir}} matching pattern: "story-<epic>.<story>.md"</action>
    <check>If none found → Set {{epic_num}}=1 and {{story_num}}=1</check>
    <check>If files found → Parse epic_num and story_num; pick the highest pair</check>
    <action>Open the latest story (if exists) and read Status</action>
    <check>If Status != Done/Approved and {{non_interactive}} == true → TARGET the latest story for update (do not create a new one)</check>
    <check>If Status == Done/Approved → Candidate next story is {{epic_num}}.{{story_num+1}}</check>
    <action>If creating a new story candidate: VERIFY planning in {{epics_file}}. Confirm that epic {{epic_num}} explicitly enumerates a next story matching {{story_num+1}} (or an equivalent next planned story entry). If epics.md is missing or does not enumerate another story for this epic, HALT with message:</action>
    <action>"No planned next story found in epics.md for epic {{epic_num}}. Please load either PM (Product Manager) agent at {project-root}/bmad/bmm/agents/pm.md or SM (Scrum Master) agent at {project-root}/bmad/bmm/agents/sm.md and run `*correct-course` to add/modify epic stories, then rerun create-story."</action>
    <check>If verification passes → Set {{story_num}} = {{story_num}} + 1</check>
    <ask optional="true" if="{{non_interactive}} == false">If starting a new epic and {{non_interactive}} == false, ASK for {{epic_num}} and reset {{story_num}} to 1. In {{non_interactive}} == true, do NOT auto-advance epic; stay within current epic and continue incrementing story_num.</ask>
  </step>

  <step n="4" goal="Extract requirements and derive story statement">
    <action>From tech_spec_file (preferred) or epics_file: extract epic {{epic_num}} title/summary, acceptance criteria for the next story, and any component references. If not present, fall back to PRD sections mapping to this epic/story.</action>
    <action>From solution-architecture and architecture docs: extract constraints, patterns, component boundaries, and testing guidance relevant to the extracted ACs. ONLY capture information that directly informs implementation of this story.</action>
    <action>Derive a clear user story statement (role, action, benefit) grounded strictly in the above sources. If ambiguous and {{non_interactive}} == false → ASK user to clarify. If {{non_interactive}} == true → generate the best grounded statement WITHOUT inventing domain facts.</action>
    <template-output file="{default_output_file}">requirements_context_summary</template-output>
  </step>

  <step n="5" goal="Project structure alignment and lessons learned">
    <action>If a previous story exists, scan its "Dev Agent Record" for completion notes and known deviations; summarize any carry-overs relevant to this story.</action>
    <action>If unified-project-structure.md present: align expected file paths, module names, and component locations; note any potential conflicts.</action>
    <template-output file="{default_output_file}">structure_alignment_summary</template-output>
  </step>

  <step n="6" goal="Assemble acceptance criteria and tasks">
    <action>Assemble acceptance criteria list from tech_spec or epics. If gaps exist, derive minimal, testable criteria from PRD verbatim phrasing (NO invention).</action>
    <action>Create tasks/subtasks directly mapped to ACs. Include explicit testing subtasks per testing-strategy and existing tests framework. Cite architecture/source documents for any technical mandates.</action>
    <template-output file="{default_output_file}">acceptance_criteria</template-output>
    <template-output file="{default_output_file}">tasks_subtasks</template-output>
  </step>

  <step n="7" goal="Create or update story document">
    <action>Resolve output path: {default_output_file} using current {{epic_num}} and {{story_num}}. If targeting an existing story for update, use its path.</action>
    <action>Initialize from template.md if creating a new file; otherwise load existing file for edit.</action>
    <action>Compute a concise story_title from epic/story context; if missing, synthesize from PRD feature name and epic number.</action>
    <template-output file="{default_output_file}">story_header</template-output>
    <template-output file="{default_output_file}">story_body</template-output>
    <template-output file="{default_output_file}">dev_notes_with_citations</template-output>
    <template-output file="{default_output_file}">change_log</template-output>
  </step>

  <step n="8" goal="Validate, save, and optionally generate context">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using bmad/core/tasks/validate-workflow.xml</invoke-task>
    <action>Save document unconditionally (non-interactive default). In interactive mode, allow user confirmation.</action>
    <check>If {{auto_run_context}} == true → <invoke-workflow path="{project-root}/bmad/bmm/workflows/4-implementation/story-context/workflow.yaml">Pass {{story_path}} = {default_output_file}</invoke-workflow></check>
    <action>Report created/updated story path</action>
  </step>

  <step n="9" goal="Update status file on completion">
    <action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
    <action>Find the most recent file (by date in filename)</action>

    <check if="status file exists">
      <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
        <param>mode: update</param>
        <param>action: set_current_workflow</param>
        <param>workflow_name: create-story</param>
      </invoke-workflow>

      <check if="success == true">
        <output>✅ Status updated: Story {{story_id}} drafted</output>
      </check>

      <output>**✅ Story Created Successfully, {user_name}!**

**Story Details:**
- Story ID: {{story_id}}
- File: {{story_file}}
- Status: Draft (needs review)

**Status file updated:**
- Current step: create-story (Story {{story_id}}) ✓
- Progress: {{new_progress_percentage}}%

**Next Steps:**
1. Review the drafted story in {{story_file}}
2. When satisfied, run `story-ready` to approve for development
3. Or edit the story file and re-run `create-story` to update

Check status anytime with: `workflow-status`
      </output>
    </check>

    <check if="status file not found">
      <output>**✅ Story Created Successfully, {user_name}!**

**Story Details:**
- Story ID: {{story_id}}
- File: {{story_file}}
- Status: Draft

Note: Running in standalone mode (no status file).

To track progress across workflows, run `workflow-status` first.
      </output>
    </check>
  </step>

</workflow>
```
