# Create Story - Workflow Instructions (Spec-compliant, non-interactive by default)

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow creates or updates the next user story from epics/PRD and architecture context, saving to the configured stories directory and optionally invoking Story Context.</critical>
<critical>DOCUMENT OUTPUT: Concise, technical, actionable story specifications. Use tables/lists for acceptance criteria and tasks.</critical>

<workflow>

  <step n="1" goal="Load config and initialize">
    <action>Resolve variables from config_source: story_dir (dev_story_location), output_folder, user_name, communication_language. If story_dir missing and {{non_interactive}} == false → ASK user to provide a stories directory and update variable. If {{non_interactive}} == true and missing, HALT with a clear message.</action>
    <action>Create {{story_dir}} if it does not exist</action>
    <action>Resolve installed component paths from workflow.yaml: template, instructions, validation</action>
    <action>Resolve recommended inputs if present: epics_file, prd_file, architecture_file</action>
  </step>

  <step n="2" goal="Discover and load source documents">
    <action>If {{tech_spec_file}} empty: derive from {{tech_spec_glob_template}} with {{epic_num}} and search {{tech_spec_search_dir}} recursively. If multiple, pick most recent by modified time.</action>
    <action>Build a prioritized document set for this epic:
      1) tech_spec_file (epic-scoped)
      2) epics_file (acceptance criteria and breakdown)
      3) prd_file (business requirements and constraints)
      4) architecture_file (architecture constraints)
      5) Architecture docs under docs/ and output_folder/: tech-stack.md, unified-project-structure.md, coding-standards.md, testing-strategy.md, backend-architecture.md, frontend-architecture.md, data-models.md, database-schema.md, rest-api-spec.md, external-apis.md (include if present)
    </action>
    <action>READ COMPLETE FILES for all items found in the prioritized set. Store content and paths for citation.</action>
  </step>

  <step n="3" goal="Determine target story from sprint status">
    <action>Query sprint-status for next backlog story:</action>

    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: get_next_story</param>
      <param>filter_status: backlog</param>
    </invoke-workflow>

    <check if="{{result_found}} == false">
      <output>📋 No backlog stories found in sprint-status.yaml

All stories are either already drafted or completed.

**Options:**
1. Run sprint-planning to refresh story tracking
2. Load PM agent and run correct-course to add more stories
3. Check if current sprint is complete
      </output>
      <action>HALT</action>
    </check>

    <action>Parse {{result_story_key}} to extract epic_num, story_num, and story_title
      Example: "1-2-user-authentication" → epic_num=1, story_num=2, title="user-authentication"
    </action>
    <action>Set {{story_id}} = "{{epic_num}}.{{story_num}}"</action>

    <action>Verify story is enumerated in {{epics_file}}. If not found, HALT with message:</action>
    <action>"Story {{result_story_key}} not found in epics.md. Please load PM agent and run correct-course to sync epics, then rerun create-story."</action>

    <action>Check if story file already exists at expected path in {{story_dir}}</action>
    <check if="story file exists">
      <output>ℹ️ Story file already exists: {{story_file_path}}

Will update existing story file rather than creating new one.
      </output>
      <action>Set update_mode = true</action>
    </check>
  </step>

  <step n="4" goal="Extract requirements and derive story statement">
    <action>From tech_spec_file (preferred) or epics_file: extract epic {{epic_num}} title/summary, acceptance criteria for the next story, and any component references. If not present, fall back to PRD sections mapping to this epic/story.</action>
    <action>From architecture and architecture docs: extract constraints, patterns, component boundaries, and testing guidance relevant to the extracted ACs. ONLY capture information that directly informs implementation of this story.</action>
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

    <invoke-workflow path="{project-root}/bmad/bmm/workflows/helpers/sprint-status">
      <param>action: update_story_status</param>
      <param>story_key: {{result_story_key}}</param>
      <param>new_status: drafted</param>
      <param>validate: true</param>
    </invoke-workflow>

    <check if="{{result_success}} == false">
      <output>⚠️ Could not update story status: {{result_error}}

Story file was created successfully, but sprint-status.yaml was not updated.
You may need to run sprint-planning to refresh tracking.
      </output>
    </check>

    <check>If {{auto_run_context}} == true → <invoke-workflow path="{project-root}/bmad/bmm/workflows/4-implementation/story-context/workflow.yaml">Pass {{story_path}} = {default_output_file}</invoke-workflow></check>
    <action>Report created/updated story path</action>
    <output>**✅ Story Created Successfully, {user_name}!**

**Story Details:**
- Story ID: {{story_id}}
- Story Key: {{result_story_key}}
- File: {{story_file}}
- Status: {{result_new_status}} (was {{result_old_status}})

**Next Steps:**
1. Review the drafted story in {{story_file}}
2. When satisfied, run `story-ready` to approve for development
3. Or edit the story file and re-run `create-story` to update
    </output>
  </step>

</workflow>
```
