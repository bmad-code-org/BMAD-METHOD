# Create Story - Workflow Instructions (Spec-compliant, non-interactive by default)

````xml
<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow creates or updates the next user story from epics/PRD and architecture context, saving to the configured stories directory and optionally invoking Story Context.</critical>
<critical>DOCUMENT OUTPUT: Concise, technical, actionable story specifications. Use tables/lists for acceptance criteria and tasks.</critical>

<workflow>

  <step n="1" goal="Load config and initialize">
    <action>Resolve variables from config_source: story_dir (sprint_artifacts), output_folder, user_name, communication_language. If story_dir missing → ASK user to provide a stories directory and update variable.</action>
    <action>Create {{story_dir}} if it does not exist</action>
    <action>Resolve installed component paths from workflow.yaml: template, instructions, validation</action>
    <action>Load architecture/standards docs: For each file name in {{arch_docs_file_names}} within {{arch_docs_search_dirs}}, read if exists. Collect testing, coding standards, security, and architectural patterns.</action>
  </step>

  <step n="1.5" goal="Discover and load project documents">
    <invoke-protocol name="discover_inputs" />
    <note>After discovery, these content variables are available: {prd_content}, {tech_spec_content}, {architecture_content}, {ux_design_content}, {epics_content}, {document_project_content}</note>
  </step>

  <step n="2" goal="Discover previous story context">
    <critical>PREVIOUS STORY CONTINUITY: Essential for maintaining context and learning from prior development</critical>

    <action>Find the previous completed story to extract dev agent learnings and review findings:
      1. Load {{output_folder}}/sprint-status.yaml COMPLETELY
      2. Find current {{story_key}} in development_status section
      3. Identify the story entry IMMEDIATELY ABOVE current story (previous row in file order)
      4. If previous story exists:
         - Extract {{previous_story_key}}
         - Check previous story status (done, in-progress, review, etc.)
         - If status is "done", "review", or "in-progress" (has some completion):
           * Construct path: {{story_dir}}/{{previous_story_key}}.md
           * Load the COMPLETE previous story file
           * Parse ALL sections comprehensively:

             A) Dev Agent Record → Completion Notes List:
                - New patterns/services created (to reuse, not recreate)
                - Architectural deviations or decisions made
                - Technical debt deferred to future stories
                - Warnings or recommendations for next story
                - Interfaces/methods created for reuse

             B) Dev Agent Record → Debug Log References:
                - Issues encountered and solutions
                - Gotchas or unexpected challenges
                - Workarounds applied

             C) Dev Agent Record → File List:
                - Files created (NEW) - understand new capabilities
                - Files modified (MODIFIED) - track evolving components
                - Files deleted (DELETED) - removed functionality

             D) Dev Notes:
                - Any "future story" notes or TODOs
                - Patterns established
                - Constraints discovered

             E) Senior Developer Review (AI) section (if present):
                - Review outcome (Approve/Changes Requested/Blocked)
                - Unresolved action items (unchecked [ ] items)
                - Key findings that might affect this story
                - Architectural concerns raised

             F) Senior Developer Review → Action Items (if present):
                - Check for unchecked [ ] items still pending
                - Note any systemic issues that apply to multiple stories

             G) Review Follow-ups (AI) tasks (if present):
                - Check for unchecked [ ] review tasks still pending
                - Determine if they're epic-wide concerns

             H) Story Status:
                - If "review" or "in-progress" - incomplete, note what's pending
                - If "done" - confirmed complete
           * Store ALL findings as {{previous_story_learnings}} with structure:
             - new_files: [list]
             - modified_files: [list]
             - new_services: [list with descriptions]
             - architectural_decisions: [list]
             - technical_debt: [list]
             - warnings_for_next: [list]
             - review_findings: [list if review exists]
             - pending_items: [list of unchecked action items]
         - If status is "backlog" or "drafted":
           * Set {{previous_story_learnings}} = "Previous story not yet implemented"
      5. If no previous story exists (first story in epic):
         - Set {{previous_story_learnings}} = "First story in epic - no predecessor context"
    </action>

    <action>If {{tech_spec_file}} empty: derive from {{tech_spec_glob_template}} with {{epic_num}} and search {{tech_spec_search_dir}} recursively. If multiple, pick most recent by modified time.</action>
    <action>Build a prioritized document set for this epic - search and load from {input_file_patterns} list of potential locations:
      1) tech_spec_file (epic-scoped)
      2) epics_file (acceptance criteria and breakdown) the specific epic the story will be part of
      3) prd_file (business requirements and constraints) whole or sharded
      4) architecture_file (architecture constraints) whole or sharded
    </action>
    <action>READ COMPLETE FILES for all items found in the prioritized set. Store content and paths for citation.</action>
  </step>

  <step n="3" goal="Find next backlog story to draft" tag="sprint-status">
    <critical>MUST read COMPLETE {sprint_status} file from start to end to preserve order</critical>
    <action>Read ALL lines from beginning to end - do not skip any content</action>
    <action>Parse the development_status section completely to understand story order</action>

    <action>Find the FIRST story (by reading in order from top to bottom) where:
      - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
      - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
      - Status value equals "backlog"
    </action>

    <check if="no backlog story found">
      <output>📋 No backlog stories found in sprint-status.yaml

        All stories are either already drafted or completed.

        **Options:**
        1. Run sprint-planning to refresh story tracking
        2. Load PM agent and run correct-course to add more stories
        3. Check if current sprint is complete
      </output>
      <action>HALT</action>
    </check>

    <action>Extract from found story key (e.g., "1-2-user-authentication"):
      - epic_num: first number before dash (e.g., "1")
      - story_num: second number after first dash (e.g., "2")
      - story_title: remainder after second dash (e.g., "user-authentication")
    </action>
    <action>Set {{story_id}} = "{{epic_num}}.{{story_num}}"</action>
    <action>Store story_key for later use (e.g., "1-2-user-authentication")</action>

    <action>Verify story is enumerated in {{epics_file}}. If not found, HALT with message:</action>
    <action>"Story {{story_key}} not found in epics.md. Please load PM agent and run correct-course to sync epics, then rerun create-story."</action>

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
    <action>Review {{previous_story_learnings}} and extract actionable intelligence:
      - New patterns/services created → Note for reuse (DO NOT recreate)
      - Architectural deviations → Understand and maintain consistency
      - Technical debt items → Assess if this story should address them
      - Files modified → Understand current state of evolving components
      - Warnings/recommendations → Apply to this story's approach
      - Review findings → Learn from issues found in previous story
      - Pending action items → Determine if epic-wide concerns affect this story
    </action>

    <action>If unified-project-structure.md present: align expected file paths, module names, and component locations; note any potential conflicts.</action>

    <action>Cross-reference {{previous_story_learnings}}.new_files with project structure to understand where new capabilities are located.</action>

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

    <action>If {{previous_story_learnings}} contains actionable items (not "First story" or "not yet implemented"):
      - Add "Learnings from Previous Story" subsection to Dev Notes
      - Include relevant completion notes, new files/patterns, deviations
      - Cite previous story file as reference [Source: stories/{{previous_story_key}}.md]
      - Highlight interfaces/services to REUSE (not recreate)
      - Note any technical debt to address in this story
      - List pending review items that affect this story (if any)
      - Reference specific files created: "Use {{file_path}} for {{purpose}}"
      - Format example:
        ```
        ### Learnings from Previous Story

        **From Story {{previous_story_key}} (Status: {{previous_status}})**

        - **New Service Created**: `AuthService` base class available at `src/services/AuthService.js` - use `AuthService.register()` method
        - **Architectural Change**: Switched from session-based to JWT authentication
        - **Schema Changes**: User model now includes `passwordHash` field, migration applied
        - **Technical Debt**: Email verification skipped, should be included in this or subsequent story
        - **Testing Setup**: Auth test suite initialized at `tests/integration/auth.test.js` - follow patterns established there
        - **Pending Review Items**: Rate limiting mentioned in review - consider for this story

        [Source: stories/{{previous_story_key}}.md#Dev-Agent-Record]
        ```
    </action>

    <template-output file="{default_output_file}">change_log</template-output>
  </step>

  <step n="8" goal="Validate, save, and mark story drafted" tag="sprint-status">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using .bmad/core/tasks/validate-workflow.xml</invoke-task>
    <action>Save document unconditionally (non-interactive default). In interactive mode, allow user confirmation.</action>

    <!-- Mark story as drafted in sprint status -->
    <action>Update {{output_folder}}/sprint-status.yaml</action>
    <action>Load the FULL file and read all development_status entries</action>
    <action>Find development_status key matching {{story_key}}</action>
    <action>Verify current status is "backlog" (expected previous state)</action>
    <action>Update development_status[{{story_key}}] = "drafted"</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

    <check if="story key not found in file">
      <output>⚠️ Could not update story status: {{story_key}} not found in sprint-status.yaml

Story file was created successfully, but sprint-status.yaml was not updated.
You may need to run sprint-planning to refresh tracking, or manually set the story row status to `drafted`.
      </output>
    </check>

    <action>Report created/updated story path</action>
    <output>**✅ Story Created Successfully, {user_name}!**

**Story Details:**

- Story ID: {{story_id}}
- Story Key: {{story_key}}
- File: {{story_file}}
- Status: drafted (was backlog)

**⚠️ Important:** The following workflows are context-intensive. It's recommended to clear context and restart the SM agent before running the next command.

**Next Steps:**

1. Review the drafted story in {{story_file}}
2. **[RECOMMENDED]** Run `story-context` to generate technical context XML and mark story ready for development (combines context + ready in one step)
3. Or run `story-ready` to manually mark the story ready without generating technical context
    </output>
  </step>

</workflow>
````
