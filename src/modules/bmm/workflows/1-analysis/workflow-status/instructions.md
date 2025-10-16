# Workflow Status - Master Router and Status Tracker

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/1-analysis/workflow-status/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<critical>This is the UNIVERSAL ENTRY POINT for all BMM workflows</critical>
<critical>Can be invoked by bmad-master, analyst, or pm agents</critical>
<critical>Checks for existing workflow status and suggests next actions</critical>
<critical>If no status exists, helps user plan their workflow approach</critical>

<step n="1" goal="Check for existing workflow status file">

<action>Search {output_folder}/ for files matching pattern: bmm-workflow-status\*.md</action>
<action>Use glob or list_files to find all matching files</action>

<check if="files found">
  <action>Find the most recent file (by date in filename: bmm-workflow-status.md)</action>
  <action>Set status_file_found = true</action>
  <action>Set status_file_path = most recent file path</action>
  <action>Go to Step 2 (Read existing status)</action>
</check>

<check if="no files found">
  <action>Set status_file_found = false</action>
  <action>Go to Step 3 (Initial workflow planning)</action>
</check>

</step>

<step n="2" goal="Read and analyze existing workflow status" if="status_file_found == true">

<action>Read {status_file_path}</action>

<action>Extract key information:</action>

**Project Context:**

- project_name: From "Project:" field
- start_date: From "Created:" field
- last_updated: From "Last Updated:" field

**Current State:**

- current_phase: From "Current Phase:" field (1-Analysis, 2-Plan, 3-Solutioning, 4-Implementation)
- current_workflow: From "Current Workflow:" field
- progress_percentage: From "Overall Progress:" field
- project_level: From "Project Level:" field (0, 1, 2, 3, or 4)
- project_type: From "Project Type:" field
- field_type: From "Greenfield/Brownfield:" field

**Phase Completion:**

- phase_1_complete: Check if "1-Analysis" checkbox is checked
- phase_2_complete: Check if "2-Plan" checkbox is checked
- phase_3_complete: Check if "3-Solutioning" checkbox is checked
- phase_4_complete: Check if "4-Implementation" checkbox is checked

**Implementation Progress (if Phase 4):**

- Read "### Implementation Progress (Phase 4 Only)" section
- Extract TODO story (if exists)
- Extract IN PROGRESS story (if exists)
- Extract BACKLOG count
- Extract DONE count

**Next Action:**

- next_action: From "What to do next:" field
- next_command: From "Command to run:" field
- next_agent: From "Agent to load:" field

<action>Analyze the current state to determine recommendation</action>

</step>

<step n="2.5" goal="Display current workflow status and suggest next action" if="status_file_found == true">

<action>Display comprehensive status summary</action>

**📊 Current Workflow Status**

**Project:** {{project_name}}
**Started:** {{start_date}}
**Last Updated:** {{last_updated}}

**Current Phase:** {{current_phase}} ({{progress_percentage}}% complete)
**Current Workflow:** {{current_workflow}}

**Phase Completion:**

- [{{phase_1_complete ? 'x' : ' '}}] Phase 1: Analysis
- [{{phase_2_complete ? 'x' : ' '}}] Phase 2: Planning
- [{{phase_3_complete ? 'x' : ' '}}] Phase 3: Solutioning ({{project_level < 3 ? 'skipped for Level ' + project_level : 'required'}})
- [{{phase_4_complete ? 'x' : ' '}}] Phase 4: Implementation

**Project Details:**

- **Level:** {{project_level}} ({{get_level_description(project_level)}})
- **Type:** {{project_type}}
- **Context:** {{field_type}}

{{#if current_phase == '4-Implementation'}}
**Implementation Progress:**

- **BACKLOG:** {{backlog_count}} stories
- **TODO:** {{todo_story_id}} ({{todo_story_status}})
- **IN PROGRESS:** {{current_story_id}} ({{current_story_status}})
- **DONE:** {{done_count}} stories ({{done_points}} points)
  {{/if}}

---

**🎯 Recommended Next Action:**

{{next_action}}

**Command:** {{next_command}}
**Agent:** {{next_agent}}

<ask>Would you like to:

1. **Proceed with recommended action** ({{next_command}})
2. **View detailed status** (show full status file)
3. **Change workflow** (modify current workflow or start new phase)
4. **Display agent menu** (see all available options)
5. **Exit** (return to agent)

Select option (1-5):</ask>

<check if='option == "1"'>
  <action>Suggest loading the recommended agent and running the command</action>
  <output>**To proceed:**

Load agent: `{{next_agent}}`
Run command: `{{next_command}}`

Or tell me: "load {{next_agent}} and {{next_command}}"
</output>
</check>

<check if='option == "2"'>
  <action>Display full status file contents</action>
  <action>Return to menu</action>
</check>

<check if='option == "3"'>
  <action>Go to Step 4 (Change workflow)</action>
</check>

<check if='option == "4"'>
  <action>Go to Step 5 (Display agent menu)</action>
</check>

<check if='option == "5"'>
  <action>Exit workflow</action>
</check>

</step>

<step n="3" goal="Initial workflow planning - no status file exists" if="status_file_found == false">

<action>Display welcome message in {communication_language}</action>

**🚀 Welcome to BMad Method Workflows, {user_name}!**

No workflow status file found. Let's plan your complete workflow journey.

<critical>This step will map out your ENTIRE workflow before executing anything</critical>
<critical>Goal: Document planned phases, current step, and next step in status file</critical>

<ask>**Step 1: Project Context**

**Is this a new or existing codebase?**
a. **Greenfield** - Starting from scratch
b. **Brownfield** - Adding to existing codebase

Your choice (a/b):</ask>

<action>Capture field_type = "greenfield" or "brownfield"</action>

<check if='field_type == "brownfield"'>
  <ask>**Step 2: Brownfield Documentation Status**

Do you have:

- Architecture documentation?
- Code structure overview?
- API documentation?
- Clear understanding of existing patterns?

Options:
a. **Yes** - I have good documentation
b. **No** - Codebase is undocumented or poorly documented
c. **Partial** - Some docs exist but incomplete

Your choice (a/b/c):</ask>

<action>Capture brownfield_docs_status</action>

  <check if='brownfield_docs_status == "b" OR brownfield_docs_status == "c"'>
    <output>**⚠️ Documentation Needed**

For accurate planning, brownfield projects benefit from codebase documentation.
We'll add `document-project` to your planned workflow.
</output>
<action>Set needs_documentation = true</action>
</check>

  <check if='brownfield_docs_status == "a"'>
    <action>Set needs_documentation = false</action>
  </check>
</check>

<check if='field_type == "greenfield"'>
  <action>Set needs_documentation = false</action>
</check>

<ask>**Step 3: Project Type**

What type of project are you building?

1. **Game** - Video games for PC, console, mobile, or web
2. **Web Application** - Websites, web apps, SPAs
3. **Mobile Application** - iOS, Android apps
4. **Desktop Application** - Windows, macOS, Linux apps
5. **Backend/API Service** - Backend services, APIs, microservices
6. **Library/SDK** - Reusable libraries, packages, SDKs
7. **CLI Tool** - Command-line tools and utilities
8. **Embedded System** - IoT, firmware, embedded devices
9. **Data/ML/Analytics** - Data pipelines, ML projects, analytics
10. **Browser Extension** - Chrome, Firefox extensions
11. **Infrastructure/DevOps** - Terraform, K8s operators, CI/CD
12. **Other** - Describe your project type

Your choice (1-12):</ask>

<action>Capture project_type_choice</action>

<action>Map choice to project_type_id using project-types.csv:</action>

- 1 → game
- 2 → web
- 3 → mobile
- 4 → desktop
- 5 → backend
- 6 → library
- 7 → cli
- 8 → embedded
- 9 → data
- 10 → extension
- 11 → infra
- 12 → custom (capture description)

<action>Set project_type = mapped project_type_id</action>

<ask>**Step 4: User Interface Components**

Does your project involve user-facing UI components?

a. **Yes** - Project has user interface elements (web pages, mobile screens, desktop UI, game UI)
b. **No** - Backend-only, API, CLI, or no visual interface

Your choice (a/b):</ask>

<action>Capture has_ui_components</action>

<check if='has_ui_components == "a"'>
  <action>Set needs_ux_workflow = true</action>
  <output>**✅ UX Workflow Detected**

Since your project has UI components, we'll include the UX specification workflow in Phase 2.
This ensures proper UX/UI design happens between PRD and architecture/implementation.
</output>
</check>

<check if='has_ui_components == "b"'>
  <action>Set needs_ux_workflow = false</action>
</check>

<output>**Step 5: Understanding Your Workflow**

Before we plan your workflow, let's determine the scope and complexity of your project.

The BMad Method uses 5 project levels (0-4) that determine which phases you'll need:

- **Level 0:** Single atomic change (1 story) - Phases 2 → 4
- **Level 1:** Small feature (2-3 stories, 1 epic) - Phases 2 → 4
- **Level 2:** Medium project (multiple epics) - Phases 2 → 4
- **Level 3:** Complex system (subsystems, integrations) - Phases 2 → 3 → 4
- **Level 4:** Enterprise scale (multiple products) - Phases 2 → 3 → 4

**Optional Phase 1 (Analysis):** Brainstorming, research, and brief creation can precede any level.
</output>

<ask>**Step 6: Project Scope Assessment**

Do you already know your project's approximate size/scope?

a. **Yes** - I can describe the general scope
b. **No** - Not sure yet, need help determining it
c. **Want analysis first** - Do brainstorming/research before deciding

Your choice (a/b/c):</ask>

<action>Capture scope_knowledge</action>

<check if='scope_knowledge == "a"'>
  <ask>**Based on the descriptions above, what level best describes your project?**

0. Single atomic change (bug fix, tiny feature)
1. Small coherent feature (2-3 stories)
2. Medium project (multiple features/epics)
3. Complex system (subsystems, architectural decisions)
4. Enterprise scale (multiple products/systems)

Your estimated level (0-4):</ask>

<action>Capture estimated_level</action>
<action>Set level_known = true</action>
</check>

<check if='scope_knowledge == "b" OR scope_knowledge == "c"'>
  <output>**Level determination deferred**

{{#if scope_knowledge == "b"}}
No problem! The `plan-project` workflow will help you determine the project level through guided questions.
{{/if}}

{{#if scope_knowledge == "c"}}
Great! Analysis workflows will help clarify scope before determining the level.
{{/if}}

We'll determine your project level during Phase 2 (Planning).
</output>
<action>Set level_known = false</action>
<action>Set estimated_level = "TBD"</action>
</check>

<ask>**Step 7: Choose Your Starting Point**

Now let's determine where you want to begin:

**Option A: Full Analysis Phase First**

- Brainstorming (explore ideas, validate concepts)
- Research (market, technical, competitive analysis)
- Product/Game Brief (strategic foundation)
  → Best for: New ideas, uncertain requirements, need validation

**Option B: Skip to Planning**

- You know what to build
- Jump to PRD/GDD/Tech-Spec generation
  → Best for: Clear requirements, existing ideas

**Option C: Just Show Menu**

- Create status file with planned workflow
- I'll manually choose which workflow to run first
  → Best for: Experienced users, custom paths

Your choice (A/B/C):</ask>

<action>Capture starting_point</action>

<check if='starting_point == "A"'>
  <ask>**Full Analysis - Choose your first workflow:**

1. **brainstorm-project** (Analyst) - Explore software solution ideas
2. **brainstorm-game** (Game Designer) - Game concept ideation
3. **research** (Analyst) - Market/technical research
4. **product-brief** (Analyst) - Strategic product foundation
5. **game-brief** (Game Designer) - Game design foundation

Which workflow? (1-5):</ask>

<action>Capture first_workflow</action>
<action>Set include_analysis = true</action>
</check>

<check if='starting_point == "B"'>
  <action>Set include_analysis = false</action>
  <action>Set first_workflow = "plan-project"</action>
</check>

<check if='starting_point == "C"'>
  <action>Set include_analysis = false</action>
  <action>Set first_workflow = "user-choice"</action>
</check>

<action>Now build the complete planned workflow</action>

<output>**🗺️ Your Planned Workflow**

Based on your responses, here's your complete workflow journey:
</output>

<action>Build planned_workflow array with all phases in order:</action>

<check if='needs_documentation == true'>
  <action>Add to planned_workflow:</action>
  - Phase: "1-Analysis"
  - Step: "document-project"
  - Agent: "Analyst"
  - Description: "Generate brownfield codebase documentation"
  - Status: "Planned"
</check>

<check if='include_analysis == true'>
  <action>Add analysis workflows to planned_workflow based on first_workflow choice</action>

{{#if first_workflow == "brainstorm-project"}} - Phase: "1-Analysis", Step: "brainstorm-project", Agent: "Analyst", Status: "Planned" - Phase: "1-Analysis", Step: "research (optional)", Agent: "Analyst", Status: "Optional" - Phase: "1-Analysis", Step: "product-brief", Agent: "Analyst", Status: "Planned"
{{/if}}

{{#if first_workflow == "brainstorm-game"}} - Phase: "1-Analysis", Step: "brainstorm-game", Agent: "Game Designer", Status: "Planned" - Phase: "1-Analysis", Step: "research (optional)", Agent: "Analyst", Status: "Optional" - Phase: "1-Analysis", Step: "game-brief", Agent: "Game Designer", Status: "Planned"
{{/if}}

{{#if first_workflow == "research"}} - Phase: "1-Analysis", Step: "research", Agent: "Analyst", Status: "Planned" - Phase: "1-Analysis", Step: "product-brief or game-brief", Agent: "Analyst/Game Designer", Status: "Planned"
{{/if}}

{{#if first_workflow == "product-brief"}} - Phase: "1-Analysis", Step: "product-brief", Agent: "Analyst", Status: "Planned"
{{/if}}

{{#if first_workflow == "game-brief"}} - Phase: "1-Analysis", Step: "game-brief", Agent: "Game Designer", Status: "Planned"
{{/if}}
</check>

<action>Always add Phase 2 (required for all levels) - route based on project type and level</action>

<check if='project_type == "game"'>
  <action>Add game planning workflow</action>
  - Phase: "2-Plan"
  - Step: "gdd"
  - Agent: "PM"
  - Description: "Create Game Design Document"
  - Status: "Planned"
</check>

<check if='project_type != "game"'>
  <check if='level_known == true AND estimated_level <= 1'>
    <action>Add tech-spec workflow (Levels 0-1)</action>
    - Phase: "2-Plan"
    - Step: "tech-spec"
    - Agent: "Architect"
    - Description: "Create technical specification and stories"
    - Status: "Planned"
  </check>

  <check if='level_known == true AND estimated_level >= 2'>
    <action>Add PRD workflow (Levels 2-4)</action>
    - Phase: "2-Plan"
    - Step: "prd"
    - Agent: "PM"
    - Description: "Create Product Requirements Document and epics"
    - Status: "Planned"
  </check>

  <check if='level_known == false OR estimated_level == "TBD"'>
    <action>Add conditional planning note</action>
    - Phase: "2-Plan"
    - Step: "TBD - Level 0-1 → tech-spec, Level 2-4 → prd"
    - Agent: "PM or Architect"
    - Description: "Workflow determined after level assessment"
    - Status: "Conditional"
  </check>
</check>

<check if='needs_ux_workflow == true'>
  <action>Add UX workflow to Phase 2 planning (runs after PRD, before Phase 3)</action>
  - Phase: "2-Plan"
  - Step: "ux-spec"
  - Agent: "PM"
  - Description: "UX/UI specification (user flows, wireframes, components)"
  - Status: "Planned"
  - Note: "Required for projects with UI components"
</check>

<check if='level_known == true AND estimated_level >= 3'>
  <action>Add Phase 3 (required for Level 3-4)</action>
  - Phase: "3-Solutioning"
  - Step: "solution-architecture"
  - Agent: "Architect"
  - Description: "Design overall architecture"
  - Status: "Planned"

- Phase: "3-Solutioning"
- Step: "tech-spec (per epic, JIT)"
- Agent: "Architect"
- Description: "Epic-specific technical specs"
- Status: "Planned"
  </check>

<check if='level_known == false OR estimated_level == "TBD"'>
  <action>Add conditional Phase 3 note</action>
  - Phase: "3-Solutioning"
  - Step: "TBD - depends on level from Phase 2"
  - Agent: "Architect"
  - Description: "Required if Level 3-4, skipped if Level 0-2"
  - Status: "Conditional"
</check>

<action>Always add Phase 4 (implementation)</action>

- Phase: "4-Implementation"
- Step: "create-story (iterative)"
- Agent: "SM"
- Description: "Draft stories from backlog"
- Status: "Planned"

- Phase: "4-Implementation"
- Step: "story-ready"
- Agent: "SM"
- Description: "Approve story for dev"
- Status: "Planned"

- Phase: "4-Implementation"
- Step: "story-context"
- Agent: "SM"
- Description: "Generate context XML"
- Status: "Planned"

- Phase: "4-Implementation"
- Step: "dev-story (iterative)"
- Agent: "DEV"
- Description: "Implement stories"
- Status: "Planned"

- Phase: "4-Implementation"
- Step: "story-approved"
- Agent: "DEV"
- Description: "Mark complete, advance queue"
- Status: "Planned"

<action>Display the complete planned workflow</action>

<output>**📋 Your Complete Planned Workflow:**

{{#each planned_workflow}}
**{{phase}}** - {{step}}

- Agent: {{agent}}
- Description: {{description}}
- Status: {{status}}

{{/each}}

---

**Current Step:** Workflow Definition Phase (this workflow)
**Next Step:** {{planned_workflow[0].step}} ({{planned_workflow[0].agent}} agent)
</output>

<ask>**Ready to create your workflow status file?**

This will create: `bmm-workflow-status.md`

The status file will document:

- Your complete planned workflow (phases and steps)
- Current phase: "Workflow Definition"
- Next action: {{planned_workflow[0].step}}

Create status file? (y/n)</ask>

<check if='confirm == "y"'>
  <action>Create bmm-workflow-status.md file</action>
  <action>Set current_phase = "Workflow Definition"</action>
  <action>Set next_action = planned_workflow[0].step</action>
  <action>Set next_agent = planned_workflow[0].agent</action>
  <action>Include complete planned_workflow in status file</action>

<output>**✅ Status file created, {user_name}!**

File: `bmm-workflow-status.md`

**To proceed with your first step:**

{{#if needs_documentation == true AND planned_workflow[0].step == "document-project"}}
Load Analyst: `bmad analyst document-project`

After documentation is complete, return to check status: `bmad analyst workflow-status`
{{/if}}

{{#if planned_workflow[0].step != "document-project" AND planned_workflow[0].step != "user-choice"}}
{{#if planned_workflow[0].step == "gdd"}}
Load PM: `bmad pm gdd`
{{else if planned_workflow[0].step == "tech-spec"}}
Load Architect: `bmad architect tech-spec`
{{else if planned_workflow[0].step == "prd"}}
Load PM: `bmad pm prd`
{{else}}
Load {{planned_workflow[0].agent}}: `bmad {{lowercase planned_workflow[0].agent}} {{planned_workflow[0].step}}`
{{/if}}
{{/if}}

{{#if planned_workflow[0].step == "user-choice"}}
Your status file is ready! Run `workflow-status` anytime to see recommendations.

Choose any workflow from the menu to begin.
{{/if}}

You can always check your status with: `workflow-status`
</output>
</check>

<check if='confirm == "n"'>
  <action>Go to Step 5 (Display agent menu)</action>
</check>

</step>

<step n="4" goal="Change workflow or start new phase" optional="true">

<ask>**Change Workflow Options:**

1. **Start new workflow** (will archive current status, create new dated file)
2. **Jump to different phase** (manual phase override)
3. **Modify current workflow** (change current_workflow field)
4. **View phase options** (see what's available for current level)
5. **Cancel** (return to status display)

Your choice (1-5):</ask>

<action>Handle workflow change based on choice</action>

<check if='choice == "1"'>
  <ask>**Start New Workflow**

This will:

- Archive current status: `bmm-workflow-status.md` → `archive/`
- Create new status: `bmm-workflow-status.md`
- Start fresh assessment

Continue? (y/n)</ask>

  <check if="confirm == 'y'">
    <output>**To start new workflow:**

Run: `bmad analyst workflow-status`

This will guide you through fresh workflow assessment and create a new status file.
</output>
</check>
</check>

<check if='choice == "2"'>
  <ask>**Jump to Phase:**

Current phase: {{current_phase}}

Available phases:

1. Phase 1: Analysis
2. Phase 2: Planning
3. Phase 3: Solutioning ({{project_level >= 3 ? 'required for your level' : 'skipped for Level ' + project_level}})
4. Phase 4: Implementation

Which phase? (1-4)</ask>

<action>Provide guidance for jumping to selected phase</action>
</check>

</step>

<step n="5" goal="Display agent menu">

<action>Display comprehensive agent menu based on current context</action>

**📋 BMad Method Agent Menu**

{{#if status_file_found}}
**Current Phase:** {{current_phase}}
{{/if}}

**Available Workflows by Phase:**

**Phase 1: Analysis (Optional)**

- `brainstorm-project` - Software solution exploration
- `brainstorm-game` - Game concept ideation
- `research` - Market/technical research
- `product-brief` - Strategic product foundation
- `game-brief` - Game design foundation

**Phase 2: Planning (Required)**

- `prd` - Product Requirements Document (Level 2-4 software projects)
- `tech-spec` - Technical specification (Level 0-1 software projects)
- `gdd` - Game Design Document (game projects)
- `ux-spec` - UX/UI specification (for projects with UI components)

**Phase 3: Solutioning (Level 3-4 Only)**

- `solution-architecture` - Overall architecture design
- `tech-spec` - Epic-specific technical specs (JIT)

**Phase 4: Implementation (Iterative)**

- `create-story` - Draft story from TODO
- `story-ready` - Approve story for development
- `story-context` - Generate context XML
- `dev-story` - Implement story
- `story-approved` - Mark story done
- `review-story` - Quality validation
- `correct-course` - Handle issues
- `retrospective` - Epic learnings

**Utility Workflows:**

- `workflow-status` - Check status and get recommendations (you are here!)

{{#if status_file_found}}

**🎯 Recommended for Your Current Phase ({{current_phase}}):**

{{#if current_phase == '1-Analysis'}}
Continue analysis or move to Phase 2 Planning (prd/tech-spec/gdd based on your project)
{{/if}}

{{#if current_phase == '2-Plan'}}
{{#if project_level < 2}}
Ready for Phase 4! Run `create-story` (SM agent)
{{else if project_level == 2}}
Run `tech-spec` workflow for lightweight technical planning, then Phase 4
{{else}}
Ready for Phase 3! Run `solution-architecture` (Architect agent)
{{/if}}
{{/if}}

{{#if current_phase == '3-Solutioning'}}
Continue with tech-specs or move to Phase 4 `create-story`
{{/if}}

{{#if current_phase == '4-Implementation'}}
**Current Story:** {{todo_story_id || current_story_id || 'Check status file'}}
**Next Action:** {{next_command}}
{{/if}}

{{/if}}

<ask>Would you like to:

1. Run a specific workflow (tell me which one)
2. Return to status display
3. Exit

Your choice:</ask>

</step>

</workflow>
