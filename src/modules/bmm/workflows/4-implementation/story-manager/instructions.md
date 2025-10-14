# Story Manager Workflow Instructions

<workflow>

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/4-implementation/story-manager/workflow.yaml</critical>
<critical>This workflow maintains documentation currency for AI agent teams. Outdated docs cause hallucination and stale training data usage.</critical>

<step n="0" goal="Initialize and detect resume state">

<action>Scan {story_dir} for stories with workflow_status: "draft" or "in-progress"</action>

<check if="in-progress story found">
  <action>Display found story: "Found in-progress Story {{epic_num}}.{{story_num}}: {{story_title}}"</action>
  <ask>Story creation in progress. Choose action:
  [r] Resume from last checkpoint
  [a] Abandon and start new story
  [c] Cancel
  </ask>

  <check if="user chooses 'r' or 'resume'">
    <action>Load story document and extract checkpoint_state metadata</action>
    <action>Parse last_checkpoint to determine which step to resume from</action>
    <action>Load all variables from story document metadata</action>
    <goto step="{{checkpoint_state}}">Resume from checkpoint</goto>
  </check>

  <check if="user chooses 'a' or 'abandon'">
    <action>Update abandoned story status to "abandoned"</action>
    <action>Add note: "Abandoned {{date}} - New story started"</action>
    <action>Continue to Step 1 for new story</action>
  </check>

  <check if="user chooses 'c' or 'cancel'">
    <action>Exit workflow</action>
  </check>
</check>

<check if="no in-progress story found">
  <action>Proceed to Step 1 for new story creation</action>
</check>

</step>

<step n="1" goal="Determine input mode and gather requirements">

<ask>Story creation mode:

1. Creation Mode - Build story from scratch with interactive requirements gathering
2. Review-Based Mode - Extract requirements from senior dev review or backlog recommendation

Which mode? (1 or 2)
</ask>

<check if="mode == 1 or mode == 'creation'">
  <action>Set workflow_mode = "Creation Mode"</action>

<ask>What epic does this story belong to? (Enter epic number)</ask>
<action>Store as epic_num</action>

<ask>What is the story about? Describe the discovered need, technical debt, or new requirement.</ask>
<action>Store as story_requirements</action>

<ask>Why is this story needed? (e.g., "Performance issue discovered during testing", "New accessibility requirement", "Architecture debt from Sprint 3")</ask>
<action>Store as story_origin_rationale</action>

<action>Set review_source_reference = ""</action>
</check>

<check if="mode == 2 or mode == 'review-based'">
  <action>Set workflow_mode = "Review-Based Mode"</action>

<ask>Provide the path to the review document or paste the review content:</ask>
<action>Load review content</action>

<action>Analyze review content to extract:

- Epic number (if mentioned)
- Story requirements
- Rationale for new story
- Recommended follow-up actions
  </action>

<action>Store extracted information:

- epic_num (or ask if not found)
- story_requirements
- story_origin_rationale
- review_source_reference (path or "Inline review content")
  </action>
  </check>

<template-output>workflow_mode, epic_num, story_requirements, story_origin_rationale, review_source_reference</template-output>

</step>

<step n="1.5" goal="Verify required documents and prompt for missing">

<action>Check for required documentation files:</action>

<action>Check if epic document exists:

- Try: {epics_file}
- Try: {output_folder}/epic-{{epic_num}}.md
- Try: {output_folder}/epics/epic-{{epic_num}}.md
  </action>

<check if="epic document not found">
  <action>Warn user: "⚠️  Epic document not found for Epic {{epic_num}}"</action>
  <ask>Epic document is required for this workflow. Options:
  1. Provide path to epic document
  2. Create epic document now
  3. Cancel workflow

Choose option (1/2/3):</ask>

  <check if="option 1">
    <ask>Enter path to epic document:</ask>
    <action>Validate path exists</action>
    <action>Load epic document</action>
  </check>

  <check if="option 2">
    <action>Guide user to create minimal epic:
    "I'll help you create a minimal epic document to proceed.

    What is the epic title/goal?"
    </action>
    <action>Create basic epic document at {output_folder}/epic-{{epic_num}}.md</action>

  </check>

  <check if="option 3">
    <action>Exit workflow with message: "Epic document required. Workflow cancelled."</action>
  </check>
</check>

<action>Check if PRD exists: {prd_file}</action>

<check if="PRD not found">
  <action>Warn user: "⚠️  PRD document not found at {prd_file}"</action>
  <ask>PRD is important for traceability. Options:
  1. Provide path to PRD
  2. Continue without PRD (traceability limited)
  3. Cancel workflow

Choose option (1/2/3):</ask>

  <check if="option 1">
    <ask>Enter path to PRD:</ask>
    <action>Validate path exists</action>
    <action>Store PRD path</action>
  </check>

  <check if="option 2">
    <action>Set prd_file = "" (no PRD available)</action>
    <action>Note in story: "PRD not available - limited traceability"</action>
  </check>

  <check if="option 3">
    <action>Exit workflow</action>
  </check>
</check>

<action>Check if solution-architecture.md exists: {solution_architecture_file}</action>

<check if="solution-architecture.md not found">
  <action>Warn user: "⚠️  solution-architecture.md not found at {solution_architecture_file}"</action>
  <ask>solution-architecture.md tracks architectural decisions. Options:
  1. Provide path to architecture document
  2. Continue without (architectural impact won't be tracked)
  3. Cancel workflow

Choose option (1/2/3):</ask>

  <check if="option 1">
    <ask>Enter path to architecture document:</ask>
    <action>Validate path exists</action>
    <action>Store architecture file path</action>
  </check>

  <check if="option 2">
    <action>Set solution_architecture_file = "" (no architecture doc)</action>
    <action>Note in story: "Architecture document not available"</action>
  </check>

  <check if="option 3">
    <action>Exit workflow</action>
  </check>
</check>

<action>Check if ux-specification.md exists: {ux_specification_file}</action>

<check if="ux-specification.md not found">
  <action>Note: "ℹ️  ux-specification.md not found (optional document)"</action>
  <action>Set ux_specification_file = "" (UX doc optional)</action>
</check>

<action>Summary of available documents:
✓ Epic: {{epic_file_path}}
{{prd_status}} PRD: {{prd_file_path}}
{{arch_status}} Architecture: {{solution_architecture_file_path}}
{{ux_status}} UX Spec: {{ux_specification_file_path}} (optional)
</action>

<template-output>epic_file_path, prd_file_path, solution_architecture_file_path, ux_specification_file_path</template-output>

</step>

<step n="2" goal="Analyze epic context and detect revision needs">

<action>Construct epic file path: {epics_file} or {output_folder}/epic-{{epic_num}}.md</action>
<action>Load and read complete epic document</action>

<action>Analyze epic in context of new story:

- What are the current epic goals?
- Does this story fit within existing epic scope?
- Does this story reveal changes needed to epic goals/scope?
- Are there any contradictions between story requirements and epic description?
  </action>

<ask>Based on epic analysis, does this story require epic revision?

Current Epic: {{epic_summary}}

New Story Requirements: {{story_requirements}}

Assessment:
[ ] No Change - Story fits perfectly within existing epic
[ ] Minor Update - Epic needs small adjustments (add story reference, clarify scope)
[ ] Major Revision - Epic goals/scope need significant updates due to discovery

Select option:</ask>

<check if="Major Revision selected">
  <action>Pause story creation to revise epic first</action>

<ask>What changes does the epic need? Describe:

- Goal adjustments
- Scope changes
- New context from discovery
  </ask>

<action>Create draft epic revisions based on input</action>

<ask>Review epic revisions. Approve? (y/n)</ask>

  <check if="approved">
    <action>Update epic document with revisions</action>
    <action>Add changelog entry: "Updated {{date}} - Epic revised due to Story {{epic_num}}.{{story_num}} discovery"</action>
  </check>

  <check if="not approved">
    <action>Refine epic revisions based on feedback</action>
    <action>Re-present for approval (loop until approved)</action>
  </check>

<action>Resume story creation with updated epic context</action>
</check>

<check if="Minor Update or No Change">
  <action>Note epic assessment for later update in Step 5</action>
</check>

<template-output>epic_analysis, epic_revision_needed</template-output>

</step>

<step n="3" goal="Create story document">

<action>Determine next story number:

- Scan {story_dir} for existing stories in epic {{epic_num}}
- Find highest story number: story-{{epic_num}}.X.md
- Increment: story_num = X + 1
  </action>

<action>Generate story content using template variables:

- epic_num (from Step 1)
- story_num (auto-incremented)
- story_title (generate from story_requirements)
- workflow_status = "draft"
- workflow_mode (from Step 1)
- story_origin_rationale (from Step 1)
- review_source_reference (from Step 1)
  </action>

<ask>Generate story title from requirements. Proposed title: "{{generated_title}}"

Approve or provide alternative:</ask>

<action>Create story document with user story format:

- Role: Infer from context or ask
- Action: Extract from requirements
- Benefit: Extract or infer from rationale
  </action>

<action>Generate acceptance criteria from requirements (3-5 specific, testable criteria)</action>

<ask>Review story draft:

{{story_draft}}

Approve story draft? (y/n/edit)</ask>

<check if="edit requested">
  <action>Gather specific edits from user</action>
  <action>Apply edits and re-present</action>
</check>

<action>Write story document to: {story_dir}/story-{{epic_num}}.{{story_num}}.md</action>

<action>Set checkpoint metadata:

- last_checkpoint = "Step 3 - Story Created"
- checkpoint_state = "3"
  </action>

<template-output>story_file_path, story_title, role, action, benefit, acceptance_criteria</template-output>

<critical>CHECKPOINT 1: Story document created. Workflow can resume from Step 4 if interrupted.</critical>

</step>

<step n="4" goal="Discover related stories">

<action>Search {story_dir} for related stories using:

- Keyword matching from story_requirements
- Epic relationships
- Similar acceptance criteria patterns
- Shared architecture components
  </action>

<action>For each potential match:

- Read story document
- Assess relevance (does it relate to new story?)
- Categorize relationship:
  - Depends on (new story requires this story)
  - Blocks (this story must complete before new story)
  - Related (similar domain/component)
  - Resolves (new story addresses issues from this story)
  - Supersedes (new story replaces this story)
    </action>

<action>Present findings:
Found {{count}} related stories:

1. Story X.Y - Relationship: {{type}} - Reason: {{why}}
2. Story A.B - Relationship: {{type}} - Reason: {{why}}
   ...
   </action>

<ask>Review related stories. Any to add or remove? (y/n)</ask>

<check if="user wants to modify">
  <action>Accept additions or removals</action>
</check>

<template-output>related_stories_list, related_stories_references</template-output>

</step>

<step n="5" goal="Update epic document">

<action>Load epic document again (may have been updated in Step 2)</action>

<action>Add story reference to epic:

- Find appropriate section (story list, backlog, or create new section)
- Add entry: "- Story {{epic_num}}.{{story_num}}: {{story_title}} (Status: Draft)"
  </action>

<check if="Minor Update needed from Step 2">
  <action>Apply minor epic adjustments identified in Step 2</action>
  <action>Add changelog: "Updated {{date}} - Added Story {{epic_num}}.{{story_num}}"</action>
</check>

<action>Save updated epic document</action>

<action>Update story document:

- parent_epic_reference = "Epic {{epic_num}}: {{epic_title}}"
- epic_updated = "x" (checked in completion checklist)
  </action>

<action>Set checkpoint metadata:

- last_checkpoint = "Step 5 - Epic Updated"
- checkpoint_state = "5"
  </action>

<template-output>epic_updated, parent_epic_reference</template-output>

<critical>CHECKPOINT 2: Epic updated. Workflow can resume from Step 6 if interrupted.</critical>

</step>

<step n="6" goal="Discover all project documentation">

<action>Scan {docs_dir} recursively for all documentation files:

- Use glob patterns: _.md, _.txt, \*.adoc (markdown, text, asciidoc)
- Exclude: node_modules, .git, build artifacts
- Build inventory with full paths
  </action>

<action>Extract documentation references from related stories:

- Read each related story from Step 4
- Find all [Source: ...] references
- Find all explicit doc mentions
- Add to inventory
  </action>

<action>Categorize discovered documentation:

**Core Documentation (Mandatory Assessment):**

- PRD.md
- solution-architecture.md
- ux-specification.md
- epics.md (already handled in Step 5)

**Discovered Documentation (Dynamic Assessment):**

- API documentation (api-spec.md, endpoints.md, etc.)
- Technical specifications (tech-spec-\*.md)
- Architecture Decision Records (adr-_.md, decisions/_)
- Testing documentation (test-plan.md, test-strategy.md)
- Database documentation (schema.md, migrations/\*)
- Deployment documentation (deployment.md, infrastructure\*.md)
- Security documentation (security\*.md)
- Performance documentation (performance\*.md)
- Integration guides (integration*.md, connectors/*)
- Component documentation (components/_, modules/_)
- Custom specifications (any other .md files)
  </action>

<action>Display inventory:
Discovered {{count}} documentation files:

Core (Mandatory):

1. PRD.md
2. solution-architecture.md
3. ux-specification.md

API & Integration: 4. api-specification.md 5. integration-guide.md
...

Architecture:
X. adr-001-database-choice.md
Y. adr-002-auth-strategy.md
...

(Full categorized list)
</action>

<ask>Review documentation inventory. Any files to exclude from assessment? (y/n)</ask>

<check if="user wants to exclude files">
  <action>Accept file exclusions with rationale</action>
  <action>Update inventory</action>
</check>

<template-output>all_docs_inventory</template-output>

</step>

<step n="7" goal="Assess and update all documentation">

<action>Initialize documentation update tracker</action>

<action>For each document in all_docs_inventory, perform intelligent assessment:</action>

<loop for-each="document in all_docs_inventory">

<action>Check if document exists and is accessible</action>

  <check if="document not accessible">
    <action>Skip document with note: "{{document_name}} - File not accessible, skipped"</action>
    <continue>Next document</continue>
  </check>

<action>Load document: {{document_path}}</action>

<action>Analyze story in context of document:

- Story Requirements: {{story_requirements}}
- Story Acceptance Criteria: {{acceptance_criteria}}
- Document Purpose: {{document_purpose}}
- Document Content Summary: {{document_summary}}
  </action>

<ask>Assessment for {{document_name}}:

Story: {{story_title}}
Requirements: {{story_requirements}}

Does this story impact {{document_name}}?

[ ] No - Story does not affect this document
[ ] Yes - Story requires updates to this document

If Yes, explain what needs updating:</ask>

  <check if="No impact">
    <action>Mark document as assessed, no update needed</action>
    <action>Update story checklist: [  ] {{document_name}} (Not applicable)</action>
  </check>

  <check if="Yes - Update needed">
    <action>Generate proposed updates for {{document_name}}:
    - What sections need changes?
    - What new content to add?
    - What references to story to include?
    </action>

    <action>Display proposed changes:

    === Proposed Updates for {{document_name}} ===

    {{proposed_changes}}

    ===
    </action>

    <ask>Approve updates for {{document_name}}? (y/n/edit)</ask>

    <check if="approved">
      <action>Apply updates to {{document_name}}</action>
      <action>Add changelog: "Updated {{date}} - Story {{epic_num}}.{{story_num}} impact"</action>
      <action>Update story checklist: [x] {{document_name}} (Updated)</action>
      <action>Add to story documentation_references: "- [Source: {{document_name}}#{{section}}]"</action>
    </check>

    <check if="edit requested">
      <action>Refine updates based on feedback</action>
      <action>Re-present for approval</action>
    </check>

    <action>Set checkpoint after this document:
    - last_checkpoint = "Step 7 - Updated {{document_name}}"
    - checkpoint_state = "7"
    </action>

    <critical>CHECKPOINT: {{document_name}} updated. Workflow can resume from next document if interrupted.</critical>

  </check>

</loop>

<action>Compile documentation update summary:

- Total documents assessed: {{count}}
- Documents updated: {{updated_count}}
- Documents not applicable: {{na_count}}
- List of all updated documents with changes made
  </action>

<ask>Review complete documentation update summary:

{{update_summary}}

All documentation assessments complete. Proceed? (y/n)</ask>

<check if="not approved">
  <action>Allow user to request specific document reassessment</action>
  <action>Re-run assessment for specified documents</action>
</check>

<template-output>documentation_updates_complete, discovered_docs_checklist, documentation_references</template-output>

<critical>CHECKPOINT 3: All documentation assessed and updated. Workflow can resume from Step 8 if interrupted.</critical>

</step>

<step n="8" goal="Cross-reference related stories">

<action>For each story in related_stories_list from Step 4:</action>

<loop for-each="related_story in related_stories_list">

<action>Load related story: {{related_story_path}}</action>

<action>Determine cross-reference type (from Step 4 assessment):

- "Resolved by Story {{epic_num}}.{{story_num}}: {{story_title}}"
- "Related to Story {{epic_num}}.{{story_num}}: {{story_title}}"
- "Blocks Story {{epic_num}}.{{story_num}}: {{story_title}}"
- "Superseded by Story {{epic_num}}.{{story_num}}: {{story_title}}"
  </action>

<action>Add cross-reference to related story:

- Find "## Related Stories" section (or create if missing)
- Add entry with relationship type and link
- Add update timestamp
  </action>

<action>Save updated related story</action>

<action>Update new story with reciprocal reference:

- Add to related_stories_references section
- Include relationship type
  </action>

</loop>

<action>Update story document with all cross-references</action>

<action>Update story checklist: All related stories updated</action>

<action>Set checkpoint metadata:

- last_checkpoint = "Step 8 - Cross-references Complete"
- checkpoint_state = "8"
  </action>

<template-output>cross_references_complete, related_stories_checklist</template-output>

<critical>CHECKPOINT 4: All cross-references complete. Workflow can resume from Step 9 if interrupted.</critical>

</step>

<step n="9" goal="Human-in-the-loop approval and atomic integrity verification">

<action>Compile complete change summary:

=== Story Manager Workflow - Changes Summary ===

**New Story Created:**

- Path: {{story_file_path}}
- Title: Story {{epic_num}}.{{story_num}}: {{story_title}}
- Mode: {{workflow_mode}}
- Rationale: {{story_origin_rationale}}

**Epic Updated:**

- Epic {{epic_num}} updated with story reference
- Epic revision: {{epic_revision_status}}

**Documentation Updated ({{updated_docs_count}} files):**
{{#each updated_doc}}

- {{doc_name}}: {{change_summary}}
  {{/each}}

**Related Stories Cross-Referenced ({{related_stories_count}} stories):**
{{#each related_story}}

- Story {{story_ref}}: {{relationship_type}}
  {{/each}}

**Atomic Integrity Status:**

- Story Created: ✓
- Epic Updated: ✓
- Core Documentation: {{core_docs_status}}
- Discovered Documentation: {{discovered_docs_status}}
- Cross-References: {{cross_ref_status}}

All updates complete: {{all_complete}}

===
</action>

<ask>Review all changes made by Story Manager workflow.

{{change_summary}}

**Atomic Integrity Check:**

- All required documentation updated?
- All cross-references in place?
- No partial states remaining?

Approve and finalize story? (y/n/review)

y - Approve and mark story complete
n - Request changes (workflow will pause for edits)
review - Review specific files before approval
</ask>

<check if="user chooses 'review'">
  <ask>Which file(s) would you like to review?</ask>
  <action>Display requested files</action>
  <action>Re-present approval prompt</action>
</check>

<check if="user chooses 'n'">
  <ask>What changes are needed? Specify:
  - File to modify
  - Change requested
  </ask>

<action>Apply requested changes</action>
<action>Update affected files</action>
<action>Re-compile change summary</action>
<action>Re-present for approval (loop until approved)</action>
</check>

<check if="user chooses 'y'">
  <action>Proceed to Step 10 for finalization</action>
</check>

<template-output>approval_granted</template-output>

</step>

<step n="10" goal="Finalize and confirm atomic integrity">

<action>Update story document final status:

- workflow_status = "complete"
- completion_date = {{date}}
- completed_by = {{user_name}}
- final_checkpoint = "Workflow Complete"
  </action>

<action>Verify atomic integrity one final time:

- All checkboxes in Documentation Update Checklist marked
- All related stories have reciprocal cross-references
- Epic contains story reference
- No draft or incomplete states remain
  </action>

<action>Add workflow completion metadata to story:

- Total documentation files updated: {{count}}
- Total related stories cross-referenced: {{count}}
- Workflow execution time: {{duration}}
- Checkpoints reached: {{checkpoint_count}}
  </action>

<action>Save final story document</action>

<action>Generate completion report:

=== Story Manager Workflow Complete ===

✓ Story {{epic_num}}.{{story_num}} created and integrated

**Summary:**

- Story File: {{story_file_path}}
- Epic: {{epic_num}} - Updated
- Documentation Updates: {{updated_count}} files
- Related Stories: {{cross_ref_count}} cross-referenced

**Atomic Integrity Confirmed:**
All documentation synchronized. AI agents have current, consistent project state.

**Next Steps:**

- Story ready for AI agent implementation
- All documentation reflects current requirements
- Traceability maintained from PRD through story

===
</action>

<action>Display completion report</action>

<template-output>workflow_complete</template-output>

</step>

</workflow>
