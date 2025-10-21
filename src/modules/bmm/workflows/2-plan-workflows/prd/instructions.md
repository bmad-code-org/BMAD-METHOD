# PRD Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow is for Level 2-4 projects. Level 0-1 use tech-spec workflow.</critical>
<critical>Produces TWO outputs: PRD.md (strategic) and epics.md (tactical implementation)</critical>
<critical>TECHNICAL NOTES: If ANY technical details, preferences, or constraints are mentioned during PRD discussions, append them to {technical_decisions_file}. If file doesn't exist, create it from {technical_decisions_template}</critical>

<critical>DOCUMENT OUTPUT: Concise, clear, actionable requirements. Use tables/lists over prose. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>

<workflow>

<step n="0" goal="Validate workflow and extract project configuration">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>**⚠️ No Workflow Status File Found**

The PRD workflow requires a status file to understand your project context.

Please run `workflow-init` first to:

- Define your project type and level
- Map out your workflow journey
- Create the status file

Run: `workflow-init`

After setup, return here to create your PRD.
</output>
<action>Exit workflow - cannot proceed without status file</action>
</check>

<check if="status_exists == true">
  <action>Store {{status_file_path}} for later updates</action>

  <check if="project_level < 2">
    <output>**Incorrect Workflow for Level {{project_level}}**

PRD is for Level 2-4 projects. Level 0-1 should use tech-spec directly.

**Correct workflow:** `tech-spec` (Architect agent)
</output>
<action>Exit and redirect to tech-spec</action>
</check>

  <check if="project_type == game">
    <output>**Incorrect Workflow for Game Projects**

Game projects should use GDD workflow instead of PRD.

**Correct workflow:** `gdd` (PM agent)
</output>
<action>Exit and redirect to gdd</action>
</check>
</check>
</step>

<step n="0.5" goal="Validate workflow sequencing">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: validate</param>
  <param>calling_workflow: prd</param>
</invoke-workflow>

<check if="warning != ''">
  <output>{{warning}}</output>
  <ask>Continue with PRD anyway? (y/n)</ask>
  <check if="n">
    <output>{{suggestion}}</output>
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="1" goal="Initialize PRD context">

<action>Use {{project_level}} from status data</action>
<action>Check for existing PRD.md in {output_folder}</action>

<check if="PRD.md exists">
  <ask>Found existing PRD.md. Would you like to:
1. Continue where you left off
2. Modify existing sections
3. Start fresh (will archive existing file)
  </ask>
  <action if="option 1">Load existing PRD and skip to first incomplete section</action>
  <action if="option 2">Load PRD and ask which section to modify</action>
  <action if="option 3">Archive existing PRD and start fresh</action>
</check>

<action>Load PRD template: {prd_template}</action>
<action>Load epics template: {epics_template}</action>

<ask>Do you have a Product Brief? (Strongly recommended for Level 3-4, helpful for Level 2)</ask>

<check if="yes">
  <action>Load and review product brief: {output_folder}/product-brief.md</action>
  <action>Extract key elements: problem statement, target users, success metrics, MVP scope, constraints</action>
</check>

<check if="no and level >= 3">
  <warning>Product Brief is strongly recommended for Level 3-4 projects. Consider running the product-brief workflow first.</warning>
  <ask>Continue without Product Brief? (y/n)</ask>
  <action if="no">Exit to allow Product Brief creation</action>
</check>

</step>

<step n="2" goal="Goals and Background Context">

**Goals** - What success looks like for this project

<check if="product brief exists">
  <action>Review goals from product brief and refine for PRD context</action>
</check>

<check if="no product brief">
  <action>Gather goals through discussion with user, use probing questions and converse until you are ready to propose that you have enough information to proceed</action>
</check>

Create a bullet list of single-line desired outcomes that capture user and project goals.

**Scale guidance:**

- Level 2: 2-3 core goals
- Level 3: 3-5 strategic goals
- Level 4: 5-7 comprehensive goals

<template-output>goals</template-output>

**Background Context** - Why this matters now

<check if="product brief exists">
  <action>Summarize key context from brief without redundancy</action>
</check>

<check if="no product brief">
  <action>Gather context through discussion</action>
</check>

Write 1-2 paragraphs covering:

- What problem this solves and why
- Current landscape or need
- Key insights from discovery/brief (if available)

<template-output>background_context</template-output>

</step>

<step n="3" goal="Requirements - Functional and Non-Functional">

**Functional Requirements** - What the system must do

Draft functional requirements as numbered items with FR prefix.

**Scale guidance:**

- Level 2: 8-15 FRs (focused MVP set)
- Level 3: 12-25 FRs (comprehensive product)
- Level 4: 20-35 FRs (enterprise platform)

**Format:**

- FR001: [Clear capability statement]
- FR002: [Another capability]

**Focus on:**

- User-facing capabilities
- Core system behaviors
- Integration requirements
- Data management needs

Group related requirements logically.

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

<template-output>functional_requirements</template-output>

**Non-Functional Requirements** - How the system must perform

Draft non-functional requirements with NFR prefix.

**Scale guidance:**

- Level 2: 1-3 NFRs (critical MVP only)
- Level 3: 2-5 NFRs (production quality)
- Level 4: 3-7+ NFRs (enterprise grade)

<template-output>non_functional_requirements</template-output>

</step>

<step n="4" goal="User Journeys - scale-adaptive" optional="level == 2">

**Journey Guidelines (scale-adaptive):**

- **Level 2:** 1 simple journey (primary use case happy path)
- **Level 3:** 2-3 detailed journeys (complete flows with decision points)
- **Level 4:** 3-5 comprehensive journeys (all personas and edge cases)

<check if="level == 2">
  <ask>Would you like to document a user journey for the primary use case? (recommended but optional)</ask>
  <check if="yes">
    Create 1 simple journey showing the happy path.
  </check>
</check>

<check if="level >= 3">
  Map complete user flows with decision points, alternatives, and edge cases.
</check>

<template-output>user_journeys</template-output>

<check if="level >= 3">
  <invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
</check>

</step>

<step n="5" goal="UX and UI Vision - high-level overview" optional="level == 2 and minimal UI">

**Purpose:** Capture essential UX/UI information needed for epic and story planning. A dedicated UX workflow will provide deeper design detail later.

<check if="level == 2 and minimal UI">
  <action>For backend-heavy or minimal UI projects, keep this section very brief or skip</action>
</check>

**Gather high-level UX/UI information:**

1. **UX Principles** (2-4 key principles that guide design decisions)
   - What core experience qualities matter most?
   - Any critical accessibility or usability requirements?

2. **Platform & Screens**
   - Target platforms (web, mobile, desktop)
   - Core screens/views users will interact with
   - Key interaction patterns or navigation approach

3. **Design Constraints**
   - Existing design systems or brand guidelines
   - Technical UI constraints (browser support, etc.)

<note>Keep responses high-level. Detailed UX planning happens in the UX workflow after PRD completion.</note>

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

<template-output>ux_principles</template-output>
<template-output>ui_design_goals</template-output>

</step>

<step n="6" goal="Epic List - High-level delivery sequence">

**Epic Structure** - Major delivery milestones

Create high-level epic list showing logical delivery sequence.

**Epic Sequencing Rules:**

1. **Epic 1 MUST establish foundation**
   - Project infrastructure (repo, CI/CD, core setup)
   - Initial deployable functionality
   - Development workflow established
   - Exception: If adding to existing app, Epic 1 can be first major feature

2. **Subsequent Epics:**
   - Each delivers significant, end-to-end, fully deployable increment
   - Build upon previous epics (no forward dependencies)
   - Represent major functional blocks
   - Prefer fewer, larger epics over fragmentation

**Scale guidance:**

- Level 2: 1-2 epics, 5-15 stories total
- Level 3: 2-5 epics, 15-40 stories total
- Level 4: 5-10 epics, 40-100+ stories total

**For each epic provide:**

- Epic number and title
- Single-sentence goal statement
- Estimated story count

**Example:**

- **Epic 1: Project Foundation & User Authentication**
- **Epic 2: Core Task Management**

<ask>Review the epic list. Does the sequence make sense? Any epics to add, remove, or resequence?</ask>
<action>Refine epic list based on feedback</action>
<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

<template-output>epic_list</template-output>

</step>

<step n="7" goal="Out of Scope - Clear boundaries and future additions">

**Out of Scope** - What we're NOT doing (now)

Document what is explicitly excluded from this project:

- Features/capabilities deferred to future phases
- Adjacent problems not being solved
- Integrations or platforms not supported
- Scope boundaries that need clarification

This helps prevent scope creep and sets clear expectations.

<template-output>out_of_scope</template-output>

</step>

<step n="8" goal="Finalize PRD.md">

<action>Review all PRD sections for completeness and consistency</action>
<action>Ensure all placeholders are filled</action>
<action>Save final PRD.md to {default_output_file}</action>

**PRD.md is complete!** Strategic document ready.

Now we'll create the tactical implementation guide in epics.md.

</step>

<step n="9" goal="Epic Details - Full story breakdown in epics.md">

<critical>Now we create epics.md - the tactical implementation roadmap</critical>
<critical>This is a SEPARATE FILE from PRD.md</critical>

<action>Load epics template: {epics_template}</action>
<action>Initialize epics.md with project metadata</action>

For each epic from the epic list, expand with full story details:

**Epic Expansion Process:**

1. **Expanded Goal** (2-3 sentences)
   - Describe the epic's objective and value delivery
   - Explain how it builds on previous work

2. **Story Breakdown**

   **Critical Story Requirements:**
   - **Vertical slices** - Each story delivers complete, testable functionality
   - **Sequential** - Stories must be logically ordered within epic
   - **No forward dependencies** - No story depends on work from a later story/epic
   - **AI-agent sized** - Completable in single focused session (2-4 hours)
   - **Value-focused** - Minimize pure enabler stories; integrate technical work into value delivery

   **Story Format:**

   ```
   **Story [EPIC.N]: [Story Title]**

   As a [user type],
   I want [goal/desire],
   So that [benefit/value].

   **Acceptance Criteria:**
   1. [Specific testable criterion]
   2. [Another specific criterion]
   3. [etc.]

   **Prerequisites:** [Any dependencies on previous stories]
   ```

3. **Story Sequencing Within Epic:**
   - Start with foundational/setup work if needed
   - Build progressively toward epic goal
   - Each story should leave system in working state
   - Final stories complete the epic's value delivery

**Process each epic:**

<repeat for-each="epic in epic_list">

<ask>Ready to break down {{epic_title}}? (y/n)</ask>

<action>Discuss epic scope and story ideas with user</action>
<action>Draft story list ensuring vertical slices and proper sequencing</action>
<action>For each story, write user story format and acceptance criteria</action>
<action>Verify no forward dependencies exist</action>

<template-output file="epics.md">{{epic_title}}\_details</template-output>

<ask>Review {{epic_title}} stories. Any adjustments needed?</ask>

<action if="yes">Refine stories based on feedback</action>

</repeat>

<action>Save complete epics.md to {epics_output_file}</action>

**Epic Details complete!** Implementation roadmap ready.

</step>

<step n="10" goal="Update status and complete">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: complete_workflow</param>
  <param>workflow_name: prd</param>
  <param>populate_stories_from: {epics_output_file}</param>
</invoke-workflow>

<check if="success == true">
  <output>Status updated! Next: {{next_workflow}} ({{next_agent}} agent)</output>
  <output>Loaded {{total_stories}} stories from epics.</output>
</check>

<output>**✅ PRD Workflow Complete, {user_name}!**

**Deliverables Created:**

1. ✅ bmm-PRD.md - Strategic product requirements document
2. ✅ bmm-epics.md - Tactical implementation roadmap with story breakdown

**Next Steps:**

{{#if project_level == 2}}

- Review PRD and epics with stakeholders
- **Next:** Run `tech-spec` for lightweight technical planning
- Then proceed to implementation
  {{/if}}

{{#if project_level >= 3}}

- Review PRD and epics with stakeholders
- **Next:** Run `create-architecture` for full technical design
- Then proceed to implementation
  {{/if}}

Would you like to:

1. Review/refine any section
2. Proceed to next phase
3. Exit and review documents
   </output>

</step>

</workflow>
